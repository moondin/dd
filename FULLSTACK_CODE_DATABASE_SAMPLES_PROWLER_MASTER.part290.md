---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 290
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 290 of 867)

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

---[FILE: guardduty_eks_audit_log_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_eks_audit_log_enabled/guardduty_eks_audit_log_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "guardduty_eks_audit_log_enabled",
  "CheckTitle": "GuardDuty detector has EKS Audit Log Monitoring enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "guardduty",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsGuardDutyDetector",
  "Description": "**Amazon GuardDuty detectors** are evaluated for **EKS Audit Log Monitoring** (`EKS_AUDIT_LOGS`) being enabled to analyze Kubernetes audit activity from your **Amazon EKS** clusters.",
  "Risk": "Without it, **Kubernetes API abuse** may go undetected, impacting CIA:\n- Secret access and data exfiltration\n- RBAC changes enabling privilege escalation\n- Rogue deployments for persistence/cryptomining\n\nAttackers can laterally move to AWS using harvested credentials.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/guardduty/latest/ug/eks-protection-enable-standalone-account.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/guardduty-controls.html#guardduty-5",
    "https://docs.aws.amazon.com/guardduty/latest/ug/kubernetes-protection.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws guardduty update-detector --detector-id <detector-id> --features '[{\"Name\":\"EKS_AUDIT_LOGS\",\"Status\":\"ENABLED\"}]'",
      "NativeIaC": "```yaml\n# CloudFormation: Enable EKS Audit Log Monitoring on GuardDuty detector\nResources:\n  GuardDutyDetector:\n    Type: AWS::GuardDuty::Detector\n    Properties:\n      Enable: true\n      DataSources:\n        Kubernetes:\n          AuditLogs:\n            Enable: true  # CRITICAL: Enables EKS Audit Log Monitoring\n```",
      "Other": "1. Open the AWS Console and go to Amazon GuardDuty\n2. Select the Region where you want to enable it\n3. In the left menu, click EKS Protection\n4. Click Enable and confirm\n5. If using AWS Organizations, perform these steps in the delegated GuardDuty administrator account",
      "Terraform": "```hcl\n# Enable EKS Audit Log Monitoring on GuardDuty detector\nresource \"aws_guardduty_detector\" \"example\" {\n  enable = true\n\n  features {\n    name   = \"EKS_AUDIT_LOGS\"\n    status = \"ENABLED\"  # CRITICAL: Enables EKS Audit Log Monitoring\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **EKS Audit Log Monitoring** on all detectors in every required Region, centrally managed by the GuardDuty administrator.\n- Route findings to alerting/IR workflows\n- Enforce **least privilege** on access to findings and configs\n- Combine with **defense-in-depth**: hardened RBAC and runtime monitoring",
      "Url": "https://hub.prowler.com/check/guardduty_eks_audit_log_enabled"
    }
  },
  "Categories": [
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: guardduty_eks_audit_log_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_eks_audit_log_enabled/guardduty_eks_audit_log_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.guardduty.guardduty_client import guardduty_client


class guardduty_eks_audit_log_enabled(Check):
    def execute(self):
        findings = []
        for detector in guardduty_client.detectors:
            if detector.status:
                report = Check_Report_AWS(metadata=self.metadata(), resource=detector)
                report.status = "FAIL"
                report.status_extended = f"GuardDuty detector {detector.id} does not have EKS Audit Log Monitoring enabled."
                if detector.eks_audit_log_protection:
                    report.status = "PASS"
                    report.status_extended = f"GuardDuty detector {detector.id} has EKS Audit Log Monitoring enabled."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: guardduty_eks_runtime_monitoring_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_eks_runtime_monitoring_enabled/guardduty_eks_runtime_monitoring_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "guardduty_eks_runtime_monitoring_enabled",
  "CheckTitle": "GuardDuty detector has EKS Runtime Monitoring enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "guardduty",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsGuardDutyDetector",
  "Description": "GuardDuty detectors are evaluated for **EKS Runtime Monitoring** being enabled for Amazon EKS. The configuration is at the detector level and relates to visibility into *process, file, and network* activity on EKS nodes and containers.",
  "Risk": "Absent **EKS runtime monitoring**, in-cluster activity is blind to detection. Adversaries can run malware or cryptominers, exfiltrate secrets via pods, tamper with workloads, or pivot to other services, degrading confidentiality, corrupting integrity, and exhausting resources (availability).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/guardduty/latest/ug/runtime-monitoring-configuration.html",
    "https://docs.aws.amazon.com/config/latest/developerguide/guardduty-eks-protection-runtime-enabled.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/guardduty-controls.html#guardduty-7"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws guardduty update-detector --detector-id <detector-id> --features name=EKS_RUNTIME_MONITORING,status=ENABLED",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::GuardDuty::Detector\n    Properties:\n      Enable: true\n      Features:\n        - Name: EKS_RUNTIME_MONITORING   # Critical: selects EKS Runtime Monitoring feature\n          Status: ENABLED                # Critical: enables the feature to pass the check\n```",
      "Other": "1. Open the AWS Console and go to Amazon GuardDuty\n2. In the left pane, select Settings > Runtime monitoring\n3. Under EKS Runtime Monitoring, switch the status to Enabled\n4. Click Save changes",
      "Terraform": "```hcl\nresource \"aws_guardduty_detector\" \"<example_resource_name>\" {\n  enable = true\n\n  features {\n    name   = \"EKS_RUNTIME_MONITORING\"  # Critical: selects EKS Runtime Monitoring feature\n    status = \"ENABLED\"                 # Critical: enables the feature to pass the check\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "- Enable **EKS Runtime Monitoring** with automated agent management across all accounts and clusters\n- Enforce **least privilege** for agents and segment cluster access\n- Integrate findings with response workflows and periodically verify runtime coverage",
      "Url": "https://hub.prowler.com/check/guardduty_eks_runtime_monitoring_enabled"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: guardduty_eks_runtime_monitoring_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_eks_runtime_monitoring_enabled/guardduty_eks_runtime_monitoring_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.guardduty.guardduty_client import guardduty_client


class guardduty_eks_runtime_monitoring_enabled(Check):
    def execute(self):
        findings = []
        for detector in guardduty_client.detectors:
            if detector.status:
                report = Check_Report_AWS(metadata=self.metadata(), resource=detector)
                report.status = "FAIL"
                report.status_extended = f"GuardDuty detector {detector.id} does not have EKS Runtime Monitoring enabled."
                if detector.eks_runtime_monitoring:
                    report.status = "PASS"
                    report.status_extended = f"GuardDuty detector {detector.id} has EKS Runtime Monitoring enabled."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: guardduty_is_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_is_enabled/guardduty_is_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "guardduty_is_enabled",
  "CheckTitle": "GuardDuty detector is enabled and not suspended",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "guardduty",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsGuardDutyDetector",
  "Description": "**Amazon GuardDuty** detector existence and health are evaluated per Region. It identifies where GuardDuty isn't enabled for the account, where a detector has no status, or where a detector is configured but `suspended`.",
  "Risk": "Without active **GuardDuty**, threats in CloudTrail, VPC Flow Logs, DNS, S3, EKS, EBS, and Lambda can go unnoticed. Attackers can exfiltrate data, move laterally, and mine crypto, degrading confidentiality, integrity, and availability-especially in unmonitored Regions.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_settingup.html",
    "https://aws.plainenglish.io/how-to-protect-your-organizations-aws-account-with-aws-guardduty-a1a635c417aa",
    "https://medium.com/swlh/aws-cdk-automating-guardduty-event-notifications-in-all-regions-f0bbcec6077d",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/GuardDuty/guardduty-enabled.html",
    "https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/use-terraform-to-automatically-enable-amazon-guardduty-for-an-organization.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Ensure GuardDuty detector is enabled (not suspended) in the Region\nResources:\n  ExampleGuardDutyDetector:\n    Type: AWS::GuardDuty::Detector\n    Properties:\n      Enable: true  # Critical: enables the detector so GuardDuty is active (not suspended)\n```",
      "Other": "1. Sign in to the AWS Console and open Amazon GuardDuty\n2. Switch to the target AWS Region\n3. If prompted with Get started, click Enable GuardDuty\n4. If GuardDuty is already configured but suspended, go to Settings and click Enable (or Resume) to activate the detector\n5. Repeat in each required Region",
      "Terraform": "```hcl\n# Terraform: Ensure GuardDuty detector is enabled (not suspended) in the Region\nresource \"aws_guardduty_detector\" \"example_resource_name\" {\n  enable = true  # Critical: turns GuardDuty on and ensures it is not suspended\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable and keep **GuardDuty** active in all supported Regions and accounts under a delegated admin. Turn on relevant protection plans and auto-enroll new accounts. Avoid `suspended` detectors, enforce **least privilege** for admins, and integrate findings into response for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/guardduty_is_enabled"
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

---[FILE: guardduty_is_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_is_enabled/guardduty_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.guardduty.guardduty_client import guardduty_client


class guardduty_is_enabled(Check):
    def execute(self):
        findings = []
        for detector in guardduty_client.detectors:
            report = Check_Report_AWS(metadata=self.metadata(), resource=detector)
            report.status = "PASS"
            report.status_extended = f"GuardDuty detector {detector.id} enabled."

            if not detector.enabled_in_account:
                report.status = "FAIL"
                report.status_extended = "GuardDuty is not enabled."
            elif detector.status is None:
                report.status = "FAIL"
                report.status_extended = (
                    f"GuardDuty detector {detector.id} not configured."
                )
            elif not detector.status:
                report.status = "FAIL"
                report.status_extended = (
                    f"GuardDuty detector {detector.id} configured but suspended."
                )

            if report.status == "FAIL" and (
                guardduty_client.audit_config.get("mute_non_default_regions", False)
                and not detector.region == guardduty_client.region
            ):
                report.muted = True

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: guardduty_is_enabled_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_is_enabled/guardduty_is_enabled_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.guardduty.guardduty_client import guardduty_client


def fixer(region):
    """
    Enable GuardDuty in a region. Requires the guardduty:CreateDetector permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "guardduty:CreateDetector",
                "Resource": "*"
            }
        ]
    }
    Args:
        region (str): AWS region
    Returns:
        bool: True if GuardDuty is enabled, False otherwise
    """
    try:
        regional_client = guardduty_client.regional_clients[region]
        regional_client.create_detector(Enable=True)
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: guardduty_lambda_protection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_lambda_protection_enabled/guardduty_lambda_protection_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "guardduty_lambda_protection_enabled",
  "CheckTitle": "GuardDuty detector has Lambda Protection enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "guardduty",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsGuardDutyDetector",
  "Description": "**Amazon GuardDuty detectors** with **Lambda Protection** enabled analyze **Lambda invocation network activity logs** across your account.\n\nEvaluation determines whether the detector has `Lambda Protection` turned on.",
  "Risk": "Without **Lambda Protection**, Lambda network traffic is uninspected, enabling:\n- **C2 callbacks** and data exfiltration (confidentiality)\n- Malicious code altering data or configs (integrity)\n- Lateral movement or abuse causing disruption (availability)",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/guardduty-controls.html#guardduty-6",
    "https://docs.aws.amazon.com/guardduty/latest/ug/configure-lambda-protection-standalone-acc.html",
    "https://docs.aws.amazon.com/guardduty/latest/ug/lambda-protection.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws guardduty update-detector --detector-id <detector-id> --features '[{\"Name\":\"LAMBDA_NETWORK_LOGS\",\"Status\":\"ENABLED\"}]'",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::GuardDuty::Detector\n    Properties:\n      Enable: true\n      Features:\n        - Name: LAMBDA_NETWORK_LOGS  # Critical: selects Lambda Protection feature\n          Status: ENABLED            # Critical: enables Lambda Protection\n```",
      "Other": "1. Open the AWS Console and go to GuardDuty\n2. In the left pane, select Settings > Lambda Protection\n3. Click Enable\n4. Click Confirm to save",
      "Terraform": "```hcl\nresource \"aws_guardduty_detector\" \"<example_resource_name>\" {\n  enable = true\n  features {\n    name   = \"LAMBDA_NETWORK_LOGS\"  # Critical: selects Lambda Protection feature\n    status = \"ENABLED\"               # Critical: enables Lambda Protection\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Lambda Protection** on all detectors in every active Region and account.\n\nApply **least privilege** to Lambda roles, restrict egress with network controls, and integrate findings with alerting and response for **defense in depth**. *In multi-account setups*, manage centrally for consistent coverage.",
      "Url": "https://hub.prowler.com/check/guardduty_lambda_protection_enabled"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: guardduty_lambda_protection_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_lambda_protection_enabled/guardduty_lambda_protection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.guardduty.guardduty_client import guardduty_client


class guardduty_lambda_protection_enabled(Check):
    def execute(self):
        findings = []
        for detector in guardduty_client.detectors:
            if detector.status:
                report = Check_Report_AWS(metadata=self.metadata(), resource=detector)
                report.status = "FAIL"
                report.status_extended = f"GuardDuty detector {detector.id} does not have Lambda Protection enabled."
                if detector.lambda_protection:
                    report.status = "PASS"
                    report.status_extended = f"GuardDuty detector {detector.id} has Lambda Protection enabled."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: guardduty_no_high_severity_findings.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_no_high_severity_findings/guardduty_no_high_severity_findings.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "guardduty_no_high_severity_findings",
  "CheckTitle": "GuardDuty detector has no high severity findings",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "TTPs",
    "Unusual Behaviors"
  ],
  "ServiceName": "guardduty",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsGuardDutyDetector",
  "Description": "**GuardDuty detectors** are evaluated for the presence of **High-severity findings**. This surfaces whether any detector currently has findings labeled `High` by GuardDuty.",
  "Risk": "Unresolved **High findings** often signal active compromise, enabling:\n- Data exfiltration and unauthorized access (confidentiality)\n- Privilege escalation and tampering (integrity)\n- Disruption via malware/crypto-mining (availability)\n\nAttackers can pivot laterally and persist if not contained.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings.html",
    "https://docs.aws.amazon.com/prescriptive-guidance/latest/vulnerability-management/assess-and-prioritize-security-findings.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/GuardDuty/findings.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS console and open Amazon GuardDuty\n2. Use the Region selector to choose a Region where GuardDuty is enabled\n3. Go to Findings and filter: Severity = High (7-8.9), Archived status = Not archived\n4. Select all results, click Actions > Archive\n5. Repeat steps 2-4 for every Region with GuardDuty enabled\n6. Confirm there are 0 active High severity findings in each Region",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Treat **High findings** as incidents.\n\n- Prioritize triage and containment; isolate affected resources, rotate secrets\n- Automate alerting and response with playbooks; integrate into IR\n- Enforce **least privilege**, network segmentation, and hardened baselines\n- Continuously tune detections and remove unused access to prevent recurrence",
      "Url": "https://hub.prowler.com/check/guardduty_no_high_severity_findings"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: guardduty_no_high_severity_findings.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_no_high_severity_findings/guardduty_no_high_severity_findings.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.guardduty.guardduty_client import guardduty_client


class guardduty_no_high_severity_findings(Check):
    def execute(self):
        findings = []
        for detector in guardduty_client.detectors:
            if detector.id and detector.enabled_in_account:
                report = Check_Report_AWS(metadata=self.metadata(), resource=detector)
                report.status = "PASS"
                report.status_extended = f"GuardDuty detector {detector.id} does not have high severity findings."
                if len(detector.findings) > 0:
                    report.status = "FAIL"
                    report.status_extended = f"GuardDuty detector {detector.id} has {str(len(detector.findings))} high severity findings."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: guardduty_rds_protection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_rds_protection_enabled/guardduty_rds_protection_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "guardduty_rds_protection_enabled",
  "CheckTitle": "GuardDuty detector has RDS Protection enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Credential Access"
  ],
  "ServiceName": "guardduty",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsGuardDutyDetector",
  "Description": "Active **Amazon GuardDuty detectors** are assessed for **RDS Protection** being enabled, allowing analysis of RDS and Aurora login activity to profile and flag anomalous access patterns.",
  "Risk": "Without **RDS Protection**, anomalous database logins can go unnoticed. Attackers using **stolen** or **brute-forced** credentials may access data, alter schemas, or pivot via the DB, impacting **confidentiality** and **integrity**, and potentially **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/guardduty-controls.html#guardduty-9",
    "https://docs.aws.amazon.com/guardduty/latest/ug/rds-protection.html",
    "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/guard-duty-rds-protection.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws guardduty update-detector --detector-id <detector-id> --features Name=RDS_LOGIN_EVENTS,Status=ENABLED",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::GuardDuty::Detector\n    Properties:\n      Enable: true\n      Features:\n        - Name: RDS_LOGIN_EVENTS  # critical: selects GuardDuty RDS Protection feature\n          Status: ENABLED         # critical: turns RDS Protection on\n```",
      "Other": "1. In the AWS Console, open Amazon GuardDuty\n2. Go to Settings (or Protection plans/Features)\n3. Find RDS Protection (RDS login events) and click Enable\n4. Save changes\n5. If using Organizations, perform this in the delegated GuardDuty administrator account",
      "Terraform": "```hcl\nresource \"aws_guardduty_detector\" \"<example_resource_name>\" {\n  enable = true\n  features {\n    name   = \"RDS_LOGIN_EVENTS\"  # critical: GuardDuty RDS Protection feature\n    status = \"ENABLED\"            # critical: enable the feature\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **GuardDuty RDS Protection** across all accounts and Regions.\n- Enforce **least privilege** for DB users and rotate credentials\n- Restrict network exposure to databases\n- Integrate findings with alerting and incident response for rapid containment",
      "Url": "https://hub.prowler.com/check/guardduty_rds_protection_enabled"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: guardduty_rds_protection_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_rds_protection_enabled/guardduty_rds_protection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.guardduty.guardduty_client import guardduty_client


