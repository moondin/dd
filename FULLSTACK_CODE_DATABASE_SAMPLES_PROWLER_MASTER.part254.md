---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 254
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 254 of 867)

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

---[FILE: cloudwatch_log_metric_filter_for_s3_bucket_policy_changes.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_for_s3_bucket_policy_changes/cloudwatch_log_metric_filter_for_s3_bucket_policy_changes.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.cloudwatch.cloudwatch_client import (
    cloudwatch_client,
)
from prowler.providers.aws.services.cloudwatch.lib.metric_filters import (
    check_cloudwatch_log_metric_filter,
)
from prowler.providers.aws.services.cloudwatch.logs_client import logs_client


class cloudwatch_log_metric_filter_for_s3_bucket_policy_changes(Check):
    def execute(self):
        pattern = r"\$\.eventSource\s*=\s*.?s3.amazonaws.com.+\$\.eventName\s*=\s*.?PutBucketAcl.+\$\.eventName\s*=\s*.?PutBucketPolicy.+\$\.eventName\s*=\s*.?PutBucketCors.+\$\.eventName\s*=\s*.?PutBucketLifecycle.+\$\.eventName\s*=\s*.?PutBucketReplication.+\$\.eventName\s*=\s*.?DeleteBucketPolicy.+\$\.eventName\s*=\s*.?DeleteBucketCors.+\$\.eventName\s*=\s*.?DeleteBucketLifecycle.+\$\.eventName\s*=\s*.?DeleteBucketReplication.?"
        findings = []

        report = check_cloudwatch_log_metric_filter(
            pattern,
            cloudtrail_client.trails,
            logs_client.metric_filters,
            cloudwatch_client.metric_alarms,
            self.metadata(),
        )

        if cloudtrail_client.trails is not None:
            if report is None:
                report = Check_Report_AWS(metadata=self.metadata(), resource={})
                report.status = "FAIL"
                report.status_extended = "No CloudWatch log groups found with metric filters or alarms associated."
                report.region = logs_client.region
                report.resource_id = logs_client.audited_account
                report.resource_arn = logs_client.log_group_arn_template
                report.resource_tags = []

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_metric_filter_policy_changes.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_policy_changes/cloudwatch_log_metric_filter_policy_changes.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_metric_filter_policy_changes",
  "CheckTitle": "CloudWatch Logs metric filter and alarm exist for IAM policy changes",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "TTPs/Privilege Escalation"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "CloudWatch uses a metric filter and alarm to track **IAM policy changes** recorded by CloudTrail (e.g., `CreatePolicy`, `DeletePolicy`, version changes, inline policy edits, policy attach/detach). This finding reflects whether that filter and an associated alarm are present on the trail's log group.",
  "Risk": "Absent alerting on **IAM policy changes**, privilege modifications can go unnoticed, enabling **privilege escalation**, hidden backdoors, or permission revocations. This threatens **confidentiality** and **integrity**, and may impact **availability** if critical access is removed or misconfigured.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html",
    "https://www.clouddefense.ai/compliance-rules/cis-v140/monitoring/cis-v140-4-4",
    "https://www.intelligentdiscovery.io/controls/cloudwatch/cloudwatch-alarm-iam-policy-change"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Create metric filter and alarm for IAM policy changes\nResources:\n  IAMPolicyChangeMetricFilter:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: <example_resource_name>  # IMPORTANT: CloudTrail log group to monitor\n      # CRITICAL: Pattern matching IAM policy change events required by the check\n      FilterPattern: '{($.eventName=DeleteGroupPolicy)||($.eventName=DeleteRolePolicy)||($.eventName=DeleteUserPolicy)||($.eventName=PutGroupPolicy)||($.eventName=PutRolePolicy)||($.eventName=PutUserPolicy)||($.eventName=CreatePolicy)||($.eventName=DeletePolicy)||($.eventName=CreatePolicyVersion)||($.eventName=DeletePolicyVersion)||($.eventName=AttachRolePolicy)||($.eventName=DetachRolePolicy)||($.eventName=AttachUserPolicy)||($.eventName=DetachUserPolicy)||($.eventName=AttachGroupPolicy)||($.eventName=DetachGroupPolicy)}'\n      MetricTransformations:\n        - MetricName: <example_resource_name>   # CRITICAL: Metric created from filter\n          MetricNamespace: CISBenchmark        # CRITICAL: Namespace for the metric\n          MetricValue: \"1\"\n\n  IAMPolicyChangeAlarm:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      AlarmName: <example_resource_name>\n      # CRITICAL: Alarm on the metric created above when >= 1 event occurs\n      MetricName: <example_resource_name>\n      Namespace: CISBenchmark\n      Statistic: Sum\n      Period: 300\n      EvaluationPeriods: 1\n      Threshold: 1\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n```",
      "Other": "1. Open the CloudWatch console > Logs > Log groups and select the CloudTrail log group\n2. Create metric filter:\n   - Filter pattern: {($.eventName=DeleteGroupPolicy)||($.eventName=DeleteRolePolicy)||($.eventName=DeleteUserPolicy)||($.eventName=PutGroupPolicy)||($.eventName=PutRolePolicy)||($.eventName=PutUserPolicy)||($.eventName=CreatePolicy)||($.eventName=DeletePolicy)||($.eventName=CreatePolicyVersion)||($.eventName=DeletePolicyVersion)||($.eventName=AttachRolePolicy)||($.eventName=DetachRolePolicy)||($.eventName=AttachUserPolicy)||($.eventName=DetachUserPolicy)||($.eventName=AttachGroupPolicy)||($.eventName=DetachGroupPolicy)}\n   - Metric name: <example_resource_name>\n   - Namespace: CISBenchmark\n   - Metric value: 1\n3. On the Metric filters tab, select the new filter and choose Create alarm\n4. Set: Statistic=Sum, Period=5 minutes, Threshold type=Static, Greater/Equal, Threshold=1, Evaluation periods=1\n5. Create the alarm",
      "Terraform": "```hcl\n# Terraform: Metric filter and alarm for IAM policy changes\nresource \"aws_cloudwatch_log_metric_filter\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  log_group_name = \"<example_resource_name>\"  # CloudTrail log group\n\n  # CRITICAL: Pattern matching IAM policy change events required by the check\n  pattern = \"{($.eventName=DeleteGroupPolicy)||($.eventName=DeleteRolePolicy)||($.eventName=DeleteUserPolicy)||($.eventName=PutGroupPolicy)||($.eventName=PutRolePolicy)||($.eventName=PutUserPolicy)||($.eventName=CreatePolicy)||($.eventName=DeletePolicy)||($.eventName=CreatePolicyVersion)||($.eventName=DeletePolicyVersion)||($.eventName=AttachRolePolicy)||($.eventName=DetachRolePolicy)||($.eventName=AttachUserPolicy)||($.eventName=DetachUserPolicy)||($.eventName=AttachGroupPolicy)||($.eventName=DetachGroupPolicy)}\"\n\n  metric_transformation {\n    name      = \"<example_resource_name>\"      # CRITICAL: Metric created from filter\n    namespace = \"CISBenchmark\"                 # CRITICAL: Namespace for the metric\n    value     = \"1\"\n  }\n}\n\nresource \"aws_cloudwatch_metric_alarm\" \"<example_resource_name>\" {\n  alarm_name          = \"<example_resource_name>\"\n  # CRITICAL: Alarm on the metric when >= 1 event occurs\n  metric_name         = aws_cloudwatch_log_metric_filter.<example_resource_name>.metric_transformation[0].name\n  namespace           = aws_cloudwatch_log_metric_filter.<example_resource_name>.metric_transformation[0].namespace\n  statistic           = \"Sum\"\n  period              = 300\n  evaluation_periods  = 1\n  threshold           = 1\n  comparison_operator = \"GreaterThanOrEqualToThreshold\"\n}\n```"
    },
    "Recommendation": {
      "Text": "Create a metric filter for IAM policy create/update/delete and attach/detach events with an **alarm** to notify responders.\n- Enforce **least privilege** and separation of duties for policy changes\n- Require approvals and central logging across Regions/accounts\n- Integrate alerts with incident response",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_metric_filter_policy_changes"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Logging and Monitoring"
}
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_metric_filter_policy_changes.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_policy_changes/cloudwatch_log_metric_filter_policy_changes.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.cloudwatch.cloudwatch_client import (
    cloudwatch_client,
)
from prowler.providers.aws.services.cloudwatch.lib.metric_filters import (
    check_cloudwatch_log_metric_filter,
)
from prowler.providers.aws.services.cloudwatch.logs_client import logs_client


