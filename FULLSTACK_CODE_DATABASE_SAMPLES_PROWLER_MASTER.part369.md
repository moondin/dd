---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 369
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 369 of 867)

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

---[FILE: kubernetes_provider.py]---
Location: prowler-master/prowler/providers/kubernetes/kubernetes_provider.py

```python
import os
from typing import Union

from colorama import Fore, Style
from kubernetes.client import ApiClient, Configuration
from kubernetes.client.exceptions import ApiException
from kubernetes.config.config_exception import ConfigException
from requests.exceptions import Timeout
from yaml import parser, safe_load

from kubernetes import client, config
from prowler.config.config import (
    default_config_file_path,
    get_default_mute_file_path,
    load_and_validate_config_file,
)
from prowler.lib.logger import logger
from prowler.lib.utils.utils import print_boxes
from prowler.providers.common.models import Audit_Metadata, Connection
from prowler.providers.common.provider import Provider
from prowler.providers.kubernetes.exceptions.exceptions import (
    KubernetesAPIError,
    KubernetesCloudResourceManagerAPINotUsedError,
    KubernetesError,
    KubernetesInvalidKubeConfigFileError,
    KubernetesInvalidProviderIdError,
    KubernetesSetUpSessionError,
    KubernetesTimeoutError,
)
from prowler.providers.kubernetes.lib.mutelist.mutelist import KubernetesMutelist
from prowler.providers.kubernetes.models import (
    KubernetesIdentityInfo,
    KubernetesSession,
)


class KubernetesProvider(Provider):
    """
    Represents the Kubernetes provider.

    Attributes:
        _type (str): The provider type, wich is 'kubernetes'.
        _session (KubernetesSession): The Kubernetes session.
        _namespaces (list): The list of namespaces to audit.
        _audit_config (dict): The audit configuration.
        _identity (KubernetesIdentityInfo): The Kubernetes identity information.
        _mutelist (dict): The mutelist.
        audit_metadata (Audit_Metadata): The audit metadata.

    Methods:
        setup_session: Sets up the Kubernetes session.
        test_connection: Tests the connection to the Kubernetes cluster.
        search_and_save_roles: Searches for and saves roles.
        get_context_user_roles: Retrieves the context user roles.
        get_all_namespaces: Retrieves all namespaces.
        get_pod_current_namespace: Retrieves the current namespace from the pod's mounted service account info.
        print_credentials: Prints the Kubernetes credentials.
    """

    _type: str = "kubernetes"
    _session: KubernetesSession
    _namespaces: list
    _audit_config: dict
    _identity: KubernetesIdentityInfo
    _mutelist: dict
    # TODO: this is not optional, enforce for all providers
    audit_metadata: Audit_Metadata

    def __init__(
        self,
        kubeconfig_file: str = None,
        context: str = None,
        namespace: list = None,
        cluster_name: str = None,
        config_path: str = None,
        config_content: dict = {},
        fixer_config: dict = {},
        mutelist_path: str = None,
        mutelist_content: dict = {},
        kubeconfig_content: Union[dict, str] = None,
    ):
        """
        Initializes the KubernetesProvider instance.

        Args:
            kubeconfig_file (str): Path to the kubeconfig file.
            kubeconfig_content (str or dict): Content of the kubeconfig file.
            context (str): Context name.
            cluster_name (str): Cluster name.
            namespace (list): List of namespaces.
            config_content (dict): Audit configuration.
            config_path (str): Path to the configuration file.
            fixer_config (dict): Fixer configuration.
            mutelist_path (str): Path to the mutelist file.
            mutelist_content (dict): Mutelist content.

        Raises:
            KubernetesCloudResourceManagerAPINotUsedError: If the Kubernetes Cloud Resource Manager API is not used.
            KubernetesError: If an error occurs.

        Returns:
            KubernetesProvider: The KubernetesProvider instance.

        Usage:
            - Authentication: The provider can be instantiated in two ways:
                1. Using the kubeconfig file.
                    >>> provider = KubernetesProvider(
                    ...     kubeconfig_file="~/.kube/config",
                    ...     context="my-context",
                    ...     namespace=["default"],
                    ... )
                2. Using the kubeconfig content.
                    >>> provider = KubernetesProvider(
                    ...     kubeconfig_content={"kubecofig": "content"},
                    ...     context="my-context",
                    ...     namespace=["default"],
                    ... )
            - Namespace and context: The provider can be instantiated with or without specifying the namespace and context.
                - Without specifying the namespace:
                    >>> provider = KubernetesProvider(
                    ...     kubeconfig_file="~/.kube/config",
                    ...     context="my-context",
                    ... )
                - With specifying the namespace:
                    >>> provider = KubernetesProvider(
                    ...     kubeconfig_file="~/.kube/config",
                    ...     context="my-context",
                    ...     namespace=["default"],
                    ... )
                - With specifying the context:
                    >>> provider = KubernetesProvider(
                    ...     kubeconfig_file="~/.kube/config",
                    ...     context="my-context",
                    ...     namespace=["default"],
                    ... )
            - Configuration: The provider can be instantiated with or without specifying the configuration.
                - Without specifying the configuration:
                    >>> provider = KubernetesProvider(
                    ...     kubeconfig_file="~/.kube/config",
                    ...     context="my-context",
                    ...     namespace=["default"],
                    ... )
                - With specifying the configuration:
                    >>> provider = KubernetesProvider(
                    ...     kubeconfig_file="~/.kube/config",
                    ...     context="my-context",
                    ...     namespace=["default"],
                    ...     config_path="path/to/config.yaml",
                    ... )
        """

        logger.info("Instantiating Kubernetes Provider ...")
        self._session = self.setup_session(
            kubeconfig_file, kubeconfig_content, context, cluster_name
        )
        if not namespace:
            logger.info("Retrieving all namespaces ...")
            self._namespaces = self.get_all_namespaces()
        else:
            self._namespaces = namespace

        if not self._session.api_client:
            logger.critical("Failed to set up a Kubernetes session.")
            raise KubernetesCloudResourceManagerAPINotUsedError(
                message="Failed to set up a Kubernetes session."
            )

        self._identity = KubernetesIdentityInfo(
            context=self._session.context["name"],
            user=self._session.context["context"]["user"],
            cluster=self._session.context["context"]["cluster"],
        )

        # Audit Config
        if config_content:
            self._audit_config = config_content
        else:
            if not config_path:
                config_path = default_config_file_path
            self._audit_config = load_and_validate_config_file(self._type, config_path)

        # Fixer Config
        self._fixer_config = fixer_config

        # Mutelist
        if mutelist_content:
            self._mutelist = KubernetesMutelist(
                mutelist_content=mutelist_content,
            )
        else:
            if not mutelist_path:
                mutelist_path = get_default_mute_file_path(self.type)
            self._mutelist = KubernetesMutelist(
                mutelist_path=mutelist_path,
            )

        Provider.set_global_provider(self)

    @property
    def type(self):
        return self._type

    @property
    def session(self):
        return self._session

    @property
    def identity(self):
        return self._identity

    @property
    def namespaces(self):
        return self._namespaces

    @property
    def audit_config(self):
        return self._audit_config

    @property
    def fixer_config(self):
        return self._fixer_config

    @property
    def mutelist(self) -> KubernetesMutelist:
        """
        mutelist method returns the provider's mutelist.
        """
        return self._mutelist

    @staticmethod
    def setup_session(
        kubeconfig_file: str = None,
        kubeconfig_content: Union[dict, str] = None,
        context: str = None,
        cluster_name: str = None,
    ) -> KubernetesSession:
        """
        Sets up the Kubernetes session.

        Args:
            kubeconfig_file (str): Path to the kubeconfig file.
            kubeconfig_content (str or dict): Content of the kubeconfig file.
            context (str): Context name.
            cluster_name (str): Cluster name.
        Returns:
            Tuple: A tuple containing the API client and the context.

        Raises:
            KubernetesInvalidKubeConfigFileError: If the kubeconfig file is invalid.
            KubernetesInvalidProviderIdError: If the provider ID is invalid.
            KubernetesSetUpSessionError: If an error occurs while setting up the session.
        """
        try:
            if kubeconfig_content:
                logger.info("Using kubeconfig content...")
                config_data = safe_load(kubeconfig_content)
                config.load_kube_config_from_dict(config_data, context=context)
                if context:
                    contexts = config_data.get("contexts", [])
                    for context_item in contexts:
                        if context_item["name"] == context:
                            context = context_item
                else:
                    context = config_data.get("contexts", [])[0]

                return KubernetesSession(
                    api_client=ApiClient(KubernetesProvider.set_proxy_settings()),
                    context=context,
                )

            else:
                logger.info(f"Using kubeconfig file: {kubeconfig_file}...")
                kubeconfig_file = (
                    kubeconfig_file if kubeconfig_file else "~/.kube/config"
                )
                try:
                    config.load_kube_config(
                        config_file=kubeconfig_file,
                        context=context,
                    )
                except ConfigException:
                    # If the kubeconfig file is not found, try to use the in-cluster config
                    logger.info("Using in-cluster config")
                    config.load_incluster_config()
                    # Use CLI flag or env var to set cluster name
                    resolved_cluster_name = cluster_name or os.getenv(
                        "CLUSTER_NAME", "in-cluster"
                    )
                    context = {
                        "name": "In-Cluster",
                        "context": {
                            "cluster": resolved_cluster_name,
                            "user": "service-account-name",
                        },
                    }

                    return KubernetesSession(
                        api_client=ApiClient(KubernetesProvider.set_proxy_settings()),
                        context=context,
                    )

                if context:
                    contexts = config.list_kube_config_contexts(
                        config_file=kubeconfig_file
                    )[0]
                    for context_item in contexts:
                        if context_item["name"] == context:
                            context = context_item
                else:
                    # If no context is provided, use the active context in the kubeconfig file
                    # The first element is the list of contexts, the second is the active context
                    context = config.list_kube_config_contexts(
                        config_file=kubeconfig_file
                    )[1]
                # Ensure proxy settings are respected
                configuration = Configuration.get_default_copy()
                proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
                if proxy:
                    configuration.proxy = proxy

                # Prevent SSL verification issues with internal proxies
                if os.environ.get("K8S_SKIP_TLS_VERIFY", "false").lower() == "true":
                    configuration.verify_ssl = False

                return KubernetesSession(
                    api_client=ApiClient(configuration), context=context
                )

        except parser.ParserError as parser_error:
            logger.critical(
                f"{parser_error.__class__.__name__}[{parser_error.__traceback__.tb_lineno}]: {parser_error}"
            )
            raise KubernetesInvalidKubeConfigFileError(
                original_exception=parser_error, file=os.path.abspath(__file__)
            )
        except ConfigException as config_error:
            logger.critical(
                f"{config_error.__class__.__name__}[{config_error.__traceback__.tb_lineno}]: {config_error}"
            )
            if f"Expected object with name {context} in kube-config/contexts" in str(
                config_error
            ):
                raise KubernetesInvalidProviderIdError(
                    original_exception=config_error, file=os.path.abspath(__file__)
                )
            else:
                raise KubernetesInvalidKubeConfigFileError(
                    original_exception=config_error, file=os.path.abspath(__file__)
                )
        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            raise KubernetesSetUpSessionError(
                original_exception=error, file=os.path.abspath(__file__)
            )

    @staticmethod
    def test_connection(
        kubeconfig_file: str = "~/.kube/config",
        kubeconfig_content: Union[dict, str] = None,
        namespace: str = None,
        provider_id: str = None,
        raise_on_exception: bool = True,
    ) -> Connection:
        """
        Tests the connection to the Kubernetes cluster.

        Args:
            kubeconfig_file (str): Path to the kubeconfig file.
            kubeconfig_content (str or dict): Content of the kubeconfig file.
            namespace (str): Namespace name.
            provider_id (str): Provider ID to use, in this case, the Kubernetes context.
            raise_on_exception (bool): Whether to raise an exception on error.

        Returns:
            Connection: A Connection object.

        Raises:
            KubernetesInvalidKubeConfigFileError: If the kubeconfig file is invalid.
            KubernetesInvalidProviderIdError: If the provider ID is invalid.
            KubernetesSetUpSessionError: If an error occurs while setting up the session.
            KubernetesAPIError: If an error occurs while testing the connection.

        Usage:
            - Using the kubeconfig file:
                >>> connection = KubernetesProvider.test_connection(
                ...     kubeconfig_file="~/.kube/config",
                ...     namespace="default",
                ...     provider_id="my-context",
                ...     raise_on_exception=True,
                ... )
            - Using the kubeconfig content:
                >>> connection = KubernetesProvider.test_connection(
                ...     kubeconfig_content="kubeconfig content",
                ...     namespace="default",
                ...     provider_id="my-context",
                ...     raise_on_exception=True,
                ... )
            - Using the namespace:
                >>> connection = KubernetesProvider.test_connection(
                ...     kubeconfig_file="~/.kube/config",
                ...     namespace="default",
                ...     provider_id="my-context",
                ...     raise_on_exception=True,
                ... )
            - Without raising an exception:
                >>> connection = KubernetesProvider.test_connection(
                ...     kubeconfig_file="~/.kube/config",
                ...     namespace="default",
                ...     provider_id="my-context",
                ...     raise_on_exception=False,
                ... )
        """
        try:
            KubernetesProvider.setup_session(
                kubeconfig_file=kubeconfig_file,
                kubeconfig_content=kubeconfig_content,
                context=provider_id,
            )
            if namespace:
                client.CoreV1Api().list_namespaced_pod(
                    namespace, timeout_seconds=2, _request_timeout=2
                )
            else:
                client.CoreV1Api().list_namespace(timeout_seconds=2, _request_timeout=2)
            return Connection(is_connected=True)
        except KubernetesInvalidKubeConfigFileError as invalid_kubeconfig_error:
            logger.critical(
                f"KubernetesInvalidKubeConfigFileError[{invalid_kubeconfig_error.__traceback__.tb_lineno}]: {invalid_kubeconfig_error}"
            )
            if raise_on_exception:
                raise invalid_kubeconfig_error
            return Connection(error=invalid_kubeconfig_error)
        except KubernetesInvalidProviderIdError as invalid_provider_id_error:
            logger.critical(
                f"KubernetesInvalidProviderIdError[{invalid_provider_id_error.__traceback__.tb_lineno}]: {invalid_provider_id_error}"
            )
            if raise_on_exception:
                raise invalid_provider_id_error
            return Connection(error=invalid_provider_id_error)
        except KubernetesSetUpSessionError as setup_session_error:
            logger.critical(
                f"KubernetesSetUpSessionError[{setup_session_error.__traceback__.tb_lineno}]: {setup_session_error}"
            )
            if raise_on_exception:
                raise setup_session_error
            return Connection(error=setup_session_error)
        except ApiException as api_error:
            logger.critical(
                f"ApiException[{api_error.__traceback__.tb_lineno}]: {api_error}"
            )
            if raise_on_exception:
                raise KubernetesAPIError(original_exception=api_error)
            return Connection(error=api_error)
        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            if raise_on_exception:
                raise KubernetesSetUpSessionError(original_exception=error)
            return Connection(error=error)

    def search_and_save_roles(
        self, roles: list, role_bindings, context_user: str, role_binding_type: str
    ):
        """
        Searches for and saves roles.

        Args:
            roles (list): A list to save the roles.
            role_bindings: Role bindings.
            context_user (str): Context user.
            role_binding_type (str): Role binding type.

        Returns:
            list: A list containing the roles.

        Raises:
            KubernetesError: If an error occurs.

        Usage:
            >>> roles = self.search_and_save_roles(
            ...     roles=[],
            ...     role_bindings=rbac_api.list_cluster_role_binding().items,
            ...     context_user="my-user",
            ...     role_binding_type="ClusterRole",
            ... )
        """
        try:
            for rb in role_bindings:
                if rb.subjects:
                    for subject in rb.subjects:
                        if subject.kind == "User" and subject.name == context_user:
                            if role_binding_type == "ClusterRole":
                                roles.append(f"{role_binding_type}: {rb.role_ref.name}")
                            elif role_binding_type == "Role":
                                roles.append(
                                    f"{role_binding_type} ({rb.metadata.namespace}): {rb.role_ref.name}"
                                )
            return roles
        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            raise KubernetesError(
                original_exception=error, file=os.path.abspath(__file__)
            )

    def get_context_user_roles(self):
        """
        Retrieves the context user roles.

        Returns:
            list: A list containing the context user roles.

        Raises:
            KubernetesError: If an error occurs.

        Usage:
            >>> roles = self.get_context_user_roles()
        """
        try:
            rbac_api = client.RbacAuthorizationV1Api()
            context_user = self._identity.user
            roles = []
            # Search in ClusterRoleBindings
            roles = self.search_and_save_roles(
                roles,
                rbac_api.list_cluster_role_binding().items,
                context_user,
                "ClusterRole",
            )

            # Search in RoleBindings for all namespaces
            roles = self.search_and_save_roles(
                roles,
                rbac_api.list_role_binding_for_all_namespaces().items,
                context_user,
                "Role",
            )
            logger.info("Context user roles retrieved successfully.")
            return roles
        except ApiException as api_error:
            logger.error(
                f"ApiException[{api_error.__traceback__.tb_lineno}]: {api_error}"
            )
        except KubernetesError as error:
            raise error
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def get_all_namespaces(self) -> list[str]:
        """
        Retrieves all namespaces.

        Returns:
            list: A list containing all namespace names.

        Raises:
            KubernetesAPIError: If an error occurs while retrieving the namespaces.
            KubernetesTimeoutError: If a timeout occurs while retrieving the namespaces.
            KubernetesError: If an error occurs.

        Usage:
            >>> namespaces = self.get_all_namespaces()
        """
        try:
            v1 = client.CoreV1Api()
            namespace_list = v1.list_namespace(timeout_seconds=2, _request_timeout=2)
            namespaces = [item.metadata.name for item in namespace_list.items]
            logger.info("All namespaces retrieved successfully.")
            return namespaces
        except ApiException as api_error:
            logger.critical(
                f"ApiException[{api_error.__traceback__.tb_lineno}]: {api_error}"
            )
            raise KubernetesAPIError(
                original_exception=api_error, file=os.path.abspath(__file__)
            )
        except Timeout as timeout_error:
            logger.critical(
                f"Timeout[{timeout_error.__traceback__.tb_lineno}]: {timeout_error}"
            )
            raise KubernetesTimeoutError(
                original_exception=timeout_error, file=os.path.abspath(__file__)
            )
        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            raise KubernetesError(
                original_exception=error, file=os.path.abspath(__file__)
            )

    def get_pod_current_namespace(self):
        """
        Retrieves the current namespace from the pod's mounted service account info.

        Returns:
            str: The current namespace.

        Usage:
            >>> namespace = self.get_pod_current_namespace()
        """
        try:
            with open(
                "/var/run/secrets/kubernetes.io/serviceaccount/namespace", "r"
            ) as f:
                return f.read().strip()
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return "default"

    def print_credentials(self):
        """
        Prints the Kubernetes credentials.

        Usage:
            >>> self.print_credentials()
        """
        if self._identity.context == "In-Cluster":
            report_lines = [
                f"Kubernetes Pod: {Fore.YELLOW}prowler{Style.RESET_ALL}",
                f"Namespace: {Fore.YELLOW}{self.get_pod_current_namespace()}{Style.RESET_ALL}",
            ]
        else:
            roles = self.get_context_user_roles()
            roles_str = ", ".join(roles) if roles else "No associated Roles"
            report_lines = [
                f"Kubernetes Cluster: {Fore.YELLOW}{self._identity.cluster}{Style.RESET_ALL}",
                f"User: {Fore.YELLOW}{self._identity.user}{Style.RESET_ALL}",
                f"Namespaces: {Fore.YELLOW}{', '.join(self.namespaces)}{Style.RESET_ALL}",
                f"Roles: {Fore.YELLOW}{roles_str}{Style.RESET_ALL}",
            ]
        report_title = (
            f"{Style.BRIGHT}Using the Kubernetes credentials below:{Style.RESET_ALL}"
        )
        print_boxes(report_lines, report_title)

    @staticmethod
    def set_proxy_settings() -> Configuration:
        """
        Returns the proxy settings respecting client's configuration from HTTPS_PROXY or K8S_SKIP_TLS_VERIFY.
        """
        configuration = Configuration.get_default_copy()
        proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
        if proxy:
            configuration.proxy = proxy
        # Prevent SSL verification issues with internal proxies
        if os.environ.get("K8S_SKIP_TLS_VERIFY", "false").lower() == "true":
            configuration.verify_ssl = False

        return configuration
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/providers/kubernetes/models.py

```python
from dataclasses import dataclass

