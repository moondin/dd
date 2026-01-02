---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 289
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 289 of 867)

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

---[FILE: glue_etl_jobs_cloudwatch_logs_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_etl_jobs_cloudwatch_logs_encryption_enabled/glue_etl_jobs_cloudwatch_logs_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_etl_jobs_cloudwatch_logs_encryption_enabled",
  "CheckTitle": "Glue ETL job has CloudWatch Logs encryption enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsGlueJob",
  "Description": "**AWS Glue ETL jobs** are evaluated for a **security configuration** with **CloudWatch Logs encryption** (`SSE-KMS`) enabled. Jobs without a security configuration, or with CloudWatch Logs encryption set to `DISABLED`, are highlighted.",
  "Risk": "Unencrypted Glue logs weaken **confidentiality**.\n\nLog entries can expose credentials, PII, connection strings, and schema details. Anyone with log storage access can harvest secrets for **lateral movement** and data exfiltration, widening the blast radius of compromises.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/glue/latest/dg/console-security-configurations.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Glue/cloud-watch-logs-encryption-enabled.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: enable CloudWatch Logs encryption and attach to the job\nResources:\n  ExampleSecurityConfiguration:\n    Type: AWS::Glue::SecurityConfiguration\n    Properties:\n      Name: <example_resource_name>\n      EncryptionConfiguration:\n        CloudWatchEncryption:  # Critical: enable CloudWatch Logs encryption for Glue\n          CloudWatchEncryptionMode: SSE-KMS  # Critical: must not be DISABLED\n          KmsKeyArn: <example_kms_key_arn>   # Critical: KMS key used for encryption\n\n  ExampleJob:\n    Type: AWS::Glue::Job\n    Properties:\n      Role: <example_role_arn>\n      Command:\n        Name: glueetl\n        ScriptLocation: s3://<example_script_path>\n      SecurityConfiguration: !Ref ExampleSecurityConfiguration  # Critical: attach security configuration to the job\n```",
      "Other": "1. In the AWS Glue console, go to Security configurations > Add security configuration\n2. Enter a name, enable CloudWatch Logs encryption, select SSE-KMS, and choose/provide the KMS key ARN; Save\n3. Go to Jobs, select the target job, click Edit\n4. Set Security configuration to the one created in step 2\n5. Save changes",
      "Terraform": "```hcl\n# Enable CloudWatch Logs encryption and attach to the Glue job\nresource \"aws_glue_security_configuration\" \"example_resource_name\" {\n  name = \"<example_resource_name>\"\n\n  encryption_configuration {\n    cloudwatch_encryption {\n      cloudwatch_encryption_mode = \"SSE-KMS\"          # Critical: enable CW Logs encryption\n      kms_key_arn                = \"<example_kms_key_arn>\" # Critical: KMS key for encryption\n    }\n  }\n}\n\nresource \"aws_glue_job\" \"example_resource_name\" {\n  name     = \"<example_resource_name>\"\n  role_arn = \"<example_role_arn>\"\n\n  command {\n    name            = \"glueetl\"\n    script_location = \"s3://<example_script_path>\"\n  }\n\n  security_configuration = aws_glue_security_configuration.example_resource_name.name # Critical: attach security config to job\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **at-rest encryption** for Glue logs via a **security configuration** using customer-managed KMS keys. Apply **least privilege** to KMS and CloudWatch Logs, rotate keys, and require all jobs to attach an approved configuration. Embed this baseline in IaC for consistent, **defense-in-depth** coverage.",
      "Url": "https://hub.prowler.com/check/glue_etl_jobs_cloudwatch_logs_encryption_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Logging and Monitoring"
}
```

--------------------------------------------------------------------------------

---[FILE: glue_etl_jobs_cloudwatch_logs_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_etl_jobs_cloudwatch_logs_encryption_enabled/glue_etl_jobs_cloudwatch_logs_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client


class glue_etl_jobs_cloudwatch_logs_encryption_enabled(Check):
    def execute(self):
        findings = []
        for job in glue_client.jobs:
            no_sec_configs = True
            report = Check_Report_AWS(metadata=self.metadata(), resource=job)
            for sec_config in glue_client.security_configs:
                if sec_config.name == job.security:
                    no_sec_configs = False
                    report.status = "FAIL"
                    report.status_extended = f"Glue job {job.name} does not have CloudWatch Logs encryption enabled."
                    if sec_config.cw_encryption != "DISABLED":
                        report.status = "PASS"
                        report.status_extended = f"Glue job {job.name} has CloudWatch Logs encryption enabled with key {sec_config.cw_key_arn}."
            if no_sec_configs:
                report.status = "FAIL"
                report.status_extended = (
                    f"Glue job {job.name} does not have security configuration."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: glue_etl_jobs_job_bookmark_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_etl_jobs_job_bookmark_encryption_enabled/glue_etl_jobs_job_bookmark_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_etl_jobs_job_bookmark_encryption_enabled",
  "CheckTitle": "Glue ETL job has Job bookmark encryption enabled",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Glue ETL jobs** should link a **security configuration** with **job bookmark encryption** enabled. Bookmark encryption must not be `DISABLED` (e.g., use `CSE-KMS`). Jobs lacking a security configuration are treated as not protecting bookmark metadata.",
  "Risk": "Unencrypted **job bookmarks** in S3 expose execution state and data pointers, reducing **confidentiality**. Altered bookmarks can trigger reruns, skips, or reprocessing, harming **integrity**. Missing security configs may also leave logs and temporary objects unencrypted.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/glue/latest/dg/console-security-configurations.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Glue/job-bookmark-encryption-enabled.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Enable Glue Job bookmark encryption via Security Configuration\nResources:\n  <example_resource_name>:\n    Type: AWS::Glue::SecurityConfiguration\n    Properties:\n      Name: <example_resource_name>\n      EncryptionConfiguration:\n        JobBookmarksEncryption:\n          JobBookmarksEncryptionMode: CSE-KMS  # CRITICAL: Enables job bookmark encryption\n          KmsKeyArn: <example_kms_key_arn>     # CRITICAL: KMS key used to encrypt job bookmarks\n```",
      "Other": "1. In the AWS Console, go to AWS Glue > Security configurations > Add security configuration\n2. Enter a name and under Advanced settings enable Job bookmark encryption\n3. Select a KMS key (or paste the key ARN) and click Create\n4. Go to AWS Glue > Jobs, select the job, click Edit\n5. Under Advanced properties, set Security configuration to the one created above\n6. Click Save",
      "Terraform": "```hcl\n# Terraform: Enable Glue Job bookmark encryption via Security Configuration\nresource \"aws_glue_security_configuration\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  encryption_configuration {\n    job_bookmarks_encryption {\n      job_bookmarks_encryption_mode = \"CSE-KMS\"      # CRITICAL: Enables job bookmark encryption\n      kms_key_arn                    = \"<example_kms_key_arn>\"  # CRITICAL: KMS key for bookmarks\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Attach a **Glue security configuration** to every job and enable **job bookmark encryption** (e.g., `CSE-KMS`). Use **customer-managed KMS keys**, enforce **least privilege** on key usage, and rotate keys. For **defense in depth**, also encrypt **S3 temp data** and **CloudWatch logs** in the same configuration.",
      "Url": "https://hub.prowler.com/check/glue_etl_jobs_job_bookmark_encryption_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Logging and Monitoring"
}
```

--------------------------------------------------------------------------------

---[FILE: glue_etl_jobs_job_bookmark_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_etl_jobs_job_bookmark_encryption_enabled/glue_etl_jobs_job_bookmark_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client


class glue_etl_jobs_job_bookmark_encryption_enabled(Check):
    def execute(self):
        findings = []
        for job in glue_client.jobs:
            no_sec_configs = True
            report = Check_Report_AWS(metadata=self.metadata(), resource=job)
            for sec_config in glue_client.security_configs:
                if sec_config.name == job.security:
                    no_sec_configs = False
                    report.status = "FAIL"
                    report.status_extended = f"Glue job {job.name} does not have Job bookmark encryption enabled."
                    if sec_config.jb_encryption != "DISABLED":
                        report.status = "PASS"
                        report.status_extended = f"Glue job {job.name} has Job bookmark encryption enabled with key {sec_config.jb_key_arn}."
            if no_sec_configs:
                report.status = "FAIL"
                report.status_extended = (
                    f"Glue job {job.name} does not have security configuration."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: glue_etl_jobs_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_etl_jobs_logging_enabled/glue_etl_jobs_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_etl_jobs_logging_enabled",
  "CheckTitle": "Glue ETL job has continuous CloudWatch logging enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Glue jobs** are assessed for **continuous CloudWatch logging**, confirming that runtime events and outputs are sent to **CloudWatch Logs** via the `--enable-continuous-cloudwatch-log` configuration.",
  "Risk": "Missing job logs hide execution details and access patterns, enabling undetected credential abuse, data exfiltration in scripts, or tampering with transforms. This reduces confidentiality and integrity, hinders incident response, and can mask failures that impact availability.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/glue/latest/dg/monitor-continuous-logging.html",
    "https://docs.aws.amazon.com/glue/latest/dg/monitor-continuous-logging-enable.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/glue-controls.html#glue-2"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws glue update-job --job-name <example_resource_name> --job-update '{\"DefaultArguments\":{\"--enable-continuous-cloudwatch-log\":\"true\"}}'",
      "NativeIaC": "```yaml\nResources:\n  GlueJob:\n    Type: AWS::Glue::Job\n    Properties:\n      Role: \"<example_resource_id>\"\n      Command:\n        Name: glueetl\n        ScriptLocation: \"s3://<example_resource_name>/script.py\"\n      DefaultArguments:\n        \"--enable-continuous-cloudwatch-log\": \"true\"  # Critical: enables continuous CloudWatch logging to pass the check\n```",
      "Other": "1. Open the AWS Glue console and go to Jobs\n2. Select the job and click Edit\n3. Expand Advanced properties\n4. Under Continuous logging, check Enable logs in CloudWatch\n5. Save",
      "Terraform": "```hcl\nresource \"aws_glue_job\" \"<example_resource_name>\" {\n  name     = \"<example_resource_name>\"\n  role_arn = \"<example_resource_id>\"\n\n  command {\n    script_location = \"s3://<example_resource_name>/script.py\"\n  }\n\n  default_arguments = {\n    \"--enable-continuous-cloudwatch-log\" = \"true\" # Critical: enables continuous CloudWatch logging to pass the check\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **continuous logging** to **CloudWatch Logs** for all Glue jobs. Centralize logs with retention and KMS encryption, restrict read access, and alert on anomalies and failures. Apply **least privilege** to job roles and use **defense in depth** by correlating logs across services.",
      "Url": "https://hub.prowler.com/check/glue_etl_jobs_logging_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check is being removed since logs for all AWS Glue jobs are now always sent to Amazon CloudWatch."
}
```

--------------------------------------------------------------------------------

---[FILE: glue_etl_jobs_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_etl_jobs_logging_enabled/glue_etl_jobs_logging_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client


class glue_etl_jobs_logging_enabled(Check):
    """Check if Glue ETL jobs have logging enabled.

    This check will return FAIL if the Glue ETL job does not have logging enabled.
    """

    def execute(self) -> List[Check_Report_AWS]:
        """Execute the Glue ETL jobs logging enabled check.

        Iterate over all Glue ETL jobs and check if they have logging enabled.

        Returns:
            List[Check_Report_AWS]: A list of report objects with the results of the check.
        """
        findings = []
        for job in glue_client.jobs:
            report = Check_Report_AWS(metadata=self.metadata(), resource=job)
            report.status = "FAIL"
            report.status_extended = (
                f"Glue job {job.name} does not have logging enabled."
            )

            if (
                job.arguments.get("--enable-continuous-cloudwatch-log", "false")
                == "true"
            ):
                report.status = "PASS"
                report.status_extended = f"Glue job {job.name} have logging enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: glue_ml_transform_encrypted_at_rest.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_ml_transform_encrypted_at_rest/glue_ml_transform_encrypted_at_rest.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_ml_transform_encrypted_at_rest",
  "CheckTitle": "Glue ML Transform is encrypted at rest",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Glue ML transforms** are evaluated for **encryption at rest** of transform user data using **KMS keys**. The finding highlights transforms where encryption is not configured.",
  "Risk": "Without encryption, **confidentiality** is weakened: transform artifacts, mappings, and sample datasets may be readable via storage access, backups, or cross-account exposure. This can lead to data disclosure and aid **lateral movement** by revealing schemas and data relationships.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/glue/latest/dg/encryption-at-rest.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/glue-controls.html#glue-3"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws glue update-ml-transform --transform-id <transform-id> --transform-encryption '{\"MlUserDataEncryption\":{\"MlUserDataEncryptionMode\":\"SSE-KMS\",\"KmsKeyId\":\"<kms-key-arn>\"}}'",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::Glue::MLTransform\n    Properties:\n      Role: <example_resource_id>\n      InputRecordTables:\n        - DatabaseName: <example_resource_name>\n          TableName: <example_resource_name>\n      TransformParameters:\n        TransformType: FIND_MATCHES\n        FindMatchesParameters:\n          PrimaryKeyColumnName: <example_resource_name>\n      TransformEncryption:\n        MlUserDataEncryption:\n          MlUserDataEncryptionMode: SSE-KMS  # Critical: enables ML user data encryption at rest\n          KmsKeyId: <kms-key-arn>            # Critical: KMS key used for encryption\n```",
      "Other": "1. In the AWS Management Console, open AWS Glue\n2. Go to Machine learning > Transforms and select the target transform\n3. Click Edit\n4. Under Encryption, enable ML user data encryption\n5. Choose an AWS KMS key\n6. Save changes",
      "Terraform": "```hcl\nresource \"aws_glue_ml_transform\" \"<example_resource_name>\" {\n  name     = \"<example_resource_name>\"\n  role_arn = \"<example_resource_id>\"\n\n  input_record_tables {\n    database_name = \"<example_resource_name>\"\n    table_name    = \"<example_resource_name>\"\n  }\n\n  parameters {\n    transform_type = \"FIND_MATCHES\"\n    find_matches_parameters {\n      primary_key_column_name = \"<example_resource_name>\"\n    }\n  }\n\n  transform_encryption {\n    ml_user_data_encryption {\n      ml_user_data_encryption_mode = \"SSE-KMS\"   # Critical: enables encryption at rest\n      kms_key_id                   = \"<kms-key-arn>\" # Critical: KMS key used for encryption\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **KMS-backed encryption at rest** for all ML transforms and prefer **customer-managed keys**.\n- Apply **least privilege** key policies and rotate keys\n- Enforce **defense in depth** with network and IAM controls\n- Monitor key usage and transform access with audit logs",
      "Url": "https://hub.prowler.com/check/glue_ml_transform_encrypted_at_rest"
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

