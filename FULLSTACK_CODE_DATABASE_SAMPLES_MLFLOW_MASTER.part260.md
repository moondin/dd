---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 260
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 260 of 991)

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

---[FILE: constants.py]---
Location: mlflow-master/mlflow/gateway/constants.py

```python
MLFLOW_GATEWAY_HEALTH_ENDPOINT = "/health"
MLFLOW_GATEWAY_CRUD_ROUTE_BASE = "/api/2.0/gateway/routes/"
MLFLOW_GATEWAY_CRUD_ENDPOINT_V3_BASE = "/api/3.0/gateway/endpoint/"
MLFLOW_GATEWAY_CRUD_ROUTE_V3_BASE = "/api/3.0/gateway/route/"
MLFLOW_GATEWAY_LIMITS_BASE = "/api/2.0/gateway/limits/"
MLFLOW_GATEWAY_ROUTE_BASE = "/gateway/"
MLFLOW_QUERY_SUFFIX = "/invocations"
MLFLOW_GATEWAY_SEARCH_ROUTES_PAGE_SIZE = 3000

# Specifies the timeout for the Gateway server to declare a request submitted to a provider has
# timed out.
MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS = 300

# Abridged retryable error codes for the interface to the Gateway Server.
# These are modified from the standard MLflow Tracking server retry codes for the MLflowClient to
# remove timeouts from the list of the retryable conditions. A long-running timeout with
# retries for the proxied providers generally indicates an issue with the underlying query or
# the model being served having issues responding to the query due to parameter configuration.
MLFLOW_GATEWAY_CLIENT_QUERY_RETRY_CODES = frozenset(
    [
        429,  # Too many requests
        500,  # Server Error
        502,  # Bad Gateway
        503,  # Service Unavailable
    ]
)

# Provider constants
MLFLOW_AI_GATEWAY_ANTHROPIC_MAXIMUM_MAX_TOKENS = 1_000_000
# Max for Claude 3.5 Sonnet. Newer models have higher limits.
# https://docs.anthropic.com/en/docs/about-claude/models/overview#model-comparison-table
MLFLOW_AI_GATEWAY_ANTHROPIC_DEFAULT_MAX_TOKENS = 8192

# MLflow model serving constants
MLFLOW_SERVING_RESPONSE_KEY = "predictions"

# MosaicML constants
# MosaicML supported chat model names
# These validated names are used for the MosaicML provider due to the need to perform prompt
# translations prior to sending a request payload to their chat endpoints.
# to reduce the need to case-match, supported model prefixes are lowercase.
MLFLOW_AI_GATEWAY_MOSAICML_CHAT_SUPPORTED_MODEL_PREFIXES = ["llama2"]
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: mlflow-master/mlflow/gateway/exceptions.py

```python
class AIGatewayConfigException(Exception):
    pass


class AIGatewayException(Exception):
    """
    A custom exception class for handling exceptions raised by the AI Gateway.
    This will be transformed into an HTTPException before being returned to the client.
    """

    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)
```

--------------------------------------------------------------------------------

---[FILE: provider_registry.py]---
Location: mlflow-master/mlflow/gateway/provider_registry.py

```python
from mlflow import MlflowException
from mlflow.gateway.config import Provider
from mlflow.gateway.providers import BaseProvider
from mlflow.utils.plugins import get_entry_points


class ProviderRegistry:
    def __init__(self):
        self._providers: dict[str | Provider, type[BaseProvider]] = {}

    def register(self, name: str, provider: type[BaseProvider]):
        if name in self._providers:
            raise MlflowException.invalid_parameter_value(
                f"Provider {name} is already registered: {self._providers[name]}"
            )
        self._providers[name] = provider

    def get(self, name: str) -> type[BaseProvider]:
        if name not in self._providers:
            raise MlflowException.invalid_parameter_value(f"Provider {name} not found")
        return self._providers[name]

    def keys(self):
        return list(self._providers.keys())


