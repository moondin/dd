---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 326
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 326 of 867)

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

---[FILE: wafv2_service.py]---
Location: prowler-master/prowler/providers/aws/services/wafv2/wafv2_service.py
Signals: Pydantic

```python
from enum import Enum
from typing import Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class WAFv2(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.web_acls = {}
        if self.audited_partition == "aws":
            # AWS WAFv2 is available globally for CloudFront distributions, but you must use the Region US East (N. Virginia) to create your web ACL.
            self.region = "us-east-1"
            self.client = self.session.client(self.service, self.region)
            self._list_web_acls_global()
        self.__threading_call__(self._list_web_acls_regional)
        self.__threading_call__(self._get_web_acl, self.web_acls.values())
        self.__threading_call__(
            self._list_resources_for_web_acl, self.web_acls.values()
        )
        self.__threading_call__(self._get_logging_configuration, self.web_acls.values())
        self.__threading_call__(self._list_tags, self.web_acls.values())

    def _list_web_acls_global(self):
        logger.info("WAFv2 - Listing Global Web ACLs...")
        try:
            for wafv2 in self.client.list_web_acls(Scope="CLOUDFRONT")["WebACLs"]:
                if not self.audit_resources or (
                    is_resource_filtered(wafv2["ARN"], self.audit_resources)
                ):
                    arn = wafv2["ARN"]
                    self.web_acls[arn] = WebAclv2(
                        arn=arn,
                        name=wafv2["Name"],
                        id=wafv2["Id"],
                        albs=[],
                        user_pools=[],
                        scope=Scope.CLOUDFRONT,
                        region=self.region,
                    )
        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_web_acls_regional(self, regional_client):
        logger.info("WAFv2 - Listing Regional Web ACLs...")
        try:
            for wafv2 in regional_client.list_web_acls(Scope="REGIONAL")["WebACLs"]:
                if not self.audit_resources or (
                    is_resource_filtered(wafv2["ARN"], self.audit_resources)
                ):
                    arn = wafv2["ARN"]
                    self.web_acls[arn] = WebAclv2(
                        arn=arn,
                        name=wafv2["Name"],
                        id=wafv2["Id"],
                        albs=[],
                        user_pools=[],
                        scope=Scope.REGIONAL,
                        region=regional_client.region,
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_logging_configuration(self, acl):
        logger.info("WAFv2 - Get Logging Configuration...")
        try:
            if acl.scope == Scope.REGIONAL or acl.region in self.regional_clients:
                logging_enabled = self.regional_clients[
                    acl.region
                ].get_logging_configuration(ResourceArn=acl.arn)
                acl.logging_enabled = bool(
                    logging_enabled["LoggingConfiguration"]["LogDestinationConfigs"]
                )

        except ClientError as error:
            if error.response["Error"]["Code"] == "WAFNonexistentItemException":
                logger.warning(
                    f"{acl.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{acl.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{acl.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_resources_for_web_acl(self, acl):
        logger.info("WAFv2 - Describing resources...")
        try:
            if acl.scope == Scope.REGIONAL:
                for resource in self.regional_clients[
                    acl.region
                ].list_resources_for_web_acl(
                    WebACLArn=acl.arn, ResourceType="APPLICATION_LOAD_BALANCER"
                )[
                    "ResourceArns"
                ]:
                    acl.albs.append(resource)

                for resource in self.regional_clients[
                    acl.region
                ].list_resources_for_web_acl(
                    WebACLArn=acl.arn, ResourceType="COGNITO_USER_POOL"
                )[
                    "ResourceArns"
                ]:
                    acl.user_pools.append(resource)

        except Exception as error:
            logger.error(
                f"{acl.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_web_acl(self, acl: str):
        logger.info("WAFv2 - Getting Web ACL...")
        try:
            if acl.scope == Scope.REGIONAL or acl.region in self.regional_clients:
                scope = acl.scope.value
                get_web_acl = self.regional_clients[acl.region].get_web_acl(
                    Name=acl.name, Scope=scope, Id=acl.id
                )

                try:
                    rules = get_web_acl.get("WebACL", {}).get("Rules", [])
                    for rule in rules:
                        new_rule = Rule(
                            name=rule.get("Name", ""),
                            cloudwatch_metrics_enabled=rule.get(
                                "VisibilityConfig", {}
                            ).get("CloudWatchMetricsEnabled", False),
                        )
                        if (
                            rule.get("Statement", {})
                            .get("RuleGroupReferenceStatement", {})
                            .get("ARN")
                        ):
                            acl.rule_groups.append(new_rule)
                        else:
                            acl.rules.append(new_rule)

                    firewall_manager_managed_rg = get_web_acl.get("WebACL", {}).get(
                        "PreProcessFirewallManagerRuleGroups", []
                    ) + get_web_acl.get("WebACL", {}).get(
                        "PostProcessFirewallManagerRuleGroups", []
                    )

                    for rule in firewall_manager_managed_rg:
                        acl.rule_groups.append(
                            Rule(
                                name=rule.get("Name", ""),
                                cloudwatch_metrics_enabled=rule.get(
                                    "VisibilityConfig", {}
                                ).get("CloudWatchMetricsEnabled", False),
                            )
                        )

                except Exception as error:
                    logger.error(
                        f"{acl.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )

        except Exception as error:
            logger.error(
                f"{acl.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags(self, resource: any):
        logger.info("WAFv2 - Listing tags...")
        try:
            if (
                resource.scope == Scope.REGIONAL
                or resource.region in self.regional_clients
            ):
                resource.tags = (
                    self.regional_clients[resource.region]
                    .list_tags_for_resource(ResourceARN=resource.arn)
                    .get("TagInfoForResource", {})
                    .get("TagList", [])
                )
        except Exception as error:
            logger.error(
                f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Scope(Enum):
    """Enumeration for the scope of the Web ACL."""

    REGIONAL = "REGIONAL"
    CLOUDFRONT = "CLOUDFRONT"


class Rule(BaseModel):
    """Model representing a rule for the Web ACL."""

    name: str
    cloudwatch_metrics_enabled: bool = False


class WebAclv2(BaseModel):
    """Model representing a Web ACL for WAFv2."""

    arn: str
    name: str
    id: str
    albs: list[str]
    user_pools: list[str]
    region: str
    logging_enabled: bool = False
    tags: Optional[list]
    scope: Scope = Scope.REGIONAL
    rules: list[Rule] = []
    rule_groups: list[Rule] = []
```

