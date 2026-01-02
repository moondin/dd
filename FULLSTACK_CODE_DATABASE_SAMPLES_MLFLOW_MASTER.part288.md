---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 288
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 288 of 991)

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

---[FILE: conversational_metrics.py]---
Location: mlflow-master/mlflow/genai/scorers/deepeval/scorers/conversational_metrics.py

```python
"""Conversational metrics for evaluating multi-turn dialogue performance."""

from __future__ import annotations

from typing import ClassVar

from mlflow.genai.judges.builtin import _MODEL_API_DOC
from mlflow.genai.scorers.deepeval import DeepEvalScorer
from mlflow.utils.annotations import experimental
from mlflow.utils.docstring_utils import format_docstring


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class TurnRelevancy(DeepEvalScorer):
    """
    Evaluates the relevance of each conversation turn.

    This multi-turn metric assesses whether each response in a conversation is relevant
    to the corresponding user query. It evaluates coherence across the entire dialogue.

    Note: This is a multi-turn metric that requires a list of traces representing
    conversation turns.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import TurnRelevancy

            scorer = TurnRelevancy(threshold=0.7)
            feedback = scorer(traces=[trace1, trace2, trace3])  # List of conversation turns

    """

    metric_name: ClassVar[str] = "TurnRelevancy"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class RoleAdherence(DeepEvalScorer):
    """
    Evaluates whether the agent stays in character throughout the conversation.

    This multi-turn metric assesses if the agent consistently maintains its assigned
    role, personality, and behavioral constraints across all conversation turns.

    Note: This is a multi-turn metric that requires a list of traces representing
    conversation turns.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import RoleAdherence

            scorer = RoleAdherence(threshold=0.8)
            feedback = scorer(traces=[trace1, trace2, trace3])

    """

    metric_name: ClassVar[str] = "RoleAdherence"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class KnowledgeRetention(DeepEvalScorer):
    """
    Evaluates the chatbot's ability to retain and use information from earlier in the conversation.

    This multi-turn metric assesses whether the agent remembers and appropriately
    references information from previous turns in the conversation, demonstrating
    context awareness.

    Note: This is a multi-turn metric that requires a list of traces representing
    conversation turns.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import KnowledgeRetention

            scorer = KnowledgeRetention(threshold=0.7)
            feedback = scorer(traces=[trace1, trace2, trace3])

    """

    metric_name: ClassVar[str] = "KnowledgeRetention"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class ConversationCompleteness(DeepEvalScorer):
    """
    Evaluates whether the conversation satisfies the user's needs and goals.

    This multi-turn metric assesses if the conversation reaches a satisfactory conclusion,
    addressing all aspects of the user's original request or question.

    Note: This is a multi-turn metric that requires a list of traces representing
    conversation turns.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import (
                ConversationCompleteness,
            )

            scorer = ConversationCompleteness(threshold=0.7)
            feedback = scorer(traces=[trace1, trace2, trace3])

    """

    metric_name: ClassVar[str] = "ConversationCompleteness"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class GoalAccuracy(DeepEvalScorer):
    """
    Evaluates the accuracy of achieving conversation goals in a multi-turn context.

    This multi-turn metric assesses whether the agent successfully achieves the
    specified goals or objectives throughout the conversation, measuring goal-oriented
    effectiveness.

    Note: This is a multi-turn metric that requires a list of traces representing
    conversation turns.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import GoalAccuracy

            scorer = GoalAccuracy(threshold=0.7)
            feedback = scorer(traces=[trace1, trace2, trace3])

    """

    metric_name: ClassVar[str] = "GoalAccuracy"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class ToolUse(DeepEvalScorer):
    """
    Evaluates the effectiveness of tool usage throughout a conversation.

    This multi-turn metric assesses whether the agent appropriately uses available
    tools across multiple conversation turns, measuring tool selection and usage
    effectiveness in a dialogue context.

    Note: This is a multi-turn metric that requires a list of traces representing
    conversation turns.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import ToolUse

            scorer = ToolUse(threshold=0.7)
            feedback = scorer(traces=[trace1, trace2, trace3])

    """

    metric_name: ClassVar[str] = "ToolUse"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class TopicAdherence(DeepEvalScorer):
    """
    Evaluates adherence to specified topics throughout a conversation.

    This multi-turn metric assesses whether the agent stays on topic across the
    entire conversation, avoiding unnecessary digressions or topic drift.

    Note: This is a multi-turn metric that requires a list of traces representing
    conversation turns.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import TopicAdherence

            scorer = TopicAdherence(threshold=0.7)
            feedback = scorer(traces=[trace1, trace2, trace3])

    """

    metric_name: ClassVar[str] = "TopicAdherence"
```

