---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 768
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 768 of 991)

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

---[FILE: test_ai_commands.py]---
Location: mlflow-master/tests/cli/test_ai_commands.py

```python
from unittest import mock

from click.testing import CliRunner

from mlflow.cli import cli


def test_list_commands_cli():
    mock_commands = [
        {
            "key": "genai/analyze_experiment",
            "namespace": "genai",
            "description": "Analyzes an MLflow experiment",
        },
        {
            "key": "ml/train",
            "namespace": "ml",
            "description": "Training helper",
        },
    ]

    with mock.patch("mlflow.ai_commands.list_commands", return_value=mock_commands):
        runner = CliRunner()
        result = runner.invoke(cli, ["ai-commands", "list"])

    assert result.exit_code == 0
    assert "genai/analyze_experiment: Analyzes an MLflow experiment" in result.output
    assert "ml/train: Training helper" in result.output


def test_list_commands_with_namespace_cli():
    mock_commands = [
        {
            "key": "genai/analyze_experiment",
            "namespace": "genai",
            "description": "Analyzes an MLflow experiment",
        },
    ]

    with mock.patch(
        "mlflow.cli.ai_commands.list_commands", return_value=mock_commands
    ) as mock_list:
        runner = CliRunner()
        result = runner.invoke(cli, ["ai-commands", "list", "--namespace", "genai"])

    assert result.exit_code == 0
    mock_list.assert_called_once_with("genai")
    assert "genai/analyze_experiment" in result.output


def test_list_commands_empty_cli():
    with mock.patch("mlflow.ai_commands.list_commands", return_value=[]):
        runner = CliRunner()
        result = runner.invoke(cli, ["ai-commands", "list"])

    assert result.exit_code == 0
    assert "No AI commands found" in result.output


def test_list_commands_empty_namespace_cli():
    with mock.patch("mlflow.ai_commands.list_commands", return_value=[]):
        runner = CliRunner()
        result = runner.invoke(cli, ["ai-commands", "list", "--namespace", "unknown"])

    assert result.exit_code == 0
    assert "No AI commands found in namespace 'unknown'" in result.output


def test_get_command_cli():
    mock_content = """---
namespace: genai
description: Test command
---

Hello! This is test content."""

    with mock.patch("mlflow.ai_commands.get_command", return_value=mock_content):
        runner = CliRunner()
        result = runner.invoke(cli, ["ai-commands", "get", "genai/analyze_experiment"])

    assert result.exit_code == 0
    assert mock_content == result.output.rstrip("\n")


def test_get_invalid_command_cli():
    with mock.patch(
        "mlflow.cli.ai_commands.get_command",
        side_effect=FileNotFoundError("Command 'invalid/cmd' not found"),
    ):
        runner = CliRunner()
        result = runner.invoke(cli, ["ai-commands", "get", "invalid/cmd"])

    assert result.exit_code != 0
    assert "Error: Command 'invalid/cmd' not found" in result.output


def test_ai_commands_help():
    runner = CliRunner()
    result = runner.invoke(cli, ["ai-commands", "--help"])

    assert result.exit_code == 0
    assert "Manage MLflow AI commands for LLMs" in result.output
    assert "list" in result.output
    assert "get" in result.output
    assert "run" in result.output


def test_get_command_help():
    runner = CliRunner()
    result = runner.invoke(cli, ["ai-commands", "get", "--help"])

    assert result.exit_code == 0
    assert "Get a specific AI command by key" in result.output
    assert "KEY" in result.output


def test_list_command_help():
    runner = CliRunner()
    result = runner.invoke(cli, ["ai-commands", "list", "--help"])

    assert result.exit_code == 0
    assert "List all available AI commands" in result.output
    assert "--namespace" in result.output


def test_run_command_cli():
    mock_content = """---
namespace: genai
description: Test command
---

# Test Command
This is test content."""

    with mock.patch("mlflow.ai_commands.get_command", return_value=mock_content):
        runner = CliRunner()
        result = runner.invoke(cli, ["ai-commands", "run", "genai/analyze_experiment"])

    assert result.exit_code == 0
    assert "The user has run an MLflow AI command via CLI" in result.output
    assert "Start executing the workflow immediately without any preamble" in result.output
    assert "# Test Command" in result.output
    assert "This is test content." in result.output
    # Should not have frontmatter
    assert "namespace: genai" not in result.output
    assert "description: Test command" not in result.output
    assert "---" not in result.output


def test_run_invalid_command_cli():
    with mock.patch(
        "mlflow.ai_commands.get_command",
        side_effect=FileNotFoundError("Command 'invalid/cmd' not found"),
    ):
        runner = CliRunner()
        result = runner.invoke(cli, ["ai-commands", "run", "invalid/cmd"])

    assert result.exit_code != 0
    assert "Error: Command 'invalid/cmd' not found" in result.output


def test_run_command_help():
    runner = CliRunner()
    result = runner.invoke(cli, ["ai-commands", "run", "--help"])

    assert result.exit_code == 0
    assert "Get a command formatted for execution by an AI assistant" in result.output
    assert "KEY" in result.output


def test_actual_command_exists():
    runner = CliRunner()

    # Test list includes our command
    result = runner.invoke(cli, ["ai-commands", "list"])
    assert result.exit_code == 0
    assert "genai/analyze_experiment" in result.output

    # Test we can get the command
    result = runner.invoke(cli, ["ai-commands", "get", "genai/analyze_experiment"])
    assert result.exit_code == 0
    assert "# Analyze Experiment" in result.output
    assert "Analyzes traces in an MLflow experiment" in result.output

    # Test we can run the command
    result = runner.invoke(cli, ["ai-commands", "run", "genai/analyze_experiment"])
    assert result.exit_code == 0
    assert "The user has run an MLflow AI command via CLI" in result.output
    assert "Start executing the workflow immediately without any preamble" in result.output
    assert "# Analyze Experiment" in result.output
    # Should not have frontmatter
    assert "namespace: genai" not in result.output
    assert "---" not in result.output

    # Test filtering by namespace
    result = runner.invoke(cli, ["ai-commands", "list", "--namespace", "genai"])
    assert result.exit_code == 0
    assert "genai/analyze_experiment" in result.output

    # Test filtering by wrong namespace excludes it
    result = runner.invoke(cli, ["ai-commands", "list", "--namespace", "ml"])
    assert result.exit_code == 0
    assert "genai/analyze_experiment" not in result.output
```

