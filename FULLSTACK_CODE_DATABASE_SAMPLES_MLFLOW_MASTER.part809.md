---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 809
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 809 of 991)

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

---[FILE: test_gemini_autolog.py]---
Location: mlflow-master/tests/gemini/test_gemini_autolog.py

```python
"""
This file contains unit tests for the new Gemini Python SDK
https://github.com/googleapis/python-genai
"""

import asyncio
import base64
import importlib.metadata
from unittest.mock import patch

import pytest
from google import genai
from packaging.version import Version

import mlflow
from mlflow.entities.span import SpanType
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey

from tests.tracing.helper import get_traces

google_gemini_version = Version(importlib.metadata.version("google.genai"))
is_gemini_1_7_or_newer = google_gemini_version >= Version("1.7.0")

_CONTENT = {"parts": [{"text": "test answer"}], "role": "model"}

_USER_METADATA = {
    "prompt_token_count": 6,
    "candidates_token_count": 6,
    "total_token_count": 12,
    "cached_content_token_count": 0,
}


def _get_candidate(content):
    candidate = {
        "content": content,
        "avg_logprobs": 0.0,
        "finish_reason": "STOP",
        "safety_ratings": [],
        "token_count": 0,
    }

    return genai.types.Candidate(**candidate)


def _generate_content_response(content):
    res = {
        "candidates": [_get_candidate(content)],
        "usage_metadata": _USER_METADATA,
        "automatic_function_calling_history": [],
    }

    return genai.types.GenerateContentResponse(**res)


_DUMMY_GENERATE_CONTENT_RESPONSE = _generate_content_response(_CONTENT)

_DUMMY_COUNT_TOKENS_RESPONSE = {"total_count": 10}

_DUMMY_EMBEDDING_RESPONSE = {"embedding": [1, 2, 3]}


def _dummy_generate_content(is_async: bool):
    if is_async:

        async def _generate_content(self, model, contents, config):
            return _DUMMY_GENERATE_CONTENT_RESPONSE
    else:

        def _generate_content(self, model, contents, config):
            return _DUMMY_GENERATE_CONTENT_RESPONSE

    return _generate_content


def send_message(self, content):
    return _DUMMY_GENERATE_CONTENT_RESPONSE


def count_tokens(self, model, contents):
    return _DUMMY_COUNT_TOKENS_RESPONSE


def embed_content(self, model, content):
    return _DUMMY_EMBEDDING_RESPONSE


def multiply(a: float, b: float):
    """returns a * b."""
    return a * b


TOOL_ATTRIBUTE = [
    {
        "type": "function",
        "function": {
            "name": "multiply",
            "description": "returns a * b.",
            "parameters": {
                "properties": {
                    "a": {"type": "number", "description": None, "enum": None},
                    "b": {"type": "number", "description": None, "enum": None},
                },
                "required": ["a", "b"] if is_gemini_1_7_or_newer else None,
            },
        },
    },
]


@pytest.fixture(autouse=True)
def cleanup():
    yield
    mlflow.gemini.autolog(disable=True)


@pytest.fixture(params=[True, False], ids=["async", "sync"])
def is_async(request):
    return request.param


def _call_generate_content(
    is_async: bool, contents: str, model: str = "gemini-1.5-flash", config=None
):
    client = genai.Client(api_key="dummy")
    if is_async:
        return asyncio.run(
            client.aio.models.generate_content(model=model, contents=contents, config=config)
        )
    else:
        return client.models.generate_content(model=model, contents=contents, config=config)


def _create_chat_and_send_message(is_async: bool, message: str):
    client = genai.Client(api_key="dummy")
    if is_async:
        chat = client.aio.chats.create(model="gemini-1.5-flash")
        return asyncio.run(chat.send_message(message))
    else:
        chat = client.chats.create(model="gemini-1.5-flash")
        return chat.send_message(message)


def test_generate_content_enable_disable_autolog(is_async):
    cls = "AsyncModels" if is_async else "Models"
    with (
        patch(
            f"google.genai.models.{cls}._generate_content", new=_dummy_generate_content(is_async)
        ),
    ):
        mlflow.gemini.autolog()
        _call_generate_content(is_async, "test content")

        traces = get_traces()
        assert len(traces) == 1
        assert traces[0].info.status == "OK"
        assert len(traces[0].data.spans) == 2

        span = traces[0].data.spans[0]
        assert span.name == f"{cls}.generate_content"
        assert span.span_type == SpanType.LLM
        assert span.inputs == {
            "contents": "test content",
            "model": "gemini-1.5-flash",
            "config": None,
        }
        assert span.outputs == _DUMMY_GENERATE_CONTENT_RESPONSE.model_dump()

        span1 = traces[0].data.spans[1]
        assert span1.name == f"{cls}._generate_content"
        assert span1.span_type == SpanType.LLM
        assert span1.inputs == {
            "contents": "test content",
            "model": "gemini-1.5-flash",
            "config": None,
        }
        assert span1.outputs == _DUMMY_GENERATE_CONTENT_RESPONSE.model_dump()

        assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
            TokenUsageKey.INPUT_TOKENS: 6,
            TokenUsageKey.OUTPUT_TOKENS: 6,
            TokenUsageKey.TOTAL_TOKENS: 12,
        }

        assert traces[0].info.token_usage == {
            "input_tokens": 6,
            "output_tokens": 6,
            "total_tokens": 12,
        }

        mlflow.gemini.autolog(disable=True)
        _call_generate_content(is_async, "test content")

        # No new trace should be created
        traces = get_traces()
        assert len(traces) == 1


def test_generate_content_tracing_with_error(is_async):
    if is_async:

        async def _generate_content(self, model, contents, config):
            raise Exception("dummy error")
    else:

        def _generate_content(self, model, contents, config):
            raise Exception("dummy error")

    cls = "AsyncModels" if is_async else "Models"
    with patch(f"google.genai.models.{cls}._generate_content", new=_generate_content):
        mlflow.gemini.autolog()

        with pytest.raises(Exception, match="dummy error"):
            _call_generate_content(is_async, "test content")

    traces = get_traces()
    assert len(traces) == 1
    assert len(traces[0].data.spans) == 2

    assert traces[0].info.status == "ERROR"
    assert traces[0].data.spans[0].status.status_code == "ERROR"
    assert traces[0].data.spans[0].status.description == "Exception: dummy error"
    assert traces[0].data.spans[1].status.status_code == "ERROR"
    assert traces[0].data.spans[1].status.description == "Exception: dummy error"


def test_generate_content_image_autolog():
    image = base64.b64encode(b"image").decode("utf-8")
    request = [
        genai.types.Part.from_bytes(mime_type="image/jpeg", data=image),
        "Caption this image",
    ]
    cls = "AsyncModels" if is_async else "Models"
    with patch(
        f"google.genai.models.{cls}._generate_content", new=_dummy_generate_content(is_async)
    ):
        mlflow.gemini.autolog()
        _call_generate_content(is_async, request)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 2

    span = traces[0].data.spans[0]
    assert span.name == f"{cls}.generate_content"
    assert span.span_type == SpanType.LLM
    assert span.inputs["model"] == "gemini-1.5-flash"
    extra = {"display_name": None} if google_gemini_version >= Version("1.15.0") else {}
    assert span.inputs["contents"][0]["inline_data"] == {
        "data": "b'image'",
        "mime_type": "image/jpeg",
        **extra,
    }
    assert span.inputs["contents"][1] == "Caption this image"
    assert span.outputs == _DUMMY_GENERATE_CONTENT_RESPONSE.model_dump()

    span1 = traces[0].data.spans[1]
    assert span1.name == f"{cls}._generate_content"
    assert span1.span_type == SpanType.LLM
    assert span1.parent_id == span.span_id
    assert span1.inputs["model"] == "gemini-1.5-flash"
    assert span1.inputs["contents"][0]["inline_data"] == {
        "data": "b'image'",
        "mime_type": "image/jpeg",
        **extra,
    }
    assert span1.inputs["contents"][1] == "Caption this image"
    assert span1.outputs == _DUMMY_GENERATE_CONTENT_RESPONSE.model_dump()

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        TokenUsageKey.INPUT_TOKENS: 6,
        TokenUsageKey.OUTPUT_TOKENS: 6,
        TokenUsageKey.TOTAL_TOKENS: 12,
    }

    assert traces[0].info.token_usage == {
        "input_tokens": 6,
        "output_tokens": 6,
        "total_tokens": 12,
    }


def test_generate_content_tool_calling_autolog(is_async):
    tool_call_content = {
        "parts": [
            {
                "function_call": {
                    "name": "multiply",
                    "args": {
                        "a": 57.0,
                        "b": 44.0,
                    },
                }
            }
        ],
        "role": "model",
    }

    response = _generate_content_response(tool_call_content)
    if is_async:

        async def _generate_content(self, model, contents, config):
            return response
    else:

        def _generate_content(self, model, contents, config):
            return response

    cls = "AsyncModels" if is_async else "Models"

    with patch(f"google.genai.models.{cls}._generate_content", new=_generate_content):
        mlflow.gemini.autolog()
        _call_generate_content(
            is_async,
            model="gemini-1.5-flash",
            contents="I have 57 cats, each owns 44 mittens, how many mittens is that in total?",
            config=genai.types.GenerateContentConfig(
                tools=[multiply],
                automatic_function_calling=genai.types.AutomaticFunctionCallingConfig(disable=True),
            ),
        )

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 2

    span = traces[0].data.spans[0]
    assert span.name == f"{cls}.generate_content"
    assert span.span_type == SpanType.LLM
    assert (
        span.inputs["contents"]
        == "I have 57 cats, each owns 44 mittens, how many mittens is that in total?"
    )
    assert span.get_attribute(SpanAttributeKey.CHAT_TOOLS) == TOOL_ATTRIBUTE
    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "gemini"

    span1 = traces[0].data.spans[1]
    assert span1.name == f"{cls}._generate_content"
    assert span1.span_type == SpanType.LLM
    assert span1.parent_id == span.span_id
    assert (
        span1.inputs["contents"]
        == "I have 57 cats, each owns 44 mittens, how many mittens is that in total?"
    )
    assert span1.get_attribute(SpanAttributeKey.CHAT_TOOLS) == TOOL_ATTRIBUTE
    assert span1.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "gemini"

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        TokenUsageKey.INPUT_TOKENS: 6,
        TokenUsageKey.OUTPUT_TOKENS: 6,
        TokenUsageKey.TOTAL_TOKENS: 12,
    }

    assert traces[0].info.token_usage == {
        "input_tokens": 6,
        "output_tokens": 6,
        "total_tokens": 12,
    }


def test_generate_content_tool_calling_chat_history_autolog(is_async):
    question_content = genai.types.Content(
        **{
            "parts": [
                {
                    "text": "I have 57 cats, each owns 44 mittens, how many mittens in total?",
                }
            ],
            "role": "user",
        }
    )

    tool_call_content = genai.types.Content(
        **{
            "parts": [
                {
                    "function_call": {
                        "name": "multiply",
                        "args": {
                            "a": 57.0,
                            "b": 44.0,
                        },
                    }
                }
            ],
            "role": "model",
        }
    )

    tool_response_content = genai.types.Content(
        **{
            "parts": [{"function_response": {"name": "multiply", "response": {"result": 2508.0}}}],
            "role": "user",
        }
    )

    response = _generate_content_response(
        genai.types.Content(
            **{
                "parts": [
                    {
                        "text": "57 cats * 44 mittens/cat = 2508 mittens in total.",
                    }
                ],
                "role": "model",
            }
        )
    )

    cls = "AsyncModels" if is_async else "Models"

    if is_async:

        async def _generate_content(self, model, contents, config):
            return response
    else:

        def _generate_content(self, model, contents, config):
            return response

    with patch(f"google.genai.models.{cls}._generate_content", new=_generate_content):
        mlflow.gemini.autolog()
        _call_generate_content(
            is_async,
            model="gemini-1.5-flash",
            contents=[question_content, tool_call_content, tool_response_content],
            config=genai.types.GenerateContentConfig(
                tools=[multiply],
                automatic_function_calling=genai.types.AutomaticFunctionCallingConfig(disable=True),
            ),
        )

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 2

    span = traces[0].data.spans[0]
    assert span.name == f"{cls}.generate_content"
    assert span.span_type == SpanType.LLM
    assert span.inputs["contents"] == [
        question_content.model_dump(),
        tool_call_content.model_dump(),
        tool_response_content.model_dump(),
    ]
    assert span.inputs["model"] == "gemini-1.5-flash"
    assert span.get_attribute("mlflow.chat.tools") == TOOL_ATTRIBUTE
    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "gemini"

    span1 = traces[0].data.spans[1]
    assert span1.name == f"{cls}._generate_content"
    assert span1.span_type == SpanType.LLM
    assert span1.parent_id == span.span_id
    assert span1.inputs["contents"] == [
        question_content.model_dump(),
        tool_call_content.model_dump(),
        tool_response_content.model_dump(),
    ]
    assert span1.inputs["model"] == "gemini-1.5-flash"
    assert span1.get_attribute("mlflow.chat.tools") == TOOL_ATTRIBUTE
    assert span1.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "gemini"

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        TokenUsageKey.INPUT_TOKENS: 6,
        TokenUsageKey.OUTPUT_TOKENS: 6,
        TokenUsageKey.TOTAL_TOKENS: 12,
    }

    assert traces[0].info.token_usage == {
        "input_tokens": 6,
        "output_tokens": 6,
        "total_tokens": 12,
    }


def test_chat_session_autolog(is_async):
    cls = "AsyncModels" if is_async else "Models"
    with patch(
        f"google.genai.models.{cls}._generate_content", new=_dummy_generate_content(is_async)
    ):
        mlflow.gemini.autolog()
        _create_chat_and_send_message(is_async, "test content")

        traces = get_traces()
        assert len(traces) == 1
        assert traces[0].info.status == "OK"
        assert len(traces[0].data.spans) == 3
        span = traces[0].data.spans[0]
        assert span.name == "AsyncChat.send_message" if is_async else "Chat.send_message"
        assert span.span_type == SpanType.CHAT_MODEL
        assert span.inputs == {"message": "test content"}
        assert span.outputs == _DUMMY_GENERATE_CONTENT_RESPONSE.model_dump()

        mlflow.gemini.autolog(disable=True)
        _create_chat_and_send_message(is_async, "test content")

        # No new trace should be created
        traces = get_traces()
        assert len(traces) == 1


def test_count_tokens_autolog():
    with patch("google.genai.models.Models.count_tokens", new=count_tokens):
        mlflow.gemini.autolog()
        client = genai.Client(api_key="dummy")
        client.models.count_tokens(model="gemini-1.5-flash", contents="test content")

        traces = get_traces()
        assert len(traces) == 1
        assert traces[0].info.status == "OK"
        assert len(traces[0].data.spans) == 1
        span = traces[0].data.spans[0]
        assert span.name == "Models.count_tokens"
        assert span.span_type == SpanType.LLM
        assert span.inputs == {"contents": "test content", "model": "gemini-1.5-flash"}
        assert span.outputs == _DUMMY_COUNT_TOKENS_RESPONSE

        mlflow.gemini.autolog(disable=True)
        client = genai.Client(api_key="dummy")
        client.models.count_tokens(model="gemini-1.5-flash", contents="test content")

        # No new trace should be created
        traces = get_traces()
        assert len(traces) == 1


def test_embed_content_autolog():
    with patch("google.genai.models.Models.embed_content", new=embed_content):
        mlflow.gemini.autolog()
        client = genai.Client(api_key="dummy")
        client.models.embed_content(model="text-embedding-004", content="Hello World")

        traces = get_traces()
        assert len(traces) == 1
        assert traces[0].info.status == "OK"
        assert len(traces[0].data.spans) == 1
        span = traces[0].data.spans[0]
        assert span.name == "Models.embed_content"
        assert span.span_type == SpanType.EMBEDDING
        assert span.inputs == {"content": "Hello World", "model": "text-embedding-004"}
        assert span.outputs == _DUMMY_EMBEDDING_RESPONSE

        mlflow.gemini.autolog(disable=True)
        client.models.embed_content(model="text-embedding-004", content="Hello World")

        # No new trace should be created
        traces = get_traces()
        assert len(traces) == 1
```

