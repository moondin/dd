---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 781
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 781 of 991)

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

---[FILE: test_deployments.py]---
Location: mlflow-master/tests/deployments/test_deployments.py

```python
from unittest import mock

import pytest

from mlflow import deployments
from mlflow.deployments.plugin_manager import DeploymentPlugins
from mlflow.exceptions import MlflowException

f_model_uri = "fake_model_uri"
f_endpoint_name = "fake_endpoint_name"
f_deployment_id = "fake_deployment_name"
f_flavor = "fake_flavor"
f_target = "faketarget"


def test_create_success():
    client = deployments.get_deploy_client(f_target)
    ret = client.create_deployment(f_deployment_id, f_model_uri, f_flavor, config={})
    assert isinstance(ret, dict)
    assert ret["name"] == f_deployment_id
    assert ret["flavor"] == f_flavor

    ret2 = client.create_deployment(f_deployment_id, f_model_uri)
    assert ret2["flavor"] is None


def test_delete_success():
    client = deployments.get_deploy_client(f_target)
    assert client.delete_deployment(f_deployment_id) is None


def test_update_success():
    client = deployments.get_deploy_client(f_target)
    res = client.update_deployment(f_deployment_id, f_model_uri, f_flavor)
    assert res["flavor"] == f_flavor


def test_list_success():
    client = deployments.get_deploy_client(f_target)
    ret = client.list_deployments()
    assert ret[0]["name"] == f_deployment_id


def test_get_success():
    client = deployments.get_deploy_client(f_target)
    ret = client.get_deployment(f_deployment_id)
    assert ret["key1"] == "val1"


def test_endpoint_create_success():
    client = deployments.get_deploy_client(f_target)
    endpoint = client.create_endpoint(f_endpoint_name)
    assert isinstance(endpoint, dict)
    assert endpoint["name"] == f_endpoint_name


def test_endpoint_delete_success():
    client = deployments.get_deploy_client(f_target)
    assert client.delete_endpoint(f_endpoint_name) is None


def test_endpoint_update_success():
    client = deployments.get_deploy_client(f_target)
    assert client.update_endpoint(f_endpoint_name) is None


def test_endpoint_list_success():
    client = deployments.get_deploy_client(f_target)
    endpoints = client.list_endpoints()
    assert endpoints[0]["name"] == f_endpoint_name


def test_endpoint_get_success():
    client = deployments.get_deploy_client(f_target)
    endpoint = client.get_endpoint(f_endpoint_name)
    assert endpoint["name"] == f_endpoint_name


def test_wrong_target_name():
    with pytest.raises(
        MlflowException, match='No plugin found for managing model deployments to "wrong_target"'
    ):
        deployments.get_deploy_client("wrong_target")


def test_plugin_doesnot_have_required_attrib():
    class DummyPlugin:
        pass

    dummy_plugin = DummyPlugin()
    plugin_manager = DeploymentPlugins()
    plugin_manager.registry["dummy"] = dummy_plugin
    with pytest.raises(MlflowException, match="Plugin registered for the target dummy"):
        plugin_manager["dummy"]


def test_plugin_raising_error(monkeypatch):
    client = deployments.get_deploy_client(f_target)
    # special case to raise error
    monkeypatch.setenv("raiseError", "True")
    with pytest.raises(RuntimeError, match="Error requested"):
        client.list_deployments()


def test_target_uri_parsing():
    deployments.get_deploy_client(f_target)
    deployments.get_deploy_client(f"{f_target}:/somesuffix")
    deployments.get_deploy_client(f"{f_target}://somesuffix")


def test_explain_with_no_target_implementation():
    from mlflow_test_plugin import fake_deployment_plugin

    mock_error = MlflowException("MOCK ERROR")
    target_client = deployments.get_deploy_client(f_target)
    plugin = fake_deployment_plugin.PluginDeploymentClient
    with mock.patch.object(plugin, "explain", return_value=mock_error) as mock_explain:
        res = target_client.explain(f_target, "test")
        assert type(res) == MlflowException
        mock_explain.assert_called_once()


def test_explain_with_target_implementation():
    target_client = deployments.get_deploy_client(f_target)
    res = target_client.explain(f_target, "test")
    assert res == "1"
```

--------------------------------------------------------------------------------

