---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 888
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 888 of 991)

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

---[FILE: test_spark_connect.py]---
Location: mlflow-master/tests/pyfunc/test_spark_connect.py

```python
import numpy as np
import pandas as pd
import pytest
from pyspark.sql import SparkSession
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression

import mlflow


@pytest.fixture(scope="module")
def spark():
    spark = SparkSession.builder.remote("local[2]").getOrCreate()
    yield spark
    spark.stop()


def test_spark_udf_spark_connect(spark):
    X, y = load_iris(return_X_y=True)
    model = LogisticRegression().fit(X, y)
    with mlflow.start_run():
        info = mlflow.sklearn.log_model(model, name="model")
    sdf = spark.createDataFrame(pd.DataFrame(X, columns=list("abcd")))
    udf = mlflow.pyfunc.spark_udf(spark, info.model_uri, env_manager="local")
    result = sdf.select(udf(*sdf.columns).alias("preds")).toPandas()
    np.testing.assert_almost_equal(result["preds"].to_numpy(), model.predict(X))


@pytest.mark.parametrize("env_manager", ["conda", "virtualenv"])
def test_spark_udf_spark_connect_unsupported_env_manager(spark, tmp_path, env_manager):
    with pytest.raises(
        mlflow.MlflowException,
        match=f"Environment manager {env_manager!r} is not supported",
    ):
        mlflow.pyfunc.spark_udf(spark, str(tmp_path), env_manager=env_manager)


def test_spark_udf_spark_connect_with_model_logging(spark, tmp_path):
    X, y = load_iris(return_X_y=True, as_frame=True)
    model = LogisticRegression().fit(X, y)

    mlflow.set_tracking_uri(tmp_path.joinpath("mlruns").as_uri())
    mlflow.set_experiment("test")
    with mlflow.start_run():
        signature = mlflow.models.infer_signature(X, y)
        model_info = mlflow.sklearn.log_model(model, name="model", signature=signature)

    udf = mlflow.pyfunc.spark_udf(spark, model_info.model_uri, env_manager="local")
    X_test = X.head(5)
    sdf = spark.createDataFrame(X_test)
    preds = sdf.select(udf(*X_test.columns).alias("preds")).toPandas()["preds"]
    np.testing.assert_array_almost_equal(preds, model.predict(X_test))
```

--------------------------------------------------------------------------------

---[FILE: test_virtualenv.py]---
Location: mlflow-master/tests/pyfunc/test_virtualenv.py

