---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 248
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 248 of 867)

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

---[FILE: cloudtrail_service.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_service.py
Signals: Pydantic

```python
from datetime import datetime, timedelta
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Cloudtrail(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.trail_arn_template = f"arn:{self.audited_partition}:cloudtrail:{self.region}:{self.audited_account}:trail"
        self.trails = {}
        self.__threading_call__(self._get_trails)
        if self.trails:
            self._get_trail_status()
            self._get_insight_selectors()
            self._get_event_selectors()
            self._list_tags_for_resource()

    def _get_trail_arn_template(self, region):
        return (
            f"arn:{self.audited_partition}:cloudtrail:{region}:{self.audited_account}:trail"
            if region
            else f"arn:{self.audited_partition}:cloudtrail:{self.region}:{self.audited_account}:trail"
        )

    def _get_trails(self, regional_client):
        logger.info("Cloudtrail - Getting trails...")
        try:
            describe_trails = regional_client.describe_trails()["trailList"]
            trails_count = 0
            for trail in describe_trails:
                # If a multi region trail was already retrieved in another region
                if self.trails and trail["TrailARN"] in self.trails.keys():
                    continue

                if not self.audit_resources or (
                    is_resource_filtered(trail["TrailARN"], self.audit_resources)
                ):
                    trails_count += 1
                    kms_key_id = None
                    log_group_arn = None
                    if "KmsKeyId" in trail:
                        kms_key_id = trail["KmsKeyId"]
                    if "CloudWatchLogsLogGroupArn" in trail:
                        log_group_arn = trail["CloudWatchLogsLogGroupArn"]
                    if self.trails is None:
                        self.trails = {}
                    self.trails[trail["TrailARN"]] = Trail(
                        name=trail["Name"],
                        is_multiregion=trail["IsMultiRegionTrail"],
                        home_region=trail["HomeRegion"],
                        arn=trail["TrailARN"],
                        region=regional_client.region,
                        is_logging=False,
                        log_file_validation_enabled=trail["LogFileValidationEnabled"],
                        latest_cloudwatch_delivery_time=None,
                        s3_bucket=trail["S3BucketName"],
                        kms_key=kms_key_id,
                        log_group_arn=log_group_arn,
                        data_events=[],
                        has_insight_selectors=trail.get("HasInsightSelectors"),
                    )
            if trails_count == 0:
                if self.trails is None:
                    self.trails = {}
                self.trails[self._get_trail_arn_template(regional_client.region)] = (
                    Trail(
                        region=regional_client.region,
                    )
                )
        except ClientError as error:
            if error.response["Error"]["Code"] == "AccessDeniedException":
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                if not self.trails:
                    self.trails = None
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_trail_status(self):
        logger.info("Cloudtrail - Getting trail status")
        try:
            for trail in self.trails.values():
                for region, client in self.regional_clients.items():
                    if trail.region == region and trail.name:
                        status = client.get_trail_status(Name=trail.arn)
                        trail.is_logging = status["IsLogging"]
                        if "LatestCloudWatchLogsDeliveryTime" in status:
                            trail.latest_cloudwatch_delivery_time = status[
                                "LatestCloudWatchLogsDeliveryTime"
                            ]

        except Exception as error:
            logger.error(
                f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_event_selectors(self):
        logger.info("Cloudtrail - Getting event selector")
        try:
            for trail in self.trails.values():
                for region, client in self.regional_clients.items():
                    if trail.region == region and trail.name:
                        data_events = client.get_event_selectors(TrailName=trail.arn)
                        # EventSelectors
                        if (
                            "EventSelectors" in data_events
                            and data_events["EventSelectors"]
                        ):
                            for event in data_events["EventSelectors"]:
                                event_selector = Event_Selector(
                                    is_advanced=False, event_selector=event
                                )
                                trail.data_events.append(event_selector)
                        # AdvancedEventSelectors
                        elif (
                            "AdvancedEventSelectors" in data_events
                            and data_events["AdvancedEventSelectors"]
                        ):
                            for event in data_events["AdvancedEventSelectors"]:
                                event_selector = Event_Selector(
                                    is_advanced=True, event_selector=event
                                )
                                trail.data_events.append(event_selector)

        except Exception as error:
            logger.error(
                f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_insight_selectors(self):
        logger.info("Cloudtrail - Getting trail insight selectors...")

        try:
            for trail in self.trails.values():
                for region, client in self.regional_clients.items():
                    if trail.region == region and trail.name:
                        insight_selectors = None
                        trail.has_insight_selectors = None
                        try:
                            client_insight_selectors = client.get_insight_selectors(
                                TrailName=trail.arn
                            )
                            insight_selectors = client_insight_selectors.get(
                                "InsightSelectors"
                            )
                        except ClientError as error:
                            if (
                                error.response["Error"]["Code"]
                                == "InsightNotEnabledException"
                            ):
                                logger.warning(
                                    f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                                )
                            elif (
                                error.response["Error"]["Code"]
                                == "UnsupportedOperationException"
                            ):
                                logger.warning(
                                    f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                                )
                            else:
                                logger.error(
                                    f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                                )
                        except Exception as error:
                            logger.error(
                                f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
                            continue
                        if insight_selectors:
                            trail.has_insight_selectors = insight_selectors[0].get(
                                "InsightType"
                            )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _lookup_events(self, trail, event_name, minutes):
        logger.info("CloudTrail - Lookup Events...")
        try:
            regional_client = self.regional_clients[trail.region]
            response = regional_client.lookup_events(
                LookupAttributes=[
                    {"AttributeKey": "EventName", "AttributeValue": event_name}
                ],
                StartTime=datetime.now() - timedelta(minutes=minutes),
            )
            return response.get("Events")
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("CloudTrail - List Tags...")
        try:
            for trail in self.trails.values():
                try:
                    # Check if trails are in this account and region
                    if (
                        trail.region == trail.home_region
                        and self.audited_account in trail.arn
                    ):
                        regional_client = self.regional_clients[trail.region]
                        response = regional_client.list_tags(
                            ResourceIdList=[trail.arn]
                        )["ResourceTagList"][0]
                        trail.tags = response.get("TagsList")
                except Exception as error:
                    logger.error(
                        f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Event_Selector(BaseModel):
    is_advanced: bool
    event_selector: dict


class Trail(BaseModel):
    name: str = None
    is_multiregion: bool = None
    home_region: str = None
    arn: str = None
    # Region holds the region where the trail is audited
    region: str
    is_logging: bool = None
    log_file_validation_enabled: bool = None
    latest_cloudwatch_delivery_time: datetime = None
    s3_bucket: str = None
    kms_key: str = None
    log_group_arn: str = None
    data_events: list[Event_Selector] = []
    tags: Optional[list] = []
    has_insight_selectors: str = None
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_bucket_requires_mfa_delete.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_bucket_requires_mfa_delete/cloudtrail_bucket_requires_mfa_delete.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_bucket_requires_mfa_delete",
  "CheckTitle": "CloudTrail trail S3 bucket has MFA delete enabled",
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
  "Description": "**CloudTrail log buckets** for actively logging trails are evaluated for **MFA Delete** on the associated S3 bucket. The assessment determines whether `MFA Delete` is configured on the in-account log bucket; *if the bucket resides in another account, its configuration should be verified separately*.",
  "Risk": "Without **MFA Delete**, stolen or over-privileged credentials can permanently delete log versions or change versioning, compromising log **integrity** and **availability**. This enables attacker cover-ups, hinders **forensics**, and weakens evidence for investigations.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiFactorAuthenticationDelete.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudTrail/cloudtrail-bucket-mfa-delete-enabled.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws s3api put-bucket-versioning --bucket <CLOUDTRAIL_BUCKET_NAME> --versioning-configuration Status=Enabled,MFADelete=Enabled --mfa \"<MFA_SERIAL> <MFA_CODE>\"",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Management Console as the root user with MFA enabled\n2. Open AWS CloudShell (from the top navigation bar)\n3. Run:\n   ```bash\n   aws s3api put-bucket-versioning --bucket <CLOUDTRAIL_BUCKET_NAME> --versioning-configuration Status=Enabled,MFADelete=Enabled --mfa \"<MFA_SERIAL> <MFA_CODE>\"\n   ```",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable `MFA Delete` on the CloudTrail log bucket with versioning enabled. Enforce **least privilege** so only tightly controlled identities can delete or alter logs, and require MFA for such actions. Apply **defense in depth** using a dedicated logging account and log file integrity validation.",
      "Url": "https://hub.prowler.com/check/cloudtrail_bucket_requires_mfa_delete"
    }
  },
  "Categories": [
    "identity-access",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_bucket_requires_mfa_delete.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_bucket_requires_mfa_delete/cloudtrail_bucket_requires_mfa_delete.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.s3.s3_client import s3_client


class cloudtrail_bucket_requires_mfa_delete(Check):
    def execute(self):
        findings = []
        if cloudtrail_client.trails is not None:
            for trail in cloudtrail_client.trails.values():
                if trail.is_logging:
                    trail_bucket_is_in_account = False
                    trail_bucket = trail.s3_bucket
                    report = Check_Report_AWS(metadata=self.metadata(), resource=trail)
                    report.region = trail.home_region
                    report.status = "FAIL"
                    report.status_extended = f"Trail {trail.name} bucket ({trail_bucket}) does not have MFA delete enabled."
                    for bucket in s3_client.buckets.values():
                        if trail_bucket == bucket.name:
                            trail_bucket_is_in_account = True
                            if bucket.mfa_delete:
                                report.status = "PASS"
                                report.status_extended = f"Trail {trail.name} bucket ({trail_bucket}) has MFA delete enabled."
                    # check if trail bucket is a cross account bucket
                    if not trail_bucket_is_in_account:
                        report.status = "MANUAL"
                        report.status_extended = f"Trail {trail.name} bucket ({trail_bucket}) is a cross-account bucket or out of Prowler's audit scope, please check it manually."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_cloudwatch_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_cloudwatch_logging_enabled/cloudtrail_cloudwatch_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_cloudwatch_logging_enabled",
  "CheckTitle": "CloudTrail trail has delivered logs to CloudWatch Logs in the last 24 hours",
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
  "Description": "**CloudTrail trails** are configured to send events to **CloudWatch Logs**, and show recent delivery within the last `24h`. Trails without integration or without recent CloudWatch delivery are identified, across single-Region and multi-Region trails.",
  "Risk": "Missing or stale CloudWatch delivery weakens visibility and delays detection, impacting confidentiality and integrity. Adversaries can:\n- Hide **privilege escalation**\n- Perform unauthorized **resource changes**\n- Exfiltrate data via API misuse",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.prowler.com/checks/aws/logging-policies/logging_4#aws-console",
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudtrail update-trail --name <trail_name> --cloud-watch-logs-log-group-arn <cloudwatch_log_group_arn> --cloud-watch-logs-role-arn <cloudwatch_logs_role_arn>",
      "NativeIaC": "```yaml\n# CloudFormation: enable CloudTrail delivery to CloudWatch Logs\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudTrail::Trail\n    Properties:\n      S3BucketName: \"<example_resource_name>\"\n      CloudWatchLogsLogGroupArn: \"<cloudwatch_log_group_arn>\"  # CRITICAL: sends CloudTrail events to CloudWatch Logs\n      CloudWatchLogsRoleArn: \"<cloudwatch_logs_role_arn>\"      # CRITICAL: role CloudTrail assumes to deliver events\n```",
      "Other": "1. In AWS Console, go to CloudTrail > Trails and select the trail\n2. In the CloudWatch Logs section, click Edit\n3. Set CloudWatch Logs to Enabled\n4. Choose an existing Log group (or create new) and select an IAM role with permissions for CreateLogStream/PutLogEvents\n5. Click Save changes\n6. After a few minutes, verify events appear in the chosen CloudWatch Logs log group",
      "Terraform": "```hcl\n# Terraform: enable CloudTrail delivery to CloudWatch Logs\nresource \"aws_cloudtrail\" \"<example_resource_name>\" {\n  name                       = \"<example_resource_name>\"\n  s3_bucket_name             = \"<example_resource_name>\"\n  cloud_watch_logs_group_arn = \"<cloudwatch_log_group_arn>\"  # CRITICAL: sends CloudTrail events to CloudWatch Logs\n  cloud_watch_logs_role_arn  = \"<cloudwatch_logs_role_arn>\"   # CRITICAL: role CloudTrail assumes to deliver events\n}\n```"
    },
    "Recommendation": {
      "Text": "Integrate every trail with **CloudWatch Logs** and maintain continuous, near-real-time delivery. Enforce **least privilege** on the delivery role, prefer **multi-Region** coverage, and implement **metric filters and alerts** for sensitive actions. Centralize retention to support **defense in depth**.",
      "Url": "https://hub.prowler.com/check/cloudtrail_cloudwatch_logging_enabled"
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

---[FILE: cloudtrail_cloudwatch_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_cloudwatch_logging_enabled/cloudtrail_cloudwatch_logging_enabled.py

```python
from datetime import datetime, timedelta, timezone

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)

maximum_time_without_logging = 1


class cloudtrail_cloudwatch_logging_enabled(Check):
    def execute(self):
        findings = []
        if cloudtrail_client.trails is not None:
            for trail in cloudtrail_client.trails.values():
                if trail.name:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=trail)
                    report.region = trail.home_region
                    report.status = "PASS"
                    if trail.is_multiregion:
                        report.status_extended = f"Multiregion trail {trail.name} has been logging in the last 24h."
                    else:
                        report.status_extended = f"Single region trail {trail.name} has been logging in the last 24h."
                    if trail.latest_cloudwatch_delivery_time:
                        last_log_delivery = (
                            datetime.now().replace(tzinfo=timezone.utc)
                            - trail.latest_cloudwatch_delivery_time
                        )
                        if last_log_delivery > timedelta(
                            days=maximum_time_without_logging
                        ):
                            report.status = "FAIL"
                            if trail.is_multiregion:
                                report.status_extended = f"Multiregion trail {trail.name} has not been logging in the last 24h."
                            else:
                                report.status_extended = f"Single region trail {trail.name} has not been logging in the last 24h."
                    else:
                        report.status = "FAIL"
                        if trail.is_multiregion:
                            report.status_extended = f"Multiregion trail {trail.name} has not been logging in the last 24h or is not configured to deliver logs."
                        else:
                            report.status_extended = f"Single region trail {trail.name} has not been logging in the last 24h or is not configured to deliver logs."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_insights_exist.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_insights_exist/cloudtrail_insights_exist.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_insights_exist",
  "CheckTitle": "CloudTrail trail has Insights enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "cloudtrail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsCloudTrailTrail",
  "Description": "**CloudTrail trails** that are logging are evaluated for **Insights** via `insight selectors`, which enable anomaly detection on management-event patterns (API call and error rates). The finding pinpoints logging trails where these selectors are missing.",
  "Risk": "Without **Insights**, abnormal API call or error rates can go unnoticed, delaying detection of credential abuse, privilege escalation, or runaway automation. Attackers may rapidly alter policies, delete resources, or exfiltrate data before response, impacting confidentiality and availability.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-insights-events-with-cloudtrail.html",
    "https://awscli.amazonaws.com/v2/documentation/api/2.18.18/reference/cloudtrail/put-insight-selectors.html",
    "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudtrail"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudtrail put-insight-selectors --trail-name <TRAIL_NAME> --insight-selectors '[{\"InsightType\":\"ApiCallRateInsight\"}]'",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudTrail::Trail\n    Properties:\n      TrailName: <example_resource_name>\n      S3BucketName: <example_resource_name>\n      IsLogging: true\n      InsightSelectors:\n        - InsightType: ApiCallRateInsight  # Critical fix: enables CloudTrail Insights on the trail\n```",
      "Other": "1. In the AWS Console, go to CloudTrail > Trails\n2. Select the trail that is logging\n3. Click Edit on the CloudTrail Insights section\n4. Enable Insights and select API call rate (or Error rate)\n5. Save changes",
      "Terraform": "```hcl\nresource \"aws_cloudtrail\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  s3_bucket_name = \"<example_resource_name>\"\n  enable_logging = true\n\n  insight_selector {\n    insight_type = \"ApiCallRateInsight\"  # Critical fix: enables CloudTrail Insights on the trail\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **CloudTrail Insights** on all logging trails (ideally all-Region or organization trails). Activate both `ApiCallRateInsight` and `ApiErrorRateInsight`. Integrate alerts with monitoring and review anomalies regularly. Apply **defense in depth** and least privilege to reduce potential blast radius.",
      "Url": "https://hub.prowler.com/check/cloudtrail_insights_exist"
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

---[FILE: cloudtrail_insights_exist.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_insights_exist/cloudtrail_insights_exist.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)


class cloudtrail_insights_exist(Check):
    def execute(self):
        findings = []
        if cloudtrail_client.trails is not None:
            for trail in cloudtrail_client.trails.values():
                if trail.is_logging:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=trail)
                    report.region = trail.home_region
                    report.status = "FAIL"
                    report.status_extended = f"Trail {trail.name} does not have insight selectors and it is logging."
                    if trail.has_insight_selectors:
                        report.status = "PASS"
                        report.status_extended = f"Trail {trail.name} has insight selectors and it is logging."
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_kms_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_kms_encryption_enabled/cloudtrail_kms_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_kms_encryption_enabled",
  "CheckTitle": "CloudTrail trail logs are encrypted at rest with a KMS key",
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
  "Description": "**AWS CloudTrail trails** are evaluated for use of **SSE-KMS** with a customer-managed KMS key to encrypt delivered log files at rest in S3. Trails without a configured KMS key are identified. *Applies to single-Region and multi-Region trails.*",
  "Risk": "Absent a **customer-managed KMS key**, log protection relies only on storage permissions. Bucket misconfigurations or stolen credentials can expose audit data, aiding evasion and lateral movement. Missing key-level controls, rotation, and usage audit weaken **confidentiality** and **forensic integrity**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/encrypting-cloudtrail-log-files-with-aws-kms.html",
    "https://trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudTrail/cloudtrail-logs-encrypted.html",
    "https://www.stream.security/rules/ensure-cloudtrail-logs-are-encrypted-at-rest",
    "https://www.clouddefense.ai/compliance-rules/cis-v130/logging/cis-v130-3-7"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudtrail update-trail --name <trail_name> --kms-key-id <kms_key_arn_or_id>",
      "NativeIaC": "```yaml\n# CloudFormation: enable KMS encryption for an existing/new CloudTrail\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudTrail::Trail\n    Properties:\n      S3BucketName: <example_resource_name>\n      KmsKeyId: <example_resource_id>  # Critical: sets the KMS key to encrypt CloudTrail logs at rest\n```",
      "Other": "1. In the AWS Console, go to CloudTrail > Trails\n2. Select the trail <trail_name>, click Edit\n3. Under Log file encryption, choose Use a KMS key and select <cloudtrail_kms_key>\n4. Click Save changes",
      "Terraform": "```hcl\n# Enable KMS encryption for CloudTrail\nresource \"aws_cloudtrail\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  s3_bucket_name = \"<example_resource_name>\"\n  kms_key_id     = \"<example_resource_id>\" # Critical: uses this KMS key to encrypt CloudTrail logs\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **SSE-KMS** on every trail using a **customer-managed KMS key**. Apply **least privilege** so only authorized roles can `Decrypt`, and enforce **separation of duties** between key admins and log readers. Rotate keys and monitor key usage to provide **defense in depth** for CloudTrail data.",
      "Url": "https://hub.prowler.com/check/cloudtrail_kms_encryption_enabled"
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

---[FILE: cloudtrail_kms_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_kms_encryption_enabled/cloudtrail_kms_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)


class cloudtrail_kms_encryption_enabled(Check):
    def execute(self):
        findings = []
        if cloudtrail_client.trails is not None:
            for trail in cloudtrail_client.trails.values():
                if trail.name:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=trail)
                    report.region = trail.home_region
                    report.status = "FAIL"
                    if trail.is_multiregion:
                        report.status_extended = (
                            f"Multiregion trail {trail.name} has encryption disabled."
                        )
                    else:
                        report.status_extended = (
                            f"Single region trail {trail.name} has encryption disabled."
                        )
                    if trail.kms_key:
                        report.status = "PASS"
                        if trail.is_multiregion:
                            report.status_extended = f"Multiregion trail {trail.name} has encryption enabled."
                        else:
                            report.status_extended = f"Single region trail {trail.name} has encryption enabled."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_logs_s3_bucket_access_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_logs_s3_bucket_access_logging_enabled/cloudtrail_logs_s3_bucket_access_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_logs_s3_bucket_access_logging_enabled",
  "CheckTitle": "CloudTrail trail destination S3 bucket has access logging enabled",
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
  "Description": "CloudTrail trails deliver logs to an S3 bucket; this evaluates whether that bucket has **S3 server access logging** enabled to record requests against it.\n\n*If the destination bucket is outside the account or audit scope, a manual review is indicated.*",
  "Risk": "Without access logging on the CloudTrail logs bucket, access and changes to log files lack an independent audit trail. Attackers could read, delete, or replace logs without attribution, undermining **log confidentiality** and **integrity**, and slowing **incident response**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/cloudtrail-controls.html",
    "https://docs.aws.amazon.com/AmazonS3/latest/dev/security-best-practices.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws s3api put-bucket-logging --bucket <CLOUDTRAIL_BUCKET_NAME> --bucket-logging-status \"{\\\"LoggingEnabled\\\":{\\\"TargetBucket\\\":\\\"<TARGET_BUCKET_NAME>\\\"}}\"",
      "NativeIaC": "```yaml\n# CloudFormation: enable S3 access logging on the CloudTrail destination bucket\nResources:\n  <example_log_bucket_name>:\n    Type: AWS::S3::Bucket\n\n  <example_cloudtrail_bucket>:\n    Type: AWS::S3::Bucket\n    Properties:\n      LoggingConfiguration:\n        DestinationBucketName: !Ref <example_log_bucket_name>  # Critical: turns on server access logging to this destination bucket\n        # This enables access logging so the check passes\n```",
      "Other": "1. In the AWS Console, go to S3 and open the bucket used by your CloudTrail trail\n2. Select the Properties tab\n3. In Server access logging, click Edit\n4. Enable logging and choose a different destination S3 bucket for the logs\n5. Click Save changes",
      "Terraform": "```hcl\n# Enable access logging on the CloudTrail S3 bucket\nresource \"aws_s3_bucket\" \"<example_log_bucket_name>\" {\n  bucket = \"<example_log_bucket_name>\"\n}\n\nresource \"aws_s3_bucket\" \"<example_bucket_name>\" {\n  bucket = \"<example_bucket_name>\"\n}\n\nresource \"aws_s3_bucket_logging\" \"<example_resource_name>\" {\n  bucket        = aws_s3_bucket.<example_bucket_name>.id\n  target_bucket = aws_s3_bucket.<example_log_bucket_name>.id  # Critical: enables server access logging to the target bucket\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **S3 server access logging** on the CloudTrail logs bucket and write logs to a separate, tightly controlled bucket. Apply **least privilege**, enable **versioning**, and consider **Object Lock** to deter tampering. Centralize monitoring to support defense-in-depth and rapid investigation.",
      "Url": "https://hub.prowler.com/check/cloudtrail_logs_s3_bucket_access_logging_enabled"
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

