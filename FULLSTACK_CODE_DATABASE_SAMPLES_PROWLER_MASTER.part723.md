---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 723
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 723 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: kubernetes_provider_test.py]---
Location: prowler-master/tests/providers/kubernetes/kubernetes_provider_test.py

```python
from argparse import Namespace
from unittest.mock import patch

from kubernetes.config.config_exception import ConfigException

from kubernetes import client
from prowler.config.config import (
    default_config_file_path,
    default_fixer_config_file_path,
    load_and_validate_config_file,
)
from prowler.providers.kubernetes.exceptions.exceptions import (
    KubernetesSetUpSessionError,
)
from prowler.providers.kubernetes.kubernetes_provider import KubernetesProvider
from prowler.providers.kubernetes.models import (
    KubernetesIdentityInfo,
    KubernetesSession,
)
from tests.providers.kubernetes.kubernetes_fixtures import KUBERNETES_CONFIG


def mock_set_kubernetes_credentials(*_):
    return ("apiclient", "context")


def mock_get_context_user_roles(*_):
    return []


class TestKubernetesProvider:
    def test_kubernetes_provider_no_namespaces(
        self,
    ):
        context = {
            "name": "test-context",
            "context": {
                "user": "test-user",
                "cluster": "test-cluster",
            },
        }
        with (
            patch(
                "prowler.providers.kubernetes.kubernetes_provider.KubernetesProvider.setup_session",
                return_value=KubernetesSession(
                    api_client=client.ApiClient,
                    context=context,
                ),
            ),
            patch(
                "prowler.providers.kubernetes.kubernetes_provider.KubernetesProvider.get_all_namespaces",
                return_value=["namespace-1"],
            ),
        ):
            arguments = Namespace()
            arguments.kubeconfig_file = "dummy_path"
            arguments.context = None
            arguments.only_logs = False
            arguments.namespace = None
            fixer_config = load_and_validate_config_file(
                "kubernetes", default_fixer_config_file_path
            )

            # Instantiate the KubernetesProvider with mocked arguments
            kubernetes_provider = KubernetesProvider(
                arguments.kubeconfig_file,
                arguments.context,
                arguments.namespace,
                config_path=default_config_file_path,
                fixer_config=fixer_config,
            )
            assert isinstance(kubernetes_provider.session, KubernetesSession)
            assert kubernetes_provider.session.api_client is not None
            assert kubernetes_provider.session.context == {
                "name": "test-context",
                "context": {"cluster": "test-cluster", "user": "test-user"},
            }
            assert kubernetes_provider.namespaces == ["namespace-1"]
            assert isinstance(kubernetes_provider.identity, KubernetesIdentityInfo)
            assert kubernetes_provider.identity.context == "test-context"
            assert kubernetes_provider.identity.cluster == "test-cluster"
            assert kubernetes_provider.identity.user == "test-user"

            assert kubernetes_provider.audit_config == KUBERNETES_CONFIG

    @patch(
        "prowler.providers.kubernetes.kubernetes_provider.client.CoreV1Api.list_namespace"
    )
    @patch("kubernetes.config.list_kube_config_contexts")
    @patch("kubernetes.config.load_kube_config_from_dict")
    def test_kubernetes_test_connection_with_kubeconfig_content(
        self,
        mock_load_kube_config_from_dict,
        mock_list_kube_config_contexts,
        mock_list_namespace,
    ):
        mock_load_kube_config_from_dict.return_value = None
        mock_list_kube_config_contexts.return_value = (
            [
                {
                    "name": "example-context",
                    "context": {
                        "cluster": "example-cluster",
                        "user": "example-user",
                    },
                }
            ],
            None,
        )
        mock_list_namespace.return_value.items = [
            client.V1Namespace(metadata=client.V1ObjectMeta(name="namespace-1")),
        ]

        kubeconfig_content = '{"apiVersion": "v1", "clusters": [{"cluster": {"server": "https://kubernetes.example.com"}, "name": "example-cluster"}], "contexts": [{"context": {"cluster": "example-cluster", "user": "example-user"}, "name": "example-context"}], "current-context": "example-context", "kind": "Config", "preferences": {}, "users": [{"name": "example-user", "user": {"token": "EXAMPLE_TOKEN"}}]}'

        connection = KubernetesProvider.test_connection(
            kubeconfig_file=None,
            kubeconfig_content=kubeconfig_content,
            provider_id="example-context",
            raise_on_exception=False,
        )

        assert connection.is_connected
        assert connection.error is None

    @patch(
        "prowler.providers.kubernetes.kubernetes_provider.client.CoreV1Api.list_namespace"
    )
    @patch("kubernetes.config.list_kube_config_contexts")
    @patch("kubernetes.config.load_kube_config")
    def test_kubernetes_test_connection_with_kubeconfig_file(
        self, mock_load_kube_config, mock_list_kube_config_contexts, mock_list_namespace
    ):
        mock_load_kube_config.return_value = None
        mock_list_kube_config_contexts.return_value = (
            [
                {
                    "name": "test-context",
                    "context": {
                        "cluster": "test-cluster",
                        "user": "test-user",
                    },
                }
            ],
            None,
        )
        mock_list_namespace.return_value.items = [
            client.V1Namespace(metadata=client.V1ObjectMeta(name="namespace-1")),
        ]

        connection = KubernetesProvider.test_connection(
            kubeconfig_file="dummy_kubeconfig_path",
            kubeconfig_content="",
            provider_id="test-context",
            raise_on_exception=False,
        )

        assert connection.is_connected
        assert connection.error is None

    @patch(
        "prowler.providers.kubernetes.kubernetes_provider.client.CoreV1Api.list_namespaced_pod"
    )
    @patch("kubernetes.config.list_kube_config_contexts")
    @patch("kubernetes.config.load_kube_config")
    def test_kubernetes_test_connection_with_namespace_input(
        self,
        mock_load_kube_config,
        mock_list_kube_config_contexts,
        mock_list_namespaced_pod,
    ):
        mock_load_kube_config.return_value = None
        mock_list_kube_config_contexts.return_value = (
            [
                {
                    "name": "test-context",
                    "context": {
                        "cluster": "test-cluster",
                        "user": "test-user",
                    },
                }
            ],
            None,
        )
        mock_list_namespaced_pod.return_value.items = [
            client.V1Pod(metadata=client.V1ObjectMeta(name="pod-1")),
        ]

        connection = KubernetesProvider.test_connection(
            kubeconfig_file="",
            kubeconfig_content="",
            namespace="test-namespace",
            provider_id="test-context",
            raise_on_exception=False,
        )

        assert connection.is_connected
        assert connection.error is None

    @patch(
        "prowler.providers.kubernetes.kubernetes_provider.client.CoreV1Api.list_namespace"
    )
    @patch("kubernetes.config.list_kube_config_contexts")
    @patch("kubernetes.config.load_kube_config_from_dict")
    def test_kubernetes_test_connection_with_kubeconfig_content_invalid_provider_id(
        self,
        mock_load_kube_config_from_dict,
        mock_list_kube_config_contexts,
        mock_list_namespace,
    ):
        mock_load_kube_config_from_dict.return_value = None
        mock_list_kube_config_contexts.return_value = (
            [
                {
                    "name": "example-context",
                    "context": {
                        "cluster": "example-cluster",
                        "user": "example-user",
                    },
                }
            ],
            None,
        )
        mock_list_namespace.return_value.items = [
            client.V1Namespace(metadata=client.V1ObjectMeta(name="namespace-1")),
        ]

        kubeconfig_content = {
            "apiVersion": "v1",
            "clusters": [
                {
                    "cluster": {
                        "server": "https://kubernetes.example.com",
                    },
                    "name": "example-cluster",
                }
            ],
            "contexts": [
                {
                    "context": {
                        "cluster": "example-cluster",
                        "user": "example-user",
                    },
                    "name": "example-context",
                }
            ],
            "current-context": "example-context",
            "kind": "Config",
            "preferences": {},
            "users": [
                {
                    "name": "example-user",
                    "user": {
                        "token": "EXAMPLE_TOKEN",
                    },
                }
            ],
        }

        connection = KubernetesProvider.test_connection(
            kubeconfig_file=None,
            kubeconfig_content=kubeconfig_content,
            provider_id="example-context-invalid",
            raise_on_exception=False,
        )

        assert not connection.is_connected
        assert connection.error is not None
        assert isinstance(connection.error, KubernetesSetUpSessionError)

    @patch(
        "prowler.providers.kubernetes.kubernetes_provider.client.CoreV1Api.list_namespace"
    )
    @patch("kubernetes.config.list_kube_config_contexts")
    @patch("kubernetes.config.load_kube_config_from_dict")
    def test_kubernetes_test_connection_with_kubeconfig_content_valid_provider_id(
        self,
        mock_load_kube_config_from_dict,
        mock_list_kube_config_contexts,
        mock_list_namespace,
    ):
        mock_load_kube_config_from_dict.return_value = None
        mock_list_kube_config_contexts.return_value = (
            [
                {
                    "name": "example-context",
                    "context": {
                        "cluster": "example-cluster",
                        "user": "example-user",
                    },
                }
            ],
            None,
        )
        mock_list_namespace.return_value.items = [
            client.V1Namespace(metadata=client.V1ObjectMeta(name="namespace-1")),
        ]

        kubeconfig_content = '{"apiVersion": "v1", "clusters": [{"cluster": {"server": "https://kubernetes.example.com"}, "name": "example-cluster"}], "contexts": [{"context": {"cluster": "example-cluster", "user": "example-user"}, "name": "example-context"}], "current-context": "example-context", "kind": "Config", "preferences": {}, "users": [{"name": "example-user", "user": {"token": "EXAMPLE_TOKEN"}}]}'

        connection = KubernetesProvider.test_connection(
            kubeconfig_file=None,
            kubeconfig_content=kubeconfig_content,
            provider_id="example-context",
            raise_on_exception=False,
        )

        assert connection.is_connected
        assert connection.error is None

    def test_kubernetes_provider_incluster_with_env_var(self, monkeypatch):
        monkeypatch.setenv("CLUSTER_NAME", "env-cluster-name")

        with (
            patch(
                "kubernetes.config.load_kube_config",
                side_effect=ConfigException("No kubeconfig"),
            ),
            patch("kubernetes.config.load_incluster_config", return_value=None),
            patch("prowler.providers.kubernetes.kubernetes_provider.client.ApiClient"),
            patch(
                "prowler.providers.kubernetes.kubernetes_provider.KubernetesProvider.get_all_namespaces",
                return_value=["default"],
            ),
        ):
            session = KubernetesProvider.setup_session(
                kubeconfig_file=None,
                kubeconfig_content=None,
                context=None,
                cluster_name=None,
            )
            assert isinstance(session, KubernetesSession)
            assert session.context["context"]["cluster"] == "env-cluster-name"

    def test_kubernetes_provider_incluster_with_cli_flag(self):
        with (
            patch(
                "kubernetes.config.load_kube_config",
                side_effect=ConfigException("No kubeconfig"),
            ),
            patch("kubernetes.config.load_incluster_config", return_value=None),
            patch("prowler.providers.kubernetes.kubernetes_provider.client.ApiClient"),
            patch(
                "prowler.providers.kubernetes.kubernetes_provider.KubernetesProvider.get_all_namespaces",
                return_value=["default"],
            ),
        ):
            session = KubernetesProvider.setup_session(
                kubeconfig_file=None,
                kubeconfig_content=None,
                context=None,
                cluster_name="cli-cluster-name",
            )
            assert isinstance(session, KubernetesSession)
            assert session.context["context"]["cluster"] == "cli-cluster-name"

    @patch(
        "prowler.providers.kubernetes.kubernetes_provider.client.CoreV1Api.list_namespace"
    )
    @patch("kubernetes.config.list_kube_config_contexts")
    @patch("kubernetes.config.load_kube_config_from_dict")
    def test_kubernetes_provider_proxy_from_env(
        self,
        mock_load_kube_config_from_dict,
        mock_list_kube_config_contexts,
        mock_list_namespace,
        monkeypatch,
    ):

        monkeypatch.setenv("HTTPS_PROXY", "http://my.internal.proxy:8888")

        mock_load_kube_config_from_dict.return_value = None
        mock_list_kube_config_contexts.return_value = (
            [
                {
                    "name": "example-context",
                    "context": {
                        "cluster": "example-cluster",
                        "user": "example-user",
                    },
                }
            ],
            None,
        )
        mock_list_namespace.return_value.items = [
            client.V1Namespace(metadata=client.V1ObjectMeta(name="namespace-1")),
        ]

        kubeconfig_content = '{"apiVersion": "v1", "clusters": [{"cluster": {"server": "https://kubernetes.example.com"}, "name": "example-cluster"}], "contexts": [{"context": {"cluster": "example-cluster", "user": "example-user"}, "name": "example-context"}], "current-context": "example-context", "kind": "Config", "preferences": {}, "users": [{"name": "example-user", "user": {"token": "EXAMPLE_TOKEN"}}]}'

        session = KubernetesProvider.setup_session(
            kubeconfig_content=kubeconfig_content,
            context="example-context",
        )

        assert isinstance(session, KubernetesSession)
        assert isinstance(session.api_client, client.ApiClient)
        assert isinstance(session.api_client.configuration, client.Configuration)
        assert session.api_client.configuration.verify_ssl
        assert session.api_client.configuration.proxy == "http://my.internal.proxy:8888"

    @patch(
        "prowler.providers.kubernetes.kubernetes_provider.client.CoreV1Api.list_namespace"
    )
    @patch("kubernetes.config.list_kube_config_contexts")
    @patch("kubernetes.config.load_kube_config_from_dict")
    def test_kubernetes_provider_disable_tls_verification(
        self,
        mock_load_kube_config_from_dict,
        mock_list_kube_config_contexts,
        mock_list_namespace,
        monkeypatch,
    ):
        monkeypatch.setenv("K8S_SKIP_TLS_VERIFY", "true")

        mock_load_kube_config_from_dict.return_value = None
        mock_list_kube_config_contexts.return_value = (
            [
                {
                    "name": "example-context",
                    "context": {
                        "cluster": "example-cluster",
                        "user": "example-user",
                    },
                }
            ],
            None,
        )
        mock_list_namespace.return_value.items = [
            client.V1Namespace(metadata=client.V1ObjectMeta(name="namespace-1")),
        ]

        kubeconfig_content = '{"apiVersion": "v1", "clusters": [{"cluster": {"server": "https://kubernetes.example.com"}, "name": "example-cluster"}], "contexts": [{"context": {"cluster": "example-cluster", "user": "example-user"}, "name": "example-context"}], "current-context": "example-context", "kind": "Config", "preferences": {}, "users": [{"name": "example-user", "user": {"token": "EXAMPLE_TOKEN"}}]}'

        session = KubernetesProvider.setup_session(
            kubeconfig_content=kubeconfig_content,
            context="example-context",
        )

        assert isinstance(session, KubernetesSession)
        assert isinstance(session.api_client, client.ApiClient)
        assert isinstance(session.api_client.configuration, client.Configuration)
        assert session.api_client.configuration.verify_ssl is False
        assert session.api_client.configuration.proxy is None

    @patch(
        "prowler.providers.kubernetes.kubernetes_provider.client.CoreV1Api.list_namespace"
    )
    @patch("kubernetes.config.list_kube_config_contexts")
    @patch("kubernetes.config.load_kube_config_from_dict")
    def test_kubernetes_provider_kubeconfig_content(
        self,
        mock_load_kube_config_from_dict,
        mock_list_kube_config_contexts,
        mock_list_namespace,
    ):
        mock_load_kube_config_from_dict.return_value = None
        mock_list_kube_config_contexts.return_value = (
            [
                {
                    "name": "example-context",
                    "context": {
                        "cluster": "example-cluster",
                        "user": "example-user",
                    },
                }
            ],
            None,
        )
        mock_list_namespace.return_value.items = [
            client.V1Namespace(metadata=client.V1ObjectMeta(name="namespace-1")),
        ]

        kubeconfig_content = '{"apiVersion": "v1", "clusters": [{"cluster": {"server": "https://kubernetes.example.com"}, "name": "example-cluster"}], "contexts": [{"context": {"cluster": "example-cluster", "user": "example-user"}, "name": "example-context"}], "current-context": "example-context", "kind": "Config", "preferences": {}, "users": [{"name": "example-user", "user": {"token": "EXAMPLE_TOKEN"}}]}'

        session = KubernetesProvider.setup_session(
            kubeconfig_content=kubeconfig_content,
            context="example-context",
        )

        assert isinstance(session, KubernetesSession)
        assert isinstance(session.api_client, client.ApiClient)

        assert session.context == {
            "name": "example-context",
            "context": {
                "cluster": "example-cluster",
                "user": "example-user",
            },
        }

    @patch(
        "prowler.providers.kubernetes.kubernetes_provider.client.CoreV1Api.list_namespace"
    )
    @patch("kubernetes.config.list_kube_config_contexts")
    @patch("kubernetes.config.load_kube_config_from_dict")
    def test_kubernetes_provider_kubeconfig_content_proxy_settings(
        self,
        mock_load_kube_config_from_dict,
        mock_list_kube_config_contexts,
        mock_list_namespace,
        monkeypatch,
    ):
        monkeypatch.setenv("HTTPS_PROXY", "http://my.internal.proxy:8888")
        monkeypatch.setenv("K8S_SKIP_TLS_VERIFY", "true")

        mock_load_kube_config_from_dict.return_value = None
        mock_list_kube_config_contexts.return_value = (
            [
                {
                    "name": "example-context",
                    "context": {
                        "cluster": "example-cluster",
                        "user": "example-user",
                    },
                }
            ],
            None,
        )
        mock_list_namespace.return_value.items = [
            client.V1Namespace(metadata=client.V1ObjectMeta(name="namespace-1")),
        ]

        kubeconfig_content = '{"apiVersion": "v1", "clusters": [{"cluster": {"server": "https://kubernetes.example.com"}, "name": "example-cluster"}], "contexts": [{"context": {"cluster": "example-cluster", "user": "example-user"}, "name": "example-context"}], "current-context": "example-context", "kind": "Config", "preferences": {}, "users": [{"name": "example-user", "user": {"token": "EXAMPLE_TOKEN"}}]}'

        session = KubernetesProvider.setup_session(
            kubeconfig_content=kubeconfig_content,
            context="example-context",
        )

        assert isinstance(session, KubernetesSession)
        assert isinstance(session.api_client, client.ApiClient)

        assert session.context == {
            "name": "example-context",
            "context": {
                "cluster": "example-cluster",
                "user": "example-user",
            },
        }

        assert session.api_client.configuration.proxy == "http://my.internal.proxy:8888"
        assert session.api_client.configuration.verify_ssl is False

    def test_set_proxy_settings_no_proxy_no_tls_skip(self):
        """Test set_proxy_settings with no environment variables set."""
        with patch.dict("os.environ", {}, clear=True):
            config = KubernetesProvider.set_proxy_settings()

            # Verify it's a Configuration instance from kubernetes.client
            from kubernetes.client import Configuration

            assert isinstance(config, Configuration)

            assert hasattr(config, "proxy")
            assert config.proxy is None
            assert hasattr(config, "verify_ssl")
            assert config.verify_ssl is True

    def test_set_proxy_settings_with_https_proxy_uppercase(self):
        """Test set_proxy_settings with HTTPS_PROXY environment variable."""
        proxy_url = "http://proxy.example.com:8080"
        with patch.dict("os.environ", {"HTTPS_PROXY": proxy_url}, clear=True):
            config = KubernetesProvider.set_proxy_settings()

            # Verify it's a Configuration instance from kubernetes.client
            from kubernetes.client import Configuration

            assert isinstance(config, Configuration)

            assert config.proxy == proxy_url
            assert config.verify_ssl is True

    def test_set_proxy_settings_with_https_proxy_lowercase(self):
        """Test set_proxy_settings with https_proxy environment variable."""
        proxy_url = "http://proxy.example.com:3128"
        with patch.dict("os.environ", {"https_proxy": proxy_url}, clear=True):
            config = KubernetesProvider.set_proxy_settings()

            # Verify it's a Configuration instance from kubernetes.client
            from kubernetes.client import Configuration

            assert isinstance(config, Configuration)

            assert config.proxy == proxy_url
            assert config.verify_ssl is True

    def test_set_proxy_settings_uppercase_proxy_takes_precedence(self):
        """Test that HTTPS_PROXY takes precedence over https_proxy."""
        uppercase_proxy = "http://uppercase.proxy.com:8080"
        lowercase_proxy = "http://lowercase.proxy.com:3128"
        with patch.dict(
            "os.environ",
            {"HTTPS_PROXY": uppercase_proxy, "https_proxy": lowercase_proxy},
            clear=True,
        ):
            config = KubernetesProvider.set_proxy_settings()

            # Verify it's a Configuration instance from kubernetes.client
            from kubernetes.client import Configuration

            assert isinstance(config, Configuration)

            assert config.proxy == uppercase_proxy
            assert config.verify_ssl is True

    def test_set_proxy_settings_with_tls_skip_true(self):
        """Test set_proxy_settings with K8S_SKIP_TLS_VERIFY set to true."""
        with patch.dict("os.environ", {"K8S_SKIP_TLS_VERIFY": "true"}, clear=True):
            config = KubernetesProvider.set_proxy_settings()

            # Verify it's a Configuration instance from kubernetes.client
            from kubernetes.client import Configuration

            assert isinstance(config, Configuration)

            assert config.proxy is None
            assert config.verify_ssl is False

    def test_set_proxy_settings_with_tls_skip_true_uppercase(self):
        """Test set_proxy_settings with K8S_SKIP_TLS_VERIFY set to TRUE."""
        with patch.dict("os.environ", {"K8S_SKIP_TLS_VERIFY": "TRUE"}, clear=True):
            config = KubernetesProvider.set_proxy_settings()

            # Verify it's a Configuration instance from kubernetes.client
            from kubernetes.client import Configuration

            assert isinstance(config, Configuration)

            assert config.proxy is None
            assert config.verify_ssl is False

    def test_set_proxy_settings_with_tls_skip_false(self):
        """Test set_proxy_settings with K8S_SKIP_TLS_VERIFY set to false."""
        with patch.dict("os.environ", {"K8S_SKIP_TLS_VERIFY": "false"}, clear=True):
            config = KubernetesProvider.set_proxy_settings()

            # Verify it's a Configuration instance from kubernetes.client
            from kubernetes.client import Configuration

            assert isinstance(config, Configuration)

            assert config.proxy is None
            assert config.verify_ssl is True

    def test_set_proxy_settings_with_tls_skip_invalid_value(self):
        """Test set_proxy_settings with K8S_SKIP_TLS_VERIFY set to invalid value."""
        with patch.dict("os.environ", {"K8S_SKIP_TLS_VERIFY": "invalid"}, clear=True):
            config = KubernetesProvider.set_proxy_settings()

            # Verify it's a Configuration instance from kubernetes.client
            from kubernetes.client import Configuration

            assert isinstance(config, Configuration)

            assert config.proxy is None
            assert config.verify_ssl is True

    def test_set_proxy_settings_with_both_proxy_and_tls_skip(self):
        """Test set_proxy_settings with both proxy and TLS skip settings."""
        proxy_url = "http://secure.proxy.com:8080"
        with patch.dict(
            "os.environ",
            {"HTTPS_PROXY": proxy_url, "K8S_SKIP_TLS_VERIFY": "true"},
            clear=True,
        ):
            config = KubernetesProvider.set_proxy_settings()

            # Verify it's a Configuration instance from kubernetes.client
            from kubernetes.client import Configuration

            assert isinstance(config, Configuration)

            assert config.proxy == proxy_url
            assert config.verify_ssl is False
```

