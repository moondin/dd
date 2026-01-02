---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 762
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 762 of 991)

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

---[FILE: test_anthropic_autolog.py]---
Location: mlflow-master/tests/anthropic/test_anthropic_autolog.py

```python
import asyncio
import base64
from pathlib import Path
from typing import Any
from unittest.mock import patch

import anthropic
import pytest
from anthropic.types import Message, TextBlock, ToolUseBlock, Usage

import mlflow.anthropic
from mlflow.entities.span import SpanType
from mlflow.tracing.constant import SpanAttributeKey

from tests.tracing.helper import get_traces

DUMMY_CREATE_MESSAGE_REQUEST = {
    "model": "test_model",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "test message"}],
}

DUMMY_CREATE_MESSAGE_RESPONSE = Message(
    id="test_id",
    content=[TextBlock(text="test answer", type="text", citations=None)],
    model="test_model",
    role="assistant",
    stop_reason="end_turn",
    stop_sequence=None,
    type="message",
    usage=Usage(input_tokens=10, output_tokens=18),
)

# Ref: https://docs.anthropic.com/en/docs/build-with-claude/tool-use
DUMMY_CREATE_MESSAGE_WITH_TOOLS_REQUEST = {
    "model": "test_model",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "get_unit",
            "description": "Get the temperature unit commonly used in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g., San Francisco, CA",
                    },
                },
                "required": ["location"],
            },
        },
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g., San Francisco, CA",
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": 'The unit of temperature, "celsius" or "fahrenheit"',
                    },
                },
                "required": ["location", "unit"],
            },
        },
    ],
    "messages": [
        {"role": "user", "content": "What's the weather like in San Francisco?"},
        {
            "role": "assistant",
            "content": [
                {
                    "text": "<thinking>I need to use the get_unit first.</thinking>",
                    "type": "text",
                },
                {
                    "id": "tool_123",
                    "name": "get_unit",
                    "input": {"location": "San Francisco"},
                    "type": "tool_use",
                },
            ],
        },
        {
            "role": "user",
            "content": [
                {
                    "content": "celsius",
                    "type": "tool_result",
                    "tool_use_id": "tool_123",
                    "is_error": False,
                }
            ],
        },
    ],
}

DUMMY_CREATE_MESSAGE_WITH_TOOLS_RESPONSE = Message(
    id="test_id",
    content=[
        TextBlock(
            text="<thinking>Next, I need to use the get_weather</thinking>",
            type="text",
            citations=None,
        ),
        ToolUseBlock(
            id="tool_456",
            name="get_weather",
            input={"location": "San Francisco", "unit": "celsius"},
            type="tool_use",
        ),
    ],
    model="test_model",
    role="assistant",
    stop_reason="end_turn",
    stop_sequence=None,
    type="message",
    usage=Usage(
        input_tokens=10,
        output_tokens=18,
        cache_creation_input_tokens=None,
        cache_read_input_tokens=None,
    ),
)

_is_thinking_supported = False
try:
    from anthropic.types import ThinkingBlock

    _is_thinking_supported = True

    DUMMY_CREATE_MESSAGE_WITH_THINKING_REQUEST = {
        **DUMMY_CREATE_MESSAGE_REQUEST,
        "thinking": {"type": "enabled", "budget_tokens": 512},
    }

    DUMMY_CREATE_MESSAGE_WITH_THINKING_RESPONSE = DUMMY_CREATE_MESSAGE_RESPONSE.model_copy()
    DUMMY_CREATE_MESSAGE_WITH_THINKING_RESPONSE.content = [
        ThinkingBlock(
            type="thinking",
            thinking="I need to think about this for a while.",
            signature="ABC",
        ),
        TextBlock(
            text="test answer",
            type="text",
            citations=None,
        ),
    ]
except ImportError:
    pass


@pytest.fixture(params=[True, False], ids=["async", "sync"])
def is_async(request):
    return request.param


def _call_anthropic(request: dict[str, Any], mock_response: Message, is_async: bool):
    if is_async:
        with patch("anthropic._base_client.AsyncAPIClient.post", return_value=mock_response):
            client = anthropic.AsyncAnthropic(api_key="test_key")
            return asyncio.run(client.messages.create(**request))
    else:
        with patch("anthropic._base_client.SyncAPIClient.post", return_value=mock_response):
            client = anthropic.Anthropic(api_key="test_key")
            return client.messages.create(**request)


def test_messages_autolog(is_async):
    mlflow.anthropic.autolog()

    _call_anthropic(DUMMY_CREATE_MESSAGE_REQUEST, DUMMY_CREATE_MESSAGE_RESPONSE, is_async)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "AsyncMessages.create" if is_async else "Messages.create"
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs == DUMMY_CREATE_MESSAGE_REQUEST
    # Only keep input_tokens / output_tokens fields in usage dict.
    span.outputs["usage"] = {
        key: span.outputs["usage"][key] for key in ["input_tokens", "output_tokens"]
    }
    assert span.outputs == DUMMY_CREATE_MESSAGE_RESPONSE.to_dict()

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        "input_tokens": 10,
        "output_tokens": 18,
        "total_tokens": 28,
    }
    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "anthropic"

    assert traces[0].info.token_usage == {
        "input_tokens": 10,
        "output_tokens": 18,
        "total_tokens": 28,
    }

    mlflow.anthropic.autolog(disable=True)
    _call_anthropic(DUMMY_CREATE_MESSAGE_REQUEST, DUMMY_CREATE_MESSAGE_RESPONSE, is_async)

    # No new trace should be created
    traces = get_traces()
    assert len(traces) == 1


def test_messages_autolog_multi_modal(is_async):
    mlflow.anthropic.autolog()

    image_dir = Path(__file__).parent.parent / "resources" / "images"
    with open(image_dir / "test.png", "rb") as f:
        image_bytes = f.read()
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    dummy_multi_modal_request = {
        "model": "test_model",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What text is in this image?"},
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": image_base64,
                        },
                    },
                ],
            }
        ],
        "max_tokens": 1024,
    }

    _call_anthropic(dummy_multi_modal_request, DUMMY_CREATE_MESSAGE_RESPONSE, is_async)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "AsyncMessages.create" if is_async else "Messages.create"
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs == dummy_multi_modal_request

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        "input_tokens": 10,
        "output_tokens": 18,
        "total_tokens": 28,
    }
    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "anthropic"

    assert traces[0].info.token_usage == {
        "input_tokens": 10,
        "output_tokens": 18,
        "total_tokens": 28,
    }


def test_messages_autolog_tool_calling(is_async):
    mlflow.anthropic.autolog()

    _call_anthropic(
        DUMMY_CREATE_MESSAGE_WITH_TOOLS_REQUEST, DUMMY_CREATE_MESSAGE_WITH_TOOLS_RESPONSE, is_async
    )

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "AsyncMessages.create" if is_async else "Messages.create"
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs == DUMMY_CREATE_MESSAGE_WITH_TOOLS_REQUEST
    assert span.outputs == DUMMY_CREATE_MESSAGE_WITH_TOOLS_RESPONSE.to_dict(exclude_unset=False)

    assert span.get_attribute(SpanAttributeKey.CHAT_TOOLS) == [
        {
            "type": "function",
            "function": {
                "name": "get_unit",
                "description": "Get the temperature unit commonly used in a given location",
                "parameters": {
                    "properties": {
                        "location": {
                            "description": "The city and state, e.g., San Francisco, CA",
                            "type": "string",
                        },
                    },
                    "required": ["location"],
                    "type": "object",
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "parameters": {
                    "properties": {
                        "location": {
                            "description": "The city and state, e.g., San Francisco, CA",
                            "type": "string",
                        },
                        "unit": {
                            "description": 'The unit of temperature, "celsius" or "fahrenheit"',
                            "enum": ["celsius", "fahrenheit"],
                            "type": "string",
                        },
                    },
                    "required": ["location", "unit"],
                    "type": "object",
                },
            },
        },
    ]

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        "input_tokens": 10,
        "output_tokens": 18,
        "total_tokens": 28,
    }

    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "anthropic"

    assert traces[0].info.token_usage == {
        "input_tokens": 10,
        "output_tokens": 18,
        "total_tokens": 28,
    }


@pytest.mark.skipif(not _is_thinking_supported, reason="Thinking block is not supported")
def test_messages_autolog_with_thinking(is_async):
    mlflow.anthropic.autolog()

    _call_anthropic(
        DUMMY_CREATE_MESSAGE_WITH_THINKING_REQUEST,
        DUMMY_CREATE_MESSAGE_WITH_THINKING_RESPONSE,
        is_async,
    )

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "AsyncMessages.create" if is_async else "Messages.create"
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs == DUMMY_CREATE_MESSAGE_WITH_THINKING_REQUEST
    # Only keep input_tokens / output_tokens fields in usage dict.
    span.outputs["usage"] = {
        key: span.outputs["usage"][key] for key in ["input_tokens", "output_tokens"]
    }
    assert span.outputs == DUMMY_CREATE_MESSAGE_WITH_THINKING_RESPONSE.to_dict()

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        "input_tokens": 10,
        "output_tokens": 18,
        "total_tokens": 28,
    }
    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "anthropic"

    assert traces[0].info.token_usage == {
        "input_tokens": 10,
        "output_tokens": 18,
        "total_tokens": 28,
    }
```

