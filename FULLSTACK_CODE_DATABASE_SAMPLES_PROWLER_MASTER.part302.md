---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 302
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 302 of 867)

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

---[FILE: macie_is_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/macie/macie_is_enabled/macie_is_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "macie_is_enabled",
  "CheckTitle": "Amazon Macie is enabled",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "macie",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Amazon Macie** status is assessed per region with **S3** presence to determine if sensitive data discovery is operational. The outcome reflects whether Macie is active or in a `PAUSED`/not enabled state for the account and region.",
  "Risk": "Without active Macie, sensitive data in **S3** can remain unclassified and exposed. Misconfigured access and public buckets may go undetected, enabling data exfiltration and secret leakage. This degrades confidentiality and widens breach blast radius by reducing visibility into where sensitive data resides.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/macie/getting-started/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws macie2 enable-macie --region <REGION>",
      "NativeIaC": "```yaml\n# CloudFormation: Enable Amazon Macie in this region\nResources:\n  MacieSession:\n    Type: AWS::Macie::Session\n    Properties:\n      Status: ENABLED  # Critical: Enables Macie for the account in this region\n```",
      "Other": "1. Sign in to the AWS Management Console and switch to the target region\n2. Open Amazon Macie\n3. Click Get started or Enable Macie\n4. If Macie shows Suspended/Paused, click Resume Macie\n5. Repeat in each region with S3 buckets as needed",
      "Terraform": "```hcl\n# Enables Amazon Macie in this region\nresource \"aws_macie2_account\" \"main\" {\n  # Critical: Creating this resource enables Macie for the account in the region\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable and maintain **Amazon Macie** in all regions hosting **S3** data. Use continuous sensitive data discovery, apply custom classifications for your data types, and route findings to monitoring. Enforce least privilege for Macie access and strengthen defense in depth with restrictive bucket policies and access controls.",
      "Url": "https://hub.prowler.com/check/macie_is_enabled"
    }
  },
  "Categories": [
    "secrets",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: macie_is_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/macie/macie_is_enabled/macie_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.macie.macie_client import macie_client
from prowler.providers.aws.services.s3.s3_client import s3_client


class macie_is_enabled(Check):
    def execute(self):
        findings = []
        for session in macie_client.sessions:
            report = Check_Report_AWS(metadata=self.metadata(), resource=session)
            report.resource_arn = macie_client._get_session_arn_template(session.region)
            report.resource_id = macie_client.audited_account
            if session.status == "ENABLED":
                report.status = "PASS"
                report.status_extended = "Macie is enabled."
                findings.append(report)
            else:
                if (
                    macie_client.provider.scan_unused_services
                    or session.region in s3_client.regions_with_buckets
                ):
                    if session.status == "PAUSED":
                        report.status = "FAIL"
                        report.status_extended = (
                            "Macie is currently in a SUSPENDED state."
                        )
                    else:
                        report.status = "FAIL"
                        report.status_extended = "Macie is not enabled."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: memorydb_client.py]---
Location: prowler-master/prowler/providers/aws/services/memorydb/memorydb_client.py

```python
from prowler.providers.aws.services.memorydb.memorydb_service import MemoryDB
from prowler.providers.common.provider import Provider

memorydb_client = MemoryDB(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: memorydb_service.py]---
Location: prowler-master/prowler/providers/aws/services/memorydb/memorydb_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class MemoryDB(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.clusters = {}
        self.__threading_call__(self._describe_clusters)

    def _describe_clusters(self, regional_client):
        logger.info("MemoryDB - Describe Clusters...")
        try:
            describe_clusters_paginator = regional_client.get_paginator(
                "describe_clusters"
            )
            for page in describe_clusters_paginator.paginate():
                for cluster in page["Clusters"]:
                    try:
                        arn = cluster["ARN"]
                        if not self.audit_resources or (
                            is_resource_filtered(arn, self.audit_resources)
                        ):
                            self.clusters[arn] = Cluster(
                                name=cluster["Name"],
                                arn=arn,
                                number_of_shards=cluster["NumberOfShards"],
                                engine=cluster["Engine"],
                                engine_version=cluster["EngineVersion"],
                                engine_patch_version=cluster["EnginePatchVersion"],
                                multi_az=cluster.get("AvailabilityMode", "singleaz"),
                                region=regional_client.region,
                                security_groups=[
                                    sg["SecurityGroupId"]
                                    for sg in cluster.get("SecurityGroups", [])
                                    if sg["Status"] == "active"
                                ],
                                tls_enabled=cluster["TLSEnabled"],
                                auto_minor_version_upgrade=cluster[
                                    "AutoMinorVersionUpgrade"
                                ],
                                snapshot_limit=cluster["SnapshotRetentionLimit"],
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
    name: str
    arn: str
    number_of_shards: int
    engine: str
    engine_version: str
    engine_patch_version: str
    multi_az: str
    region: str
    security_groups: list[str] = []
    tls_enabled: bool
    auto_minor_version_upgrade: bool
    snapshot_limit: int
```

