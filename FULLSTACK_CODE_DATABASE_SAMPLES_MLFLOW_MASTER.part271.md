---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 271
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 271 of 991)

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

---[FILE: utils.py]---
Location: mlflow-master/mlflow/genai/evaluation/utils.py

```python
import json
import logging
import math
from typing import TYPE_CHECKING, Any, Collection

from mlflow.entities import Assessment, Trace, TraceData
from mlflow.entities.assessment import DEFAULT_FEEDBACK_NAME, Feedback
from mlflow.entities.assessment_source import AssessmentSource, AssessmentSourceType
from mlflow.entities.evaluation_dataset import EvaluationDataset as EntityEvaluationDataset
from mlflow.exceptions import MlflowException
from mlflow.genai.datasets import EvaluationDataset as ManagedEvaluationDataset
from mlflow.genai.evaluation.constant import (
    AgentEvaluationReserverKey,
)
from mlflow.genai.scorers import Scorer
from mlflow.models import EvaluationMetric
from mlflow.tracing.utils.search import traces_to_df

try:
    # `pandas` is not required for `mlflow-skinny`.
    import pandas as pd
except ImportError:
    pass

if TYPE_CHECKING:
    from mlflow.entities.evaluation_dataset import EvaluationDataset as EntityEvaluationDataset
    from mlflow.genai.datasets import EvaluationDataset as ManagedEvaluationDataset

    try:
        import pyspark.sql.dataframe

        EvaluationDatasetTypes = (
            pd.DataFrame
            | pyspark.sql.dataframe.DataFrame
            | list[dict]
            | list[Trace]
            | ManagedEvaluationDataset
            | EntityEvaluationDataset
        )
    except ImportError:
        EvaluationDatasetTypes = (
            pd.DataFrame
            | list[dict]
            | list[Trace]
            | ManagedEvaluationDataset
            | EntityEvaluationDataset
        )


_logger = logging.getLogger(__name__)

USER_DEFINED_ASSESSMENT_NAME_KEY = "_user_defined_assessment_name"
PGBAR_FORMAT = (
    "{l_bar}{bar}| {n_fmt}/{total_fmt} [Elapsed: {elapsed}, Remaining: {remaining}] {postfix}"
)


def _get_eval_data_type(data: "EvaluationDatasetTypes") -> dict[str, Any]:
    data_type = type(data)

    if data_type is list:
        if len(data) > 0 and all(isinstance(item, Trace) for item in data):
            return {"eval_data_type": "list[Trace]"}
        return {"eval_data_type": "list[dict]"}

    if data_type is EntityEvaluationDataset:
        return {"eval_data_type": "EntityEvaluationDataset"}
    if data_type is ManagedEvaluationDataset:
        return {"eval_data_type": "EvaluationDataset"}

    module = data_type.__module__
    qualname = data_type.__qualname__

    if qualname == "DataFrame":
        if module.startswith("pandas"):
            return {"eval_data_type": "pd.DataFrame"}
        if module.startswith("pyspark"):
            return {"eval_data_type": "pyspark.sql.DataFrame"}

    return "unknown"


def _get_eval_data_size_and_fields(df: "pd.DataFrame") -> dict[str, Any]:
    input_columns = set(df.columns.tolist())
    relevant_fields = {"inputs", "outputs", "trace", "expectations"}
    return {
        "eval_data_size": len(df),
        "eval_data_provided_fields": sorted(input_columns & relevant_fields),
    }


def _convert_eval_set_to_df(data: "EvaluationDatasetTypes") -> "pd.DataFrame":
    """
    Takes in a dataset in the format that `mlflow.genai.evaluate()` expects and
    converts it into a pandas DataFrame.
    """
    if isinstance(data, list):
        if all(isinstance(item, Trace) for item in data):
            data = traces_to_df(data)
        else:
            for item in data:
                if not isinstance(item, dict):
                    raise MlflowException.invalid_parameter_value(
                        "Every item in the list must be a dictionary."
                    )
        df = pd.DataFrame(data)
    elif isinstance(data, pd.DataFrame):
        # Data is already a pd DataFrame, just copy it
        df = data.copy()
    elif isinstance(data, (EntityEvaluationDataset, ManagedEvaluationDataset)):
        df = data.to_df()
    else:
        try:
            from mlflow.utils.spark_utils import get_spark_dataframe_type

            if isinstance(data, get_spark_dataframe_type()):
                df = _deserialize_inputs_and_expectations_column(data.toPandas())
            else:
                raise MlflowException.invalid_parameter_value(
                    "Invalid type for parameter `data`. Expected a list of dictionaries, "
                    f"a pandas DataFrame, or a Spark DataFrame. Got: {type(data)}"
                )
        except ImportError:
            raise ImportError(
                "The `pyspark` package is required to use mlflow.genai.evaluate() "
                "Please install it with `pip install pyspark`."
            )

    if len(df) == 0:
        raise MlflowException.invalid_parameter_value(
            "The dataset is empty. Please provide a non-empty dataset."
        )

    if not any(col in df.columns for col in ("trace", "inputs")):
        raise MlflowException.invalid_parameter_value(
            "Either `inputs` or `trace` column is required in the dataset. Please provide inputs "
            "for every datapoint or provide a trace."
        )

    return df


def _convert_to_eval_set(data: "EvaluationDatasetTypes") -> "pd.DataFrame":
    """
    Takes in a dataset in the multiple format that mlflow.genai.evaluate() expects and converts
    it into a standardized Pandas DataFrame.
    """
    df = _convert_eval_set_to_df(data)

    return (
        df.pipe(_deserialize_trace_column_if_needed)
        .pipe(_extract_request_response_from_trace)
        .pipe(_extract_expectations_from_trace)
    )


def _deserialize_inputs_and_expectations_column(df: "pd.DataFrame") -> "pd.DataFrame":
    """
    Deserialize the `inputs` and `expectations` string columns from the dataframe.

    When managed datasets are read as Spark DataFrames, the `inputs` and `expectations` columns
    are loaded as string columns of JSON strings. This function deserializes these columns into
    dictionaries expected by mlflow.genai.evaluate().
    """
    target_columns = ["inputs", "expectations"]
    for col in target_columns:
        if col not in df.columns or not isinstance(df[col][0], str):
            continue

        try:
            df[col] = df[col].apply(json.loads)
        except json.JSONDecodeError as e:
            if col == "inputs":
                msg = (
                    "The `inputs` column must be a valid JSON string of field names and values. "
                    "For example, `{'question': 'What is the capital of France?'}`"
                )
            else:
                msg = (
                    "The `expectations` column must be a valid JSON string of assessment names and "
                    "values. For example, `{'expected_facts': ['fact1', 'fact2']}`"
                )
            raise MlflowException.invalid_parameter_value(
                f"Failed to parse `{col}` column. Error: {e}\nHint: {msg}"
            )

    return df


def _deserialize_trace_column_if_needed(df: "pd.DataFrame") -> "pd.DataFrame":
    """
    Deserialize the `trace` column from the dataframe if it is a string.

    Since MLflow 3.2.0, mlflow.search_traces() returns a pandas DataFrame with a `trace`
    column that is a trace json representation rather than the Trace object itself. This
    function deserializes the `trace` column into a Trace object.
    """
    if "trace" in df.columns:
        df["trace"] = df["trace"].apply(lambda t: Trace.from_json(t) if isinstance(t, str) else t)
    return df


def _extract_request_response_from_trace(df: "pd.DataFrame") -> "pd.DataFrame":
    """
    Add `inputs` and `outputs` columns from traces if it is not already present.
    """
    if "trace" not in df.columns:
        return df

    def _extract_attribute(trace_data: TraceData, attribute_name: str) -> Any:
        if att := getattr(trace_data, attribute_name, None):
            return json.loads(att)
        return None

    def _safe_extract_from_root_span(trace: Trace, attribute: str) -> Any:
        """Safely extract an attribute from the root span, returning None if root span is None."""
        root_span = trace.data._get_root_span()
        if root_span is None:
            return None
        return getattr(root_span, attribute, None)

    if "inputs" not in df.columns:
        df["inputs"] = df["trace"].apply(
            lambda trace: _safe_extract_from_root_span(trace, "inputs")
        )
    if "outputs" not in df.columns:
        df["outputs"] = df["trace"].apply(
            lambda trace: _safe_extract_from_root_span(trace, "outputs")
        )

    # Warn once if any traces have missing root spans
    missing_root_span_mask = df["trace"].apply(lambda trace: trace.data._get_root_span() is None)
    if missing_root_span_mask.any():
        missing_count = missing_root_span_mask.sum()
        _logger.warning(
            f"{missing_count} trace(s) do not have a root span, so input and output data may be"
            " missing for these traces. This may occur if traces were fetched using"
            " search_traces(..., include_spans=False) and, if so, it can be resolved by fetching"
            " traces using search_traces(..., include_spans=True)."
        )

    return df


def _extract_expectations_from_trace(df: "pd.DataFrame") -> "pd.DataFrame":
    """
    Add `expectations` columns to the dataframe from assessments
    stored in the traces, if the "expectations" column is not already present.
    """
    if "trace" not in df.columns:
        return df

    expectations_column = []
    for trace in df["trace"]:
        expectations = {}
        for assessment in trace.info.assessments or []:
            if assessment.expectation is not None:
                expectations[assessment.name] = assessment.expectation.value
        expectations_column.append(expectations)
    # If no trace has assessments, not add the column
    if all(len(expectations) == 0 for expectations in expectations_column):
        return df

    df["expectations"] = expectations_column
    return df


def _convert_scorer_to_legacy_metric(scorer: Scorer) -> EvaluationMetric:
    """
    Takes in a Scorer object and converts it into a legacy MLflow 2.x
    Metric object.
    """
    try:
        from databricks.agents.evals import metric
    except ImportError:
        raise ImportError(
            "The `databricks-agents` package is required to use mlflow.genai.evaluate() "
            "Please install it with `pip install databricks-agents`."
        )

    from mlflow.genai.scorers.builtin_scorers import BuiltInScorer
    from mlflow.types.llm import ChatCompletionRequest

    def eval_fn(
        request_id: str,
        request: ChatCompletionRequest | str,
        response: Any | None,
        expected_response: Any | None,
        trace: Trace | None,
        guidelines: list[str] | dict[str, list[str]] | None,
        expected_facts: list[str] | None,
        expected_retrieved_context: list[dict[str, str]] | None,
        custom_expected: dict[str, Any] | None,
        **kwargs,
    ) -> int | float | bool | str | Assessment | list[Assessment]:
        # Condense all expectations into a single dict
        expectations = {}
        if expected_response is not None:
            expectations[AgentEvaluationReserverKey.EXPECTED_RESPONSE] = expected_response
        if expected_facts is not None:
            expectations[AgentEvaluationReserverKey.EXPECTED_FACTS] = expected_facts
        if expected_retrieved_context is not None:
            expectations[AgentEvaluationReserverKey.EXPECTED_RETRIEVED_CONTEXT] = (
                expected_retrieved_context
            )
        if guidelines is not None:
            expectations[AgentEvaluationReserverKey.GUIDELINES] = guidelines
        if custom_expected is not None:
            expectations.update(custom_expected)

        merged = {
            "inputs": request,
            "outputs": response,
            "expectations": expectations,
            "trace": trace,
        }
        return scorer.run(**merged)

    metric_instance = metric(
        eval_fn=eval_fn,
        name=scorer.name,
    )
    # Add aggregations as an attribute since the metric decorator doesn't accept it
    metric_instance.aggregations = scorer.aggregations
    # Add attribute to indicate if this is a built-in scorer
    metric_instance._is_builtin_scorer = isinstance(scorer, BuiltInScorer)

    return metric_instance


def standardize_scorer_value(scorer_name: str, value: Any) -> list[Feedback]:
    """
    Convert the scorer return value to a list of MLflow Assessment (Feedback) objects.

    Scorer can return:
    - A number, boolean, or string, a list of them.
    - An Feedback object
    - A list of Feedback objects

    All of the above will be converted to a list of Feedback objects.
    """
    # None is a valid metric value, return an empty list
    if value is None:
        return []

    # Primitives are valid metric values
    if isinstance(value, (int, float, bool, str)):
        return [
            Feedback(
                name=scorer_name,
                source=make_code_type_assessment_source(scorer_name),
                value=value,
            )
        ]

    if isinstance(value, Feedback):
        value.name = _get_custom_assessment_name(value, scorer_name)
        return [value]

    if isinstance(value, Collection):
        assessments = []
        for item in value:
            if isinstance(item, Feedback):
                # Scorer returns multiple assessments as a list.
                item.name = _get_custom_assessment_name(item, scorer_name)
                assessments.append(item)
            else:
                # If the item is not assessment, the list represents a single assessment
                # value of list type. Convert it to a Feedback object.
                assessments.append(
                    Feedback(
                        name=scorer_name,
                        source=make_code_type_assessment_source(scorer_name),
                        value=item,
                    )
                )
        return assessments

    raise MlflowException.invalid_parameter_value(
        f"Got unsupported result from scorer '{scorer_name}'. "
        f"Expected the metric value to be a number, or a boolean, or a string, "
        "or an Feedback, or a list of Feedbacks. "
        f"Got {value}.",
    )


def _get_custom_assessment_name(assessment: Feedback, scorer_name: str) -> str:
    """Get the name of the custom assessment. Use assessment name if present and not a builtin judge
    name, otherwise use the scorer name.

    Args:
        assessment: The assessment to get the name for.
        scorer_name: The name of the scprer.
    """
    # If the user didn't provide a name, use the scorer name
    if assessment.name == DEFAULT_FEEDBACK_NAME or (
        assessment.metadata is not None
        and assessment.metadata.get(USER_DEFINED_ASSESSMENT_NAME_KEY) == "false"
    ):
        return scorer_name
    return assessment.name


def make_code_type_assessment_source(scorer_name: str) -> AssessmentSource:
    return AssessmentSource(source_type=AssessmentSourceType.CODE, source_id=scorer_name)


def is_none_or_nan(value: Any) -> bool:
    """
    Checks whether a value is None or NaN.

    NB: This function does not handle pandas.NA.
    """
    # isinstance(value, float) check is needed to ensure that math.isnan is not called on an array.
    return value is None or (isinstance(value, float) and math.isnan(value))


def validate_tags(tags: Any) -> None:
    """
    Validate that tags are in the expected format: dict[str, str].

    Args:
        tags: The tags to validate.

    Raises:
        MlflowException: If tags are not in the correct format.
    """
    if is_none_or_nan(tags):
        return

    if not isinstance(tags, dict):
        raise MlflowException.invalid_parameter_value(
            f"Tags must be a dictionary, got {type(tags).__name__}. "
        )

    errors = [
        f"Key {key!r} has type {type(key).__name__}; expected str."
        for key in tags.keys()
        if not isinstance(key, str)
    ]

    if errors:
        raise MlflowException.invalid_parameter_value("Invalid tags:\n  - " + "\n  - ".join(errors))
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/evaluation/__init__.py

```python
from mlflow.genai.evaluation.base import evaluate, to_predict_fn

