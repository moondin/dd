---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 268
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 268 of 867)

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

---[FILE: ec2_instance_detailed_monitoring_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_detailed_monitoring_enabled/ec2_instance_detailed_monitoring_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_instance_detailed_monitoring_enabled(Check):
    def execute(self):
        findings = []
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.resource_id = instance.id
            report.resource_arn = instance.arn
            report.resource_tags = instance.tags
            report.status = "PASS"
            report.status_extended = (
                f"EC2 Instance {instance.id} has detailed monitoring enabled."
            )
            if instance.monitoring_state != "enabled":
                report.status = "FAIL"
                report.status_extended = f"EC2 Instance {instance.id} does not have detailed monitoring enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_imdsv2_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_imdsv2_enabled/ec2_instance_imdsv2_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_imdsv2_enabled",
  "CheckTitle": "Check if EC2 Instance Metadata Service Version 2 (IMDSv2) is Enabled and Required.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsEc2Instance",
  "Description": "Check if EC2 Instance Metadata Service Version 2 (IMDSv2) is Enabled and Required.",
  "Risk": "Using IMDSv2 will protect from misconfiguration and SSRF vulnerabilities. IMDSv1 will not.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 modify-instance-metadata-options --instance-id <instance-id> --http-tokens required --http-endpoint enabled",
      "NativeIaC": "https://docs.prowler.com/checks/aws/general-policies/bc_aws_general_31#cloudformation",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/EC2/require-imds-v2.html",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/bc_aws_general_31#terraform"
    },
    "Recommendation": {
      "Text": "If you don't need IMDS you can turn it off. Using aws-cli you can force the instance to use only IMDSv2.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html#configuring-instance-metadata-options"
    }
  },
  "Categories": [
    "ec2-imdsv1"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_imdsv2_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_imdsv2_enabled/ec2_instance_imdsv2_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_instance_imdsv2_enabled(Check):
    def execute(self):
        findings = []
        for instance in ec2_client.instances:
            if instance.state != "terminated":
                report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
                report.status = "FAIL"
                report.status_extended = (
                    f"EC2 Instance {instance.id} has IMDSv2 disabled or not required."
                )
                if (
                    instance.http_endpoint == "enabled"
                    and instance.http_tokens == "required"
                ):
                    report.status = "PASS"
                    report.status_extended = (
                        f"EC2 Instance {instance.id} has IMDSv2 enabled and required."
                    )
                elif instance.http_endpoint == "disabled":
                    report.status = "PASS"
                    report.status_extended = (
                        f"EC2 Instance {instance.id} has metadata service disabled."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_internet_facing_with_instance_profile.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_internet_facing_with_instance_profile/ec2_instance_internet_facing_with_instance_profile.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_internet_facing_with_instance_profile",
  "CheckTitle": "Check for internet facing EC2 instances with Instance Profiles attached.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Instance",
  "Description": "Check for internet facing EC2 instances with Instance Profiles attached.",
  "Risk": "Exposing an EC2 directly to internet increases the attack surface and therefore the risk of compromise.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
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

---[FILE: ec2_instance_internet_facing_with_instance_profile.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_internet_facing_with_instance_profile/ec2_instance_internet_facing_with_instance_profile.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_instance_internet_facing_with_instance_profile(Check):
    def execute(self):
        findings = []
        for instance in ec2_client.instances:
            if instance.state != "terminated":
                report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = f"EC2 Instance {instance.id} is not internet facing with an instance profile."
                if instance.public_ip and instance.instance_profile:
                    report.status = "FAIL"
                    report.status_extended = f"EC2 Instance {instance.id} at IP {instance.public_ip} is internet-facing with Instance Profile {instance.instance_profile['Arn']}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_managed_by_ssm.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_managed_by_ssm/ec2_instance_managed_by_ssm.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_managed_by_ssm",
  "CheckTitle": "Check if EC2 instances are managed by Systems Manager.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Instance",
  "Description": "Check if EC2 instances are managed by Systems Manager.",
  "Risk": "AWS Config provides AWS Managed Rules, which are predefined, customizable rules that AWS Config uses to evaluate whether your AWS resource configurations comply with common best practices.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/SSM/ssm-managed-instances.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Verify and apply Systems Manager Prerequisites.",
      "Url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/managed_instances.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_managed_by_ssm.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_managed_by_ssm/ec2_instance_managed_by_ssm.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ssm.ssm_client import ssm_client


class ec2_instance_managed_by_ssm(Check):
    def execute(self):
        findings = []
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.resource_arn = instance.arn
            report.resource_tags = instance.tags
            report.status = "PASS"
            report.status_extended = (
                f"EC2 Instance {instance.id} is managed by Systems Manager."
            )
            report.resource_id = instance.id
            # instances not running should pass the check
            if instance.state in ["pending", "terminated", "stopped"]:
                report.status_extended = f"EC2 Instance {instance.id} is unmanaged by Systems Manager because it is {instance.state}."
            elif not ssm_client.managed_instances.get(instance.id):
                report.status = "FAIL"
                report.status_extended = (
                    f"EC2 Instance {instance.id} is not managed by Systems Manager."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_older_than_specific_days.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_older_than_specific_days/ec2_instance_older_than_specific_days.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_older_than_specific_days",
  "CheckTitle": "Check EC2 Instances older than specific days.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Instance",
  "Description": "Check EC2 Instances older than specific days.",
  "Risk": "Having old instances within your AWS account could increase the risk of having vulnerable software.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/EC2/ec2-instance-too-old.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Check if software running in the instance is up to date and patched accordingly. Use AWS Systems Manager to patch instances and view patching compliance information.",
      "Url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/viewing-patch-compliance-results.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_older_than_specific_days.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_older_than_specific_days/ec2_instance_older_than_specific_days.py

```python
from datetime import datetime, timezone

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_instance_older_than_specific_days(Check):
    def execute(self):
        findings = []

        # max_ec2_instance_age_in_days, default: 180 days
        max_ec2_instance_age_in_days = ec2_client.audit_config.get(
            "max_ec2_instance_age_in_days", 180
        )
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.resource_id = instance.id
            report.resource_arn = instance.arn
            report.resource_tags = instance.tags
            report.status = "PASS"
            report.status_extended = f"EC2 Instance {instance.id} is not running."
            if instance.state == "running":
                time_since_launch = (
                    datetime.now().replace(tzinfo=timezone.utc) - instance.launch_time
                )
                report.status_extended = f"EC2 Instance {instance.id} is not older than {max_ec2_instance_age_in_days} days ({time_since_launch.days} days)."
                if time_since_launch.days > max_ec2_instance_age_in_days:
                    report.status = "FAIL"
                    report.status_extended = f"EC2 Instance {instance.id} is older than {max_ec2_instance_age_in_days} days ({time_since_launch.days} days)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_paravirtual_type.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_paravirtual_type/ec2_instance_paravirtual_type.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_paravirtual_type",
  "CheckTitle": "Amazon EC2 paravirtual virtualization type should not be used.",
  "CheckType": [],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure that the virtualization type of an EC2 instance is not paravirtual. The control fails if the virtualizationType of the EC2 instance is set to paravirtual.",
  "Risk": "Using paravirtual instances can limit performance and security benefits offered by hardware virtual machine (HVM) instances, such as improved CPU, network, and storage efficiency.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/ec2-paravirtual-instance-check.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html#ec2-24",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To update an EC2 instance to a new instance type, see Change the instance type in the Amazon EC2 User Guide.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-resize.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_paravirtual_type.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_paravirtual_type/ec2_instance_paravirtual_type.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_instance_paravirtual_type(Check):
    def execute(self):
        findings = []
        for instance in ec2_client.instances:
            if instance.state != "terminated":
                report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = (
                    f"EC2 Instance {instance.id} virtualization type is set to HVM."
                )
                if instance.virtualization_type == "paravirtual":
                    report.status = "FAIL"
                    report.status_extended = f"EC2 Instance {instance.id} virtualization type is set to paravirtual."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_cassandra_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_cassandra_exposed_to_internet/ec2_instance_port_cassandra_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_cassandra_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to Cassandra ports (TCP 7000, 7001, 7199, 9042, 9160).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to Cassandra ports (TCP 7000, 7001, 7199, 9042, 9160).",
  "Risk": "Cassandra is a distributed database management system designed to handle large amounts of data across many commodity servers, providing high availability with no single point of failure. Exposing Cassandra ports to the internet can lead to unauthorized access to the database, data exfiltration, and data loss.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group to remove the rule that allows ingress from the internet to TCP ports 7000, 7001, 7199, 9042 or 9160.",
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

---[FILE: ec2_instance_port_cassandra_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_cassandra_exposed_to_internet/ec2_instance_port_cassandra_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_cassandra_exposed_to_internet(Check):
    # EC2 Instances with Cassandra ports open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [7000, 7001, 7199, 9042, 9160]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have Cassandra ports open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "Cassandra"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_cassandra_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_cassandra_exposed_to_internet/ec2_instance_port_cassandra_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing Cassandra ports (7000, 7001, 7199, 9042, 9160) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies Cassandra ports open to the Internet.
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
        check_ports = [7000, 7001, 7199, 9042, 9160]
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

---[FILE: ec2_instance_port_cifs_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_cifs_exposed_to_internet/ec2_instance_port_cifs_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_cifs_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 139 or 445 (CIFS).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 139 or 445 (CIFS).",
  "Risk": "CIFS is a file sharing protocol that is used to access files and printers on remote systems. It is not recommended to expose CIFS to the internet.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group to remove the rule that allows ingress from the internet to TCP port 139 or 445 (CIFS).",
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

---[FILE: ec2_instance_port_cifs_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_cifs_exposed_to_internet/ec2_instance_port_cifs_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_cifs_exposed_to_internet(Check):
    # EC2 Instances with CIFS ports open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [139, 445]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"Instance {instance.id} does not have CIFS ports open to the Internet."
            )
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
                                    vpc_client.vpc_subnets, instance, "CIFS"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_cifs_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_cifs_exposed_to_internet/ec2_instance_port_cifs_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing CIFS ports (139, 445) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies CIFS ports open to the Internet.
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
        check_ports = [139, 445]
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

---[FILE: ec2_instance_port_elasticsearch_kibana_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_elasticsearch_kibana_exposed_to_internet/ec2_instance_port_elasticsearch_kibana_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_elasticsearch_kibana_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to Elasticsearch and Kibana ports (TCP 9200, 9300, 5601).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to Elasticsearch and Kibana ports (TCP 9200, 9300, 5601).",
  "Risk": "Elasticsearch and Kibana are commonly used for log and data analysis. Allowing ingress from the internet to these ports can expose sensitive data to unauthorized users.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group to remove the rule that allows ingress from the internet to TCP ports 9200, 9300, 5601.",
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

---[FILE: ec2_instance_port_elasticsearch_kibana_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_elasticsearch_kibana_exposed_to_internet/ec2_instance_port_elasticsearch_kibana_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_elasticsearch_kibana_exposed_to_internet(Check):
    # EC2 Instances with Elasticsearch/Kibana ports open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [9200, 9300, 5601]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have Elasticsearch/Kibana ports open to the Internet."
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
                                    vpc_client.vpc_subnets,
                                    instance,
                                    "Elasticsearch/Kibana",
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_elasticsearch_kibana_exposed_to_internet/ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing Elasticsearch and Kibana ports (9200, 9300, 5601)
    from any address (0.0.0.0/0) for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies those ports open to the Internet.
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
        check_ports = [9200, 9300, 5601]
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

---[FILE: ec2_instance_port_ftp_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_ftp_exposed_to_internet/ec2_instance_port_ftp_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_ftp_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 20 or 21 (FTP)",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 20 or 21 (FTP).",
  "Risk": "FTP is an insecure protocol and should not be used. If FTP is required, it should be used over a secure channel such as FTPS or SFTP.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group to remove the rule that allows ingress from the internet to TCP port 20 or 21 (FTP).",
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

---[FILE: ec2_instance_port_ftp_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_ftp_exposed_to_internet/ec2_instance_port_ftp_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_ftp_exposed_to_internet(Check):
    # EC2 Instances with FTP ports open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [20, 21]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"Instance {instance.id} does not have FTP ports open to the Internet."
            )
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
                                    vpc_client.vpc_subnets, instance, "FTP"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