```python
import os
import sys
from io import BytesIO
from stat import S_IRGRP, S_IROTH, S_IRUSR, S_IXGRP, S_IXOTH, S_IXUSR
from typing import NamedTuple

import numpy as np
import pandas as pd
import pytest
import sklearn
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression

import mlflow
from mlflow.environment_variables import MLFLOW_ENV_ROOT
from mlflow.pyfunc.scoring_server import CONTENT_TYPE_JSON
from mlflow.utils.environment import _PYTHON_ENV_FILE_NAME, _REQUIREMENTS_FILE_NAME
from mlflow.utils.virtualenv import (
    _is_pyenv_available,
    _is_virtualenv_available,
)

from tests.helper_functions import pyfunc_serve_and_score_model

pytestmark = pytest.mark.skipif(
    not (_is_pyenv_available() and _is_virtualenv_available()),
    reason="requires pyenv and virtualenv",
)

TEST_DIR = "tests"
TEST_MLFLOW_1X_MODEL_DIR = os.path.join(TEST_DIR, "resources", "example_mlflow_1x_sklearn_model")


class Model(NamedTuple):
    model: LogisticRegression
    X_pred: pd.DataFrame
    y_pred: np.ndarray


@pytest.fixture(scope="module")
def sklearn_model():
    X, y = load_iris(return_X_y=True, as_frame=True)
    model = LogisticRegression().fit(X, y)
    X_pred = X.sample(frac=0.1, random_state=0)
    y_pred = model.predict(X_pred)
    return Model(model, X_pred, y_pred)


def serve_and_score(model_uri, data, extra_args=None):
    resp = pyfunc_serve_and_score_model(
        model_uri,
        data=data,
        content_type=CONTENT_TYPE_JSON,
        extra_args=["--env-manager=virtualenv"] + (extra_args or []),
    )
    return pd.read_json(BytesIO(resp.content), orient="records").values.squeeze()


@pytest.fixture
def temp_mlflow_env_root(tmp_path, monkeypatch):
    env_root = tmp_path / "envs"
    env_root.mkdir(exist_ok=True)
    monkeypatch.setenv(MLFLOW_ENV_ROOT.name, str(env_root))
    return env_root


use_temp_mlflow_env_root = pytest.mark.usefixtures(temp_mlflow_env_root.__name__)


@use_temp_mlflow_env_root
def test_restore_environment_with_virtualenv(sklearn_model):
    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(sklearn_model.model, name="model")

    scores = serve_and_score(model_info.model_uri, sklearn_model.X_pred)
    np.testing.assert_array_almost_equal(scores, sklearn_model.y_pred)


@use_temp_mlflow_env_root
def test_serve_and_score_read_only_model_directory(sklearn_model, tmp_path):
    model_path = str(tmp_path / "model")
    mlflow.sklearn.save_model(sklearn_model.model, path=model_path)
    os.chmod(
        model_path,
        S_IRUSR | S_IRGRP | S_IROTH | S_IXUSR | S_IXGRP | S_IXOTH,
    )

    scores = serve_and_score(model_path, sklearn_model.X_pred)
    np.testing.assert_array_almost_equal(scores, sklearn_model.y_pred)


@use_temp_mlflow_env_root
def test_serve_and_score_1x_models():
    X, _ = load_iris(return_X_y=True, as_frame=True)
    X_pred = X.sample(frac=0.1, random_state=0)
    loaded_model = mlflow.pyfunc.load_model(TEST_MLFLOW_1X_MODEL_DIR)
    y_pred = loaded_model.predict(X_pred)

    scores = serve_and_score(TEST_MLFLOW_1X_MODEL_DIR, X_pred)
    np.testing.assert_array_almost_equal(scores, y_pred)


@use_temp_mlflow_env_root
def test_reuse_environment(temp_mlflow_env_root, sklearn_model):
    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(sklearn_model.model, name="model")

    # Serve the model
    scores = serve_and_score(model_info.model_uri, sklearn_model.X_pred)
    np.testing.assert_array_almost_equal(scores, sklearn_model.y_pred)
    # Serve the model again. The environment created in the previous serving should be reused.
    scores = serve_and_score(model_info.model_uri, sklearn_model.X_pred)
    np.testing.assert_array_almost_equal(scores, sklearn_model.y_pred)
    assert len(list(temp_mlflow_env_root.iterdir())) == 1


@use_temp_mlflow_env_root
def test_different_requirements_create_different_environments(temp_mlflow_env_root, sklearn_model):
    sklearn_req = f"scikit-learn=={sklearn.__version__}"
    with mlflow.start_run():
        model_info1 = mlflow.sklearn.log_model(
            sklearn_model.model,
            name="model",
            pip_requirements=[sklearn_req],
        )
    scores = serve_and_score(model_info1.model_uri, sklearn_model.X_pred)
    np.testing.assert_array_almost_equal(scores, sklearn_model.y_pred)

    # Log the same model with different requirements
    with mlflow.start_run():
        model_info2 = mlflow.sklearn.log_model(
            sklearn_model.model,
            name="model",
            pip_requirements=[sklearn_req, "numpy"],
        )
    scores = serve_and_score(model_info2.model_uri, sklearn_model.X_pred)
    np.testing.assert_array_almost_equal(scores, sklearn_model.y_pred)
    # Two environments should exist now because the first and second models have different
    # requirements
    assert len(list(temp_mlflow_env_root.iterdir())) == 2


@use_temp_mlflow_env_root
def test_environment_directory_is_cleaned_up_when_unexpected_error_occurs(
    temp_mlflow_env_root, sklearn_model
):
    sklearn_req = "scikit-learn==999.999.999"
    with mlflow.start_run():
        model_info1 = mlflow.sklearn.log_model(
            sklearn_model.model,
            name="model",
            pip_requirements=[sklearn_req],
        )

    try:
        serve_and_score(model_info1.model_uri, sklearn_model.X_pred)
    except Exception:
        pass
    else:
        assert False, "Should have raised an exception"
    assert len(list(temp_mlflow_env_root.iterdir())) == 0


@use_temp_mlflow_env_root
def test_python_env_file_does_not_exist(sklearn_model, tmp_path):
    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(sklearn_model.model, name="model")

    mlflow.artifacts.download_artifacts(artifact_uri=model_info.model_uri, dst_path=tmp_path)
    python_env = next(tmp_path.rglob(_PYTHON_ENV_FILE_NAME))
    python_env.unlink()

    scores = serve_and_score(tmp_path, sklearn_model.X_pred)
    np.testing.assert_array_almost_equal(scores, sklearn_model.y_pred)


@use_temp_mlflow_env_root
def test_python_env_file_and_requirements_file_do_not_exist(sklearn_model, tmp_path):
    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(sklearn_model.model, name="model")

    mlflow.artifacts.download_artifacts(artifact_uri=model_info.model_uri, dst_path=tmp_path)
    python_env = next(tmp_path.rglob(_PYTHON_ENV_FILE_NAME))
    python_env.unlink()
    requirements = next(tmp_path.rglob(_REQUIREMENTS_FILE_NAME))
    requirements.unlink()

    scores = serve_and_score(tmp_path, sklearn_model.X_pred)
    np.testing.assert_array_almost_equal(scores, sklearn_model.y_pred)


def test_environment_is_removed_when_package_installation_fails(
    temp_mlflow_env_root, sklearn_model
):
    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(
            sklearn_model.model,
            name="model",
            # Enforce pip install to fail using a non-existent package version
            pip_requirements=["mlflow==999.999.999"],
        )
    with pytest.raises(AssertionError, match="scoring process died"):
        serve_and_score(model_info.model_uri, sklearn_model.X_pred)
    assert len(list(temp_mlflow_env_root.iterdir())) == 0


@use_temp_mlflow_env_root
def test_restore_environment_from_conda_yaml_containing_conda_packages(sklearn_model, tmp_path):
    conda_env = {
        "name": "mlflow-env",
        "channels": ["conda-forge"],
        "dependencies": [
            "python=" + ".".join(map(str, sys.version_info[:3])),
            "conda-package=1.2.3",  # conda package
            "pip",
            {
                "pip": [
                    "mlflow",
                    f"scikit-learn=={sklearn.__version__}",
                ]
            },
        ],
    }
    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(
            sklearn_model.model,
            name="model",
            conda_env=conda_env,
        )

    mlflow.artifacts.download_artifacts(artifact_uri=model_info.model_uri, dst_path=tmp_path)
    python_env = next(tmp_path.rglob(_PYTHON_ENV_FILE_NAME))
    python_env.unlink()
    serve_and_score(tmp_path, sklearn_model.X_pred)
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/tests/pyfunc/utils.py
Signals: FastAPI

```python
import json
import os
from typing import TYPE_CHECKING

