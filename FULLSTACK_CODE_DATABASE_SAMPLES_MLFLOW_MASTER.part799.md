---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 799
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 799 of 991)

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

---[FILE: test_gateway_app.py]---
Location: mlflow-master/tests/gateway/test_gateway_app.py
Signals: FastAPI

```python
from unittest import mock

import pytest
from fastapi.testclient import TestClient

from mlflow.exceptions import MlflowException
from mlflow.gateway.app import create_app_from_config, create_app_from_env
from mlflow.gateway.config import GatewayConfig
from mlflow.gateway.constants import (
    MLFLOW_GATEWAY_CRUD_ENDPOINT_V3_BASE,
    MLFLOW_GATEWAY_CRUD_ROUTE_BASE,
    MLFLOW_GATEWAY_CRUD_ROUTE_V3_BASE,
    MLFLOW_GATEWAY_ROUTE_BASE,
)

from tests.gateway.tools import MockAsyncResponse


@pytest.fixture
def client() -> TestClient:
    config = GatewayConfig(
        **{
            "endpoints": [
                {
                    "name": "completions-gpt4",
                    "endpoint_type": "llm/v1/completions",
                    "model": {
                        "name": "gpt-4",
                        "provider": "openai",
                        "config": {
                            "openai_api_key": "mykey",
                            "openai_api_base": "https://api.openai.com/v1",
                            "openai_api_version": "2023-05-10",
                            "openai_api_type": "openai",
                        },
                    },
                },
                {
                    "name": "chat-gpt4",
                    "endpoint_type": "llm/v1/chat",
                    "model": {
                        "name": "gpt-4",
                        "provider": "openai",
                        "config": {
                            "openai_api_key": "MY_API_KEY",
                        },
                    },
                },
                {
                    "name": "chat-gpt5",
                    "endpoint_type": "llm/v1/chat",
                    "model": {
                        "name": "gpt-5",
                        "provider": "openai",
                        "config": {
                            "openai_api_key": "MY_API_KEY",
                        },
                    },
                },
            ],
            "routes": [
                {
                    "name": "traffic_route1",
                    "task_type": "llm/v1/chat",
                    "destinations": [
                        {
                            "name": "chat-gpt4",
                            "traffic_percentage": 80,
                        },
                        {
                            "name": "chat-gpt5",
                            "traffic_percentage": 20,
                        },
                    ],
                },
            ],
        }
    )
    app = create_app_from_config(config)
    return TestClient(app)


def test_index(client: TestClient):
    response = client.get("/", follow_redirects=False)
    assert response.status_code == 307
    assert response.headers["Location"] == "/docs"


def test_health(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "OK"}


def test_favicon(client: TestClient):
    response = client.get("/favicon.ico")
    assert response.status_code == 200


def test_docs(client: TestClient):
    response = client.get("/docs")
    assert response.status_code == 200


def test_search_routes(client: TestClient):
    response = client.get(MLFLOW_GATEWAY_CRUD_ROUTE_BASE)
    assert response.status_code == 200
    assert response.json()["routes"] == [
        {
            "name": "completions-gpt4",
            "route_type": "llm/v1/completions",
            "route_url": "/gateway/completions-gpt4/invocations",
            "model": {
                "name": "gpt-4",
                "provider": "openai",
            },
            "limit": None,
        },
        {
            "name": "chat-gpt4",
            "route_type": "llm/v1/chat",
            "route_url": "/gateway/chat-gpt4/invocations",
            "model": {
                "name": "gpt-4",
                "provider": "openai",
            },
            "limit": None,
        },
        {
            "name": "chat-gpt5",
            "route_type": "llm/v1/chat",
            "route_url": "/gateway/chat-gpt5/invocations",
            "model": {
                "name": "gpt-5",
                "provider": "openai",
            },
            "limit": None,
        },
    ]


def test_get_route(client: TestClient):
    response = client.get(f"{MLFLOW_GATEWAY_CRUD_ROUTE_BASE}chat-gpt4")
    assert response.status_code == 200
    assert response.json() == {
        "name": "chat-gpt4",
        "route_type": "llm/v1/chat",
        "route_url": "/gateway/chat-gpt4/invocations",
        "model": {
            "name": "gpt-4",
            "provider": "openai",
        },
        "limit": None,
    }


def test_get_endpoint_v3(client: TestClient):
    response = client.get(f"{MLFLOW_GATEWAY_CRUD_ENDPOINT_V3_BASE}chat-gpt4")
    assert response.status_code == 200
    assert response.json() == {
        "name": "chat-gpt4",
        "endpoint_type": "llm/v1/chat",
        "model": {"name": "gpt-4", "provider": "openai"},
        "endpoint_url": "/gateway/chat-gpt4/invocations",
        "limit": None,
    }


def test_get_route_v3(client: TestClient):
    response = client.get(f"{MLFLOW_GATEWAY_CRUD_ROUTE_V3_BASE}traffic_route1")
    assert response.status_code == 200
    assert response.json() == {
        "name": "traffic_route1",
        "task_type": "llm/v1/chat",
        "destinations": [
            {"name": "chat-gpt4", "traffic_percentage": 80},
            {"name": "chat-gpt5", "traffic_percentage": 20},
        ],
        "routing_strategy": "TRAFFIC_SPLIT",
    }


def test_dynamic_route():
    config = GatewayConfig(
        **{
            "endpoints": [
                {
                    "name": "chat",
                    "endpoint_type": "llm/v1/chat",
                    "model": {
                        "name": "gpt-4",
                        "provider": "openai",
                        "config": {
                            "openai_api_key": "mykey",
                            "openai_api_base": "https://api.openai.com/v1",
                        },
                    },
                    "limit": None,
                }
            ],
            "routes": [
                {
                    "name": "traffic_route",
                    "task_type": "llm/v1/chat",
                    "destinations": [
                        {
                            "name": "chat",
                            "traffic_percentage": 100,
                        }
                    ],
                }
            ],
        }
    )
    app = create_app_from_config(config)
    client = TestClient(app)

    resp = {
        "id": "chatcmpl-abc123",
        "object": "chat.completion",
        "created": 1677858242,
        "model": "gpt-4o-mini",
        "usage": {
            "prompt_tokens": 13,
            "completion_tokens": 7,
            "total_tokens": 20,
        },
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": "\n\nThis is a test!",
                    "refusal": None,
                },
                "finish_reason": "stop",
                "index": 0,
            }
        ],
        "headers": {"Content-Type": "application/json"},
    }
    with mock.patch(
        "aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)
    ) as mock_post:
        for name in ["chat", "traffic_route"]:
            resp = client.post(
                f"{MLFLOW_GATEWAY_ROUTE_BASE}{name}/invocations",
                json={"messages": [{"role": "user", "content": "Tell me a joke"}]},
            )
            mock_post.assert_called_once()
            assert resp.status_code == 200
            assert resp.json() == {
                "id": "chatcmpl-abc123",
                "object": "chat.completion",
                "created": 1677858242,
                "model": "gpt-4o-mini",
                "usage": {
                    "prompt_tokens": 13,
                    "completion_tokens": 7,
                    "total_tokens": 20,
                },
                "choices": [
                    {
                        "message": {
                            "role": "assistant",
                            "content": "\n\nThis is a test!",
                            "tool_calls": None,
                            "refusal": None,
                        },
                        "finish_reason": "stop",
                        "index": 0,
                    }
                ],
            }

            mock_post.reset_mock()


def test_create_app_from_env_fails_if_MLFLOW_GATEWAY_CONFIG_is_not_set(monkeypatch):
    monkeypatch.delenv("MLFLOW_GATEWAY_CONFIG", raising=False)
    with pytest.raises(MlflowException, match="'MLFLOW_GATEWAY_CONFIG' is not set"):
        create_app_from_env()
```

