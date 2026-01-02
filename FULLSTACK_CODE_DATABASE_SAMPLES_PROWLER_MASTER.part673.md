---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 673
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 673 of 867)

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

---[FILE: network_bastion_host_exists_test.py]---
Location: prowler-master/tests/providers/azure/services/network/network_bastion_host_exists/network_bastion_host_exists_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.network.network_service import BastionHost
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_network_bastion_host_exists:
    def test_no_bastion_hosts(self):
        network_client = mock.MagicMock
        network_client.bastion_hosts = {AZURE_SUBSCRIPTION_ID: []}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_bastion_host_exists.network_bastion_host_exists import (
                network_bastion_host_exists,
            )

            check = network_bastion_host_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Bastion Host from subscription {AZURE_SUBSCRIPTION_ID} does not exist"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Bastion Host"
            assert result[0].resource_id == "Bastion Host"

    def test_network_bastion_host_exists(self):
        network_client = mock.MagicMock
        bastion_host_name = "Bastion Host Name"
        bastion_host_id = str(uuid4())

        network_client.bastion_hosts = {
            AZURE_SUBSCRIPTION_ID: [
                BastionHost(
                    id=bastion_host_id,
                    name=bastion_host_name,
                    location="location",
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_bastion_host_exists.network_bastion_host_exists import (
                network_bastion_host_exists,
            )

            check = network_bastion_host_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Bastion Host from subscription {AZURE_SUBSCRIPTION_ID} available are: {bastion_host_name}"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Bastion Host"
            assert result[0].resource_id == "Bastion Host"
```

--------------------------------------------------------------------------------

---[FILE: network_flow_log_captured_sent_test.py]---
Location: prowler-master/tests/providers/azure/services/network/network_flow_log_captured_sent/network_flow_log_captured_sent_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.network.models import FlowLog, RetentionPolicyParameters

from prowler.providers.azure.services.network.network_service import NetworkWatcher
from tests.providers.azure.azure_fixtures import AZURE_SUBSCRIPTION_ID


class Test_network_flow_log_captured_sent:
    def test_no_network_watchers(self):
        network_client = mock.MagicMock
        network_client.network_watchers = {}

        with (
            mock.patch(
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_flow_log_captured_sent.network_flow_log_captured_sent import (
                network_flow_log_captured_sent,
            )

            check = network_flow_log_captured_sent()
            result = check.execute()
            assert len(result) == 0

    def test_network_network_watchers_no_flow_logs(self):
        network_client = mock.MagicMock
        network_watcher_name = "Network Watcher Name"
        network_watcher_id = str(uuid4())

        network_client.network_watchers = {
            AZURE_SUBSCRIPTION_ID: [
                NetworkWatcher(
                    id=network_watcher_id,
                    name=network_watcher_name,
                    location="location",
                    flow_logs=[],
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_flow_log_captured_sent.network_flow_log_captured_sent import (
                network_flow_log_captured_sent,
            )

            check = network_flow_log_captured_sent()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Network Watcher {network_watcher_name} from subscription {AZURE_SUBSCRIPTION_ID} has no flow logs"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == network_watcher_name
            assert result[0].resource_id == network_watcher_id
            assert result[0].location == "location"

    def test_network_network_watchers_flow_logs_disabled(self):
        network_client = mock.MagicMock
        network_watcher_name = "Network Watcher Name"
        network_watcher_id = str(uuid4())

        network_client.network_watchers = {
            AZURE_SUBSCRIPTION_ID: [
                NetworkWatcher(
                    id=network_watcher_id,
                    name=network_watcher_name,
                    location="location",
                    flow_logs=[
                        FlowLog(
                            enabled=False,
                            retention_policy=RetentionPolicyParameters(days=90),
                        )
                    ],
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_flow_log_captured_sent.network_flow_log_captured_sent import (
                network_flow_log_captured_sent,
            )

            check = network_flow_log_captured_sent()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Network Watcher {network_watcher_name} from subscription {AZURE_SUBSCRIPTION_ID} has flow logs disabled"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == network_watcher_name
            assert result[0].resource_id == network_watcher_id
            assert result[0].location == "location"

    def test_network_network_watchers_flow_logs_well_configured(self):
        network_client = mock.MagicMock
        network_watcher_name = "Network Watcher Name"
        network_watcher_id = str(uuid4())

        network_client.network_watchers = {
            AZURE_SUBSCRIPTION_ID: [
                NetworkWatcher(
                    id=network_watcher_id,
                    name=network_watcher_name,
                    location="location",
                    flow_logs=[
                        FlowLog(
                            enabled=True,
                            retention_policy=RetentionPolicyParameters(days=90),
                        )
                    ],
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_flow_log_captured_sent.network_flow_log_captured_sent import (
                network_flow_log_captured_sent,
            )

            check = network_flow_log_captured_sent()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].location == "location"
            assert (
                result[0].status_extended
                == f"Network Watcher {network_watcher_name} from subscription {AZURE_SUBSCRIPTION_ID} has flow logs that are captured and sent to Log Analytics workspace"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == network_watcher_name
            assert result[0].resource_id == network_watcher_id
```

--------------------------------------------------------------------------------

---[FILE: network_flow_log_more_than_90_days_test.py]---
Location: prowler-master/tests/providers/azure/services/network/network_flow_log_more_than_90_days/network_flow_log_more_than_90_days_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.network.models import FlowLog, RetentionPolicyParameters

from prowler.providers.azure.services.network.network_service import NetworkWatcher
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_network_flow_log_more_than_90_days:
    def test_no_network_watchers(self):
        network_client = mock.MagicMock
        network_client.network_watchers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_flow_log_more_than_90_days.network_flow_log_more_than_90_days import (
                network_flow_log_more_than_90_days,
            )

            check = network_flow_log_more_than_90_days()
            result = check.execute()
            assert len(result) == 0

    def test_network_network_watchers_no_flow_logs(self):
        network_client = mock.MagicMock
        network_watcher_name = "Network Watcher Name"
        network_watcher_id = str(uuid4())

        network_client.network_watchers = {
            AZURE_SUBSCRIPTION_ID: [
                NetworkWatcher(
                    id=network_watcher_id,
                    name=network_watcher_name,
                    location="location",
                    flow_logs=[],
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_flow_log_more_than_90_days.network_flow_log_more_than_90_days import (
                network_flow_log_more_than_90_days,
            )

            check = network_flow_log_more_than_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Network Watcher {network_watcher_name} from subscription {AZURE_SUBSCRIPTION_ID} has no flow logs"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == network_watcher_name
            assert result[0].resource_id == network_watcher_id
            assert result[0].location == "location"

    def test_network_network_watchers_flow_logs_disabled(self):
        network_client = mock.MagicMock
        network_watcher_name = "Network Watcher Name"
        network_watcher_id = str(uuid4())

        network_client.network_watchers = {
            AZURE_SUBSCRIPTION_ID: [
                NetworkWatcher(
                    id=network_watcher_id,
                    name=network_watcher_name,
                    location="location",
                    flow_logs=[
                        FlowLog(
                            enabled=False,
                            retention_policy=RetentionPolicyParameters(days=90),
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
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_flow_log_more_than_90_days.network_flow_log_more_than_90_days import (
                network_flow_log_more_than_90_days,
            )

            check = network_flow_log_more_than_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Network Watcher {network_watcher_name} from subscription {AZURE_SUBSCRIPTION_ID} has flow logs disabled"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == network_watcher_name
            assert result[0].resource_id == network_watcher_id
            assert result[0].location == "location"

    def test_network_network_watchers_flow_logs_retention_days_80(self):
        network_client = mock.MagicMock
        network_watcher_name = "Network Watcher Name"
        network_watcher_id = str(uuid4())

        network_client.network_watchers = {
            AZURE_SUBSCRIPTION_ID: [
                NetworkWatcher(
                    id=network_watcher_id,
                    name=network_watcher_name,
                    location="location",
                    flow_logs=[
                        FlowLog(
                            enabled=True,
                            retention_policy=RetentionPolicyParameters(days=80),
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
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_flow_log_more_than_90_days.network_flow_log_more_than_90_days import (
                network_flow_log_more_than_90_days,
            )

            check = network_flow_log_more_than_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Network Watcher {network_watcher_name} from subscription {AZURE_SUBSCRIPTION_ID} flow logs retention policy is less than 90 days"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == network_watcher_name
            assert result[0].resource_id == network_watcher_id
            assert result[0].location == "location"

    def test_network_network_watchers_flow_logs_retention_days_0(self):
        network_client = mock.MagicMock
        network_watcher_name = "Network Watcher Name"
        network_watcher_id = str(uuid4())

        network_client.network_watchers = {
            AZURE_SUBSCRIPTION_ID: [
                NetworkWatcher(
                    id=network_watcher_id,
                    name=network_watcher_name,
                    location="location",
                    flow_logs=[
                        FlowLog(
                            enabled=True,
                            retention_policy=RetentionPolicyParameters(days=0),
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
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_flow_log_more_than_90_days.network_flow_log_more_than_90_days import (
                network_flow_log_more_than_90_days,
            )

            check = network_flow_log_more_than_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Network Watcher {network_watcher_name} from subscription {AZURE_SUBSCRIPTION_ID} has flow logs enabled for more than 90 days"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == network_watcher_name
            assert result[0].resource_id == network_watcher_id
            assert result[0].location == "location"

    def test_network_network_watchers_flow_logs_well_configured(self):
        network_client = mock.MagicMock
        network_watcher_name = "Network Watcher Name"
        network_watcher_id = str(uuid4())

        network_client.network_watchers = {
            AZURE_SUBSCRIPTION_ID: [
                NetworkWatcher(
                    id=network_watcher_id,
                    name=network_watcher_name,
                    location="location",
                    flow_logs=[
                        FlowLog(
                            enabled=True,
                            retention_policy=RetentionPolicyParameters(days=90),
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
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_flow_log_more_than_90_days.network_flow_log_more_than_90_days import (
                network_flow_log_more_than_90_days,
            )

            check = network_flow_log_more_than_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Network Watcher {network_watcher_name} from subscription {AZURE_SUBSCRIPTION_ID} has flow logs enabled for more than 90 days"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == network_watcher_name
            assert result[0].resource_id == network_watcher_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: network_http_internet_access_restricted_test.py]---
Location: prowler-master/tests/providers/azure/services/network/network_http_internet_access_restricted/network_http_internet_access_restricted_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.network.models import SecurityRule

from prowler.providers.azure.services.network.network_service import SecurityGroup
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_network_http_internet_access_restricted:
    def test_no_security_groups(self):
        network_client = mock.MagicMock
        network_client.security_groups = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_http_internet_access_restricted.network_http_internet_access_restricted import (
                network_http_internet_access_restricted,
            )

            check = network_http_internet_access_restricted()
            result = check.execute()
            assert len(result) == 0

    def test_network_security_groups_none_destination_port_range(self):
        network_client = mock.MagicMock
        security_group_name = "Security Group Name"
        security_group_id = str(uuid4())

        network_client.security_groups = {
            AZURE_SUBSCRIPTION_ID: [
                SecurityGroup(
                    id=security_group_id,
                    name=security_group_name,
                    location="location",
                    security_rules=[
                        SecurityRule(
                            destination_port_range=None,
                            protocol="TCP",
                            source_address_prefix="Internet",
                            access="Allow",
                            direction="Inbound",
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
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_http_internet_access_restricted.network_http_internet_access_restricted import (
                network_http_internet_access_restricted,
            )

            check = network_http_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has HTTP internet access restricted."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == security_group_name
            assert result[0].resource_id == security_group_id
            assert result[0].location == "location"

    def test_network_security_groups_invalid_security_rules(self):
        network_client = mock.MagicMock
        security_group_name = "Security Group Name"
        security_group_id = str(uuid4())

        network_client.security_groups = {
            AZURE_SUBSCRIPTION_ID: [
                SecurityGroup(
                    id=security_group_id,
                    name=security_group_name,
                    location="location",
                    security_rules=[
                        SecurityRule(
                            destination_port_range="80",
                            protocol="TCP",
                            source_address_prefix="Internet",
                            access="Allow",
                            direction="Inbound",
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
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_http_internet_access_restricted.network_http_internet_access_restricted import (
                network_http_internet_access_restricted,
            )

            check = network_http_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has HTTP internet access allowed."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == security_group_name
            assert result[0].resource_id == security_group_id
            assert result[0].location == "location"

    def test_network_security_groups_invalid_security_rules_range(self):
        network_client = mock.MagicMock
        security_group_name = "Security Group Name"
        security_group_id = str(uuid4())

        network_client.security_groups = {
            AZURE_SUBSCRIPTION_ID: [
                SecurityGroup(
                    id=security_group_id,
                    name=security_group_name,
                    location="location",
                    security_rules=[
                        SecurityRule(
                            destination_port_range="20-100",
                            protocol="TCP",
                            source_address_prefix="Internet",
                            access="Allow",
                            direction="Inbound",
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
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_http_internet_access_restricted.network_http_internet_access_restricted import (
                network_http_internet_access_restricted,
            )

            check = network_http_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has HTTP internet access allowed."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == security_group_name
            assert result[0].resource_id == security_group_id
            assert result[0].location == "location"

    def test_network_security_groups_valid_security_rules(self):
        network_client = mock.MagicMock
        security_group_name = "Security Group Name"
        security_group_id = str(uuid4())

        network_client.security_groups = {
            AZURE_SUBSCRIPTION_ID: [
                SecurityGroup(
                    id=security_group_id,
                    name=security_group_name,
                    location="location",
                    security_rules=[
                        SecurityRule(
                            destination_port_range="23",
                            protocol="TCP",
                            source_address_prefix="Internet",
                            access="Allow",
                            direction="Inbound",
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
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_http_internet_access_restricted.network_http_internet_access_restricted import (
                network_http_internet_access_restricted,
            )

            check = network_http_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has HTTP internet access restricted."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == security_group_name
            assert result[0].resource_id == security_group_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: network_public_ip_shodan_test.py]---
Location: prowler-master/tests/providers/azure/services/network/network_public_ip_shodan/network_public_ip_shodan_test.py

```python
from unittest import mock

from prowler.providers.azure.services.network.network_service import PublicIp
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_network_public_ip_shodan:
    def test_no_public_ip_addresses(self):
        network_client = mock.MagicMock
        network_client.public_ip_addresses = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
        ):
            from prowler.providers.azure.services.network.network_public_ip_shodan.network_public_ip_shodan import (
                network_public_ip_shodan,
            )

            network_client.audit_config = {"shodan_api_key": "api_key"}

            check = network_public_ip_shodan()
            result = check.execute()
            assert len(result) == 0

    def test_network_ip_in_shodan(self):
        network_client = mock.MagicMock
        public_ip_id = "id"
        public_ip_name = "name"
        ip_address = "ip_address"
        shodan_info = {
            "ports": [80, 443],
            "isp": "Microsoft Corporation",
            "country_name": "country_name",
        }

        network_client.public_ip_addresses = {
            AZURE_SUBSCRIPTION_ID: [
                PublicIp(
                    id=public_ip_id,
                    name=public_ip_name,
                    location="location",
                    ip_address=ip_address,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.network.network_service.Network",
                new=network_client,
            ) as service_client,
            mock.patch(
                "prowler.providers.azure.services.network.network_client.network_client",
                new=service_client,
            ),
            mock.patch(
                "prowler.providers.azure.services.network.network_public_ip_shodan.network_public_ip_shodan.shodan.Shodan.host",
                return_value=shodan_info,
            ),
        ):
            from prowler.providers.azure.services.network.network_public_ip_shodan.network_public_ip_shodan import (
                network_public_ip_shodan,
            )

            network_client.audit_config = {"shodan_api_key": "api_key"}
            check = network_public_ip_shodan()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Public IP {ip_address} listed in Shodan with open ports {str(shodan_info['ports'])} and ISP {shodan_info['isp']} in {shodan_info['country_name']}. More info at https://www.shodan.io/host/{ip_address}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == public_ip_name
            assert result[0].resource_id == public_ip_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

````
