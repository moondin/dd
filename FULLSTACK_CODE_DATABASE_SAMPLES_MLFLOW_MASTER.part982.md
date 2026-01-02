---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 982
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 982 of 991)

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

---[FILE: test_promptlab_utils.py]---
Location: mlflow-master/tests/utils/test_promptlab_utils.py

```python
import json
import os

import pytest

from mlflow.entities.param import Param
from mlflow.entities.run_status import RunStatus
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.tracking.file_store import FileStore
from mlflow.utils.promptlab_utils import (
    _create_promptlab_run_impl,
    create_eval_results_json,
)

prompt_parameters = [
    Param(key="question", value="my_question"),
    Param(key="context", value="my_context"),
]
model_input = "answer this question: my_question using the following context: my_context"
model_output = "my_answer"
model_output_parameters = [
    Param(key="tokens", value="10"),
    Param(key="latency", value="100"),
]


def test_eval_results_file():
    eval_results_file = create_eval_results_json(
        prompt_parameters, model_input, model_output_parameters, model_output
    )
    expected_eval_results_json = {
        "columns": ["question", "context", "prompt", "output", "tokens", "latency"],
        "data": [
            [
                "my_question",
                "my_context",
                "answer this question: my_question using the following context: my_context",
                "my_answer",
                "10",
                "100",
            ]
        ],
    }
    assert json.loads(eval_results_file) == expected_eval_results_json


@pytest.fixture
def store(tmp_path):
    return FileStore(str(tmp_path.joinpath("mlruns")))


@pytest.mark.skipif(
    "MLFLOW_SKINNY" in os.environ,
    reason="Skinny does not support the np or pandas dependencies",
)
def test_create_promptlab_run(store):
    exp_id = store.create_experiment("test_create_promptlab_run")
    run = _create_promptlab_run_impl(
        store,
        experiment_id=exp_id,
        run_name="my_promptlab_run",
        tags=[],
        prompt_template="my_prompt_template",
        prompt_parameters=[Param("prompt_param_key", "prompt_param_value")],
        model_route="my_route",
        model_parameters=[Param("temperature", "0.1")],
        model_input="",
        model_output_parameters=[Param("output_param_key", "output_param_value")],
        model_output="my_output",
        mlflow_version="1.0.0",
        user_id="user",
        start_time=1,
    )
    assert run.info.run_id is not None
    assert run.info.status == RunStatus.to_string(RunStatus.FINISHED)

    assert run.data.params["prompt_template"] == "my_prompt_template"
    assert run.data.params["model_route"] == "my_route"
    assert run.data.params["temperature"] == "0.1"

    assert run.data.tags["mlflow.runName"] == "my_promptlab_run"
    assert (
        run.data.tags["mlflow.loggedArtifacts"]
        == '[{"path": "eval_results_table.json", "type": "table"}]'
    )
    assert run.data.tags["mlflow.runSourceType"] == "PROMPT_ENGINEERING"
    assert run.data.tags["mlflow.log-model.history"] is not None

    # list the files in the model folder
    artifact_location = run.info.artifact_uri
    artifact_repo = get_artifact_repository(artifact_location)

    artifact_files = [f.path for f in artifact_repo.list_artifacts()]
    assert "eval_results_table.json" in artifact_files
    assert "model" in artifact_files

    model_files = [f.path for f in artifact_repo.list_artifacts("model")]
    assert "model/MLmodel" in model_files
    assert "model/python_env.yaml" in model_files
    assert "model/conda.yaml" in model_files
    assert "model/requirements.txt" in model_files
    assert "model/input_example.json" in model_files

    # try to load the model
    import mlflow.pyfunc

    mlflow.pyfunc.load_model(f"{artifact_location}/model")
```

--------------------------------------------------------------------------------

---[FILE: test_proto_json_utils.py]---
Location: mlflow-master/tests/utils/test_proto_json_utils.py

