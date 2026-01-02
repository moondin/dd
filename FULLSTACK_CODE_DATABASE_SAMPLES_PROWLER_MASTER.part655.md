---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 655
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 655 of 867)

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

---[FILE: containerregistry_service_test.py]---
Location: prowler-master/tests/providers/azure/services/containerregistry/containerregistry_service_test.py

```python
from unittest.mock import MagicMock, patch
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class TestContainerRegistryService:
    def test_get_container_registry(self):
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
            from prowler.providers.azure.services.containerregistry.containerregistry_service import (
                ContainerRegistryInfo,
            )

            # Initialize ContainerRegistry with the mocked provider
            containerregistry_service = MagicMock()
            registry_id = str(uuid4())
            containerregistry_service.registries = {
                AZURE_SUBSCRIPTION_ID: {
                    registry_id: ContainerRegistryInfo(
                        id=registry_id,
                        name="mock_registry",
                        location="westeurope",
                        resource_group="mock_resource_group",
                        sku="Basic",
                        login_server="mock_login_server.azurecr.io",
                        public_network_access=False,
                        admin_user_enabled=True,
                        private_endpoint_connections=[],
                        monitor_diagnostic_settings=[
                            {
                                "id": "id1/id1",
                                "logs": [
                                    {
                                        "category": "ContainerLogs",
                                        "enabled": True,
                                    },
                                    {
                                        "category": "AdminLogs",
                                        "enabled": False,
                                    },
                                ],
                                "storage_account_name": "mock_storage_account",
                                "storage_account_id": "mock_storage_account_id",
                                "name": "mock_diagnostic_setting",
                            }
                        ],
                    )
                }
            }

            # Assertions to check the populated data in the registries
            assert len(containerregistry_service.registries[AZURE_SUBSCRIPTION_ID]) == 1

            registry_info = containerregistry_service.registries[AZURE_SUBSCRIPTION_ID][
                registry_id
            ]

            assert registry_info.id == registry_id
            assert registry_info.name == "mock_registry"
            assert registry_info.location == "westeurope"
            assert registry_info.resource_group == "mock_resource_group"
            assert registry_info.sku == "Basic"
            assert registry_info.login_server == "mock_login_server.azurecr.io"
            assert not registry_info.public_network_access
            assert registry_info.admin_user_enabled is True
            assert isinstance(registry_info.monitor_diagnostic_settings, list)

            # Check the properties of monitor diagnostic settings
            monitor_setting = registry_info.monitor_diagnostic_settings[0]
            assert monitor_setting["id"] == "id1/id1"  # Use dictionary access here
            assert monitor_setting["storage_account_name"] == "mock_storage_account"
            assert monitor_setting["storage_account_id"] == "mock_storage_account_id"
            assert monitor_setting["name"] == "mock_diagnostic_setting"
            assert len(monitor_setting["logs"]) == 2

            assert monitor_setting["logs"][0]["category"] == "ContainerLogs"
            assert monitor_setting["logs"][0]["enabled"] is True
            assert monitor_setting["logs"][1]["category"] == "AdminLogs"
            assert monitor_setting["logs"][1]["enabled"] is False
```

--------------------------------------------------------------------------------

---[FILE: containerregistry_admin_user_disabled_test.py]---
Location: prowler-master/tests/providers/azure/services/containerregistry/containerregistry_admin_user_disabled/containerregistry_admin_user_disabled_test.py

