---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 263
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 263 of 867)

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

---[FILE: dms_replication_task_target_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_replication_task_target_logging_enabled/dms_replication_task_target_logging_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dms.dms_client import dms_client


class dms_replication_task_target_logging_enabled(Check):
    """
    Check if AWS DMS replication tasks have logging enabled with the required
    logging components and severity levels.

    This class verifies that each DMS replication task has logging enabled
    and that the components TARGET_APPLY and TARGET_LOAD are configured with
    at least LOGGER_SEVERITY_DEFAULT severity level. If either component is missing
    or does not meet the minimum severity requirement, the check will fail.
    """

    def execute(self) -> List[Check_Report_AWS]:
        """
        Execute the DMS replication task logging requirements check.

        Iterates over all DMS replication tasks and generates a report indicating
        whether each task has logging enabled and meets the logging requirements
        for TARGET_APPLY and TARGET_LOAD components.

        Returns:
            List[Check_Report_AWS]: A list of report objects with the results of the check.
        """
        MINIMUM_SEVERITY_LEVELS = [
            "LOGGER_SEVERITY_DEFAULT",
            "LOGGER_SEVERITY_DEBUG",
            "LOGGER_SEVERITY_DETAILED_DEBUG",
        ]
        findings = []
        # Check if replication_tasks is not None before iterating
        if dms_client.replication_tasks:
            for (
                replication_task_arn,
                replication_task,
            ) in dms_client.replication_tasks.items():
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=replication_task
                )
                report.resource_arn = replication_task_arn

                if not replication_task.logging_enabled:
                    report.status = "FAIL"
                    report.status_extended = f"DMS Replication Task {replication_task.id} does not have logging enabled for target events."
                else:
                    missing_components = []
                    source_capture_compliant = False
                    source_unload_compliant = False

                    for component in replication_task.log_components:
                        if (
                            component["Id"] == "TARGET_APPLY"
                            and component["Severity"] in MINIMUM_SEVERITY_LEVELS
                        ):
                            source_capture_compliant = True
                        elif (
                            component["Id"] == "TARGET_LOAD"
                            and component["Severity"] in MINIMUM_SEVERITY_LEVELS
                        ):
                            source_unload_compliant = True

                    if not source_capture_compliant:
                        missing_components.append("Target Apply")
                    if not source_unload_compliant:
                        missing_components.append("Target Load")

                    if source_capture_compliant and source_unload_compliant:
                        report.status = "PASS"
                        report.status_extended = f"DMS Replication Task {replication_task.id} has logging enabled with the minimum severity level in target events."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"DMS Replication Task {replication_task.id} does not meet the minimum severity level of logging in {' and '.join(missing_components)} events."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: documentdb_client.py]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_client.py

