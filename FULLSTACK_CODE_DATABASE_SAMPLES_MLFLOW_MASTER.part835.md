---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 835
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 835 of 991)

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

---[FILE: test_registry.py]---
Location: mlflow-master/tests/genai/scorers/deepeval/test_registry.py

```python
import pytest

from mlflow.exceptions import MlflowException
from mlflow.genai.scorers.deepeval.registry import get_metric_class


def test_get_metric_class_returns_valid_class():
    metric_class = get_metric_class("AnswerRelevancy")
    assert metric_class.__name__ == "AnswerRelevancyMetric"


def test_get_metric_class_raises_error_for_invalid_name():
    with pytest.raises(MlflowException, match="Unknown metric: 'InvalidMetric'"):
        get_metric_class("InvalidMetric")
```

--------------------------------------------------------------------------------

---[FILE: test_utils.py]---
Location: mlflow-master/tests/genai/scorers/deepeval/test_utils.py

```python
from unittest.mock import Mock

import pytest

from mlflow.entities.span import Span, SpanAttributeKey, SpanType
from mlflow.exceptions import MlflowException
from mlflow.genai.scorers.deepeval.models import create_deepeval_model
from mlflow.genai.scorers.deepeval.utils import (
    _convert_to_deepeval_tool_calls,
    _extract_tool_calls_from_trace,
    map_scorer_inputs_to_deepeval_test_case,
)


def test_create_deepeval_model_databricks():
    model = create_deepeval_model("databricks")
    assert model.__class__.__name__ == "DatabricksDeepEvalLLM"
    assert model.get_model_name() == "databricks"


def test_create_deepeval_model_databricks_serving_endpoint():
    model = create_deepeval_model("databricks:/my-endpoint")
    assert model.__class__.__name__ == "DatabricksServingEndpointDeepEvalLLM"
    assert model.get_model_name() == "databricks:/my-endpoint"


def test_create_deepeval_model_openai():
    model = create_deepeval_model("openai:/gpt-4")
    assert model.__class__.__name__ == "LiteLLMModel"
    # DeepEval strips the provider prefix, so we only check for the model name
    assert "gpt-4" in model.get_model_name()


def test_create_deepeval_model_with_provider_no_slash():
    model = create_deepeval_model("openai:gpt-4")
    assert model.__class__.__name__ == "LiteLLMModel"
    # DeepEval strips the provider prefix, so we only check for the model name
    assert "gpt-4" in model.get_model_name()


def test_create_deepeval_model_rejects_model_name_only():
    with pytest.raises(MlflowException, match="Invalid model_uri format"):
        create_deepeval_model("gpt-4")


def test_convert_to_deepeval_tool_calls():
    tool_call_dicts = [
        {
            "name": "search",
            "description": "Search the web",
            "reasoning": "Need to find information",
            "output": "Search results",
            "input_parameters": {"query": "MLflow"},
        },
        {
            "name": "calculator",
            "output": "42",
            "input_parameters": {"expression": "6*7"},
        },
    ]

    tool_calls = _convert_to_deepeval_tool_calls(tool_call_dicts)

    assert len(tool_calls) == 2
    assert tool_calls[0].name == "search"
    assert tool_calls[0].description == "Search the web"
    assert tool_calls[0].output == "Search results"
    assert tool_calls[0].input_parameters == {"query": "MLflow"}
    assert tool_calls[1].name == "calculator"


def test_extract_tool_calls_from_trace():
    span1 = Mock(spec=Span)
    span1.name = "search_tool"
    span1.attributes = {
        SpanAttributeKey.INPUTS: {"query": "test"},
        SpanAttributeKey.OUTPUTS: {"results": ["result1", "result2"]},
    }

    trace = Mock()
    trace.search_spans.return_value = [span1]

    tool_calls = _extract_tool_calls_from_trace(trace)

    assert len(tool_calls) == 1
    assert tool_calls[0].name == "search_tool"
    assert tool_calls[0].input_parameters == {"query": "test"}
    assert tool_calls[0].output == {"results": ["result1", "result2"]}
    trace.search_spans.assert_called_once_with(span_type=SpanType.TOOL)


def test_extract_tool_calls_from_trace_returns_none_when_no_tools():
    trace = Mock()
    trace.search_spans.return_value = []
    assert _extract_tool_calls_from_trace(trace) is None


def test_map_mlflow_to_test_case_basic():
    test_case = map_scorer_inputs_to_deepeval_test_case(
        metric_name="AnswerRelevancy",
        inputs="What is MLflow?",
        outputs="MLflow is a platform",
    )

    assert test_case.input == "What is MLflow?"
    assert test_case.actual_output == "MLflow is a platform"
    assert test_case.expected_output is None
    assert test_case.retrieval_context == []


def test_map_mlflow_to_test_case_with_expectations():
    expectations = {
        "expected_output": "MLflow is an open source platform",
        "other_key": "other_value",
    }

    test_case = map_scorer_inputs_to_deepeval_test_case(
        metric_name="AnswerRelevancy",
        inputs="What is MLflow?",
        outputs="MLflow is a platform",
        expectations=expectations,
    )

    assert test_case.expected_output == "MLflow is an open source platform"
    assert "expected_output: MLflow is an open source platform" in test_case.context


def test_map_mlflow_to_test_case_with_expected_tool_calls():
    expectations = {
        "expected_tool_calls": [
            {"name": "search", "input_parameters": {"query": "test"}},
        ]
    }

    test_case = map_scorer_inputs_to_deepeval_test_case(
        metric_name="ToolCorrectness",
        inputs="Search for test",
        outputs="Found results",
        expectations=expectations,
    )

    assert test_case.expected_tools is not None
    assert len(test_case.expected_tools) == 1
    assert test_case.expected_tools[0].name == "search"
```

