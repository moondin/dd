---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 281
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 281 of 991)

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

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/labeling/__init__.py

```python
"""
Databricks Agent Labeling Python SDK. For more details see Databricks Agent Evaluation:
<https://docs.databricks.com/en/generative-ai/agent-evaluation/index.html>

The API docs can be found here:
<https://api-docs.databricks.com/python/databricks-agents/latest/databricks_agent_eval.html#review-app>
"""

from typing import Any

from mlflow.genai.labeling.databricks_utils import get_databricks_review_app
from mlflow.genai.labeling.labeling import Agent, LabelingSession, ReviewApp
from mlflow.genai.labeling.stores import _get_labeling_store


def get_review_app(experiment_id: str | None = None) -> "ReviewApp":
    """Gets or creates (if it doesn't exist) the review app for the given experiment ID.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.

    Args:
        experiment_id: Optional. The experiment ID for which to get the review app. If not provided,
            the experiment ID is inferred from the current active environment.

    Returns:
        ReviewApp: The review app.
    """
    return ReviewApp(get_databricks_review_app(experiment_id))


def create_labeling_session(
    name: str,
    *,
    assigned_users: list[str] | None = None,
    agent: str | None = None,
    label_schemas: list[str] | None = None,
    enable_multi_turn_chat: bool = False,
    custom_inputs: dict[str, Any] | None = None,
) -> LabelingSession:
    """Create a new labeling session in the review app.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.

    Args:
        name: The name of the labeling session.
        assigned_users: The users that will be assigned to label items in the session.
        agent: The agent to be used to generate responses for the items in the session.
        label_schemas: The label schemas to be used in the session.
        enable_multi_turn_chat: Whether to enable multi-turn chat labeling for the session.
        custom_inputs: Optional. Custom inputs to be used in the session.

    Returns:
        LabelingSession: The created labeling session.
    """
    store = _get_labeling_store()
    return store.create_labeling_session(
        name=name,
        assigned_users=assigned_users,
        agent=agent,
        label_schemas=label_schemas,
        enable_multi_turn_chat=enable_multi_turn_chat,
        custom_inputs=custom_inputs,
    )


def get_labeling_sessions() -> list[LabelingSession]:
    """Get all labeling sessions from the review app.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.

    Returns:
        list[LabelingSession]: The list of labeling sessions.
    """
    store = _get_labeling_store()
    return store.get_labeling_sessions()


def get_labeling_session(run_id: str) -> LabelingSession:
    """Get a labeling session from the review app.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.

    Args:
        run_id: The mlflow run ID of the labeling session to get.

    Returns:
        LabelingSession: The labeling session.
    """
    store = _get_labeling_store()
    return store.get_labeling_session(run_id)


def delete_labeling_session(labeling_session: LabelingSession):
    """Delete a labeling session from the review app.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.

    Args:
        labeling_session: The labeling session to delete.
    """
    store = _get_labeling_store()
    store.delete_labeling_session(labeling_session)

    # For backwards compatibility, return a ReviewApp instance only if using Databricks store
    from mlflow.genai.labeling.stores import DatabricksLabelingStore

    if isinstance(store, DatabricksLabelingStore):
        return ReviewApp(get_databricks_review_app())
    else:
        # For non-Databricks stores, we can't return a meaningful ReviewApp
        return None


__all__ = [
    "Agent",
    "LabelingSession",
    "ReviewApp",
    "get_review_app",
    "create_labeling_session",
    "get_labeling_sessions",
    "get_labeling_session",
    "delete_labeling_session",
]
```

--------------------------------------------------------------------------------

---[FILE: label_schemas.py]---
Location: mlflow-master/mlflow/genai/label_schemas/label_schemas.py

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TYPE_CHECKING, TypeVar

from mlflow.genai.utils.enum_utils import StrEnum

if TYPE_CHECKING:
    from databricks.agents.review_app import label_schemas as _label_schemas

    _InputCategorical = _label_schemas.InputCategorical
    _InputCategoricalList = _label_schemas.InputCategoricalList
    _InputNumeric = _label_schemas.InputNumeric
    _InputText = _label_schemas.InputText
    _InputTextList = _label_schemas.InputTextList
    _LabelSchema = _label_schemas.LabelSchema