---[FILE: glue_ml_transform_encrypted_at_rest.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_ml_transform_encrypted_at_rest/glue_ml_transform_encrypted_at_rest.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client


class glue_ml_transform_encrypted_at_rest(Check):
    def execute(self):
        findings = []

        for ml_transform in glue_client.ml_transforms.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=ml_transform)
            report.status = "PASS"
            report.status_extended = (
                f"Glue ML Transform {ml_transform.name} is encrypted at rest."
            )

            if ml_transform.user_data_encryption == "DISABLED":
                report.status = "FAIL"
                report.status_extended = (
                    f"Glue ML Transform {ml_transform.name} is not encrypted at rest."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: guardduty_client.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_client.py

```python
from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty
from prowler.providers.common.provider import Provider

guardduty_client = GuardDuty(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: guardduty_service.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class GuardDuty(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.detectors = []
        self.__threading_call__(self._list_detectors)
        self.__threading_call__(self._get_detector, self.detectors)
        self._list_findings()
        self._list_members()
        self._get_administrator_account()
        self._list_tags_for_resource()

    def _list_detectors(self, regional_client):
        logger.info("GuardDuty - listing detectors...")
        try:
            detectors = False
            list_detectors_paginator = regional_client.get_paginator("list_detectors")
            for page in list_detectors_paginator.paginate():
                for detector in page["DetectorIds"]:
                    detectors = True
                    arn = f"arn:{self.audited_partition}:guardduty:{regional_client.region}:{self.audited_account}:detector/{detector}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.detectors.append(
                            Detector(
                                id=detector,
                                arn=arn,
                                region=regional_client.region,
                                enabled_in_account=True,
                            )
                        )
            if not detectors:
                self.detectors.append(
                    Detector(
                        id="detector/unknown",
                        arn=self.get_unknown_arn(
                            region=regional_client.region, resource_type="detector"
                        ),
                        region=regional_client.region,
                        enabled_in_account=False,
                    )
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_detector(self, detector):
        logger.info("GuardDuty - getting detector info...")
        try:
            if detector.id and detector.enabled_in_account:
                detector_info = self.regional_clients[detector.region].get_detector(
                    DetectorId=detector.id
                )
                if detector_info.get("Status", "DISABLED") == "ENABLED":
                    detector.status = True

                data_sources = detector_info.get("DataSources", {})

                s3_logs = data_sources.get("S3Logs", {})
                if s3_logs.get("Status", "DISABLED") == "ENABLED":
                    detector.s3_protection = True

                detector.eks_audit_log_protection = (
                    True
                    if data_sources.get("Kubernetes", {})
                    .get("AuditLogs", {})
                    .get("Status", "DISABLED")
                    == "ENABLED"
                    else False
                )

                detector.ec2_malware_protection = (
                    True
                    if data_sources.get("MalwareProtection", {})
                    .get("ScanEc2InstanceWithFindings", {})
                    .get("EbsVolumes", {})
                    .get("Status", "DISABLED")
                    == "ENABLED"
                    else False
                )

                for feat in detector_info.get("Features", []):
                    if (
                        feat.get("Name", "") == "RDS_LOGIN_EVENTS"
                        and feat.get("Status", "DISABLED") == "ENABLED"
                    ):
                        detector.rds_protection = True
                    elif (
                        feat.get("Name", "") == "LAMBDA_NETWORK_LOGS"
                        and feat.get("Status", "DISABLED") == "ENABLED"
                    ):
                        detector.lambda_protection = True
                    elif (
                        feat.get("Name", "") == "EKS_RUNTIME_MONITORING"
                        and feat.get("Status", "DISABLED") == "ENABLED"
                    ):
                        detector.eks_runtime_monitoring = True

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _get_administrator_account(self):
        logger.info("GuardDuty - getting administrator account...")
        try:
            for detector in self.detectors:
                if detector.id and detector.enabled_in_account:
                    try:
                        regional_client = self.regional_clients[detector.region]
                        detector_administrator = (
                            regional_client.get_administrator_account(
                                DetectorId=detector.id
                            )
                        )
                        detector_administrator_account = detector_administrator.get(
                            "Administrator"
                        )
                        if detector_administrator_account:
                            detector.administrator_account = (
                                detector_administrator_account.get("AccountId")
                            )
                    except Exception as error:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                        continue

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _list_members(self):
        logger.info("GuardDuty - listing members...")
        try:
            for detector in self.detectors:
                if detector.id and detector.enabled_in_account:
                    try:
                        regional_client = self.regional_clients[detector.region]
                        list_members_paginator = regional_client.get_paginator(
                            "list_members"
                        )
                        for page in list_members_paginator.paginate(
                            DetectorId=detector.id,
                        ):
                            for member in page["Members"]:
                                detector.member_accounts.append(member.get("AccountId"))
                    except Exception as error:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                        continue
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _list_findings(self):
        logger.info("GuardDuty - listing findings...")
        try:
            for detector in self.detectors:
                if detector.id and detector.enabled_in_account:
                    regional_client = self.regional_clients[detector.region]
                    list_findings_paginator = regional_client.get_paginator(
                        "list_findings"
                    )
                    for page in list_findings_paginator.paginate(
                        DetectorId=detector.id,
                        FindingCriteria={
                            "Criterion": {
                                "severity": {
                                    "Eq": [
                                        "8",
                                    ],
                                },
                                "service.archived": {
                                    "Eq": [
                                        "false",
                                    ],
                                },
                            }
                        },
                    ):
                        for finding in page["FindingIds"]:
                            detector.findings.append(finding)

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("Guardduty - List Tags...")
        try:
            for detector in self.detectors:
                if detector.arn and detector.enabled_in_account:
                    regional_client = self.regional_clients[detector.region]
                    response = regional_client.list_tags_for_resource(
                        ResourceArn=detector.arn
                    )["Tags"]
                    detector.tags = [response]
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )


class Detector(BaseModel):
    id: str
    arn: str
    region: str
    enabled_in_account: bool
    status: bool = None
    findings: list = []
    member_accounts: list = []
    administrator_account: str = None
    tags: Optional[list] = []
    s3_protection: bool = False
    rds_protection: bool = False
    eks_audit_log_protection: bool = False
    eks_runtime_monitoring: bool = False
    lambda_protection: bool = False
    ec2_malware_protection: bool = False
```

--------------------------------------------------------------------------------

---[FILE: guardduty_centrally_managed.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_centrally_managed/guardduty_centrally_managed.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "guardduty_centrally_managed",
  "CheckTitle": "GuardDuty detector is managed by an administrator account or is the administrator with member accounts",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "guardduty",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsGuardDutyDetector",
  "Description": "Amazon GuardDuty detectors are under **centralized management** when linked to a delegated administrator account, or when the detector's account serves as the **administrator** with associated member accounts.",
  "Risk": "Lack of central management fragments **visibility** and slows **incident response** across accounts and regions. Adversaries can persist unnoticed, perform **lateral movement**, exfiltrate data, and alter configurations, harming **confidentiality**, **integrity**, and **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_accounts.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws guardduty enable-organization-admin-account --admin-account-id <ADMIN_ACCOUNT_ID>",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Organizations management account\n2. Open the AWS Organizations console\n3. Go to Services > Amazon GuardDuty\n4. Click Register delegated administrator\n5. Enter the admin account ID and click Register",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Designate a **delegated administrator** (preferably via *AWS Organizations*) and enroll all accounts as **members**. Enable auto-enrollment for new accounts, standardize detector settings across required regions, and route findings to central monitoring. Apply **least privilege** and **separation of duties**.",
      "Url": "https://hub.prowler.com/check/guardduty_centrally_managed"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: guardduty_centrally_managed.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_centrally_managed/guardduty_centrally_managed.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.guardduty.guardduty_client import guardduty_client


class guardduty_centrally_managed(Check):
    def execute(self):
        findings = []
        for detector in guardduty_client.detectors:
            if detector.id and detector.enabled_in_account:
                report = Check_Report_AWS(metadata=self.metadata(), resource=detector)
                report.status = "FAIL"
                report.status_extended = (
                    f"GuardDuty detector {detector.id} is not centrally managed."
                )
                if detector.administrator_account:
                    report.status = "PASS"
                    report.status_extended = f"GuardDuty detector {detector.id} is centrally managed by account {detector.administrator_account}."
                elif detector.member_accounts:
                    report.status = "PASS"
                    report.status_extended = f"GuardDuty detector {detector.id} is administrator account with {len(detector.member_accounts)} member accounts."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: guardduty_ec2_malware_protection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_ec2_malware_protection_enabled/guardduty_ec2_malware_protection_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "guardduty_ec2_malware_protection_enabled",
  "CheckTitle": "GuardDuty detector has Malware Protection for EC2 enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "guardduty",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsGuardDutyDetector",
  "Description": "**GuardDuty detectors** with **Malware Protection for EC2** enabled perform agentless scans of EBS volumes attached to **EC2 instances** and container workloads. Scans can be triggered by suspicious activity or run on-demand to identify malicious files within restored volume snapshots.",
  "Risk": "Absent this coverage, malware on EC2 or containers can remain **undetected**, enabling:\n- Confidentiality loss via data exfiltration/credential theft\n- Integrity compromise through tampering and backdoors\n- Availability impact from ransomware/cryptominers\n\nPersistence increases **lateral movement** across the environment.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.infoq.com/news/2022/08/aws-guardduty-malware-detection/",
    "https://docs.aws.amazon.com/guardduty/latest/ug/malware-protection.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/GuardDuty/enable-malware-protection-for-ec2.html",
    "https://medium.com/@shashank.kulkarni0708/get-juiced-how-i-hacked-owasp-juice-shop-and-let-guardduty-catch-me-537f7064a1d5",
    "https://docs.aws.amazon.com/guardduty/latest/ug/configure-malware-protection-single-account.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/guardduty-controls.html#guardduty-8"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws guardduty update-detector --detector-id <detector-id> --features '[{\"Name\":\"EBS_MALWARE_PROTECTION\",\"Status\":\"ENABLED\"}]'",
      "NativeIaC": "```yaml\n# CloudFormation: enable GuardDuty Malware Protection for EC2\nResources:\n  GuardDutyDetector:\n    Type: AWS::GuardDuty::Detector\n    Properties:\n      Enable: true\n      Features:\n        - Name: EBS_MALWARE_PROTECTION  # Critical: selects EC2 Malware Protection feature\n          Status: ENABLED               # Critical: enables the feature\n```",
      "Other": "1. In the AWS console, open GuardDuty\n2. In the left menu, select Protection plans > Malware Protection for EC2\n3. Click Enable, then Save",
      "Terraform": "```hcl\n# Enable GuardDuty Malware Protection for EC2\nresource \"aws_guardduty_detector\" \"<example_resource_name>\" {\n  enable = true\n\n  features {\n    name   = \"EBS_MALWARE_PROTECTION\"  # Critical: selects EC2 Malware Protection feature\n    status = \"ENABLED\"                  # Critical: enables the feature\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Malware Protection for EC2** across all accounts and Regions under centralized administration. Apply **least privilege** to findings access, define scan scope with tags and minimize exclusions, and retain snapshots based on data sensitivity. Integrate alerts with IR/SIEM and pair with hardening and vulnerability scanning for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/guardduty_ec2_malware_protection_enabled"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: guardduty_ec2_malware_protection_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_ec2_malware_protection_enabled/guardduty_ec2_malware_protection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.guardduty.guardduty_client import guardduty_client


class guardduty_ec2_malware_protection_enabled(Check):
    def execute(self):
        findings = []
        for detector in guardduty_client.detectors:
            if detector.status:
                report = Check_Report_AWS(metadata=self.metadata(), resource=detector)
                report.status = "FAIL"
                report.status_extended = f"GuardDuty detector {detector.id} does not have Malware Protection for EC2 enabled."
                if detector.ec2_malware_protection:
                    report.status = "PASS"
                    report.status_extended = f"GuardDuty detector {detector.id} has Malware Protection for EC2 enabled."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
