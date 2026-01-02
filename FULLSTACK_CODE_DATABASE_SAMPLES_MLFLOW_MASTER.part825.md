---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 825
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 825 of 991)

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

---[FILE: test_dspy_utils.py]---
Location: mlflow-master/tests/genai/judges/optimizers/test_dspy_utils.py

```python
from unittest.mock import MagicMock, Mock, patch

import pytest

from mlflow.exceptions import MlflowException
from mlflow.genai.judges.base import JudgeField
from mlflow.genai.judges.optimizers.dspy_utils import (
    AgentEvalLM,
    agreement_metric,
    construct_dspy_lm,
    convert_litellm_to_mlflow_uri,
    convert_mlflow_uri_to_litellm,
    create_dspy_signature,
    trace_to_dspy_example,
)
from mlflow.genai.utils.trace_utils import (
    extract_expectations_from_trace,
    extract_request_from_trace,
    extract_response_from_trace,
)

from tests.genai.judges.optimizers.conftest import MockJudge


def test_sanitize_judge_name(sample_trace_with_assessment, mock_judge):
    # The sanitization is now done inside trace_to_dspy_example
    # Test that it correctly handles different judge name formats

    mock_dspy = MagicMock()
    mock_example = MagicMock()
    mock_example.with_inputs.return_value = mock_example
    mock_dspy.Example.return_value = mock_example

    with patch.dict("sys.modules", {"dspy": mock_dspy}):
        judge1 = MockJudge(name="  mock_judge  ")
        judge2 = MockJudge(name="Mock_Judge")
        judge3 = MockJudge(name="MOCK_JUDGE")
        assert trace_to_dspy_example(sample_trace_with_assessment, judge1) is not None
        assert trace_to_dspy_example(sample_trace_with_assessment, judge2) is not None
        assert trace_to_dspy_example(sample_trace_with_assessment, judge3) is not None


def test_trace_to_dspy_example_two_human_assessments(trace_with_two_human_assessments, mock_judge):
    dspy = pytest.importorskip("dspy", reason="DSPy not installed")

    trace = trace_with_two_human_assessments
    result = trace_to_dspy_example(trace, mock_judge)

    assert isinstance(result, dspy.Example)
    # Should use the newer assessment with value="pass" and specific rationale
    assert result["result"] == "pass"
    assert result["rationale"] == "Second assessment - should be used (more recent)"


def test_trace_to_dspy_example_human_vs_llm_priority(
    trace_with_human_and_llm_assessments, mock_judge
):
    dspy = pytest.importorskip("dspy", reason="DSPy not installed")

    trace = trace_with_human_and_llm_assessments
    result = trace_to_dspy_example(trace, mock_judge)

    assert isinstance(result, dspy.Example)
    # Should use the HUMAN assessment despite being older
    assert result["result"] == "fail"
    assert result["rationale"] == "Human assessment - should be prioritized"


@pytest.mark.parametrize(
    ("trace_fixture", "required_fields", "expected_inputs"),
    [
        # Test different combinations of required fields
        ("sample_trace_with_assessment", ["inputs"], ["inputs"]),
        ("sample_trace_with_assessment", ["outputs"], ["outputs"]),
        ("sample_trace_with_assessment", ["inputs", "outputs"], ["inputs", "outputs"]),
        (
            "sample_trace_with_assessment",
            ["trace", "inputs", "outputs"],
            ["trace", "inputs", "outputs"],
        ),
        ("trace_with_expectations", ["expectations"], ["expectations"]),
        ("trace_with_expectations", ["inputs", "expectations"], ["inputs", "expectations"]),
        ("trace_with_expectations", ["outputs", "expectations"], ["outputs", "expectations"]),
        (
            "trace_with_expectations",
            ["inputs", "outputs", "expectations"],
            ["inputs", "outputs", "expectations"],
        ),
        (
            "trace_with_expectations",
            ["trace", "inputs", "outputs", "expectations"],
            ["trace", "inputs", "outputs", "expectations"],
        ),
    ],
)
def test_trace_to_dspy_example_success(request, trace_fixture, required_fields, expected_inputs):
    dspy = pytest.importorskip("dspy", reason="DSPy not installed")

    trace = request.getfixturevalue(trace_fixture)

    class TestJudge(MockJudge):
        def __init__(self, fields):
            super().__init__(name="mock_judge")
            self._fields = fields

        def get_input_fields(self):
            return [JudgeField(name=field, description=f"Test {field}") for field in self._fields]

    judge = TestJudge(required_fields)

    # Use real DSPy since we've skipped if it's not available
    result = trace_to_dspy_example(trace, judge)

    assert isinstance(result, dspy.Example)

    # Build expected kwargs based on required fields
    expected_kwargs = {}
    if "trace" in required_fields:
        expected_kwargs["trace"] = trace
    if "inputs" in required_fields:
        expected_kwargs["inputs"] = extract_request_from_trace(trace)
    if "outputs" in required_fields:
        expected_kwargs["outputs"] = extract_response_from_trace(trace)
    if "expectations" in required_fields:
        expected_kwargs["expectations"] = extract_expectations_from_trace(trace)

    # Determine expected rationale based on fixture
    if trace_fixture == "trace_with_expectations":
        expected_rationale = "Meets expectations"
    else:
        expected_rationale = "This looks good"

    # Construct an expected example and assert that the result is the same
    expected_example = dspy.Example(
        result="pass",
        rationale=expected_rationale,
        **expected_kwargs,
    ).with_inputs(*expected_inputs)

    # Compare the examples
    assert result == expected_example


@pytest.mark.parametrize(
    ("trace_fixture", "required_fields"),
    [
        ("sample_trace_with_assessment", ["expectations"]),
        ("sample_trace_with_assessment", ["inputs", "expectations"]),
        ("sample_trace_with_assessment", ["outputs", "expectations"]),
        ("sample_trace_with_assessment", ["inputs", "outputs", "expectations"]),
        ("sample_trace_with_assessment", ["trace", "inputs", "outputs", "expectations"]),
    ],
)
def test_trace_to_dspy_example_missing_required_fields(request, trace_fixture, required_fields):
    trace = request.getfixturevalue(trace_fixture)

    class TestJudge(MockJudge):
        def __init__(self, fields):
            super().__init__(name="mock_judge")
            self._fields = fields

        def get_input_fields(self):
            return [JudgeField(name=field, description=f"Test {field}") for field in self._fields]

    judge = TestJudge(required_fields)

    result = trace_to_dspy_example(trace, judge)
    assert result is None


def test_trace_to_dspy_example_no_assessment(sample_trace_without_assessment, mock_judge):
    # Use the fixture for trace without assessment
    trace = sample_trace_without_assessment

    # This should return None since there's no matching assessment
    result = trace_to_dspy_example(trace, mock_judge)

    assert result is None


def test_create_dspy_signature(mock_judge):
    pytest.importorskip("dspy", reason="DSPy not installed")

    signature = create_dspy_signature(mock_judge)

    assert signature.instructions == mock_judge.instructions

    judge_input_fields = mock_judge.get_input_fields()
    for field in judge_input_fields:
        assert field.name in signature.input_fields
        assert signature.input_fields[field.name].json_schema_extra["desc"] == field.description

    judge_output_fields = mock_judge.get_output_fields()
    for field in judge_output_fields:
        assert field.name in signature.output_fields
        assert signature.output_fields[field.name].json_schema_extra["desc"] == field.description


def test_agreement_metric():
    # Test metric with matching results
    example = Mock()
    example.result = "pass"
    pred = Mock()
    pred.result = "pass"

    assert agreement_metric(example, pred) is True

    # Test metric with different results
    pred.result = "fail"
    assert agreement_metric(example, pred) is False


def test_agreement_metric_error_handling():
    # Test with invalid inputs
    result = agreement_metric(None, None)
    assert result is False


@pytest.mark.parametrize(
    ("mlflow_uri", "expected_litellm_uri"),
    [
        ("openai:/gpt-4", "openai/gpt-4"),
        ("openai:/gpt-3.5-turbo", "openai/gpt-3.5-turbo"),
        ("anthropic:/claude-3", "anthropic/claude-3"),
        ("anthropic:/claude-3.5-sonnet", "anthropic/claude-3.5-sonnet"),
        ("cohere:/command", "cohere/command"),
        ("databricks:/dbrx", "databricks/dbrx"),
    ],
)
def test_convert_mlflow_uri_to_litellm(mlflow_uri, expected_litellm_uri):
    assert convert_mlflow_uri_to_litellm(mlflow_uri) == expected_litellm_uri


@pytest.mark.parametrize(
    "invalid_uri",
    [
        "openai-gpt-4",  # Invalid format (missing colon-slash)
        "",  # Empty string
        None,  # None value
    ],
)
def test_convert_mlflow_uri_to_litellm_invalid(invalid_uri):
    with pytest.raises(MlflowException, match="Failed to convert MLflow URI"):
        convert_mlflow_uri_to_litellm(invalid_uri)


@pytest.mark.parametrize(
    ("litellm_model", "expected_uri"),
    [
        ("openai/gpt-4", "openai:/gpt-4"),
        ("openai/gpt-3.5-turbo", "openai:/gpt-3.5-turbo"),
        ("anthropic/claude-3", "anthropic:/claude-3"),
        ("anthropic/claude-3.5-sonnet", "anthropic:/claude-3.5-sonnet"),
        ("cohere/command", "cohere:/command"),
        ("databricks/dbrx", "databricks:/dbrx"),
    ],
)
def test_convert_litellm_to_mlflow_uri(litellm_model, expected_uri):
    result = convert_litellm_to_mlflow_uri(litellm_model)
    assert result == expected_uri


@pytest.mark.parametrize(
    "invalid_model",
    [
        "openai-gpt-4",  # Missing slash
        "",  # Empty string
        None,  # None value
        "openai/",  # Missing model name
        "/gpt-4",  # Missing provider
        "//",  # Empty provider and model
    ],
)
def test_convert_litellm_to_mlflow_uri_invalid(invalid_model):
    with pytest.raises(MlflowException, match="LiteLLM|empty|None") as exc_info:
        convert_litellm_to_mlflow_uri(invalid_model)

    if invalid_model is None or invalid_model == "":
        assert "cannot be empty or None" in str(exc_info.value)
    elif "/" not in invalid_model:
        assert "Expected format: 'provider/model'" in str(exc_info.value)


@pytest.mark.parametrize(
    "mlflow_uri",
    [
        "openai:/gpt-4",
        "anthropic:/claude-3.5-sonnet",
        "cohere:/command",
        "databricks:/dbrx",
    ],
)
def test_mlflow_to_litellm_uri_round_trip_conversion(mlflow_uri):
    # Convert MLflow -> LiteLLM
    litellm_format = convert_mlflow_uri_to_litellm(mlflow_uri)
    # Convert LiteLLM -> MLflow
    result = convert_litellm_to_mlflow_uri(litellm_format)
    # Should get back the original
    assert result == mlflow_uri, f"Round-trip failed for {mlflow_uri}"


@pytest.mark.parametrize(
    ("model", "expected_type"),
    [
        ("databricks", "AgentEvalLM"),
        ("openai:/gpt-4", "dspy.LM"),
        ("anthropic:/claude-3", "dspy.LM"),
    ],
)
def test_construct_dspy_lm_utility_method(model, expected_type):
    import dspy

    result = construct_dspy_lm(model)

    if expected_type == "AgentEvalLM":
        assert isinstance(result, AgentEvalLM)
    elif expected_type == "dspy.LM":
        assert isinstance(result, dspy.LM)
        # Ensure MLflow URI format is converted (no :/ in the model)
        assert ":/" not in result.model


def test_agent_eval_lm_uses_optimizer_session_name():
    from mlflow.utils import AttrDict

    pytest.importorskip("dspy", reason="DSPy not installed")

    mock_response = AttrDict({"output": "test response", "error_message": None})

    with (
        patch("mlflow.genai.judges.optimizers.dspy_utils.call_chat_completions") as mock_call,
        patch("mlflow.genai.judges.optimizers.dspy_utils.VERSION", "1.0.0"),
    ):
        mock_call.return_value = mock_response

        agent_lm = AgentEvalLM()
        agent_lm.forward(prompt="test prompt")

        # Verify call_chat_completions was called with the optimizer session name
        mock_call.assert_called_once_with(
            user_prompt="test prompt",
            system_prompt=None,
            session_name="mlflow-judge-optimizer-v1.0.0",
            use_case="judge_alignment",
        )
```