def _register_default_providers(registry: ProviderRegistry):
    from mlflow.gateway.providers.ai21labs import AI21LabsProvider
    from mlflow.gateway.providers.anthropic import AnthropicProvider
    from mlflow.gateway.providers.bedrock import AmazonBedrockProvider
    from mlflow.gateway.providers.cohere import CohereProvider
    from mlflow.gateway.providers.gemini import GeminiProvider
    from mlflow.gateway.providers.huggingface import HFTextGenerationInferenceServerProvider
    from mlflow.gateway.providers.litellm import LiteLLMProvider
    from mlflow.gateway.providers.mistral import MistralProvider
    from mlflow.gateway.providers.mlflow import MlflowModelServingProvider
    from mlflow.gateway.providers.mosaicml import MosaicMLProvider
    from mlflow.gateway.providers.openai import OpenAIProvider
    from mlflow.gateway.providers.palm import PaLMProvider
    from mlflow.gateway.providers.togetherai import TogetherAIProvider

    registry.register(Provider.OPENAI, OpenAIProvider)
    registry.register(Provider.ANTHROPIC, AnthropicProvider)
    registry.register(Provider.COHERE, CohereProvider)
    registry.register(Provider.AI21LABS, AI21LabsProvider)
    registry.register(Provider.MOSAICML, MosaicMLProvider)
    registry.register(Provider.PALM, PaLMProvider)
    registry.register(Provider.GEMINI, GeminiProvider)
    registry.register(Provider.MLFLOW_MODEL_SERVING, MlflowModelServingProvider)
    registry.register(Provider.BEDROCK, AmazonBedrockProvider)
    registry.register(Provider.AMAZON_BEDROCK, AmazonBedrockProvider)
    registry.register(
        Provider.HUGGINGFACE_TEXT_GENERATION_INFERENCE, HFTextGenerationInferenceServerProvider
    )
    registry.register(Provider.MISTRAL, MistralProvider)
    registry.register(Provider.TOGETHERAI, TogetherAIProvider)
    registry.register(Provider.LITELLM, LiteLLMProvider)


def _register_plugin_providers(registry: ProviderRegistry):
    providers = get_entry_points("mlflow.gateway.providers")
    for p in providers:
        cls = p.load()
        registry.register(p.name, cls)


def is_supported_provider(name: str) -> bool:
    return name in provider_registry.keys()


provider_registry = ProviderRegistry()
_register_default_providers(provider_registry)
_register_plugin_providers(provider_registry)
```

--------------------------------------------------------------------------------

---[FILE: runner.py]---
Location: mlflow-master/mlflow/gateway/runner.py

```python
import logging
import os
import subprocess
import sys
from typing import Generator

from watchfiles import watch

from mlflow.environment_variables import MLFLOW_GATEWAY_CONFIG
from mlflow.gateway import app
from mlflow.gateway.config import _load_gateway_config
from mlflow.gateway.utils import kill_child_processes

_logger = logging.getLogger(__name__)


def monitor_config(config_path: str) -> Generator[None, None, None]:
    with open(config_path) as f:
        prev_config = f.read()

    for changes in watch(os.path.dirname(config_path)):
        if not any((path == config_path) for _, path in changes):
            continue

        if not os.path.exists(config_path):
            _logger.warning(f"{config_path} deleted")
            continue

        with open(config_path) as f:
            config = f.read()
        if config == prev_config:
            continue

        try:
            _load_gateway_config(config_path)
        except Exception as e:
            _logger.warning("Invalid configuration: %s", e)
            continue
        else:
            prev_config = config

        yield


class Runner:
    def __init__(
        self,
        config_path: str,
        host: str,
        port: int,
        workers: int,
    ) -> None:
        self.config_path = config_path
        self.host = host
        self.port = port
        self.workers = workers
        self.process = None

    def start(self) -> None:
        self.process = subprocess.Popen(
            [
                sys.executable,
                "-m",
                "gunicorn",
                "--bind",
                f"{self.host}:{self.port}",
                "--workers",
                str(self.workers),
                "--worker-class",
                "uvicorn.workers.UvicornWorker",
                f"{app.__name__}:create_app_from_env()",
            ],
            env={
                **os.environ,
                MLFLOW_GATEWAY_CONFIG.name: self.config_path,
            },
        )

    def stop(self) -> None:
        if self.process is not None:
            self.process.terminate()
            self.process.wait()
            self.process = None

    def reload(self) -> None:
        kill_child_processes(self.process.pid)

    def __enter__(self):
        self.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.stop()


