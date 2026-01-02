---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 894
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 894 of 991)

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

---[FILE: pyproject.toml]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/pyproject.toml

```toml
[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"

[project]
name = "mlflow-test-plugin"
version = "0.0.1"
description = "Test plugin for MLflow"
requires-python = ">=3.10"
# `dependencies` is commented out to avoid overriding editable installs during development.
# Uncomment it if you need MLflow to be automatically installed with this plugin.
# dependencies = ["mlflow"]

[tool.setuptools.packages.find]
where = ["."]
include = ["mlflow_test_plugin", "mlflow_test_plugin.*"]

# Define a Tracking Store plugin for tracking URIs with scheme 'file-plugin'
[project.entry-points."mlflow.tracking_store"]
file-plugin = "mlflow_test_plugin.file_store:PluginFileStore"

# Define a ArtifactRepository plugin for artifact URIs with scheme 'file-plugin'
[project.entry-points."mlflow.artifact_repository"]
file-plugin = "mlflow_test_plugin.local_artifact:PluginLocalArtifactRepository"

# Define a RunContextProvider plugin. The entry point name for run context providers
# is not used, and so is set to the string "unused" here
[project.entry-points."mlflow.run_context_provider"]
unused = "mlflow_test_plugin.run_context_provider:PluginRunContextProvider"

# Define a DefaultExperimentProvider plugin. The entry point name for
# default experiment providers is not used, and so is set to the string "unused" here
[project.entry-points."mlflow.default_experiment_provider"]
unused = "mlflow_test_plugin.default_experiment_provider:PluginDefaultExperimentProvider"

# Define a RequestHeaderProvider plugin. The entry point name for request header providers
# is not used, and so is set to the string "unused" here
[project.entry-points."mlflow.request_header_provider"]
unused = "mlflow_test_plugin.request_header_provider:PluginRequestHeaderProvider"

# Define a RequestAuthProvider plugin. The entry point name for request auth providers
# is not used, and so is set to the string "unused" here
[project.entry-points."mlflow.request_auth_provider"]
unused = "mlflow_test_plugin.request_auth_provider:PluginRequestAuthProvider"

# Define a Model Registry Store plugin for tracking URIs with scheme 'file-plugin'
[project.entry-points."mlflow.model_registry_store"]
file-plugin = "mlflow_test_plugin.sqlalchemy_store:PluginRegistrySqlAlchemyStore"

# Define a MLflow Project Backend plugin called 'dummy-backend'
[project.entry-points."mlflow.project_backend"]
dummy-backend = "mlflow_test_plugin.dummy_backend:PluginDummyProjectBackend"

# Define a MLflow model deployment plugin for target 'faketarget'
[project.entry-points."mlflow.deployments"]
faketarget = "mlflow_test_plugin.fake_deployment_plugin"

# Define a MLflow model evaluator with name "dummy_evaluator"
[project.entry-points."mlflow.model_evaluator"]
dummy_evaluator = "mlflow_test_plugin.dummy_evaluator:DummyEvaluator"

# Define a custom MLflow application with name custom_app
[project.entry-points."mlflow.app"]
custom_app = "mlflow_test_plugin.app:custom_app"

# Define an MLflow dataset source called "dummy_source"
[project.entry-points."mlflow.dataset_source"]
dummy_source = "mlflow_test_plugin.dummy_dataset_source:DummyDatasetSource"

# Define an MLflow dataset constructor called "from_dummy"
[project.entry-points."mlflow.dataset_constructor"]
from_dummy = "mlflow_test_plugin.dummy_dataset:from_dummy"
```

--------------------------------------------------------------------------------

