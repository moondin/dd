---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 270
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 270 of 867)

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

---[FILE: ec2_instance_port_mysql_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_mysql_exposed_to_internet/ec2_instance_port_mysql_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing MySQL ports (3306) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies MySQL ports open to the Internet.
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
        check_ports = [3306]
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

---[FILE: ec2_instance_port_oracle_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_oracle_exposed_to_internet/ec2_instance_port_oracle_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_oracle_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 1521, 2483 or 2484 (Oracle).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 1521, 2483 or 2484 (Oracle).",
  "Risk": "Oracle database servers are a high value target for attackers. Allowing internet access to these ports could lead to unauthorized access to the database.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group to remove the rule that allows ingress from the internet to TCP port 1521, 2483 or 2484.",
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

---[FILE: ec2_instance_port_oracle_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_oracle_exposed_to_internet/ec2_instance_port_oracle_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_oracle_exposed_to_internet(Check):
    # EC2 Instances with Oracle ports open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [1521, 2483, 2484]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have Oracle ports open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "Oracle"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_oracle_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_oracle_exposed_to_internet/ec2_instance_port_oracle_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing Oracle ports (1521, 2483, 2484) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies Oracle ports open to the Internet.
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
        check_ports = [1521, 2483, 2484]
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

---[FILE: ec2_instance_port_postgresql_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_postgresql_exposed_to_internet/ec2_instance_port_postgresql_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_postgresql_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 5432 (PostgreSQL)",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 5432 (PostgreSQL).",
  "Risk": "PostgreSQL is a popular open-source relational database management system. Exposing the PostgreSQL port to the internet can lead to unauthorized access to the database, data exfiltration, and other security risks.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group associated with the EC2 instance to remove the rule that allows ingress from the internet to TCP port 5432 (PostgreSQL).",
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

---[FILE: ec2_instance_port_postgresql_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_postgresql_exposed_to_internet/ec2_instance_port_postgresql_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_postgresql_exposed_to_internet(Check):
    # EC2 Instances with PostgreSQL port 5432 open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [5432]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have PostgreSQL port 5432 open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "PostgreSQL"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_postgresql_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_postgresql_exposed_to_internet/ec2_instance_port_postgresql_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing PostgreSQL ports (5432) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies PostgreSQL ports open to the Internet.
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
        check_ports = [5432]
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

---[FILE: ec2_instance_port_rdp_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_rdp_exposed_to_internet/ec2_instance_port_rdp_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_rdp_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 3389 (RDP)",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 3389 (RDP).",
  "Risk": "RDP is a proprietary protocol developed by Microsoft for connecting to Windows systems. Exposing RDP to the internet can allow attackers to brute force the login credentials and gain unauthorized access to the EC2 instance.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group associated with the EC2 instance to remove the rule that allows ingress from the internet to TCP port 3389 (RDP).",
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

---[FILE: ec2_instance_port_rdp_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_rdp_exposed_to_internet/ec2_instance_port_rdp_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_rdp_exposed_to_internet(Check):
    # EC2 Instances with RDP port 3389 open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [3389]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have RDP port 3389 open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "RDP"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_rdp_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_rdp_exposed_to_internet/ec2_instance_port_rdp_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing RDP ports (3389) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies RDP ports open to the Internet.
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
        check_ports = [3389]
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

---[FILE: ec2_instance_port_redis_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_redis_exposed_to_internet/ec2_instance_port_redis_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_redis_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 6379 (Redis).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 6379 (Redis).",
  "Risk": "Redis is an open-source, in-memory data structure store, used as a database, cache, and message broker. Redis is often used to store sensitive data, such as session tokens, user credentials, and other sensitive information. Allowing ingress from the internet to TCP port 6379 (Redis) can expose sensitive data to unauthorized users.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group associated with the EC2 instance to remove the rule that allows ingress from the internet to TCP port 6379 (Redis).",
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

---[FILE: ec2_instance_port_redis_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_redis_exposed_to_internet/ec2_instance_port_redis_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_redis_exposed_to_internet(Check):
    # EC2 Instances with Redis port 6379 open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [6379]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have Redis port 6379 open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "Redis"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_redis_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_redis_exposed_to_internet/ec2_instance_port_redis_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing Redis ports (6379) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies Redis ports open to the Internet.
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
        check_ports = [6379]
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

---[FILE: ec2_instance_port_sqlserver_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_sqlserver_exposed_to_internet/ec2_instance_port_sqlserver_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_sqlserver_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 1433 or 1434 (SQL Server).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 1433 or 1434 (SQL Server).",
  "Risk": "SQL Server is a database management system that is used to store and retrieve data. If an EC2 instance allows ingress from the internet to TCP port 1433 or 1434, it may be vulnerable to unauthorized access and data exfiltration.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group to remove the rule that allows ingress from the internet to TCP port 1433 or 1434 (SQL Server).",
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

---[FILE: ec2_instance_port_sqlserver_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_sqlserver_exposed_to_internet/ec2_instance_port_sqlserver_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_sqlserver_exposed_to_internet(Check):
    # EC2 Instances with SQL Server ports open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [1433, 1434]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have SQL Server ports open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "SQL Server"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_sqlserver_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_sqlserver_exposed_to_internet/ec2_instance_port_sqlserver_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing SQLServer ports (1433, 1434) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies SQLServer ports open to the Internet.
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
        check_ports = [1433, 1434]
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

---[FILE: ec2_instance_port_ssh_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_ssh_exposed_to_internet/ec2_instance_port_ssh_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_ssh_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 22 (SSH)",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 22 (SSH).",
  "Risk": "SSH is a common target for brute force attacks. If an EC2 instance allows ingress from the internet to TCP port 22, it is at risk of being compromised.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group associated with the EC2 instance to remove the rule that allows ingress from the internet to TCP port 22.",
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

---[FILE: ec2_instance_port_ssh_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_ssh_exposed_to_internet/ec2_instance_port_ssh_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_ssh_exposed_to_internet(Check):
    # EC2 Instances with SSH port 22 open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [22]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have SSH port 22 open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "SSH"
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
