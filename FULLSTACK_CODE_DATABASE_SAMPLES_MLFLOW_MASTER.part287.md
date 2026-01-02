---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 287
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 287 of 991)

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
Location: mlflow-master/mlflow/genai/scorers/__init__.py

```python
from typing import TYPE_CHECKING

from mlflow.genai.scorers.base import Scorer, ScorerSamplingConfig, scorer
from mlflow.genai.scorers.registry import delete_scorer, get_scorer, list_scorers

# Metadata keys for scorer feedback
FRAMEWORK_METADATA_KEY = "mlflow.scorer.framework"

# NB: We use lazy imports for builtin_scorers to avoid a circular dependency issue.
#
# The circular dependency chain:
# 1. scorers/__init__.py imports from builtin_scorers (if done eagerly)
# 2. builtin_scorers.py has `class BuiltInScorer(Judge)` which imports Judge from judges.base
# 3. judges.base.py has `class Judge(Scorer)` which imports Scorer from scorers.base
# 4. When importing scorers.base, Python first initializes the scorers package (__init__.py)
# 5. This would try to import builtin_scorers, creating a circular import
#
# Solution:
# - We use Python's __getattr__ mechanism to defer the import of builtin_scorers until
#   the specific scorer classes are actually accessed at runtime
# - The TYPE_CHECKING block provides type hints for IDEs and static analysis tools
#   without actually importing the modules at runtime (TYPE_CHECKING is only True
#   during static analysis, never during actual execution)
# - This allows Sphinx autodoc and IDEs to understand the module structure while
#   avoiding the circular import at runtime


# Define the attributes that should be lazily loaded
_LAZY_IMPORTS = {
    "Completeness",
    "ConversationalRoleAdherence",
    "ConversationalSafety",
    "ConversationCompleteness",
    "ConversationalToolCallEfficiency",
    "Correctness",
    "ExpectationsGuidelines",
    "Fluency",
    "Guidelines",
    "Equivalence",
    "KnowledgeRetention",
    "RelevanceToQuery",
    "RetrievalGroundedness",
    "RetrievalRelevance",
    "RetrievalSufficiency",
    "Safety",
    "Summarization",
    "ToolCallCorrectness",
    "ToolCallEfficiency",
    "UserFrustration",
    "get_all_scorers",
}


def __getattr__(name):
    """Lazily import builtin scorers to avoid circular dependency."""
    if name in _LAZY_IMPORTS:
        # Import the module when first accessed
        from mlflow.genai.scorers import builtin_scorers

        return getattr(builtin_scorers, name)

    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def __dir__():
    """Return the list of attributes available in this module.

    This is necessary for Sphinx autodoc and other introspection tools
    to discover the lazily-loaded scorer classes.
    """
    # Get the default module attributes
    module_attrs = list(globals().keys())
    # Add the lazy imports
    return sorted(set(module_attrs) | _LAZY_IMPORTS)


# The TYPE_CHECKING block below is for static analysis tools only.
# TYPE_CHECKING is False at runtime, so these imports never execute during normal operation.
# This gives us the best of both worlds: type hints without circular imports.
if TYPE_CHECKING:
    from mlflow.genai.scorers.builtin_scorers import (
        Completeness,
        ConversationalRoleAdherence,
        ConversationalSafety,
        ConversationalToolCallEfficiency,
        ConversationCompleteness,
        Correctness,
        Equivalence,
        ExpectationsGuidelines,
        Fluency,
        Guidelines,
        KnowledgeRetention,
        RelevanceToQuery,
        RetrievalGroundedness,
        RetrievalRelevance,
        RetrievalSufficiency,
        Safety,
        Summarization,
        ToolCallCorrectness,
        ToolCallEfficiency,
        UserFrustration,
        get_all_scorers,
    )

__all__ = [
    "Completeness",
    "ConversationalRoleAdherence",
    "ConversationalSafety",
    "ConversationalToolCallEfficiency",
    "ConversationCompleteness",
    "Correctness",
    "ExpectationsGuidelines",
    "Fluency",
    "Guidelines",
    "Equivalence",
    "KnowledgeRetention",
    "RelevanceToQuery",
    "RetrievalGroundedness",
    "RetrievalRelevance",
    "RetrievalSufficiency",
    "Safety",
    "Summarization",
    "ToolCallCorrectness",
    "ToolCallEfficiency",
    "UserFrustration",
    "Scorer",
    "scorer",
    "ScorerSamplingConfig",
    "get_all_scorers",
    "get_scorer",
    "list_scorers",
    "delete_scorer",
]
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: mlflow-master/mlflow/genai/scorers/deepeval/models.py
Signals: Pydantic

```python
from __future__ import annotations