--------------------------------------------------------------------------------

---[FILE: kubernetes_mutelist_test.py]---
Location: prowler-master/tests/providers/kubernetes/lib/mutelist/kubernetes_mutelist_test.py

```python
import yaml
from mock import MagicMock

from prowler.providers.kubernetes.lib.mutelist.mutelist import KubernetesMutelist
from tests.lib.outputs.fixtures.fixtures import generate_finding_output

MUTELIST_FIXTURE_PATH = (
    "tests/providers/kubernetes/lib/mutelist/fixtures/kubernetes_mutelist.yaml"
)


class TestKubernetesMutelist:
    def test_get_mutelist_file_from_local_file(self):
        mutelist = KubernetesMutelist(mutelist_path=MUTELIST_FIXTURE_PATH)

        with open(MUTELIST_FIXTURE_PATH) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        assert mutelist.mutelist == mutelist_fixture
        assert mutelist.mutelist_file_path == MUTELIST_FIXTURE_PATH

    def test_get_mutelist_file_from_local_file_non_existent(self):
        mutelist_path = "tests/lib/mutelist/fixtures/not_present"
        mutelist = KubernetesMutelist(mutelist_path=mutelist_path)

        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path == mutelist_path

    def test_validate_mutelist_not_valid_key(self):
        mutelist_path = MUTELIST_FIXTURE_PATH
        with open(mutelist_path) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        mutelist_fixture["Accounts1"] = mutelist_fixture["Accounts"]
        del mutelist_fixture["Accounts"]

        mutelist = KubernetesMutelist(mutelist_content=mutelist_fixture)

        assert len(mutelist.validate_mutelist(mutelist_fixture)) == 0
        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path is None

    def test_is_finding_muted(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "cluster_1": {
                    "Checks": {
                        "check_test": {
                            # TODO: review this with Sergio
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = KubernetesMutelist(mutelist_content=mutelist_content)

        finding = MagicMock
        finding.check_metadata = MagicMock
        finding.check_metadata.CheckID = "check_test"
        finding.status = "FAIL"
        finding.resource_name = "test_resource"
        finding.namespace = "test-location"
        finding.resource_tags = []

        assert mutelist.is_finding_muted(finding, "cluster_1")

    def test_is_finding_muted_apiserver_star_within_check_name_with_exception(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "*": {
                    "Checks": {
                        "apiserver_*": {
                            "Regions": ["*"],
                            "Resources": ["*"],
                            "Exceptions": {
                                "Accounts": ["cluster_1"],
                                "Regions": ["namespace1", "namespace2"],
                            },
                        }
                    }
                }
            }
        }

        mutelist = KubernetesMutelist(mutelist_content=mutelist_content)

        finding = MagicMock
        finding.check_metadata = MagicMock
        finding.check_metadata.CheckID = "apiserver_etcd_cafile_set"
        finding.status = "FAIL"
        finding.resource_name = "test_resource"
        finding.namespace = "namespace1"
        finding.resource_tags = []

        assert not mutelist.is_finding_muted(finding, "cluster_1")

    def test_is_finding_muted_apiserver_star_within_check_name(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "*": {
                    "Checks": {
                        "apiserver_*": {
                            "Regions": ["*"],
                            "Resources": ["*"],
                            "Exceptions": {
                                "Accounts": ["k8s-cluster-1"],
                                "Regions": ["namespace1", "namespace2"],
                            },
                        }
                    }
                }
            }
        }

        mutelist = KubernetesMutelist(mutelist_content=mutelist_content)

        finding = MagicMock
        finding.check_metadata = MagicMock
        finding.check_metadata.CheckID = "apiserver_etcd_cafile_set"
        finding.status = "FAIL"
        finding.resource_name = "test_resource"
        finding.namespace = "namespace1"
        finding.resource_tags = []

        assert mutelist.is_finding_muted(finding, "cluster_1")

    def test_mute_finding(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "cluster_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = KubernetesMutelist(mutelist_content=mutelist_content)

        finding_1 = generate_finding_output(
            check_id="service_check_test",
            status="FAIL",
            account_uid="cluster_1",
            region="test-region",
            resource_uid="test_resource",
            resource_tags={},
            muted=False,
        )

        muted_finding = mutelist.mute_finding(finding_1)

        assert muted_finding.status == "MUTED"
        assert muted_finding.muted is True
        assert muted_finding.raw["status"] == "FAIL"
```