from fastapi.testclient import TestClient

import mlflow
from mlflow.pyfunc import scoring_server

if TYPE_CHECKING:
    import httpx


def score_model_in_process(model_uri: str, data: str, content_type: str) -> "httpx.Response":
    """Score a model using in-process FastAPI TestClient (faster than subprocess)."""
    import pandas as pd

    env_snapshot = os.environ.copy()
    try:
        model = mlflow.pyfunc.load_model(model_uri)
        app = scoring_server.init(model)
        client = TestClient(app)

        # Convert DataFrame to JSON format if needed (matching RestEndpoint.invoke behavior)
        if isinstance(data, pd.DataFrame):
            if content_type == scoring_server.CONTENT_TYPE_CSV:
                data = data.to_csv(index=False)
            else:
                assert content_type == scoring_server.CONTENT_TYPE_JSON
                data = json.dumps({"dataframe_split": data.to_dict(orient="split")})
        elif not isinstance(data, (str, dict)):
            data = json.dumps({"instances": data})

        return client.post("/invocations", content=data, headers={"Content-Type": content_type})
    finally:
        os.environ.clear()
        os.environ.update(env_snapshot)
```

--------------------------------------------------------------------------------

---[FILE: loader.py]---
Location: mlflow-master/tests/pyfunc/custom_model/loader.py

```python
import pickle

from custom_model.mod1 import mod2

__all__ = ["mod2"]


def _load_pyfunc(path):
    with open(path, "rb") as f:
        return pickle.load(f, encoding="latin1")
```

--------------------------------------------------------------------------------

---[FILE: mod4.py]---
Location: mlflow-master/tests/pyfunc/custom_model/mod1/mod4.py

```python
# The 2 importing commands are for testing these imported library
# code files won't be captured by `infer_code_paths=True`
import scipy
import sklearn

sk_version = sklearn.__version__
scipy_version = scipy.__version__
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/tests/pyfunc/custom_model/mod1/__init__.py

```python
from . import mod2  # noqa

__all__ = ["mod2"]
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/tests/pyfunc/custom_model/mod1/mod2/__init__.py

```python
from .. import mod4  # noqa

__all__ = ["mod4"]
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/pyfunc/docker/conftest.py