---[FILE: test_interface.py]---
Location: mlflow-master/tests/deployments/test_interface.py

```python
import pytest

import mlflow.deployments.utils
from mlflow.deployments.interface import get_deploy_client

mlflow.deployments.utils._deployments_target = None


def test_get_deploy_client_no_args():
    mlflow.deployments.utils._deployments_target = None
    assert get_deploy_client() is None


def test_get_deploy_client_none():
    mlflow.deployments.utils._deployments_target = None
    assert get_deploy_client(None) is None


def test_get_deploy_client_from_set_deployments_target():
    from mlflow.deployments import set_deployments_target

    set_deployments_target("databricks")
    assert get_deploy_client(None) is not None


@pytest.fixture
def set_deployment_envs(monkeypatch):
    monkeypatch.setenv("MLFLOW_DEPLOYMENTS_TARGET", "databricks")


def test_get_deploy_client_from_env(set_deployment_envs):
    assert get_deploy_client(None) is not None
```

--------------------------------------------------------------------------------

---[FILE: test_utils.py]---
Location: mlflow-master/tests/deployments/test_utils.py

```python
import pytest

from mlflow.deployments.utils import (
    get_deployments_target,
    set_deployments_target,
)
from mlflow.exceptions import MlflowException


def test_set_deployments_target(monkeypatch):
    monkeypatch.setattr("mlflow.deployments.utils._deployments_target", None)

    valid_target = "databricks"
    set_deployments_target(valid_target)
    assert get_deployments_target() == valid_target

    valid_uri = "http://localhost"
    set_deployments_target(valid_uri)
    assert get_deployments_target() == valid_uri

    invalid_uri = "localhost"
    with pytest.raises(
        MlflowException, match="The target provided is not a valid uri or 'databricks'"
    ):
        set_deployments_target(invalid_uri)


def test_get_deployments_target(monkeypatch):
    monkeypatch.setattr("mlflow.deployments.utils._deployments_target", None)
    monkeypatch.delenv("MLFLOW_DEPLOYMENTS_TARGET", raising=False)

    with pytest.raises(MlflowException, match="No deployments target has been set"):
        get_deployments_target()

    valid_uri = "http://localhost"
    monkeypatch.setattr("mlflow.deployments.utils._deployments_target", valid_uri)
    assert get_deployments_target() == valid_uri

    monkeypatch.delenv("MLFLOW_DEPLOYMENTS_TARGET", raising=False)
    set_deployments_target(valid_uri)
    assert get_deployments_target() == valid_uri
```

--------------------------------------------------------------------------------

---[FILE: test_databricks.py]---
Location: mlflow-master/tests/deployments/databricks/test_databricks.py

