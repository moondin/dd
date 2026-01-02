---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 962
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 962 of 991)

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

---[FILE: test_client_webhooks.py]---
Location: mlflow-master/tests/tracking/test_client_webhooks.py

```python
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
from mlflow.tracking import MlflowClient

from tests.helper_functions import get_safe_port
from tests.tracking.integration_test_utils import ServerThread


@pytest.fixture
def client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Iterator[MlflowClient]:
    """Setup a local MLflow server with proper webhook encryption key support."""
    # Set up encryption key for webhooks using monkeypatch
    encryption_key = Fernet.generate_key().decode("utf-8")
    monkeypatch.setenv(MLFLOW_WEBHOOK_SECRET_ENCRYPTION_KEY.name, encryption_key)

    # Configure backend stores
    backend_uri = f"sqlite:///{tmp_path / 'mlflow.db'}"
    default_artifact_root = tmp_path.as_uri()

    # Force-reset backend stores before each test
    handlers._tracking_store = None
    handlers._model_registry_store = None
    initialize_backend_stores(backend_uri, default_artifact_root=default_artifact_root)

    # Start server and return client
    with ServerThread(app, get_safe_port()) as url:
        yield MlflowClient(url)


def test_create_webhook(client: MlflowClient):
    webhook = client.create_webhook(
        name="test_webhook",
        url="https://example.com/webhook",
        events=[WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)],
    )
    assert webhook.name == "test_webhook"
    assert webhook.url == "https://example.com/webhook"
    assert webhook.secret is None
    assert webhook.events == [WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)]

    webhook = client.get_webhook(webhook.webhook_id)
    assert webhook.name == "test_webhook"
    assert webhook.url == "https://example.com/webhook"
    assert webhook.secret is None

    # With secret
    webhook_with_secret = client.create_webhook(
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
    webhook_multiple_events = client.create_webhook(
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


def test_get_webhook(client: MlflowClient):
    events = [WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)]
    created_webhook = client.create_webhook(
        name="test_webhook", url="https://example.com/webhook", events=events
    )
    retrieved_webhook = client.get_webhook(created_webhook.webhook_id)
    assert retrieved_webhook.webhook_id == created_webhook.webhook_id
    assert retrieved_webhook.name == "test_webhook"
    assert retrieved_webhook.url == "https://example.com/webhook"
    assert retrieved_webhook.events == events


def test_get_webhook_not_found(client: MlflowClient):
    with pytest.raises(MlflowException, match="Webhook with ID nonexistent not found"):
        client.get_webhook("nonexistent")


def test_list_webhooks(client: MlflowClient):
    # Create more webhooks than max_results
    for i in range(5):
        client.create_webhook(
            name=f"webhook{i}",
            url=f"https://example.com/{i}",
            events=[WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)],
        )
    # Test pagination with max_results=2
    webhooks_page = client.list_webhooks(max_results=2)
    assert len(webhooks_page) == 2
    assert webhooks_page.token is not None
    # Get next page
    next_webhooks_page = client.list_webhooks(max_results=2, page_token=webhooks_page.token)
    assert len(next_webhooks_page) == 2
    assert next_webhooks_page.token is not None
    # Verify we don't get duplicates
    first_page_ids = {w.webhook_id for w in webhooks_page}
    second_page_ids = {w.webhook_id for w in next_webhooks_page}
    assert first_page_ids.isdisjoint(second_page_ids)


def test_update_webhook(client: MlflowClient):
    events = [WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)]
    webhook = client.create_webhook(
        name="original_name", url="https://example.com/original", events=events
    )
    # Update webhook
    new_events = [
        WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED),
        WebhookEvent(WebhookEntity.REGISTERED_MODEL, WebhookAction.CREATED),
    ]
    updated_webhook = client.update_webhook(
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


def test_update_webhook_partial(client: MlflowClient):
    events = [WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)]
    webhook = client.create_webhook(
        name="original_name",
        url="https://example.com/original",
        events=events,
        description="Original description",
    )
    # Update only the name
    updated_webhook = client.update_webhook(
        webhook_id=webhook.webhook_id,
        name="updated_name",
    )
    assert updated_webhook.name == "updated_name"
    assert updated_webhook.url == "https://example.com/original"
    assert updated_webhook.events == events
    assert updated_webhook.description == "Original description"


def test_update_webhook_not_found(client: MlflowClient):
    with pytest.raises(MlflowException, match="Webhook with ID nonexistent not found"):
        client.update_webhook(webhook_id="nonexistent", name="new_name")


@pytest.mark.parametrize(
    ("invalid_url", "expected_match"),
    [
        ("   ", r"Webhook URL cannot be empty or just whitespace"),
        ("ftp://example.com", r"Invalid webhook URL scheme"),
        ("http://[invalid", r"Invalid webhook URL"),
    ],
)
def test_update_webhook_invalid_urls(client: MlflowClient, invalid_url: str, expected_match: str):
    # Create a valid webhook first
    webhook = client.create_webhook(
        name="test_webhook",
        url="https://example.com/webhook",
        events=[WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)],
    )
    with pytest.raises(MlflowException, match=expected_match):
        client.update_webhook(webhook_id=webhook.webhook_id, url=invalid_url)


def test_delete_webhook(client: MlflowClient):
    events = [WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)]
    webhook = client.create_webhook(
        name="test_webhook",
        url="https://example.com/webhook",
        events=events,
    )
    client.delete_webhook(webhook.webhook_id)
    with pytest.raises(MlflowException, match=r"Webhook with ID .* not found"):
        client.get_webhook(webhook.webhook_id)
    webhooks_page = client.list_webhooks()
    webhook_ids = {w.webhook_id for w in webhooks_page}
    assert webhook.webhook_id not in webhook_ids


def test_delete_webhook_not_found(client: MlflowClient):
    with pytest.raises(MlflowException, match="Webhook with ID nonexistent not found"):
        client.delete_webhook("nonexistent")
```