__all__ = ["evaluate", "to_predict_fn"]
```

--------------------------------------------------------------------------------

---[FILE: git_info.py]---
Location: mlflow-master/mlflow/genai/git_versioning/git_info.py

```python
import logging
from dataclasses import dataclass

from typing_extensions import Self

from mlflow.utils.mlflow_tags import (
    MLFLOW_GIT_BRANCH,
    MLFLOW_GIT_COMMIT,
    MLFLOW_GIT_DIFF,
    MLFLOW_GIT_DIRTY,
    MLFLOW_GIT_REPO_URL,
)

_logger = logging.getLogger(__name__)


class GitOperationError(Exception):
    """Raised when a git operation fails"""


@dataclass(kw_only=True)
class GitInfo:
    branch: str
    commit: str
    dirty: bool = False
    repo_url: str | None = None
    diff: str | None = None

    @classmethod
    def from_env(cls, remote_name: str) -> Self:
        try:
            import git
        except ImportError as e:
            # GitPython throws `ImportError` if `git` is unavailable.
            raise GitOperationError(str(e))

        # Create repo object once and extract all info
        try:
            repo = git.Repo()
        except git.InvalidGitRepositoryError as e:
            raise GitOperationError(f"Not in a git repository: {e}") from e

        try:
            # Get branch info
            if repo.head.is_detached:
                raise GitOperationError("In detached HEAD state, no branch name available")
            branch = repo.active_branch.name

            # Get commit info
            commit = repo.head.commit.hexsha

            # Check if repo is dirty
            dirty = repo.is_dirty(untracked_files=False)

            # Get git diff if dirty
            diff: str | None = None
            if dirty:
                # Get the diff of unstaged changes
                diff = repo.git.diff(cached=False)
                # Get staged changes
                if staged_diff := repo.git.diff(cached=True):
                    diff = (diff + "\n" + staged_diff) if diff else staged_diff

            # Get repository URL
            repo_url = next((r.url for r in repo.remotes if r.name == remote_name), None)
            if repo_url is None:
                _logger.warning(
                    f"No remote named '{remote_name}' found. Repository URL will not be set."
                )
            return cls(branch=branch, commit=commit, dirty=dirty, repo_url=repo_url, diff=diff)

        except git.GitError as e:
            raise GitOperationError(f"Failed to get repository information: {e}") from e

    def to_mlflow_tags(self) -> dict[str, str]:
        tags = {
            MLFLOW_GIT_BRANCH: self.branch,
            MLFLOW_GIT_COMMIT: self.commit,
            MLFLOW_GIT_DIRTY: str(self.dirty).lower(),
        }
        if self.repo_url is not None:
            tags[MLFLOW_GIT_REPO_URL] = self.repo_url
        if self.diff is not None:
            tags[MLFLOW_GIT_DIFF] = self.diff
        return tags

    def to_search_filter_string(self) -> str:
        """
        Generate a filter string for search_logged_models.
        Excludes MLFLOW_GIT_DIFF from the filter as it's not meant for searching.
        """
        tags = {
            MLFLOW_GIT_BRANCH: self.branch,
            MLFLOW_GIT_COMMIT: self.commit,
            MLFLOW_GIT_DIRTY: str(self.dirty).lower(),
        }
        if self.repo_url is not None:
            tags[MLFLOW_GIT_REPO_URL] = self.repo_url

        return " AND ".join(f"tags.`{k}` = '{v}'" for k, v in tags.items())
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/git_versioning/__init__.py

