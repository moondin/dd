---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 375
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 375 of 867)

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

---[FILE: etcd_unique_ca.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_unique_ca/etcd_unique_ca.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "etcd_unique_ca",
  "CheckTitle": "Etcd pod uses a unique Certificate Authority distinct from the Kubernetes API server CA",
  "CheckType": [],
  "ServiceName": "etcd",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Pod",
  "Description": "**Etcd** configuration is assessed to ensure it trusts a **unique Certificate Authority** via `--trusted-ca-file`, distinct from the API server's `--client-ca-file`. If the same CA file is used, etcd shares the cluster CA; differing files imply separation, though CA content should still be verified.",
  "Risk": "Using the Kubernetes CA for etcd allows any cert signed by that CA to authenticate to the datastore. Theft or mis-issuance enables unauthorized reads/writes, causing secret exposure (confidentiality), state tampering (integrity), and potential control-plane disruption (availability).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://etcd.io/docs/latest/op-guide/security/",
    "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/#limiting-access-of-etcd-clusters"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. SSH to a control-plane node that runs etcd\n2. Open the API server manifest: sudo vi /etc/kubernetes/manifests/kube-apiserver.yaml and note the value of --client-ca-file=<APISERVER_CA_PATH>\n3. Ensure an etcd-specific CA file exists at a different path (for example: /etc/kubernetes/pki/etcd/ca.crt) and is readable by the etcd container\n4. Edit the etcd manifest: sudo vi /etc/kubernetes/manifests/etcd.yaml\n   - In the etcd container command/args, add or update: --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt (this path must NOT equal <APISERVER_CA_PATH>)\n   - Save the file; the kubelet will restart the etcd pod automatically\n5. Verify the change: kubectl -n kube-system get pods -o wide | grep etcd, then describe the etcd pod and confirm --trusted-ca-file points to a different path than the API server --client-ca-file",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Adopt a **separate PKI** for etcd: issue client and peer certs from an etcd-only CA and trust only that CA. Enforce mTLS (`--client-cert-auth`, `--peer-client-cert-auth`), avoid `--auto-tls`, rotate keys independently, and apply **least privilege** to CA issuance with regular certificate audits.",
      "Url": "https://hub.prowler.com/check/etcd_unique_ca"
    }
  },
  "Categories": [
    "encryption",
    "cluster-security",
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check is particularly important in environments where strict access control to the etcd database is required."
}
```

--------------------------------------------------------------------------------

---[FILE: etcd_unique_ca.py]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_unique_ca/etcd_unique_ca.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)
from prowler.providers.kubernetes.services.etcd.etcd_client import etcd_client


class etcd_unique_ca(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        # Get first the CA Files of the apiserver pods
        apiserver_ca_files = []
        for pod in apiserver_client.apiserver_pods:
            for container in pod.containers.values():
                for command in container.command:
                    if command.startswith("--client-ca-file"):
                        apiserver_ca_files.append(command.split("=")[1])
        for pod in etcd_client.etcd_pods:
            etcd_ca_files = []
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "MANUAL"
            report.status_extended = f"Etcd uses a different CA file from the Kubernetes cluster CA in pod {pod.name}, but verify if the content is the same."
            for container in pod.containers.values():
                for command in container.command:
                    if command.startswith("--trusted-ca-file"):
                        etcd_ca_files.append(command.split("=")[1])
            if any(ca in etcd_ca_files for ca in apiserver_ca_files):
                report.status = "FAIL"
                report.status_extended = f"Etcd does not use a unique CA file, which could compromise its security in pod {pod.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_client.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.kubernetes.services.kubelet.kubelet_service import Kubelet

kubelet_client = Kubelet(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: kubelet_service.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_service.py

```python
import yaml

from prowler.lib.logger import logger
from prowler.providers.kubernetes.kubernetes_provider import KubernetesProvider
from prowler.providers.kubernetes.lib.service.service import KubernetesService
from prowler.providers.kubernetes.services.core.core_client import core_client


