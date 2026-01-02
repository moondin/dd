---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 289
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 289 of 991)

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
Location: mlflow-master/mlflow/genai/scorers/ragas/__init__.py
Signals: Pydantic

```python
"""
RAGAS integration for MLflow.

This module provides integration with RAGAS metrics, allowing them to be used
with MLflow's judge interface.

Example usage:

.. code-block:: python

    from mlflow.genai.scorers.ragas import get_scorer

    judge = get_scorer("Faithfulness", model="openai:/gpt-4")
    feedback = judge(
        inputs="What is MLflow?", outputs="MLflow is a platform...", trace=trace
    )
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
from mlflow.genai.scorers.ragas.models import create_ragas_model
from mlflow.genai.scorers.ragas.registry import get_metric_class, is_deterministic_metric
from mlflow.genai.scorers.ragas.utils import (
    create_mlflow_error_message_from_ragas_param,
    map_scorer_inputs_to_ragas_sample,
)
from mlflow.utils.annotations import experimental
from mlflow.utils.docstring_utils import format_docstring

_logger = logging.getLogger(__name__)


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class RagasScorer(Scorer):
    """
    Initialize a RAGAS metric scorer.

    Args:
        metric_name: Name of the RAGAS metric (e.g., "Faithfulness")
        model: {{ model }}
        metric_kwargs: Additional metric-specific parameters
    """

    _metric: Any = PrivateAttr()
    _is_deterministic: bool = PrivateAttr(default=False)
    _model: str = PrivateAttr()

    def __init__(
        self,
        metric_name: str | None = None,
        model: str | None = None,
        **metric_kwargs,
    ):
        if metric_name is None:
            metric_name = self.metric_name

        super().__init__(name=metric_name)
        model = model or get_default_model()
        self._model = model
        metric_class = get_metric_class(metric_name)

        if is_deterministic_metric(metric_name):
            self._metric = metric_class(**metric_kwargs)
            self._is_deterministic = True
        else:
            ragas_llm = create_ragas_model(model)
            self._metric = metric_class(llm=ragas_llm, **metric_kwargs)

    def __call__(
        self,
        *,
        inputs: dict[str, Any] | None = None,
        outputs: Any = None,
        expectations: dict[str, Any] | None = None,
        trace: Trace | None = None,
    ) -> Feedback:
        """
        Evaluate using the wrapped RAGAS metric.

        Args:
            inputs: The input to evaluate
            outputs: The output to evaluate
            expectations: Expected values and context for evaluation
            trace: MLflow trace for evaluation

        Returns:
            Feedback object with score, rationale, and metadata
        """
        if self._is_deterministic:
            assessment_source = AssessmentSource(
                source_type=AssessmentSourceType.CODE,
                source_id=self.name,
            )
        else:
            assessment_source = AssessmentSource(
                source_type=AssessmentSourceType.LLM_JUDGE,
                source_id=self._model,
            )

        try:
            sample = map_scorer_inputs_to_ragas_sample(
                inputs=inputs,
                outputs=outputs,
                expectations=expectations,
                trace=trace,
            )

            if hasattr(self._metric, "single_turn_score"):
                result = self._metric.single_turn_score(sample)
            elif hasattr(self._metric, "score"):
                result = self._metric.score(sample)
            else:
                raise MlflowException(f"RAGAS metric {self.name} is currently not supported")

            score = float(result)

            reason = getattr(result, "reason", None)

            # RAGAS metrics may have thresholds to map to binary feedback
            threshold = getattr(self._metric, "threshold", None)
            metadata = {FRAMEWORK_METADATA_KEY: "ragas"}

            if threshold is not None:
                metadata["threshold"] = threshold
                metadata["score"] = score
                value = CategoricalRating.YES if score >= threshold else CategoricalRating.NO
            else:
                value = score

            return Feedback(
                name=self.name,
                value=value,
                rationale=reason,
                source=assessment_source,
                trace_id=None,
                metadata=metadata,
            )
        except (KeyError, IndexError) as e:
            # RAGAS raises KeyError/IndexError when required parameters are missing
            error_msg = str(e).strip("'\"")
            mlflow_error_message = create_mlflow_error_message_from_ragas_param(
                error_msg, self.name
            )
            _logger.error(
                f"Missing required parameter for RAGAS metric {self.name}: {mlflow_error_message}"
            )
            mlflow_error = MlflowException.invalid_parameter_value(mlflow_error_message)

            return Feedback(
                name=self.name,
                error=mlflow_error,
                source=assessment_source,
            )
        except Exception as e:
            _logger.error(f"Error evaluating RAGAS metric {self.name}: {e}")
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
    **metric_kwargs,
) -> RagasScorer:
    """
    Get a RAGAS metric as an MLflow judge.

    Args:
        metric_name: Name of the RAGAS metric (e.g., "Faithfulness")
        model: {{ model }}
        metric_kwargs: Additional metric-specific parameters (e.g., threshold)

    Returns:
        RagasScorer instance that can be called with MLflow's judge interface

    Examples:

    .. code-block:: python

        # LLM-based metric
        judge = get_scorer("Faithfulness", model="openai:/gpt-4")
        feedback = judge(inputs="What is MLflow?", outputs="MLflow is a platform...")

        # Using trace with retrieval context
        judge = get_scorer("ContextPrecision", model="openai:/gpt-4")
        feedback = judge(trace=trace)

        # Deterministic metric (no LLM needed)
        judge = get_scorer("ExactMatch")
        feedback = judge(outputs="Paris", expectations={"expected_output": "Paris"})
    """
    model = model or get_default_model()
    return RagasScorer(
        metric_name=metric_name,
        model=model,
        **metric_kwargs,
    )


from mlflow.genai.scorers.ragas.scorers import (
    AspectCritic,
    BleuScore,
    ChrfScore,
    ContextEntityRecall,
    ContextPrecision,
    ContextRecall,
    ExactMatch,
    FactualCorrectness,
    Faithfulness,
    InstanceRubrics,
    NoiseSensitivity,
    NonLLMContextPrecisionWithReference,
    NonLLMContextRecall,
    NonLLMStringSimilarity,
    RougeScore,
    RubricsScore,
    StringPresence,
    SummarizationScore,
)

__all__ = [
    # Core classes
    "RagasScorer",
    "get_scorer",
    # RAG metrics
    "ContextPrecision",
    "NonLLMContextPrecisionWithReference",
    "ContextRecall",
    "NonLLMContextRecall",
    "ContextEntityRecall",
    "NoiseSensitivity",
    "Faithfulness",
    # Comparison metrics
    "FactualCorrectness",
    "NonLLMStringSimilarity",
    "BleuScore",
    "ChrfScore",
    "RougeScore",
    "StringPresence",
    "ExactMatch",
    # General purpose metrics
    "AspectCritic",
    "RubricsScore",
    "InstanceRubrics",
    # Other tasks
    "SummarizationScore",
]
```

