---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 763
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 763 of 991)

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

---[FILE: fixtures.py]---
Location: mlflow-master/tests/autologging/fixtures.py

```python
import os
import sys

import pytest

from mlflow.environment_variables import _MLFLOW_AUTOLOGGING_TESTING
from mlflow.utils import logging_utils
from mlflow.utils.autologging_utils import is_testing

PATCH_DESTINATION_FN_DEFAULT_RESULT = "original_result"


# Fixture to run the test case with and without async logging enabled
@pytest.fixture(params=[True, False], ids=["sync", "async"])
def patch_destination(request):
    if request.param:

        class Destination:
            def __init__(self):
                self.fn_call_count = 0
                self.recurse_fn_call_count = 0

            def fn(self, *args, **kwargs):
                self.fn_call_count += 1
                return PATCH_DESTINATION_FN_DEFAULT_RESULT

            def fn2(self, *args, **kwargs):
                return "f2"

            def recursive_fn(self, level, max_depth):
                self.recurse_fn_call_count += 1
                if level == max_depth:
                    return PATCH_DESTINATION_FN_DEFAULT_RESULT
                else:
                    return self.recursive_fn(level + 1, max_depth)

            def throw_error_fn(self, error_to_raise):
                raise error_to_raise

            @property
            def is_async(self):
                return False

    else:

        class Destination:
            def __init__(self):
                self.fn_call_count = 0
                self.recurse_fn_call_count = 0

            async def fn(self, *args, **kwargs):
                self.fn_call_count += 1
                return PATCH_DESTINATION_FN_DEFAULT_RESULT

            async def fn2(self, *args, **kwargs):
                return "f2"

            async def recursive_fn(self, level, max_depth):
                self.recurse_fn_call_count += 1
                if level == max_depth:
                    return PATCH_DESTINATION_FN_DEFAULT_RESULT
                else:
                    return await self.recursive_fn(level + 1, max_depth)

            async def throw_error_fn(self, error_to_raise):
                raise error_to_raise

            @property
            def is_async(self):
                return True

    return Destination()


@pytest.fixture
def test_mode_off():
    prev_env_var_value = os.environ.pop(_MLFLOW_AUTOLOGGING_TESTING.name, None)
    try:
        os.environ[_MLFLOW_AUTOLOGGING_TESTING.name] = "false"
        assert not is_testing()
        yield
    finally:
        if prev_env_var_value:
            os.environ[_MLFLOW_AUTOLOGGING_TESTING.name] = prev_env_var_value
        else:
            del os.environ[_MLFLOW_AUTOLOGGING_TESTING.name]


def enable_test_mode():
    prev_env_var_value = os.environ.pop(_MLFLOW_AUTOLOGGING_TESTING.name, None)
    try:
        os.environ[_MLFLOW_AUTOLOGGING_TESTING.name] = "true"
        assert is_testing()
        yield
    finally:
        if prev_env_var_value:
            os.environ[_MLFLOW_AUTOLOGGING_TESTING.name] = prev_env_var_value
        else:
            del os.environ[_MLFLOW_AUTOLOGGING_TESTING.name]


@pytest.fixture
def test_mode_on():
    yield from enable_test_mode()


@pytest.fixture(autouse=True)
def reset_stderr():
    prev_stderr = sys.stderr
    yield
    sys.stderr = prev_stderr


@pytest.fixture(autouse=True)
def reset_logging_enablement():
    yield
    logging_utils.enable_logging()
```

--------------------------------------------------------------------------------

---[FILE: test_autologging_behaviors_integration.py]---
Location: mlflow-master/tests/autologging/test_autologging_behaviors_integration.py
Signals: SQLAlchemy