--------------------------------------------------------------------------------

---[FILE: test_gateway_config_parsing.py]---
Location: mlflow-master/tests/gateway/test_gateway_config_parsing.py
Signals: Pydantic

```python
import re

import pytest
import yaml

from mlflow.exceptions import MlflowException
from mlflow.gateway.config import (
    AnthropicConfig,
    EndpointConfig,
    OpenAIConfig,
    _load_gateway_config,
    _resolve_api_key_from_input,
    _save_route_config,
)
from mlflow.gateway.utils import assemble_uri_path


@pytest.fixture
def basic_config_dict():
    return {
        "endpoints": [
            {
                "name": "completions-gpt4",
                "endpoint_type": "llm/v1/completions",
                "model": {
                    "name": "gpt-4",
                    "provider": "openai",
                    "config": {
                        "openai_api_key": "mykey",
                        "openai_api_base": "https://api.openai.com/v1",
                        "openai_api_version": "2023-05-10",
                        "openai_api_type": "openai",
                        "openai_organization": "my_company",
                    },
                },
            },
            {
                "name": "chat-gpt4",
                "endpoint_type": "llm/v1/chat",
                "model": {
                    "name": "gpt-4",
                    "provider": "openai",
                    "config": {"openai_api_key": "sk-openai"},
                },
            },
            {
                "name": "claude-chat",
                "endpoint_type": "llm/v1/chat",
                "model": {
                    "name": "claude-v1",
                    "provider": "anthropic",
                    "config": {
                        "anthropic_api_key": "api_key",
                    },
                },
            },
        ]
    }


@pytest.mark.parametrize(
    ("paths", "expected"),
    [
        (["gateway", "/routes/", "/chat"], "/gateway/routes/chat"),
        (["/gateway/", "/routes", "chat"], "/gateway/routes/chat"),
        (["gateway/routes/", "chat"], "/gateway/routes/chat"),
        (["gateway/", "routes/chat"], "/gateway/routes/chat"),
        (["/gateway/routes", "/chat/"], "/gateway/routes/chat"),
        (["/gateway", "/routes/", "chat/"], "/gateway/routes/chat"),
        (["/"], "/"),
        (["gateway", "", "/routes/", "", "/chat", ""], "/gateway/routes/chat"),
    ],
)
def test_assemble_uri_path(paths, expected):
    assert assemble_uri_path(paths) == expected


def test_api_key_parsing_env(tmp_path, monkeypatch):
    monkeypatch.setenv("KEY_AS_ENV", "my_key")

    assert _resolve_api_key_from_input("$KEY_AS_ENV") == "my_key"
    monkeypatch.delenv("KEY_AS_ENV", raising=False)
    with pytest.raises(MlflowException, match="Environment variable 'KEY_AS_ENV' is not set"):
        _resolve_api_key_from_input("$KEY_AS_ENV")

    string_key = "my_key_as_a_string"

    assert _resolve_api_key_from_input(string_key) == string_key

    conf_path = tmp_path.joinpath("mykey.conf")
    file_key = "Here is my key that sits safely in a file"

    conf_path.write_text(file_key)

    assert _resolve_api_key_from_input(str(conf_path)) == file_key


def test_api_key_input_exceeding_maximum_filename_length():
    assert _resolve_api_key_from_input("a" * 256) == "a" * 256


def test_api_key_parsing_file(tmp_path):
    key_path = tmp_path.joinpath("api.key")
    config = {
        "endpoints": [
            {
                "name": "claude-chat",
                "endpoint_type": "llm/v1/chat",
                "model": {
                    "name": "claude-v1",
                    "provider": "anthropic",
                    "config": {
                        "anthropic_api_key": str(key_path),
                    },
                },
            },
        ]
    }

    key_path.write_text("abc")
    config_path = tmp_path.joinpath("config.yaml")
    config_path.write_text(yaml.safe_dump(config))
    loaded_config = _load_gateway_config(config_path)

    assert isinstance(loaded_config.endpoints[0].model.config, AnthropicConfig)
    assert loaded_config.endpoints[0].model.config.anthropic_api_key == "abc"


def test_route_configuration_parsing(basic_config_dict, tmp_path, monkeypatch):
    conf_path = tmp_path.joinpath("config.yaml")

    conf_path.write_text(yaml.safe_dump(basic_config_dict))

    loaded_config = _load_gateway_config(conf_path)

    save_path = tmp_path.joinpath("config2.yaml")
    _save_route_config(loaded_config, save_path)
    loaded_from_save = _load_gateway_config(save_path)

    completions_gpt4 = loaded_from_save.endpoints[0]
    assert completions_gpt4.name == "completions-gpt4"
    assert completions_gpt4.endpoint_type == "llm/v1/completions"
    assert completions_gpt4.model.name == "gpt-4"
    assert completions_gpt4.model.provider == "openai"
    completions_conf = completions_gpt4.model.config
    assert isinstance(completions_conf, OpenAIConfig)
    assert completions_conf.openai_api_key == "mykey"
    assert completions_conf.openai_api_base == "https://api.openai.com/v1"
    assert completions_conf.openai_api_version == "2023-05-10"
    assert completions_conf.openai_api_type == "openai"
    assert completions_conf.openai_organization == "my_company"

    chat_gpt4 = loaded_from_save.endpoints[1]
    assert chat_gpt4.name == "chat-gpt4"
    assert chat_gpt4.endpoint_type == "llm/v1/chat"
    assert chat_gpt4.model.name == "gpt-4"
    assert chat_gpt4.model.provider == "openai"
    chat_conf = chat_gpt4.model.config
    assert isinstance(chat_conf, OpenAIConfig)
    assert chat_conf.openai_api_key == "sk-openai"
    assert chat_conf.openai_api_base == "https://api.openai.com/v1"
    assert chat_conf.openai_api_type == "openai"
    assert chat_conf.openai_api_version is None
    assert chat_conf.openai_organization is None

    claude = loaded_from_save.endpoints[2]
    assert isinstance(claude.model.config, AnthropicConfig)
    assert claude.name == "claude-chat"
    assert claude.endpoint_type == "llm/v1/chat"
    assert claude.model.name == "claude-v1"
    assert claude.model.provider == "anthropic"
    claude_conf = claude.model.config
    assert claude_conf.anthropic_api_key == "api_key"


def test_convert_route_config_to_routes_payload(basic_config_dict, tmp_path):
    conf_path = tmp_path.joinpath("config.yaml")
    conf_path.write_text(yaml.safe_dump(basic_config_dict))
    loaded = _load_gateway_config(conf_path)

    assert all(isinstance(route, EndpointConfig) for route in loaded.endpoints)

    routes = [r.to_endpoint() for r in loaded.endpoints]

    for config in loaded.endpoints:
        route = [x for x in routes if x.name == config.name][0]
        assert route.endpoint_type == config.endpoint_type
        assert route.model.name == config.model.name
        assert route.model.provider == config.model.provider
        # Pydantic doesn't allow undefined elements to be a part of its serialized object.
        # This test is a guard for devs only in case we inadvertently add sensitive keys to the
        # Route definition that would be returned via the GetRoute or SearchRoutes APIs
        assert not hasattr(route.model, "config")


def test_invalid_route_definition(tmp_path):
    invalid_conf = {
        "endpoints": [
            {
                "name": "invalid_route",
                "endpoint_type": "invalid/route",
                "model": {
                    "name": "gpt-4",
                    "provider": "openai",
                    "config": {
                        "openai_api_key": "mykey",
                        "openai_api_base": "https://api.openai.com/v1",
                        "openai_api_version": "2023-05-10",
                        "openai_api_type": "openai/v1/chat/completions",
                        "openai_organization": "my_company",
                    },
                },
            }
        ]
    }
    conf_path = tmp_path.joinpath("config.yaml")
    conf_path.write_text(yaml.safe_dump(invalid_conf))

    with pytest.raises(MlflowException, match=r"The route_type 'invalid/route' is not supported."):
        _load_gateway_config(conf_path)


def test_invalid_provider(tmp_path):
    invalid_conf = {
        "endpoints": [
            {
                "name": "invalid_route",
                "endpoint_type": "llm/v1/completions",
                "model": {
                    "name": "gpt-4",
                    "provider": "my_provider",
                    "config": {
                        "openai_api_key": "mykey",
                        "openai_api_base": "https://api.openai.com/v1",
                        "openai_api_version": "2023-05-10",
                        "openai_api_type": "openai/v1/chat/completions",
                        "openai_organization": "my_company",
                    },
                },
            }
        ]
    }
    conf_path = tmp_path.joinpath("config.yaml")
    conf_path.write_text(yaml.safe_dump(invalid_conf))

    with pytest.raises(MlflowException, match=r"The provider 'my_provider' is not supported."):
        _load_gateway_config(conf_path)


def test_invalid_model_definition(tmp_path):
    invalid_partial_config = {
        "endpoints": [
            {
                "name": "some_name",
                "endpoint_type": "llm/v1/completions",
                "model": {
                    "name": "invalid",
                    "provider": "openai",
                    "config": {"openai_api_type": "openai"},
                },
            }
        ]
    }

    conf_path = tmp_path.joinpath("config.yaml")
    conf_path.write_text(yaml.safe_dump(invalid_partial_config))

    with pytest.raises(
        MlflowException, match=re.compile(r"validation error.+openai_api_key", re.DOTALL)
    ):
        _load_gateway_config(conf_path)

    invalid_format_config_key_is_not_string = {
        "endpoints": [
            {
                "name": "some_name",
                "endpoint_type": "llm/v1/chat",
                "model": {
                    "name": "invalid",
                    "provider": "openai",
                    "config": {"openai_api_type": "openai", "openai_api_key": [42]},
                },
            }
        ]
    }

    conf_path = tmp_path.joinpath("config.yaml")
    conf_path.write_text(yaml.safe_dump(invalid_format_config_key_is_not_string))

    with pytest.raises(
        MlflowException,
        match="The api key provided is not a string",
    ):
        _load_gateway_config(conf_path)

    invalid_format_config_key_invalid_path = {
        "endpoints": [
            {
                "name": "some_name",
                "endpoint_type": "llm/v1/embeddings",
                "model": {
                    "name": "invalid",
                    "provider": "openai",
                    "config": {"openai_api_type": "openai", "openai_api_key": "/not/a/real/path"},
                },
            }
        ]
    }

    conf_path = tmp_path.joinpath("config.yaml")
    conf_path.write_text(yaml.safe_dump(invalid_format_config_key_invalid_path))

    assert (
        _load_gateway_config(conf_path).endpoints[0].model.config.openai_api_key
        == "/not/a/real/path"  # pylint: disable=line-too-long
    )

    invalid_no_config = {
        "endpoints": [
            {
                "name": "some_name",
                "endpoint_type": "llm/v1/embeddings",
                "model": {
                    "name": "invalid",
                    "provider": "anthropic",
                },
            }
        ]
    }
    conf_path = tmp_path.joinpath("config2.yaml")
    conf_path.write_text(yaml.safe_dump(invalid_no_config))

    with pytest.raises(
        MlflowException,
        match="A config must be supplied when setting a provider. The provider entry",
    ):
        _load_gateway_config(conf_path)


@pytest.mark.parametrize(
    "route_name", ["Space Name", "bang!name", "query?name", "redirect#name", "bracket[]name"]
)
def test_invalid_route_name(tmp_path, route_name):
    bad_name = {
        "endpoints": [
            {
                "name": route_name,
                "endpoint_type": "bad/naming",
                "model": {
                    "name": "claude-v1",
                    "provider": "anthropic",
                    "config": {
                        "anthropic_api_key": "claudekey",
                    },
                },
            }
        ]
    }

    conf_path = tmp_path.joinpath("config.yaml")
    conf_path.write_text(yaml.safe_dump(bad_name))

    with pytest.raises(
        MlflowException, match="The route name provided contains disallowed characters"
    ):
        _load_gateway_config(conf_path)


def test_default_base_api(tmp_path):
    route_no_base = {
        "endpoints": [
            {
                "name": "chat-gpt4",
                "endpoint_type": "llm/v1/chat",
                "model": {
                    "name": "gpt-4",
                    "provider": "openai",
                    "config": {"openai_api_key": "sk-openai"},
                },
            },
        ]
    }
    conf_path = tmp_path.joinpath("config.yaml")
    conf_path.write_text(yaml.safe_dump(route_no_base))
    loaded_conf = _load_gateway_config(conf_path)

    assert loaded_conf.endpoints[0].model.config.openai_api_base == "https://api.openai.com/v1"


def test_duplicate_routes_in_config(tmp_path):
    route = {
        "endpoints": [
            {
                "name": "classifier",
                "endpoint_type": "llm/v1/classifier",
                "model": {
                    "name": "serving-endpoints/document-classifier/Production/invocations",
                    "provider": "databricks-model-serving",
                    "config": {
                        "databricks_api_token": "MY_TOKEN",
                        "databricks_api_base": "https://my-shard-001/",
                    },
                },
            },
            {
                "name": "classifier",
                "endpoint_type": "llm/v1/classifier",
                "model": {
                    "name": "serving-endpoints/document-classifier/Production/invocations",
                    "provider": "databricks_serving_endpoint",
                    "config": {
                        "databricks_api_token": "MY_TOKEN",
                        "databricks_api_base": "https://my-shard-001/",
                    },
                },
            },
        ]
    }
    conf_path = tmp_path.joinpath("config.yaml")
    conf_path.write_text(yaml.safe_dump(route))
    with pytest.raises(
        MlflowException, match="Duplicate names found in endpoint / route configurations"
    ):
        _load_gateway_config(conf_path)
```

