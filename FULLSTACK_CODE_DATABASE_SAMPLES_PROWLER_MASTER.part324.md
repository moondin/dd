---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 324
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 324 of 867)

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

---[FILE: vpc_endpoint_services_allowed_principals_trust_boundaries.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_endpoint_services_allowed_principals_trust_boundaries/vpc_endpoint_services_allowed_principals_trust_boundaries.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "vpc_endpoint_services_allowed_principals_trust_boundaries",
  "CheckTitle": "Find trust boundaries in VPC endpoint services allowlisted principles.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "vpc",
  "SubServiceName": "service_endpoint",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2VpcEndpointService",
  "Description": "Find trust boundaries in VPC endpoint services allowlisted principles.",
  "Risk": "Account VPC could be linked to other accounts.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/networking-policies/networking_9#aws-vpc-endpoints-are-exposed",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "In multi Account environments identify untrusted links. Check trust chaining and dependencies between accounts.",
      "Url": "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html"
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

---[FILE: vpc_endpoint_services_allowed_principals_trust_boundaries.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_endpoint_services_allowed_principals_trust_boundaries/vpc_endpoint_services_allowed_principals_trust_boundaries.py

```python
from re import compile

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class vpc_endpoint_services_allowed_principals_trust_boundaries(Check):
    def execute(self):
        findings = []
        # Get trusted account_ids from prowler.config.yaml
        trusted_account_ids = vpc_client.audit_config.get("trusted_account_ids", [])
        for service in vpc_client.vpc_endpoint_services:
            report = Check_Report_AWS(metadata=self.metadata(), resource=service)

            if not service.allowed_principals:
                report.status = "PASS"
                report.status_extended = (
                    f"VPC Endpoint Service {service.id} has no allowed principals."
                )
                findings.append(report)
            else:
                for principal in service.allowed_principals:
                    # Account ID can be an ARN or just a 12-digit string
                    pattern = compile(r"^[0-9]{12}$")
                    match = pattern.match(principal)
                    if not match:
                        account_id = (
                            principal.split(":")[4] if principal != "*" else "*"
                        )
                    else:
                        account_id = match.string

                    if (
                        account_id in trusted_account_ids
                        or account_id in vpc_client.audited_account
                    ):
                        report.status = "PASS"
                        report.status_extended = f"Found trusted account {account_id} in VPC Endpoint Service {service.id}."
                    else:
                        report.status = "FAIL"
                        if account_id == "*":
                            report.status_extended = f"Wildcard principal found in VPC Endpoint Service {service.id}."
                        else:
                            report.status_extended = f"Found untrusted account {account_id} in VPC Endpoint Service {service.id}."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vpc_flow_logs_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_flow_logs_enabled/vpc_flow_logs_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "vpc_flow_logs_enabled",
  "CheckTitle": "Ensure VPC Flow Logging is Enabled in all VPCs.",
  "CheckType": [
    "Logging and Monitoring"
  ],
  "ServiceName": "vpc",
  "SubServiceName": "flow_log",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Vpc",
  "Description": "Ensure VPC Flow Logging is Enabled in all VPCs.",
  "Risk": "VPC Flow Logs provide visibility into network traffic that traverses the VPC and can be used to detect anomalous traffic or insight during security workflows.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/logging-policies/logging_9-enable-vpc-flow-logging#aws-console",
      "Terraform": "https://docs.prowler.com/checks/aws/logging-policies/logging_9-enable-vpc-flow-logging#terraform"
    },
    "Recommendation": {
      "Text": "It is recommended that VPC Flow Logs be enabled for packet Rejects for VPCs.",
      "Url": "http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/flow-logs.html"
    }
  },
  "Categories": [
    "forensics-ready",
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vpc_flow_logs_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_flow_logs_enabled/vpc_flow_logs_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class vpc_flow_logs_enabled(Check):
    def execute(self):
        findings = []
        for vpc in vpc_client.vpcs.values():
            if vpc_client.provider.scan_unused_services or vpc.in_use:
                report = Check_Report_AWS(metadata=self.metadata(), resource=vpc)
                report.status = "FAIL"
                report.status_extended = (
                    f"VPC {vpc.name if vpc.name else vpc.id} Flow logs are disabled."
                )
                if vpc.flow_log:
                    report.status = "PASS"
                    report.status_extended = (
                        f"VPC {vpc.name if vpc.name else vpc.id} Flow logs are enabled."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vpc_peering_routing_tables_with_least_privilege.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_peering_routing_tables_with_least_privilege/vpc_peering_routing_tables_with_least_privilege.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "vpc_peering_routing_tables_with_least_privilege",
  "CheckTitle": "Ensure routing tables for VPC peering are least access.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "vpc",
  "SubServiceName": "route_table",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2VpcPeeringConnection",
  "Description": "Ensure routing tables for VPC peering are least access.",
  "Risk": "Being highly selective in peering routing tables is a very effective way of minimizing the impact of breach as resources outside of these routes are inaccessible to the peered VPC.",
  "RelatedUrl": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/VPC/vpc-peering-access.html#",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/networking-policies/networking_5",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review routing tables of peered VPCs for whether they route all subnets of each VPC and whether that is necessary to accomplish the intended purposes for peering the VPCs.",
      "Url": "https://docs.aws.amazon.com/vpc/latest/peering/peering-configurations-partial-access.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vpc_peering_routing_tables_with_least_privilege.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_peering_routing_tables_with_least_privilege/vpc_peering_routing_tables_with_least_privilege.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class vpc_peering_routing_tables_with_least_privilege(Check):
    def execute(self):
        findings = []
        for peer in vpc_client.vpc_peering_connections:
            report = Check_Report_AWS(metadata=self.metadata(), resource=peer)
            report.status = "PASS"
            report.status_extended = (
                f"VPC Peering Connection {peer.id} comply with least privilege access."
            )
            comply = True
            # Check each cidr in the peering route table
            for route_table in peer.route_tables:
                for cidr in route_table.destination_cidrs:
                    if (
                        cidr == "0.0.0.0/0"
                        or cidr == peer.requester_cidr
                        or cidr == peer.accepter_cidr
                    ):  # Check if cidr does not accept whole requester/accepter VPC CIDR
                        comply = False
            if not comply:
                report.status = "FAIL"
                report.status_extended = f"VPC Peering Connection {peer.id} does not comply with least privilege access since it accepts whole VPCs CIDR in its route tables."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vpc_subnet_different_az.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_subnet_different_az/vpc_subnet_different_az.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "vpc_subnet_different_az",
  "CheckTitle": "Ensure all VPC has subnets in more than one availability zone",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "vpc",
  "SubServiceName": "subnet",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Vpc",
  "Description": "Ensure all VPC has subnets in more than one availability zone",
  "Risk": "",
  "RelatedUrl": "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 create-subnet",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure all VPC has subnets in more than one availability zone",
      "Url": "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"
    }
  },
  "Categories": [
    "redundancy"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vpc_subnet_different_az.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_subnet_different_az/vpc_subnet_different_az.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class vpc_subnet_different_az(Check):
    def execute(self):
        findings = []
        for vpc in vpc_client.vpcs.values():
            if vpc_client.provider.scan_unused_services or vpc.in_use:
                report = Check_Report_AWS(metadata=self.metadata(), resource=vpc)
                report.status = "FAIL"
                report.status_extended = (
                    f"VPC {vpc.name if vpc.name else vpc.id} has no subnets."
                )
                if vpc.subnets:
                    availability_zone = None
                    for subnet in vpc.subnets:
                        if (
                            availability_zone
                            and subnet.availability_zone != availability_zone
                        ):
                            report.status = "PASS"
                            report.status_extended = f"VPC {vpc.name if vpc.name else vpc.id} has subnets in more than one availability zone."
                            break
                        availability_zone = subnet.availability_zone
                        report.status_extended = f"VPC {vpc.name if vpc.name else vpc.id} has only subnets in {availability_zone}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vpc_subnet_no_public_ip_by_default.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_subnet_no_public_ip_by_default/vpc_subnet_no_public_ip_by_default.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "vpc_subnet_no_public_ip_by_default",
  "CheckTitle": "Ensure VPC subnets do not assign public IP by default",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "vpc",
  "SubServiceName": "subnet",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Subnet",
  "Description": "Ensure VPC subnets do not assign public IP by default",
  "Risk": "VPC subnet is a part of the VPC having its own rules for traffic. Assigning the Public IP to the subnet automatically (on launch) can accidentally expose the instances within this subnet to internet and should be edited to 'No' post creation of the Subnet.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/subnet-auto-assign-public-ip-disabled.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/aws/networking-policies/ensure-vpc-subnets-do-not-assign-public-ip-by-default#terraform"
    },
    "Recommendation": {
      "Text": "VPC subnets should not allow automatic public IP assignment",
      "Url": "https://docs.aws.amazon.com/config/latest/developerguide/subnet-auto-assign-public-ip-disabled.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vpc_subnet_no_public_ip_by_default.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_subnet_no_public_ip_by_default/vpc_subnet_no_public_ip_by_default.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class vpc_subnet_no_public_ip_by_default(Check):
    def execute(self):
        findings = []
        for vpc in vpc_client.vpcs.values():
            for subnet in vpc.subnets:
                # Check if ignoring flag is set and if the VPC Subnet is in use
                if vpc_client.provider.scan_unused_services or subnet.in_use:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=subnet)
                    if subnet.mapPublicIpOnLaunch:
                        report.status = "FAIL"
                        report.status_extended = f"VPC subnet {subnet.name if subnet.name else subnet.id} assigns public IP by default."
                    else:
                        report.status = "PASS"
                        report.status_extended = f"VPC subnet {subnet.name if subnet.name else subnet.id} does NOT assign public IP by default."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vpc_subnet_separate_private_public.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_subnet_separate_private_public/vpc_subnet_separate_private_public.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "vpc_subnet_separate_private_public",
  "CheckTitle": "Ensure all VPC has public and private subnets defined",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "vpc",
  "SubServiceName": "subnet",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Vpc",
  "Description": "Ensure all VPC has public and private subnets defined",
  "Risk": "",
  "RelatedUrl": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 create-subnet",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure all VPC has public and private subnets defined",
      "Url": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vpc_subnet_separate_private_public.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_subnet_separate_private_public/vpc_subnet_separate_private_public.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class vpc_subnet_separate_private_public(Check):
    def execute(self):
        findings = []
        for vpc in vpc_client.vpcs.values():
            if vpc_client.provider.scan_unused_services or vpc.in_use:
                report = Check_Report_AWS(metadata=self.metadata(), resource=vpc)
                report.status = "FAIL"
                report.status_extended = (
                    f"VPC {vpc.name if vpc.name else vpc.id} has no subnets."
                )
                if vpc.subnets:
                    public = False
                    private = False
                    for subnet in vpc.subnets:
                        if subnet.public:
                            public = True
                            report.status_extended = f"VPC {vpc.name if vpc.name else vpc.id} has only public subnets."
                        if not subnet.public:
                            private = True
                            report.status_extended = f"VPC {vpc.name if vpc.name else vpc.id} has only private subnets."
                        if public and private:
                            report.status = "PASS"
                            report.status_extended = f"VPC {vpc.name if vpc.name else vpc.id} has private and public subnets."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vpc_vpn_connection_tunnels_up.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_vpn_connection_tunnels_up/vpc_vpn_connection_tunnels_up.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "vpc_vpn_connection_tunnels_up",
  "CheckTitle": "Both VPN tunnels for an AWS Site-to-Site VPN connection should be up",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "vpc",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:vpn-connection/resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2ClientVpnEndpoint",
  "Description": "A VPN tunnel is an encrypted link where data can pass from the customer network to or from AWS within an AWS Site-to-Site VPN connection. Each VPN connection includes two VPN tunnels which you can simultaneously use for high availability. Ensuring that both VPN tunnels are up for a VPN connection is important for confirming a secure and highly available connection between an AWS VPC and your remote network.",
  "Risk": "If one or both VPN tunnels are down, it can compromise the security and availability of the connection between your AWS VPC and your remote network. This could result in connectivity issues and potential data exposure or loss during the downtime, affecting business operations and overall network security.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/vpc-vpn-2-tunnels-up.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html#ec2-20",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To modify VPN tunnel options, see Modifying Site-to-Site VPN tunnel options in the AWS Site-to-Site VPN User Guide.",
      "Url": "https://docs.aws.amazon.com/vpn/latest/s2svpn/modify-vpn-tunnel-options.html"
    }
  },
  "Categories": [
    "redundancy"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vpc_vpn_connection_tunnels_up.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_vpn_connection_tunnels_up/vpc_vpn_connection_tunnels_up.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class vpc_vpn_connection_tunnels_up(Check):
    def execute(self):
        findings = []
        for vpn_connection in vpc_client.vpn_connections.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=vpn_connection)

            if (
                vpn_connection.tunnels[0].status != "UP"
                or vpn_connection.tunnels[1].status != "UP"
            ):
                report.status = "FAIL"
                report.status_extended = (
                    f"VPN Connection {vpn_connection.id} has at least one tunnel DOWN. "
                )
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"VPN Connection {vpn_connection.id} has both tunnels UP. "
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: wafregional_client.py]---
Location: prowler-master/prowler/providers/aws/services/waf/wafregional_client.py

```python
from prowler.providers.aws.services.waf.waf_service import WAFRegional
from prowler.providers.common.provider import Provider

wafregional_client = WAFRegional(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: waf_client.py]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_client.py

```python
from prowler.providers.aws.services.waf.waf_service import WAF
from prowler.providers.common.provider import Provider

waf_client = WAF(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: waf_service.py]---
Location: prowler-master/prowler/providers/aws/services/waf/waf_service.py
Signals: Pydantic

```python
from typing import Dict, List, Optional

from pydantic.v1 import BaseModel, Field

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class WAF(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("waf", provider)
        self.rules = {}
        self.rule_groups = {}
        self.web_acls = {}
        if self.audited_partition == "aws":
            # AWS WAF is available globally for CloudFront distributions, but you must use the Region US East (N. Virginia) to create your web ACL and any resources used in the web ACL, such as rule groups, IP sets, and regex pattern sets.
            self.region = "us-east-1"
            self.client = self.session.client(self.service, self.region)
            self._list_rules()
            self.__threading_call__(self._get_rule, self.rules.values())
            self._list_rule_groups()
            self.__threading_call__(
                self._list_activated_rules_in_rule_group, self.rule_groups.values()
            )
            self._list_web_acls()
            self.__threading_call__(self._get_web_acl, self.web_acls.values())
            self.__threading_call__(
                self._get_logging_configuration, self.web_acls.values()
            )

    def _list_rules(self):
        logger.info("WAF - Listing Global Rules...")
        try:
            for rule in self.client.list_rules().get("Rules", []):
                arn = f"arn:{self.audited_partition}:waf:{self.region}:{self.audited_account}:rule/{rule['RuleId']}"
                self.rules[arn] = Rule(
                    arn=arn,
                    id=rule.get("RuleId", ""),
                    region=self.region,
                    name=rule.get("Name", ""),
                )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_rule(self, rule):
        logger.info(f"WAF - Getting Global Rule {rule.name}...")
        try:
            get_rule = self.client.get_rule(RuleId=rule.id)
            for predicate in get_rule.get("Rule", {}).get("Predicates", []):
                rule.predicates.append(
                    Predicate(
                        negated=predicate.get("Negated", False),
                        type=predicate.get("Type", "IPMatch"),
                        data_id=predicate.get("DataId", ""),
                    )
                )

        except Exception as error:
            logger.error(
                f"{rule.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_rule_groups(self):
        logger.info("WAF - Listing Global Rule Groups...")
        try:
            for rule_group in self.client.list_rule_groups().get("RuleGroups", []):
                arn = f"arn:{self.audited_partition}:waf:{self.region}:{self.audited_account}:rulegroup/{rule_group['RuleGroupId']}"
                self.rule_groups[arn] = RuleGroup(
                    arn=arn,
                    region=self.region,
                    id=rule_group.get("RuleGroupId", ""),
                    name=rule_group.get("Name", ""),
                )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_activated_rules_in_rule_group(self, rule_group):
        logger.info(
            f"WAF - Listing activated rules in Global Rule Group {rule_group.name}..."
        )
        try:
            for rule in self.client.list_activated_rules_in_rule_group(
                RuleGroupId=rule_group.id
            ).get("ActivatedRules", []):
                rule_arn = f"arn:{self.audited_partition}:waf:{self.region}:{self.audited_account}:rule/{rule.get('RuleId', '')}"
                rule_group.rules.append(self.rules[rule_arn])

        except Exception as error:
            logger.error(
                f"{rule_group.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_web_acls(self):
        logger.info("WAF - Listing Global Web ACLs...")
        try:
            for waf in self.client.list_web_acls()["WebACLs"]:
                if not self.audit_resources or (
                    is_resource_filtered(waf["WebACLId"], self.audit_resources)
                ):
                    arn = f"arn:{self.audited_partition}:waf:{self.region}:{self.audited_account}:webacl/{waf['WebACLId']}"
                    self.web_acls[arn] = WebAcl(
                        arn=arn,
                        name=waf["Name"],
                        id=waf["WebACLId"],
                        albs=[],
                        region=self.region,
                    )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_web_acl(self, acl):
        logger.info(f"WAF - Getting Global Web ACL {acl.name}...")
        try:
            get_web_acl = self.client.get_web_acl(WebACLId=acl.id)
            for rule in get_web_acl.get("WebACL", {}).get("Rules", []):
                rule_id = rule.get("RuleId", "")
                if rule.get("Type", "") == "GROUP":
                    rule_group_arn = f"arn:{self.audited_partition}:waf:{self.region}:{self.audited_account}:rulegroup/{rule_id}"
                    acl.rule_groups.append(self.rule_groups[rule_group_arn])
                else:
                    rule_arn = f"arn:{self.audited_partition}:waf:{self.region}:{self.audited_account}:rule/{rule_id}"
                    acl.rules.append(self.rules[rule_arn])

        except Exception as error:
            logger.error(
                f"{acl.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_logging_configuration(self, acl):
        logger.info(f"WAF - Getting Global Web ACL {acl.name} logging configuration...")
        try:
            get_logging_configuration = self.client.get_logging_configuration(
                ResourceArn=acl.arn
            )
            acl.logging_enabled = bool(
                get_logging_configuration.get("LoggingConfiguration", {}).get(
                    "LogDestinationConfigs", []
                )
            )

        except Exception as error:
            logger.error(
                f"{acl.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class WAFRegional(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("waf-regional", provider)
        self.rules = {}
        self.rule_groups = {}
        self.web_acls = {}
        self.__threading_call__(self._list_rules)
        self.__threading_call__(self._get_rule, self.rules.values())
        self.__threading_call__(self._list_rule_groups)
        self.__threading_call__(
            self._list_activated_rules_in_rule_group, self.rule_groups.values()
        )
        self.__threading_call__(self._list_web_acls)
        self.__threading_call__(self._get_web_acl, self.web_acls.values())
        self.__threading_call__(self._list_resources_for_web_acl)

    def _list_rules(self, regional_client):
        logger.info("WAFRegional - Listing Regional Rules...")
        try:
            for rule in regional_client.list_rules().get("Rules", []):
                arn = f"arn:{self.audited_partition}:waf-regional:{regional_client.region}:{self.audited_account}:rule/{rule['RuleId']}"
                self.rules[arn] = Rule(
                    arn=arn,
                    id=rule.get("RuleId", ""),
                    region=regional_client.region,
                    name=rule.get("Name", ""),
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_rule(self, rule):
        logger.info(f"WAFRegional - Getting Rule {rule.name}...")
        try:
            get_rule = self.regional_clients[rule.region].get_rule(RuleId=rule.id)
            for predicate in get_rule.get("Rule", {}).get("Predicates", []):
                rule.predicates.append(
                    Predicate(
                        negated=predicate.get("Negated", False),
                        type=predicate.get("Type", "IPMatch"),
                        data_id=predicate.get("DataId", ""),
                    )
                )
        except Exception as error:
            logger.error(
                f"{rule.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_rule_groups(self, regional_client):
        logger.info("WAFRegional - Listing Regional Rule Groups...")
        try:
            for rule_group in regional_client.list_rule_groups().get("RuleGroups", []):
                arn = f"arn:{self.audited_partition}:waf-regional:{regional_client.region}:{self.audited_account}:rulegroup/{rule_group['RuleGroupId']}"
                self.rule_groups[arn] = RuleGroup(
                    arn=arn,
                    region=regional_client.region,
                    id=rule_group.get("RuleGroupId", ""),
                    name=rule_group.get("Name", ""),
                )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_activated_rules_in_rule_group(self, rule_group):
        logger.info(
            f"WAFRegional - Listing activated rules in Rule Group {rule_group.name}..."
        )
        try:
            for rule in (
                self.regional_clients[rule_group.region]
                .list_activated_rules_in_rule_group(RuleGroupId=rule_group.id)
                .get("ActivatedRules", [])
            ):
                rule_arn = f"arn:{self.audited_partition}:waf-regional:{rule_group.region}:{self.audited_account}:rule/{rule.get('RuleId', '')}"
                rule_group.rules.append(self.rules[rule_arn])

        except Exception as error:
            logger.error(
                f"{rule_group.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_web_acls(self, regional_client):
        logger.info("WAFRegional - Listing Regional Web ACLs...")
        try:
            for waf in regional_client.list_web_acls()["WebACLs"]:
                if not self.audit_resources or (
                    is_resource_filtered(waf["WebACLId"], self.audit_resources)
                ):
                    arn = f"arn:{self.audited_partition}:waf-regional:{regional_client.region}:{self.audited_account}:webacl/{waf['WebACLId']}"
                    self.web_acls[arn] = WebAcl(
                        arn=arn,
                        name=waf["Name"],
                        id=waf["WebACLId"],
                        albs=[],
                        region=regional_client.region,
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_web_acl(self, acl):
        logger.info(f"WAFRegional - Getting Regional Web ACL {acl.name}...")
        try:
            get_web_acl = self.regional_clients[acl.region].get_web_acl(WebACLId=acl.id)
            for rule in get_web_acl.get("WebACL", {}).get("Rules", []):
                rule_id = rule.get("RuleId", "")
                if rule.get("Type", "") == "GROUP":
                    rule_group_arn = f"arn:{self.audited_partition}:waf-regional:{acl.region}:{self.audited_account}:rulegroup/{rule_id}"
                    acl.rule_groups.append(self.rule_groups[rule_group_arn])
                else:
                    rule_arn = f"arn:{self.audited_partition}:waf-regional:{acl.region}:{self.audited_account}:rule/{rule_id}"
                    acl.rules.append(self.rules[rule_arn])

        except Exception as error:
            logger.error(
                f"{acl.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_resources_for_web_acl(self, regional_client):
        logger.info("WAFRegional - Describing resources...")
        try:
            for acl in self.web_acls.values():
                if acl.region == regional_client.region:
                    for resource in regional_client.list_resources_for_web_acl(
                        WebACLId=acl.id, ResourceType="APPLICATION_LOAD_BALANCER"
                    ).get("ResourceArns", []):
                        acl.albs.append(resource)

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Predicate(BaseModel):
    """Conditions for WAF and WAFRegional Rules"""

    negated: bool
    type: str
    data_id: str


class Rule(BaseModel):
    """Rule Model for WAF and WAFRegional"""

    arn: str
    id: str
    region: str
    name: str
    predicates: Optional[List[Predicate]] = Field(default_factory=list)
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)


class RuleGroup(BaseModel):
    """RuleGroup Model for WAF and WAFRegional"""

    arn: str
    id: str
    region: str
    name: str
    rules: List[Rule] = Field(default_factory=list)
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)


class WebAcl(BaseModel):
    """Web ACL Model for WAF and WAFRegional"""

    arn: str
    name: str
    id: str
    albs: List[str] = Field(default_factory=list)
    region: str
    rules: List[Rule] = Field(default_factory=list)
    rule_groups: List[RuleGroup] = Field(default_factory=list)
    logging_enabled: bool = Field(default=False)
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)
```

--------------------------------------------------------------------------------

````