from kubernetes import client

from prowler.config.config import output_file_timestamp
from prowler.providers.common.models import ProviderOutputOptions


@dataclass
class KubernetesIdentityInfo:
    context: str
    cluster: str
    user: str


@dataclass
class KubernetesSession:
    """
    KubernetesSession stores the Kubernetes session's configuration.

    """

    api_client: client.ApiClient
    context: dict


class KubernetesOutputOptions(ProviderOutputOptions):
    def __init__(self, arguments, bulk_checks_metadata, identity):
        # First call ProviderOutputOptions init
        super().__init__(arguments, bulk_checks_metadata)
        # TODO move the below if to ProviderOutputOptions
        # Check if custom output filename was input, if not, set the default
        if (
            not hasattr(arguments, "output_filename")
            or arguments.output_filename is None
        ):
            self.output_filename = f"prowler-output-{identity.context.replace(':', '_').replace('/', '_')}-{output_file_timestamp}"
        else:
            self.output_filename = arguments.output_filename
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: prowler-master/prowler/providers/kubernetes/exceptions/exceptions.py

```python
from prowler.exceptions.exceptions import ProwlerException


# Exceptions codes from 4000 to 4999 are reserved for Kubernetes exceptions
class KubernetesBaseException(ProwlerException):
    """Base class for Kubernetes errors."""

    KUBERNETES_ERROR_CODES = {
        (4000, "KubernetesCloudResourceManagerAPINotUsedError"): {
            "message": "Cloud Resource Manager API is not enabled, blocking access to necessary resources.",
            "remediation": "Refer to the Kubernetes documentation to enable the Cloud Resource Manager API: https://kubernetes.io/docs/reference/access-authn-authz/rbac/",
        },
        (4001, "KubernetesSetUpSessionError"): {
            "message": "Failed to establish a Kubernetes session, preventing further actions.",
            "remediation": "Verify your session setup, including credentials and Kubernetes cluster configuration. Refer to this guide for proper setup: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/",
        },
        (4002, "KubernetesAPIError"): {
            "message": "An error occurred while interacting with the Kubernetes API.",
            "remediation": "Check the API request and ensure it is properly formatted. Refer to the Kubernetes API documentation for guidance: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/",
        },
        (4003, "KubernetesTimeoutError"): {
            "message": "The request to the Kubernetes API timed out.",
            "remediation": "Check the network connection and the Kubernetes API server status. For information on troubleshooting timeouts, refer to the Kubernetes documentation: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#-strong-timeout-strong-",
        },
        (4004, "KubernetesError"): {
            "message": "An error occurred in the Kubernetes provider.",
            "remediation": "Check the provider code and configuration to identify the issue. For more information on troubleshooting Kubernetes providers, refer to the Kubernetes documentation: https://kubernetes.io/docs/reference/",
        },
        (4005, "KubernetesInvalidProviderIdError"): {
            "message": "The provider ID is invalid.",
            "remediation": "Check the provider ID and ensure it is correctly formatted. Refer to the Kubernetes documentation for guidance on provider IDs: https://kubernetes.io/docs/reference/access-authn-authz/rbac/",
        },
        (4006, "KubernetesInvalidKubeConfigFileError"): {
            "message": "The provided kube-config is invalid.",
            "remediation": "Review the kube-config and the attached error to get more details. Please, refer to the Kubernetes config documentation: https://kubernetes.io/docs/reference/config-api/kubeconfig.v1/#Config",
        },
    }

    def __init__(
        self,
        code,
        file=None,
        original_exception=None,
        message=None,
    ):
        provider = "Kubernetes"
        error_info = self.KUBERNETES_ERROR_CODES.get((code, self.__class__.__name__))
        if message:
            error_info["message"] = message
        super().__init__(
            code=code,
            source=provider,
            file=file,
            original_exception=original_exception,
            error_info=error_info,
        )


class KubernetesError(KubernetesBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(4004, file, original_exception, message)


class KubernetesCloudResourceManagerAPINotUsedError(KubernetesBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(4000, file, original_exception, message)


class KubernetesSetUpSessionError(KubernetesBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(4001, file, original_exception, message)


class KubernetesAPIError(KubernetesBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(4002, file, original_exception, message)


class KubernetesTimeoutError(KubernetesBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(4003, file, original_exception, message)


class KubernetesInvalidProviderIdError(KubernetesBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(4005, file, original_exception, message)


class KubernetesInvalidKubeConfigFileError(KubernetesBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(4006, file, original_exception, message)
```

