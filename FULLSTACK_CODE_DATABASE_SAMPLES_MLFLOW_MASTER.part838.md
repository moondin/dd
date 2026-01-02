---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 838
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 838 of 991)

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

---[FILE: test_johnsnowlabs_model_export.py]---
Location: mlflow-master/tests/johnsnowlabs/test_johnsnowlabs_model_export.py

```python
import json
import os
from pathlib import Path
from unittest import mock

import pandas as pd
import pyspark
import pytest
from johnsnowlabs import nlp
from packaging.version import Version

import mlflow
import mlflow.utils.file_utils
from mlflow import pyfunc
from mlflow.environment_variables import MLFLOW_DFS_TMP
from mlflow.models import Model, infer_signature
from mlflow.models.utils import _read_example
from mlflow.pyfunc import spark_udf
from mlflow.utils.environment import _mlflow_conda_env
from mlflow.utils.file_utils import TempDir

from tests.helper_functions import (
    assert_register_model_called_with_local_model_path,
)

MODEL_CACHE_FOLDER = None
nlu_model = "en.classify.bert_sequence.covid_sentiment"


def setup_env():
    # Install licensed libraries on the fly into the current python environment
    # and make them available in the executing python process
    if "JSL_ACCESS_KEY" in os.environ:
        # via access_token
        from johnsnowlabs.py_models.jsl_secrets import JslSecrets

        # Download License & Install Licensed Libraries
        nlp.install(access_token=os.environ["JSL_ACCESS_KEY"])
        # Write json secret to env
        secrets = JslSecrets.from_jsl_home()
        os.environ[mlflow.johnsnowlabs._JOHNSNOWLABS_ENV_JSON_LICENSE_KEY] = json.dumps(
            {
                "SECRET": secrets.HC_SECRET,
                "AWS_ACCESS_KEY_ID": secrets.AWS_ACCESS_KEY_ID,
                "AWS_SECRET_ACCESS_KEY": secrets.AWS_SECRET_ACCESS_KEY,
                "SPARK_NLP_LICENSE": secrets.HC_LICENSE,
            }
        )
    # mlflow.johnsnowlabs._JOHNSNOWLABS_JSON_VARS needs to be present now either from CI or from
    # JSL_ACCESS_KEY
    mlflow.johnsnowlabs._set_env_vars()
    nlp.install()


@pytest.fixture(scope="module")
def load_and_init_model(model=nlu_model):
    setup_env()
    mlflow.johnsnowlabs._validate_env_vars()
    nlp.start(model_cache_folder=MODEL_CACHE_FOLDER)
    return nlp.load(model, verbose=False)


def fix_dataframe_with_respect_for_nlu_issues(df1, df2):
    # When this issue is resolved, we can remove the usage of this function
    # https://github.com/JohnSnowLabs/nlu/issues/new
    # TODO there may be some changes in confidence and changes in column names after storing/loading
    # a model these issues in NLU which are not related to MLflow and to be fixed.
    # For now we are applying a hotfix here on the dataframes to make sure that the tests run the
    # way they should
    df1 = df1.drop(columns=[c for c in df1.columns if c not in df2.columns or "confidence" in c])
    df2 = df2.drop(columns=[c for c in df2.columns if c not in df1.columns or "confidence" in c])

    def lower_strings(df):
        for c in df.columns:
            try:
                df[c] = df[c].str.lower()
            except Exception:
                pass
        return df

    df1 = lower_strings(df1)
    df2 = lower_strings(df2)
    # TODO fix: column names may change before/after save and Confidences change
    df1.columns = [f"c_{i}" for i in range(len(df1.columns))]
    df2.columns = [f"c_{i}" for i in range(len(df2.columns))]
    return df1, df2


def validate_model(original_model, new_model):
    df1 = original_model.predict("Hello World")
    df2 = new_model.predict("Hello World")
    if isinstance(df2, str):
        df2 = (
            pd.DataFrame(json.loads(df2))
            .drop(columns=["index"])
            .reset_index()
            .drop(columns=["index"])
        )
    else:
        df2 = df2.reset_index().drop(columns=["index"])
    df1 = df1.reset_index().drop(columns=["index"])

    df1, df2 = fix_dataframe_with_respect_for_nlu_issues(df1, df2)
    pd.testing.assert_frame_equal(df1, df2)


@pytest.fixture
def jsl_model(load_and_init_model):
    return load_and_init_model


@pytest.fixture
def model_path(tmp_path):
    return str(tmp_path / "model")


@pytest.fixture
def spark_custom_env(tmp_path):
    conda_env = str(tmp_path / "conda_env.yml")
    additional_pip_deps = ["pyspark", "pytest"]
    if Version(pyspark.__version__) <= Version("3.3.2"):
        # Versions of PySpark <= 3.3.2 are incompatible with pandas >= 2
        additional_pip_deps.append("pandas<2")
    _mlflow_conda_env(conda_env, additional_pip_deps=additional_pip_deps)
    return conda_env


def score_model_as_udf(model_uri, result_type="string"):
    spark = mlflow.johnsnowlabs._get_or_create_sparksession()
    pandas_df = pd.DataFrame({"text": ["Hello World"]})
    spark_df = spark.createDataFrame(pandas_df).coalesce(1)
    pyfunc_udf = spark_udf(
        spark=spark,
        model_uri=model_uri,
        env_manager="virtualenv",
        result_type=result_type,
    )
    new_df = spark_df.withColumn("prediction", pyfunc_udf(*pandas_df.columns))
    return [x["prediction"] for x in new_df.collect()]


def test_model_export(jsl_model, model_path):
    mlflow.johnsnowlabs.save_model(jsl_model, path=model_path)
    # 1. score and compare reloaded sparkml model
    reloaded_model = mlflow.johnsnowlabs.load_model(model_uri=model_path)
    validate_model(jsl_model, reloaded_model)
    # 2. score and compare reloaded pyfunc
    validate_model(jsl_model, pyfunc.load_model(model_path))
    # 3. score and compare reloaded pyfunc Spark udf
    preds3 = score_model_as_udf(model_uri=model_path)
    df1 = (
        pd.DataFrame(json.loads(preds3[0]))
        .drop(columns=["index"])
        .reset_index()
        .drop(columns=["index"])
    )
    df2 = jsl_model.predict("Hello world")
    df1, df2 = fix_dataframe_with_respect_for_nlu_issues(df1, df2)
    pd.testing.assert_frame_equal(df1, df2)
    assert os.path.exists(MLFLOW_DFS_TMP.get())


#
# def test_model_deployment(jsl_model, model_path,spark_custom_env):
#     # TODO test WIP
#     #  but using CLI mlflow models build-docker + docker run and mlflow models serve works fine
#     import mlflow.pyfunc.scoring_server as pyfunc_scoring_server
#
#     mlflow.johnsnowlabs.save_model(
#         jsl_model,
#         path=model_path,
#         conda_env=spark_custom_env,
#     )
#     # pyfunc_build_image(
#     #     model_uri=model_path,
#     # )
#     # build_docker(
#     #     model_uri=model_path,
#     #     name="mlflow-pyfunc",
#     # )
#     scoring_response = score_model_in_sagemaker_docker_container(
#         model_uri=model_path,
#         data="Hello World",
#         content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
#         flavor=mlflow.pyfunc.FLAVOR_NAME,
#     )
#     # TODO ASSERT EQ
#


def test_model_export_with_signature_and_examples(jsl_model):
    example_ = jsl_model.predict("Hello World")
    signature_ = infer_signature(example_)
    for signature in (None, signature_):
        for example in (None, example_):
            with TempDir() as tmp:
                path = tmp.path("model")
                mlflow.johnsnowlabs.save_model(
                    jsl_model, path=path, signature=signature, input_example=example
                )
                mlflow_model = Model.load(path)
                assert signature == mlflow_model.signature
                if example is None:
                    assert mlflow_model.saved_input_example_info is None
                else:
                    df1, df2 = fix_dataframe_with_respect_for_nlu_issues(
                        _read_example(mlflow_model, path).reset_index().drop(columns="index"),
                        example.reset_index().drop(columns="index"),
                    )

                    pd.testing.assert_frame_equal(df1, df2)


def test_log_model_with_signature_and_examples(jsl_model):
    example_ = jsl_model.predict("Hello World")
    signature_ = infer_signature(example_)
    artifact_path = "model"
    for signature in (None, signature_):
        for example in (None, example_):
            with mlflow.start_run():
                mlflow.johnsnowlabs.log_model(
                    jsl_model,
                    name=artifact_path,
                    signature=signature,
                    input_example=example,
                )
                artifact_uri = mlflow.get_artifact_uri()
                model_path = Path(artifact_uri) / artifact_path
                mlflow_model = Model.load(model_path)
                assert signature == mlflow_model.signature
                if example is None:
                    assert mlflow_model.saved_input_example_info is None
                else:
                    df1, df2 = fix_dataframe_with_respect_for_nlu_issues(
                        _read_example(mlflow_model, model_path).reset_index().drop(columns="index"),
                        example.reset_index().drop(columns="index"),
                    )
                    pd.testing.assert_frame_equal(df1, df2)


@pytest.mark.parametrize("should_start_run", [False, True])
@pytest.mark.parametrize("use_dfs_tmpdir", [False, True])
def test_johnsnowlabs_model_log(tmp_path, jsl_model, should_start_run, use_dfs_tmpdir):
    old_tracking_uri = mlflow.get_tracking_uri()
    dfs_tmpdir = None if use_dfs_tmpdir else tmp_path.joinpath("test")

    try:
        tracking_dir = tmp_path.joinpath("mlruns")
        mlflow.set_tracking_uri(f"file://{tracking_dir}")
        if should_start_run:
            mlflow.start_run()
        artifact_path = "model"
        mlflow.johnsnowlabs.log_model(
            jsl_model,
            name=artifact_path,
            dfs_tmpdir=dfs_tmpdir,
        )
        model_uri = f"runs:/{mlflow.active_run().info.run_id}/{artifact_path}"

        reloaded_model = mlflow.johnsnowlabs.load_model(model_uri=model_uri, dfs_tmpdir=dfs_tmpdir)
        validate_model(jsl_model, reloaded_model)
    finally:
        mlflow.end_run()
        mlflow.set_tracking_uri(old_tracking_uri)


def test_log_model_calls_register_model(tmp_path, jsl_model):
    artifact_path = "model"
    dfs_tmp_dir = tmp_path.joinpath("test")
    register_model_patch = mock.patch("mlflow.tracking._model_registry.fluent._register_model")
    with mlflow.start_run(), register_model_patch:
        mlflow.johnsnowlabs.log_model(
            jsl_model,
            name=artifact_path,
            dfs_tmpdir=dfs_tmp_dir,
            registered_model_name="AdsModel1",
        )
        model_uri = f"runs:/{mlflow.active_run().info.run_id}/{artifact_path}"
        assert_register_model_called_with_local_model_path(
            register_model_mock=mlflow.tracking._model_registry.fluent._register_model,
            model_uri=model_uri,
            registered_model_name="AdsModel1",
        )


# def test_sagemaker_docker_model_scoring_with_default_conda_env(spark_model_iris, model_path):
#     # TODO
#     mlflow.johnsnowlabs.save_model(spark_model_iris.model, path=model_path)
#
#     scoring_response = score_model_in_sagemaker_docker_container(
#         model_uri=model_path,
#         data=spark_model_iris.pandas_df,
#         content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
#         flavor=mlflow.pyfunc.FLAVOR_NAME,
#     )
#     deployed_model_preds = np.array(json.loads(scoring_response.content)["predictions"])
#
#     np.testing.assert_array_almost_equal(
#         deployed_model_preds, spark_model_iris.predictions, decimal=4
#     )


# def test_log_model_no_registered_model_name(tmpdir, jsl_model):
#     artifact_path = "model"
#     dfs_tmp_dir = Path(str(tmpdir)) / "test"
#     register_model_patch = mock.patch("mlflow.tracking._model_registry.fluent._register_model")
#     with mlflow.start_run(), register_model_patch:
#         mlflow.johnsnowlabs.log_model(
#             artifact_path=artifact_path,
#             spark_model=jsl_model,
#             dfs_tmpdir=dfs_tmp_dir,
#         )
#         mlflow.tracking._model_registry.fluent._register_model.assert_not_called()


# def test_johnsnowlabs_model_load_from_remote_uri_succeeds(jsl_model, model_path, mock_s3_bucket):
#     mlflow.johnsnowlabs.save_model(spark_model=jsl_model, path=model_path)
#
#     artifact_root = f"s3://{mock_s3_bucket}"
#     artifact_path = "model"
#     artifact_repo = S3ArtifactRepository(artifact_root)
#     artifact_repo.log_artifacts(model_path, artifact_path=artifact_path)
#
#     model_uri = artifact_root + "/" + artifact_path
#     reloaded_model = mlflow.johnsnowlabs.load_model(model_uri=model_uri)
#     validate_model(jsl_model, reloaded_model)


# def test_johnsnowlabs_model_save_persists_specified_conda_env_in_mlflow_model_directory(
#     jsl_model, model_path, spark_custom_env
# ):
#     mlflow.johnsnowlabs.save_model(
#         spark_model=jsl_model, path=model_path, conda_env=spark_custom_env
#     )
#
#     pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
#     saved_conda_env_path = Path(model_path) / pyfunc_conf[pyfunc.ENV]["conda"]
#     assert os.path.exists(saved_conda_env_path)
#     assert saved_conda_env_path != spark_custom_env
#
#     with open(spark_custom_env) as f:
#         spark_custom_env_parsed = yaml.safe_load(f)
#     with open(saved_conda_env_path) as f:
#         saved_conda_env_parsed = yaml.safe_load(f)
#     assert saved_conda_env_parsed == spark_custom_env_parsed


# def test_johnsnowlabs_model_save_persists_requirements_in_mlflow_model_directory(
#     jsl_model, model_path, spark_custom_env
# ):
#     mlflow.johnsnowlabs.save_model(
#         spark_model=jsl_model, path=model_path, conda_env=spark_custom_env
#     )
#
#     saved_pip_req_path = Path(model_path) / "requirements.txt"
#     _compare_conda_env_requirements(spark_custom_env, saved_pip_req_path)


# def test_log_model_with_pip_requirements(jsl_model, tmpdir):
#     expected_mlflow_version = _mlflow_major_version_string()
#     # Path to a requirements file
#     req_file = tmpdir.join("requirements.txt")
#     req_file.write("a")
#     with mlflow.start_run():
#         mlflow.johnsnowlabs.log_model(jsl_model, "model", pip_requirements=req_file.strpath)
#         _assert_pip_requirements(
#             mlflow.get_artifact_uri("model"), [expected_mlflow_version, "a"], strict=True
#         )
#
#     # List of requirements
#     with mlflow.start_run():
#         mlflow.johnsnowlabs.log_model(
#             jsl_model, "model", pip_requirements=[f"-r {req_file.strpath}", "b"]
#         )
#         _assert_pip_requirements(
#             mlflow.get_artifact_uri("model"), [expected_mlflow_version, "a", "b"], strict=True
#         )
#
#     # Constraints file
#     with mlflow.start_run():
#         mlflow.johnsnowlabs.log_model(
#             jsl_model, "model", pip_requirements=[f"-c {req_file.strpath}", "b"]
#         )
#         _assert_pip_requirements(
#             mlflow.get_artifact_uri("model"),
#             [expected_mlflow_version, "b", "-c constraints.txt"],
#             ["a"],
#             strict=True,
#         )
#
#
# def test_log_model_with_extra_pip_requirements(jsl_model, tmpdir):
#     expected_mlflow_version = _mlflow_major_version_string()
#     default_reqs = mlflow.johnsnowlabs.get_default_pip_requirements()
#
#     # Path to a requirements file
#     req_file = tmpdir.join("requirements.txt")
#     req_file.write("a")
#     with mlflow.start_run():
#         mlflow.johnsnowlabs.log_model(jsl_model, "model", extra_pip_requirements=req_file.strpath)
#         _assert_pip_requirements(
#             mlflow.get_artifact_uri("model"), [expected_mlflow_version, *default_reqs, "a"]
#         )
#
#     # List of requirements
#     with mlflow.start_run():
#         mlflow.johnsnowlabs.log_model(
#             jsl_model, "model", extra_pip_requirements=[f"-r {req_file.strpath}", "b"]
#         )
#         _assert_pip_requirements(
#             mlflow.get_artifact_uri("model"), [expected_mlflow_version, *default_reqs, "a", "b"]
#         )
#
#     # Constraints file
#     with mlflow.start_run():
#         mlflow.johnsnowlabs.log_model(
#             jsl_model, "model", extra_pip_requirements=[f"-c {req_file.strpath}", "b"]
#         )
#         _assert_pip_requirements(
#             mlflow.get_artifact_uri("model"),
#             [expected_mlflow_version, *default_reqs, "b", "-c constraints.txt"],
#             ["a"],
#         )
#
#
# def test_johnsnowlabs_model_save_accepts_conda_env_as_dict(jsl_model, model_path):
#     conda_env = dict(mlflow.johnsnowlabs.get_default_conda_env())
#     conda_env["dependencies"].append("pytest")
#     mlflow.johnsnowlabs.save_model(spark_model=jsl_model, path=model_path, conda_env=conda_env)
#
#     pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
#     saved_conda_env_path = Path(model_path) / pyfunc_conf[pyfunc.ENV]["conda"]
#     assert os.path.exists(saved_conda_env_path)
#
#     with open(saved_conda_env_path) as f:
#         saved_conda_env_parsed = yaml.safe_load(f)
#     assert saved_conda_env_parsed == conda_env
#
#
# def test_johnsnowlabs_model_log_persists_specified_conda_env_in_mlflow_model_directory(
#     jsl_model, model_path, spark_custom_env
# ):
#     artifact_path = "model"
#     with mlflow.start_run():
#         model_info = mlflow.johnsnowlabs.log_model(
#             spark_model=jsl_model,
#             artifact_path=artifact_path,
#             conda_env=spark_custom_env,
#         )
#         model_uri = "runs:/{run_id}/{artifact_path}".format(
#             run_id=mlflow.active_run().info.run_id, artifact_path=artifact_path
#         )
#         assert model_info.model_uri == model_uri
#
#     model_path = _download_artifact_from_uri(artifact_uri=model_uri)
#     pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
#     saved_conda_env_path = Path(model_path) / pyfunc_conf[pyfunc.ENV]["conda"]
#     assert os.path.exists(saved_conda_env_path)
#     assert saved_conda_env_path != spark_custom_env
#
#     with open(spark_custom_env) as f:
#         spark_custom_env_parsed = yaml.safe_load(f)
#     with open(saved_conda_env_path) as f:
#         saved_conda_env_parsed = yaml.safe_load(f)
#     assert saved_conda_env_parsed == spark_custom_env_parsed
#
#
# def test_johnsnowlabs_model_log_persists_requirements_in_mlflow_model_directory(
#     jsl_model, model_path, spark_custom_env
# ):
#     artifact_path = "model"
#     with mlflow.start_run():
#         mlflow.johnsnowlabs.log_model(
#             spark_model=jsl_model,
#             artifact_path=artifact_path,
#             conda_env=spark_custom_env,
#         )
#         model_uri = "runs:/{run_id}/{artifact_path}".format(
#             run_id=mlflow.active_run().info.run_id, artifact_path=artifact_path
#         )
#
#     model_path = _download_artifact_from_uri(artifact_uri=model_uri)
#     saved_pip_req_path = Path(model_path) / "requirements.txt"
#     _compare_conda_env_requirements(spark_custom_env, saved_pip_req_path)
#
#
# def test_model_save_without_specified_conda_env_uses_default_env_with_expected_dependencies(
#     jsl_model, model_path
# ):
#     mlflow.johnsnowlabs.save_model(spark_model=jsl_model, path=model_path)
#     _assert_pip_requirements(model_path, mlflow.johnsnowlabs.get_default_pip_requirements())
#
#
# def test_model_log_without_specified_conda_env_uses_default_env_with_expected_dependencies(
#     jsl_model,
# ):
#     artifact_path = "model"
#     with mlflow.start_run():
#         mlflow.johnsnowlabs.log_model(spark_model=jsl_model, artifact_path=artifact_path)
#         model_uri = mlflow.get_artifact_uri(artifact_path)
#
#     _assert_pip_requirements(model_uri, mlflow.johnsnowlabs.get_default_pip_requirements())
#
#
# def test_model_is_recorded_when_using_direct_save(jsl_model):
#     # Patch `is_local_uri` to enforce direct model serialization to DFS
#     with mock.patch("mlflow.johnsnowlabs.is_local_uri", return_value=False):
#         with mlflow.start_run():
#             mlflow.johnsnowlabs.log_model(spark_model=jsl_model, artifact_path="model")
#             current_tags = mlflow.get_run(mlflow.active_run().info.run_id).data.tags
#             assert mlflow.utils.mlflow_tags.MLFLOW_LOGGED_MODELS in current_tags
#
#
# @pytest.mark.parametrize(
#     (
#         "artifact_uri",
#         "db_runtime_version",
#         "mlflowdbfs_disabled",
#         "mlflowdbfs_available",
#         "dbutils_available",
#         "expected_uri",
#     ),
#     [
#         (
#             "dbfs:/databricks/mlflow-tracking/a/b",
#             "12.0",
#             "",
#             True,
#             True,
#             "mlflowdbfs:///artifacts?run_id={}&path=/model/sparkml",
#         ),
#         (
#             "dbfs:/databricks/mlflow-tracking/a/b",
#             "12.0",
#             "false",
#             True,
#             True,
#             "mlflowdbfs:///artifacts?run_id={}&path=/model/sparkml",
#         ),
#         (
#             "dbfs:/databricks/mlflow-tracking/a/b",
#             "12.0",
#             "false",
#             True,
#             False,
#             "dbfs:/databricks/mlflow-tracking/a/b/model/sparkml",
#         ),
#         (
#             "dbfs:/databricks/mlflow-tracking/a/b",
#             "12.0",
#             "",
#             False,
#             True,
#             "dbfs:/databricks/mlflow-tracking/a/b/model/sparkml",
#         ),
#         (
#             "dbfs:/databricks/mlflow-tracking/a/b",
#             "",
#             "",
#             True,
#             True,
#             "dbfs:/databricks/mlflow-tracking/a/b/model/sparkml",
#         ),
#         (
#             "dbfs:/databricks/mlflow-tracking/a/b",
#             "12.0",
#             "true",
#             True,
#             True,
#             "dbfs:/databricks/mlflow-tracking/a/b/model/sparkml",
#         ),
#         ("dbfs:/root/a/b", "12.0", "", True, True, "dbfs:/root/a/b/model/sparkml"),
#         ("s3://mybucket/a/b", "12.0", "", True, True, "s3://mybucket/a/b/model/sparkml"),
#     ],
# )
# def test_model_logged_via_mlflowdbfs_when_appropriate(
#     monkeypatch,
#     jsl_model,
#     artifact_uri,
#     db_runtime_version,
#     mlflowdbfs_disabled,
#     mlflowdbfs_available,
#     dbutils_available,
#     expected_uri,
# ):
#     def mock_spark_session_load(path):
#         raise Exception("MlflowDbfsClient operation failed!")
#
#     mock_spark_session = mock.Mock()
#     mock_read_spark_session = mock.Mock()
#     mock_read_spark_session.load = mock_spark_session_load
#
#     from mlflow.utils.databricks_utils import _get_dbutils as og_getdbutils
#
#     def mock_get_dbutils():
#         import inspect
#
#         # _get_dbutils is called during run creation and model logging; to avoid breaking run
#         # creation, we only mock the output if _get_dbutils is called during spark model logging
#         caller_fn_name = inspect.stack()[1].function
#         if caller_fn_name == "_should_use_mlflowdbfs":
#             if dbutils_available:
#                 return mock.Mock()
#             else:
#                 raise Exception("dbutils not available")
#         else:
#             return og_getdbutils()
#
#     with mock.patch(
#         "mlflow.utils._spark_utils._get_active_spark_session",
#         return_value=mock_spark_session,
#     ), mock.patch(
#         "mlflow.get_artifact_uri",
#         return_value=artifact_uri,
#     ), mock.patch(
#         "mlflow.spark._HadoopFileSystem.is_filesystem_available",
#         return_value=mlflowdbfs_available,
#     ), mock.patch(
#         "mlflow.utils.databricks_utils.MlflowCredentialContext", autospec=True
#     ), mock.patch(
#         "mlflow.utils.databricks_utils._get_dbutils",
#         mock_get_dbutils,
#     ), mock.patch.object(
#         jsl_model, "save"
#     ) as mock_save, mock.patch(
#         "mlflow.models.infer_pip_requirements", return_value=[]
#     ) as mock_infer:
#         with mlflow.start_run():
#             if db_runtime_version:
#                 monkeypatch.setenv("DATABRICKS_RUNTIME_VERSION", db_runtime_version)
#             monkeypatch.setenv("DISABLE_MLFLOWDBFS", mlflowdbfs_disabled)
#             mlflow.johnsnowlabs.log_model(spark_model=jsl_model, artifact_path="model")
#             mock_save.assert_called_once_with(
#                 expected_uri.format(mlflow.active_run().info.run_id)
#             )
#
#             if expected_uri.startswith("mflowdbfs"):
#                 # If mlflowdbfs is used, infer_pip_requirements should load the model from the
#                 # remote model path instead of a local tmp path.
#                 assert (
#                     mock_infer.call_args[0][0]
#                     == "dbfs:/databricks/mlflow-tracking/a/b/model/sparkml"
#                 )
#
#
# @pytest.mark.parametrize("dummy_read_shows_mlflowdbfs_available", [True, False])
# def test_model_logging_uses_mlflowdbfs_if_appropriate_when_hdfs_check_fails(
#     monkeypatch, jsl_model, dummy_read_shows_mlflowdbfs_available
# ):
#     def mock_spark_session_load(path):
#         if dummy_read_shows_mlflowdbfs_available:
#             raise Exception("MlflowdbfsClient operation failed!")
#         else:
#             raise Exception("mlflowdbfs filesystem not found")
#
#     mock_read_spark_session = mock.Mock()
#     mock_read_spark_session.load = mock_spark_session_load
#     mock_spark_session = mock.Mock()
#     mock_spark_session.read = mock_read_spark_session
#
#     from mlflow.utils.databricks_utils import _get_dbutils as og_getdbutils
#
#     def mock_get_dbutils():
#         import inspect


#
#         # _get_dbutils is called during run creation and model logging; to avoid breaking run
#         # creation, we only mock the output if _get_dbutils is called during spark model logging
#         caller_fn_name = inspect.stack()[1].function
#         if caller_fn_name == "_should_use_mlflowdbfs":
#             return mock.Mock()
#         else:
#             return og_getdbutils()
#
#     with mock.patch(
#         "mlflow.utils._spark_utils._get_active_spark_session",
#         return_value=mock_spark_session,
#     ), mock.patch(
#         "mlflow.get_artifact_uri",
#         return_value="dbfs:/databricks/mlflow-tracking/a/b",
#     ), mock.patch(
#         "mlflow.spark._HadoopFileSystem.is_filesystem_available",
#         side_effect=Exception("MlflowDbfsClient operation failed!"),
#     ), mock.patch(
#         "mlflow.utils.databricks_utils.MlflowCredentialContext", autospec=True
#     ), mock.patch(
#         "mlflow.utils.databricks_utils._get_dbutils",
#         mock_get_dbutils,
#     ), mock.patch.object(
#         jsl_model, "save"
#     ) as mock_save:
#         with mlflow.start_run():
#             monkeypatch.setenv("DATABRICKS_RUNTIME_VERSION", "12.0")
#             mlflow.johnsnowlabs.log_model(spark_model=jsl_model, artifact_path="model")
#             run_id = mlflow.active_run().info.run_id
#             mock_save.assert_called_once_with(
#                 f"mlflowdbfs:///artifacts?run_id={run_id}&path=/model/sparkml"
#                 if dummy_read_shows_mlflowdbfs_available
#                 else "dbfs:/databricks/mlflow-tracking/a/b/model/sparkml"
#             )
#
#
# def test_log_model_with_code_paths(jsl_model):
#     artifact_path = "model"
#     with mlflow.start_run(), mock.patch(
#         "mlflow.johnsnowlabs._add_code_from_conf_to_system_path",
#         wraps=_add_code_from_conf_to_system_path,
#     ) as add_mock:
#         mlflow.johnsnowlabs.log_model(
#             spark_model=jsl_model, artifact_path=artifact_path, code_paths=[__file__]
#         )
#         model_uri = mlflow.get_artifact_uri(artifact_path)
#         _compare_logged_code_paths(__file__, model_uri, mlflow.johnsnowlabs.FLAVOR_NAME)
#         mlflow.johnsnowlabs.load_model(model_uri)
#         add_mock.assert_called()
#
#
# def test_virtualenv_subfield_points_to_correct_path(jsl_model, model_path):
#     mlflow.johnsnowlabs.save_model(jsl_model, path=model_path)
#     pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
#     python_env_path = Path(model_path, pyfunc_conf[pyfunc.ENV]["virtualenv"])
#     assert python_env_path.exists()
#     assert python_env_path.is_file()
#
#
# def test_model_save_load_with_metadata(jsl_model, model_path):
#     mlflow.johnsnowlabs.save_model(
#         jsl_model, path=model_path, metadata={"metadata_key": "metadata_value"}
#     )
#
#     reloaded_model = mlflow.pyfunc.load_model(model_uri=model_path)
#     assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"
#
#
# def test_model_log_with_metadata(jsl_model):
#     artifact_path = "model"
#
#     with mlflow.start_run():
#         mlflow.johnsnowlabs.log_model(
#             jsl_model,
#             artifact_path=artifact_path,
#             metadata={"metadata_key": "metadata_value"},
#         )
#         model_uri = mlflow.get_artifact_uri(artifact_path)
#
#     reloaded_model = mlflow.pyfunc.load_model(model_uri=model_uri)
#     assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"
```

