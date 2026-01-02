---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 308
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 308 of 867)

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

---[FILE: rds_service.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_service.py
Signals: Pydantic

```python
from datetime import datetime
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class RDS(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.db_instances = {}
        self.db_clusters = {}
        self.db_snapshots = []
        self.db_engines = {}
        self.db_cluster_parameters = {}
        self.db_cluster_snapshots = []
        self.db_event_subscriptions = []
        self.__threading_call__(self._describe_db_instances)
        self.__threading_call__(self._describe_db_certificate)
        self.__threading_call__(self._describe_db_parameters)
        self.__threading_call__(self._describe_db_snapshots)
        self.__threading_call__(self._describe_db_snapshot_attributes)
        self.__threading_call__(self._describe_db_clusters)
        self.__threading_call__(self._describe_db_cluster_parameters)
        self.__threading_call__(self._describe_db_cluster_snapshots)
        self.__threading_call__(self._describe_db_cluster_snapshot_attributes)
        self.__threading_call__(self._describe_db_engine_versions)
        self.__threading_call__(self._describe_db_event_subscriptions)
        self.__threading_call__(self._list_tags, self.db_event_subscriptions)

    def _get_rds_arn_template(self, region):
        return (
            f"arn:{self.audited_partition}:rds:{region}:{self.audited_account}:account"
            if region
            else f"arn:{self.audited_partition}:rds:{self.region}:{self.audited_account}:account"
        )

    def _describe_db_instances(self, regional_client):
        logger.info("RDS - Describe Instances...")
        try:
            describe_db_instances_paginator = regional_client.get_paginator(
                "describe_db_instances"
            )
            for page in describe_db_instances_paginator.paginate():
                for instance in page["DBInstances"]:
                    arn = f"arn:{self.audited_partition}:rds:{regional_client.region}:{self.audited_account}:db:{instance['DBInstanceIdentifier']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        if instance["Engine"] != "docdb":
                            self.db_instances[arn] = DBInstance(
                                id=instance["DBInstanceIdentifier"],
                                arn=arn,
                                endpoint=instance.get("Endpoint", {}),
                                engine=instance["Engine"],
                                engine_version=instance["EngineVersion"],
                                status=instance["DBInstanceStatus"],
                                public=instance.get("PubliclyAccessible", False),
                                encrypted=instance["StorageEncrypted"],
                                auto_minor_version_upgrade=instance[
                                    "AutoMinorVersionUpgrade"
                                ],
                                backup_retention_period=instance.get(
                                    "BackupRetentionPeriod"
                                ),
                                cloudwatch_logs=instance.get(
                                    "EnabledCloudwatchLogsExports"
                                ),
                                deletion_protection=instance["DeletionProtection"],
                                enhanced_monitoring_arn=instance.get(
                                    "EnhancedMonitoringResourceArn"
                                ),
                                parameter_groups=[
                                    item["DBParameterGroupName"]
                                    for item in instance["DBParameterGroups"]
                                ],
                                multi_az=instance["MultiAZ"],
                                username=instance.get("MasterUsername", ""),
                                iam_auth=instance.get(
                                    "IAMDatabaseAuthenticationEnabled", False
                                ),
                                security_groups=[
                                    sg["VpcSecurityGroupId"]
                                    for sg in instance["VpcSecurityGroups"]
                                    if sg["Status"] == "active"
                                ],
                                cluster_id=instance.get("DBClusterIdentifier"),
                                cluster_arn=f"arn:{self.audited_partition}:rds:{regional_client.region}:{self.audited_account}:cluster:{instance.get('DBClusterIdentifier')}",
                                region=regional_client.region,
                                tags=instance.get("TagList", []),
                                replica_source=instance.get(
                                    "ReadReplicaSourceDBInstanceIdentifier"
                                ),
                                ca_cert=instance.get("CACertificateIdentifier"),
                                copy_tags_to_snapshot=instance.get(
                                    "CopyTagsToSnapshot"
                                ),
                                port=instance.get("Endpoint", {}).get("Port"),
                                vpc_id=instance.get("DBSubnetGroup", {}).get("VpcId"),
                                subnet_ids=[
                                    subnet_id["SubnetIdentifier"]
                                    for subnet_id in instance.get(
                                        "DBSubnetGroup", {}
                                    ).get("Subnets", [])
                                    if subnet_id["SubnetStatus"] == "Active"
                                ],
                            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_db_parameters(self, regional_client):
        logger.info("RDS - Describe DB Parameters...")
        try:
            for instance in self.db_instances.values():
                if instance.region == regional_client.region:
                    for parameter_group in instance.parameter_groups:
                        try:
                            describe_db_parameters_paginator = (
                                regional_client.get_paginator("describe_db_parameters")
                            )
                            for page in describe_db_parameters_paginator.paginate(
                                DBParameterGroupName=parameter_group
                            ):
                                for parameter in page["Parameters"]:
                                    instance.parameters.append(parameter)
                        except Exception as error:
                            logger.error(
                                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_db_certificate(self, regional_client):
        logger.info("RDS - Describe DB Certificate...")
        try:
            for instance in self.db_instances.values():
                if instance.region == regional_client.region:
                    describe_db_certificates_paginator = regional_client.get_paginator(
                        "describe_certificates"
                    )
                    if instance.ca_cert:
                        try:
                            for page in describe_db_certificates_paginator.paginate(
                                CertificateIdentifier=instance.ca_cert
                            ):
                                for certificate in page["Certificates"]:
                                    instance.cert.append(
                                        Certificate(
                                            id=certificate["CertificateIdentifier"],
                                            arn=certificate["CertificateArn"],
                                            type=certificate["CertificateType"],
                                            valid_from=certificate["ValidFrom"],
                                            valid_till=certificate["ValidTill"],
                                            customer_override=certificate[
                                                "CustomerOverride"
                                            ],
                                            customer_override_valid_till=certificate.get(
                                                "CustomerOverrideValidTill"
                                            ),
                                        )
                                    )
                        except ClientError as error:
                            if error.response["Error"]["Code"] == "CertificateNotFound":
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

    def _describe_db_snapshots(self, regional_client):
        logger.info("RDS - Describe Snapshots...")
        try:
            describe_db_snapshots_paginator = regional_client.get_paginator(
                "describe_db_snapshots"
            )
            for page in describe_db_snapshots_paginator.paginate():
                for snapshot in page["DBSnapshots"]:
                    arn = f"arn:{self.audited_partition}:rds:{regional_client.region}:{self.audited_account}:snapshot:{snapshot['DBSnapshotIdentifier']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        if snapshot["Engine"] != "docdb":
                            self.db_snapshots.append(
                                DBSnapshot(
                                    id=snapshot["DBSnapshotIdentifier"],
                                    arn=arn,
                                    instance_id=snapshot["DBInstanceIdentifier"],
                                    encrypted=snapshot.get("Encrypted", False),
                                    region=regional_client.region,
                                    tags=snapshot.get("TagList", []),
                                )
                            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_db_snapshot_attributes(self, regional_client):
        logger.info("RDS - Describe Snapshot Attributes...")
        for snapshot in self.db_snapshots:
            try:
                if snapshot.region == regional_client.region:
                    response = regional_client.describe_db_snapshot_attributes(
                        DBSnapshotIdentifier=snapshot.id
                    )["DBSnapshotAttributesResult"]
                    for att in response["DBSnapshotAttributes"]:
                        if "all" in att["AttributeValues"]:
                            snapshot.public = True
            except ClientError as error:
                if error.response["Error"]["Code"] == "DBSnapshotNotFound":
                    logger.warning(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                    continue
            except Exception as error:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _describe_db_clusters(self, regional_client):
        logger.info("RDS - Describe Clusters...")
        try:
            describe_db_clusters_paginator = regional_client.get_paginator(
                "describe_db_clusters"
            )
            for page in describe_db_clusters_paginator.paginate():
                try:
                    for cluster in page["DBClusters"]:
                        try:
                            db_cluster_arn = f"arn:{self.audited_partition}:rds:{regional_client.region}:{self.audited_account}:cluster:{cluster['DBClusterIdentifier']}"
                            if not self.audit_resources or (
                                is_resource_filtered(
                                    db_cluster_arn, self.audit_resources
                                )
                            ):
                                if cluster["Engine"] != "docdb":
                                    db_cluster = DBCluster(
                                        id=cluster["DBClusterIdentifier"],
                                        arn=db_cluster_arn,
                                        endpoint=cluster.get("Endpoint", ""),
                                        engine=cluster["Engine"],
                                        status=cluster["Status"],
                                        public=cluster.get("PubliclyAccessible", False),
                                        encrypted=cluster["StorageEncrypted"],
                                        auto_minor_version_upgrade=cluster.get(
                                            "AutoMinorVersionUpgrade", False
                                        ),
                                        backup_retention_period=cluster.get(
                                            "BackupRetentionPeriod"
                                        ),
                                        backtrack=cluster.get("BacktrackWindow", 0),
                                        cloudwatch_logs=cluster.get(
                                            "EnabledCloudwatchLogsExports"
                                        ),
                                        deletion_protection=cluster[
                                            "DeletionProtection"
                                        ],
                                        parameter_group=cluster[
                                            "DBClusterParameterGroup"
                                        ],
                                        multi_az=cluster["MultiAZ"],
                                        username=cluster["MasterUsername"],
                                        iam_auth=cluster.get(
                                            "IAMDatabaseAuthenticationEnabled", False
                                        ),
                                        region=regional_client.region,
                                        tags=cluster.get("TagList", []),
                                        copy_tags_to_snapshot=cluster.get(
                                            "CopyTagsToSnapshot"
                                        ),
                                        port=cluster.get("Port"),
                                    )
                                    # We must use a unique value as the dict key to have unique keys
                                    self.db_clusters[db_cluster_arn] = db_cluster
                        except Exception as error:
                            logger.error(
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

    def _describe_db_cluster_parameters(self, regional_client):
        logger.info("RDS - Describe DB Cluster Parameters...")
        try:
            for cluster in self.db_clusters.values():
                if cluster.region == regional_client.region:
                    try:
                        describe_db_cluster_parameters_paginator = (
                            regional_client.get_paginator(
                                "describe_db_cluster_parameters"
                            )
                        )
                        for page in describe_db_cluster_parameters_paginator.paginate(
                            DBClusterParameterGroupName=cluster.parameter_group
                        ):
                            for parameter in page["Parameters"]:
                                if (
                                    "ParameterValue" in parameter
                                    and "ParameterName" in parameter
                                ):
                                    if parameter["ParameterName"] == "rds.force_ssl":
                                        cluster.force_ssl = parameter["ParameterValue"]
                                    if (
                                        parameter["ParameterName"]
                                        == "require_secure_transport"
                                    ):
                                        cluster.require_secure_transport = parameter[
                                            "ParameterValue"
                                        ]
                    except ClientError as error:
                        if (
                            error.response["Error"]["Code"]
                            == "DBClusterParameterGroupName"
                        ):
                            logger.warning(
                                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
                        elif (
                            error.response["Error"]["Code"]
                            == "DBParameterGroupNotFound"
                        ):
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
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_db_cluster_snapshots(self, regional_client):
        logger.info("RDS - Describe Cluster Snapshots...")
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
                        if snapshot["Engine"] != "docdb":
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
        logger.info("RDS - Describe Cluster Snapshot Attributes...")
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

    def _describe_db_engine_versions(self, regional_client):
        logger.info("RDS - Describe Engine Versions...")
        try:
            describe_db_engine_versions_paginator = regional_client.get_paginator(
                "describe_db_engine_versions"
            )
            for page in describe_db_engine_versions_paginator.paginate():
                for engine in page["DBEngineVersions"]:
                    if regional_client.region not in self.db_engines:
                        self.db_engines[regional_client.region] = {}
                    if engine["Engine"] not in self.db_engines[regional_client.region]:
                        db_engine = DBEngine(
                            region=regional_client.region,
                            engine=engine["Engine"],
                            engine_versions=[engine["EngineVersion"]],
                            engine_description=engine["DBEngineDescription"],
                        )
                        self.db_engines[regional_client.region][
                            engine["Engine"]
                        ] = db_engine
                    else:
                        self.db_engines[regional_client.region][
                            engine["Engine"]
                        ].engine_versions.append(engine["EngineVersion"])

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_db_event_subscriptions(self, regional_client):
        logger.info("RDS - Describe Event Subscriptions...")
        try:
            describe_event_subscriptions_paginator = regional_client.get_paginator(
                "describe_event_subscriptions"
            )
            events_exist = False
            for page in describe_event_subscriptions_paginator.paginate():
                for event in page["EventSubscriptionsList"]:
                    try:
                        arn = f"arn:{self.audited_partition}:rds:{regional_client.region}:{self.audited_account}:es:{event['CustSubscriptionId']}"
                        if not self.audit_resources or (
                            is_resource_filtered(
                                arn,
                                self.audit_resources,
                            )
                        ):
                            self.db_event_subscriptions.append(
                                EventSubscription(
                                    id=event["CustSubscriptionId"],
                                    arn=arn,
                                    sns_topic_arn=event["SnsTopicArn"],
                                    status=event["Status"],
                                    source_type=event.get("SourceType", ""),
                                    source_id=event.get("SourceIdsList", []),
                                    event_list=event.get("EventCategoriesList", []),
                                    enabled=event["Enabled"],
                                    region=regional_client.region,
                                )
                            )
                            events_exist = True
                    except Exception as error:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
            if not events_exist:
                # No Event Subscriptions for that region
                self.db_event_subscriptions.append(
                    EventSubscription(
                        id="",
                        arn="",
                        sns_topic_arn="",
                        status="",
                        source_type="",
                        source_id=[],
                        event_list=[],
                        enabled=False,
                        region=regional_client.region,
                        tags=[],
                    )
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags(self, resource: any):
        try:
            if getattr(resource, "region", "") and getattr(resource, "arn", ""):
                resource.tags = (
                    self.regional_clients[resource.region]
                    .list_tags_for_resource(ResourceName=resource.arn)
                    .get("TagList", [])
                )
        except Exception as error:
            logger.error(
                f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Certificate(BaseModel):
    id: str
    arn: str
    type: str
    valid_from: datetime
    valid_till: datetime
    customer_override: bool
    customer_override_valid_till: Optional[datetime]


class DBInstance(BaseModel):
    id: str
    # arn:{partition}:rds:{region}:{account}:db:{resource_id}
    arn: str
    endpoint: dict
    engine: str
    engine_version: str
    status: str
    public: bool
    encrypted: bool
    backup_retention_period: int = 0
    cloudwatch_logs: Optional[list]
    deletion_protection: bool
    auto_minor_version_upgrade: bool
    enhanced_monitoring_arn: Optional[str]
    multi_az: bool
    username: str
    iam_auth: bool
    parameter_groups: list[str] = []
    parameters: list[dict] = []
    security_groups: list[str] = []
    cluster_id: Optional[str]
    cluster_arn: Optional[str]
    region: str
    tags: Optional[list] = []
    replica_source: Optional[str]
    ca_cert: Optional[str]
    cert: list[Certificate] = []
    copy_tags_to_snapshot: Optional[bool]
    port: Optional[int]
    vpc_id: Optional[str]
    subnet_ids: list[str] = []


class DBCluster(BaseModel):
    id: str
    arn: str
    endpoint: str
    engine: str
    status: str
    public: bool
    encrypted: bool
    backup_retention_period: int = 0
    backtrack: int
    cloudwatch_logs: Optional[list]
    deletion_protection: bool
    auto_minor_version_upgrade: bool
    multi_az: bool
    username: str
    iam_auth: bool
    parameter_group: str
    force_ssl: str = "0"
    require_secure_transport: str = "OFF"
    region: str
    tags: Optional[list] = []
    copy_tags_to_snapshot: Optional[bool]
    port: Optional[int]


class DBSnapshot(BaseModel):
    id: str
    # arn:{partition}:rds:{region}:{account}:snapshot:{resource_id}
    arn: str
    instance_id: str
    public: bool = False
    encrypted: bool
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


class DBEngine(BaseModel):
    region: str
    engine: str
    engine_versions: list[str]
    engine_description: str


class EventSubscription(BaseModel):
    id: str
    arn: str
    sns_topic_arn: str
    status: str
    source_type: str
    source_id: list
    event_list: list
    enabled: bool
    region: str
    tags: Optional[list]
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_backtrack_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_backtrack_enabled/rds_cluster_backtrack_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_backtrack_enabled",
  "CheckTitle": "Check if RDS Aurora MySQL Clusters have backtrack enabled.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-cluster",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Ensure that the Backtrack feature is enabled for your Amazon Aurora (with MySQL compatibility) database clusters in order to backtrack your clusters to a specific time, without using backups. Backtrack is an Amazon RDS feature that allows you to specify the amount of time that an Aurora MySQL database cluster needs to retain change records, in order to have a fast way to recover from user errors, such as dropping the wrong table or deleting the wrong row by moving your MySQL database to a prior point in time without the need to restore from a recent backup.",
  "Risk": "Once the Backtrack feature is enabled, Amazon RDS can quickly 'rewind' your Aurora MySQL database cluster to a point in time that you specify. In contrast to the backup and restore method, with Backtrack you can easily undo a destructive action, such as a DELETE query without a WHERE clause, with minimal downtime, you can rewind your Aurora cluster in just few minutes, and you can repeatedly backtrack a database cluster back and forth in time to help determine when a particular data change occurred.",
  "RelatedUrl": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-14",
  "Remediation": {
    "Code": {
      "CLI": "aws rds restore-db-cluster-to-point-in-time --region <REGION> --source-db-cluster-identifier <SOURCE_DB_CLUSTER_ID> --db-cluster-identifier <DB_CLUSTER_ID> --restore-type copy-on-write --use-latest-restorable-time --backtrack-window 86400",
      "NativeIaC": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/backtrack.html#",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/backtrack.html#",
      "Terraform": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/backtrack.html#"
    },
    "Recommendation": {
      "Text": "Backups help you to recover more quickly from a security incident. They also strengthens the resilience of your systems. Aurora backtracking reduces the time to recover a database to a point in time. It does not require a database restore to do so. You cannot enable backtracking on an existing cluster. Instead, you can create a clone that has backtracking enabled.",
      "Url": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-14"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_backtrack_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_backtrack_enabled/rds_cluster_backtrack_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_backtrack_enabled(Check):
    def execute(self):
        findings = []
        for db_cluster in rds_client.db_clusters:
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=rds_client.db_clusters[db_cluster],
            )
            report.resource_arn = db_cluster
            report.status = "FAIL"
            report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} does not have backtrack enabled."
            # Only RDS Aurora MySQL clusters support backtrack.
            if rds_client.db_clusters[db_cluster].engine == "aurora-mysql":
                if rds_client.db_clusters[db_cluster].backtrack > 0:
                    report.status = "PASS"
                    report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} has backtrack enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_copy_tags_to_snapshots.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_copy_tags_to_snapshots/rds_cluster_copy_tags_to_snapshots.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_copy_tags_to_snapshots",
  "CheckTitle": "Check if RDS DB clusters have copy tags to snapshots enabled",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-cluster",
  "Severity": "low",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Check if RDS DB clusters have copy tags to snapshots enabled, Aurora instances do not support this feature at instance level so those who are clustered will be scan by this check.",
  "Risk": "If RDS clusters are not configured to copy tags to snapshots, it could lead to compliance issues as the snapshots will not inherit necessary metadata such as environment, owner, or purpose tags. This could result in inefficient tracking and management of RDS resources and their snapshots.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Tagging.html#USER_Tagging.CopyTags",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-cluster --db-cluster-identifier <cluster-identifier> --copy-tags-to-snapshot",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-16",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that the `CopyTagsToSnapshot` setting is enabled for all RDS clusters to propagate cluster tags to their snapshots for improved tracking and compliance.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Tagging.html#USER_Tagging.CopyTags"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_copy_tags_to_snapshots.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_copy_tags_to_snapshots/rds_cluster_copy_tags_to_snapshots.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_copy_tags_to_snapshots(Check):
    def execute(self):
        findings = []
        for db_cluster in rds_client.db_clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_cluster)
            if db_cluster.copy_tags_to_snapshot:
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Cluster {db_cluster.id} has copy tags to snapshots enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = f"RDS Cluster {db_cluster.id} does not have copy tags to snapshots enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_critical_event_subscription.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_critical_event_subscription/rds_cluster_critical_event_subscription.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_critical_event_subscription",
  "CheckTitle": "Check if RDS Cluster critical events are subscribed.",
  "CheckType": [
    "Software and Configuration Checks, AWS Security Best Practices"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:account",
  "Severity": "low",
  "ResourceType": "AwsAccount",
  "Description": "Ensure that Amazon RDS event notification subscriptions are enabled for database cluster events, particularly maintenance and failure.",
  "Risk": "Without event subscriptions for critical events, such as maintenance and failures, you may not be aware of issues affecting your RDS clusters, leading to downtime or security vulnerabilities.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds create-event-subscription --source-type db-cluster --event-categories 'failure' 'maintenance' --sns-topic-arn <sns-topic-arn>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-19",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To subscribe to RDS cluster event notifications, see Subscribing to Amazon RDS event notification in the Amazon RDS User Guide.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.Subscribing.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
