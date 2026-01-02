---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 810
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 810 of 991)

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

---[FILE: test_agent_server.py]---
Location: mlflow-master/tests/genai/test_agent_server.py
Signals: FastAPI

```python
import contextvars
from typing import AsyncGenerator
from unittest.mock import Mock, patch

import httpx
import pytest
from fastapi.testclient import TestClient

from mlflow.genai.agent_server import (
    AgentServer,
    get_invoke_function,
    get_request_headers,
    get_stream_function,
    invoke,
    set_request_headers,
    stream,
)
from mlflow.genai.agent_server.validator import ResponsesAgentValidator
from mlflow.types.responses import (
    ResponsesAgentRequest,
    ResponsesAgentResponse,
    ResponsesAgentStreamEvent,
)


@pytest.fixture(autouse=True)
def reset_global_state():
    """Reset global state before each test to ensure test isolation."""
    import mlflow.genai.agent_server.server

    mlflow.genai.agent_server.server._invoke_function = None
    mlflow.genai.agent_server.server._stream_function = None


async def responses_invoke(request: ResponsesAgentRequest) -> ResponsesAgentResponse:
    return ResponsesAgentResponse(
        output=[
            {
                "type": "message",
                "id": "msg-123",
                "status": "completed",
                "role": "assistant",
                "content": [{"type": "output_text", "text": "Hello from ResponsesAgent!"}],
            }
        ]
    )


async def responses_stream(
    request: ResponsesAgentRequest,
) -> AsyncGenerator[ResponsesAgentStreamEvent, None]:
    yield ResponsesAgentStreamEvent(
        type="response.output_item.done",
        item={
            "type": "message",
            "id": "msg-123",
            "status": "completed",
            "role": "assistant",
            "content": [{"type": "output_text", "text": "Hello from ResponsesAgent stream!"}],
        },
    )


async def arbitrary_invoke(request: dict) -> dict:
    return {
        "response": "Hello from ArbitraryDictAgent!",
        "arbitrary_field": "custom_value",
        "nested": {"data": "some nested content"},
    }


async def arbitrary_stream(request: dict) -> AsyncGenerator[dict, None]:
    yield {"type": "custom_event", "data": "First chunk"}
    yield {"type": "custom_event", "data": "Second chunk", "final": True}


def test_invoke_decorator_single_registration():
    @invoke()
    def my_invoke_function(request):
        return {"result": "success"}

    registered_function = get_invoke_function()
    assert registered_function is not None
    result = registered_function({"test": "request"})
    assert result == {"result": "success"}


def test_stream_decorator_single_registration():
    @stream()
    async def my_stream_function(request):
        yield {"delta": {"content": "hello"}}

    registered_function = get_stream_function()
    assert registered_function is not None


def test_multiple_invoke_registrations_raises_error():
    @invoke()
    def first_function(request):
        return {"result": "first"}

    with pytest.raises(ValueError, match="invoke decorator can only be used once"):

        @invoke()
        def second_function(request):
            return {"result": "second"}


def test_multiple_stream_registrations_raises_error():
    @stream()
    def first_stream(request):
        yield {"delta": {"content": "first"}}

    with pytest.raises(ValueError, match="stream decorator can only be used once"):

        @stream()
        def second_stream(request):
            yield {"delta": {"content": "second"}}


def test_get_invoke_function_returns_registered():
    def my_function(request):
        return {"test": "data"}

    @invoke()
    def registered_function(request):
        return my_function(request)

    result = get_invoke_function()
    assert result is not None
    test_result = result({"input": "test"})
    assert test_result == {"test": "data"}


def test_decorator_preserves_function_metadata():
    @invoke()
    def function_with_metadata(request):
        """This is a test function with documentation."""
        return {"result": "success"}

    # Get the wrapper function
    wrapper = get_invoke_function()

    # Verify that functools.wraps preserved the metadata
    assert wrapper.__name__ == "function_with_metadata"
    assert wrapper.__doc__ == "This is a test function with documentation."

    @stream()
    async def stream_with_metadata(request):
        """This is a test stream function."""
        yield {"delta": {"content": "hello"}}

    stream_wrapper = get_stream_function()
    assert stream_wrapper.__name__ == "stream_with_metadata"
    assert stream_wrapper.__doc__ == "This is a test stream function."


def test_validator_request_dict_responses_agent():
    validator_responses = ResponsesAgentValidator()
    request_data = {
        "input": [
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text": "Hello"}],
            }
        ]
    }
    result = validator_responses.validate_and_convert_request(request_data)
    assert isinstance(result, ResponsesAgentRequest)


def test_validator_invalid_request_dict_raises_error():
    validator_responses = ResponsesAgentValidator()
    invalid_data = {"invalid": "structure"}

    with pytest.raises(ValueError, match="Invalid data for ResponsesAgentRequest"):
        validator_responses.validate_and_convert_request(invalid_data)


def test_validator_none_type_returns_data_unchanged():
    validator_responses = ResponsesAgentValidator()
    request_data = {
        "input": [
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text": "Hello"}],
            }
        ]
    }
    result = validator_responses.validate_and_convert_request(request_data)
    assert isinstance(result, ResponsesAgentRequest)


def test_validator_response_dict_format():
    validator_responses = ResponsesAgentValidator()
    response_dict = {
        "output": [
            {
                "type": "message",
                "id": "123",
                "status": "completed",
                "role": "assistant",
                "content": [{"type": "output_text", "text": "Hello"}],
            }
        ]
    }

    result = validator_responses.validate_and_convert_result(response_dict)
    assert isinstance(result, dict)
    assert result == response_dict


def test_validator_response_pydantic_format():
    validator_responses = ResponsesAgentValidator()
    response_pydantic = ResponsesAgentResponse(
        output=[
            {
                "type": "message",
                "id": "123",
                "status": "completed",
                "role": "assistant",
                "content": [{"type": "output_text", "text": "Hello"}],
            }
        ]
    )

    result = validator_responses.validate_and_convert_result(response_pydantic)
    assert isinstance(result, dict)
    assert "output" in result


def test_validator_response_dataclass_format():
    validator_responses = ResponsesAgentValidator()
    valid_response = ResponsesAgentResponse(
        output=[
            {
                "type": "message",
                "id": "123",
                "status": "completed",
                "role": "assistant",
                "content": [{"type": "output_text", "text": "Hello"}],
            }
        ]
    )
    result = validator_responses.validate_and_convert_result(valid_response)
    assert isinstance(result, dict)
    assert "output" in result


def test_validator_stream_response_formats():
    validator_responses = ResponsesAgentValidator()
    # Test streaming response validation for different agent types
    stream_event = ResponsesAgentStreamEvent(
        type="response.output_item.done",
        item={
            "type": "message",
            "id": "123",
            "status": "completed",
            "role": "assistant",
            "content": [{"type": "output_text", "text": "Hello"}],
        },
    )

    result = validator_responses.validate_and_convert_result(stream_event, stream=True)
    assert isinstance(result, dict)


def test_arbitrary_dict_agent_fails_responses_validation():
    validator_responses = ResponsesAgentValidator()
    arbitrary_response = {
        "response": "Hello from ArbitraryDictAgent!",
        "arbitrary_field": "custom_value",
        "nested": {"data": "some nested content"},
    }

    # This should fail validation because it doesn't match ResponsesAgentResponse schema
    with pytest.raises(ValueError, match="Invalid data for ResponsesAgentResponse"):
        validator_responses.validate_and_convert_result(arbitrary_response)


def test_responses_agent_passes_validation():
    validator_responses = ResponsesAgentValidator()
    valid_response = {
        "output": [
            {
                "type": "message",
                "id": "123",
                "status": "completed",
                "role": "assistant",
                "content": [{"type": "output_text", "text": "Hello"}],
            }
        ]
    }

    # This should pass validation
    result = validator_responses.validate_and_convert_result(valid_response)
    assert isinstance(result, dict)
    assert "output" in result


def test_agent_server_initialization():
    server = AgentServer()
    assert server.agent_type is None
    assert server.validator is not None
    assert server.app.title == "Agent Server"


def test_agent_server_with_agent_type():
    server = AgentServer("ResponsesAgent")
    assert server.agent_type == "ResponsesAgent"


def test_agent_server_routes_registration():
    server = AgentServer()
    routes = [route.path for route in server.app.routes]
    assert "/invocations" in routes
    assert "/health" in routes


def test_invocations_endpoint_malformed_json():
    server = AgentServer()
    client = TestClient(server.app)

    response = client.post("/invocations", data="malformed json")
    assert response.status_code == 400
    response_json = response.json()
    assert "Invalid JSON in request body" in response_json["detail"]


def test_invocations_endpoint_missing_invoke_function():
    server = AgentServer()
    client = TestClient(server.app)

    response = client.post("/invocations", json={"test": "data"})
    assert response.status_code == 500
    response_json = response.json()
    assert "No invoke function registered" in response_json["detail"]


def test_invocations_endpoint_validation_error():
    server = AgentServer("ResponsesAgent")
    client = TestClient(server.app)

    # Send invalid request data for responses agent
    invalid_data = {"invalid": "structure"}
    response = client.post("/invocations", json=invalid_data)
    assert response.status_code == 400
    response_json = response.json()
    assert "Invalid parameters for ResponsesAgent" in response_json["detail"]


def test_invocations_endpoint_success_invoke():
    with patch("mlflow.start_span") as mock_span:
        # Mock the span context manager
        mock_span_instance = Mock()
        mock_span_instance.__enter__ = Mock(return_value=mock_span_instance)
        mock_span_instance.__exit__ = Mock(return_value=None)
        mock_span_instance.trace_id = "test-trace-id"
        mock_span.return_value = mock_span_instance

        @invoke()
        def test_invoke(request):
            return {
                "output": [
                    {
                        "type": "message",
                        "id": "123",
                        "status": "completed",
                        "role": "assistant",
                        "content": [{"type": "output_text", "text": "Hello"}],
                    }
                ]
            }

        server = AgentServer("ResponsesAgent")
        client = TestClient(server.app)

        request_data = {
            "input": [
                {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": "Hello"}],
                }
            ]
        }

        response = client.post("/invocations", json=request_data)
        assert response.status_code == 200
        response_json = response.json()
        assert "output" in response_json


def test_invocations_endpoint_success_stream():
    with patch("mlflow.start_span") as mock_span:
        # Mock the span context manager
        mock_span_instance = Mock()
        mock_span_instance.__enter__ = Mock(return_value=mock_span_instance)
        mock_span_instance.__exit__ = Mock(return_value=None)
        mock_span_instance.trace_id = "test-trace-id"
        mock_span.return_value = mock_span_instance

        @stream()
        def test_stream(request):
            yield ResponsesAgentStreamEvent(
                type="response.output_item.done",
                item={
                    "type": "message",
                    "id": "123",
                    "status": "completed",
                    "role": "assistant",
                    "content": [{"type": "output_text", "text": "Hello"}],
                },
            )

        server = AgentServer("ResponsesAgent")
        client = TestClient(server.app)

        request_data = {
            "input": [
                {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": "Hello"}],
                }
            ],
            "stream": True,
        }

        response = client.post("/invocations", json=request_data)
        assert response.status_code == 200
        assert response.headers["content-type"] == "text/event-stream; charset=utf-8"


def test_health_endpoint_returns_status():
    server = AgentServer()
    client = TestClient(server.app)

    response = client.get("/health")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["status"] == "healthy"


def test_request_headers_isolation():
    # Test that headers are isolated between contexts
    set_request_headers({"test": "value1"})
    assert get_request_headers()["test"] == "value1"

    # In a different context, headers should be independent
    ctx = contextvars.copy_context()

    def test_different_context():
        set_request_headers({"test": "value2"})
        return get_request_headers()["test"]

    result = ctx.run(test_different_context)
    assert result == "value2"
    # Original context should be unchanged
    assert get_request_headers()["test"] == "value1"


def test_tracing_span_creation():
    with patch("mlflow.start_span") as mock_span:
        mock_span_instance = Mock()
        mock_span_instance.__enter__ = Mock(return_value=mock_span_instance)
        mock_span_instance.__exit__ = Mock(return_value=None)
        mock_span.return_value = mock_span_instance

        @invoke()
        def test_function(request):
            return {"result": "success"}

        server = AgentServer()
        client = TestClient(server.app)

        client.post("/invocations", json={"test": "data"})
        # Verify span was created with correct name
        mock_span.assert_called_once_with(name="test_function")


def test_tracing_attributes_setting():
    with patch("mlflow.start_span") as mock_span:
        mock_span_instance = Mock()
        mock_span_instance.__enter__ = Mock(return_value=mock_span_instance)
        mock_span_instance.__exit__ = Mock(return_value=None)
        mock_span.return_value = mock_span_instance

        @invoke()
        def test_function(request):
            return {
                "output": [
                    {
                        "type": "message",
                        "id": "123",
                        "status": "completed",
                        "role": "assistant",
                        "content": [{"type": "output_text", "text": "Hello"}],
                    }
                ]
            }

        server = AgentServer("ResponsesAgent")
        client = TestClient(server.app)

        request_data = {
            "input": [
                {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": "Hello"}],
                }
            ]
        }

        client.post("/invocations", json=request_data)

        # Verify span was created (this is the main functionality we can reliably test)
        mock_span.assert_called_once_with(name="test_function")
        # Verify the span context manager was used
        mock_span_instance.__enter__.assert_called_once()
        mock_span_instance.__exit__.assert_called_once()


def test_chat_proxy_disabled_by_default():
    server = AgentServer()
    assert not hasattr(server, "proxy_client")


def test_chat_proxy_enabled():
    server = AgentServer(enable_chat_proxy=True)
    assert hasattr(server, "proxy_client")
    assert server.proxy_client is not None
    assert server.chat_proxy_timeout == 300.0


def test_chat_proxy_custom_timeout(monkeypatch):
    monkeypatch.setenv("CHAT_PROXY_TIMEOUT_SECONDS", "60.0")
    server = AgentServer(enable_chat_proxy=True)
    assert server.proxy_client is not None
    assert server.chat_proxy_timeout == 60.0


@pytest.mark.asyncio
async def test_chat_proxy_forwards_unmatched_requests():
    @invoke()
    def test_invoke(request):
        return {
            "output": [
                {
                    "type": "message",
                    "id": "123",
                    "status": "completed",
                    "role": "assistant",
                    "content": [{"type": "output_text", "text": "Hello"}],
                }
            ]
        }

    server = AgentServer("ResponsesAgent", enable_chat_proxy=True)
    client = TestClient(server.app)

    mock_response = Mock()
    mock_response.content = b'{"chat": "response"}'
    mock_response.status_code = 200
    mock_response.headers = {"content-type": "application/json"}

    with patch.object(server.proxy_client, "request", return_value=mock_response) as mock_request:
        response = client.get("/unmatched/path")
        assert response.status_code == 200
        assert response.content == b'{"chat": "response"}'
        mock_request.assert_called_once()


@pytest.mark.asyncio
async def test_chat_proxy_does_not_forward_matched_routes():
    @invoke()
    def test_invoke(request):
        return {
            "output": [
                {
                    "type": "message",
                    "id": "123",
                    "status": "completed",
                    "role": "assistant",
                    "content": [{"type": "output_text", "text": "Hello"}],
                }
            ]
        }

    server = AgentServer("ResponsesAgent", enable_chat_proxy=True)
    client = TestClient(server.app)

    with patch.object(server.proxy_client, "request") as mock_request:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}
        mock_request.assert_not_called()


@pytest.mark.asyncio
async def test_chat_proxy_handles_connect_error():
    server = AgentServer(enable_chat_proxy=True)
    client = TestClient(server.app)

    with patch.object(
        server.proxy_client, "request", side_effect=httpx.ConnectError("Connection failed")
    ):
        response = client.get("/unmatched/path")
        assert response.status_code == 503
        assert response.text == "Service unavailable"


@pytest.mark.asyncio
async def test_chat_proxy_handles_general_error():
    server = AgentServer(enable_chat_proxy=True)
    client = TestClient(server.app)

    with patch.object(server.proxy_client, "request", side_effect=Exception("Unexpected error")):
        response = client.get("/unmatched/path")
        assert response.status_code == 502
        assert "Proxy error: Unexpected error" in response.text


@pytest.mark.asyncio
async def test_chat_proxy_forwards_post_requests_with_body():
    server = AgentServer(enable_chat_proxy=True)
    client = TestClient(server.app)

    mock_response = Mock()
    mock_response.content = b'{"result": "success"}'
    mock_response.status_code = 200
    mock_response.headers = {"content-type": "application/json"}

    with patch.object(server.proxy_client, "request", return_value=mock_response) as mock_request:
        response = client.post("/chat/api", json={"message": "hello"})
        assert response.status_code == 200
        assert response.content == b'{"result": "success"}'

        call_args = mock_request.call_args
        assert call_args.kwargs["method"] == "POST"
        assert call_args.kwargs["content"] is not None


@pytest.mark.asyncio
async def test_chat_proxy_respects_chat_app_port_env_var(monkeypatch):
    monkeypatch.setenv("CHAT_APP_PORT", "8080")
    server = AgentServer(enable_chat_proxy=True)
    client = TestClient(server.app)

    mock_response = Mock()
    mock_response.content = b"test"
    mock_response.status_code = 200
    mock_response.headers = {}

    with patch.object(server.proxy_client, "request", return_value=mock_response) as mock_request:
        client.get("/test")
        mock_request.assert_called_once()
        call_args = mock_request.call_args
        assert call_args.kwargs["url"] == "http://localhost:8080/test"
```