```python
import base64
import datetime
import json

import numpy as np
import pandas as pd
import pytest
from google.protobuf.text_format import Parse as ParseTextIntoProto

from mlflow.entities import Experiment, Metric
from mlflow.entities.model_registry import ModelVersion, RegisteredModel
from mlflow.exceptions import MlflowException
from mlflow.protos.model_registry_pb2 import RegisteredModel as ProtoRegisteredModel
from mlflow.protos.service_pb2 import Experiment as ProtoExperiment
from mlflow.protos.service_pb2 import Metric as ProtoMetric
from mlflow.types import ColSpec, DataType, Schema, TensorSpec
from mlflow.types.schema import Array, Map, Object, Property
from mlflow.types.utils import _infer_schema
from mlflow.utils.proto_json_utils import (
    MlflowFailedTypeConversion,
    _CustomJsonEncoder,
    _stringify_all_experiment_ids,
    cast_df_types_according_to_schema,
    dataframe_from_parsed_json,
    dataframe_from_raw_json,
    message_to_json,
    parse_dict,
    parse_tf_serving_input,
)

from tests.protos.test_message_pb2 import SampleMessage


def test_message_to_json():
    json_out = message_to_json(Experiment("123", "name", "arty", "active").to_proto())
    assert json.loads(json_out) == {
        "experiment_id": "123",
        "name": "name",
        "artifact_location": "arty",
        "lifecycle_stage": "active",
    }

    original_proto_message = RegisteredModel(
        name="model_1",
        creation_timestamp=111,
        last_updated_timestamp=222,
        description="Test model",
        latest_versions=[
            ModelVersion(
                name="mv-1",
                version="1",
                creation_timestamp=333,
                last_updated_timestamp=444,
                description="v 1",
                user_id="u1",
                current_stage="Production",
                source="A/B",
                run_id="9245c6ce1e2d475b82af84b0d36b52f4",
                status="READY",
                status_message=None,
            ),
            ModelVersion(
                name="mv-2",
                version="2",
                creation_timestamp=555,
                last_updated_timestamp=666,
                description="v 2",
                user_id="u2",
                current_stage="Staging",
                source="A/C",
                run_id="123",
                status="READY",
                status_message=None,
            ),
        ],
    ).to_proto()
    json_out = message_to_json(original_proto_message)
    json_dict = json.loads(json_out)
    assert json_dict == {
        "name": "model_1",
        "creation_timestamp": 111,
        "last_updated_timestamp": 222,
        "description": "Test model",
        "latest_versions": [
            {
                "name": "mv-1",
                "version": "1",
                "creation_timestamp": 333,
                "last_updated_timestamp": 444,
                "current_stage": "Production",
                "description": "v 1",
                "user_id": "u1",
                "source": "A/B",
                "run_id": "9245c6ce1e2d475b82af84b0d36b52f4",
                "status": "READY",
            },
            {
                "name": "mv-2",
                "version": "2",
                "creation_timestamp": 555,
                "last_updated_timestamp": 666,
                "current_stage": "Staging",
                "description": "v 2",
                "user_id": "u2",
                "source": "A/C",
                "run_id": "123",
                "status": "READY",
            },
        ],
    }
    new_proto_message = ProtoRegisteredModel()
    parse_dict(json_dict, new_proto_message)
    assert original_proto_message == new_proto_message

    test_message = ParseTextIntoProto(
        """
        field_int32: 11
        field_int64: 12
        field_uint32: 13
        field_uint64: 14
        field_sint32: 15
        field_sint64: 16
        field_fixed32: 17
        field_fixed64: 18
        field_sfixed32: 19
        field_sfixed64: 20
        field_bool: true
        field_string: "Im a string"
        field_with_default1: 111
        field_repeated_int64: [1, 2, 3]
        field_enum: ENUM_VALUE1
        field_inner_message {
            field_inner_int64: 101
            field_inner_repeated_int64: [102, 103]
        }
        field_inner_message {
            field_inner_int64: 104
            field_inner_repeated_int64: [105, 106]
        }
        oneof1: 207
        [mlflow.ExtensionMessage.field_extended_int64]: 100
        field_map1: [{key: 51 value: "52"}, {key: 53 value: "54"}]
        field_map2: [{key: "61" value: 62}, {key: "63" value: 64}]
        field_map3: [{key: 561 value: 562}, {key: 563 value: 564}]
        field_map4: [{key: 71
                      value: {field_inner_int64: 72
                              field_inner_repeated_int64: [81, 82]
                              field_inner_string: "str1"}},
                     {key: 73
                      value: {field_inner_int64: 74
                              field_inner_repeated_int64: 83
                              field_inner_string: "str2"}}]
    """,
        SampleMessage(),
    )
    json_out = message_to_json(test_message)
    json_dict = json.loads(json_out)
    assert json_dict == {
        "field_int32": 11,
        "field_int64": 12,
        "field_uint32": 13,
        "field_uint64": 14,
        "field_sint32": 15,
        "field_sint64": 16,
        "field_fixed32": 17,
        "field_fixed64": 18,
        "field_sfixed32": 19,
        "field_sfixed64": 20,
        "field_bool": True,
        "field_string": "Im a string",
        "field_with_default1": 111,
        "field_repeated_int64": [1, 2, 3],
        "field_enum": "ENUM_VALUE1",
        "field_inner_message": [
            {"field_inner_int64": 101, "field_inner_repeated_int64": [102, 103]},
            {"field_inner_int64": 104, "field_inner_repeated_int64": [105, 106]},
        ],
        "oneof1": 207,
        # JSON doesn't support non-string keys, so the int keys will be converted to strings.
        "field_map1": {"51": "52", "53": "54"},
        "field_map2": {"63": 64, "61": 62},
        "field_map3": {"561": 562, "563": 564},
        "field_map4": {
            "73": {
                "field_inner_int64": 74,
                "field_inner_repeated_int64": [83],
                "field_inner_string": "str2",
            },
            "71": {
                "field_inner_int64": 72,
                "field_inner_repeated_int64": [81, 82],
                "field_inner_string": "str1",
            },
        },
        "[mlflow.ExtensionMessage.field_extended_int64]": "100",
    }
    new_test_message = SampleMessage()
    parse_dict(json_dict, new_test_message)
    assert new_test_message == test_message


def test_parse_dict():
    in_json = {"experiment_id": "123", "name": "name", "unknown": "field"}
    message = ProtoExperiment()
    parse_dict(in_json, message)
    experiment = Experiment.from_proto(message)
    assert experiment.experiment_id == "123"
    assert experiment.name == "name"
    assert experiment.artifact_location == ""


def test_parse_dict_int_as_string_backcompat():
    in_json = {"timestamp": "123"}
    message = ProtoMetric()
    parse_dict(in_json, message)
    experiment = Metric.from_proto(message)
    assert experiment.timestamp == 123


def test_parse_legacy_experiment():
    in_json = {"experiment_id": 123, "name": "name", "unknown": "field"}
    message = ProtoExperiment()
    parse_dict(in_json, message)
    experiment = Experiment.from_proto(message)
    assert experiment.experiment_id == "123"
    assert experiment.name == "name"
    assert experiment.artifact_location == ""


def test_back_compat():
    in_json = {
        "experiment_id": 123,
        "name": "name",
        "unknown": "field",
        "experiment_ids": [1, 2, 3, 4, 5],
        "things": {
            "experiment_id": 4,
            "more_things": {"experiment_id": 7, "experiment_ids": [2, 3, 4, 5]},
        },
    }

    _stringify_all_experiment_ids(in_json)
    exp_json = {
        "experiment_id": "123",
        "name": "name",
        "unknown": "field",
        "experiment_ids": ["1", "2", "3", "4", "5"],
        "things": {
            "experiment_id": "4",
            "more_things": {"experiment_id": "7", "experiment_ids": ["2", "3", "4", "5"]},
        },
    }
    assert exp_json == in_json


def assert_result(result, expected_result):
    assert result.keys() == expected_result.keys()
    for key in result:
        assert (result[key] == expected_result[key]).all()
        assert result[key].dtype == expected_result[key].dtype


def test_parse_tf_serving_dictionary():
    # instances are correctly aggregated to dict of input name -> tensor
    tfserving_input = {
        "instances": [
            {"a": "s1", "b": 1.1, "c": [1, 2, 3]},
            {"a": "s2", "b": 2.2, "c": [4, 5, 6]},
            {"a": "s3", "b": 3.3, "c": [7, 8, 9]},
        ]
    }
    # Without Schema
    result = parse_tf_serving_input(tfserving_input)
    expected_result_no_schema = {
        "a": np.array(["s1", "s2", "s3"]),
        "b": np.array([1.1, 2.2, 3.3]),
        "c": np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
    }
    assert_result(result, expected_result_no_schema)

    # With schema
    schema = Schema(
        [
            TensorSpec(np.dtype("str"), [-1], "a"),
            TensorSpec(np.dtype("float32"), [-1], "b"),
            TensorSpec(np.dtype("int32"), [-1], "c"),
        ]
    )
    df_schema = Schema([ColSpec("string", "a"), ColSpec("float", "b"), ColSpec("integer", "c")])
    result = parse_tf_serving_input(tfserving_input, schema)
    expected_result_schema = {
        "a": np.array(["s1", "s2", "s3"], dtype=np.dtype("str")),
        "b": np.array([1.1, 2.2, 3.3], dtype="float32"),
        "c": np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]], dtype="int32"),
    }
    assert_result(result, expected_result_schema)
    # With df Schema
    result = parse_tf_serving_input(tfserving_input, df_schema)
    assert_result(result, expected_result_schema)
    # With df Schema containing array
    new_schema = _infer_schema(tfserving_input["instances"])
    result = parse_tf_serving_input(tfserving_input, new_schema)
    expected_result = {
        "a": np.array(["s1", "s2", "s3"]),
        "b": np.array([1.1, 2.2, 3.3], dtype="float64"),
        "c": np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]], dtype="int64"),
    }
    assert_result(result, expected_result)

    # input provided as a dict
    tfserving_input = {
        "inputs": {
            "a": ["s1", "s2", "s3"],
            "b": [1.1, 2.2, 3.3],
            "c": [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
        }
    }
    # Without Schema
    result = parse_tf_serving_input(tfserving_input)
    assert_result(result, expected_result_no_schema)

    # With Schema
    result = parse_tf_serving_input(tfserving_input, schema)
    assert_result(result, expected_result_schema)

    # With df Schema
    result = parse_tf_serving_input(tfserving_input, df_schema)
    assert_result(result, expected_result_schema)


def test_parse_tf_serving_arbitrary_input_dictionary():
    # input provided as a columnar dict with an arbitrary shape for each input, specifically a
    # different 0th dimension.
    tfserving_input_arbitrary = {
        "inputs": {
            "a": [["s1", "s2", "s3"], ["s4", "s5", "s6"]],  # [2, 3]
            "b": [1.1, 2.2, 3.3],  # [3,  ]
            "c": [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12], [13, 14, 15]],  # [4, 3]
        }
    }

    schema = Schema(
        [
            TensorSpec(np.dtype("str"), [-1, 3], "a"),
            TensorSpec(np.dtype("float32"), [-1], "b"),
            TensorSpec(np.dtype("int32"), [-1, 4], "c"),
        ]
    )
    df_schema = Schema([ColSpec("string", "a"), ColSpec("float", "b"), ColSpec("integer", "c")])

    expected_result_no_schema_arbitrary = {
        "a": np.array([["s1", "s2", "s3"], ["s4", "s5", "s6"]]),
        "b": np.array([1.1, 2.2, 3.3]),
        "c": np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12], [13, 14, 15]]),
    }
    expected_result_schema_arbitrary = {
        "a": np.array([["s1", "s2", "s3"], ["s4", "s5", "s6"]], dtype=np.dtype("str")),
        "b": np.array([1.1, 2.2, 3.3], dtype="float32"),
        "c": np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12], [13, 14, 15]], dtype="int32"),
    }

    # Without Schema
    result = parse_tf_serving_input(tfserving_input_arbitrary)
    assert_result(result, expected_result_no_schema_arbitrary)

    # With Schema
    result = parse_tf_serving_input(tfserving_input_arbitrary, schema)
    assert_result(result, expected_result_schema_arbitrary)

    # With df Schema
    result = parse_tf_serving_input(tfserving_input_arbitrary, df_schema)
    assert_result(result, expected_result_schema_arbitrary)


def test_parse_tf_serving_single_array():
    def assert_result(result, expected_result):
        assert (result == expected_result).all()

    # values for each column are properly converted to a tensor
    arr = [
        [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
        [[3, 2, 1], [6, 5, 4], [9, 8, 7]],
    ]
    tfserving_instances = {"instances": arr}
    tfserving_inputs = {"inputs": arr}

    # Without schema
    instance_result = parse_tf_serving_input(tfserving_instances)
    assert instance_result.shape == (2, 3, 3)
    assert_result(instance_result, np.array(arr, dtype="int64"))

    input_result = parse_tf_serving_input(tfserving_inputs)
    assert input_result.shape == (2, 3, 3)
    assert_result(input_result, np.array(arr, dtype="int64"))

    # Unnamed schema
    schema = Schema([TensorSpec(np.dtype("float32"), [-1])])
    instance_result = parse_tf_serving_input(tfserving_instances, schema)
    assert_result(instance_result, np.array(arr, dtype="float32"))

    input_result = parse_tf_serving_input(tfserving_inputs, schema)
    assert_result(input_result, np.array(arr, dtype="float32"))

    # named schema
    schema = Schema([TensorSpec(np.dtype("float32"), [-1], "a")])
    instance_result = parse_tf_serving_input(tfserving_instances, schema)
    assert isinstance(instance_result, dict)
    assert len(instance_result.keys()) == 1
    assert "a" in instance_result
    assert_result(instance_result["a"], np.array(arr, dtype="float32"))

    input_result = parse_tf_serving_input(tfserving_inputs, schema)
    assert isinstance(input_result, dict)
    assert len(input_result.keys()) == 1
    assert "a" in input_result
    assert_result(input_result["a"], np.array(arr, dtype="float32"))


def test_parse_tf_serving_raises_expected_errors():
    # input is bad if a column value is missing for a row/instance
    tfserving_instances = {
        "instances": [
            {"a": "s1", "b": 1},
            {"a": "s2", "b": 2, "c": [4, 5, 6]},
            {"a": "s3", "b": 3, "c": [7, 8, 9]},
        ]
    }
    with pytest.raises(
        MlflowException, match="The length of values for each input/column name are not the same"
    ):
        parse_tf_serving_input(tfserving_instances)

    # cannot specify both instance and inputs
    tfserving_input = {
        "instances": [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
        "inputs": {"a": ["s1", "s2", "s3"], "b": [1, 2, 3], "c": [[1, 2, 3], [4, 5, 6], [7, 8, 9]]},
    }
    match = 'Invalid input. One of "instances" and "inputs" must be specified'
    with pytest.raises(MlflowException, match=match):
        parse_tf_serving_input(tfserving_input)

    # cannot specify signature name
    tfserving_input = {
        "signature_name": "hello",
        "inputs": {"a": ["s1", "s2", "s3"], "b": [1, 2, 3], "c": [[1, 2, 3], [4, 5, 6], [7, 8, 9]]},
    }
    match = '"signature_name" parameter is currently not supported'
    with pytest.raises(MlflowException, match=match):
        parse_tf_serving_input(tfserving_input)


def test_dataframe_from_json():
    source = pd.DataFrame(
        {
            "boolean": [True, False, True],
            "string": ["a", "b", "c"],
            "float": np.array([1.2, 2.3, 3.4], dtype=np.float32),
            "double": np.array([1.2, 2.3, 3.4], dtype=np.float64),
            "integer": np.array([3, 4, 5], dtype=np.int32),
            "long": np.array([3, 4, 5], dtype=np.int64),
            "binary": [bytes([1, 2, 3]), bytes([4, 5]), bytes([6])],
            "date_string": ["2018-02-03", "1996-03-02", "2021-03-05"],
        },
        columns=[
            "boolean",
            "string",
            "float",
            "double",
            "integer",
            "long",
            "binary",
            "date_string",
        ],
    )

    jsonable_df = pd.DataFrame(source, copy=True)
    jsonable_df["binary"] = jsonable_df["binary"].map(base64.b64encode)
    schema = Schema(
        [
            ColSpec("boolean", "boolean"),
            ColSpec("string", "string"),
            ColSpec("float", "float"),
            ColSpec("double", "double"),
            ColSpec("integer", "integer"),
            ColSpec("long", "long"),
            ColSpec("binary", "binary"),
            ColSpec("string", "date_string"),
        ]
    )
    parsed = dataframe_from_raw_json(
        jsonable_df.to_json(orient="split"), pandas_orient="split", schema=schema
    )
    pd.testing.assert_frame_equal(parsed, source)
    parsed = dataframe_from_raw_json(
        jsonable_df.to_json(orient="records"), pandas_orient="records", schema=schema
    )
    pd.testing.assert_frame_equal(parsed, source)
    # try parsing with tensor schema
    tensor_schema = Schema(
        [
            TensorSpec(np.dtype("bool"), [-1], "boolean"),
            TensorSpec(np.dtype("str"), [-1], "string"),
            TensorSpec(np.dtype("float32"), [-1], "float"),
            TensorSpec(np.dtype("float64"), [-1], "double"),
            TensorSpec(np.dtype("int32"), [-1], "integer"),
            TensorSpec(np.dtype("int64"), [-1], "long"),
            TensorSpec(np.dtype(bytes), [-1], "binary"),
        ]
    )
    parsed = dataframe_from_raw_json(
        jsonable_df.to_json(orient="split"), pandas_orient="split", schema=tensor_schema
    )

    # NB: tensor schema does not automatically decode base64 encoded bytes.
    pd.testing.assert_frame_equal(parsed, jsonable_df)
    parsed = dataframe_from_raw_json(
        jsonable_df.to_json(orient="records"), pandas_orient="records", schema=tensor_schema
    )

    # NB: tensor schema does not automatically decode base64 encoded bytes.
    pd.testing.assert_frame_equal(parsed, jsonable_df)

    # Test parse with TensorSchema with a single tensor
    tensor_schema = Schema([TensorSpec(np.dtype("float32"), [-1, 3])])
    source = pd.DataFrame(
        {
            "a": np.array([1, 2, 3], dtype=np.float32),
            "b": np.array([4.1, 5.2, 6.3], dtype=np.float32),
            "c": np.array([7, 8, 9], dtype=np.float32),
        },
        columns=["a", "b", "c"],
    )
    pd.testing.assert_frame_equal(
        source,
        dataframe_from_raw_json(
            source.to_json(orient="split"), pandas_orient="split", schema=tensor_schema
        ),
    )
    pd.testing.assert_frame_equal(
        source,
        dataframe_from_raw_json(
            source.to_json(orient="records"), pandas_orient="records", schema=tensor_schema
        ),
    )

    schema = Schema([ColSpec("datetime", "datetime")])
    parsed = dataframe_from_raw_json(
        """
[
    {"datetime": "2022-01-01T00:00:00"},
    {"datetime": "2022-01-02T03:04:05"}
]
    """,
        pandas_orient="records",
        schema=schema,
    )
    expected = pd.DataFrame(
        {
            "datetime": [
                pd.Timestamp("2022-01-01T00:00:00"),
                pd.Timestamp("2022-01-02T03:04:05"),
            ]
        },
    )
    pd.testing.assert_frame_equal(parsed, expected)


@pytest.mark.parametrize(
    ("dt", "expected"),
    [
        (datetime.datetime(2022, 1, 1), '"2022-01-01T00:00:00"'),
        (datetime.datetime(2022, 1, 2, 3, 4, 5), '"2022-01-02T03:04:05"'),
        (datetime.date(2022, 1, 1), '"2022-01-01"'),
        (datetime.time(0, 0, 0), '"00:00:00"'),
        (pd.Timestamp(2022, 1, 1), '"2022-01-01T00:00:00"'),
    ],
)
def test_datetime_encoder(dt, expected):
    assert json.dumps(dt, cls=_CustomJsonEncoder) == expected


@pytest.mark.parametrize(
    ("dataframe", "schema", "expected"),
    [
        (
            pd.DataFrame(columns=["foo"], data=[1, 2, 3]),
            Schema([TensorSpec(np.dtype("float64"), [-1], "foo")]),
            np.dtype("float64"),
        ),
        (
            pd.DataFrame(columns=["foo"], data=[[[1, 2, 3]], [[4, 5, 6]]]),
            Schema([TensorSpec(np.dtype("float64"), [-1, 1], "foo")]),
            np.dtype("object"),
        ),
        (
            pd.DataFrame(index=[1, 2, 3], columns=["foo"], data=[1, 2, 3]),
            Schema([TensorSpec(np.dtype("float64"), [-1], "foo")]),
            np.dtype("float64"),
        ),
        (
            pd.DataFrame(columns=["foo"], data=[1, 2, 3]),
            Schema([ColSpec("double", "foo")]),
            np.dtype("float64"),
        ),
    ],
)
def test_cast_df_types_according_to_schema_success(dataframe, schema, expected):
    casted_pdf = cast_df_types_according_to_schema(dataframe, schema)
    assert casted_pdf["foo"].dtype == expected


@pytest.mark.parametrize(
    ("dataframe", "schema", "error_message"),
    [
        (
            pd.DataFrame(columns=["foo"], data=[1, 2, 3]),
            Schema([ColSpec("binary", "foo")]),
            r"TypeError\('encoding without a string argument'\)",
        ),
        (
            pd.DataFrame(columns=["foo"], data=["a", "b", "c"]),
            Schema([ColSpec("double", "foo")]),
            r'ValueError\("could not convert string to float: \'a\'"\)',
        ),
    ],
)
def test_cast_df_types_according_to_schema_error_message(dataframe, schema, error_message):
    with pytest.raises(MlflowFailedTypeConversion, match=error_message):
        cast_df_types_according_to_schema(dataframe, schema)


@pytest.mark.parametrize(
    ("data", "schema", "instances_data"),
    [
        ({"query": "sentence"}, Schema([ColSpec(DataType.string, name="query")]), None),
        (
            {"query": ["sentence_1", "sentence_2"]},
            Schema([ColSpec(Array(DataType.string), name="query")]),
            None,
        ),
        (
            {"query": ["sentence_1", "sentence_2"], "table": "some_table"},
            Schema(
                [
                    ColSpec(Array(DataType.string), name="query"),
                    ColSpec(DataType.string, name="table"),
                ]
            ),
            None,
        ),
        (
            {"query": [{"name": "value", "age": 10}, {"name": "value"}], "table": ["some_table"]},
            Schema(
                [
                    ColSpec(
                        Array(
                            Object(
                                [
                                    Property("name", DataType.string),
                                    Property("age", DataType.long, required=False),
                                ]
                            )
                        ),
                        name="query",
                    ),
                    ColSpec(Array(DataType.string), name="table"),
                ]
            ),
            None,
        ),
        (
            [{"query": "sentence"}, {"query": "sentence"}],
            Schema([ColSpec(DataType.string, name="query")]),
            {"query": ["sentence", "sentence"]},
        ),
        (
            [
                {"query": ["sentence_1", "sentence_2"], "table": "some_table"},
                {"query": ["sentence_1", "sentence_2"]},
            ],
            Schema(
                [
                    ColSpec(Array(DataType.string), name="query"),
                    ColSpec(DataType.string, name="table", required=False),
                ]
            ),
            {
                "query": [["sentence_1", "sentence_2"], ["sentence_1", "sentence_2"]],
                "table": ["some_table"],
            },
        ),
        (
            [
                {"query": {"a": "sentence_1", "b": "sentence_2"}, "table": "some_table"},
                {"query": {"a": "sentence_1"}, "table": "some_table"},
            ],
            Schema(
                [
                    ColSpec(
                        Object(
                            [
                                Property("a", DataType.string),
                                Property("b", DataType.string, required=False),
                            ]
                        ),
                        name="query",
                    ),
                    ColSpec(DataType.string, name="table"),
                ]
            ),
            {
                "query": [{"a": "sentence_1", "b": "sentence_2"}, {"a": "sentence_1"}],
                "table": ["some_table", "some_table"],
            },
        ),
        (
            {
                "query": [{"name": "value", "age": "10"}, {"name": "value"}],
                "table": {"k": "some_table"},
                "data": {"k1": ["a", "b"], "k2": ["c"]},
            },
            Schema(
                [
                    ColSpec(
                        Array(Map(value_type=DataType.string)),
                        name="query",
                    ),
                    ColSpec(Map(value_type=DataType.string), name="table"),
                    ColSpec(Map(value_type=Array(DataType.string)), name="data"),
                ]
            ),
            None,
        ),
    ],
)
def test_parse_tf_serving_input_for_dictionaries_and_lists_and_maps(data, schema, instances_data):
    np.testing.assert_equal(parse_tf_serving_input({"inputs": data}, schema), data)
    if instances_data is None:
        np.testing.assert_equal(parse_tf_serving_input({"instances": data}, schema), data)
    else:
        np.testing.assert_equal(parse_tf_serving_input({"instances": data}, schema), instances_data)
    df = pd.DataFrame(data) if isinstance(data, list) else pd.DataFrame([data])
    df_split = df.to_dict(orient="split")
    pd.testing.assert_frame_equal(dataframe_from_parsed_json(df_split, "split", schema), df)
    df_records = df.to_dict(orient="records")
    pd.testing.assert_frame_equal(dataframe_from_parsed_json(df_records, "records", schema), df)
```