--------------------------------------------------------------------------------

---[FILE: test_openai_compatibility.py]---
Location: mlflow-master/tests/gateway/test_openai_compatibility.py

```python
from unittest import mock

import openai
import pytest

from mlflow.gateway.providers.openai import OpenAIProvider

from tests.gateway.tools import (
    UvicornGateway,
    save_yaml,
)


@pytest.fixture(scope="module")
def config():
    return {
        "endpoints": [
            {
                "name": "chat",
                "endpoint_type": "llm/v1/chat",
                "model": {
                    "name": "gpt-4o-mini",
                    "provider": "openai",
                    "config": {"openai_api_key": "test"},
                },
            },
            {
                "name": "completions",
                "endpoint_type": "llm/v1/completions",
                "model": {
                    "name": "gpt-4",
                    "provider": "openai",
                    "config": {"openai_api_key": "test"},
                },
            },
            {
                "name": "embeddings",
                "endpoint_type": "llm/v1/embeddings",
                "model": {
                    "provider": "openai",
                    "name": "text-embedding-ada-002",
                    "config": {
                        "openai_api_key": "test",
                    },
                },
            },
        ]
    }


@pytest.fixture
def server(config, tmp_path):
    conf = tmp_path / "config.yaml"
    save_yaml(conf, config)
    with UvicornGateway(conf) as g:
        yield g


@pytest.fixture
def client(server) -> openai.OpenAI:
    return openai.OpenAI(base_url=f"{server.url}/v1", api_key="test")


def test_chat(client):
    async def mock_chat(self, payload):
        return {
            "id": "chatcmpl-abc123",
            "object": "chat.completion",
            "created": 1677858242,
            "model": "gpt-4o-mini",
            "choices": [
                {
                    "message": {
                        "role": "assistant",
                        "content": "test",
                    },
                    "finish_reason": "stop",
                    "index": 0,
                }
            ],
            "usage": {
                "prompt_tokens": 13,
                "completion_tokens": 7,
                "total_tokens": 20,
            },
        }

    with mock.patch.object(OpenAIProvider, "chat", mock_chat):
        chat = client.chat.completions.create(
            model="chat", messages=[{"role": "user", "content": "hello"}]
        )
        assert chat.choices[0].message.content == "test"


def test_chat_invalid_endpoint(client):
    with pytest.raises(openai.BadRequestError, match="is not a chat endpoint"):
        client.chat.completions.create(
            model="completions", messages=[{"role": "user", "content": "hello"}]
        )


def test_completions(client):
    async def mock_completions(self, payload):
        return {
            "id": "cmpl-abc123",
            "object": "text_completion",
            "created": 1677858242,
            "model": "gpt-4",
            "choices": [
                {
                    "finish_reason": "length",
                    "index": 0,
                    "logprobs": None,
                    "text": "test",
                }
            ],
            "usage": {"prompt_tokens": 4, "completion_tokens": 4, "total_tokens": 11},
        }

    with mock.patch.object(OpenAIProvider, "completions", mock_completions):
        completions = client.completions.create(
            model="completions",
            prompt="hello",
        )
        assert completions.choices[0].text == "test"


def test_completions_invalid_endpoint(client):
    with pytest.raises(openai.BadRequestError, match="is not a completions endpoint"):
        client.completions.create(model="chat", prompt="hello")


def test_embeddings(client):
    async def mock_embeddings(self, payload):
        return {
            "object": "list",
            "data": [
                {
                    "object": "embedding",
                    "embedding": [
                        0.1,
                        0.2,
                        0.3,
                    ],
                    "index": 0,
                }
            ],
            "model": "text-embedding-ada-002",
            "usage": {"prompt_tokens": 4, "total_tokens": 4},
        }

    with mock.patch.object(OpenAIProvider, "embeddings", mock_embeddings):
        embeddings = client.embeddings.create(model="embeddings", input="hello")
        assert embeddings.data[0].embedding == [0.1, 0.2, 0.3]


def test_embeddings_invalid_endpoint(client):
    with pytest.raises(openai.BadRequestError, match="is not an embeddings endpoint"):
        client.embeddings.create(model="chat", input="hello")
```