--------------------------------------------------------------------------------

---[FILE: kubernetes_mutelist.yaml]---
Location: prowler-master/tests/providers/kubernetes/lib/mutelist/fixtures/kubernetes_mutelist.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "cluster_1":
      Checks:
        "controllermanager_bind_address":
          Regions:
            - "*"
          Resources:
            - "resource_1"
            - "resource_2"
```

--------------------------------------------------------------------------------

---[FILE: kubernetes_service_test.py]---
Location: prowler-master/tests/providers/kubernetes/lib/service/kubernetes_service_test.py

```python
# This file needs to be named with the provider at the beginning since there is a limitation in pytest and two tests files cannot have the same name
# https://github.com/pytest-dev/pytest/issues/774#issuecomment-112343498
from kubernetes import client

from prowler.providers.kubernetes.lib.service.service import KubernetesService
from tests.providers.kubernetes.kubernetes_fixtures import (
    set_mocked_kubernetes_provider,
)


class TestKubernetesService:
    def test_KubernetesService_init(self):
        kubernetes_provider = set_mocked_kubernetes_provider()
        service = KubernetesService(kubernetes_provider)

        assert service.context is None
        assert service.api_client == client.ApiClient
```

--------------------------------------------------------------------------------

---[FILE: role_permissions_test.py]---
Location: prowler-master/tests/providers/kubernetes/services/rbac/lib/role_permissions_test.py

```python
from prowler.providers.kubernetes.services.rbac.lib.role_permissions import (
    is_rule_allowing_permissions,
)
from prowler.providers.kubernetes.services.rbac.rbac_service import Rule