--------------------------------------------------------------------------------

---[FILE: test_python_env.py]---
Location: mlflow-master/tests/utils/test_python_env.py

```python
from unittest import mock

import pytest

from mlflow.utils import PYTHON_VERSION
from mlflow.utils.environment import _PythonEnv


def test_constructor_argument_validation():
    with pytest.raises(TypeError, match="`python` must be a string"):
        _PythonEnv(python=1)

    with pytest.raises(TypeError, match="`build_dependencies` must be a list"):
        _PythonEnv(build_dependencies=0)

    with pytest.raises(TypeError, match="`dependencies` must be a list"):
        _PythonEnv(dependencies=0)


def test_to_yaml(tmp_path):
    yaml_path = tmp_path / "python_env.yaml"
    _PythonEnv(PYTHON_VERSION, ["a"], ["b"]).to_yaml(yaml_path)
    expected_content = f"""
python: {PYTHON_VERSION}
build_dependencies:
- a
dependencies:
- b
""".lstrip()
    assert yaml_path.read_text() == expected_content


def test_from_yaml(tmp_path):
    content = f"""
python: {PYTHON_VERSION}
build_dependencies:
- a
- b
dependencies:
- c
- d
"""
    yaml_path = tmp_path / "test.yaml"
    yaml_path.write_text(content)
    python_env = _PythonEnv.from_yaml(yaml_path)
    assert python_env.python == PYTHON_VERSION
    assert python_env.build_dependencies == ["a", "b"]
    assert python_env.dependencies == ["c", "d"]


def test_from_conda_yaml(tmp_path):
    content = f"""
name: example
channels:
  - conda-forge
dependencies:
  - python={PYTHON_VERSION}
  - pip
  - pip:
    - a
    - b
"""
    yaml_path = tmp_path / "conda.yaml"
    yaml_path.write_text(content)
    python_env = _PythonEnv.from_conda_yaml(yaml_path)
    assert python_env.python == PYTHON_VERSION
    assert python_env.build_dependencies == ["pip"]
    assert python_env.dependencies == ["a", "b"]


def test_from_conda_yaml_build_dependencies(tmp_path):
    content = f"""
name: example
channels:
  - conda-forge
dependencies:
  - python={PYTHON_VERSION}
  - pip=1.2.3
  - wheel==4.5.6
  - setuptools<=7.8.9
  - pip:
    - a
    - b
"""
    yaml_path = tmp_path / "conda.yaml"
    yaml_path.write_text(content)
    python_env = _PythonEnv.from_conda_yaml(yaml_path)
    assert python_env.python == PYTHON_VERSION
    assert python_env.build_dependencies == ["pip==1.2.3", "wheel==4.5.6", "setuptools<=7.8.9"]
    assert python_env.dependencies == ["a", "b"]


def test_from_conda_yaml_use_current_python_version_when_no_python_spec_in_conda_yaml(tmp_path):
    content = """
name: example
channels:
  - conda-forge
dependencies:
  - pip
  - pip:
    - a
    - b
"""
    yaml_path = tmp_path / "conda.yaml"
    yaml_path.write_text(content)
    assert _PythonEnv.from_conda_yaml(yaml_path).python == PYTHON_VERSION


def test_from_conda_yaml_invalid_python_comparator(tmp_path):
    content = f"""
name: example
channels:
  - conda-forge
dependencies:
  - python<{PYTHON_VERSION}
  - pip:
    - a
    - b
"""
    yaml_path = tmp_path / "conda.yaml"
    yaml_path.write_text(content)
    with pytest.raises(Exception, match="Invalid version comparator for python"):
        _PythonEnv.from_conda_yaml(yaml_path)


def test_from_conda_yaml_conda_dependencies_warning(tmp_path):
    content = f"""
name: example
channels:
  - conda-forge
dependencies:
  - python={PYTHON_VERSION}
  - foo
  - bar
  - pip:
    - a
"""
    yaml_path = tmp_path / "conda.yaml"
    yaml_path.write_text(content)
    with mock.patch("mlflow.utils.environment._logger.warning") as mock_warning:
        _PythonEnv.from_conda_yaml(yaml_path)
        mock_warning.assert_called_with(
            "The following conda dependencies will not be installed "
            "in the resulting environment: %s",
            ["foo", "bar"],
        )
```

