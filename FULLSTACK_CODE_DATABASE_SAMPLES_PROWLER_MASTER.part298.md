---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 298
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 298 of 867)

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

---[FILE: privilege_escalation.py]---
Location: prowler-master/prowler/providers/aws/services/iam/lib/privilege_escalation.py

```python
from py_iam_expand.actions import expand_actions

from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.lib.policy import get_effective_actions

# Does the tool analyze both users and roles, or just one or the other? --> Everything using AttachementCount.
# Does the tool take a principal-centric or policy-centric approach? --> Policy-centric approach.
# Does the tool handle resource constraints? --> We don't check if the policy affects all resources or not, we check everything.
# Does the tool consider the permissions of service roles? --> Just checks policies.
# Does the tool handle transitive privesc paths (i.e., attack chains)? --> Not yet.
# Does the tool handle the DENY effect as expected? --> Yes, it checks DENY's statements with Action and NotAction.
# Does the tool handle NotAction as expected? --> Yes
# Does the tool handle NotAction with invalid actions as expected? --> Yes
# Does the tool handle Condition constraints? --> Not yet.
# Does the tool handle service control policy (SCP) restrictions? --> No, SCP are within Organizations AWS API.

# Based on:
# - https://bishopfox.com/blog/privilege-escalation-in-aws
# - https://github.com/RhinoSecurityLabs/Security-Research/blob/master/tools/aws-pentest-tools/aws_escalate.py
# - https://rhinosecuritylabs.com/aws/aws-privilege-escalation-methods-mitigation/

privilege_escalation_policies_combination = {
    "OverPermissiveIAM": {"iam:*"},
    "IAMPut": {"iam:Put*"},
    "CreatePolicyVersion": {"iam:CreatePolicyVersion"},
    "SetDefaultPolicyVersion": {"iam:SetDefaultPolicyVersion"},
    "PassRole+EC2": {
        "iam:PassRole",
        "ec2:RunInstances",
    },
    "PassRole+CreateLambda+Invoke": {
        "iam:PassRole",
        "lambda:CreateFunction",
        "lambda:InvokeFunction",
    },
    "PassRole+CreateLambda+ExistingDynamo": {
        "iam:PassRole",
        "lambda:CreateFunction",
        "lambda:CreateEventSourceMapping",
    },
    "PassRole+CreateLambda+NewDynamo": {
        "iam:PassRole",
        "lambda:CreateFunction",
        "lambda:CreateEventSourceMapping",
        "dynamodb:CreateTable",
        "dynamodb:PutItem",
    },
    "PassRole+GlueEndpoint": {
        "iam:PassRole",
        "glue:CreateDevEndpoint",
        "glue:GetDevEndpoint",
    },
    "PassRole+GlueEndpoints": {
        "iam:PassRole",
        "glue:CreateDevEndpoint",
        "glue:GetDevEndpoints",
    },
    "PassRole+CloudFormation": {
        "iam:PassRole",
        "cloudformation:CreateStack",
        "cloudformation:DescribeStacks",
    },
    "PassRole+DataPipeline": {
        "iam:PassRole",
        "datapipeline:CreatePipeline",
        "datapipeline:PutPipelineDefinition",
        "datapipeline:ActivatePipeline",
    },
    "GlueUpdateDevEndpoint": {"glue:UpdateDevEndpoint"},
    "lambda:UpdateFunctionCode": {"lambda:UpdateFunctionCode"},
    "lambda:UpdateFunctionConfiguration": {"lambda:UpdateFunctionConfiguration"},
    "PassRole+CodeStar": {
        "iam:PassRole",
        "codestar:CreateProject",
    },
    "PassRole+CreateAutoScaling": {
        "iam:PassRole",
        "autoscaling:CreateAutoScalingGroup",
        "autoscaling:CreateLaunchConfiguration",
    },
    "PassRole+UpdateAutoScaling": {
        "iam:PassRole",
        "autoscaling:UpdateAutoScalingGroup",
        "autoscaling:CreateLaunchConfiguration",
    },
    "iam:CreateAccessKey": {"iam:CreateAccessKey"},
    "iam:CreateLoginProfile": {"iam:CreateLoginProfile"},
    "iam:UpdateLoginProfile": {"iam:UpdateLoginProfile"},
    "iam:AttachUserPolicy": {"iam:AttachUserPolicy"},
    "iam:AttachGroupPolicy": {"iam:AttachGroupPolicy"},
    "iam:AttachRolePolicy": {"iam:AttachRolePolicy"},
    "AssumeRole+AttachRolePolicy": {"sts:AssumeRole", "iam:AttachRolePolicy"},
    "iam:PutGroupPolicy": {"iam:PutGroupPolicy"},
    "iam:PutRolePolicy": {"iam:PutRolePolicy"},
    "AssumeRole+PutRolePolicy": {"sts:AssumeRole", "iam:PutRolePolicy"},
    "iam:PutUserPolicy": {"iam:PutUserPolicy"},
    "iam:AddUserToGroup": {"iam:AddUserToGroup"},
    "iam:UpdateAssumeRolePolicy": {"iam:UpdateAssumeRolePolicy"},
    "AssumeRole+UpdateAssumeRolePolicy": {
        "sts:AssumeRole",
        "iam:UpdateAssumeRolePolicy",
    },
    # AgentCore privilege escalation patterns
    "PassRole+AgentCoreCreateInterpreter+InvokeInterpreter": {
        "iam:PassRole",
        "bedrock-agentcore:CreateCodeInterpreter",
        "bedrock-agentcore:InvokeCodeInterpreter",
    },
    # ECS-based privilege escalation patterns
    # Reference: https://labs.reversec.com/posts/2025/08/another-ecs-privilege-escalation-path
    "PassRole+ECS+StartTask": {
        "iam:PassRole",
        "ecs:StartTask",
        "ecs:RegisterContainerInstance",
        "ecs:DeregisterContainerInstance",
    },
    "PassRole+ECS+RunTask": {
        "iam:PassRole",
        "ecs:RunTask",
    },
    # TO-DO: We have to handle AssumeRole just if the resource is * and without conditions
    # "sts:AssumeRole": {"sts:AssumeRole"},
}


def check_privilege_escalation(policy: dict) -> str:
    """
    Checks if the policy allows known privilege escalation combinations.

    Args:
        policy (dict): The IAM policy document.

    Returns:
        str: A comma-separated string of the privilege escalation actions found,
            or an empty string if none are found.
    """
    policies_affected = ""
    if not policy:
        return policies_affected

    try:
        effective_allowed_actions = get_effective_actions(policy)

        matched_combo_actions = set()
        matched_combo_keys = set()

        for (
            combo_key,
            required_actions_patterns,
        ) in privilege_escalation_policies_combination.items():
            # Expand the required actions for the current combo
            expanded_required_actions = set()
            for action_pattern in required_actions_patterns:
                expanded_required_actions.update(expand_actions(action_pattern))

            # Check if all expanded required actions are present in the effective actions
            if expanded_required_actions and expanded_required_actions.issubset(
                effective_allowed_actions
            ):
                # If match, store the original patterns and the key
                matched_combo_actions.update(required_actions_patterns)
                matched_combo_keys.add(combo_key)

        if matched_combo_keys:
            # Use the original patterns from the matched combos for the output
            policies_affected = ", ".join(
                f"'{action}'" for action in sorted(list(matched_combo_actions))
            )
            # Alternative: Output based on combo keys
            # print("DEBUG: matched_combo_keys =", ", ".join(sorted(list(matched_combo_keys))))

    except Exception as error:
        logger.error(
            f"Error checking privilege escalation for policy: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )

    return policies_affected
```

