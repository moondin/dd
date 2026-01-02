---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 377
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 377 of 867)

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

---[FILE: rbac_minimize_pod_creation_access.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_pod_creation_access/rbac_minimize_pod_creation_access.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "rbac_minimize_pod_creation_access",
  "CheckTitle": "Minimize access to create pods",
  "CheckType": [],
  "ServiceName": "rbac",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Pod",
  "Description": "This check ensures that the ability to create pods in a Kubernetes cluster is restricted to a minimal group of users. Limiting pod creation access mitigates the risk of privilege escalation and exposure of sensitive data.",
  "Risk": "Unrestricted access to create pods can lead to potential security risks and privilege escalation within the cluster.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict pod creation access to minimize security risks.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Care should be taken to ensure that restrictions do not disrupt normal operations of the cluster."
}
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_pod_creation_access.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_pod_creation_access/rbac_minimize_pod_creation_access.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.rbac.lib.role_permissions import (
    is_rule_allowing_permissions,
)
from prowler.providers.kubernetes.services.rbac.rbac_client import rbac_client

verbs = ["create"]
resources = ["pods"]


class rbac_minimize_pod_creation_access(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        # Check ClusterRoleBindings for pod create access
        for cr in rbac_client.cluster_roles.values():
            report = Check_Report_Kubernetes(
                metadata=self.metadata(), resource=cr.metadata
            )
            report.status = "PASS"
            report.status_extended = (
                f"ClusterRole {cr.metadata.name} does not have pod create access."
            )
            if is_rule_allowing_permissions(cr.rules, resources, verbs):
                report.status = "FAIL"
                report.status_extended = (
                    f"ClusterRole {cr.metadata.name} has pod create access."
                )
            findings.append(report)

        # Check RoleBindings for pod create access
        for role in rbac_client.roles.values():
            report = Check_Report_Kubernetes(
                metadata=self.metadata(), resource=role.metadata
            )
            report.status = "PASS"
            report.status_extended = (
                f"Role {role.metadata.name} does not have pod create access."
            )

            if is_rule_allowing_permissions(role.rules, resources, verbs):
                report.status = "FAIL"
                report.status_extended = (
                    f"Role {role.metadata.name} has pod create access."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_pv_creation_access.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_pv_creation_access/rbac_minimize_pv_creation_access.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "rbac_minimize_pv_creation_access",
  "CheckTitle": "Minimize access to create persistent volumes",
  "CheckType": [],
  "ServiceName": "rbac",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "PersistentVolume",
  "Description": "This check ensures that the ability to create persistent volumes in Kubernetes is restricted to authorized users only. Limiting this capability helps prevent privilege escalation scenarios through the creation of hostPath volumes.",
  "Risk": "Excessive permissions to create persistent volumes can lead to unauthorized access to sensitive host files, overriding the restrictions imposed by Pod Security Admission policies.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/rbac-good-practices/#persistent-volume-creation",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict access to create persistent volumes in the cluster.",
      "Url": "https://kubernetes.io/docs/concepts/security/rbac-good-practices/#persistent-volume-creation"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Carefully evaluate which users or service accounts require the ability to create PersistentVolumes and restrict access accordingly."
}
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_pv_creation_access.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_pv_creation_access/rbac_minimize_pv_creation_access.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.rbac.lib.role_permissions import (
    is_rule_allowing_permissions,
)
from prowler.providers.kubernetes.services.rbac.rbac_client import rbac_client

verbs = ["create"]
resources = ["persistentvolumes"]


class rbac_minimize_pv_creation_access(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        # Check each ClusterRoleBinding for access to create PersistentVolumes
        for crb in rbac_client.cluster_role_bindings.values():
            for subject in crb.subjects:
                if subject.kind in ["User", "Group"]:
                    report = Check_Report_Kubernetes(
                        metadata=self.metadata(), resource=subject
                    )
                    report.status = "PASS"
                    report.status_extended = f"User or group '{subject.name}' does not have access to create PersistentVolumes."
                    for cr in rbac_client.cluster_roles.values():
                        if cr.metadata.name == crb.roleRef.name:
                            if is_rule_allowing_permissions(cr.rules, resources, verbs):
                                report.status = "FAIL"
                                report.status_extended = f"User or group '{subject.name}' has access to create PersistentVolumes."
                                break
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_secret_access.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_secret_access/rbac_minimize_secret_access.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "rbac_minimize_secret_access",
  "CheckTitle": "Minimize access to secrets",
  "CheckType": [],
  "ServiceName": "rbac",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Secrets",
  "Description": "This check ensures that access to secrets in the Kubernetes API is restricted to the smallest possible group of users. Minimizing access to secrets helps in reducing the risk of privilege escalation and potential unauthorized access to sensitive data.",
  "Risk": "Inappropriate access to secrets can lead to escalation of privileges and unauthorized access to cluster resources or external resources managed through the secrets.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/configuration/secret/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/no-serviceaccountnode-should-be-able-to-read-all-secrets",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict access to Kubernetes secrets to the smallest possible set of users.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/"
    }
  },
  "Categories": [
    "trustboundaries",
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Care should be taken to avoid disrupting system components that require access to secrets for proper functioning."
}
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_secret_access.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_secret_access/rbac_minimize_secret_access.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.rbac.lib.role_permissions import (
    is_rule_allowing_permissions,
)
from prowler.providers.kubernetes.services.rbac.rbac_client import rbac_client

