---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 246
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 246 of 991)

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

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/deployments/mlflow/__init__.py

```python
from typing import TYPE_CHECKING, Any

import requests

from mlflow import MlflowException
from mlflow.deployments import BaseDeploymentClient
from mlflow.deployments.constants import (
    MLFLOW_DEPLOYMENT_CLIENT_REQUEST_RETRY_CODES,
)
from mlflow.deployments.server.constants import (
    MLFLOW_DEPLOYMENTS_CRUD_ENDPOINT_BASE,
    MLFLOW_DEPLOYMENTS_ENDPOINTS_BASE,
    MLFLOW_DEPLOYMENTS_QUERY_SUFFIX,
)
from mlflow.deployments.utils import resolve_endpoint_url
from mlflow.environment_variables import (
    MLFLOW_DEPLOYMENT_CLIENT_HTTP_REQUEST_TIMEOUT,
    MLFLOW_DEPLOYMENT_PREDICT_TIMEOUT,
)
from mlflow.protos.databricks_pb2 import BAD_REQUEST
from mlflow.store.entities.paged_list import PagedList
from mlflow.utils.credentials import get_default_host_creds
from mlflow.utils.rest_utils import augmented_raise_for_status, http_request
from mlflow.utils.uri import join_paths

if TYPE_CHECKING:
    from mlflow.deployments.server.config import Endpoint


class MlflowDeploymentClient(BaseDeploymentClient):
    """
    Client for interacting with the MLflow AI Gateway.

    Example:

    First, start the MLflow AI Gateway:

    .. code-block:: bash

        mlflow gateway start --config-path path/to/config.yaml

    Then, create a client and use it to interact with the server:

    .. code-block:: python

        from mlflow.deployments import get_deploy_client

        client = get_deploy_client("http://localhost:5000")
        endpoints = client.list_endpoints()
        assert [e.dict() for e in endpoints] == [
            {
                "name": "chat",
                "endpoint_type": "llm/v1/chat",
                "model": {"name": "gpt-4o-mini", "provider": "openai"},
                "endpoint_url": "http://localhost:5000/gateway/chat/invocations",
            },
        ]
    """

    def create_deployment(self, name, model_uri, flavor=None, config=None, endpoint=None):
        """
        .. warning::
            This method is not implemented for `MlflowDeploymentClient`.
        """
        raise NotImplementedError

    def update_deployment(self, name, model_uri=None, flavor=None, config=None, endpoint=None):
        """
        .. warning::
            This method is not implemented for `MlflowDeploymentClient`.
        """
        raise NotImplementedError

    def delete_deployment(self, name, config=None, endpoint=None):
        """
        .. warning::
            This method is not implemented for `MlflowDeploymentClient`.
        """
        raise NotImplementedError

    def list_deployments(self, endpoint=None):
        """
        .. warning::
            This method is not implemented for `MlflowDeploymentClient`.
        """
        raise NotImplementedError

    def get_deployment(self, name, endpoint=None):
        """
        .. warning::
            This method is not implemented for `MLflowDeploymentClient`.
        """
        raise NotImplementedError

    def create_endpoint(self, name, config=None):
        """
        .. warning::
            This method is not implemented for `MlflowDeploymentClient`.
        """
        raise NotImplementedError

    def update_endpoint(self, endpoint, config=None):
        """
        .. warning::
            This method is not implemented for `MlflowDeploymentClient`.
        """
        raise NotImplementedError

    def delete_endpoint(self, endpoint):
        """
        .. warning::
            This method is not implemented for `MlflowDeploymentClient`.
        """
        raise NotImplementedError

    def _call_endpoint(
        self,
        method: str,
        route: str,
        json_body: str | None = None,
        timeout: int | None = None,
    ):
        call_kwargs = {}
        if method.lower() == "get":
            call_kwargs["params"] = json_body
        else:
            call_kwargs["json"] = json_body

        response = http_request(
            host_creds=get_default_host_creds(self.target_uri),
            endpoint=route,
            method=method,
            timeout=MLFLOW_DEPLOYMENT_CLIENT_HTTP_REQUEST_TIMEOUT.get()
            if timeout is None
            else timeout,
            retry_codes=MLFLOW_DEPLOYMENT_CLIENT_REQUEST_RETRY_CODES,
            raise_on_status=False,
            **call_kwargs,
        )
        augmented_raise_for_status(response)
        return response.json()

    def get_endpoint(self, endpoint) -> "Endpoint":
        """
        Gets a specified endpoint configured for the MLflow AI Gateway.

        Args:
            endpoint: The name of the endpoint to retrieve.

        Returns:
            An `Endpoint` object representing the endpoint.

        Example:

        .. code-block:: python

            from mlflow.deployments import get_deploy_client

            client = get_deploy_client("http://localhost:5000")
            endpoint = client.get_endpoint(endpoint="chat")
            assert endpoint.dict() == {
                "name": "chat",
                "endpoint_type": "llm/v1/chat",
                "model": {"name": "gpt-4o-mini", "provider": "openai"},
                "endpoint_url": "http://localhost:5000/gateway/chat/invocations",
            }
        """
        # Delayed import to avoid importing mlflow.gateway in the module scope
        from mlflow.deployments.server.config import Endpoint

        route = join_paths(MLFLOW_DEPLOYMENTS_CRUD_ENDPOINT_BASE, endpoint)
        response = self._call_endpoint("GET", route)
        return Endpoint(
            **{
                **response,
                "endpoint_url": resolve_endpoint_url(self.target_uri, response["endpoint_url"]),
            }
        )

    def _list_endpoints(self, page_token=None) -> "PagedList[Endpoint]":
        # Delayed import to avoid importing mlflow.gateway in the module scope
        from mlflow.deployments.server.config import Endpoint

        params = None if page_token is None else {"page_token": page_token}
        response_json = self._call_endpoint(
            "GET", MLFLOW_DEPLOYMENTS_CRUD_ENDPOINT_BASE, json_body=params
        )
        routes = [
            Endpoint(
                **{
                    **resp,
                    "endpoint_url": resolve_endpoint_url(
                        self.target_uri,
                        resp["endpoint_url"],
                    ),
                }
            )
            for resp in response_json.get("endpoints", [])
        ]
        next_page_token = response_json.get("next_page_token")
        return PagedList(routes, next_page_token)

    def list_endpoints(self) -> "list[Endpoint]":
        """
        List endpoints configured for the MLflow AI Gateway.

        Returns:
            A list of ``Endpoint`` objects.

        Example:

        .. code-block:: python

            from mlflow.deployments import get_deploy_client

            client = get_deploy_client("http://localhost:5000")

            endpoints = client.list_endpoints()
            assert [e.dict() for e in endpoints] == [
                {
                    "name": "chat",
                    "endpoint_type": "llm/v1/chat",
                    "model": {"name": "gpt-4o-mini", "provider": "openai"},
                    "endpoint_url": "http://localhost:5000/gateway/chat/invocations",
                },
            ]

        """
        endpoints = []
        next_page_token = None
        while True:
            page = self._list_endpoints(next_page_token)
            endpoints.extend(page)
            next_page_token = page.token
            if next_page_token is None:
                break
        return endpoints

    def predict(self, deployment_name=None, inputs=None, endpoint=None) -> dict[str, Any]:
        """
        Submit a query to a configured provider endpoint.

        Args:
            deployment_name: Unused.
            inputs: The inputs to the query, as a dictionary.
            endpoint: The name of the endpoint to query.

        Returns:
            A dictionary containing the response from the endpoint.

        Example:

        .. code-block:: python

            from mlflow.deployments import get_deploy_client

            client = get_deploy_client("http://localhost:5000")

            response = client.predict(
                endpoint="chat",
                inputs={"messages": [{"role": "user", "content": "Hello"}]},
            )
            assert response == {
                "id": "chatcmpl-8OLoQuaeJSLybq3NBoe0w5eyqjGb9",
                "object": "chat.completion",
                "created": 1700814410,
                "model": "gpt-4o-mini",
                "choices": [
                    {
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": "Hello! How can I assist you today?",
                        },
                        "finish_reason": "stop",
                    }
                ],
                "usage": {
                    "prompt_tokens": 9,
                    "completion_tokens": 9,
                    "total_tokens": 18,
                },
            }

        Additional parameters that are valid for a given provider and endpoint configuration can be
        included with the request as shown below, using an openai completions endpoint request as
        an example:

        .. code-block:: python

            from mlflow.deployments import get_deploy_client

            client = get_deploy_client("http://localhost:5000")
            client.predict(
                endpoint="completions",
                inputs={
                    "prompt": "Hello!",
                    "temperature": 0.3,
                    "max_tokens": 500,
                },
            )
        """
        query_route = join_paths(
            MLFLOW_DEPLOYMENTS_ENDPOINTS_BASE, endpoint, MLFLOW_DEPLOYMENTS_QUERY_SUFFIX
        )
        try:
            return self._call_endpoint(
                "POST", query_route, inputs, MLFLOW_DEPLOYMENT_PREDICT_TIMEOUT.get()
            )
        except MlflowException as e:
            if isinstance(e.__cause__, requests.exceptions.Timeout):
                raise MlflowException(
                    message=(
                        "The provider has timed out while generating a response to your "
                        "query. Please evaluate the available parameters for the query "
                        "that you are submitting. Some parameter values and inputs can "
                        "increase the computation time beyond the allowable route "
                        f"timeout of {MLFLOW_DEPLOYMENT_PREDICT_TIMEOUT} "
                        "seconds."
                    ),
                    error_code=BAD_REQUEST,
                )
            raise e


def run_local(name, model_uri, flavor=None, config=None):
    pass


def target_help():
    pass
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/deployments/openai/__init__.py

```python
import os

