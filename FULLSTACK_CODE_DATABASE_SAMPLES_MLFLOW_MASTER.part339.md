---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 339
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 339 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: classifier.py]---
Location: mlflow-master/mlflow/models/evaluation/evaluators/classifier.py

```python
import logging
import math
from contextlib import contextmanager
from typing import Any, Callable, NamedTuple, Optional

import numpy as np
import pandas as pd
from sklearn import metrics as sk_metrics

import mlflow
from mlflow import MlflowException
from mlflow.environment_variables import _MLFLOW_EVALUATE_SUPPRESS_CLASSIFICATION_ERRORS
from mlflow.models.evaluation.artifacts import CsvEvaluationArtifact
from mlflow.models.evaluation.base import EvaluationMetric, EvaluationResult, _ModelType
from mlflow.models.evaluation.default_evaluator import (
    BuiltInEvaluator,
    _extract_raw_model,
    _get_aggregate_metrics_values,
)
from mlflow.models.utils import plot_lines

_logger = logging.getLogger(__name__)


class _Curve(NamedTuple):
    plot_fn: Callable[..., Any]
    plot_fn_args: dict[str, Any]
    auc: float


class ClassifierEvaluator(BuiltInEvaluator):
    """
    A built-in evaluator for classifier models.
    """

    name = "classifier"

    @classmethod
    def can_evaluate(cls, *, model_type, evaluator_config, **kwargs):
        # TODO: Also the model needs to be pyfunc model, not function or endpoint URI
        return model_type == _ModelType.CLASSIFIER

    def _evaluate(
        self,
        model: Optional["mlflow.pyfunc.PyFuncModel"],
        extra_metrics: list[EvaluationMetric],
        custom_artifacts=None,
        **kwargs,
    ) -> EvaluationResult | None:
        # Get classification config
        self.y_true = self.dataset.labels_data
        self.label_list = self.evaluator_config.get("label_list")
        self.pos_label = self.evaluator_config.get("pos_label")
        self.sample_weights = self.evaluator_config.get("sample_weights")
        if self.pos_label and self.label_list and self.pos_label not in self.label_list:
            raise MlflowException.invalid_parameter_value(
                f"'pos_label' {self.pos_label} must exist in 'label_list' {self.label_list}."
            )

        # Check if the model_type is consistent with ground truth labels
        inferred_model_type = _infer_model_type_by_labels(self.y_true)
        if _ModelType.CLASSIFIER != inferred_model_type:
            _logger.warning(
                f"According to the evaluation dataset label values, the model type looks like "
                f"{inferred_model_type}, but you specified model type 'classifier'. Please "
                f"verify that you set the `model_type` and `dataset` arguments correctly."
            )

        # Run model prediction
        input_df = self.X.copy_to_avoid_mutation()
        self.y_pred, self.y_probs = self._generate_model_predictions(model, input_df)

        self._validate_label_list()

        self._compute_builtin_metrics(model)
        self.evaluate_metrics(extra_metrics, prediction=self.y_pred, target=self.y_true)
        self.evaluate_and_log_custom_artifacts(
            custom_artifacts, prediction=self.y_pred, target=self.y_true
        )

        # Log metrics and artifacts
        self.log_metrics()
        self.log_eval_table(self.y_pred)

        if len(self.label_list) == 2:
            self._log_binary_classifier_artifacts()
        else:
            self._log_multiclass_classifier_artifacts()
        self._log_confusion_matrix()

        return EvaluationResult(
            metrics=self.aggregate_metrics, artifacts=self.artifacts, run_id=self.run_id
        )

    def _generate_model_predictions(self, model, input_df):
        predict_fn, predict_proba_fn = _extract_predict_fn_and_prodict_proba_fn(model)
        # Classifier model is guaranteed to output single column of predictions
        y_pred = self.dataset.predictions_data if model is None else predict_fn(input_df)

        # Predict class probabilities if the model supports it
        y_probs = predict_proba_fn(input_df) if predict_proba_fn is not None else None
        return y_pred, y_probs

    def _validate_label_list(self):
        if self.label_list is None:
            # If label list is not specified, infer label list from model output
            self.label_list = np.unique(np.concatenate([self.y_true, self.y_pred]))
        else:
            # np.where only works for numpy array, not list
            self.label_list = np.array(self.label_list)

        if len(self.label_list) < 2:
            raise MlflowException(
                "Evaluation dataset for classification must contain at least two unique "
                f"labels, but only {len(self.label_list)} unique labels were found.",
                "Please provide a 'label_list' parameter in 'evaluator_config' with all "
                "possible classes, e.g., evaluator_config={{'label_list': [0, 1]}}.",
            )

        # sort label_list ASC, for binary classification it makes sure the last one is pos label
        self.label_list.sort()

        if len(self.label_list) == 2:
            if self.pos_label is None:
                self.pos_label = self.label_list[-1]
            else:
                if self.pos_label in self.label_list:
                    self.label_list = np.delete(
                        self.label_list, np.where(self.label_list == self.pos_label)
                    )
                self.label_list = np.append(self.label_list, self.pos_label)
            with _suppress_class_imbalance_errors(IndexError, log_warning=False):
                _logger.info(
                    "The evaluation dataset is inferred as binary dataset, positive label is "
                    f"{self.label_list[1]}, negative label is {self.label_list[0]}."
                )
        else:
            _logger.info(
                "The evaluation dataset is inferred as multiclass dataset, number of classes "
                f"is inferred as {len(self.label_list)}. If this is incorrect, please specify the "
                "`label_list` parameter in `evaluator_config`."
            )

    def _compute_builtin_metrics(self, model):
        self._evaluate_sklearn_model_score_if_scorable(model, self.y_true, self.sample_weights)

        if len(self.label_list) == 2:
            metrics = _get_binary_classifier_metrics(
                y_true=self.y_true,
                y_pred=self.y_pred,
                y_proba=self.y_probs,
                labels=self.label_list,
                pos_label=self.pos_label,
                sample_weights=self.sample_weights,
            )
            if metrics:
                self.metrics_values.update(_get_aggregate_metrics_values(metrics))
                self._compute_roc_and_pr_curve()
        else:
            average = self.evaluator_config.get("average", "weighted")
            metrics = _get_multiclass_classifier_metrics(
                y_true=self.y_true,
                y_pred=self.y_pred,
                y_proba=self.y_probs,
                labels=self.label_list,
                average=average,
                sample_weights=self.sample_weights,
            )
            if metrics:
                self.metrics_values.update(_get_aggregate_metrics_values(metrics))

    def _compute_roc_and_pr_curve(self):
        if self.y_probs is not None:
            with _suppress_class_imbalance_errors(ValueError, log_warning=False):
                self.roc_curve = _gen_classifier_curve(
                    is_binomial=True,
                    y=self.y_true,
                    y_probs=self.y_probs[:, 1],
                    labels=self.label_list,
                    pos_label=self.pos_label,
                    curve_type="roc",
                    sample_weights=self.sample_weights,
                )

                self.metrics_values.update(
                    _get_aggregate_metrics_values({"roc_auc": self.roc_curve.auc})
                )
            with _suppress_class_imbalance_errors(ValueError, log_warning=False):
                self.pr_curve = _gen_classifier_curve(
                    is_binomial=True,
                    y=self.y_true,
                    y_probs=self.y_probs[:, 1],
                    labels=self.label_list,
                    pos_label=self.pos_label,
                    curve_type="pr",
                    sample_weights=self.sample_weights,
                )

                self.metrics_values.update(
                    _get_aggregate_metrics_values({"precision_recall_auc": self.pr_curve.auc})
                )

    def _log_pandas_df_artifact(self, pandas_df, artifact_name):
        artifact_file_name = f"{artifact_name}.csv"
        artifact_file_local_path = self.temp_dir.path(artifact_file_name)
        pandas_df.to_csv(artifact_file_local_path, index=False)
        mlflow.log_artifact(artifact_file_local_path)
        artifact = CsvEvaluationArtifact(
            uri=mlflow.get_artifact_uri(artifact_file_name),
            content=pandas_df,
        )
        artifact._load(artifact_file_local_path)
        self.artifacts[artifact_name] = artifact

    def _log_multiclass_classifier_artifacts(self):
        per_class_metrics_collection_df = _get_classifier_per_class_metrics_collection_df(
            y=self.y_true,
            y_pred=self.y_pred,
            labels=self.label_list,
            sample_weights=self.sample_weights,
        )

        log_roc_pr_curve = False
        if self.y_probs is not None:
            with _suppress_class_imbalance_errors(TypeError, log_warning=False):
                self._log_calibration_curve()

            max_classes_for_multiclass_roc_pr = self.evaluator_config.get(
                "max_classes_for_multiclass_roc_pr", 10
            )
            if len(self.label_list) <= max_classes_for_multiclass_roc_pr:
                log_roc_pr_curve = True
            else:
                _logger.warning(
                    f"The classifier num_classes > {max_classes_for_multiclass_roc_pr}, skip "
                    f"logging ROC curve and Precision-Recall curve. You can add evaluator config "
                    f"'max_classes_for_multiclass_roc_pr' to increase the threshold."
                )

        if log_roc_pr_curve:
            roc_curve = _gen_classifier_curve(
                is_binomial=False,
                y=self.y_true,
                y_probs=self.y_probs,
                labels=self.label_list,
                pos_label=self.pos_label,
                curve_type="roc",
                sample_weights=self.sample_weights,
            )

            def plot_roc_curve():
                roc_curve.plot_fn(**roc_curve.plot_fn_args)

            self._log_image_artifact(plot_roc_curve, "roc_curve_plot")
            per_class_metrics_collection_df["roc_auc"] = roc_curve.auc

            pr_curve = _gen_classifier_curve(
                is_binomial=False,
                y=self.y_true,
                y_probs=self.y_probs,
                labels=self.label_list,
                pos_label=self.pos_label,
                curve_type="pr",
                sample_weights=self.sample_weights,
            )

            def plot_pr_curve():
                pr_curve.plot_fn(**pr_curve.plot_fn_args)

            self._log_image_artifact(plot_pr_curve, "precision_recall_curve_plot")
            per_class_metrics_collection_df["precision_recall_auc"] = pr_curve.auc

        self._log_pandas_df_artifact(per_class_metrics_collection_df, "per_class_metrics")

    def _log_roc_curve(self):
        def _plot_roc_curve():
            self.roc_curve.plot_fn(**self.roc_curve.plot_fn_args)

        self._log_image_artifact(_plot_roc_curve, "roc_curve_plot")

    def _log_precision_recall_curve(self):
        def _plot_pr_curve():
            self.pr_curve.plot_fn(**self.pr_curve.plot_fn_args)

        self._log_image_artifact(_plot_pr_curve, "precision_recall_curve_plot")

    def _log_lift_curve(self):
        from mlflow.models.evaluation.lift_curve import plot_lift_curve

        def _plot_lift_curve():
            return plot_lift_curve(self.y_true, self.y_probs, pos_label=self.pos_label)

        self._log_image_artifact(_plot_lift_curve, "lift_curve_plot")

    def _log_calibration_curve(self):
        from mlflow.models.evaluation.calibration_curve import plot_calibration_curve

        def _plot_calibration_curve():
            return plot_calibration_curve(
                y_true=self.y_true,
                y_probs=self.y_probs,
                pos_label=self.pos_label,
                calibration_config={
                    k: v for k, v in self.evaluator_config.items() if k.startswith("calibration_")
                },
                label_list=self.label_list,
            )

        self._log_image_artifact(_plot_calibration_curve, "calibration_curve_plot")

    def _log_binary_classifier_artifacts(self):
        if self.y_probs is not None:
            with _suppress_class_imbalance_errors(log_warning=False):
                self._log_roc_curve()
            with _suppress_class_imbalance_errors(log_warning=False):
                self._log_precision_recall_curve()
            with _suppress_class_imbalance_errors(ValueError, log_warning=False):
                self._log_lift_curve()
            with _suppress_class_imbalance_errors(TypeError, log_warning=False):
                self._log_calibration_curve()

    def _log_confusion_matrix(self):
        """
        Helper method for logging confusion matrix
        """
        # normalize the confusion matrix, keep consistent with sklearn autologging.
        confusion_matrix = sk_metrics.confusion_matrix(
            self.y_true,
            self.y_pred,
            labels=self.label_list,
            normalize="true",
            sample_weight=self.sample_weights,
        )

        def plot_confusion_matrix():
            import matplotlib
            import matplotlib.pyplot as plt

            with matplotlib.rc_context(
                {
                    "font.size": min(8, math.ceil(50.0 / len(self.label_list))),
                    "axes.labelsize": 8,
                }
            ):
                _, ax = plt.subplots(1, 1, figsize=(6.0, 4.0), dpi=175)
                disp = sk_metrics.ConfusionMatrixDisplay(
                    confusion_matrix=confusion_matrix,
                    display_labels=self.label_list,
                ).plot(cmap="Blues", ax=ax)
                disp.ax_.set_title("Normalized confusion matrix")

        if hasattr(sk_metrics, "ConfusionMatrixDisplay"):
            self._log_image_artifact(
                plot_confusion_matrix,
                "confusion_matrix",
            )
        return


def _is_categorical(values):
    """
    Infer whether input values are categorical on best effort.
    Return True represent they are categorical, return False represent we cannot determine result.
    """
    dtype_name = pd.Series(values).convert_dtypes().dtype.name.lower()
    return dtype_name in ["category", "string", "boolean"]


def _is_continuous(values):
    """
    Infer whether input values is continuous on best effort.
    Return True represent they are continuous, return False represent we cannot determine result.
    """
    dtype_name = pd.Series(values).convert_dtypes().dtype.name.lower()
    return dtype_name.startswith("float")


def _infer_model_type_by_labels(labels):
    """
    Infer model type by target values.
    """
    if _is_categorical(labels):
        return _ModelType.CLASSIFIER
    elif _is_continuous(labels):
        return _ModelType.REGRESSOR
    else:
        return None  # Unknown


def _extract_predict_fn_and_prodict_proba_fn(model):
    predict_fn = None
    predict_proba_fn = None

    _, raw_model = _extract_raw_model(model)

    if raw_model is not None:
        predict_fn = raw_model.predict
        predict_proba_fn = getattr(raw_model, "predict_proba", None)
        try:
            from mlflow.xgboost import (
                _wrapped_xgboost_model_predict_fn,
                _wrapped_xgboost_model_predict_proba_fn,
            )

            # Because shap evaluation will pass evaluation data in ndarray format
            # (without feature names), if set validate_features=True it will raise error.
            predict_fn = _wrapped_xgboost_model_predict_fn(raw_model, validate_features=False)
            predict_proba_fn = _wrapped_xgboost_model_predict_proba_fn(
                raw_model, validate_features=False
            )
        except ImportError:
            pass
    elif model is not None:
        predict_fn = model.predict

    return predict_fn, predict_proba_fn


@contextmanager
def _suppress_class_imbalance_errors(exception_type=Exception, log_warning=True):
    """
    Exception handler context manager to suppress Exceptions if the private environment
    variable `_MLFLOW_EVALUATE_SUPPRESS_CLASSIFICATION_ERRORS` is set to `True`.
    The purpose of this handler is to prevent an evaluation call for a binary or multiclass
    classification automl run from aborting due to an extreme minority class imbalance
    encountered during iterative training cycles due to the non deterministic sampling
    behavior of Spark's DataFrame.sample() API.
    The Exceptions caught in the usage of this are broad and are designed purely to not
    interrupt the iterative hyperparameter tuning process. Final evaluations are done
    in a more deterministic (but expensive) fashion.
    """
    try:
        yield
    except exception_type as e:
        if _MLFLOW_EVALUATE_SUPPRESS_CLASSIFICATION_ERRORS.get():
            if log_warning:
                _logger.warning(
                    "Failed to calculate metrics due to class imbalance. "
                    "This is expected when the dataset is imbalanced."
                )
        else:
            raise e


def _get_binary_sum_up_label_pred_prob(positive_class_index, positive_class, y, y_pred, y_probs):
    y = np.array(y)
    y_bin = np.where(y == positive_class, 1, 0)
    y_pred_bin = None
    y_prob_bin = None
    if y_pred is not None:
        y_pred = np.array(y_pred)
        y_pred_bin = np.where(y_pred == positive_class, 1, 0)

    if y_probs is not None:
        y_probs = np.array(y_probs)
        y_prob_bin = y_probs[:, positive_class_index]

    return y_bin, y_pred_bin, y_prob_bin


def _get_common_classifier_metrics(
    *, y_true, y_pred, y_proba, labels, average, pos_label, sample_weights
):
    metrics = {
        "example_count": len(y_true),
        "accuracy_score": sk_metrics.accuracy_score(y_true, y_pred, sample_weight=sample_weights),
        "recall_score": sk_metrics.recall_score(
            y_true,
            y_pred,
            average=average,
            pos_label=pos_label,
            sample_weight=sample_weights,
        ),
        "precision_score": sk_metrics.precision_score(
            y_true,
            y_pred,
            average=average,
            pos_label=pos_label,
            sample_weight=sample_weights,
        ),
        "f1_score": sk_metrics.f1_score(
            y_true,
            y_pred,
            average=average,
            pos_label=pos_label,
            sample_weight=sample_weights,
        ),
    }

    if y_proba is not None:
        with _suppress_class_imbalance_errors(ValueError):
            metrics["log_loss"] = sk_metrics.log_loss(
                y_true, y_proba, labels=labels, sample_weight=sample_weights
            )
    return metrics


def _get_binary_classifier_metrics(
    *, y_true, y_pred, y_proba=None, labels=None, pos_label=1, sample_weights=None
):
    with _suppress_class_imbalance_errors(ValueError):
        tn, fp, fn, tp = sk_metrics.confusion_matrix(y_true, y_pred, labels=labels).ravel()
        return {
            "true_negatives": tn,
            "false_positives": fp,
            "false_negatives": fn,
            "true_positives": tp,
            **_get_common_classifier_metrics(
                y_true=y_true,
                y_pred=y_pred,
                y_proba=y_proba,
                labels=labels,
                average="binary",
                pos_label=pos_label,
                sample_weights=sample_weights,
            ),
        }


def _get_multiclass_classifier_metrics(
    *,
    y_true,
    y_pred,
    y_proba=None,
    labels=None,
    average="weighted",
    sample_weights=None,
):
    metrics = _get_common_classifier_metrics(
        y_true=y_true,
        y_pred=y_pred,
        y_proba=y_proba,
        labels=labels,
        average=average,
        pos_label=None,
        sample_weights=sample_weights,
    )
    if average in ("macro", "weighted") and y_proba is not None:
        metrics.update(
            roc_auc=sk_metrics.roc_auc_score(
                y_true=y_true,
                y_score=y_proba,
                sample_weight=sample_weights,
                average=average,
                multi_class="ovr",
            )
        )
    return metrics


def _get_classifier_per_class_metrics_collection_df(y, y_pred, labels, sample_weights):
    per_class_metrics_list = []
    for positive_class_index, positive_class in enumerate(labels):
        (
            y_bin,
            y_pred_bin,
            _,
        ) = _get_binary_sum_up_label_pred_prob(
            positive_class_index, positive_class, y, y_pred, None
        )
        per_class_metrics = {"positive_class": positive_class}
        binary_classifier_metrics = _get_binary_classifier_metrics(
            y_true=y_bin,
            y_pred=y_pred_bin,
            labels=[0, 1],  # Use binary labels for per-class metrics
            pos_label=1,
            sample_weights=sample_weights,
        )
        if binary_classifier_metrics:
            per_class_metrics.update(binary_classifier_metrics)
        per_class_metrics_list.append(per_class_metrics)

    return pd.DataFrame(per_class_metrics_list)


def _gen_classifier_curve(
    is_binomial,
    y,
    y_probs,
    labels,
    pos_label,
    curve_type,
    sample_weights,
):
    """
    Generate precision-recall curve or ROC curve for classifier.

    Args:
        is_binomial: True if it is binary classifier otherwise False
        y: True label values
        y_probs: if binary classifier, the predicted probability for positive class.
                  if multiclass classifier, the predicted probabilities for all classes.
        labels: The set of labels.
        pos_label: The label of the positive class.
        curve_type: "pr" or "roc"
        sample_weights: Optional sample weights.

    Returns:
        An instance of "_Curve" which includes attributes "plot_fn", "plot_fn_args", "auc".
    """
    if curve_type == "roc":

        def gen_line_x_y_label_auc(_y, _y_prob, _pos_label):
            fpr, tpr, _ = sk_metrics.roc_curve(
                _y,
                _y_prob,
                sample_weight=sample_weights,
                # For multiclass classification where a one-vs-rest ROC curve is produced for each
                # class, the positive label is binarized and should not be included in the plot
                # legend
                pos_label=_pos_label if _pos_label == pos_label else None,
            )

            auc = sk_metrics.roc_auc_score(y_true=_y, y_score=_y_prob, sample_weight=sample_weights)
            return fpr, tpr, f"AUC={auc:.3f}", auc

        xlabel = "False Positive Rate"
        ylabel = "True Positive Rate"
        title = "ROC curve"
        if pos_label:
            xlabel = f"False Positive Rate (Positive label: {pos_label})"
            ylabel = f"True Positive Rate (Positive label: {pos_label})"
    elif curve_type == "pr":

        def gen_line_x_y_label_auc(_y, _y_prob, _pos_label):
            precision, recall, _ = sk_metrics.precision_recall_curve(
                _y,
                _y_prob,
                sample_weight=sample_weights,
                # For multiclass classification where a one-vs-rest precision-recall curve is
                # produced for each class, the positive label is binarized and should not be
                # included in the plot legend
                pos_label=_pos_label if _pos_label == pos_label else None,
            )
            # NB: We return average precision score (AP) instead of AUC because AP is more
            # appropriate for summarizing a precision-recall curve
            ap = sk_metrics.average_precision_score(
                y_true=_y, y_score=_y_prob, pos_label=_pos_label, sample_weight=sample_weights
            )
            return recall, precision, f"AP={ap:.3f}", ap

        xlabel = "Recall"
        ylabel = "Precision"
        title = "Precision recall curve"
        if pos_label:
            xlabel = f"Recall (Positive label: {pos_label})"
            ylabel = f"Precision (Positive label: {pos_label})"
    else:
        assert False, "illegal curve type"

    if is_binomial:
        x_data, y_data, line_label, auc = gen_line_x_y_label_auc(y, y_probs, pos_label)
        data_series = [(line_label, x_data, y_data)]
    else:
        curve_list = []
        for positive_class_index, positive_class in enumerate(labels):
            y_bin, _, y_prob_bin = _get_binary_sum_up_label_pred_prob(
                positive_class_index, positive_class, y, labels, y_probs
            )

            x_data, y_data, line_label, auc = gen_line_x_y_label_auc(
                y_bin, y_prob_bin, _pos_label=1
            )
            curve_list.append((positive_class, x_data, y_data, line_label, auc))

        data_series = [
            (f"label={positive_class},{line_label}", x_data, y_data)
            for positive_class, x_data, y_data, line_label, _ in curve_list
        ]
        auc = [auc for _, _, _, _, auc in curve_list]

    def _do_plot(**kwargs):
        from matplotlib import pyplot

        _, ax = plot_lines(**kwargs)
        dash_line_args = {
            "color": "gray",
            "alpha": 0.3,
            "drawstyle": "default",
            "linestyle": "dashed",
        }
        if curve_type == "pr":
            ax.plot([0, 1], [1, 0], **dash_line_args)
        elif curve_type == "roc":
            ax.plot([0, 1], [0, 1], **dash_line_args)

        if is_binomial:
            ax.legend(loc="best")
        else:
            ax.legend(loc="center left", bbox_to_anchor=(1, 0.5))
            pyplot.subplots_adjust(right=0.6, bottom=0.25)

    return _Curve(
        plot_fn=_do_plot,
        plot_fn_args={
            "data_series": data_series,
            "xlabel": xlabel,
            "ylabel": ylabel,
            "line_kwargs": {"drawstyle": "steps-post", "linewidth": 1},
            "title": title,
        },
        auc=auc,
    )
```