class Kubelet(KubernetesService):
    def __init__(self, provider: KubernetesProvider):
        super().__init__(provider)
        self.client = core_client

        self.kubelet_config_maps = self._get_kubelet_config_maps()

    def _get_kubelet_config_maps(self):
        try:
            kubelet_config_maps = []
            for cm in self.client.config_maps.values():
                if cm.name.startswith("kubelet-config"):
                    cm.kubelet_args = yaml.safe_load(cm.data.get("kubelet", ""))
                    if not cm.kubelet_args:
                        cm.kubelet_args = []
                    kubelet_config_maps.append(cm)
            return kubelet_config_maps
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
```

--------------------------------------------------------------------------------

---[FILE: kubelet_authorization_mode.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_authorization_mode/kubelet_authorization_mode.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_authorization_mode",
  "CheckTitle": "Ensure that the kubelet --authorization-mode argument is not set to AlwaysAllow",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesKubelet",
  "Description": "This check ensures that kubelets are not set to use the 'AlwaysAllow' authorization mode, which would allow all authenticated requests without explicit authorization.",
  "Risk": "Setting --authorization-mode to AlwaysAllow can lead to unauthorized access to kubelet services.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-authn-authz/",
  "Remediation": {
    "Code": {
      "CLI": "--authorization-mode=Webhook",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure kubelet is configured with an authorization mode other than AlwaysAllow.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authorization"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Verify the authorization mode in both kubelet service files and configuration files."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_authorization_mode.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_authorization_mode/kubelet_authorization_mode.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.kubelet.kubelet_client import kubelet_client


class kubelet_authorization_mode(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for cm in kubelet_client.kubelet_config_maps:
            authorization = cm.kubelet_args.get("authorization")
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=cm)
            if not authorization:
                report.status = "MANUAL"
                report.status_extended = f"Kubelet does not have the argument `readOnlyPort` in config file {cm.name}, verify it in the node's arguments."
            else:
                report.status = "PASS"
                report.status_extended = f"Kubelet is not using 'AlwaysAllow' as the authorization mode in config file {cm.name}."
                if authorization.get("mode") == "AlwaysAllow":
                    report.status = "FAIL"
                    report.status_extended = f"Kubelet is incorrectly set to use 'AlwaysAllow' as the authorization mode in config file {cm.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_client_ca_file_set.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_client_ca_file_set/kubelet_client_ca_file_set.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_client_ca_file_set",
  "CheckTitle": "Ensure that the kubelet --client-ca-file argument is set as appropriate",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesKubelet",
  "Description": "This check verifies that the kubelet is configured with the --client-ca-file argument to enable authentication using certificates. This configuration is essential to secure the connections from the apiserver to the kubelet.",
  "Risk": "If --client-ca-file is not set, the apiserver cannot authenticate the kubelet, potentially leading to man-in-the-middle attacks.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-authn-authz/",
  "Remediation": {
    "Code": {
      "CLI": "--client-ca-file=/path/to/ca-file",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure Kubelet with a client CA file for secure authentication.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authorization"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure the client CA file is properly managed and securely stored."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_client_ca_file_set.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_client_ca_file_set/kubelet_client_ca_file_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.kubelet.kubelet_client import kubelet_client


class kubelet_client_ca_file_set(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for cm in kubelet_client.kubelet_config_maps:
            authentication = cm.kubelet_args.get("authentication")
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=cm)
            if not authentication:
                report.status = "MANUAL"
                report.status_extended = f"Kubelet does not have the argument `readOnlyPort` in config file {cm.name}, verify it in the node's arguments."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Kubelet is missing the client CA file in config file {cm.name}."
                )
                if "clientCAFile" in authentication.get("x509", {}):
                    report.status = "PASS"
                    report.status_extended = f"Kubelet has the client CA file configured appropriately in config file {cm.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_config_yaml_ownership.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_config_yaml_ownership/kubelet_config_yaml_ownership.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_config_yaml_ownership",
  "CheckTitle": "Validate kubelet config.yaml File Ownership",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesWorkerNode",
  "Description": "Ensure that if the kubelet refers to a configuration file with the --config argument, that file is owned by root:root. The kubelet config file contains various critical parameters for the kubelet service on worker nodes, and its ownership should be strictly controlled.",
  "Risk": "Improper file ownership on kubelet config.yaml can expose sensitive data or allow unauthorized modifications.",
  "RelatedUrl": "https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/",
  "Remediation": {
    "Code": {
      "CLI": "chown root:root /var/lib/kubelet/config.yaml",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Secure the kubelet configuration by enforcing strict file ownership.",
      "Url": "https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/"
    }
  },
  "Categories": [
    "node-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Regularly verify the file ownership of kubelet config files to ensure they are not altered unexpectedly."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_config_yaml_ownership.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_config_yaml_ownership/kubelet_config_yaml_ownership.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.lib.utils.utils import is_owned_by_root
from prowler.providers.kubernetes.services.core.core_client import core_client


class kubelet_config_yaml_ownership(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for node in core_client.nodes.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=node)
            # It can only be checked if Prowler is being executed inside a worker node or if the file is the default one
            if node.inside:
                if is_owned_by_root("/var/lib/kubelet/config.yaml") is None:
                    report.status = "MANUAL"
                    report.status_extended = f"Kubelet config.yaml file not found in Node {node.name}, please verify kubelet config.yaml file ownership manually."
                else:
                    report.status = "PASS"
                    report.status_extended = f"kubelet config.yaml file ownership is set to root:root in Node {node.name}."
                    if not is_owned_by_root("/var/lib/kubelet/config.yaml"):
                        report.status = "FAIL"
                        report.status_extended = f"kubelet config.yaml file ownership is set to root:root in Node {node.name}."
            else:
                report.status = "MANUAL"
                report.status_extended = f"Prowler is not being executed inside Node {node.name}, please verify kubelet config.yaml file permissions manually."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_config_yaml_permissions.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_config_yaml_permissions/kubelet_config_yaml_permissions.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_config_yaml_permissions",
  "CheckTitle": "Validate kubelet config.yaml File Permissions",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesWorkerNode",
  "Description": "Ensure that if the kubelet refers to a configuration file with the --config argument, that file has permissions of 600 or more restrictive. The kubelet config file contains various critical parameters for the kubelet service on worker nodes, and its permissions should be strictly controlled.",
  "Risk": "Improper file permissions on kubelet config.yaml can expose sensitive data or allow unauthorized modifications.",
  "RelatedUrl": "https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/",
  "Remediation": {
    "Code": {
      "CLI": "chmod 600 /var/lib/kubelet/config.yaml",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Secure the kubelet configuration by enforcing strict file permissions.",
      "Url": "https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/"
    }
  },
  "Categories": [
    "node-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Regularly verify the file permissions of kubelet config files to ensure they are not altered unexpectedly."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_config_yaml_permissions.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_config_yaml_permissions/kubelet_config_yaml_permissions.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.lib.utils.utils import get_file_permissions
from prowler.providers.kubernetes.services.core.core_client import core_client


class kubelet_config_yaml_permissions(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for node in core_client.nodes.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=node)
            # It can only be checked if Prowler is being executed inside a worker node or if the file is the default one
            if node.inside:
                if not get_file_permissions("/var/lib/kubelet/config.yaml"):
                    report.status = "MANUAL"
                    report.status_extended = f"Kubelet config.yaml file not found in Node {node.name}, please verify kubelet config.yaml file permissions manually."
                else:
                    report.status = "PASS"
                    report.status_extended = f"kubelet config.yaml file permissions are set to 600 or more restrictive in Node {node.name}."
                    if get_file_permissions("/var/lib/kubelet/config.yaml") > 0o600:
                        report.status = "FAIL"
                        report.status_extended = f"kubelet config.yaml file permissions are not set to 600 or more restrictive in Node {node.name}."
            else:
                report.status = "MANUAL"
                report.status_extended = f"Prowler is not being executed inside Node {node.name}, please verify kubelet config.yaml file permissions manually."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_conf_file_ownership.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_conf_file_ownership/kubelet_conf_file_ownership.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_conf_file_ownership",
  "CheckTitle": "Ensure kubelet.conf file ownership is set to root:root",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesWorkerNode",
  "Description": "Ensure that the kubelet.conf file, which is the kubeconfig file for the node, has its file ownership set to root:root. This check verifies the proper ownership settings to maintain the security and integrity of the node's configuration.",
  "Risk": "Incorrect file ownership settings on kubelet.conf can lead to unauthorized access and potential security vulnerabilities.",
  "RelatedUrl": "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/kubelet-integration/",
  "Remediation": {
    "Code": {
      "CLI": "chown root:root /etc/kubernetes/kubelet.conf",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure kubelet.conf file ownership is correctly set to protect the node's configuration.",
      "Url": "https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/"
    }
  },
  "Categories": [
    "node-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Regular checks of kubelet.conf file ownership are essential for maintaining node security."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_conf_file_ownership.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_conf_file_ownership/kubelet_conf_file_ownership.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.lib.utils.utils import is_owned_by_root
from prowler.providers.kubernetes.services.core.core_client import core_client


class kubelet_conf_file_ownership(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for node in core_client.nodes.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=node)
            # It can only be checked if Prowler is being executed inside a worker node or if the file is the default one
            if node.inside:
                if is_owned_by_root("/etc/kubernetes/kubelet.conf") is None:
                    report.status = "MANUAL"
                    report.status_extended = f"kubelet.conf file not found in Node {node.name}, please verify kubelet.conf file ownership manually."
                else:
                    report.status = "PASS"
                    report.status_extended = f"kubelet.conf file ownership is set to root:root in Node {node.name}."
                    if not is_owned_by_root("/etc/kubernetes/kubelet.conf"):
                        report.status = "FAIL"
                        report.status_extended = f"kubelet.conf file ownership is not set to root:root in Node {node.name}."
            else:
                report.status = "MANUAL"
                report.status_extended = f"Prowler is not being executed inside Node {node.name}, please verify kubelet.conf file ownership manually."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_conf_file_permissions.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_conf_file_permissions/kubelet_conf_file_permissions.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_conf_file_permissions",
  "CheckTitle": "Ensure kubelet.conf file permissions are set to 600 or more restrictive",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesWorkerNode",
  "Description": "Ensure that the kubelet.conf file, which is the kubeconfig file for the node, has permissions set to 600 or more restrictive. This ensures the integrity and security of the node's configuration.",
  "Risk": "Improper permissions on kubelet.conf can expose sensitive configuration data, potentially leading to cluster security compromises.",
  "RelatedUrl": "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/kubelet-integration/",
  "Remediation": {
    "Code": {
      "CLI": "chmod 600 /etc/kubernetes/kubelet.conf",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure kubelet.conf file permissions are correctly set to protect the node's configuration.",
      "Url": "https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/"
    }
  },
  "Categories": [
    "node-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Regular checks of kubelet.conf file permissions are essential for maintaining node security."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_conf_file_permissions.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_conf_file_permissions/kubelet_conf_file_permissions.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.lib.utils.utils import get_file_permissions
from prowler.providers.kubernetes.services.core.core_client import core_client


class kubelet_conf_file_permissions(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for node in core_client.nodes.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=node)
            # It can only be checked if Prowler is being executed inside a worker node or if the file is the default one
            if node.inside:
                if not get_file_permissions("/etc/kubernetes/kubelet.conf"):
                    report.status = "MANUAL"
                    report.status_extended = f"Kubelet.conf file not found in Node {node.name}, please verify kubelet.conf file permissions manually."
                else:
                    report.status = "PASS"
                    report.status_extended = f"kubelet.conf file permissions are set to 600 or more restrictive in Node {node.name}."
                    if get_file_permissions("/etc/kubernetes/kubelet.conf") > 0o600:
                        report.status = "FAIL"
                        report.status_extended = f"kubelet.conf file permissions are not set to 600 or more restrictive in Node {node.name}."
            else:
                report.status = "MANUAL"
                report.status_extended = f"Prowler is not being executed inside Node {node.name}, please verify kubelet.conf file permissions manually."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_disable_anonymous_auth.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_disable_anonymous_auth/kubelet_disable_anonymous_auth.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_disable_anonymous_auth",
  "CheckTitle": "Ensure that the --anonymous-auth argument is set to false",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesKubelet",
  "Description": "This check ensures that anonymous requests to the Kubelet server are disabled by setting the --anonymous-auth argument to false. Disabling anonymous requests enhances the security by ensuring that all requests are authenticated and authorized.",
  "Risk": "Enabling anonymous requests can lead to unauthorized access to Kubelet APIs and potentially sensitive cluster data.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authorization",
  "Remediation": {
    "Code": {
      "CLI": "--anonymous-auth=false",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that anonymous requests to the Kubelet server are disabled for enhanced cluster security.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-authn-authz/"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Regularly review Kubelet configurations to ensure compliance with security best practices."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_disable_anonymous_auth.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_disable_anonymous_auth/kubelet_disable_anonymous_auth.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.kubelet.kubelet_client import kubelet_client


class kubelet_disable_anonymous_auth(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for cm in kubelet_client.kubelet_config_maps:
            authentication = cm.kubelet_args.get("authentication", {})
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=cm)
            report.status = "FAIL"
            report.status_extended = (
                f"Kubelet has anonymous access enabled in config file {cm.name}."
            )
            if not authentication.get("anonymous", {}).get("enabled", False):
                report.status = "PASS"
                report.status_extended = f"Kubelet does not have anonymous access enabled in config file {cm.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_disable_read_only_port.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_disable_read_only_port/kubelet_disable_read_only_port.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_disable_read_only_port",
  "CheckTitle": "Verify that the kubelet --read-only-port argument is set to 0",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesKubelet",
  "Description": "This check ensures that the read-only port of the Kubelet is disabled by verifying that the --read-only-port argument is set to 0. Disabling the read-only port is crucial to prevent unauthenticated access to sensitive cluster data.",
  "Risk": "If the read-only port is open, it could allow unauthenticated access to sensitive cluster information.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/",
  "Remediation": {
    "Code": {
      "CLI": "--read-only-port=0",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-read-only-port-argument-is-set-to-0",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable the read-only port in the kubelet for enhanced cluster security.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/#options"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure that any services relying on the read-only port are reconfigured to use the main Kubelet API."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_disable_read_only_port.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_disable_read_only_port/kubelet_disable_read_only_port.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.kubelet.kubelet_client import kubelet_client


class kubelet_disable_read_only_port(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for cm in kubelet_client.kubelet_config_maps:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=cm)
            if "readOnlyPort" not in cm.kubelet_args:
                report.status = "MANUAL"
                report.status_extended = f"Kubelet does not have the argument `readOnlyPort` in config file {cm.name}, verify it in the node's arguments."
            else:
                if cm.kubelet_args["readOnlyPort"] == 0:
                    report.status = "PASS"
                    report.status_extended = f"Kubelet has the read-only port disabled in config file {cm.name}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Kubelet has the read-only port enabled in config file {cm.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_event_record_qps.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_event_record_qps/kubelet_event_record_qps.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_event_record_qps",
  "CheckTitle": "Ensure that the kubelet eventRecordQPS argument is set to an appropriate level",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesKubelet",
  "Description": "This check ensures that the Kubelet is configured with an appropriate eventRecordQPS level. The eventRecordQPS parameter limits the rate at which events are gathered, ensuring important security events are not missed while preventing potential denial-of-service conditions.",
  "Risk": "An inappropriate eventRecordQPS setting could lead to missing vital security events or DoS conditions.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/",
  "Remediation": {
    "Code": {
      "CLI": "--event-qps=<appropriate_level>",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-event-qps-argument-is-set-to-0-or-a-level-which-ensures-appropriate-event-capture",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure kubelet with a balanced eventRecordQPS setting for effective event capture without causing DoS conditions.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/#options"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Consider the specific needs and capacity of your environment when setting eventRecordQPS."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_event_record_qps.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_event_record_qps/kubelet_event_record_qps.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.kubelet.kubelet_client import kubelet_client


class kubelet_event_record_qps(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for cm in kubelet_client.kubelet_config_maps:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=cm)
            if "eventRecordQPS" not in cm.kubelet_args:
                report.status = "MANUAL"
                report.status_extended = f"Kubelet does not have the argument `eventRecordQPS` in config file {cm.name}, verify it in the node's arguments."
            else:
                if cm.kubelet_args.get("streamingConnectionIdleTimeout") > 0:
                    report.status = "PASS"
                    report.status_extended = f"Kubelet has an appropriate eventRecordQPS setting in config file {cm.name}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Kubelet has eventRecordQPS set to 0 that may lead to DoS conditions in config file {cm.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kubelet_manage_iptables.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_manage_iptables/kubelet_manage_iptables.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "kubelet_manage_iptables",
  "CheckTitle": "Ensure that the kubelet --make-iptables-util-chains argument is set to true",
  "CheckType": [],
  "ServiceName": "kubelet",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesKubelet",
  "Description": "This check ensures that the Kubelet is configured to manage iptables, which keeps the iptables configuration in sync with the dynamic pod network configuration. Allowing the Kubelet to manage iptables helps to avoid network communication issues between pods/containers.",
  "Risk": "If kubelet does not manage iptables, manual configurations might conflict with dynamic pod networking, causing communication issues.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/",
  "Remediation": {
    "Code": {
      "CLI": "--make-iptables-util-chains=true",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-make-iptables-util-chains-argument-is-set-to-true",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable kubelet management of iptables for consistent network configuration.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/#options"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "If you are using another iptables management solution, ensure it is compatible with the kubelet's management of iptables."
}
```

--------------------------------------------------------------------------------

---[FILE: kubelet_manage_iptables.py]---
Location: prowler-master/prowler/providers/kubernetes/services/kubelet/kubelet_manage_iptables/kubelet_manage_iptables.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.kubelet.kubelet_client import kubelet_client


class kubelet_manage_iptables(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for cm in kubelet_client.kubelet_config_maps:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=cm)
            if "makeIPTablesUtilChains" not in cm.kubelet_args:
                report.status = "MANUAL"
                report.status_extended = f"Kubelet does not have the argument `makeIPTablesUtilChains` in config file {cm.name}, verify it in the node's arguments."
            else:
                if cm.kubelet_args["makeIPTablesUtilChains"]:
                    report.status = "PASS"
                    report.status_extended = f"Kubelet is configured to manage iptables in config file {cm.name}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Kubelet is not configured to manage iptables in config file {cm.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
