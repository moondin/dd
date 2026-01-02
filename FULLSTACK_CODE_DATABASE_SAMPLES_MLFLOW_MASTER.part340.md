---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 340
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 340 of 991)

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

---[FILE: shap.py]---
Location: mlflow-master/mlflow/models/evaluation/evaluators/shap.py

```python
import functools
import logging
from typing import Optional

import numpy as np
from packaging.version import Version
from sklearn.pipeline import Pipeline as sk_Pipeline

import mlflow
from mlflow import MlflowException
from mlflow.models.evaluation.base import EvaluationMetric, EvaluationResult, _ModelType
from mlflow.models.evaluation.default_evaluator import (
    BuiltInEvaluator,
    _extract_predict_fn,
    _extract_raw_model,
    _get_dataframe_with_renamed_columns,
)
from mlflow.models.evaluation.evaluators.classifier import (
    _is_continuous,
    _suppress_class_imbalance_errors,
)
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.pyfunc import _ServedPyFuncModel

_logger = logging.getLogger(__name__)


_SUPPORTED_SHAP_ALGORITHMS = ("exact", "permutation", "partition", "kernel")
_DEFAULT_SAMPLE_ROWS_FOR_SHAP = 2000


def _shap_predict_fn(x, predict_fn, feature_names):
    return predict_fn(_get_dataframe_with_renamed_columns(x, feature_names))


class ShapEvaluator(BuiltInEvaluator):
    """
    A built-in evaluator to get SHAP explainability insights for classifier and regressor models.

    This evaluator often run with the main evaluator for the model like ClassifierEvaluator.
    """

    name = "shap"

    @classmethod
    def can_evaluate(cls, *, model_type, evaluator_config, **kwargs):
        return model_type in (_ModelType.CLASSIFIER, _ModelType.REGRESSOR) and evaluator_config.get(
            "log_model_explainability", True
        )

    def _evaluate(
        self,
        model: Optional["mlflow.pyfunc.PyFuncModel"],
        extra_metrics: list[EvaluationMetric],
        custom_artifacts=None,
        **kwargs,
    ) -> EvaluationResult | None:
        if isinstance(model, _ServedPyFuncModel):
            _logger.warning(
                "Skipping model explainability because a model server is used for environment "
                "restoration."
            )
            return

        model_loader_module, raw_model = _extract_raw_model(model)
        if model_loader_module == "mlflow.spark":
            # TODO: Shap explainer need to manipulate on each feature values,
            #  but spark model input dataframe contains Vector type feature column
            #  which shap explainer does not support.
            #  To support this, we need expand the Vector type feature column into
            #  multiple scalar feature columns and pass it to shap explainer.
            _logger.warning(
                "Logging model explainability insights is not currently supported for PySpark "
                "models."
            )
            return

        self.y_true = self.dataset.labels_data
        self.label_list = self.evaluator_config.get("label_list")
        self.pos_label = self.evaluator_config.get("pos_label")

        if not (np.issubdtype(self.y_true.dtype, np.number) or self.y_true.dtype == np.bool_):
            # Note: python bool type inherits number type but np.bool_ does not inherit np.number.
            _logger.warning(
                "Skip logging model explainability insights because it requires all label "
                "values to be numeric or boolean."
            )
            return

        algorithm = self.evaluator_config.get("explainability_algorithm", None)
        if algorithm is not None and algorithm not in _SUPPORTED_SHAP_ALGORITHMS:
            raise MlflowException(
                message=f"Specified explainer algorithm {algorithm} is unsupported. Currently only "
                f"support {','.join(_SUPPORTED_SHAP_ALGORITHMS)} algorithms.",
                error_code=INVALID_PARAMETER_VALUE,
            )

        if algorithm != "kernel":
            feature_dtypes = list(self.X.get_original().dtypes)
            for feature_dtype in feature_dtypes:
                if not np.issubdtype(feature_dtype, np.number):
                    _logger.warning(
                        "Skip logging model explainability insights because the shap explainer "
                        f"{algorithm} requires all feature values to be numeric, and each feature "
                        "column must only contain scalar values."
                    )
                    return

        try:
            import shap
            from matplotlib import pyplot
        except ImportError:
            _logger.warning(
                "SHAP or matplotlib package is not installed, so model explainability insights "
                "will not be logged."
            )
            return

        if Version(shap.__version__) < Version("0.40"):
            _logger.warning(
                "Shap package version is lower than 0.40, Skip log model explainability."
            )
            return

        sample_rows = self.evaluator_config.get(
            "explainability_nsamples", _DEFAULT_SAMPLE_ROWS_FOR_SHAP
        )

        X_df = self.X.copy_to_avoid_mutation()

        sampled_X = shap.sample(X_df, sample_rows, random_state=0)

        mode_or_mean_dict = _compute_df_mode_or_mean(X_df)
        sampled_X = sampled_X.fillna(mode_or_mean_dict)

        # shap explainer might call provided `predict_fn` with a `numpy.ndarray` type
        # argument, this might break some model inference, so convert the argument into
        # a pandas dataframe.
        # The `shap_predict_fn` calls model's predict function, we need to restore the input
        # dataframe with original column names, because some model prediction routine uses
        # the column name.

        predict_fn = _extract_predict_fn(model)
        shap_predict_fn = functools.partial(
            _shap_predict_fn, predict_fn=predict_fn, feature_names=self.dataset.feature_names
        )

        if self.label_list is None:
            # If label list is not specified, infer label list from model output.
            # We need to copy the input data as the model might mutate the input data.
            y_pred = predict_fn(X_df.copy()) if predict_fn else self.dataset.predictions_data
            self.label_list = np.unique(np.concatenate([self.y_true, y_pred]))

        try:
            if algorithm:
                if algorithm == "kernel":
                    # We need to lazily import shap, so lazily import `_PatchedKernelExplainer`
                    from mlflow.models.evaluation._shap_patch import _PatchedKernelExplainer

                    kernel_link = self.evaluator_config.get(
                        "explainability_kernel_link", "identity"
                    )
                    if kernel_link not in ["identity", "logit"]:
                        raise ValueError(
                            "explainability_kernel_link config can only be set to 'identity' or "
                            f"'logit', but got '{kernel_link}'."
                        )
                    background_X = shap.sample(X_df, sample_rows, random_state=3)
                    background_X = background_X.fillna(mode_or_mean_dict)

                    explainer = _PatchedKernelExplainer(
                        shap_predict_fn, background_X, link=kernel_link
                    )
                else:
                    explainer = shap.Explainer(
                        shap_predict_fn,
                        sampled_X,
                        feature_names=self.dataset.feature_names,
                        algorithm=algorithm,
                    )
            else:
                if (
                    raw_model
                    and not len(self.label_list) > 2
                    and not isinstance(raw_model, sk_Pipeline)
                ):
                    # For mulitnomial classifier, shap.Explainer may choose Tree/Linear explainer
                    # for raw model, this case shap plot doesn't support it well, so exclude the
                    # multinomial_classifier case here.
                    explainer = shap.Explainer(
                        raw_model, sampled_X, feature_names=self.dataset.feature_names
                    )
                else:
                    # fallback to default explainer
                    explainer = shap.Explainer(
                        shap_predict_fn, sampled_X, feature_names=self.dataset.feature_names
                    )

            _logger.info(f"Shap explainer {explainer.__class__.__name__} is used.")

            if algorithm == "kernel":
                shap_values = shap.Explanation(
                    explainer.shap_values(sampled_X), feature_names=self.dataset.feature_names
                )
            else:
                shap_values = explainer(sampled_X)
        except Exception as e:
            # Shap evaluation might fail on some edge cases, e.g., unsupported input data values
            # or unsupported model on specific shap explainer. Catch exception to prevent it
            # breaking the whole `evaluate` function.

            if not self.evaluator_config.get("ignore_exceptions", True):
                raise e

            _logger.warning(
                f"Shap evaluation failed. Reason: {e!r}. "
                "Set logging level to DEBUG to see the full traceback."
            )
            _logger.debug("", exc_info=True)
            return

        if self.evaluator_config.get("log_explainer", False):
            try:
                mlflow.shap.log_explainer(explainer, name="explainer")
            except Exception as e:
                # TODO: The explainer saver is buggy, if `get_underlying_model_flavor` return
                #   "unknown", then fallback to shap explainer saver, and shap explainer will call
                #   `model.save` for sklearn model, there is no `.save` method, so error will
                #   happen.
                _logger.warning(
                    f"Logging explainer failed. Reason: {e!r}. "
                    "Set logging level to DEBUG to see the full traceback."
                )
                _logger.debug("", exc_info=True)

        def _adjust_color_bar():
            pyplot.gcf().axes[-1].set_aspect("auto")
            pyplot.gcf().axes[-1].set_box_aspect(50)

        def _adjust_axis_tick():
            pyplot.xticks(fontsize=10)
            pyplot.yticks(fontsize=10)

        def plot_beeswarm():
            shap.plots.beeswarm(shap_values, show=False, color_bar=True)
            _adjust_color_bar()
            _adjust_axis_tick()

        with _suppress_class_imbalance_errors(ValueError, log_warning=False):
            self._log_image_artifact(
                plot_beeswarm,
                "shap_beeswarm_plot",
            )

        def plot_summary():
            shap.summary_plot(shap_values, show=False, color_bar=True)
            _adjust_color_bar()
            _adjust_axis_tick()

        with _suppress_class_imbalance_errors(TypeError, log_warning=False):
            self._log_image_artifact(
                plot_summary,
                "shap_summary_plot",
            )

        def plot_feature_importance():
            shap.plots.bar(shap_values, show=False)
            _adjust_axis_tick()

        with _suppress_class_imbalance_errors(IndexError, log_warning=False):
            self._log_image_artifact(
                plot_feature_importance,
                "shap_feature_importance_plot",
            )

        return EvaluationResult(
            metrics=self.aggregate_metrics,
            artifacts=self.artifacts,
            run_id=self.run_id,
        )


def _compute_df_mode_or_mean(df):
    """
    Compute mean (for continuous columns) and compute mode (for other columns) for the
    input dataframe, return a dict, key is column name, value is the corresponding mode or
    mean value, this function calls `_is_continuous` to determine whether the
    column is continuous column.
    """
    continuous_cols = [c for c in df.columns if _is_continuous(df[c])]
    df_cont = df[continuous_cols]
    df_non_cont = df.drop(continuous_cols, axis=1)

    means = {} if df_cont.empty else df_cont.mean().to_dict()
    modes = {} if df_non_cont.empty else df_non_cont.mode().loc[0].to_dict()
    return {**means, **modes}
```