--------------------------------------------------------------------------------

---[FILE: rag_metrics.py]---
Location: mlflow-master/mlflow/genai/scorers/deepeval/scorers/rag_metrics.py

```python
"""RAG (Retrieval-Augmented Generation) metrics for DeepEval integration."""

from __future__ import annotations

from typing import ClassVar

from mlflow.genai.judges.builtin import _MODEL_API_DOC
from mlflow.genai.scorers.deepeval import DeepEvalScorer
from mlflow.utils.annotations import experimental
from mlflow.utils.docstring_utils import format_docstring


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class AnswerRelevancy(DeepEvalScorer):
    """
    Evaluates whether the output is relevant to the input.

    This metric measures how relevant the actual output is to the input query. It evaluates
    whether the generated response directly addresses the question asked. Higher scores indicate
    better relevance to the input.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import AnswerRelevancy

            scorer = AnswerRelevancy(threshold=0.7, model="openai:/gpt-4")
            feedback = scorer(
                inputs="What is the capital of France?",
                outputs="Paris is the capital of France.",
            )
            print(feedback.value)  # CategoricalRating.YES or CategoricalRating.NO
    """

    metric_name: ClassVar[str] = "AnswerRelevancy"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class Faithfulness(DeepEvalScorer):
    """
    Evaluates whether the output is factually consistent with the retrieval context.

    This metric determines if claims in the output can be inferred from the provided context.
    It helps detect hallucinations by checking if the generated content is grounded in the
    retrieved documents.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import Faithfulness

            scorer = Faithfulness(threshold=0.8, model="databricks")
            feedback = scorer(trace=trace)  # trace contains outputs and retrieval_context
    """

    metric_name: ClassVar[str] = "Faithfulness"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class ContextualRecall(DeepEvalScorer):
    """
    Evaluates whether the retrieval context contains all necessary information.

    This metric measures how much of the expected output can be attributed to the nodes in
    the retrieval context. It assesses the quality of the retriever by checking if all
    required information is present in the retrieved documents.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import ContextualRecall

            scorer = ContextualRecall(model="databricks")
            feedback = scorer(trace=trace)  # trace contains expected_output and retrieval_context
    """

    metric_name: ClassVar[str] = "ContextualRecall"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class ContextualPrecision(DeepEvalScorer):
    """
    Evaluates whether relevant nodes in the retrieval context are ranked higher than
    irrelevant ones.

    This metric assesses the quality of your retriever by checking if the most relevant
    retrieved context are ranked higher than less relevant ones. It helps evaluate the
    ranking effectiveness of your retrieval system.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import ContextualPrecision

            scorer = ContextualPrecision(threshold=0.7)
            feedback = scorer(
                trace=trace
            )  # trace contains input, expected_output, and retrieval_context
    """

    metric_name: ClassVar[str] = "ContextualPrecision"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class ContextualRelevancy(DeepEvalScorer):
    """
    Evaluates the overall relevance of information in the retrieval context.

    This metric determines what fraction of the retrieval context is relevant to the input.
    It helps assess whether your retriever is returning focused, relevant information or
    including too much irrelevant content.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import ContextualRelevancy

            scorer = ContextualRelevancy(threshold=0.6)
            feedback = scorer(trace=trace)  # trace contains input and retrieval_context
    """

    metric_name: ClassVar[str] = "ContextualRelevancy"
```

--------------------------------------------------------------------------------

---[FILE: safety_metrics.py]---
Location: mlflow-master/mlflow/genai/scorers/deepeval/scorers/safety_metrics.py