```python
import logging
import os
import subprocess
from functools import lru_cache

import docker
import pytest
import requests
from packaging.version import Version

import mlflow

TEST_IMAGE_NAME = "test_image"
MLFLOW_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
RESOURCE_DIR = os.path.join(MLFLOW_ROOT, "tests", "resources", "dockerfile")

docker_client = docker.from_env()

_logger = logging.getLogger(__name__)


@pytest.fixture(autouse=True)
def clean_up_docker():
    yield

    # Get all containers using the test image
    containers = docker_client.containers.list(filters={"ancestor": TEST_IMAGE_NAME})
    for container in containers:
        container.remove(force=True)

    # Clean up the image
    try:
        docker_client.images.remove(TEST_IMAGE_NAME, force=True)
    except docker.errors.ImageNotFound:
        pass

    # Clean up the build cache and volumes
    try:
        subprocess.check_call(["docker", "builder", "prune", "-a", "-f"])
    except subprocess.CalledProcessError as e:
        _logger.warning("Failed to clean up docker system: %s", e)


@lru_cache(maxsize=1)
def get_released_mlflow_version():
    url = "https://pypi.org/pypi/mlflow/json"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    versions = [
        v for v in map(Version, data["releases"]) if not (v.is_devrelease or v.is_prerelease)
    ]
    return str(max(versions))


def save_model_with_latest_mlflow_version(flavor, extra_pip_requirements=None, **kwargs):
    """
    Save a model with overriding MLflow version from dev version to the latest released version.
    By default a model is saved with the dev version of MLflow, which is not available on PyPI.
    Usually we can be workaround this by adding --serve-wheel flag that starts local PyPI server,
    however, this doesn't work when installing dependencies inside Docker container. Hence, this
    function uses `extra_pip_requirements` to save the model with the latest released MLflow.
    """
    latest_mlflow_version = get_released_mlflow_version()
    if flavor == "langchain":
        kwargs["pip_requirements"] = [
            f"mlflow[gateway]=={latest_mlflow_version}",
            "langchain<1.1.0",
        ]
    else:
        extra_pip_requirements = extra_pip_requirements or []
        extra_pip_requirements.append(f"mlflow=={latest_mlflow_version}")
        if flavor == "lightgbm":
            # Adding pyarrow < 18 to prevent pip installation resolution conflicts.
            extra_pip_requirements.append("pyarrow<18")
        kwargs["extra_pip_requirements"] = extra_pip_requirements
    flavor_module = getattr(mlflow, flavor)
    flavor_module.save_model(**kwargs)
```

--------------------------------------------------------------------------------

---[FILE: test_docker.py]---
Location: mlflow-master/tests/pyfunc/docker/test_docker.py

```python
import difflib
import os
import shutil
from dataclasses import dataclass
from pathlib import Path
from unittest import mock

import pytest
import sklearn
import sklearn.neighbors

import mlflow
from mlflow.environment_variables import _MLFLOW_RUN_SLOW_TESTS
from mlflow.models import Model
from mlflow.models.docker_utils import build_image_from_context
from mlflow.models.flavor_backend_registry import get_flavor_backend
from mlflow.utils import PYTHON_VERSION
from mlflow.utils.env_manager import CONDA, LOCAL, VIRTUALENV
from mlflow.version import VERSION

from tests.pyfunc.docker.conftest import RESOURCE_DIR, get_released_mlflow_version


def assert_dockerfiles_equal(actual_dockerfile_path: Path, expected_dockerfile_path: Path):
    actual_dockerfile = actual_dockerfile_path.read_text().replace(
        VERSION, get_released_mlflow_version()
    )
    expected_dockerfile = (
        expected_dockerfile_path.read_text()
        .replace("${{ MLFLOW_VERSION }}", get_released_mlflow_version())
        .replace("${{ PYTHON_VERSION }}", PYTHON_VERSION)
    )
    assert actual_dockerfile == expected_dockerfile, (
        "Generated Dockerfile does not match expected one. Diff:\n"
        + "\n".join(
            difflib.unified_diff(expected_dockerfile.splitlines(), actual_dockerfile.splitlines())
        )
    )


def save_model(tmp_path):
    knn_model = sklearn.neighbors.KNeighborsClassifier()
    model_path = os.path.join(tmp_path, "model")
    mlflow.sklearn.save_model(
        knn_model,
        path=model_path,
        pip_requirements=[
            f"mlflow=={get_released_mlflow_version()}",
            f"scikit-learn=={sklearn.__version__}",
        ],  # Skip requirements inference for speed up
    )
    return model_path


def add_spark_flavor_to_model(model_path):
    model_config_path = os.path.join(model_path, "MLmodel")
    model = Model.load(model_config_path)
    model.add_flavor("spark", spark_version="3.5.0")
    model.save(model_config_path)


@dataclass
class Param:
    expected_dockerfile: str
    env_manager: str | None = None
    mlflow_home: str | None = None
    install_mlflow: bool = False
    enable_mlserver: bool = False
    # If True, image is built with --model-uri param
    specify_model_uri: bool = True


@pytest.mark.parametrize(
    "params",
    [
        Param(expected_dockerfile="Dockerfile_default"),
        Param(expected_dockerfile="Dockerfile_default", env_manager=LOCAL),
        Param(expected_dockerfile="Dockerfile_java_flavor", env_manager=VIRTUALENV),
        Param(expected_dockerfile="Dockerfile_conda", env_manager=CONDA),
        Param(install_mlflow=True, expected_dockerfile="Dockerfile_install_mlflow"),
        Param(enable_mlserver=True, expected_dockerfile="Dockerfile_enable_mlserver"),
        Param(mlflow_home=".", expected_dockerfile="Dockerfile_with_mlflow_home"),
        Param(specify_model_uri=False, expected_dockerfile="Dockerfile_no_model_uri"),
    ],
)
def test_build_image(tmp_path, params):
    model_uri = save_model(tmp_path) if params.specify_model_uri else None

    backend = get_flavor_backend(model_uri, docker_build=True, env_manager=params.env_manager)

    # Copy the context dir to a temp dir so we can verify the generated Dockerfile
    def _build_image_with_copy(context_dir, image_name):
        # Replace mlflow dev version in Dockerfile with the latest released one
        dockerfile = Path(context_dir) / "Dockerfile"
        content = dockerfile.read_text()
        content = content.replace(VERSION, get_released_mlflow_version())
        dockerfile.write_text(content)
        shutil.copytree(context_dir, dst_dir)
        # Build the image if the slow-tests flag is enabled
        if _MLFLOW_RUN_SLOW_TESTS.get():
            for _ in range(3):
                try:
                    # Docker image build is unstable on GitHub Actions, retry up to 3 times
                    build_image_from_context(context_dir, image_name)
                    break
                except RuntimeError:
                    pass
            else:
                raise RuntimeError("Docker image build failed.")

    dst_dir = tmp_path / "context"
    with mock.patch(
        "mlflow.models.docker_utils.build_image_from_context",
        side_effect=_build_image_with_copy,
    ):
        backend.build_image(
            model_uri=model_uri,
            image_name="test_image",
            mlflow_home=params.mlflow_home,
            install_mlflow=params.install_mlflow,
            enable_mlserver=params.enable_mlserver,
        )

    actual = dst_dir / "Dockerfile"
    expected = Path(RESOURCE_DIR) / params.expected_dockerfile
    assert_dockerfiles_equal(actual, expected)


def test_generate_dockerfile_for_java_flavor(tmp_path):
    model_path = save_model(tmp_path)
    add_spark_flavor_to_model(model_path)

    backend = get_flavor_backend(model_path, docker_build=True, env_manager=None)

    backend.generate_dockerfile(
        model_uri=model_path,
        output_dir=tmp_path,
    )

    actual = tmp_path / "Dockerfile"
    expected = Path(RESOURCE_DIR) / "Dockerfile_java_flavor"
    assert_dockerfiles_equal(actual, expected)


def test_generate_dockerfile_for_custom_image(tmp_path):
    model_path = save_model(tmp_path)
    add_spark_flavor_to_model(model_path)

    backend = get_flavor_backend(model_path, docker_build=True, env_manager=None)

    backend.generate_dockerfile(
        base_image="quay.io/jupyter/scipy-notebook:latest",
        model_uri=model_path,
        output_dir=tmp_path,
    )

    actual = tmp_path / "Dockerfile"
    expected = Path(RESOURCE_DIR) / "Dockerfile_custom_scipy"
    assert_dockerfiles_equal(actual, expected)
```

