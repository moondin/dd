---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 682
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 682 of 867)

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

---[FILE: storage_default_to_entra_authorization_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_default_to_entra_authorization_enabled/storage_default_to_entra_authorization_enabled_test.py

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


class Test_storage_default_to_entra_authorization_enabled:
    def test_no_storage_accounts(self):
        storage_client = mock.MagicMock()
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_default_to_entra_authorization_enabled.storage_default_to_entra_authorization_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_default_to_entra_authorization_enabled.storage_default_to_entra_authorization_enabled import (
                storage_default_to_entra_authorization_enabled,
            )

            check = storage_default_to_entra_authorization_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_default_to_entra_authorization_enabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account Entra Auth Enabled"
        storage_client = mock.MagicMock()
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
                    default_to_entra_authorization=True,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_default_to_entra_authorization_enabled.storage_default_to_entra_authorization_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_default_to_entra_authorization_enabled.storage_default_to_entra_authorization_enabled import (
                storage_default_to_entra_authorization_enabled,
            )

            check = storage_default_to_entra_authorization_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Default to Microsoft Entra authorization is enabled for storage account {storage_account_name}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_account_default_to_entra_authorization_disabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account Entra Auth Disabled"
        storage_client = mock.MagicMock()
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
                    default_to_entra_authorization=False,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_default_to_entra_authorization_enabled.storage_default_to_entra_authorization_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_default_to_entra_authorization_enabled.storage_default_to_entra_authorization_enabled import (
                storage_default_to_entra_authorization_enabled,
            )

            check = storage_default_to_entra_authorization_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Default to Microsoft Entra authorization is not enabled for storage account {storage_account_name}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_azure_services_are_trusted_to_access_is_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_ensure_azure_services_are_trusted_to_access_is_enabled/storage_ensure_azure_services_are_trusted_to_access_is_enabled_test.py

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


class Test_storage_ensure_azure_services_are_trusted_to_access_is_enabled:
    def test_storage_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_azure_services_are_trusted_to_access_is_enabled.storage_ensure_azure_services_are_trusted_to_access_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_azure_services_are_trusted_to_access_is_enabled.storage_ensure_azure_services_are_trusted_to_access_is_enabled import (
                storage_ensure_azure_services_are_trusted_to_access_is_enabled,
            )

            check = storage_ensure_azure_services_are_trusted_to_access_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_storage_accounts_azure_services_are_not_trusted_to_access(self):
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
                        bypass="None", default_action="Deny"
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
                "prowler.providers.azure.services.storage.storage_ensure_azure_services_are_trusted_to_access_is_enabled.storage_ensure_azure_services_are_trusted_to_access_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_azure_services_are_trusted_to_access_is_enabled.storage_ensure_azure_services_are_trusted_to_access_is_enabled import (
                storage_ensure_azure_services_are_trusted_to_access_is_enabled,
            )

            check = storage_ensure_azure_services_are_trusted_to_access_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} does not allow trusted Microsoft services to access this storage account."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_storage_accounts_azure_services_are_trusted_to_access(self):
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
                "prowler.providers.azure.services.storage.storage_ensure_azure_services_are_trusted_to_access_is_enabled.storage_ensure_azure_services_are_trusted_to_access_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_azure_services_are_trusted_to_access_is_enabled.storage_ensure_azure_services_are_trusted_to_access_is_enabled import (
                storage_ensure_azure_services_are_trusted_to_access_is_enabled,
            )

            check = storage_ensure_azure_services_are_trusted_to_access_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} allows trusted Microsoft services to access this storage account."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_encryption_with_customer_managed_keys_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_ensure_encryption_with_customer_managed_keys/storage_ensure_encryption_with_customer_managed_keys_test.py

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