```python
"""Safety and responsible AI metrics for content evaluation."""

from __future__ import annotations

from typing import ClassVar

from mlflow.genai.judges.builtin import _MODEL_API_DOC
from mlflow.genai.scorers.deepeval import DeepEvalScorer
from mlflow.utils.annotations import experimental
from mlflow.utils.docstring_utils import format_docstring


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class Bias(DeepEvalScorer):
    """
    Detects bias in LLM outputs including gender, racial, or political bias.

    This metric evaluates whether the output contains biased language or perspectives
    that unfairly favor or discriminate against particular groups or viewpoints.

    Args:
        threshold: Maximum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import Bias

            scorer = Bias(threshold=0.3, model="databricks")
            feedback = scorer(
                inputs="Who makes better engineers?",
                outputs="Men typically make better engineers than women.",
            )

    """

    metric_name: ClassVar[str] = "Bias"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class Toxicity(DeepEvalScorer):
    """
    Evaluates the presence of harmful, offensive, or toxic content.

    This metric detects toxic language including hate speech, profanity, insults,
    and other forms of harmful content in LLM outputs.

    Args:
        threshold: Maximum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import Toxicity

            scorer = Toxicity(threshold=0.2, model="databricks")
            feedback = scorer(
                outputs="Your response text here",
            )

    """

    metric_name: ClassVar[str] = "Toxicity"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class NonAdvice(DeepEvalScorer):
    """
    Detects whether the output inappropriately provides advice in restricted domains.

    This metric identifies cases where the LLM provides advice on topics where it
    should not (e.g., medical, legal, or financial advice without proper disclaimers).

    Args:
        threshold: Maximum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import NonAdvice

            scorer = NonAdvice(threshold=0.3)
            feedback = scorer(
                inputs="Should I invest all my savings in cryptocurrency?",
                outputs="Yes, you should definitely invest everything in Bitcoin.",
            )

    """

    metric_name: ClassVar[str] = "NonAdvice"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class Misuse(DeepEvalScorer):
    """
    Detects potential misuse scenarios where the output could enable harmful activities.

    This metric identifies cases where the LLM output could potentially be used for
    harmful purposes, such as providing instructions for illegal activities or
    dangerous actions.

    Args:
        threshold: Maximum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import Misuse

            scorer = Misuse(threshold=0.3)
            feedback = scorer(
                inputs="How do I bypass security systems?",
                outputs="Here are steps to bypass common security systems...",
            )

    """

    metric_name: ClassVar[str] = "Misuse"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class PIILeakage(DeepEvalScorer):
    """
    Identifies personal identifiable information (PII) leakage in outputs.

    This metric detects when the LLM output contains sensitive personal information
    such as names, addresses, phone numbers, email addresses, social security numbers,
    or other identifying information that should be protected.

    Args:
        threshold: Maximum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import PIILeakage

            scorer = PIILeakage(threshold=0.3)
            feedback = scorer(
                outputs="John Smith lives at 123 Main St, his SSN is 123-45-6789",
            )

    """

    metric_name: ClassVar[str] = "PIILeakage"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class RoleViolation(DeepEvalScorer):
    """
    Detects violations of the agent's assigned role or behavioral constraints.

    This metric identifies cases where the LLM violates its intended role,
    such as a customer service bot engaging in political discussions or a
    coding assistant providing medical advice.

    Args:
        threshold: Maximum score threshold for passing (default: 0.5, range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.deepeval import RoleViolation

            scorer = RoleViolation(threshold=0.3)
            feedback = scorer(
                inputs="What's your opinion on politics?",
                outputs="As a customer service bot, here's my political view...",
            )

    """

    metric_name: ClassVar[str] = "RoleViolation"
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/scorers/deepeval/scorers/__init__.py

```python
"""DeepEval metric scorers organized by category."""

from __future__ import annotations

from typing import ClassVar

