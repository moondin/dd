---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 656
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 656 of 867)

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

---[FILE: cosmosdb_account_use_aad_and_rbac_test.py]---
Location: prowler-master/tests/providers/azure/services/cosmosdb/cosmosdb_account_use_aad_and_rbac/cosmosdb_account_use_aad_and_rbac_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.cosmosdb.cosmosdb_service import Account
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_cosmosdb_account_use_aad_and_rbac:
    def test_no_accounts(self):
        cosmosdb_client = mock.MagicMock
        cosmosdb_client.accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_aad_and_rbac.cosmosdb_account_use_aad_and_rbac.cosmosdb_client",
                new=cosmosdb_client,
            ),
        ):
            from prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_aad_and_rbac.cosmosdb_account_use_aad_and_rbac import (
                cosmosdb_account_use_aad_and_rbac,
            )

            check = cosmosdb_account_use_aad_and_rbac()
            result = check.execute()
            assert len(result) == 0

    def test_accounts_disable_local_auth_false(self):
        cosmosdb_client = mock.MagicMock
        account_name = "Account Name"
        account_id = str(uuid4())
        cosmosdb_client.accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=account_id,
                    name=account_name,
                    kind=None,
                    location="westeu",
                    type=None,
                    tags=None,
                    is_virtual_network_filter_enabled=None,
                    private_endpoint_connections=None,
                    disable_local_auth=False,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_aad_and_rbac.cosmosdb_account_use_aad_and_rbac.cosmosdb_client",
                new=cosmosdb_client,
            ),
        ):
            from prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_aad_and_rbac.cosmosdb_account_use_aad_and_rbac import (
                cosmosdb_account_use_aad_and_rbac,
            )

            check = cosmosdb_account_use_aad_and_rbac()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CosmosDB account {account_name} from subscription {AZURE_SUBSCRIPTION_ID} is not using AAD and RBAC"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == account_name
            assert result[0].resource_id == account_id
            assert result[0].location == "westeu"

    def test_accounts_disable_local_auth_true(self):
        cosmosdb_client = mock.MagicMock
        account_name = "Account Name"
        account_id = str(uuid4())
        cosmosdb_client.accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=account_id,
                    name=account_name,
                    kind=None,
                    location="westeu",
                    type=None,
                    tags=None,
                    is_virtual_network_filter_enabled=None,
                    private_endpoint_connections=None,
                    disable_local_auth=True,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_aad_and_rbac.cosmosdb_account_use_aad_and_rbac.cosmosdb_client",
                new=cosmosdb_client,
            ),
        ):
            from prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_aad_and_rbac.cosmosdb_account_use_aad_and_rbac import (
                cosmosdb_account_use_aad_and_rbac,
            )

            check = cosmosdb_account_use_aad_and_rbac()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CosmosDB account {account_name} from subscription {AZURE_SUBSCRIPTION_ID} is using AAD and RBAC"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == account_name
            assert result[0].resource_id == account_id
            assert result[0].location == "westeu"
