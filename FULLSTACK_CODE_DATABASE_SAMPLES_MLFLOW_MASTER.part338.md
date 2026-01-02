---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 338
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 338 of 991)

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

---[FILE: deprecated.py]---
Location: mlflow-master/mlflow/models/evaluation/deprecated.py

```python
import functools
import warnings

from mlflow.models.evaluation import evaluate as model_evaluate


@functools.wraps(model_evaluate)
def evaluate(*args, **kwargs):
    warnings.warn(
        "The `mlflow.evaluate` API has been deprecated as of MLflow 3.0.0. "
        "Please use these new alternatives:\n\n"
        " - For traditional ML or deep learning models: Use `mlflow.models.evaluate`, "
        "which maintains full compatibility with the original `mlflow.evaluate` API.\n\n"
        " - For LLMs or GenAI applications: Use the new `mlflow.genai.evaluate` API, "
        "which offers enhanced features specifically designed for evaluating "
        "LLMs and GenAI applications.\n",
        FutureWarning,
    )
    return model_evaluate(*args, **kwargs)
```

--------------------------------------------------------------------------------

---[FILE: evaluator_registry.py]---
Location: mlflow-master/mlflow/models/evaluation/evaluator_registry.py

```python
import warnings

from mlflow.exceptions import MlflowException
from mlflow.utils.import_hooks import register_post_import_hook
from mlflow.utils.plugins import get_entry_points


class ModelEvaluatorRegistry:
    """
    Scheme-based registry for model evaluator implementations
    """

    def __init__(self):
        self._registry = {}
        self._builtin_evaluators = {}

    def register(self, scheme, evaluator):
        """Register model evaluator provided by other packages"""
        self._registry[scheme] = evaluator

    def register_builtin(self, scheme, evaluator):
        """Register built-in model evaluator"""
        self._registry[scheme] = evaluator
        self._builtin_evaluators[scheme] = evaluator

    def register_entrypoints(self):
        # Register ModelEvaluator implementation provided by other packages
        for entrypoint in get_entry_points("mlflow.model_evaluator"):
            try:
                self.register(entrypoint.name, entrypoint.load())
            except (AttributeError, ImportError) as exc:
                warnings.warn(
                    'Failure attempting to register model evaluator for scheme "{}": {}'.format(
                        entrypoint.name, str(exc)
                    ),
                    stacklevel=2,
                )

    def get_evaluator(self, evaluator_name):
        """
        Get an evaluator instance from the registry based on the name of evaluator
        """
        evaluator_cls = self._registry.get(evaluator_name)
        if evaluator_cls is None:
            raise MlflowException(
                f"Could not find a registered model evaluator for: {evaluator_name}. "
                f"Currently registered evaluator names are: {list(self._registry.keys())}"
            )
        return evaluator_cls()

    def is_builtin(self, name):
        return name in self._builtin_evaluators

    def is_registered(self, name):
        return name in self._registry


_model_evaluation_registry = ModelEvaluatorRegistry()


def register_evaluators(module):
    from mlflow.models.evaluation.evaluators.classifier import ClassifierEvaluator
    from mlflow.models.evaluation.evaluators.default import DefaultEvaluator
    from mlflow.models.evaluation.evaluators.regressor import RegressorEvaluator
    from mlflow.models.evaluation.evaluators.shap import ShapEvaluator

    # Built-in evaluators
    module._model_evaluation_registry.register_builtin(DefaultEvaluator.name, DefaultEvaluator)
    module._model_evaluation_registry.register_builtin(
        ClassifierEvaluator.name, ClassifierEvaluator
    )
    module._model_evaluation_registry.register_builtin(RegressorEvaluator.name, RegressorEvaluator)
    module._model_evaluation_registry.register_builtin(ShapEvaluator.name, ShapEvaluator)

    # Plugin evaluators
    module._model_evaluation_registry.register_entrypoints()


# Put it in post-importing hook to avoid circuit importing
register_post_import_hook(register_evaluators, __name__, overwrite=True)
```

--------------------------------------------------------------------------------

