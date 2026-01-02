---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 800
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 800 of 991)

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

---[FILE: tools.py]---
Location: mlflow-master/tests/gateway/tools.py

```python
import asyncio
import json
import os
import signal
import subprocess
import sys
import threading
import time
from pathlib import Path
from typing import Any, NamedTuple
from unittest import mock

import aiohttp
import requests
import transformers
import uvicorn
import yaml
from sentence_transformers import SentenceTransformer

import mlflow
from mlflow.gateway import app
from mlflow.gateway.utils import kill_child_processes

from tests.helper_functions import _get_mlflow_home, _start_scoring_proc, get_safe_port


class Gateway:
    def __init__(self, config_path: str | Path, *args, **kwargs):
        self.port = get_safe_port()
        self.host = "localhost"
        self.url = f"http://{self.host}:{self.port}"
        self.workers = 2
        self.process = subprocess.Popen(
            [
                sys.executable,
                "-m",
                "mlflow",
                "gateway",
                "start",
                "--config-path",
                config_path,
                "--host",
                self.host,
                "--port",
                str(self.port),
                "--workers",
                str(self.workers),
            ],
            *args,
            **kwargs,
        )
        self.wait_until_ready()

    def wait_until_ready(self) -> None:
        s = time.time()
        while time.time() - s < 10:
            try:
                if self.get("health").ok:
                    return
            except requests.exceptions.ConnectionError:
                time.sleep(0.5)

        raise Exception("Gateway failed to start")

    def wait_reload(self) -> None:
        """
        Should be called after we update a gateway config file in tests to ensure
        that the gateway service has reloaded the config.
        """
        time.sleep(self.workers)

    def request(self, method: str, path: str, *args: Any, **kwargs: Any) -> requests.Response:
        return requests.request(method, f"{self.url}/{path}", *args, **kwargs)

    def get(self, path: str, *args: Any, **kwargs: Any) -> requests.Response:
        return self.request("GET", path, *args, **kwargs)

    def assert_health(self):
        assert self.get("health").ok

    def post(self, path: str, *args: Any, **kwargs: Any) -> requests.Response:
        return self.request("POST", path, *args, **kwargs)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        kill_child_processes(self.process.pid)
        self.process.terminate()
        self.process.wait()


def save_yaml(path, conf):
    path.write_text(yaml.safe_dump(conf))


class MockAsyncResponse:
    def __init__(self, data: dict[str, Any], status: int = 200):
        # Extract status and headers from data, if present
        self.status = status
        self.headers = data.pop("headers", {"Content-Type": "application/json"})

        # Save the rest of the data as content
        self._content = data

    def raise_for_status(self) -> None:
        if 400 <= self.status < 600:
            raise aiohttp.ClientResponseError(None, None, status=self.status)

    async def json(self) -> dict[str, Any]:
        return self._content

    async def text(self) -> str:
        return json.dumps(self._content)

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, traceback):
        pass


class MockAsyncStreamingResponse:
    def __init__(self, data: list[bytes], headers: dict[str, str] | None = None, status: int = 200):
        self.status = status
        self.headers = headers
        self._content = data

    def raise_for_status(self) -> None:
        if 400 <= self.status < 600:
            raise aiohttp.ClientResponseError(None, None, status=self.status)

    async def _async_content(self):
        for line in self._content:
            yield line

    @property
    def content(self):
        return self._async_content()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, traceback):
        pass


class MockHttpClient(mock.Mock):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        return


def mock_http_client(mock_response: MockAsyncResponse | MockAsyncStreamingResponse):
    mock_http_client = MockHttpClient()
    mock_http_client.post = mock.Mock(return_value=mock_response)
    return mock_http_client


class UvicornGateway:
    # This test utility class is used to validate the internal functionality of the
    # AI Gateway within-process so that the provider endpoints can be mocked,
    # allowing a nearly end-to-end validation of the entire AI Gateway stack.
    # NB: this implementation should only be used for integration testing. Unit tests that
    # require validation of the AI Gateway server should use the `Gateway` implementation in
    # this module which executes the uvicorn server through gunicorn as a process manager.
    def __init__(self, config_path: str | Path, *args, **kwargs):
        self.port = get_safe_port()
        self.host = "127.0.0.1"
        self.url = f"http://{self.host}:{self.port}"
        self.config_path = config_path
        self.server = None
        self.loop = None
        self.thread = None
        self.stop_event = threading.Event()

    def start_server(self):
        uvicorn_app = app.create_app_from_path(self.config_path)

        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)

        config = uvicorn.Config(
            app=uvicorn_app,
            host=self.host,
            port=self.port,
            lifespan="on",
            loop="auto",
            log_level="info",
        )
        self.server = uvicorn.Server(config)

        def run():
            self.loop.run_until_complete(self.server.serve())

        self.thread = threading.Thread(target=run)
        self.thread.start()

    def request(self, method: str, path: str, *args: Any, **kwargs: Any) -> requests.Response:
        return requests.request(method, f"{self.url}/{path}", *args, **kwargs)

    def get(self, path: str, *args: Any, **kwargs: Any) -> requests.Response:
        return self.request("GET", path, *args, **kwargs)

    def assert_health(self):
        assert self.get("health").ok

    def post(self, path: str, *args: Any, **kwargs: Any) -> requests.Response:
        return self.request("POST", path, *args, **kwargs)

    def stop(self):
        if self.server is not None:
            self.server.should_exit = True  # Instruct the uvicorn server to stop
            self.stop_event.wait()  # Wait for the server to actually stop
            self.thread.join()  # block until thread termination
            self.server = None
            self.loop = None
            self.thread = None

    def __enter__(self):
        self.start_server()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Stop the server and the thread
        if self.server is not None:
            self.server.should_exit = True
        self.thread.join()


class ServerInfo(NamedTuple):
    pid: int
    url: str


def log_sentence_transformers_model():
    model = SentenceTransformer("all-MiniLM-L6-v2")
    artifact_path = "gen_model"

    with mlflow.start_run():
        model_info = mlflow.sentence_transformers.log_model(
            model,
            name=artifact_path,
        )
        return model_info.model_uri


def log_completions_transformers_model():
    architecture = "distilbert-base-uncased"

    tokenizer = transformers.AutoTokenizer.from_pretrained(architecture)
    model = transformers.AutoModelForMaskedLM.from_pretrained(architecture)
    pipe = transformers.pipeline(task="fill-mask", model=model, tokenizer=tokenizer)

    inference_params = {"top_k": 1}

    signature = mlflow.models.infer_signature(
        ["test1 [MASK]", "[MASK] test2"],
        mlflow.transformers.generate_signature_output(pipe, ["test3 [MASK]"]),
        inference_params,
    )

    artifact_path = "mask_model"

    with mlflow.start_run():
        model_info = mlflow.transformers.log_model(
            pipe,
            name=artifact_path,
            signature=signature,
        )
        return model_info.model_uri


def start_mlflow_server(port, model_uri):
    server_url = f"http://127.0.0.1:{port}"

    env = dict(os.environ)
    env.update(LC_ALL="en_US.UTF-8", LANG="en_US.UTF-8")
    env.update(MLFLOW_TRACKING_URI=mlflow.get_tracking_uri())
    env.update(MLFLOW_HOME=_get_mlflow_home())
    scoring_cmd = [
        "mlflow",
        "models",
        "serve",
        "-m",
        model_uri,
        "-p",
        str(port),
        "--install-mlflow",
        "--no-conda",
    ]

    server_pid = _start_scoring_proc(cmd=scoring_cmd, env=env, stdout=sys.stdout, stderr=sys.stdout)

    ping_status = None
    for i in range(120):
        time.sleep(1)
        try:
            ping_status = requests.get(url=f"{server_url}/ping")
            if ping_status.status_code == 200:
                break
        except Exception:
            pass
    if ping_status is None or ping_status.status_code != 200:
        raise Exception("Could not start mlflow serving instance.")

    return ServerInfo(pid=server_pid, url=server_url)


def stop_mlflow_server(server_pid):
    process_group = os.getpgid(server_pid.pid)
    os.killpg(process_group, signal.SIGTERM)
```