--------------------------------------------------------------------------------

---[FILE: arguments.py]---
Location: prowler-master/prowler/providers/kubernetes/lib/arguments/arguments.py

```python
def init_parser(self):
    """Init the Kubernetes Provider CLI parser"""
    k8s_parser = self.subparsers.add_parser(
        "kubernetes", parents=[self.common_providers_parser], help="Kubernetes Provider"
    )
    # Authentication and Configuration
    k8s_auth_subparser = k8s_parser.add_argument_group(
        "Authentication and Configuration"
    )
    k8s_auth_subparser.add_argument(
        "--kubeconfig-file",
        nargs="?",
        metavar="FILE_PATH",
        help="Path to the kubeconfig file to use for CLI requests. Not necessary for in-cluster execution.",
        default="~/.kube/config",
    )
    k8s_auth_subparser.add_argument(
        "--context",
        nargs="?",
        metavar="CONTEXT_NAME",
        help="The name of the kubeconfig context to use. By default, current_context from config file will be used.",
    )
    k8s_auth_subparser.add_argument(
        "--namespace",
        "--namespaces",
        nargs="+",
        metavar="NAMESPACES",
        help="The namespaces where to scan for the Kubernetes resources. By default, Prowler will scan all namespaces available.",
    )
    k8s_auth_subparser.add_argument(
        "--cluster-name",
        nargs="?",
        metavar="CLUSTER_NAME",
        help="Manually specify the cluster name in in-cluster mode, by default it will be 'in-cluster'",
    )
```