```python
from unittest import mock
from unittest.mock import MagicMock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class TestContainerRegistryAdminUserDisabled:
    def test_no_container_registries(self):
        containerregistry_client = MagicMock()
        containerregistry_client.registries = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.containerregistry.containerregistry_admin_user_disabled.containerregistry_admin_user_disabled.containerregistry_client",
                new=containerregistry_client,
            ),
        ):
            from prowler.providers.azure.services.containerregistry.containerregistry_admin_user_disabled.containerregistry_admin_user_disabled import (
                containerregistry_admin_user_disabled,
            )

            check = containerregistry_admin_user_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_container_registry_admin_user_enabled(self):
        containerregistry_client = MagicMock()
        registry_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.containerregistry.containerregistry_admin_user_disabled.containerregistry_admin_user_disabled.containerregistry_client",
                new=containerregistry_client,
            ),
        ):
            from prowler.providers.azure.services.containerregistry.containerregistry_admin_user_disabled.containerregistry_admin_user_disabled import (
                containerregistry_admin_user_disabled,
            )
            from prowler.providers.azure.services.containerregistry.containerregistry_service import (
                ContainerRegistryInfo,
            )

            containerregistry_client.registries = {
                AZURE_SUBSCRIPTION_ID: {
                    registry_id: ContainerRegistryInfo(
                        id=registry_id,
                        name="mock_registry",
                        location="westeurope",
                        resource_group="mock_resource_group",
                        sku="Basic",
                        login_server="mock_login_server.azurecr.io",
                        public_network_access="Enabled",
                        admin_user_enabled=True,
                        monitor_diagnostic_settings=[],
                        private_endpoint_connections=[],
                    )
                }
            }

            check = containerregistry_admin_user_disabled()

            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Container Registry mock_registry from subscription {AZURE_SUBSCRIPTION_ID} has its admin user enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "mock_registry"
            assert (
                result[0].resource_id
                == containerregistry_client.registries[AZURE_SUBSCRIPTION_ID][
                    registry_id
                ].id
            )
            assert result[0].location == "westeurope"

    def test_container_registry_admin_user_disabled(self):
        containerregistry_client = mock.MagicMock()
        containerregistry_client.registries = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.containerregistry.containerregistry_admin_user_disabled.containerregistry_admin_user_disabled.containerregistry_client",
                new=containerregistry_client,
            ),
        ):
            from prowler.providers.azure.services.containerregistry.containerregistry_admin_user_disabled.containerregistry_admin_user_disabled import (
                containerregistry_admin_user_disabled,
            )
            from prowler.providers.azure.services.containerregistry.containerregistry_service import (
                ContainerRegistryInfo,
            )

            registry_id = "mock_registry_id"

            containerregistry_client.registries = {
                AZURE_SUBSCRIPTION_ID: {
                    registry_id: ContainerRegistryInfo(
                        id=registry_id,
                        name="mock_registry",
                        location="westeurope",
                        resource_group="mock_resource_group",
                        sku="Basic",
                        login_server="mock_login_server.azurecr.io",
                        public_network_access="Enabled",
                        admin_user_enabled=False,
                        monitor_diagnostic_settings=[],
                        private_endpoint_connections=[],
                    )
                }
            }

            check = containerregistry_admin_user_disabled()

            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Container Registry mock_registry from subscription {AZURE_SUBSCRIPTION_ID} has its admin user disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "mock_registry"
            assert (
                result[0].resource_id
                == containerregistry_client.registries[AZURE_SUBSCRIPTION_ID][
                    registry_id
                ].id
            )
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: containerregistry_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/azure/services/containerregistry/containerregistry_not_publicly_accessible/containerregistry_not_publicly_accessible_test.py

```python
from unittest import mock
from unittest.mock import MagicMock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_containerregistry_not_publicly_accessible:
    def test_no_container_registries(self):
        containerregistry_client = MagicMock()
        containerregistry_client.registries = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.containerregistry.containerregistry_not_publicly_accessible.containerregistry_not_publicly_accessible.containerregistry_client",
                new=containerregistry_client,
            ),
        ):
            from prowler.providers.azure.services.containerregistry.containerregistry_not_publicly_accessible.containerregistry_not_publicly_accessible import (
                containerregistry_not_publicly_accessible,
            )

            check = containerregistry_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    def test_container_registry_network_access_unrestricted(self):
        containerregistry_client = MagicMock()
        registry_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.containerregistry.containerregistry_not_publicly_accessible.containerregistry_not_publicly_accessible.containerregistry_client",
                new=containerregistry_client,
            ),
        ):
            from prowler.providers.azure.services.containerregistry.containerregistry_not_publicly_accessible.containerregistry_not_publicly_accessible import (
                containerregistry_not_publicly_accessible,
            )
            from prowler.providers.azure.services.containerregistry.containerregistry_service import (
                ContainerRegistryInfo,
            )

            containerregistry_client.registries = {
                AZURE_SUBSCRIPTION_ID: {
                    registry_id: ContainerRegistryInfo(
                        id=registry_id,
                        name="mock_registry",
                        location="westeurope",
                        resource_group="mock_resource_group",
                        sku="Basic",
                        login_server="mock_login_server.azurecr.io",
                        public_network_access=True,
                        admin_user_enabled=True,
                        private_endpoint_connections=[],
                        monitor_diagnostic_settings=[
                            {
                                "id": "id1/id1",
                                "logs": [
                                    {
                                        "category": "ContainerLogs",
                                        "enabled": True,
                                    },
                                    {
                                        "category": "AdminLogs",
                                        "enabled": False,
                                    },
                                ],
                                "storage_account_name": "mock_storage_account",
                                "storage_account_id": "mock_storage_account_id",
                                "name": "mock_diagnostic_setting",
                            }
                        ],
                    )
                }
            }

            check = containerregistry_not_publicly_accessible()

            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Container Registry {containerregistry_client.registries[AZURE_SUBSCRIPTION_ID][registry_id].name} from subscription {AZURE_SUBSCRIPTION_ID} allows unrestricted network access."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "mock_registry"
            assert (
                result[0].resource_id
                == containerregistry_client.registries[AZURE_SUBSCRIPTION_ID][
                    registry_id
                ].id
            )
            assert result[0].location == "westeurope"

    def test_container_registry_network_access_restricted(self):
        containerregistry_client = mock.MagicMock()
        containerregistry_client.registries = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.containerregistry.containerregistry_not_publicly_accessible.containerregistry_not_publicly_accessible.containerregistry_client",
                new=containerregistry_client,
            ),
        ):
            from prowler.providers.azure.services.containerregistry.containerregistry_not_publicly_accessible.containerregistry_not_publicly_accessible import (
                containerregistry_not_publicly_accessible,
            )
            from prowler.providers.azure.services.containerregistry.containerregistry_service import (
                ContainerRegistryInfo,
            )

            registry_id = "mock_registry_id"

            containerregistry_client.registries = {
                AZURE_SUBSCRIPTION_ID: {
                    registry_id: ContainerRegistryInfo(
                        id=registry_id,
                        name="mock_registry",
                        location="westeurope",
                        resource_group="mock_resource_group",
                        sku="Basic",
                        login_server="mock_login_server.azurecr.io",
                        public_network_access=False,
                        admin_user_enabled=False,
                        private_endpoint_connections=[],
                        monitor_diagnostic_settings=[
                            {
                                "id": "id1/id1",
                                "logs": [
                                    {
                                        "category": "ContainerLogs",
                                        "enabled": True,
                                    },
                                    {
                                        "category": "AdminLogs",
                                        "enabled": False,
                                    },
                                ],
                                "storage_account_name": "mock_storage_account",
                                "storage_account_id": "mock_storage_account_id",
                                "name": "mock_diagnostic_setting",
                            }
                        ],
                    )
                }
            }

            check = containerregistry_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Container Registry {containerregistry_client.registries[AZURE_SUBSCRIPTION_ID][registry_id].name} from subscription {AZURE_SUBSCRIPTION_ID} does not allow unrestricted network access."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "mock_registry"
            assert (
                result[0].resource_id
                == containerregistry_client.registries[AZURE_SUBSCRIPTION_ID][
                    registry_id
                ].id
            )
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: containerregistry_uses_private_link_test.py]---
Location: prowler-master/tests/providers/azure/services/containerregistry/containerregistry_uses_private_link/containerregistry_uses_private_link_test.py

