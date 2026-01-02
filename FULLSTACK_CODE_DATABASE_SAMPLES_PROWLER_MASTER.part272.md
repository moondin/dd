---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 272
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 272 of 867)

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

---[FILE: ec2_launch_template_no_secrets.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_launch_template_no_secrets/ec2_launch_template_no_secrets.py

```python
import zlib
from base64 import b64decode

from prowler.config.config import encoding_format_utf_8
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.logger import logger
from prowler.lib.utils.utils import detect_secrets_scan
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_launch_template_no_secrets(Check):
    def execute(self):
        findings = []
        secrets_ignore_patterns = ec2_client.audit_config.get(
            "secrets_ignore_patterns", []
        )
        for template in ec2_client.launch_templates:
            report = Check_Report_AWS(metadata=self.metadata(), resource=template)

            versions_with_secrets = []

            for version in template.versions:
                if not version.template_data.user_data:
                    continue
                user_data = b64decode(version.template_data.user_data)

                try:
                    if user_data[0:2] == b"\x1f\x8b":  # GZIP magic number
                        user_data = zlib.decompress(
                            user_data, zlib.MAX_WBITS | 32
                        ).decode(encoding_format_utf_8)
                    else:
                        user_data = user_data.decode(encoding_format_utf_8)
                except UnicodeDecodeError as error:
                    logger.warning(
                        f"{template.region} -- Unable to decode User Data in EC2 Launch Template {template.name} version {version.version_number}: {error}"
                    )
                    continue
                except Exception as error:
                    logger.error(
                        f"{template.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                    continue

                version_secrets = detect_secrets_scan(
                    data=user_data,
                    excluded_secrets=secrets_ignore_patterns,
                    detect_secrets_plugins=ec2_client.audit_config.get(
                        "detect_secrets_plugins"
                    ),
                )

                if version_secrets:
                    secrets_string = ", ".join(
                        [
                            f"{secret['type']} on line {secret['line_number']}"
                            for secret in version_secrets
                        ]
                    )
                    versions_with_secrets.append(
                        f"Version {version.version_number}: {secrets_string}"
                    )

            if len(versions_with_secrets) > 0:
                report.status = "FAIL"
                report.status_extended = f"Potential secret found in User Data for EC2 Launch Template {template.name} in template versions: {', '.join(versions_with_secrets)}."
            else:
                report.status = "PASS"
                report.status_extended = f"No secrets found in User Data of any version for EC2 Launch Template {template.name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_networkacl_allow_ingress_any_port.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_networkacl_allow_ingress_any_port/ec2_networkacl_allow_ingress_any_port.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_networkacl_allow_ingress_any_port",
  "CheckTitle": "Ensure no Network ACLs allow ingress from 0.0.0.0/0 to any port.",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "networkacl",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2NetworkAcl",
  "Description": "Ensure no Network ACLs allow ingress from 0.0.0.0/0 to any port.",
  "Risk": "Even having a perimeter firewall, having network acls open allows any user or malware with vpc access to scan for well known and sensitive ports and gain access to instance.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Apply Zero Trust approach. Implement a process to scan and remediate unrestricted or overly permissive network acls. Recommended best practices is to narrow the definition for the minimum ports required.",
      "Url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Infrastructure Security"
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_networkacl_allow_ingress_any_port.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_networkacl_allow_ingress_any_port/ec2_networkacl_allow_ingress_any_port.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.network_acls import check_network_acl


class ec2_networkacl_allow_ingress_any_port(Check):
    def execute(self):
        findings = []
        tcp_protocol = "-1"
        check_port = 0
        for arn, network_acl in ec2_client.network_acls.items():
            if (
                ec2_client.provider.scan_unused_services
                or network_acl.region in ec2_client.regions_with_sgs
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=network_acl
                )
                # If some entry allows it, that ACL is not securely configured
                if check_network_acl(network_acl.entries, tcp_protocol, check_port):
                    report.status = "FAIL"
                    report.status_extended = f"Network ACL {network_acl.name if network_acl.name else network_acl.id} has every port open to the Internet."
                    findings.append(report)
                else:
                    report.status = "PASS"
                    report.status_extended = f"Network ACL {network_acl.name if network_acl.name else network_acl.id} does not have every port open to the Internet."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_networkacl_allow_ingress_tcp_port_22.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_networkacl_allow_ingress_tcp_port_22/ec2_networkacl_allow_ingress_tcp_port_22.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_networkacl_allow_ingress_tcp_port_22",
  "CheckTitle": "Ensure no Network ACLs allow ingress from 0.0.0.0/0 to SSH port 22",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "networkacl",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2NetworkAcl",
  "Description": "Ensure no Network ACLs allow ingress from 0.0.0.0/0 to SSH port 22",
  "Risk": "Even having a perimeter firewall, having network acls open allows any user or malware with vpc access to scan for well known and sensitive ports and gain access to instance.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/aws/networking-policies/ensure-aws-nacl-does-not-allow-ingress-from-00000-to-port-22#cloudformation",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/aws/networking-policies/ensure-aws-nacl-does-not-allow-ingress-from-00000-to-port-22#terraform"
    },
    "Recommendation": {
      "Text": "Apply Zero Trust approach. Implement a process to scan and remediate unrestricted or overly permissive network acls. Recommended best practices is to narrow the definition for the minimum ports required.",
      "Url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html"
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

---[FILE: ec2_networkacl_allow_ingress_tcp_port_22.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_networkacl_allow_ingress_tcp_port_22/ec2_networkacl_allow_ingress_tcp_port_22.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.network_acls import check_network_acl


class ec2_networkacl_allow_ingress_tcp_port_22(Check):
    def execute(self):
        findings = []
        tcp_protocol = "6"
        check_port = 22
        for arn, network_acl in ec2_client.network_acls.items():
            if (
                ec2_client.provider.scan_unused_services
                or network_acl.region in ec2_client.regions_with_sgs
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=network_acl
                )
                # If some entry allows it, that ACL is not securely configured
                if check_network_acl(network_acl.entries, tcp_protocol, check_port):
                    report.status = "FAIL"
                    report.status_extended = f"Network ACL {network_acl.name if network_acl.name else network_acl.id} has SSH port 22 open to the Internet."
                    findings.append(report)
                else:
                    report.status = "PASS"
                    report.status_extended = f"Network ACL {network_acl.name if network_acl.name else network_acl.id} does not have SSH port 22 open to the Internet."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_networkacl_allow_ingress_tcp_port_3389.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_networkacl_allow_ingress_tcp_port_3389/ec2_networkacl_allow_ingress_tcp_port_3389.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_networkacl_allow_ingress_tcp_port_3389",
  "CheckTitle": "Ensure no Network ACLs allow ingress from 0.0.0.0/0 to Microsoft RDP port 3389",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "networkacl",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2NetworkAcl",
  "Description": "Ensure no Network ACLs allow ingress from 0.0.0.0/0 to Microsoft RDP port 3389",
  "Risk": "Even having a perimeter firewall, having network acls open allows any user or malware with vpc access to scan for well known and sensitive ports and gain access to instance.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/aws/networking-policies/ensure-aws-nacl-does-not-allow-ingress-from-00000-to-port-3389#cloudformation",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/aws/networking-policies/ensure-aws-nacl-does-not-allow-ingress-from-00000-to-port-3389#terraform"
    },
    "Recommendation": {
      "Text": "Apply Zero Trust approach. Implement a process to scan and remediate unrestricted or overly permissive network acls. Recommended best practices is to narrow the definition for the minimum ports required.",
      "Url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html"
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

---[FILE: ec2_networkacl_allow_ingress_tcp_port_3389.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_networkacl_allow_ingress_tcp_port_3389/ec2_networkacl_allow_ingress_tcp_port_3389.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.network_acls import check_network_acl


class ec2_networkacl_allow_ingress_tcp_port_3389(Check):
    def execute(self):
        findings = []
        tcp_protocol = "6"
        check_port = 3389
        for arn, network_acl in ec2_client.network_acls.items():
            if (
                ec2_client.provider.scan_unused_services
                or network_acl.region in ec2_client.regions_with_sgs
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=network_acl
                )
                # If some entry allows it, that ACL is not securely configured
                if check_network_acl(network_acl.entries, tcp_protocol, check_port):
                    report.status = "FAIL"
                    report.status_extended = f"Network ACL {network_acl.name if network_acl.name else network_acl.id} has Microsoft RDP port 3389 open to the Internet."
                    findings.append(report)
                else:
                    report.status = "PASS"
                    report.status_extended = f"Network ACL {network_acl.name if network_acl.name else network_acl.id} does not have Microsoft RDP port 3389 open to the Internet."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_networkacl_unused.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_networkacl_unused/ec2_networkacl_unused.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_networkacl_unused",
  "CheckTitle": "Unused Network Access Control Lists should be removed.",
  "CheckType": [],
  "ServiceName": "ec2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "low",
  "ResourceType": "AwsEc2NetworkAcl",
  "Description": "Ensure that there are no unused network access control lists (network ACLs) in your virtual private cloud (VPC). The control fails if the network ACL isn't associated with a subnet. The control doesn't generate findings for an unused default network ACL.",
  "Risk": "Unused network ACLs may represent a potential security risk if left in place without purpose, as they could be mistakenly associated with subnets later.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/vpc-network-acl-unused-check.html",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 delete-network-acl --network-acl-id <nacl_id>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html#ec2-16",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "For instructions on deleting an unused network ACL, see Deleting a network ACL in the Amazon VPC User Guide.",
      "Url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html#vpc-network-acl-delete"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Infrastructure Security"
}
```

--------------------------------------------------------------------------------

---[FILE: ec2_networkacl_unused.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_networkacl_unused/ec2_networkacl_unused.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class ec2_networkacl_unused(Check):
    def execute(self):
        findings = []
        for arn, network_acl in ec2_client.network_acls.items():
            if not network_acl.default:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=network_acl
                )

                if not network_acl.in_use:
                    report.status = "FAIL"
                    report.status_extended = f"Network ACL {network_acl.name if network_acl.name else network_acl.id} is not associated with any subnet and is not the default network ACL."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Network ACL {network_acl.name if network_acl.name else network_acl.id} is associated with a subnet."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_all_ports.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_all_ports/ec2_securitygroup_allow_ingress_from_internet_to_all_ports.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_securitygroup_allow_ingress_from_internet_to_all_ports",
  "CheckTitle": "Ensure no security groups allow ingress from 0.0.0.0/0 or ::/0 to all ports.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "securitygroup",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsEc2SecurityGroup",
  "Description": "Ensure no security groups allow ingress from 0.0.0.0/0 or ::/0 to all ports.",
  "Risk": "If Security groups are not properly configured the attack surface is increased. An attacker could exploit this misconfiguration to gain unauthorized access to resources.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/aws/networking-policies/ensure-aws-security-group-does-not-allow-all-traffic-on-all-ports/"
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

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_all_ports.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_all_ports/ec2_securitygroup_allow_ingress_from_internet_to_all_ports.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS, Severity
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_allow_ingress_from_internet_to_all_ports(Check):
    def execute(self):
        findings = []
        for security_group_arn, security_group in ec2_client.security_groups.items():
            # Check if ignoring flag is set and if the VPC and the SG is in use
            sg_in_use = (
                security_group.vpc_id in vpc_client.vpcs
                and vpc_client.vpcs[security_group.vpc_id].in_use
                and len(security_group.network_interfaces) > 0
            )
            if ec2_client.provider.scan_unused_services or sg_in_use:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=security_group
                )
                if not sg_in_use:
                    report.check_metadata.Severity = Severity.high
                report.resource_details = security_group.name
                report.status = "PASS"
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) does not have all ports open to the Internet."

                for ingress_rule in security_group.ingress_rules:
                    if check_security_group(ingress_rule, "-1", any_address=True):
                        ec2_client.set_failed_check(
                            self.__class__.__name__,
                            security_group_arn,
                        )
                        report.status = "FAIL"
                        report.status_extended = f"Security group {security_group.name} ({security_group.id}) has all ports open to the Internet."
                        break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_any_port.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_any_port/ec2_securitygroup_allow_ingress_from_internet_to_any_port.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_securitygroup_allow_ingress_from_internet_to_any_port",
  "CheckTitle": "Ensure no security groups allow ingress from 0.0.0.0/0 or ::/0 to any port.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "securitygroup",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsEc2SecurityGroup",
  "Description": "Ensure no security groups allow ingress from 0.0.0.0/0 or ::/0 to any port and not attached to a network interface with not allowed network interface types or instance owners. By default, the allowed network interface types are 'api_gateway_managed' and 'vpc_endpoint', and the allowed instance owners are 'amazon-elb', you can customize these values by setting the 'ec2_allowed_interface_types' and 'ec2_allowed_instance_owners' variables.",
  "Risk": "The security group allows all traffic from the internet to any port. This could allow an attacker to access the instance.",
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

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_any_port.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_any_port/ec2_securitygroup_allow_ingress_from_internet_to_any_port.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_ingress_from_internet_to_all_ports import (
    ec2_securitygroup_allow_ingress_from_internet_to_all_ports,
)
from prowler.providers.aws.services.ec2.ec2_service import NetworkInterface
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_allow_ingress_from_internet_to_any_port(Check):
    def execute(self):
        findings = []
        for security_group_arn, security_group in ec2_client.security_groups.items():
            # Only execute the check if the check ec2_securitygroup_allow_ingress_from_internet_to_all_ports has not failed
            if not ec2_client.is_failed_check(
                ec2_securitygroup_allow_ingress_from_internet_to_all_ports.__name__,
                security_group_arn,
            ):
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
                    report.status_extended = f"Security group {security_group.name} ({security_group.id}) does not have any port open to the Internet."
                    for ingress_rule in security_group.ingress_rules:
                        if check_security_group(
                            ingress_rule, "-1", ports=None, any_address=True
                        ):
                            self.check_enis(
                                report=report,
                                security_group_name=security_group.name,
                                security_group_id=security_group.id,
                                enis=security_group.network_interfaces,
                            )

                        if report.status == "FAIL":
                            break
                    findings.append(report)

        return findings

    def check_enis(
        self,
        report,
        security_group_name: str,
        security_group_id: str,
        enis: list[NetworkInterface],
    ):
        report.status_extended = f"Security group {security_group_name} ({security_group_id}) has at least one port open to the Internet but it is not attached to any network interface."
        for eni in enis:
            if eni.type in ec2_client.audit_config.get(
                "ec2_allowed_interface_types", ["api_gateway_managed", "vpc_endpoint"]
            ):
                report.status = "PASS"
                report.status_extended = f"Security group {security_group_name} ({security_group_id}) has at least one port open to the Internet and it is attached to an allowed network interface type ({eni.type})."
                continue
            if eni.attachment.instance_owner_id in ec2_client.audit_config.get(
                "ec2_allowed_instance_owners", ["amazon-elb"]
            ):
                report.status = "PASS"
                report.status_extended = f"Security group {security_group_name} ({security_group_id}) has at least one port open to the Internet and it is attached to an allowed network interface instance owner ({eni.attachment.instance_owner_id})."
                continue
            if eni.type not in ec2_client.audit_config.get(
                "ec2_allowed_interface_types", ["api_gateway_managed", "vpc_endpoint"]
            ):
                report.status = "FAIL"
                report.status_extended = f"Security group {security_group_name} ({security_group_id}) has at least one port open to the Internet but its network interface type ({eni.type}) is not allowed."
            elif eni.attachment.instance_owner_id not in ec2_client.audit_config.get(
                "ec2_allowed_instance_owners", ["amazon-elb"]
            ):
                report.status = "FAIL"
                report.status_extended = f"Security group {security_group_name} ({security_group_id}) has at least one port open to the Internet but its network interface instance owner ({eni.attachment.instance_owner_id}) is not allowed."
            else:
                report.status = "FAIL"
                report.status_extended = f"Security group {security_group_name} ({security_group_id}) has at least one port open to the Internet but neither its network interface type ({eni.type}) nor its network interface instance owner ({eni.attachment.instance_owner_id}) are allowed."
            if report.status == "FAIL":
                break
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_high_risk_tcp_ports.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_high_risk_tcp_ports/ec2_securitygroup_allow_ingress_from_internet_to_high_risk_tcp_ports.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_ingress_from_internet_to_all_ports import (
    ec2_securitygroup_allow_ingress_from_internet_to_all_ports,
)
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_allow_ingress_from_internet_to_high_risk_tcp_ports(Check):
    def execute(self):
        findings = []
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
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) does not have any high-risk port open to the Internet."
                # only proceed if check "..._to_all_ports" did not run or did not FAIL to avoid to report open ports twice
                if not ec2_client.is_failed_check(
                    ec2_securitygroup_allow_ingress_from_internet_to_all_ports.__name__,
                    security_group_arn,
                ):
                    check_ports = ec2_client.audit_config.get(
                        "ec2_high_risk_ports",
                        [25, 110, 135, 143, 445, 3000, 4333, 5000, 5500, 8080, 8088],
                    )
                    # Loop through every security group's ingress rule and check it
                    open_ports = []
                    for ingress_rule in security_group.ingress_rules:
                        for port in check_ports:
                            if check_security_group(
                                ingress_rule, "tcp", [port], any_address=True
                            ):
                                open_ports.append(port)

                    if open_ports:
                        report.status = "FAIL"
                        open_ports_str = ", ".join(map(str, open_ports))
                        report.status_extended = f"Security group {security_group.name} ({security_group.id}) has the following high-risk ports open to the Internet: {open_ports_str}."
                else:
                    report.status_extended = f"Security group {security_group.name} ({security_group.id}) has all ports open to the Internet and therefore was not checked against high-risk ports."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22",
  "CheckTitle": "Ensure no security groups allow ingress from 0.0.0.0/0 or ::/0 to SSH port 22.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "securitygroup",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsEc2SecurityGroup",
  "Description": "Ensure no security groups allow ingress from 0.0.0.0/0 or ::/0 to SSH port 22.",
  "Risk": "If Security groups are not properly configured the attack surface is increased.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 revoke-security-group-ingress --group-id <GROUP_ID> --protocol tcp --port 22 --cidr",
      "NativeIaC": "https://docs.prowler.com/checks/aws/networking-policies/networking_1-port-security#cloudformation",
      "Other": "https://docs.prowler.com/checks/aws/networking-policies/networking_1-port-security",
      "Terraform": "https://docs.prowler.com/checks/aws/networking-policies/networking_1-port-security#terraform"
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

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_ingress_from_internet_to_all_ports import (
    ec2_securitygroup_allow_ingress_from_internet_to_all_ports,
)
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22(Check):
    def execute(self):
        findings = []
        check_ports = [22]
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
                report.status_extended = f"Security group {security_group.name} ({security_group.id}) does not have SSH port 22 open to the Internet."

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
                            report.status_extended = f"Security group {security_group.name} ({security_group.id}) has SSH port 22 open to the Internet."
                            break
                else:
                    report.status_extended = f"Security group {security_group.name} ({security_group.id}) has all ports open to the Internet and therefore was not checked against the specific SSH port 22."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_3389.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ec2/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_3389/ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_3389.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_3389",
  "CheckTitle": "Ensure no security groups allow ingress from 0.0.0.0/0 or ::/0 to port 3389.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "ec2",
  "SubServiceName": "securitygroup",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsEc2SecurityGroup",
  "Description": "Ensure no security groups allow ingress from 0.0.0.0/0 or ::/0 to port 3389.",
  "Risk": "If Security groups are not properly configured the attack surface is increased.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 revoke-security-group-ingress --group-id <GROUP_ID> --protocol tcp --port 3389 --cidr",
      "NativeIaC": "https://docs.prowler.com/checks/aws/networking-policies/networking_2#cloudformation",
      "Other": "https://docs.prowler.com/checks/aws/networking-policies/networking_2",
      "Terraform": "https://docs.prowler.com/checks/aws/networking-policies/networking_2#terraform"
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

````