--------------------------------------------------------------------------------

---[FILE: wafv2_webacl_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/wafv2/wafv2_webacl_logging_enabled/wafv2_webacl_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "wafv2_webacl_logging_enabled",
  "CheckTitle": "AWS WAFv2 Web ACL has logging enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "wafv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsWafv2WebAcl",
  "Description": "**AWS WAFv2 Web ACLs** with **logging** capture details of inspected requests and rule evaluations. The assessment determines for each Web ACL whether logging is configured to record traffic analyzed by that ACL.",
  "Risk": "Without **WAF logging**, visibility into allowed/blocked requests is lost, degrading detection and response. **SQLi**, **credential stuffing**, and **bot/DDoS probes** can go unnoticed, risking data exposure (C), undetected rule misuse (I), and service instability from unseen abuse (A).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/WAF/enable-web-acls-logging.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/waf-controls.html#waf-11",
    "https://docs.aws.amazon.com/cli/latest/reference/wafv2/put-logging-configuration.html",
    "https://docs.aws.amazon.com/waf/latest/developerguide/logging.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws wafv2 put-logging-configuration --logging-configuration ResourceArn=<WEB_ACL_ARN>,LogDestinationConfigs=<DESTINATION_ARN>",
      "NativeIaC": "```yaml\n# CloudFormation: Enable logging for a WAFv2 Web ACL\nResources:\n  <example_resource_name>:\n    Type: AWS::WAFv2::LoggingConfiguration\n    Properties:\n      ResourceArn: arn:aws:wafv2:<region>:<account-id>:regional/webacl/<example_resource_name>/<example_resource_id>  # CRITICAL: target Web ACL to log\n      LogDestinationConfigs:  # CRITICAL: where logs are sent\n        - arn:aws:logs:<region>:<account-id>:log-group:aws-waf-logs-<example_resource_name>\n```",
      "Other": "1. In the AWS Console, go to AWS WAF & Shield > Web ACLs\n2. Select the target Web ACL\n3. Open the Logging and metrics (or Logging) section and click Enable logging\n4. Choose a log destination (CloudWatch Logs log group, S3 bucket, or Kinesis Data Firehose)\n5. Click Save to enable logging",
      "Terraform": "```hcl\n# Enable logging for a WAFv2 Web ACL\nresource \"aws_wafv2_web_acl_logging_configuration\" \"<example_resource_name>\" {\n  resource_arn           = \"<example_resource_arn>\"                 # CRITICAL: target Web ACL ARN\n  log_destination_configs = [\"<example_destination_arn>\"]           # CRITICAL: log destination ARN\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **logging** on all WAFv2 Web ACLs to a centralized destination. Apply **least privilege** for log delivery, **redact sensitive fields**, and filter to retain high-value events. Integrate with monitoring/SIEM for **alerting and correlation**, and review routinely as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/wafv2_webacl_logging_enabled"
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

---[FILE: wafv2_webacl_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/wafv2/wafv2_webacl_logging_enabled/wafv2_webacl_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.wafv2.wafv2_client import wafv2_client


class wafv2_webacl_logging_enabled(Check):
    def execute(self):
        findings = []
        for web_acl in wafv2_client.web_acls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=web_acl)

            if web_acl.logging_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"AWS WAFv2 Web ACL {web_acl.name} has logging enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"AWS WAFv2 Web ACL {web_acl.name} does not have logging enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: wafv2_webacl_rule_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/wafv2/wafv2_webacl_rule_logging_enabled/wafv2_webacl_rule_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "wafv2_webacl_rule_logging_enabled",
  "CheckTitle": "AWS WAFv2 Web ACL has Amazon CloudWatch metrics enabled for all rules and rule groups",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "wafv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsWafv2WebAcl",
  "Description": "**AWS WAFv2 Web ACLs** are assessed to confirm that every associated **rule** and **rule group** has **CloudWatch metrics** enabled for visibility into rule evaluations and traffic",
  "Risk": "Absent **CloudWatch metrics**, WAF telemetry is lost, masking spikes, rule bypasses, and misconfigurations. This delays detection of SQLi/XSS probes and bot floods, risking data confidentiality, request integrity, and application availability.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://support.icompaas.com/support/solutions/articles/62000233644-ensure-aws-wafv2-webacl-rule-or-rule-group-has-amazon-cloudwatch-metrics-enabled",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/waf-controls.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/waf-controls.html#waf-12"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Enable CloudWatch metrics on WAFv2 Web ACL rules\nResources:\n  <example_resource_name>:\n    Type: AWS::WAFv2::WebACL\n    Properties:\n      Name: <example_resource_name>\n      Scope: REGIONAL\n      DefaultAction:\n        Allow: {}\n      VisibilityConfig:\n        SampledRequestsEnabled: true\n        CloudWatchMetricsEnabled: true\n        MetricName: <metric_name>\n      Rules:\n        - Name: <example_rule_name>\n          Priority: 1\n          Statement:\n            ManagedRuleGroupStatement:\n              VendorName: AWS\n              Name: AWSManagedRulesCommonRuleSet\n          OverrideAction:\n            None: {}\n          VisibilityConfig:\n            SampledRequestsEnabled: true\n            CloudWatchMetricsEnabled: true  # Critical: enables CloudWatch metrics for this rule\n            MetricName: <rule_metric_name>  # Required with CloudWatch metrics\n```",
      "Other": "1. In AWS Console, go to AWS WAF & Shield > Web ACLs, select the Web ACL\n2. Open the Rules tab, edit each rule, and enable CloudWatch metrics (Visibility configuration > CloudWatch metrics enabled), then Save\n3. For rule groups: go to AWS WAF & Shield > Rule groups, select the rule group, edit Visibility configuration, enable CloudWatch metrics, then Save",
      "Terraform": "```hcl\n# Terraform: Enable CloudWatch metrics on WAFv2 Web ACL rules\nresource \"aws_wafv2_web_acl\" \"<example_resource_name>\" {\n  name  = \"<example_resource_name>\"\n  scope = \"REGIONAL\"\n\n  default_action { allow {} }\n\n  visibility_config {\n    cloudwatch_metrics_enabled = true\n    metric_name                = \"<metric_name>\"\n    sampled_requests_enabled   = true\n  }\n\n  rule {\n    name     = \"<example_rule_name>\"\n    priority = 1\n\n    statement {\n      managed_rule_group_statement {\n        vendor_name = \"AWS\"\n        name        = \"AWSManagedRulesCommonRuleSet\"\n      }\n    }\n\n    override_action { none {} }\n\n    visibility_config {\n      cloudwatch_metrics_enabled = true  # Critical: enables CloudWatch metrics for this rule\n      metric_name                = \"<rule_metric_name>\"  # Required with CloudWatch metrics\n      sampled_requests_enabled   = true\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **CloudWatch metrics** for all WAF rules and rule groups (*including managed rule groups*). Use consistent metric names, centralize dashboards and alerts, and review trends to validate rule efficacy. Integrate with a SIEM for **defense in depth** and tune rules based on telemetry.",
      "Url": "https://hub.prowler.com/check/wafv2_webacl_rule_logging_enabled"
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

---[FILE: wafv2_webacl_rule_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/wafv2/wafv2_webacl_rule_logging_enabled/wafv2_webacl_rule_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.wafv2.wafv2_client import wafv2_client


class wafv2_webacl_rule_logging_enabled(Check):
    def execute(self):
        findings = []
        for web_acl in wafv2_client.web_acls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=web_acl)

            if web_acl.rules or web_acl.rule_groups:
                report.status = "PASS"
                report.status_extended = f"AWS WAFv2 Web ACL {web_acl.name} does have CloudWatch Metrics enabled in all its rules."

                rules_metrics_disabled = []
                for rule in web_acl.rules:
                    if not rule.cloudwatch_metrics_enabled:
                        rules_metrics_disabled.append(rule.name)

                rule_groups_metrics_disabled = []
                for rule_group in web_acl.rule_groups:
                    if not rule_group.cloudwatch_metrics_enabled:
                        rule_groups_metrics_disabled.append(rule_group.name)

                if rules_metrics_disabled and rule_groups_metrics_disabled:
                    report.status = "FAIL"
                    report.status_extended = f"AWS WAFv2 Web ACL {web_acl.name} does not have CloudWatch Metrics enabled in rules: {', '.join(rules_metrics_disabled)} nor in rule groups: {', '.join(rule_groups_metrics_disabled)}."
                elif rules_metrics_disabled:
                    report.status = "FAIL"
                    report.status_extended = f"AWS WAFv2 Web ACL {web_acl.name} does not have CloudWatch Metrics enabled in rules: {', '.join(rules_metrics_disabled)}."
                elif rule_groups_metrics_disabled:
                    report.status = "FAIL"
                    report.status_extended = f"AWS WAFv2 Web ACL {web_acl.name} does not have CloudWatch Metrics enabled in rule groups: {', '.join(rule_groups_metrics_disabled)}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: wafv2_webacl_with_rules.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/wafv2/wafv2_webacl_with_rules/wafv2_webacl_with_rules.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "wafv2_webacl_with_rules",
  "CheckTitle": "AWS WAFv2 Web ACL has at least one rule or rule group attached",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "wafv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsWafv2WebAcl",
  "Description": "**AWS WAFv2 web ACLs** are evaluated for the presence of at least one configured **rule** or **rule group** that defines how HTTP(S) requests are inspected and acted upon.",
  "Risk": "Without rules, traffic is governed only by the web ACL `DefaultAction`, often allowing requests without inspection. This increases risks to **confidentiality** (data exfiltration via injection), **integrity** (XSS/parameter tampering), and **availability** (layer-7 DDoS, bot abuse).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-editing.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/waf-controls.html#waf-10",
    "https://support.icompaas.com/support/solutions/articles/62000233642-ensure-aws-wafv2-webacl-has-at-least-one-rule-or-rule-group"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Add at least one rule to the WAFv2 WebACL\nResources:\n  <example_resource_name>:\n    Type: AWS::WAFv2::WebACL\n    Properties:\n      Scope: REGIONAL\n      DefaultAction:\n        Allow: {}\n      VisibilityConfig:\n        SampledRequestsEnabled: true\n        CloudWatchMetricsEnabled: true\n        MetricName: <example_resource_name>\n      Rules:  # CRITICAL: Adding any rule/rule group here fixes the finding by making the Web ACL non-empty\n        - Name: <example_rule_name>\n          Priority: 0\n          Statement:\n            ManagedRuleGroupStatement:\n              VendorName: AWS\n              Name: AWSManagedRulesCommonRuleSet  # Uses an AWS managed rule group\n          OverrideAction:\n            Count: {}  # Non-blocking to minimize impact\n          VisibilityConfig:\n            SampledRequestsEnabled: true\n            CloudWatchMetricsEnabled: true\n            MetricName: <example_rule_name>\n```",
      "Other": "1. In the AWS Console, go to AWS WAF\n2. Open Web ACLs and select the failing Web ACL\n3. Go to the Rules tab and click Add rules\n4. Choose Add managed rule group, select AWS > AWSManagedRulesCommonRuleSet\n5. Set action to Count (to avoid blocking), then Add rule and Save\n6. Verify the Web ACL now shows at least one rule",
      "Terraform": "```hcl\n# Terraform: Ensure the WAFv2 Web ACL has at least one rule\nresource \"aws_wafv2_web_acl\" \"<example_resource_name>\" {\n  name  = \"<example_resource_name>\"\n  scope = \"REGIONAL\"\n\n  default_action {\n    allow {}\n  }\n\n  visibility_config {\n    cloudwatch_metrics_enabled = true\n    metric_name                = \"<example_resource_name>\"\n    sampled_requests_enabled   = true\n  }\n\n  rule { # CRITICAL: Presence of this rule makes the Web ACL non-empty and passes the check\n    name     = \"<example_rule_name>\"\n    priority = 0\n    statement {\n      managed_rule_group_statement {\n        name        = \"AWSManagedRulesCommonRuleSet\"\n        vendor_name = \"AWS\"  # Minimal managed rule group\n      }\n    }\n    override_action { count {} } # Non-blocking\n    visibility_config {\n      cloudwatch_metrics_enabled = true\n      metric_name                = \"<example_rule_name>\"\n      sampled_requests_enabled   = true\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Populate each web ACL with targeted rules or managed rule groups to enforce least-privilege web access: cover common exploits (SQLi/XSS), IP reputation, and rate limits, scoped to your apps. Use a conservative `DefaultAction`, monitor metrics/logs, and continually tune-supporting **defense in depth** and **zero trust**.",
      "Url": "https://hub.prowler.com/check/wafv2_webacl_with_rules"
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

---[FILE: wafv2_webacl_with_rules.py]---
Location: prowler-master/prowler/providers/aws/services/wafv2/wafv2_webacl_with_rules/wafv2_webacl_with_rules.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.wafv2.wafv2_client import wafv2_client


class wafv2_webacl_with_rules(Check):
    def execute(self):
        findings = []
        for web_acl in wafv2_client.web_acls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=web_acl)
            report.status = "FAIL"
            report.status_extended = f"AWS WAFv2 Web ACL {web_acl.name} does not have any rules or rule groups attached."

            if web_acl.rules or web_acl.rule_groups:
                report.status = "PASS"
                report.status_extended = f"AWS WAFv2 Web ACL {web_acl.name} does have rules or rule groups attached."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: wellarchitected_client.py]---
