---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 264
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 264 of 867)

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

---[FILE: documentdb_cluster_storage_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_storage_encrypted/documentdb_cluster_storage_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "documentdb_cluster_storage_encrypted",
  "CheckTitle": "DocumentDB cluster storage is encrypted at rest",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Software and Configuration Checks/Industry and Regulatory Standards/HIPAA Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/ISO 27001 Controls",
    "Effects/Data Exposure"
  ],
  "ServiceName": "documentdb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "**Amazon DocumentDB clusters** are assessed for **storage encryption at rest** via the cluster's `encrypted` setting.\n\nIt identifies clusters where data volumes, automated backups, and snapshots aren't protected by AWS KMS-managed encryption.",
  "Risk": "Without at-rest encryption, cluster data, snapshots, and backups can be read in plaintext if copies are leaked, mis-shared, or underlying storage is accessed. This harms **confidentiality**, enables offline analysis and data exfiltration, and widens the blast radius of insider or backup repository compromise.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/documentdb-controls.html#documentdb-1",
    "https://docs.aws.amazon.com/documentdb/latest/developerguide/elastic-encryption.html",
    "https://docs.aws.amazon.com/documentdb/latest/developerguide/encryption-at-rest.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws docdb create-db-cluster --db-cluster-identifier <DB_CLUSTER_ID> --engine docdb --master-username <MASTER_USERNAME> --master-user-password <MASTER_PASSWORD> --storage-encrypted",
      "NativeIaC": "```yaml\n# CloudFormation: Create an encrypted DocumentDB cluster\nResources:\n  <example_resource_name>:\n    Type: AWS::DocDB::DBCluster\n    Properties:\n      Engine: docdb\n      MasterUsername: <MASTER_USERNAME>\n      MasterUserPassword: <MASTER_PASSWORD>\n      StorageEncrypted: true  # Critical: enables encryption at rest to pass the check\n```",
      "Other": "1. In the AWS Console, go to Amazon DocumentDB\n2. Click Create cluster\n3. Expand Show advanced settings\n4. In Encryption-at-rest, select Enable encryption\n5. Choose or keep the default KMS key\n6. Click Create cluster\n\nTo replace an existing unencrypted cluster:\n1. Select the unencrypted cluster > Actions > Take snapshot\n2. After the snapshot completes, select it > Actions > Restore snapshot\n3. In Encryption-at-rest, select Enable encryption and restore as a new cluster\n4. Update your applications to use the new cluster endpoint",
      "Terraform": "```hcl\n# Terraform: Encrypted DocumentDB cluster\nresource \"aws_docdb_cluster\" \"<example_resource_name>\" {\n  master_username   = \"<MASTER_USERNAME>\"\n  master_password   = \"<MASTER_PASSWORD>\"\n  storage_encrypted = true  # Critical: enables encryption at rest to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **storage encryption at rest** for all DocumentDB clusters and prefer **customer-managed KMS keys** for control over access, rotation, and revocation. Apply **least privilege** to key usage, enforce **separation of duties**, and monitor key and snapshot access. *If a cluster isn't encrypted*, migrate to a new encrypted cluster.",
      "Url": "https://hub.prowler.com/check/documentdb_cluster_storage_encrypted"
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

---[FILE: documentdb_cluster_storage_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/documentdb/documentdb_cluster_storage_encrypted/documentdb_cluster_storage_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.documentdb.documentdb_client import (
    documentdb_client,
)


class documentdb_cluster_storage_encrypted(Check):
    def execute(self):
        findings = []
        for db_cluster in documentdb_client.db_clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_cluster)
            if db_cluster.encrypted:
                report.status = "PASS"
                report.status_extended = (
                    f"DocumentDB Cluster {db_cluster.id} is encrypted at rest."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"DocumentDB Cluster {db_cluster.id} is not encrypted at rest."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: drs_client.py]---
Location: prowler-master/prowler/providers/aws/services/drs/drs_client.py

