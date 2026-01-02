---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 376
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 376 of 867)

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

---[FILE: kubelet_rotate_certificates.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_rotate_certificates/kubelet_rotate_certificates.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_rotate_certificates",
  "CheckTitle": "Ensure that the kubelet client certificate rotation is enabled",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesKubelet",
  "Description": "This check ensures that the kubelet client certificate rotation is enabled, allowing for automated periodic rotation of credentials, thereby addressing availability concerns in the security triad. This is crucial for avoiding downtime due to expired certificates.",
  "Risk": "Not enabling kubelet client certificate rotation may lead to service interruptions due to expired certificates, compromising the availability of the node.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/",
  "Remediation": {
    "Code": {
      "CLI": "--rotate-certificates=true",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-rotate-certificates-argument-is-not-set-to-false",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable kubelet client certificate rotation for automated renewal of credentials.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#certificate-rotation"
    }
  },
  "Categories": [
    "encryption",
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Applicable if kubelets receive certificates from the API server. If using an external authority/tool for certificates, ensure rotation is handled appropriately."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_rotate_certificates.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_rotate_certificates/kubelet_rotate_certificates.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.kubelet.kubelet_client import kubelet_client


class kubelet_rotate_certificates(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for cm in kubelet_client.kubelet_config_maps:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=cm)
            if "rotateCertificates" not in cm.kubelet_args:
                report.status = "MANUAL"
                report.status_extended = f"Kubelet does not have the argument `streamingConnectionIdleTimeout` in config file {cm.name}, verify it in the node's arguments."
            else:
                if cm.kubelet_args["rotateCertificates"]:
                    report.status = "PASS"
                    report.status_extended = f"Kubelet has certificate rotation enabled in config file {cm.name}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Kubelet has client certificate rotation disabled in config file {cm.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_service_file_ownership_root.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_service_file_ownership_root/kubelet_service_file_ownership_root.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_service_file_ownership_root",
  "CheckTitle": "Ensure that the kubelet service file ownership is set to root:root",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesWorkerNode",
  "Description": "This check ensures that the kubelet service file on each Node is owned by root. Proper file ownership is critical for the security and integrity of the kubelet service configuration.",
  "Risk": "Incorrect ownership settings can lead to unauthorized modifications, potentially compromising the security and functionality of the kubelet service.",
  "RelatedUrl": "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/kubelet-integration/",
  "Remediation": {
    "Code": {
      "CLI": "chown root:root /etc/systemd/system/kubelet.service.d/kubeadm.conf",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Set the kubelet service file ownership to root:root to maintain its integrity.",
      "Url": "https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-config/"
    }
  },
  "Categories": [
    "node-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Regular checks for file ownership can prevent unauthorized changes."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_service_file_ownership_root.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_service_file_ownership_root/kubelet_service_file_ownership_root.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.lib.utils.utils import is_owned_by_root
from prowler.providers.kubernetes.services.core.core_client import core_client


class kubelet_service_file_ownership_root(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for node in core_client.nodes.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=node)
            # It can only be checked if Prowler is being executed inside a worker node or if the file is the default one
            if node.inside:
                if (
                    is_owned_by_root(
                        "/etc/systemd/system/kubelet.service.d/kubeadm.conf"
                    )
                    is None
                ):
                    report.status = "MANUAL"
                    report.status_extended = f"Kubelet service file not found in Node {node.name}, please verify Kubelet service file ownership manually."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Kubelet service file ownership is set to root:root in Node {node.name}."
                    if not is_owned_by_root(
                        "/etc/systemd/system/kubelet.service.d/kubeadm.conf"
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"Kubelet service file ownership is not set to root:root in Node {node.name}."
            else:
                report.status = "MANUAL"
                report.status_extended = f"Prowler is not being executed inside Node {node.name}, please verify Kubelet service file ownership manually."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_service_file_permissions.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_service_file_permissions/kubelet_service_file_permissions.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_service_file_permissions",
  "CheckTitle": "Ensure that the kubelet service file permissions are set to 600 or more restrictive",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesNode",
  "Description": "This check ensures that the kubelet service file on worker nodes has permissions set to 600 or more restrictive, limiting the file's write access to only system administrators. This measure is crucial to maintain the integrity and security of the kubelet service configuration.",
  "Risk": "Improper file permissions on the kubelet service file could lead to unauthorized modifications, compromising node security and stability.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-config/",
  "Remediation": {
    "Code": {
      "CLI": "chmod 600 /etc/systemd/system/kubelet.service.d/kubeadm.conf",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure the kubelet service file is securely configured with restrictive permissions.",
      "Url": "https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/#44-joining-your-nodes"
    }
  },
  "Categories": [
    "node-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "The file location may vary based on the Kubernetes installation and should be verified for each cluster."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_service_file_permissions.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_service_file_permissions/kubelet_service_file_permissions.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.lib.utils.utils import get_file_permissions
from prowler.providers.kubernetes.services.core.core_client import core_client


class kubelet_service_file_permissions(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for node in core_client.nodes.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=node)
            # It can only be checked if Prowler is being executed inside a worker node or if the file is the default one
            if node.inside:
                if not get_file_permissions(
                    "/etc/systemd/system/kubelet.service.d/kubeadm.conf"
                ):
                    report.status = "MANUAL"
                    report.status_extended = f"Kubelet service file not found in Node {node.name}, please verify Kubelet service file permissions manually."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Kubelet service file permissions are set to 600 or more restrictive in Node {node.name}."
                    if (
                        get_file_permissions(
                            "/etc/systemd/system/kubelet.service.d/kubeadm.conf"
                        )
                        > 0o600
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"Kubelet service file permissions are not set to 600 or more restrictive in Node {node.name}."
            else:
                report.status = "MANUAL"
                report.status_extended = f"Prowler is not being executed inside Node {node.name}, please verify Kubelet service file permissions manually."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_streaming_connection_timeout.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_streaming_connection_timeout/kubelet_streaming_connection_timeout.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_streaming_connection_timeout",
  "CheckTitle": "Ensure that the kubelet --streaming-connection-idle-timeout argument is not set to 0",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesKubelet",
  "Description": "This check ensures that the Kubelet is configured with a non-zero timeout for streaming connections. Setting a non-zero timeout helps protect against Denial-of-Service attacks and resource exhaustion due to idle connections.",
  "Risk": "A zero timeout on streaming connections can lead to Denial-of-Service attacks and resource exhaustion.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/",
  "Remediation": {
    "Code": {
      "CLI": "--streaming-connection-idle-timeout=<non-zero value>",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-streaming-connection-idle-timeout-argument-is-not-set-to-0",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure a non-zero timeout for streaming connections in kubelet to enhance node security.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/#options"
    }
  },
  "Categories": [
    "node-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Consider your environment's specific use cases to set an appropriate timeout value. The default value is 4 hours."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_streaming_connection_timeout.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_streaming_connection_timeout/kubelet_streaming_connection_timeout.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.kubelet.kubelet_client import kubelet_client


class kubelet_streaming_connection_timeout(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for cm in kubelet_client.kubelet_config_maps:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=cm)
            if "streamingConnectionIdleTimeout" not in cm.kubelet_args:
                report.status = "MANUAL"
                report.status_extended = f"Kubelet does not have the argument `streamingConnectionIdleTimeout` in config file {cm.name}, verify it in the node's arguments."
            else:
                if cm.kubelet_args["streamingConnectionIdleTimeout"] != 0:
                    report.status = "PASS"
                    report.status_extended = f"Kubelet is configured with a non-zero streaming connection idle timeout in config file {cm.name}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Kubelet has a streaming connection idle timeout set to 0 in config file {cm.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_strong_ciphers_only.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_strong_ciphers_only/kubelet_strong_ciphers_only.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_strong_ciphers_only",
  "CheckTitle": "Ensure that the Kubelet only makes use of Strong Cryptographic Ciphers",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesKubelet",
  "Description": "This check verifies that the kubelet is configured to use only strong cryptographic ciphers. Ensuring the use of strong ciphers is essential to minimize the risk of vulnerabilities and enhance the security of TLS connections to the kubelet.",
  "Risk": "Using weak ciphers can expose the kubelet to cryptographic attacks, compromising the security of data in transit.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/",
  "Remediation": {
    "Code": {
      "CLI": "--tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,...",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-kubelet-only-makes-use-of-strong-cryptographic-ciphers",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the kubelet to only use strong cryptographic ciphers for enhanced security.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/#options"
    }
  },
  "Categories": [
    "encryption",
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This list of ciphers may need to be updated based on evolving security standards and client compatibility."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_strong_ciphers_only.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_strong_ciphers_only/kubelet_strong_ciphers_only.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.kubelet.kubelet_client import kubelet_client

default_kubelet_strong_ciphers = [
    "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
    "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
    "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
    "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
    "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
    "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
    "TLS_RSA_WITH_AES_256_GCM_SHA384",
    "TLS_RSA_WITH_AES_128_GCM_SHA256",
]


class kubelet_strong_ciphers_only(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for cm in kubelet_client.kubelet_config_maps:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=cm)
            if "tlsCipherSuites" not in cm.kubelet_args:
                report.status = "MANUAL"
                report.status_extended = f"Kubelet does not have the argument `tlsCipherSuites` in config file {cm.name}, verify it in the node's arguments."
            else:
                if cm.kubelet_args["tlsCipherSuites"].issubset(
                    kubelet_client.audit_config.get(
                        "kubelet_strong_ciphers", default_kubelet_strong_ciphers
                    )
                ):
                    report.status = "PASS"
                    report.status_extended = f"Kubelet is configured with strong cryptographic ciphers in config file {cm.name}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Kubelet is not using only strong cryptographic ciphers in config file {cm.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_tls_cert_and_key.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_tls_cert_and_key/kubelet_tls_cert_and_key.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_tls_cert_and_key",
  "CheckTitle": "Ensure that the kubelet TLS certificate and private key are set appropriately",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesKubelet",
  "Description": "This check ensures that each Kubelet is configured with a TLS certificate and private key for secure connections. These settings are crucial for preventing man-in-the-middle attacks and ensuring secure communication between the apiserver and kubelets.",
  "Risk": "Not setting the kubelet's TLS certificate and private key can expose the node to security vulnerabilities and interception of sensitive data.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/",
  "Remediation": {
    "Code": {
      "CLI": "--tls-cert-file=<path/to/tls-certificate-file> --tls-private-key-file=<path/to/tls-key-file>",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-tls-cert-file-and-tls-private-key-file-arguments-are-set-as-appropriate-for-kubelet",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure each kubelet with its own TLS certificate and private key for secure connections.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates"
    }
  },
  "Categories": [
    "encryption",
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure each kubelet has a unique TLS certificate and key for enhanced security."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_tls_cert_and_key.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_tls_cert_and_key/kubelet_tls_cert_and_key.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.kubelet.kubelet_client import kubelet_client


class kubelet_tls_cert_and_key(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for cm in kubelet_client.kubelet_config_maps:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=cm)
            if (
                "tlsCertFile" not in cm.kubelet_args
                or "tlsPrivateKeyFile" not in cm.kubelet_args
            ):
                report.status = "FAIL"
                report.status_extended = f"Kubelet is missing TLS certificate and/or private key configuration in config file {cm.name}."
            else:
                report.status = "PASS"
                report.status_extended = f"Kubelet has appropriate TLS certificate and private key configured in config file {cm.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: rbac_client.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.kubernetes.services.rbac.rbac_service import Rbac

rbac_client = Rbac(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: rbac_service.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_service.py
Signals: Pydantic

```python
from typing import Any, List, Optional

from pydantic.v1 import BaseModel

from kubernetes import client
from prowler.lib.logger import logger
from prowler.providers.kubernetes.kubernetes_provider import KubernetesProvider
from prowler.providers.kubernetes.lib.service.service import KubernetesService


class Rbac(KubernetesService):
    def __init__(self, provider: KubernetesProvider):
        super().__init__(provider)
        self.client = client.RbacAuthorizationV1Api()

        self.cluster_role_bindings = self._list_cluster_role_bindings()
        self.role_bindings = self._list_role_bindings()
        self.cluster_roles = self._list_cluster_roles()
        self.roles = self._list_roles()

    def _list_cluster_role_bindings(self):
        try:
            bindings = {}
            for binding in self.client.list_cluster_role_binding().items:
                # For each binding, create a ClusterRoleBinding object and append it to the list
                formatted_binding = {
                    "metadata": binding.metadata,
                    "subjects": (
                        []
                        if not binding.subjects
                        else [
                            {
                                "kind": subject.kind,
                                "name": subject.name,
                                "namespace": getattr(subject, "namespace", ""),
                                "metadata": getattr(subject, "metadata", None),
                            }
                            for subject in binding.subjects
                        ]
                    ),
                    "roleRef": {
                        "kind": binding.role_ref.kind,
                        "name": binding.role_ref.name,
                        "apiGroup": binding.role_ref.api_group,
                    },
                }
                bindings[binding.metadata.uid] = ClusterRoleBinding(**formatted_binding)
            return bindings
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return {}

    def _list_role_bindings(self):
        try:
            role_bindings = {}
            for binding in self.client.list_role_binding_for_all_namespaces().items:
                formatted_binding = {
                    "metadata": binding.metadata,
                    "subjects": [
                        {
                            "kind": subject.kind,
                            "name": subject.name,
                            "namespace": getattr(subject, "namespace", None),
                            "metadata": getattr(subject, "metadata", None),
                        }
                        for subject in binding.subjects
                    ],
                    "roleRef": {
                        "kind": binding.role_ref.kind,
                        "name": binding.role_ref.name,
                        "apiGroup": binding.role_ref.api_group,
                    },
                }
                role_bindings[binding.metadata.uid] = RoleBinding(**formatted_binding)
            return role_bindings
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return {}

    def _list_roles(self):
        try:
            roles = {}
            for role in self.client.list_role_for_all_namespaces().items:
                formatted_role = {
                    "uid": role.metadata.uid,
                    "name": role.metadata.name,
                    "metadata": role.metadata,
                    "rules": [
                        {
                            "apiGroups": rule.api_groups,
                            "resources": rule.resources,
                            "verbs": rule.verbs,
                        }
                        for rule in (role.rules or [])
                    ],
                }
                roles[role.metadata.uid] = Role(**formatted_role)
            return roles
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return {}

    def _list_cluster_roles(self):
        try:
            cluster_roles = {}
            for role in self.client.list_cluster_role().items:
                formatted_role = {
                    "uid": role.metadata.uid,
                    "name": role.metadata.name,
                    "metadata": role.metadata,
                    "rules": (
                        [
                            {
                                "apiGroups": rule.api_groups,
                                "resources": rule.resources,
                                "verbs": rule.verbs,
                            }
                            for rule in role.rules
                        ]
                        if role.rules
                        else []
                    ),
                }
                cluster_roles[role.metadata.uid] = ClusterRole(**formatted_role)
            return cluster_roles
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return {}


class Subject(BaseModel):
    kind: str
    name: str
    namespace: Optional[str]
    metadata: Any


class RoleRef(BaseModel):
    kind: str
    name: str
    apiGroup: str


class ClusterRoleBinding(BaseModel):
    metadata: Any
    subjects: List[Subject]
    roleRef: RoleRef


class RoleBinding(BaseModel):
    metadata: Any
    subjects: List[Subject]
    roleRef: RoleRef


class Rule(BaseModel):
    apiGroups: Optional[List[str]] = None
    resources: Optional[List[str]] = None
    verbs: Optional[List[str]] = None


class Role(BaseModel):
    name: str
    uid: str
    metadata: Any
    rules: List[Rule]


class ClusterRole(BaseModel):
    name: str
    uid: str
    metadata: Any
    rules: List[Rule]
```

--------------------------------------------------------------------------------

---[FILE: role_permissions.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/lib/role_permissions.py

```python
def is_rule_allowing_permissions(rules, resources, verbs):
    """
    Check Kubernetes role permissions.

    This function takes in Kubernetes role rules, resources, and verbs,
    and checks if any of the rules grant permissions on the specified
    resources with the specified verbs.

    Args:
        rules (List[Rule]): The list of Kubernetes role rules.
        resources (List[str]): The list of resources to check permissions for.
        verbs (List[str]): The list of verbs to check permissions for.

    Returns:
        bool: True if any of the rules grant permissions, False otherwise.
    """
    if rules:
        # Iterate through each rule in the list of rules
        for rule in rules:
            # Ensure apiGroups are relevant ("" or "v1" for secrets)
            if rule.apiGroups and all(api not in ["", "v1"] for api in rule.apiGroups):
                continue  # Skip rules with unrelated apiGroups
            # Check if the rule has resources, verbs, and matches any of the specified resources and verbs
            if (
                rule.resources
                and (
                    any(resource in rule.resources for resource in resources)
                    or "*" in rule.resources
                )
                and rule.verbs
                and (any(verb in rule.verbs for verb in verbs) or "*" in rule.verbs)
            ):
                # If the rule matches, return True
                return True
    # If no rule matches, return False
    return False
```

--------------------------------------------------------------------------------

---[FILE: rbac_cluster_admin_usage.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_cluster_admin_usage/rbac_cluster_admin_usage.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "rbac_cluster_admin_usage",
  "CheckTitle": "Ensure that the cluster-admin role is only used where required",
  "CheckType": [],
  "ServiceName": "rbac",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "ClusterRoleBinding",
  "Description": "This check ensures that the 'cluster-admin' role, which provides wide-ranging powers, is used only where necessary. The 'cluster-admin' role grants super-user access to perform any action on any resource, including all namespaces. It should be applied cautiously to avoid excessive privileges.",
  "Risk": "Inappropriate use of the 'cluster-admin' role can lead to excessive privileges, increasing the risk of malicious actions and potentially impacting the cluster's security posture.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Audit and assess the use of 'cluster-admin' role in all ClusterRoleBindings. Ensure it is assigned only to subjects that require such extensive privileges. Consider using more restrictive roles wherever possible.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/#clusterrolebinding-example"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Modifying ClusterRoleBindings should be done with caution to avoid unintended access issues. Always ensure that critical system components have the necessary permissions to operate effectively."
}
```

--------------------------------------------------------------------------------

---[FILE: rbac_cluster_admin_usage.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_cluster_admin_usage/rbac_cluster_admin_usage.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.rbac.rbac_client import rbac_client


class rbac_cluster_admin_usage(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        # Iterate through the bindings
        for binding in rbac_client.cluster_role_bindings.values():
            # Check if the binding refers to the cluster-admin role
            if binding.roleRef.name == "cluster-admin":
                report = Check_Report_Kubernetes(
                    metadata=self.metadata(), resource=binding.metadata
                )
                report.namespace = (
                    "cluster-wide"
                    if not binding.metadata.namespace
                    else binding.metadata.namespace
                )
                report.status = "MANUAL"
                report.status_extended = f"Cluster Role Binding {binding.metadata.name} uses cluster-admin role."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_csr_approval_access.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_csr_approval_access/rbac_minimize_csr_approval_access.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "rbac_minimize_csr_approval_access",
  "CheckTitle": "Minimize access to the approval sub-resource of certificatesigningrequests objects",
  "CheckType": [],
  "ServiceName": "rbac",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "CertificateSigningRequestApproval",
  "Description": "This check ensures that access to the approval sub-resource of certificate signing request (CSR) objects is restricted. Access to update the approval sub-resource can lead to privilege escalation, allowing creation of new high-privileged user accounts in the cluster.",
  "Risk": "Unauthorized access to update the approval sub-resource of CSR objects can lead to significant security vulnerabilities, including unauthorized user creation and privilege escalation.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/rbac-good-practices/#csrs-and-certificate-issuing",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-clusterroles-that-grant-permissions-to-approve-certificatesigningrequests-are-minimized",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict access to the approval sub-resource of CSR objects in the cluster.",
      "Url": "https://kubernetes.io/docs/concepts/security/rbac-good-practices/#csrs-and-certificate-issuing"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Carefully evaluate which users or service accounts require the ability to update the approval sub-resource of CSR objects."
}
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_csr_approval_access.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_csr_approval_access/rbac_minimize_csr_approval_access.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.rbac.lib.role_permissions import (
    is_rule_allowing_permissions,
)
from prowler.providers.kubernetes.services.rbac.rbac_client import rbac_client

verbs = ["update", "patch"]
resources = ["certificatesigningrequests/approval"]


class rbac_minimize_csr_approval_access(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for crb in rbac_client.cluster_role_bindings.values():
            for subject in crb.subjects:
                if subject.kind in ["User", "Group"]:
                    report = Check_Report_Kubernetes(
                        metadata=self.metadata(), resource=subject
                    )
                    report.status = "PASS"
                    report.status_extended = f"User or group '{subject.name}' does not have access to update the CSR approval sub-resource."
                    for cr in rbac_client.cluster_roles.values():
                        if cr.metadata.name == crb.roleRef.name:
                            if is_rule_allowing_permissions(
                                cr.rules,
                                resources,
                                verbs,
                            ):
                                report.status = "FAIL"
                                report.status_extended = f"User or group '{subject.name}' has access to update the CSR approval sub-resource."
                                break
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_node_proxy_subresource_access.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_node_proxy_subresource_access/rbac_minimize_node_proxy_subresource_access.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "rbac_minimize_node_proxy_subresource_access",
  "CheckTitle": "Minimize access to the proxy sub-resource of nodes",
  "CheckType": [],
  "ServiceName": "rbac",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "NodeProxySubResource",
  "Description": "This check ensures that access to the proxy sub-resource of node objects is restricted. Access to this sub-resource can grant privileges to use the Kubelet API directly, bypassing Kubernetes API controls like audit logging and admission control, potentially leading to privilege escalation.",
  "Risk": "Unauthorized access to the proxy sub-resource of node objects can lead to significant security vulnerabilities, including privilege escalation.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/rbac-good-practices/#access-to-proxy-subresource-of-nodes",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict access to the proxy sub-resource of node objects in the cluster.",
      "Url": "https://kubernetes.io/docs/concepts/security/rbac-good-practices/#access-to-proxy-subresource-of-nodes"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Carefully evaluate which users or service accounts require the ability to access the proxy sub-resource of node objects."
}
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_node_proxy_subresource_access.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_node_proxy_subresource_access/rbac_minimize_node_proxy_subresource_access.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.rbac.lib.role_permissions import (
    is_rule_allowing_permissions,
)
from prowler.providers.kubernetes.services.rbac.rbac_client import rbac_client

verbs = ["get", "list", "watch"]
resources = ["nodes/proxy"]


class rbac_minimize_node_proxy_subresource_access(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for crb in rbac_client.cluster_role_bindings.values():
            for subject in crb.subjects:
                if subject.kind in ["User", "Group"]:
                    report = Check_Report_Kubernetes(
                        metadata=self.metadata(), resource=subject
                    )
                    report.status = "PASS"
                    report.status_extended = f"User or group '{subject.name}' does not have access to the node proxy sub-resource."
                    for cr in rbac_client.cluster_roles.values():
                        if cr.metadata.name == crb.roleRef.name:
                            if is_rule_allowing_permissions(cr.rules, resources, verbs):
                                report.status = "FAIL"
                                report.status_extended = f"User or group '{subject.name}' has access to the node proxy sub-resource."
                                break
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
