---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 660
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 660 of 867)

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

---[FILE: defender_ensure_defender_for_server_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_server_is_on/defender_ensure_defender_for_server_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_server_is_on:
    def test_defender_no_server(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_server_is_on.defender_ensure_defender_for_server_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_server_is_on.defender_ensure_defender_for_server_is_on import (
                defender_ensure_defender_for_server_is_on,
            )

            check = defender_ensure_defender_for_server_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_server_pricing_tier_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "VirtualMachines": Pricing(
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
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_server_is_on.defender_ensure_defender_for_server_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_server_is_on.defender_ensure_defender_for_server_is_on import (
                defender_ensure_defender_for_server_is_on,
            )

            check = defender_ensure_defender_for_server_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Servers from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Servers"
            assert result[0].resource_id == resource_id

    def test_defender_server_pricing_tier_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "VirtualMachines": Pricing(
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
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_server_is_on.defender_ensure_defender_for_server_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_server_is_on.defender_ensure_defender_for_server_is_on import (
                defender_ensure_defender_for_server_is_on,
            )

            check = defender_ensure_defender_for_server_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Servers from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Servers"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_sql_servers_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_sql_servers_is_on/defender_ensure_defender_for_sql_servers_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_sql_servers_is_on:
    def test_defender_no_server(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_sql_servers_is_on.defender_ensure_defender_for_sql_servers_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_sql_servers_is_on.defender_ensure_defender_for_sql_servers_is_on import (
                defender_ensure_defender_for_sql_servers_is_on,
            )

            check = defender_ensure_defender_for_sql_servers_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_server_pricing_tier_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "SqlServerVirtualMachines": Pricing(
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
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_sql_servers_is_on.defender_ensure_defender_for_sql_servers_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_sql_servers_is_on.defender_ensure_defender_for_sql_servers_is_on import (
                defender_ensure_defender_for_sql_servers_is_on,
            )

            check = defender_ensure_defender_for_sql_servers_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for SQL Server VMs from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan SQL Server VMs"
            assert result[0].resource_id == resource_id

    def test_defender_server_pricing_tier_standard(self):
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
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_sql_servers_is_on.defender_ensure_defender_for_sql_servers_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_sql_servers_is_on.defender_ensure_defender_for_sql_servers_is_on import (
                defender_ensure_defender_for_sql_servers_is_on,
            )

            check = defender_ensure_defender_for_sql_servers_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for SQL Server VMs from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan SQL Server VMs"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_storage_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_storage_is_on/defender_ensure_defender_for_storage_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_storage_is_on:
    def test_defender_no_server(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_storage_is_on.defender_ensure_defender_for_storage_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_storage_is_on.defender_ensure_defender_for_storage_is_on import (
                defender_ensure_defender_for_storage_is_on,
            )

            check = defender_ensure_defender_for_storage_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_server_pricing_tier_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "StorageAccounts": Pricing(
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
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_storage_is_on.defender_ensure_defender_for_storage_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_storage_is_on.defender_ensure_defender_for_storage_is_on import (
                defender_ensure_defender_for_storage_is_on,
            )

            check = defender_ensure_defender_for_storage_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Storage Accounts from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Storage Accounts"
            assert result[0].resource_id == resource_id

    def test_defender_server_pricing_tier_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "StorageAccounts": Pricing(
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
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_storage_is_on.defender_ensure_defender_for_storage_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_storage_is_on.defender_ensure_defender_for_storage_is_on import (
                defender_ensure_defender_for_storage_is_on,
            )

            check = defender_ensure_defender_for_storage_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Storage Accounts from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Storage Accounts"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_iot_hub_defender_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_iot_hub_defender_is_on/defender_ensure_iot_hub_defender_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import (
    IoTSecuritySolution,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_iot_hub_defender_is_on:
    def test_defender_no_subscriptions(self):
        defender_client = mock.MagicMock
        defender_client.iot_security_solutions = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_iot_hub_defender_is_on.defender_ensure_iot_hub_defender_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_iot_hub_defender_is_on.defender_ensure_iot_hub_defender_is_on import (
                defender_ensure_iot_hub_defender_is_on,
            )

            check = defender_ensure_iot_hub_defender_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_no_iot_hub_solutions(self):
        defender_client = mock.MagicMock
        defender_client.iot_security_solutions = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_iot_hub_defender_is_on.defender_ensure_iot_hub_defender_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_iot_hub_defender_is_on.defender_ensure_iot_hub_defender_is_on import (
                defender_ensure_iot_hub_defender_is_on,
            )

            check = defender_ensure_iot_hub_defender_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"No IoT Security Solutions found in the subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].resource_name == "IoT Hub Defender"
            assert result[0].resource_id == "IoT Hub Defender"

    def test_defender_iot_hub_solution_disabled(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.iot_security_solutions = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: IoTSecuritySolution(
                    resource_id=resource_id, name="iot_sec_solution", status="Disabled"
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_iot_hub_defender_is_on.defender_ensure_iot_hub_defender_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_iot_hub_defender_is_on.defender_ensure_iot_hub_defender_is_on import (
                defender_ensure_iot_hub_defender_is_on,
            )

            check = defender_ensure_iot_hub_defender_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"The security solution iot_sec_solution is disabled in subscription {AZURE_SUBSCRIPTION_ID}"
            )
            assert result[0].resource_name == "iot_sec_solution"
            assert result[0].resource_id == resource_id

    def test_defender_iot_hub_solution_enabled(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.iot_security_solutions = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: IoTSecuritySolution(
                    resource_id=resource_id, name="iot_sec_solution", status="Enabled"
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_iot_hub_defender_is_on.defender_ensure_iot_hub_defender_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_iot_hub_defender_is_on.defender_ensure_iot_hub_defender_is_on import (
                defender_ensure_iot_hub_defender_is_on,
            )

            check = defender_ensure_iot_hub_defender_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"The security solution iot_sec_solution is enabled in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].resource_name == "iot_sec_solution"
            assert result[0].resource_id == resource_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID

    def test_defender_multiple_iot_hub_solution_enabled_and_disabled(self):
        resource_id_enabled = str(uuid4())
        resource_id_disabled = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.iot_security_solutions = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id_enabled: IoTSecuritySolution(
                    resource_id=resource_id_enabled,
                    name="iot_sec_solution_enabled",
                    status="Enabled",
                ),
                resource_id_disabled: IoTSecuritySolution(
                    resource_id=resource_id_disabled,
                    name="iot_sec_solution_disabled",
                    status="Disabled",
                ),
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_iot_hub_defender_is_on.defender_ensure_iot_hub_defender_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_iot_hub_defender_is_on.defender_ensure_iot_hub_defender_is_on import (
                defender_ensure_iot_hub_defender_is_on,
            )

            check = defender_ensure_iot_hub_defender_is_on()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"The security solution iot_sec_solution_enabled is enabled in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].resource_name == "iot_sec_solution_enabled"
            assert result[0].resource_id == resource_id_enabled
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID

            assert result[1].status == "FAIL"
            assert (
                result[1].status_extended
                == f"The security solution iot_sec_solution_disabled is disabled in subscription {AZURE_SUBSCRIPTION_ID}"
            )
            assert result[1].resource_name == "iot_sec_solution_disabled"
            assert result[1].resource_id == resource_id_disabled
            assert result[1].subscription == AZURE_SUBSCRIPTION_ID
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_mcas_is_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_mcas_is_enabled/defender_ensure_mcas_is_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Setting
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_mcas_is_enabled:
    def test_defender_no_settings(self):
        defender_client = mock.MagicMock
        defender_client.settings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_mcas_is_enabled.defender_ensure_mcas_is_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_mcas_is_enabled.defender_ensure_mcas_is_enabled import (
                defender_ensure_mcas_is_enabled,
            )

            check = defender_ensure_mcas_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_defender_mcas_disabled(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.settings = {
            AZURE_SUBSCRIPTION_ID: {
                "MCAS": Setting(
                    resource_id=resource_id,
                    resource_type="Microsoft.Security/locations/settings",
                    kind="DataExportSettings",
                    enabled=False,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_mcas_is_enabled.defender_ensure_mcas_is_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_mcas_is_enabled.defender_ensure_mcas_is_enabled import (
                defender_ensure_mcas_is_enabled,
            )

            check = defender_ensure_mcas_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Microsoft Defender for Cloud Apps is disabled for subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "MCAS"
            assert result[0].resource_id == resource_id

    def test_defender_mcas_enabled(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.settings = {
            AZURE_SUBSCRIPTION_ID: {
                "MCAS": Setting(
                    resource_id=resource_id,
                    resource_type="Microsoft.Security/locations/settings",
                    kind="DataExportSettings",
                    enabled=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_mcas_is_enabled.defender_ensure_mcas_is_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_mcas_is_enabled.defender_ensure_mcas_is_enabled import (
                defender_ensure_mcas_is_enabled,
            )

            check = defender_ensure_mcas_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Microsoft Defender for Cloud Apps is enabled for subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "MCAS"
            assert result[0].resource_id == resource_id

    def test_defender_mcas_no_settings(self):
        defender_client = mock.MagicMock
        defender_client.settings = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_mcas_is_enabled.defender_ensure_mcas_is_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_mcas_is_enabled.defender_ensure_mcas_is_enabled import (
                defender_ensure_mcas_is_enabled,
            )

            check = defender_ensure_mcas_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Microsoft Defender for Cloud Apps not exists for subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "MCAS"
            assert result[0].resource_id == "MCAS"
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_notify_alerts_severity_is_high_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_notify_alerts_severity_is_high/defender_ensure_notify_alerts_severity_is_high_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import (
    NotificationsByRole,
    SecurityContactConfiguration,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_notify_alerts_severity_is_high:
    def test_defender_no_subscriptions(self):
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_notify_alerts_severity_is_high.defender_ensure_notify_alerts_severity_is_high.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_notify_alerts_severity_is_high.defender_ensure_notify_alerts_severity_is_high import (
                defender_ensure_notify_alerts_severity_is_high,
            )

            check = defender_ensure_notify_alerts_severity_is_high()
            result = check.execute()
            assert len(result) == 0

    def test_defender_severity_alerts_critical(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name="default",
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Contributor"]
                    ),
                    alert_minimal_severity="Critical",
                    attack_path_minimal_risk_level=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_notify_alerts_severity_is_high.defender_ensure_notify_alerts_severity_is_high.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_notify_alerts_severity_is_high.defender_ensure_notify_alerts_severity_is_high import (
                defender_ensure_notify_alerts_severity_is_high,
            )

            check = defender_ensure_notify_alerts_severity_is_high()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Notifications are not enabled for alerts with a minimum severity of high or lower in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "default"
            assert result[0].resource_id == resource_id

    def test_defender_severity_alerts_high(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    resource_id=resource_id,
                    id=resource_id,
                    name="default",
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Contributor"]
                    ),
                    alert_minimal_severity="High",
                    attack_path_minimal_risk_level=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_notify_alerts_severity_is_high.defender_ensure_notify_alerts_severity_is_high.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_notify_alerts_severity_is_high.defender_ensure_notify_alerts_severity_is_high import (
                defender_ensure_notify_alerts_severity_is_high,
            )

            check = defender_ensure_notify_alerts_severity_is_high()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Notifications are enabled for alerts with a minimum severity of high or lower (High) in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "default"
            assert result[0].resource_id == resource_id

    def test_defender_severity_alerts_low(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    resource_id=resource_id,
                    id=resource_id,
                    name="default",
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Contributor"]
                    ),
                    alert_minimal_severity="Low",
                    attack_path_minimal_risk_level=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_notify_alerts_severity_is_high.defender_ensure_notify_alerts_severity_is_high.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_notify_alerts_severity_is_high.defender_ensure_notify_alerts_severity_is_high import (
                defender_ensure_notify_alerts_severity_is_high,
            )

            check = defender_ensure_notify_alerts_severity_is_high()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Notifications are enabled for alerts with a minimum severity of high or lower (Low) in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "default"
            assert result[0].resource_id == resource_id

    def test_defender_default_security_contact_not_found(self):
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/providers/Microsoft.Security/securityContacts/default": SecurityContactConfiguration(
                    resource_id=f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/providers/Microsoft.Security/securityContacts/default",
                    id=f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/providers/Microsoft.Security/securityContacts/default",
                    name="default",
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(state=True, roles=[""]),
                    alert_minimal_severity="",
                    attack_path_minimal_risk_level=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_notify_alerts_severity_is_high.defender_ensure_notify_alerts_severity_is_high.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_notify_alerts_severity_is_high.defender_ensure_notify_alerts_severity_is_high import (
                defender_ensure_notify_alerts_severity_is_high,
            )

            check = defender_ensure_notify_alerts_severity_is_high()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Notifications are not enabled for alerts with a minimum severity of high or lower in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "default"
            assert (
                result[0].resource_id
                == f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/providers/Microsoft.Security/securityContacts/default"
            )
```

--------------------------------------------------------------------------------

````