--------------------------------------------------------------------------------

---[FILE: test_runner.py]---
Location: mlflow-master/tests/gateway/test_runner.py

```python
from pathlib import Path

import pytest

from tests.gateway.tools import Gateway, save_yaml

BASE_ROUTE = "/api/2.0/endpoints/"


@pytest.fixture
def basic_config_dict():
    return {
        "endpoints": [
            {
                "name": "completions-gpt4",
                "endpoint_type": "llm/v1/completions",
                "model": {
                    "name": "gpt-4",
                    "provider": "openai",
                    "config": {
                        "openai_api_key": "mykey",
                        "openai_api_base": "https://api.openai.com/v1",
                        "openai_api_version": "2023-05-15",
                        "openai_api_type": "openai",
                    },
                },
            },
            {
                "name": "embeddings-gpt4",
                "endpoint_type": "llm/v1/embeddings",
                "model": {
                    "name": "gpt-4",
                    "provider": "openai",
                    "config": {
                        "openai_api_key": "mykey",
                        "openai_api_base": "https://api.openai.com/v1",
                        "openai_api_version": "2023-05-15",
                        "openai_api_type": "openai",
                    },
                },
            },
        ]
    }


@pytest.fixture
def basic_routes():
    return [
        {
            "name": "completions-gpt4",
            "endpoint_type": "llm/v1/completions",
            "endpoint_url": "/gateway/completions-gpt4/invocations",
            "model": {
                "name": "gpt-4",
                "provider": "openai",
            },
            "limit": None,
        },
        {
            "name": "embeddings-gpt4",
            "endpoint_type": "llm/v1/embeddings",
            "endpoint_url": "/gateway/embeddings-gpt4/invocations",
            "model": {
                "name": "gpt-4",
                "provider": "openai",
            },
            "limit": None,
        },
    ]


@pytest.fixture
def update_config_dict():
    return {
        "endpoints": [
            {
                "name": "chat-gpt4",
                "endpoint_type": "llm/v1/chat",
                "model": {
                    "name": "gpt-4",
                    "provider": "openai",
                    "config": {
                        "openai_api_key": "mykey",
                        "openai_api_base": "https://api.openai.com/v1",
                        "openai_api_version": "2023-05-15",
                        "openai_api_type": "openai",
                    },
                },
                "limit": None,
            },
        ]
    }


@pytest.fixture
def update_routes():
    return [
        {
            "name": "chat-gpt4",
            "endpoint_type": "llm/v1/chat",
            "endpoint_url": "/gateway/chat-gpt4/invocations",
            "model": {
                "name": "gpt-4",
                "provider": "openai",
            },
            "limit": None,
        },
    ]


@pytest.fixture
def invalid_config_dict():
    return {
        "endpoints": [
            {
                "invalid_name": "invalid",
                "endpoint_type": "llm/v1/chat",
                "model": {"invalidkey": "invalid", "invalid_provider": "invalid"},
            }
        ]
    }


def test_server_update(
    tmp_path: Path, basic_config_dict, update_config_dict, basic_routes, update_routes
):
    config = tmp_path / "config.yaml"
    save_yaml(config, basic_config_dict)

    with Gateway(config) as gateway:
        response = gateway.get(BASE_ROUTE)
        assert response.json()["endpoints"] == basic_routes

        # push an update to the config file
        save_yaml(config, update_config_dict)

        # Ensure there is no server downtime
        gateway.assert_health()

        # Wait for the app to restart
        gateway.wait_reload()
        response = gateway.get(BASE_ROUTE)

        assert response.json()["endpoints"] == update_routes

        # push the original file back
        save_yaml(config, basic_config_dict)
        gateway.assert_health()
        gateway.wait_reload()
        response = gateway.get(BASE_ROUTE)
        assert response.json()["endpoints"] == basic_routes


def test_server_update_with_invalid_config(
    tmp_path: Path, basic_config_dict, invalid_config_dict, basic_routes
):
    config = tmp_path / "config.yaml"
    save_yaml(config, basic_config_dict)

    with Gateway(config) as gateway:
        response = gateway.get(BASE_ROUTE)
        assert response.json()["endpoints"] == basic_routes
        # Give filewatch a moment to cycle
        gateway.wait_reload()
        # push an invalid config
        save_yaml(config, invalid_config_dict)
        gateway.assert_health()
        # ensure that filewatch has run through the aborted config change logic
        gateway.wait_reload()
        gateway.assert_health()
        response = gateway.get(BASE_ROUTE)
        assert response.json()["endpoints"] == basic_routes


def test_server_update_config_removed_then_recreated(
    tmp_path: Path, basic_config_dict, basic_routes
):
    config = tmp_path / "config.yaml"
    save_yaml(config, basic_config_dict)

    with Gateway(config) as gateway:
        response = gateway.get(BASE_ROUTE)
        assert response.json()["endpoints"] == basic_routes
        # Give filewatch a moment to cycle
        gateway.wait_reload()
        # remove config
        config.unlink()
        gateway.wait_reload()
        gateway.assert_health()

        save_yaml(config, {"endpoints": basic_config_dict["endpoints"][1:]})
        gateway.wait_reload()
        response = gateway.get(BASE_ROUTE)
        assert response.json()["endpoints"] == basic_routes[1:]


def test_server_static_endpoints(tmp_path, basic_config_dict, basic_routes):
    config = tmp_path / "config.yaml"
    save_yaml(config, basic_config_dict)

    with Gateway(config) as gateway:
        response = gateway.get(BASE_ROUTE)
        assert response.json()["endpoints"] == basic_routes

        for route in ["docs", "redoc"]:
            response = gateway.get(route)
            assert response.status_code == 200

        for index, route in enumerate(basic_config_dict["endpoints"]):
            response = gateway.get(f"{BASE_ROUTE}{route['name']}")
            assert response.json() == basic_routes[index]


def test_request_invalid_route(tmp_path, basic_config_dict):
    config = tmp_path / "config.yaml"
    save_yaml(config, basic_config_dict)

    with Gateway(config) as gateway:
        # Test get
        response = gateway.get(f"{BASE_ROUTE}invalid/")
        assert response.status_code == 404
        assert response.json() == {
            "detail": "The endpoint 'invalid' is not present or active on the server. Please "
            "verify the endpoint name."
        }

        # Test post
        response = gateway.post(f"{BASE_ROUTE}invalid", json={"input": "should fail"})
        assert response.status_code == 405
        assert response.json() == {"detail": "Method Not Allowed"}
```