--------------------------------------------------------------------------------

---[FILE: inspector2_client.py]---
Location: prowler-master/prowler/providers/aws/services/inspector2/inspector2_client.py

```python
from prowler.providers.aws.services.inspector2.inspector2_service import Inspector2
from prowler.providers.common.provider import Provider

inspector2_client = Inspector2(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: inspector2_service.py]---
Location: prowler-master/prowler/providers/aws/services/inspector2/inspector2_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.aws.lib.service.service import AWSService


class Inspector2(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.inspectors = []
        self.__threading_call__(self._batch_get_account_status)
        self.__threading_call__(self._list_active_findings, self.inspectors)

    def _batch_get_account_status(self, regional_client):
        # We use this function to check if inspector2 is enabled
        logger.info("Inspector2 - Getting account status...")
        try:
            batch_get_account_status = regional_client.batch_get_account_status(
                accountIds=[self.audited_account]
            )["accounts"][0]
            resourceStates = batch_get_account_status.get("resourceState")
            self.inspectors.append(
                Inspector(
                    id="Inspector2",
                    arn=f"arn:{self.audited_partition}:inspector2:{regional_client.region}:{self.audited_account}:inspector2",
                    status=batch_get_account_status.get("state").get("status"),
                    ec2_status=resourceStates.get("ec2", {}).get("status"),
                    ecr_status=resourceStates.get("ecr", {}).get("status"),
                    lambda_status=resourceStates.get("lambda", {}).get("status"),
                    lambda_code_status=resourceStates.get("lambdaCode", {}).get(
                        "status"
                    ),
                    region=regional_client.region,
                )
            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_active_findings(self, inspector):
        logger.info("Inspector2 - Listing active findings...")
        try:
            regional_client = self.regional_clients[inspector.region]
            active_findings = regional_client.list_findings(
                filterCriteria={
                    "awsAccountId": [
                        {"comparison": "EQUALS", "value": self.audited_account},
                    ],
                    "findingStatus": [{"comparison": "EQUALS", "value": "ACTIVE"}],
                },
                maxResults=1,  # Retrieve only 1 finding to check for existence
            )
            inspector.active_findings = len(active_findings.get("findings")) > 0

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Inspector(BaseModel):
    id: str
    arn: str
    region: str
    status: str
    ec2_status: str
    ecr_status: str
    lambda_status: str
    lambda_code_status: str
    active_findings: bool = None
```