--------------------------------------------------------------------------------

---[FILE: test_crypto.py]---
Location: mlflow-master/tests/cli/test_crypto.py

```python
import logging
from contextlib import contextmanager
from unittest import mock

import pytest
from click.testing import CliRunner

from mlflow.cli.crypto import commands
from mlflow.exceptions import MlflowException


@pytest.fixture(autouse=True)
def suppress_logging():
    original_root = logging.root.level
    original_mlflow = logging.getLogger("mlflow").level
    original_alembic = logging.getLogger("alembic").level

    logging.root.setLevel(logging.CRITICAL)
    logging.getLogger("mlflow").setLevel(logging.CRITICAL)
    logging.getLogger("alembic").setLevel(logging.CRITICAL)

    yield

    logging.root.setLevel(original_root)
    logging.getLogger("mlflow").setLevel(original_mlflow)
    logging.getLogger("alembic").setLevel(original_alembic)


@pytest.fixture
def runner():
    return CliRunner()


@pytest.fixture
def old_passphrase_env(monkeypatch):
    monkeypatch.setenv("MLFLOW_CRYPTO_KEK_PASSPHRASE", "old-passphrase")


@pytest.fixture
def mock_session():
    session = mock.MagicMock()
    session.__enter__ = mock.Mock(return_value=session)
    session.__exit__ = mock.Mock(return_value=False)
    return session


@pytest.fixture
def mock_store(mock_session):
    store = mock.Mock()
    store.ManagedSessionMaker.return_value = mock_session
    return store


@pytest.fixture
def mock_secret():
    secret = mock.Mock()
    secret.secret_id = "test-secret-id-123"
    secret.encrypted_value = b"encrypted-data"
    secret.wrapped_dek = b"wrapped-dek-data"
    secret.kek_version = 1
    return secret


@pytest.fixture
def empty_db(mock_session):
    mock_session.query.return_value.filter.return_value.all.return_value = []


@pytest.fixture
def db_with_secret(mock_session, mock_secret):
    mock_session.query.return_value.filter.return_value.all.return_value = [mock_secret]


@contextmanager
def patch_backend(mock_store):
    mock_sql_secret = mock.Mock()
    with (
        mock.patch("mlflow.cli.crypto._get_store", return_value=mock_store),
        mock.patch.dict(
            "sys.modules",
            {"mlflow.store.tracking.dbmodels.models": mock.Mock(SqlGatewaySecret=mock_sql_secret)},
        ),
    ):
        yield mock_sql_secret


@contextmanager
def patch_rotation(return_value=None):
    result = mock.Mock()
    result.wrapped_dek = b"new-wrapped-dek"
    with mock.patch(
        "mlflow.cli.crypto.rotate_secret_encryption",
        return_value=return_value or result,
    ):
        yield


def test_crypto_group_exists():
    assert commands.name == "crypto"
    assert commands.help is not None
    assert "cryptographic" in commands.help.lower()


def test_rotate_kek_command_exists():
    rotate_cmd = next((cmd for cmd in commands.commands.values() if cmd.name == "rotate-kek"), None)
    assert rotate_cmd is not None
    assert "rotate" in rotate_cmd.help.lower()


def test_rotate_kek_has_required_parameters():
    rotate_cmd = next((cmd for cmd in commands.commands.values() if cmd.name == "rotate-kek"), None)
    param_names = [p.name for p in rotate_cmd.params]
    assert "new_passphrase" in param_names
    assert "backend_store_uri" in param_names
    assert "yes" in param_names


def test_new_passphrase_is_required():
    rotate_cmd = next((cmd for cmd in commands.commands.values() if cmd.name == "rotate-kek"), None)
    new_pass_param = next((p for p in rotate_cmd.params if p.name == "new_passphrase"), None)
    assert new_pass_param.required
    assert new_pass_param.prompt
    assert new_pass_param.hide_input
    assert new_pass_param.confirmation_prompt


def test_yes_flag_is_optional():
    rotate_cmd = next((cmd for cmd in commands.commands.values() if cmd.name == "rotate-kek"), None)
    yes_param = next((p for p in rotate_cmd.params if p.name == "yes"), None)
    assert yes_param.is_flag
    assert yes_param.default is False


def test_missing_old_passphrase_raises_error(runner, monkeypatch):
    monkeypatch.delenv("MLFLOW_CRYPTO_KEK_PASSPHRASE", raising=False)
    result = runner.invoke(commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"])
    assert result.exit_code != 0
    assert result.exception is not None
    assert "MLFLOW_CRYPTO_KEK_PASSPHRASE" in str(result.exception)


def test_old_passphrase_from_env(runner, old_passphrase_env, mock_store, empty_db):
    with patch_backend(mock_store):
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code == 0
        assert "No secrets found" in result.output


def test_kek_version_defaults_to_1(runner, old_passphrase_env, mock_store, empty_db, monkeypatch):
    monkeypatch.delenv("MLFLOW_CRYPTO_KEK_VERSION", raising=False)
    with patch_backend(mock_store), mock.patch("mlflow.cli.crypto.KEKManager") as mock_kek:
        runner.invoke(commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"])
        assert mock_kek.call_args_list[0][1]["kek_version"] == 1


def test_kek_version_from_env(runner, mock_store, empty_db):
    with patch_backend(mock_store), mock.patch("mlflow.cli.crypto.os.getenv") as mock_getenv:

        def getenv_side_effect(key, default=None):
            if key == "MLFLOW_CRYPTO_KEK_PASSPHRASE":
                return "old-passphrase"
            elif key == "MLFLOW_CRYPTO_KEK_VERSION":
                return "5"
            return default

        mock_getenv.side_effect = getenv_side_effect
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code == 0


def test_version_increments_correctly(runner, mock_store, empty_db):
    with patch_backend(mock_store), mock.patch("mlflow.cli.crypto.os.getenv") as mock_getenv:

        def getenv_side_effect(key, default=None):
            if key == "MLFLOW_CRYPTO_KEK_PASSPHRASE":
                return "old-passphrase"
            elif key == "MLFLOW_CRYPTO_KEK_VERSION":
                return "3"
            return default

        mock_getenv.side_effect = getenv_side_effect
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code == 0


def test_interactive_prompt_shows_warning(runner, old_passphrase_env, mock_store, empty_db):
    with patch_backend(mock_store):
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase"], input="n\n"
        )
        assert "⚠️  WARNING: KEK Rotation Operation" in result.output
        assert "Re-wrap all encryption DEKs" in result.output
        assert "MLFLOW_CRYPTO_KEK_PASSPHRASE" in result.output
        assert "MLFLOW_CRYPTO_KEK_VERSION" in result.output
        assert "Continue with KEK rotation?" in result.output


def test_yes_flag_skips_confirmation(runner, old_passphrase_env, mock_store, empty_db):
    with patch_backend(mock_store):
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert "⚠️  WARNING" not in result.output
        assert "Continue with KEK rotation?" not in result.output


def test_cancellation_exits_gracefully(runner, old_passphrase_env, mock_store, empty_db):
    with patch_backend(mock_store):
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase"], input="n\n"
        )
        assert result.exit_code == 0
        assert "KEK rotation cancelled" in result.output


def test_connects_to_backend_store(runner, old_passphrase_env, mock_store, empty_db):
    with patch_backend(mock_store):
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code == 0


def test_uses_custom_backend_store_uri(runner, old_passphrase_env, mock_store, empty_db):
    with patch_backend(mock_store):
        result = runner.invoke(
            commands,
            [
                "rotate-kek",
                "--new-passphrase",
                "new-passphrase",
                "--backend-store-uri",
                "sqlite:///test.db",
                "--yes",
            ],
        )
        assert result.exit_code == 0


def test_filters_secrets_by_kek_version(
    runner, old_passphrase_env, mock_store, mock_secret, monkeypatch
):
    monkeypatch.setenv("MLFLOW_CRYPTO_KEK_VERSION", "2")
    mock_session = mock_store.ManagedSessionMaker.return_value
    mock_session.query.return_value.filter.return_value.all.return_value = [mock_secret]
    with patch_backend(mock_store), patch_rotation():
        runner.invoke(commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"])
        assert mock_session.query.return_value.filter.call_args is not None


def test_commits_transaction_on_success(runner, old_passphrase_env, mock_store, db_with_secret):
    with patch_backend(mock_store), patch_rotation():
        runner.invoke(commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"])
        mock_store.ManagedSessionMaker.return_value.commit.assert_called_once()


def test_no_secrets_returns_success(runner, old_passphrase_env, mock_store, empty_db):
    with patch_backend(mock_store):
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code == 0
        assert "No secrets found" in result.output
        assert "Nothing to rotate" in result.output


def test_wrong_old_passphrase_fails(runner, old_passphrase_env, mock_store, db_with_secret):
    with (
        patch_backend(mock_store),
        mock.patch(
            "mlflow.cli.crypto.rotate_secret_encryption",
            side_effect=MlflowException("Failed to rotate secret encryption"),
        ),
    ):
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code != 0
        assert "Failed to rotate encryption key" in result.output


def test_rotation_failure_rolls_back(runner, old_passphrase_env, mock_store, db_with_secret):
    with (
        patch_backend(mock_store),
        mock.patch(
            "mlflow.cli.crypto.rotate_secret_encryption",
            side_effect=Exception("Rotation failed"),
        ),
    ):
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code != 0
        mock_store.ManagedSessionMaker.return_value.rollback.assert_called_once()
        assert "No changes were made" in str(result.exception)


def test_database_connection_error(runner, old_passphrase_env):
    mock_sql_secret = mock.Mock()
    with (
        mock.patch("mlflow.cli.crypto._get_store", side_effect=Exception("Connection failed")),
        mock.patch.dict(
            "sys.modules",
            {"mlflow.store.tracking.dbmodels.models": mock.Mock(SqlGatewaySecret=mock_sql_secret)},
        ),
    ):
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code != 0
        assert "Failed to connect to backend store" in str(result.exception)


def test_kek_manager_creation_error(runner, old_passphrase_env, mock_store):
    with (
        patch_backend(mock_store),
        mock.patch("mlflow.cli.crypto.KEKManager", side_effect=Exception("KEK creation failed")),
    ):
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code != 0
        assert "Failed to create KEK managers" in str(result.exception)


def test_shows_progress_for_multiple_secrets(runner, old_passphrase_env, mock_store, mock_session):
    secrets = [
        mock.Mock(
            secret_id=f"secret-{i}", encrypted_value=b"enc", wrapped_dek=b"wrap", kek_version=1
        )
        for i in range(5)
    ]
    mock_session.query.return_value.filter.return_value.all.return_value = secrets
    with patch_backend(mock_store), patch_rotation():
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code == 0
        assert "Found 5 secrets to rotate" in result.output


def test_success_message_includes_version_info(runner, mock_store, mock_session):
    secret = mock.Mock(secret_id="test", encrypted_value=b"enc", wrapped_dek=b"wrap", kek_version=3)
    mock_session.query.return_value.filter.return_value.all.return_value = [secret]
    with (
        patch_backend(mock_store),
        patch_rotation(),
        mock.patch("mlflow.cli.crypto.os.getenv") as mock_getenv,
    ):

        def getenv_side_effect(key, default=None):
            if key == "MLFLOW_CRYPTO_KEK_PASSPHRASE":
                return "old-passphrase"
            elif key == "MLFLOW_CRYPTO_KEK_VERSION":
                return "3"
            return default

        mock_getenv.side_effect = getenv_side_effect
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code == 0
        assert "Successfully rotated 1 encryption key" in result.output


def test_shows_environment_variable_warning(runner, old_passphrase_env, mock_store, db_with_secret):
    with patch_backend(mock_store), patch_rotation():
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code == 0
        assert "CRITICAL: Update BOTH environment variables" in result.output
        assert "MLFLOW_CRYPTO_KEK_PASSPHRASE='<new-passphrase>'" in result.output
        assert "MLFLOW_CRYPTO_KEK_VERSION='2'" in result.output
        assert "Failure to update BOTH variables will cause decryption failures" in result.output


def test_large_number_of_secrets(runner, old_passphrase_env, mock_store, mock_session):
    secrets = [
        mock.Mock(
            secret_id=f"secret-{i}", encrypted_value=b"enc", wrapped_dek=b"wrap", kek_version=1
        )
        for i in range(1000)
    ]
    mock_session.query.return_value.filter.return_value.all.return_value = secrets
    with patch_backend(mock_store), patch_rotation():
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code == 0
        assert "Found 1000 secrets to rotate" in result.output
        assert "Successfully rotated 1000 encryption keys" in result.output


def test_mixed_kek_versions_only_rotates_old_version(
    runner, old_passphrase_env, mock_store, mock_session, monkeypatch
):
    monkeypatch.setenv("MLFLOW_CRYPTO_KEK_VERSION", "1")
    secret = mock.Mock(
        secret_id="secret-v1", encrypted_value=b"enc", wrapped_dek=b"wrap", kek_version=1
    )
    mock_session.query.return_value.filter.return_value.all.return_value = [secret]
    with patch_backend(mock_store), patch_rotation():
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        assert result.exit_code == 0
        assert "Found 1 secrets to rotate" in result.output


def test_rotation_with_special_characters_in_passphrase(runner, mock_store, empty_db, monkeypatch):
    monkeypatch.setenv("MLFLOW_CRYPTO_KEK_PASSPHRASE", "old-p@$$phrase!#$%")
    with patch_backend(mock_store):
        result = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-p@$$phrase!#$%", "--yes"]
        )
        assert result.exit_code == 0


def test_idempotency_running_twice_with_same_version(
    runner, old_passphrase_env, mock_store, empty_db
):
    with patch_backend(mock_store):
        result1 = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase", "--yes"]
        )
        result2 = runner.invoke(
            commands, ["rotate-kek", "--new-passphrase", "new-passphrase-2", "--yes"]
        )
        assert result1.exit_code == 0
        assert result2.exit_code == 0
        assert "No secrets found" in result1.output
        assert "No secrets found" in result2.output
```