```python
import os
import warnings
from unittest import mock

import pytest

from mlflow.deployments import get_deploy_client
from mlflow.exceptions import MlflowException


@pytest.fixture(autouse=True)
def mock_databricks_credentials(monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "https://test.cloud.databricks.com")
    monkeypatch.setenv("DATABRICKS_TOKEN", "secret")


def test_get_deploy_client():
    get_deploy_client("databricks")
    get_deploy_client("databricks://scope:prefix")


def test_create_endpoint():
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"name": "test"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.create_endpoint(
            name="test",
            config={
                "served_entities": [
                    {
                        "name": "test",
                        "external_model": {
                            "name": "gpt-4",
                            "provider": "openai",
                            "openai_config": {
                                "openai_api_key": "secret",
                            },
                        },
                    }
                ],
                "task": "llm/v1/chat",
            },
        )
        mock_request.assert_called_once()
        assert resp == {"name": "test"}


def test_create_endpoint_config_only():
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"name": "test"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.create_endpoint(
            config={
                "name": "test_new",
                "config": {
                    "served_entities": [
                        {
                            "name": "test_entity",
                            "external_model": {
                                "name": "gpt-4",
                                "provider": "openai",
                                "task": "llm/v1/chat",
                                "openai_config": {
                                    "openai_api_key": "secret",
                                },
                            },
                        }
                    ],
                    "route_optimized": True,
                },
            },
        )
        mock_request.assert_called_once()
        assert resp == {"name": "test"}


def test_create_endpoint_name_match():
    """Test when name is provided both in config and as named arg with matching values.
    Should emit a deprecation warning about using name parameter.
    """
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"name": "test"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        with pytest.warns(
            UserWarning,
            match="Passing 'name' as a parameter is deprecated. "
            "Please specify 'name' only within the config dictionary.",
        ):
            resp = client.create_endpoint(
                name="test",
                config={
                    "name": "test",
                    "config": {
                        "served_entities": [
                            {
                                "name": "test",
                                "external_model": {
                                    "name": "gpt-4",
                                    "provider": "openai",
                                    "openai_config": {
                                        "openai_api_key": "secret",
                                    },
                                },
                            }
                        ],
                        "task": "llm/v1/chat",
                    },
                },
            )
        mock_request.assert_called_once()
        assert resp == {"name": "test"}


def test_create_endpoint_name_mismatch():
    """Test when name is provided both in config and as named arg with different values.
    Should raise an MlflowException.
    """
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"name": "test"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200

    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        with pytest.raises(
            MlflowException,
            match="Name mismatch. Found 'test1' as parameter and 'test2' "
            "in config. Please specify 'name' only within the config "
            "dictionary as this parameter is deprecated.",
        ):
            client.create_endpoint(
                name="test1",
                config={
                    "name": "test2",
                    "config": {
                        "served_entities": [
                            {
                                "name": "test",
                                "external_model": {
                                    "name": "gpt-4",
                                    "provider": "openai",
                                    "openai_config": {
                                        "openai_api_key": "secret",
                                    },
                                },
                            }
                        ],
                        "task": "llm/v1/chat",
                    },
                },
            )
        mock_request.assert_not_called()


def test_create_endpoint_route_optimized_match():
    """Test when route_optimized is provided both in config and as named arg with matching values.
    Should emit a deprecation warning.
    """
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"name": "test"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200

    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        with pytest.warns(
            UserWarning,
            match="Passing 'route_optimized' as a parameter is deprecated. "
            "Please specify 'route_optimized' only within the config dictionary.",
        ):
            resp = client.create_endpoint(
                name="test",
                route_optimized=True,
                config={
                    "name": "test",
                    "route_optimized": True,
                    "config": {
                        "served_entities": [
                            {
                                "name": "test",
                                "external_model": {
                                    "name": "gpt-4",
                                    "provider": "openai",
                                    "openai_config": {
                                        "openai_api_key": "secret",
                                    },
                                },
                            }
                        ],
                        "task": "llm/v1/chat",
                    },
                },
            )
        mock_request.assert_called_once()
        assert resp == {"name": "test"}


def test_create_endpoint_route_optimized_mismatch():
    """Test when route_optimized is provided both in config and as named arg with different values.
    Should raise an MlflowException.
    """
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"name": "test"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200

    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        with pytest.raises(
            MlflowException,
            match="Conflicting 'route_optimized' values found. "
            "Please specify 'route_optimized' only within the config dictionary "
            "as this parameter is deprecated.",
        ):
            client.create_endpoint(
                name="test",
                route_optimized=True,
                config={
                    "name": "test",
                    "route_optimized": False,
                    "config": {
                        "served_entities": [
                            {
                                "name": "test",
                                "external_model": {
                                    "name": "gpt-4",
                                    "provider": "openai",
                                    "openai_config": {
                                        "openai_api_key": "secret",
                                    },
                                },
                            }
                        ],
                        "task": "llm/v1/chat",
                    },
                },
            )
        mock_request.assert_not_called()


def test_create_endpoint_named_name():
    """Test using the legacy format with separate parameters instead of full API payload.
    Should emit a deprecation warning about the old format.
    """
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"name": "test"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200

    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        with pytest.warns(
            UserWarning,
            match="Passing 'name', 'config', and 'route_optimized' as separate parameters is "
            "deprecated. Please pass the full API request payload as a single dictionary "
            "in the 'config' parameter.",
        ):
            resp = client.create_endpoint(
                name="test",
                config={
                    "served_entities": [
                        {
                            "name": "test",
                            "external_model": {
                                "name": "gpt-4",
                                "provider": "openai",
                                "openai_config": {
                                    "openai_api_key": "secret",
                                },
                            },
                        }
                    ],
                    "task": "llm/v1/chat",
                },
            )
        mock_request.assert_called_once()
        assert resp == {"name": "test"}


def test_create_endpoint_named_route_optimized():
    """Test using the legacy format with route_optimized parameter.
    Should emit a deprecation warning about the old format.
    """
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"name": "test"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200

    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        with pytest.warns(
            UserWarning,
            match="Passing 'name', 'config', and 'route_optimized' as separate parameters is "
            "deprecated. Please pass the full API request payload as a single dictionary "
            "in the 'config' parameter.",
        ):
            resp = client.create_endpoint(
                name="test",
                route_optimized=True,
                config={
                    "served_entities": [
                        {
                            "name": "test",
                            "external_model": {
                                "name": "gpt-4",
                                "provider": "openai",
                                "openai_config": {
                                    "openai_api_key": "secret",
                                },
                            },
                        }
                    ],
                    "task": "llm/v1/chat",
                },
            )
        mock_request.assert_called_once()
        assert resp == {"name": "test"}


def test_get_endpoint():
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"name": "test"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.get_endpoint(endpoint="test")
        mock_request.assert_called_once()
        assert resp == {"name": "test"}


def test_list_endpoints():
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"endpoints": [{"name": "test"}]}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.list_endpoints()
        mock_request.assert_called_once()
        assert resp == [{"name": "test"}]


def test_update_endpoint():
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        with pytest.warns(
            UserWarning,
            match="The `update_endpoint` method is deprecated. Use the specific update methods—"
            "`update_endpoint_config`, `update_endpoint_tags`, `update_endpoint_rate_limits`, "
            "`update_endpoint_ai_gateway`—instead.",
        ):
            resp = client.update_endpoint(
                endpoint="test",
                config={
                    "served_entities": [
                        {
                            "name": "test",
                            "external_model": {
                                "name": "gpt-4",
                                "provider": "openai",
                                "openai_config": {
                                    "openai_api_key": "secret",
                                },
                            },
                        }
                    ],
                    "task": "llm/v1/chat",
                },
            )
        mock_request.assert_called_once()
        assert resp == {}


def test_update_endpoint_config():
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.update_endpoint_config(
            endpoint="test",
            config={
                "served_entities": [
                    {
                        "name": "gpt-4-mini",
                        "external_model": {
                            "name": "gpt-4-mini",
                            "provider": "openai",
                            "task": "llm/v1/chat",
                            "openai_config": {
                                "openai_api_key": "{{secrets/scope/key}}",
                            },
                        },
                    }
                ],
            },
        )
        mock_request.assert_called_once()
        assert resp == {}


def test_update_endpoint_tags():
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.update_endpoint_tags(
            endpoint="test",
            config={"add_tags": [{"key": "project", "value": "test"}]},
        )
        mock_request.assert_called_once()
        assert resp == {}


def test_update_endpoint_rate_limits():
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.update_endpoint_rate_limits(
            endpoint="test",
            config={"rate_limits": [{"calls": 10, "key": "endpoint", "renewal_period": "minute"}]},
        )
        mock_request.assert_called_once()
        assert resp == {}


def test_update_endpoint_ai_gateway():
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.update_endpoint_ai_gateway(
            endpoint="test",
            config={
                "usage_tracking_config": {"enabled": True},
                "inference_table_config": {
                    "enabled": True,
                    "catalog_name": "my_catalog",
                    "schema_name": "my_schema",
                },
            },
        )
        mock_request.assert_called_once()
        assert resp == {}


def test_delete_endpoint():
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.delete_endpoint(endpoint="test")
        mock_request.assert_called_once()
        assert resp == {}


def test_predict():
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"foo": "bar"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.predict(endpoint="test", inputs={})
        mock_request.assert_called_once()
        assert resp == {"foo": "bar"}


def test_predict_with_total_timeout_env_var(monkeypatch):
    monkeypatch.setenv("MLFLOW_DEPLOYMENT_PREDICT_TOTAL_TIMEOUT", "900")
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"foo": "bar"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200

    with mock.patch(
        "mlflow.deployments.databricks.http_request", return_value=mock_resp
    ) as mock_http:
        resp = client.predict(endpoint="test", inputs={})
        mock_http.assert_called_once()
        call_kwargs = mock_http.call_args[1]
        assert call_kwargs["retry_timeout_seconds"] == 900
        assert resp == {"foo": "bar"}


def test_predict_stream_with_total_timeout_env_var(monkeypatch):
    monkeypatch.setenv("MLFLOW_DEPLOYMENT_PREDICT_TOTAL_TIMEOUT", "900")
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.iter_lines.return_value = [
        "data: " + '{"id": "1", "choices": [{"delta": {"content": "Hello"}}]}',
        "data: [DONE]",
    ]
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    mock_resp.encoding = "utf-8"

    with mock.patch(
        "mlflow.deployments.databricks.http_request", return_value=mock_resp
    ) as mock_http:
        chunks = list(client.predict_stream(endpoint="test", inputs={}))
        mock_http.assert_called_once()
        call_kwargs = mock_http.call_args[1]
        assert call_kwargs["retry_timeout_seconds"] == 900
        assert len(chunks) == 1


def test_predict_warns_on_misconfigured_timeouts(monkeypatch):
    monkeypatch.setenv("MLFLOW_DEPLOYMENT_PREDICT_TIMEOUT", "300")
    monkeypatch.setenv("MLFLOW_DEPLOYMENT_PREDICT_TOTAL_TIMEOUT", "120")
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"foo": "bar"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200

    with mock.patch(
        "mlflow.deployments.databricks.http_request", return_value=mock_resp
    ) as mock_http:
        with warnings.catch_warnings(record=True) as w:
            warnings.simplefilter("always")
            resp = client.predict(endpoint="test", inputs={})

        mock_http.assert_called_once()
        assert resp == {"foo": "bar"}
        assert len(w) == 1
        warning_msg = str(w[0].message)
        assert "MLFLOW_DEPLOYMENT_PREDICT_TOTAL_TIMEOUT" in warning_msg
        assert "(120s)" in warning_msg
        assert "(300s)" in warning_msg


def test_predict_stream_warns_on_misconfigured_timeouts(monkeypatch):
    monkeypatch.setenv("MLFLOW_DEPLOYMENT_PREDICT_TIMEOUT", "300")
    monkeypatch.setenv("MLFLOW_DEPLOYMENT_PREDICT_TOTAL_TIMEOUT", "120")
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.iter_lines.return_value = [
        "data: " + '{"id": "1", "choices": [{"delta": {"content": "Hello"}}]}',
        "data: [DONE]",
    ]
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200
    mock_resp.encoding = "utf-8"

    with mock.patch(
        "mlflow.deployments.databricks.http_request", return_value=mock_resp
    ) as mock_http:
        with warnings.catch_warnings(record=True) as w:
            warnings.simplefilter("always")
            chunks = list(client.predict_stream(endpoint="test", inputs={}))

        mock_http.assert_called_once()
        assert len(chunks) == 1
        assert len(w) == 1
        warning_msg = str(w[0].message)
        assert "MLFLOW_DEPLOYMENT_PREDICT_TOTAL_TIMEOUT" in warning_msg
        assert "(120s)" in warning_msg
        assert "(300s)" in warning_msg


def test_predict_no_warning_when_timeouts_properly_configured(monkeypatch):
    monkeypatch.setenv("MLFLOW_DEPLOYMENT_PREDICT_TIMEOUT", "120")
    monkeypatch.setenv("MLFLOW_DEPLOYMENT_PREDICT_TOTAL_TIMEOUT", "600")
    client = get_deploy_client("databricks")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {"foo": "bar"}
    mock_resp.url = os.environ["DATABRICKS_HOST"]
    mock_resp.status_code = 200

    with (
        mock.patch(
            "mlflow.deployments.databricks.http_request", return_value=mock_resp
        ) as mock_http,
        mock.patch("mlflow.utils.rest_utils._logger.warning") as mock_warning,
    ):
        resp = client.predict(endpoint="test", inputs={})
        mock_http.assert_called_once()
        assert resp == {"foo": "bar"}
        mock_warning.assert_not_called()
```