--------------------------------------------------------------------------------

---[FILE: test_docker_flavors.py]---
Location: mlflow-master/tests/pyfunc/docker/test_docker_flavors.py

```python
"""
This test class is used for comprehensive testing of serving docker images for all MLflow flavors.
As such, it is not intended to be run on a regular basis and is skipped by default. Rather, it
should be run manually when making changes to the core docker logic.

To run this test, run the following command manually

    $ pytest tests/pyfunc/test_docker_flavors.py

"""

import contextlib
import os
import shutil
import sys
import threading
import time
from operator import itemgetter

import pandas as pd
import pytest
import requests

import mlflow
from mlflow.environment_variables import _MLFLOW_RUN_SLOW_TESTS
from mlflow.models.flavor_backend_registry import get_flavor_backend
from mlflow.models.utils import load_serving_example

# Only import model fixtures if when MLFLOW_RUN_SLOW_TESTS environment variable is set to true
if _MLFLOW_RUN_SLOW_TESTS.get():
    from tests.catboost.test_catboost_model_export import reg_model  # noqa: F401
    from tests.h2o.test_h2o_model_export import h2o_iris_model  # noqa: F401
    from tests.helper_functions import get_safe_port
    from tests.langchain.test_langchain_model_export import fake_chat_model  # noqa: F401
    from tests.lightgbm.test_lightgbm_model_export import lgb_model  # noqa: F401
    from tests.models.test_model import iris_data, sklearn_knn_model  # noqa: F401
    from tests.paddle.test_paddle_model_export import pd_model  # noqa: F401
    from tests.pmdarima.test_pmdarima_model_export import (  # noqa: F401
        auto_arima_object_model,
        test_data,
    )
    from tests.prophet.test_prophet_model_export import (
        prophet_model as prophet_raw_model,  # noqa: F401
    )
    from tests.pyfunc.docker.conftest import (
        MLFLOW_ROOT,
        TEST_IMAGE_NAME,
        docker_client,
        save_model_with_latest_mlflow_version,
    )
    from tests.spacy.test_spacy_model_export import spacy_model_with_data  # noqa: F401
    from tests.spark.test_spark_model_export import (  # noqa: F401
        iris_df,
        spark,
        spark_model_iris,
    )
    from tests.statsmodels.model_fixtures import ols_model
    from tests.tensorflow.test_tensorflow2_core_model_export import tf2_toy_model  # noqa: F401
    from tests.transformers.helper import load_text_classification_pipeline


pytestmark = pytest.mark.skipif(
    not _MLFLOW_RUN_SLOW_TESTS.get(),
    reason="Skip slow tests. Set MLFLOW_RUN_SLOW_TESTS environment variable to run them.",
)


@pytest.fixture
def model_path(tmp_path):
    model_path = tmp_path.joinpath("model")

    yield model_path

    # Pytest keeps the temporary directory created by `tmp_path` fixture for 3 recent test sessions
    # by default. This is useful for debugging during local testing, but in CI it just wastes the
    # disk space.
    if os.getenv("GITHUB_ACTIONS") == "true":
        shutil.rmtree(model_path, ignore_errors=True)


@contextlib.contextmanager
def start_container(port: int):
    container = docker_client.containers.run(
        image=TEST_IMAGE_NAME,
        ports={8080: port},
        detach=True,
    )

    def stream_logs():
        for line in container.logs(stream=True):
            sys.stdout.write(line.decode("utf-8"))

    # Start a thread to stream logs from the container
    t = threading.Thread(target=stream_logs, daemon=True)
    t.start()

    try:
        # Wait for the server to start
        for _ in range(30):
            try:
                response = requests.get(url=f"http://localhost:{port}/ping")
                if response.ok:
                    break
            except requests.exceptions.ConnectionError as e:
                sys.stdout.write(f"An exception occurred when calling the server: {e}\n")

            container.reload()  # update container status
            if container.status == "exited":
                raise Exception("Container exited unexpectedly.")

            sys.stdout.write(f"Container status: {container.status}\n")
            time.sleep(5)

        else:
            raise TimeoutError("Failed to start server.")

        yield container
    finally:
        container.stop()
        container.remove()
        t.join(timeout=5)


@pytest.mark.parametrize(
    ("flavor"),
    [
        "catboost",
        "h2o",
        # "johnsnowlabs", # Couldn't test JohnSnowLab locally due to license issue
        "keras",
        "langchain",
        "lightgbm",
        "onnx",
        # "openai", # OPENAI API KEY is not necessarily available for everyone
        "paddle",
        "pmdarima",
        "prophet",
        "pyfunc",
        "pytorch",
        "sklearn",
        "spacy",
        "spark",
        "statsmodels",
        "tensorflow",
        "transformers_pt",  # Test with Pytorch-based model
    ],
)
def test_build_image_and_serve(flavor, request):
    model_path = str(request.getfixturevalue(f"{flavor}_model"))
    flavor = flavor.split("_")[0]  # Remove _pt or _tf from the flavor name

    # Build an image
    backend = get_flavor_backend(model_uri=model_path, docker_build=True, env_manager=None)
    backend.build_image(
        model_uri=model_path,
        image_name=TEST_IMAGE_NAME,
        mlflow_home=MLFLOW_ROOT,  # Required to prevent installing dev version of MLflow from PyPI
    )

    # Run a container
    port = get_safe_port()
    with start_container(port):
        # Make a scoring request with a saved serving input example
        inference_payload = load_serving_example(model_path)

        response = requests.post(
            url=f"http://localhost:{port}/invocations",
            data=inference_payload,
            headers={"Content-Type": "application/json"},
        )

        assert response.status_code == 200, f"Response: {response.text}"
        if flavor == "langchain":
            # "messages" key is unified llm input, output is not wrapped into predictions
            assert response.json() == ["Hi"]
        else:
            assert "predictions" in response.json(), f"Response: {response.text}"


@pytest.fixture
def catboost_model(model_path, reg_model):
    save_model_with_latest_mlflow_version(
        flavor="catboost",
        cb_model=reg_model.model,
        path=model_path,
        input_example=reg_model.inference_dataframe[:1],
    )
    return model_path


@pytest.fixture
def h2o_model(model_path, h2o_iris_model):
    save_model_with_latest_mlflow_version(
        flavor="h2o",
        h2o_model=h2o_iris_model.model,
        path=model_path,
        input_example=h2o_iris_model.inference_data.as_data_frame()[:1],
    )
    return model_path


@pytest.fixture
def keras_model(model_path, iris_data):
    from sklearn import datasets
    from tensorflow.keras.layers import Dense
    from tensorflow.keras.models import Sequential

    model = Sequential()
    model.add(Dense(3, input_dim=4))
    model.add(Dense(1))

    X, y = datasets.load_iris(return_X_y=True)
    save_model_with_latest_mlflow_version(
        flavor="tensorflow",
        model=model,
        path=model_path,
        input_example=X[:3, :],
    )
    return model_path


@pytest.fixture
def langchain_model(model_path):
    from langchain.schema.runnable import RunnablePassthrough

    chain = RunnablePassthrough() | itemgetter("messages")
    save_model_with_latest_mlflow_version(
        flavor="langchain",
        lc_model=chain,
        path=model_path,
        input_example={"messages": "Hi"},
    )
    return model_path


@pytest.fixture
def lightgbm_model(model_path, lgb_model):
    save_model_with_latest_mlflow_version(
        flavor="lightgbm",
        lgb_model=lgb_model.model,
        path=model_path,
        input_example=lgb_model.inference_dataframe.to_numpy()[:1],
    )
    return model_path


@pytest.fixture
def onnx_model(tmp_path, model_path):
    import numpy as np
    import onnx
    import torch
    from torch import nn

    model = torch.nn.Sequential(nn.Linear(4, 3), nn.ReLU(), nn.Linear(3, 1))
    onnx_model_path = os.path.join(tmp_path, "torch_onnx")
    torch.onnx.export(
        model,
        torch.randn(1, 4),
        onnx_model_path,
        dynamic_axes={"input": {0: "batch"}},
        input_names=["input"],
    )
    onnx_model = onnx.load(onnx_model_path)

    model_path = str(tmp_path / "onnx_model")
    save_model_with_latest_mlflow_version(
        flavor="onnx",
        onnx_model=onnx_model,
        path=model_path,
        input_example=np.random.rand(1, 4).astype(np.float32),
    )
    return model_path


@pytest.fixture
def paddle_model(model_path, pd_model):
    save_model_with_latest_mlflow_version(
        flavor="paddle",
        pd_model=pd_model.model,
        path=model_path,
        input_example=pd_model.inference_dataframe[:1],
    )
    return model_path


@pytest.fixture
def pmdarima_model(model_path, auto_arima_object_model):
    save_model_with_latest_mlflow_version(
        flavor="pmdarima",
        pmdarima_model=auto_arima_object_model,
        path=model_path,
        input_example=pd.DataFrame({"n_periods": [30]}),
    )
    return model_path


@pytest.fixture
def prophet_model(model_path, prophet_raw_model):
    save_model_with_latest_mlflow_version(
        flavor="prophet",
        pr_model=prophet_raw_model.model,
        path=model_path,
        input_example=prophet_raw_model.data[:1],
        # Prophet does not handle numpy 2 yet. https://github.com/facebook/prophet/issues/2595
        extra_pip_requirements=["numpy<2"],
    )
    return model_path


@pytest.fixture
def pyfunc_model(model_path):
    class CustomModel(mlflow.pyfunc.PythonModel):
        def __init__(self):
            pass

        def predict(self, context, model_input):
            return model_input

    save_model_with_latest_mlflow_version(
        flavor="pyfunc",
        python_model=CustomModel(),
        path=model_path,
        input_example=[1, 2, 3],
    )
    return model_path


@pytest.fixture
def pytorch_model(model_path):
    from torch import nn, randn

    model = nn.Sequential(nn.Linear(4, 3), nn.ReLU(), nn.Linear(3, 1))
    save_model_with_latest_mlflow_version(
        flavor="pytorch",
        pytorch_model=model,
        path=model_path,
        input_example=randn(1, 4).numpy(),
    )
    return model_path


@pytest.fixture
def sklearn_model(model_path, sklearn_knn_model, iris_data):
    save_model_with_latest_mlflow_version(
        flavor="sklearn",
        sk_model=sklearn_knn_model,
        path=model_path,
        input_example=iris_data[0][:1],
    )
    return model_path


@pytest.fixture
def spacy_model(model_path, spacy_model_with_data):
    save_model_with_latest_mlflow_version(
        flavor="spacy",
        spacy_model=spacy_model_with_data.model,
        path=model_path,
        input_example=spacy_model_with_data.inference_data[:1],
    )
    return model_path


@pytest.fixture
def spark_model(model_path, spark_model_iris):
    save_model_with_latest_mlflow_version(
        flavor="spark",
        spark_model=spark_model_iris.model,
        path=model_path,
        input_example=spark_model_iris.spark_df.toPandas()[:1],
    )
    return model_path


@pytest.fixture
def statsmodels_model(model_path):
    model = ols_model()
    save_model_with_latest_mlflow_version(
        flavor="statsmodels",
        statsmodels_model=model.model,
        path=model_path,
        input_example=model.inference_dataframe[:1],
    )
    return model_path


@pytest.fixture
def tensorflow_model(model_path, tf2_toy_model):
    save_model_with_latest_mlflow_version(
        flavor="tensorflow",
        model=tf2_toy_model.model,
        path=model_path,
        input_example=tf2_toy_model.inference_data[:1],
    )
    return model_path


@pytest.fixture
def transformers_pt_model(model_path):
    pipeline = load_text_classification_pipeline()
    save_model_with_latest_mlflow_version(
        flavor="transformers",
        transformers_model=pipeline,
        path=model_path,
        input_example="hi",
    )
    return model_path
```