---[FILE: lift_curve.py]---
Location: mlflow-master/mlflow/models/evaluation/lift_curve.py

```python
import matplotlib.pyplot as plt
import numpy as np


def _cumulative_gain_curve(y_true, y_score, pos_label=None):
    """
    This method is copied from scikit-plot package.
    See https://github.com/reiinakano/scikit-plot/blob/2dd3e6a76df77edcbd724c4db25575f70abb57cb/scikitplot/helpers.py#L157

    This function generates the points necessary to plot the Cumulative Gain

    Note: This implementation is restricted to the binary classification task.

    Args:
        y_true (array-like, shape (n_samples)): True labels of the data.

        y_score (array-like, shape (n_samples)): Target scores, can either be
            probability estimates of the positive class, confidence values, or
            non-thresholded measure of decisions (as returned by
            decision_function on some classifiers).

        pos_label (int or str, default=None): Label considered as positive and
            others are considered negative

    Returns:
        percentages (numpy.ndarray): An array containing the X-axis values for
            plotting the Cumulative Gains chart.

        gains (numpy.ndarray): An array containing the Y-axis values for one
            curve of the Cumulative Gains chart.

    Raises:
        ValueError: If `y_true` is not composed of 2 classes. The Cumulative
            Gain Chart is only relevant in binary classification.
    """
    y_true = np.asarray(y_true)
    y_score = np.asarray(y_score)

    # ensure binary classification if pos_label is not specified
    classes = np.unique(y_true)
    if pos_label is None and not (
        np.array_equal(classes, [0, 1])
        or np.array_equal(classes, [-1, 1])
        or np.array_equal(classes, [0])
        or np.array_equal(classes, [-1])
        or np.array_equal(classes, [1])
    ):
        raise ValueError("Data is not binary and pos_label is not specified")
    elif pos_label is None:
        pos_label = 1.0

    # make y_true a boolean vector
    y_true = y_true == pos_label

    sorted_indices = np.argsort(y_score)[::-1]
    y_true = y_true[sorted_indices]
    gains = np.cumsum(y_true)

    percentages = np.arange(start=1, stop=len(y_true) + 1)

    gains = gains / float(np.sum(y_true))
    percentages = percentages / float(len(y_true))

    gains = np.insert(gains, 0, [0])
    percentages = np.insert(percentages, 0, [0])

    return percentages, gains


def plot_lift_curve(
    y_true,
    y_probas,
    title="Lift Curve",
    ax=None,
    figsize=None,
    title_fontsize="large",
    text_fontsize="medium",
    pos_label=None,
):
    """
    This method is copied from scikit-plot package.
    See https://github.com/reiinakano/scikit-plot/blob/2dd3e6a76df77edcbd724c4db25575f70abb57cb/scikitplot/metrics.py#L1133

    Generates the Lift Curve from labels and scores/probabilities

    The lift curve is used to determine the effectiveness of a
    binary classifier. A detailed explanation can be found at
    http://www2.cs.uregina.ca/~dbd/cs831/notes/lift_chart/lift_chart.html.
    The implementation here works only for binary classification.

    Args:
        y_true (array-like, shape (n_samples)):
            Ground truth (correct) target values.

        y_probas (array-like, shape (n_samples, n_classes)):
            Prediction probabilities for each class returned by a classifier.

        title (string, optional): Title of the generated plot. Defaults to
            "Lift Curve".

        ax (:class:`matplotlib.axes.Axes`, optional): The axes upon which to
            plot the learning curve. If None, the plot is drawn on a new set of
            axes.

        figsize (2-tuple, optional): Tuple denoting figure size of the plot
            e.g. (6, 6). Defaults to ``None``.

        title_fontsize (string or int, optional): Matplotlib-style fontsizes.
            Use e.g. "small", "medium", "large" or integer-values. Defaults to
            "large".

        text_fontsize (string or int, optional): Matplotlib-style fontsizes.
            Use e.g. "small", "medium", "large" or integer-values. Defaults to
            "medium".

        pos_label (optional): Label for the positive class.

    Returns:
        ax (:class:`matplotlib.axes.Axes`): The axes on which the plot was
            drawn.

    Example:
        >>> lr = LogisticRegression()
        >>> lr = lr.fit(X_train, y_train)
        >>> y_probas = lr.predict_proba(X_test)
        >>> plot_lift_curve(y_test, y_probas)
        <matplotlib.axes._subplots.AxesSubplot object at 0x7fe967d64490>
        >>> plt.show()

        .. image:: _static/examples/plot_lift_curve.png
           :align: center
           :alt: Lift Curve
    """
    y_true = np.array(y_true)
    y_probas = np.array(y_probas)

    classes = np.unique(y_true)
    if len(classes) != 2:
        raise ValueError(f"Cannot calculate Lift Curve for data with {len(classes)} category/ies")

    # Compute Cumulative Gain Curves
    percentages, gains1 = _cumulative_gain_curve(y_true, y_probas[:, 0], classes[0])
    percentages, gains2 = _cumulative_gain_curve(y_true, y_probas[:, 1], classes[1])

    percentages = percentages[1:]
    gains1 = gains1[1:]
    gains2 = gains2[1:]

    gains1 = gains1 / percentages
    gains2 = gains2 / percentages

    if ax is None:
        _, ax = plt.subplots(1, 1, figsize=figsize)

    ax.set_title(title, fontsize=title_fontsize)

    label0 = f"Class {classes[0]}"
    label1 = f"Class {classes[1]}"
    # show (positive) next to the positive class in the legend
    if pos_label:
        if pos_label == classes[0]:
            label0 = f"Class {classes[0]} (positive)"
        elif pos_label == classes[1]:
            label1 = f"Class {classes[1]} (positive)"
        # do not mark positive class if pos_label is not in classes

    ax.plot(percentages, gains1, lw=3, label=label0)
    ax.plot(percentages, gains2, lw=3, label=label1)

    ax.plot([0, 1], [1, 1], "k--", lw=2, label="Baseline")

    ax.set_xlabel("Percentage of sample", fontsize=text_fontsize)
    ax.set_ylabel("Lift", fontsize=text_fontsize)
    ax.tick_params(labelsize=text_fontsize)
    ax.grid("on")
    ax.legend(loc="best", fontsize=text_fontsize)

    return ax
```

