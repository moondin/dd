---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 861
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 861 of 991)

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

---[FILE: test_resources.py]---
Location: mlflow-master/tests/models/test_resources.py

```python
import pytest

from mlflow.models.resources import (
    DEFAULT_API_VERSION,
    DatabricksApp,
    DatabricksFunction,
    DatabricksGenieSpace,
    DatabricksLakebase,
    DatabricksServingEndpoint,
    DatabricksSQLWarehouse,
    DatabricksTable,
    DatabricksUCConnection,
    DatabricksVectorSearchIndex,
    _ResourceBuilder,
)


@pytest.mark.parametrize("on_behalf_of_user", [True, False, None])
def test_serving_endpoint(on_behalf_of_user):
    endpoint = DatabricksServingEndpoint(
        endpoint_name="llm_server", on_behalf_of_user=on_behalf_of_user
    )
    expected = (
        {"serving_endpoint": [{"name": "llm_server"}]}
        if on_behalf_of_user is None
        else {"serving_endpoint": [{"name": "llm_server", "on_behalf_of_user": on_behalf_of_user}]}
    )
    assert endpoint.to_dict() == expected
    assert _ResourceBuilder.from_resources([endpoint]) == {
        "api_version": DEFAULT_API_VERSION,
        "databricks": expected,
    }


@pytest.mark.parametrize("on_behalf_of_user", [True, False, None])
def test_index_name(on_behalf_of_user):
    index = DatabricksVectorSearchIndex(index_name="index1", on_behalf_of_user=on_behalf_of_user)
    expected = (
        {"vector_search_index": [{"name": "index1"}]}
        if on_behalf_of_user is None
        else {"vector_search_index": [{"name": "index1", "on_behalf_of_user": on_behalf_of_user}]}
    )
    assert index.to_dict() == expected
    assert _ResourceBuilder.from_resources([index]) == {
        "api_version": DEFAULT_API_VERSION,
        "databricks": expected,
    }


@pytest.mark.parametrize("on_behalf_of_user", [True, False, None])
def test_sql_warehouse(on_behalf_of_user):
    sql_warehouse = DatabricksSQLWarehouse(warehouse_id="id1", on_behalf_of_user=on_behalf_of_user)
    expected = (
        {"sql_warehouse": [{"name": "id1"}]}
        if on_behalf_of_user is None
        else {"sql_warehouse": [{"name": "id1", "on_behalf_of_user": on_behalf_of_user}]}
    )
    assert sql_warehouse.to_dict() == expected
    assert _ResourceBuilder.from_resources([sql_warehouse]) == {
        "api_version": DEFAULT_API_VERSION,
        "databricks": expected,
    }


@pytest.mark.parametrize("on_behalf_of_user", [True, False, None])
def test_uc_function(on_behalf_of_user):
    uc_function = DatabricksFunction(function_name="function", on_behalf_of_user=on_behalf_of_user)
    expected = (
        {"function": [{"name": "function"}]}
        if on_behalf_of_user is None
        else {"function": [{"name": "function", "on_behalf_of_user": on_behalf_of_user}]}
    )
    assert uc_function.to_dict() == expected
    assert _ResourceBuilder.from_resources([uc_function]) == {
        "api_version": DEFAULT_API_VERSION,
        "databricks": expected,
    }


@pytest.mark.parametrize("on_behalf_of_user", [True, False, None])
def test_genie_space(on_behalf_of_user):
    genie_space = DatabricksGenieSpace(genie_space_id="id1", on_behalf_of_user=on_behalf_of_user)
    expected = (
        {"genie_space": [{"name": "id1"}]}
        if on_behalf_of_user is None
        else {"genie_space": [{"name": "id1", "on_behalf_of_user": on_behalf_of_user}]}
    )

    assert genie_space.to_dict() == expected
    assert _ResourceBuilder.from_resources([genie_space]) == {
        "api_version": DEFAULT_API_VERSION,
        "databricks": expected,
    }


@pytest.mark.parametrize("on_behalf_of_user", [True, False, None])
def test_uc_connection(on_behalf_of_user):
    uc_function = DatabricksUCConnection(
        connection_name="slack_connection", on_behalf_of_user=on_behalf_of_user
    )
    expected = (
        {"uc_connection": [{"name": "slack_connection"}]}
        if on_behalf_of_user is None
        else {
            "uc_connection": [{"name": "slack_connection", "on_behalf_of_user": on_behalf_of_user}]
        }
    )
    assert uc_function.to_dict() == expected
    assert _ResourceBuilder.from_resources([uc_function]) == {
        "api_version": DEFAULT_API_VERSION,
        "databricks": expected,
    }


@pytest.mark.parametrize("on_behalf_of_user", [True, False, None])
def test_table(on_behalf_of_user):
    table = DatabricksTable(table_name="tableName", on_behalf_of_user=on_behalf_of_user)
    expected = (
        {"table": [{"name": "tableName"}]}
        if on_behalf_of_user is None
        else {"table": [{"name": "tableName", "on_behalf_of_user": on_behalf_of_user}]}
    )

    assert table.to_dict() == expected
    assert _ResourceBuilder.from_resources([table]) == {
        "api_version": DEFAULT_API_VERSION,
        "databricks": expected,
    }


@pytest.mark.parametrize("on_behalf_of_user", [True, False, None])
def test_app(on_behalf_of_user):
    app = DatabricksApp(app_name="id1", on_behalf_of_user=on_behalf_of_user)
    expected = (
        {"app": [{"name": "id1"}]}
        if on_behalf_of_user is None
        else {"app": [{"name": "id1", "on_behalf_of_user": on_behalf_of_user}]}
    )
    assert app.to_dict() == expected
    assert _ResourceBuilder.from_resources([app]) == {
        "api_version": DEFAULT_API_VERSION,
        "databricks": expected,
    }


@pytest.mark.parametrize("on_behalf_of_user", [True, False, None])
def test_lakebase(on_behalf_of_user):
    lakebase = DatabricksLakebase(
        database_instance_name="lakebase_name", on_behalf_of_user=on_behalf_of_user
    )
    expected = (
        {"lakebase": [{"name": "lakebase_name"}]}
        if on_behalf_of_user is None
        else {"lakebase": [{"name": "lakebase_name", "on_behalf_of_user": on_behalf_of_user}]}
    )
    assert lakebase.to_dict() == expected
    assert _ResourceBuilder.from_resources([lakebase]) == {
        "api_version": DEFAULT_API_VERSION,
        "databricks": expected,
    }


def test_resources():
    resources = [
        DatabricksVectorSearchIndex(index_name="rag.studio_bugbash.databricks_docs_index"),
        DatabricksServingEndpoint(endpoint_name="databricks-mixtral-8x7b-instruct"),
        DatabricksServingEndpoint(endpoint_name="databricks-llama-8x7b-instruct"),
        DatabricksSQLWarehouse(warehouse_id="id123"),
        DatabricksFunction(function_name="rag.studio.test_function_1"),
        DatabricksFunction(function_name="rag.studio.test_function_2"),
        DatabricksUCConnection(connection_name="slack_connection"),
        DatabricksApp(app_name="test_databricks_app"),
        DatabricksLakebase(database_instance_name="test_databricks_lakebase"),
    ]
    expected = {
        "api_version": DEFAULT_API_VERSION,
        "databricks": {
            "vector_search_index": [{"name": "rag.studio_bugbash.databricks_docs_index"}],
            "serving_endpoint": [
                {"name": "databricks-mixtral-8x7b-instruct"},
                {"name": "databricks-llama-8x7b-instruct"},
            ],
            "sql_warehouse": [{"name": "id123"}],
            "function": [
                {"name": "rag.studio.test_function_1"},
                {"name": "rag.studio.test_function_2"},
            ],
            "uc_connection": [{"name": "slack_connection"}],
            "app": [{"name": "test_databricks_app"}],
            "lakebase": [{"name": "test_databricks_lakebase"}],
        },
    }

    assert _ResourceBuilder.from_resources(resources) == expected


def test_invoker_resources():
    resources = [
        DatabricksVectorSearchIndex(
            index_name="rag.studio_bugbash.databricks_docs_index", on_behalf_of_user=True
        ),
        DatabricksServingEndpoint(endpoint_name="databricks-mixtral-8x7b-instruct"),
        DatabricksServingEndpoint(
            endpoint_name="databricks-llama-8x7b-instruct", on_behalf_of_user=True
        ),
        DatabricksSQLWarehouse(warehouse_id="id123"),
        DatabricksFunction(function_name="rag.studio.test_function_1"),
        DatabricksFunction(function_name="rag.studio.test_function_2", on_behalf_of_user=True),
        DatabricksUCConnection(connection_name="slack_connection"),
    ]
    expected = {
        "api_version": DEFAULT_API_VERSION,
        "databricks": {
            "vector_search_index": [
                {"name": "rag.studio_bugbash.databricks_docs_index", "on_behalf_of_user": True}
            ],
            "serving_endpoint": [
                {"name": "databricks-mixtral-8x7b-instruct"},
                {"name": "databricks-llama-8x7b-instruct", "on_behalf_of_user": True},
            ],
            "sql_warehouse": [{"name": "id123"}],
            "function": [
                {"name": "rag.studio.test_function_1"},
                {"name": "rag.studio.test_function_2", "on_behalf_of_user": True},
            ],
            "uc_connection": [{"name": "slack_connection"}],
        },
    }

    assert _ResourceBuilder.from_resources(resources) == expected


def test_resources_from_yaml(tmp_path):
    yaml_file = tmp_path.joinpath("resources.yaml")
    with open(yaml_file, "w") as f:
        f.write(
            """
            api_version: "1"
            databricks:
                vector_search_index:
                - name: rag.studio_bugbash.databricks_docs_index
                serving_endpoint:
                - name: databricks-mixtral-8x7b-instruct
                - name: databricks-llama-8x7b-instruct
                sql_warehouse:
                - name: id123
                function:
                - name: rag.studio.test_function_1
                - name: rag.studio.test_function_2
                lakebase:
                - name: test_databricks_lakebase
                uc_connection:
                - name: slack_connection
                app:
                - name: test_databricks_app
            """
        )

    assert _ResourceBuilder.from_yaml_file(yaml_file) == {
        "api_version": DEFAULT_API_VERSION,
        "databricks": {
            "vector_search_index": [{"name": "rag.studio_bugbash.databricks_docs_index"}],
            "serving_endpoint": [
                {"name": "databricks-mixtral-8x7b-instruct"},
                {"name": "databricks-llama-8x7b-instruct"},
            ],
            "sql_warehouse": [{"name": "id123"}],
            "function": [
                {"name": "rag.studio.test_function_1"},
                {"name": "rag.studio.test_function_2"},
            ],
            "uc_connection": [{"name": "slack_connection"}],
            "app": [{"name": "test_databricks_app"}],
            "lakebase": [{"name": "test_databricks_lakebase"}],
        },
    }

    with pytest.raises(OSError, match="No such file or directory: 'no-file.yaml'"):
        _ResourceBuilder.from_yaml_file("no-file.yaml")

    incorrect_version = tmp_path.joinpath("incorrect_file.yaml")
    with open(incorrect_version, "w") as f:
        f.write(
            """
            api_version: "v1"
            """
        )

    with pytest.raises(ValueError, match="Unsupported API version: v1"):
        _ResourceBuilder.from_yaml_file(incorrect_version)

    incorrect_target_uri = tmp_path.joinpath("incorrect_target_uri.yaml")
    with open(incorrect_target_uri, "w") as f:
        f.write(
            """
            api_version: "1"
            databricks-aa:
                vector_search_index_name:
                - name: rag.studio_bugbash.databricks_docs_index
            """
        )

    with pytest.raises(ValueError, match="Unsupported target URI: databricks-aa"):
        _ResourceBuilder.from_yaml_file(incorrect_target_uri)

    incorrect_resource = tmp_path.joinpath("incorrect_resource.yaml")
    with open(incorrect_resource, "w") as f:
        f.write(
            """
            api_version: "1"
            databricks:
                vector_search_index_name:
                - name: rag.studio_bugbash.databricks_docs_index
            """
        )

    with pytest.raises(ValueError, match="Unsupported resource type: vector_search_index_name"):
        _ResourceBuilder.from_yaml_file(incorrect_resource)

    invokers_yaml_file = tmp_path.joinpath("invokers_resources.yaml")
    with open(invokers_yaml_file, "w") as f:
        f.write(
            """
            api_version: "1"
            databricks:
                vector_search_index:
                - name: rag.studio_bugbash.databricks_docs_index
                  on_behalf_of_user: true
                serving_endpoint:
                - name: databricks-mixtral-8x7b-instruct
                - name: databricks-llama-8x7b-instruct
                  on_behalf_of_user: true
                sql_warehouse:
                - name: id123
                function:
                - name: rag.studio.test_function_1
                  on_behalf_of_user: true
                - name: rag.studio.test_function_2
                uc_connection:
                - name: slack_connection
                  on_behalf_of_user: true
            """
        )

    assert _ResourceBuilder.from_yaml_file(invokers_yaml_file) == {
        "api_version": DEFAULT_API_VERSION,
        "databricks": {
            "vector_search_index": [
                {"name": "rag.studio_bugbash.databricks_docs_index", "on_behalf_of_user": True}
            ],
            "serving_endpoint": [
                {"name": "databricks-mixtral-8x7b-instruct"},
                {"name": "databricks-llama-8x7b-instruct", "on_behalf_of_user": True},
            ],
            "sql_warehouse": [{"name": "id123"}],
            "function": [
                {"name": "rag.studio.test_function_1", "on_behalf_of_user": True},
                {"name": "rag.studio.test_function_2"},
            ],
            "uc_connection": [{"name": "slack_connection", "on_behalf_of_user": True}],
        },
    }
```

