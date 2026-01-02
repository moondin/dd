---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 312
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 312 of 867)

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

---[FILE: rds_snapshots_public_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_snapshots_public_access/rds_snapshots_public_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_snapshots_public_access",
  "CheckTitle": "Check if RDS Snapshots and Cluster Snapshots are public.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:snapshot",
  "Severity": "critical",
  "ResourceType": "AwsRdsDbSnapshot",
  "Description": "Check if RDS Snapshots and Cluster Snapshots are public.",
  "Risk": "Publicly accessible services could expose sensitive data to bad actors. t is recommended that your RDS snapshots should not be public in order to prevent potential leak or misuse of sensitive data or any other kind of security threat. If your RDS snapshot is public, then the data which is backed up in that snapshot is accessible to all other AWS accounts.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/rds-snapshots-public-prohibited.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-snapshot-attribute --db-snapshot-identifier <snapshot_id> --attribute-name restore --values-to-remove all",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/public-snapshots.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use AWS Config to identify any snapshot that is public.",
      "Url": "https://docs.aws.amazon.com/config/latest/developerguide/rds-snapshots-public-prohibited.html"
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

---[FILE: rds_snapshots_public_access.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_snapshots_public_access/rds_snapshots_public_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_snapshots_public_access(Check):
    def execute(self):
        findings = []
        for db_snap in rds_client.db_snapshots:
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_snap)
            if db_snap.public:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS Instance Snapshot {db_snap.id} is public."
                )
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Instance Snapshot {db_snap.id} is not shared."
                )

            findings.append(report)

        for db_snap in rds_client.db_cluster_snapshots:
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_snap)
            if db_snap.public:
                report.status = "FAIL"
                report.status_extended = f"RDS Cluster Snapshot {db_snap.id} is public."
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Cluster Snapshot {db_snap.id} is not shared."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_snapshots_public_access_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_snapshots_public_access/rds_snapshots_public_access_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.rds.rds_client import rds_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the attributes of an RDS DB snapshot or DB cluster snapshot to remove public access.
    Specifically, this fixer removes the 'all' value from the 'restore' attribute to prevent the snapshot from being publicly accessible
    for both DB snapshots and DB cluster snapshots. Requires the rds:ModifyDBSnapshotAttribute or rds:ModifyDBClusterSnapshotAttribute permissions.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "rds:ModifyDBSnapshotAttribute",
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": "rds:ModifyDBClusterSnapshotAttribute",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The DB snapshot or DB cluster snapshot identifier.
        region (str): AWS region where the snapshot exists.
    Returns:
        bool: True if the operation is successful (public access is removed), False otherwise.
    """
    try:
        regional_client = rds_client.regional_clients[region]

        # Check if the resource is a DB Cluster Snapshot or a DB Instance Snapshot
        try:
            regional_client.describe_db_cluster_snapshots(
                DBClusterSnapshotIdentifier=resource_id
            )
            # If the describe call is successful, it's a DB cluster snapshot
            regional_client.modify_db_cluster_snapshot_attribute(
                DBClusterSnapshotIdentifier=resource_id,
                AttributeName="restore",
                ValuesToRemove=["all"],
            )
        except regional_client.exceptions.DBClusterSnapshotNotFoundFault:
            # If the DB cluster snapshot doesn't exist, it's an instance snapshot
            regional_client.modify_db_snapshot_attribute(
                DBSnapshotIdentifier=resource_id,
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

---[FILE: redshift_client.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_client.py

```python
from prowler.providers.aws.services.redshift.redshift_service import Redshift
from prowler.providers.common.provider import Provider

redshift_client = Redshift(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: redshift_service.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Redshift(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.clusters = []
        self.__threading_call__(self._describe_clusters)
        self.__threading_call__(self._describe_logging_status, self.clusters)
        self.__threading_call__(self._describe_cluster_snapshots, self.clusters)
        self.__threading_call__(self._describe_cluster_parameters, self.clusters)
        self.__threading_call__(self._describe_cluster_subnets, self.clusters)

    def _describe_clusters(self, regional_client):
        logger.info("Redshift - Describing Clusters...")
        try:
            list_clusters_paginator = regional_client.get_paginator("describe_clusters")
            for page in list_clusters_paginator.paginate():
                for cluster in page["Clusters"]:
                    arn = f"arn:{self.audited_partition}:redshift:{regional_client.region}:{self.audited_account}:cluster:{cluster['ClusterIdentifier']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        cluster_to_append = Cluster(
                            arn=arn,
                            id=cluster["ClusterIdentifier"],
                            vpc_id=cluster.get("VpcId"),
                            vpc_security_groups=[
                                sg["VpcSecurityGroupId"]
                                for sg in cluster.get("VpcSecurityGroups")
                                if sg["Status"] == "active"
                            ],
                            endpoint_address=cluster.get("Endpoint", {}).get(
                                "Address", ""
                            ),
                            public_access=cluster.get("PubliclyAccessible", False),
                            allow_version_upgrade=cluster.get(
                                "AllowVersionUpgrade", False
                            ),
                            encrypted=cluster.get("Encrypted", False),
                            multi_az=cluster.get("MultiAZ", ""),
                            region=regional_client.region,
                            tags=cluster.get("Tags"),
                            master_username=cluster.get("MasterUsername", ""),
                            enhanced_vpc_routing=cluster.get(
                                "EnhancedVpcRouting", False
                            ),
                            database_name=cluster.get("DBName", ""),
                            parameter_group_name=cluster.get(
                                "ClusterParameterGroups", [{}]
                            )[0].get("ParameterGroupName", ""),
                            subnet_group=cluster.get("ClusterSubnetGroupName", ""),
                        )
                        self.clusters.append(cluster_to_append)
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_cluster_subnets(self, cluster):
        logger.info("Redshift - Describing Cluster Subnets...")
        try:
            regional_client = self.regional_clients[cluster.region]
            if cluster.subnet_group:
                subnet_group_details = regional_client.describe_cluster_subnet_groups(
                    ClusterSubnetGroupName=cluster.subnet_group
                )
                subnets = [
                    subnet["SubnetIdentifier"]
                    for subnet in subnet_group_details["ClusterSubnetGroups"][0][
                        "Subnets"
                    ]
                ]
                cluster.subnets = subnets
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_logging_status(self, cluster):
        logger.info("Redshift - Describing Logging Status...")
        try:
            regional_client = self.regional_clients[cluster.region]
            cluster_attributes = regional_client.describe_logging_status(
                ClusterIdentifier=cluster.id
            )
            if (
                "LoggingEnabled" in cluster_attributes
                and cluster_attributes["LoggingEnabled"]
            ):
                cluster.logging_enabled = True
            if "BucketName" in cluster_attributes:
                cluster.bucket = cluster_attributes["BucketName"]

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_cluster_snapshots(self, cluster):
        logger.info("Redshift - Describing Cluster Status...")
        try:
            regional_client = self.regional_clients[cluster.region]
            cluster_snapshots = regional_client.describe_cluster_snapshots(
                ClusterIdentifier=cluster.id
            )
            if "Snapshots" in cluster_snapshots and cluster_snapshots["Snapshots"]:
                cluster.cluster_snapshots = True

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_cluster_parameters(self, cluster):
        logger.info("Redshift - Describing Cluster Parameter Groups...")
        try:
            regional_client = self.regional_clients[cluster.region]
            cluster_parameter_groups = regional_client.describe_cluster_parameters(
                ParameterGroupName=cluster.parameter_group_name
            )
            for parameter_group in cluster_parameter_groups["Parameters"]:
                if parameter_group["ParameterName"].lower() == "require_ssl":
                    if parameter_group["ParameterValue"].lower() == "true":
                        cluster.require_ssl = True

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Cluster(BaseModel):
    id: str
    arn: str
    region: str
    vpc_id: str = None
    vpc_security_groups: list = []
    public_access: bool = False
    encrypted: bool = False
    multi_az: str = None
    master_username: str = None
    database_name: str = None
    endpoint_address: str = None
    allow_version_upgrade: bool = False
    logging_enabled: bool = False
    bucket: str = None
    cluster_snapshots: bool = False
    tags: Optional[list] = []
    enhanced_vpc_routing: bool = False
    parameter_group_name: str = None
    require_ssl: bool = False
    subnet_group: str = None
    subnets: list[str] = []
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_audit_logging.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_audit_logging/redshift_cluster_audit_logging.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "redshift_cluster_audit_logging",
  "CheckTitle": "Check if Redshift cluster has audit logging enabled",
  "CheckType": [],
  "ServiceName": "redshift",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:redshift:region:account-id:cluster:cluster-name",
  "Severity": "medium",
  "ResourceType": "AwsRedshiftCluster",
  "Description": "Check if Redshift cluster has audit logging enabled",
  "Risk": "If logs are not enabled, monitoring of service use and threat analysis is not possible.",
  "RelatedUrl": "https://docs.aws.amazon.com/redshift/latest/mgmt/db-auditing.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/aws/logging-policies/bc_aws_logging_12#cloudformation",
      "Other": "https://docs.prowler.com/checks/aws/logging-policies/bc_aws_logging_12",
      "Terraform": "https://docs.prowler.com/checks/aws/logging-policies/bc_aws_logging_12#terraform"
    },
    "Recommendation": {
      "Text": "Enable logs. Create an S3 lifecycle policy. Define use cases, metrics and automated responses where applicable.",
      "Url": "https://docs.aws.amazon.com/redshift/latest/mgmt/db-auditing.html"
    }
  },
  "Categories": [
    "forensics-ready",
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_audit_logging.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_audit_logging/redshift_cluster_audit_logging.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.redshift.redshift_client import redshift_client


class redshift_cluster_audit_logging(Check):
    def execute(self):
        findings = []
        for cluster in redshift_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = (
                f"Redshift Cluster {cluster.id} has audit logging enabled."
            )
            if not cluster.logging_enabled:
                report.status = "FAIL"
                report.status_extended = (
                    f"Redshift Cluster {cluster.id} has audit logging disabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_automated_snapshot.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_automated_snapshot/redshift_cluster_automated_snapshot.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "redshift_cluster_automated_snapshot",
  "CheckTitle": "Check if Redshift Clusters have automated snapshots enabled",
  "CheckType": [],
  "ServiceName": "redshift",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:redshift:region:account-id:cluster:cluster-name",
  "Severity": "medium",
  "ResourceType": "AwsRedshiftCluster",
  "Description": "Check if Redshift Clusters have automated snapshots enabled",
  "Risk": "If backup is not enabled, data is vulnerable. Human error or bad actors could erase or modify data.",
  "RelatedUrl": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Redshift.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable automated backup for production data. Define a retention period and periodically test backup restoration. A Disaster Recovery process should be in place to govern Data Protection approach",
      "Url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Redshift.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_automated_snapshot.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_automated_snapshot/redshift_cluster_automated_snapshot.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.redshift.redshift_client import redshift_client


class redshift_cluster_automated_snapshot(Check):
    def execute(self):
        findings = []
        for cluster in redshift_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = (
                f"Redshift Cluster {cluster.id} has automated snapshots enabled."
            )
            if not cluster.cluster_snapshots:
                report.status = "FAIL"
                report.status_extended = (
                    f"Redshift Cluster {cluster.id} has automated snapshots disabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_automatic_upgrades.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_automatic_upgrades/redshift_cluster_automatic_upgrades.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "redshift_cluster_automatic_upgrades",
  "CheckTitle": "Check for Redshift Automatic Version Upgrade",
  "CheckType": [],
  "ServiceName": "redshift",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:redshift:region:account-id:cluster:cluster-name",
  "Severity": "high",
  "ResourceType": "AwsRedshiftCluster",
  "Description": "Check for Redshift Automatic Version Upgrade",
  "Risk": "Without automatic version upgrade enabled, a critical Redshift Cluster version can become severly out of date",
  "RelatedUrl": "https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-operations.html",
  "Remediation": {
    "Code": {
      "CLI": "aws redshift modify-cluster --cluster-identifier <cluster_id> --allow-version-upgrade",
      "NativeIaC": "https://docs.prowler.com/checks/aws/public-policies/public_9#cloudformation",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/ensure-that-redshift-clusters-allow-version-upgrade-by-default#terraform"
    },
    "Recommendation": {
      "Text": "Enabled AutomaticVersionUpgrade on Redshift Cluster",
      "Url": "https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-operations.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_automatic_upgrades.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_automatic_upgrades/redshift_cluster_automatic_upgrades.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.redshift.redshift_client import redshift_client


class redshift_cluster_automatic_upgrades(Check):
    def execute(self):
        findings = []
        for cluster in redshift_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = (
                f"Redshift Cluster {cluster.id} has AllowVersionUpgrade enabled."
            )
            if not cluster.allow_version_upgrade:
                report.status = "FAIL"
                report.status_extended = (
                    f"Redshift Cluster {cluster.id} has AllowVersionUpgrade disabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_encrypted_at_rest.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_encrypted_at_rest/redshift_cluster_encrypted_at_rest.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "redshift_cluster_encrypted_at_rest",
  "CheckTitle": "Check if Redshift clusters are encrypted at rest.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "redshift",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:redshift:region:account-id:cluster/cluster-name",
  "Severity": "medium",
  "ResourceType": "AwsRedshiftCluster",
  "Description": "This control checks whether Amazon Redshift clusters are encrypted at rest. The control fails if a Redshift cluster isn't encrypted at rest.",
  "Risk": "Without encryption at rest, sensitive data stored in Redshift clusters is vulnerable to unauthorized access, which could lead to data breaches and regulatory non-compliance.",
  "RelatedUrl": "https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-db-encryption.html",
  "Remediation": {
    "Code": {
      "CLI": "aws redshift modify-cluster --cluster-identifier <cluster-id> --encrypted --kms-key-id <key-id>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/redshift-controls.html#redshift-10",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable encryption at rest for your Redshift clusters using KMS to protect sensitive data from unauthorized access.",
      "Url": "https://docs.aws.amazon.com/redshift/latest/mgmt/changing-cluster-encryption.html"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_encrypted_at_rest.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_encrypted_at_rest/redshift_cluster_encrypted_at_rest.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.redshift.redshift_client import redshift_client


class redshift_cluster_encrypted_at_rest(Check):
    def execute(self):
        findings = []
        for cluster in redshift_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = (
                f"Redshift Cluster {cluster.id} is not encrypted at rest."
            )
            if cluster.encrypted:
                report.status = "PASS"
                report.status_extended = (
                    f"Redshift Cluster {cluster.id} is encrypted at rest."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_enhanced_vpc_routing.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_enhanced_vpc_routing/redshift_cluster_enhanced_vpc_routing.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "redshift_cluster_enhanced_vpc_routing",
  "CheckTitle": "Check if Redshift clusters are using enhanced VPC routing.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "redshift",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:redshift:region:account-id:cluster/cluster-name",
  "Severity": "medium",
  "ResourceType": "AwsRedshiftCluster",
  "Description": "This control checks whether an Amazon Redshift cluster has EnhancedVpcRouting enabled. Enhanced VPC routing forces all COPY and UNLOAD traffic between the cluster and data repositories to go through your VPC, allowing you to use VPC security features such as security groups and network access control lists.",
  "Risk": "Without enhanced VPC routing, network traffic between the Redshift cluster and data repositories might bypass VPC-level security controls, increasing the risk of unauthorized access or data exfiltration.",
  "RelatedUrl": "https://docs.aws.amazon.com/redshift/latest/mgmt/enhanced-vpc-enabling-cluster.html",
  "Remediation": {
    "Code": {
      "CLI": "aws redshift modify-cluster --cluster-identifier <cluster-id> --enhanced-vpc-routing",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/redshift-controls.html#redshift-7",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable enhanced VPC routing for your Redshift clusters to enforce network traffic through your VPC and apply additional security controls.",
      "Url": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Redshift/enable-enhanced-vpc-routing.html"
    }
  },
  "Categories": [
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_enhanced_vpc_routing.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_enhanced_vpc_routing/redshift_cluster_enhanced_vpc_routing.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.redshift.redshift_client import redshift_client


class redshift_cluster_enhanced_vpc_routing(Check):
    def execute(self):
        findings = []
        for cluster in redshift_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"Redshift Cluster {cluster.id} does not have Enhanced VPC Routing security feature enabled."
            if cluster.enhanced_vpc_routing:
                report.status = "PASS"
                report.status_extended = f"Redshift Cluster {cluster.id} has Enhanced VPC Routing security feature enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_in_transit_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_in_transit_encryption_enabled/redshift_cluster_in_transit_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "redshift_cluster_in_transit_encryption_enabled",
  "CheckTitle": "Check if connections to Amazon Redshift clusters are encrypted in transit.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "redshift",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:redshift:region:account-id:cluster/cluster-name",
  "Severity": "medium",
  "ResourceType": "AwsRedshiftCluster",
  "Description": "This control checks whether connections to Amazon Redshift clusters are required to use encryption in transit. The control fails if the Redshift cluster parameter 'require_SSL' isn't set to True.",
  "Risk": "Without encryption in transit, connections to the Redshift cluster are vulnerable to eavesdropping or person-in-the-middle attacks, exposing sensitive data to unauthorized access.",
  "RelatedUrl": "https://docs.aws.amazon.com/redshift/latest/mgmt/security-encryption-in-transit.html",
  "Remediation": {
    "Code": {
      "CLI": "aws redshift modify-cluster-parameter-group --parameter-group-name <group-name> --parameters ParameterName=require_ssl,ParameterValue=true,ApplyType=static",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/redshift-controls.html#redshift-2",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that connections to Amazon Redshift clusters use encryption in transit by setting the 'require_ssl' parameter to True.",
      "Url": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Redshift/redshift-parameter-groups-require-ssl.html"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_in_transit_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_in_transit_encryption_enabled/redshift_cluster_in_transit_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.redshift.redshift_client import redshift_client


class redshift_cluster_in_transit_encryption_enabled(Check):
    def execute(self):
        findings = []
        for cluster in redshift_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = (
                f"Redshift Cluster {cluster.id} is not encrypted in transit."
            )
            if cluster.require_ssl:
                report.status = "PASS"
                report.status_extended = (
                    f"Redshift Cluster {cluster.id} is encrypted in transit."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_multi_az_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_multi_az_enabled/redshift_cluster_multi_az_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "redshift_cluster_multi_az_enabled",
  "CheckTitle": "Check if Redshift clusters have Multi-AZ enabled.",
  "CheckType": [],
  "ServiceName": "redshift",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:redshift:region:account-id:cluster/cluster-name",
  "Severity": "medium",
  "ResourceType": "AwsRedshiftCluster",
  "Description": "This control checks whether Amazon Redshift clusters have Multi-AZ enabled.",
  "Risk": "Amazon Redshift supports multiple Availability Zones (Multi-AZ) deployments for provisioned RA3 clusters. By using Multi-AZ deployments, your Amazon Redshift data warehouse can continue operating in failure scenarios when an unexpected event happens in an Availability Zone.",
  "RelatedUrl": "https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-multi-az.html",
  "Remediation": {
    "Code": {
      "CLI": "aws redshift modify-cluster --cluster-identifier <cluster-id> --multi-az",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure Amazon Redshift with Multi-AZ deployments.",
      "Url": "https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-multi-az.html"
    }
  },
  "Categories": [
    "redundancy"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_multi_az_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_multi_az_enabled/redshift_cluster_multi_az_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.redshift.redshift_client import redshift_client


class redshift_cluster_multi_az_enabled(Check):
    def execute(self):
        findings = []
        for cluster in redshift_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = (
                f"Redshift Cluster {cluster.id} does not have Multi-AZ enabled."
            )
            if cluster.multi_az == "Enabled":
                report.status = "PASS"
                report.status_extended = (
                    f"Redshift Cluster {cluster.id} has Multi-AZ enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_non_default_database_name.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_non_default_database_name/redshift_cluster_non_default_database_name.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "redshift_cluster_non_default_database_name",
  "CheckTitle": "Check if Redshift clusters are using the default database name.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "redshift",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:redshift:region:account-id:cluster/cluster-name",
  "Severity": "medium",
  "ResourceType": "AwsRedshiftCluster",
  "Description": "This control checks whether an Amazon Redshift cluster has changed the database name from its default value. The control fails if the database name is set to 'dev'.",
  "Risk": "Using the default database name 'dev' increases the risk of unintended access, as it is publicly known and could be used in IAM policy conditions to inadvertently allow access.",
  "RelatedUrl": "https://docs.aws.amazon.com/redshift/latest/gsg/getting-started.html",
  "Remediation": {
    "Code": {
      "CLI": "aws redshift create-cluster --cluster-identifier <cluster-id> --db-name <new-db-name>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/redshift-controls.html#redshift-9",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create a new Redshift cluster with a unique database name to replace the default 'dev' database name.",
      "Url": "https://docs.aws.amazon.com/redshift/latest/gsg/getting-started.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_non_default_database_name.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_non_default_database_name/redshift_cluster_non_default_database_name.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.redshift.redshift_client import redshift_client


class redshift_cluster_non_default_database_name(Check):
    def execute(self):
        findings = []
        for cluster in redshift_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = f"Redshift Cluster {cluster.id} does not have the default database name."
            if cluster.database_name == "dev":
                report.status = "FAIL"
                report.status_extended = f"Redshift Cluster {cluster.id} has the default database name: {cluster.database_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_non_default_username.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_non_default_username/redshift_cluster_non_default_username.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "redshift_cluster_non_default_username",
  "CheckTitle": "Check if Amazon Redshift clusters are using the default Admin username.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "redshift",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:redshift:region:account-id:cluster/cluster-name",
  "Severity": "medium",
  "ResourceType": "AwsRedshiftCluster",
  "Description": "This control checks whether an Amazon Redshift cluster has changed the admin username from its default value. The control fails if the admin username is set to 'awsuser'.",
  "Risk": "Using the default admin username increases the risk of unauthorized access, as default credentials are publicly known and often targeted by attackers.",
  "RelatedUrl": "https://docs.aws.amazon.com/redshift/latest/gsg/rs-gsg-prereq.html",
  "Remediation": {
    "Code": {
      "CLI": "aws redshift create-cluster --cluster-identifier <cluster-id> --master-username <new-username> --master-user-password <password>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/redshift-controls.html#redshift-8",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Change the default admin username by creating a new Redshift cluster with a unique admin username.",
      "Url": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Redshift/master-username.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_non_default_username.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_non_default_username/redshift_cluster_non_default_username.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.redshift.redshift_client import redshift_client


class redshift_cluster_non_default_username(Check):
    def execute(self):
        findings = []
        for cluster in redshift_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = f"Redshift Cluster {cluster.id} does not have the default Admin username."
            if cluster.master_username == "awsuser":
                report.status = "FAIL"
                report.status_extended = (
                    f"Redshift Cluster {cluster.id} has the default Admin username."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
