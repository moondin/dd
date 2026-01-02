---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 740
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 740 of 991)

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

---[FILE: providers.py]---
Location: mlflow-master/mlflow/utils/providers.py

```python
import importlib.util
from typing import Any, TypedDict

from typing_extensions import NotRequired

_PROVIDER_BACKEND_AVAILABLE = importlib.util.find_spec("litellm") is not None

_SUPPORTED_MODEL_MODES = ("chat", "completion", "embedding", None)


class FieldDict(TypedDict):
    name: str
    description: str
    secret: bool
    required: bool
    default: NotRequired[str | None]


class AuthModeDict(TypedDict):
    display_name: str
    description: str
    fields: list[FieldDict]
    default: NotRequired[bool]
    runtime_auth: NotRequired[str]


class ResponseFieldDict(TypedDict):
    name: str
    type: str
    description: str
    required: bool
    default: NotRequired[str | None]


class AuthModeResponseDict(TypedDict):
    mode: str
    display_name: str
    description: str
    secret_fields: list[ResponseFieldDict]
    config_fields: list[ResponseFieldDict]


class ProviderConfigResponse(TypedDict):
    auth_modes: list[AuthModeResponseDict]
    default_mode: str


def _get_model_cost():
    from litellm import model_cost

    return model_cost


# Auth modes for providers with multiple authentication options.
# Each mode defines:
#   - display_name: Human-readable name for UI
#   - description: Help text explaining this auth method
#   - fields: List of fields with secret flag indicating if encrypted
#   - default: True if this is the default auth mode for the provider
#   - runtime_auth: Optional runtime auth handler name
#
# Configuration sourced from LiteLLM documentation and provider APIs:
#   - AWS Bedrock: https://docs.litellm.ai/docs/providers/bedrock
#   - Azure OpenAI: https://docs.litellm.ai/docs/providers/azure
#   - Vertex AI: https://docs.litellm.ai/docs/providers/vertex
#   - Databricks: https://docs.litellm.ai/docs/providers/databricks
#
# Only user-provided modes are included (no server-provided modes like
# managed identity, IRSA, or ADC that require specific hosting environments).
_PROVIDER_AUTH_MODES: dict[str, dict[str, AuthModeDict]] = {
    "bedrock": {
        "access_keys": {
            "display_name": "Access Keys",
            "description": "Use AWS Access Key ID and Secret Access Key",
            "default": True,
            "fields": [
                {
                    "name": "aws_access_key_id",
                    "description": "AWS Access Key ID",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "aws_secret_access_key",
                    "description": "AWS Secret Access Key",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "aws_region_name",
                    "description": "AWS Region (e.g., us-east-1)",
                    "secret": False,
                    "required": False,
                },
            ],
        },
        "iam_role": {
            "display_name": "IAM Role Assumption",
            "description": "Assume an IAM role using base credentials (for cross-account access)",
            "fields": [
                {
                    "name": "aws_access_key_id",
                    "description": "AWS Access Key ID (for assuming role)",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "aws_secret_access_key",
                    "description": "AWS Secret Access Key",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "aws_role_name",
                    "description": "IAM Role ARN to assume",
                    "secret": False,
                    "required": True,
                },
                {
                    "name": "aws_session_name",
                    "description": "Session name for assumed role",
                    "secret": False,
                    "required": False,
                },
                {
                    "name": "aws_region_name",
                    "description": "AWS Region (e.g., us-east-1)",
                    "secret": False,
                    "required": False,
                },
            ],
        },
        "session_token": {
            "display_name": "Session Token (STS)",
            "description": "Use temporary credentials with session token",
            "fields": [
                {
                    "name": "aws_access_key_id",
                    "description": "AWS Access Key ID",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "aws_secret_access_key",
                    "description": "AWS Secret Access Key",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "aws_session_token",
                    "description": "AWS Session Token",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "aws_region_name",
                    "description": "AWS Region (e.g., us-east-1)",
                    "secret": False,
                    "required": False,
                },
            ],
        },
    },
    "azure": {
        "api_key": {
            "display_name": "API Key",
            "description": "Use Azure OpenAI API Key",
            "default": True,
            "fields": [
                {
                    "name": "api_key",
                    "description": "Azure OpenAI API Key",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "api_base",
                    "description": "Azure OpenAI endpoint URL",
                    "secret": False,
                    "required": True,
                },
                {
                    "name": "api_version",
                    "description": "API version (e.g., 2024-02-01)",
                    "secret": False,
                    "required": False,
                    "default": "2024-02-01",
                },
            ],
        },
        "service_principal": {
            "display_name": "Service Principal",
            "description": "Use Azure AD Service Principal (client credentials)",
            "runtime_auth": "azure_service_principal",
            "fields": [
                {
                    "name": "client_secret",
                    "description": "Azure AD Client Secret",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "api_base",
                    "description": "Azure OpenAI endpoint URL",
                    "secret": False,
                    "required": True,
                },
                {
                    "name": "client_id",
                    "description": "Azure AD Application (Client) ID",
                    "secret": False,
                    "required": True,
                },
                {
                    "name": "tenant_id",
                    "description": "Azure AD Tenant ID",
                    "secret": False,
                    "required": True,
                },
                {
                    "name": "api_version",
                    "description": "API version (e.g., 2024-02-01)",
                    "secret": False,
                    "required": False,
                    "default": "2024-02-01",
                },
            ],
        },
    },
    "vertex_ai": {
        "service_account_json": {
            "display_name": "Service Account JSON",
            "description": "Use GCP Service Account credentials (JSON key file contents)",
            "default": True,
            "fields": [
                {
                    "name": "vertex_credentials",
                    "description": "Service Account JSON key file contents",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "vertex_project",
                    "description": "GCP Project ID",
                    "secret": False,
                    "required": True,
                },
                {
                    "name": "vertex_location",
                    "description": "GCP Region (e.g., us-central1)",
                    "secret": False,
                    "required": False,
                    "default": "us-central1",
                },
            ],
        },
    },
    "databricks": {
        "pat_token": {
            "display_name": "Personal Access Token",
            "description": "Use Databricks Personal Access Token",
            "default": True,
            "fields": [
                {
                    "name": "api_key",
                    "description": "Databricks Personal Access Token",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "api_base",
                    "description": "Databricks workspace URL",
                    "secret": False,
                    "required": True,
                },
            ],
        },
        "oauth_m2m": {
            "display_name": "OAuth M2M (Service Principal)",
            "description": "Use OAuth machine-to-machine authentication",
            "runtime_auth": "databricks_oauth_m2m",
            "fields": [
                {
                    "name": "client_secret",
                    "description": "OAuth Client Secret",
                    "secret": True,
                    "required": True,
                },
                {
                    "name": "api_base",
                    "description": "Databricks workspace URL",
                    "secret": False,
                    "required": True,
                },
                {
                    "name": "client_id",
                    "description": "OAuth Client ID",
                    "secret": False,
                    "required": True,
                },
            ],
        },
    },
}


def _build_response_field(field: FieldDict) -> ResponseFieldDict:
    response: ResponseFieldDict = {
        "name": field["name"],
        "type": "string",
        "description": field.get("description", ""),
        "required": field.get("required", True),
    }
    if "default" in field:
        response["default"] = field["default"]
    return response


def _build_auth_mode_response(mode_id: str, mode_config: AuthModeDict) -> AuthModeResponseDict:
    secret_fields: list[ResponseFieldDict] = []
    config_fields: list[ResponseFieldDict] = []

    for field in mode_config["fields"]:
        response_field = _build_response_field(field)
        if field.get("secret"):
            secret_fields.append(response_field)
        else:
            config_fields.append(response_field)

    return {
        "mode": mode_id,
        "display_name": mode_config["display_name"],
        "description": mode_config["description"],
        "secret_fields": secret_fields,
        "config_fields": config_fields,
    }


def _build_simple_api_key_mode(provider: str, description: str | None = None) -> AuthModeDict:
    return {
        "display_name": "API Key",
        "description": description or f"Use {provider.title()} API Key",
        "default": True,
        "fields": [
            {
                "name": "api_key",
                "description": f"{provider.title()} API Key",
                "secret": True,
                "required": True,
            },
        ],
    }


def get_provider_config_response(provider: str) -> ProviderConfigResponse:
    """
    Get provider configuration formatted for API response.

    For providers with multiple auth modes (bedrock, azure, vertex_ai, databricks),
    returns the full auth_modes structure. For simple API key providers, returns
    a single default auth mode.

    Args:
        provider: The LiteLLM provider name (e.g., 'openai', 'anthropic', 'databricks')

    Returns:
        dict with keys:
            - auth_modes: List of available authentication modes, each containing:
                - mode: Auth mode identifier (e.g., 'access_keys', 'api_key')
                - display_name: Human-readable name
                - description: Help text
                - secret_fields: Fields to store encrypted
                - config_fields: Non-secret config fields
            - default_mode: The recommended default auth mode
    """
    if not provider:
        raise ValueError("Provider parameter is required")

    if provider in _PROVIDER_AUTH_MODES:
        auth_modes: list[AuthModeResponseDict] = []
        default_mode: str | None = None
        for mode_id, mode_config in _PROVIDER_AUTH_MODES[provider].items():
            auth_modes.append(_build_auth_mode_response(mode_id, mode_config))
            if mode_config.get("default"):
                default_mode = mode_id
        return {
            "auth_modes": auth_modes,
            "default_mode": default_mode or auth_modes[0]["mode"],
        }

    simple_mode = _build_simple_api_key_mode(provider)
    return {
        "auth_modes": [_build_auth_mode_response("api_key", simple_mode)],
        "default_mode": "api_key",
    }


def get_all_providers() -> list[str]:
    """
    Get a list of all LiteLLM providers that have chat, completion, or embedding capabilities.

    Only returns providers that have at least one chat, completion, or embedding model,
    excluding providers that only offer image generation, audio, or other non-text services.

    Returns:
        List of provider names that support chat/completion/embedding
    """
    if not _PROVIDER_BACKEND_AVAILABLE:
        raise ImportError("LiteLLM is not installed. Install it with: pip install 'mlflow[genai]'")

    model_cost = _get_model_cost()
    providers = set()
    for _, info in model_cost.items():
        mode = info.get("mode")
        if mode in _SUPPORTED_MODEL_MODES:
            if provider := info.get("litellm_provider"):
                providers.add(provider)

    return list(providers)


def get_models(provider: str | None = None) -> list[dict[str, Any]]:
    """
    Get a list of models from LiteLLM, optionally filtered by provider.

    Returns models that support chat, completion, or embedding capabilities,
    excluding image generation, audio, and other non-text services.

    Args:
        provider: Optional provider name to filter by (e.g., 'openai', 'anthropic')

    Returns:
        List of model dictionaries with keys:
            - model: Model name
            - provider: Provider name
            - mode: Model mode (e.g., 'chat', 'completion', 'embedding')
            - supports_function_calling: Whether model supports tool/function calling
            - supports_vision: Whether model supports image/vision input
            - supports_reasoning: Whether model supports extended thinking (o1-style)
            - supports_prompt_caching: Whether model supports prompt caching
            - max_input_tokens: Maximum input context window size
            - max_output_tokens: Maximum output token limit
            - input_cost_per_token: Cost per input token (USD)
            - output_cost_per_token: Cost per output token (USD)
    """
    if not _PROVIDER_BACKEND_AVAILABLE:
        raise ImportError("LiteLLM is not installed. Install it with: pip install 'mlflow[genai]'")

    model_cost = _get_model_cost()
    models = []
    for model_name, info in model_cost.items():
        if provider and info.get("litellm_provider") != provider:
            continue

        mode = info.get("mode")
        if mode not in _SUPPORTED_MODEL_MODES:
            continue

        models.append(
            {
                "model": model_name,
                "provider": info.get("litellm_provider"),
                "mode": mode,
                "supports_function_calling": info.get("supports_function_calling", False),
                "supports_vision": info.get("supports_vision", False),
                "supports_reasoning": info.get("supports_reasoning", False),
                "supports_prompt_caching": info.get("supports_prompt_caching", False),
                "max_input_tokens": info.get("max_input_tokens"),
                "max_output_tokens": info.get("max_output_tokens"),
                "input_cost_per_token": info.get("input_cost_per_token"),
                "output_cost_per_token": info.get("output_cost_per_token"),
            }
        )

    return models
```

