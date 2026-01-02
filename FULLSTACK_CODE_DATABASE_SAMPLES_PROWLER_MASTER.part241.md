---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 241
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 241 of 867)

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

---[FILE: autoscaling_group_launch_configuration_requires_imdsv2.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_launch_configuration_requires_imdsv2/autoscaling_group_launch_configuration_requires_imdsv2.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "autoscaling_group_launch_configuration_requires_imdsv2",
  "CheckTitle": "Auto Scaling group enforces IMDSv2 or disables the instance metadata service",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "TTPs/Credential Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "autoscaling",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsAutoScalingAutoScalingGroup",
  "Description": "Amazon EC2 Auto Scaling launch configurations are evaluated for **Instance Metadata Service** settings. Instances should have the metadata endpoint `enabled` with `http_tokens=required` (enforcing **IMDSv2**), or have the metadata service `disabled`.\n\nAllowing `http_tokens=optional` or omitting the version leaves legacy access enabled.",
  "Risk": "Without enforced **IMDSv2**, **SSRF** and local escape paths can access **IAM role credentials**, enabling unauthorized API calls.\n\nAttackers could:\n- Exfiltrate data with stolen tokens\n- Move laterally and modify resources, degrading confidentiality and integrity",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://trendmicro.com/cloudoneconformity/knowledge-base/aws/EC2/require-imds-v2.html",
    "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-IMDS-new-instances.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/autoscaling-controls.html#autoscaling-3",
    "https://aws.plainenglish.io/dont-let-metadata-leak-why-imdsv2-is-a-must-and-how-to-migrate-a88e1e285394"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws autoscaling create-launch-configuration --launch-configuration-name <new-launch-config> --image-id <AMI_ID> --instance-type <INSTANCE_TYPE> --metadata-options 'HttpTokens=required,HttpEndpoint=enabled'",
      "NativeIaC": "```yaml\n# CloudFormation: ASG launch configuration enforces IMDSv2\nResources:\n  LaunchConfig:\n    Type: AWS::AutoScaling::LaunchConfiguration\n    Properties:\n      ImageId: <example_ami_id>\n      InstanceType: <example_instance_type>\n      MetadataOptions:\n        HttpTokens: required     # critical: require IMDSv2 tokens (disables IMDSv1)\n        HttpEndpoint: enabled    # critical: keep IMDS enabled while enforcing v2\n\n  AutoScalingGroup:\n    Type: AWS::AutoScaling::AutoScalingGroup\n    Properties:\n      LaunchConfigurationName: !Ref LaunchConfig\n      MinSize: 1\n      MaxSize: 1\n      VPCZoneIdentifier:\n        - <example_subnet_id>\n```",
      "Other": "1. In the AWS Console, go to EC2 > Auto Scaling > Launch configurations\n2. Click Create launch configuration and choose the same AMI and instance type used by the group\n3. Expand Advanced details and set Metadata options to: Metadata accessible = Enabled, Metadata version = V2 only (token required)\n4. Create the launch configuration\n5. Go to EC2 > Auto Scaling > Auto Scaling groups, select the group, click Edit\n6. Under Launch configuration, select the new launch configuration and Save\n7. (Alternative) To disable IMDS entirely: when creating the launch configuration, set Metadata accessible = Disabled",
      "Terraform": "```hcl\n# ASG launch configuration enforces IMDSv2\nresource \"aws_launch_configuration\" \"example\" {\n  image_id      = \"<example_ami_id>\"\n  instance_type = \"<example_instance_type>\"\n\n  metadata_options {\n    http_tokens   = \"required\"  # critical: require IMDSv2 tokens (blocks IMDSv1)\n    http_endpoint = \"enabled\"   # critical: IMDS enabled while enforcing v2\n  }\n}\n\nresource \"aws_autoscaling_group\" \"example\" {\n  launch_configuration = aws_launch_configuration.example.name\n  min_size             = 1\n  max_size             = 1\n  vpc_zone_identifier  = [\"<example_subnet_id>\"]\n}\n```"
    },
    "Recommendation": {
      "Text": "Require **IMDSv2** for Auto Scaling-launched instances by setting `http_tokens=required` when metadata is `enabled`. *If metadata is not needed*, disable it.\n\nApply **least privilege** to instance roles, set IMDSv2 as an account default, and use **defense in depth** (egress filtering, SSRF protections) to limit exposure.",
      "Url": "https://hub.prowler.com/check/autoscaling_group_launch_configuration_requires_imdsv2"
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

---[FILE: autoscaling_group_launch_configuration_requires_imdsv2.py]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_launch_configuration_requires_imdsv2/autoscaling_group_launch_configuration_requires_imdsv2.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.autoscaling.autoscaling_client import (
    autoscaling_client,
)


class autoscaling_group_launch_configuration_requires_imdsv2(Check):
    def execute(self):
        findings = []
        for group in autoscaling_client.groups:
            for (
                launch_configuration
            ) in autoscaling_client.launch_configurations.values():
                if launch_configuration.name == group.launch_configuration_name:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=group)

                    report.status = "FAIL"
                    report.status_extended = f"Autoscaling group {group.name} has IMDSv2 disabled or not required."
                    if (
                        launch_configuration.http_endpoint == "enabled"
                        and launch_configuration.http_tokens == "required"
                    ):
                        report.status = "PASS"
                        report.status_extended = f"Autoscaling group {group.name} has IMDSv2 enabled and required."
                    elif launch_configuration.http_endpoint == "disabled":
                        report.status = "PASS"
                        report.status_extended = f"Autoscaling group {group.name} has metadata service disabled."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_multiple_az.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_multiple_az/autoscaling_group_multiple_az.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "autoscaling_group_multiple_az",
  "CheckTitle": "Auto Scaling group uses multiple Availability Zones",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "autoscaling",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsAutoScalingAutoScalingGroup",
  "Description": "**EC2 Auto Scaling groups** use **multiple Availability Zones** within a Region, with instances distributed across more than one zone rather than confined to a single zone.",
  "Risk": "Relying on a single zone concentrates failure risk and harms **availability**. An AZ outage or capacity shortfall can block replacements and scaling, causing downtime, dropped traffic, and a wider blast radius. Recovery can lag because workloads can't shift to healthy zones.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-add-az-console.html",
    "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-availability-zone-balanced.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/AutoScaling/multiple-availability-zones.html",
    "https://docs.aws.amazon.com/autoscaling/ec2/userguide/disaster-recovery-resiliency.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws autoscaling update-auto-scaling-group --auto-scaling-group-name <example_resource_name> --vpc-zone-identifier \"<subnet_id_az1>,<subnet_id_az2>\"",
      "NativeIaC": "```yaml\n# CloudFormation: ensure ASG spans multiple AZs\nResources:\n  <example_resource_name>:\n    Type: AWS::AutoScaling::AutoScalingGroup\n    Properties:\n      MinSize: '1'\n      MaxSize: '1'\n      LaunchTemplate:\n        LaunchTemplateId: <example_resource_id>\n        Version: '$Latest'\n      VPCZoneIdentifier:\n        - <subnet_id_az1>\n        - <subnet_id_az2>  # CRITICAL: Add a second subnet in a different AZ to ensure multiple AZs\n```",
      "Other": "1. In the AWS Console, go to EC2 > Auto Scaling Groups\n2. Select the group and open the Details tab\n3. Click Network > Edit\n4. In Subnets, add one more subnet from a different Availability Zone\n5. Click Update to save",
      "Terraform": "```hcl\n# Terraform: ensure ASG spans multiple AZs\nresource \"aws_autoscaling_group\" \"<example_resource_name>\" {\n  min_size = 1\n  max_size = 1\n\n  launch_template {\n    id      = \"<example_resource_id>\"\n    version = \"$Latest\"\n  }\n\n  vpc_zone_identifier = [\n    \"<subnet_id_az1>\",\n    \"<subnet_id_az2>\" # CRITICAL: two subnets in different AZs to pass the check\n  ]\n}\n```"
    },
    "Recommendation": {
      "Text": "Distribute each group across at least two **Availability Zones** to design for failure. Use a load balancer to spread traffic and health-based replacement to sustain capacity. Apply **resilience** and **fault isolation** principles so service continues during zonal degradation.",
      "Url": "https://hub.prowler.com/check/autoscaling_group_multiple_az"
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

---[FILE: autoscaling_group_multiple_az.py]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_multiple_az/autoscaling_group_multiple_az.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.autoscaling.autoscaling_client import (
    autoscaling_client,
)


class autoscaling_group_multiple_az(Check):
    def execute(self):
        findings = []
        for group in autoscaling_client.groups:
            report = Check_Report_AWS(metadata=self.metadata(), resource=group)

            report.status = "FAIL"
            report.status_extended = (
                f"Autoscaling group {group.name} has only one availability zones."
            )
            if len(group.availability_zones) > 1:
                report.status = "PASS"
                report.status_extended = (
                    f"Autoscaling group {group.name} has multiple availability zones."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_multiple_instance_types.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_multiple_instance_types/autoscaling_group_multiple_instance_types.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "autoscaling_group_multiple_instance_types",
  "CheckTitle": "Auto Scaling group spans multiple Availability Zones and has multiple instance types per Availability Zone",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "autoscaling",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsAutoScalingAutoScalingGroup",
  "Description": "**EC2 Auto Scaling groups** are evaluated for using **multiple instance types** in each **Availability Zone** and spanning more than one AZ.\n\nGroups are identified when every AZ defines at least two instance types; groups with any AZ using a single or no type, or confined to one AZ, are noted.",
  "Risk": "Limited to one instance type per AZ or a single AZ, scaling can stall during **capacity shortages**, hindering **failover** and degrading **availability** (timeouts, backlog growth). Costs may spike if only expensive capacity is available. Reduced diversity increases the likelihood of prolonged outages during zonal or market disruptions.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/AutoScaling/asg-multiple-instance-type-az.html",
    "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/autoscaling-controls.html#autoscaling-6"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws autoscaling update-auto-scaling-group --auto-scaling-group-name <example_resource_name> --mixed-instances-policy '{\"LaunchTemplate\":{\"LaunchTemplateSpecification\":{\"LaunchTemplateName\":\"<example_resource_name>\",\"Version\":\"$Latest\"},\"Overrides\":[{\"InstanceType\":\"<INSTANCE_TYPE_1>\"},{\"InstanceType\":\"<INSTANCE_TYPE_2>\"}]}}' --vpc-zone-identifier \"<subnet_id_1>,<subnet_id_2>\"",
      "NativeIaC": "```yaml\n# CloudFormation: Ensure ASG uses multiple instance types across multiple AZs\nResources:\n  <example_resource_name>:\n    Type: AWS::AutoScaling::AutoScalingGroup\n    Properties:\n      MinSize: \"1\"\n      MaxSize: \"1\"\n      VPCZoneIdentifier:\n        - <subnet_id_1>  # CRITICAL: Use subnets in different AZs to span multiple AZs\n        - <subnet_id_2>  # CRITICAL: Ensures at least two Availability Zones\n      MixedInstancesPolicy:\n        LaunchTemplate:\n          LaunchTemplateSpecification:\n            LaunchTemplateName: <example_resource_name>\n            Version: $Latest\n          Overrides:\n            - InstanceType: <INSTANCE_TYPE_1>  # CRITICAL: Multiple instance types per AZ\n            - InstanceType: <INSTANCE_TYPE_2>  # CRITICAL: Multiple instance types per AZ\n```",
      "Other": "1. In the AWS Console, go to EC2 > Auto Scaling Groups and select <example_resource_name>\n2. Click Edit\n3. Under Network, add at least two subnets in different Availability Zones\n4. Under Launch options, choose Mixed instance types\n5. Select your Launch template and set Version to $Latest\n6. Add at least two Instance types in Overrides\n7. Click Update to save",
      "Terraform": "```hcl\n# Terraform: Ensure ASG uses multiple instance types across multiple AZs\nresource \"aws_autoscaling_group\" \"<example_resource_name>\" {\n  name               = \"<example_resource_name>\"\n  min_size           = 1\n  max_size           = 1\n  vpc_zone_identifier = [\"<subnet_id_1>\", \"<subnet_id_2>\"] # CRITICAL: Subnets in different AZs\n\n  mixed_instances_policy {\n    launch_template {\n      launch_template_specification {\n        launch_template_name = \"<example_resource_name>\"\n        version              = \"$Latest\"\n      }\n      override { instance_type = \"<INSTANCE_TYPE_1>\" } # CRITICAL: Multiple instance types per AZ\n      override { instance_type = \"<INSTANCE_TYPE_2>\" } # CRITICAL: Multiple instance types per AZ\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Adopt a **mixed instances** strategy for resilience:\n- Use diverse instance families and sizes per AZ\n- Distribute capacity across multiple AZs\n- Favor allocation approaches that tolerate spot/on-demand scarcity\nApply **redundancy** and **fault tolerance** principles and validate scaling policies to avoid single points of capacity failure.",
      "Url": "https://hub.prowler.com/check/autoscaling_group_multiple_instance_types"
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

---[FILE: autoscaling_group_multiple_instance_types.py]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_multiple_instance_types/autoscaling_group_multiple_instance_types.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.autoscaling.autoscaling_client import (
    autoscaling_client,
)


class autoscaling_group_multiple_instance_types(Check):
    def execute(self):
        findings = []
        for group in autoscaling_client.groups:
            report = Check_Report_AWS(metadata=self.metadata(), resource=group)

            report.status = "FAIL"
            report.status_extended = f"Autoscaling group {group.name} does not have multiple instance types in multiple Availability Zones."

            failing_azs = []

            for az, types in group.az_instance_types.items():
                if len(types) < 2:
                    failing_azs.append(az)

            if not failing_azs and len(group.az_instance_types) > 1:
                report.status = "PASS"
                report.status_extended = f"Autoscaling group {group.name} has multiple instance types in each of its Availability Zones."
            elif failing_azs:
                azs_str = ", ".join(failing_azs)
                report.status_extended = f"Autoscaling group {group.name} has only one or no instance types in Availability Zone(s): {azs_str}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_using_ec2_launch_template.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_using_ec2_launch_template/autoscaling_group_using_ec2_launch_template.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "autoscaling_group_using_ec2_launch_template",
  "CheckTitle": "Amazon EC2 Auto Scaling group uses an EC2 launch template",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "autoscaling",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsAutoScalingAutoScalingGroup",
  "Description": "**EC2 Auto Scaling groups** use an **EC2 launch template** directly or via a `mixed instances policy` to define instance configuration and versioned settings.",
  "Risk": "Without a launch template, there is no **versioned, auditable baseline** for instance settings, increasing configuration drift. Inconsistent metadata and network options can enable unauthorized access or unstable deployments, degrading confidentiality and availability.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/AutoScaling/asg-launch-template.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/autoscaling-controls.html#autoscaling-9",
    "https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-launch-template.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws autoscaling update-auto-scaling-group --auto-scaling-group-name <example_resource_name> --launch-template LaunchTemplateId=<template-id>",
      "NativeIaC": "```yaml\n# CloudFormation: attach a Launch Template to the ASG\nResources:\n  ASG:\n    Type: AWS::AutoScaling::AutoScalingGroup\n    Properties:\n      MinSize: '0'\n      MaxSize: '1'\n      VPCZoneIdentifier:\n        - <example_subnet_id>\n      LaunchTemplate: # critical: ensures the ASG uses an EC2 launch template (fixes the check)\n        LaunchTemplateId: <example_launch_template_id> # references the EC2 Launch Template\n        Version: $Default\n```",
      "Other": "1. In the AWS console, go to EC2 > Auto Scaling Groups\n2. Select <example_resource_name> and click Edit\n3. Under \"Launch template or configuration\", choose Launch template and select your template and version (Default or Latest)\n4. Click Update to save",
      "Terraform": "```hcl\n# Terraform: attach a Launch Template to the ASG\nresource \"aws_autoscaling_group\" \"example\" {\n  min_size            = 0\n  max_size            = 1\n  vpc_zone_identifier = [\"<example_subnet_id>\"]\n\n  launch_template {\n    id      = \"<example_launch_template_id>\" # critical: ensures the ASG uses an EC2 launch template (fixes the check)\n    version = \"$Default\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Adopt **launch templates** for all Auto Scaling groups and include them in any `mixed instances policy`. Use versioning with approvals, enforce hardened defaults (least privilege roles, secure metadata like `IMDSv2`, encrypted storage), and apply change control to ensure consistency and defense in depth.",
      "Url": "https://hub.prowler.com/check/autoscaling_group_using_ec2_launch_template"
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

---[FILE: autoscaling_group_using_ec2_launch_template.py]---
Location: prowler-master/prowler/providers/aws/services/autoscaling/autoscaling_group_using_ec2_launch_template/autoscaling_group_using_ec2_launch_template.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.autoscaling.autoscaling_client import (
    autoscaling_client,
)


class autoscaling_group_using_ec2_launch_template(Check):
    def execute(self):
        findings = []
        for group in autoscaling_client.groups:
            report = Check_Report_AWS(metadata=self.metadata(), resource=group)

            report.status = "PASS"
            report.status_extended = (
                f"Autoscaling group {group.name} is using an EC2 launch template."
            )
            if (
                not group.launch_template
                and not group.mixed_instances_policy_launch_template
            ):
                report.status = "FAIL"
                report.status_extended = f"Autoscaling group {group.name} is not using an EC2 launch template."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: awslambda_client.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_client.py

```python
from prowler.providers.aws.services.awslambda.awslambda_service import Lambda
from prowler.providers.common.provider import Provider

awslambda_client = Lambda(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: awslambda_service.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_service.py
Signals: Pydantic

```python
import io
import json
import zipfile
from concurrent.futures import as_completed
from enum import Enum
from typing import Any, Optional

import requests
from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Lambda(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.functions = {}
        self.__threading_call__(self._list_functions)
        self._list_tags_for_resource()
        self.__threading_call__(self._get_policy)
        self.__threading_call__(self._get_function_url_config)

    def _list_functions(self, regional_client):
        logger.info("Lambda - Listing Functions...")
        try:
            list_functions_paginator = regional_client.get_paginator("list_functions")
            for page in list_functions_paginator.paginate():
                for function in page["Functions"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            function["FunctionArn"], self.audit_resources
                        )
                    ):
                        lambda_name = function["FunctionName"]
                        lambda_arn = function["FunctionArn"]
                        vpc_config = function.get("VpcConfig", {})
                        # We must use the Lambda ARN as the dict key since we could have Lambdas in different regions with the same name
                        self.functions[lambda_arn] = Function(
                            name=lambda_name,
                            arn=lambda_arn,
                            security_groups=vpc_config.get("SecurityGroupIds", []),
                            vpc_id=vpc_config.get("VpcId"),
                            subnet_ids=set(vpc_config.get("SubnetIds", [])),
                            region=regional_client.region,
                        )
                        if "Runtime" in function:
                            self.functions[lambda_arn].runtime = function["Runtime"]
                        if "Environment" in function:
                            lambda_environment = function["Environment"].get(
                                "Variables"
                            )
                            self.functions[lambda_arn].environment = lambda_environment

        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _get_function_code(self):
        logger.info("Lambda - Getting Function Code...")
        # Use a thread pool handle the queueing and execution of the _fetch_function_code tasks, up to max_workers tasks concurrently.
        lambda_functions_to_fetch = {
            self.thread_pool.submit(
                self._fetch_function_code, function.name, function.region
            ): function
            for function in self.functions.values()
        }

        for fetched_lambda_code in as_completed(lambda_functions_to_fetch):
            function = lambda_functions_to_fetch[fetched_lambda_code]
            try:
                function_code = fetched_lambda_code.result()
                if function_code:
                    yield function, function_code
            except Exception as error:
                logger.error(
                    f"{function.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _fetch_function_code(self, function_name, function_region):
        try:
            regional_client = self.regional_clients[function_region]
            function_information = regional_client.get_function(
                FunctionName=function_name
            )
            if "Location" in function_information["Code"]:
                code_location_uri = function_information["Code"]["Location"]
                raw_code_zip = requests.get(code_location_uri).content
                return LambdaCode(
                    location=code_location_uri,
                    code_zip=zipfile.ZipFile(io.BytesIO(raw_code_zip)),
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            raise

    def _get_policy(self, regional_client):
        logger.info("Lambda - Getting Policy...")
        try:
            for function in self.functions.values():
                if function.region == regional_client.region:
                    try:
                        function_policy = regional_client.get_policy(
                            FunctionName=function.name
                        )
                        self.functions[function.arn].policy = json.loads(
                            function_policy["Policy"]
                        )
                    except ClientError as e:
                        if e.response["Error"]["Code"] == "ResourceNotFoundException":
                            self.functions[function.arn].policy = {}

        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _get_function_url_config(self, regional_client):
        logger.info("Lambda - Getting Function URL Config...")
        try:
            for function in self.functions.values():
                if function.region == regional_client.region:
                    try:
                        function_url_config = regional_client.get_function_url_config(
                            FunctionName=function.name
                        )
                        if "Cors" in function_url_config:
                            allow_origins = function_url_config["Cors"]["AllowOrigins"]
                        else:
                            allow_origins = []
                        self.functions[function.arn].url_config = URLConfig(
                            auth_type=function_url_config["AuthType"],
                            url=function_url_config["FunctionUrl"],
                            cors_config=URLConfigCORS(allow_origins=allow_origins),
                        )
                    except ClientError as e:
                        if e.response["Error"]["Code"] == "ResourceNotFoundException":
                            self.functions[function.arn].url_config = None

        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("Lambda - List Tags...")
        try:
            for function in self.functions.values():
                try:
                    regional_client = self.regional_clients[function.region]
                    response = regional_client.list_tags(Resource=function.arn)["Tags"]
                    function.tags = [response]
                except ClientError as e:
                    if e.response["Error"]["Code"] == "ResourceNotFoundException":
                        function.tags = []

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class LambdaCode(BaseModel):
    location: str
    code_zip: Any


class AuthType(Enum):
    NONE = "NONE"
    AWS_IAM = "AWS_IAM"


class URLConfigCORS(BaseModel):
    allow_origins: list[str]


class URLConfig(BaseModel):
    auth_type: AuthType
    url: str
    cors_config: URLConfigCORS


class Function(BaseModel):
    name: str
    arn: str
    security_groups: list
    runtime: Optional[str] = None
    environment: dict = None
    region: str
    policy: dict = {}
    code: LambdaCode = None
    url_config: URLConfig = None
    vpc_id: Optional[str] = None
    subnet_ids: Optional[set] = None
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_inside_vpc.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_inside_vpc/awslambda_function_inside_vpc.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "awslambda_function_inside_vpc",
  "CheckTitle": "Lambda function is deployed inside a VPC",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "awslambda",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsLambdaFunction",
  "Description": "**AWS Lambda function** uses **VPC networking** with specified subnets and security groups, rather than the default Lambda-managed network.\n\nPresence of a VPC association (`vpc_id`) indicates private connectivity to VPC resources.",
  "Risk": "Without VPC attachment, functions lack network isolation and granular egress control, weakening **confidentiality** and **integrity**.\n\nTraffic must use public endpoints, raising risks of data exfiltration and SSRF via unrestricted outbound. If private databases are required, missing VPC access can impact **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html",
    "https://repost.aws/pt/knowledge-center/lambda-dedicated-vpc",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Lambda/function-in-vpc.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/lambda-controls.html#lambda-3",
    "https://stackoverflow.com/questions/55074793/how-can-we-force-aws-lamda-to-run-securely-in-a-vpc",
    "https://www.techtarget.com/searchCloudComputing/answer/How-do-I-configure-AWS-Lambda-functions-in-a-VPC/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws lambda update-function-configuration --function-name <example_resource_name> --vpc-config SubnetIds=<example_subnet_id>,SecurityGroupIds=<example_security_group_id>",
      "NativeIaC": "```yaml\nAWSTemplateFormatVersion: '2010-09-09'\nResources:\n  LambdaFunction:\n    Type: AWS::Lambda::Function\n    Properties:\n      FunctionName: <example_resource_name>\n      Role: <example_role_arn>\n      Handler: index.handler\n      Runtime: python3.12\n      Code:\n        S3Bucket: <example_code_bucket>\n        S3Key: <example_code_key>\n      # Critical: Attach the function to a VPC by specifying at least one subnet and one security group\n      # This sets VpcConfig, which gives the function a VPC ID and makes the check PASS\n      VpcConfig:\n        SubnetIds:\n          - <example_subnet_id>\n        SecurityGroupIds:\n          - <example_security_group_id>\n```",
      "Other": "1. In the AWS Lambda console, open your function\n2. Go to Configuration > VPC and click Edit\n3. Select the target VPC\n4. Choose at least one Subnet and one Security group\n5. Click Save",
      "Terraform": "```hcl\nresource \"aws_lambda_function\" \"example\" {\n  function_name = \"<example_resource_name>\"\n  role          = \"<example_role_arn>\"\n  handler       = \"index.handler\"\n  runtime       = \"python3.12\"\n  filename      = \"<example_package.zip>\"\n\n  # Critical: VPC config attaches the function to a VPC, providing a VPC ID so the check passes\n  vpc_config {\n    subnet_ids         = [\"<example_subnet_id>\"]      # at least one subnet\n    security_group_ids = [\"<example_security_group_id>\"]\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Attach functions to a VPC with private subnets and restrictive security groups to enforce **least privilege** and egress control.\n- Prefer **VPC endpoints** for AWS services\n- Use NAT only when necessary\n- Spread subnets across AZs for resilience\n- Govern with IAM conditions requiring `VpcIds`, `SubnetIds`, and `SecurityGroupIds`.",
      "Url": "https://hub.prowler.com/check/awslambda_function_inside_vpc"
    }
  },
  "Categories": [
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_inside_vpc.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_inside_vpc/awslambda_function_inside_vpc.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client


class awslambda_function_inside_vpc(Check):
    def execute(self) -> List[Check_Report_AWS]:
        findings = []
        for function_arn, function in awslambda_client.functions.items():
            report = Check_Report_AWS(metadata=self.metadata(), resource=function)

            report.status = "PASS"
            report.status_extended = (
                f"Lambda function {function.name} is inside of VPC {function.vpc_id}"
            )

            if not function.vpc_id:
                awslambda_client.set_failed_check(
                    self.__class__.__name__,
                    function_arn,
                )
                report.status = "FAIL"
                report.status_extended = (
                    f"Lambda function {function.name} is not inside a VPC"
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_invoke_api_operations_cloudtrail_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_invoke_api_operations_cloudtrail_logging_enabled/awslambda_function_invoke_api_operations_cloudtrail_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)


class awslambda_function_invoke_api_operations_cloudtrail_logging_enabled(Check):
    def execute(self):
        findings = []
        for function in awslambda_client.functions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=function)

            report.status = "FAIL"
            report.status_extended = (
                f"Lambda function {function.name} is not recorded by CloudTrail."
            )
            lambda_recorded_cloudtrail = False
            if cloudtrail_client.trails:
                for trail in cloudtrail_client.trails.values():
                    for data_event in trail.data_events:
                        # classic event selectors
                        if not data_event.is_advanced:
                            if "DataResources" in data_event.event_selector:
                                for resource in data_event.event_selector[
                                    "DataResources"
                                ]:
                                    if resource["Type"] == "AWS::Lambda::Function" and (
                                        function.arn in resource["Values"]
                                        or f"arn:{awslambda_client.audited_partition}:lambda"
                                        in resource["Values"]
                                    ):
                                        lambda_recorded_cloudtrail = True
                                        break
                        elif data_event.is_advanced:
                            for field_selector in data_event.event_selector[
                                "FieldSelectors"
                            ]:
                                if (
                                    field_selector["Field"] == "resources.type"
                                    and "AWS::Lambda::Function"
                                    in field_selector["Equals"]
                                ):
                                    lambda_recorded_cloudtrail = True
                                    break
                        if lambda_recorded_cloudtrail:
                            break
                    if lambda_recorded_cloudtrail:
                        report.status = "PASS"
                        report.status_extended = f"Lambda function {function.name} is recorded by CloudTrail trail {trail.name}."
                        break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