from mlflow.deployments import BaseDeploymentClient
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.utils.openai_utils import (
    _OAITokenHolder,
    _OpenAIApiConfig,
    _OpenAIEnvVar,
)
from mlflow.utils.rest_utils import augmented_raise_for_status


class OpenAIDeploymentClient(BaseDeploymentClient):
    """
    Client for interacting with OpenAI endpoints.

    Example:

    First, set up credentials for authentication:

    .. code-block:: bash

        export OPENAI_API_KEY=...

    .. seealso::

        See https://mlflow.org/docs/latest/python_api/openai/index.html for other authentication
        methods.

    Then, create a deployment client and use it to interact with OpenAI endpoints:

    .. code-block:: python

        from mlflow.deployments import get_deploy_client

        client = get_deploy_client("openai")
        client.predict(
            endpoint="gpt-4o-mini",
            inputs={
                "messages": [
                    {"role": "user", "content": "Hello!"},
                ],
            },
        )
    """

    def create_deployment(self, name, model_uri, flavor=None, config=None, endpoint=None):
        """
        .. warning::

            This method is not implemented for `OpenAIDeploymentClient`.
        """
        raise NotImplementedError

    def update_deployment(self, name, model_uri=None, flavor=None, config=None, endpoint=None):
        """
        .. warning::

            This method is not implemented for `OpenAIDeploymentClient`.
        """
        raise NotImplementedError

    def delete_deployment(self, name, config=None, endpoint=None):
        """
        .. warning::

            This method is not implemented for `OpenAIDeploymentClient`.
        """
        raise NotImplementedError

    def list_deployments(self, endpoint=None):
        """
        .. warning::

            This method is not implemented for `OpenAIDeploymentClient`.
        """
        raise NotImplementedError

    def get_deployment(self, name, endpoint=None):
        """
        .. warning::

            This method is not implemented for `OpenAIDeploymentClient`.
        """
        raise NotImplementedError

    def predict(self, deployment_name=None, inputs=None, endpoint=None):
        """Query an OpenAI endpoint.
        See https://platform.openai.com/docs/api-reference for more information.

        Args:
            deployment_name: Unused.
            inputs: A dictionary containing the model inputs to query.
            endpoint: The name of the endpoint to query.

        Returns:
            A dictionary containing the model outputs.

        """
        _check_openai_key()

        api_config = _get_api_config_without_openai_dep()
        api_token = _OAITokenHolder(api_config.api_type)
        api_token.refresh()

        if api_config.api_type in ("azure", "azure_ad", "azuread"):
            from openai import AzureOpenAI

            client = AzureOpenAI(
                api_key=api_token.token,
                azure_endpoint=api_config.api_base,
                api_version=api_config.api_version,
                azure_deployment=api_config.deployment_id,
                max_retries=api_config.max_retries,
                timeout=api_config.timeout,
            )
        else:
            from openai import OpenAI

            client = OpenAI(
                api_key=api_token.token,
                base_url=api_config.api_base,
                max_retries=api_config.max_retries,
                timeout=api_config.timeout,
            )

        return client.chat.completions.create(
            messages=inputs["messages"], model=endpoint
        ).model_dump()

    def create_endpoint(self, name, config=None):
        """
        .. warning::

            This method is not implemented for `OpenAIDeploymentClient`.
        """
        raise NotImplementedError

    def update_endpoint(self, endpoint, config=None):
        """
        .. warning::

            This method is not implemented for `OpenAIDeploymentClient`.
        """
        raise NotImplementedError

    def delete_endpoint(self, endpoint):
        """
        .. warning::

            This method is not implemented for `OpenAIDeploymentClient`.
        """
        raise NotImplementedError

    def list_endpoints(self):
        """
        List the currently available models.
        """

        _check_openai_key()

        api_config = _get_api_config_without_openai_dep()
        import requests

        if api_config.api_type in ("azure", "azure_ad", "azuread"):
            raise NotImplementedError(
                "List endpoints is not implemented for Azure OpenAI API",
            )
        else:
            api_key = os.environ["OPENAI_API_KEY"]
            request_header = {"Authorization": f"Bearer {api_key}"}

            response = requests.get(
                "https://api.openai.com/v1/models",
                headers=request_header,
            )

            augmented_raise_for_status(response)

            return response.json()

    def get_endpoint(self, endpoint):
        """
        Get information about a specific model.
        """

        _check_openai_key()

        api_config = _get_api_config_without_openai_dep()
        import requests

        if api_config.api_type in ("azure", "azure_ad", "azuread"):
            raise NotImplementedError(
                "Get endpoint is not implemented for Azure OpenAI API",
            )
        else:
            api_key = os.environ["OPENAI_API_KEY"]
            request_header = {"Authorization": f"Bearer {api_key}"}

            response = requests.get(
                f"https://api.openai.com/v1/models/{endpoint}",
                headers=request_header,
            )

            augmented_raise_for_status(response)

            return response.json()


