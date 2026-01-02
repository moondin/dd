---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 769
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 769 of 991)

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

---[FILE: test_genai_eval_utils.py]---
Location: mlflow-master/tests/cli/test_genai_eval_utils.py

```python
from unittest import mock

import click
import pandas as pd
import pytest

from mlflow.cli.genai_eval_utils import (
    NA_VALUE,
    Assessment,
    EvalResult,
    extract_assessments_from_results,
    format_table_output,
    resolve_scorers,
)
from mlflow.exceptions import MlflowException
from mlflow.tracing.constant import AssessmentMetadataKey


def test_format_single_trace_with_result_and_rationale():
    output_data = [
        EvalResult(
            trace_id="tr-123",
            assessments=[
                Assessment(
                    name="RelevanceToQuery",
                    result="yes",
                    rationale="The answer is relevant",
                )
            ],
        )
    ]

    table_output = format_table_output(output_data)

    # Headers should use assessment names from output_data
    assert table_output.headers == ["trace_id", "RelevanceToQuery"]
    assert len(table_output.rows) == 1
    assert table_output.rows[0][0].value == "tr-123"
    assert "value: yes" in table_output.rows[0][1].value
    assert "rationale: The answer is relevant" in table_output.rows[0][1].value


def test_format_multiple_traces_multiple_scorers():
    output_data = [
        EvalResult(
            trace_id="tr-123",
            assessments=[
                Assessment(
                    name="RelevanceToQuery",
                    result="yes",
                    rationale="Relevant",
                ),
                Assessment(name="Safety", result="yes", rationale="Safe"),
            ],
        ),
        EvalResult(
            trace_id="tr-456",
            assessments=[
                Assessment(
                    name="RelevanceToQuery",
                    result="no",
                    rationale="Not relevant",
                ),
                Assessment(name="Safety", result="yes", rationale="Safe"),
            ],
        ),
    ]

    table_output = format_table_output(output_data)

    # Assessment names should be sorted
    assert table_output.headers == ["trace_id", "RelevanceToQuery", "Safety"]
    assert len(table_output.rows) == 2
    assert table_output.rows[0][0].value == "tr-123"
    assert table_output.rows[1][0].value == "tr-456"
    assert "value: yes" in table_output.rows[0][1].value
    assert "value: no" in table_output.rows[1][1].value


def test_format_long_rationale_not_truncated():
    long_rationale = "x" * 150
    output_data = [
        EvalResult(
            trace_id="tr-123",
            assessments=[
                Assessment(
                    name="RelevanceToQuery",
                    result="yes",
                    rationale=long_rationale,
                )
            ],
        )
    ]

    table_output = format_table_output(output_data)

    assert long_rationale in table_output.rows[0][1].value
    assert len(table_output.rows[0][1].value) >= len(long_rationale)


def test_format_error_message_formatting():
    output_data = [
        EvalResult(
            trace_id="tr-123",
            assessments=[
                Assessment(
                    name="RelevanceToQuery",
                    result=None,
                    rationale=None,
                    error="OpenAI API error",
                )
            ],
        )
    ]

    table_output = format_table_output(output_data)

    assert table_output.rows[0][1].value == "error: OpenAI API error"


def test_format_na_for_missing_results():
    output_data = [
        EvalResult(
            trace_id="tr-123",
            assessments=[
                Assessment(
                    name="RelevanceToQuery",
                    result=None,
                    rationale=None,
                )
            ],
        )
    ]

    table_output = format_table_output(output_data)

    assert table_output.rows[0][1].value == NA_VALUE


def test_format_result_only_without_rationale():
    output_data = [
        EvalResult(
            trace_id="tr-123",
            assessments=[
                Assessment(
                    name="RelevanceToQuery",
                    result="yes",
                    rationale=None,
                )
            ],
        )
    ]

    table_output = format_table_output(output_data)

    assert table_output.rows[0][1].value == "value: yes"


def test_format_rationale_only_without_result():
    output_data = [
        EvalResult(
            trace_id="tr-123",
            assessments=[
                Assessment(
                    name="RelevanceToQuery",
                    result=None,
                    rationale="Some reasoning",
                )
            ],
        )
    ]

    table_output = format_table_output(output_data)

    assert table_output.rows[0][1].value == "rationale: Some reasoning"


def test_format_with_different_assessment_names():
    # This test demonstrates that assessment names (e.g., "relevance_to_query")
    # are used in headers, not scorer class names (e.g., "RelevanceToQuery")
    output_data = [
        EvalResult(
            trace_id="tr-123",
            assessments=[
                Assessment(
                    name="relevance_to_query",  # Different from scorer name
                    result="yes",
                    rationale="The answer is relevant",
                ),
                Assessment(
                    name="safety_check",  # Different from scorer name
                    result="safe",
                    rationale="Content is safe",
                ),
            ],
        )
    ]

    table_output = format_table_output(output_data)

    # Headers should use actual assessment names from output_data (sorted)
    assert table_output.headers == ["trace_id", "relevance_to_query", "safety_check"]
    assert len(table_output.rows) == 1
    assert table_output.rows[0][0].value == "tr-123"
    assert "value: yes" in table_output.rows[0][1].value
    assert "value: safe" in table_output.rows[0][2].value


# Tests for resolve_scorers function


def test_resolve_builtin_scorer():
    # Test with real built-in scorer names
    scorers = resolve_scorers(["Correctness"], "experiment_123")

    assert len(scorers) == 1
    assert scorers[0].__class__.__name__ == "Correctness"


def test_resolve_builtin_scorer_snake_case():
    # Test with snake_case name
    scorers = resolve_scorers(["correctness"], "experiment_123")

    assert len(scorers) == 1
    assert scorers[0].__class__.__name__ == "Correctness"


def test_resolve_registered_scorer():
    mock_registered = mock.Mock()

    with (
        mock.patch(
            "mlflow.cli.genai_eval_utils.get_all_scorers", return_value=[]
        ) as mock_get_all_scorers,
        mock.patch(
            "mlflow.cli.genai_eval_utils.get_scorer", return_value=mock_registered
        ) as mock_get_scorer,
    ):
        scorers = resolve_scorers(["CustomScorer"], "experiment_123")

        assert len(scorers) == 1
        assert scorers[0] == mock_registered
        # Verify mocks were called as expected
        mock_get_all_scorers.assert_called_once()
        mock_get_scorer.assert_called_once_with(name="CustomScorer", experiment_id="experiment_123")


def test_resolve_mixed_scorers():
    # Setup built-in scorer
    mock_builtin = mock.Mock()
    mock_builtin.__class__.__name__ = "Safety"
    mock_builtin.name = None

    # Setup registered scorer
    mock_registered = mock.Mock()

    with (
        mock.patch(
            "mlflow.cli.genai_eval_utils.get_all_scorers", return_value=[mock_builtin]
        ) as mock_get_all_scorers,
        mock.patch(
            "mlflow.cli.genai_eval_utils.get_scorer", return_value=mock_registered
        ) as mock_get_scorer,
    ):
        scorers = resolve_scorers(["Safety", "CustomScorer"], "experiment_123")

        assert len(scorers) == 2
        assert scorers[0] == mock_builtin
        assert scorers[1] == mock_registered
        # Verify mocks were called as expected
        mock_get_all_scorers.assert_called_once()
        mock_get_scorer.assert_called_once_with(name="CustomScorer", experiment_id="experiment_123")


def test_resolve_scorer_not_found_raises_error():
    with (
        mock.patch(
            "mlflow.cli.genai_eval_utils.get_all_scorers", return_value=[]
        ) as mock_get_all_scorers,
        mock.patch(
            "mlflow.cli.genai_eval_utils.get_scorer",
            side_effect=MlflowException("Not found"),
        ) as mock_get_scorer,
    ):
        with pytest.raises(click.UsageError, match="Could not identify Scorer 'UnknownScorer'"):
            resolve_scorers(["UnknownScorer"], "experiment_123")

        # Verify mocks were called as expected
        mock_get_all_scorers.assert_called_once()
        mock_get_scorer.assert_called_once_with(
            name="UnknownScorer", experiment_id="experiment_123"
        )


def test_resolve_empty_scorers_raises_error():
    with pytest.raises(click.UsageError, match="No valid scorers"):
        resolve_scorers([], "experiment_123")


# Tests for extract_assessments_from_results function


def test_extract_with_matching_run_id():
    results_df = pd.DataFrame(
        [
            {
                "trace_id": "tr-abc123",
                "assessments": [
                    {
                        "assessment_name": "RelevanceToQuery",
                        "feedback": {"value": "yes"},
                        "rationale": "The answer is relevant",
                        "metadata": {AssessmentMetadataKey.SOURCE_RUN_ID: "run-123"},
                    }
                ],
            }
        ]
    )

    result = extract_assessments_from_results(results_df, "run-123")

    expected = [
        EvalResult(
            trace_id="tr-abc123",
            assessments=[
                Assessment(
                    name="RelevanceToQuery",
                    result="yes",
                    rationale="The answer is relevant",
                )
            ],
        )
    ]
    assert result == expected


def test_extract_with_different_assessment_name():
    results_df = pd.DataFrame(
        [
            {
                "trace_id": "tr-abc123",
                "assessments": [
                    {
                        "assessment_name": "relevance_to_query",
                        "feedback": {"value": "yes"},
                        "rationale": "Relevant answer",
                        "metadata": {AssessmentMetadataKey.SOURCE_RUN_ID: "run-123"},
                    }
                ],
            }
        ]
    )

    result = extract_assessments_from_results(results_df, "run-123")

    expected = [
        EvalResult(
            trace_id="tr-abc123",
            assessments=[
                Assessment(
                    name="relevance_to_query",
                    result="yes",
                    rationale="Relevant answer",
                )
            ],
        )
    ]
    assert result == expected


def test_extract_filter_out_assessments_with_different_run_id():
    results_df = pd.DataFrame(
        [
            {
                "trace_id": "tr-abc123",
                "assessments": [
                    {
                        "assessment_name": "RelevanceToQuery",
                        "feedback": {"value": "yes"},
                        "rationale": "Current evaluation",
                        "metadata": {AssessmentMetadataKey.SOURCE_RUN_ID: "run-123"},
                    },
                    {
                        "assessment_name": "Safety",
                        "feedback": {"value": "yes"},
                        "rationale": "Old evaluation",
                        "metadata": {AssessmentMetadataKey.SOURCE_RUN_ID: "run-456"},
                    },
                ],
            }
        ]
    )

    result = extract_assessments_from_results(results_df, "run-123")

    expected = [
        EvalResult(
            trace_id="tr-abc123",
            assessments=[
                Assessment(
                    name="RelevanceToQuery",
                    result="yes",
                    rationale="Current evaluation",
                )
            ],
        )
    ]
    assert result == expected


def test_extract_no_assessments_for_run_id():
    results_df = pd.DataFrame(
        [
            {
                "trace_id": "tr-abc123",
                "assessments": [
                    {
                        "assessment_name": "RelevanceToQuery",
                        "metadata": {AssessmentMetadataKey.SOURCE_RUN_ID: "run-456"},
                    }
                ],
            }
        ]
    )

    result = extract_assessments_from_results(results_df, "run-123")

    assert len(result) == 1
    assert len(result[0].assessments) == 1
    assert result[0].assessments[0].result is None
    assert result[0].assessments[0].rationale is None
    assert result[0].assessments[0].error is not None


def test_extract_multiple_assessments_from_same_run():
    results_df = pd.DataFrame(
        [
            {
                "trace_id": "tr-abc123",
                "assessments": [
                    {
                        "assessment_name": "RelevanceToQuery",
                        "feedback": {"value": "yes"},
                        "rationale": "Relevant",
                        "metadata": {AssessmentMetadataKey.SOURCE_RUN_ID: "run-123"},
                    },
                    {
                        "assessment_name": "Safety",
                        "feedback": {"value": "yes"},
                        "rationale": "Safe",
                        "metadata": {AssessmentMetadataKey.SOURCE_RUN_ID: "run-123"},
                    },
                ],
            }
        ]
    )

    result = extract_assessments_from_results(results_df, "run-123")

    expected = [
        EvalResult(
            trace_id="tr-abc123",
            assessments=[
                Assessment(
                    name="RelevanceToQuery",
                    result="yes",
                    rationale="Relevant",
                ),
                Assessment(
                    name="Safety",
                    result="yes",
                    rationale="Safe",
                ),
            ],
        )
    ]
    assert result == expected


def test_extract_no_assessments_on_trace_shows_error():
    results_df = pd.DataFrame([{"trace_id": "tr-abc123", "assessments": []}])

    result = extract_assessments_from_results(results_df, "run-123")

    assert len(result) == 1
    assert len(result[0].assessments) == 1
    assert result[0].assessments[0].error == "No assessments found on trace"
```

