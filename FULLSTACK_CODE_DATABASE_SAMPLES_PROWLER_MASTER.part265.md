---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 265
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 265 of 867)

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

---[FILE: dynamodb_tables_kms_cmk_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_tables_kms_cmk_encryption_enabled/dynamodb_tables_kms_cmk_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dynamodb_tables_kms_cmk_encryption_enabled",
  "CheckTitle": "DynamoDB table is encrypted at rest with AWS KMS",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "dynamodb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDynamoDbTable",
  "Description": "**DynamoDB tables** use **AWS KMS keys** (`KMS`) for encryption at rest instead of the default service-owned key",
  "Risk": "Relying on the default service-owned key reduces control over **confidentiality**: no custom key policies, limited auditability, and no independent rotation or disablement. This weakens least-privilege enforcement and incident response, and can impede meeting mandates that require customer-controlled keys.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.prowler.com/checks/aws/general-policies/ensure-that-dynamodb-tables-are-encrypted#terraform",
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/EncryptionAtRest.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dynamodb update-table --table-name <example_resource_name> --sse-specification Enabled=true,SSEType=KMS",
      "NativeIaC": "```yaml\n# CloudFormation: Enable KMS encryption on a DynamoDB table\nResources:\n  <example_resource_name>:\n    Type: AWS::DynamoDB::Table\n    Properties:\n      AttributeDefinitions:\n        - AttributeName: id\n          AttributeType: S\n      KeySchema:\n        - AttributeName: id\n          KeyType: HASH\n      BillingMode: PAY_PER_REQUEST\n      SSESpecification:\n        SSEEnabled: true  # Critical: enables KMS-based encryption\n        SSEType: KMS      # Critical: switches from DEFAULT to AWS KMS\n```",
      "Other": "1. Open the AWS Management Console and go to DynamoDB\n2. Select your table\n3. In Table details, find Encryption at rest and click Edit\n4. Select AWS KMS: choose AWS managed key (alias/aws/dynamodb) or a customer managed key\n5. Click Save",
      "Terraform": "```hcl\nresource \"aws_dynamodb_table\" \"<example_resource_name>\" {\n  name         = \"<example_resource_name>\"\n  billing_mode = \"PAY_PER_REQUEST\"\n  hash_key     = \"id\"\n\n  attribute {\n    name = \"id\"\n    type = \"S\"\n  }\n\n  server_side_encryption {\n    enabled = true  # Critical: enables AWS KMS encryption (uses AWS managed key if no key ARN provided)\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Encrypt tables with **KMS keys** in your account-prefer **customer-managed keys** for sensitive data.\n\n- Enforce least-privilege key policies and scope grants\n- Enable rotation and monitor key usage\n- Separate duties for key admins vs data users\n- Restrict which principals can use the key for DynamoDB",
      "Url": "https://hub.prowler.com/check/dynamodb_tables_kms_cmk_encryption_enabled"
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

---[FILE: dynamodb_tables_kms_cmk_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_tables_kms_cmk_encryption_enabled/dynamodb_tables_kms_cmk_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dynamodb.dynamodb_client import dynamodb_client


class dynamodb_tables_kms_cmk_encryption_enabled(Check):
    def execute(self):
        findings = []
        for table in dynamodb_client.tables.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=table)
            report.status = "FAIL"
            report.status_extended = (
                f"DynamoDB table {table.name} is using DEFAULT encryption."
            )
            if table.encryption_type == "KMS":
                report.status = "PASS"
                report.status_extended = f"DynamoDB table {table.name} has KMS encryption enabled with key {table.kms_arn.split('/')[1]}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_tables_pitr_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_tables_pitr_enabled/dynamodb_tables_pitr_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dynamodb_tables_pitr_enabled",
  "CheckTitle": "DynamoDB table has point-in-time recovery (PITR) enabled",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Destruction"
  ],
  "ServiceName": "dynamodb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDynamoDbTable",
  "Description": "**DynamoDB tables** have **Point-in-Time Recovery** (`PITR`) enabled",
  "Risk": "Without **PITR**, unintended or malicious writes/deletes cannot be precisely rolled back, leading to permanent data loss and corrupted state. Failures from buggy deployments, compromised credentials, or faulty batch jobs reduce data **integrity** and **availability**, and prolong incident recovery and forensic analysis.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery_Howitworks.html",
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.Tutorial.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dynamodb update-continuous-backups --table-name <table_name> --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true",
      "NativeIaC": "```yaml\n# CloudFormation: enable PITR on a DynamoDB table\nResources:\n  <example_resource_name>:\n    Type: AWS::DynamoDB::Table\n    Properties:\n      PointInTimeRecoverySpecification:\n        PointInTimeRecoveryEnabled: true  # Critical: enables Point-in-Time Recovery (PITR)\n```",
      "Other": "1. Open the AWS Management Console and go to DynamoDB\n2. Select your table and open the Backups tab\n3. Click Edit in the Point-in-time recovery section and choose Turn on point-in-time recovery\n4. Click Save",
      "Terraform": "```hcl\n# Enable PITR on a DynamoDB table\nresource \"aws_dynamodb_table\" \"<example_resource_name>\" {\n  name         = \"<example_resource_name>\"\n  billing_mode = \"PAY_PER_REQUEST\"\n  hash_key     = \"id\"\n\n  attribute {\n    name = \"id\"\n    type = \"S\"\n  }\n\n  point_in_time_recovery {\n    enabled = true  # Critical: enables PITR\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **PITR** on critical tables and set a recovery window aligned to your RPO (1-35 days). Enforce **least privilege** on who can modify backup settings. Regularly test restores and monitor backup status. Embed PITR in IaC and change control for consistency, and apply **defense in depth** with on-demand backups for key milestones.",
      "Url": "https://hub.prowler.com/check/dynamodb_tables_pitr_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Data Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_tables_pitr_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_tables_pitr_enabled/dynamodb_tables_pitr_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dynamodb.dynamodb_client import dynamodb_client