class Test_storage_ensure_encryption_with_customer_managed_keys:
    def test_storage_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_encryption_with_customer_managed_keys.storage_ensure_encryption_with_customer_managed_keys.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_encryption_with_customer_managed_keys.storage_ensure_encryption_with_customer_managed_keys import (
                storage_ensure_encryption_with_customer_managed_keys,
            )

            check = storage_ensure_encryption_with_customer_managed_keys()
            result = check.execute()
            assert len(result) == 0

    def test_storage_storage_accounts_encryption_without_customer_managed_keys(self):
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
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    encryption_type="None",
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
                "prowler.providers.azure.services.storage.storage_ensure_encryption_with_customer_managed_keys.storage_ensure_encryption_with_customer_managed_keys.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_encryption_with_customer_managed_keys.storage_ensure_encryption_with_customer_managed_keys import (
                storage_ensure_encryption_with_customer_managed_keys,
            )

            check = storage_ensure_encryption_with_customer_managed_keys()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} does not encrypt with CMKs."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_storage_accounts_encryption_with_customer_managed_keys(self):
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
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
                    encryption_type="Microsoft.Keyvault",
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
                "prowler.providers.azure.services.storage.storage_ensure_encryption_with_customer_managed_keys.storage_ensure_encryption_with_customer_managed_keys.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_encryption_with_customer_managed_keys.storage_ensure_encryption_with_customer_managed_keys import (
                storage_ensure_encryption_with_customer_managed_keys,
            )

            check = storage_ensure_encryption_with_customer_managed_keys()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} encrypts with CMKs."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_file_shares_soft_delete_is_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_ensure_file_shares_soft_delete_is_enabled/storage_ensure_file_shares_soft_delete_is_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.storage.storage_service import (
    Account,
    DeleteRetentionPolicy,
    FileServiceProperties,
    NetworkRuleSet,
    SMBProtocolSettings,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_storage_ensure_file_shares_soft_delete_is_enabled:
    def test_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_file_shares_soft_delete_is_enabled.storage_ensure_file_shares_soft_delete_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_file_shares_soft_delete_is_enabled.storage_ensure_file_shares_soft_delete_is_enabled import (
                storage_ensure_file_shares_soft_delete_is_enabled,
            )

            check = storage_ensure_file_shares_soft_delete_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_account_no_file_properties(self):
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
                    file_service_properties=None,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_file_shares_soft_delete_is_enabled.storage_ensure_file_shares_soft_delete_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_file_shares_soft_delete_is_enabled.storage_ensure_file_shares_soft_delete_is_enabled import (
                storage_ensure_file_shares_soft_delete_is_enabled,
            )

            check = storage_ensure_file_shares_soft_delete_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_file_share_soft_delete_disabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        storage_client = mock.MagicMock
        retention_policy = DeleteRetentionPolicy(enabled=False, days=0)
        file_service_properties = FileServiceProperties(
            id=f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/resourceGroups/prowler-resource-group/providers/Microsoft.Storage/storageAccounts/{storage_account_name}/fileServices/default",
            name="default",
            type="Microsoft.Storage/storageAccounts/fileServices",
            share_delete_retention_policy=retention_policy,
            smb_protocol_settings=SMBProtocolSettings(
                channel_encryption=[], supported_versions=[]
            ),
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
                    file_service_properties=file_service_properties,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_file_shares_soft_delete_is_enabled.storage_ensure_file_shares_soft_delete_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_file_shares_soft_delete_is_enabled.storage_ensure_file_shares_soft_delete_is_enabled import (
                storage_ensure_file_shares_soft_delete_is_enabled,
            )

            check = storage_ensure_file_shares_soft_delete_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"File share soft delete is not enabled for storage account {storage_account_name}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == file_service_properties.id
            assert result[0].location == "westeurope"

    def test_file_share_soft_delete_enabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        storage_client = mock.MagicMock
        retention_policy = DeleteRetentionPolicy(enabled=True, days=7)
        file_service_properties = FileServiceProperties(
            id=f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/resourceGroups/prowler-resource-group/providers/Microsoft.Storage/storageAccounts/{storage_account_name}/fileServices/default",
            name="default",
            type="Microsoft.Storage/storageAccounts/fileServices",
            share_delete_retention_policy=retention_policy,
            smb_protocol_settings=SMBProtocolSettings(
                channel_encryption=[], supported_versions=[]
            ),
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
                    file_service_properties=file_service_properties,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_file_shares_soft_delete_is_enabled.storage_ensure_file_shares_soft_delete_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_file_shares_soft_delete_is_enabled.storage_ensure_file_shares_soft_delete_is_enabled import (
                storage_ensure_file_shares_soft_delete_is_enabled,
            )

            check = storage_ensure_file_shares_soft_delete_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"File share soft delete is enabled for storage account {storage_account_name} with a retention period of {retention_policy.days} days."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == file_service_properties.id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_ensure_minimum_tls_version_12_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_ensure_minimum_tls_version_12/storage_ensure_minimum_tls_version_12_test.py

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


class Test_storage_ensure_minimum_tls_version_12:
    def test_storage_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_ensure_minimum_tls_version_12.storage_ensure_minimum_tls_version_12.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_minimum_tls_version_12.storage_ensure_minimum_tls_version_12 import (
                storage_ensure_minimum_tls_version_12,
            )

            check = storage_ensure_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 0

    def test_storage_storage_accounts_tls_not_1_2(self):
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
                    minimum_tls_version="TLS1_1",
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
                "prowler.providers.azure.services.storage.storage_ensure_minimum_tls_version_12.storage_ensure_minimum_tls_version_12.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_minimum_tls_version_12.storage_ensure_minimum_tls_version_12 import (
                storage_ensure_minimum_tls_version_12,
            )

            check = storage_ensure_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have TLS version set to 1.2."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_storage_accounts_tls_1_2(self):
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
                "prowler.providers.azure.services.storage.storage_ensure_minimum_tls_version_12.storage_ensure_minimum_tls_version_12.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_ensure_minimum_tls_version_12.storage_ensure_minimum_tls_version_12 import (
                storage_ensure_minimum_tls_version_12,
            )

            check = storage_ensure_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has TLS version set to 1.2."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

````
