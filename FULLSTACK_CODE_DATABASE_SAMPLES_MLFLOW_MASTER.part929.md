---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 929
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 929 of 991)

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

---[FILE: test_rest_store.py]---
Location: mlflow-master/tests/store/model_registry/test_rest_store.py

```python
import json
import uuid
from unittest import mock

import pytest

from mlflow.entities.model_registry import ModelVersion, ModelVersionTag, RegisteredModelTag
from mlflow.entities.model_registry.model_version_status import ModelVersionStatus
from mlflow.exceptions import MlflowException
from mlflow.prompt.registry_utils import IS_PROMPT_TAG_KEY
from mlflow.protos.model_registry_pb2 import (
    CreateModelVersion,
    CreateRegisteredModel,
    DeleteModelVersion,
    DeleteModelVersionTag,
    DeleteRegisteredModel,
    DeleteRegisteredModelAlias,
    DeleteRegisteredModelTag,
    GetLatestVersions,
    GetModelVersion,
    GetModelVersionByAlias,
    GetModelVersionDownloadUri,
    GetRegisteredModel,
    RenameRegisteredModel,
    SearchModelVersions,
    SearchRegisteredModels,
    SetModelVersionTag,
    SetRegisteredModelAlias,
    SetRegisteredModelTag,
    TransitionModelVersionStage,
    UpdateModelVersion,
    UpdateRegisteredModel,
)
from mlflow.store.model_registry.rest_store import RestStore
from mlflow.utils.proto_json_utils import message_to_json
from mlflow.utils.rest_utils import MlflowHostCreds

from tests.helper_functions import mock_http_request_200, mock_http_request_403_200


@pytest.fixture
def creds():
    return MlflowHostCreds("https://hello")


@pytest.fixture
def store(creds):
    return RestStore(lambda: creds)


def _args(host_creds, endpoint, method, json_body):
    res = {"host_creds": host_creds, "endpoint": f"/api/2.0/mlflow/{endpoint}", "method": method}
    if method == "GET":
        res["params"] = json.loads(json_body)
    else:
        res["json"] = json.loads(json_body)
    return res


def _verify_requests(http_request, creds, endpoint, method, proto_message):
    json_body = message_to_json(proto_message)
    http_request.assert_any_call(**(_args(creds, endpoint, method, json_body)))


def _verify_all_requests(http_request, creds, endpoints, proto_message):
    json_body = message_to_json(proto_message)
    http_request.assert_has_calls(
        [mock.call(**(_args(creds, endpoint, method, json_body))) for endpoint, method in endpoints]
    )


def test_create_registered_model(store, creds):
    tags = [
        RegisteredModelTag(key="key", value="value"),
        RegisteredModelTag(key="anotherKey", value="some other value"),
    ]
    description = "best model ever"
    with mock_http_request_200() as mock_http:
        store.create_registered_model("model_1", tags, description)
    _verify_requests(
        mock_http,
        creds,
        "registered-models/create",
        "POST",
        CreateRegisteredModel(
            name="model_1", tags=[tag.to_proto() for tag in tags], description=description
        ),
    )


def test_update_registered_model_name(store, creds):
    name = "model_1"
    new_name = "model_2"
    with mock_http_request_200() as mock_http:
        store.rename_registered_model(name=name, new_name=new_name)
    _verify_requests(
        mock_http,
        creds,
        "registered-models/rename",
        "POST",
        RenameRegisteredModel(name=name, new_name=new_name),
    )


def test_update_registered_model_description(store, creds):
    name = "model_1"
    description = "test model"
    with mock_http_request_200() as mock_http:
        store.update_registered_model(name=name, description=description)
    _verify_requests(
        mock_http,
        creds,
        "registered-models/update",
        "PATCH",
        UpdateRegisteredModel(name=name, description=description),
    )


def test_delete_registered_model(store, creds):
    name = "model_1"
    with mock_http_request_200() as mock_http:
        store.delete_registered_model(name=name)
    _verify_requests(
        mock_http, creds, "registered-models/delete", "DELETE", DeleteRegisteredModel(name=name)
    )


def test_search_registered_models(store, creds):
    with mock_http_request_200() as mock_http:
        store.search_registered_models()
    _verify_requests(mock_http, creds, "registered-models/search", "GET", SearchRegisteredModels())


@pytest.mark.parametrize("filter_string", [None, "model = 'yo'"])
@pytest.mark.parametrize("max_results", [None, 400])
@pytest.mark.parametrize("page_token", [None, "blah"])
@pytest.mark.parametrize("order_by", [None, ["x", "Y"]])
def test_search_registered_models_params(
    store, creds, filter_string, max_results, page_token, order_by
):
    params = {
        "filter_string": filter_string,
        "max_results": max_results,
        "page_token": page_token,
        "order_by": order_by,
    }
    params = {k: v for k, v in params.items() if v is not None}
    with mock_http_request_200() as mock_http:
        store.search_registered_models(**params)
    if "filter_string" in params:
        params["filter"] = params.pop("filter_string")
    _verify_requests(
        mock_http,
        creds,
        "registered-models/search",
        "GET",
        SearchRegisteredModels(**params),
    )


def test_get_registered_model(store, creds):
    name = "model_1"
    with mock_http_request_200() as mock_http:
        store.get_registered_model(name=name)
    _verify_requests(
        mock_http, creds, "registered-models/get", "GET", GetRegisteredModel(name=name)
    )


def test_get_latest_versions(store, creds):
    name = "model_1"
    with mock_http_request_403_200() as mock_http:
        store.get_latest_versions(name=name)
    endpoint = "registered-models/get-latest-versions"
    endpoints = [(endpoint, "POST"), (endpoint, "GET")]
    _verify_all_requests(mock_http, creds, endpoints, GetLatestVersions(name=name))


def test_get_latest_versions_with_stages(store, creds):
    name = "model_1"
    with mock_http_request_403_200() as mock_http:
        store.get_latest_versions(name=name, stages=["blaah"])
    endpoint = "registered-models/get-latest-versions"
    endpoints = [(endpoint, "POST"), (endpoint, "GET")]
    _verify_all_requests(
        mock_http, creds, endpoints, GetLatestVersions(name=name, stages=["blaah"])
    )


def test_set_registered_model_tag(store, creds):
    name = "model_1"
    tag = RegisteredModelTag(key="key", value="value")
    with mock_http_request_200() as mock_http:
        store.set_registered_model_tag(name=name, tag=tag)
    _verify_requests(
        mock_http,
        creds,
        "registered-models/set-tag",
        "POST",
        SetRegisteredModelTag(name=name, key=tag.key, value=tag.value),
    )


def test_delete_registered_model_tag(store, creds):
    name = "model_1"
    with mock_http_request_200() as mock_http:
        store.delete_registered_model_tag(name=name, key="key")
    _verify_requests(
        mock_http,
        creds,
        "registered-models/delete-tag",
        "DELETE",
        DeleteRegisteredModelTag(name=name, key="key"),
    )


def test_create_model_version(store, creds):
    with mock_http_request_200() as mock_http:
        store.create_model_version("model_1", "path/to/source")
    _verify_requests(
        mock_http,
        creds,
        "model-versions/create",
        "POST",
        CreateModelVersion(name="model_1", source="path/to/source"),
    )
    # test optional fields
    run_id = uuid.uuid4().hex
    tags = [
        ModelVersionTag(key="key", value="value"),
        ModelVersionTag(key="anotherKey", value="some other value"),
    ]
    run_link = "localhost:5000/path/to/run"
    description = "version description"
    with mock_http_request_200() as mock_http:
        store.create_model_version(
            "model_1",
            "path/to/source",
            run_id,
            tags,
            run_link=run_link,
            description=description,
        )
    _verify_requests(
        mock_http,
        creds,
        "model-versions/create",
        "POST",
        CreateModelVersion(
            name="model_1",
            source="path/to/source",
            run_id=run_id,
            run_link=run_link,
            tags=[tag.to_proto() for tag in tags],
            description=description,
        ),
    )


def test_transition_model_version_stage(store, creds):
    name = "model_1"
    version = "5"
    with mock_http_request_200() as mock_http:
        store.transition_model_version_stage(
            name=name, version=version, stage="prod", archive_existing_versions=True
        )
    _verify_requests(
        mock_http,
        creds,
        "model-versions/transition-stage",
        "POST",
        TransitionModelVersionStage(
            name=name, version=version, stage="prod", archive_existing_versions=True
        ),
    )


def test_update_model_version_description(store, creds):
    name = "model_1"
    version = "5"
    description = "test model version"
    with mock_http_request_200() as mock_http:
        store.update_model_version(name=name, version=version, description=description)
    _verify_requests(
        mock_http,
        creds,
        "model-versions/update",
        "PATCH",
        UpdateModelVersion(name=name, version=version, description="test model version"),
    )


def test_delete_model_version(store, creds):
    name = "model_1"
    version = "12"
    with mock_http_request_200() as mock_http:
        store.delete_model_version(name=name, version=version)
    _verify_requests(
        mock_http,
        creds,
        "model-versions/delete",
        "DELETE",
        DeleteModelVersion(name=name, version=version),
    )


def test_get_model_version_details(store, creds):
    name = "model_11"
    version = "8"
    with mock_http_request_200() as mock_http:
        store.get_model_version(name=name, version=version)
    _verify_requests(
        mock_http, creds, "model-versions/get", "GET", GetModelVersion(name=name, version=version)
    )


def test_get_model_version_download_uri(store, creds):
    name = "model_11"
    version = "8"
    with mock_http_request_200() as mock_http:
        store.get_model_version_download_uri(name=name, version=version)
    _verify_requests(
        mock_http,
        creds,
        "model-versions/get-download-uri",
        "GET",
        GetModelVersionDownloadUri(name=name, version=version),
    )


def test_search_model_versions(store, creds):
    with mock_http_request_200() as mock_http:
        store.search_model_versions()
    _verify_requests(mock_http, creds, "model-versions/search", "GET", SearchModelVersions())


@pytest.mark.parametrize("filter_string", [None, "name = 'model_12'"])
@pytest.mark.parametrize("max_results", [None, 400])
@pytest.mark.parametrize("page_token", [None, "blah"])
@pytest.mark.parametrize("order_by", ["version DESC", "creation_time DESC"])
def test_search_model_versions_params(
    store, creds, filter_string, max_results, page_token, order_by
):
    params = {
        "filter_string": filter_string,
        "max_results": max_results,
        "page_token": page_token,
        "order_by": order_by,
    }
    params = {k: v for k, v in params.items() if v is not None}
    with mock_http_request_200() as mock_http:
        store.search_model_versions(**params)
    if "filter_string" in params:
        params["filter"] = params.pop("filter_string")
    _verify_requests(
        mock_http,
        creds,
        "model-versions/search",
        "GET",
        SearchModelVersions(**params),
    )


def test_set_model_version_tag(store, creds):
    name = "model_1"
    tag = ModelVersionTag(key="key", value="value")
    with mock_http_request_200() as mock_http:
        store.set_model_version_tag(name=name, version="1", tag=tag)
    _verify_requests(
        mock_http,
        creds,
        "model-versions/set-tag",
        "POST",
        SetModelVersionTag(name=name, version="1", key=tag.key, value=tag.value),
    )


def test_delete_model_version_tag(store, creds):
    name = "model_1"
    with mock_http_request_200() as mock_http:
        store.delete_model_version_tag(name=name, version="1", key="key")
    _verify_requests(
        mock_http,
        creds,
        "model-versions/delete-tag",
        "DELETE",
        DeleteModelVersionTag(name=name, version="1", key="key"),
    )


def test_set_registered_model_alias(store, creds):
    name = "model_1"
    with mock_http_request_200() as mock_http:
        store.set_registered_model_alias(name=name, alias="test_alias", version="1")
    _verify_requests(
        mock_http,
        creds,
        "registered-models/alias",
        "POST",
        SetRegisteredModelAlias(name=name, alias="test_alias", version="1"),
    )


def test_delete_registered_model_alias(store, creds):
    name = "model_1"
    with mock_http_request_200() as mock_http:
        store.delete_registered_model_alias(name=name, alias="test_alias")
    _verify_requests(
        mock_http,
        creds,
        "registered-models/alias",
        "DELETE",
        DeleteRegisteredModelAlias(name=name, alias="test_alias"),
    )


def test_get_model_version_by_alias(store, creds):
    name = "model_1"
    with mock_http_request_200() as mock_http:
        store.get_model_version_by_alias(name=name, alias="test_alias")
    _verify_requests(
        mock_http,
        creds,
        "registered-models/alias",
        "GET",
        GetModelVersionByAlias(name=name, alias="test_alias"),
    )


def test_await_model_version_creation_pending(store):
    pending_mv = ModelVersion(
        name="Model 1",
        version="1",
        creation_timestamp=123,
        status=ModelVersionStatus.to_string(ModelVersionStatus.PENDING_REGISTRATION),
    )
    with (
        mock.patch(
            "mlflow.store.model_registry.abstract_store.AWAIT_MODEL_VERSION_CREATE_SLEEP_INTERVAL_SECONDS",
            1,
        ),
        mock.patch.object(store, "get_model_version", return_value=pending_mv),
        pytest.raises(MlflowException, match="Exceeded max wait time"),
    ):
        store._await_model_version_creation(pending_mv, 0.5)


def test_await_model_version_creation_failed(store):
    pending_mv = ModelVersion(
        name="Model 1",
        version="1",
        creation_timestamp=123,
        status=ModelVersionStatus.to_string(ModelVersionStatus.FAILED_REGISTRATION),
    )
    with (
        mock.patch.object(store, "get_model_version", return_value=pending_mv),
        pytest.raises(MlflowException, match="Model version creation failed for model name"),
    ):
        store._await_model_version_creation(pending_mv, 0.5)


@pytest.mark.parametrize("is_prompt", [True, False], ids=["prompt", "model"])
def test_await_model_version_creation_show_correct_message_for_prompt(store, is_prompt):
    tags = [ModelVersionTag(key=IS_PROMPT_TAG_KEY, value="true")] if is_prompt else []
    pending = ModelVersion(
        name="test",
        version="1",
        creation_timestamp=123,
        tags=tags,
        status=ModelVersionStatus.to_string(ModelVersionStatus.PENDING_REGISTRATION),
    )
    completed = ModelVersion(
        name="test",
        version="1",
        creation_timestamp=123,
        tags=tags,
        status=ModelVersionStatus.to_string(ModelVersionStatus.READY),
    )

    with (
        mock.patch("mlflow.store.model_registry.abstract_store._logger") as mock_logger,
        mock.patch.object(store, "get_model_version", return_value=completed),
    ):
        store._await_model_version_creation(pending, 10)

    mock_logger.info.assert_called_once()
    info_message = mock_logger.mock_calls[0][1][0]
    if is_prompt:
        assert "prompt" in info_message
        assert "model" not in info_message
    else:
        assert "prompt" not in info_message
        assert "model" in info_message
```