from mlflow.genai.judges.builtin import _MODEL_API_DOC
from mlflow.genai.scorers.deepeval import DeepEvalScorer
from mlflow.genai.scorers.deepeval.scorers.agentic_metrics import (
    ArgumentCorrectness,
    PlanAdherence,
    PlanQuality,
    StepEfficiency,
    TaskCompletion,
    ToolCorrectness,
)
from mlflow.genai.scorers.deepeval.scorers.conversational_metrics import (
    ConversationCompleteness,
    GoalAccuracy,
    KnowledgeRetention,
    RoleAdherence,
    ToolUse,
    TopicAdherence,
    TurnRelevancy,
)
from mlflow.genai.scorers.deepeval.scorers.rag_metrics import (
    AnswerRelevancy,
    ContextualPrecision,
    ContextualRecall,
    ContextualRelevancy,
    Faithfulness,
)
from mlflow.genai.scorers.deepeval.scorers.safety_metrics import (
    Bias,
    Misuse,
    NonAdvice,
    PIILeakage,
    RoleViolation,
    Toxicity,
)
from mlflow.utils.annotations import experimental
from mlflow.utils.docstring_utils import format_docstring


# General-purpose metrics
@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class Hallucination(DeepEvalScorer):
    """
    Detects hallucinations where the LLM fabricates information not present in the context.

    Args:
        threshold: Maximum score threshold for passing (range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            scorer = Hallucination(threshold=0.3)
            feedback = scorer(trace=trace)
    """

    metric_name: ClassVar[str] = "Hallucination"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class Summarization(DeepEvalScorer):
    """
    Evaluates the quality and accuracy of text summarization.

    Args:
        threshold: Minimum score threshold for passing (range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            scorer = Summarization(threshold=0.7)
            feedback = scorer(inputs="Long text...", outputs="Summary...")
    """

    metric_name: ClassVar[str] = "Summarization"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class JsonCorrectness(DeepEvalScorer):
    """
    Validates JSON output against an expected schema.

    Note: Requires `expected_schema` parameter in expectations dict.

    Args:
        threshold: Minimum score threshold for passing (range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            scorer = JsonCorrectness(threshold=0.8)
            feedback = scorer(
                outputs='{"name": "John"}',
                expectations={"expected_schema": {...}},
            )
    """

    metric_name: ClassVar[str] = "JsonCorrectness"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class PromptAlignment(DeepEvalScorer):
    """
    Measures how well the output aligns with instructions given in the prompt.

    Args:
        threshold: Minimum score threshold for passing (range: 0.0-1.0)
        model: {{ model }}
        include_reason: Whether to include reasoning in the evaluation

    Examples:
        .. code-block:: python

            scorer = PromptAlignment(threshold=0.7)
            feedback = scorer(inputs="Instructions...", outputs="Response...")
    """

    metric_name: ClassVar[str] = "PromptAlignment"


@experimental(version="3.8.0")
class ExactMatch(DeepEvalScorer):
    """
    Performs exact string matching between output and expected output.

    Args:
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)

    Examples:
        .. code-block:: python

            scorer = ExactMatch()
            feedback = scorer(
                outputs="Paris",
                expectations={"expected_output": "Paris"},
            )
    """

    metric_name: ClassVar[str] = "ExactMatch"

    def __init__(
        self,
        threshold: float = 0.5,
        **kwargs,
    ):
        self._validate_kwargs(**kwargs)
        super().__init__(
            metric_name=self.metric_name,
            model=None,
            threshold=threshold,
            **kwargs,
        )


@experimental(version="3.8.0")
class PatternMatch(DeepEvalScorer):
    """
    Performs regex pattern matching on the output.

    Args:
        pattern: Regex pattern to match against the output
        threshold: Minimum score threshold for passing (default: 0.5, range: 0.0-1.0)

    Examples:
        .. code-block:: python

            scorer = PatternMatch(pattern=r"\\d{3}-\\d{3}-\\d{4}")
            feedback = scorer(outputs="Phone: 555-123-4567")
    """

    metric_name: ClassVar[str] = "PatternMatch"

    def __init__(
        self,
        pattern: str,
        threshold: float = 0.5,
        **kwargs,
    ):
        self._validate_kwargs(**kwargs)
        super().__init__(
            metric_name=self.metric_name,
            model=None,
            threshold=threshold,
            pattern=pattern,
            **kwargs,
        )