--------------------------------------------------------------------------------

---[FILE: test_request_utils.py]---
Location: mlflow-master/tests/utils/test_request_utils.py

```python
import subprocess
import sys
from unittest import mock

import pytest

from mlflow.utils import request_utils


def test_request_utils_does_not_import_mlflow(tmp_path):
    file_content = f"""
import importlib.util
import os
import sys

file_path = r"{request_utils.__file__}"
module_name = "mlflow.utils.request_utils"

spec = importlib.util.spec_from_file_location(module_name, file_path)
module = importlib.util.module_from_spec(spec)
sys.modules[module_name] = module
spec.loader.exec_module(module)

assert "mlflow" not in sys.modules
assert "mlflow.utils.request_utils" in sys.modules
"""
    test_file = tmp_path.joinpath("test_request_utils_does_not_import_mlflow.py")
    test_file.write_text(file_content)

    subprocess.check_call([sys.executable, str(test_file)])


class IncompleteResponse:
    def __init__(self):
        self.headers = {"Content-Length": "100"}
        raw = mock.MagicMock()
        raw.tell.return_value = 50
        self.raw = raw

    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass


def test_download_chunk_incomplete_read(tmp_path):
    with mock.patch.object(
        request_utils, "cloud_storage_http_request", return_value=IncompleteResponse()
    ):
        download_path = tmp_path / "chunk"
        download_path.touch()
        with pytest.raises(IOError, match="Incomplete read"):
            request_utils.download_chunk(
                range_start=0,
                range_end=999,
                headers={},
                download_path=download_path,
                http_uri="https://example.com",
            )


@pytest.mark.parametrize("env_value", ["0", "false", "False", "FALSE"])
def test_redirects_disabled_if_env_var_set(monkeypatch, env_value):
    monkeypatch.setenv("MLFLOW_ALLOW_HTTP_REDIRECTS", env_value)

    with mock.patch("requests.Session.request") as mock_request:
        mock_request.return_value.status_code = 302
        mock_request.return_value.text = "mock response"

        response = request_utils.cloud_storage_http_request("GET", "http://localhost:5000")

        assert response.text == "mock response"
        mock_request.assert_called_once_with(
            "GET",
            "http://localhost:5000",
            allow_redirects=False,
            timeout=None,
        )


@pytest.mark.parametrize("env_value", ["1", "true", "True", "TRUE"])
def test_redirects_enabled_if_env_var_set(monkeypatch, env_value):
    monkeypatch.setenv("MLFLOW_ALLOW_HTTP_REDIRECTS", env_value)

    with mock.patch("requests.Session.request") as mock_request:
        mock_request.return_value.status_code = 302
        mock_request.return_value.text = "mock response"

        response = request_utils.cloud_storage_http_request(
            "GET",
            "http://localhost:5000",
        )

        assert response.text == "mock response"
        mock_request.assert_called_once_with(
            "GET",
            "http://localhost:5000",
            allow_redirects=True,
            timeout=None,
        )


@pytest.mark.parametrize("env_value", ["0", "false", "False", "FALSE"])
def test_redirect_kwarg_overrides_env_value_false(monkeypatch, env_value):
    monkeypatch.setenv("MLFLOW_ALLOW_HTTP_REDIRECTS", env_value)

    with mock.patch("requests.Session.request") as mock_request:
        mock_request.return_value.status_code = 302
        mock_request.return_value.text = "mock response"

        response = request_utils.cloud_storage_http_request(
            "GET", "http://localhost:5000", allow_redirects=True
        )

        assert response.text == "mock response"
        mock_request.assert_called_once_with(
            "GET",
            "http://localhost:5000",
            allow_redirects=True,
            timeout=None,
        )


@pytest.mark.parametrize("env_value", ["1", "true", "True", "TRUE"])
def test_redirect_kwarg_overrides_env_value_true(monkeypatch, env_value):
    monkeypatch.setenv("MLFLOW_ALLOW_HTTP_REDIRECTS", env_value)

    with mock.patch("requests.Session.request") as mock_request:
        mock_request.return_value.status_code = 302
        mock_request.return_value.text = "mock response"

        response = request_utils.cloud_storage_http_request(
            "GET", "http://localhost:5000", allow_redirects=False
        )

        assert response.text == "mock response"
        mock_request.assert_called_once_with(
            "GET",
            "http://localhost:5000",
            allow_redirects=False,
            timeout=None,
        )


def test_redirects_enabled_by_default():
    with mock.patch("requests.Session.request") as mock_request:
        mock_request.return_value.status_code = 302
        mock_request.return_value.text = "mock response"

        response = request_utils.cloud_storage_http_request(
            "GET",
            "http://localhost:5000",
        )

        assert response.text == "mock response"
        mock_request.assert_called_once_with(
            "GET",
            "http://localhost:5000",
            allow_redirects=True,
            timeout=None,
        )
```

--------------------------------------------------------------------------------

````
