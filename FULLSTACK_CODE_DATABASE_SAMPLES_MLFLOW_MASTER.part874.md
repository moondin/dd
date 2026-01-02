---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 874
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 874 of 991)

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

---[FILE: test_prophet_model_export.py]---
Location: mlflow-master/tests/prophet/test_prophet_model_export.py

```python
import json
import os
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any, NamedTuple
from unittest import mock

import numpy as np
import pandas as pd
import prophet
import pytest
import yaml
from packaging.version import Version
from prophet import Prophet

import mlflow
import mlflow.prophet
import mlflow.pyfunc.scoring_server as pyfunc_scoring_server
import mlflow.utils
from mlflow import pyfunc
from mlflow.models import Model, infer_signature
from mlflow.models.utils import _read_example, load_serving_example
from mlflow.store.artifact.s3_artifact_repo import S3ArtifactRepository
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.utils.environment import _mlflow_conda_env
from mlflow.utils.model_utils import _get_flavor_configuration

from tests.helper_functions import (
    _assert_pip_requirements,
    _compare_conda_env_requirements,
    _compare_logged_code_paths,
    _is_available_on_pypi,
    _mlflow_major_version_string,
    assert_register_model_called_with_local_model_path,
    pyfunc_serve_and_score_model,
)

EXTRA_PYFUNC_SERVING_TEST_ARGS = (
    [] if _is_available_on_pypi("prophet") else ["--env-manager", "local"]
)


class DataGeneration:
    def __init__(self, **kwargs):
        self.shift = kwargs["shift"]
        self.start = datetime.strptime(kwargs["start"], "%Y-%M-%d")
        self.size = kwargs["size"]
        self.date_field = kwargs["date_field"]
        self.target_field = kwargs["target_field"]
        self.seasonal_period = kwargs["seasonal_period"]
        self.seasonal_freq = kwargs["seasonal_freq"]
        np.random.seed(42)

    def _period_gen(self):
        period = np.sin(np.arange(0, self.seasonal_period, self.seasonal_freq)) * 50 + 50
        return np.tile(
            period, int(np.ceil(self.size / (self.seasonal_period / self.seasonal_freq)))
        )[: self.size]

    def _generate_raw(self):
        base = np.random.lognormal(mean=2.0, sigma=0.92, size=self.size)
        seasonal = [
            np.polyval([-5.0, -1.0], x) for x in np.linspace(start=0, stop=2, num=self.size)
        ]
        return (
            np.linspace(start=45.0, stop=90.0, num=self.size) + base + seasonal + self._period_gen()
        )

    def _generate_linear_data(self):
        class DataStruct(NamedTuple):
            dates: Any
            series: Any

        series = self._generate_raw()
        date_ranges = np.arange(
            self.start, self.start + timedelta(days=self.size), timedelta(days=1)
        ).astype(date)
        return DataStruct(date_ranges, series)

    def _generate_shift_data(self):
        class DataStruct(NamedTuple):
            dates: Any
            series: Any

        raw = self._generate_raw()[: int(self.size * 0.6)]
        temperature = np.concatenate((raw, raw / 2.0)).ravel()[: self.size]
        date_ranges = np.arange(
            self.start, self.start + timedelta(days=self.size), timedelta(days=1)
        ).astype(date)
        return DataStruct(date_ranges, temperature)

    def _gen_series(self):
        if self.shift:
            return self._generate_shift_data()
        else:
            return self._generate_linear_data()

    def create_series_df(self):
        gen_data = self._gen_series()
        temporal_df = pd.DataFrame.from_records(gen_data).T
        temporal_df.columns = [self.date_field, self.target_field]
        return temporal_df


TEST_CONFIG = {
    "shift": False,
    "start": "2011-07-25",
    "size": 365 * 4,
    "seasonal_period": 7,
    "seasonal_freq": 0.1,
    "date_field": "ds",
    "target_field": "y",
}
FORECAST_HORIZON = 60
SEED = 98765
HORIZON_FIELD_NAME = "horizon"
TARGET_FIELD_NAME = "yhat"
DS_FORMAT = "%Y-%m-%dT%H:%M:%S"
INFER_FORMAT = "%Y-%m-%d %H:%M:%S"


class ModelWithSource(NamedTuple):
    model: Any
    data: Any


@pytest.fixture(scope="module")
def prophet_model():
    np.random.seed(SEED)
    data = DataGeneration(**TEST_CONFIG).create_series_df()
    model = Prophet().fit(data)
    return ModelWithSource(model, data)


@pytest.fixture
def model_path(tmp_path):
    return tmp_path.joinpath("model")


@pytest.fixture
def prophet_custom_env(tmp_path):
    conda_env = tmp_path.joinpath("conda_env.yml")
    _mlflow_conda_env(conda_env, additional_pip_deps=["prophet"])
    return conda_env


def future_horizon_df(model, horizon):
    return model.make_future_dataframe(periods=horizon)


def generate_forecast(model, horizon):
    return model.predict(model.make_future_dataframe(periods=horizon))[TARGET_FIELD_NAME]


def test_model_native_save_load(prophet_model, model_path):
    model = prophet_model.model
    mlflow.prophet.save_model(pr_model=model, path=model_path)
    loaded_model = mlflow.prophet.load_model(model_uri=model_path)

    np.testing.assert_array_equal(
        generate_forecast(model, FORECAST_HORIZON),
        loaded_model.predict(future_horizon_df(loaded_model, FORECAST_HORIZON))[TARGET_FIELD_NAME],
    )


def test_model_pyfunc_save_load(prophet_model, model_path):
    model = prophet_model.model
    mlflow.prophet.save_model(pr_model=model, path=model_path)
    loaded_pyfunc = pyfunc.load_model(model_uri=model_path)

    horizon_df = future_horizon_df(model, FORECAST_HORIZON)

    np.testing.assert_array_equal(
        generate_forecast(model, FORECAST_HORIZON),
        loaded_pyfunc.predict(horizon_df)[TARGET_FIELD_NAME],
    )


@pytest.mark.parametrize("use_signature", [True, False])
@pytest.mark.parametrize("use_example", [True, False])
def test_signature_and_examples_saved_correctly(
    prophet_model, model_path, use_signature, use_example
):
    data = prophet_model.data
    model = prophet_model.model
    horizon_df = future_horizon_df(model, FORECAST_HORIZON)
    signature_ = infer_signature(data, model.predict(horizon_df))
    signature = signature_ if use_signature else None
    if use_example:
        example = data[0:5].copy(deep=False)
        example["y"] = pd.to_numeric(example["y"])  # cast to appropriate precision
    else:
        example = None
    mlflow.prophet.save_model(model, path=model_path, signature=signature, input_example=example)
    mlflow_model = Model.load(model_path)
    if signature is None and example is None:
        assert mlflow_model.signature is None
    else:
        assert mlflow_model.signature == signature_
    if example is None:
        assert mlflow_model.saved_input_example_info is None
    else:
        r_example = _read_example(mlflow_model, model_path).copy(deep=False)
        r_example["ds"] = pd.to_datetime(r_example["ds"], format=DS_FORMAT)
        np.testing.assert_array_equal(r_example, example)


def test_model_load_from_remote_uri_succeeds(prophet_model, model_path, mock_s3_bucket):
    mlflow.prophet.save_model(pr_model=prophet_model.model, path=model_path)

    artifact_root = f"s3://{mock_s3_bucket}"
    artifact_path = "model"
    artifact_repo = S3ArtifactRepository(artifact_root)
    artifact_repo.log_artifacts(model_path, artifact_path=artifact_path)

    # NB: cloudpathlib would need to be used here to handle object store uri
    model_uri = os.path.join(artifact_root, artifact_path)
    reloaded_prophet_model = mlflow.prophet.load_model(model_uri=model_uri)
    np.testing.assert_array_equal(
        generate_forecast(prophet_model.model, FORECAST_HORIZON),
        generate_forecast(reloaded_prophet_model, FORECAST_HORIZON),
    )


@pytest.mark.parametrize("should_start_run", [True, False])
def test_prophet_log_model(prophet_model, tmp_path, should_start_run):
    try:
        if should_start_run:
            mlflow.start_run()
        artifact_path = "prophet"
        conda_env = tmp_path.joinpath("conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["pystan", "prophet"])

        model_info = mlflow.prophet.log_model(
            prophet_model.model, name=artifact_path, conda_env=str(conda_env)
        )
        reloaded_prophet_model = mlflow.prophet.load_model(model_uri=model_info.model_uri)

        np.testing.assert_array_equal(
            generate_forecast(prophet_model.model, FORECAST_HORIZON),
            generate_forecast(reloaded_prophet_model, FORECAST_HORIZON),
        )

        model_path = Path(_download_artifact_from_uri(artifact_uri=model_info.model_uri))
        model_config = Model.load(str(model_path.joinpath("MLmodel")))
        assert pyfunc.FLAVOR_NAME in model_config.flavors
        assert pyfunc.ENV in model_config.flavors[pyfunc.FLAVOR_NAME]
        env_path = model_config.flavors[pyfunc.FLAVOR_NAME][pyfunc.ENV]["conda"]
        assert model_path.joinpath(env_path).exists()

    finally:
        mlflow.end_run()


def test_log_model_calls_register_model(prophet_model, tmp_path):
    artifact_path = "prophet"
    register_model_patch = mock.patch("mlflow.tracking._model_registry.fluent._register_model")
    with mlflow.start_run(), register_model_patch:
        conda_env = tmp_path.joinpath("conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["pystan", "prophet"])
        model_info = mlflow.prophet.log_model(
            prophet_model.model,
            name=artifact_path,
            conda_env=str(conda_env),
            registered_model_name="ProphetModel1",
        )
        assert_register_model_called_with_local_model_path(
            register_model_mock=mlflow.tracking._model_registry.fluent._register_model,
            model_uri=model_info.model_uri,
            registered_model_name="ProphetModel1",
        )


def test_log_model_no_registered_model_name(prophet_model, tmp_path):
    artifact_path = "prophet"
    register_model_patch = mock.patch("mlflow.tracking._model_registry.fluent._register_model")
    with mlflow.start_run(), register_model_patch:
        conda_env = tmp_path.joinpath("conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["pystan", "prophet"])
        mlflow.prophet.log_model(prophet_model.model, name=artifact_path, conda_env=str(conda_env))
        mlflow.tracking._model_registry.fluent._register_model.assert_not_called()


def test_model_save_persists_specified_conda_env_in_mlflow_model_directory(
    prophet_model, model_path, prophet_custom_env
):
    mlflow.prophet.save_model(
        pr_model=prophet_model.model, path=model_path, conda_env=str(prophet_custom_env)
    )
    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = model_path.joinpath(pyfunc_conf[pyfunc.ENV]["conda"])

    assert saved_conda_env_path.exists()
    assert not prophet_custom_env.samefile(saved_conda_env_path)

    prophet_custom_env_parsed = yaml.safe_load(prophet_custom_env.read_bytes())
    saved_conda_env_parsed = yaml.safe_load(saved_conda_env_path.read_bytes())
    assert prophet_custom_env_parsed == saved_conda_env_parsed


def test_model_save_persists_requirements_in_mlflow_model_directory(
    prophet_model, model_path, prophet_custom_env
):
    mlflow.prophet.save_model(
        pr_model=prophet_model.model, path=model_path, conda_env=str(prophet_custom_env)
    )

    saved_pip_req_path = model_path.joinpath("requirements.txt")
    _compare_conda_env_requirements(prophet_custom_env, str(saved_pip_req_path))


def test_log_model_with_pip_requirements(prophet_model, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.prophet.log_model(
            prophet_model.model, name="model", pip_requirements=str(req_file)
        )
        _assert_pip_requirements(model_info.model_uri, [expected_mlflow_version, "a"], strict=True)

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.prophet.log_model(
            prophet_model.model, name="model", pip_requirements=[f"-r {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, "a", "b"], strict=True
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.prophet.log_model(
            prophet_model.model, name="model", pip_requirements=[f"-c {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri,
            [expected_mlflow_version, "b", "-c constraints.txt"],
            ["a"],
            strict=True,
        )


def test_log_model_with_extra_pip_requirements(prophet_model, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    default_reqs = mlflow.prophet.get_default_pip_requirements()

    # Path to a requirements file
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.prophet.log_model(
            prophet_model.model, name="model", extra_pip_requirements=str(req_file)
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a"]
        )

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.prophet.log_model(
            prophet_model.model, name="model", extra_pip_requirements=[f"-r {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a", "b"]
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.prophet.log_model(
            prophet_model.model, name="model", extra_pip_requirements=[f"-c {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_uri=model_info.model_uri,
            requirements=[expected_mlflow_version, *default_reqs, "b", "-c constraints.txt"],
            constraints=["a"],
            strict=False,
        )


def test_model_save_without_specified_conda_env_uses_default_env_with_expected_dependencies(
    prophet_model, model_path
):
    mlflow.prophet.save_model(prophet_model.model, model_path)
    _assert_pip_requirements(model_path, mlflow.prophet.get_default_pip_requirements())


def test_model_log_without_specified_conda_env_uses_default_env_with_expected_dependencies(
    prophet_model,
):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.prophet.log_model(prophet_model.model, name=artifact_path)
    _assert_pip_requirements(model_info.model_uri, mlflow.prophet.get_default_pip_requirements())


def test_pyfunc_serve_and_score(prophet_model):
    artifact_path = "model"
    # cast to string representation of datetime series, otherwise will default cast to Unix time
    # which Prophet does not support for encoding
    inference_data = (
        prophet_model.model.make_future_dataframe(FORECAST_HORIZON)["ds"]
        .dt.strftime(INFER_FORMAT)
        .to_frame(name="ds")
    )
    with mlflow.start_run():
        extra_pip_requirements = (
            ["holidays<=0.24"] if Version(prophet.__version__) <= Version("1.1.3") else []
        ) + (["pandas<2"] if Version(prophet.__version__) < Version("1.1") else [])
        model_info = mlflow.prophet.log_model(
            prophet_model.model,
            name=artifact_path,
            extra_pip_requirements=extra_pip_requirements,
            input_example=inference_data,
        )
    local_predict = prophet_model.model.predict(
        prophet_model.model.make_future_dataframe(FORECAST_HORIZON)
    )

    inference_payload = load_serving_example(model_info.model_uri)
    resp = pyfunc_serve_and_score_model(
        model_info.model_uri,
        data=inference_payload,
        content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
        extra_args=EXTRA_PYFUNC_SERVING_TEST_ARGS,
    )
    scores = pd.DataFrame(data=json.loads(resp.content.decode("utf-8"))["predictions"])

    # predictions are deterministic, but yhat_lower, yhat_upper are non-deterministic based on
    # stan build underlying environment. Seed value only works for reproducibility of yhat.
    # see: https://github.com/facebook/prophet/issues/1124
    pd.testing.assert_series_equal(
        left=local_predict["yhat"], right=scores["yhat"], check_dtype=True
    )


def test_log_model_with_code_paths(prophet_model):
    artifact_path = "model"
    with (
        mlflow.start_run(),
        mock.patch("mlflow.prophet._add_code_from_conf_to_system_path") as add_mock,
    ):
        model_info = mlflow.prophet.log_model(
            prophet_model.model, name=artifact_path, code_paths=[__file__]
        )
        _compare_logged_code_paths(__file__, model_info.model_uri, mlflow.prophet.FLAVOR_NAME)
        mlflow.prophet.load_model(model_info.model_uri)
        add_mock.assert_called()


def test_virtualenv_subfield_points_to_correct_path(prophet_model, model_path):
    mlflow.prophet.save_model(prophet_model.model, path=model_path)
    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    python_env_path = Path(model_path, pyfunc_conf[pyfunc.ENV]["virtualenv"])
    assert python_env_path.exists()
    assert python_env_path.is_file()


def test_model_save_load_with_metadata(prophet_model, model_path):
    mlflow.prophet.save_model(
        prophet_model.model, path=model_path, metadata={"metadata_key": "metadata_value"}
    )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_path)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_metadata(prophet_model):
    artifact_path = "model"

    with mlflow.start_run():
        model_info = mlflow.prophet.log_model(
            prophet_model.model,
            name=artifact_path,
            metadata={"metadata_key": "metadata_value"},
        )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_info.model_uri)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_signature_inference(prophet_model):
    artifact_path = "model"
    model = prophet_model.model
    horizon_df = future_horizon_df(model, FORECAST_HORIZON)
    signature = infer_signature(horizon_df, model.predict(horizon_df))

    with mlflow.start_run():
        model_info = mlflow.prophet.log_model(model, name=artifact_path, input_example=horizon_df)

    loaded_model = Model.load(model_info.model_uri)
    assert loaded_model.signature == signature
```