class cloudwatch_log_metric_filter_policy_changes(Check):
    def execute(self):
        pattern = r"\$\.eventName\s*=\s*.?DeleteGroupPolicy.+\$\.eventName\s*=\s*.?DeleteRolePolicy.+\$\.eventName\s*=\s*.?DeleteUserPolicy.+\$\.eventName\s*=\s*.?PutGroupPolicy.+\$\.eventName\s*=\s*.?PutRolePolicy.+\$\.eventName\s*=\s*.?PutUserPolicy.+\$\.eventName\s*=\s*.?CreatePolicy.+\$\.eventName\s*=\s*.?DeletePolicy.+\$\.eventName\s*=\s*.?CreatePolicyVersion.+\$\.eventName\s*=\s*.?DeletePolicyVersion.+\$\.eventName\s*=\s*.?AttachRolePolicy.+\$\.eventName\s*=\s*.?DetachRolePolicy.+\$\.eventName\s*=\s*.?AttachUserPolicy.+\$\.eventName\s*=\s*.?DetachUserPolicy.+\$\.eventName\s*=\s*.?AttachGroupPolicy.+\$\.eventName\s*=\s*.?DetachGroupPolicy.?"
        findings = []

        report = check_cloudwatch_log_metric_filter(
            pattern,
            cloudtrail_client.trails,
            logs_client.metric_filters,
            cloudwatch_client.metric_alarms,
            self.metadata(),
        )

        if cloudtrail_client.trails is not None:
            if report is None:
                report = Check_Report_AWS(metadata=self.metadata(), resource={})
                report.status = "FAIL"
                report.status_extended = "No CloudWatch log groups found with metric filters or alarms associated."
                report.region = logs_client.region
                report.resource_id = logs_client.audited_account
                report.resource_arn = logs_client.log_group_arn_template
                report.resource_tags = []

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_metric_filter_root_usage.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_root_usage/cloudwatch_log_metric_filter_root_usage.metadata.json
Signals: Next.js

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_metric_filter_root_usage",
  "CheckTitle": "Account has a CloudWatch Logs metric filter and alarm for root account usage",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/AWS Security Best Practices",
    "TTPs/Privilege Escalation"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "**CloudTrail** logs in CloudWatch include a metric filter for **root account activity** (`{ $.userIdentity.type = \"Root\" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != \"AwsServiceEvent\" }`) and a linked CloudWatch alarm that triggers when the filter matches.",
  "Risk": "Without alerting on **root activity**, full-privilege actions can proceed unnoticed, impacting:\n- confidentiality via data access/exfiltration\n- integrity via policy/config tampering\n- availability via deletions or shutdowns\nDelayed detection increases blast radius and persistence.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudWatchLogs/root-account-usage-alarm.html",
    "https://asecure.cloud/a/root_account_login/",
    "https://support.icompaas.com/support/solutions/articles/62000083624-ensure-a-log-metric-filter-and-alarm-exist-for-usage-of-root-account",
    "https://www.intelligentdiscovery.io/controls/cloudwatch/cloudwatch-alarm-root-account-usage",
    "https://aws.amazon.com/blogs/security/how-to-receive-notifications-when-your-aws-accounts-root-access-keys-are-used/",
    "https://www.tenable.com/audits/items/CIS_Amazon_Web_Services_Foundations_v1.5.0_L1.audit:000adfb028a1475075a6b5d2117f53f4"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Create metric filter and alarm for root account usage\nResources:\n  RootUsageMetricFilter:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: \"<example_resource_name>\"\n      FilterPattern: '{ $.userIdentity.type = \"Root\" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != \"AwsServiceEvent\" }'  # CRITICAL: detects root user actions not invoked by services\n      MetricTransformations:\n        - MetricValue: \"1\"\n          MetricNamespace: \"<example_resource_name>\"  # CRITICAL: metric namespace used by the alarm\n          MetricName: \"<example_resource_name>\"       # CRITICAL: metric name used by the alarm\n\n  RootUsageAlarm:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n      EvaluationPeriods: 1\n      MetricName: \"<example_resource_name>\"   # CRITICAL: alarms on the metric created by the filter\n      Namespace: \"<example_resource_name>\"\n      Period: 300\n      Statistic: Sum\n      Threshold: 1\n```",
      "Other": "1. In the AWS console, open CloudWatch > Logs > Log groups and select the CloudTrail log group\n2. Go to Metric filters > Create metric filter\n3. For Filter pattern, enter: { $.userIdentity.type = \"Root\" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != \"AwsServiceEvent\" }\n4. Click Next, set any Filter name, set Metric namespace and Metric name, set Metric value to 1, then Create metric filter\n5. Select the new metric filter and click Create alarm\n6. Set Period to 5 minutes, Statistic to Sum, Threshold type Static with value 1, Evaluation periods 1, then Create alarm",
      "Terraform": "```hcl\n# CloudWatch Logs metric filter for root account usage\nresource \"aws_cloudwatch_log_metric_filter\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  log_group_name = \"<example_resource_name>\"\n  pattern        = \"{ $.userIdentity.type = \\\"Root\\\" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != \\\"AwsServiceEvent\\\" }\" # CRITICAL: detects root user actions\n\n  metric_transformation {\n    name      = \"<example_resource_name>\"     # CRITICAL: metric used by the alarm\n    namespace = \"<example_resource_name>\"\n    value     = \"1\"\n  }\n}\n\n# Alarm on the root usage metric\nresource \"aws_cloudwatch_metric_alarm\" \"<example_resource_name>\" {\n  comparison_operator = \"GreaterThanOrEqualToThreshold\"\n  evaluation_periods  = 1\n  metric_name         = \"<example_resource_name>\"   # CRITICAL: matches metric filter\n  namespace           = \"<example_resource_name>\"\n  period              = 300\n  statistic           = \"Sum\"\n  threshold           = 1\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable real-time alerts for **root activity** using a log metric filter and a high-priority alarm with notifications.\n\nReduce exposure: enforce **least privilege**, keep root for *break-glass* with MFA, disable root access keys, and route alerts into incident response for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_metric_filter_root_usage"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Logging and Monitoring"
}
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_metric_filter_root_usage.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_root_usage/cloudwatch_log_metric_filter_root_usage.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.cloudwatch.cloudwatch_client import (
    cloudwatch_client,
)
from prowler.providers.aws.services.cloudwatch.lib.metric_filters import (
    check_cloudwatch_log_metric_filter,
)
from prowler.providers.aws.services.cloudwatch.logs_client import logs_client


