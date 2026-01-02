---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 683
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 683 of 867)

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

---[FILE: storage_ensure_private_endpoints_in_storage_accounts_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_ensure_private_endpoints_in_storage_accounts/storage_ensure_private_endpoints_in_storage_accounts_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.storage.storage_service import (
    Account,
    NetworkRuleSet,
    PrivateEndpointConnection,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_storage_ensure_private_endpoints_in_storage_accounts:
    def test_storage_ensure_private_endpoints_in_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_private_endpoints_in_storage_accounts.storage_ensure_private_endpoints_in_storage_accounts.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_private_endpoints_in_storage_accounts.storage_ensure_private_endpoints_in_storage_accounts import (
                storage_ensure_private_endpoints_in_storage_accounts,
            )

            check = storage_ensure_private_endpoints_in_storage_accounts()
            result = check.execute()
            assert len(result) == 0

    def test_storage_ensure_private_endpoints_in_storage_accounts_no_endpoints(
        self,
    ):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    key_expiration_period_in_days=None,
                    location="westeurope",
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
                "prowler.providers.azure.services.storage.storage_ensure_private_endpoints_in_storage_accounts.storage_ensure_private_endpoints_in_storage_accounts.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_private_endpoints_in_storage_accounts.storage_ensure_private_endpoints_in_storage_accounts import (
                storage_ensure_private_endpoints_in_storage_accounts,
            )

            check = storage_ensure_private_endpoints_in_storage_accounts()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have private endpoint connections."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_ensure_private_endpoints_in_storage_accounts_has_endpoints(
        self,
    ):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    private_endpoint_connections=[
                        PrivateEndpointConnection(
                            id="f1ef2e48-978a-4b0e-b34f-e6c34a9e0724",
                            name="Test Private Endpoint Connection",
                            type="Test Type",
                        )
                    ],
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_private_endpoints_in_storage_accounts.storage_ensure_private_endpoints_in_storage_accounts.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_private_endpoints_in_storage_accounts.storage_ensure_private_endpoints_in_storage_accounts import (
                storage_ensure_private_endpoints_in_storage_accounts,
            )

            check = storage_ensure_private_endpoints_in_storage_accounts()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has private endpoint connections."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_soft_delete_is_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_ensure_soft_delete_is_enabled/storage_ensure_soft_delete_is_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.storage.storage_service import (
    Account,
    BlobProperties,
    DeleteRetentionPolicy,
    NetworkRuleSet,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_storage_ensure_soft_delete_is_enabled:
    def test_storage_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_soft_delete_is_enabled.storage_ensure_soft_delete_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_soft_delete_is_enabled.storage_ensure_soft_delete_is_enabled import (
                storage_ensure_soft_delete_is_enabled,
            )

            check = storage_ensure_soft_delete_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_no_blob_properties(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        storage_client = mock.MagicMock
        storage_account_blob_properties = None
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    private_endpoint_connections=[],
                    blob_properties=storage_account_blob_properties,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_soft_delete_is_enabled.storage_ensure_soft_delete_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_soft_delete_is_enabled.storage_ensure_soft_delete_is_enabled import (
                storage_ensure_soft_delete_is_enabled,
            )

            check = storage_ensure_soft_delete_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_ensure_soft_delete_is_disabled(
        self,
    ):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        storage_client = mock.MagicMock
        storage_account_blob_properties = BlobProperties(
            id="id",
            name="name",
            type="type",
            default_service_version=None,
            container_delete_retention_policy=DeleteRetentionPolicy(
                enabled=False, days=7
            ),
            versioning_enabled=False,
        )
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    private_endpoint_connections=[],
                    blob_properties=storage_account_blob_properties,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_soft_delete_is_enabled.storage_ensure_soft_delete_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_soft_delete_is_enabled.storage_ensure_soft_delete_is_enabled import (
                storage_ensure_soft_delete_is_enabled,
            )

            check = storage_ensure_soft_delete_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has soft delete disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_ensure_soft_delete_is_enabled(
        self,
    ):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        storage_client = mock.MagicMock
        storage_account_blob_properties = BlobProperties(
            id="id",
            name="name",
            type="type",
            default_service_version=None,
            container_delete_retention_policy=DeleteRetentionPolicy(
                enabled=True, days=7
            ),
            versioning_enabled=True,
        )
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    private_endpoint_connections=[],
                    blob_properties=storage_account_blob_properties,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_soft_delete_is_enabled.storage_ensure_soft_delete_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_soft_delete_is_enabled.storage_ensure_soft_delete_is_enabled import (
                storage_ensure_soft_delete_is_enabled,
            )

            check = storage_ensure_soft_delete_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has soft delete enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_geo_redundant_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_geo_redundant_enabled/storage_geo_redundant_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.storage.storage_service import (
    Account,
    NetworkRuleSet,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_storage_geo_redundant_enabled:
    def test_no_storage_accounts(self):
        storage_client = mock.MagicMock()
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled import (
                storage_geo_redundant_enabled,
            )

            check = storage_geo_redundant_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_account_standard_grs_enabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account GRS"
        storage_client = mock.MagicMock()
        replication_setting = "Standard_GRS"
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    replication_settings=replication_setting,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled import (
                storage_geo_redundant_enabled,
            )

            check = storage_geo_redundant_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has Geo-redundant storage {replication_setting} enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_account_standard_ragrs_enabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account RAGRS"
        storage_client = mock.MagicMock()
        replication_setting = "Standard_RAGRS"
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    replication_settings=replication_setting,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled import (
                storage_geo_redundant_enabled,
            )

            check = storage_geo_redundant_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has Geo-redundant storage {replication_setting} enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_account_standard_gzrs_enabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account GZRS"
        storage_client = mock.MagicMock()
        replication_setting = "Standard_GZRS"
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    replication_settings=replication_setting,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled import (
                storage_geo_redundant_enabled,
            )

            check = storage_geo_redundant_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has Geo-redundant storage {replication_setting} enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_account_standard_ragzrs_enabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account RAGZRS"
        storage_client = mock.MagicMock()
        replication_setting = "Standard_RAGZRS"
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    replication_settings=replication_setting,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled import (
                storage_geo_redundant_enabled,
            )

            check = storage_geo_redundant_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has Geo-redundant storage {replication_setting} enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_account_standard_lrs_disabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account LRS"
        storage_client = mock.MagicMock()
        replication_setting = "Standard_LRS"
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    replication_settings=replication_setting,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled import (
                storage_geo_redundant_enabled,
            )

            check = storage_geo_redundant_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have Geo-redundant storage enabled, it has {replication_setting} instead."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_account_standard_zrs_disabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account ZRS"
        storage_client = mock.MagicMock()
        replication_setting = "Standard_ZRS"
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    replication_settings=replication_setting,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled import (
                storage_geo_redundant_enabled,
            )

            check = storage_geo_redundant_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have Geo-redundant storage enabled, it has {replication_setting} instead."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_account_premium_lrs_disabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account Premium LRS"
        storage_client = mock.MagicMock()
        replication_setting = "Premium_LRS"
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    replication_settings=replication_setting,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled import (
                storage_geo_redundant_enabled,
            )

            check = storage_geo_redundant_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have Geo-redundant storage enabled, it has {replication_setting} instead."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_account_premium_zrs_disabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account Premium ZRS"
        storage_client = mock.MagicMock()
        replication_setting = "Premium_ZRS"
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=False,
                    infrastructure_encryption=False,
                    allow_blob_public_access=False,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    replication_settings=replication_setting,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_geo_redundant_enabled.storage_geo_redundant_enabled import (
                storage_geo_redundant_enabled,
            )

            check = storage_geo_redundant_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have Geo-redundant storage enabled, it has {replication_setting} instead."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

````