--------------------------------------------------------------------------------

---[FILE: test_scorers.py]---
Location: mlflow-master/tests/cli/test_scorers.py

```python
import json
from typing import Any
from unittest.mock import patch

import pytest
from click.testing import CliRunner

import mlflow
from mlflow.cli.scorers import commands
from mlflow.exceptions import MlflowException
from mlflow.genai.scorers import get_all_scorers, list_scorers, scorer
from mlflow.utils.string_utils import _create_table


@pytest.fixture
def mock_databricks_environment():
    with (
        patch("mlflow.genai.scorers.base.is_databricks_uri", return_value=True),
        patch("mlflow.genai.scorers.base.is_in_databricks_runtime", return_value=True),
    ):
        yield


@pytest.fixture
def runner():
    return CliRunner(catch_exceptions=False)


@pytest.fixture
def experiment():
    """Create a test experiment."""
    experiment_id = mlflow.create_experiment(
        f"test_scorers_cli_{mlflow.utils.time.get_current_time_millis()}"
    )
    yield experiment_id
    mlflow.delete_experiment(experiment_id)


@pytest.fixture
def correctness_scorer():
    """Create a correctness scorer."""

    @scorer
    def _correctness_scorer(outputs) -> bool:
        return len(outputs) > 0

    return _correctness_scorer


@pytest.fixture
def safety_scorer():
    """Create a safety scorer."""

    @scorer
    def _safety_scorer(outputs) -> bool:
        return len(outputs) > 0

    return _safety_scorer


@pytest.fixture
def relevance_scorer():
    """Create a relevance scorer."""

    @scorer
    def _relevance_scorer(outputs) -> bool:
        return len(outputs) > 0

    return _relevance_scorer


@pytest.fixture
def generic_scorer():
    """Create a generic test scorer."""

    @scorer
    def _generic_scorer(outputs) -> bool:
        return True

    return _generic_scorer


def test_commands_group_exists():
    assert commands.name == "scorers"
    assert commands.help is not None


def test_list_command_params():
    list_cmd = next((cmd for cmd in commands.commands.values() if cmd.name == "list"), None)
    assert list_cmd is not None
    param_names = {p.name for p in list_cmd.params}
    assert param_names == {"experiment_id", "builtin", "output"}


def test_list_scorers_table_output(
    runner: CliRunner,
    experiment: str,
    correctness_scorer: Any,
    safety_scorer: Any,
    relevance_scorer: Any,
    mock_databricks_environment: Any,
):
    correctness_scorer.register(experiment_id=experiment, name="Correctness")
    safety_scorer.register(experiment_id=experiment, name="Safety")
    relevance_scorer.register(experiment_id=experiment, name="RelevanceToQuery")

    result = runner.invoke(commands, ["list", "--experiment-id", experiment])

    assert result.exit_code == 0

    # Construct expected table output (scorers are returned in alphabetical order)
    # Note: click.echo() adds a trailing newline
    expected_table = (
        _create_table(
            [["Correctness", ""], ["RelevanceToQuery", ""], ["Safety", ""]],
            headers=["Scorer Name", "Description"],
        )
        + "\n"
    )
    assert result.output == expected_table


def test_list_scorers_json_output(
    runner: CliRunner,
    experiment: str,
    correctness_scorer: Any,
    safety_scorer: Any,
    relevance_scorer: Any,
    mock_databricks_environment: Any,
):
    correctness_scorer.register(experiment_id=experiment, name="Correctness")
    safety_scorer.register(experiment_id=experiment, name="Safety")
    relevance_scorer.register(experiment_id=experiment, name="RelevanceToQuery")

    result = runner.invoke(commands, ["list", "--experiment-id", experiment, "--output", "json"])

    assert result.exit_code == 0
    output_json = json.loads(result.output)
    expected_scorers = [
        {"name": "Correctness", "description": None},
        {"name": "RelevanceToQuery", "description": None},
        {"name": "Safety", "description": None},
    ]
    assert output_json["scorers"] == expected_scorers


@pytest.mark.parametrize(
    ("output_format", "expected_output"),
    [
        ("table", ""),
        ("json", {"scorers": []}),
    ],
)
def test_list_scorers_empty_experiment(
    runner: CliRunner, experiment: str, output_format: str, expected_output: Any
):
    args = ["list", "--experiment-id", experiment]
    if output_format == "json":
        args.extend(["--output", "json"])

    result = runner.invoke(commands, args)
    assert result.exit_code == 0

    if output_format == "json":
        output_json = json.loads(result.output)
        assert output_json == expected_output
    else:
        # Empty table produces minimal output
        assert result.output.strip() == expected_output


def test_list_scorers_with_experiment_id_env_var(
    runner: CliRunner, experiment: str, correctness_scorer: Any, mock_databricks_environment: Any
):
    correctness_scorer.register(experiment_id=experiment, name="Correctness")

    result = runner.invoke(commands, ["list"], env={"MLFLOW_EXPERIMENT_ID": experiment})

    assert result.exit_code == 0
    assert "Correctness" in result.output


def test_list_scorers_missing_experiment_id(runner: CliRunner):
    result = runner.invoke(commands, ["list"])

    assert result.exit_code != 0
    assert "experiment-id" in result.output.lower() or "experiment_id" in result.output.lower()


def test_list_scorers_invalid_output_format(runner: CliRunner, experiment: str):
    result = runner.invoke(commands, ["list", "--experiment-id", experiment, "--output", "invalid"])

    assert result.exit_code != 0
    assert "invalid" in result.output.lower() or "choice" in result.output.lower()


def test_list_scorers_special_characters_in_names(
    runner: CliRunner, experiment: str, generic_scorer: Any, mock_databricks_environment: Any
):
    generic_scorer.register(experiment_id=experiment, name="Scorer With Spaces")
    generic_scorer.register(experiment_id=experiment, name="Scorer.With.Dots")
    generic_scorer.register(experiment_id=experiment, name="Scorer-With-Dashes")
    generic_scorer.register(experiment_id=experiment, name="Scorer_With_Underscores")

    result = runner.invoke(commands, ["list", "--experiment-id", experiment])

    assert result.exit_code == 0
    assert "Scorer With Spaces" in result.output
    assert "Scorer.With.Dots" in result.output
    assert "Scorer-With-Dashes" in result.output
    assert "Scorer_With_Underscores" in result.output


@pytest.mark.parametrize(
    "output_format",
    ["table", "json"],
)
def test_list_scorers_single_scorer(
    runner: CliRunner,
    experiment: str,
    generic_scorer: Any,
    output_format: str,
    mock_databricks_environment: Any,
):
    generic_scorer.register(experiment_id=experiment, name="OnlyScorer")

    args = ["list", "--experiment-id", experiment]
    if output_format == "json":
        args.extend(["--output", "json"])

    result = runner.invoke(commands, args)
    assert result.exit_code == 0

    if output_format == "json":
        output_json = json.loads(result.output)
        assert output_json == {"scorers": [{"name": "OnlyScorer", "description": None}]}
    else:
        assert "OnlyScorer" in result.output


@pytest.mark.parametrize(
    "output_format",
    ["table", "json"],
)
def test_list_scorers_long_names(
    runner: CliRunner,
    experiment: str,
    generic_scorer: Any,
    output_format: str,
    mock_databricks_environment: Any,
):
    long_name = "VeryLongScorerNameThatShouldNotBeTruncatedEvenIfItIsReallyReallyLong"
    generic_scorer.register(experiment_id=experiment, name=long_name)

    args = ["list", "--experiment-id", experiment]
    if output_format == "json":
        args.extend(["--output", "json"])

    result = runner.invoke(commands, args)
    assert result.exit_code == 0

    if output_format == "json":
        output_json = json.loads(result.output)
        assert output_json == {"scorers": [{"name": long_name, "description": None}]}
    else:
        # Full name should be present
        assert long_name in result.output


def test_list_scorers_with_descriptions(runner: CliRunner, experiment: str):
    from mlflow.genai.judges import make_judge

    judge1 = make_judge(
        name="quality_judge",
        instructions="Evaluate {{ outputs }}",
        description="Evaluates response quality",
        feedback_value_type=str,
    )
    judge1.register(experiment_id=experiment)

    judge2 = make_judge(
        name="safety_judge",
        instructions="Check {{ outputs }}",
        description="Checks for safety issues",
        feedback_value_type=str,
    )
    judge2.register(experiment_id=experiment)

    judge3 = make_judge(
        name="no_desc_judge",
        instructions="Evaluate {{ outputs }}",
        feedback_value_type=str,
    )
    judge3.register(experiment_id=experiment)

    result_json = runner.invoke(
        commands, ["list", "--experiment-id", experiment, "--output", "json"]
    )
    assert result_json.exit_code == 0
    output_json = json.loads(result_json.output)

    assert len(output_json["scorers"]) == 3
    scorers_by_name = {s["name"]: s for s in output_json["scorers"]}

    assert scorers_by_name["no_desc_judge"]["description"] is None
    assert scorers_by_name["quality_judge"]["description"] == "Evaluates response quality"
    assert scorers_by_name["safety_judge"]["description"] == "Checks for safety issues"

    result_table = runner.invoke(commands, ["list", "--experiment-id", experiment])
    assert result_table.exit_code == 0
    assert "Evaluates response quality" in result_table.output
    assert "Checks for safety issues" in result_table.output


def test_create_judge_basic(runner: CliRunner, experiment: str):
    result = runner.invoke(
        commands,
        [
            "register-llm-judge",
            "--name",
            "test_judge",
            "--instructions",
            "Evaluate {{ outputs }}",
            "--experiment-id",
            experiment,
        ],
    )

    assert result.exit_code == 0
    assert "Successfully created and registered judge scorer 'test_judge'" in result.output
    assert experiment in result.output

    # Verify judge was registered
    scorers = list_scorers(experiment_id=experiment)
    scorer_names = [s.name for s in scorers]
    assert "test_judge" in scorer_names


def test_create_judge_with_model(runner: CliRunner, experiment: str):
    result = runner.invoke(
        commands,
        [
            "register-llm-judge",
            "--name",
            "custom_model_judge",
            "--instructions",
            "Check {{ inputs }} and {{ outputs }}",
            "--model",
            "openai:/gpt-4",
            "--experiment-id",
            experiment,
        ],
    )

    assert result.exit_code == 0
    assert "Successfully created and registered" in result.output

    # Verify judge was registered with correct model
    scorers = list_scorers(experiment_id=experiment)
    scorer_names = [s.name for s in scorers]
    assert "custom_model_judge" in scorer_names

    # Get the judge and verify it uses the specified model
    judge = next(s for s in scorers if s.name == "custom_model_judge")
    assert judge.model == "openai:/gpt-4"


def test_create_judge_short_options(runner: CliRunner, experiment: str):
    result = runner.invoke(
        commands,
        [
            "register-llm-judge",
            "-n",
            "short_options_judge",
            "-i",
            "Evaluate {{ outputs }}",
            "-x",
            experiment,
        ],
    )

    assert result.exit_code == 0
    assert "Successfully created and registered" in result.output

    # Verify judge was registered
    scorers = list_scorers(experiment_id=experiment)
    scorer_names = [s.name for s in scorers]
    assert "short_options_judge" in scorer_names


def test_create_judge_with_env_var(runner: CliRunner, experiment: str):
    result = runner.invoke(
        commands,
        [
            "register-llm-judge",
            "--name",
            "env_var_judge",
            "--instructions",
            "Check {{ outputs }}",
        ],
        env={"MLFLOW_EXPERIMENT_ID": experiment},
    )

    assert result.exit_code == 0
    assert "Successfully created and registered" in result.output

    # Verify judge was registered
    scorers = list_scorers(experiment_id=experiment)
    scorer_names = [s.name for s in scorers]
    assert "env_var_judge" in scorer_names


@pytest.mark.parametrize(
    ("args", "missing_param"),
    [
        (["--instructions", "test", "--experiment-id", "123"], "name"),
        (["--name", "test", "--experiment-id", "123"], "instructions"),
        (["--name", "test", "--instructions", "test"], "experiment-id"),
    ],
)
def test_create_judge_missing_required_params(
    runner: CliRunner, args: list[str], missing_param: str
):
    result = runner.invoke(commands, ["register-llm-judge"] + args)

    assert result.exit_code != 0
    # Click typically shows "Missing option" for required parameters
    assert "missing" in result.output.lower() or "required" in result.output.lower()


def test_create_judge_invalid_prompt(runner: CliRunner, experiment: str):
    # Should raise MlflowException because make_judge validates that instructions
    # contain at least one variable
    with pytest.raises(MlflowException, match="[Tt]emplate.*variable"):
        runner.invoke(
            commands,
            [
                "register-llm-judge",
                "--name",
                "invalid_judge",
                "--instructions",
                "This has no template variables",
                "--experiment-id",
                experiment,
            ],
        )


def test_create_judge_special_characters_in_name(runner: CliRunner, experiment: str):
    # Verify experiment has no judges initially
    scorers = list_scorers(experiment_id=experiment)
    assert len(scorers) == 0

    result = runner.invoke(
        commands,
        [
            "register-llm-judge",
            "--name",
            "judge-with_special.chars",
            "--instructions",
            "Evaluate {{ outputs }}",
            "--experiment-id",
            experiment,
        ],
    )

    assert result.exit_code == 0
    assert "Successfully created and registered" in result.output

    # Verify experiment has exactly one judge
    scorers = list_scorers(experiment_id=experiment)
    assert len(scorers) == 1
    assert scorers[0].name == "judge-with_special.chars"


def test_create_judge_duplicate_registration(runner: CliRunner, experiment: str):
    # Create a judge
    result1 = runner.invoke(
        commands,
        [
            "register-llm-judge",
            "--name",
            "duplicate_judge",
            "--instructions",
            "Evaluate {{ outputs }}",
            "--experiment-id",
            experiment,
        ],
    )
    assert result1.exit_code == 0

    scorers = list_scorers(experiment_id=experiment)
    assert len(scorers) == 1
    assert scorers[0].name == "duplicate_judge"

    # Register the same judge again with same name - should succeed (replaces the old one)
    result2 = runner.invoke(
        commands,
        [
            "register-llm-judge",
            "--name",
            "duplicate_judge",
            "--instructions",
            "Evaluate {{ outputs }}",
            "--experiment-id",
            experiment,
        ],
    )
    assert result2.exit_code == 0

    # Verify there is still only one judge (the new one replaced the old one)
    scorers = list_scorers(experiment_id=experiment)
    assert len(scorers) == 1
    assert scorers[0].name == "duplicate_judge"


def test_create_judge_with_description(runner: CliRunner, experiment: str):
    description = "Evaluates response quality and relevance"
    result = runner.invoke(
        commands,
        [
            "register-llm-judge",
            "--name",
            "judge_with_desc",
            "--instructions",
            "Evaluate {{ outputs }}",
            "--description",
            description,
            "--experiment-id",
            experiment,
        ],
    )

    assert result.exit_code == 0
    assert "Successfully created and registered" in result.output

    scorers = list_scorers(experiment_id=experiment)
    assert len(scorers) == 1
    judge = scorers[0]
    assert judge.name == "judge_with_desc"
    assert judge.description == description


def test_create_judge_with_description_short_flag(runner: CliRunner, experiment: str):
    description = "Checks for PII in outputs"
    result = runner.invoke(
        commands,
        [
            "register-llm-judge",
            "-n",
            "pii_judge",
            "-i",
            "Check {{ outputs }}",
            "-d",
            description,
            "-x",
            experiment,
        ],
    )

    assert result.exit_code == 0

    scorers = list_scorers(experiment_id=experiment)
    judge = next(s for s in scorers if s.name == "pii_judge")
    assert judge.description == description


@pytest.mark.parametrize("output_format", ["table", "json"])
def test_list_builtin_scorers_output_formats(runner, output_format):
    args = ["list", "--builtin"]
    if output_format == "json":
        args.extend(["--output", "json"])

    result = runner.invoke(commands, args)
    assert result.exit_code == 0

    if output_format == "json":
        data = json.loads(result.output)
        assert "scorers" in data
        assert isinstance(data["scorers"], list)
        assert len(data["scorers"]) > 0

        # Verify each scorer has required fields
        for scorer_item in data["scorers"]:
            assert "name" in scorer_item
            assert "description" in scorer_item

        # Verify some builtin scorer names appear
        scorer_names = [s["name"] for s in data["scorers"]]
        assert "correctness" in scorer_names
        assert "relevance_to_query" in scorer_names
        assert "completeness" in scorer_names
    else:
        # Verify table headers
        assert "Scorer Name" in result.output
        assert "Description" in result.output

        # Verify some builtin scorer names appear
        assert "correctness" in result.output
        assert "relevance_to_query" in result.output
        assert "completeness" in result.output


def test_list_builtin_scorers_short_flag(runner):
    result = runner.invoke(commands, ["list", "-b"])
    assert result.exit_code == 0
    assert "Scorer Name" in result.output


def test_list_builtin_scorers_shows_all_available_scorers(runner):
    result = runner.invoke(commands, ["list", "--builtin", "--output", "json"])
    assert result.exit_code == 0

    expected_scorers = get_all_scorers()
    expected_names = {scorer.name for scorer in expected_scorers}

    data = json.loads(result.output)
    actual_names = {s["name"] for s in data["scorers"]}

    assert actual_names == expected_names


def test_list_scorers_mutually_exclusive_flags(runner, experiment):
    result = runner.invoke(commands, ["list", "--builtin", "--experiment-id", experiment])
    assert result.exit_code != 0
    assert "Cannot specify both --builtin and --experiment-id" in result.output


def test_list_scorers_requires_one_flag(runner):
    result = runner.invoke(commands, ["list"])
    assert result.exit_code != 0
    assert "Must specify either --builtin or --experiment-id" in result.output


def test_list_scorers_env_var_still_works(runner, experiment, monkeypatch):
    monkeypatch.setenv("MLFLOW_EXPERIMENT_ID", experiment)
    result = runner.invoke(commands, ["list"])
    assert result.exit_code == 0
```

--------------------------------------------------------------------------------

````