--------------------------------------------------------------------------------

---[FILE: test_autolog.py]---
Location: mlflow-master/tests/keras/test_autolog.py

```python
import json
import math

import keras
import numpy as np
import pytest

import mlflow
from mlflow.models import Model
from mlflow.tracking.fluent import flush_async_logging
from mlflow.types import Schema, TensorSpec
from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS


@pytest.fixture(autouse=True)
def clear_autologging_config():
    yield
    AUTOLOGGING_INTEGRATIONS.pop("keras", None)


def _create_keras_model():
    model = keras.Sequential(
        [
            keras.Input([28, 28, 3]),
            keras.layers.Flatten(),
            keras.layers.Dense(2),
        ]
    )

    model.compile(
        loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        optimizer=keras.optimizers.Adam(0.001),
        metrics=[keras.metrics.SparseCategoricalAccuracy()],
    )
    return model


def test_default_autolog_behavior():
    mlflow.keras.autolog()

    # Prepare data for a 2-class classification.
    data = np.random.uniform(size=(20, 28, 28, 3))
    label = np.random.randint(2, size=20)

    model = _create_keras_model()

    num_epochs = 2
    batch_size = 4
    with mlflow.start_run() as run:
        model.fit(
            data,
            label,
            validation_data=(data, label),
            batch_size=batch_size,
            epochs=num_epochs,
        )
    flush_async_logging()
    client = mlflow.MlflowClient()
    mlflow_run = client.get_run(run.info.run_id)
    run_metrics = mlflow_run.data.metrics
    model_info = mlflow_run.data.params

    # Assert training configs are logged correctly.
    assert int(model_info["batch_size"]) == batch_size
    assert model_info["optimizer_name"] == "adam"
    assert math.isclose(float(model_info["optimizer_learning_rate"]), 0.001, rel_tol=1e-6)

    assert "loss" in run_metrics
    assert "sparse_categorical_accuracy" in run_metrics
    assert "validation_loss" in run_metrics

    # Assert metrics are logged in the correct number of times.
    loss_history = client.get_metric_history(run_id=run.info.run_id, key="loss")
    assert len(loss_history) == num_epochs

    validation_loss_history = client.get_metric_history(
        run_id=run.info.run_id,
        key="validation_loss",
    )
    assert len(validation_loss_history) == num_epochs

    # Test the loaded pyfunc model produces the same output for the same input as the model.
    test_input = np.random.uniform(size=[2, 28, 28, 3]).astype(np.float32)
    model_uri = f"runs:/{run.info.run_id}/model"
    loaded_pyfunc_model = mlflow.pyfunc.load_model(model_uri)
    np.testing.assert_allclose(
        keras.ops.convert_to_numpy(model(test_input)),
        loaded_pyfunc_model.predict(test_input),
    )

    # Test the signature is logged.
    input_schema = Schema([TensorSpec(np.dtype(np.float32), (-1, 28, 28, 3))])
    output_schema = Schema([TensorSpec(np.dtype(np.float32), (-1, 2))])
    mlflow_model = Model.load(model_uri)
    assert mlflow_model.signature.inputs == input_schema
    assert mlflow_model.signature.outputs == output_schema


@pytest.mark.parametrize(
    (
        "log_every_epoch",
        "log_every_n_steps",
        "log_models",
        "log_model_signatures",
        "save_exported_model",
    ),
    [
        (False, 1, False, False, False),
        (False, 2, True, True, True),
        (True, None, False, False, False),
    ],
)
def test_custom_autolog_behavior(
    log_every_epoch,
    log_every_n_steps,
    log_models,
    log_model_signatures,
    save_exported_model,
):
    if keras.backend.backend() != "tensorflow" and save_exported_model:
        pytest.skip("Only TensorFlow backend supports saving exported models.")
    mlflow.keras.autolog(
        log_every_epoch=log_every_epoch,
        log_every_n_steps=log_every_n_steps,
        log_models=log_models,
        log_model_signatures=log_model_signatures,
        save_exported_model=save_exported_model,
    )

    # Prepare data for a 2-class classification.
    data = np.random.uniform(size=(20, 28, 28, 3))
    label = np.random.randint(2, size=20)

    model = _create_keras_model()

    num_epochs = 1
    batch_size = 4
    with mlflow.start_run() as run:
        model.fit(
            data,
            label,
            validation_data=(data, label),
            batch_size=batch_size,
            epochs=num_epochs,
        )
    flush_async_logging()
    client = mlflow.MlflowClient()
    mlflow_run = client.get_run(run.info.run_id)
    run_metrics = mlflow_run.data.metrics
    model_info = mlflow_run.data.params

    # Assert training configs are logged correctly.
    assert int(model_info["batch_size"]) == batch_size
    assert model_info["optimizer_name"] == "adam"
    assert math.isclose(float(model_info["optimizer_learning_rate"]), 0.001, rel_tol=1e-6)

    assert "loss" in run_metrics
    assert "sparse_categorical_accuracy" in run_metrics
    assert "validation_loss" in run_metrics

    # Assert metrics are logged in the correct number of times.
    loss_history = client.get_metric_history(run_id=run.info.run_id, key="loss")
    if log_every_n_steps:
        metric_length = model.optimizer.iterations.numpy() // log_every_n_steps
    else:
        metric_length = num_epochs
    assert len(loss_history) == metric_length

    validation_loss_history = client.get_metric_history(
        run_id=run.info.run_id,
        key="validation_loss",
    )
    assert len(validation_loss_history) == num_epochs

    logged_model = mlflow.last_logged_model()
    if log_models:
        assert logged_model is not None
        assert run_metrics.items() <= {m.key: m.value for m in logged_model.metrics}.items()
    else:
        assert logged_model is None
        assert "mlflow.log-model.history" not in mlflow_run.data.tags


@pytest.mark.parametrize("log_models", [True, False])
@pytest.mark.parametrize("log_datasets", [True, False])
def test_keras_autolog_log_datasets(log_datasets, log_models):
    mlflow.keras.autolog(log_datasets=log_datasets, log_models=log_models)

    # Prepare data for a 2-class classification.
    data = np.random.uniform(size=(20, 28, 28, 3)).astype(np.float32)
    label = np.random.randint(2, size=20)

    model = _create_keras_model()

    model.fit(data, label, epochs=2)
    flush_async_logging()
    client = mlflow.MlflowClient()
    run_inputs = client.get_run(mlflow.last_active_run().info.run_id).inputs
    dataset_inputs = run_inputs.dataset_inputs
    if log_datasets:
        assert len(dataset_inputs) == 1
        feature_schema = Schema(
            [
                TensorSpec(np.dtype(np.float32), (-1, 28, 28, 3)),
            ]
        )
        target_schema = Schema(
            [
                TensorSpec(np.dtype(np.int64), (-1,)),
            ]
        )
        expected = json.dumps(
            {
                "mlflow_tensorspec": {
                    "features": feature_schema.to_json(),
                    "targets": target_schema.to_json(),
                }
            }
        )
        assert dataset_inputs[0].dataset.schema == expected
    else:
        assert len(dataset_inputs) == 0
    if log_models:
        if log_datasets:
            assert len(run_inputs.model_inputs) == 1
            assert run_inputs.model_inputs[0].model_id == mlflow.last_logged_model().model_id
        else:
            assert mlflow.last_logged_model() is not None
    else:
        assert len(run_inputs.model_inputs) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_callback.py]---
Location: mlflow-master/tests/keras/test_callback.py

```python
import math

