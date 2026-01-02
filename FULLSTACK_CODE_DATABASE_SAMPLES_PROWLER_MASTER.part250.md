---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 250
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 250 of 867)

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

---[FILE: cloudtrail_s3_dataevents_write_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_s3_dataevents_write_enabled/cloudtrail_s3_dataevents_write_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_s3_dataevents_write_enabled",
  "CheckTitle": "CloudTrail trail records all S3 object-level API operations for all buckets",
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
  "Description": "**CloudTrail trails** include **S3 object-level data events** for **write (or all) operations** across **all current and future buckets**, via classic or advanced selectors. This records actions like `PutObject`, `DeleteObject`, and multipart uploads at the object level.",
  "Risk": "Without object-level write logging, unauthorized or accidental changes and deletions can go unobserved, undermining data **integrity** and **availability**. Forensics lose visibility into who modified or removed objects, hindering detection of ransomware, rogue automation, or insider tampering.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html",
    "https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-cloudtrail-logging-for-s3.html",
    "https://www.go2share.net/article/s3-bucket-logging",
    "https://docs.amazonaws.cn/en_us/AmazonS3/latest/userguide/cloudtrail-logging-s3-info.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/s3-controls.html#s3-22"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudtrail put-event-selectors --trail-name <example_resource_name> --event-selectors '[{\"ReadWriteType\":\"WriteOnly\",\"DataResources\":[{\"Type\":\"AWS::S3::Object\",\"Values\":[\"arn:aws:s3\"]}]}]'",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudTrail::Trail\n    Properties:\n      TrailName: <example_resource_name>\n      S3BucketName: <example_resource_name>\n      EventSelectors:\n        - ReadWriteType: WriteOnly\n          DataResources:\n            - Type: AWS::S3::Object\n              Values:\n                - arn:aws:s3  # Critical: enables S3 object-level write data events for all buckets, fixing the check\n```",
      "Other": "1. In the AWS Console, open CloudTrail and go to Trails\n2. Select <your trail> and click Edit under Data events\n3. For Data event source, choose S3\n4. Select All current and future S3 buckets\n5. Check Write events (or All events)\n6. Click Save changes",
      "Terraform": "```hcl\nresource \"aws_cloudtrail\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  s3_bucket_name = \"<example_resource_name>\"\n\n  event_selector {\n    read_write_type = \"WriteOnly\"\n    data_resource {\n      type   = \"AWS::S3::Object\"\n      values = [\"arn:aws:s3\"]  # Critical: logs S3 object-level write events for all buckets to pass the check\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **CloudTrail S3 data events** for object-level **write** (and *optionally* read) across all buckets on a multi-Region trail. Apply **least privilege** to log storage, set **lifecycle** retention, and integrate alerts. Use **advanced selectors** to target sensitive buckets/operations for cost control and **defense in depth**.",
      "Url": "https://hub.prowler.com/check/cloudtrail_s3_dataevents_write_enabled"
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

---[FILE: cloudtrail_s3_dataevents_write_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_s3_dataevents_write_enabled/cloudtrail_s3_dataevents_write_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)
from prowler.providers.aws.services.s3.s3_client import s3_client


class cloudtrail_s3_dataevents_write_enabled(Check):
    def execute(self):
        findings = []
        if cloudtrail_client.trails is not None:
            for trail in cloudtrail_client.trails.values():
                for data_event in trail.data_events:
                    # Classic event selectors
                    if not data_event.is_advanced:
                        # Check if trail has a data event for all S3 Buckets for write
                        if (
                            data_event.event_selector["ReadWriteType"] == "All"
                            or data_event.event_selector["ReadWriteType"] == "WriteOnly"
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
                    # Advanced event selectors
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

---[FILE: cloudtrail_threat_detection_enumeration.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_threat_detection_enumeration/cloudtrail_threat_detection_enumeration.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_threat_detection_enumeration",
  "CheckTitle": "CloudTrail logs show no potential enumeration activity",
  "CheckType": [
    "TTPs/Discovery",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Unusual Behaviors/User"
  ],
  "ServiceName": "cloudtrail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsCloudTrailTrail",
  "Description": "**CloudTrail activity** is analyzed for AWS identities executing a broad mix of discovery APIs like `List*`, `Describe*`, and `Get*` within a recent time window.\n\nAn identity exceeding a configurable ratio of these actions indicates potential enumeration behavior by that principal.",
  "Risk": "Concentrated discovery activity signals **reconnaissance** with valid credentials. Adversaries can map assets and policies to enable **privilege escalation**, target data stores for **exfiltration** (confidentiality), and identify services to disrupt (availability), supporting stealthy lateral movement.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://medium.com/falconforce/falconfriday-detecting-enumeration-in-aws-0xff25-orangecon-25-edition-4aee83651088",
    "https://www.elastic.co/guide/en/security/8.19/aws-discovery-api-calls-via-cli-from-a-single-resource.html",
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html#cloudtrail-concepts-logging-data-events",
    "https://aws.plainenglish.io/aws-cloudtrail-event-cheatsheet-a-detection-engineers-guide-to-critical-api-calls-part-1-04fb1588556f",
    "https://support.icompaas.com/support/solutions/articles/62000233455-ensure-there-are-no-potential-enumeration-threats-in-cloudtrail-"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws iam update-access-key --user-name <USER_NAME> --access-key-id <ACCESS_KEY_ID> --status Inactive",
      "NativeIaC": "```yaml\n# CloudFormation: deny common enumeration APIs for a specific IAM user\nResources:\n  DenyEnumerationPolicy:\n    Type: AWS::IAM::Policy\n    Properties:\n      PolicyName: deny-enumeration\n      PolicyDocument:\n        Version: \"2012-10-17\"\n        Statement:\n          - Effect: Deny  # CRITICAL: blocks typical enumeration calls\n            Action:\n              - ec2:Describe*   # CRITICAL: deny EC2 describe APIs\n              - iam:List*       # CRITICAL: deny IAM list APIs\n              - s3:List*        # CRITICAL: deny S3 list APIs\n              - s3:Get*         # CRITICAL: deny S3 get APIs (e.g., GetBucketAcl)\n            Resource: \"*\"\n      Users:\n        - \"<example_resource_name>\"  # CRITICAL: target the enumerating user\n```",
      "Other": "1. In AWS Console, go to IAM > Users and open the user shown in the alert (ARN in the finding)\n2. Select the Security credentials tab\n3. For each active Access key, click Deactivate to set status to Inactive\n4. If the activity came from an EC2 instance role: go to EC2 > Instances > select the instance > Security > IAM role > Detach IAM role\n5. Re-run the check to confirm no new enumeration events occur",
      "Terraform": "```hcl\n# Deny common enumeration APIs for a specific IAM user\nresource \"aws_iam_user_policy\" \"<example_resource_name>\" {\n  name = \"deny-enumeration\"\n  user = \"<example_user_name>\"\n\n  policy = jsonencode({\n    Version = \"2012-10-17\",\n    Statement = [{\n      Effect   = \"Deny\", # CRITICAL: blocks typical enumeration calls\n      Action   = [\n        \"ec2:Describe*\",   # CRITICAL\n        \"iam:List*\",       # CRITICAL\n        \"s3:List*\",        # CRITICAL\n        \"s3:Get*\"          # CRITICAL\n      ],\n      Resource = \"*\"\n    }]\n  })\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** to limit `List*`/`Describe*`/`Get*` to necessary resources and roles; use **separation of duties**.\n- Enforce MFA and short-lived sessions\n- Use **SCPs** to curb unnecessary discovery\n- Baseline expected reads and alert on spikes as **defense in depth**",
      "Url": "https://hub.prowler.com/check/cloudtrail_threat_detection_enumeration"
    }
  },
  "Categories": [
    "threat-detection"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_threat_detection_enumeration.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_threat_detection_enumeration/cloudtrail_threat_detection_enumeration.py

```python
import json

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)

default_threat_detection_enumeration_actions = [
    "CreateIndex",
    "DescribeAccessEntry",
    "DescribeAccountAttributes",
    "DescribeAvailabilityZones",
    "DescribeBundleTasks",
    "DescribeCarrierGateways",
    "DescribeClientVpnRoutes",
    "DescribeCluster",
    "DescribeDhcpOptions",
    "DescribeFlowLogs",
    "DescribeImages",
    "DescribeInstanceAttribute",
    "DescribeInstanceInformation",
    "DescribeInstanceTypes",
    "DescribeInstances",
    "DescribeInstances",
    "DescribeKeyPairs",
    "DescribeLogGroups",
    "DescribeLogStreams",
    "DescribeOrganization",
    "DescribeRegions",
    "DescribeSecurityGroups",
    "DescribeSnapshotAttribute",
    "DescribeSnapshotTierStatus",
    "DescribeSubscriptionFilters",
    "DescribeTransitGatewayMulticastDomains",
    "DescribeVolumes",
    "DescribeVolumesModifications",
    "DescribeVpcEndpointConnectionNotifications",
    "DescribeVpcs",
    "GetAccount",
    "GetAccountAuthorizationDetails",
    "GetAccountSendingEnabled",
    "GetBucketAcl",
    "GetBucketLogging",
    "GetBucketPolicy",
    "GetBucketReplication",
    "GetBucketVersioning",
    "GetCallerIdentity",
    "GetCertificate",
    "GetConsoleScreenshot",
    "GetCostAndUsage",
    "GetDetector",
    "GetEbsDefaultKmsKeyId",
    "GetEbsEncryptionByDefault",
    "GetFindings",
    "GetFlowLogsIntegrationTemplate",
    "GetIdentityVerificationAttributes",
    "GetInstances",
    "GetIntrospectionSchema",
    "GetLaunchTemplateData",
    "GetLaunchTemplateData",
    "GetLogRecord",
    "GetParameters",
    "GetPolicyVersion",
    "GetPublicAccessBlock",
    "GetQueryResults",
    "GetRegions",
    "GetSMSAttributes",
    "GetSMSSandboxAccountStatus",
    "GetSendQuota",
    "GetTransitGatewayRouteTableAssociations",
    "GetUserPolicy",
    "HeadObject",
    "ListAccessKeys",
    "ListAccounts",
    "ListAllMyBuckets",
    "ListAssociatedAccessPolicies",
    "ListAttachedUserPolicies",
    "ListClusters",
    "ListDetectors",
    "ListDomains",
    "ListFindings",
    "ListHostedZones",
    "ListIPSets",
    "ListIdentities",
    "ListInstanceProfiles",
    "ListObjects",
    "ListOrganizationalUnitsForParent",
    "ListOriginationNumbers",
    "ListPolicyVersions",
    "ListResources",
    "ListRoles",
    "ListRoles",
    "ListRules",
    "ListServiceQuotas",
    "ListSubscriptions",
    "ListTargetsByRule",
    "ListTopics",
    "ListUsers",
    "LookupEvents",
    "Search",
]


class cloudtrail_threat_detection_enumeration(Check):
    def execute(self):
        findings = []
        threshold = cloudtrail_client.audit_config.get(
            "threat_detection_enumeration_threshold", 0.3
        )
        threat_detection_minutes = cloudtrail_client.audit_config.get(
            "threat_detection_enumeration_minutes", 1440
        )
        enumeration_actions = cloudtrail_client.audit_config.get(
            "threat_detection_enumeration_actions",
            default_threat_detection_enumeration_actions,
        )
        potential_enumeration = {}
        found_potential_enumeration = False
        multiregion_trail = None
        # Check if any trail is multi-region so we only need to check once
        for trail in cloudtrail_client.trails.values():
            if trail.is_multiregion:
                multiregion_trail = trail
                break
        trails_to_scan = (
            cloudtrail_client.trails.values()
            if not multiregion_trail
            else [multiregion_trail]
        )
        for trail in trails_to_scan:
            for event_name in enumeration_actions:
                for event_log in cloudtrail_client._lookup_events(
                    trail=trail,
                    event_name=event_name,
                    minutes=threat_detection_minutes,
                ):
                    event_log = json.loads(event_log["CloudTrailEvent"])
                    if (
                        "arn" in event_log["userIdentity"]
                    ):  # Ignore event logs without ARN since they are AWS services
                        if (
                            event_log["userIdentity"]["arn"],
                            event_log["userIdentity"]["type"],
                        ) not in potential_enumeration:
                            potential_enumeration[
                                (
                                    event_log["userIdentity"]["arn"],
                                    event_log["userIdentity"]["type"],
                                )
                            ] = set()
                        potential_enumeration[
                            (
                                event_log["userIdentity"]["arn"],
                                event_log["userIdentity"]["type"],
                            )
                        ].add(event_name)

        for aws_identity, actions in potential_enumeration.items():
            identity_threshold = round(len(actions) / len(enumeration_actions), 2)
            aws_identity_type = aws_identity[1]
            aws_identity_arn = aws_identity[0]
            if len(actions) / len(enumeration_actions) > threshold:
                found_potential_enumeration = True
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=cloudtrail_client.trails
                )
                report.region = cloudtrail_client.region
                report.resource_id = aws_identity_arn.split("/")[-1]
                report.resource_arn = aws_identity_arn
                report.status = "FAIL"
                report.status_extended = f"Potential enumeration attack detected from AWS {aws_identity_type} {aws_identity_arn.split('/')[-1]} with a threshold of {identity_threshold}."
                findings.append(report)
        if not found_potential_enumeration:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=cloudtrail_client.trails
            )
            report.region = cloudtrail_client.region
            report.resource_id = cloudtrail_client.audited_account
            report.resource_arn = cloudtrail_client._get_trail_arn_template(
                cloudtrail_client.region
            )
            report.status = "PASS"
            report.status_extended = "No potential enumeration attack detected."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_threat_detection_enumeration_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_threat_detection_enumeration/cloudtrail_threat_detection_enumeration_fixer.py

```python
import json

from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.iam_client import iam_client


def fixer(resource_arn: str) -> bool:
    """
    Restricts access to a compromised AWS entity by attaching a deny-all inline policy to the user or role.

    Requires the following permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "iam:PutUserPolicy",
                    "iam:PutRolePolicy",
                ],
                "Resource": "*"
            }
        ]
    }

    Args:
        resource_arn (str): The ARN of the compromised AWS entity (IAM User or Role).

    Returns:
        bool: True if the fix was applied successfully, False otherwise.
    """
    try:
        if ":user/" in resource_arn:
            entity_type = "user"
            entity_name = resource_arn.split("/")[-1]
        elif ":role/" in resource_arn:
            entity_type = "role"
            entity_name = resource_arn.split("/")[-1]
        else:
            return False

        deny_policy = {
            "Version": "2012-10-17",
            "Statement": [{"Effect": "Deny", "Action": "*", "Resource": "*"}],
        }

        policy_name = "DenyAllAccess"

        if entity_type == "user":
            iam_client.client.put_user_policy(
                UserName=entity_name,
                PolicyName=policy_name,
                PolicyDocument=json.dumps(deny_policy),
            )
            logger.info(f"Applied Deny policy to user {entity_name}")

        elif entity_type == "role":
            iam_client.client.put_role_policy(
                RoleName=entity_name,
                PolicyName=policy_name,
                PolicyDocument=json.dumps(deny_policy),
            )
            logger.info(f"Applied Deny policy to role {entity_name}")

        return True

    except Exception as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_threat_detection_llm_jacking.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_threat_detection_llm_jacking/cloudtrail_threat_detection_llm_jacking.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_threat_detection_llm_jacking",
  "CheckTitle": "No potential LLM jacking activity detected in CloudTrail",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "TTPs/Discovery",
    "TTPs/Execution",
    "TTPs/Defense Evasion",
    "Effects/Resource Consumption",
    "Unusual Behaviors/User"
  ],
  "ServiceName": "cloudtrail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsCloudTrailTrail",
  "Description": "**CloudTrail Bedrock activity** is analyzed per identity for a high diversity of LLM-related API calls (e.g., `InvokeModel`, `InvokeModelWithResponseStream`, `GetFoundationModelAvailability`). *If an identity's share of these actions exceeds a configured threshold over a recent window*, it is surfaced as potential **LLM-jacking** behavior.",
  "Risk": "Such patterns suggest **stolen credential** abuse to drive LLM usage.\n- Availability: cost exhaustion and service disruption\n- Confidentiality: leakage of prompts/outputs and model settings\n- Integrity: misuse of permissions for broader access\nAttackers may use reverse proxies to resell access and obfuscate sources.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://furkangungor.medium.com/automating-anomaly-detection-in-aws-cloudtrail-logs-4efb2ad9b958",
    "https://help.sumologic.com/docs/integrations/amazon-aws/amazon-bedrock/",
    "https://dzone.com/articles/ai-powered-aws-cloudtrail-analysis-strands-agent-bedrock"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation SCP that blocks all Amazon Bedrock actions to stop LLM jacking\nResources:\n  <example_resource_name>:\n    Type: AWS::Organizations::Policy\n    Properties:\n      Name: <example_resource_name>\n      Type: SERVICE_CONTROL_POLICY\n      TargetIds:\n        - \"<example_resource_id>\"  # CRITICAL: Attach SCP to the root/OU/account to enforce the deny\n      Content:\n        Version: \"2012-10-17\"\n        Statement:\n          - Sid: DenyBedrock\n            Effect: Deny\n            Action: \"bedrock:*\"  # CRITICAL: Denies all Bedrock APIs (Invoke/Converse/list/entitlements/etc.)\n            Resource: \"*\"        # CRITICAL: Apply deny to all resources\n```",
      "Other": "1. In the AWS Console, go to Organizations > Policies > Service control policies\n2. Click Create policy\n3. Set Name to <example_resource_name>\n4. In Policy, paste a deny for Bedrock:\n   {\n     \"Version\": \"2012-10-17\",\n     \"Statement\": [{\"Sid\":\"DenyBedrock\",\"Effect\":\"Deny\",\"Action\":\"bedrock:*\",\"Resource\":\"*\"}]\n   }\n5. Save the policy and click Attach\n6. Select the target (Root, OU, or the affected account ID <example_resource_id>) and attach the policy\n7. Wait for propagation; no further Bedrock calls will occur, and the finding will clear after the detection window elapses",
      "Terraform": "```hcl\n# SCP denying all Amazon Bedrock actions; attach it to the root/OU/account to halt LLM jacking\nresource \"aws_organizations_policy\" \"main\" {\n  name = \"<example_resource_name>\"\n  type = \"SERVICE_CONTROL_POLICY\"\n\n  content = jsonencode({\n    Version   = \"2012-10-17\"\n    Statement = [{\n      Sid      = \"DenyBedrock\"\n      Effect   = \"Deny\"\n      Action   = \"bedrock:*\"   // CRITICAL: blocks all Bedrock APIs (prevents further suspicious activity)\n      Resource = \"*\"            // CRITICAL: deny across all resources\n    }]\n  })\n}\n\nresource \"aws_organizations_policy_attachment\" \"attach\" {\n  policy_id = aws_organizations_policy.main.id\n  target_id = \"<example_resource_id>\"  // CRITICAL: attach to the affected account/OU/root to enforce the deny\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** to Bedrock; restrict `Invoke*` only to required roles and deny broadly via **SCPs** where unused. Enforce **MFA** and short-lived creds; rotate/remove exposed keys. Enable **model invocation logging** and budgets/quotas. Continuously monitor for Bedrock enumeration plus invoke bursts. Use **defense in depth** across identities and networks.",
      "Url": "https://hub.prowler.com/check/cloudtrail_threat_detection_llm_jacking"
    }
  },
  "Categories": [
    "threat-detection",
    "gen-ai"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_threat_detection_llm_jacking.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_threat_detection_llm_jacking/cloudtrail_threat_detection_llm_jacking.py

```python
import json

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)

default_threat_detection_llm_jacking_actions = [
    "PutUseCaseForModelAccess",
    "PutFoundationModelEntitlement",
    "PutModelInvocationLoggingConfiguration",
    "CreateFoundationModelAgreement",
    "InvokeModel",
    "InvokeModelWithResponseStream",
    "GetUseCaseForModelAccess",
    "GetModelInvocationLoggingConfiguration",
    "GetFoundationModelAvailability",
    "ListFoundationModelAgreementOffers",
    "ListFoundationModels",
    "ListProvisionedModelThroughputs",
    "SearchAgreements",
    "AcceptAgreementRequest",
]


class cloudtrail_threat_detection_llm_jacking(Check):
    def execute(self):
        findings = []
        threshold = cloudtrail_client.audit_config.get(
            "threat_detection_llm_jacking_threshold", 0.4
        )
        threat_detection_minutes = cloudtrail_client.audit_config.get(
            "threat_detection_llm_jacking_minutes", 1440
        )
        llm_jacking_actions = cloudtrail_client.audit_config.get(
            "threat_detection_llm_jacking_actions",
            default_threat_detection_llm_jacking_actions,
        )
        potential_llm_jacking = {}
        found_potential_llm_jacking = False
        multiregion_trail = None
        # Check if any trail is multi-region so we only need to check once
        for trail in cloudtrail_client.trails.values():
            if trail.is_multiregion:
                multiregion_trail = trail
                break
        trails_to_scan = (
            cloudtrail_client.trails.values()
            if not multiregion_trail
            else [multiregion_trail]
        )
        for trail in trails_to_scan:
            for event_name in llm_jacking_actions:
                for event_log in cloudtrail_client._lookup_events(
                    trail=trail,
                    event_name=event_name,
                    minutes=threat_detection_minutes,
                ):
                    event_log = json.loads(event_log["CloudTrailEvent"])
                    if (
                        "arn" in event_log["userIdentity"]
                    ):  # Ignore event logs without ARN since they are AWS services
                        if (
                            event_log["userIdentity"]["arn"],
                            event_log["userIdentity"]["type"],
                        ) not in potential_llm_jacking:
                            potential_llm_jacking[
                                (
                                    event_log["userIdentity"]["arn"],
                                    event_log["userIdentity"]["type"],
                                )
                            ] = set()
                        potential_llm_jacking[
                            (
                                event_log["userIdentity"]["arn"],
                                event_log["userIdentity"]["type"],
                            )
                        ].add(event_name)

        for aws_identity, actions in potential_llm_jacking.items():
            identity_threshold = round(len(actions) / len(llm_jacking_actions), 2)
            aws_identity_type = aws_identity[1]
            aws_identity_arn = aws_identity[0]
            if len(actions) / len(llm_jacking_actions) > threshold:
                found_potential_llm_jacking = True
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=cloudtrail_client.trails
                )
                report.region = cloudtrail_client.region
                report.resource_id = aws_identity_arn.split("/")[-1]
                report.resource_arn = aws_identity_arn
                report.status = "FAIL"
                report.status_extended = f"Potential LLM Jacking attack detected from AWS {aws_identity_type} {aws_identity_arn.split('/')[-1]} with a threshold of {identity_threshold}."
                findings.append(report)
        if not found_potential_llm_jacking:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=cloudtrail_client.trails
            )
            report.region = cloudtrail_client.region
            report.resource_id = cloudtrail_client.audited_account
            report.resource_arn = cloudtrail_client._get_trail_arn_template(
                cloudtrail_client.region
            )
            report.status = "PASS"
            report.status_extended = "No potential LLM Jacking attack detected."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_threat_detection_llm_jacking_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_threat_detection_llm_jacking/cloudtrail_threat_detection_llm_jacking_fixer.py

```python
import json

from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.iam_client import iam_client


def fixer(resource_arn: str) -> bool:
    """
    Restricts access to a compromised AWS entity by attaching a deny-all inline policy to the user or role.

    Requires the following permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "iam:PutUserPolicy",
                    "iam:PutRolePolicy",
                ],
                "Resource": "*"
            }
        ]
    }

    Args:
        resource_arn (str): The ARN of the compromised AWS entity (IAM User or Role).

    Returns:
        bool: True if the fix was applied successfully, False otherwise.
    """
    try:
        if ":user/" in resource_arn:
            entity_type = "user"
            entity_name = resource_arn.split("/")[-1]
        elif ":role/" in resource_arn:
            entity_type = "role"
            entity_name = resource_arn.split("/")[-1]
        else:
            return False

        deny_policy = {
            "Version": "2012-10-17",
            "Statement": [{"Effect": "Deny", "Action": "*", "Resource": "*"}],
        }

        policy_name = "DenyAllAccess"

        if entity_type == "user":
            iam_client.client.put_user_policy(
                UserName=entity_name,
                PolicyName=policy_name,
                PolicyDocument=json.dumps(deny_policy),
            )
            logger.info(f"Applied Deny policy to user {entity_name}")

        elif entity_type == "role":
            iam_client.client.put_role_policy(
                RoleName=entity_name,
                PolicyName=policy_name,
                PolicyDocument=json.dumps(deny_policy),
            )
            logger.info(f"Applied Deny policy to role {entity_name}")

        return True

    except Exception as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_threat_detection_privilege_escalation.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_threat_detection_privilege_escalation/cloudtrail_threat_detection_privilege_escalation.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudtrail_threat_detection_privilege_escalation",
  "CheckTitle": "No potential privilege escalation activity detected in CloudTrail",
  "CheckType": [
    "TTPs/Privilege Escalation",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis"
  ],
  "ServiceName": "cloudtrail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsCloudTrailTrail",
  "Description": "**CloudTrail** activity is analyzed for **identities** executing high-risk actions linked to **privilege escalation** (e.g., `Attach*Policy`, `PassRole`, `AssumeRole`, `CreateAccessKey`). Identities exceeding a configurable share of such events within a *recent time window* are highlighted for investigation.",
  "Risk": "Escalation patterns can grant elevated entitlements, enabling:\n- Confidentiality loss via unauthorized data/secret access\n- Integrity compromise by changing IAM policies/roles\n- Availability impact by tampering with logging or resources\nThis also facilitates lateral movement and persistence.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://rhinosecuritylabs.com/aws/aws-privilege-escalation-methods-mitigation/",
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html#cloudtrail-concepts-logging-data-events",
    "https://signmycode.com/blog/what-is-privilege-escalation-in-aws-recommendations-to-prevent-it"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Organization SCP to block common IAM privilege-escalation actions\nResources:\n  <example_resource_name>:\n    Type: AWS::Organizations::Policy\n    Properties:\n      Name: deny-iam-privesc\n      Type: SERVICE_CONTROL_POLICY\n      # Critical: This SCP denies risky IAM actions often used for privilege escalation\n      # Explanation: Denying these actions organization-wide prevents future privesc activity detected by CloudTrail\n      Content: |\n        {\n          \"Version\": \"2012-10-17\",\n          \"Statement\": [\n            {\n              \"Effect\": \"Deny\",\n              \"Action\": [\n                \"iam:AttachUserPolicy\",\n                \"iam:AttachRolePolicy\",\n                \"iam:PutUserPolicy\",\n                \"iam:PutRolePolicy\",\n                \"iam:PutGroupPolicy\",\n                \"iam:AddUserToGroup\",\n                \"iam:CreateAccessKey\",\n                \"iam:CreateLoginProfile\",\n                \"iam:UpdateLoginProfile\",\n                \"iam:UpdateAssumeRolePolicy\",\n                \"iam:CreatePolicyVersion\",\n                \"iam:SetDefaultPolicyVersion\",\n                \"iam:PassRole\"\n              ],\n              \"Resource\": \"*\"\n            }\n          ]\n        }\n  <example_resource_name>Attachment:\n    Type: AWS::Organizations::PolicyAttachment\n    Properties:\n      # Critical: Attach the SCP so it is enforced\n      PolicyId: !Ref <example_resource_name>\n      TargetId: <example_resource_id>  # OU, Root, or Account ID\n```",
      "Other": "1. In AWS Console, open IAM and identify the AWS identity shown in the Prowler finding (user or role ARN)\n2. If it is an IAM user:\n   - Go to Security credentials > Access keys, set active keys to Inactive\n   - Go to Permissions, detach all managed policies and delete inline policies\n   - Go to Groups, remove the user from privileged groups\n   - Go to Console password, delete the login profile\n3. If it is an IAM role:\n   - Go to Permissions, detach managed policies and delete inline policies\n   - Go to Trust relationships, remove principals that should not assume the role and save\n4. Re-run the scan after the detection window elapses to confirm no further privilege-escalation activity is detected",
      "Terraform": "```hcl\n# SCP to block common IAM privilege-escalation actions\nresource \"aws_organizations_policy\" \"<example_resource_name>\" {\n  name = \"deny-iam-privesc\"\n  type = \"SERVICE_CONTROL_POLICY\"\n\n  # Critical: Deny risky IAM actions to prevent future privesc\n  # Explanation: Blocks escalation techniques commonly seen in CloudTrail\n  content = jsonencode({\n    Version   = \"2012-10-17\",\n    Statement = [\n      {\n        Effect   = \"Deny\",\n        Action   = [\n          \"iam:AttachUserPolicy\",\n          \"iam:AttachRolePolicy\",\n          \"iam:PutUserPolicy\",\n          \"iam:PutRolePolicy\",\n          \"iam:PutGroupPolicy\",\n          \"iam:AddUserToGroup\",\n          \"iam:CreateAccessKey\",\n          \"iam:CreateLoginProfile\",\n          \"iam:UpdateLoginProfile\",\n          \"iam:UpdateAssumeRolePolicy\",\n          \"iam:CreatePolicyVersion\",\n          \"iam:SetDefaultPolicyVersion\",\n          \"iam:PassRole\"\n        ],\n        Resource = \"*\"\n      }\n    ]\n  })\n}\n\nresource \"aws_organizations_policy_attachment\" \"<example_resource_name>_attach\" {\n  # Critical: Attach the SCP so it takes effect\n  policy_id = aws_organizations_policy.<example_resource_name>.id\n  target_id = \"<example_resource_id>\" # OU, Root, or Account ID\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** and **defense in depth**:\n- Restrict `PassRole`, `Attach*Policy`, `UpdateAssumeRolePolicy`, `CreateAccessKey`\n- Enforce permission boundaries and SCPs\n- Require MFA and change approvals\n- Use multi-Region CloudTrail, immutable retention, and alerting on anomalous sequences",
      "Url": "https://hub.prowler.com/check/cloudtrail_threat_detection_privilege_escalation"
    }
  },
  "Categories": [
    "threat-detection"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
