---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 760
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 760 of 991)

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

---[FILE: test_exceptions.py]---
Location: mlflow-master/tests/test_exceptions.py

```python
import json
import pickle

from mlflow.exceptions import MlflowException, RestException
from mlflow.protos.databricks_pb2 import (
    ENDPOINT_NOT_FOUND,
    INTERNAL_ERROR,
    INVALID_PARAMETER_VALUE,
    INVALID_STATE,
    IO_ERROR,
    RESOURCE_ALREADY_EXISTS,
)


def test_error_code_constructor():
    assert (
        MlflowException("test", error_code=INVALID_PARAMETER_VALUE).error_code
        == "INVALID_PARAMETER_VALUE"
    )


def test_default_error_code():
    assert MlflowException("test").error_code == "INTERNAL_ERROR"


def test_serialize_to_json():
    mlflow_exception = MlflowException("test")
    deserialized = json.loads(mlflow_exception.serialize_as_json())
    assert deserialized["message"] == "test"
    assert deserialized["error_code"] == "INTERNAL_ERROR"


def test_get_http_status_code():
    assert MlflowException("test default").get_http_status_code() == 500
    assert MlflowException("code not in map", error_code=IO_ERROR).get_http_status_code() == 500
    assert MlflowException("test", error_code=INVALID_STATE).get_http_status_code() == 500
    assert MlflowException("test", error_code=ENDPOINT_NOT_FOUND).get_http_status_code() == 404
    assert MlflowException("test", error_code=INVALID_PARAMETER_VALUE).get_http_status_code() == 400
    assert MlflowException("test", error_code=INTERNAL_ERROR).get_http_status_code() == 500
    assert MlflowException("test", error_code=RESOURCE_ALREADY_EXISTS).get_http_status_code() == 400


def test_invalid_parameter_value():
    mlflow_exception = MlflowException.invalid_parameter_value("test")
    assert mlflow_exception.error_code == "INVALID_PARAMETER_VALUE"


def test_rest_exception():
    mlflow_exception = MlflowException("test", error_code=RESOURCE_ALREADY_EXISTS)
    json_exception = mlflow_exception.serialize_as_json()
    deserialized_rest_exception = RestException(json.loads(json_exception))
    assert deserialized_rest_exception.error_code == "RESOURCE_ALREADY_EXISTS"
    assert "test" in deserialized_rest_exception.message


def test_rest_exception_with_unrecognized_error_code():
    # Test that we can create a RestException with a convertible error code.
    exception = RestException({"error_code": "403", "messages": "something important."})
    assert "something important." in str(exception)
    assert exception.error_code == "PERMISSION_DENIED"
    json.loads(exception.serialize_as_json())

    # Test that we can create a RestException with an unrecognized error code.
    exception = RestException({"error_code": "weird error", "messages": "something important."})
    assert "something important." in str(exception)
    json.loads(exception.serialize_as_json())


def test_rest_exception_pickleable():
    e1 = RestException({"error_code": "INTERNAL_ERROR", "message": "abc"})
    e2 = pickle.loads(pickle.dumps(e1))

    assert e1.error_code == e2.error_code
    assert e1.message == e2.message
```

--------------------------------------------------------------------------------

---[FILE: test_flavors.py]---
Location: mlflow-master/tests/test_flavors.py

```python
import ast
import os

import mlflow


def read_file(path):
    with open(path) as f:
        return f.read()


def is_model_flavor(src):
    for node in ast.iter_child_nodes(ast.parse(src)):
        if (
            isinstance(node, ast.Assign)
            and isinstance(node.targets[0], ast.Name)
            and node.targets[0].id == "FLAVOR_NAME"
        ):
            return True
    return False


def iter_flavor_names():
    for root, _, files in os.walk("mlflow"):
        for f in files:
            if f != "__init__.py":
                continue

            path = os.path.join(root, f)
            src = read_file(path)
            if is_model_flavor(src):
                basename = os.path.basename(root)
                yield os.path.splitext(basename)[0]


def test_all_flavors_can_be_accessed_from_mlflow():
    flavor_names = list(iter_flavor_names())
    assert len(flavor_names) != 0
    for flavor_name in flavor_names:
        assert hasattr(mlflow, flavor_name)
```