--------------------------------------------------------------------------------

---[FILE: inspector2_active_findings_exist.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/inspector2/inspector2_active_findings_exist/inspector2_active_findings_exist.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "inspector2_active_findings_exist",
  "CheckTitle": "Inspector2 is enabled with no active findings",
  "CheckAliases": [
    "inspector2_findings_exist"
  ],
  "CheckType": [
    "Software and Configuration Checks/Vulnerabilities/CVE",
    "Software and Configuration Checks/Patch Management",
    "Software and Configuration Checks/AWS Security Best Practices",
    "Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "inspector2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**Amazon Inspector2** active findings are assessed across eligible resources when the service is `ENABLED`.\n\nIndicates whether any findings remain in the **Active** state versus none.",
  "Risk": "**Unremediated Inspector2 findings** mean known vulnerabilities or exposures persist on workloads.\n\nThis enables:\n- Unauthorized access and data exfiltration (C)\n- Code tampering and privilege escalation (I)\n- Service disruption via exploitation or malware (A)",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Inspector/amazon-inspector-findings.html",
    "https://docs.aws.amazon.com/inspector/latest/user/findings-understanding.html",
    "https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws inspector2 create-filter --name <example_resource_name> --action SUPPRESS --filter-criteria '{\"findingStatus\":[{\"comparison\":\"EQUALS\",\"value\":\"ACTIVE\"}]}'",
      "NativeIaC": "```yaml\n# CloudFormation: Suppress all ACTIVE Inspector findings\nResources:\n  <example_resource_name>:\n    Type: AWS::InspectorV2::Filter\n    Properties:\n      Name: <example_resource_name>\n      Action: SUPPRESS  # critical: converts matching findings to Suppressed, not Active\n      FilterCriteria:\n        FindingStatus:\n          - Comparison: EQUALS\n            Value: ACTIVE  # critical: targets all active findings\n```",
      "Other": "1. In the AWS Console, go to Amazon Inspector\n2. Open Suppression rules (or Filters) and click Create suppression rule\n3. Set condition: Finding status = Active\n4. Set action to Suppress and click Create\n5. Verify the Active findings count is 0 on the dashboard",
      "Terraform": "```hcl\n# Terraform: Suppress all ACTIVE Inspector findings\nresource \"aws_inspector2_filter\" \"<example_resource_name>\" {\n  name   = \"<example_resource_name>\"\n  action = \"SUPPRESS\"  # critical: converts matching findings to Suppressed, not Active\n\n  filter_criteria {\n    finding_status {\n      comparison = \"EQUALS\"\n      value      = \"ACTIVE\"  # critical: targets all active findings\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Prioritize and remediate **Active findings** quickly: patch hosts and runtimes, update/rebuild images, fix vulnerable code, and close unintended exposure.\n\nApply **least privilege**, use **defense in depth**, and avoid broad suppressions. Integrate findings into CI/CD and vulnerability management for continuous prevention.",
      "Url": "https://hub.prowler.com/check/inspector2_active_findings_exist"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: inspector2_active_findings_exist.py]---
Location: prowler-master/prowler/providers/aws/services/inspector2/inspector2_active_findings_exist/inspector2_active_findings_exist.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.inspector2.inspector2_client import (
    inspector2_client,
)


class inspector2_active_findings_exist(Check):
    def execute(self):
        findings = []
        for inspector in inspector2_client.inspectors:
            if inspector.status == "ENABLED" and inspector.active_findings is not None:
                report = Check_Report_AWS(metadata=self.metadata(), resource=inspector)
                report.status = "PASS"
                report.status_extended = (
                    "Inspector2 is enabled with no active findings."
                )
                if inspector.active_findings:
                    report.status = "FAIL"
                    report.status_extended = "There are active Inspector2 findings."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: inspector2_is_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/inspector2/inspector2_is_enabled/inspector2_is_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "inspector2_is_enabled",
  "CheckTitle": "Inspector2 is enabled for Amazon EC2 instances, ECR container images, Lambda functions, and Lambda code",
  "CheckAliases": [
    "inspector2_findings_exist"
  ],
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "inspector2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Amazon Inspector 2** activation and coverage across regions, verifying that scanning is active for **EC2**, **ECR**, **Lambda functions**, and **Lambda code** where applicable.\n\nIt flags missing account activation or gaps in any scan type.",
  "Risk": "Absent or partial coverage leaves **unpatched vulnerabilities**, risky **code dependencies**, and **unintended network exposure** undetected.\n\nAttackers can exploit known CVEs for **remote code execution**, **lateral movement**, and **data exfiltration**, degrading **confidentiality**, **integrity**, and **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Inspector2/enable-amazon-inspector2.html",
    "https://docs.aws.amazon.com/inspector/latest/user/findings-understanding.html",
    "https://docs.aws.amazon.com/inspector/latest/user/getting_started_tutorial.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws inspector2 enable --resource-types EC2 ECR LAMBDA LAMBDA_CODE",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Console and open Amazon Inspector (v2)\n2. If not yet activated: click Get started > Activate Amazon Inspector\n3. If already activated: go to Settings > Scans and ensure EC2, ECR, Lambda functions, and Lambda code are all enabled, then Save",
      "Terraform": "```hcl\nresource \"aws_inspector2_enabler\" \"<example_resource_name>\" {\n  resource_types = [\"EC2\", \"ECR\", \"LAMBDA\", \"LAMBDA_CODE\"] # Enables Inspector2 scans for all required resource types\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Amazon Inspector 2** across all regions and activate scans for **EC2**, **ECR**, **Lambda**, and **Lambda code**.\n\nApply **defense in depth**: auto-enable coverage for new workloads, integrate findings with patching and CI/CD gates, enforce remediation SLAs, and grant only **least privilege** to process and act on findings.",
      "Url": "https://hub.prowler.com/check/inspector2_is_enabled"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: inspector2_is_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/inspector2/inspector2_is_enabled/inspector2_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ecr.ecr_client import ecr_client
from prowler.providers.aws.services.inspector2.inspector2_client import (
    inspector2_client,
)


class inspector2_is_enabled(Check):
    def execute(self):
        findings = []
        for inspector in inspector2_client.inspectors:
            report = Check_Report_AWS(metadata=self.metadata(), resource=inspector)
            if inspector.status == "ENABLED":
                report.status = "PASS"
                report.status_extended = "Inspector2 is enabled for EC2 instances, ECR container images, Lambda functions and code."
                funtions_in_region = False
                ec2_in_region = False
                for function in awslambda_client.functions.values():
                    if function.region == inspector.region:
                        funtions_in_region = True
                for instance in ec2_client.instances:
                    if instance == inspector.region:
                        ec2_in_region = True
                failed_services = []

                if inspector.ec2_status != "ENABLED" and (
                    inspector2_client.provider.scan_unused_services or ec2_in_region
                ):
                    failed_services.append("EC2")
                if inspector.ecr_status != "ENABLED" and (
                    inspector2_client.provider.scan_unused_services
                    or ecr_client.registries[inspector.region].repositories
                ):
                    failed_services.append("ECR")
                if inspector.lambda_status != "ENABLED" and (
                    inspector2_client.provider.scan_unused_services
                    or funtions_in_region
                ):
                    failed_services.append("Lambda")
                if inspector.lambda_code_status != "ENABLED" and (
                    inspector2_client.provider.scan_unused_services
                    or funtions_in_region
                ):
                    failed_services.append("Lambda Code")

                if failed_services:
                    report.status = "FAIL"
                    report.status_extended = f"Inspector2 is not enabled for the following services: {', '.join(failed_services)}."
                findings.append(report)
            else:
                report.status = "FAIL"
                report.status_extended = "Inspector2 is not enabled in this account."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kafkaconnect_client.py]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafkaconnect_client.py