--------------------------------------------------------------------------------

---[FILE: test_legacy_gemini_autolog.py]---
Location: mlflow-master/tests/gemini/test_legacy_gemini_autolog.py

```python
"""
This file contains unit tests for the legacy Gemini Python SDK
https://github.com/google-gemini/generative-ai-python
"""

import base64
from unittest.mock import patch

import google.generativeai as genai
import pytest
from packaging.version import Version

import mlflow
from mlflow.entities.span import SpanType

from tests.tracing.helper import get_traces

_CONTENT = {"parts": [{"text": "test answer"}], "role": "model"}

_USER_METADATA = {
    "prompt_token_count": 6,
    "candidates_token_count": 6,
    "total_token_count": 6,
    "cached_content_token_count": 0,
}


def _get_candidate(content):
    candidate = {
        "content": content,
        "avg_logprobs": 0.0,
        "finish_reason": 0,
        "grounding_attributions": [],
        "safety_ratings": [],
        "token_count": 0,
    }

    if Version(genai.__version__) < Version("0.8.3"):
        candidate.pop("avg_logprobs")

    return candidate


def _generate_content_response(content):
    res = {
        "candidates": [_get_candidate(content)],
        "usage_metadata": _USER_METADATA,
    }

    if hasattr(genai.types.GenerateContentResponse, "model_version"):
        res["model_version"] = "gemini-1.5-flash-002"

    return res


_GENERATE_CONTENT_RESPONSE = _generate_content_response(_CONTENT)

_DUMMY_GENERATE_CONTENT_RESPONSE = genai.types.GenerateContentResponse.from_response(
    genai.protos.GenerateContentResponse(_GENERATE_CONTENT_RESPONSE)
)

_DUMMY_COUNT_TOKENS_RESPONSE = {"total_count": 10}

_DUMMY_EMBEDDING_RESPONSE = {"embedding": [1, 2, 3]}


def generate_content(self, contents):
    return _DUMMY_GENERATE_CONTENT_RESPONSE


def send_message(self, content):
    return _DUMMY_GENERATE_CONTENT_RESPONSE


def count_tokens(self, contents):
    return _DUMMY_COUNT_TOKENS_RESPONSE


def embed_content(model, content):
    return _DUMMY_EMBEDDING_RESPONSE


def multiply(a: float, b: float):
    """returns a * b."""
    return a * b


TOOL_ATTRIBUTE = [
    {
        "type": "function",
        "function": {
            "name": "multiply",
            "description": "returns a * b.",
            "parameters": {
                "properties": {
                    "a": {"type": "number", "description": "", "enum": []},
                    "b": {"type": "number", "description": "", "enum": []},
                },
                "required": ["a", "b"],
            },
        },
    },
]


@pytest.fixture(autouse=True)
def cleanup():
    yield
    mlflow.gemini.autolog(disable=True)


def test_generate_content_enable_disable_autolog():
    with patch("google.generativeai.GenerativeModel.generate_content", new=generate_content):
        mlflow.gemini.autolog()
        model = genai.GenerativeModel("gemini-1.5-flash")
        model.generate_content("test content")

        traces = get_traces()
        assert len(traces) == 1
        assert traces[0].info.status == "OK"
        assert len(traces[0].data.spans) == 1
        span = traces[0].data.spans[0]
        assert span.name == "GenerativeModel.generate_content"
        assert span.span_type == SpanType.LLM
        assert span.inputs == {"contents": "test content"}
        assert span.outputs == _GENERATE_CONTENT_RESPONSE

        mlflow.gemini.autolog(disable=True)
        model = genai.GenerativeModel("gemini-1.5-flash")
        model.generate_content("test content")

        # No new trace should be created
        traces = get_traces()
        assert len(traces) == 1


def test_generate_content_tracing_with_error():
    with patch(
        "google.generativeai.GenerativeModel.generate_content", side_effect=Exception("dummy error")
    ):
        mlflow.gemini.autolog()
        model = genai.GenerativeModel("gemini-1.5-flash")

        with pytest.raises(Exception, match="dummy error"):
            model.generate_content("test content")

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "ERROR"
    assert traces[0].data.spans[0].status.status_code == "ERROR"
    assert traces[0].data.spans[0].status.description == "Exception: dummy error"


def test_generate_content_image_autolog():
    image = base64.b64encode(b"image").decode("utf-8")
    request = [{"mime_type": "image/jpeg", "data": image}, "Caption this image"]
    with patch("google.generativeai.GenerativeModel.generate_content", new=generate_content):
        mlflow.gemini.autolog()
        model = genai.GenerativeModel("gemini-1.5-flash")
        model.generate_content(request)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "GenerativeModel.generate_content"
    assert span.span_type == SpanType.LLM
    assert span.inputs == {"contents": request}
    assert span.outputs == _GENERATE_CONTENT_RESPONSE


def test_generate_content_tool_calling_autolog():
    tool_call_content = {
        "parts": [
            {
                "function_call": {
                    "name": "multiply",
                    "args": {
                        "a": 57.0,
                        "b": 44.0,
                    },
                }
            }
        ],
        "role": "model",
    }

    raw_response = _generate_content_response(tool_call_content)
    response = genai.types.GenerateContentResponse.from_response(
        genai.protos.GenerateContentResponse(raw_response)
    )

    def generate_content(self, content):
        return response

    with patch("google.generativeai.GenerativeModel.generate_content", new=generate_content):
        mlflow.gemini.autolog()
        model = genai.GenerativeModel("gemini-1.5-flash", tools=[multiply])
        model.generate_content(
            "I have 57 cats, each owns 44 mittens, how many mittens is that in total?"
        )

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "GenerativeModel.generate_content"
    assert span.span_type == SpanType.LLM
    assert span.inputs == {
        "content": "I have 57 cats, each owns 44 mittens, how many mittens is that in total?"
    }
    assert span.get_attribute("mlflow.chat.tools") == TOOL_ATTRIBUTE


def test_generate_content_tool_calling_chat_history_autolog():
    question_content = genai.protos.Content(
        {
            "parts": [
                {
                    "text": "I have 57 cats, each owns 44 mittens, how many mittens in total?",
                }
            ],
            "role": "user",
        }
    )

    tool_call_content = genai.protos.Content(
        {
            "parts": [
                {
                    "function_call": {
                        "name": "multiply",
                        "args": {
                            "a": 57.0,
                            "b": 44.0,
                        },
                    }
                }
            ],
            "role": "model",
        }
    )

    tool_response_content = genai.protos.Content(
        {
            "parts": [{"function_response": {"name": "multiply", "response": {"result": 2508.0}}}],
            "role": "user",
        }
    )

    raw_response = _generate_content_response(
        genai.protos.Content(
            {
                "parts": [
                    {
                        "text": "57 cats * 44 mittens/cat = 2508 mittens in total.",
                    }
                ],
                "role": "model",
            }
        )
    )

    response = genai.types.GenerateContentResponse.from_response(
        genai.protos.GenerateContentResponse(raw_response)
    )

    def generate_content(self, content):
        return response

    with patch("google.generativeai.GenerativeModel.generate_content", new=generate_content):
        mlflow.gemini.autolog()
        model = genai.GenerativeModel("gemini-1.5-flash", tools=[multiply])
        model.generate_content([question_content, tool_call_content, tool_response_content])

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "GenerativeModel.generate_content"
    assert span.span_type == SpanType.LLM
    assert span.inputs == {
        "content": [str(question_content), str(tool_call_content), str(tool_response_content)]
    }
    assert span.get_attribute("mlflow.chat.tools") == TOOL_ATTRIBUTE


def test_chat_session_autolog():
    with patch("google.generativeai.ChatSession.send_message", new=send_message):
        mlflow.gemini.autolog()
        model = genai.GenerativeModel("gemini-1.5-flash")
        chat = model.start_chat(history=[])
        chat.send_message("test content")

        traces = get_traces()
        assert len(traces) == 1
        assert traces[0].info.status == "OK"
        assert len(traces[0].data.spans) == 1
        span = traces[0].data.spans[0]
        assert span.name == "ChatSession.send_message"
        assert span.span_type == SpanType.CHAT_MODEL
        assert span.inputs == {"content": "test content"}
        assert span.outputs == _GENERATE_CONTENT_RESPONSE

        mlflow.gemini.autolog(disable=True)
        model = genai.GenerativeModel("gemini-1.5-flash")
        chat = model.start_chat(history=[])
        chat.send_message("test content")

        # No new trace should be created
        traces = get_traces()
        assert len(traces) == 1


def test_count_tokens_autolog():
    with patch("google.generativeai.GenerativeModel.count_tokens", new=count_tokens):
        mlflow.gemini.autolog()
        model = genai.GenerativeModel("gemini-1.5-flash")
        model.count_tokens("test content")

        traces = get_traces()
        assert len(traces) == 1
        assert traces[0].info.status == "OK"
        assert len(traces[0].data.spans) == 1
        span = traces[0].data.spans[0]
        assert span.name == "GenerativeModel.count_tokens"
        assert span.span_type == SpanType.LLM
        assert span.inputs == {"contents": "test content"}
        assert span.outputs == _DUMMY_COUNT_TOKENS_RESPONSE

        mlflow.gemini.autolog(disable=True)
        model = genai.GenerativeModel("gemini-1.5-flash")
        model.count_tokens("test content")

        # No new trace should be created
        traces = get_traces()
        assert len(traces) == 1


def test_embed_content_autolog():
    with patch("google.generativeai.embed_content", new=embed_content):
        mlflow.gemini.autolog()
        genai.embed_content(model="models/text-embedding-004", content="Hello World")

        traces = get_traces()
        assert len(traces) == 1
        assert traces[0].info.status == "OK"
        assert len(traces[0].data.spans) == 1
        span = traces[0].data.spans[0]
        assert span.name == "embed_content"
        assert span.span_type == SpanType.EMBEDDING
        assert span.inputs == {"content": "Hello World", "model": "models/text-embedding-004"}
        assert span.outputs == _DUMMY_EMBEDDING_RESPONSE

        mlflow.gemini.autolog(disable=True)
        genai.embed_content(model="models/text-embedding-004", content="Hello World")

        # No new trace should be created
        traces = get_traces()
        assert len(traces) == 1
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/genai/conftest.py

```python
import functools
import os
from unittest import mock