--------------------------------------------------------------------------------

---[FILE: test_simba.py]---
Location: mlflow-master/tests/genai/judges/optimizers/test_simba.py

```python
from importlib import reload
from unittest.mock import MagicMock, patch

import pytest

from mlflow.exceptions import MlflowException
from mlflow.genai.judges.optimizers import SIMBAAlignmentOptimizer


def test_dspy_optimize_no_dspy():
    # Since dspy import is now at module level, we need to test this differently
    # The error should be raised when importing the module, not when calling methods

    def _reload_module():
        import mlflow.genai.judges.optimizers.simba as simba_module

        reload(simba_module)

    with patch.dict("sys.modules", {"dspy": None}):
        with pytest.raises(MlflowException, match="DSPy library is required"):
            _reload_module()


def test_full_alignment_workflow(mock_judge, sample_traces_with_assessments):
    mock_simba = MagicMock()
    mock_compiled_program = MagicMock()
    mock_compiled_program.signature = MagicMock()
    mock_compiled_program.signature.instructions = (
        "Optimized instructions with {{inputs}} and {{outputs}}"
    )
    mock_simba.compile.return_value = mock_compiled_program

    with patch("dspy.SIMBA", MagicMock()) as mock_simba_class, patch("dspy.LM", MagicMock()):
        mock_simba_class.return_value = mock_simba
        optimizer = SIMBAAlignmentOptimizer()
        # Mock get_min_traces_required to work with 5 traces from fixture
        with patch.object(SIMBAAlignmentOptimizer, "get_min_traces_required", return_value=5):
            result = optimizer.align(mock_judge, sample_traces_with_assessments)

    # Should return an optimized judge
    assert result is not None
    assert result.model == mock_judge.model
    # The judge instructions should be the raw optimized instructions
    expected_instructions = "Optimized instructions with {{inputs}} and {{outputs}}"
    assert result.instructions == expected_instructions


def test_custom_simba_parameters(mock_judge, sample_traces_with_assessments):
    mock_simba = MagicMock()
    mock_compiled_program = MagicMock()
    mock_compiled_program.signature = MagicMock()
    mock_compiled_program.signature.instructions = (
        "Optimized instructions with {{inputs}} and {{outputs}}"
    )
    mock_simba.compile.return_value = mock_compiled_program

    def custom_metric(example, pred, trace=None):
        return True

    custom_batch_size = 15
    with patch("dspy.SIMBA") as mock_simba_class, patch("dspy.LM", MagicMock()):
        mock_simba_class.return_value = mock_simba
        optimizer = SIMBAAlignmentOptimizer(
            batch_size=custom_batch_size,
            seed=123,
            simba_kwargs={
                "metric": custom_metric,
                "max_demos": 5,
                "num_threads": 2,
                "max_steps": 10,
            },
        )
        with patch.object(SIMBAAlignmentOptimizer, "get_min_traces_required", return_value=5):
            optimizer.align(mock_judge, sample_traces_with_assessments)

        # Verify SIMBA was initialized with custom parameters
        mock_simba_class.assert_called_once()
        call_kwargs = mock_simba_class.call_args.kwargs
        assert call_kwargs["bsize"] == custom_batch_size
        assert call_kwargs["metric"] == custom_metric
        assert call_kwargs["max_demos"] == 5
        assert call_kwargs["num_threads"] == 2
        assert call_kwargs["max_steps"] == 10

        # Verify seed is passed to compile
        mock_simba.compile.assert_called_once()
        compile_kwargs = mock_simba.compile.call_args.kwargs
        assert compile_kwargs["seed"] == 123


def test_default_parameters_not_passed(mock_judge, sample_traces_with_assessments):
    mock_simba = MagicMock()
    mock_compiled_program = MagicMock()
    mock_compiled_program.signature = MagicMock()
    mock_compiled_program.signature.instructions = (
        "Optimized instructions with {{inputs}} and {{outputs}}"
    )
    mock_simba.compile.return_value = mock_compiled_program

    with patch("dspy.SIMBA") as mock_simba_class, patch("dspy.LM", MagicMock()):
        mock_simba_class.return_value = mock_simba
        optimizer = SIMBAAlignmentOptimizer()
        with patch.object(SIMBAAlignmentOptimizer, "get_min_traces_required", return_value=5):
            optimizer.align(mock_judge, sample_traces_with_assessments)

        # Verify only required parameters are passed
        mock_simba_class.assert_called_once()
        call_kwargs = mock_simba_class.call_args.kwargs
        assert "metric" in call_kwargs
        assert "bsize" in call_kwargs
        assert len(call_kwargs) == 2
```