--------------------------------------------------------------------------------

---[FILE: test_models.py]---
Location: mlflow-master/tests/genai/scorers/ragas/test_models.py

```python
from unittest.mock import Mock, patch

import pytest

from mlflow.exceptions import MlflowException
from mlflow.genai.scorers.ragas.models import DatabricksRagasLLM, create_ragas_model


@pytest.fixture
def mock_call_chat_completions():
    with patch("mlflow.genai.scorers.ragas.models.call_chat_completions") as mock:
        result = Mock()
        result.output = "Test output"
        mock.return_value = result
        yield mock


def test_databricks_ragas_llm_generate_text(mock_call_chat_completions):
    llm = DatabricksRagasLLM()
    result = llm.generate_text(prompt="Test prompt")

    assert result == "Test output"
    mock_call_chat_completions.assert_called_once_with(
        user_prompt="Test prompt",
        system_prompt="",
    )


def test_create_ragas_model_databricks():
    model = create_ragas_model("databricks")
    assert model.__class__.__name__ == "DatabricksRagasLLM"


def test_create_ragas_model_databricks_serving_endpoint():
    model = create_ragas_model("databricks:/my-endpoint")
    assert model.__class__.__name__ == "DatabricksServingEndpointRagasLLM"


def test_create_ragas_model_openai():
    model = create_ragas_model("openai:/gpt-4")
    assert model.__class__.__name__ == "LiteLLMStructuredLLM"


def test_create_ragas_model_with_provider_no_slash():
    model = create_ragas_model("openai:gpt-4")
    assert model.__class__.__name__ == "LiteLLMStructuredLLM"


def test_create_ragas_model_rejects_model_name_only():
    with pytest.raises(MlflowException, match="Invalid model_uri format"):
        create_ragas_model("gpt-4")
```

--------------------------------------------------------------------------------

---[FILE: test_ragas_scorer.py]---
Location: mlflow-master/tests/genai/scorers/ragas/test_ragas_scorer.py

