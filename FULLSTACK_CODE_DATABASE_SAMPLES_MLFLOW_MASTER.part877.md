---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 877
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 877 of 991)

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

---[FILE: test_chat_model.py]---
Location: mlflow-master/tests/pyfunc/test_chat_model.py

```python
import json
import pathlib
import pickle
import uuid
from dataclasses import asdict

import pytest

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.models.model import Model
from mlflow.models.signature import ModelSignature
from mlflow.models.utils import load_serving_example
from mlflow.pyfunc.loaders.chat_model import _ChatModelPyfuncWrapper
from mlflow.tracing.constant import TraceTagKey
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.types.llm import (
    CHAT_MODEL_INPUT_SCHEMA,
    CHAT_MODEL_OUTPUT_SCHEMA,
    ChatChoice,
    ChatChoiceDelta,
    ChatChunkChoice,
    ChatCompletionChunk,
    ChatCompletionResponse,
    ChatMessage,
    ChatParams,
    FunctionToolCallArguments,
    FunctionToolDefinition,
    ToolParamsSchema,
)
from mlflow.types.schema import ColSpec, DataType, Schema

from tests.helper_functions import (
    expect_status_code,
    pyfunc_serve_and_score_model,
)
from tests.tracing.helper import get_traces

# `None`s (`max_tokens` and `stop`) are excluded
DEFAULT_PARAMS = {
    "temperature": 1.0,
    "n": 1,
    "stream": False,
}


def get_mock_streaming_response(message, is_last_chunk=False):
    if is_last_chunk:
        return {
            "id": "123",
            "model": "MyChatModel",
            "choices": [
                {
                    "index": 0,
                    "delta": {
                        "role": None,
                        "content": None,
                    },
                    "finish_reason": "stop",
                }
            ],
            "usage": {
                "prompt_tokens": 10,
                "completion_tokens": 10,
                "total_tokens": 20,
            },
        }
    else:
        return {
            "id": "123",
            "model": "MyChatModel",
            "choices": [
                {
                    "index": 0,
                    "delta": {
                        "role": "assistant",
                        "content": message,
                    },
                    "finish_reason": "stop",
                }
            ],
            "usage": {
                "prompt_tokens": 10,
                "completion_tokens": 10,
                "total_tokens": 20,
            },
        }


def get_mock_response(messages, params):
    return {
        "id": "123",
        "model": "MyChatModel",
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": json.dumps([m.to_dict() for m in messages]),
                },
                "finish_reason": "stop",
            },
            {
                "index": 1,
                "message": {
                    "role": "user",
                    "content": json.dumps(params.to_dict()),
                },
                "finish_reason": "stop",
            },
        ],
        "usage": {
            "prompt_tokens": 10,
            "completion_tokens": 10,
            "total_tokens": 20,
        },
    }


class SimpleChatModel(mlflow.pyfunc.ChatModel):
    def predict(
        self, context, messages: list[ChatMessage], params: ChatParams
    ) -> ChatCompletionResponse:
        mock_response = get_mock_response(messages, params)
        return ChatCompletionResponse.from_dict(mock_response)

    def predict_stream(self, context, messages: list[ChatMessage], params: ChatParams):
        num_chunks = 10
        for i in range(num_chunks):
            mock_response = get_mock_streaming_response(
                f"message {i}", is_last_chunk=(i == num_chunks - 1)
            )
            yield ChatCompletionChunk.from_dict(mock_response)


class ChatModelWithContext(mlflow.pyfunc.ChatModel):
    def load_context(self, context):
        predict_path = pathlib.Path(context.artifacts["predict_fn"])
        self.predict_fn = pickle.loads(predict_path.read_bytes())

    def predict(
        self, context, messages: list[ChatMessage], params: ChatParams
    ) -> ChatCompletionResponse:
        message = ChatMessage(role="assistant", content=self.predict_fn())
        return ChatCompletionResponse.from_dict(get_mock_response([message], params))


class ChatModelWithTrace(mlflow.pyfunc.ChatModel):
    @mlflow.trace
    def predict(
        self, context, messages: list[ChatMessage], params: ChatParams
    ) -> ChatCompletionResponse:
        mock_response = get_mock_response(messages, params)
        return ChatCompletionResponse.from_dict(mock_response)


class ChatModelWithMetadata(mlflow.pyfunc.ChatModel):
    def predict(
        self, context, messages: list[ChatMessage], params: ChatParams
    ) -> ChatCompletionResponse:
        mock_response = get_mock_response(messages, params)
        return ChatCompletionResponse(
            **mock_response,
            custom_outputs=params.custom_inputs,
        )


class ChatModelWithToolCalling(mlflow.pyfunc.ChatModel):
    def predict(
        self, context, messages: list[ChatMessage], params: ChatParams
    ) -> ChatCompletionResponse:
        tools = params.tools

        # call the first tool with some value for all the required params
        tool_name = tools[0].function.name
        tool_params = tools[0].function.parameters
        arguments = {}
        for param in tool_params.required:
            param_type = tool_params.properties[param].type
            if param_type == "string":
                arguments[param] = "some_value"
            elif param_type == "number":
                arguments[param] = 123
            elif param_type == "boolean":
                arguments[param] = True
            else:
                # keep the test example simple
                raise ValueError(f"Unsupported param type: {param_type}")

        tool_call = FunctionToolCallArguments(
            name=tool_name,
            arguments=json.dumps(arguments),
        ).to_tool_call(id=uuid.uuid4().hex)

        tool_message = ChatMessage(
            role="assistant",
            tool_calls=[tool_call],
        )

        return ChatCompletionResponse(choices=[ChatChoice(index=0, message=tool_message)])


def test_chat_model_save_load(tmp_path):
    model = SimpleChatModel()
    mlflow.pyfunc.save_model(python_model=model, path=tmp_path)

    loaded_model = mlflow.pyfunc.load_model(tmp_path)
    assert isinstance(loaded_model._model_impl, _ChatModelPyfuncWrapper)
    input_schema = loaded_model.metadata.get_input_schema()
    output_schema = loaded_model.metadata.get_output_schema()
    assert input_schema == CHAT_MODEL_INPUT_SCHEMA
    assert output_schema == CHAT_MODEL_OUTPUT_SCHEMA


def test_chat_model_with_trace(tmp_path):
    model = ChatModelWithTrace()
    mlflow.pyfunc.save_model(python_model=model, path=tmp_path)

    # predict() call during saving chat model should not generate a trace
    assert len(get_traces()) == 0

    loaded_model = mlflow.pyfunc.load_model(tmp_path)
    messages = [
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello!"},
    ]
    loaded_model.predict({"messages": messages})

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.tags[TraceTagKey.TRACE_NAME] == "predict"
    request = json.loads(traces[0].data.request)
    assert request["messages"] == [asdict(ChatMessage.from_dict(msg)) for msg in messages]


def test_chat_model_save_throws_with_signature(tmp_path):
    model = SimpleChatModel()

    with pytest.raises(MlflowException, match="Please remove the `signature` parameter"):
        mlflow.pyfunc.save_model(
            python_model=model,
            path=tmp_path,
            signature=ModelSignature(
                Schema([ColSpec(name="test", type=DataType.string)]),
                Schema([ColSpec(name="test", type=DataType.string)]),
            ),
        )


def mock_predict():
    return "hello"


def test_chat_model_with_context_saves_successfully(tmp_path):
    model_path = tmp_path / "model"
    predict_path = tmp_path / "predict.pkl"
    predict_path.write_bytes(pickle.dumps(mock_predict))

    model = ChatModelWithContext()
    mlflow.pyfunc.save_model(
        python_model=model,
        path=model_path,
        artifacts={"predict_fn": str(predict_path)},
    )

    loaded_model = mlflow.pyfunc.load_model(model_path)
    messages = [{"role": "user", "content": "test"}]

    response = loaded_model.predict({"messages": messages})
    expected_response = json.dumps([{"role": "assistant", "content": "hello"}])
    assert response["choices"][0]["message"]["content"] == expected_response


@pytest.mark.parametrize(
    "ret",
    [
        "not a ChatCompletionResponse",
        {"dict": "with", "bad": "keys"},
        {
            "id": "1",
            "created": 1,
            "model": "m",
            "choices": [{"bad": "choice"}],
            "usage": {
                "prompt_tokens": 10,
                "completion_tokens": 10,
                "total_tokens": 20,
            },
        },
    ],
)
def test_save_throws_on_invalid_output(tmp_path, ret):
    class BadChatModel(mlflow.pyfunc.ChatModel):
        def predict(self, context, messages, params) -> ChatCompletionResponse:
            return ret

    model = BadChatModel()
    with pytest.raises(
        MlflowException,
        match=(
            "Failed to save ChatModel. Please ensure that the model's "
            r"predict\(\) method returns a ChatCompletionResponse object"
        ),
    ):
        mlflow.pyfunc.save_model(python_model=model, path=tmp_path)


# test that we can predict with the model
def test_chat_model_predict(tmp_path):
    model = SimpleChatModel()
    mlflow.pyfunc.save_model(python_model=model, path=tmp_path)

    loaded_model = mlflow.pyfunc.load_model(tmp_path)
    messages = [
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello!"},
    ]

    response = loaded_model.predict({"messages": messages})
    assert response["choices"][0]["message"]["content"] == json.dumps(messages)
    assert json.loads(response["choices"][1]["message"]["content"]) == DEFAULT_PARAMS

    # override all params
    params_override = {
        "temperature": 0.5,
        "max_tokens": 10,
        "stop": ["\n"],
        "n": 2,
        "stream": True,
        "top_p": 0.1,
        "top_k": 20,
        "frequency_penalty": 0.5,
        "presence_penalty": -0.5,
    }
    response = loaded_model.predict({"messages": messages, **params_override})
    assert response["choices"][0]["message"]["content"] == json.dumps(messages)
    assert json.loads(response["choices"][1]["message"]["content"]) == params_override

    # override a subset of params
    params_subset = {
        "max_tokens": 100,
    }
    response = loaded_model.predict({"messages": messages, **params_subset})
    assert response["choices"][0]["message"]["content"] == json.dumps(messages)
    assert json.loads(response["choices"][1]["message"]["content"]) == {
        **DEFAULT_PARAMS,
        **params_subset,
    }


def test_chat_model_works_in_serving():
    model = SimpleChatModel()
    messages = [
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello!"},
    ]
    params_subset = {
        "max_tokens": 100,
    }
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model",
            python_model=model,
            input_example=(messages, params_subset),
        )

    inference_payload = load_serving_example(model_info.model_uri)
    response = pyfunc_serve_and_score_model(
        model_uri=model_info.model_uri,
        data=inference_payload,
        content_type="application/json",
        extra_args=["--env-manager", "local"],
    )

    expect_status_code(response, 200)
    choices = json.loads(response.content)["choices"]
    assert choices[0]["message"]["content"] == json.dumps(messages)
    assert json.loads(choices[1]["message"]["content"]) == {
        **DEFAULT_PARAMS,
        **params_subset,
    }


def test_chat_model_works_with_infer_signature_input_example(tmp_path):
    model = SimpleChatModel()
    params_subset = {
        "max_tokens": 100,
    }
    input_example = {
        "messages": [
            {
                "role": "user",
                "content": "What is Retrieval-augmented Generation?",
            }
        ],
        **params_subset,
    }
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model", python_model=model, input_example=input_example
        )
    assert model_info.signature.inputs == CHAT_MODEL_INPUT_SCHEMA
    assert model_info.signature.outputs == CHAT_MODEL_OUTPUT_SCHEMA
    mlflow_model = Model.load(model_info.model_uri)
    local_path = _download_artifact_from_uri(model_info.model_uri)
    assert mlflow_model.load_input_example(local_path) == {
        "messages": input_example["messages"],
        **params_subset,
    }

    inference_payload = load_serving_example(model_info.model_uri)
    response = pyfunc_serve_and_score_model(
        model_uri=model_info.model_uri,
        data=inference_payload,
        content_type="application/json",
        extra_args=["--env-manager", "local"],
    )

    expect_status_code(response, 200)
    choices = json.loads(response.content)["choices"]
    assert choices[0]["message"]["content"] == json.dumps(input_example["messages"])
    assert json.loads(choices[1]["message"]["content"]) == {
        **DEFAULT_PARAMS,
        **params_subset,
    }


def test_chat_model_logs_default_metadata_task(tmp_path):
    model = SimpleChatModel()
    params_subset = {
        "max_tokens": 100,
    }
    input_example = {
        "messages": [
            {
                "role": "user",
                "content": "What is Retrieval-augmented Generation?",
            }
        ],
        **params_subset,
    }
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model", python_model=model, input_example=input_example
        )
    assert model_info.signature.inputs == CHAT_MODEL_INPUT_SCHEMA
    assert model_info.signature.outputs == CHAT_MODEL_OUTPUT_SCHEMA
    assert model_info.metadata["task"] == "agent/v1/chat"

    with mlflow.start_run():
        model_info_with_override = mlflow.pyfunc.log_model(
            name="model", python_model=model, input_example=input_example, metadata={"task": None}
        )
    assert model_info_with_override.metadata["task"] is None


def test_chat_model_works_with_chat_message_input_example(tmp_path):
    model = SimpleChatModel()
    input_example = [
        ChatMessage(role="user", content="What is Retrieval-augmented Generation?", name="chat")
    ]
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model", python_model=model, input_example=input_example
        )
    assert model_info.signature.inputs == CHAT_MODEL_INPUT_SCHEMA
    assert model_info.signature.outputs == CHAT_MODEL_OUTPUT_SCHEMA
    mlflow_model = Model.load(model_info.model_uri)
    local_path = _download_artifact_from_uri(model_info.model_uri)
    assert mlflow_model.load_input_example(local_path) == {
        "messages": [message.to_dict() for message in input_example],
    }

    inference_payload = load_serving_example(model_info.model_uri)
    response = pyfunc_serve_and_score_model(
        model_uri=model_info.model_uri,
        data=inference_payload,
        content_type="application/json",
        extra_args=["--env-manager", "local"],
    )

    expect_status_code(response, 200)
    choices = json.loads(response.content)["choices"]
    assert choices[0]["message"]["content"] == json.dumps(json.loads(inference_payload)["messages"])


def test_chat_model_works_with_infer_signature_multi_input_example(tmp_path):
    model = SimpleChatModel()
    params_subset = {
        "max_tokens": 100,
    }
    input_example = {
        "messages": [
            {
                "role": "assistant",
                "content": "You are in helpful assistant!",
            },
            {
                "role": "user",
                "content": "What is Retrieval-augmented Generation?",
            },
        ],
        **params_subset,
    }
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model", python_model=model, input_example=input_example
        )
    assert model_info.signature.inputs == CHAT_MODEL_INPUT_SCHEMA
    assert model_info.signature.outputs == CHAT_MODEL_OUTPUT_SCHEMA
    mlflow_model = Model.load(model_info.model_uri)
    local_path = _download_artifact_from_uri(model_info.model_uri)
    assert mlflow_model.load_input_example(local_path) == {
        "messages": input_example["messages"],
        **params_subset,
    }

    inference_payload = load_serving_example(model_info.model_uri)
    response = pyfunc_serve_and_score_model(
        model_uri=model_info.model_uri,
        data=inference_payload,
        content_type="application/json",
        extra_args=["--env-manager", "local"],
    )

    expect_status_code(response, 200)
    choices = json.loads(response.content)["choices"]
    assert choices[0]["message"]["content"] == json.dumps(input_example["messages"])
    assert json.loads(choices[1]["message"]["content"]) == {
        **DEFAULT_PARAMS,
        **params_subset,
    }


def test_chat_model_predict_stream(tmp_path):
    model = SimpleChatModel()
    mlflow.pyfunc.save_model(python_model=model, path=tmp_path)

    loaded_model = mlflow.pyfunc.load_model(tmp_path)
    messages = [
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello!"},
    ]

    responses = list(loaded_model.predict_stream({"messages": messages}))
    for i, resp in enumerate(responses[:-1]):
        assert resp["choices"][0]["delta"]["content"] == f"message {i}"

    assert responses[-1]["choices"][0]["delta"] == {}


def test_chat_model_can_receive_and_return_metadata():
    messages = [{"role": "user", "content": "Hello!"}]
    params = {
        "custom_inputs": {"image_url": "example", "detail": "high", "other_dict": {"key": "value"}},
    }
    input_example = {
        "messages": messages,
        **params,
    }

    model = ChatModelWithMetadata()
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model",
            python_model=model,
            input_example=input_example,
        )

    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)

    # test that it works for normal pyfunc predict
    response = loaded_model.predict({"messages": messages, **params})
    assert response["custom_outputs"] == params["custom_inputs"]

    # test that it works in serving
    inference_payload = load_serving_example(model_info.model_uri)
    response = pyfunc_serve_and_score_model(
        model_uri=model_info.model_uri,
        data=inference_payload,
        content_type="application/json",
        extra_args=["--env-manager", "local"],
    )

    serving_response = json.loads(response.content)
    assert serving_response["custom_outputs"] == params["custom_inputs"]


def test_chat_model_can_use_tool_calls():
    messages = [{"role": "user", "content": "What's the weather?"}]

    weather_tool = (
        FunctionToolDefinition(
            name="get_weather",
            description="Get the weather for your current location",
            parameters=ToolParamsSchema(
                {
                    "city": {
                        "type": "string",
                        "description": "The city to get the weather for",
                    },
                    "unit": {"type": "string", "enum": ["F", "C"]},
                },
                required=["city", "unit"],
            ),
        )
        .to_tool_definition()
        .to_dict()
    )

    example = {
        "messages": messages,
        "tools": [weather_tool],
    }

    model = ChatModelWithToolCalling()
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model",
            python_model=model,
            input_example=example,
        )

    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)
    response = loaded_model.predict(example)

    model_tool_calls = response["choices"][0]["message"]["tool_calls"]
    assert json.loads(model_tool_calls[0]["function"]["arguments"]) == {
        "city": "some_value",
        "unit": "some_value",
    }


def test_chat_model_without_context_in_predict():
    response = ChatCompletionResponse(
        choices=[ChatChoice(message=ChatMessage(role="assistant", content="hi"))]
    )
    chunk_response = ChatCompletionChunk(
        choices=[ChatChunkChoice(delta=ChatChoiceDelta(role="assistant", content="hi"))]
    )

    class Model(mlflow.pyfunc.ChatModel):
        def predict(self, messages: list[ChatMessage], params: ChatParams):
            return response

        def predict_stream(self, messages: list[ChatMessage], params: ChatParams):
            yield chunk_response

    model = Model()
    messages = [ChatMessage(role="user", content="hello?", name="chat")]
    assert model.predict(messages, ChatParams()) == response
    assert next(iter(model.predict_stream(messages, ChatParams()))) == chunk_response

    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model", python_model=model, input_example=messages
        )
    pyfunc_model = mlflow.pyfunc.load_model(model_info.model_uri)
    input_data = {"messages": [{"role": "user", "content": "hello"}]}
    assert pyfunc_model.predict(input_data) == response.to_dict()
    assert next(iter(pyfunc_model.predict_stream(input_data))) == chunk_response.to_dict()
```