--------------------------------------------------------------------------------

---[FILE: test_artifacts.py]---
Location: mlflow-master/tests/artifacts/test_artifacts.py

```python
import pathlib
import uuid
from typing import NamedTuple
from unittest import mock

import pytest

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.utils.file_utils import mkdir, path_to_local_file_uri
from mlflow.utils.os import is_windows


class Artifact(NamedTuple):
    uri: str
    content: str


@pytest.fixture
def run_with_artifact(tmp_path):
    artifact_path = "test"
    artifact_content = "content"
    local_path = tmp_path.joinpath("file.txt")
    local_path.write_text(artifact_content)
    with mlflow.start_run() as run:
        mlflow.log_artifact(local_path, artifact_path)

    return (run, artifact_path, artifact_content)


@pytest.fixture
def run_with_artifacts(tmp_path):
    artifact_path = "test"
    artifact_content = "content"

    local_dir = tmp_path / "dir"
    local_dir.mkdir()
    local_dir.joinpath("file.txt").write_text(artifact_content)
    local_dir.joinpath("subdir").mkdir()
    local_dir.joinpath("subdir").joinpath("text.txt").write_text(artifact_content)

    with mlflow.start_run() as run:
        mlflow.log_artifact(local_dir, artifact_path)

    return (run, artifact_path)


def test_download_artifacts_with_uri(run_with_artifact):
    run, artifact_path, artifact_content = run_with_artifact
    run_uri = f"runs:/{run.info.run_id}/{artifact_path}"
    actual_uri = str(pathlib.PurePosixPath(run.info.artifact_uri) / artifact_path)
    for uri in (run_uri, actual_uri):
        download_output_path = mlflow.artifacts.download_artifacts(artifact_uri=uri)
        downloaded_artifact_path = next(pathlib.Path(download_output_path).iterdir())
        assert downloaded_artifact_path.read_text() == artifact_content


def test_download_artifacts_with_run_id_and_path(run_with_artifact):
    run, artifact_path, artifact_content = run_with_artifact
    download_output_path = mlflow.artifacts.download_artifacts(
        run_id=run.info.run_id, artifact_path=artifact_path
    )
    downloaded_artifact_path = next(pathlib.Path(download_output_path).iterdir())
    assert downloaded_artifact_path.read_text() == artifact_content


def test_download_artifacts_with_run_id_no_path(run_with_artifact):
    run, artifact_path, _ = run_with_artifact
    artifact_relative_path_top_level_dir = pathlib.PurePosixPath(artifact_path).parts[0]
    downloaded_output_path = mlflow.artifacts.download_artifacts(run_id=run.info.run_id)
    downloaded_artifact_directory_name = next(pathlib.Path(downloaded_output_path).iterdir()).name
    assert downloaded_artifact_directory_name == artifact_relative_path_top_level_dir


@pytest.mark.parametrize("dst_subdir_path", [None, "doesnt_exist_yet/subdiir"])
def test_download_artifacts_with_dst_path(run_with_artifact, tmp_path, dst_subdir_path):
    run, artifact_path, _ = run_with_artifact
    dst_path = tmp_path / dst_subdir_path if dst_subdir_path else tmp_path

    download_output_path = mlflow.artifacts.download_artifacts(
        run_id=run.info.run_id, artifact_path=artifact_path, dst_path=dst_path
    )
    assert pathlib.Path(download_output_path).samefile(dst_path / artifact_path)


def test_download_artifacts_throws_for_invalid_arguments():
    with pytest.raises(MlflowException, match="Exactly one of"):
        mlflow.artifacts.download_artifacts(
            run_id="run_id", artifact_path="path", artifact_uri="uri"
        )

    with pytest.raises(MlflowException, match="Exactly one of"):
        mlflow.artifacts.download_artifacts()

    with pytest.raises(MlflowException, match="`artifact_path` cannot be specified"):
        mlflow.artifacts.download_artifacts(artifact_path="path", artifact_uri="uri")


@pytest.fixture
def run_with_text_artifact():
    artifact_path = "test/file.txt"
    artifact_content = "This is a sentence"
    with mlflow.start_run() as run:
        mlflow.log_text(artifact_content, artifact_path)

    artifact_uri = str(pathlib.PurePosixPath(run.info.artifact_uri) / artifact_path)
    return Artifact(artifact_uri, artifact_content)


@pytest.fixture
def run_with_json_artifact():
    artifact_path = "test/config.json"
    artifact_content = {"mlflow-version": "0.28", "n_cores": "10"}
    with mlflow.start_run() as run:
        mlflow.log_dict(artifact_content, artifact_path)

    artifact_uri = str(pathlib.PurePosixPath(run.info.artifact_uri) / artifact_path)
    return Artifact(artifact_uri, artifact_content)


@pytest.fixture
def run_with_image_artifact():
    from PIL import Image

    artifact_path = "test/image.png"
    image = Image.new("RGB", (100, 100))
    with mlflow.start_run() as run:
        mlflow.log_image(image, artifact_path)

    artifact_uri = str(pathlib.PurePosixPath(run.info.artifact_uri) / artifact_path)
    return Artifact(artifact_uri, image)


def test_load_text(run_with_text_artifact):
    artifact = run_with_text_artifact
    assert mlflow.artifacts.load_text(artifact.uri) == artifact.content


def test_load_dict(run_with_json_artifact):
    artifact = run_with_json_artifact
    assert mlflow.artifacts.load_dict(artifact.uri) == artifact.content


def test_load_json_invalid_json(run_with_text_artifact):
    artifact = run_with_text_artifact
    with pytest.raises(mlflow.exceptions.MlflowException, match="Unable to form a JSON object"):
        mlflow.artifacts.load_dict(artifact.uri)


def test_load_image(run_with_image_artifact):
    from PIL import Image

    artifact = run_with_image_artifact
    assert isinstance(mlflow.artifacts.load_image(artifact.uri), Image.Image)


def test_load_image_invalid_image(run_with_text_artifact):
    artifact = run_with_text_artifact
    with pytest.raises(
        mlflow.exceptions.MlflowException, match="Unable to form a PIL Image object"
    ):
        mlflow.artifacts.load_image(artifact.uri)


class ArtifactReturnType(NamedTuple):
    tmp_path: pathlib.Path
    artifact_path: pathlib.Path
    artifact_name: str


@pytest.fixture
def text_artifact(tmp_path):
    artifact_name = "test.txt"
    artifacts_root_tmp = mkdir(tmp_path.joinpath(str(uuid.uuid4())))
    test_artifact_path = artifacts_root_tmp.joinpath(artifact_name)
    test_artifact_path.write_text("test")
    return ArtifactReturnType(artifacts_root_tmp, test_artifact_path, artifact_name)


def _assert_artifact_uri(expected_artifact_path: pathlib.Path, test_artifact):
    mlflow.log_artifact(test_artifact.artifact_path)
    assert expected_artifact_path.exists()


def test_default_relative_artifact_uri_resolves(text_artifact, tmp_path, monkeypatch):
    tracking_uri = path_to_local_file_uri(text_artifact.tmp_path.joinpath("mlruns"))
    mlflow.set_tracking_uri(tracking_uri)
    monkeypatch.chdir(tmp_path)
    experiment_id = mlflow.create_experiment("test_exp_a", "test_artifacts_root")
    with mlflow.start_run(experiment_id=experiment_id) as run:
        _assert_artifact_uri(
            tmp_path.joinpath(
                "test_artifacts_root",
                run.info.run_id,
                "artifacts",
                text_artifact.artifact_name,
            ),
            text_artifact,
        )


def test_custom_relative_artifact_uri_resolves(text_artifact):
    tracking_uri = path_to_local_file_uri(text_artifact.tmp_path.joinpath("tracking"))
    artifacts_root_path = text_artifact.tmp_path.joinpath("test_artifacts")
    artifacts_root_uri = path_to_local_file_uri(artifacts_root_path)
    mlflow.set_tracking_uri(tracking_uri)
    experiment_id = mlflow.create_experiment("test_exp_b", artifacts_root_uri)
    with mlflow.start_run(experiment_id=experiment_id) as run:
        _assert_artifact_uri(
            artifacts_root_path.joinpath(run.info.run_id, "artifacts", text_artifact.artifact_name),
            text_artifact,
        )


def test_artifact_logging_resolution_works_with_non_root_working_directory(tmp_path, monkeypatch):
    text_file = tmp_path.joinpath("test.txt")
    text_file.write_text("test")
    cwd = tmp_path.joinpath("cwd")
    cwd.mkdir()
    monkeypatch.chdir(cwd)
    experiment_id = mlflow.create_experiment("test_exp_c", "some_path")
    not_cwd = tmp_path.joinpath("not_cwd")
    not_cwd.mkdir()
    monkeypatch.chdir(not_cwd)

    with mlflow.start_run(experiment_id=experiment_id) as run:
        _assert_artifact_uri(
            cwd.joinpath("some_path", run.info.run_id, "artifacts", text_file.name),
            ArtifactReturnType(tmp_path, text_file, text_file.name),
        )


@pytest.mark.skipif(not is_windows(), reason="This test only passes on Windows")
def test_log_artifact_windows_path_with_hostname(text_artifact):
    experiment_test_1_artifact_location = r"\\my_server\my_path\my_sub_path\1"
    experiment_test_1_id = mlflow.create_experiment(
        "test_exp_d", experiment_test_1_artifact_location
    )
    with mlflow.start_run(experiment_id=experiment_test_1_id) as run:
        with (
            mock.patch("shutil.copy2") as copyfile_mock,
            mock.patch("os.path.exists", return_value=True) as exists_mock,
        ):
            mlflow.log_artifact(text_artifact.artifact_path)
            exists_mock.assert_called_once()
            copyfile_mock.assert_called_once_with(
                text_artifact.artifact_path,
                (
                    rf"{experiment_test_1_artifact_location}\{run.info.run_id}"
                    rf"\artifacts\{text_artifact.artifact_name}"
                ),
            )


def test_list_artifacts_with_artifact_uri(run_with_artifacts):
    run, artifact_path = run_with_artifacts
    run_uri = f"runs:/{run.info.run_id}/{artifact_path}"
    actual_uri = str(pathlib.PurePosixPath(run.info.artifact_uri) / artifact_path)
    for uri in (run_uri, actual_uri):
        artifacts = mlflow.artifacts.list_artifacts(artifact_uri=uri)
        assert len(artifacts) == 1
        assert artifacts[0].path == f"{artifact_path}/dir"

        artifacts = mlflow.artifacts.list_artifacts(artifact_uri=f"{uri}/dir")
        assert len(artifacts) == 2
        assert artifacts[0].path == "dir/file.txt"
        assert artifacts[1].path == "dir/subdir"

        artifacts = mlflow.artifacts.list_artifacts(artifact_uri=f"{uri}/dir/subdir")
        assert len(artifacts) == 1
        assert artifacts[0].path == "subdir/text.txt"

        artifacts = mlflow.artifacts.list_artifacts(artifact_uri=f"{uri}/non-exist-path")
        assert len(artifacts) == 0


def test_list_artifacts_with_run_id(run_with_artifacts):
    run, artifact_path = run_with_artifacts
    artifacts = mlflow.artifacts.list_artifacts(run_id=run.info.run_id)
    assert len(artifacts) == 1
    assert artifacts[0].path == artifact_path

    artifacts = mlflow.artifacts.list_artifacts(run_id=run.info.run_id, artifact_path=artifact_path)
    assert len(artifacts) == 1
    assert artifacts[0].path == f"{artifact_path}/dir"


def test_list_artifacts_throws_for_invalid_arguments():
    with pytest.raises(MlflowException, match="Exactly one of"):
        mlflow.artifacts.list_artifacts(
            artifact_uri="uri",
            run_id="run_id",
            artifact_path="path",
        )

    with pytest.raises(MlflowException, match="Exactly one of"):
        mlflow.artifacts.list_artifacts()

    with pytest.raises(MlflowException, match="`artifact_path` cannot be specified"):
        mlflow.artifacts.list_artifacts(artifact_uri="uri", artifact_path="path")


def test_download_artifacts_with_run_id_and_artifact_path(tmp_path):
    class DummyModel(mlflow.pyfunc.PythonModel):
        def predict(self, context, model_input: list[str]) -> list[str]:
            return model_input

    with mlflow.start_run() as run:
        mlflow.pyfunc.log_model(name="model", python_model=DummyModel())
    mlflow.artifacts.download_artifacts(
        run_id=run.info.run_id, artifact_path="model", dst_path=tmp_path
    )


def test_list_artifacts_with_client_and_tracking_uri(tmp_path: pathlib.Path):
    tracking_uri = f"sqlite:///{tmp_path}/mlflow-{uuid.uuid4().hex}.db"
    assert mlflow.get_tracking_uri() != tracking_uri
    client = mlflow.MlflowClient(tracking_uri)
    experiment_id = client.create_experiment("my_experiment")
    run = client.create_run(experiment_id)
    tmp_dir = tmp_path / "subdir"
    tmp_dir.mkdir()
    tmp_file = tmp_dir / "file.txt"
    tmp_file.touch()
    client.log_artifacts(run.info.run_id, tmp_dir, "subdir")

    artifacts = mlflow.artifacts.list_artifacts(
        run_id=run.info.run_id,
        tracking_uri=tracking_uri,
    )
    assert [p.path for p in artifacts] == ["subdir"]

    artifacts = mlflow.artifacts.list_artifacts(
        run_id=run.info.run_id,
        artifact_path="subdir",
        tracking_uri=tracking_uri,
    )
    assert [p.path for p in artifacts] == ["subdir/file.txt"]


def test_download_artifacts_with_client_and_tracking_uri(tmp_path: pathlib.Path):
    tracking_uri = f"sqlite:///{tmp_path}/mlflow-{uuid.uuid4().hex}.db"
    assert mlflow.get_tracking_uri() != tracking_uri
    client = mlflow.MlflowClient(tracking_uri)
    experiment_id = client.create_experiment("my_experiment")
    run = client.create_run(experiment_id)
    tmp_dir = tmp_path / "subdir"
    tmp_dir.mkdir()
    tmp_file = tmp_dir / "file.txt"
    tmp_file.touch()
    client.log_artifacts(run.info.run_id, tmp_dir, "subdir")

    dst_path = tmp_path / "dst"
    mlflow.artifacts.download_artifacts(
        run_id=run.info.run_id,
        artifact_path="subdir",
        tracking_uri=tracking_uri,
        dst_path=dst_path,
    )
    assert tmp_file.name in [p.name for p in dst_path.rglob("*")]


def test_single_run_artifact_download_when_both_run_and_model_artifacts_exist(tmp_path):
    class DummyModel(mlflow.pyfunc.PythonModel):
        def predict(self, model_input: list[str]) -> list[str]:
            return model_input

    with mlflow.start_run() as run:
        mlflow.pyfunc.log_model(python_model=DummyModel(), name="model")
        mlflow.log_text("test", "model/file.txt")

    out = mlflow.artifacts.download_artifacts(
        run_id=run.info.run_id, artifact_path="model/file.txt", dst_path=tmp_path
    )
    assert pathlib.Path(out).read_text() == "test"
```

