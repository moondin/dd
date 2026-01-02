---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 926
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 926 of 991)

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

---[FILE: test_downstream_lineage.py]---
Location: mlflow-master/tests/store/lineage/test_downstream_lineage.py

```python
import base64
from unittest import mock

import pytest

import mlflow
from mlflow.protos.databricks_uc_registry_messages_pb2 import (
    EmitModelVersionLineageRequest,
    Entity,
    Job,
    LineageHeaderInfo,
    ModelVersionLineageDirection,
    ModelVersionLineageInfo,
    Notebook,
)
from mlflow.store._unity_catalog.lineage.constants import _DATABRICKS_LINEAGE_ID_HEADER
from mlflow.store._unity_catalog.registry.rest_store import UcModelRegistryStore
from mlflow.store.artifact.databricks_sdk_models_artifact_repo import (
    DatabricksSDKModelsArtifactRepository,
)
from mlflow.store.artifact.s3_artifact_repo import S3ArtifactRepository
from mlflow.store.artifact.unity_catalog_models_artifact_repo import (
    UnityCatalogModelsArtifactRepository,
)
from mlflow.utils.proto_json_utils import message_to_json


class SimpleModel(mlflow.pyfunc.PythonModel):
    def predict(self, context, model_input):
        return model_input.applymap(lambda x: x * 2)


@pytest.fixture
def store(mock_databricks_uc_host_creds):
    with mock.patch("mlflow.utils.databricks_utils.get_databricks_host_creds"):
        yield UcModelRegistryStore(store_uri="databricks-uc", tracking_uri="databricks")


def lineage_header_info_to_extra_headers(lineage_header_info):
    extra_headers = {}
    if lineage_header_info:
        header_json = message_to_json(lineage_header_info)
        header_base64 = base64.b64encode(header_json.encode())
        extra_headers[_DATABRICKS_LINEAGE_ID_HEADER] = header_base64
    return extra_headers


@pytest.mark.parametrize(
    ("is_in_notebook", "is_in_job", "notebook_id", "job_id"),
    [
        (True, True, None, None),
        (True, True, "1234", None),
        (True, True, None, "5678"),
        (True, True, "1234", "5678"),
        (False, False, "1234", "5678"),
    ],
)
def test_downstream_notebook_job_lineage(
    tmp_path, is_in_notebook, is_in_job, notebook_id, job_id, monkeypatch
):
    monkeypatch.setenv("DATABRICKS_HOST", "my-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "my-token")
    monkeypatch.setenv("MLFLOW_USE_DATABRICKS_SDK_MODEL_ARTIFACTS_REPO_FOR_UC", "false")
    model_dir = str(tmp_path.joinpath("model"))
    model_name = "mycatalog.myschema.mymodel"
    model_uri = f"models:/{model_name}/1"

    mock_artifact_repo = mock.MagicMock(autospec=S3ArtifactRepository)
    mock_artifact_repo.download_artifacts.return_value = model_dir

    entity_list = []
    if is_in_notebook and notebook_id:
        notebook_entity = Notebook(id=str(notebook_id))
        entity_list.append(Entity(notebook=notebook_entity))

    if is_in_job and job_id:
        job_entity = Job(id=str(job_id))
        entity_list.append(Entity(job=job_entity))

    expected_lineage_header_info = LineageHeaderInfo(entities=entity_list) if entity_list else None

    # Mock out all necessary dependency
    with (
        mock.patch(
            "mlflow.utils.databricks_utils.is_in_databricks_notebook",
            return_value=is_in_notebook,
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.is_in_databricks_runtime",
            return_value=is_in_notebook or is_in_job,
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.is_in_databricks_job",
            return_value=is_in_job,
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.get_notebook_id",
            return_value=notebook_id,
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.get_job_id",
            return_value=job_id,
        ),
        mock.patch("mlflow.get_registry_uri", return_value="databricks-uc"),
        mock.patch.object(
            UnityCatalogModelsArtifactRepository,
            "_get_blob_storage_path",
            return_value="fake_blob_storage_path",
        ),
        mock.patch(
            "mlflow.utils._unity_catalog_utils._get_artifact_repo_from_storage_info",
            return_value=mock_artifact_repo,
        ),
        mock.patch(
            "mlflow.utils.rest_utils.http_request",
            return_value=mock.MagicMock(status_code=200, text="{}"),
        ) as mock_http,
        mock.patch.object(
            mlflow.tracking.MlflowClient,
            "get_model_version",
            return_value=mock.Mock(model_id="m-123"),
        ),
    ):
        mlflow.pyfunc.save_model(path=model_dir, python_model=SimpleModel())
        mlflow.pyfunc.load_model(model_uri)
        extra_headers = lineage_header_info_to_extra_headers(expected_lineage_header_info)
        if is_in_notebook or is_in_job:
            mock_http.assert_any_call(
                host_creds=mock.ANY,
                endpoint=mock.ANY,
                method=mock.ANY,
                json=mock.ANY,
                extra_headers=extra_headers,
            )


def test_databricks_sdk_models_artifact_repo_lineage(tmp_path, monkeypatch):
    # Test that when using DatabricksSDKModelArtifactRepo, lineage is still emitted properly
    monkeypatch.setenv("DATABRICKS_HOST", "my-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "my-token")
    monkeypatch.setenv("MLFLOW_USE_DATABRICKS_SDK_MODEL_ARTIFACTS_REPO_FOR_UC", "true")

    with mock.patch(
        "mlflow.utils._unity_catalog_utils.call_endpoint",
    ) as mock_call_endpoint:
        uc_repo = UnityCatalogModelsArtifactRepository("models:/a.b.c/1", "databricks-uc")
        repo = uc_repo._get_artifact_repo()
        assert isinstance(repo, DatabricksSDKModelsArtifactRepository)

        req_body = message_to_json(
            EmitModelVersionLineageRequest(
                name="a.b.c",
                version="1",
                model_version_lineage_info=ModelVersionLineageInfo(
                    entities=[],
                    direction=ModelVersionLineageDirection.DOWNSTREAM,
                ),
            )
        )

        mock_call_endpoint.assert_any_call(
            host_creds=mock.ANY,
            endpoint=mock.ANY,
            method=mock.ANY,
            json_body=req_body,
            response_proto=mock.ANY,
        )
```

