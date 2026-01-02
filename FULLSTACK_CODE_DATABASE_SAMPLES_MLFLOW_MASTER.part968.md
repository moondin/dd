---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 968
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 968 of 991)

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

---[FILE: test_fluent_autolog.py]---
Location: mlflow-master/tests/tracking/fluent/test_fluent_autolog.py

```python
import contextlib
import inspect
import sys
from io import StringIO
from typing import Any, NamedTuple
from unittest import mock

import anthropic
import autogen
import boto3
import dspy
import google.genai
import groq
import keras
import langchain
import lightgbm
import lightning
import litellm
import llama_index.core
import mistralai
import openai
import pyspark
import pyspark.ml
import pytest
import pytorch_lightning
import setfit
import sklearn
import statsmodels
import tensorflow
import transformers
import xgboost

import mlflow
from mlflow.ml_package_versions import FLAVOR_TO_MODULE_NAME
from mlflow.utils.autologging_utils import (
    AutologgingEventLogger,
    autologging_is_disabled,
    get_autologging_config,
)

from tests.autologging.fixtures import (
    reset_stderr,  # noqa: F401
    test_mode_off,
    test_mode_on,
)
from tests.helper_functions import start_mock_openai_server

library_to_mlflow_module_without_spark_datasource = {
    tensorflow: mlflow.tensorflow,
    keras: mlflow.keras,
    sklearn: mlflow.sklearn,
    xgboost: mlflow.xgboost,
    lightgbm: mlflow.lightgbm,
    statsmodels: mlflow.statsmodels,
    pyspark.ml: mlflow.pyspark.ml,
    pytorch_lightning: mlflow.pytorch,
    lightning: mlflow.pytorch,
    transformers: mlflow.transformers,
    setfit: mlflow.transformers,
}

library_to_mlflow_module_genai = {
    openai: mlflow.openai,
    llama_index.core: mlflow.llama_index,
    langchain: mlflow.langchain,
    anthropic: mlflow.anthropic,
    dspy: mlflow.dspy,
    litellm: mlflow.litellm,
    google.genai: mlflow.gemini,
    boto3: mlflow.bedrock,
    groq: mlflow.groq,
    mistralai: mlflow.mistral,
    autogen: mlflow.ag2,
    # TODO: once Python 3.10 is introduced, enable smolagents
    # smolagents: mlflow.smolagents,
}

library_to_mlflow_module_traditional_ai = {
    **library_to_mlflow_module_without_spark_datasource,
    pyspark: mlflow.spark,
}

library_to_mlflow_module = {
    **library_to_mlflow_module_traditional_ai,
    **library_to_mlflow_module_genai,
}


@pytest.fixture(autouse=True)
def reset_global_states():
    from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS

    for value in AUTOLOGGING_INTEGRATIONS.values():
        value.clear()

    for integration_name in library_to_mlflow_module:
        try:
            del mlflow.utils.import_hooks._post_import_hooks[integration_name.__name__]
        except Exception:
            pass

    assert all(v == {} for v in AUTOLOGGING_INTEGRATIONS.values())
    assert mlflow.utils.import_hooks._post_import_hooks == {}

    yield

    for value in AUTOLOGGING_INTEGRATIONS.values():
        value.clear()

    for integration_name in library_to_mlflow_module:
        try:
            del mlflow.utils.import_hooks._post_import_hooks[integration_name.__name__]
        except Exception:
            pass

    # TODO: Remove these when we run ci with Python >= 3.10
    mlflow.utils.import_hooks._post_import_hooks.pop("smolagents", None)
    mlflow.utils.import_hooks._post_import_hooks.pop("pydantic_ai", None)
    mlflow.utils.import_hooks._post_import_hooks.pop("crewai", None)
    mlflow.utils.import_hooks._post_import_hooks.pop("autogen_agentchat", None)
    mlflow.utils.import_hooks._post_import_hooks.pop("semantic_kernel", None)
    mlflow.utils.import_hooks._post_import_hooks.pop("agno", None)
    mlflow.utils.import_hooks._post_import_hooks.pop("strands", None)
    mlflow.utils.import_hooks._post_import_hooks.pop("haystack", None)
    # TODO: Remove this line when we stop supporting google.generativeai
    mlflow.utils.import_hooks._post_import_hooks.pop("google.generativeai", None)

    assert all(v == {} for v in AUTOLOGGING_INTEGRATIONS.values())
    assert mlflow.utils.import_hooks._post_import_hooks == {}


# We are pretending the module is not already imported (in reality it is, at the top of this file),
#   and is only imported when we call wrapt.notify_module_loaded in the tests below. Normally,
#   notify_module_loaded would be called by register_post_import_hook if it sees that the module
#   is already loaded.
def only_register(callback_fn, module, overwrite):
    mlflow.utils.import_hooks._post_import_hooks[module] = [callback_fn]


@pytest.fixture(autouse=True)
def disable_new_import_hook_firing_if_module_already_exists(request):
    if "do_not_disable_new_import_hook_firing_if_module_already_exists" in request.keywords:
        yield
    else:
        with mock.patch("mlflow.tracking.fluent.register_post_import_hook", wraps=only_register):
            yield


@pytest.mark.usefixtures(test_mode_off.__name__)
@pytest.mark.parametrize(("library", "mlflow_module"), library_to_mlflow_module.items())
def test_universal_autolog_does_not_throw_if_specific_autolog_throws_in_standard_mode(
    library, mlflow_module
):
    # In this file mock is conflicting with lazy loading. Call the module to avoid errors.
    # TODO(chenmoneygithub): investigate why this is happening and remove the call.
    mlflow_module.autolog
    with mock.patch(mlflow_module.__name__ + ".autolog") as autolog_mock:
        autolog_mock.side_effect = Exception("asdf")
        mlflow.autolog()
        if library not in (pyspark, pyspark.ml):
            autolog_mock.assert_not_called()

        mlflow.utils.import_hooks.notify_module_loaded(library)
        autolog_mock.assert_called_once()


@pytest.mark.usefixtures(test_mode_on.__name__)
@pytest.mark.parametrize(("library", "mlflow_module"), library_to_mlflow_module.items())
def test_universal_autolog_throws_if_specific_autolog_throws_in_test_mode(library, mlflow_module):
    with mock.patch(mlflow_module.__name__ + ".autolog") as autolog_mock:
        autolog_mock.side_effect = Exception("asdf")

        mlflow.autolog()
        with pytest.raises(Exception, match="asdf"):
            mlflow.utils.import_hooks.notify_module_loaded(library)

        autolog_mock.assert_called_once()


@pytest.mark.parametrize(("library", "mlflow_module"), library_to_mlflow_module.items())
def test_universal_autolog_calls_specific_autologs_correctly(library, mlflow_module):
    integrations_with_additional_config = [xgboost, lightgbm, sklearn]
    args_to_test = {
        "log_models": False,
        "log_datasets": False,
        "log_traces": False,
        "disable": True,
        "exclusive": True,
        "disable_for_unsupported_versions": True,
        "silent": True,
    }
    if library in integrations_with_additional_config:
        args_to_test.update({"log_input_examples": True, "log_model_signatures": True})

    mlflow.autolog(**args_to_test)

    mlflow.utils.import_hooks.notify_module_loaded(library)
    params_to_check = set(inspect.signature(mlflow_module.autolog).parameters) & set(args_to_test)

    for arg_key in params_to_check:
        assert (
            get_autologging_config(mlflow_module.autolog.integration_name, arg_key, None)
            == args_to_test[arg_key]
        )


@pytest.mark.parametrize("is_databricks", [False, True])
@pytest.mark.parametrize("disable", [False, True])
def test_genai_auto_logging(is_databricks, disable):
    with mock.patch("mlflow.tracking.fluent.is_in_databricks_runtime", return_value=is_databricks):
        mlflow.autolog(disable=disable)

    for library, mlflow_module in library_to_mlflow_module_traditional_ai.items():
        mlflow.utils.import_hooks.notify_module_loaded(library)
        assert get_autologging_config(mlflow_module.autolog.integration_name, "disable") == disable

    # Auto logging for GenAI libraries should be disabled when disable=False on Databricks
    expected = None if is_databricks and (not disable) else disable
    for library, mlflow_module in library_to_mlflow_module_genai.items():
        mlflow.utils.import_hooks.notify_module_loaded(library)
        assert get_autologging_config(mlflow_module.autolog.integration_name, "disable") == expected


def test_universal_autolog_calls_pyspark_immediately_in_databricks():
    with mock.patch("mlflow.tracking.fluent.is_in_databricks_runtime", return_value=True):
        mlflow.autolog()
        assert not autologging_is_disabled(mlflow.spark.FLAVOR_NAME)

        mlflow.autolog(disable=True)
        assert autologging_is_disabled(mlflow.spark.FLAVOR_NAME)

        mlflow.autolog(disable=False)
        assert not autologging_is_disabled(mlflow.spark.FLAVOR_NAME)

        with mock.patch("mlflow.spark.autolog", wraps=mlflow.spark.autolog) as autolog_mock:
            # there should be no import hook on pyspark since autologging was already
            # applied to an active spark session
            mlflow.utils.import_hooks.notify_module_loaded(pyspark)
            autolog_mock.assert_not_called()


@pytest.mark.parametrize("config", [{"disable": False}, {"disable": True}])
def test_universal_autolog_attaches_pyspark_import_hook_in_non_databricks(config):
    with mock.patch(
        "mlflow.spark.autolog", wraps=mlflow.spark.autolog, autospec=True
    ) as autolog_mock:
        autolog_mock.integration_name = "spark"

        mlflow.autolog(**config)
        autolog_mock.assert_not_called()

        mlflow.utils.import_hooks.notify_module_loaded(pyspark)

        # assert autolog is called once pyspark is imported
        autolog_mock.assert_called_once_with(**config, silent=False)


def test_universal_autolog_makes_expected_event_logging_calls():
    class TestLogger(AutologgingEventLogger):
        class LoggerCall(NamedTuple):
            integration: Any
            call_args: Any
            call_kwargs: Any

        def __init__(self):
            self.calls = []

        def reset(self):
            self.calls = []

        def log_autolog_called(self, integration, call_args, call_kwargs):
            self.calls.append(TestLogger.LoggerCall(integration, call_args, call_kwargs))

    logger = TestLogger()
    AutologgingEventLogger.set_logger(logger)

    mlflow.autolog(exclusive=True, disable=True)

    universal_autolog_event_logging_calls = [
        call for call in logger.calls if call.integration == "mlflow"
    ]
    assert len(universal_autolog_event_logging_calls) == 1
    call = universal_autolog_event_logging_calls[0]
    assert call.integration == "mlflow"
    assert {"disable": True, "exclusive": True}.items() <= call.call_kwargs.items()


def test_autolog_obeys_disabled():
    from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS

    mlflow.autolog(disable=True)
    mlflow.utils.import_hooks.notify_module_loaded(sklearn)
    assert get_autologging_config("sklearn", "disable")

    mlflow.autolog()
    mlflow.utils.import_hooks.notify_module_loaded(sklearn)
    mlflow.autolog(disable=True)
    mlflow.utils.import_hooks.notify_module_loaded(sklearn)
    assert get_autologging_config("sklearn", "disable")

    mlflow.autolog(disable=False)
    mlflow.utils.import_hooks.notify_module_loaded(sklearn)
    assert not get_autologging_config("sklearn", "disable")
    mlflow.sklearn.autolog(disable=True)
    assert get_autologging_config("sklearn", "disable")

    AUTOLOGGING_INTEGRATIONS.clear()
    mlflow.autolog(disable_for_unsupported_versions=False)
    mlflow.utils.import_hooks.notify_module_loaded(sklearn)
    assert not get_autologging_config("sklearn", "disable_for_unsupported_versions")
    mlflow.autolog(disable_for_unsupported_versions=True)
    mlflow.utils.import_hooks.notify_module_loaded(sklearn)
    assert get_autologging_config("sklearn", "disable_for_unsupported_versions")

    mlflow.sklearn.autolog(disable_for_unsupported_versions=False)
    assert not get_autologging_config("sklearn", "disable_for_unsupported_versions")
    mlflow.sklearn.autolog(disable_for_unsupported_versions=True)
    assert get_autologging_config("sklearn", "disable_for_unsupported_versions")


def test_autolog_success_message_obeys_disabled():
    with mock.patch("mlflow.tracking.fluent._logger.info") as autolog_logger_mock:
        mlflow.autolog(disable=True)
        mlflow.utils.import_hooks.notify_module_loaded(sklearn)
        autolog_logger_mock.assert_not_called()

        mlflow.autolog()
        mlflow.utils.import_hooks.notify_module_loaded(sklearn)
        autolog_logger_mock.assert_called()

        autolog_logger_mock.reset_mock()

        mlflow.autolog(disable=False)
        mlflow.utils.import_hooks.notify_module_loaded(sklearn)
        autolog_logger_mock.assert_called()


# Currently some GenAI integrations do not fully follow standard autolog annotation
@pytest.mark.parametrize("library", library_to_mlflow_module_traditional_ai.keys())
@pytest.mark.parametrize("disable", [False, True])
@pytest.mark.parametrize("exclusive", [False, True])
@pytest.mark.parametrize("disable_for_unsupported_versions", [False, True])
@pytest.mark.parametrize("log_models", [False, True])
@pytest.mark.parametrize("log_datasets", [False, True])
@pytest.mark.parametrize("log_input_examples", [False, True])
@pytest.mark.parametrize("log_model_signatures", [False, True])
def test_autolog_obeys_silent_mode(
    library,
    disable,
    exclusive,
    disable_for_unsupported_versions,
    log_models,
    log_datasets,
    log_input_examples,
    log_model_signatures,
):
    stream = StringIO()
    sys.stderr = stream

    mlflow.autolog(
        silent=True,
        disable=disable,
        exclusive=exclusive,
        disable_for_unsupported_versions=disable_for_unsupported_versions,
        log_models=log_models,
        log_datasets=log_datasets,
        log_input_examples=log_input_examples,
        log_model_signatures=log_model_signatures,
    )

    mlflow.utils.import_hooks.notify_module_loaded(library)

    assert not stream.getvalue()


@pytest.mark.do_not_disable_new_import_hook_firing_if_module_already_exists
def test_last_active_run_retrieves_autologged_run():
    from sklearn.ensemble import RandomForestRegressor

    mlflow.autolog()
    rf = RandomForestRegressor(n_estimators=1, max_depth=1, max_features=1)
    rf.fit([[1, 2]], [[3]])
    rf.predict([[2, 1]])

    autolog_run = mlflow.last_active_run()
    assert autolog_run is not None
    assert autolog_run.info.run_id is not None


@pytest.mark.do_not_disable_new_import_hook_firing_if_module_already_exists
def test_extra_tags_mlflow_autolog():
    from sklearn.ensemble import RandomForestRegressor

    from mlflow.exceptions import MlflowException
    from mlflow.utils.mlflow_tags import MLFLOW_AUTOLOGGING

    mlflow.autolog(extra_tags={"test_tag": "autolog", MLFLOW_AUTOLOGGING: "123"})
    rf = RandomForestRegressor(n_estimators=1, max_depth=1, max_features=1)
    rf.fit([[1, 2]], [[3]])
    autolog_run = mlflow.last_active_run()
    assert autolog_run.data.tags["test_tag"] == "autolog"
    assert autolog_run.data.tags[MLFLOW_AUTOLOGGING] == "sklearn"

    with pytest.raises(MlflowException, match="Invalid `extra_tags` type"):
        mlflow.autolog(extra_tags="test_tag")


@pytest.mark.parametrize(("library", "mlflow_module"), library_to_mlflow_module.items())
def test_autolog_excluded_flavors(library, mlflow_module):
    mlflow.autolog(exclude_flavors=[mlflow_module.__name__.removeprefix("mlflow.")])
    mlflow.utils.import_hooks.notify_module_loaded(library)

    assert get_autologging_config(mlflow_module.autolog.integration_name, "disable") is None


# Tests for auto tracing
@pytest.fixture
def mock_openai(monkeypatch):
    with start_mock_openai_server() as base_url:
        monkeypatch.setenv("OPENAI_API_KEY", "test")
        monkeypatch.setenv("OPENAI_API_BASE", base_url)
        yield base_url


@pytest.fixture(params=[True, False])
def other_library_present(request):
    if request.param:
        yield
    else:
        with mock.patch.dict(sys.modules, {"openai": openai}):
            yield


@pytest.mark.parametrize("is_databricks", [False, True])
@pytest.mark.parametrize("disable", [False, True])
def test_autolog_genai_auto_tracing(mock_openai, is_databricks, disable, other_library_present):
    with mock.patch("mlflow.tracking.fluent.is_in_databricks_runtime", return_value=is_databricks):
        mlflow.autolog(disable=disable)
    mlflow.utils.import_hooks.notify_module_loaded(openai)
    client = openai.OpenAI(api_key="test", base_url=mock_openai)
    client.completions.create(
        prompt="test",
        model="gpt-4o-mini",
        temperature=0,
    )

    # GenAI should not be enabled by mlflow.autolog even if disable=False on Databricks
    if is_databricks or disable:
        trace = mlflow.get_trace(mlflow.get_last_active_trace_id())
        assert trace is None
    else:
        trace = mlflow.get_trace(mlflow.get_last_active_trace_id())
        assert trace is not None
        assert trace.info.status == "OK"
        assert len(trace.data.spans) == 1
        span = trace.data.spans[0]
        assert span.inputs == {"prompt": "test", "model": "gpt-4o-mini", "temperature": 0}
        assert span.outputs["id"] == "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7"


@contextlib.contextmanager
def reset_module_import():
    """
    Temporarily reset the module import state to simulate the module being not imported.
    """
    original_modules = {}
    for module_name in FLAVOR_TO_MODULE_NAME.values():
        original_modules[module_name] = sys.modules.get(module_name)

    try:
        yield
    finally:
        for module_name, original_module in original_modules.items():
            if original_module is not None:
                sys.modules[module_name] = original_module


@pytest.mark.parametrize("flavor_and_module", FLAVOR_TO_MODULE_NAME.items())
@pytest.mark.parametrize("disable", [False, True])
@pytest.mark.do_not_disable_new_import_hook_firing_if_module_already_exists
def test_autolog_genai_import(disable, flavor_and_module):
    flavor, module = flavor_and_module

    # pytorch-lightning is not valid flavor name.
    # paddle autologging is not in the list of autologging integrations.
    # crewai, smolagents, and semantic_kernel require Python 3.10+ (our CI runs on Python 3.9).
    if flavor in {
        "pytorch-lightning",
        "paddle",
        "crewai",
        "smolagents",
        "pydantic_ai",
        "autogen",
        "semantic_kernel",
        "agno",
        "strands",
        "haystack",
    }:
        return

    with reset_module_import():
        mlflow.autolog(disable=disable)

        __import__(module)

        assert get_autologging_config(flavor, "disable") == disable
```

