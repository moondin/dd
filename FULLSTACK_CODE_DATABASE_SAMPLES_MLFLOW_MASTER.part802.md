---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 802
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 802 of 991)

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

---[FILE: test_bedrock.py]---
Location: mlflow-master/tests/gateway/providers/test_bedrock.py
Signals: FastAPI

```python
from unittest import mock

import pytest
from fastapi.encoders import jsonable_encoder

from mlflow.gateway.config import (
    AmazonBedrockConfig,
    AWSBaseConfig,
    AWSIdAndKey,
    AWSRole,
    EndpointConfig,
)
from mlflow.gateway.providers.bedrock import AmazonBedrockModelProvider, AmazonBedrockProvider
from mlflow.gateway.schemas import completions

from tests.gateway.providers.test_anthropic import (
    completions_response as anthropic_completions_response,
)
from tests.gateway.providers.test_anthropic import (
    parsed_completions_response as anthropic_parsed_completions_response,
)
from tests.gateway.providers.test_cohere import completions_response as cohere_completions_response


def ai21_completion_response():
    return {
        "id": 1234,
        "prompt": {
            "text": "This is a test",
            "tokens": [
                {
                    "generatedToken": {
                        "token": "▁This▁is▁a",
                        "logprob": -7.127955436706543,
                        "raw_logprob": -7.127955436706543,
                    },
                    "topTokens": None,
                    "textRange": {"start": 0, "end": 9},
                },
                {
                    "generatedToken": {
                        "token": "▁test",
                        "logprob": -4.926638126373291,
                        "raw_logprob": -4.926638126373291,
                    },
                    "topTokens": None,
                    "textRange": {"start": 9, "end": 14},
                },
            ],
        },
        "completions": [
            {
                "data": {
                    "text": "\nIt looks like",
                    "tokens": [
                        {
                            "generatedToken": {
                                "token": "<|newline|>",
                                "logprob": -0.021781044080853462,
                                "raw_logprob": -0.021781044080853462,
                            },
                            "topTokens": None,
                            "textRange": {"start": 0, "end": 1},
                        },
                        {
                            "generatedToken": {
                                "token": "▁It▁looks▁like",
                                "logprob": -3.2340049743652344,
                                "raw_logprob": -3.2340049743652344,
                            },
                            "topTokens": None,
                            "textRange": {"start": 1, "end": 14},
                        },
                        {
                            "generatedToken": {
                                "token": "<|endoftext|>",
                                "logprob": -0.01683046855032444,
                                "raw_logprob": -0.01683046855032444,
                            },
                            "topTokens": None,
                            "textRange": {"start": 14, "end": 14},
                        },
                    ],
                },
                "finishReason": {"reason": "endoftext"},
            }
        ],
    }


def ai21_parsed_completion_response(mdl):
    return {
        "id": None,
        "object": "text_completion",
        "created": 1677858242,
        "model": mdl,
        "choices": [
            {
                "text": "\nIt looks like",
                "index": 0,
                "finish_reason": None,
            }
        ],
        "usage": {"prompt_tokens": None, "completion_tokens": None, "total_tokens": None},
    }


bedrock_model_provider_fixtures = [
    {
        "provider": AmazonBedrockModelProvider.ANTHROPIC,
        "config": {
            "name": "completions",
            "endpoint_type": "llm/v1/completions",
            "model": {
                "provider": "bedrock",
                "name": "anthropic.claude-v1",
            },
        },
        "response": anthropic_completions_response(),
        "expected": anthropic_parsed_completions_response(),
        "request": {"prompt": "How does a car work?", "max_tokens": 200},
        "model_request": {
            "max_tokens_to_sample": 200,
            "prompt": "\n\nHuman: How does a car work?\n\nAssistant:",
            "stop_sequences": ["\n\nHuman:"],
            "anthropic_version": "bedrock-2023-05-31",
        },
    },
    {
        "provider": AmazonBedrockModelProvider.ANTHROPIC,
        "config": {
            "name": "completions",
            "endpoint_type": "llm/v1/completions",
            "model": {
                "provider": "bedrock",
                "name": "anthropic.claude-v2",
            },
        },
        "response": anthropic_completions_response(),
        "expected": anthropic_parsed_completions_response(),
        "request": {"prompt": "How does a car work?", "max_tokens": 200},
        "model_request": {
            "max_tokens_to_sample": 200,
            "prompt": "\n\nHuman: How does a car work?\n\nAssistant:",
            "stop_sequences": ["\n\nHuman:"],
            "anthropic_version": "bedrock-2023-05-31",
        },
    },
    {
        "provider": AmazonBedrockModelProvider.ANTHROPIC,
        "config": {
            "name": "completions",
            "endpoint_type": "llm/v1/completions",
            "model": {
                "provider": "bedrock",
                "name": "anthropic.claude-instant-v1",
            },
        },
        "response": anthropic_completions_response(),
        "expected": anthropic_parsed_completions_response(),
        "request": {"prompt": "How does a car work?", "max_tokens": 200},
        "model_request": {
            "max_tokens_to_sample": 200,
            "prompt": "\n\nHuman: How does a car work?\n\nAssistant:",
            "stop_sequences": ["\n\nHuman:"],
            "anthropic_version": "bedrock-2023-05-31",
        },
    },
    {
        "provider": AmazonBedrockModelProvider.AMAZON,
        "config": {
            "name": "completions",
            "endpoint_type": "llm/v1/completions",
            "model": {
                "provider": "bedrock",
                "name": "amazon.titan-tg1-large",
            },
        },
        "request": {
            "prompt": "This is a test",
            "n": 1,
            "temperature": 0.5,
            "stop": ["foobar"],
            "max_tokens": 1000,
        },
        "response": {
            "results": [
                {
                    "tokenCount": 5,
                    "outputText": "\nThis is a test",
                    "completionReason": "FINISH",
                }
            ],
            "inputTextTokenCount": 4,
        },
        "expected": {
            "id": None,
            "object": "text_completion",
            "created": 1677858242,
            "model": "amazon.titan-tg1-large",
            "choices": [
                {
                    "text": "\nThis is a test",
                    "index": 0,
                    "finish_reason": None,
                }
            ],
            "usage": {"prompt_tokens": None, "completion_tokens": None, "total_tokens": None},
        },
        "model_request": {
            "inputText": "This is a test",
            "textGenerationConfig": {
                "temperature": 0.25,
                "stopSequences": ["foobar"],
                "maxTokenCount": 1000,
            },
        },
    },
    {
        "provider": AmazonBedrockModelProvider.AI21,
        "config": {
            "name": "completions",
            "endpoint_type": "llm/v1/completions",
            "model": {
                "provider": "bedrock",
                "name": "ai21.j2-ultra",
            },
        },
        "request": {
            "prompt": "This is a test",
        },
        "response": ai21_completion_response(),
        "expected": ai21_parsed_completion_response("ai21.j2-ultra"),
        "model_request": {"prompt": "This is a test"},
    },
    {
        "provider": AmazonBedrockModelProvider.AI21,
        "config": {
            "name": "completions",
            "endpoint_type": "llm/v1/completions",
            "model": {
                "provider": "bedrock",
                "name": "ai21.j2-mid",
            },
        },
        "request": {"prompt": "This is a test", "n": 2, "max_tokens": 1000, "stop": ["foobar"]},
        "response": ai21_completion_response(),
        "expected": ai21_parsed_completion_response("ai21.j2-mid"),
        "model_request": {
            "prompt": "This is a test",
            "stopSequences": ["foobar"],
            "maxTokens": 1000,
            "numResults": 2,
        },
    },
    {
        "provider": AmazonBedrockModelProvider.COHERE,
        "config": {
            "name": "completions",
            "endpoint_type": "llm/v1/completions",
            "model": {
                "provider": "bedrock",
                "name": "cohere.command",
            },
        },
        "request": {
            "prompt": "This is a test",
        },
        "response": cohere_completions_response(),
        "expected": {},
        "model_request": {},
    },
]

bedrock_aws_configs = [
    ({"aws_region": "us-east-1"}, AWSBaseConfig),
    (
        {
            "aws_region": "us-east-1",
            "aws_access_key_id": "test-access-key-id",
            "aws_secret_access_key": "test-secret-access-key",
            "aws_session_token": "test-session-token",
        },
        AWSIdAndKey,
    ),
    (
        {
            "aws_region": "us-east-1",
            "aws_access_key_id": "test-access-key-id",
            "aws_secret_access_key": "test-secret-access-key",
        },
        AWSIdAndKey,
    ),
    ({"aws_region": "us-east-1", "aws_role_arn": "test-aws-role-arn"}, AWSRole),
]


def _merge_model_and_aws_config(config, aws_config):
    return {
        **config,
        "model": {
            **config["model"],
            "config": {**config["model"].get("config", {}), "aws_config": aws_config},
        },
    }


def _assert_any_call_at_least(mobj, *args, **kwargs):
    if not mobj.call_args_list:
        raise AssertionError(f"no calls to {mobj=}")
    for call in mobj.call_args_list:
        if all(call.kwargs.get(k) == v for k, v in kwargs.items()) and all(
            call.args[i] == v for i, v in enumerate(args)
        ):
            return
    else:
        raise AssertionError(f"No valid call to {mobj=} with {args=} and {kwargs=}")


@pytest.mark.parametrize(("aws_config", "expected"), bedrock_aws_configs)
def test_bedrock_aws_config(aws_config, expected):
    assert isinstance(
        AmazonBedrockConfig.model_validate({"aws_config": aws_config}).aws_config, expected
    )


@pytest.mark.parametrize(
    ("provider", "config"),
    [(fix["provider"], fix["config"]) for fix in bedrock_model_provider_fixtures][:1],
)
@pytest.mark.parametrize("aws_config", [c for c, _ in bedrock_aws_configs])
def test_bedrock_aws_client(provider, config, aws_config):
    with mock.patch("boto3.Session", return_value=mock.Mock()) as mock_session:
        mock_client = mock.Mock()
        mock_assume_role = mock.Mock()
        mock_assume_role.return_value = mock.MagicMock()

        mock_session.return_value.client = mock_client
        mock_client.return_value.assume_role = mock_assume_role

        provider = AmazonBedrockProvider(
            EndpointConfig(**_merge_model_and_aws_config(config, aws_config))
        )
        provider.get_bedrock_client()

        if "aws_region" in aws_config:
            _assert_any_call_at_least(mock_session, region_name=aws_config["aws_region"])

        if "aws_role_arn" in aws_config:
            _assert_any_call_at_least(mock_client, service_name="sts")
            _assert_any_call_at_least(mock_assume_role, RoleArn=aws_config["aws_role_arn"])
            _assert_any_call_at_least(mock_client, service_name="bedrock-runtime")

        elif {"aws_secret_access_key", "aws_access_key_id"} <= set(aws_config):
            _assert_any_call_at_least(mock_client, service_name="bedrock-runtime")
            _assert_any_call_at_least(
                mock_client,
                **{
                    k: v
                    for k, v in aws_config.items()
                    if k in {"aws_secret_access_key", "aws_access_key_id"}
                },
            )


@pytest.mark.asyncio
@pytest.mark.parametrize("aws_config", [c[0] for c in bedrock_aws_configs])
@pytest.mark.parametrize(
    ("provider", "config", "payload", "response", "expected", "model_request"),
    [
        pytest.param(
            fix["provider"],
            fix["config"],
            fix["request"],
            fix["response"],
            fix["expected"],
            fix["model_request"],
            marks=[]
            if fix["provider"] is not AmazonBedrockModelProvider.COHERE
            else pytest.mark.skip("Cohere isn't available on Amazon Bedrock yet"),
        )
        for fix in bedrock_model_provider_fixtures
    ],
)
async def test_bedrock_request_response(
    provider, config, payload, response, expected, model_request, aws_config
):
    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch(
            "mlflow.gateway.providers.bedrock.AmazonBedrockProvider._request", return_value=response
        ) as mock_request,
    ):
        if not expected:
            pytest.skip("no expected value")

        expected["model"] = config["model"]["name"]

        provider = AmazonBedrockProvider(
            EndpointConfig(**_merge_model_and_aws_config(config, aws_config))
        )
        response = await provider.completions(completions.RequestPayload(**payload))
        assert jsonable_encoder(response) == expected

        mock_request.assert_called_once()
        mock_request.assert_called_once_with(model_request)


@pytest.mark.parametrize(
    ("model_name", "expected"),
    [
        ("us.anthropic.claude-3-sonnet", AmazonBedrockModelProvider.ANTHROPIC),
        ("apac.anthropic.claude-3-haiku", AmazonBedrockModelProvider.ANTHROPIC),
        ("anthropic.claude-3-5-sonnet", AmazonBedrockModelProvider.ANTHROPIC),
        ("ai21.jamba-1-5-large-v1:0", AmazonBedrockModelProvider.AI21),
        ("cohere.embed-multilingual-v3", AmazonBedrockModelProvider.COHERE),
        ("us.amazon.nova-premier-v1:0", AmazonBedrockModelProvider.AMAZON),
    ],
)
def test_amazon_bedrock_model_provider(model_name, expected):
    provider = AmazonBedrockModelProvider.of_str(model_name)
    assert provider == expected
```

