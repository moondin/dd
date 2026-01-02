---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 343
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 343 of 867)

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

---[FILE: mysql_service.py]---
Location: prowler-master/prowler/providers/azure/services/mysql/mysql_service.py

```python
from dataclasses import dataclass

from azure.mgmt.rdbms.mysql_flexibleservers import MySQLManagementClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class MySQL(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(MySQLManagementClient, provider)

        self.flexible_servers = self._get_flexible_servers()

    def _get_flexible_servers(self):
        logger.info("MySQL - Getting servers...")
        servers = {}
        for subscription_name, client in self.clients.items():
            try:
                servers_list = client.servers.list()
                servers.update({subscription_name: {}})
                for server in servers_list:
                    servers[subscription_name].update(
                        {
                            server.id: FlexibleServer(
                                resource_id=server.id,
                                name=server.name,
                                location=server.location,
                                version=server.version,
                                configurations=self._get_configurations(
                                    client, server.id.split("/")[4], server.name
                                ),
                            )
                        }
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return servers

    def _get_configurations(self, client, resource_group, server_name):
        logger.info(f"MySQL - Getting configurations from server {server_name} ...")
        configurations = {}
        try:
            configurations_list = client.configurations.list_by_server(
                resource_group, server_name
            )
            for configuration in configurations_list:
                configurations.update(
                    {
                        configuration.name: Configuration(
                            resource_id=configuration.id,
                            description=configuration.description,
                            value=configuration.value,
                        )
                    }
                )
        except Exception as error:
            logger.error(
                f"Server name: {server_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return configurations


@dataclass
class Configuration:
    resource_id: str
    description: str
    value: str


@dataclass
class FlexibleServer:
    resource_id: str
    name: str
    location: str
    version: str
    configurations: dict[Configuration]
```

--------------------------------------------------------------------------------

