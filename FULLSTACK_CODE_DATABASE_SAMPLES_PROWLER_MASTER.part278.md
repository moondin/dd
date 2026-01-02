---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 278
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 278 of 867)

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

---[FILE: efs_have_backup_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_have_backup_enabled/efs_have_backup_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "efs_have_backup_enabled",
  "CheckTitle": "EFS file system has backup enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Destruction"
  ],
  "ServiceName": "efs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEfsFileSystem",
  "Description": "**Amazon EFS file systems** are assessed for automated backups configured via the `backup policy`. The finding highlights file systems where backups are not enabled or are being disabled.",
  "Risk": "Absence of EFS backups degrades **availability** and **integrity**. Accidental deletion, ransomware, or misconfiguration can wipe or corrupt data with no recovery path. Without point-in-time copies, RPO/RTO suffer and localized incidents can become prolonged outages and irreversible loss.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/efs/latest/ug/awsbackup.html",
    "https://docs.aws.amazon.com/efs/latest/ug/automatic-backups.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws efs put-backup-policy --file-system-id <FILE_SYSTEM_ID> --backup-policy Status=ENABLED",
      "NativeIaC": "```yaml\n# CloudFormation: Enable automatic backups for EFS\nResources:\n  <example_resource_name>:\n    Type: AWS::EFS::FileSystem\n    Properties:\n      BackupPolicy:\n        Status: ENABLED  # Critical: turns on EFS automatic backups via AWS Backup\n```",
      "Other": "1. In the AWS Console, go to Amazon EFS > File systems\n2. Select the target file system\n3. Click Edit (or Update)\n4. Set Automatic backups to Enabled\n5. Save changes",
      "Terraform": "```hcl\n# Enable automatic backups for EFS\nresource \"aws_efs_file_system\" \"<example_resource_name>\" {\n  backup_policy {\n    status = \"ENABLED\"  # Critical: turns on EFS automatic backups\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable automated EFS backups by setting the file system `backup policy` to `ENABLED` and applying defense-in-depth:\n- Schedule frequent jobs with tiered retention\n- Use immutable vaults and cross-Region copies\n- Restrict delete/restore via **least privilege** and **separation of duties**\n- Regularly test restores and document DR objectives",
      "Url": "https://hub.prowler.com/check/efs_have_backup_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: efs_have_backup_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_have_backup_enabled/efs_have_backup_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.efs.efs_client import efs_client