--------------------------------------------------------------------------------

---[FILE: mutelist.py]---
Location: prowler-master/prowler/providers/kubernetes/lib/mutelist/mutelist.py

```python
from prowler.lib.check.models import Check_Report_Kubernetes
from prowler.lib.mutelist.mutelist import Mutelist
from prowler.lib.outputs.utils import unroll_dict, unroll_tags


class KubernetesMutelist(Mutelist):
    def is_finding_muted(
        self,
        finding: Check_Report_Kubernetes,
        cluster: str,
    ) -> bool:
        return self.is_muted(
            cluster,
            finding.check_metadata.CheckID,
            finding.namespace,
            finding.resource_name,
            unroll_dict(unroll_tags(finding.resource_tags)),
        )
```

--------------------------------------------------------------------------------

---[FILE: service.py]---
Location: prowler-master/prowler/providers/kubernetes/lib/service/service.py

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

from prowler.lib.logger import logger
from prowler.providers.kubernetes.kubernetes_provider import KubernetesProvider

MAX_WORKERS = 10


class KubernetesService:
    def __init__(self, provider: KubernetesProvider):
        self.context = provider.identity.context
        self.api_client = provider.session.api_client
        self.audit_config = provider.audit_config
        self.fixer_config = provider.fixer_config

        # Thread pool for __threading_call__
        self.thread_pool = ThreadPoolExecutor(max_workers=MAX_WORKERS)

    def __threading_call__(self, call, iterator):
        items = iterator
        # Determine the total count for logging
        item_count = len(items)

        # Trim leading and trailing underscores from the call's name
        call_name = call.__name__.strip("_")
        # Add Capitalization
        call_name = " ".join([x.capitalize() for x in call_name.split("_")])

        logger.info(
            f"{self.service.upper()} - Starting threads for '{call_name}' function to process {item_count} items..."
        )

        # Submit tasks to the thread pool
        futures = [self.thread_pool.submit(call, item) for item in items]

        # Wait for all tasks to complete
        for future in as_completed(futures):
            try:
                future.result()  # Raises exceptions from the thread, if any
            except Exception:
                # Handle exceptions if necessary
                pass  # Replace 'pass' with any additional exception handling logic. Currently handled within the called function