--------------------------------------------------------------------------------

---[FILE: test_log_figure.py]---
Location: mlflow-master/tests/tracking/test_log_figure.py

```python
import os
import posixpath
import uuid

import pytest

import mlflow
from mlflow.utils.file_utils import local_file_uri_to_path
from mlflow.utils.os import is_windows


@pytest.mark.parametrize("subdir", [None, ".", "dir", "dir1/dir2", "dir/.."])
def test_log_figure_matplotlib(subdir):
    import matplotlib.pyplot as plt

    filename = "figure.png"
    artifact_file = filename if subdir is None else posixpath.join(subdir, filename)

    fig, ax = plt.subplots()
    ax.plot([0, 1], [2, 3])

    with mlflow.start_run():
        mlflow.log_figure(fig, artifact_file)
        plt.close(fig)

        artifact_path = None if subdir is None else posixpath.normpath(subdir)
        artifact_uri = mlflow.get_artifact_uri(artifact_path)
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        assert os.listdir(run_artifact_dir) == [filename]


@pytest.mark.parametrize("subdir", [None, ".", "dir", "dir1/dir2", "dir/.."])
def test_log_figure_plotly_html(subdir):
    from plotly import graph_objects as go

    filename = "figure.html"
    artifact_file = filename if subdir is None else posixpath.join(subdir, filename)

    fig = go.Figure(go.Scatter(x=[0, 1], y=[2, 3]))

    with mlflow.start_run():
        mlflow.log_figure(fig, artifact_file)

        artifact_path = None if subdir is None else posixpath.normpath(subdir)
        artifact_uri = mlflow.get_artifact_uri(artifact_path)
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        assert os.listdir(run_artifact_dir) == [filename]


@pytest.mark.skipif(is_windows, reason="https://github.com/plotly/Kaleido/issues/126")
@pytest.mark.parametrize("extension", ["png", "jpeg", "webp", "svg", "pdf"])
def test_log_figure_plotly_image(extension):
    from plotly import graph_objects as go

    subdir = "."
    filename = f"figure.{extension}"
    artifact_file = posixpath.join(subdir, filename)

    fig = go.Figure(go.Scatter(x=[0, 1], y=[2, 3]))

    with mlflow.start_run():
        mlflow.log_figure(fig, artifact_file)

        artifact_path = None if subdir is None else posixpath.normpath(subdir)
        artifact_uri = mlflow.get_artifact_uri(artifact_path)
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        assert os.listdir(run_artifact_dir) == [filename]


def test_log_figure_save_kwargs():
    from plotly import graph_objects as go

    fig = go.Figure(go.Scatter(x=[0, 1], y=[2, 3]))
    with mlflow.start_run():
        name = "figure.html"
        div_id = uuid.uuid4().hex
        mlflow.log_figure(fig, name, save_kwargs={"div_id": div_id})
        artifact_uri = mlflow.get_artifact_uri(name)
        local_path = local_file_uri_to_path(artifact_uri)
        with open(local_path) as f:
            assert div_id in f.read()


@pytest.mark.parametrize("extension", ["", ".py"])
def test_log_figure_raises_error_for_unsupported_file_extension(extension):
    from plotly import graph_objects as go

    filename = f"figure{extension}"
    artifact_file = posixpath.join(".", filename)

    fig = go.Figure(go.Scatter(x=[0, 1], y=[2, 3]))

    with (
        mlflow.start_run(),
        pytest.raises(
            TypeError, match=f"Unsupported file extension for plotly figure: '{extension}'"
        ),
    ):
        mlflow.log_figure(fig, artifact_file)


def test_log_figure_raises_error_for_unsupported_figure_object_type():
    with mlflow.start_run(), pytest.raises(TypeError, match="Unsupported figure object type"):
        mlflow.log_figure("not_figure", "figure.png")
```