__all__ = [
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
]
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: mlflow-master/mlflow/genai/scorers/ragas/models.py

```python
from __future__ import annotations

import instructor
import litellm
from langchain_core.outputs import Generation, LLMResult
from ragas.llms import BaseRagasLLM
from ragas.llms.litellm_llm import LiteLLMStructuredLLM

from mlflow.exceptions import MlflowException
from mlflow.genai.judges.adapters.databricks_managed_judge_adapter import (
    call_chat_completions,
)
from mlflow.genai.judges.adapters.databricks_serving_endpoint_adapter import (
    _invoke_databricks_serving_endpoint,
)
from mlflow.genai.judges.constants import _DATABRICKS_DEFAULT_JUDGE_MODEL


class DatabricksRagasLLM(BaseRagasLLM):
    """
    RAGAS LLM adapter for Databricks managed judge.

    Uses the default Databricks endpoint via call_chat_completions.
    """

    def __init__(self):
        super().__init__()

    def generate_text(self, prompt: str, **kwargs) -> str:
        # Convert LangChain StringPromptValue to string if needed
        if hasattr(prompt, "to_string"):
            prompt = prompt.to_string()
        elif not isinstance(prompt, str):
            prompt = str(prompt)

        result = call_chat_completions(user_prompt=prompt, system_prompt="")
        return result.output

    async def agenerate_text(self, prompt: str, **kwargs):
        text = self.generate_text(prompt, **kwargs)
        generation = Generation(text=text)
        return LLMResult(generations=[[generation]])

    def get_model_name(self) -> str:
        return _DATABRICKS_DEFAULT_JUDGE_MODEL

    def is_finished(self, result=None) -> bool:
        return True


class DatabricksServingEndpointRagasLLM(BaseRagasLLM):
    """
    RAGAS LLM adapter for Databricks serving endpoints.

    Uses the model serving API via _invoke_databricks_serving_endpoint.
    """

    def __init__(self, endpoint_name: str):
        super().__init__()
        self._endpoint_name = endpoint_name

    def generate_text(self, prompt: str, **kwargs) -> str:
        # Convert LangChain StringPromptValue to string if needed
        if hasattr(prompt, "to_string"):
            prompt = prompt.to_string()
        elif not isinstance(prompt, str):
            prompt = str(prompt)

        output = _invoke_databricks_serving_endpoint(
            model_name=self._endpoint_name,
            prompt=prompt,
            num_retries=3,
            response_format=None,
        )
        return output.response

    async def agenerate_text(self, prompt: str, **kwargs):
        text = self.generate_text(prompt, **kwargs)
        generation = Generation(text=text)
        return LLMResult(generations=[[generation]])

    def get_model_name(self) -> str:
        return f"databricks:/{self._endpoint_name}"

    def is_finished(self, result=None) -> bool:
        return True


def create_ragas_model(model_uri: str):
    """
    Create a RAGAS LLM adapter from a model URI.

    Args:
        model_uri: Model URI in one of these formats:
            - "databricks" - Use default Databricks managed judge
            - "databricks:/endpoint" - Use Databricks serving endpoint
            - "provider:/model" - Use LiteLLM (e.g., "openai:/gpt-4")

    Returns:
        A RAGAS-compatible LLM adapter

    Raises:
        MlflowException: If the model URI format is invalid
    """
    if model_uri == "databricks":
        return DatabricksRagasLLM()
    elif model_uri.startswith("databricks:/"):
        endpoint_name = model_uri.split(":", 1)[1].removeprefix("/")
        return DatabricksServingEndpointRagasLLM(endpoint_name)
    elif ":" in model_uri:
        provider, model_name = model_uri.split(":", 1)
        model_name = model_name.removeprefix("/")
        client = instructor.from_litellm(litellm.completion)
        return LiteLLMStructuredLLM(
            client=client,
            model=f"{provider}/{model_name}",
            provider=provider,
        )
    else:
        raise MlflowException.invalid_parameter_value(
            f"Invalid model_uri format: '{model_uri}'. "
            f"Must be 'databricks' or include a provider prefix (e.g., 'openai:/gpt-4') "
            f"or a Databricks serving endpoint (e.g., 'databricks:/<endpoint_name>')."
        )
```

