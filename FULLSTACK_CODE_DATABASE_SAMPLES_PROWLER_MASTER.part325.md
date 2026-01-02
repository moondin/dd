---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 325
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 325 of 867)

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

---[FILE: waf_global_rulegroup_not_empty.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_global_rulegroup_not_empty/waf_global_rulegroup_not_empty.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "waf_global_rulegroup_not_empty",
  "CheckTitle": "AWS WAF Classic global rule group has at least one rule",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "waf",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsWafRuleGroup",
  "Description": "**AWS WAF Classic global rule groups** are assessed for the presence of **one or more rules**. Empty groups are identified even when referenced by a web ACL, meaning the group adds no match logic.",
  "Risk": "An empty rule group performs no inspection, so web requests pass without WAF scrutiny. This creates blind spots enabling:\n- **Confidentiality**: data exfiltration via SQLi/XSS\n- **Integrity**: parameter tampering\n- **Availability**: bot abuse and layer-7 DoS\n\nIt also creates a false sense of protection when attached.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-groups.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/waf-controls.html#waf-7",
    "https://docs.aws.amazon.com/waf/latest/developerguide/classic-rule-group-editing.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws waf update-rule-group --rule-group-id <rule-group-id> --updates Action=INSERT,ActivatedRule={Priority=1,RuleId=<rule-id>,Action={Type=BLOCK}} --change-token <change-token> --region us-east-1",
      "NativeIaC": "```yaml\n# CloudFormation: ensure the WAF Classic global rule group has at least one rule\nResources:\n  <example_resource_name>:\n    Type: AWS::WAF::RuleGroup\n    Properties:\n      Name: <example_resource_name>\n      MetricName: examplemetric\n      ActivatedRules:\n        - Priority: 1                 # Critical: adds a rule to the group (makes it non-empty)\n          RuleId: <example_resource_id>  # Critical: ID of the existing rule to add\n          Action:\n            Type: BLOCK              # Critical: required action when activating the rule\n```",
      "Other": "1. Open the AWS Console and go to AWS WAF, then switch to AWS WAF Classic\n2. At the top, set scope to Global (CloudFront)\n3. Go to Rule groups and select the target rule group\n4. Click Edit rule group\n5. Select an existing rule, choose its action (e.g., BLOCK), and click Add rule to rule group\n6. Click Update to save",
      "Terraform": "```hcl\n# Terraform: ensure the WAF Classic global rule group has at least one rule\nresource \"aws_waf_rule_group\" \"<example_resource_name>\" {\n  name        = \"<example_resource_name>\"\n  metric_name = \"examplemetric\"\n\n  activated_rule {\n    priority = 1                      # Critical: adds a rule to the group (makes it non-empty)\n    rule_id  = \"<example_resource_id>\" # Critical: ID of the existing rule to add\n    action {\n      type = \"BLOCK\"                 # Critical: required action when activating the rule\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Populate each rule group with **effective rules** aligned to application threats; choose `block` or `count` actions as appropriate. Prefer **managed rule groups** as a baseline and layer custom rules for **least privilege**. Avoid placeholder groups, test in staging, and monitor metrics to tune.",
      "Url": "https://hub.prowler.com/check/waf_global_rulegroup_not_empty"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: waf_global_rulegroup_not_empty.py]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_global_rulegroup_not_empty/waf_global_rulegroup_not_empty.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.waf.waf_client import waf_client