import keras
import numpy as np

import mlflow
from mlflow.keras.callback import MlflowCallback
from mlflow.tracking.fluent import flush_async_logging


def test_keras_mlflow_callback_log_every_epoch():
    # Prepare data for a 2-class classification.
    data = np.random.uniform(size=(20, 28, 28, 3))
    label = np.random.randint(2, size=20)

    model = keras.Sequential(
        [
            keras.Input([28, 28, 3]),
            keras.layers.Flatten(),
            keras.layers.Dense(2),
        ]
    )

    model.compile(
        loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        optimizer=keras.optimizers.Adam(0.001),
        metrics=[keras.metrics.SparseCategoricalAccuracy()],
    )

    num_epochs = 2
    with mlflow.start_run() as run:
        mlflow_callback = MlflowCallback(log_every_epoch=True)
        model.fit(
            data,
            label,
            validation_data=(data, label),
            batch_size=4,
            epochs=num_epochs,
            callbacks=[mlflow_callback],
        )
    flush_async_logging()
    client = mlflow.MlflowClient()
    mlflow_run = client.get_run(run.info.run_id)
    run_metrics = mlflow_run.data.metrics
    model_info = mlflow_run.data.params

    assert "sparse_categorical_accuracy" in run_metrics
    assert model_info["optimizer_name"] == "adam"
    assert math.isclose(float(model_info["optimizer_learning_rate"]), 0.001, rel_tol=1e-6)
    assert "loss" in run_metrics
    assert "validation_loss" in run_metrics

    loss_history = client.get_metric_history(run_id=run.info.run_id, key="loss")
    assert len(loss_history) == num_epochs

    validation_loss_history = client.get_metric_history(
        run_id=run.info.run_id,
        key="validation_loss",
    )
    assert len(validation_loss_history) == num_epochs


