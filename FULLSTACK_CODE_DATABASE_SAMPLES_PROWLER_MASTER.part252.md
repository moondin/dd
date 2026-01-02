---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 252
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 252 of 867)

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

---[FILE: cloudwatch_changes_to_network_acls_alarm_configured.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_changes_to_network_acls_alarm_configured/cloudwatch_changes_to_network_acls_alarm_configured.py

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


class cloudwatch_changes_to_network_acls_alarm_configured(Check):
    def execute(self):
        pattern = r"\$\.eventName\s*=\s*.?CreateNetworkAcl.+\$\.eventName\s*=\s*.?CreateNetworkAclEntry.+\$\.eventName\s*=\s*.?DeleteNetworkAcl.+\$\.eventName\s*=\s*.?DeleteNetworkAclEntry.+\$\.eventName\s*=\s*.?ReplaceNetworkAclEntry.+\$\.eventName\s*=\s*.?ReplaceNetworkAclAssociation.?"
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

---[FILE: cloudwatch_changes_to_network_gateways_alarm_configured.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_changes_to_network_gateways_alarm_configured/cloudwatch_changes_to_network_gateways_alarm_configured.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_changes_to_network_gateways_alarm_configured",
  "CheckTitle": "CloudWatch Logs metric filter and alarm exist for changes to network gateways",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "TTPs/Command and Control"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "CloudWatch log metric filters and alarms for **network gateway changes** are identified by matching CloudTrail events such as `CreateCustomerGateway`, `DeleteCustomerGateway`, `AttachInternetGateway`, `CreateInternetGateway`, `DeleteInternetGateway`, and `DetachInternetGateway` in log groups that receive trail logs.",
  "Risk": "Without this monitoring, gateway changes can expose private networks to the Internet or break connectivity. Adversaries or mistakes can enable data exfiltration, bypass network inspection, and trigger outages via deletions or detachments, impacting **confidentiality** and **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html",
    "https://support.icompaas.com/support/solutions/articles/62000083807-ensure-a-log-metric-filter-and-alarm-exist-for-changes-to-network-gateways",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/cloudwatch-controls.html#cloudwatch-12",
    "https://paper.bobylive.com/Security/CIS/CIS_Amazon_Web_Services_Foundations_Benchmark_v1_3_0.pdf"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Create metric filter and alarm for network gateway changes\nResources:\n  NetworkGatewayMetricFilter:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: <example_resource_name>\n      FilterPattern: '{ ($.eventName = CreateCustomerGateway) || ($.eventName = DeleteCustomerGateway) || ($.eventName = AttachInternetGateway) || ($.eventName = CreateInternetGateway) || ($.eventName = DeleteInternetGateway) || ($.eventName = DetachInternetGateway) }'  # Critical: matches gateway change events\n      MetricTransformations:\n        - MetricName: <example_resource_name>\n          MetricNamespace: <example_resource_name>\n          MetricValue: \"1\"\n\n  NetworkGatewayAlarm:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n      EvaluationPeriods: 1\n      MetricName: <example_resource_name>  # Critical: alarm targets the metric created by the filter\n      Namespace: <example_resource_name>\n      Period: 300\n      Statistic: Sum\n      Threshold: 1\n```",
      "Other": "1. In the AWS Console, go to CloudWatch > Logs > Log groups and open the CloudTrail log group\n2. Create metric filter:\n   - Filter pattern: { ($.eventName = CreateCustomerGateway) || ($.eventName = DeleteCustomerGateway) || ($.eventName = AttachInternetGateway) || ($.eventName = CreateInternetGateway) || ($.eventName = DeleteInternetGateway) || ($.eventName = DetachInternetGateway) }\n   - Metric name: <example_resource_name>\n   - Metric namespace: <example_resource_name>\n   - Metric value: 1\n3. From the filter, choose Create alarm:\n   - Statistic: Sum, Period: 5 minutes, Threshold: >= 1, Evaluation periods: 1\n   - Create the alarm (actions optional)\n",
      "Terraform": "```hcl\n# CloudWatch Logs metric filter for network gateway changes\nresource \"aws_cloudwatch_log_metric_filter\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  log_group_name = \"<example_resource_name>\"\n  pattern        = \"{ ($.eventName = CreateCustomerGateway) || ($.eventName = DeleteCustomerGateway) || ($.eventName = AttachInternetGateway) || ($.eventName = CreateInternetGateway) || ($.eventName = DeleteInternetGateway) || ($.eventName = DetachInternetGateway) }\" # Critical: matches gateway change events\n\n  metric_transformation {\n    name      = \"<example_resource_name>\"\n    namespace = \"<example_resource_name>\"\n    value     = \"1\"\n  }\n}\n\n# Alarm on the metric filter\nresource \"aws_cloudwatch_metric_alarm\" \"<example_resource_name>\" {\n  alarm_name          = \"<example_resource_name>\"\n  comparison_operator = \"GreaterThanOrEqualToThreshold\"\n  evaluation_periods  = 1\n  metric_name         = \"<example_resource_name>\"   # Critical: must match metric from the filter\n  namespace           = \"<example_resource_name>\"\n  period              = 300\n  statistic           = \"Sum\"\n  threshold           = 1\n}\n```"
    },
    "Recommendation": {
      "Text": "Send CloudTrail to CloudWatch Logs and create a metric filter for the listed gateway events with an alarm that notifies responders. Enforce **least privilege** for gateway modifications, require change approvals, and route alerts to monitored channels as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/cloudwatch_changes_to_network_gateways_alarm_configured"
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

---[FILE: cloudwatch_changes_to_network_gateways_alarm_configured.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_changes_to_network_gateways_alarm_configured/cloudwatch_changes_to_network_gateways_alarm_configured.py

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


class cloudwatch_changes_to_network_gateways_alarm_configured(Check):
    def execute(self):
        pattern = r"\$\.eventName\s*=\s*.?CreateCustomerGateway.+\$\.eventName\s*=\s*.?DeleteCustomerGateway.+\$\.eventName\s*=\s*.?AttachInternetGateway.+\$\.eventName\s*=\s*.?CreateInternetGateway.+\$\.eventName\s*=\s*.?DeleteInternetGateway.+\$\.eventName\s*=\s*.?DetachInternetGateway.?"
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

---[FILE: cloudwatch_changes_to_network_route_tables_alarm_configured.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_changes_to_network_route_tables_alarm_configured/cloudwatch_changes_to_network_route_tables_alarm_configured.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_changes_to_network_route_tables_alarm_configured",
  "CheckTitle": "Account monitors VPC route table changes with a CloudWatch Logs metric filter and alarm",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/AWS Security Best Practices",
    "TTPs/Defense Evasion",
    "Effects/Data Exfiltration"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "**VPC route table changes** are captured from **CloudTrail logs** by a **CloudWatch Logs metric filter** with an associated **alarm** for events like `CreateRoute`, `CreateRouteTable`, `ReplaceRoute`, `ReplaceRouteTableAssociation`, `DeleteRoute`, `DeleteRouteTable`, and `DisassociateRouteTable`.",
  "Risk": "Without monitoring of **route table changes**, unauthorized or accidental edits can redirect traffic, bypass inspection, or blackhole routes, impacting **confidentiality** (exfiltration), **integrity** (tampered paths), and **availability** (outages from misrouted traffic).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Metric filter + alarm for VPC route table changes\nResources:\n  RouteTableChangeMetricFilter:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: \"<example_resource_name>\"\n      # CRITICAL: Detect EC2 route table change events in CloudTrail logs\n      # Includes eventSource and the required eventNames\n      FilterPattern: '{($.eventSource = ec2.amazonaws.com) && (($.eventName = CreateRoute) || ($.eventName = CreateRouteTable) || ($.eventName = ReplaceRoute) || ($.eventName = ReplaceRouteTableAssociation) || ($.eventName = DeleteRouteTable) || ($.eventName = DeleteRoute) || ($.eventName = DisassociateRouteTable))}'\n      MetricTransformations:\n        - MetricValue: \"1\"\n          MetricNamespace: \"<example_resource_name>\"\n          MetricName: \"<example_resource_name>\"\n\n  RouteTableChangeAlarm:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      # CRITICAL: Alarm on the metric from the filter above\n      Namespace: \"<example_resource_name>\"\n      MetricName: \"<example_resource_name>\"\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n      EvaluationPeriods: 1\n      Period: 300\n      Statistic: Sum\n      Threshold: 1\n```",
      "Other": "1. In the AWS console, open CloudWatch > Log groups and select your CloudTrail log group\n2. Go to Metric filters > Create metric filter\n3. Set Filter pattern to:\n   {($.eventSource = ec2.amazonaws.com) && (($.eventName = CreateRoute) || ($.eventName = CreateRouteTable) || ($.eventName = ReplaceRoute) || ($.eventName = ReplaceRouteTableAssociation) || ($.eventName = DeleteRouteTable) || ($.eventName = DeleteRoute) || ($.eventName = DisassociateRouteTable))}\n4. Name the metric and set Metric value to 1; choose any namespace/name\n5. Create the filter\n6. From the filter, click Create alarm\n7. Set Statistic: Sum, Period: 5 minutes, Threshold type: Static, Threshold: 1, Whenever: Greater/Equal\n8. Create the alarm (notifications optional)",
      "Terraform": "```hcl\n# Metric filter + alarm for VPC route table changes\nresource \"aws_cloudwatch_log_metric_filter\" \"routes\" {\n  name           = \"<example_resource_name>\"\n  log_group_name = \"<example_resource_name>\"\n  # CRITICAL: Detect EC2 route table change events in CloudTrail logs\n  pattern = \"{($.eventSource = ec2.amazonaws.com) && (($.eventName = CreateRoute) || ($.eventName = CreateRouteTable) || ($.eventName = ReplaceRoute) || ($.eventName = ReplaceRouteTableAssociation) || ($.eventName = DeleteRouteTable) || ($.eventName = DeleteRoute) || ($.eventName = DisassociateRouteTable))}\"\n\n  metric_transformation {\n    name      = \"<example_resource_name>\"\n    namespace = \"<example_resource_name>\"\n    value     = \"1\"\n  }\n}\n\nresource \"aws_cloudwatch_metric_alarm\" \"routes\" {\n  alarm_name          = \"<example_resource_name>\"\n  # CRITICAL: Alarm targets the metric from the filter above\n  metric_name         = \"<example_resource_name>\"\n  namespace           = \"<example_resource_name>\"\n  comparison_operator = \"GreaterThanOrEqualToThreshold\"\n  evaluation_periods  = 1\n  period              = 300\n  statistic           = \"Sum\"\n  threshold           = 1\n}\n```"
    },
    "Recommendation": {
      "Text": "Implement a **CloudWatch Logs metric filter and alarm** on CloudTrail for these route table events and notify responders. Enforce **least privilege** for route modifications, require **change control**, and apply **defense in depth** with VPC Flow Logs and guardrails to prevent and quickly contain unsafe routing changes.",
      "Url": "https://hub.prowler.com/check/cloudwatch_changes_to_network_route_tables_alarm_configured"
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

---[FILE: cloudwatch_changes_to_network_route_tables_alarm_configured.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_changes_to_network_route_tables_alarm_configured/cloudwatch_changes_to_network_route_tables_alarm_configured.py

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


class cloudwatch_changes_to_network_route_tables_alarm_configured(Check):
    def execute(self):
        pattern = r"\$\.eventSource\s*=\s*.?ec2.amazonaws.com.+\$\.eventName\s*=\s*.?CreateRoute.+\$\.eventName\s*=\s*.?CreateRouteTable.+\$\.eventName\s*=\s*.?ReplaceRoute.+\$\.eventName\s*=\s*.?ReplaceRouteTableAssociation.+\$\.eventName\s*=\s*.?DeleteRouteTable.+\$\.eventName\s*=\s*.?DeleteRoute.+\$\.eventName\s*=\s*.?DisassociateRouteTable.?"
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

---[FILE: cloudwatch_changes_to_vpcs_alarm_configured.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_changes_to_vpcs_alarm_configured/cloudwatch_changes_to_vpcs_alarm_configured.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_changes_to_vpcs_alarm_configured",
  "CheckTitle": "AWS account has a CloudWatch Logs metric filter and alarm for VPC changes",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "**CloudTrail events** for **VPC configuration changes** are captured in CloudWatch Logs with a metric filter and an associated alarm. The filter targets actions like `CreateVpc`, `DeleteVpc`, `ModifyVpcAttribute`, and VPC peering operations to surface when network topology is altered.",
  "Risk": "Without alerting on VPC changes, unauthorized or accidental edits to routes, peering, or attributes can go unnoticed, exposing private networks and enabling data exfiltration (C), lateral movement and traffic tampering (I), and outages from misrouted or bridged networks (A).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Create a metric filter and alarm for VPC changes\nResources:\n  VPCChangesMetricFilter:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: <example_log_group_name>\n      FilterPattern: '{ ($.eventName = CreateVpc) || ($.eventName = DeleteVpc) || ($.eventName = ModifyVpcAttribute) || ($.eventName = AcceptVpcPeeringConnection) || ($.eventName = CreateVpcPeeringConnection) || ($.eventName = DeleteVpcPeeringConnection) || ($.eventName = RejectVpcPeeringConnection) || ($.eventName = AttachClassicLinkVpc) || ($.eventName = DetachClassicLinkVpc) || ($.eventName = DisableVpcClassicLink) || ($.eventName = EnableVpcClassicLink) }' # Critical: matches VPC change events\n      MetricTransformations:\n        - MetricName: vpc_changes_metric\n          MetricNamespace: CISBenchmark\n          MetricValue: \"1\"  # Critical: emits a metric on matching events\n\n  VPCChangesAlarm:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      MetricName: vpc_changes_metric  # Critical: alarm monitors the metric above\n      Namespace: CISBenchmark\n      Statistic: Sum\n      Period: 300\n      EvaluationPeriods: 1\n      Threshold: 1\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n```",
      "Other": "1. In the AWS Console, go to CloudWatch > Log groups and open the CloudTrail log group\n2. Choose Create metric filter\n3. For Filter pattern, paste:\n   { ($.eventName = CreateVpc) || ($.eventName = DeleteVpc) || ($.eventName = ModifyVpcAttribute) || ($.eventName = AcceptVpcPeeringConnection) || ($.eventName = CreateVpcPeeringConnection) || ($.eventName = DeleteVpcPeeringConnection) || ($.eventName = RejectVpcPeeringConnection) || ($.eventName = AttachClassicLinkVpc) || ($.eventName = DetachClassicLinkVpc) || ($.eventName = DisableVpcClassicLink) || ($.eventName = EnableVpcClassicLink) }\n4. Name the filter and set Metric namespace to CISBenchmark, Metric name to vpc_changes_metric, Metric value to 1; create the filter\n5. Select the new filter and choose Create alarm\n6. Set Statistic to Sum, Period 5 minutes, Threshold type Static, Whenever Greater/Equal 1, Evaluation periods 1\n7. Create the alarm (actions/notifications are optional and not required for pass)\n",
      "Terraform": "```hcl\n# Metric filter for VPC changes\nresource \"aws_cloudwatch_log_metric_filter\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  log_group_name = \"<example_log_group_name>\"\n  pattern        = \"{ ($.eventName = CreateVpc) || ($.eventName = DeleteVpc) || ($.eventName = ModifyVpcAttribute) || ($.eventName = AcceptVpcPeeringConnection) || ($.eventName = CreateVpcPeeringConnection) || ($.eventName = DeleteVpcPeeringConnection) || ($.eventName = RejectVpcPeeringConnection) || ($.eventName = AttachClassicLinkVpc) || ($.eventName = DetachClassicLinkVpc) || ($.eventName = DisableVpcClassicLink) || ($.eventName = EnableVpcClassicLink) }\" # Critical: matches VPC change events\n\n  metric_transformation {\n    name      = \"<example_resource_name>\"   # Critical: metric created by the filter\n    namespace = \"CISBenchmark\"\n    value     = \"1\"\n  }\n}\n\n# Alarm on the VPC changes metric\nresource \"aws_cloudwatch_metric_alarm\" \"<example_resource_name>\" {\n  metric_name        = \"<example_resource_name>\"  # Critical: alarm monitors the filter's metric\n  namespace          = \"CISBenchmark\"\n  statistic          = \"Sum\"\n  period             = 300\n  evaluation_periods = 1\n  threshold          = 1\n  comparison_operator = \"GreaterThanOrEqualToThreshold\"\n}\n```"
    },
    "Recommendation": {
      "Text": "Create a CloudWatch Logs metric filter and alarm on CloudTrail for critical **VPC change events**, and notify responders. Apply **least privilege** to network changes, require change approvals, and use **defense in depth** (segmentation, route controls) to prevent and contain unauthorized modifications.",
      "Url": "https://hub.prowler.com/check/cloudwatch_changes_to_vpcs_alarm_configured"
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

---[FILE: cloudwatch_changes_to_vpcs_alarm_configured.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_changes_to_vpcs_alarm_configured/cloudwatch_changes_to_vpcs_alarm_configured.py

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


class cloudwatch_changes_to_vpcs_alarm_configured(Check):
    def execute(self):
        pattern = r"\$\.eventName\s*=\s*.?CreateVpc.+\$\.eventName\s*=\s*.?DeleteVpc.+\$\.eventName\s*=\s*.?ModifyVpcAttribute.+\$\.eventName\s*=\s*.?AcceptVpcPeeringConnection.+\$\.eventName\s*=\s*.?CreateVpcPeeringConnection.+\$\.eventName\s*=\s*.?DeleteVpcPeeringConnection.+\$\.eventName\s*=\s*.?RejectVpcPeeringConnection.+\$\.eventName\s*=\s*.?AttachClassicLinkVpc.+\$\.eventName\s*=\s*.?DetachClassicLinkVpc.+\$\.eventName\s*=\s*.?DisableVpcClassicLink.+\$\.eventName\s*=\s*.?EnableVpcClassicLink.?"
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

---[FILE: cloudwatch_cross_account_sharing_disabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_cross_account_sharing_disabled/cloudwatch_cross_account_sharing_disabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_cross_account_sharing_disabled",
  "CheckTitle": "CloudWatch does not allow cross-account sharing",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsIamRole",
  "Description": "**Amazon CloudWatch** cross-account sharing via the `CloudWatch-CrossAccountSharingRole` allows other AWS accounts to view your metrics, dashboards, and alarms. The presence of this role indicates that sharing is active.",
  "Risk": "Granting other accounts visibility into observability data reduces **confidentiality** and enables **reconnaissance**. Adversaries or over-privileged partners can map architectures, profile workloads, and spot alerting gaps, increasing chances of **lateral movement** and **evasion**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudformation delete-stack --stack-name CloudWatch-CrossAccountSharingRole",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Management Console and open IAM\n2. Go to Roles\n3. Find and select the role named \"CloudWatch-CrossAccountSharingRole\"\n4. Click Delete and confirm\n5. If deletion is blocked because it is managed by CloudFormation: open CloudFormation, select the stack named \"CloudWatch-CrossAccountSharingRole\", and click Delete",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable **cross-account sharing** unless strictly required. If needed, restrict access to specific trusted accounts, scope read-only permissions to only necessary resources, and use a dedicated monitoring account. Apply **least privilege** and **separation of duties**, and regularly audit role trust and access patterns.",
      "Url": "https://hub.prowler.com/check/cloudwatch_cross_account_sharing_disabled"
    }
  },
  "Categories": [
    "trust-boundaries",
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_cross_account_sharing_disabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_cross_account_sharing_disabled/cloudwatch_cross_account_sharing_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class cloudwatch_cross_account_sharing_disabled(Check):
    def execute(self):
        findings = []
        if iam_client.roles is not None:
            report = Check_Report_AWS(metadata=self.metadata(), resource={})
            report.status = "PASS"
            report.status_extended = "CloudWatch doesn't allow cross-account sharing."
            report.region = iam_client.region
            report.resource_arn = iam_client.role_arn_template
            report.resource_id = iam_client.audited_account
            for role in iam_client.roles:
                if role.name == "CloudWatch-CrossAccountSharingRole":
                    report = Check_Report_AWS(metadata=self.metadata(), resource=role)
                    report.region = iam_client.region
                    report.status = "FAIL"
                    report.status_extended = (
                        "CloudWatch has allowed cross-account sharing."
                    )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_group_kms_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_group_kms_encryption_enabled/cloudwatch_log_group_kms_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_group_kms_encryption_enabled",
  "CheckTitle": "CloudWatch log group is encrypted with an AWS KMS key",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**CloudWatch log groups** are assessed for **at-rest encryption** by checking if an **AWS KMS key** is associated with the log group via `kmsKeyId`.",
  "Risk": "Without a **customer-managed KMS key**, logs rely on service-managed encryption, limiting control and auditability.\n- Confidentiality: weaker key-policy barriers against unauthorized reads\n- Integrity/availability: no custom rotation or rapid revoke, hindering incident response and compliance",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/cli/latest/reference/logs/associate-kms-key.html",
    "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group",
    "https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/logs/client/associate_kms_key.html",
    "https://support.icompaas.com/support/solutions/articles/62000233436-ensure-cloudwatch-log-groups-are-protected-by-aws-kms",
    "https://varunmanik1.medium.com/proactively-mitigating-a-medium-severity-prowler-issue-enabling-kms-encryption-for-cloudwatch-logs-51d43416c7fc"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws logs associate-kms-key --log-group-name <LOG_GROUP_NAME> --kms-key-id arn:aws:kms:<REGION>:<ACCOUNT_ID>:key/<KEY_ID>",
      "NativeIaC": "```yaml\n# CloudFormation: Encrypt a CloudWatch Log Group with KMS\nResources:\n  <example_resource_name>:\n    Type: AWS::Logs::LogGroup\n    Properties:\n      KmsKeyId: arn:aws:kms:<REGION>:<ACCOUNT_ID>:key/<KEY_ID>  # Critical: associates a CMK to encrypt the log group\n```",
      "Other": "1. In the AWS Console, go to CloudWatch > Log groups\n2. Click Create log group and enter a name\n3. Under Encryption, select KMS key and provide the key ARN\n4. Click Create log group\n5. For existing log groups, the console cannot attach a KMS key; use the CLI command provided",
      "Terraform": "```hcl\n# Encrypt a CloudWatch Log Group with KMS\nresource \"aws_cloudwatch_log_group\" \"<example_resource_name>\" {\n  name       = \"<example_resource_name>\"\n  kms_key_id = \"arn:aws:kms:<REGION>:<ACCOUNT_ID>:key/<KEY_ID>\" # Critical: associates a CMK to encrypt the log group\n}\n```"
    },
    "Recommendation": {
      "Text": "Associate each log group with a **customer-managed KMS key** via `kmsKeyId`.\n- Enforce **least privilege** in key and IAM policies, granting `kms:Decrypt` only to required principals\n- Enable rotation and monitor key usage\n- Separate keys by app/tenant to support **defense in depth** and rapid revocation",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_group_kms_encryption_enabled"
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

---[FILE: cloudwatch_log_group_kms_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_group_kms_encryption_enabled/cloudwatch_log_group_kms_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudwatch.logs_client import logs_client


class cloudwatch_log_group_kms_encryption_enabled(Check):
    def execute(self):
        findings = []
        if logs_client.log_groups:
            for log_group in logs_client.log_groups.values():
                report = Check_Report_AWS(metadata=self.metadata(), resource=log_group)
                if log_group.kms_id:
                    report.status = "PASS"
                    report.status_extended = f"Log Group {log_group.name} does have AWS KMS key {log_group.kms_id} associated."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Log Group {log_group.name} does not have AWS KMS keys associated."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_group_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_group_not_publicly_accessible/cloudwatch_log_group_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_log_group_not_publicly_accessible",
  "CheckTitle": "CloudWatch Log Group is not publicly accessible",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "TTPs/Initial Access/Unauthorized Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**CloudWatch Log Groups** with resource policies that grant access to any principal are identified. Statements using `Principal:\"*\"` or wildcard `Resource` that reference a log group ARN indicate that the log group is exposed through a public policy.",
  "Risk": "Public access to log groups enables unauthorized reading of logs, revealing secrets and operational metadata, harming **confidentiality**. If broad actions are allowed, attackers can modify subscriptions or logs, undermining **integrity** and disrupting **availability** of audit evidence.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws logs delete-resource-policy --policy-name <policy-name>",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::Logs::ResourcePolicy\n    Properties:\n      PolicyName: <example_resource_name>\n      PolicyDocument:\n        Version: '2012-10-17'\n        Statement:\n          - Effect: Allow\n            Principal:\n              AWS: \"<example_account_id>\"  # FIX: restrict to specific account (not *) to prevent public access\n            Action: logs:PutSubscriptionFilter\n            Resource: \"arn:aws:logs:<region>:<account-id>:destination:<example_resource_name>\"\n```",
      "Other": "1. Open the CloudWatch console\n2. Go to Logs > Resource policies\n3. Select the policy that exposes your log groups (Principal set to \"*\" or Resource \"*\")\n4. Click Delete and confirm",
      "Terraform": "```hcl\nresource \"aws_cloudwatch_log_resource_policy\" \"<example_resource_name>\" {\n  policy_name     = \"<example_resource_name>\"\n  policy_document = jsonencode({\n    Version   = \"2012-10-17\"\n    Statement = [{\n      Effect    = \"Allow\"\n      Principal = { AWS = \"<example_account_id>\" } # FIX: restrict Principal (not \"*\") to avoid public access\n      Action    = \"logs:PutSubscriptionFilter\"\n      Resource  = \"arn:aws:logs:<region>:<account-id>:destination:<example_resource_name>\"\n    }]\n  })\n}\n```"
    },
    "Recommendation": {
      "Text": "Remove public access from log group resource policies. Replace `Principal:\"*\"` and `Resource:\"*\"` with narrowly scoped principals and specific ARNs. Grant only necessary actions, apply conditions to constrain use, and enforce **least privilege** and **separation of duties** with regular policy reviews.",
      "Url": "https://hub.prowler.com/check/cloudwatch_log_group_not_publicly_accessible"
    }
  },
  "Categories": [
    "internet-exposed",
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_group_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_log_group_not_publicly_accessible/cloudwatch_log_group_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudwatch.logs_client import logs_client
from prowler.providers.aws.services.iam.lib.policy import is_policy_public


class cloudwatch_log_group_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        public_log_groups = []
        if (
            logs_client.resource_policies is not None
            and logs_client.log_groups is not None
        ):
            for resource_policies in logs_client.resource_policies.values():
                if resource_policies is not None:
                    for resource_policy in resource_policies:
                        if is_policy_public(
                            resource_policy.policy, logs_client.audited_account
                        ):
                            for statement in resource_policy.policy.get(
                                "Statement", []
                            ):
                                public_resources = statement.get("Resource", [])
                                if isinstance(public_resources, str):
                                    public_resources = [public_resources]
                                for resource in public_resources:
                                    for log_group in logs_client.log_groups.values():
                                        if log_group.arn in resource or resource == "*":
                                            public_log_groups.append(log_group.arn)
            for log_group in logs_client.log_groups.values():
                report = Check_Report_AWS(metadata=self.metadata(), resource=log_group)
                report.status = "PASS"
                report.status_extended = (
                    f"Log Group {log_group.name} is not publicly accessible."
                )
                if log_group.arn in public_log_groups:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Log Group {log_group.name} is publicly accessible."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