import json

from deepeval.models import LiteLLMModel
from deepeval.models.base_model import DeepEvalBaseLLM
from pydantic import ValidationError

from mlflow.exceptions import MlflowException
from mlflow.genai.judges.adapters.databricks_managed_judge_adapter import (
    call_chat_completions,
)
from mlflow.genai.judges.adapters.databricks_serving_endpoint_adapter import (
    _invoke_databricks_serving_endpoint,
)
from mlflow.genai.judges.constants import _DATABRICKS_DEFAULT_JUDGE_MODEL


def _build_json_prompt_with_schema(prompt: str, schema) -> str:
    return (
        f"{prompt}\n\n"
        f"IMPORTANT: Return your response as valid JSON matching this schema: "
        f"{schema.model_json_schema()}\n"
        f"Return ONLY the JSON object, no additional text or markdown formatting."
    )


def _parse_json_output_with_schema(output: str, schema):
    try:
        json_data = json.loads(output)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON output: {e}\nOutput: {output}")

    try:
        return schema(**json_data)
    except ValidationError as e:
        raise ValueError(f"Failed to validate output against schema: {e}\nOutput: {output}")
    except TypeError as e:
        raise ValueError(f"Failed to instantiate schema with data: {e}\nOutput: {output}")


class DatabricksDeepEvalLLM(DeepEvalBaseLLM):
    """
    DeepEval model adapter for Databricks managed judge.

    Uses the default Databricks endpoint via call_chat_completions.
    """

    def __init__(self):
        super().__init__(model_name=_DATABRICKS_DEFAULT_JUDGE_MODEL)

    def load_model(self, **kwargs):
        return self

    def generate(self, prompt: str, schema=None) -> str:
        if schema is not None:
            # TODO: Add support for structured outputs once the Databricks endpoint supports it
            json_prompt = _build_json_prompt_with_schema(prompt, schema)
            result = call_chat_completions(user_prompt=json_prompt, system_prompt="")
            return _parse_json_output_with_schema(result.output.strip(), schema)
        else:
            result = call_chat_completions(user_prompt=prompt, system_prompt="")
            return result.output

    async def a_generate(self, prompt: str, schema=None) -> str:
        return self.generate(prompt, schema=schema)

    def get_model_name(self) -> str:
        return _DATABRICKS_DEFAULT_JUDGE_MODEL


class DatabricksServingEndpointDeepEvalLLM(DeepEvalBaseLLM):
    """
    DeepEval model adapter for Databricks serving endpoints.

    Uses the model serving API via _invoke_databricks_serving_endpoint.
    """

    def __init__(self, endpoint_name: str):
        self._endpoint_name = endpoint_name
        super().__init__(model_name=f"databricks:/{endpoint_name}")

    def load_model(self, **kwargs):
        return self

    def generate(self, prompt: str, schema=None) -> str:
        if schema is not None:
            # TODO: Use response_format parameter once Databricks serving endpoints support it
            json_prompt = _build_json_prompt_with_schema(prompt, schema)
            output = _invoke_databricks_serving_endpoint(
                model_name=self._endpoint_name,
                prompt=json_prompt,
                num_retries=3,
                response_format=None,
            )
            return _parse_json_output_with_schema(output.response, schema)
        else:
            output = _invoke_databricks_serving_endpoint(
                model_name=self._endpoint_name,
                prompt=prompt,
                num_retries=3,
                response_format=None,
            )
            return output.response

    async def a_generate(self, prompt: str, schema=None) -> str:
        return self.generate(prompt, schema=schema)

    def get_model_name(self) -> str:
        return f"databricks:/{self._endpoint_name}"


