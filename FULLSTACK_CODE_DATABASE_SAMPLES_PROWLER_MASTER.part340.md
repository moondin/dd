---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 340
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 340 of 867)

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

---[FILE: keyvault_key_rotation_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_key_rotation_enabled/keyvault_key_rotation_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "keyvault_key_rotation_enabled",
  "CheckTitle": "Ensure Automatic Key Rotation is Enabled Within Azure Key Vault for the Supported Services",
  "CheckType": [],
  "ServiceName": "keyvault",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KeyVault",
  "Description": "Automatic Key Rotation is available in Public Preview. The currently supported applications are Key Vault, Managed Disks, and Storage accounts accessing keys within Key Vault. The number of supported applications will incrementally increased.",
  "Risk": "Once set up, Automatic Private Key Rotation removes the need for manual administration when keys expire at intervals determined by your organization's policy. The recommended key lifetime is 2 years. Your organization should determine its own key expiration policy.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/key-vault/keys/how-to-configure-key-rotation",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Note: Azure CLI and Powershell use ISO8601 flags to input timespans. Every timespan input will be in the format P<timespanInISO8601Format>(Y,M,D). The leading P is required with it denoting period. The (Y,M,D) are for the duration of Year, Month,and Day respectively. A time frame of 2 years, 2 months, 2 days would be (P2Y2M2D). From Azure Portal 1. From Azure Portal select the Portal Menu in the top left. 2. Select Key Vaults. 3. Select a Key Vault to audit. 4. Under Objects select Keys. 5. Select a key to audit. 6. In the top row select Rotation policy. 7. Select an Expiry time. 8. Set Enable auto rotation to Enabled. 9. Set an appropriate Rotation option and Rotation time. 10. Optionally set the Notification time. 11. Select Save. 12. Repeat steps 3-11 for each Key Vault and Key. From PowerShell Run the following command for each key to update its policy: Set-AzKeyVaultKeyRotationPolicy -VaultName test-kv -Name test-key -PolicyPath rotation_policy.json",
      "Url": "https://docs.microsoft.com/en-us/azure/storage/common/customer-managed-keys-overview#update-the-key-version"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "There are an additional costs per operation in running the needed applications."
}
```

--------------------------------------------------------------------------------

---[FILE: keyvault_key_rotation_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_key_rotation_enabled/keyvault_key_rotation_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.keyvault.keyvault_client import keyvault_client


class keyvault_key_rotation_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, key_vaults in keyvault_client.key_vaults.items():
            for keyvault in key_vaults:
                if keyvault.keys:
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=keyvault
                    )
                    report.subscription = subscription
                    for key in keyvault.keys:
                        if (
                            key.rotation_policy
                            and key.rotation_policy.lifetime_actions
                            and key.rotation_policy.lifetime_actions[0].action
                            == "Rotate"
                        ):
                            report.status = "PASS"
                            report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} has the key {key.name} with rotation policy set."
                        else:
                            report.status = "FAIL"
                            report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} has the key {key.name} without rotation policy set."

                        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: keyvault_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_logging_enabled/keyvault_logging_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "keyvault_logging_enabled",
  "CheckTitle": "Ensure that logging for Azure Key Vault is 'Enabled'",
  "CheckType": [],
  "ServiceName": "keyvault",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KeyVault",
  "Description": "Enable AuditEvent logging for key vault instances to ensure interactions with key vaults are logged and available.",
  "Risk": "Monitoring how and when key vaults are accessed, and by whom, enables an audit trail of interactions with confidential information, keys, and certificates managed by Azure Keyvault. Enabling logging for Key Vault saves information in an Azure storage account which the user provides. This creates a new container named insights-logs-auditevent automatically for the specified storage account. This same storage account can be used for collecting logs for multiple key vaults.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/key-vault/key-vault-logging",
  "Remediation": {
    "Code": {
      "CLI": "az monitor diagnostic-settings create --name <diagnostic settings name> --resource <key vault resource ID> --logs'[{category:AuditEvents,enabled:true,retention-policy:{enabled:true,days:180}}]' --metrics'[{category:AllMetrics,enabled:true,retention-policy:{enabled:true,days:180}}]' <[--event-hub <event hub ID> --event-hub-rule <event hub auth rule ID> | --storage-account <storage account ID> |--workspace <log analytics workspace ID> | --marketplace-partner-id <full resource ID of third-party solution>]>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/KeyVault/enable-audit-event-logging-for-azure-key-vaults.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Go to Key vaults 2. For each Key vault 3. Go to Diagnostic settings 4. Click on Edit Settings 5. Ensure that Archive to a storage account is Enabled 6. Ensure that AuditEvent is checked, and the retention days is set to 180 days or as appropriate",
      "Url": "https://docs.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-data-protection#dp-8-ensure-security-of-key-and-certificate-repository"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, Diagnostic AuditEvent logging is not enabled for Key Vault instances."
}
```