```python
from unittest.mock import patch

import pytest

from mlflow.entities.assessment import Feedback
from mlflow.entities.assessment_source import AssessmentSourceType
from mlflow.exceptions import MlflowException
from mlflow.genai.judges.utils import CategoricalRating
from mlflow.genai.scorers import FRAMEWORK_METADATA_KEY
from mlflow.genai.scorers.ragas import (
    AspectCritic,
    ContextEntityRecall,
    ContextPrecision,
    ContextRecall,
    ExactMatch,
    FactualCorrectness,
    Faithfulness,
    InstanceRubrics,
    NoiseSensitivity,
    RagasScorer,
    RougeScore,
    RubricsScore,
    StringPresence,
    SummarizationScore,
    get_scorer,
)


def test_ragas_scorer_with_exact_match_metric():
    judge = get_scorer("ExactMatch")
    result = judge(
        inputs="What is MLflow?",
        outputs="MLflow is a platform",
        expectations={"expected_output": "MLflow is a platform"},
    )

    assert isinstance(result, Feedback)
    assert result.name == "ExactMatch"
    assert result.value == 1.0
    assert result.source.source_type == AssessmentSourceType.CODE
    assert result.source.source_id == "ExactMatch"
    assert result.metadata[FRAMEWORK_METADATA_KEY] == "ragas"


def test_ragas_scorer_handles_failure_with_exact_match():
    judge = get_scorer("ExactMatch")
    result = judge(
        inputs="What is MLflow?",
        outputs="MLflow is different",
        expectations={"expected_output": "MLflow is a platform"},
    )

    assert result.value == 0.0


def test_deterministic_metric_does_not_require_model():
    judge = get_scorer("ExactMatch")
    result = judge(
        outputs="test",
        expectations={"expected_output": "test"},
    )

    assert result.value == 1.0


def test_ragas_scorer_with_threshold_returns_categorical():
    judge = get_scorer("ExactMatch")
    judge._metric.threshold = 0.5
    with patch.object(judge._metric, "single_turn_score", return_value=0.8):
        result = judge(
            inputs="What is MLflow?",
            outputs="MLflow is a platform",
            expectations={"expected_output": "MLflow is a platform"},
        )

        assert result.value == CategoricalRating.YES
        assert result.metadata["score"] == 0.8
        assert result.metadata["threshold"] == 0.5


def test_ragas_scorer_with_threshold_returns_no_when_below():
    judge = get_scorer("ExactMatch")
    judge._metric.threshold = 0.5
    with patch.object(judge._metric, "single_turn_score", return_value=0.0):
        result = judge(
            inputs="What is MLflow?",
            outputs="Databricks is a company",
            expectations={"expected_output": "MLflow is a platform"},
        )

        assert result.value == CategoricalRating.NO
        assert result.metadata["score"] == 0.0
        assert result.metadata["threshold"] == 0.5


def test_ragas_scorer_without_threshold_returns_float():
    judge = get_scorer("ExactMatch")
    result = judge(
        outputs="test",
        expectations={"expected_output": "test"},
    )
    assert isinstance(result.value, float)
    assert result.value == 1.0
    assert "threshold" not in result.metadata


def test_ragas_scorer_returns_error_feedback_on_exception():
    judge = get_scorer("ExactMatch")

    with patch.object(judge._metric, "single_turn_score", side_effect=RuntimeError("Test error")):
        result = judge(inputs="What is MLflow?", outputs="Test output")

    assert isinstance(result, Feedback)
    assert result.name == "ExactMatch"
    assert result.value is None
    assert result.error is not None
    assert result.error.error_code == "RuntimeError"
    assert result.error.error_message == "Test error"
    assert result.source.source_type == AssessmentSourceType.CODE


def test_unknown_metric_raises_error():
    with pytest.raises(MlflowException, match="Unknown metric: 'NonExistentMetric'"):
        get_scorer("NonExistentMetric")


def test_missing_reference_parameter_returns_mlflow_error():
    judge = get_scorer("ContextPrecision")
    result = judge(inputs="What is MLflow?")
    assert isinstance(result, Feedback)
    assert result.error is not None
    assert "ContextPrecision" in result.error.error_message  # metric name
    assert "trace with retrieval spans" in result.error.error_message  # mlflow error message


@pytest.mark.parametrize(
    ("scorer_class", "expected_metric_name", "metric_kwargs"),
    [
        # RAG Metrics
        (ContextPrecision, "ContextPrecision", {}),
        (ContextRecall, "ContextRecall", {}),
        (ContextEntityRecall, "ContextEntityRecall", {}),
        (NoiseSensitivity, "NoiseSensitivity", {}),
        (Faithfulness, "Faithfulness", {}),
        # Comparison Metrics
        (FactualCorrectness, "FactualCorrectness", {}),
        (RougeScore, "RougeScore", {}),
        (StringPresence, "StringPresence", {}),
        (ExactMatch, "ExactMatch", {}),
        # General Purpose Metrics
        (AspectCritic, "AspectCritic", {"name": "test", "definition": "test"}),
        (RubricsScore, "RubricsScore", {}),
        (InstanceRubrics, "InstanceRubrics", {}),
        # Summarization Metrics
        (SummarizationScore, "SummarizationScore", {}),
    ],
)
def test_namespaced_class_properly_instantiates(scorer_class, expected_metric_name, metric_kwargs):
    assert issubclass(scorer_class, RagasScorer)
    assert scorer_class.metric_name == expected_metric_name
    scorer = scorer_class(**metric_kwargs)
    assert isinstance(scorer, RagasScorer)
    assert scorer.name == expected_metric_name
```