---[FILE: cloudtrail_logs_s3_bucket_access_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_logs_s3_bucket_access_logging_enabled/cloudtrail_logs_s3_bucket_access_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.s3.s3_client import s3_client


class cloudtrail_logs_s3_bucket_access_logging_enabled(Check):
    def execute(self):
        findings = []
        if cloudtrail_client.trails is not None:
            for trail in cloudtrail_client.trails.values():
                if trail.name:
                    trail_bucket_is_in_account = False
                    trail_bucket = trail.s3_bucket
                    report = Check_Report_AWS(metadata=self.metadata(), resource=trail)
                    report.region = trail.home_region
                    report.status = "FAIL"
                    if trail.is_multiregion:
                        report.status_extended = f"Multiregion Trail {trail.name} S3 bucket access logging is not enabled for bucket {trail_bucket}."
                    else:
                        report.status_extended = f"Single region Trail {trail.name} S3 bucket access logging is not enabled for bucket {trail_bucket}."
                    for bucket in s3_client.buckets.values():
                        if trail_bucket == bucket.name:
                            trail_bucket_is_in_account = True
                            if bucket.logging:
                                report.status = "PASS"
                                if trail.is_multiregion:
                                    report.status_extended = f"Multiregion Trail {trail.name} S3 bucket access logging is enabled for bucket {trail_bucket}."
                                else:
                                    report.status_extended = f"Single region Trail {trail.name} S3 bucket access logging is enabled for bucket {trail_bucket}."
                            break

                    # check if trail is delivering logs in a cross account bucket or another region out of Prowler's audit scope
                    if not trail_bucket_is_in_account:
                        report.status = "MANUAL"
                        report.status_extended = f"Trail {trail.name} is delivering logs to bucket {trail_bucket} which is a cross-account bucket or out of Prowler's audit scope, please check it manually."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
