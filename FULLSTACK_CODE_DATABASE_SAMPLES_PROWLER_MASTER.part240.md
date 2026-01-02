---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 240
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 240 of 867)

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

---[FILE: athena_workgroup_enforce_configuration.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/athena/athena_workgroup_enforce_configuration/athena_workgroup_enforce_configuration.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "athena_workgroup_enforce_configuration",
  "CheckTitle": "Athena workgroup enforces workgroup configuration and cannot be overridden by client-side settings",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "athena",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsAthenaWorkGroup",
  "Description": "**Athena workgroups** that set `enforce_workgroup_configuration=true` apply the **workgroup's settings** to every query, overriding client-side options for results location, expected bucket owner, encryption, and control of objects written to the results bucket.",
  "Risk": "Without enforcement, clients may disable or change result **encryption**, redirect outputs to unintended or cross-account buckets, and bypass retention controls.\n\nThis enables data exposure (C), result tampering (I), and weak auditability, complicating incident response.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html",
    "https://support.icompaas.com/support/solutions/articles/62000233407-ensure-that-workgroup-configuration-is-enforced-so-it-cannot-be-overriden-by-client-side-settings-"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws athena update-work-group --work-group <workgroup_name> --configuration-updates EnforceWorkGroupConfiguration=true",
      "NativeIaC": "```yaml\n# CloudFormation: Enable enforcement of workgroup configuration\nResources:\n  <example_resource_name>:\n    Type: AWS::Athena::WorkGroup\n    Properties:\n      Name: <example_resource_name>\n      WorkGroupConfiguration:\n        EnforceWorkGroupConfiguration: true  # Critical: forces workgroup settings to override client-side settings\n```",
      "Other": "1. Open the AWS Management Console and go to Amazon Athena\n2. Click Workgroups, select the target workgroup\n3. Click Edit workgroup\n4. Check Override client-side settings (enforce workgroup settings)\n5. Click Save",
      "Terraform": "```hcl\n# Terraform: Enable enforcement of workgroup configuration\nresource \"aws_athena_workgroup\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  configuration {\n    enforce_workgroup_configuration = true  # Critical: forces workgroup settings to override client-side settings\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Set `enforce_workgroup_configuration=true` to centralize control.\n\nRequire **encrypted results** (prefer **SSE-KMS**), restrict output to approved S3 locations with expected bucket owner, and apply **least privilege**. Monitor results access and logs as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/athena_workgroup_enforce_configuration"
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

---[FILE: athena_workgroup_enforce_configuration.py]---
Location: prowler-master/prowler/providers/aws/services/athena/athena_workgroup_enforce_configuration/athena_workgroup_enforce_configuration.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.athena.athena_client import athena_client


class athena_workgroup_enforce_configuration(Check):
    """Check if there are Athena workgroups not encrypting query results"""

    def execute(self):
        """Execute the athena_workgroup_enforce_configuration check"""
        findings = []
        for workgroup in athena_client.workgroups.values():
            # Only check for enabled and used workgroups (has recent queries)
            if (
                workgroup.state == "ENABLED" and workgroup.queries
            ) or athena_client.provider.scan_unused_services:
                report = Check_Report_AWS(metadata=self.metadata(), resource=workgroup)

                if workgroup.enforce_workgroup_configuration:
                    report.status = "PASS"
                    report.status_extended = f"Athena WorkGroup {workgroup.name} enforces the workgroup configuration, so it cannot be overridden by the client-side settings."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Athena WorkGroup {workgroup.name} does not enforce the workgroup configuration, so it can be overridden by the client-side settings."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: athena_workgroup_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/athena/athena_workgroup_logging_enabled/athena_workgroup_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "athena_workgroup_logging_enabled",
  "CheckTitle": "Amazon Athena workgroup has CloudWatch logging enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Defense Evasion"
  ],
  "ServiceName": "athena",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsAthenaWorkGroup",
  "Description": "**Athena workgroups** publish **query metrics** to CloudWatch. This evaluation determines whether each workgroup has query activity logging enabled in CloudWatch.",
  "Risk": "Without CloudWatch query logging, risky or anomalous queries go unobserved, weakening **confidentiality** and **integrity**. Compromised or insider accounts can exfiltrate data and alter datasets without timely detection, hampering forensics and containment.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/athena/latest/ug/security-logging-monitoring.html",
    "https://docs.aws.amazon.com/athena/latest/ug/athena-cloudwatch-metrics-enable.html",
    "https://stackoverflow.com/questions/68896809/how-to-save-queries-executed-by-athena-in-logsgroup-cloudwatch",
    "https://support.icompaas.com/support/solutions/articles/62000233405-ensure-that-logging-is-enabled-for-amazon-athena-workgroups-to-capture-query-activity-",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/athena-controls.html#athena-4"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws athena update-work-group --work-group <WORKGROUP_NAME> --configuration-updates PublishCloudWatchMetricsEnabled=true",
      "NativeIaC": "```yaml\n# CloudFormation to enable CloudWatch logging for an Athena workgroup\nResources:\n  AthenaWorkGroup:\n    Type: AWS::Athena::WorkGroup\n    Properties:\n      Name: <example_resource_name>\n      WorkGroupConfiguration:\n        PublishCloudWatchMetricsEnabled: true  # Critical: Enables CloudWatch logging for the workgroup\n```",
      "Other": "1. Open the AWS Management Console and go to Amazon Athena\n2. In the left pane, click Workgroups and select the target workgroup\n3. Click Edit\n4. Check Publish query metrics to AWS CloudWatch\n5. Click Save",
      "Terraform": "```hcl\n# Enable CloudWatch logging for an Athena workgroup\nresource \"aws_athena_workgroup\" \"example\" {\n  name = \"<example_resource_name>\"\n\n  configuration {\n    publish_cloudwatch_metrics_enabled = true  # Critical: Enables CloudWatch logging\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable and enforce **CloudWatch query logging** for all workgroups (`PublishCloudWatchMetricsEnabled`).\n- Apply least privilege to logs and encrypt at rest\n- Set retention and anomaly alerts\n- Correlate with **CloudTrail** for user attribution\n- Centralize logs to a monitoring account",
      "Url": "https://hub.prowler.com/check/athena_workgroup_logging_enabled"
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

