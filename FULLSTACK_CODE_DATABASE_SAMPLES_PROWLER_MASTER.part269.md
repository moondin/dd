---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 269
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 269 of 867)

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

---[FILE: ec2_instance_port_ftp_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_ftp_exposed_to_internet/ec2_instance_port_ftp_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing FTP ports (20, 21) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies FTP ports open to the Internet.
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
        check_ports = [20, 21]
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

---[FILE: ec2_instance_port_kafka_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_kafka_exposed_to_internet/ec2_instance_port_kafka_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_kafka_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 9092 (Kafka).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 9092 (Kafka).",
  "Risk": "Kafka is a distributed streaming platform that is used to build real-time data pipelines and streaming applications. Exposing the Kafka port to the internet can lead to unauthorized access to the Kafka cluster, which can result in data leakage, data corruption, and data loss.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group associated with the EC2 instance to remove the rule that allows ingress from the internet to TCP port 9092 (Kafka).",
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

---[FILE: ec2_instance_port_kafka_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_kafka_exposed_to_internet/ec2_instance_port_kafka_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_kafka_exposed_to_internet(Check):
    # EC2 Instances with Kafka port 9092 open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [9092]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have Kafka port 9092 open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "Kafka"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_kafka_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_kafka_exposed_to_internet/ec2_instance_port_kafka_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing Kafka ports (9092) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies Kafka ports open to the Internet.
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
        check_ports = [9092]
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

---[FILE: ec2_instance_port_kerberos_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_kerberos_exposed_to_internet/ec2_instance_port_kerberos_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_kerberos_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 88, 464, 749 or 750 (Kerberos).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 88, 464, 749 or 750 (Kerberos).",
  "Risk": "Kerberos is a network authentication protocol that uses secret-key cryptography to authenticate clients and servers. It is typically used in environments where users need to authenticate to access network resources. If an EC2 instance allows ingress from the internet to TCP port 88 or 464, it may be vulnerable to unauthorized access.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group to remove the rule that allows ingress from the internet to TCP port 88, 464, 749 or 750 (Kerberos).",
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

---[FILE: ec2_instance_port_kerberos_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_kerberos_exposed_to_internet/ec2_instance_port_kerberos_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_kerberos_exposed_to_internet(Check):
    # EC2 Instances with Kerberos ports open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [88, 464, 749, 750]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have Kerberos ports open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "Kerberos"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_kerberos_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_kerberos_exposed_to_internet/ec2_instance_port_kerberos_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing Kerberos ports (88, 464, 749, 750) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies Kerberos ports open to the Internet.
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
        check_ports = [88, 464, 749, 750]
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

---[FILE: ec2_instance_port_ldap_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_ldap_exposed_to_internet/ec2_instance_port_ldap_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_ldap_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 389 or 636 (LDAP).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 389 or 636 (LDAP).",
  "Risk": "LDAP is a protocol used for authentication and authorization. Exposing LDAP to the internet can lead to unauthorized access to the LDAP server and the data it contains.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group to remove the rule that allows ingress from the internet to TCP port 389 or 636 (LDAP).",
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

---[FILE: ec2_instance_port_ldap_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_ldap_exposed_to_internet/ec2_instance_port_ldap_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_ldap_exposed_to_internet(Check):
    # EC2 Instances with LDAP ports open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [389, 636]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"Instance {instance.id} does not have LDAP ports open to the Internet."
            )
            report.resource_id = instance.id
            report.resource_arn = instance.arn
            report.resource_tags = instance.tags
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
                                    vpc_client.vpc_subnets, instance, "LDAP"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_ldap_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_ldap_exposed_to_internet/ec2_instance_port_ldap_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing LDAP ports (389, 636) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies LDAP ports open to the Internet.
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
        check_ports = [389, 636]
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

---[FILE: ec2_instance_port_memcached_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_memcached_exposed_to_internet/ec2_instance_port_memcached_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_memcached_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 11211 (Memcached).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 11211 (Memcached).",
  "Risk": "Memcached is an open-source, high-performance, distributed memory object caching system. It is often used to speed up dynamic database-driven websites by caching data and objects in RAM to reduce the number of times an external data source must be read. Memcached is designed to be used in trusted environments and should not be exposed to the internet. If Memcached is exposed to the internet, it can be exploited by attackers to perform distributed denial-of-service (DDoS) attacks, data exfiltration, and other malicious activities.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group associated with the EC2 instance to remove the rule that allows ingress from the internet to TCP port 11211 (Memcached).",
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

---[FILE: ec2_instance_port_memcached_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_memcached_exposed_to_internet/ec2_instance_port_memcached_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_memcached_exposed_to_internet(Check):
    # EC2 Instances with Memcached port 11211 open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [11211]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have Memcached port 11211 open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "Memcached"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_memcached_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_memcached_exposed_to_internet/ec2_instance_port_memcached_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing Memcached ports (11211) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies Memcached ports open to the Internet.
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
        check_ports = [11211]
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

---[FILE: ec2_instance_port_mongodb_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_mongodb_exposed_to_internet/ec2_instance_port_mongodb_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_mongodb_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 27017 or 27018 (MongoDB)",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 27017 or 27018 (MongoDB).",
  "Risk": "MongoDB is a popular NoSQL database that is often used in web applications. If an EC2 instance allows ingress from the internet to TCP port 27017 or 27018, it may be vulnerable to unauthorized access and data exfiltration.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group to remove the rule that allows ingress from the internet to TCP port 27017 or 27018 (MongoDB).",
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

---[FILE: ec2_instance_port_mongodb_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_mongodb_exposed_to_internet/ec2_instance_port_mongodb_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_mongodb_exposed_to_internet(Check):
    # EC2 Instances with MongoDB ports open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [27017, 27018]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have MongoDB ports open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "MongoDB"
                                )
                                is_open_port = True
                                break
                        if is_open_port:
                            break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_mongodb_exposed_to_internet_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_mongodb_exposed_to_internet/ec2_instance_port_mongodb_exposed_to_internet_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


def fixer(resource_id: str, region: str) -> bool:
    """
    Revokes any ingress rule allowing MongoDB ports (27017, 27018) from any address (0.0.0.0/0)
    for the EC2 instance's security groups.
    This fixer will only be triggered if the check identifies MongoDB ports open to the Internet.
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
        check_ports = [27017, 27018]
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

---[FILE: ec2_instance_port_mysql_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_mysql_exposed_to_internet/ec2_instance_port_mysql_exposed_to_internet.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_instance_port_mysql_exposed_to_internet",
  "CheckTitle": "Ensure no EC2 instances allow ingress from the internet to TCP port 3306 (MySQL).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "instance",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2Instance",
  "Description": "Ensure no EC2 instances allow ingress from the internet to TCP port 3306 (MySQL).",
  "Risk": "MySQL is a popular open-source relational database management system that is widely used in web applications. Exposing MySQL to the internet can lead to unauthorized access and data exfiltration.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the security group associated with the EC2 instance to remove the rule that allows ingress from the internet to TCP port 3306 (MySQL).",
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

---[FILE: ec2_instance_port_mysql_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_instance_port_mysql_exposed_to_internet/ec2_instance_port_mysql_exposed_to_internet.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_instance_port_mysql_exposed_to_internet(Check):
    # EC2 Instances with MySQL port 3306 open to the Internet will be flagged as FAIL with a severity of medium if the instance has no public IP, high if the instance has a public IP but is in a private subnet, and critical if the instance has a public IP and is in a public subnet.
    def execute(self):
        findings = []
        check_ports = [3306]
        for instance in ec2_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Instance {instance.id} does not have MySQL port 3306 open to the Internet."
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
                                    vpc_client.vpc_subnets, instance, "MySQL"
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