verbs = ["get", "list", "watch"]
resources = ["secret"]


class rbac_minimize_secret_access(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        # Check ClusterRoleBindings for seceret access
        for cr in rbac_client.cluster_roles.values():
            report = Check_Report_Kubernetes(
                metadata=self.metadata(), resource=cr.metadata
            )
            report.status = "PASS"
            report.status_extended = (
                f"ClusterRole {cr.metadata.name} does not have secret access."
            )
            if is_rule_allowing_permissions(cr.rules, resources, verbs):
                report.status = "FAIL"
                report.status_extended = (
                    f"ClusterRole {cr.metadata.name} has secret access."
                )
            findings.append(report)

        # Check RoleBindings for secret access
        for role in rbac_client.roles.values():
            report = Check_Report_Kubernetes(
                metadata=self.metadata(), resource=role.metadata
            )
            report.status = "PASS"
            report.status_extended = (
                f"Role {role.metadata.name} does not have secret access."
            )

            if is_rule_allowing_permissions(cr.rules, resources, verbs):
                report.status = "FAIL"
                report.status_extended = f"Role {role.metadata.name} has secret access."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_service_account_token_creation.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_service_account_token_creation/rbac_minimize_service_account_token_creation.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "rbac_minimize_service_account_token_creation",
  "CheckTitle": "Minimize access to the service account token creation",
  "CheckType": [],
  "ServiceName": "rbac",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "ServiceAccountToken",
  "Description": "This check ensures that access to create new service account tokens is restricted within the Kubernetes cluster. Unrestricted token creation can lead to privilege escalation and persistent unauthorized access to the cluster.",
  "Risk": "Granting excessive permissions for service account token creation can lead to abuse and compromise of cluster security.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/rbac-good-practices/#token-request",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict access to service account token creation in the cluster.",
      "Url": "https://kubernetes.io/docs/concepts/security/rbac-good-practices/#token-request"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Consider using role-based access control to precisely define and manage permissions related to service account token creation."
}
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_service_account_token_creation.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_service_account_token_creation/rbac_minimize_service_account_token_creation.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.rbac.lib.role_permissions import (
    is_rule_allowing_permissions,
)
from prowler.providers.kubernetes.services.rbac.rbac_client import rbac_client

verbs = ["create"]
resources = ["serviceaccounts/token"]


class rbac_minimize_service_account_token_creation(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for crb in rbac_client.cluster_role_bindings.values():
            for subject in crb.subjects:
                if subject.kind in ["User", "Group"]:
                    report = Check_Report_Kubernetes(
                        metadata=self.metadata(), resource=subject
                    )
                    report.status = "PASS"
                    report.status_extended = f"User or group '{subject.name}' does not have access to create service account tokens."
                    for cr in rbac_client.cluster_roles.values():
                        if cr.metadata.name == crb.roleRef.name:
                            if is_rule_allowing_permissions(cr.rules, resources, verbs):
                                report.status = "FAIL"
                                report.status_extended = f"User or group '{subject.name}' has access to create service account tokens."
                                break
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_webhook_config_access.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_webhook_config_access/rbac_minimize_webhook_config_access.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "rbac_minimize_webhook_config_access",
  "CheckTitle": "Minimize access to webhook configuration objects",
  "CheckType": [],
  "ServiceName": "rbac",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "WebhookConfiguration",
  "Description": "This check ensures that access to webhook configuration objects (validatingwebhookconfigurations and mutatingwebhookconfigurations) is restricted. Unauthorized access or modification of these objects can lead to privilege escalation or disruption of cluster operations.",
  "Risk": "Inadequately restricted access to webhook configurations can result in unauthorized control over webhooks, potentially allowing privilege escalation or interference with cluster functionality.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/rbac-good-practices/#control-admission-webhooks",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-clusterroles-that-grant-control-over-validating-or-mutating-admission-webhook-configurations-are-minimized",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict access to webhook configuration objects in the cluster.",
      "Url": "https://kubernetes.io/docs/concepts/security/rbac-good-practices/#control-admission-webhooks"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Consider using role-based access control to precisely define and manage permissions related to webhook configurations."
}
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_webhook_config_access.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_webhook_config_access/rbac_minimize_webhook_config_access.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.rbac.lib.role_permissions import (
    is_rule_allowing_permissions,
)
from prowler.providers.kubernetes.services.rbac.rbac_client import rbac_client