import pytest

import mlflow
from mlflow.entities.assessment import Expectation
from mlflow.entities.document import Document
from mlflow.entities.span import SpanType
from mlflow.genai.scorers.validation import IS_DBX_AGENTS_INSTALLED


@pytest.fixture(autouse=True)
def mock_init_auth():
    def mocked_init_auth(config_instance):
        config_instance.host = "https://databricks.com/"
        config_instance._header_factory = lambda: {}

    with mock.patch("databricks.sdk.config.Config.init_auth", new=mocked_init_auth):
        yield


@pytest.fixture(params=[True, False], ids=["databricks", "oss"])
def is_in_databricks(request):
    if request.param and not IS_DBX_AGENTS_INSTALLED:
        pytest.skip("Skipping Databricks test because `databricks-agents` is not installed.")

    # In CI, we run test twice, once without `databricks-agents` and once with.
    # To be effective, we skip OSS test when running with `databricks-agents`.
    if "GITHUB_ACTIONS" in os.environ:
        if not request.param and IS_DBX_AGENTS_INSTALLED:
            pytest.skip("Skipping OSS test in CI because `databricks-agents` is installed.")

    with (
        mock.patch("mlflow.genai.judges.utils.is_databricks_uri", return_value=request.param),
        mock.patch(
            "mlflow.utils.databricks_utils.is_databricks_default_tracking_uri",
            return_value=request.param,
        ),
    ):
        yield request.param