class efs_have_backup_enabled(Check):
    def execute(self):
        findings = []
        for fs in efs_client.filesystems.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=fs)
            report.status = "PASS"
            report.status_extended = f"EFS {fs.id} has backup enabled."
            if fs.backup_policy == "DISABLED" or fs.backup_policy == "DISABLING":
                report.status = "FAIL"
                report.status_extended = f"EFS {fs.id} does not have backup enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: efs_mount_target_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_mount_target_not_publicly_accessible/efs_mount_target_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "efs_mount_target_not_publicly_accessible",
  "CheckTitle": "EFS file system has no publicly accessible mount targets",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "TTPs/Initial Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "efs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEfsFileSystem",
  "Description": "**EFS mount targets** associated with VPC subnets that auto-assign public IPv4 addresses (`mapPublicIpOnLaunch=true`) are identified per file system.\n\nThe evaluation focuses on the subnet attribute linked to each mount target.",
  "Risk": "Publicly addressable mount targets expose NFS to Internet scanning and exploit attempts.\n- **Confidentiality**: unauthorized reads\n- **Integrity**: illicit writes or deletion\n- **Availability**: DDoS/resource exhaustion\n\n*Even with tight rules*, a public IP weakens isolation and eases recon.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/efs-controls.html#efs-6",
    "https://docs.aws.amazon.com/efs/latest/ug/accessing-fs.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# Create an EFS mount target in a private subnet\nResources:\n  <example_resource_name>:\n    Type: AWS::EFS::MountTarget\n    Properties:\n      FileSystemId: <example_resource_id>\n      SubnetId: <example_resource_id>  # FIX: Use a private subnet (no route to an Internet Gateway)\n      SecurityGroups:\n        - <example_resource_id>  # Required SG for the mount target\n```",
      "Other": "1. Open the AWS Console > EFS > File systems > select your file system\n2. Go to Networking and click Create mount target\n3. Choose a subnet that is private (no route to an Internet Gateway) and select a security group\n4. Click Create\n5. In Networking, select any mount targets in public subnets and click Delete to remove them",
      "Terraform": "```hcl\n# Create an EFS mount target in a private subnet\nresource \"aws_efs_mount_target\" \"<example_resource_name>\" {\n  file_system_id  = \"<example_resource_id>\"\n  subnet_id       = \"<example_resource_id>\"  # FIX: Use a private subnet (no route to an Internet Gateway)\n  security_groups = [\"<example_resource_id>\"]\n}\n```"
    },
    "Recommendation": {
      "Text": "Place mount targets in **private subnets** that do not auto-assign public IPs (`mapPublicIpOnLaunch=false`). Apply **least privilege**: restrict NFS via security groups to known sources, avoid Internet routes, and use **defense in depth** with NACLs. Prefer private connectivity (VPN/Direct Connect or peering) for access.",
      "Url": "https://hub.prowler.com/check/efs_mount_target_not_publicly_accessible"
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

---[FILE: efs_mount_target_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_mount_target_not_publicly_accessible/efs_mount_target_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.efs.efs_client import efs_client
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class efs_mount_target_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for fs in efs_client.filesystems.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=fs)
            report.status = "PASS"
            report.status_extended = (
                f"EFS {fs.id} does not have any public mount targets."
            )
            mount_targets = []
            for mt in fs.mount_targets:
                if vpc_client.vpc_subnets[mt.subnet_id].public:
                    mount_targets.append(mt)
            if mount_targets:
                report.status = "FAIL"
                report.status_extended = f"EFS {fs.id} has public mount targets: {', '.join([mt.id for mt in mount_targets])}"

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: efs_multi_az_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_multi_az_enabled/efs_multi_az_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "efs_multi_az_enabled",
  "CheckTitle": "EFS file system is Multi-AZ with more than one mount target",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "efs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEfsFileSystem",
  "Description": "**Amazon EFS** file systems are assessed for **multi-AZ resilience**: Regional type (no `availability_zone_id`) with mount targets in more than one Availability Zone. Single-AZ (One Zone) or Regional with only one mount target is identified for attention.",
  "Risk": "Concentrating access through a single AZ or a lone mount target reduces **availability**. An AZ outage can sever client connectivity, causing downtime and I/O errors. A single mount target also forces cross-AZ traffic, increasing latency and costs and undermining **resilience** and seamless failover.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/efs/latest/ug/creating-using-create-fs.html#availabiltydurability",
    "https://docs.aws.amazon.com/efs/latest/ug/accessing-fs.html",
    "https://ops.tips/gists/how-aws-efs-multiple-availability-zones-terraform/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws efs create-mount-target --file-system-id <FILE_SYSTEM_ID> --subnet-id <SUBNET_ID>",
      "NativeIaC": "```yaml\n# CloudFormation: add an extra EFS mount target to another AZ\nResources:\n  <example_resource_name>:\n    Type: AWS::EFS::MountTarget\n    Properties:\n      FileSystemId: fs-<example_resource_id>  # FIX: adds another mount target for this EFS\n      SubnetId: subnet-<example_resource_id>  # FIX: choose a subnet in a different AZ\n      SecurityGroups:\n        - <example_security_group_id>         # Required by CFN\n```",
      "Other": "1. In AWS Console, go to EFS > File systems > select your file system\n2. If File system type shows Regional: open the Network tab > Mount targets > Manage mount targets > Add mount target\n3. Select a subnet in a different Availability Zone and save\n4. If File system type shows One Zone: create a new EFS with File system type = Regional and create mount targets in at least two AZs; remount clients to the new file system and decommission the old one",
      "Terraform": "```hcl\n# Add an extra EFS mount target in a different AZ/subnet\nresource \"aws_efs_mount_target\" \"<example_resource_name>\" {\n  file_system_id = \"<example_resource_id>\"  # FIX: target EFS\n  subnet_id      = \"<example_resource_id>\"  # FIX: subnet in another AZ to make targets > 1\n}\n```"
    },
    "Recommendation": {
      "Text": "Use **Regional EFS** and create mount targets in each required **Availability Zone** to remove single points of failure and keep clients local to their AZ. Avoid One Zone for critical data. Periodically review mount target distribution to uphold **high availability** and **fault tolerance**.",
      "Url": "https://hub.prowler.com/check/efs_multi_az_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: efs_multi_az_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_multi_az_enabled/efs_multi_az_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.efs.efs_client import efs_client


class efs_multi_az_enabled(Check):
    def execute(self):
        findings = []
        for fs in efs_client.filesystems.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=fs)
            if fs.availability_zone_id:
                report.status = "FAIL"
                report.status_extended = f"EFS {fs.id} is a Single-AZ file system."
            else:
                if fs.number_of_mount_targets <= 1:
                    report.status = "FAIL"
                    report.status_extended = f"EFS {fs.id} is a Multi-AZ file system but with only one mount target."
                else:
                    report.status = "PASS"
                    report.status_extended = f"EFS {fs.id} is a Multi-AZ file system with more than one mount target."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: efs_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_not_publicly_accessible/efs_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "efs_not_publicly_accessible",
  "CheckTitle": "EFS file system policy does not allow access to any client within the VPC",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Effects/Data Exposure"
  ],
  "ServiceName": "efs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEfsFileSystem",
  "Description": "**Amazon EFS** file system policy is assessed for **public or VPC-wide access**. Policies with broad `Principal` values or that permit any client in the VPC without the `elasticfilesystem:AccessedViaMountTarget` condition are identified.\n\n*An absent or empty policy is treated as open to VPC clients.*",
  "Risk": "Broad EFS access lets any VPC client-or a compromised workload-mount the share, impacting CIA:\n- Confidentiality: bulk data exfiltration\n- Integrity: unauthorized writes or ransomware\n- Availability: deletion or lockout via elevated client access\nAlso facilitates lateral movement within the VPC.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/efs/latest/ug/access-control-block-public-access.html",
    "https://support.icompaas.com/support/solutions/articles/62000233324-efs-should-not-have-policies-allowing-unrestricted-access-within-vpc"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws efs put-file-system-policy --file-system-id <example_resource_id> --policy '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"elasticfilesystem:ClientMount\",\"Condition\":{\"Bool\":{\"elasticfilesystem:AccessedViaMountTarget\":\"true\"}}}]}'",
      "NativeIaC": "```yaml\n# CloudFormation: attach a non-public EFS file system policy\nResources:\n  EFSFileSystemPolicy:\n    Type: AWS::EFS::FileSystemPolicy\n    Properties:\n      FileSystemId: <example_resource_id>\n      Policy:\n        Version: \"2012-10-17\"\n        Statement:\n          - Effect: Allow\n            Principal: \"*\"\n            Action: elasticfilesystem:ClientMount\n            Condition:\n              Bool:\n                elasticfilesystem:AccessedViaMountTarget: \"true\"  # Critical: restrict access to mount targets only to avoid public access\n```",
      "Other": "1. In the AWS Console, go to EFS > File systems and select <example_resource_id>\n2. Open the File system policy tab and click Edit\n3. Replace the policy with one that requires access via mount targets only:\n   ```json\n   {\n     \"Version\": \"2012-10-17\",\n     \"Statement\": [\n       {\n         \"Effect\": \"Allow\",\n         \"Principal\": \"*\",\n         \"Action\": \"elasticfilesystem:ClientMount\",\n         \"Condition\": {\"Bool\": {\"elasticfilesystem:AccessedViaMountTarget\": \"true\"}}\n       }\n     ]\n   }\n   ```\n4. Save changes",
      "Terraform": "```hcl\n# Attach a non-public EFS file system policy\nresource \"aws_efs_file_system_policy\" \"<example_resource_name>\" {\n  file_system_id = \"<example_resource_id>\"\n  policy = jsonencode({\n    Version   = \"2012-10-17\"\n    Statement = [{\n      Effect    = \"Allow\"\n      Principal = \"*\"\n      Action    = \"elasticfilesystem:ClientMount\"\n      Condition = {\n        Bool = {\n          \"elasticfilesystem:AccessedViaMountTarget\" = \"true\" # Critical: require mount target to make policy non-public\n        }\n      }\n    }]\n  })\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** to EFS resource policies:\n- Avoid wildcard `Principal` or `*`\n- Require `elasticfilesystem:AccessedViaMountTarget=true`\n- Constrain with `aws:SourceVpc`, `aws:SourceAccount`, or org IDs\n- Use EFS access points per app/role\n- Enable EFS **Block Public Access** for defense in depth",
      "Url": "https://hub.prowler.com/check/efs_not_publicly_accessible"
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