--------------------------------------------------------------------------------

---[FILE: comparison_metrics.py]---
Location: mlflow-master/mlflow/genai/scorers/ragas/scorers/comparison_metrics.py

```python
from __future__ import annotations

from typing import ClassVar

from mlflow.genai.judges.builtin import _MODEL_API_DOC
from mlflow.genai.scorers.ragas import RagasScorer
from mlflow.utils.annotations import experimental
from mlflow.utils.docstring_utils import format_docstring


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class FactualCorrectness(RagasScorer):
    """
    Evaluates the factual correctness of the output compared to a reference.

    This metric uses an LLM to determine if the output is factually correct when compared
    to a reference answer or ground truth.

    Args:
        model: {{ model }}
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import FactualCorrectness

            scorer = FactualCorrectness(model="openai:/gpt-4")
            feedback = scorer(
                outputs="Paris is the capital of France.",
                expectations={"expected_output": "Paris"},
            )
    """

    metric_name: ClassVar[str] = "FactualCorrectness"


@experimental(version="3.8.0")
class NonLLMStringSimilarity(RagasScorer):
    """
    Calculates string similarity without using an LLM.

    This is a deterministic metric that computes string similarity between the output
    and expected output.

    Args:
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import NonLLMStringSimilarity

            scorer = NonLLMStringSimilarity()
            feedback = scorer(
                outputs="Paris",
                expectations={"expected_output": "Paris"},
            )
    """

    metric_name: ClassVar[str] = "NonLLMStringSimilarity"

    def __init__(self, **metric_kwargs):
        self._validate_kwargs(**metric_kwargs)
        super().__init__(metric_name=self.metric_name, model=None, **metric_kwargs)


@experimental(version="3.8.0")
class BleuScore(RagasScorer):
    """
    Calculates BLEU score.

    Args:
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import BleuScore

            scorer = BleuScore()
            feedback = scorer(
                outputs="The cat sat on the mat",
                expectations={"expected_output": "A cat was sitting on the mat"},
            )
    """

    metric_name: ClassVar[str] = "BleuScore"

    def __init__(self, **metric_kwargs):
        self._validate_kwargs(**metric_kwargs)
        super().__init__(metric_name=self.metric_name, model=None, **metric_kwargs)


@experimental(version="3.8.0")
class ChrfScore(RagasScorer):
    """
    Calculates Chrf (Character F-score) score between the output and expected output.

    Args:
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import ChrfScore

            scorer = ChrfScore()
            feedback = scorer(
                outputs="Hello world",
                expectations={"expected_output": "Hello world!"},
            )
    """

    metric_name: ClassVar[str] = "ChrfScore"

    def __init__(self, **metric_kwargs):
        self._validate_kwargs(**metric_kwargs)
        super().__init__(metric_name=self.metric_name, model=None, **metric_kwargs)


@experimental(version="3.8.0")
class RougeScore(RagasScorer):
    """
    Calculates ROUGE score between the output and expected output.

    Args:
        **metric_kwargs: Additional metric-specific parameters (e.g., rouge_type)

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import RougeScore

            scorer = RougeScore()
            feedback = scorer(
                outputs="Short summary of the text",
                expectations={"expected_output": "Summary of the text"},
            )
    """

    metric_name: ClassVar[str] = "RougeScore"

    def __init__(self, **metric_kwargs):
        self._validate_kwargs(**metric_kwargs)
        super().__init__(metric_name=self.metric_name, model=None, **metric_kwargs)


@experimental(version="3.8.0")
class StringPresence(RagasScorer):
    """
    Checks if the expected output is present in the output.

    Args:
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import StringPresence

            scorer = StringPresence()
            feedback = scorer(
                outputs="The capital of France is Paris",
                expectations={"expected_output": "Paris"},
            )
    """

    metric_name: ClassVar[str] = "StringPresence"

    def __init__(self, **metric_kwargs):
        self._validate_kwargs(**metric_kwargs)
        super().__init__(metric_name=self.metric_name, model=None, **metric_kwargs)


@experimental(version="3.8.0")
class ExactMatch(RagasScorer):
    """
    Performs exact string matching between the output and expected output.

    Args:
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import ExactMatch

            scorer = ExactMatch()
            feedback = scorer(
                outputs="Paris",
                expectations={"expected_output": "Paris"},
            )
    """

    metric_name: ClassVar[str] = "ExactMatch"

    def __init__(self, **metric_kwargs):
        self._validate_kwargs(**metric_kwargs)
        super().__init__(metric_name=self.metric_name, model=None, **metric_kwargs)
```

