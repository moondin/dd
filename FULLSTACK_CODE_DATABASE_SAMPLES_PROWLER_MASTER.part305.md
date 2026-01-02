---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 305
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 305 of 867)

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

---[FILE: networkfirewall_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_logging_enabled/networkfirewall_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.networkfirewall.networkfirewall_client import (
    networkfirewall_client,
)


class networkfirewall_logging_enabled(Check):
    def execute(self):
        findings = []
        for firewall in networkfirewall_client.network_firewalls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=firewall)
            report.status = "FAIL"
            report.status_extended = (
                f"Network Firewall {firewall.name} does not have logging enabled."
            )

            for configuration in firewall.logging_configuration:
                if configuration.log_type or configuration.log_destination:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Network Firewall {firewall.name} has logging enabled."
                    )
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_multi_az.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_multi_az/networkfirewall_multi_az.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "networkfirewall_multi_az",
  "CheckTitle": "Network Firewall firewall is deployed across multiple Availability Zones",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls",
    "Effects/Denial of Service"
  ],
  "ServiceName": "networkfirewall",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsNetworkFirewallFirewall",
  "Description": "**AWS Network Firewall firewalls** are assessed for **multi-AZ deployment**, expecting subnet mappings in more than one Availability Zone.\n\nA configuration with only one subnet mapping indicates a single-AZ firewall.",
  "Risk": "Single-AZ firewalls are a single point of failure. An AZ outage can drop or blackhole traffic, degrading **availability**, or prompt route changes that bypass inspection, exposing **confidentiality** and **integrity** to unfiltered access, data exfiltration, and lateral movement.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/id_id/network-firewall/latest/developerguide/arch-two-zone-igw.html",
    "https://aws.amazon.com/es/blogs/networking-and-content-delivery/deployment-models-for-aws-network-firewall/",
    "https://docs.aws.amazon.com/network-firewall/latest/developerguide/arch-two-zone-igw.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/networkfirewall-controls.html#networkfirewall-1"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws network-firewall associate-subnets --firewall-arn <FIREWALL_ARN> --subnet-mappings SubnetId=<SUBNET_ID_IN_DIFFERENT_AZ>",
      "NativeIaC": "```yaml\n# CloudFormation: Ensure the firewall spans multiple AZs by adding a second subnet mapping\nResources:\n  <example_resource_name>:\n    Type: AWS::NetworkFirewall::Firewall\n    Properties:\n      FirewallName: <example_resource_name>\n      FirewallPolicyArn: <example_firewall_policy_arn>\n      VpcId: <example_vpc_id>\n      SubnetMappings:\n        - SubnetId: <subnet-id-1>\n        - SubnetId: <subnet-id-2>  # CRITICAL: second subnet in a different AZ to achieve multi-AZ\n```",
      "Other": "1. Open the AWS Console and go to VPC > Network Firewall > Firewalls\n2. Select your firewall and open the Firewall details tab\n3. In Associated policy and VPC, click Edit\n4. Click Add new subnet, choose an additional Availability Zone and its subnet in the same VPC\n5. Ensure at least two AZs are selected, then click Save",
      "Terraform": "```hcl\n# Terraform: Add a second subnet_mapping to deploy the firewall across multiple AZs\nresource \"aws_networkfirewall_firewall\" \"<example_resource_name>\" {\n  name                = \"<example_resource_name>\"\n  firewall_policy_arn = \"<example_firewall_policy_arn>\"\n  vpc_id              = \"<example_vpc_id>\"\n\n  subnet_mapping {\n    subnet_id = \"<subnet-id-1>\"\n  }\n\n  subnet_mapping {\n    subnet_id = \"<subnet-id-2>\"  # CRITICAL: second subnet in a different AZ for multi-AZ\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Deploy firewalls across `>=2` AZs with a dedicated subnet in each used AZ. Maintain per-AZ, symmetric routing to the local endpoint to preserve stateful inspection. Apply **defense in depth** and automate drift controls and AZ failover tests to sustain resilience.",
      "Url": "https://hub.prowler.com/check/networkfirewall_multi_az"
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

---[FILE: networkfirewall_multi_az.py]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_multi_az/networkfirewall_multi_az.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.networkfirewall.networkfirewall_client import (
    networkfirewall_client,
)