--------------------------------------------------------------------------------

---[FILE: memorydb_cluster_auto_minor_version_upgrades.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/memorydb/memorydb_cluster_auto_minor_version_upgrades/memorydb_cluster_auto_minor_version_upgrades.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "memorydb_cluster_auto_minor_version_upgrades",
  "CheckTitle": "MemoryDB cluster has automatic minor version upgrades enabled",
  "CheckType": [
    "Software and Configuration Checks/Patch Management",
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "memorydb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**MemoryDB clusters** are evaluated for the `auto_minor_version_upgrade` setting that automatically applies new minor engine versions.",
  "Risk": "Without automatic minor upgrades, clusters may run **known-vulnerable engine versions**.\n- Exploitable CVEs enable unauthorized reads/writes (confidentiality, integrity)\n- Unpatched bugs can cause **DoS** or data loss (availability)\n- Version drift raises operational risk and slows incident response",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/memorydb/latest/devguide/engine-versions.html",
    "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Upgrading.html#USER_UpgradeDBInstance.Upgrading.AutoMinorVersionUpgrades"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws memorydb update-cluster --cluster-name <cluster-name> --auto-minor-version-upgrade",
      "NativeIaC": "```yaml\n# Enable automatic minor version upgrades for a MemoryDB cluster\nResources:\n  <example_resource_name>:\n    Type: AWS::MemoryDB::Cluster\n    Properties:\n      ClusterName: <example_resource_name>\n      ACLName: <example_acl_name>\n      NodeType: <example_node_type>\n      NumShards: 1\n      AutoMinorVersionUpgrade: true  # Critical: enables automatic minor version upgrades\n```",
      "Other": "1. In the AWS Console, go to MemoryDB > Clusters\n2. Select the cluster <cluster-name> and click Edit\n3. Enable \"Auto minor version upgrade\"\n4. Click Save changes",
      "Terraform": "```hcl\nresource \"aws_memorydb_cluster\" \"<example_resource_name>\" {\n  name       = \"<example_resource_name>\"\n  acl_name   = \"<example_acl_name>\"\n  node_type  = \"<example_node_type>\"\n  num_shards = 1\n\n  auto_minor_version_upgrade = true  # Critical: enables automatic minor version upgrades\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **automatic minor version upgrades** (`auto_minor_version_upgrade=true`) for all clusters. Schedule updates in a maintenance window, validate in staging, and keep rollback plans. Apply **defense in depth** with strict ACLs and monitoring to limit exposure between releases.",
      "Url": "https://hub.prowler.com/check/memorydb_cluster_auto_minor_version_upgrades"
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

---[FILE: memorydb_cluster_auto_minor_version_upgrades.py]---
Location: prowler-master/prowler/providers/aws/services/memorydb/memorydb_cluster_auto_minor_version_upgrades/memorydb_cluster_auto_minor_version_upgrades.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.memorydb.memorydb_client import memorydb_client


class memorydb_cluster_auto_minor_version_upgrades(Check):
    def execute(self):
        findings = []
        for cluster in memorydb_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            if cluster.auto_minor_version_upgrade:
                report.status = "PASS"
                report.status_extended = f"Memory DB Cluster {cluster.name} has minor version upgrade enabled."
            else:
                report.status = "FAIL"
                report.status_extended = f"Memory DB Cluster {cluster.name} does not have minor version upgrade enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: mq_client.py]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_client.py

```python
from prowler.providers.aws.services.mq.mq_service import MQ
from prowler.providers.common.provider import Provider

mq_client = MQ(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: mq_service.py]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_service.py
Signals: Pydantic

```python
from enum import Enum
from typing import Dict, List

from pydantic.v1 import BaseModel, Field

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class MQ(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.brokers = {}
        self.__threading_call__(self._list_brokers)
        self.__threading_call__(self._describe_broker, self.brokers.values())

    def _list_brokers(self, regional_client):
        logger.info("MQ - Listing brokers...")
        try:
            for broker in regional_client.list_brokers()["BrokerSummaries"]:
                if not self.audit_resources or (
                    is_resource_filtered(broker["BrokerArn"], self.audit_resources)
                ):
                    broker_arn = broker["BrokerArn"]
                    self.brokers[broker_arn] = Broker(
                        arn=broker_arn,
                        name=broker["BrokerName"],
                        id=broker["BrokerId"],
                        region=regional_client.region,
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_broker(self, broker):
        try:
            describe_broker = self.regional_clients[broker.region].describe_broker(
                BrokerId=broker.id
            )
            broker.engine_type = EngineType(
                describe_broker.get("EngineType", "ACTIVEMQ").upper()
            )
            broker.deployment_mode = DeploymentMode(
                describe_broker.get("DeploymentMode", "SINGLE_INSTANCE").upper()
            )
            broker.auto_minor_version_upgrade = describe_broker.get(
                "AutoMinorVersionUpgrade", False
            )
            broker.general_logging_enabled = describe_broker.get("Logs", {}).get(
                "General", False
            )
            broker.audit_logging_enabled = describe_broker.get("Logs", {}).get(
                "Audit", False
            )
            broker.publicly_accessible = describe_broker.get(
                "PubliclyAccessible", False
            )
            broker.tags = [describe_broker.get("Tags", {})]

        except Exception as error:
            logger.error(
                f"{broker.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class DeploymentMode(Enum):
    """Possible Deployment Modes for MQ"""

    SINGLE_INSTANCE = "SINGLE_INSTANCE"
    ACTIVE_STANDBY_MULTI_AZ = "ACTIVE_STANDBY_MULTI_AZ"
    CLUSTER_MULTI_AZ = "CLUSTER_MULTI_AZ"


class EngineType(Enum):
    """Possible Engine Types for MQ"""

    ACTIVEMQ = "ACTIVEMQ"
    RABBITMQ = "RABBITMQ"


class Broker(BaseModel):
    """Broker model for MQ"""

    arn: str
    name: str
    id: str
    region: str
    auto_minor_version_upgrade: bool = Field(default=False)
    publicly_accessible: bool = Field(default=False)
    general_logging_enabled: bool = Field(default=False)
    audit_logging_enabled: bool = Field(default=False)
    engine_type: EngineType = EngineType.ACTIVEMQ
    deployment_mode: DeploymentMode = DeploymentMode.SINGLE_INSTANCE
    tags: List[Dict[str, str]] = Field(default_factory=list)
```

--------------------------------------------------------------------------------

---[FILE: mq_broker_active_deployment_mode.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_broker_active_deployment_mode/mq_broker_active_deployment_mode.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "mq_broker_active_deployment_mode",
  "CheckTitle": "Apache ActiveMQ broker is configured in active/standby Multi-AZ deployment mode",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls",
    "Effects/Denial of Service"
  ],
  "ServiceName": "mq",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsAmazonMQBroker",
  "Description": "**ActiveMQ broker deployment mode** is configured as **active/standby** (`ACTIVE_STANDBY_MULTI_AZ`), indicating a redundant pair operating across Availability Zones",
  "Risk": "Without **active/standby**, a single-instance broker becomes a **single point of failure**, degrading **availability** and risking **message loss or duplication** during outages or maintenance. This can stall message flows, grow backlogs, and cause inconsistent processing across dependent services.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/MQ/deployment-mode.html",
    "https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-basic-elements.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/mq-controls.html#mq-5",
    "https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-broker-architecture.html#active-standby-broker-deployment"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Create an ActiveMQ broker in active/standby Multi-AZ\nResources:\n  <example_resource_name>:\n    Type: AWS::AmazonMQ::Broker\n    Properties:\n      BrokerName: <example_resource_name>\n      EngineType: ACTIVEMQ\n      EngineVersion: <example_resource_name>\n      HostInstanceType: mq.t3.micro\n      PubliclyAccessible: false\n      DeploymentMode: ACTIVE_STANDBY_MULTI_AZ  # Critical: sets active/standby Multi-AZ to pass the check\n      SubnetIds:\n        - <example_resource_id>\n        - <example_resource_id>  # Critical: two subnets in different AZs required for active/standby\n      SecurityGroups:\n        - <example_resource_id>\n      Users:\n        - Username: <example_resource_name>\n          Password: <example_resource_id>\n```",
      "Other": "1. In the AWS Console, go to Amazon MQ > Brokers > Create broker\n2. Select Engine: ActiveMQ\n3. Set Deployment mode to Active/standby broker (Multi-AZ)\n4. Choose two subnets in different AZs and a security group\n5. Enter a broker name, instance type, and create a user (username/password)\n6. Create the broker, update clients to use the new endpoints, then delete the old single-instance broker",
      "Terraform": "```hcl\n# Create an ActiveMQ broker in active/standby Multi-AZ\nresource \"aws_mq_broker\" \"<example_resource_name>\" {\n  broker_name         = \"<example_resource_name>\"\n  engine_type         = \"ActiveMQ\"\n  engine_version      = \"<example_resource_name>\"\n  host_instance_type  = \"mq.t3.micro\"\n  publicly_accessible = false\n  deployment_mode     = \"ACTIVE_STANDBY_MULTI_AZ\"  # Critical: enables active/standby Multi-AZ to pass the check\n\n  subnet_ids      = [\"<example_resource_id>\", \"<example_resource_id>\"]  # Critical: two subnets in different AZs\n  security_groups = [\"<example_resource_id>\"]\n\n  user {\n    username = \"<example_resource_name>\"\n    password = \"<example_resource_id>\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Adopt **active/standby deployment** for ActiveMQ brokers to provide multi-AZ resilience.\n\nDesign clients for **failover** with retries and idempotent processing, validate recovery through regular **failover testing**, monitor broker health, and apply **least privilege** to limit blast radius.",
      "Url": "https://hub.prowler.com/check/mq_broker_active_deployment_mode"
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

---[FILE: mq_broker_active_deployment_mode.py]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_broker_active_deployment_mode/mq_broker_active_deployment_mode.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.mq.mq_client import mq_client
from prowler.providers.aws.services.mq.mq_service import DeploymentMode, EngineType


class mq_broker_active_deployment_mode(Check):
    def execute(self):
        findings = []
        for broker in mq_client.brokers.values():
            if broker.engine_type == EngineType.ACTIVEMQ:
                report = Check_Report_AWS(metadata=self.metadata(), resource=broker)
                report.status = "FAIL"
                report.status_extended = f"MQ Apache ActiveMQ Broker {broker.name} does not have an active/standby deployment mode."
                if broker.deployment_mode == DeploymentMode.ACTIVE_STANDBY_MULTI_AZ:
                    report.status = "PASS"
                    report.status_extended = f"MQ Apache ActiveMQ Broker {broker.name} does have an active/standby deployment mode."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: mq_broker_auto_minor_version_upgrades.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_broker_auto_minor_version_upgrades/mq_broker_auto_minor_version_upgrades.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "mq_broker_auto_minor_version_upgrades",
  "CheckTitle": "Amazon MQ broker has automated minor version upgrades enabled",
  "CheckType": [
    "Software and Configuration Checks/Patch Management",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "mq",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsAmazonMQBroker",
  "Description": "**Amazon MQ brokers** have `autoMinorVersionUpgrade` enabled to automatically apply supported minor and patch engine updates during the scheduled maintenance window.",
  "Risk": "Without automatic minor upgrades, brokers may run **known-vulnerable engine versions**, enabling exploits that impact:\n- **Confidentiality**: message disclosure\n- **Integrity**: tampering or replay\n- **Availability**: crashes/DoS and instability\n\nDelayed patches also increase operational risk and drift.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/MQ/auto-minor-version-upgrade.html",
    "https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/upgrading-brokers.html#upgrading-brokers-automatic-upgrades",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/mq-controls.html#mq-3",
    "https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/upgrading-brokers.html#upgrading-brokers-automatic-upgrades.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws mq update-broker --broker-id <example_resource_id> --auto-minor-version-upgrade",
      "NativeIaC": "```yaml\n# CloudFormation: Enable automatic minor version upgrades on an MQ broker\nResources:\n  <example_resource_name>:\n    Type: AWS::AmazonMQ::Broker\n    Properties:\n      BrokerName: <example_resource_name>\n      AutoMinorVersionUpgrade: true  # Critical: enables automatic minor version upgrades\n      DeploymentMode: SINGLE_INSTANCE\n      EngineType: ACTIVEMQ\n      EngineVersion: <ENGINE_VERSION>\n      HostInstanceType: mq.t3.micro\n      PubliclyAccessible: true\n      Users:\n        - Username: <USERNAME>\n          Password: <PASSWORD>\n```",
      "Other": "1. Open the Amazon MQ console\n2. Go to Brokers and select the target broker\n3. Click Edit\n4. Under Maintenance, check Enable automatic minor version upgrades\n5. Click Save",
      "Terraform": "```hcl\n# Terraform: Enable automatic minor version upgrades on an MQ broker\nresource \"aws_mq_broker\" \"<example_resource_name>\" {\n  broker_name                = \"<example_resource_name>\"\n  engine_type                = \"ActiveMQ\"\n  engine_version             = \"<ENGINE_VERSION>\"\n  host_instance_type         = \"mq.t3.micro\"\n  publicly_accessible        = true\n  auto_minor_version_upgrade = true  # Critical: enables automatic minor version upgrades\n\n  user {\n    username = \"<USERNAME>\"\n    password = \"<PASSWORD>\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable `autoMinorVersionUpgrade` on all brokers to reduce patch latency.\n\n- Align upgrades with a defined maintenance window\n- Validate changes in staging before production\n- Monitor broker health and logs after updates\n- Maintain HA and tested backups for rollback (*defense in depth*)",
      "Url": "https://hub.prowler.com/check/mq_broker_auto_minor_version_upgrades"
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

---[FILE: mq_broker_auto_minor_version_upgrades.py]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_broker_auto_minor_version_upgrades/mq_broker_auto_minor_version_upgrades.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.mq.mq_client import mq_client


class mq_broker_auto_minor_version_upgrades(Check):
    def execute(self):
        findings = []
        for broker in mq_client.brokers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=broker)
            report.status = "PASS"
            report.status_extended = f"MQ Broker {broker.name} does have automated minor version upgrades enabled."

            if not broker.auto_minor_version_upgrade:
                report.status = "FAIL"
                report.status_extended = f"MQ Broker {broker.name} does not have automated minor version upgrades enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: mq_broker_cluster_deployment_mode.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_broker_cluster_deployment_mode/mq_broker_cluster_deployment_mode.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "mq_broker_cluster_deployment_mode",
  "CheckTitle": "MQ RabbitMQ broker has cluster (multi-AZ) deployment mode",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls",
    "Effects/Denial of Service"
  ],
  "ServiceName": "mq",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsAmazonMQBroker",
  "Description": "**Amazon MQ RabbitMQ brokers** are assessed for **cluster deployment mode** (`CLUSTER_MULTI_AZ`) with nodes spread across multiple AZs and shared state.\n\nBrokers configured otherwise are identified.",
  "Risk": "Without **clustered RabbitMQ**, the broker is a **single point of failure**. An instance or AZ outage can halt queues, cause message loss or duplication, and break ordering, reducing **availability** and **integrity** of workloads that depend on the broker.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/rabbitmq-basic-elements.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/mq-controls.html#mq-6",
    "https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/rabbitmq-broker-architecture.html#rabbitmq-broker-architecture-cluster",
    "https://docs.amazonaws.cn/en_us/AWSCloudFormation/latest/TemplateReference/aws-resource-amazonmq-broker.html",
    "https://docs.aws.amazon.com/controltower/latest/controlreference/mq-rules.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws mq create-broker --broker-name <example_resource_name> --engine-type RABBITMQ --deployment-mode CLUSTER_MULTI_AZ --host-instance-type mq.m5.large --publicly-accessible --auto-minor-version-upgrade --users '[{\"Username\":\"<example_username>\",\"Password\":\"<example_password>\"}]'",
      "NativeIaC": "```yaml\n# CloudFormation: create a RabbitMQ broker in cluster (Multi-AZ) mode\nResources:\n  ExampleBroker:\n    Type: AWS::AmazonMQ::Broker\n    Properties:\n      BrokerName: \"<example_resource_name>\"\n      EngineType: RABBITMQ            # Critical: ensures the broker is RabbitMQ\n      DeploymentMode: CLUSTER_MULTI_AZ # Critical: sets cluster (Multi-AZ) to pass the check\n      HostInstanceType: mq.m5.large\n      PubliclyAccessible: true\n      Users:\n        - Username: \"<example_username>\"\n          Password: \"<example_password>\"\n```",
      "Other": "1. Open the AWS Console and go to Amazon MQ\n2. Click Brokers > Create broker\n3. Select RabbitMQ as the engine\n4. Set Deployment mode to Cluster (Multi-AZ)\n5. Enter a broker name, choose an instance type, set Public access as needed, and create one admin user\n6. Click Create broker\n7. Migrate applications to the new broker endpoint, then delete the old single-instance broker\n\nNote: Deployment mode cannot be changed on an existing broker; you must create a new cluster broker.",
      "Terraform": "```hcl\n# Terraform: create a RabbitMQ broker in cluster (Multi-AZ) mode\nresource \"aws_mq_broker\" \"example\" {\n  broker_name         = \"<example_resource_name>\"\n  engine_type         = \"RabbitMQ\"         # Critical: RabbitMQ engine\n  deployment_mode     = \"CLUSTER_MULTI_AZ\" # Critical: cluster (Multi-AZ) to pass the check\n  host_instance_type  = \"mq.m5.large\"\n  publicly_accessible = true\n\n  user {\n    username = \"<example_username>\"\n    password = \"<example_password>\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Use **cluster deployment** (`CLUSTER_MULTI_AZ`) for RabbitMQ to remove single-instance risk.\n\nApply **resiliency by design**: clients auto-reconnect, retries with backoff, and idempotent processing; test failover, size for node loss, and enforce **least privilege** with monitoring for defense in depth.",
      "Url": "https://hub.prowler.com/check/mq_broker_cluster_deployment_mode"
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

---[FILE: mq_broker_cluster_deployment_mode.py]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_broker_cluster_deployment_mode/mq_broker_cluster_deployment_mode.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.mq.mq_client import mq_client
from prowler.providers.aws.services.mq.mq_service import DeploymentMode, EngineType


class mq_broker_cluster_deployment_mode(Check):
    """Ensure MQ RabbitMQ Broker has cluster deployment mode.

    This check will fail if the RabbitMQ Broker does not have cluster deployment mode.
    """

    def execute(self) -> List[Check_Report_AWS]:
        """Execute the check.

        Returns:
            List[Check_Report_AWS]: A list of reports for each RabbitMQ Broker that does not have cluster deployment mode.
        """
        findings = []
        for broker in mq_client.brokers.values():
            if broker.engine_type == EngineType.RABBITMQ:
                report = Check_Report_AWS(metadata=self.metadata(), resource=broker)
                report.status = "FAIL"
                report.status_extended = f"MQ RabbitMQ Broker {broker.name} does not have a cluster deployment mode."
                if broker.deployment_mode == DeploymentMode.CLUSTER_MULTI_AZ:
                    report.status = "PASS"
                    report.status_extended = f"MQ RabbitMQ Broker {broker.name} does have a cluster deployment mode."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: mq_broker_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_broker_logging_enabled/mq_broker_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "mq_broker_logging_enabled",
  "CheckTitle": "MQ broker has general logging enabled and, for ActiveMQ, audit logging enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "mq",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsAmazonMQBroker",
  "Description": "**Amazon MQ brokers** have logging to **CloudWatch Logs** enabled per engine type: **ActiveMQ** requires both `general` and `audit` logs; **RabbitMQ** requires `general` logs.",
  "Risk": "Missing broker logs creates blind spots in authentication events, administrative changes, and broker failures. Adversaries can act without detection, enabling unauthorized access and message tampering (confidentiality/integrity) and hindering incident response and root-cause analysis (availability).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/configure-logging-monitoring-activemq.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/mq-controls.html#mq-2",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/MQ/log-exports.html",
    "https://docs.aws.amazon.com/cli/latest/reference/mq/create-broker.html",
    "https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/security-logging-monitoring.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws mq update-broker --broker-id <example_resource_id> --logs Audit=true,General=true",
      "NativeIaC": "```yaml\n# CloudFormation: Enable Amazon MQ logging\nResources:\n  <example_resource_name>:\n    Type: AWS::AmazonMQ::Broker\n    Properties:\n      BrokerName: <example_resource_name>\n      EngineType: ACTIVEMQ\n      HostInstanceType: mq.t3.micro\n      DeploymentMode: SINGLE_INSTANCE\n      PubliclyAccessible: true\n      Users:\n        - Username: <example_user>\n          Password: <example_password>\n      Logs:\n        General: true  # Critical: enables general logs to CloudWatch\n        Audit: true    # Critical: enables audit logs (required for ActiveMQ)\n```",
      "Other": "1. In the AWS Console, go to Amazon MQ > Brokers\n2. Select <example_resource_name> and choose Edit\n3. In Log settings:\n   - For ActiveMQ: enable General logs and Audit logs\n   - For RabbitMQ: enable General logs only\n4. Save changes and reboot if prompted",
      "Terraform": "```hcl\n# Terraform: Enable Amazon MQ logging\nresource \"aws_mq_broker\" \"<example_resource_name>\" {\n  broker_name         = \"<example_resource_name>\"\n  engine_type         = \"ActiveMQ\"\n  host_instance_type  = \"mq.t3.micro\"\n  deployment_mode     = \"SINGLE_INSTANCE\"\n  publicly_accessible = true\n\n  user {\n    username = \"<example_user>\"\n    password = \"<example_password>\"\n  }\n\n  logs {\n    general = true  # Critical: enables general logs\n    audit   = true  # Critical: enables audit logs (ActiveMQ)\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable centralized **CloudWatch Logs** for brokers. For **ActiveMQ**, turn on both `general` and `audit` logs; for **RabbitMQ**, enable `general` logs.\n\nApply **least privilege** to log access, set retention, and create alerts for anomalous events to strengthen **defense in depth**.",
      "Url": "https://hub.prowler.com/check/mq_broker_logging_enabled"
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

---[FILE: mq_broker_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/mq/mq_broker_logging_enabled/mq_broker_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.mq.mq_client import mq_client
from prowler.providers.aws.services.mq.mq_service import EngineType


class mq_broker_logging_enabled(Check):
    """Ensure that MQ Brokers have logging enabled

    This check will return FAIL if the MQ Broker does not have logging enabled.
    """

    def execute(self):
        """Execute the check

        Returns: List[Check_Report_AWS]: List of check reports
        """
        findings = []
        for broker in mq_client.brokers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=broker)
            report.status = "FAIL"
            report.status_extended = (
                f"MQ Broker {broker.name} does not have logging enabled."
            )
            logging_enabled = False

            if broker.engine_type == EngineType.ACTIVEMQ:
                logging_enabled = (
                    broker.general_logging_enabled and broker.audit_logging_enabled
                )
            elif broker.engine_type == EngineType.RABBITMQ:
                logging_enabled = broker.general_logging_enabled

            if logging_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"MQ Broker {broker.name} does have logging enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