--------------------------------------------------------------------------------

---[FILE: rag_metrics.py]---
Location: mlflow-master/mlflow/genai/scorers/ragas/scorers/rag_metrics.py

```python
from __future__ import annotations

from typing import ClassVar

from mlflow.genai.judges.builtin import _MODEL_API_DOC
from mlflow.genai.scorers.ragas import RagasScorer
from mlflow.utils.annotations import experimental
from mlflow.utils.docstring_utils import format_docstring


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class ContextPrecision(RagasScorer):
    """
    Evaluates whether relevant nodes in the retrieval context are ranked higher than
    irrelevant ones.

    Args:
        model: {{ model }}
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import ContextPrecision

            scorer = ContextPrecision(model="openai:/gpt-4")
            feedback = scorer(trace=trace)
    """

    metric_name: ClassVar[str] = "ContextPrecision"


@experimental(version="3.8.0")
class NonLLMContextPrecisionWithReference(RagasScorer):
    """
    Deterministic metric that evaluates context precision using non-LLM methods using expectations.

    Args:
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import NonLLMContextPrecisionWithReference

            scorer = NonLLMContextPrecisionWithReference()
            feedback = scorer(trace=trace)
    """

    metric_name: ClassVar[str] = "NonLLMContextPrecisionWithReference"

    def __init__(self, **metric_kwargs):
        self._validate_kwargs(**metric_kwargs)
        super().__init__(metric_name=self.metric_name, model=None, **metric_kwargs)


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class ContextRecall(RagasScorer):
    """
    Evaluates whether the retrieval context contains all necessary information.

    Args:
        model: {{ model }}
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import ContextRecall

            scorer = ContextRecall(model="openai:/gpt-4")
            feedback = scorer(trace=trace)
    """

    metric_name: ClassVar[str] = "ContextRecall"


@experimental(version="3.8.0")
class NonLLMContextRecall(RagasScorer):
    """
    Deterministic metric that evaluates context recall without using an LLM.

    Args:
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import NonLLMContextRecall

            scorer = NonLLMContextRecall()
            feedback = scorer(trace=trace)
    """

    metric_name: ClassVar[str] = "NonLLMContextRecall"

    def __init__(self, **metric_kwargs):
        self._validate_kwargs(**metric_kwargs)
        super().__init__(metric_name=self.metric_name, model=None, **metric_kwargs)


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class ContextEntityRecall(RagasScorer):
    """
    Evaluates entity recall in the retrieval context.

    Args:
        model: {{ model }}
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import ContextEntityRecall

            scorer = ContextEntityRecall(model="openai:/gpt-4")
            feedback = scorer(trace=trace)
    """

    metric_name: ClassVar[str] = "ContextEntityRecall"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class NoiseSensitivity(RagasScorer):
    """
    Evaluates how sensitive the model is to noise in the retrieval context.

    Args:
        model: {{ model }}
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import NoiseSensitivity

            scorer = NoiseSensitivity(model="openai:/gpt-4")
            feedback = scorer(trace=trace)
    """

    metric_name: ClassVar[str] = "NoiseSensitivity"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class Faithfulness(RagasScorer):
    """
    Evaluates whether the output is factually consistent with the retrieval context.

    Args:
        model: {{ model }}
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import Faithfulness

            scorer = Faithfulness(model="openai:/gpt-4")
            feedback = scorer(trace=trace)
    """

    metric_name: ClassVar[str] = "Faithfulness"
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/scorers/ragas/scorers/__init__.py

```python
from __future__ import annotations

