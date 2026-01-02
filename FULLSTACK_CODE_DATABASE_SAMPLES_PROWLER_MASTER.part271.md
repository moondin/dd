---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 271
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 271 of 867)

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

---[FILE: ec2_instance_port_ssh_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_ssh_exposed_to_internet/ec2_instance_port_ssh_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing SSH ports (22) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies SSH ports open to the Internet.
    Requires the ec2:RevokeSecurityGroupIngress permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "ec2:RevokeSecurityGroupIngress",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The EC2 instance ID.
        region (str): The AWS region where the EC2 instance exists.
    Returns:
        bool: True if the operation is successful (ingress rule revoked), False otherwise.
    """
    try:
        regional_client = ec2_client.regional_clients[region]
        check_ports = [22]
        for instance in ec2_client.instances:
            if instance.id == resource_id:
                for sg in ec2_client.security_groups.values():
                    if sg.id in instance.security_groups:
                        for ingress_rule in sg.ingress_rules:
                            if check_security_group(
                                ingress_rule, "tcp", check_ports, any_address=True
                            ):
                                regional_client.revoke_security_group_ingress(
                                    GroupId=sg.id,
                                    IpPermissions=[ingress_rule],
                                )

    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_telnet_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_telnet_exposed_to_internet/ec2_instance_port_telnet_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_telnet_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 23 (Telnet).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 23 (Telnet).",
  "Risk": "Telnet is an insecure protocol that transmits data in plain text. Exposure of Telnet services to the internet can lead to unauthorized access to the EC2 instance.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group associated with the EC2 instance to remove the rule that allows ingress from the internet to TCP port 23.",
      "Url": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html"
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

---[FILE: ec2_instance_port_telnet_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_telnet_exposed_to_internet/ec2_instance_port_telnet_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_telnet_exposed_to_internet(Check):
    # EC2 Instances with Telnet port 23 open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [23]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have Telnet port 23 open to the Internet."
            is_open_port = False
            if instance.security_groups:
                for sg in ec2_client.security_groups.values():
                    if sg.id in instance.security_groups:
                        for ingress_rule in sg.ingress_rules:
                            if check_security_group(
                                ingress_rule, "tcp", check_ports, any_address=True
                            ):
                                # The port is open, now check if the instance is in a public subnet with a public IP
                                report.status = "FAIL"
                                (
                                    report.status_extended,
                                    report.check_metadata.Severity,
                                ) = get_instance_public_status(
                                    vpc_client.vpc_subnets, instance, "Telnet"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_telnet_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_telnet_exposed_to_internet/ec2_instance_port_telnet_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing Telnet ports (23) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies Telnet ports open to the Internet.
    Requires the ec2:RevokeSecurityGroupIngress permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "ec2:RevokeSecurityGroupIngress",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The EC2 instance ID.
        region (str): The AWS region where the EC2 instance exists.
    Returns:
        bool: True if the operation is successful (ingress rule revoked), False otherwise.
    """
    try:
        regional_client = ec2_client.regional_clients[region]
        check_ports = [23]
        for instance in ec2_client.instances:
            if instance.id == resource_id:
                for sg in ec2_client.security_groups.values():
                    if sg.id in instance.security_groups:
                        for ingress_rule in sg.ingress_rules:
                            if check_security_group(
                                ingress_rule, "tcp", check_ports, any_address=True
                            ):
                                regional_client.revoke_security_group_ingress(
                                    GroupId=sg.id,
                                    IpPermissions=[ingress_rule],
                                )

    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_profile_attached.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_profile_attached/ec2_instance_profile_attached.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_profile_attached",
  "CheckTitle": "Ensure IAM instance roles are used for AWS resource access from instances",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure IAM instance roles are used for AWS resource access from instances.",
  "Risk": "AWS access from within AWS instances can be done by either encoding AWS keys into AWS API calls or by assigning the instance to a role which has an appropriate permissions policy for the required access. AWS IAM roles reduce the risks associated with sharing and rotating credentials that can be used outside of AWS itself. If credentials are compromised, they can be used from outside of the AWS account.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://github.com/cloudmatos/matos/tree/master/remediations/aws/ec2/attach_iam_roles_ec2_instances",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create an IAM instance role if necessary and attach it to the corresponding EC2 instance..",
      "Url": "http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_profile_attached.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_profile_attached/ec2_instance_profile_attached.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_instance_profile_attached(Check):
    def execute(self):
        findings = []
        for instance in ec2_client.instances:
            if instance.state != "terminated":
                report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
                report.status = "FAIL"
                report.status_extended = f"EC2 Instance {instance.id} not associated with an Instance Profile Role."
                if instance.instance_profile:
                    report.status = "PASS"
                    report.status_extended = f"EC2 Instance {instance.id} associated with Instance Profile Role {instance.instance_profile['Arn']}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_public_ip.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_public_ip/ec2_instance_public_ip.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_public_ip",
  "CheckTitle": "Check for EC2 Instances with Public IP.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Instance",
  "Description": "Check for EC2 Instances with Public IP.",
  "Risk": "Exposing an EC2 directly to internet increases the attack surface and therefore the risk of compromise.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/aws/public-policies/public_12#cloudformation",
      "Other": "https://docs.prowler.com/checks/aws/public-policies/public_12#aws-console",
      "Terraform": "https://docs.prowler.com/checks/aws/public-policies/public_12#terraform"
    },
    "Recommendation": {
      "Text": "Use an ALB and apply WAF ACL.",
      "Url": "https://aws.amazon.com/blogs/aws/aws-web-application-firewall-waf-for-application-load-balancers/"
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

---[FILE: ec2_instance_public_ip.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_public_ip/ec2_instance_public_ip.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_instance_public_ip(Check):
    def execute(self):
        findings = []
        for instance in ec2_client.instances:
            if instance.state != "terminated":
                report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = (
                    f"EC2 Instance {instance.id} does not have a Public IP."
                )
                if instance.public_ip:
                    report.status = "FAIL"
                    report.status_extended = f"EC2 Instance {instance.id} has a Public IP: {instance.public_ip} ({instance.public_dns})."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_secrets_user_data.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_secrets_user_data/ec2_instance_secrets_user_data.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_secrets_user_data",
  "CheckTitle": "Find secrets in EC2 User Data.",
  "CheckType": [
    "IAM"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:access-analyzer:region:account-id:analyzer/resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Find secrets in EC2 User Data.",
  "Risk": "Secrets hardcoded into instance user data can be used by malware and bad actors to gain lateral access to other services.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 describe-instance-attribute --attribute userData --region <REGION> --instance-id <INSTANCE_ID> --query UserData.Value --output text > encodeddata; base64 --decode encodeddata",
      "NativeIaC": "https://docs.prowler.com/checks/aws/secrets-policies/bc_aws_secrets_1#cloudformation",
      "Other": "https://docs.prowler.com/checks/aws/secrets-policies/bc_aws_secrets_1",
      "Terraform": "https://docs.prowler.com/checks/aws/secrets-policies/bc_aws_secrets_1#terraform"
    },
    "Recommendation": {
      "Text": "Implement automated detective control (e.g. using tools like Prowler) to scan accounts for passwords and secrets. Use secrets manager service to store and retrieve passwords and secrets.",
      "Url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html"
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

---[FILE: ec2_instance_secrets_user_data.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_secrets_user_data/ec2_instance_secrets_user_data.py

```python
import zlib
from base64 import b64decode

from prowler.config.config import encoding_format_utf_8
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.logger import logger
from prowler.lib.utils.utils import detect_secrets_scan
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_instance_secrets_user_data(Check):
    def execute(self):
        findings = []
        secrets_ignore_patterns = ec2_client.audit_config.get(
            "secrets_ignore_patterns", []
        )
        for instance in ec2_client.instances:
            if instance.state != "terminated":
                report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
                if instance.user_data:
                    user_data = b64decode(instance.user_data)
                    try:
                        if user_data[0:2] == b"\x1f\x8b":  # GZIP magic number
                            user_data = zlib.decompress(
                                user_data, zlib.MAX_WBITS | 32
                            ).decode(encoding_format_utf_8)
                        else:
                            user_data = user_data.decode(encoding_format_utf_8)
                    except UnicodeDecodeError as error:
                        logger.warning(
                            f"{instance.region} -- Unable to decode user data in EC2 instance {instance.id}: {error}"
                        )
                        continue
                    except Exception as error:
                        logger.error(
                            f"{instance.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                        continue
                    detect_secrets_output = detect_secrets_scan(
                        data=user_data,
                        excluded_secrets=secrets_ignore_patterns,
                        detect_secrets_plugins=ec2_client.audit_config.get(
                            "detect_secrets_plugins"
                        ),
                    )
                    if detect_secrets_output:
                        secrets_string = ", ".join(
                            [
                                f"{secret['type']} on line {secret['line_number']}"
                                for secret in detect_secrets_output
                            ]
                        )
                        report.status = "FAIL"
                        report.status_extended = f"Potential secret found in EC2 instance {instance.id} User Data -> {secrets_string}."

                    else:
                        report.status = "PASS"
                        report.status_extended = (
                            f"No secrets found in EC2 instance {instance.id} User Data."
                        )
                else:
                    report.status = "PASS"
                    report.status_extended = f"No secrets found in EC2 instance {instance.id} since User Data is empty."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_uses_single_eni.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_uses_single_eni/ec2_instance_uses_single_eni.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_uses_single_eni",
  "CheckTitle": "Amazon EC2 instances should not use multiple ENIs",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:instance/resource-id",
  "Severity": "low",
  "ResourceType": "AwsEc2Instance",
  "Description": "This control checks whether an EC2 instance uses multiple Elastic Network Interfaces (ENIs) or Elastic Fabric Adapters (EFAs). This control passes if a single network adapter is used. The control includes an optional parameter list to identify the allowed ENIs. This control also fails if an EC2 instance that belongs to an Amazon EKS cluster uses more than one ENI. If your EC2 instances need to have multiple ENIs as part of an Amazon EKS cluster, you can suppress those control findings.",
  "Risk": "Multiple ENIs can cause dual-homed instances, meaning instances that have multiple subnets. This can add network security complexity and introduce unintended network paths and access.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-multiple-eni-check.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html#ec2-17",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To detach a network interface from an EC2 instance, follow the instructions in the Amazon EC2 User Guide.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html#detach_eni"
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

---[FILE: ec2_instance_uses_single_eni.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_uses_single_eni/ec2_instance_uses_single_eni.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_instance_uses_single_eni(Check):
    def execute(self):
        findings = []
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            eni_types = {"efa": [], "interface": [], "trunk": []}
            if not instance.network_interfaces:
                report.status = "PASS"
                report.status_extended = (
                    f"EC2 Instance {instance.id} has no network interfaces attached."
                )
            else:
                for eni_id in instance.network_interfaces:
                    if (
                        eni_id in ec2_client.network_interfaces
                        and ec2_client.network_interfaces[eni_id].type in eni_types
                    ):
                        eni_types[ec2_client.network_interfaces[eni_id].type].append(
                            eni_id
                        )

                message_status_extended = ""
                if (
                    len(eni_types["efa"])
                    + len(eni_types["interface"])
                    + len(eni_types["trunk"])
                    > 1
                ):
                    report.status = "FAIL"
                    message_status_extended = (
                        f"EC2 Instance {instance.id} uses multiple ENIs: ("
                    )
                else:
                    report.status = "PASS"
                    message_status_extended = (
                        f"EC2 Instance {instance.id} uses only one ENI: ("
                    )

                if eni_types["efa"]:
                    message_status_extended += f" EFAs: {eni_types['efa']}"
                if eni_types["interface"]:
                    message_status_extended += f" Interfaces: {eni_types['interface']}"
                if eni_types["trunk"]:
                    message_status_extended += f" Trunks: {eni_types['trunk']}"
                report.status_extended = message_status_extended + " )."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_with_outdated_ami.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_with_outdated_ami/ec2_instance_with_outdated_ami.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_with_outdated_ami",
  "CheckTitle": "Check for EC2 Instances Using Outdated AMIs",
  "CheckType": [],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:instance/resource-id",
  "Severity": "high",
  "ResourceType": "AwsEc2Instance",
  "Description": "This check identifies EC2 instances using outdated Amazon Machine Images (AMIs) by auditing instances to gather AMI IDs, comparing them against the latest available versions, verifying suppo and security update status, and checking for deprecation.",
  "Risk": "Using outdated AMIs can expose EC2 instances to security vulnerabilities, lack of support, and missing critical updates, increasing the risk of exploitation.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 describe-images --image-ids <ami-id>",
      "NativeIaC": "",
      "Other": "https://repost.aws/knowledge-center/ec2-find-deprecated-ami",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Regularly update your EC2 instances to use the latest AMIs to ensure they receive the latest security patches and updates.",
      "Url": "https://repost.aws/knowledge-center/ec2-find-deprecated-ami"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_with_outdated_ami.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_with_outdated_ami/ec2_instance_with_outdated_ami.py

```python
from datetime import datetime, timezone
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_instance_with_outdated_ami(Check):
    """Check if EC2 instances are using outdated AMIs.

    This check verifies whether EC2 instances are running on outdated AMIs that have
    reached their deprecation date. If an instance is using an AMI that is deprecated,
    the check fails.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[Check_Report_AWS]:
        """Execute the outdated AMI check for EC2 instances.

        Iterates over all EC2 instances and checks if their AMIs have been deprecated.
        If an instance is using an outdated AMI, the check fails.

        Returns:
            List[Check_Report_AWS]: A list containing the results of the check for each instance.
        """
        findings = []
        for instance in ec2_client.instances:
            ami = next(
                (image for image in ec2_client.images if image.id == instance.image_id),
                None,
            )
            if ami and ami.owner == "amazon":
                report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = (
                    f"EC2 Instance {instance.id} is not using an outdated AMI."
                )

                if ami.deprecation_time:
                    deprecation_datetime = datetime.strptime(
                        ami.deprecation_time, "%Y-%m-%dT%H:%M:%S.%fZ"
                    ).replace(tzinfo=timezone.utc)

                    if deprecation_datetime < datetime.now(timezone.utc):
                        report.status = "FAIL"
                        report.status_extended = f"EC2 Instance {instance.id} is using outdated AMI {ami.id}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_launch_template_imdsv2_required.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_launch_template_imdsv2_required/ec2_launch_template_imdsv2_required.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_launch_template_imdsv2_required",
  "CheckTitle": "Amazon EC2 launch templates should have IMDSv2 enabled and required.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:ec2:region:account-id:launch-template/resource-id",
  "Severity": "high",
  "ResourceType": "AwsEc2LaunchTemplate",
  "Description": "This control checks if Amazon EC2 launch templates are configured with IMDSv2 enabled and required. The control fails if IMDSv2 is not enabled or required in the launch template versions.",
  "Risk": "Without IMDSv2 required, EC2 instances may be vulnerable to metadata service attacks, allowing unauthorized access to instance metadata, potentially leading to compromise of instance credentials or other sensitive data.",
  "RelatedUrl": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 modify-launch-template --launch-template-id <template-id> --version <version-number> --metadata-options HttpTokens=required",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html#ec2-170",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To ensure EC2 launch templates have IMDSv2 enabled and required, update the template to configure the Instance Metadata Service Version 2 as required.",
      "Url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html#change-metadata-options"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_launch_template_imdsv2_required.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_launch_template_imdsv2_required/ec2_launch_template_imdsv2_required.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_launch_template_imdsv2_required(Check):
    def execute(self):
        findings = []
        for template in ec2_client.launch_templates:
            report = Check_Report_AWS(metadata=self.metadata(), resource=template)

            versions_with_imdsv2_required = []
            versions_with_metadata_disabled = []
            versions_with_no_imdsv2 = []

            for version in template.versions:
                if (
                    version.template_data.http_endpoint == "enabled"
                    and version.template_data.http_tokens == "required"
                ):
                    versions_with_imdsv2_required.append(str(version.version_number))
                elif (
                    version.template_data.http_endpoint == "disabled"
                    or not version.template_data.http_endpoint
                ):
                    versions_with_metadata_disabled.append(str(version.version_number))
                else:
                    versions_with_no_imdsv2.append(str(version.version_number))

            if versions_with_imdsv2_required:
                report.status = "PASS"
                report.status_extended = f"EC2 Launch Template {template.name} has IMDSv2 enabled and required in the following versions: {', '.join(versions_with_imdsv2_required)}."
            elif versions_with_metadata_disabled:
                report.status = "PASS"
                report.status_extended = f"EC2 Launch Template {template.name} has metadata service disabled in the following versions: {', '.join(versions_with_metadata_disabled)}."
            else:
                report.status = "FAIL"
                report.status_extended = f"EC2 Launch Template {template.name} has IMDSv2 disabled or not required in the following versions: {', '.join(versions_with_no_imdsv2)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_launch_template_no_public_ip.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_launch_template_no_public_ip/ec2_launch_template_no_public_ip.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_launch_template_no_public_ip",
  "CheckTitle": "Amazon EC2 launch templates should not assign public IPs to network interfaces.",
  "CheckType": [],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsEc2LaunchTemplate",
  "Description": "This control checks if Amazon EC2 launch templates are configured to assign public IP addresses to network interfaces upon launch. The control fails if an EC2 launch template is configured to assign a public IP address to network interfaces or if there is at least one network interface that has a public IP address.",
  "Risk": "A public IP address is reachable from the internet, making associated resources potentially accessible from the internet. EC2 resources should not be publicly accessible to avoid unintended access to workloads.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/ec2-launch-template-public-ip-disabled.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html#ec2-25",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To update an EC2 launch template, see Change the default network interface settings in the Amazon EC2 Auto Scaling User Guide.",
      "Url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html#change-network-interface"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_launch_template_no_public_ip.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_launch_template_no_public_ip/ec2_launch_template_no_public_ip.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_launch_template_no_public_ip(Check):
    def execute(self):
        findings = []
        for template in ec2_client.launch_templates:
            report = Check_Report_AWS(metadata=self.metadata(), resource=template)

            versions_with_autoassign_public_ip = []
            versions_with_network_interfaces_public_ip = []

            for version in template.versions:
                # Check if the launch template version assigns a public IP address
                if version.template_data.associate_public_ip_address:
                    versions_with_autoassign_public_ip.append(
                        str(version.version_number)
                    )
                if version.template_data.network_interfaces:
                    for network_interface in version.template_data.network_interfaces:
                        if network_interface.public_ip_addresses:
                            versions_with_network_interfaces_public_ip.append(
                                str(version.version_number)
                            )
                            break

            if (
                versions_with_autoassign_public_ip
                or versions_with_network_interfaces_public_ip
            ):
                report.status = "FAIL"

                if (
                    versions_with_autoassign_public_ip
                    and versions_with_network_interfaces_public_ip
                ):
                    report.status_extended = f"EC2 Launch Template {template.name} is configured to assign a public IP address to network interfaces upon launch in template versions: {', '.join(versions_with_autoassign_public_ip)} and is using a network interface with public IP addresses in template versions: {', '.join(versions_with_network_interfaces_public_ip)}."
                elif versions_with_autoassign_public_ip:
                    report.status_extended = f"EC2 Launch Template {template.name} is configured to assign a public IP address to network interfaces upon launch in template versions: {', '.join(versions_with_autoassign_public_ip)}."
                elif versions_with_network_interfaces_public_ip:
                    report.status_extended = f"EC2 Launch Template {template.name} is using a network interface with public IP addresses in template versions: {', '.join(versions_with_network_interfaces_public_ip)}."
            else:
                report.status = "PASS"
                report.status_extended = f"EC2 Launch Template {template.name} is neither configured to assign a public IP address to network interfaces upon launch nor using a network interface with public IP addresses."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_launch_template_no_secrets.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_launch_template_no_secrets/ec2_launch_template_no_secrets.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_launch_template_no_secrets",
  "CheckTitle": "Find secrets in EC2 Launch Template",
  "CheckType": [],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:ec2:region:account-id:launch-template/template-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2LaunchTemplate",
  "Description": "Find secrets in EC2 Launch Template",
  "Risk": "The use of a hard-coded password increases the possibility of password guessing.  If hard-coded passwords are used, it is possible that malicious users gain access through the account in question.",
  "RelatedUrl": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Do not include sensitive information in user data within the launch templates, try to use Secrets Manager instead.",
      "Url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"
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

````
