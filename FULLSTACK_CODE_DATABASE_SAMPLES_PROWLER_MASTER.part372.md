---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 372
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 372 of 867)

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

---[FILE: apiserver_security_context_deny_plugin.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_security_context_deny_plugin/apiserver_security_context_deny_plugin.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_security_context_deny_plugin(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            security_context_deny_set = False
            pod_security_policy_set = False
            for container in pod.containers.values():
                pod_security_policy_set = False
                security_context_deny_set = False
                for command in container.command:
                    if command.startswith("--enable-admission-plugins"):
                        if "SecurityContextDeny" in (command.split("=")[1]):
                            security_context_deny_set = True
                        if "PodSecurityPolicy" in (command.split("=")[1]):
                            pod_security_policy_set = True
                if not pod_security_policy_set or not security_context_deny_set:
                    break

            if pod_security_policy_set:
                report.status = "PASS"
                report.status_extended = (
                    f"PodSecurityPolicy is in use in pod {pod.name}."
                )
            elif security_context_deny_set:
                report.status = "PASS"
                report.status_extended = f"SecurityContextDeny admission control plugin is set in pod {pod.name}."
            else:
                report.status = "FAIL"
                report.status_extended = f"Neither SecurityContextDeny nor PodSecurityPolicy admission control plugins are set in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_service_account_key_file_set.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_service_account_key_file_set/apiserver_service_account_key_file_set.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_service_account_key_file_set",
  "CheckTitle": "Ensure that the --service-account-key-file argument is set as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured with a --service-account-key-file argument, specifying the public key file for service account verification. A separate key pair for service accounts enhances security by enabling key rotation and ensuring service account tokens are verified with a specific public key.",
  "Risk": "Without a specified service account public key file, the API server may use the private key from its TLS serving certificate, hindering the ability to rotate keys and increasing security risks.",
  "RelatedUrl": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/",
  "Remediation": {
    "Code": {
      "CLI": "--service-account-key-file=<path/to/key-file>",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-service-account-key-file-argument-is-set-as-appropriate",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Specify a separate public key file for verifying service account tokens in pod {pod.name}.",
      "Url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection"
    }
  },
  "Categories": [
    "trustboundaries",
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure the public key used is securely managed and rotated in accordance with your organization's security policy."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_service_account_key_file_set.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_service_account_key_file_set/apiserver_service_account_key_file_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_service_account_key_file_set(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Service account key file is set appropriately in pod {pod.name}."
            )

            for container in pod.containers.values():
                # Check if "--service-account-key-file" is set
                if "--service-account-key-file" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Service account key file is not set in pod {pod.name}."
                    )
                    break

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_service_account_lookup_true.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_service_account_lookup_true/apiserver_service_account_lookup_true.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_service_account_lookup_true",
  "CheckTitle": "Ensure that the --service-account-lookup argument is set to true",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured with --service-account-lookup set to true. This setting validates the service account associated with each request, ensuring that the service account token is not only valid but also currently exists.",
  "Risk": "If --service-account-lookup is disabled, deleted service accounts might still be used, posing a security risk.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/",
  "Remediation": {
    "Code": {
      "CLI": "--service-account-lookup=true",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-service-account-lookup-argument-is-set-to-true",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable service account lookup in the API server to ensure that only existing service accounts are used for authentication.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/#service-account-tokens"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, this argument is set to true. It's critical to maintain this setting for security."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_service_account_lookup_true.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_service_account_lookup_true/apiserver_service_account_lookup_true.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_service_account_lookup_true(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Service account lookup is set to true in pod {pod.name}."
            )

            for container in pod.containers.values():
                # Check if "--service-account-lookup" is set to true
                if "--service-account-lookup=true" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Service account lookup is not set to true in pod {pod.name}."
                    )
                    break

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_service_account_plugin.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_service_account_plugin/apiserver_service_account_plugin.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_service_account_plugin",
  "CheckTitle": "Ensure that the admission control plugin ServiceAccount is set",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check verifies that the ServiceAccount admission control plugin is enabled in the Kubernetes API server. This plugin automates the creation and assignment of service accounts to pods, enhancing security by managing service account tokens.",
  "Risk": "If the ServiceAccount admission plugin is disabled, pods might be assigned the default service account without proper token management, leading to potential security risks.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/",
  "Remediation": {
    "Code": {
      "CLI": "--enable-admission-plugins=...,ServiceAccount,...",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-admission-control-plugin-serviceaccount-is-set",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable the ServiceAccount admission control plugin in the API server to manage service accounts and tokens securely.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#serviceaccount"
    }
  },
  "Categories": [
    "trustboundaries",
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "ServiceAccount plugin is usually enabled by default, ensuring automated management of service accounts and their associated tokens."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_service_account_plugin.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_service_account_plugin/apiserver_service_account_plugin.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_service_account_plugin(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"ServiceAccount admission control plugin is set in pod {pod.name}."
            )

            service_account_plugin_set = False
            for container in pod.containers.values():
                service_account_plugin_set = False
                # Check if "--enable-admission-plugins" includes "ServiceAccount"
                # and "--disable-admission-plugins" does not include "ServiceAccount"
                for command in container.command:
                    if command.startswith("--enable-admission-plugins"):
                        if "ServiceAccount" in (command.split("=")[1]):
                            service_account_plugin_set = True
                    elif command.startswith("--disable-admission-plugins"):
                        if "ServiceAccount" in (command.split("=")[1]):
                            service_account_plugin_set = False
                if not service_account_plugin_set:
                    break

            if not service_account_plugin_set:
                report.status = "FAIL"
                report.status_extended = f"ServiceAccount admission control plugin is not set in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_strong_ciphers_only.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_strong_ciphers_only/apiserver_strong_ciphers_only.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_strong_ciphers_only",
  "CheckTitle": "Ensure that the API Server only makes use of Strong Cryptographic Ciphers",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured to only use strong cryptographic ciphers, minimizing the risk of vulnerabilities associated with weaker ciphers. Strong ciphers enhance the security of TLS connections to the API server.",
  "Risk": "Using weak ciphers can leave the API server vulnerable to cryptographic attacks, compromising the security of data in transit.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/",
  "Remediation": {
    "Code": {
      "CLI": "--tls-cipher-suites=TLS_AES_128_GCM_SHA256,...",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-kubelet-only-makes-use-of-strong-cryptographic-ciphers#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the API server to only use strong cryptographic ciphers for enhanced security.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/#options"
    }
  },
  "Categories": [
    "encryption",
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "The choice of ciphers may need to be updated based on evolving security standards and client compatibility."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_strong_ciphers_only.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_strong_ciphers_only/apiserver_strong_ciphers_only.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)

default_apiserver_strong_ciphers = [
    "TLS_AES_128_GCM_SHA256",
    "TLS_AES_256_GCM_SHA384",
    "TLS_CHACHA20_POLY1305_SHA256",
]


class apiserver_strong_ciphers_only(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"API Server is configured with strong cryptographic ciphers in pod {pod.name}."
            strong_ciphers_set = False
            for container in pod.containers.values():
                strong_ciphers_set = False
                # Check if strong ciphers are set in "--tls-cipher-suites"
                for command in container.command:
                    if command.startswith("--tls-cipher-suites"):
                        configured_ciphers = set(command.split("=")[1].split(","))
                        allowed_ciphers = set(
                            apiserver_client.audit_config.get(
                                "apiserver_strong_ciphers",
                                default_apiserver_strong_ciphers,
                            )
                        )
                        if configured_ciphers.issubset(allowed_ciphers):
                            strong_ciphers_set = True
                if not strong_ciphers_set:
                    break

            if not strong_ciphers_set:
                report.status = "FAIL"
                report.status_extended = f"API Server is not using only strong cryptographic ciphers in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_tls_config.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_tls_config/apiserver_tls_config.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_tls_config",
  "CheckTitle": "Ensure that the --tls-cert-file and --tls-private-key-file arguments are set as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured with TLS for secure communication. The --tls-cert-file and --tls-private-key-file arguments should be set to enable TLS encryption, thereby securing sensitive data transmitted to and from the API server.",
  "Risk": "If TLS is not properly configured, the API server communication could be unencrypted, leading to potential data breaches.",
  "RelatedUrl": "https://kubernetes.io/docs/setup/best-practices/certificates/",
  "Remediation": {
    "Code": {
      "CLI": "--tls-cert-file=<path/to/tls-certificate-file> --tls-private-key-file=<path/to/tls-key-file>",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-tls-cert-file-and-tls-private-key-file-arguments-are-set-as-appropriate",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure TLS is enabled and properly configured for the API server to secure communications.",
      "Url": "https://kubernetes.io/docs/setup/best-practices/certificates/#certificate-paths"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "TLS should be a standard security measure for all Kubernetes deployments to protect sensitive data."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_tls_config.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_tls_config/apiserver_tls_config.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_tls_config(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"TLS certificate and key are set appropriately in pod {pod.name}."
            )
            for container in pod.containers.values():
                # Check if both "--tls-cert-file" and "--tls-private-key-file" are set
                if "--tls-cert-file" not in str(
                    container.command
                ) or "--tls-private-key-file" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = (
                        f"TLS certificate and/or key are not set in pod {pod.name}."
                    )
                    break

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_client.py]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.kubernetes.services.controllermanager.controllermanager_service import (
    ControllerManager,
)

controllermanager_client = ControllerManager(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_service.py]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_service.py

```python
from prowler.lib.logger import logger
from prowler.providers.kubernetes.kubernetes_provider import KubernetesProvider
from prowler.providers.kubernetes.lib.service.service import KubernetesService
from prowler.providers.kubernetes.services.core.core_client import core_client


class ControllerManager(KubernetesService):
    def __init__(self, provider: KubernetesProvider):
        super().__init__(provider)
        self.client = core_client

        self.controllermanager_pods = self._get_controllermanager_pods()

    def _get_controllermanager_pods(self):
        try:
            controllermanager_pods = []
            for pod in self.client.pods.values():
                if pod.namespace == "kube-system" and pod.name.startswith(
                    "kube-controller-manager"
                ):
                    controllermanager_pods.append(pod)
            return controllermanager_pods
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_bind_address.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_bind_address/controllermanager_bind_address.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "controllermanager_bind_address",
  "CheckTitle": "Ensure that the --bind-address argument is set to 127.0.0.1",
  "CheckType": [],
  "ServiceName": "controllermanager",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesControllerManager",
  "Description": "This check verifies that the Kubernetes Controller Manager is bound to the loopback address (127.0.0.1) to minimize the cluster's attack surface. Binding to the loopback address ensures that the Controller Manager API service is not exposed to unauthorized network access.",
  "Risk": "Binding the Controller Manager to a non-loopback address exposes sensitive health and metrics information without authentication or encryption.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/",
  "Remediation": {
    "Code": {
      "CLI": "--bind-address=127.0.0.1",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-bind-address-argument-is-set-to-127001",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Bind the Controller Manager to the loopback address for enhanced security.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Check for the --address argument as well, as it might be used instead of --bind-address in certain Kubernetes versions."
}
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_bind_address.py]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_bind_address/controllermanager_bind_address.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.controllermanager.controllermanager_client import (
    controllermanager_client,
)


class controllermanager_bind_address(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in controllermanager_client.controllermanager_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Controller Manager is bound to the loopback address in pod {pod.name}."
            for container in pod.containers.values():
                if "--bind-address=127.0.0.1" not in str(
                    container.command
                ) and "--address=127.0.0.1" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = f"Controller Manager is not bound to the loopback address in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_disable_profiling.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_disable_profiling/controllermanager_disable_profiling.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "controllermanager_disable_profiling",
  "CheckTitle": "Ensure that the --profiling argument is set to false",
  "CheckType": [],
  "ServiceName": "controllermanager",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesControllerManager",
  "Description": "This check ensures that profiling is disabled in the Kubernetes Controller Manager, reducing the potential attack surface.",
  "Risk": "Enabling profiling can expose detailed system and program information, which could be exploited if accessed by unauthorized users.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/",
  "Remediation": {
    "Code": {
      "CLI": "--profiling=false",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-profiling-argument-is-set-to-false",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable profiling in the Kubernetes Controller Manager for enhanced security.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/#options"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Profiling should be turned off unless it is explicitly required for troubleshooting performance issues."
}
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_disable_profiling.py]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_disable_profiling/controllermanager_disable_profiling.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.controllermanager.controllermanager_client import (
    controllermanager_client,
)


class controllermanager_disable_profiling(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in controllermanager_client.controllermanager_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Controller Manager does not have profiling enabled in pod {pod.name}."
            )
            for container in pod.containers.values():
                if "--profiling=false" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Controller Manager has profiling enabled in pod {pod.name}."
                    )
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_garbage_collection.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_garbage_collection/controllermanager_garbage_collection.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "controllermanager_garbage_collection",
  "CheckTitle": "Ensure that the --terminated-pod-gc-threshold argument is set as appropriate",
  "CheckType": [],
  "ServiceName": "controllermanager",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesControllerManager",
  "Description": "Activate garbage collector on pod termination, as appropriate. Garbage collection is crucial for maintaining resource availability and performance. The default threshold for garbage collection is 12,500 terminated pods, which may be too high for some systems. Adjusting this threshold based on system resources and performance tests is recommended.",
  "Risk": "A high threshold for garbage collection can lead to degraded performance and resource exhaustion. In extreme cases, it might cause system crashes or prolonged unavailability.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection",
  "Remediation": {
    "Code": {
      "CLI": "--terminated-pod-gc-threshold=10",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-terminated-pod-gc-threshold-argument-is-set-as-appropriate",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review and adjust the --terminated-pod-gc-threshold argument in the kube-controller-manager to ensure efficient garbage collection and optimal resource utilization.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/"
    }
  },
  "Categories": [
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "The default value of --terminated-pod-gc-threshold is 12500. Adjust according to your specific cluster workload and performance requirements."
}
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_garbage_collection.py]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_garbage_collection/controllermanager_garbage_collection.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.controllermanager.controllermanager_client import (
    controllermanager_client,
)


class controllermanager_garbage_collection(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in controllermanager_client.controllermanager_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Controller Manager has an appropriate garbage collection threshold in pod {pod.name}."
            for container in pod.containers.values():
                if "--terminated-pod-gc-threshold=12500" in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = f"Controller Manager has the default garbage collection threshold in pod {pod.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_root_ca_file_set.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_root_ca_file_set/controllermanager_root_ca_file_set.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "controllermanager_root_ca_file_set",
  "CheckTitle": "Ensure that the --root-ca-file argument is set as appropriate",
  "CheckType": [],
  "ServiceName": "controllermanager",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesControllerManager",
  "Description": "This check verifies that the Kubernetes Controller Manager is configured with the --root-ca-file argument set to a certificate bundle file, allowing pods to verify the API server's serving certificate.",
  "Risk": "Not setting the root CA file can expose pods to man-in-the-middle attacks due to unverified TLS connections to the API server.",
  "RelatedUrl": "https://kubernetes.io/docs/setup/best-practices/certificates/",
  "Remediation": {
    "Code": {
      "CLI": "--root-ca-file=/path/to/ca-file",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-root-ca-file-argument-is-set-as-appropriate",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure the Controller Manager with a root CA file to enhance security for pods communicating with the API server.",
      "Url": "https://kubernetes.io/docs/setup/best-practices/certificates/#certificate-paths"
    }
  },
  "Categories": [
    "encryption",
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure that the certificate bundle file is properly maintained and updated as needed."
}
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_root_ca_file_set.py]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_root_ca_file_set/controllermanager_root_ca_file_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.controllermanager.controllermanager_client import (
    controllermanager_client,
)


class controllermanager_root_ca_file_set(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in controllermanager_client.controllermanager_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Controller Manager does not have the root CA file set in pod {pod.name}."
            for container in pod.containers.values():
                if "--root-ca-file=" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = f"Controller Manager has the root CA file set in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_rotate_kubelet_server_cert.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_rotate_kubelet_server_cert/controllermanager_rotate_kubelet_server_cert.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "controllermanager_rotate_kubelet_server_cert",
  "CheckTitle": "Ensure that the RotateKubeletServerCertificate argument is set to true",
  "CheckType": [],
  "ServiceName": "controllermanager",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesControllerManager",
  "Description": "This check ensures that the Kubernetes Controller Manager is configured with the RotateKubeletServerCertificate argument set to true, enabling automated rotation of kubelet server certificates.",
  "Risk": "Not enabling kubelet server certificate rotation could lead to downtime due to expired certificates.",
  "RelatedUrl": "https://kubernetes.io/docs/tasks/tls/certificate-rotation/",
  "Remediation": {
    "Code": {
      "CLI": "--feature-gates='RotateKubeletServerCertificate=true'",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-rotatekubeletservercertificate-argument-is-set-to-true-for-controller-manager#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable kubelet server certificate rotation in the Controller Manager for automated certificate management.",
      "Url": "https://kubernetes.io/docs/tasks/tls/certificate-rotation/#understanding-the-certificate-rotation-configuration"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure that your cluster setup supports kubelet server certificate rotation."
}
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_rotate_kubelet_server_cert.py]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_rotate_kubelet_server_cert/controllermanager_rotate_kubelet_server_cert.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.controllermanager.controllermanager_client import (
    controllermanager_client,
)


class controllermanager_rotate_kubelet_server_cert(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in controllermanager_client.controllermanager_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Controller Manager has RotateKubeletServerCertificate set to true in pod {pod.name}."
            kubelete_server_cert = True
            for container in pod.containers.values():
                kubelete_server_cert = True
                for command in container.command:
                    if command.startswith("--feature-gates"):
                        if "RotateKubeletServerCertificate=true" not in (
                            command.split("=")[1]
                        ):
                            kubelete_server_cert = False
                if not kubelete_server_cert:
                    break
            if not kubelete_server_cert:
                report.status = "FAIL"
                report.status_extended = f"Controller Manager does not have RotateKubeletServerCertificate set to true in pod {pod.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_service_account_credentials.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_service_account_credentials/controllermanager_service_account_credentials.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "controllermanager_service_account_credentials",
  "CheckTitle": "Ensure that the --use-service-account-credentials argument is set to true",
  "CheckType": [],
  "ServiceName": "controllermanager",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesControllerManager",
  "Description": "This check verifies that the Kubernetes Controller Manager is configured to use individual service account credentials for each controller, enhancing the security and role separation within the Kubernetes system.",
  "Risk": "Not using individual service account credentials can lead to overly broad permissions and potential security risks.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/",
  "Remediation": {
    "Code": {
      "CLI": "--use-service-account-credentials=true",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-use-service-account-credentials-argument-is-set-to-true",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure the Controller Manager to use individual service account credentials for enhanced security and role separation.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/#options"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure that appropriate roles and permissions are set for each service account when enabling this feature."
}
```

--------------------------------------------------------------------------------

````