from typing import ClassVar

from mlflow.genai.judges.builtin import _MODEL_API_DOC
from mlflow.genai.scorers.ragas import RagasScorer
from mlflow.genai.scorers.ragas.scorers.comparison_metrics import (
    BleuScore,
    ChrfScore,
    ExactMatch,
    FactualCorrectness,
    NonLLMStringSimilarity,
    RougeScore,
    StringPresence,
)
from mlflow.genai.scorers.ragas.scorers.rag_metrics import (
    ContextEntityRecall,
    ContextPrecision,
    ContextRecall,
    Faithfulness,
    NoiseSensitivity,
    NonLLMContextPrecisionWithReference,
    NonLLMContextRecall,
)
from mlflow.utils.annotations import experimental
from mlflow.utils.docstring_utils import format_docstring


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class AspectCritic(RagasScorer):
    """
    Evaluates the output based on specific aspects or criteria.

    Args:
        model: {{ model }}
        **metric_kwargs: Additional metric-specific parameters (e.g., name, definition)

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import AspectCritic

            scorer = AspectCritic(
                model="openai:/gpt-4",
                name="helpfulness",
                definition="Does the response help answer the question?",
            )
            feedback = scorer(inputs="What is MLflow?", outputs="MLflow is a platform...")
    """

    metric_name: ClassVar[str] = "AspectCritic"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class RubricsScore(RagasScorer):
    """
    Evaluates the output based on a predefined rubric.

    This metric uses a rubric (set of criteria with descriptions and scores) to evaluate
    the output in a structured way.

    Args:
        model: {{ model }}
        **metric_kwargs: Additional metric-specific parameters (e.g., rubrics)

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import RubricsScore

            rubrics = {
                "1": "The response is entirely incorrect.",
                "2": "The response contains partial accuracy.",
                "3": "The response is mostly accurate but lacks clarity.",
                "4": "The response is accurate and clear with minor omissions.",
                "5": "The response is completely accurate and clear.",
            }
            scorer = RubricsScore(rubrics=rubrics)
            feedback = scorer(inputs="What is AI?", outputs="AI is artificial intelligence")
    """

    metric_name: ClassVar[str] = "RubricsScore"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class InstanceRubrics(RagasScorer):
    """
    Evaluates the output based on instance-specific rubrics.

    Unlike RubricsScore which uses one rubric for all evaluations, InstanceRubrics allows
    you to define different rubrics for each evaluation instance.

    Args:
        model: {{ model }}
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import InstanceRubrics

            scorer = InstanceRubrics(model="openai:/gpt-4")

            # Evaluate relevance with custom rubric
            feedback1 = scorer(
                inputs="How do I handle exceptions in Python?",
                outputs="To handle exceptions in Python, use try and except blocks.",
                expectations={
                    "expected_output": "Use try, except, and optionally else blocks.",
                    "rubrics": {
                        "0": "The response is off-topic or irrelevant.",
                        "1": "The response is fully relevant and focused.",
                    },
                },
            )

            # Evaluate code efficiency with different rubric
            feedback2 = scorer(
                inputs="Create a list of squares for numbers 1 through 5",
                outputs="squares = []\\nfor i in range(1, 6):\\n    squares.append(i**2)",
                expectations={
                    "expected_output": "squares = [i**2 for i in range(1, 6)]",
                    "rubrics": {
                        "0": "Inefficient code with performance issues.",
                        "1": "Efficient and optimized code.",
                    },
                },
            )
    """

    metric_name: ClassVar[str] = "InstanceRubrics"