class waf_global_rulegroup_not_empty(Check):
    def execute(self):
        findings = []
        for rule_group in waf_client.rule_groups.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=rule_group)
            report.status = "FAIL"
            report.status_extended = (
                f"AWS WAF Global Rule Group {rule_group.name} does not have any rules."
            )

            if rule_group.rules:
                report.status = "PASS"
                report.status_extended = (
                    f"AWS WAF Global Rule Group {rule_group.name} is not empty."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: waf_global_rule_with_conditions.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_global_rule_with_conditions/waf_global_rule_with_conditions.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "waf_global_rule_with_conditions",
  "CheckTitle": "AWS WAF Classic Global rule has at least one condition",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "waf",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsWafRule",
  "Description": "**AWS WAF Classic global rules** contain at least one **condition** that matches HTTP(S) requests the rule evaluates for action (e.g., `allow`, `block`, `count`).",
  "Risk": "**No-condition rules** never match traffic, providing no filtering. Malicious requests (SQLi/XSS, bots) can reach origins, impacting **confidentiality** (data exfiltration), **integrity** (tampering), and **availability** (service disruption). They may also create a false sense of coverage.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/waf/latest/developerguide/classic-web-acl-rules-editing.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/waf-controls.html#waf-6",
    "https://docs.aws.amazon.com/config/latest/developerguide/waf-global-rule-not-empty.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws waf update-rule --rule-id <example_resource_id> --change-token <example_change_token> --updates '[{\"Action\":\"INSERT\",\"Predicate\":{\"Negated\":false,\"Type\":\"IPMatch\",\"DataId\":\"<example_resource_id>\"}}]' --region us-east-1",
      "NativeIaC": "```yaml\n# CloudFormation: ensure the WAF Classic Global rule has at least one condition\nResources:\n  <example_resource_name>:\n    Type: AWS::WAF::Rule\n    Properties:\n      Name: <example_resource_name>\n      MetricName: <example_metric_name>\n      # Critical: add at least one predicate (condition) so the rule is not empty\n      Predicates:\n        - Negated: false  # evaluate as-is\n          Type: IPMatch\n          DataId: <example_resource_id>  # existing IPSet ID\n```",
      "Other": "1. Open the AWS Console > AWS WAF, then click Switch to AWS WAF Classic\n2. In Global (CloudFront) scope, go to Rules and select the target rule\n3. Click Edit (or Add rule) > Add condition\n4. Choose a condition type (e.g., IP match), select an existing condition, set it to does (not negated)\n5. Click Update/Save to apply\n",
      "Terraform": "```hcl\n# Ensure the WAF Classic Global rule has at least one condition\nresource \"aws_waf_rule\" \"<example_resource_name>\" {\n  name        = \"<example_resource_name>\"\n  metric_name = \"<example_metric_name>\"\n\n  # Critical: add at least one predicate (condition) so the rule is not empty\n  predicate {\n    data_id = \"<example_resource_id>\"  # existing IPSet ID\n    negated = false\n    type    = \"IPMatch\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Attach at least one precise **condition** to every rule, aligned to known threats and application context. Apply **least privilege** for traffic, use managed rule groups for **defense in depth**, and routinely review rules to remove placeholders. *If on Classic*, plan migration to WAFv2.",
      "Url": "https://hub.prowler.com/check/waf_global_rule_with_conditions"
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

---[FILE: waf_global_rule_with_conditions.py]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_global_rule_with_conditions/waf_global_rule_with_conditions.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.waf.waf_client import waf_client


class waf_global_rule_with_conditions(Check):
    def execute(self):
        findings = []
        for rule in waf_client.rules.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=rule)
            report.status = "FAIL"
            report.status_extended = (
                f"AWS WAF Global Rule {rule.name} does not have any conditions."
            )

            if rule.predicates:
                report.status = "PASS"
                report.status_extended = (
                    f"AWS WAF Global Rule {rule.name} has at least one condition."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: waf_global_webacl_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_global_webacl_logging_enabled/waf_global_webacl_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "waf_global_webacl_logging_enabled",
  "CheckTitle": "AWS WAF Classic Global Web ACL has logging enabled",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "waf",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsWafWebAcl",
  "Description": "**AWS WAF Classic global Web ACLs** have **logging** enabled to capture evaluated web requests and rule actions for each ACL",
  "Risk": "Without **WAF logging**, you lose **visibility** into attacks (SQLi/XSS probes, bots, brute-force) and into allow/block decisions, limiting detection and forensics. This degrades **confidentiality**, **integrity**, and **availability**, and slows incident response and tuning.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/waf/latest/developerguide/classic-logging.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/waf-controls.html#waf-1",
    "https://docs.aws.amazon.com/cli/latest/reference/waf/put-logging-configuration.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws waf put-logging-configuration --logging-configuration ResourceArn=<web_acl_arn>,LogDestinationConfigs=<kinesis_firehose_delivery_stream_arn>",
      "NativeIaC": "",
      "Other": "1. In the AWS console, create an Amazon Kinesis Data Firehose delivery stream named starting with \"aws-waf-logs-\" (for CloudFront/global, create it in us-east-1)\n2. Open the AWS WAF console and switch to AWS WAF Classic\n3. Select Filter: Global (CloudFront) and go to Web ACLs\n4. Open the target Web ACL and go to the Logging tab\n5. Click Enable logging and select the Firehose delivery stream created in step 1\n6. Click Enable/Save",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable **logging** on all global Web ACLs and send records to a centralized logging platform. Apply **least privilege** to log destinations and redact sensitive fields. Monitor and alert on anomalies, and integrate logs with incident response for **defense in depth** and faster containment.",
      "Url": "https://hub.prowler.com/check/waf_global_webacl_logging_enabled"
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

---[FILE: waf_global_webacl_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_global_webacl_logging_enabled/waf_global_webacl_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.waf.waf_client import waf_client


class waf_global_webacl_logging_enabled(Check):
    def execute(self):
        findings = []
        for acl in waf_client.web_acls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=acl)
            report.status = "FAIL"
            report.status_extended = (
                f"AWS WAF Global Web ACL {acl.name} does not have logging enabled."
            )

            if acl.logging_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"AWS WAF Global Web ACL {acl.name} does have logging enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: waf_global_webacl_with_rules.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_global_webacl_with_rules/waf_global_webacl_with_rules.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "waf_global_webacl_with_rules",
  "CheckTitle": "AWS WAF Classic global Web ACL has at least one rule or rule group",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "waf",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsWafWebAcl",
  "Description": "**AWS WAF Classic global web ACLs** are evaluated for the presence of at least one **rule** or **rule group** that inspects HTTP(S) requests",
  "Risk": "With no rules, the web ACL relies solely on its default action. If `allow`, hostile traffic reaches origins uninspected; if `block`, legitimate traffic can be denied.\n- SQLi/XSS can expose data (confidentiality)\n- Malicious requests can alter state (integrity)\n- Bots and scraping can drain resources (availability)",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/waf-controls.html#waf-8",
    "https://docs.aws.amazon.com/waf/latest/developerguide/classic-web-acl-editing.html",
    "https://docs.aws.amazon.com/waf/latest/developerguide/waf-rules.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws waf update-web-acl --web-acl-id <WEB_ACL_ID> --change-token <CHANGE_TOKEN> --updates '[{\"Action\":\"INSERT\",\"ActivatedRule\":{\"Priority\":1,\"RuleId\":\"<RULE_ID>\",\"Action\":{\"Type\":\"BLOCK\"}}}]'",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::WAF::WebACL\n    Properties:\n      Name: <example_resource_name>\n      MetricName: <example_metric_name>\n      DefaultAction:\n        Type: ALLOW\n      Rules:\n        - Action:\n            Type: BLOCK\n          Priority: 1\n          RuleId: <example_rule_id>  # Critical: Adds a rule so the Web ACL is not empty\n          # This ensures the Web ACL has at least one rule, changing FAIL to PASS\n```",
      "Other": "1. Open the AWS console and go to WAF\n2. In the left menu, click Switch to AWS WAF Classic\n3. At the top, set Filter to Global (CloudFront)\n4. Click Web ACLs and select your web ACL\n5. On the Rules tab, click Edit web ACL\n6. In Rules, select an existing rule or rule group and click Add rule to web ACL\n7. Click Save changes",
      "Terraform": "```hcl\nresource \"aws_waf_web_acl\" \"<example_resource_name>\" {\n  name        = \"<example_resource_name>\"\n  metric_name = \"<example_metric_name>\"\n\n  default_action {\n    type = \"ALLOW\"\n  }\n\n  rules { # Critical: Adds at least one rule so the Web ACL is not empty\n    priority = 1\n    rule_id  = \"<example_rule_id>\"\n    type     = \"REGULAR\"\n    action {\n      type = \"BLOCK\"\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Populate each global web ACL with effective protections:\n- Use rule groups and targeted rules (managed, rate-based, IP sets)\n- Apply least privilege: default `block` where feasible; explicitly `allow` required traffic\n- Layer defenses and enable logging to tune policies\n- *Consider migrating to WAFv2*",
      "Url": "https://hub.prowler.com/check/waf_global_webacl_with_rules"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: waf_global_webacl_with_rules.py]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_global_webacl_with_rules/waf_global_webacl_with_rules.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.waf.waf_client import waf_client


