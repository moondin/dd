---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 327
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 327 of 991)

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
Location: mlflow-master/mlflow/metrics/genai/__init__.py

```python
from mlflow.metrics.genai.base import EvaluationExample
from mlflow.metrics.genai.genai_metric import (
    make_genai_metric,
    make_genai_metric_from_prompt,
    retrieve_custom_metrics,
)
from mlflow.metrics.genai.metric_definitions import (
    answer_correctness,
    answer_relevance,
    answer_similarity,
    faithfulness,
    relevance,
)

__all__ = [
    "EvaluationExample",
    "make_genai_metric",
    "make_genai_metric_from_prompt",
    "answer_similarity",
    "answer_correctness",
    "faithfulness",
    "answer_relevance",
    "relevance",
    "retrieve_custom_metrics",
]
```

--------------------------------------------------------------------------------

---[FILE: v1.py]---
Location: mlflow-master/mlflow/metrics/genai/prompts/v1.py

```python
from dataclasses import dataclass, field
from typing import Any

from mlflow.metrics.genai.base import EvaluationExample
from mlflow.metrics.genai.prompt_template import PromptTemplate

# TODO: Update the default_mode and default_parameters to the correct values post experimentation
default_model = "openai:/gpt-4"
# Default parameters expressed in the OpenAI format
default_parameters = {
    "temperature": 0.0,
    "max_tokens": 200,
    "top_p": 1.0,
}


def _build_grading_prompt_template(include_input: bool = True) -> PromptTemplate:
    """
    Build the grading system prompt template based on whether input is included.

    Args:
        include_input: Whether the prompt should reference and include input from the user.
                      When False, the prompt only references the model's output.

    Returns:
        PromptTemplate configured for the specified input inclusion mode.
    """
    if include_input:
        # When input is included, mention both input and output in the instructions
        judge_description = (
            "You are an impartial judge. You will be given an input that was sent to a "
            "machine\nlearning model, and you will be given an output that the model produced. "
            "You\nmay also be given additional information that was used by the model to "
            "generate the output."
        )
        task_description = (
            "Your task is to determine a numerical score called {name} based on the input "
            "and output."
        )
        input_section = "\n\nInput:\n{input}"
    else:
        # When input is not included, only mention output in the instructions
        judge_description = (
            "You are an impartial judge. You will be given an output that a machine learning "
            "model produced.\nYou may also be given additional information that was used by "
            "the model to generate the output."
        )
        task_description = (
            "Your task is to determine a numerical score called {name} based on the output "
            "and any additional information provided."
        )
        input_section = ""

    return PromptTemplate(
        [
            f"""
Task:
You must return the following fields in your response in two lines, one below the other:
score: Your numerical score for the model's {{name}} based on the rubric
justification: Your reasoning about the model's {{name}} score

{judge_description}

{task_description}
A definition of {{name}} and a grading rubric are provided below.
You must use the grading rubric to determine your score. You must also justify your score.

Examples could be included below for reference. Make sure to use them as references and to
understand them before completing the task.{input_section}

Output:
{{output}}

{{grading_context_columns}}

Metric definition:
{{definition}}

Grading rubric:
{{grading_prompt}}

{{examples}}

You must return the following fields in your response in two lines, one below the other:
score: Your numerical score for the model's {{name}} based on the rubric
justification: Your reasoning about the model's {{name}} score

Do not add additional new lines. Do not add any other fields.
    """,
        ]
    )


grading_system_prompt_template = _build_grading_prompt_template(include_input=True)


@dataclass
class EvaluationModel:
    """
    Useful to compute v1 prompt for make_genai_metric
    """

    name: str
    definition: str
    grading_prompt: str
    examples: list[EvaluationExample] | None = None
    model: str = default_model
    parameters: dict[str, Any] = field(default_factory=lambda: default_parameters)
    include_input: bool = True

    def to_dict(self):
        examples_str = (
            ""
            if self.examples is None or len(self.examples) == 0
            else f"Examples:\n{self._format_examples()}"
        )

        template = _build_grading_prompt_template(include_input=self.include_input)

        return {
            "model": self.model,
            "eval_prompt": template.partial_fill(
                name=self.name,
                definition=self.definition,
                grading_prompt=self.grading_prompt,
                examples=examples_str,
            ),
            "parameters": self.parameters,
        }

    def _format_examples(self):
        return "\n".join(map(str, self.examples))


@dataclass
class AnswerSimilarityMetric:
    definition = (
        "Answer similarity is evaluated on the degree of semantic similarity of the provided "
        "output to the provided targets, which is the ground truth. Scores can be assigned based "
        "on the gradual similarity in meaning and description to the provided targets, where a "
        "higher score indicates greater alignment between the provided output and provided targets."
    )

    grading_prompt = (
        "Answer similarity: Below are the details for different scores:\n"
        "- Score 1: The output has little to no semantic similarity to the provided targets.\n"
        "- Score 2: The output displays partial semantic similarity to the provided targets on "
        "some aspects.\n"
        "- Score 3: The output has moderate semantic similarity to the provided targets.\n"
        "- Score 4: The output aligns with the provided targets in most aspects and has "
        "substantial semantic similarity.\n"
        "- Score 5: The output closely aligns with the provided targets in all significant aspects."
    )

    grading_context_columns = ["targets"]
    parameters = default_parameters
    default_model = default_model

    example_score_2 = EvaluationExample(
        input="What is MLflow?",
        output="MLflow is an open-source platform.",
        score=2,
        justification="The provided output is partially similar to the target, as it captures the "
        "general idea that MLflow is an open-source platform. However, it lacks the comprehensive "
        "details and context provided in the target about MLflow's purpose, development, and "
        "challenges it addresses. Therefore, it demonstrates partial, but not complete, "
        "semantic similarity.",
        grading_context={
            "targets": "MLflow is an open-source platform for managing the end-to-end "
            "machine learning (ML) lifecycle. It was developed by Databricks, a company "
            "that specializes in big data and machine learning solutions. MLflow is "
            "designed to address the challenges that data scientists and machine learning "
            "engineers face when developing, training, and deploying machine learning "
            "models."
        },
    )

    example_score_4 = EvaluationExample(
        input="What is MLflow?",
        output="MLflow is an open-source platform for managing machine learning workflows, "
        "including experiment tracking, model packaging, versioning, and deployment, simplifying "
        "the ML lifecycle.",
        score=4,
        justification="The provided output aligns closely with the target. It covers various key "
        "aspects mentioned in the target, including managing machine learning workflows, "
        "experiment tracking, model packaging, versioning, and deployment. While it may not include"
        " every single detail from the target, it demonstrates substantial semantic similarity.",
        grading_context={
            "targets": "MLflow is an open-source platform for managing the end-to-end "
            "machine learning (ML) lifecycle. It was developed by Databricks, a company "
            "that specializes in big data and machine learning solutions. MLflow is "
            "designed to address the challenges that data scientists and machine learning "
            "engineers face when developing, training, and deploying machine learning "
            "models."
        },
    )

    default_examples = [example_score_2, example_score_4]


@dataclass
class FaithfulnessMetric:
    definition = (
        "Faithfulness is only evaluated with the provided output and provided context, please "
        "ignore the provided input entirely when scoring faithfulness. Faithfulness assesses "
        "how much of the provided output is factually consistent with the provided context. A "
        "higher score indicates that a higher proportion of claims present in the output can be "
        "derived from the provided context. Faithfulness does not consider how much extra "
        "information from the context is not present in the output."
    )

    grading_prompt = (
        "Faithfulness: Below are the details for different scores:\n"
        "- Score 1: None of the claims in the output can be inferred from the provided context.\n"
        "- Score 2: Some of the claims in the output can be inferred from the provided context, "
        "but the majority of the output is missing from, inconsistent with, or contradictory to "
        "the provided context.\n"
        "- Score 3: Half or more of the claims in the output can be inferred from the provided "
        "context.\n"
        "- Score 4: Most of the claims in the output can be inferred from the provided context, "
        "with very little information that is not directly supported by the provided context.\n"
        "- Score 5: All of the claims in the output are directly supported by the provided "
        "context, demonstrating high faithfulness to the provided context."
    )

    grading_context_columns = ["context"]
    parameters = default_parameters
    default_model = default_model

    example_score_2 = EvaluationExample(
        input="How is MLflow related to Databricks?",
        output="Databricks is a company that specializes in big data and machine learning "
        "solutions. MLflow has nothing to do with Databricks. MLflow is an open-source platform "
        "for managing the end-to-end machine learning (ML) lifecycle.",
        score=2,
        justification='The output claims that "MLflow has nothing to do with Databricks" which is '
        'contradictory to the provided context that states "It was developed by Databricks". This '
        'is a major inconsistency. However, the output correctly identifies that "MLflow is an '
        'open-source platform for managing the end-to-end machine learning (ML) lifecycle" and '
        '"Databricks is a company that specializes in big data and machine learning solutions", '
        "which are both supported by the context. Therefore, some of the claims in the output can "
        "be inferred from the provided context, but the majority of the output is inconsistent "
        "with the provided context, leading to a faithfulness score of 2.",
        grading_context={
            "context": "MLflow is an open-source platform for managing the end-to-end machine "
            "learning (ML) lifecycle. It was developed by Databricks, a company that specializes "
            "in big data and machine learning solutions. MLflow is designed to address the "
            "challenges that data scientists and machine learning engineers face when developing, "
            "training, and deploying machine learning models."
        },
    )

    example_score_5 = EvaluationExample(
        input="How is MLflow related to Databricks?",
        output="Databricks is a company that specializes in big data and machine learning "
        "solutions.",
        score=5,
        justification='The output states that "Databricks is a company that specializes in big data'
        ' and machine learning solutions." This claim is directly supported by the context, which '
        'states "It was developed by Databricks, a company that specializes in big data and '
        'machine learning solutions." Therefore, the faithfulness score is 5 as all the claims in '
        'the output are directly supported by the provided context."',
        grading_context={
            "context": "MLflow is an open-source platform for managing the end-to-end "
            "machine learning (ML) lifecycle. It was developed by Databricks, a company "
            "that specializes in big data and machine learning solutions. MLflow is "
            "designed to address the challenges that data scientists and machine learning "
            "engineers face when developing, training, and deploying machine learning "
            "models."
        },
    )

    default_examples = [example_score_2, example_score_5]


@dataclass
class AnswerCorrectnessMetric:
    definition = (
        "Answer correctness is evaluated on the accuracy of the provided output based on the "
        "provided targets, which is the ground truth. Scores can be assigned based on the degree "
        "of semantic similarity and factual correctness of the provided output to the provided "
        "targets, where a higher score indicates higher degree of accuracy."
    )

    grading_prompt = (
        "Answer Correctness: Below are the details for different scores:\n"
        "- Score 1: The output is completely incorrect. It is completely different from or "
        "contradicts the provided targets.\n"
        "- Score 2: The output demonstrates some degree of semantic similarity and includes "
        "partially correct information. However, the output still has significant discrepancies "
        "with the provided targets or inaccuracies.\n"
        "- Score 3: The output addresses a couple of aspects of the input accurately, aligning "
        "with the provided targets. However, there are still omissions or minor inaccuracies.\n"
        "- Score 4: The output is mostly correct. It provides mostly accurate information, but "
        "there may be one or more minor omissions or inaccuracies.\n"
        "- Score 5: The output is correct. It demonstrates a high degree of accuracy and "
        "semantic similarity to the targets."
    )

    grading_context_columns = ["targets"]
    parameters = default_parameters
    default_model = default_model

    example_score_2 = EvaluationExample(
        input="How is MLflow related to Databricks?",
        output="Databricks is a data engineering and analytics platform designed to help "
        "organizations process and analyze large amounts of data. Databricks is a company "
        "specializing in big data and machine learning solutions.",
        score=2,
        justification="The output provided by the model does demonstrate some degree of semantic "
        "similarity to the targets, as it correctly identifies Databricks as a company "
        "specializing in big data and machine learning solutions. However, it fails to address "
        "the main point of the input question, which is the relationship between MLflow and "
        "Databricks. The output does not mention MLflow at all, which is a significant discrepancy "
        "with the provided targets. Therefore, the model's answer_correctness score is 2.",
        grading_context={
            "targets": "MLflow is an open-source platform for managing the end-to-end machine "
            "learning (ML) lifecycle. It was developed by Databricks, a company that specializes "
            "in big data and machine learning solutions. MLflow is designed to address the "
            "challenges that data scientists and machine learning engineers face when developing, "
            "training, and deploying machine learning models."
        },
    )

    example_score_4 = EvaluationExample(
        input="How is MLflow related to Databricks?",
        output="MLflow is a product created by Databricks to enhance the efficiency of machine "
        "learning processes.",
        score=4,
        justification="The output provided by the model is mostly correct. It correctly identifies "
        "that MLflow is a product created by Databricks. However, it does not mention that MLflow "
        "is an open-source platform for managing the end-to-end machine learning lifecycle, which "
        "is a significant part of its function. Therefore, while the output is mostly accurate, "
        "it has a minor omission, which is why it gets a score of 4 according to the grading "
        "rubric.",
        grading_context={
            "targets": "MLflow is an open-source platform for managing the end-to-end machine "
            "learning (ML) lifecycle. It was developed by Databricks, a company that specializes "
            "in big data and machine learning solutions. MLflow is designed to address the "
            "challenges that data scientists and machine learning engineers face when developing, "
            "training, and deploying machine learning models."
        },
    )

    default_examples = [example_score_2, example_score_4]


@dataclass
class AnswerRelevanceMetric:
    definition = (
        "Answer relevance measures the appropriateness and applicability of the output with "
        "respect to the input. Scores should reflect the extent to which the output directly "
        "addresses the question provided in the input, and give lower scores for incomplete or "
        "redundant output."
    )

    grading_prompt = (
        "Answer relevance: Please give a score from 1-5 based on the degree of relevance to the "
        "input, where the lowest and highest scores are defined as follows:"
        "- Score 1: The output doesn't mention anything about the question or is completely "
        "irrelevant to the input.\n"
        "- Score 5: The output addresses all aspects of the question and all parts of the output "
        "are meaningful and relevant to the question."
    )

    parameters = default_parameters
    default_model = default_model

    example_score_2 = EvaluationExample(
        input="How is MLflow related to Databricks?",
        output="Databricks is a company that specializes in big data and machine learning "
        "solutions.",
        score=2,
        justification="The output provided by the model does give some information about "
        "Databricks, which is part of the input question. However, it does not address the main "
        "point of the question, which is the relationship between MLflow and Databricks. "
        "Therefore, while the output is not completely irrelevant, it does not fully answer the "
        "question, leading to a lower score.",
    )

    example_score_5 = EvaluationExample(
        input="How is MLflow related to Databricks?",
        output="MLflow is a product created by Databricks to enhance the efficiency of machine "
        "learning processes.",
        score=5,
        justification="The output directly addresses the input question by explaining the "
        "relationship between MLflow and Databricks. It provides a clear and concise answer that "
        "MLflow is a product created by Databricks, and also adds relevant information about the "
        "purpose of MLflow, which is to enhance the efficiency of machine learning processes. "
        "Therefore, the output is highly relevant to the input and deserves a full score.",
    )

    default_examples = [example_score_2, example_score_5]


@dataclass
class RelevanceMetric:
    definition = (
        "Relevance encompasses the appropriateness, significance, and applicability of the output "
        "with respect to both the input and context. Scores should reflect the extent to which the "
        "output directly addresses the question provided in the input, given the provided context."
    )

    grading_prompt = (
        "Relevance: Below are the details for different scores:"
        "- Score 1: The output doesn't mention anything about the question or is completely "
        "irrelevant to the provided context.\n"
        "- Score 2: The output provides some relevance to the question and is somehow related "
        "to the provided context.\n"
        "- Score 3: The output mostly answers the question and is largely consistent with the "
        "provided context.\n"
        "- Score 4: The output answers the question and is consistent with the provided context.\n"
        "- Score 5: The output answers the question comprehensively using the provided context."
    )

    grading_context_columns = ["context"]
    parameters = default_parameters
    default_model = default_model

    example_score_2 = EvaluationExample(
        input="How is MLflow related to Databricks?",
        output="Databricks is a data engineering and analytics platform designed to help "
        "organizations process and analyze large amounts of data. Databricks is a company "
        "specializing in big data and machine learning solutions.",
        score=2,
        justification="The output provides relevant information about Databricks, mentioning it "
        "as a company specializing in big data and machine learning solutions. However, it doesn't "
        "directly address how MLflow is related to Databricks, which is the specific question "
        "asked in the input. Therefore, the output is only somewhat related to the provided "
        "context.",
        grading_context={
            "context": "MLflow is an open-source platform for managing the end-to-end machine "
            "learning (ML) lifecycle. It was developed by Databricks, a company that specializes "
            "in big data and machine learning solutions. MLflow is designed to address the "
            "challenges that data scientists and machine learning engineers face when developing, "
            "training, and deploying machine learning models."
        },
    )

    example_score_4 = EvaluationExample(
        input="How is MLflow related to Databricks?",
        output="MLflow is a product created by Databricks to enhance the efficiency of machine "
        "learning processes.",
        score=4,
        justification="The output provides a relevant and accurate statement about the "
        "relationship between MLflow and Databricks. While it doesn't provide extensive detail, "
        "it still offers a substantial and meaningful response. To achieve a score of 5, the "
        "response could be further improved by providing additional context or details about "
        "how MLflow specifically functions within the Databricks ecosystem.",
        grading_context={
            "context": "MLflow is an open-source platform for managing the end-to-end machine "
            "learning (ML) lifecycle. It was developed by Databricks, a company that specializes "
            "in big data and machine learning solutions. MLflow is designed to address the "
            "challenges that data scientists and machine learning engineers face when developing, "
            "training, and deploying machine learning models."
        },
    )

    default_examples = [example_score_2, example_score_4]
```