def create_deepeval_model(model_uri: str):
    if model_uri == "databricks":
        return DatabricksDeepEvalLLM()
    elif model_uri.startswith("databricks:/"):
        endpoint_name = model_uri.split(":", 1)[1].removeprefix("/")
        return DatabricksServingEndpointDeepEvalLLM(endpoint_name)
    elif ":" in model_uri:
        # LiteLLM model format with provider: provider:/model_name (e.g., openai:/gpt-4)
        provider, model_name = model_uri.split(":", 1)
        model_name = model_name.removeprefix("/")
        return LiteLLMModel(model=f"{provider}/{model_name}")
    else:
        raise MlflowException.invalid_parameter_value(
            f"Invalid model_uri format: '{model_uri}'. "
            f"Must be 'databricks' or include a provider prefix (e.g., 'openai:/gpt-4')."
        )
```

--------------------------------------------------------------------------------

---[FILE: registry.py]---
Location: mlflow-master/mlflow/genai/scorers/deepeval/registry.py

```python
from __future__ import annotations

from mlflow.exceptions import MlflowException
from mlflow.genai.scorers.deepeval.utils import DEEPEVAL_NOT_INSTALLED_ERROR_MESSAGE

# Registry format: metric_name -> (classpath, is_deterministic)
_METRIC_REGISTRY = {
    # RAG Metrics
    "AnswerRelevancy": ("deepeval.metrics.AnswerRelevancyMetric", False),
    "Faithfulness": ("deepeval.metrics.FaithfulnessMetric", False),
    "ContextualRecall": ("deepeval.metrics.ContextualRecallMetric", False),
    "ContextualPrecision": ("deepeval.metrics.ContextualPrecisionMetric", False),
    "ContextualRelevancy": ("deepeval.metrics.ContextualRelevancyMetric", False),
    # Agentic Metrics
    "TaskCompletion": ("deepeval.metrics.TaskCompletionMetric", False),
    "ToolCorrectness": ("deepeval.metrics.ToolCorrectnessMetric", False),
    "ArgumentCorrectness": ("deepeval.metrics.ArgumentCorrectnessMetric", False),
    "StepEfficiency": ("deepeval.metrics.StepEfficiencyMetric", False),
    "PlanAdherence": ("deepeval.metrics.PlanAdherenceMetric", False),
    "PlanQuality": ("deepeval.metrics.PlanQualityMetric", False),
    # Conversational Metrics (multi-turn session-level)
    "TurnRelevancy": ("deepeval.metrics.TurnRelevancyMetric", False),
    "RoleAdherence": ("deepeval.metrics.RoleAdherenceMetric", False),
    "KnowledgeRetention": ("deepeval.metrics.KnowledgeRetentionMetric", False),
    "ConversationCompleteness": ("deepeval.metrics.ConversationCompletenessMetric", False),
    "GoalAccuracy": ("deepeval.metrics.GoalAccuracyMetric", False),
    "ToolUse": ("deepeval.metrics.ToolUseMetric", False),
    "TopicAdherence": ("deepeval.metrics.TopicAdherenceMetric", False),
    # Safety Metrics
    "Bias": ("deepeval.metrics.BiasMetric", False),
    "Toxicity": ("deepeval.metrics.ToxicityMetric", False),
    "NonAdvice": ("deepeval.metrics.NonAdviceMetric", False),
    "Misuse": ("deepeval.metrics.MisuseMetric", False),
    "PIILeakage": ("deepeval.metrics.PIILeakageMetric", False),
    "RoleViolation": ("deepeval.metrics.RoleViolationMetric", False),
    # General Metrics
    "Hallucination": ("deepeval.metrics.HallucinationMetric", False),
    "Summarization": ("deepeval.metrics.SummarizationMetric", False),
    "JsonCorrectness": ("deepeval.metrics.JsonCorrectnessMetric", False),
    "PromptAlignment": ("deepeval.metrics.PromptAlignmentMetric", False),
    # Deterministic Metrics
    "ExactMatch": ("deepeval.metrics.ExactMatchMetric", True),
    "PatternMatch": ("deepeval.metrics.PatternMatchMetric", True),
}


