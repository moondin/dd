---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 279
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 279 of 867)

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

---[FILE: eks_cluster_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_not_publicly_accessible/eks_cluster_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "eks_cluster_not_publicly_accessible",
  "CheckTitle": "EKS cluster endpoint is not publicly accessible from 0.0.0.0/0",
  "CheckAliases": [
    "eks_endpoints_not_publicly_accessible",
    "eks_control_plane_endpoint_access_restricted"
  ],
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access/Unauthorized Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "eks",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEksCluster",
  "Description": "**Amazon EKS** cluster API server endpoint is evaluated for **unrestricted Internet access**, specifically when the public endpoint permits connections from `0.0.0.0/0` instead of private access or limited CIDR ranges.",
  "Risk": "An openly reachable API endpoint enables Internet-wide probing, brute force, and enumeration, increasing exposure to RBAC misconfigurations or API flaws. Successful access can drive secret exfiltration (confidentiality), workload tampering (integrity), and control-plane disruption or scaling abuse (availability, cost).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/eks/latest/eksctl/vpc-cluster-access.html",
    "https://docs.aws.amazon.com/eks/latest/userguide/config-cluster-endpoint.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/EKS/endpoint-access.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws eks update-cluster-config --region <region_name> --name <cluster_name> --resources-vpc-config endpointPublicAccess=false,endpointPrivateAccess=true",
      "NativeIaC": "```yaml\n# CloudFormation: Disable public endpoint and enable private endpoint\nResources:\n  <example_resource_name>:\n    Type: AWS::EKS::Cluster\n    Properties:\n      RoleArn: <example_role_arn>\n      ResourcesVpcConfig:\n        SubnetIds:\n          - <example_subnet_id_1>\n          - <example_subnet_id_2>\n        EndpointPublicAccess: false  # critical: disables public API endpoint\n        EndpointPrivateAccess: true  # critical: enables private API endpoint\n```",
      "Other": "1. Open the Amazon EKS console\n2. Select your cluster\n3. Go to the Networking tab and click Manage endpoint access\n4. Enable Private access and Disable Public access\n5. Click Update/Save",
      "Terraform": "```hcl\n# Terraform: Disable public endpoint and enable private endpoint\nresource \"aws_eks_cluster\" \"<example_resource_name>\" {\n  name     = \"<example_resource_name>\"\n  role_arn = \"<example_role_arn>\"\n\n  vpc_config {\n    subnet_ids              = [\"<example_subnet_id_1>\", \"<example_subnet_id_2>\"]\n    endpoint_public_access  = false  # critical: disables public API endpoint\n    endpoint_private_access = true   # critical: enables private API endpoint\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Prefer **private endpoint access** and avoid broad exposure. *If public access is required*, restrict to trusted admin CIDRs (not `0.0.0.0/0`), reach the API via **VPN/Direct Connect or bastions**, and enforce **least privilege** with IAM/RBAC. Apply **defense in depth** through network segmentation and continuous monitoring.",
      "Url": "https://hub.prowler.com/check/eks_cluster_not_publicly_accessible"
    }
  },
  "Categories": [
    "internet-exposed",
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_not_publicly_accessible/eks_cluster_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.eks.eks_client import eks_client


class eks_cluster_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for cluster in eks_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = (
                f"EKS cluster {cluster.name} is not publicly accessible."
            )
            if (
                cluster.endpoint_public_access
                and "0.0.0.0/0" in cluster.public_access_cidrs
            ):
                report.status = "FAIL"
                report.status_extended = (
                    f"EKS cluster {cluster.name} is publicly accessible."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_private_nodes_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_private_nodes_enabled/eks_cluster_private_nodes_enabled.metadata.json
Signals: Next.js

```json
{
  "Provider": "aws",
  "CheckID": "eks_cluster_private_nodes_enabled",
  "CheckTitle": "EKS cluster has private endpoint access enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access/Unauthorized Access"
  ],
  "ServiceName": "eks",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEksCluster",
  "Description": "**Amazon EKS cluster** has **private endpoint access** enabled for the **Kubernetes API server**, allowing control plane traffic to use a VPC-resolved private endpoint.\n\nThe check evaluates the cluster's `endpointPrivateAccess` setting.",
  "Risk": "Without **private endpoint access**, the API server is exposed on the public internet. This expands attack surface and weakens **confidentiality** and **integrity**: stolen creds or mis-scoped CIDRs can enable unauthorized API calls, secret reads, pod deployments, and config changes. **Availability** also depends on internet egress, increasing failure modes.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/eks/latest/userguide/private-clusters.html",
    "https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws eks update-cluster-config --region <REGION> --name <CLUSTER_NAME> --resources-vpc-config endpointPrivateAccess=true",
      "NativeIaC": "```yaml\n# CloudFormation: Enable private endpoint access for an EKS cluster\nResources:\n  <example_resource_name>:\n    Type: AWS::EKS::Cluster\n    Properties:\n      RoleArn: <example_resource_id>\n      ResourcesVpcConfig:\n        SubnetIds:\n          - <example_resource_id>\n        EndpointPrivateAccess: true  # Critical: enables private endpoint access to pass the check\n```",
      "Other": "1. In the AWS Console, open Amazon EKS and select your cluster\n2. Go to the Networking tab\n3. Click Edit next to Cluster endpoint access\n4. Enable Private access\n5. Click Save",
      "Terraform": "```hcl\n# Terraform: Enable private endpoint access for an EKS cluster\nresource \"aws_eks_cluster\" \"<example_resource_name>\" {\n  name     = \"<example_resource_name>\"\n  role_arn = \"<example_resource_id>\"\n\n  vpc_config {\n    subnet_ids              = [\"<example_resource_id>\"]\n    endpoint_private_access = true  # Critical: enables private API endpoint access to pass the check\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **private endpoint access** and disable or tightly restrict the public endpoint.\n\nRequire administration from private networks, enforce **least privilege** with IAM/RBAC, and apply **defense in depth** via segmentation and logging. *If external access is needed*, allow only specific CIDRs and monitor API activity.",
      "Url": "https://hub.prowler.com/check/eks_cluster_private_nodes_enabled"
    }
  },
  "Categories": [
    "internet-exposed",
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enabling private nodes restricts outbound access to the public internet. If outbound internet access is required, Cloud NAT or a NAT gateway can be used."
}
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_private_nodes_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_private_nodes_enabled/eks_cluster_private_nodes_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.eks.eks_client import eks_client