```

--------------------------------------------------------------------------------

---[FILE: apiserver_client.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.kubernetes.services.apiserver.apiserver_service import APIServer

apiserver_client = APIServer(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: apiserver_service.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_service.py

```python
from prowler.lib.logger import logger
from prowler.providers.kubernetes.kubernetes_provider import KubernetesProvider
from prowler.providers.kubernetes.lib.service.service import KubernetesService
from prowler.providers.kubernetes.services.core.core_client import core_client


class APIServer(KubernetesService):
    def __init__(self, provider: KubernetesProvider):
        super().__init__(provider)
        self.client = core_client

        self.apiserver_pods = self._get_apiserver_pods()

    def _get_apiserver_pods(self):
        try:
            apiserver_pods = []
            for pod in self.client.pods.values():
                if pod.namespace == "kube-system" and pod.name.startswith(
                    "kube-apiserver"
                ):
                    apiserver_pods.append(pod)
            return apiserver_pods
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
```

--------------------------------------------------------------------------------

---[FILE: apiserver_always_pull_images_plugin.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_always_pull_images_plugin/apiserver_always_pull_images_plugin.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_always_pull_images_plugin",
  "CheckTitle": "Ensure that the admission control plugin AlwaysPullImages is set",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check verifies that the AlwaysPullImages admission control plugin is enabled in the Kubernetes API server. This plugin ensures that every new pod always pulls the required images, enforcing image access control and preventing the use of possibly outdated or altered images.",
  "Risk": "Without AlwaysPullImages, once an image is pulled to a node, any pod can use it without any authorization check, potentially leading to security risks.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages",
  "Remediation": {
    "Code": {
      "CLI": "--enable-admission-plugins=...,AlwaysPullImages,...",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-admission-control-plugin-alwayspullimages-is-set#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure the API server to use the AlwaysPullImages admission control plugin to ensure image security and integrity.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers"
    }
  },
  "Categories": [
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enabling AlwaysPullImages can increase network and registry load and decrease container startup speed. It may not be suitable for all environments."
}
```

--------------------------------------------------------------------------------

````