--------------------------------------------------------------------------------

---[FILE: test_registry.py]---
Location: mlflow-master/tests/genai/scorers/ragas/test_registry.py

```python
import pytest

from mlflow.exceptions import MlflowException
from mlflow.genai.scorers.ragas.registry import (
    get_metric_class,
    is_deterministic_metric,
)


def test_get_metric_class_returns_valid_class():
    metric_class = get_metric_class("Faithfulness")
    assert metric_class.__name__ == "Faithfulness"


def test_get_metric_class_raises_error_for_invalid_name():
    with pytest.raises(MlflowException, match="Unknown metric: 'InvalidMetric'"):
        get_metric_class("InvalidMetric")


@pytest.mark.parametrize(
    ("metric_name", "expected"),
    [
        ("ExactMatch", True),
        ("BleuScore", True),
        ("RougeScore", True),
        ("NonLLMStringSimilarity", True),
        ("StringPresence", True),
        ("ChrfScore", True),
        ("Faithfulness", False),
        ("ContextPrecision", False),
    ],
)
def test_is_deterministic_metric(metric_name, expected):
    assert is_deterministic_metric(metric_name) is expected
```

--------------------------------------------------------------------------------

---[FILE: test_utils.py]---
Location: mlflow-master/tests/genai/scorers/ragas/test_utils.py

