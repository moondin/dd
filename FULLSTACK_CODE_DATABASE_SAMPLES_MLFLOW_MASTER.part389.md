---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 389
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 389 of 991)

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

---[FILE: chat_agent.py]---
Location: mlflow-master/mlflow/pyfunc/loaders/chat_agent.py
Signals: Pydantic

```python
from typing import Any, Generator

import pydantic

from mlflow.exceptions import MlflowException
from mlflow.models.utils import _convert_llm_ndarray_to_list
from mlflow.protos.databricks_pb2 import INTERNAL_ERROR
from mlflow.pyfunc.model import (
    _load_context_model_and_signature,
)
from mlflow.types.agent import (
    ChatAgentChunk,
    ChatAgentMessage,
    ChatAgentResponse,
    ChatContext,
)
from mlflow.types.type_hints import model_validate


def _load_pyfunc(model_path: str, model_config: dict[str, Any] | None = None):
    _, chat_agent, _ = _load_context_model_and_signature(model_path, model_config)
    return _ChatAgentPyfuncWrapper(chat_agent)


class _ChatAgentPyfuncWrapper:
    """
    Wrapper class that converts dict inputs to pydantic objects accepted by :class:`~ChatAgent`.
    """

    def __init__(self, chat_agent):
        """
        Args:
            chat_agent: An instance of a subclass of :class:`~ChatAgent`.
        """
        self.chat_agent = chat_agent

    def get_raw_model(self):
        """
        Returns the underlying model.
        """
        return self.chat_agent

    def _convert_input(
        self, model_input
    ) -> tuple[list[ChatAgentMessage], ChatContext | None, dict[str, Any] | None]:
        import pandas

        if isinstance(model_input, dict):
            dict_input = model_input
        elif isinstance(model_input, pandas.DataFrame):
            dict_input = {
                k: _convert_llm_ndarray_to_list(v[0])
                for k, v in model_input.to_dict(orient="list").items()
            }
        else:
            raise MlflowException(
                "Unsupported model input type. Expected a dict or pandas.DataFrame, but got "
                f"{type(model_input)} instead.",
                error_code=INTERNAL_ERROR,
            )

        messages = [ChatAgentMessage(**message) for message in dict_input.get("messages", [])]
        context = ChatContext(**dict_input["context"]) if "context" in dict_input else None
        custom_inputs = dict_input.get("custom_inputs")

        return messages, context, custom_inputs

    def _response_to_dict(self, response, pydantic_class) -> dict[str, Any]:
        if isinstance(response, pydantic_class):
            return response.model_dump(exclude_none=True)
        try:
            model_validate(pydantic_class, response)
        except pydantic.ValidationError as e:
            raise MlflowException(
                message=(
                    f"Model returned an invalid response. Expected a {pydantic_class.__name__} "
                    f"object or dictionary with the same schema. Pydantic validation error: {e}"
                ),
                error_code=INTERNAL_ERROR,
            ) from e
        return response

    def predict(self, model_input: dict[str, Any], params=None) -> dict[str, Any]:
        """
        Args:
            model_input: A dict with the
                :py:class:`ChatAgentRequest <mlflow.types.agent.ChatAgentRequest>` schema.
            params: Unused in this function, but required in the signature because
                `load_model_and_predict` in `utils/_capture_modules.py` expects a params field

        Returns:
            A dict with the (:py:class:`ChatAgentResponse <mlflow.types.agent.ChatAgentResponse>`)
                schema.
        """
        messages, context, custom_inputs = self._convert_input(model_input)
        response = self.chat_agent.predict(messages, context, custom_inputs)
        return self._response_to_dict(response, ChatAgentResponse)

    def predict_stream(
        self, model_input: dict[str, Any], params=None
    ) -> Generator[dict[str, Any], None, None]:
        """
        Args:
            model_input: A dict with the
                :py:class:`ChatAgentRequest <mlflow.types.agent.ChatAgentRequest>` schema.
            params: Unused in this function, but required in the signature because
                `load_model_and_predict` in `utils/_capture_modules.py` expects a params field

        Returns:
            A generator over dicts with the
                (:py:class:`ChatAgentChunk <mlflow.types.agent.ChatAgentChunk>`) schema.
        """
        messages, context, custom_inputs = self._convert_input(model_input)
        for response in self.chat_agent.predict_stream(messages, context, custom_inputs):
            yield self._response_to_dict(response, ChatAgentChunk)
```