DatabricksInputType = TypeVar("DatabricksInputType")
_InputType = TypeVar("_InputType", bound="InputType")


class InputType(ABC):
    """Base class for all input types."""

    @abstractmethod
    def _to_databricks_input(self) -> DatabricksInputType:
        """Convert to the internal Databricks input type."""

    @classmethod
    @abstractmethod
    def _from_databricks_input(cls, input_obj: DatabricksInputType) -> _InputType:
        """Create from the internal Databricks input type."""


@dataclass
class InputCategorical(InputType):
    """A single-select dropdown for collecting assessments from stakeholders.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.
    """

    options: list[str]
    """List of available options for the categorical selection."""

    def _to_databricks_input(self) -> "_InputCategorical":
        """Convert to the internal Databricks input type."""
        from databricks.agents.review_app import label_schemas as _label_schemas

        return _label_schemas.InputCategorical(options=self.options)

    @classmethod
    def _from_databricks_input(cls, input_obj: "_InputCategorical") -> "InputCategorical":
        """Create from the internal Databricks input type."""
        return cls(options=input_obj.options)


@dataclass
class InputCategoricalList(InputType):
    """A multi-select dropdown for collecting assessments from stakeholders.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.
    """

    options: list[str]
    """List of available options for the multi-select categorical (dropdown)."""

    def _to_databricks_input(self) -> "_InputCategoricalList":
        """Convert to the internal Databricks input type."""
        from databricks.agents.review_app import label_schemas as _label_schemas

        return _label_schemas.InputCategoricalList(options=self.options)

    @classmethod
    def _from_databricks_input(cls, input_obj: "_InputCategoricalList") -> "InputCategoricalList":
        """Create from the internal Databricks input type."""
        return cls(options=input_obj.options)


@dataclass
class InputTextList(InputType):
    """Like `Text`, but allows multiple entries.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.
    """

    max_length_each: int | None = None
    """Maximum character length for each individual text entry. None means no limit."""

    max_count: int | None = None
    """Maximum number of text entries allowed. None means no limit."""

    def _to_databricks_input(self) -> "_InputTextList":
        """Convert to the internal Databricks input type."""
        from databricks.agents.review_app import label_schemas as _label_schemas

        return _label_schemas.InputTextList(
            max_length_each=self.max_length_each, max_count=self.max_count
        )

    @classmethod
    def _from_databricks_input(cls, input_obj: "_InputTextList") -> "InputTextList":
        """Create from the internal Databricks input type."""
        return cls(max_length_each=input_obj.max_length_each, max_count=input_obj.max_count)


@dataclass
class InputText(InputType):
    """A free-form text box for collecting assessments from stakeholders.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.
    """

    max_length: int | None = None
    """Maximum character length for the text input. None means no limit."""

    def _to_databricks_input(self) -> "_InputText":
        """Convert to the internal Databricks input type."""
        from databricks.agents.review_app import label_schemas as _label_schemas

        return _label_schemas.InputText(max_length=self.max_length)

    @classmethod
    def _from_databricks_input(cls, input_obj: "_InputText") -> "InputText":
        """Create from the internal Databricks input type."""
        return cls(max_length=input_obj.max_length)


@dataclass
class InputNumeric(InputType):
    """A numeric input for collecting assessments from stakeholders.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.
    """

    min_value: float | None = None
    """Minimum allowed numeric value. None means no minimum limit."""

    max_value: float | None = None
    """Maximum allowed numeric value. None means no maximum limit."""

    def _to_databricks_input(self) -> "_InputNumeric":
        """Convert to the internal Databricks input type."""
        from databricks.agents.review_app import label_schemas as _label_schemas

        return _label_schemas.InputNumeric(min_value=self.min_value, max_value=self.max_value)

    @classmethod
    def _from_databricks_input(cls, input_obj: "_InputNumeric") -> "InputNumeric":
        """Create from the internal Databricks input type."""
        return cls(min_value=input_obj.min_value, max_value=input_obj.max_value)


class LabelSchemaType(StrEnum):
    """Type of label schema."""

    FEEDBACK = "feedback"
    EXPECTATION = "expectation"