class cloudwatch_log_metric_filter_root_usage(Check):
    def execute(self):
        pattern = r"\$\.userIdentity\.type\s*=\s*.?Root.+\$\.userIdentity\.invokedBy NOT EXISTS.+\$\.eventType\s*!=\s*.?AwsServiceEvent.?"
        findings = []

        report = check_cloudwatch_log_metric_filter(
            pattern,
            cloudtrail_client.trails,
            logs_client.metric_filters,
            cloudwatch_client.metric_alarms,
            self.metadata(),
        )

        if cloudtrail_client.trails is not None:
            if report is None:
                report = Check_Report_AWS(metadata=self.metadata(), resource={})
                report.status = "FAIL"
                report.status_extended = "No CloudWatch log groups found with metric filters or alarms associated."
                report.region = logs_client.region
                report.resource_id = logs_client.audited_account
                report.resource_arn = logs_client.log_group_arn_template
                report.resource_tags = []

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_metric_filter_security_group_changes.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_security_group_changes/cloudwatch_log_metric_filter_security_group_changes.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_metric_filter_security_group_changes",
  "CheckTitle": "CloudWatch Logs metric filter and alarm exist for security group changes",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "**CloudTrail** events for **security group configuration changes** are monitored using a **CloudWatch Logs metric filter** with an associated **alarm**. The filter targets actions like `AuthorizeSecurityGroupIngress/Egress`, `RevokeSecurityGroupIngress/Egress`, `CreateSecurityGroup`, and `DeleteSecurityGroup` to surface any security group modifications.",
  "Risk": "Without alerting on **security group changes**, unauthorized or mistaken rules can expose services to the Internet, enabling brute force and lateral movement (**confidentiality, integrity**). Deletions or restrictive edits can break connectivity (**availability**). Delayed detection increases attacker dwell time and impact.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html",
    "https://support.icompaas.com/support/solutions/articles/62000084030-ensure-a-log-metric-filter-and-alarm-exist-for-security-group-changes",
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Alarm-On-Logs.html",
    "https://asecure.cloud/a/cwalarm_securitygroup_changes/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Create metric filter and alarm for Security Group changes\nResources:\n  MetricFilter:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: <example_log_group_name>\n      # Critical: Matches Security Group change events required by the check\n      # This publishes a metric when these events appear in CloudTrail logs\n      FilterPattern: '{ ($.eventName = AuthorizeSecurityGroupIngress) || ($.eventName = AuthorizeSecurityGroupEgress) || ($.eventName = RevokeSecurityGroupIngress) || ($.eventName = RevokeSecurityGroupEgress) || ($.eventName = CreateSecurityGroup) || ($.eventName = DeleteSecurityGroup) }'\n      MetricTransformations:\n        - MetricName: <example_metric_name>\n          MetricNamespace: <example_metric_namespace>\n          MetricValue: \"1\"\n\n  Alarm:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      # Critical: Alarm on the metric to satisfy the requirement\n      MetricName: <example_metric_name>\n      Namespace: <example_metric_namespace>\n      Statistic: Sum\n      Period: 300\n      EvaluationPeriods: 1\n      Threshold: 1\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n```",
      "Other": "1. Open the CloudWatch console > Logs > Log groups, and select the CloudTrail log group\n2. Create metric filter with this pattern:\n   { ($.eventName = AuthorizeSecurityGroupIngress) || ($.eventName = AuthorizeSecurityGroupEgress) || ($.eventName = RevokeSecurityGroupIngress) || ($.eventName = RevokeSecurityGroupEgress) || ($.eventName = CreateSecurityGroup) || ($.eventName = DeleteSecurityGroup) }\n3. Assign metric: name <example_metric_name>, namespace <example_metric_namespace>, value 1, then create the filter\n4. From the metric filter, choose Create alarm and set: Statistic Sum, Period 5 minutes, Threshold type Static, Greater/Equal 1, Evaluation periods 1, then create the alarm",
      "Terraform": "```hcl\n# Metric filter for Security Group changes\nresource \"aws_cloudwatch_log_metric_filter\" \"sg\" {\n  name           = \"<example_resource_name>\"\n  log_group_name = \"<example_log_group_name>\"\n  # Critical: Matches Security Group change events required by the check\n  pattern = \"{ ($.eventName = AuthorizeSecurityGroupIngress) || ($.eventName = AuthorizeSecurityGroupEgress) || ($.eventName = RevokeSecurityGroupIngress) || ($.eventName = RevokeSecurityGroupEgress) || ($.eventName = CreateSecurityGroup) || ($.eventName = DeleteSecurityGroup) }\"\n\n  metric_transformation {\n    name      = \"<example_metric_name>\"\n    namespace = \"<example_metric_namespace>\"\n    value     = \"1\"\n  }\n}\n\n# Alarm for the above metric\nresource \"aws_cloudwatch_metric_alarm\" \"sg\" {\n  alarm_name          = \"<example_resource_name>\"\n  # Critical: Alarm on the SG change metric to pass the control\n  metric_name         = \"<example_metric_name>\"\n  namespace           = \"<example_metric_namespace>\"\n  statistic           = \"Sum\"\n  period              = 300\n  evaluation_periods  = 1\n  threshold           = 1\n  comparison_operator = \"GreaterThanOrEqualToThreshold\"\n}\n```"
    },
    "Recommendation": {
      "Text": "Establish real-time alerts for **security group modifications** by sending CloudTrail to CloudWatch, creating metric filters and alarms, and notifying responders.\n- Enforce **least privilege** on SG changes\n- Use change management and tagging\n- Centralize logs, test alarms, and maintain runbooks\n- Layer with NACLs and WAF for **defense in depth**",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_metric_filter_security_group_changes"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Logging and Monitoring"
}
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_metric_filter_security_group_changes.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_security_group_changes/cloudwatch_log_metric_filter_security_group_changes.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.cloudwatch.cloudwatch_client import (
    cloudwatch_client,
)
from prowler.providers.aws.services.cloudwatch.lib.metric_filters import (
    check_cloudwatch_log_metric_filter,
)
from prowler.providers.aws.services.cloudwatch.logs_client import logs_client