class waf_global_webacl_with_rules(Check):
    def execute(self):
        findings = []
        for acl in waf_client.web_acls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=acl)
            report.status = "FAIL"
            report.status_extended = f"AWS WAF Global Web ACL {acl.name} does not have any rules or rule groups."

            if acl.rules or acl.rule_groups:
                report.status = "PASS"
                report.status_extended = f"AWS WAF Global Web ACL {acl.name} has at least one rule or rule group."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: waf_regional_rulegroup_not_empty.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_regional_rulegroup_not_empty/waf_regional_rulegroup_not_empty.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "waf_regional_rulegroup_not_empty",
  "CheckTitle": "AWS WAF Classic Regional rule group has at least one rule",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "waf",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsWafRegionalRuleGroup",
  "Description": "**AWS WAF Classic Regional rule groups** are evaluated to confirm they contain at least one **rule**. Groups with no rule entries are considered empty.",
  "Risk": "An empty rule group contributes no filtering in a web ACL, letting requests bypass inspection within that group. This erodes **defense in depth** and can enable injection, brute-force, or bot traffic to reach applications, threatening **confidentiality**, **integrity**, and **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/cli/latest/reference/waf-regional/update-rule-group.html",
    "https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-groups.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/waf-controls.html#waf-3"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws waf-regional update-rule-group --rule-group-id <rule-group-id> --updates Action=INSERT,ActivatedRule={Priority=1,RuleId=<rule-id>,Action={Type=BLOCK}} --change-token <change-token>",
      "NativeIaC": "```yaml\n# CloudFormation: Ensure WAF Classic Regional Rule Group has at least one rule\nResources:\n  <example_resource_name>:\n    Type: AWS::WAFRegional::RuleGroup\n    Properties:\n      Name: <example_resource_name>\n      MetricName: <example_resource_name>\n      ActivatedRules:\n        - Priority: 1  # Critical: adds a rule so the rule group is not empty\n          RuleId: <example_resource_id>  # Critical: references an existing rule to include in the group\n          Action:\n            Type: BLOCK\n```",
      "Other": "1. In the AWS Console, go to AWS WAF & Shield and switch to AWS WAF Classic\n2. Select the correct Region, then choose Rule groups\n3. Open the target rule group and click Edit rule group\n4. Click Add rule to rule group, select an existing rule, choose an action (e.g., BLOCK), and click Update\n5. Save changes to ensure the rule group contains at least one rule",
      "Terraform": "```hcl\n# Ensure WAF Classic Regional Rule Group has at least one rule\nresource \"aws_wafregional_rule_group\" \"<example_resource_name>\" {\n  name        = \"<example_resource_name>\"\n  metric_name = \"<example_resource_name>\"\n\n  # Critical: adds a rule so the rule group is not empty\n  activated_rule {\n    priority = 1\n    rule_id  = \"<example_resource_id>\"  # existing rule ID\n    action {\n      type = \"BLOCK\"\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege**: populate each rule group with vetted rules aligned to your threat model, using `ALLOW`, `BLOCK`, or `COUNT` actions as appropriate. Remove or disable unused groups to avoid false assurance. Validate behavior in staging and monitor metrics to maintain **defense in depth**.",
      "Url": "https://hub.prowler.com/check/waf_regional_rulegroup_not_empty"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: waf_regional_rulegroup_not_empty.py]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_regional_rulegroup_not_empty/waf_regional_rulegroup_not_empty.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.waf.wafregional_client import wafregional_client