--------------------------------------------------------------------------------

---[FILE: test_genai_import_without_agent_sdk.py]---
Location: mlflow-master/tests/genai/test_genai_import_without_agent_sdk.py

```python
from unittest.mock import patch

import pytest

from mlflow.genai.datasets import create_dataset, delete_dataset, get_dataset
from mlflow.genai.scorers import (
    delete_scorer,
    get_scorer,
    list_scorers,
)
from mlflow.genai.scorers.base import Scorer


# Test `mlflow.genai` namespace
def test_mlflow_genai_star_import_succeeds():
    import mlflow.genai  # noqa: F401


def test_namespaced_import_raises_when_agents_not_installed():
    # Ensure that databricks-agents methods renamespaced under mlflow.genai raise an
    # ImportError when the databricks-agents package is not installed.
    import mlflow.genai

    # Mock to simulate Databricks environment without databricks-agents installed
    with patch("mlflow.genai.datasets.is_databricks_uri", return_value=True):
        with pytest.raises(ImportError, match="The `databricks-agents` package is required"):
            mlflow.genai.create_dataset("test_schema")

        with pytest.raises(ImportError, match="The `databricks-agents` package is required"):
            mlflow.genai.get_dataset("test_schema")

        with pytest.raises(ImportError, match="The `databricks-agents` package is required"):
            mlflow.genai.delete_dataset("test_schema")


# Test `mlflow.genai.datasets` namespace
def test_mlflow_genai_datasets_star_import_succeeds():
    import mlflow.genai.datasets  # noqa: F401


def test_create_dataset_raises_when_agents_not_installed():
    # Mock to simulate Databricks environment without databricks-agents installed
    with patch("mlflow.genai.datasets.is_databricks_uri", return_value=True):
        with pytest.raises(ImportError, match="The `databricks-agents` package is required"):
            create_dataset("test_dataset")


def test_get_dataset_raises_when_agents_not_installed():
    # Mock to simulate Databricks environment without databricks-agents installed
    with patch("mlflow.genai.datasets.is_databricks_uri", return_value=True):
        with pytest.raises(ImportError, match="The `databricks-agents` package is required"):
            get_dataset("test_dataset")


def test_delete_dataset_raises_when_agents_not_installed():
    # Mock to simulate Databricks environment without databricks-agents installed
    with patch("mlflow.genai.datasets.is_databricks_uri", return_value=True):
        with pytest.raises(ImportError, match="The `databricks-agents` package is required"):
            delete_dataset("test_dataset")


class MockScorer(Scorer):
    """Mock scorer for testing purposes."""

    name: str = "mock_scorer"

    def __call__(self, *, outputs=None, **kwargs):
        return {"score": 1.0}


def test_list_scorers_raises_when_agents_not_installed():
    with patch(
        "mlflow.tracking._tracking_service.utils.get_tracking_uri", return_value="databricks"
    ):
        with pytest.raises(ImportError, match="The `databricks-agents` package is required"):
            list_scorers(experiment_id="test_experiment")


def test_get_scorer_raises_when_agents_not_installed():
    with patch(
        "mlflow.tracking._tracking_service.utils.get_tracking_uri", return_value="databricks"
    ):
        with pytest.raises(ImportError, match="The `databricks-agents` package is required"):
            get_scorer(name="test_scorer", experiment_id="test_experiment")


def test_delete_scorer_raises_when_agents_not_installed():
    with patch(
        "mlflow.tracking._tracking_service.utils.get_tracking_uri", return_value="databricks"
    ):
        with pytest.raises(ImportError, match="The `databricks-agents` package is required"):
            delete_scorer(experiment_id="test_experiment", name="test_scorer")
```