--------------------------------------------------------------------------------

---[FILE: test_chat_model_validation.py]---
Location: mlflow-master/tests/pyfunc/test_chat_model_validation.py

```python
import pytest

from mlflow.types.llm import (
    ChatChoice,
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatMessage,
    TokenUsageStats,
)

MOCK_RESPONSE = {
    "id": "123",
    "object": "chat.completion",
    "created": 1677652288,
    "model": "MyChatModel",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "hello",
            },
            "finish_reason": "stop",
        },
        {
            "index": 1,
            "message": {
                "role": "user",
                "content": "world",
            },
            "finish_reason": "stop",
        },
    ],
    "usage": {
        "prompt_tokens": 10,
        "completion_tokens": 10,
        "total_tokens": 20,
    },
}

MOCK_OPENAI_CHAT_COMPLETION_RESPONSE = {
    "id": "chatcmpl-123",
    "object": "chat.completion",
    "created": 1702685778,
    "model": "gpt-4o-mini",
    "choices": [
        {
            "index": 0,
            "message": {"role": "assistant", "content": "Hello! How can I assist you today?"},
            "logprobs": {
                "content": [
                    {
                        "token": "Hello",
                        "logprob": -0.31725305,
                        "bytes": [72, 101, 108, 108, 111],
                        "top_logprobs": [
                            {
                                "token": "Hello",
                                "logprob": -0.31725305,
                                "bytes": [72, 101, 108, 108, 111],
                            },
                            {"token": "Hi", "logprob": -1.3190403, "bytes": [72, 105]},
                        ],
                    },
                    {
                        "token": "!",
                        "logprob": -0.02380986,
                        "bytes": None,
                        "top_logprobs": [
                            {"token": "!", "logprob": -0.02380986, "bytes": [33]},
                            {
                                "token": " there",
                                "logprob": -3.787621,
                                "bytes": None,
                            },
                        ],
                    },
                ]
            },
            "finish_reason": "stop",
        },
        {
            "index": 1,
            "message": {"role": "user", "content": "I need help with my computer."},
            "logprobs": None,
            "finish_reason": "stop",
        },
        {
            "index": 2,
            "message": {"role": "assistant", "content": "Sure! What seems to be the problem?"},
            "logprobs": {
                "content": None,
            },
            "finish_reason": "stop",
        },
    ],
    "usage": {"prompt_tokens": 9, "completion_tokens": 9, "total_tokens": 18},
}


MOCK_OPENAI_CHAT_REFUSAL_RESPONSE = {
    "id": "chatcmpl-123",
    "object": "chat.completion",
    "created": 1721596428,
    "model": "gpt-4o-mini",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "refusal": "I'm sorry, I cannot assist with that request.",
            },
            "logprobs": None,
            "finish_reason": "stop",
        }
    ],
    "usage": {"prompt_tokens": 81, "completion_tokens": 11, "total_tokens": 92},
}


@pytest.mark.parametrize(
    ("data", "error", "match"),
    [
        ({"content": "hello"}, TypeError, "required positional argument"),  # missing required field
        (
            {"role": "user", "content": "hello", "name": 1},
            ValueError,
            "`name` must be of type str",
        ),  # field of wrong type
        (
            {"role": "user", "refusal": "I can't answer that.", "content": "hi"},
            ValueError,
            "Both `content` and `refusal` cannot be set",
        ),  # conflicting schema
        (
            {"role": "user", "name": "name"},
            ValueError,
            "`content` is required",
        ),  # missing one-of required field
    ],
)
def test_chat_message_throws_on_invalid_data(data, error, match):
    with pytest.raises(error, match=match):
        ChatMessage.from_dict(data)


@pytest.mark.parametrize(
    "data",
    [
        {"role": "user", "content": "hello"},
        {"role": "user", "content": "hello", "name": "world"},
    ],
)
def test_chat_message_succeeds_on_valid_data(data):
    assert ChatMessage.from_dict(data).to_dict() == data


@pytest.mark.parametrize(
    ("data", "match"),
    [
        ({"messages": "not a list"}, "`messages` must be a list"),
        (
            {"messages": ["not a dict"]},
            "Items in `messages` must all have the same type: ChatMessage or dict",
        ),
        (
            {
                "messages": [
                    {"role": "user", "content": "not all the same"},
                    ChatMessage.from_dict({"role": "user", "content": "hello"}),
                ]
            },
            "Items in `messages` must all have the same type: ChatMessage or dict",
        ),
    ],
)
def test_list_validation_throws_on_invalid_lists(data, match):
    with pytest.raises(ValueError, match=match):
        ChatCompletionRequest.from_dict(data)


@pytest.mark.parametrize(
    "sample_output",
    [MOCK_RESPONSE, MOCK_OPENAI_CHAT_COMPLETION_RESPONSE, MOCK_OPENAI_CHAT_REFUSAL_RESPONSE],
)
def test_dataclass_constructs_nested_types_from_dict(sample_output):
    response = ChatCompletionResponse.from_dict(sample_output)
    assert isinstance(response.usage, TokenUsageStats)
    assert isinstance(response.choices[0], ChatChoice)
    assert isinstance(response.choices[0].message, ChatMessage)


@pytest.mark.parametrize(
    "sample_output",
    [MOCK_RESPONSE, MOCK_OPENAI_CHAT_COMPLETION_RESPONSE, MOCK_OPENAI_CHAT_REFUSAL_RESPONSE],
)
def test_to_dict_converts_nested_dataclasses(sample_output):
    response = ChatCompletionResponse.from_dict(sample_output).to_dict()
    assert isinstance(response["choices"][0], dict)
    assert isinstance(response["usage"], dict)
    assert isinstance(response["choices"][0]["message"], dict)


def test_to_dict_excludes_nones():
    response = ChatCompletionResponse.from_dict(MOCK_RESPONSE).to_dict()
    assert "name" not in response["choices"][0]["message"]


def test_chat_response_defaults():
    tokens = TokenUsageStats()
    message = ChatMessage("user", "Hello")
    choice = ChatChoice(message)
    response = ChatCompletionResponse([choice], tokens)

    assert response.usage.prompt_tokens is None
    assert response.usage.completion_tokens is None
    assert response.usage.total_tokens is None
    assert response.model is None
    assert response.id is None
    assert response.choices[0].finish_reason == "stop"


@pytest.mark.parametrize(
    ("custom_inputs", "match"),
    [
        (1, r"Expected `custom_inputs` to be a dictionary, received `int`"),
        ({1: "example"}, r"received key of type `int` \(key: 1\)"),
    ],
)
def test_chat_request_custom_inputs_must_be_valid_map(custom_inputs, match):
    message = ChatMessage("user", "Hello")
    with pytest.raises(ValueError, match=match):
        ChatCompletionRequest(messages=[message], custom_inputs=custom_inputs)


@pytest.mark.parametrize(
    ("cls", "data", "match"),
    [
        (
            ChatChoice,
            {"index": 0, "message": 123},
            "Expected `message` to be either an instance of `ChatMessage` or a dict",
        ),
        (
            ChatCompletionResponse,
            {"choices": [], "usage": 123},
            "Expected `usage` to be either an instance of `TokenUsageStats` or a dict",
        ),
    ],
)
def test_convert_dataclass_throws_on_invalid_data(cls, data, match):
    with pytest.raises(ValueError, match=match):
        cls.from_dict(data)


@pytest.mark.parametrize(
    ("cls", "data"),
    [
        (ChatMessage, {"role": "user", "content": "hello", "extra": "field"}),
        (
            TokenUsageStats,
            {
                "completion_tokens": 10,
                "prompt_tokens": 57,
                "total_tokens": 67,
                # this field is not in the TokenUsageStats schema
                "completion_tokens_details": {"reasoning_tokens": 0},
            },
        ),
    ],
)
def test_from_dict_ignores_extra_fields(cls, data):
    assert isinstance(cls.from_dict(data), cls)
```