@dataclass(frozen=True)
class LabelSchema:
    """A label schema for collecting input from stakeholders.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.
    """

    name: str
    """Unique name identifier for the label schema."""

    type: LabelSchemaType
    """Type of the label schema, either 'feedback' or 'expectation'."""

    title: str
    """Display title shown to stakeholders in the labeling review UI."""

    input: InputCategorical | InputCategoricalList | InputText | InputTextList | InputNumeric
    """
    Input type specification that defines how stakeholders will provide their assessment
    (e.g., dropdown, text box, numeric input)
    """
    instruction: str | None = None
    """Optional detailed instructions shown to stakeholders for guidance."""

    enable_comment: bool = False
    """Whether to enable additional comment functionality for reviewers."""

    @classmethod
    def _convert_databricks_input(cls, input_obj):
        """Convert a Databricks input type to the corresponding MLflow input type."""
        from databricks.agents.review_app import label_schemas as _label_schemas

        input_type_mapping = {
            _label_schemas.InputCategorical: InputCategorical,
            _label_schemas.InputCategoricalList: InputCategoricalList,
            _label_schemas.InputText: InputText,
            _label_schemas.InputTextList: InputTextList,
            _label_schemas.InputNumeric: InputNumeric,
        }

        input_class = input_type_mapping.get(type(input_obj))
        if input_class is None:
            raise ValueError(f"Unknown input type: {type(input_obj)}")

        return input_class._from_databricks_input(input_obj)

    @classmethod
    def _from_databricks_label_schema(cls, schema: "_LabelSchema") -> "LabelSchema":
        """Convert from the internal Databricks label schema type."""

        return cls(
            name=schema.name,
            type=schema.type,
            title=schema.title,
            input=cls._convert_databricks_input(schema.input),
            instruction=schema.instruction,
            enable_comment=schema.enable_comment,
        )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/label_schemas/__init__.py

```python
"""
Databricks Agent Label Schemas Python SDK. For more details see Databricks Agent Evaluation:
<https://docs.databricks.com/en/generative-ai/agent-evaluation/index.html>

The API docs can be found here:
<https://api-docs.databricks.com/python/databricks-agents/latest/databricks_agent_eval.html#review-app>
"""

from typing import TYPE_CHECKING, Literal

from mlflow.genai.label_schemas.label_schemas import (
    InputCategorical,
    InputCategoricalList,
    InputNumeric,
    InputText,
    InputTextList,
    LabelSchema,
    LabelSchemaType,
)
from mlflow.genai.labeling import ReviewApp

if TYPE_CHECKING:
    from databricks.agents.review_app import ReviewApp

EXPECTED_FACTS = "expected_facts"
GUIDELINES = "guidelines"
EXPECTED_RESPONSE = "expected_response"


def create_label_schema(
    name: str,
    *,
    type: Literal["feedback", "expectation"],
    title: str,
    input: InputCategorical | InputCategoricalList | InputText | InputTextList | InputNumeric,
    instruction: str | None = None,
    enable_comment: bool = False,
    overwrite: bool = False,
) -> LabelSchema:
    """Create a new label schema for the review app.

    A label schema defines the type of input that stakeholders will provide when labeling items
    in the review app.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.

    Args:
        name: The name of the label schema. Must be unique across the review app.
        type: The type of the label schema. Either "feedback" or "expectation".
        title: The title of the label schema shown to stakeholders.
        input: The input type of the label schema.
        instruction: Optional. The instruction shown to stakeholders.
        enable_comment: Optional. Whether to enable comments for the label schema.
        overwrite: Optional. Whether to overwrite the existing label schema with the same name.

    Returns:
        LabelSchema: The created label schema.
    """
    from mlflow.genai.labeling.stores import _get_labeling_store  # Nested to avoid circular import

    store = _get_labeling_store()
    return store.create_label_schema(
        name=name,
        type=type,
        title=title,
        input=input,
        instruction=instruction,
        enable_comment=enable_comment,
        overwrite=overwrite,
    )


def get_label_schema(name: str) -> LabelSchema:
    """Get a label schema from the review app.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.

    Args:
        name: The name of the label schema to get.

    Returns:
        LabelSchema: The label schema.
    """
    from mlflow.genai.labeling.stores import _get_labeling_store  # Nested to avoid circular import

    store = _get_labeling_store()
    return store.get_label_schema(name)


def delete_label_schema(name: str):
    """Delete a label schema from the review app.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.

    Args:
        name: The name of the label schema to delete.
    """
    # Nested to avoid circular import
    from mlflow.genai.labeling.databricks_utils import get_databricks_review_app
    from mlflow.genai.labeling.stores import DatabricksLabelingStore, _get_labeling_store

    store = _get_labeling_store()
    store.delete_label_schema(name)

    # For backwards compatibility, return a ReviewApp instance only if using Databricks store
    if isinstance(store, DatabricksLabelingStore):
        return ReviewApp(get_databricks_review_app())
    else:
        # For non-Databricks stores, we can't return a meaningful ReviewApp
        return None


__all__ = [
    "EXPECTED_FACTS",
    "GUIDELINES",
    "EXPECTED_RESPONSE",
    "LabelSchemaType",
    "LabelSchema",
    "InputCategorical",
    "InputCategoricalList",
    "InputNumeric",
    "InputText",
    "InputTextList",
    "create_label_schema",
    "get_label_schema",
    "delete_label_schema",
]
```

