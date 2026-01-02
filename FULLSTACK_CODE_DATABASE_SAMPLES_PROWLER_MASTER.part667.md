---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 667
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 667 of 867)

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

---[FILE: keyvault_logging_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/keyvault/keyvault_logging_enabled/keyvault_logging_enabled_test.py

```python
from unittest import mock

from azure.mgmt.keyvault.v2023_07_01.models import VaultProperties

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_keyvault_logging_enabled:
    def test_keyvault_logging_enabled(self):
        keyvault_client = mock.MagicMock
        keyvault_client.key_vaults = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_service.Monitor",
                new=mock.MagicMock(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_logging_enabled.keyvault_logging_enabled.keyvault_client",
                new=keyvault_client,
            ),
        ):

            from prowler.providers.azure.services.keyvault.keyvault_logging_enabled.keyvault_logging_enabled import (
                keyvault_logging_enabled,
            )

            check = keyvault_logging_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_no_diagnostic_settings(self):
        keyvault_client = mock.MagicMock
        keyvault_client.key_vaults = {AZURE_SUBSCRIPTION_ID: []}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_service.Monitor",
                new=mock.MagicMock(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_logging_enabled.keyvault_logging_enabled.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_logging_enabled.keyvault_logging_enabled import (
                keyvault_logging_enabled,
            )

            check = keyvault_logging_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_diagnostic_settings_configured(self):
        keyvault_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_service.Monitor",
                new=mock.MagicMock(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_logging_enabled.keyvault_logging_enabled.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_logging_enabled.keyvault_logging_enabled import (
                keyvault_logging_enabled,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
            )
            from prowler.providers.azure.services.monitor.monitor_service import (
                DiagnosticSetting,
            )

            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id="id",
                        name="name_keyvault",
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=False,
                        ),
                        keys=[],
                        secrets=[],
                        monitor_diagnostic_settings=[
                            DiagnosticSetting(
                                id="id/id",
                                logs=[
                                    mock.MagicMock(
                                        category_group="audit",
                                        category="None",
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        category_group="allLogs",
                                        category="None",
                                        enabled=False,
                                    ),
                                ],
                                storage_account_name="storage_account_name",
                                storage_account_id="storage_account_id",
                                name="name_diagnostic_setting",
                            ),
                        ],
                    ),
                    KeyVaultInfo(
                        id="id2",
                        name="name_keyvault2",
                        location="eastus",
                        resource_group="resource_group2",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=False,
                        ),
                        keys=[],
                        secrets=[],
                        monitor_diagnostic_settings=[
                            DiagnosticSetting(
                                id="id2/id2",
                                logs=[
                                    mock.MagicMock(
                                        category_group="audit",
                                        category="None",
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        category_group="allLogs",
                                        category="None",
                                        enabled=True,
                                    ),
                                ],
                                storage_account_name="storage_account_name2",
                                storage_account_id="storage_account_id2",
                                name="name_diagnostic_setting2",
                            ),
                        ],
                    ),
                ]
            }
            check = keyvault_logging_enabled()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name_diagnostic_setting"
            assert result[0].resource_id == "id/id"
            assert result[0].location == "westeurope"
            assert (
                result[0].status_extended
                == f"Diagnostic setting name_diagnostic_setting for Key Vault name_keyvault in subscription {AZURE_SUBSCRIPTION_ID} does not have audit logging."
            )
            assert result[1].status == "PASS"
            assert result[1].subscription == AZURE_SUBSCRIPTION_ID
            assert result[1].resource_name == "name_diagnostic_setting2"
            assert result[1].resource_id == "id2/id2"
            assert result[1].location == "eastus"
            assert (
                result[1].status_extended
                == f"Diagnostic setting name_diagnostic_setting2 for Key Vault name_keyvault2 in subscription {AZURE_SUBSCRIPTION_ID} has audit logging."
            )
```

--------------------------------------------------------------------------------

---[FILE: keyvault_non_rbac_secret_expiration_set_test.py]---
Location: prowler-master/tests/providers/azure/services/keyvault/keyvault_non_rbac_secret_expiration_set/keyvault_non_rbac_secret_expiration_set_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.keyvault.v2023_07_01.models import SecretAttributes, VaultProperties

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_keyvault_non_rbac_secret_expiration_set:
    def test_no_key_vaults(self):
        keyvault_client = mock.MagicMock
        keyvault_client.key_vaults = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_non_rbac_secret_expiration_set.keyvault_non_rbac_secret_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_non_rbac_secret_expiration_set.keyvault_non_rbac_secret_expiration_set import (
                keyvault_non_rbac_secret_expiration_set,
            )

            check = keyvault_non_rbac_secret_expiration_set()
            result = check.execute()
            assert len(result) == 0

    def test_no_secrets(self):
        keyvault_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_non_rbac_secret_expiration_set.keyvault_non_rbac_secret_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_non_rbac_secret_expiration_set.keyvault_non_rbac_secret_expiration_set import (
                keyvault_non_rbac_secret_expiration_set,
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

            check = keyvault_non_rbac_secret_expiration_set()
            result = check.execute()
            assert len(result) == 0

    def test_key_vaults_invalid_secrets(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())
        secret_name = "Secret"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_non_rbac_secret_expiration_set.keyvault_non_rbac_secret_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_non_rbac_secret_expiration_set.keyvault_non_rbac_secret_expiration_set import (
                keyvault_non_rbac_secret_expiration_set,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
                Secret,
            )

            secret = Secret(
                id="id",
                name=secret_name,
                enabled=True,
                location="location",
                attributes=SecretAttributes(expires=None, enabled=True),
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
                        keys=[],
                        secrets=[secret],
                    )
                ]
            }
            check = keyvault_non_rbac_secret_expiration_set()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has the secret {secret_name} without expiration date set."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"

    def test_key_vaults_invalid_multiple_secrets(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())
        secret1_name = "Secret1"
        secret2_name = "Secret2"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_non_rbac_secret_expiration_set.keyvault_non_rbac_secret_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_non_rbac_secret_expiration_set.keyvault_non_rbac_secret_expiration_set import (
                keyvault_non_rbac_secret_expiration_set,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
                Secret,
            )

            secret1 = Secret(
                id="id",
                name=secret1_name,
                enabled=True,
                location="location",
                attributes=SecretAttributes(expires=None),
            )
            secret2 = Secret(
                id="id",
                name=secret2_name,
                enabled=True,
                location="location",
                attributes=SecretAttributes(expires=84934),
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
                        keys=[],
                        secrets=[secret1, secret2],
                    )
                ]
            }
            check = keyvault_non_rbac_secret_expiration_set()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has the secret {secret1_name} without expiration date set."
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
                "prowler.providers.azure.services.keyvault.keyvault_non_rbac_secret_expiration_set.keyvault_non_rbac_secret_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_non_rbac_secret_expiration_set.keyvault_non_rbac_secret_expiration_set import (
                keyvault_non_rbac_secret_expiration_set,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
                Secret,
            )

            secret = Secret(
                id="id",
                name="name",
                enabled=False,
                location="location",
                attributes=SecretAttributes(expires=None),
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
                        keys=[],
                        secrets=[secret],
                    )
                ]
            }
            check = keyvault_non_rbac_secret_expiration_set()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has all the secrets with expiration date set."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: keyvault_private_endpoints_test.py]---
