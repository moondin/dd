---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 858
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 858 of 991)

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

---[FILE: test_dependencies_schema.py]---
Location: mlflow-master/tests/models/test_dependencies_schema.py

```python
from unittest import mock

from mlflow.models import dependencies_schemas
from mlflow.models.dependencies_schemas import (
    DependenciesSchemas,
    DependenciesSchemasType,
    RetrieverSchema,
    _get_dependencies_schemas,
    _get_retriever_schema,
    set_retriever_schema,
)


def test_retriever_creation():
    vsi = RetrieverSchema(
        name="index-name",
        primary_key="primary-key",
        text_column="text-column",
        doc_uri="doc-uri",
        other_columns=["column1", "column2"],
    )
    assert vsi.name == "index-name"
    assert vsi.primary_key == "primary-key"
    assert vsi.text_column == "text-column"
    assert vsi.doc_uri == "doc-uri"
    assert vsi.other_columns == ["column1", "column2"]


def test_retriever_to_dict():
    vsi = RetrieverSchema(
        name="index-name",
        primary_key="primary-key",
        text_column="text-column",
        doc_uri="doc-uri",
        other_columns=["column1", "column2"],
    )
    expected_dict = {
        DependenciesSchemasType.RETRIEVERS.value: [
            {
                "name": "index-name",
                "primary_key": "primary-key",
                "text_column": "text-column",
                "doc_uri": "doc-uri",
                "other_columns": ["column1", "column2"],
            }
        ]
    }
    assert vsi.to_dict() == expected_dict


def test_retriever_from_dict():
    data = {
        "name": "index-name",
        "primary_key": "primary-key",
        "text_column": "text-column",
        "doc_uri": "doc-uri",
        "other_columns": ["column1", "column2"],
    }
    vsi = RetrieverSchema.from_dict(data)
    assert vsi.name == "index-name"
    assert vsi.primary_key == "primary-key"
    assert vsi.text_column == "text-column"
    assert vsi.doc_uri == "doc-uri"
    assert vsi.other_columns == ["column1", "column2"]


def test_dependencies_schemas_to_dict():
    vsi = RetrieverSchema(
        name="index-name",
        primary_key="primary-key",
        text_column="text-column",
        doc_uri="doc-uri",
        other_columns=["column1", "column2"],
    )
    schema = DependenciesSchemas(retriever_schemas=[vsi])
    expected_dict = {
        "dependencies_schemas": {
            DependenciesSchemasType.RETRIEVERS.value: [
                {
                    "name": "index-name",
                    "primary_key": "primary-key",
                    "text_column": "text-column",
                    "doc_uri": "doc-uri",
                    "other_columns": ["column1", "column2"],
                }
            ]
        }
    }
    assert schema.to_dict() == expected_dict


def test_set_retriever_schema_creation():
    set_retriever_schema(
        primary_key="primary-key",
        text_column="text-column",
        doc_uri="doc-uri",
        other_columns=["column1", "column2"],
    )
    with _get_dependencies_schemas() as schema:
        assert schema.to_dict()["dependencies_schemas"] == {
            DependenciesSchemasType.RETRIEVERS.value: [
                {
                    "doc_uri": "doc-uri",
                    "name": "retriever",
                    "other_columns": ["column1", "column2"],
                    "primary_key": "primary-key",
                    "text_column": "text-column",
                }
            ]
        }

    # Schema is automatically reset
    with _get_dependencies_schemas() as schema:
        assert schema.to_dict() is None
    assert _get_retriever_schema() == []


def test_set_retriever_schema_creation_with_name():
    set_retriever_schema(
        name="my_ret_2",
        primary_key="primary-key",
        text_column="text-column",
        doc_uri="doc-uri",
        other_columns=["column1", "column2"],
    )
    with _get_dependencies_schemas() as schema:
        assert schema.to_dict()["dependencies_schemas"] == {
            DependenciesSchemasType.RETRIEVERS.value: [
                {
                    "doc_uri": "doc-uri",
                    "name": "my_ret_2",
                    "other_columns": ["column1", "column2"],
                    "primary_key": "primary-key",
                    "text_column": "text-column",
                }
            ]
        }

    # Schema is automatically reset
    with _get_dependencies_schemas() as schema:
        assert schema.to_dict() is None
    assert _get_retriever_schema() == []


def test_set_retriever_schema_empty_creation():
    with _get_dependencies_schemas() as schema:
        assert schema.to_dict() is None


def test_multiple_set_retriever_schema_creation_with_name():
    set_retriever_schema(
        name="my_ret_1",
        primary_key="primary-key-2",
        text_column="text-column-1",
        doc_uri="doc-uri-3",
        other_columns=["column1", "column2"],
    )

    set_retriever_schema(
        name="my_ret_2",
        primary_key="primary-key",
        text_column="text-column",
        doc_uri="doc-uri",
        other_columns=["column1", "column2"],
    )
    with _get_dependencies_schemas() as schema:
        assert schema.to_dict()["dependencies_schemas"] == {
            DependenciesSchemasType.RETRIEVERS.value: [
                {
                    "doc_uri": "doc-uri-3",
                    "name": "my_ret_1",
                    "other_columns": ["column1", "column2"],
                    "primary_key": "primary-key-2",
                    "text_column": "text-column-1",
                },
                {
                    "doc_uri": "doc-uri",
                    "name": "my_ret_2",
                    "other_columns": ["column1", "column2"],
                    "primary_key": "primary-key",
                    "text_column": "text-column",
                },
            ]
        }

    # Schema is automatically reset
    with _get_dependencies_schemas() as schema:
        assert schema.to_dict() is None
    assert _get_retriever_schema() == []


def test_multiple_set_retriever_schema_with_same_name_with_different_schemas():
    set_retriever_schema(
        name="my_ret_1",
        primary_key="primary-key-2",
        text_column="text-column-1",
        doc_uri="doc-uri-3",
        other_columns=["column1", "column2"],
    )
    set_retriever_schema(
        name="my_ret_2",
        primary_key="primary-key",
        text_column="text-column",
        doc_uri="doc-uri",
        other_columns=["column1", "column2"],
    )

    with mock.patch.object(dependencies_schemas, "_logger") as mock_logger:
        set_retriever_schema(
            name="my_ret_1",
            primary_key="primary-key",
            text_column="text-column",
            doc_uri="doc-uri",
            other_columns=["column1", "column2"],
        )
        mock_logger.warning.assert_called_once_with(
            "A retriever schema with the name 'my_ret_1' already exists. "
            "Overriding the existing schema."
        )

    with _get_dependencies_schemas() as schema:
        assert schema.to_dict()["dependencies_schemas"] == {
            DependenciesSchemasType.RETRIEVERS.value: [
                {
                    "doc_uri": "doc-uri",
                    "name": "my_ret_1",
                    "other_columns": ["column1", "column2"],
                    "primary_key": "primary-key",
                    "text_column": "text-column",
                },
                {
                    "doc_uri": "doc-uri",
                    "name": "my_ret_2",
                    "other_columns": ["column1", "column2"],
                    "primary_key": "primary-key",
                    "text_column": "text-column",
                },
            ]
        }


def test_multiple_set_retriever_schema_with_same_name_with_same_schema():
    set_retriever_schema(
        name="my_ret_1",
        primary_key="primary-key",
        text_column="text-column",
        doc_uri="doc-uri",
        other_columns=["column1", "column2"],
    )
    set_retriever_schema(
        name="my_ret_2",
        primary_key="primary-key",
        text_column="text-column",
        doc_uri="doc-uri",
        other_columns=["column1", "column2"],
    )

    with mock.patch.object(dependencies_schemas, "_logger") as mock_logger:
        set_retriever_schema(
            name="my_ret_1",
            primary_key="primary-key",
            text_column="text-column",
            doc_uri="doc-uri",
            other_columns=["column1", "column2"],
        )
        mock_logger.warning.assert_not_called()

    with _get_dependencies_schemas() as schema:
        assert schema.to_dict()["dependencies_schemas"] == {
            DependenciesSchemasType.RETRIEVERS.value: [
                {
                    "doc_uri": "doc-uri",
                    "name": "my_ret_1",
                    "other_columns": ["column1", "column2"],
                    "primary_key": "primary-key",
                    "text_column": "text-column",
                },
                {
                    "doc_uri": "doc-uri",
                    "name": "my_ret_2",
                    "other_columns": ["column1", "column2"],
                    "primary_key": "primary-key",
                    "text_column": "text-column",
                },
            ]
        }
```