class networkfirewall_multi_az(Check):
    def execute(self):
        findings = []
        for firewall in networkfirewall_client.network_firewalls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=firewall)
            report.status = "FAIL"
            report.status_extended = (
                f"Network Firewall {firewall.name} is not deployed across multiple AZ."
            )

            if len(firewall.subnet_mappings) > 1:
                report.status = "PASS"
                report.status_extended = (
                    f"Network Firewall {firewall.name} is deployed across multiple AZ."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_policy_default_action_fragmented_packets.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_policy_default_action_fragmented_packets/networkfirewall_policy_default_action_fragmented_packets.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "networkfirewall_policy_default_action_fragmented_packets",
  "CheckTitle": "Network Firewall policy drops or forwards fragmented packets by default",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)",
    "TTPs/Defense Evasion"
  ],
  "ServiceName": "networkfirewall",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsNetworkFirewallFirewall",
  "Description": "**Network Firewall policies** are assessed for the `StatelessFragmentDefaultActions` setting to confirm **fragmented UDP packets** use `aws:drop` or `aws:forward_to_sfe`.",
  "Risk": "Using `aws:pass` for **fragmented UDP** lets uninspected traffic traverse the firewall. Attackers can evade filters via fragmentation, enabling **data exfiltration** (confidentiality), payload smuggling and lateral movement (integrity), and fragment floods that strain services (availability).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/network-firewall/latest/APIReference/API_FirewallPolicy.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/networkfirewall-controls.html#networkfirewall-5",
    "https://docs.aws.amazon.com/network-firewall/latest/developerguide/firewall-policy-updating.html",
    "https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateless-default-actions.html",
    "https://docs.aws.amazon.com/config/latest/developerguide/netfw-policy-default-action-fragment-packets.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::NetworkFirewall::FirewallPolicy\n    Properties:\n      FirewallPolicyName: <example_resource_name>\n      FirewallPolicy:\n        StatelessDefaultActions:\n          - aws:drop\n        StatelessFragmentDefaultActions:\n          - aws:drop  # Critical: ensures fragmented UDP packets are dropped by default to pass the check\n```",
      "Other": "1. Open the Amazon VPC console and go to Network Firewall > Firewall policies\n2. Select the policy to edit and choose Edit\n3. Under Stateless default actions, find Fragmented packets\n4. Set the action to Drop (or Forward to stateful rule groups)\n5. Save changes",
      "Terraform": "```hcl\nresource \"aws_networkfirewall_firewall_policy\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  firewall_policy {\n    stateless_default_actions          = [\"aws:drop\"]\n    stateless_fragment_default_actions = [\"aws:drop\"]  # Critical: drop fragmented UDP packets by default to pass the check\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Set `StatelessFragmentDefaultActions` to `aws:drop` or `aws:forward_to_sfe` so fragments are blocked or sent for **stateful inspection**. Apply **least privilege** on traffic flows, use **defense in depth** with rule groups, and monitor logs for anomalous fragmentation.",
      "Url": "https://hub.prowler.com/check/networkfirewall_policy_default_action_fragmented_packets"
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

---[FILE: networkfirewall_policy_default_action_fragmented_packets.py]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_policy_default_action_fragmented_packets/networkfirewall_policy_default_action_fragmented_packets.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.networkfirewall.networkfirewall_client import (
    networkfirewall_client,
)