```python
from prowler.providers.aws.services.drs.drs_service import DRS
from prowler.providers.common.provider import Provider

drs_client = DRS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: drs_service.py]---
Location: prowler-master/prowler/providers/aws/services/drs/drs_service.py
Signals: Pydantic

```python
from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class DRS(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.drs_services = []
        self.__threading_call__(self._describe_jobs)

    def _get_recovery_job_arn_template(self, region):
        return f"arn:{self.audited_partition}:drs:{region}:{self.audited_account}:recovery-job"

    def _describe_jobs(self, regional_client):
        logger.info("DRS - Describe Jobs...")
        try:
            try:
                describe_jobs_paginator = regional_client.get_paginator("describe_jobs")
                for page in describe_jobs_paginator.paginate():
                    drs_jobs = []
                    for drs_job in page["items"]:
                        if not self.audit_resources or (
                            is_resource_filtered(drs_job["arn"], self.audit_resources)
                        ):
                            job = Job(
                                arn=drs_job.get("arn"),
                                id=drs_job.get("jobID"),
                                region=regional_client.region,
                                status=drs_job.get("status"),
                                tags=[drs_job.get("tags")],
                            )
                            drs_jobs.append(job)
                    self.drs_services.append(
                        DRSservice(
                            id="DRS",
                            status="ENABLED",
                            region=regional_client.region,
                            jobs=drs_jobs,
                        )
                    )
            except ClientError as error:
                if error.response["Error"]["Code"] == "UninitializedAccountException":
                    self.drs_services.append(
                        DRSservice(
                            id="DRS", status="DISABLED", region=regional_client.region
                        )
                    )
                else:
                    logger.error(
                        f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )


class Job(BaseModel):
    arn: str
    id: str
    status: str
    region: str
    tags: list = []


class DRSservice(BaseModel):
    id: str
    status: str
    region: str
    jobs: list[Job] = []
```

--------------------------------------------------------------------------------

---[FILE: drs_job_exist.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/drs/drs_job_exist/drs_job_exist.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "drs_job_exist",
  "CheckTitle": "Region has AWS Elastic Disaster Recovery (DRS) enabled with at least one recovery job",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "drs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Elastic Disaster Recovery** is assessed per Region to verify the service is **initialized** and that at least one **recovery or drill job** exists, demonstrating that failover has been exercised.",
  "Risk": "Without DRS enabled or any prior jobs, workloads are **unprotected and untested**, undermining **availability**.\nDuring outages or ransomware, recovery may be delayed or fail, increasing RTO/RPO, causing **data loss** and prolonged downtime.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/blogs/storage/cross-region-disaster-recovery-using-aws-elastic-disaster-recovery/",
    "https://docs.aws.amazon.com/drs/latest/userguide/quick-start-guide-gs.html",
    "https://aws.amazon.com/disaster-recovery/",
    "https://docs.aws.amazon.com/drs/latest/userguide/recovery-job.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. In the AWS Console, switch to the target Region\n2. Open Elastic Disaster Recovery (DRS)\n3. Click \"Set default replication settings\" (or Settings > Initialize) and choose \"Configure and initialize\" to enable DRS in this Region\n4. Go to \"Source servers\" > \"Add server\", copy the install command, run it on one server, and wait until it shows Data replication status = Healthy and Ready for recovery\n5. Select that server, choose \"Initiate recovery drill\" (or \"Initiate recovery\") and confirm to create a job\n6. Verify under \"Recovery job history\" that the job completes",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable DRS in required Regions and protect critical workloads. Define RTO/RPO and run **regular recovery drills** to validate launch settings and dependencies. Apply **least privilege**, monitor replication health, and document failover procedures to ensure consistent, repeatable recovery.",
      "Url": "https://hub.prowler.com/check/drs_job_exist"
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

---[FILE: drs_job_exist.py]---
Location: prowler-master/prowler/providers/aws/services/drs/drs_job_exist/drs_job_exist.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.drs.drs_client import drs_client


class drs_job_exist(Check):
    def execute(self):
        findings = []
        for drs in drs_client.drs_services:
            report = Check_Report_AWS(metadata=self.metadata(), resource=drs)
            report.resource_arn = drs_client._get_recovery_job_arn_template(drs.region)
            report.resource_id = drs_client.audited_account
            report.status = "FAIL"
            report.status_extended = "DRS is not enabled for this region."

            if drs.status == "ENABLED":
                report.status_extended = "DRS is enabled for this region without jobs."
                if drs.jobs:
                    report.status = "PASS"
                    report.status_extended = "DRS is enabled for this region with jobs."

            if report.status == "FAIL" and (
                drs_client.audit_config.get("mute_non_default_regions", False)
                and not drs.region == drs_client.region
            ):
                report.muted = True

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dax_client.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dax_client.py

```python
from prowler.providers.aws.services.dynamodb.dynamodb_service import DAX
from prowler.providers.common.provider import Provider

dax_client = DAX(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_client.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_client.py

```python
from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB
from prowler.providers.common.provider import Provider

dynamodb_client = DynamoDB(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_service.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_service.py
Signals: Pydantic

```python
import json
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class DynamoDB(AWSService):
    def __init__(self, provider):
        super().__init__(__class__.__name__, provider)
        self.tables = {}
        self.__threading_call__(self._list_tables)
        self._describe_table()
        self._describe_continuous_backups()
        self._get_resource_policy()
        self._list_tags_for_resource()

    def _list_tables(self, regional_client):
        logger.info("DynamoDB - Listing tables...")
        try:
            list_tables_paginator = regional_client.get_paginator("list_tables")
            for page in list_tables_paginator.paginate():
                for table in page["TableNames"]:
                    arn = f"arn:{self.audited_partition}:dynamodb:{regional_client.region}:{self.audited_account}:table/{table}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.tables[arn] = Table(
                            arn=arn,
                            name=table,
                            encryption_type=None,
                            kms_arn=None,
                            region=regional_client.region,
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_table(self):
        logger.info("DynamoDB - Describing Table...")
        try:
            for table in self.tables.values():
                regional_client = self.regional_clients[table.region]
                properties = regional_client.describe_table(TableName=table.name)[
                    "Table"
                ]
                table.billing_mode = properties.get("BillingModeSummary", {}).get(
                    "BillingMode", "PROVISIONED"
                )
                if "SSEDescription" in properties:
                    if "SSEType" in properties["SSEDescription"]:
                        table.encryption_type = properties["SSEDescription"]["SSEType"]
                if table.encryption_type == "KMS":
                    table.kms_arn = properties["SSEDescription"]["KMSMasterKeyArn"]

                table.deletion_protection = properties.get(
                    "DeletionProtectionEnabled", False
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _describe_continuous_backups(self):
        logger.info("DynamoDB - Describing Continuous Backups...")
        try:
            for table in self.tables.values():
                try:
                    regional_client = self.regional_clients[table.region]
                    properties = regional_client.describe_continuous_backups(
                        TableName=table.name
                    )["ContinuousBackupsDescription"]
                    if "PointInTimeRecoveryDescription" in properties:
                        if (
                            properties["PointInTimeRecoveryDescription"][
                                "PointInTimeRecoveryStatus"
                            ]
                            == "ENABLED"
                        ):
                            table.pitr = True
                except ClientError as error:
                    if error.response["Error"]["Code"] == "TableNotFoundException":
                        logger.warning(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                    else:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                    continue
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _get_resource_policy(self):
        logger.info("DynamoDB - Get Resource Policy...")
        try:
            for table_arn, table in self.tables.items():
                try:
                    regional_client = self.regional_clients[table.region]
                    response = regional_client.get_resource_policy(
                        ResourceArn=table_arn
                    )
                    table.policy = json.loads(response["Policy"])
                except ClientError as error:
                    if error.response["Error"]["Code"] == "ResourceNotFoundException":
                        logger.warning(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                    elif error.response["Error"]["Code"] == "PolicyNotFoundException":
                        logger.warning(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                    else:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                    continue
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("DynamoDB - List Tags...")
        try:
            for table_arn, table in self.tables.items():
                try:
                    regional_client = self.regional_clients[table.region]
                    response = regional_client.list_tags_of_resource(
                        ResourceArn=table_arn
                    )["Tags"]
                    table.tags = response
                except ClientError as error:
                    if error.response["Error"]["Code"] == "ResourceNotFoundException":
                        logger.warning(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                    else:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                    continue
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class DAX(AWSService):
    def __init__(self, provider):
        super().__init__(__class__.__name__, provider)
        self.clusters = []
        self.__threading_call__(self._describe_clusters)
        self._list_tags_for_resource()

    def _describe_clusters(self, regional_client):
        logger.info("DynamoDB DAX - Describing clusters...")
        try:
            describe_clusters_paginator = regional_client.get_paginator(
                "describe_clusters"
            )
            for page in describe_clusters_paginator.paginate():
                for cluster in page["Clusters"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            cluster["ClusterArn"], self.audit_resources
                        )
                    ):
                        encryption = False
                        tls_encryption = False
                        if "SSEDescription" in cluster:
                            if cluster["SSEDescription"]["Status"] == "ENABLED":
                                encryption = True
                        if "ClusterEndpointEncryptionType" in cluster:
                            if cluster["ClusterEndpointEncryptionType"] == "TLS":
                                tls_encryption = True
                        self.clusters.append(
                            Cluster(
                                arn=cluster["ClusterArn"],
                                name=cluster["ClusterName"],
                                encryption=encryption,
                                node_azs=[
                                    node["AvailabilityZone"]
                                    for node in cluster.get("Nodes", {})
                                ],
                                region=regional_client.region,
                                tls_encryption=tls_encryption,
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("DAX - List Tags...")
        for cluster in self.clusters:
            try:
                regional_client = self.regional_clients[cluster.region]
                # In the DAX service to call list_tags we need to pass the cluster ARN as the resource name
                response = regional_client.list_tags(ResourceName=cluster.arn)["Tags"]
                cluster.tags = response

            except ClientError as error:
                if error.response["Error"]["Code"] == "InvalidARNFault":
                    logger.warning(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                    continue

            except Exception as error:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class Table(BaseModel):
    arn: str
    name: str
    billing_mode: str = "PROVISIONED"
    encryption_type: Optional[str]
    kms_arn: Optional[str]
    pitr: bool = False
    policy: Optional[dict] = None
    region: str
    tags: Optional[list] = []
    deletion_protection: bool = False


class Cluster(BaseModel):
    arn: str
    name: str
    encryption: bool
    node_azs: Optional[list] = []
    region: str
    tags: Optional[list] = []
    tls_encryption: bool
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_accelerator_cluster_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_accelerator_cluster_encryption_enabled/dynamodb_accelerator_cluster_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dynamodb_accelerator_cluster_encryption_enabled",
  "CheckTitle": "DynamoDB DAX cluster has encryption at rest enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "dynamodb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Amazon DynamoDB Accelerator (DAX) clusters** are evaluated for **server-side `encryption at rest`**. The finding indicates whether the cluster's on-disk cache, configuration, and logs are encrypted using service-managed keys.",
  "Risk": "Without **encryption at rest**, DAX on-disk cache and logs can be extracted from underlying storage by those with low-level access, compromising **confidentiality** and enabling offline data mining.\n\nThreats:\n- Compromised host or admin\n- Lost/retired media\n- Unauthorized backups or snapshots",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAXEncryptionAtRest.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/DAX/encryption-enabled.html",
    "https://docs.aws.amazon.com/prescriptive-guidance/latest/encryption-best-practices/dynamodb.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dax create-cluster --cluster-name <example_resource_name> --node-type <NODE_TYPE> --replication-factor 1 --iam-role-arn <example_resource_id> --sse-specification Enabled=true",
      "NativeIaC": "```yaml\nResources:\n  DaxCluster:\n    Type: AWS::DAX::Cluster\n    Properties:\n      ClusterName: <example_resource_name>\n      NodeType: <NODE_TYPE>\n      ReplicationFactor: 1\n      IAMRoleARN: <example_resource_id>\n      SSESpecification:           # Critical: enables encryption at rest\n        SSEEnabled: true          # Encrypts DAX cluster data at rest\n```",
      "Other": "1. In the AWS console, open **DynamoDB** > under **DAX**, choose **Clusters** > **Create cluster**\n2. Enter a name and choose a node type\n3. In **Encryption**, select **Enable encryption**\n4. Choose the IAM role and required networking, then click **Launch cluster**\n5. If replacing an existing unencrypted cluster: point your application to the new cluster endpoint, then delete the old cluster",
      "Terraform": "```hcl\nresource \"aws_dax_cluster\" \"example\" {\n  cluster_name       = \"<example_resource_name>\"\n  node_type          = \"<NODE_TYPE>\"\n  replication_factor = 1\n  iam_role_arn       = \"<example_resource_id>\"\n\n  # Critical: enables encryption at rest\n  server_side_encryption {\n    enabled = true  # Encrypts DAX cluster data at rest\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Provision DAX clusters with **`encryption at rest`** enabled. Apply **least privilege** for DAX administration and data access, and monitor with logging.\n\nAdopt **defense in depth**: enable encryption in transit, restrict network exposure, and avoid caching highly sensitive data. Re-create unencrypted clusters to enforce this setting.",
      "Url": "https://hub.prowler.com/check/dynamodb_accelerator_cluster_encryption_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Data Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_accelerator_cluster_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_accelerator_cluster_encryption_enabled/dynamodb_accelerator_cluster_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dynamodb.dax_client import dax_client


class dynamodb_accelerator_cluster_encryption_enabled(Check):
    def execute(self):
        findings = []
        for cluster in dax_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = (
                f"DAX cluster {cluster.name} does not have encryption at rest enabled."
            )
            if cluster.encryption:
                report.status = "PASS"
                report.status_extended = (
                    f"DAX cluster {cluster.name} has encryption at rest enabled."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_accelerator_cluster_in_transit_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_accelerator_cluster_in_transit_encryption_enabled/dynamodb_accelerator_cluster_in_transit_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dynamodb_accelerator_cluster_in_transit_encryption_enabled",
  "CheckTitle": "DynamoDB Accelerator (DAX) cluster has encryption in transit enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "dynamodb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**DAX clusters** have endpoint encryption set to `TLS`, enforcing **encryption in transit** for client connections to the cluster",
  "Risk": "Missing **TLS** enables interception and manipulation of DAX traffic, impacting:\n- Confidentiality: exposure of queries, data, or credentials\n- Integrity: tampered requests/responses and cache poisoning\n- Availability: session hijacking or replay causing service disruption",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/dynamodb-controls.html#dynamodb-7",
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAXEncryptionInTransit.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dax create-cluster --cluster-name <cluster-name> --node-type <node-type> --replication-factor <replication-factor> --cluster-endpoint-encryption-type TLS",
      "NativeIaC": "```yaml\n# CloudFormation: Create DAX cluster with TLS (encryption in transit)\nResources:\n  <example_resource_name>:\n    Type: AWS::DAX::Cluster\n    Properties:\n      ClusterName: <example_resource_name>\n      IAMRoleARN: <example_resource_id>\n      NodeType: <example_node_type>\n      ReplicationFactor: 1\n      ClusterEndpointEncryptionType: TLS  # Critical: Enables TLS for in-transit encryption\n```",
      "Other": "1. In the AWS Console, go to DynamoDB > DAX\n2. Click Create cluster\n3. Set Cluster name, Node type, Replication factor, and IAM role\n4. Enable Encryption in transit (TLS)\n5. Create the cluster and wait until ACTIVE\n6. Update your application to use the new DAX cluster endpoint\n7. Delete the old non-TLS DAX cluster",
      "Terraform": "```hcl\n# DAX cluster with encryption in transit enabled\nresource \"aws_dax_cluster\" \"<example_resource_name>\" {\n  cluster_name                      = \"<example_resource_name>\"\n  node_type                         = \"<example_node_type>\"\n  replication_factor                = 1\n  iam_role_arn                      = \"<example_resource_id>\"\n  cluster_endpoint_encryption_type  = \"TLS\"  # Critical: Enables TLS for in-transit encryption\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **TLS** for all DAX endpoints and clients (`encryption in transit`). If an existing cluster lacks it, create a new TLS-enabled cluster and migrate.\n\nApply **defense in depth**: restrict network paths, keep access private, and use **least privilege** IAM to reduce blast radius.",
      "Url": "https://hub.prowler.com/check/dynamodb_accelerator_cluster_in_transit_encryption_enabled"
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

---[FILE: dynamodb_accelerator_cluster_in_transit_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_accelerator_cluster_in_transit_encryption_enabled/dynamodb_accelerator_cluster_in_transit_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dynamodb.dax_client import dax_client


class dynamodb_accelerator_cluster_in_transit_encryption_enabled(Check):
    def execute(self):
        findings = []
        for cluster in dax_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"DAX cluster {cluster.name} does not have encryption in transit enabled."
            if cluster.tls_encryption:
                report.status = "PASS"
                report.status_extended = (
                    f"DAX cluster {cluster.name} has encryption in transit enabled."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_accelerator_cluster_multi_az.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_accelerator_cluster_multi_az/dynamodb_accelerator_cluster_multi_az.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dynamodb_accelerator_cluster_multi_az",
  "CheckTitle": "DynamoDB Accelerator (DAX) cluster has nodes in multiple Availability Zones",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "dynamodb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Amazon DynamoDB Accelerator (DAX)** cluster node placement across **Availability Zones** is evaluated. Clusters with nodes in more than one AZ within the Region are recognized as multi-AZ; clusters whose nodes reside in a single AZ are recognized as single-AZ.",
  "Risk": "Without **multi-AZ DAX nodes**, an AZ outage or primary node failure can render the cache **unavailable**, harming **availability** and causing **latency spikes** and **throttling** as load shifts to DynamoDB. Loss of caching can drive higher costs and trigger **timeout cascades** in read-heavy workloads.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://support.icompaas.com/support/solutions/articles/62000233618-ensure-dynamodb-accelerator-dax-clusters-have-nodes-in-multiple-availability-zones",
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.concepts.cluster.html#DAX.concepts.regions-and-azs",
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.create-cluster.console.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dax increase-replication-factor --cluster-name <example_resource_name> --new-replication-factor 2 --availability-zones <AZ_1> <AZ_2>",
      "NativeIaC": "```yaml\nResources:\n  DAXCluster:\n    Type: AWS::DAX::Cluster\n    Properties:\n      ClusterName: <example_resource_name>\n      IAMRoleARN: <example_resource_id>\n      NodeType: <NODE_TYPE>\n      ReplicationFactor: 2  # CRITICAL: at least 2 nodes so nodes can be placed in multiple AZs\n      SubnetGroupName: <example_resource_name>\n      AvailabilityZones:     # CRITICAL: specify multiple AZs to ensure multi-AZ placement\n        - <AZ_1>\n        - <AZ_2>\n```",
      "Other": "1. In AWS Console, go to DynamoDB > DAX > Subnet groups and ensure the subnet group used by the cluster includes subnets from at least two Availability Zones; save if you add one.\n2. Go to DynamoDB > DAX > Clusters, select <example_resource_name>, and choose Modify.\n3. Set Cluster size to 2 or more.\n4. In Availability Zones (or node placement), select at least two different AZs.\n5. Save changes and wait until status is Available, then confirm nodes show multiple AZs in Cluster details.",
      "Terraform": "```hcl\nresource \"aws_dax_cluster\" \"example\" {\n  cluster_name       = \"<example_resource_name>\"\n  node_type          = \"<NODE_TYPE>\"\n  replication_factor = 2  # CRITICAL: at least 2 nodes to allow multi-AZ\n  iam_role_arn       = \"<example_resource_id>\"\n  subnet_group_name  = \"<example_resource_name>\"\n  availability_zones = [\"<AZ_1>\", \"<AZ_2>\"]  # CRITICAL: ensures nodes are in multiple AZs\n}\n```"
    },
    "Recommendation": {
      "Text": "Deploy **DAX clusters** with at least `3` nodes spread across distinct **Availability Zones** to ensure fault tolerance. Use subnet groups spanning multiple AZs, access via the cluster endpoint, and validate **failover** regularly. Monitor capacity to avoid single-AZ or single-node dependencies.",
      "Url": "https://hub.prowler.com/check/dynamodb_accelerator_cluster_multi_az"
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

---[FILE: dynamodb_accelerator_cluster_multi_az.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_accelerator_cluster_multi_az/dynamodb_accelerator_cluster_multi_az.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dynamodb.dax_client import dax_client


class dynamodb_accelerator_cluster_multi_az(Check):
    def execute(self):
        findings = []
        for cluster in dax_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"DAX cluster {cluster.name} does not have nodes in multiple availability zones."
            if len(cluster.node_azs) > 1:
                report.status = "PASS"
                report.status_extended = f"DAX cluster {cluster.name} has nodes in multiple availability zones."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