--------------------------------------------------------------------------------

---[FILE: test_metric_value_conversion_utils.py]---
Location: mlflow-master/tests/tracking/fluent/test_metric_value_conversion_utils.py

```python
import numpy as np
import pytest

import mlflow
from mlflow import tracking
from mlflow.exceptions import INVALID_PARAMETER_VALUE, ErrorCode, MlflowException
from mlflow.tracking.fluent import start_run
from mlflow.tracking.metric_value_conversion_utils import convert_metric_value_to_float_if_possible

from tests.helper_functions import random_int


def test_reraised_value_errors():
    multi_item_array = np.random.rand(2, 2)

    with pytest.raises(MlflowException, match=r"Failed to convert metric value to float") as e:
        convert_metric_value_to_float_if_possible(multi_item_array)

    assert e.value.error_code == ErrorCode.Name(INVALID_PARAMETER_VALUE)


def test_convert_metric_value_to_float():
    float_metric_val = float(random_int(10, 50))

    assert convert_metric_value_to_float_if_possible(float_metric_val) == float_metric_val

    ndarray_val = np.random.rand(1)
    assert convert_metric_value_to_float_if_possible(ndarray_val) == float(ndarray_val[0])


def test_log_np_array_as_metric():
    ndarray_val = np.random.rand(1)
    ndarray_float_val = float(ndarray_val[0])

    with start_run() as run:
        mlflow.log_metric("name_numpy", ndarray_val)

    finished_run = tracking.MlflowClient().get_run(run.info.run_id)
    assert finished_run.data.metrics == {"name_numpy": ndarray_float_val}
```

