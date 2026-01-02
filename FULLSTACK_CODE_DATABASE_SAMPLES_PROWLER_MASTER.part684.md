---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 684
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 684 of 867)

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

---[FILE: storage_infrastructure_encryption_is_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_infrastructure_encryption_is_enabled/storage_infrastructure_encryption_is_enabled_test.py

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


class Test_storage_infrastructure_encryption_is_enabled:
    def test_storage_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_infrastructure_encryption_is_enabled.storage_infrastructure_encryption_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_infrastructure_encryption_is_enabled.storage_infrastructure_encryption_is_enabled import (
                storage_infrastructure_encryption_is_enabled,
            )

            check = storage_infrastructure_encryption_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_storage_accounts_infrastructure_encryption_disabled(self):
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
                "prowler.providers.azure.services.storage.storage_infrastructure_encryption_is_enabled.storage_infrastructure_encryption_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_infrastructure_encryption_is_enabled.storage_infrastructure_encryption_is_enabled import (
                storage_infrastructure_encryption_is_enabled,
            )

            check = storage_infrastructure_encryption_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has infrastructure encryption disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_storage_accounts_infrastructure_encryption_enabled(self):
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
                    infrastructure_encryption=True,
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
                "prowler.providers.azure.services.storage.storage_infrastructure_encryption_is_enabled.storage_infrastructure_encryption_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_infrastructure_encryption_is_enabled.storage_infrastructure_encryption_is_enabled import (
                storage_infrastructure_encryption_is_enabled,
            )

            check = storage_infrastructure_encryption_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has infrastructure encryption enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_key_rotation_90_days_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_key_rotation_90_days/storage_key_rotation_90_days_test.py

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


class Test_storage_key_rotation_90_dayss:
    def test_storage_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_key_rotation_90_days.storage_key_rotation_90_days.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_key_rotation_90_days.storage_key_rotation_90_days import (
                storage_key_rotation_90_days,
            )

            check = storage_key_rotation_90_days()
            result = check.execute()
            assert len(result) == 0

    def test_storage_storage_key_rotation_91_days(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        expiration_days = 91
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
                    key_expiration_period_in_days="91",
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
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
                "prowler.providers.azure.services.storage.storage_key_rotation_90_days.storage_key_rotation_90_days.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_key_rotation_90_days.storage_key_rotation_90_days import (
                storage_key_rotation_90_days,
            )

            check = storage_key_rotation_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has an invalid key expiration period of {expiration_days} days."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_storage_key_rotation_90_days(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        expiration_days = 90
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
                    key_expiration_period_in_days=90,
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
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
                "prowler.providers.azure.services.storage.storage_key_rotation_90_days.storage_key_rotation_90_days.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_key_rotation_90_days.storage_key_rotation_90_days import (
                storage_key_rotation_90_days,
            )

            check = storage_key_rotation_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has a key expiration period of {expiration_days} days."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_storage_no_key_rotation(self):
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
                    key_expiration_period_in_days=None,
                    encryption_type="None",
                    minimum_tls_version="TLS1_2",
                    private_endpoint_connections=[],
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
                "prowler.providers.azure.services.storage.storage_key_rotation_90_days.storage_key_rotation_90_days.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_key_rotation_90_days.storage_key_rotation_90_days import (
                storage_key_rotation_90_days,
            )

            check = storage_key_rotation_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has no key expiration period set."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_secure_transfer_required_is_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_secure_transfer_required_is_enabled/storage_secure_transfer_required_is_enabled_test.py

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


