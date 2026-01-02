---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 666
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 666 of 867)

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

---[FILE: keyvault_service_test.py]---
Location: prowler-master/tests/providers/azure/services/keyvault/keyvault_service_test.py

```python
from unittest import mock
from unittest.mock import MagicMock, patch

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)

# TODO: we have to fix this test not to use MagicMock but set the KeyVault service while mocking the import ot the Monitor client
# from prowler.providers.azure.services.keyvault.keyvault_service import (
#     DiagnosticSetting,
#     Key,
#     KeyVault,
#     KeyVaultInfo,
#     Secret,
# )
# def mock_keyvault_get_key_vaults(_, __):
#     keyvault_info = KeyVaultInfo(
#         id="id",
#         name="name",
#         location="location",
#         resource_group="resource_group",
#         properties=None,
#         keys=[
#             Key(
#                 id="id",
#                 name="name",
#                 enabled=True,
#                 location="location",
#                 attributes=None,
#                 rotation_policy=None,
#             )
#         ],
#         secrets=[
#             Secret(
#                 id="id",
#                 name="name",
#                 enabled=True,
#                 location="location",
#                 attributes=None,
#             )
#         ],
#         monitor_diagnostic_settings=[
#             DiagnosticSetting(
#                 id="id",
#                 storage_account_id="storage_account_id",
#                 logs=[
#                     mock.MagicMock(
#                         categoty_group="audit", category="None", enabled=True
#                     ),
#                     mock.MagicMock(
#                         categoty_group="allLogs", category="None", enabled=False
#                     ),
#                 ],
#                 name="name",
#                 storage_account_name="storage_account_name",
#             )
#         ],
#     )
#     return {AZURE_SUBSCRIPTION_ID: [keyvault_info]}


# @patch(
#     "prowler.providers.azure.services.keyvault.keyvault_service.KeyVault._get_key_vaults",
#     new=mock_keyvault_get_key_vaults,
# )
class Test_keyvault_service:
    def test_keyvault_service_(self):
        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            patch(
                "prowler.providers.azure.services.monitor.monitor_service.Monitor",
                new=MagicMock(),
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_service import (  # KeyVault,
                DiagnosticSetting,
                Key,
                KeyVaultInfo,
                Secret,
            )

            # keyvault = KeyVault(set_mocked_azure_provider())
            keyvault = MagicMock()

            keyvault.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id="id",
                        name="name",
                        location="location",
                        resource_group="resource_group",
                        properties=None,
                        keys=[
                            Key(
                                id="id",
                                name="name",
                                enabled=True,
                                location="location",
                                attributes=None,
                                rotation_policy=None,
                            )
                        ],
                        secrets=[
                            Secret(
                                id="id",
                                name="name",
                                enabled=True,
                                location="location",
                                attributes=None,
                            )
                        ],
                        monitor_diagnostic_settings=[
                            DiagnosticSetting(
                                id="id",
                                storage_account_id="storage_account_id",
                                logs=[
                                    mock.MagicMock(
                                        categoty_group="audit",
                                        category="None",
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        categoty_group="allLogs",
                                        category="None",
                                        enabled=False,
                                    ),
                                ],
                                name="name",
                                storage_account_name="storage_account_name",
                            )
                        ],
                    )
                ]
            }

            # assert (
            #     keyvault.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            #     == "KeyVaultManagementClient"
            # )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].__class__.__name__
                == "KeyVaultInfo"
            )
            assert keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].id == "id"
            assert keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].name == "name"
            assert keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].location == "location"
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].resource_group
                == "resource_group"
            )
            assert keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].properties is None

            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].keys[0].__class__.__name__
                == "Key"
            )
            assert keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].keys[0].id == "id"
            assert keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].keys[0].name == "name"
            assert keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].keys[0].enabled is True
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].keys[0].location
                == "location"
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].keys[0].attributes is None
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].keys[0].rotation_policy
                is None
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0]
                .secrets[0]
                .__class__.__name__
                == "Secret"
            )
            assert keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].secrets[0].id == "id"
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].secrets[0].name == "name"
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].secrets[0].enabled is True
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].secrets[0].location
                == "location"
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].secrets[0].attributes
                is None
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0].secrets[0].attributes
                is None
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0]
                .monitor_diagnostic_settings[0]
                .id
                == "id"
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0]
                .monitor_diagnostic_settings[0]
                .storage_account_id
                == "storage_account_id"
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0]
                .monitor_diagnostic_settings[0]
                .logs[0]
                .categoty_group
                == "audit"
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0]
                .monitor_diagnostic_settings[0]
                .logs[0]
                .category
                == "None"
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0]
                .monitor_diagnostic_settings[0]
                .logs[0]
                .enabled
                is True
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0]
                .monitor_diagnostic_settings[0]
                .logs[1]
                .categoty_group
                == "allLogs"
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0]
                .monitor_diagnostic_settings[0]
                .logs[1]
                .category
                == "None"
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0]
                .monitor_diagnostic_settings[0]
                .logs[1]
                .enabled
                is False
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0]
                .monitor_diagnostic_settings[0]
                .name
                == "name"
            )
            assert (
                keyvault.key_vaults[AZURE_SUBSCRIPTION_ID][0]
                .monitor_diagnostic_settings[0]
                .storage_account_name
                == "storage_account_name"
            )
```

