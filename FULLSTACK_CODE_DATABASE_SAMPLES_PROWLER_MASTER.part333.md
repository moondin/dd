---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 333
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 333 of 867)

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

---[FILE: containerregistry_client.py]---
Location: prowler-master/prowler/providers/azure/services/containerregistry/containerregistry_client.py

```python
from prowler.providers.azure.services.containerregistry.containerregistry_service import (
    ContainerRegistry,
)
from prowler.providers.common.provider import Provider

containerregistry_client = ContainerRegistry(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: containerregistry_service.py]---
Location: prowler-master/prowler/providers/azure/services/containerregistry/containerregistry_service.py

```python
from dataclasses import dataclass

from azure.mgmt.containerregistry import ContainerRegistryManagementClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService
from prowler.providers.azure.services.monitor.monitor_client import monitor_client
from prowler.providers.azure.services.monitor.monitor_service import DiagnosticSetting


class ContainerRegistry(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(ContainerRegistryManagementClient, provider)
        self.registries = self._get_container_registries()

    def _get_container_registries(self):
        logger.info("Container Registry - Getting registries...")
        registries = {}
        for subscription, client in self.clients.items():
            try:
                registries_list = client.registries.list()
                registries.update({subscription: {}})

                for registry in registries_list:
                    resource_group = self._get_resource_group(registry.id)
                    registries[subscription].update(
                        {
                            registry.id: ContainerRegistryInfo(
                                id=getattr(registry, "id", ""),
                                name=getattr(registry, "name", ""),
                                location=getattr(registry, "location", ""),
                                resource_group=resource_group,
                                sku=getattr(registry.sku, "name", ""),
                                login_server=getattr(registry, "login_server", ""),
                                public_network_access=(
                                    False
                                    if getattr(
                                        registry,
                                        "public_network_access_enabled",
                                        "Enabled",
                                    )
                                    == "Disabled"
                                    else True
                                ),
                                admin_user_enabled=getattr(
                                    registry, "admin_user_enabled", False
                                ),
                                monitor_diagnostic_settings=self._get_registry_monitor_settings(
                                    registry.name, resource_group, subscription
                                ),
                                private_endpoint_connections=[
                                    PrivateEndpointConnection(
                                        id=pec.id,
                                        name=pec.name,
                                        type=pec.type,
                                    )
                                    for pec in getattr(
                                        registry, "private_endpoint_connections", []
                                    )
                                ],
                            )
                        },
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return registries

    def _get_resource_group(self, registry_id: str) -> str:
        """Extract resource group from the registry ID."""
        return registry_id.split("/")[4]

    def _get_registry_monitor_settings(
        self, registry_name, resource_group, subscription
    ):
        logger.info(
            f"Container Registry - Getting monitor diagnostics settings for {registry_name}..."
        )
        monitor_diagnostics_settings = []
        try:
            monitor_diagnostics_settings = monitor_client.diagnostic_settings_with_uri(
                self.subscriptions[subscription],
                f"subscriptions/{self.subscriptions[subscription]}/resourceGroups/{resource_group}/providers/Microsoft.ContainerRegistry/registries/{registry_name}",
                monitor_client.clients[subscription],
            )
        except Exception as error:
            logger.error(
                f"Subscription name: {self.subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return monitor_diagnostics_settings


@dataclass
class PrivateEndpointConnection:
    id: str
    name: str
    type: str


@dataclass
class ContainerRegistryInfo:
    id: str
    name: str
    location: str
    resource_group: str
    sku: str
    login_server: str
    public_network_access: bool
    admin_user_enabled: bool
    monitor_diagnostic_settings: list[DiagnosticSetting]
    private_endpoint_connections: list[PrivateEndpointConnection]
```

--------------------------------------------------------------------------------

---[FILE: containerregistry_admin_user_disabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/containerregistry/containerregistry_admin_user_disabled/containerregistry_admin_user_disabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "containerregistry_admin_user_disabled",
  "CheckTitle": "Ensure admin user is disabled for Azure Container Registry",
  "CheckType": [],
  "ServiceName": "containerregistry",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "ContainerRegistry",
  "Description": "Ensure that the admin user is disabled and Role-Based Access Control (RBAC) is used instead since it could grant unrestricted access to the registry",
  "Risk": "If the admin user is enabled, it may lead to unauthorized access to the container registry and its resources, which could compromise the confidentiality, integrity, and availability of the images stored within.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/container-registry/container-registry-authentication?tabs=azure-cli#admin-account",
  "Remediation": {
    "Code": {
      "CLI": "az acr update --name <RegistryName> --resource-group <ResourceGroupName> --admin-enabled false",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable the admin user on Azure Container Registry through the Azure Portal: 1. Navigate to your Container Registry. 2. In the settings, select 'Access keys'. 3. Ensure the 'Admin user' checkbox is not ticked. For all actions relying on registry access, switch to using Role-Based Access Control.",
      "Url": "https://learn.microsoft.com/en-us/azure/container-registry/container-registry-authentication?tabs=azure-cli#admin-account"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "The transition away from using the admin user to RBAC will facilitate a more secure and manageable access model, minimizing the potential risk of unauthorized access to your container images."
}
```

--------------------------------------------------------------------------------

---[FILE: containerregistry_admin_user_disabled.py]---
Location: prowler-master/prowler/providers/azure/services/containerregistry/containerregistry_admin_user_disabled/containerregistry_admin_user_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.containerregistry.containerregistry_client import (
    containerregistry_client,
)


class containerregistry_admin_user_disabled(Check):
    def execute(self) -> list[Check_Report_Azure]:
        findings = []

        for subscription, registries in containerregistry_client.registries.items():
            for container_registry_info in registries.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=container_registry_info
                )
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Container Registry {container_registry_info.name} from subscription {subscription} has its admin user enabled."

                if not container_registry_info.admin_user_enabled:
                    report.status = "PASS"
                    report.status_extended = f"Container Registry {container_registry_info.name} from subscription {subscription} has its admin user disabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: containerregistry_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/containerregistry/containerregistry_not_publicly_accessible/containerregistry_not_publicly_accessible.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "containerregistry_not_publicly_accessible",
  "CheckTitle": "Restrict public network access to the Container Registry",
  "CheckType": [],
  "ServiceName": "containerregistry",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "ContainerRegistry",
  "Description": "Ensure that public network access to the Azure Container Registry is restricted.",
  "Risk": "Public accessibility exposes the Container Registry to potential attacks, unauthorized usage, and data breaches. Restricting access minimizes the surface area for attacks and ensures that only authorized networks can access the registry.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/container-registry/container-registry-access-selected-networks",
  "Remediation": {
    "Code": {
      "CLI": "az acr update --name <registry-name> --default-action Deny",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that the necessary virtual network configurations or IP rules are in place to allow access from required services once public access is restricted. Review the network access settings regularly to maintain a secure environment. To restrict public network access to your Azure Container Registry: 1. Navigate to your Container Registry in the Azure Portal. 2. Under 'Settings'->'Networking', configure the 'Public network access' settings to 'Disabled'. 3. Set up virtual network service endpoints or private endpoints as needed for secure access. 4. Review and adjust IP access rules as necessary.",
      "Url": "https://learn.microsoft.com/en-us/azure/container-registry/container-registry-access-selected-networks"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This feature is only available for Premium SKU registries."
}
```

--------------------------------------------------------------------------------

---[FILE: containerregistry_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/azure/services/containerregistry/containerregistry_not_publicly_accessible/containerregistry_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.containerregistry.containerregistry_client import (
    containerregistry_client,
)


class containerregistry_not_publicly_accessible(Check):
    def execute(self) -> list[Check_Report_Azure]:
        findings = []

        for subscription, registries in containerregistry_client.registries.items():
            for container_registry_info in registries.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=container_registry_info
                )
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Container Registry {container_registry_info.name} from subscription {subscription} allows unrestricted network access."

                if not container_registry_info.public_network_access:
                    report.status = "PASS"
                    report.status_extended = f"Container Registry {container_registry_info.name} from subscription {subscription} does not allow unrestricted network access."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: containerregistry_uses_private_link.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/containerregistry/containerregistry_uses_private_link/containerregistry_uses_private_link.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "containerregistry_uses_private_link",
  "CheckTitle": "Ensure to use a private link for accessing the Azure Container Registry",
  "CheckType": [],
  "ServiceName": "containerregistry",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "ContainerRegistry",
  "Description": "Ensure that a private link is used for accessing the Azure Container Registry to enhance security and restrict access to the registry over the public internet.",
  "Risk": "Without using a private link, the Azure Container Registry may be exposed to the public internet, increasing the risk of unauthorized access and potential data breaches.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/private-link/private-link-overview",
  "Remediation": {
    "Code": {
      "CLI": "az network private-endpoint create  --connection-name <ConnectionName> --resource-group <ResourceGroupName> --name <Name> --private-connection-resource-id <RegistryId> --vnet-name <VnetName> --subnet <SubnetName> --group-ids registry",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create a private link for Azure Container Registry through the Azure Portal: 1. Navigate to your Container Registry. 2. In the settings, select 'Networking'. 3. Select 'Private access'. 4. Configure a private endpoint for the registry.",
      "Url": "https://learn.microsoft.com/en-us/azure/container-registry/container-registry-private-link"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This feature is only available for Premium SKU registries."
}
```

--------------------------------------------------------------------------------

---[FILE: containerregistry_uses_private_link.py]---
Location: prowler-master/prowler/providers/azure/services/containerregistry/containerregistry_uses_private_link/containerregistry_uses_private_link.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.containerregistry.containerregistry_client import (
    containerregistry_client,
)


class containerregistry_uses_private_link(Check):
    def execute(self) -> list[Check_Report_Azure]:
        findings = []

        for subscription, registries in containerregistry_client.registries.items():
            for container_registry_info in registries.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=container_registry_info
                )
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Container Registry {container_registry_info.name} from subscription {subscription} does not use a private link."

                if container_registry_info.private_endpoint_connections:
                    report.status = "PASS"
                    report.status_extended = f"Container Registry {container_registry_info.name} from subscription {subscription} uses a private link."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cosmosdb_client.py]---
Location: prowler-master/prowler/providers/azure/services/cosmosdb/cosmosdb_client.py

```python
from prowler.providers.azure.services.cosmosdb.cosmosdb_service import CosmosDB
from prowler.providers.common.provider import Provider

cosmosdb_client = CosmosDB(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: cosmosdb_service.py]---
Location: prowler-master/prowler/providers/azure/services/cosmosdb/cosmosdb_service.py

```python
from dataclasses import dataclass
from typing import List

from azure.mgmt.cosmosdb import CosmosDBManagementClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class CosmosDB(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(CosmosDBManagementClient, provider)
        self.accounts = self._get_accounts()

    def _get_accounts(self):
        logger.info("CosmosDB - Getting accounts...")
        accounts = {}
        for subscription, client in self.clients.items():
            try:
                accounts_list = client.database_accounts.list()
                accounts.update({subscription: []})
                for account in accounts_list:
                    accounts[subscription].append(
                        Account(
                            id=account.id,
                            name=account.name,
                            kind=account.kind,
                            location=account.location,
                            type=account.type,
                            tags=account.tags,
                            is_virtual_network_filter_enabled=account.is_virtual_network_filter_enabled,
                            private_endpoint_connections=[
                                PrivateEndpointConnection(
                                    id=private_endpoint_connection.id,
                                    name=private_endpoint_connection.name,
                                    type=private_endpoint_connection.type,
                                )
                                for private_endpoint_connection in getattr(
                                    account, "private_endpoint_connections", []
                                )
                                if private_endpoint_connection
                            ],
                            disable_local_auth=getattr(
                                account, "disable_local_auth", False
                            ),
                        )
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return accounts


@dataclass
class PrivateEndpointConnection:
    id: str
    name: str
    type: str


@dataclass
class Account:
    id: str
    name: str
    kind: str
    type: str
    tags: dict
    is_virtual_network_filter_enabled: bool
    location: str
    private_endpoint_connections: List[PrivateEndpointConnection]
    disable_local_auth: bool = False
```

--------------------------------------------------------------------------------

---[FILE: cosmosdb_account_firewall_use_selected_networks.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/cosmosdb/cosmosdb_account_firewall_use_selected_networks/cosmosdb_account_firewall_use_selected_networks.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "cosmosdb_account_firewall_use_selected_networks",
  "CheckTitle": "Ensure That 'Firewalls & Networks' Is Limited to Use Selected Networks Instead of All Networks",
  "CheckType": [],
  "ServiceName": "cosmosdb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "CosmosDB",
  "Description": "Limiting your Cosmos DB to only communicate on whitelisted networks lowers its attack footprint.",
  "Risk": "Selecting certain networks for your Cosmos DB to communicate restricts the number of networks including the internet that can interact with what is stored within the database.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/cosmos-db/how-to-configure-private-endpoints",
  "Remediation": {
    "Code": {
      "CLI": "az cosmosdb database list / az cosmosdb show <database id> **isVirtualNetworkFilterEnabled should be set to true**",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Open the portal menu. 2. Select the Azure Cosmos DB blade. 3. Select a Cosmos DB account to audit. 4. Select Networking. 5. Under Public network access, select Selected networks. 6. Under Virtual networks, select + Add existing virtual network or + Add a new virtual network. 7. For existing networks, select subscription, virtual network, subnet and click Add. For new networks, provide a name, update the default values if required, and click Create. 8. Click Save.",
      "Url": "https://learn.microsoft.com/en-us/azure/storage/common/storage-network-security?tabs=azure-portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Failure to whitelist the correct networks will result in a connection loss."
}
```

--------------------------------------------------------------------------------

---[FILE: cosmosdb_account_firewall_use_selected_networks.py]---
Location: prowler-master/prowler/providers/azure/services/cosmosdb/cosmosdb_account_firewall_use_selected_networks/cosmosdb_account_firewall_use_selected_networks.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.cosmosdb.cosmosdb_client import cosmosdb_client


class cosmosdb_account_firewall_use_selected_networks(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, accounts in cosmosdb_client.accounts.items():
            for account in accounts:
                report = Check_Report_Azure(metadata=self.metadata(), resource=account)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"CosmosDB account {account.name} from subscription {subscription} has firewall rules that allow access from all networks."
                if account.is_virtual_network_filter_enabled:
                    report.status = "PASS"
                    report.status_extended = f"CosmosDB account {account.name} from subscription {subscription} has firewall rules that allow access only from selected networks."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cosmosdb_account_use_aad_and_rbac.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/cosmosdb/cosmosdb_account_use_aad_and_rbac/cosmosdb_account_use_aad_and_rbac.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "cosmosdb_account_use_aad_and_rbac",
  "CheckTitle": "Use Azure Active Directory (AAD) Client Authentication and Azure RBAC where possible.",
  "CheckType": [],
  "ServiceName": "cosmosdb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "CosmosDB",
  "Description": "Cosmos DB can use tokens or AAD for client authentication which in turn will use Azure RBAC for authorization. Using AAD is significantly more secure because AAD handles the credentials and allows for MFA and centralized management, and the Azure RBAC better integrated with the rest of Azure.",
  "Risk": "AAD client authentication is considerably more secure than token-based authentication because the tokens must be persistent at the client. AAD does not require this.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/cosmos-db/role-based-access-control",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Map all the resources that currently access to the Azure Cosmos DB account with keys or access tokens. Create an Azure Active Directory (AAD) identity for each of these resources: For Azure resources, you can create a managed identity . You may choose between system-assigned and user-assigned managed identities. For non-Azure resources, create an AAD identity. Grant each AAD identity the minimum permission it requires. When possible, we recommend you use one of the 2 built-in role definitions: Cosmos DB Built-in Data Reader or Cosmos DB Built-in Data Contributor. Validate that the new resource is functioning correctly. After new permissions are granted to identities, it may take a few hours until they propagate. When all resources are working correctly with the new identities, continue to the next step. You can use the az resource update powershell command: $cosmosdbname = 'cosmos-db-account-name' $resourcegroup = 'resource-group-name' $cosmosdb = az cosmosdb show --name $cosmosdbname --resource-group $resourcegroup | ConvertFrom-Json az resource update --ids $cosmosdb.id --set properties.disableLocalAuth=true --latest- include-preview",
      "Url": "https://learn.microsoft.com/en-us/azure/cosmos-db/role-based-access-control"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cosmosdb_account_use_aad_and_rbac.py]---
Location: prowler-master/prowler/providers/azure/services/cosmosdb/cosmosdb_account_use_aad_and_rbac/cosmosdb_account_use_aad_and_rbac.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.cosmosdb.cosmosdb_client import cosmosdb_client


class cosmosdb_account_use_aad_and_rbac(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, accounts in cosmosdb_client.accounts.items():
            for account in accounts:
                report = Check_Report_Azure(metadata=self.metadata(), resource=account)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"CosmosDB account {account.name} from subscription {subscription} is not using AAD and RBAC"
                if account.disable_local_auth:
                    report.status = "PASS"
                    report.status_extended = f"CosmosDB account {account.name} from subscription {subscription} is using AAD and RBAC"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cosmosdb_account_use_private_endpoints.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/cosmosdb/cosmosdb_account_use_private_endpoints/cosmosdb_account_use_private_endpoints.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "cosmosdb_account_use_private_endpoints",
  "CheckTitle": "Ensure That Private Endpoints Are Used Where Possible",
  "CheckType": [],
  "ServiceName": "cosmosdb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "CosmosDB",
  "Description": "Private endpoints limit network traffic to approved sources.",
  "Risk": "For sensitive data, private endpoints allow granular control of which services can communicate with Cosmos DB and ensure that this network traffic is private. You set this up on a case by case basis for each service you wish to be connected.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/cosmos-db/how-to-configure-private-endpoints",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Open the portal menu. 2. Select the Azure Cosmos DB blade. 3. Select the Azure Cosmos DB account. 4. Select Networking. 5. Select Private access. 6. Click + Private Endpoint. 7. Provide a Name. 8. Click Next. 9. From the Resource type drop down, select Microsoft.AzureCosmosDB/databaseAccounts. 10. From the Resource drop down, select the Cosmos DB account. 11. Click Next. 12. Provide appropriate Virtual Network details. 13. Click Next. 14. Provide appropriate DNS details. 15. Click Next. 16. Optionally provide Tags. 17. Click Next : Review + create. 18. Click Create.",
      "Url": "https://docs.microsoft.com/en-us/azure/private-link/tutorial-private-endpoint-cosmosdb-portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Only whitelisted services will have access to communicate with the Cosmos DB."
}
```

--------------------------------------------------------------------------------

---[FILE: cosmosdb_account_use_private_endpoints.py]---
Location: prowler-master/prowler/providers/azure/services/cosmosdb/cosmosdb_account_use_private_endpoints/cosmosdb_account_use_private_endpoints.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.cosmosdb.cosmosdb_client import cosmosdb_client


class cosmosdb_account_use_private_endpoints(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, accounts in cosmosdb_client.accounts.items():
            for account in accounts:
                report = Check_Report_Azure(metadata=self.metadata(), resource=account)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"CosmosDB account {account.name} from subscription {subscription} is not using private endpoints connections"
                if account.private_endpoint_connections:
                    report.status = "PASS"
                    report.status_extended = f"CosmosDB account {account.name} from subscription {subscription} is using private endpoints connections"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: databricks_client.py]---
Location: prowler-master/prowler/providers/azure/services/databricks/databricks_client.py

```python
from prowler.providers.azure.services.databricks.databricks_service import Databricks
from prowler.providers.common.provider import Provider

databricks_client = Databricks(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: databricks_service.py]---
Location: prowler-master/prowler/providers/azure/services/databricks/databricks_service.py
Signals: Pydantic

```python
from typing import Optional

from azure.mgmt.databricks import AzureDatabricksManagementClient
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class Databricks(AzureService):
    """
    Service class for interacting with Azure Databricks workspaces.

    This class initializes the Azure Databricks Management Client for each subscription
    and retrieves all Databricks workspaces within those subscriptions.
    """

    def __init__(self, provider: AzureProvider):
        """
        Initialize the Databricks service with the given Azure provider.

        Args:
            provider: The Azure provider instance containing credentials and configuration.
        """
        super().__init__(AzureDatabricksManagementClient, provider)
        self.workspaces = self._get_workspaces()

    def _get_workspaces(self) -> dict:
        """
        Retrieve all Databricks workspaces for each subscription.

        Returns:
            A dictionary mapping subscription IDs to their Databricks workspaces.
        """
        logger.info("Databricks - Getting workspaces...")
        workspaces = {}
        for subscription, client in self.clients.items():
            try:
                workspaces[subscription] = {}

                for workspace in client.workspaces.list_by_subscription():
                    workspace_parameters = getattr(workspace, "parameters", None)
                    workspace_managed_disk_encryption = getattr(
                        getattr(
                            getattr(workspace, "encryption", None), "entities", None
                        ),
                        "managed_disk",
                        None,
                    )

                    key_vault_properties = getattr(
                        workspace_managed_disk_encryption, "key_vault_properties", None
                    )

                    if key_vault_properties:
                        managed_disk_encryption = ManagedDiskEncryption(
                            key_name=key_vault_properties.key_name,
                            key_version=key_vault_properties.key_version,
                            key_vault_uri=key_vault_properties.key_vault_uri,
                        )
                    else:
                        managed_disk_encryption = None

                    workspaces[subscription][workspace.id] = DatabricksWorkspace(
                        id=workspace.id,
                        name=workspace.name,
                        location=workspace.location,
                        custom_managed_vnet_id=(
                            getattr(
                                workspace_parameters, "custom_virtual_network_id", None
                            ).value
                            if getattr(
                                workspace_parameters, "custom_virtual_network_id", None
                            )
                            else None
                        ),
                        managed_disk_encryption=managed_disk_encryption,
                    )
            except Exception as error:
                logger.error(
                    f"Subscription: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return workspaces


class ManagedDiskEncryption(BaseModel):
    """
    Pydantic model representing the encryption settings for a workspace's managed disks.

    Attributes:
        key_name: The name of the key used for encryption.
        key_version: The version of the key used for encryption.
        key_vault_uri: The URI of the key vault containing the key used for encryption.
    """

    key_name: str
    key_version: str
    key_vault_uri: str


class DatabricksWorkspace(BaseModel):
    """
    Pydantic model representing an Azure Databricks workspace.

    Attributes:
        id: The unique identifier of the workspace.
        name: The name of the workspace.
        location: The Azure region where the workspace is deployed.
        custom_managed_vnet_id: The ID of the custom managed virtual network, if configured.
        managed_disk_encryption: The encryption settings for the workspace's managed disks.
    """

    id: str
    name: str
    location: str
    custom_managed_vnet_id: Optional[str] = None
    managed_disk_encryption: Optional[ManagedDiskEncryption] = None
```

--------------------------------------------------------------------------------

---[FILE: databricks_workspace_cmk_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/databricks/databricks_workspace_cmk_encryption_enabled/databricks_workspace_cmk_encryption_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "databricks_workspace_cmk_encryption_enabled",
  "CheckTitle": "Ensure Azure Databricks workspaces use customer-managed keys (CMK) for encryption at rest",
  "CheckType": [],
  "ServiceName": "databricks",
  "SubServiceName": "workspace",
  "ResourceIdTemplate": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Databricks/workspaces/{workspaceName}",
  "Severity": "high",
  "ResourceType": "AzureDatabricksWorkspace",
  "Description": "Checks whether Azure Databricks workspaces are configured to use customer-managed keys (CMK) for encryption at rest, providing greater control over data encryption and compliance.",
  "Risk": "Without CMK, organizations have less control over encryption keys, which may impact regulatory compliance and increase risk of unauthorized data access.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/databricks/security/keys/customer-managed-keys",
  "Remediation": {
    "Code": {
      "CLI": "az databricks workspace update --name <databricks-workspace-name> --resource-group <resource-group-name> --prepare-encryption && databricks workspace update --name <databricks-workspace-name> --resource-group <resource-group-name> --key-source 'Microsoft.KeyVault' --key-name <key-name> --key-vault <key-vault-uri> --key-version <key-version>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable customer-managed keys (CMK) for Databricks workspaces using Azure Key Vault to enhance control over data encryption, auditing, and compliance.",
      "Url": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Databricks/enable-encryption-with-cmk.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Customer-managed key (CMK) encryption is only available for Databricks workspaces on the Premium tier."
}
```

--------------------------------------------------------------------------------

---[FILE: databricks_workspace_cmk_encryption_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/databricks/databricks_workspace_cmk_encryption_enabled/databricks_workspace_cmk_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.databricks.databricks_client import (
    databricks_client,
)


class databricks_workspace_cmk_encryption_enabled(Check):
    """
    Ensure Azure Databricks workspaces use customer-managed keys (CMK) for encryption at rest.

    This check evaluates whether each Azure Databricks workspace in the subscription is configured to use a customer-managed key (CMK) for encrypting data at rest.

    - PASS: The workspace has CMK encryption enabled (managed_disk_encryption is set).
    - FAIL: The workspace does not have CMK encryption enabled.
    """

    def execute(self):
        findings = []
        for subscription, workspaces in databricks_client.workspaces.items():
            for workspace in workspaces.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=workspace
                )
                report.subscription = subscription
                enc = workspace.managed_disk_encryption
                if enc:
                    report.status = "PASS"
                    report.status_extended = f"Databricks workspace {workspace.name} in subscription {subscription} has customer-managed key (CMK) encryption enabled with key {enc.key_vault_uri}/{enc.key_name}/{enc.key_version}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Databricks workspace {workspace.name} in subscription {subscription} does not have customer-managed key (CMK) encryption enabled."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