--------------------------------------------------------------------------------

---[FILE: chat_model.py]---
Location: mlflow-master/mlflow/pyfunc/loaders/chat_model.py
Signals: Pydantic

```python
import inspect
import logging
from typing import Any, Generator

from mlflow.exceptions import MlflowException
from mlflow.models.utils import _convert_llm_ndarray_to_list
from mlflow.protos.databricks_pb2 import INTERNAL_ERROR
from mlflow.pyfunc.model import (
    _load_context_model_and_signature,
)
from mlflow.types.llm import ChatCompletionChunk, ChatCompletionResponse, ChatMessage, ChatParams

_logger = logging.getLogger(__name__)


def _load_pyfunc(model_path: str, model_config: dict[str, Any] | None = None):
    context, chat_model, signature = _load_context_model_and_signature(model_path, model_config)
    return _ChatModelPyfuncWrapper(chat_model=chat_model, context=context, signature=signature)


class _ChatModelPyfuncWrapper:
    """
    Wrapper class that converts dict inputs to pydantic objects accepted by :class:`~ChatModel`.
    """

    def __init__(self, chat_model, context, signature):
        """
        Args:
            chat_model: An instance of a subclass of :class:`~ChatModel`.
            context: A :class:`~PythonModelContext` instance containing artifacts that
                        ``chat_model`` may use when performing inference.
            signature: :class:`~ModelSignature` instance describing model input and output.
        """
        self.chat_model = chat_model
        self.context = context
        self.signature = signature

    def get_raw_model(self):
        """
        Returns the underlying model.
        """
        return self.chat_model

    def _convert_input(self, model_input):
        import pandas

        if isinstance(model_input, dict):
            dict_input = model_input
        elif isinstance(model_input, pandas.DataFrame):
            dict_input = {
                k: _convert_llm_ndarray_to_list(v[0])
                for k, v in model_input.to_dict(orient="list").items()
            }
        else:
            raise MlflowException(
                "Unsupported model input type. Expected a dict or pandas.DataFrame, "
                f"but got {type(model_input)} instead.",
                error_code=INTERNAL_ERROR,
            )

        messages = [ChatMessage.from_dict(message) for message in dict_input.pop("messages", [])]
        params = ChatParams.from_dict(dict_input)
        return messages, params

    def predict(
        self, model_input: dict[str, Any], params: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        """
        Args:
            model_input: Model input data in the form of a chat request.
            params: Additional parameters to pass to the model for inference.
                       Unused in this implementation, as the params are handled
                       via ``self._convert_input()``.

        Returns:
            Model predictions in :py:class:`~ChatCompletionResponse` format.
        """
        messages, params = self._convert_input(model_input)
        parameters = inspect.signature(self.chat_model.predict).parameters
        if "context" in parameters or len(parameters) == 3:
            response = self.chat_model.predict(self.context, messages, params)
        else:
            response = self.chat_model.predict(messages, params)
        return self._response_to_dict(response)

    def _response_to_dict(self, response: ChatCompletionResponse) -> dict[str, Any]:
        if not isinstance(response, ChatCompletionResponse):
            raise MlflowException(
                "Model returned an invalid response. Expected a ChatCompletionResponse, but "
                f"got {type(response)} instead.",
                error_code=INTERNAL_ERROR,
            )
        return response.to_dict()

    def _streaming_response_to_dict(self, response: ChatCompletionChunk) -> dict[str, Any]:
        if not isinstance(response, ChatCompletionChunk):
            raise MlflowException(
                "Model returned an invalid response. Expected a ChatCompletionChunk, but "
                f"got {type(response)} instead.",
                error_code=INTERNAL_ERROR,
            )
        return response.to_dict()

    def predict_stream(
        self, model_input: dict[str, Any], params: dict[str, Any] | None = None
    ) -> Generator[dict[str, Any], None, None]:
        """
        Args:
            model_input: Model input data in the form of a chat request.
            params: Additional parameters to pass to the model for inference.
                       Unused in this implementation, as the params are handled
                       via ``self._convert_input()``.

        Returns:
            Generator over model predictions in :py:class:`~ChatCompletionChunk` format.
        """
        messages, params = self._convert_input(model_input)
        parameters = inspect.signature(self.chat_model.predict_stream).parameters
        if "context" in parameters or len(parameters) == 3:
            stream = self.chat_model.predict_stream(self.context, messages, params)
        else:
            stream = self.chat_model.predict_stream(messages, params)

        for response in stream:
            yield self._streaming_response_to_dict(response)
```