class waf_regional_rulegroup_not_empty(Check):
    def execute(self):
        findings = []
        for rule_group in wafregional_client.rule_groups.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=rule_group)
            report.status = "FAIL"
            report.status_extended = f"AWS WAF Regional Rule Group {rule_group.name} does not have any rules."

            if rule_group.rules:
                report.status = "PASS"
                report.status_extended = (
                    f"AWS WAF Regional Rule Group {rule_group.name} is not empty."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: waf_regional_rule_with_conditions.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_regional_rule_with_conditions/waf_regional_rule_with_conditions.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "waf_regional_rule_with_conditions",
  "CheckTitle": "AWS WAF Classic Regional rule has at least one condition",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "waf",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsWafRegionalRule",
  "Description": "**AWS WAF Classic Regional rules** have one or more **conditions (predicates)** attached (IP, byte/regex, geo, size, SQLi/XSS) to define which requests the rule evaluates",
  "Risk": "An empty rule never matches, letting traffic bypass that control. This weakens defense-in-depth and can impact **confidentiality** (data exfiltration), **integrity** (SQLi/XSS), and **availability** (missing rate/size limits), depending on Web ACL order and default action.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/waf/latest/developerguide/classic-web-acl-rules-editing.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/waf-controls.html#waf-2",
    "https://docs.aws.amazon.com/config/latest/developerguide/waf-regional-rule-not-empty.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws waf-regional update-rule --rule-id <example_rule_id> --change-token $(aws waf-regional get-change-token --query ChangeToken --output text) --updates '[{\"Action\":\"INSERT\",\"Predicate\":{\"Negated\":false,\"Type\":\"IPMatch\",\"DataId\":\"<example_ipset_id>\"}}]'",
      "NativeIaC": "```yaml\n# Add at least one condition to a WAF Classic Regional Rule\nResources:\n  <example_resource_name>:\n    Type: AWS::WAFRegional::Rule\n    Properties:\n      Name: <example_resource_name>\n      MetricName: <example_metric_name>\n      Predicates:\n        - Negated: false         # CRITICAL: ensures the predicate is applied as-is\n          Type: IPMatch          # CRITICAL: predicate type\n          DataId: <example_ipset_id>  # CRITICAL: attaches an existing IP set as a condition\n```",
      "Other": "1. Open the AWS Console and go to AWS WAF, then select Switch to AWS WAF Classic\n2. In the left pane, choose Regional and click Rules\n3. Select the target rule and choose Add rule\n4. Click Add condition, set When a request to does, choose IP match (or another type), and select an existing condition (e.g., an IP set)\n5. Click Update to save the rule with the condition",
      "Terraform": "```hcl\n# WAF Classic Regional rule with at least one condition\nresource \"aws_wafregional_rule\" \"<example_resource_name>\" {\n  name        = \"<example_resource_name>\"\n  metric_name = \"<example_metric_name>\"\n\n  predicate {                        \n    data_id = \"<example_ipset_id>\"  # CRITICAL: attaches existing IP set as the condition\n    type    = \"IPMatch\"             # CRITICAL: predicate type\n    negated = false                  # CRITICAL: apply condition directly\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Define precise **conditions** for each rule (e.g., IP, pattern, geo, size) and avoid placeholder rules. Apply **least privilege** filtering, review rule order, and use layered controls for **defense in depth**. Regularly validate and monitor rule effectiveness.",
      "Url": "https://hub.prowler.com/check/waf_regional_rule_with_conditions"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: waf_regional_rule_with_conditions.py]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_regional_rule_with_conditions/waf_regional_rule_with_conditions.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.waf.wafregional_client import wafregional_client


