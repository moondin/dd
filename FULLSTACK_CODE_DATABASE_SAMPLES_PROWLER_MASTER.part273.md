---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 273
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 273 of 867)

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

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_3389.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_3389/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_3389.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_ingress_from_internet_to_all_ports import (
    ec2_securitygroup_allow_ingress_from_internet_to_all_ports,
)
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_3389(Check):
    def execute(self):
        findings = []
        check_ports = [3389]
        for security_group_arn, security_group in ec2_client.security_groups.items():
            # Check if ignoring flag is set and if the VPC and the SG is in use
            if ec2_client.provider.scan_unused_services or (
                security_group.vpc_id in vpc_client.vpcs
                and vpc_client.vpcs[security_group.vpc_id].in_use
                and len(security_group.network_interfaces) > 0
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=security_group
                )
                report.resource_details = security_group.name
                report.status = "PASS"
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) does not have Microsoft RDP port 3389 open to the Internet."

                # only proceed if check "..._to_all_ports" did not run or did not FAIL to avoid to report open ports twice
                if not ec2_client.is_failed_check(
                    ec2_securitygroup_allow_ingress_from_internet_to_all_ports.__name__,
                    security_group_arn,
                ):
                    # Loop through every security group's ingress rule and check it
                    for ingress_rule in security_group.ingress_rules:
                        if check_security_group(
                            ingress_rule, "tcp", check_ports, any_address=True
                        ):
                            report.status = "FAIL"
                            report.status_extended = f"Security group {security_group.name} ({security_group.id}) has Microsoft RDP port 3389 open to the Internet."
                            break
                else:
                    report.status_extended = f"Security group {security_group.name} ({security_group.id}) has all ports open to the Internet and therefore was not checked against the specific Microsoft RDP port 3389."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_ftp_20_21.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_ftp_20_21/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_ftp_20_21.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_ingress_from_internet_to_all_ports import (
    ec2_securitygroup_allow_ingress_from_internet_to_all_ports,
)
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_ftp_20_21(Check):
    def execute(self):
        findings = []
        check_ports = [20, 21]
        for security_group_arn, security_group in ec2_client.security_groups.items():
            # Check if ignoring flag is set and if the VPC and the SG is in use
            if ec2_client.provider.scan_unused_services or (
                security_group.vpc_id in vpc_client.vpcs
                and vpc_client.vpcs[security_group.vpc_id].in_use
                and len(security_group.network_interfaces) > 0
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=security_group
                )
                report.resource_details = security_group.name
                report.status = "PASS"
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) does not have FTP ports 20 and 21 open to the Internet."

                # only proceed if check "..._to_all_ports" did not run or did not FAIL to avoid to report open ports twice
                if not ec2_client.is_failed_check(
                    ec2_securitygroup_allow_ingress_from_internet_to_all_ports.__name__,
                    security_group_arn,
                ):
                    # Loop through every security group's ingress rule and check it
                    for ingress_rule in security_group.ingress_rules:
                        if check_security_group(
                            ingress_rule, "tcp", check_ports, any_address=True
                        ):
                            report.status = "FAIL"
                            report.status_extended = f"Security group {security_group.name} ({security_group.id}) has FTP ports 20 and 21 open to the Internet."
                            break
                else:
                    report.status_extended = f"Security group {security_group.name} ({security_group.id}) has all ports open to the Internet and therefore was not checked against the specific FTP ports 20 and 21."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_kafka_9092.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_kafka_9092/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_kafka_9092.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_ingress_from_internet_to_all_ports import (
    ec2_securitygroup_allow_ingress_from_internet_to_all_ports,
)
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_kafka_9092(Check):
    def execute(self):
        findings = []
        check_ports = [9092]
        for security_group_arn, security_group in ec2_client.security_groups.items():
            # Check if ignoring flag is set and if the VPC and the SG is in use
            if ec2_client.provider.scan_unused_services or (
                security_group.vpc_id in vpc_client.vpcs
                and vpc_client.vpcs[security_group.vpc_id].in_use
                and len(security_group.network_interfaces) > 0
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=security_group
                )
                report.resource_details = security_group.name
                report.status = "PASS"
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) does not have Kafka port 9092 open to the Internet."
                # only proceed if check "..._to_all_ports" did not run or did not FAIL to avoid to report open ports twice
                if not ec2_client.is_failed_check(
                    ec2_securitygroup_allow_ingress_from_internet_to_all_ports.__name__,
                    security_group_arn,
                ):
                    # Loop through every security group's ingress rule and check it
                    for ingress_rule in security_group.ingress_rules:
                        if check_security_group(
                            ingress_rule, "tcp", check_ports, any_address=True
                        ):
                            report.status = "FAIL"
                            report.status_extended = f"Security group {security_group.name} ({security_group.id}) has Kafka port 9092 open to the Internet."
                            break
                else:
                    report.status_extended = f"Security group {security_group.name} ({security_group.id}) has all ports open to the Internet and therefore was not checked against the specific Kafka port 9092."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_mysql_3306.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_mysql_3306/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_mysql_3306.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_ingress_from_internet_to_all_ports import (
    ec2_securitygroup_allow_ingress_from_internet_to_all_ports,
)
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_mysql_3306(Check):
    def execute(self):
        findings = []
        check_ports = [3306]
        for security_group_arn, security_group in ec2_client.security_groups.items():
            # Check if ignoring flag is set and if the VPC and the SG is in use
            if ec2_client.provider.scan_unused_services or (
                security_group.vpc_id in vpc_client.vpcs
                and vpc_client.vpcs[security_group.vpc_id].in_use
                and len(security_group.network_interfaces) > 0
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=security_group
                )
                report.resource_details = security_group.name
                report.status = "PASS"
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) does not have MySQL port 3306 open to the Internet."
                # only proceed if check "..._to_all_ports" did not run or did not FAIL to avoid to report open ports twice
                if not ec2_client.is_failed_check(
                    ec2_securitygroup_allow_ingress_from_internet_to_all_ports.__name__,
                    security_group_arn,
                ):
                    # Loop through every security group's ingress rule and check it
                    for ingress_rule in security_group.ingress_rules:
                        if check_security_group(
                            ingress_rule, "tcp", check_ports, any_address=True
                        ):
                            report.status = "FAIL"
                            report.status_extended = f"Security group {security_group.name} ({security_group.id}) has MySQL port 3306 open to the Internet."
                            report.resource_details = security_group.name
                            report.resource_id = security_group.id
                            break
                else:
                    report.status_extended = f"Security group {security_group.name} ({security_group.id}) has all ports open to the Internet and therefore was not checked against the specific MySQL port 3306."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_redis_6379.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_redis_6379/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_redis_6379.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_ingress_from_internet_to_all_ports import (
    ec2_securitygroup_allow_ingress_from_internet_to_all_ports,
)
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_redis_6379(Check):
    def execute(self):
        findings = []
        check_ports = [6379]
        for security_group_arn, security_group in ec2_client.security_groups.items():
            # Check if ignoring flag is set and if the VPC and the SG is in use
            if ec2_client.provider.scan_unused_services or (
                security_group.vpc_id in vpc_client.vpcs
                and vpc_client.vpcs[security_group.vpc_id].in_use
                and len(security_group.network_interfaces) > 0
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=security_group
                )
                report.resource_details = security_group.name
                report.status = "PASS"
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) does not have Redis port 6379 open to the Internet."
                # only proceed if check "..._to_all_ports" did not run or did not FAIL to avoid to report open ports twice
                if not ec2_client.is_failed_check(
                    ec2_securitygroup_allow_ingress_from_internet_to_all_ports.__name__,
                    security_group_arn,
                ):
                    # Loop through every security group's ingress rule and check it
                    for ingress_rule in security_group.ingress_rules:
                        if check_security_group(
                            ingress_rule, "tcp", check_ports, any_address=True
                        ):
                            report.status = "FAIL"
                            report.status_extended = f"Security group {security_group.name} ({security_group.id}) has Redis port 6379 open to the Internet."
                            break
                else:
                    report.status_extended = f"Security group {security_group.name} ({security_group.id}) has all ports open to the Internet and therefore was not checked against the specific Redis port 6379."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_telnet_23.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_telnet_23/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_telnet_23.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_ingress_from_internet_to_all_ports import (
    ec2_securitygroup_allow_ingress_from_internet_to_all_ports,
)
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_telnet_23(Check):
    def execute(self):
        findings = []
        check_ports = [23]
        for security_group_arn, security_group in ec2_client.security_groups.items():
            # Check if ignoring flag is set and if the VPC and the SG is in use
            if ec2_client.provider.scan_unused_services or (
                security_group.vpc_id in vpc_client.vpcs
                and vpc_client.vpcs[security_group.vpc_id].in_use
                and len(security_group.network_interfaces) > 0
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=security_group
                )
                report.resource_details = security_group.name
                report.status = "PASS"
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) does not have Telnet port 23 open to the Internet."
                # only proceed if check "..._to_all_ports" did not run or did not FAIL to avoid to report open ports twice
                if not ec2_client.is_failed_check(
                    ec2_securitygroup_allow_ingress_from_internet_to_all_ports.__name__,
                    security_group_arn,
                ):
                    # Loop through every security group's ingress rule and check it
                    for ingress_rule in security_group.ingress_rules:
                        if check_security_group(
                            ingress_rule, "tcp", check_ports, any_address=True
                        ):
                            report.status = "FAIL"
                            report.status_extended = f"Security group {security_group.name} ({security_group.id}) has Telnet port 23 open to the Internet."
                            break
                else:
                    report.status_extended = f"Security group {security_group.name} ({security_group.id}) has all ports open to the Internet and therefore was not checked against the specific Telnet port 23."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_allow_wide_open_public_ipv4.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_wide_open_public_ipv4/ec2_securitygroup_allow_wide_open_public_ipv4.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_securitygroup_allow_wide_open_public_ipv4",
  "CheckTitle": "Ensure no security groups allow ingress and egress from wide-open IP address with a mask between 0 and 24.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "securitygroup",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsEc2SecurityGroup",
  "Description": "Ensure no security groups allow ingress and egress from wide-open IP address with a mask between 0 and 24.",
  "Risk": "If Security groups are not properly configured the attack surface is increased.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use a Zero Trust approach. Narrow ingress traffic as much as possible. Consider north-south as well as east-west traffic.",
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