```python
import logging

from typing_extensions import Self

import mlflow
from mlflow.genai.git_versioning.git_info import GitInfo, GitOperationError
from mlflow.telemetry.events import GitModelVersioningEvent
from mlflow.telemetry.track import record_usage_event
from mlflow.tracking.fluent import _set_active_model
from mlflow.utils.annotations import experimental

_logger = logging.getLogger(__name__)


class GitContext:
    def __init__(self, remote_name: str = "origin") -> None:
        try:
            self.info = GitInfo.from_env(remote_name=remote_name)
        except GitOperationError as e:
            _logger.warning(
                f"Encountered an error while retrieving git information: {e}. "
                f"Git model versioning is disabled."
            )
            self.info = None
            self.active_model = None
            return

        git_tags = self.info.to_mlflow_tags()
        filter_string = self.info.to_search_filter_string()
        models = mlflow.search_logged_models(
            filter_string=filter_string,
            max_results=1,
            output_format="list",
        )
        match models:
            case [m]:
                _logger.info(
                    f"Using existing model with branch '{self.info.branch}', "
                    f"commit '{self.info.commit}', dirty state '{self.info.dirty}'."
                )
                model = m
                # Update tags to ensure they're current (especially git diff)
                mlflow.set_logged_model_tags(model_id=model.model_id, tags=git_tags)
            case _:
                _logger.info(
                    "No existing model found with the current git information. "
                    "Creating a new model."
                )
                model = mlflow.initialize_logged_model(tags=git_tags)

        self.active_model = _set_active_model(model_id=model.model_id)

    def __enter__(self) -> Self:
        return self

    def __exit__(self, exc_type, exc_value, traceback) -> None:
        disable_git_model_versioning()


# Global variable to track the active git context
_active_context: GitContext | None = None


@record_usage_event(GitModelVersioningEvent)
def _enable_git_model_versioning(remote_name: str) -> None:
    global _active_context
    context = GitContext(remote_name=remote_name)
    _active_context = context
    return context


@experimental(version="3.4.0")
def enable_git_model_versioning(remote_name: str = "origin") -> GitContext:
    """
    Enable automatic Git-based model versioning for MLflow traces.

    This function enables automatic version tracking based on your Git repository state.
    When enabled, MLflow will:
    - Detect the current Git branch, commit hash, and dirty state
    - Create or reuse a LoggedModel matching this exact Git state
    - Link all subsequent traces to this LoggedModel version
    - Capture uncommitted changes as diffs when the repository is dirty

    Args:
        remote_name: The name of the git remote to use for repository URL detection.
                    Defaults to "origin".

    Returns:
        A GitContext instance containing:
        - info: GitInfo object with branch, commit, dirty state, and diff information
        - active_model: The active LoggedModel linked to current Git state

    Example:

    .. code-block:: python

        import mlflow.genai

        # Enable Git-based versioning
        context = mlflow.genai.enable_git_model_versioning()
        print(f"Branch: {context.info.branch}, Commit: {context.info.commit[:8]}")
        # Output: Branch: main, Commit: abc12345


        # All traces are now automatically linked to this Git version
        @mlflow.trace
        def my_app():
            return "result"


        # Can also use as a context manager
        with mlflow.genai.enable_git_model_versioning() as context:
            # Traces within this block are linked to the Git version
            result = my_app()

    Note:
        If Git is not available or the current directory is not a Git repository,
        a warning is issued and versioning is disabled (context.info will be None).
    """
    return _enable_git_model_versioning(remote_name)


@experimental(version="3.4.0")
def disable_git_model_versioning() -> None:
    """
    Disable Git-based model versioning and clear the active model context.

    This function stops automatic Git-based version tracking and clears any active
    LoggedModel context. After calling this, traces will no longer be automatically
    linked to Git-based versions.

    This is automatically called when exiting a context manager created with
    enable_git_model_versioning().

    Example:

    .. code-block:: python

        import mlflow.genai

        # Enable versioning
        context = mlflow.genai.enable_git_model_versioning()
        # ... do work with versioning enabled ...

        # Disable versioning
        mlflow.genai.disable_git_model_versioning()
        # Traces are no longer linked to Git versions
    """
    global _active_context
    _active_context = None
    mlflow.clear_active_model()


def _get_active_git_context() -> GitContext | None:
    """
    Get the currently active git context, if any.

    Returns:
        The active GitContext instance or None if no context is active.
    """
    return _active_context
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: mlflow-master/mlflow/genai/judges/base.py
Signals: Pydantic

```python
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from pydantic import BaseModel, Field

