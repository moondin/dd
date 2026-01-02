---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 253
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 253 of 867)

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

---[FILE: cloudwatch_log_group_no_secrets_in_logs.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_group_no_secrets_in_logs/cloudwatch_log_group_no_secrets_in_logs.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_group_no_secrets_in_logs",
  "CheckTitle": "CloudWatch log group contains no secrets in its log events",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Sensitive Data Identifications/Passwords",
    "Sensitive Data Identifications/Security",
    "Effects/Data Exposure"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**CloudWatch Logs** log groups are analyzed for potential **secrets** embedded in log events across their streams. Detection flags patterns resembling credentials (API keys, passwords, tokens, keys) and reports the secret types and where they appear within the log group.",
  "Risk": "Leaked **credentials in logs** erode confidentiality and enable unauthorized API calls. Attackers reusing tokens/keys can escalate privileges, alter resources, and exfiltrate data. Subscriptions and exports widen exposure, and users with `logs:Unmask` can reveal values, increasing the blast radius.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://support.icompaas.com/support/solutions/articles/62000233413-ensure-secrets-are-not-logged-in-cloudwatch-logs",
    "https://awsfundamentals.com/blog/masking-sensitive-data-with-amazon-cloudwatch-logs-data-protection-policies",
    "https://repost.aws/questions/QUermjg18CSMqfSKo4CuTAaA/hide-sensitive-data-in-cloudwatch-logs",
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html",
    "https://levelup.gitconnected.com/masking-sensitive-data-in-aws-cloudwatch-logs-1b3c66d0ddcb"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws logs put-data-protection-policy --log-group-identifier <example_resource_name> --policy-document '{\"Statement\":[{\"DataIdentifier\":[\"arn:aws:dataprotection::aws:data-identifier/Credentials\"],\"Operation\":{\"Audit\":{\"FindingsDestination\":{}}}},{\"DataIdentifier\":[\"arn:aws:dataprotection::aws:data-identifier/Credentials\"],\"Operation\":{\"Deidentify\":{\"MaskConfig\":{}}}}]}'",
      "NativeIaC": "```yaml\n# CloudFormation: apply data protection policy to mask secrets in a log group\nResources:\n  LogGroup:\n    Type: AWS::Logs::LogGroup\n    Properties:\n      LogGroupName: <example_resource_name>\n      # Critical: Enables masking of detected credentials at egress so secrets aren't exposed\n      DataProtectionPolicy: |\n        {\"Statement\":[{\"DataIdentifier\":[\"arn:aws:dataprotection::aws:data-identifier/Credentials\"],\"Operation\":{\"Audit\":{\"FindingsDestination\":{}}}},{\"DataIdentifier\":[\"arn:aws:dataprotection::aws:data-identifier/Credentials\"],\"Operation\":{\"Deidentify\":{\"MaskConfig\":{}}}}]}\n```",
      "Other": "1. In AWS Console, go to CloudWatch > Logs > Log groups and open <example_resource_name>\n2. Select the Data protection tab and click Create policy\n3. Under Managed data identifiers, select Credentials (or AwsSecretKey if listed)\n4. Click Activate data protection to save\n5. Re-ingest or generate new logs to ensure sensitive data is masked",
      "Terraform": "```hcl\n# Apply a CloudWatch Logs data protection policy to mask secrets\nresource \"aws_cloudwatch_log_group\" \"log_group\" {\n  name = \"<example_resource_name>\"\n\n  # Critical: Masks detected credentials so secrets aren't visible and the check passes\n  data_protection_policy = jsonencode({\n    Statement = [\n      {\n        DataIdentifier = [\n          \"arn:aws:dataprotection::aws:data-identifier/Credentials\"\n        ]\n        Operation = { Audit = { FindingsDestination = {} } }\n      },\n      {\n        DataIdentifier = [\n          \"arn:aws:dataprotection::aws:data-identifier/Credentials\"\n        ]\n        Operation = { Deidentify = { MaskConfig = {} } }\n      }\n    ]\n  })\n}\n```"
    },
    "Recommendation": {
      "Text": "Avoid logging **secrets** via application sanitization and data minimization. Apply CloudWatch data protection policies to audit and mask sensitive patterns. Enforce *least privilege* for log readers and restrict `logs:Unmask`. Rotate exposed keys, reduce retention, and monitor findings to validate controls.",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_group_no_secrets_in_logs"
    }
  },
  "Categories": [
    "secrets"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_group_no_secrets_in_logs.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_group_no_secrets_in_logs/cloudwatch_log_group_no_secrets_in_logs.py

```python
from json import dumps, loads

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.utils.utils import detect_secrets_scan
from prowler.providers.aws.services.cloudwatch.cloudwatch_service import (
    convert_to_cloudwatch_timestamp_format,
)
from prowler.providers.aws.services.cloudwatch.logs_client import logs_client


class cloudwatch_log_group_no_secrets_in_logs(Check):
    def execute(self):
        findings = []
        if logs_client.log_groups:
            secrets_ignore_patterns = logs_client.audit_config.get(
                "secrets_ignore_patterns", []
            )
            for log_group in logs_client.log_groups.values():
                report = Check_Report_AWS(metadata=self.metadata(), resource=log_group)
                report.status = "PASS"
                report.status_extended = (
                    f"No secrets found in {log_group.name} log group."
                )
                log_group_secrets = []
                if log_group.log_streams:
                    for log_stream_name in log_group.log_streams:
                        log_stream_secrets = {}
                        log_stream_data = "\n".join(
                            [
                                dumps(event["message"])
                                for event in log_group.log_streams[log_stream_name]
                            ]
                        )
                        log_stream_secrets_output = detect_secrets_scan(
                            data=log_stream_data,
                            excluded_secrets=secrets_ignore_patterns,
                            detect_secrets_plugins=logs_client.audit_config.get(
                                "detect_secrets_plugins",
                            ),
                        )

                        if log_stream_secrets_output:
                            for secret in log_stream_secrets_output:
                                flagged_event = log_group.log_streams[log_stream_name][
                                    secret["line_number"] - 1
                                ]
                                cloudwatch_timestamp = (
                                    convert_to_cloudwatch_timestamp_format(
                                        flagged_event["timestamp"]
                                    )
                                )
                                if (
                                    cloudwatch_timestamp
                                    not in log_stream_secrets.keys()
                                ):
                                    log_stream_secrets[cloudwatch_timestamp] = (
                                        SecretsDict()
                                    )

                                try:
                                    log_event_data = dumps(
                                        loads(flagged_event["message"]), indent=2
                                    )
                                except Exception:
                                    log_event_data = dumps(
                                        flagged_event["message"], indent=2
                                    )
                                if len(log_event_data.split("\n")) > 1:
                                    # Can get more informative output if there is more than 1 line.
                                    # Will rescan just this event to get the type of secret and the line number
                                    event_detect_secrets_output = detect_secrets_scan(
                                        data=log_event_data,
                                        detect_secrets_plugins=logs_client.audit_config.get(
                                            "detect_secrets_plugins"
                                        ),
                                    )
                                    if event_detect_secrets_output:
                                        for secret in event_detect_secrets_output:
                                            log_stream_secrets[
                                                cloudwatch_timestamp
                                            ].add_secret(
                                                secret["line_number"], secret["type"]
                                            )
                                else:
                                    log_stream_secrets[cloudwatch_timestamp].add_secret(
                                        1, secret["type"]
                                    )
                        if log_stream_secrets:
                            secrets_string = "; ".join(
                                [
                                    f"at {timestamp} - {log_stream_secrets[timestamp].to_string()}"
                                    for timestamp in log_stream_secrets
                                ]
                            )
                            log_group_secrets.append(
                                f"in log stream {log_stream_name} {secrets_string}"
                            )
                if log_group_secrets:
                    secrets_string = "; ".join(log_group_secrets)
                    report.status = "FAIL"
                    report.status_extended = f"Potential secrets found in log group {log_group.name} {secrets_string}."
                findings.append(report)
        return findings


class SecretsDict(dict):
    # Using this dict to remove duplicates of the secret type showing up multiple times on the same line
    # Also includes the to_string method
    def add_secret(self, line_number, secret_type):
        if line_number not in self.keys():
            self[line_number] = [secret_type]
        else:
            if secret_type not in self[line_number]:
                self[line_number] += [secret_type]

    def to_string(self):
        return ", ".join(
            [
                f"{', '.join(secret_types)} on line {line_number}"
                for line_number, secret_types in sorted(self.items())
            ]
        )
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_group_retention_policy_specific_days_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_group_retention_policy_specific_days_enabled/cloudwatch_log_group_retention_policy_specific_days_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_group_retention_policy_specific_days_enabled",
  "CheckTitle": "CloudWatch log group has a retention policy of at least the configured minimum days or never expires",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Software and Configuration Checks/Industry and Regulatory Standards/SOC 2"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsLogsLogGroup",
  "Description": "**CloudWatch Log Groups** are assessed for a retention period at or above the configured threshold (e.g., `365` days) or for being set to **never expire**. Log groups with shorter retention are identified.",
  "Risk": "Short log retention erodes audit evidence. Adversaries can wait out the window, creating gaps in detection, forensics, and compliance reporting. This degrades the **availability** of historical logs and the **integrity** of incident timelines.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudWatchLogs/cloudwatch-logs-retention-period.html",
    "https://boto3.amazonaws.com/v1/documentation/api/1.26.93/reference/services/logs/client/put_retention_policy.html",
    "https://medium.com/pareture/aws-cloudwatch-log-group-retention-periods-bb8a2fb9c358",
    "https://www.blinkops.com/blog/cloudwatch-retention",
    "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Logs.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws logs put-retention-policy --log-group-name <LOG_GROUP_NAME> --retention-in-days <DAYS>",
      "NativeIaC": "```yaml\n# CloudFormation: set retention on a CloudWatch Log Group\nResources:\n  <example_resource_name>:\n    Type: AWS::Logs::LogGroup\n    Properties:\n      LogGroupName: \"<example_resource_name>\"\n      RetentionInDays: <DAYS>  # Critical: sets log retention to the required minimum to pass the check\n```",
      "Other": "1. In the AWS Console, go to CloudWatch > Log groups\n2. Select the target log group\n3. In the Expire events after/Retention column, click the current value\n4. Choose a retention value >= <DAYS> or select Never expire\n5. Click Save",
      "Terraform": "```hcl\n# Set retention on a CloudWatch Log Group\nresource \"aws_cloudwatch_log_group\" \"<example_resource_name>\" {\n  name              = \"<example_resource_name>\"\n  retention_in_days = <DAYS> # Critical: set to at least the required minimum to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Define a minimum retention baseline (e.g., `>=365` days) aligned to legal and investigative needs. Apply it consistently with documented exceptions. Automate enforcement, monitor changes, and restrict who can modify retention under **least privilege** and **defense in depth**.",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_group_retention_policy_specific_days_enabled"
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

---[FILE: cloudwatch_log_group_retention_policy_specific_days_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_group_retention_policy_specific_days_enabled/cloudwatch_log_group_retention_policy_specific_days_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudwatch.logs_client import logs_client


class cloudwatch_log_group_retention_policy_specific_days_enabled(Check):
    def execute(self):
        findings = []

        # log_group_retention_days, default: 365 days
        specific_retention_days = logs_client.audit_config.get(
            "log_group_retention_days", 365
        )
        if logs_client.log_groups:
            for log_group in logs_client.log_groups.values():
                report = Check_Report_AWS(metadata=self.metadata(), resource=log_group)
                if (
                    log_group.never_expire is False
                    and log_group.retention_days < specific_retention_days
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Log Group {log_group.name} has less than {specific_retention_days} days retention period ({log_group.retention_days} days)."
                else:
                    report.status = "PASS"
                    if log_group.never_expire is True:
                        report.status_extended = f"Log Group {log_group.name} comply with {specific_retention_days} days retention period since it never expires."
                    else:
                        report.status_extended = f"Log Group {log_group.name} comply with {specific_retention_days} days retention period since it has {log_group.retention_days} days."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_metric_filter_authentication_failures.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_authentication_failures/cloudwatch_log_metric_filter_authentication_failures.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_metric_filter_authentication_failures",
  "CheckTitle": "Account has a CloudWatch Logs metric filter and alarm for AWS Management Console authentication failures",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "TTPs/Initial Access",
    "TTPs/Credential Access"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "CloudWatch Logs metric filter and alarm for **AWS Management Console authentication failures**, sourced from CloudTrail (`eventName=ConsoleLogin`, `errorMessage=\"Failed authentication\"`).\n\nIdentifies whether these failures are converted into a metric and actively monitored by an alarm.",
  "Risk": "Absent visibility into failed console logins enables undetected **brute-force** and **credential-stuffing** attempts, extending attacker dwell time.\n\nSuccessful guesses can grant console access, risking data confidentiality, configuration integrity, and availability through destructive changes.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html",
    "https://www.intelligentdiscovery.io/controls/cloudwatch/cloudwatch-alarm-signin-failures",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudWatchLogs/console-sign-in-failures-alarm.html",
    "https://newsletter.simpleaws.dev/p/cloudtrail-cloudwatch-logs-login-detection-alert"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Metric filter and alarm for console authentication failures\nResources:\n  MetricFilter:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: \"<example_resource_name>\"\n      FilterPattern: '{ ($.eventName = ConsoleLogin) && ($.errorMessage = \"Failed authentication\") }'  # Critical: matches failed console login events\n      MetricTransformations:\n        - MetricValue: \"1\"\n          MetricNamespace: \"<example_resource_name>\"  # Critical: creates metric namespace\n          MetricName: \"<example_resource_name>\"       # Critical: creates metric name\n\n  Alarm:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      MetricName: \"<example_resource_name>\"   # Critical: alarm targets metric from filter\n      Namespace: \"<example_resource_name>\"    # Critical: must match metric's namespace\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n      EvaluationPeriods: 1\n      Period: 300\n      Statistic: Sum\n      Threshold: 1\n```",
      "Other": "1. In the AWS Console, open CloudWatch\n2. Go to Logs > Log groups and select the CloudTrail log group receiving events\n3. Open the Metric filters tab > Create metric filter\n   - Filter pattern: { ($.eventName = ConsoleLogin) && ($.errorMessage = \"Failed authentication\") }\n   - Assign any metric name and namespace, value 1, then create\n4. On the created metric filter, select it and choose Create alarm\n   - Statistic: Sum, Period: 5 minutes, Threshold type: Static, Threshold: >= 1\n   - Create the alarm",
      "Terraform": "```hcl\n# Metric filter and alarm for console authentication failures\nresource \"aws_cloudwatch_log_metric_filter\" \"metric\" {\n  name           = \"<example_resource_name>\"\n  log_group_name = \"<example_resource_name>\"\n  pattern        = \"{($.eventName = ConsoleLogin) && ($.errorMessage = \\\"Failed authentication\\\") }\" # Critical: detects failed console logins\n\n  metric_transformation {\n    name      = \"<example_resource_name>\"   # Critical: metric created by filter\n    namespace = \"<example_resource_name>\"   # Critical: metric namespace\n    value     = \"1\"\n  }\n}\n\nresource \"aws_cloudwatch_metric_alarm\" \"alarm\" {\n  metric_name          = aws_cloudwatch_log_metric_filter.metric.metric_transformation[0].name   # Critical: alarm references the filter's metric\n  namespace            = aws_cloudwatch_log_metric_filter.metric.metric_transformation[0].namespace # Critical: must match\n  comparison_operator  = \"GreaterThanOrEqualToThreshold\"\n  evaluation_periods   = 1\n  period               = 300\n  statistic            = \"Sum\"\n  threshold            = 1\n}\n```"
    },
    "Recommendation": {
      "Text": "Implement a log metric filter for `ConsoleLogin` failures and attach a **CloudWatch alarm** with actionable notifications. Tune thresholds to reduce noise and route alerts to incident response.\n\nApply **least privilege** and enforce **MFA** to limit impact, and correlate alerts with source IP and user context.",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_metric_filter_authentication_failures"
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

---[FILE: cloudwatch_log_metric_filter_authentication_failures.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_authentication_failures/cloudwatch_log_metric_filter_authentication_failures.py

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


class cloudwatch_log_metric_filter_authentication_failures(Check):
    def execute(self):
        pattern = r"\$\.eventName\s*=\s*.?ConsoleLogin.+\$\.errorMessage\s*=\s*.?Failed authentication.?"
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

---[FILE: cloudwatch_log_metric_filter_aws_organizations_changes.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_aws_organizations_changes/cloudwatch_log_metric_filter_aws_organizations_changes.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_metric_filter_aws_organizations_changes",
  "CheckTitle": "CloudWatch Logs metric filter and alarm exist for AWS Organizations changes",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "TTPs/Privilege Escalation"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "**CloudWatch Logs** metric filters and alarms monitor **AWS Organizations** change events recorded by CloudTrail, including actions like `CreateAccount`, `AttachPolicy`, `MoveAccount`, and `UpdateOrganizationalUnit`.\n\nThe evaluation looks for a filter on the trail log group matching `organizations.amazonaws.com` events and an alarm linked to that metric.",
  "Risk": "Without alerting on **AWS Organizations changes**, attackers or misconfigurations can silently alter governance, enabling unauthorized access and policy bypass. They could create/remove accounts, change or detach SCPs, or delete the organization, risking data exposure (C), privilege escalation (I), and service disruption (A).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html",
    "https://support.icompaas.com/support/solutions/articles/62000228348-ensure-a-log-metric-filter-and-alarm-exist-for-aws-organizations-changes",
    "https://www.plerion.com/cloud-knowledge-base/ensure-aws-organizations-changes-are-monitored",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudWatchLogs/organizations-changes-alarm.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: CloudWatch Logs metric filter and alarm for AWS Organizations changes\nResources:\n  OrganizationsChangesMetricFilter:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: <example_log_group_name>\n      FilterPattern: '{ ($.eventSource = organizations.amazonaws.com) && (($.eventName = \"AcceptHandshake\") || ($.eventName = \"AttachPolicy\") || ($.eventName = \"CancelHandshake\") || ($.eventName = \"CreateAccount\") || ($.eventName = \"CreateOrganization\") || ($.eventName = \"CreateOrganizationalUnit\") || ($.eventName = \"CreatePolicy\") || ($.eventName = \"DeclineHandshake\") || ($.eventName = \"DeleteOrganization\") || ($.eventName = \"DeleteOrganizationalUnit\") || ($.eventName = \"DeletePolicy\") || ($.eventName = \"EnableAllFeatures\") || ($.eventName = \"EnablePolicyType\") || ($.eventName = \"InviteAccountToOrganization\") || ($.eventName = \"LeaveOrganization\") || ($.eventName = \"DetachPolicy\") || ($.eventName = \"DisablePolicyType\") || ($.eventName = \"MoveAccount\") || ($.eventName = \"RemoveAccountFromOrganization\") || ($.eventName = \"UpdateOrganizationalUnit\") || ($.eventName = \"UpdatePolicy\")) }'  # Critical: matches AWS Organizations change events\n      MetricTransformations:\n        - MetricValue: \"1\"\n          MetricNamespace: CISBenchmark\n          MetricName: <example_resource_name>  # Critical: creates metric used by the alarm\n\n  OrganizationsChangesAlarm:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n      EvaluationPeriods: 1\n      MetricName: <example_resource_name>   # Critical: alarms on the metric from the filter\n      Namespace: CISBenchmark               # Critical: must match the metric filter namespace\n      Period: 300\n      Statistic: Sum\n      Threshold: 1\n```",
      "Other": "1. Open CloudWatch > Logs > Log groups and select the CloudTrail log group for your trail\n2. Choose Create metric filter and set Filter pattern to:\n   { ($.eventSource = organizations.amazonaws.com) && (($.eventName = \"AcceptHandshake\") || ($.eventName = \"AttachPolicy\") || ($.eventName = \"CancelHandshake\") || ($.eventName = \"CreateAccount\") || ($.eventName = \"CreateOrganization\") || ($.eventName = \"CreateOrganizationalUnit\") || ($.eventName = \"CreatePolicy\") || ($.eventName = \"DeclineHandshake\") || ($.eventName = \"DeleteOrganization\") || ($.eventName = \"DeleteOrganizationalUnit\") || ($.eventName = \"DeletePolicy\") || ($.eventName = \"EnableAllFeatures\") || ($.eventName = \"EnablePolicyType\") || ($.eventName = \"InviteAccountToOrganization\") || ($.eventName = \"LeaveOrganization\") || ($.eventName = \"DetachPolicy\") || ($.eventName = \"DisablePolicyType\") || ($.eventName = \"MoveAccount\") || ($.eventName = \"RemoveAccountFromOrganization\") || ($.eventName = \"UpdateOrganizationalUnit\") || ($.eventName = \"UpdatePolicy\")) }\n3. Assign a metric: Namespace = CISBenchmark, Metric name = OrganizationsChanges, Metric value = 1, then Create metric filter\n4. On the metric filter, select Create alarm; set Statistic = Sum, Period = 5 minutes, Threshold type = Static, Threshold = 1, Evaluation periods = 1; Create alarm",
      "Terraform": "```hcl\n# CloudWatch Logs metric filter for AWS Organizations changes\nresource \"aws_cloudwatch_log_metric_filter\" \"organizations_changes\" {\n  name           = \"<example_resource_name>\"\n  log_group_name = \"<example_log_group_name>\"\n  pattern        = \"{ ($.eventSource = organizations.amazonaws.com) && (($.eventName = \\\"AcceptHandshake\\\") || ($.eventName = \\\"AttachPolicy\\\") || ($.eventName = \\\"CancelHandshake\\\") || ($.eventName = \\\"CreateAccount\\\") || ($.eventName = \\\"CreateOrganization\\\") || ($.eventName = \\\"CreateOrganizationalUnit\\\") || ($.eventName = \\\"CreatePolicy\\\") || ($.eventName = \\\"DeclineHandshake\\\") || ($.eventName = \\\"DeleteOrganization\\\") || ($.eventName = \\\"DeleteOrganizationalUnit\\\") || ($.eventName = \\\"DeletePolicy\\\") || ($.eventName = \\\"EnableAllFeatures\\\") || ($.eventName = \\\"EnablePolicyType\\\") || ($.eventName = \\\"InviteAccountToOrganization\\\") || ($.eventName = \\\"LeaveOrganization\\\") || ($.eventName = \\\"DetachPolicy\\\") || ($.eventName = \\\"DisablePolicyType\\\") || ($.eventName = \\\"MoveAccount\\\") || ($.eventName = \\\"RemoveAccountFromOrganization\\\") || ($.eventName = \\\"UpdateOrganizationalUnit\\\") || ($.eventName = \\\"UpdatePolicy\\\")) }\"  # Critical: matches AWS Organizations change events\n\n  metric_transformation {\n    name      = \"<example_resource_name>\"   # Critical: metric created by the filter\n    namespace = \"CISBenchmark\"              # Critical: used by the alarm\n    value     = \"1\"\n  }\n}\n\n# Alarm on the metric generated by the filter\nresource \"aws_cloudwatch_metric_alarm\" \"organizations_changes\" {\n  alarm_name          = \"<example_resource_name>\"\n  comparison_operator = \"GreaterThanOrEqualToThreshold\"\n  evaluation_periods  = 1\n  metric_name         = \"<example_resource_name>\"  # Critical: matches metric filter name\n  namespace           = \"CISBenchmark\"             # Critical: matches metric filter namespace\n  period              = 300\n  statistic           = \"Sum\"\n  threshold           = 1\n}\n```"
    },
    "Recommendation": {
      "Text": "Send CloudTrail events to **CloudWatch Logs**, add a metric filter for `organizations.amazonaws.com` change events, and attach an alarm that notifies responders. Enforce **least privilege** and **separation of duties** for org admins, require MFA and approvals, and regularly test alerts to ensure timely detection and response.",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_metric_filter_aws_organizations_changes"
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

---[FILE: cloudwatch_log_metric_filter_aws_organizations_changes.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_aws_organizations_changes/cloudwatch_log_metric_filter_aws_organizations_changes.py

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


class cloudwatch_log_metric_filter_aws_organizations_changes(Check):
    def execute(self):
        pattern = r"\$\.eventSource\s*=\s*.?organizations\.amazonaws\.com.+\$\.eventName\s*=\s*.?AcceptHandshake.+\$\.eventName\s*=\s*.?AttachPolicy.+\$\.eventName\s*=\s*.?CancelHandshake.+\$\.eventName\s*=\s*.?CreateAccount.+\$\.eventName\s*=\s*.?CreateOrganization.+\$\.eventName\s*=\s*.?CreateOrganizationalUnit.+\$\.eventName\s*=\s*.?CreatePolicy.+\$\.eventName\s*=\s*.?DeclineHandshake.+\$\.eventName\s*=\s*.?DeleteOrganization.+\$\.eventName\s*=\s*.?DeleteOrganizationalUnit.+\$\.eventName\s*=\s*.?DeletePolicy.+\$\.eventName\s*=\s*.?EnableAllFeatures.+\$\.eventName\s*=\s*.?EnablePolicyType.+\$\.eventName\s*=\s*.?InviteAccountToOrganization.+\$\.eventName\s*=\s*.?LeaveOrganization.+\$\.eventName\s*=\s*.?DetachPolicy.+\$\.eventName\s*=\s*.?DisablePolicyType.+\$\.eventName\s*=\s*.?MoveAccount.+\$\.eventName\s*=\s*.?RemoveAccountFromOrganization.+\$\.eventName\s*=\s*.?UpdateOrganizationalUnit.+\$\.eventName\s*=\s*.?UpdatePolicy.?"
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

---[FILE: cloudwatch_log_metric_filter_for_s3_bucket_policy_changes.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_for_s3_bucket_policy_changes/cloudwatch_log_metric_filter_for_s3_bucket_policy_changes.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_metric_filter_for_s3_bucket_policy_changes",
  "CheckTitle": "CloudWatch log metric filter and alarm exist for S3 bucket policy changes",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "**CloudTrail** logs are assessed for a **CloudWatch metric filter** matching S3 bucket configuration changes (ACL, policy, CORS, lifecycle, replication; e.g., `PutBucketPolicy`, `DeleteBucketPolicy`) and for an associated **CloudWatch alarm**.",
  "Risk": "Without alerting on S3 policy and ACL changes, unauthorized modifications can go unnoticed, weakening **confidentiality** and **integrity**. Misuse could expose buckets publicly, grant write/delete access, or alter replication paths, enabling data exfiltration and destructive actions.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html",
    "https://support.icompaas.com/support/solutions/articles/62000086674-ensure-a-log-metric-filter-and-alarm-exist-for-s3-bucket-policy-changes",
    "https://www.tenable.com/audits/items/CIS_Amazon_Web_Services_Foundations_v5.0.0_L1.audit:8101350d6907e07863ac6748689b3e12"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: CloudWatch metric filter and alarm for S3 bucket policy changes\nResources:\n  <example_resource_name>MetricFilter:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: <example_resource_name>  # Critical: CloudTrail log group to monitor\n      FilterPattern: '{($.eventSource=s3.amazonaws.com) && (($.eventName=PutBucketAcl) || ($.eventName=PutBucketPolicy) || ($.eventName=PutBucketCors) || ($.eventName=PutBucketLifecycle) || ($.eventName=PutBucketReplication) || ($.eventName=DeleteBucketPolicy) || ($.eventName=DeleteBucketCors) || ($.eventName=DeleteBucketLifecycle) || ($.eventName=DeleteBucketReplication))}'  # Critical: detects S3 bucket policy changes\n      MetricTransformations:\n        - MetricName: <example_resource_name>\n          MetricNamespace: <example_resource_name>\n          MetricValue: \"1\"\n\n  <example_resource_name>Alarm:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      AlarmName: <example_resource_name>\n      Namespace: <example_resource_name>   # Critical: must match metric filter\n      MetricName: <example_resource_name>  # Critical: must match metric filter\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n      EvaluationPeriods: 1\n      Period: 300\n      Statistic: Sum\n      Threshold: 1\n```",
      "Other": "1. Open the CloudWatch console and go to Logs > Log groups.\n2. Select the CloudTrail log group that receives your trail events.\n3. Create metric filter:\n   - Choose Create metric filter.\n   - Filter pattern:\n     ```\n     {($.eventSource=s3.amazonaws.com) && (($.eventName=PutBucketAcl) || ($.eventName=PutBucketPolicy) || ($.eventName=PutBucketCors) || ($.eventName=PutBucketLifecycle) || ($.eventName=PutBucketReplication) || ($.eventName=DeleteBucketPolicy) || ($.eventName=DeleteBucketCors) || ($.eventName=DeleteBucketLifecycle) || ($.eventName=DeleteBucketReplication))}\n     ```\n   - Set Metric name and Namespace (any values) and Metric value = 1. Save.\n4. From the Metric filters tab, select the new filter and choose Create alarm.\n5. Set: Statistic = Sum, Period = 5 minutes, Threshold type = Static, Condition = Greater/Equal, Threshold = 1, Evaluation periods = 1. Create alarm.",
      "Terraform": "```hcl\n# CloudWatch metric filter for S3 bucket policy changes\nresource \"aws_cloudwatch_log_metric_filter\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  log_group_name = \"<example_resource_name>\"\n  # Critical: detects S3 bucket policy changes from CloudTrail logs\n  pattern = \"{($.eventSource=s3.amazonaws.com) && (($.eventName=PutBucketAcl) || ($.eventName=PutBucketPolicy) || ($.eventName=PutBucketCors) || ($.eventName=PutBucketLifecycle) || ($.eventName=PutBucketReplication) || ($.eventName=DeleteBucketPolicy) || ($.eventName=DeleteBucketCors) || ($.eventName=DeleteBucketLifecycle) || ($.eventName=DeleteBucketReplication))}\"\n\n  metric_transformation {\n    name      = \"<example_resource_name>\"\n    namespace = \"<example_resource_name>\"\n    value     = \"1\"\n  }\n}\n\n# Alarm on the metric filter\nresource \"aws_cloudwatch_metric_alarm\" \"<example_resource_name>\" {\n  alarm_name          = \"<example_resource_name>\"\n  metric_name         = \"<example_resource_name>\"  # Critical: matches metric filter\n  namespace           = \"<example_resource_name>\"  # Critical: matches metric filter\n  comparison_operator = \"GreaterThanOrEqualToThreshold\"\n  evaluation_periods  = 1\n  period              = 300\n  statistic           = \"Sum\"\n  threshold           = 1\n}\n```"
    },
    "Recommendation": {
      "Text": "Establish and maintain **metric filters** and **alarms** for S3 bucket policy, ACL, CORS, lifecycle, and replication changes. Route alerts to monitored channels and integrate with SIEM. Enforce **least privilege**, require change reviews, and use **defense in depth** to prevent and quickly detect unsafe bucket policy changes.",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_metric_filter_for_s3_bucket_policy_changes"
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

````