---[FILE: mysql_flexible_server_audit_log_connection_activated.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/mysql/mysql_flexible_server_audit_log_connection_activated/mysql_flexible_server_audit_log_connection_activated.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "mysql_flexible_server_audit_log_connection_activated",
  "CheckTitle": "Ensure server parameter 'audit_log_events' has 'CONNECTION' set for MySQL Database Server",
  "CheckType": [],
  "ServiceName": "mysql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.DBforMySQL/flexibleServers",
  "Description": "Set audit_log_enabled to include CONNECTION on MySQL Servers.",
  "Risk": "Enabling CONNECTION helps MySQL Database to log items such as successful and failed connection attempts to the server. Log data can be used to identify, troubleshoot, and repair configuration errors and suboptimal performance.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/mysql/single-server/how-to-configure-audit-logs-portal",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.tenable.com/audits/items/CIS_Microsoft_Azure_Foundations_v2.0.0_L2.audit:06ec721d4c0ea9169db2b0c6876c5f38",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu. 2. Select Azure Database for MySQL servers. 3. Select a database. 4. Under Settings, select Server parameters. 5. Update audit_log_enabled parameter to ON. 6. Update audit_log_events parameter to have at least CONNECTION checked. 7. Click Save. 8. Under Monitoring, select Diagnostic settings. 9. Select + Add diagnostic setting. 10. Provide a diagnostic setting name. 11. Under Categories, select MySQL Audit Logs. 12. Specify destination details. 13. Click Save.",
      "Url": "https://docs.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-logging-threat-detection#lt-3-enable-logging-for-security-investigation"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "There are further costs incurred for storage of logs. For high traffic databases these logs will be significant. Determine your organization's needs before enabling."
}
```

--------------------------------------------------------------------------------

---[FILE: mysql_flexible_server_audit_log_connection_activated.py]---
Location: prowler-master/prowler/providers/azure/services/mysql/mysql_flexible_server_audit_log_connection_activated/mysql_flexible_server_audit_log_connection_activated.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.mysql.mysql_client import mysql_client


class mysql_flexible_server_audit_log_connection_activated(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            servers,
        ) in mysql_client.flexible_servers.items():
            for server in servers.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = f"Audit log is disabled for server {server.name} in subscription {subscription_name}."

                if "audit_log_events" in server.configurations:
                    report.resource_id = server.configurations[
                        "audit_log_events"
                    ].resource_id

                    if "CONNECTION" in server.configurations[
                        "audit_log_events"
                    ].value.split(","):
                        report.status = "PASS"
                        report.status_extended = f"Audit log is enabled for server {server.name} in subscription {subscription_name}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: mysql_flexible_server_audit_log_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/mysql/mysql_flexible_server_audit_log_enabled/mysql_flexible_server_audit_log_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "mysql_flexible_server_audit_log_enabled",
  "CheckTitle": "Ensure server parameter 'audit_log_enabled' is set to 'ON' for MySQL Database Server",
  "CheckType": [],
  "ServiceName": "mysql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.DBforMySQL/flexibleServers",
  "Description": "Enable audit_log_enabled on MySQL Servers.",
  "Risk": "Enabling audit_log_enabled helps MySQL Database to log items such as connection attempts to the server, DDL/DML access, and more. Log data can be used to identify, troubleshoot, and repair configuration errors and suboptimal performance.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/mysql/single-server/how-to-configure-audit-logs-portal",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.tenable.com/audits/items/CIS_Microsoft_Azure_Foundations_v1.5.0_L2.audit:c073639a1ce546b535ba73afbf6542aa",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Login to Azure Portal using https://portal.azure.com. 2. Select Azure Database for MySQL Servers. 3. Select a database. 4. Under Settings, select Server parameters. 5. Update audit_log_enabled parameter to ON 6. Under Monitoring, select Diagnostic settings. 7. Select + Add diagnostic setting. 8. Provide a diagnostic setting name. 9. Under Categories, select MySQL Audit Logs. 10. Specify destination details. 11. Click Save.",
      "Url": "https://docs.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-logging-threat-detection#lt-3-enable-logging-for-security-investigation"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: mysql_flexible_server_audit_log_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/mysql/mysql_flexible_server_audit_log_enabled/mysql_flexible_server_audit_log_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.mysql.mysql_client import mysql_client


class mysql_flexible_server_audit_log_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            servers,
        ) in mysql_client.flexible_servers.items():
            for server in servers.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.status = "FAIL"
                report.subscription = subscription_name
                report.status_extended = f"Audit log is disabled for server {server.name} in subscription {subscription_name}."

                if "audit_log_enabled" in server.configurations:
                    report.resource_id = server.configurations[
                        "audit_log_enabled"
                    ].resource_id

                    if server.configurations["audit_log_enabled"].value == "ON":
                        report.status = "PASS"
                        report.status_extended = f"Audit log is enabled for server {server.name} in subscription {subscription_name}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: mysql_flexible_server_minimum_tls_version_12.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/mysql/mysql_flexible_server_minimum_tls_version_12/mysql_flexible_server_minimum_tls_version_12.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "mysql_flexible_server_minimum_tls_version_12",
  "CheckTitle": "Ensure 'TLS Version' is set to 'TLSV1.2' for MySQL flexible Database Server",
  "CheckType": [],
  "ServiceName": "mysql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.DBforMySQL/flexibleServers",
  "Description": "Ensure TLS version on MySQL flexible servers is set to the default value.",
  "Risk": "TLS connectivity helps to provide a new layer of security by connecting database server to client applications using Transport Layer Security (TLS). Enforcing TLS connections between database server and client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and application.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/mysql/concepts-ssl-connection-security",
  "Remediation": {
    "Code": {
      "CLI": "az mysql flexible-server parameter set --name tls_version --resource-group <resourceGroupName> --server-name <serverName> --value TLSV1.2",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/MySQL/mysql-flexible-server-tls-version.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-mysql-is-using-the-latest-version-of-tls-encryption#terraform"
    },
    "Recommendation": {
      "Text": "1. Login to Azure Portal using https://portal.azure.com 2. Go to Azure Database for MySQL flexible servers 3. For each database, click on Server parameters under Settings 4. In the search box, type in tls_version 5. Click on the VALUE dropdown, and ensure only TLSV1.2 is selected for tls_version",
      "Url": "https://docs.microsoft.com/en-us/azure/mysql/howto-configure-ssl"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: mysql_flexible_server_minimum_tls_version_12.py]---
Location: prowler-master/prowler/providers/azure/services/mysql/mysql_flexible_server_minimum_tls_version_12/mysql_flexible_server_minimum_tls_version_12.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.mysql.mysql_client import mysql_client


class mysql_flexible_server_minimum_tls_version_12(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            servers,
        ) in mysql_client.flexible_servers.items():
            for server in servers.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = f"TLS version is not configured in server {server.name} in subscription {subscription_name}."

                if "tls_version" in server.configurations:
                    report.resource_id = server.configurations[
                        "tls_version"
                    ].resource_id
                    report.status = "PASS"
                    report.status_extended = f"TLS version is {server.configurations['tls_version'].value} in server {server.name} in subscription {subscription_name}. This version of TLS is considered secure."

                    tls_aviable = server.configurations["tls_version"].value.split(",")

                    if "TLSv1.0" in tls_aviable or "TLSv1.1" in tls_aviable:
                        report.status = "FAIL"
                        report.status_extended = f"TLS version is {server.configurations['tls_version'].value} in server {server.name} in subscription {subscription_name}. There is at leat one version of TLS that is considered insecure."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: mysql_flexible_server_ssl_connection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/mysql/mysql_flexible_server_ssl_connection_enabled/mysql_flexible_server_ssl_connection_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "mysql_flexible_server_ssl_connection_enabled",
  "CheckTitle": "Ensure 'Enforce SSL connection' is set to 'Enabled' for Standard MySQL Database Server",
  "CheckType": [],
  "ServiceName": "mysql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.DBforMySQL/flexibleServers",
  "Description": "Enable SSL connection on MYSQL Servers.",
  "Risk": "SSL connectivity helps to provide a new layer of security by connecting database server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between database server and client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and application.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-ssl-connection-security",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.tenable.com/policies/[type]/AC_AZURE_0131",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Login to Azure Portal using https://portal.azure.com 2. Go to Azure Database for MySQL servers 3. For each database, click on Connection security 4. In SSL settings, click on ENABLED to Enforce SSL connections",
      "Url": "https://docs.microsoft.com/en-us/azure/mysql/single-server/how-to-configure-ssl"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: mysql_flexible_server_ssl_connection_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/mysql/mysql_flexible_server_ssl_connection_enabled/mysql_flexible_server_ssl_connection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.mysql.mysql_client import mysql_client


class mysql_flexible_server_ssl_connection_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            servers,
        ) in mysql_client.flexible_servers.items():
            for server in servers.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = f"SSL connection is disabled for server {server.name} in subscription {subscription_name}."

                if "require_secure_transport" in server.configurations:
                    report.resource_id = server.configurations[
                        "require_secure_transport"
                    ].resource_id
                    if server.configurations["require_secure_transport"].value == "ON":
                        report.status = "PASS"
                        report.status_extended = f"SSL connection is enabled for server {server.name} in subscription {subscription_name}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_client.py]---
Location: prowler-master/prowler/providers/azure/services/network/network_client.py

```python
from prowler.providers.azure.services.network.network_service import Network
from prowler.providers.common.provider import Provider