class eks_cluster_private_nodes_enabled(Check):
    def execute(self):
        findings = []
        for cluster in eks_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = (
                f"EKS cluster {cluster.name} is created with private nodes."
            )
            if not cluster.endpoint_private_access:
                report.status = "FAIL"
                report.status_extended = f"Cluster endpoint private access is not enabled for EKS cluster {cluster.name}."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_uses_a_supported_version.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_uses_a_supported_version/eks_cluster_uses_a_supported_version.metadata.json
Signals: Next.js

```json
{
  "Provider": "aws",
  "CheckID": "eks_cluster_uses_a_supported_version",
  "CheckTitle": "EKS cluster uses a supported Kubernetes version",
  "CheckType": [
    "Software and Configuration Checks/Patch Management",
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "eks",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEksCluster",
  "Description": "Amazon EKS clusters use a **supported Kubernetes version** at or above the defined baseline (e.g., `1.28+`). The evaluation compares each cluster's Kubernetes minor version to the minimum supported level and highlights clusters running below that baseline.",
  "Risk": "Running an **unsupported Kubernetes version** removes upstream and EKS security fixes, exposing clusters to known CVEs and privilege escalation bugs (**confidentiality/integrity**). Deprecated or removed APIs can break controllers and add-ons, causing outages (**availability**).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/EKS/kubernetes-version.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/eks-controls.html#eks-2",
    "https://docs.aws.amazon.com/eks/latest/userguide/platform-versions.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws eks update-cluster-version --name <cluster_name> --kubernetes-version <supported_version>",
      "NativeIaC": "```yaml\n# CloudFormation: update EKS cluster to a supported Kubernetes version\nResources:\n  <example_resource_name>:\n    Type: AWS::EKS::Cluster\n    Properties:\n      Name: <example_resource_name>\n      RoleArn: <example_role_arn>\n      ResourcesVpcConfig:\n        SubnetIds: [\"<example_subnet_id>\"]\n      Version: \"<supported_version>\"  # Critical: set a supported Kubernetes version to pass the check\n```",
      "Other": "1. Open the AWS Management Console and go to Amazon EKS\n2. Select your cluster (<cluster_name>)\n3. Click Update (or Edit) next to Kubernetes version\n4. Choose a supported version (>= required) and confirm the update\n5. Wait for the control plane update to complete",
      "Terraform": "```hcl\n# Terraform: update EKS cluster to a supported Kubernetes version\nresource \"aws_eks_cluster\" \"<example_resource_name>\" {\n  name     = \"<example_resource_name>\"\n  role_arn = \"<example_role_arn>\"\n\n  version = \"<supported_version>\" # Critical: set a supported Kubernetes version to pass the check\n\n  vpc_config {\n    subnet_ids = [\"<example_subnet_id>\"]\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Adopt a **version management policy**: keep clusters on a supported minor version, schedule regular upgrades, and test workloads for API deprecations. Upgrade nodes and add-ons with the control plane. Track EKS releases, automate drift alerts, and favor **defense in depth** over deprecated features.",
      "Url": "https://hub.prowler.com/check/eks_cluster_uses_a_supported_version"
    }
  },
  "Categories": [
    "vulnerabilities"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_uses_a_supported_version.py]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_uses_a_supported_version/eks_cluster_uses_a_supported_version.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.eks.eks_client import eks_client


