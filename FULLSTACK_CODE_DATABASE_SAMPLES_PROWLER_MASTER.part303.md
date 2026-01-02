---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 303
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 303 of 867)

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

---[FILE: mq_broker_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_broker_not_publicly_accessible/mq_broker_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "mq_broker_not_publicly_accessible",
  "CheckTitle": "Amazon MQ broker is not publicly accessible",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls",
    "TTPs/Initial Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "mq",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsAmazonMQBroker",
  "Description": "**Amazon MQ brokers** are evaluated for **public accessibility**, determining whether a broker exposes a public endpoint or is restricted to VPC-only connectivity via its `publicly accessible` setting.",
  "Risk": "**Publicly reachable brokers** expand exposure: internet hosts can probe protocols and consoles, attempt credential spraying, publish/consume messages, and flood connections. This threatens **confidentiality** (data leakage), **integrity** (message tampering), and **availability** (DoS/resource exhaustion).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/using-amazon-mq-securely.html#prefer-brokers-without-public-accessibility",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/MQ/publicly-accessible.html#"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Amazon MQ broker without public accessibility\nResources:\n  <example_resource_name>:\n    Type: AWS::AmazonMQ::Broker\n    Properties:\n      BrokerName: <example_resource_name>\n      EngineType: ACTIVEMQ\n      EngineVersion: <example_engine_version>\n      HostInstanceType: <example_instance_type>\n      PubliclyAccessible: false  # Critical: disables public internet access\n      Users:\n        - Username: <example_username>\n          Password: <example_password>\n      SubnetIds:\n        - <example_subnet_id>\n      SecurityGroups:\n        - <example_security_group_id>\n      AutoMinorVersionUpgrade: true\n```",
      "Other": "1. Open the AWS Console and go to Amazon MQ\n2. Create a new broker and set Public accessibility to Disabled/No\n3. Point your clients to the new broker's private endpoints\n4. Delete the old publicly accessible broker",
      "Terraform": "```hcl\n# Amazon MQ broker without public accessibility\nresource \"aws_mq_broker\" \"<example_resource_name>\" {\n  broker_name         = \"<example_resource_name>\"\n  engine_type         = \"ActiveMQ\"\n  engine_version      = \"<example_engine_version>\"\n  host_instance_type  = \"<example_instance_type>\"\n  publicly_accessible = false # Critical: disables public internet access\n  security_groups     = [\"<example_security_group_id>\"]\n  subnet_ids          = [\"<example_subnet_id>\"]\n\n  user {\n    username = \"<example_username>\"\n    password = \"<example_password>\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Prefer private deployment: set `publicly_accessible=false`, place brokers in private subnets, and restrict security groups to trusted producers/consumers. Use private connectivity (VPC endpoints, peering, VPN/Direct Connect). Enforce strong authn and authorization maps, and allow only required protocol ports. Apply **least privilege**.",
      "Url": "https://hub.prowler.com/check/mq_broker_not_publicly_accessible"
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

---[FILE: mq_broker_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_broker_not_publicly_accessible/mq_broker_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.mq.mq_client import mq_client


class mq_broker_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for broker in mq_client.brokers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=broker)
            report.status = "FAIL"
            report.status_extended = f"MQ Broker {broker.name} is publicly accessible."

            if not broker.publicly_accessible:
                report.status = "PASS"
                report.status_extended = (
                    f"MQ Broker {broker.name} is not publicly accessible."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: neptune_client.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_client.py

```python
from prowler.providers.aws.services.neptune.neptune_service import Neptune
from prowler.providers.common.provider import Provider

neptune_client = Neptune(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: neptune_service.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Neptune(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        self.service_name = "neptune"
        super().__init__(self.service_name, provider)
        self.clusters = {}
        self.db_cluster_snapshots = []
        self.__threading_call__(self._describe_clusters)
        self.__threading_call__(self._describe_db_subnet_groups)
        self.__threading_call__(self._describe_db_cluster_snapshots)
        self.__threading_call__(self._describe_db_cluster_snapshot_attributes)
        self._list_tags_for_resource()

    def _describe_clusters(self, regional_client):
        logger.info("Neptune - Describing DB Clusters...")
        try:
            for cluster in regional_client.describe_db_clusters(
                Filters=[
                    {
                        "Name": "engine",
                        "Values": [
                            self.service_name,
                        ],
                    },
                ],
            )["DBClusters"]:
                cluster_arn = cluster["DBClusterArn"]
                if not self.audit_resources or (
                    is_resource_filtered(cluster_arn, self.audit_resources)
                ):
                    self.clusters[cluster_arn] = Cluster(
                        arn=cluster_arn,
                        name=cluster["DBClusterIdentifier"],
                        id=cluster["DbClusterResourceId"],
                        backup_retention_period=cluster.get("BackupRetentionPeriod", 0),
                        encrypted=cluster.get("StorageEncrypted", False),
                        kms_key=cluster.get("KmsKeyId", ""),
                        cloudwatch_logs=cluster.get("EnabledCloudwatchLogsExports", []),
                        multi_az=cluster["MultiAZ"],
                        iam_auth=cluster.get("IAMDatabaseAuthenticationEnabled", False),
                        deletion_protection=cluster.get("DeletionProtection", False),
                        copy_tags_to_snapshot=cluster.get("CopyTagsToSnapshot", False),
                        db_subnet_group_id=cluster["DBSubnetGroup"],
                        region=regional_client.region,
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_db_subnet_groups(self, regional_client):
        logger.info("Neptune - Describing DB Subnet Groups...")
        try:
            for cluster in self.clusters.values():
                if cluster.region == regional_client.region:
                    try:
                        subnets = []
                        db_subnet_groups = regional_client.describe_db_subnet_groups(
                            DBSubnetGroupName=cluster.db_subnet_group_id
                        )["DBSubnetGroups"]
                        for subnet_group in db_subnet_groups:
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

    def _list_tags_for_resource(self):
        logger.info("Neptune - Listing Tags...")
        try:
            for cluster in self.clusters.values():
                try:
                    regional_client = self.regional_clients[cluster.region]
                    cluster.tags = regional_client.list_tags_for_resource(
                        ResourceName=cluster.arn
                    )["TagList"]
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_db_cluster_snapshots(self, regional_client):
        logger.info("NeptuneDB - Describe Cluster Snapshots...")
        try:
            describe_db_snapshots_paginator = regional_client.get_paginator(
                "describe_db_cluster_snapshots"
            )
            for page in describe_db_snapshots_paginator.paginate():
                for snapshot in page["DBClusterSnapshots"]:
                    arn = f"arn:{self.audited_partition}:neptune:{regional_client.region}:{self.audited_account}:cluster-snapshot:{snapshot['DBClusterSnapshotIdentifier']}"
                    if not self.audit_resources or (
                        is_resource_filtered(
                            arn,
                            self.audit_resources,
                        )
                    ):
                        if snapshot["Engine"] == "neptune":
                            self.db_cluster_snapshots.append(
                                ClusterSnapshot(
                                    id=snapshot["DBClusterSnapshotIdentifier"],
                                    arn=arn,
                                    cluster_id=snapshot["DBClusterIdentifier"],
                                    encrypted=snapshot.get("StorageEncrypted", False),
                                    region=regional_client.region,
                                    tags=snapshot.get("TagList", []),
                                )
                            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_db_cluster_snapshot_attributes(self, regional_client):
        logger.info("NeptuneDB - Describe Cluster Snapshot Attributes...")
        try:
            for snapshot in self.db_cluster_snapshots:
                if snapshot.region == regional_client.region:
                    response = regional_client.describe_db_cluster_snapshot_attributes(
                        DBClusterSnapshotIdentifier=snapshot.id
                    )["DBClusterSnapshotAttributesResult"]
                    for att in response["DBClusterSnapshotAttributes"]:
                        if "all" in att["AttributeValues"]:
                            snapshot.public = True
        except ClientError as error:
            if error.response["Error"]["Code"] == "DBClusterSnapshotNotFoundFault":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Cluster(BaseModel):
    arn: str
    name: str
    id: str
    backup_retention_period: int
    encrypted: bool
    kms_key: str
    multi_az: bool
    iam_auth: bool
    deletion_protection: bool
    copy_tags_to_snapshot: Optional[bool]
    region: str
    db_subnet_group_id: str
    subnets: Optional[list]
    tags: Optional[list]
    cloudwatch_logs: Optional[list]


class ClusterSnapshot(BaseModel):
    id: str
    cluster_id: str
    arn: str
    public: bool = False
    encrypted: bool
    region: str
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_backup_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_backup_enabled/neptune_cluster_backup_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "neptune_cluster_backup_enabled",
  "CheckTitle": "Neptune cluster has automated backups enabled with retention period equal to or greater than the configured minimum",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "neptune",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Neptune DB cluster automated backup is enabled and retention days are more than the required minimum retention period (default to `7` days).",
  "Risk": "**Insufficient backup retention** reduces the ability to recover from data corruption, accidental deletion, or ransomware, impacting **availability** and **integrity**.\n\n- Prevents point-in-time recovery to required dates\n- Increases downtime, irreversible data loss, and compliance violations",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/neptune-controls.html#neptune-5",
    "https://trendmicro.com/cloudoneconformity/knowledge-base/aws/Neptune/sufficient-backup-retention-period.html",
    "https://support.icompaas.com/support/solutions/articles/62000233327-check-for-neptune-clusters-backup-retention-period",
    "https://asecure.cloud/a/p_configrule_neptune_cluster_backup_retention_check/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws neptune modify-db-cluster --db-cluster-identifier <DB_CLUSTER_ID> --backup-retention-period 7 --apply-immediately",
      "NativeIaC": "```yaml\nParameters:\n  DBClusterId:\n    Type: String\nResources:\n  NeptuneCluster:\n    Type: AWS::Neptune::DBCluster\n    Properties:\n      DBClusterIdentifier: !Ref DBClusterId\n      BackupRetentionPeriod: 7  # Enable automated backups with 7-day retention minimum\n```",
      "Terraform": "```hcl\nresource \"aws_neptune_cluster\" \"example_resource\" {\n  cluster_identifier      = var.cluster_id\n  backup_retention_period = 7  # Enable automated backups with 7-day retention minimum\n}\n```",
      "Other": "1. Sign in to the AWS Management Console\n2. Services → Amazon Neptune → Databases\n3. Select the DB cluster and click Modify\n4. In Backup retention period set the value to 7 (or higher)\n5. Choose Apply immediately and click Modify cluster"
    },
    "Recommendation": {
      "Text": "Ensure automated backups are enabled and retention aligns with your **RPO/RTO** and regulatory requirements (at least `7` days).\n\n- Define backup lifecycle and storage retention policies\n- Regularly test restore procedures and monitor backup health\n- Incorporate backups into Disaster Recovery and retention governance",
      "Url": "https://hub.prowler.com/check/neptune_cluster_backup_enabled"
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

---[FILE: neptune_cluster_backup_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_backup_enabled/neptune_cluster_backup_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS, Severity
from prowler.providers.aws.services.neptune.neptune_client import neptune_client


class neptune_cluster_backup_enabled(Check):
    def execute(self):
        findings = []
        for cluster in neptune_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.resource_id = cluster.name
            report.status = "FAIL"
            report.status_extended = (
                f"Neptune Cluster {cluster.name} does not have backup enabled."
            )
            if cluster.backup_retention_period >= neptune_client.audit_config.get(
                "minimum_backup_retention_period", 7
            ):
                report.status = "PASS"
                report.status_extended = f"Neptune Cluster {cluster.name} has backup enabled with retention period {cluster.backup_retention_period} days."
            else:
                if cluster.backup_retention_period > 0:
                    report.status = "FAIL"
                    report.check_metadata.Severity = Severity.low
                    report.status_extended = f"Neptune Cluster {cluster.name} has backup enabled with retention period {cluster.backup_retention_period} days. Recommended to increase the backup retention period to a minimum of 7 days."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_copy_tags_to_snapshots.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_copy_tags_to_snapshots/neptune_cluster_copy_tags_to_snapshots.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "neptune_cluster_copy_tags_to_snapshots",
  "CheckTitle": "Neptune DB cluster is configured to copy tags to snapshots.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "neptune",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Neptune DB cluster is configured to copy all tags to snapshots when snapshots are created.",
  "Risk": "**Missing snapshot tags** weakens governance across confidentiality, integrity, and availability.\n\n- **Access control**: Tag-based IAM conditions may not apply to snapshots, enabling unauthorized restore or copy\n- **Operational**: Recovery, retention, and cost tracking can fail due to unidentifiable or orphaned snapshots",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/neptune/latest/userguide/tagging.html#tagging-overview",
    "https://www.cloudanix.com/docs/aws/audit/rdsmonitoring/rules/neptune_cluster_copy_tags_to_snapshot_enabled",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/neptune-controls.html#neptune-8",
    "https://docs.prismacloud.io/en/enterprise-edition/policy-reference/aws-policies/aws-general-policies/bc-aws-2-60"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws neptune modify-db-cluster --db-cluster-identifier <DB_CLUSTER_ID> --copy-tags-to-snapshot --apply-immediately",
      "NativeIaC": "```yaml\nResources:\n  NeptuneCluster:\n    Type: AWS::RDS::DBCluster\n    Properties:\n      DBClusterIdentifier: <DB_CLUSTER_ID>\n      EngineVersion: neptune\n      CopyTagsToSnapshot: true  # Inherit tags for snapshot governance and access control\n```",
      "Terraform": "```hcl\nresource \"aws_neptune_cluster\" \"example_resource\" {\n  cluster_identifier     = \"<DB_CLUSTER_ID>\"\n  copy_tags_to_snapshot  = true  # Inherit tags for snapshot governance and access control\n}\n```",
      "Other": "1. Sign in to the AWS Management Console and open Amazon Neptune\n2. Click Clusters and select the cluster\n3. Click Modify\n4. In Backup, enable \"Copy tags to snapshots\"\n5. Check \"Apply immediately\"\n6. Click Modify Cluster"
    },
    "Recommendation": {
      "Text": "Preserve metadata by enabling tag inheritance for snapshots and enforcing a consistent tagging strategy.\n\n- Adopt a standardized tag taxonomy\n- Use tag-based access controls and apply least privilege\n- Automate tagging and policy checks in provisioning to prevent untagged snapshots",
      "Url": "https://hub.prowler.com/check/neptune_cluster_copy_tags_to_snapshots"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_copy_tags_to_snapshots.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_copy_tags_to_snapshots/neptune_cluster_copy_tags_to_snapshots.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.neptune.neptune_client import neptune_client


class neptune_cluster_copy_tags_to_snapshots(Check):
    def execute(self):
        findings = []
        for cluster in neptune_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"Neptune DB Cluster {cluster.id} is not configured to copy tags to snapshots."
            if cluster.copy_tags_to_snapshot:
                report.status = "PASS"
                report.status_extended = f"Neptune DB Cluster {cluster.id} is configured to copy tags to snapshots."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_deletion_protection.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_deletion_protection/neptune_cluster_deletion_protection.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "neptune_cluster_deletion_protection",
  "CheckTitle": "Neptune cluster has deletion protection enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Destruction"
  ],
  "ServiceName": "neptune",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Neptune DB cluster has **deletion protection** enabled.",
  "Risk": "Absence of **deletion protection** weakens **availability** and **integrity**: clusters can be removed by accidental admin actions, rogue automation, or compromised credentials.\n\nCluster deletion causes immediate service outage, potential permanent data loss, and extended recovery time if backups or restores are insufficient.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/neptune-controls.html#neptune-4"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws neptune modify-db-cluster --db-cluster-identifier <DB_CLUSTER_IDENTIFIER> --deletion-protection --apply-immediately",
      "NativeIaC": "```yaml\nResources:\n  NeptuneCluster:\n    Type: AWS::Neptune::DBCluster\n    Properties:\n      DBClusterIdentifier: <CLUSTER_ID>\n      DeletionProtection: true  # Prevent accidental or malicious cluster deletion\n```",
      "Terraform": "```hcl\nresource \"aws_neptune_cluster\" \"example_resource\" {\n  cluster_identifier  = \"<CLUSTER_ID>\"\n  deletion_protection = true  # Prevent accidental or malicious cluster deletion\n}\n```",
      "Other": "1. Sign in to the AWS Management Console and open Amazon Neptune\n2. In the navigation pane, choose Databases\n3. Select the DB cluster and choose Modify\n4. Enable Deletion protection\n5. Choose Apply immediately (if shown) and then Modify DB cluster"
    },
    "Recommendation": {
      "Text": "Enable **deletion protection** for production Neptune clusters and apply the principles of **least privilege** and **separation of duties** for delete operations.\n\nEnforce change-control approvals, restrict delete permissions to audited roles, and limit automated workflows that can perform destructive actions to prevent accidental or malicious deletions.",
      "Url": "https://hub.prowler.com/check/neptune_cluster_deletion_protection"
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

---[FILE: neptune_cluster_deletion_protection.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_deletion_protection/neptune_cluster_deletion_protection.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.neptune.neptune_client import neptune_client


class neptune_cluster_deletion_protection(Check):
    def execute(self):
        findings = []
        for cluster in neptune_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.resource_id = cluster.name
            report.status = "FAIL"
            report.status_extended = f"Neptune Cluster {cluster.name} does not have deletion protection enabled."
            if cluster.deletion_protection:
                report.status = "PASS"
                report.status_extended = (
                    f"Neptune Cluster {cluster.name} has deletion protection enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_iam_authentication_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_iam_authentication_enabled/neptune_cluster_iam_authentication_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "neptune_cluster_iam_authentication_enabled",
  "CheckTitle": "Neptune cluster has IAM authentication enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Credential Access"
  ],
  "ServiceName": "neptune",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Neptune DB clusters are evaluated for **IAM database authentication**. \n\nIf this setting is enabled, the cluster supports IAM-based authentication.\nIf disabled, the cluster requires traditional database credentials instead.",
  "Risk": "**Disabled IAM database authentication** weakens confidentiality and integrity of the database.\n\n- Static or embedded DB credentials can be stolen or reused, enabling unauthorized queries and data exfiltration\n- Attackers may bypass centralized access controls, escalate privileges, and move laterally without IAM-based audit trails",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/neptune-controls.html#neptune-7",
    "https://docs.aws.amazon.com/config/latest/developerguide/neptune-cluster-iam-database-authentication.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Neptune/iam-db-authentication.html#",
    "https://hub.steampipe.io/plugins/turbot/terraform/queries/neptune/neptune_cluster_iam_authentication_enabled"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws neptune modify-db-cluster --db-cluster-identifier <DB_CLUSTER_ID> --enable-iam-database-authentication --apply-immediately",
      "NativeIaC": "```yaml\nResources:\n  NeptuneCluster:\n    Type: AWS::Neptune::DBCluster\n    Properties:\n      DBClusterIdentifier: <DB_CLUSTER_ID>\n      IamAuthEnabled: true  # Enable IAM authentication instead of static DB credentials\n```",
      "Terraform": "```hcl\nresource \"aws_neptune_cluster\" \"example_resource\" {\n  cluster_identifier                  = \"<DB_CLUSTER_ID>\"\n  iam_database_authentication_enabled = true  # Enable IAM authentication instead of static DB credentials\n}\n```",
      "Other": "1. Sign in to the AWS Management Console and open Amazon Neptune > Databases\n2. Select the DB cluster and choose **Actions** > **Modify**\n3. In **Authentication**, enable **IAM DB authentication** and check **Apply immediately**\n4. Click **Continue** then **Modify DB cluster**"
    },
    "Recommendation": {
      "Text": "Adopt **IAM database authentication** and centralized identity management to remove static DB credentials and improve auditability.\n\n- Enforce **least privilege** for database roles\n- Use short-lived credentials, centralized rotation and logging\n- Apply defense-in-depth and integrate DB access with IAM for accountability",
      "Url": "https://hub.prowler.com/check/neptune_cluster_iam_authentication_enabled"
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

---[FILE: neptune_cluster_iam_authentication_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_iam_authentication_enabled/neptune_cluster_iam_authentication_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.neptune.neptune_client import neptune_client


class neptune_cluster_iam_authentication_enabled(Check):
    def execute(self):
        findings = []
        for cluster in neptune_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.resource_id = cluster.name
            report.status = "FAIL"
            report.status_extended = f"Neptune Cluster {cluster.name} does not have IAM authentication enabled."
            if cluster.iam_auth:
                report.status = "PASS"
                report.status_extended = (
                    f"Neptune Cluster {cluster.name} has IAM authentication enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_integration_cloudwatch_logs.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_integration_cloudwatch_logs/neptune_cluster_integration_cloudwatch_logs.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "neptune_cluster_integration_cloudwatch_logs",
  "CheckTitle": "Neptune cluster has CloudWatch audit logs enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "neptune",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Neptune DB cluster is inspected for CloudWatch export of **audit** events. The finding indicates whether the cluster publishes `audit` logs to CloudWatch; a failed status in the report means the `audit` export is not enabled and audit records are not being forwarded to CloudWatch for centralized logging and review.",
  "Risk": "Missing **audit logs** reduces **detectability** and **accountability**: \n\n- Investigators cannot reconstruct queries, client origins, or timeline\n- Unauthorized queries, data exfiltration, or privilege misuse may go undetected\n\nThis degrades confidentiality and integrity and slows incident response.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/neptune/latest/userguide/auditing.html",
    "https://docs.aws.amazon.com/neptune/latest/userguide/cloudwatch-logs.html",
    "https://cloudanix.com/docs/aws/audit/rdsmonitoring/rules/neptune_cluster_cloudwatch_log_export_enabled_remediation",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/neptune-controls.html#neptune-2"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws neptune modify-db-cluster --db-cluster-identifier <DB_CLUSTER_IDENTIFIER> --cloudwatch-logs-export-configuration '{\"EnableLogTypes\":[\"audit\"]}'",
      "NativeIaC": "```yaml\nResources:\n  NeptuneCluster:\n    Type: AWS::Neptune::DBCluster\n    Properties:\n      DBClusterIdentifier: \"<DB_CLUSTER_IDENTIFIER>\"\n      EnableCloudwatchLogsExports:\n        - audit  # Export audit logs to CloudWatch for monitoring and forensics\n```",
      "Terraform": "```hcl\nresource \"aws_neptune_cluster\" \"example_resource\" {\n  cluster_identifier               = \"<db_cluster_identifier>\"\n  enabled_cloudwatch_logs_exports = [\"audit\"]  # Export audit logs to CloudWatch for monitoring and forensics\n}\n```",
      "Other": "1. Sign in to the AWS Management Console and open Amazon Neptune\n2. Go to Databases and select the Neptune DB cluster\n3. Actions > Modify\n4. In Log exports, check \"Audit\"\n5. Continue > Modify DB Cluster"
    },
    "Recommendation": {
      "Text": "Enable and centralize **audit logging** for Neptune by exporting `audit` events to CloudWatch Logs and integrating with monitoring or SIEM.\n\n- Enforce **least privilege** on log access\n- Configure retention, encryption, and alerting for anomalous queries\n\nThis supports proactive detection and forensic readiness.",
      "Url": "https://hub.prowler.com/check/neptune_cluster_integration_cloudwatch_logs"
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

---[FILE: neptune_cluster_integration_cloudwatch_logs.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_integration_cloudwatch_logs/neptune_cluster_integration_cloudwatch_logs.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.neptune.neptune_client import neptune_client


class neptune_cluster_integration_cloudwatch_logs(Check):
    def execute(self):
        findings = []
        for cluster in neptune_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.resource_id = cluster.name
            report.status = "FAIL"
            report.status_extended = f"Neptune Cluster {cluster.name} does not have cloudwatch audit logs enabled."
            if "audit" in cluster.cloudwatch_logs:
                report.status = "PASS"
                report.status_extended = (
                    f"Neptune Cluster {cluster.name} has cloudwatch audit logs enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_multi_az.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_multi_az/neptune_cluster_multi_az.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "neptune_cluster_multi_az",
  "CheckTitle": "Neptune cluster has Multi-AZ enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "neptune",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Amazon Neptune DB clusters are evaluated for `Multi-AZ` deployment by checking whether the cluster has read-replica instances distributed across multiple Availability Zones.\n\nA failing result indicates the cluster is deployed in a single AZ and lacks read-replicas that enable automatic promotion and cross-AZ failover.",
  "Risk": "**Single-AZ deployment** creates a clear availability single point of failure.\n\n- **Availability**: AZ outage or maintenance can cause prolonged downtime until the primary is rebuilt.\n- **Integrity/Recovery**: Manual recovery increases risk of configuration errors and longer RTOs, impacting operations and compliance.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/neptune-controls.html#neptune-9",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Neptune/multi-az.html#"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\nResources:\n NeptuneCluster:\n Type: AWS::Neptune::DBCluster\n Properties:\n DBClusterIdentifier: \"<DB_CLUSTER_IDENTIFIER>\"\n # Deploy across multiple AZs for high availability and failover\n AvailabilityZones:\n - \"<AZ_1>\"\n - \"<AZ_2>\"\n - \"<AZ_3>\"\n```",
      "Terraform": "```hcl\nresource \"aws_neptune_cluster\" \"example\" {\n cluster_identifier = \"<db_cluster_identifier>\"\n availability_zones = [\"<AZ_1>\", \"<AZ_2>\", \"<AZ_3>\"]  # Deploy across multiple AZs for high availability\n}\n```",
      "Other": ""
    },
    "Recommendation": {
      "Text": "Adopt a **high availability** deployment model for production Neptune clusters by placing read-replicas in separate Availability Zones to avoid single points of failure.\n\nRegularly test automated failover and combine HA with robust backup and recovery practices as part of a defense-in-depth strategy.",
      "Url": "https://hub.prowler.com/check/neptune_cluster_multi_az"
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

---[FILE: neptune_cluster_multi_az.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_multi_az/neptune_cluster_multi_az.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.neptune.neptune_client import neptune_client


class neptune_cluster_multi_az(Check):
    def execute(self):
        findings = []
        for cluster in neptune_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.resource_id = cluster.name
            report.status = "FAIL"
            report.status_extended = (
                f"Neptune Cluster {cluster.name} does not have Multi-AZ enabled."
            )
            if cluster.multi_az:
                report.status = "PASS"
                report.status_extended = (
                    f"Neptune Cluster {cluster.name} has Multi-AZ enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