--------------------------------------------------------------------------------

---[FILE: test_abstract_store.py]---
Location: mlflow-master/tests/store/model_registry/test_abstract_store.py

```python
import json
import threading
import time
from unittest import mock

import pytest

from mlflow.entities.logged_model import LoggedModel
from mlflow.entities.logged_model_tag import LoggedModelTag
from mlflow.entities.model_registry.model_version import ModelVersion
from mlflow.entities.model_registry.model_version_tag import ModelVersionTag
from mlflow.entities.model_registry.prompt_version import PromptVersion
from mlflow.entities.run import Run
from mlflow.entities.run_data import RunData
from mlflow.entities.run_info import RunInfo
from mlflow.entities.run_tag import RunTag
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import RESOURCE_DOES_NOT_EXIST, ErrorCode
from mlflow.store.model_registry.abstract_store import AbstractStore
from mlflow.tracing.constant import TraceTagKey


class MockAbstractStore(AbstractStore):
    """Mock implementation of AbstractStore for testing."""

    def __init__(self):
        super().__init__()
        self.prompt_versions = {}
        self.model_versions = {}

    def get_prompt_version(self, name: str, version: str) -> PromptVersion:
        key = f"{name}:{version}"
        if key not in self.prompt_versions:
            raise MlflowException(
                f"Prompt version '{name}' version '{version}' not found",
                error_code=ErrorCode.Name(RESOURCE_DOES_NOT_EXIST),
            )
        return self.prompt_versions[key]

    def get_model_version(self, name: str, version: int) -> ModelVersion:
        key = f"{name}:{version}"
        if key not in self.model_versions:
            # Create a default model version for testing
            self.model_versions[key] = ModelVersion(
                name=name,
                version=str(version),
                creation_timestamp=1234567890,
                last_updated_timestamp=1234567890,
                description="Test model version",
                tags={},
            )
        return self.model_versions[key]

    def set_model_version_tag(self, name: str, version: int, tag: ModelVersionTag):
        """Mock implementation to set model version tags."""
        mv = self.get_model_version(name, version)
        if isinstance(mv.tags, dict):
            mv.tags[tag.key] = tag.value
        else:
            # Convert to dict if it's not already
            mv.tags = {tag.key: tag.value}

    def add_prompt_version(self, name: str, version: str):
        """Helper method to add prompt versions for testing."""
        # Convert version to integer for PromptVersion
        version_int = int(version[1:]) if version.startswith("v") else int(version)

        # Store using both formats to handle version lookups
        key_with_v = f"{name}:v{version_int}"
        key_without_v = f"{name}:{version_int}"

        prompt_version = PromptVersion(
            name=name,
            version=version_int,
            template="Test template",
            creation_timestamp=1234567890,
        )

        self.prompt_versions[key_with_v] = prompt_version
        self.prompt_versions[key_without_v] = prompt_version


@pytest.fixture
def store():
    return MockAbstractStore()


@pytest.fixture
def mock_tracking_store():
    with mock.patch("mlflow.tracking._get_store") as mock_get_store:
        mock_store = mock.Mock()
        mock_get_store.return_value = mock_store
        yield mock_store


def test_link_prompt_version_to_model_success(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt", "1")
    model_id = "model_123"

    # Mock logged model with no existing linked prompts
    logged_model = LoggedModel(
        experiment_id="exp_123",
        model_id=model_id,
        name="test_model",
        artifact_location="/path/to/model",
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567890,
        tags={},
    )
    mock_tracking_store.get_logged_model.return_value = logged_model

    # Execute
    store.link_prompt_version_to_model("test_prompt", "v1", model_id)

    # Verify
    mock_tracking_store.set_logged_model_tags.assert_called_once()
    call_args = mock_tracking_store.set_logged_model_tags.call_args
    assert call_args[0][0] == model_id

    logged_model_tags = call_args[0][1]
    assert len(logged_model_tags) == 1
    logged_model_tag = logged_model_tags[0]
    assert isinstance(logged_model_tag, LoggedModelTag)
    assert logged_model_tag.key == TraceTagKey.LINKED_PROMPTS

    expected_value = [{"name": "test_prompt", "version": "1"}]
    assert json.loads(logged_model_tag.value) == expected_value


def test_link_prompt_version_to_model_append_to_existing(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt", "1")
    model_id = "model_123"

    existing_prompts = [{"name": "existing_prompt", "version": "v1"}]
    logged_model = LoggedModel(
        experiment_id="exp_123",
        model_id=model_id,
        name="test_model",
        artifact_location="/path/to/model",
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567890,
        tags={TraceTagKey.LINKED_PROMPTS: json.dumps(existing_prompts)},
    )
    mock_tracking_store.get_logged_model.return_value = logged_model

    # Execute
    store.link_prompt_version_to_model("test_prompt", "v1", model_id)

    # Verify
    call_args = mock_tracking_store.set_logged_model_tags.call_args
    logged_model_tags = call_args[0][1]
    assert len(logged_model_tags) == 1
    logged_model_tag = logged_model_tags[0]

    expected_value = [
        {"name": "existing_prompt", "version": "v1"},
        {"name": "test_prompt", "version": "1"},
    ]
    assert json.loads(logged_model_tag.value) == expected_value


def test_link_prompt_version_to_model_no_model_found(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt", "1")
    mock_tracking_store.get_logged_model.return_value = None

    # Execute & Verify
    with pytest.raises(MlflowException, match="Could not find model with ID 'nonexistent_model'"):
        store.link_prompt_version_to_model("test_prompt", "v1", "nonexistent_model")


def test_link_prompt_version_to_model_prompt_not_found(store, mock_tracking_store):
    # Setup
    model_id = "model_123"
    logged_model = LoggedModel(
        experiment_id="exp_123",
        model_id=model_id,
        name="test_model",
        artifact_location="/path/to/model",
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567890,
        tags={},
    )
    mock_tracking_store.get_logged_model.return_value = logged_model

    # Execute & Verify
    with pytest.raises(
        MlflowException, match="Prompt version 'nonexistent_prompt' version 'v1' not found"
    ):
        store.link_prompt_version_to_model("nonexistent_prompt", "v1", model_id)


def test_link_prompt_version_to_model_invalid_json_tag(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt", "1")
    model_id = "model_123"

    logged_model = LoggedModel(
        experiment_id="exp_123",
        model_id=model_id,
        name="test_model",
        artifact_location="/path/to/model",
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567890,
        tags={TraceTagKey.LINKED_PROMPTS: "invalid json"},
    )
    mock_tracking_store.get_logged_model.return_value = logged_model

    # Execute & Verify
    with pytest.raises(MlflowException, match="Invalid JSON format for 'mlflow.linkedPrompts' tag"):
        store.link_prompt_version_to_model("test_prompt", "v1", model_id)


def test_link_prompt_version_to_model_invalid_format_tag(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt", "1")
    model_id = "model_123"

    logged_model = LoggedModel(
        experiment_id="exp_123",
        model_id=model_id,
        name="test_model",
        artifact_location="/path/to/model",
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567890,
        tags={TraceTagKey.LINKED_PROMPTS: json.dumps({"not": "a list"})},
    )
    mock_tracking_store.get_logged_model.return_value = logged_model

    # Execute & Verify
    with pytest.raises(MlflowException, match="Invalid format for 'mlflow.linkedPrompts' tag"):
        store.link_prompt_version_to_model("test_prompt", "v1", model_id)


def test_link_prompt_version_to_model_duplicate_prevention(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt", "1")
    model_id = "model_123"

    # Create a logged model that will be updated by the mocked set_logged_model_tags
    logged_model = LoggedModel(
        experiment_id="exp_123",
        model_id=model_id,
        name="test_model",
        artifact_location="/path/to/model",
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567890,
        tags={},
    )

    # Mock the behavior where set_logged_model_tags updates the model's tags
    def mock_set_tags(model_id, tags):
        for tag in tags:
            logged_model.tags[tag.key] = tag.value

    mock_tracking_store.get_logged_model.return_value = logged_model
    mock_tracking_store.set_logged_model_tags.side_effect = mock_set_tags

    # Execute - link the same prompt twice
    store.link_prompt_version_to_model("test_prompt", "v1", model_id)
    store.link_prompt_version_to_model("test_prompt", "v1", model_id)  # Should be idempotent

    # Verify set_logged_model_tags was called only once (second call should return early)
    assert mock_tracking_store.set_logged_model_tags.call_count == 1

    # Verify the tag contains only one entry
    tag_value = logged_model.tags[TraceTagKey.LINKED_PROMPTS]
    parsed_value = json.loads(tag_value)

    expected_value = [{"name": "test_prompt", "version": "1"}]
    assert parsed_value == expected_value


def test_link_prompt_version_to_model_thread_safety(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt_1", "1")
    store.add_prompt_version("test_prompt_2", "1")
    model_id = "model_123"

    # Create a shared logged model that will be updated
    logged_model = LoggedModel(
        experiment_id="exp_123",
        model_id=model_id,
        name="test_model",
        artifact_location="/path/to/model",
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567890,
        tags={},
    )

    # Mock behavior to simulate updating the model's tags
    def mock_set_tags(model_id, tags):
        # Simulate concurrent access with small delay
        time.sleep(0.01)
        for tag in tags:
            logged_model.tags[tag.key] = tag.value

    mock_tracking_store.get_logged_model.return_value = logged_model
    mock_tracking_store.set_logged_model_tags.side_effect = mock_set_tags

    # Define thread worker function
    def link_prompt(prompt_name):
        try:
            store.link_prompt_version_to_model(prompt_name, "v1", model_id)
        except Exception as e:
            # Store any exceptions for later verification
            exceptions.append(e)

    # Track exceptions from threads
    exceptions = []

    # Create and start threads
    threads = []
    for i in range(2):
        thread = threading.Thread(target=link_prompt, args=[f"test_prompt_{i + 1}"])
        threads.append(thread)
        thread.start()

    # Wait for all threads to complete
    for thread in threads:
        thread.join()

    # Verify no exceptions occurred
    assert len(exceptions) == 0, f"Thread exceptions: {exceptions}"

    # Verify final state contains both prompts (order may vary due to threading)
    final_tag_value = json.loads(logged_model.tags[TraceTagKey.LINKED_PROMPTS])

    expected_prompts = [
        {"name": "test_prompt_1", "version": "1"},
        {"name": "test_prompt_2", "version": "1"},
    ]
    assert len(final_tag_value) == 2
    for expected_prompt in expected_prompts:
        assert expected_prompt in final_tag_value


# Tests for link_prompt_version_to_run


def test_link_prompt_version_to_run_success(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt", "1")
    run_id = "run_123"

    # Mock run with no existing linked prompts
    run_data = RunData(metrics=[], params=[], tags={})
    run_info = RunInfo(
        run_id=run_id,
        experiment_id="exp_123",
        user_id="user_123",
        status="FINISHED",
        start_time=1234567890,
        end_time=1234567890,
        lifecycle_stage="active",
    )
    run = Run(run_info=run_info, run_data=run_data)
    mock_tracking_store.get_run.return_value = run

    # Execute
    store.link_prompt_version_to_run("test_prompt", "1", run_id)

    # Verify run tag was set
    mock_tracking_store.set_tag.assert_called_once()
    call_args = mock_tracking_store.set_tag.call_args
    assert call_args[0][0] == run_id

    run_tag = call_args[0][1]
    assert isinstance(run_tag, RunTag)
    assert run_tag.key == TraceTagKey.LINKED_PROMPTS

    expected_value = [{"name": "test_prompt", "version": "1"}]
    assert json.loads(run_tag.value) == expected_value


def test_link_prompt_version_to_run_append_to_existing(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt_1", "1")
    store.add_prompt_version("test_prompt_2", "1")
    run_id = "run_123"

    # Mock run with existing linked prompts
    existing_prompts = [{"name": "existing_prompt", "version": "1"}]
    run_data = RunData(
        metrics=[],
        params=[],
        tags=[RunTag(TraceTagKey.LINKED_PROMPTS, json.dumps(existing_prompts))],
    )
    run_info = RunInfo(
        run_id=run_id,
        experiment_id="exp_123",
        user_id="user_123",
        status="FINISHED",
        start_time=1234567890,
        end_time=1234567890,
        lifecycle_stage="active",
    )
    run = Run(run_info=run_info, run_data=run_data)
    mock_tracking_store.get_run.return_value = run

    # Execute
    store.link_prompt_version_to_run("test_prompt_1", "1", run_id)

    # Verify run tag was updated with both prompts
    mock_tracking_store.set_tag.assert_called_once()
    call_args = mock_tracking_store.set_tag.call_args

    run_tag = call_args[0][1]
    linked_prompts = json.loads(run_tag.value)

    expected_prompts = [
        {"name": "existing_prompt", "version": "1"},
        {"name": "test_prompt_1", "version": "1"},
    ]
    assert len(linked_prompts) == 2
    for expected_prompt in expected_prompts:
        assert expected_prompt in linked_prompts


def test_link_prompt_version_to_run_no_run_found(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt", "1")  # Use "1" instead of "v1"
    run_id = "nonexistent_run"

    mock_tracking_store.get_run.return_value = None

    # Execute and verify error
    with pytest.raises(MlflowException, match="Could not find run"):
        store.link_prompt_version_to_run("test_prompt", "1", run_id)


def test_link_prompt_version_to_run_prompt_not_found(store, mock_tracking_store):
    # Setup
    run_id = "run_123"

    run_data = RunData(metrics=[], params=[], tags={})
    run_info = RunInfo(
        run_id=run_id,
        experiment_id="exp_123",
        user_id="user_123",
        status="FINISHED",
        start_time=1234567890,
        end_time=1234567890,
        lifecycle_stage="active",
    )
    run = Run(run_info=run_info, run_data=run_data)
    mock_tracking_store.get_run.return_value = run

    # Execute and verify error
    with pytest.raises(MlflowException, match="not found"):
        store.link_prompt_version_to_run("nonexistent_prompt", "1", run_id)


def test_link_prompt_version_to_run_duplicate_prevention(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt", "1")
    run_id = "run_123"

    # Mock run with existing prompt already linked
    existing_prompts = [{"name": "test_prompt", "version": "1"}]
    run_data = RunData(
        metrics=[],
        params=[],
        tags=[RunTag(TraceTagKey.LINKED_PROMPTS, json.dumps(existing_prompts))],
    )
    run_info = RunInfo(
        run_id=run_id,
        experiment_id="exp_123",
        user_id="user_123",
        status="FINISHED",
        start_time=1234567890,
        end_time=1234567890,
        lifecycle_stage="active",
    )
    run = Run(run_info=run_info, run_data=run_data)
    mock_tracking_store.get_run.return_value = run

    # Execute - try to link the same prompt again
    store.link_prompt_version_to_run("test_prompt", "1", run_id)

    # Verify set_tag was not called since no change was needed
    mock_tracking_store.set_tag.assert_not_called()


def test_link_prompt_version_to_run_thread_safety(store, mock_tracking_store):
    # Setup
    store.add_prompt_version("test_prompt_1", "1")
    store.add_prompt_version("test_prompt_2", "1")
    run_id = "run_123"

    # Create a shared run that will be updated
    run_data = RunData(metrics=[], params=[], tags={})
    run_info = RunInfo(
        run_id=run_id,
        experiment_id="exp_123",
        user_id="user_123",
        status="FINISHED",
        start_time=1234567890,
        end_time=1234567890,
        lifecycle_stage="active",
    )
    run = Run(run_info=run_info, run_data=run_data)

    # Mock behavior to simulate updating the run's tags
    def mock_set_tag(run_id, tag):
        # Simulate concurrent access with small delay
        time.sleep(0.01)
        run.data.tags[tag.key] = tag.value

    mock_tracking_store.get_run.return_value = run
    mock_tracking_store.set_tag.side_effect = mock_set_tag

    # Define thread worker function
    def link_prompt(prompt_name):
        store.link_prompt_version_to_run(prompt_name, "1", run_id)

    # Execute concurrent linking
    threads = []
    for prompt_name in ["test_prompt_1", "test_prompt_2"]:
        thread = threading.Thread(target=link_prompt, args=(prompt_name,))
        threads.append(thread)
        thread.start()

    # Wait for all threads to complete
    for thread in threads:
        thread.join()

    # Verify both prompts were linked
    final_tag_value = json.loads(run.data.tags[TraceTagKey.LINKED_PROMPTS])

    expected_prompts = [
        {"name": "test_prompt_1", "version": "1"},
        {"name": "test_prompt_2", "version": "1"},
    ]
    assert len(final_tag_value) == 2
    for expected_prompt in expected_prompts:
        assert expected_prompt in final_tag_value


def test_link_chat_prompt_to_model(store, mock_tracking_store):
    # Create chat prompt
    chat_template = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello {{name}}!"},
    ]

    prompt_version = PromptVersion("test_chat", 1, chat_template)
    store.prompt_versions["test_chat:1"] = prompt_version

    # Test linking
    model_id = "model_123"
    logged_model = LoggedModel(
        experiment_id="exp_123",
        model_id=model_id,
        name="test_model",
        artifact_location="/path/to/model",
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567890,
        tags={},
    )

    mock_tracking_store.get_logged_model.return_value = logged_model

    store.link_prompt_version_to_model("test_chat", "1", model_id)

    # Verify linking worked
    mock_tracking_store.set_logged_model_tags.assert_called_once()
    call_args = mock_tracking_store.set_logged_model_tags.call_args
    logged_model_tags = call_args[0][1]
    assert len(logged_model_tags) == 1

    tag_value = json.loads(logged_model_tags[0].value)
    assert tag_value == [{"name": "test_chat", "version": "1"}]


def test_link_prompt_with_response_format_to_model(store, mock_tracking_store):
    response_format = {"type": "string", "description": "A response"}
    prompt_version = PromptVersion(
        "test_response", 1, "Hello {{name}}!", response_format=response_format
    )

    store.prompt_versions["test_response:1"] = prompt_version

    model_id = "model_123"
    logged_model = LoggedModel(
        experiment_id="exp_123",
        model_id=model_id,
        name="test_model",
        artifact_location="/path/to/model",
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567890,
        tags={},
    )

    mock_tracking_store.get_logged_model.return_value = logged_model

    store.link_prompt_version_to_model("test_response", "1", model_id)

    # Verify linking worked
    mock_tracking_store.set_logged_model_tags.assert_called_once()
    call_args = mock_tracking_store.set_logged_model_tags.call_args
    logged_model_tags = call_args[0][1]
    assert len(logged_model_tags) == 1

    tag_value = json.loads(logged_model_tags[0].value)
    assert tag_value == [{"name": "test_response", "version": "1"}]


def test_link_chat_prompt_to_run(store, mock_tracking_store):
    chat_template = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello {{name}}!"},
    ]

    prompt_version = PromptVersion("test_chat", 1, chat_template)
    store.prompt_versions["test_chat:1"] = prompt_version

    run_id = "run_123"
    run_data = RunData(metrics=[], params=[], tags={})
    run_info = RunInfo(
        run_id=run_id,
        experiment_id="exp_123",
        user_id="user_123",
        status="FINISHED",
        start_time=1234567890,
        end_time=1234567890,
        lifecycle_stage="active",
    )
    run = Run(run_info=run_info, run_data=run_data)

    mock_tracking_store.get_run.return_value = run

    store.link_prompt_version_to_run("test_chat", "1", run_id)

    # Verify linking worked
    mock_tracking_store.set_tag.assert_called_once()
    call_args = mock_tracking_store.set_tag.call_args
    run_tag = call_args[0][1]
    assert run_tag.key == TraceTagKey.LINKED_PROMPTS

    tag_value = json.loads(run_tag.value)
    assert tag_value == [{"name": "test_chat", "version": "1"}]


def test_link_prompt_with_response_format_to_run(store, mock_tracking_store):
    response_format = {
        "type": "object",
        "properties": {"answer": {"type": "string"}},
    }
    prompt_version = PromptVersion(
        "test_response", 1, "What is {{question}}?", response_format=response_format
    )

    store.prompt_versions["test_response:1"] = prompt_version

    run_id = "run_123"
    run_data = RunData(metrics=[], params=[], tags={})
    run_info = RunInfo(
        run_id=run_id,
        experiment_id="exp_123",
        user_id="user_123",
        status="FINISHED",
        start_time=1234567890,
        end_time=1234567890,
        lifecycle_stage="active",
    )
    run = Run(run_info=run_info, run_data=run_data)

    mock_tracking_store.get_run.return_value = run

    store.link_prompt_version_to_run("test_response", "1", run_id)

    # Verify linking worked
    mock_tracking_store.set_tag.assert_called_once()
    call_args = mock_tracking_store.set_tag.call_args
    run_tag = call_args[0][1]
    assert run_tag.key == TraceTagKey.LINKED_PROMPTS

    tag_value = json.loads(run_tag.value)
    assert tag_value == [{"name": "test_response", "version": "1"}]


def test_link_multiple_prompt_types_to_model(store, mock_tracking_store):
    # Create text prompt
    text_prompt = PromptVersion("test_text", 1, "Hello {{name}}!")

    # Create chat prompt
    chat_template = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "{{question}}"},
    ]
    chat_prompt = PromptVersion("test_chat", 1, chat_template)

    store.prompt_versions["test_text:1"] = text_prompt
    store.prompt_versions["test_chat:1"] = chat_prompt

    model_id = "model_123"
    logged_model = LoggedModel(
        experiment_id="exp_123",
        model_id=model_id,
        name="test_model",
        artifact_location="/path/to/model",
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567890,
        tags={},
    )

    # Mock the behavior where set_logged_model_tags updates the model's tags
    def mock_set_tags(model_id, tags):
        for tag in tags:
            logged_model.tags[tag.key] = tag.value

    mock_tracking_store.get_logged_model.return_value = logged_model
    mock_tracking_store.set_logged_model_tags.side_effect = mock_set_tags

    # Link both prompts
    store.link_prompt_version_to_model("test_text", "1", model_id)
    store.link_prompt_version_to_model("test_chat", "1", model_id)

    # Verify both were linked
    assert mock_tracking_store.set_logged_model_tags.call_count == 2

    # Check final state
    final_call = mock_tracking_store.set_logged_model_tags.call_args_list[-1]
    logged_model_tags = final_call[0][1]
    tag_value = json.loads(logged_model_tags[0].value)

    expected_prompts = [
        {"name": "test_text", "version": "1"},
        {"name": "test_chat", "version": "1"},
    ]
    assert len(tag_value) == 2
    for expected_prompt in expected_prompts:
        assert expected_prompt in tag_value
```

--------------------------------------------------------------------------------

````