--------------------------------------------------------------------------------

---[FILE: code_model.py]---
Location: mlflow-master/mlflow/pyfunc/loaders/code_model.py

```python
from typing import Any

from mlflow.pyfunc.loaders.chat_agent import _ChatAgentPyfuncWrapper
from mlflow.pyfunc.loaders.chat_model import _ChatModelPyfuncWrapper
from mlflow.pyfunc.model import (
    ChatAgent,
    ChatModel,
    _load_context_model_and_signature,
    _PythonModelPyfuncWrapper,
)

try:
    from mlflow.pyfunc.model import ResponsesAgent

    IS_RESPONSES_AGENT_AVAILABLE = True
except ImportError:
    IS_RESPONSES_AGENT_AVAILABLE = False


def _load_pyfunc(local_path: str, model_config: dict[str, Any] | None = None):
    context, model, signature = _load_context_model_and_signature(local_path, model_config)
    if isinstance(model, ChatModel):
        return _ChatModelPyfuncWrapper(model, context, signature)
    elif isinstance(model, ChatAgent):
        return _ChatAgentPyfuncWrapper(model)
    elif IS_RESPONSES_AGENT_AVAILABLE and isinstance(model, ResponsesAgent):
        from mlflow.pyfunc.loaders.responses_agent import _ResponsesAgentPyfuncWrapper

        return _ResponsesAgentPyfuncWrapper(model, context)
    else:
        return _PythonModelPyfuncWrapper(model, context, signature)
```

--------------------------------------------------------------------------------

---[FILE: responses_agent.py]---
Location: mlflow-master/mlflow/pyfunc/loaders/responses_agent.py
Signals: Pydantic

