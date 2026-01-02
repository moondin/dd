---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 834
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 834 of 991)

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

---[FILE: test_serialization.py]---
Location: mlflow-master/tests/genai/scorers/test_serialization.py

```python
import json
from unittest.mock import patch

import pytest

from mlflow.entities import Feedback
from mlflow.exceptions import MlflowException
from mlflow.genai.scorers import Scorer, scorer
from mlflow.genai.scorers.builtin_scorers import Guidelines


@pytest.fixture(autouse=True)
def mock_databricks_runtime():
    with patch("mlflow.genai.scorers.base.is_in_databricks_runtime", return_value=True):
        yield


# ============================================================================
# FORMAT VALIDATION TESTS (Minimal - just check serialization structure)
# ============================================================================


def test_decorator_scorer_serialization_format():
    @scorer(name="test_scorer", aggregations=["mean"])
    def test_scorer(outputs):
        return outputs == "correct"

    serialized = test_scorer.model_dump()

    # Check required fields for decorator scorers
    assert serialized["name"] == "test_scorer"
    assert serialized["aggregations"] == ["mean"]
    assert "call_source" in serialized
    assert "original_func_name" in serialized
    assert serialized["original_func_name"] == "test_scorer"
    assert "call_signature" in serialized

    # Check version metadata
    assert "mlflow_version" in serialized
    assert "serialization_version" in serialized
    assert serialized["serialization_version"] == 1

    # Builtin scorer fields should be None (not populated for decorator scorers)
    assert serialized["builtin_scorer_class"] is None
    assert serialized["builtin_scorer_pydantic_data"] is None


def test_builtin_scorer_serialization_format():
    from mlflow.genai.scorers.builtin_scorers import RelevanceToQuery

    serialized = RelevanceToQuery().model_dump()

    # Check required top-level fields for builtin scorers
    assert serialized["name"] == "relevance_to_query"
    assert "builtin_scorer_class" in serialized
    assert serialized["builtin_scorer_class"] == "RelevanceToQuery"
    assert "builtin_scorer_pydantic_data" in serialized

    # Check fields within builtin_scorer_pydantic_data
    pydantic_data = serialized["builtin_scorer_pydantic_data"]
    assert "required_columns" in pydantic_data

    # Check version metadata
    assert "mlflow_version" in serialized
    assert "serialization_version" in serialized
    assert serialized["serialization_version"] == 1

    # Decorator scorer fields should be None (not populated for builtin scorers)
    assert serialized["call_source"] is None
    assert serialized["call_signature"] is None
    assert serialized["original_func_name"] is None


# ============================================================================
# ROUND-TRIP FUNCTIONALITY TESTS (Comprehensive - test complete cycles)
# ============================================================================


def test_simple_scorer_round_trip():
    @scorer
    def simple_scorer(outputs):
        return outputs == "correct"

    # Test original functionality
    assert simple_scorer(outputs="correct") is True
    assert simple_scorer(outputs="wrong") is False

    # Serialize and deserialize
    serialized = simple_scorer.model_dump()
    deserialized = Scorer.model_validate(serialized)

    # Test deserialized functionality matches original
    assert deserialized.name == "simple_scorer"
    assert deserialized(outputs="correct") is True
    assert deserialized(outputs="wrong") is False


def test_custom_name_and_aggregations_round_trip():
    @scorer(name="length_check", aggregations=["mean", "max"])
    def my_scorer(inputs, outputs):
        return len(outputs) > len(inputs)

    # Test original
    assert my_scorer(inputs="hi", outputs="hello world") is True
    assert my_scorer(inputs="hello", outputs="hi") is False

    # Round-trip
    serialized = my_scorer.model_dump()
    deserialized = Scorer.model_validate(serialized)

    # Test preserved properties and functionality
    assert deserialized.name == "length_check"
    assert deserialized.aggregations == ["mean", "max"]
    assert deserialized(inputs="hi", outputs="hello world") is True
    assert deserialized(inputs="hello", outputs="hi") is False


def test_multiple_parameters_round_trip():
    @scorer
    def multi_param_scorer(inputs, outputs, expectations):
        return outputs.startswith(inputs) and len(outputs) > expectations.get("min_length", 0)

    # Test original
    test_args = {
        "inputs": "Hello",
        "outputs": "Hello world!",
        "expectations": {"min_length": 5},
    }
    assert multi_param_scorer(**test_args) is True

    # Round-trip
    serialized = multi_param_scorer.model_dump()
    deserialized = Scorer.model_validate(serialized)

    # Test functionality preserved
    assert deserialized(**test_args) is True
    assert (
        deserialized(inputs="Hi", outputs="Hello world!", expectations={"min_length": 5}) is False
    )


def test_complex_logic_round_trip():
    @scorer
    def complex_scorer(outputs):
        if not outputs:
            return 0

        words = outputs.split()
        score = 0
        for word in words:
            if word.isupper():
                score += 2
            elif word.islower():
                score += 1

        return score

    # Test original functionality
    test_cases = [
        ("", 0),
        ("hello world", 2),  # 2 lowercase words
        ("HELLO WORLD", 4),  # 2 uppercase words
        ("Hello WORLD", 2),  # mixed case "Hello" (0) + "WORLD" (2)
    ]

    for test_input, expected in test_cases:
        assert complex_scorer(outputs=test_input) == expected

    # Round-trip
    serialized = complex_scorer.model_dump()
    deserialized = Scorer.model_validate(serialized)

    # Test all cases still work
    for test_input, expected in test_cases:
        assert deserialized(outputs=test_input) == expected


def test_imports_and_feedback_round_trip():
    @scorer
    def feedback_scorer(outputs):
        import re  # clint: disable=lazy-builtin-import

        pattern = r"\b\w+\b"
        words = re.findall(pattern, outputs)
        return Feedback(value=len(words), rationale=f"Found {len(words)} words")

    # Test original
    result = feedback_scorer(outputs="hello world test")
    assert isinstance(result, Feedback)
    assert result.value == 3
    assert "Found 3 words" in result.rationale

    # Round-trip
    serialized = feedback_scorer.model_dump()
    deserialized = Scorer.model_validate(serialized)

    # Test functionality preserved
    result = deserialized(outputs="hello world test")
    assert isinstance(result, Feedback)
    assert result.value == 3
    assert "Found 3 words" in result.rationale


def test_default_parameters_round_trip():
    @scorer
    def default_scorer(outputs, threshold=5):
        return len(outputs) > threshold

    # Test original with and without default
    assert default_scorer(outputs="short") is False  # len=5, not > 5
    assert default_scorer(outputs="longer") is True  # len=6, > 5
    assert default_scorer(outputs="hi", threshold=1) is True  # len=2, > 1

    # Round-trip
    serialized = default_scorer.model_dump()
    deserialized = Scorer.model_validate(serialized)

    # Test defaults work
    assert deserialized(outputs="short") is False
    assert deserialized(outputs="longer") is True


def test_json_workflow_round_trip():
    @scorer(name="json_test", aggregations=["mean"])
    def json_scorer(outputs):
        return len(outputs.split()) > 3

    # Test original
    assert json_scorer(outputs="one two three four") is True
    assert json_scorer(outputs="one two") is False

    # JSON round-trip
    serialized = json_scorer.model_dump()
    json_str = json.dumps(serialized)
    loaded_dict = json.loads(json_str)
    deserialized = Scorer.model_validate(loaded_dict)

    # Test functionality preserved through JSON
    assert deserialized.name == "json_test"
    assert deserialized.aggregations == ["mean"]
    assert deserialized(outputs="one two three four") is True
    assert deserialized(outputs="one two") is False


def test_end_to_end_complex_round_trip():
    @scorer(name="complete_test", aggregations=["mean", "max"])
    def complete_scorer(inputs, outputs, expectations):
        input_words = len(inputs.split())
        output_words = len(outputs.split())
        expected_ratio = expectations.get("word_ratio", 1.0)

        actual_ratio = output_words / input_words if input_words > 0 else 0
        return actual_ratio >= expected_ratio

    test_args = {
        "inputs": "hello world",
        "outputs": "hello beautiful world today",
        "expectations": {"word_ratio": 1.5},
    }

    # Test original
    original_result = complete_scorer(**test_args)
    assert original_result is True

    # Round-trip
    serialized = complete_scorer.model_dump()
    deserialized = Scorer.model_validate(serialized)

    # Test everything preserved
    assert deserialized.name == "complete_test"
    assert deserialized.aggregations == ["mean", "max"]
    deserialized_result = deserialized(**test_args)
    assert original_result == deserialized_result is True


def test_deserialized_scorer_runs_without_global_context():
    # Create a simple scorer that only uses built-in functions and parameters
    @scorer(name="isolated_test")
    def simple_scorer(outputs):
        # Only use built-in functions and the parameter - no external dependencies
        return len(outputs.split()) > 2

    # Test original works
    assert simple_scorer(outputs="one two three") is True
    assert simple_scorer(outputs="one two") is False

    # Serialize the scorer
    serialized_data = simple_scorer.model_dump()

    # Test deserialized scorer in completely isolated namespace using exec
    test_code = """
# Import required modules in isolated namespace
from mlflow.genai.scorers import Scorer

# Deserialize the scorer (no external context available)
deserialized = Scorer.model_validate(serialized_data)

# Test that it can run successfully in isolation
result1 = deserialized(outputs="one two three")
result2 = deserialized(outputs="one two")
result3 = deserialized(outputs="hello world test case")

# Store results for verification
test_results = {
    "result1": result1,
    "result2": result2,
    "result3": result3,
    "name": deserialized.name,
    "aggregations": deserialized.aggregations
}
"""

    # Execute in isolated namespace with only serialized_data available
    isolated_namespace = {"serialized_data": serialized_data}
    exec(test_code, isolated_namespace)  # noqa: S102

    # Verify results from isolated execution
    results = isolated_namespace["test_results"]
    assert results["result1"] is True  # "one two three" has 3 words > 2
    assert results["result2"] is False  # "one two" has 2 words, not > 2
    assert results["result3"] is True  # "hello world test case" has 4 words > 2
    assert results["name"] == "isolated_test"
    assert results["aggregations"] is None


def test_builtin_scorer_round_trip():
    # from mlflow.genai.scorers import relevance_to_query
    from mlflow.genai.scorers.builtin_scorers import RelevanceToQuery

    # Round-trip serialization
    serialized = RelevanceToQuery().model_dump()
    deserialized = Scorer.model_validate(serialized)

    # Test class type and properties preserved
    assert isinstance(deserialized, RelevanceToQuery)
    assert deserialized.name == "relevance_to_query"
    assert hasattr(deserialized, "required_columns")
    assert deserialized.required_columns == {"inputs", "outputs"}

    # Test execution with mocking
    with patch(
        "mlflow.genai.judges.is_context_relevant",
        return_value=Feedback(name="relevance_to_query", value="yes", metadata={"chunk_index": 0}),
    ) as mock_judge:
        result = deserialized(
            inputs={"question": "What is machine learning?"},
            outputs=(
                "Machine learning is a subset of AI that enables computers to learn without "
                "explicit programming."
            ),
        )

    # Verify execution worked correctly
    mock_judge.assert_called_once_with(
        request="{'question': 'What is machine learning?'}",
        context=(
            "Machine learning is a subset of AI that enables computers to learn without "
            "explicit programming."
        ),
        name="relevance_to_query",
        model=None,
    )

    assert isinstance(result, Feedback)
    assert result.name == "relevance_to_query"
    assert result.value == "yes"
    assert result.metadata == {"chunk_index": 0}  # chunk_index should be preserved


def test_builtin_scorer_with_parameters_round_trip():
    from mlflow.genai.scorers.builtin_scorers import Guidelines

    # Create scorer with custom parameters
    tone = (
        "The response must maintain a courteous, respectful tone throughout. "
        "It must show empathy for customer concerns."
    )
    tone_scorer = Guidelines(name="tone", guidelines=[tone])

    # Verify original properties
    assert tone_scorer.name == "tone"
    assert tone_scorer.guidelines == [tone]
    assert isinstance(tone_scorer, Guidelines)

    # Round-trip serialization
    serialized = tone_scorer.model_dump()

    # Verify serialization format includes all fields
    assert "builtin_scorer_class" in serialized
    assert serialized["builtin_scorer_class"] == "Guidelines"
    assert "builtin_scorer_pydantic_data" in serialized
    pydantic_data = serialized["builtin_scorer_pydantic_data"]
    assert "guidelines" in pydantic_data
    assert pydantic_data["guidelines"] == [tone]
    assert pydantic_data["name"] == "tone"

    # Deserialize
    deserialized = Scorer.model_validate(serialized)

    # Test class type and all properties preserved
    assert isinstance(deserialized, Guidelines)
    assert deserialized.name == "tone"
    assert deserialized.guidelines == [tone]
    assert hasattr(deserialized, "required_columns")
    assert deserialized.required_columns == {"inputs", "outputs"}

    # Test that it can be executed with mocking
    with patch(
        "mlflow.genai.judges.meets_guidelines",
        return_value=Feedback(
            name="tone", value=True, rationale="Response is appropriately courteous"
        ),
    ) as mock_judge:
        result = deserialized(
            inputs={"question": "What is the issue?"},
            outputs=(
                "Thank you for bringing this to my attention. I understand your concern and "
                "will help resolve this issue promptly."
            ),
        )

    # Verify execution worked correctly
    mock_judge.assert_called_once_with(
        guidelines=[tone],
        context={
            "request": "{'question': 'What is the issue?'}",
            "response": (
                "Thank you for bringing this to my attention. I understand your concern and "
                "will help resolve this issue promptly."
            ),
        },
        name="tone",
        model=None,
    )

    assert isinstance(result, Feedback)
    assert result.name == "tone"
    assert result.value is True


def test_direct_subclass_scorer_rejected():
    class DirectSubclassScorer(Scorer):
        """An unsupported direct subclass of Scorer."""

        def __init__(self, **data):
            super().__init__(name="direct_subclass", **data)

        def __call__(self, *, outputs):
            return len(outputs) > 5

    # Create instance - this should work
    direct_scorer = DirectSubclassScorer()

    # Calling it should work
    assert direct_scorer(outputs="hello world") is True
    assert direct_scorer(outputs="hi") is False

    # But serialization should raise an error
    with pytest.raises(MlflowException, match="Unsupported scorer type: DirectSubclassScorer"):
        direct_scorer.model_dump()

    # Verify the error message is informative
    try:
        direct_scorer.model_dump()
    except MlflowException as e:
        error_msg = str(e)
        assert "Builtin scorers" in error_msg
        assert "Decorator-created scorers" in error_msg
        assert "@scorer decorator" in error_msg
        assert "Direct subclassing of Scorer is not supported" in error_msg


def test_builtin_scorer_with_aggregations_round_trip():
    from mlflow.genai.scorers.builtin_scorers import RelevanceToQuery

    scorer_with_aggs = RelevanceToQuery(name="relevance_with_aggs", aggregations=["mean", "max"])

    # Test that aggregations were set
    assert scorer_with_aggs.name == "relevance_with_aggs"
    assert scorer_with_aggs.aggregations == ["mean", "max"]

    # Round-trip serialization
    serialized = scorer_with_aggs.model_dump()
    deserialized = Scorer.model_validate(serialized)

    # Test properties preserved
    assert isinstance(deserialized, RelevanceToQuery)
    assert deserialized.name == "relevance_with_aggs"
    assert deserialized.aggregations == ["mean", "max"]
    assert hasattr(deserialized, "required_columns")
    assert deserialized.required_columns == {"inputs", "outputs"}

    # Test that both can be executed with mocking
    test_args = {
        "inputs": {"question": "What is machine learning?"},
        "outputs": "Machine learning is a subset of AI.",
    }

    with patch(
        "mlflow.genai.judges.is_context_relevant",
        return_value=Feedback(name="relevance_with_aggs", value="yes"),
    ) as mock_judge:
        # Test original scorer
        original_result = scorer_with_aggs(**test_args)

        # Test deserialized scorer
        deserialized_result = deserialized(**test_args)

    # Verify both results are equivalent
    assert original_result.name == deserialized_result.name == "relevance_with_aggs"
    assert original_result.value == deserialized_result.value == "yes"

    # Judge should be called twice (once for each scorer)
    assert mock_judge.call_count == 2


# ============================================================================
# COMPATIBILITY TESTS (Fixed serialized strings for backward compatibility)
# ============================================================================


def test_builtin_scorer_with_custom_name_compatibility():
    # Fixed serialized string for Guidelines scorer with custom name and parameters
    fixed_serialized_data = {
        "name": "custom_guidelines",
        "aggregations": ["mean", "max"],
        "mlflow_version": "3.1.0",
        "serialization_version": 1,
        "builtin_scorer_class": "Guidelines",
        "builtin_scorer_pydantic_data": {
            "name": "custom_guidelines",
            "aggregations": ["mean", "max"],
            "required_columns": ["inputs", "outputs"],
            "guidelines": [
                "Be polite and professional",
                "Provide accurate information",
            ],
        },
        "call_source": None,
        "call_signature": None,
        "original_func_name": None,
    }

    # Test deserialization
    deserialized = Scorer.model_validate(fixed_serialized_data)

    # Verify correct type and properties
    from mlflow.genai.scorers.builtin_scorers import Guidelines

    assert isinstance(deserialized, Guidelines)
    assert deserialized.name == "custom_guidelines"
    assert deserialized.aggregations == ["mean", "max"]
    assert deserialized.guidelines == [
        "Be polite and professional",
        "Provide accurate information",
    ]
    assert deserialized.required_columns == {"inputs", "outputs"}


def test_custom_scorer_compatibility_from_fixed_string():
    # Fixed serialized string representing a simple custom scorer
    fixed_serialized_data = {
        "name": "word_count_scorer",
        "aggregations": ["mean"],
        "mlflow_version": "3.1.0",
        "serialization_version": 1,
        "builtin_scorer_class": None,
        "builtin_scorer_pydantic_data": None,
        "call_source": "return len(outputs.split())",
        "call_signature": "(outputs)",
        "original_func_name": "word_count_scorer",
    }

    # Test deserialization
    deserialized = Scorer.model_validate(fixed_serialized_data)

    # Verify correct properties
    assert deserialized.name == "word_count_scorer"
    assert deserialized.aggregations == ["mean"]

    # Test functionality
    assert deserialized(outputs="hello world test") == 3
    assert deserialized(outputs="single") == 1
    assert deserialized(outputs="") == 0


def test_complex_custom_scorer_compatibility():
    # Fixed serialized string for a more complex custom scorer
    fixed_serialized_data = {
        "name": "length_comparison",
        "aggregations": None,
        "mlflow_version": "2.9.0",
        "serialization_version": 1,
        "builtin_scorer_class": None,
        "builtin_scorer_pydantic_data": None,
        "call_source": (
            "input_len = len(inputs) if inputs else 0\n"
            "output_len = len(outputs) if outputs else 0\n"
            "min_ratio = expectations.get('min_ratio', 1.0) if expectations else 1.0\n"
            "return output_len >= input_len * min_ratio"
        ),
        "call_signature": "(inputs, outputs, expectations)",
        "original_func_name": "length_comparison",
    }

    # Test deserialization
    deserialized = Scorer.model_validate(fixed_serialized_data)

    # Verify properties
    assert deserialized.name == "length_comparison"
    assert deserialized.aggregations is None

    # Test functionality with various inputs
    assert (
        deserialized(inputs="hello", outputs="hello world", expectations={"min_ratio": 1.5}) is True
    )  # 11 >= 5 * 1.5 (7.5)

    assert (
        deserialized(inputs="hello", outputs="hi", expectations={"min_ratio": 1.5}) is False
    )  # 2 < 5 * 1.5 (7.5)

    assert deserialized(inputs="test", outputs="test", expectations={}) is True  # 4 >= 4 * 1.0


def test_decorator_scorer_multiple_serialization_round_trips():
    @scorer
    def multi_round_scorer(outputs):
        return len(outputs) > 5

    # First serialization
    first_dump = multi_round_scorer.model_dump()

    # Deserialize
    recovered = Scorer.model_validate(first_dump)

    # Second serialization - this should work now with caching
    second_dump = recovered.model_dump()

    # Verify the dumps are identical
    assert first_dump == second_dump

    # Third serialization to ensure it's truly reusable
    third_dump = recovered.model_dump()
    assert first_dump == third_dump

    # Verify functionality is preserved
    assert recovered(outputs="hello world") is True
    assert recovered(outputs="hi") is False


def test_builtin_scorer_instructions_preserved_through_serialization():
    scorer = Guidelines(name="test_guidelines", guidelines=["Be helpful"])

    original_instructions = scorer.instructions

    serialized = scorer.model_dump()
    assert "builtin_scorer_pydantic_data" in serialized
    pydantic_data = serialized["builtin_scorer_pydantic_data"]

    assert "instructions" in pydantic_data
    assert pydantic_data["instructions"] == original_instructions

    deserialized = Scorer.model_validate(serialized)

    assert isinstance(deserialized, Guidelines)
    assert deserialized.instructions == original_instructions
    assert deserialized.name == "test_guidelines"
    assert deserialized.guidelines == ["Be helpful"]
```

