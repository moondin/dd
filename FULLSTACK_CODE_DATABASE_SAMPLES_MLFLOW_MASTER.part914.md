---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 914
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 914 of 991)

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

---[FILE: test_pyspark_ml_autologging_custom_allowlist.py]---
Location: mlflow-master/tests/spark/autologging/ml/test_pyspark_ml_autologging_custom_allowlist.py

```python
import os

from pyspark.sql import SparkSession

import mlflow


# Put this test in separate module because it require a spark context
# with a special conf and the conf is immutable in runtime.
def test_custom_log_model_allowlist(tmp_path):
    allowlist_file_path = os.path.join(tmp_path, "allowlist")
    with open(allowlist_file_path, "w") as f:
        f.write("pyspark.ml.regression.LinearRegressionModel\n")
        f.write("pyspark.ml.classification.NaiveBayesModel\n")

    with (
        SparkSession.builder.config(
            "spark.mlflow.pysparkml.autolog.logModelAllowlistFile", allowlist_file_path
        )
        .master("local[*]")
        .getOrCreate()
    ):
        mlflow.pyspark.ml.autolog()
        assert mlflow.pyspark.ml._log_model_allowlist == {
            "pyspark.ml.regression.LinearRegressionModel",
            "pyspark.ml.classification.NaiveBayesModel",
        }


def test_log_model_allowlist_from_url():
    allowlist_file_path = "https://raw.githubusercontent.com/mlflow/mlflow/v1.26.0/mlflow/pyspark/ml/log_model_allowlist.txt"

    with (
        SparkSession.builder.config(
            "spark.mlflow.pysparkml.autolog.logModelAllowlistFile", allowlist_file_path
        )
        .master("local[*]")
        .getOrCreate()
    ):
        mlflow.pyspark.ml.autolog()

        assert mlflow.pyspark.ml._log_model_allowlist == {
            "pyspark.ml.classification.LinearSVCModel",
            "pyspark.ml.classification.DecisionTreeClassificationModel",
            "pyspark.ml.classification.GBTClassificationModel",
            "pyspark.ml.classification.LogisticRegressionModel",
            "pyspark.ml.classification.RandomForestClassificationModel",
            "pyspark.ml.classification.NaiveBayesModel",
            "pyspark.ml.clustering.BisectingKMeansModel",
            "pyspark.ml.clustering.KMeansModel",
            "pyspark.ml.clustering.GaussianMixtureModel",
            "pyspark.ml.regression.AFTSurvivalRegressionModel",
            "pyspark.ml.regression.DecisionTreeRegressionModel",
            "pyspark.ml.regression.GBTRegressionModel",
            "pyspark.ml.regression.GeneralizedLinearRegressionModel",
            "pyspark.ml.regression.LinearRegressionModel",
            "pyspark.ml.regression.RandomForestRegressionModel",
            "pyspark.ml.feature.BucketedRandomProjectionLSHModel",
            "pyspark.ml.feature.ChiSqSelectorModel",
            "pyspark.ml.feature.CountVectorizerModel",
            "pyspark.ml.feature.IDFModel",
            "pyspark.ml.feature.ImputerModel",
            "pyspark.ml.feature.MaxAbsScalerModel",
            "pyspark.ml.feature.MinHashLSHModel",
            "pyspark.ml.feature.MinMaxScalerModel",
            "pyspark.ml.feature.OneHotEncoderModel",
            "pyspark.ml.feature.RobustScalerModel",
            "pyspark.ml.feature.RFormulaModel",
            "pyspark.ml.feature.StandardScalerModel",
            "pyspark.ml.feature.StringIndexerModel",
            "pyspark.ml.feature.VarianceThresholdSelectorModel",
            "pyspark.ml.feature.VectorIndexerModel",
            "pyspark.ml.feature.UnivariateFeatureSelectorModel",
            "pyspark.ml.classification.OneVsRestModel",
            "pyspark.ml.pipeline.PipelineModel",
            "pyspark.ml.tuning.CrossValidatorModel",
            "pyspark.ml.tuning.TrainValidationSplitModel",
        }


def test_log_model_allowlist_as_autolog_argument():
    with SparkSession.builder.master("local[*]").getOrCreate():
        allowlist = [
            "pyspark.ml.regression.LinearRegressionModel",
            "pyspark.ml.classification.NaiveBayesModel",
            "pyspark.ml.feature.*",
        ]
        mlflow.pyspark.ml.autolog(log_model_allowlist=allowlist)
        assert mlflow.pyspark.ml._log_model_allowlist == set(allowlist)
```

--------------------------------------------------------------------------------

---[FILE: model_fixtures.py]---
Location: mlflow-master/tests/statsmodels/model_fixtures.py