--------------------------------------------------------------------------------

---[FILE: test_log_image.py]---
Location: mlflow-master/tests/tracking/test_log_image.py

```python
import json
import os
import posixpath

import pytest

import mlflow
from mlflow.utils.file_utils import local_file_uri_to_path
from mlflow.utils.time import get_current_time_millis


@pytest.mark.parametrize("subdir", [None, ".", "dir", "dir1/dir2", "dir/.."])
def test_log_image_numpy(subdir):
    import numpy as np
    from PIL import Image

    filename = "image.png"
    artifact_file = filename if subdir is None else posixpath.join(subdir, filename)

    image = np.random.randint(0, 256, size=(100, 100, 3), dtype=np.uint8)

    with mlflow.start_run():
        mlflow.log_image(image, artifact_file)

        artifact_path = None if subdir is None else posixpath.normpath(subdir)
        artifact_uri = mlflow.get_artifact_uri(artifact_path)
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        assert os.listdir(run_artifact_dir) == [filename]

        logged_path = os.path.join(run_artifact_dir, filename)
        loaded_image = np.asarray(Image.open(logged_path), dtype=np.uint8)
        np.testing.assert_array_equal(loaded_image, image)


@pytest.mark.parametrize("subdir", [None, ".", "dir", "dir1/dir2", "dir/.."])
def test_log_image_pillow(subdir):
    from PIL import Image, ImageChops

    filename = "image.png"
    artifact_file = filename if subdir is None else posixpath.join(subdir, filename)

    image = Image.new("RGB", (100, 100))

    with mlflow.start_run():
        mlflow.log_image(image, artifact_file)

        artifact_path = None if subdir is None else posixpath.normpath(subdir)
        artifact_uri = mlflow.get_artifact_uri(artifact_path)
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        assert os.listdir(run_artifact_dir) == [filename]

        logged_path = os.path.join(run_artifact_dir, filename)
        loaded_image = Image.open(logged_path)
        # How to check Pillow image equality: https://stackoverflow.com/a/6204954/6943581
        assert ImageChops.difference(loaded_image, image).getbbox() is None


def test_log_image_raises_for_unsupported_objects():
    with mlflow.start_run():
        with pytest.raises(TypeError, match="Unsupported image object type"):
            mlflow.log_image("not_image", "image.png")


@pytest.mark.parametrize(
    "size",
    [
        (100, 100),  # Grayscale (2D)
        (100, 100, 1),  # Grayscale (3D)
        (100, 100, 3),  # RGB
        (100, 100, 4),  # RGBA
    ],
)
def test_log_image_numpy_shape(size):
    import numpy as np

    filename = "image.png"
    image = np.random.randint(0, 256, size=size, dtype=np.uint8)

    with mlflow.start_run():
        mlflow.log_image(image, filename)
        artifact_uri = mlflow.get_artifact_uri()
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        assert os.listdir(run_artifact_dir) == [filename]


@pytest.mark.parametrize(
    "dtype",
    [
        # Ref.: https://numpy.org/doc/stable/user/basics.types.html#array-types-and-conversions-between-types
        "int8",
        "int16",
        "int32",
        "int64",
        "uint8",
        "uint16",
        "uint32",
        "uint64",
        "float16",
        "float32",
        "float64",
        "bool",
    ],
)
def test_log_image_numpy_dtype(dtype):
    import numpy as np

    filename = "image.png"
    image = np.random.randint(0, 2, size=(100, 100, 3)).astype(np.dtype(dtype))

    with mlflow.start_run():
        mlflow.log_image(image, filename)
        artifact_uri = mlflow.get_artifact_uri()
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        assert os.listdir(run_artifact_dir) == [filename]


@pytest.mark.parametrize(
    "array",
    # 1 pixel images with out-of-range values
    [[[-1]], [[256]], [[-0.1]], [[1.1]]],
)
def test_log_image_numpy_emits_warning_for_out_of_range_values(array):
    import numpy as np

    image = np.array(array).astype(type(array[0][0]))
    if isinstance(array[0][0], int):
        with (
            mlflow.start_run(),
            pytest.raises(ValueError, match="Integer pixel values out of acceptable range"),
        ):
            mlflow.log_image(image, "image.png")
    else:
        with (
            mlflow.start_run(),
            pytest.warns(UserWarning, match="Float pixel values out of acceptable range"),
        ):
            mlflow.log_image(image, "image.png")


def test_log_image_numpy_raises_exception_for_invalid_array_data_type():
    import numpy as np

    with mlflow.start_run(), pytest.raises(TypeError, match="Invalid array data type"):
        mlflow.log_image(np.tile("a", (1, 1, 3)), "image.png")


def test_log_image_numpy_raises_exception_for_invalid_array_shape():
    import numpy as np

    with mlflow.start_run(), pytest.raises(ValueError, match="`image` must be a 2D or 3D array"):
        mlflow.log_image(np.zeros((1,), dtype=np.uint8), "image.png")


def test_log_image_numpy_raises_exception_for_invalid_channel_length():
    import numpy as np

    with mlflow.start_run(), pytest.raises(ValueError, match="Invalid channel length"):
        mlflow.log_image(np.zeros((1, 1, 5), dtype=np.uint8), "image.png")


def test_log_image_raises_exception_for_unsupported_image_object_type():
    with mlflow.start_run(), pytest.raises(TypeError, match="Unsupported image object type"):
        mlflow.log_image("not_image", "image.png")


def test_log_image_with_steps():
    import numpy as np
    from PIL import Image

    image = np.random.randint(0, 256, size=(100, 100, 3), dtype=np.uint8)

    with mlflow.start_run():
        mlflow.log_image(image, key="dog", step=0, synchronous=True)

        logged_path = "images/"
        artifact_uri = mlflow.get_artifact_uri(logged_path)
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        files = os.listdir(run_artifact_dir)

        # .png file for the image and .webp file for compressed image
        assert len(files) == 2
        for file in files:
            assert file.startswith("dog%step%0")
            logged_path = os.path.join(run_artifact_dir, file)
            if file.endswith(".png"):
                loaded_image = np.asarray(Image.open(logged_path), dtype=np.uint8)
                np.testing.assert_array_equal(loaded_image, image)
            elif file.endswith(".json"):
                with open(logged_path) as f:
                    metadata = json.load(f)
                    assert metadata["filepath"].startswith("images/dog%step%0")
                    assert metadata["key"] == "dog"
                    assert metadata["step"] == 0
                    assert metadata["timestamp"] <= get_current_time_millis()


def test_log_image_with_timestamp():
    import numpy as np
    from PIL import Image

    image = np.random.randint(0, 256, size=(100, 100, 3), dtype=np.uint8)

    with mlflow.start_run():
        mlflow.log_image(image, key="dog", timestamp=100, synchronous=True)

        logged_path = "images/"
        artifact_uri = mlflow.get_artifact_uri(logged_path)
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        files = os.listdir(run_artifact_dir)

        # .png file for the image, and .webp file for compressed image
        assert len(files) == 2
        for file in files:
            assert file.startswith("dog%step%0")
            logged_path = os.path.join(run_artifact_dir, file)
            if file.endswith(".png"):
                loaded_image = np.asarray(Image.open(logged_path), dtype=np.uint8)
                np.testing.assert_array_equal(loaded_image, image)
            elif file.endswith(".json"):
                with open(logged_path) as f:
                    metadata = json.load(f)
                    assert metadata["filepath"].startswith("images/dog%step%0")
                    assert metadata["key"] == "dog"
                    assert metadata["step"] == 0
                    assert metadata["timestamp"] == 100


def test_duplicated_log_image_with_step():
    """
    MLflow will save both files if there are multiple calls to log_image
    with the same key and step.
    """
    import numpy as np

    image1 = np.random.randint(0, 256, size=(100, 100, 3), dtype=np.uint8)
    image2 = np.random.randint(0, 256, size=(100, 100, 3), dtype=np.uint8)

    with mlflow.start_run():
        mlflow.log_image(image1, key="dog", step=100, synchronous=True)
        mlflow.log_image(image2, key="dog", step=100, synchronous=True)

        logged_path = "images/"
        artifact_uri = mlflow.get_artifact_uri(logged_path)
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        files = os.listdir(run_artifact_dir)
        assert len(files) == 2 * 2  # 2 images and 2 files per image


def test_duplicated_log_image_with_timestamp():
    """
    MLflow will save both files if there are multiple calls to log_image
    with the same key, step, and timestamp.
    """
    import numpy as np

    image1 = np.random.randint(0, 256, size=(100, 100, 3), dtype=np.uint8)
    image2 = np.random.randint(0, 256, size=(100, 100, 3), dtype=np.uint8)

    with mlflow.start_run():
        mlflow.log_image(image1, key="dog", step=100, timestamp=100, synchronous=True)
        mlflow.log_image(image2, key="dog", step=100, timestamp=100, synchronous=True)

        logged_path = "images/"
        artifact_uri = mlflow.get_artifact_uri(logged_path)
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        files = os.listdir(run_artifact_dir)
        assert len(files) == 2 * 2


@pytest.mark.parametrize(
    "args",
    [
        {"key": "image"},
        {"step": 0},
        {"timestamp": 0},
        {"timestamp": 0, "step": 0},
        ["image"],
        ["image", 0],
    ],
)
def test_log_image_raises_exception_for_unexpected_arguments_used(args):
    # It will overwrite if the user wants the exact same timestamp for the logged images
    import numpy as np

    exception = "The `artifact_file` parameter cannot be used in conjunction"
    if isinstance(args, dict):
        with mlflow.start_run(), pytest.raises(TypeError, match=exception):
            mlflow.log_image(np.zeros((1,), dtype=np.uint8), "image.png", **args)
    elif isinstance(args, list):
        with mlflow.start_run(), pytest.raises(TypeError, match=exception):
            mlflow.log_image(np.zeros((1,), dtype=np.uint8), "image.png", *args)


def test_log_image_raises_exception_for_missing_arguments():
    import numpy as np

    exception = "Invalid arguments: Please specify exactly one of `artifact_file` or `key`"
    with mlflow.start_run(), pytest.raises(TypeError, match=exception):
        mlflow.log_image(np.zeros((1,), dtype=np.uint8))


def test_async_log_image_flush():
    import numpy as np

    image1 = np.random.randint(0, 256, size=(100, 100, 3), dtype=np.uint8)
    with mlflow.start_run():
        for i in range(100):
            mlflow.log_image(image1, key="dog", step=i, timestamp=i, synchronous=False)

        mlflow.flush_artifact_async_logging()

        logged_path = "images/"
        artifact_uri = mlflow.get_artifact_uri(logged_path)
        run_artifact_dir = local_file_uri_to_path(artifact_uri)
        files = os.listdir(run_artifact_dir)
        assert len(files) == 100 * 2
```