def run_app(config_path: str, host: str, port: int, workers: int) -> None:
    config_path = os.path.abspath(os.path.normpath(os.path.expanduser(config_path)))
    with Runner(
        config_path=config_path,
        host=host,
        port=port,
        workers=workers,
    ) as runner:
        for _ in monitor_config(config_path):
            _logger.info("Configuration updated, reloading workers")
            runner.reload()
```

--------------------------------------------------------------------------------

---[FILE: uc_function_utils.py]---
Location: mlflow-master/mlflow/gateway/uc_function_utils.py

```python
# TODO: Move this in mlflow/gateway/utils/uc_functions.py

import json
import re
from dataclasses import dataclass
from io import StringIO
from typing import TYPE_CHECKING, Any, Literal

if TYPE_CHECKING:
    from databricks.sdk import WorkspaceClient
    from databricks.sdk.service.catalog import FunctionInfo, FunctionParameterInfo
    from databricks.sdk.service.sql import StatementParameterListItem


_UC_FUNCTION = "uc_function"


def uc_type_to_json_schema_type(uc_type_json: str | dict[str, Any]) -> dict[str, Any]:
    """
    Converts the JSON representation of a Unity Catalog data type to the corresponding JSON schema
    type. The conversion is lossy because we do not need to convert it back.
    """
    # See https://docs.databricks.com/en/sql/language-manual/sql-ref-datatypes.html
    # The actual type name in type_json is different from the corresponding SQL type name.
    spark_struct_field_mapping = {
        "long": {"type": "integer"},
        "binary": {"type": "string"},
        "boolean": {"type": "boolean"},
        "date": {"type": "string", "format": "date"},
        "double": {"type": "number"},
        "float": {"type": "number"},
        "integer": {"type": "integer"},
        "void": {"type": "null"},
        "short": {"type": "integer"},
        "string": {"type": "string"},
        "timestamp": {"type": "string", "format": "date-time"},
        "timestamp_ntz": {"type": "string", "format": "date-time"},
        "byte": {"type": "integer"},
    }
    if isinstance(uc_type_json, str):
        if t := spark_struct_field_mapping.get(uc_type_json):
            return t
        else:
            if uc_type_json.startswith("decimal"):
                return {"type": "number"}
            elif uc_type_json.startswith("interval"):
                raise TypeError(f"Type {uc_type_json} is not supported.")
            else:
                raise TypeError(f"Unknown type {uc_type_json}. Try upgrading this package.")
    else:
        assert isinstance(uc_type_json, dict)
        type = uc_type_json["type"]
        if type == "array":
            element_type = uc_type_to_json_schema_type(uc_type_json["elementType"])
            return {"type": "array", "items": element_type}
        elif type == "map":
            key_type = uc_type_json["keyType"]
            if key_type != "string":
                raise TypeError(f"Only support STRING key type for MAP but got {key_type}.")
            value_type = uc_type_to_json_schema_type(uc_type_json["valueType"])
            return {
                "type": "object",
                "additionalProperties": value_type,
            }
        elif type == "struct":
            properties = {}
            for field in uc_type_json["fields"]:
                properties[field["name"]] = uc_type_to_json_schema_type(field["type"])
            return {"type": "object", "properties": properties}
        else:
            raise TypeError(f"Unknown type {uc_type_json}. Try upgrading this package.")


def extract_param_metadata(p: "FunctionParameterInfo") -> dict[str, Any]:
    type_json = json.loads(p.type_json)["type"]
    json_schema_type = uc_type_to_json_schema_type(type_json)
    json_schema_type["name"] = p.name
    json_schema_type["description"] = (
        (p.comment or "") + f" (default: {p.parameter_default})" if p.parameter_default else ""
    )
    return json_schema_type


def get_func_schema(func: "FunctionInfo") -> dict[str, Any]:
    parameters = func.input_params.parameters if func.input_params else []
    return {
        "description": func.comment,
        "name": _get_tool_name(func),
        "parameters": {
            "type": "object",
            "properties": {p.name: extract_param_metadata(p) for p in parameters},
            "required": [p.name for p in parameters if p.parameter_default is None],
        },
    }


