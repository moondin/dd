---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 944
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 944 of 991)

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

---[FILE: test_events.py]---
Location: mlflow-master/tests/telemetry/test_events.py

```python
from unittest.mock import Mock

import pytest

from mlflow.prompt.constants import IS_PROMPT_TAG_KEY
from mlflow.telemetry.events import (
    AiCommandRunEvent,
    AlignJudgeEvent,
    CreateDatasetEvent,
    CreateExperimentEvent,
    CreateLoggedModelEvent,
    CreateModelVersionEvent,
    CreatePromptEvent,
    CreateRegisteredModelEvent,
    CreateRunEvent,
    EvaluateEvent,
    LogAssessmentEvent,
    MakeJudgeEvent,
    MergeRecordsEvent,
    PromptOptimizationEvent,
    StartTraceEvent,
)


@pytest.mark.parametrize(
    ("arguments", "expected_params"),
    [
        (
            {"flavor": "mlflow.pyfunc"},
            {"flavor": "pyfunc"},
        ),
        (
            {"flavor": "sklearn"},
            {"flavor": "sklearn"},
        ),
        (
            {
                "flavor": None,
            },
            None,
        ),
        ({}, None),
    ],
)
def test_logged_model_parse_params(arguments, expected_params):
    assert CreateLoggedModelEvent.name == "create_logged_model"
    assert CreateLoggedModelEvent.parse(arguments) == expected_params


@pytest.mark.parametrize(
    ("arguments", "expected_params"),
    [
        ({"tags": None}, {"is_prompt": False}),
        ({"tags": {}}, {"is_prompt": False}),
        ({"tags": {IS_PROMPT_TAG_KEY: "true"}}, {"is_prompt": True}),
        ({"tags": {IS_PROMPT_TAG_KEY: "false"}}, {"is_prompt": False}),
        ({}, {"is_prompt": False}),
    ],
)
def test_registered_model_parse_params(arguments, expected_params):
    assert CreateRegisteredModelEvent.name == "create_registered_model"
    assert CreateRegisteredModelEvent.parse(arguments) == expected_params


@pytest.mark.parametrize(
    ("arguments", "expected_params"),
    [
        ({"tags": None}, {"is_prompt": False}),
        ({"tags": {}}, {"is_prompt": False}),
        ({"tags": {IS_PROMPT_TAG_KEY: "true"}}, {"is_prompt": True}),
        ({"tags": {IS_PROMPT_TAG_KEY: "false"}}, {"is_prompt": False}),
        ({}, {"is_prompt": False}),
    ],
)
def test_create_model_version_parse_params(arguments, expected_params):
    assert CreateModelVersionEvent.name == "create_model_version"
    assert CreateModelVersionEvent.parse(arguments) == expected_params


def test_event_name():
    assert AiCommandRunEvent.name == "ai_command_run"
    assert CreatePromptEvent.name == "create_prompt"
    assert CreateLoggedModelEvent.name == "create_logged_model"
    assert CreateRegisteredModelEvent.name == "create_registered_model"
    assert CreateModelVersionEvent.name == "create_model_version"
    assert CreateRunEvent.name == "create_run"
    assert CreateExperimentEvent.name == "create_experiment"
    assert LogAssessmentEvent.name == "log_assessment"
    assert StartTraceEvent.name == "start_trace"
    assert EvaluateEvent.name == "evaluate"
    assert CreateDatasetEvent.name == "create_dataset"
    assert MergeRecordsEvent.name == "merge_records"
    assert MakeJudgeEvent.name == "make_judge"
    assert AlignJudgeEvent.name == "align_judge"
    assert PromptOptimizationEvent.name == "prompt_optimization"


@pytest.mark.parametrize(
    ("arguments", "expected_params"),
    [
        ({"records": [{"test": "data"}]}, {"record_count": 1, "input_type": "list[dict]"}),
        ({"records": [{"a": 1}, {"b": 2}]}, {"record_count": 2, "input_type": "list[dict]"}),
        ({"records": []}, None),
        ({"records": None}, None),
        ({}, None),
        (None, None),
        ({"records": object()}, None),
    ],
)
def test_merge_records_parse_params(arguments, expected_params):
    assert MergeRecordsEvent.parse(arguments) == expected_params


@pytest.mark.parametrize(
    ("arguments", "expected_params"),
    [
        ({"model": "openai:/gpt-4"}, {"model_provider": "openai"}),
        ({"model": "databricks:/dbrx"}, {"model_provider": "databricks"}),
        ({"model": "custom"}, {"model_provider": None}),
        ({"model": None}, {"model_provider": None}),
        ({}, {"model_provider": None}),
    ],
)
def test_make_judge_parse_params(arguments, expected_params):
    assert MakeJudgeEvent.parse(arguments) == expected_params


@pytest.mark.parametrize(
    ("arguments", "expected_params"),
    [
        ({"traces": [{}, {}], "optimizer": None}, {"trace_count": 2, "optimizer_type": "default"}),
        (
            {"traces": [{}], "optimizer": type("MockOptimizer", (), {})()},
            {"trace_count": 1, "optimizer_type": "MockOptimizer"},
        ),
        ({"traces": [], "optimizer": None}, {"trace_count": 0, "optimizer_type": "default"}),
        ({"traces": None, "optimizer": None}, {"optimizer_type": "default"}),
        ({}, {"optimizer_type": "default"}),
    ],
)
def test_align_judge_parse_params(arguments, expected_params):
    assert AlignJudgeEvent.parse(arguments) == expected_params


@pytest.mark.parametrize(
    ("arguments", "expected_params"),
    [
        # Normal case with optimizer and prompt URIs
        (
            {
                "optimizer": type("MockOptimizer", (), {})(),
                "prompt_uris": ["prompts:/test/1"],
                "scorers": None,
                "aggregation": None,
            },
            {
                "optimizer_type": "MockOptimizer",
                "prompt_count": 1,
                "scorer_count": None,
                "custom_aggregation": False,
            },
        ),
        # Multiple prompt URIs with custom scorers
        (
            {
                "optimizer": type("CustomAdapter", (), {})(),
                "prompt_uris": ["prompts:/test/1", "prompts:/test/2"],
                "scorers": [Mock()],
                "aggregation": None,
            },
            {
                "optimizer_type": "CustomAdapter",
                "prompt_count": 2,
                "scorer_count": 1,
                "custom_aggregation": False,
            },
        ),
        # Custom objective with multiple scorers
        (
            {
                "optimizer": type("TestAdapter", (), {})(),
                "prompt_uris": ["prompts:/test/1"],
                "scorers": [Mock(), Mock(), Mock()],
                "aggregation": lambda scores: sum(scores.values()),
            },
            {
                "optimizer_type": "TestAdapter",
                "prompt_count": 1,
                "scorer_count": 3,
                "custom_aggregation": True,
            },
        ),
        # No optimizer provided - optimizer_type should be None
        (
            {
                "optimizer": None,
                "prompt_uris": ["prompts:/test/1"],
                "scorers": None,
                "aggregation": None,
            },
            {
                "optimizer_type": None,
                "prompt_count": 1,
                "scorer_count": None,
                "custom_aggregation": False,
            },
        ),
    ],
)
def test_prompt_optimization_parse_params(arguments, expected_params):
    assert PromptOptimizationEvent.parse(arguments) == expected_params
```