--------------------------------------------------------------------------------

---[FILE: code_with_dependencies.py]---
Location: mlflow-master/tests/pyfunc/sample_code/code_with_dependencies.py

```python
import os

import mlflow
from mlflow.models import set_model, set_retriever_schema
from mlflow.pyfunc import PythonModel

test_trace = os.environ.get("TEST_TRACE", "true").lower() == "true"


class MyModel(PythonModel):
    def _call_retriever(self, id):
        return f"Retriever called with ID: {id}. Output: 42."

    def predict(self, context, model_input):
        return f"Input: {model_input}. {self._call_retriever(model_input)}"

    def predict_stream(self, context, model_input, params=None):
        yield f"Input: {model_input}. {self._call_retriever(model_input)}"


class MyModelWithTrace(PythonModel):
    def _call_retriever(self, id):
        return f"Retriever called with ID: {id}. Output: 42."

    @mlflow.trace
    def predict(self, context, model_input):
        return f"Input: {model_input}. {self._call_retriever(model_input)}"

    @mlflow.trace
    def predict_stream(self, context, model_input, params=None):
        yield f"Input: {model_input}. {self._call_retriever(model_input)}"


model = MyModelWithTrace() if test_trace else MyModel()
set_model(model)
set_retriever_schema(
    primary_key="primary-key",
    text_column="text-column",
    doc_uri="doc-uri",
    other_columns=["column1", "column2"],
)
```