@dataclass
class ParameterizedStatement:
    statement: str
    parameters: list["StatementParameterListItem"]


@dataclass
class FunctionExecutionResult:
    """
    Result of executing a function.
    We always use a string to present the result value for AI model to consume.
    """

    error: str | None = None
    format: Literal["SCALAR", "CSV"] | None = None
    value: str | None = None
    truncated: bool | None = None

    def to_json(self) -> str:
        data = {k: v for (k, v) in self.__dict__.items() if v is not None}
        return json.dumps(data)


def is_scalar(function: "FunctionInfo") -> bool:
    """
    Returns True if the function returns a single row instead of a table.
    """
    from databricks.sdk.service.catalog import ColumnTypeName

    return function.data_type != ColumnTypeName.TABLE_TYPE


def get_execute_function_sql_stmt(
    function: "FunctionInfo",
    json_params: dict[str, Any],
) -> ParameterizedStatement:
    from databricks.sdk.service.catalog import ColumnTypeName
    from databricks.sdk.service.sql import StatementParameterListItem

    parts = []
    output_params = []
    if is_scalar(function):
        parts.append(f"SELECT {function.full_name}(")
    else:
        parts.append(f"SELECT * FROM {function.full_name}(")
    if function.input_params is None or function.input_params.parameters is None:
        assert not json_params, "Function has no parameters but parameters were provided."
    else:
        args = []
        use_named_args = False
        for p in function.input_params.parameters:
            if p.name not in json_params:
                if p.parameter_default is not None:
                    use_named_args = True
                else:
                    raise ValueError(f"Parameter {p.name} is required but not provided.")
            else:
                arg_clause = ""
                if use_named_args:
                    arg_clause += f"{p.name} => "
                json_value = json_params[p.name]
                if p.type_name in (
                    ColumnTypeName.ARRAY,
                    ColumnTypeName.MAP,
                    ColumnTypeName.STRUCT,
                ):
                    # Use from_json to restore values of complex types.
                    json_value_str = json.dumps(json_value)
                    # TODO: parametrize type
                    arg_clause += f"from_json(:{p.name}, '{p.type_text}')"
                    output_params.append(
                        StatementParameterListItem(name=p.name, value=json_value_str)
                    )
                elif p.type_name == ColumnTypeName.BINARY:
                    # Use ubbase64 to restore binary values.
                    arg_clause += f"unbase64(:{p.name})"
                    output_params.append(StatementParameterListItem(name=p.name, value=json_value))
                else:
                    arg_clause += f":{p.name}"
                    output_params.append(
                        StatementParameterListItem(name=p.name, value=json_value, type=p.type_text)
                    )
                args.append(arg_clause)
        parts.append(",".join(args))
    parts.append(")")
    # TODO: check extra params in kwargs
    statement = "".join(parts)
    return ParameterizedStatement(statement=statement, parameters=output_params)


def execute_function(
    ws: "WorkspaceClient",
    warehouse_id: str,
    function: "FunctionInfo",
    parameters: dict[str, Any],
) -> FunctionExecutionResult:
    """
    Execute a function with the given arguments and return the result.
    """
    try:
        import pandas as pd
    except ImportError as e:
        raise ImportError(
            "Could not import pandas python package. Please install it with `pip install pandas`."
        ) from e
    from databricks.sdk.service.sql import StatementState

    # TODO: async so we can run functions in parallel
    parameterized_statement = get_execute_function_sql_stmt(function, parameters)
    # TODO: make limits and wait timeout configurable
    response = ws.statement_execution.execute_statement(
        statement=parameterized_statement.statement,
        warehouse_id=warehouse_id,
        parameters=parameterized_statement.parameters,
        wait_timeout="30s",
        row_limit=100,
        byte_limit=4096,
    )
    status = response.status
    assert status is not None, f"Statement execution failed: {response}"
    if status.state != StatementState.SUCCEEDED:
        error = status.error
        assert error is not None, "Statement execution failed but no error message was provided."
        return FunctionExecutionResult(error=f"{error.error_code}: {error.message}")
    manifest = response.manifest
    assert manifest is not None
    truncated = manifest.truncated
    result = response.result
    assert result is not None, "Statement execution succeeded but no result was provided."
    data_array = result.data_array
    if is_scalar(function):
        value = None
        if data_array and len(data_array) > 0 and len(data_array[0]) > 0:
            value = str(data_array[0][0])  # type: ignore
        return FunctionExecutionResult(format="SCALAR", value=value, truncated=truncated)
    else:
        schema = manifest.schema
        assert schema is not None and schema.columns is not None, (
            "Statement execution succeeded but no schema was provided."
        )
        columns = [c.name for c in schema.columns]
        if data_array is None:
            data_array = []
        pdf = pd.DataFrame.from_records(data_array, columns=columns)
        csv_buffer = StringIO()
        pdf.to_csv(csv_buffer, index=False)
        return FunctionExecutionResult(
            format="CSV", value=csv_buffer.getvalue(), truncated=truncated
        )