from mlflow.entities.trace import Trace
from mlflow.genai.judges.constants import _RATIONALE_FIELD_DESCRIPTION, _RESULT_FIELD_DESCRIPTION
from mlflow.genai.judges.utils import get_default_optimizer
from mlflow.genai.scorers.base import Scorer, ScorerKind
from mlflow.telemetry.events import AlignJudgeEvent
from mlflow.telemetry.track import record_usage_event
from mlflow.utils.annotations import experimental


@experimental(version="3.4.0")
class AlignmentOptimizer(ABC):
    """
    Abstract base class for judge alignment optimizers.

    Alignment optimizers improve judge accuracy by learning from traces
    that contain human feedback.
    """

    @abstractmethod
    def align(self, judge: Judge, traces: list[Trace]) -> Judge:
        """
        Align a judge using the provided traces.

        Args:
            judge: The judge to be optimized
            traces: List of traces containing alignment data (feedback)

        Returns:
            A new Judge instance that is better aligned with the input traces.
        """


class JudgeField(BaseModel):
    """
    Represents a field definition for judges with name and description.

    Used to define input and output fields for judge evaluation signatures.
    """

    name: str = Field(..., description="Name of the field")
    description: str = Field(..., description="Description of what the field represents")
    value_type: Any = Field(default=str, description="Type of the field's value")


