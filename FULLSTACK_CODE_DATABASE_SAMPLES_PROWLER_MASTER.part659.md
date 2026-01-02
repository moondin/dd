---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 659
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 659 of 867)

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

---[FILE: defender_ensure_defender_for_containers_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_containers_is_on/defender_ensure_defender_for_containers_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_containers_is_on:
    def test_defender_no_container_registries(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_containers_is_on.defender_ensure_defender_for_containers_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_containers_is_on.defender_ensure_defender_for_containers_is_on import (
                defender_ensure_defender_for_containers_is_on,
            )

            check = defender_ensure_defender_for_containers_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_container_registries_pricing_tier_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "Containers": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Not Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_containers_is_on.defender_ensure_defender_for_containers_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_containers_is_on.defender_ensure_defender_for_containers_is_on import (
                defender_ensure_defender_for_containers_is_on,
            )

            check = defender_ensure_defender_for_containers_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Containers from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Servers"
            assert result[0].resource_id == resource_id

    def test_defender_container_registries_pricing_tier_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "Containers": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_containers_is_on.defender_ensure_defender_for_containers_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_containers_is_on.defender_ensure_defender_for_containers_is_on import (
                defender_ensure_defender_for_containers_is_on,
            )

            check = defender_ensure_defender_for_containers_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Containers from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Servers"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_cosmosdb_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_cosmosdb_is_on/defender_ensure_defender_for_cosmosdb_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_cosmosdb_is_on:
    def test_defender_no_cosmosdb(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_cosmosdb_is_on.defender_ensure_defender_for_cosmosdb_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_cosmosdb_is_on.defender_ensure_defender_for_cosmosdb_is_on import (
                defender_ensure_defender_for_cosmosdb_is_on,
            )

            check = defender_ensure_defender_for_cosmosdb_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_cosmosdb_pricing_tier_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "CosmosDbs": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Not Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_cosmosdb_is_on.defender_ensure_defender_for_cosmosdb_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_cosmosdb_is_on.defender_ensure_defender_for_cosmosdb_is_on import (
                defender_ensure_defender_for_cosmosdb_is_on,
            )

            check = defender_ensure_defender_for_cosmosdb_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Cosmos DB from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Cosmos DB"
            assert result[0].resource_id == resource_id

    def test_defender_cosmosdb_pricing_tier_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "CosmosDbs": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_cosmosdb_is_on.defender_ensure_defender_for_cosmosdb_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_cosmosdb_is_on.defender_ensure_defender_for_cosmosdb_is_on import (
                defender_ensure_defender_for_cosmosdb_is_on,
            )

            check = defender_ensure_defender_for_cosmosdb_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Cosmos DB from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Cosmos DB"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_databases_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_databases_is_on/defender_ensure_defender_for_databases_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_databases_is_on:
    def test_defender_no_databases(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on import (
                defender_ensure_defender_for_databases_is_on,
            )

            check = defender_ensure_defender_for_databases_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_databases_sql_servers(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "SqlServers": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on import (
                defender_ensure_defender_for_databases_is_on,
            )

            check = defender_ensure_defender_for_databases_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_databases_sql_server_virtual_machines(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "SqlServerVirtualMachines": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on import (
                defender_ensure_defender_for_databases_is_on,
            )

            check = defender_ensure_defender_for_databases_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_databases_open_source_relation_databases(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "OpenSourceRelationalDatabases": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on import (
                defender_ensure_defender_for_databases_is_on,
            )

            check = defender_ensure_defender_for_databases_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_databases_cosmosdbs(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "CosmosDbs": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on import (
                defender_ensure_defender_for_databases_is_on,
            )

            check = defender_ensure_defender_for_databases_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_databases_all_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "SqlServers": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                ),
                "SqlServerVirtualMachines": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                ),
                "OpenSourceRelationalDatabases": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                ),
                "CosmosDbs": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                ),
            },
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on import (
                defender_ensure_defender_for_databases_is_on,
            )

            check = defender_ensure_defender_for_databases_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Databases from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Servers"
            assert result[0].resource_id == resource_id

    def test_defender_databases_cosmosdb_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "SqlServers": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                ),
                "SqlServerVirtualMachines": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                ),
                "OpenSourceRelationalDatabases": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                ),
                "CosmosDbs": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Not Standard",
                    free_trial_remaining_time=0,
                ),
            },
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_databases_is_on.defender_ensure_defender_for_databases_is_on import (
                defender_ensure_defender_for_databases_is_on,
            )

            check = defender_ensure_defender_for_databases_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Databases from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Servers"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_dns_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_dns_is_on/defender_ensure_defender_for_dns_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_dns_is_on:
    def test_defender_no_dns(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_dns_is_on.defender_ensure_defender_for_dns_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_dns_is_on.defender_ensure_defender_for_dns_is_on import (
                defender_ensure_defender_for_dns_is_on,
            )

            check = defender_ensure_defender_for_dns_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_dns_pricing_tier_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "Dns": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Not Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_dns_is_on.defender_ensure_defender_for_dns_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_dns_is_on.defender_ensure_defender_for_dns_is_on import (
                defender_ensure_defender_for_dns_is_on,
            )

            check = defender_ensure_defender_for_dns_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for DNS from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan DNS"
            assert result[0].resource_id == resource_id

    def test_defender_dns_pricing_tier_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "Dns": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_dns_is_on.defender_ensure_defender_for_dns_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_dns_is_on.defender_ensure_defender_for_dns_is_on import (
                defender_ensure_defender_for_dns_is_on,
            )

            check = defender_ensure_defender_for_dns_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for DNS from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan DNS"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_keyvault_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_keyvault_is_on/defender_ensure_defender_for_keyvault_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_keyvault_is_on:
    def test_defender_no_keyvaults(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_keyvault_is_on.defender_ensure_defender_for_keyvault_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_keyvault_is_on.defender_ensure_defender_for_keyvault_is_on import (
                defender_ensure_defender_for_keyvault_is_on,
            )

            check = defender_ensure_defender_for_keyvault_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_keyvaults_pricing_tier_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "KeyVaults": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Not Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_keyvault_is_on.defender_ensure_defender_for_keyvault_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_keyvault_is_on.defender_ensure_defender_for_keyvault_is_on import (
                defender_ensure_defender_for_keyvault_is_on,
            )

            check = defender_ensure_defender_for_keyvault_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for KeyVaults from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan KeyVaults"
            assert result[0].resource_id == resource_id

    def test_defender_keyvaults_pricing_tier_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "KeyVaults": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_keyvault_is_on.defender_ensure_defender_for_keyvault_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_keyvault_is_on.defender_ensure_defender_for_keyvault_is_on import (
                defender_ensure_defender_for_keyvault_is_on,
            )

            check = defender_ensure_defender_for_keyvault_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for KeyVaults from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan KeyVaults"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_os_relational_databases_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_os_relational_databases_is_on/defender_ensure_defender_for_os_relational_databases_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_os_relational_databases_is_on:
    def test_defender_no_os_relational_databases(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_os_relational_databases_is_on.defender_ensure_defender_for_os_relational_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_os_relational_databases_is_on.defender_ensure_defender_for_os_relational_databases_is_on import (
                defender_ensure_defender_for_os_relational_databases_is_on,
            )

            check = defender_ensure_defender_for_os_relational_databases_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_os_relational_databases_pricing_tier_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "OpenSourceRelationalDatabases": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Not Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_os_relational_databases_is_on.defender_ensure_defender_for_os_relational_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_os_relational_databases_is_on.defender_ensure_defender_for_os_relational_databases_is_on import (
                defender_ensure_defender_for_os_relational_databases_is_on,
            )

            check = defender_ensure_defender_for_os_relational_databases_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Open-Source Relational Databases from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert (
                result[0].resource_name
                == "Defender plan Open-Source Relational Databases"
            )
            assert result[0].resource_id == resource_id

    def test_defender_os_relational_databases_pricing_tier_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "OpenSourceRelationalDatabases": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_os_relational_databases_is_on.defender_ensure_defender_for_os_relational_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_os_relational_databases_is_on.defender_ensure_defender_for_os_relational_databases_is_on import (
                defender_ensure_defender_for_os_relational_databases_is_on,
            )

            check = defender_ensure_defender_for_os_relational_databases_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Open-Source Relational Databases from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert (
                result[0].resource_name
                == "Defender plan Open-Source Relational Databases"
            )
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

````