@experimental(version="3.8.0")
@format_docstring(_MODEL_API_DOC)
class SummarizationScore(RagasScorer):
    """
    Evaluates the quality and accuracy of text summarization.

    This metric assesses whether the summary captures the key points of the source text
    while being concise and coherent.

    Args:
        model: {{ model }}
        **metric_kwargs: Additional metric-specific parameters

    Examples:
        .. code-block:: python

            from mlflow.genai.scorers.ragas import SummarizationScore

            scorer = SummarizationScore(model="openai:/gpt-4")
            feedback = scorer(trace=trace)
    """

    metric_name: ClassVar[str] = "SummarizationScore"


__all__ = [
    # RAG metrics
    "ContextPrecision",
    "NonLLMContextPrecisionWithReference",
    "ContextRecall",
    "NonLLMContextRecall",
    "ContextEntityRecall",
    "NoiseSensitivity",
    "Faithfulness",
    # Comparison metrics
    "FactualCorrectness",
    "NonLLMStringSimilarity",
    "BleuScore",
    "ChrfScore",
    "RougeScore",
    "StringPresence",
    "ExactMatch",
    # General purpose metrics
    "AspectCritic",
    "RubricsScore",
    "InstanceRubrics",
    # Other tasks
    "SummarizationScore",
]
```

--------------------------------------------------------------------------------

---[FILE: data_validation.py]---
Location: mlflow-master/mlflow/genai/utils/data_validation.py

```python
import inspect
import logging
from typing import Any, Callable

from mlflow.exceptions import MlflowException
from mlflow.tracing.provider import trace_disabled

_logger = logging.getLogger(__name__)


def check_model_prediction(predict_fn: Callable[..., Any], sample_input: Any):
    """
    Validate if the predict function executes properly with the provided input.

    Args:
        predict_fn: The predict function to be evaluated.
        sample_input: A sample input to the model.
    """
    _logger.info(
        "Testing model prediction with the first sample in the dataset. To disable this check, "
        "set the MLFLOW_GENAI_EVAL_SKIP_TRACE_VALIDATION environment variable to True."
    )

    # Wrap the function to add a decorator for disabling tracing
    @trace_disabled
    def _check():
        predict_fn(**sample_input)

    try:
        _check()
    except Exception as e:
        # Check input format and raise friendly message for typical error patterns
        _validate_function_and_input_compatibility(predict_fn, sample_input, e)
        _logger.debug(f"Failed to run predict_fn with input: {sample_input}", exc_info=True)


