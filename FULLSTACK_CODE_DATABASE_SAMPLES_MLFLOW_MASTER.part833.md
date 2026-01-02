---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 833
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 833 of 991)

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

---[FILE: test_scorer_CRUD.py]---
Location: mlflow-master/tests/genai/scorers/test_scorer_CRUD.py

```python
from unittest.mock import ANY, Mock, patch

import mlflow
from mlflow.genai.scorers import Scorer, scorer
from mlflow.genai.scorers.base import ScorerSamplingConfig, ScorerStatus
from mlflow.genai.scorers.registry import (
    delete_scorer,
    get_scorer,
    list_scorer_versions,
    list_scorers,
)


def test_mlflow_backend_scorer_operations():
    with (
        patch("mlflow.genai.scorers.base.is_in_databricks_runtime", return_value=True),
        patch("mlflow.genai.scorers.base.is_databricks_uri", return_value=True),
    ):
        experiment_id = mlflow.create_experiment("test_scorer_mlflow_backend_experiment")
        mlflow.set_experiment(experiment_id=experiment_id)

        @scorer
        def test_mlflow_scorer_v1(outputs) -> bool:
            return len(outputs) > 0

        assert test_mlflow_scorer_v1.status == ScorerStatus.UNREGISTERED
        # Test register operation
        registered_scorer_v1 = test_mlflow_scorer_v1.register(
            experiment_id=experiment_id, name="test_mlflow_scorer"
        )

        assert registered_scorer_v1.status == ScorerStatus.STOPPED

        # Register a second version of the scorer
        @scorer
        def test_mlflow_scorer_v2(outputs) -> bool:
            return len(outputs) > 10  # Different logic for v2

        # Register the scorer in the active experiment.
        registered_scorer_v2 = test_mlflow_scorer_v2.register(name="test_mlflow_scorer")
        assert registered_scorer_v2.name == "test_mlflow_scorer"

        # Test list operation
        scorers = list_scorers(experiment_id=experiment_id)
        assert len(scorers) == 1
        assert scorers[0]._original_func.__name__ == "test_mlflow_scorer_v2"

        # Test list versions
        scorer_versions = list_scorer_versions(
            name="test_mlflow_scorer", experiment_id=experiment_id
        )
        assert len(scorer_versions) == 2

        # Test get_scorer with specific version
        retrieved_scorer_v1 = get_scorer(
            name="test_mlflow_scorer", experiment_id=experiment_id, version=1
        )
        assert retrieved_scorer_v1._original_func.__name__ == "test_mlflow_scorer_v1"

        retrieved_scorer_v2 = get_scorer(
            name="test_mlflow_scorer", experiment_id=experiment_id, version=2
        )
        assert retrieved_scorer_v2._original_func.__name__ == "test_mlflow_scorer_v2"

        retrieved_scorer_latest = get_scorer(name="test_mlflow_scorer", experiment_id=experiment_id)
        assert retrieved_scorer_latest._original_func.__name__ == "test_mlflow_scorer_v2"

        # Test delete_scorer with specific version
        delete_scorer(name="test_mlflow_scorer", experiment_id=experiment_id, version=2)
        scorers_after_delete = list_scorers(experiment_id=experiment_id)
        assert len(scorers_after_delete) == 1
        assert scorers_after_delete[0]._original_func.__name__ == "test_mlflow_scorer_v1"

        delete_scorer(name="test_mlflow_scorer", experiment_id=experiment_id, version=1)
        scorers_after_delete = list_scorers(experiment_id=experiment_id)
        assert len(scorers_after_delete) == 0

        # test delete all versions
        test_mlflow_scorer_v1.register(experiment_id=experiment_id, name="test_mlflow_scorer")
        test_mlflow_scorer_v2.register(experiment_id=experiment_id, name="test_mlflow_scorer")
        delete_scorer(name="test_mlflow_scorer", experiment_id=experiment_id, version="all")
        assert len(list_scorers(experiment_id=experiment_id)) == 0

        # Clean up
        mlflow.delete_experiment(experiment_id)


def test_databricks_backend_scorer_operations():
    from mlflow.genai.scorers.registry import DatabricksStore

    # Mock the scheduled scorer responses
    mock_scheduled_scorer = Mock()
    mock_scheduled_scorer.scorer = Mock(spec=Scorer)
    mock_scheduled_scorer.scorer.name = "test_databricks_scorer"
    mock_scheduled_scorer.sample_rate = 0.5
    mock_scheduled_scorer.filter_string = "test_filter"

    with (
        patch("mlflow.tracking.get_tracking_uri", return_value="databricks"),
        patch("mlflow.genai.scorers.base.is_in_databricks_runtime", return_value=True),
        patch("mlflow.genai.scorers.base.is_databricks_uri", return_value=True),
        patch("mlflow.genai.scorers.registry._get_scorer_store") as mock_get_store,
        patch("mlflow.genai.scorers.registry.DatabricksStore.add_registered_scorer") as mock_add,
        patch(
            "mlflow.genai.scorers.registry.DatabricksStore.list_scheduled_scorers",
            return_value=[mock_scheduled_scorer],
        ) as mock_list,
        patch(
            "mlflow.genai.scorers.registry.DatabricksStore.get_scheduled_scorer",
            return_value=mock_scheduled_scorer,
        ) as mock_get,
        patch(
            "mlflow.genai.scorers.registry.DatabricksStore.delete_scheduled_scorer",
            return_value=None,
        ) as mock_delete,
    ):
        # Set up the store mock
        mock_store = DatabricksStore()
        mock_get_store.return_value = mock_store

        # Test register operation
        @scorer
        def test_databricks_scorer(outputs) -> bool:
            return len(outputs) > 0

        assert test_databricks_scorer.status == ScorerStatus.UNREGISTERED
        registered_scorer = test_databricks_scorer.register(experiment_id="exp_123")
        assert registered_scorer.name == "test_databricks_scorer"
        assert registered_scorer.status == ScorerStatus.STOPPED

        # Verify add_registered_scorer was called during registration
        mock_add.assert_called_once_with(
            name="test_databricks_scorer",
            scorer=ANY,
            sample_rate=0.0,
            filter_string=None,
            experiment_id="exp_123",
        )

        # Test list operation
        scorers = list_scorers(experiment_id="exp_123")

        assert scorers[0].name == "test_databricks_scorer"
        assert scorers[0]._sampling_config == ScorerSamplingConfig(
            sample_rate=0.5, filter_string="test_filter"
        )

        assert len(scorers) == 1
        mock_list.assert_called_once_with("exp_123")

        # Test get operation
        retrieved_scorer = get_scorer(name="test_databricks_scorer", experiment_id="exp_123")
        assert retrieved_scorer.name == "test_databricks_scorer"
        mock_get.assert_called_once_with("test_databricks_scorer", "exp_123")

        # Test delete operation
        delete_scorer(name="test_databricks_scorer", experiment_id="exp_123")
        mock_delete.assert_called_once_with("exp_123", "test_databricks_scorer")
```