--------------------------------------------------------------------------------

---[FILE: autolog.py]---
Location: mlflow-master/mlflow/mistral/autolog.py

```python
import inspect
import logging

import mlflow
import mlflow.mistral
from mlflow.entities import SpanType
from mlflow.mistral.chat import convert_tool_to_mlflow_chat_tool
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.provider import detach_span_from_context, set_span_in_context
from mlflow.tracing.utils import set_span_chat_tools
from mlflow.utils.autologging_utils.config import AutoLoggingConfig

_logger = logging.getLogger(__name__)


def _construct_full_inputs(func, *args, **kwargs):
    signature = inspect.signature(func)
    # this does not create copy. So values should not be mutated directly
    arguments = signature.bind_partial(*args, **kwargs).arguments

    if "self" in arguments:
        arguments.pop("self")

    return arguments


def patched_class_call(original, self, *args, **kwargs):
    """Synchronous wrapper that traces Mistral SDK calls using a context manager."""
    with TracingSession(original, self, args, kwargs) as manager:
        output = original(self, *args, **kwargs)
        manager.output = output
        return output


async def async_patched_class_call(original, self, *args, **kwargs):
    """Async wrapper that traces Mistral SDK calls using a context manager."""
    async with TracingSession(original, self, args, kwargs) as manager:
        output = await original(self, *args, **kwargs)
        manager.output = output
        return output


class TracingSession:
    """Context manager for handling MLflow spans in both sync and async contexts."""

    def __init__(self, original, instance, args, kwargs):
        self.original = original
        self.instance = instance
        self.inputs = _construct_full_inputs(original, instance, *args, **kwargs)

        # These attributes are set outside the constructor.
        self.span = None
        self.token = None
        self.output = None

    def __enter__(self):
        return self._enter_impl()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._exit_impl(exc_type, exc_val, exc_tb)

    async def __aenter__(self):
        return self._enter_impl()

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        self._exit_impl(exc_type, exc_val, exc_tb)

    def _enter_impl(self):
        config = AutoLoggingConfig.init(flavor_name=mlflow.mistral.FLAVOR_NAME)
        if not config.log_traces:
            return self

        self.span = mlflow.start_span_no_context(
            name=f"{self.instance.__class__.__name__}.{self.original.__name__}",
            span_type=SpanType.CHAT_MODEL,
            inputs=self.inputs,
            attributes={SpanAttributeKey.MESSAGE_FORMAT: "mistral"},
        )

        if (tools := self.inputs.get("tools")) is not None:
            try:
                tools = [convert_tool_to_mlflow_chat_tool(tool) for tool in tools if tool]
                set_span_chat_tools(self.span, tools)
            except Exception as e:
                _logger.debug(f"Failed to set tools for {self.span}. Error: {e}")

        # Attach the span to the current context. A single SDK call can create child spans.
        self.token = set_span_in_context(self.span)
        return self

    def _exit_impl(self, exc_type, exc_val, exc_tb) -> None:
        if not self.span:
            return

        # Detach span from the context first to avoid leaking the context on errors.
        detach_span_from_context(self.token)

        if exc_val:
            self.span.record_exception(exc_val)

        try:
            if usage := _parse_usage(self.output):
                self.span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage)
        except Exception as e:
            _logger.debug(
                f"Failed to extract token usage for span {self.span.name}: {e}",
                exc_info=True,
            )

        # End the span with captured outputs. Keep original object for backward compatibility.
        self.span.end(outputs=self.output)


def _parse_usage(output):
    usage = getattr(output, "usage", None)
    if usage is None:
        return None

    usage_dict = {}
    if getattr(usage, "prompt_tokens", None) is not None:
        usage_dict[TokenUsageKey.INPUT_TOKENS] = usage.prompt_tokens
    if getattr(usage, "completion_tokens", None) is not None:
        usage_dict[TokenUsageKey.OUTPUT_TOKENS] = usage.completion_tokens
    if getattr(usage, "total_tokens", None) is not None:
        usage_dict[TokenUsageKey.TOTAL_TOKENS] = usage.total_tokens

    return usage_dict or None
```