--------------------------------------------------------------------------------

---[FILE: test_context.py]---
Location: mlflow-master/tests/pyfunc/test_context.py

```python
import random
import time
from threading import Thread

import pytest

import mlflow
from mlflow.pyfunc.context import (
    Context,
    get_prediction_context,
    set_prediction_context,
)


def test_prediction_context_thread_safe():
    def set_context(context):
        with set_prediction_context(context):
            time.sleep(0.2 * random.random())
            assert get_prediction_context() == context
            context.update(is_evaluate=not context.is_evaluate)
            assert get_prediction_context() == context

    threads = []
    for i in range(10):
        context = Context(request_id=f"request_{i}", is_evaluate=random.choice([True, False]))
        thread = Thread(target=set_context, args=(context,))
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()

    assert get_prediction_context() is None


def test_set_prediction_context_raise_on_invalid_context():
    with pytest.raises(TypeError, match="Expected context to be an instance of Context"):
        with set_prediction_context("invalid"):
            pass


def test_prediction_context_pyfunc_predict():
    class MyModel(mlflow.pyfunc.PythonModel):
        def predict(self, model_inputs):
            context = get_prediction_context()
            return context.request_id

        def predict_stream(self, model_inputs):
            for _ in range(3):
                context = get_prediction_context()
                yield context.request_id

    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(name="model", python_model=MyModel())
    pyfunc_model = mlflow.pyfunc.load_model(model_info.model_uri)

    with set_prediction_context(Context(request_id="request_1")):
        assert pyfunc_model.predict(None) == "request_1"

    with set_prediction_context(Context(request_id="request_2")):
        generator = pyfunc_model.predict_stream(None)

    # When a prediction context is set for predict_stream call, it should also
    # be effective during the iteration of the generator.
    for output in generator:
        assert output == "request_2"
```

