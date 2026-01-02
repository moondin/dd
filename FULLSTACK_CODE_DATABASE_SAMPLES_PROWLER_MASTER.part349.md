---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 349
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 349 of 867)

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

---[FILE: storage_ensure_encryption_with_customer_managed_keys.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_ensure_encryption_with_customer_managed_keys/storage_ensure_encryption_with_customer_managed_keys.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_ensure_encryption_with_customer_managed_keys(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} encrypts with CMKs."

                if storage_account.encryption_type != "Microsoft.Keyvault":
                    report.status = "FAIL"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} does not encrypt with CMKs."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_file_shares_soft_delete_is_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_ensure_file_shares_soft_delete_is_enabled/storage_ensure_file_shares_soft_delete_is_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_ensure_file_shares_soft_delete_is_enabled",
  "CheckTitle": "Ensure soft delete for Azure File Shares is enabled",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureStorageAccount",
  "Description": "Ensure that soft delete is enabled for Azure File Shares to protect against accidental or malicious deletion of important data. This feature allows deleted file shares to be retained for a specified period, during which they can be recovered before permanent deletion occurs.",
  "Risk": "Without soft delete enabled, accidental or malicious deletions of file shares result in permanent data loss, making recovery impossible unless a separate backup mechanism is in place.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/storage/files/storage-files-prevent-file-share-deletion?tabs=azure-portal",
  "Remediation": {
    "Code": {
      "CLI": "az storage account file-service-properties update --account-name <storage-account-name> --enable-delete-retention true --delete-retention-days <number-of-days>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/StorageAccounts/enable-soft-delete-for-file-shares.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable soft delete for file shares on your Azure Storage Account to allow recovery of deleted shares within a configured retention period.",
      "Url": "https://learn.microsoft.com/en-us/azure/storage/files/storage-files-prevent-file-share-deletion?tabs=azure-portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_file_shares_soft_delete_is_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_ensure_file_shares_soft_delete_is_enabled/storage_ensure_file_shares_soft_delete_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_ensure_file_shares_soft_delete_is_enabled(Check):
    def execute(self) -> list:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                if getattr(storage_account, "file_service_properties", None):
                    report = Check_Report_Azure(
                        metadata=self.metadata(),
                        resource=storage_account.file_service_properties,
                    )
                    report.subscription = subscription
                    report.resource_name = storage_account.name
                    report.location = storage_account.location

                    if (
                        storage_account.file_service_properties.share_delete_retention_policy.enabled
                    ):
                        report.status = "PASS"
                        report.status_extended = f"File share soft delete is enabled for storage account {storage_account.name} with a retention period of {storage_account.file_service_properties.share_delete_retention_policy.days} days."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"File share soft delete is not enabled for storage account {storage_account.name}."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_minimum_tls_version_12.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_ensure_minimum_tls_version_12/storage_ensure_minimum_tls_version_12.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_ensure_minimum_tls_version_12",
  "CheckTitle": "Ensure the 'Minimum TLS version' for storage accounts is set to 'Version 1.2'",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureStorageAccount",
  "Description": "Ensure the 'Minimum TLS version' for storage accounts is set to 'Version 1.2'",
  "Risk": "TLS versions 1.0 and 1.1 are known to be susceptible to certain Common Vulnerabilities and Exposures (CVE) weaknesses and attacks such as POODLE and BEAST",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/azure/azure-storage-policies/bc_azr_storage_2",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-storage-policies/bc_azr_storage_2#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that all your Microsoft Azure Storage accounts are using the latest available version of the TLS protocol.",
      "Url": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/StorageAccounts/minimum-tls-version.html"
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

---[FILE: storage_ensure_minimum_tls_version_12.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_ensure_minimum_tls_version_12/storage_ensure_minimum_tls_version_12.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_ensure_minimum_tls_version_12(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has TLS version set to 1.2."

                if storage_account.minimum_tls_version != "TLS1_2":
                    report.status = "FAIL"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} does not have TLS version set to 1.2."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_private_endpoints_in_storage_accounts.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_ensure_private_endpoints_in_storage_accounts/storage_ensure_private_endpoints_in_storage_accounts.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_ensure_private_endpoints_in_storage_accounts",
  "CheckTitle": "Ensure Private Endpoints are used to access Storage Accounts",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureStorageAccount",
  "Description": "Use private endpoints for your Azure Storage accounts to allow clients and services to securely access data located over a network via an encrypted Private Link. To do this, the private endpoint uses an IP address from the VNet for each service. Network traffic between disparate services securely traverses encrypted over the VNet. This VNet can also link addressing space, extending your network and accessing resources on it. Similarly, it can be a tunnel through public networks to connect remote infrastructures together. This creates further security through segmenting network traffic and preventing outside sources from accessing it.",
  "Risk": "Storage accounts that are not configured to use Private Endpoints are accessible over the public internet. This can lead to data exfiltration and other security issues.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/storage/common/storage-private-endpoints",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/StorageAccounts/private-endpoints.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use Private Endpoints to access Storage Accounts",
      "Url": "https://docs.microsoft.com/en-us/azure/storage/common/storage-private-endpoints"
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

---[FILE: storage_ensure_private_endpoints_in_storage_accounts.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_ensure_private_endpoints_in_storage_accounts/storage_ensure_private_endpoints_in_storage_accounts.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_ensure_private_endpoints_in_storage_accounts(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                if storage_account.private_endpoint_connections:
                    report.status = "PASS"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has private endpoint connections."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} does not have private endpoint connections."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_soft_delete_is_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_ensure_soft_delete_is_enabled/storage_ensure_soft_delete_is_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_ensure_soft_delete_is_enabled",
  "CheckTitle": "Ensure Soft Delete is Enabled for Azure Containers and Blob Storage",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureStorageAccount",
  "Description": "The Azure Storage blobs contain data like ePHI or Financial, which can be secret or personal. Data that is erroneously modified or deleted by an application or other storage account user will cause data loss or unavailability.",
  "Risk": "Containers and Blob Storage data can be incorrectly deleted. An attacker/malicious user may do this deliberately in order to cause disruption. Deleting an Azure Storage blob causes immediate data loss. Enabling this configuration for Azure storage ensures that even if blobs/data were deleted from the storage account, Blobs/data objects are recoverable for a particular time which is set in the Retention policies ranging from 7 days to 365 days.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/storage/blobs/soft-delete-blob-enable?tabs=azure-portal",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/StorageAccounts/enable-soft-delete.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "From the Azure home page, open the hamburger menu in the top left or click on the arrow pointing right with 'More services' underneath. 2. Select Storage. 3. Select Storage Accounts. 4. For each Storage Account, navigate to Data protection in the left scroll column. 5. Check soft delete for both blobs and containers. Set the retention period to a sufficient length for your organization",
      "Url": "https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-soft-delete"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Additional storage costs may be incurred as snapshots are retained."
}
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_soft_delete_is_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_ensure_soft_delete_is_enabled/storage_ensure_soft_delete_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_ensure_soft_delete_is_enabled(Check):
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
                        storage_account.blob_properties.container_delete_retention_policy,
                        "enabled",
                        False,
                    ):
                        report.status = "PASS"
                        report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has soft delete enabled."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has soft delete disabled."

                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_geo_redundant_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_geo_redundant_enabled/storage_geo_redundant_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_geo_redundant_enabled",
  "CheckTitle": "Ensure geo-redundant storage (GRS) is enabled on critical Azure Storage Accounts",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureStorageAccount",
  "Description": "Geo-redundant storage (GRS) must be enabled on critical Azure Storage Accounts to ensure data durability and availability in the event of a regional outage. GRS replicates data within the primary region and asynchronously to a secondary region, offering enhanced resilience and supporting disaster recovery strategies.",
  "Risk": "Without GRS, critical data may be lost or become unavailable during a regional outage, compromising data durability and disaster recovery efforts.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy",
  "Remediation": {
    "Code": {
      "CLI": "az storage account update --name <storage-account-name> --resource-group <resource-group-name> --sku Standard_GRS",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/StorageAccounts/enable-geo-redundant-storage.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable geo-redundant storage (GRS) for critical Azure Storage Accounts to ensure data durability and availability across regional failures.",
      "Url": "https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: storage_geo_redundant_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_geo_redundant_enabled/storage_geo_redundant_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_geo_redundant_enabled(Check):
    """Check if geo-redundant storage (GRS) is enabled on critical Azure Storage Accounts.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> Check_Report_Azure:
        """Execute the check for geo-redundant storage (GRS).

        This method checks if geo-redundant storage (GRS) is enabled on critical Azure Storage Accounts.

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

                if (
                    storage_account.replication_settings == "Standard_GRS"
                    or storage_account.replication_settings == "Standard_GZRS"
                    or storage_account.replication_settings == "Standard_RAGRS"
                    or storage_account.replication_settings == "Standard_RAGZRS"
                ):
                    report.status = "PASS"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has Geo-redundant storage {storage_account.replication_settings} enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} does not have Geo-redundant storage enabled, it has {storage_account.replication_settings} instead."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_infrastructure_encryption_is_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_infrastructure_encryption_is_enabled/storage_infrastructure_encryption_is_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_infrastructure_encryption_is_enabled",
  "CheckTitle": "Ensure that 'Enable Infrastructure Encryption' for Each Storage Account in Azure Storage is Set to 'enabled' ",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AzureRole",
  "Description": "Ensure that 'Enable Infrastructure Encryption' for Each Storage Account in Azure Storage is Set to 'enabled' ",
  "Risk": "Double encryption of Azure Storage data protects against a scenario where one of the encryption algorithms or keys may be compromised",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enabling double encryption at the hardware level on top of the default software encryption for Storage Accounts accessing Azure storage solutions.",
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

---[FILE: storage_infrastructure_encryption_is_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_infrastructure_encryption_is_enabled/storage_infrastructure_encryption_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_infrastructure_encryption_is_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has infrastructure encryption enabled."
                if not storage_account.infrastructure_encryption:
                    report.status = "FAIL"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has infrastructure encryption disabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_key_rotation_90_days.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_key_rotation_90_days/storage_key_rotation_90_days.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_key_rotation_90_days",
  "CheckTitle": "Ensure that Storage Account Access Keys are Periodically Regenerated",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureStorageAccount",
  "Description": "Ensure that Storage Account Access Keys are Periodically Regenerated",
  "Risk": "If the access keys are not regenerated periodically, the likelihood of accidental exposures increases, which can lead to unauthorized access to your storage account resources.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/StorageAccounts/regenerate-storage-account-access-keys-periodically.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that Azure Storage account access keys are regenerated every 90 days in order to decrease the likelihood of accidental exposures and protect your storage account resources against unauthorized access.",
      "Url": "https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal#regenerate-storage-access-keys"
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

---[FILE: storage_key_rotation_90_days.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_key_rotation_90_days/storage_key_rotation_90_days.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_key_rotation_90_days(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                if not storage_account.key_expiration_period_in_days:
                    report.status = "FAIL"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has no key expiration period set."
                else:
                    if storage_account.key_expiration_period_in_days > 90:
                        report.status = "FAIL"
                        report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has an invalid key expiration period of {storage_account.key_expiration_period_in_days} days."
                    else:
                        report.status = "PASS"
                        report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has a key expiration period of {storage_account.key_expiration_period_in_days} days."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_secure_transfer_required_is_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_secure_transfer_required_is_enabled/storage_secure_transfer_required_is_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_secure_transfer_required_is_enabled",
  "CheckTitle": "Ensure that all data transferred between clients and your Azure Storage account is encrypted using the HTTPS protocol.",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureStorageAccount",
  "Description": "Ensure that all data transferred between clients and your Azure Storage account is encrypted using the HTTPS protocol.",
  "Risk": "Requests to the storage account sent outside of a secure connection can be eavesdropped",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "az storage account update --name <STORAGE_ACCOUNT_NAME> --https-only true",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/StorageAccounts/secure-transfer-required.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/ensure-that-storage-account-enables-secure-transfer"
    },
    "Recommendation": {
      "Text": "Enable data encryption in transit.",
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

---[FILE: storage_secure_transfer_required_is_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_secure_transfer_required_is_enabled/storage_secure_transfer_required_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_secure_transfer_required_is_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for storage_account in storage_accounts:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=storage_account
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has secure transfer required enabled."
                if not storage_account.enable_https_traffic_only:
                    report.status = "FAIL"
                    report.status_extended = f"Storage account {storage_account.name} from subscription {subscription} has secure transfer required disabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_smb_channel_encryption_with_secure_algorithm.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_smb_channel_encryption_with_secure_algorithm/storage_smb_channel_encryption_with_secure_algorithm.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_smb_channel_encryption_with_secure_algorithm",
  "CheckTitle": "Ensure SMB channel encryption uses a secure algorithm for SMB file shares",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/fileServices/default",
  "Severity": "medium",
  "ResourceType": "AzureStorageAccount",
  "Description": "Implement SMB channel encryption with a secure algorithm for SMB file shares to ensure data confidentiality and integrity in transit.",
  "Risk": "Not using the recommended SMB channel encryption may expose data transmitted over SMB channels to unauthorized interception and tampering.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/well-architected/service-guides/azure-files#recommendations-for-smb-file-shares",
  "Remediation": {
    "Code": {
      "CLI": "az storage account file-service-properties update --resource-group <resource-group> --account-name <storage-account> --channel-encryption AES-256-GCM",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use the portal, CLI or PowerShell to set the SMB channel encryption to a secure algorithm.",
      "Url": "https://learn.microsoft.com/en-us/azure/storage/files/files-smb-protocol?tabs=azure-portal#smb-security-settings"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check passes if SMB channel encryption is set to a secure algorithm."
}
```

--------------------------------------------------------------------------------

---[FILE: storage_smb_channel_encryption_with_secure_algorithm.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_smb_channel_encryption_with_secure_algorithm/storage_smb_channel_encryption_with_secure_algorithm.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.storage_client import storage_client

SECURE_ENCRYPTION_ALGORITHMS = ["AES-256-GCM"]


class storage_smb_channel_encryption_with_secure_algorithm(Check):
    """
    Ensure SMB channel encryption for file shares is set to the recommended algorithm (AES-256-GCM or higher).

    This check evaluates whether SMB file shares are configured to use only the recommended SMB channel encryption algorithms.
    - PASS: Storage account has the recommended SMB channel encryption (AES-256-GCM or higher) enabled for file shares.
    - FAIL: Storage account does not have the recommended SMB channel encryption enabled for file shares or uses an unsupported algorithm.
    """

    def execute(self) -> list[Check_Report_Azure]:
        findings = []
        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for account in storage_accounts:
                if account.file_service_properties:
                    pretty_current_algorithms = (
                        ", ".join(
                            account.file_service_properties.smb_protocol_settings.channel_encryption
                        )
                        if account.file_service_properties.smb_protocol_settings.channel_encryption
                        else "none"
                    )
                    report = Check_Report_Azure(
                        metadata=self.metadata(),
                        resource=account.file_service_properties,
                    )
                    report.subscription = subscription
                    report.resource_name = account.name

                    if (
                        not account.file_service_properties.smb_protocol_settings.channel_encryption
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"Storage account {account.name} from subscription {subscription} does not have SMB channel encryption enabled for file shares."
                    elif any(
                        algorithm in SECURE_ENCRYPTION_ALGORITHMS
                        for algorithm in account.file_service_properties.smb_protocol_settings.channel_encryption
                    ):
                        report.status = "PASS"
                        report.status_extended = f"Storage account {account.name} from subscription {subscription} has a secure algorithm for SMB channel encryption ({', '.join(SECURE_ENCRYPTION_ALGORITHMS)}) enabled for file shares since it supports {pretty_current_algorithms}."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"Storage account {account.name} from subscription {subscription} does not have SMB channel encryption with a secure algorithm for file shares since it supports {pretty_current_algorithms}."

                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_smb_protocol_version_is_latest.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_smb_protocol_version_is_latest/storage_smb_protocol_version_is_latest.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "storage_smb_protocol_version_is_latest",
  "CheckTitle": "Ensure SMB protocol version for file shares is set to the latest version.",
  "CheckType": [],
  "ServiceName": "storage",
  "SubServiceName": "",
  "ResourceIdTemplate": "/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/fileServices/default",
  "Severity": "medium",
  "ResourceType": "AzureStorageAccount",
  "Description": "Ensure that SMB file shares are configured to use only the latest SMB protocol version.",
  "Risk": "Allowing older SMB protocol versions may expose file shares to known vulnerabilities and security risks.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/storage/files/files-smb-protocol#smb-security-settings",
  "Remediation": {
    "Code": {
      "CLI": "az storage account file-service-properties update --resource-group <resource-group> --account-name <storage-account> --versions <latest-version>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure your Azure Storage Account file shares to allow only the latest SMB protocol version.",
      "Url": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/StorageAccounts/latest-smb-protocol-version.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: storage_smb_protocol_version_is_latest.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_smb_protocol_version_is_latest/storage_smb_protocol_version_is_latest.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.storage.lib.constants import LATEST_SMB_VERSION
from prowler.providers.azure.services.storage.storage_client import storage_client


class storage_smb_protocol_version_is_latest(Check):
    """
    Ensure SMB protocol version for file shares is set to the latest version.

    This check evaluates whether SMB file shares are configured to use only the latest SMB protocol version.
    - PASS: Storage account allows only the latest SMB protocol version for file shares.
    - FAIL: Storage account allows other SMB protocol versions for file shares.
    """

    def execute(self) -> list[Check_Report_Azure]:
        findings = []

        for subscription, storage_accounts in storage_client.storage_accounts.items():
            for account in storage_accounts:
                if getattr(account, "file_service_properties", None) and getattr(
                    account.file_service_properties.smb_protocol_settings,
                    "supported_versions",
                    None,
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(),
                        resource=account.file_service_properties,
                    )
                    report.subscription = subscription
                    report.resource_name = account.name
                    report.location = account.location
                    if (
                        len(
                            account.file_service_properties.smb_protocol_settings.supported_versions
                        )
                        == 1
                        and account.file_service_properties.smb_protocol_settings.supported_versions[
                            0
                        ]
                        == LATEST_SMB_VERSION
                    ):
                        report.status = "PASS"
                        report.status_extended = f"Storage account {account.name} from subscription {subscription} allows only the latest SMB protocol version ({LATEST_SMB_VERSION}) for file shares."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"Storage account {account.name} from subscription {subscription} allows SMB protocol versions: {', '.join(account.file_service_properties.smb_protocol_settings.supported_versions) if account.file_service_properties.smb_protocol_settings.supported_versions else 'None'}. Only the latest SMB protocol version ({LATEST_SMB_VERSION}) should be allowed."
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_client.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_client.py

```python
from prowler.providers.azure.services.vm.vm_service import VirtualMachines
from prowler.providers.common.provider import Provider

vm_client = VirtualMachines(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