def _validate_function_and_input_compatibility(
    predict_fn: Callable[..., Any], sample_input: dict[str, Any], e: Exception
) -> Callable[..., Any]:
    """
    Validate the data format in the input column against the predict_fn.

    The input column must contain a dictionary of field names and values. When the
    predict_fn is provided, the field names must match the arguments of the predict_fn.
    """
    params = inspect.signature(predict_fn).parameters
    if not params:
        raise MlflowException.invalid_parameter_value(
            "`predict_fn` must accept at least one argument."
        ) from e

    # Check for *args-style parameters which aren't supported
    _validate_no_var_args(params, e)

    # Check if input keys match function parameters
    _validate_input_keys_match_function_params(params, sample_input.keys(), e)

    # For other errors, show a generic error message
    raise MlflowException.invalid_parameter_value(
        "Failed to run the prediction function specified in the `predict_fn` "
        f"parameter. Input: {sample_input}. Error: {e}\n\n"
    ) from e


def _has_variable_positional_arguments(params: inspect.Signature) -> bool:
    """Check if the function has variable positional arguments."""
    return any(p.kind == inspect.Parameter.VAR_POSITIONAL for p in params.values())


def _validate_no_var_args(params: inspect.Signature, e: Exception):
    if not any(p.kind == inspect.Parameter.VAR_POSITIONAL for p in params.values()):
        return

    """Raise an error for functions using *args which aren't supported."""
    code_sample = """```python
def predict_fn(param1, param2):
    # Invoke the original predict function with positional arguments
    return fn(param1, param2)

data = [
    {
        "inputs": {
            "param1": "value1",
            "param2": "value2",
        }
    }
]

mlflow.genai.evaluate(predict_fn=predict_fn, data=data, ...)
```
"""

    raise MlflowException.invalid_parameter_value(
        "The `predict_fn` has dynamic positional arguments (e.g. `*args`), "
        "so it cannot be used as a `predict_fn`. Please wrap it into another "
        "function that accepts explicit keyword arguments.\n"
        f"Example:\n\n{code_sample}\n"
    ) from e


def _validate_input_keys_match_function_params(
    params: inspect.Signature,
    input_keys: list[str],
    e: Exception,
):
    if _has_required_keyword_arguments(params, input_keys):
        return

    """Raise an error when input keys don't match function parameters."""
    param_names = list(params.keys())
    input_example = {arg: f"value{i + 1}" for i, arg in enumerate(param_names[:3])}

    if len(param_names) > 3:
        input_example["..."] = "..."

    code_sample = "\n".join(
        [
            "```python",
            "data = [",
            "    {",
            '        "inputs": {',
            *(f'            "{k}": "{v}",' for k, v in input_example.items()),
            "        }",
            "    }",
            "]",
            "```",
        ]
    )

    raise MlflowException.invalid_parameter_value(
        "The `inputs` column must be a dictionary with the parameter names of "
        f"the `predict_fn` as keys. It seems the specified keys do not match "
        f"with the `predict_fn`'s arguments. Correct example:\n\n{code_sample}"
    ) from e


def _has_required_keyword_arguments(params: inspect.Signature, required_args: list[str]) -> bool:
    """Check if the function accepts the specified keyword arguments."""
    func_args = []

    for name, param in params.items():
        # If the function has **kwargs, it accepts all keyword arguments
        if param.kind == inspect.Parameter.VAR_KEYWORD:
            return True

        func_args.append(name)

    # Required argument must be a subset of the function's arguments
    return set(required_args) <= set(func_args)
```

--------------------------------------------------------------------------------

---[FILE: display_utils.py]---
Location: mlflow-master/mlflow/genai/utils/display_utils.py

```python
import sys

from mlflow.entities import Run
from mlflow.store.tracking.rest_store import RestStore
from mlflow.tracing.display.display_handler import _is_jupyter
from mlflow.tracking._tracking_service.utils import _get_store, get_tracking_uri
from mlflow.utils.mlflow_tags import MLFLOW_DATABRICKS_WORKSPACE_URL
from mlflow.utils.uri import is_databricks_uri