--------------------------------------------------------------------------------

---[FILE: test_registry.py]---
Location: mlflow-master/tests/tracking/request_auth/test_registry.py

```python
from importlib import reload
from unittest import mock

import pytest

import mlflow.tracking.request_auth.registry
from mlflow.tracking.request_auth.registry import RequestAuthProviderRegistry, fetch_auth


def test_request_auth_provider_registry_register():
    provider_class = mock.Mock()

    registry = RequestAuthProviderRegistry()
    registry.register(provider_class)

    assert set(registry) == {provider_class.return_value}


def test_request_auth_provider_registry_register_entrypoints():
    provider_class = mock.Mock()
    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.return_value = provider_class

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        registry = RequestAuthProviderRegistry()
        registry.register_entrypoints()

    assert set(registry) == {provider_class.return_value}
    mock_entrypoint.load.assert_called_once_with()
    mock_get_group_all.assert_called_once_with("mlflow.request_auth_provider")


@pytest.mark.parametrize(
    "exception", [AttributeError("test exception"), ImportError("test exception")]
)
def test_request_auth_provider_registry_register_entrypoints_handles_exception(exception):
    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.side_effect = exception

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        registry = RequestAuthProviderRegistry()
        # Check that the raised warning contains the message from the original exception
        with pytest.warns(UserWarning, match="test exception"):
            registry.register_entrypoints()

    mock_entrypoint.load.assert_called_once_with()
    mock_get_group_all.assert_called_once_with("mlflow.request_auth_provider")


def test_registry_instance_loads_entrypoints():
    class MockRequestAuthProvider:
        pass

    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.return_value = MockRequestAuthProvider

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        # Entrypoints are registered at import time, so we need to reload the module to register the
        # entrypoint given by the mocked entrypoints.get_group_all
        reload(mlflow.tracking.request_auth.registry)

    assert MockRequestAuthProvider in _currently_registered_request_auth_provider_classes()
    mock_get_group_all.assert_called_once_with("mlflow.request_auth_provider")


def _currently_registered_request_auth_provider_classes():
    return {
        provider.__class__
        for provider in mlflow.tracking.request_auth.registry._request_auth_provider_registry
    }


def test_run_context_provider_registry_with_installed_plugin():
    reload(mlflow.tracking.request_auth.registry)

    from mlflow_test_plugin.request_auth_provider import PluginRequestAuthProvider

    assert PluginRequestAuthProvider in _currently_registered_request_auth_provider_classes()

    auth_provider_name = "test_auth_provider_name"
    assert fetch_auth(auth_provider_name)["auth_name"] == "test_auth_provider_name"


def test_fetch_auth():
    reload(mlflow.tracking.request_auth.registry)
    auth_provider_name = "test_auth_provider_name"
    assert fetch_auth(auth_provider_name)["auth_name"] == auth_provider_name
```