```python
from typing import Any, NamedTuple

import numpy as np
import pandas as pd
import statsmodels.api as sm
from scipy.linalg import toeplitz
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.arima_process import arma_generate_sample

from mlflow.models import ModelSignature
from mlflow.types.schema import Schema, TensorSpec


class ModelWithResults(NamedTuple):
    model: Any
    alg: Any
    inference_dataframe: Any


"""
    Fixtures for a number of models available in statsmodels
    https://www.statsmodels.org/dev/api.html
"""


def ols_model(**kwargs):
    # Ordinary Least Squares (OLS)
    np.random.seed(9876789)
    nsamples = 100
    x = np.linspace(0, 10, 100)
    X = np.column_stack((x, x**2))
    beta = np.array([1, 0.1, 10])
    e = np.random.normal(size=nsamples)
    X = sm.add_constant(X)
    y = np.dot(X, beta) + e

    ols = sm.OLS(y, X)
    model = ols.fit(**kwargs)

    return ModelWithResults(model=model, alg=ols, inference_dataframe=X)


def ols_model_signature():
    return ModelSignature(
        inputs=Schema([TensorSpec(np.dtype("float64"), (-1, 3))]),
        outputs=Schema([TensorSpec(np.dtype("float64"), (-1,))]),
    )


def failing_logit_model():
    X = pd.DataFrame(
        {
            "x0": np.array([2.0, 3.0, 1.0, 2.0, 20.0, 30.0, 10.0, 20.0]),
            "x1": np.array([2.0, 3.0, 1.0, 2.0, 20.0, 30.0, 10.0, 20.0]),
        },
        columns=["x0", "x1"],
    )
    y = np.array([0, 0, 0, 0, 1, 1, 1, 1])
    # building the model and fitting the data
    log_reg = sm.Logit(y, X)
    model = log_reg.fit()

    return ModelWithResults(model=model, alg=log_reg, inference_dataframe=X)


def get_dataset(name):
    dataset_module = getattr(sm.datasets, name)
    data = dataset_module.load()
    data.exog = np.asarray(data.exog)
    data.endog = np.asarray(data.endog)
    return data


def gls_model():
    # Generalized Least Squares (GLS)
    data = get_dataset("longley")
    data.exog = sm.add_constant(data.exog)
    ols_resid = sm.OLS(data.endog, data.exog).fit().resid
    res_fit = sm.OLS(ols_resid[1:], ols_resid[:-1]).fit()
    rho = res_fit.params
    order = toeplitz(np.arange(16))
    sigma = rho**order
    gls = sm.GLS(data.endog, data.exog, sigma=sigma)
    model = gls.fit()

    return ModelWithResults(model=model, alg=gls, inference_dataframe=data.exog)


def glsar_model():
    # Generalized Least Squares with AR covariance structure
    X = range(1, 8)
    X = sm.add_constant(X)
    Y = [1, 3, 4, 5, 8, 10, 9]
    glsar = sm.GLSAR(Y, X, rho=2)
    model = glsar.fit()

    return ModelWithResults(model=model, alg=glsar, inference_dataframe=X)


def wls_model():
    # Weighted Least Squares
    Y = [1, 3, 4, 5, 2, 3, 4]
    X = range(1, 8)
    X = sm.add_constant(X)
    wls = sm.WLS(Y, X, weights=list(range(1, 8)))
    model = wls.fit()

    return ModelWithResults(model=model, alg=wls, inference_dataframe=X)


def recursivels_model():
    # Recursive Least Squares
    dta = sm.datasets.copper.load_pandas().data
    dta.index = pd.date_range("1951-01-01", "1975-01-01", freq="AS")
    endog = dta.WORLDCONSUMPTION

    # To the regressors in the dataset, we add a column of ones for an intercept
    exog = sm.add_constant(dta[["COPPERPRICE", "INCOMEINDEX", "ALUMPRICE", "INVENTORYINDEX"]])
    rls = sm.RecursiveLS(endog, exog)
    model = rls.fit()

    inference_dataframe = pd.DataFrame([["1951-01-01", "1975-01-01"]], columns=["start", "end"])
    return ModelWithResults(model=model, alg=rls, inference_dataframe=inference_dataframe)


def rolling_ols_model():
    # Rolling Ordinary Least Squares (Rolling OLS)
    from statsmodels.regression.rolling import RollingOLS

    data = get_dataset("longley")
    exog = sm.add_constant(data.exog, prepend=False)
    rolling_ols = RollingOLS(data.endog, exog)
    model = rolling_ols.fit(reset=50)

    return ModelWithResults(model=model, alg=rolling_ols, inference_dataframe=exog)


def rolling_wls_model():
    # Rolling Weighted Least Squares (Rolling WLS)
    from statsmodels.regression.rolling import RollingWLS

    data = get_dataset("longley")
    exog = sm.add_constant(data.exog, prepend=False)
    rolling_wls = RollingWLS(data.endog, exog)
    model = rolling_wls.fit(reset=50)

    return ModelWithResults(model=model, alg=rolling_wls, inference_dataframe=exog)


def gee_model():
    # Example taken from
    # https://www.statsmodels.org/devel/examples/notebooks/generated/gee_nested_simulation.html
    np.random.seed(9876789)
    p = 5
    groups_var = 1
    level1_var = 2
    level2_var = 3
    resid_var = 4
    n_groups = 100
    group_size = 20
    level1_size = 10
    level2_size = 5
    n = n_groups * group_size * level1_size * level2_size
    xmat = np.random.normal(size=(n, p))

    # Construct labels showing which group each observation belongs to at each level.
    groups_ix = np.kron(np.arange(n // group_size), np.ones(group_size)).astype(int)
    level1_ix = np.kron(np.arange(n // level1_size), np.ones(level1_size)).astype(int)
    level2_ix = np.kron(np.arange(n // level2_size), np.ones(level2_size)).astype(int)

    # Simulate the random effects.
    groups_re = np.sqrt(groups_var) * np.random.normal(size=n // group_size)
    level1_re = np.sqrt(level1_var) * np.random.normal(size=n // level1_size)
    level2_re = np.sqrt(level2_var) * np.random.normal(size=n // level2_size)

    # Simulate the response variable
    y = groups_re[groups_ix] + level1_re[level1_ix] + level2_re[level2_ix]
    y += np.sqrt(resid_var) * np.random.normal(size=n)

    # Put everything into a dataframe.
    df = pd.DataFrame(xmat, columns=[f"x{j}" for j in range(p)])
    df["y"] = y + xmat[:, 0] - xmat[:, 3]
    df["groups_ix"] = groups_ix
    df["level1_ix"] = level1_ix
    df["level2_ix"] = level2_ix

    # Fit the model
    cs = sm.cov_struct.Nested()
    dep_fml = "0 + level1_ix + level2_ix"
    gee = sm.GEE.from_formula(
        "y ~ x0 + x1 + x2 + x3 + x4", cov_struct=cs, dep_data=dep_fml, groups="groups_ix", data=df
    )
    model = gee.fit()

    return ModelWithResults(model=model, alg=gee, inference_dataframe=df)


def glm_model():
    # Generalized Linear Model (GLM)
    data = get_dataset("scotland")
    data.exog = sm.add_constant(data.exog)
    glm = sm.GLM(data.endog, data.exog, family=sm.families.Gamma())
    model = glm.fit()

    return ModelWithResults(model=model, alg=glm, inference_dataframe=data.exog)


def glmgam_model():
    # Generalized Additive Model (GAM)
    from statsmodels.gam.tests.test_penalized import df_autos

    x_spline = df_autos[["weight", "hp"]]
    bs = sm.gam.BSplines(x_spline, df=[12, 10], degree=[3, 3])
    alpha = np.array([21833888.8, 6460.38479])
    gam_bs = sm.GLMGam.from_formula(
        "city_mpg ~ fuel + drive", data=df_autos, smoother=bs, alpha=alpha
    )
    model = gam_bs.fit()

    return ModelWithResults(model=model, alg=gam_bs, inference_dataframe=df_autos)


def arma_model():
    # Autoregressive Moving Average (ARMA)
    np.random.seed(12345)
    arparams = np.array([1, -0.75, 0.25])
    maparams = np.array([1, 0.65, 0.35])
    nobs = 250
    y = arma_generate_sample(arparams, maparams, nobs)
    dates = pd.date_range("1980-1-1", freq="M", periods=nobs)
    y = pd.Series(y, index=dates)

    arima = ARIMA(y, order=(2, 0, 2), trend="n")
    model = arima.fit()
    inference_dataframe = pd.DataFrame([["1999-06-30", "2001-05-31"]], columns=["start", "end"])

    return ModelWithResults(model=model, alg=arima, inference_dataframe=inference_dataframe)
```