class eks_cluster_uses_a_supported_version(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        eks_cluster_oldest_version_supported = eks_client.audit_config.get(
            "eks_cluster_oldest_version_supported", "1.28"
        )
        eks_version_major, eks_version_minor = map(
            int, eks_cluster_oldest_version_supported.split(".")
        )

        for cluster in eks_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)

            # Handle case where cluster.version might be None (edge case during cluster creation/deletion)
            if not cluster.version:
                continue

            cluster_version_major, cluster_version_minor = map(
                int, cluster.version.split(".")
            )

            if (cluster_version_major < eks_version_major) or (
                cluster_version_major == eks_version_major
                and cluster_version_minor < eks_version_minor
            ):
                report.status = "FAIL"
                report.status_extended = f"EKS cluster {cluster.name} is using version {cluster.version}. It should be one of the supported versions: {eks_cluster_oldest_version_supported} or higher."
            else:
                report.status = "PASS"
                report.status_extended = f"EKS cluster {cluster.name} is using version {cluster.version} that is supported by AWS."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: eks_control_plane_logging_all_types_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_control_plane_logging_all_types_enabled/eks_control_plane_logging_all_types_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "eks_control_plane_logging_all_types_enabled",
  "CheckTitle": "EKS cluster has control plane logging enabled for api, audit, authenticator, controllerManager, and scheduler",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "eks",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEksCluster",
  "Description": "**Amazon EKS clusters** are evaluated for **control plane logging** coverage of required types: `api`, `audit`, `authenticator`, `controllerManager`, `scheduler`.\n\nThe finding identifies clusters where any of these log types are not configured.",
  "Risk": "Gaps in **control plane logging** reduce visibility across the cluster.\n- Confidentiality: undetected API access, RBAC abuse, token misuse\n- Integrity: untraceable config changes and policy edits\n- Availability: scheduler/controller issues lack evidence, delaying recovery and masking attacker persistence",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/eks/latest/userguide/logging-monitoring.html",
    "https://support.icompaas.com/support/solutions/articles/62000233623-ensure-eks-control-plane-logging-is-enabled-for-all-required-log-types",
    "https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html",
    "https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/kubernetes-eks-logging.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws eks update-cluster-config --name <cluster_name> --logging '{\"clusterLogging\":[{\"types\":[\"api\",\"audit\",\"authenticator\",\"controllerManager\",\"scheduler\"],\"enabled\":true}]}'",
      "NativeIaC": "```yaml\n# CloudFormation: enable all EKS control plane log types\nResources:\n  <example_resource_name>:\n    Type: AWS::EKS::Cluster\n    Properties:\n      RoleArn: <example_role_arn>\n      ResourcesVpcConfig:\n        SubnetIds: [<example_subnet_id>]\n      Logging:\n        ClusterLogging:\n          - EnabledTypes:\n              - Type: api            # Critical: enable required control plane log types\n              - Type: audit          # Critical: enable required control plane log types\n              - Type: authenticator  # Critical: enable required control plane log types\n              - Type: controllerManager  # Critical: enable required control plane log types\n              - Type: scheduler      # Critical: enable required control plane log types\n```",
      "Other": "1. In the AWS console, go to Amazon EKS and open your cluster\n2. Open the Observability (or Logging) tab and click Manage logging\n3. Turn on: api, audit, authenticator, controllerManager, scheduler\n4. Click Save changes",
      "Terraform": "```hcl\n# Enable all required EKS control plane log types\nresource \"aws_eks_cluster\" \"<example_resource_name>\" {\n  enabled_cluster_log_types = [\n    \"api\",            # Critical: required control plane log types\n    \"audit\",          # Critical: required control plane log types\n    \"authenticator\",  # Critical: required control plane log types\n    \"controllerManager\", # Critical: required control plane log types\n    \"scheduler\"       # Critical: required control plane log types\n  ]\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable and standardize **EKS control plane logging** for all required types `[\"api\",\"audit\",\"authenticator\",\"controllerManager\",\"scheduler\"]`.\n\nApply least privilege to log access, set retention and alerts, and centralize analysis to support defense in depth, rapid detection, and reliable forensics.",
      "Url": "https://hub.prowler.com/check/eks_control_plane_logging_all_types_enabled"
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