Location: prowler-master/prowler/providers/aws/services/wellarchitected/wellarchitected_client.py

```python
from prowler.providers.aws.services.wellarchitected.wellarchitected_service import (
    WellArchitected,
)
from prowler.providers.common.provider import Provider

wellarchitected_client = WellArchitected(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: wellarchitected_service.py]---
Location: prowler-master/prowler/providers/aws/services/wellarchitected/wellarchitected_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class WellArchitected(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.workloads = []
        self.__threading_call__(self._list_workloads)
        self._list_tags_for_resource()

    def _list_workloads(self, regional_client):
        logger.info("WellArchitected - Listing Workloads...")
        try:
            for workload in regional_client.list_workloads()["WorkloadSummaries"]:
                if not self.audit_resources or (
                    is_resource_filtered(workload["WorkloadArn"], self.audit_resources)
                ):
                    self.workloads.append(
                        Workload(
                            id=workload["WorkloadId"],
                            arn=workload["WorkloadArn"],
                            name=workload["WorkloadName"],
                            region=regional_client.region,
                            lenses=workload["Lenses"],
                            improvement_status=workload["ImprovementStatus"],
                            risks=workload["RiskCounts"],
                        )
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("WellArchitected - Listing Tags...")
        try:
            for workload in self.workloads:
                regional_client = self.regional_clients[workload.region]
                response = regional_client.list_tags_for_resource(
                    WorkloadArn=workload.arn
                )["Tags"]
                workload.tags = [response]
        except ClientError as error:
            if error.response["Error"]["Code"] == "BadRequestException":
                logger.warning(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Workload(BaseModel):
    id: str
    arn: str
    name: str
    region: str
    lenses: list
    improvement_status: str
    risks: dict
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: wellarchitected_workload_no_high_or_medium_risks.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/wellarchitected/wellarchitected_workload_no_high_or_medium_risks/wellarchitected_workload_no_high_or_medium_risks.metadata.json
Signals: Next.js

```json
{
  "Provider": "aws",
  "CheckID": "wellarchitected_workload_no_high_or_medium_risks",
  "CheckTitle": "Check for medium and high risks identified in workloads defined in the AWS Well-Architected Tool.",
  "CheckType": [],
  "ServiceName": "wellarchitected",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:wellarchitected:region:account-id:workload/workload-id",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "The Well-Architected Tool uses the AWS Well-Architected Framework to compare your cloud workloads against best practices across five architectural pillars: security, reliability, performance efficiency, operational excellence, and cost optimization",
  "Risk": "A given workload can have medium and/or high risks that have been identified based on answers provided to the questions in the Well-Architected Tool. These issues are architectural and operational choices that are not aligned with the best practices from the Well-Architected Framework",
  "RelatedUrl": "https://aws.amazon.com/architecture/well-architected/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/WellArchitected/findings.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "With the AWS Well-Architected Tool tool, you can analyze your workloads using a consistent process, pinpoint any medium or high-risk issues, and identify the next steps that must be taken for improvement",
      "Url": "https://aws.amazon.com/architecture/well-architected/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: wellarchitected_workload_no_high_or_medium_risks.py]---
Location: prowler-master/prowler/providers/aws/services/wellarchitected/wellarchitected_workload_no_high_or_medium_risks/wellarchitected_workload_no_high_or_medium_risks.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.wellarchitected.wellarchitected_client import (
    wellarchitected_client,
)


class wellarchitected_workload_no_high_or_medium_risks(Check):
    def execute(self):
        findings = []
        for workload in wellarchitected_client.workloads:
            report = Check_Report_AWS(metadata=self.metadata(), resource=workload)
            report.status = "PASS"
            report.status_extended = f"Well Architected workload {workload.name} does not contain high or medium risks."
            if "HIGH" in workload.risks or "MEDIUM" in workload.risks:
                report.status = "FAIL"
                report.status_extended = f"Well Architected workload {workload.name} contains {workload.risks.get('HIGH' , 0)} high and {workload.risks.get('MEDIUM' , 0)} medium risks."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: workspaces_client.py]---