--------------------------------------------------------------------------------

---[FILE: test_autogen_autolog.py]---
Location: mlflow-master/tests/autogen/test_autogen_autolog.py

```python
import pytest
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import MultiModalMessage
from autogen_core import FunctionCall, Image
from autogen_core.models import CreateResult
from autogen_ext.models.replay import ReplayChatCompletionClient

import mlflow
from mlflow.entities.span import SpanType
from mlflow.tracing.constant import SpanAttributeKey

from tests.tracing.helper import get_traces

_SYSTEM_MESSAGE = "You are a helpful assistant."
_MODEL_USAGE = {"prompt_tokens": 6, "completion_tokens": 1}


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "disable",
    [True, False],
)
async def test_autolog_assistant_agent(disable):
    model_client = ReplayChatCompletionClient(
        ["2"],
    )
    agent = AssistantAgent("assistant", model_client=model_client, system_message=_SYSTEM_MESSAGE)

    mlflow.autogen.autolog(disable=disable)

    await agent.run(task="1+1")

    traces = get_traces()

    if disable:
        assert len(traces) == 0
    else:
        assert len(traces) == 1
        trace = traces[0]
        assert trace.info.status == "OK"
        assert len(trace.data.spans) == 3
        span = trace.data.spans[0]
        assert span.name == "assistant.run"
        assert span.span_type == SpanType.AGENT
        assert span.inputs == {"task": "1+1"}
        messages = span.outputs["messages"]
        assert len(messages) == 2
        assert (
            messages[0].items()
            >= {
                "content": "1+1",
                "source": "user",
                "models_usage": None,
                "metadata": {},
                "type": "TextMessage",
            }.items()
        )
        assert (
            messages[1].items()
            >= {
                "content": "2",
                "source": "assistant",
                "models_usage": _MODEL_USAGE,
                "metadata": {},
                "type": "TextMessage",
            }.items()
        )

        span = trace.data.spans[1]
        assert span.name == "assistant.on_messages"
        assert span.span_type == SpanType.AGENT
        assert (
            span.outputs["chat_message"].items()
            >= {
                "source": "assistant",
                "models_usage": _MODEL_USAGE,
                "metadata": {},
                "content": "2",
                "type": "TextMessage",
            }.items()
        )

        span = trace.data.spans[2]
        assert span.name == "ReplayChatCompletionClient.create"
        assert span.span_type == SpanType.LLM
        assert span.inputs["messages"] == [
            {"content": _SYSTEM_MESSAGE, "type": "SystemMessage"},
            {"content": "1+1", "source": "user", "type": "UserMessage"},
        ]
        assert span.outputs["content"] == "2"

        assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
            "input_tokens": 6,
            "output_tokens": 1,
            "total_tokens": 7,
        }

        assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "autogen"

        assert traces[0].info.token_usage == {
            "input_tokens": 6,
            "output_tokens": 1,
            "total_tokens": 7,
        }


@pytest.mark.asyncio
async def test_autolog_tool_agent():
    model_client = ReplayChatCompletionClient(
        [
            CreateResult(
                content=[FunctionCall(id="1", arguments='{"number": 1}', name="increment_number")],
                finish_reason="function_calls",
                usage=_MODEL_USAGE,
                cached=False,
            ),
        ],
    )
    model_client.model_info["function_calling"] = True
    TOOL_ATTRIBUTES = [
        {
            "function": {
                "name": "increment_number",
                "description": "Increment a number by 1.",
                "parameters": {
                    "type": "object",
                    "properties": {"number": {"description": "number", "type": "integer"}},
                    "required": ["number"],
                    "additionalProperties": False,
                },
                "strict": False,
            },
            "type": "function",
        }
    ]

    def increment_number(number: int) -> int:
        """Increment a number by 1."""
        return number + 1

    agent = AssistantAgent(
        "assistant",
        model_client=model_client,
        system_message=_SYSTEM_MESSAGE,
        tools=[increment_number],
    )
    mlflow.autogen.autolog()

    await agent.run(task="1+1")

    traces = get_traces()
    assert len(traces) == 1
    trace = traces[0]
    assert trace.info.status == "OK"
    assert len(trace.data.spans) == 3
    span = trace.data.spans[0]
    assert span.name == "assistant.run"
    assert span.span_type == SpanType.AGENT
    assert span.inputs == {"task": "1+1"}
    messages = span.outputs["messages"]
    assert len(messages) == 4
    assert (
        messages[0].items()
        >= {
            "content": "1+1",
            "source": "user",
            "models_usage": None,
            "metadata": {},
            "type": "TextMessage",
        }.items()
    )

    assert (
        messages[1].items()
        >= {
            "content": [
                {
                    "id": "1",
                    "arguments": '{"number": 1}',
                    "name": "increment_number",
                }
            ],
            "source": "assistant",
            "models_usage": _MODEL_USAGE,
            "metadata": {},
            "type": "ToolCallRequestEvent",
        }.items()
    )
    assert (
        messages[2].items()
        >= {
            "content": [
                {
                    "call_id": "1",
                    "content": "2",
                    "is_error": False,
                    "name": "increment_number",
                }
            ],
            "source": "assistant",
            "models_usage": None,
            "metadata": {},
            "type": "ToolCallExecutionEvent",
        }.items()
    )
    assert (
        messages[3].items()
        >= {
            "content": "2",
            "source": "assistant",
            "models_usage": None,
            "metadata": {},
            "type": "ToolCallSummaryMessage",
        }.items()
    )

    span = trace.data.spans[1]
    assert span.name == "assistant.on_messages"
    assert span.span_type == SpanType.AGENT
    assert (
        span.outputs["chat_message"].items()
        >= {
            "source": "assistant",
            "models_usage": None,
            "metadata": {},
            "content": "2",
            "type": "ToolCallSummaryMessage",
        }.items()
    )
    assert span.get_attribute("mlflow.chat.tools") == TOOL_ATTRIBUTES

    span = trace.data.spans[2]
    assert span.name == "ReplayChatCompletionClient.create"
    assert span.span_type == SpanType.LLM
    assert span.inputs["messages"] == [
        {"content": _SYSTEM_MESSAGE, "type": "SystemMessage"},
        {"content": "1+1", "source": "user", "type": "UserMessage"},
    ]
    assert span.get_attribute("mlflow.chat.tools") == TOOL_ATTRIBUTES
    assert span.outputs["content"] == [
        {"id": "1", "arguments": '{"number": 1}', "name": "increment_number"}
    ]

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        "input_tokens": 6,
        "output_tokens": 1,
        "total_tokens": 7,
    }

    assert traces[0].info.token_usage == {
        "input_tokens": 6,
        "output_tokens": 1,
        "total_tokens": 7,
    }


@pytest.mark.asyncio
async def test_autolog_multi_modal():
    import PIL

    pil_image = PIL.Image.new("RGB", (8, 8))
    img = Image(pil_image)
    user_message = "Can you describe the number in the image?"
    multi_modal_message = MultiModalMessage(content=[user_message, img], source="user")
    model_client = ReplayChatCompletionClient(
        ["2"],
    )
    agent = AssistantAgent("assistant", model_client=model_client, system_message=_SYSTEM_MESSAGE)
    mlflow.autogen.autolog()

    await agent.run(task=multi_modal_message)

    traces = get_traces()

    assert len(traces) == 1
    trace = traces[0]
    assert trace.info.status == "OK"
    assert len(trace.data.spans) == 3
    span = trace.data.spans[0]
    assert span.name == "assistant.run"
    assert span.span_type == SpanType.AGENT
    assert span.inputs["task"]["content"][0] == "Can you describe the number in the image?"
    assert "data" in span.inputs["task"]["content"][1]
    messages = span.outputs["messages"]
    assert len(messages) == 2
    assert (
        messages[0].items()
        >= {
            "content": [
                "Can you describe the number in the image?",
                {
                    "data": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAADElEQVR4nGNgGB4AAADIAAGtQHYiAAAAAElFTkSuQmCC",  # noqa: E501
                },
            ],
            "source": "user",
            "models_usage": None,
            "metadata": {},
            "type": "MultiModalMessage",
        }.items()
    )
    assert (
        messages[1].items()
        >= {
            "content": "2",
            "source": "assistant",
            "models_usage": {"completion_tokens": 1, "prompt_tokens": 14},
            "metadata": {},
            "type": "TextMessage",
        }.items()
    )

    span = trace.data.spans[1]
    assert span.name == "assistant.on_messages"
    assert span.span_type == SpanType.AGENT
    assert (
        span.outputs["chat_message"].items()
        >= {
            "source": "assistant",
            "models_usage": {"completion_tokens": 1, "prompt_tokens": 14},
            "metadata": {},
            "content": "2",
            "type": "TextMessage",
        }.items()
    )

    span = trace.data.spans[2]
    assert span.name == "ReplayChatCompletionClient.create"
    assert span.span_type == SpanType.LLM
    assert span.inputs["messages"] == [
        {"content": _SYSTEM_MESSAGE, "type": "SystemMessage"},
        {"content": f"{user_message}\n<image>", "source": "user", "type": "UserMessage"},
    ]
    assert span.outputs["content"] == "2"

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        "input_tokens": 14,
        "output_tokens": 1,
        "total_tokens": 15,
    }

    assert traces[0].info.token_usage == {
        "input_tokens": 14,
        "output_tokens": 1,
        "total_tokens": 15,
    }
```