class networkfirewall_policy_default_action_fragmented_packets(Check):
    def execute(self):
        findings = []
        for firewall in networkfirewall_client.network_firewalls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=firewall)
            report.status = "FAIL"
            report.status_extended = f"Network Firewall {firewall.name} policy does not drop or forward fragmented packets by default."

            if (
                "aws:drop" in firewall.default_stateless_frag_actions
                or "aws:forward_to_sfe" in firewall.default_stateless_frag_actions
            ):
                report.status = "PASS"
                report.status_extended = f"Network Firewall {firewall.name} policy does drop or forward fragmented packets by default."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_policy_default_action_full_packets.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_policy_default_action_full_packets/networkfirewall_policy_default_action_full_packets.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "networkfirewall_policy_default_action_full_packets",
  "CheckTitle": "Network Firewall firewall policy default stateless action for full packets is drop or forward",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "networkfirewall",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsNetworkFirewallFirewall",
  "Description": "**AWS Network Firewall policies** define a **stateless default action** for full packets. This evaluates whether unmatched packets are handled by `aws:drop` or `aws:forward_to_sfe`, meaning they are either discarded or sent to the stateful engine rather than allowed to pass.",
  "Risk": "Using `Pass` as the default allows unmatched full packets to bypass stateless filtering and stateful inspection, enabling reconnaissance, malware delivery, and covert data exfiltration. This undermines **confidentiality** and **integrity**, and can threaten **availability** through unfiltered attacks.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/networkfirewall-controls.html#networkfirewall-4",
    "https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateless-default-actions.html",
    "https://docs.aws.amazon.com/network-firewall/latest/developerguide/firewall-policy-updating.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: set default stateless action for full packets to Drop\nResources:\n  <example_resource_name>:\n    Type: AWS::NetworkFirewall::FirewallPolicy\n    Properties:\n      FirewallPolicyName: <example_resource_name>\n      FirewallPolicy:\n        StatelessDefaultActions:\n          - aws:drop  # CRITICAL: full packets default to Drop (fixes the check)\n        StatelessFragmentDefaultActions:\n          - aws:drop  # Required for a valid policy\n```",
      "Other": "1. In the AWS console, open Amazon VPC\n2. Under Network Firewall, select Firewall policies\n3. Open the target firewall policy and choose Edit\n4. In Stateless default actions (full packets), select Drop (or Forward to stateful rule groups)\n5. Choose Save",
      "Terraform": "```hcl\n# Terraform: set default stateless action for full packets to Drop\nresource \"aws_networkfirewall_firewall_policy\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  firewall_policy {\n    stateless_default_actions          = [\"aws:drop\"]  # CRITICAL: full packets default to Drop (fixes the check)\n    stateless_fragment_default_actions = [\"aws:drop\"]  # Required for a valid policy\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce a **deny-by-default** posture: set the stateless default for full packets to `aws:drop` or `aws:forward_to_sfe`. Use explicit allow rules, layer **stateful inspection**, and maintain logging and reviews to support **defense in depth** and **least privilege**.",
      "Url": "https://hub.prowler.com/check/networkfirewall_policy_default_action_full_packets"
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

---[FILE: networkfirewall_policy_default_action_full_packets.py]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_policy_default_action_full_packets/networkfirewall_policy_default_action_full_packets.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.networkfirewall.networkfirewall_client import (
    networkfirewall_client,
)


class networkfirewall_policy_default_action_full_packets(Check):
    def execute(self):
        findings = []
        for firewall in networkfirewall_client.network_firewalls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=firewall)
            report.status = "FAIL"
            report.status_extended = f"Network Firewall {firewall.name} policy does not drop or forward full packets by default."

            if (
                "aws:drop" in firewall.default_stateless_actions
                or "aws:forward_to_sfe" in firewall.default_stateless_actions
            ):
                report.status = "PASS"
                report.status_extended = f"Network Firewall {firewall.name} policy does drop or forward full packets by default."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_policy_rule_group_associated.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_policy_rule_group_associated/networkfirewall_policy_rule_group_associated.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "networkfirewall_policy_rule_group_associated",
  "CheckTitle": "Network Firewall policy has at least one rule group associated",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)"
  ],
  "ServiceName": "networkfirewall",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsNetworkFirewallFirewall",
  "Description": "Network Firewall policies have one or more **stateful** or **stateless rule groups** associated to define packet inspection and handling.\n\nPolicies with no rule groups are identified.",
  "Risk": "Without rule groups, traffic isn't meaningfully inspected, allowing unauthorized flows across VPC boundaries.\n\nImpacts:\n- Confidentiality: data exfiltration\n- Integrity: unauthorized changes via exposed services\n- Availability: C2, scanning, or DoS traffic passes; enables lateral movement",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-groups.html",
    "https://docs.aws.amazon.com/network-firewall/latest/developerguide/firewall-policy-updating.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/networkfirewall-controls.html#networkfirewall-3",
    "https://medium.com/slalom-blog/secure-internet-access-egress-filtering-with-aws-network-firewall-ddf52ae121f9",
    "https://docs.aws.amazon.com/de_de/network-firewall/latest/developerguide/nwfw-using-managed-rule-groups-add-to-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Attach at least one rule group to a Network Firewall policy\nResources:\n  FirewallPolicy:\n    Type: AWS::NetworkFirewall::FirewallPolicy\n    Properties:\n      FirewallPolicyName: <example_resource_name>\n      FirewallPolicy:\n        StatelessDefaultActions:\n          - aws:forward_to_sfe\n        StatelessFragmentDefaultActions:\n          - aws:forward_to_sfe\n        # Critical: Associate at least one rule group with the policy to pass the check\n        StatefulRuleGroupReferences:\n          - ResourceArn: <example_resource_arn>  # Critical line: references an existing rule group ARN\n```",
      "Other": "1. Open the AWS Console and go to VPC > Network Firewall > Firewall policies\n2. Select the target firewall policy\n3. In Stateful rule groups (or Stateless rule groups), choose Add rule groups (or Add managed stateful/stateless rule groups)\n4. Select at least one existing rule group and choose Add to policy\n5. Click Save",
      "Terraform": "```hcl\n# Attach at least one rule group to a Network Firewall policy\nresource \"aws_networkfirewall_firewall_policy\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  firewall_policy {\n    stateless_default_actions          = [\"aws:forward_to_sfe\"]\n    stateless_fragment_default_actions = [\"aws:forward_to_sfe\"]\n\n    # Critical: Associate at least one rule group with the policy to pass the check\n    stateful_rule_group_reference {\n      resource_arn = \"<example_resource_arn>\"  # Critical line: references an existing rule group ARN\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Associate appropriate **stateful** and **stateless rule groups** with every policy.\n- Enforce a **deny-by-default** posture (least privilege)\n- Use vetted managed rule groups as a baseline, then tailor to workloads\n- Review and test regularly; version rules, monitor logs, and require change control",
      "Url": "https://hub.prowler.com/check/networkfirewall_policy_rule_group_associated"
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