--------------------------------------------------------------------------------

---[FILE: test_import.py]---
Location: mlflow-master/tests/test_import.py

```python
import subprocess
import sys
from pathlib import Path

import pytest

from mlflow.utils.os import is_windows


@pytest.mark.skipif(is_windows(), reason="This test fails on Windows")
def test_import_mlflow(tmp_path: Path):
    tmp_script = tmp_path.joinpath("test.py")
    tmp_script.write_text(
        """
from pathlib import Path

import mlflow

# Ensure importing mlflow does not create an mlruns directory
assert not Path("mlruns").exists()
"""
    )
    python_ver = ".".join(map(str, sys.version_info[:2]))
    repo_root = Path(__file__).resolve().parent.parent
    subprocess.check_call(
        [
            "uv",
            "run",
            f"--with={repo_root}",
            f"--directory={tmp_path}",
            f"--python={python_ver}",
            "python",
            tmp_script.name,
        ],
    )
```

--------------------------------------------------------------------------------

---[FILE: test_mismatch.py]---
Location: mlflow-master/tests/test_mismatch.py

```python
import warnings
from importlib.metadata import PackageNotFoundError
from unittest import mock

import pytest

from mlflow.mismatch import _check_version_mismatch


@pytest.mark.parametrize(
    ("mlflow_version", "skinny_version"),
    [
        ("1.0.0", "1.0.0"),
        ("1.0.0.dev0", "1.0.0"),
        ("1.0.0", "1.0.0.dev0"),
        ("1.0.0.dev0", "1.0.0.dev0"),
        ("1.0.0", None),
        (None, "1.0.0"),
        (None, None),
    ],
)
@pytest.mark.parametrize(
    "tracing_version",
    [None, "1.0.0", "1.0.0.dev0"],
)
def test_check_version_mismatch_no_warn(
    mlflow_version: str | None, skinny_version: str | None, tracing_version: str | None
):
    def mock_version(package_name: str) -> str:
        if package_name == "mlflow":
            if mlflow_version is None:
                raise PackageNotFoundError
            return mlflow_version
        elif package_name == "mlflow-skinny":
            if skinny_version is None:
                raise PackageNotFoundError
            return skinny_version
        elif package_name == "mlflow-tracing":
            if tracing_version is None:
                raise PackageNotFoundError
            return tracing_version
        raise ValueError(f"Unexpected package: {package_name}")

    with mock.patch("importlib.metadata.version", side_effect=mock_version) as mv:
        with warnings.catch_warnings():
            warnings.simplefilter("error")
            _check_version_mismatch()

        mv.assert_called()


@pytest.mark.parametrize(
    ("mlflow_version", "skinny_version", "tracing_version", "expected"),
    [
        ("1.0.0", "1.0.1", "1.0.0", r"mlflow-skinny \(1.0.1\)"),
        ("1.0.0", "1.0.0", "1.0.1", r"mlflow-tracing \(1.0.1\)"),
        ("1.0.1", "1.0.0", "1.0.0", r"mlflow-skinny \(1.0.0\), mlflow-tracing \(1.0.0\)"),
    ],
)
def test_check_version_mismatch_warn(
    mlflow_version: str,
    skinny_version: str,
    tracing_version: str,
    expected: str,
):
    def mock_version(package_name: str) -> str:
        if package_name == "mlflow":
            return mlflow_version
        elif package_name == "mlflow-skinny":
            return skinny_version
        elif package_name == "mlflow-tracing":
            if tracing_version is None:
                raise PackageNotFoundError
            return tracing_version
        raise ValueError(f"Unexpected package: {package_name}")

    with mock.patch("importlib.metadata.version", side_effect=mock_version) as mv:
        with pytest.warns(
            UserWarning,
            match=rf"Versions of mlflow \([.\w]+\) and child packages {expected} are different",
        ):
            _check_version_mismatch()

        mv.assert_called()
```

--------------------------------------------------------------------------------

---[FILE: test_mlflow_version_comp.py]---
Location: mlflow-master/tests/test_mlflow_version_comp.py

