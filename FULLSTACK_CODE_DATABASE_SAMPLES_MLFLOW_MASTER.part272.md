---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 272
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 272 of 991)

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

---[FILE: builtin.py]---
Location: mlflow-master/mlflow/genai/judges/builtin.py

```python
from functools import wraps
from typing import TYPE_CHECKING, Any

from mlflow.entities.assessment import Feedback
from mlflow.exceptions import MlflowException
from mlflow.genai.judges.constants import USE_CASE_BUILTIN_JUDGE
from mlflow.genai.judges.prompts.relevance_to_query import RELEVANCE_TO_QUERY_ASSESSMENT_NAME
from mlflow.genai.judges.utils import CategoricalRating, get_default_model, invoke_judge_model
from mlflow.utils.annotations import experimental
from mlflow.utils.docstring_utils import format_docstring

if TYPE_CHECKING:
    from mlflow.genai.utils.type import FunctionCall
    from mlflow.types.chat import ChatTool

_MODEL_API_DOC = {
    "model": """Judge model to use. Must be either `"databricks"` or a form of
`<provider>:/<model-name>`, such as `"openai:/gpt-4.1-mini"`,
`"anthropic:/claude-3.5-sonnet-20240620"`. MLflow natively supports
`["openai", "anthropic", "bedrock", "mistral"]`, and more providers are supported
through `LiteLLM <https://docs.litellm.ai/docs/providers>`_.
Default model depends on the tracking URI setup:

