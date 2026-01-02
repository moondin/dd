---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 969
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 969 of 991)

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

---[FILE: test_model_registry_client.py]---
Location: mlflow-master/tests/tracking/_model_registry/test_model_registry_client.py

```python
"""
Simple unit tests to confirm that ModelRegistryClient properly calls the registry Store methods
and returns values when required.
"""

from unittest import mock
from unittest.mock import ANY

import pytest

from mlflow.entities.model_registry import (
    ModelVersion,
    ModelVersionTag,
    RegisteredModel,
    RegisteredModelTag,
)
from mlflow.exceptions import MlflowException
from mlflow.store.entities.paged_list import PagedList
from mlflow.store.model_registry import (
    SEARCH_MODEL_VERSION_MAX_RESULTS_DEFAULT,
    SEARCH_REGISTERED_MODEL_MAX_RESULTS_DEFAULT,
)
from mlflow.store.model_registry.sqlalchemy_store import SqlAlchemyStore
from mlflow.tracking._model_registry.client import ModelRegistryClient


@pytest.fixture
def mock_store():
    mock_store = mock.MagicMock()
    mock_store.create_model_version = mock.create_autospec(SqlAlchemyStore.create_model_version)
    with mock.patch("mlflow.tracking._model_registry.utils._get_store", return_value=mock_store):
        yield mock_store


def newModelRegistryClient(registry_uri="uri:/fake"):
    return ModelRegistryClient(registry_uri, "uri:/fake")


def _model_version(
    name, version, stage, source="some:/source", run_id="run13579", tags=None, aliases=None
):
    return ModelVersion(
        name,
        version,
        "2345671890",
        "234567890",
        "some description",
        "UserID",
        stage,
        source,
        run_id,
        tags=tags,
        aliases=aliases,
    )


# Registered Model API
def test_create_registered_model(mock_store):
    tags_dict = {"key": "value", "another key": "some other value"}
    tags = [RegisteredModelTag(key, value) for key, value in tags_dict.items()]
    description = "such a great model"
    mock_store.create_registered_model.return_value = RegisteredModel(
        "Model 1", tags=tags, description=description
    )
    result = newModelRegistryClient().create_registered_model("Model 1", tags_dict, description)
    mock_store.create_registered_model.assert_called_once_with("Model 1", tags, description, None)
    assert result.name == "Model 1"
    assert result.tags == tags_dict


def test_update_registered_model(mock_store):
    name = "Model 1"
    new_description = "New Description"
    new_description_2 = "New Description 2"
    mock_store.update_registered_model.return_value = RegisteredModel(
        name, description=new_description
    )

    result = newModelRegistryClient().update_registered_model(
        name=name, description=new_description
    )
    mock_store.update_registered_model.assert_called_with(
        name=name, description=new_description, deployment_job_id=None
    )
    assert result.description == new_description

    mock_store.update_registered_model.return_value = RegisteredModel(
        name, description=new_description_2
    )
    result = newModelRegistryClient().update_registered_model(
        name=name, description=new_description_2
    )
    mock_store.update_registered_model.assert_called_with(
        name=name, description="New Description 2", deployment_job_id=None
    )
    assert result.description == new_description_2


def test_rename_registered_model(mock_store):
    name = "Model 1"
    new_name = "New Name"
    mock_store.rename_registered_model.return_value = RegisteredModel(new_name)
    result = newModelRegistryClient().rename_registered_model(name=name, new_name=new_name)
    mock_store.rename_registered_model.assert_called_with(name=name, new_name=new_name)
    assert result.name == "New Name"

    mock_store.rename_registered_model.return_value = RegisteredModel("New Name 2")
    result = newModelRegistryClient().rename_registered_model(name=name, new_name="New Name 2")
    mock_store.rename_registered_model.assert_called_with(name=name, new_name="New Name 2")
    assert result.name == "New Name 2"


def test_update_registered_model_validation_errors_on_empty_new_name(mock_store):
    with pytest.raises(MlflowException, match="The name must not be an empty string"):
        newModelRegistryClient().rename_registered_model("Model 1", " ")


def test_delete_registered_model(mock_store):
    newModelRegistryClient().delete_registered_model("Model 1")
    mock_store.delete_registered_model.assert_called_once()


def test_search_registered_models(mock_store):
    mock_store.search_registered_models.return_value = PagedList(
        [RegisteredModel("Model 1"), RegisteredModel("Model 2")], ""
    )
    result = newModelRegistryClient().search_registered_models(filter_string="test filter")
    prompt_filter = "tag.`mlflow.prompt.is_prompt` != 'true'"
    mock_store.search_registered_models.assert_called_with(
        f"test filter AND {prompt_filter}", SEARCH_REGISTERED_MODEL_MAX_RESULTS_DEFAULT, None, None
    )
    assert len(result) == 2
    assert result.token == ""

    result = newModelRegistryClient().search_registered_models(
        filter_string="another filter",
        max_results=12,
        order_by=["A", "B DESC"],
        page_token="next one",
    )
    mock_store.search_registered_models.assert_called_with(
        f"another filter AND {prompt_filter}", 12, ["A", "B DESC"], "next one"
    )
    assert len(result) == 2
    assert result.token == ""

    mock_store.search_registered_models.return_value = PagedList(
        [RegisteredModel("model A"), RegisteredModel("Model zz"), RegisteredModel("Model b")],
        "page 2 token",
    )
    result = newModelRegistryClient().search_registered_models(max_results=5)
    mock_store.search_registered_models.assert_called_with(prompt_filter, 5, None, None)
    assert [rm.name for rm in result] == ["model A", "Model zz", "Model b"]
    assert result.token == "page 2 token"


def test_search_registered_models_unity_catalog_no_prompt_filter(mock_store):
    mock_store.search_registered_models.return_value = PagedList(
        [RegisteredModel("Model 1"), RegisteredModel("Model 2")], ""
    )

    result = newModelRegistryClient(
        "databricks-uc://scope:key@workspace"
    ).search_registered_models()

    mock_store.search_registered_models.assert_called_with(
        None,  # No filter at all
        SEARCH_REGISTERED_MODEL_MAX_RESULTS_DEFAULT,
        None,
        None,
    )
    assert len(result) == 2
    assert result.token == ""


def test_search_registered_models_non_unity_catalog_with_prompt_filter(mock_store):
    mock_store.search_registered_models.return_value = PagedList([RegisteredModel("Model 1")], "")
    prompt_filter = "tag.`mlflow.prompt.is_prompt` != 'true'"

    newModelRegistryClient("sqlite:///path/to/db").search_registered_models(
        filter_string="test filter"
    )

    mock_store.search_registered_models.assert_called_with(
        f"test filter AND {prompt_filter}", SEARCH_REGISTERED_MODEL_MAX_RESULTS_DEFAULT, None, None
    )


def test_get_registered_model_details(mock_store):
    name = "Model 1"
    tags = [
        RegisteredModelTag("key", "value"),
        RegisteredModelTag("another key", "some other value"),
    ]
    mock_store.get_registered_model.return_value = RegisteredModel(
        name,
        "1263283747835",
        "1283168374623874",
        "I am a model",
        [
            _model_version("Model 1", 3, "None"),
            _model_version("Model 1", 2, "Staging"),
            _model_version("Model 1", 1, "Production"),
        ],
        tags=tags,
    )
    result = newModelRegistryClient().get_registered_model(name)
    mock_store.get_registered_model.assert_called_once()
    assert result.name == name
    assert len(result.latest_versions) == 3
    assert result.tags == {tag.key: tag.value for tag in tags}


def test_get_latest_versions(mock_store):
    mock_store.get_latest_versions.return_value = [
        _model_version("Model 1", 3, "None"),
        _model_version("Model 1", 2, "Staging"),
        _model_version("Model 1", 1, "Production"),
    ]
    result = newModelRegistryClient().get_latest_versions("Model 1", ["Stage1", "Stage2"])
    mock_store.get_latest_versions.assert_called_once_with(ANY, ["Stage1", "Stage2"])
    assert len(result) == 3


def test_set_registered_model_tag(mock_store):
    newModelRegistryClient().set_registered_model_tag("Model 1", "key", "value")
    mock_store.set_registered_model_tag.assert_called_once()


def test_delete_registered_model_tag(mock_store):
    newModelRegistryClient().delete_registered_model_tag("Model 1", "key")
    mock_store.delete_registered_model_tag.assert_called_once()


# Model Version API
@pytest.mark.parametrize(
    "await_time",
    [1, 10, None, 0, -1],
)
def test_await_model_version_creation(mock_store, await_time):
    name = "Model 1"
    version = "1"

    mv = ModelVersion(
        name=name, version=version, creation_timestamp=123, status="PENDING_REGISTRATION"
    )
    mock_store.create_model_version.return_value = mv

    newModelRegistryClient().create_model_version(
        name, "uri:/source", "run123", await_creation_for=await_time
    )
    if await_time and await_time > 0:
        mock_store._await_model_version_creation.assert_called_once_with(mv, await_time)
    else:
        mock_store._await_model_version_creation.assert_not_called()


def test_create_model_version_does_not_wait_when_await_creation_param_is_false(mock_store):
    name = "Model 1"
    version = "1"

    mock_store.create_model_version.return_value = ModelVersion(
        name=name, version=version, creation_timestamp=123, status="PENDING_REGISTRATION"
    )

    result = newModelRegistryClient().create_model_version(
        name, "uri:/source", "run123", await_creation_for=None
    )
    result = newModelRegistryClient().create_model_version(
        name, "uri:/source", "run123", await_creation_for=0
    )

    mock_store.get_model_version.assert_not_called()

    assert result.name == name
    assert result.version == version


def test_create_model_version(mock_store):
    name = "Model 1"
    version = "1"
    tags_dict = {"key": "value", "another key": "some other value"}
    tags = [ModelVersionTag(key, value) for key, value in tags_dict.items()]
    description = "best model ever"

    mock_store.create_model_version.return_value = ModelVersion(
        name=name,
        version=version,
        creation_timestamp=123,
        tags=tags,
        run_link=None,
        description=description,
    )
    result = newModelRegistryClient().create_model_version(
        name, "uri:/for/source", "run123", tags_dict, None, description
    )
    mock_store.create_model_version.assert_called_once_with(
        name,
        "uri:/for/source",
        "run123",
        tags,
        None,
        description,
        local_model_path=None,
        model_id=None,
    )

    assert result.name == name
    assert result.version == version
    assert result.tags == tags_dict


def test_create_model_version_no_run_id(mock_store):
    name = "Model 1"
    version = "1"
    tags_dict = {"key": "value", "another key": "some other value"}
    tags = [ModelVersionTag(key, value) for key, value in tags_dict.items()]
    description = "best model ever"

    mock_store.create_model_version.return_value = ModelVersion(
        name=name,
        version=version,
        creation_timestamp=123,
        tags=tags,
        run_link=None,
        description=description,
    )
    result = newModelRegistryClient().create_model_version(
        name, "uri:/for/source", tags=tags_dict, run_link=None, description=description
    )
    mock_store.create_model_version.assert_called_once_with(
        name, "uri:/for/source", None, tags, None, description, local_model_path=None, model_id=None
    )

    assert result.name == name
    assert result.version == version
    assert result.tags == tags_dict
    assert result.run_id is None


def test_update_model_version(mock_store):
    name = "Model 1"
    version = "12"
    description = "new description"
    expected_result = ModelVersion(name, version, creation_timestamp=123, description=description)
    mock_store.update_model_version.return_value = expected_result
    actual_result = newModelRegistryClient().update_model_version(name, version, "new description")
    mock_store.update_model_version.assert_called_once_with(
        name=name, version=version, description="new description"
    )
    assert expected_result == actual_result


def test_transition_model_version_stage(mock_store):
    name = "Model 1"
    version = "12"
    stage = "Production"
    expected_result = ModelVersion(name, version, creation_timestamp=123, current_stage=stage)
    mock_store.transition_model_version_stage.return_value = expected_result
    actual_result = newModelRegistryClient().transition_model_version_stage(name, version, stage)
    mock_store.transition_model_version_stage.assert_called_once_with(
        name=name, version=version, stage=stage, archive_existing_versions=False
    )
    assert expected_result == actual_result


def test_transition_model_version_stage_validation_errors(mock_store):
    with pytest.raises(MlflowException, match="The stage must not be an empty string"):
        newModelRegistryClient().transition_model_version_stage("Model 1", "12", stage=" ")


def test_delete_model_version(mock_store):
    newModelRegistryClient().delete_model_version("Model 1", 12)
    mock_store.delete_model_version.assert_called_once()


def test_get_model_version_details(mock_store):
    tags = [ModelVersionTag("key", "value"), ModelVersionTag("another key", "some other value")]
    mock_store.get_model_version.return_value = _model_version(
        "Model 1", "12", "Production", tags=tags
    )
    result = newModelRegistryClient().get_model_version("Model 1", "12")
    mock_store.get_model_version.assert_called_once()
    assert result.name == "Model 1"
    assert result.tags == {tag.key: tag.value for tag in tags}


def test_get_model_version_download_uri(mock_store):
    mock_store.get_model_version_download_uri.return_value = "some:/uri/here"
    result = newModelRegistryClient().get_model_version_download_uri("Model 1", 12)
    mock_store.get_model_version_download_uri.assert_called_once()
    assert result == "some:/uri/here"


def test_search_model_versions(mock_store):
    mvs = [
        ModelVersion(
            name="Model 1", version="1", creation_timestamp=123, last_updated_timestamp=123
        ),
        ModelVersion(
            name="Model 1", version="2", creation_timestamp=124, last_updated_timestamp=124
        ),
        ModelVersion(
            name="Model 2", version="1", creation_timestamp=125, last_updated_timestamp=125
        ),
    ]
    mock_store.search_model_versions.return_value = PagedList(mvs[:2][::-1], "")
    result = newModelRegistryClient().search_model_versions("name=Model 1")
    mock_store.search_model_versions.assert_called_with(
        "name=Model 1", SEARCH_MODEL_VERSION_MAX_RESULTS_DEFAULT, None, None
    )
    assert result == mvs[:2][::-1]
    assert result.token == ""

    mock_store.search_model_versions.return_value = PagedList([mvs[1], mvs[2], mvs[0]], "")
    result = newModelRegistryClient().search_model_versions(
        "version <= 2", max_results=2, order_by="version DESC", page_token="next"
    )
    mock_store.search_model_versions.assert_called_with("version <= 2", 2, "version DESC", "next")
    assert result == [mvs[1], mvs[2], mvs[0]]
    assert result.token == ""


def test_get_model_version_stages(mock_store):
    mock_store.get_model_version_stages.return_value = ["Stage A", "Stage B"]
    result = newModelRegistryClient().get_model_version_stages("Model 1", 1)
    mock_store.get_model_version_stages.assert_called_once()
    assert len(result) == 2
    assert "Stage A" in result
    assert "Stage B" in result


def test_set_model_version_tag(mock_store):
    newModelRegistryClient().set_model_version_tag("Model 1", "1", "key", "value")
    mock_store.set_model_version_tag.assert_called_once()


def test_delete_model_version_tag(mock_store):
    newModelRegistryClient().delete_model_version_tag("Model 1", "1", "key")
    mock_store.delete_model_version_tag.assert_called_once()


def test_set_registered_model_alias(mock_store):
    newModelRegistryClient().set_registered_model_alias("Model 1", "test_alias", "1")
    mock_store.set_registered_model_alias.assert_called_once()


def test_delete_registered_model_alias(mock_store):
    newModelRegistryClient().delete_registered_model_alias("Model 1", "test_alias")
    mock_store.delete_registered_model_alias.assert_called_once()


def test_get_model_version_by_alias(mock_store):
    mock_store.get_model_version_by_alias.return_value = _model_version(
        "Model 1", "12", "Production", aliases=["test_alias"]
    )
    result = newModelRegistryClient().get_model_version_by_alias("Model 1", "test_alias")
    mock_store.get_model_version_by_alias.assert_called_once()
    assert result.name == "Model 1"
    assert result.aliases == ["test_alias"]


def test_search_registered_models_excludes_chat_prompts(mock_store):
    # This test ensures the prompt filter logic works with new prompt types
    mock_store.search_registered_models.return_value = PagedList(
        [RegisteredModel("Model 1"), RegisteredModel("Model 2")], ""
    )

    client = newModelRegistryClient()
    client.search_registered_models(filter_string="test filter")

    prompt_filter = "tag.`mlflow.prompt.is_prompt` != 'true'"
    mock_store.search_registered_models.assert_called_with(
        f"test filter AND {prompt_filter}",
        SEARCH_REGISTERED_MODEL_MAX_RESULTS_DEFAULT,
        None,
        None,
    )


def test_search_registered_models_excludes_text_prompts(mock_store):
    mock_store.search_registered_models.return_value = PagedList([RegisteredModel("Model 1")], "")

    client = newModelRegistryClient()
    client.search_registered_models()

    prompt_filter = "tag.`mlflow.prompt.is_prompt` != 'true'"
    mock_store.search_registered_models.assert_called_with(
        prompt_filter, SEARCH_REGISTERED_MODEL_MAX_RESULTS_DEFAULT, None, None
    )


def test_search_registered_models_excludes_prompts_with_response_format(mock_store):
    mock_store.search_registered_models.return_value = PagedList([RegisteredModel("Model 1")], "")

    client = newModelRegistryClient()
    client.search_registered_models(filter_string="name='test'")

    prompt_filter = "tag.`mlflow.prompt.is_prompt` != 'true'"
    mock_store.search_registered_models.assert_called_with(
        f"name='test' AND {prompt_filter}",
        SEARCH_REGISTERED_MODEL_MAX_RESULTS_DEFAULT,
        None,
        None,
    )


def test_search_registered_models_preserves_existing_prompt_filter(mock_store):
    mock_store.search_registered_models.return_value = PagedList([RegisteredModel("Model 1")], "")

    client = newModelRegistryClient()
    # Test with existing prompt filter
    client.search_registered_models(filter_string="tag.`mlflow.prompt.is_prompt` != 'true'")

    # Should not add duplicate filter
    mock_store.search_registered_models.assert_called_with(
        "tag.`mlflow.prompt.is_prompt` != 'true'",
        SEARCH_REGISTERED_MODEL_MAX_RESULTS_DEFAULT,
        None,
        None,
    )


def test_search_registered_models_with_complex_filter(mock_store):
    mock_store.search_registered_models.return_value = PagedList([RegisteredModel("Model 1")], "")

    client = newModelRegistryClient()
    complex_filter = "name LIKE 'test%' AND tag.environment = 'prod'"
    client.search_registered_models(filter_string=complex_filter)

    prompt_filter = "tag.`mlflow.prompt.is_prompt` != 'true'"
    expected_filter = f"{complex_filter} AND {prompt_filter}"
    mock_store.search_registered_models.assert_called_with(
        expected_filter, SEARCH_REGISTERED_MODEL_MAX_RESULTS_DEFAULT, None, None
    )


def test_search_registered_models_with_pagination(mock_store):
    mock_store.search_registered_models.return_value = PagedList(
        [RegisteredModel("Model 1")], "next_token"
    )

    client = newModelRegistryClient()
    client.search_registered_models(
        filter_string="name='test'",
        max_results=10,
        order_by=["name"],
        page_token="prev_token",
    )

    prompt_filter = "tag.`mlflow.prompt.is_prompt` != 'true'"
    mock_store.search_registered_models.assert_called_with(
        f"name='test' AND {prompt_filter}", 10, ["name"], "prev_token"
    )
```