def get_metric_class(metric_name: str):
    """
    Get DeepEval metric class by name.

    Args:
        metric_name: Name of the metric (e.g., "AnswerRelevancy", "Faithfulness")

    Returns:
        The DeepEval metric class

    Raises:
        MlflowException: If the metric name is not recognized or deepeval is not installed
    """
    if metric_name not in _METRIC_REGISTRY:
        available_metrics = ", ".join(sorted(_METRIC_REGISTRY.keys()))
        raise MlflowException.invalid_parameter_value(
            f"Unknown metric: '{metric_name}'. Available metrics: {available_metrics}"
        )

    classpath, _ = _METRIC_REGISTRY[metric_name]
    module_path, class_name = classpath.rsplit(".", 1)

    try:
        module = __import__(module_path, fromlist=[class_name])
        return getattr(module, class_name)
    except ImportError as e:
        raise MlflowException.invalid_parameter_value(DEEPEVAL_NOT_INSTALLED_ERROR_MESSAGE) from e


def is_deterministic_metric(metric_name: str) -> bool:
    if metric_name not in _METRIC_REGISTRY:
        return False
    _, is_deterministic = _METRIC_REGISTRY[metric_name]
    return is_deterministic
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/genai/scorers/deepeval/utils.py

```python
"""Utility functions and constants for DeepEval integration."""

from __future__ import annotations

from typing import Any

from mlflow.entities.span import SpanAttributeKey, SpanType
from mlflow.entities.trace import Trace
from mlflow.exceptions import MlflowException
from mlflow.genai.utils.trace_utils import (
    _to_dict,
    extract_retrieval_context_from_trace,
    parse_inputs_to_str,
    parse_outputs_to_str,
    resolve_expectations_from_trace,
    resolve_inputs_from_trace,
    resolve_outputs_from_trace,
)
from mlflow.tracing.utils.truncation import (
    _get_last_message,
    _get_text_content_from_message,
)

DEEPEVAL_NOT_INSTALLED_ERROR_MESSAGE = (
    "DeepEval metrics require the 'deepeval' package. Please install it with: pip install deepeval"
)

# Expectation keys for conversational test cases
EXPECTATION_KEY_SCENARIO = "scenario"
EXPECTATION_KEY_CHATBOT_ROLE = "chatbot_role"
EXPECTATION_KEY_EXPECTED_OUTCOME = "expected_outcome"
EXPECTATION_KEY_CONTEXT = "context"

try:
    from deepeval.test_case import ConversationalTestCase, LLMTestCase, Turn
    from deepeval.test_case import ToolCall as DeepEvalToolCall

    _DEEPEVAL_INSTALLED = True
except ImportError:
    _DEEPEVAL_INSTALLED = False


def _check_deepeval_installed():
    if not _DEEPEVAL_INSTALLED:
        raise MlflowException.invalid_parameter_value(DEEPEVAL_NOT_INSTALLED_ERROR_MESSAGE)


def _convert_to_deepeval_tool_calls(tool_call_dicts: list[dict[str, Any]]):
    """
    Convert tool call dicts to DeepEval ToolCall objects.

    Args:
        tool_call_dicts: List of dicts with tool call data

    Returns:
        List of DeepEval ToolCall objects
    """
    return [
        DeepEvalToolCall(
            name=tc_dict.get("name"),
            description=tc_dict.get("description"),
            reasoning=tc_dict.get("reasoning"),
            output=tc_dict.get("output"),
            input_parameters=tc_dict.get("input_parameters"),
        )
        for tc_dict in tool_call_dicts
    ]


def _extract_tool_calls_from_trace(trace: Trace):
    """
    Extract tool calls from trace spans with type TOOL.

    Args:
        trace: MLflow Trace object

    Returns:
        List of DeepEval ToolCall objects, or None if no tool calls found
    """
    if not trace:
        return None

    tool_spans = trace.search_spans(span_type=SpanType.TOOL)
    if not tool_spans:
        return None

    return [
        DeepEvalToolCall(
            name=span.name,
            input_parameters=span.attributes.get(SpanAttributeKey.INPUTS),
            output=span.attributes.get(SpanAttributeKey.OUTPUTS),
        )
        for span in tool_spans
    ]


def _dict_to_kv_list(d: dict[str, Any]) -> list[str]:
    return [f"{k}: {v}" for k, v in d.items()]


def _extract_last_user_message_content(value: Any) -> str:
    """
    Extract the content of the last user message from inputs for multi-turn conversations.

    Args:
        value: Input value that may contain messages

    Returns:
        String content of the last user message
    """
    if isinstance(value, str):
        return value

    try:
        value_dict = _to_dict(value)
        messages = value_dict.get("messages")
        if messages and isinstance(messages, list) and len(messages) > 0:
            last_user_message = _get_last_message(messages, "user")
            return _get_text_content_from_message(last_user_message)
    except Exception:
        pass

    return parse_inputs_to_str(value)


def map_scorer_inputs_to_deepeval_test_case(
    metric_name: str,
    inputs: Any = None,
    outputs: Any = None,
    expectations: dict[str, Any] | None = None,
    trace: Trace | None = None,
):
    if trace:
        inputs = resolve_inputs_from_trace(inputs, trace)
        outputs = resolve_outputs_from_trace(outputs, trace)
        expectations = resolve_expectations_from_trace(expectations, trace)

    context = _dict_to_kv_list(expectations) if expectations else None
    additional_metadata = trace.info.trace_metadata if trace else {}
    tags = _dict_to_kv_list(trace.info.tags) if trace else []
    completion_time = trace.info.execution_duration / 1000 if trace else None

    expected_output = None
    expected_tools = None
    if expectations:
        if "expected_output" in expectations:
            expected_output = parse_outputs_to_str(expectations["expected_output"])

        if "expected_tool_calls" in expectations:
            expected_tool_calls = expectations["expected_tool_calls"]
            if isinstance(expected_tool_calls, list):
                expected_tools = _convert_to_deepeval_tool_calls(expected_tool_calls)

    tools_called = _extract_tool_calls_from_trace(trace) if trace else None

    span_id_to_context = extract_retrieval_context_from_trace(trace) if trace else {}
    retrieval_context = [str(context) for context in span_id_to_context.values()]

    return LLMTestCase(
        input=parse_inputs_to_str(inputs),
        actual_output=parse_outputs_to_str(outputs),
        expected_output=expected_output,
        context=context,
        retrieval_context=retrieval_context,
        tools_called=tools_called,
        expected_tools=expected_tools,
        additional_metadata=additional_metadata,
        tags=tags,
        completion_time=completion_time,
    )


def map_session_to_deepeval_conversational_test_case(
    session: list[Trace],
    expectations: dict[str, Any] | None = None,
):
    """
    Convert list of MLflow traces (session) to DeepEval ConversationalTestCase.

    Args:
        session: List of traces in chronological order (same mlflow.trace.session ID)
        expectations: Optional conversation-level metadata. Use the EXPECTATION_KEY_* constants:
            - EXPECTATION_KEY_SCENARIO: Description of the test scenario
            - EXPECTATION_KEY_CHATBOT_ROLE: The chatbot's assigned role
            - EXPECTATION_KEY_EXPECTED_OUTCOME: The anticipated result
            - EXPECTATION_KEY_CONTEXT: Background information (str or list[str])

    Returns:
        ConversationalTestCase with turns populated from session traces
    """
    turns = []
    for trace in session:
        inputs = resolve_inputs_from_trace(None, trace)
        outputs = resolve_outputs_from_trace(None, trace)

        user_turn = Turn(
            role="user",
            content=_extract_last_user_message_content(inputs),
        )
        turns.append(user_turn)

        assistant_turn = Turn(
            role="assistant",
            content=parse_outputs_to_str(outputs),
        )
        turns.append(assistant_turn)

    kwargs = {}
    if expectations:
        if EXPECTATION_KEY_SCENARIO in expectations:
            kwargs[EXPECTATION_KEY_SCENARIO] = str(expectations[EXPECTATION_KEY_SCENARIO])
        if EXPECTATION_KEY_CHATBOT_ROLE in expectations:
            kwargs[EXPECTATION_KEY_CHATBOT_ROLE] = str(expectations[EXPECTATION_KEY_CHATBOT_ROLE])
        if EXPECTATION_KEY_EXPECTED_OUTCOME in expectations:
            kwargs[EXPECTATION_KEY_EXPECTED_OUTCOME] = str(
                expectations[EXPECTATION_KEY_EXPECTED_OUTCOME]
            )
        if EXPECTATION_KEY_CONTEXT in expectations:
            ctx = expectations[EXPECTATION_KEY_CONTEXT]
            if isinstance(ctx, list):
                kwargs[EXPECTATION_KEY_CONTEXT] = [str(c) for c in ctx]
            else:
                kwargs[EXPECTATION_KEY_CONTEXT] = [str(ctx)]

    return ConversationalTestCase(turns=turns, **kwargs)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/scorers/deepeval/__init__.py
Signals: Pydantic

```python
"""
DeepEval integration for MLflow.

This module provides integration with DeepEval metrics, allowing them to be used
with MLflow's scorer interface.

Example usage:

.. code-block:: python

    from mlflow.genai.scorers.deepeval import get_scorer

    scorer = get_scorer("AnswerRelevancy", threshold=0.7, model="openai:/gpt-4")
    feedback = scorer(inputs="What is MLflow?", outputs="MLflow is a platform...")
"""