--------------------------------------------------------------------------------

---[FILE: default.py]---
Location: mlflow-master/mlflow/models/evaluation/evaluators/default.py

```python
import logging
import os
import time
from typing import Optional

import numpy as np
import pandas as pd

import mlflow
from mlflow.entities.metric import Metric
from mlflow.exceptions import MlflowException
from mlflow.metrics import (
    MetricValue,
    ari_grade_level,
    exact_match,
    flesch_kincaid_grade_level,
    ndcg_at_k,
    precision_at_k,
    recall_at_k,
    rouge1,
    rouge2,
    rougeL,
    rougeLsum,
    token_count,
    toxicity,
)
from mlflow.metrics.genai.genai_metric import _GENAI_CUSTOM_METRICS_FILE_NAME
from mlflow.models.evaluation.artifacts import JsonEvaluationArtifact
from mlflow.models.evaluation.base import EvaluationMetric, EvaluationResult, _ModelType
from mlflow.models.evaluation.default_evaluator import (
    _LATENCY_METRIC_NAME,
    BuiltInEvaluator,
    _extract_output_and_other_columns,
    _extract_predict_fn,
)
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE

_logger = logging.getLogger(__name__)


class DefaultEvaluator(BuiltInEvaluator):
    """
    The default built-in evaluator for any models that cannot be evaluated
    by other built-in evaluators, such as question-answering.
    """

    name = "default"

    @classmethod
    def can_evaluate(cls, *, model_type, evaluator_config, **kwargs):
        return model_type in _ModelType.values() or model_type is None

    def _evaluate(
        self,
        model: Optional["mlflow.pyfunc.PyFuncModel"],
        extra_metrics: list[EvaluationMetric],
        custom_artifacts=None,
        **kwargs,
    ) -> EvaluationResult | None:
        compute_latency = False
        for extra_metric in extra_metrics:
            # If latency metric is specified, we will compute latency for the model
            # during prediction, and we will remove the metric from the list of extra
            # metrics to be computed after prediction.
            if extra_metric.name == _LATENCY_METRIC_NAME:
                compute_latency = True
                extra_metrics.remove(extra_metric)
        self._log_genai_custom_metrics(extra_metrics)

        # Generate model predictions and evaluate metrics
        y_pred, other_model_outputs, self.predictions = self._generate_model_predictions(
            model, input_df=self.X.copy_to_avoid_mutation(), compute_latency=compute_latency
        )
        y_true = self.dataset.labels_data

        metrics = self._builtin_metrics() + extra_metrics
        self.evaluate_metrics(
            metrics,
            prediction=y_pred,
            target=self.dataset.labels_data,
            other_output_df=other_model_outputs,
        )
        self.evaluate_and_log_custom_artifacts(custom_artifacts, prediction=y_pred, target=y_true)

        # Log metrics and artifacts
        self.log_metrics()
        self.log_eval_table(y_pred, other_model_outputs)
        return EvaluationResult(
            metrics=self.aggregate_metrics, artifacts=self.artifacts, run_id=self.run_id
        )

    def _builtin_metrics(self) -> list[Metric]:
        """
        Get a list of builtin metrics for the model type.
        """
        if self.model_type is None:
            return []

        text_metrics = [
            token_count(),
            toxicity(),
            flesch_kincaid_grade_level(),
            ari_grade_level(),
        ]
        builtin_metrics = []

        # NB: Classifier and Regressor are handled by dedicated built-in evaluators,
        if self.model_type == _ModelType.QUESTION_ANSWERING:
            builtin_metrics = [*text_metrics, exact_match()]
        elif self.model_type == _ModelType.TEXT_SUMMARIZATION:
            builtin_metrics = [
                *text_metrics,
                rouge1(),
                rouge2(),
                rougeL(),
                rougeLsum(),
            ]
        elif self.model_type == _ModelType.TEXT:
            builtin_metrics = text_metrics
        elif self.model_type == _ModelType.RETRIEVER:
            # default k to 3 if not specified
            retriever_k = self.evaluator_config.pop("retriever_k", 3)
            builtin_metrics = [
                precision_at_k(retriever_k),
                recall_at_k(retriever_k),
                ndcg_at_k(retriever_k),
            ]

        return builtin_metrics

    def _generate_model_predictions(
        self,
        model: Optional["mlflow.pyfunc.PyFuncModel"],
        input_df: pd.DataFrame,
        compute_latency=False,
    ):
        """
        Helper method for generating model predictions
        """
        predict_fn = _extract_predict_fn(model)

        def predict_with_latency(X_copy):
            y_pred_list = []
            pred_latencies = []
            if len(X_copy) == 0:
                raise ValueError("Empty input data")

            is_dataframe = isinstance(X_copy, pd.DataFrame)

            for row in X_copy.iterrows() if is_dataframe else enumerate(X_copy):
                i, row_data = row
                single_input = row_data.to_frame().T if is_dataframe else row_data
                start_time = time.time()
                y_pred = predict_fn(single_input)
                end_time = time.time()
                pred_latencies.append(end_time - start_time)
                y_pred_list.append(y_pred)

            # Update latency metric
            self.metrics_values.update({_LATENCY_METRIC_NAME: MetricValue(scores=pred_latencies)})

            # Aggregate all predictions into model_predictions
            sample_pred = y_pred_list[0]
            if isinstance(sample_pred, pd.DataFrame):
                return pd.concat(y_pred_list)
            elif isinstance(sample_pred, np.ndarray):
                return np.concatenate(y_pred_list, axis=0)
            elif isinstance(sample_pred, list):
                return sum(y_pred_list, [])
            elif isinstance(sample_pred, pd.Series):
                return pd.concat(y_pred_list, ignore_index=True)
            elif isinstance(sample_pred, str):
                return y_pred_list
            else:
                raise MlflowException(
                    message=f"Unsupported prediction type {type(sample_pred)} for model type "
                    f"{self.model_type}.",
                    error_code=INVALID_PARAMETER_VALUE,
                )

        if model is not None:
            _logger.info("Computing model predictions.")

            if compute_latency:
                model_predictions = predict_with_latency(input_df)
            else:
                model_predictions = predict_fn(input_df)
        else:
            if compute_latency:
                _logger.warning(
                    "Setting the latency to 0 for all entries because the model is not provided."
                )
                self.metrics_values.update(
                    {_LATENCY_METRIC_NAME: MetricValue(scores=[0.0] * len(input_df))}
                )
            model_predictions = self.dataset.predictions_data

        output_column_name = self.predictions
        (
            y_pred,
            other_output_df,
            predictions_column_name,
        ) = _extract_output_and_other_columns(model_predictions, output_column_name)

        return y_pred, other_output_df, predictions_column_name

    def _log_genai_custom_metrics(self, extra_metrics: list[EvaluationMetric]):
        genai_custom_metrics = [
            extra_metric.genai_metric_args
            for extra_metric in extra_metrics
            # When the field is present, the metric is created from either make_genai_metric
            # or make_genai_metric_from_prompt. We will log the metric definition.
            if extra_metric.genai_metric_args is not None
        ]

        if len(genai_custom_metrics) == 0:
            return

        names = []
        versions = []
        metric_args_list = []

        for metric_args in genai_custom_metrics:
            names.append(metric_args["name"])
            # Custom metrics created from make_genai_metric_from_prompt don't have version
            versions.append(metric_args.get("version", ""))
            metric_args_list.append(metric_args)

        data = {"name": names, "version": versions, "metric_args": metric_args_list}

        mlflow.log_table(data, artifact_file=_GENAI_CUSTOM_METRICS_FILE_NAME)

        artifact_name = os.path.splitext(_GENAI_CUSTOM_METRICS_FILE_NAME)[0]
        self.artifacts[artifact_name] = JsonEvaluationArtifact(
            uri=mlflow.get_artifact_uri(_GENAI_CUSTOM_METRICS_FILE_NAME)
        )
```