--------------------------------------------------------------------------------

---[FILE: test_model_registry_fluent.py]---
Location: mlflow-master/tests/tracking/_model_registry/test_model_registry_fluent.py

```python
import os
import subprocess
from pathlib import Path
from unittest import mock

import pytest
import requests

import mlflow
import mlflow.tracking._model_registry.fluent
from mlflow import MlflowClient, register_model
from mlflow.entities.model_registry import ModelVersion, RegisteredModel
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import (
    ALREADY_EXISTS,
    INTERNAL_ERROR,
    RESOURCE_ALREADY_EXISTS,
)
from mlflow.tracking._model_registry import DEFAULT_AWAIT_MAX_SLEEP_SECONDS
from mlflow.utils.databricks_utils import DatabricksRuntimeVersion
from mlflow.utils.env_pack import EnvPackConfig


def test_register_model_with_runs_uri():
    class TestModel(mlflow.pyfunc.PythonModel):
        def predict(self, model_input):
            return model_input

    with mlflow.start_run() as run:
        mlflow.pyfunc.log_model(name="model", python_model=TestModel())

    register_model(f"runs:/{run.info.run_id}/model", "Model 1")
    mv = MlflowClient().get_model_version("Model 1", "1")
    assert mv.name == "Model 1"


def test_register_model_with_non_runs_uri():
    create_model_patch = mock.patch.object(
        MlflowClient, "create_registered_model", return_value=RegisteredModel("Model 1")
    )
    create_version_patch = mock.patch.object(
        MlflowClient,
        "_create_model_version",
        return_value=ModelVersion("Model 1", "1", creation_timestamp=123),
    )
    with create_model_patch, create_version_patch:
        register_model("s3:/some/path/to/model", "Model 1")
        MlflowClient.create_registered_model.assert_called_once_with("Model 1")
        MlflowClient._create_model_version.assert_called_once_with(
            name="Model 1",
            run_id=None,
            tags=None,
            source="s3:/some/path/to/model",
            await_creation_for=DEFAULT_AWAIT_MAX_SLEEP_SECONDS,
            local_model_path=None,
            model_id=None,
        )


@pytest.mark.parametrize("error_code", [RESOURCE_ALREADY_EXISTS, ALREADY_EXISTS])
def test_register_model_with_existing_registered_model(error_code):
    create_model_patch = mock.patch.object(
        MlflowClient,
        "create_registered_model",
        side_effect=MlflowException("Some Message", error_code),
    )
    create_version_patch = mock.patch.object(
        MlflowClient,
        "_create_model_version",
        return_value=ModelVersion("Model 1", "1", creation_timestamp=123),
    )
    with create_model_patch, create_version_patch:
        register_model("s3:/some/path/to/model", "Model 1")
        MlflowClient.create_registered_model.assert_called_once_with("Model 1")
        MlflowClient._create_model_version.assert_called_once_with(
            name="Model 1",
            run_id=None,
            source="s3:/some/path/to/model",
            tags=None,
            await_creation_for=DEFAULT_AWAIT_MAX_SLEEP_SECONDS,
            local_model_path=None,
            model_id=None,
        )


def test_register_model_with_unexpected_mlflow_exception_in_create_registered_model():
    with mock.patch.object(
        MlflowClient,
        "create_registered_model",
        side_effect=MlflowException("Dunno", INTERNAL_ERROR),
    ) as mock_create_registered_model:
        with pytest.raises(MlflowException, match="Dunno"):
            register_model("s3:/some/path/to/model", "Model 1")
        mock_create_registered_model.assert_called_once_with("Model 1")


def test_register_model_with_unexpected_exception_in_create_registered_model():
    with mock.patch.object(
        MlflowClient, "create_registered_model", side_effect=Exception("Dunno")
    ) as create_registered_model_mock:
        with pytest.raises(Exception, match="Dunno"):
            register_model("s3:/some/path/to/model", "Model 1")
        create_registered_model_mock.assert_called_once_with("Model 1")


def test_register_model_with_tags():
    tags = {"a": "1"}

    class TestModel(mlflow.pyfunc.PythonModel):
        def predict(self, model_input):
            return model_input

    with mlflow.start_run() as run:
        mlflow.pyfunc.log_model(name="model", python_model=TestModel())

    register_model(f"runs:/{run.info.run_id}/model", "Model 1", tags=tags)
    mv = MlflowClient().get_model_version("Model 1", "1")
    assert mv.tags == tags


def test_register_model_prints_uc_model_version_url(monkeypatch):
    orig_registry_uri = mlflow.get_registry_uri()
    mlflow.set_registry_uri("databricks-uc")
    workspace_id = "123"
    model_id = "m-123"
    name = "name.mlflow.test_model"
    version = "1"
    with (
        mock.patch("mlflow.tracking._model_registry.fluent.eprint") as mock_eprint,
        mock.patch(
            "mlflow.tracking._model_registry.fluent.get_workspace_url",
            return_value="https://databricks.com",
        ) as mock_url,
        mock.patch(
            "mlflow.tracking._model_registry.fluent.get_workspace_id",
            return_value=workspace_id,
        ) as mock_workspace_id,
        mock.patch(
            "mlflow.MlflowClient.create_registered_model",
            return_value=RegisteredModel(name),
        ) as mock_create_model,
        mock.patch(
            "mlflow.MlflowClient._create_model_version",
            return_value=ModelVersion(name, version, creation_timestamp=123),
        ) as mock_create_version,
        mock.patch(
            "mlflow.MlflowClient.get_logged_model",
            return_value=mock.Mock(model_id=model_id, name=name, tags={}),
        ) as mock_get_logged_model,
        mock.patch("mlflow.MlflowClient.set_logged_model_tags") as mock_set_logged_model_tags,
    ):
        register_model(f"models:/{model_id}", name)
        expected_url = (
            "https://databricks.com/explore/data/models/name/mlflow/test_model/version/1?o=123"
        )
        mock_eprint.assert_called_with(
            f"🔗 Created version '{version}' of model '{name}': {expected_url}"
        )
        mock_url.assert_called_once()
        mock_workspace_id.assert_called_once()
        mock_create_model.assert_called_once()
        mock_create_version.assert_called_once()
        mock_get_logged_model.assert_called_once()
        mock_set_logged_model_tags.assert_called_once()

        # Test that the URL is not printed when the environment variable is set to false
        mock_eprint.reset_mock()
        monkeypatch.setenv("MLFLOW_PRINT_MODEL_URLS_ON_CREATION", "false")
        register_model(f"models:/{model_id}", name)
        mock_eprint.assert_called_with("Created version '1' of model 'name.mlflow.test_model'.")

    # Clean up the global variables set by the server
    mlflow.set_registry_uri(orig_registry_uri)


def test_set_model_version_tag():
    class TestModel(mlflow.pyfunc.PythonModel):
        def predict(self, model_input):
            return model_input

    mlflow.pyfunc.log_model(name="model", python_model=TestModel(), registered_model_name="Model 1")

    mv = MlflowClient().get_model_version("Model 1", "1")
    assert mv.tags == {}
    mlflow.set_model_version_tag(
        name="Model 1",
        version=1,
        key="key",
        value="value",
    )
    mv = MlflowClient().get_model_version("Model 1", "1")
    assert mv.tags == {"key": "value"}


def test_register_model_with_2_x_model(tmp_path: Path):
    tracking_uri = (tmp_path / "tracking").as_uri()
    mlflow.set_tracking_uri(tracking_uri)
    artifact_location = (tmp_path / "artifacts").as_uri()
    exp_id = mlflow.create_experiment("test", artifact_location=artifact_location)
    mlflow.set_experiment(experiment_id=exp_id)
    code = """
import sys
import mlflow

assert mlflow.__version__.startswith("2."), mlflow.__version__

with mlflow.start_run() as run:
    model_info = mlflow.pyfunc.log_model(
        python_model=lambda *args: None,
        artifact_path="model",
        # When `python_model` is a function, either `input_example` or `pip_requirements`
        # must be provided.
        pip_requirements=["mlflow"],
    )
    assert model_info.model_uri.startswith("runs:/")
    out = sys.argv[1]
    with open(out, "w") as f:
        f.write(model_info.model_uri)
"""
    out = tmp_path / "output.txt"
    # Log a model using MLflow 2.x
    subprocess.check_call(
        [
            "uv",
            "run",
            "--isolated",
            "--no-project",
            "--with",
            "mlflow<3",
            "python",
            "-I",
            "-c",
            code,
            out,
        ],
        env=os.environ.copy() | {"UV_INDEX_STRATEGY": "unsafe-first-match"},
    )
    # Register the model with MLflow 3.x
    model_uri = out.read_text().strip()
    mlflow.register_model(model_uri, "model")


@pytest.fixture
def mock_dbr_version():
    """Mock DatabricksRuntimeVersion to simulate a supported client image."""
    with mock.patch(
        "mlflow.utils.databricks_utils.DatabricksRuntimeVersion.parse",
        return_value=DatabricksRuntimeVersion(
            is_client_image=True,
            major=2,  # Supported version
            minor=0,
        ),
    ):
        yield


def test_register_model_with_env_pack(tmp_path, mock_dbr_version):
    # Mock download_artifacts to return a path
    mock_artifacts_dir = tmp_path / "artifacts"
    mock_artifacts_dir.mkdir()
    (mock_artifacts_dir / "requirements.txt").write_text("numpy==1.21.0")

    with (
        mock.patch(
            "mlflow.utils.env_pack.download_artifacts",
            return_value=str(mock_artifacts_dir),
        ),
        mock.patch("subprocess.run", return_value=mock.Mock(returncode=0)),
        mock.patch(
            "mlflow.tracking._model_registry.fluent.pack_env_for_databricks_model_serving"
        ) as mock_pack_env,
        mock.patch(
            "mlflow.tracking._model_registry.fluent.stage_model_for_databricks_model_serving"
        ) as mock_stage_model,
        mock.patch(
            "mlflow.MlflowClient._create_model_version",
            return_value=ModelVersion("Model 1", "1", creation_timestamp=123),
        ),
        mock.patch(
            "mlflow.MlflowClient.get_model_version",
            return_value=ModelVersion("Model 1", "1", creation_timestamp=123),
        ),
        mock.patch("mlflow.MlflowClient.log_model_artifacts") as mock_log_artifacts,
    ):
        # Set up the mock pack_env to yield a path
        mock_pack_env.return_value.__enter__.return_value = str(mock_artifacts_dir)

        # Call register_model with env_pack
        register_model("models:/test-model/1", "Model 1", env_pack="databricks_model_serving")

        # Verify pack_env was called with correct arguments
        mock_pack_env.assert_called_once_with(
            "models:/test-model/1",
            enforce_pip_requirements=True,
        )

        # Verify log_model_artifacts was called with correct arguments
        mock_log_artifacts.assert_called_once_with(
            None,
            str(mock_artifacts_dir),
        )

        # Verify stage_model was called with correct arguments
        mock_stage_model.assert_called_once_with(
            model_name="Model 1",
            model_version="1",
        )


@pytest.mark.parametrize("install_deps", [True, False])
def test_register_model_with_env_pack_config(tmp_path, install_deps):
    # Mock download_artifacts to return a path
    mock_artifacts_dir = tmp_path / "artifacts"
    mock_artifacts_dir.mkdir()
    (mock_artifacts_dir / "requirements.txt").write_text("numpy==1.21.0")

    with (
        mock.patch(
            "mlflow.utils.env_pack.download_artifacts",
            return_value=str(mock_artifacts_dir),
        ),
        mock.patch("subprocess.run", return_value=mock.Mock(returncode=0)),
        mock.patch(
            "mlflow.tracking._model_registry.fluent.pack_env_for_databricks_model_serving"
        ) as mock_pack_env,
        mock.patch(
            "mlflow.tracking._model_registry.fluent.stage_model_for_databricks_model_serving"
        ) as mock_stage_model,
        mock.patch(
            "mlflow.MlflowClient._create_model_version",
            return_value=ModelVersion("Model 1", "1", creation_timestamp=123),
        ),
        mock.patch(
            "mlflow.MlflowClient.get_model_version",
            return_value=ModelVersion("Model 1", "1", creation_timestamp=123),
        ),
        mock.patch("mlflow.MlflowClient.log_model_artifacts") as mock_log_artifacts,
    ):
        # Set up the mock pack_env to yield a path
        mock_pack_env.return_value.__enter__.return_value = str(mock_artifacts_dir)

        # Call register_model with env_pack
        register_model(
            "models:/test-model/1",
            "Model 1",
            env_pack=EnvPackConfig(
                name="databricks_model_serving", install_dependencies=install_deps
            ),
        )

        mock_pack_env.assert_called_once_with(
            "models:/test-model/1",
            enforce_pip_requirements=install_deps,
        )

        mock_log_artifacts.assert_called_once_with(
            None,
            str(mock_artifacts_dir),
        )

        mock_stage_model.assert_called_once_with(
            model_name="Model 1",
            model_version="1",
        )


def test_register_model_with_env_pack_staging_failure(tmp_path, mock_dbr_version):
    # Mock download_artifacts to return a path
    mock_artifacts_dir = tmp_path / "artifacts"
    mock_artifacts_dir.mkdir()
    (mock_artifacts_dir / "requirements.txt").write_text("numpy==1.21.0")

    with (
        mock.patch(
            "mlflow.utils.env_pack.download_artifacts",
            return_value=str(mock_artifacts_dir),
        ),
        mock.patch("subprocess.run", return_value=mock.Mock(returncode=0)),
        mock.patch(
            "mlflow.tracking._model_registry.fluent.pack_env_for_databricks_model_serving"
        ) as mock_pack_env,
        mock.patch(
            "mlflow.tracking._model_registry.fluent.stage_model_for_databricks_model_serving",
            side_effect=requests.exceptions.HTTPError("Staging failed"),
        ) as mock_stage_model,
        mock.patch(
            "mlflow.MlflowClient._create_model_version",
            return_value=ModelVersion("Model 1", "1", creation_timestamp=123),
        ),
        mock.patch(
            "mlflow.MlflowClient.get_model_version",
            return_value=ModelVersion("Model 1", "1", creation_timestamp=123),
        ),
        mock.patch("mlflow.MlflowClient.log_model_artifacts") as mock_log_artifacts,
        mock.patch("mlflow.tracking._model_registry.fluent.eprint") as mock_eprint,
    ):
        # Set up the mock pack_env to yield a path
        mock_pack_env.return_value.__enter__.return_value = str(mock_artifacts_dir)

        # Call register_model with env_pack
        register_model("models:/test-model/1", "Model 1", env_pack="databricks_model_serving")

        # Verify pack_env was called with correct arguments
        mock_pack_env.assert_called_once_with(
            "models:/test-model/1",
            enforce_pip_requirements=True,
        )

        # Verify log_model_artifacts was called with correct arguments
        mock_log_artifacts.assert_called_once_with(
            None,
            str(mock_artifacts_dir),
        )

        # Verify stage_model was called with correct arguments
        mock_stage_model.assert_called_once_with(
            model_name="Model 1",
            model_version="1",
        )

        # Verify warning message was printed
        mock_eprint.assert_any_call(
            "Failed to stage model for Databricks Model Serving: Staging failed. "
            "The model was registered successfully and is available for serving, but may take "
            "longer to deploy."
        )
```

--------------------------------------------------------------------------------

````