```python
import os
import subprocess
import sys
import uuid
from pathlib import Path

import numpy as np
import sklearn
from pyspark.sql import SparkSession
from sklearn.linear_model import LinearRegression

import mlflow
from mlflow.models import Model


def check_load(model_uri: str) -> None:
    Model.load(model_uri)
    model = mlflow.sklearn.load_model(model_uri)
    np.testing.assert_array_equal(model.predict([[1, 2]]), [3.0])
    model = mlflow.pyfunc.load_model(model_uri)
    np.testing.assert_array_equal(model.predict([[1, 2]]), [3.0])


def check_register(model_uri: str) -> None:
    mv = mlflow.register_model(model_uri, "model")
    model = mlflow.pyfunc.load_model(f"models:/{mv.name}/{mv.version}")
    np.testing.assert_array_equal(model.predict([[1, 2]]), [3.0])


def check_list_artifacts_with_run_id_and_path(run_id: str, path: str) -> None:
    # List artifacts
    client = mlflow.MlflowClient()
    artifacts = [a.path for a in client.list_artifacts(run_id=run_id, path=path)]
    # Ensure both run and model artifacts are listed
    assert "model/MLmodel" in artifacts
    assert "model/test.txt" in artifacts
    artifacts = [a.path for a in client.list_artifacts(run_id=run_id, path=path)]
    assert "model/MLmodel" in artifacts
    assert "model/test.txt" in artifacts
    # Non-existing artifact path should return an empty list
    assert len(client.list_artifacts(run_id=run_id, path="unknown")) == 0
    assert len(mlflow.artifacts.list_artifacts(run_id=run_id, artifact_path="unknown")) == 0


def check_list_artifacts_with_model_uri(model_uri: str) -> None:
    artifacts = [a.path for a in mlflow.artifacts.list_artifacts(artifact_uri=model_uri)]
    assert "model/MLmodel" in artifacts
    assert "model/test.txt" in artifacts


def check_download_artifacts_with_run_id_and_path(run_id: str, path: str, tmp_path: Path) -> None:
    out_path = mlflow.artifacts.download_artifacts(
        run_id=run_id, artifact_path=path, dst_path=tmp_path / str(uuid.uuid4())
    )
    files = [f.name for f in Path(out_path).iterdir() if f.is_file()]
    assert "MLmodel" in files
    assert "test.txt" in files
    client = mlflow.MlflowClient()
    out_path = client.download_artifacts(
        run_id=run_id, path=path, dst_path=tmp_path / str(uuid.uuid4())
    )
    files = [f.name for f in Path(out_path).iterdir() if f.is_file()]
    assert "MLmodel" in files
    assert "test.txt" in files


def check_download_artifacts_with_model_uri(model_uri: str, tmp_path: Path) -> None:
    out_path = mlflow.artifacts.download_artifacts(
        artifact_uri=model_uri, dst_path=tmp_path / str(uuid.uuid4())
    )
    files = [f.name for f in Path(out_path).iterdir() if f.is_file()]
    # Ensure both run and model artifacts are downloaded
    assert "MLmodel" in files
    assert "test.txt" in files


def check_evaluate(model_uri: str) -> None:
    # Model evaluation
    eval_res = mlflow.models.evaluate(
        model=model_uri,
        data=np.array([[1, 2]]),
        targets=np.array([3]),
        model_type="regressor",
    )
    assert "mean_squared_error" in eval_res.metrics


def check_spark_udf(model_uri: str) -> None:
    # Spark UDF
    if os.name != "nt":
        with SparkSession.builder.getOrCreate() as spark:
            udf = mlflow.pyfunc.spark_udf(
                spark,
                model_uri,
                result_type="double",
                env_manager="local",
            )
            df = spark.createDataFrame([[1, 2]], ["col1", "col2"])
            # This line fails with the following error on Windows:
            #   File ".../pyspark\python\lib\pyspark.zip\pyspark\serializers.py", line 472, in loads
            #     return cloudpickle.loads(obj, encoding=encoding)
            # ModuleNotFoundError: No module named 'pandas'
            pred = df.select(udf("col1", "col2").alias("pred")).collect()
            assert [row.pred for row in pred] == [3.0]


def test_mlflow_2_x_comp(tmp_path: Path) -> None:
    tracking_uri = (tmp_path / "tracking").as_uri()
    mlflow.set_tracking_uri(tracking_uri)
    artifact_location = (tmp_path / "artifacts").as_uri()
    exp_id = mlflow.create_experiment("test", artifact_location=artifact_location)
    mlflow.set_experiment(experiment_id=exp_id)

    out_file = tmp_path / "out.txt"
    # Log a model using MLflow 2.x
    py_ver = ".".join(map(str, sys.version_info[:2]))
    subprocess.check_call(
        [
            "uv",
            "run",
            "--isolated",
            "--no-project",
            "--index-strategy=unsafe-first-match",
            f"--python={py_ver}",
            # Use mlflow 2.x
            "--with=mlflow<3.0",
            # Pin numpy and sklearn versions to ensure the model can be loaded
            f"--with=numpy=={np.__version__}",
            f"--with=scikit-learn=={sklearn.__version__}",
            "python",
            # Use the isolated mode to ignore mlflow in the repository
            "-I",
            "-c",
            """
import sys
import mlflow
from sklearn.linear_model import LinearRegression

assert mlflow.__version__.startswith("2."), mlflow.__version__

fitted_model= LinearRegression().fit([[1, 2]], [3])
with mlflow.start_run() as run:
    mlflow.log_text("test", "model/test.txt")
    model_info = mlflow.sklearn.log_model(fitted_model, artifact_path="model")
    assert model_info.model_uri.startswith("runs:/")
    out = sys.argv[1]
    with open(out, "w") as f:
        f.write(run.info.run_id)
""",
            out_file,
        ],
    )

    run_id = out_file.read_text().strip()
    model_uri = f"runs:/{run_id}/model"
    check_load(model_uri=model_uri)
    check_register(model_uri=model_uri)
    check_list_artifacts_with_run_id_and_path(run_id=run_id, path="model")
    check_list_artifacts_with_model_uri(model_uri=model_uri)
    check_download_artifacts_with_run_id_and_path(run_id=run_id, path="model", tmp_path=tmp_path)
    check_download_artifacts_with_model_uri(model_uri=model_uri, tmp_path=tmp_path)
    check_evaluate(model_uri=model_uri)
    check_spark_udf(model_uri=model_uri)


def test_mlflow_3_x_comp(tmp_path: Path) -> None:
    tracking_uri = (tmp_path / "tracking").as_uri()
    mlflow.set_tracking_uri(tracking_uri)
    artifact_location = (tmp_path / "artifacts").as_uri()
    exp_id = mlflow.create_experiment("test", artifact_location=artifact_location)
    mlflow.set_experiment(experiment_id=exp_id)

    fitted_model = LinearRegression().fit([[1, 2]], [3])
    with mlflow.start_run() as run:
        mlflow.log_text("test", "model/test.txt")
        model_info = mlflow.sklearn.log_model(fitted_model, name="model")

    # Runs URI
    run_id = run.info.run_id
    runs_model_uri = f"runs:/{run_id}/model"
    check_load(model_uri=runs_model_uri)
    check_register(model_uri=runs_model_uri)
    check_list_artifacts_with_run_id_and_path(run_id=run_id, path="model")
    check_list_artifacts_with_model_uri(model_uri=runs_model_uri)
    check_download_artifacts_with_run_id_and_path(run_id=run_id, path="model", tmp_path=tmp_path)
    check_download_artifacts_with_model_uri(model_uri=runs_model_uri, tmp_path=tmp_path)
    check_evaluate(model_uri=runs_model_uri)
    check_spark_udf(model_uri=runs_model_uri)

    # Models URI
    logged_model_uri = f"models:/{model_info.model_id}"
    check_load(model_uri=logged_model_uri)
    check_register(model_uri=logged_model_uri)
    artifacts = [a.path for a in mlflow.artifacts.list_artifacts(artifact_uri=logged_model_uri)]
    assert "MLmodel" in artifacts
    out_path = mlflow.artifacts.download_artifacts(
        artifact_uri=logged_model_uri, dst_path=tmp_path / str(uuid.uuid4())
    )
    files = [f.name for f in Path(out_path).iterdir() if f.is_file()]
    assert "MLmodel" in files
    check_evaluate(model_uri=logged_model_uri)
    check_spark_udf(model_uri=logged_model_uri)


def test_run_and_model_has_artifact_with_same_name(tmp_path: Path) -> None:
    fitted_model = LinearRegression().fit([[1, 2]], [3])
    with mlflow.start_run() as run:
        mlflow.log_text("", artifact_file="model/MLmodel")
        info = mlflow.sklearn.log_model(fitted_model, name="model")

    client = mlflow.MlflowClient()
    artifacts = client.list_artifacts(run_id=run.info.run_id, path="model")
    mlmodel_files = [a.path for a in artifacts if a.path.endswith("MLmodel")]
    # Both run and model artifacts should be listed
    assert len(mlmodel_files) == 2
    out = mlflow.artifacts.download_artifacts(
        run_id=run.info.run_id,
        artifact_path="model",
        dst_path=tmp_path / str(uuid.uuid4()),
    )
    mlmodel_files = list(Path(out).rglob("MLmodel"))
    assert len(mlmodel_files) == 1
    # The model MLmodel file should overwrite the run MLmodel file
    assert info.model_id in mlmodel_files[0].read_text()
```