--------------------------------------------------------------------------------

---[FILE: test_mlflow_artifacts.py]---
Location: mlflow-master/tests/tracking/test_mlflow_artifacts.py

```python
import cgi
import os
import pathlib
import subprocess
import tempfile
from io import BytesIO
from typing import NamedTuple

import pytest
import requests

import mlflow
from mlflow import MlflowClient
from mlflow.artifacts import download_artifacts
from mlflow.store.tracking.sqlalchemy_store import SqlAlchemyStore
from mlflow.utils.os import is_windows

from tests.helper_functions import LOCALHOST, get_safe_port
from tests.tracking.integration_test_utils import _await_server_up_or_die


def _launch_server(host, port, backend_store_uri, default_artifact_root, artifacts_destination):
    extra_cmd = [] if is_windows() else ["--gunicorn-opts", "--log-level debug"]
    cmd = [
        "mlflow",
        "server",
        "--host",
        host,
        "--port",
        str(port),
        "--backend-store-uri",
        backend_store_uri,
        "--default-artifact-root",
        default_artifact_root,
        "--artifacts-destination",
        artifacts_destination,
        *extra_cmd,
    ]
    process = subprocess.Popen(cmd)
    _await_server_up_or_die(port)
    return process


class ArtifactsServer(NamedTuple):
    backend_store_uri: str
    default_artifact_root: str
    artifacts_destination: str
    url: str
    process: subprocess.Popen


@pytest.fixture(scope="module")
def artifacts_server():
    with tempfile.TemporaryDirectory() as tmpdir:
        port = get_safe_port()
        backend_store_uri = f"sqlite:///{os.path.join(tmpdir, 'mlruns.db')}"
        artifacts_destination = os.path.join(tmpdir, "mlartifacts")
        url = f"http://{LOCALHOST}:{port}"
        default_artifact_root = f"{url}/api/2.0/mlflow-artifacts/artifacts"
        # Initialize the database before launching the server process
        s = SqlAlchemyStore(backend_store_uri, default_artifact_root)
        s.engine.dispose()
        process = _launch_server(
            LOCALHOST,
            port,
            backend_store_uri,
            default_artifact_root,
            ("file:///" + artifacts_destination if is_windows() else artifacts_destination),
        )
        yield ArtifactsServer(
            backend_store_uri, default_artifact_root, artifacts_destination, url, process
        )
        process.kill()


def read_file(path):
    with open(path) as f:
        return f.read()


def upload_file(path, url, headers=None):
    with open(path, "rb") as f:
        requests.put(url, data=f, headers=headers).raise_for_status()


def download_file(url, local_path, headers=None):
    with requests.get(url, stream=True, headers=headers) as r:
        r.raise_for_status()
        assert r.headers["X-Content-Type-Options"] == "nosniff"
        assert "Content-Type" in r.headers
        assert "Content-Disposition" in r.headers
        with open(local_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        return r


def test_mlflow_artifacts_rest_apis(artifacts_server, tmp_path):
    default_artifact_root = artifacts_server.default_artifact_root
    artifacts_destination = artifacts_server.artifacts_destination

    # Upload artifacts
    file_a = tmp_path.joinpath("a.txt")
    file_a.write_text("0")
    upload_file(file_a, f"{default_artifact_root}/a.txt")
    assert os.path.exists(os.path.join(artifacts_destination, "a.txt"))
    assert read_file(os.path.join(artifacts_destination, "a.txt")) == "0"

    file_b = tmp_path.joinpath("b.txt")
    file_b.write_text("1")
    upload_file(file_b, f"{default_artifact_root}/dir/b.txt")
    assert os.path.join(artifacts_destination, "dir", "b.txt")
    assert read_file(os.path.join(artifacts_destination, "dir", "b.txt")) == "1"

    # Download artifacts
    local_dir = tmp_path.joinpath("folder")
    local_dir.mkdir()
    local_path_a = local_dir.joinpath("a.txt")
    download_file(f"{default_artifact_root}/a.txt", local_path_a)
    assert read_file(local_path_a) == "0"

    local_path_b = local_dir.joinpath("b.txt")
    download_file(f"{default_artifact_root}/dir/b.txt", local_path_b)
    assert read_file(local_path_b) == "1"

    # List artifacts
    resp = requests.get(default_artifact_root)
    assert resp.json() == {
        "files": [
            {"path": "a.txt", "is_dir": False, "file_size": 1},
            {"path": "dir", "is_dir": True},
        ]
    }
    resp = requests.get(default_artifact_root, params={"path": "dir"})
    assert resp.json() == {"files": [{"path": "b.txt", "is_dir": False, "file_size": 1}]}


def test_log_artifact(artifacts_server, tmp_path):
    url = artifacts_server.url
    artifacts_destination = artifacts_server.artifacts_destination
    mlflow.set_tracking_uri(url)

    tmp_path = tmp_path.joinpath("a.txt")
    tmp_path.write_text("0")

    with mlflow.start_run() as run:
        mlflow.log_artifact(tmp_path)

    experiment_id = "0"
    run_artifact_root = os.path.join(
        artifacts_destination, experiment_id, run.info.run_id, "artifacts"
    )
    dest_path = os.path.join(run_artifact_root, tmp_path.name)
    assert os.path.exists(dest_path)
    assert read_file(dest_path) == "0"

    with mlflow.start_run() as run:
        mlflow.log_artifact(tmp_path, artifact_path="artifact_path")

    run_artifact_root = os.path.join(
        artifacts_destination, experiment_id, run.info.run_id, "artifacts"
    )
    dest_path = os.path.join(run_artifact_root, "artifact_path", tmp_path.name)
    assert os.path.exists(dest_path)
    assert read_file(dest_path) == "0"


def test_log_artifacts(artifacts_server, tmp_path):
    url = artifacts_server.url
    mlflow.set_tracking_uri(url)

    tmp_path.joinpath("a.txt").write_text("0")
    d = tmp_path.joinpath("dir")
    d.mkdir()
    d.joinpath("b.txt").write_text("1")

    with mlflow.start_run() as run:
        mlflow.log_artifacts(tmp_path)

    client = MlflowClient()
    artifacts = [a.path for a in client.list_artifacts(run.info.run_id)]
    assert sorted(artifacts) == ["a.txt", "dir"]
    artifacts = [a.path for a in client.list_artifacts(run.info.run_id, "dir")]
    assert artifacts == ["dir/b.txt"]

    # With `artifact_path`
    with mlflow.start_run() as run:
        mlflow.log_artifacts(tmp_path, artifact_path="artifact_path")

    artifacts = [a.path for a in client.list_artifacts(run.info.run_id)]
    assert artifacts == ["artifact_path"]
    artifacts = [a.path for a in client.list_artifacts(run.info.run_id, "artifact_path")]
    assert sorted(artifacts) == ["artifact_path/a.txt", "artifact_path/dir"]
    artifacts = [a.path for a in client.list_artifacts(run.info.run_id, "artifact_path/dir")]
    assert artifacts == ["artifact_path/dir/b.txt"]


def test_list_artifacts(artifacts_server, tmp_path):
    url = artifacts_server.url
    mlflow.set_tracking_uri(url)

    tmp_path_a = tmp_path.joinpath("a.txt")
    tmp_path_a.write_text("0")
    tmp_path_b = tmp_path.joinpath("b.txt")
    tmp_path_b.write_text("1")
    client = MlflowClient()
    with mlflow.start_run() as run:
        assert client.list_artifacts(run.info.run_id) == []
        mlflow.log_artifact(tmp_path_a)
        mlflow.log_artifact(tmp_path_b, "dir")

    artifacts = [a.path for a in client.list_artifacts(run.info.run_id)]
    assert sorted(artifacts) == ["a.txt", "dir"]
    artifacts = [a.path for a in client.list_artifacts(run.info.run_id, "dir")]
    assert artifacts == ["dir/b.txt"]


def test_download_artifacts(artifacts_server, tmp_path):
    url = artifacts_server.url
    mlflow.set_tracking_uri(url)

    tmp_path_a = tmp_path.joinpath("a.txt")
    tmp_path_a.write_text("0")
    tmp_path_b = tmp_path.joinpath("b.txt")
    tmp_path_b.write_text("1")
    with mlflow.start_run() as run:
        mlflow.log_artifact(tmp_path_a)
        mlflow.log_artifact(tmp_path_b, "dir")

    dest_path = download_artifacts(run_id=run.info.run_id, artifact_path="")
    assert sorted(os.listdir(dest_path)) == ["a.txt", "dir"]
    assert read_file(os.path.join(dest_path, "a.txt")) == "0"
    dest_path = download_artifacts(run_id=run.info.run_id, artifact_path="dir")
    assert os.listdir(dest_path) == ["b.txt"]
    assert read_file(os.path.join(dest_path, "b.txt")) == "1"


def is_github_actions():
    return "GITHUB_ACTIONS" in os.environ


@pytest.mark.skipif(is_windows(), reason="This example doesn't work on Windows")
def test_mlflow_artifacts_example(tmp_path):
    root = pathlib.Path(mlflow.__file__).parents[1]
    # On GitHub Actions, remove generated images to save disk space
    rmi_option = "--rmi all" if is_github_actions() else ""
    cmd = f"""
err=0
trap 'err=1' ERR
./build.sh
docker compose run -v ${{PWD}}/example.py:/app/example.py client python example.py
docker compose logs
docker compose down {rmi_option} --volumes --remove-orphans
test $err = 0
"""
    script_path = tmp_path.joinpath("test.sh")
    script_path.write_text(cmd)
    subprocess.run(
        ["bash", script_path],
        check=True,
        cwd=os.path.join(root, "examples", "mlflow_artifacts"),
    )


def test_rest_tracking_api_list_artifacts_with_proxied_artifacts(artifacts_server, tmp_path):
    def list_artifacts_via_rest_api(url, run_id, path=None):
        if path:
            resp = requests.get(url, params={"run_id": run_id, "path": path})
        else:
            resp = requests.get(url, params={"run_id": run_id})
        resp.raise_for_status()
        return resp.json()

    url = artifacts_server.url
    mlflow.set_tracking_uri(url)
    api = f"{url}/api/2.0/mlflow/artifacts/list"

    tmp_path_a = tmp_path.joinpath("a.txt")
    tmp_path_a.write_text("0")
    tmp_path_b = tmp_path.joinpath("b.txt")
    tmp_path_b.write_text("1")
    mlflow.set_experiment("rest_list_api_test")
    with mlflow.start_run() as run:
        mlflow.log_artifact(tmp_path_a)
        mlflow.log_artifact(tmp_path_b, "dir")

    list_artifacts_response = list_artifacts_via_rest_api(url=api, run_id=run.info.run_id)
    assert list_artifacts_response.get("files") == [
        {"path": "a.txt", "is_dir": False, "file_size": 1},
        {"path": "dir", "is_dir": True},
    ]
    assert list_artifacts_response.get("root_uri") == run.info.artifact_uri

    nested_list_artifacts_response = list_artifacts_via_rest_api(
        url=api, run_id=run.info.run_id, path="dir"
    )
    assert nested_list_artifacts_response.get("files") == [
        {"path": "dir/b.txt", "is_dir": False, "file_size": 1},
    ]
    assert list_artifacts_response.get("root_uri") == run.info.artifact_uri


def test_rest_get_artifact_api_proxied_with_artifacts(artifacts_server, tmp_path):
    url = artifacts_server.url
    mlflow.set_tracking_uri(url)
    tmp_path_a = tmp_path.joinpath("a.txt")
    tmp_path_a.write_text("abcdefg")

    mlflow.set_experiment("rest_get_artifact_api_test")
    with mlflow.start_run() as run:
        mlflow.log_artifact(tmp_path_a)

    get_artifact_response = requests.get(
        url=f"{url}/get-artifact", params={"run_id": run.info.run_id, "path": "a.txt"}
    )
    get_artifact_response.raise_for_status()
    assert get_artifact_response.text == "abcdefg"


def test_rest_get_model_version_artifact_api_proxied_artifact_root(artifacts_server):
    url = artifacts_server.url
    artifact_file = pathlib.Path(artifacts_server.artifacts_destination, "a.txt")
    artifact_file.parent.mkdir(exist_ok=True, parents=True)
    artifact_file.write_text("abcdefg")

    name = "GetModelVersionTest"
    mlflow_client = MlflowClient(artifacts_server.backend_store_uri)
    mlflow_client.create_registered_model(name)
    # An artifact root with scheme http, https, or mlflow-artifacts is a proxied artifact root
    mlflow_client.create_model_version(name, "mlflow-artifacts:", 1)

    get_model_version_artifact_response = requests.get(
        url=f"{url}/model-versions/get-artifact",
        params={"name": name, "version": "1", "path": "a.txt"},
    )
    get_model_version_artifact_response.raise_for_status()
    assert get_model_version_artifact_response.text == "abcdefg"


@pytest.mark.parametrize(
    ("filename", "expected_mime_type"),
    [
        ("a.txt", "text/plain"),
        ("b.pkl", "application/octet-stream"),
        ("c.png", "image/png"),
        ("d.pdf", "application/pdf"),
        ("MLmodel", "text/plain"),
        ("mlproject", "text/plain"),
    ],
)
def test_mime_type_for_download_artifacts_api(
    artifacts_server, tmp_path, filename, expected_mime_type
):
    default_artifact_root = artifacts_server.default_artifact_root
    url = artifacts_server.url
    test_file = tmp_path.joinpath(filename)
    test_file.touch()
    upload_file(test_file, f"{default_artifact_root}/dir/{filename}")
    download_response = download_file(f"{default_artifact_root}/dir/{filename}", test_file)

    _, params = cgi.parse_header(download_response.headers["Content-Disposition"])
    assert params["filename"] == filename
    assert download_response.headers["Content-Type"] == expected_mime_type

    mlflow.set_tracking_uri(url)
    with mlflow.start_run() as run:
        mlflow.log_artifact(test_file)
    artifact_response = requests.get(
        url=f"{url}/get-artifact", params={"run_id": run.info.run_id, "path": filename}
    )
    artifact_response.raise_for_status()
    _, params = cgi.parse_header(artifact_response.headers["Content-Disposition"])
    assert params["filename"] == filename
    assert artifact_response.headers["Content-Type"] == expected_mime_type
    assert artifact_response.headers["X-Content-Type-Options"] == "nosniff"


def test_rest_get_artifact_api_log_image(artifacts_server):
    url = artifacts_server.url
    mlflow.set_tracking_uri(url)

    import numpy as np
    from PIL import Image

    image = np.random.randint(0, 256, size=(100, 100, 3), dtype=np.uint8)

    with mlflow.start_run() as run:
        mlflow.log_image(image, key="dog", step=100, timestamp=100, synchronous=True)

    artifact_list_response = requests.get(
        url=f"{url}/ajax-api/2.0/mlflow/artifacts/list",
        params={"path": "images", "run_id": run.info.run_id},
    )
    artifact_list_response.raise_for_status()

    for file in artifact_list_response.json()["files"]:
        path = file["path"]
        get_artifact_response = requests.get(
            url=f"{url}/get-artifact", params={"run_id": run.info.run_id, "path": path}
        )
        get_artifact_response.raise_for_status()
        assert (
            "attachment; filename=dog%step%100%timestamp%100"
            in get_artifact_response.headers["Content-Disposition"]
        )
        if path.endswith("png"):
            loaded_image = np.asarray(
                Image.open(BytesIO(get_artifact_response.content)), dtype=np.uint8
            )
            np.testing.assert_array_equal(loaded_image, image)


@pytest.mark.parametrize(
    ("filename", "requested_mime_type", "responded_mime_type"),
    [
        ("b.pkl", "text/html", "application/octet-stream"),
        ("c.png", "text/html", "image/png"),
        ("d.pdf", "text/html", "application/pdf"),
    ],
)
def test_server_overrides_requested_mime_type(
    artifacts_server, tmp_path, filename, requested_mime_type, responded_mime_type
):
    default_artifact_root = artifacts_server.default_artifact_root
    test_file = tmp_path.joinpath(filename)
    test_file.touch()
    upload_file(
        test_file,
        f"{default_artifact_root}/dir/{filename}",
    )
    download_response = download_file(
        f"{default_artifact_root}/dir/{filename}",
        test_file,
        headers={"Accept": requested_mime_type},
    )

    _, params = cgi.parse_header(download_response.headers["Content-Disposition"])
    assert params["filename"] == filename
    assert download_response.headers["Content-Type"] == responded_mime_type
```

--------------------------------------------------------------------------------

````