---[FILE: efs_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_not_publicly_accessible/efs_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.efs.efs_client import efs_client
from prowler.providers.aws.services.iam.lib.policy import is_policy_public


class efs_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for fs in efs_client.filesystems.values():
            if fs.policy is None:
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=fs)
            report.status = "PASS"
            report.status_extended = f"EFS {fs.id} has a policy which does not allow access to any client within the VPC."
            if not fs.policy:
                report.status = "FAIL"
                report.status_extended = f"EFS {fs.id} doesn't have any policy which means it grants full access to any client within the VPC."
            elif is_policy_public(fs.policy, efs_client.audited_account) and any(
                statement.get("Condition", {})
                .get("Bool", {})
                .get("elasticfilesystem:AccessedViaMountTarget", "false")
                != "true"
                for statement in fs.policy.get("Statement", [])
            ):
                report.status = "FAIL"
                report.status_extended = f"EFS {fs.id} has a policy which allows access to any client within the VPC."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: eks_client.py]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_client.py

```python
from prowler.providers.aws.services.eks.eks_service import EKS
from prowler.providers.common.provider import Provider

eks_client = EKS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: eks_service.py]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class EKS(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.clusters = []
        self.__threading_call__(self._list_clusters)
        self._describe_cluster(self.regional_clients)

    def _list_clusters(self, regional_client):
        logger.info("EKS listing clusters...")
        try:
            list_clusters_paginator = regional_client.get_paginator("list_clusters")
            for page in list_clusters_paginator.paginate():
                for cluster in page["clusters"]:
                    arn = f"arn:{self.audited_partition}:eks:{regional_client.region}:{self.audited_account}:cluster/{cluster}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.clusters.append(
                            EKSCluster(
                                arn=arn,
                                name=cluster,
                                region=regional_client.region,
                            )
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_cluster(self, regional_clients):
        logger.info("EKS listing clusters...")
        try:
            for cluster in self.clusters:
                regional_client = regional_clients[cluster.region]
                describe_cluster = regional_client.describe_cluster(name=cluster.name)
                if "logging" in describe_cluster["cluster"]:
                    cluster.logging = EKSClusterLoggingEntity(
                        types=describe_cluster["cluster"]["logging"]["clusterLogging"][
                            0
                        ]["types"],
                        enabled=describe_cluster["cluster"]["logging"][
                            "clusterLogging"
                        ][0]["enabled"],
                    )
                if (
                    "clusterSecurityGroupId"
                    in describe_cluster["cluster"]["resourcesVpcConfig"]
                ):
                    cluster.security_group_id = describe_cluster["cluster"][
                        "resourcesVpcConfig"
                    ]["clusterSecurityGroupId"]
                if (
                    "endpointPublicAccess"
                    in describe_cluster["cluster"]["resourcesVpcConfig"]
                ):
                    cluster.endpoint_public_access = describe_cluster["cluster"][
                        "resourcesVpcConfig"
                    ]["endpointPublicAccess"]
                if (
                    "endpointPrivateAccess"
                    in describe_cluster["cluster"]["resourcesVpcConfig"]
                ):
                    cluster.endpoint_private_access = describe_cluster["cluster"][
                        "resourcesVpcConfig"
                    ]["endpointPrivateAccess"]
                if (
                    "publicAccessCidrs"
                    in describe_cluster["cluster"]["resourcesVpcConfig"]
                ):
                    cluster.public_access_cidrs = describe_cluster["cluster"][
                        "resourcesVpcConfig"
                    ]["publicAccessCidrs"]
                if "encryptionConfig" in describe_cluster["cluster"]:
                    cluster.encryptionConfig = True
                if "deletionProtection" in describe_cluster["cluster"]:
                    cluster.deletion_protection = describe_cluster["cluster"][
                        "deletionProtection"
                    ]
                cluster.tags = [describe_cluster["cluster"].get("tags")]
                cluster.version = describe_cluster["cluster"].get("version", "")

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class EKSClusterLoggingEntity(BaseModel):
    types: list[str] = None
    enabled: bool = None


class EKSCluster(BaseModel):
    name: str
    arn: str
    region: str
    version: str = None
    logging: EKSClusterLoggingEntity = None
    security_group_id: str = None
    endpoint_public_access: bool = None
    endpoint_private_access: bool = None
    public_access_cidrs: list[str] = []
    encryptionConfig: bool = None
    deletion_protection: bool = None
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_deletion_protection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_deletion_protection_enabled/eks_cluster_deletion_protection_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "eks_cluster_deletion_protection_enabled",
  "CheckTitle": "EKS cluster has deletion protection enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Data Destruction"
  ],
  "ServiceName": "eks",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEksCluster",
  "Description": "**Amazon EKS clusters** have **deletion protection** enabled blocking cluster removal until protection is explicitly disabled.",
  "Risk": "Without **deletion protection**, automation errors or a compromised admin can remove the cluster control plane, causing immediate **availability** loss and downtime. Destructive actions can also affect the **integrity** of deployments, leave orphaned resources, hinder recovery, and raise **operational cost**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/eks/latest/APIReference/API_UpdateClusterConfig.html",
    "https://docs.aws.amazon.com/eks/latest/userguide/deletion-protection.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws eks update-cluster-config --name <cluster_name> --region <region_name> --deletion-protection",
      "NativeIaC": "```yaml\n# CloudFormation: enable deletion protection on the EKS cluster\nResources:\n  <example_resource_name>:\n    Type: AWS::EKS::Cluster\n    Properties:\n      RoleArn: <example_role_arn>\n      ResourcesVpcConfig:\n        SubnetIds: [<example_subnet_id_1>, <example_subnet_id_2>]\n      DeletionProtection: true  # critical: prevents cluster deletion until disabled\n```",
      "Other": "1. Open the AWS Management Console and go to Amazon EKS\n2. Select your cluster\n3. Go to the Configuration tab and click Edit\n4. Enable Deletion protection\n5. Click Save changes",
      "Terraform": "```hcl\n# Enable deletion protection for the EKS cluster\nresource \"aws_eks_cluster\" \"<example_resource_name>\" {\n  name     = \"<example_resource_name>\"\n  role_arn = \"<example_role_arn>\"\n\n  vpc_config {\n    subnet_ids = [\"<subnet_id_1>\", \"<subnet_id_2>\"]\n  }\n\n  deletion_protection = true  # critical: prevents cluster deletion until disabled\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **deletion protection** on critical clusters (`deletionProtection=true`). Enforce **least privilege** so only narrowly scoped roles can disable or delete clusters. Require **change control** with approvals and **separation of duties**, and apply guardrails to prevent broad delete permissions.",
      "Url": "https://hub.prowler.com/check/eks_cluster_deletion_protection_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_deletion_protection_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_deletion_protection_enabled/eks_cluster_deletion_protection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.eks.eks_client import eks_client