--------------------------------------------------------------------------------

---[FILE: request_utils.py]---
Location: mlflow-master/mlflow/utils/request_utils.py

```python
# DO NO IMPORT MLFLOW IN THIS FILE.
# This file is imported by download_cloud_file_chunk.py.
# Importing mlflow is time-consuming and we want to avoid that in artifact download subprocesses.
import os
import random
from functools import lru_cache

import requests
import urllib3
from packaging.version import Version
from requests.adapters import HTTPAdapter
from requests.exceptions import HTTPError
from urllib3.util import Retry

# Response codes that generally indicate transient network failures and merit client retries,
# based on guidance from cloud service providers
# (https://docs.microsoft.com/en-us/azure/architecture/best-practices/retry-service-specific#general-rest-and-retry-guidelines)
_TRANSIENT_FAILURE_RESPONSE_CODES = frozenset(
    [
        408,  # Request Timeout
        429,  # Too Many Requests
        500,  # Internal Server Error
        502,  # Bad Gateway
        503,  # Service Unavailable
        504,  # Gateway Timeout
    ]
)


class JitteredRetry(Retry):
    """
    urllib3 < 2 doesn't support `backoff_jitter`. This class is a workaround for that.
    """

    def __init__(self, *args, backoff_jitter=0.0, **kwargs):
        super().__init__(*args, **kwargs)
        self.backoff_jitter = backoff_jitter

    def get_backoff_time(self):
        """
        Source: https://github.com/urllib3/urllib3/commit/214b184923388328919b0a4b0c15bff603aa51be
        """
        backoff_value = super().get_backoff_time()
        if self.backoff_jitter != 0.0:
            backoff_value += random.random() * self.backoff_jitter
        # The attribute `BACKOFF_MAX` was renamed to `DEFAULT_BACKOFF_MAX` in this commit:
        # https://github.com/urllib3/urllib3/commit/f69b1c89f885a74429cabdee2673e030b35979f0
        # which was part of the major release of 2.0 for urllib3 and the support for both
        # constants was added in 1.26.9:
        # https://github.com/urllib3/urllib3/blob/1.26.9/src/urllib3/util/retry.py
        default_backoff = (
            Retry.BACKOFF_MAX
            if Version(urllib3.__version__) < Version("1.26.9")
            else Retry.DEFAULT_BACKOFF_MAX
        )

        return float(max(0, min(default_backoff, backoff_value)))


def augmented_raise_for_status(response):
    """Wrap the standard `requests.response.raise_for_status()` method and return reason"""
    try:
        response.raise_for_status()
    except HTTPError as e:
        if response.text:
            raise HTTPError(
                f"{e}. Response text: {response.text}", request=e.request, response=e.response
            )
        else:
            raise e


def download_chunk(*, range_start, range_end, headers, download_path, http_uri):
    combined_headers = {**headers, "Range": f"bytes={range_start}-{range_end}"}

    with cloud_storage_http_request(
        "get",
        http_uri,
        stream=False,
        headers=combined_headers,
        timeout=10,
    ) as response:
        expected_length = response.headers.get("Content-Length")
        if expected_length is not None:
            actual_length = response.raw.tell()
            expected_length = int(expected_length)
            if actual_length < expected_length:
                raise IOError(
                    "Incomplete read ({} bytes read, {} more expected)".format(
                        actual_length, expected_length - actual_length
                    )
                )
        # File will have been created upstream. Use r+b to ensure chunks
        # don't overwrite the entire file.
        augmented_raise_for_status(response)
        with open(download_path, "r+b") as f:
            f.seek(range_start)
            f.write(response.content)


@lru_cache(maxsize=64)
def _cached_get_request_session(
    max_retries,
    backoff_factor,
    backoff_jitter,
    retry_codes,
    raise_on_status,
    # To create a new Session object for each process, we use the process id as the cache key.
    # This is to avoid sharing the same Session object across processes, which can lead to issues
    # such as https://stackoverflow.com/q/3724900.
    _pid,
    respect_retry_after_header=True,
):
    """
    This function should not be called directly. Instead, use `_get_request_session` below.
    """

    retry_kwargs = {
        "total": max_retries,
        "connect": max_retries,
        "read": max_retries,
        "redirect": max_retries,
        "status": max_retries,
        "status_forcelist": retry_codes,
        "backoff_factor": backoff_factor,
        "backoff_jitter": backoff_jitter,
        "raise_on_status": raise_on_status,
        "respect_retry_after_header": respect_retry_after_header,
    }
    urllib3_version = Version(urllib3.__version__)
    if urllib3_version >= Version("1.26.0"):
        retry_kwargs["allowed_methods"] = None
    else:
        retry_kwargs["method_whitelist"] = None

    if urllib3_version < Version("2.0"):
        retry = JitteredRetry(**retry_kwargs)
    else:
        retry = Retry(**retry_kwargs)
    from mlflow.environment_variables import (
        MLFLOW_HTTP_POOL_CONNECTIONS,
        MLFLOW_HTTP_POOL_MAXSIZE,
    )

    adapter = HTTPAdapter(
        pool_connections=MLFLOW_HTTP_POOL_CONNECTIONS.get(),
        pool_maxsize=MLFLOW_HTTP_POOL_MAXSIZE.get(),
        max_retries=retry,
    )
    session = requests.Session()
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


def _get_request_session(
    max_retries,
    backoff_factor,
    backoff_jitter,
    retry_codes,
    raise_on_status,
    respect_retry_after_header,
):
    """Returns a `Requests.Session` object for making an HTTP request.

    Args:
        max_retries: Maximum total number of retries.
        backoff_factor: A time factor for exponential backoff. e.g. value 5 means the HTTP
            request will be retried with interval 5, 10, 20... seconds. A value of 0 turns off the
            exponential backoff.
        backoff_jitter: A random jitter to add to the backoff interval.
        retry_codes: A list of HTTP response error codes that qualifies for retry.
        raise_on_status: Whether to raise an exception, or return a response, if status falls
            in retry_codes range and retries have been exhausted.
        respect_retry_after_header: Whether to respect Retry-After header on status codes defined
            as Retry.RETRY_AFTER_STATUS_CODES or not.

    Returns:
        requests.Session object.

    """
    return _cached_get_request_session(
        max_retries,
        backoff_factor,
        backoff_jitter,
        retry_codes,
        raise_on_status,
        _pid=os.getpid(),
        respect_retry_after_header=respect_retry_after_header,
    )


def _get_http_response_with_retries(
    method,
    url,
    max_retries,
    backoff_factor,
    backoff_jitter,
    retry_codes,
    raise_on_status=True,
    allow_redirects=None,
    respect_retry_after_header=True,
    **kwargs,
):
    """Performs an HTTP request using Python's `requests` module with an automatic retry policy.

    Args:
        method: A string indicating the method to use, e.g. "GET", "POST", "PUT".
        url: The target URL address for the HTTP request.
        max_retries: Maximum total number of retries.
        backoff_factor: A time factor for exponential backoff. e.g. value 5 means the HTTP
            request will be retried with interval 5, 10, 20... seconds. A value of 0 turns off the
            exponential backoff.
        backoff_jitter: A random jitter to add to the backoff interval.
        retry_codes: A list of HTTP response error codes that qualifies for retry.
        raise_on_status: Whether to raise an exception, or return a response, if status falls
            in retry_codes range and retries have been exhausted.
        kwargs: Additional keyword arguments to pass to `requests.Session.request()`

    Returns:
        requests.Response object.
    """
    session = _get_request_session(
        max_retries,
        backoff_factor,
        backoff_jitter,
        retry_codes,
        raise_on_status,
        respect_retry_after_header,
    )

    # the environment variable is hardcoded here to avoid importing mlflow.
    # however, documentation is available in environment_variables.py
    env_value = os.getenv("MLFLOW_ALLOW_HTTP_REDIRECTS", "true").lower() in ["true", "1"]
    allow_redirects = env_value if allow_redirects is None else allow_redirects

    return session.request(method, url, allow_redirects=allow_redirects, **kwargs)


def cloud_storage_http_request(
    method,
    url,
    max_retries=5,
    backoff_factor=2,
    backoff_jitter=1.0,
    retry_codes=_TRANSIENT_FAILURE_RESPONSE_CODES,
    timeout=None,
    **kwargs,
):
    """Performs an HTTP PUT/GET/PATCH request using Python's `requests` module with automatic retry.

    Args:
        method: string of 'PUT' or 'GET' or 'PATCH', specify to do http PUT or GET or PATCH.
        url: the target URL address for the HTTP request.
        max_retries: maximum number of retries before throwing an exception.
        backoff_factor: a time factor for exponential backoff. e.g. value 5 means the HTTP
            request will be retried with interval 5, 10, 20... seconds. A value of 0 turns off the
            exponential backoff.
        backoff_jitter: A random jitter to add to the backoff interval.
        retry_codes: a list of HTTP response error codes that qualifies for retry.
        timeout: wait for timeout seconds for response from remote server for connect and
            read request. Default to None owing to long duration operation in read / write.
        kwargs: Additional keyword arguments to pass to `requests.Session.request()`.

    Returns:
        requests.Response object.
    """
    if method.lower() not in ("put", "get", "patch", "delete"):
        raise ValueError("Illegal http method: " + method)
    return _get_http_response_with_retries(
        method,
        url,
        max_retries,
        backoff_factor,
        backoff_jitter,
        retry_codes,
        timeout=timeout,
        **kwargs,
    )
```

--------------------------------------------------------------------------------

````