--------------------------------------------------------------------------------

---[FILE: test_statsmodels_autolog.py]---
Location: mlflow-master/tests/statsmodels/test_statsmodels_autolog.py

```python
from unittest import mock

import numpy as np
import pytest
from statsmodels.tsa.base.tsa_model import TimeSeriesModel

import mlflow
import mlflow.statsmodels
from mlflow import MlflowClient

from tests.statsmodels.model_fixtures import (
    arma_model,
    failing_logit_model,
    gee_model,
    glm_model,
    gls_model,
    glsar_model,
    ols_model,
    recursivels_model,
    rolling_ols_model,
    rolling_wls_model,
    wls_model,
)
from tests.statsmodels.test_statsmodels_model_export import _get_dates_from_df

# The code in this file has been adapted from the test cases of the lightgbm flavor.


def get_latest_run():
    client = MlflowClient()
    return client.get_run(client.search_runs(["0"])[0].info.run_id)


def test_statsmodels_autolog_ends_auto_created_run():
    mlflow.statsmodels.autolog()
    arma_model()
    assert mlflow.active_run() is None


def test_extra_tags_statsmodels_autolog():
    mlflow.statsmodels.autolog(extra_tags={"test_tag": "stats_autolog"})
    arma_model()

    run = mlflow.last_active_run()
    assert run.data.tags["test_tag"] == "stats_autolog"
    assert run.data.tags[mlflow.utils.mlflow_tags.MLFLOW_AUTOLOGGING] == "statsmodels"


def test_statsmodels_autolog_persists_manually_created_run():
    mlflow.statsmodels.autolog()
    with mlflow.start_run() as run:
        ols_model()
        assert mlflow.active_run()
        assert mlflow.active_run().info.run_id == run.info.run_id


def test_statsmodels_autolog_logs_default_params():
    mlflow.statsmodels.autolog()
    ols_model()
    run = get_latest_run()
    params = run.data.params

    expected_params = {
        "cov_kwds": "None",
        "cov_type": "nonrobust",
        "method": "pinv",
        "use_t": "None",
    }

    for key, val in expected_params.items():
        assert key in params
        assert params[key] == str(val)

    mlflow.end_run()


def test_statsmodels_autolog_logs_specified_params():
    mlflow.statsmodels.autolog()
    ols_model(method="qr")

    expected_params = {"method": "qr"}

    run = get_latest_run()
    params = run.data.params

    for key, val in expected_params.items():
        assert key in params
        assert params[key] == str(val)

    mlflow.end_run()


def test_statsmodels_autolog_logs_summary_artifact():
    mlflow.statsmodels.autolog()
    with mlflow.start_run():
        model = ols_model().model
        summary_path = mlflow.get_artifact_uri("model_summary.txt").replace("file://", "")
        with open(summary_path) as f:
            saved_summary = f.read()

    # don't compare the whole summary text because it includes a "Time" field which may change.
    assert model.summary().as_text().split("\n")[:4] == saved_summary.split("\n")[:4]


def test_statsmodels_autolog_emit_warning_when_model_is_large():
    mlflow.statsmodels.autolog()

    with (
        mock.patch("mlflow.statsmodels._model_size_threshold_for_emitting_warning", float("inf")),
        mock.patch("mlflow.statsmodels._logger.warning") as mock_warning,
    ):
        ols_model()
        assert all(
            not call_args[0][0].startswith("The fitted model is larger than")
            for call_args in mock_warning.call_args_list
        )

    with (
        mock.patch("mlflow.statsmodels._model_size_threshold_for_emitting_warning", 1),
        mock.patch("mlflow.statsmodels._logger.warning") as mock_warning,
    ):
        ols_model()
        assert any(
            call_args[0][0].startswith("The fitted model is larger than")
            for call_args in mock_warning.call_args_list
        )


@pytest.mark.parametrize("log_models", [True, False])
def test_statsmodels_autolog_logs_basic_metrics(log_models):
    mlflow.statsmodels.autolog(log_models=log_models)
    ols_model()
    run = get_latest_run()
    metrics = run.data.metrics
    assert set(metrics.keys()) == set(mlflow.statsmodels._autolog_metric_allowlist)
    logged_model = mlflow.last_logged_model()
    if log_models:
        assert logged_model is not None
        assert metrics == {m.key: m.value for m in logged_model.metrics}
    else:
        assert logged_model is None


def test_statsmodels_autolog_failed_metrics_warning():
    mlflow.statsmodels.autolog()

    @property
    def metric_raise_error(_):
        raise RuntimeError()

    class MockSummary:
        def as_text(self):
            return "mock summary."

    with (
        mock.patch("statsmodels.regression.linear_model.OLSResults.f_pvalue", metric_raise_error),
        mock.patch("statsmodels.regression.linear_model.OLSResults.fvalue", metric_raise_error),
        mock.patch(
            # Prevent `OLSResults.summary` from calling `fvalue` and `f_pvalue` that raise an
            # exception
            "statsmodels.regression.linear_model.OLSResults.summary",
            return_value=MockSummary(),
        ),
        mock.patch("mlflow.statsmodels._logger.warning") as mock_warning,
    ):
        ols_model()
        mock_warning.assert_called_once_with("Failed to autolog metrics: f_pvalue, fvalue.")


def test_statsmodels_autolog_works_after_exception():
    mlflow.statsmodels.autolog()
    # We first fit a model known to raise an exception
    with pytest.raises(Exception, match=r".+"):
        failing_logit_model()
    # and then fit another one that should go well
    model_with_results = ols_model()

    run = get_latest_run()
    run_id = run.info.run_id
    loaded_model = mlflow.statsmodels.load_model(f"runs:/{run_id}/model")

    model_predictions = model_with_results.model.predict(model_with_results.inference_dataframe)
    loaded_model_predictions = loaded_model.predict(model_with_results.inference_dataframe)
    np.testing.assert_array_almost_equal(model_predictions, loaded_model_predictions)


@pytest.mark.parametrize("log_models", [True, False])
def test_statsmodels_autolog_respects_log_models_flag(log_models):
    mlflow.statsmodels.autolog(log_models=log_models)
    ols_model()
    assert (mlflow.last_logged_model() is not None) == log_models


def test_statsmodels_autolog_loads_model_from_artifact():
    mlflow.statsmodels.autolog()
    fixtures = [
        ols_model,
        arma_model,
        glsar_model,
        gee_model,
        glm_model,
        gls_model,
        recursivels_model,
        rolling_ols_model,
        rolling_wls_model,
        wls_model,
    ]

    for algorithm in fixtures:
        model_with_results = algorithm()
        run = get_latest_run()
        run_id = run.info.run_id
        loaded_model = mlflow.statsmodels.load_model(f"runs:/{run_id}/model")

        if hasattr(model_with_results.model, "predict"):
            if isinstance(model_with_results.alg, TimeSeriesModel):
                start_date, end_date = _get_dates_from_df(model_with_results.inference_dataframe)
                model_predictions = model_with_results.model.predict(start_date, end_date)
                loaded_model_predictions = loaded_model.predict(start_date, end_date)
            else:
                model_predictions = model_with_results.model.predict(
                    model_with_results.inference_dataframe
                )
                loaded_model_predictions = loaded_model.predict(
                    model_with_results.inference_dataframe
                )

            np.testing.assert_array_almost_equal(model_predictions, loaded_model_predictions)


def test_autolog_registering_model():
    registered_model_name = "test_autolog_registered_model"
    mlflow.statsmodels.autolog(registered_model_name=registered_model_name)
    with mlflow.start_run():
        ols_model()

        registered_model = MlflowClient().get_registered_model(registered_model_name)
        assert registered_model.name == registered_model_name
```