class eks_cluster_deletion_protection_enabled(Check):
    def execute(self):
        findings = []
        for cluster in eks_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = (
                f"EKS cluster {cluster.name} has deletion protection enabled."
            )
            if cluster.deletion_protection is False:
                report.status = "FAIL"
                report.status_extended = (
                    f"EKS cluster {cluster.name} has deletion protection disabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_kms_cmk_encryption_in_secrets_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_kms_cmk_encryption_in_secrets_enabled/eks_cluster_kms_cmk_encryption_in_secrets_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "eks_cluster_kms_cmk_encryption_in_secrets_enabled",
  "CheckTitle": "EKS cluster has Kubernetes secrets encryption enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "eks",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEksCluster",
  "Description": "**Amazon EKS** clusters configure **AWS KMS envelope encryption** so Kubernetes **Secrets** are stored in etcd as ciphertext at rest.",
  "Risk": "Without KMS-backed encryption, etcd data and snapshots can reveal plaintext secrets. Attackers with API, node, or storage access can steal tokens, passwords, and keys, enabling impersonation, pod takeover, and lateral movement-compromising confidentiality and leading to privilege escalation.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/prescriptive-guidance/latest/encryption-best-practices/eks.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/EKS/enable-envelope-encryption.html",
    "https://devoriales.com/post/329/aws-eks-secret-encryption-securing-your-eks-secrets-at-rest-with-aws-kms",
    "https://docs.aws.amazon.com/eks/latest/userguide/enable-kms.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws eks associate-encryption-config --cluster-name <example_resource_name> --encryption-config '[{\"resources\":[\"secrets\"],\"provider\":{\"keyArn\":\"arn:aws:kms:<REGION>:<ACCOUNT_ID>:key/<example_resource_id>\"}}]'",
      "NativeIaC": "```yaml\n# CloudFormation: enable KMS envelope encryption for Kubernetes secrets\nResources:\n  EKSCluster:\n    Type: AWS::EKS::Cluster\n    Properties:\n      Name: \"<example_resource_name>\"\n      RoleArn: \"arn:aws:iam::<ACCOUNT_ID>:role/<example_resource_name>\"\n      ResourcesVpcConfig:\n        SubnetIds:\n          - \"<example_resource_id>\"\n          - \"<example_resource_id>\"\n      EncryptionConfig:                # Critical: enables KMS encryption for Kubernetes secrets\n        - Resources:\n            - secrets                  # Critical: encrypts only Kubernetes secrets\n          Provider:\n            KeyArn: \"arn:aws:kms:<REGION>:<ACCOUNT_ID>:key/<example_resource_id>\"  # Critical: KMS key used for encryption\n```",
      "Other": "1. Open the AWS Management Console and go to Amazon EKS\n2. Select your cluster\n3. On the Overview tab, find Secrets encryption and click Enable\n4. Select the KMS key and click Enable\n5. Click Confirm to apply",
      "Terraform": "```hcl\n# Enable KMS envelope encryption for Kubernetes secrets\nresource \"aws_eks_cluster\" \"main\" {\n  name     = \"<example_resource_name>\"\n  role_arn = \"arn:aws:iam::<ACCOUNT_ID>:role/<example_resource_name>\"\n\n  vpc_config {\n    subnet_ids = [\"<example_resource_id>\", \"<example_resource_id>\"]\n  }\n\n  encryption_config {                 # Critical: enables KMS encryption for secrets\n    resources = [\"secrets\"]          # Critical: scope to Kubernetes secrets\n    provider {\n      key_arn = \"arn:aws:kms:<REGION>:<ACCOUNT_ID>:key/<example_resource_id>\"  # Critical: KMS key\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable cluster-level secrets encryption with **AWS KMS** and prefer a **customer managed KMS key** for control and rotation. Apply **least privilege** to key policies and cluster roles, monitor key usage, and combine with strict **RBAC** to limit who can read or create secrets as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/eks_cluster_kms_cmk_encryption_in_secrets_enabled"
    }
  },
  "Categories": [
    "encryption",
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_kms_cmk_encryption_in_secrets_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_kms_cmk_encryption_in_secrets_enabled/eks_cluster_kms_cmk_encryption_in_secrets_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.eks.eks_client import eks_client


class eks_cluster_kms_cmk_encryption_in_secrets_enabled(Check):
    def execute(self):
        findings = []
        for cluster in eks_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"EKS cluster {cluster.name} does not have encryption for Kubernetes secrets."
            if cluster.encryptionConfig:
                report.status = "PASS"
                report.status_extended = (
                    f"EKS cluster {cluster.name} has encryption for Kubernetes secrets."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_network_policy_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_network_policy_enabled/eks_cluster_network_policy_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "eks_cluster_network_policy_enabled",
  "CheckTitle": "EKS cluster has network policy enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "TTPs/Lateral Movement"
  ],
  "ServiceName": "eks",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEksCluster",
  "Description": "**Amazon EKS clusters** are evaluated for **pod-level network isolation** via Kubernetes `NetworkPolicy`, indicating whether traffic between pods and namespaces is restricted according to defined rules.",
  "Risk": "Without **NetworkPolicy**, pods can communicate freely, enabling **lateral movement**, **data exfiltration**, and abuse of internal services. Unrestricted east-west traffic undermines confidentiality and integrity and enlarges the blast radius of a single compromised pod.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/EKS/security-groups.html",
    "https://docs.aws.amazon.com/eks/latest/userguide/eks-networking-add-ons.html",
    "https://docs.aws.amazon.com/eks/latest/userguide/cni-network-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws eks update-cluster-config --name <example_cluster_name> --resources-vpc-config securityGroupIds=<example_security_group_id>",
      "NativeIaC": "```yaml\n# CloudFormation: attach a security group to the EKS cluster\nResources:\n  <example_resource_name>:\n    Type: AWS::EKS::Cluster\n    Properties:\n      RoleArn: <example_role_arn>\n      ResourcesVpcConfig:\n        SubnetIds:\n          - <example_subnet_id>\n        SecurityGroupIds:\n          - <example_security_group_id>  # Critical: sets a security group for the cluster, satisfying the check\n```",
      "Other": "1. Open the AWS Console and go to EKS > Clusters\n2. Select <your cluster> and open the Networking tab\n3. Click Edit (or Update) in the Networking section\n4. Under Security groups, add/select <example_security_group_id>\n5. Click Save to apply",
      "Terraform": "```hcl\n# Minimal EKS cluster config with a security group attached\nresource \"aws_eks_cluster\" \"<example_resource_name>\" {\n  name     = \"<example_resource_name>\"\n  role_arn = \"<example_role_arn>\"\n\n  vpc_config {\n    subnet_ids         = [\"<example_subnet_id>\"]\n    security_group_ids = [\"<example_security_group_id>\"]  # Critical: attaches a security group to pass the check\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **least privilege** `NetworkPolicy` with a `default-deny` for ingress and egress, then explicitly allow required flows by labels and namespaces. Apply **defense in depth** with security groups for pods and private access, and continuously test and monitor policy effectiveness.",
      "Url": "https://hub.prowler.com/check/eks_cluster_network_policy_enabled"
    }
  },
  "Categories": [
    "trust-boundaries",
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enabling Network Policy may cause a rolling update of all cluster nodes and consumes additional resources."
}
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_network_policy_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/eks/eks_cluster_network_policy_enabled/eks_cluster_network_policy_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.eks.eks_client import eks_client


class eks_cluster_network_policy_enabled(Check):
    def execute(self):
        findings = []
        for cluster in eks_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"EKS cluster {cluster.name} does not have a Network Policy. Cluster security group ID is not set."
            if cluster.security_group_id:
                report.status = "PASS"
                report.status_extended = f"EKS cluster {cluster.name} has a Network Policy with the security group {cluster.security_group_id}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