class TestCheckRolePermissions:
    def test_is_rule_allowing_permissions(self):
        # Define some sample rules, resources, and verbs for testing
        rules = [
            # Rule 1: Allows 'get' and 'list' on 'pods' and 'services'
            Rule(resources=["pods", "services"], verbs=["get", "list"]),
            # Rule 2: Allows 'create' and 'delete' on 'deployments'
            Rule(resources=["deployments"], verbs=["create", "delete"]),
        ]
        resources = ["pods", "deployments"]
        verbs = ["get", "create"]

        assert is_rule_allowing_permissions(rules, resources, verbs)

    def test_no_permissions(self):
        # Test when there are no rules
        rules = []
        resources = ["pods", "deployments"]
        verbs = ["get", "create"]

        assert not is_rule_allowing_permissions(rules, resources, verbs)

    def test_no_matching_rules(self):
        # Test when there are rules, but none match the specified resources and verbs
        rules = [
            Rule(resources=["services"], verbs=["get", "list"]),
            Rule(resources=["pods"], verbs=["create", "delete"]),
        ]
        resources = ["deployments", "configmaps"]
        verbs = ["get", "create"]

        assert not is_rule_allowing_permissions(rules, resources, verbs)

    def test_empty_rules(self):
        # Test when the rules list is empty
        rules = []
        resources = ["pods", "deployments"]
        verbs = ["get", "create"]

        assert not is_rule_allowing_permissions(rules, resources, verbs)

    def test_empty_resources_and_verbs(self):
        # Test when resources and verbs are empty lists
        rules = [
            Rule(resources=["pods"], verbs=["get"]),
            Rule(resources=["services"], verbs=["list"]),
        ]
        resources = []
        verbs = []

        assert not is_rule_allowing_permissions(rules, resources, verbs)

    def test_matching_rule_with_empty_resources_or_verbs(self):
        # Test when a rule matches, but either resources or verbs are empty
        rules = [
            Rule(resources=["pods"], verbs=["get"]),
            Rule(resources=["services"], verbs=["list"]),
        ]
        resources = []
        verbs = ["get"]

        assert not is_rule_allowing_permissions(rules, resources, verbs)

        resources = ["pods"]
        verbs = []

        assert not is_rule_allowing_permissions(rules, resources, verbs)

    def test_rule_with_ignored_api_groups(self):
        # Test when a rule has apiGroups that are not relevant
        rules = [
            Rule(resources=["pods"], verbs=["get"], apiGroups=["test"]),
            Rule(resources=["services"], verbs=["list"], apiGroups=["test2"]),
        ]
        resources = ["pods"]
        verbs = ["get"]

        assert not is_rule_allowing_permissions(rules, resources, verbs)

    def test_rule_with_relevant_api_groups(self):
        # Test when a rule has apiGroups that are relevant
        rules = [
            Rule(resources=["pods"], verbs=["get"], apiGroups=["", "v1"]),
            Rule(resources=["services"], verbs=["list"], apiGroups=["test2"]),
        ]
        resources = ["pods"]
        verbs = ["get"]

        assert is_rule_allowing_permissions(rules, resources, verbs)
