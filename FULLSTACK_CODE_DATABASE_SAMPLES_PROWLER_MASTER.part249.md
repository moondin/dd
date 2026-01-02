---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 249
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 249 of 867)

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

---[FILE: cloudtrail_logs_s3_bucket_is_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_logs_s3_bucket_is_not_publicly_accessible/cloudtrail_logs_s3_bucket_is_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_logs_s3_bucket_is_not_publicly_accessible",
  "CheckTitle": "CloudTrail trail S3 bucket is not publicly accessible",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Effects/Data Exposure"
  ],
  "ServiceName": "cloudtrail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsS3Bucket",
  "Description": "CloudTrail log destination **S3 buckets** are inspected for ACL grants that expose data to the public `AllUsers` group.\n\nBuckets hosted in other accounts are flagged for out-of-scope review.",
  "Risk": "Exposed CloudTrail logs erode **confidentiality** and **integrity**.\n\nAdversaries can harvest API activity to map accounts, roles, and keys, enabling **reconnaissance** and evasion. If write is allowed, logs can be **poisoned** or deleted, thwarting investigations and compromising incident timelines.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudTrail/cloudtrail-bucket-publicly-accessible.html",
    "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html",
    "https://docs.aws.amazon.com/config/latest/developerguide/cloudtrail-s3-bucket-public-access-prohibited.html",
    "https://docs.panther.com/alerts/alert-runbooks/built-in-policies/aws-cloudtrail-logs-s3-bucket-not-publicly-accessible"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws s3api put-bucket-acl --bucket <example_resource_name> --acl private",
      "NativeIaC": "```yaml\n# CloudFormation: ensure the CloudTrail S3 bucket ACL is not public\nResources:\n  CloudTrailLogsBucket:\n    Type: AWS::S3::Bucket\n    Properties:\n      BucketName: <example_resource_name>\n      AccessControl: Private  # CRITICAL: sets bucket ACL to private, removing any AllUsers (public) grants\n```",
      "Other": "1. Open the AWS S3 Console\n2. Select the bucket used by CloudTrail\n3. Go to Permissions > Access control list (ACL)\n4. Click Edit under Public access, remove any grants to \"Everyone (public access)\" (uncheck Read/Write)\n5. Save changes",
      "Terraform": "```hcl\n# Ensure the CloudTrail S3 bucket ACL is private\nresource \"aws_s3_bucket_acl\" \"fix_cloudtrail_logs_bucket\" {\n  bucket = \"<example_resource_name>\"\n  acl    = \"private\"  # CRITICAL: removes any public (AllUsers) ACL grants\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** to the log bucket:\n- Enable S3 `Block Public Access` (account and bucket)\n- Remove `AllUsers`/`AuthenticatedUsers` ACLs; avoid wildcard principals\n- Permit only CloudTrail and constrain with `aws:SourceArn`\n\nUse a dedicated private bucket and monitor for permission changes.",
      "Url": "https://hub.prowler.com/check/cloudtrail_logs_s3_bucket_is_not_publicly_accessible"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [
    "s3_bucket_public_access"
  ],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_logs_s3_bucket_is_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_logs_s3_bucket_is_not_publicly_accessible/cloudtrail_logs_s3_bucket_is_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.s3.s3_client import s3_client