class dynamodb_tables_pitr_enabled(Check):
    def execute(self):
        findings = []
        for table in dynamodb_client.tables.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=table)
            report.status = "FAIL"
            report.status_extended = f"DynamoDB table {table.name} does not have point-in-time recovery enabled."
            if table.pitr:
                report.status = "PASS"
                report.status_extended = (
                    f"DynamoDB table {table.name} has point-in-time recovery enabled."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_table_autoscaling_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_table_autoscaling_enabled/dynamodb_table_autoscaling_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dynamodb_table_autoscaling_enabled",
  "CheckTitle": "DynamoDB table uses on-demand capacity or has auto scaling enabled for read and write capacity units",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service",
    "Effects/Resource Consumption"
  ],
  "ServiceName": "dynamodb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDynamoDbTable",
  "Description": "**DynamoDB tables** use **automatic capacity scaling** via `on-demand` mode or `PROVISIONED` mode with **auto scaling** enabled for both `read` and `write` capacity units.\n\nProvisioned tables are evaluated for scaling on both dimensions.",
  "Risk": "**Insufficient capacity scaling** causes throttling that degrades **availability** and increases latency.\n\nSustained throttling can trigger retry storms, timeouts, and backlogs, risking missed writes or out-of-order processing that impacts **data integrity** and drives **operational costs**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/dynamodb-controls.html#dynamodb-1",
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/AutoScaling.Console.html#AutoScaling.Console.ExistingTable"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dynamodb update-table --table-name <table-name> --billing-mode PAY_PER_REQUEST",
      "NativeIaC": "```yaml\n# CloudFormation: Set table to on-demand capacity\nResources:\n  <example_resource_name>:\n    Type: AWS::DynamoDB::Table\n    Properties:\n      AttributeDefinitions:\n        - AttributeName: id\n          AttributeType: S\n      KeySchema:\n        - AttributeName: id\n          KeyType: HASH\n      BillingMode: PAY_PER_REQUEST  # Critical: enables on-demand capacity to pass the control\n```",
      "Other": "1. Open the AWS console and go to DynamoDB\n2. Click Tables and select your table\n3. Open the Additional settings tab and click Edit in Read/write capacity\n4. Set Capacity mode to On-demand (PAY_PER_REQUEST)\n5. Click Save",
      "Terraform": "```hcl\n# DynamoDB table with on-demand capacity\nresource \"aws_dynamodb_table\" \"<example_resource_name>\" {\n  name     = \"<example_resource_name>\"\n  hash_key = \"id\"\n\n  attribute {\n    name = \"id\"\n    type = \"S\"\n  }\n\n  billing_mode = \"PAY_PER_REQUEST\" # Critical: enables on-demand capacity to pass the control\n}\n```"
    },
    "Recommendation": {
      "Text": "Adopt **elastic capacity**: prefer `on-demand` for unpredictable traffic, or use `PROVISIONED` with **auto scaling** on both reads and writes.\n\nDefine safe utilization targets and bounds, monitor consumption, and plan for bursts to maintain **availability** and **resilience** over manual fixed throughput.",
      "Url": "https://hub.prowler.com/check/dynamodb_table_autoscaling_enabled"
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

---[FILE: dynamodb_table_autoscaling_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_table_autoscaling_enabled/dynamodb_table_autoscaling_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.autoscaling.applicationautoscaling_client import (
    applicationautoscaling_client,
)
from prowler.providers.aws.services.dynamodb.dynamodb_client import dynamodb_client


class dynamodb_table_autoscaling_enabled(Check):
    def execute(self):
        findings = []
        scalable_targets = applicationautoscaling_client.scalable_targets
        dynamodb_scalable_targets = [
            target
            for target in scalable_targets
            if target.service_namespace == "dynamodb"
            and target.resource_id.startswith("table/")
        ]
        autoscaling_mapping = {}
        for target in dynamodb_scalable_targets:
            table_name = target.resource_id.split("/")[1]
            if table_name not in autoscaling_mapping:
                autoscaling_mapping[table_name] = {}
            autoscaling_mapping[table_name][target.scalable_dimension] = target

        for table in dynamodb_client.tables.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=table)
            report.status = "PASS"
            report.status_extended = (
                f"DynamoDB table {table.name} automatically scales capacity on demand."
            )
            if table.billing_mode == "PROVISIONED":
                read_autoscaling = False
                write_autoscaling = False

                if table.name in autoscaling_mapping:
                    if (
                        "dynamodb:table:ReadCapacityUnits"
                        in autoscaling_mapping[table.name]
                    ):
                        read_autoscaling = True
                    if (
                        "dynamodb:table:WriteCapacityUnits"
                        in autoscaling_mapping[table.name]
                    ):
                        write_autoscaling = True

                if read_autoscaling and write_autoscaling:
                    report.status = "PASS"
                    report.status_extended = f"DynamoDB table {table.name} is in provisioned mode with auto scaling enabled for both read and write capacity units."
                else:
                    missing_autoscaling = []
                    if not read_autoscaling:
                        missing_autoscaling.append("read")
                    if not write_autoscaling:
                        missing_autoscaling.append("write")

                    if missing_autoscaling:
                        report.status = "FAIL"
                        report.status_extended = f"DynamoDB table {table.name} is in provisioned mode without auto scaling enabled for {', '.join(missing_autoscaling)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_table_cross_account_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_table_cross_account_access/dynamodb_table_cross_account_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dynamodb_table_cross_account_access",
  "CheckTitle": "DynamoDB table resource-based policy does not allow cross-account access",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "TTPs/Initial Access/Unauthorized Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "dynamodb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDynamoDbTable",
  "Description": "**DynamoDB tables** are evaluated for **resource-based policies** that permit cross-account or public principals.\n\nTables without a resource policy, or with policies restricted to the same account, are identified as isolated configurations.",
  "Risk": "Allowing other accounts to access a table affects:\n- **Confidentiality**: unauthorized reads/data exfiltration\n- **Integrity**: writes or deletes by external principals\n- **Availability**: capacity exhaustion and throttling\n- **Cost**: owner pays for external requests\n\nIf public principals are allowed, exposure can be unrestricted.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://support.icompaas.com/support/solutions/articles/62000233614-ensure-dynamodb-tables-should-not-be-accessible-from-other-aws-accounts",
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/access-control-resource-based.html",
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/rbac-bpa-rbp.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dynamodb delete-resource-policy --resource-arn <resource-arn>",
      "NativeIaC": "",
      "Other": "1. Open the AWS Console and go to DynamoDB > Tables\n2. Select <example_resource_name> and open the Permissions tab\n3. In Resource-based policy, click Delete policy and confirm\n4. Save changes to remove any cross-account access",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Apply **least privilege**:\n- Avoid cross-account data access; *if required*, allow only named principals\n- Constrain with `aws:PrincipalOrgID`, `aws:SourceVpc`, `aws:PrincipalArn`; add `Deny` guardrails\n- Enable **Block Public Access** and monitor with **IAM Access Analyzer**",
      "Url": "https://hub.prowler.com/check/dynamodb_table_cross_account_access"
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

---[FILE: dynamodb_table_cross_account_access.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_table_cross_account_access/dynamodb_table_cross_account_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dynamodb.dynamodb_client import dynamodb_client
from prowler.providers.aws.services.iam.lib.policy import is_policy_public


class dynamodb_table_cross_account_access(Check):
    def execute(self):
        findings = []
        for table in dynamodb_client.tables.values():
            if table.policy is None:
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=table)
            report.status = "PASS"
            report.status_extended = (
                f"DynamoDB table {table.name} does not have a resource-based policy."
            )
            if table.policy:
                report.status_extended = f"DynamoDB table {table.name} has a resource-based policy but is not cross account."
                if is_policy_public(
                    table.policy,
                    dynamodb_client.audited_account,
                    is_cross_account_allowed=False,
                ):
                    report.status = "FAIL"
                    report.status_extended = f"DynamoDB table {table.name} has a resource-based policy allowing cross account access."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_table_deletion_protection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_table_deletion_protection_enabled/dynamodb_table_deletion_protection_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dynamodb_table_deletion_protection_enabled",
  "CheckTitle": "DynamoDB table has deletion protection enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Destruction"
  ],
  "ServiceName": "dynamodb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDynamoDbTable",
  "Description": "**DynamoDB tables** have **deletion protection** enabled via the `deletion protection` setting, meaning delete operations require this setting to be disabled first",
  "Risk": "Without **deletion protection**, tables can be removed by authorized actions or misconfigured automation, causing irrecoverable data loss and service outage. This impacts **integrity** and **availability**, and increases the blast radius of compromised credentials or mistaken runbooks.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/dynamodb-controls.html#dynamodb-6",
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithTables.Basics.html#WorkingWithTables.Basics.DeletionProtection"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dynamodb update-table --table-name <TABLE_NAME> --deletion-protection-enabled",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::DynamoDB::Table\n    Properties:\n      DeletionProtectionEnabled: true  # CRITICAL: Enables deletion protection to prevent table deletion\n```",
      "Other": "1. Open the AWS Management Console and go to DynamoDB\n2. Select the table\n3. Choose Additional settings\n4. Enable Deletion protection\n5. Save changes",
      "Terraform": "```hcl\nresource \"aws_dynamodb_table\" \"<example_resource_name>\" {\n  name     = \"<example_resource_name>\"\n  hash_key = \"id\"\n\n  attribute {\n    name = \"id\"\n    type = \"S\"\n  }\n\n  deletion_protection_enabled = true  # CRITICAL: Prevents accidental table deletion\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **deletion protection** on critical tables.\n- Enforce **least privilege** to restrict who can modify this setting\n- Require change control to disable it before planned deletes\n- Combine with **PITR** and backups for defense in depth\n- Use automation to make this the default for new tables",
      "Url": "https://hub.prowler.com/check/dynamodb_table_deletion_protection_enabled"
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