--------------------------------------------------------------------------------

---[FILE: test_ai21labs.py]---
Location: mlflow-master/tests/gateway/providers/test_ai21labs.py
Signals: FastAPI

```python
from unittest import mock

import pytest
from aiohttp import ClientTimeout
from fastapi.encoders import jsonable_encoder

from mlflow.exceptions import MlflowException
from mlflow.gateway.config import EndpointConfig
from mlflow.gateway.constants import MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.ai21labs import AI21LabsProvider
from mlflow.gateway.schemas import chat, completions, embeddings

from tests.gateway.tools import MockAsyncResponse


def completions_config():
    return {
        "name": "completions",
        "endpoint_type": "llm/v1/completions",
        "model": {
            "provider": "ai21labs",
            "name": "j2-ultra",
            "config": {
                "ai21labs_api_key": "key",
            },
        },
    }


def completions_config_invalid_model():
    return {
        "name": "completions",
        "endpoint_type": "llm/v1/completions",
        "model": {
            "provider": "ai21labs",
            "name": "j2",
            "config": {
                "ai21labs_api_key": "key",
            },
        },
    }


def embedding_config():
    return {
        "name": "embeddings",
        "endpoint_type": "llm/v1/embeddings",
        "model": {
            "provider": "ai21labs",
            "name": "j2-ultra",
            "config": {
                "ai21labs_api_key": "key",
            },
        },
    }


def chat_config():
    return {
        "name": "chat",
        "endpoint_type": "llm/v1/chat",
        "model": {
            "provider": "ai21labs",
            "name": "j2-ultra",
            "config": {
                "ai21labs_api_key": "key",
            },
        },
    }


def completions_response():
    return {
        "id": "7921a78e-d905-c9df-27e3-88e4831e3c3b",
        "prompt": {"text": "This is a test"},
        "completions": [
            {
                "data": {"text": "this is a test response"},
                "finishReason": {"reason": "length", "length": 2},
            }
        ],
    }


@pytest.mark.asyncio
async def test_completions():
    resp = completions_response()
    config = completions_config()
    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        provider = AI21LabsProvider(EndpointConfig(**config))
        payload = {
            "prompt": "This is a test",
            "temperature": 0.2,
            "max_tokens": 1000,
            "n": 1,
            "stop": ["foobazbardiddly"],
        }
        response = await provider.completions(completions.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "id": None,
            "object": "text_completion",
            "created": 1677858242,
            "model": "j2-ultra",
            "choices": [{"text": "this is a test response", "index": 0, "finish_reason": "length"}],
            "usage": {"prompt_tokens": None, "completion_tokens": None, "total_tokens": None},
        }
        mock_post.assert_called_once_with(
            "https://api.ai21.com/studio/v1/j2-ultra/complete",
            json={
                "temperature": 0.2,
                "numResults": 1,
                "stopSequences": ["foobazbardiddly"],
                "maxTokens": 1000,
                "prompt": "This is a test",
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


@pytest.mark.asyncio
async def test_param_invalid_model_name_is_not_permitted():
    config = completions_config_invalid_model()
    with pytest.raises(MlflowException, match=r"An Unsupported AI21Labs model.*"):
        EndpointConfig(**config)


@pytest.mark.asyncio
async def test_param_maxTokens_is_not_permitted():
    config = completions_config()
    provider = AI21LabsProvider(EndpointConfig(**config))
    payload = {
        "prompt": "This should fail",
        "maxTokens": 5000,
    }
    with pytest.raises(AIGatewayException, match=r".*") as e:
        await provider.completions(completions.RequestPayload(**payload))
    assert "Invalid parameter maxTokens. Use max_tokens instead." in e.value.detail
    assert e.value.status_code == 422


@pytest.mark.asyncio
async def test_param_model_is_not_permitted():
    config = completions_config()
    provider = AI21LabsProvider(EndpointConfig(**config))
    payload = {
        "prompt": "This should fail",
        "model": "j2-light",
    }
    with pytest.raises(AIGatewayException, match=r".*") as e:
        await provider.completions(completions.RequestPayload(**payload))
    assert "The parameter 'model' is not permitted" in e.value.detail
    assert e.value.status_code == 422


@pytest.mark.asyncio
async def test_chat_is_not_supported_for_ai21labs():
    config = chat_config()
    provider = AI21LabsProvider(EndpointConfig(**config))
    payload = {
        "messages": [{"role": "user", "content": "J2-ultra, can you chat with me? I'm lonely."}]
    }

    with pytest.raises(AIGatewayException, match=r".*") as e:
        await provider.chat(chat.RequestPayload(**payload))
    assert "The chat route is not implemented for AI21Labs models" in e.value.detail
    assert e.value.status_code == 501


@pytest.mark.asyncio
async def test_embeddings_are_not_supported_for_ai21labs():
    config = embedding_config()
    provider = AI21LabsProvider(EndpointConfig(**config))
    payload = {"input": "give me that sweet, sweet vector, please."}

    with pytest.raises(AIGatewayException, match=r".*") as e:
        await provider.embeddings(embeddings.RequestPayload(**payload))
    assert "The embeddings route is not implemented for AI21Labs models" in e.value.detail
    assert e.value.status_code == 501
```

--------------------------------------------------------------------------------

````