network_client = Network(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: network_service.py]---
Location: prowler-master/prowler/providers/azure/services/network/network_service.py

```python
import re
from dataclasses import dataclass
from typing import List, Optional

from azure.core.exceptions import ResourceNotFoundError
from azure.mgmt.network import NetworkManagementClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class Network(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(NetworkManagementClient, provider)
        self.security_groups = self._get_security_groups()
        self.bastion_hosts = self._get_bastion_hosts()
        self.network_watchers = self._get_network_watchers()
        self.public_ip_addresses = self._get_public_ip_addresses()

    def _get_security_groups(self):
        logger.info("Network - Getting Network Security Groups...")
        security_groups = {}
        for subscription, client in self.clients.items():
            try:
                security_groups.update({subscription: []})
                security_groups_list = client.network_security_groups.list_all()
                for security_group in security_groups_list:
                    security_groups[subscription].append(
                        SecurityGroup(
                            id=security_group.id,
                            name=security_group.name,
                            location=security_group.location,
                            security_rules=[
                                SecurityRule(
                                    id=rule.id,
                                    name=rule.name,
                                    destination_port_range=getattr(
                                        rule, "destination_port_range", ""
                                    ),
                                    protocol=getattr(rule, "protocol", ""),
                                    source_address_prefix=getattr(
                                        rule, "source_address_prefix", ""
                                    ),
                                    access=getattr(rule, "access", "Allow"),
                                    direction=getattr(rule, "direction", "Inbound"),
                                )
                                for rule in getattr(
                                    security_group, "security_rules", []
                                )
                            ],
                        )
                    )

            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return security_groups

    def _get_network_watchers(self):
        logger.info("Network - Getting Network Watchers...")
        network_watchers = {}
        for subscription, client in self.clients.items():
            try:
                network_watchers.update({subscription: []})
                network_watchers_list = client.network_watchers.list_all()
                for network_watcher in network_watchers_list:
                    flow_logs = self._get_flow_logs(
                        subscription, network_watcher.name, network_watcher.id
                    )
                    network_watchers[subscription].append(
                        NetworkWatcher(
                            id=network_watcher.id,
                            name=network_watcher.name,
                            location=network_watcher.location,
                            flow_logs=[
                                FlowLog(
                                    id=flow_log.id,
                                    name=flow_log.name,
                                    enabled=flow_log.enabled,
                                    retention_policy=RetentionPolicy(
                                        enabled=(
                                            flow_log.retention_policy.enabled
                                            if flow_log.retention_policy
                                            else False
                                        ),
                                        days=(
                                            flow_log.retention_policy.days
                                            if flow_log.retention_policy
                                            else 0
                                        ),
                                    ),
                                )
                                for flow_log in flow_logs
                            ],
                        )
                    )

            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return network_watchers

    def _get_flow_logs(self, subscription, network_watcher_name, network_watcher_id):
        logger.info("Network - Getting Flow Logs...")
        client = self.clients[subscription]
        match = re.search(r"/resourceGroups/(?P<rg>[^/]+)/", network_watcher_id)
        if not match:
            logger.error(
                f"Could not extract resource group from ID: {network_watcher_id}"
            )
            return []
        resource_group = match.group("rg")
        try:
            flow_logs = client.flow_logs.list(resource_group, network_watcher_name)
            return flow_logs
        except ResourceNotFoundError as error:
            logger.warning(
                f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return []
        except Exception as error:
            logger.error(
                f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return []

    def _get_bastion_hosts(self):
        logger.info("Network - Getting Bastion Hosts...")
        bastion_hosts = {}
        for subscription, client in self.clients.items():
            try:
                bastion_hosts.update({subscription: []})
                bastion_hosts_list = client.bastion_hosts.list()
                for bastion_host in bastion_hosts_list:
                    bastion_hosts[subscription].append(
                        BastionHost(
                            id=bastion_host.id,
                            name=bastion_host.name,
                            location=bastion_host.location,
                        )
                    )

            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return bastion_hosts

    def _get_public_ip_addresses(self):
        logger.info("Network - Getting Public IP Addresses...")
        public_ip_addresses = {}
        for subscription, client in self.clients.items():
            try:
                public_ip_addresses.update({subscription: []})
                public_ip_addresses_list = client.public_ip_addresses.list_all()
                for public_ip_address in public_ip_addresses_list:
                    public_ip_addresses[subscription].append(
                        PublicIp(
                            id=public_ip_address.id,
                            name=public_ip_address.name,
                            location=public_ip_address.location,
                            ip_address=public_ip_address.ip_address,
                        )
                    )

            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return public_ip_addresses


@dataclass
class BastionHost:
    id: str
    name: str
    location: str


@dataclass
class RetentionPolicy:
    enabled: bool = False
    days: int = 0


@dataclass
class FlowLog:
    id: str
    name: str
    enabled: bool
    retention_policy: RetentionPolicy


@dataclass
class NetworkWatcher:
    id: str
    name: str
    location: str
    flow_logs: List[FlowLog]


@dataclass
class SecurityRule:
    id: str
    name: str
    destination_port_range: Optional[str]
    protocol: Optional[str]
    source_address_prefix: Optional[str]
    access: Optional[str]
    direction: Optional[str]


@dataclass
class SecurityGroup:
    id: str
    name: str
    location: str
    security_rules: List[SecurityRule]


@dataclass
class PublicIp:
    id: str
    name: str
    location: str
    ip_address: str
```