--------------------------------------------------------------------------------

---[FILE: test_signature.py]---
Location: mlflow-master/tests/models/test_signature.py
Signals: Pydantic

```python
import json
from dataclasses import asdict, dataclass

import numpy as np
import pandas as pd
import pydantic
import pyspark
import pytest
from sklearn.ensemble import RandomForestRegressor

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.models import Model, ModelSignature, infer_signature, rag_signatures, set_signature
from mlflow.models.model import get_model_info
from mlflow.types import DataType
from mlflow.types.schema import (
    Array,
    ColSpec,
    ParamSchema,
    ParamSpec,
    Schema,
    TensorSpec,
    convert_dataclass_to_schema,
)
from mlflow.types.utils import InvalidDataForSignatureInferenceError


def test_model_signature_with_colspec():
    signature1 = ModelSignature(
        inputs=Schema([ColSpec(DataType.boolean), ColSpec(DataType.binary)]),
        outputs=Schema(
            [ColSpec(name=None, type=DataType.double), ColSpec(name=None, type=DataType.double)]
        ),
    )
    signature2 = ModelSignature(
        inputs=Schema([ColSpec(DataType.boolean), ColSpec(DataType.binary)]),
        outputs=Schema(
            [ColSpec(name=None, type=DataType.double), ColSpec(name=None, type=DataType.double)]
        ),
    )
    assert signature1 == signature2
    signature3 = ModelSignature(
        inputs=Schema([ColSpec(DataType.boolean), ColSpec(DataType.binary)]),
        outputs=Schema(
            [ColSpec(name=None, type=DataType.float), ColSpec(name=None, type=DataType.double)]
        ),
    )
    assert signature3 != signature1
    as_json = json.dumps(signature1.to_dict())
    signature4 = ModelSignature.from_dict(json.loads(as_json))
    assert signature1 == signature4
    signature5 = ModelSignature(
        inputs=Schema([ColSpec(DataType.boolean), ColSpec(DataType.binary)]), outputs=None
    )
    as_json = json.dumps(signature5.to_dict())
    signature6 = ModelSignature.from_dict(json.loads(as_json))
    assert signature5 == signature6


def test_model_signature_with_tensorspec():
    signature1 = ModelSignature(
        inputs=Schema([TensorSpec(np.dtype("float"), (-1, 28, 28))]),
        outputs=Schema([TensorSpec(np.dtype("float"), (-1, 10))]),
    )
    signature2 = ModelSignature(
        inputs=Schema([TensorSpec(np.dtype("float"), (-1, 28, 28))]),
        outputs=Schema([TensorSpec(np.dtype("float"), (-1, 10))]),
    )
    # Single type mismatch
    assert signature1 == signature2
    signature3 = ModelSignature(
        inputs=Schema([TensorSpec(np.dtype("float"), (-1, 28, 28))]),
        outputs=Schema([TensorSpec(np.dtype("int"), (-1, 10))]),
    )
    assert signature3 != signature1
    # Name mismatch
    signature4 = ModelSignature(
        inputs=Schema([TensorSpec(np.dtype("float"), (-1, 28, 28))]),
        outputs=Schema([TensorSpec(np.dtype("float"), (-1, 10), "mismatch")]),
    )
    assert signature3 != signature4
    as_json = json.dumps(signature1.to_dict())
    signature5 = ModelSignature.from_dict(json.loads(as_json))
    assert signature1 == signature5

    # Test with name
    signature6 = ModelSignature(
        inputs=Schema(
            [
                TensorSpec(np.dtype("float"), (-1, 28, 28), name="image"),
                TensorSpec(np.dtype("int"), (-1, 10), name="metadata"),
            ]
        ),
        outputs=Schema([TensorSpec(np.dtype("float"), (-1, 10), name="outputs")]),
    )
    signature7 = ModelSignature(
        inputs=Schema(
            [
                TensorSpec(np.dtype("float"), (-1, 28, 28), name="image"),
                TensorSpec(np.dtype("int"), (-1, 10), name="metadata"),
            ]
        ),
        outputs=Schema([TensorSpec(np.dtype("float"), (-1, 10), name="outputs")]),
    )
    assert signature6 == signature7
    assert signature1 != signature6

    # Test w/o output
    signature8 = ModelSignature(
        inputs=Schema([TensorSpec(np.dtype("float"), (-1, 28, 28))]), outputs=None
    )
    as_json = json.dumps(signature8.to_dict())
    signature9 = ModelSignature.from_dict(json.loads(as_json))
    assert signature8 == signature9


def test_model_signature_with_colspec_and_tensorspec():
    signature1 = ModelSignature(inputs=Schema([ColSpec(DataType.double)]))
    signature2 = ModelSignature(inputs=Schema([TensorSpec(np.dtype("float"), (-1, 28, 28))]))
    assert signature1 != signature2
    assert signature2 != signature1

    signature3 = ModelSignature(
        inputs=Schema([ColSpec(DataType.double)]),
        outputs=Schema([TensorSpec(np.dtype("float"), (-1, 28, 28))]),
    )
    signature4 = ModelSignature(
        inputs=Schema([ColSpec(DataType.double)]),
        outputs=Schema([ColSpec(DataType.double)]),
    )
    assert signature3 != signature4
    assert signature4 != signature3


def test_signature_inference_infers_input_and_output_as_expected():
    sig0 = infer_signature(np.array([1]))
    assert sig0.inputs is not None
    assert sig0.outputs is None
    sig1 = infer_signature(np.array([1]), np.array([1]))
    assert sig1.inputs == sig0.inputs
    assert sig1.outputs == sig0.inputs


def test_infer_signature_on_nested_array():
    signature = infer_signature(
        model_input=[{"queries": [["a", "b", "c"], ["d", "e"], []]}],
        model_output=[{"answers": [["f", "g"], ["h"]]}],
    )
    assert signature.inputs == Schema([ColSpec(Array(Array(DataType.string)), name="queries")])
    assert signature.outputs == Schema([ColSpec(Array(Array(DataType.string)), name="answers")])

    signature = infer_signature(
        model_input=[
            {
                "inputs": [
                    np.array([["a", "b"], ["c", "d"]]),
                    np.array([["e", "f"], ["g", "h"]]),
                ]
            }
        ],
        model_output=[{"outputs": [np.int32(5), np.int32(6)]}],
    )
    assert signature.inputs == Schema(
        [ColSpec(Array(Array(Array(DataType.string))), name="inputs")]
    )
    assert signature.outputs == Schema([ColSpec(Array(DataType.integer), name="outputs")])


def test_infer_signature_on_list_of_dictionaries():
    signature = infer_signature(
        model_input=[{"query": "test query"}],
        model_output=[
            {
                "output": "Output from the LLM",
                "candidate_ids": ["412", "1233"],
                "candidate_sources": ["file1.md", "file201.md"],
            }
        ],
    )
    assert signature.inputs == Schema([ColSpec(DataType.string, name="query")])
    assert signature.outputs == Schema(
        [
            ColSpec(DataType.string, name="output"),
            ColSpec(Array(DataType.string), name="candidate_ids"),
            ColSpec(Array(DataType.string), name="candidate_sources"),
        ]
    )


def test_signature_inference_infers_datime_types_as_expected():
    col_name = "datetime_col"
    test_datetime = np.datetime64("2021-01-01")
    test_series = pd.Series(pd.to_datetime([test_datetime]))
    test_df = test_series.to_frame(col_name)

    signature = infer_signature(test_series)
    assert signature.inputs == Schema([ColSpec(DataType.datetime)])

    signature = infer_signature(test_df)
    assert signature.inputs == Schema([ColSpec(DataType.datetime, name=col_name)])

    with pyspark.sql.SparkSession.builder.getOrCreate() as spark:
        spark_df = spark.range(1).selectExpr(
            "current_timestamp() as timestamp", "current_date() as date"
        )
        signature = infer_signature(spark_df)
        assert signature.inputs == Schema(
            [ColSpec(DataType.datetime, name="timestamp"), ColSpec(DataType.datetime, name="date")]
        )


def test_set_signature_to_logged_model():
    artifact_path = "regr-model"
    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(RandomForestRegressor(), name=artifact_path)
    signature = infer_signature(np.array([1]))
    set_signature(model_info.model_uri, signature)
    model_info = get_model_info(model_info.model_uri)
    assert model_info.signature == signature


def test_set_signature_to_saved_model(tmp_path):
    model_path = str(tmp_path)
    mlflow.sklearn.save_model(
        RandomForestRegressor(),
        model_path,
        serialization_format=mlflow.sklearn.SERIALIZATION_FORMAT_CLOUDPICKLE,
    )
    signature = infer_signature(np.array([1]))
    set_signature(model_path, signature)
    assert Model.load(model_path).signature == signature


def test_set_signature_overwrite():
    artifact_path = "regr-model"
    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(
            RandomForestRegressor(),
            name=artifact_path,
            signature=infer_signature(np.array([1])),
        )
    new_signature = infer_signature(np.array([1]), np.array([1]))
    set_signature(model_info.model_uri, new_signature)
    model_info = get_model_info(model_info.model_uri)
    assert model_info.signature == new_signature


def test_cannot_set_signature_on_models_scheme_uris():
    signature = infer_signature(np.array([1]))
    with pytest.raises(
        MlflowException,
        match="Model URIs with the `models:/<name>/<version>` scheme are not supported.",
    ):
        set_signature("models:/dummy_model@champion", signature)


def test_signature_construction():
    signature = ModelSignature(inputs=Schema([ColSpec(DataType.binary)]))
    assert signature.to_dict() == {
        "inputs": '[{"type": "binary", "required": true}]',
        "outputs": None,
        "params": None,
    }

    signature = ModelSignature(outputs=Schema([ColSpec(DataType.double)]))
    assert signature.to_dict() == {
        "inputs": None,
        "outputs": '[{"type": "double", "required": true}]',
        "params": None,
    }

    signature = ModelSignature(params=ParamSchema([ParamSpec("param1", DataType.string, "test")]))
    assert signature.to_dict() == {
        "inputs": None,
        "outputs": None,
        "params": '[{"name": "param1", "default": "test", "shape": null, "type": "string"}]',
    }


def test_signature_with_errors():
    with pytest.raises(
        TypeError,
        match=r"inputs must be either None, mlflow.models.signature.Schema, or a dataclass",
    ):
        ModelSignature(inputs=1)

    with pytest.raises(
        ValueError, match=r"At least one of inputs, outputs or params must be provided"
    ):
        ModelSignature()


def test_signature_for_rag():
    signature = ModelSignature(
        inputs=rag_signatures.ChatCompletionRequest(),
        outputs=rag_signatures.ChatCompletionResponse(),
    )
    signature_dict = signature.to_dict()
    assert signature_dict == {
        "inputs": (
            '[{"type": "array", "items": {"type": "object", "properties": '
            '{"content": {"type": "string", "required": true}, '
            '"role": {"type": "string", "required": true}}}, '
            '"name": "messages", "required": true}]'
        ),
        "outputs": (
            '[{"type": "array", "items": {"type": "object", "properties": '
            '{"finish_reason": {"type": "string", "required": true}, '
            '"index": {"type": "long", "required": true}, '
            '"message": {"type": "object", "properties": '
            '{"content": {"type": "string", "required": true}, '
            '"role": {"type": "string", "required": true}}, '
            '"required": true}}}, "name": "choices", "required": true}, '
            '{"type": "string", "name": "object", "required": true}]'
        ),
        "params": None,
    }


def test_infer_signature_and_convert_dataclass_to_schema_for_rag():
    inferred_signature = infer_signature(
        asdict(rag_signatures.ChatCompletionRequest()),
        asdict(rag_signatures.ChatCompletionResponse()),
    )
    input_schema = convert_dataclass_to_schema(rag_signatures.ChatCompletionRequest())
    output_schema = convert_dataclass_to_schema(rag_signatures.ChatCompletionResponse())
    assert inferred_signature.inputs == input_schema
    assert inferred_signature.outputs == output_schema


def test_infer_signature_with_dataclass():
    inferred_signature = infer_signature(
        rag_signatures.ChatCompletionRequest(),
        rag_signatures.ChatCompletionResponse(),
    )
    input_schema = convert_dataclass_to_schema(rag_signatures.ChatCompletionRequest())
    output_schema = convert_dataclass_to_schema(rag_signatures.ChatCompletionResponse())
    assert inferred_signature.inputs == input_schema
    assert inferred_signature.outputs == output_schema


@dataclass
class CustomInput:
    id: int = 0


@dataclass
class CustomOutput:
    id: int = 0


@dataclass
class FlexibleChatCompletionRequest(rag_signatures.ChatCompletionRequest):
    custom_input: CustomInput | None = None


@dataclass
class FlexibleChatCompletionResponse(rag_signatures.ChatCompletionResponse):
    custom_output: CustomOutput | None = None


def test_infer_signature_with_optional_and_child_dataclass():
    inferred_signature = infer_signature(
        FlexibleChatCompletionRequest(),
        FlexibleChatCompletionResponse(),
    )
    custom_input_schema = next(
        schema for schema in inferred_signature.inputs.to_dict() if schema["name"] == "custom_input"
    )
    assert custom_input_schema["required"] is False
    assert "id" in custom_input_schema["properties"]
    assert any(
        schema for schema in inferred_signature.inputs.to_dict() if schema["name"] == "messages"
    )


def test_infer_signature_for_pydantic_objects_error():
    class Message(pydantic.BaseModel):
        content: str
        role: str

    m = Message(content="test", role="user")
    with pytest.raises(
        InvalidDataForSignatureInferenceError,
        match=r"MLflow does not support inferring model signature from "
        r"input example with Pydantic objects",
    ):
        infer_signature([m])
```

--------------------------------------------------------------------------------

````