def run_local(name, model_uri, flavor=None, config=None):
    pass


def target_help():
    pass


def _get_api_config_without_openai_dep() -> _OpenAIApiConfig:
    """
    Gets the parameters and configuration of the OpenAI API connected to.
    """
    api_type = os.getenv(_OpenAIEnvVar.OPENAI_API_TYPE.value)
    api_version = os.getenv(_OpenAIEnvVar.OPENAI_API_VERSION.value)
    api_base = os.getenv(_OpenAIEnvVar.OPENAI_API_BASE.value, None)
    deployment_id = os.getenv(_OpenAIEnvVar.OPENAI_DEPLOYMENT_NAME.value, None)
    if api_type in ("azure", "azure_ad", "azuread"):
        batch_size = 16
        max_tokens_per_minute = 60_000
    else:
        # The maximum batch size is 2048:
        # https://github.com/openai/openai-python/blob/b82a3f7e4c462a8a10fa445193301a3cefef9a4a/openai/embeddings_utils.py#L43
        # We use a smaller batch size to be safe.
        batch_size = 1024
        max_tokens_per_minute = 90_000
    return _OpenAIApiConfig(
        api_type=api_type,
        batch_size=batch_size,
        max_requests_per_minute=3_500,
        max_tokens_per_minute=max_tokens_per_minute,
        api_base=api_base,
        api_version=api_version,
        deployment_id=deployment_id,
    )


