---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 345
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 345 of 867)

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

---[FILE: postgresql_service.py]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_service.py

```python
from dataclasses import dataclass

from azure.mgmt.postgresqlflexibleservers import PostgreSQLManagementClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class PostgreSQL(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(PostgreSQLManagementClient, provider)
        self.flexible_servers = self._get_flexible_servers()

    def _get_flexible_servers(self):
        logger.info("PostgreSQL - Getting PostgreSQL servers...")
        flexible_servers = {}
        for subscription, client in self.clients.items():
            try:
                flexible_servers.update({subscription: []})
                flexible_servers_list = client.servers.list()
                for postgresql_server in flexible_servers_list:
                    resource_group = self._get_resource_group(postgresql_server.id)
                    # Fetch full server object once to extract multiple properties
                    server_details = client.servers.get(
                        resource_group, postgresql_server.name
                    )
                    require_secure_transport = self._get_require_secure_transport(
                        subscription, resource_group, postgresql_server.name
                    )
                    active_directory_auth = self._extract_active_directory_auth(
                        server_details
                    )
                    entra_id_admins = self._get_entra_id_admins(
                        subscription, resource_group, postgresql_server.name
                    )
                    log_checkpoints = self._get_log_checkpoints(
                        subscription, resource_group, postgresql_server.name
                    )
                    log_disconnections = self._get_log_disconnections(
                        subscription, resource_group, postgresql_server.name
                    )
                    log_connections = self._get_log_connections(
                        subscription, resource_group, postgresql_server.name
                    )
                    connection_throttling = self._get_connection_throttling(
                        subscription, resource_group, postgresql_server.name
                    )
                    log_retention_days = self._get_log_retention_days(
                        subscription, resource_group, postgresql_server.name
                    )
                    firewall = self._get_firewall(
                        subscription, resource_group, postgresql_server.name
                    )
                    location = server_details.location
                    flexible_servers[subscription].append(
                        Server(
                            id=postgresql_server.id,
                            name=postgresql_server.name,
                            resource_group=resource_group,
                            location=location,
                            require_secure_transport=require_secure_transport,
                            active_directory_auth=active_directory_auth,
                            entra_id_admins=entra_id_admins,
                            log_checkpoints=log_checkpoints,
                            log_connections=log_connections,
                            log_disconnections=log_disconnections,
                            connection_throttling=connection_throttling,
                            log_retention_days=log_retention_days,
                            firewall=firewall,
                        )
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return flexible_servers

    def _get_resource_group(self, id):
        resource_group = id.split("/")[4]
        return resource_group

    def _get_require_secure_transport(
        self, subscription, resouce_group_name, server_name
    ):
        client = self.clients[subscription]
        require_secure_transport = client.configurations.get(
            resouce_group_name, server_name, "require_secure_transport"
        )
        return require_secure_transport.value.upper()

    def _get_log_checkpoints(self, subscription, resouce_group_name, server_name):
        client = self.clients[subscription]
        log_checkpoints = client.configurations.get(
            resouce_group_name, server_name, "log_checkpoints"
        )
        return log_checkpoints.value.upper()

    def _get_log_connections(self, subscription, resouce_group_name, server_name):
        client = self.clients[subscription]
        log_connections = client.configurations.get(
            resouce_group_name, server_name, "log_connections"
        )
        return log_connections.value.upper()

    def _get_log_disconnections(self, subscription, resouce_group_name, server_name):
        client = self.clients[subscription]
        log_disconnections = client.configurations.get(
            resouce_group_name, server_name, "log_disconnections"
        )
        return log_disconnections.value.upper()

    def _extract_active_directory_auth(self, server):
        """Extract active directory auth from a server object (no API call)."""
        try:
            auth_config = getattr(server, "auth_config", None)
            active_directory_auth = (
                getattr(auth_config, "active_directory_auth", None)
                if auth_config is not None
                else None
            )
            # Normalize enum/string to upper string
            if hasattr(active_directory_auth, "value"):
                return str(active_directory_auth.value).upper()
            return (
                str(active_directory_auth).upper()
                if active_directory_auth is not None
                else None
            )
        except Exception as e:
            logger.error(f"Error extracting active directory auth: {e}")
            return None

    def _get_entra_id_admins(self, subscription, resource_group_name, server_name):
        client = self.clients[subscription]
        try:
            admins = client.administrators.list_by_server(
                resource_group_name, server_name
            )
            admin_list = []
            for admin in admins:
                admin_list.append(
                    EntraIdAdmin(
                        object_id=admin.object_id,
                        principal_name=admin.principal_name,
                        principal_type=admin.principal_type,
                        tenant_id=admin.tenant_id,
                    )
                )
            return admin_list
        except Exception as e:
            logger.error(f"Error getting Entra ID admins for {server_name}: {e}")
            return []

    def _get_connection_throttling(self, subscription, resouce_group_name, server_name):
        client = self.clients[subscription]
        connection_throttling = client.configurations.get(
            resouce_group_name, server_name, "connection_throttle.enable"
        )
        return connection_throttling.value.upper()

    def _get_log_retention_days(self, subscription, resouce_group_name, server_name):
        client = self.clients[subscription]
        try:
            log_retention_days = client.configurations.get(
                resouce_group_name, server_name, "log_retention_days"
            )
            log_retention_days = log_retention_days.value
        except Exception:
            log_retention_days = None
        return log_retention_days

    def _get_firewall(self, subscription, resource_group, server_name):
        client = self.clients[subscription]
        firewall = client.firewall_rules.list_by_server(resource_group, server_name)
        firewall_list = []
        for rule in firewall:
            firewall_list.append(
                Firewall(
                    id=rule.id,
                    name=rule.name,
                    start_ip=rule.start_ip_address,
                    end_ip=rule.end_ip_address,
                )
            )
        return firewall_list


@dataclass
class Firewall:
    id: str
    name: str
    start_ip: str
    end_ip: str


@dataclass
class EntraIdAdmin:
    object_id: str
    principal_name: str
    principal_type: str
    tenant_id: str


@dataclass
class Server:
    id: str
    name: str
    resource_group: str
    location: str
    require_secure_transport: str
    active_directory_auth: str
    entra_id_admins: list[EntraIdAdmin]
    log_checkpoints: str
    log_connections: str
    log_disconnections: str
    connection_throttling: str
    log_retention_days: str
    firewall: list[Firewall]
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_allow_access_services_disabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_allow_access_services_disabled/postgresql_flexible_server_allow_access_services_disabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "postgresql_flexible_server_allow_access_services_disabled",
  "CheckTitle": "Ensure 'Allow access to Azure services' for PostgreSQL Database Server is disabled",
  "CheckType": [],
  "ServiceName": "postgresql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "PostgreSQL",
  "Description": "Disable access from Azure services to PostgreSQL Database Server.",
  "Risk": "If access from Azure services is enabled, the server's firewall will accept connections from all Azure resources, including resources not in your subscription. This is usually not a desired configuration. Instead, set up firewall rules to allow access from specific network ranges or VNET rules to allow access from specific virtual networks.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/postgresql/concepts-firewall-rules",
  "Remediation": {
    "Code": {
      "CLI": "az postgres server firewall-rule delete --name AllowAllWindowsAzureIps --resource-group <resourceGroupName> --server-name <serverName>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/PostgreSQL/disable-all-services-access.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-allow-access-to-azure-services-for-postgresql-database-server-is-disabled#terraform"
    },
    "Recommendation": {
      "Text": "From Azure Portal 1. Login to Azure Portal using https://portal.azure.com. 2. Go to Azure Database for PostgreSQL servers. 3. For each database, click on Connection security. 4. Under Firewall rules, set Allow access to Azure services to No. 5. Click Save. From Azure CLI Use the below command to delete the AllowAllWindowsAzureIps rule for PostgreSQL Database. az postgres server firewall-rule delete --name AllowAllWindowsAzureIps -- resource-group <resourceGroupName> --server-name <serverName>",
      "Url": "https://learn.microsoft.com/en-us/azure/postgresql/single-server/quickstart-create-server-database-azure-cli#configure-a-server-based-firewall-rule"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_allow_access_services_disabled.py]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_allow_access_services_disabled/postgresql_flexible_server_allow_access_services_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.postgresql.postgresql_client import (
    postgresql_client,
)


class postgresql_flexible_server_allow_access_services_disabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for (
            subscription,
            flexible_servers,
        ) in postgresql_client.flexible_servers.items():
            for server in flexible_servers:
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has allow public access from any Azure service enabled"
                if not any(
                    rule.start_ip == "0.0.0.0" and rule.end_ip == "0.0.0.0"
                    for rule in server.firewall
                ):
                    report.status = "PASS"
                    report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has allow public access from any Azure service disabled"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_connection_throttling_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_connection_throttling_on/postgresql_flexible_server_connection_throttling_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "postgresql_flexible_server_connection_throttling_on",
  "CheckTitle": "Ensure server parameter 'connection_throttling' is set to 'ON' for PostgreSQL Database Server",
  "CheckType": [],
  "ServiceName": "postgresql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "PostgreSQL",
  "Description": "Enable connection_throttling on PostgreSQL Servers.",
  "Risk": "Enabling connection_throttling helps the PostgreSQL Database to Set the verbosity of logged messages. This in turn generates query and error logs with respect to concurrent connections that could lead to a successful Denial of Service (DoS) attack by exhausting connection resources. A system can also fail or be degraded by an overload of legitimate users. Query and error logs can be used to identify, troubleshoot, and repair configuration errors and sub-optimal performance.",
  "RelatedUrl": " https://docs.microsoft.com/en-us/rest/api/postgresql/configurations/listbyserver",
  "Remediation": {
    "Code": {
      "CLI": "az postgres server configuration set --resource-group <resourceGroupName> --server-name <serverName> --name connection_throttling --value on",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/PostgreSQL/connection-throttling.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/bc_azr_networking_13#terraform"
    },
    "Recommendation": {
      "Text": "From Azure Portal 1. Login to Azure Portal using https://portal.azure.com. 2. Go to Azure Database for PostgreSQL servers. 3. For each database, click on Server parameters. 4. Search for connection_throttling. 5. Click ON and save. From Azure CLI Use the below command to update connection_throttling configuration. az postgres server configuration set --resource-group <resourceGroupName> -- server-name <serverName> --name connection_throttling --value on From PowerShell Use the below command to update connection_throttling configuration. Update-AzPostgreSqlConfiguration -ResourceGroupName <ResourceGroupName> - ServerName <ServerName> -Name connection_throttling -Value on",
      "Url": "https://learn.microsoft.com/en-us/azure/postgresql/single-server/how-to-configure-server-parameters-using-portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_connection_throttling_on.py]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_connection_throttling_on/postgresql_flexible_server_connection_throttling_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.postgresql.postgresql_client import (
    postgresql_client,
)


class postgresql_flexible_server_connection_throttling_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for (
            subscription,
            flexible_servers,
        ) in postgresql_client.flexible_servers.items():
            for server in flexible_servers:
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has connection_throttling disabled"
                if server.connection_throttling == "ON":
                    report.status = "PASS"
                    report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has connection_throttling enabled"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_enforce_ssl_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_enforce_ssl_enabled/postgresql_flexible_server_enforce_ssl_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "postgresql_flexible_server_enforce_ssl_enabled",
  "CheckTitle": "Ensure 'Enforce SSL connection' is set to 'ENABLED' for PostgreSQL Database Server",
  "CheckType": [],
  "ServiceName": "postgresql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "PostgreSQL",
  "Description": "Enable SSL connection on PostgreSQL Servers.",
  "Risk": "SSL connectivity helps to provide a new layer of security by connecting database server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between database server and client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and application.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/postgresql/single-server/concepts-ssl-connection-security",
  "Remediation": {
    "Code": {
      "CLI": "az postgres server update --resource-group <resourceGroupName> --name <serverName> --ssl-enforcement Enabled",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/azure/azure-networking-policies/bc_azr_networking_10",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/bc_azr_networking_10#terraform"
    },
    "Recommendation": {
      "Text": "From Azure Portal 1. Login to Azure Portal using https://portal.azure.com 2. Go to Azure Database for PostgreSQL server 3. For each database, click on Connection security 4. In SSL settings, click on ENABLED to enforce SSL connections 5. Click Save From Azure CLI Use the below command to enforce ssl connection for PostgreSQL Database. az postgres server update --resource-group <resourceGroupName> --name <serverName> --ssl-enforcement Enabled From PowerShell Update-AzPostgreSqlServer -ResourceGroupName <ResourceGroupName > -ServerName <ServerName> -SslEnforcement Enabled",
      "Url": "https://learn.microsoft.com/en-us/azure/postgresql/single-server/concepts-ssl-connection-security"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "."
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_enforce_ssl_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_enforce_ssl_enabled/postgresql_flexible_server_enforce_ssl_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.postgresql.postgresql_client import (
    postgresql_client,
)


class postgresql_flexible_server_enforce_ssl_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for (
            subscription,
            flexible_servers,
        ) in postgresql_client.flexible_servers.items():
            for server in flexible_servers:
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has enforce ssl disabled"
                if server.require_secure_transport == "ON":
                    report.status = "PASS"
                    report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has enforce ssl enabled"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_entra_id_authentication_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_entra_id_authentication_enabled/postgresql_flexible_server_entra_id_authentication_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "postgresql_flexible_server_entra_id_authentication_enabled",
  "CheckTitle": "PostgreSQL Flexible Server enforces Microsoft Entra ID authentication with administrators",
  "CheckType": [],
  "ServiceName": "postgresql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "PostgreSQL",
  "Description": "**PostgreSQL Flexible Servers** must set `authConfig.activeDirectoryAuth` to `Enabled` and keep at least one **Microsoft Entra administrator** assigned so database sessions inherit centrally governed identities instead of unmanaged PostgreSQL accounts.",
  "Risk": "Without Entra ID authentication, stolen local passwords bypass **MFA** and conditional access, enabling persistent database logins. Missing administrators leaves the feature unusable, blocking security teams from rotating duties and allowing unauthorized access or **privilege escalation**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/security-entra-concepts",
    "https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/security-entra-configure"
  ],
  "Remediation": {
    "Code": {
      "CLI": "az postgres flexible-server update --resource-group <resourceGroupName> --name <serverName> --active-directory-auth Enabled\naz postgres flexible-server microsoft-entra-admin create --resource-group <resourceGroupName> --server-name <serverName> --object-id <objectId> --display-name <displayName>",
      "NativeIaC": "",
      "Other": "1. In the Azure Portal, open Azure Database for PostgreSQL flexible server and select the target server.\n2. Under Security > Authentication, set Microsoft Entra ID authentication (or combined mode) to Enabled and save the change.\n3. Under Security > Microsoft Entra ID, add at least one administrator (user or group) linked to an Entra object ID and confirm the assignment.",
      "Terraform": "```hcl\ndata \"azurerm_client_config\" \"current\" {}\n\nresource \"azurerm_postgresql_flexible_server\" \"example\" {\n  name                = \"pg-flex\"\n  resource_group_name = azurerm_resource_group.example.name\n  location            = azurerm_resource_group.example.location\n  sku_name            = \"GP_Standard_D4s_v3\"\n  administrator_login = \"pgadmin\"\n  administrator_password = \"<complexPassword>\"\n  storage_mb          = 131072\n  version             = \"16\"\n\n  authentication {\n    active_directory_auth_enabled = true\n    tenant_id                     = data.azurerm_client_config.current.tenant_id\n  }\n}\n\nresource \"azurerm_postgresql_flexible_server_active_directory_administrator\" \"entra_admin\" {\n  server_id     = azurerm_postgresql_flexible_server.example.id\n  object_id     = var.entra_object_id\n  principal_name = var.entra_principal_name\n  principal_type = \"User\"\n  tenant_id     = data.azurerm_client_config.current.tenant_id\n}\n```"
    },
    "Recommendation": {
      "Text": "Federate PostgreSQL Flexible Server access through **Microsoft Entra ID** so MFA, conditional access, and centralized RBAC govern logins. Maintain at least one delegated administrator group and rotate membership through identity governance processes.",
      "Url": "https://hub.prowler.com/check/postgresql_flexible_server_entra_id_authentication_enabled"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check fails when Microsoft Entra ID authentication is disabled or no administrators are returned by the flexible server microsoft-entra-admin API."
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_entra_id_authentication_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_entra_id_authentication_enabled/postgresql_flexible_server_entra_id_authentication_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.postgresql.postgresql_client import (
    postgresql_client,
)


class postgresql_flexible_server_entra_id_authentication_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for (
            subscription,
            flexible_servers,
        ) in postgresql_client.flexible_servers.items():
            for server in flexible_servers:
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.subscription = subscription
                # Default to FAIL
                report.status = "FAIL"

                # Check if Entra ID authentication is enabled
                # Note: active_directory_auth is already normalized to uppercase in service layer
                if (
                    not server.active_directory_auth
                    or server.active_directory_auth != "ENABLED"
                ):
                    report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has Microsoft Entra ID authentication disabled"
                else:
                    # Authentication is enabled, now check for admins
                    admin_count = (
                        len(server.entra_id_admins) if server.entra_id_admins else 0
                    )

                    if admin_count == 0:
                        report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has Microsoft Entra ID authentication enabled but no Entra ID administrators configured"
                    else:
                        report.status = "PASS"
                        admin_text = (
                            "administrator" if admin_count == 1 else "administrators"
                        )
                        report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has Microsoft Entra ID authentication enabled with {admin_count} {admin_text} configured"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_log_checkpoints_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_log_checkpoints_on/postgresql_flexible_server_log_checkpoints_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "postgresql_flexible_server_log_checkpoints_on",
  "CheckTitle": "Ensure Server Parameter 'log_checkpoints' is set to 'ON' for PostgreSQL Database Server",
  "CheckType": [],
  "ServiceName": "postgresql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "PostgreSQL",
  "Description": "Enable log_checkpoints on PostgreSQL Servers.",
  "Risk": "Enabling log_checkpoints helps the PostgreSQL Database to Log each checkpoint in turn generates query and error logs. However, access to transaction logs is not supported. Query and error logs can be used to identify, troubleshoot, and repair configuration errors and sub-optimal performance.",
  "RelatedUrl": " https://docs.microsoft.com/en-us/rest/api/postgresql/singleserver/configurations/list-by-server",
  "Remediation": {
    "Code": {
      "CLI": "az postgres server configuration set --resource-group <resourceGroupName> --server-name <serverName> --name log_checkpoints --value on",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/PostgreSQL/log-checkpoints.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/bc_azr_networking_11#terraform"
    },
    "Recommendation": {
      "Text": "From Azure Portal 1. From Azure Home select the Portal Menu. 2. Go to Azure Database for PostgreSQL servers. 3. For each database, click on Server parameters. 4. Search for log_checkpoints. 5. Click ON and save. From Azure CLI Use the below command to update log_checkpoints configuration. az postgres server configuration set --resource-group <resourceGroupName> -- server-name <serverName> --name log_checkpoints --value on From PowerShell Update-AzPostgreSqlConfiguration -ResourceGroupName <ResourceGroupName> - ServerName <ServerName> -Name log_checkpoints -Value on",
      "Url": "https://docs.microsoft.com/en-us/azure/postgresql/howto-configure-server-parameters-using-portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_log_checkpoints_on.py]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_log_checkpoints_on/postgresql_flexible_server_log_checkpoints_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.postgresql.postgresql_client import (
    postgresql_client,
)


class postgresql_flexible_server_log_checkpoints_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for (
            subscription,
            flexible_servers,
        ) in postgresql_client.flexible_servers.items():
            for server in flexible_servers:
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has log_checkpoints disabled"
                if server.log_checkpoints == "ON":
                    report.status = "PASS"
                    report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has log_checkpoints enabled"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_log_connections_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_log_connections_on/postgresql_flexible_server_log_connections_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "postgresql_flexible_server_log_connections_on",
  "CheckTitle": "Ensure server parameter 'log_connections' is set to 'ON' for PostgreSQL Database Server",
  "CheckType": [],
  "ServiceName": "postgresql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "PostgreSQL",
  "Description": "Enable log_connections on PostgreSQL Servers.",
  "Risk": "Enabling log_connections helps PostgreSQL Database to log attempted connection to the server, as well as successful completion of client authentication. Log data can be used to identify, troubleshoot, and repair configuration errors and suboptimal performance.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/rest/api/postgresql/configurations/listbyserver",
  "Remediation": {
    "Code": {
      "CLI": "az postgres server configuration set --resource-group <resourceGroupName> --server-name <serverName> --name log_connections --value on",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/PostgreSQL/log-connections.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/bc_azr_networking_12#terraform"
    },
    "Recommendation": {
      "Text": "From Azure Portal 1. Login to Azure Portal using https://portal.azure.com. 2. Go to Azure Database for PostgreSQL servers. 3. For each database, click on Server parameters. 4. Search for log_connections. 5. Click ON and save. From Azure CLI Use the below command to update log_connections configuration. az postgres server configuration set --resource-group <resourceGroupName> -- server-name <serverName> --name log_connections --value on From PowerShell Use the below command to update log_connections configuration. Update-AzPostgreSqlConfiguration -ResourceGroupName <ResourceGroupName> - ServerName <ServerName> -Name log_connections -Value on",
      "Url": "https://learn.microsoft.com/en-us/azure/postgresql/single-server/how-to-configure-server-parameters-using-portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_log_connections_on.py]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_log_connections_on/postgresql_flexible_server_log_connections_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.postgresql.postgresql_client import (
    postgresql_client,
)


class postgresql_flexible_server_log_connections_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for (
            subscription,
            flexible_servers,
        ) in postgresql_client.flexible_servers.items():
            for server in flexible_servers:
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has log_connections disabled"
                if server.log_connections == "ON":
                    report.status = "PASS"
                    report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has log_connections enabled"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_log_disconnections_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_log_disconnections_on/postgresql_flexible_server_log_disconnections_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "postgresql_flexible_server_log_disconnections_on",
  "CheckTitle": "Ensure server parameter 'log_disconnections' is set to 'ON' for PostgreSQL Database Server",
  "CheckType": [],
  "ServiceName": "postgresql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "PostgreSQL",
  "Description": "Enable log_disconnections on PostgreSQL Servers.",
  "Risk": "Enabling log_disconnections helps PostgreSQL Database to Logs end of a session, including duration, which in turn generates query and error logs. Query and error logs can be used to identify, troubleshoot, and repair configuration errors and sub-optimal performance.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/rest/api/postgresql/singleserver/configurations/list-by-server",
  "Remediation": {
    "Code": {
      "CLI": "az postgres server configuration set --resource-group <resourceGroupName> --server-name <serverName> --name log_disconnections --value on",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/PostgreSQL/log-disconnections.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "From Azure Portal 1. From Azure Home select the Portal Menu 2. Go to Azure Database for PostgreSQL servers 3. For each database, click on Server parameters 4. Search for log_disconnections. 5. Click ON and save. From Azure CLI Use the below command to update log_disconnections configuration. az postgres server configuration set --resource-group <resourceGroupName> -- server-name <serverName> --name log_disconnections --value on From PowerShell Use the below command to update log_disconnections configuration. Update-AzPostgreSqlConfiguration -ResourceGroupName <ResourceGr",
      "Url": "https://learn.microsoft.com/en-us/azure/postgresql/single-server/how-to-configure-server-parameters-using-portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enabling this setting will enable a log of all disconnections. If this is enabled for a high traffic server, the log may grow exponentially."
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_log_disconnections_on.py]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_log_disconnections_on/postgresql_flexible_server_log_disconnections_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.postgresql.postgresql_client import (
    postgresql_client,
)


class postgresql_flexible_server_log_disconnections_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for (
            subscription,
            flexible_servers,
        ) in postgresql_client.flexible_servers.items():
            for server in flexible_servers:
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has log_disconnections disabled"
                if server.log_disconnections == "ON":
                    report.status = "PASS"
                    report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has log_disconnections enabled"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