--------------------------------------------------------------------------------

---[FILE: test_cohere.py]---
Location: mlflow-master/tests/gateway/providers/test_cohere.py
Signals: FastAPI, Pydantic

```python
from unittest import mock

import pytest
from aiohttp import ClientTimeout
from fastapi.encoders import jsonable_encoder
from pydantic import ValidationError

from mlflow.gateway.config import EndpointConfig
from mlflow.gateway.constants import MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.cohere import CohereProvider
from mlflow.gateway.schemas import chat, completions, embeddings

from tests.gateway.tools import MockAsyncResponse, MockAsyncStreamingResponse


def chat_config():
    return {
        "name": "chat",
        "endpoint_type": "llm/v1/chat",
        "model": {
            "provider": "cohere",
            "name": "command",
            "config": {
                "cohere_api_key": "key",
            },
        },
    }


def chat_response():
    return {
        "response_id": "abc123",
        "text": "\n\nThis is a test!",
        "generation_id": "def456",
        "token_count": {
            "prompt_tokens": 13,
            "response_tokens": 7,
            "total_tokens": 20,
            "billed_tokens": 20,
        },
        "meta": {
            "api_version": {"version": "1"},
            "billed_units": {"input_tokens": 13, "output_tokens": 7},
        },
        "tool_inputs": None,
    }


def chat_payload(stream: bool = False):
    payload = {
        "messages": [
            {"role": "user", "content": "Message 1"},
            {"role": "assistant", "content": "Message 2"},
            {"role": "user", "content": "Message 3"},
        ],
        "temperature": 0.5,
    }
    if stream:
        payload["stream"] = True
    return payload


@pytest.mark.asyncio
async def test_chat():
    resp = chat_response()
    config = chat_config()
    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        provider = CohereProvider(EndpointConfig(**config))
        payload = chat_payload()
        response = await provider.chat(chat.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "id": "abc123",
            "object": "chat.completion",
            "created": 1677858242,
            "model": "command",
            "choices": [
                {
                    "message": {
                        "role": "assistant",
                        "content": "\n\nThis is a test!",
                        "tool_calls": None,
                        "refusal": None,
                    },
                    "finish_reason": None,
                    "index": 0,
                }
            ],
            "usage": {
                "prompt_tokens": 13,
                "completion_tokens": 7,
                "total_tokens": 20,
            },
        }
        mock_post.assert_called_once_with(
            "https://api.cohere.ai/v1/chat",
            json={
                "model": "command",
                "chat_history": [
                    {"role": "USER", "message": "Message 1"},
                    {"role": "CHATBOT", "message": "Message 2"},
                ],
                "message": "Message 3",
                "temperature": 1.25,
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


@pytest.mark.asyncio
async def test_chat_with_system_messages():
    resp = chat_response()
    config = chat_config()
    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        provider = CohereProvider(EndpointConfig(**config))
        payload = {
            "messages": [
                {"role": "system", "content": "System Message 1"},
                {"role": "user", "content": "Message 1"},
                {"role": "assistant", "content": "Message 2"},
                {"role": "system", "content": "System Message 2"},
                {"role": "user", "content": "Message 3"},
            ],
            "temperature": 0.5,
        }
        await provider.chat(chat.RequestPayload(**payload))
        mock_post.assert_called_once_with(
            "https://api.cohere.ai/v1/chat",
            json={
                "model": "command",
                "chat_history": [
                    {"role": "USER", "message": "Message 1"},
                    {"role": "CHATBOT", "message": "Message 2"},
                ],
                "message": "Message 3",
                "preamble_override": "System Message 1\nSystem Message 2",
                "temperature": 1.25,
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


@pytest.mark.parametrize(
    "params",
    [{"n": 2}, {"stop": ["test"]}],
)
@pytest.mark.asyncio
async def test_chat_throws_if_parameter_not_permitted(params):
    config = chat_config()
    provider = CohereProvider(EndpointConfig(**config))
    payload = chat_payload()
    payload.update(params)
    with pytest.raises(AIGatewayException, match=r".*") as e:
        await provider.chat(chat.RequestPayload(**payload))
    assert e.value.status_code == 422


def chat_stream_response():
    return [
        # first chunk
        b'{"is_finished":false,"event_type":"stream-start","generation_id":"test-id2"}',
        # subsequent chunks
        b'{"text":" Hi","is_finished":false,"event_type":"text-generation"}',
        b'{"text":" there","is_finished":false,"event_type":"text-generation"}',
        # final chunk
        b'{"is_finished":true,"event_type":"stream-end","response":{"response_id":"test-id1",'
        b'"text":"How are you","generation_id":"test-id2","token_count":{"prompt_tokens":83,'
        b'"response_tokens":63,"total_tokens":146,"billed_tokens":128},"tool_inputs":null},'
        b'"finish_reason":"COMPLETE"}',
    ]


@pytest.mark.asyncio
async def test_chat_stream():
    resp = chat_stream_response()
    config = chat_config()

    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch(
            "aiohttp.ClientSession.post", return_value=MockAsyncStreamingResponse(resp)
        ) as mock_post,
    ):
        provider = CohereProvider(EndpointConfig(**config))
        payload = chat_payload(stream=True)
        response = provider.chat_stream(chat.RequestPayload(**payload))
        chunks = [jsonable_encoder(chunk) async for chunk in response]
        assert chunks == [
            {
                "choices": [
                    {
                        "delta": {
                            "role": None,
                            "content": " Hi",
                            "tool_calls": None,
                        },
                        "finish_reason": None,
                        "index": 0,
                    }
                ],
                "created": 1677858242,
                "id": None,
                "model": "command",
                "object": "chat.completion.chunk",
            },
            {
                "choices": [
                    {
                        "delta": {
                            "role": None,
                            "content": " there",
                            "tool_calls": None,
                        },
                        "finish_reason": None,
                        "index": 0,
                    }
                ],
                "created": 1677858242,
                "id": None,
                "model": "command",
                "object": "chat.completion.chunk",
            },
            {
                "choices": [
                    {
                        "delta": {
                            "role": None,
                            "content": None,
                            "tool_calls": None,
                        },
                        "finish_reason": "COMPLETE",
                        "index": 0,
                    }
                ],
                "created": 1677858242,
                "id": "test-id1",
                "model": "command",
                "object": "chat.completion.chunk",
            },
        ]
        mock_post.assert_called_once_with(
            "https://api.cohere.ai/v1/chat",
            json={
                "model": "command",
                "chat_history": [
                    {"role": "USER", "message": "Message 1"},
                    {"role": "CHATBOT", "message": "Message 2"},
                ],
                "message": "Message 3",
                "temperature": 1.25,
                "stream": True,
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


def completions_config():
    return {
        "name": "completions",
        "endpoint_type": "llm/v1/completions",
        "model": {
            "provider": "cohere",
            "name": "command",
            "config": {
                "cohere_api_key": "key",
            },
        },
    }


def completions_response():
    return {
        "id": "string",
        "generations": [
            {
                "id": "string",
                "text": "This is a test",
            }
        ],
        "prompt": "string",
        "headers": {"Content-Type": "application/json"},
    }


@pytest.mark.asyncio
async def test_completions():
    resp = completions_response()
    config = completions_config()
    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        provider = CohereProvider(EndpointConfig(**config))
        payload = {
            "prompt": "This is a test",
            "n": 1,
            "stop": ["foobar"],
        }
        response = await provider.completions(completions.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "id": None,
            "object": "text_completion",
            "created": 1677858242,
            "model": "command",
            "choices": [
                {
                    "text": "This is a test",
                    "index": 0,
                    "finish_reason": None,
                }
            ],
            "usage": {"prompt_tokens": None, "completion_tokens": None, "total_tokens": None},
        }
        mock_post.assert_called_once_with(
            "https://api.cohere.ai/v1/generate",
            json={
                "prompt": "This is a test",
                "model": "command",
                "num_generations": 1,
                "stop_sequences": ["foobar"],
                "temperature": 0.0,
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


@pytest.mark.asyncio
async def test_completions_temperature_is_scaled_correctly():
    resp = completions_response()
    config = completions_config()
    with mock.patch(
        "aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)
    ) as mock_post:
        provider = CohereProvider(EndpointConfig(**config))
        payload = {
            "prompt": "This is a test",
            "temperature": 0.5,
        }
        await provider.completions(completions.RequestPayload(**payload))
        assert mock_post.call_args[1]["json"]["temperature"] == 0.5 * 2.5


def completions_stream_response():
    return [
        b'{"text":" Hi","is_finished":false,"event_type":"text-generation"}',
        b'{"text":" there","is_finished":false,"event_type":"text-generation"}',
        # final chunk
        b'{"is_finished":true,"event_type":"stream-end","finish_reason":"COMPLETE",'
        b'"response":{"id":"test-id1","generations":'
        b'[{"id":"test-id2","text":" Hi there","finish_reason":"COMPLETE"}],'
        b'"prompt":"This is a test"}}',
    ]


@pytest.mark.asyncio
async def test_completions_stream():
    resp = completions_stream_response()
    config = completions_config()

    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch(
            "aiohttp.ClientSession.post", return_value=MockAsyncStreamingResponse(resp)
        ) as mock_post,
    ):
        provider = CohereProvider(EndpointConfig(**config))
        payload = {
            "prompt": "This is a test",
            "n": 1,
            "stream": True,
        }
        response = provider.completions_stream(completions.RequestPayload(**payload))
        chunks = [jsonable_encoder(chunk) async for chunk in response]
        assert chunks == [
            {
                "choices": [
                    {
                        "text": " Hi",
                        "finish_reason": None,
                        "index": 0,
                    }
                ],
                "created": 1677858242,
                "id": None,
                "model": "command",
                "object": "text_completion_chunk",
            },
            {
                "choices": [
                    {
                        "text": " there",
                        "finish_reason": None,
                        "index": 0,
                    }
                ],
                "created": 1677858242,
                "id": None,
                "model": "command",
                "object": "text_completion_chunk",
            },
            {
                "choices": [
                    {
                        "text": None,
                        "finish_reason": "COMPLETE",
                        "index": 0,
                    }
                ],
                "created": 1677858242,
                "id": "test-id1",
                "model": "command",
                "object": "text_completion_chunk",
            },
        ]
        mock_post.assert_called_once_with(
            "https://api.cohere.ai/v1/generate",
            json={
                "prompt": "This is a test",
                "model": "command",
                "num_generations": 1,
                "temperature": 0.0,
                "stream": True,
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


def embeddings_config():
    return {
        "name": "embeddings",
        "endpoint_type": "llm/v1/embeddings",
        "model": {
            "provider": "cohere",
            "name": "embed-english-light-v2.0",
            "config": {
                "cohere_api_key": "key",
            },
        },
    }


def embeddings_response():
    return {
        "id": "bc57846a-3e56-4327-8acc-588ca1a37b8a",
        "texts": ["hello world"],
        "embeddings": [
            [
                3.25,
                0.7685547,
                2.65625,
                -0.30126953,
                -2.3554688,
                1.2597656,
            ]
        ],
        "meta": [
            {
                "api_version": [
                    {
                        "version": "1",
                    }
                ]
            },
        ],
        "headers": {"Content-Type": "application/json"},
    }


def embeddings_batch_response():
    return {
        "id": "bc57846a-3e56-4327-8acc-588ca1a37b8a",
        "texts": ["hello world"],
        "embeddings": [
            [
                3.25,
                0.7685547,
                2.65625,
                -0.30126953,
                -2.3554688,
                1.2597656,
            ],
            [
                7.25,
                0.7685547,
                4.65625,
                -0.30126953,
                -2.3554688,
                8.2597656,
            ],
        ],
        "meta": [
            {
                "api_version": [
                    {
                        "version": "1",
                    }
                ]
            },
        ],
        "headers": {"Content-Type": "application/json"},
    }


@pytest.mark.asyncio
async def test_embeddings():
    resp = embeddings_response()
    config = embeddings_config()
    with mock.patch(
        "aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)
    ) as mock_post:
        provider = CohereProvider(EndpointConfig(**config))
        payload = {"input": "This is a test"}
        response = await provider.embeddings(embeddings.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "object": "list",
            "data": [
                {
                    "object": "embedding",
                    "embedding": [
                        3.25,
                        0.7685547,
                        2.65625,
                        -0.30126953,
                        -2.3554688,
                        1.2597656,
                    ],
                    "index": 0,
                }
            ],
            "model": "embed-english-light-v2.0",
            "usage": {"prompt_tokens": None, "total_tokens": None},
        }
        mock_post.assert_called_once()


@pytest.mark.asyncio
async def test_batch_embeddings():
    resp = embeddings_batch_response()
    config = embeddings_config()
    with mock.patch(
        "aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)
    ) as mock_post:
        provider = CohereProvider(EndpointConfig(**config))
        payload = {"input": ["This is a", "batch test"]}
        response = await provider.embeddings(embeddings.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "object": "list",
            "data": [
                {
                    "object": "embedding",
                    "embedding": [
                        3.25,
                        0.7685547,
                        2.65625,
                        -0.30126953,
                        -2.3554688,
                        1.2597656,
                    ],
                    "index": 0,
                },
                {
                    "object": "embedding",
                    "embedding": [
                        7.25,
                        0.7685547,
                        4.65625,
                        -0.30126953,
                        -2.3554688,
                        8.2597656,
                    ],
                    "index": 1,
                },
            ],
            "model": "embed-english-light-v2.0",
            "usage": {"prompt_tokens": None, "total_tokens": None},
        }
        mock_post.assert_called_once()


@pytest.mark.asyncio
async def test_param_model_is_not_permitted():
    config = embeddings_config()
    provider = CohereProvider(EndpointConfig(**config))
    payload = {
        "prompt": "This should fail",
        "max_tokens": 5000,
        "model": "something-else",
    }
    with pytest.raises(AIGatewayException, match=r".*") as e:
        await provider.completions(completions.RequestPayload(**payload))
    assert "The parameter 'model' is not permitted" in e.value.detail
    assert e.value.status_code == 422


@pytest.mark.parametrize("prompt", [{"set1", "set2"}, ["list1"], [1], ["list1", "list2"], [1, 2]])
@pytest.mark.asyncio
async def test_completions_throws_if_prompt_contains_non_string(prompt):
    config = completions_config()
    provider = CohereProvider(EndpointConfig(**config))
    payload = {"prompt": prompt}
    with pytest.raises(ValidationError, match=r"prompt"):
        await provider.completions(completions.RequestPayload(**payload))
```

--------------------------------------------------------------------------------

````
