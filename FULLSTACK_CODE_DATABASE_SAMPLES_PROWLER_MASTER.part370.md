---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 370
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 370 of 867)

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

---[FILE: apiserver_always_pull_images_plugin.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_always_pull_images_plugin/apiserver_always_pull_images_plugin.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_always_pull_images_plugin(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"AlwaysPullImages admission control plugin is set in pod {pod.name}."
            )
            plugin_set = False
            for container in pod.containers.values():
                plugin_set = False
                for command in container.command:
                    if command.startswith("--enable-admission-plugins"):
                        if "AlwaysPullImages" in command:
                            plugin_set = True
                            break
                if not plugin_set:
                    break
            if not plugin_set:
                report.status = "FAIL"
                report.status_extended = f"AlwaysPullImages admission control plugin is not set in pod {pod.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_anonymous_requests.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_anonymous_requests/apiserver_anonymous_requests.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_anonymous_requests",
  "CheckTitle": "Ensure that the --anonymous-auth argument is set to false",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "Disable anonymous requests to the API server. When enabled, requests that are not rejected by other configured authentication methods are treated as anonymous requests, which are then served by the API server. Disallowing anonymous requests strengthens security by ensuring all access is authenticated.",
  "Risk": "Enabling anonymous access to the API server can expose the cluster to unauthorized access and potential security vulnerabilities.",
  "RelatedUrl": "https://kubernetes.io/docs/admin/authentication/#anonymous-requests",
  "Remediation": {
    "Code": {
      "CLI": "--anonymous-auth=false",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-anonymous-auth-argument-is-set-to-false-1#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure the --anonymous-auth argument in the API server is set to false. This will reject all anonymous requests, enforcing authenticated access to the server.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "While anonymous access can be useful for health checks and discovery, consider the security implications for your specific environment."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_anonymous_requests.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_anonymous_requests/apiserver_anonymous_requests.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_anonymous_requests(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"API Server does not have anonymous-auth enabled in pod {pod.name}."
            )
            for container in pod.containers.values():
                if "--anonymous-auth=true" in container.command:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"API Server has anonymous-auth enabled in pod {pod.name}."
                    )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_audit_log_maxage_set.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_audit_log_maxage_set/apiserver_audit_log_maxage_set.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_audit_log_maxage_set",
  "CheckTitle": "Ensure that the --audit-log-maxage argument is set to 30 or as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured with an appropriate audit log retention period. Setting --audit-log-maxage to 30 or as per business requirements helps in maintaining logs for sufficient time to investigate past events.",
  "Risk": "Without an adequate log retention period, there may be insufficient audit history to investigate and analyze past events or security incidents.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/cluster-administration/audit/",
  "Remediation": {
    "Code": {
      "CLI": "--audit-log-maxage=30",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-audit-log-maxage-argument-is-set-to-30-or-as-appropriate#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure the API server audit log retention period to retain logs for at least 30 days or as per your organization's requirements.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure the audit log retention period is set appropriately to balance between storage constraints and the need for historical data."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_audit_log_maxage_set.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_audit_log_maxage_set/apiserver_audit_log_maxage_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_audit_log_maxage_set(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Audit log max age is set appropriately in the API server in pod {pod.name}."
            audit_log_maxage_set = False
            for container in pod.containers.values():
                audit_log_maxage_set = False
                # Check if "--audit-log-maxage" is set to 30 or as appropriate
                for command in container.command:
                    if command.startswith("--audit-log-maxage"):
                        if int(
                            command.split("=")[1]
                        ) == apiserver_client.audit_config.get("audit_log_maxage", 30):
                            audit_log_maxage_set = True
                            break
                if not audit_log_maxage_set:
                    break

            if not audit_log_maxage_set:
                report.status = "FAIL"
                report.status_extended = f"Audit log max age is not set to 30 or as appropriate in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_audit_log_maxbackup_set.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_audit_log_maxbackup_set/apiserver_audit_log_maxbackup_set.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_audit_log_maxbackup_set",
  "CheckTitle": "Ensure that the --audit-log-maxbackup argument is set to 10 or as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured with an appropriate number of audit log backups. Setting --audit-log-maxbackup to 10 or as per business requirements helps maintain a sufficient log backup for investigations or analysis.",
  "Risk": "Without an adequate number of audit log backups, there may be insufficient log history to investigate past events or security incidents.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/cluster-administration/audit/",
  "Remediation": {
    "Code": {
      "CLI": "--audit-log-maxbackup=10",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-audit-log-maxbackup-argument-is-set-to-10-or-as-appropriate#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure the API server audit log backup retention to 10 or as per your organization's requirements.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure the audit log backup retention period is set appropriately to balance between storage constraints and the need for historical data."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_audit_log_maxbackup_set.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_audit_log_maxbackup_set/apiserver_audit_log_maxbackup_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_audit_log_maxbackup_set(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Audit log max backup is set appropriately in the API server in pod {pod.name}."
            audit_log_maxbackup_set = False
            for container in pod.containers.values():
                audit_log_maxbackup_set = False
                # Check if "--audit-log-maxbackup" is set to 10 or as appropriate
                for command in container.command:
                    if command.startswith("--audit-log-maxbackup"):
                        if int(
                            command.split("=")[1]
                        ) == apiserver_client.audit_config.get(
                            "audit_log_maxbackup", 10
                        ):
                            audit_log_maxbackup_set = True
                            break
                if not audit_log_maxbackup_set:
                    break

            if not audit_log_maxbackup_set:
                report.status = "FAIL"
                report.status_extended = f"Audit log max backup is not set to 10 or as appropriate in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_audit_log_maxsize_set.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_audit_log_maxsize_set/apiserver_audit_log_maxsize_set.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_audit_log_maxsize_set",
  "CheckTitle": "Ensure that the --audit-log-maxsize argument is set to 100 or as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured with an appropriate audit log file size limit. Setting --audit-log-maxsize to 100 MB or as per business requirements helps manage the size of log files and prevents them from growing excessively large.",
  "Risk": "Without an appropriate audit log file size limit, log files can grow excessively large, potentially leading to storage issues and difficulty in log analysis.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/cluster-administration/audit/",
  "Remediation": {
    "Code": {
      "CLI": "--audit-log-maxsize=100",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-audit-log-maxsize-argument-is-set-to-100-or-as-appropriate#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure the API server audit log file size limit to 100 MB or as per your organization's requirements.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Adjust the audit log file size limit based on your organization's storage capabilities and logging requirements."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_audit_log_maxsize_set.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_audit_log_maxsize_set/apiserver_audit_log_maxsize_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_audit_log_maxsize_set(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Audit log max size is set appropriately in the API server in pod {pod.name}."
            audit_log_maxsize_set = False
            for container in pod.containers.values():
                audit_log_maxsize_set = False
                # Check if "--audit-log-maxsize" is set to 100 MB or as appropriate
                for command in container.command:
                    if command.startswith("--audit-log-maxsize"):
                        if int(
                            command.split("=")[1]
                        ) == apiserver_client.audit_config.get(
                            "audit_log_maxsize", 100
                        ):
                            audit_log_maxsize_set = True
                            break
                if not audit_log_maxsize_set:
                    break

            if not audit_log_maxsize_set:
                report.status = "FAIL"
                report.status_extended = f"Audit log max size is not set to 100 MB or as appropriate in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_audit_log_path_set.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_audit_log_path_set/apiserver_audit_log_path_set.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_audit_log_path_set",
  "CheckTitle": "Ensure that the --audit-log-path argument is set",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check verifies that the Kubernetes API server is configured with an audit log path. Enabling audit logs helps in maintaining a chronological record of all activities and operations which can be critical for security analysis and troubleshooting.",
  "Risk": "Without audit logs, it becomes difficult to track changes and activities within the cluster, potentially obscuring the detection of malicious activities or operational issues.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/cluster-administration/audit/",
  "Remediation": {
    "Code": {
      "CLI": "--audit-log-path=/var/log/apiserver/audit.log",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-audit-log-path-argument-is-set#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable audit logging in the API server by specifying a valid path for --audit-log-path to ensure comprehensive activity logging within the cluster.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Audit logs are not enabled by default in Kubernetes. Configuring them is essential for security monitoring and forensic analysis."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_audit_log_path_set.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_audit_log_path_set/apiserver_audit_log_path_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_audit_log_path_set(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Audit log path is set in the API server in pod {pod.name}."
            )
            audit_log_path_set = False
            for container in pod.containers.values():
                audit_log_path_set = False
                # Check if "--audit-log-path" is set
                if "--audit-log-path" in str(container.command):
                    audit_log_path_set = True
                if not audit_log_path_set:
                    break

            if not audit_log_path_set:
                report.status = "FAIL"
                report.status_extended = f"Audit log path is not set in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_auth_mode_include_node.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_auth_mode_include_node/apiserver_auth_mode_include_node.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_auth_mode_include_node",
  "CheckTitle": "Ensure that the --authorization-mode argument includes Node",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured to include 'Node' in its --authorization-mode argument. This mode restricts kubelets to only read objects associated with their nodes, enhancing security.",
  "Risk": "If the Node authorization mode is not included, kubelets may have broader access than necessary, which can pose a security risk.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/node/",
  "Remediation": {
    "Code": {
      "CLI": "--authorization-mode=Node,RBAC",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-authorization-mode-argument-includes-node",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure the API server to use Node authorization mode along with other modes like RBAC to restrict kubelet access to the necessary resources.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, Node authorization is not enabled in Kubernetes. It is important to set this for restricting kubelet nodes appropriately."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_auth_mode_include_node.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_auth_mode_include_node/apiserver_auth_mode_include_node.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_auth_mode_include_node(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"API Server authorization mode includes Node in pod {pod.name}."
            )
            node_auth_mode_set = False
            for container in pod.containers.values():
                node_auth_mode_set = False
                for command in container.command:
                    if command.startswith("--authorization-mode"):
                        if "Node" in (command.split("=")[1]):
                            node_auth_mode_set = True
                            break
                if not node_auth_mode_set:
                    break
            if not node_auth_mode_set:
                report.status = "FAIL"
                report.status_extended = f"API Server authorization mode does not include Node in pod {pod.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_auth_mode_include_rbac.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_auth_mode_include_rbac/apiserver_auth_mode_include_rbac.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_auth_mode_include_rbac",
  "CheckTitle": "Ensure that the --authorization-mode argument includes RBAC",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check verifies that Role Based Access Control (RBAC) is enabled in the Kubernetes API server's authorization mode. RBAC allows for fine-grained control over cluster operations and is recommended for secure and manageable access control.",
  "Risk": "If RBAC is not included in the API server's authorization mode, the cluster may not be leveraging fine-grained access controls, leading to potential security risks.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/",
  "Remediation": {
    "Code": {
      "CLI": "--authorization-mode=Node,RBAC",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-authorization-mode-argument-includes-rbac",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that the API server is configured with RBAC authorization mode for enhanced security and access control.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, Kubernetes API server may not use RBAC authorization. It is crucial to enable this setting to ensure proper access control in the cluster."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_auth_mode_include_rbac.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_auth_mode_include_rbac/apiserver_auth_mode_include_rbac.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_auth_mode_include_rbac(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"API Server authorization mode includes RBAC in pod {pod.name}."
            )
            rbac_auth_mode_set = False
            for container in pod.containers.values():
                rbac_auth_mode_set = False
                for command in container.command:
                    if command.startswith("--authorization-mode"):
                        if "RBAC" in (command.split("=")[1]):
                            rbac_auth_mode_set = True
                            break
                if not rbac_auth_mode_set:
                    break
            if not rbac_auth_mode_set:
                report.status = "FAIL"
                report.status_extended = f"API Server authorization mode does not include RBAC in pod {pod.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_auth_mode_not_always_allow.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_auth_mode_not_always_allow/apiserver_auth_mode_not_always_allow.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_auth_mode_not_always_allow",
  "CheckTitle": "Ensure that the --authorization-mode argument is not set to AlwaysAllow",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is not configured to always authorize all requests. The 'AlwaysAllow' mode bypasses all authorization checks, which should not be used on production clusters.",
  "Risk": "If set to AlwaysAllow, the API server would authorize all requests, potentially leading to unauthorized access and security vulnerabilities.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/authorization/#using-flags-for-your-authorization-module",
  "Remediation": {
    "Code": {
      "CLI": "--authorization-mode=RBAC",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-authorization-mode-argument-is-not-set-to-alwaysallow",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure the API server is using a secure authorization mode, such as RBAC, and not set to AlwaysAllow.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, AlwaysAllow is not enabled in kube-apiserver. It's crucial to maintain this setting for the security of the cluster."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_auth_mode_not_always_allow.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_auth_mode_not_always_allow/apiserver_auth_mode_not_always_allow.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_auth_mode_not_always_allow(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"API Server authorization mode is not set to AlwaysAllow in pod {pod.name}."
            always_allow_in_auth_mode = True
            for container in pod.containers.values():
                always_allow_in_auth_mode = True
                for command in container.command:
                    if command.startswith("--authorization-mode"):
                        if "AlwaysAllow" not in (command.split("=")[1]):
                            always_allow_in_auth_mode = False
                            break
                if always_allow_in_auth_mode:
                    break
            if always_allow_in_auth_mode:
                report.status = "FAIL"
                report.status_extended = f"API Server authorization mode is set to AlwaysAllow in pod {pod.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_client_ca_file_set.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_client_ca_file_set/apiserver_client_ca_file_set.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_client_ca_file_set",
  "CheckTitle": "Ensure that the --client-ca-file argument is set as appropriate",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that the Kubernetes API server is configured with the --client-ca-file argument, specifying the CA file for client authentication. This setting enables the API server to authenticate clients using certificates signed by the CA and is crucial for secure communication.",
  "Risk": "If the client CA file is not set, the API server may not properly authenticate clients, potentially leading to unauthorized access.",
  "RelatedUrl": "https://kubernetes.io/docs/setup/best-practices/certificates/",
  "Remediation": {
    "Code": {
      "CLI": "--client-ca-file=<path/to/client-ca-file>",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-client-ca-file-argument-is-set-as-appropriate-scored",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure the API server is configured with a client CA file for secure client authentication.",
      "Url": "https://kubernetes.io/docs/setup/best-practices/certificates/#certificate-paths"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "The client CA file is a critical component of TLS authentication and should be properly managed and securely stored."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_client_ca_file_set.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_client_ca_file_set/apiserver_client_ca_file_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_client_ca_file_set(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Client CA file is set appropriately in the API server in pod {pod.name}."
            client_ca_file_set = False
            for container in pod.containers.values():
                client_ca_file_set = False
                # Check if "--client-ca-file" is set
                if "--client-ca-file" in str(container.command):
                    client_ca_file_set = True
                if not client_ca_file_set:
                    break

            if not client_ca_file_set:
                report.status = "FAIL"
                report.status_extended = f"Client CA file is not set in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_deny_service_external_ips.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_deny_service_external_ips/apiserver_deny_service_external_ips.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_deny_service_external_ips",
  "CheckTitle": "Ensure that the DenyServiceExternalIPs is set",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures the DenyServiceExternalIPs admission controller is enabled, which rejects all new usage of the Service field externalIPs. Enabling this controller enhances security by preventing the misuse of the externalIPs field.",
  "Risk": "Not setting the DenyServiceExternalIPs admission controller could allow users to create Services with external IPs, potentially exposing services to security risks.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips",
  "Remediation": {
    "Code": {
      "CLI": "--disable-admission-plugins=DenyServiceExternalIPs",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable the DenyServiceExternalIPs admission controller by setting the '--disable-admission-plugins' argument in the kube-apiserver configuration.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-off-an-admission-controller"
    }
  },
  "Categories": [
    "internet-exposed",
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Consider the impact on existing services before enabling this admission controller, as it can restrict the usage of external IPs in the cluster."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_deny_service_external_ips.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_deny_service_external_ips/apiserver_deny_service_external_ips.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_deny_service_external_ips(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"API Server has DenyServiceExternalIPs admission controller enabled in pod {pod.name}."
            deny_service_external_ips = False
            for container in pod.containers.values():
                deny_service_external_ips = False
                for command in container.command:
                    if command.startswith("--disable-admission-plugins"):
                        if "DenyServiceExternalIPs" in (command.split("=")[1]):
                            deny_service_external_ips = True
                if not deny_service_external_ips:
                    break
            if not deny_service_external_ips:
                report.status = "FAIL"
                report.status_extended = f"API Server does not have DenyServiceExternalIPs enabled in pod {pod.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: apiserver_disable_profiling.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_disable_profiling/apiserver_disable_profiling.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "apiserver_disable_profiling",
  "CheckTitle": "Ensure that the --profiling argument is set to false",
  "CheckType": [],
  "ServiceName": "apiserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesAPIServer",
  "Description": "This check ensures that profiling is disabled in the Kubernetes API server. Profiling generates extensive data about the system's performance and operations, which, if not needed, should be disabled to reduce the attack surface.",
  "Risk": "Enabled profiling can potentially expose detailed system and program data, which might be exploited for malicious purposes.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/",
  "Remediation": {
    "Code": {
      "CLI": "--profiling=false",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-profiling-argument-is-set-to-false-2",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable profiling in the API server unless it is necessary for troubleshooting performance bottlenecks.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Profiling is enabled by default in Kubernetes. Disabling it when not needed helps in securing the cluster."
}
```

--------------------------------------------------------------------------------

---[FILE: apiserver_disable_profiling.py]---
Location: prowler-master/prowler/providers/kubernetes/services/apiserver/apiserver_disable_profiling/apiserver_disable_profiling.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.apiserver.apiserver_client import (
    apiserver_client,
)


class apiserver_disable_profiling(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in apiserver_client.apiserver_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Profiling is disabled in pod {pod.name}."
            profiling_enabled = False
            for container in pod.containers.values():
                profiling_enabled = False
                # Check if "--profiling" is set to false
                if "--profiling=false" not in str(container.command):
                    profiling_enabled = True
                    break
            if profiling_enabled:
                report.status = "FAIL"
                report.status_extended = f"Profiling is enabled in pod {pod.name}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