def _check_openai_key():
    if "OPENAI_API_KEY" not in os.environ:
        raise MlflowException(
            "OPENAI_API_KEY environment variable not set",
            error_code=INVALID_PARAMETER_VALUE,
        )
```

--------------------------------------------------------------------------------

---[FILE: config.py]---
Location: mlflow-master/mlflow/deployments/server/config.py
Signals: Pydantic

```python
from pydantic import ConfigDict

from mlflow.gateway.base_models import ResponseModel
from mlflow.gateway.config import EndpointModelInfo, Limit


class Endpoint(ResponseModel):
    name: str
    endpoint_type: str
    model: EndpointModelInfo
    endpoint_url: str
    limit: Limit | None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "openai-completions",
                "endpoint_type": "llm/v1/completions",
                "model": {
                    "name": "gpt-4o-mini",
                    "provider": "openai",
                },
                "endpoint_url": "/endpoints/completions/invocations",
                "limit": {"calls": 1, "key": None, "renewal_period": "minute"},
            }
        }
    )
```

--------------------------------------------------------------------------------

---[FILE: constants.py]---
Location: mlflow-master/mlflow/deployments/server/constants.py

```python
MLFLOW_DEPLOYMENTS_HEALTH_ENDPOINT = "/health"
MLFLOW_DEPLOYMENTS_CRUD_ENDPOINT_BASE = "/api/2.0/endpoints/"
MLFLOW_DEPLOYMENTS_LIMITS_BASE = "/api/2.0/endpoints/limits/"
MLFLOW_DEPLOYMENTS_ENDPOINTS_BASE = "/endpoints/"
MLFLOW_DEPLOYMENTS_QUERY_SUFFIX = "/invocations"
MLFLOW_DEPLOYMENTS_LIST_ENDPOINTS_PAGE_SIZE = 3000
```

--------------------------------------------------------------------------------

---[FILE: autolog.py]---
Location: mlflow-master/mlflow/dspy/autolog.py

```python
import importlib
import logging