--------------------------------------------------------------------------------

---[FILE: test_databricks_request_header_provider.py]---
Location: mlflow-master/tests/tracking/request_header/test_databricks_request_header_provider.py

```python
import itertools
from unittest import mock

import pytest

from mlflow.tracking.request_header.databricks_request_header_provider import (
    DatabricksRequestHeaderProvider,
)

bool_values = [True, False]


@pytest.mark.parametrize(
    ("is_in_databricks_notebook", "is_in_databricks_job", "is_in_cluster"),
    itertools.product(bool_values, bool_values, bool_values),
)
def test_databricks_request_header_provider_in_context(
    is_in_databricks_notebook, is_in_databricks_job, is_in_cluster
):
    with (
        mock.patch(
            "mlflow.utils.databricks_utils.is_in_databricks_notebook",
            return_value=is_in_databricks_notebook,
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.is_in_databricks_job", return_value=is_in_databricks_job
        ),
        mock.patch("mlflow.utils.databricks_utils.is_in_cluster", return_value=is_in_cluster),
    ):
        assert (
            DatabricksRequestHeaderProvider().in_context() == is_in_databricks_notebook
            or is_in_databricks_job
            or is_in_cluster
        )


# test that request_headers returns whatever is available
@pytest.mark.parametrize(
    ("is_in_databricks_notebook", "is_in_databricks_job", "is_in_cluster"),
    itertools.product(bool_values, bool_values, bool_values),
)
def test_databricks_request_header_provider_request_headers(
    is_in_databricks_notebook, is_in_databricks_job, is_in_cluster
):
    with (
        mock.patch(
            "mlflow.utils.databricks_utils.is_in_databricks_notebook",
            return_value=is_in_databricks_notebook,
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.is_in_databricks_job", return_value=is_in_databricks_job
        ),
        mock.patch("mlflow.utils.databricks_utils.is_in_cluster", return_value=is_in_cluster),
        mock.patch("mlflow.utils.databricks_utils.get_notebook_id") as notebook_id_mock,
        mock.patch("mlflow.utils.databricks_utils.get_job_id") as job_id_mock,
        mock.patch("mlflow.utils.databricks_utils.get_job_run_id") as job_run_id_mock,
        mock.patch("mlflow.utils.databricks_utils.get_job_type") as job_type_mock,
        mock.patch("mlflow.utils.databricks_utils.get_cluster_id") as cluster_id_mock,
        mock.patch("mlflow.utils.databricks_utils.get_command_run_id") as command_run_id_mock,
        mock.patch("mlflow.utils.databricks_utils.get_workload_id") as workload_id_mock,
        mock.patch("mlflow.utils.databricks_utils.get_workload_class") as workload_class_mock,
    ):
        request_headers = DatabricksRequestHeaderProvider().request_headers()

        if is_in_databricks_notebook:
            assert request_headers["notebook_id"] == notebook_id_mock.return_value
        else:
            assert "notebook_id" not in request_headers

        if is_in_databricks_job:
            assert request_headers["job_id"] == job_id_mock.return_value
            assert request_headers["job_run_id"] == job_run_id_mock.return_value
            assert request_headers["job_type"] == job_type_mock.return_value
        else:
            assert "job_id" not in request_headers
            assert "job_run_id" not in request_headers
            assert "job_type" not in request_headers

        if is_in_cluster:
            assert request_headers["cluster_id"] == cluster_id_mock.return_value
        else:
            assert "cluster_id" not in request_headers

        if command_run_id_mock.return_value is not None:
            assert request_headers["command_run_id"] == command_run_id_mock.return_value
        else:
            assert "command_run_id" not in request_headers

        if workload_id_mock.return_value is not None:
            assert request_headers["workload_id"] == workload_id_mock.return_value
        else:
            assert "workload_id" not in request_headers

        if workload_class_mock.return_value is not None:
            assert request_headers["workload_class"] == workload_class_mock.return_value
        else:
            assert "workload_class" not in request_headers
```