--------------------------------------------------------------------------------

---[FILE: test_display_utils.py]---
Location: mlflow-master/tests/models/test_display_utils.py

```python
from pathlib import Path
from unittest import mock

import pytest

from mlflow.models import infer_signature
from mlflow.models.display_utils import (
    _generate_agent_eval_recipe,
    _should_render_agent_eval_template,
)
from mlflow.models.rag_signatures import StringResponse
from mlflow.types.llm import (
    ChatChoice,
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatMessage,
)

_CHAT_REQUEST = ChatCompletionRequest(
    messages=[
        ChatMessage(
            role="user",
            content="What is the primary function of control rods in a nuclear reactor?",
        ),
        ChatMessage(role="user", content="What is MLflow?"),
    ]
).to_dict()
_CHAT_RESPONSE = ChatCompletionResponse(
    choices=[
        ChatChoice(
            index=0,
            message=ChatMessage(
                role="assistant",
                content="MLflow is an open source platform for the machine learning lifecycle.",
            ),
        )
    ]
).to_dict()

_STRING_RESPONSE = StringResponse(
    content="MLflow is an open source platform for the machine learning lifecycle."
)


@pytest.fixture
def enable_databricks_env():
    with (
        mock.patch("mlflow.utils.databricks_utils.is_in_databricks_runtime", return_value=True),
        mock.patch("IPython.get_ipython", return_value=True),
    ):
        yield


def test_should_render_eval_template_when_signature_is_chat_completion(enable_databricks_env):
    signature = infer_signature(_CHAT_REQUEST, _CHAT_RESPONSE)
    assert _should_render_agent_eval_template(signature)


def test_should_render_eval_template_with_string_response(enable_databricks_env):
    signature = infer_signature(_CHAT_REQUEST, _STRING_RESPONSE)
    assert _should_render_agent_eval_template(signature)


def test_should_render_eval_template_with_vanilla_string(enable_databricks_env):
    signature = infer_signature(_CHAT_REQUEST, "A vanilla string response")
    assert _should_render_agent_eval_template(signature)


def test_should_render_eval_template_with_string_input(enable_databricks_env):
    signature = infer_signature("A vanilla string input", _STRING_RESPONSE)
    assert _should_render_agent_eval_template(signature)


def test_should_not_render_eval_template_generic_signature(enable_databricks_env):
    signature = infer_signature({"input": "string"}, {"output": "string"})
    assert not _should_render_agent_eval_template(signature)


def test_should_not_render_eval_template_outside_databricks_env():
    with (
        mock.patch("mlflow.utils.databricks_utils.is_in_databricks_runtime", return_value=False),
        mock.patch("IPython.get_ipython", return_value=True),
    ):
        signature = infer_signature(_CHAT_REQUEST, _STRING_RESPONSE)
        assert not _should_render_agent_eval_template(signature)


def test_should_not_render_eval_template_outside_notebook_env():
    with (
        mock.patch("mlflow.utils.databricks_utils.is_in_databricks_runtime", return_value=True),
        mock.patch("IPython.get_ipython", return_value=None),
    ):
        signature = infer_signature(_CHAT_REQUEST, _STRING_RESPONSE)
        assert not _should_render_agent_eval_template(signature)


def test_generate_agent_eval_recipe():
    expected_html = (Path(__file__).parent / "resources" / "agent_eval_recipe.html").read_text()
    assert _generate_agent_eval_recipe("runs:/1/model") == expected_html
```

--------------------------------------------------------------------------------

````