```

--------------------------------------------------------------------------------

---[FILE: m365_fixtures.py]---
Location: prowler-master/tests/providers/m365/m365_fixtures.py

```python
from unittest.mock import MagicMock

from azure.identity import DefaultAzureCredential

from prowler.providers.m365.m365_provider import M365Provider
from prowler.providers.m365.models import (
    M365Credentials,
    M365IdentityInfo,
    M365RegionConfig,
)

# Azure Identity
IDENTITY_ID = "00000000-0000-0000-0000-000000000000"
IDENTITY_TYPE = "Application"
TENANT_ID = "00000000-0000-0000-0000-000000000000"
CLIENT_ID = "00000000-0000-0000-0000-000000000000"
CLIENT_SECRET = "00000000-0000-0000-0000-000000000000"
DOMAIN = "user.onmicrosoft.com"
LOCATION = "global"


# Mocked Azure Audit Info
def set_mocked_m365_provider(
    session_credentials: DefaultAzureCredential = DefaultAzureCredential(),
    credentials: M365Credentials = M365Credentials(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        tenant_id=TENANT_ID,
    ),
    identity: M365IdentityInfo = M365IdentityInfo(
        identity_id=IDENTITY_ID,
        identity_type=IDENTITY_TYPE,
        tenant_id=TENANT_ID,
        tenant_domain=DOMAIN,
        user="user@email.com",
    ),
    audit_config: dict = None,
    azure_region_config: M365RegionConfig = M365RegionConfig(),
) -> M365Provider:
    provider = MagicMock()
    provider.type = "m365"
    provider.session.credentials = session_credentials
    provider.credentials = credentials
    provider.identity = identity
    provider.audit_config = audit_config
    provider.region_config = azure_region_config

    return provider
```

--------------------------------------------------------------------------------

````