--------------------------------------------------------------------------------

---[FILE: test_default_request_header_provider.py]---
Location: mlflow-master/tests/tracking/request_header/test_default_request_header_provider.py

```python
from mlflow.tracking.request_header.default_request_header_provider import (
    _DEFAULT_HEADERS,
    DefaultRequestHeaderProvider,
)


def test_default_request_header_provider_in_context():
    assert DefaultRequestHeaderProvider().in_context()


def test_default_request_header_provider_request_headers():
    request_headers = DefaultRequestHeaderProvider().request_headers()
    assert request_headers == _DEFAULT_HEADERS
```

--------------------------------------------------------------------------------

---[FILE: test_registry.py]---
Location: mlflow-master/tests/tracking/request_header/test_registry.py

```python
from importlib import reload
from unittest import mock

import pytest

import mlflow.tracking.request_header.registry
from mlflow.tracking.request_header.databricks_request_header_provider import (
    DatabricksRequestHeaderProvider,
)
from mlflow.tracking.request_header.registry import (
    RequestHeaderProviderRegistry,
    resolve_request_headers,
)


@pytest.fixture(autouse=True)
def reload_registry():
    yield
    reload(mlflow.tracking.request_header.registry)


def test_request_header_context_provider_registry_register():
    provider_class = mock.Mock()

    registry = RequestHeaderProviderRegistry()
    registry.register(provider_class)

    assert set(registry) == {provider_class.return_value}


def test_request_header_provider_registry_register_entrypoints():
    provider_class = mock.Mock()
    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.return_value = provider_class

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        registry = RequestHeaderProviderRegistry()
        registry.register_entrypoints()

    assert set(registry) == {provider_class.return_value}
    mock_entrypoint.load.assert_called_once_with()
    mock_get_group_all.assert_called_once_with("mlflow.request_header_provider")


@pytest.mark.parametrize(
    "exception", [AttributeError("test exception"), ImportError("test exception")]
)
def test_request_header_provider_registry_register_entrypoints_handles_exception(exception):
    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.side_effect = exception

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        registry = RequestHeaderProviderRegistry()
        # Check that the raised warning contains the message from the original exception
        with pytest.warns(UserWarning, match="test exception"):
            registry.register_entrypoints()

    mock_entrypoint.load.assert_called_once_with()
    mock_get_group_all.assert_called_once_with("mlflow.request_header_provider")


def _currently_registered_request_header_provider_classes():
    return {
        provider.__class__
        for provider in mlflow.tracking.request_header.registry._request_header_provider_registry
    }


def test_registry_instance_defaults():
    expected_classes = {DatabricksRequestHeaderProvider}
    assert expected_classes.issubset(_currently_registered_request_header_provider_classes())


def test_registry_instance_loads_entrypoints():
    class MockRequestHeaderProvider:
        pass

    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.return_value = MockRequestHeaderProvider

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        # Entrypoints are registered at import time, so we need to reload the module to register the
        # entrypoint given by the mocked entrypoints.get_group_all
        reload(mlflow.tracking.request_header.registry)

    assert MockRequestHeaderProvider in _currently_registered_request_header_provider_classes()
    mock_get_group_all.assert_called_once_with("mlflow.request_header_provider")


def test_run_context_provider_registry_with_installed_plugin():
    reload(mlflow.tracking.request_header.registry)

    from mlflow_test_plugin.request_header_provider import PluginRequestHeaderProvider

    assert PluginRequestHeaderProvider in _currently_registered_request_header_provider_classes()

    # The test plugin's request header provider always returns False from in_context to avoid
    # polluting request headers in developers' environments. The following mock overrides this to
    # perform the integration test.
    with mock.patch.object(PluginRequestHeaderProvider, "in_context", return_value=True):
        assert resolve_request_headers()["test"] == "header"


@pytest.fixture
def mock_request_header_providers():
    base_provider = mock.Mock()
    base_provider.in_context.return_value = True
    base_provider.request_headers.return_value = {
        "one": "one-val",
        "two": "two-val",
        "three": "three-val",
    }

    skipped_provider = mock.Mock()
    skipped_provider.in_context.return_value = False

    exception_provider = mock.Mock()
    exception_provider.in_context.return_value = True
    exception_provider.request_headers.return_value = {
        "random-header": "This val will never make it to header resolution"
    }
    exception_provider.request_headers.side_effect = Exception(
        "This should be caught by logic in resolve_request_headers()"
    )

    override_provider = mock.Mock()
    override_provider.in_context.return_value = True
    override_provider.request_headers.return_value = {"one": "override", "new": "new-val"}

    providers = [base_provider, skipped_provider, exception_provider, override_provider]

    with mock.patch(
        "mlflow.tracking.request_header.registry._request_header_provider_registry", providers
    ):
        yield

    skipped_provider.tags.assert_not_called()


def test_resolve_request_headers(mock_request_header_providers):
    request_headers_arg = {"two": "arg-override", "arg": "arg-val"}
    assert resolve_request_headers(request_headers_arg) == {
        "one": "one-val override",
        "two": "arg-override",
        "three": "three-val",
        "new": "new-val",
        "arg": "arg-val",
    }


def test_resolve_request_headers_no_arg(mock_request_header_providers):
    assert resolve_request_headers() == {
        "one": "one-val override",
        "two": "two-val",
        "three": "three-val",
        "new": "new-val",
    }
```

--------------------------------------------------------------------------------

````