class guardduty_rds_protection_enabled(Check):
    def execute(self):
        findings = []
        for detector in guardduty_client.detectors:
            if detector.status:
                report = Check_Report_AWS(metadata=self.metadata(), resource=detector)
                report.status = "FAIL"
                report.status_extended = (
                    "GuardDuty detector does not have RDS Protection enabled."
                )
                if detector.rds_protection:
                    report.status = "PASS"
                    report.status_extended = (
                        "GuardDuty detector has RDS Protection enabled."
                    )
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: guardduty_s3_protection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_s3_protection_enabled/guardduty_s3_protection_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "guardduty_s3_protection_enabled",
  "CheckTitle": "GuardDuty detector has S3 Protection enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exfiltration"
  ],
  "ServiceName": "guardduty",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsGuardDutyDetector",
  "Description": "Amazon GuardDuty detectors are evaluated for **S3 Protection**, which analyzes CloudTrail S3 data events to monitor **object-level API activity** (`GetObject`, `PutObject`, `DeleteObject`) across S3 buckets in the account and Region.",
  "Risk": "Without S3 Protection, **object-level S3 activity** isn't analyzed, enabling:\n- **Exfiltration** via mass reads/copies\n- **Destructive deletes**\n- **Policy/ACL tampering**\n\nUndetected actions degrade data confidentiality, integrity, and availability.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.amazonaws.cn/en_us/guardduty/latest/ug/guardduty_finding-types-s3.html",
    "https://docs.aws.amazon.com/guardduty/latest/ug/s3_detection.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/GuardDuty/enable-s3-protection.html",
    "https://docs.aws.amazon.com/guardduty/latest/ug/s3-protection.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/guardduty-controls.html#guardduty-10"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws guardduty update-detector --detector-id <detector-id> --data-sources S3Logs={Enable=true}",
      "NativeIaC": "```yaml\n# CloudFormation: Enable S3 Protection on a GuardDuty detector\nResources:\n  <example_resource_name>:\n    Type: AWS::GuardDuty::Detector\n    Properties:\n      Enable: true\n      DataSources:\n        S3Logs:\n          Enable: true  # Critical: Enables GuardDuty S3 Protection\n```",
      "Other": "1. Open the AWS Management Console and go to GuardDuty\n2. In the left menu, select Settings\n3. Find the S3 Protection section and click Enable (or toggle On)\n4. Click Save",
      "Terraform": "```hcl\n# Enable S3 Protection on a GuardDuty detector\nresource \"aws_guardduty_detector\" \"<example_resource_name>\" {\n  enable = true\n\n  datasources {\n    s3_logs {\n      enable = true  # Critical: Enables GuardDuty S3 Protection\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **S3 Protection** across all accounts and Regions to add **defense in depth** for S3. Apply **least privilege** to IAM and bucket policies, keep **Block Public Access** enforced, integrate findings with alerting, and regularly review anomalies to prevent data loss and tampering.",
      "Url": "https://hub.prowler.com/check/guardduty_s3_protection_enabled"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: guardduty_s3_protection_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/guardduty/guardduty_s3_protection_enabled/guardduty_s3_protection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.guardduty.guardduty_client import guardduty_client


class guardduty_s3_protection_enabled(Check):
    def execute(self):
        findings = []
        for detector in guardduty_client.detectors:
            if detector.status:
                report = Check_Report_AWS(metadata=self.metadata(), resource=detector)
                report.status = "FAIL"
                report.status_extended = (
                    "GuardDuty detector does not have S3 Protection enabled."
                )
                if detector.s3_protection:
                    report.status = "PASS"
                    report.status_extended = (
                        "GuardDuty detector has S3 Protection enabled."
                    )
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_client.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_client.py

```python
from prowler.providers.aws.services.iam.iam_service import IAM
from prowler.providers.common.provider import Provider

iam_client = IAM(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