--------------------------------------------------------------------------------

---[FILE: test_utils.py]---
Location: mlflow-master/tests/gateway/test_utils.py

```python
import pytest

from mlflow.exceptions import MlflowException
from mlflow.gateway.utils import (
    SearchRoutesToken,
    _is_valid_uri,
    assemble_uri_path,
    check_configuration_route_name_collisions,
    get_gateway_uri,
    is_valid_endpoint_name,
    resolve_route_url,
    set_gateway_uri,
)


@pytest.mark.parametrize(
    ("base_url", "route"),
    [
        ("http://127.0.0.1:6000", "gateway/test/invocations"),
        ("http://127.0.0.1:6000/", "/gateway/test/invocations"),
        ("http://127.0.0.1:6000/gateway", "/test/invocations"),
        ("http://127.0.0.1:6000/gateway/", "/test/invocations"),
        ("http://127.0.0.1:6000/gateway", "test/invocations"),
        ("http://127.0.0.1:6000/gateway/", "test/invocations"),
    ],
)
def test_resolve_route_url(base_url, route):
    assert resolve_route_url(base_url, route) == "http://127.0.0.1:6000/gateway/test/invocations"


@pytest.mark.parametrize("base_url", ["databricks", "databricks://my.workspace"])
def test_resolve_route_url_qualified_url_ignores_base(base_url):
    route = "https://my.databricks.workspace/api/2.0/gateway/chat/invocations"

    resolved = resolve_route_url(base_url, route)

    assert resolved == route


@pytest.mark.parametrize(
    ("name", "expected"),
    [
        ("validName", True),
        ("invalid name", False),
        ("invalid/name", False),
        ("invalid?name", False),
        ("", False),
    ],
)
def test_is_valid_endpoint_name(name, expected):
    assert is_valid_endpoint_name(name) == expected


def test_check_configuration_route_name_collisions():
    config = {"endpoints": [{"name": "name1"}, {"name": "name2"}, {"name": "name1"}]}
    with pytest.raises(
        MlflowException, match="Duplicate names found in endpoint / route configurations"
    ):
        check_configuration_route_name_collisions(config)


@pytest.mark.parametrize(
    ("uri", "expected"),
    [
        ("http://localhost", True),
        ("databricks", True),
        ("localhost", False),
        ("http:/localhost", False),
        ("", False),
    ],
)
def test__is_valid_uri(uri, expected):
    assert _is_valid_uri(uri) == expected


@pytest.mark.parametrize(
    ("paths", "expected"),
    [
        (["path1", "path2", "path3"], "/path1/path2/path3"),
        (["/path1/", "/path2/", "/path3/"], "/path1/path2/path3"),
        (["/path1//", "/path2//", "/path3//"], "/path1/path2/path3"),
        (["path1", "", "path3"], "/path1/path3"),
        (["", "", ""], "/"),
        ([], "/"),
    ],
)
def test_assemble_uri_path(paths, expected):
    assert assemble_uri_path(paths) == expected


def test_set_gateway_uri(monkeypatch):
    monkeypatch.setattr("mlflow.gateway.utils._gateway_uri", None)

    valid_uri = "http://localhost"
    set_gateway_uri(valid_uri)
    assert get_gateway_uri() == valid_uri

    invalid_uri = "localhost"
    with pytest.raises(MlflowException, match="The gateway uri provided is missing required"):
        set_gateway_uri(invalid_uri)


def test_get_gateway_uri(monkeypatch):
    monkeypatch.setattr("mlflow.gateway.utils._gateway_uri", None)
    monkeypatch.delenv("MLFLOW_GATEWAY_URI", raising=False)

    with pytest.raises(MlflowException, match="No Gateway server uri has been set"):
        get_gateway_uri()

    valid_uri = "http://localhost"
    monkeypatch.setattr("mlflow.gateway.utils._gateway_uri", valid_uri)
    assert get_gateway_uri() == valid_uri

    monkeypatch.delenv("MLFLOW_GATEWAY_URI", raising=False)
    set_gateway_uri(valid_uri)
    assert get_gateway_uri() == valid_uri


def test_search_routes_token_decodes_correctly():
    token = SearchRoutesToken(12345)
    encoded_token = token.encode()
    decoded_token = SearchRoutesToken.decode(encoded_token)
    assert decoded_token.index == token.index


@pytest.mark.parametrize(
    "index",
    [
        "not an integer",
        -1,
        None,
        [1, 2, 3],
        {"key": "value"},
    ],
)
def test_search_routes_token_with_invalid_token_values(index):
    token = SearchRoutesToken(index)
    encoded_token = token.encode()
    with pytest.raises(MlflowException, match="Invalid SearchRoutes token"):
        SearchRoutesToken.decode(encoded_token)
```

--------------------------------------------------------------------------------

````