--------------------------------------------------------------------------------

---[FILE: config.yml]---
Location: mlflow-master/tests/pyfunc/sample_code/config.yml

```yaml
use_gpu: True
temperature: 0.9
timeout: 300
```

--------------------------------------------------------------------------------

---[FILE: func_code.py]---
Location: mlflow-master/tests/pyfunc/sample_code/func_code.py

```python
from mlflow.models import set_model


def predict(model_input):
    return model_input


set_model(predict)
```

--------------------------------------------------------------------------------

---[FILE: func_code_with_config.py]---
Location: mlflow-master/tests/pyfunc/sample_code/func_code_with_config.py

```python
from mlflow.models import ModelConfig, set_model


def predict(model_input: list[str]):
    model_config = ModelConfig(development_config="tests/pyfunc/sample_code/config.yml")
    timeout = model_config.get("timeout")
    return f"This was the input: {model_input[0]}, timeout {timeout}"


set_model(predict)
```

--------------------------------------------------------------------------------

---[FILE: func_code_with_type_hint.py]---
Location: mlflow-master/tests/pyfunc/sample_code/func_code_with_type_hint.py

```python
from mlflow.models import set_model


def predict(model_input: list[str]):
    return model_input


set_model(predict)
```

--------------------------------------------------------------------------------

