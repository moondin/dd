---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 243
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 243 of 867)

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

---[FILE: backup_service.py]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_service.py
Signals: Pydantic

```python
from datetime import datetime
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Backup(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.backup_plan_arn_template = f"arn:{self.audited_partition}:backup:{self.region}:{self.audited_account}:backup-plan"
        self.report_plan_arn_template = f"arn:{self.audited_partition}:backup:{self.region}:{self.audited_account}:report-plan"
        self.backup_vault_arn_template = f"arn:{self.audited_partition}:backup:{self.region}:{self.audited_account}:backup-vault"
        self.backup_vaults = []
        self.__threading_call__(self._list_backup_vaults)
        if self.backup_vaults is not None:
            self.__threading_call__(self._list_tags, self.backup_vaults)
        self.backup_plans = []
        self.__threading_call__(self._list_backup_plans)
        self.__threading_call__(self._list_tags, self.backup_plans)
        self.backup_report_plans = []
        self.__threading_call__(self._list_backup_report_plans)
        self.protected_resources = []
        self.__threading_call__(self._list_backup_selections)
        self.recovery_points = []
        self.__threading_call__(self._list_recovery_points)
        self.__threading_call__(self._list_tags, self.recovery_points)

    def _list_backup_vaults(self, regional_client):
        logger.info("Backup - Listing Backup Vaults...")
        try:
            list_backup_vaults_paginator = regional_client.get_paginator(
                "list_backup_vaults"
            )
            for page in list_backup_vaults_paginator.paginate():
                for configuration in page.get("BackupVaultList"):
                    if not self.audit_resources or (
                        is_resource_filtered(
                            configuration.get("BackupVaultArn"),
                            self.audit_resources,
                        )
                    ):
                        if self.backup_vaults is None:
                            self.backup_vaults = []
                        self.backup_vaults.append(
                            BackupVault(
                                arn=configuration.get("BackupVaultArn"),
                                name=configuration.get("BackupVaultName"),
                                region=regional_client.region,
                                encryption=configuration.get("EncryptionKeyArn"),
                                recovery_points=configuration.get(
                                    "NumberOfRecoveryPoints"
                                ),
                                locked=configuration.get("Locked"),
                                min_retention_days=configuration.get(
                                    "MinRetentionDays"
                                ),
                                max_retention_days=configuration.get(
                                    "MaxRetentionDays"
                                ),
                            )
                        )
        except ClientError as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            if error.response["Error"]["Code"] == "AccessDeniedException":
                if not self.backup_vaults:
                    self.backup_vaults = None
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_backup_plans(self, regional_client):
        logger.info("Backup - Listing Backup Plans...")
        try:
            list_backup_plans_paginator = regional_client.get_paginator(
                "list_backup_plans"
            )
            for page in list_backup_plans_paginator.paginate():
                for configuration in page.get("BackupPlansList"):
                    if not self.audit_resources or (
                        is_resource_filtered(
                            configuration.get("BackupPlanArn"),
                            self.audit_resources,
                        )
                    ):
                        self.backup_plans.append(
                            BackupPlan(
                                arn=configuration.get("BackupPlanArn"),
                                id=configuration.get("BackupPlanId"),
                                region=regional_client.region,
                                name=configuration.get("BackupPlanName"),
                                version_id=configuration.get("VersionId"),
                                last_execution_date=configuration.get(
                                    "LastExecutionDate"
                                ),
                                advanced_settings=configuration.get(
                                    "AdvancedBackupSettings", []
                                ),
                            )
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_backup_report_plans(self, regional_client):
        logger.info("Backup - Listing Backup Report Plans...")

        try:
            list_backup_report_plans = regional_client.list_report_plans()[
                "ReportPlans"
            ]
            for backup_report_plan in list_backup_report_plans:
                if not self.audit_resources or (
                    is_resource_filtered(
                        backup_report_plan.get("ReportPlanArn"),
                        self.audit_resources,
                    )
                ):
                    self.backup_report_plans.append(
                        BackupReportPlan(
                            arn=backup_report_plan.get("ReportPlanArn"),
                            region=regional_client.region,
                            name=backup_report_plan.get("ReportPlanName"),
                            last_attempted_execution_date=backup_report_plan.get(
                                "LastAttemptedExecutionTime"
                            ),
                            last_successful_execution_date=backup_report_plan.get(
                                "LastSuccessfulExecutionTime"
                            ),
                        )
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_backup_selections(self, regional_client):
        logger.info("Backup - Listing Backup Selections...")
        try:
            for backup_plan in self.backup_plans:
                paginator = regional_client.get_paginator("list_backup_selections")
                for page in paginator.paginate(BackupPlanId=backup_plan.id):
                    for selection in page.get("BackupSelectionsList", []):
                        selection_id = selection.get("SelectionId")
                        if selection_id:
                            backup_selection = regional_client.get_backup_selection(
                                BackupPlanId=backup_plan.id, SelectionId=selection_id
                            )["BackupSelection"]

                            self.protected_resources.extend(
                                backup_selection.get("Resources", [])
                            )

        except ClientError as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags(self, resource):
        try:
            if getattr(resource, "arn", None):
                tags = self.regional_clients[resource.region].list_tags(
                    ResourceArn=resource.arn
                )["Tags"]
                resource.tags = [tags] if tags else []
        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_recovery_points(self, regional_client):
        logger.info("Backup - Listing Recovery Points...")
        try:
            if self.backup_vaults:
                for backup_vault in self.backup_vaults:
                    paginator = regional_client.get_paginator(
                        "list_recovery_points_by_backup_vault"
                    )
                    for page in paginator.paginate(BackupVaultName=backup_vault.name):
                        for recovery_point in page.get("RecoveryPoints", []):
                            arn = recovery_point.get("RecoveryPointArn")
                            if arn:
                                self.recovery_points.append(
                                    RecoveryPoint(
                                        arn=arn,
                                        id=arn.split(":")[-1],
                                        backup_vault_name=backup_vault.name,
                                        encrypted=recovery_point.get(
                                            "IsEncrypted", False
                                        ),
                                        backup_vault_region=backup_vault.region,
                                        region=regional_client.region,
                                        tags=[],
                                    )
                                )
        except ClientError as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class BackupVault(BaseModel):
    arn: str
    name: str
    region: str
    encryption: str
    recovery_points: int
    locked: bool
    min_retention_days: int = None
    max_retention_days: int = None
    tags: Optional[list] = None


class BackupPlan(BaseModel):
    arn: str
    id: str
    region: str
    name: str
    version_id: str
    last_execution_date: Optional[datetime] = None
    advanced_settings: list
    tags: Optional[list] = None


class BackupReportPlan(BaseModel):
    arn: str
    region: str
    name: str
    last_attempted_execution_date: Optional[datetime] = None
    last_successful_execution_date: Optional[datetime] = None


class RecoveryPoint(BaseModel):
    arn: str
    id: str
    region: str
    backup_vault_name: str
    encrypted: bool
    backup_vault_region: str
    tags: Optional[list] = None
```