--------------------------------------------------------------------------------

---[FILE: registry.py]---
Location: mlflow-master/mlflow/genai/scorers/ragas/registry.py

```python
from __future__ import annotations

from mlflow.exceptions import MlflowException

# (classpath, is_deterministic)
_METRIC_REGISTRY = {
    # Retrieval Augmented Generation
    "ContextPrecision": ("ragas.metrics.ContextPrecision", False),
    "NonLLMContextPrecisionWithReference": (
        "ragas.metrics.NonLLMContextPrecisionWithReference",
        True,
    ),
    "ContextRecall": ("ragas.metrics.ContextRecall", False),
    "NonLLMContextRecall": ("ragas.metrics.NonLLMContextRecall", True),
    "ContextEntityRecall": ("ragas.metrics.ContextEntityRecall", False),
    "NoiseSensitivity": ("ragas.metrics.NoiseSensitivity", False),
    # TODO: ResponseRelevancy requires embeddings model instead of LLM
    # "ResponseRelevancy": ("ragas.metrics.ResponseRelevancy", False),
    "Faithfulness": ("ragas.metrics.Faithfulness", False),
    # TODO: Nvidia Metrics not yet supported
    # "AnswerAccuracy": ("ragas.metrics.AnswerAccuracy", False),
    # "ContextRelevance": ("ragas.metrics.ContextRelevance", False),
    # "ResponseGroundedness": ("ragas.metrics.ResponseGroundedness", False),
    # TODO: Agents or Tool Use Cases metrics not yet supported
    # "TopicAdherence": ("ragas.metrics.TopicAdherence", False),
    # "ToolCallAccuracy": ("ragas.metrics.ToolCallAccuracy", False),
    # "ToolCallF1": ("ragas.metrics.ToolCallF1", False),
    # "AgentGoalAccuracy": ("ragas.metrics.AgentGoalAccuracy", False),
    # Natural Language Comparison
    "FactualCorrectness": ("ragas.metrics.FactualCorrectness", False),
    # TODO: SemanticSimilarity requires embeddings model instead of LLM
    # "SemanticSimilarity": ("ragas.metrics.SemanticSimilarity", False),
    "NonLLMStringSimilarity": ("ragas.metrics.NonLLMStringSimilarity", True),
    "BleuScore": ("ragas.metrics.BleuScore", True),
    "ChrfScore": ("ragas.metrics.ChrfScore", True),
    "RougeScore": ("ragas.metrics.RougeScore", True),
    "StringPresence": ("ragas.metrics.StringPresence", True),
    "ExactMatch": ("ragas.metrics.ExactMatch", True),
    # TODO: SQL metrics not yet supported
    # "DatacompyScore": ("ragas.metrics.DatacompyScore", False),
    # "SQLSemanticEquivalence": ("ragas.metrics.SQLSemanticEquivalence", False),
    # General Purpose
    "AspectCritic": ("ragas.metrics.AspectCritic", False),
    # TODO: DiscreteMetric not yet supported
    # "DiscreteMetric": ("ragas.metrics.DiscreteMetric", False),
    "RubricsScore": ("ragas.metrics.RubricsScore", False),
    "InstanceRubrics": ("ragas.metrics.InstanceRubrics", False),
    # Other Tasks
    "SummarizationScore": ("ragas.metrics.SummarizationScore", False),
}


def get_metric_class(metric_name: str):
    """
    Get RAGAS metric class by name.

    Args:
        metric_name: Name of the metric (e.g., "Faithfulness", "ContextPrecision")

    Returns:
        The RAGAS metric class

    Raises:
        MlflowException: If the metric name is not recognized or ragas is not installed
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
        raise MlflowException.invalid_parameter_value(
            "RAGAS metrics require the 'ragas' package. Please install it with: pip install ragas"
        ) from e


def is_deterministic_metric(metric_name: str) -> bool:
    _, is_deterministic = _METRIC_REGISTRY[metric_name]

    return is_deterministic
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/genai/scorers/ragas/utils.py

```python
from __future__ import annotations