--------------------------------------------------------------------------------

---[FILE: network_bastion_host_exists.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/network/network_bastion_host_exists/network_bastion_host_exists.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "network_bastion_host_exists",
  "CheckTitle": "Ensure an Azure Bastion Host Exists",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Network",
  "Description": "The Azure Bastion service allows secure remote access to Azure Virtual Machines over the Internet without exposing remote access protocol ports and services directly to the Internet. The Azure Bastion service provides this access using TLS over 443/TCP, and subscribes to hardened configurations within an organization's Azure Active Directory service.",
  "Risk": "The Azure Bastion service allows organizations a more secure means of accessing Azure Virtual Machines over the Internet without assigning public IP addresses to those Virtual Machines. The Azure Bastion service provides Remote Desktop Protocol (RDP) and Secure Shell (SSH) access to Virtual Machines using TLS within a web browser, thus preventing organizations from opening up 3389/TCP and 22/TCP to the Internet on Azure Virtual Machines. Additional benefits of the Bastion service includes Multi-Factor Authentication, Conditional Access Policies, and any other hardening measures configured within Azure Active Directory using a central point of access.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/bastion/bastion-overview#sku",
  "Remediation": {
    "Code": {
      "CLI": "az network bastion create --location <location> --name <name of bastion host> --public-ip-address <public IP address name or ID> --resource-group <resource group name or ID> --vnet-name <virtual network containing subnet called 'AzureBastionSubnet'> --scale-units <integer> --sku Standard [--disable-copy- paste true|false] [--enable-ip-connect true|false] [--enable-tunneling true|false]",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Network/bastion-host-exists.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "From Azure Portal* 1. Click on Bastions 2. Select the Subscription 3. Select the Resource group 4. Type a Name for the new Bastion host 5. Select a Region 6. Choose Standard next to Tier 7. Use the slider to set the Instance count 8. Select the Virtual network or Create new 9. Select the Subnet named AzureBastionSubnet. Create a Subnet named AzureBastionSubnet using a /26 CIDR range if it doesn't already exist. 10. Selct the appropriate Public IP address option. 11. If Create new is selected for the Public IP address option, provide a Public IP address name. 12. If Use existing is selected for Public IP address option, select an IP address from Choose public IP address 13. Click Next: Tags > 14. Configure the appropriate Tags 15. Click Next: Advanced > 16. Select the appropriate Advanced options 17. Click Next: Review + create > 18. Click Create From Azure CLI az network bastion create --location <location> --name <name of bastion host> --public-ip-address <public IP address name or ID> --resource-group <resource group name or ID> --vnet-name <virtual network containing subnet called 'AzureBastionSubnet'> --scale-units <integer> --sku Standard [--disable-copy- paste true|false] [--enable-ip-connect true|false] [--enable-tunneling true|false] From PowerShell Create the appropriate Virtual network settings and Public IP Address settings. $subnetName = 'AzureBastionSubnet' $subnet = New-AzVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix <IP address range in CIDR notation making sure to use a /26> $virtualNet = New-AzVirtualNetwork -Name <virtual network name> - ResourceGroupName <resource group name> -Location <location> -AddressPrefix <IP address range in CIDR notation> -Subnet $subnet $publicip = New-AzPublicIpAddress -ResourceGroupName <resource group name> - Name <public IP address name> -Location <location> -AllocationMethod Dynamic -Sku Standard",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/az.network/get-azbastion?view=azps-9.2.0"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "The Azure Bastion service incurs additional costs and requires a specific virtual network configuration. The Standard tier offers additional configuration options compared to the Basic tier and may incur additional costs for those added features."
}
```

--------------------------------------------------------------------------------

---[FILE: network_bastion_host_exists.py]---
Location: prowler-master/prowler/providers/azure/services/network/network_bastion_host_exists/network_bastion_host_exists.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.network.network_client import network_client


class network_bastion_host_exists(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, bastion_hosts in network_client.bastion_hosts.items():
            if not bastion_hosts:
                status = "FAIL"
                status_extended = (
                    f"Bastion Host from subscription {subscription} does not exist"
                )
            else:
                bastion_names = ", ".join(
                    [bastion_host.name for bastion_host in bastion_hosts]
                )
                status = "PASS"
                status_extended = f"Bastion Host from subscription {subscription} available are: {bastion_names}"

            report = Check_Report_Azure(metadata=self.metadata(), resource={})
            report.subscription = subscription
            report.resource_name = "Bastion Host"
            report.resource_id = "Bastion Host"
            report.status = status
            report.status_extended = status_extended
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_flow_log_captured_sent.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/network/network_flow_log_captured_sent/network_flow_log_captured_sent.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "network_flow_log_captured_sent",
  "CheckTitle": "Ensure that network flow logs are captured and fed into a central log analytics workspace.",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Network",
  "Description": "Ensure that network flow logs are captured and fed into a central log analytics workspace.",
  "Risk": "Network Flow Logs provide valuable insight into the flow of traffic around your network and feed into both Azure Monitor and Azure Sentinel (if in use), permitting the generation of visual flow diagrams to aid with analyzing for lateral movement, etc.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/security/benchmark/azure/mcsb-logging-threat-detection#lt-4-enable-network-logging-for-security-investigation",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to Network Watcher. 2. Select NSG flow logs. 3. Select + Create. 4. Select the desired Subscription. 5. Select + Select NSG. 6. Select a network security group. 7. Click Confirm selection. 8. Select or create a new Storage Account. 9. Input the retention in days to retain the log. 10. Click Next. 11. Under Configuration, select Version 2. 12. If rich analytics are required, select Enable Traffic Analytics, a processing interval, and a Log Analytics Workspace. 13. Select Next. 14. Optionally add Tags. 15. Select Review + create. 16. Select Create. Warning The remediation policy creates remediation deployment and names them by concatenating the subscription name and the resource group name. The MAXIMUM permitted length of a deployment name is 64 characters. Exceeding this will cause the remediation task to fail.",
      "Url": "https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-nsg-flow-logging-portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "The impact of configuring NSG Flow logs is primarily one of cost and configuration. If deployed, it will create storage accounts that hold minimal amounts of data on a 5-day lifecycle before feeding to Log Analytics Workspace. This will increase the amount of data stored and used by Azure Monitor."
}
```

--------------------------------------------------------------------------------

---[FILE: network_flow_log_captured_sent.py]---
Location: prowler-master/prowler/providers/azure/services/network/network_flow_log_captured_sent/network_flow_log_captured_sent.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.network.network_client import network_client


class network_flow_log_captured_sent(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, network_watchers in network_client.network_watchers.items():
            for network_watcher in network_watchers:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=network_watcher
                )
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Network Watcher {network_watcher.name} from subscription {subscription} has no flow logs"
                if network_watcher.flow_logs:
                    report.status = "FAIL"
                    report.status_extended = f"Network Watcher {network_watcher.name} from subscription {subscription} has flow logs disabled"
                    for flow_log in network_watcher.flow_logs:
                        if flow_log.enabled:
                            report.status = "PASS"
                            report.status_extended = f"Network Watcher {network_watcher.name} from subscription {subscription} has flow logs that are captured and sent to Log Analytics workspace"
                            break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