from packaging.version import Version

import mlflow
from mlflow.dspy.constant import FLAVOR_NAME
from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.tracing.provider import trace_disabled
from mlflow.tracing.utils import construct_full_inputs
from mlflow.utils.autologging_utils import (
    autologging_integration,
    get_autologging_config,
    safe_patch,
)
from mlflow.utils.autologging_utils.safety import exception_safe_function_for_class

_logger = logging.getLogger(__name__)


def autolog(
    log_traces: bool = True,
    log_traces_from_compile: bool = False,
    log_traces_from_eval: bool = True,
    log_compiles: bool = False,
    log_evals: bool = False,
    disable: bool = False,
    silent: bool = False,
):
    """
    Enables (or disables) and configures autologging from DSPy to MLflow. Currently, the
    MLflow DSPy flavor only supports autologging for tracing.

    Args:
        log_traces: If ``True``, traces are logged for DSPy models by using. If ``False``,
            no traces are collected during inference. Default to ``True``.
        log_traces_from_compile: If ``True``, traces are logged when compiling (optimizing)
            DSPy programs. If ``False``, traces are only logged from normal model inference and
            disabled when compiling. Default to ``False``.
        log_traces_from_eval: If ``True``, traces are logged for DSPy models when running DSPy's
            `built-in evaluator <https://dspy.ai/learn/evaluation/metrics/#evaluation>`_.
            If ``False``, traces are only logged from normal model inference and disabled when
            running the evaluator. Default to ``True``.
        log_compiles: If ``True``, information about the optimization process is logged when
            `Teleprompter.compile()` is called.
        log_evals: If ``True``, information about the evaluation call is logged when
            `Evaluate.__call__()` is called.
        disable: If ``True``, disables the DSPy autologging integration. If ``False``,
            enables the DSPy autologging integration.
        silent: If ``True``, suppress all event logs and warnings from MLflow during DSPy
            autologging. If ``False``, show all events and warnings.
    """
    # NB: The @autologging_integration annotation is used for adding shared logic. However, one
    # caveat is that the wrapped function is NOT executed when disable=True is passed. This prevents
    # us from running cleaning up logging when autologging is turned off. To workaround this, we
    # annotate _autolog() instead of this entrypoint, and define the cleanup logic outside it.
    # This needs to be called before doing any safe-patching (otherwise safe-patch will be no-op).
    # TODO: since this implementation is inconsistent, explore a universal way to solve the issue.
    _autolog(
        log_traces=log_traces,
        log_traces_from_compile=log_traces_from_compile,
        log_traces_from_eval=log_traces_from_eval,
        log_compiles=log_compiles,
        log_evals=log_evals,
        disable=disable,
        silent=silent,
    )

    import dspy

    from mlflow.dspy.callback import MlflowCallback

    # Enable tracing by setting the MlflowCallback
    if not disable:
        if not any(isinstance(c, MlflowCallback) for c in dspy.settings.callbacks):
            dspy.settings.configure(callbacks=[*dspy.settings.callbacks, MlflowCallback()])
        # DSPy token tracking has an issue before 3.0.4: https://github.com/stanfordnlp/dspy/pull/8831
        if Version(importlib.metadata.version("dspy")) >= Version("3.0.4"):
            dspy.settings.configure(track_usage=True)

    else:
        dspy.settings.configure(
            callbacks=[c for c in dspy.settings.callbacks if not isinstance(c, MlflowCallback)]
        )

    from dspy.teleprompt import Teleprompter

    compile_patch = "compile"
    for cls in Teleprompter.__subclasses__():
        # NB: This is to avoid the abstraction inheritance of superclasses that are defined
        # only for the purposes of abstraction. The recursion behavior of the
        # __subclasses__ dunder method will target the appropriate subclasses we need to patch.
        if hasattr(cls, compile_patch):
            safe_patch(
                FLAVOR_NAME,
                cls,
                compile_patch,
                _patched_compile,
                manage_run=get_autologging_config(FLAVOR_NAME, "log_compiles"),
            )

    from dspy.evaluate import Evaluate

    call_patch = "__call__"
    if hasattr(Evaluate, call_patch):
        safe_patch(
            FLAVOR_NAME,
            Evaluate,
            call_patch,
            _patched_evaluate,
        )

    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )


# This is required by mlflow.autolog()
autolog.integration_name = FLAVOR_NAME


@autologging_integration(FLAVOR_NAME)
def _autolog(
    log_traces: bool,
    log_traces_from_compile: bool,
    log_traces_from_eval: bool,
    log_compiles: bool,
    log_evals: bool,
    disable: bool = False,
    silent: bool = False,
):
    pass


def _active_callback():
    import dspy

    from mlflow.dspy.callback import MlflowCallback

    for callback in dspy.settings.callbacks:
        if isinstance(callback, MlflowCallback):
            return callback


def _patched_compile(original, self, *args, **kwargs):
    from mlflow.dspy.util import (
        log_dspy_dataset,
        log_dspy_lm_state,
        log_dummy_model_outputs,
        save_dspy_module_state,
    )

    # NB: Since calling mlflow.dspy.autolog() again does not unpatch a function, we need to
    # check this flag at runtime to determine if we should generate traces.
    # method to disable tracing for compile and evaluate by default
    @trace_disabled
    def _trace_disabled_fn(self, *args, **kwargs):
        return original(self, *args, **kwargs)

    def _compile_fn(self, *args, **kwargs):
        if callback := _active_callback():
            callback.optimizer_stack_level += 1
        try:
            if get_autologging_config(FLAVOR_NAME, "log_traces_from_compile"):
                result = original(self, *args, **kwargs)
            else:
                result = _trace_disabled_fn(self, *args, **kwargs)
            return result
        finally:
            if callback:
                callback.optimizer_stack_level -= 1
                if callback.optimizer_stack_level == 0:
                    # Reset the callback state after the completion of root compile
                    callback.reset()

    if not get_autologging_config(FLAVOR_NAME, "log_compiles"):
        return _compile_fn(self, *args, **kwargs)

    # NB: Log a dummy run outputs such that "Run" tab is shown in the UI. Currently, the
    # GenAI experiment does not show the "Run" tab without this, which is critical gap for
    # DSPy users. This should be done BEFORE the compile call, because Run page is used
    # for tracking the compile progress, not only after finishing the compile.
    log_dummy_model_outputs()

    program = _compile_fn(self, *args, **kwargs)
    # Save the state of the best model in json format
    # so that users can see the demonstrations and instructions.
    save_dspy_module_state(program, "best_model.json")

    # Teleprompter.get_params is introduced in dspy 2.6.15
    params = (
        self.get_params()
        if Version(importlib.metadata.version("dspy")) >= Version("2.6.15")
        else {}
    )
    # Construct the dict of arguments passed to the compile call
    inputs = construct_full_inputs(original, self, *args, **kwargs)
    # Update params with the arguments passed to the compile call
    params.update(inputs)
    mlflow.log_params({k: v for k, v in inputs.items() if isinstance(v, (int, float, str, bool))})

    # Log the current DSPy LM state
    log_dspy_lm_state()

    if trainset := inputs.get("trainset"):
        log_dspy_dataset(trainset, "trainset.json")
    if valset := inputs.get("valset"):
        log_dspy_dataset(valset, "valset.json")
    return program