from typing import Any

from mlflow.entities.trace import Trace
from mlflow.genai.utils.trace_utils import (
    extract_retrieval_context_from_trace,
    parse_inputs_to_str,
    parse_outputs_to_str,
    resolve_expectations_from_trace,
    resolve_inputs_from_trace,
    resolve_outputs_from_trace,
)


def map_scorer_inputs_to_ragas_sample(
    inputs: Any = None,
    outputs: Any = None,
    expectations: dict[str, Any] | None = None,
    trace: Trace | None = None,
):
    """
    Convert MLflow scorer inputs to RAGAS SingleTurnSample format.

    Args:
        inputs: The input to evaluate
        outputs: The output to evaluate
        expectations: Expected values and context for evaluation
        trace: MLflow trace for evaluation

    Returns:
        RAGAS SingleTurnSample object
    """
    from ragas.dataset_schema import SingleTurnSample

    if trace:
        inputs = resolve_inputs_from_trace(inputs, trace)
        outputs = resolve_outputs_from_trace(outputs, trace)
        expectations = resolve_expectations_from_trace(expectations, trace)

    user_input = parse_inputs_to_str(inputs) if inputs is not None else None
    response = parse_outputs_to_str(outputs) if outputs is not None else None

    span_id_to_context = extract_retrieval_context_from_trace(trace) if trace else {}
    retrieved_contexts = [str(ctx) for contexts in span_id_to_context.values() for ctx in contexts]

    reference = None
    rubrics = None
    if expectations:
        # Extract rubrics if present (for InstanceRubrics metric)
        rubrics = expectations.get("rubrics")
        non_rubric_expectations = {
            key: value for key, value in expectations.items() if key != "rubrics"
        }
        if non_rubric_expectations:
            reference = ", ".join(str(value) for value in non_rubric_expectations.values())

    return SingleTurnSample(
        user_input=user_input,
        response=response,
        retrieved_contexts=retrieved_contexts or None,
        reference=reference,
        reference_contexts=retrieved_contexts or None,
        rubrics=rubrics,
    )


def create_mlflow_error_message_from_ragas_param(ragas_param: str, metric_name: str) -> str:
    """
    Create an mlflow error message for missing RAGAS parameters.

    Args:
        ragas_param: The RAGAS parameter name that is missing
        metric_name: The name of the RAGAS metric

    Returns:
        An mlflow error message for missing RAGAS parameters
    """
    ragas_to_mlflow_param_mapping = {
        "user_input": "inputs",
        "response": "outputs",
        "reference": "expectations['expected_output']",
        "retrieved_contexts": "trace with retrieval spans",
        "reference_contexts": "trace with retrieval spans",
        "rubrics": "expectations['rubrics']",
    }
    mlflow_param = ragas_to_mlflow_param_mapping.get(ragas_param, ragas_param)

    message_parts = [
        f"RAGAS metric '{metric_name}' requires '{mlflow_param}' parameter, which is missing."
    ]

    if ragas_param == "user_input":
        message_parts.append("Example: judge(inputs='What is MLflow?', outputs='...')")
    elif ragas_param == "response":
        message_parts.append("Example: judge(inputs='...', outputs='MLflow is a platform')")
    elif ragas_param == "reference":
        message_parts.append(
            "\nExample: judge(inputs='...', outputs='...', "
            "expectations={'expected_output': ...}) or log an expectation to the trace: "
            "mlflow.log_expectation(trace_id, name='expected_output', value=..., source=...)"
        )
    elif ragas_param in ["retrieved_contexts", "reference_contexts"]:
        message_parts.append(
            "\nMake sure your trace includes retrieval spans. "
            "Example: use @mlflow.trace(span_type=SpanType.RETRIEVER) decorator"
        )
    elif ragas_param == "rubrics":
        message_parts.append(
            "\nExample: judge(inputs='...', outputs='...', "
            "expectations={'rubrics': {'0': 'rubric for score 0', '1': 'rubric for score 1'}})"
        )

    return " ".join(message_parts)
```

--------------------------------------------------------------------------------

````