@experimental(version="3.4.0")
class Judge(Scorer):
    """
    Base class for LLM-as-a-judge scorers that can be aligned with human feedback.

    Judges are specialized scorers that use LLMs to evaluate outputs based on
    configurable criteria and the results of human-provided feedback alignment.
    """

    @property
    def kind(self) -> ScorerKind:
        return ScorerKind.BUILTIN

    @property
    @abstractmethod
    def instructions(self) -> str:
        """
        Plain text instructions of what this judge evaluates.
        """

    @abstractmethod
    def get_input_fields(self) -> list[JudgeField]:
        """
        Get the input fields for this judge.

        Returns:
            List of JudgeField objects defining the input fields.
        """

    @classmethod
    def get_output_fields(cls) -> list[JudgeField]:
        """
        Get the standard output fields used by all judges.
        This is the source of truth for judge output field definitions.

        Returns:
            List of JudgeField objects defining the standard output fields.
        """
        return [
            JudgeField(name="result", description=_RESULT_FIELD_DESCRIPTION, value_type=str),
            JudgeField(
                name="rationale",
                description=_RATIONALE_FIELD_DESCRIPTION,
                value_type=str,
            ),
        ]

    @experimental(version="3.4.0")
    @record_usage_event(AlignJudgeEvent)
    def align(self, traces: list[Trace], optimizer: AlignmentOptimizer | None = None) -> Judge:
        """
        Align this judge with human preferences using the provided optimizer and traces.

        Args:
            traces: Training traces for alignment
            optimizer: The alignment optimizer to use. If None, uses the default SIMBA optimizer.

        Returns:
            A new Judge instance that is better aligned with the input traces.

        Raises:
            NotImplementedError: If called on a session-level scorer. Alignment is currently
                only supported for single-turn scorers.

        Note on Logging:
            By default, alignment optimization shows minimal progress information.
            To see detailed optimization output, set the optimizer's logger to DEBUG::

                import logging

                # For SIMBA optimizer (default)
                logging.getLogger("mlflow.genai.judges.optimizers.simba").setLevel(logging.DEBUG)
        """
        if self.is_session_level_scorer:
            raise NotImplementedError("Alignment is not supported for session-level scorers.")

        if optimizer is None:
            optimizer = get_default_optimizer()
        return optimizer.align(self, traces)
```

--------------------------------------------------------------------------------

````