---[FILE: eks_control_plane_logging_all_types_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_control_plane_logging_all_types_enabled/eks_control_plane_logging_all_types_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.eks.eks_client import eks_client

default_eks_required_log_types = [
    "api",
    "audit",
    "authenticator",
    "controllerManager",
    "scheduler",
]


class eks_control_plane_logging_all_types_enabled(Check):
    def execute(self):
        findings = []
        required_log_types = eks_client.audit_config.get(
            "eks_required_log_types", default_eks_required_log_types
        )
        required_log_types_str = ", ".join(required_log_types)

        for cluster in eks_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"Control plane logging is not enabled for EKS cluster {cluster.name}. Required log types: {required_log_types_str}."
            if cluster.logging and cluster.logging.enabled:
                if all(item in cluster.logging.types for item in required_log_types):
                    report.status = "PASS"
                    report.status_extended = f"Control plane logging and all required log types are enabled for EKS cluster {cluster.name}."
                else:
                    report.status_extended = f"Control plane logging is enabled but not all required log types are enabled for EKS cluster {cluster.name}. Required log types: {required_log_types_str}. Enabled log types: {', '.join(cluster.logging.types)}."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elasticache_client.py]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_client.py

```python
from prowler.providers.aws.services.elasticache.elasticache_service import ElastiCache
from prowler.providers.common.provider import Provider

elasticache_client = ElastiCache(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: elasticache_service.py]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class ElastiCache(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.clusters = {}
        self.replication_groups = {}
        self.__threading_call__(self._describe_cache_clusters)
        self.__threading_call__(self._describe_cache_subnet_groups)
        self.__threading_call__(self._describe_replication_groups)
        self._list_tags_for_resource()

    def _describe_cache_clusters(self, regional_client):
        # Memcached Clusters and Redis Nodes
        logger.info("Elasticache - Describing Cache Clusters...")
        try:
            for cache_cluster in regional_client.describe_cache_clusters()[
                "CacheClusters"
            ]:
                try:
                    cluster_arn = cache_cluster["ARN"]
                    if not self.audit_resources or (
                        is_resource_filtered(cluster_arn, self.audit_resources)
                    ):
                        self.clusters[cluster_arn] = Cluster(
                            id=cache_cluster["CacheClusterId"],
                            arn=cluster_arn,
                            region=regional_client.region,
                            engine=cache_cluster["Engine"],
                            cache_subnet_group_id=cache_cluster.get(
                                "CacheSubnetGroupName", None
                            ),
                            auto_minor_version_upgrade=cache_cluster.get(
                                "AutoMinorVersionUpgrade", False
                            ),
                            engine_version=cache_cluster.get("EngineVersion", "0.0"),
                            auth_token_enabled=cache_cluster.get(
                                "AuthTokenEnabled", False
                            ),
                        )
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_cache_subnet_groups(self, regional_client):
        logger.info("Elasticache - Describing Cache Subnet Groups...")
        try:
            for cluster in self.clusters.values():
                if cluster.region == regional_client.region:
                    try:
                        subnets = []
                        if cluster.cache_subnet_group_id:
                            cache_subnet_groups = (
                                regional_client.describe_cache_subnet_groups(
                                    CacheSubnetGroupName=cluster.cache_subnet_group_id
                                )["CacheSubnetGroups"]
                            )
                            for subnet_group in cache_subnet_groups:
                                for subnet in subnet_group["Subnets"]:
                                    subnets.append(subnet["SubnetIdentifier"])

                            cluster.subnets = subnets
                    except Exception as error:
                        logger.error(
                            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_replication_groups(self, regional_client):
        # Redis Clusters
        logger.info("Elasticache - Describing Replication Groups...")
        try:
            for repl_group in regional_client.describe_replication_groups()[
                "ReplicationGroups"
            ]:
                try:
                    replication_arn = repl_group["ARN"]
                    if not self.audit_resources or (
                        is_resource_filtered(replication_arn, self.audit_resources)
                    ):
                        # Get first cluster version as they all have the same unless an upgrade is being made
                        member_clusters = repl_group.get("MemberClusters", [])
                        engine_version = "0.0"
                        if member_clusters:
                            cluster_arn = f"arn:{self.audited_partition}:elasticache:{regional_client.region}:{self.audited_account}:cluster:{member_clusters[0]}"
                            engine_version = self.clusters[cluster_arn].engine_version

                        self.replication_groups[replication_arn] = ReplicationGroup(
                            id=repl_group["ReplicationGroupId"],
                            arn=replication_arn,
                            region=regional_client.region,
                            status=repl_group["Status"],
                            snapshot_retention=repl_group.get(
                                "SnapshotRetentionLimit", 0
                            ),
                            encrypted=repl_group.get("AtRestEncryptionEnabled", False),
                            transit_encryption=repl_group.get(
                                "TransitEncryptionEnabled", False
                            ),
                            multi_az=repl_group.get("MultiAZ", "disabled"),
                            auto_minor_version_upgrade=repl_group.get(
                                "AutoMinorVersionUpgrade", False
                            ),
                            automatic_failover=repl_group.get(
                                "AutomaticFailover", "disabled"
                            ),
                            auth_token_enabled=repl_group.get(
                                "AuthTokenEnabled", False
                            ),
                            engine_version=engine_version,
                        )
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("Elasticache - Listing Tags...")
        try:
            for cluster in self.clusters.values():
                try:
                    regional_client = self.regional_clients[cluster.region]
                    cluster.tags = regional_client.list_tags_for_resource(
                        ResourceName=cluster.arn
                    )["TagList"]
                except regional_client.exceptions.CacheClusterNotFoundFault as error:
                    logger.warning(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                except (
                    regional_client.exceptions.InvalidReplicationGroupStateFault
                ) as error:
                    logger.warning(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
            for repl_group in self.replication_groups.values():
                try:
                    regional_client = self.regional_clients[repl_group.region]
                    repl_group.tags = regional_client.list_tags_for_resource(
                        ResourceName=repl_group.arn
                    )["TagList"]
                except (
                    regional_client.exceptions.ReplicationGroupNotFoundFault
                ) as error:
                    logger.warning(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                except (
                    regional_client.exceptions.InvalidReplicationGroupStateFault
                ) as error:
                    logger.warning(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Cluster(BaseModel):
    id: str
    arn: str
    region: str
    engine: str
    cache_subnet_group_id: Optional[str]
    subnets: list = []
    tags: Optional[list]
    auto_minor_version_upgrade: bool = False
    engine_version: Optional[str]
    auth_token_enabled: Optional[bool]


class ReplicationGroup(BaseModel):
    id: str
    arn: str
    region: str
    status: str
    snapshot_retention: int
    encrypted: bool
    transit_encryption: bool
    multi_az: str
    tags: Optional[list]
    auth_token_enabled: bool
    auto_minor_version_upgrade: bool
    automatic_failover: str
    engine_version: str
```