def join_uc_functions(uc_functions: list[dict[str, Any]]):
    calls = [
        f"""
<uc_function_call>
{json.dumps(request, indent=2)}
</uc_function_call>

<uc_function_result>
{json.dumps(result, indent=2)}
</uc_function_result>
""".strip()
        for (request, result) in uc_functions
    ]
    return "\n\n".join(calls)


def _get_tool_name(function: "FunctionInfo") -> str:
    # The maximum function name length OpenAI supports is 64 characters.
    return f"{function.catalog_name}__{function.schema_name}__{function.name}"[-64:]


@dataclass
class ParseResult:
    tool_calls: list[dict[str, Any]]
    tool_messages: list[dict[str, Any]]


_UC_REGEX = re.compile(
    r"""
<uc_function_call>
(?P<uc_function_call>.*?)
</uc_function_call>

<uc_function_result>
(?P<uc_function_result>.*?)
</uc_function_result>
""",
    re.DOTALL,
)


def parse_uc_functions(content) -> ParseResult | None:
    tool_calls = []
    tool_messages = []
    for m in _UC_REGEX.finditer(content):
        c = m.group("uc_function_call")
        g = m.group("uc_function_result")
        tool_calls.append(json.loads(c))
        tool_messages.append(json.loads(g))

    return ParseResult(tool_calls, tool_messages) if tool_calls else None


@dataclass
class TokenUsageAccumulator:
    prompt_tokens: int = 0
    completions_tokens: int = 0
    total_tokens: int = 0

    def update(self, usage_dict):
        self.prompt_tokens += usage_dict.get("prompt_tokens", 0)
        self.completions_tokens += usage_dict.get("completion_tokens", 0)
        self.total_tokens += usage_dict.get("total_tokens", 0)

    def dict(self):
        return {
            "prompt_tokens": self.prompt_tokens,
            "completion_tokens": self.completions_tokens,
            "total_tokens": self.total_tokens,
        }


def prepend_uc_functions(content, uc_functions):
    return join_uc_functions(uc_functions) + "\n\n" + content
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/gateway/utils.py
Signals: FastAPI