class waf_regional_rule_with_conditions(Check):
    def execute(self):
        findings = []
        for rule in wafregional_client.rules.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=rule)
            report.status = "FAIL"
            report.status_extended = (
                f"AWS WAF Regional Rule {rule.name} does not have any conditions."
            )

            if rule.predicates:
                report.status = "PASS"
                report.status_extended = (
                    f"AWS WAF Regional Rule {rule.name} has at least one condition."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: waf_regional_webacl_with_rules.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_regional_webacl_with_rules/waf_regional_webacl_with_rules.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "waf_regional_webacl_with_rules",
  "CheckTitle": "AWS WAF Classic Regional Web ACL has at least one rule or rule group",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "waf",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsWafRegionalWebAcl",
  "Description": "**AWS WAF Classic Regional web ACL** contains at least one **rule** or **rule group** to inspect and act on HTTP(S) requests. An ACL with no entries is considered empty.",
  "Risk": "With no rules, the web ACL performs no inspection, letting malicious traffic through.\n- **Confidentiality**: data exposure via SQLi/XSS\n- **Integrity**: unauthorized actions or tampering\n- **Availability**: abuse/bot traffic causing degradation or denial",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/waf-controls.html#waf-4",
    "https://docs.aws.amazon.com/waf/latest/developerguide/classic-web-acl-editing.html",
    "https://docs.aws.amazon.com/waf/latest/developerguide/waf-rules.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws waf-regional update-web-acl --web-acl-id <your-web-acl-id> --change-token $(aws waf-regional get-change-token --query 'ChangeToken' --output text) --updates '[{\"Action\":\"INSERT\",\"ActivatedRule\":{\"Priority\":1,\"RuleId\":\"<your-rule-id>\",\"Action\":{\"Type\":\"BLOCK\"}}}]'",
      "NativeIaC": "```yaml\n# CloudFormation: Ensure the Web ACL has at least one rule\nResources:\n  <example_resource_name>:\n    Type: AWS::WAFRegional::WebACL\n    Properties:\n      Name: \"<example_resource_name>\"\n      MetricName: \"<example_resource_name>\"\n      DefaultAction:\n        Type: ALLOW\n      # Critical: adding any rule to the Web ACL makes it non-empty and passes the check\n      Rules:\n        - Action:\n            Type: BLOCK\n          Priority: 1\n          RuleId: \"<example_resource_id>\"  # Rule to insert into the Web ACL\n```",
      "Other": "1. Open the AWS Console and go to AWS WAF\n2. In the left pane, click Web ACLs and switch to AWS WAF Classic if prompted\n3. Select the Regional Web ACL and open the Rules tab\n4. Click Edit web ACL\n5. In Rules, select an existing rule or rule group and choose Add rule to web ACL\n6. Click Save changes",
      "Terraform": "```hcl\n# Terraform: Ensure the Web ACL has at least one rule\nresource \"aws_wafregional_web_acl\" \"<example_resource_name>\" {\n  name        = \"<example_resource_name>\"\n  metric_name = \"<example_resource_name>\"\n\n  default_action {\n    type = \"ALLOW\"\n  }\n\n  # Critical: add at least one rule so the Web ACL is not empty\n  rules {\n    priority = 1\n    rule_id  = \"<example_resource_id>\"\n    action {\n      type = \"BLOCK\"\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Populate each web ACL with at least one **rule** or **rule group** that inspects requests and enforces **least privilege**. Apply defense in depth by combining managed and custom rules, include rate controls where appropriate, and review regularly. *Default to blocking undesired traffic; only permit required patterns*.",
      "Url": "https://hub.prowler.com/check/waf_regional_webacl_with_rules"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: waf_regional_webacl_with_rules.py]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_regional_webacl_with_rules/waf_regional_webacl_with_rules.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.waf.wafregional_client import wafregional_client


class waf_regional_webacl_with_rules(Check):
    def execute(self):
        findings = []
        for acl in wafregional_client.web_acls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=acl)
            report.status = "FAIL"
            report.status_extended = f"AWS WAF Regional Web ACL {acl.name} does not have any rules or rule groups."

            if acl.rules or acl.rule_groups:
                report.status = "PASS"
                report.status_extended = f"AWS WAF Regional Web ACL {acl.name} has at least one rule or rule group."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: wafv2_client.py]---
Location: prowler-master/prowler/providers/aws/services/wafv2/wafv2_client.py

```python
from prowler.providers.aws.services.wafv2.wafv2_service import WAFv2
from prowler.providers.common.provider import Provider

wafv2_client = WAFv2(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