--------------------------------------------------------------------------------

---[FILE: test_statsmodels_model_export.py]---
Location: mlflow-master/tests/statsmodels/test_statsmodels_model_export.py

```python
import json
import os
from pathlib import Path
from unittest import mock

import numpy as np
import pandas as pd
import pytest
import yaml

import mlflow.pyfunc.scoring_server as pyfunc_scoring_server
import mlflow.statsmodels
import mlflow.utils
from mlflow import pyfunc
from mlflow.models import Model
from mlflow.models.utils import _read_example, load_serving_example
from mlflow.store.artifact.s3_artifact_repo import S3ArtifactRepository
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.utils.environment import _mlflow_conda_env
from mlflow.utils.file_utils import TempDir
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
from tests.statsmodels.model_fixtures import (
    arma_model,
    gee_model,
    glm_model,
    gls_model,
    glsar_model,
    ols_model,
    ols_model_signature,
    recursivels_model,
    rolling_ols_model,
    rolling_wls_model,
    wls_model,
)

EXTRA_PYFUNC_SERVING_TEST_ARGS = (
    [] if _is_available_on_pypi("statsmodels") else ["--env-manager", "local"]
)

# The code in this file has been adapted from the test cases of the lightgbm flavor.


def _get_dates_from_df(df):
    start_date = df["start"][0]
    end_date = df["end"][0]
    return start_date, end_date


@pytest.fixture
def model_path(tmp_path, subdir="model"):
    return os.path.join(tmp_path, subdir)


@pytest.fixture
def statsmodels_custom_env(tmp_path):
    conda_env = os.path.join(tmp_path, "conda_env.yml")
    _mlflow_conda_env(conda_env, additional_pip_deps=["pytest", "statsmodels"])
    return conda_env


def _test_models_list(tmp_path, func_to_apply):
    from statsmodels.tsa.base.tsa_model import TimeSeriesModel

    fixtures = [
        ols_model,
        arma_model,
        glsar_model,
        gee_model,
        glm_model,
        gls_model,
        recursivels_model,
        rolling_ols_model,
        rolling_wls_model,
        wls_model,
    ]

    for algorithm in fixtures:
        name = algorithm.__name__
        path = os.path.join(tmp_path, name)
        model = algorithm()
        if isinstance(model.alg, TimeSeriesModel):
            start_date, end_date = _get_dates_from_df(model.inference_dataframe)
            func_to_apply(model, path, start_date, end_date)
        else:
            func_to_apply(model, path, model.inference_dataframe)


def _test_model_save_load(statsmodels_model, model_path, *predict_args):
    mlflow.statsmodels.save_model(statsmodels_model=statsmodels_model.model, path=model_path)
    reloaded_model = mlflow.statsmodels.load_model(model_uri=model_path)
    reloaded_pyfunc = pyfunc.load_model(model_uri=model_path)

    if hasattr(statsmodels_model.model, "predict"):
        np.testing.assert_array_almost_equal(
            statsmodels_model.model.predict(*predict_args),
            reloaded_model.predict(*predict_args),
        )

        np.testing.assert_array_almost_equal(
            reloaded_model.predict(*predict_args),
            reloaded_pyfunc.predict(statsmodels_model.inference_dataframe),
        )


def _test_model_log(statsmodels_model, model_path, *predict_args):
    model = statsmodels_model.model
    with TempDir(chdr=True, remove_on_exit=True) as tmp:
        try:
            artifact_path = "model"
            conda_env = os.path.join(tmp.path(), "conda_env.yaml")
            _mlflow_conda_env(conda_env, additional_pip_deps=["statsmodels"])

            model_info = mlflow.statsmodels.log_model(
                model, name=artifact_path, conda_env=conda_env
            )
            reloaded_model = mlflow.statsmodels.load_model(model_uri=model_info.model_uri)
            if hasattr(model, "predict"):
                np.testing.assert_array_almost_equal(
                    model.predict(*predict_args), reloaded_model.predict(*predict_args)
                )

            model_path = _download_artifact_from_uri(artifact_uri=model_info.model_uri)
            model_config = Model.load(os.path.join(model_path, "MLmodel"))
            assert pyfunc.FLAVOR_NAME in model_config.flavors
            assert pyfunc.ENV in model_config.flavors[pyfunc.FLAVOR_NAME]
            env_path = model_config.flavors[pyfunc.FLAVOR_NAME][pyfunc.ENV]["conda"]
            assert os.path.exists(os.path.join(model_path, env_path))
        finally:
            mlflow.end_run()


def test_models_save_load(tmp_path):
    _test_models_list(tmp_path, _test_model_save_load)


def test_models_log(tmp_path):
    _test_models_list(tmp_path, _test_model_log)


def test_signature_and_examples_are_saved_correctly():
    model, _, X = ols_model()
    signature_ = ols_model_signature()
    example_ = X[0:3, :]

    for signature in (None, signature_):
        for example in (None, example_):
            with TempDir() as tmp:
                path = tmp.path("model")
                mlflow.statsmodels.save_model(
                    model, path=path, signature=signature, input_example=example
                )
                mlflow_model = Model.load(path)
                if signature is None and example is None:
                    assert mlflow_model.signature is None
                else:
                    assert mlflow_model.signature == signature_
                if example is None:
                    assert mlflow_model.saved_input_example_info is None
                else:
                    np.testing.assert_array_equal(_read_example(mlflow_model, path), example)


def test_model_load_from_remote_uri_succeeds(model_path, mock_s3_bucket):
    model, _, inference_dataframe = arma_model()
    mlflow.statsmodels.save_model(statsmodels_model=model, path=model_path)

    artifact_root = f"s3://{mock_s3_bucket}"
    artifact_path = "model"
    artifact_repo = S3ArtifactRepository(artifact_root)
    artifact_repo.log_artifacts(model_path, artifact_path=artifact_path)

    model_uri = artifact_root + "/" + artifact_path
    reloaded_model = mlflow.statsmodels.load_model(model_uri=model_uri)
    start_date, end_date = _get_dates_from_df(inference_dataframe)
    np.testing.assert_array_almost_equal(
        model.predict(start=start_date, end=end_date),
        reloaded_model.predict(start=start_date, end=end_date),
    )


def test_log_model_calls_register_model():
    # Adapted from lightgbm tests
    ols = ols_model()
    artifact_path = "model"
    register_model_patch = mock.patch("mlflow.tracking._model_registry.fluent._register_model")
    with mlflow.start_run(), register_model_patch, TempDir(chdr=True, remove_on_exit=True) as tmp:
        conda_env = os.path.join(tmp.path(), "conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["statsmodels"])
        model_info = mlflow.statsmodels.log_model(
            ols.model,
            name=artifact_path,
            conda_env=conda_env,
            registered_model_name="OLSModel1",
        )
        assert_register_model_called_with_local_model_path(
            register_model_mock=mlflow.tracking._model_registry.fluent._register_model,
            model_uri=model_info.model_uri,
            registered_model_name="OLSModel1",
        )


def test_log_model_no_registered_model_name():
    ols = ols_model()
    artifact_path = "model"
    register_model_patch = mock.patch("mlflow.tracking._model_registry.fluent._register_model")
    with mlflow.start_run(), register_model_patch, TempDir(chdr=True, remove_on_exit=True) as tmp:
        conda_env = os.path.join(tmp.path(), "conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["statsmodels"])
        mlflow.statsmodels.log_model(ols.model, name=artifact_path, conda_env=conda_env)
        mlflow.tracking._model_registry.fluent._register_model.assert_not_called()


def test_model_save_persists_specified_conda_env_in_mlflow_model_directory(
    model_path, statsmodels_custom_env
):
    ols = ols_model()
    mlflow.statsmodels.save_model(
        statsmodels_model=ols.model, path=model_path, conda_env=statsmodels_custom_env
    )

    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert saved_conda_env_path != statsmodels_custom_env

    with open(statsmodels_custom_env) as f:
        statsmodels_custom_env_parsed = yaml.safe_load(f)
    with open(saved_conda_env_path) as f:
        saved_conda_env_parsed = yaml.safe_load(f)
    assert saved_conda_env_parsed == statsmodels_custom_env_parsed


def test_model_save_persists_requirements_in_mlflow_model_directory(
    model_path, statsmodels_custom_env
):
    ols = ols_model()
    mlflow.statsmodels.save_model(
        statsmodels_model=ols.model, path=model_path, conda_env=statsmodels_custom_env
    )

    saved_pip_req_path = os.path.join(model_path, "requirements.txt")
    _compare_conda_env_requirements(statsmodels_custom_env, saved_pip_req_path)


def test_log_model_with_pip_requirements(tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    ols = ols_model()
    # Path to a requirements file
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(
            ols.model, name="model", pip_requirements=str(req_file)
        )
        _assert_pip_requirements(model_info.model_uri, [expected_mlflow_version, "a"], strict=True)

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(
            ols.model, name="model", pip_requirements=[f"-r {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, "a", "b"], strict=True
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(
            ols.model, name="model", pip_requirements=[f"-c {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri,
            [expected_mlflow_version, "b", "-c constraints.txt"],
            ["a"],
            strict=True,
        )


def test_log_model_with_extra_pip_requirements(tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    ols = ols_model()
    default_reqs = mlflow.statsmodels.get_default_pip_requirements()

    # Path to a requirements file
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(
            ols.model, name="model", extra_pip_requirements=str(req_file)
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a"]
        )

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(
            ols.model, name="model", extra_pip_requirements=[f"-r {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a", "b"]
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(
            ols.model, name="model", extra_pip_requirements=[f"-c {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri,
            [expected_mlflow_version, *default_reqs, "b", "-c constraints.txt"],
            ["a"],
        )


def test_model_save_accepts_conda_env_as_dict(model_path):
    ols = ols_model()
    conda_env = dict(mlflow.statsmodels.get_default_conda_env())
    conda_env["dependencies"].append("pytest")
    mlflow.statsmodels.save_model(statsmodels_model=ols.model, path=model_path, conda_env=conda_env)

    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)

    with open(saved_conda_env_path) as f:
        saved_conda_env_parsed = yaml.safe_load(f)
    assert saved_conda_env_parsed == conda_env


def test_model_log_persists_specified_conda_env_in_mlflow_model_directory(statsmodels_custom_env):
    ols = ols_model()
    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(
            ols.model,
            name="model",
            conda_env=statsmodels_custom_env,
        )

    model_path = _download_artifact_from_uri(artifact_uri=model_info.model_uri)
    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert saved_conda_env_path != statsmodels_custom_env

    with open(statsmodels_custom_env) as f:
        statsmodels_custom_env_parsed = yaml.safe_load(f)
    with open(saved_conda_env_path) as f:
        saved_conda_env_parsed = yaml.safe_load(f)
    assert saved_conda_env_parsed == statsmodels_custom_env_parsed


def test_model_log_persists_requirements_in_mlflow_model_directory(statsmodels_custom_env):
    ols = ols_model()
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(
            ols.model,
            name=artifact_path,
            conda_env=statsmodels_custom_env,
        )

    model_path = _download_artifact_from_uri(artifact_uri=model_info.model_uri)
    saved_pip_req_path = os.path.join(model_path, "requirements.txt")
    _compare_conda_env_requirements(statsmodels_custom_env, saved_pip_req_path)


def test_model_save_without_specified_conda_env_uses_default_env_with_expected_dependencies(
    model_path,
):
    ols = ols_model()
    mlflow.statsmodels.save_model(statsmodels_model=ols.model, path=model_path)
    _assert_pip_requirements(model_path, mlflow.statsmodels.get_default_pip_requirements())


def test_model_log_without_specified_conda_env_uses_default_env_with_expected_dependencies():
    ols = ols_model()
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(ols.model, name=artifact_path)
    _assert_pip_requirements(
        model_info.model_uri, mlflow.statsmodels.get_default_pip_requirements()
    )


def test_pyfunc_serve_and_score():
    model, _, inference_dataframe = ols_model()
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(
            model, name=artifact_path, input_example=inference_dataframe
        )

    inference_payload = load_serving_example(model_info.model_uri)
    resp = pyfunc_serve_and_score_model(
        model_info.model_uri,
        data=inference_payload,
        content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
        extra_args=EXTRA_PYFUNC_SERVING_TEST_ARGS,
    )
    scores = pd.DataFrame(
        data=json.loads(resp.content.decode("utf-8"))["predictions"]
    ).values.squeeze()
    np.testing.assert_array_almost_equal(scores, model.predict(inference_dataframe))


def test_log_model_with_code_paths():
    artifact_path = "model"
    ols = ols_model()
    with (
        mlflow.start_run(),
        mock.patch("mlflow.statsmodels._add_code_from_conf_to_system_path") as add_mock,
    ):
        model_info = mlflow.statsmodels.log_model(
            ols.model, name=artifact_path, code_paths=[__file__]
        )
        _compare_logged_code_paths(__file__, model_info.model_uri, mlflow.statsmodels.FLAVOR_NAME)
        mlflow.statsmodels.load_model(model_info.model_uri)
        add_mock.assert_called()


def test_virtualenv_subfield_points_to_correct_path(model_path):
    ols = ols_model()
    mlflow.statsmodels.save_model(ols.model, path=model_path)
    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    python_env_path = Path(model_path, pyfunc_conf[pyfunc.ENV]["virtualenv"])
    assert python_env_path.exists()
    assert python_env_path.is_file()


def test_model_save_load_with_metadata(model_path):
    ols = ols_model()
    mlflow.statsmodels.save_model(
        ols.model, path=model_path, metadata={"metadata_key": "metadata_value"}
    )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_path)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_metadata():
    ols = ols_model()
    artifact_path = "model"

    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(
            ols.model, name=artifact_path, metadata={"metadata_key": "metadata_value"}
        )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_info.model_uri)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_signature_inference():
    model, _, X = ols_model()

    artifact_path = "model"
    example = X[0:3, :]

    with mlflow.start_run():
        model_info = mlflow.statsmodels.log_model(model, name=artifact_path, input_example=example)

    loaded_model = Model.load(model_info.model_uri)
    assert loaded_model.signature == ols_model_signature()
```