Location: prowler-master/tests/providers/azure/services/keyvault/keyvault_private_endpoints/keyvault_private_endpoints_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.keyvault.v2023_07_01.models import (
    PrivateEndpointConnectionItem,
    VaultProperties,
)

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_keyvault_private_endpoints:
    def test_no_key_vaults(self):
        keyvault_client = mock.MagicMock
        keyvault_client.key_vaults = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_private_endpoints.keyvault_private_endpoints.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_private_endpoints.keyvault_private_endpoints import (
                keyvault_private_endpoints,
            )

            check = keyvault_private_endpoints()
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
                "prowler.providers.azure.services.keyvault.keyvault_private_endpoints.keyvault_private_endpoints.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_private_endpoints.keyvault_private_endpoints import (
                keyvault_private_endpoints,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
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
                            private_endpoint_connections=None,
                        ),
                        keys=[],
                        secrets=[],
                    )
                ]
            }

            check = keyvault_private_endpoints()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} is not using private endpoints."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"

    def test_key_vaults_using_private_endpoints(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())
        private_endpoint = PrivateEndpointConnectionItem(
            id="id",
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_private_endpoints.keyvault_private_endpoints.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_private_endpoints.keyvault_private_endpoints import (
                keyvault_private_endpoints,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
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
                            enable_rbac_authorization=True,
                        ),
                        keys=[],
                        secrets=[],
                    )
                ]
            }
            keyvault_client.key_vaults[AZURE_SUBSCRIPTION_ID][
                0
            ].properties.private_endpoint_connections = [private_endpoint]

            check = keyvault_private_endpoints()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} is using private endpoints."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: keyvault_rbac_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/keyvault/keyvault_rbac_enabled/keyvault_rbac_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.keyvault.v2023_07_01.models import VaultProperties

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_keyvault_rbac_enabled:
    def test_no_key_vaults(self):
        keyvault_client = mock.MagicMock
        keyvault_client.key_vaults = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_rbac_enabled.keyvault_rbac_enabled.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_enabled.keyvault_rbac_enabled import (
                keyvault_rbac_enabled,
            )

            check = keyvault_rbac_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_key_vaults_no_rbac(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_rbac_enabled.keyvault_rbac_enabled.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_enabled.keyvault_rbac_enabled import (
                keyvault_rbac_enabled,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
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
                        keys=[],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_rbac_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} is not using RBAC for access control."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"

    def test_key_vaults_rbac(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_rbac_enabled.keyvault_rbac_enabled.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_enabled.keyvault_rbac_enabled import (
                keyvault_rbac_enabled,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
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
                            enable_rbac_authorization=True,
                        ),
                        keys=[],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_rbac_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} is using RBAC for access control."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: keyvault_rbac_key_expiration_set_test.py]---
Location: prowler-master/tests/providers/azure/services/keyvault/keyvault_rbac_key_expiration_set/keyvault_rbac_key_expiration_set_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.keyvault.v2023_07_01.models import KeyAttributes, VaultProperties

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_keyvault_rbac_key_expiration_set:
    def test_no_key_vaults(self):
        keyvault_client = mock.MagicMock
        keyvault_client.key_vaults = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_rbac_key_expiration_set.keyvault_rbac_key_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_key_expiration_set.keyvault_rbac_key_expiration_set import (
                keyvault_rbac_key_expiration_set,
            )

            check = keyvault_rbac_key_expiration_set()
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
                "prowler.providers.azure.services.keyvault.keyvault_rbac_key_expiration_set.keyvault_rbac_key_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_key_expiration_set.keyvault_rbac_key_expiration_set import (
                keyvault_rbac_key_expiration_set,
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
                            enable_rbac_authorization=True,
                        ),
                        keys=[],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_rbac_key_expiration_set()
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
                "prowler.providers.azure.services.keyvault.keyvault_rbac_key_expiration_set.keyvault_rbac_key_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_key_expiration_set.keyvault_rbac_key_expiration_set import (
                keyvault_rbac_key_expiration_set,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                Key,
                KeyVaultInfo,
            )

            key = Key(
                id="id",
                name=key_name,
                enabled=True,
                location="location",
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
                            enable_rbac_authorization=True,
                        ),
                        keys=[key],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_rbac_key_expiration_set()
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
                "prowler.providers.azure.services.keyvault.keyvault_rbac_key_expiration_set.keyvault_rbac_key_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_key_expiration_set.keyvault_rbac_key_expiration_set import (
                keyvault_rbac_key_expiration_set,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                Key,
                KeyVaultInfo,
            )

            key = Key(
                id="id",
                name="name",
                enabled=True,
                location="location",
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
                            enable_rbac_authorization=True,
                        ),
                        keys=[key],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_rbac_key_expiration_set()
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

````