---[FILE: dynamodb_table_deletion_protection_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_table_deletion_protection_enabled/dynamodb_table_deletion_protection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dynamodb.dynamodb_client import dynamodb_client


class dynamodb_table_deletion_protection_enabled(Check):
    def execute(self):
        findings = []
        for table in dynamodb_client.tables.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=table)
            report.status = "FAIL"
            report.status_extended = f"DynamoDB table {table.name} does not have deletion protection enabled."

            if table.deletion_protection:
                report.status = "PASS"
                report.status_extended = (
                    f"DynamoDB table {table.name} has deletion protection enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_table_protected_by_backup_plan.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_table_protected_by_backup_plan/dynamodb_table_protected_by_backup_plan.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dynamodb_table_protected_by_backup_plan",
  "CheckTitle": "DynamoDB table is protected by a backup plan",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "dynamodb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDynamoDbTable",
  "Description": "**DynamoDB tables** are evaluated for inclusion in an **AWS Backup backup plan** through resource assignments, including explicit tables, resource-type wildcards, or all-resources coverage.\n\nThe result indicates whether a table is governed by scheduled backups and retention defined by the plan.",
  "Risk": "Without a backup plan, table data lacks governed copies, harming **availability** and **integrity**. Accidental deletes, corrupt writes, or malicious actions can become unrecoverable, and RPO/RTO worsen. You also forfeit cross-Region/account copies and immutability features, increasing downtime and data loss.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html",
    "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/CreateBackupAWS.html",
    "https://aws.amazon.com/blogs/database/set-up-scheduled-backups-for-amazon-dynamodb-using-aws-backup/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Add DynamoDB tables to an AWS Backup plan\nResources:\n  BackupPlan:\n    Type: AWS::Backup::BackupPlan\n    Properties:\n      BackupPlan:\n        BackupPlanName: <example_resource_name>\n        BackupPlanRule:\n          - RuleName: r\n            TargetBackupVault: Default\n\n  BackupSelection:\n    Type: AWS::Backup::BackupSelection\n    Properties:\n      BackupPlanId: !Ref BackupPlan\n      BackupSelection:\n        SelectionName: <example_resource_name>\n        IamRoleArn: <example_role_arn>\n        Resources:\n          - arn:aws:dynamodb:*:*:table/*  # CRITICAL: adds all DynamoDB tables to the backup plan, making them protected\n```",
      "Other": "1. In the AWS Backup console, go to Settings > Configure resources and enable DynamoDB, then Confirm\n2. Go to Backup plans > Create backup plan > Build a new plan\n3. Enter a plan name, set Rule name to any value, set Backup vault to Default, and Create plan\n4. On the plan page, choose Assign resources\n5. Enter a Resource assignment name, set IAM role to Default role, select your DynamoDB table, and choose Assign resources",
      "Terraform": "```hcl\n# Terraform: Add DynamoDB tables to an AWS Backup plan\nresource \"aws_backup_plan\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n  rule {\n    rule_name         = \"r\"\n    target_vault_name = \"Default\"\n  }\n}\n\ndata \"aws_iam_role\" \"<example_resource_name>\" {\n  name = \"AWSServiceRoleForBackup\"\n}\n\nresource \"aws_backup_selection\" \"<example_resource_name>\" {\n  name         = \"<example_resource_name>\"\n  plan_id      = aws_backup_plan.<example_resource_name>.id\n  iam_role_arn = data.aws_iam_role.<example_resource_name>.arn\n  resources    = [\n    \"arn:aws:dynamodb:*:*:table/*\" # CRITICAL: adds all DynamoDB tables to the backup plan, making them protected\n  ]\n}\n```"
    },
    "Recommendation": {
      "Text": "Place all critical tables under an **AWS Backup backup plan** following **defense in depth** and **least privilege**:\n- Use tag-based assignments for coverage at scale\n- Define schedules, retention, and cross-Region/account copies\n- Enable **Vault Lock** for immutability\n- Regularly test restores and restrict backup deletion",
      "Url": "https://hub.prowler.com/check/dynamodb_table_protected_by_backup_plan"
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

---[FILE: dynamodb_table_protected_by_backup_plan.py]---
Location: prowler-master/prowler/providers/aws/services/dynamodb/dynamodb_table_protected_by_backup_plan/dynamodb_table_protected_by_backup_plan.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.backup.backup_client import backup_client
from prowler.providers.aws.services.dynamodb.dynamodb_client import dynamodb_client


class dynamodb_table_protected_by_backup_plan(Check):
    def execute(self):
        findings = []
        for table in dynamodb_client.tables.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=table)
            report.status = "FAIL"
            report.status_extended = (
                f"DynamoDB table {table.name} is not protected by a backup plan."
            )

            if (
                table.arn in backup_client.protected_resources
                or f"arn:{dynamodb_client.audited_partition}:dynamodb:*:*:table/*"
                in backup_client.protected_resources
                or "*" in backup_client.protected_resources
            ):
                report.status = "PASS"
                report.status_extended = (
                    f"DynamoDB table {table.name} is protected by a backup plan."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_client.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_client.py

```python
from prowler.providers.aws.services.ec2.ec2_service import EC2
from prowler.providers.common.provider import Provider

ec2_client = EC2(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