---[FILE: athena_workgroup_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/athena/athena_workgroup_logging_enabled/athena_workgroup_logging_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.athena.athena_client import athena_client


class athena_workgroup_logging_enabled(Check):
    """Check if there are Athena workgroups with logging disabled."""

    def execute(self) -> List[Check_Report_AWS]:
        """Execute the Athena workgroup logging enabled check.

        Iterates over all Athena workgroups and checks if is publishing logs to CloudWatch.

        Returns:
            List of reports object with the findings of each workgroup.
        """
        findings = []
        for workgroup in athena_client.workgroups.values():
            # Only check for enabled and used workgroups (has recent queries)
            if (
                workgroup.state == "ENABLED" and workgroup.queries
            ) or athena_client.provider.scan_unused_services:
                report = Check_Report_AWS(metadata=self.metadata(), resource=workgroup)
                report.status = "PASS"
                report.status_extended = (
                    f"Athena WorkGroup {workgroup.name} has CloudWatch logging enabled."
                )

                if not workgroup.cloudwatch_logging:
                    report.status = "FAIL"
                    report.status_extended = f"Athena WorkGroup {workgroup.name} does not have CloudWatch logging enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: applicationautoscaling_client.py]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/applicationautoscaling_client.py

```python
from prowler.providers.aws.services.autoscaling.autoscaling_service import (
    ApplicationAutoScaling,
)
from prowler.providers.common.provider import Provider

applicationautoscaling_client = ApplicationAutoScaling(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_client.py]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_client.py

```python
from prowler.providers.aws.services.autoscaling.autoscaling_service import AutoScaling
from prowler.providers.common.provider import Provider

autoscaling_client = AutoScaling(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_service.py]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class AutoScaling(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.launch_configurations = {}
        self.__threading_call__(self._describe_launch_configurations)
        self.groups = []
        self.__threading_call__(self._describe_auto_scaling_groups)

    def _describe_launch_configurations(self, regional_client):
        logger.info("AutoScaling - Describing Launch Configurations...")
        try:
            describe_launch_configurations_paginator = regional_client.get_paginator(
                "describe_launch_configurations"
            )
            for page in describe_launch_configurations_paginator.paginate():
                for configuration in page["LaunchConfigurations"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            configuration["LaunchConfigurationARN"],
                            self.audit_resources,
                        )
                    ):
                        arn = configuration["LaunchConfigurationARN"]

                        self.launch_configurations[arn] = LaunchConfiguration(
                            arn=arn,
                            name=configuration["LaunchConfigurationName"],
                            user_data=configuration.get("UserData", ""),
                            image_id=configuration["ImageId"],
                            region=regional_client.region,
                            http_tokens=configuration.get("MetadataOptions", {}).get(
                                "HttpTokens", ""
                            ),
                            http_endpoint=configuration.get("MetadataOptions", {}).get(
                                "HttpEndpoint", ""
                            ),
                            public_ip=configuration.get(
                                "AssociatePublicIpAddress", False
                            ),
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_auto_scaling_groups(self, regional_client):
        logger.info("AutoScaling - Describing AutoScaling Groups...")
        try:
            describe_auto_scaling_groups_paginator = regional_client.get_paginator(
                "describe_auto_scaling_groups"
            )
            for page in describe_auto_scaling_groups_paginator.paginate():
                for group in page["AutoScalingGroups"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            group["AutoScalingGroupARN"],
                            self.audit_resources,
                        )
                    ):
                        instance_types = []
                        az_instance_types = {}
                        for instance in group.get("Instances", []):
                            az = instance["AvailabilityZone"]
                            instance_type = instance["InstanceType"]
                            instance_types.append(instance_type)
                            if az not in az_instance_types:
                                az_instance_types[az] = set()
                            az_instance_types[az].add(instance_type)

                        self.groups.append(
                            Group(
                                arn=group.get("AutoScalingGroupARN"),
                                name=group.get("AutoScalingGroupName"),
                                region=regional_client.region,
                                availability_zones=group.get("AvailabilityZones"),
                                tags=group.get("Tags"),
                                instance_types=instance_types,
                                az_instance_types=az_instance_types,
                                capacity_rebalance=group.get(
                                    "CapacityRebalance", False
                                ),
                                launch_template=group.get("LaunchTemplate", {}),
                                mixed_instances_policy_launch_template=group.get(
                                    "MixedInstancesPolicy", {}
                                )
                                .get("LaunchTemplate", {})
                                .get("LaunchTemplateSpecification", {}),
                                health_check_type=group.get("HealthCheckType", ""),
                                load_balancers=group.get("LoadBalancerNames", []),
                                target_groups=group.get("TargetGroupARNs", []),
                                launch_configuration_name=group.get(
                                    "LaunchConfigurationName", ""
                                ),
                            )
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


# Global list for service namespaces needed for Describe Scalable Targets
SERVICE_NAMESPACES = ["dynamodb"]


class ApplicationAutoScaling(AWSService):
    def __init__(self, provider):
        super().__init__("application-autoscaling", provider)
        self.scalable_targets = []
        self.__threading_call__(self._describe_scalable_targets)

    def _describe_scalable_targets(self, regional_client):
        logger.info("ApplicationAutoScaling - Describing Scalable Targets...")
        try:
            describe_scalable_targets_paginator = regional_client.get_paginator(
                "describe_scalable_targets"
            )
            for service_namespace in SERVICE_NAMESPACES:
                logger.info(f"Processing ServiceNamespace: {service_namespace}")
                for page in describe_scalable_targets_paginator.paginate(
                    ServiceNamespace=service_namespace
                ):
                    for target in page.get("ScalableTargets", []):
                        if not self.audit_resources or (
                            is_resource_filtered(
                                target["ScalableTargetARN"],
                                self.audit_resources,
                            )
                        ):
                            self.scalable_targets.append(
                                ScalableTarget(
                                    arn=target.get("ScalableTargetARN", ""),
                                    resource_id=target.get("ResourceId"),
                                    service_namespace=target.get("ServiceNamespace"),
                                    scalable_dimension=target.get("ScalableDimension"),
                                    region=regional_client.region,
                                )
                            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class LaunchConfiguration(BaseModel):
    arn: str
    name: str
    user_data: str
    image_id: str
    region: str
    http_tokens: str
    http_endpoint: str
    public_ip: bool


class Group(BaseModel):
    arn: str
    name: str
    region: str
    availability_zones: list
    tags: list = []
    instance_types: list = []
    az_instance_types: dict = {}
    capacity_rebalance: bool
    launch_template: dict = {}
    mixed_instances_policy_launch_template: dict = {}
    health_check_type: str
    load_balancers: list = []
    target_groups: list = []
    launch_configuration_name: str


class ScalableTarget(BaseModel):
    arn: str
    resource_id: str
    service_namespace: str
    scalable_dimension: str
    region: str
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_find_secrets_ec2_launch_configuration.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_find_secrets_ec2_launch_configuration/autoscaling_find_secrets_ec2_launch_configuration.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "autoscaling_find_secrets_ec2_launch_configuration",
  "CheckTitle": "[DEPRECATED] EC2 Auto Scaling launch configuration user data contains no secrets",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Sensitive Data Identifications/Passwords",
    "Effects/Data Exposure"
  ],
  "ServiceName": "autoscaling",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsAutoScalingLaunchConfiguration",
  "Description": "[DEPRECATED] EC2 Auto Scaling launch configurations are analyzed for **secrets** embedded in `User Data`, such as passwords, tokens, or API keys in bootstrapping scripts.",
  "Risk": "Secrets in `User Data` erode **confidentiality** and **integrity**:\n- Instance users or processes can read or log them\n- Exposed keys enable unauthorized API calls, data exfiltration, and lateral movement\n- Credential reuse increases blast radius across accounts and services",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation Launch Configuration without secrets in UserData\nResources:\n  <example_resource_name>:\n    Type: AWS::AutoScaling::LaunchConfiguration\n    Properties:\n      ImageId: <AMI_ID>\n      InstanceType: <INSTANCE_TYPE>\n      UserData: ''  # Critical: empty user data ensures no secrets are present\n```",
      "Other": "1. In the AWS Console, go to EC2 > Launch configurations and click Create launch configuration\n2. Reuse the same AMI and instance type; leave User data empty\n3. Go to EC2 > Auto Scaling groups, select the group using the failing launch configuration, click Edit\n4. Under Launch options, select the new launch configuration and Save\n5. After the ASG is updated, delete the old launch configuration",
      "Terraform": "```hcl\n# Launch configuration with no secrets in user data\nresource \"aws_launch_configuration\" \"<example_resource_name>\" {\n  image_id      = \"<AMI_ID>\"\n  instance_type = \"<INSTANCE_TYPE>\"\n  user_data     = \"\" # Critical: empty user data ensures no secrets are present\n}\n```"
    },
    "Recommendation": {
      "Text": "Never place secrets in `User Data`.\n- Use a managed secret store with an instance role to fetch at runtime\n- Enforce **least privilege**, rotate secrets, and avoid writing secrets to logs\n- Prefer short-lived, scoped credentials and layer controls for **defense in depth**",
      "Url": "https://hub.prowler.com/check/autoscaling_find_secrets_ec2_launch_configuration"
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

---[FILE: autoscaling_find_secrets_ec2_launch_configuration.py]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_find_secrets_ec2_launch_configuration/autoscaling_find_secrets_ec2_launch_configuration.py

```python
import zlib
from base64 import b64decode

from prowler.config.config import encoding_format_utf_8
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.logger import logger
from prowler.lib.utils.utils import detect_secrets_scan
from prowler.providers.aws.services.autoscaling.autoscaling_client import (
    autoscaling_client,
)


class autoscaling_find_secrets_ec2_launch_configuration(Check):
    def execute(self):
        findings = []
        secrets_ignore_patterns = autoscaling_client.audit_config.get(
            "secrets_ignore_patterns", []
        )
        for (
            configuration_arn,
            configuration,
        ) in autoscaling_client.launch_configurations.items():
            report = Check_Report_AWS(metadata=self.metadata(), resource=configuration)

            if configuration.user_data:
                user_data = b64decode(configuration.user_data)
                try:
                    if user_data[0:2] == b"\x1f\x8b":  # GZIP magic number
                        user_data = zlib.decompress(
                            user_data, zlib.MAX_WBITS | 32
                        ).decode(encoding_format_utf_8)
                    else:
                        user_data = user_data.decode(encoding_format_utf_8)
                except UnicodeDecodeError as error:
                    logger.warning(
                        f"{configuration.region} -- Unable to decode user data in autoscaling launch configuration {configuration.name}: {error}"
                    )
                    continue
                except Exception as error:
                    logger.error(
                        f"{configuration.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                    continue

                has_secrets = detect_secrets_scan(
                    data=user_data,
                    excluded_secrets=secrets_ignore_patterns,
                    detect_secrets_plugins=autoscaling_client.audit_config.get(
                        "detect_secrets_plugins"
                    ),
                )

                if has_secrets:
                    report.status = "FAIL"
                    report.status_extended = f"Potential secret found in autoscaling {configuration.name} User Data."
                else:
                    report.status = "PASS"
                    report.status_extended = f"No secrets found in autoscaling {configuration.name} User Data."
            else:
                report.status = "PASS"
                report.status_extended = f"No secrets found in autoscaling {configuration.name} since User Data is empty."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_capacity_rebalance_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_capacity_rebalance_enabled/autoscaling_group_capacity_rebalance_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "autoscaling_group_capacity_rebalance_enabled",
  "CheckTitle": "Amazon EC2 Auto Scaling group has Capacity Rebalancing enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "autoscaling",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsAutoScalingAutoScalingGroup",
  "Description": "**EC2 Auto Scaling groups** use **Capacity Rebalancing** to act on EC2 `rebalance` recommendations by launching replacement Spot instances and terminating at-risk ones after they are healthy.\n\n*Assesses whether this proactive replacement behavior is enabled.*",
  "Risk": "Without **Capacity Rebalancing**, Spot interruptions can drop targets and reduce capacity, causing timeouts, 5xx spikes, and backlog growth. The two-minute notice is often insufficient, reducing service **availability** and increasing the chance of cascading failures and slow recovery.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awssupport/latest/user/fault-tolerance-checks.html#amazon-ec2-auto-scaling-group-capacity-rebalance-enabled",
    "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-capacity-rebalancing.html",
    "https://trendmicro.com/cloudoneconformity/knowledge-base/aws/EC2/enable-capacity-rebalancing.html",
    "https://docs.aws.amazon.com/autoscaling/ec2/userguide/enable-capacity-rebalancing-console-cli.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws autoscaling update-auto-scaling-group --auto-scaling-group-name <example_resource_name> --capacity-rebalance",
      "NativeIaC": "```yaml\n# CloudFormation: Enable Capacity Rebalancing on an Auto Scaling group\nResources:\n  <example_resource_name>:\n    Type: AWS::AutoScaling::AutoScalingGroup\n    Properties:\n      MinSize: \"1\"\n      MaxSize: \"1\"\n      AvailabilityZones: [\"<example_az>\"]\n      LaunchTemplate:\n        LaunchTemplateName: <example_resource_name>\n        Version: \"$Default\"\n      CapacityRebalance: true  # CRITICAL: Enables proactive replacement of at-risk Spot instances\n```",
      "Other": "1. In the AWS Console, go to EC2 > Auto Scaling Groups\n2. Select <example_resource_name> and open the Details tab\n3. Click Allocation strategies > Edit, check Capacity rebalancing\n4. Click Update/Save",
      "Terraform": "```hcl\n# Terraform: Enable Capacity Rebalancing on an Auto Scaling group\nresource \"aws_autoscaling_group\" \"<example_resource_name>\" {\n  name               = \"<example_resource_name>\"\n  min_size           = 1\n  max_size           = 1\n  desired_capacity   = 1\n  availability_zones = [\"<example_az>\"]\n\n  launch_template {\n    id    = \"<example_resource_id>\"\n    version = \"$Latest\"\n  }\n\n  capacity_rebalance = true  # CRITICAL: Turns on Capacity Rebalancing\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Capacity Rebalancing** for ASGs that use Spot.\n\nApply resilience practices:\n- Prefer `price-capacity-optimized` allocation\n- Keep headroom below `MaxSize`\n- Use lifecycle hooks to drain/deregister\n- Design stateless, interruption-tolerant workloads (least privilege and defense-in-depth for dependencies)",
      "Url": "https://hub.prowler.com/check/autoscaling_group_capacity_rebalance_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_capacity_rebalance_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_capacity_rebalance_enabled/autoscaling_group_capacity_rebalance_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.autoscaling.autoscaling_client import (
    autoscaling_client,
)


class autoscaling_group_capacity_rebalance_enabled(Check):
    def execute(self):
        findings = []
        for group in autoscaling_client.groups:
            if group.load_balancers and group.target_groups:
                report = Check_Report_AWS(metadata=self.metadata(), resource=group)

                report.status = "FAIL"
                report.status_extended = f"Autoscaling group {group.name} does not have capacity rebalance enabled."
                if group.capacity_rebalance:
                    report.status = "PASS"
                    report.status_extended = f"Autoscaling group {group.name} has capacity rebalance enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_elb_health_check_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_elb_health_check_enabled/autoscaling_group_elb_health_check_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "autoscaling_group_elb_health_check_enabled",
  "CheckTitle": "Auto Scaling group associated with a load balancer has ELB health checks enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "autoscaling",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsAutoScalingAutoScalingGroup",
  "Description": "EC2 Auto Scaling groups attached to a load balancer are evaluated for **ELB-based health checks** that use the load balancer's target health instead of instance-only checks.",
  "Risk": "Without **ELB health checks**, the group may keep instances that fail load balancer probes, causing:\n- Reduced **availability** from routing to bad targets\n- Higher error rates impacting transaction **integrity**\n- Inefficient scaling and increased **costs**",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/autoscaling-controls.html#autoscaling-1",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/AutoScaling/auto-scaling-group-health-check.html",
    "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-add-elb-healthcheck.html#as-add-elb-healthcheck-console"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws autoscaling update-auto-scaling-group --auto-scaling-group-name <auto-scaling-group-name> --health-check-type ELB",
      "NativeIaC": "```yaml\n# CloudFormation: Enable ELB health checks for the Auto Scaling group\nResources:\n  <example_resource_name>:\n    Type: AWS::AutoScaling::AutoScalingGroup\n    Properties:\n      HealthCheckType: ELB  # Remediation: use ELB health checks so the ASG evaluates instance health via the load balancer\n```",
      "Other": "1. In AWS Console, go to EC2 > Auto Scaling Groups\n2. Select the Auto Scaling group\n3. On the Details tab, click Edit under Health checks\n4. Under Additional health check types, select Elastic Load Balancing (ELB)\n5. Click Update/Save",
      "Terraform": "```hcl\n# Enable ELB health checks on the Auto Scaling group\nresource \"aws_autoscaling_group\" \"<example_resource_name>\" {\n  health_check_type = \"ELB\"  # Remediation: ensures ASG uses load balancer health status\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **ELB health checks** for Auto Scaling groups behind load balancers to reflect real client reachability. Apply **high availability** and **defense in depth** by:\n- Using application-appropriate LB probes\n- Tuning grace and threshold settings to avoid flapping\n- Monitoring health metrics and alerts",
      "Url": "https://hub.prowler.com/check/autoscaling_group_elb_health_check_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_elb_health_check_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_elb_health_check_enabled/autoscaling_group_elb_health_check_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.autoscaling.autoscaling_client import (
    autoscaling_client,
)