```python
from unittest import mock
from unittest.mock import MagicMock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_containerregistry_uses_private_link:
    def test_no_container_registries(self):
        containerregistry_client = MagicMock()
        containerregistry_client.registries = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.containerregistry.containerregistry_uses_private_link.containerregistry_uses_private_link.containerregistry_client",
                new=containerregistry_client,
            ),
        ):
            from prowler.providers.azure.services.containerregistry.containerregistry_uses_private_link.containerregistry_uses_private_link import (
                containerregistry_uses_private_link,
            )

            check = containerregistry_uses_private_link()
            result = check.execute()
            assert len(result) == 0

    def test_container_registry_not_uses_private_link(self):
        containerregistry_client = MagicMock()
        registry_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.containerregistry.containerregistry_uses_private_link.containerregistry_uses_private_link.containerregistry_client",
                new=containerregistry_client,
            ),
        ):
            from prowler.providers.azure.services.containerregistry.containerregistry_service import (
                ContainerRegistryInfo,
            )
            from prowler.providers.azure.services.containerregistry.containerregistry_uses_private_link.containerregistry_uses_private_link import (
                containerregistry_uses_private_link,
            )

            containerregistry_client.registries = {
                AZURE_SUBSCRIPTION_ID: {
                    registry_id: ContainerRegistryInfo(
                        id=registry_id,
                        name="mock_registry",
                        location="westeurope",
                        resource_group="mock_resource_group",
                        sku="Basic",
                        login_server="mock_login_server.azurecr.io",
                        public_network_access="Enabled",
                        admin_user_enabled=True,
                        monitor_diagnostic_settings=[],
                        private_endpoint_connections=[],
                    )
                }
            }

            check = containerregistry_uses_private_link()

            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Container Registry mock_registry from subscription {AZURE_SUBSCRIPTION_ID} does not use a private link."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "mock_registry"
            assert (
                result[0].resource_id
                == containerregistry_client.registries[AZURE_SUBSCRIPTION_ID][
                    registry_id
                ].id
            )
            assert result[0].location == "westeurope"

    def test_container_registry_uses_private_link(self):
        containerregistry_client = mock.MagicMock()
        containerregistry_client.registries = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.containerregistry.containerregistry_uses_private_link.containerregistry_uses_private_link.containerregistry_client",
                new=containerregistry_client,
            ),
        ):
            from prowler.providers.azure.services.containerregistry.containerregistry_service import (
                ContainerRegistryInfo,
                PrivateEndpointConnection,
            )
            from prowler.providers.azure.services.containerregistry.containerregistry_uses_private_link.containerregistry_uses_private_link import (
                containerregistry_uses_private_link,
            )

            registry_id = str(uuid4())

            containerregistry_client.registries = {
                AZURE_SUBSCRIPTION_ID: {
                    registry_id: ContainerRegistryInfo(
                        id=registry_id,
                        name="mock_registry",
                        location="westeurope",
                        resource_group="mock_resource_group",
                        sku="Basic",
                        login_server="mock_login_server.azurecr.io",
                        public_network_access="Enabled",
                        admin_user_enabled=False,
                        monitor_diagnostic_settings=[],
                        private_endpoint_connections=[
                            PrivateEndpointConnection(
                                id="/subscriptions/AZURE_SUBSCRIPTION_ID/resourceGroups/mock_resource_group/providers/Microsoft.ContainerRegistry/registries/mock_registry/privateEndpointConnections/myConnection",
                                name="myConnection",
                                type="Microsoft.ContainerRegistry/registries/privateEndpointConnections",
                            )
                        ],
                    )
                }
            }

            check = containerregistry_uses_private_link()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Container Registry mock_registry from subscription {AZURE_SUBSCRIPTION_ID} uses a private link."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "mock_registry"
            assert (
                result[0].resource_id
                == containerregistry_client.registries[AZURE_SUBSCRIPTION_ID][
                    registry_id
                ].id
            )
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: cosmosdb_service_test.py]---
Location: prowler-master/tests/providers/azure/services/cosmosdb/cosmosdb_service_test.py

```python
from unittest.mock import patch