--------------------------------------------------------------------------------

---[FILE: elasticache_cluster_uses_public_subnet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_cluster_uses_public_subnet/elasticache_cluster_uses_public_subnet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elasticache_cluster_uses_public_subnet",
  "CheckTitle": "ElastiCache cluster is not using public subnets",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "elasticache",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**ElastiCache resources** (Redis nodes and Memcached clusters) are assessed for placement in **public subnets**.\n\nThe finding identifies cache subnet groups that include subnets configured with Internet routing instead of private-only subnets.",
  "Risk": "Hosting caches in **public subnets** can permit direct or misconfigured Internet access, impacting CIA:\n- Confidentiality: unauthorized reads and key dumps\n- Integrity: cache poisoning or key tampering\n- Availability: scanning and DDoS\n\nAttackers may pivot from the cache to **lateral movement** within the VPC.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SubnetGroups.html",
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/VPCs.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elasticache modify-cache-cluster --cache-cluster-id <example_resource_id> --cache-subnet-group-name <example_resource_name> --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: move ElastiCache into private subnets via a private subnet group\nResources:\n  PrivateCacheSubnetGroup:\n    Type: AWS::ElastiCache::SubnetGroup\n    Properties:\n      Description: Private subnets only\n      SubnetIds:\n        - <example_resource_id>  # private subnet\n        - <example_resource_id>  # private subnet\n\n  CacheCluster:\n    Type: AWS::ElastiCache::CacheCluster\n    Properties:\n      CacheClusterId: <example_resource_id>\n      Engine: redis\n      CacheNodeType: cache.t3.micro\n      NumCacheNodes: 1\n      CacheSubnetGroupName: !Ref PrivateCacheSubnetGroup  # CRITICAL: forces the cluster to use only private subnets\n```",
      "Other": "1. In the AWS Console, go to ElastiCache > Subnet groups\n2. Click Create cache subnet group and select only private subnets (no route to an Internet Gateway)\n3. Go to ElastiCache > Redis or Memcached, select your cluster\n4. Click Modify, set Subnet group to the private subnet group\n5. Check Apply immediately and click Modify to save",
      "Terraform": "```hcl\n# Terraform: ensure the cluster uses a subnet group with only private subnets\nresource \"aws_elasticache_subnet_group\" \"private\" {\n  name       = \"<example_resource_name>\"\n  subnet_ids = [\"<example_resource_id>\", \"<example_resource_id>\"] # private subnets only\n}\n\nresource \"aws_elasticache_cluster\" \"cache\" {\n  cluster_id      = \"<example_resource_id>\"\n  engine          = \"redis\"\n  node_type       = \"cache.t3.micro\"\n  num_cache_nodes = 1\n  subnet_group_name = aws_elasticache_subnet_group.private.name  # CRITICAL: restricts cluster to private subnets\n}\n```"
    },
    "Recommendation": {
      "Text": "Place caches in **private subnets** only and ensure route tables lack Internet egress. Apply **least privilege** with tight **security groups** limited to required ports and trusted sources.\n\nFor external access, use **VPC peering**, **VPN**, or **PrivateLink**. Enable encryption in transit and Redis `AUTH` for layered controls.",
      "Url": "https://hub.prowler.com/check/elasticache_cluster_uses_public_subnet"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elasticache_cluster_uses_public_subnet.py]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_cluster_uses_public_subnet/elasticache_cluster_uses_public_subnet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elasticache.elasticache_client import (
    elasticache_client,
)
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class elasticache_cluster_uses_public_subnet(Check):
    def execute(self):
        findings = []
        for cluster in elasticache_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)

            report.status = "PASS"
            if cluster.engine == "redis":
                report.status_extended = (
                    f"Elasticache Redis Node {cluster.id} is not using public subnets."
                )
            else:
                report.status_extended = f"Elasticache Memcached Cluster {cluster.id} is not using public subnets."

            public_subnets = []
            for subnet in cluster.subnets:
                if (
                    subnet in vpc_client.vpc_subnets
                    and vpc_client.vpc_subnets[subnet].public
                ):
                    public_subnets.append(vpc_client.vpc_subnets[subnet].id)

            if len(public_subnets) > 0:
                report.status = "FAIL"
                if cluster.engine == "redis":
                    report.status_extended = f"Elasticache Redis Node {cluster.id} is using {', '.join(public_subnets)} public subnets."
                else:
                    report.status_extended = f"Elasticache Memcached Cluster {cluster.id} is using {', '.join(public_subnets)} public subnets."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