class autoscaling_group_elb_health_check_enabled(Check):
    def execute(self):
        findings = []
        for group in autoscaling_client.groups:
            if group.load_balancers and group.target_groups:
                report = Check_Report_AWS(metadata=self.metadata(), resource=group)

                report.status = "FAIL"
                report.status_extended = f"Autoscaling group {group.name} is associated with a load balancer but does not have ELB health checks enabled, instead it has {group.health_check_type} health checks."
                if "ELB" in group.health_check_type:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Autoscaling group {group.name} has ELB health checks enabled."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_launch_configuration_no_public_ip.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_launch_configuration_no_public_ip/autoscaling_group_launch_configuration_no_public_ip.metadata.json
Signals: Next.js

```json
{
  "Provider": "aws",
  "CheckID": "autoscaling_group_launch_configuration_no_public_ip",
  "CheckTitle": "Auto Scaling group associated launch configuration does not assign a public IP address",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "autoscaling",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsAutoScalingAutoScalingGroup",
  "Description": "**Amazon EC2 Auto Scaling groups** are evaluated to determine whether their associated **launch configuration** assigns **public IP addresses** to instances (e.g., `AssociatePublicIpAddress=true`).",
  "Risk": "**Publicly addressable instances** are reachable from the Internet, enabling reconnaissance, brute-force, and exploitation of exposed services.\n\nCompromise can lead to remote access, **data exfiltration**, and **lateral movement**, impacting **confidentiality**, **integrity**, and **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/autoscaling-controls.html#autoscaling-5",
    "https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-auto-scaling-groups-launch-configuration.html",
    "https://docs.aws.amazon.com/autoscaling/ec2/userguide/change-launch-config.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation Launch Configuration without public IPs\nResources:\n  <example_resource_name>:\n    Type: AWS::AutoScaling::LaunchConfiguration\n    Properties:\n      ImageId: <example_ami_id>\n      InstanceType: <example_instance_type>\n      AssociatePublicIpAddress: false  # Critical: disables assigning public IPs to instances\n```",
      "Other": "1. In the AWS console, go to EC2 > Auto Scaling > Launch configurations and click Create launch configuration\n2. Use the same AMI and instance type as the current group; under Advanced details set IP address type to Do not assign a public IP address\n3. Create the launch configuration\n4. Go to EC2 > Auto Scaling Groups, select your group, click Edit next to Launch configuration, choose the new configuration, and click Update",
      "Terraform": "```hcl\n# Launch Configuration without public IPs\nresource \"aws_launch_configuration\" \"<example_resource_name>\" {\n  image_id                    = \"<example_ami_id>\"\n  instance_type               = \"<example_instance_type>\"\n  associate_public_ip_address = false  # Critical: disables assigning public IPs\n}\n```"
    },
    "Recommendation": {
      "Text": "Place instances in private subnets and disable public addressing (`AssociatePublicIpAddress=false`). Publish services via **load balancers** or **private endpoints**, enforce **least privilege** security groups, and use **SSM**, VPN, or a hardened bastion for admin access. Prefer **launch templates** to standardize network controls.",
      "Url": "https://hub.prowler.com/check/autoscaling_group_launch_configuration_no_public_ip"
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

---[FILE: autoscaling_group_launch_configuration_no_public_ip.py]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_launch_configuration_no_public_ip/autoscaling_group_launch_configuration_no_public_ip.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.autoscaling.autoscaling_client import (
    autoscaling_client,
)


class autoscaling_group_launch_configuration_no_public_ip(Check):
    def execute(self):
        findings = []
        for group in autoscaling_client.groups:
            for lc in autoscaling_client.launch_configurations.values():
                if lc.name == group.launch_configuration_name:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=group)

                    report.status = "PASS"
                    report.status_extended = f"Autoscaling group {group.name} does not have an associated launch configuration assigning a public IP address."

                    if lc.public_ip:
                        report.status = "FAIL"
                        report.status_extended = f"Autoscaling group {group.name} has an associated launch configuration assigning a public IP address."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