--------------------------------------------------------------------------------

---[FILE: test_rest_store_webhooks.py]---
Location: mlflow-master/tests/store/model_registry/test_rest_store_webhooks.py

```python
"""
This test file verifies webhook CRUD operations with the REST client,
testing both server handlers and the REST client together.
"""

from pathlib import Path
from typing import Iterator

import pytest
from cryptography.fernet import Fernet

from mlflow.entities.webhook import WebhookAction, WebhookEntity, WebhookEvent, WebhookStatus
from mlflow.environment_variables import MLFLOW_WEBHOOK_SECRET_ENCRYPTION_KEY
from mlflow.exceptions import MlflowException
from mlflow.server import handlers
from mlflow.server.fastapi_app import app
from mlflow.server.handlers import initialize_backend_stores
from mlflow.store.model_registry.rest_store import RestStore
from mlflow.utils.rest_utils import MlflowHostCreds

from tests.helper_functions import get_safe_port
from tests.tracking.integration_test_utils import ServerThread


@pytest.fixture
def store(tmp_path: Path, db_uri: str, monkeypatch: pytest.MonkeyPatch) -> Iterator[RestStore]:
    """Set up a local MLflow server with proper webhook encryption key support."""
    # Set up encryption key for webhooks using monkeypatch
    encryption_key = Fernet.generate_key().decode("utf-8")
    monkeypatch.setenv(MLFLOW_WEBHOOK_SECRET_ENCRYPTION_KEY.name, encryption_key)

    # Force-reset backend stores before each test
    handlers._tracking_store = None
    handlers._model_registry_store = None
    initialize_backend_stores(db_uri, default_artifact_root=tmp_path.as_uri())

    # Start server and return RestStore
    with ServerThread(app, get_safe_port()) as url:
        yield RestStore(lambda: MlflowHostCreds(url))


def test_create_webhook(store: RestStore):
    webhook = store.create_webhook(
        name="test_webhook",
        url="https://example.com/webhook",
        events=[WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)],
    )
    assert webhook.name == "test_webhook"
    assert webhook.url == "https://example.com/webhook"
    assert webhook.secret is None
    assert webhook.events == [WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)]

    webhook = store.get_webhook(webhook.webhook_id)
    assert webhook.name == "test_webhook"
    assert webhook.url == "https://example.com/webhook"
    assert webhook.secret is None

    # With secret
    webhook_with_secret = store.create_webhook(
        name="test_webhook_with_secret",
        url="https://example.com/webhook_with_secret",
        events=[WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)],
        secret="my_secret",
    )
    assert webhook_with_secret.name == "test_webhook_with_secret"
    assert webhook_with_secret.url == "https://example.com/webhook_with_secret"
    assert webhook_with_secret.secret is None
    assert webhook_with_secret.events == [
        WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)
    ]

    # Multiple events
    webhook_multiple_events = store.create_webhook(
        name="test_webhook_multiple_events",
        url="https://example.com/webhook_multiple_events",
        events=[
            WebhookEvent(WebhookEntity.MODEL_VERSION_ALIAS, WebhookAction.CREATED),
            WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED),
        ],
    )
    assert webhook_multiple_events.name == "test_webhook_multiple_events"
    assert webhook_multiple_events.url == "https://example.com/webhook_multiple_events"
    assert sorted(
        webhook_multiple_events.events, key=lambda e: (e.entity.value, e.action.value)
    ) == [
        WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED),
        WebhookEvent(WebhookEntity.MODEL_VERSION_ALIAS, WebhookAction.CREATED),
    ]
    assert webhook_multiple_events.secret is None


def test_get_webhook(store: RestStore):
    events = [WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)]
    created_webhook = store.create_webhook(
        name="test_webhook", url="https://example.com/webhook", events=events
    )
    retrieved_webhook = store.get_webhook(created_webhook.webhook_id)
    assert retrieved_webhook.webhook_id == created_webhook.webhook_id
    assert retrieved_webhook.name == "test_webhook"
    assert retrieved_webhook.url == "https://example.com/webhook"
    assert retrieved_webhook.events == events


def test_get_webhook_not_found(store: RestStore):
    with pytest.raises(MlflowException, match="Webhook with ID nonexistent not found"):
        store.get_webhook("nonexistent")


def test_list_webhooks(store: RestStore):
    # Create more webhooks than max_results
    for i in range(5):
        store.create_webhook(
            name=f"webhook{i}",
            url=f"https://example.com/{i}",
            events=[WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)],
        )
    # Test pagination with max_results=2
    webhooks_page = store.list_webhooks(max_results=2)
    assert len(webhooks_page) == 2
    assert webhooks_page.token is not None
    # Get next page
    next_webhooks_page = store.list_webhooks(max_results=2, page_token=webhooks_page.token)
    assert len(next_webhooks_page) == 2
    assert next_webhooks_page.token is not None
    # Verify we don't get duplicates
    first_page_ids = {w.webhook_id for w in webhooks_page}
    second_page_ids = {w.webhook_id for w in next_webhooks_page}
    assert first_page_ids.isdisjoint(second_page_ids)


def test_update_webhook(store: RestStore):
    events = [WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)]
    webhook = store.create_webhook(
        name="original_name", url="https://example.com/original", events=events
    )
    # Update webhook
    new_events = [
        WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED),
        WebhookEvent(WebhookEntity.REGISTERED_MODEL, WebhookAction.CREATED),
    ]
    updated_webhook = store.update_webhook(
        webhook_id=webhook.webhook_id,
        name="updated_name",
        url="https://example.com/updated",
        events=new_events,
        description="Updated description",
        secret="new_secret",
        status=WebhookStatus.DISABLED,
    )
    assert updated_webhook.webhook_id == webhook.webhook_id
    assert updated_webhook.name == "updated_name"
    assert updated_webhook.url == "https://example.com/updated"
    assert updated_webhook.events == new_events
    assert updated_webhook.description == "Updated description"
    assert updated_webhook.status == WebhookStatus.DISABLED
    assert updated_webhook.last_updated_timestamp > webhook.last_updated_timestamp


def test_update_webhook_partial(store: RestStore):
    events = [WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)]
    webhook = store.create_webhook(
        name="original_name",
        url="https://example.com/original",
        events=events,
        description="Original description",
    )
    # Update only the name
    updated_webhook = store.update_webhook(
        webhook_id=webhook.webhook_id,
        name="updated_name",
    )
    assert updated_webhook.name == "updated_name"
    assert updated_webhook.url == "https://example.com/original"
    assert updated_webhook.events == events
    assert updated_webhook.description == "Original description"


def test_update_webhook_not_found(store: RestStore):
    with pytest.raises(MlflowException, match="Webhook with ID nonexistent not found"):
        store.update_webhook(webhook_id="nonexistent", name="new_name")


@pytest.mark.parametrize(
    ("invalid_url", "expected_match"),
    [
        ("   ", r"Webhook URL cannot be empty or just whitespace"),
        ("ftp://example.com", r"Invalid webhook URL scheme"),
        ("http://[invalid", r"Invalid webhook URL"),
    ],
)
def test_update_webhook_invalid_urls(store, invalid_url, expected_match):
    # Create a valid webhook first
    webhook = store.create_webhook(
        name="test_webhook",
        url="https://example.com/webhook",
        events=[WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)],
    )
    with pytest.raises(MlflowException, match=expected_match):
        store.update_webhook(webhook_id=webhook.webhook_id, url=invalid_url)


def test_delete_webhook(store: RestStore):
    events = [WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)]
    webhook = store.create_webhook(
        name="test_webhook",
        url="https://example.com/webhook",
        events=events,
    )
    store.delete_webhook(webhook.webhook_id)
    with pytest.raises(MlflowException, match=r"Webhook with ID .* not found"):
        store.get_webhook(webhook.webhook_id)
    webhooks_page = store.list_webhooks()
    webhook_ids = {w.webhook_id for w in webhooks_page}
    assert webhook.webhook_id not in webhook_ids


def test_delete_webhook_not_found(store: RestStore):
    with pytest.raises(MlflowException, match="Webhook with ID nonexistent not found"):
        store.delete_webhook("nonexistent")
```

--------------------------------------------------------------------------------

````