class Test_storage_secure_transfer_required_is_enabled:
    def test_storage_no_storage_accounts(self):
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_secure_transfer_required_is_enabled.storage_secure_transfer_required_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_secure_transfer_required_is_enabled.storage_secure_transfer_required_is_enabled import (
                storage_secure_transfer_required_is_enabled,
            )

            check = storage_secure_transfer_required_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_storage_storage_accounts_secure_transfer_required_disabled(self):
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
                "prowler.providers.azure.services.storage.storage_secure_transfer_required_is_enabled.storage_secure_transfer_required_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_secure_transfer_required_is_enabled.storage_secure_transfer_required_is_enabled import (
                storage_secure_transfer_required_is_enabled,
            )

            check = storage_secure_transfer_required_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has secure transfer required disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"

    def test_storage_storage_accounts_secure_transfer_required_enabled(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        storage_client = mock.MagicMock
        storage_client.storage_accounts = {
            AZURE_SUBSCRIPTION_ID: [
                Account(
                    id=storage_account_id,
                    name=storage_account_name,
                    resouce_group_name="rg",
                    enable_https_traffic_only=True,
                    infrastructure_encryption=True,
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
                "prowler.providers.azure.services.storage.storage_secure_transfer_required_is_enabled.storage_secure_transfer_required_is_enabled.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_secure_transfer_required_is_enabled.storage_secure_transfer_required_is_enabled import (
                storage_secure_transfer_required_is_enabled,
            )

            check = storage_secure_transfer_required_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has secure transfer required enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == storage_account_name
            assert result[0].resource_id == storage_account_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: storage_smb_channel_encryption_with_secure_algorithm_test.py]---
Location: prowler-master/tests/providers/azure/services/storage/storage_smb_channel_encryption_with_secure_algorithm/storage_smb_channel_encryption_with_secure_algorithm_test.py

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


class Test_storage_smb_channel_encryption_with_secure_algorithm:
    def test_no_storage_accounts(self):
        storage_client = mock.MagicMock()
        storage_client.storage_accounts = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.storage.storage_smb_channel_encryption_with_secure_algorithm.storage_smb_channel_encryption_with_secure_algorithm.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_smb_channel_encryption_with_secure_algorithm.storage_smb_channel_encryption_with_secure_algorithm import (
                storage_smb_channel_encryption_with_secure_algorithm,
            )

            check = storage_smb_channel_encryption_with_secure_algorithm()
            result = check.execute()
            assert len(result) == 0

    def test_no_file_service_properties(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
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
                "prowler.providers.azure.services.storage.storage_smb_channel_encryption_with_secure_algorithm.storage_smb_channel_encryption_with_secure_algorithm.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_smb_channel_encryption_with_secure_algorithm.storage_smb_channel_encryption_with_secure_algorithm import (
                storage_smb_channel_encryption_with_secure_algorithm,
            )

            check = storage_smb_channel_encryption_with_secure_algorithm()
            result = check.execute()
            assert len(result) == 0

    def test_no_smb_protocol_settings(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        file_service_properties = FileServiceProperties(
            id="id1",
            name="fs1",
            type="type1",
            share_delete_retention_policy=DeleteRetentionPolicy(enabled=True, days=7),
            smb_protocol_settings=SMBProtocolSettings(
                channel_encryption=[], supported_versions=[]
            ),
        )
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
                "prowler.providers.azure.services.storage.storage_smb_channel_encryption_with_secure_algorithm.storage_smb_channel_encryption_with_secure_algorithm.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_smb_channel_encryption_with_secure_algorithm.storage_smb_channel_encryption_with_secure_algorithm import (
                storage_smb_channel_encryption_with_secure_algorithm,
            )

            check = storage_smb_channel_encryption_with_secure_algorithm()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have SMB channel encryption enabled for file shares."
            )

    def test_not_recommended_encryption(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        file_service_properties = FileServiceProperties(
            id="id1",
            name="fs1",
            type="type1",
            share_delete_retention_policy=DeleteRetentionPolicy(enabled=True, days=7),
            smb_protocol_settings=SMBProtocolSettings(
                channel_encryption=["AES-128-GCM"], supported_versions=[]
            ),
        )
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
                "prowler.providers.azure.services.storage.storage_smb_channel_encryption_with_secure_algorithm.storage_smb_channel_encryption_with_secure_algorithm.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_smb_channel_encryption_with_secure_algorithm.storage_smb_channel_encryption_with_secure_algorithm import (
                storage_smb_channel_encryption_with_secure_algorithm,
            )

            check = storage_smb_channel_encryption_with_secure_algorithm()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have SMB channel encryption with a secure algorithm for file shares since it supports AES-128-GCM."
            )

    def test_recommended_encryption(self):
        storage_account_id = str(uuid4())
        storage_account_name = "Test Storage Account"
        file_service_properties = FileServiceProperties(
            id="id1",
            name="fs1",
            type="type1",
            share_delete_retention_policy=DeleteRetentionPolicy(enabled=True, days=7),
            smb_protocol_settings=SMBProtocolSettings(
                channel_encryption=["AES-256-GCM"], supported_versions=[]
            ),
        )
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
                "prowler.providers.azure.services.storage.storage_smb_channel_encryption_with_secure_algorithm.storage_smb_channel_encryption_with_secure_algorithm.storage_client",
                new=storage_client,
            ),
        ):
            from prowler.providers.azure.services.storage.storage_smb_channel_encryption_with_secure_algorithm.storage_smb_channel_encryption_with_secure_algorithm import (
                storage_smb_channel_encryption_with_secure_algorithm,
            )

            check = storage_smb_channel_encryption_with_secure_algorithm()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"Storage account {storage_account_name} from subscription {AZURE_SUBSCRIPTION_ID} has a secure algorithm for SMB channel encryption (AES-256-GCM) enabled for file shares since it supports AES-256-GCM."
            )
```

--------------------------------------------------------------------------------

````
