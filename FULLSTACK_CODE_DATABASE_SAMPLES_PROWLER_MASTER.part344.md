---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 344
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 344 of 867)

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

---[FILE: network_flow_log_more_than_90_days.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/network/network_flow_log_more_than_90_days/network_flow_log_more_than_90_days.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "network_flow_log_more_than_90_days",
  "CheckTitle": "Ensure that Network Security Group Flow Log retention period is 0, 90 days or greater",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Network",
  "Description": "Network Security Group Flow Logs should be enabled and the retention period set to greater than or equal to 90 days.",
  "Risk": "Flow logs enable capturing information about IP traffic flowing in and out of network security groups. Logs can be used to check for anomalies and give insight into suspected breaches.",
  "RelatedUrl": " https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-nsg-flow-logging-overview",
  "Remediation": {
    "Code": {
      "CLI": "az network watcher flow-log configure --nsg <NameorID of the Network Security Group> --enabled true --resource-group <resourceGroupName> --retention 91 -- storage-account <NameorID of the storage account to save flow logs>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Network/sufficient-nsg-flow-log-retention-period.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-logging-policies/bc_azr_logging_1#terraform"
    },
    "Recommendation": {
      "Text": "From Azure Portal 1. Go to Network Watcher 2. Select NSG flow logs blade in the Logs section 3. Select each Network Security Group from the list 4. Ensure Status is set to On 5. Ensure Retention (days) setting greater than 90 days 6. Select your storage account in the Storage account field 7. Select Save From Azure CLI Enable the NSG flow logs and set the Retention (days) to greater than or equal to 90 days. az network watcher flow-log configure --nsg <NameorID of the Network Security Group> --enabled true --resource-group <resourceGroupName> --retention 91 --storage-account <NameorID of the storage account to save flow logs>",
      "Url": "https://docs.microsoft.com/en-us/cli/azure/network/watcher/flow-log?view=azure-cli-latest"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This will keep IP traffic logs for longer than 90 days. As a level 2, first determine your need to retain data, then apply your selection here. As this is data stored for longer, your monthly storage costs will increase depending on your data use."
}
```

--------------------------------------------------------------------------------

---[FILE: network_flow_log_more_than_90_days.py]---
Location: prowler-master/prowler/providers/azure/services/network/network_flow_log_more_than_90_days/network_flow_log_more_than_90_days.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.network.network_client import network_client


class network_flow_log_more_than_90_days(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, network_watchers in network_client.network_watchers.items():
            for network_watcher in network_watchers:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=network_watcher
                )
                report.subscription = subscription
                if network_watcher.flow_logs:
                    report.status = "PASS"
                    report.status_extended = f"Network Watcher {network_watcher.name} from subscription {subscription} has flow logs enabled for more than 90 days"
                    has_failed = False
                    for flow_log in network_watcher.flow_logs:
                        if not has_failed:
                            if not flow_log.enabled:
                                report.status = "FAIL"
                                report.status_extended = f"Network Watcher {network_watcher.name} from subscription {subscription} has flow logs disabled"
                                has_failed = True
                            elif (
                                flow_log.retention_policy.days < 90
                                and flow_log.retention_policy.days != 0
                            ) and not has_failed:
                                report.status = "FAIL"
                                report.status_extended = f"Network Watcher {network_watcher.name} from subscription {subscription} flow logs retention policy is less than 90 days"
                                has_failed = True
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Network Watcher {network_watcher.name} from subscription {subscription} has no flow logs"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_http_internet_access_restricted.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/network/network_http_internet_access_restricted/network_http_internet_access_restricted.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "network_http_internet_access_restricted",
  "CheckTitle": "Ensure that HTTP(S) access from the Internet is evaluated and restricted",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Network",
  "Description": "Network security groups should be periodically evaluated for port misconfigurations. Where certain ports and protocols may be exposed to the Internet, they should be evaluated for necessity and restricted wherever they are not explicitly required and narrowly configured.",
  "Risk": "The potential security problem with using HTTP(S) over the Internet is that attackers can use various brute force techniques to gain access to Azure resources. Once the attackers gain access, they can use the resource as a launch point for compromising other resources within the Azure tenant.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-network-security#ns-1-establish-network-segmentation-boundaries",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Network/unrestricted-http-access.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Where HTTP(S) is not explicitly required and narrowly configured for resources attached to the Network Security Group, Internet-level access to your Azure resources should be restricted or eliminated. For internal access to relevant resources, configure an encrypted network tunnel such as: ExpressRoute Site-to-site VPN Point-to-site VPN",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: network_http_internet_access_restricted.py]---
Location: prowler-master/prowler/providers/azure/services/network/network_http_internet_access_restricted/network_http_internet_access_restricted.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.network.network_client import network_client


class network_http_internet_access_restricted(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, security_groups in network_client.security_groups.items():
            for security_group in security_groups:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=security_group
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Security Group {security_group.name} from subscription {subscription} has HTTP internet access restricted."
                rule_fail_condition = any(
                    (
                        rule.destination_port_range == "80"
                        or (
                            (
                                rule.destination_port_range
                                and "-" in rule.destination_port_range
                            )
                            and int(rule.destination_port_range.split("-")[0]) <= 80
                            and int(rule.destination_port_range.split("-")[1]) >= 80
                        )
                    )
                    and rule.protocol in ["TCP", "Tcp", "*"]
                    and rule.source_address_prefix in ["Internet", "*", "0.0.0.0/0"]
                    and rule.access == "Allow"
                    and rule.direction == "Inbound"
                    for rule in security_group.security_rules
                )
                if rule_fail_condition:
                    report.status = "FAIL"
                    report.status_extended = f"Security Group {security_group.name} from subscription {subscription} has HTTP internet access allowed."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_public_ip_shodan.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/network/network_public_ip_shodan/network_public_ip_shodan.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "network_public_ip_shodan",
  "CheckTitle": "Check if an Azure Public IP is exposed in Shodan (requires Shodan API KEY).",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Network",
  "Description": "Check if an Azure Public IP is exposed in Shodan (requires Shodan API KEY).",
  "Risk": "If an Azure Public IP is exposed in Shodan, it can be accessed by anyone on the internet. This can lead to unauthorized access to your resources.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Check Identified IPs, Consider changing them to private ones and delete them from Shodan.",
      "Url": "https://www.shodan.io/"
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

---[FILE: network_public_ip_shodan.py]---
Location: prowler-master/prowler/providers/azure/services/network/network_public_ip_shodan/network_public_ip_shodan.py

```python
import shodan

from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.lib.logger import logger
from prowler.providers.azure.services.network.network_client import network_client


class network_public_ip_shodan(Check):
    def execute(self):
        findings = []
        shodan_api_key = network_client.audit_config.get("shodan_api_key")
        if shodan_api_key:
            api = shodan.Shodan(shodan_api_key)
            for subscription, public_ips in network_client.public_ip_addresses.items():
                for ip in public_ips:
                    report = Check_Report_Azure(metadata=self.metadata(), resource=ip)
                    report.subscription = subscription
                    try:
                        shodan_info = api.host(ip.ip_address)
                        report.status = "FAIL"
                        report.status_extended = f"Public IP {ip.ip_address} listed in Shodan with open ports {str(shodan_info['ports'])} and ISP {shodan_info['isp']} in {shodan_info['country_name']}. More info at https://www.shodan.io/host/{ip.ip_address}."
                        findings.append(report)
                    except shodan.APIError as error:
                        if "No information available for that IP" in error.value:
                            report.status = "PASS"
                            report.status_extended = (
                                f"Public IP {ip.ip_address} is not listed in Shodan."
                            )
                            findings.append(report)
                            continue
                        else:
                            logger.error(f"Unknown Shodan API Error: {error.value}")

        else:
            logger.error(
                "No Shodan API Key -- Please input a Shodan API Key with -N/--shodan or in config.yaml"
            )
        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_rdp_internet_access_restricted.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/network/network_rdp_internet_access_restricted/network_rdp_internet_access_restricted.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "network_rdp_internet_access_restricted",
  "CheckTitle": "Ensure that RDP access from the Internet is evaluated and restricted",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Network",
  "Description": "Network security groups should be periodically evaluated for port misconfigurations. Where certain ports and protocols may be exposed to the Internet, they should be evaluated for necessity and restricted wherever they are not explicitly required.",
  "Risk": "The potential security problem with using RDP over the Internet is that attackers can use various brute force techniques to gain access to Azure Virtual Machines. Once the attackers gain access, they can use a virtual machine as a launch point for compromising other machines on an Azure Virtual Network or even attack networked devices outside of Azure.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/security/azure-security-network-security-best-practices#disable-rdpssh-access-to-azure-virtual-machines",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Network/unrestricted-rdp-access.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/bc_azr_networking_2#terraform"
    },
    "Recommendation": {
      "Text": "Where RDP is not explicitly required and narrowly configured for resources attached to the Network Security Group, Internet-level access to your Azure resources should be restricted or eliminated. For internal access to relevant resources, configure an encrypted network tunnel such as: ExpressRoute Site-to-site VPN Point-to-site VPN",
      "Url": "https://docs.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-network-security#ns-1-establish-network-segmentation-boundaries"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: network_rdp_internet_access_restricted.py]---
Location: prowler-master/prowler/providers/azure/services/network/network_rdp_internet_access_restricted/network_rdp_internet_access_restricted.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.network.network_client import network_client


class network_rdp_internet_access_restricted(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, security_groups in network_client.security_groups.items():
            for security_group in security_groups:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=security_group
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Security Group {security_group.name} from subscription {subscription} has RDP internet access restricted."
                rule_fail_condition = any(
                    (
                        rule.destination_port_range == "3389"
                        or (
                            (
                                rule.destination_port_range
                                and "-" in rule.destination_port_range
                            )
                            and int(rule.destination_port_range.split("-")[0]) <= 3389
                            and int(rule.destination_port_range.split("-")[1]) >= 3389
                        )
                    )
                    and rule.protocol in ["TCP", "Tcp", "*"]
                    and rule.source_address_prefix in ["Internet", "*", "0.0.0.0/0"]
                    and rule.access == "Allow"
                    and rule.direction == "Inbound"
                    for rule in security_group.security_rules
                )
                if rule_fail_condition:
                    report.status = "FAIL"
                    report.status_extended = f"Security Group {security_group.name} from subscription {subscription} has RDP internet access allowed."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_ssh_internet_access_restricted.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/network/network_ssh_internet_access_restricted/network_ssh_internet_access_restricted.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "network_ssh_internet_access_restricted",
  "CheckTitle": "Ensure that SSH access from the Internet is evaluated and restricted",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Network",
  "Description": "Network security groups should be periodically evaluated for port misconfigurations. Where certain ports and protocols may be exposed to the Internet, they should be evaluated for necessity and restricted wherever they are not explicitly required.",
  "Risk": "The potential security problem with using SSH over the Internet is that attackers can use various brute force techniques to gain access to Azure Virtual Machines. Once the attackers gain access, they can use a virtual machine as a launch point for compromising other machines on the Azure Virtual Network or even attack networked devices outside of Azure.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/security/azure-security-network-security-best-practices#disable-rdpssh-access-to-azure-virtual-machines",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Network/unrestricted-ssh-access.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/bc_azr_networking_3#terraform"
    },
    "Recommendation": {
      "Text": "Where SSH is not explicitly required and narrowly configured for resources attached to the Network Security Group, Internet-level access to your Azure resources should be restricted or eliminated. For internal access to relevant resources, configure an encrypted network tunnel such as: ExpressRoute Site-to-site VPN Point-to-site VPN",
      "Url": "https://docs.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-network-security#ns-1-establish-network-segmentation-boundaries"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: network_ssh_internet_access_restricted.py]---
Location: prowler-master/prowler/providers/azure/services/network/network_ssh_internet_access_restricted/network_ssh_internet_access_restricted.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.network.network_client import network_client


class network_ssh_internet_access_restricted(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, security_groups in network_client.security_groups.items():
            for security_group in security_groups:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=security_group
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Security Group {security_group.name} from subscription {subscription} has SSH internet access restricted."
                rule_fail_condition = any(
                    (
                        rule.destination_port_range == "22"
                        or (
                            (
                                rule.destination_port_range
                                and "-" in rule.destination_port_range
                            )
                            and int(rule.destination_port_range.split("-")[0]) <= 22
                            and int(rule.destination_port_range.split("-")[1]) >= 22
                        )
                    )
                    and rule.protocol in ["TCP", "Tcp", "*"]
                    and rule.source_address_prefix in ["Internet", "*", "0.0.0.0/0"]
                    and rule.access == "Allow"
                    and rule.direction == "Inbound"
                    for rule in security_group.security_rules
                )
                if rule_fail_condition:
                    report.status = "FAIL"
                    report.status_extended = f"Security Group {security_group.name} from subscription {subscription} has SSH internet access allowed."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_udp_internet_access_restricted.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/network/network_udp_internet_access_restricted/network_udp_internet_access_restricted.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "network_udp_internet_access_restricted",
  "CheckTitle": "Ensure that UDP access from the Internet is evaluated and restricted",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Network",
  "Description": "Network security groups should be periodically evaluated for port misconfigurations. Where certain ports and protocols may be exposed to the Internet, they should be evaluated for necessity and restricted wherever they are not explicitly required.",
  "Risk": "The potential security problem with broadly exposing UDP services over the Internet is that attackers can use DDoS amplification techniques to reflect spoofed UDP traffic from Azure Virtual Machines. The most common types of these attacks use exposed DNS, NTP, SSDP, SNMP, CLDAP and other UDP-based services as amplification sources for disrupting services of other machines on the Azure Virtual Network or even attack networked devices outside of Azure.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/security/fundamentals/network-best-practices#secure-your-critical-azure-service-resources-to-only-your-virtual-networks",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Network/unrestricted-udp-access.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/ensure-that-udp-services-are-restricted-from-the-internet#terraform"
    },
    "Recommendation": {
      "Text": "Where UDP is not explicitly required and narrowly configured for resources attached tothe Network Security Group, Internet-level access to your Azure resources should be restricted or eliminated. For internal access to relevant resources, configure an encrypted network tunnel such as: ExpressRouteSite-to-site VPN Point-to-site VPN",
      "Url": "https://docs.microsoft.com/en-us/azure/security/fundamentals/ddos-best-practices"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: network_udp_internet_access_restricted.py]---
Location: prowler-master/prowler/providers/azure/services/network/network_udp_internet_access_restricted/network_udp_internet_access_restricted.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.network.network_client import network_client


class network_udp_internet_access_restricted(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, security_groups in network_client.security_groups.items():
            for security_group in security_groups:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=security_group
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Security Group {security_group.name} from subscription {subscription} has UDP internet access restricted."
                rule_fail_condition = any(
                    (
                        rule.protocol in ["UDP", "Udp"]
                        and (
                            rule.source_address_prefix
                            and rule.source_address_prefix
                            in ["Internet", "*", "0.0.0.0/0"]
                        )
                        and rule.access == "Allow"
                        and rule.direction == "Inbound"
                    )
                    for rule in security_group.security_rules
                )
                if rule_fail_condition:
                    report.status = "FAIL"
                    report.status_extended = f"Security Group {security_group.name} from subscription {subscription} has UDP internet access allowed."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_watcher_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/network/network_watcher_enabled/network_watcher_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "network_watcher_enabled",
  "CheckTitle": "Ensure that Network Watcher is 'Enabled' for all locations in the Azure subscription",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Network",
  "Description": "Enable Network Watcher for Azure subscriptions.",
  "Risk": "Network diagnostic and visualization tools available with Network Watcher help users understand, diagnose, and gain insights to the network in Azure.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-monitoring-overview",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Network/enable-network-watcher.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Opting out of Network Watcher automatic enablement is a permanent change. Once you opt-out you cannot opt-in without contacting support.",
      "Url": "https://learn.microsoft.com/en-us/security/benchmark/azure/security-controls-v2-logging-threat-detection#lt-3-enable-logging-for-azure-network-activities"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "There are additional costs per transaction to run and store network data. For high-volume networks these charges will add up quickly."
}
```

--------------------------------------------------------------------------------

---[FILE: network_watcher_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/network/network_watcher_enabled/network_watcher_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.network.network_client import network_client


class network_watcher_enabled(Check):
    def execute(self) -> list[Check_Report_Azure]:
        findings = []
        for subscription, network_watchers in network_client.network_watchers.items():
            report = Check_Report_Azure(metadata=self.metadata(), resource={})
            report.subscription = subscription
            report.resource_name = "Network Watcher"
            report.location = "global"
            report.resource_id = f"/subscriptions/{network_client.subscriptions[subscription]}/resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/NetworkWatcher_*"

            missing_locations = set(network_client.locations[subscription]) - set(
                network_watcher.location for network_watcher in network_watchers
            )

            if missing_locations:
                report.status = "FAIL"
                report.status_extended = f"Network Watcher is not enabled for the following locations in subscription '{subscription}': {', '.join(missing_locations)}."
            else:
                report.status = "PASS"
                report.status_extended = f"Network Watcher is enabled for all locations in subscription '{subscription}'."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: policy_client.py]---
Location: prowler-master/prowler/providers/azure/services/policy/policy_client.py

```python
from prowler.providers.azure.services.policy.policy_service import Policy
from prowler.providers.common.provider import Provider

policy_client = Policy(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: policy_service.py]---
Location: prowler-master/prowler/providers/azure/services/policy/policy_service.py

```python
from dataclasses import dataclass

from azure.mgmt.resource.policy import PolicyClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class Policy(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(PolicyClient, provider)
        self.policy_assigments = self._get_policy_assigments()

    def _get_policy_assigments(self):
        logger.info("Policy - Getting policy assigments...")
        policy_assigments = {}

        for subscription_name, client in self.clients.items():
            try:
                policy_assigments_list = client.policy_assignments.list()
                policy_assigments.update({subscription_name: {}})

                for policy_assigment in policy_assigments_list:
                    policy_assigments[subscription_name].update(
                        {
                            policy_assigment.name: PolicyAssigment(
                                id=policy_assigment.id,
                                name=policy_assigment.name,
                                enforcement_mode=policy_assigment.enforcement_mode,
                            )
                        }
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

        return policy_assigments


@dataclass
class PolicyAssigment:
    id: str
    name: str
    enforcement_mode: str
```

--------------------------------------------------------------------------------

---[FILE: policy_ensure_asc_enforcement_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/policy/policy_ensure_asc_enforcement_enabled/policy_ensure_asc_enforcement_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "policy_ensure_asc_enforcement_enabled",
  "CheckTitle": "Ensure Any of the ASC Default Policy Settings are Not Set to 'Disabled'",
  "CheckType": [],
  "ServiceName": "policy",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Authorization/policyAssignments",
  "Description": "None of the settings offered by ASC Default policy should be set to effect Disabled.",
  "Risk": "A security policy defines the desired configuration of your workloads and helps ensure compliance with company or regulatory security requirements. ASC Default policy is associated with every subscription by default. ASC default policy assignment is a set of security recommendations based on best practices. Enabling recommendations in ASC default policy ensures that Azure security center provides the ability to monitor all of the supported recommendations and optionally allow automated action for a few of the supported recommendations.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/security-policy-concept",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Policy 3. Select ASC Default for each subscription 4. Click on 'view Assignment' 5. Click on 'Edit assignment' 6. Ensure Policy Enforcement is Enabled 7. Click 'Review + Save'",
      "Url": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/implement-security-recommendations"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: policy_ensure_asc_enforcement_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/policy/policy_ensure_asc_enforcement_enabled/policy_ensure_asc_enforcement_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.policy.policy_client import policy_client


class policy_ensure_asc_enforcement_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, policies in policy_client.policy_assigments.items():
            if "SecurityCenterBuiltIn" in policies:
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=policies["SecurityCenterBuiltIn"],
                )
                report.subscription = subscription_name
                report.status = "PASS"
                report.status_extended = f"Policy assigment '{policies['SecurityCenterBuiltIn'].id}' is configured with enforcement mode '{policies['SecurityCenterBuiltIn'].enforcement_mode}'."
                if policies["SecurityCenterBuiltIn"].enforcement_mode != "Default":
                    report.status = "FAIL"
                    report.status_extended = f"Policy assigment '{policies['SecurityCenterBuiltIn'].id}' is not configured with enforcement mode Default."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: postgresql_client.py]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_client.py

```python
from prowler.providers.azure.services.postgresql.postgresql_service import PostgreSQL
from prowler.providers.common.provider import Provider

postgresql_client = PostgreSQL(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