--------------------------------------------------------------------------------

---[FILE: validation.py]---
Location: mlflow-master/mlflow/models/evaluation/validation.py

```python
import logging
import operator
import os
from decimal import Decimal

from mlflow.exceptions import MlflowException
from mlflow.models.evaluation import EvaluationResult
from mlflow.protos.databricks_pb2 import BAD_REQUEST, INVALID_PARAMETER_VALUE

_logger = logging.getLogger(__name__)


class MetricThreshold:
    """
    This class allows you to define metric thresholds for model validation.
    Allowed thresholds are: threshold, min_absolute_change, min_relative_change.

    Args:
        threshold: (Optional) A number representing the value threshold for the metric.

            - If greater is better for the metric, the metric value has to be
              >= threshold to pass validation.
            - Otherwise, the metric value has to be <= threshold to pass the validation.

        min_absolute_change: (Optional) A positive number representing the minimum absolute
            change required for candidate model to pass validation with
            the baseline model.

            - If greater is better for the metric, metric value has to be
              >= baseline model metric value + min_absolute_change to pass the validation.
            - Otherwise, metric value has to be <= baseline model metric value - min_absolute_change
              to pass the validation.

        min_relative_change: (Optional) A floating point number between 0 and 1 representing
            the minimum relative change (in percentage of
            baseline model metric value) for candidate model
            to pass the comparison with the baseline model.

            - If greater is better for the metric, metric value has to be
              >= baseline model metric value * (1 + min_relative_change)
            - Otherwise, metric value has to be
              <= baseline model metric value * (1 - min_relative_change)
            - Note that if the baseline model metric value is equal to 0, the
              threshold falls back performing a simple verification that the
              candidate metric value is better than the baseline metric value,
              i.e. metric value >= baseline model metric value + 1e-10 if greater
              is better; metric value <= baseline model metric value - 1e-10 if
              lower is better.

        greater_is_better: A required boolean representing whether greater value is
            better for the metric.
    """

    def __init__(
        self,
        threshold=None,
        min_absolute_change=None,
        min_relative_change=None,
        greater_is_better=None,
    ):
        if threshold is not None and type(threshold) not in {int, float}:
            raise MetricThresholdClassException("`threshold` parameter must be a number.")
        if min_absolute_change is not None and (
            type(min_absolute_change) not in {int, float} or min_absolute_change <= 0
        ):
            raise MetricThresholdClassException(
                "`min_absolute_change` parameter must be a positive number."
            )
        if min_relative_change is not None:
            if not isinstance(min_relative_change, float):
                raise MetricThresholdClassException(
                    "`min_relative_change` parameter must be a floating point number."
                )
            if min_relative_change < 0 or min_relative_change > 1:
                raise MetricThresholdClassException(
                    "`min_relative_change` parameter must be between 0 and 1."
                )
        if greater_is_better is None:
            raise MetricThresholdClassException("`greater_is_better` parameter must be defined.")
        if not isinstance(greater_is_better, bool):
            raise MetricThresholdClassException("`greater_is_better` parameter must be a boolean.")
        if threshold is None and min_absolute_change is None and min_relative_change is None:
            raise MetricThresholdClassException("no threshold was specified.")
        self._threshold = threshold
        self._min_absolute_change = min_absolute_change
        self._min_relative_change = min_relative_change
        self._greater_is_better = greater_is_better

    @property
    def threshold(self):
        """
        Value of the threshold.
        """
        return self._threshold

    @property
    def min_absolute_change(self):
        """
        Value of the minimum absolute change required to pass model comparison with baseline model.
        """
        return self._min_absolute_change

    @property
    def min_relative_change(self):
        """
        Float value of the minimum relative change required to pass model comparison with
        baseline model.
        """
        return self._min_relative_change

    @property
    def greater_is_better(self):
        """
        Boolean value representing whether greater value is better for the metric.
        """
        return self._greater_is_better

    def __str__(self):
        """
        Returns a human-readable string consisting of all specified thresholds.
        """
        threshold_strs = []
        if self._threshold is not None:
            threshold_strs.append(f"Threshold: {self._threshold}.")
        if self._min_absolute_change is not None:
            threshold_strs.append(f"Minimum Absolute Change: {self._min_absolute_change}.")
        if self._min_relative_change is not None:
            threshold_strs.append(f"Minimum Relative Change: {self._min_relative_change}.")
        if self._greater_is_better is not None:
            if self._greater_is_better:
                threshold_strs.append("Greater value is better.")
            else:
                threshold_strs.append("Lower value is better.")
        return " ".join(threshold_strs)


class MetricThresholdClassException(MlflowException):
    def __init__(self, _message, **kwargs):
        message = "Could not instantiate MetricThreshold class: " + _message
        super().__init__(message, error_code=INVALID_PARAMETER_VALUE, **kwargs)


class _MetricValidationResult:
    """
    Internal class for representing validation result per metric.
    Not user facing, used for organizing metric failures and generating failure message
    more conveniently.

    Args:
        metric_name: String representing the metric name
        candidate_metric_value: value of metric for candidate model
        metric_threshold: :py:class: `MetricThreshold<mlflow.models.validation.MetricThreshold>`
            The MetricThreshold for the metric.
        baseline_metric_value: value of metric for baseline model
    """

    missing_candidate = False
    missing_baseline = False
    threshold_failed = False
    min_absolute_change_failed = False
    min_relative_change_failed = False

    def __init__(
        self,
        metric_name,
        candidate_metric_value,
        metric_threshold,
        baseline_metric_value=None,
    ):
        self.metric_name = metric_name
        self.candidate_metric_value = candidate_metric_value
        self.baseline_metric_value = baseline_metric_value
        self.metric_threshold = metric_threshold

    def __str__(self):
        """
        Returns a human-readable string representing the validation result for the metric.
        """
        if self.is_success():
            return f"Metric {self.metric_name} passed the validation."

        if self.missing_candidate:
            return (
                f"Metric validation failed: metric {self.metric_name} was missing from the "
                f"evaluation result of the candidate model."
            )

        result_strs = []
        if self.threshold_failed:
            result_strs.append(
                f"Metric {self.metric_name} value threshold check failed: "
                f"candidate model {self.metric_name} = {self.candidate_metric_value}, "
                f"{self.metric_name} threshold = {self.metric_threshold.threshold}."
            )
        if self.missing_baseline:
            result_strs.append(
                f"Model comparison failed: metric {self.metric_name} was missing from "
                f"the evaluation result of the baseline model."
            )
        else:
            if self.min_absolute_change_failed:
                result_strs.append(
                    f"Metric {self.metric_name} minimum absolute change check failed: "
                    f"candidate model {self.metric_name} = {self.candidate_metric_value}, "
                    f"baseline model {self.metric_name} = {self.baseline_metric_value}, "
                    f"{self.metric_name} minimum absolute change threshold = "
                    f"{self.metric_threshold.min_absolute_change}."
                )
            if self.min_relative_change_failed:
                result_strs.append(
                    f"Metric {self.metric_name} minimum relative change check failed: "
                    f"candidate model {self.metric_name} = {self.candidate_metric_value}, "
                    f"baseline model {self.metric_name} = {self.baseline_metric_value}, "
                    f"{self.metric_name} minimum relative change threshold = "
                    f"{self.metric_threshold.min_relative_change}."
                )
        return " ".join(result_strs)

    def is_success(self):
        return (
            not self.missing_candidate
            and not self.missing_baseline
            and not self.threshold_failed
            and not self.min_absolute_change_failed
            and not self.min_relative_change_failed
        )


class ModelValidationFailedException(MlflowException):
    def __init__(self, message, **kwargs):
        super().__init__(message, error_code=BAD_REQUEST, **kwargs)


def validate_evaluation_results(
    validation_thresholds: dict[str, MetricThreshold],
    candidate_result: EvaluationResult,
    baseline_result: EvaluationResult | None = None,
):
    """
    Validate the evaluation result from one model (candidate) against another
    model (baseline). If the candidate results do not meet the validation
    thresholds, an ModelValidationFailedException will be raised.

    .. note::

        This API is a replacement for the deprecated model validation
        functionality in the :py:func:`mlflow.evaluate` API.

    Args:
        validation_thresholds: A dictionary of metric name to
            :py:class:`mlflow.models.MetricThreshold` used for model validation.
            Each metric name must either be the name of a builtin metric or the
            name of a metric defined in the ``extra_metrics`` parameter.
        candidate_result: The evaluation result of the candidate model.
            Returned by the :py:func:`mlflow.evaluate` API.
        baseline_result: The evaluation result of the baseline model.
            Returned by the :py:func:`mlflow.evaluate` API.
            If set to None, the candidate model result will be
            compared against the threshold values directly.

    Code Example:

        .. code-block:: python
            :caption: Example of Model Validation

            import mlflow
            from mlflow.models import MetricThreshold

            thresholds = {
                "accuracy_score": MetricThreshold(
                    # accuracy should be >=0.8
                    threshold=0.8,
                    # accuracy should be at least 5 percent greater than baseline model accuracy
                    min_absolute_change=0.05,
                    # accuracy should be at least 0.05 greater than baseline model accuracy
                    min_relative_change=0.05,
                    greater_is_better=True,
                ),
            }

            # Get evaluation results for the candidate model
            candidate_result = mlflow.evaluate(
                model="<YOUR_CANDIDATE_MODEL_URI>",
                data=eval_dataset,
                targets="ground_truth",
                model_type="classifier",
            )

            # Get evaluation results for the baseline model
            baseline_result = mlflow.evaluate(
                model="<YOUR_BASELINE_MODEL_URI>",
                data=eval_dataset,
                targets="ground_truth",
                model_type="classifier",
            )

            # Validate the results
            mlflow.validate_evaluation_results(
                thresholds,
                candidate_result,
                baseline_result,
            )

        See `the Model Validation documentation
        <../../models/index.html#performing-model-validation>`_ for more details.
    """
    try:
        assert type(validation_thresholds) is dict
        for key in validation_thresholds.keys():
            assert type(key) is str
        for threshold in validation_thresholds.values():
            assert isinstance(threshold, MetricThreshold)
    except AssertionError:
        raise MlflowException(
            message="The validation thresholds argument must be a dictionary that maps strings "
            "to MetricThreshold objects.",
            error_code=INVALID_PARAMETER_VALUE,
        )

    _logger.info("Validating candidate model metrics against baseline")
    _validate(
        validation_thresholds,
        candidate_result.metrics,
        baseline_result.metrics if baseline_result else {},
    )
    _logger.info("Model validation passed!")


def _validate(
    validation_thresholds: dict[str, MetricThreshold],
    candidate_metrics: dict[str, float],
    baseline_metrics: dict[str, float],
):
    """
    Validate the model based on validation_thresholds by metrics value and
    metrics comparison between candidate model's metrics (candidate_metrics) and
    baseline model's metrics (baseline_metrics).

    Args:
        validation_thresholds: A dictionary from metric_name to MetricThreshold.
        candidate_metrics: The metric evaluation result of the candidate model.
        baseline_metrics: The metric evaluation result of the baseline model.

    Raises:
        If the validation does not pass, raise an MlflowException with detail failure message.
    """
    validation_results = {
        metric_name: _MetricValidationResult(
            metric_name,
            candidate_metrics.get(metric_name),
            threshold,
            baseline_metrics.get(metric_name),
        )
        for (metric_name, threshold) in validation_thresholds.items()
    }

    for metric_name, metric_threshold in validation_thresholds.items():
        validation_result = validation_results[metric_name]

        if metric_name not in candidate_metrics:
            validation_result.missing_candidate = True
            continue

        candidate_metric_value = candidate_metrics[metric_name]
        baseline_metric_value = baseline_metrics[metric_name] if baseline_metrics else None

        # If metric is greater is better, >= is used, otherwise <= is used
        # for thresholding metric value and model comparison
        comparator_fn = operator.__ge__ if metric_threshold.greater_is_better else operator.__le__
        operator_fn = operator.add if metric_threshold.greater_is_better else operator.sub

        if metric_threshold.threshold is not None:
            # metric threshold fails
            # - if not (metric_value >= threshold) for greater is better
            # - if not (metric_value <= threshold) for lower is better
            validation_result.threshold_failed = not comparator_fn(
                candidate_metric_value, metric_threshold.threshold
            )

        if (
            metric_threshold.min_relative_change or metric_threshold.min_absolute_change
        ) and metric_name not in baseline_metrics:
            validation_result.missing_baseline = True
            continue

        if metric_threshold.min_absolute_change is not None:
            # metric comparison absolute change fails
            # - if not (metric_value >= baseline + min_absolute_change) for greater is better
            # - if not (metric_value <= baseline - min_absolute_change) for lower is better
            validation_result.min_absolute_change_failed = not comparator_fn(
                Decimal(candidate_metric_value),
                Decimal(operator_fn(baseline_metric_value, metric_threshold.min_absolute_change)),
            )

        if metric_threshold.min_relative_change is not None:
            # If baseline metric value equals 0, fallback to simple comparison check
            if baseline_metric_value == 0:
                _logger.warning(
                    f"Cannot perform relative model comparison for metric {metric_name} as "
                    "baseline metric value is 0. Falling back to simple comparison: verifying "
                    "that candidate metric value is better than the baseline metric value."
                )
                validation_result.min_relative_change_failed = not comparator_fn(
                    Decimal(candidate_metric_value),
                    Decimal(operator_fn(baseline_metric_value, 1e-10)),
                )
                continue
            # metric comparison relative change fails
            # - if (metric_value - baseline) / baseline < min_relative_change for greater is better
            # - if (baseline - metric_value) / baseline < min_relative_change for lower is better
            if metric_threshold.greater_is_better:
                relative_change = (
                    candidate_metric_value - baseline_metric_value
                ) / baseline_metric_value
            else:
                relative_change = (
                    baseline_metric_value - candidate_metric_value
                ) / baseline_metric_value
            validation_result.min_relative_change_failed = (
                relative_change < metric_threshold.min_relative_change
            )

    failure_messages = []

    for metric_validation_result in validation_results.values():
        if metric_validation_result.is_success():
            continue
        failure_messages.append(str(metric_validation_result))

    if not failure_messages:
        return

    raise ModelValidationFailedException(message=os.linesep.join(failure_messages))
```

--------------------------------------------------------------------------------

---[FILE: _shap_patch.py]---
Location: mlflow-master/mlflow/models/evaluation/_shap_patch.py

```python
import pickle

import numpy as np
import shap
from shap._serializable import Deserializer, Serializable, Serializer


class _PatchedKernelExplainer(shap.KernelExplainer):
    @staticmethod
    def not_equal(i, j):
        # `shap.KernelExplainer.not_equal` method fails on some special types such as
        # timestamp, this breaks the kernel explainer routine.
        # `PatchedKernelExplainer` fixes this issue.
        # See https://github.com/slundberg/shap/pull/2586
        number_types = (int, float, np.number)
        if isinstance(i, number_types) and isinstance(j, number_types):
            return 0 if np.isclose(i, j, equal_nan=True) else 1
        else:
            return 0 if i == j else 1

    def save(self, out_file, model_saver=None, masker_saver=None):
        """
        This patched `save` method fix `KernelExplainer.save`.
        Issues in original `KernelExplainer.save`:
         - It saves model by calling model.save, but shap.utils._legacy.Model has no save method
         - It tries to save "masker", but there's no "masker" in KernelExplainer
         - It does not save "KernelExplainer.data" attribute, the attribute is required when
           loading back
        Note: `model_saver` and `masker_saver` are meaningless argument for `KernelExplainer.save`,
        the model in "KernelExplainer" is an instance of `shap.utils._legacy.Model`
        (it wraps the predict function), we can only use pickle to dump it.
        and no `masker` for KernelExplainer so `masker_saver` is meaningless.
        but I preserve the 2 argument for overridden API compatibility.
        """
        pickle.dump(type(self), out_file)
        with Serializer(out_file, "shap.Explainer", version=0) as s:
            s.save("model", self.model)
            s.save("link", self.link)
            s.save("data", self.data)

    @classmethod
    def load(cls, in_file, model_loader=None, masker_loader=None, instantiate=True):
        """
        This patched `load` method fix `KernelExplainer.load`.
        Issues in original KernelExplainer.load:
         - Use mismatched model loader to load model
         - Try to load non-existent "masker" attribute
         - Does not load "data" attribute and then cause calling " KernelExplainer"
           constructor lack of "data" argument.
        Note: `model_loader` and `masker_loader` are meaningless argument for
        `KernelExplainer.save`, because the `model` object is saved by pickle dump,
        we must use pickle load to load it.
        and no `masker` for KernelExplainer so `masker_loader` is meaningless.
        but I preserve the 2 argument for overridden API compatibility.
        """
        if instantiate:
            return cls._instantiated_load(in_file, model_loader=None, masker_loader=None)

        kwargs = Serializable.load(in_file, instantiate=False)
        with Deserializer(in_file, "shap.Explainer", min_version=0, max_version=0) as s:
            kwargs["model"] = s.load("model")
            kwargs["link"] = s.load("link")
            kwargs["data"] = s.load("data")
        return kwargs
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/models/evaluation/__init__.py

```python
from mlflow.data.evaluation_dataset import EvaluationDataset
from mlflow.models.evaluation.base import (
    EvaluationArtifact,
    EvaluationMetric,
    EvaluationResult,
    ModelEvaluator,
    evaluate,
    list_evaluators,
    make_metric,
)
from mlflow.models.evaluation.validation import MetricThreshold

__all__ = [
    "ModelEvaluator",
    "EvaluationDataset",
    "EvaluationResult",
    "EvaluationMetric",
    "EvaluationArtifact",
    "make_metric",
    "evaluate",
    "list_evaluators",
    "MetricThreshold",
]
```

--------------------------------------------------------------------------------

````