--------------------------------------------------------------------------------

---[FILE: keyvault_logging_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_logging_enabled/keyvault_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.keyvault.keyvault_client import keyvault_client


class keyvault_logging_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, key_vaults in keyvault_client.key_vaults.items():
            for keyvault in key_vaults:
                report = Check_Report_Azure(metadata=self.metadata(), resource=keyvault)
                report.subscription = subscription_name
                if not keyvault.monitor_diagnostic_settings:
                    report.status = "FAIL"
                    report.status_extended = f"There are no diagnostic settings capturing audit logs for Key Vault {keyvault.name} in subscription {subscription_name}."
                    findings.append(report)
                else:
                    for diagnostic_setting in keyvault.monitor_diagnostic_settings:
                        report.resource_name = diagnostic_setting.name
                        report.resource_id = diagnostic_setting.id
                        report.location = keyvault.location
                        report.status = "FAIL"
                        report.status_extended = f"Diagnostic setting {diagnostic_setting.name} for Key Vault {keyvault.name} in subscription {subscription_name} does not have audit logging."
                        audit = False
                        allLogs = False
                        for log in diagnostic_setting.logs:
                            if log.category_group == "audit" and log.enabled:
                                audit = True
                            if log.category_group == "allLogs" and log.enabled:
                                allLogs = True
                            if audit and allLogs:
                                report.status = "PASS"
                                report.status_extended = f"Diagnostic setting {diagnostic_setting.name} for Key Vault {keyvault.name} in subscription {subscription_name} has audit logging."
                                break

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: keyvault_non_rbac_secret_expiration_set.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_non_rbac_secret_expiration_set/keyvault_non_rbac_secret_expiration_set.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "keyvault_non_rbac_secret_expiration_set",
  "CheckTitle": "Ensure that the Expiration Date is set for all Secrets in Non-RBAC Key Vaults",
  "CheckType": [],
  "ServiceName": "keyvault",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KeyVault",
  "Description": "Ensure that all Secrets in Non Role Based Access Control (RBAC) Azure Key Vaults have an expiration date set.",
  "Risk": "The Azure Key Vault enables users to store and keep secrets within the Microsoft Azure environment. Secrets in the Azure Key Vault are octet sequences with a maximum size of 25k bytes each. The exp (expiration date) attribute identifies the expiration date on or after which the secret MUST NOT be used. By default, secrets never expire. It is thus recommended to rotate secrets in the key vault and set an explicit expiration date for all secrets. This ensures that the secrets cannot be used beyond their assigned lifetimes.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/key-vault/key-vault-whatis",
  "Remediation": {
    "Code": {
      "CLI": "az keyvault secret set-attributes --name <secretName> --vault-name <vaultName> --expires Y-m-d'T'H:M:S'Z'",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-secrets-policies/set-an-expiration-date-on-all-secrets#terraform"
    },
    "Recommendation": {
      "Text": "From Azure Portal: 1. Go to Key vaults. 2. For each Key vault, click on Secrets. 3. In the main pane, ensure that the status of the secret is Enabled. 4. Set an appropriate Expiration date on all secrets. From Azure CLI: Update the Expiration date for the secret using the below command: az keyvault secret set-attributes --name <secretName> --vault-name <vaultName> --expires Y-m-d'T'H:M:S'Z' Note: To view the expiration date on all secrets in a Key Vault using Microsoft API, the List Key permission is required. To update the expiration date for the secrets: 1. Go to Key vault, click on Access policies. 2. Click on Create and add an access policy with the Update permission (in the Secret Permissions - Secret Management Operations section). From PowerShell: For each Key vault with the EnableRbacAuthorization setting set to False or empty, run the following command. Set-AzKeyVaultSecret -VaultName <Vault Name> -Name <Secret Name> -Expires <DateTime>",
      "Url": "https://docs.microsoft.com/en-us/rest/api/keyvault/about-keys--secrets-and-certificates#key-vault-secrets"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Secrets cannot be used beyond their assigned expiry date respectively. Secrets need to be rotated periodically wherever they are used."
}
```

--------------------------------------------------------------------------------

---[FILE: keyvault_non_rbac_secret_expiration_set.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_non_rbac_secret_expiration_set/keyvault_non_rbac_secret_expiration_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.keyvault.keyvault_client import keyvault_client


class keyvault_non_rbac_secret_expiration_set(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, key_vaults in keyvault_client.key_vaults.items():
            for keyvault in key_vaults:
                if (
                    not keyvault.properties.enable_rbac_authorization
                    and keyvault.secrets
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=keyvault
                    )
                    report.subscription = subscription
                    report.status = "PASS"
                    report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} has all the secrets with expiration date set."
                    has_secret_without_expiration = False
                    for secret in keyvault.secrets:
                        if not secret.attributes.expires and secret.enabled:
                            report.status = "FAIL"
                            report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} has the secret {secret.name} without expiration date set."
                            has_secret_without_expiration = True
                            findings.append(report)
                    if not has_secret_without_expiration:
                        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: keyvault_private_endpoints.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_private_endpoints/keyvault_private_endpoints.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "keyvault_private_endpoints",
  "CheckTitle": "Ensure that Private Endpoints are Used for Azure Key Vault",
  "CheckType": [],
  "ServiceName": "keyvault",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KeyVault",
  "Description": "Private endpoints will secure network traffic from Azure Key Vault to the resources requesting secrets and keys.",
  "Risk": "Private endpoints will keep network requests to Azure Key Vault limited to the endpoints attached to the resources that are whitelisted to communicate with each other. Assigning the Key Vault to a network without an endpoint will allow other resources on that network to view all traffic from the Key Vault to its destination. In spite of the complexity in configuration, this is recommended for high security secrets.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/private-link/private-endpoint-overview",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Please see the additional information about the requirements needed before starting this remediation procedure. From Azure Portal 1. From Azure Home open the Portal Menu in the top left. 2. Select Key Vaults. 3. Select a Key Vault to audit. 4. Select Networking in the left column. 5. Select Private endpoint connections from the top row. 6. Select + Create. 7. Select the subscription the Key Vault is within, and other desired configuration. 8. Select Next. 9. For resource type select Microsoft.KeyVault/vaults. 10. Select the Key Vault to associate the Private Endpoint with. 11. Select Next. 12. In the Virtual Networking field, select the network to assign the Endpoint. 13. Select other configuration options as desired, including an existing or new application security group. 14. Select Next. 15. Select the private DNS the Private Endpoints will use. 16. Select Next. 17. Optionally add Tags. 18. Select Next : Review + Create. 19. Review the information and select Create. Follow the Audit Procedure to determine if it has successfully applied. 20. Repeat steps 3-19 for each Key Vault. From Azure CLI 1. To create an endpoint, run the following command: az network private-endpoint create --resource-group <resourceGroup --vnet- name <vnetName> --subnet <subnetName> --name <PrivateEndpointName> -- private-connection-resource-id '/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<resourceGroup>/providers/Microsoft.KeyVault/vaults/<keyVa ultName>' --group-ids vault --connection-name <privateLinkConnectionName> -- location <azureRegion> --manual-request 2. To manually approve the endpoint request, run the following command: az keyvault private-endpoint-connection approve --resource-group <resourceGroup> --vault-name <keyVaultName> –name <privateLinkName> 4. Determine the Private Endpoint's IP address to connect the Key Vault to the Private DNS you have previously created: 5. Look for the property networkInterfaces then id, the value must be placed in the variable <privateEndpointNIC> within step 7. az network private-endpoint show -g <resourceGroupName> -n <privateEndpointName> 6. Look for the property networkInterfaces then id, the value must be placed on <privateEndpointNIC> in step 7. az network nic show --ids <privateEndpointName> 7. Create a Private DNS record within the DNS Zone you created for the Private Endpoint: az network private-dns record-set a add-record -g <resourcecGroupName> -z 'privatelink.vaultcore.azure.net' -n <keyVaultName> -a <privateEndpointNIC> 8. nslookup the private endpoint to determine if the DNS record is correct: nslookup <keyVaultName>.vault.azure.net nslookup <keyVaultName>.privatelink.vaultcore.azure.n",
      "Url": "https://docs.microsoft.com/en-us/azure/storage/common/storage-private-endpoints"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Incorrect or poorly-timed changing of network configuration could result in service interruption. There are also additional costs tiers for running a private endpoint perpetabyte or more of networking traffic."
}
```

--------------------------------------------------------------------------------

---[FILE: keyvault_private_endpoints.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_private_endpoints/keyvault_private_endpoints.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.keyvault.keyvault_client import keyvault_client


class keyvault_private_endpoints(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, key_vaults in keyvault_client.key_vaults.items():
            for keyvault in key_vaults:
                report = Check_Report_Azure(metadata=self.metadata(), resource=keyvault)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} is not using private endpoints."
                if (
                    keyvault.properties
                    and keyvault.properties.private_endpoint_connections
                ):
                    report.status = "PASS"
                    report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} is using private endpoints."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: keyvault_rbac_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_rbac_enabled/keyvault_rbac_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "keyvault_rbac_enabled",
  "CheckTitle": "Enable Role Based Access Control for Azure Key Vault",
  "CheckType": [],
  "ServiceName": "keyvault",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KeyVault",
  "Description": "WARNING: Role assignments disappear when a Key Vault has been deleted (soft-delete) and recovered. Afterwards it will be required to recreate all role assignments. This is a limitation of the soft-delete feature across all Azure services.",
  "Risk": "The new RBAC permissions model for Key Vaults enables a much finer grained access control for key vault secrets, keys, certificates, etc., than the vault access policy. This in turn will permit the use of privileged identity management over these roles, thus securing the key vaults with JIT Access management.",
  "RelatedUrl": "https://docs.microsoft.com/en-gb/azure/key-vault/general/rbac-migration#vault-access-policy-to-azure-rbac-migration-steps",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "From Azure Portal Key Vaults can be configured to use Azure role-based access control on creation. For existing Key Vaults: 1. From Azure Home open the Portal Menu in the top left corner 2. Select Key Vaults 3. Select a Key Vault to audit 4. Select Access configuration 5. Set the Permission model radio button to Azure role-based access control, taking note of the warning message 6. Click Save 7. Select Access Control (IAM) 8. Select the Role Assignments tab 9. Reapply permissions as needed to groups or users",
      "Url": "https://docs.microsoft.com/en-gb/azure/role-based-access-control/role-assignments-portal?tabs=current"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Implementation needs to be properly designed from the ground up, as this is a fundamental change to the way key vaults are accessed/managed. Changing permissions to key vaults will result in loss of service as permissions are re-applied. For the least amount of downtime, map your current groups and users to their corresponding permission needs."
}
```

--------------------------------------------------------------------------------

---[FILE: keyvault_rbac_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_rbac_enabled/keyvault_rbac_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.keyvault.keyvault_client import keyvault_client


class keyvault_rbac_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, key_vaults in keyvault_client.key_vaults.items():
            for keyvault in key_vaults:
                report = Check_Report_Azure(metadata=self.metadata(), resource=keyvault)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} is not using RBAC for access control."
                if (
                    keyvault.properties
                    and keyvault.properties.enable_rbac_authorization
                ):
                    report.status = "PASS"
                    report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} is using RBAC for access control."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: keyvault_rbac_key_expiration_set.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_rbac_key_expiration_set/keyvault_rbac_key_expiration_set.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "keyvault_rbac_key_expiration_set",
  "CheckTitle": "Ensure that the Expiration Date is set for all Keys in RBAC Key Vaults",
  "CheckType": [],
  "ServiceName": "keyvault",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KeyVault",
  "Description": "Ensure that all Keys in Role Based Access Control (RBAC) Azure Key Vaults have an expiration date set",
  "Risk": "Azure Key Vault enables users to store and use cryptographic keys within the Microsoft Azure environment. The exp (expiration date) attribute identifies the expiration date on or after which the key MUST NOT be used for encryption of new data, wrapping of new keys, and signing. By default, keys never expire. It is thus recommended that keys be rotated in the key vault and set an explicit expiration date for all keys to help enforce the key rotation. This ensures that the keys cannot be used beyond their assigned lifetimes.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/key-vault/key-vault-whatis",
  "Remediation": {
    "Code": {
      "CLI": "az keyvault key set-attributes --name <keyName> --vault-name <vaultName> --expires Y-m-d'T'H:M:S'Z'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/KeyVault/key-expiration-check.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/set-an-expiration-date-on-all-keys#terraform"
    },
    "Recommendation": {
      "Text": "From Azure Portal: 1. Go to Key vaults. 2. For each Key vault, click on Keys. 3. In the main pane, ensure that an appropriate Expiration date is set for any keys that are Enabled. From Azure CLI: Update the Expiration date for the key using the below command: az keyvault key set-attributes --name <keyName> --vault-name <vaultName> -- expires Y-m-d'T'H:M:S'Z' Note: To view the expiration date on all keys in a Key Vault using Microsoft API, the 'List' Key permission is required. To update the expiration date for the keys: 1. Go to the Key vault, click on Access Control (IAM). 2. Click on Add role assignment and assign the role of Key Vault Crypto Officer to the appropriate user. From PowerShell: Set-AzKeyVaultKeyAttribute -VaultName <VaultName> -Name <KeyName> -Expires <DateTime>",
      "Url": "https://docs.microsoft.com/en-us/rest/api/keyvault/about-keys--secrets-and-certificates#key-vault-keys"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Keys cannot be used beyond their assigned expiration dates respectively. Keys need to be rotated periodically wherever they are used."
}
```

--------------------------------------------------------------------------------

---[FILE: keyvault_rbac_key_expiration_set.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_rbac_key_expiration_set/keyvault_rbac_key_expiration_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.keyvault.keyvault_client import keyvault_client


class keyvault_rbac_key_expiration_set(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, key_vaults in keyvault_client.key_vaults.items():
            for keyvault in key_vaults:
                if keyvault.properties.enable_rbac_authorization and keyvault.keys:
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=keyvault
                    )
                    report.subscription = subscription
                    report.status = "PASS"
                    report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} has all the keys with expiration date set."
                    has_key_without_expiration = False
                    for key in keyvault.keys:
                        if not key.attributes.expires and key.enabled:
                            report.status = "FAIL"
                            report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} has the key {key.name} without expiration date set."
                            has_key_without_expiration = True
                            findings.append(report)
                    if not has_key_without_expiration:
                        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: keyvault_rbac_secret_expiration_set.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_rbac_secret_expiration_set/keyvault_rbac_secret_expiration_set.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "keyvault_rbac_secret_expiration_set",
  "CheckTitle": "Ensure that the Expiration Date is set for all Secrets in RBAC Key Vaults",
  "CheckType": [],
  "ServiceName": "keyvault",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KeyVault",
  "Description": "Ensure that all Secrets in Role Based Access Control (RBAC) Azure Key Vaults have an expiration date set.",
  "Risk": "The Azure Key Vault enables users to store and keep secrets within the Microsoft Azure environment. Secrets in the Azure Key Vault are octet sequences with a maximum size of 25k bytes each. The exp (expiration date) attribute identifies the expiration date on or after which the secret MUST NOT be used. By default, secrets never expire. It is thus recommended to rotate secrets in the key vault and set an explicit expiration date for all secrets. This ensures that the secrets cannot be used beyond their assigned lifetimes.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/key-vault/key-vault-whatis",
  "Remediation": {
    "Code": {
      "CLI": "az keyvault secret set-attributes --name <secretName> --vault-name <vaultName> --expires Y-m-d'T'H:M:S'Z'",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-secrets-policies/set-an-expiration-date-on-all-secrets#terraform"
    },
    "Recommendation": {
      "Text": "From Azure Portal: 1. Go to Key vaults. 2. For each Key vault, click on Secrets. 3. In the main pane, ensure that the status of the secret is Enabled. 4. For each enabled secret, ensure that an appropriate Expiration date is set. From Azure CLI: Update the Expiration date for the secret using the below command: az keyvault secret set-attributes --name <secretName> --vault-name <vaultName> --expires Y-m-d'T'H:M:S'Z' Note: To view the expiration date on all secrets in a Key Vault using Microsoft API, the List Key permission is required. To update the expiration date for the secrets: 1. Go to the Key vault, click on Access Control (IAM). 2. Click on Add role assignment and assign the role of Key Vault Secrets Officer to the appropriate user. From PowerShell: Set-AzKeyVaultSecretAttribute -VaultName <Vault Name> -Name <Secret Name> - Expires <DateTime>",
      "Url": "https://docs.microsoft.com/en-us/rest/api/keyvault/about-keys--secrets-and-certificates#key-vault-secrets"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Secrets cannot be used beyond their assigned expiry date respectively. Secrets need to be rotated periodically wherever they are used."
}
```

--------------------------------------------------------------------------------

---[FILE: keyvault_rbac_secret_expiration_set.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_rbac_secret_expiration_set/keyvault_rbac_secret_expiration_set.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.keyvault.keyvault_client import keyvault_client


class keyvault_rbac_secret_expiration_set(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, key_vaults in keyvault_client.key_vaults.items():
            for keyvault in key_vaults:
                if keyvault.properties.enable_rbac_authorization and keyvault.secrets:
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=keyvault
                    )
                    report.subscription = subscription
                    report.status = "PASS"
                    report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} has all the secrets with expiration date set."
                    has_secret_without_expiration = False
                    for secret in keyvault.secrets:
                        if not secret.attributes.expires and secret.enabled:
                            report.status = "FAIL"
                            report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} has the secret {secret.name} without expiration date set."
                            has_secret_without_expiration = True
                            findings.append(report)
                    if not has_secret_without_expiration:
                        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: keyvault_recoverable.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_recoverable/keyvault_recoverable.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "keyvault_recoverable",
  "CheckTitle": "Ensure the Key Vault is Recoverable",
  "CheckType": [],
  "ServiceName": "keyvault",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KeyVault",
  "Description": "The Key Vault contains object keys, secrets, and certificates. Accidental unavailability of a Key Vault can cause immediate data loss or loss of security functions (authentication, validation, verification, non-repudiation, etc.) supported by the Key Vault objects. It is recommended the Key Vault be made recoverable by enabling the 'Do Not Purge' and 'Soft Delete' functions. This is in order to prevent loss of encrypted data, including storage accounts, SQL databases, and/or dependent services provided by Key Vault objects (Keys, Secrets, Certificates) etc. This may happen in the case of accidental deletion by a user or from disruptive activity by a malicious user. WARNING: A current limitation of the soft-delete feature across all Azure services is role assignments disappearing when Key Vault is deleted. All role assignments will need to be recreated after recovery.",
  "Risk": "There could be scenarios where users accidentally run delete/purge commands on Key Vault or an attacker/malicious user deliberately does so in order to cause disruption. Deleting or purging a Key Vault leads to immediate data loss, as keys encrypting data and secrets/certificates allowing access/services will become non-accessible. There are 2 Key Vault properties that play a role in permanent unavailability of a Key Vault: 1. enableSoftDelete: Setting this parameter to 'true' for a Key Vault ensures that even if Key Vault is deleted, Key Vault itself or its objects remain recoverable for the next 90 days. Key Vault/objects can either be recovered or purged (permanent deletion) during those 90 days. If no action is taken, key vault and its objects will subsequently be purged. 2. enablePurgeProtection: enableSoftDelete only ensures that Key Vault is not deleted permanently and will be recoverable for 90 days from date of deletion. However, there are scenarios in which the Key Vault and/or its objects are accidentally purged and hence will not be recoverable. Setting enablePurgeProtection to 'true' ensures that the Key Vault and its objects cannot be purged. Enabling both the parameters on Key Vaults ensures that Key Vaults and their objects cannot be deleted/purged permanently.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/key-vault/key-vault-soft-delete-cli",
  "Remediation": {
    "Code": {
      "CLI": "az resource update --id /subscriptions/xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/<resourceGroupName>/providers/Microsoft.KeyVault/vaults/<keyVaultName> --set properties.enablePurgeProtection=trueproperties.enableSoftDelete=true",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/KeyVault/enable-key-vault-recoverability.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-the-key-vault-is-recoverable#terraform"
    },
    "Recommendation": {
      "Text": "To enable 'Do Not Purge' and 'Soft Delete' for a Key Vault: From Azure Portal 1. Go to Key Vaults 2. For each Key Vault 3. Click Properties 4. Ensure the status of soft-delete reads Soft delete has been enabled on this key vault. 5. At the bottom of the page, click 'Enable Purge Protection' Note, once enabled you cannot disable it. From Azure CLI az resource update --id /subscriptions/xxxxxx-xxxx-xxxx-xxxx- xxxxxxxxxxxx/resourceGroups/<resourceGroupName>/providers/Microsoft.KeyVault /vaults/<keyVaultName> --set properties.enablePurgeProtection=true properties.enableSoftDelete=true From PowerShell Update-AzKeyVault -VaultName <vaultName -ResourceGroupName <resourceGroupName -EnablePurgeProtection",
      "Url": "https://blogs.technet.microsoft.com/kv/2017/05/10/azure-key-vault-recovery-options/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Once purge-protection and soft-delete are enabled for a Key Vault, the action is irreversible."
}
```

--------------------------------------------------------------------------------

---[FILE: keyvault_recoverable.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_recoverable/keyvault_recoverable.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.keyvault.keyvault_client import keyvault_client


class keyvault_recoverable(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, key_vaults in keyvault_client.key_vaults.items():
            for keyvault in key_vaults:
                report = Check_Report_Azure(metadata=self.metadata(), resource=keyvault)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} is not recoverable."
                if (
                    keyvault.properties.enable_soft_delete
                    and keyvault.properties.enable_purge_protection
                ):
                    report.status = "PASS"
                    report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} is recoverable."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: loganalytics_client.py]---
Location: prowler-master/prowler/providers/azure/services/logs/loganalytics_client.py

```python
from prowler.providers.azure.services.logs.logs_service import LogAnalytics
from prowler.providers.common.provider import Provider

loganalytics_client = LogAnalytics(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: logsquery_client.py]---
Location: prowler-master/prowler/providers/azure/services/logs/logsquery_client.py

```python
from prowler.providers.azure.services.logs.logs_service import LogsQuery
from prowler.providers.common.provider import Provider

logsquery_client = LogsQuery(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: logs_service.py]---
Location: prowler-master/prowler/providers/azure/services/logs/logs_service.py

```python
from azure.mgmt.loganalytics import LogAnalyticsManagementClient
from azure.monitor.query import LogsQueryClient

from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class LogsQuery(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(LogsQueryClient, provider)


class LogAnalytics(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(LogAnalyticsManagementClient, provider)
```

--------------------------------------------------------------------------------

````