--------------------------------------------------------------------------------

---[FILE: test_installation_id.py]---
Location: mlflow-master/tests/telemetry/test_installation_id.py

```python
import json
import uuid
from unittest import mock

import pytest

import mlflow
from mlflow.telemetry.client import get_telemetry_client, set_telemetry_client
from mlflow.telemetry.installation_id import get_or_create_installation_id
from mlflow.utils.os import is_windows
from mlflow.version import VERSION


@pytest.fixture
def tmp_home(tmp_path, monkeypatch):
    monkeypatch.setenv("HOME", str(tmp_path))  # macos/linux
    monkeypatch.delenv("XDG_CONFIG_HOME", raising=False)  # macos/linux with custom location
    monkeypatch.setenv("APPDATA", str(tmp_path))  # windows
    return tmp_path


@pytest.fixture(autouse=True)
def clear_installation_id_cache():
    mlflow.telemetry.installation_id._INSTALLATION_ID_CACHE = None


def _is_uuid(value: str) -> bool:
    try:
        uuid.UUID(value)
        return True
    except ValueError:
        return False


def test_installation_id_persisted_and_reused(tmp_home):
    first = get_or_create_installation_id()
    assert _is_uuid(first)

    base_path = tmp_home if is_windows() else tmp_home / ".config"
    path = base_path / "mlflow" / "telemetry.json"
    assert path.exists()
    data = json.loads(path.read_text(encoding="utf-8"))
    assert data.get("installation_id") == first
    assert data.get("schema_version") == 1
    assert data.get("created_version") == VERSION
    assert data.get("created_at") is not None

    # Second call returns the same value without changing the file
    second = get_or_create_installation_id()
    assert second == first


def test_installation_id_saved_to_xdg_config_dir_if_set(monkeypatch, tmp_home):
    monkeypatch.setenv("XDG_CONFIG_HOME", str(tmp_home))
    first = get_or_create_installation_id()
    assert _is_uuid(first)
    path = tmp_home / "mlflow" / "telemetry.json"
    assert path.exists()


def test_installation_id_corrupted_file(tmp_home):
    # If the file is corrupted, installation ID should be recreated
    base_path = tmp_home if is_windows() else tmp_home / ".config"
    dir_path = base_path / "mlflow"
    dir_path.mkdir(parents=True, exist_ok=True)
    path = dir_path / "telemetry.json"
    path.write_text("invalid JSON", encoding="utf-8")
    third = get_or_create_installation_id()
    assert _is_uuid(third)
    assert path.exists()
    data = json.loads(path.read_text(encoding="utf-8"))
    assert data.get("installation_id") == third


@pytest.mark.parametrize("env_var", ["MLFLOW_DISABLE_TELEMETRY", "DO_NOT_TRACK"])
def test_installation_id_not_created_when_telemetry_disabled(monkeypatch, tmp_home, env_var):
    monkeypatch.setenv(env_var, "true")
    # This env var is set to True in conftest.py and force enable telemetry
    monkeypatch.setattr(mlflow.telemetry.utils, "_IS_MLFLOW_TESTING_TELEMETRY", False)
    set_telemetry_client()
    assert not (tmp_home / ".config" / "mlflow" / "telemetry.json").exists()
    assert get_telemetry_client() is None


def test_get_or_create_installation_id_should_not_raise():
    with mock.patch(
        "mlflow.telemetry.installation_id._load_installation_id_from_disk",
        side_effect=Exception("test"),
    ) as mocked:
        assert get_or_create_installation_id() is None
        mocked.assert_called_once()
```