```python
from prowler.providers.aws.services.documentdb.documentdb_service import DocumentDB
from prowler.providers.common.provider import Provider

documentdb_client = DocumentDB(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: documentdb_service.py]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class DocumentDB(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        self.service_name = "docdb"
        super().__init__(self.service_name, provider)
        self.db_instances = {}
        self.db_clusters = {}
        self.db_cluster_snapshots = []
        self.__threading_call__(self._describe_db_instances)
        self.__threading_call__(self._describe_db_clusters)
        self.__threading_call__(self._describe_db_cluster_snapshots)
        self.__threading_call__(self._describe_db_cluster_snapshot_attributes)
        self._list_tags_for_resource()

    def _describe_db_instances(self, regional_client):
        logger.info("DocumentDB - Describe Instances...")
        try:
            describe_db_instances_paginator = regional_client.get_paginator(
                "describe_db_instances"
            )
            for page in describe_db_instances_paginator.paginate(
                Filters=[
                    {
                        "Name": "engine",
                        "Values": [
                            self.service_name,
                        ],
                    },
                ],
            ):
                for instance in page["DBInstances"]:
                    instance_arn = instance["DBInstanceArn"]
                    if not self.audit_resources or (
                        is_resource_filtered(instance_arn, self.audit_resources)
                    ):
                        self.db_instances[instance_arn] = Instance(
                            id=instance["DBInstanceIdentifier"],
                            arn=instance["DBInstanceArn"],
                            engine=instance["Engine"],
                            engine_version=instance["EngineVersion"],
                            status=instance["DBInstanceStatus"],
                            public=instance["PubliclyAccessible"],
                            encrypted=instance["StorageEncrypted"],
                            cluster_id=instance.get("DBClusterIdentifier"),
                            region=regional_client.region,
                            tags=instance.get("TagList", []),
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("DocumentDB - List Tags...")
        try:
            for cluster_arn, cluster in self.db_clusters.items():
                try:
                    regional_client = self.regional_clients[cluster.region]
                    response = regional_client.list_tags_for_resource(
                        ResourceName=cluster_arn
                    )["TagList"]
                    cluster.tags = response
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
            for instance_arn, instance in self.db_instances.items():
                try:
                    regional_client = self.regional_clients[instance.region]
                    response = regional_client.list_tags_for_resource(
                        ResourceName=instance_arn
                    )["TagList"]
                    instance.tags = response
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_db_clusters(self, regional_client):
        logger.info("DocumentDB - Describe Clusters...")
        try:
            describe_db_clusters_paginator = regional_client.get_paginator(
                "describe_db_clusters"
            )
            for page in describe_db_clusters_paginator.paginate(
                Filters=[
                    {
                        "Name": "engine",
                        "Values": [
                            self.service_name,
                        ],
                    },
                ],
            ):
                for cluster in page["DBClusters"]:
                    db_cluster_arn = cluster["DBClusterArn"]
                    if not self.audit_resources or (
                        is_resource_filtered(db_cluster_arn, self.audit_resources)
                    ):
                        self.db_clusters[db_cluster_arn] = DBCluster(
                            id=cluster["DBClusterIdentifier"],
                            arn=db_cluster_arn,
                            endpoint=cluster.get("Endpoint"),
                            engine=cluster["Engine"],
                            status=cluster["Status"],
                            encrypted=cluster["StorageEncrypted"],
                            backup_retention_period=cluster.get(
                                "BackupRetentionPeriod"
                            ),
                            cloudwatch_logs=cluster.get(
                                "EnabledCloudwatchLogsExports", []
                            ),
                            deletion_protection=cluster["DeletionProtection"],
                            parameter_group=cluster["DBClusterParameterGroup"],
                            multi_az=cluster["MultiAZ"],
                            region=regional_client.region,
                            tags=cluster.get("TagList", []),
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_db_cluster_snapshots(self, regional_client):
        logger.info("DocumentDB - Describe Cluster Snapshots...")
        try:
            describe_db_snapshots_paginator = regional_client.get_paginator(
                "describe_db_cluster_snapshots"
            )
            for page in describe_db_snapshots_paginator.paginate():
                for snapshot in page["DBClusterSnapshots"]:
                    arn = f"arn:{self.audited_partition}:rds:{regional_client.region}:{self.audited_account}:cluster-snapshot:{snapshot['DBClusterSnapshotIdentifier']}"
                    if not self.audit_resources or (
                        is_resource_filtered(
                            arn,
                            self.audit_resources,
                        )
                    ):
                        if snapshot["Engine"] == "docdb":
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
        logger.info("DocumentDB - Describe Cluster Snapshot Attributes...")
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


class Instance(BaseModel):
    id: str
    arn: str
    engine: str
    engine_version: str
    status: str
    public: bool
    encrypted: bool
    cluster_id: Optional[str]
    region: str
    tags: Optional[list]


class DBCluster(BaseModel):
    id: str
    arn: str
    endpoint: Optional[str]
    engine: str
    status: str
    encrypted: bool
    backup_retention_period: int = 0
    cloudwatch_logs: Optional[list] = []
    deletion_protection: bool
    multi_az: bool
    parameter_group: str
    region: str
    tags: Optional[list] = []


class ClusterSnapshot(BaseModel):
    id: str
    cluster_id: str
    # arn:{partition}:rds:{region}:{account}:cluster-snapshot:{resource_id}
    arn: str
    public: bool = False
    encrypted: bool
    region: str
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_backup_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_backup_enabled/documentdb_cluster_backup_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "documentdb_cluster_backup_enabled",
  "CheckTitle": "DocumentDB cluster has automated backups enabled with retention period of at least 7 days",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Destruction"
  ],
  "ServiceName": "documentdb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "**Amazon DocumentDB clusters** are evaluated for **automated backups** and an adequate **backup retention period**. Clusters should have `backup_retention_period` set to at least the configured minimum (default `7` days). Values of `0` indicate backups are disabled; values below the threshold are considered insufficient.",
  "Risk": "Without adequate backups, clusters can't be reliably restored. Accidental deletes, logical corruption, or ransomware may cause irreversible data loss once a short retention window expires, leading to prolonged outages, missed RPO/RTO, and limited ability to roll back malicious or erroneous changes.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.amazonaws.cn/en_us/documentdb/latest/developerguide/what-is.html",
    "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/DocumentDB/sufficient-backup-retention-period.html#",
    "https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/aws-enabledocdbclusterbackupretentionperiod.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws docdb modify-db-cluster --db-cluster-identifier <DB_CLUSTER_ID> --backup-retention-period 7 --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: Set DocumentDB backup retention to at least 7 days\nResources:\n  <example_resource_name>:\n    Type: AWS::DocDB::DBCluster\n    Properties:\n      BackupRetentionPeriod: 7  # CRITICAL: enables automated backups and sets retention to >=7 days\n```",
      "Other": "1. Open the Amazon DocumentDB console\n2. Go to Clusters and select <example_resource_id>\n3. Click Modify\n4. Set Backup retention period to 7 (or higher)\n5. Check Apply immediately\n6. Click Continue and then Modify cluster",
      "Terraform": "```hcl\n# Terraform: Ensure DocumentDB backup retention is at least 7 days\nresource \"aws_docdb_cluster\" \"<example_resource_name>\" {\n  cluster_identifier      = \"<example_resource_id>\"\n  backup_retention_period = 7  # CRITICAL: enables automated backups and sets retention to >=7 days\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **automated backups** and set retention to meet RPO/RTO (typically `7-35` days).\n- Regularly test point-in-time restores\n- Apply **least privilege** to backup/snapshot management\n- Protect backup artifacts and define stable backup windows\n- Include restores in a tested **disaster recovery** plan",
      "Url": "https://hub.prowler.com/check/documentdb_cluster_backup_enabled"
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

