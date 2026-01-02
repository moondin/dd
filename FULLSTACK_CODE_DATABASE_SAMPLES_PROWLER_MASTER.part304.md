---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 304
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 304 of 867)

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

---[FILE: neptune_cluster_public_snapshot.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_public_snapshot/neptune_cluster_public_snapshot.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "neptune_cluster_public_snapshot",
  "CheckTitle": "NeptuneDB cluster snapshot is not publicly shared",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Effects/Data Exposure",
    "TTPs/Initial Access/Unauthorized Access"
  ],
  "ServiceName": "neptune",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsRdsDbClusterSnapshot",
  "Description": "Neptune DB manual cluster snapshot is evaluated to determine if its restore attributes allow access to all AWS accounts *(public)*.\n\nA failed status in the report means the snapshot is publicly shared and can be copied or restored by any AWS account; **PASS** means it is not shared publicly.",
  "Risk": "**Public snapshots** compromise confidentiality of stored data and metadata.\n\nAttackers or third parties can:\n- Copy or restore snapshots to external accounts.\n- Access sensitive data contained in the snapshot.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/neptune-controls.html#neptune-3",
    "https://docs.aws.amazon.com/config/latest/developerguide/neptune-cluster-snapshot-public-prohibited.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws neptune modify-db-cluster-snapshot-attribute --db-cluster-snapshot-identifier <snapshot_id> --attribute-name restore --values-to-remove all",
      "NativeIaC": "",
      "Terraform": "",
      "Other": "1. Sign in to the AWS Management Console and open the Amazon RDS console\n2. In the left navigation, choose Snapshots > DB cluster snapshots\n3. Select the snapshot, choose Actions > Manage snapshot permissions\n4. In the permissions dialog remove the Public/all-accounts permission and click Save"
    },
    "Recommendation": {
      "Text": "Avoid public sharing and apply **least privilege** when granting snapshot access: share only with specific AWS accounts or roles.\n\nUse **encryption**, enforce automated policies and regular audits, and apply **separation of duties** and tagging to control and track snapshot access.",
      "Url": "https://hub.prowler.com/check/neptune_cluster_public_snapshot"
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

---[FILE: neptune_cluster_public_snapshot.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_public_snapshot/neptune_cluster_public_snapshot.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.neptune.neptune_client import neptune_client


class neptune_cluster_public_snapshot(Check):
    def execute(self):
        findings = []
        for db_snap in neptune_client.db_cluster_snapshots:
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_snap)
            if db_snap.public:
                report.status = "FAIL"
                report.status_extended = (
                    f"NeptuneDB Cluster Snapshot {db_snap.id} is public."
                )
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"NeptuneDB Cluster Snapshot {db_snap.id} is not shared publicly."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_public_snapshot_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_public_snapshot/neptune_cluster_public_snapshot_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.neptune.neptune_client import neptune_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the attributes of a Neptune DB cluster snapshot to remove public access.
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
        regional_client = neptune_client.regional_clients[region]
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

---[FILE: neptune_cluster_snapshot_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_snapshot_encrypted/neptune_cluster_snapshot_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "neptune_cluster_snapshot_encrypted",
  "CheckTitle": "Neptune DB cluster snapshot is encrypted at rest",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Encryption at Rest",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "neptune",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbClusterSnapshot",
  "Description": "Neptune DB cluster snapshot is encrypted at rest. The evaluation looks at whether each snapshot's encrypted attribute is enabled, confirming that the data is protected while stored.",
  "Risk": "**Unencrypted Neptune snapshots** undermine data confidentiality. If accessed or shared due to compromised credentials or misconfiguration, attackers can restore or download snapshot contents, enabling **data exfiltration**, and exposure of sensitive records. This weakens overall data protection posture.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/neptune-controls.html#neptune-6",
    "https://docs.aws.amazon.com/neptune/latest/userguide/backup-restore-share-snapshot.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws rds copy-db-cluster-snapshot --source-db-cluster-snapshot-identifier <source-snapshot> --target-db-cluster-snapshot-identifier <encrypted-snapshot> --kms-key-id <kms-key-id>",
      "NativeIaC": "",
      "Terraform": "```hcl\nresource \"aws_neptune_cluster\" \"restored\" {\n  cluster_identifier  = \"restored-cluster\"\n  snapshot_identifier = \"<source-snapshot>\"\n  storage_encrypted   = true  # Ensure restored cluster from snapshot is encrypted\n}\n```",
      "Other": "1. Sign in to the AWS Management Console and open Amazon Neptune\n2. In the left pane choose **Snapshots**\n3. Select the unencrypted snapshot and click **Actions** > **Restore snapshot**\n4. In the Restore page enable **Encryption** and select a KMS key\n5. Click **Restore DB cluster**\n6. After the cluster is restored, create a new snapshot of the restored (encrypted) cluster"
    },
    "Recommendation": {
      "Text": "Protect snapshot data by enforcing **encryption at rest** and strong key governance.\n\n- Use **customer-managed keys** with controlled lifecycle and rotation\n- Apply **least privilege** to snapshot access and sharing\n- Prevent creation of unencrypted snapshots via organizational configuration and policy controls",
      "Url": "https://hub.prowler.com/check/neptune_cluster_snapshot_encrypted"
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

---[FILE: neptune_cluster_snapshot_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_snapshot_encrypted/neptune_cluster_snapshot_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.neptune.neptune_client import neptune_client


class neptune_cluster_snapshot_encrypted(Check):
    def execute(self):
        findings = []
        for snapshot in neptune_client.db_cluster_snapshots:
            report = Check_Report_AWS(metadata=self.metadata(), resource=snapshot)
            report.status = "FAIL"
            report.status_extended = (
                f"Neptune Cluster Snapshot {snapshot.id} is not encrypted at rest."
            )
            if snapshot.encrypted:
                report.status = "PASS"
                report.status_extended = (
                    f"Neptune Cluster Snapshot {snapshot.id} is encrypted at rest."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_storage_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_storage_encrypted/neptune_cluster_storage_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "neptune_cluster_storage_encrypted",
  "CheckTitle": "Neptune cluster storage is encrypted at rest",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Sensitive Data Identifications/Security"
  ],
  "ServiceName": "neptune",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "Neptune DB cluster is evaluated for **encryption at rest**. Indicating the cluster's underlying storage is not encrypted.",
  "Risk": "**Unencrypted Neptune storage** reduces confidentiality of stored data and metadata and increases attack surface.\n\nPossible impacts:\n- Unauthorized access or data exfiltration from underlying volumes or snapshots\n- Greater blast radius from leaked or shared snapshots",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/neptune-controls.html#neptune-1",
    "https://docs.aws.amazon.com/neptune/latest/userguide/encrypt.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\nResources:\n  EncryptedNeptuneCluster:\n    Type: AWS::Neptune::DBCluster\n    Properties:\n      DBClusterIdentifier: !Sub ${DBClusterIdentifier}\n      StorageEncrypted: true  # Enable encryption at rest for data protection\n```",
      "Terraform": "```hcl\nresource \"aws_neptune_cluster\" \"example_resource\" {\n  cluster_identifier = \"<cluster-id>\"\n  storage_encrypted  = true  # Enable encryption at rest for data protection\n}\n```",
      "Other": ""
    },
    "Recommendation": {
      "Text": "Provision all new Neptune DB clusters with **encryption at rest** and prefer **Customer-Managed Keys (CMK)** for key ownership and auditability.\n\nEnforce **least privilege** on KMS keys, implement key lifecycle practices (rotation, revocation) and ensure backups/snapshots remain encrypted to prevent exposure.",
      "Url": "https://hub.prowler.com/check/neptune_cluster_storage_encrypted"
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

---[FILE: neptune_cluster_storage_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_storage_encrypted/neptune_cluster_storage_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.neptune.neptune_client import neptune_client


class neptune_cluster_storage_encrypted(Check):
    def execute(self):
        findings = []
        for cluster in neptune_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.resource_id = cluster.name
            report.status = "FAIL"
            report.status_extended = (
                f"Neptune Cluster {cluster.name} is not encrypted at rest."
            )
            if cluster.encrypted:
                report.status = "PASS"
                report.status_extended = (
                    f"Neptune Cluster {cluster.name} is encrypted at rest."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_uses_public_subnet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_uses_public_subnet/neptune_cluster_uses_public_subnet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "neptune_cluster_uses_public_subnet",
  "CheckTitle": "Neptune cluster is not using public subnets",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "TTPs/Initial Access/Unauthorized Access"
  ],
  "ServiceName": "neptune",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Neptune cluster is associated with one or more **public subnets**.",
  "Risk": "A Neptune cluster in a **public subnet** increases exposure across the CIA triad:\n\n- **Confidentiality**: Direct access enables credential attacks and data exfiltration\n- **Integrity**: Attackers may modify or inject graph data\n- **Availability**: Public reachability allows DDoS or remote exploitation, causing downtime",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/neptune/latest/userguide/get-started-vpc.html",
    "https://docs.aws.amazon.com/neptune/latest/userguide/feature-overview-endpoints.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\nResources:\n  NeptuneSubnetGroup:\n    Type: AWS::Neptune::DBSubnetGroup\n    Properties:\n      DBSubnetGroupDescription: \"Private subnets for Neptune\"\n      SubnetIds:  # Use only private subnet IDs to prevent public access\n        - <PRIVATE_SUBNET_ID_1>\n        - <PRIVATE_SUBNET_ID_2>\n\n  NeptuneDBCluster:\n    Type: AWS::Neptune::DBCluster\n    Properties:\n      DBSubnetGroupName: !Ref NeptuneSubnetGroup  # Associate cluster with private subnet group\n```",
      "Terraform": "```hcl\nresource \"aws_neptune_subnet_group\" \"neptune\" {\n  name       = \"neptune-private-subnets\"\n  subnet_ids = [\"<PRIVATE_SUBNET_ID_1>\", \"<PRIVATE_SUBNET_ID_2>\"]  # Use only private subnet IDs to prevent public access\n}\n\nresource \"aws_neptune_cluster\" \"example_cluster\" {\n  neptune_subnet_group_name = aws_neptune_subnet_group.neptune.name  # Associate cluster with private subnet group\n}\n```",
      "Other": "1. Open the AWS Console and go to Amazon Neptune > Subnet groups\n2. Click Create DB Subnet Group\n3. Enter a name and description, select the VPC, and add only private subnet IDs (at least two)\n4. Click Create\n5. Go to Amazon Neptune > DB clusters > Select the cluster > Actions > Modify\n6. Set DB subnet group to the newly created subnet group and save (Apply immediately if required)\n7. Verify the cluster subnet group now lists only private subnets"
    },
    "Recommendation": {
      "Text": "Place Neptune clusters in **private subnets** and remove public routability to reduce attack surface.\n\n- Apply **least privilege** and network segmentation\n- Restrict inbound access with scoped network controls and minimal trusted paths\n- Enforce logging, monitoring, and private connectivity for administrative and application access",
      "Url": "https://hub.prowler.com/check/neptune_cluster_uses_public_subnet"
    }
  },
  "Categories": [
    "internet-exposed",
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_uses_public_subnet.py]---
Location: prowler-master/prowler/providers/aws/services/neptune/neptune_cluster_uses_public_subnet/neptune_cluster_uses_public_subnet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.neptune.neptune_client import neptune_client
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class neptune_cluster_uses_public_subnet(Check):
    def execute(self):
        findings = []
        for cluster in neptune_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = (
                f"Cluster {cluster.id} is not using public subnets."
            )

            public_subnets = []
            for subnet in cluster.subnets:
                if vpc_client.vpc_subnets[subnet].public:
                    public_subnets.append(vpc_client.vpc_subnets[subnet].id)

            if len(public_subnets) > 0:
                report.status = "FAIL"
                report.status_extended = f"Cluster {cluster.id} is using {', '.join(public_subnets)} public subnets."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_client.py]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_client.py

```python
from prowler.providers.aws.services.networkfirewall.networkfirewall_service import (
    NetworkFirewall,
)
from prowler.providers.common.provider import Provider

networkfirewall_client = NetworkFirewall(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_service.py]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_service.py
Signals: Pydantic

```python
from enum import Enum
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class NetworkFirewall(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("network-firewall", provider)
        self.network_firewalls = {}
        self.__threading_call__(self._list_firewalls)
        self.__threading_call__(
            self._describe_firewall, self.network_firewalls.values()
        )
        self.__threading_call__(
            self._describe_firewall_policy, self.network_firewalls.values()
        )
        self.__threading_call__(
            self._describe_logging_configuration, self.network_firewalls.values()
        )

    def _list_firewalls(self, regional_client):
        logger.info("Network Firewall - Listing Network Firewalls...")
        try:
            list_network_firewalls_paginator = regional_client.get_paginator(
                "list_firewalls"
            )
            for page in list_network_firewalls_paginator.paginate():
                for network_firewall in page["Firewalls"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            network_firewall["FirewallArn"], self.audit_resources
                        )
                    ):
                        arn = network_firewall.get("FirewallArn", "")
                        self.network_firewalls[arn] = Firewall(
                            arn=network_firewall.get("FirewallArn"),
                            region=regional_client.region,
                            name=network_firewall.get("FirewallName"),
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_firewall(self, network_firewall):
        logger.info("Network Firewall - Describe Network Firewalls...")
        try:
            regional_client = self.regional_clients[network_firewall.region]
            describe_firewall = regional_client.describe_firewall(
                FirewallArn=network_firewall.arn,
            )["Firewall"]
            network_firewall.policy_arn = describe_firewall.get("FirewallPolicyArn")
            network_firewall.vpc_id = describe_firewall.get("VpcId")
            network_firewall.tags = describe_firewall.get("Tags", [])
            encryption_config = describe_firewall.get("EncryptionConfiguration", {})
            network_firewall.encryption_type = encryption_config.get("Type")
            network_firewall.deletion_protection = describe_firewall.get(
                "DeleteProtection", False
            )
            for subnet in describe_firewall.get("SubnetMappings", []):
                if subnet.get("SubnetId"):
                    network_firewall.subnet_mappings.append(
                        Subnet(
                            subnet_id=subnet.get("SubnetId"),
                            ip_addr_type=subnet.get(
                                "IPAddressType", IPAddressType.IPV4
                            ),
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _describe_firewall_policy(self, network_firewall):
        logger.info("Network Firewall - Describe Network Firewall Policies...")
        try:
            regional_client = self.regional_clients[network_firewall.region]
            describe_firewall_policy = regional_client.describe_firewall_policy(
                FirewallPolicyArn=network_firewall.policy_arn,
            )
            firewall_policy = describe_firewall_policy.get("FirewallPolicy", {})
            network_firewall.stateless_rule_groups = [
                group.get("ResourceArn", "")
                for group in firewall_policy.get("StatelessRuleGroupReferences", [])
            ]
            network_firewall.stateful_rule_groups = [
                group.get("ResourceArn", "")
                for group in firewall_policy.get("StatefulRuleGroupReferences", [])
            ]
            network_firewall.default_stateless_actions = firewall_policy.get(
                "StatelessDefaultActions", []
            )
            network_firewall.default_stateless_frag_actions = firewall_policy.get(
                "StatelessFragmentDefaultActions", []
            )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _describe_logging_configuration(self, network_firewall):
        logger.info(
            "Network Firewall - Describe Network Firewalls Logging Configuration..."
        )
        try:
            describe_logging_configuration = (
                self.regional_clients[network_firewall.region]
                .describe_logging_configuration(FirewallArn=network_firewall.arn)
                .get("LoggingConfiguration", {})
            )
            destination_configs = describe_logging_configuration.get(
                "LogDestinationConfigs", []
            )
            network_firewall.logging_configuration = []
            if destination_configs:
                for log_destination_config in destination_configs:
                    log_type = LogType(log_destination_config.get("LogType", "FLOW"))
                    log_destination_type = LogDestinationType(
                        log_destination_config.get("LogDestinationType", "S3")
                    )
                    log_destination = log_destination_config.get("LogDestination", {})
                    network_firewall.logging_configuration.append(
                        LoggingConfiguration(
                            log_type=log_type,
                            log_destination_type=log_destination_type,
                            log_destination=log_destination,
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )


class LogType(Enum):
    """Log Type for Network Firewall"""

    alert = "ALERT"
    flow = "FLOW"
    tls = "TLS"


class LogDestinationType(Enum):
    """Log Destination Type for Network Firewall"""

    s3 = "S3"
    cloudwatch_logs = "CloudWatchLogs"
    kinesis_data_firehose = "KinesisDataFirehose"


class LoggingConfiguration(BaseModel):
    """Logging Configuration for Network Firewall"""

    log_type: LogType
    log_destination_type: LogDestinationType
    log_destination: dict = {}


class IPAddressType(Enum):
    """Enum for IP Address Type"""

    IPV4 = "IPV4"
    IPV6 = "IPV6"
    DUALSTACK = "DUALSTACK"


class Subnet(BaseModel):
    """Subnet model for SubnetMappings"""

    subnet_id: str
    ip_addr_type: IPAddressType


class Firewall(BaseModel):
    """Firewall Model for Network Firewall"""

    arn: str
    name: str
    region: str
    policy_arn: str = None
    vpc_id: str = None
    tags: list = []
    encryption_type: str = None
    deletion_protection: bool = False
    default_stateless_actions: list = []
    default_stateless_frag_actions: list = []
    subnet_mappings: list[Subnet] = []
    logging_configuration: Optional[list[LoggingConfiguration]]
    stateless_rule_groups: list[str] = []
    stateful_rule_groups: list[str] = []
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_deletion_protection.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_deletion_protection/networkfirewall_deletion_protection.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "networkfirewall_deletion_protection",
  "CheckTitle": "Network Firewall has deletion protection enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "networkfirewall",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsNetworkFirewallFirewall",
  "Description": "**AWS Network Firewall firewalls** have **deletion protection** enabled (`DeleteProtection=true`).",
  "Risk": "Without deletion protection, a firewall can be removed accidentally or by a compromised identity, letting traffic bypass inspection and logging.\n\nThis threatens **confidentiality** and **integrity** via unfiltered access, and harms **availability** through routing disruption and loss of perimeter controls.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/networkfirewall-controls.html#networkfirewall-9"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws network-firewall update-firewall-delete-protection --firewall-name <FIREWALL_NAME> --delete-protection",
      "NativeIaC": "```yaml\n# CloudFormation: enable deletion protection on a Network Firewall\nResources:\n  <example_resource_name>:\n    Type: AWS::NetworkFirewall::Firewall\n    Properties:\n      FirewallName: <example_resource_name>  # Required: unique name for the firewall\n      FirewallPolicyArn: <example_resource_id>\n      VpcId: <example_resource_id>\n      SubnetMappings:\n        - SubnetId: <example_resource_id>\n      DeleteProtection: true  # Critical: enables deletion protection to pass the check\n```",
      "Other": "1. Open the AWS console and go to VPC > Network Firewall > Firewalls\n2. Select the target firewall\n3. On Firewall details, choose Edit (or Change protections)\n4. Enable Deletion protection\n5. Save changes",
      "Terraform": "```hcl\n# Terraform: enable deletion protection on a Network Firewall\nresource \"aws_networkfirewall_firewall\" \"<example_resource_name>\" {\n  name                = \"<example_resource_name>\"\n  firewall_policy_arn = \"<example_resource_id>\"\n  vpc_id              = \"<example_resource_id>\"\n\n  subnet_mapping {\n    subnet_id = \"<example_resource_id>\"\n  }\n\n  delete_protection = true  # Critical: prevents deletion to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **deletion protection** on every firewall (`DeleteProtection=true`). Enforce **least privilege** to prevent delete actions, require **change approval** for firewall modifications, and implement guardrails with policy-as-code. Apply **defense in depth** so alternate controls contain traffic if a firewall is altered.",
      "Url": "https://hub.prowler.com/check/networkfirewall_deletion_protection"
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

---[FILE: networkfirewall_deletion_protection.py]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_deletion_protection/networkfirewall_deletion_protection.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.networkfirewall.networkfirewall_client import (
    networkfirewall_client,
)


class networkfirewall_deletion_protection(Check):
    def execute(self):
        findings = []
        for firewall in networkfirewall_client.network_firewalls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=firewall)
            report.status = "FAIL"
            report.status_extended = f"Network Firewall {firewall.name} does not have deletion protection enabled."
            if firewall.deletion_protection:
                report.status = "PASS"
                report.status_extended = (
                    f"Network Firewall {firewall.name} has deletion protection enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_in_all_vpc.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_in_all_vpc/networkfirewall_in_all_vpc.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "networkfirewall_in_all_vpc",
  "CheckTitle": "VPC has Network Firewall enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "networkfirewall",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEc2Vpc",
  "Description": "**VPCs** with an **AWS Network Firewall** associated to the same VPC to inspect and filter network traffic.\n\nIdentifies VPCs that do not have a Network Firewall resource linked to them.",
  "Risk": "Without a **Network Firewall**, VPC traffic can bypass deep inspection and centralized policy enforcement, enabling **data exfiltration**, **command-and-control**, and **lateral movement**. Confidentiality is reduced by unmonitored flows; integrity and availability are threatened by malware and disruptive traffic.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/network-firewall/latest/developerguide/vpc-config.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/NetworkFirewall/network-firewall-in-use.html",
    "https://docs.aws.amazon.com/network-firewall/latest/developerguide/setting-up.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws network-firewall create-firewall --firewall-name <example_resource_name> --firewall-policy-arn <example_resource_id> --vpc-id <example_resource_id> --subnet-mappings \"SubnetId=<example_resource_id>\"",
      "NativeIaC": "```yaml\n# CloudFormation: Create a Network Firewall in the VPC\nResources:\n  <example_resource_name>:\n    Type: AWS::NetworkFirewall::Firewall\n    Properties:\n      FirewallName: <example_resource_name>\n      FirewallPolicyArn: <example_resource_id>  # Critical: required policy for the firewall\n      VpcId: <example_resource_id>              # Critical: associates the firewall to the target VPC (fixes the check)\n      SubnetMappings:                           # Critical: creates firewall endpoints in the VPC\n        - SubnetId: <example_resource_id>\n```",
      "Other": "1. In the AWS Console, go to Network Firewall > Firewalls > Create firewall\n2. Enter a name and select the target VPC\n3. Select an existing Firewall policy (or create one when prompted)\n4. Add at least one subnet from the VPC under Subnet mappings\n5. Choose Create firewall\n6. Verify the firewall shows under the selected VPC",
      "Terraform": "```hcl\n# Create a Network Firewall in the VPC\nresource \"aws_networkfirewall_firewall\" \"<example_resource_name>\" {\n  name                = \"<example_resource_name>\"\n  firewall_policy_arn = \"<example_resource_id>\"  # Critical: required policy\n  vpc_id              = \"<example_resource_id>\"  # Critical: associates firewall to the VPC (fixes the check)\n\n  subnet_mapping {                                # Critical: creates firewall endpoint in the VPC\n    subnet_id = \"<example_resource_id>\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Deploy **AWS Network Firewall** in each VPC or centralize inspection through a dedicated hub VPC.\n\nAdopt a `default-deny` posture with least-privilege rules, restrict egress to required destinations, segment workloads (**defense in depth**, **zero trust**), and enable logging to monitor and tune network policies.",
      "Url": "https://hub.prowler.com/check/networkfirewall_in_all_vpc"
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

---[FILE: networkfirewall_in_all_vpc.py]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_in_all_vpc/networkfirewall_in_all_vpc.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.networkfirewall.networkfirewall_client import (
    networkfirewall_client,
)
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class networkfirewall_in_all_vpc(Check):
    def execute(self):
        findings = []
        for vpc in vpc_client.vpcs.values():
            if vpc_client.provider.scan_unused_services or vpc.in_use:
                report = Check_Report_AWS(metadata=self.metadata(), resource=vpc)
                report.status = "FAIL"
                report.status_extended = f"VPC {vpc.name if vpc.name else vpc.id} does not have Network Firewall enabled."
                for firewall in networkfirewall_client.network_firewalls.values():
                    if firewall.vpc_id == vpc.id:
                        report.status = "PASS"
                        report.status_extended = f"VPC {vpc.name if vpc.name else vpc.id} has Network Firewall enabled."
                        break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_logging_enabled/networkfirewall_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "networkfirewall_logging_enabled",
  "CheckTitle": "Network Firewall has logging enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)"
  ],
  "ServiceName": "networkfirewall",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsNetworkFirewallFirewall",
  "Description": "**AWS Network Firewall** has stateful engine logging configured with at least one log type (`FLOW`, `ALERT`, or `TLS`) and an active log destination",
  "Risk": "Absent Network Firewall logs reduce **visibility** and **forensics**. Malicious flows, C2 traffic, and data exfiltration can go **undetected**, impacting:\n- Confidentiality (leakage)\n- Integrity (unauthorized traffic allowed)\n- Availability (DDoS patterns unnoticed)",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/network-firewall/latest/developerguide/firewall-logging.html",
    "https://docs.aws.amazon.com/network-firewall/latest/developerguide/firewall-update-logging-configuration.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/networkfirewall-controls.html#networkfirewall-2"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws network-firewall update-logging-configuration --firewall-arn <FIREWALL_ARN> --logging-configuration 'LogDestinationConfigs=[{LogType=FLOW,LogDestinationType=CLOUDWATCH_LOGS,LogDestination={LogGroup=<LOG_GROUP_NAME>}}]'",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::NetworkFirewall::LoggingConfiguration\n    Properties:\n      FirewallArn: <example_resource_id>  # CRITICAL: Targets the firewall to enable logging\n      LoggingConfiguration:\n        LogDestinationConfigs:\n          - LogType: FLOW                  # CRITICAL: Enables at least one log type\n            LogDestinationType: CloudWatchLogs  # CRITICAL: Selects a valid destination type\n            LogDestination:\n              logGroup: <example_log_group_name>  # CRITICAL: Existing CloudWatch Logs group to receive logs\n```",
      "Other": "1. Open the AWS console and go to VPC > Network Firewall > Firewalls\n2. Select your firewall and open the Firewall details tab\n3. In the Logging section, click Edit\n4. Enable at least one Log type (e.g., Flow)\n5. Choose Destination type: CloudWatch Logs and select an existing log group\n6. Click Save",
      "Terraform": "```hcl\nresource \"aws_networkfirewall_logging_configuration\" \"<example_resource_name>\" {\n  firewall_arn = \"<example_resource_id>\"  # CRITICAL: Targets the firewall to enable logging\n\n  logging_configuration {\n    log_destination_config {\n      log_type             = \"FLOW\"              # CRITICAL: Enables at least one log type\n      log_destination_type = \"CloudWatchLogs\"   # CRITICAL: Selects a valid destination type\n      log_destination = {\n        logGroup = \"<example_log_group_name>\"   # CRITICAL: Existing CloudWatch Logs group to receive logs\n      }\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable comprehensive firewall logging and send `FLOW`, `ALERT`, and *when applicable* `TLS` events to a centralized, tamper-resistant destination. Apply **least privilege** to writers/readers, enforce **encryption** and **retention**, and integrate alerts with monitoring for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/networkfirewall_logging_enabled"
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

````