---[FILE: app.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/app.py

```python
"""
To run a tracking server with this app, use `mlflow server --app-name custom_app`.
"""

import logging

# This would be all that plugin author is required to import
from mlflow.server import app as custom_app

# Can do custom logging on either the app or logging itself
# but you'll possibly have to clear the existing handlers or there will be duplicate output
# See https://docs.python.org/3/howto/logging-cookbook.html

app_logger = logging.getLogger(__name__)

# Configure the app
custom_app.config["MY_VAR"] = "config-var"
app_logger.warning(f"Using {__name__}")


def is_logged_in():
    return True


@custom_app.before_request
def before_req_hook():
    """A custom before request handler.

    Can implement things such as authentication, special handling, etc.
    """
    if not is_logged_in():
        app_logger.warning("Hello from before request!")
        return "Unauthorized", 403


@custom_app.route("/custom/endpoint", methods=["GET"])
def custom_endpoint():
    """A custom endpoint."""
    return "custom_endpoint", 200
```

--------------------------------------------------------------------------------

---[FILE: default_experiment_provider.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/default_experiment_provider.py

```python
from mlflow.tracking.default_experiment.abstract_context import DefaultExperimentProvider


class PluginDefaultExperimentProvider(DefaultExperimentProvider):
    """DefaultExperimentProvider provided through plugin system"""

    def in_context(self):
        return False

    def get_experiment_id(self):
        return "experiment_id_1"
```

--------------------------------------------------------------------------------

---[FILE: dummy_backend.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/dummy_backend.py

```python
from mlflow.entities import RunStatus
from mlflow.projects.backend.abstract_backend import AbstractBackend
from mlflow.projects.submitted_run import SubmittedRun
from mlflow.projects.utils import fetch_and_validate_project, get_or_create_run


class DummySubmittedRun(SubmittedRun):
    """
    A run that just does nothing
    """

    def __init__(self, run_id):
        self._run_id = run_id

    def wait(self):
        return True

    def get_status(self):
        return RunStatus.FINISHED

    def cancel(self):
        pass

    @property
    def run_id(self):
        return self._run_id


class PluginDummyProjectBackend(AbstractBackend):
    def run(
        self,
        project_uri,
        entry_point,
        params,
        version,
        backend_config,
        tracking_uri,
        experiment_id,
    ):
        work_dir = fetch_and_validate_project(project_uri, version, entry_point, params)
        active_run = get_or_create_run(
            None, project_uri, experiment_id, work_dir, version, entry_point, params
        )
        return DummySubmittedRun(active_run.info.run_id)
```

--------------------------------------------------------------------------------

---[FILE: dummy_dataset.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/dummy_dataset.py

```python
import json
from typing import Any

import numpy as np
import pandas as pd

from mlflow.data.dataset import Dataset
from mlflow.types import Schema
from mlflow.types.utils import _infer_schema
from mlflow_test_plugin.dummy_dataset_source import DummyDatasetSource


class DummyDataset(Dataset):
    def __init__(
        self,
        data_list: list[int],
        source: DummyDatasetSource,
        name: str | None = None,
        digest: str | None = None,
    ):
        self._data_list = data_list
        super().__init__(source=source, name=name, digest=digest)

    def _compute_digest(self) -> str:
        """
        Computes a digest for the dataset. Called if the user doesn't supply
        a digest when constructing the dataset.
        """
        return pd.util.hash_array(np.ndarray(self._data_list))

    def _to_dict(self, base_dict: dict[str, str]) -> dict[str, str]:
        """
        Args:
            base_dict: A string dictionary of base information about the
                dataset, including: name, digest, source, and source type.

        Returns:
            A string dictionary containing the following fields: name,
            digest, source, source type, schema (optional), profile
            (optional).
        """
        return {
            **base_dict,
            "schema": json.dumps({"mlflow_colspec": self.schema.to_dict()}),
            "profile": json.dumps(self.profile),
        }

    @property
    def data_list(self) -> list[int]:
        return self._data_list

    @property
    def source(self) -> DummyDatasetSource:
        return self._source

    @property
    def profile(self) -> Any | None:
        return {
            "length": len(self._data_list),
        }

    @property
    def schema(self) -> Schema:
        return _infer_schema(self._data_list)


def from_dummy(
    data_list: list[int], source: str, name: str | None = None, digest: str | None = None
) -> DummyDataset:
    from mlflow.data.dataset_source_registry import resolve_dataset_source

    resolved_source: DummyDatasetSource = resolve_dataset_source(
        source, candidate_sources=[DummyDatasetSource]
    )
    return DummyDataset(data_list=data_list, source=resolved_source, name=name, digest=digest)
```

--------------------------------------------------------------------------------

---[FILE: dummy_dataset_source.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/dummy_dataset_source.py

```python
from typing import Any
from urllib.parse import urlparse

from mlflow.data.dataset_source import DatasetSource
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE


class DummyDatasetSource(DatasetSource):
    def __init__(self, uri):
        self._uri = uri

    @property
    def uri(self):
        return self._uri

    @staticmethod
    def _get_source_type() -> str:
        return "dummy"

    def load(self) -> str:
        # Ignore the "dummy" URI scheme and download the local path
        from mlflow.artifacts import download_artifacts

        parsed_uri = urlparse(self._uri)
        return download_artifacts(parsed_uri.path)

    @staticmethod
    def _can_resolve(raw_source: Any) -> bool:
        if not isinstance(raw_source, str):
            return False

        try:
            parsed_source = urlparse(raw_source)
            return parsed_source.scheme == "dummy"
        except Exception:
            return False

    @classmethod
    def _resolve(cls, raw_source: Any) -> DatasetSource:
        return cls(raw_source)

    def _to_dict(self) -> dict[Any, Any]:
        return {"uri": self.uri}

    @classmethod
    def _from_dict(cls, source_dict: dict[Any, Any]) -> DatasetSource:
        uri = source_dict.get("uri")
        if uri is None:
            raise MlflowException(
                'Failed to parse dummy dataset source. Missing expected key: "uri"',
                INVALID_PARAMETER_VALUE,
            )

        return cls(uri=uri)
```

--------------------------------------------------------------------------------

---[FILE: dummy_evaluator.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/dummy_evaluator.py

```python
import io
import os
import tempfile

import pandas as pd
from PIL import Image
from sklearn import metrics as sk_metrics

from mlflow import MlflowClient
from mlflow.entities import Metric
from mlflow.models.evaluation import (
    EvaluationArtifact,
    EvaluationResult,
    ModelEvaluator,
)
from mlflow.models.evaluation.artifacts import ImageEvaluationArtifact
from mlflow.tracking.artifact_utils import get_artifact_uri
from mlflow.utils.time import get_current_time_millis


class Array2DEvaluationArtifact(EvaluationArtifact):
    def _save(self, output_artifact_path):
        pd.DataFrame(self._content).to_csv(output_artifact_path, index=False)

    def _load_content_from_file(self, local_artifact_path):
        pdf = pd.read_csv(local_artifact_path)
        return pdf.to_numpy()


class DummyEvaluator(ModelEvaluator):
    @classmethod
    def can_evaluate(cls, *, model_type, evaluator_config, **kwargs):
        return model_type in ["classifier", "regressor"]

    def _log_metrics(self, run_id, metrics):
        """
        Helper method to log metrics into specified run.
        """
        client = MlflowClient()
        timestamp = get_current_time_millis()
        client.log_batch(
            run_id,
            metrics=[
                Metric(key=key, value=value, timestamp=timestamp, step=0)
                for key, value in metrics.items()
            ],
        )

    def _evaluate(self, y_pred):
        if self.model_type == "classifier":
            accuracy_score = sk_metrics.accuracy_score(self.y, y_pred)

            metrics = {"accuracy_score": accuracy_score}
            artifacts = {}
            self._log_metrics(self.run_id, metrics)
            confusion_matrix = sk_metrics.confusion_matrix(self.y, y_pred)
            confusion_matrix_artifact_name = "confusion_matrix"
            confusion_matrix_artifact = Array2DEvaluationArtifact(
                uri=get_artifact_uri(self.run_id, confusion_matrix_artifact_name + ".csv"),
                content=confusion_matrix,
            )
            confusion_matrix_csv_buff = io.StringIO()
            confusion_matrix_artifact._save(confusion_matrix_csv_buff)
            self.client.log_text(
                self.run_id,
                confusion_matrix_csv_buff.getvalue(),
                confusion_matrix_artifact_name + ".csv",
            )

            confusion_matrix_figure = sk_metrics.ConfusionMatrixDisplay.from_predictions(
                self.y, y_pred
            ).figure_
            img_buf = io.BytesIO()
            confusion_matrix_figure.savefig(img_buf)
            img_buf.seek(0)
            confusion_matrix_image = Image.open(img_buf)

            confusion_matrix_image_artifact_name = "confusion_matrix_image"
            confusion_matrix_image_artifact = ImageEvaluationArtifact(
                uri=get_artifact_uri(self.run_id, confusion_matrix_image_artifact_name + ".png"),
                content=confusion_matrix_image,
            )
            with tempfile.TemporaryDirectory() as tmpdir:
                path = os.path.join(tmpdir, confusion_matrix_image_artifact_name + ".png")
                confusion_matrix_image_artifact._save(path)
                self.client.log_image(
                    self.run_id,
                    confusion_matrix_image,
                    confusion_matrix_image_artifact_name + ".png",
                )

            artifacts = {
                confusion_matrix_artifact_name: confusion_matrix_artifact,
                confusion_matrix_image_artifact_name: confusion_matrix_image_artifact,
            }
        elif self.model_type == "regressor":
            mean_absolute_error = sk_metrics.mean_absolute_error(self.y, y_pred)
            mean_squared_error = sk_metrics.mean_squared_error(self.y, y_pred)
            metrics = {
                "mean_absolute_error": mean_absolute_error,
                "mean_squared_error": mean_squared_error,
            }
            self._log_metrics(self.run_id, metrics)
            artifacts = {}
        else:
            raise ValueError(f"Unsupported model type {self.model_type}")

        return EvaluationResult(metrics=metrics, artifacts=artifacts)

    def evaluate(self, *, model, model_type, dataset, run_id, evaluator_config, **kwargs):
        self.model_type = model_type
        self.client = MlflowClient()
        self.dataset = dataset
        self.run_id = run_id
        self.X = dataset.features_data
        self.y = dataset.labels_data
        y_pred = model.predict(self.X) if model is not None else self.dataset.predictions_data
        return self._evaluate(y_pred)
```

--------------------------------------------------------------------------------

---[FILE: fake_deployment_plugin.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/fake_deployment_plugin.py

```python
import os

from mlflow.deployments import BaseDeploymentClient, PredictionsResponse

f_deployment_name = "fake_deployment_name"
f_endpoint_name = "fake_endpoint_name"


class PluginDeploymentClient(BaseDeploymentClient):
    def create_deployment(self, name, model_uri, flavor=None, config=None, endpoint=None):
        if config and config.get("raiseError") == "True":
            raise RuntimeError("Error requested")
        return {"name": f_deployment_name, "flavor": flavor}

    def delete_deployment(self, name, config=None, endpoint=None):
        if config and config.get("raiseError") == "True":
            raise RuntimeError("Error requested")
        return None

    def update_deployment(self, name, model_uri=None, flavor=None, config=None, endpoint=None):
        return {"flavor": flavor}

    def list_deployments(self, endpoint=None):
        if os.environ.get("raiseError") == "True":
            raise RuntimeError("Error requested")
        return [{"name": f_deployment_name}]

    def get_deployment(self, name, endpoint=None):
        return {"key1": "val1", "key2": "val2"}

    def predict(self, deployment_name=None, inputs=None, endpoint=None):
        return PredictionsResponse.from_json('{"predictions": [1,2,3]}')

    def explain(self, deployment_name=None, df=None, endpoint=None):
        return "1"

    def create_endpoint(self, name, config=None):
        if config and config.get("raiseError") == "True":
            raise RuntimeError("Error requested")
        return {"name": f_endpoint_name}

    def update_endpoint(self, endpoint, config=None):
        return None

    def delete_endpoint(self, endpoint):
        return None

    def list_endpoints(self):
        return [{"name": f_endpoint_name}]

    def get_endpoint(self, endpoint):
        return {"name": f_endpoint_name}


def run_local(name, model_uri, flavor=None, config=None):
    print(  # noqa: T201
        f"Deployed locally at the key {name} using the model from {model_uri}. "
        f"It's flavor is {flavor} and config is {config}"
    )


def target_help():
    return "Target help is called"
```

--------------------------------------------------------------------------------

---[FILE: file_store.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/file_store.py

```python
import urllib.parse

from mlflow.store.tracking.file_store import FileStore


class PluginFileStore(FileStore):
    """FileStore provided through entrypoints system"""

    def __init__(self, store_uri=None, artifact_uri=None):
        path = urllib.parse.urlparse(store_uri).path if store_uri else None
        self.is_plugin = True
        super().__init__(path, artifact_uri)
```

--------------------------------------------------------------------------------

---[FILE: local_artifact.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/local_artifact.py

```python
from mlflow.store.artifact.local_artifact_repo import LocalArtifactRepository


class PluginLocalArtifactRepository(LocalArtifactRepository):
    """LocalArtifactRepository provided through plugin system"""

    is_plugin = True
```

--------------------------------------------------------------------------------

---[FILE: request_auth_provider.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/request_auth_provider.py

```python
from mlflow.tracking.request_auth.abstract_request_auth_provider import RequestAuthProvider


class PluginRequestAuthProvider(RequestAuthProvider):
    """RequestAuthProvider provided through plugin system"""

    def get_name(self):
        return "test_auth_provider_name"

    def get_auth(self):
        return {"auth_name": "test_auth_provider_name"}
```

--------------------------------------------------------------------------------

---[FILE: request_header_provider.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/request_header_provider.py

```python
from mlflow.tracking.request_header.abstract_request_header_provider import RequestHeaderProvider


class PluginRequestHeaderProvider(RequestHeaderProvider):
    """RequestHeaderProvider provided through plugin system"""

    def in_context(self):
        return False

    def request_headers(self):
        return {"test": "header"}
```

--------------------------------------------------------------------------------

---[FILE: run_context_provider.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/run_context_provider.py

```python
from mlflow.tracking.context.abstract_context import RunContextProvider


class PluginRunContextProvider(RunContextProvider):
    """RunContextProvider provided through plugin system"""

    def in_context(self):
        return False

    def tags(self):
        return {"test": "tag"}
```

--------------------------------------------------------------------------------

---[FILE: sqlalchemy_store.py]---
Location: mlflow-master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/sqlalchemy_store.py

```python
import urllib.parse

from mlflow.store.model_registry.sqlalchemy_store import SqlAlchemyStore


class PluginRegistrySqlAlchemyStore(SqlAlchemyStore):
    def __init__(self, store_uri=None):
        path = urllib.parse.urlparse(store_uri).path if store_uri else None
        self.is_plugin = True
        super().__init__(path)
```

--------------------------------------------------------------------------------

---[FILE: generate_onnx_models.py]---
Location: mlflow-master/tests/resources/onnx/generate_onnx_models.py

```python
"""
Generates the following test resources:

    - tf_model_multiple_inputs_float32.onnx
    - tf_model_multiple_inputs_float64.onnx
    - sklearn_model.onnx

Usage: python generate_onnx_models.py
"""

import numpy as np
import onnx
import onnxmltools
import pandas as pd
import tensorflow.compat.v1 as tf
import tf2onnx
from skl2onnx.common.data_types import FloatTensorType
from sklearn import datasets
from sklearn.linear_model import LogisticRegression

tf.disable_v2_behavior()


def generate_tf_onnx_model_multiple_inputs_float64():
    graph = tf.Graph()
    with graph.as_default():
        t_in1 = tf.placeholder(tf.float64, 10, name="first_input")
        t_in2 = tf.placeholder(tf.float64, 10, name="second_input")
        t_out = tf.multiply(t_in1, t_in2)
        tf.identity(t_out, name="output")

    sess = tf.Session(graph=graph)

    onnx_graph = tf2onnx.tfonnx.process_tf_graph(
        sess.graph, input_names=["first_input:0", "second_input:0"], output_names=["output:0"]
    )
    model_proto = onnx_graph.make_model("test")

    onnx.save_model(model_proto, "tf_model_multiple_inputs_float64.onnx")


def generate_tf_onnx_model_multiple_inputs_float32():
    graph = tf.Graph()
    with graph.as_default():
        t_in1 = tf.placeholder(tf.float32, 10, name="first_input")
        t_in2 = tf.placeholder(tf.float32, 10, name="second_input")
        t_out = tf.multiply(t_in1, t_in2)
        tf.identity(t_out, name="output")

    sess = tf.Session(graph=graph)

    onnx_graph = tf2onnx.tfonnx.process_tf_graph(
        sess.graph, input_names=["first_input:0", "second_input:0"], output_names=["output:0"]
    )
    model_proto = onnx_graph.make_model("test")

    onnx.save_model(model_proto, "tf_model_multiple_inputs_float32.onnx")


def generate_sklearn_onnx_model():
    iris = datasets.load_iris()
    data = pd.DataFrame(
        data=np.c_[iris["data"], iris["target"]], columns=iris["feature_names"] + ["target"]
    )
    y = data["target"]
    x = data.drop("target", axis=1)

    model = LogisticRegression()
    model.fit(x, y)

    initial_type = [("float_input", FloatTensorType([None, 4]))]
    onx = onnxmltools.convert_sklearn(model, initial_types=initial_type)
    onnx.save_model(onx, "sklearn_model.onnx")


generate_tf_onnx_model_multiple_inputs_float32()
generate_tf_onnx_model_multiple_inputs_float64()
generate_sklearn_onnx_model()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/tests/resources/pyfunc_models/README.md

```text
# Historical Pyfunc Models

These serialized model files are used in backwards compatibility tests, so we can ensure that models logged with old versions of MLflow are still able to be loaded in newer versions.

These files were created by running the following:

1. First, install the desired MLflow version with `$ pip install mlflow=={version_number}`
2. Next, run the following script from MLflow root:

```python
import mlflow


class MyModel(mlflow.pyfunc.PythonModel):
    def predict(self, context, model_input):
        return model_input


model = MyModel()

mlflow.pyfunc.save_model(
    python_model=model,
    path=f"tests/resources/pyfunc_models/{mlflow.__version__}",
)
```
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/tests/resources/pyfunc_models/2.7.1/conda.yaml

```yaml
channels:
  - conda-forge
dependencies:
  - python=3.9.13
  - pip<=23.3
  - pip:
      - mlflow==2.7.1
      - cloudpickle==2.2.1
name: mlflow-env
```

--------------------------------------------------------------------------------

---[FILE: MLmodel]---
Location: mlflow-master/tests/resources/pyfunc_models/2.7.1/MLmodel

```text
flavors:
  python_function:
    cloudpickle_version: 2.2.1
    env:
      conda: conda.yaml
      virtualenv: python_env.yaml
    loader_module: mlflow.pyfunc.model
    python_model: python_model.pkl
    python_version: 3.9.13
mlflow_version: 2.7.1
model_uuid: 1f82a364e20f4061984040cf41c3052e
utc_time_created: '2023-12-07 02:45:13.335946'
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/tests/resources/pyfunc_models/2.7.1/python_env.yaml

```yaml
python: 3.9.13
build_dependencies:
  - pip==23.3
  - setuptools
  - wheel==0.41.2
dependencies:
  - -r requirements.txt
```

--------------------------------------------------------------------------------

---[FILE: requirements.txt]---
Location: mlflow-master/tests/resources/pyfunc_models/2.7.1/requirements.txt

```text
mlflow==2.7.1
cloudpickle==2.2.1
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/tests/resources/pyfunc_models/2.8.1/conda.yaml

```yaml
channels:
  - conda-forge
dependencies:
  - python=3.9.13
  - pip<=23.3
  - pip:
      - mlflow==2.8.1
      - cloudpickle==2.2.1
name: mlflow-env
```

--------------------------------------------------------------------------------

---[FILE: MLmodel]---
Location: mlflow-master/tests/resources/pyfunc_models/2.8.1/MLmodel

```text
flavors:
  python_function:
    cloudpickle_version: 2.2.1
    env:
      conda: conda.yaml
      virtualenv: python_env.yaml
    loader_module: mlflow.pyfunc.model
    python_model: python_model.pkl
    python_version: 3.9.13
mlflow_version: 2.8.1
model_size_bytes: 737
model_uuid: a369e776349942f4b3040003169aa534
utc_time_created: '2023-12-07 02:46:07.555576'
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/tests/resources/pyfunc_models/2.8.1/python_env.yaml

```yaml
python: 3.9.13
build_dependencies:
  - pip==23.3
  - setuptools
  - wheel==0.41.2
dependencies:
  - -r requirements.txt
```

--------------------------------------------------------------------------------

---[FILE: requirements.txt]---
Location: mlflow-master/tests/resources/pyfunc_models/2.8.1/requirements.txt

```text
mlflow==2.8.1
cloudpickle==2.2.1
```

--------------------------------------------------------------------------------

````
