---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 681
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 681 of 867)

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

---[FILE: storage_account_key_access_disabled_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_account_key_access_disabled/storage_account_key_access_disabled_test.py

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


class Test_storage_account_key_access_disabled:
    def test_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_account_key_access_disabled.storage_account_key_access_disabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_account_key_access_disabled.storage_account_key_access_disabled import (
                storage_account_key_access_disabled,
            )

            check = storage_account_key_access_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_account_shared_key_access_enabled(self):
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
                    allow_blob_public_access=True,
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    allow_shared_key_access=True,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_account_key_access_disabled.storage_account_key_access_disabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_account_key_access_disabled.storage_account_key_access_disabled import (
                storage_account_key_access_disabled,
            )

            check = storage_account_key_access_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has shared key access enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_account_shared_key_access_disabled(self):
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
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    allow_shared_key_access=False,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_account_key_access_disabled.storage_account_key_access_disabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_account_key_access_disabled.storage_account_key_access_disabled import (
                storage_account_key_access_disabled,
            )

            check = storage_account_key_access_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has shared key access disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_blob_public_access_level_is_disabled_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_blob_public_access_level_is_disabled/storage_blob_public_access_level_is_disabled_test.py

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


class Test_storage_blob_public_access_level_is_disabled:
    def test_storage_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_blob_public_access_level_is_disabled.storage_blob_public_access_level_is_disabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_blob_public_access_level_is_disabled.storage_blob_public_access_level_is_disabled import (
                storage_blob_public_access_level_is_disabled,
            )

            check = storage_blob_public_access_level_is_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_storage_accounts_public_access_level_enabled(self):
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
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    allow_blob_public_access=True,
                    key_expiration_period_in_days=None,
                    location="westeurope",
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_blob_public_access_level_is_disabled.storage_blob_public_access_level_is_disabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_blob_public_access_level_is_disabled.storage_blob_public_access_level_is_disabled import (
                storage_blob_public_access_level_is_disabled,
            )

            check = storage_blob_public_access_level_is_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has allow blob public access enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_storage_accounts_public_access_level_disabled(self):
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
                    network_rule_set=NetworkRuleSet(
                        bypass="AzureServices", default_action="Allow"
                    ),
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    allow_blob_public_access=False,
                    key_expiration_period_in_days=None,
                    location="westeurope",
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_blob_public_access_level_is_disabled.storage_blob_public_access_level_is_disabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_blob_public_access_level_is_disabled.storage_blob_public_access_level_is_disabled import (
                storage_blob_public_access_level_is_disabled,
            )

            check = storage_blob_public_access_level_is_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has allow blob public access disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_blob_versioning_is_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_blob_versioning_is_enabled/storage_blob_versioning_is_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_storage_blob_versioning_is_enabled:
    def test_storage_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_blob_versioning_is_enabled.storage_blob_versioning_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_blob_versioning_is_enabled.storage_blob_versioning_is_enabled import (
                storage_blob_versioning_is_enabled,
            )

            check = storage_blob_versioning_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_no_blob_properties(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        storage_client = mock.MagicMock
        storage_account_blob_properties = None
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_blob_versioning_is_enabled.storage_blob_versioning_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_service import (
                Account,
                NetworkRuleSet,
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
            from prowler.providers.azure.services.storage.storage_blob_versioning_is_enabled.storage_blob_versioning_is_enabled import (
                storage_blob_versioning_is_enabled,
            )

            check = storage_blob_versioning_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_blob_versioning_is_enabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        storage_client = mock.MagicMock
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_blob_versioning_is_enabled.storage_blob_versioning_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_service import (
                Account,
                BlobProperties,
                DeleteRetentionPolicy,
                NetworkRuleSet,
            )

            storage_account_blob_properties = BlobProperties(
                id="id",
                name="name",
                type="type",
                default_service_version=None,
                container_delete_retention_policy=DeleteRetentionPolicy(
                    enabled=False, days=0
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
            from prowler.providers.azure.services.storage.storage_blob_versioning_is_enabled.storage_blob_versioning_is_enabled import (
                storage_blob_versioning_is_enabled,
            )

            check = storage_blob_versioning_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has blob versioning enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_blob_versioning_is_disabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        storage_client = mock.MagicMock
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_blob_versioning_is_enabled.storage_blob_versioning_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_service import (
                Account,
                BlobProperties,
                DeleteRetentionPolicy,
                NetworkRuleSet,
            )

            storage_account_blob_properties = BlobProperties(
                id="id",
                name="name",
                type="type",
                default_service_version=None,
                container_delete_retention_policy=DeleteRetentionPolicy(
                    enabled=False, days=0
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
            from prowler.providers.azure.services.storage.storage_blob_versioning_is_enabled.storage_blob_versioning_is_enabled import (
                storage_blob_versioning_is_enabled,
            )

            check = storage_blob_versioning_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have blob versioning enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_cross_tenant_replication_disabled_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_cross_tenant_replication_disabled/storage_cross_tenant_replication_disabled_test.py

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


class Test_storage_cross_tenant_replication_disabled:
    def test_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_cross_tenant_replication_disabled.storage_cross_tenant_replication_disabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_cross_tenant_replication_disabled.storage_cross_tenant_replication_disabled import (
                storage_cross_tenant_replication_disabled,
            )

            check = storage_cross_tenant_replication_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_account_cross_tenant_replication_enabled(self):
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
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    allow_cross_tenant_replication=True,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_cross_tenant_replication_disabled.storage_cross_tenant_replication_disabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_cross_tenant_replication_disabled.storage_cross_tenant_replication_disabled import (
                storage_cross_tenant_replication_disabled,
            )

            check = storage_cross_tenant_replication_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has cross-tenant replication enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_account_cross_tenant_replication_disabled(self):
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
                    private_endpoint_connections=[],
                    key_expiration_period_in_days=None,
                    location="westeurope",
                    allow_cross_tenant_replication=False,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_cross_tenant_replication_disabled.storage_cross_tenant_replication_disabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_cross_tenant_replication_disabled.storage_cross_tenant_replication_disabled import (
                storage_cross_tenant_replication_disabled,
            )

            check = storage_cross_tenant_replication_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has cross-tenant replication disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_default_network_access_rule_is_denied_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_default_network_access_rule_is_denied/storage_default_network_access_rule_is_denied_test.py

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


class Test_storage_default_network_access_rule_is_denied:
    def test_storage_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_default_network_access_rule_is_denied.storage_default_network_access_rule_is_denied.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_default_network_access_rule_is_denied.storage_default_network_access_rule_is_denied import (
                storage_default_network_access_rule_is_denied,
            )

            check = storage_default_network_access_rule_is_denied()
            result = check.execute()
            assert len(result) == 0

    def test_storage_storage_accounts_default_network_access_rule_allowed(self):
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
                "prowler.providers.azure.services.storage.storage_default_network_access_rule_is_denied.storage_default_network_access_rule_is_denied.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_default_network_access_rule_is_denied.storage_default_network_access_rule_is_denied import (
                storage_default_network_access_rule_is_denied,
            )

            check = storage_default_network_access_rule_is_denied()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has network access rule set to Allow."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_storage_accounts_default_network_access_rule_denied(self):
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
                        default_action="Deny", bypass="AzureServices"
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
                "prowler.providers.azure.services.storage.storage_default_network_access_rule_is_denied.storage_default_network_access_rule_is_denied.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_default_network_access_rule_is_denied.storage_default_network_access_rule_is_denied import (
                storage_default_network_access_rule_is_denied,
            )

            check = storage_default_network_access_rule_is_denied()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has network access rule set to Deny."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

````