--------------------------------------------------------------------------------

---[FILE: backup_plans_exist.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_plans_exist/backup_plans_exist.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "backup_plans_exist",
  "CheckTitle": "At least one AWS Backup plan exists",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "backup",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsBackupBackupPlan",
  "Description": "**AWS Backup** is assessed for the existence of at least one **backup plan** that schedules and retains recovery points for selected resources.\n\nThe evaluation determines whether any plan is configured; when none is found-even if backup vaults exist-the absence of a plan is noted.",
  "Risk": "Without a backup plan, resources lack scheduled recovery points, undermining RPO/RTO.\n- Irrecoverable data after deletion or corruption (integrity)\n- Prolonged outages due to unavailable restores (availability)\n- Inconsistent backups that hinder investigations and controlled recovery",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://awscli.amazonaws.com/v2/documentation/api/2.0.33/reference/backup/create-backup-plan.html",
    "https://docs.aws.amazon.com/aws-backup/latest/devguide/about-backup-plans.html",
    "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/backup_plan",
    "https://medium.com/@christopheradamson253/backup-strategies-using-aws-backup-1b17b94a7957"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws backup create-backup-plan --backup-plan \"{\\\"BackupPlanName\\\":\\\"<example_resource_name>\\\",\\\"Rules\\\":[{\\\"RuleName\\\":\\\"<example_resource_name>\\\",\\\"TargetBackupVaultName\\\":\\\"Default\\\"}]}\"",
      "NativeIaC": "```yaml\n# CloudFormation: create a minimal AWS Backup Plan to pass the check\nResources:\n  <example_resource_name>:\n    Type: AWS::Backup::BackupPlan\n    Properties:\n      BackupPlan:\n        BackupPlanName: <example_resource_name>  # Critical: ensures at least one Backup Plan exists\n        Rules:\n          - RuleName: <example_resource_name>     # Critical: minimal required rule\n            TargetBackupVault: Default            # Critical: required vault for the rule\n```",
      "Other": "1. In the AWS Console, go to AWS Backup\n2. Click Backup plans > Create backup plan\n3. Choose Build a new plan\n4. Enter Plan name: <example_resource_name>\n5. Under Backup rule, set Rule name: <example_resource_name> and Target backup vault: Default\n6. Click Create plan",
      "Terraform": "```hcl\n# Terraform: minimal AWS Backup Plan to satisfy the check\nresource \"aws_backup_plan\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"  # Critical: creates the Backup Plan so the check passes\n\n  rule {\n    rule_name         = \"<example_resource_name>\"  # Critical: minimal rule\n    target_vault_name = \"Default\"                  # Critical: required vault\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Establish and enforce **backup plans** for critical workloads:\n- Define schedules, retention, and lifecycle to meet RPO/RTO\n- Use tagging to include all required resources by policy\n- Enable cross-Region/account copies and immutability where feasible\n- Apply least privilege to backup roles\n- Regularly test restores and review reports",
      "Url": "https://hub.prowler.com/check/backup_plans_exist"
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

---[FILE: backup_plans_exist.py]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_plans_exist/backup_plans_exist.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.backup.backup_client import backup_client


class backup_plans_exist(Check):
    def execute(self):
        findings = []
        if backup_client.backup_plans:
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=backup_client.backup_plans[0],
            )
            report.status = "PASS"
            report.status_extended = f"At least one Backup Plan exists: {backup_client.backup_plans[0].name}."
            report.resource_id = backup_client.backup_plans[0].name
            findings.append(report)
        elif backup_client.backup_vaults:
            report = Check_Report_AWS(metadata=self.metadata(), resource={})
            report.region = backup_client.region
            report.status = "FAIL"
            report.status_extended = "No Backup Plan exist."
            report.resource_arn = backup_client.backup_plan_arn_template
            report.resource_id = backup_client.audited_account
            report.resource_tags = []
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: backup_recovery_point_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_recovery_point_encrypted/backup_recovery_point_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "backup_recovery_point_encrypted",
  "CheckTitle": "AWS Backup recovery point is encrypted at rest",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "backup",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsBackupRecoveryPoint",
  "Description": "**AWS Backup recovery points** are evaluated for **encryption at rest** using the backup vault's KMS configuration. Items lacking vault-level encryption are highlighted, regardless of the source resource's encryption.",
  "Risk": "Unencrypted recovery points can be read or copied if vault access is obtained, enabling offline analysis and data theft (**confidentiality**). Snapshots or restores may be altered (**integrity**), and unsafe restores can disrupt recovery operations (**availability**).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/backup-controls.html#backup-1",
    "https://readmedium.com/how-would-you-desgin-a-solution-for-autmated-backup-and-recovery-of-data-and-services-in-aws-311662f5a43e",
    "https://docs.aws.amazon.com/aws-backup/latest/devguide/encryption.html",
    "https://medium.com/cloud-devops-security-ai-career-talk/how-would-you-desgin-a-solution-for-autmated-backup-and-recovery-of-data-and-services-in-aws-311662f5a43e",
    "https://github.com/turbot/steampipe-mod-aws-compliance/issues/598"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Encrypted AWS Backup Vault\nResources:\n  <example_resource_name>:\n    Type: AWS::Backup::BackupVault\n    Properties:\n      BackupVaultName: <example_resource_name>\n      EncryptionKeyArn: <kms_key_arn>  # Critical: vault uses this KMS key so recovery points stored here are encrypted at rest\n```",
      "Other": "1. In AWS Backup, go to Backup vaults > Create backup vault\n2. Enter a name and select a KMS key (aws/backup or a customer-managed key)\n3. Save the vault\n4. Go to Backup plans > select your plan > Edit and set the Target backup vault to the encrypted vault > Save\n5. To remediate existing unencrypted recovery points: Recovery points > select the item > Copy > choose the encrypted vault > Start copy, then delete the original unencrypted recovery point",
      "Terraform": "```hcl\n# Encrypted AWS Backup Vault\nresource \"aws_backup_vault\" \"<example_resource_name>\" {\n  name        = \"<example_resource_name>\"\n  kms_key_arn = \"<kms_key_arn>\" # Critical: ensures recovery points in this vault are encrypted at rest\n}\n```"
    },
    "Recommendation": {
      "Text": "Encrypt all recovery points with **KMS**, preferring **customer-managed keys** for rotation and control. Apply **least privilege** to keys and vaults, require encrypted copies across accounts/Regions, and continuously monitor for unencrypted artifacts. Use `aws/backup` or `CMEK` consistently.",
      "Url": "https://hub.prowler.com/check/backup_recovery_point_encrypted"
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

---[FILE: backup_recovery_point_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_recovery_point_encrypted/backup_recovery_point_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.backup.backup_client import backup_client


class backup_recovery_point_encrypted(Check):
    def execute(self):
        findings = []
        for recovery_point in backup_client.recovery_points:
            report = Check_Report_AWS(metadata=self.metadata(), resource=recovery_point)
            report.region = recovery_point.backup_vault_region
            report.status = "FAIL"
            report.status_extended = f"Backup Recovery Point {recovery_point.id} for Backup Vault {recovery_point.backup_vault_name} is not encrypted at rest."
            if recovery_point.encrypted:
                report.status = "PASS"
                report.status_extended = f"Backup Recovery Point {recovery_point.id} for Backup Vault {recovery_point.backup_vault_name} is encrypted at rest."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: backup_reportplans_exist.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_reportplans_exist/backup_reportplans_exist.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "backup_reportplans_exist",
  "CheckTitle": "At least one AWS Backup report plan exists",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "backup",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsBackupBackupPlan",
  "Description": "**AWS Backup** environments with existing backup plans are assessed for the presence of at least one **report plan** that generates `jobs` or `compliance` reports.",
  "Risk": "Without a report plan, backup failures and missed restores may go unnoticed, harming **availability** and recovery objectives. Gaps in retention, scheduling, or encryption controls can persist unreported, weakening **integrity** and auditability across accounts and Regions, increasing the chance of SLA breaches.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/aws-backup/latest/devguide/create-report-plan-console.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws backup create-report-plan --report-plan-name <REPORT_PLAN_NAME> --report-delivery-channel s3BucketName=<S3_BUCKET_NAME>,formats=CSV --report-setting reportTemplate=BACKUP_JOB_REPORT",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::Backup::ReportPlan\n    Properties:\n      ReportPlanName: <example_resource_name> # Critical: creates the report plan required to pass the check\n      ReportDeliveryChannel:\n        S3BucketName: <example_resource_name> # Critical: destination bucket for reports\n        Formats:\n          - CSV # Critical: valid report file format\n      ReportSetting:\n        ReportTemplate: BACKUP_JOB_REPORT # Critical: minimal template to enable job reports\n```",
      "Other": "1. Open the AWS Backup console and go to Reports\n2. Click Create report plan\n3. Select the Backup jobs (job report) template\n4. Enter a Report plan name and choose an S3 bucket\n5. Select CSV as the file format\n6. Click Create report plan",
      "Terraform": "```hcl\nresource \"aws_backup_report_plan\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\" # Critical: creates at least one report plan\n\n  report_delivery_channel {\n    s3_bucket_name = \"<example_resource_name>\" # Critical: destination bucket for reports\n    formats        = [\"CSV\"] # Critical: valid report file format\n  }\n\n  report_setting {\n    report_template = \"BACKUP_JOB_REPORT\" # Critical: minimal job report template\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Establish and maintain **report plans** to continuously monitor backup activity and policy adherence.\n- Apply least privilege to report storage\n- Include relevant accounts and Regions for coverage\n- Review reports routinely and alert on anomalies\n- Enforce separation of duties between backup admins and auditors",
      "Url": "https://hub.prowler.com/check/backup_reportplans_exist"
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

---[FILE: backup_reportplans_exist.py]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_reportplans_exist/backup_reportplans_exist.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.backup.backup_client import backup_client


class backup_reportplans_exist(Check):
    def execute(self):
        findings = []
        # We only check report plans if backup plans exist
        if backup_client.backup_plans:
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=backup_client.backup_plans[0],
            )
            report.resource_arn = backup_client.report_plan_arn_template
            report.resource_id = backup_client.audited_account
            report.status = "FAIL"
            report.status_extended = "No Backup Report Plan exist."

            if backup_client.backup_report_plans:
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=backup_client.backup_report_plans[0],
                )
                report.status = "PASS"
                report.status_extended = f"At least one backup report plan exists: {backup_client.backup_report_plans[0].name}."
                report.resource_arn = backup_client.backup_report_plans[0].arn
                report.resource_id = backup_client.backup_report_plans[0].name
                report.region = backup_client.backup_report_plans[0].region

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: backup_vaults_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_vaults_encrypted/backup_vaults_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "backup_vaults_encrypted",
  "CheckTitle": "AWS Backup vault is encrypted at rest",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST CSF Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Software and Configuration Checks/Industry and Regulatory Standards/ISO 27001 Controls",
    "Software and Configuration Checks/Industry and Regulatory Standards/HIPAA Controls (USA)"
  ],
  "ServiceName": "backup",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsBackupBackupVault",
  "Description": "**AWS Backup vaults** are evaluated for **encryption at rest** with **AWS KMS**. The finding highlights vaults without a configured KMS key protecting stored recovery points.",
  "Risk": "Unencrypted vaults allow recovery points to be read if storage or credentials are compromised, undermining **confidentiality** and enabling data exfiltration. Missing KMS controls also weaken **integrity** guarantees and impede forensic **auditability** during investigations.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/aws-backup/latest/devguide/encryption.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Athena/encrypted-with-cmk.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Encrypted AWS Backup Vault\nResources:\n  <example_resource_name>:\n    Type: AWS::Backup::BackupVault\n    Properties:\n      BackupVaultName: <example_resource_name>\n      EncryptionKeyArn: <kms_key_arn>  # CRITICAL: sets KMS key to encrypt the vault at rest\n```",
      "Other": "1. In the AWS Console, go to AWS Backup > Backup vaults\n2. Click Create backup vault\n3. Set Name to <example_resource_name>\n4. Under Encryption key, select a customer managed KMS key (<kms_key_arn>)\n5. Click Create backup vault\n6. Update any Backup plans to use the new vault (Plans > select plan > Edit > change Target vault name)\n7. Delete the old unencrypted vault after it is empty (select vault > Delete backup vault)",
      "Terraform": "```hcl\n# Encrypted AWS Backup Vault\nresource \"aws_backup_vault\" \"<example_resource_name>\" {\n  name        = \"<example_resource_name>\"\n  kms_key_arn = \"<kms_key_arn>\"  # CRITICAL: enables encryption at rest for the vault\n}\n```"
    },
    "Recommendation": {
      "Text": "Encrypt every backup vault with **customer-managed KMS keys** (`CMK`). Enforce **least privilege** in key policies, enable rotation, and separate key admins from backup operators. Add **defense-in-depth** with vault lock and logging. *For copies*, ensure destination vaults use appropriate KMS keys.",
      "Url": "https://hub.prowler.com/check/backup_vaults_encrypted"
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

---[FILE: backup_vaults_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_vaults_encrypted/backup_vaults_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.backup.backup_client import backup_client


class backup_vaults_encrypted(Check):
    def execute(self):
        findings = []
        if backup_client.backup_vaults:
            for backup_vault in backup_client.backup_vaults:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=backup_vault
                )
                report.status = "FAIL"
                report.status_extended = (
                    f"Backup Vault {backup_vault.name} is not encrypted at rest."
                )
                if backup_vault.encryption:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Backup Vault {backup_vault.name} is encrypted at rest."
                    )
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: backup_vaults_exist.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_vaults_exist/backup_vaults_exist.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "backup_vaults_exist",
  "CheckTitle": "At least one AWS Backup vault exists",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "backup",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsBackupBackupVault",
  "Description": "**AWS Backup** in the account/region includes at least one **backup vault** that stores and organizes recovery points for use by backup plans and copies.",
  "Risk": "Without a vault, recovery points cannot be created or retained in AWS Backup, degrading **availability** and **integrity**. Data may be irrecoverable after deletion, ransomware, or misconfiguration, and RPO/RTO targets may be missed during incidents.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/aws-backup/latest/devguide/vaults.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws backup create-backup-vault --backup-vault-name <example_resource_name>",
      "NativeIaC": "```yaml\n# CloudFormation: create a Backup Vault\nResources:\n  BackupVault:\n    Type: AWS::Backup::BackupVault\n    Properties:\n      VaultName: <example_resource_name>  # Critical: creates a backup vault to satisfy the check\n```",
      "Other": "1. Sign in to the AWS Management Console and open the AWS Backup console\n2. In the left navigation pane, select Backup vaults\n3. Click Create backup vault\n4. Enter a name (e.g., <example_resource_name>)\n5. Click Create backup vault",
      "Terraform": "```hcl\n# Create a Backup Vault\nresource \"aws_backup_vault\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\" # Critical: ensures at least one backup vault exists\n}\n```"
    },
    "Recommendation": {
      "Text": "Create and maintain a **backup vault** in each required region. Enforce **least privilege** access, encrypt with **KMS CMKs**, and enable **Vault Lock** to prevent tampering. Use lifecycle rules and cross-region/cross-account copies, and regularly test restores for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/backup_vaults_exist"
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

---[FILE: backup_vaults_exist.py]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_vaults_exist/backup_vaults_exist.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.backup.backup_client import backup_client


class backup_vaults_exist(Check):
    def execute(self):
        findings = []
        if backup_client.backup_vaults is not None:
            report = Check_Report_AWS(metadata=self.metadata(), resource={})
            report.resource_arn = backup_client.backup_vault_arn_template
            report.resource_id = backup_client.audited_account
            report.region = backup_client.region
            report.resource_tags = []
            report.status = "FAIL"
            report.status_extended = "No Backup Vault exist."
            if backup_client.backup_vaults:
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=backup_client.backup_vaults[0],
                )
                report.status = "PASS"
                report.status_extended = f"At least one backup vault exists: {backup_client.backup_vaults[0].name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: bedrock_agent_client.py]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_agent_client.py

```python
from prowler.providers.aws.services.bedrock.bedrock_service import BedrockAgent
from prowler.providers.common.provider import Provider

bedrock_agent_client = BedrockAgent(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: bedrock_client.py]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_client.py

```python
from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock
from prowler.providers.common.provider import Provider

bedrock_client = Bedrock(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