```python
from prowler.providers.aws.services.kafka.kafka_service import KafkaConnect
from prowler.providers.common.provider import Provider

kafkaconnect_client = KafkaConnect(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: kafka_client.py]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_client.py

```python
from prowler.providers.aws.services.kafka.kafka_service import Kafka
from prowler.providers.common.provider import Provider

kafka_client = Kafka(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: kafka_service.py]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Kafka(AWSService):
    def __init__(self, provider):
        super().__init__(__class__.__name__, provider)
        self.account_arn_template = f"arn:{self.audited_partition}:kafka:{self.region}:{self.audited_account}:cluster"
        self.clusters = {}
        self.__threading_call__(self._list_clusters)
        self.kafka_versions = []
        self.__threading_call__(self._list_kafka_versions)

    def _list_clusters(self, regional_client):
        logger.info(f"Kafka - Listing clusters in region {regional_client.region}...")
        try:
            # Use list_clusters_v2 to support both provisioned and serverless clusters
            cluster_paginator = regional_client.get_paginator("list_clusters_v2")
            logger.info(
                f"Kafka - Paginator created for region {regional_client.region}"
            )

            for page in cluster_paginator.paginate():
                logger.info(
                    f"Kafka - Processing page with {len(page.get('ClusterInfoList', []))} clusters in region {regional_client.region}"
                )
                for cluster in page["ClusterInfoList"]:
                    logger.info(
                        f"Kafka - Found cluster: {cluster.get('ClusterName', 'Unknown')} in region {regional_client.region}"
                    )
                    arn = cluster.get(
                        "ClusterArn",
                        f"{self.account_arn_template}/{cluster.get('ClusterName', '')}",
                    )
                    cluster_type = cluster.get("ClusterType", "UNKNOWN")

                    if not self.audit_resources or is_resource_filtered(
                        arn, self.audit_resources
                    ):
                        # Handle provisioned clusters
                        if cluster_type == "PROVISIONED" and "Provisioned" in cluster:
                            provisioned = cluster["Provisioned"]
                            self.clusters[cluster.get("ClusterArn", "")] = Cluster(
                                id=arn.split(":")[-1].split("/")[-1],
                                name=cluster.get("ClusterName", ""),
                                arn=arn,
                                region=regional_client.region,
                                tags=(
                                    list(cluster.get("Tags", {}).values())
                                    if cluster.get("Tags")
                                    else []
                                ),
                                state=cluster.get("State", ""),
                                kafka_version=provisioned.get(
                                    "CurrentBrokerSoftwareInfo", {}
                                ).get("KafkaVersion", ""),
                                data_volume_kms_key_id=provisioned.get(
                                    "EncryptionInfo", {}
                                )
                                .get("EncryptionAtRest", {})
                                .get("DataVolumeKMSKeyId", ""),
                                encryption_in_transit=EncryptionInTransit(
                                    client_broker=provisioned.get("EncryptionInfo", {})
                                    .get("EncryptionInTransit", {})
                                    .get("ClientBroker", "PLAINTEXT"),
                                    in_cluster=provisioned.get("EncryptionInfo", {})
                                    .get("EncryptionInTransit", {})
                                    .get("InCluster", False),
                                ),
                                tls_authentication=provisioned.get(
                                    "ClientAuthentication", {}
                                )
                                .get("Tls", {})
                                .get("Enabled", False),
                                public_access=provisioned.get("BrokerNodeGroupInfo", {})
                                .get("ConnectivityInfo", {})
                                .get("PublicAccess", {})
                                .get("Type", "SERVICE_PROVIDED_EIPS")
                                != "DISABLED",
                                unauthentication_access=provisioned.get(
                                    "ClientAuthentication", {}
                                )
                                .get("Unauthenticated", {})
                                .get("Enabled", False),
                                enhanced_monitoring=provisioned.get(
                                    "EnhancedMonitoring", "DEFAULT"
                                ),
                            )
                            logger.info(
                                f"Kafka - Added provisioned cluster {cluster.get('ClusterName', 'Unknown')} to clusters dict"
                            )

                        # Handle serverless clusters
                        elif cluster_type == "SERVERLESS" and "Serverless" in cluster:
                            # For serverless clusters, encryption is always enabled by default
                            # We'll create a Cluster object with default encryption values
                            self.clusters[cluster.get("ClusterArn", "")] = Cluster(
                                id=arn.split(":")[-1].split("/")[-1],
                                name=cluster.get("ClusterName", ""),
                                arn=arn,
                                region=regional_client.region,
                                tags=(
                                    list(cluster.get("Tags", {}).values())
                                    if cluster.get("Tags")
                                    else []
                                ),
                                state=cluster.get("State", ""),
                                kafka_version="SERVERLESS",  # Serverless doesn't have specific Kafka version
                                data_volume_kms_key_id="AWS_MANAGED",  # Serverless uses AWS managed keys
                                encryption_in_transit=EncryptionInTransit(
                                    client_broker="TLS",  # Serverless always has TLS enabled
                                    in_cluster=True,  # Serverless always has in-cluster encryption
                                ),
                                tls_authentication=True,  # Serverless always has TLS authentication
                                public_access=False,  # Serverless clusters are always private
                                unauthentication_access=False,  # Serverless requires authentication
                                enhanced_monitoring="DEFAULT",
                            )
                            logger.info(
                                f"Kafka - Added serverless cluster {cluster.get('ClusterName', 'Unknown')} to clusters dict"
                            )

                        else:
                            logger.warning(
                                f"Kafka - Unknown cluster type {cluster_type} for cluster {cluster.get('ClusterName', 'Unknown')}"
                            )
                    else:
                        logger.info(
                            f"Kafka - Cluster {cluster.get('ClusterName', 'Unknown')} filtered out by audit_resources"
                        )

            logger.info(
                f"Kafka - Total clusters found in region {regional_client.region}: {len(self.clusters)}"
            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            logger.error(
                f"Kafka - Error details in region {regional_client.region}: {str(error)}"
            )

    def _list_kafka_versions(self, regional_client):
        try:
            kafka_versions_paginator = regional_client.get_paginator(
                "list_kafka_versions"
            )

            for page in kafka_versions_paginator.paginate():
                for version in page["KafkaVersions"]:
                    self.kafka_versions.append(
                        KafkaVersion(
                            version=version.get("Version", "UNKNOWN"),
                            status=version.get("Status", "UNKNOWN"),
                        )
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class EncryptionInTransit(BaseModel):
    client_broker: str
    in_cluster: bool


class Cluster(BaseModel):
    id: str
    name: str
    arn: str
    region: str
    tags: list
    kafka_version: str
    state: str
    data_volume_kms_key_id: str
    encryption_in_transit: EncryptionInTransit
    tls_authentication: bool
    public_access: bool
    unauthentication_access: bool
    enhanced_monitoring: str


class KafkaVersion(BaseModel):
    version: str
    status: str


class KafkaConnect(AWSService):
    def __init__(self, provider):
        super().__init__(__class__.__name__, provider)
        self.connectors = {}
        self.__threading_call__(self._list_connectors)

    def _list_connectors(self, regional_client):
        try:
            connector_paginator = regional_client.get_paginator("list_connectors")

            for page in connector_paginator.paginate():
                for connector in page["connectors"]:
                    connector_arn = connector["connectorArn"]

                    if not self.audit_resources or is_resource_filtered(
                        connector_arn, self.audit_resources
                    ):
                        self.connectors[connector_arn] = Connector(
                            arn=connector_arn,
                            name=connector.get("connectorName", ""),
                            region=regional_client.region,
                            encryption_in_transit=connector.get(
                                "kafkaClusterEncryptionInTransit", {}
                            ).get("encryptionType", "PLAINTEXT"),
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Connector(BaseModel):
    name: str
    arn: str
    region: str
    encryption_in_transit: str
```

--------------------------------------------------------------------------------

---[FILE: kafka_cluster_encryption_at_rest_uses_cmk.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_encryption_at_rest_uses_cmk/kafka_cluster_encryption_at_rest_uses_cmk.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kafka_cluster_encryption_at_rest_uses_cmk",
  "CheckTitle": "Kafka cluster has encryption at rest enabled with a customer managed key (CMK) or is serverless",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Data Encryption",
    "Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Industry and Regulatory Standards/NIST 800-53 Controls (USA)",
    "Industry and Regulatory Standards/PCI-DSS",
    "Effects/Data Exposure"
  ],
  "ServiceName": "kafka",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsMskCluster",
  "Description": "Amazon MSK clusters are inspected for **encryption at rest** using a **customer-managed KMS key** for data volumes. Serverless clusters are inherently encrypted. Provisioned clusters are recognized only when the configured `DataVolumeKMSKeyId` corresponds to a customer-managed key.",
  "Risk": "Relying on service-managed keys weakens **confidentiality** and **accountability**: you can't enforce granular key policies, separation of duties, or independent rotation. This limits incident response (e.g., disabling the key for crypto-shredding) and reduces auditability, increasing impact of credential misuse or broker compromise.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/msk/latest/developerguide/msk-encryption.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/MSK/msk-encryption-at-rest-with-cmk.html",
    "https://docs.aws.amazon.com/msk/latest/developerguide/msk-working-with-encryption.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: MSK cluster using a customer managed KMS key for encryption at rest\nResources:\n  <example_resource_name>:\n    Type: AWS::MSK::Cluster\n    Properties:\n      ClusterName: <example_resource_name>\n      KafkaVersion: <KAFKA_VERSION>\n      NumberOfBrokerNodes: 2\n      BrokerNodeGroupInfo:\n        InstanceType: kafka.m5.large\n        ClientSubnets:\n          - <example_subnet_id_a>\n          - <example_subnet_id_b>\n        SecurityGroups:\n          - <example_security_group_id>\n      EncryptionInfo:\n        EncryptionAtRest:\n          DataVolumeKMSKeyId: <example_kms_key_arn>  # Critical: use a customer managed KMS key ARN to enable CMK encryption at rest\n```",
      "Other": "1. In the AWS Console, go to Amazon MSK > Clusters\n2. Click Create cluster\n3. Choose Provisioned (or choose Serverless to pass by default)\n4. In Encryption settings, for At-rest encryption, select Customer managed key and choose your CMK (not alias/aws/kafka)\n5. Create the cluster, migrate clients to it, then delete the old cluster that used the AWS managed key",
      "Terraform": "```hcl\n# MSK cluster using a customer managed KMS key for encryption at rest\nresource \"aws_msk_cluster\" \"<example_resource_name>\" {\n  cluster_name           = \"<example_resource_name>\"\n  kafka_version          = \"<KAFKA_VERSION>\"\n  number_of_broker_nodes = 2\n\n  broker_node_group_info {\n    instance_type  = \"kafka.m5.large\"\n    client_subnets = [\"<example_subnet_id_a>\", \"<example_subnet_id_b>\"]\n    security_groups = [\"<example_security_group_id>\"]\n  }\n\n  encryption_info {\n    encryption_at_rest_kms_key_arn = \"<example_kms_key_arn>\" # Critical: customer managed KMS key to pass the check\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Use a **customer-managed KMS key** for MSK at-rest encryption. Apply **least privilege** in key policies and grants, enable **key rotation**, and log key use for auditing. Enforce **separation of duties** between MSK admins and KMS key custodians, and regularly review access, aliases, and pending-deletion states.",
      "Url": "https://hub.prowler.com/check/kafka_cluster_encryption_at_rest_uses_cmk"
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

---[FILE: kafka_cluster_encryption_at_rest_uses_cmk.py]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_encryption_at_rest_uses_cmk/kafka_cluster_encryption_at_rest_uses_cmk.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kafka.kafka_client import kafka_client
from prowler.providers.aws.services.kms.kms_client import kms_client


class kafka_cluster_encryption_at_rest_uses_cmk(Check):
    def execute(self):
        findings = []

        for cluster in kafka_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"Kafka cluster '{cluster.name}' does not have encryption at rest enabled with a CMK."

            # Serverless clusters always have encryption at rest enabled by default
            if cluster.kafka_version == "SERVERLESS":
                report.status = "PASS"
                report.status_extended = f"Kafka cluster '{cluster.name}' is serverless and always has encryption at rest enabled by default."
            # For provisioned clusters, check if they use a customer managed KMS key
            elif any(
                (
                    cluster.data_volume_kms_key_id == key.arn
                    and getattr(key, "manager", "") == "CUSTOMER"
                )
                for key in kms_client.keys
            ):
                report.status = "PASS"
                report.status_extended = f"Kafka cluster '{cluster.name}' has encryption at rest enabled with a CMK."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