--------------------------------------------------------------------------------

---[FILE: test_message.proto]---
Location: mlflow-master/tests/protos/test_message.proto

```proto
syntax = "proto2";

package mlflow;

message SampleMessage {
  optional int32 field_int32 = 1;
  optional int64 field_int64 = 2;
  optional uint32 field_uint32 = 3;
  optional uint64 field_uint64 = 4;
  optional sint32 field_sint32 = 5;
  optional sint64 field_sint64 = 6;
  optional fixed32 field_fixed32 = 7;
  optional fixed64 field_fixed64 = 8;
  optional sfixed32 field_sfixed32 = 9;
  optional sfixed64 field_sfixed64 = 10;
  optional bool field_bool = 11;
  optional string field_string = 12;

  optional int64 field_with_default1 = 13 [default = 100];
  optional int64 field_with_default2 = 14 [default = 200];

  repeated int64 field_repeated_int64 = 15;

  enum SampleEnum {
    NONE = 0;
    ENUM_VALUE1 = 1;
    ENUM_VALUE2 = 2;
  }
  optional SampleEnum field_enum = 16;

  message SampleInnerMessage {
    optional int64 field_inner_int64 = 1;
    repeated int64 field_inner_repeated_int64 = 2;
    optional string field_inner_string = 3;
  }
  repeated SampleInnerMessage field_inner_message = 17;

  oneof sample_oneof {
    int64 oneof1 = 18;
    int64 oneof2 = 19;
  }

  map<int64, string> field_map1 = 20;
  map<string, int64> field_map2 = 21;
  map<int64, int64> field_map3 = 22;
  map<int64, SampleInnerMessage> field_map4 = 23;

  extensions 1000 to 1999;
}

message ExtensionMessage {
  extend SampleMessage {
    optional int64 field_extended_int64 = 1001;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: test_message_pb2.py]---
Location: mlflow-master/tests/protos/test_message_pb2.py

```python