--------------------------------------------------------------------------------

---[FILE: keyvault_access_only_through_private_endpoints_test.py]---
Location: prowler-master/tests/providers/azure/services/keyvault/keyvault_access_only_through_private_endpoints/keyvault_access_only_through_private_endpoints_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_keyvault_access_only_through_private_endpoints:
    def test_no_key_vaults(self):
        keyvault_client = mock.MagicMock
        keyvault_client.key_vaults = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_access_only_through_private_endpoints.keyvault_access_only_through_private_endpoints.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_access_only_through_private_endpoints.keyvault_access_only_through_private_endpoints import (
                keyvault_access_only_through_private_endpoints,
            )

            check = keyvault_access_only_through_private_endpoints()
            result = check.execute()
            assert len(result) == 0

    def test_key_vaults_no_private_endpoints(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_access_only_through_private_endpoints.keyvault_access_only_through_private_endpoints.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_access_only_through_private_endpoints.keyvault_access_only_through_private_endpoints import (
                keyvault_access_only_through_private_endpoints,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
                VaultProperties,
            )

            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id=keyvault_id,
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            enable_rbac_authorization=False,
                            private_endpoint_connections=[],
                            enable_soft_delete=True,
                            enable_purge_protection=True,
                            public_network_access_disabled=False,
                        ),
                    )
                ]
            }

            check = keyvault_access_only_through_private_endpoints()
            result = check.execute()
            assert len(result) == 0

    def test_key_vaults_with_private_endpoints_public_access_enabled(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_access_only_through_private_endpoints.keyvault_access_only_through_private_endpoints.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_access_only_through_private_endpoints.keyvault_access_only_through_private_endpoints import (
                keyvault_access_only_through_private_endpoints,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
                PrivateEndpointConnection,
                VaultProperties,
            )

            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id=keyvault_id,
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            enable_rbac_authorization=True,
                            private_endpoint_connections=[
                                PrivateEndpointConnection(id="id1")
                            ],
                            enable_soft_delete=True,
                            enable_purge_protection=True,
                            public_network_access_disabled=False,
                        ),
                    )
                ]
            }

            check = keyvault_access_only_through_private_endpoints()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has public network access enabled while using private endpoints."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"

    def test_key_vaults_with_private_endpoints_public_access_disabled(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_access_only_through_private_endpoints.keyvault_access_only_through_private_endpoints.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_access_only_through_private_endpoints.keyvault_access_only_through_private_endpoints import (
                keyvault_access_only_through_private_endpoints,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
                PrivateEndpointConnection,
                VaultProperties,
            )

            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id=keyvault_id,
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            enable_rbac_authorization=True,
                            private_endpoint_connections=[
                                PrivateEndpointConnection(id="id1")
                            ],
                            enable_soft_delete=True,
                            enable_purge_protection=True,
                            public_network_access_disabled=True,
                        ),
                    )
                ]
            }

            check = keyvault_access_only_through_private_endpoints()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has public network access disabled and is using private endpoints."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: keyvault_key_expiration_set_in_non_rbac_test.py]---