class cloudtrail_logs_s3_bucket_is_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        if cloudtrail_client.trails is not None:
            for trail in cloudtrail_client.trails.values():
                if trail.name:
                    trail_bucket_is_in_account = False
                    trail_bucket = trail.s3_bucket
                    report = Check_Report_AWS(metadata=self.metadata(), resource=trail)
                    report.region = trail.home_region
                    report.status = "PASS"
                    if trail.is_multiregion:
                        report.status_extended = f"S3 Bucket {trail_bucket} from multiregion trail {trail.name} is not publicly accessible."
                    else:
                        report.status_extended = f"S3 Bucket {trail_bucket} from single region trail {trail.name} is not publicly accessible."
                    for bucket in s3_client.buckets.values():
                        # Here we need to ensure that acl_grantee is filled since if we don't have permissions to query the api for a concrete region
                        # (for example due to a SCP) we are going to try access an attribute from a None type
                        if trail_bucket == bucket.name:
                            trail_bucket_is_in_account = True
                            if bucket.acl_grantees:
                                for grant in bucket.acl_grantees:
                                    if (
                                        grant.URI
                                        == "http://acs.amazonaws.com/groups/global/AllUsers"
                                    ):
                                        report.status = "FAIL"
                                        if trail.is_multiregion:
                                            report.status_extended = f"S3 Bucket {trail_bucket} from multiregion trail {trail.name} is publicly accessible."
                                        else:
                                            report.status_extended = f"S3 Bucket {trail_bucket} from single region trail {trail.name} is publicly accessible."
                                        break
                    # check if trail bucket is a cross account bucket
                    if not trail_bucket_is_in_account:
                        report.status = "MANUAL"
                        report.status_extended = f"Trail {trail.name} bucket ({trail_bucket}) is a cross-account bucket or out of Prowler's audit scope, please check it manually."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_logs_s3_bucket_is_not_publicly_accessible_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_logs_s3_bucket_is_not_publicly_accessible/cloudtrail_logs_s3_bucket_is_not_publicly_accessible_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.s3.s3_client import s3_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the CloudTrail's associated S3 bucket's public access settings to ensure the bucket is not publicly accessible.
    Specifically, this fixer configures the S3 bucket's public access block settings to block all public access.
    Requires the s3:PutBucketPublicAccessBlock permissions.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:PutBucketPublicAccessBlock",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The CloudTrail name.
        region (str): AWS region where the CloudTrail and S3 bucket exist.
    Returns:
        bool: True if the operation is successful (policy and ACL updated), False otherwise.
    """
    try:
        regional_client = s3_client.regional_clients[region]
        for trail in cloudtrail_client.trails.values():
            if trail.name == resource_id:
                trail_bucket = trail.s3_bucket

                regional_client.put_public_access_block(
                    Bucket=trail_bucket,
                    PublicAccessBlockConfiguration={
                        "BlockPublicAcls": True,
                        "IgnorePublicAcls": True,
                        "BlockPublicPolicy": True,
                        "RestrictPublicBuckets": True,
                    },
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

---[FILE: cloudtrail_log_file_validation_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_log_file_validation_enabled/cloudtrail_log_file_validation_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_log_file_validation_enabled",
  "CheckTitle": "CloudTrail trail has log file validation enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "cloudtrail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudTrailTrail",
  "Description": "**AWS CloudTrail trails** are evaluated for **log file integrity validation** being enabled (`LogFileValidationEnabled`).\n\nWhen enabled, CloudTrail generates signed digest files to verify that S3-delivered log files remain unchanged.",
  "Risk": "Without validation, adversaries can alter, forge, or delete audit entries without detection, compromising log **integrity** and non-repudiation.\n\nThis impairs investigations, enables alert evasion, and obscures unauthorized changes across regions or accounts.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html",
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-enabling.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudTrail/cloudtrail-log-file-integrity-validation.html",
    "https://deepwiki.com/acantril/learn-cantrill-io-labs/7.1-cloudtrail-log-file-integrity"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudtrail update-trail --name <trail_name> --enable-log-file-validation",
      "NativeIaC": "```yaml\n# CloudFormation: Enable log file validation on a CloudTrail trail\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudTrail::Trail\n    Properties:\n      S3BucketName: <example_resource_name>\n      EnableLogFileValidation: true  # Critical: enables integrity validation for delivered log files\n```",
      "Other": "1. Open the AWS Console and go to CloudTrail\n2. Click Trails and select <trail_name>\n3. Click Edit\n4. In Additional/Advanced settings, check Enable log file validation\n5. Click Save changes",
      "Terraform": "```hcl\n# Enable log file validation on a CloudTrail trail\nresource \"aws_cloudtrail\" \"<example_resource_name>\" {\n  name               = \"<example_resource_name>\"\n  s3_bucket_name     = \"<example_resource_name>\"\n  enable_log_file_validation = true  # Critical: ensures CloudTrail writes signed digests to detect tampering\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **log file integrity validation** on all trails (`LogFileValidationEnabled=true`).\n\nEnforce **least privilege** on the logs bucket, retain and protect digest files (e.g., S3 Object Lock/MFA Delete), and monitor validation results to support **defense in depth**.",
      "Url": "https://hub.prowler.com/check/cloudtrail_log_file_validation_enabled"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_log_file_validation_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_log_file_validation_enabled/cloudtrail_log_file_validation_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)


class cloudtrail_log_file_validation_enabled(Check):
    def execute(self):
        findings = []
        if cloudtrail_client.trails is not None:
            for trail in cloudtrail_client.trails.values():
                if trail.name:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=trail)
                    report.region = trail.home_region
                    report.status = "FAIL"
                    if trail.is_multiregion:
                        report.status_extended = f"Multiregion trail {trail.name} has log file validation disabled."
                    else:
                        report.status_extended = f"Single region trail {trail.name} has log file validation disabled."
                    if trail.log_file_validation_enabled:
                        report.status = "PASS"
                        if trail.is_multiregion:
                            report.status_extended = f"Multiregion trail {trail.name} has log file validation enabled."
                        else:
                            report.status_extended = f"Single region trail {trail.name} has log file validation enabled."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_multi_region_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_multi_region_enabled/cloudtrail_multi_region_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_multi_region_enabled",
  "CheckTitle": "Region has at least one CloudTrail trail logging",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "cloudtrail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsCloudTrailTrail",
  "Description": "**AWS CloudTrail** has at least one trail with `logging` enabled in every region. A **multi-region trail** or a regional trail counts for coverage in that region.",
  "Risk": "Missing coverage in any region creates **visibility gaps**.\n\nAttackers can use lesser-monitored regions to run API actions, hide **unauthorized changes**, and exfiltrate data without audit trails, weakening **detective controls**, hindering **forensics**, and delaying response (confidentiality and integrity).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrailconcepts.html#cloudtrail-concepts-management-events"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Create a multi-region CloudTrail and start logging\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudTrail::Trail\n    Properties:\n      TrailName: <example_resource_name>\n      S3BucketName: <example_resource_name>\n      IsMultiRegionTrail: true  # Critical: applies the trail to all regions\n      IsLogging: true           # Critical: ensures the trail is logging\n```",
      "Other": "1. In the AWS Console, go to CloudTrail > Trails\n2. If no trail exists: Click Create trail, enter a name, choose an S3 bucket, set Apply trail to all regions = Yes, then Create (logging starts)\n3. If a trail exists: Select it, click Edit, set Apply trail to all regions = Yes, Save\n4. If Status shows Not logging, click Start logging",
      "Terraform": "```hcl\n# Terraform: Multi-region CloudTrail with logging enabled\nresource \"aws_cloudtrail\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  s3_bucket_name = \"<example_resource_name>\"\n\n  is_multi_region_trail = true  # Critical: applies the trail to all regions\n  enable_logging        = true  # Critical: ensures the trail is logging\n}\n```"
    },
    "Recommendation": {
      "Text": "Use a **multi-region CloudTrail trail** or per-region trails so `logging` is active in every region, including unused ones.\n\nCentralize logs, enforce **least privilege** to log stores, and add **defense-in-depth** with encryption, integrity validation, and retention. Continuously monitor trail health to catch gaps.",
      "Url": "https://hub.prowler.com/check/cloudtrail_multi_region_enabled"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_multi_region_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_multi_region_enabled/cloudtrail_multi_region_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)


class cloudtrail_multi_region_enabled(Check):
    def execute(self):
        findings = []
        if cloudtrail_client.trails is not None:
            for region in cloudtrail_client.regional_clients.keys():
                trail_is_logging = False
                for trail in cloudtrail_client.trails.values():
                    if trail.region == region or trail.is_multiregion:
                        report = Check_Report_AWS(
                            metadata=self.metadata(), resource=trail
                        )
                        report.region = region
                        if trail.is_logging:
                            trail_is_logging = True
                            report.status = "PASS"
                            if trail.is_multiregion:
                                report.status_extended = f"Trail {trail.name} is multiregion and it is logging."
                            else:
                                report.status_extended = f"Trail {trail.name} is not multiregion and it is logging."
                            # Since there exists a logging trail in that region there is no point in checking the remaining trails
                            # Store the finding and exit the loop
                            findings.append(report)
                            break
                # If there are no trails logging it is needed to store the FAIL once all the trails have been checked
                if not trail_is_logging:
                    report = Check_Report_AWS(
                        metadata=self.metadata(),
                        resource={},
                    )
                    report.status = "FAIL"
                    report.status_extended = (
                        "No CloudTrail trails enabled with logging were found."
                    )
                    report.region = region
                    report.resource_arn = cloudtrail_client._get_trail_arn_template(
                        region
                    )
                    report.resource_id = cloudtrail_client.audited_account
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_multi_region_enabled_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_multi_region_enabled/cloudtrail_multi_region_enabled_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)


def fixer(region):
    """
    NOTE: Define the S3 bucket name in the fixer_config.yaml file.
    Enable CloudTrail in a region. Requires the cloudtrail:CreateTrail permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "cloudtrail:CreateTrail",
                "Resource": "*"
            }
        ]
    }
    Args:
        region (str): AWS region
    Returns:
        bool: True if CloudTrail is enabled, False otherwise
    """
    try:
        cloudtrail_fixer_config = cloudtrail_client.fixer_config.get(
            "cloudtrail_multi_region_enabled", {}
        )
        regional_client = cloudtrail_client.regional_clients[region]
        args = {
            "Name": cloudtrail_fixer_config.get("TrailName", "DefaultTrail"),
            "S3BucketName": cloudtrail_fixer_config.get("S3BucketName"),
            "IsMultiRegionTrail": cloudtrail_fixer_config.get(
                "IsMultiRegionTrail", True
            ),
            "EnableLogFileValidation": cloudtrail_fixer_config.get(
                "EnableLogFileValidation", True
            ),
        }
        if cloudtrail_fixer_config.get("CloudWatchLogsLogGroupArn"):
            args["CloudWatchLogsLogGroupArn"] = cloudtrail_fixer_config.get(
                "CloudWatchLogsLogGroupArn"
            )
        if cloudtrail_fixer_config.get("CloudWatchLogsRoleArn"):
            args["CloudWatchLogsRoleArn"] = cloudtrail_fixer_config.get(
                "CloudWatchLogsRoleArn"
            )
        if cloudtrail_fixer_config.get("KmsKeyId"):
            args["KmsKeyId"] = cloudtrail_fixer_config.get("KmsKeyId")
        regional_client.create_trail(**args)
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_multi_region_enabled_logging_management_events.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_multi_region_enabled_logging_management_events/cloudtrail_multi_region_enabled_logging_management_events.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_multi_region_enabled_logging_management_events",
  "CheckTitle": "CloudTrail trail logs management events for read and write operations",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "cloudtrail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsCloudTrailTrail",
  "Description": "**CloudTrail trails** record **management events** (`read` and `write`) in every AWS region and are actively logging, using a multi-region trail or per-region coverage.",
  "Risk": "Without region-wide management event logging, changes to identities, networking, and audit settings can go untracked.\n\nAdversaries can operate in overlooked regions to create resources, modify permissions, or disable logging, undermining **integrity**, **confidentiality**, and incident response.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.prowler.com/checks/aws/logging-policies/logging_14#terraform",
    "https://docs.prowler.com/checks/aws/logging-policies/logging_14"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: enable multi-region and log management events (read & write)\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudTrail::Trail\n    Properties:\n      S3BucketName: <example_resource_name>\n      IsMultiRegionTrail: true  # CRITICAL: apply the trail to all regions\n      EventSelectors:\n        - IncludeManagementEvents: true  # CRITICAL: log management events\n          ReadWriteType: All             # CRITICAL: log both read and write\n```",
      "Other": "1. In the AWS Console, go to CloudTrail > Trails and select your trail\n2. Click Edit\n3. Set Apply trail to all regions to Yes\n4. Under Management events, set Read/write events to All\n5. Click Save changes\n6. If Logging is Off, click Start logging",
      "Terraform": "```hcl\n# Terraform: enable multi-region and log management events (read & write)\nresource \"aws_cloudtrail\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  s3_bucket_name = \"<example_resource_name>\"\n\n  is_multi_region_trail = true  # CRITICAL: apply the trail to all regions\n\n  event_selector {\n    include_management_events = true  # CRITICAL: log management events\n    read_write_type           = \"All\" # CRITICAL: log both read & write\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable a **multi-region CloudTrail** that logs **management events** for `read` and `write` in all regions.\n\nCentralize logs in a separate, locked-down account; apply **least privilege**, encryption, retention, and integrity validation; and protect trails and storage with tamper-evident, deny-delete controls for **defense-in-depth**.",
      "Url": "https://hub.prowler.com/check/cloudtrail_multi_region_enabled_logging_management_events"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_multi_region_enabled_logging_management_events.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_multi_region_enabled_logging_management_events/cloudtrail_multi_region_enabled_logging_management_events.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)


class cloudtrail_multi_region_enabled_logging_management_events(Check):
    def execute(self):
        findings = []
        if cloudtrail_client.trails is not None:
            for region in cloudtrail_client.regional_clients.keys():
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=cloudtrail_client.trails
                )
                report.status = "FAIL"
                report.status_extended = "No CloudTrail trails enabled and logging management events were found."
                report.region = region
                report.resource_id = cloudtrail_client.audited_account
                report.resource_arn = cloudtrail_client._get_trail_arn_template(region)
                trail_is_logging_management_events = False
                for trail in cloudtrail_client.trails.values():
                    if trail.region == region or trail.is_multiregion:
                        if trail.is_logging:
                            for event in trail.data_events:
                                # Classic event selectors
                                if not event.is_advanced:
                                    # Check if trail has IncludeManagementEvents and ReadWriteType is All
                                    if (
                                        event.event_selector["ReadWriteType"] == "All"
                                        and event.event_selector[
                                            "IncludeManagementEvents"
                                        ]
                                    ):
                                        trail_is_logging_management_events = True

                                # Advanced event selectors
                                elif event.is_advanced:
                                    if event.event_selector.get(
                                        "Name"
                                    ) == "Management events selector" and all(
                                        [
                                            field["Field"] != "readOnly"
                                            for field in event.event_selector[
                                                "FieldSelectors"
                                            ]
                                        ]
                                    ):
                                        trail_is_logging_management_events = True
                    if trail_is_logging_management_events:
                        report = Check_Report_AWS(
                            metadata=self.metadata(), resource=trail
                        )
                        report.region = region
                        report.status = "PASS"
                        if trail.is_multiregion:
                            report.status_extended = f"Trail {trail.name} from home region {trail.home_region} is multi-region, is logging and have management events enabled."
                        else:
                            report.status_extended = f"Trail {trail.name} in region {trail.home_region} is logging and have management events enabled."
                        # Since there exists a logging trail in that region there is no point in checking the remaining trails
                        # Store the finding and exit the loop
                        findings.append(report)
                        break
                if report.status == "FAIL":
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_s3_dataevents_read_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_s3_dataevents_read_enabled/cloudtrail_s3_dataevents_read_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_s3_dataevents_read_enabled",
  "CheckTitle": "CloudTrail trail records S3 object-level read events for all S3 buckets",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "cloudtrail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsCloudTrailTrail",
  "Description": "**CloudTrail trails** log **S3 object-level read data events** for all buckets, capturing object access (for example `GetObject`) via selectors targeting `AWS::S3::Object`",
  "Risk": "Without **object-level read logging**, S3 access is opaque. Attackers or insiders can exfiltrate data via `GetObject` without audit trails, eroding **confidentiality** and hindering **forensics**, anomaly detection, and incident response.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://awswala.medium.com/enable-cloudtrail-data-events-logging-for-objects-in-an-s3-bucket-33cade51ae2b",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/s3-controls.html#s3-23",
    "https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-cloudtrail-logging-for-s3.html",
    "https://www.plerion.com/cloud-knowledge-base/ensure-object-level-logging-for-read-events-enabled-for-s3-bucket"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudtrail put-event-selectors --trail-name <example_resource_name> --event-selectors '[{\"ReadWriteType\":\"ReadOnly\",\"DataResources\":[{\"Type\":\"AWS::S3::Object\",\"Values\":[\"arn:aws:s3\"]}]}]'",
      "NativeIaC": "```yaml\n# CloudFormation: enable S3 object-level READ data events for all buckets on a trail\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudTrail::Trail\n    Properties:\n      S3BucketName: <example_resource_name>\n      EventSelectors:\n        - ReadWriteType: ReadOnly        # CRITICAL: log read-only data events\n          DataResources:\n            - Type: AWS::S3::Object      # CRITICAL: target S3 object-level events\n              Values:\n                - arn:aws:s3             # CRITICAL: applies to all S3 buckets/objects\n```",
      "Other": "1. In the AWS Console, open CloudTrail and select Trails\n2. Open your trail and go to the Data events section\n3. Add data event for S3 and choose All current and future S3 buckets\n4. Select only Read events (or All if Read-only is unavailable)\n5. Save changes",
      "Terraform": "```hcl\n# Terraform: enable S3 object-level READ data events for all buckets on a trail\nresource \"aws_cloudtrail\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  s3_bucket_name = \"<example_resource_name>\"\n\n  event_selector {\n    read_write_type = \"ReadOnly\"                 # CRITICAL: log read-only data events\n    data_resource {\n      type   = \"AWS::S3::Object\"                 # CRITICAL: target S3 object-level events\n      values = [\"arn:aws:s3\"]                    # CRITICAL: apply to all S3 buckets/objects\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable CloudTrail **data events** for S3 objects with `ReadOnly` (or `All`) across all current and future buckets. Use a multi-Region trail, centralize logs in an encrypted bucket with lifecycle retention, and integrate monitoring/alerts to support **defense in depth** and accountable access.",
      "Url": "https://hub.prowler.com/check/cloudtrail_s3_dataevents_read_enabled"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_s3_dataevents_read_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_s3_dataevents_read_enabled/cloudtrail_s3_dataevents_read_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.s3.s3_client import s3_client


class cloudtrail_s3_dataevents_read_enabled(Check):
    def execute(self):
        findings = []
        if cloudtrail_client.trails is not None:
            for trail in cloudtrail_client.trails.values():
                for data_event in trail.data_events:
                    # classic event selectors
                    if not data_event.is_advanced:
                        # Check if trail has a data event for all S3 Buckets for read
                        if (
                            data_event.event_selector["ReadWriteType"] == "ReadOnly"
                            or data_event.event_selector["ReadWriteType"] == "All"
                        ):
                            for resource in data_event.event_selector["DataResources"]:
                                if "AWS::S3::Object" == resource["Type"] and (
                                    f"arn:{cloudtrail_client.audited_partition}:s3"
                                    in resource["Values"]
                                    or f"arn:{cloudtrail_client.audited_partition}:s3:::"
                                    in resource["Values"]
                                    or f"arn:{cloudtrail_client.audited_partition}:s3:::*/*"
                                    in resource["Values"]
                                ):
                                    report = Check_Report_AWS(
                                        metadata=self.metadata(),
                                        resource=trail,
                                    )
                                    report.region = trail.home_region
                                    report.status = "PASS"
                                    report.status_extended = f"Trail {trail.name} from home region {trail.home_region} has a classic data event selector to record all S3 object-level API operations."
                                    findings.append(report)
                    # advanced event selectors
                    elif data_event.is_advanced:
                        for field_selector in data_event.event_selector[
                            "FieldSelectors"
                        ]:
                            if (
                                field_selector["Field"] == "resources.type"
                                and field_selector["Equals"][0] == "AWS::S3::Object"
                            ):
                                report = Check_Report_AWS(
                                    metadata=self.metadata(), resource=trail
                                )
                                report.region = trail.home_region
                                report.status = "PASS"
                                report.status_extended = f"Trail {trail.name} from home region {trail.home_region} has an advanced data event selector to record all S3 object-level API operations."
                                findings.append(report)
            if not findings and (
                s3_client.buckets or cloudtrail_client.provider.scan_unused_services
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=cloudtrail_client.trails
                )
                report.region = cloudtrail_client.region
                report.resource_arn = cloudtrail_client.trail_arn_template
                report.resource_id = cloudtrail_client.audited_account
                report.status = "FAIL"
                report.status_extended = "No CloudTrail trails have a data event to record all S3 object-level API operations."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