--------------------------------------------------------------------------------

---[FILE: test_scorer_description.py]---
Location: mlflow-master/tests/genai/scorers/test_scorer_description.py

```python
from unittest.mock import patch

import pytest

from mlflow.genai import scorer
from mlflow.genai.judges import make_judge
from mlflow.genai.judges.instructions_judge import InstructionsJudge
from mlflow.genai.scorers import RelevanceToQuery


@pytest.fixture(autouse=True)
def mock_databricks_runtime():
    with patch("mlflow.genai.scorers.base.is_in_databricks_runtime", return_value=True):
        yield


def test_decorator_scorer_with_description():
    description = "Checks if output length exceeds 100 characters"

    @scorer(description=description)
    def length_check(outputs) -> bool:
        return len(outputs) > 100

    assert length_check.description == description


def test_decorator_scorer_without_description():
    @scorer
    def simple_scorer(outputs) -> bool:
        return True

    assert simple_scorer.description is None


def test_decorator_scorer_with_name_and_description():
    description = "Custom description for scorer"

    @scorer(name="custom_name", description=description)
    def my_scorer(outputs) -> bool:
        return True

    assert my_scorer.name == "custom_name"
    assert my_scorer.description == description


def test_builtin_scorer_with_description():
    description = "Custom description for relevance scorer"
    scorer_instance = RelevanceToQuery(description=description)

    assert scorer_instance.description == description


def test_builtin_scorer_without_description():
    # Built-in scorers now have default descriptions for improved discoverability
    scorer_instance = RelevanceToQuery()

    assert scorer_instance.description is not None
    assert isinstance(scorer_instance.description, str)
    assert len(scorer_instance.description) > 0


@pytest.mark.parametrize(
    ("name", "description"),
    [
        ("test_judge", "Evaluates response quality"),
        ("another_judge", None),
        ("judge_with_desc", "This is a test description"),
    ],
)
def test_make_judge_with_description(name: str, description: str | None):
    judge = make_judge(
        name=name,
        instructions="Evaluate if {{ outputs }} is good quality",
        model="openai:/gpt-4",
        description=description,
        feedback_value_type=str,
    )

    assert judge.name == name
    assert judge.description == description


@pytest.mark.parametrize(
    "description",
    [
        "Direct InstructionsJudge with description",
        None,
    ],
)
def test_instructions_judge_description(description: str | None):
    judge = InstructionsJudge(
        name="test_judge",
        instructions="Evaluate {{ outputs }}",
        model="openai:/gpt-4",
        description=description,
    )

    assert judge.description == description


@pytest.mark.parametrize(
    "description",
    [
        "Test description for serialization",
        None,
    ],
)
def test_scorer_serialization(description: str | None):
    @scorer(description=description)
    def test_scorer(outputs) -> bool:
        return True

    serialized = test_scorer.model_dump()

    assert "description" in serialized
    assert serialized["description"] == description
    assert serialized["name"] == "test_scorer"


def test_scorer_deserialization_with_description():
    from mlflow.genai.scorers.base import Scorer

    description = "Test description for deserialization"

    @scorer(description=description)
    def test_scorer(outputs) -> bool:
        return True

    # Serialize and deserialize
    serialized = test_scorer.model_dump()
    deserialized = Scorer.model_validate(serialized)

    assert deserialized.description == description
    assert deserialized.name == "test_scorer"


def test_backward_compatibility_scorer_without_description():
    # Test decorator scorer - custom scorers still default to None
    @scorer
    def old_scorer(outputs) -> bool:
        return True

    assert old_scorer.description is None

    # Test builtin scorer - built-in scorers now have default descriptions
    builtin = RelevanceToQuery()
    assert builtin.description is not None
    assert isinstance(builtin.description, str)
    assert len(builtin.description) > 0

    # Test InstructionsJudge - custom judges still default to None
    judge = InstructionsJudge(
        name="old_judge",
        instructions="Evaluate {{ outputs }}",
        model="openai:/gpt-4",
    )
    assert judge.description is None
```