resources = [
    "validatingwebhookconfigurations",
    "mutatingwebhookconfigurations",
]
verbs = ["create", "update", "delete"]


class rbac_minimize_webhook_config_access(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for crb in rbac_client.cluster_role_bindings.values():
            for subject in crb.subjects:
                if subject.kind in ["User", "Group"]:
                    report = Check_Report_Kubernetes(
                        metadata=self.metadata(), resource=subject
                    )
                    report.status = "PASS"
                    report.status_extended = f"User or group '{subject.name}' does not have access to create, update, or delete webhook configurations."
                    for cr in rbac_client.cluster_roles.values():
                        if cr.metadata.name == crb.roleRef.name:
                            if is_rule_allowing_permissions(
                                cr.rules,
                                resources,
                                verbs,
                            ):
                                report.status = "FAIL"
                                report.status_extended = f"User or group '{subject.name}' has access to create, update, or delete webhook configurations."
                                break
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_wildcard_use_roles.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_wildcard_use_roles/rbac_minimize_wildcard_use_roles.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "rbac_minimize_wildcard_use_roles",
  "CheckTitle": "Minimize wildcard use in Roles and ClusterRoles",
  "CheckType": [],
  "ServiceName": "rbac",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Role/ClusterRole",
  "Description": "This check ensures that Roles and ClusterRoles in Kubernetes minimize the use of wildcards. Restricting wildcards enhances security by enforcing the principle of least privilege, ensuring users have only the access required for their role.",
  "Risk": "Use of wildcards can lead to excessive rights being granted, potentially allowing users to access or modify resources beyond their scope of responsibility.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-minimized-wildcard-use-in-roles-and-clusterroles",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Replace wildcards in roles and clusterroles with specific permissions.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/#referring-to-resources"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Care should be taken to ensure that replacing wildcards does not disrupt normal operations of the cluster."
}
```

--------------------------------------------------------------------------------

---[FILE: rbac_minimize_wildcard_use_roles.py]---
Location: prowler-master/prowler/providers/kubernetes/services/rbac/rbac_minimize_wildcard_use_roles/rbac_minimize_wildcard_use_roles.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.rbac.rbac_client import rbac_client


class rbac_minimize_wildcard_use_roles(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        # Check ClusterRoles for wildcards
        for cr in rbac_client.cluster_roles.values():
            report = Check_Report_Kubernetes(
                metadata=self.metadata(), resource=cr.metadata
            )
            report.status = "PASS"
            report.status_extended = (
                f"ClusterRole {cr.metadata.name} does not use wildcards."
            )

            for rule in cr.rules:
                if (rule.resources and "*" in str(rule.resources)) or (
                    rule.verbs and "*" in rule.verbs
                ):
                    report.status = "FAIL"
                    report.status_extended = (
                        f"ClusterRole {cr.metadata.name} uses wildcards."
                    )
            findings.append(report)

        # Check Roles for wildcards
        for role in rbac_client.roles.values():
            report = Check_Report_Kubernetes(
                metadata=self.metadata(), resource=role.metadata
            )
            report.status = "PASS"
            report.status_extended = (
                f"Role {role.metadata.name} does not use wildcards."
            )

            for rule in role.rules:
                if (rule.resources and "*" in str(rule.resources)) or (
                    rule.verbs and "*" in rule.verbs
                ):
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Role {role.metadata.name} uses wildcards."
                    )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: scheduler_client.py]---
Location: prowler-master/prowler/providers/kubernetes/services/scheduler/scheduler_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.kubernetes.services.scheduler.scheduler_service import Scheduler

scheduler_client = Scheduler(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: scheduler_service.py]---
Location: prowler-master/prowler/providers/kubernetes/services/scheduler/scheduler_service.py

```python
from prowler.lib.logger import logger
from prowler.providers.kubernetes.kubernetes_provider import KubernetesProvider
from prowler.providers.kubernetes.lib.service.service import KubernetesService
from prowler.providers.kubernetes.services.core.core_client import core_client