--------------------------------------------------------------------------------

---[FILE: dump_schema.py]---
Location: mlflow-master/tests/store/dump_schema.py
Signals: SQLAlchemy

```python
"""Script that generates a dump of the MLflow tracking database schema"""

import os
import sys
import tempfile

import sqlalchemy
from sqlalchemy.schema import CreateTable, MetaData

from mlflow.store.tracking.sqlalchemy_store import SqlAlchemyStore


def dump_db_schema(db_url, dst_file):
    engine = sqlalchemy.create_engine(db_url)
    created_tables_metadata = MetaData()
    created_tables_metadata.reflect(bind=engine)
    # Write out table schema as described in
    # https://docs.sqlalchemy.org/en/13/faq/
    # metadata_schema.html#how-can-i-get-the-create-table-drop-table-output-as-a-string
    lines = []
    for ti in created_tables_metadata.sorted_tables:
        lines.extend(line.rstrip() + "\n" for line in str(CreateTable(ti)).splitlines())
    schema = "".join(lines)
    with open(dst_file, "w") as handle:
        handle.write(schema)


def dump_sqlalchemy_store_schema(dst_file):
    with tempfile.TemporaryDirectory() as db_tmpdir:
        path = os.path.join(db_tmpdir, "db_file")
        db_url = f"sqlite:///{path}"
        SqlAlchemyStore(db_url, db_tmpdir)
        dump_db_schema(db_url, dst_file)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(1)
    dump_sqlalchemy_store_schema(sys.argv[1])
```

--------------------------------------------------------------------------------

````