--------------------------------------------------------------------------------

---[FILE: optimize.py]---
Location: mlflow-master/mlflow/genai/optimize/optimize.py

```python
import logging
import uuid
from concurrent.futures import ThreadPoolExecutor
from contextlib import nullcontext
from typing import TYPE_CHECKING, Any, Callable

import mlflow
from mlflow.entities import Trace
from mlflow.entities.model_registry import PromptVersion
from mlflow.environment_variables import MLFLOW_GENAI_EVAL_MAX_WORKERS
from mlflow.exceptions import MlflowException
from mlflow.genai.evaluation.utils import (
    _convert_eval_set_to_df,
)
from mlflow.genai.optimize.optimizers import BasePromptOptimizer
from mlflow.genai.optimize.types import (
    AggregationFn,
    EvaluationResultRecord,
    PromptOptimizationResult,
)
from mlflow.genai.optimize.util import (
    create_metric_from_scorers,
    prompt_optimization_autolog,
    validate_train_data,
)
from mlflow.genai.prompts import load_prompt, register_prompt
from mlflow.genai.scorers import Scorer
from mlflow.genai.utils.trace_utils import convert_predict_fn
from mlflow.models.evaluation.utils.trace import configure_autologging_for_evaluation
from mlflow.prompt.constants import PROMPT_TEXT_TAG_KEY
from mlflow.telemetry.events import PromptOptimizationEvent
from mlflow.telemetry.track import record_usage_event
from mlflow.utils import gorilla
from mlflow.utils.annotations import experimental
from mlflow.utils.autologging_utils.safety import _wrap_patch

if TYPE_CHECKING:
    from mlflow.genai.evaluation.utils import EvaluationDatasetTypes

_logger = logging.getLogger(__name__)


@experimental(version="3.5.0")
@record_usage_event(PromptOptimizationEvent)
def optimize_prompts(
    *,
    predict_fn: Callable[..., Any],
    train_data: "EvaluationDatasetTypes",
    prompt_uris: list[str],
    optimizer: BasePromptOptimizer,
    scorers: list[Scorer],
    aggregation: AggregationFn | None = None,
    enable_tracking: bool = True,
) -> PromptOptimizationResult:
    """
    Automatically optimize prompts using evaluation metrics and training data.
    This function uses the provided optimization algorithm to improve prompt
    quality based on your evaluation criteria and dataset.

    Args:
        predict_fn: a target function that uses the prompts to be optimized.
            The callable should receive inputs as keyword arguments and
            return the response. The function should use MLflow prompt registry
            and call `PromptVersion.format` during execution in order for this
            API to optimize the prompt. This function should return the
            same type as the outputs in the dataset.
        train_data: an evaluation dataset used for the optimization.
            It should include the inputs and outputs fields with dict values.
            The data must be one of the following formats:

            * An EvaluationDataset entity
            * Pandas DataFrame
            * Spark DataFrame
            * List of dictionaries

            The dataset must include the following columns:

            - inputs: A column containing single inputs in dict format.
              Each input should contain keys matching the variables in the prompt template.
            - outputs: A column containing an output for each input
              that the predict_fn should produce.
        prompt_uris: a list of prompt uris to be optimized.
            The prompt templates should be used by the predict_fn.
        optimizer: a prompt optimizer object that optimizes a set of prompts with
            the training dataset and scorers. For example,
            GepaPromptOptimizer(reflection_model="openai:/gpt-4o").
        scorers: List of scorers that evaluate the inputs, outputs and expectations.
            Required parameter. Use builtin scorers like Equivalence or Correctness,
            or define custom scorers with the @scorer decorator.
        aggregation: A callable that computes the overall performance metric from individual
            scorer outputs. Takes a dict mapping scorer names to scores and returns a float
            value (greater is better). If None and all scorers return numerical values,
            uses sum of scores by default.
        enable_tracking: If True (default), automatically creates an MLflow run if no active
            run exists and logs the following information:
            - The optimization scores (initial, final, improvement)
            - Links to the optimized prompt versions
            - The optimizer name and parameters
            - Optimization progress
            If False, no MLflow run is created and no tracking occurs.

    Returns:
        The optimization result object that includes the optimized prompts
        as a list of prompt versions, evaluation scores, and the optimizer name.

    Examples:

        .. code-block:: python

            import mlflow
            import openai
            from mlflow.genai.optimize.optimizers import GepaPromptOptimizer
            from mlflow.genai.scorers import Correctness

            prompt = mlflow.genai.register_prompt(
                name="qa",
                template="Answer the following question: {{question}}",
            )


            def predict_fn(question: str) -> str:
                completion = openai.OpenAI().chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt.format(question=question)}],
                )
                return completion.choices[0].message.content


            dataset = [
                {"inputs": {"question": "What is the capital of France?"}, "outputs": "Paris"},
                {"inputs": {"question": "What is the capital of Germany?"}, "outputs": "Berlin"},
            ]

            result = mlflow.genai.optimize_prompts(
                predict_fn=predict_fn,
                train_data=dataset,
                prompt_uris=[prompt.uri],
                optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-4o"),
                scorers=[Correctness(model="openai:/gpt-4o")],
            )

            print(result.optimized_prompts[0].template)

        **Example: Using custom scorers with an objective function**

        .. code-block:: python

            import mlflow
            from mlflow.genai.optimize.optimizers import GepaPromptOptimizer
            from mlflow.genai.scorers import scorer


            # Define custom scorers
            @scorer(name="accuracy")
            def accuracy_scorer(outputs, expectations):
                return 1.0 if outputs.lower() == expectations.lower() else 0.0


            @scorer(name="brevity")
            def brevity_scorer(outputs):
                # Prefer shorter outputs (max 50 chars gets score of 1.0)
                return min(1.0, 50 / max(len(outputs), 1))


            # Define objective to combine scores
            def weighted_objective(scores):
                return 0.7 * scores["accuracy"] + 0.3 * scores["brevity"]


            result = mlflow.genai.optimize_prompts(
                predict_fn=predict_fn,
                train_data=dataset,
                prompt_uris=[prompt.uri],
                optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-4o"),
                scorers=[accuracy_scorer, brevity_scorer],
                aggregation=weighted_objective,
            )
    """
    train_data_df = _convert_eval_set_to_df(train_data)
    converted_train_data = train_data_df.to_dict("records")
    validate_train_data(train_data_df, scorers, predict_fn)

    predict_fn = convert_predict_fn(
        predict_fn=predict_fn, sample_input=converted_train_data[0]["inputs"]
    )

    metric_fn = create_metric_from_scorers(scorers, aggregation)
    eval_fn = _build_eval_fn(predict_fn, metric_fn)

    target_prompts = [load_prompt(prompt_uri) for prompt_uri in prompt_uris]
    if not all(prompt.is_text_prompt for prompt in target_prompts):
        raise MlflowException("Only text prompts can be optimized")

    target_prompts_dict = {prompt.name: prompt.template for prompt in target_prompts}

    with (
        prompt_optimization_autolog(
            optimizer_name=optimizer.__class__.__name__,
            num_prompts=len(target_prompts),
            num_training_samples=len(converted_train_data),
            train_data_df=train_data_df,
        )
        if enable_tracking
        else nullcontext({})
    ) as log_results:
        optimizer_output = optimizer.optimize(
            eval_fn, converted_train_data, target_prompts_dict, enable_tracking
        )

        optimized_prompts = [
            register_prompt(name=prompt_name, template=prompt)
            for prompt_name, prompt in optimizer_output.optimized_prompts.items()
        ]

        log_results["optimizer_output"] = optimizer_output
        log_results["optimized_prompts"] = optimized_prompts

    return PromptOptimizationResult(
        optimized_prompts=optimized_prompts,
        optimizer_name=optimizer.__class__.__name__,
        initial_eval_score=optimizer_output.initial_eval_score,
        final_eval_score=optimizer_output.final_eval_score,
    )


def _build_eval_fn(
    predict_fn: Callable[..., Any],
    metric_fn: Callable[
        [dict[str, Any], dict[str, Any], dict[str, Any], Trace | None], tuple[float, dict[str, str]]
    ],
) -> Callable[[dict[str, str], list[dict[str, Any]]], list[EvaluationResultRecord]]:
    """
    Build an evaluation function that uses the candidate prompts to evaluate the predict_fn.

    Args:
        predict_fn: The function to evaluate
        metric_fn: Metric function created from scorers that takes (inputs, outputs, expectations)

    Returns:
        An evaluation function
    """
    from mlflow.pyfunc import Context, set_prediction_context

    def eval_fn(
        candidate_prompts: dict[str, str], dataset: list[dict[str, Any]]
    ) -> list[EvaluationResultRecord]:
        used_prompts = set()

        @property
        def _template_patch(self) -> str:
            template_name = self.name
            if template_name in candidate_prompts:
                used_prompts.add(template_name)
                return candidate_prompts[template_name]
            return self._tags.get(PROMPT_TEXT_TAG_KEY, "")

        patch = _wrap_patch(PromptVersion, "template", _template_patch)

        def _run_single(record: dict[str, Any]):
            inputs = record["inputs"]
            # use expectations if provided, otherwise use outputs
            expectations = record.get("expectations") or {
                "expected_response": record.get("outputs")
            }
            eval_request_id = str(uuid.uuid4())
            # set prediction context to retrieve the trace by the request id,
            # and set is_evaluate to True to disable async trace logging
            with set_prediction_context(Context(request_id=eval_request_id, is_evaluate=True)):
                try:
                    program_outputs = predict_fn(inputs)
                except Exception as e:
                    program_outputs = f"Failed to invoke the predict_fn with {inputs}: {e}"

            trace = mlflow.get_trace(eval_request_id, silent=True)
            # Use metric function created from scorers
            score, rationales = metric_fn(
                inputs=inputs, outputs=program_outputs, expectations=expectations, trace=trace
            )
            return EvaluationResultRecord(
                inputs=inputs,
                outputs=program_outputs,
                expectations=expectations,
                score=score,
                trace=trace,
                rationales=rationales,
            )

        try:
            with (
                ThreadPoolExecutor(
                    max_workers=MLFLOW_GENAI_EVAL_MAX_WORKERS.get(),
                    thread_name_prefix="MLflowPromptOptimization",
                ) as executor,
                configure_autologging_for_evaluation(enable_tracing=True),
            ):
                futures = [executor.submit(_run_single, record) for record in dataset]
                results = [future.result() for future in futures]

            # Check for unused prompts and warn
            if unused_prompts := set(candidate_prompts.keys()) - used_prompts:
                _logger.warning(
                    "The following prompts were not used during evaluation: "
                    f"{sorted(unused_prompts)}. This may indicate that predict_fn is "
                    "not calling format() for these prompts, or the prompt names don't match. "
                    "Please verify that your predict_fn uses all prompts specified in prompt_uris."
                )

            return results
        finally:
            gorilla.revert(patch)

    return eval_fn
```