from prowler.providers.azure.services.cosmosdb.cosmosdb_service import Account, CosmosDB
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_cosmosdb_get_accounts(_):
    return {
        AZURE_SUBSCRIPTION_ID: [
            Account(
                id="account_id",
                name="account_name",
                kind=None,
                location="westeu",
                type=None,
                tags=None,
                is_virtual_network_filter_enabled=None,
                disable_local_auth=None,
                private_endpoint_connections=[],
            )
        ]
    }


@patch(
    "prowler.providers.azure.services.cosmosdb.cosmosdb_service.CosmosDB._get_accounts",
    new=mock_cosmosdb_get_accounts,
)
class Test_CosmosDB_Service:
    def test_get_client(self):
        account = CosmosDB(set_mocked_azure_provider())
        assert (
            account.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            == "CosmosDBManagementClient"
        )

    def test_get_accounts(self):
        account = CosmosDB(set_mocked_azure_provider())
        assert (
            account.accounts[AZURE_SUBSCRIPTION_ID][0].__class__.__name__ == "Account"
        )
        assert account.accounts[AZURE_SUBSCRIPTION_ID][0].id == "account_id"
        assert account.accounts[AZURE_SUBSCRIPTION_ID][0].name == "account_name"
        assert account.accounts[AZURE_SUBSCRIPTION_ID][0].kind is None
        assert account.accounts[AZURE_SUBSCRIPTION_ID][0].location == "westeu"
        assert account.accounts[AZURE_SUBSCRIPTION_ID][0].type is None
        assert account.accounts[AZURE_SUBSCRIPTION_ID][0].tags is None
        assert (
            account.accounts[AZURE_SUBSCRIPTION_ID][0].is_virtual_network_filter_enabled
            is None
        )
        assert account.accounts[AZURE_SUBSCRIPTION_ID][0].disable_local_auth is None