--------------------------------------------------------------------------------

---[FILE: test_runs.py]---
Location: mlflow-master/tests/test_runs.py
Signals: SQLAlchemy

```python
import json
import logging
import os
import textwrap
from unittest import mock
from unittest.mock import patch

import pytest
from click.testing import CliRunner

import mlflow
from mlflow import experiments
from mlflow.exceptions import MlflowException
from mlflow.runs import create_run, link_traces, list_run


@pytest.fixture(autouse=True)
def suppress_logging():
    """Suppress logging for all tests to ensure clean CLI output."""
    # Suppress all logging
    logging.disable(logging.CRITICAL)

    yield

    # Re-enable logging
    logging.disable(logging.NOTSET)


def test_list_run():
    with mlflow.start_run(run_name="apple"):
        pass
    result = CliRunner().invoke(list_run, ["--experiment-id", "0"])
    assert "apple" in result.output


def test_list_run_experiment_id_required():
    result = CliRunner().invoke(list_run, [])
    assert "Missing option '--experiment-id'" in result.output


@pytest.mark.skipif(
    "MLFLOW_SKINNY" in os.environ,
    reason="Skinny Client does not support predict due to the pandas dependency",
)
def test_csv_generation(tmp_path):
    import numpy as np
    import pandas as pd

    with mock.patch(
        "mlflow.experiments.fluent.search_runs",
        return_value=pd.DataFrame(
            {
                "run_id": np.array(["all_set", "with_none", "with_nan"]),
                "experiment_id": np.array([1, 1, 1]),
                "param_optimizer": np.array(["Adam", None, "Adam"]),
                "avg_loss": np.array([42.0, None, np.nan], dtype=np.float32),
            },
            columns=["run_id", "experiment_id", "param_optimizer", "avg_loss"],
        ),
    ):
        expected_csv = textwrap.dedent(
            """\
        run_id,experiment_id,param_optimizer,avg_loss
        all_set,1,Adam,42.0
        with_none,1,,
        with_nan,1,Adam,
        """
        )
        result_filename = os.path.join(tmp_path, "result.csv")
        CliRunner().invoke(
            experiments.generate_csv_with_runs,
            ["--experiment-id", "1", "--filename", result_filename],
        )
        with open(result_filename) as fd:
            assert expected_csv == fd.read()


def test_create_run_with_experiment_id():
    mlflow.create_experiment("test_create_run_exp")
    exp = mlflow.get_experiment_by_name("test_create_run_exp")

    result = CliRunner().invoke(create_run, ["--experiment-id", exp.experiment_id])
    assert result.exit_code == 0

    output = json.loads(result.output)
    assert "run_id" in output
    assert output["experiment_id"] == exp.experiment_id
    assert output["status"] == "FINISHED"

    # Verify the run was created
    run = mlflow.get_run(output["run_id"])
    assert run.info.experiment_id == exp.experiment_id
    assert run.info.status == "FINISHED"


def test_create_run_with_experiment_name():
    exp_name = "test_create_run_by_name"

    result = CliRunner().invoke(create_run, ["--experiment-name", exp_name])
    assert result.exit_code == 0

    output = json.loads(result.output)
    assert "run_id" in output
    assert output["status"] == "FINISHED"

    # Verify experiment was created
    exp = mlflow.get_experiment_by_name(exp_name)
    assert exp is not None
    assert output["experiment_id"] == exp.experiment_id


def test_create_run_with_custom_name_and_description():
    mlflow.create_experiment("test_run_with_details")
    exp = mlflow.get_experiment_by_name("test_run_with_details")

    run_name = "my-custom-run"
    description = "This is a test run"

    result = CliRunner().invoke(
        create_run,
        [
            "--experiment-id",
            exp.experiment_id,
            "--run-name",
            run_name,
            "--description",
            description,
        ],
    )
    assert result.exit_code == 0

    output = json.loads(result.output)
    assert output["run_name"] == run_name

    # Verify run details
    run = mlflow.get_run(output["run_id"])
    assert run.data.tags.get("mlflow.note.content") == description
    assert run.info.run_name == run_name


def test_create_run_with_tags():
    mlflow.create_experiment("test_run_with_tags")
    exp = mlflow.get_experiment_by_name("test_run_with_tags")

    result = CliRunner().invoke(
        create_run,
        [
            "--experiment-id",
            exp.experiment_id,
            "--tags",
            "env=test",
            "--tags",
            "model=linear",
            "--tags",
            "version=1.0",
        ],
    )
    assert result.exit_code == 0

    output = json.loads(result.output)
    run = mlflow.get_run(output["run_id"])

    assert run.data.tags["env"] == "test"
    assert run.data.tags["model"] == "linear"
    assert run.data.tags["version"] == "1.0"


@pytest.mark.parametrize("status", ["FAILED", "KILLED"])
def test_create_run_with_different_status(status):
    mlflow.create_experiment("test_run_statuses")
    exp = mlflow.get_experiment_by_name("test_run_statuses")

    result = CliRunner().invoke(
        create_run, ["--experiment-id", exp.experiment_id, "--status", status]
    )
    assert result.exit_code == 0
    output = json.loads(result.output)
    assert output["status"] == status

    run = mlflow.get_run(output["run_id"])
    assert run.info.status == status


def test_create_run_missing_experiment():
    result = CliRunner().invoke(create_run, [])
    assert result.exit_code != 0
    assert "Must specify exactly one of --experiment-id or --experiment-name" in result.output


def test_create_run_both_experiment_params():
    result = CliRunner().invoke(create_run, ["--experiment-id", "0", "--experiment-name", "test"])
    assert result.exit_code != 0
    assert "Must specify exactly one of --experiment-id or --experiment-name" in result.output


def test_create_run_invalid_tag_format():
    mlflow.create_experiment("test_invalid_tag")
    exp = mlflow.get_experiment_by_name("test_invalid_tag")

    result = CliRunner().invoke(
        create_run, ["--experiment-id", exp.experiment_id, "--tags", "invalid-tag"]
    )
    assert result.exit_code != 0
    assert "Invalid tag format" in result.output


def test_create_run_duplicate_tag_key():
    mlflow.create_experiment("test_duplicate_tag")
    exp = mlflow.get_experiment_by_name("test_duplicate_tag")

    result = CliRunner().invoke(
        create_run,
        ["--experiment-id", exp.experiment_id, "--tags", "env=test", "--tags", "env=prod"],
    )
    assert result.exit_code != 0
    assert "Duplicate tag key" in result.output


def test_link_traces_single_trace():
    with patch("mlflow.runs.MlflowClient.link_traces_to_run") as mock_link_traces:
        result = CliRunner().invoke(
            link_traces,
            ["--run-id", "test_run_123", "--trace-id", "trace_abc"],
        )

        assert result.exit_code == 0
        assert "Successfully linked 1 trace(s) to run 'test_run_123'" in result.output
        mock_link_traces.assert_called_once_with(["trace_abc"], "test_run_123")


def test_link_traces_multiple_traces():
    with patch("mlflow.runs.MlflowClient.link_traces_to_run") as mock_link_traces:
        result = CliRunner().invoke(
            link_traces,
            [
                "--run-id",
                "test_run_456",
                "--trace-id",
                "trace_1",
                "--trace-id",
                "trace_2",
                "--trace-id",
                "trace_3",
            ],
        )

        assert result.exit_code == 0
        assert "Successfully linked 3 trace(s) to run 'test_run_456'" in result.output
        mock_link_traces.assert_called_once_with(["trace_1", "trace_2", "trace_3"], "test_run_456")


def test_link_traces_with_short_option():
    with patch("mlflow.runs.MlflowClient.link_traces_to_run") as mock_link_traces:
        result = CliRunner().invoke(
            link_traces,
            ["--run-id", "run_789", "-t", "trace_x", "-t", "trace_y"],
        )

        assert result.exit_code == 0
        assert "Successfully linked 2 trace(s) to run 'run_789'" in result.output
        mock_link_traces.assert_called_once_with(["trace_x", "trace_y"], "run_789")


def test_link_traces_file_store_error():
    with patch(
        "mlflow.runs.MlflowClient.link_traces_to_run",
        side_effect=MlflowException(
            "Linking traces to runs is not supported in FileStore. "
            "Please use a database-backed store (e.g., SQLAlchemy store) for this feature."
        ),
    ):
        result = CliRunner().invoke(
            link_traces,
            ["--run-id", "test_run", "--trace-id", "trace_1"],
        )

        assert result.exit_code != 0
        assert "Failed to link traces" in result.output
        assert "not supported in FileStore" in result.output


def test_link_traces_too_many_traces_error():
    with patch(
        "mlflow.runs.MlflowClient.link_traces_to_run",
        side_effect=MlflowException(
            "Cannot link more than 100 traces to a run in a single request. Provided 101 traces."
        ),
    ):
        result = CliRunner().invoke(
            link_traces,
            ["--run-id", "test_run", "--trace-id", "trace_1"],
        )

        assert result.exit_code != 0
        assert "Failed to link traces" in result.output
        assert "100" in result.output


def test_link_traces_missing_run_id():
    result = CliRunner().invoke(link_traces, ["--trace-id", "trace_1"])

    assert result.exit_code != 0
    assert "Missing option '--run-id'" in result.output


def test_link_traces_missing_trace_id():
    result = CliRunner().invoke(link_traces, ["--run-id", "test_run"])

    assert result.exit_code != 0
    assert "Missing option '--trace-id'" in result.output


def test_link_traces_generic_error():
    with patch(
        "mlflow.runs.MlflowClient.link_traces_to_run",
        side_effect=MlflowException("Some other error"),
    ):
        result = CliRunner().invoke(
            link_traces,
            ["--run-id", "test_run", "--trace-id", "trace_1"],
        )

        assert result.exit_code != 0
        assert "Failed to link traces: Some other error" in result.output


def test_get_experiment_default():
    result = CliRunner().invoke(experiments.get_experiment, ["--experiment-id", "0"])
    assert result.exit_code == 0

    # Default output is table format
    assert "Experiment ID" in result.output
    assert "Name" in result.output
    assert "Artifact Location" in result.output
    assert "Lifecycle Stage" in result.output
    assert ":" in result.output


def test_get_experiment_json():
    exp_id = mlflow.create_experiment("test_get_exp_json", tags={"env": "test"})
    exp = mlflow.get_experiment(exp_id)

    result = CliRunner().invoke(
        experiments.get_experiment, ["--experiment-id", exp_id, "--output", "json"]
    )
    assert result.exit_code == 0

    output = json.loads(result.output)
    expected = {
        "experiment_id": exp_id,
        "name": "test_get_exp_json",
        "artifact_location": exp.artifact_location,
        "lifecycle_stage": "active",
        "tags": {"env": "test"},
        "creation_time": exp.creation_time,
        "last_update_time": exp.last_update_time,
    }
    assert output == expected


def test_get_experiment_table():
    exp_id = mlflow.create_experiment("test_get_exp_table", tags={"env": "test", "team": "ml"})

    result = CliRunner().invoke(
        experiments.get_experiment, ["--experiment-id", exp_id, "--output", "table"]
    )
    assert result.exit_code == 0

    # Verify table format
    assert "Experiment ID" in result.output
    assert exp_id in result.output
    assert "Name" in result.output
    assert "test_get_exp_table" in result.output
    assert "Lifecycle Stage" in result.output
    assert "active" in result.output
    assert "Tags" in result.output
    assert "env=test" in result.output
    assert "team=ml" in result.output


def test_get_experiment_table_no_tags():
    exp_id = mlflow.create_experiment("test_get_exp_no_tags")

    result = CliRunner().invoke(experiments.get_experiment, ["-x", exp_id, "--output", "table"])
    assert result.exit_code == 0

    assert "Experiment ID" in result.output
    assert exp_id in result.output
    assert "Tags" in result.output


def test_get_experiment_missing_id():
    result = CliRunner().invoke(experiments.get_experiment, [])
    assert result.exit_code != 0
    assert "Missing option '--experiment-id'" in result.output


def test_get_experiment_invalid_id():
    result = CliRunner().invoke(experiments.get_experiment, ["-x", "999999"])
    assert result.exit_code != 0


def test_get_experiment_deleted():
    exp_id = mlflow.create_experiment("test_deleted")
    mlflow.delete_experiment(exp_id)

    result = CliRunner().invoke(experiments.get_experiment, ["-x", exp_id, "--output", "json"])
    assert result.exit_code == 0

    output = json.loads(result.output)
    assert output["lifecycle_stage"] == "deleted"
    assert output["experiment_id"] == exp_id
```

