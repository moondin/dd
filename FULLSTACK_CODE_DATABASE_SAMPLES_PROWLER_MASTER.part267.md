---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 267
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 267 of 867)

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

---[FILE: ec2_client_vpn_endpoint_connection_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_client_vpn_endpoint_connection_logging_enabled/ec2_client_vpn_endpoint_connection_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_client_vpn_endpoint_connection_logging_enabled",
  "CheckTitle": "EC2 Client VPN endpoints should have client connection logging enabled.",
  "CheckType": [],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "low",
  "ResourceType": "AwsEc2ClientVpnEndpoint",
  "Description": "This control checks whether an AWS Client VPN endpoint has client connection logging enabled. The control fails if the endpoint doesn't have client connection logging enabled.",
  "Risk": "Client VPN endpoints allow remote clients to securely connect to resources in a Virtual Private Cloud (VPC) in AWS. Connection logs allow you to track user activity on the VPN endpoint and provides visibility.",
  "RelatedUrl": "https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html#ec2-51",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To enable connection logging, see Enable connection logging for an existing Client VPN endpoint in the AWS Client VPN Administrator Guide.",
      "Url": "https://docs.aws.amazon.com/config/latest/developerguide/ec2-client-vpn-connection-log-enabled.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_client_vpn_endpoint_connection_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_client_vpn_endpoint_connection_logging_enabled/ec2_client_vpn_endpoint_connection_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_client_vpn_endpoint_connection_logging_enabled(Check):
    def execute(self):
        findings = []
        for vpn_arn, vpn_endpoint in ec2_client.vpn_endpoints.items():
            report = Check_Report_AWS(metadata=self.metadata(), resource=vpn_endpoint)

            if vpn_endpoint.connection_logging:
                report.status = "PASS"
                report.status_extended = f"Client VPN endpoint {vpn_endpoint.id} in region {vpn_endpoint.region} has client connection logging enabled."
            else:
                report.status = "FAIL"
                report.status_extended = f"Client VPN endpoint {vpn_endpoint.id} in region {vpn_endpoint.region} does not have client connection logging enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_default_encryption.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_default_encryption/ec2_ebs_default_encryption.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_ebs_default_encryption",
  "CheckTitle": "Check if EBS Default Encryption is activated.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "ebs",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Check if EBS Default Encryption is activated.",
  "Risk": "If not enabled sensitive information at rest is not protected.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 enable-ebs-encryption-by-default",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/general-policies/ensure-ebs-default-encryption-is-enabled#aws-console",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/ensure-ebs-default-encryption-is-enabled#terraform"
    },
    "Recommendation": {
      "Text": "Enable Encryption. Use a CMK where possible. It will provide additional management and privacy benefits.",
      "Url": "https://aws.amazon.com/premiumsupport/knowledge-center/ebs-automatic-encryption/"
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

---[FILE: ec2_ebs_default_encryption.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_default_encryption/ec2_ebs_default_encryption.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_ebs_default_encryption(Check):
    def execute(self):
        findings = []
        for ebs_encryption in ec2_client.ebs_encryption_by_default:
            if ebs_encryption.volumes or ec2_client.provider.scan_unused_services:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=ebs_encryption
                )
                report.resource_arn = ec2_client._get_volume_arn_template(
                    ebs_encryption.region
                )
                report.resource_id = ec2_client.audited_account
                report.status = "FAIL"
                report.status_extended = "EBS Default Encryption is not activated."
                if ebs_encryption.status:
                    report.status = "PASS"
                    report.status_extended = "EBS Default Encryption is activated."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_default_encryption_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_default_encryption/ec2_ebs_default_encryption_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


def fixer(region):
    """
    Enable EBS encryption by default in a region. NOTE: Custom KMS keys for EBS Default Encryption may be overwritten.
    Requires the ec2:EnableEbsEncryptionByDefault permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "ec2:EnableEbsEncryptionByDefault",
                "Resource": "*"
            }
        ]
    }
    Args:
        region (str): AWS region
    Returns:
        bool: True if EBS encryption by default is enabled, False otherwise
    """
    try:
        regional_client = ec2_client.regional_clients[region]
        return regional_client.enable_ebs_encryption_by_default()[
            "EbsEncryptionByDefault"
        ]
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_public_snapshot.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_public_snapshot/ec2_ebs_public_snapshot.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_ebs_public_snapshot",
  "CheckTitle": "Ensure there are no EBS Snapshots set as Public.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "snapshot",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "Other",
  "Description": "Ensure there are no EBS Snapshots set as Public.",
  "Risk": "When you share a snapshot, you are giving others access to all of the data on the snapshot. Share snapshots only with people with whom you want to share all of your snapshot data.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 modify-snapshot-attribute --region <REGION> --snapshot-id <EC2_SNAPSHOT_ID> --attribute createVolumePermission --operation remove --user-ids all",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/public-policies/public_7",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure the snapshot should be shared.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-modifying-snapshot-permissions.html"
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

---[FILE: ec2_ebs_public_snapshot.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_public_snapshot/ec2_ebs_public_snapshot.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_ebs_public_snapshot(Check):
    def execute(self):
        findings = []
        for snapshot in ec2_client.snapshots:
            report = Check_Report_AWS(metadata=self.metadata(), resource=snapshot)
            report.status = "PASS"
            report.status_extended = f"EBS Snapshot {snapshot.id} is not Public."
            if snapshot.public:
                report.status = "FAIL"
                report.status_extended = (
                    f"EBS Snapshot {snapshot.id} is currently Public."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_public_snapshot_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_public_snapshot/ec2_ebs_public_snapshot_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the attributes of an EBS snapshot to remove public access.
    Specifically, this fixer removes the 'all' value from the 'createVolumePermission' attribute to
    prevent the snapshot from being publicly accessible. Requires the ec2:ModifySnapshotAttribute permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "ec2:ModifySnapshotAttribute",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The snapshot identifier.
        region (str): AWS region where the snapshot exists.
    Returns:
        bool: True if the operation is successful (public access is removed), False otherwise.
    """
    try:
        regional_client = ec2_client.regional_clients[region]
        regional_client.modify_snapshot_attribute(
            SnapshotId=resource_id,
            Attribute="createVolumePermission",
            OperationType="remove",
            GroupNames=["all"],
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

---[FILE: ec2_ebs_snapshots_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_snapshots_encrypted/ec2_ebs_snapshots_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_ebs_snapshots_encrypted",
  "CheckTitle": "Check if EBS snapshots are encrypted.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "snapshot",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Check if EBS snapshots are encrypted.",
  "Risk": "Data encryption at rest prevents data visibility in the event of its unauthorized access or theft.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 --region <REGION> enable-ebs-encryption-by-default",
      "NativeIaC": "https://docs.prowler.com/checks/aws/general-policies/general_3-encrypt-ebs-volume#cloudformation",
      "Other": "https://docs.prowler.com/checks/aws/general-policies/general_3-encrypt-ebs-volume#aws-console",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/general_3-encrypt-ebs-volume#terraform"
    },
    "Recommendation": {
      "Text": "Encrypt all EBS Snapshot and Enable Encryption by default. You can configure your AWS account to enforce the encryption of the new EBS volumes and snapshot copies that you create. For example, Amazon EBS encrypts the EBS volumes created when you launch an instance and the snapshots that you copy from an unencrypted snapshot.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#encryption-by-default"
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

---[FILE: ec2_ebs_snapshots_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_snapshots_encrypted/ec2_ebs_snapshots_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_ebs_snapshots_encrypted(Check):
    def execute(self):
        findings = []
        for snapshot in ec2_client.snapshots:
            report = Check_Report_AWS(metadata=self.metadata(), resource=snapshot)
            report.status = "PASS"
            report.status_extended = f"EBS Snapshot {snapshot.id} is encrypted."
            if not snapshot.encrypted:
                report.status = "FAIL"
                report.status_extended = f"EBS Snapshot {snapshot.id} is unencrypted."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_snapshot_account_block_public_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_snapshot_account_block_public_access/ec2_ebs_snapshot_account_block_public_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_ebs_snapshot_account_block_public_access",
  "CheckTitle": "Ensure that public access to EBS snapshots is disabled",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "snapshot",
  "ResourceIdTemplate": "arn:partition:service:region:account-id",
  "Severity": "high",
  "ResourceType": "AwsAccount",
  "Description": "EBS snapshots can be shared with other AWS accounts or made public. By default, EBS snapshots are private and only the AWS account that created the snapshot can access it. If an EBS snapshot is shared with another AWS account or made public, the data in the snapshot can be accessed by the other account or by anyone on the internet. Ensure that public access to EBS snapshots is disabled.",
  "Risk": "If public access to EBS snapshots is enabled, the data in the snapshot can be accessed by anyone on the internet.",
  "RelatedUrl": "https://docs.aws.amazon.com/ebs/latest/userguide/block-public-access-snapshots-work.html#block-public-access-snapshots-enable",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 enable-snapshot-block-public-access --state block-all-sharing",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use the following procedures to configure and monitor block public access for snapshots.",
      "Url": "https://docs.aws.amazon.com/ebs/latest/userguide/block-public-access-snapshots-work.html#block-public-access-snapshots-enable"
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

---[FILE: ec2_ebs_snapshot_account_block_public_access.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_snapshot_account_block_public_access/ec2_ebs_snapshot_account_block_public_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_ebs_snapshot_account_block_public_access(Check):
    def execute(self):
        findings = []
        for (
            ebs_snapshot_block_status
        ) in ec2_client.ebs_block_public_access_snapshots_states:
            if (
                ebs_snapshot_block_status.snapshots
                or ec2_client.provider.scan_unused_services
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=ebs_snapshot_block_status,
                )
                report.resource_arn = ec2_client.account_arn_template
                report.resource_id = ec2_client.audited_account
                if ebs_snapshot_block_status.status == "block-all-sharing":
                    report.status = "PASS"
                    report.status_extended = (
                        "Public access is blocked for all EBS Snapshots."
                    )
                elif ebs_snapshot_block_status.status == "block-new-sharing":
                    report.status = "FAIL"
                    report.status_extended = (
                        "Public access is blocked only for new EBS Snapshots."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        "Public access is not blocked for EBS Snapshots."
                    )
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_snapshot_account_block_public_access_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_snapshot_account_block_public_access/ec2_ebs_snapshot_account_block_public_access_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


def fixer(region):
    """
    Enable EBS snapshot block public access in a region.
    Requires the ec2:EnableSnapshotBlockPublicAccess permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "ec2:EnableSnapshotBlockPublicAccess",
                "Resource": "*"
            }
        ]
    }
    Args:
        region (str): AWS region
    Returns:
        bool: True if EBS snapshot block public access is enabled, False otherwise
    """
    try:
        regional_client = ec2_client.regional_clients[region]
        state = ec2_client.fixer_config.get(
            "ec2_ebs_snapshot_account_block_public_access", {}
        ).get("State", "block-all-sharing")
        return (
            regional_client.enable_snapshot_block_public_access(State=state)["State"]
            == state
        )
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_volume_encryption.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_volume_encryption/ec2_ebs_volume_encryption.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_ebs_volume_encryption",
  "CheckTitle": "Ensure there are no EBS Volumes unencrypted.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "volume",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Volume",
  "Description": "Ensure there are no EBS Volumes unencrypted.",
  "Risk": "Data encryption at rest prevents data visibility in the event of its unauthorized access or theft.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Encrypt all EBS volumes and Enable Encryption by default You can configure your AWS account to enforce the encryption of the new EBS volumes and snapshot copies that you create. For example, Amazon EBS encrypts the EBS volumes created when you launch an instance and the snapshots that you copy from an unencrypted snapshot.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html"
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

---[FILE: ec2_ebs_volume_encryption.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_volume_encryption/ec2_ebs_volume_encryption.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_ebs_volume_encryption(Check):
    def execute(self):
        findings = []
        for volume in ec2_client.volumes:
            report = Check_Report_AWS(metadata=self.metadata(), resource=volume)
            report.status = "PASS"
            report.status_extended = f"EBS Snapshot {volume.id} is encrypted."
            if not volume.encrypted:
                report.status = "FAIL"
                report.status_extended = f"EBS Snapshot {volume.id} is unencrypted."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_volume_protected_by_backup_plan.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_volume_protected_by_backup_plan/ec2_ebs_volume_protected_by_backup_plan.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_ebs_volume_protected_by_backup_plan",
  "CheckTitle": "Amazon EBS volumes should be protected by a backup plan.",
  "CheckType": [
    "Software and Configuration Checks, AWS Security Best Practices"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:volume/volume-id",
  "Severity": "low",
  "ResourceType": "AwsEc2Volume",
  "Description": "Evaluates if an Amazon EBS volume in in-use state is covered by a backup plan. The check fails if an EBS volume isn't covered by a backup plan. If you set the backupVaultLockCheck parameter equal to true, the control passes only if the EBS volume is backed up in an AWS Backup locked vault.",
  "Risk": "Without backup coverage, Amazon EBS volumes are vulnerable to data loss or deletion, reducing the resilience of your systems and making recovery from incidents more difficult.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/ebs-resources-protected-by-backup-plan.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html#ec2-28",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that all in-use Amazon EBS volumes are included in a backup plan, and consider using AWS Backup Vault Lock for additional protection.",
      "Url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html"
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

---[FILE: ec2_ebs_volume_protected_by_backup_plan.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_volume_protected_by_backup_plan/ec2_ebs_volume_protected_by_backup_plan.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.backup.backup_client import backup_client
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_ebs_volume_protected_by_backup_plan(Check):
    def execute(self):
        findings = []
        for volume in ec2_client.volumes:
            report = Check_Report_AWS(metadata=self.metadata(), resource=volume)
            report.status = "FAIL"
            report.status_extended = (
                f"EBS Volume {volume.id} is not protected by a backup plan."
            )
            if (
                volume.arn in backup_client.protected_resources
                or f"arn:{ec2_client.audited_partition}:ec2:*:*:volume/*"
                in backup_client.protected_resources
                or "*" in backup_client.protected_resources
            ):
                report.status = "PASS"
                report.status_extended = (
                    f"EBS Volume {volume.id} is protected by a backup plan."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_volume_snapshots_exists.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_volume_snapshots_exists/ec2_ebs_volume_snapshots_exists.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_ebs_volume_snapshots_exists",
  "CheckTitle": "Check if EBS snapshots exists.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "volume",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Volume",
  "Description": "Check if EBS snapshots exists.",
  "Risk": "Ensure that your EBS volumes (available or in-use) have recent snapshots (taken weekly) available for point-in-time recovery for a better, more reliable data backup strategy.",
  "RelatedUrl": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSSnapshots.html",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 --region <REGION> create-snapshot --volume-id <VOLUME-ID>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/EBS/ebs-volumes-recent-snapshots.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Creating point-in-time EBS snapshots periodically will allow you to handle efficiently your data recovery process in the event of a failure, to save your data before shutting down an EC2 instance, to back up data for geographical expansion and to maintain your disaster recovery stack up to date.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSSnapshots.html"
    }
  },
  "Categories": [
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_volume_snapshots_exists.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_ebs_volume_snapshots_exists/ec2_ebs_volume_snapshots_exists.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_ebs_volume_snapshots_exists(Check):
    def execute(self):
        findings = []
        for volume in ec2_client.volumes:
            report = Check_Report_AWS(metadata=self.metadata(), resource=volume)
            report.status = "FAIL"
            report.status_extended = (
                f"Snapshots not found for the EBS volume {volume.id}."
            )
            if ec2_client.volumes_with_snapshots.get(volume.id, False):
                report.status = "PASS"
                report.status_extended = (
                    f"Snapshots found for the EBS volume {volume.id}."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_elastic_ip_shodan.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_elastic_ip_shodan/ec2_elastic_ip_shodan.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_elastic_ip_shodan",
  "CheckTitle": "Check if any of the Elastic or Public IP are in Shodan (requires Shodan API KEY).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsEc2Eip",
  "Description": "Check if any of the Elastic or Public IP are in Shodan (requires Shodan API KEY).",
  "Risk": "Sites like Shodan index exposed systems and further expose them to wider audiences as a quick way to find exploitable systems.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Check Identified IPs, consider changing them to private ones and delete them from Shodan.",
      "Url": "https://www.shodan.io/"
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

---[FILE: ec2_elastic_ip_shodan.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_elastic_ip_shodan/ec2_elastic_ip_shodan.py

```python
import shodan

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_elastic_ip_shodan(Check):
    def execute(self):
        findings = []
        shodan_api_key = ec2_client.audit_config.get("shodan_api_key")
        if shodan_api_key:
            api = shodan.Shodan(shodan_api_key)
            for eip in ec2_client.elastic_ips:
                report = Check_Report_AWS(metadata=self.metadata(), resource=eip)
                if eip.public_ip:
                    try:
                        shodan_info = api.host(eip.public_ip)
                        report.status = "FAIL"
                        report.status_extended = f"Elastic IP {eip.public_ip} listed in Shodan with open ports {str(shodan_info['ports'])} and ISP {shodan_info['isp']} in {shodan_info['country_name']}. More info at https://www.shodan.io/host/{eip.public_ip}."
                        report.resource_id = eip.public_ip
                        findings.append(report)
                    except shodan.APIError as error:
                        if "No information available for that IP" in error.value:
                            report.status = "PASS"
                            report.status_extended = (
                                f"Elastic IP {eip.public_ip} is not listed in Shodan."
                            )
                            report.resource_id = eip.public_ip
                            findings.append(report)
                            continue
                        else:
                            logger.error(f"Unknown Shodan API Error: {error.value}")

        else:
            logger.error(
                "No Shodan API Key -- Please input a Shodan API Key with -N/--shodan or in config.yaml"
            )
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_elastic_ip_unassigned.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_elastic_ip_unassigned/ec2_elastic_ip_unassigned.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_elastic_ip_unassigned",
  "CheckTitle": "Check if there is any unassigned Elastic IP.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "low",
  "ResourceType": "AwsEc2Eip",
  "Description": "Check if there is any unassigned Elastic IP.",
  "Risk": "Unassigned Elastic IPs may result in extra cost.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 release-address --public-ip <theIPyoudontneed>",
      "NativeIaC": "https://docs.prowler.com/checks/aws/general-policies/general_19#cloudformation",
      "Other": "https://docs.prowler.com/checks/aws/general-policies/general_19#ec2-console",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/general_19#terraform"
    },
    "Recommendation": {
      "Text": "Ensure Elastic IPs are not unassigned.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_elastic_ip_unassigned.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_elastic_ip_unassigned/ec2_elastic_ip_unassigned.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_elastic_ip_unassigned(Check):
    def execute(self):
        findings = []
        for eip in ec2_client.elastic_ips:
            report = Check_Report_AWS(metadata=self.metadata(), resource=eip)
            if eip.public_ip:
                report.resource_id = eip.public_ip
                report.status = "FAIL"
                report.status_extended = f"Elastic IP {eip.public_ip} is not associated with an instance or network interface."
                if eip.association_id:
                    report.status = "PASS"
                    report.status_extended = f"Elastic IP {eip.public_ip} is associated with an instance or network interface."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_account_imdsv2_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_account_imdsv2_enabled/ec2_instance_account_imdsv2_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_account_imdsv2_enabled",
  "CheckTitle": "Ensure Instance Metadata Service Version 2 (IMDSv2) is enforced for EC2 instances at the account level to protect against SSRF vulnerabilities.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id",
  "Severity": "high",
  "ResourceType": "AwsAccount",
  "Description": "Ensure Instance Metadata Service Version 2 (IMDSv2) is enforced for EC2 instances at the account level to protect against SSRF vulnerabilities.",
  "Risk": "EC2 instances that use IMDSv1 are vulnerable to SSRF attacks.",
  "RelatedUrl": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-IMDS-new-instances.html#set-imdsv2-account-defaults",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 modify-instance-metadata-defaults --region <region> --http-tokens required --http-put-response-hop-limit 2",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable Instance Metadata Service Version 2 (IMDSv2) on the EC2 instances. Apply this configuration at the account level for each AWS Region to set the default instance metadata version.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-IMDS-new-instances.html#set-imdsv2-account-defaults"
    }
  },
  "Categories": [
    "internet-exposed",
    "ec2-imdsv1"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_account_imdsv2_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_account_imdsv2_enabled/ec2_instance_account_imdsv2_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_instance_account_imdsv2_enabled(Check):
    def execute(self):
        findings = []
        for instance_metadata_default in ec2_client.instance_metadata_defaults:
            if (
                instance_metadata_default.instances
                or ec2_client.provider.scan_unused_services
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=instance_metadata_default,
                )
                report.resource_arn = ec2_client.account_arn_template
                report.resource_id = ec2_client.audited_account
                if instance_metadata_default.http_tokens == "required":
                    report.status = "PASS"
                    report.status_extended = (
                        "IMDSv2 is enabled by default for EC2 instances."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        "IMDSv2 is not enabled by default for EC2 instances."
                    )
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_account_imdsv2_enabled_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_account_imdsv2_enabled/ec2_instance_account_imdsv2_enabled_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


def fixer(region):
    """
    Enable IMDSv2 for EC2 instances in the specified region.
    Requires the ec2:ModifyInstanceMetadataDefaults permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "ec2:ModifyInstanceMetadataDefaults",
                "Resource": "*"
            }
        ]
    }
    Args:
        region (str): AWS region
    Returns:
        bool: True if IMDSv2 is enabled, False otherwise
    """

    try:
        regional_client = ec2_client.regional_clients[region]
        return regional_client.modify_instance_metadata_defaults(HttpTokens="required")[
            "Return"
        ]
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_detailed_monitoring_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_detailed_monitoring_enabled/ec2_instance_detailed_monitoring_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_detailed_monitoring_enabled",
  "CheckTitle": "Check if EC2 instances have detailed monitoring enabled.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "low",
  "ResourceType": "AwsEc2Instance",
  "Description": "Check if EC2 instances have detailed monitoring enabled.",
  "Risk": "Enabling detailed monitoring provides enhanced monitoring and granular insights into EC2 instance metrics. Not having detailed monitoring enabled may limit the ability to troubleshoot performance issues effectively.",
  "RelatedUrl": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 monitor-instances --instance-ids <EC2_INSTANCE_ID>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/EC2/instance-detailed-monitoring.html",
      "Terraform": "https://docs.prowler.com/checks/aws/logging-policies/ensure-that-detailed-monitoring-is-enabled-for-ec2-instances#terraform"
    },
    "Recommendation": {
      "Text": "Enable detailed monitoring for EC2 instances to gain better insights into performance metrics.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html#enable-detailed-monitoring-instance"
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