class cloudwatch_log_metric_filter_security_group_changes(Check):
    def execute(self):
        pattern = r"\$\.eventName\s*=\s*.?AuthorizeSecurityGroupIngress.+\$\.eventName\s*=\s*.?AuthorizeSecurityGroupEgress.+\$\.eventName\s*=\s*.?RevokeSecurityGroupIngress.+\$\.eventName\s*=\s*.?RevokeSecurityGroupEgress.+\$\.eventName\s*=\s*.?CreateSecurityGroup.+\$\.eventName\s*=\s*.?DeleteSecurityGroup.?"
        findings = []

        report = check_cloudwatch_log_metric_filter(
            pattern,
            cloudtrail_client.trails,
            logs_client.metric_filters,
            cloudwatch_client.metric_alarms,
            self.metadata(),
        )

        if cloudtrail_client.trails is not None:
            if report is None:
                report = Check_Report_AWS(metadata=self.metadata(), resource={})
                report.status = "FAIL"
                report.status_extended = "No CloudWatch log groups found with metric filters or alarms associated."
                report.region = logs_client.region
                report.resource_id = logs_client.audited_account
                report.resource_arn = logs_client.log_group_arn_template
                report.resource_tags = []

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_metric_filter_sign_in_without_mfa.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_sign_in_without_mfa/cloudwatch_log_metric_filter_sign_in_without_mfa.metadata.json
Signals: Next.js

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_metric_filter_sign_in_without_mfa",
  "CheckTitle": "CloudWatch log metric filter and alarm exist for Management Console sign-in without MFA",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "TTPs/Initial Access",
    "Unusual Behaviors/User"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "**CloudTrail logs** in CloudWatch are assessed for a metric filter and alarm that detect console logins where `$.eventName = ConsoleLogin` and `$.additionalEventData.MFAUsed != \\\"Yes\\\"`.\n\nThis reflects whether alerting exists for sign-ins that occur without **MFA**.",
  "Risk": "Without alerting on non-MFA console logins, successful use of stolen passwords can go **undetected**, enabling:\n- Unauthorized console access and IAM changes\n- Data exfiltration or deletion\n\nImpacts: loss of **confidentiality** and **integrity**, and potential **availability** disruption.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudWatchLogs/console-sign-in-without-mfa.html",
    "https://www.tenable.com/audits/items/CIS_Amazon_Web_Services_Foundations_v3.0.0_L1.audit:1957056ee174cc38502d5f5f1864333b",
    "https://www.clouddefense.ai/compliance-rules/gdpr/data-protection/log-metric-filter-console-login-mfa",
    "https://www.intelligentdiscovery.io/controls/cloudwatch/cloudwatch-alarm-no-mfa",
    "https://support.icompaas.com/support/solutions/articles/62000083605-ensure-a-log-metric-filter-and-alarm-exist-for-management-console-sign-in-without-mfa"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Create metric filter and alarm for console sign-in without MFA\nResources:\n  NoMFAConsoleSigninMetricFilter:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: \"<example_resource_name>\"\n      FilterPattern: '{ ($.eventName = \"ConsoleLogin\") && ($.additionalEventData.MFAUsed != \"Yes\") }' # CRITICAL: detects ConsoleLogin events without MFA\n      MetricTransformations:\n        - MetricName: \"<example_resource_name>\"\n          MetricNamespace: \"<example_resource_name>\"\n          MetricValue: \"1\"  # CRITICAL: emits a metric on each match\n\n  NoMFAConsoleSigninAlarm:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      MetricName: \"<example_resource_name>\"   # CRITICAL: alarm uses the metric from the filter\n      Namespace: \"<example_resource_name>\"\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n      EvaluationPeriods: 1\n      Period: 300\n      Statistic: Sum\n      Threshold: 1  # CRITICAL: alarm on first occurrence\n```",
      "Other": "1. In AWS Console, go to CloudWatch > Logs > Log groups and open the CloudTrail log group\n2. Go to Metric filters > Create metric filter\n3. Set Filter pattern to: { ($.eventName = \"ConsoleLogin\") && ($.additionalEventData.MFAUsed != \"Yes\") }\n4. Next > set Filter name, Metric namespace, Metric name; set Metric value = 1; Create metric filter\n5. Select the new filter > Create alarm\n6. Set Statistic = Sum, Period = 5 minutes, Threshold type = Static, Threshold = 1, Whenever >= 1; Next\n7. Skip actions if not needed, Name the alarm, Create alarm",
      "Terraform": "```hcl\n# Create metric filter for console sign-in without MFA\nresource \"aws_cloudwatch_log_metric_filter\" \"nomfa\" {\n  name           = \"<example_resource_name>\"\n  log_group_name = \"<example_resource_name>\"\n  pattern        = \"{ ($.eventName = \\\"ConsoleLogin\\\") && ($.additionalEventData.MFAUsed != \\\"Yes\\\") }\"  # CRITICAL: detects ConsoleLogin without MFA\n\n  metric_transformation {\n    name      = \"<example_resource_name>\"\n    namespace = \"<example_resource_name>\"\n    value     = \"1\"  # CRITICAL: emits a count per match\n  }\n}\n\n# Alarm on the emitted metric\nresource \"aws_cloudwatch_metric_alarm\" \"nomfa\" {\n  alarm_name          = \"<example_resource_name>\"\n  metric_name         = aws_cloudwatch_log_metric_filter.nomfa.metric_transformation[0].name  # CRITICAL: ties alarm to the metric\n  namespace           = aws_cloudwatch_log_metric_filter.nomfa.metric_transformation[0].namespace\n  comparison_operator = \"GreaterThanOrEqualToThreshold\"\n  evaluation_periods  = 1\n  period              = 300\n  statistic           = \"Sum\"\n  threshold           = 1  # CRITICAL: alarm on first event\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **MFA** for all console-capable identities and maintain alerts for `ConsoleLogin` with `MFAUsed != \\\"Yes\\\"`.\n\nApply **least privilege**, route alarms to monitored channels, and tune for SSO to reduce noise. Test alarms regularly and review coverage as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_metric_filter_sign_in_without_mfa"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Logging and Monitoring"
}
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_metric_filter_sign_in_without_mfa.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_sign_in_without_mfa/cloudwatch_log_metric_filter_sign_in_without_mfa.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.cloudwatch.cloudwatch_client import (
    cloudwatch_client,
)
from prowler.providers.aws.services.cloudwatch.lib.metric_filters import (
    check_cloudwatch_log_metric_filter,
)
from prowler.providers.aws.services.cloudwatch.logs_client import logs_client