```python
from typing import Any, Generator

import pydantic

from mlflow.exceptions import MlflowException
from mlflow.models.utils import _convert_llm_ndarray_to_list
from mlflow.protos.databricks_pb2 import INTERNAL_ERROR
from mlflow.pyfunc.model import _load_context_model_and_signature
from mlflow.types.responses import (
    ResponsesAgentRequest,
    ResponsesAgentResponse,
    ResponsesAgentStreamEvent,
)
from mlflow.types.type_hints import model_validate


def _load_pyfunc(model_path: str, model_config: dict[str, Any] | None = None):
    context, responses_agent, _ = _load_context_model_and_signature(model_path, model_config)
    return _ResponsesAgentPyfuncWrapper(responses_agent, context)


class _ResponsesAgentPyfuncWrapper:
    """
    Wrapper class that converts dict inputs to pydantic objects accepted by
    :class:`~ResponsesAgent`.
    """

    def __init__(self, responses_agent, context):
        self.responses_agent = responses_agent
        self.context = context

    def get_raw_model(self):
        """
        Returns the underlying model.
        """
        return self.responses_agent

    def _convert_input(self, model_input) -> ResponsesAgentRequest:
        import pandas

        if isinstance(model_input, pandas.DataFrame):
            model_input = {
                k: _convert_llm_ndarray_to_list(v[0])
                for k, v in model_input.to_dict(orient="list").items()
            }
        elif not isinstance(model_input, dict):
            raise MlflowException(
                "Unsupported model input type. Expected a dict or pandas.DataFrame, but got "
                f"{type(model_input)} instead.",
                error_code=INTERNAL_ERROR,
            )
        return ResponsesAgentRequest(**model_input)

    def _response_to_dict(self, response, pydantic_class) -> dict[str, Any]:
        if isinstance(response, pydantic_class):
            return response.model_dump(exclude_none=True)
        try:
            model_validate(pydantic_class, response)
        except pydantic.ValidationError as e:
            raise MlflowException(
                message=(
                    f"Model returned an invalid response. Expected a {pydantic_class.__name__} "
                    f"object or dictionary with the same schema. Pydantic validation error: {e}"
                ),
                error_code=INTERNAL_ERROR,
            ) from e
        return response

    def predict(self, model_input: dict[str, Any], params=None) -> dict[str, Any]:
        """
        Args:
            model_input: A dict with the
                :py:class:`ResponsesRequest <mlflow.types.responses.ResponsesRequest>` schema.
            params: Unused in this function, but required in the signature because
                `load_model_and_predict` in `utils/_capture_modules.py` expects a params field

        Returns:
            A dict with the
            (:py:class:`ResponsesResponse <mlflow.types.responses.ResponsesResponse>`)
            schema.
        """
        request = self._convert_input(model_input)
        response = self.responses_agent.predict(request)
        return self._response_to_dict(response, ResponsesAgentResponse)

    def predict_stream(
        self, model_input: dict[str, Any], params=None
    ) -> Generator[dict[str, Any], None, None]:
        """
        Args:
            model_input: A dict with the
                :py:class:`ResponsesRequest <mlflow.types.responses.ResponsesRequest>` schema.
            params: Unused in this function, but required in the signature because
                `load_model_and_predict` in `utils/_capture_modules.py` expects a params field

        Returns:
            A generator over dicts with the
                (:py:class:`ResponsesStreamEvent <mlflow.types.responses.ResponsesStreamEvent>`)
                schema.
        """
        request = self._convert_input(model_input)
        for response in self.responses_agent.predict_stream(request):
            yield self._response_to_dict(response, ResponsesAgentStreamEvent)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/pyfunc/loaders/__init__.py

```python
import mlflow.pyfunc.loaders.chat_agent
import mlflow.pyfunc.loaders.chat_model
import mlflow.pyfunc.loaders.code_model
import mlflow.pyfunc.loaders.responses_agent  # noqa: F401
```

--------------------------------------------------------------------------------

---[FILE: app.py]---
Location: mlflow-master/mlflow/pyfunc/scoring_server/app.py

```python
import os

from mlflow.pyfunc import scoring_server

app = scoring_server.init(
    scoring_server.load_model_with_mlflow_config(os.environ[scoring_server._SERVER_MODEL_PATH])
)
```

--------------------------------------------------------------------------------

---[FILE: client.py]---
Location: mlflow-master/mlflow/pyfunc/scoring_server/client.py

```python
import json
import logging
import tempfile
import time
import uuid
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any

import requests

from mlflow.deployments import PredictionsResponse
from mlflow.environment_variables import MLFLOW_SCORING_SERVER_REQUEST_TIMEOUT
from mlflow.exceptions import MlflowException
from mlflow.pyfunc import scoring_server
from mlflow.utils.proto_json_utils import dump_input_data

_logger = logging.getLogger(__name__)


class BaseScoringServerClient(ABC):
    @abstractmethod
    def wait_server_ready(self, timeout=30, scoring_server_proc=None):
        """
        Wait until the scoring server is ready to accept requests.
        """

    @abstractmethod
    def invoke(self, data, params: dict[str, Any] | None = None):
        """
        Invoke inference on input data. The input data must be pandas dataframe or numpy array or
        a dict of numpy arrays.

        Args:
            data: Model input data.
            params: Additional parameters to pass to the model for inference.

        Returns:
            Prediction result.
        """