--------------------------------------------------------------------------------

---[FILE: test_skinny_client_autolog_without_scipy.py]---
Location: mlflow-master/tests/test_skinny_client_autolog_without_scipy.py

```python
import os

import pytest


@pytest.mark.skipif(
    "MLFLOW_SKINNY" not in os.environ, reason="This test is only valid for the skinny client"
)
def test_autolog_without_scipy():
    import mlflow

    with pytest.raises(ImportError, match="scipy"):
        import scipy  # noqa: F401

    assert not mlflow.models.utils.HAS_SCIPY

    mlflow.autolog()
    mlflow.models.utils._Example({})
```

--------------------------------------------------------------------------------

---[FILE: test_skinny_client_omits_data_science_libs.py]---
Location: mlflow-master/tests/test_skinny_client_omits_data_science_libs.py
Signals: Flask

```python
import os

import pytest


@pytest.fixture(autouse=True)
def is_skinny():
    if "MLFLOW_SKINNY" not in os.environ:
        pytest.skip("This test is only valid for the skinny client")


def test_fails_import_flask():
    import mlflow  # noqa: F401

    with pytest.raises(ImportError, match="flask"):
        import flask  # noqa: F401


def test_fails_import_pandas():
    import mlflow  # noqa: F401

    with pytest.raises(ImportError, match="pandas"):
        import pandas  # noqa: F401


def test_fails_import_numpy():
    import mlflow  # noqa: F401

    with pytest.raises(ImportError, match="numpy"):
        import numpy  # noqa: F401
```

--------------------------------------------------------------------------------

---[FILE: test_skinny_client_omits_sql_libs.py]---
Location: mlflow-master/tests/test_skinny_client_omits_sql_libs.py
Signals: SQLAlchemy

```python
import os

import pytest


@pytest.mark.skipif(
    "MLFLOW_SKINNY" not in os.environ, reason="This test is only valid for the skinny client"
)
def test_fails_import_sqlalchemy():
    import mlflow  # noqa: F401

    with pytest.raises(ImportError, match="sqlalchemy"):
        import sqlalchemy  # noqa: F401
```

--------------------------------------------------------------------------------

---[FILE: test_version.py]---
Location: mlflow-master/tests/test_version.py

```python
from mlflow import version


def test_is_release_version(monkeypatch):
    monkeypatch.setattr(version, "VERSION", "1.19.0")
    assert version.is_release_version()

    monkeypatch.setattr(version, "VERSION", "1.19.0.dev0")
    assert not version.is_release_version()
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/tests/__init__.py

```python
from mlflow.utils.logging_utils import _configure_mlflow_loggers

_configure_mlflow_loggers(root_module_name=__name__)
```

--------------------------------------------------------------------------------

````