---[FILE: documentdb_cluster_backup_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_backup_enabled/documentdb_cluster_backup_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS, Severity
from prowler.providers.aws.services.documentdb.documentdb_client import (
    documentdb_client,
)


class documentdb_cluster_backup_enabled(Check):
    def execute(self):
        findings = []
        for cluster in documentdb_client.db_clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = (
                f"DocumentDB Cluster {cluster.id} does not have backup enabled."
            )
            if cluster.backup_retention_period >= documentdb_client.audit_config.get(
                "minimum_backup_retention_period", 7
            ):
                report.status = "PASS"
                report.status_extended = f"DocumentDB Cluster {cluster.id} has backup enabled with retention period {cluster.backup_retention_period} days."
            else:
                if cluster.backup_retention_period > 0:
                    report.status = "FAIL"
                    report.check_metadata.Severity = Severity.low
                    report.status_extended = f"DocumentDB Cluster {cluster.id} has backup enabled with retention period {cluster.backup_retention_period} days. Recommended to increase the backup retention period to a minimum of 7 days."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_cloudwatch_log_export.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_cloudwatch_log_export/documentdb_cluster_cloudwatch_log_export.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "documentdb_cluster_cloudwatch_log_export",
  "CheckTitle": "DocumentDB cluster exports audit and profiler logs to CloudWatch Logs",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "documentdb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Amazon DocumentDB clusters are evaluated for exporting `audit` and `profiler` logs to **CloudWatch Logs**.\nClusters missing one or both log types are identified as lacking complete log export configuration.",
  "Risk": "Missing **audit** and/or **profiler** exports reduces observability of authentication, authorization, and data definition activity.\nAttacks like brute-force logins, privilege abuse, or destructive schema changes can go unnoticed, degrading **confidentiality** and **integrity** and delaying incident response.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/documentdb-controls.html#documentdb-4",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/DocumentDB/enable-profiler.html",
    "https://docs.aws.amazon.com/cli/latest/reference/docdb/create-db-cluster.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws docdb modify-db-cluster --db-cluster-identifier <DB_CLUSTER_ID> --cloudwatch-logs-export-configuration '{\"EnableLogTypes\":[\"audit\",\"profiler\"]}' --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: enable DocumentDB log exports\nResources:\n  <example_resource_name>:\n    Type: AWS::DocDB::DBCluster\n    Properties:\n      EnableCloudwatchLogsExports:\n        - audit      # Critical: export audit logs to CloudWatch Logs\n        - profiler   # Critical: export profiler logs to CloudWatch Logs\n```",
      "Other": "1. In AWS Console, go to Amazon DocumentDB > Clusters\n2. Select the cluster and choose Actions > Modify\n3. In Log exports, check Audit and Profiler\n4. Check Apply immediately and click Modify cluster",
      "Terraform": "```hcl\n# Enable DocumentDB log exports\nresource \"aws_docdb_cluster\" \"<example_resource_name>\" {\n  enabled_cloudwatch_logs_exports = [\"audit\", \"profiler\"] # Critical: export both logs to CloudWatch Logs\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable export of both `audit` and `profiler` logs to **CloudWatch Logs** for all clusters and centralize analysis.\nApply **least privilege** to log access, define retention and immutability, integrate with alerting, and use **separation of duties** to protect and regularly review logs for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/documentdb_cluster_cloudwatch_log_export"
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

---[FILE: documentdb_cluster_cloudwatch_log_export.py]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_cloudwatch_log_export/documentdb_cluster_cloudwatch_log_export.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS, Severity
from prowler.providers.aws.services.documentdb.documentdb_client import (
    documentdb_client,
)


class documentdb_cluster_cloudwatch_log_export(Check):
    def execute(self):
        findings = []
        for cluster in documentdb_client.db_clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"DocumentDB Cluster {cluster.id} does not have cloudwatch log export enabled."
            if cluster.cloudwatch_logs:
                if (
                    "audit" in cluster.cloudwatch_logs
                    and "profiler" in cluster.cloudwatch_logs
                ):
                    report.status = "PASS"
                    report.status_extended = f"DocumentDB Cluster {cluster.id} is shipping {' '.join(cluster.cloudwatch_logs)} to CloudWatch Logs."
                elif (
                    "audit" in cluster.cloudwatch_logs
                    or "profiler" in cluster.cloudwatch_logs
                ):
                    report.status = "FAIL"
                    report.check_metadata.Severity = Severity.low
                    report.status_extended = f"DocumentDB Cluster {cluster.id} is only shipping {' '.join(cluster.cloudwatch_logs)} to CloudWatch Logs. Recommended to ship both Audit and Profiler logs."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_deletion_protection.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_deletion_protection/documentdb_cluster_deletion_protection.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "documentdb_cluster_deletion_protection",
  "CheckTitle": "DocumentDB cluster has deletion protection enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "documentdb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "**Amazon DocumentDB clusters** are evaluated for the `deletion_protection` setting on the cluster configuration.\n\nThe finding highlights clusters where this protection is not enabled.",
  "Risk": "Without **deletion protection**, clusters can be deleted by mistake or misuse, causing sudden outage and loss of recovery points, impacting **availability** and **data integrity**.\n\nCompromised accounts or faulty automation can remove databases or skip final snapshots, hindering restoration.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://support.icompaas.com/support/solutions/articles/62000233689-ensure-documentdb-clusters-has-deletion-protection-enabled",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/DocumentDB/deletion-protection.html",
    "https://docs.aws.amazon.com/documentdb/latest/developerguide/db-cluster-delete.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/documentdb-controls.html#documentdb-5"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws docdb modify-db-cluster --db-cluster-identifier <DB_CLUSTER_ID> --deletion-protection --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: Enable deletion protection on a DocumentDB cluster\nResources:\n  <example_resource_name>:\n    Type: AWS::DocDB::DBCluster\n    Properties:\n      MasterUsername: \"<MASTER_USERNAME>\"\n      MasterUserPassword: \"<MASTER_USER_PASSWORD>\"\n      DeletionProtection: true  # CRITICAL: Prevents cluster deletion until disabled\n```",
      "Other": "1. In the AWS Console, go to Amazon DocumentDB > Clusters\n2. Select the target cluster and click Modify\n3. Enable Deletion protection\n4. Check Apply immediately and click Save changes",
      "Terraform": "```hcl\n# Terraform: Enable deletion protection on a DocumentDB cluster\nresource \"aws_docdb_cluster\" \"<example_resource_name>\" {\n  master_username     = \"<MASTER_USERNAME>\"\n  master_password     = \"<MASTER_USER_PASSWORD>\"\n  deletion_protection = true  # CRITICAL: Prevents cluster deletion until disabled\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **deletion protection** on all non-ephemeral clusters, prioritizing production.\n\nEnforce **least privilege** for delete and modify actions, require change control to toggle protection, and implement **defense in depth** with automation that continuously enforces this setting. *Before decommissioning*, take a final snapshot.",
      "Url": "https://hub.prowler.com/check/documentdb_cluster_deletion_protection"
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

---[FILE: documentdb_cluster_deletion_protection.py]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_deletion_protection/documentdb_cluster_deletion_protection.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.documentdb.documentdb_client import (
    documentdb_client,
)


class documentdb_cluster_deletion_protection(Check):
    def execute(self):
        findings = []
        for cluster in documentdb_client.db_clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"DocumentDB Cluster {cluster.id} does not have deletion protection enabled."
            if cluster.deletion_protection:
                report.status = "PASS"
                report.status_extended = (
                    f"DocumentDB Cluster {cluster.id} has deletion protection enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_multi_az_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_multi_az_enabled/documentdb_cluster_multi_az_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "documentdb_cluster_multi_az_enabled",
  "CheckTitle": "DocumentDB cluster has Multi-AZ enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "documentdb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "**Amazon DocumentDB clusters** with **Multi-AZ** (`multi_az`) indicate deployment of a primary and one or more replicas across Availability Zones.",
  "Risk": "Without Multi-AZ, the cluster depends on a single AZ/instance. An AZ or node failure-or maintenance-can stop reads and writes, causing downtime, timeouts, and SLA breaches. Availability degrades, RTO rises, and applications may experience failed or retried transactions until replacement capacity is created.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/documentdb/latest/developerguide/failover.html",
    "https://support.icompaas.com/support/solutions/articles/62000233690-ensure-documentdb-cluster-have-multi-az-enabled"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws docdb create-db-instance --db-instance-identifier <example_resource_id> --db-cluster-identifier <example_resource_id> --db-instance-class <INSTANCE_CLASS> --engine docdb --availability-zone <OTHER_AZ>",
      "NativeIaC": "```yaml\n# CloudFormation: add a replica to enable Multi-AZ for an existing DocumentDB cluster\nResources:\n  DocDBReplica:\n    Type: AWS::DocDB::DBInstance\n    Properties:\n      DBClusterIdentifier: \"<example_resource_id>\"  # CRITICAL: adds a new instance to the cluster to achieve Multi-AZ\n      DBInstanceClass: \"<INSTANCE_CLASS>\"\n      AvailabilityZone: \"<OTHER_AZ>\"                # CRITICAL: place in a different AZ to provide Multi-AZ failover\n```",
      "Other": "1. In the AWS Console, go to Amazon DocumentDB and open your cluster\n2. Click Create instance\n3. Set Instance class and choose an Availability Zone different from the primary\n4. Click Create to add the replica\n5. Verify the cluster now shows Multi-AZ enabled",
      "Terraform": "```hcl\n# Add a replica to enable Multi-AZ for an existing DocumentDB cluster\nresource \"aws_docdb_cluster_instance\" \"<example_resource_name>\" {\n  cluster_identifier = \"<example_resource_id>\"  # CRITICAL: adds a new instance to the cluster to achieve Multi-AZ\n  instance_class     = \"<INSTANCE_CLASS>\"\n  availability_zone  = \"<OTHER_AZ>\"             # CRITICAL: different AZ ensures Multi-AZ failover\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Multi-AZ** for DocumentDB and distribute instances across distinct AZs.\n- Maintain at least one replica\n- Set promotion priorities to guide failover\n- Test failover regularly and use resilient client retries\n\nThis builds **fault tolerance** and preserves service availability.",
      "Url": "https://hub.prowler.com/check/documentdb_cluster_multi_az_enabled"
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

---[FILE: documentdb_cluster_multi_az_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_multi_az_enabled/documentdb_cluster_multi_az_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.documentdb.documentdb_client import (
    documentdb_client,
)


class documentdb_cluster_multi_az_enabled(Check):
    def execute(self):
        findings = []
        for db_cluster in documentdb_client.db_clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_cluster)
            report.status = "FAIL"
            report.status_extended = (
                f"DocumentDB Cluster {db_cluster.id} does not have Multi-AZ enabled."
            )
            if db_cluster.multi_az:
                report.status = "PASS"
                report.status_extended = (
                    f"DocumentDB Cluster {db_cluster.id} has Multi-AZ enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_public_snapshot.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_public_snapshot/documentdb_cluster_public_snapshot.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "documentdb_cluster_public_snapshot",
  "CheckTitle": "DocumentDB manual cluster snapshot is not shared publicly",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure",
    "TTPs/Initial Access"
  ],
  "ServiceName": "documentdb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsRdsDbClusterSnapshot",
  "Description": "**Amazon DocumentDB** manual cluster snapshot visibility is evaluated to detect snapshots marked as **public** instead of limited to specified AWS accounts.",
  "Risk": "**Public snapshots** weaken **confidentiality**: any AWS account can restore and read database contents, enabling data exfiltration.\n\nThey also aid **lateral movement** by revealing embedded secrets/config and reduce accountability when restores occur outside your account.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/documentdb/latest/developerguide/backup_restore-share_cluster_snapshots.html#backup_restore-share_snapshots",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/documentdb-controls.html#documentdb-3",
    "https://docs.aws.amazon.com/config/latest/developerguide/docdb-cluster-snapshot-public-prohibited.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws docdb modify-db-cluster-snapshot-attribute --db-cluster-snapshot-identifier <snapshot_id> --attribute-name restore --values-to-remove all",
      "NativeIaC": "",
      "Other": "1. Open the Amazon DocumentDB console and go to Snapshots\n2. Select the public manual cluster snapshot\n3. Click Actions > Share\n4. Set DB snapshot visibility to Private (remove \"all\" if listed)\n5. Click Save",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Keep snapshot visibility `Private` and share only with trusted accounts under **least privilege**. Prefer **CMEK encryption** to enforce key-based access and prevent public sharing. Periodically review sharing lists, restrict IAM permissions that alter visibility, and monitor for exposure as **defense in depth**.",
      "Url": "https://hub.prowler.com/check/documentdb_cluster_public_snapshot"
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

---[FILE: documentdb_cluster_public_snapshot.py]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_public_snapshot/documentdb_cluster_public_snapshot.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.documentdb.documentdb_client import (
    documentdb_client,
)


class documentdb_cluster_public_snapshot(Check):
    def execute(self):
        findings = []
        for db_snap in documentdb_client.db_cluster_snapshots:
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_snap)
            if db_snap.public:
                report.status = "FAIL"
                report.status_extended = (
                    f"DocumentDB Cluster Snapshot {db_snap.id} is public."
                )
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"DocumentDB Cluster Snapshot {db_snap.id} is not shared publicly."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_public_snapshot_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_public_snapshot/documentdb_cluster_public_snapshot_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.documentdb.documentdb_client import (
    documentdb_client,
)


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the attributes of a DocumentDB cluster snapshot to remove public access.
    Specifically, this fixer removes the 'all' value from the 'restore' attribute to
    prevent the snapshot from being publicly accessible. Requires the rds:ModifyDBClusterSnapshotAttribute permissions.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "rds:ModifyDBClusterSnapshotAttribute",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The DB cluster snapshot identifier.
        region (str): AWS region where the snapshot exists.
    Returns:
        bool: True if the operation is successful (public access is removed), False otherwise.
    """
    try:
        regional_client = documentdb_client.regional_clients[region]
        regional_client.modify_db_cluster_snapshot_attribute(
            DBClusterSnapshotIdentifier=resource_id,
            AttributeName="restore",
            ValuesToRemove=["all"],
        )
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

````