--------------------------------------------------------------------------------

---[FILE: metric.py]---
Location: mlflow-master/mlflow/models/evaluation/utils/metric.py

```python
import logging
from dataclasses import dataclass
from typing import Any, Callable

import numpy as np

from mlflow.metrics.base import MetricValue
from mlflow.models.evaluation.base import EvaluationMetric

_logger = logging.getLogger(__name__)


@dataclass
class MetricDefinition:
    """
    A dataclass representing a metric definition used in model evaluation.

    Attributes:
        function: The metric function to be called for evaluation.
        name: The name of the metric.
        index: The index of the metric in the ``extra_metrics`` argument of ``mlflow.evaluate``.
        version: (Optional) The metric version. For example v1.
        genai_metric_args: (Optional) A dictionary containing arguments specified by users when
            calling make_genai_metric or make_genai_metric_from_prompt.
            Those args are persisted so that we can deserialize the same metric object later.
    """

    function: Callable[..., Any]
    name: str
    index: int
    version: str | None = None
    genai_metric_args: dict[str, Any] | None = None

    @classmethod
    def from_index_and_metric(cls, index: int, metric: EvaluationMetric):
        return cls(
            function=metric.eval_fn,
            index=index,
            name=metric.name,
            version=metric.version,
            genai_metric_args=metric.genai_metric_args,
        )

    def evaluate(self, eval_fn_args) -> MetricValue | None:
        """
        This function calls the metric function and performs validations on the returned
        result to ensure that they are in the expected format. It will warn and will not log metrics
        that are in the wrong format.

        Args:
            eval_fn_args: A dictionary of args needed to compute the eval metrics.

        Returns:
            MetricValue
        """
        if self.index < 0:
            exception_header = f"Did not log builtin metric '{self.name}' because it"
        else:
            exception_header = (
                f"Did not log metric '{self.name}' at index "
                f"{self.index} in the `extra_metrics` parameter because it"
            )

        metric: MetricValue = self.function(*eval_fn_args)

        def _is_numeric(value):
            return isinstance(value, (int, float, np.number))

        def _is_string(value):
            return isinstance(value, str)

        if metric is None:
            _logger.warning(f"{exception_header} returned None.")
            return

        if _is_numeric(metric):
            return MetricValue(aggregate_results={self.name: metric})

        if not isinstance(metric, MetricValue):
            _logger.warning(f"{exception_header} did not return a MetricValue.")
            return

        scores = metric.scores
        justifications = metric.justifications
        aggregates = metric.aggregate_results

        if scores is not None:
            if not isinstance(scores, list):
                _logger.warning(
                    f"{exception_header} must return MetricValue with scores as a list."
                )
                return
            if any(not (_is_numeric(s) or _is_string(s) or s is None) for s in scores):
                _logger.warning(
                    f"{exception_header} must return MetricValue with numeric or string scores."
                )
                return

        if justifications is not None:
            if not isinstance(justifications, list):
                _logger.warning(
                    f"{exception_header} must return MetricValue with justifications as a list."
                )
                return
            if any(not (_is_string(just) or just is None) for just in justifications):
                _logger.warning(
                    f"{exception_header} must return MetricValue with string justifications."
                )
                return

        if aggregates is not None:
            if not isinstance(aggregates, dict):
                _logger.warning(
                    f"{exception_header} must return MetricValue with aggregate_results as a dict."
                )
                return

            if any(
                not (isinstance(k, str) and (_is_numeric(v) or v is None))
                for k, v in aggregates.items()
            ):
                _logger.warning(
                    f"{exception_header} must return MetricValue with aggregate_results with "
                    "str keys and numeric values."
                )
                return

        return metric
```