--------------------------------------------------------------------------------

---[FILE: test_track.py]---
Location: mlflow-master/tests/telemetry/test_track.py

```python
import time
from unittest import mock

import pytest

from mlflow.environment_variables import MLFLOW_DISABLE_TELEMETRY
from mlflow.telemetry.client import (
    TelemetryClient,
    get_telemetry_client,
    set_telemetry_client,
)
from mlflow.telemetry.events import CreateLoggedModelEvent, Event
from mlflow.telemetry.schemas import Status
from mlflow.telemetry.track import _is_telemetry_disabled_for_event, record_usage_event
from mlflow.telemetry.utils import is_telemetry_disabled
from mlflow.tracking._tracking_service.utils import _use_tracking_uri
from mlflow.version import VERSION


class TestEvent(Event):
    name = "test_event"


def test_record_usage_event(mock_requests, mock_telemetry_client: TelemetryClient):
    @record_usage_event(TestEvent)
    def succeed_func():
        # sleep to make sure duration_ms > 0
        time.sleep(0.01)
        return True

    @record_usage_event(TestEvent)
    def fail_func():
        time.sleep(0.01)
        raise ValueError("test")

    with mock.patch(
        "mlflow.telemetry.track.get_telemetry_client", return_value=mock_telemetry_client
    ):
        succeed_func()
        with pytest.raises(ValueError, match="test"):
            fail_func()

    mock_telemetry_client.flush()

    records = [
        record["data"] for record in mock_requests if record["data"]["event_name"] == TestEvent.name
    ]
    assert len(records) == 2
    succeed_record = records[0]
    assert succeed_record["schema_version"] == 2
    assert succeed_record["event_name"] == TestEvent.name
    assert succeed_record["status"] == Status.SUCCESS.value
    assert succeed_record["params"] is None
    assert succeed_record["duration_ms"] > 0

    fail_record = records[1]
    assert fail_record["schema_version"] == 2
    assert fail_record["event_name"] == TestEvent.name
    assert fail_record["status"] == Status.FAILURE.value
    assert fail_record["params"] is None
    assert fail_record["duration_ms"] > 0

    telemetry_info = mock_telemetry_client.info
    assert telemetry_info.items() <= succeed_record.items()
    assert telemetry_info.items() <= fail_record.items()


def test_backend_store_info(tmp_path, mock_telemetry_client: TelemetryClient):
    sqlite_uri = f"sqlite:///{tmp_path.joinpath('test.db')}"
    with _use_tracking_uri(sqlite_uri):
        mock_telemetry_client._update_backend_store()
    assert mock_telemetry_client.info["tracking_uri_scheme"] == "sqlite"

    with _use_tracking_uri(tmp_path):
        mock_telemetry_client._update_backend_store()
    assert mock_telemetry_client.info["tracking_uri_scheme"] == "file"


@pytest.mark.parametrize(
    ("env_var", "value", "expected_result"),
    [
        (MLFLOW_DISABLE_TELEMETRY.name, "true", None),
        (MLFLOW_DISABLE_TELEMETRY.name, "false", TelemetryClient),
        ("DO_NOT_TRACK", "true", None),
        ("DO_NOT_TRACK", "false", TelemetryClient),
    ],
)
def test_record_usage_event_respect_env_var(
    monkeypatch, env_var, value, expected_result, bypass_env_check
):
    monkeypatch.setenv(env_var, value)
    # mimic the behavior of `import mlflow`
    set_telemetry_client()
    telemetry_client = get_telemetry_client()
    if expected_result is None:
        assert is_telemetry_disabled() is True
        assert telemetry_client is None
    else:
        assert isinstance(telemetry_client, expected_result)
        telemetry_client._clean_up()


def test_record_usage_event_update_env_var_after_import(
    monkeypatch, mock_requests, mock_telemetry_client
):
    assert isinstance(mock_telemetry_client, TelemetryClient)

    @record_usage_event(TestEvent)
    def test_func():
        pass

    with mock.patch(
        "mlflow.telemetry.track.get_telemetry_client", return_value=mock_telemetry_client
    ):
        test_func()

        mock_telemetry_client.flush()
        events = {record["data"]["event_name"] for record in mock_requests}
        assert TestEvent.name in events
        mock_requests.clear()

        monkeypatch.setenv("MLFLOW_DISABLE_TELEMETRY", "true")
        test_func()
        # no new record should be added
        assert len(mock_requests) == 0


@pytest.mark.no_mock_requests_get
def test_is_telemetry_disabled_for_event():
    def mock_requests_get(*args, **kwargs):
        time.sleep(1)
        return mock.Mock(
            status_code=200,
            json=mock.Mock(
                return_value={
                    "mlflow_version": VERSION,
                    "disable_telemetry": False,
                    "ingestion_url": "http://localhost:9999",
                    "rollout_percentage": 100,
                    "disable_events": ["test_event"],
                }
            ),
        )

    with mock.patch("mlflow.telemetry.client.requests.get", side_effect=mock_requests_get):
        client = TelemetryClient()
        assert client is not None
        client.activate()
        assert client.config is None
        with mock.patch("mlflow.telemetry.track.get_telemetry_client", return_value=client):
            # do not skip when config is not fetched yet
            assert _is_telemetry_disabled_for_event(TestEvent) is False
            assert _is_telemetry_disabled_for_event(TestEvent) is False
            time.sleep(2)
            assert client._is_config_fetched is True
            assert client.config is not None
            # event not in disable_events, do not skip
            assert _is_telemetry_disabled_for_event(CreateLoggedModelEvent) is False
            # event in disable_events, skip
            assert _is_telemetry_disabled_for_event(TestEvent) is True
        # clean up
        client._clean_up()

    # test telemetry disabled after config is fetched
    def mock_requests_get(*args, **kwargs):
        time.sleep(1)
        return mock.Mock(status_code=403)

    with mock.patch("mlflow.telemetry.client.requests.get", side_effect=mock_requests_get):
        client = TelemetryClient()
        assert client is not None
        client.activate()
        assert client.config is None
        with (
            mock.patch("mlflow.telemetry.track.get_telemetry_client", return_value=client),
            mock.patch(
                "mlflow.telemetry.client._set_telemetry_client"
            ) as mock_set_telemetry_client,
        ):
            # do not skip when config is not fetched yet
            assert _is_telemetry_disabled_for_event(CreateLoggedModelEvent) is False
            assert _is_telemetry_disabled_for_event(TestEvent) is False
            time.sleep(2)
            assert client._is_config_fetched is True
            assert client.config is None
            # global telemetry client is set to None when telemetry is disabled
            mock_set_telemetry_client.assert_called_once_with(None)
        # clean up
        client._clean_up()
```

--------------------------------------------------------------------------------

````