```python
import importlib
import logging
import sys
import warnings
from concurrent.futures import ThreadPoolExecutor
from io import StringIO
from itertools import permutations
from unittest import mock

import pytest

import mlflow
from mlflow import MlflowClient
from mlflow.utils import gorilla
from mlflow.utils.autologging_utils import (
    autologging_is_disabled,
    get_autologging_config,
    safe_patch,
)

from tests.autologging.fixtures import (
    reset_stderr,  # noqa: F401
    test_mode_off,
)

AUTOLOGGING_INTEGRATIONS_TO_TEST = {
    mlflow.sklearn: "sklearn",
    mlflow.xgboost: "xgboost",
    mlflow.lightgbm: "lightgbm",
    mlflow.pytorch: "torch",
    mlflow.statsmodels: "statsmodels",
    mlflow.spark: "pyspark",
    mlflow.pyspark.ml: "pyspark",
    mlflow.tensorflow: "tensorflow",
}


@pytest.fixture(autouse=True, scope="module")
def import_integration_libraries():
    for library_module in AUTOLOGGING_INTEGRATIONS_TO_TEST.values():
        importlib.import_module(library_module)


@pytest.fixture(autouse=True)
def disable_autologging_at_test_end():
    # The yield statement is to insure that code below is executed as teardown code.
    # This will avoid bleeding of an active autologging session from test suite.
    yield
    for integration in AUTOLOGGING_INTEGRATIONS_TO_TEST:
        integration.autolog(disable=True)


@pytest.fixture
def setup_sklearn_model():
    from sklearn.datasets import load_iris
    from sklearn.linear_model import LogisticRegression

    X, y = load_iris(return_X_y=True)
    model = LogisticRegression()

    return X, y, model


@pytest.mark.parametrize("integration", AUTOLOGGING_INTEGRATIONS_TO_TEST.keys())
def test_autologging_integrations_expose_configs_and_support_disablement(integration):
    for integration in AUTOLOGGING_INTEGRATIONS_TO_TEST:
        integration.autolog(disable=False)

    integration_name = integration.autolog.integration_name

    assert not autologging_is_disabled(integration_name)
    assert not get_autologging_config(integration_name, "disable", True)

    integration.autolog(disable=True)

    assert autologging_is_disabled(integration_name)
    assert get_autologging_config(integration_name, "disable", False)


@pytest.mark.parametrize("integration", AUTOLOGGING_INTEGRATIONS_TO_TEST.keys())
def test_autologging_integrations_use_safe_patch_for_monkey_patching(integration):
    with (
        mock.patch("mlflow.utils.gorilla.apply", wraps=gorilla.apply) as gorilla_mock,
        mock.patch(integration.__name__ + ".safe_patch", wraps=safe_patch) as safe_patch_mock,
    ):
        # In `mlflow.xgboost.autolog()` and `mlflow.lightgbm.autolog()`,
        # we enable autologging for XGBoost and LightGBM sklearn models
        # using `mlflow.sklearn._autolog()`. So besides `safe_patch` calls in
        # `autolog()`, we need to count additional `safe_patch` calls
        # in sklearn autologging routine as well.
        if integration.__name__ in ["mlflow.xgboost", "mlflow.lightgbm"]:
            with mock.patch(
                "mlflow.sklearn.safe_patch", wraps=safe_patch
            ) as sklearn_safe_patch_mock:
                integration.autolog(disable=False)
                safe_patch_call_count = (
                    safe_patch_mock.call_count + sklearn_safe_patch_mock.call_count
                )

                # Assert autolog integrations use the fluent API for run management. This is to
                # ensure certain fluent API methods like mlflow.last_active_run behaves as expected.
                assert any(
                    kwargs["manage_run"]
                    for _, kwargs in sklearn_safe_patch_mock.call_args_list
                    if "manage_run" in kwargs
                )
        else:
            integration.autolog(disable=False)
            safe_patch_call_count = safe_patch_mock.call_count

        if integration.__name__ != "mlflow.spark":
            # Assert autolog integrations use the fluent API for run management. This is to
            # ensure certain fluent API methods like mlflow.last_active_run behaves as expected.
            assert any(
                kwargs["manage_run"]
                for _, kwargs in safe_patch_mock.call_args_list
                if "manage_run" in kwargs
            )
        assert safe_patch_call_count > 0
        # `safe_patch` leverages `gorilla.apply` in its implementation. Accordingly, we expect
        # that the total number of `gorilla.apply` calls to be equivalent to the number of
        # `safe_patch` calls. This verifies that autologging integrations are leveraging
        # `safe_patch`, rather than calling `gorilla.apply` directly (which does not provide
        # exception safety properties)
        assert safe_patch_call_count == gorilla_mock.call_count


def test_autolog_respects_exclusive_flag(setup_sklearn_model):
    x, y, model = setup_sklearn_model

    mlflow.sklearn.autolog(exclusive=True)
    run = mlflow.start_run()
    model.fit(x, y)
    mlflow.end_run()
    run_data = MlflowClient().get_run(run.info.run_id).data
    metrics = run_data.metrics
    params = run_data.params
    tags = run_data.tags
    assert not metrics
    assert not params
    assert all("mlflow." in key for key in tags)

    mlflow.sklearn.autolog(exclusive=False)
    run = mlflow.start_run()
    model.fit(x, y)
    mlflow.end_run()
    run_data = MlflowClient().get_run(run.info.run_id).data
    metrics = run_data.metrics
    params = run_data.params
    assert metrics
    assert params


def test_autolog_respects_disable_flag(setup_sklearn_model):
    x, y, model = setup_sklearn_model

    mlflow.sklearn.autolog(disable=True, exclusive=False)
    run = mlflow.start_run()
    model.fit(x, y)
    mlflow.end_run()
    run_data = MlflowClient().get_run(run.info.run_id).data
    metrics = run_data.metrics
    params = run_data.params
    tags = run_data.tags
    assert not metrics
    assert not params
    assert all("mlflow." in key for key in tags)

    mlflow.sklearn.autolog(disable=False, exclusive=False)
    run = mlflow.start_run()
    model.fit(x, y)
    mlflow.end_run()
    run_data = MlflowClient().get_run(run.info.run_id).data
    metrics = run_data.metrics
    params = run_data.params
    assert metrics
    assert params


def test_autolog_reverts_patched_code_when_disabled():
    # use `KMeans` because it implements `fit`, `fit_transform`, and `fit_predict`.
    from sklearn.cluster import KMeans

    # Before any patching.
    model = KMeans()
    original_fit = model.fit
    original_fit_transform = model.fit_transform
    original_fit_predict = model.fit_predict

    # After patching.
    mlflow.sklearn.autolog(disable=False)
    patched_fit = model.fit
    patched_fit_transform = model.fit_transform
    patched_fit_predict = model.fit_predict
    assert patched_fit != original_fit
    assert patched_fit_transform != original_fit_transform
    assert patched_fit_predict != original_fit_predict

    # After revert of patching.
    mlflow.sklearn.autolog(disable=True)
    reverted_fit = model.fit
    reverted_fit_transform = model.fit_transform
    reverted_fit_predict = model.fit_predict

    assert reverted_fit == original_fit
    assert reverted_fit_transform == original_fit_transform
    assert reverted_fit_predict == original_fit_predict
    assert reverted_fit != patched_fit
    assert reverted_fit_transform != patched_fit_transform
    assert reverted_fit_predict != patched_fit_predict


def test_autolog_respects_disable_flag_across_import_orders():
    def test():
        from sklearn import datasets, svm

        iris = datasets.load_iris()
        svc = svm.SVC(C=2.0, degree=5, kernel="rbf")
        run = mlflow.start_run()
        svc.fit(iris.data, iris.target)
        mlflow.end_run()
        run_data = MlflowClient().get_run(run.info.run_id).data
        metrics = run_data.metrics
        params = run_data.params
        tags = run_data.tags
        assert not metrics
        assert not params
        assert all("mlflow." in key for key in tags)

    def import_sklearn():
        import sklearn  # noqa: F401

    def disable_autolog():
        mlflow.sklearn.autolog(disable=True)

    def mlflow_autolog():
        mlflow.autolog()

    import_list = [import_sklearn, disable_autolog, mlflow_autolog]

    for func_order_list in permutations(import_list):
        for fun in func_order_list:
            fun()
        test()


@pytest.mark.usefixtures(test_mode_off.__name__)
def test_autolog_respects_silent_mode(tmp_path, monkeypatch):
    # disable progress bar as it is not controlled by `silent` flag
    monkeypatch.setenv("MLFLOW_ENABLE_ARTIFACTS_PROGRESS_BAR", "false")

    # Use file-based experiment storage for this test. Otherwise, concurrent experiment creation in
    # multithreaded contexts may fail for other storage backends (e.g. SQLAlchemy)
    mlflow.set_tracking_uri(str(tmp_path))
    mlflow.set_experiment("test_experiment")

    og_showwarning = warnings.showwarning
    stream = StringIO()
    sys.stderr = stream
    logger = logging.getLogger(mlflow.__name__)

    from sklearn import datasets

    iris = datasets.load_iris()

    def train_model():
        from joblib import parallel_backend
        from sklearn import svm
        from sklearn.model_selection import GridSearchCV

        parameters = {"kernel": ("linear", "rbf"), "C": [1, 10]}
        svc = svm.SVC()
        with parallel_backend(backend="threading"):
            clf = GridSearchCV(svc, parameters)
            clf.fit(iris.data, iris.target)

        return True

    # Call general and framework-specific autologging APIs to cover a
    # larger surface area for testing purposes
    mlflow.autolog(silent=True)
    mlflow.sklearn.autolog(silent=True, log_input_examples=True)

    with ThreadPoolExecutor(max_workers=50) as executor:
        executions = [executor.submit(train_model) for _ in range(2)]

    assert all(e.result() is True for e in executions)
    assert not stream.getvalue()
    # Verify that `warnings.showwarning` was restored to its original value after training
    # and that MLflow event logs are enabled
    assert warnings.showwarning == og_showwarning
    logger.info("verify that event logs are enabled")
    assert "verify that event logs are enabled" in stream.getvalue()

    stream.truncate(0)

    mlflow.sklearn.autolog(silent=False, log_input_examples=True)

    with ThreadPoolExecutor(max_workers=50) as executor:
        executions = [executor.submit(train_model) for _ in range(100)]

    assert all(e.result() is True for e in executions)
    assert stream.getvalue()
    # Verify that `warnings.showwarning` was restored to its original value after training
    # and that MLflow event logs are enabled
    assert warnings.showwarning == og_showwarning
    logger.info("verify that event logs are enabled")
    assert "verify that event logs are enabled" in stream.getvalue()

    # TODO: Investigate why this test occasionally leaks a run, which causes the
    # `clean_up_leaked_runs` fixture in `tests/conftest.py` to fail.
    while mlflow.active_run():
        mlflow.end_run()


def test_autolog_globally_configured_flag_set_correctly():
    from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS

    AUTOLOGGING_INTEGRATIONS.clear()
    import pyspark
    import pyspark.ml  # noqa: F401
    import sklearn  # noqa: F401

    integrations_to_test = ["sklearn", "spark", "pyspark.ml"]
    mlflow.autolog()
    for integration_name in integrations_to_test:
        assert AUTOLOGGING_INTEGRATIONS[integration_name]["globally_configured"]

    mlflow.sklearn.autolog()
    mlflow.spark.autolog()
    mlflow.pyspark.ml.autolog()

    for integration_name in integrations_to_test:
        assert "globally_configured" not in AUTOLOGGING_INTEGRATIONS[integration_name]
```

