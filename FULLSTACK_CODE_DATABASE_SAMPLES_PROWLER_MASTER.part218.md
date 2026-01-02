---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 218
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 218 of 867)

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

---[FILE: actiontrail_multi_region_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/actiontrail/actiontrail_multi_region_enabled/actiontrail_multi_region_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.actiontrail.actiontrail_client import (
    actiontrail_client,
)


class actiontrail_multi_region_enabled(Check):
    """Check if ActionTrail is configured to export copies of all log entries."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        # Check if there's at least one multi-region trail that is enabled
        multi_region_trails = []
        for trail in actiontrail_client.trails.values():
            if trail.trail_region == "All" and trail.status == "Enable":
                multi_region_trails.append(trail)

        # Create a single report for the overall check
        report = CheckReportAlibabaCloud(metadata=self.metadata(), resource={})
        report.region = actiontrail_client.region
        report.resource_id = actiontrail_client.audited_account
        report.resource_arn = (
            f"acs:actiontrail::{actiontrail_client.audited_account}:trail"
        )

        if multi_region_trails:
            # At least one multi-region trail is enabled
            trail_names = [trail.name for trail in multi_region_trails]
            report.status = "PASS"
            report.status_extended = (
                f"ActionTrail is configured with {len(multi_region_trails)} multi-region trail(s) "
                f"that are enabled: {', '.join(trail_names)}. "
                "These trails export copies of all log entries across all regions."
            )
        else:
            # Check if there are any trails at all
            if actiontrail_client.trails:
                # There are trails but none are multi-region or enabled
                enabled_trails = [
                    t
                    for t in actiontrail_client.trails.values()
                    if t.status == "Enable"
                ]
                multi_region_trails_disabled = [
                    t
                    for t in actiontrail_client.trails.values()
                    if t.trail_region == "All" and t.status != "Enable"
                ]

                if enabled_trails and not multi_region_trails_disabled:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"ActionTrail has {len(enabled_trails)} enabled trail(s), but none are configured "
                        "for multi-region logging (TrailRegion is not set to 'All'). "
                        "Multi-region trails are required to capture events from all regions."
                    )
                elif multi_region_trails_disabled:
                    trail_names = [t.name for t in multi_region_trails_disabled]
                    report.status = "FAIL"
                    report.status_extended = (
                        f"ActionTrail has multi-region trail(s) but they are disabled: {', '.join(trail_names)}. "
                        "Enable the multi-region trail(s) to export copies of all log entries."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        "ActionTrail has trails configured, but none are enabled or configured for multi-region logging. "
                        "At least one trail with TrailRegion set to 'All' and Status set to 'Enable' is required."
                    )
            else:
                # No trails configured at all
                report.status = "FAIL"
                report.status_extended = (
                    "ActionTrail is not configured. No trails exist. "
                    "Create at least one multi-region trail (TrailRegion='All') and enable it "
                    "to export copies of all log entries across all regions."
                )

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: actiontrail_oss_bucket_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/actiontrail/actiontrail_oss_bucket_not_publicly_accessible/actiontrail_oss_bucket_not_publicly_accessible.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "actiontrail_oss_bucket_not_publicly_accessible",
  "CheckTitle": "The OSS used to store ActionTrail logs is not publicly accessible",
  "CheckType": [
    "Sensitive file tampering"
  ],
  "ServiceName": "actiontrail",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:oss::account-id:bucket-name",
  "Severity": "critical",
  "ResourceType": "AlibabaCloudOSSBucket",
  "Description": "**ActionTrail** logs a record of every API call made in your Alibaba Cloud account. These log files are stored in an **OSS bucket**.\n\nIt is recommended that the **Access Control List (ACL)** of the OSS bucket, which ActionTrail logs to, prevents public access to the ActionTrail logs.",
  "Risk": "Allowing **public access** to ActionTrail log content may aid an adversary in identifying weaknesses in the affected account's use or configuration.\n\nExposed audit logs can reveal sensitive information about your infrastructure, API usage patterns, and security configurations.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://help.aliyun.com/document_detail/31954.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ActionTrail/trail-bucket-publicly-accessible.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "ossutil set-acl oss://<bucketName> private -b",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_oss_bucket_public_access_block\" \"actiontrail\" {\n  bucket              = alicloud_oss_bucket.actiontrail.bucket\n  block_public_access = true\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **OSS Console**\n2. Right-click on the bucket and select **Basic Settings**\n3. In the Access Control List pane, click **Configure**\n4. The Bucket ACL tab shows three types of grants: `Private`, `Public Read`, `Public Read/Write`\n5. Ensure **Private** is set for the bucket\n6. Click **Save** to save the ACL",
      "Url": "https://hub.prowler.com/check/actiontrail_oss_bucket_not_publicly_accessible"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [
    "oss_bucket_not_publicly_accessible"
  ],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: actiontrail_oss_bucket_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/actiontrail/actiontrail_oss_bucket_not_publicly_accessible/actiontrail_oss_bucket_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.actiontrail.actiontrail_client import (
    actiontrail_client,
)
from prowler.providers.alibabacloud.services.oss.oss_client import oss_client


def _is_policy_public(policy_document: dict) -> bool:
    """
    Check if a bucket policy allows public access.

    A policy is considered public if it has a statement with:
    - Effect: "Allow"
    - Principal: ["*"] (or contains "*")
    - No Condition elements

    Args:
        policy_document: The parsed policy document as a dictionary.

    Returns:
        bool: True if policy allows public access, False otherwise.
    """
    if not policy_document:
        return False

    statements = policy_document.get("Statement", [])
    if not isinstance(statements, list):
        statements = [statements]

    for statement in statements:
        effect = statement.get("Effect", "")
        principal = statement.get("Principal", [])
        condition = statement.get("Condition")

        # If there's a condition, it's not truly public
        if condition:
            continue

        if effect == "Allow":
            # Check if Principal is "*" or contains "*"
            if isinstance(principal, list):
                if "*" in principal:
                    return True
            elif principal == "*":
                return True

    return False


class actiontrail_oss_bucket_not_publicly_accessible(Check):
    """Check if the OSS bucket used to store ActionTrail logs is not publicly accessible."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        # Get all ActionTrail trails
        for trail in actiontrail_client.trails.values():
            # Only check trails that have an OSS bucket configured
            if not trail.oss_bucket_name:
                continue

            # Find the OSS bucket used by this trail
            bucket = None
            for oss_bucket in oss_client.buckets.values():
                if oss_bucket.name == trail.oss_bucket_name:
                    bucket = oss_bucket
                    break

            # Create report for this trail's OSS bucket
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=trail)
            report.region = trail.home_region
            report.resource_id = trail.oss_bucket_name
            report.resource_arn = (
                f"acs:oss::{actiontrail_client.audited_account}:{trail.oss_bucket_name}"
            )

            if not bucket:
                # Bucket not found in OSS service (might not have permissions or bucket doesn't exist)
                report.status = "MANUAL"
                report.status_extended = (
                    f"ActionTrail trail {trail.name} uses OSS bucket {trail.oss_bucket_name}, "
                    "but the bucket could not be found or accessed. Please verify the bucket exists "
                    "and that you have permissions to access it."
                )
                findings.append(report)
                continue

            # Check bucket ACL
            acl_public = False
            if bucket.acl and bucket.acl != "private":
                if bucket.acl in ["public-read", "public-read-write"]:
                    acl_public = True

            # Check bucket policy
            policy_public = _is_policy_public(bucket.policy)

            # Determine status
            if acl_public or policy_public:
                report.status = "FAIL"
                issues = []
                if acl_public:
                    issues.append(f"Bucket ACL is set to {bucket.acl}")
                if policy_public:
                    issues.append("Bucket policy allows public access (Principal: '*')")
                report.status_extended = (
                    f"OSS bucket {trail.oss_bucket_name} used by ActionTrail trail {trail.name} "
                    f"is publicly accessible. {'; '.join(issues)}. "
                    "ActionTrail logs contain sensitive information and should not be publicly accessible."
                )
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"OSS bucket {trail.oss_bucket_name} used by ActionTrail trail {trail.name} "
                    f"is not publicly accessible. ACL is {bucket.acl} and bucket policy does not allow public access."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cs_client.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_client.py