class cloudwatch_log_metric_filter_sign_in_without_mfa(Check):
    def execute(self):
        pattern = r"\$\.eventName\s*=\s*.?ConsoleLogin.+\$\.additionalEventData\.MFAUsed\s*!=\s*.?Yes.?"
        findings = []

        report = check_cloudwatch_log_metric_filter(
            pattern,
            cloudtrail_client.trails,
            logs_client.metric_filters,
            cloudwatch_client.metric_alarms,
            self.metadata(),
        )

        if cloudtrail_client.trails is not None:
            if report is None:
                report = Check_Report_AWS(metadata=self.metadata(), resource={})
                report.status = "FAIL"
                report.status_extended = "No CloudWatch log groups found with metric filters or alarms associated."
                report.region = logs_client.region
                report.resource_id = logs_client.audited_account
                report.resource_arn = logs_client.log_group_arn_template
                report.resource_tags = []

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_metric_filter_unauthorized_api_calls.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_unauthorized_api_calls/cloudwatch_log_metric_filter_unauthorized_api_calls.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_metric_filter_unauthorized_api_calls",
  "CheckTitle": "CloudWatch Logs metric filter and alarm exist for unauthorized API calls",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "TTPs/Initial Access/Unauthorized Access"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "**CloudWatch Logs** for CloudTrail include a metric filter that matches unauthorized API errors (`$.errorCode=\"*UnauthorizedOperation\"` or `$.errorCode=\"AccessDenied*\"`) and a linked alarm that triggers when events match the filter.",
  "Risk": "Without alerting on **unauthorized API calls**, permission probing and failed access by compromised identities can go unnoticed. Attackers can enumerate services, pivot, and attempt privilege escalation, threatening data **confidentiality** and **integrity**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html",
    "https://asecure.cloud/a/unauthorized_api_calls/",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudWatchLogs/authorization-failures-alarm.html",
    "https://www.tenable.com/policies/[type]/AC_AWS_0559",
    "https://www.intelligentdiscovery.io/controls/cloudwatch/cloudwatch-unauthorized-api-calls",
    "https://support.icompaas.com/support/solutions/articles/62000083561-ensure-a-log-metric-filter-and-alarm-exist-for-unauthorized-api-calls"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Create metric filter and alarm for unauthorized API calls\nResources:\n  MetricFilterUnauthorized:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: <example_resource_name>\n      FilterPattern: '{($.errorCode = \"*UnauthorizedOperation\") || ($.errorCode = \"AccessDenied*\")}'  # Critical: detects unauthorized/denied API calls\n      MetricTransformations:\n        - MetricName: unauthorized_api_calls_metric\n          MetricNamespace: CISBenchmark\n          MetricValue: \"1\"\n\n  AlarmUnauthorized:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n      EvaluationPeriods: 1\n      MetricName: unauthorized_api_calls_metric  # Critical: alarm on the metric from the filter\n      Namespace: CISBenchmark\n      Period: 300\n      Statistic: Sum\n      Threshold: 1\n```",
      "Other": "1. In the AWS Console, open CloudWatch > Logs > Log groups and select the CloudTrail log group\n2. Go to Metric filters > Create metric filter\n3. Set Filter pattern to: {($.errorCode = \"*UnauthorizedOperation\") || ($.errorCode = \"AccessDenied*\")}\n4. Name the metric unauthorized_api_calls_metric, set Namespace to CISBenchmark, Value to 1, then create\n5. Select the new metric filter and click Create alarm\n6. Set Statistic: Sum, Period: 5 minutes, Threshold type: Static, Threshold: 1, Evaluation periods: 1\n7. Create the alarm",
      "Terraform": "```hcl\n# Terraform: Metric filter and alarm for unauthorized API calls\nresource \"aws_cloudwatch_log_metric_filter\" \"unauthorized\" {\n  name           = \"unauthorized_api_calls_metric\"\n  log_group_name = \"<example_resource_name>\"\n  pattern        = \"{($.errorCode = \\\"*UnauthorizedOperation\\\") || ($.errorCode = \\\"AccessDenied*\\\")}\"  # Critical: detects unauthorized/denied API calls\n\n  metric_transformation {\n    name      = \"unauthorized_api_calls_metric\"\n    namespace = \"CISBenchmark\"\n    value     = \"1\"\n  }\n}\n\nresource \"aws_cloudwatch_metric_alarm\" \"unauthorized\" {\n  comparison_operator = \"GreaterThanOrEqualToThreshold\"\n  evaluation_periods  = 1\n  metric_name         = \"unauthorized_api_calls_metric\"   # Critical: alarm on the metric from the filter\n  namespace           = \"CISBenchmark\"\n  period              = 300\n  statistic           = \"Sum\"\n  threshold           = 1\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable real-time **alerting** by adding a CloudWatch Logs metric filter for unauthorized errors (`*UnauthorizedOperation`, `AccessDenied*`) and associating it with an alarm that notifies responders.\n- Enforce **least privilege** to reduce noise\n- Integrate with IR tooling for **defense in depth**",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_metric_filter_unauthorized_api_calls"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Logging and Monitoring"
}
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_metric_filter_unauthorized_api_calls.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_unauthorized_api_calls/cloudwatch_log_metric_filter_unauthorized_api_calls.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.cloudwatch.cloudwatch_client import (
    cloudwatch_client,
)
from prowler.providers.aws.services.cloudwatch.lib.metric_filters import (
    check_cloudwatch_log_metric_filter,
)
from prowler.providers.aws.services.cloudwatch.logs_client import logs_client


class cloudwatch_log_metric_filter_unauthorized_api_calls(Check):
    def execute(self):
        pattern = r"\$\.errorCode\s*=\s*.?\*UnauthorizedOperation.+\$\.errorCode\s*=\s*.?AccessDenied\*.?"
        findings = []

        report = check_cloudwatch_log_metric_filter(
            pattern,
            cloudtrail_client.trails,
            logs_client.metric_filters,
            cloudwatch_client.metric_alarms,
            self.metadata(),
        )

        if cloudtrail_client.trails is not None:
            if report is None:
                report = Check_Report_AWS(metadata=self.metadata(), resource={})
                report.status = "FAIL"
                report.status_extended = "No CloudWatch log groups found with metric filters or alarms associated."
                report.region = logs_client.region
                report.resource_id = logs_client.audited_account
                report.resource_arn = logs_client.log_group_arn_template
                report.resource_tags = []

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
