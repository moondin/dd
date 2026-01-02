---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 339
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 339 of 867)

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

---[FILE: entra_user_with_vm_access_has_mfa.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_user_with_vm_access_has_mfa/entra_user_with_vm_access_has_mfa.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.config import (
    CONTRIBUTOR_ROLE_ID,
    OWNER_ROLE_ID,
    VIRTUAL_MACHINE_ADMINISTRATOR_LOGIN_ROLE_ID,
    VIRTUAL_MACHINE_CONTRIBUTOR_ROLE_ID,
    VIRTUAL_MACHINE_LOCAL_USER_LOGIN_ROLE_ID,
    VIRTUAL_MACHINE_USER_LOGIN_ROLE_ID,
    WINDOWS_ADMIN_CENTER_ADMINISTRATOR_LOGIN_ROLE_ID,
)
from prowler.providers.azure.services.entra.entra_client import entra_client
from prowler.providers.azure.services.iam.iam_client import iam_client


class entra_user_with_vm_access_has_mfa(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for users in entra_client.users.values():
            for user in users.values():
                for (
                    subscription_name,
                    role_assigns,
                ) in iam_client.role_assignments.items():
                    for assignment in role_assigns.values():
                        if (
                            assignment.agent_type == "User"
                            and assignment.role_id
                            in [
                                CONTRIBUTOR_ROLE_ID,
                                OWNER_ROLE_ID,
                                VIRTUAL_MACHINE_CONTRIBUTOR_ROLE_ID,
                                VIRTUAL_MACHINE_ADMINISTRATOR_LOGIN_ROLE_ID,
                                VIRTUAL_MACHINE_USER_LOGIN_ROLE_ID,
                                VIRTUAL_MACHINE_LOCAL_USER_LOGIN_ROLE_ID,
                                WINDOWS_ADMIN_CENTER_ADMINISTRATOR_LOGIN_ROLE_ID,
                            ]
                            and assignment.agent_id == user.id
                        ):
                            report = Check_Report_Azure(
                                metadata=self.metadata(), resource=user
                            )
                            report.subscription = subscription_name
                            report.status = "FAIL"
                            report.status_extended = f"User {user.name} without MFA can access VMs in subscription {subscription_name}"
                            if len(user.authentication_methods) > 1:
                                report.status = "PASS"
                                report.status_extended = f"User {user.name} can access VMs in subscription {subscription_name} but it has MFA."

                            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: user_privileges.py]---
Location: prowler-master/prowler/providers/azure/services/entra/lib/user_privileges.py

```python
"""
This module contains functions with user privileges in Azure.
"""


def is_privileged_user(user, privileged_roles) -> bool:
    """
    Checks if a user is a privileged user.

    Args:
        user: An object representing the user to be checked.
        privileged_roles: A dictionary containing privileged roles.

    Returns:
        A boolean value indicating whether the user is a privileged user.
    """

    is_privileged = False

    for role in privileged_roles.values():
        if user in role.members:
            is_privileged = True
            break

    return is_privileged
```

--------------------------------------------------------------------------------

---[FILE: iam_client.py]---
Location: prowler-master/prowler/providers/azure/services/iam/iam_client.py

```python
from prowler.providers.azure.services.iam.iam_service import IAM
from prowler.providers.common.provider import Provider

iam_client = IAM(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: iam_service.py]---
Location: prowler-master/prowler/providers/azure/services/iam/iam_service.py

```python
from dataclasses import dataclass
from typing import List

from azure.mgmt.authorization import AuthorizationManagementClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class IAM(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(AuthorizationManagementClient, provider)
        self.roles, self.custom_roles = self._get_roles()
        self.role_assignments = self._get_role_assignments()

    def _get_roles(self):
        logger.info("IAM - Getting roles...")
        builtin_roles = {}
        custom_roles = {}
        for subscription, client in self.clients.items():
            try:
                builtin_roles.update({subscription: {}})
                custom_roles.update({subscription: {}})
                all_roles = client.role_definitions.list(
                    scope=f"/subscriptions/{self.subscriptions[subscription]}",
                )
                for role in all_roles:
                    if role.role_type == "CustomRole":
                        custom_roles[subscription][role.id] = Role(
                            id=role.id,
                            name=role.role_name,
                            type=role.role_type,
                            assignable_scopes=role.assignable_scopes,
                            permissions=[
                                Permission(
                                    condition=getattr(permission, "condition", ""),
                                    condition_version=getattr(
                                        permission, "condition_version", ""
                                    ),
                                    actions=getattr(permission, "actions", []),
                                )
                                for permission in getattr(role, "permissions", [])
                            ],
                        )
                    else:
                        builtin_roles[subscription][role.id] = Role(
                            id=role.id,
                            name=role.role_name,
                            type=role.role_type,
                            assignable_scopes=role.assignable_scopes,
                            permissions=role.permissions,
                        )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return builtin_roles, custom_roles

    def _get_role_assignments(self):
        logger.info("IAM - Getting role assignments...")
        role_assignments = {}
        for subscription, client in self.clients.items():
            try:
                role_assignments.update({subscription: {}})
                all_role_assignments = client.role_assignments.list_for_subscription(
                    filter="atScope()"
                )
                for role_assignment in all_role_assignments:
                    role_assignments[subscription].update(
                        {
                            role_assignment.id: RoleAssignment(
                                id=role_assignment.id,
                                name=role_assignment.name,
                                scope=role_assignment.scope,
                                agent_id=role_assignment.principal_id,
                                agent_type=role_assignment.principal_type,
                                role_id=role_assignment.role_definition_id.split("/")[
                                    -1
                                ],
                            )
                        }
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return role_assignments


@dataclass
class Permission:
    actions: List[str]
    condition: str
    condition_version: str


@dataclass
class Role:
    id: str
    name: str
    type: str
    assignable_scopes: List[str]
    permissions: List[Permission]


@dataclass
class RoleAssignment:
    """
    Represents an Azure Role Assignment.

    Attributes:
        id: The unique identifier of the role assignment.
        name: The name of the role assignment.
        scope: The scope at which the role assignment applies.
        agent_id: The principal (user, group, service principal, etc.) ID assigned the role.
        agent_type: The type of the principal. Known values: "User", "Group", "ServicePrincipal", "ForeignGroup", and "Device".
        role_id: The ID of the role definition assigned.
    """

    id: str
    name: str
    scope: str
    agent_id: str
    agent_type: str
    role_id: str
```

--------------------------------------------------------------------------------

---[FILE: iam_custom_role_has_permissions_to_administer_resource_locks.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/iam/iam_custom_role_has_permissions_to_administer_resource_locks/iam_custom_role_has_permissions_to_administer_resource_locks.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "iam_custom_role_has_permissions_to_administer_resource_locks",
  "CheckTitle": "Ensure an IAM custom role has permissions to administer resource locks",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureRole",
  "Description": "Ensure a Custom Role is Assigned Permissions for Administering Resource Locks",
  "Risk": "In Azure, resource locks are a way to prevent accidental deletion or modification of critical resources. These locks can be set at the resource group level or the individual resource level. Resource locks administration is a critical task that should be preformed from a custom role with the appropriate permissions. This ensures that only authorized users can administer resource locks.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources?tabs=json",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/AccessControl/resource-lock-custom-role.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Resouce locks are needed to prevent accidental deletion or modification of critical Azure resources. The administration of resource locks should be performed from a custom role with the appropriate permissions.",
      "Url": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/AccessControl/resource-lock-custom-role.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_custom_role_has_permissions_to_administer_resource_locks.py]---
Location: prowler-master/prowler/providers/azure/services/iam/iam_custom_role_has_permissions_to_administer_resource_locks/iam_custom_role_has_permissions_to_administer_resource_locks.py

```python
from re import search

from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.iam.iam_client import iam_client


class iam_custom_role_has_permissions_to_administer_resource_locks(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, roles in iam_client.custom_roles.items():
            exits_role_with_permission_over_locks = False

            for custom_role in roles.values():
                if exits_role_with_permission_over_locks:
                    break
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=custom_role
                )
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Role {custom_role.name} from subscription {subscription} has no permission to administer resource locks."

                for permission_item in custom_role.permissions:
                    if exits_role_with_permission_over_locks:
                        break
                    for action in permission_item.actions:
                        if search("^Microsoft.Authorization/locks/.*", action):
                            report.status = "PASS"
                            report.status_extended = f"Role {custom_role.name} from subscription {subscription} has permission to administer resource locks."
                            exits_role_with_permission_over_locks = True
                            break
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_role_user_access_admin_restricted.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/iam/iam_role_user_access_admin_restricted/iam_role_user_access_admin_restricted.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "iam_role_user_access_admin_restricted",
  "CheckTitle": "Ensure 'User Access Administrator' role is restricted",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureIAMRoleassignment",
  "Description": "Checks for active assignments of the highly privileged 'User Access Administrator' role in Azure subscriptions.",
  "Risk": "Persistent assignment of this role can lead to privilege escalation and unauthorized access, increasing the risk of security breaches.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/privileged#user-access-administrator",
  "Remediation": {
    "Code": {
      "CLI": "az role assignment delete --role 'User Access Administrator' --scope '/subscriptions/<subscription_id>'",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Remove 'User Access Administrator' role assignments immediately after use to minimize security risks.",
      "Url": "https://learn.microsoft.com/en-us/azure/role-based-access-control/elevate-access-global-admin?tabs=azure-portal%2Centra-audit-logs"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_role_user_access_admin_restricted.py]---
Location: prowler-master/prowler/providers/azure/services/iam/iam_role_user_access_admin_restricted/iam_role_user_access_admin_restricted.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.iam.iam_client import iam_client


class iam_role_user_access_admin_restricted(Check):
    def execute(self):
        findings = []

        for subscription_name, assignments in iam_client.role_assignments.items():
            for assignment in assignments.values():
                role_assignment_name = getattr(
                    iam_client.roles[subscription_name].get(
                        f"/subscriptions/{iam_client.subscriptions[subscription_name]}/providers/Microsoft.Authorization/roleDefinitions/{assignment.role_id}"
                    ),
                    "name",
                    "",
                )
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=assignment
                )
                report.subscription = subscription_name
                if role_assignment_name == "User Access Administrator":
                    report.status = "FAIL"
                    report.status_extended = f"Role assignment {assignment.name} in subscription {subscription_name} grants User Access Administrator role to {getattr(assignment, 'agent_type', '')} {getattr(assignment, 'agent_id', '')}."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Role assignment {assignment.name} in subscription {subscription_name} does not grant User Access Administrator role."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_subscription_roles_owner_custom_not_created.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/iam/iam_subscription_roles_owner_custom_not_created/iam_subscription_roles_owner_custom_not_created.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "iam_subscription_roles_owner_custom_not_created",
  "CheckTitle": "Ensure that no custom subscription owner roles are created",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureRole",
  "Description": "Ensure that no custom subscription owner roles are created",
  "Risk": "Subscription ownership should not include permission to create custom owner roles. The principle of least privilege should be followed and only necessary privileges should be assigned instead of allowing full administrative access.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/AccessControl/remove-custom-owner-roles.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Custom subscription owner roles should not be created. This is because the principle of least privilege should be followed and only necessary privileges should be assigned instead of allowing full administrative access",
      "Url": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/AccessControl/remove-custom-owner-roles.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_subscription_roles_owner_custom_not_created.py]---
Location: prowler-master/prowler/providers/azure/services/iam/iam_subscription_roles_owner_custom_not_created/iam_subscription_roles_owner_custom_not_created.py

```python
from re import search

from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.iam.iam_client import iam_client


class iam_subscription_roles_owner_custom_not_created(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, roles in iam_client.custom_roles.items():
            for custom_role in roles.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=custom_role
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Role {custom_role.name} from subscription {subscription} is not a custom owner role."
                for scope in custom_role.assignable_scopes:
                    if search("^/.*", scope):
                        for permission_item in custom_role.permissions:
                            for action in permission_item.actions:
                                if action == "*":
                                    report.status = "FAIL"
                                    report.status_extended = f"Role {custom_role.name} from subscription {subscription} is a custom owner role."
                                    break

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: keyvault_client.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_client.py

```python
from prowler.providers.azure.services.keyvault.keyvault_service import KeyVault
from prowler.providers.common.provider import Provider

keyvault_client = KeyVault(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: keyvault_service.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_service.py

```python
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional, Union

from azure.core.exceptions import HttpResponseError
from azure.keyvault.keys import KeyClient
from azure.mgmt.keyvault import KeyVaultManagementClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService
from prowler.providers.azure.services.monitor.monitor_client import monitor_client
from prowler.providers.azure.services.monitor.monitor_service import DiagnosticSetting


class KeyVault(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(KeyVaultManagementClient, provider)
        # TODO: review this credentials assignment
        self.key_vaults = self._get_key_vaults(provider)

    def _get_key_vaults(self, provider):
        logger.info("KeyVault - Getting key_vaults...")
        key_vaults = {}
        for subscription, client in self.clients.items():
            try:
                key_vaults.update({subscription: []})
                key_vaults_list = client.vaults.list()
                for keyvault in key_vaults_list:
                    resource_group = keyvault.id.split("/")[4]
                    keyvault_name = keyvault.name
                    keyvault_properties = client.vaults.get(
                        resource_group, keyvault_name
                    ).properties
                    keys = self._get_keys(
                        subscription, resource_group, keyvault_name, provider
                    )
                    secrets = self._get_secrets(
                        subscription, resource_group, keyvault_name
                    )
                    key_vaults[subscription].append(
                        KeyVaultInfo(
                            id=getattr(keyvault, "id", ""),
                            name=getattr(keyvault, "name", ""),
                            location=getattr(keyvault, "location", ""),
                            resource_group=resource_group,
                            properties=VaultProperties(
                                tenant_id=getattr(keyvault_properties, "tenant_id", ""),
                                enable_rbac_authorization=getattr(
                                    keyvault_properties,
                                    "enable_rbac_authorization",
                                    False,
                                ),
                                private_endpoint_connections=[
                                    PrivateEndpointConnection(id=conn.id)
                                    for conn in (
                                        getattr(
                                            keyvault_properties,
                                            "private_endpoint_connections",
                                            [],
                                        )
                                        or []
                                    )
                                ],
                                enable_soft_delete=getattr(
                                    keyvault_properties, "enable_soft_delete", False
                                ),
                                enable_purge_protection=getattr(
                                    keyvault_properties,
                                    "enable_purge_protection",
                                    False,
                                ),
                                public_network_access_disabled=(
                                    getattr(
                                        keyvault_properties,
                                        "public_network_access",
                                        "Enabled",
                                    )
                                    == "Disabled"
                                ),
                            ),
                            keys=keys,
                            secrets=secrets,
                            monitor_diagnostic_settings=self._get_vault_monitor_settings(
                                keyvault_name, resource_group, subscription
                            ),
                        )
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return key_vaults

    def _get_keys(self, subscription, resource_group, keyvault_name, provider):
        logger.info(f"KeyVault - Getting keys for {keyvault_name}...")
        keys = []
        try:
            client = self.clients[subscription]
            keys_list = client.keys.list(resource_group, keyvault_name)
            for key in keys_list:
                keys.append(
                    Key(
                        id=getattr(key, "id", ""),
                        name=getattr(key, "name", ""),
                        enabled=getattr(key.attributes, "enabled", False),
                        location=getattr(key, "location", ""),
                        attributes=KeyAttributes(
                            enabled=getattr(key.attributes, "enabled", False),
                            created=getattr(key.attributes, "created", 0),
                            updated=getattr(key.attributes, "updated", 0),
                            expires=getattr(key.attributes, "expires", 0),
                        ),
                    )
                )
        except Exception as error:
            logger.error(
                f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        try:
            key_client = KeyClient(
                vault_url=f"https://{keyvault_name}.vault.azure.net/",
                # TODO: review the following line
                credential=provider.session,
            )
            properties = key_client.list_properties_of_keys()
            for prop in properties:
                policy = key_client.get_key_rotation_policy(prop.name)
                for key in keys:
                    if key.name == prop.name:
                        key.rotation_policy = KeyRotationPolicy(
                            id=getattr(policy, "id", ""),
                            lifetime_actions=[
                                KeyRotationLifetimeAction(action=action.action)
                                for action in getattr(policy, "lifetime_actions", [])
                            ],
                        )

        # TODO: handle different errors here since we are catching all HTTP Errors here
        except HttpResponseError:
            logger.warning(
                f"Subscription name: {subscription} -- has no access policy configured for keyvault {keyvault_name}"
            )
        return keys

    def _get_secrets(self, subscription, resource_group, keyvault_name):
        logger.info(f"KeyVault - Getting secrets for {keyvault_name}...")
        secrets = []
        try:
            client = self.clients[subscription]
            secrets_list = client.secrets.list(resource_group, keyvault_name)
            for secret in secrets_list:
                secrets.append(
                    Secret(
                        id=getattr(secret, "id", ""),
                        name=getattr(secret, "name", ""),
                        enabled=getattr(secret.properties.attributes, "enabled", False),
                        location=getattr(secret, "location", ""),
                        attributes=SecretAttributes(
                            enabled=getattr(
                                secret.properties.attributes, "enabled", False
                            ),
                            created=getattr(
                                secret.properties.attributes, "created", None
                            ),
                            updated=getattr(
                                secret.properties.attributes, "updated", None
                            ),
                            expires=getattr(
                                secret.properties.attributes, "expires", None
                            ),
                        ),
                    )
                )
        except Exception as error:
            logger.error(
                f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return secrets

    def _get_vault_monitor_settings(self, keyvault_name, resource_group, subscription):
        logger.info(
            f"KeyVault - Getting monitor diagnostics settings for {keyvault_name}..."
        )
        monitor_diagnostics_settings = []
        try:
            monitor_diagnostics_settings = monitor_client.diagnostic_settings_with_uri(
                self.subscriptions[subscription],
                f"subscriptions/{self.subscriptions[subscription]}/resourceGroups/{resource_group}/providers/Microsoft.KeyVault/vaults/{keyvault_name}",
                monitor_client.clients[subscription],
            )
        except Exception as error:
            logger.error(
                f"Subscription name: {self.subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return monitor_diagnostics_settings


@dataclass
class KeyAttributes:
    enabled: bool
    created: int
    updated: int
    expires: int


@dataclass
class KeyRotationLifetimeAction:
    action: str


@dataclass
class KeyRotationPolicy:
    id: str
    lifetime_actions: list[KeyRotationLifetimeAction]


@dataclass
class Key:
    id: str
    name: str
    enabled: bool
    location: str
    attributes: KeyAttributes
    rotation_policy: Optional[KeyRotationPolicy] = None


@dataclass
class SecretAttributes:
    enabled: bool
    created: Union[datetime, None]
    updated: Union[datetime, None]
    expires: Union[datetime, None]


@dataclass
class Secret:
    id: str
    name: str
    enabled: bool
    location: str
    attributes: SecretAttributes


@dataclass
class PrivateEndpointConnection:
    id: str


@dataclass
class VaultProperties:
    tenant_id: str
    enable_rbac_authorization: bool
    private_endpoint_connections: List[PrivateEndpointConnection]
    enable_soft_delete: bool
    enable_purge_protection: bool
    public_network_access_disabled: bool = False


@dataclass
class KeyVaultInfo:
    id: str
    name: str
    location: str
    resource_group: str
    properties: VaultProperties
    keys: list[Key] = None
    secrets: list[Secret] = None
    monitor_diagnostic_settings: list[DiagnosticSetting] = None
```

--------------------------------------------------------------------------------

---[FILE: keyvault_access_only_through_private_endpoints.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_access_only_through_private_endpoints/keyvault_access_only_through_private_endpoints.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "keyvault_access_only_through_private_endpoints",
  "CheckTitle": "Ensure that public network access when using private endpoint is disabled.",
  "CheckType": [],
  "ServiceName": "keyvault",
  "SubServiceName": "",
  "ResourceIdTemplate": "/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.KeyVault/vaults/{vault_name}",
  "Severity": "high",
  "ResourceType": "KeyVault",
  "Description": "Checks if Key Vaults with private endpoints have public network access disabled.",
  "Risk": "Allowing public network access to Key Vault when using private endpoint can expose sensitive data to unauthorized access.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/key-vault/general/network-security",
  "Remediation": {
    "Code": {
      "CLI": "az keyvault update --resource-group <resource_group> --name <vault_name> --public-network-access disabled",
      "NativeIaC": "{\n  \"type\": \"Microsoft.KeyVault/vaults\",\n  \"apiVersion\": \"2022-07-01\",\n  \"properties\": {\n    \"publicNetworkAccess\": \"disabled\"\n  }\n}",
      "Terraform": "resource \"azurerm_key_vault\" \"example\" {\n  # ... other configuration ...\n\n  public_network_access_enabled = false\n}",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/KeyVault/use-private-endpoints.html"
    },
    "Recommendation": {
      "Text": "Disable public network access for Key Vaults that use private endpoint to ensure network traffic only flows through the private endpoint.",
      "Url": "https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: keyvault_access_only_through_private_endpoints.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_access_only_through_private_endpoints/keyvault_access_only_through_private_endpoints.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.keyvault.keyvault_client import keyvault_client


class keyvault_access_only_through_private_endpoints(Check):
    """
    Ensure that Public Network Access when using Private Endpoint is disabled.

    This check evaluates whether Azure Key Vaults with private endpoints configured have
    public network access disabled. Disabling public network access enhances security by
    isolating the Key Vault from the public internet, thereby reducing its exposure.

    - PASS: The Key Vault has private endpoints and public network access is disabled.
    - FAIL: The Key Vault has private endpoints and public network access is enabled.
    """

    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, key_vaults in keyvault_client.key_vaults.items():
            for keyvault in key_vaults:
                if (
                    keyvault.properties
                    and keyvault.properties.private_endpoint_connections
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=keyvault
                    )
                    report.subscription = subscription

                    if keyvault.properties.public_network_access_disabled:
                        report.status = "PASS"
                        report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} has public network access disabled and is using private endpoints."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"Keyvault {keyvault.name} from subscription {subscription} has public network access enabled while using private endpoints."
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: keyvault_key_expiration_set_in_non_rbac.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_key_expiration_set_in_non_rbac/keyvault_key_expiration_set_in_non_rbac.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "keyvault_key_expiration_set_in_non_rbac",
  "CheckTitle": "Ensure that the Expiration Date is set for all Keys in Non-RBAC Key Vaults.",
  "CheckType": [],
  "ServiceName": "keyvault",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KeyVault",
  "Description": "Ensure that all Keys in Non Role Based Access Control (RBAC) Azure Key Vaults have an expiration date set.",
  "Risk": "Azure Key Vault enables users to store and use cryptographic keys within the Microsoft Azure environment. The exp (expiration date) attribute identifies the expiration date on or after which the key MUST NOT be used for a cryptographic operation. By default, keys never expire. It is thus recommended that keys be rotated in the key vault and set an explicit expiration date for all keys. This ensures that the keys cannot be used beyond their assigned lifetimes.",
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

---[FILE: keyvault_key_expiration_set_in_non_rbac.py]---
Location: prowler-master/prowler/providers/azure/services/keyvault/keyvault_key_expiration_set_in_non_rbac/keyvault_key_expiration_set_in_non_rbac.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.keyvault.keyvault_client import keyvault_client


class keyvault_key_expiration_set_in_non_rbac(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, key_vaults in keyvault_client.key_vaults.items():
            for keyvault in key_vaults:
                if not keyvault.properties.enable_rbac_authorization and keyvault.keys:
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

````