--------------------------------------------------------------------------------

---[FILE: test_eval.py]---
Location: mlflow-master/tests/cli/test_eval.py

```python
import re
from unittest import mock

import click
import pandas as pd
import pytest

import mlflow
from mlflow.cli.eval import evaluate_traces
from mlflow.entities import Trace, TraceInfo
from mlflow.genai.scorers.base import scorer


def test_evaluate_traces_with_single_trace_table_output():
    experiment_id = mlflow.create_experiment("test_experiment")

    mock_trace = mock.Mock(spec=Trace)
    mock_trace.info = mock.Mock(spec=TraceInfo)
    mock_trace.info.trace_id = "tr-test-123"
    mock_trace.info.experiment_id = experiment_id

    mock_results = mock.Mock()
    mock_results.run_id = "run-eval-456"
    mock_results.result_df = pd.DataFrame(
        [
            {
                "trace_id": "tr-test-123",
                "assessments": [
                    {
                        "assessment_name": "RelevanceToQuery",
                        "feedback": {"value": "yes"},
                        "rationale": "The answer is relevant",
                        "metadata": {"mlflow.assessment.sourceRunId": "run-eval-456"},
                    }
                ],
            }
        ]
    )

    with (
        mock.patch(
            "mlflow.cli.eval.MlflowClient.get_trace", return_value=mock_trace
        ) as mock_get_trace,
        mock.patch("mlflow.cli.eval.evaluate", return_value=mock_results) as mock_evaluate,
    ):
        evaluate_traces(
            experiment_id=experiment_id,
            trace_ids="tr-test-123",
            scorers="RelevanceToQuery",
            output_format="table",
        )

        mock_get_trace.assert_called_once_with("tr-test-123", display=False)

        assert mock_evaluate.call_count == 1
        call_args = mock_evaluate.call_args
        assert "data" in call_args.kwargs

        expected_df = pd.DataFrame([{"trace_id": "tr-test-123", "trace": mock_trace}])
        pd.testing.assert_frame_equal(call_args.kwargs["data"], expected_df)

        assert "scorers" in call_args.kwargs
        assert len(call_args.kwargs["scorers"]) == 1
        assert call_args.kwargs["scorers"][0].__class__.__name__ == "RelevanceToQuery"


def test_evaluate_traces_with_multiple_traces_json_output():
    experiment = mlflow.create_experiment("test_experiment_multi")

    mock_trace1 = mock.Mock(spec=Trace)
    mock_trace1.info = mock.Mock(spec=TraceInfo)
    mock_trace1.info.trace_id = "tr-test-1"
    mock_trace1.info.experiment_id = experiment

    mock_trace2 = mock.Mock(spec=Trace)
    mock_trace2.info = mock.Mock(spec=TraceInfo)
    mock_trace2.info.trace_id = "tr-test-2"
    mock_trace2.info.experiment_id = experiment

    mock_results = mock.Mock()
    mock_results.run_id = "run-eval-789"
    mock_results.result_df = pd.DataFrame(
        [
            {
                "trace_id": "tr-test-1",
                "assessments": [
                    {
                        "assessment_name": "Correctness",
                        "feedback": {"value": "correct"},
                        "rationale": "Content is correct",
                        "metadata": {"mlflow.assessment.sourceRunId": "run-eval-789"},
                    }
                ],
            },
            {
                "trace_id": "tr-test-2",
                "assessments": [
                    {
                        "assessment_name": "Correctness",
                        "feedback": {"value": "correct"},
                        "rationale": "Also correct",
                        "metadata": {"mlflow.assessment.sourceRunId": "run-eval-789"},
                    }
                ],
            },
        ]
    )

    with (
        mock.patch(
            "mlflow.cli.eval.MlflowClient.get_trace",
            side_effect=[mock_trace1, mock_trace2],
        ) as mock_get_trace,
        mock.patch("mlflow.cli.eval.evaluate", return_value=mock_results) as mock_evaluate,
    ):
        evaluate_traces(
            experiment_id=experiment,
            trace_ids="tr-test-1,tr-test-2",
            scorers="Correctness",
            output_format="json",
        )

        assert mock_get_trace.call_count == 2
        mock_get_trace.assert_any_call("tr-test-1", display=False)
        mock_get_trace.assert_any_call("tr-test-2", display=False)

        assert mock_evaluate.call_count == 1
        call_args = mock_evaluate.call_args
        expected_df = pd.DataFrame(
            [
                {"trace_id": "tr-test-1", "trace": mock_trace1},
                {"trace_id": "tr-test-2", "trace": mock_trace2},
            ]
        )
        pd.testing.assert_frame_equal(call_args.kwargs["data"], expected_df)


def test_evaluate_traces_with_nonexistent_trace():
    experiment = mlflow.create_experiment("test_experiment_error")

    with mock.patch("mlflow.cli.eval.MlflowClient.get_trace", return_value=None) as mock_get_trace:
        with pytest.raises(click.UsageError, match="Trace with ID 'tr-nonexistent' not found"):
            evaluate_traces(
                experiment_id=experiment,
                trace_ids="tr-nonexistent",
                scorers="RelevanceToQuery",
                output_format="table",
            )

        mock_get_trace.assert_called_once_with("tr-nonexistent", display=False)


def test_evaluate_traces_with_trace_from_wrong_experiment():
    experiment1 = mlflow.create_experiment("test_experiment_1")
    experiment2 = mlflow.create_experiment("test_experiment_2")

    mock_trace = mock.Mock(spec=Trace)
    mock_trace.info = mock.Mock(spec=TraceInfo)
    mock_trace.info.trace_id = "tr-test-123"
    mock_trace.info.experiment_id = experiment2

    with mock.patch(
        "mlflow.cli.eval.MlflowClient.get_trace", return_value=mock_trace
    ) as mock_get_trace:
        with pytest.raises(click.UsageError, match="belongs to experiment"):
            evaluate_traces(
                experiment_id=experiment1,
                trace_ids="tr-test-123",
                scorers="RelevanceToQuery",
                output_format="table",
            )

        mock_get_trace.assert_called_once_with("tr-test-123", display=False)


def test_evaluate_traces_integration():
    experiment_id = mlflow.create_experiment("test_experiment_integration")
    mlflow.set_experiment(experiment_id=experiment_id)

    # Create a few real traces with inputs and outputs
    trace_ids = []
    for i in range(3):
        with mlflow.start_span(name=f"test_span_{i}") as span:
            span.set_inputs({"question": f"What is test {i}?"})
            span.set_outputs(f"This is answer {i}")
            trace_ids.append(span.trace_id)

    # Define a simple code-based scorer inline
    @scorer
    def simple_scorer(outputs):
        """Extract the digit from the output string and return it as the score"""
        if match := re.search(r"\d+", outputs):
            return float(match.group())
        return 0.0

    with mock.patch(
        "mlflow.cli.eval.resolve_scorers", return_value=[simple_scorer]
    ) as mock_resolve:
        evaluate_traces(
            experiment_id=experiment_id,
            trace_ids=",".join(trace_ids),
            scorers="simple_scorer",  # This will be intercepted by our mock
            output_format="table",
        )
        mock_resolve.assert_called_once()

    # Verify that the evaluation results are as expected
    traces = mlflow.search_traces(locations=[experiment_id], return_type="list")
    assert len(traces) == 3

    # Sort traces by their outputs to get consistent ordering
    traces = sorted(traces, key=lambda t: t.data.spans[0].outputs)

    for i, trace in enumerate(traces):
        assessments = trace.info.assessments
        assert len(assessments) > 0

        scorer_assessments = [a for a in assessments if a.name == "simple_scorer"]
        assert len(scorer_assessments) == 1

        assessment = scorer_assessments[0]
        # Each trace should have a score equal to its index (0, 1, 2)
        assert assessment.value == float(i)
```

--------------------------------------------------------------------------------

````