--------------------------------------------------------------------------------

---[FILE: regressor.py]---
Location: mlflow-master/mlflow/models/evaluation/evaluators/regressor.py

```python
from typing import Optional

import numpy as np
from sklearn import metrics as sk_metrics

import mlflow
from mlflow.models.evaluation.base import EvaluationMetric, EvaluationResult, _ModelType
from mlflow.models.evaluation.default_evaluator import (
    BuiltInEvaluator,
    _extract_output_and_other_columns,
    _extract_predict_fn,
    _get_aggregate_metrics_values,
)


class RegressorEvaluator(BuiltInEvaluator):
    """
    A built-in evaluator for regressor models.
    """

    name = "regressor"

    @classmethod
    def can_evaluate(cls, *, model_type, evaluator_config, **kwargs):
        return model_type == _ModelType.REGRESSOR

    def _evaluate(
        self,
        model: Optional["mlflow.pyfunc.PyFuncModel"],
        extra_metrics: list[EvaluationMetric],
        custom_artifacts=None,
        **kwargs,
    ) -> EvaluationResult | None:
        self.y_true = self.dataset.labels_data
        self.sample_weights = self.evaluator_config.get("sample_weights", None)

        input_df = self.X.copy_to_avoid_mutation()
        self.y_pred = self._generate_model_predictions(model, input_df)
        self._compute_buildin_metrics(model)

        self.evaluate_metrics(extra_metrics, prediction=self.y_pred, target=self.y_true)
        self.evaluate_and_log_custom_artifacts(
            custom_artifacts, prediction=self.y_pred, target=self.y_true
        )

        self.log_metrics()
        self.log_eval_table(self.y_pred)

        return EvaluationResult(
            metrics=self.aggregate_metrics, artifacts=self.artifacts, run_id=self.run_id
        )

    def _generate_model_predictions(self, model, input_df):
        if predict_fn := _extract_predict_fn(model):
            preds = predict_fn(input_df)
            y_pred, _, _ = _extract_output_and_other_columns(preds, self.predictions)
            return y_pred
        else:
            return self.dataset.predictions_data

    def _compute_buildin_metrics(self, model):
        self._evaluate_sklearn_model_score_if_scorable(model, self.y_true, self.sample_weights)
        self.metrics_values.update(
            _get_aggregate_metrics_values(
                _get_regressor_metrics(self.y_true, self.y_pred, self.sample_weights)
            )
        )


def _get_regressor_metrics(y, y_pred, sample_weights):
    from mlflow.metrics.metric_definitions import _root_mean_squared_error

    sum_on_target = (
        (np.array(y) * np.array(sample_weights)).sum() if sample_weights is not None else sum(y)
    )
    return {
        "example_count": len(y),
        "mean_absolute_error": sk_metrics.mean_absolute_error(
            y, y_pred, sample_weight=sample_weights
        ),
        "mean_squared_error": sk_metrics.mean_squared_error(
            y, y_pred, sample_weight=sample_weights
        ),
        "root_mean_squared_error": _root_mean_squared_error(
            y_true=y,
            y_pred=y_pred,
            sample_weight=sample_weights,
        ),
        "sum_on_target": sum_on_target,
        "mean_on_target": sum_on_target / len(y),
        "r2_score": sk_metrics.r2_score(y, y_pred, sample_weight=sample_weights),
        "max_error": sk_metrics.max_error(y, y_pred),
        "mean_absolute_percentage_error": sk_metrics.mean_absolute_percentage_error(
            y, y_pred, sample_weight=sample_weights
        ),
    }
```

--------------------------------------------------------------------------------

````