```python
from prowler.providers.alibabacloud.services.cs.cs_service import CS
from prowler.providers.common.provider import Provider

cs_client = CS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: cs_service.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_service.py
Signals: Pydantic

```python
from datetime import datetime
from typing import Optional

from alibabacloud_cs20151215 import models as cs_models
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.alibabacloud.lib.service.service import AlibabaCloudService


class CS(AlibabaCloudService):
    """
    CS (Container Service) class for Alibaba Cloud Kubernetes (ACK).

    This class provides methods to interact with Alibaba Cloud Container Service
    to retrieve ACK clusters and their configurations.
    """

    def __init__(self, provider):
        # Call AlibabaCloudService's __init__
        super().__init__(__class__.__name__, provider, global_service=False)

        # Fetch CS resources
        self.clusters = []
        self.__threading_call__(self._describe_clusters)

    def _describe_clusters(self, regional_client):
        """List all ACK clusters and fetch their details in a specific region."""
        region = getattr(regional_client, "region", "unknown")
        logger.info(f"CS - Describing Kubernetes clusters in {region}...")

        try:
            # DescribeClustersV1 returns cluster list
            request = cs_models.DescribeClustersV1Request()
            response = regional_client.describe_clusters_v1(request)

            if response and response.body and response.body.clusters:
                for cluster_data in response.body.clusters:
                    cluster_id = getattr(cluster_data, "cluster_id", "")

                    if not self.audit_resources or is_resource_filtered(
                        cluster_id, self.audit_resources
                    ):
                        # Get detailed information for each cluster
                        cluster_detail = self._get_cluster_detail(
                            regional_client, cluster_id
                        )

                        if cluster_detail:
                            # Extract audit project name from meta_data
                            meta_data = cluster_detail.get("meta_data", {})
                            audit_project_name = meta_data.get("AuditProjectName", "")

                            # Check RBAC status - by default RBAC is enabled on ACK clusters
                            # We check if there are any indicators that RBAC is disabled
                            rbac_enabled = self._check_rbac_enabled(
                                cluster_detail, region
                            )

                            # Get node pools to check CloudMonitor
                            cloudmonitor_enabled = self._check_cloudmonitor_enabled(
                                regional_client, cluster_id
                            )

                            # Check if cluster checks have been run in the last week
                            last_check_time = self._get_last_cluster_check(
                                regional_client, cluster_id
                            )

                            # Check addons for dashboard, network policy, etc.
                            addons_status = self._check_cluster_addons(
                                cluster_detail, region
                            )

                            # Check for public API server endpoint
                            public_access_enabled = self._check_public_access(
                                cluster_detail, region
                            )

                            self.clusters.append(
                                Cluster(
                                    id=cluster_id,
                                    name=getattr(cluster_data, "name", cluster_id),
                                    region=region,
                                    cluster_type=getattr(
                                        cluster_data, "cluster_type", ""
                                    ),
                                    state=getattr(cluster_data, "state", ""),
                                    audit_project_name=audit_project_name,
                                    log_service_enabled=bool(audit_project_name),
                                    cloudmonitor_enabled=cloudmonitor_enabled,
                                    rbac_enabled=rbac_enabled,
                                    last_check_time=last_check_time,
                                    dashboard_enabled=addons_status[
                                        "dashboard_enabled"
                                    ],
                                    network_policy_enabled=addons_status[
                                        "network_policy_enabled"
                                    ],
                                    eni_multiple_ip_enabled=addons_status[
                                        "eni_multiple_ip_enabled"
                                    ],
                                    private_cluster_enabled=not public_access_enabled,
                                )
                            )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_cluster_detail(self, regional_client, cluster_id: str) -> dict:
        """Get detailed information for a specific cluster."""
        try:
            # DescribeClusterDetail returns detailed cluster information
            request = cs_models.DescribeClusterDetailRequest()
            response = regional_client.describe_cluster_detail(cluster_id, request)

            if response and response.body:
                # Convert response body to dict
                body = response.body
                result = {"meta_data": {}}

                # Check if meta_data exists in the response
                if hasattr(body, "meta_data"):
                    meta_data = body.meta_data
                    if meta_data:
                        result["meta_data"] = dict(meta_data)

                return result

            return {}

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return {}

    def _check_cloudmonitor_enabled(self, regional_client, cluster_id: str) -> bool:
        """Check if CloudMonitor is enabled on cluster node pools."""
        try:
            # DescribeClusterNodePools returns node pool information
            request = cs_models.DescribeClusterNodePoolsRequest()
            response = regional_client.describe_cluster_node_pools(cluster_id, request)

            if response and response.body and response.body.nodepools:
                nodepools = response.body.nodepools

                # Check if ALL node pools have CloudMonitor enabled
                # If any node pool has cms_enabled=false, the cluster fails
                for nodepool in nodepools:
                    kubernetes_config = getattr(nodepool, "kubernetes_config", None)
                    if kubernetes_config:
                        cms_enabled = getattr(kubernetes_config, "cms_enabled", False)
                        if not cms_enabled:
                            return False

                # All node pools have CloudMonitor enabled
                return True if nodepools else False

            return False

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return False

    def _check_rbac_enabled(self, cluster_detail: dict, region: str) -> bool:
        """
        Check if RBAC is enabled on the cluster.

        By default, RBAC is enabled on ACK clusters and ABAC is disabled.
        We check for any indicators that RBAC might be disabled or legacy auth enabled.
        """
        try:
            # Check if cluster has RBAC enabled (default is true for ACK clusters)
            # Look for security_options or parameters that indicate RBAC status

            # Check meta_data for any RBAC-related settings
            meta_data = cluster_detail.get("meta_data", {})

            # If there's an explicit RBAC disabled flag, check it
            if "RBACEnabled" in meta_data:
                return meta_data.get("RBACEnabled", "true") in ["true", "True", True]

            # Check parameters for authorization mode
            parameters = cluster_detail.get("parameters", {})
            if parameters:
                # Check if there's an authorization mode parameter
                auth_mode = parameters.get("authorization_mode", "RBAC")
                if "ABAC" in auth_mode and "RBAC" not in auth_mode:
                    # Legacy ABAC-only mode
                    return False

            # By default, RBAC is enabled on ACK clusters
            # If we don't find explicit indicators that it's disabled, assume it's enabled
            return True

        except Exception as error:
            logger.error(
                f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            # Default to True as RBAC is enabled by default on ACK
            return True

    def _get_last_cluster_check(self, regional_client, cluster_id: str):
        """
        Get the most recent successful cluster check time.

        Returns the finished_at timestamp of the most recent successful cluster check,
        or None if no successful checks found.
        """
        try:
            # DescribeClusterChecks returns cluster check history
            request = cs_models.DescribeClusterChecksRequest()
            response = regional_client.describe_cluster_checks(cluster_id, request)

            if response and response.body and response.body.checks:
                checks = response.body.checks

                # Find the most recent successful check
                most_recent_check = None

                for check in checks:
                    status = getattr(check, "status", "")
                    finished_at = getattr(check, "finished_at", None)

                    if status == "Succeeded" and finished_at:
                        # Parse the timestamp
                        if most_recent_check is None or finished_at > most_recent_check:
                            most_recent_check = finished_at

                return most_recent_check

            return None

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return None

    def _check_cluster_addons(self, cluster_detail: dict, region: str) -> dict:
        """
        Check cluster addons for various security configurations.

        Returns:
            dict: {
                "dashboard_enabled": bool,
                "network_policy_enabled": bool,
                "eni_multiple_ip_enabled": bool
            }
        """
        result = {
            "dashboard_enabled": False,
            "network_policy_enabled": False,
            "eni_multiple_ip_enabled": False,
        }

        try:
            meta_data = cluster_detail.get("meta_data", {})

            # Check Addons list in meta_data
            # Note: Addons structure from API is typically a string representation of JSON or a list
            # Based on sample: "Addons": [{"name": "gateway-api", ...}, ...]
            addons = meta_data.get("Addons", [])

            # If addons is string, try to parse it?
            # The SDK typically handles this conversion, but let's be safe
            if isinstance(addons, str):
                import json

                try:
                    addons = json.loads(addons)
                except Exception:
                    addons = []

            for addon in addons:
                name = addon.get("name", "")
                disabled = addon.get("disabled", False)

                # Check 7.5: Kubernetes Dashboard
                if name == "kubernetes-dashboard" and not disabled:
                    result["dashboard_enabled"] = True

                # Check 7.7 & 7.8: Terway network plugin
                if name == "terway-eniip" or name == "terway":
                    result["network_policy_enabled"] = True
                    result["eni_multiple_ip_enabled"] = True

            return result

        except Exception as error:
            logger.error(
                f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return result

    def _check_public_access(self, cluster_detail: dict, region: str) -> bool:
        """
        Check if cluster API server is accessible from public internet.

        Returns:
            bool: True if public access is enabled, False otherwise.
        """
        try:
            # Check master_url in cluster detail
            master_url = cluster_detail.get("master_url", "")

            # If master_url contains a public IP or DNS, public access is enabled
            # Private clusters typically don't expose a public endpoint or have specific settings

            # Check endpoint_public in parameters
            parameters = cluster_detail.get("parameters", {})
            endpoint_public = parameters.get("endpoint_public", "")

            if endpoint_public:
                return True

            # If we can't find explicit indicator, check if master_url is present
            # This is a heuristic - typical ACK public clusters expose a master_url
            if master_url:
                return True

            return False

        except Exception as error:
            logger.error(
                f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return False


# Models for CS service
class Cluster(BaseModel):
    """ACK Cluster model."""

    id: str
    name: str
    region: str
    cluster_type: str
    state: str
    audit_project_name: str = ""
    log_service_enabled: bool = False
    cloudmonitor_enabled: bool = False
    rbac_enabled: bool = True  # Default is True for ACK clusters
    last_check_time: Optional[datetime] = None
    dashboard_enabled: bool = False
    network_policy_enabled: bool = False
    eni_multiple_ip_enabled: bool = False
    private_cluster_enabled: bool = False
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_cloudmonitor_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_cloudmonitor_enabled/cs_kubernetes_cloudmonitor_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "cs_kubernetes_cloudmonitor_enabled",
  "CheckTitle": "CloudMonitor is set to Enabled on Kubernetes Engine Clusters",
  "CheckType": [
    "Threat detection during container runtime"
  ],
  "ServiceName": "cs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:cs:region:account-id:cluster/{cluster-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudKubernetesCluster",
  "Description": "The monitoring service in **Kubernetes Engine clusters** depends on the Alibaba Cloud **CloudMonitor** agent to access additional system resources and application services in virtual machine instances.\n\nThe monitor can access metrics about CPU utilization, disk traffic metrics, network traffic, and disk IO information, which help monitor signals and build operations in your Kubernetes Engine clusters.",
  "Risk": "Without **CloudMonitor** enabled, you lack visibility into system metrics and custom metrics. System metrics measure the cluster's infrastructure, such as CPU or memory usage.\n\nWith CloudMonitor, a monitor controller is created that periodically connects to each node and collects metrics about its Pods and containers, then sends the metrics to CloudMonitor server.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://help.aliyun.com/document_detail/125508.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ACK/enable-cloud-monitor.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun cs GET /clusters/[cluster_id]/nodepools to verify nodepools.kubernetes_config.cms_enabled is set to true for all node pools.",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **ACK Console**\n2. Select the target cluster and click its name to open the cluster detail page\n3. Select **Nodes** on the left column and click the **Monitor** link on the Actions column of the selected node\n4. Verify that OS Metrics data exists in the CloudMonitor page\n5. To enable: Click **Create Kubernetes Cluster** and set `CloudMonitor Agent` to **Enabled** under creation options",
      "Url": "https://hub.prowler.com/check/cs_kubernetes_cloudmonitor_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_cloudmonitor_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_cloudmonitor_enabled/cs_kubernetes_cloudmonitor_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.cs.cs_client import cs_client


class cs_kubernetes_cloudmonitor_enabled(Check):
    """Check if CloudMonitor is enabled on Kubernetes Engine Clusters."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for cluster in cs_client.clusters:
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=cluster)
            report.region = cluster.region
            report.resource_id = cluster.id
            report.resource_arn = f"acs:cs:{cluster.region}:{cs_client.audited_account}:cluster/{cluster.id}"

            if cluster.cloudmonitor_enabled:
                report.status = "PASS"
                report.status_extended = f"Kubernetes cluster {cluster.name} has CloudMonitor Agent enabled on all node pools."
            else:
                report.status = "FAIL"
                report.status_extended = f"Kubernetes cluster {cluster.name} does not have CloudMonitor Agent enabled on all node pools."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_cluster_check_recent.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_cluster_check_recent/cs_kubernetes_cluster_check_recent.metadata.json
Signals: Docker

```json
{
  "Provider": "alibabacloud",
  "CheckID": "cs_kubernetes_cluster_check_recent",
  "CheckTitle": "Cluster Check triggered within configured period for Kubernetes Clusters",
  "CheckType": [
    "Threat detection during container runtime"
  ],
  "ServiceName": "cs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:cs:region:account-id:cluster/{cluster-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudKubernetesCluster",
  "Description": "**Kubernetes Engine's cluster check** feature helps you verify the system nodes and components healthy status.\n\nWhen you trigger the checking, the process validates the health state of each node in your cluster and also the cluster configuration (`kubelet`, `docker daemon`, `kernel`, and network `iptables` configuration). If there are consecutive health check failures, the diagnose reports to admin for further repair.",
  "Risk": "Kubernetes Engine uses the node's health status to determine if a node needs to be repaired. A cluster health check includes: cloud resource healthy status including **VPC/VSwitch**, **SLB**, and every **ECS node** status in the cluster; the `kubelet`, `docker daemon`, `kernel`, `iptables` configurations on every node.\n\nWithout regular cluster checks, potential issues may go undetected and could lead to **cluster instability** or **security vulnerabilities**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://help.aliyun.com/document_detail/114882.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ACK/cluster-check.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun cs GET /clusters/[cluster_id]/checks to verify cluster checks are being run regularly. Trigger a check if needed.",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **ACK Console**\n2. Select the target cluster and open the **More** pop-menu for advanced options\n3. Select **Global Check** and click the **Start** button to trigger the checking\n4. Verify the checking time and details in Global Check\n5. It is recommended to trigger cluster checks at least once within the configured period (default: weekly)",
      "Url": "https://hub.prowler.com/check/cs_kubernetes_cluster_check_recent"
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

---[FILE: cs_kubernetes_cluster_check_recent.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_cluster_check_recent/cs_kubernetes_cluster_check_recent.py

```python
from datetime import datetime, timedelta, timezone

from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.cs.cs_client import cs_client


class cs_kubernetes_cluster_check_recent(Check):
    """Check if Cluster Check is triggered within the configured number of days."""

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

---[FILE: cs_kubernetes_cluster_check_weekly.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/cs/cs_kubernetes_cluster_check_weekly/cs_kubernetes_cluster_check_weekly.metadata.json
Signals: Docker

```json
{
  "Provider": "alibabacloud",
  "CheckID": "cs_kubernetes_cluster_check_weekly",
  "CheckTitle": "Cluster Check triggered at least once per week for Kubernetes Clusters",
  "CheckType": [
    "Threat detection during container runtime"
  ],
  "ServiceName": "cs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:cs:region:account-id:cluster/{cluster-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudKubernetesCluster",
  "Description": "**Kubernetes Engine's cluster check** feature helps you verify the system nodes and components healthy status.\n\nWhen you trigger the checking, the process validates the health state of each node in your cluster and also the cluster configuration (`kubelet`, `docker daemon`, `kernel`, and network `iptables` configuration). If there are consecutive health check failures, the diagnose reports to admin for further repair.",
  "Risk": "Kubernetes Engine uses the node's health status to determine if a node needs to be repaired. A cluster health check includes: cloud resource healthy status including **VPC/VSwitch**, **SLB**, and every **ECS node** status in the cluster; the `kubelet`, `docker daemon`, `kernel`, `iptables` configurations on every node.\n\nWithout regular cluster checks, potential issues may go undetected and could lead to **cluster instability** or **security vulnerabilities**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://help.aliyun.com/document_detail/114882.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ACK/cluster-check.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun cs GET /clusters/[cluster_id]/checks to verify cluster checks are being run regularly. Trigger a check if needed.",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **ACK Console**\n2. Select the target cluster and open the **More** pop-menu for advanced options\n3. Select **Global Check** and click the **Start** button to trigger the checking\n4. Verify the checking time and details in Global Check\n5. It is recommended to trigger cluster checks at least once per week",
      "Url": "https://hub.prowler.com/check/cs_kubernetes_cluster_check_weekly"
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

````