Location: prowler-master/prowler/providers/aws/services/workspaces/workspaces_client.py

```python
from prowler.providers.aws.services.workspaces.workspaces_service import WorkSpaces
from prowler.providers.common.provider import Provider

workspaces_client = WorkSpaces(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: workspaces_service.py]---
Location: prowler-master/prowler/providers/aws/services/workspaces/workspaces_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class WorkSpaces(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.workspaces = []
        self.__threading_call__(self._describe_workspaces)
        self._describe_tags()

    def _describe_workspaces(self, regional_client):
        logger.info("WorkSpaces - describing workspaces...")
        try:
            describe_workspaces_paginator = regional_client.get_paginator(
                "describe_workspaces"
            )
            for page in describe_workspaces_paginator.paginate():
                for workspace in page["Workspaces"]:
                    arn = f"arn:{self.audited_partition}:workspaces:{regional_client.region}:{self.audited_account}:workspace/{workspace['WorkspaceId']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        workspace_to_append = WorkSpace(
                            arn=arn,
                            id=workspace.get("WorkspaceId"),
                            region=regional_client.region,
                            subnet_id=workspace.get("SubnetId"),
                        )
                        if (
                            "UserVolumeEncryptionEnabled" in workspace
                            and workspace.get("UserVolumeEncryptionEnabled")
                        ):
                            workspace_to_append.user_volume_encryption_enabled = True
                        if (
                            "RootVolumeEncryptionEnabled" in workspace
                            and workspace["RootVolumeEncryptionEnabled"]
                        ):
                            workspace_to_append.root_volume_encryption_enabled = True
                        self.workspaces.append(workspace_to_append)

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_tags(self):
        logger.info("Workspaces - List Tags...")
        try:
            for workspace in self.workspaces:
                regional_client = self.regional_clients[workspace.region]
                response = regional_client.describe_tags(ResourceId=workspace.id)[
                    "TagList"
                ]
                workspace.tags = response
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class WorkSpace(BaseModel):
    id: str
    arn: str
    region: str
    user_volume_encryption_enabled: bool = None
    root_volume_encryption_enabled: bool = None
    subnet_id: str = None
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: workspaces_volume_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/workspaces/workspaces_volume_encryption_enabled/workspaces_volume_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "workspaces_volume_encryption_enabled",
  "CheckTitle": "Ensure that your Amazon WorkSpaces storage volumes are encrypted in order to meet security and compliance requirements",
  "CheckType": [],
  "ServiceName": "workspaces",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:workspaces:region:account-id:workspace",
  "Severity": "high",
  "ResourceType": "AwsWorkSpacesWorkspace",
  "Description": "Ensure that your Amazon WorkSpaces storage volumes are encrypted in order to meet security and compliance requirements",
  "Risk": "If the value listed in the Volume Encryption column is Disabled the selected AWS WorkSpaces instance volumes (root and user volumes) are not encrypted. Therefore your data-at-rest is not protected from unauthorized access and does not meet the compliance requirements regarding data encryption.",
  "RelatedUrl": "https://docs.aws.amazon.com/workspaces/latest/adminguide/encrypt-workspaces.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/aws/general-policies/ensure-that-workspace-root-volumes-are-encrypted#cloudformation",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/WorkSpaces/storage-encryption.html",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/ensure-that-workspace-root-volumes-are-encrypted#terraform"
    },
    "Recommendation": {
      "Text": "WorkSpaces is integrated with the AWS Key Management Service (AWS KMS). This enables you to encrypt storage volumes of WorkSpaces using AWS KMS Key. When you launch a WorkSpace you can encrypt the root volume (for Microsoft Windows - the C drive, for Linux - /) and the user volume (for Windows - the D drive, for Linux - /home). Doing so ensures that the data stored at rest - disk I/O to the volume - and snapshots created from the volumes are all encrypted",
      "Url": "https://docs.aws.amazon.com/workspaces/latest/adminguide/encrypt-workspaces.html"
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

---[FILE: workspaces_volume_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/workspaces/workspaces_volume_encryption_enabled/workspaces_volume_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.workspaces.workspaces_client import (
    workspaces_client,
)


class workspaces_volume_encryption_enabled(Check):
    def execute(self):
        findings = []
        for workspace in workspaces_client.workspaces:
            report = Check_Report_AWS(metadata=self.metadata(), resource=workspace)
            report.status = "PASS"
            report.status_extended = f"WorkSpaces workspace {workspace.id} root and user volumes are encrypted."
            if not workspace.user_volume_encryption_enabled:
                report.status = "FAIL"
                report.status_extended = f"WorkSpaces workspace {workspace.id} with user unencrypted volumes."
            if not workspace.root_volume_encryption_enabled:
                report.status = "FAIL"
                report.status_extended = f"WorkSpaces workspace {workspace.id} with root unencrypted volumes."
            if (
                not workspace.root_volume_encryption_enabled
                and not workspace.user_volume_encryption_enabled
            ):
                report.status = "FAIL"
                report.status_extended = f"WorkSpaces workspace {workspace.id} with root and user unencrypted volumes."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