--------------------------------------------------------------------------------

---[FILE: types.py]---
Location: mlflow-master/mlflow/genai/optimize/types.py

```python
import multiprocessing
from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Any, Callable

from mlflow.entities import Feedback, Trace
from mlflow.entities.model_registry import PromptVersion
from mlflow.utils.annotations import deprecated, experimental

if TYPE_CHECKING:
    from mlflow.genai.optimize.optimizers import BasePromptOptimizer


AggregationFn = Callable[[dict[str, bool | float | str | Feedback | list[Feedback]]], float]


@deprecated(
    since="3.5.0",
)
@dataclass
class LLMParams:
    """
    Parameters for configuring a LLM Model.

    Args:
        model_name: Name of the model in the format `<provider>:/<model name>` or
            `<provider>/<model name>`. For example, "openai:/gpt-4o", "anthropic:/claude-4",
            or "openai/gpt-4o".
        base_uri: Optional base URI for the API endpoint. If not provided,
            the default endpoint for the provider will be used.
        temperature: Optional sampling temperature for the model's outputs.
            Higher values (e.g., 0.8) make the output more random,
            while lower values (e.g., 0.2) make it more deterministic.
    """

    model_name: str
    base_uri: str | None = None
    temperature: float | None = None


@deprecated(
    since="3.5.0",
)
@dataclass
class OptimizerConfig:
    """
    Configuration for prompt optimization.

    Args:
        num_instruction_candidates: Number of candidate instructions to generate
            during each optimization iteration. Higher values may lead to better
            results but increase optimization time. Default: 6
        max_few_shot_examples: Maximum number of examples to show in few-shot
            demonstrations. Default: 6
        num_threads: Number of threads to use for parallel optimization.
            Default: (number of CPU cores * 2 + 1)
        optimizer_llm: Optional LLM parameters for the teacher model. If not provided,
            the target LLM will be used as the teacher.
        algorithm: The optimization algorithm to use. When a string is provided,
            it must be one of the supported algorithms: "DSPy/MIPROv2".
            When a BasePromptOptimizer is provided, it will be used as the optimizer.
            Default: "DSPy/MIPROv2"
        verbose: Whether to show optimizer logs during optimization. Default: False
        autolog: Whether to enable automatic logging and prompt registration.
            If set to True, a MLflow run is automatically created to store optimization
            parameters, datasets and metrics, and the optimized prompt is registered.
            If set to False, the raw optimized template is returned without registration.
            Default: True
        convert_to_single_text: Whether to convert the optimized prompt to a single prompt.
            Default: True
        extract_instructions: Whether to extract instructions from the initial prompt.
            Default: True
    """

    num_instruction_candidates: int = 6
    max_few_shot_examples: int = 6
    num_threads: int = field(default_factory=lambda: (multiprocessing.cpu_count() or 1) * 2 + 1)
    optimizer_llm: LLMParams | None = None
    algorithm: str | type["BasePromptOptimizer"] = "DSPy/MIPROv2"
    verbose: bool = False
    autolog: bool = True
    convert_to_single_text: bool = True
    extract_instructions: bool = True


@experimental(version="3.5.0")
@dataclass
class EvaluationResultRecord:
    """
    The output type of `eval_fn` in the
    :py:func:`mlflow.genai.optimize.BasePromptOptimizer.optimize()` API.

    Args:
        inputs: The inputs of the evaluation.
        outputs: The outputs of the prediction function.
        expectations: The expected outputs.
        score: The score of the evaluation result.
        trace: The trace of the evaluation execution.
        rationales: The rationales of the evaluation result.
    """

    inputs: dict[str, Any]
    outputs: Any
    expectations: Any
    score: float
    trace: Trace
    rationales: dict[str, str]


@experimental(version="3.5.0")
@dataclass
class PromptOptimizerOutput:
    """
    An output of the :py:func:`mlflow.genai.optimize.BasePromptOptimizer.optimize()` API.

    Args:
        optimized_prompts: The optimized prompts as
            a dict (prompt template name -> prompt template).
            e.g., {"question": "What is the capital of {{country}}?"}
        initial_eval_score: The evaluation score before optimization (optional).
        final_eval_score: The evaluation score after optimization (optional).
    """

    optimized_prompts: dict[str, str]
    initial_eval_score: float | None = None
    final_eval_score: float | None = None


@experimental(version="3.5.0")
@dataclass
class PromptOptimizationResult:
    """
    Result of the :py:func:`mlflow.genai.optimize_prompts()` API.

    Args:
        optimized_prompts: The optimized prompts.
        optimizer_name: The name of the optimizer.
        initial_eval_score: The evaluation score before optimization (optional).
        final_eval_score: The evaluation score after optimization (optional).
    """

    optimized_prompts: list[PromptVersion]
    optimizer_name: str
    initial_eval_score: float | None = None
    final_eval_score: float | None = None
```

--------------------------------------------------------------------------------

````