--------------------------------------------------------------------------------

---[FILE: test_git_versioning.py]---
Location: mlflow-master/tests/genai/test_git_versioning.py

```python
import subprocess
from pathlib import Path
from unittest import mock

import pytest

import mlflow
from mlflow.genai import disable_git_model_versioning, enable_git_model_versioning
from mlflow.genai.git_versioning import _get_active_git_context
from mlflow.utils.mlflow_tags import MLFLOW_GIT_DIFF


@pytest.fixture(autouse=True)
def cleanup_active_context():
    yield
    disable_git_model_versioning()


TEST_FILENAME = "test.txt"


@pytest.fixture
def tmp_git_repo(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    path = tmp_path / "test_repo"
    path.mkdir()
    subprocess.check_call(["git", "init"], cwd=path)
    subprocess.check_call(["git", "config", "user.name", "test"], cwd=path)
    subprocess.check_call(["git", "config", "user.email", "test@example.com"], cwd=path)
    (path / TEST_FILENAME).touch()
    subprocess.check_call(["git", "add", "."], cwd=path)
    subprocess.check_call(["git", "commit", "-m", "init"], cwd=path)
    monkeypatch.chdir(path)
    return path


def test_enable_git_model_versioning(monkeypatch: pytest.MonkeyPatch, tmp_git_repo: Path):
    context = enable_git_model_versioning()
    assert context.info.commit is not None
    assert context.info.branch is not None
    assert context.info.dirty is False
    assert context.info.diff is None  # Clean repo has no diff

    # Create a dummy file to make the repo dirty
    Path(tmp_git_repo / "dummy.txt").touch()
    context = enable_git_model_versioning()
    # Untracked files should not be considered dirty
    assert context.info.dirty is False
    assert context.info.diff is None  # No diff for untracked files

    # Checkout a new branch
    subprocess.check_call(["git", "checkout", "-b", "new-branch"], cwd=tmp_git_repo)
    context = enable_git_model_versioning()
    assert context.info.branch == "new-branch"


def test_disable_git_model_versioning_in_non_git_repo(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
):
    monkeypatch.chdir(tmp_path)
    with mock.patch("mlflow.genai.git_versioning._logger.warning") as mock_warning:
        context = enable_git_model_versioning()

    mock_warning.assert_called_once()
    warning_message = mock_warning.call_args[0][0]
    assert "Encountered an error while retrieving git information" in warning_message
    assert "Git model versioning is disabled" in warning_message
    assert context.info is None
    assert context.active_model is None


def test_enable_git_model_versioning_context_manager(tmp_git_repo: Path):
    assert _get_active_git_context() is None

    with enable_git_model_versioning() as context:
        assert _get_active_git_context() is context

    assert _get_active_git_context() is None


def test_disable_git_model_versioning_resets_context(tmp_git_repo: Path):
    with enable_git_model_versioning() as context:
        assert _get_active_git_context() is context
        disable_git_model_versioning()
        assert _get_active_git_context() is None


def test_enable_git_model_versioning_sets_active_context(tmp_git_repo: Path):
    assert _get_active_git_context() is None

    context = enable_git_model_versioning()
    assert _get_active_git_context() is context

    disable_git_model_versioning()
    assert _get_active_git_context() is None


def test_enable_git_model_versioning_creates_initial_logged_model(tmp_git_repo: Path):
    with enable_git_model_versioning() as context:
        assert mlflow.get_active_model_id() == context.active_model.model_id
        models = mlflow.search_logged_models(output_format="list")
        assert len(models) == 1
        assert models[0].model_id == context.active_model.model_id
        assert models[0].tags.items() >= context.info.to_mlflow_tags().items()
    assert mlflow.get_active_model_id() is None


def test_enable_git_model_versioning_reuses_model_when_no_changes(tmp_git_repo: Path):
    # Create initial model
    with enable_git_model_versioning() as context:
        initial_model_id = context.active_model.model_id
    assert mlflow.get_active_model_id() is None

    # No git state changes, should reuse the same model
    with enable_git_model_versioning() as context:
        assert mlflow.get_active_model_id() == initial_model_id
        models = mlflow.search_logged_models(output_format="list")
        assert len(models) == 1
        assert models[0].model_id == initial_model_id
    assert mlflow.get_active_model_id() is None


def test_enable_git_model_versioning_creates_new_model_on_commit(tmp_git_repo: Path):
    # Create initial model
    with enable_git_model_versioning() as context:
        initial_model_id = context.active_model.model_id
    assert mlflow.get_active_model_id() is None

    # Make a new commit
    subprocess.check_call(["git", "commit", "--allow-empty", "-m", "commit"], cwd=tmp_git_repo)

    # Should create a new logged model
    with enable_git_model_versioning() as context:
        assert mlflow.get_active_model_id() != initial_model_id
        assert mlflow.get_active_model_id() == context.active_model.model_id
        models = mlflow.search_logged_models(output_format="list")
        assert len(models) == 2
        assert models[0].model_id == context.active_model.model_id
        assert models[0].tags.items() >= context.info.to_mlflow_tags().items()
    assert mlflow.get_active_model_id() is None


def test_enable_git_model_versioning_creates_new_model_on_dirty_repo(tmp_git_repo: Path):
    # Create initial model
    with enable_git_model_versioning() as context:
        initial_model_id = context.active_model.model_id
    assert mlflow.get_active_model_id() is None

    # Modify a tracked file to make the repo dirty
    (tmp_git_repo / TEST_FILENAME).write_text("Updated content")

    # Should create a new logged model
    with enable_git_model_versioning() as context:
        assert mlflow.get_active_model_id() != initial_model_id
        assert mlflow.get_active_model_id() == context.active_model.model_id
        models = mlflow.search_logged_models(output_format="list")
        assert len(models) == 2
        assert models[0].model_id == context.active_model.model_id
        assert models[0].tags.items() >= context.info.to_mlflow_tags().items()
    assert mlflow.get_active_model_id() is None


def test_enable_git_model_versioning_ignores_untracked_files(tmp_git_repo: Path):
    # Create initial model
    with enable_git_model_versioning() as context:
        initial_model_id = context.active_model.model_id
    assert mlflow.get_active_model_id() is None

    # Create an untracked file
    (tmp_git_repo / "untracked.txt").touch()

    # Should NOT create a new logged model
    with enable_git_model_versioning() as context:
        assert mlflow.get_active_model_id() == initial_model_id
        models = mlflow.search_logged_models(output_format="list")
        assert len(models) == 1
        assert models[0].model_id == initial_model_id
    assert mlflow.get_active_model_id() is None


def test_enable_git_model_versioning_default_remote_name(tmp_git_repo: Path):
    subprocess.check_call(
        ["git", "remote", "add", "origin", "https://github.com/test/repo.git"], cwd=tmp_git_repo
    )
    context = enable_git_model_versioning()
    assert context.info.repo_url == "https://github.com/test/repo.git"


def test_enable_git_model_versioning_custom_remote_name(tmp_git_repo: Path):
    # Add multiple remotes
    subprocess.check_call(
        ["git", "remote", "add", "origin", "https://github.com/test/repo.git"],
        cwd=tmp_git_repo,
    )
    subprocess.check_call(
        ["git", "remote", "add", "upstream", "https://github.com/upstream/repo.git"],
        cwd=tmp_git_repo,
    )
    context = enable_git_model_versioning(remote_name="upstream")
    assert context.info.repo_url == "https://github.com/upstream/repo.git"


def test_enable_git_model_versioning_no_remote(tmp_git_repo: Path):
    # No remote - repo_url should be None
    context = enable_git_model_versioning()
    assert context.info.repo_url is None


def test_git_diff_collected_when_dirty(tmp_git_repo: Path):
    # Initially clean repo
    context = enable_git_model_versioning()
    assert context.info.dirty is False
    assert context.info.diff is None
    disable_git_model_versioning()

    # Modify a tracked file
    test_file = tmp_git_repo / TEST_FILENAME
    test_file.write_text("Modified content")

    # Should have diff now
    context = enable_git_model_versioning()
    assert context.info.dirty is True
    assert context.info.diff is not None
    assert "Modified content" in context.info.diff
    assert MLFLOW_GIT_DIFF in context.info.to_mlflow_tags()

    # Make another change
    with open(test_file, "a") as f:
        f.write("\nAnother change")

    # Both changes should be in the diff
    context = enable_git_model_versioning()
    model = mlflow.get_logged_model(context.active_model.model_id)
    assert "Modified content" in model.tags[MLFLOW_GIT_DIFF]
    assert "Another change" in model.tags[MLFLOW_GIT_DIFF]


def test_git_diff_includes_staged_changes(tmp_git_repo: Path):
    # Create two files
    file1 = tmp_git_repo / "file1.txt"
    file2 = tmp_git_repo / "file2.txt"
    file1.write_text("file1 content")
    file2.write_text("file2 content")

    # Stage file1
    subprocess.check_call(["git", "add", "file1.txt"], cwd=tmp_git_repo)

    # file2 remains unstaged (but untracked files don't show in diff)
    # So let's modify an existing tracked file instead
    (tmp_git_repo / TEST_FILENAME).write_text("modified content")

    context = enable_git_model_versioning()
    assert context.info.dirty is True
    assert context.info.diff is not None
    assert "file1 content" in context.info.diff  # Staged changes
    assert "modified content" in context.info.diff  # Unstaged changes
```