--------------------------------------------------------------------------------

---[FILE: test_formatting_utils.py]---
Location: mlflow-master/tests/genai/judges/utils/test_formatting_utils.py

```python
import pytest

from mlflow.genai.judges.utils.formatting_utils import format_available_tools, format_tools_called
from mlflow.genai.utils.type import FunctionCall
from mlflow.types.chat import (
    ChatTool,
    FunctionParams,
    FunctionToolDefinition,
    ParamProperty,
)


@pytest.mark.parametrize(
    ("tools", "expected"),
    [
        pytest.param(
            [
                ChatTool(
                    type="function",
                    function=FunctionToolDefinition(
                        name="get_weather",
                        description="Get current weather for a location",
                    ),
                )
            ],
            "- get_weather: Get current weather for a location",
            id="basic",
        ),
        pytest.param(
            [
                ChatTool(
                    type="function",
                    function=FunctionToolDefinition(
                        name="search",
                        description="Search for information",
                        parameters=FunctionParams(
                            properties={
                                "query": ParamProperty(
                                    type="string", description="The search query"
                                ),
                                "max_results": ParamProperty(
                                    type="integer", description="Maximum number of results"
                                ),
                            },
                            required=["query"],
                        ),
                    ),
                )
            ],
            (
                "- search: Search for information\n"
                "    - query (required): string - The search query\n"
                "    - max_results (optional): integer - Maximum number of results"
            ),
            id="with_parameters",
        ),
        pytest.param(
            [
                ChatTool(
                    type="function",
                    function=FunctionToolDefinition(name="tool1", description="First tool"),
                ),
                ChatTool(
                    type="function",
                    function=FunctionToolDefinition(name="tool2", description="Second tool"),
                ),
            ],
            "- tool1: First tool\n\n- tool2: Second tool",
            id="multiple",
        ),
        pytest.param(
            [],
            "No tools available",
            id="empty",
        ),
        pytest.param(
            [
                ChatTool(type="function", function=None),
                ChatTool(
                    type="function",
                    function=FunctionToolDefinition(name="valid_tool", description="Valid tool"),
                ),
            ],
            "- valid_tool: Valid tool",
            id="missing_function",
        ),
        pytest.param(
            [
                ChatTool(
                    type="function",
                    function=FunctionToolDefinition(
                        name="calc",
                        parameters=FunctionParams(
                            properties={
                                "x": ParamProperty(type="number"),
                                "y": ParamProperty(type="number"),
                            },
                            required=["x", "y"],
                        ),
                    ),
                )
            ],
            "- calc\n    - x (required): number\n    - y (required): number",
            id="parameter_without_description",
        ),
    ],
)
def test_format_available_tools(tools, expected):
    result = format_available_tools(tools)
    assert result == expected


@pytest.mark.parametrize(
    ("tools_called", "expected"),
    [
        pytest.param(
            [
                FunctionCall(
                    name="get_weather",
                    arguments={"city": "Paris"},
                    outputs="Sunny, 22°C",
                )
            ],
            (
                "Tool Call 1: get_weather\n"
                "  Input Arguments: {'city': 'Paris'}\n"
                "  Output: Sunny, 22°C"
            ),
            id="basic",
        ),
        pytest.param(
            [
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
            (
                "Tool Call 1: search\n"
                "  Input Arguments: {'query': 'capital of France'}\n"
                "  Output: Paris\n"
                "\n"
                "Tool Call 2: translate\n"
                "  Input Arguments: {'text': 'Paris', 'target': 'es'}\n"
                "  Output: París"
            ),
            id="multiple",
        ),
        pytest.param(
            [
                FunctionCall(
                    name="get_weather",
                    arguments={"city": "InvalidCity"},
                    outputs=None,
                    exception="ValueError: City not found",
                )
            ],
            (
                "Tool Call 1: get_weather\n"
                "  Input Arguments: {'city': 'InvalidCity'}\n"
                "  Output: (no output)\n"
                "  Exception: ValueError: City not found"
            ),
            id="with_exception",
        ),
        pytest.param(
            [
                FunctionCall(
                    name="stream_data",
                    arguments={"source": "api"},
                    outputs={"items": [1, 2]},
                    exception="TimeoutError: Connection lost",
                )
            ],
            (
                "Tool Call 1: stream_data\n"
                "  Input Arguments: {'source': 'api'}\n"
                "  Output: {'items': [1, 2]}\n"
                "  Exception: TimeoutError: Connection lost"
            ),
            id="with_partial_output_and_exception",
        ),
        pytest.param(
            [
                FunctionCall(
                    name="send_notification",
                    arguments={"message": "Hello"},
                    outputs=None,
                )
            ],
            (
                "Tool Call 1: send_notification\n"
                "  Input Arguments: {'message': 'Hello'}\n"
                "  Output: (no output)"
            ),
            id="no_output",
        ),
        pytest.param(
            [],
            "No tools called",
            id="empty",
        ),
        pytest.param(
            [
                FunctionCall(
                    name="get_time",
                    arguments=None,
                    outputs="12:00 PM",
                )
            ],
            "Tool Call 1: get_time\n  Input Arguments: {}\n  Output: 12:00 PM",
            id="empty_arguments",
        ),
    ],
)
def test_format_tools_called(tools_called, expected):
    result = format_tools_called(tools_called)
    assert result == expected
```

--------------------------------------------------------------------------------

````