```python
import pytest
from langchain_core.documents import Document

import mlflow
from mlflow.entities.span import SpanType
from mlflow.genai.scorers.ragas.utils import (
    create_mlflow_error_message_from_ragas_param,
    map_scorer_inputs_to_ragas_sample,
)


def test_map_scorer_inputs_to_ragas_sample_basic():
    sample = map_scorer_inputs_to_ragas_sample(
        inputs="What is MLflow?",
        outputs="MLflow is a platform",
    )

    assert sample.user_input == "What is MLflow?"
    assert sample.response == "MLflow is a platform"
    assert sample.reference is None
    assert sample.retrieved_contexts is None


def test_map_scorer_inputs_to_ragas_sample_with_expectations():
    expectations = {
        "expected_output": "MLflow is an open source platform",
    }

    sample = map_scorer_inputs_to_ragas_sample(
        inputs="What is MLflow?",
        outputs="MLflow is a platform",
        expectations=expectations,
    )

    assert sample.reference == "MLflow is an open source platform"


def test_map_scorer_inputs_to_ragas_sample_with_trace():
    @mlflow.trace(span_type=SpanType.RETRIEVER)
    def retrieve_docs():
        return [
            Document(page_content="Document 1", metadata={}),
            Document(page_content="Document 2", metadata={}),
        ]

    retrieve_docs()
    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())

    sample = map_scorer_inputs_to_ragas_sample(
        inputs="What is MLflow?",
        outputs="MLflow is a platform",
        trace=trace,
    )

    assert sample.retrieved_contexts is not None
    assert len(sample.retrieved_contexts) == 2
    assert "Document 1" in str(sample.retrieved_contexts)
    assert "Document 2" in str(sample.retrieved_contexts)


def test_map_scorer_inputs_with_rubrics():
    rubrics_dict = {
        "0": "Poor response",
        "1": "Good response",
    }
    expectations = {
        "rubrics": rubrics_dict,
        "expected_output": "MLflow is a platform",
    }

    sample = map_scorer_inputs_to_ragas_sample(
        inputs="What is MLflow?",
        outputs="MLflow is a platform",
        expectations=expectations,
    )

    assert sample.rubrics == rubrics_dict
    assert sample.reference == "MLflow is a platform"
    assert sample.user_input == "What is MLflow?"
    assert sample.response == "MLflow is a platform"


def test_map_scorer_inputs_with_only_rubrics():
    rubrics_dict = {
        "0": "Incorrect answer",
        "1": "Correct answer",
    }
    expectations = {"rubrics": rubrics_dict}

    sample = map_scorer_inputs_to_ragas_sample(
        inputs="What is MLflow?",
        outputs="MLflow is a platform",
        expectations=expectations,
    )

    assert sample.rubrics == rubrics_dict
    assert sample.reference is None


@pytest.mark.parametrize(
    ("ragas_param", "expected_mlflow_param", "expected_guidance"),
    [
        ("user_input", "inputs", "judge(inputs='What is MLflow?'"),
        (
            "response",
            "outputs",
            "judge(inputs='...', outputs='MLflow is a platform'",
        ),
        (
            "reference",
            "expectations['expected_output']",
            "expectations={'expected_output':",
        ),
        (
            "retrieved_contexts",
            "trace with retrieval spans",
            "retrieval spans",
        ),
        (
            "reference_contexts",
            "trace with retrieval spans",
            "retrieval spans",
        ),
        (
            "rubrics",
            "expectations['rubrics']",
            "expectations={'rubrics':",
        ),
    ],
)
def test_create_mlflow_error_message_from_ragas_param(
    ragas_param, expected_mlflow_param, expected_guidance
):
    metric_name = "TestMetric"
    error_message = create_mlflow_error_message_from_ragas_param(ragas_param, metric_name)

    assert metric_name in error_message
    assert expected_mlflow_param in error_message
    assert expected_guidance in error_message
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/tests/genai/scorers/ragas/__init__.py

```python

```

--------------------------------------------------------------------------------

---[FILE: test_data_validation.py]---
Location: mlflow-master/tests/genai/utils/test_data_validation.py

```python
import pytest

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.genai.utils.data_validation import check_model_prediction

from tests.tracing.helper import get_traces


def _extract_code_example(e: MlflowException) -> str:
    """Extract the code example from the exception message."""
    return e.message.split("```python")[1].split("```")[0]


@pytest.mark.parametrize(
    ("predict_fn", "sample_input"),
    [
        # Single argument
        (lambda question: None, {"question": "What is the capital of France?"}),
        # Multiple arguments
        (
            lambda question, context: None,
            {
                "question": "What is the capital of France?",
                "context": "France is a country in Europe.",
            },
        ),
        # Unnamed keyword arguments
        (lambda **kwargs: None, {"question": "What is the capital of France?"}),
        # Mix of named and unnamed keyword arguments
        (
            lambda question, **kwargs: None,
            {
                "question": "What is the capital of France?",
                "context": "France is a country in Europe.",
            },
        ),
        # Non-string value
        (
            lambda messages: None,
            {
                "messages": [
                    {"role": "user", "content": "What is the capital of France?"},
                    {"role": "assistant", "content": "Paris"},
                ],
            },
        ),
    ],
)
def test_check_model_prediction(predict_fn, sample_input):
    check_model_prediction(predict_fn, sample_input)

    # No trace should be logged during the check
    assert len(get_traces()) == 0

    traced_predict_fn = mlflow.trace(predict_fn)
    check_model_prediction(traced_predict_fn, sample_input)

    # A trace should be logged during the check
    assert len(get_traces()) == 0

    # Running the traced function normally should pass and generate a trace
    traced_predict_fn(**sample_input)
    assert len(get_traces()) == 1


