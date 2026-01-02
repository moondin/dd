---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 348
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 348 of 867)

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

---[FILE: storage_service.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_service.py
Signals: Pydantic

```python
from typing import Optional

from azure.mgmt.storage import StorageManagementClient
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class Storage(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(StorageManagementClient, provider)
        self.storage_accounts = self._get_storage_accounts()
        self._get_blob_properties()
        self._get_file_share_properties()

    def _get_storage_accounts(self):
        logger.info("Storage - Getting storage accounts...")
        storage_accounts = {}
        for subscription, client in self.clients.items():
            try:
                storage_accounts.update({subscription: []})
                storage_accounts_list = client.storage_accounts.list()
                for storage_account in storage_accounts_list:
                    parts = storage_account.id.split("/")
                    if "resourceGroups" in parts:
                        resouce_name_index = parts.index("resourceGroups") + 1
                        resouce_group_name = parts[resouce_name_index]
                    else:
                        resouce_group_name = None
                    key_expiration_period_in_days = None
                    if storage_account.key_policy:
                        key_expiration_period_in_days = int(
                            storage_account.key_policy.key_expiration_period_in_days
                        )
                    storage_accounts[subscription].append(
                        Account(
                            id=storage_account.id,
                            name=storage_account.name,
                            resouce_group_name=resouce_group_name,
                            enable_https_traffic_only=storage_account.enable_https_traffic_only,
                            infrastructure_encryption=storage_account.encryption.require_infrastructure_encryption,
                            allow_blob_public_access=storage_account.allow_blob_public_access,
                            network_rule_set=NetworkRuleSet(
                                bypass=getattr(
                                    storage_account.network_rule_set,
                                    "bypass",
                                    "AzureServices",
                                ),
                                default_action=getattr(
                                    storage_account.network_rule_set,
                                    "default_action",
                                    "Allow",
                                ),
                            ),
                            encryption_type=storage_account.encryption.key_source,
                            minimum_tls_version=storage_account.minimum_tls_version,
                            private_endpoint_connections=[
                                PrivateEndpointConnection(
                                    id=pec.id,
                                    name=pec.name,
                                    type=pec.type,
                                )
                                for pec in getattr(
                                    storage_account, "private_endpoint_connections", []
                                )
                            ],
                            key_expiration_period_in_days=key_expiration_period_in_days,
                            location=storage_account.location,
                            default_to_entra_authorization=(
                                False
                                if getattr(
                                    storage_account,
                                    "default_to_o_auth_authentication",
                                    False,
                                )
                                is None
                                else getattr(
                                    storage_account,
                                    "default_to_o_auth_authentication",
                                    False,
                                )
                            ),
                            replication_settings=storage_account.sku.name,
                            allow_cross_tenant_replication=(
                                True
                                if getattr(
                                    storage_account,
                                    "allow_cross_tenant_replication",
                                    True,
                                )
                                is None
                                else getattr(
                                    storage_account,
                                    "allow_cross_tenant_replication",
                                    True,
                                )
                            ),
                            allow_shared_key_access=(
                                True
                                if getattr(
                                    storage_account, "allow_shared_key_access", True
                                )
                                is None
                                else getattr(
                                    storage_account, "allow_shared_key_access", True
                                )
                            ),
                        )
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return storage_accounts

    def _get_blob_properties(self):
        logger.info("Storage - Getting blob properties...")
        try:
            for subscription, accounts in self.storage_accounts.items():
                client = self.clients[subscription]
                for account in accounts:
                    try:
                        properties = client.blob_services.get_service_properties(
                            account.resouce_group_name, account.name
                        )
                        container_delete_retention_policy = getattr(
                            properties, "container_delete_retention_policy", None
                        )
                        versioning_enabled = getattr(
                            properties, "is_versioning_enabled", False
                        )
                        account.blob_properties = BlobProperties(
                            id=properties.id,
                            name=properties.name,
                            type=properties.type,
                            default_service_version=properties.default_service_version,
                            container_delete_retention_policy=DeleteRetentionPolicy(
                                enabled=getattr(
                                    container_delete_retention_policy,
                                    "enabled",
                                    False,
                                )
                                or False,
                                days=getattr(
                                    container_delete_retention_policy, "days", 0
                                )
                                or 0,
                            ),
                            versioning_enabled=versioning_enabled,
                        )
                    except Exception as error:
                        if (
                            "Blob is not supported for the account."
                            in str(error).strip()
                        ):
                            logger.warning(
                                f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
                            continue
                        logger.error(
                            f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )

        except Exception as error:
            logger.error(
                f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_file_share_properties(self):
        logger.info("Storage - Getting file share properties...")
        for subscription, accounts in self.storage_accounts.items():
            client = self.clients[subscription]
            for account in accounts:
                try:
                    file_service_properties = (
                        client.file_services.get_service_properties(
                            account.resouce_group_name, account.name
                        )
                    )
                    share_delete_retention_policy = getattr(
                        file_service_properties,
                        "share_delete_retention_policy",
                        None,
                    )

                    smb_channel_encryption_raw = getattr(
                        getattr(
                            getattr(
                                file_service_properties,
                                "protocol_settings",
                                None,
                            ),
                            "smb",
                            None,
                        ),
                        "channel_encryption",
                        None,
                    )

                    smb_supported_versions_raw = getattr(
                        getattr(
                            getattr(
                                file_service_properties,
                                "protocol_settings",
                                None,
                            ),
                            "smb",
                            None,
                        ),
                        "versions",
                        None,
                    )

                    account.file_service_properties = FileServiceProperties(
                        id=file_service_properties.id,
                        name=file_service_properties.name,
                        type=file_service_properties.type,
                        share_delete_retention_policy=DeleteRetentionPolicy(
                            enabled=getattr(
                                share_delete_retention_policy,
                                "enabled",
                                False,
                            )
                            or False,
                            days=getattr(
                                share_delete_retention_policy,
                                "days",
                                0,
                            )
                            or 0,
                        ),
                        smb_protocol_settings=SMBProtocolSettings(
                            channel_encryption=(
                                smb_channel_encryption_raw.rstrip(";").split(";")
                                if smb_channel_encryption_raw
                                else []
                            ),
                            supported_versions=(
                                smb_supported_versions_raw.rstrip(";").split(";")
                                if smb_supported_versions_raw
                                else []
                            ),
                        ),
                    )
                except Exception as error:
                    if "File is not supported for the account." in str(error).strip():
                        logger.warning(
                            f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                        continue
                    logger.error(
                        f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )


class DeleteRetentionPolicy(BaseModel):
    enabled: bool
    days: int


class BlobProperties(BaseModel):
    id: str
    name: str
    type: str
    container_delete_retention_policy: DeleteRetentionPolicy
    default_service_version: Optional[str] = None
    versioning_enabled: Optional[bool] = None


class NetworkRuleSet(BaseModel):
    bypass: str
    default_action: str


class PrivateEndpointConnection(BaseModel):
    id: str
    name: str
    type: str


class SMBProtocolSettings(BaseModel):
    channel_encryption: list[str]
    supported_versions: list[str]


class FileServiceProperties(BaseModel):
    id: str
    name: str
    type: str
    share_delete_retention_policy: DeleteRetentionPolicy
    smb_protocol_settings: SMBProtocolSettings


class Account(BaseModel):
    id: str
    name: str
    location: str
    resouce_group_name: str
    enable_https_traffic_only: bool
    infrastructure_encryption: Optional[bool] = None
    allow_blob_public_access: bool
    network_rule_set: NetworkRuleSet
    encryption_type: str
    minimum_tls_version: str
    private_endpoint_connections: list[PrivateEndpointConnection]
    key_expiration_period_in_days: Optional[int] = None
    replication_settings: str = "Standard_LRS"
    allow_cross_tenant_replication: bool = True
    allow_shared_key_access: bool = True
    blob_properties: Optional[BlobProperties] = None
    default_to_entra_authorization: bool = False
    file_service_properties: Optional[FileServiceProperties] = None
```

--------------------------------------------------------------------------------

---[FILE: constants.py]---
Location: prowler-master/prowler/providers/azure/services/storage/lib/constants.py

```python
"""Constants for the storage service."""

LATEST_SMB_VERSION = "SMB3.1.1"
```

--------------------------------------------------------------------------------

---[FILE: storage_account_key_access_disabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_account_key_access_disabled/storage_account_key_access_disabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_account_key_access_disabled",
  "CheckTitle": "Ensure allow storage account key access is disabled",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "account",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureStorageAccount",
  "Description": "Ensures that access to Azure Storage Accounts using account keys is disabled, enforcing the use of Microsoft Entra ID (formerly Azure AD) for authentication.",
  "Risk": "Using Shared Key authorization poses a security risk due to the high privileges associated with storage account keys and the difficulty in auditing such access. Disabling Shared Key access helps enforce identity-based authentication via Microsoft Entra ID, enhancing security and traceability.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/storage/common/shared-key-authorization-prevent",
  "Remediation": {
    "Code": {
      "CLI": "az storage account update --name <storage-account-name> --resource-group <resource-group> --allow-shared-key-access false",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/StorageAccounts/disable-shared-key-authorization.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable Shared Key authorization on storage accounts to enforce the use of Microsoft Entra ID for secure, auditable access.",
      "Url": "https://learn.microsoft.com/en-us/azure/storage/common/shared-key-authorization-prevent"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: storage_account_key_access_disabled.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_account_key_access_disabled/storage_account_key_access_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_account_key_access_disabled(Check):
    """Check if storage account key access is disabled.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> Check_Report_Azure:
        """Execute the check for storage account key access.

        This method checks if storage account key access is disabled. If it is, the check passes; otherwise, it fails.

        Returns:
            Check_Report_Azure: A report containing the result of the check.
        """
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                if not storage_account.allow_shared_key_access:
                    report.status = "PASS"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has shared key access disabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has shared key access enabled."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_blob_public_access_level_is_disabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_blob_public_access_level_is_disabled/storage_blob_public_access_level_is_disabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_blob_public_access_level_is_disabled",
  "CheckTitle": "Ensure that the 'Public access level' is set to 'Private (no anonymous access)' for all blob containers in your storage account",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureStorageAccount",
  "Description": "Ensure that the 'Public access level' configuration setting is set to 'Private (no anonymous access)' for all blob containers in your storage account in order to block anonymous access to these Microsoft Azure resources.",
  "Risk": "A user that accesses blob containers anonymously can use constructors that do not require credentials such as shared access signatures.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/StorageAccounts/disable-blob-anonymous-access-for-storage-accounts.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/ensure-that-storage-accounts-disallow-public-access#terraform"
    },
    "Recommendation": {
      "Text": "Set 'Public access level' configuration setting to 'Private (no anonymous access)'",
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

---[FILE: storage_blob_public_access_level_is_disabled.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_blob_public_access_level_is_disabled/storage_blob_public_access_level_is_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_blob_public_access_level_is_disabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has allow blob public access enabled."

                if not storage_account.allow_blob_public_access:
                    report.status = "PASS"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has allow blob public access disabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_blob_versioning_is_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_blob_versioning_is_enabled/storage_blob_versioning_is_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_blob_versioning_is_enabled",
  "CheckTitle": "Ensure Blob Versioning is Enabled on Azure Blob Storage Accounts",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureStorageAccount",
  "Description": "Ensure that blob versioning is enabled on Azure Blob Storage accounts to automatically retain previous versions of objects.",
  "Risk": "Without blob versioning, accidental or malicious changes to blobs cannot be easily recovered, leading to potential data loss.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-enable",
  "Remediation": {
    "Code": {
      "CLI": "az storage account blob-service-properties update --resource-group <resource_group> --account-name <storage-account> --enable-versioning true",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/StorageAccounts/enable-versioning-for-blobs.html",
      "Terraform": "resource \"azurerm_storage_account\" \"example\" {\n  name                     = \"examplestorageacct\"\n  resource_group_name      = azurerm_resource_group.example.name\n  location                 = azurerm_resource_group.example.location\n  account_tier             = \"Standard\"\n  account_replication_type = \"LRS\"\n\n  blob_properties {\n    versioning_enabled = true\n  }\n}\n"
    },
    "Recommendation": {
      "Text": "Enable blob versioning for all Azure Storage accounts that store critical or sensitive data.",
      "Url": "https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-enable"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: storage_blob_versioning_is_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_blob_versioning_is_enabled/storage_blob_versioning_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_blob_versioning_is_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                if storage_account.blob_properties:
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=storage_account
                    )
                    report.subscription = subscription
                    if getattr(
                        storage_account.blob_properties, "versioning_enabled", False
                    ):
                        report.status = "PASS"
                        report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has blob versioning enabled."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} does not have blob versioning enabled."
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_cross_tenant_replication_disabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_cross_tenant_replication_disabled/storage_cross_tenant_replication_disabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_cross_tenant_replication_disabled",
  "CheckTitle": "Ensure cross-tenant replication is disabled",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "account",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureStorageAccount",
  "Description": "Ensure that cross-tenant replication is not enabled on Azure Storage Accounts to prevent unintended replication of data across tenant boundaries.",
  "Risk": "If cross-tenant replication is enabled, sensitive data could be inadvertently replicated across tenants, increasing the risk of data leakage, unauthorized access, or non-compliance with data governance and privacy policies.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/storage/blobs/object-replication-prevent-cross-tenant-policies?tabs=portal",
  "Remediation": {
    "Code": {
      "CLI": "az storage account update --name <storage-account-name> --resource-group <resource-group> --default-to-oauth-authentication true --allow-cross-tenant-replication false",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/StorageAccounts/disable-cross-tenant-replication.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable Cross Tenant Replication on storage accounts to ensure that data remains within tenant boundaries unless explicitly shared, reducing the risk of data leakage and unauthorized access.",
      "Url": "https://learn.microsoft.com/en-us/azure/storage/blobs/object-replication-prevent-cross-tenant-policies?tabs=portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: storage_cross_tenant_replication_disabled.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_cross_tenant_replication_disabled/storage_cross_tenant_replication_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_cross_tenant_replication_disabled(Check):
    """Check if cross-tenant replication is disabled.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> Check_Report_Azure:
        """Execute the check for cross-tenant replication.

        This method checks if cross-tenant replication is disabled. If it is, the check passes; otherwise, it fails.

        Returns:
            Check_Report_Azure: A report containing the result of the check.
        """
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                if not storage_account.allow_cross_tenant_replication:
                    report.status = "PASS"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has cross-tenant replication disabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has cross-tenant replication enabled."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_default_network_access_rule_is_denied.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_default_network_access_rule_is_denied/storage_default_network_access_rule_is_denied.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_default_network_access_rule_is_denied",
  "CheckTitle": "Ensure Default Network Access Rule for Storage Accounts is Set to Deny",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureStorageAccount",
  "Description": "Restricting default network access helps to provide a new layer of security, since storage accounts accept connections from clients on any network. To limit access toselected networks, the default action must be changed.",
  "Risk": "Storage accounts should be configured to deny access to traffic from all networks (including internet traffic). Access can be granted to traffic from specific Azure Virtualnetworks, allowing a secure network boundary for specific applications to be built.Access can also be granted to public internet IP address ranges to enable connectionsfrom specific internet or on-premises clients. When network rules are configured, onlyapplications from allowed networks can access a storage account. When calling from anallowed network, applications continue to require proper authorization (a valid accesskey or SAS token) to access the storage account.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "az storage account update --name <StorageAccountName> --resource-group <resourceGroupName> --default-action Deny",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/StorageAccounts/restrict-default-network-access.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/set-default-network-access-rule-for-storage-accounts-to-deny#terraform"
    },
    "Recommendation": {
      "Text": "1. Go to Storage Accounts 2. For each storage account, Click on the Networking blade 3. Click the Firewalls and virtual networks heading. 4. Ensure that you have elected to allow access from Selected networks 5. Add rules to allow traffic from specific network. 6. Click Save to apply your changes.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "All allowed networks will need to be whitelisted on each specific network, creating administrative overhead. This may result in loss of network connectivity, so do not turn on for critical resources during business hours."
}
```

--------------------------------------------------------------------------------

---[FILE: storage_default_network_access_rule_is_denied.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_default_network_access_rule_is_denied/storage_default_network_access_rule_is_denied.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_default_network_access_rule_is_denied(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has network access rule set to Deny."

                if storage_account.network_rule_set.default_action == "Allow":
                    report.status = "FAIL"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has network access rule set to Allow."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_default_to_entra_authorization_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_default_to_entra_authorization_enabled/storage_default_to_entra_authorization_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_default_to_entra_authorization_enabled",
  "CheckTitle": "Ensure Microsoft Entra authorization is enabled by default for Azure Storage Accounts",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureStorageAccount",
  "Description": "Ensure that the Azure Storage Account setting 'Default to Microsoft Entra authorization in the Azure portal' is enabled to enforce the use of Microsoft Entra ID for accessing blobs, files, queues, and tables.",
  "Risk": "If this setting is not enabled, the Azure portal may authorize access using less secure methods such as Shared Key, increasing the risk of unauthorized data access.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/storage/blobs/authorize-access-azure-active-directory",
  "Remediation": {
    "Code": {
      "CLI": "az storage account update --name <storage-account-name> --resource-group <resource-group-name> --default-to-AzAd-auth true",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/StorageAccounts/enable-microsoft-entra-authorization-by-default.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable Microsoft Entra authorization by default in the Azure portal to enhance security and avoid reliance on Shared Key authentication.",
      "Url": "https://learn.microsoft.com/en-us/azure/storage/blobs/authorize-access-azure-active-directory"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: storage_default_to_entra_authorization_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_default_to_entra_authorization_enabled/storage_default_to_entra_authorization_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_default_to_entra_authorization_enabled(Check):
    """Check if the default to Microsoft Entra authorization is enabled for the storage account.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).

    """

    def execute(self) -> Check_Report_Azure:
        """Execute the check for the default to Microsoft Entra authorization.

        This method checks if the default to Microsoft Entra authorization is enabled for the storage account.

        Returns:
            Check_Report_Azure: A report containing the result of the check.
        """
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                report.resource_name = storage_account.name
                report.resource_id = storage_account.id
                report.status = "FAIL"
                report.status_extended = f"Default to Microsoft Entra authorization is not enabled for storage account {storage_account.name}."

                if storage_account.default_to_entra_authorization:
                    report.status = "PASS"
                    report.status_extended = f"Default to Microsoft Entra authorization is enabled for storage account {storage_account.name}."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_azure_services_are_trusted_to_access_is_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_ensure_azure_services_are_trusted_to_access_is_enabled/storage_ensure_azure_services_are_trusted_to_access_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_ensure_azure_services_are_trusted_to_access_is_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} allows trusted Microsoft services to access this storage account."

                if "AzureServices" not in storage_account.network_rule_set.bypass:
                    report.status = "FAIL"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} does not allow trusted Microsoft services to access this storage account."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_encryption_with_customer_managed_keys.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_ensure_encryption_with_customer_managed_keys/storage_ensure_encryption_with_customer_managed_keys.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_ensure_encryption_with_customer_managed_keys",
  "CheckTitle": "Ensure that your Microsoft Azure Storage accounts are using Customer Managed Keys (CMKs) instead of Microsoft Managed Keys",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureStorageAccount",
  "Description": "Ensure that your Microsoft Azure Storage accounts are using Customer Managed Keys (CMKs) instead of Microsoft Managed Keys",
  "Risk": "If you want to control and manage storage account contents encryption key yourself you must specify a customer-managed key",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/StorageAccounts/cmk-encryption.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-storage-accounts-use-customer-managed-key-for-encryption#terraform"
    },
    "Recommendation": {
      "Text": "Enable sensitive data encryption at rest using Customer Managed Keys rather than Microsoft Managed keys.",
      "Url": ""
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