--------------------------------------------------------------------------------

---[FILE: test_scheduled_scorers.py]---
Location: mlflow-master/tests/genai/test_scheduled_scorers.py

```python
from mlflow.genai.scheduled_scorers import (
    ScorerScheduleConfig,
)
from mlflow.genai.scorers.base import Scorer


class MockScorer(Scorer):
    """Mock scorer for testing purposes."""

    name: str = "mock_scorer"

    def __call__(self, *, outputs=None, **kwargs):
        return {"score": 1.0}


def test_scheduled_scorer_class_instantiation():
    mock_scorer = MockScorer()
    scheduled_scorer = ScorerScheduleConfig(
        scorer=mock_scorer,
        scheduled_scorer_name="test_scorer",
        sample_rate=0.5,
        filter_string="test_filter",
    )

    assert scheduled_scorer.scorer == mock_scorer
    assert scheduled_scorer.scheduled_scorer_name == "test_scorer"
    assert scheduled_scorer.sample_rate == 0.5
    assert scheduled_scorer.filter_string == "test_filter"
```

--------------------------------------------------------------------------------

---[FILE: test_databricks_evaluation_dataset_source.py]---
Location: mlflow-master/tests/genai/datasets/test_databricks_evaluation_dataset_source.py

```python
import json

import pytest

from mlflow.genai.datasets.databricks_evaluation_dataset_source import (
    DatabricksEvaluationDatasetSource,
)


def test_databricks_evaluation_dataset_source_init():
    source = DatabricksEvaluationDatasetSource(
        table_name="catalog.schema.table", dataset_id="12345"
    )
    assert source.table_name == "catalog.schema.table"
    assert source.dataset_id == "12345"


def test_databricks_evaluation_dataset_source_get_source_type():
    assert DatabricksEvaluationDatasetSource._get_source_type() == "databricks_evaluation_dataset"


def test_databricks_evaluation_dataset_source_to_dict():
    source = DatabricksEvaluationDatasetSource(
        table_name="catalog.schema.table", dataset_id="12345"
    )
    assert source.to_dict() == {
        "table_name": "catalog.schema.table",
        "dataset_id": "12345",
    }


def test_databricks_evaluation_dataset_source_from_dict():
    source_dict = {"table_name": "catalog.schema.table", "dataset_id": "12345"}
    source = DatabricksEvaluationDatasetSource.from_dict(source_dict)
    assert source.table_name == "catalog.schema.table"
    assert source.dataset_id == "12345"


def test_databricks_evaluation_dataset_source_to_json():
    source = DatabricksEvaluationDatasetSource(
        table_name="catalog.schema.table", dataset_id="12345"
    )
    json_str = source.to_json()
    parsed = json.loads(json_str)
    assert parsed == {"table_name": "catalog.schema.table", "dataset_id": "12345"}


def test_databricks_evaluation_dataset_source_from_json():
    json_str = json.dumps({"table_name": "catalog.schema.table", "dataset_id": "12345"})
    source = DatabricksEvaluationDatasetSource.from_json(json_str)
    assert source.table_name == "catalog.schema.table"
    assert source.dataset_id == "12345"


def test_databricks_evaluation_dataset_source_load_not_implemented():
    source = DatabricksEvaluationDatasetSource(
        table_name="catalog.schema.table", dataset_id="12345"
    )
    with pytest.raises(
        NotImplementedError,
        match="Loading a Databricks Evaluation Dataset from source is not supported",
    ):
        source.load()


def test_databricks_evaluation_dataset_source_can_resolve():
    # _can_resolve should return False for all inputs
    assert DatabricksEvaluationDatasetSource._can_resolve({}) is False
    assert DatabricksEvaluationDatasetSource._can_resolve({"table_name": "test"}) is False


def test_databricks_evaluation_dataset_source_resolve_not_implemented():
    with pytest.raises(
        NotImplementedError, match="Resolution from a source dictionary is not supported"
    ):
        DatabricksEvaluationDatasetSource._resolve({})
```

--------------------------------------------------------------------------------

````