--------------------------------------------------------------------------------

---[FILE: async_helper.py]---
Location: mlflow-master/tests/autologging/async_helper.py

```python
import asyncio
import inspect
from concurrent.futures import ThreadPoolExecutor

from mlflow.utils.autologging_utils.safety import update_wrapper_extended


def asyncify(is_async):
    """
    Decorator that converts a function to an async function if `is_async` is True. This is useful
    for testing purposes, where we want to test both synchronous and asynchronous code paths.
    """

    def decorator(fn):
        if is_async:

            async def async_fn(*args, **kwargs):
                if args and inspect.iscoroutinefunction(args[0]):
                    original = args[0]

                    def wrapped_original(*og_args, **og_kwargs):
                        # Run the original async function in a separate thread. This is a workaround
                        # for the fact that we cannot use asyncio.run here because an event loop is
                        # already running in the main thread.
                        with ThreadPoolExecutor() as executor:
                            future = executor.submit(asyncio.run, original(*og_args, **og_kwargs))
                            return future.result()

                    args = (update_wrapper_extended(wrapped_original, original), *args[1:])
                return fn(*args, **kwargs)

            return update_wrapper_extended(async_fn, fn)
        else:
            return fn

    return decorator


def run_sync_or_async(fn, *args, **kwargs):
    """Convenience function that runs a function synchronously regardless of whether it is async."""
    if inspect.iscoroutinefunction(fn):
        return asyncio.run(fn(*args, **kwargs))
    else:
        return fn(*args, **kwargs)
```

--------------------------------------------------------------------------------

````