--------------------------------------------------------------------------------

---[FILE: test_validation.py]---
Location: mlflow-master/tests/genai/scorers/test_validation.py

```python
from unittest import mock

import pandas as pd
import pytest

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.genai.evaluation.utils import _convert_to_eval_set
from mlflow.genai.scorers.base import Scorer, scorer
from mlflow.genai.scorers.builtin_scorers import (
    Correctness,
    ExpectationsGuidelines,
    Guidelines,
    RelevanceToQuery,
    RetrievalGroundedness,
    RetrievalSufficiency,
    get_all_scorers,
)
from mlflow.genai.scorers.validation import valid_data_for_builtin_scorers, validate_scorers

from tests.genai.conftest import databricks_only


@pytest.fixture
def mock_logger():
    with mock.patch("mlflow.genai.scorers.validation._logger") as mock_logger:
        yield mock_logger


def test_validate_scorers_valid():
    @scorer
    def custom_scorer(inputs, outputs):
        return 1.0

    scorers = validate_scorers(
        [
            RelevanceToQuery(),
            Correctness(),
            Guidelines(guidelines=["Be polite", "Be kind"]),
            custom_scorer,
        ]
    )

    assert len(scorers) == 4
    assert all(isinstance(scorer, Scorer) for scorer in scorers)


def test_validate_scorers_empty_list():
    assert validate_scorers([]) == []


@databricks_only
def test_validate_scorers_legacy_metric():
    from databricks.agents.evals import metric

    @metric
    def legacy_metric_1(request, response):
        return 1.0

    @metric
    def legacy_metric_2(request, response):
        return 1.0

    with mock.patch("mlflow.genai.scorers.validation._logger") as mock_logger:
        scorers = validate_scorers([legacy_metric_1, legacy_metric_2])

    assert len(scorers) == 2
    mock_logger.warning.assert_called_once()
    assert "legacy_metric_1" in mock_logger.warning.call_args[0][0]


def test_validate_scorers_invalid_all_scorers():
    with pytest.raises(MlflowException, match="The `scorers` argument must be a list") as e:
        validate_scorers([1, 2, 3])
    assert "an invalid item with type: int" in str(e.value)

    # Special case 1: List of list of all scorers
    with pytest.raises(MlflowException, match="The `scorers` argument must be a list") as e:
        validate_scorers([get_all_scorers()])

    assert "an invalid item with type: list" in str(e.value)
    assert "Hint: Use `scorers=get_all_scorers()` to pass all" in str(e.value)

    # Special case 2: List of list of all scorers + custom scorers
    with pytest.raises(MlflowException, match="The `scorers` argument must be a list") as e:
        validate_scorers([get_all_scorers(), RelevanceToQuery(), Correctness()])

    assert "an invalid item with type: list" in str(e.value)
    assert "Hint: Use `scorers=[*get_all_scorers(), scorer1, scorer2]` to pass all" in str(e.value)

    # Special case 3: List of classes (not instances)
    with pytest.raises(MlflowException, match="The `scorers` argument must be a list") as e:
        validate_scorers([RelevanceToQuery])

    assert "Correct way to pass scorers is `scorers=[RelevanceToQuery()]`." in str(e.value)


def test_validate_data(mock_logger, sample_rag_trace):
    data = pd.DataFrame(
        {
            "inputs": [{"question": "input1"}, {"question": "input2"}],
            "outputs": ["output1", "output2"],
            "trace": [sample_rag_trace, sample_rag_trace],
        }
    )

    converted_date = _convert_to_eval_set(data)
    valid_data_for_builtin_scorers(
        data=converted_date,
        builtin_scorers=[
            RelevanceToQuery(),
            RetrievalGroundedness(),
            Guidelines(guidelines=["Be polite", "Be kind"]),
        ],
    )
    mock_logger.info.assert_not_called()


def test_validate_data_with_expectations(mock_logger, sample_rag_trace):
    data = pd.DataFrame(
        {
            "inputs": [{"question": "input1"}, {"question": "input2"}],
            "outputs": ["output1", "output2"],
            "trace": [sample_rag_trace, sample_rag_trace],
            "expectations": [
                {"expected_response": "response1", "guidelines": ["Be polite", "Be kind"]},
                {"expected_response": "response2", "guidelines": ["Be nice", "Be strong"]},
            ],
        }
    )

    converted_date = _convert_to_eval_set(data)
    valid_data_for_builtin_scorers(
        data=converted_date,
        builtin_scorers=[
            RelevanceToQuery(),
            RetrievalSufficiency(),  # requires expected_response in expectations
            ExpectationsGuidelines(),  # requires guidelines in expectations
        ],
    )
    mock_logger.info.assert_not_called()


def test_global_guidelines_do_not_require_expectations(mock_logger):
    data = pd.DataFrame(
        {
            "inputs": [{"question": "input1"}, {"question": "input2"}],
            "outputs": ["output1", "output2"],
        }
    )
    converted_date = _convert_to_eval_set(data)
    valid_data_for_builtin_scorers(
        data=converted_date,
        builtin_scorers=[Guidelines(guidelines=["Be polite", "Be kind"])],
    )
    mock_logger.info.assert_not_called()


@pytest.mark.parametrize(
    "expectations",
    [
        {"expected_facts": [["fact1", "fact2"], ["fact3"]]},
        {"expected_response": ["expectation1", "expectation2"]},
    ],
)
def test_validate_data_with_correctness(expectations, mock_logger):
    data = pd.DataFrame(
        {
            "inputs": [{"question": "input1"}, {"question": "input2"}],
            "outputs": ["output1", "output2"],
            "expectations": [expectations, expectations],
        }
    )

    converted_date = _convert_to_eval_set(data)
    valid_data_for_builtin_scorers(
        data=converted_date,
        builtin_scorers=[Correctness()],
    )

    valid_data_for_builtin_scorers(
        data=pd.DataFrame({"inputs": ["input1"], "outputs": ["output1"]}),
        builtin_scorers=[Correctness()],
    )

    mock_logger.info.assert_called_once()
    message = mock_logger.info.call_args[0][0]
    assert "expected_response or expected_facts" in message


def test_validate_data_missing_columns(mock_logger):
    data = pd.DataFrame({"inputs": [{"question": "input1"}, {"question": "input2"}]})

    converted_date = _convert_to_eval_set(data)

    valid_data_for_builtin_scorers(
        data=converted_date,
        builtin_scorers=[
            RelevanceToQuery(),
            RetrievalGroundedness(),
            Guidelines(guidelines=["Be polite", "Be kind"]),
        ],
    )

    mock_logger.info.assert_called_once()
    msg = mock_logger.info.call_args[0][0]
    assert " - `outputs` column is required by [relevance_to_query, guidelines]." in msg
    assert " - `trace` column is required by [retrieval_groundedness]." in msg


def test_validate_data_with_trace(mock_logger):
    # When a trace is provided, the inputs, outputs, and retrieved_context are
    # inferred from the trace.
    with mlflow.start_span() as span:
        span.set_inputs({"question": "What is the capital of France?"})
        span.set_outputs("Paris")

    trace = mlflow.get_trace(span.trace_id)
    data = [{"trace": trace}, {"trace": trace}]

    converted_date = _convert_to_eval_set(data)
    valid_data_for_builtin_scorers(
        data=converted_date,
        builtin_scorers=[
            RelevanceToQuery(),
            RetrievalGroundedness(),
            Guidelines(guidelines=["Be polite", "Be kind"]),
        ],
    )
    mock_logger.info.assert_not_called()


def test_validate_data_with_predict_fn(mock_logger):
    data = pd.DataFrame({"inputs": [{"question": "input1"}, {"question": "input2"}]})

    converted_date = _convert_to_eval_set(data)

    valid_data_for_builtin_scorers(
        data=converted_date,
        predict_fn=lambda x: x,
        builtin_scorers=[
            # Requires "outputs" but predict_fn will provide it
            Guidelines(guidelines=["Be polite", "Be kind"]),
            # Requires "retrieved_context" but predict_fn will provide it
            RelevanceToQuery(),
        ],
    )

    mock_logger.info.assert_not_called()
```