--------------------------------------------------------------------------------

---[FILE: test_scorer_utils.py]---
Location: mlflow-master/tests/genai/scorers/test_scorer_utils.py

```python
import json

import pytest

from mlflow.entities import Assessment, Feedback, Trace
from mlflow.genai.scorers.scorer_utils import recreate_function

# ============================================================================
# HAPPY PATH TESTS
# ============================================================================


def test_simple_function_recreation():
    source = "return x + y"
    signature = "(x, y)"
    func_name = "add_func"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated.__name__ == func_name
    assert recreated(3, 4) == 7
    assert recreated(10, -5) == 5


def test_function_with_control_flow():
    source = """if x > 0:
    return "positive"
else:
    return "non-positive" """
    signature = "(x)"
    func_name = "classify_number"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated(5) == "positive"
    assert recreated(-3) == "non-positive"
    assert recreated(0) == "non-positive"


def test_function_with_loop():
    source = """total = 0
for i in range(n):
    total += i
return total"""
    signature = "(n)"
    func_name = "sum_range"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated(5) == 10  # 0+1+2+3+4
    assert recreated(3) == 3  # 0+1+2
    assert recreated(0) == 0


def test_function_with_multiple_parameters():
    source = """if threshold is None:
    threshold = 5
return len(text) > threshold"""
    signature = "(text, threshold=None)"
    func_name = "length_check"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated("hello") is False  # len=5, not > 5
    assert recreated("hello world") is True  # len=11, > 5
    assert recreated("hi", 1) is True  # len=2, > 1


def test_function_creating_feedback_object():
    source = """import re
words = re.findall(r'\\b\\w+\\b', text)
return Feedback(value=len(words), rationale=f"Found {len(words)} words")"""
    signature = "(text)"
    func_name = "word_counter"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    result = recreated("hello world test")
    assert isinstance(result, Feedback)
    assert result.value == 3
    assert "Found 3 words" in result.rationale


def test_function_creating_assessment_object():
    # Note: Assessment constructor doesn't take 'value' directly - it's an abstract base
    # Use Feedback instead, which is a concrete subclass of Assessment
    source = """score = 1 if "good" in response else 0
return Feedback(name=name, value=score, rationale="Assessment result")"""
    signature = "(response, name='test_assessment')"
    func_name = "assess_response"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    result = recreated("This is good")
    assert isinstance(result, Feedback)
    assert isinstance(result, Assessment)  # Feedback is a subclass of Assessment
    assert result.value == 1
    assert result.name == "test_assessment"


def test_complex_logic_function():
    source = """result = {}
for item in items:
    if isinstance(item, str):
        result[item] = len(item)
    elif isinstance(item, (int, float)):
        result[str(item)] = item * 2
return result"""
    signature = "(items)"
    func_name = "process_items"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    result = recreated(["hello", 5, "world", 3.5])
    expected = {"hello": 5, "5": 10, "world": 5, "3.5": 7.0}
    assert result == expected


# ============================================================================
# SIGNATURE PARSING TESTS
# ============================================================================


def test_empty_signature():
    source = "return 42"
    signature = "()"
    func_name = "get_answer"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated() == 42


def test_single_parameter_signature():
    source = "return x * 2"
    signature = "(x)"
    func_name = "double"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated(5) == 10


def test_signature_with_whitespace():
    source = "return a + b"
    signature = "( a , b )"
    func_name = "add_with_spaces"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated(3, 7) == 10


def test_signature_with_defaults():
    source = "return base ** exponent"
    signature = "(base, exponent=2)"
    func_name = "power"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated(3) == 9  # 3^2
    assert recreated(2, 3) == 8  # 2^3


def test_complex_signature():
    source = """if data is None:
    data = []
return f"{prefix}: {len(data)} items" + (suffix or "")"""
    signature = "(data=None, prefix='Result', suffix=None)"
    func_name = "format_result"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated() == "Result: 0 items"
    assert recreated([1, 2, 3]) == "Result: 3 items"
    assert recreated([1, 2], "Count", "!") == "Count: 2 items!"


def test_empty_signature_string():
    from mlflow.exceptions import MlflowException

    source = "return 1"
    signature = ""
    func_name = "empty_sig"

    with pytest.raises(MlflowException, match="Invalid signature format"):
        recreate_function(source, signature, func_name)


# ============================================================================
# IMPORT NAMESPACE TESTS
# ============================================================================


def test_function_with_unavailable_import():
    # Import errors occur at execution time, not definition time
    source = """from some_nonexistent_module import NonExistentClass
return NonExistentClass()"""
    signature = "()"
    func_name = "use_bad_import"

    recreated = recreate_function(source, signature, func_name)

    # Function should be created successfully
    assert recreated is not None

    # But should fail when called due to import error
    with pytest.raises(ModuleNotFoundError, match="some_nonexistent_module"):
        recreated()


def test_function_with_undefined_variable():
    source = "return undefined_variable * 2"
    signature = "()"
    func_name = "use_undefined"

    recreated = recreate_function(source, signature, func_name)

    # Function is created but will fail when called
    assert recreated is not None

    # Should raise NameError when called
    with pytest.raises(NameError, match="undefined_variable"):
        recreated()


def test_function_with_syntax_error():
    source = "if x > 0\n    return True"  # Missing colon
    signature = "(x)"
    func_name = "syntax_error_func"

    with pytest.raises(SyntaxError, match="expected ':'"):
        recreate_function(source, signature, func_name)


def test_function_using_builtin_modules():
    source = """import json
import re
data = {"count": len(re.findall(r'\\w+', text))}
return json.dumps(data)"""
    signature = "(text)"
    func_name = "json_word_count"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    result = recreated("hello world test")

    parsed = json.loads(result)
    assert parsed["count"] == 3


def test_mlflow_imports_available():
    source = """# Test all available MLflow imports
feedback = Feedback(value=True, rationale="test")
# AssessmentSource should be available too
from mlflow.entities.assessment_source import AssessmentSourceType
source_obj = AssessmentSourceType.CODE  # Use the default source type
# Test that Trace is available
from mlflow.entities import TraceInfo, TraceState, TraceData
from mlflow.entities.trace_location import (
    TraceLocation,
    TraceLocationType,
    MlflowExperimentLocation,
)
from mlflow.entities.trace import Trace
mlflow_exp_location = MlflowExperimentLocation(experiment_id="0")
trace_location = TraceLocation(
    type=TraceLocationType.MLFLOW_EXPERIMENT,
    mlflow_experiment=mlflow_exp_location
)
trace_info = TraceInfo(
    trace_id="test_trace_id",
    trace_location=trace_location,
    request_time=1000,
    state=TraceState.OK
)
trace = Trace(info=trace_info, data=TraceData())
return {"feedback": feedback, "source": source_obj, "trace": trace}"""
    signature = "()"
    func_name = "test_mlflow_imports"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    result = recreated()

    assert isinstance(result["feedback"], Feedback)
    # AssessmentSourceType should be available (it's an enum/class)
    assert result["source"] is not None
    assert result["source"] == "CODE"
    # Check that Trace is available and can be instantiated
    assert isinstance(result["trace"], Trace)


def test_function_name_in_namespace():
    source = "return 'success'"
    signature = "()"
    func_name = "test_name_func"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated.__name__ == func_name


def test_indentation_handling():
    # Source without indentation - should be indented by the function
    source = """x = 1
y = 2
return x + y"""
    signature = "()"
    func_name = "indentation_test"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated() == 3


def test_empty_source_code():
    source = ""
    signature = "()"
    func_name = "empty_func"

    # Empty source code should cause syntax error during function definition
    with pytest.raises(SyntaxError, match="expected an indented block"):
        recreate_function(source, signature, func_name)


def test_function_with_import_error_at_runtime():
    # Import that doesn't exist is referenced but not imported in the function
    source = """try:
    return NonExistentClass()
except NameError:
    return "import_failed" """
    signature = "()"
    func_name = "runtime_import_error"

    recreated = recreate_function(source, signature, func_name)

    # Function should be created successfully
    assert recreated is not None
    # But calling it should handle the missing import gracefully
    result = recreated()
    assert result == "import_failed"


def test_function_with_mlflow_trace_type_hint():
    """
    Test that a function with mlflow.entities.Trace type hints can be recreated.

    This reproduces the issue where scorers with type hints like mlflow.entities.Trace
    would fail to register because the mlflow module wasn't available in the namespace
    during function recreation.
    """
    source = """return Feedback(
    value=trace.info.trace_id is not None,
    rationale=f"Trace ID: {trace.info.trace_id}"
)"""
    signature = "(trace: mlflow.entities.Trace) -> mlflow.entities.Feedback"
    func_name = "scorer_with_trace_type_hint"

    recreated = recreate_function(source, signature, func_name)

    assert recreated is not None
    assert recreated.__name__ == func_name

    # Test that it can be called with a Trace object
    from mlflow.entities import TraceData, TraceInfo, TraceState
    from mlflow.entities.trace_location import (
        MlflowExperimentLocation,
        TraceLocation,
        TraceLocationType,
    )

    mlflow_exp_location = MlflowExperimentLocation(experiment_id="0")
    trace_location = TraceLocation(
        type=TraceLocationType.MLFLOW_EXPERIMENT, mlflow_experiment=mlflow_exp_location
    )
    trace_info = TraceInfo(
        trace_id="test_trace_id",
        trace_location=trace_location,
        request_time=1000,
        state=TraceState.OK,
    )
    trace = Trace(info=trace_info, data=TraceData())

    result = recreated(trace)
    assert isinstance(result, Feedback)
    assert result.value is True
    assert "test_trace_id" in result.rationale
```

--------------------------------------------------------------------------------

````