def test_check_model_prediction_class_methods():
    class MyClass:
        def predict(self, question: str, context: str):
            return "response"

        @classmethod
        def predict_cls(cls, question: str, context: str):
            return "response"

        @staticmethod
        def predict_static(question: str, context: str):
            return "response"

    sample_input = {
        "question": "What is the capital of France?",
        "context": "France is a country in Europe.",
    }

    check_model_prediction(MyClass().predict, sample_input)
    check_model_prediction(MyClass.predict_cls, sample_input)
    check_model_prediction(MyClass.predict_static, sample_input)

    assert len(get_traces()) == 0

    # Validate traced version
    check_model_prediction(mlflow.trace(MyClass().predict), sample_input)
    check_model_prediction(mlflow.trace(MyClass.predict_cls), sample_input)
    check_model_prediction(mlflow.trace(MyClass.predict_static), sample_input)

    assert len(get_traces()) == 0


def test_check_model_prediction_no_args():
    def fn():
        return "response"

    with pytest.raises(MlflowException, match=r"`predict_fn` must accept at least one argument."):
        check_model_prediction(fn, {"question": "What is the capital of France?"})


def test_check_model_prediction_variable_args():
    """
    If the function has variable positional arguments (*args), it is not supported.
    """

    def fn(*args):
        return "response"

    with pytest.raises(MlflowException, match=r"The `predict_fn` has dynamic") as e:
        check_model_prediction(fn, {"question": "What is the capital of France?"})

    expected_code_example = """
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
"""
    assert _extract_code_example(e.value) == expected_code_example


def test_check_model_prediction_unmatched_keys():
    def fn(role: str, content: str):
        return "response"

    sample_input = {"messages": [{"role": "user", "content": "What is the capital of France?"}]}

    with pytest.raises(
        MlflowException, match=r"The `inputs` column must be a dictionary with"
    ) as e:
        check_model_prediction(fn, sample_input)

    code_example = """
data = [
    {
        "inputs": {
            "role": "value1",
            "content": "value2",
        }
    }
]
"""
    assert _extract_code_example(e.value) == code_example


def test_check_model_prediction_unmatched_keys_with_many_args():
    def fn(param1, param2, param3, param4, param5):
        return "response"

    sample_input = {"question": "What is the capital of France?"}

    with pytest.raises(MlflowException, match=r"The `inputs` column must be a dictionary") as e:
        check_model_prediction(fn, sample_input)

    # The code snippet shouldn't show more than three parameters
    code_example = """
data = [
    {
        "inputs": {
            "param1": "value1",
            "param2": "value2",
            "param3": "value3",
            "...": "...",
        }
    }
]
"""
    assert _extract_code_example(e.value) == code_example


def test_check_model_prediction_unmatched_keys_with_variable_kwargs():
    def fn(question: str, **kwargs):
        return "response"

    sample_input = {"query": "What is the capital of France?"}
    with pytest.raises(MlflowException, match=r"Failed to run the prediction function"):
        check_model_prediction(fn, sample_input)


def test_check_model_prediction_unknown_error():
    def fn(question: str):
        raise ValueError("Unknown error")

    sample_input = {"question": "What is the capital of France?"}
    with pytest.raises(MlflowException, match=r"Failed to run the prediction function"):
        check_model_prediction(fn, sample_input)
```

--------------------------------------------------------------------------------

---[FILE: test_display_utils.py]---
Location: mlflow-master/tests/genai/utils/test_display_utils.py

```python
from unittest import mock

import mlflow
from mlflow.genai.utils import display_utils
from mlflow.store.tracking.rest_store import RestStore
from mlflow.tracking.client import MlflowClient
from mlflow.utils.mlflow_tags import MLFLOW_DATABRICKS_WORKSPACE_URL