```python
import base64
import functools
import inspect
import json
import logging
import posixpath
import re
import textwrap
import warnings
from typing import Any, AsyncGenerator
from urllib.parse import urlparse

from fastapi import HTTPException

from mlflow.environment_variables import MLFLOW_GATEWAY_URI
from mlflow.exceptions import MlflowException
from mlflow.gateway.constants import MLFLOW_AI_GATEWAY_MOSAICML_CHAT_SUPPORTED_MODEL_PREFIXES
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.utils.uri import append_to_uri_path

_logger = logging.getLogger(__name__)
_gateway_uri: str | None = None


def is_valid_endpoint_name(name: str) -> bool:
    """
    Check whether a string contains any URL reserved characters, spaces, or characters other
    than alphanumeric, underscore, hyphen, and dot.

    Returns True if the string doesn't contain any of these characters.
    """
    return bool(re.fullmatch(r"[\w\-\.]+", name))


def check_configuration_route_name_collisions(config):
    endpoints = config.get("endpoints") or []
    routes = config.get("routes") or []

    endpoint_names = [endpoint["name"] for endpoint in endpoints]
    route_names = [route["name"] for route in routes]

    merged_names = endpoint_names + route_names
    if len(merged_names) != len(set(merged_names)):
        raise MlflowException.invalid_parameter_value(
            "Duplicate names found in endpoint / route configurations. "
            "Please remove the duplicate endpoint / route name "
            "from the configuration to ensure that endpoints / routes are created properly."
        )

    endpoint_config_dict = {endpoint["name"]: endpoint for endpoint in endpoints}

    for route in routes:
        route_name = route["name"]
        route_task_type = route["task_type"]

        traffic_percentage_sum = 0
        for destination in route.get("destinations"):
            dest_name = destination.get("name")
            dest_traffic_percentage = destination.get("traffic_percentage")
            traffic_percentage_sum += dest_traffic_percentage
            if dest_name not in endpoint_names:
                raise MlflowException.invalid_parameter_value(
                    f"The route destination name must be a endpoint name, "
                    f"but the route '{route_name}' has an invalid destination name '{dest_name}'."
                )

            dest_endpoint_type = endpoint_config_dict[dest_name].get("endpoint_type")
            if route_task_type != dest_endpoint_type:
                raise MlflowException.invalid_parameter_value(
                    f"The route destination endpoint types in the route '{route_name}' must have "
                    f"endpoint type '{route_task_type}' but got endpoint type "
                    f"'{dest_endpoint_type}'."
                )

            if not (0 <= dest_traffic_percentage <= 100):
                raise MlflowException.invalid_parameter_value(
                    "The route destination traffic percentage must between 0 and 100."
                )

        if traffic_percentage_sum != 100:
            raise MlflowException.invalid_parameter_value(
                "For each route configuration, the traffic percentage sum of destinations "
                f"must be 100, but got invalid configuration of route '{route_name}'."
            )


def check_configuration_deprecated_fields(config):
    endpoints = config.get("endpoints", [])
    for endpoint in endpoints:
        if "route_type" in endpoint:
            raise MlflowException.invalid_parameter_value(
                "The 'route_type' configuration key is not supported in the configuration file. "
                "Use 'endpoint_type' instead."
            )


def kill_child_processes(parent_pid):
    """
    Gracefully terminate or kill child processes from a main process
    """
    import psutil

    parent = psutil.Process(parent_pid)
    for child in parent.children(recursive=True):
        try:
            child.terminate()
        except psutil.NoSuchProcess:
            pass
    _, still_alive = psutil.wait_procs(parent.children(), timeout=3)
    for p in still_alive:
        p.kill()


def _is_valid_uri(uri: str):
    """
    Evaluates the basic structure of a provided gateway uri to determine if the scheme and
    netloc are provided
    """
    if uri == "databricks":
        return True
    try:
        parsed = urlparse(uri)
        return parsed.scheme == "databricks" or all([parsed.scheme, parsed.netloc])
    except ValueError:
        return False


def _get_indent(s: str) -> str:
    for l in s.splitlines():
        if l.startswith(" "):
            return " " * (len(l) - len(l.lstrip()))
    return ""


def _prepend(docstring: str | None, text: str) -> str:
    if not docstring:
        return text

    indent = _get_indent(docstring)
    return f"""
{textwrap.indent(text, indent)}

{docstring}
"""


def gateway_deprecated(obj):
    msg = (
        "MLflow AI gateway is deprecated and has been replaced by the deployments API for "
        "generative AI. See https://mlflow.org/docs/latest/llms/gateway/migration.html for "
        "migration."
    )
    warning = f"""
.. warning::

    {msg}
""".strip()
    if inspect.isclass(obj):
        original = obj.__init__

        @functools.wraps(original)
        def wrapper(*args, **kwargs):
            warnings.warn(msg, FutureWarning, stacklevel=2)
            return original(*args, **kwargs)

        obj.__init__ = wrapper
        obj.__init__.__doc__ = _prepend(obj.__init__.__doc__, warning)
        return obj
    else:

        @functools.wraps(obj)
        def wrapper(*args, **kwargs):
            warnings.warn(msg, FutureWarning, stacklevel=2)
            return obj(*args, **kwargs)

        wrapper.__doc__ = _prepend(obj.__doc__, warning)

        return wrapper


@gateway_deprecated
def set_gateway_uri(gateway_uri: str):
    """Sets the uri of a configured and running MLflow AI Gateway server in a global context.
    Providing a valid uri and calling this function is required in order to use the MLflow
    AI Gateway fluent APIs.

    Args:
        gateway_uri: The full uri of a running MLflow AI Gateway server or, if running on
            Databricks, "databricks".
    """
    if not _is_valid_uri(gateway_uri):
        raise MlflowException.invalid_parameter_value(
            "The gateway uri provided is missing required elements. Ensure that the schema "
            "and netloc are provided."
        )

    global _gateway_uri
    _gateway_uri = gateway_uri


@gateway_deprecated
def get_gateway_uri() -> str:
    """
    Returns the currently set MLflow AI Gateway server uri iff set.
    If the Gateway uri has not been set by using ``set_gateway_uri``, an ``MlflowException``
    is raised.
    """
    if _gateway_uri is not None:
        return _gateway_uri
    elif uri := MLFLOW_GATEWAY_URI.get():
        return uri
    else:
        raise MlflowException(
            "No Gateway server uri has been set. Please either set the MLflow Gateway URI via "
            "`mlflow.gateway.set_gateway_uri()` or set the environment variable "
            f"{MLFLOW_GATEWAY_URI} to the running Gateway API server's uri"
        )


def assemble_uri_path(paths: list[str]) -> str:
    """Assemble a correct URI path from a list of path parts.

    Args:
        paths: A list of strings representing parts of a URI path.

    Returns:
        A string representing the complete assembled URI path.

    """
    stripped_paths = [path.strip("/").lstrip("/") for path in paths if path]
    return "/" + posixpath.join(*stripped_paths) if stripped_paths else "/"


def resolve_route_url(base_url: str, route: str) -> str:
    """
    Performs a validation on whether the returned value is a fully qualified url (as the case
    with Databricks) or requires the assembly of a fully qualified url by appending the
    Route return route_url to the base url of the AI Gateway server.

    Args:
        base_url: The base URL. Should include the scheme and domain, e.g.,
            ``http://127.0.0.1:6000``.
        route: The route to be appended to the base URL, e.g., ``/api/2.0/gateway/routes/`` or,
            in the case of Databricks, the fully qualified url.

    Returns:
        The complete URL, either directly returned or formed and returned by joining the
        base URL and the route path.
    """
    return route if _is_valid_uri(route) else append_to_uri_path(base_url, route)


class SearchRoutesToken:
    def __init__(self, index: int):
        self._index = index

    @property
    def index(self):
        return self._index

    @classmethod
    def decode(cls, encoded_token: str):
        try:
            decoded_token = base64.b64decode(encoded_token)
            parsed_token = json.loads(decoded_token)
            index = int(parsed_token.get("index"))
        except Exception as e:
            raise MlflowException.invalid_parameter_value(
                f"Invalid SearchRoutes token: {encoded_token}. The index is not defined as a "
                "value that can be represented as a positive integer."
            ) from e

        if index < 0:
            raise MlflowException.invalid_parameter_value(
                f"Invalid SearchRoutes token: {encoded_token}. The index cannot be negative."
            )

        return cls(index=index)

    def encode(self) -> str:
        token_json = json.dumps(
            {
                "index": self.index,
            }
        )
        encoded_token_bytes = base64.b64encode(bytes(token_json, "utf-8"))
        return encoded_token_bytes.decode("utf-8")


def is_valid_mosiacml_chat_model(model_name: str) -> bool:
    return any(
        model_name.lower().startswith(supported)
        for supported in MLFLOW_AI_GATEWAY_MOSAICML_CHAT_SUPPORTED_MODEL_PREFIXES
    )


def is_valid_ai21labs_model(model_name: str) -> bool:
    return model_name in {"j2-ultra", "j2-mid", "j2-light"}


def strip_sse_prefix(s: str) -> str:
    # https://html.spec.whatwg.org/multipage/server-sent-events.html
    return re.sub(r"^data:\s+", "", s)


def to_sse_chunk(data: str) -> str:
    # https://html.spec.whatwg.org/multipage/server-sent-events.html
    return f"data: {data}\n\n"


def _find_boundary(buffer: bytes) -> int:
    try:
        return buffer.index(b"\n")
    except ValueError:
        return -1


async def handle_incomplete_chunks(
    stream: AsyncGenerator[bytes, Any],
) -> AsyncGenerator[bytes, Any]:
    """
    Wraps a streaming response and handles incomplete chunks from the server.
    See https://community.openai.com/t/incomplete-stream-chunks-for-completions-api/383520
    for more information.
    """
    buffer = b""
    async for chunk in stream:
        buffer += chunk
        while (boundary := _find_boundary(buffer)) != -1:
            yield buffer[:boundary]
            buffer = buffer[boundary + 1 :]


async def make_streaming_response(resp):
    from starlette.responses import StreamingResponse

    if isinstance(resp, AsyncGenerator):
        return StreamingResponse(
            (to_sse_chunk(d.json()) async for d in resp),
            media_type="text/event-stream",
        )
    else:
        return await resp


def translate_http_exception(func):
    """
    Decorator for translating MLflow exceptions to HTTP exceptions
    """

    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except AIGatewayException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)

    return wrapper
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/gateway/__init__.py

```python
from mlflow.gateway.utils import get_gateway_uri, set_gateway_uri