```

--------------------------------------------------------------------------------

---[FILE: cosmosdb_account_use_private_endpoints_test.py]---
Location: prowler-master/tests/providers/azure/services/cosmosdb/cosmosdb_account_use_private_endpoints/cosmosdb_account_use_private_endpoints_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.cosmosdb.models import PrivateEndpointConnection

from prowler.providers.azure.services.cosmosdb.cosmosdb_service import Account
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_cosmosdb_account_use_private_endpoints:
    def test_no_accounts(self):
        cosmosdb_client = mock.MagicMock
        cosmosdb_client.accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_private_endpoints.cosmosdb_account_use_private_endpoints.cosmosdb_client",
                new=cosmosdb_client,
            ),
        ):
            from prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_private_endpoints.cosmosdb_account_use_private_endpoints import (
                cosmosdb_account_use_private_endpoints,
            )

            check = cosmosdb_account_use_private_endpoints()
            result = check.execute()
            assert len(result) == 0

    def test_accounts_no_private_endpoints_connections(self):
        cosmosdb_client = mock.MagicMock
        account_name = "Account Name"
        account_id = str(uuid4())
        cosmosdb_client.accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=account_id,
                    name=account_name,
                    kind=None,
                    location="westeu",
                    type=None,
                    tags=None,
                    is_virtual_network_filter_enabled=None,
                    private_endpoint_connections=None,
                    disable_local_auth=None,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_private_endpoints.cosmosdb_account_use_private_endpoints.cosmosdb_client",
                new=cosmosdb_client,
            ),
        ):
            from prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_private_endpoints.cosmosdb_account_use_private_endpoints import (
                cosmosdb_account_use_private_endpoints,
            )

            check = cosmosdb_account_use_private_endpoints()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CosmosDB account {account_name} from subscription {AZURE_SUBSCRIPTION_ID} is not using private endpoints connections"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == account_name
            assert result[0].resource_id == account_id
            assert result[0].location == "westeu"

    def test_accounts_private_endpoints_connections(self):
        cosmosdb_client = mock.MagicMock
        account_name = "Account Name"
        account_id = str(uuid4())
        cosmosdb_client.accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=account_id,
                    name=account_name,
                    kind=None,
                    location="westeu",
                    type=None,
                    tags=None,
                    is_virtual_network_filter_enabled=None,
                    private_endpoint_connections=[
                        PrivateEndpointConnection(
                            id="private_endpoint", name="private_name"
                        )
                    ],
                    disable_local_auth=None,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_private_endpoints.cosmosdb_account_use_private_endpoints.cosmosdb_client",
                new=cosmosdb_client,
            ),
        ):
            from prowler.providers.azure.services.cosmosdb.cosmosdb_account_use_private_endpoints.cosmosdb_account_use_private_endpoints import (
                cosmosdb_account_use_private_endpoints,
            )

            check = cosmosdb_account_use_private_endpoints()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CosmosDB account {account_name} from subscription {AZURE_SUBSCRIPTION_ID} is using private endpoints connections"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == account_name
            assert result[0].resource_id == account_id
            assert result[0].location == "westeu"
```

--------------------------------------------------------------------------------

---[FILE: databricks_service_test.py]---
Location: prowler-master/tests/providers/azure/services/databricks/databricks_service_test.py

```python
from unittest.mock import patch

from prowler.providers.azure.services.databricks.databricks_service import (
    Databricks,
    DatabricksWorkspace,
    ManagedDiskEncryption,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_databricks_get_workspaces(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "test-workspace-id": DatabricksWorkspace(
                id="test-workspace-id",
                name="test-workspace",
                location="eastus",
                custom_managed_vnet_id="test-vnet-id",
                managed_disk_encryption=ManagedDiskEncryption(
                    key_name="test-key",
                    key_version="test-version",
                    key_vault_uri="test-vault-uri",
                ),
            )
        }
    }


@patch(
    "prowler.providers.azure.services.databricks.databricks_service.Databricks._get_workspaces",
    new=mock_databricks_get_workspaces,
)
class Test_Databricks_Service:
    def test_get_client(self):
        databricks = Databricks(set_mocked_azure_provider())
        assert (
            databricks.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            == "AzureDatabricksManagementClient"
        )

    def test_get_workspaces(self):
        databricks = Databricks(set_mocked_azure_provider())
        assert (
            databricks.workspaces[AZURE_SUBSCRIPTION_ID][
                "test-workspace-id"
            ].__class__.__name__
            == "DatabricksWorkspace"
        )
        workspace = databricks.workspaces[AZURE_SUBSCRIPTION_ID]["test-workspace-id"]
        assert workspace.id == "test-workspace-id"
        assert workspace.name == "test-workspace"
        assert workspace.location == "eastus"
        assert workspace.custom_managed_vnet_id == "test-vnet-id"
        assert (
            workspace.managed_disk_encryption.__class__.__name__
            == "ManagedDiskEncryption"
        )
        assert workspace.managed_disk_encryption.key_name == "test-key"
        assert workspace.managed_disk_encryption.key_version == "test-version"
        assert workspace.managed_disk_encryption.key_vault_uri == "test-vault-uri"


def mock_databricks_get_workspaces_no_encryption(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "test-workspace-id": DatabricksWorkspace(
                id="test-workspace-id",
                name="test-workspace",
                location="eastus",
                custom_managed_vnet_id="test-vnet-id",
                managed_disk_encryption=None,
            )
        }
    }


@patch(
    "prowler.providers.azure.services.databricks.databricks_service.Databricks._get_workspaces",
    new=mock_databricks_get_workspaces_no_encryption,
)
class Test_Databricks_Service_No_Encryption:
    def test_get_workspaces_no_encryption(self):
        databricks = Databricks(set_mocked_azure_provider())
        workspace = databricks.workspaces[AZURE_SUBSCRIPTION_ID]["test-workspace-id"]
        assert workspace.id == "test-workspace-id"
        assert workspace.name == "test-workspace"
        assert workspace.location == "eastus"
        assert workspace.custom_managed_vnet_id == "test-vnet-id"
        assert workspace.managed_disk_encryption is None
```