def test_display_outputs_jupyter(monkeypatch):
    mock_store = mock.MagicMock(spec=RestStore)
    mock_store.get_run = MlflowClient().get_run
    mock_store.get_host_creds = lambda: mock.MagicMock(host="https://mlflow.example.com/")

    with (
        mock.patch("IPython.display.display") as mock_display,
        mock.patch.object(display_utils, "_get_store", return_value=mock_store),
        mock.patch.object(display_utils, "_is_jupyter", return_value=True),
        mlflow.start_run() as run,
    ):
        display_utils.display_evaluation_output(run.info.run_id)

    exp_id = run.info.experiment_id
    expected_url = f"https://mlflow.example.com/#/experiments/{exp_id}/evaluation-runs?selectedRunUuid={run.info.run_id}"
    html_content = mock_display.call_args[0][0].data
    assert expected_url in html_content


def test_display_outputs_non_ipython(capsys):
    mock_store = mock.MagicMock(spec=RestStore)
    mock_store.get_run = mlflow.tracking.MlflowClient().get_run
    mock_store.get_host_creds = lambda: mock.MagicMock(host="https://mlflow.example.com/")

    with (
        mock.patch.object(display_utils, "_get_store", return_value=mock_store),
        mock.patch.object(display_utils, "_is_jupyter", return_value=False),
        mlflow.start_run() as run,
    ):
        display_utils.display_evaluation_output(run.info.run_id)

    captured = capsys.readouterr().out
    exp_id = run.info.experiment_id
    expected_url = f"https://mlflow.example.com/#/experiments/{exp_id}/evaluation-runs?selectedRunUuid={run.info.run_id}"
    assert expected_url in captured


def test_display_outputs_databricks(monkeypatch):
    host = "https://workspace.databricks.com"
    client = mlflow.tracking.MlflowClient()

    mock_store = mock.MagicMock(spec=RestStore)
    mock_store.get_run = client.get_run
    mock_store.get_host_creds = lambda: mock.MagicMock(host=host)

    with mlflow.start_run() as run:
        client.set_tag(run.info.run_id, MLFLOW_DATABRICKS_WORKSPACE_URL, host)

        with (
            mock.patch("IPython.display.display") as mock_display,
            mock.patch.object(display_utils, "_get_store", return_value=mock_store),
            mock.patch.object(display_utils, "_is_jupyter", return_value=True),
            mock.patch.object(display_utils, "is_databricks_uri", return_value=True),
        ):
            display_utils.display_evaluation_output(run.info.run_id)

    exp_id = run.info.experiment_id
    expected_url = (
        f"{host}/ml/experiments/{exp_id}/evaluation-runs?selectedRunUuid={run.info.run_id}"
    )
    html_content = mock_display.call_args[0][0].data
    assert expected_url in html_content


def test_display_summary_with_local_store(capsys):
    with mlflow.start_run() as run:
        display_utils.display_evaluation_output(run.info.run_id)

    captured = capsys.readouterr().out
    assert run.info.run_id in captured
    assert "Traces" in captured
```

--------------------------------------------------------------------------------

---[FILE: test_prompt_cache.py]---
Location: mlflow-master/tests/genai/utils/test_prompt_cache.py

```python
import threading
import time

import pytest

from mlflow.prompt.registry_utils import PromptCache, PromptCacheKey


@pytest.fixture(autouse=True)
def reset_cache():
    """Reset the prompt cache before and after each test."""
    PromptCache._reset_instance()
    yield
    PromptCache._reset_instance()


def test_singleton_pattern():
    cache1 = PromptCache.get_instance()
    cache2 = PromptCache.get_instance()
    assert cache1 is cache2


def test_set_and_get():
    cache = PromptCache.get_instance()
    key = PromptCacheKey.from_parts("test-prompt", version=1)
    cache.set(key, {"template": "Hello {{name}}"})
    assert cache.get(key) == {"template": "Hello {{name}}"}


def test_get_nonexistent():
    cache = PromptCache.get_instance()
    key = PromptCacheKey.from_parts("nonexistent", version=1)
    assert cache.get(key) is None


def test_ttl_expiration():
    cache = PromptCache.get_instance()
    key = PromptCacheKey.from_parts("test-prompt", version=1)
    cache.set(key, "value", ttl_seconds=0.01)
    time.sleep(0.02)
    assert cache.get(key) is None