def mock_cosmosdb_get_accounts_with_none(_):
    """Mock CosmosDB accounts with None private_endpoint_connections"""
    from prowler.providers.azure.services.cosmosdb.cosmosdb_service import (
        PrivateEndpointConnection,
    )

    return {
        AZURE_SUBSCRIPTION_ID: [
            Account(
                id="/subscriptions/test/account1",
                name="cosmosdb-none-pec",
                kind="GlobalDocumentDB",
                location="eastus",
                type="Microsoft.DocumentDB/databaseAccounts",
                tags={},
                is_virtual_network_filter_enabled=False,
                disable_local_auth=False,
                private_endpoint_connections=[],  # Empty list from getattr default
            ),
            Account(
                id="/subscriptions/test/account2",
                name="cosmosdb-with-pec",
                kind="MongoDB",
                location="westus",
                type="Microsoft.DocumentDB/databaseAccounts",
                tags={"env": "test"},
                is_virtual_network_filter_enabled=True,
                disable_local_auth=True,
                private_endpoint_connections=[
                    PrivateEndpointConnection(
                        id="/subscriptions/test/pec1",
                        name="pec-1",
                        type="Microsoft.Network/privateEndpoints",
                    )
                ],
            ),
        ]
    }


@patch(
    "prowler.providers.azure.services.cosmosdb.cosmosdb_service.CosmosDB._get_accounts",
    new=mock_cosmosdb_get_accounts_with_none,
)
class Test_CosmosDB_Service_None_Handling:
    """Test CosmosDB service handling of None values"""

    def test_account_with_none_private_endpoint_connections(self):
        """Test that CosmosDB handles None private_endpoint_connections gracefully"""
        cosmosdb = CosmosDB(set_mocked_azure_provider())

        # Find account with no connections
        account = next(
            acc
            for acc in cosmosdb.accounts[AZURE_SUBSCRIPTION_ID]
            if acc.name == "cosmosdb-none-pec"
        )
        assert account.private_endpoint_connections == []
        assert account.disable_local_auth is False

    def test_account_with_valid_private_endpoint_connections(self):
        """Test that CosmosDB handles valid private_endpoint_connections"""
        cosmosdb = CosmosDB(set_mocked_azure_provider())

        # Find account with connections
        account = next(
            acc
            for acc in cosmosdb.accounts[AZURE_SUBSCRIPTION_ID]
            if acc.name == "cosmosdb-with-pec"
        )
        assert len(account.private_endpoint_connections) == 1
        assert account.private_endpoint_connections[0].id == "/subscriptions/test/pec1"
        assert account.private_endpoint_connections[0].name == "pec-1"
        assert (
            account.private_endpoint_connections[0].type
            == "Microsoft.Network/privateEndpoints"
        )
        assert account.disable_local_auth is True