from __future__ import annotations

import logging
from typing import Any

from pydantic import PrivateAttr

from mlflow.entities.assessment import Feedback
from mlflow.entities.assessment_source import AssessmentSource, AssessmentSourceType
from mlflow.entities.trace import Trace
from mlflow.exceptions import MlflowException
from mlflow.genai.judges.builtin import _MODEL_API_DOC
from mlflow.genai.judges.utils import CategoricalRating, get_default_model
from mlflow.genai.scorers import FRAMEWORK_METADATA_KEY
from mlflow.genai.scorers.base import Scorer
from mlflow.genai.scorers.deepeval.models import create_deepeval_model
from mlflow.genai.scorers.deepeval.registry import (
    get_metric_class,
    is_deterministic_metric,
)
from mlflow.genai.scorers.deepeval.utils import (
    map_scorer_inputs_to_deepeval_test_case,
    map_session_to_deepeval_conversational_test_case,
)
from mlflow.utils.annotations import experimental
from mlflow.utils.docstring_utils import format_docstring

_logger = logging.getLogger(__name__)


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class DeepEvalScorer(Scorer):
    """
    Base scorer class for DeepEval metrics.

    Args:
        metric_name: Name of the DeepEval metric (e.g., "AnswerRelevancy").
            If not provided, will use the class-level metric_name attribute.
        model: {{ model }}
        metric_kwargs: Additional metric-specific parameters
    """

    _metric: Any = PrivateAttr()

    def __init__(
        self,
        metric_name: str | None = None,
        model: str | None = None,
        **metric_kwargs: Any,
    ):
        # Use class attribute if metric_name not provided
        if metric_name is None:
            metric_name = self.metric_name

        super().__init__(name=metric_name)

        metric_class = get_metric_class(metric_name)

        self._is_deterministic = is_deterministic_metric(metric_name)

        if self._is_deterministic:
            # Deterministic metrics don't need a model
            self._metric = metric_class(**metric_kwargs)
            self._model_uri = None
        else:
            model = model or get_default_model()
            self._model_uri = model
            deepeval_model = create_deepeval_model(model)
            self._metric = metric_class(
                model=deepeval_model,
                verbose_mode=False,
                async_mode=False,
                **metric_kwargs,
            )

    @property
    def is_session_level_scorer(self) -> bool:
        from deepeval.metrics.base_metric import BaseConversationalMetric

        return isinstance(self._metric, BaseConversationalMetric)

    def __call__(
        self,
        *,
        inputs: Any = None,
        outputs: Any = None,
        expectations: dict[str, Any] | None = None,
        trace: Trace | None = None,
        session: list[Trace] | None = None,
    ) -> Feedback:
        """
        Evaluate using the wrapped DeepEval metric.

        Args:
            inputs: The input to evaluate
            outputs: The output to evaluate
            expectations: Expected values and context for evaluation
            trace: MLflow trace for evaluation
            session: List of MLflow traces for multi-turn evaluation

        Returns:
            Feedback object with pass/fail value, rationale, and score in metadata
        """
        if self._is_deterministic:
            source_type = AssessmentSourceType.CODE
            source_id = None
        else:
            source_type = AssessmentSourceType.LLM_JUDGE
            source_id = self._model_uri

        assessment_source = AssessmentSource(
            source_type=source_type,
            source_id=source_id,
        )

        try:
            if self.is_session_level_scorer:
                if session is None:
                    raise MlflowException.invalid_parameter_value(
                        f"Multi-turn scorer '{self.name}' requires 'session' parameter "
                        f"containing a list of traces from the conversation."
                    )
                test_case = map_session_to_deepeval_conversational_test_case(
                    session=session,
                    expectations=expectations,
                )
            else:
                test_case = map_scorer_inputs_to_deepeval_test_case(
                    metric_name=self.name,
                    inputs=inputs,
                    outputs=outputs,
                    expectations=expectations,
                    trace=trace,
                )

            self._metric.measure(test_case, _show_indicator=False)

            score = self._metric.score
            reason = self._metric.reason
            success = self._metric.is_successful()

            return Feedback(
                name=self.name,
                value=CategoricalRating.YES if success else CategoricalRating.NO,
                rationale=reason,
                source=assessment_source,
                metadata={
                    "score": score,
                    "threshold": self._metric.threshold,
                    FRAMEWORK_METADATA_KEY: "deepeval",
                },
            )
        except Exception as e:
            return Feedback(
                name=self.name,
                error=e,
                source=assessment_source,
            )

    def _validate_kwargs(self, **metric_kwargs):
        if is_deterministic_metric(self.metric_name):
            if "model" in metric_kwargs:
                raise MlflowException.invalid_parameter_value(
                    f"{self.metric_name} got an unexpected keyword argument 'model'"
                )


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
def get_scorer(
    metric_name: str,
    model: str | None = None,
    **metric_kwargs: Any,
) -> DeepEvalScorer:
    """
    Get a DeepEval metric as an MLflow scorer.

    Args:
        metric_name: Name of the DeepEval metric (e.g., "AnswerRelevancy", "Faithfulness")
        model: {{ model }}
        metric_kwargs: Additional metric-specific parameters (e.g., threshold, include_reason)

    Returns:
        DeepEvalScorer instance that can be called with MLflow's scorer interface

    Examples:

    .. code-block:: python

        scorer = get_scorer("AnswerRelevancy", threshold=0.7, model="openai:/gpt-4")
        feedback = scorer(inputs="What is MLflow?", outputs="MLflow is a platform...")

        scorer = get_scorer("Faithfulness", model="openai:/gpt-4")
        feedback = scorer(trace=trace)
    """
    return DeepEvalScorer(
        metric_name=metric_name,
        model=model,
        **metric_kwargs,
    )