__all__ = [
    "get_gateway_uri",
    "set_gateway_uri",
]
```

--------------------------------------------------------------------------------

---[FILE: ai21labs.py]---
Location: mlflow-master/mlflow/gateway/providers/ai21labs.py
Signals: FastAPI

```python
import time

from mlflow.gateway.config import AI21LabsConfig, EndpointConfig
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.base import BaseProvider
from mlflow.gateway.providers.utils import rename_payload_keys, send_request
from mlflow.gateway.schemas import completions


class AI21LabsProvider(BaseProvider):
    NAME = "AI21Labs"
    CONFIG_TYPE = AI21LabsConfig

    def __init__(self, config: EndpointConfig) -> None:
        super().__init__(config)
        if config.model.config is None or not isinstance(config.model.config, AI21LabsConfig):
            raise TypeError(f"Unexpected config type {config.model.config}")
        self.ai21labs_config: AI21LabsConfig = config.model.config
        self.headers = {"Authorization": f"Bearer {self.ai21labs_config.ai21labs_api_key}"}
        self.base_url = f"https://api.ai21.com/studio/v1/{self.config.model.name}/"

    async def completions(self, payload: completions.RequestPayload) -> completions.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload)
        key_mapping = {
            "stop": "stopSequences",
            "n": "numResults",
            "max_tokens": "maxTokens",
        }
        for k1, k2 in key_mapping.items():
            if k2 in payload:
                raise AIGatewayException(
                    status_code=422, detail=f"Invalid parameter {k2}. Use {k1} instead."
                )
        if payload.get("stream", False):
            raise AIGatewayException(
                status_code=422,
                detail="Setting the 'stream' parameter to 'true' is not supported with the MLflow "
                "Gateway.",
            )
        payload = rename_payload_keys(payload, key_mapping)
        resp = await send_request(
            headers=self.headers,
            base_url=self.base_url,
            path="complete",
            payload=payload,
        )
        # Response example (https://docs.ai21.com/reference/j2-complete-ref)
        # ```
        # {
        #   "id": "7921a78e-d905-c9df-27e3-88e4831e3c3b",
        #   "prompt": {
        #     "text": "I will"
        #   },
        #   "completions": [
        #     {
        #       "data": {
        #         "text": " complete this"
        #       },
        #       "finishReason": {
        #         "reason": "length",
        #         "length": 2
        #       }
        #     }
        #   ]
        # }
        # ```
        return completions.ResponsePayload(
            created=int(time.time()),
            object="text_completion",
            model=self.config.model.name,
            choices=[
                completions.Choice(
                    index=idx,
                    text=c["data"]["text"],
                    finish_reason=c["finishReason"]["reason"],
                )
                for idx, c in enumerate(resp["completions"])
            ],
            usage=completions.CompletionsUsage(
                prompt_tokens=None,
                completion_tokens=None,
                total_tokens=None,
            ),
        )
```

--------------------------------------------------------------------------------

````
