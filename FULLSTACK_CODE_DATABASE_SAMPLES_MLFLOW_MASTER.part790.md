---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 790
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 790 of 991)

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

---[FILE: test_trace.py]---
Location: mlflow-master/tests/entities/test_trace.py
Signals: Pydantic

```python
import importlib
import importlib.util
import json
import re
from datetime import datetime
from typing import Any
from unittest import mock

import pytest

import mlflow
import mlflow.tracking.context.default_context
from mlflow.entities import (
    AssessmentSource,
    Feedback,
    SpanType,
    Trace,
    TraceData,
    TraceInfo,
    TraceLocation,
)
from mlflow.entities.assessment import Expectation
from mlflow.entities.trace_state import TraceState
from mlflow.environment_variables import MLFLOW_TRACKING_USERNAME
from mlflow.exceptions import MlflowException
from mlflow.tracing.constant import TRACE_SCHEMA_VERSION_KEY
from mlflow.tracing.utils import TraceJSONEncoder
from mlflow.utils.mlflow_tags import MLFLOW_ARTIFACT_LOCATION
from mlflow.utils.proto_json_utils import (
    milliseconds_to_proto_timestamp,
)

from tests.tracing.helper import (
    V2_TRACE_DICT,
    create_test_trace_info,
    create_test_trace_info_with_uc_table,
)


def _test_model(datetime=datetime.now()):
    class TestModel:
        @mlflow.trace()
        def predict(self, x, y):
            z = x + y
            z = self.add_one(z)
            return z  # noqa: RET504

        @mlflow.trace(
            span_type=SpanType.LLM,
            name="add_one_with_custom_name",
            attributes={
                "delta": 1,
                "metadata": {"foo": "bar"},
                # Test for non-json-serializable input
                "datetime": datetime,
            },
        )
        def add_one(self, z):
            return z + 1

    return TestModel()


def test_json_deserialization(monkeypatch):
    monkeypatch.setattr(mlflow.tracking.context.default_context, "_get_source_name", lambda: "test")
    monkeypatch.setenv(MLFLOW_TRACKING_USERNAME.name, "bob")
    datetime_now = datetime.now()

    model = _test_model(datetime_now)
    model.predict(2, 5)

    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())
    trace_json = trace.to_json()

    trace_json_as_dict = json.loads(trace_json)
    assert trace_json_as_dict == {
        "info": {
            "trace_id": trace.info.request_id,
            "trace_location": {
                "mlflow_experiment": {
                    "experiment_id": "0",
                },
                "type": "MLFLOW_EXPERIMENT",
            },
            "request_time": milliseconds_to_proto_timestamp(trace.info.timestamp_ms),
            "execution_duration_ms": trace.info.execution_time_ms,
            "state": "OK",
            "request_preview": '{"x": 2, "y": 5}',
            "response_preview": "8",
            "trace_metadata": {
                "mlflow.traceInputs": '{"x": 2, "y": 5}',
                "mlflow.traceOutputs": "8",
                "mlflow.source.name": mock.ANY,
                "mlflow.source.type": "LOCAL",
                "mlflow.source.git.branch": mock.ANY,
                "mlflow.source.git.commit": mock.ANY,
                "mlflow.source.git.repoURL": mock.ANY,
                "mlflow.user": mock.ANY,
                "mlflow.trace.sizeBytes": mock.ANY,
                "mlflow.trace.sizeStats": mock.ANY,
                "mlflow.trace_schema.version": "3",
            },
            "tags": {
                "mlflow.traceName": "predict",
                "mlflow.artifactLocation": trace.info.tags[MLFLOW_ARTIFACT_LOCATION],
                "mlflow.trace.spansLocation": mock.ANY,
            },
        },
        "data": {
            "spans": [
                {
                    "name": "predict",
                    "trace_id": mock.ANY,
                    "span_id": mock.ANY,
                    "parent_span_id": None,
                    "start_time_unix_nano": trace.data.spans[0].start_time_ns,
                    "end_time_unix_nano": trace.data.spans[0].end_time_ns,
                    "events": [],
                    "status": {
                        "code": "STATUS_CODE_OK",
                        "message": "",
                    },
                    "attributes": {
                        "mlflow.traceRequestId": json.dumps(trace.info.request_id),
                        "mlflow.spanType": '"UNKNOWN"',
                        "mlflow.spanFunctionName": '"predict"',
                        "mlflow.spanInputs": '{"x": 2, "y": 5}',
                        "mlflow.spanOutputs": "8",
                    },
                },
                {
                    "name": "add_one_with_custom_name",
                    "trace_id": mock.ANY,
                    "span_id": mock.ANY,
                    "parent_span_id": mock.ANY,
                    "start_time_unix_nano": trace.data.spans[1].start_time_ns,
                    "end_time_unix_nano": trace.data.spans[1].end_time_ns,
                    "events": [],
                    "status": {
                        "code": "STATUS_CODE_OK",
                        "message": "",
                    },
                    "attributes": {
                        "mlflow.traceRequestId": json.dumps(trace.info.request_id),
                        "mlflow.spanType": '"LLM"',
                        "mlflow.spanFunctionName": '"add_one"',
                        "mlflow.spanInputs": '{"z": 7}',
                        "mlflow.spanOutputs": "8",
                        "delta": "1",
                        "datetime": json.dumps(str(datetime_now)),
                        "metadata": '{"foo": "bar"}',
                    },
                },
            ],
        },
    }


@pytest.mark.skipif(
    importlib.util.find_spec("pydantic") is None, reason="Pydantic is not installed"
)
def test_trace_serialize_pydantic_model():
    from pydantic import BaseModel

    class MyModel(BaseModel):
        x: int
        y: str

    data = MyModel(x=1, y="foo")
    data_json = json.dumps(data, cls=TraceJSONEncoder)
    assert data_json == '{"x": 1, "y": "foo"}'
    assert json.loads(data_json) == {"x": 1, "y": "foo"}


@pytest.mark.skipif(
    importlib.util.find_spec("langchain") is None, reason="langchain is not installed"
)
def test_trace_serialize_langchain_base_message():
    from langchain_core.messages import BaseMessage

    message = BaseMessage(
        content=[
            {
                "role": "system",
                "content": "Hello, World!",
            },
            {
                "role": "user",
                "content": "Hi!",
            },
        ],
        type="chat",
    )

    message_json = json.dumps(message, cls=TraceJSONEncoder)
    # LangChain message model contains a few more default fields actually. But we
    # only check if the following subset of the expected dictionary is present in
    # the loaded JSON rather than exact equality, because the LangChain BaseModel
    # has been changing frequently and the additional default fields may differ
    # across versions installed on developers' machines.
    expected_dict_subset = {
        "content": [
            {
                "role": "system",
                "content": "Hello, World!",
            },
            {
                "role": "user",
                "content": "Hi!",
            },
        ],
        "type": "chat",
    }
    loaded = json.loads(message_json)
    assert expected_dict_subset.items() <= loaded.items()


def test_trace_to_from_dict_and_json():
    model = _test_model()
    model.predict(2, 5)

    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())

    spans = trace.search_spans(span_type=SpanType.LLM)
    assert len(spans) == 1

    spans = trace.search_spans(name="predict")
    assert len(spans) == 1

    trace_dict = trace.to_dict()
    trace_from_dict = Trace.from_dict(trace_dict)
    trace_json = trace.to_json()
    trace_from_json = Trace.from_json(trace_json)
    for loaded_trace in [trace_from_dict, trace_from_json]:
        assert trace.info == loaded_trace.info
        assert trace.data.request == loaded_trace.data.request
        assert trace.data.response == loaded_trace.data.response
        assert len(trace.data.spans) == len(loaded_trace.data.spans)
        for i in range(len(trace.data.spans)):
            for attr in [
                "name",
                "request_id",
                "span_id",
                "start_time_ns",
                "end_time_ns",
                "parent_id",
                "status",
                "inputs",
                "outputs",
                "_trace_id",
                "attributes",
                "events",
            ]:
                assert getattr(trace.data.spans[i], attr) == getattr(
                    loaded_trace.data.spans[i], attr
                )


def test_trace_pandas_dataframe_columns():
    t = Trace(
        info=create_test_trace_info("a"),
        data=TraceData(),
    )
    assert Trace.pandas_dataframe_columns() == list(t.to_pandas_dataframe_row())

    t = Trace(
        info=create_test_trace_info_with_uc_table("a", "catalog", "schema"),
        data=TraceData(),
    )
    assert Trace.pandas_dataframe_columns() == list(t.to_pandas_dataframe_row())


@pytest.mark.parametrize(
    ("span_type", "name", "expected"),
    [
        (None, None, ["run", "add_one", "add_one", "add_two", "multiply_by_two"]),
        (SpanType.CHAIN, None, ["run"]),
        (None, "add_two", ["add_two"]),
        (None, re.compile(r"add.*"), ["add_one", "add_one", "add_two"]),
        (None, re.compile(r"^add"), ["add_one", "add_one", "add_two"]),
        (None, re.compile(r"_two$"), ["add_two", "multiply_by_two"]),
        (None, re.compile(r".*ONE", re.IGNORECASE), ["add_one", "add_one"]),
        (SpanType.TOOL, "multiply_by_two", ["multiply_by_two"]),
        (SpanType.AGENT, None, []),
        (None, "non_existent", []),
    ],
)
def test_search_spans(span_type, name, expected):
    @mlflow.trace(span_type=SpanType.CHAIN)
    def run(x: int) -> int:
        x = add_one(x)
        x = add_one(x)
        x = add_two(x)
        return multiply_by_two(x)

    @mlflow.trace(span_type=SpanType.TOOL)
    def add_one(x: int) -> int:
        return x + 1

    @mlflow.trace(span_type=SpanType.TOOL)
    def add_two(x: int) -> int:
        return x + 2

    @mlflow.trace(span_type=SpanType.TOOL)
    def multiply_by_two(x: int) -> int:
        return x * 2

    run(2)
    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())

    spans = trace.search_spans(span_type=span_type, name=name)

    assert [span.name for span in spans] == expected


def test_search_spans_raise_for_invalid_param_type():
    @mlflow.trace(span_type=SpanType.CHAIN)
    def run(x: int) -> int:
        return x + 1

    run(2)
    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())

    with pytest.raises(MlflowException, match="Invalid type for 'span_type'"):
        trace.search_spans(span_type=123)

    with pytest.raises(MlflowException, match="Invalid type for 'name'"):
        trace.search_spans(name=123)


def test_from_v2_dict():
    trace = Trace.from_dict(V2_TRACE_DICT)
    assert trace.info.request_id == "58f4e27101304034b15c512b603bf1b2"
    assert trace.info.request_time == 100
    assert trace.info.execution_duration == 200
    assert len(trace.data.spans) == 2

    # Verify that schema version was updated from "2" to current version during V2 to V3 conversion
    assert trace.info.trace_metadata[TRACE_SCHEMA_VERSION_KEY] == "2"

    # Verify that other metadata was preserved
    assert trace.info.trace_metadata["mlflow.traceInputs"] == '{"x": 2, "y": 5}'
    assert trace.info.trace_metadata["mlflow.traceOutputs"] == "8"


def test_request_response_smart_truncation():
    @mlflow.trace
    def f(messages: list[dict[str, Any]]) -> dict[str, Any]:
        return {"choices": [{"message": {"role": "assistant", "content": "Hi!" * 1000}}]}

    # NB: Since MLflow OSS backend still uses v2 tracing schema, the most accurate way to
    # check if the preview is truncated properly is to mock the upload_trace_data call.
    with mock.patch(
        "mlflow.tracing.export.mlflow_v3.TracingClient.start_trace"
    ) as mock_start_trace:
        f([{"role": "user", "content": "Hello!" * 1000}])

    trace_info = mock_start_trace.call_args[0][0]
    assert len(trace_info.request_preview) == 1000
    assert trace_info.request_preview.startswith("Hello!")
    assert len(trace_info.response_preview) == 1000
    assert trace_info.response_preview.startswith("Hi!")


def test_request_response_smart_truncation_non_chat_format():
    # Non-chat request/response will be naively truncated
    @mlflow.trace
    def f(question: str) -> list[str]:
        return ["a" * 5000, "b" * 5000, "c" * 5000]

    with mock.patch(
        "mlflow.tracing.export.mlflow_v3.TracingClient.start_trace"
    ) as mock_start_trace:
        f("start" + "a" * 1000)

    trace_info = mock_start_trace.call_args[0][0]
    assert len(trace_info.request_preview) == 1000
    assert trace_info.request_preview.startswith('{"question": "startaaa')
    assert len(trace_info.response_preview) == 1000
    assert trace_info.response_preview.startswith('["aaaaa')


def test_request_response_custom_truncation():
    @mlflow.trace
    def f(messages: list[dict[str, Any]]) -> dict[str, Any]:
        mlflow.update_current_trace(
            request_preview="custom request preview",
            response_preview="custom response preview",
        )
        return {"choices": [{"message": {"role": "assistant", "content": "Hi!" * 10000}}]}

    with mock.patch(
        "mlflow.tracing.export.mlflow_v3.TracingClient.start_trace"
    ) as mock_start_trace:
        f([{"role": "user", "content": "Hello!" * 10000}])

    trace_info = mock_start_trace.call_args[0][0]
    assert trace_info.request_preview == "custom request preview"
    assert trace_info.response_preview == "custom response preview"


def test_search_assessments():
    assessments = [
        Feedback(
            trace_id="trace_id",
            name="relevance",
            value=False,
            source=AssessmentSource(source_type="HUMAN", source_id="user_1"),
            rationale="The judge is wrong",
            span_id=None,
            overrides="2",
        ),
        Feedback(
            trace_id="trace_id",
            name="relevance",
            value=True,
            source=AssessmentSource(source_type="LLM_JUDGE", source_id="databricks"),
            span_id=None,
            valid=False,
        ),
        Feedback(
            trace_id="trace_id",
            name="relevance",
            value=True,
            source=AssessmentSource(source_type="LLM_JUDGE", source_id="databricks"),
            span_id="123",
        ),
        Expectation(
            trace_id="trace_id",
            name="guidelines",
            value="The response should be concise and to the point.",
            source=AssessmentSource(source_type="LLM_JUDGE", source_id="databricks"),
            span_id="123",
        ),
    ]
    trace_info = TraceInfo(
        trace_id="trace_id",
        client_request_id="client_request_id",
        trace_location=TraceLocation.from_experiment_id("123"),
        request_preview="request",
        response_preview="response",
        request_time=1234567890,
        execution_duration=100,
        assessments=assessments,
        state=TraceState.OK,
    )
    trace = Trace(
        info=trace_info,
        data=TraceData(
            spans=[],
        ),
    )

    assert trace.search_assessments() == [assessments[0], assessments[2], assessments[3]]
    assert trace.search_assessments(all=True) == assessments
    assert trace.search_assessments("relevance") == [assessments[0], assessments[2]]
    assert trace.search_assessments("relevance", all=True) == assessments[:3]
    assert trace.search_assessments(span_id="123") == [assessments[2], assessments[3]]
    assert trace.search_assessments(span_id="123", name="relevance") == [assessments[2]]
    assert trace.search_assessments(type="expectation") == [assessments[3]]


def test_trace_to_and_from_proto():
    @mlflow.trace
    def invoke(x):
        return x + 1

    @mlflow.trace
    def test(x):
        return invoke(x)

    test(1)
    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())
    proto_trace = trace.to_proto()
    assert proto_trace.trace_info.trace_id == trace.info.request_id
    assert proto_trace.trace_info.trace_location == trace.info.trace_location.to_proto()
    assert len(proto_trace.spans) == 2
    assert proto_trace.spans[0].name == "test"
    assert proto_trace.spans[1].name == "invoke"

    trace_from_proto = Trace.from_proto(proto_trace)
    assert trace_from_proto.to_dict() == trace.to_dict()


def test_trace_from_dict_load_old_trace():
    trace_dict = {
        "info": {
            "trace_id": "tr-ee17184669c265ffdcf9299b36f6dccc",
            "trace_location": {
                "type": "MLFLOW_EXPERIMENT",
                "mlflow_experiment": {"experiment_id": "0"},
            },
            "request_time": "2025-10-22T04:14:54.524Z",
            "state": "OK",
            "trace_metadata": {
                "mlflow.trace_schema.version": "3",
                "mlflow.traceInputs": '"abc"',
                "mlflow.source.type": "LOCAL",
                "mlflow.source.git.branch": "branch-3.4",
                "mlflow.source.name": "a.py",
                "mlflow.source.git.commit": "78d075062b120597050bf2b3839a426feea5ea4c",
                "mlflow.user": "serena.ruan",
                "mlflow.traceOutputs": '"def"',
                "mlflow.source.git.repoURL": "git@github.com:mlflow/mlflow.git",
                "mlflow.trace.sizeBytes": "1226",
            },
            "tags": {
                "mlflow.artifactLocation": "mlflow-artifacts:/0/traces",
                "mlflow.traceName": "test",
            },
            "request_preview": '"abc"',
            "response_preview": '"def"',
            "execution_duration_ms": 60,
        },
        "data": {
            "spans": [
                {
                    "trace_id": "7hcYRmnCZf/c+SmbNvbczA==",
                    "span_id": "3ElmHER9IVU=",
                    "trace_state": "",
                    "parent_span_id": "",
                    "name": "test",
                    "start_time_unix_nano": 1761106494524157000,
                    "end_time_unix_nano": 1761106494584860000,
                    "attributes": {
                        "mlflow.spanOutputs": '"def"',
                        "mlflow.spanType": '"UNKNOWN"',
                        "mlflow.spanInputs": '"abc"',
                        "mlflow.traceRequestId": '"tr-ee17184669c265ffdcf9299b36f6dccc"',
                        "test": '"test"',
                    },
                    "status": {"message": "", "code": "STATUS_CODE_OK"},
                }
            ]
        },
    }
    trace = Trace.from_dict(trace_dict)
    assert trace.info.trace_id == "tr-ee17184669c265ffdcf9299b36f6dccc"
    assert trace.info.request_time == 1761106494524
    assert trace.info.execution_duration == 60
    assert trace.info.trace_location == TraceLocation.from_experiment_id("0")
    assert len(trace.data.spans) == 1
    assert trace.data.spans[0].name == "test"
    assert trace.data.spans[0].inputs == "abc"
    assert trace.data.spans[0].outputs == "def"
    assert trace.data.spans[0].start_time_ns == 1761106494524157000
    assert trace.data.spans[0].end_time_ns == 1761106494584860000
```