# Import namespaced metric classes from scorers subdirectory
from mlflow.genai.scorers.deepeval.scorers import (
    AnswerRelevancy,
    ArgumentCorrectness,
    Bias,
    ContextualPrecision,
    ContextualRecall,
    ContextualRelevancy,
    ConversationCompleteness,
    ExactMatch,
    Faithfulness,
    GoalAccuracy,
    Hallucination,
    JsonCorrectness,
    KnowledgeRetention,
    Misuse,
    NonAdvice,
    PatternMatch,
    PIILeakage,
    PlanAdherence,
    PlanQuality,
    PromptAlignment,
    RoleAdherence,
    RoleViolation,
    StepEfficiency,
    Summarization,
    TaskCompletion,
    ToolCorrectness,
    ToolUse,
    TopicAdherence,
    Toxicity,
    TurnRelevancy,
)

__all__ = [
    # Core classes
    "DeepEvalScorer",
    "get_scorer",
    # RAG metrics
    "AnswerRelevancy",
    "Faithfulness",
    "ContextualRecall",
    "ContextualPrecision",
    "ContextualRelevancy",
    # Agentic metrics
    "TaskCompletion",
    "ToolCorrectness",
    "ArgumentCorrectness",
    "StepEfficiency",
    "PlanAdherence",
    "PlanQuality",
    # Conversational metrics
    "TurnRelevancy",
    "RoleAdherence",
    "KnowledgeRetention",
    "ConversationCompleteness",
    "GoalAccuracy",
    "ToolUse",
    "TopicAdherence",
    # Safety metrics
    "Bias",
    "Toxicity",
    "NonAdvice",
    "Misuse",
    "PIILeakage",
    "RoleViolation",
    # General metrics
    "Hallucination",
    "Summarization",
    "JsonCorrectness",
    "PromptAlignment",
    # Deterministic metrics
    "ExactMatch",
    "PatternMatch",
    "experimental",
]
```

--------------------------------------------------------------------------------

---[FILE: agentic_metrics.py]---
Location: mlflow-master/mlflow/genai/scorers/deepeval/scorers/agentic_metrics.py

```python
"""Agentic metrics for evaluating AI agent performance."""