--------------------------------------------------------------------------------

---[FILE: test_deepeval_scorer.py]---
Location: mlflow-master/tests/genai/scorers/deepeval/test_deepeval_scorer.py

```python
from unittest.mock import Mock, patch

import pytest

from mlflow.entities.assessment import Feedback
from mlflow.entities.assessment_source import AssessmentSourceType
from mlflow.genai.judges.utils import CategoricalRating
from mlflow.genai.scorers import FRAMEWORK_METADATA_KEY
from mlflow.genai.scorers.deepeval import AnswerRelevancy, KnowledgeRetention, get_scorer


@pytest.fixture
def mock_deepeval_model():
    """Create a mock DeepEval model that satisfies DeepEval's validation."""
    from deepeval.models.base_model import DeepEvalBaseLLM

    class MockDeepEvalModel(DeepEvalBaseLLM):
        def __init__(self):
            super().__init__(model_name="mock-model")

        def load_model(self):
            return self

        def generate(self, prompt: str, schema=None) -> str:
            return "mock response"

        async def a_generate(self, prompt: str, schema=None) -> str:
            return "mock response"

        def get_model_name(self) -> str:
            return "mock-model"

    return MockDeepEvalModel()


def test_deepeval_scorer_with_exact_match_metric():
    scorer = get_scorer("ExactMatch")
    result = scorer(
        inputs="What is MLflow?",
        outputs="MLflow is a platform",
        expectations={"expected_output": "MLflow is a platform"},
    )

    assert isinstance(result, Feedback)
    assert result.name == "ExactMatch"
    assert result.value == CategoricalRating.YES
    assert result.metadata["score"] == 1.0
    assert result.metadata[FRAMEWORK_METADATA_KEY] == "deepeval"
    assert result.source.source_type == AssessmentSourceType.CODE
    assert result.source.source_id is None


def test_deepeval_scorer_handles_failure_with_exact_match():
    scorer = get_scorer("ExactMatch")
    result = scorer(
        inputs="What is MLflow?",
        outputs="MLflow is different",
        expectations={"expected_output": "MLflow is a platform"},
    )

    assert result.value == CategoricalRating.NO
    assert result.metadata["score"] == 0.0
    assert result.metadata[FRAMEWORK_METADATA_KEY] == "deepeval"


def test_metric_kwargs_passed_to_deepeval_metric():
    with (
        patch("mlflow.genai.scorers.deepeval.get_metric_class") as mock_get_metric_class,
        patch("mlflow.genai.scorers.deepeval.create_deepeval_model") as mock_create_model,
    ):
        mock_metric_class = Mock()
        mock_metric_instance = Mock()
        mock_metric_instance.score = 0.8
        mock_metric_instance.reason = "Test"
        mock_metric_instance.threshold = 0.9
        mock_metric_instance.is_successful.return_value = True
        mock_metric_class.return_value = mock_metric_instance
        mock_get_metric_class.return_value = mock_metric_class
        mock_create_model.return_value = Mock()

        get_scorer("AnswerRelevancy", threshold=0.9, include_reason=True, custom_param="value")

        call_kwargs = mock_metric_class.call_args[1]
        assert call_kwargs["threshold"] == 0.9
        assert call_kwargs["include_reason"] is True
        assert call_kwargs["custom_param"] == "value"
        assert call_kwargs["verbose_mode"] is False
        assert call_kwargs["async_mode"] is False


def test_deepeval_scorer_returns_error_feedback_on_exception():
    with (
        patch("mlflow.genai.scorers.deepeval.get_metric_class") as mock_get_metric_class,
        patch("mlflow.genai.scorers.deepeval.create_deepeval_model") as mock_create_model,
    ):
        mock_metric_class = Mock()
        mock_metric_instance = Mock()
        mock_metric_instance.measure.side_effect = RuntimeError("Test error")
        mock_metric_class.return_value = mock_metric_instance
        mock_get_metric_class.return_value = mock_metric_class
        mock_create_model.return_value = Mock()

        scorer = get_scorer("AnswerRelevancy", model="openai:/gpt-4o")
        result = scorer(inputs="What is MLflow?", outputs="Test output")

        assert isinstance(result, Feedback)
        assert result.name == "AnswerRelevancy"
        assert result.value is None
        assert result.error is not None
        assert result.error.error_code == "RuntimeError"
        assert result.error.error_message == "Test error"
        assert result.source.source_type == AssessmentSourceType.LLM_JUDGE
        assert result.source.source_id == "openai:/gpt-4o"


def test_multi_turn_metric_is_session_level_scorer(mock_deepeval_model):
    with patch(
        "mlflow.genai.scorers.deepeval.create_deepeval_model", return_value=mock_deepeval_model
    ):
        knowledge_retention = KnowledgeRetention()
        assert knowledge_retention.is_session_level_scorer is True

        answer_relevancy = AnswerRelevancy()
        assert answer_relevancy.is_session_level_scorer is False


def test_multi_turn_metric_requires_session_parameter(mock_deepeval_model):
    with patch(
        "mlflow.genai.scorers.deepeval.create_deepeval_model", return_value=mock_deepeval_model
    ):
        scorer = KnowledgeRetention()

        result = scorer(inputs="test", outputs="test")
        assert result.error is not None
        assert "requires 'session' parameter" in result.error.error_message


def test_multi_turn_metric_with_session(mock_deepeval_model):
    mock_conversational_test_case = Mock()

    with (
        patch(
            "mlflow.genai.scorers.deepeval.create_deepeval_model", return_value=mock_deepeval_model
        ),
        patch(
            "mlflow.genai.scorers.deepeval.map_session_to_deepeval_conversational_test_case",
            return_value=mock_conversational_test_case,
        ) as mock_map_session,
    ):
        mock_traces = [Mock(), Mock(), Mock()]

        scorer = KnowledgeRetention()

        # Mock the metric's behavior after it's created
        scorer._metric.score = 0.85
        scorer._metric.reason = "Good knowledge retention"
        scorer._metric.threshold = 0.7
        scorer._metric.is_successful = Mock(return_value=True)
        scorer._metric.measure = Mock()

        result = scorer(session=mock_traces)

        # Verify session mapping was called
        mock_map_session.assert_called_once_with(session=mock_traces, expectations=None)

        # Verify metric.measure was called with conversational test case
        scorer._metric.measure.assert_called_once_with(
            mock_conversational_test_case, _show_indicator=False
        )

        # Verify result
        assert isinstance(result, Feedback)
        assert result.name == "KnowledgeRetention"
        assert result.value == CategoricalRating.YES
        assert result.metadata["score"] == 0.85


def test_single_turn_metric_ignores_session_parameter():
    mock_test_case = Mock()
    mock_metric_instance = Mock()
    mock_metric_instance.score = 0.9
    mock_metric_instance.reason = "Highly relevant"
    mock_metric_instance.threshold = 0.7
    mock_metric_instance.is_successful.return_value = True

    with (
        patch("mlflow.genai.scorers.deepeval.create_deepeval_model"),
        patch(
            "mlflow.genai.scorers.deepeval.get_metric_class",
            return_value=Mock(return_value=mock_metric_instance),
        ),
        patch(
            "mlflow.genai.scorers.deepeval.map_scorer_inputs_to_deepeval_test_case",
            return_value=mock_test_case,
        ) as mock_map_inputs,
        patch(
            "mlflow.genai.scorers.deepeval.map_session_to_deepeval_conversational_test_case"
        ) as mock_map_session,
    ):
        mock_traces = [Mock(), Mock()]

        scorer = AnswerRelevancy()

        # Single-turn metric should use inputs/outputs even when session is provided
        result = scorer(inputs="question", outputs="answer", session=mock_traces)

        # Verify single-turn mapping was called, NOT session mapping
        mock_map_inputs.assert_called_once()
        mock_map_session.assert_not_called()

        # Verify result
        assert isinstance(result, Feedback)
        assert result.value == CategoricalRating.YES
```

--------------------------------------------------------------------------------

---[FILE: test_models.py]---
Location: mlflow-master/tests/genai/scorers/deepeval/test_models.py

```python
from unittest.mock import Mock, patch

import pytest

from mlflow.genai.scorers.deepeval.models import DatabricksDeepEvalLLM


@pytest.fixture
def mock_call_chat_completions():
    with patch("mlflow.genai.scorers.deepeval.models.call_chat_completions") as mock:
        result = Mock()
        result.output = "Test output"
        mock.return_value = result
        yield mock


def test_databricks_deepeval_llm_generate(mock_call_chat_completions):
    llm = DatabricksDeepEvalLLM()
    result = llm.generate("Test prompt")

    assert result == "Test output"
    mock_call_chat_completions.assert_called_once_with(
        user_prompt="Test prompt",
        system_prompt="",
    )
```

--------------------------------------------------------------------------------

````