import google.protobuf
from packaging.version import Version
if Version(google.protobuf.__version__).major >= 5:
  # -*- coding: utf-8 -*-
  # Generated by the protocol buffer compiler.  DO NOT EDIT!
  # source: test_message.proto
  # Protobuf Python Version: 5.26.0
  """Generated protocol buffer code."""
  from google.protobuf import descriptor as _descriptor
  from google.protobuf import descriptor_pool as _descriptor_pool
  from google.protobuf import symbol_database as _symbol_database
  from google.protobuf.internal import builder as _builder
  # @@protoc_insertion_point(imports)

  _sym_db = _symbol_database.Default()




  DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x12test_message.proto\x12\x06mlflow\"\xb9\t\n\rSampleMessage\x12\x13\n\x0b\x66ield_int32\x18\x01 \x01(\x05\x12\x13\n\x0b\x66ield_int64\x18\x02 \x01(\x03\x12\x14\n\x0c\x66ield_uint32\x18\x03 \x01(\r\x12\x14\n\x0c\x66ield_uint64\x18\x04 \x01(\x04\x12\x14\n\x0c\x66ield_sint32\x18\x05 \x01(\x11\x12\x14\n\x0c\x66ield_sint64\x18\x06 \x01(\x12\x12\x15\n\rfield_fixed32\x18\x07 \x01(\x07\x12\x15\n\rfield_fixed64\x18\x08 \x01(\x06\x12\x16\n\x0e\x66ield_sfixed32\x18\t \x01(\x0f\x12\x16\n\x0e\x66ield_sfixed64\x18\n \x01(\x10\x12\x12\n\nfield_bool\x18\x0b \x01(\x08\x12\x14\n\x0c\x66ield_string\x18\x0c \x01(\t\x12 \n\x13\x66ield_with_default1\x18\r \x01(\x03:\x03\x31\x30\x30\x12 \n\x13\x66ield_with_default2\x18\x0e \x01(\x03:\x03\x32\x30\x30\x12\x1c\n\x14\x66ield_repeated_int64\x18\x0f \x03(\x03\x12\x34\n\nfield_enum\x18\x10 \x01(\x0e\x32 .mlflow.SampleMessage.SampleEnum\x12\x45\n\x13\x66ield_inner_message\x18\x11 \x03(\x0b\x32(.mlflow.SampleMessage.SampleInnerMessage\x12\x10\n\x06oneof1\x18\x12 \x01(\x03H\x00\x12\x10\n\x06oneof2\x18\x13 \x01(\x03H\x00\x12\x38\n\nfield_map1\x18\x14 \x03(\x0b\x32$.mlflow.SampleMessage.FieldMap1Entry\x12\x38\n\nfield_map2\x18\x15 \x03(\x0b\x32$.mlflow.SampleMessage.FieldMap2Entry\x12\x38\n\nfield_map3\x18\x16 \x03(\x0b\x32$.mlflow.SampleMessage.FieldMap3Entry\x12\x38\n\nfield_map4\x18\x17 \x03(\x0b\x32$.mlflow.SampleMessage.FieldMap4Entry\x1ao\n\x12SampleInnerMessage\x12\x19\n\x11\x66ield_inner_int64\x18\x01 \x01(\x03\x12\"\n\x1a\x66ield_inner_repeated_int64\x18\x02 \x03(\x03\x12\x1a\n\x12\x66ield_inner_string\x18\x03 \x01(\t\x1a\x30\n\x0e\x46ieldMap1Entry\x12\x0b\n\x03key\x18\x01 \x01(\x03\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\x1a\x30\n\x0e\x46ieldMap2Entry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\x03:\x02\x38\x01\x1a\x30\n\x0e\x46ieldMap3Entry\x12\x0b\n\x03key\x18\x01 \x01(\x03\x12\r\n\x05value\x18\x02 \x01(\x03:\x02\x38\x01\x1aZ\n\x0e\x46ieldMap4Entry\x12\x0b\n\x03key\x18\x01 \x01(\x03\x12\x37\n\x05value\x18\x02 \x01(\x0b\x32(.mlflow.SampleMessage.SampleInnerMessage:\x02\x38\x01\"8\n\nSampleEnum\x12\x08\n\x04NONE\x10\x00\x12\x0f\n\x0b\x45NUM_VALUE1\x10\x01\x12\x0f\n\x0b\x45NUM_VALUE2\x10\x02*\x06\x08\xe8\x07\x10\xd0\x0f\x42\x0e\n\x0csample_oneof\"H\n\x10\x45xtensionMessage24\n\x14\x66ield_extended_int64\x12\x15.mlflow.SampleMessage\x18\xe9\x07 \x01(\x03')

  _globals = globals()
  _builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
  _builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'test_message_pb2', _globals)
  if not _descriptor._USE_C_DESCRIPTORS:
    DESCRIPTOR._loaded_options = None
    _globals['_SAMPLEMESSAGE_FIELDMAP1ENTRY']._loaded_options = None
    _globals['_SAMPLEMESSAGE_FIELDMAP1ENTRY']._serialized_options = b'8\001'
    _globals['_SAMPLEMESSAGE_FIELDMAP2ENTRY']._loaded_options = None
    _globals['_SAMPLEMESSAGE_FIELDMAP2ENTRY']._serialized_options = b'8\001'
    _globals['_SAMPLEMESSAGE_FIELDMAP3ENTRY']._loaded_options = None
    _globals['_SAMPLEMESSAGE_FIELDMAP3ENTRY']._serialized_options = b'8\001'
    _globals['_SAMPLEMESSAGE_FIELDMAP4ENTRY']._loaded_options = None
    _globals['_SAMPLEMESSAGE_FIELDMAP4ENTRY']._serialized_options = b'8\001'
    _globals['_SAMPLEMESSAGE']._serialized_start=31
    _globals['_SAMPLEMESSAGE']._serialized_end=1240
    _globals['_SAMPLEMESSAGE_SAMPLEINNERMESSAGE']._serialized_start=805
    _globals['_SAMPLEMESSAGE_SAMPLEINNERMESSAGE']._serialized_end=916
    _globals['_SAMPLEMESSAGE_FIELDMAP1ENTRY']._serialized_start=918
    _globals['_SAMPLEMESSAGE_FIELDMAP1ENTRY']._serialized_end=966
    _globals['_SAMPLEMESSAGE_FIELDMAP2ENTRY']._serialized_start=968
    _globals['_SAMPLEMESSAGE_FIELDMAP2ENTRY']._serialized_end=1016
    _globals['_SAMPLEMESSAGE_FIELDMAP3ENTRY']._serialized_start=1018
    _globals['_SAMPLEMESSAGE_FIELDMAP3ENTRY']._serialized_end=1066
    _globals['_SAMPLEMESSAGE_FIELDMAP4ENTRY']._serialized_start=1068
    _globals['_SAMPLEMESSAGE_FIELDMAP4ENTRY']._serialized_end=1158
    _globals['_SAMPLEMESSAGE_SAMPLEENUM']._serialized_start=1160
    _globals['_SAMPLEMESSAGE_SAMPLEENUM']._serialized_end=1216
    _globals['_EXTENSIONMESSAGE']._serialized_start=1242
    _globals['_EXTENSIONMESSAGE']._serialized_end=1314
  # @@protoc_insertion_point(module_scope)