def test_keras_mlflow_callback_log_every_n_steps():
    # Prepare data for a 2-class classification.
    data = np.random.uniform(size=(20, 28, 28, 3))
    label = np.random.randint(2, size=20)

    model = keras.Sequential(
        [
            keras.Input([28, 28, 3]),
            keras.layers.Flatten(),
            keras.layers.Dense(2),
        ]
    )

    model.compile(
        loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        optimizer=keras.optimizers.Adam(0.001),
        metrics=[keras.metrics.SparseCategoricalAccuracy()],
    )

    log_every_n_steps = 1
    num_epochs = 2
    with mlflow.start_run() as run:
        mlflow_callback = MlflowCallback(log_every_epoch=False, log_every_n_steps=log_every_n_steps)
        model.fit(
            data,
            label,
            validation_data=(data, label),
            batch_size=4,
            epochs=num_epochs,
            callbacks=[mlflow_callback],
        )
    flush_async_logging()
    client = mlflow.MlflowClient()
    mlflow_run = client.get_run(run.info.run_id)
    run_metrics = mlflow_run.data.metrics
    model_info = mlflow_run.data.params

    assert "sparse_categorical_accuracy" in run_metrics
    assert model_info["optimizer_name"] == "adam"
    assert math.isclose(float(model_info["optimizer_learning_rate"]), 0.001, rel_tol=1e-6)
    assert "loss" in run_metrics
    assert "validation_loss" in run_metrics

    loss_history = client.get_metric_history(run_id=run.info.run_id, key="loss")
    assert len(loss_history) == model.optimizer.iterations.numpy() // log_every_n_steps

    validation_loss_history = client.get_metric_history(
        run_id=run.info.run_id,
        key="validation_loss",
    )
    assert len(validation_loss_history) == num_epochs


def test_old_callback_still_exists():
    assert mlflow.keras.MLflowCallback is mlflow.keras.MlflowCallback
```

--------------------------------------------------------------------------------

````