```

--------------------------------------------------------------------------------

---[FILE: cosmosdb_account_firewall_use_selected_networks_test.py]---
Location: prowler-master/tests/providers/azure/services/cosmosdb/cosmosdb_account_firewall_use_selected_networks/cosmosdb_account_firewall_use_selected_networks_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.cosmosdb.cosmosdb_service import Account
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_cosmosdb_account_firewall_use_selected_networks:
    def test_no_accounts(self):
        cosmosdb_client = mock.MagicMock
        cosmosdb_client.accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.cosmosdb.cosmosdb_account_firewall_use_selected_networks.cosmosdb_account_firewall_use_selected_networks.cosmosdb_client",
                new=cosmosdb_client,
            ),
        ):
            from prowler.providers.azure.services.cosmosdb.cosmosdb_account_firewall_use_selected_networks.cosmosdb_account_firewall_use_selected_networks import (
                cosmosdb_account_firewall_use_selected_networks,
            )

            check = cosmosdb_account_firewall_use_selected_networks()
            result = check.execute()
            assert len(result) == 0

    def test_accounts_no_virtual_network_filter_enabled(self):
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
                    disable_local_auth=None,
                    is_virtual_network_filter_enabled=False,
                    private_endpoint_connections=[],
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.cosmosdb.cosmosdb_account_firewall_use_selected_networks.cosmosdb_account_firewall_use_selected_networks.cosmosdb_client",
                new=cosmosdb_client,
            ),
        ):
            from prowler.providers.azure.services.cosmosdb.cosmosdb_account_firewall_use_selected_networks.cosmosdb_account_firewall_use_selected_networks import (
                cosmosdb_account_firewall_use_selected_networks,
            )

            check = cosmosdb_account_firewall_use_selected_networks()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CosmosDB account {account_name} from subscription {AZURE_SUBSCRIPTION_ID} has firewall rules that allow access from all networks."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == account_name
            assert result[0].resource_id == account_id
            assert result[0].location == "westeu"

    def test_accounts_virtual_network_filter_enabled(self):
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
                    disable_local_auth=None,
                    is_virtual_network_filter_enabled=True,
                    private_endpoint_connections=[],
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.cosmosdb.cosmosdb_account_firewall_use_selected_networks.cosmosdb_account_firewall_use_selected_networks.cosmosdb_client",
                new=cosmosdb_client,
            ),
        ):
            from prowler.providers.azure.services.cosmosdb.cosmosdb_account_firewall_use_selected_networks.cosmosdb_account_firewall_use_selected_networks import (
                cosmosdb_account_firewall_use_selected_networks,
            )

            check = cosmosdb_account_firewall_use_selected_networks()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CosmosDB account {account_name} from subscription {AZURE_SUBSCRIPTION_ID} has firewall rules that allow access only from selected networks."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == account_name
            assert result[0].resource_id == account_id
            assert result[0].location == "westeu"
```

--------------------------------------------------------------------------------

````