--------------------------------------------------------------------------------

---[FILE: test_trace_data.py]---
Location: mlflow-master/tests/entities/test_trace_data.py

```python
import json
from unittest import mock

import pytest

import mlflow
from mlflow.entities import SpanType, TraceData
from mlflow.entities.span_event import SpanEvent


def test_json_deserialization():
    class TestModel:
        @mlflow.trace()
        def predict(self, x, y):
            z = x + y

            with mlflow.start_span(name="with_ok_event") as span:
                span.add_event(SpanEvent(name="ok_event", attributes={"foo": "bar"}))

            self.always_fail()
            return z

        @mlflow.trace(span_type=SpanType.LLM, name="always_fail_name", attributes={"delta": 1})
        def always_fail(self):
            raise Exception("Error!")

    model = TestModel()

    # Verify the exception is not absorbed by the context manager
    with pytest.raises(Exception, match="Error!"):
        model.predict(2, 5)

    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())
    trace_data = trace.data

    # Compare events separately as it includes exception stacktrace which is hard to hardcode
    trace_data_dict = trace_data.to_dict()
    span_to_events = {span["name"]: span.get("events") for span in trace_data_dict["spans"]}

    assert trace_data_dict == {
        "spans": [
            {
                "name": "predict",
                "trace_id": mock.ANY,
                "span_id": mock.ANY,
                "parent_span_id": None,
                "start_time_unix_nano": trace.data.spans[0].start_time_ns,
                "end_time_unix_nano": trace.data.spans[0].end_time_ns,
                "status": {
                    "code": "STATUS_CODE_ERROR",
                    "message": "Exception: Error!",
                },
                "attributes": {
                    "mlflow.traceRequestId": json.dumps(trace.info.trace_id),
                    "mlflow.spanType": '"UNKNOWN"',
                    "mlflow.spanFunctionName": '"predict"',
                    "mlflow.spanInputs": '{"x": 2, "y": 5}',
                },
                "events": [
                    {
                        "name": "exception",
                        "time_unix_nano": trace.data.spans[0].events[0].timestamp,
                        "attributes": {
                            "exception.message": "Error!",
                            "exception.type": "Exception",
                            "exception.stacktrace": mock.ANY,
                            "exception.escaped": "False",
                        },
                    }
                ],
            },
            {
                "name": "with_ok_event",
                "trace_id": mock.ANY,
                "span_id": mock.ANY,
                "parent_span_id": mock.ANY,
                "start_time_unix_nano": trace.data.spans[1].start_time_ns,
                "end_time_unix_nano": trace.data.spans[1].end_time_ns,
                "status": {
                    "code": "STATUS_CODE_OK",
                    "message": "",
                },
                "attributes": {
                    "mlflow.traceRequestId": json.dumps(trace.info.trace_id),
                    "mlflow.spanType": '"UNKNOWN"',
                },
                "events": [
                    {
                        "name": "ok_event",
                        "time_unix_nano": trace.data.spans[1].events[0].timestamp,
                        "attributes": {"foo": "bar"},
                    }
                ],
            },
            {
                "name": "always_fail_name",
                "trace_id": mock.ANY,
                "span_id": mock.ANY,
                "parent_span_id": mock.ANY,
                "start_time_unix_nano": trace.data.spans[2].start_time_ns,
                "end_time_unix_nano": trace.data.spans[2].end_time_ns,
                "status": {
                    "code": "STATUS_CODE_ERROR",
                    "message": "Exception: Error!",
                },
                "attributes": {
                    "delta": "1",
                    "mlflow.traceRequestId": json.dumps(trace.info.trace_id),
                    "mlflow.spanType": '"LLM"',
                    "mlflow.spanFunctionName": '"always_fail"',
                    "mlflow.spanInputs": "{}",
                },
                "events": [
                    {
                        "name": "exception",
                        "time_unix_nano": trace.data.spans[2].events[0].timestamp,
                        "attributes": {
                            "exception.message": "Error!",
                            "exception.type": "Exception",
                            "exception.stacktrace": mock.ANY,
                            "exception.escaped": "False",
                        },
                    }
                ],
            },
        ],
    }

    ok_events = span_to_events["with_ok_event"]
    assert len(ok_events) == 1
    assert ok_events[0]["name"] == "ok_event"
    assert ok_events[0]["attributes"] == {"foo": "bar"}

    error_events = span_to_events["always_fail_name"]
    assert len(error_events) == 1
    assert error_events[0]["name"] == "exception"
    assert error_events[0]["attributes"]["exception.message"] == "Error!"
    assert error_events[0]["attributes"]["exception.type"] == "Exception"
    assert error_events[0]["attributes"]["exception.stacktrace"] is not None

    parent_events = span_to_events["predict"]
    assert len(parent_events) == 1
    assert parent_events[0]["name"] == "exception"
    assert parent_events[0]["attributes"]["exception.message"] == "Error!"
    assert parent_events[0]["attributes"]["exception.type"] == "Exception"
    # Parent span includes exception event bubbled up from the child span, hence the
    # stack trace includes the function call
    assert "self.always_fail()" in parent_events[0]["attributes"]["exception.stacktrace"]

    # Convert back from dict to TraceData and compare
    trace_data_from_dict = TraceData.from_dict(trace_data_dict)
    assert trace_data.to_dict() == trace_data_from_dict.to_dict()


def test_intermediate_outputs_from_attribute():
    intermediate_outputs = {
        "retrieved_documents": ["document 1", "document 2"],
        "generative_prompt": "prompt",
    }

    def run():
        with mlflow.start_span(name="run") as span:
            span.set_attribute("mlflow.trace.intermediate_outputs", intermediate_outputs)

    run()
    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())

    assert trace.data.intermediate_outputs == intermediate_outputs


def test_intermediate_outputs_from_spans():
    @mlflow.trace()
    def retrieved_documents():
        return ["document 1", "document 2"]

    @mlflow.trace()
    def llm(i):
        return f"Hi, this is LLM {i}"

    @mlflow.trace()
    def predict():
        retrieved_documents()
        llm(1)
        llm(2)

    predict()
    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())

    assert trace.data.intermediate_outputs == {
        "retrieved_documents": ["document 1", "document 2"],
        "llm_1": "Hi, this is LLM 1",
        "llm_2": "Hi, this is LLM 2",
    }


def test_intermediate_outputs_no_value():
    def run():
        with mlflow.start_span(name="run") as span:
            span.set_outputs(1)

    run()
    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())

    assert trace.data.intermediate_outputs is None


def test_to_dict():
    with mlflow.start_span():
        pass
    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())
    trace_dict = trace.data.to_dict()
    assert len(trace_dict["spans"]) == 1
    # Ensure the legacy properties are not present
    assert "request" not in trace_dict
    assert "response" not in trace_dict


def test_request_and_response_are_still_available():
    with mlflow.start_span() as s:
        s.set_inputs("foo")
        s.set_outputs("bar")

    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())
    trace_data = trace.data
    assert trace_data.request == '"foo"'
    assert trace_data.response == '"bar"'

    with mlflow.start_span():
        pass

    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())
    trace_data = trace.data
    assert trace_data.request is None
    assert trace_data.response is None
```

--------------------------------------------------------------------------------

````