---[FILE: python_model.py]---
Location: mlflow-master/tests/pyfunc/sample_code/python_model.py

```python
from mlflow.models import set_model
from mlflow.pyfunc import PythonModel


class MyModel(PythonModel):
    def predict(self, context, model_input):
        return f"This was the input: {model_input}"


set_model(MyModel())
```

--------------------------------------------------------------------------------

---[FILE: python_model_with_config.py]---
Location: mlflow-master/tests/pyfunc/sample_code/python_model_with_config.py

```python
from mlflow.models import ModelConfig, set_model
from mlflow.pyfunc import PythonModel

base_config = ModelConfig(development_config="tests/pyfunc/sample_code/config.yml")


class MyModel(PythonModel):
    def predict(self, context, model_input):
        timeout = base_config.get("timeout")
        return f"Predict called with input {model_input}, timeout {timeout}"


set_model(MyModel())
```

--------------------------------------------------------------------------------

---[FILE: python_model_with_utils.py]---
Location: mlflow-master/tests/pyfunc/sample_code/python_model_with_utils.py

```python
from mlflow.models import set_model
from mlflow.pyfunc import PythonModel


class MyModel(PythonModel):
    def predict(self, context, model_input):
        from utils import my_function

        return my_function(model_input)


set_model(MyModel())
```

--------------------------------------------------------------------------------

---[FILE: streamable_model_code.py]---
Location: mlflow-master/tests/pyfunc/sample_code/streamable_model_code.py

```python
from mlflow.models import set_model
from mlflow.pyfunc import PythonModel


class StreamableModel(PythonModel):
    def __init__(self):
        pass

    def predict(self, context, model_input, params=None):
        pass

    def predict_stream(self, context, model_input, params=None):
        yield "test1"
        yield "test2"


set_model(StreamableModel())
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/tests/pyfunc/sample_code/utils.py

```python
def my_function(input):
    return f"My utils function received this input: {input}"
```

--------------------------------------------------------------------------------

````