from __future__ import annotations

from typing import ClassVar

from mlflow.genai.judges.builtin import _MODEL_API_DOC
from mlflow.genai.scorers.deepeval import DeepEvalScorer
from mlflow.utils.annotations import experimental
from mlflow.utils.docstring_utils import format_docstring


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class TaskCompletion(DeepEvalScorer):
    """
    Evaluates whether an agent successfully completes its assigned task.

    This metric assesses the agent's ability to fully accomplish the task it was given,
    measuring how well the final output aligns with the expected task completion criteria.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import TaskCompletion

            scorer = TaskCompletion(threshold=0.7)
            feedback = scorer(trace=trace)  # trace contains inputs, outputs, and tool calls

    """

    metric_name: ClassVar[str] = "TaskCompletion"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class ToolCorrectness(DeepEvalScorer):
    """
    Evaluates whether an agent uses the correct tools for the task.

    This metric assesses if the agent selected and used the appropriate tools from its
    available toolset to accomplish the given task. It compares actual tool usage against
    expected tool selections.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import ToolCorrectness

            scorer = ToolCorrectness(threshold=0.8)
            feedback = scorer(
                trace=trace
            )  # trace contains inputs, tool calls, and expected tool calls

    """

    metric_name: ClassVar[str] = "ToolCorrectness"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class ArgumentCorrectness(DeepEvalScorer):
    """
    Evaluates whether an agent provides correct arguments when calling tools.

    This metric assesses the accuracy of the arguments/parameters the agent passes to
    tools, ensuring the agent uses tools with appropriate and valid inputs.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import ArgumentCorrectness

            scorer = ArgumentCorrectness(threshold=0.7)
            feedback = scorer(trace=trace)  # trace contains inputs and tool calls with arguments

    """

    metric_name: ClassVar[str] = "ArgumentCorrectness"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class StepEfficiency(DeepEvalScorer):
    """
    Evaluates the efficiency of an agent's steps in completing a task.

    This metric measures whether the agent takes an optimal path to task completion,
    avoiding unnecessary steps or redundant tool calls. Higher scores indicate more
    efficient agent behavior.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import StepEfficiency

            scorer = StepEfficiency(threshold=0.6)
            feedback = scorer(trace=trace)  # trace contains inputs and sequence of tool calls

    """

    metric_name: ClassVar[str] = "StepEfficiency"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class PlanAdherence(DeepEvalScorer):
    """
    Evaluates whether an agent adheres to its planned approach.

    This metric assesses how well the agent follows the plan it generated for completing
    a task. It measures the consistency between the agent's stated plan and its actual
    execution steps.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import PlanAdherence

            scorer = PlanAdherence(threshold=0.7)
            feedback = scorer(trace=trace)  # trace contains inputs, outputs, and tool calls

    """

    metric_name: ClassVar[str] = "PlanAdherence"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class PlanQuality(DeepEvalScorer):
    """
    Evaluates the quality of an agent's generated plan.

    This metric assesses whether the agent's plan is comprehensive, logical, and likely
    to achieve the desired task outcome. It evaluates plan structure before execution.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import PlanQuality

            scorer = PlanQuality(threshold=0.7)
            feedback = scorer(
                inputs="Plan a trip to Paris",
                outputs="Plan: 1) Book flights 2) Reserve hotel 3) Create itinerary",
            )

    """

    metric_name: ClassVar[str] = "PlanQuality"
```

--------------------------------------------------------------------------------

````