def test_delete_prompt():
    cache = PromptCache.get_instance()
    key1 = PromptCacheKey.from_parts("my-prompt", version=1)
    key2 = PromptCacheKey.from_parts("my-prompt", version=2)
    key3 = PromptCacheKey.from_parts("other-prompt", version=1)

    cache.set(key1, "value1")
    cache.set(key2, "value2")
    cache.set(key3, "value3")

    # Delete only version 1 of my-prompt
    cache.delete("my-prompt", version=1)

    assert cache.get(key1) is None
    assert cache.get(key2) == "value2"  # version 2 still cached
    assert cache.get(key3) == "value3"


def test_delete_prompt_by_alias():
    cache = PromptCache.get_instance()
    key1 = PromptCacheKey.from_parts("my-prompt", alias="production")
    key2 = PromptCacheKey.from_parts("my-prompt", alias="staging")

    cache.set(key1, "value1")
    cache.set(key2, "value2")

    # Delete only the production alias
    cache.delete("my-prompt", alias="production")

    assert cache.get(key1) is None
    assert cache.get(key2) == "value2"  # staging still cached


def test_clear():
    cache = PromptCache.get_instance()
    key1 = PromptCacheKey.from_parts("prompt1", version=1)
    key2 = PromptCacheKey.from_parts("prompt2", version=1)

    cache.set(key1, "value1")
    cache.set(key2, "value2")
    cache.clear()

    assert cache.get(key1) is None
    assert cache.get(key2) is None


def test_generate_cache_key_with_version():
    key = PromptCacheKey.from_parts("my-prompt", version=1)
    assert key.name == "my-prompt"
    assert key.version == 1
    assert key.alias is None


def test_generate_cache_key_with_alias():
    key = PromptCacheKey.from_parts("my-prompt", alias="production")
    assert key.name == "my-prompt"
    assert key.version is None
    assert key.alias == "production"


def test_generate_cache_key_with_neither():
    key = PromptCacheKey.from_parts("my-prompt")
    assert key.name == "my-prompt"
    assert key.version is None
    assert key.alias is None


def test_generate_cache_key_with_both_raises_error():
    with pytest.raises(ValueError, match="Cannot specify both version and alias"):
        PromptCacheKey.from_parts("my-prompt", version=1, alias="production")


def test_generate_cache_key_version_zero():
    key = PromptCacheKey.from_parts("my-prompt", version=0)
    assert key.name == "my-prompt"
    assert key.version == 0
    assert key.alias is None


def test_concurrent_get_instance():
    instances = []
    errors = []

    def get_instance():
        try:
            instance = PromptCache.get_instance()
            instances.append(instance)
        except Exception as e:
            errors.append(e)

    threads = [threading.Thread(target=get_instance) for _ in range(10)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    assert len(errors) == 0
    assert all(inst is instances[0] for inst in instances)


def test_concurrent_operations():
    cache = PromptCache.get_instance()
    errors = []

    def writer(thread_id):
        try:
            for i in range(50):
                key = PromptCacheKey.from_parts(f"prompt-{thread_id}-{i}", version=1)
                cache.set(key, f"value-{thread_id}-{i}")
        except Exception as e:
            errors.append(e)

    def reader(thread_id):
        try:
            for i in range(50):
                key = PromptCacheKey.from_parts(f"prompt-{thread_id}-{i}", version=1)
                cache.get(key)
        except Exception as e:
            errors.append(e)

    threads = []
    for i in range(5):
        threads.append(threading.Thread(target=writer, args=(i,)))
        threads.append(threading.Thread(target=reader, args=(i,)))

    for t in threads:
        t.start()
    for t in threads:
        t.join()

    assert len(errors) == 0


def test_set_uses_default_ttl():
    cache = PromptCache.get_instance()
    key = PromptCacheKey.from_parts("test", version=1)
    cache.set(key, "value")
    assert cache.get(key) == "value"
```

--------------------------------------------------------------------------------

````