def databricks_only(func):
    """Decorator that skips test if not in Databricks environment"""

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if not IS_DBX_AGENTS_INSTALLED:
            pytest.skip("Skipping Databricks only test.")

        with mock.patch("mlflow.get_tracking_uri", return_value="databricks"):
            return func(*args, **kwargs)

    return wrapper


@pytest.fixture
def sample_rag_trace():
    @mlflow.trace(name="rag", span_type=SpanType.AGENT)
    def _predict(question):
        # Two retrievers calls
        _retrieve_1(question)
        _retrieve_2(question)
        return "answer"

    @mlflow.trace(span_type=SpanType.RETRIEVER)
    def _retrieve_1(question):
        return [
            Document(
                page_content="content_1",
                metadata={"doc_uri": "url_1"},
            ),
            Document(
                page_content="content_2",
                metadata={"doc_uri": "url_2"},
            ),
        ]

    @mlflow.trace(span_type=SpanType.RETRIEVER)
    def _retrieve_2(question):
        return [Document(page_content="content_3")]

    _predict("query")

    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())

    # Add expectations. Directly append to the trace info because OSS backend doesn't
    # support assessment logging yet.
    trace.info.assessments = [
        Expectation(name="expected_response", value="expected answer"),
        Expectation(name="expected_facts", value=["fact1", "fact2"]),
        Expectation(name="guidelines", value=["write in english"]),
    ]
    return trace
```

--------------------------------------------------------------------------------

````