--------------------------------------------------------------------------------

---[FILE: chat.py]---
Location: mlflow-master/mlflow/mistral/chat.py

```python
from typing import Any

from mlflow.types.chat import (
    ChatTool,
    FunctionToolDefinition,
)


def convert_tool_to_mlflow_chat_tool(tool: dict[str, Any]) -> ChatTool:
    """
    Convert Mistral AI tool definition into MLflow's standard format (OpenAI compatible).

    Ref: https://docs.mistral.ai/capabilities/function_calling/#tools

    Args:
        tool: A dictionary represents a single tool definition in the input request.

    Returns:
        ChatTool: MLflow's standard tool definition object.
    """
    function = tool["function"]
    return ChatTool(
        type="function",
        function=FunctionToolDefinition(
            name=function["name"],
            description=function.get("description"),
            parameters=function["parameters"],
        ),
    )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/mistral/__init__.py

```python
from mlflow.mistral.autolog import async_patched_class_call, patched_class_call
from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.utils.autologging_utils import autologging_integration, safe_patch

FLAVOR_NAME = "mistral"


@autologging_integration(FLAVOR_NAME)
def autolog(
    log_traces: bool = True,
    disable: bool = False,
    silent: bool = False,
):
    """
    Enables (or disables) and configures autologging from Mistral AI to MLflow.
    Only synchronous calls to the Text generation API are supported.
    Asynchronous APIs and streaming are not recorded.

    Args:
        log_traces: If ``True``, traces are logged for Mistral AI models.
            If ``False``, no traces are collected during inference. Default to ``True``.
        disable: If ``True``, disables the Mistral AI autologging. Default to ``False``.
        silent: If ``True``, suppress all event logs and warnings from MLflow during Mistral AI
            autologging. If ``False``, show all events and warnings.
    """
    from mistralai.chat import Chat

    safe_patch(
        FLAVOR_NAME,
        Chat,
        "complete",
        patched_class_call,
    )

    safe_patch(
        FLAVOR_NAME,
        Chat,
        "complete_async",
        async_patched_class_call,
    )
    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )
```

--------------------------------------------------------------------------------

---[FILE: auth_policy.py]---
Location: mlflow-master/mlflow/models/auth_policy.py

```python
from mlflow.models.resources import Resource, _ResourceBuilder


class UserAuthPolicy:
    """
    A minimal list of scopes that the user should have access to
    in order to invoke this model

    Note: This is only compatible with Databricks Environment currently.
    TODO: Add Databricks Documentation for User Auth Policy

    Args:
        api_scopes: A list of scopes. Example: "vectorsearch.vector-search-indexes", "sql"
    """

    def __init__(self, api_scopes: list[str]):
        self._api_scopes = api_scopes

    @property
    def api_scopes(self) -> list[str]:
        return self._api_scopes

    @api_scopes.setter
    def api_scopes(self, value: list[str]):
        self._api_scopes = value

    def to_dict(self):
        return {"api_scopes": self.api_scopes}


class SystemAuthPolicy:
    """
    System Auth Policy, which defines a list of resources required to
    serve this model
    """

    def __init__(self, resources: list[Resource]):
        self._resources = resources

    @property
    def resources(self) -> list[Resource]:
        return self._resources

    @resources.setter
    def resources(self, value: list[Resource]):
        self._resources = value

    def to_dict(self):
        serialized_resources = _ResourceBuilder.from_resources(self.resources)
        return {"resources": serialized_resources}


class AuthPolicy:
    """
    Specifies the authentication policy for the model, which includes two key
    components.
        System Auth Policy: A list of resources required to serve this model
        User Auth Policy: A minimal list of scopes that the user should
                          have access to, in order to invoke this model
    """

    def __init__(
        self,
        user_auth_policy: UserAuthPolicy | None = None,
        system_auth_policy: SystemAuthPolicy | None = None,
    ):
        self.user_auth_policy = user_auth_policy
        self.system_auth_policy = system_auth_policy

    def to_dict(self):
        """
        Serialize Auth Policy to a dictionary
        """
        return {
            "system_auth_policy": self.system_auth_policy.to_dict()
            if self.system_auth_policy
            else {},
            "user_auth_policy": self.user_auth_policy.to_dict() if self.user_auth_policy else {},
        }
```

--------------------------------------------------------------------------------

````