---[FILE: networkfirewall_policy_rule_group_associated.py]---
Location: prowler-master/prowler/providers/aws/services/networkfirewall/networkfirewall_policy_rule_group_associated/networkfirewall_policy_rule_group_associated.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.networkfirewall.networkfirewall_client import (
    networkfirewall_client,
)


class networkfirewall_policy_rule_group_associated(Check):
    def execute(self):
        findings = []
        for firewall in networkfirewall_client.network_firewalls.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=firewall)
            report.status = "PASS"
            report.status_extended = f"Network Firewall {firewall.name} policy has at least one rule group associated."

            if not firewall.stateful_rule_groups and not firewall.stateless_rule_groups:
                report.status = "FAIL"
                report.status_extended = f"Network Firewall {firewall.name} policy does not have rule groups associated."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: opensearch_client.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_client.py

```python
from prowler.providers.aws.services.opensearch.opensearch_service import (
    OpenSearchService,
)
from prowler.providers.common.provider import Provider

opensearch_client = OpenSearchService(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service.py
Signals: Pydantic

```python
from json import JSONDecodeError, loads
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class OpenSearchService(AWSService):
    def __init__(self, provider):
        super().__init__("opensearch", provider)
        self.opensearch_domains = {}
        self.__threading_call__(self._list_domain_names)
        self.__threading_call__(self._describe_domain, self.opensearch_domains.values())
        self.__threading_call__(self._list_tags, self.opensearch_domains.values())

    def _list_domain_names(self, regional_client):
        logger.info("OpenSearch - listing domain names...")
        try:
            domains = regional_client.list_domain_names()
            for domain in domains["DomainNames"]:
                arn = f"arn:{self.audited_partition}:es:{regional_client.region}:{self.audited_account}:domain/{domain['DomainName']}"
                if not self.audit_resources or (
                    is_resource_filtered(arn, self.audit_resources)
                ):
                    self.opensearch_domains[arn] = OpenSearchDomain(
                        arn=arn,
                        name=domain["DomainName"],
                        region=regional_client.region,
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_domain(self, domain):
        logger.info("OpenSearch - describing domain configurations...")
        try:
            regional_client = self.regional_clients[domain.region]
            describe_domain = regional_client.describe_domain(DomainName=domain.name)
            domain.arn = describe_domain["DomainStatus"]["ARN"]

            if "vpc" in describe_domain["DomainStatus"].get("Endpoints", {}):
                domain.vpc_endpoints = [
                    vpc for vpc in describe_domain["DomainStatus"]["Endpoints"].values()
                ]
            domain.vpc_id = (
                describe_domain["DomainStatus"].get("VPCOptions", {}).get("VPCId", "")
            )
            domain.cognito_options = describe_domain["DomainStatus"][
                "CognitoOptions"
            ].get("Enabled", False)
            domain.encryption_at_rest = describe_domain["DomainStatus"][
                "EncryptionAtRestOptions"
            ].get("Enabled", False)
            domain.node_to_node_encryption = describe_domain["DomainStatus"][
                "NodeToNodeEncryptionOptions"
            ].get("Enabled", False)
            domain.enforce_https = describe_domain["DomainStatus"][
                "DomainEndpointOptions"
            ].get("EnforceHTTPS", False)
            domain.internal_user_database = describe_domain["DomainStatus"][
                "AdvancedSecurityOptions"
            ].get("InternalUserDatabaseEnabled", False)
            domain.saml_enabled = (
                describe_domain["DomainStatus"]["AdvancedSecurityOptions"]
                .get("SAMLOptions", {})
                .get("Enabled", False)
            )
            domain.update_available = (
                describe_domain["DomainStatus"]
                .get("ServiceSoftwareOptions", {})
                .get("UpdateAvailable", False)
            )
            domain.version = describe_domain["DomainStatus"].get("EngineVersion", None)
            domain.advanced_settings_enabled = describe_domain["DomainStatus"][
                "AdvancedSecurityOptions"
            ].get("Enabled", False)
            cluster_config = describe_domain["DomainStatus"].get("ClusterConfig", {})
            domain.instance_count = cluster_config.get("InstanceCount", 0)
            domain.zone_awareness_enabled = cluster_config.get(
                "ZoneAwarenessEnabled", False
            )
            domain.dedicated_master_enabled = cluster_config.get(
                "DedicatedMasterEnabled", False
            )
            domain.dedicated_master_count = cluster_config.get(
                "DedicatedMasterCount", 0
            )
            for logging_key in [
                "SEARCH_SLOW_LOGS",
                "INDEX_SLOW_LOGS",
                "AUDIT_LOGS",
            ]:
                if logging_key in describe_domain["DomainStatus"].get(
                    "LogPublishingOptions", {}
                ):
                    domain.logging.append(
                        PublishingLoggingOption(
                            name=logging_key,
                            enabled=describe_domain["DomainStatus"][
                                "LogPublishingOptions"
                            ][logging_key]["Enabled"],
                        )
                    )
            try:
                if describe_domain["DomainStatus"].get("AccessPolicies"):
                    domain.access_policy = loads(
                        describe_domain["DomainStatus"]["AccessPolicies"]
                    )
            except JSONDecodeError as error:
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags(self, domain):
        logger.info("OpenSearch - List Tags...")
        try:
            regional_client = self.regional_clients[domain.region]
            response = regional_client.list_tags(
                ARN=domain.arn,
            )["TagList"]
            domain.tags = response
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class PublishingLoggingOption(BaseModel):
    name: str
    enabled: bool


class OpenSearchDomain(BaseModel):
    name: str
    region: str
    arn: str
    logging: list[PublishingLoggingOption] = []
    vpc_endpoints: list[str] = []
    vpc_id: str = None
    access_policy: dict = None
    cognito_options: bool = None
    encryption_at_rest: bool = None
    node_to_node_encryption: bool = None
    enforce_https: bool = None
    internal_user_database: bool = None
    saml_enabled: bool = None
    update_available: bool = None
    version: str = None
    instance_count: int = 0
    zone_awareness_enabled: Optional[bool]
    tags: Optional[list] = []
    advanced_settings_enabled: bool = None
    dedicated_master_enabled: Optional[bool]
    dedicated_master_count: int = 0
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_access_control_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_access_control_enabled/opensearch_service_domains_access_control_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "opensearch_service_domains_access_control_enabled",
  "CheckTitle": "Check if Amazon Elasticsearch/Opensearch Service domains have fine grained access control enabled",
  "CheckType": [],
  "ServiceName": "opensearch",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsOpenSearchServiceDomain",
  "Description": "Check if Amazon Elasticsearch/Opensearch Service domains have fine grained access control enabled",
  "Risk": "Amazon ES's fine graine access control enhances security by verifying that access to OpenSearch domains is controlled at a granular level, allowing for more precise permissions management and reducing the risk of unauthorised access.",
  "RelatedUrl": "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/opensearch-controls.html#opensearch-7",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable fine grained access control for your OpenSearch domains",
      "Url": "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html#fgac-enabling"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_access_control_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_access_control_enabled/opensearch_service_domains_access_control_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


class opensearch_service_domains_access_control_enabled(Check):
    def execute(self):
        findings = []
        for domain in opensearch_client.opensearch_domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            report.status = "FAIL"
            report.status_extended = f"Opensearch domain {domain.name} does not have fine grained access control enabled."
            if domain.advanced_settings_enabled:
                report.status = "PASS"
                report.status_extended = f"Opensearch domain {domain.name} has fine grained access control enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_audit_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_audit_logging_enabled/opensearch_service_domains_audit_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "opensearch_service_domains_audit_logging_enabled",
  "CheckTitle": "Check if Amazon Elasticsearch/Opensearch Service domains have audit logging enabled",
  "CheckType": [
    "Identify",
    "Logging"
  ],
  "ServiceName": "opensearch",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "low",
  "ResourceType": "AwsOpenSearchServiceDomain",
  "Description": "Check if Amazon Elasticsearch/Opensearch Service domains have audit logging enabled",
  "Risk": "If logs are not enabled, monitoring of service use and threat analysis is not possible.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Make sure you are logging information about Amazon Elasticsearch Service operations.",
      "Url": "https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/audit-logs.html"
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

---[FILE: opensearch_service_domains_audit_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_audit_logging_enabled/opensearch_service_domains_audit_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


class opensearch_service_domains_audit_logging_enabled(Check):
    def execute(self):
        findings = []
        for domain in opensearch_client.opensearch_domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            report.status = "FAIL"
            report.status_extended = (
                f"Opensearch domain {domain.name} AUDIT_LOGS disabled."
            )
            for logging_item in domain.logging:
                if logging_item.name == "AUDIT_LOGS" and logging_item.enabled:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Opensearch domain {domain.name} AUDIT_LOGS enabled."
                    )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_cloudwatch_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_cloudwatch_logging_enabled/opensearch_service_domains_cloudwatch_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "opensearch_service_domains_cloudwatch_logging_enabled",
  "CheckTitle": "Check if Amazon Elasticsearch/Opensearch Service domains have logging enabled",
  "CheckType": [
    "Identify",
    "Logging"
  ],
  "ServiceName": "opensearch",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsOpenSearchServiceDomain",
  "Description": "Check if Amazon Elasticsearch/Opensearch Service domains have logging enabled",
  "Risk": "Amazon ES exposes four Elasticsearch/Opensearch logs through Amazon CloudWatch Logs: error logs, search slow logs, index slow logs, and audit logs.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws logs put-resource-policy --policy-name <POLICY_NAME> --policy-document <POLICY_DOC_JSON>",
      "NativeIaC": "https://docs.prowler.com/checks/aws/elasticsearch-policies/elasticsearch_7#cloudformation",
      "Other": "https://docs.prowler.com/checks/aws/elasticsearch-policies/elasticsearch_7",
      "Terraform": "https://docs.prowler.com/checks/aws/elasticsearch-policies/elasticsearch_7#terraform"
    },
    "Recommendation": {
      "Text": "Enable Elasticsearch/Opensearch log. Create use cases for them. Using audit logs check for access denied events.",
      "Url": "https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-createdomain-configure-slow-logs.html"
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

---[FILE: opensearch_service_domains_cloudwatch_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_cloudwatch_logging_enabled/opensearch_service_domains_cloudwatch_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


class opensearch_service_domains_cloudwatch_logging_enabled(Check):
    def execute(self):
        findings = []
        for domain in opensearch_client.opensearch_domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            report.status = "FAIL"
            report.status_extended = f"Opensearch domain {domain.name} SEARCH_SLOW_LOGS and INDEX_SLOW_LOGS disabled."
            has_SEARCH_SLOW_LOGS = False
            has_INDEX_SLOW_LOGS = False
            for logging_item in domain.logging:
                if logging_item.name == "SEARCH_SLOW_LOGS" and logging_item.enabled:
                    has_SEARCH_SLOW_LOGS = True
                if logging_item.name == "INDEX_SLOW_LOGS" and logging_item.enabled:
                    has_INDEX_SLOW_LOGS = True

            if has_SEARCH_SLOW_LOGS and has_INDEX_SLOW_LOGS:
                report.status = "PASS"
                report.status_extended = f"Opensearch domain {domain.name} SEARCH_SLOW_LOGS and INDEX_SLOW_LOGS enabled."
            elif not has_SEARCH_SLOW_LOGS and has_INDEX_SLOW_LOGS:
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} INDEX_SLOW_LOGS enabled but SEARCH_SLOW_LOGS disabled."
            elif not has_INDEX_SLOW_LOGS and has_SEARCH_SLOW_LOGS:
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} SEARCH_SLOW_LOGS enabled but INDEX_SLOW_LOGS disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