* Databricks: `databricks`
* Otherwise: `openai:/gpt-4.1-mini`.
""",
}


def _sanitize_feedback(feedback: Feedback) -> Feedback:
    """Sanitize the feedback object from the databricks judges.

    The judge returns a CategoricalRating class defined in the databricks-agents package.
    This function converts it to our CategoricalRating definition above.

    Args:
        feedback: The Feedback object to convert.

    Returns:
        A new Feedback object with our CategoricalRating.
    """
    feedback.value = CategoricalRating(feedback.value) if feedback.value else feedback.value
    return feedback


def requires_databricks_agents(func):
    """Decorator to check if the `databricks-agents` package is installed."""

    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            import databricks.agents.evals.judges  # noqa: F401

        except ImportError:
            raise ImportError(
                f"The `databricks-agents` package is required to use "
                f"`mlflow.genai.judges.{func.__name__}`. "
                "Please install it with `pip install databricks-agents`."
            )

        return func(*args, **kwargs)

    return wrapper


@format_docstring(_MODEL_API_DOC)
def is_context_relevant(
    *, request: str, context: Any, name: str | None = None, model: str | None = None
) -> Feedback:
    """
    LLM judge determines whether the given context is relevant to the input request.

    Args:
        request: Input to the application to evaluate, user's question or query.
        context: Context to evaluate the relevance to the request.
            Supports any JSON-serializable object.
        name: Optional name for overriding the default name of the returned feedback.
        model: {{ model }}

    Returns:
        A :py:class:`mlflow.entities.assessment.Feedback~` object with a "yes" or "no" value
        indicating whether the context is relevant to the request.

    Example:

        The following example shows how to evaluate whether a document retrieved by a
        retriever is relevant to the user's question.

        .. code-block:: python

            from mlflow.genai.judges import is_context_relevant

            feedback = is_context_relevant(
                request="What is the capital of France?",
                context="Paris is the capital of France.",
            )
            print(feedback.value)  # "yes"

            feedback = is_context_relevant(
                request="What is the capital of France?",
                context="Paris is known for its Eiffel Tower.",
            )
            print(feedback.value)  # "no"

    """
    from mlflow.genai.judges.prompts.relevance_to_query import get_prompt

    model = model or get_default_model()

    # NB: User-facing name for the is_context_relevant assessment. This is required
    #     since the existing databricks judge is called `relevance_to_query`
    assessment_name = name or RELEVANCE_TO_QUERY_ASSESSMENT_NAME

    if model == "databricks":
        from databricks.agents.evals.judges import relevance_to_query

        feedback = relevance_to_query(
            request=request,
            response=str(context),
            assessment_name=assessment_name,
        )
    else:
        prompt = get_prompt(request, str(context))
        feedback = invoke_judge_model(
            model, prompt, assessment_name=assessment_name, use_case=USE_CASE_BUILTIN_JUDGE
        )

    return _sanitize_feedback(feedback)


@format_docstring(_MODEL_API_DOC)
def is_context_sufficient(
    *,
    request: str,
    context: Any,
    expected_facts: list[str],
    expected_response: str | None = None,
    name: str | None = None,
    model: str | None = None,
) -> Feedback:
    """
    LLM judge determines whether the given context is sufficient to answer the input request.

    Args:
        request: Input to the application to evaluate, user's question or query.
        context: Context to evaluate the sufficiency of. Supports any JSON-serializable object.
        expected_facts: A list of expected facts that should be present in the context. Optional.
        expected_response: The expected response from the application. Optional.
        name: Optional name for overriding the default name of the returned feedback.
        model: {{ model }}

    Returns:
        A :py:class:`mlflow.entities.assessment.Feedback~` object with a "yes" or "no"
        value indicating whether the context is sufficient to answer the request.

    Example:

        The following example shows how to evaluate whether the documents returned by a
        retriever gives sufficient context to answer the user's question.

        .. code-block:: python

            from mlflow.genai.judges import is_context_sufficient

            feedback = is_context_sufficient(
                request="What is the capital of France?",
                context=[
                    {"content": "Paris is the capital of France."},
                    {"content": "Paris is known for its Eiffel Tower."},
                ],
                expected_facts=["Paris is the capital of France."],
            )
            print(feedback.value)  # "yes"

            feedback = is_context_sufficient(
                request="What is the capital of France?",
                context={"content": "France is a country in Europe."},
                expected_response="Paris is the capital of France.",
            )
            print(feedback.value)  # "no"
    """
    from mlflow.genai.judges.prompts.context_sufficiency import (
        CONTEXT_SUFFICIENCY_FEEDBACK_NAME,
        get_prompt,
    )

    model = model or get_default_model()
    assessment_name = name or CONTEXT_SUFFICIENCY_FEEDBACK_NAME

    if model == "databricks":
        from databricks.agents.evals.judges import context_sufficiency

        feedback = context_sufficiency(
            request=request,
            retrieved_context=context,
            expected_facts=expected_facts,
            expected_response=expected_response,
            assessment_name=assessment_name,
        )
    else:
        prompt = get_prompt(
            request=request,
            context=context,
            expected_response=expected_response,
            expected_facts=expected_facts,
        )
        feedback = invoke_judge_model(
            model, prompt, assessment_name=assessment_name, use_case=USE_CASE_BUILTIN_JUDGE
        )

    return _sanitize_feedback(feedback)


@format_docstring(_MODEL_API_DOC)
def is_correct(
    *,
    request: str,
    response: str,
    expected_facts: list[str] | None = None,
    expected_response: str | None = None,
    name: str | None = None,
    model: str | None = None,
) -> Feedback:
    """
    LLM judge determines whether the given response is correct for the input request.

    Args:
        request: Input to the application to evaluate, user's question or query.
        response: The response from the application to evaluate.
        expected_facts: A list of expected facts that should be present in the response. Optional.
        expected_response: The expected response from the application. Optional.
        name: Optional name for overriding the default name of the returned feedback.
        model: {{ model }}

    Returns:
        A :py:class:`mlflow.entities.assessment.Feedback~` object with a "yes" or "no"
        value indicating whether the response is correct for the request.

    Example:

        The following example shows how to evaluate whether the response is correct.

        .. code-block:: python

            from mlflow.genai.judges import is_correct

            feedback = is_correct(
                request="What is the capital of France?",
                response="Paris is the capital of France.",
                expected_response="Paris",
            )
            print(feedback.value)  # "yes"

            feedback = is_correct(
                request="What is the capital of France?",
                response="London is the capital of France.",
                expected_facts=["Paris is the capital of France"],
            )
            print(feedback.value)  # "no"
    """
    from mlflow.genai.judges.prompts.correctness import CORRECTNESS_FEEDBACK_NAME, get_prompt

    if expected_response is not None and expected_facts is not None:
        raise MlflowException(
            "Only one of expected_response or expected_facts should be provided, not both."
        )

    model = model or get_default_model()
    assessment_name = name or CORRECTNESS_FEEDBACK_NAME

    if model == "databricks":
        from databricks.agents.evals.judges import correctness

        feedback = correctness(
            request=request,
            response=response,
            expected_facts=expected_facts,
            expected_response=expected_response,
            assessment_name=assessment_name,
        )
    else:
        prompt = get_prompt(
            request=request,
            response=response,
            expected_response=expected_response,
            expected_facts=expected_facts,
        )
        feedback = invoke_judge_model(
            model, prompt, assessment_name=assessment_name, use_case=USE_CASE_BUILTIN_JUDGE
        )

    return _sanitize_feedback(feedback)


@format_docstring(_MODEL_API_DOC)
def is_grounded(
    *,
    request: str,
    response: str,
    context: Any,
    name: str | None = None,
    model: str | None = None,
) -> Feedback:
    """
    LLM judge determines whether the given response is grounded in the given context.

    Args:
        request: Input to the application to evaluate, user's question or query.
        response: The response from the application to evaluate.
        context: Context to evaluate the response against. Supports any JSON-serializable object.
        name: Optional name for overriding the default name of the returned feedback.
        model: {{ model }}

    Returns:
        A :py:class:`mlflow.entities.assessment.Feedback~` object with a "yes" or "no"
        value indicating whether the response is grounded in the context.

    Example:

        The following example shows how to evaluate whether the response is grounded in
        the context.

        .. code-block:: python

            from mlflow.genai.judges import is_grounded

            feedback = is_grounded(
                request="What is the capital of France?",
                response="Paris",
                context=[
                    {"content": "Paris is the capital of France."},
                    {"content": "Paris is known for its Eiffel Tower."},
                ],
            )
            print(feedback.value)  # "yes"

            feedback = is_grounded(
                request="What is the capital of France?",
                response="London is the capital of France.",
                context=[
                    {"content": "Paris is the capital of France."},
                    {"content": "Paris is known for its Eiffel Tower."},
                ],
            )
            print(feedback.value)  # "no"
    """
    from mlflow.genai.judges.prompts.groundedness import GROUNDEDNESS_FEEDBACK_NAME, get_prompt

    model = model or get_default_model()
    assessment_name = name or GROUNDEDNESS_FEEDBACK_NAME

    if model == "databricks":
        from databricks.agents.evals.judges import groundedness

        feedback = groundedness(
            request=request,
            response=response,
            retrieved_context=context,
            assessment_name=assessment_name,
        )
    else:
        prompt = get_prompt(
            request=request,
            response=response,
            context=context,
        )
        feedback = invoke_judge_model(
            model, prompt, assessment_name=assessment_name, use_case=USE_CASE_BUILTIN_JUDGE
        )

    return _sanitize_feedback(feedback)


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
def is_tool_call_efficient(
    *,
    request: str,
    tools_called: list["FunctionCall"],
    available_tools: list["ChatTool"],
    name: str | None = None,
    model: str | None = None,
) -> Feedback:
    """
    LLM judge determines whether the agent's tool usage is efficient and free of redundancy.

    This judge analyzes the agent's trajectory for redundancy,
    such as repeated tool calls with the same tool name and identical or very similar arguments.

    Args:
        request: The original user request that the agent is trying to fulfill.
        tools_called: The sequence of tools that were called by the agent.
            Each element should be a FunctionCall object.
        available_tools: The set of available tools that the agent could choose from.
            Each element should be a dictionary containing the tool name and description.
        name: Optional name for overriding the default name of the returned feedback.
        model: {{ model }}

    Returns:
        A :py:class:`mlflow.entities.assessment.Feedback~` object with a "yes" or "no" value
        indicating whether the tool usage is efficient ("yes") or contains redundancy ("no").

    Example:

        The following example shows how to evaluate whether an agent's tool calls are efficient.

        .. code-block:: python

            from mlflow.genai.judges import is_tool_call_efficient
            from mlflow.genai.utils.type import FunctionCall

            # Efficient tool usage
            feedback = is_tool_call_efficient(
                request="What is the capital of France and translate it to Spanish?",
                tools_called=[
                    FunctionCall(
                        name="search",
                        arguments={"query": "capital of France"},
                        outputs="Paris",
                    ),
                    FunctionCall(
                        name="translate",
                        arguments={"text": "Paris", "target": "es"},
                        outputs="París",
                    ),
                ],
                available_tools=["search", "translate", "calculate"],
            )
            print(feedback.value)  # "yes"

            # Redundant tool usage
            feedback = is_tool_call_efficient(
                request="What is the capital of France?",
                tools_called=[
                    FunctionCall(
                        name="search",
                        arguments={"query": "capital of France"},
                        outputs="Paris",
                    ),
                    FunctionCall(
                        name="search",
                        arguments={"query": "capital of France"},
                        outputs="Paris",
                    ),  # Redundant
                ],
                available_tools=["search", "translate", "calculate"],
            )
            print(feedback.value)  # "no"

            # Tool call with exception
            feedback = is_tool_call_efficient(
                request="Get weather for an invalid city",
                tools_called=[
                    FunctionCall(
                        name="get_weather",
                        arguments={"city": "InvalidCity123"},
                        exception="ValueError: City not found",
                    ),
                ],
                available_tools=["get_weather"],
            )
            print(feedback.value)  # Judge evaluates based on exception context

    """
    from mlflow.genai.judges.prompts.tool_call_efficiency import (
        TOOL_CALL_EFFICIENCY_FEEDBACK_NAME,
        get_prompt,
    )

    model = model or get_default_model()
    assessment_name = name or TOOL_CALL_EFFICIENCY_FEEDBACK_NAME

    prompt = get_prompt(request=request, tools_called=tools_called, available_tools=available_tools)
    feedback = invoke_judge_model(
        model, prompt, assessment_name=assessment_name, use_case=USE_CASE_BUILTIN_JUDGE
    )

    return _sanitize_feedback(feedback)


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
def is_tool_call_correct(
    *,
    request: str,
    tools_called: list["FunctionCall"],
    available_tools: list["ChatTool"],
    name: str | None = None,
    model: str | None = None,
) -> Feedback:
    """
    LLM judge determines whether the agent's tool calls and their arguments are correct
    and reasonable.

    This judge analyzes whether the tools selected and the arguments provided to them
    are appropriate for fulfilling the user's request.

    Args:
        request: The original user request that the agent is trying to fulfill.
        tools_called: The sequence of tools that were called by the agent.
            Each element should be a FunctionCall object.
        available_tools: The set of available tools that the agent could choose from.
            Each element should be a dictionary containing the tool name and description.
        name: Optional name for overriding the default name of the returned feedback.
        model: {{ model }}

    Returns:
        A :py:class:`mlflow.entities.assessment.Feedback~` object with a "yes" or "no" value
        indicating whether the tool calls and arguments are correct ("yes") or incorrect ("no").

    Example:

        The following example shows how to evaluate whether an agent's tool calls are correct.

        .. code-block:: python

            from mlflow.genai.judges import is_tool_call_correct
            from mlflow.genai.utils.type import FunctionCall

            # Correct tool usage
            feedback = is_tool_call_correct(
                request="What is the weather in San Francisco?",
                tools_called=[
                    FunctionCall(
                        name="get_weather",
                        arguments={"location": "San Francisco", "unit": "celsius"},
                        outputs="15°C, partly cloudy",
                    ),
                ],
                available_tools=["get_weather", "search", "calculate"],
            )
            print(feedback.value)  # "yes"

            # Incorrect tool usage
            feedback = is_tool_call_correct(
                request="What is the weather in San Francisco?",
                tools_called=[
                    FunctionCall(
                        name="calculate",
                        arguments={"expression": "San Francisco"},
                        outputs="Error: invalid expression",
                    ),  # Wrong tool for weather query
                ],
                available_tools=["get_weather", "search", "calculate"],
            )
            print(feedback.value)  # "no"

    """
    from mlflow.genai.judges.prompts.tool_call_correctness import (
        TOOL_CALL_CORRECTNESS_FEEDBACK_NAME,
        get_prompt,
    )

    model = model or get_default_model()
    assessment_name = name or TOOL_CALL_CORRECTNESS_FEEDBACK_NAME

    prompt = get_prompt(request=request, tools_called=tools_called, available_tools=available_tools)
    feedback = invoke_judge_model(
        model, prompt, assessment_name=assessment_name, use_case=USE_CASE_BUILTIN_JUDGE
    )

    return _sanitize_feedback(feedback)


@format_docstring(_MODEL_API_DOC)
def is_safe(*, content: str, name: str | None = None, model: str | None = None) -> Feedback:
    """
    LLM judge determines whether the given response is safe.

    Args:
        content: Text content to evaluate for safety.
        name: Optional name for overriding the default name of the returned feedback.
        model: {{ model }}

    Returns:
        A :py:class:`mlflow.entities.assessment.Feedback~` object with a "yes" or "no"
        value indicating whether the response is safe.

    Example:

        .. code-block:: python

            from mlflow.genai.judges import is_safe

            feedback = is_safe(content="I am a happy person.")
            print(feedback.value)  # "yes"
    """
    from mlflow.genai.judges.prompts.safety import SAFETY_ASSESSMENT_NAME, get_prompt

    model = model or get_default_model()
    assessment_name = name or SAFETY_ASSESSMENT_NAME

    if model == "databricks":
        from databricks.agents.evals.judges import safety

        feedback = safety(response=content, assessment_name=assessment_name)
    else:
        prompt = get_prompt(content=content)
        feedback = invoke_judge_model(
            model, prompt, assessment_name=assessment_name, use_case=USE_CASE_BUILTIN_JUDGE
        )

    return _sanitize_feedback(feedback)


@format_docstring(_MODEL_API_DOC)
def meets_guidelines(
    *,
    guidelines: str | list[str],
    context: dict[str, Any],
    name: str | None = None,
    model: str | None = None,
) -> Feedback:
    """
    LLM judge determines whether the given response meets the given guideline(s).

    Args:
        guidelines: A single guideline or a list of guidelines.
        context: Mapping of context to be evaluated against the guidelines. For example,
            pass {"response": "<response text>"} to evaluate whether the response meets
            the given guidelines.
        name: Optional name for overriding the default name of the returned feedback.
        model: {{ model }}

    Returns:
        A :py:class:`mlflow.entities.assessment.Feedback~` object with a "yes" or "no"
        value indicating whether the response meets the guideline(s).

    Example:

        The following example shows how to evaluate whether the response meets the given
        guideline(s).

        .. code-block:: python

            from mlflow.genai.judges import meets_guidelines

            feedback = meets_guidelines(
                guidelines="Be polite and respectful.",
                context={"response": "Hello, how are you?"},
            )
            print(feedback.value)  # "yes"

            feedback = meets_guidelines(
                guidelines=["Be polite and respectful.", "Must be in English."],
                context={"response": "Hola, ¿cómo estás?"},
            )
            print(feedback.value)  # "no"
    """
    from mlflow.genai.judges.prompts.guidelines import GUIDELINES_FEEDBACK_NAME, get_prompt

    model = model or get_default_model()

    if model == "databricks":
        from databricks.agents.evals.judges import guidelines as guidelines_judge

        feedback = guidelines_judge(
            guidelines=guidelines,
            context=context,
            assessment_name=name,
        )
    else:
        prompt = get_prompt(guidelines, context)
        feedback = invoke_judge_model(
            model,
            prompt,
            assessment_name=name or GUIDELINES_FEEDBACK_NAME,
            use_case=USE_CASE_BUILTIN_JUDGE,
        )

    return _sanitize_feedback(feedback)
```

--------------------------------------------------------------------------------

---[FILE: builtin_judges.py]---
Location: mlflow-master/mlflow/genai/judges/builtin_judges.py

```python
from mlflow.genai.judges.base import Judge
from mlflow.genai.scorers.builtin_scorers import BuiltInScorer
from mlflow.utils.annotations import experimental


@experimental(version="3.4.0")
class BuiltinJudge(BuiltInScorer, Judge):
    """
    Base class for built-in AI judge scorers that use LLMs for evaluation.
    """
```

--------------------------------------------------------------------------------

---[FILE: constants.py]---
Location: mlflow-master/mlflow/genai/judges/constants.py

```python
_DATABRICKS_DEFAULT_JUDGE_MODEL = "databricks"
_DATABRICKS_AGENTIC_JUDGE_MODEL = "gpt-oss-120b"

# Use case constants for chat completions
USE_CASE_BUILTIN_JUDGE = "builtin_judge"
USE_CASE_AGENTIC_JUDGE = "agentic_judge"
USE_CASE_CUSTOM_PROMPT_JUDGE = "custom_prompt_judge"
USE_CASE_JUDGE_ALIGNMENT = "judge_alignment"

# Common affirmative values that should map to YES
_AFFIRMATIVE_VALUES = frozenset(
    [
        "true",
        "pass",
        "passed",
        "correct",
        "success",
        "1",
        "1.0",
        "yes",
        "y",
        "yea",
        "yeah",
        "affirmative",
        "absolutely",
        "certainly",
        "indeed",
        "sure",
        "ok",
        "okay",
        "agree",
        "accepted",
        "right",
        "positive",
        "accurate",
        "valid",
        "validity",
        "confirmed",
        "approved",
        "complete",
        "completed",
        "good",
        "great",
        "excellent",
        "active",
        "enabled",
        "on",
        "present",
        "found",
        "match",
        "matched",
        "validated",
        "approve",
        "accept",
        "pos",
    ]
)

# Common negative values that should map to NO
_NEGATIVE_VALUES = frozenset(
    [
        "false",
        "fail",
        "failed",
        "incorrect",
        "failure",
        "0",
        "0.0",
        "no",
        "n",
        "nah",
        "nope",
        "negative",
        "reject",
        "rejected",
        "disagree",
        "not approved",
        "invalid",
        "inaccurate",
        "wrong",
        "declined",
        "denied",
        "incomplete",
        "bad",
        "poor",
        "inactive",
        "disabled",
        "off",
        "missing",
        "absent",
        "notfound",
        "mismatch",
        "mismatched",
        "none",
        "null",
        "nil",
        "deny",
        "disapprove",
        "disapproved",
        "neg",
    ]
)

_RESULT_FIELD_DESCRIPTION = "The evaluation rating/result"
_RATIONALE_FIELD_DESCRIPTION = "Detailed explanation for the evaluation"
```

--------------------------------------------------------------------------------

---[FILE: custom_prompt_judge.py]---
Location: mlflow-master/mlflow/genai/judges/custom_prompt_judge.py

```python
import re
from difflib import unified_diff
from typing import Callable

from mlflow.entities.assessment import Feedback
from mlflow.entities.assessment_source import AssessmentSource, AssessmentSourceType
from mlflow.genai.judges.builtin import _MODEL_API_DOC
from mlflow.genai.judges.constants import USE_CASE_CUSTOM_PROMPT_JUDGE
from mlflow.genai.judges.utils import (
    get_default_model,
    invoke_judge_model,
)
from mlflow.genai.prompts.utils import format_prompt
from mlflow.utils.annotations import deprecated
from mlflow.utils.docstring_utils import format_docstring

_CHOICE_PATTERN = re.compile(r"\[\[([\w ]+)\]\]")


@format_docstring(_MODEL_API_DOC)
@deprecated(since="3.4.0", alternative="mlflow.genai.make_judge")
def custom_prompt_judge(
    *,
    name: str,
    prompt_template: str,
    numeric_values: dict[str, float] | None = None,
    model: str | None = None,
) -> Callable[..., Feedback]:
    """
    Create a custom prompt judge that evaluates inputs using a template.

    Args:
        name: Name of the judge, used as the name of returned
            :py:class:`mlflow.entities.Feedback` object.
        prompt_template: Template string with {{var_name}} placeholders for variable substitution.
            Should be prompted with choices as outputs.
        numeric_values: Optional mapping from categorical values to numeric scores.
            Useful if you want to create a custom judge that returns continuous valued outputs.
            Defaults to None.
        model: {{ model }}

    Returns:
        A callable that takes keyword arguments mapping to the template variables
        and returns an mlflow :py:class:`mlflow.entities.Feedback`.

    Example prompt template:

    .. code-block::

        You will look at the response and determine the formality of the response.

        <request>{{request}}</request>
        <response>{{response}}</response>

        You must choose one of the following categories.

        [[formal]]: The response is very formal.
        [[semi_formal]]: The response is somewhat formal. The response is somewhat formal if the
        response mentions friendship, etc.
        [[not_formal]]: The response is not formal.

    Variable names in the template should be enclosed in double curly
    braces, e.g., `{{request}}`, `{{response}}`. They should be alphanumeric and can include
    underscores, but should not contain spaces or special characters.

    It is required for the prompt template to request choices as outputs, with each choice
    enclosed in square brackets. Choice names should be alphanumeric and can include
    underscores and spaces.
    """
    model = model or get_default_model()

    if model == "databricks":
        try:
            from databricks.agents.evals.judges import custom_prompt_judge as db_custom_prompt_judge

            return db_custom_prompt_judge(
                name=name,
                prompt_template=prompt_template,
                numeric_values=numeric_values,
            )
        except ImportError:
            raise ImportError(
                "The `databricks-agents` package is required to use "
                "`mlflow.genai.judges.custom_prompt_judge` with model='databricks'. "
                "Please install it with `pip install databricks-agents`."
            )

    # Extract choices from the prompt template
    choices = _CHOICE_PATTERN.findall(prompt_template)

    if not choices:
        raise ValueError(
            "Prompt template must include choices denoted with [[CHOICE_NAME]]. "
            "No choices found in the provided prompt template."
        )

    # Validate that choices match numeric_values keys if provided
    if numeric_values is not None:
        sorted_numeric_values = sorted(numeric_values.keys())
        sorted_choices = sorted(choices)
        if sorted_numeric_values != sorted_choices:
            diff = "\n".join(
                unified_diff(
                    sorted_numeric_values,
                    sorted_choices,
                    fromfile="numeric_values_keys",
                    tofile="choices",
                )
            )
            raise ValueError(
                f"numeric_values keys must match the choices included in the prompt template.\n"
                f"numeric_values keys: {sorted_numeric_values}\n"
                f"choices in prompt: {sorted_choices}\n"
                f"Diff:\n{diff}"
            )

        # Validate that numeric_values values are numeric if provided
        if not all(isinstance(value, (int, float)) for value in numeric_values.values()):
            raise ValueError("All values in numeric_values must be numeric (int or float).")

    source = AssessmentSource(
        source_type=AssessmentSourceType.LLM_JUDGE,
        source_id=f"custom_prompt_judge_{name}",
    )

    def judge(**kwargs) -> Feedback:
        try:
            # Render prompt template with the given kwargs
            prompt = format_prompt(prompt_template, **kwargs)
            prompt = _remove_choice_brackets(prompt)
            prompt = _add_structured_output_instructions(prompt)

            # Call the judge
            feedback = invoke_judge_model(
                model, prompt, name, use_case=USE_CASE_CUSTOM_PROMPT_JUDGE
            )
            feedback.source = source

            # Feedback value must be one of the choices
            if feedback.value not in choices:
                raise ValueError(f"'{feedback.value}' is not one of the choices: {choices}")

            # Map to numeric value if mapping is provided
            if numeric_values:
                feedback.metadata = {"string_value": feedback.value}
                feedback.value = numeric_values[feedback.value]
            return feedback

        except Exception as e:
            return Feedback(name=name, source=source, error=e)

    return judge


def _add_structured_output_instructions(prompt: str) -> str:
    """Add JSON format instructions to the user prompt."""
    suffix = """
Answer ONLY in JSON and NOT in markdown, following the format:

{
    "rationale": "Reason for the decision. Start each rationale with `Let's think step by step`.",
    "result": "The category chosen."
}
"""
    return f"{prompt.strip()}\n\n{suffix}"


def _remove_choice_brackets(text: str) -> str:
    """Remove double square brackets around choices."""
    return _CHOICE_PATTERN.sub(r"\1", text)
```

--------------------------------------------------------------------------------

````