class ScoringServerClient(BaseScoringServerClient):
    def __init__(self, host, port):
        self.url_prefix = f"http://{host}:{port}"

    def ping(self):
        ping_status = requests.get(url=self.url_prefix + "/ping")
        if ping_status.status_code != 200:
            raise Exception(f"ping failed (error code {ping_status.status_code})")

    def get_version(self):
        resp_status = requests.get(url=self.url_prefix + "/version")
        if resp_status.status_code != 200:
            raise Exception(f"version failed (error code {resp_status.status_code})")
        return resp_status.text

    def wait_server_ready(self, timeout=30, scoring_server_proc=None):
        begin_time = time.time()

        while True:
            time.sleep(0.3)
            try:
                self.ping()
                return
            except Exception:
                pass
            if time.time() - begin_time > timeout:
                break
            if scoring_server_proc is not None:
                return_code = scoring_server_proc.poll()
                if return_code is not None:
                    raise RuntimeError(f"Server process already exit with returncode {return_code}")
        raise RuntimeError("Wait scoring server ready timeout.")

    def invoke(self, data, params: dict[str, Any] | None = None):
        """
        Args:
            data: Model input data.
            params: Additional parameters to pass to the model for inference.

        Returns:
            :py:class:`PredictionsResponse <mlflow.deployments.PredictionsResponse>` result.
        """
        response = requests.post(
            url=self.url_prefix + "/invocations",
            data=dump_input_data(data, params=params),
            headers={"Content-Type": scoring_server.CONTENT_TYPE_JSON},
        )
        if response.status_code != 200:
            raise Exception(
                f"Invocation failed (error code {response.status_code}, response: {response.text})"
            )
        return PredictionsResponse.from_json(response.text)


class StdinScoringServerClient(BaseScoringServerClient):
    def __init__(self, process):
        super().__init__()
        self.process = process
        try:
            # Use /dev/shm (memory-based filesystem) if possible to make read/write efficient.
            tmpdir = tempfile.mkdtemp(dir="/dev/shm")
        except Exception:
            tmpdir = tempfile.mkdtemp()
        self.tmpdir = Path(tmpdir)
        self.output_json = self.tmpdir.joinpath("output.json")

    def wait_server_ready(self, timeout=30, scoring_server_proc=None):
        return_code = self.process.poll()
        if return_code is not None:
            raise RuntimeError(f"Server process already exit with returncode {return_code}")

    def invoke(self, data, params: dict[str, Any] | None = None):
        """
        Invoke inference on input data. The input data must be pandas dataframe or numpy array or
        a dict of numpy arrays.

        Args:
            data: Model input data.
            params: Additional parameters to pass to the model for inference.

        Returns:
            :py:class:`PredictionsResponse <mlflow.deployments.PredictionsResponse>` result.
        """
        if not self.output_json.exists():
            self.output_json.touch()

        request_id = str(uuid.uuid4())
        request = {
            "id": request_id,
            "data": dump_input_data(data, params=params),
            "output_file": str(self.output_json),
        }
        self.process.stdin.write(json.dumps(request) + "\n")
        self.process.stdin.flush()

        begin_time = time.time()
        while True:
            _logger.info("Waiting for scoring to complete...")
            try:
                with self.output_json.open(mode="r+") as f:
                    resp = PredictionsResponse.from_json(f.read())
                    if resp.get("id") == request_id:
                        f.truncate(0)
                        return resp
            except Exception as e:
                _logger.debug("Exception while waiting for scoring to complete: %s", e)
            if time.time() - begin_time > MLFLOW_SCORING_SERVER_REQUEST_TIMEOUT.get():
                raise MlflowException("Scoring timeout")
            time.sleep(1)
```

--------------------------------------------------------------------------------

````