class Scheduler(KubernetesService):
    def __init__(self, provider: KubernetesProvider):
        super().__init__(provider)
        self.client = core_client

        self.scheduler_pods = self._get_scheduler_pods()

    def _get_scheduler_pods(self):
        try:
            scheduler_pods = []
            for pod in self.client.pods.values():
                if pod.namespace == "kube-system" and pod.name.startswith(
                    "kube-scheduler"
                ):
                    scheduler_pods.append(pod)
            return scheduler_pods
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
```

--------------------------------------------------------------------------------

---[FILE: scheduler_bind_address.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/scheduler/scheduler_bind_address/scheduler_bind_address.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "scheduler_bind_address",
  "CheckTitle": "Ensure that the --bind-address argument is set to 127.0.0.1 for the Scheduler",
  "CheckType": [],
  "ServiceName": "scheduler",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesScheduler",
  "Description": "This check ensures that the Kubernetes Scheduler is bound to the loopback address (127.0.0.1) to minimize the cluster's attack surface. Binding to the loopback address prevents unauthorized network access to the Scheduler's health and metrics information.",
  "Risk": "Binding the Scheduler to a non-loopback address exposes sensitive health and metrics information without authentication or encryption.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/",
  "Remediation": {
    "Code": {
      "CLI": "--bind-address=127.0.0.1",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-bind-address-argument-is-set-to-127001-1",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Bind the Scheduler to the loopback address for enhanced security.",
      "Url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure compatibility with the Kubernetes version in use, as command-line flags may differ."
}
```

--------------------------------------------------------------------------------

---[FILE: scheduler_bind_address.py]---
Location: prowler-master/prowler/providers/kubernetes/services/scheduler/scheduler_bind_address/scheduler_bind_address.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.scheduler.scheduler_client import (
    scheduler_client,
)


class scheduler_bind_address(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in scheduler_client.scheduler_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Scheduler is bound to the loopback address in pod {pod.name}."
            )
            for container in pod.containers.values():
                if "--bind-address=127.0.0.1" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = f"Scheduler is not bound to the loopback address in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: scheduler_profiling.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/scheduler/scheduler_profiling/scheduler_profiling.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "scheduler_profiling",
  "CheckTitle": "Ensure that the --profiling argument is set to false",
  "CheckType": [],
  "ServiceName": "scheduler",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesScheduler",
  "Description": "Disable profiling in the Kubernetes Scheduler unless it is needed for troubleshooting. Profiling can reveal detailed system and application performance data, which might be exploited if exposed. Turning off profiling reduces the potential attack surface and performance overhead.",
  "Risk": "While profiling is useful for identifying performance issues, it generates detailed data that could potentially expose sensitive information about the system and its performance characteristics.",
  "RelatedUrl": "https://github.com/kubernetes/community/blob/master/contributors/devel/profiling.md",
  "Remediation": {
    "Code": {
      "CLI": "--profiling=false",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-profiling-argument-is-set-to-false-2",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To minimize exposure to performance data and potential vulnerabilities, ensure the --profiling argument in the Kubernetes Scheduler is set to false.",
      "Url": "https://kubernetes.io/docs/admin/kube-scheduler/"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, profiling is enabled in Kubernetes Scheduler. Disabling it is a good security practice if profiling data is not needed for regular operations."
}
```

--------------------------------------------------------------------------------

---[FILE: scheduler_profiling.py]---
Location: prowler-master/prowler/providers/kubernetes/services/scheduler/scheduler_profiling/scheduler_profiling.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.scheduler.scheduler_client import (
    scheduler_client,
)


class scheduler_profiling(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in scheduler_client.scheduler_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "FAIL"
            report.status_extended = (
                f"Scheduler has profiling enabled in pod {pod.name}."
            )
            for container in pod.containers.values():
                if "--profiling=false" in str(container.command):
                    report.status = "PASS"
                    report.status_extended = (
                        f"Scheduler does not have profiling enabled in pod {pod.name}."
                    )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