def _patched_evaluate(original, self, *args, **kwargs):
    # NB: Since calling mlflow.dspy.autolog() again does not unpatch a function, we need to
    # check this flag at runtime to determine if we should generate traces.
    # method to disable tracing for compile and evaluate by default
    @trace_disabled
    def _trace_disabled_fn(self, *args, **kwargs):
        return original(self, *args, **kwargs)

    if not get_autologging_config(FLAVOR_NAME, "log_traces_from_eval"):
        return _trace_disabled_fn(self, *args, **kwargs)

    # Patch metric call to log assessment results on the prediction traces
    new_kwargs = construct_full_inputs(original, self, *args, **kwargs)
    metric = new_kwargs.get("metric") or self.metric
    new_kwargs["metric"] = _patch_metric(metric)

    args_passed_positional = list(new_kwargs.keys())[: len(args)]
    new_args = [new_kwargs.pop(arg) for arg in args_passed_positional]

    return original(self, *new_args, **new_kwargs)


def _patch_metric(metric):
    """Patch the metric call to log assessment results on the prediction traces."""
    import dspy

    # NB: This patch MUST not raise an exception, otherwise may interrupt the evaluation call.
    @exception_safe_function_for_class
    def _patched(*args, **kwargs):
        # NB: DSPy runs prediction and the metric call in the same thread, so we can retrieve
        # the prediction trace ID using the last active trace ID.
        # https://github.com/stanfordnlp/dspy/blob/8224a99ca6402863540aae5aa3bc5eddbd2947c4/dspy/evaluate/evaluate.py#L170-L173
        pred_trace_id = mlflow.get_last_active_trace_id(thread_local=True)
        if not pred_trace_id:
            _logger.debug("Tracing during evaluation is enabled, but no prediction trace found.")
            return metric(*args, **kwargs)

        try:
            score = metric(*args, **kwargs)
        except Exception as e:
            _logger.debug("Metric call failed, logging an assessment with error")
            mlflow.log_feedback(trace_id=pred_trace_id, name=metric.__name__, error=e)
            raise

        try:
            if isinstance(score, dspy.Prediction):
                # GEPA metric returns a Prediction object with score and feedback attributes.
                # https://dspy.ai/tutorials/gepa_aime/
                value = getattr(score, "score", None)
                rationale = getattr(score, "feedback", None)
            else:
                value = score
                rationale = None

            mlflow.log_feedback(
                trace_id=pred_trace_id,
                name=metric.__name__,
                value=value,
                rationale=rationale,
            )
        except Exception as e:
            _logger.debug(f"Failed to log feedback for metric on prediction trace: {e}")

        return score

    return _patched
```

--------------------------------------------------------------------------------

````
