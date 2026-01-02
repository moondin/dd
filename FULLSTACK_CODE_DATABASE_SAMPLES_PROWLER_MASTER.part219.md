---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 219
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 219 of 867)

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

---[FILE: cs_kubernetes_cluster_check_weekly.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_cluster_check_weekly/cs_kubernetes_cluster_check_weekly.py

```python
from datetime import datetime, timedelta, timezone

from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.cs.cs_client import cs_client


class cs_kubernetes_cluster_check_weekly(Check):
    """Check if Cluster Check is triggered at least once per week for Kubernetes Clusters."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        # Get configurable max days from audit config (default: 7 days)
        max_cluster_check_days = cs_client.audit_config.get("max_cluster_check_days", 7)

        # Calculate the threshold date
        threshold_date = datetime.now(timezone.utc) - timedelta(
            days=max_cluster_check_days
        )

        for cluster in cs_client.clusters:
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=cluster)
            report.region = cluster.region
            report.resource_id = cluster.id
            report.resource_arn = f"acs:cs:{cluster.region}:{cs_client.audited_account}:cluster/{cluster.id}"

            if cluster.last_check_time:
                # Ensure last_check_time is timezone-aware
                last_check = cluster.last_check_time
                if last_check.tzinfo is None:
                    # If naive datetime, assume UTC
                    last_check = last_check.replace(tzinfo=timezone.utc)

                # Calculate days since last check
                days_since_check = (datetime.now(timezone.utc) - last_check).days

                if last_check >= threshold_date:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Kubernetes cluster {cluster.name} has had a successful cluster check "
                        f"within the last {max_cluster_check_days} days "
                        f"(last check: {cluster.last_check_time.strftime('%Y-%m-%d %H:%M:%S UTC')}, "
                        f"{days_since_check} days ago)."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Kubernetes cluster {cluster.name} has not had a successful cluster check "
                        f"within the last {max_cluster_check_days} days "
                        f"(last check: {cluster.last_check_time.strftime('%Y-%m-%d %H:%M:%S UTC')}, "
                        f"{days_since_check} days ago)."
                    )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Kubernetes cluster {cluster.name} has no successful cluster check history. "
                    f"Cluster checks should be triggered at least once every {max_cluster_check_days} days."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_dashboard_disabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_dashboard_disabled/cs_kubernetes_dashboard_disabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "cs_kubernetes_dashboard_disabled",
  "CheckTitle": "Kubernetes web UI / Dashboard is not enabled",
  "CheckType": [
    "Threat detection during container runtime",
    "Unusual logon"
  ],
  "ServiceName": "cs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:cs:region:account-id:cluster/{cluster-id}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudKubernetesCluster",
  "Description": "**Dashboard** is a web-based Kubernetes user interface that can be used to deploy containerized applications to a Kubernetes cluster, troubleshoot your containerized application, and manage the cluster itself.\n\nYou should disable the **Kubernetes Web UI (Dashboard)** when running on Kubernetes Engine. The Dashboard is backed by a highly privileged Kubernetes Service Account. It is recommended to use the **ACK User Console** instead to avoid privilege escalation via a compromised dashboard.",
  "Risk": "The **Kubernetes Dashboard** is backed by a highly privileged Service Account. If the Dashboard is compromised, it could allow an attacker to gain **full control** over the cluster and potentially **escalate privileges**.\n\nAttackers who gain access to the Dashboard can deploy malicious workloads, exfiltrate secrets, and compromise the entire cluster.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/86494.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ACK/disable-kubernetes-dashboard.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "Use kubectl to delete the dashboard deployment: kubectl delete deployment kubernetes-dashboard -n kube-system",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **ACK Console**\n2. Select the target cluster and select the `kube-system` namespace in the Namespace pop-menu\n3. Input `dashboard` in the deploy filter bar\n4. Make sure there is no result after the filter\n5. If dashboard exists, delete the deployment by selecting **Delete** in the More pop-menu",
      "Url": "https://hub.prowler.com/check/cs_kubernetes_dashboard_disabled"
    }
  },
  "Categories": [
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_dashboard_disabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_dashboard_disabled/cs_kubernetes_dashboard_disabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.cs.cs_client import cs_client


class cs_kubernetes_dashboard_disabled(Check):
    """Check if Kubernetes web UI / Dashboard is disabled."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for cluster in cs_client.clusters:
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=cluster)
            report.region = cluster.region
            report.resource_id = cluster.id
            report.resource_arn = f"acs:cs:{cluster.region}:{cs_client.audited_account}:cluster/{cluster.id}"

            if not cluster.dashboard_enabled:
                report.status = "PASS"
                report.status_extended = f"Kubernetes cluster {cluster.name} does not have the Kubernetes Dashboard enabled."
            else:
                report.status = "FAIL"
                report.status_extended = f"Kubernetes cluster {cluster.name} has the Kubernetes Dashboard enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_eni_multiple_ip_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_eni_multiple_ip_enabled/cs_kubernetes_eni_multiple_ip_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "cs_kubernetes_eni_multiple_ip_enabled",
  "CheckTitle": "ENI multiple IP mode support for Kubernetes Cluster",
  "CheckType": [
    "Threat detection during container runtime",
    "Suspicious network connection"
  ],
  "ServiceName": "cs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:cs:region:account-id:cluster/{cluster-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudKubernetesCluster",
  "Description": "Alibaba Cloud **ENI (Elastic Network Interface)** supports assigning ranges of internal IP addresses as aliases to a single virtual machine's ENI network interfaces.\n\nWith **ENI multiple IP mode**, Kubernetes Engine clusters can allocate IP addresses from a CIDR block known to **Terway** network plugin. This makes your cluster more scalable and allows better interaction with other Alibaba Cloud products.",
  "Risk": "Without **ENI multiple IP mode** (provided by Terway), pods share the node's network interface in a less scalable way.\n\nUsing ENI multiple IPs allows pod IPs to be reserved within the network ahead of time, preventing conflict with other compute resources, and allows firewall controls for Pods to be applied separately from their nodes.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/ack/ack-managed-and-ack-dedicated/user-guide/associate-multiple-security-groups-with-an-eni",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ACK/enable-multi-ip-mode.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "Terway network plugin must be selected during cluster creation to support ENI multiple IP mode.",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "When creating a new cluster, select **Terway** in the `Network Plugin` option to enable ENI multiple IP mode support.\n\n**Note:** Existing clusters using Flannel cannot be migrated to Terway.",
      "Url": "https://hub.prowler.com/check/cs_kubernetes_eni_multiple_ip_enabled"
    }
  },
  "Categories": [
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_eni_multiple_ip_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_eni_multiple_ip_enabled/cs_kubernetes_eni_multiple_ip_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.cs.cs_client import cs_client


class cs_kubernetes_eni_multiple_ip_enabled(Check):
    """Check if ENI multiple IP mode is supported on Kubernetes Engine Clusters."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for cluster in cs_client.clusters:
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=cluster)
            report.region = cluster.region
            report.resource_id = cluster.id
            report.resource_arn = f"acs:cs:{cluster.region}:{cs_client.audited_account}:cluster/{cluster.id}"

            if cluster.eni_multiple_ip_enabled:
                report.status = "PASS"
                report.status_extended = f"Kubernetes cluster {cluster.name} supports ENI multiple IP mode via Terway plugin."
            else:
                report.status = "FAIL"
                report.status_extended = f"Kubernetes cluster {cluster.name} does not support ENI multiple IP mode (requires Terway network plugin)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_log_service_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_log_service_enabled/cs_kubernetes_log_service_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "cs_kubernetes_log_service_enabled",
  "CheckTitle": "Log Service is set to Enabled on Kubernetes Engine Clusters",
  "CheckType": [
    "Threat detection during container runtime"
  ],
  "ServiceName": "cs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:cs:region:account-id:cluster/{cluster-id}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudKubernetesCluster",
  "Description": "**Log Service** is a complete real-time data logging service on Alibaba Cloud supporting collection, shipping, search, storage, and analysis for logs.\n\nLog Service can automatically collect, process, and store your container and audit logs in a dedicated, persistent datastore. Container logs are collected from your containers, audit logs from the `kube-apiserver` or deployed ingress, and events about cluster activity such as the deletion of Pods or Secrets.",
  "Risk": "Without **Log Service** enabled, you lose visibility into container and system logs. The per-node logging agent collects: `kube-apiserver` audit logs, ingress visiting logs, and standard output/error logs from containerized processes.\n\nLack of logging makes **incident investigation**, **compliance auditing**, and **security monitoring** significantly more difficult.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://help.aliyun.com/document_detail/91406.html",
    "https://help.aliyun.com/document_detail/86532.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ACK/enable-log-service.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun cs GET /clusters/[cluster_id] to verify AuditProjectName is set. When creating a new cluster, set Enable Log Service to Enabled.",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **ACK Console**\n2. Select the target cluster and click its name to open the cluster detail page\n3. Select **Cluster Auditing** on the left column and check if the audit page is shown\n4. To enable: When creating a new cluster, set `Enable Log Service` to **Enabled**",
      "Url": "https://hub.prowler.com/check/cs_kubernetes_log_service_enabled"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_log_service_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_log_service_enabled/cs_kubernetes_log_service_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.cs.cs_client import cs_client


class cs_kubernetes_log_service_enabled(Check):
    """Check if Log Service is enabled on Kubernetes Engine Clusters."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for cluster in cs_client.clusters:
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=cluster)
            report.region = cluster.region
            report.resource_id = cluster.id
            report.resource_arn = f"acs:cs:{cluster.region}:{cs_client.audited_account}:cluster/{cluster.id}"

            if cluster.log_service_enabled:
                report.status = "PASS"
                report.status_extended = f"Kubernetes cluster {cluster.name} has Log Service enabled with project: {cluster.audit_project_name}."
            else:
                report.status = "FAIL"
                report.status_extended = f"Kubernetes cluster {cluster.name} does not have Log Service enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_network_policy_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_network_policy_enabled/cs_kubernetes_network_policy_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "cs_kubernetes_network_policy_enabled",
  "CheckTitle": "Network policy is enabled on Kubernetes Engine Clusters",
  "CheckType": [
    "Threat detection during container runtime",
    "Suspicious network connection"
  ],
  "ServiceName": "cs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:cs:region:account-id:cluster/{cluster-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudKubernetesCluster",
  "Description": "A **Network Policy** is a specification of how groups of pods are allowed to communicate with each other and other network endpoints.\n\n`NetworkPolicy` resources use labels to select pods and define rules which specify what traffic is allowed. By default, pods are non-isolated and accept traffic from any source. Pods become isolated by having a NetworkPolicy that selects them.",
  "Risk": "Without **Network Policies**, all pods in a Kubernetes cluster can communicate with each other freely. This open communication model allows an attacker who compromises a single pod to potentially move **laterally** within the cluster and access sensitive services or data.\n\nNetwork Policies are essential for implementing **defense in depth** and **least privilege** networking.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://help.aliyun.com/document_detail/97621.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ACK/enable-network-policy-support.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "Network Policy support (Terway) must be selected during cluster creation.",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Only the **Terway** network plugin supports the Network Policy feature. When creating a new cluster, select **Terway** in the `Network Plugin` option.\n\n**Note:** Existing clusters using Flannel cannot be migrated to Terway.",
      "Url": "https://hub.prowler.com/check/cs_kubernetes_network_policy_enabled"
    }
  },
  "Categories": [
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_network_policy_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_network_policy_enabled/cs_kubernetes_network_policy_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.cs.cs_client import cs_client


class cs_kubernetes_network_policy_enabled(Check):
    """Check if Network policy is enabled on Kubernetes Engine Clusters."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for cluster in cs_client.clusters:
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=cluster)
            report.region = cluster.region
            report.resource_id = cluster.id
            report.resource_arn = f"acs:cs:{cluster.region}:{cs_client.audited_account}:cluster/{cluster.id}"

            if cluster.network_policy_enabled:
                report.status = "PASS"
                report.status_extended = f"Kubernetes cluster {cluster.name} has Network Policy enabled via Terway plugin."
            else:
                report.status = "FAIL"
                report.status_extended = f"Kubernetes cluster {cluster.name} does not have Network Policy enabled (requires Terway network plugin)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_private_cluster_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_private_cluster_enabled/cs_kubernetes_private_cluster_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "cs_kubernetes_private_cluster_enabled",
  "CheckTitle": "Kubernetes Cluster is created with Private cluster enabled",
  "CheckType": [
    "Threat detection during container runtime",
    "Unusual logon"
  ],
  "ServiceName": "cs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:cs:region:account-id:cluster/{cluster-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudKubernetesCluster",
  "Description": "A **private cluster** is a cluster that makes your master inaccessible from the public internet.\n\nIn a private cluster, nodes do not have public IP addresses, so your workloads run in an environment that is isolated from the internet. Nodes and masters communicate with each other privately using **VPC peering**.",
  "Risk": "Exposing the **API server endpoint** to the public internet increases the attack surface of your cluster. Attackers can attempt to probe for vulnerabilities, perform **brute force attacks**, or exploit misconfigurations if the API server is publicly accessible.\n\nUsing a private cluster significantly reduces network security risks.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://help.aliyun.com/document_detail/100380.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ACK/private-cluster.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "Public access settings cannot be easily changed for existing clusters. Ensure Public Access is disabled during creation.",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **ACK Console**\n2. Select the target cluster name and go to the cluster detail page\n3. Check if there is no `API Server Public Network Endpoint` under Cluster Information\n4. When creating a new cluster, make sure **Public Access** is not enabled",
      "Url": "https://hub.prowler.com/check/cs_kubernetes_private_cluster_enabled"
    }
  },
  "Categories": [
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_private_cluster_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_private_cluster_enabled/cs_kubernetes_private_cluster_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.cs.cs_client import cs_client


class cs_kubernetes_private_cluster_enabled(Check):
    """Check if Kubernetes Cluster is created with Private cluster enabled."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for cluster in cs_client.clusters:
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=cluster)
            report.region = cluster.region
            report.resource_id = cluster.id
            report.resource_arn = f"acs:cs:{cluster.region}:{cs_client.audited_account}:cluster/{cluster.id}"

            if cluster.private_cluster_enabled:
                report.status = "PASS"
                report.status_extended = f"Kubernetes cluster {cluster.name} is a private cluster (no public API endpoint)."
            else:
                report.status = "FAIL"
                report.status_extended = f"Kubernetes cluster {cluster.name} has a public API endpoint exposed."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_rbac_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_rbac_enabled/cs_kubernetes_rbac_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "cs_kubernetes_rbac_enabled",
  "CheckTitle": "Role-based access control (RBAC) authorization is Enabled on Kubernetes Engine Clusters",
  "CheckType": [
    "Threat detection during container runtime",
    "Abnormal account"
  ],
  "ServiceName": "cs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:cs:region:account-id:cluster/{cluster-id}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudKubernetesCluster",
  "Description": "In Kubernetes, authorizers interact by granting a permission if any authorizer grants the permission. The legacy authorizer in Kubernetes Engine grants broad, statically defined permissions.\n\nTo ensure that **RBAC** limits permissions correctly, you must disable the legacy authorizer. RBAC has significant security advantages, helps ensure that users only have access to specific cluster resources within their own namespace, and is now stable in Kubernetes.",
  "Risk": "In Kubernetes, **RBAC** is used to grant permissions to resources at the cluster and namespace level. RBAC allows you to define roles with rules containing a set of permissions.\n\nWithout RBAC, legacy authorization mechanisms like **ABAC** grant **overly broad permissions**, increasing the risk of unauthorized access and privilege escalation.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://help.aliyun.com/document_detail/87656.html",
    "https://help.aliyun.com/document_detail/119596.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ACK/enable-rbac-authorization.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "RBAC is enabled by default on new ACK clusters. Verify cluster authorization configuration.",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **ACK Console**\n2. Navigate to **Clusters** -> **Authorizations** page\n3. Select the target RAM sub-account and configure the RBAC roles on specific clusters or namespaces\n4. Ensure **RBAC** is enabled and legacy ABAC authorization is disabled",
      "Url": "https://hub.prowler.com/check/cs_kubernetes_rbac_enabled"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_rbac_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_rbac_enabled/cs_kubernetes_rbac_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.cs.cs_client import cs_client


class cs_kubernetes_rbac_enabled(Check):
    """Check if RBAC authorization is enabled on Kubernetes Engine Clusters."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for cluster in cs_client.clusters:
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=cluster)
            report.region = cluster.region
            report.resource_id = cluster.id
            report.resource_arn = f"acs:cs:{cluster.region}:{cs_client.audited_account}:cluster/{cluster.id}"

            if cluster.rbac_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"Kubernetes cluster {cluster.name} has RBAC authorization enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = f"Kubernetes cluster {cluster.name} does not have RBAC authorization enabled or is using legacy ABAC authorization."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_client.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_client.py

```python
from prowler.providers.alibabacloud.services.ecs.ecs_service import ECS
from prowler.providers.common.provider import Provider

ecs_client = ECS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