--------------------------------------------------------------------------------

---[FILE: databricks_workspace_cmk_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/databricks/databricks_workspace_cmk_encryption_enabled/databricks_workspace_cmk_encryption_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.databricks.databricks_service import (
    DatabricksWorkspace,
    ManagedDiskEncryption,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_databricks_workspace_cmk_encryption_enabled:
    def test_no_databricks_workspaces(self):
        databricks_client = mock.MagicMock
        databricks_client.workspaces = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.databricks.databricks_workspace_cmk_encryption_enabled.databricks_workspace_cmk_encryption_enabled.databricks_client",
                new=databricks_client,
            ),
        ):
            from prowler.providers.azure.services.databricks.databricks_workspace_cmk_encryption_enabled.databricks_workspace_cmk_encryption_enabled import (
                databricks_workspace_cmk_encryption_enabled,
            )

            check = databricks_workspace_cmk_encryption_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_databricks_workspace_cmk_encryption_disabled(self):
        workspace_id = str(uuid4())
        workspace_name = "test-workspace"

        databricks_client = mock.MagicMock
        databricks_client.workspaces = {
            AZURE_SUBSCRIPTION_ID: {
                workspace_id: DatabricksWorkspace(
                    id=workspace_id,
                    name=workspace_name,
                    location="eastus",
                    custom_managed_vnet_id=None,
                    managed_disk_encryption=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.databricks.databricks_workspace_cmk_encryption_enabled.databricks_workspace_cmk_encryption_enabled.databricks_client",
                new=databricks_client,
            ),
        ):
            from prowler.providers.azure.services.databricks.databricks_workspace_cmk_encryption_enabled.databricks_workspace_cmk_encryption_enabled import (
                databricks_workspace_cmk_encryption_enabled,
            )

            check = databricks_workspace_cmk_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Databricks workspace {workspace_name} in subscription {AZURE_SUBSCRIPTION_ID} does not have customer-managed key (CMK) encryption enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == workspace_name
            assert result[0].resource_id == workspace_id
            assert result[0].location == "eastus"

    def test_databricks_workspace_cmk_encryption_enabled(self):
        workspace_id = str(uuid4())
        workspace_name = "test-workspace"
        key_name = "test-key"
        key_version = "test-version"
        key_vault_uri = "test-vault-uri"

        databricks_client = mock.MagicMock
        databricks_client.workspaces = {
            AZURE_SUBSCRIPTION_ID: {
                workspace_id: DatabricksWorkspace(
                    id=workspace_id,
                    name=workspace_name,
                    location="eastus",
                    custom_managed_vnet_id=None,
                    managed_disk_encryption=ManagedDiskEncryption(
                        key_name=key_name,
                        key_version=key_version,
                        key_vault_uri=key_vault_uri,
                    ),
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.databricks.databricks_workspace_cmk_encryption_enabled.databricks_workspace_cmk_encryption_enabled.databricks_client",
                new=databricks_client,
            ),
        ):
            from prowler.providers.azure.services.databricks.databricks_workspace_cmk_encryption_enabled.databricks_workspace_cmk_encryption_enabled import (
                databricks_workspace_cmk_encryption_enabled,
            )

            check = databricks_workspace_cmk_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Databricks workspace {workspace_name} in subscription {AZURE_SUBSCRIPTION_ID} has customer-managed key (CMK) encryption enabled with key {key_vault_uri}/{key_name}/{key_version}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == workspace_name
            assert result[0].resource_id == workspace_id
            assert result[0].location == "eastus"
```

--------------------------------------------------------------------------------

---[FILE: databricks_workspace_vnet_injection_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/databricks/databricks_workspace_vnet_injection_enabled/databricks_workspace_vnet_injection_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.databricks.databricks_service import (
    DatabricksWorkspace,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_databricks_workspace_vnet_injection_enabled:
    def test_databricks_no_workspaces(self):
        databricks_client = mock.MagicMock
        databricks_client.workspaces = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.databricks.databricks_workspace_vnet_injection_enabled.databricks_workspace_vnet_injection_enabled.databricks_client",
                new=databricks_client,
            ),
        ):
            from prowler.providers.azure.services.databricks.databricks_workspace_vnet_injection_enabled.databricks_workspace_vnet_injection_enabled import (
                databricks_workspace_vnet_injection_enabled,
            )

            check = databricks_workspace_vnet_injection_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_databricks_workspace_vnet_injection_disabled(self):
        workspace_id = str(uuid4())
        workspace_name = "test-workspace"
        databricks_client = mock.MagicMock
        databricks_client.workspaces = {
            AZURE_SUBSCRIPTION_ID: {
                workspace_id: DatabricksWorkspace(
                    id=workspace_id,
                    name=workspace_name,
                    location="eastus",
                    custom_managed_vnet_id=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.databricks.databricks_workspace_vnet_injection_enabled.databricks_workspace_vnet_injection_enabled.databricks_client",
                new=databricks_client,
            ),
        ):
            from prowler.providers.azure.services.databricks.databricks_workspace_vnet_injection_enabled.databricks_workspace_vnet_injection_enabled import (
                databricks_workspace_vnet_injection_enabled,
            )

            check = databricks_workspace_vnet_injection_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Databricks workspace {workspace_name} in subscription {AZURE_SUBSCRIPTION_ID} is not deployed in a customer-managed VNet (VNet Injection is not enabled)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == workspace_name
            assert result[0].resource_id == workspace_id
            assert result[0].location == "eastus"

    def test_databricks_workspace_vnet_injection_enabled(self):
        workspace_id = str(uuid4())
        workspace_name = "test-workspace"
        vnet_id = "test-vnet-id"
        databricks_client = mock.MagicMock
        databricks_client.workspaces = {
            AZURE_SUBSCRIPTION_ID: {
                workspace_id: DatabricksWorkspace(
                    id=workspace_id,
                    name=workspace_name,
                    location="eastus",
                    custom_managed_vnet_id=vnet_id,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.databricks.databricks_workspace_vnet_injection_enabled.databricks_workspace_vnet_injection_enabled.databricks_client",
                new=databricks_client,
            ),
        ):
            from prowler.providers.azure.services.databricks.databricks_workspace_vnet_injection_enabled.databricks_workspace_vnet_injection_enabled import (
                databricks_workspace_vnet_injection_enabled,
            )

            check = databricks_workspace_vnet_injection_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Databricks workspace {workspace_name} in subscription {AZURE_SUBSCRIPTION_ID} is deployed in a customer-managed VNet ({vnet_id})."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == workspace_name
            assert result[0].resource_id == workspace_id
            assert result[0].location == "eastus"
```

--------------------------------------------------------------------------------

---[FILE: defender_service_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_service_test.py

```python
from datetime import timedelta
from unittest.mock import patch

from prowler.providers.azure.services.defender.defender_service import (
    Assesment,
    AutoProvisioningSetting,
    Defender,
    IoTSecuritySolution,
    JITPolicy,
    Pricing,
    SecurityContactConfiguration,
    Setting,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_defender_get_pricings(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "Standard": Pricing(
                resource_id="resource_id",
                resource_name="resource_name",
                pricing_tier="pricing_tier",
                free_trial_remaining_time=timedelta(days=1),
                extensions={},
            )
        }
    }


def mock_defender_get_auto_provisioning_settings(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "default": AutoProvisioningSetting(
                resource_id="/subscriptions/resource_id",
                resource_name="default",
                resource_type="Microsoft.Security/autoProvisioningSettings",
                auto_provision="On",
            )
        }
    }


def mock_defender_get_assessments(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "default": Assesment(
                resource_id="/subscriptions/resource_id",
                resource_name="default",
                status="Healthy",
            )
        }
    }


def mock_defender_get_security_contacts(*args, **kwargs):
    from prowler.providers.azure.services.defender.defender_service import (
        NotificationsByRole,
    )

    return {
        AZURE_SUBSCRIPTION_ID: {
            "/subscriptions/resource_id": SecurityContactConfiguration(
                id="/subscriptions/resource_id",
                name="default",
                enabled=True,
                emails=["user@user.com", "test@test.es"],
                phone="666666666",
                notifications_by_role=NotificationsByRole(
                    state=True, roles=["Owner", "Contributor"]
                ),
                alert_minimal_severity="High",
                attack_path_minimal_risk_level=None,
            )
        }
    }


def mock_defender_get_settings(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "MCAS": Setting(
                resource_id="/subscriptions/resource_id",
                resource_type="Microsoft.Security/locations/settings",
                kind="DataExportSettings",
                enabled=True,
            )
        }
    }


def mock_defender_get_iot_security_solutions(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "/subscriptions/resource_id": IoTSecuritySolution(
                resource_id="/subscriptions/resource_id",
                name="iot_sec_solution",
                status="Enabled",
            )
        }
    }


def mock_defender_get_jit_policies(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "policy-1": JITPolicy(
                id="policy-1",
                name="JITPolicy1",
                location="eastus",
                vm_ids=["vm-1", "vm-2"],
            )
        }
    }


@patch(
    "prowler.providers.azure.services.defender.defender_service.Defender._get_pricings",
    new=mock_defender_get_pricings,
)
@patch(
    "prowler.providers.azure.services.defender.defender_service.Defender._get_auto_provisioning_settings",
    new=mock_defender_get_auto_provisioning_settings,
)
@patch(
    "prowler.providers.azure.services.defender.defender_service.Defender._get_assessments",
    new=mock_defender_get_assessments,
)
@patch(
    "prowler.providers.azure.services.defender.defender_service.Defender._get_settings",
    new=mock_defender_get_settings,
)
@patch(
    "prowler.providers.azure.services.defender.defender_service.Defender._get_security_contacts",
    new=mock_defender_get_security_contacts,
)
@patch(
    "prowler.providers.azure.services.defender.defender_service.Defender._get_iot_security_solutions",
    new=mock_defender_get_iot_security_solutions,
)
@patch(
    "prowler.providers.azure.services.defender.defender_service.Defender._get_jit_policies",
    new=mock_defender_get_jit_policies,
)
class Test_Defender_Service:
    def test_get_client(self):
        defender = Defender(set_mocked_azure_provider())
        assert (
            defender.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            == "SecurityCenter"
        )

    def test__get_subscriptions__(self):
        defender = Defender(set_mocked_azure_provider())
        defender = Defender(set_mocked_azure_provider())
        assert defender.subscriptions.__class__.__name__ == "dict"

    def test_get_pricings(self):
        defender = Defender(set_mocked_azure_provider())
        assert len(defender.pricings) == 1
        assert (
            defender.pricings[AZURE_SUBSCRIPTION_ID]["Standard"].resource_id
            == "resource_id"
        )
        assert (
            defender.pricings[AZURE_SUBSCRIPTION_ID]["Standard"].resource_name
            == "resource_name"
        )
        assert (
            defender.pricings[AZURE_SUBSCRIPTION_ID]["Standard"].pricing_tier
            == "pricing_tier"
        )
        assert defender.pricings[AZURE_SUBSCRIPTION_ID][
            "Standard"
        ].free_trial_remaining_time == timedelta(days=1)
        assert defender.pricings[AZURE_SUBSCRIPTION_ID]["Standard"].extensions == {}

    def test_get_auto_provisioning_settings(self):
        defender = Defender(set_mocked_azure_provider())
        assert len(defender.auto_provisioning_settings) == 1
        assert (
            defender.auto_provisioning_settings[AZURE_SUBSCRIPTION_ID][
                "default"
            ].resource_id
            == "/subscriptions/resource_id"
        )
        assert (
            defender.auto_provisioning_settings[AZURE_SUBSCRIPTION_ID][
                "default"
            ].resource_name
            == "default"
        )
        assert (
            defender.auto_provisioning_settings[AZURE_SUBSCRIPTION_ID][
                "default"
            ].resource_type
            == "Microsoft.Security/autoProvisioningSettings"
        )
        assert (
            defender.auto_provisioning_settings[AZURE_SUBSCRIPTION_ID][
                "default"
            ].auto_provision
            == "On"
        )

    def test_get_assessments(self):
        defender = Defender(set_mocked_azure_provider())
        assert len(defender.assessments) == 1
        assert (
            defender.assessments[AZURE_SUBSCRIPTION_ID]["default"].resource_id
            == "/subscriptions/resource_id"
        )
        assert (
            defender.assessments[AZURE_SUBSCRIPTION_ID]["default"].resource_name
            == "default"
        )
        assert (
            defender.assessments[AZURE_SUBSCRIPTION_ID]["default"].status == "Healthy"
        )

    def test_get_settings(self):
        defender = Defender(set_mocked_azure_provider())
        assert len(defender.settings) == 1
        assert (
            defender.settings[AZURE_SUBSCRIPTION_ID]["MCAS"].resource_id
            == "/subscriptions/resource_id"
        )
        assert (
            defender.settings[AZURE_SUBSCRIPTION_ID]["MCAS"].resource_type
            == "Microsoft.Security/locations/settings"
        )
        assert (
            defender.settings[AZURE_SUBSCRIPTION_ID]["MCAS"].kind
            == "DataExportSettings"
        )
        assert defender.settings[AZURE_SUBSCRIPTION_ID]["MCAS"].enabled

    def test_get_security_contacts(self):
        defender = Defender(set_mocked_azure_provider())
        assert len(defender.security_contact_configurations) == 1
        contact = defender.security_contact_configurations[AZURE_SUBSCRIPTION_ID][
            "/subscriptions/resource_id"
        ]
        assert contact.id == "/subscriptions/resource_id"
        assert contact.name == "default"
        assert contact.emails == ["user@user.com", "test@test.es"]
        assert contact.phone == "666666666"
        assert contact.alert_minimal_severity == "High"
        assert contact.notifications_by_role.state is True
        assert contact.notifications_by_role.roles == ["Owner", "Contributor"]

    def test_get_iot_security_solutions(self):
        defender = Defender(set_mocked_azure_provider())
        assert len(defender.iot_security_solutions) == 1
        assert (
            defender.iot_security_solutions[AZURE_SUBSCRIPTION_ID][
                "/subscriptions/resource_id"
            ].resource_id
            == "/subscriptions/resource_id"
        )
        assert (
            defender.iot_security_solutions[AZURE_SUBSCRIPTION_ID][
                "/subscriptions/resource_id"
            ].name
            == "iot_sec_solution"
        )
        assert (
            defender.iot_security_solutions[AZURE_SUBSCRIPTION_ID][
                "/subscriptions/resource_id"
            ].status
            == "Enabled"
        )

    def test_get_jit_policies(self):
        defender = Defender(set_mocked_azure_provider())
        assert AZURE_SUBSCRIPTION_ID in defender.jit_policies
        assert "policy-1" in defender.jit_policies[AZURE_SUBSCRIPTION_ID]
        policy1 = defender.jit_policies[AZURE_SUBSCRIPTION_ID]["policy-1"]
        assert policy1.id == "policy-1"
        assert policy1.name == "JITPolicy1"
        assert policy1.location == "eastus"
        assert set(policy1.vm_ids) == {"vm-1", "vm-2"}


def mock_defender_get_assessments_with_none(_):
    """Mock Defender assessments with None and valid statuses"""
    return {
        AZURE_SUBSCRIPTION_ID: {
            "Assessment None": Assesment(
                resource_id="/subscriptions/test/assessment1",
                resource_name="assessment-none",
                status=None,  # None status
            ),
            "Assessment Healthy": Assesment(
                resource_id="/subscriptions/test/assessment2",
                resource_name="assessment-healthy",
                status="Healthy",
            ),
            "Assessment Unhealthy": Assesment(
                resource_id="/subscriptions/test/assessment3",
                resource_name="assessment-unhealthy",
                status="Unhealthy",
            ),
        }
    }


@patch(
    "prowler.providers.azure.services.defender.defender_service.Defender._get_assessments",
    new=mock_defender_get_assessments_with_none,
)
class Test_Defender_Service_Assessments_None_Handling:
    """Test Defender service handling of None values in assessments"""

    def test_assessment_with_none_status(self):
        """Test that Defender handles assessments with None status gracefully"""
        defender = Defender(set_mocked_azure_provider())

        # Check assessment with None status
        assessment = defender.assessments[AZURE_SUBSCRIPTION_ID]["Assessment None"]
        assert assessment.resource_id == "/subscriptions/test/assessment1"
        assert assessment.resource_name == "assessment-none"
        assert assessment.status is None

    def test_assessment_with_valid_status(self):
        """Test that Defender handles assessments with valid status"""
        defender = Defender(set_mocked_azure_provider())

        # Check assessment with Healthy status
        assessment = defender.assessments[AZURE_SUBSCRIPTION_ID]["Assessment Healthy"]
        assert assessment.resource_id == "/subscriptions/test/assessment2"
        assert assessment.resource_name == "assessment-healthy"
        assert assessment.status == "Healthy"

    def test_assessment_with_multiple_mixed_statuses(self):
        """Test that Defender handles mix of None and valid statuses"""
        defender = Defender(set_mocked_azure_provider())

        # Should have all 3 assessments
        assert len(defender.assessments[AZURE_SUBSCRIPTION_ID]) == 3

        # Check None status
        assessment_none = defender.assessments[AZURE_SUBSCRIPTION_ID]["Assessment None"]
        assert assessment_none.status is None

        # Check Healthy status
        assessment_healthy = defender.assessments[AZURE_SUBSCRIPTION_ID][
            "Assessment Healthy"
        ]
        assert assessment_healthy.status == "Healthy"

        # Check Unhealthy status
        assessment_unhealthy = defender.assessments[AZURE_SUBSCRIPTION_ID][
            "Assessment Unhealthy"
        ]
        assert assessment_unhealthy.status == "Unhealthy"
```

--------------------------------------------------------------------------------

````