--------------------------------------------------------------------------------

---[FILE: trace.py]---
Location: mlflow-master/mlflow/models/evaluation/utils/trace.py

```python
import contextlib
import inspect
import logging
from typing import Any, Callable

from mlflow.ml_package_versions import FLAVOR_TO_MODULE_NAME
from mlflow.utils.autologging_utils import (
    AUTOLOGGING_INTEGRATIONS,
    autologging_conf_lock,
    get_autolog_function,
    is_autolog_supported,
)
from mlflow.utils.autologging_utils.safety import revert_patches
from mlflow.utils.import_hooks import (
    _post_import_hooks,
    get_post_import_hooks,
    register_post_import_hook,
)

_logger = logging.getLogger(__name__)


# This flag is used to display the message only once when tracing is enabled during the evaluation.
_SHOWN_TRACE_MESSAGE_BEFORE = False


@contextlib.contextmanager
@autologging_conf_lock
def configure_autologging_for_evaluation(enable_tracing: bool = True):
    """
    Temporarily override the autologging configuration for all flavors during the model evaluation.
    For example, model auto-logging must be disabled during the evaluation. After the evaluation
    is done, the original autologging configurations are restored.

    Args:
        enable_tracing (bool): Whether to enable tracing for the supported flavors during eval.
    """
    original_import_hooks = {}
    new_import_hooks = {}

    # AUTOLOGGING_INTEGRATIONS can change during we iterate over flavors and enable/disable
    # autologging, therefore, we snapshot the current configuration to restore it later.
    global_config_snapshot = AUTOLOGGING_INTEGRATIONS.copy()

    for flavor in FLAVOR_TO_MODULE_NAME:
        if not is_autolog_supported(flavor):
            continue

        original_config = global_config_snapshot.get(flavor, {}).copy()

        # If autologging is explicitly disabled, do nothing.
        if original_config.get("disable", False):
            continue

        # NB: Using post-import hook to configure the autologging lazily when the target
        # flavor's module is imported, rather than configuring it immediately. This is
        # because the evaluation code usually only uses a subset of the supported flavors,
        # hence we want to avoid unnecessary overhead of configuring all flavors.
        @autologging_conf_lock
        def _setup_autolog(module):
            try:
                autolog = get_autolog_function(flavor)

                # If tracing is supported and not explicitly disabled, enable it.
                if enable_tracing and _should_enable_tracing(flavor, global_config_snapshot):
                    new_config = {
                        k: False if k.startswith("log_") else v for k, v in original_config.items()
                    }
                    # log_models needs to be disabled
                    # so we don't init LoggedModels during eval for some GenAI flavors
                    new_config |= {"log_traces": True, "silent": True, "log_models": False}
                    _kwargs_safe_invoke(autolog, new_config)

                    global _SHOWN_TRACE_MESSAGE_BEFORE
                    if not _SHOWN_TRACE_MESSAGE_BEFORE:
                        _logger.info(
                            "Auto tracing is temporarily enabled during the model evaluation "
                            "for computing some metrics and debugging. To disable tracing, call "
                            "`mlflow.autolog(disable=True)`."
                        )
                        _SHOWN_TRACE_MESSAGE_BEFORE = True
                else:
                    autolog(disable=True)

            except Exception:
                _logger.debug(f"Failed to update autologging config for {flavor}.", exc_info=True)

        module = FLAVOR_TO_MODULE_NAME[flavor]
        try:
            original_import_hooks[module] = get_post_import_hooks(module)
            new_import_hooks[module] = _setup_autolog
            register_post_import_hook(_setup_autolog, module, overwrite=True)
        except Exception:
            _logger.debug(f"Failed to register post-import hook for {flavor}.", exc_info=True)

    try:
        yield
    finally:
        # Remove post-import hooks and patches the are registered during the evaluation.
        for module, hooks in new_import_hooks.items():
            # Restore original post-import hooks if any. Note that we don't use
            # register_post_import_hook method to bypass some pre-checks and just
            # restore the original state.
            if hooks is None:
                _post_import_hooks.pop(module, None)
            else:
                _post_import_hooks[module] = original_import_hooks[module]

        # If any autologging configuration is updated, restore original autologging configurations.
        for flavor, new_config in AUTOLOGGING_INTEGRATIONS.copy().items():
            original_config = global_config_snapshot.get(flavor)
            if original_config != new_config:
                try:
                    autolog = get_autolog_function(flavor)
                    if original_config:
                        _kwargs_safe_invoke(autolog, original_config)
                        AUTOLOGGING_INTEGRATIONS[flavor] = original_config
                    else:
                        # If the original configuration is empty, autologging was not enabled before
                        autolog(disable=True)
                        # Remove all safe_patch applied by autologging
                        revert_patches(flavor)
                        # We also need to remove the config entry from AUTOLOGGING_INTEGRATIONS,
                        # so as not to confuse with the case user explicitly disabled autologging.
                        AUTOLOGGING_INTEGRATIONS.pop(flavor, None)
                except ImportError:
                    pass
                except Exception as e:
                    if original_config is None or (
                        not original_config.get("disable", False)
                        and not original_config.get("silent", False)
                    ):
                        _logger.warning(
                            f"Exception raised while calling autologging for {flavor}: {e}"
                        )


def _should_enable_tracing(flavor: str, autologging_config: dict[str, Any]) -> bool:
    """
    Check if tracing should be enabled for the given flavor during the model evaluation.
    """
    # 1. Check if the autologging or tracing is globally disabled
    # TODO: This check should not take precedence over the flavor-specific configuration
    # set by the explicit mlflow.<flavor>.autolog() call by users.
    # However, in Databricks, sometimes mlflow.<flavor>.autolog() is automatically
    # called in the kernel startup, which is confused with the user's action. In
    # such cases, even when user disables autologging globally, the flavor-specific
    # autologging remains enabled. We are going to fix the Databricks side issue,
    # and after that, we should move this check down after the flavor-specific check.
    global_config = autologging_config.get("mlflow", {})
    if global_config.get("disable", False) or (not global_config.get("log_traces", True)):
        return False

    if not _is_trace_autologging_supported(flavor):
        return False

    # 3. Check if tracing is explicitly disabled for the flavor
    flavor_config = autologging_config.get(flavor, {})
    return flavor_config.get("log_traces", True)


def _kwargs_safe_invoke(func: Callable[..., Any], kwargs: dict[str, Any]):
    """
    Invoke the function with the given dictionary as keyword arguments, but only include the
    arguments that are present in the function's signature.

    This is particularly used for calling autolog() function with the configuration dictionary
    stored in AUTOLOGGING_INTEGRATIONS. While the config keys mostly align with the autolog()'s
    signature by design, some keys are not present in autolog(), such as "globally_configured".
    """
    sig = inspect.signature(func)
    return func(**{k: v for k, v in kwargs.items() if k in sig.parameters})


def _is_trace_autologging_supported(flavor_name: str) -> bool:
    """Check if the given flavor supports trace autologging."""
    if autolog_func := get_autolog_function(flavor_name):
        return "log_traces" in inspect.signature(autolog_func).parameters
    return False
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/models/evaluation/utils/__init__.py

```python
# Utils package for model evaluation
```

--------------------------------------------------------------------------------

---[FILE: agent_evaluation_template.html]---
Location: mlflow-master/mlflow/models/notebook_resources/agent_evaluation_template.html

```text
<head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/xcode.min.css"
  />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>
    hljs.highlightAll();
  </script>
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
        Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji,
        Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      margin: 0;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      color: rgb(17, 23, 28);
    }
    code {
      line-height: 18px;
      font-size: 11px;
      background: rgb(250, 250, 250) !important;
    }
    pre {
      background: rgb(250, 250, 250);
      margin: 0;
      display: none;
    }
    pre.active {
      display: unset;
    }
    button {
      white-space: nowrap;
      text-align: center;
      position: relative;
      cursor: pointer;
      background: rgba(34, 114, 180, 0) !important;
      color: rgb(34, 114, 180) !important;
      border-color: rgba(34, 114, 180, 0) !important;
      padding: 4px 6px !important;
      text-decoration: none !important;
      line-height: 20px !important;
      box-shadow: none !important;
      height: 32px !important;
      display: inline-flex !important;
      -webkit-box-align: center !important;
      align-items: center !important;
      -webkit-box-pack: center !important;
      justify-content: center !important;
      vertical-align: middle !important;
    }
    p {
      margin: 0;
      padding: 0;
    }
    button:hover {
      background: rgba(34, 114, 180, 0.08) !important;
      color: rgb(14, 83, 139) !important;
    }
    button:active {
      background: rgba(34, 114, 180, 0.16) !important;
      color: rgb(4, 53, 93) !important;
    }
    h1 {
      margin-top: 4px;
      font-size: 22px;
    }
    .info {
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      color: rgb(95, 114, 129);
    }
    .tabs {
      margin-top: 10px;
      border-bottom: 1px solid rgb(209, 217, 225) !important;
      display: flex;
      line-height: 24px;
    }
    .tab {
      font-size: 13px;
      font-weight: 600 !important;
      cursor: pointer;
      margin: 0 24px 0 2px;
      padding-left: 2px;
    }
    .tab:hover {
      color: rgb(14, 83, 139) !important;
    }
    .tab.active {
      border-bottom: 3px solid rgb(34, 114, 180) !important;
    }
    .link {
      margin-left: 12px;
      display: inline-block;
      text-decoration: none;
      color: rgb(34, 114, 180) !important;
      font-size: 13px;
      font-weight: 400;
    }
    .link:hover {
      color: rgb(14, 83, 139) !important;
    }
    .link-content {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .caret-up {
      transform: rotate(180deg);
    }
  </style>
</head>
<body>
  <div style="display: flex; align-items: center">
    The logged model is compatible with the Mosaic AI Agent Framework.
    <button onclick="toggleCode()">
      See how to evaluate the model&nbsp;
      <span
        role="img"
        id="caret"
        aria-hidden="true"
        class="anticon css-6xix1i"
        style="font-size: 14px"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="none"
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
          class=""
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M8 8.917 10.947 6 12 7.042 8 11 4 7.042 5.053 6z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </span>
    </button>
  </div>
  <div id="code" style="display: none">
    <h1>
      Agent evaluation
      <a
        class="link"
        href="https://docs.databricks.com/en/generative-ai/agent-evaluation/synthesize-evaluation-set.html?utm_source=mlflow.log_model&utm_medium=notebook"
        target="_blank"
      >
        <span class="link-content">
          Learn more
          <span role="img" aria-hidden="true" class="anticon css-6xix1i"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              fill="none"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
              class=""
            >
              <path
                fill="currentColor"
                d="M10 1h5v5h-1.5V3.56L8.53 8.53 7.47 7.47l4.97-4.97H10z"
              ></path>
              <path
                fill="currentColor"
                d="M1 2.75A.75.75 0 0 1 1.75 2H8v1.5H2.5v10h10V8H14v6.25a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75z"
              ></path></svg></span></span
      ></a>
    </h1>
    <p class="info">
      Copy the following code snippet in a notebook cell (right click → copy)
    </p>
    <div class="tabs">
      <div class="tab active" onclick="tabClicked(0)">Using synthetic data</div>
      <div class="tab" onclick="tabClicked(1)">Using your own dataset</div>
    </div>
    <div style="height: 472px">
      <pre
        class="active"
      ><code class="language-python">{{eval_with_synthetic_code}}</code></pre>

      <pre><code class="language-python">{{eval_with_dataset_code}}</code></pre>
    </div>
  </div>
  <script>
    var codeShown = false;
    function clip(el) {
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }

    function toggleCode() {
      if (codeShown) {
        document.getElementById("code").style.display = "none";
        codeShown = false;
      } else {
        document.getElementById("code").style.display = "block";
        clip(document.querySelector("pre.active"));
        codeShown = true;
      }
      document.getElementById("caret").classList.toggle("caret-up");
    }

    function tabClicked(tabIndex) {
      document.querySelectorAll(".tab").forEach((tab, index) => {
        if (index === tabIndex) {
          tab.classList.add("active");
        } else {
          tab.classList.remove("active");
        }
      });
      document.querySelectorAll("pre").forEach((pre, index) => {
        if (index === tabIndex) {
          pre.classList.add("active");
        } else {
          pre.classList.remove("active");
        }
      });
      clip(document.querySelector("pre.active"));
    }
  </script>
</body>
```

--------------------------------------------------------------------------------

---[FILE: eval_with_dataset_example.py]---
Location: mlflow-master/mlflow/models/notebook_resources/eval_with_dataset_example.py

```python
# ruff: noqa: F821, I001
{{pipInstall}}

import pandas as pd
import mlflow

evals = [
    {
        "request": {
            "messages": [
                {"role": "user", "content": "How do I convert a Spark DataFrame to Pandas?"}
            ],
        },
        # Optional, needed for judging correctness.
        "expected_facts": [
            "To convert a Spark DataFrame to Pandas, you can use the toPandas() method."
        ],
    }
]
eval_result = mlflow.evaluate(
    data=pd.DataFrame.from_records(evals), model="{{modelUri}}", model_type="databricks-agent"
)
```

--------------------------------------------------------------------------------

---[FILE: eval_with_synthetic_example.py]---
Location: mlflow-master/mlflow/models/notebook_resources/eval_with_synthetic_example.py

```python
# ruff: noqa: F821, I001
{{pipInstall}}

from databricks.agents.evals import generate_evals_df
import mlflow

agent_description = "A chatbot that answers questions about Databricks."
question_guidelines = """
# User personas
- A developer new to the Databricks platform
# Example questions
- What API lets me parallelize operations over rows of a delta table?
"""
# TODO: Spark/Pandas DataFrame with "content" and "doc_uri" columns.
docs = spark.table("catalog.schema.my_table_of_docs")
evals = generate_evals_df(
    docs=docs,
    num_evals=25,
    agent_description=agent_description,
    question_guidelines=question_guidelines,
)
eval_result = mlflow.evaluate(data=evals, model="{{modelUri}}", model_type="databricks-agent")
```

--------------------------------------------------------------------------------

````