Location: prowler-master/tests/providers/azure/services/keyvault/keyvault_key_expiration_set_in_non_rbac/keyvault_key_expiration_set_in_non_rbac_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.keyvault.v2023_07_01.models import KeyAttributes, VaultProperties

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_keyvault_key_expiration_set_in_non_rbac:
    def test_no_key_vaults(self):
        keyvault_client = mock.MagicMock
        keyvault_client.key_vaults = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_key_expiration_set_in_non_rbac.keyvault_key_expiration_set_in_non_rbac.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_key_expiration_set_in_non_rbac.keyvault_key_expiration_set_in_non_rbac import (
                keyvault_key_expiration_set_in_non_rbac,
            )

            check = keyvault_key_expiration_set_in_non_rbac()
            result = check.execute()
            assert len(result) == 0

    def test_no_keys(self):
        keyvault_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_key_expiration_set_in_non_rbac.keyvault_key_expiration_set_in_non_rbac.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_key_expiration_set_in_non_rbac.keyvault_key_expiration_set_in_non_rbac import (
                keyvault_key_expiration_set_in_non_rbac,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
            )

            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id="id",
                        name="name",
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=False,
                        ),
                        keys=[],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_key_expiration_set_in_non_rbac()
            result = check.execute()
            assert len(result) == 0

    def test_key_vaults_invalid_keys(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())
        key_name = "Key Name"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_key_expiration_set_in_non_rbac.keyvault_key_expiration_set_in_non_rbac.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_key_expiration_set_in_non_rbac.keyvault_key_expiration_set_in_non_rbac import (
                keyvault_key_expiration_set_in_non_rbac,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                Key,
                KeyVaultInfo,
            )

            key = Key(
                id="id",
                name=key_name,
                enabled=True,
                location="westeurope",
                attributes=KeyAttributes(expires=None, enabled=True),
            )
            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id=keyvault_id,
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=False,
                        ),
                        keys=[key],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_key_expiration_set_in_non_rbac()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has the key {key_name} without expiration date set."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"

    def test_key_vaults_valid_keys(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_key_expiration_set_in_non_rbac.keyvault_key_expiration_set_in_non_rbac.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_key_expiration_set_in_non_rbac.keyvault_key_expiration_set_in_non_rbac import (
                keyvault_key_expiration_set_in_non_rbac,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                Key,
                KeyVaultInfo,
            )

            key = Key(
                id="id",
                name="name",
                enabled=True,
                location="westeurope",
                attributes=KeyAttributes(expires=49394, enabled=True),
            )
            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id=keyvault_id,
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=False,
                        ),
                        keys=[key],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_key_expiration_set_in_non_rbac()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has all the keys with expiration date set."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: keyvault_key_rotation_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/keyvault/keyvault_key_rotation_enabled/keyvault_key_rotation_enabled_test.py

```python
from unittest import mock

from azure.keyvault.keys import KeyRotationLifetimeAction, KeyRotationPolicy
from azure.mgmt.keyvault.v2023_07_01.models import KeyAttributes, VaultProperties

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_keyvault_key_rotation_enabled:
    def test_no_key_vaults(self):
        keyvault_client = mock.MagicMock
        keyvault_client.key_vaults = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_key_rotation_enabled.keyvault_key_rotation_enabled.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_key_rotation_enabled.keyvault_key_rotation_enabled import (
                keyvault_key_rotation_enabled,
            )

            check = keyvault_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_no_keys(self):
        keyvault_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_key_rotation_enabled.keyvault_key_rotation_enabled.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_key_rotation_enabled.keyvault_key_rotation_enabled import (
                keyvault_key_rotation_enabled,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
            )

            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id="id",
                        name="name",
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=False,
                        ),
                        keys=[],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_key_without_rotation_policy(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "keyvault_name"
        key_name = "key_name"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_key_rotation_enabled.keyvault_key_rotation_enabled.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_key_rotation_enabled.keyvault_key_rotation_enabled import (
                keyvault_key_rotation_enabled,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                Key,
                KeyVaultInfo,
            )

            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id="id",
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=False,
                        ),
                        keys=[
                            Key(
                                id="id",
                                name=key_name,
                                enabled=True,
                                location="location",
                                attributes=KeyAttributes(expires=None, enabled=True),
                                rotation_policy=None,
                            )
                        ],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has the key {key_name} without rotation policy set."
            )
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == "id"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"

    def test_key_with_rotation_policy(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "keyvault_name"
        key_name = "key_name"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_key_rotation_enabled.keyvault_key_rotation_enabled.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_key_rotation_enabled.keyvault_key_rotation_enabled import (
                keyvault_key_rotation_enabled,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                Key,
                KeyVaultInfo,
            )

            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id="id",
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=False,
                        ),
                        keys=[
                            Key(
                                id="id",
                                name=key_name,
                                enabled=True,
                                location="location",
                                attributes=KeyAttributes(expires=None, enabled=True),
                                rotation_policy=KeyRotationPolicy(
                                    lifetime_actions=[
                                        KeyRotationLifetimeAction(
                                            action="Rotate",
                                            lifetime_action_type="Rotate",
                                            lifetime_percentage=80,
                                        )
                                    ]
                                ),
                            )
                        ],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has the key {key_name} with rotation policy set."
            )
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == "id"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

````
