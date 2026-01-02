---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 371
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 371 of 867)

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

---[FILE: apiserver_encryption_provider_config_set.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_encryption_provider_config_set/apiserver_encryption_provider_config_set.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_encryption_provider_config_set",
  "CheckTitle": "Ensure that the --encryption-provider-config argument is set as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured with the --encryption-provider-config argument to encrypt sensitive data at rest in the etcd key-value store. Encrypting data at rest prevents potential unauthorized disclosures and ensures that the sensitive data is secure.",
  "Risk": "Without proper configuration of the encryption provider, sensitive data stored in etcd might not be encrypted, posing a risk of data breaches.",
  "RelatedUrl": "https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/",
  "Remediation": {
    "Code": {
      "CLI": "--encryption-provider-config=/path/to/EncryptionConfig/File",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure and enable encryption for data at rest in etcd using a suitable EncryptionConfig file.",
      "Url": "https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#determining-whether-encryption-at-rest-is-already-enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure that the EncryptionConfig file is correctly configured and securely stored."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_encryption_provider_config_set.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_encryption_provider_config_set/apiserver_encryption_provider_config_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_encryption_provider_config_set(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Encryption provider config is set appropriately in pod {pod.name}."
            )

            encryption_provider_config_set = True
            for container in pod.containers.values():
                # Check if "--encryption-provider-config" is set
                if "--encryption-provider-config" not in str(container.command):
                    encryption_provider_config_set = False
                    break

            if not encryption_provider_config_set:
                report.status = "FAIL"
                report.status_extended = (
                    f"Encryption provider config is not set in pod {pod.name}."
                )

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_etcd_cafile_set.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_etcd_cafile_set/apiserver_etcd_cafile_set.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_etcd_cafile_set",
  "CheckTitle": "Ensure that the --etcd-cafile argument is set as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured with the --etcd-cafile argument, specifying the Certificate Authority file for etcd client connections. This setting is important for secure communication with etcd and ensures that the API server connects to etcd with an SSL Certificate Authority file.",
  "Risk": "Without proper TLS configuration, communication between the API server and etcd can be unencrypted, leading to potential security vulnerabilities.",
  "RelatedUrl": "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/",
  "Remediation": {
    "Code": {
      "CLI": "--etcd-cafile=<path/to/ca-file>",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-etcd-cafile-argument-is-set-as-appropriate-1",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure etcd connections from the API server are secured using the appropriate CA file.",
      "Url": "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/#limiting-access-of-etcd-clusters"
    }
  },
  "Categories": [
    "encryption",
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "It is crucial to manage and rotate the CA file securely as part of your cluster's security practices."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_etcd_cafile_set.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_etcd_cafile_set/apiserver_etcd_cafile_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_etcd_cafile_set(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"etcd CA file is set appropriately in pod {pod.name}."
            )
            etcd_cafile_set = True
            for container in pod.containers.values():
                # Check if "--etcd-cafile" is set
                if "--etcd-cafile" not in str(container.command):
                    etcd_cafile_set = False
                    break

            if not etcd_cafile_set:
                report.status = "FAIL"
                report.status_extended = f"etcd CA file is not set in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_etcd_tls_config.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_etcd_tls_config/apiserver_etcd_tls_config.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_etcd_tls_config",
  "CheckTitle": "Ensure that the --etcd-certfile and --etcd-keyfile arguments are set as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured with TLS encryption for etcd client connections, using --etcd-certfile and --etcd-keyfile arguments. Setting up TLS for etcd is crucial for securing the sensitive data stored in etcd as it's the primary datastore for Kubernetes.",
  "Risk": "Without TLS encryption, data stored in etcd is susceptible to eavesdropping and man-in-the-middle attacks, potentially leading to data breaches.",
  "RelatedUrl": "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/",
  "Remediation": {
    "Code": {
      "CLI": "--etcd-certfile=<path/to/client-certificate-file> --etcd-keyfile=<path/to/client-key-file>",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-etcd-certfile-and-etcd-keyfile-arguments-are-set-as-appropriate",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable TLS encryption for etcd client connections to secure sensitive data.",
      "Url": "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/#limiting-access-of-etcd-clusters"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "TLS encryption for etcd is not enabled by default and should be explicitly configured."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_etcd_tls_config.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_etcd_tls_config/apiserver_etcd_tls_config.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_etcd_tls_config(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"TLS configuration for etcd is set appropriately in pod {pod.name}."
            )
            etcd_tls_config_set = True
            for container in pod.containers.values():
                # Check if "--etcd-certfile" and "--etcd-keyfile" are set
                if "--etcd-certfile" not in str(
                    container.command
                ) and "--etcd-keyfile" not in str(container.command):
                    etcd_tls_config_set = False
                    break

            if not etcd_tls_config_set:
                report.status = "FAIL"
                report.status_extended = (
                    f"TLS configuration for etcd is not set in pod {pod.name}."
                )

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_event_rate_limit.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_event_rate_limit/apiserver_event_rate_limit.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_event_rate_limit",
  "CheckTitle": "Ensure that the admission control plugin EventRateLimit is set",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check verifies if the Kubernetes API server is configured with the EventRateLimit admission control plugin. This plugin limits the rate of events accepted by the API Server, preventing potential DoS attacks by misbehaving workloads.",
  "Risk": "Without EventRateLimit, the API server could be overwhelmed by a high number of events, leading to DoS and performance issues.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/",
  "Remediation": {
    "Code": {
      "CLI": "--enable-admission-plugins=...,EventRateLimit,... --admission-control-config-file=/path/to/configuration/file",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-admission-control-plugin-eventratelimit-is-set",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure EventRateLimit as an admission control plugin for the API server to manage the rate of incoming events effectively.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#eventratelimit"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Tuning EventRateLimit requires careful consideration of the specific requirements of your environment."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_event_rate_limit.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_event_rate_limit/apiserver_event_rate_limit.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_event_rate_limit(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"EventRateLimit admission control plugin is set in pod {pod.name}."
            )
            plugin_set = False
            for container in pod.containers.values():
                plugin_set = False
                for command in container.command:
                    if command.startswith("--enable-admission-plugins"):
                        if "EventRateLimit" not in (command.split("=")[1]):
                            plugin_set = True
                            break
                if not plugin_set:
                    break
            if not plugin_set:
                report.status = "FAIL"
                report.status_extended = f"EventRateLimit admission control plugin is not set in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_kubelet_cert_auth.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_kubelet_cert_auth/apiserver_kubelet_cert_auth.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_kubelet_cert_auth",
  "CheckTitle": "Ensure that the --kubelet-certificate-authority argument is set as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is set up with a specified certificate authority for kubelet connections, using the --kubelet-certificate-authority argument. This setup is crucial for verifying the kubelet's certificate to prevent man-in-the-middle attacks during connections from the apiserver to the kubelet.",
  "Risk": "Without the --kubelet-certificate-authority argument, connections to kubelets are not verified, increasing the risk of man-in-the-middle attacks, especially over untrusted networks.",
  "RelatedUrl": "https://kubernetes.io/docs/setup/best-practices/certificates/",
  "Remediation": {
    "Code": {
      "CLI": "--kubelet-certificate-authority=/path/to/ca-file",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-kubelet-certificate-authority-argument-is-set-as-appropriate",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable TLS verification between the apiserver and kubelets by specifying the certificate authority in the kube-apiserver configuration.",
      "Url": "https://kubernetes.io/docs/setup/best-practices/certificates/#configure-certificates-manually"
    }
  },
  "Categories": [
    "cluster-security",
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, the kube-apiserver does not verify kubelet certificates. Enabling this setting enhances the security of master-node communications."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_kubelet_cert_auth.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_kubelet_cert_auth/apiserver_kubelet_cert_auth.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_kubelet_cert_auth(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"API Server has appropriate kubelet certificate authority configured in pod {pod.name}."
            for container in pod.containers.values():
                if "--kubelet-certificate-authority" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = f"API Server is missing kubelet certificate authority configuration in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_kubelet_tls_auth.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_kubelet_tls_auth/apiserver_kubelet_tls_auth.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_kubelet_tls_auth",
  "CheckTitle": "Ensure that the --kubelet-client-certificate and --kubelet-client-key arguments are set as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is set up with certificate-based authentication to the kubelet. This setup requires the --kubelet-client-certificate and --kubelet-client-key arguments in the kube-apiserver configuration to be set, ensuring secure communication between the API server and kubelets.",
  "Risk": "Without certificate-based authentication to kubelets, requests from the apiserver are treated as anonymous, which could lead to unauthorized access and manipulation of node resources.",
  "RelatedUrl": "https://kubernetes.io/docs/setup/best-practices/certificates/",
  "Remediation": {
    "Code": {
      "CLI": "--kubelet-client-certificate=/path/to/client-certificate-file --kubelet-client-key=/path/to/client-key-file",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-kubelet-client-certificate-and-kubelet-client-key-arguments-are-set-as-appropriate",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable TLS authentication between the apiserver and kubelets by specifying the client certificate and key in the kube-apiserver configuration.",
      "Url": "https://kubernetes.io/docs/setup/best-practices/certificates/#configure-certificates-manually"
    }
  },
  "Categories": [
    "cluster-security",
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, the kube-apiserver does not authenticate to kubelets using certificates. Enabling this increases the security posture of the cluster."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_kubelet_tls_auth.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_kubelet_tls_auth/apiserver_kubelet_tls_auth.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_kubelet_tls_auth(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"API Server has appropriate kubelet TLS authentication configured in pod {pod.name}."
            for container in pod.containers.values():
                if "--kubelet-client-certificate" not in str(
                    container.command
                ) and "--kubelet-client-key" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = f"API Server is missing kubelet TLS authentication arguments in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_namespace_lifecycle_plugin.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_namespace_lifecycle_plugin/apiserver_namespace_lifecycle_plugin.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_namespace_lifecycle_plugin",
  "CheckTitle": "Ensure that the admission control plugin NamespaceLifecycle is set",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check verifies that the NamespaceLifecycle admission control plugin is enabled in the Kubernetes API server. This plugin prevents the creation of objects in non-existent or terminating namespaces, enforcing the integrity of the namespace lifecycle and availability of new objects.",
  "Risk": "Without NamespaceLifecycle, objects may be created in namespaces that are being terminated, potentially leading to inconsistencies and resource conflicts.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/",
  "Remediation": {
    "Code": {
      "CLI": "--enable-admission-plugins=...,NamespaceLifecycle,...",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-admission-control-plugin-namespacelifecycle-is-set",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable the NamespaceLifecycle admission control plugin in the API server to enforce proper namespace management.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#namespacelifecycle"
    }
  },
  "Categories": [
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "NamespaceLifecycle plugin is usually enabled by default, ensuring proper management of namespace creation and termination."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_namespace_lifecycle_plugin.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_namespace_lifecycle_plugin/apiserver_namespace_lifecycle_plugin.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_namespace_lifecycle_plugin(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"NamespaceLifecycle admission control plugin is set in pod {pod.name}."
            )

            namespace_lifecycle_plugin_set = False
            for container in pod.containers.values():
                namespace_lifecycle_plugin_set = False
                # Check if "--enable-admission-plugins" includes "NamespaceLifecycle"
                # and "--disable-admission-plugins" does not include "NamespaceLifecycle"
                for command in container.command:
                    if command.startswith("--enable-admission-plugins"):
                        if "NamespaceLifecycle" in (command.split("=")[1]):
                            namespace_lifecycle_plugin_set = True
                    elif command.startswith("--disable-admission-plugins"):
                        if "NamespaceLifecycle" in (command.split("=")[1]):
                            namespace_lifecycle_plugin_set = False
                if not namespace_lifecycle_plugin_set:
                    break

            if not namespace_lifecycle_plugin_set:
                report.status = "FAIL"
                report.status_extended = f"NamespaceLifecycle admission control plugin is not set in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_node_restriction_plugin.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_node_restriction_plugin/apiserver_node_restriction_plugin.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_node_restriction_plugin",
  "CheckTitle": "Ensure that the admission control plugin NodeRestriction is set",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the NodeRestriction admission control plugin is enabled in the Kubernetes API server. NodeRestriction limits the Node and Pod objects that a kubelet can modify, enhancing security by ensuring kubelets are restricted to manage their own node and pods.",
  "Risk": "Without NodeRestriction, kubelets may have broader access to Node and Pod objects, potentially leading to unauthorized modifications and security risks.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers",
  "Remediation": {
    "Code": {
      "CLI": "--enable-admission-plugins=...,NodeRestriction,...",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-admission-control-plugin-noderestriction-is-set",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable the NodeRestriction admission control plugin in the API server for enhanced node and pod security.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#noderestriction"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "NodeRestriction is critical in clusters where kubelets need restricted access to Node and Pod objects they manage."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_node_restriction_plugin.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_node_restriction_plugin/apiserver_node_restriction_plugin.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_node_restriction_plugin(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"NodeRestriction admission control plugin is set in pod {pod.name}."
            )
            node_restriction_plugin_set = False
            for container in pod.containers.values():
                node_restriction_plugin_set = False
                # Check if "--enable-admission-plugins" includes "NodeRestriction"
                for command in container.command:
                    if command.startswith("--enable-admission-plugins"):
                        if "NodeRestriction" in (command.split("=")[1]):
                            node_restriction_plugin_set = True
                if not node_restriction_plugin_set:
                    break

            if not node_restriction_plugin_set:
                report.status = "FAIL"
                report.status_extended = f"NodeRestriction admission control plugin is not set in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_no_always_admit_plugin.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_no_always_admit_plugin/apiserver_no_always_admit_plugin.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_no_always_admit_plugin",
  "CheckTitle": "Ensure that the admission control plugin AlwaysAdmit is not set",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check verifies that the Kubernetes API server is not configured with the AlwaysAdmit admission control plugin. The AlwaysAdmit plugin allows all requests without any filtering, which is a security risk and is deprecated.",
  "Risk": "Enabling AlwaysAdmit permits all requests by default, bypassing other admission control checks, which can lead to unauthorized access.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/",
  "Remediation": {
    "Code": {
      "CLI": "--disable-admission-plugins=...,AlwaysAdmit,...",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-admission-control-plugin-alwaysadmit-is-not-set",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure the API server does not use the AlwaysAdmit admission control plugin to maintain proper security checks for all requests.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#alwaysadmit"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "AlwaysAdmit is deprecated and should not be used. Ensure it is removed from the API server configuration."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_no_always_admit_plugin.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_no_always_admit_plugin/apiserver_no_always_admit_plugin.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_no_always_admit_plugin(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"AlwaysAdmit admission control plugin is not set in pod {pod.name}."
            )
            always_admit_plugin = True
            for container in pod.containers.values():
                always_admit_plugin = True
                for command in container.command:
                    if command.startswith("--enable-admission-plugins"):
                        if "AlwaysAdmit" in (command.split("=")[1]):
                            report.status = "FAIL"
                            report.status_extended = f"AlwaysAdmit admission control plugin is set in pod {pod.name}."
                            always_admit_plugin = False
                            break
                if not always_admit_plugin:
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_no_token_auth_file.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_no_token_auth_file/apiserver_no_token_auth_file.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_no_token_auth_file",
  "CheckTitle": "Ensure that the --token-auth-file parameter is not set",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is not using static token-based authentication, which is less secure. Static tokens are stored in clear-text and lack features like revocation or rotation without restarting the API server.",
  "Risk": "Using static token-based authentication exposes the cluster to security risks due to the static nature of the tokens, their clear-text storage, and the inability to revoke or rotate them easily.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-token-auth-file-parameter-is-not-set",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Replace token-based authentication with more secure mechanisms like client certificate authentication. Ensure the --token-auth-file argument is not used in the API server configuration.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/#static-token-file"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, the --token-auth-file argument is not set in the kube-apiserver. Ensure it remains unset or is removed if currently in use."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_no_token_auth_file.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_no_token_auth_file/apiserver_no_token_auth_file.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_no_token_auth_file(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"API Server does not have token-auth-file enabled in pod {pod.name}."
            )
            for container in pod.containers.values():
                if "--token-auth-file" in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = (
                        f"API Server has token-auth-file enabled in pod {pod.name}."
                    )
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_request_timeout_set.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_request_timeout_set/apiserver_request_timeout_set.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_request_timeout_set",
  "CheckTitle": "Ensure that the --request-timeout argument is set as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check verifies that the Kubernetes API server is configured with an appropriate global request timeout. Setting a suitable --request-timeout value ensures the API server can handle requests efficiently without exhausting resources, especially in cases of slower connections or high-volume data requests.",
  "Risk": "An inadequately set request timeout may lead to inefficient handling of API requests, either by timing out too quickly on slow connections or by allowing requests to consume excessive resources, leading to potential Denial-of-Service attacks.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/",
  "Remediation": {
    "Code": {
      "CLI": "--request-timeout=300s",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-request-timeout-argument-is-set-as-appropriate",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Set the API server request timeout to a value that balances resource usage efficiency and the needs of your environment, considering connection speeds and data volumes.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/#options"
    }
  },
  "Categories": [
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "The default timeout is set to 60 seconds. Adjust according to the specific requirements and constraints of your Kubernetes environment."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_request_timeout_set.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_request_timeout_set/apiserver_request_timeout_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_request_timeout_set(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Request timeout is set appropriately in pod {pod.name}."
            )
            for container in pod.containers.values():
                # Check if "--request-timeout" is set to an appropriate value
                if "--request-timeout" not in str(container.command):
                    # Assuming the value is valid, e.g., '300s' or '1m'
                    report.status = "FAIL"
                    report.status_extended = f"Request timeout is not set or not set appropriately in pod {pod.name}."
                    break

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_security_context_deny_plugin.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_security_context_deny_plugin/apiserver_security_context_deny_plugin.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_security_context_deny_plugin",
  "CheckTitle": "Ensure that the admission control plugin SecurityContextDeny is set if PodSecurityPolicy is not used",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check verifies that the SecurityContextDeny admission control plugin is enabled in the Kubernetes API server if PodSecurityPolicy is not used. The SecurityContextDeny plugin denies pods that make use of certain SecurityContext fields which could allow privilege escalation.",
  "Risk": "Without SecurityContextDeny, pods may be able to escalate privileges if PodSecurityPolicy is not used, potentially leading to security vulnerabilities.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/",
  "Remediation": {
    "Code": {
      "CLI": "--enable-admission-plugins=...,SecurityContextDeny,...",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-admission-control-plugin-securitycontextdeny-is-set-if-podsecuritypolicy-is-not-used",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use SecurityContextDeny as an admission control plugin in the API server to enhance security, especially in the absence of PodSecurityPolicy.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#securitycontextdeny"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "SecurityContextDeny is recommended in environments where PodSecurityPolicy is not implemented to prevent potential privilege escalations."
}
```

--------------------------------------------------------------------------------

````