--------------------------------------------------------------------------------

---[FILE: test_mlflow.py]---
Location: mlflow-master/tests/deployments/mlflow/test_mlflow.py

```python
from unittest import mock

import pytest

from mlflow.deployments import get_deploy_client
from mlflow.deployments.mlflow import MlflowDeploymentClient
from mlflow.environment_variables import MLFLOW_DEPLOYMENT_CLIENT_HTTP_REQUEST_TIMEOUT


def test_get_deploy_client():
    client = get_deploy_client("http://localhost:5000")
    assert isinstance(client, MlflowDeploymentClient)


def test_create_endpoint():
    client = get_deploy_client("http://localhost:5000")
    with pytest.raises(NotImplementedError, match=r".*"):
        client.create_endpoint(name="test")


def test_update_endpoint():
    client = get_deploy_client("http://localhost:5000")
    with pytest.raises(NotImplementedError, match=r".*"):
        client.update_endpoint(endpoint="test")


def test_delete_endpoint():
    client = get_deploy_client("http://localhost:5000")
    with pytest.raises(NotImplementedError, match=r".*"):
        client.delete_endpoint(endpoint="test")


def test_get_endpoint():
    client = get_deploy_client("http://localhost:5000")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {
        "model": {"name": "gpt-4", "provider": "openai"},
        "name": "completions",
        "endpoint_type": "llm/v1/completions",
        "endpoint_url": "http://localhost:5000/endpoints/chat/invocations",
        "limit": None,
    }
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.get_endpoint(endpoint="test")
        mock_request.assert_called_once()
        assert resp.model_dump() == {
            "name": "completions",
            "endpoint_type": "llm/v1/completions",
            "model": {"name": "gpt-4", "provider": "openai"},
            "endpoint_url": "http://localhost:5000/endpoints/chat/invocations",
            "limit": None,
        }
        ((_, url), _) = mock_request.call_args
        assert url == "http://localhost:5000/api/2.0/endpoints/test"


def test_list_endpoints():
    client = get_deploy_client("http://localhost:5000")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {
        "endpoints": [
            {
                "model": {"name": "gpt-4", "provider": "openai"},
                "name": "completions",
                "endpoint_type": "llm/v1/completions",
                "endpoint_url": "http://localhost:5000/endpoints/chat/invocations",
                "limit": None,
            }
        ]
    }
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.list_endpoints()
        mock_request.assert_called_once()
        assert [r.model_dump() for r in resp] == [
            {
                "model": {"name": "gpt-4", "provider": "openai"},
                "name": "completions",
                "endpoint_type": "llm/v1/completions",
                "endpoint_url": "http://localhost:5000/endpoints/chat/invocations",
                "limit": None,
            }
        ]
        ((_, url), _) = mock_request.call_args
        assert url == "http://localhost:5000/api/2.0/endpoints/"


def test_list_endpoints_paginated():
    client = get_deploy_client("http://localhost:5000")
    mock_resp = mock.Mock()
    mock_resp.json.side_effect = [
        {
            "endpoints": [
                {
                    "model": {"name": "gpt-4", "provider": "openai"},
                    "name": "chat",
                    "endpoint_type": "llm/v1/chat",
                    "endpoint_url": "http://localhost:5000/endpoints/chat/invocations",
                    "limit": None,
                }
            ],
            "next_page_token": "token",
        },
        {
            "endpoints": [
                {
                    "model": {"name": "gpt-4", "provider": "openai"},
                    "name": "completions",
                    "endpoint_type": "llm/v1/completions",
                    "endpoint_url": "http://localhost:5000/endpoints/chat/invocations",
                    "limit": None,
                }
            ]
        },
    ]
    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.list_endpoints()
        assert mock_request.call_count == 2
        assert [r.model_dump() for r in resp] == [
            {
                "model": {"name": "gpt-4", "provider": "openai"},
                "name": "chat",
                "endpoint_type": "llm/v1/chat",
                "endpoint_url": "http://localhost:5000/endpoints/chat/invocations",
                "limit": None,
            },
            {
                "model": {"name": "gpt-4", "provider": "openai"},
                "name": "completions",
                "endpoint_type": "llm/v1/completions",
                "endpoint_url": "http://localhost:5000/endpoints/chat/invocations",
                "limit": None,
            },
        ]


def test_predict():
    client = get_deploy_client("http://localhost:5000")
    mock_resp = mock.Mock()
    mock_resp.json.return_value = {
        "id": "chatcmpl-123",
        "object": "chat.completion",
        "created": 1677652288,
        "model": "gpt-4o-mini",
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "hello",
                },
                "finish_reason": "stop",
            }
        ],
        "usage": {
            "prompt_tokens": 9,
            "completion_tokens": 12,
            "total_tokens": 21,
        },
    }

    mock_resp.status_code = 200
    with mock.patch("requests.Session.request", return_value=mock_resp) as mock_request:
        resp = client.predict(endpoint="test", inputs={})
        mock_request.assert_called_once()
        assert resp == {
            "id": "chatcmpl-123",
            "object": "chat.completion",
            "created": 1677652288,
            "model": "gpt-4o-mini",
            "choices": [
                {
                    "index": 0,
                    "message": {"role": "assistant", "content": "hello"},
                    "finish_reason": "stop",
                }
            ],
            "usage": {
                "prompt_tokens": 9,
                "completion_tokens": 12,
                "total_tokens": 21,
            },
        }
        ((_, url), _) = mock_request.call_args
        assert url == "http://localhost:5000/endpoints/test/invocations"


def test_call_endpoint_uses_default_timeout():
    client = get_deploy_client("http://localhost:5000")

    with mock.patch("mlflow.deployments.mlflow.http_request") as mock_http_request:
        mock_http_request.return_value.json.return_value = {"test": "response"}
        mock_http_request.return_value.status_code = 200

        client._call_endpoint("GET", "/test")

        mock_http_request.assert_called_once()
        call_args = mock_http_request.call_args
        assert call_args.kwargs["timeout"] == MLFLOW_DEPLOYMENT_CLIENT_HTTP_REQUEST_TIMEOUT.get()


def test_call_endpoint_respects_custom_timeout():
    client = get_deploy_client("http://localhost:5000")
    custom_timeout = 600

    with mock.patch("mlflow.deployments.mlflow.http_request") as mock_http_request:
        mock_http_request.return_value.json.return_value = {"test": "response"}
        mock_http_request.return_value.status_code = 200

        client._call_endpoint("GET", "/test", timeout=custom_timeout)

        mock_http_request.assert_called_once()
        call_args = mock_http_request.call_args
        assert call_args.kwargs["timeout"] == custom_timeout


def test_call_endpoint_timeout_with_environment_variable(monkeypatch):
    custom_timeout = 420
    monkeypatch.setenv("MLFLOW_DEPLOYMENT_CLIENT_HTTP_REQUEST_TIMEOUT", str(custom_timeout))

    client = get_deploy_client("http://localhost:5000")

    with mock.patch("mlflow.deployments.mlflow.http_request") as mock_http_request:
        mock_http_request.return_value.json.return_value = {"test": "response"}
        mock_http_request.return_value.status_code = 200

        client._call_endpoint("GET", "/test")

        mock_http_request.assert_called_once()
        call_args = mock_http_request.call_args
        assert call_args.kwargs["timeout"] == custom_timeout


def test_get_endpoint_uses_deployment_client_timeout():
    client = get_deploy_client("http://localhost:5000")

    with mock.patch("mlflow.deployments.mlflow.http_request") as mock_http_request:
        mock_http_request.return_value.json.return_value = {
            "model": {"name": "gpt-4", "provider": "openai"},
            "name": "test",
            "endpoint_type": "llm/v1/chat",
            "endpoint_url": "http://localhost:5000/endpoints/test/invocations",
            "limit": None,
        }
        mock_http_request.return_value.status_code = 200

        client.get_endpoint("test")

        mock_http_request.assert_called_once()
        call_args = mock_http_request.call_args
        assert call_args.kwargs["timeout"] == MLFLOW_DEPLOYMENT_CLIENT_HTTP_REQUEST_TIMEOUT.get()


def test_list_endpoints_uses_deployment_client_timeout():
    client = get_deploy_client("http://localhost:5000")

    with mock.patch("mlflow.deployments.mlflow.http_request") as mock_http_request:
        mock_http_request.return_value.json.return_value = {"endpoints": []}
        mock_http_request.return_value.status_code = 200

        client.list_endpoints()

        mock_http_request.assert_called_once()
        call_args = mock_http_request.call_args
        assert call_args.kwargs["timeout"] == MLFLOW_DEPLOYMENT_CLIENT_HTTP_REQUEST_TIMEOUT.get()
```

--------------------------------------------------------------------------------

````