---[FILE: ec2_securitygroup_allow_wide_open_public_ipv4.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_wide_open_public_ipv4/ec2_securitygroup_allow_wide_open_public_ipv4.py

```python
import ipaddress

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_allow_wide_open_public_ipv4(Check):
    def execute(self):
        findings = []
        cidr_treshold = 24
        for security_group_arn, security_group in ec2_client.security_groups.items():
            # Check if ignoring flag is set and if the VPC and the SG is in use
            if ec2_client.provider.scan_unused_services or (
                security_group.vpc_id in vpc_client.vpcs
                and vpc_client.vpcs[security_group.vpc_id].in_use
                and len(security_group.network_interfaces) > 0
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=security_group
                )
                report.resource_details = security_group.name
                report.status = "PASS"
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) has no potential wide-open non-RFC1918 address."
                # Loop through every security group's ingress rule and check it
                for ingress_rule in security_group.ingress_rules:
                    for ipv4 in ingress_rule["IpRanges"]:
                        ip = ipaddress.ip_network(ipv4["CidrIp"])
                        # Check if IP is public if 0 < prefixlen < 24
                        if (
                            ip.is_global
                            and ip.prefixlen < cidr_treshold
                            and ip.prefixlen > 0
                        ):
                            report.status = "FAIL"
                            report.status_extended = f"Security group {security_group.name} ({security_group.id}) has potential wide-open non-RFC1918 address {ipv4['CidrIp']} in ingress rule."
                            break

                # Loop through every security group's egress rule and check it
                for egress_rule in security_group.egress_rules:
                    for ipv4 in egress_rule["IpRanges"]:
                        ip = ipaddress.ip_network(ipv4["CidrIp"])
                        # Check if IP is public if 0 < prefixlen < 24
                        if (
                            ip.is_global
                            and ip.prefixlen < cidr_treshold
                            and ip.prefixlen > 0
                        ):
                            report.status = "FAIL"
                            report.status_extended = f"Security group {security_group.name} ({security_group.id}) has potential wide-open non-RFC1918 address {ipv4['CidrIp']} in egress rule."
                            break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_default_restrict_traffic.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_default_restrict_traffic/ec2_securitygroup_default_restrict_traffic.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_securitygroup_default_restrict_traffic",
  "CheckTitle": "Ensure the default security group of every VPC restricts all traffic.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "securitygroup",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsEc2SecurityGroup",
  "Description": "Ensure the default security group of every VPC restricts all traffic.",
  "Risk": "Even having a perimeter firewall, having security groups open allows any user or malware with vpc access to scan for well known and sensitive ports and gain access to instance.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/networking-policies/networking_4#aws-console",
      "Terraform": "https://docs.prowler.com/checks/aws/networking-policies/networking_4#terraform"
    },
    "Recommendation": {
      "Text": "Apply Zero Trust approach. Implement a process to scan and remediate unrestricted or overly permissive security groups. Recommended best practices is to narrow the definition for the minimum ports required.",
      "Url": "https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_default_restrict_traffic.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_default_restrict_traffic/ec2_securitygroup_default_restrict_traffic.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_default_restrict_traffic(Check):
    def execute(self):
        findings = []
        for security_group_arn, security_group in ec2_client.security_groups.items():
            # Check if ignoring flag is set and if the VPC and the default SG are in used
            if security_group.name == "default" and (
                ec2_client.provider.scan_unused_services
                or (
                    security_group.vpc_id in vpc_client.vpcs
                    and vpc_client.vpcs[security_group.vpc_id].in_use
                    and len(security_group.network_interfaces) > 0
                )
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=security_group
                )
                report.resource_details = security_group.name
                report.status = "FAIL"
                report.status_extended = (
                    f"Default Security Group ({security_group.id}) rules allow traffic."
                )
                if not security_group.ingress_rules and not security_group.egress_rules:
                    report.status = "PASS"
                    report.status_extended = f"Default Security Group ({security_group.id}) rules do not allow traffic."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_from_launch_wizard.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_from_launch_wizard/ec2_securitygroup_from_launch_wizard.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_securitygroup_from_launch_wizard",
  "CheckTitle": "Security Groups created by EC2 Launch Wizard.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "securitygroup",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2SecurityGroup",
  "Description": "Security Groups created by EC2 Launch Wizard.",
  "Risk": "Security Groups Created on the AWS Console using the EC2 wizard may allow port 22 from 0.0.0.0/0.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/EC2/security-group-prefixed-with-launch-wizard.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Apply Zero Trust approach. Implement a process to scan and remediate security groups created by the EC2 Wizard. Recommended best practices is to use an authorized security group.",
      "Url": "https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_from_launch_wizard.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_from_launch_wizard/ec2_securitygroup_from_launch_wizard.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_securitygroup_from_launch_wizard(Check):
    def execute(self):
        findings = []
        for security_group in ec2_client.security_groups.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=security_group)
            report.resource_details = security_group.name
            report.status = "PASS"
            report.status_extended = f"Security group {security_group.name} ({security_group.id}) was not created using the EC2 Launch Wizard."
            if "launch-wizard" in security_group.name:
                report.status = "FAIL"
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) was created using the EC2 Launch Wizard."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_not_used.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_not_used/ec2_securitygroup_not_used.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_securitygroup_not_used",
  "CheckTitle": "Ensure there are no Security Groups not being used.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "securitygroup",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "low",
  "ResourceType": "AwsEc2SecurityGroup",
  "Description": "Ensure there are no Security Groups not being used.",
  "Risk": "Having clear definition and scope for Security Groups creates a better administration environment.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "List all the security groups and then use the cli to check if they are attached to an instance.",
      "Url": "https://aws.amazon.com/premiumsupport/knowledge-center/ec2-find-security-group-resources/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_not_used.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_not_used/ec2_securitygroup_not_used.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_securitygroup_not_used(Check):
    def execute(self):
        findings = []
        for security_group_arn, security_group in ec2_client.security_groups.items():
            # Default security groups can not be deleted, so ignore them
            if security_group.name != "default":
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=security_group
                )
                report.resource_details = security_group.name
                report.status = "PASS"
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) it is being used."
                sg_in_lambda = False
                sg_associated = False
                for function in awslambda_client.functions.values():
                    if security_group.id in function.security_groups:
                        sg_in_lambda = True
                for sg in ec2_client.security_groups.values():
                    if security_group.id in sg.associated_sgs:
                        sg_associated = True
                if (
                    len(security_group.network_interfaces) == 0
                    and not sg_in_lambda
                    and not sg_associated
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Security group {security_group.name} ({security_group.id}) it is not being used."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_with_many_ingress_egress_rules.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_with_many_ingress_egress_rules/ec2_securitygroup_with_many_ingress_egress_rules.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_securitygroup_with_many_ingress_egress_rules",
  "CheckTitle": "Find security groups with more than 50 ingress or egress rules.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "securitygroup",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsEc2SecurityGroup",
  "Description": "Find security groups with more than 50 ingress or egress rules.",
  "Risk": "If Security groups are not properly configured the attack surface is increased.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use a Zero Trust approach. Narrow ingress traffic as much as possible. Consider north-south as well as east-west traffic.",
      "Url": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_with_many_ingress_egress_rules.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_with_many_ingress_egress_rules/ec2_securitygroup_with_many_ingress_egress_rules.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_securitygroup_with_many_ingress_egress_rules(Check):
    def execute(self):
        findings = []

        # max_security_group_rules, default: 50
        max_security_group_rules = ec2_client.audit_config.get(
            "max_security_group_rules", 50
        )
        for security_group_arn, security_group in ec2_client.security_groups.items():
            report = Check_Report_AWS(metadata=self.metadata(), resource=security_group)
            report.resource_details = security_group.name
            report.status = "PASS"
            report.status_extended = f"Security group {security_group.name} ({security_group.id}) has {len(security_group.ingress_rules)} inbound rules and {len(security_group.egress_rules)} outbound rules."
            if (
                len(security_group.ingress_rules) > max_security_group_rules
                or len(security_group.egress_rules) > max_security_group_rules
            ):
                report.status = "FAIL"
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_transitgateway_auto_accept_vpc_attachments.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_transitgateway_auto_accept_vpc_attachments/ec2_transitgateway_auto_accept_vpc_attachments.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_transitgateway_auto_accept_vpc_attachments",
  "CheckTitle": "Amazon EC2 Transit Gateways should not automatically accept VPC attachment requests",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "transit-gateway",
  "ResourceIdTemplate": "arn:aws:ec2:region:account-id:transit-gateway/tgw-id",
  "Severity": "high",
  "ResourceType": "AwsEc2TransitGateway",
  "Description": "Ensure EC2 transit gateways are not automatically accepting shared VPC attachments. We get a fail if a transit gateway is configured to automatically accept shared VPC attachment requests.",
  "Risk": "Turning on AutoAcceptSharedAttachments allows a transit gateway to automatically accept any cross-account VPC attachment requests without verification. This increases the risk of unauthorized VPC attachments, compromising network security.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/ec2-transit-gateway-auto-vpc-attach-disabled.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html#ec2-23",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Turn off AutoAcceptSharedAttachments to ensure that only authorized VPC attachment requests are accepted",
      "Url": "https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html#tgw-modifying"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_transitgateway_auto_accept_vpc_attachments.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_transitgateway_auto_accept_vpc_attachments/ec2_transitgateway_auto_accept_vpc_attachments.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_transitgateway_auto_accept_vpc_attachments(Check):
    def execute(self):
        findings = []
        for tgw in ec2_client.transit_gateways.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=tgw)

            if tgw.auto_accept_shared_attachments:
                report.status = "FAIL"
                report.status_extended = f"Transit Gateway {tgw.id} in region {tgw.region} is configured to automatically accept shared VPC attachments."
            else:
                report.status = "PASS"
                report.status_extended = f"Transit Gateway {tgw.id} in region {tgw.region} does not automatically accept shared VPC attachments."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: instance.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/lib/instance.py

```python
from prowler.lib.check.models import Severity
from prowler.providers.aws.services.ec2.ec2_service import Instance
from prowler.providers.aws.services.vpc.vpc_service import VpcSubnet


def get_instance_public_status(
    vpc_subnets: dict[VpcSubnet], instance: Instance, service: str
) -> tuple:
    """
    Get the status and severity of an instance based on the service exposed to internet.
    Args:
        vpc_subnets (dict): The dictionary of VPC subnets.
        instance (Instance): The instance to check.
        service (str): The service to check.
    Returns:
        tuple: The status and severity of the instance status.
    """
    status = f"Instance {instance.id} has {service} exposed to 0.0.0.0/0 but with no public IP address."
    severity = Severity.medium

    if instance.public_ip:
        status = f"Instance {instance.id} has {service} exposed to 0.0.0.0/0 on public IP address {instance.public_ip} but it is placed in a private subnet {instance.subnet_id}."
        severity = Severity.high
        if instance.subnet_id not in vpc_subnets:
            status = f"Instance {instance.id} has {service} exposed to 0.0.0.0/0 on public IP address {instance.public_ip} and it is placed in an unknown subnet {instance.subnet_id}."
        elif vpc_subnets[instance.subnet_id].public:
            status = f"Instance {instance.id} has {service} exposed to 0.0.0.0/0 on public IP address {instance.public_ip} in public subnet {instance.subnet_id}."
            severity = Severity.critical

    return status, severity
```

--------------------------------------------------------------------------------

````