_EVAL_OUTPUT_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Evaluation output</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: Arial, sans-serif;
        }}

        .header {{
            a.button {{
                padding: 4px 8px;
                line-height: 20px;
                box-shadow: none;
                height: 20px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                vertical-align: middle;
                background-color: rgb(34, 114, 180);
                color: rgb(255, 255, 255);
                text-decoration: none;
                animation-duration: 0s;
                transition: none 0s ease 0s;
                position: relative;
                white-space: nowrap;
                text-align: center;
                border: 1px solid rgb(192, 205, 216);
                cursor: pointer;
                user-select: none;
                touch-action: manipulation;
                border-radius: 4px;
                gap: 6px;
            }}

            a.button:hover {{
                background-color: rgb(14, 83, 139) !important;
                border-color: transparent !important;
                color: rgb(255, 255, 255) !important;
            }}
        }}

        .warnings-section {{
            margin-top: 8px;

            ul {{
                list-style-type: none;
            }}
        }}

        .instructions-section {{
            margin-top: 16px;
            font-size: 14px;

            ul {{
                margin-top: 0;
                margin-bottom: 0;
            }}
        }}

        code {{
            font-family: monospace;
        }}

        .note {{
            color: #666;
        }}

        a {{
            color: #2272B4;
            text-decoration: none;
        }}

        a:hover {{
            color: #005580;
        }}
    </style>
</head>
<body>
<div>
    <div class="header">
        <a href="{eval_results_url}" class="button">
            View evaluation results in MLflow
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16" aria-hidden="true" focusable="false" class="">
                <path fill="currentColor" d="M10 1h5v5h-1.5V3.56L8.53 8.53 7.47 7.47l4.97-4.97H10z"></path>
                <path fill="currentColor" d="M1 2.75A.75.75 0 0 1 1.75 2H8v1.5H2.5v10h10V8H14v6.25a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75z"></path>
            </svg>
        </a>
    </div>
</div>
</body>
</html>
"""  # noqa: E501

_NON_IPYTHON_OUTPUT_TEXT = """
✨ Evaluation completed.

Metrics and evaluation results are logged to the MLflow run:
  Run name: \033[94m{run_name}\033[0m
  Run ID: \033[94m{run_id}\033[0m
"""


def display_evaluation_output(run_id: str):
    """
    Displays summary of the evaluation result, errors and warnings if any,
    and instructions on what to do after running `mlflow.evaluate`.
    """
    store = _get_store()
    run = store.get_run(run_id)

    if not isinstance(store, RestStore):
        # Cannot determine the host URL if the server is not remote.
        # Print a general guidance instead.
        sys.stdout.write(_NON_IPYTHON_OUTPUT_TEXT.format(run_name=run.info.run_name, run_id=run_id))
        sys.stdout.write("""
To view the detailed evaluation results with sample-wise scores,
open the \033[93m\033[1mTraces\033[0m tab in the Run page in the MLflow UI.\n\n""")
        return

    uri = _resolve_evaluation_results_url(store, run)
    if _is_jupyter():
        from IPython.display import HTML, display

        display(HTML(_EVAL_OUTPUT_HTML.format(eval_results_url=uri)))
    else:
        sys.stdout.write(_NON_IPYTHON_OUTPUT_TEXT.format(run_name=run.info.run_name, run_id=run_id))
        sys.stdout.write(f"View the evaluation results at \033[93m{uri}\033[0m\n\n")


def _resolve_evaluation_results_url(store: RestStore, run: Run) -> str:
    experiment_id = run.info.experiment_id

    if is_databricks_uri(get_tracking_uri()):
        workspace_url = run.data.tags.get(MLFLOW_DATABRICKS_WORKSPACE_URL)
        if not workspace_url:
            workspace_url = store.get_host_creds().host.rstrip("/")
        url_base = f"{workspace_url}/ml"
    else:
        host_url = store.get_host_creds().host.rstrip("/")
        url_base = f"{host_url}/#"
    return (
        f"{url_base}/experiments/{experiment_id}/evaluation-runs?selectedRunUuid={run.info.run_id}"
    )
```

--------------------------------------------------------------------------------

---[FILE: enum_utils.py]---
Location: mlflow-master/mlflow/genai/utils/enum_utils.py

```python
from enum import Enum, EnumMeta


class MetaEnum(EnumMeta):
    """Metaclass for Enum classes that allows to check if a value is a valid member of the Enum."""

    def __contains__(cls, item):
        try:
            cls(item)
        except ValueError:
            return False
        return True


class StrEnum(str, Enum, metaclass=MetaEnum):
    def __str__(self):
        """Return the string representation of the enum using its value."""
        return self.value

    @classmethod
    def values(cls) -> list[str]:
        """Return a list of all string values of the Enum."""
        return [str(member) for member in cls]
```

--------------------------------------------------------------------------------

````