--------------------------------------------------------------------------------

---[FILE: test_autologging_behaviors_unit.py]---
Location: mlflow-master/tests/autologging/test_autologging_behaviors_unit.py

```python
import logging
import sys
import threading
import time
import warnings
from concurrent.futures import ThreadPoolExecutor
from io import StringIO

import numpy as np
import pytest

import mlflow
from mlflow.utils.autologging_utils import autologging_integration, safe_patch
from mlflow.utils.logging_utils import eprint

from tests.autologging.async_helper import asyncify, run_sync_or_async
from tests.autologging.fixtures import (
    patch_destination,
    reset_stderr,  # noqa: F401
    test_mode_off,
)


@pytest.fixture
def logger():
    return logging.getLogger(mlflow.__name__)


@pytest.fixture
def autolog_function(patch_destination, logger):
    def original_impl():
        # Increase the duration of the original function by inserting a short sleep in order to
        # increase the likelihood of overlapping session stages (i.e. simultaneous preamble /
        # postamble / original function execution states across autologging sessions) during
        # multithreaded execution. We use a duration of 50 milliseconds to avoid slowing down the
        # test significantly
        time.sleep(0.05)
        warnings.warn("Test warning from OG function", category=UserWarning)

    patch_destination.fn = original_impl

    def patch_impl(original):
        eprint("patch1")
        logger.info("patch2")
        warnings.warn_explicit(
            "preamble MLflow warning", category=Warning, filename=mlflow.__file__, lineno=5
        )
        warnings.warn_explicit(
            "preamble numpy warning", category=UserWarning, filename=np.__file__, lineno=7
        )
        original()
        warnings.warn_explicit(
            "postamble MLflow warning", category=Warning, filename=mlflow.__file__, lineno=10
        )
        warnings.warn_explicit(
            "postamble numpy warning", category=Warning, filename=np.__file__, lineno=14
        )
        logger.warning("patch3")
        logger.critical("patch4")

    @autologging_integration("test_integration")
    def test_autolog(disable=False, silent=False):
        eprint("enablement1")
        logger.info("enablement2")
        logger.warning("enablement3")
        logger.critical("enablement4")
        warnings.warn_explicit(
            "enablement warning MLflow", category=Warning, filename=mlflow.__file__, lineno=15
        )
        warnings.warn_explicit(
            "enablement warning numpy", category=Warning, filename=np.__file__, lineno=30
        )
        safe_patch("test_integration", patch_destination, "fn", patch_impl)

    return test_autolog


def test_autologging_warnings_are_redirected_as_expected(
    autolog_function, patch_destination, logger
):
    stream = StringIO()
    sys.stderr = stream

    with warnings.catch_warnings(record=True) as warnings_record:
        autolog_function(silent=False)
        patch_destination.fn()

    # The following types of warnings are rerouted to MLflow's event loggers:
    # 1. All MLflow warnings emitted during patch function execution
    # 2. All warnings emitted during the patch function preamble (before the execution of the
    #    original / underlying function) and postamble (after the execution of the underlying
    #    function)
    # 3. non-MLflow warnings emitted during autologging setup / enablement
    #
    # Accordingly, we expect the following warnings to have been emitted normally: 1. MLflow
    # warnings emitted during autologging enablement, 2. non-MLflow warnings emitted during original
    # / underlying function execution
    warning_messages = {str(w.message) for w in warnings_record}
    assert warning_messages == {"enablement warning MLflow", "Test warning from OG function"}

    # Further, We expect MLflow's logging stream to contain content from all warnings emitted during
    # the autologging preamble and postamble and non-MLflow warnings emitted during autologging
    # enablement
    for item in [
        'MLflow autologging encountered a warning: "%s:5: Warning: preamble MLflow warning"',
        'MLflow autologging encountered a warning: "%s:10: Warning: postamble MLflow warning"',
    ]:
        assert item % mlflow.__file__ in stream.getvalue()
    for item in [
        'MLflow autologging encountered a warning: "%s:7: UserWarning: preamble numpy warning"',
        'MLflow autologging encountered a warning: "%s:14: Warning: postamble numpy warning"',
        'MLflow autologging encountered a warning: "%s:30: Warning: enablement warning numpy"',
    ]:
        assert item % np.__file__ in stream.getvalue()


def test_autologging_event_logging_and_warnings_respect_silent_mode(
    autolog_function, patch_destination, logger
):
    og_showwarning = warnings.showwarning
    stream = StringIO()
    sys.stderr = stream

    with warnings.catch_warnings(record=True) as silent_warnings_record:
        autolog_function(silent=True)
        patch_destination.fn()

    assert len(silent_warnings_record) == 1
    assert "Test warning from OG function" in str(silent_warnings_record[0].message)
    assert not stream.getvalue()

    # Verify that `warnings.showwarning` was restored to its original value after training
    # and that MLflow event logs are enabled
    assert warnings.showwarning == og_showwarning
    logger.info("verify that event logs are enabled")
    assert "verify that event logs are enabled" in stream.getvalue()

    stream.truncate(0)

    with warnings.catch_warnings(record=True) as noisy_warnings_record:
        autolog_function(silent=False)
        patch_destination.fn()

    # Verify that calling the autolog function with `silent=False` and invoking the mock training
    # function with autolog disabled produces event logs and warnings
    for item in ["enablement1", "enablement2", "enablement3", "enablement4"]:
        assert item in stream.getvalue()

    for item in ["patch1", "patch2", "patch3", "patch4"]:
        assert item in stream.getvalue()

    warning_messages = {str(w.message) for w in noisy_warnings_record}
    assert "enablement warning MLflow" in warning_messages

    # Verify that `warnings.showwarning` was restored to its original value after training
    # and that MLflow event logs are enabled
    assert warnings.showwarning == og_showwarning
    logger.info("verify that event logs are enabled")
    assert "verify that event logs are enabled" in stream.getvalue()


def test_silent_mode_is_respected_in_multithreaded_environments(
    autolog_function, patch_destination, logger
):
    og_showwarning = warnings.showwarning
    stream = StringIO()
    sys.stderr = stream

    autolog_function(silent=True)

    def parallel_fn():
        # Sleep for a random interval to increase the likelihood of overlapping session stages
        # (i.e. simultaneous preamble / postamble / original function execution states across
        # autologging sessions)
        time.sleep(np.random.random())
        patch_destination.fn()
        return True

    executions = []
    with warnings.catch_warnings(record=True) as warnings_record:
        warnings.simplefilter("always")
        with ThreadPoolExecutor(max_workers=50) as executor:
            executions.extend(executor.submit(parallel_fn) for _ in range(100))

    assert all(e.result() is True for e in executions)

    # Verify that all warnings and log events from MLflow autologging code were silenced
    # and that all warnings from the original / underlying routine were emitted as normal
    assert not stream.getvalue()
    assert len(warnings_record) == 100
    assert all("Test warning from OG function" in str(w.message) for w in warnings_record)

    # Verify that `warnings.showwarning` was restored to its original value after training
    # and that MLflow event logs are enabled
    assert warnings.showwarning == og_showwarning
    logger.info("verify that event logs are enabled")
    assert "verify that event logs are enabled" in stream.getvalue()


@pytest.mark.usefixtures(test_mode_off.__name__)
def test_silent_mode_restores_warning_and_event_logging_behavior_correctly_if_errors_occur():
    og_showwarning = warnings.showwarning
    stream = StringIO()
    sys.stderr = stream
    logger = logging.getLogger(mlflow.__name__)

    def original_impl():
        raise Exception("original error")

    patch_destination.fn = original_impl

    def patch_impl(original):
        original()
        raise Exception("postamble error")

    @autologging_integration("test_integration")
    def test_autolog(disable=False, silent=False):
        safe_patch("test_integration", patch_destination, "fn", patch_impl)
        raise Exception("enablement error")

    def parallel_fn():
        # Sleep for a random duration between 0 and 1 seconds to increase the likelihood of
        # overlapping session stages (i.e. simultaneous preamble / postamble / original function
        # execution states across autologging sessions)
        time.sleep(np.random.random())
        patch_destination.fn()

    with pytest.raises(Exception, match="enablement error"):
        test_autolog(silent=True)

    with warnings.catch_warnings():
        warnings.simplefilter("error")
        with ThreadPoolExecutor(max_workers=50) as executor:
            for _ in range(100):
                executor.submit(parallel_fn)

    assert warnings.showwarning == og_showwarning
    logger.info("verify that event logs are enabled")
    assert "verify that event logs are enabled" in stream.getvalue()


def test_silent_mode_operates_independently_across_integrations(patch_destination, logger):
    stream = StringIO()
    sys.stderr = stream

    @asyncify(patch_destination.is_async)
    def patch_impl1(original):
        warnings.warn("patchimpl1")
        original()

    @autologging_integration("integration1")
    def autolog1(disable=False, silent=False):
        logger.info("autolog1")
        safe_patch("integration1", patch_destination, "fn", patch_impl1)

    @asyncify(patch_destination.is_async)
    def patch_impl2(original):
        logger.info("patchimpl2")
        original()

    @autologging_integration("integration2")
    def autolog2(disable=False, silent=False):
        warnings.warn_explicit(
            "warn_autolog2", category=Warning, filename=mlflow.__file__, lineno=5
        )
        logger.info("event_autolog2")
        safe_patch("integration2", patch_destination, "fn2", patch_impl2)

    with warnings.catch_warnings(record=True) as warnings_record:
        autolog1(silent=True)
        autolog2(silent=False)

        run_sync_or_async(patch_destination.fn)
        run_sync_or_async(patch_destination.fn2)

    warning_messages = [str(w.message) for w in warnings_record]
    assert warning_messages == ["warn_autolog2"]

    assert "autolog1" not in stream.getvalue()
    assert "patchimpl1" not in stream.getvalue()

    assert "event_autolog2" in stream.getvalue()
    assert "patchimpl2" in stream.getvalue()


@pytest.mark.parametrize("silent", [False, True])
@pytest.mark.parametrize("disable", [False, True])
def test_silent_mode_and_warning_rerouting_respect_disabled_flag(
    patch_destination, silent, disable
):
    stream = StringIO()
    sys.stderr = stream

    def original_fn():
        warnings.warn("Test warning", category=UserWarning)

    patch_destination.fn = original_fn

    @autologging_integration("test_integration")
    def test_autolog(disable=False, silent=False):
        safe_patch("test_integration", patch_destination, "fn", lambda original: original())

    test_autolog(disable=disable, silent=silent)

    with warnings.catch_warnings(record=True) as warnings_record:
        patch_destination.fn()

    # Verify that calling the patched instance method still emits the expected warning
    assert len(warnings_record) == 1
    assert warnings_record[0].message.args[0] == "Test warning"
    assert warnings_record[0].category == UserWarning

    # Verify that nothing is printed to the stderr-backed MLflow event logger, which would indicate
    # rerouting of warning content
    assert not stream.getvalue()


def test_autolog_function_thread_safety(patch_destination):
    from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS

    AUTOLOGGING_INTEGRATIONS.pop("test_integration", None)

    def original_impl():
        pass

    patch_destination.fn = original_impl

    def patch_impl(original):
        original()

    @autologging_integration("test_integration")
    def test_autolog(disable=False, silent=False):
        time.sleep(0.2)
        safe_patch("test_integration", patch_destination, "fn", patch_impl)

    thread1 = threading.Thread(target=test_autolog, kwargs={"disable": False})
    thread1.start()
    time.sleep(0.1)
    thread2 = threading.Thread(target=test_autolog, kwargs={"disable": True})
    thread2.start()

    thread1.join()
    thread2.join()

    assert AUTOLOGGING_INTEGRATIONS["test_integration"]["disable"]
    assert patch_destination.fn is original_impl
```