else:
  # -*- coding: utf-8 -*-
  # Generated by the protocol buffer compiler.  DO NOT EDIT!
  # source: test_message.proto
  """Generated protocol buffer code."""
  from google.protobuf import descriptor as _descriptor
  from google.protobuf import descriptor_pool as _descriptor_pool
  from google.protobuf import message as _message
  from google.protobuf import reflection as _reflection
  from google.protobuf import symbol_database as _symbol_database
  # @@protoc_insertion_point(imports)

  _sym_db = _symbol_database.Default()




  DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x12test_message.proto\x12\x06mlflow\"\xb9\t\n\rSampleMessage\x12\x13\n\x0b\x66ield_int32\x18\x01 \x01(\x05\x12\x13\n\x0b\x66ield_int64\x18\x02 \x01(\x03\x12\x14\n\x0c\x66ield_uint32\x18\x03 \x01(\r\x12\x14\n\x0c\x66ield_uint64\x18\x04 \x01(\x04\x12\x14\n\x0c\x66ield_sint32\x18\x05 \x01(\x11\x12\x14\n\x0c\x66ield_sint64\x18\x06 \x01(\x12\x12\x15\n\rfield_fixed32\x18\x07 \x01(\x07\x12\x15\n\rfield_fixed64\x18\x08 \x01(\x06\x12\x16\n\x0e\x66ield_sfixed32\x18\t \x01(\x0f\x12\x16\n\x0e\x66ield_sfixed64\x18\n \x01(\x10\x12\x12\n\nfield_bool\x18\x0b \x01(\x08\x12\x14\n\x0c\x66ield_string\x18\x0c \x01(\t\x12 \n\x13\x66ield_with_default1\x18\r \x01(\x03:\x03\x31\x30\x30\x12 \n\x13\x66ield_with_default2\x18\x0e \x01(\x03:\x03\x32\x30\x30\x12\x1c\n\x14\x66ield_repeated_int64\x18\x0f \x03(\x03\x12\x34\n\nfield_enum\x18\x10 \x01(\x0e\x32 .mlflow.SampleMessage.SampleEnum\x12\x45\n\x13\x66ield_inner_message\x18\x11 \x03(\x0b\x32(.mlflow.SampleMessage.SampleInnerMessage\x12\x10\n\x06oneof1\x18\x12 \x01(\x03H\x00\x12\x10\n\x06oneof2\x18\x13 \x01(\x03H\x00\x12\x38\n\nfield_map1\x18\x14 \x03(\x0b\x32$.mlflow.SampleMessage.FieldMap1Entry\x12\x38\n\nfield_map2\x18\x15 \x03(\x0b\x32$.mlflow.SampleMessage.FieldMap2Entry\x12\x38\n\nfield_map3\x18\x16 \x03(\x0b\x32$.mlflow.SampleMessage.FieldMap3Entry\x12\x38\n\nfield_map4\x18\x17 \x03(\x0b\x32$.mlflow.SampleMessage.FieldMap4Entry\x1ao\n\x12SampleInnerMessage\x12\x19\n\x11\x66ield_inner_int64\x18\x01 \x01(\x03\x12\"\n\x1a\x66ield_inner_repeated_int64\x18\x02 \x03(\x03\x12\x1a\n\x12\x66ield_inner_string\x18\x03 \x01(\t\x1a\x30\n\x0e\x46ieldMap1Entry\x12\x0b\n\x03key\x18\x01 \x01(\x03\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\x1a\x30\n\x0e\x46ieldMap2Entry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\x03:\x02\x38\x01\x1a\x30\n\x0e\x46ieldMap3Entry\x12\x0b\n\x03key\x18\x01 \x01(\x03\x12\r\n\x05value\x18\x02 \x01(\x03:\x02\x38\x01\x1aZ\n\x0e\x46ieldMap4Entry\x12\x0b\n\x03key\x18\x01 \x01(\x03\x12\x37\n\x05value\x18\x02 \x01(\x0b\x32(.mlflow.SampleMessage.SampleInnerMessage:\x02\x38\x01\"8\n\nSampleEnum\x12\x08\n\x04NONE\x10\x00\x12\x0f\n\x0b\x45NUM_VALUE1\x10\x01\x12\x0f\n\x0b\x45NUM_VALUE2\x10\x02*\x06\x08\xe8\x07\x10\xd0\x0f\x42\x0e\n\x0csample_oneof\"H\n\x10\x45xtensionMessage24\n\x14\x66ield_extended_int64\x12\x15.mlflow.SampleMessage\x18\xe9\x07 \x01(\x03')



  _SAMPLEMESSAGE = DESCRIPTOR.message_types_by_name['SampleMessage']
  _SAMPLEMESSAGE_SAMPLEINNERMESSAGE = _SAMPLEMESSAGE.nested_types_by_name['SampleInnerMessage']
  _SAMPLEMESSAGE_FIELDMAP1ENTRY = _SAMPLEMESSAGE.nested_types_by_name['FieldMap1Entry']
  _SAMPLEMESSAGE_FIELDMAP2ENTRY = _SAMPLEMESSAGE.nested_types_by_name['FieldMap2Entry']
  _SAMPLEMESSAGE_FIELDMAP3ENTRY = _SAMPLEMESSAGE.nested_types_by_name['FieldMap3Entry']
  _SAMPLEMESSAGE_FIELDMAP4ENTRY = _SAMPLEMESSAGE.nested_types_by_name['FieldMap4Entry']
  _EXTENSIONMESSAGE = DESCRIPTOR.message_types_by_name['ExtensionMessage']
  _SAMPLEMESSAGE_SAMPLEENUM = _SAMPLEMESSAGE.enum_types_by_name['SampleEnum']
  SampleMessage = _reflection.GeneratedProtocolMessageType('SampleMessage', (_message.Message,), {

    'SampleInnerMessage' : _reflection.GeneratedProtocolMessageType('SampleInnerMessage', (_message.Message,), {
      'DESCRIPTOR' : _SAMPLEMESSAGE_SAMPLEINNERMESSAGE,
      '__module__' : 'test_message_pb2'
      # @@protoc_insertion_point(class_scope:mlflow.SampleMessage.SampleInnerMessage)
      })
    ,

    'FieldMap1Entry' : _reflection.GeneratedProtocolMessageType('FieldMap1Entry', (_message.Message,), {
      'DESCRIPTOR' : _SAMPLEMESSAGE_FIELDMAP1ENTRY,
      '__module__' : 'test_message_pb2'
      # @@protoc_insertion_point(class_scope:mlflow.SampleMessage.FieldMap1Entry)
      })
    ,

    'FieldMap2Entry' : _reflection.GeneratedProtocolMessageType('FieldMap2Entry', (_message.Message,), {
      'DESCRIPTOR' : _SAMPLEMESSAGE_FIELDMAP2ENTRY,
      '__module__' : 'test_message_pb2'
      # @@protoc_insertion_point(class_scope:mlflow.SampleMessage.FieldMap2Entry)
      })
    ,

    'FieldMap3Entry' : _reflection.GeneratedProtocolMessageType('FieldMap3Entry', (_message.Message,), {
      'DESCRIPTOR' : _SAMPLEMESSAGE_FIELDMAP3ENTRY,
      '__module__' : 'test_message_pb2'
      # @@protoc_insertion_point(class_scope:mlflow.SampleMessage.FieldMap3Entry)
      })
    ,

    'FieldMap4Entry' : _reflection.GeneratedProtocolMessageType('FieldMap4Entry', (_message.Message,), {
      'DESCRIPTOR' : _SAMPLEMESSAGE_FIELDMAP4ENTRY,
      '__module__' : 'test_message_pb2'
      # @@protoc_insertion_point(class_scope:mlflow.SampleMessage.FieldMap4Entry)
      })
    ,
    'DESCRIPTOR' : _SAMPLEMESSAGE,
    '__module__' : 'test_message_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.SampleMessage)
    })
  _sym_db.RegisterMessage(SampleMessage)
  _sym_db.RegisterMessage(SampleMessage.SampleInnerMessage)
  _sym_db.RegisterMessage(SampleMessage.FieldMap1Entry)
  _sym_db.RegisterMessage(SampleMessage.FieldMap2Entry)
  _sym_db.RegisterMessage(SampleMessage.FieldMap3Entry)
  _sym_db.RegisterMessage(SampleMessage.FieldMap4Entry)

  ExtensionMessage = _reflection.GeneratedProtocolMessageType('ExtensionMessage', (_message.Message,), {
    'DESCRIPTOR' : _EXTENSIONMESSAGE,
    '__module__' : 'test_message_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.ExtensionMessage)
    })
  _sym_db.RegisterMessage(ExtensionMessage)

  if _descriptor._USE_C_DESCRIPTORS == False:
    SampleMessage.RegisterExtension(_EXTENSIONMESSAGE.extensions_by_name['field_extended_int64'])

    DESCRIPTOR._options = None
    _SAMPLEMESSAGE_FIELDMAP1ENTRY._options = None
    _SAMPLEMESSAGE_FIELDMAP1ENTRY._serialized_options = b'8\001'
    _SAMPLEMESSAGE_FIELDMAP2ENTRY._options = None
    _SAMPLEMESSAGE_FIELDMAP2ENTRY._serialized_options = b'8\001'
    _SAMPLEMESSAGE_FIELDMAP3ENTRY._options = None
    _SAMPLEMESSAGE_FIELDMAP3ENTRY._serialized_options = b'8\001'
    _SAMPLEMESSAGE_FIELDMAP4ENTRY._options = None
    _SAMPLEMESSAGE_FIELDMAP4ENTRY._serialized_options = b'8\001'
    _SAMPLEMESSAGE._serialized_start=31
    _SAMPLEMESSAGE._serialized_end=1240
    _SAMPLEMESSAGE_SAMPLEINNERMESSAGE._serialized_start=805
    _SAMPLEMESSAGE_SAMPLEINNERMESSAGE._serialized_end=916
    _SAMPLEMESSAGE_FIELDMAP1ENTRY._serialized_start=918
    _SAMPLEMESSAGE_FIELDMAP1ENTRY._serialized_end=966
    _SAMPLEMESSAGE_FIELDMAP2ENTRY._serialized_start=968
    _SAMPLEMESSAGE_FIELDMAP2ENTRY._serialized_end=1016
    _SAMPLEMESSAGE_FIELDMAP3ENTRY._serialized_start=1018
    _SAMPLEMESSAGE_FIELDMAP3ENTRY._serialized_end=1066
    _SAMPLEMESSAGE_FIELDMAP4ENTRY._serialized_start=1068
    _SAMPLEMESSAGE_FIELDMAP4ENTRY._serialized_end=1158
    _SAMPLEMESSAGE_SAMPLEENUM._serialized_start=1160
    _SAMPLEMESSAGE_SAMPLEENUM._serialized_end=1216
    _EXTENSIONMESSAGE._serialized_start=1242
    _EXTENSIONMESSAGE._serialized_end=1314
  # @@protoc_insertion_point(module_scope)
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/pydantic_ai/conftest.py

```python
import pytest

import mlflow

from tests.tracing.helper import purge_traces


@pytest.fixture(autouse=True)
def reset_mlflow_autolog_and_traces():
    yield
    mlflow.pydantic_ai.autolog(disable=True)
    purge_traces()


@pytest.fixture(autouse=True)
def clear_autolog_state():
    from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS

    for key in AUTOLOGGING_INTEGRATIONS.keys():
        AUTOLOGGING_INTEGRATIONS[key].clear()
    mlflow.utils.import_hooks._post_import_hooks = {}


@pytest.fixture(autouse=True)
def mock_creds(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "my-secret-key")
    monkeypatch.setenv("GEMINI_API_KEY", "my-secret-key")
```

--------------------------------------------------------------------------------

````