--------------------------------------------------------------------------------

---[FILE: test_dependencies_functions.py]---
Location: mlflow-master/tests/pyfunc/test_dependencies_functions.py

```python
from pathlib import Path
from unittest import mock

import pytest
import sklearn
from sklearn.linear_model import LinearRegression

import mlflow.utils.requirements_utils
from mlflow.exceptions import MlflowException
from mlflow.pyfunc import get_model_dependencies
from mlflow.utils import PYTHON_VERSION


def test_get_model_dependencies_read_req_file(tmp_path):
    req_file = tmp_path / "requirements.txt"
    req_file_content = """
mlflow
cloudpickle==2.0.0
scikit-learn==1.0.2"""
    req_file.write_text(req_file_content)

    model_path = str(tmp_path)

    # Test getting pip dependencies
    assert Path(get_model_dependencies(model_path, format="pip")).read_text() == req_file_content

    # Test getting pip dependencies will print instructions
    with mock.patch("mlflow.pyfunc._logger.info") as mock_log_info:
        get_model_dependencies(model_path, format="pip")
        mock_log_info.assert_called_once_with(
            "To install the dependencies that were used to train the model, run the "
            f"following command: 'pip install -r {req_file}'."
        )

        mock_log_info.reset_mock()
        with mock.patch("mlflow.pyfunc._is_in_ipython_notebook", return_value=True):
            get_model_dependencies(model_path, format="pip")
            mock_log_info.assert_called_once_with(
                "To install the dependencies that were used to train the model, run the "
                f"following command: '%pip install -r {req_file}'."
            )

    with pytest.raises(MlflowException, match="Illegal format argument 'abc'"):
        get_model_dependencies(model_path, format="abc")


@pytest.mark.parametrize(
    "ml_model_file_content",
    [
        """
artifact_path: model
flavors:
  python_function:
    env: conda.yaml
    loader_module: mlflow.sklearn
    model_path: model.pkl
    python_version: {PYTHON_VERSION}
model_uuid: 722a374a432f48f09ee85da92df13bca
run_id: 765e66a5ba404650be51cb02cda66f35
""",
        f"""
artifact_path: model
flavors:
  python_function:
    env:
      conda: conda.yaml
      virtualenv: python_env.yaml
    loader_module: mlflow.sklearn
    model_path: model.pkl
    python_version: {PYTHON_VERSION}
model_uuid: 722a374a432f48f09ee85da92df13bca
run_id: 765e66a5ba404650be51cb02cda66f35
""",
    ],
    ids=["old_env", "new_env"],
)
def test_get_model_dependencies_read_conda_file(ml_model_file_content, tmp_path):
    MLmodel_file = tmp_path / "MLmodel"
    MLmodel_file.write_text(ml_model_file_content)
    conda_yml_file = tmp_path / "conda.yaml"
    conda_yml_file_content = f"""
channels:
- conda-forge
dependencies:
- python={PYTHON_VERSION}
- pip=22.0.3
- scikit-learn=0.22.0
- tensorflow=2.0.0
- pip:
  - mlflow
  - cloudpickle==2.0.0
  - scikit-learn==1.0.1
name: mlflow-env
"""

    conda_yml_file.write_text(conda_yml_file_content)

    model_path = str(tmp_path)

    # Test getting conda environment
    assert (
        Path(get_model_dependencies(model_path, format="conda")).read_text()
        == conda_yml_file_content
    )

    # Test getting pip requirement file failed and fallback to extract pip section from conda.yaml
    with mock.patch("mlflow.pyfunc._logger.warning") as mock_warning:
        pip_file_path = get_model_dependencies(model_path, format="pip")
        assert (
            Path(pip_file_path).read_text().strip()
            == "mlflow\ncloudpickle==2.0.0\nscikit-learn==1.0.1"
        )
        mock_warning.assert_called_once_with(
            "The following conda dependencies have been excluded from the environment file: "
            f"python={PYTHON_VERSION}, pip=22.0.3, scikit-learn=0.22.0, tensorflow=2.0.0."
        )

    conda_yml_file.write_text(
        f"""
channels:
- conda-forge
dependencies:
- python={PYTHON_VERSION}
- pip=22.0.3
- scikit-learn=0.22.0
- tensorflow=2.0.0
"""
    )

    with pytest.raises(MlflowException, match="No pip section found in conda.yaml file"):
        get_model_dependencies(model_path, format="pip")


def test_get_model_dependencies_with_model_version_uri():
    with mlflow.start_run():
        mlflow.sklearn.log_model(LinearRegression(), name="model", registered_model_name="linear")

    deps = get_model_dependencies("models:/linear/1", format="pip")
    assert f"scikit-learn=={sklearn.__version__}" in Path(deps).read_text()
```

--------------------------------------------------------------------------------

````