--------------------------------------------------------------------------------

---[FILE: test_autologging_client.py]---
Location: mlflow-master/tests/autologging/test_autologging_client.py

```python
import time
from unittest import mock

import pytest

import mlflow
from mlflow import MlflowClient
from mlflow.exceptions import MlflowException
from mlflow.utils import _truncate_dict
from mlflow.utils.autologging_utils import MlflowAutologgingQueueingClient
from mlflow.utils.validation import (
    MAX_ENTITY_KEY_LENGTH,
    MAX_METRICS_PER_BATCH,
    MAX_PARAM_VAL_LENGTH,
    MAX_PARAMS_TAGS_PER_BATCH,
    MAX_TAG_VAL_LENGTH,
)


def get_run_data(run_id):
    client = MlflowClient()
    data = client.get_run(run_id).data
    # Ignore tags mlflow logs by default (e.g. "mlflow.user")
    tags = {k: v for k, v in data.tags.items() if not k.startswith("mlflow.")}
    return data.params, data.metrics, tags


def test_client_truncates_param_keys_and_values():
    client = MlflowAutologgingQueueingClient()
    params_to_log = {
        "a" * (MAX_ENTITY_KEY_LENGTH + 5): "b" * (MAX_PARAM_VAL_LENGTH + 5),
        "a" * (MAX_ENTITY_KEY_LENGTH + 50): "b" * (MAX_PARAM_VAL_LENGTH + 50),
    }

    with mlflow.start_run() as run:
        client.log_params(run_id=run.info.run_id, params=params_to_log)
        client.flush()

    run_params = get_run_data(run.info.run_id)[0]
    assert run_params == _truncate_dict(
        params_to_log,
        max_key_length=MAX_ENTITY_KEY_LENGTH,
        max_value_length=MAX_PARAM_VAL_LENGTH,
    )


def test_client_truncates_tag_keys_and_values():
    client = MlflowAutologgingQueueingClient()
    tags_to_log = {
        "a" * (MAX_ENTITY_KEY_LENGTH + 5): "b" * (MAX_PARAM_VAL_LENGTH + 5),
        "c" * (MAX_ENTITY_KEY_LENGTH + 50): "d" * (MAX_PARAM_VAL_LENGTH + 50),
    }

    with mlflow.start_run() as run:
        client.set_tags(run_id=run.info.run_id, tags=tags_to_log)
        client.flush()

    run_tags = get_run_data(run.info.run_id)[2]
    assert run_tags == _truncate_dict(
        tags_to_log,
        max_key_length=MAX_ENTITY_KEY_LENGTH,
        max_value_length=MAX_TAG_VAL_LENGTH,
    )


def test_client_truncates_metric_keys():
    client = MlflowAutologgingQueueingClient()
    metrics_to_log = {
        "a" * (MAX_ENTITY_KEY_LENGTH + 5): 1,
        "b" * (MAX_ENTITY_KEY_LENGTH + 50): 2,
    }

    with mlflow.start_run() as run:
        client.log_metrics(run_id=run.info.run_id, metrics=metrics_to_log)
        client.flush()

    run_metrics = get_run_data(run.info.run_id)[1]
    assert run_metrics == _truncate_dict(metrics_to_log, max_key_length=MAX_ENTITY_KEY_LENGTH)


def test_client_logs_expected_run_data():
    client = MlflowAutologgingQueueingClient()

    params_to_log = {
        f"param_key_{i}": f"param_val_{i}" for i in range((2 * MAX_PARAMS_TAGS_PER_BATCH) + 1)
    }
    tags_to_log = {
        f"tag_key_{i}": f"tag_val_{i}" for i in range((2 * MAX_PARAMS_TAGS_PER_BATCH) + 1)
    }
    metrics_to_log = {f"metric_key_{i}": i for i in range((4 * MAX_METRICS_PER_BATCH) + 1)}

    with mlflow.start_run(run_name="my name") as run:
        client.log_params(run_id=run.info.run_id, params=params_to_log)
        client.set_tags(run_id=run.info.run_id, tags=tags_to_log)
        client.log_metrics(run_id=run.info.run_id, metrics=metrics_to_log)
        client.flush()

    run_params, run_metrics, run_tags = get_run_data(run.info.run_id)
    assert run_params == params_to_log
    assert run_metrics == metrics_to_log
    assert run_tags == tags_to_log
    assert run.info.run_name == "my name"


def test_client_logs_metric_steps_correctly():
    client = MlflowAutologgingQueueingClient()

    with mlflow.start_run() as run:
        for step in range(3):
            client.log_metrics(run_id=run.info.run_id, metrics={"a": 1}, step=step)
        client.flush()

    metric_history = MlflowClient().get_metric_history(run_id=run.info.run_id, key="a")
    assert len(metric_history) == 3
    assert [metric.step for metric in metric_history] == list(range(3))


def test_client_run_creation_and_termination_are_successful():
    experiment_name = "test_run_creation_termination"
    MlflowClient().create_experiment(experiment_name)
    experiment_id = MlflowClient().get_experiment_by_name(experiment_name).experiment_id

    client = MlflowAutologgingQueueingClient()
    pending_run_id = client.create_run(experiment_id=experiment_id, start_time=5, tags={"a": "b"})
    client.set_terminated(run_id=pending_run_id, status="FINISHED", end_time=6)
    client.flush()

    runs = mlflow.search_runs(experiment_ids=[experiment_id], output_format="list")
    assert len(runs) == 1
    run = runs[0]
    assert run.info.start_time == 5
    assert run.info.end_time == 6
    assert run.info.status == "FINISHED"
    assert {"a": "b"}.items() <= run.data.tags.items()


def test_client_asynchronous_flush_operates_correctly():
    original_log_batch = MlflowClient().log_batch

    def mock_log_batch(run_id, metrics=(), params=(), tags=()):
        # Sleep to simulate a long-running logging operation
        time.sleep(3)
        return original_log_batch(run_id, metrics, params, tags)

    with mock.patch("mlflow.tracking.client.MlflowClient.log_batch") as log_batch_mock:
        log_batch_mock.side_effect = mock_log_batch

        with mlflow.start_run() as run:
            client = MlflowAutologgingQueueingClient()
            client.log_params(run_id=run.info.run_id, params={"a": "b"})
            run_operations = client.flush(synchronous=False)

            # Parameter data should not be available because the asynchronous logging
            # operation is still inflight
            logged_params_1 = get_run_data(run.info.run_id)[0]
            assert not logged_params_1

            run_operations.await_completion()

            # Parameter data should now be available after waiting for completion of the
            # asynchronous logging operation
            logged_params_2 = get_run_data(run.info.run_id)[0]
            assert logged_params_2 == {"a": "b"}


def test_client_synchronous_flush_operates_correctly():
    original_log_batch = MlflowClient().log_batch

    def mock_log_batch(run_id, metrics=(), params=(), tags=()):
        # Sleep to simulate a long-running logging operation
        time.sleep(3)
        return original_log_batch(run_id, metrics, params, tags)

    with mock.patch("mlflow.tracking.client.MlflowClient.log_batch") as log_batch_mock:
        log_batch_mock.side_effect = mock_log_batch

        with mlflow.start_run() as run:
            client = MlflowAutologgingQueueingClient()
            client.log_params(run_id=run.info.run_id, params={"a": "b"})
            client.flush(synchronous=True)

            # Parameter data should be available after the synchronous flush call returns
            logged_params = get_run_data(run.info.run_id)[0]
            assert logged_params == {"a": "b"}


def test_flush_clears_pending_operations():
    with mock.patch("mlflow.tracking.client.MlflowClient", autospec=True) as mlflow_client_mock:
        client = MlflowAutologgingQueueingClient()

        pending_run_id = client.create_run(experiment_id=5)
        client.log_params(run_id=pending_run_id, params={"a": "b"})
        client.log_metrics(run_id=pending_run_id, metrics={"c": 1})
        client.set_terminated(run_id=pending_run_id, status="FINISHED")
        client.flush()

        logging_call_count_1 = len(mlflow_client_mock.method_calls)
        # Verify that at least 3 calls have been made to MLflow logging APIs as a result
        # of the flush (i.e. log_batch, create_run, and set_terminated)
        assert logging_call_count_1 >= 3

        client.flush()

        logging_call_count_2 = len(mlflow_client_mock.method_calls)
        # Verify that performing a second flush did not result in any additional logging API calls,
        # since no new run content was added prior to the flush
        assert logging_call_count_2 == logging_call_count_1


def test_client_correctly_operates_as_context_manager_for_synchronous_flush():
    params_to_log = {"a": "b"}
    metrics_to_log = {"c": 1}
    tags_to_log = {"d": "e"}

    with mlflow.start_run(), MlflowAutologgingQueueingClient() as client:
        run_id_1 = mlflow.active_run().info.run_id
        client.log_params(run_id_1, params_to_log)
        client.log_metrics(run_id_1, metrics_to_log)
        client.set_tags(run_id_1, tags_to_log)

    run_params_1, run_metrics_1, run_tags_1 = get_run_data(run_id_1)
    assert run_params_1 == params_to_log
    assert run_metrics_1 == metrics_to_log
    assert run_tags_1 == tags_to_log

    exc_to_raise = Exception("test exception")
    with pytest.raises(Exception, match=str(exc_to_raise)) as raised_exc_info:  # noqa PT012
        with mlflow.start_run(), MlflowAutologgingQueueingClient() as client:
            run_id_2 = mlflow.active_run().info.run_id
            client.log_params(run_id_2, params_to_log)
            client.log_metrics(run_id_2, metrics_to_log)
            client.set_tags(run_id_2, tags_to_log)
            raise exc_to_raise

    assert raised_exc_info.value == exc_to_raise
    # Verify that no run content was logged because the context exited with an exception
    run_params_2, run_metrics_2, run_tags_2 = get_run_data(run_id_2)
    assert not run_params_2
    assert not run_metrics_2
    assert not run_tags_2


def test_logging_failures_are_handled_as_expected():
    experiment_name = "test_run_creation_termination"
    MlflowClient().create_experiment(experiment_name)
    experiment_id = MlflowClient().get_experiment_by_name(experiment_name).experiment_id

    with mock.patch("mlflow.tracking.client.MlflowClient.log_batch") as log_batch_mock:
        log_batch_mock.side_effect = Exception("Batch logging failed!")

        client = MlflowAutologgingQueueingClient()
        pending_run_id = client.create_run(experiment_id=experiment_id)
        client.log_metrics(run_id=pending_run_id, metrics={"a": 1})
        client.set_terminated(run_id=pending_run_id, status="KILLED")

        with pytest.raises(MlflowException, match="Batch logging failed!") as exc:
            client.flush()

        runs = mlflow.search_runs(experiment_ids=[experiment_id], output_format="list")
        assert len(runs) == 1
        run = runs[0]
        # Verify that metrics are absent due to the failure of batch logging
        assert not run.data.metrics
        # Verify that the run termination operation was still performed successfully
        assert run.info.status == "KILLED"

        assert (
            f"Failed to perform one or more operations on the run with ID {run.info.run_id}"
            in str(exc.value)
        )
        assert "Batch logging failed!" in str(exc.value)
```

--------------------------------------------------------------------------------

````
