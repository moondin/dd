---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 674
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 674 of 867)

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

---[FILE: network_rdp_internet_access_restricted_test.py]---
Location: prowler-master/tests/providers/azure/services/network/network_rdp_internet_access_restricted/network_rdp_internet_access_restricted_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.network.models import SecurityRule

from prowler.providers.azure.services.network.network_service import SecurityGroup
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_network_rdp_internet_access_restricted:
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
            from prowler.providers.azure.services.network.network_rdp_internet_access_restricted.network_rdp_internet_access_restricted import (
                network_rdp_internet_access_restricted,
            )

            check = network_rdp_internet_access_restricted()
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

    def test_network_security_groups_no_security_rules(self):
        network_client = mock.MagicMock
        security_group_name = "Security Group Name"
        security_group_id = str(uuid4())

        network_client.security_groups = {
            AZURE_SUBSCRIPTION_ID: [
                SecurityGroup(
                    id=security_group_id,
                    name=security_group_name,
                    location="location",
                    security_rules=[],
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
            from prowler.providers.azure.services.network.network_rdp_internet_access_restricted.network_rdp_internet_access_restricted import (
                network_rdp_internet_access_restricted,
            )

            check = network_rdp_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has RDP internet access restricted."
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
                            destination_port_range="3388",
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
            from prowler.providers.azure.services.network.network_rdp_internet_access_restricted.network_rdp_internet_access_restricted import (
                network_rdp_internet_access_restricted,
            )

            check = network_rdp_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has RDP internet access restricted."
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
                            destination_port_range="33-6000",
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
            from prowler.providers.azure.services.network.network_rdp_internet_access_restricted.network_rdp_internet_access_restricted import (
                network_rdp_internet_access_restricted,
            )

            check = network_rdp_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has RDP internet access allowed."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == security_group_name
            assert result[0].resource_id == security_group_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: network_ssh_internet_access_restricted_test.py]---
Location: prowler-master/tests/providers/azure/services/network/network_ssh_internet_access_restricted/network_ssh_internet_access_restricted_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.network.models import SecurityRule

from prowler.providers.azure.services.network.network_service import SecurityGroup
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_network_ssh_internet_access_restricted:
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
            from prowler.providers.azure.services.network.network_ssh_internet_access_restricted.network_ssh_internet_access_restricted import (
                network_ssh_internet_access_restricted,
            )

            check = network_ssh_internet_access_restricted()
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

    def test_network_security_groups_no_security_rules(self):
        network_client = mock.MagicMock
        security_group_name = "Security Group Name"
        security_group_id = str(uuid4())

        network_client.security_groups = {
            AZURE_SUBSCRIPTION_ID: [
                SecurityGroup(
                    id=security_group_id,
                    name=security_group_name,
                    location="location",
                    security_rules=[],
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
            from prowler.providers.azure.services.network.network_ssh_internet_access_restricted.network_ssh_internet_access_restricted import (
                network_ssh_internet_access_restricted,
            )

            check = network_ssh_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has SSH internet access restricted."
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
                            destination_port_range="22",
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
            from prowler.providers.azure.services.network.network_ssh_internet_access_restricted.network_ssh_internet_access_restricted import (
                network_ssh_internet_access_restricted,
            )

            check = network_ssh_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has SSH internet access allowed."
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
                            destination_port_range="20-25",
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
            from prowler.providers.azure.services.network.network_ssh_internet_access_restricted.network_ssh_internet_access_restricted import (
                network_ssh_internet_access_restricted,
            )

            check = network_ssh_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has SSH internet access allowed."
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
            from prowler.providers.azure.services.network.network_ssh_internet_access_restricted.network_ssh_internet_access_restricted import (
                network_ssh_internet_access_restricted,
            )

            check = network_ssh_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has SSH internet access restricted."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == security_group_name
            assert result[0].resource_id == security_group_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: network_udp_internet_access_restricted_test.py]---
Location: prowler-master/tests/providers/azure/services/network/network_udp_internet_access_restricted/network_udp_internet_access_restricted_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.network.models import SecurityRule

from prowler.providers.azure.services.network.network_service import SecurityGroup
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_network_udp_internet_access_restricted:
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
            from prowler.providers.azure.services.network.network_udp_internet_access_restricted.network_udp_internet_access_restricted import (
                network_udp_internet_access_restricted,
            )

            check = network_udp_internet_access_restricted()
            result = check.execute()
            assert len(result) == 0

    def test_network_security_groups_none_source_address_prefix(self):
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
                            source_address_prefix=None,
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

    def test_network_security_groups_no_security_rules(self):
        network_client = mock.MagicMock
        security_group_name = "Security Group Name"
        security_group_id = str(uuid4())

        network_client.security_groups = {
            AZURE_SUBSCRIPTION_ID: [
                SecurityGroup(
                    id=security_group_id,
                    name=security_group_name,
                    location="location",
                    security_rules=[],
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
            from prowler.providers.azure.services.network.network_udp_internet_access_restricted.network_udp_internet_access_restricted import (
                network_udp_internet_access_restricted,
            )

            check = network_udp_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has UDP internet access restricted."
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
                            protocol="UDP",
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
            from prowler.providers.azure.services.network.network_udp_internet_access_restricted.network_udp_internet_access_restricted import (
                network_udp_internet_access_restricted,
            )

            check = network_udp_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has UDP internet access allowed."
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
            from prowler.providers.azure.services.network.network_udp_internet_access_restricted.network_udp_internet_access_restricted import (
                network_udp_internet_access_restricted,
            )

            check = network_udp_internet_access_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Security Group {security_group_name} from subscription {AZURE_SUBSCRIPTION_ID} has UDP internet access restricted."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == security_group_name
            assert result[0].resource_id == security_group_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: network_watcher_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/network/network_watcher_enabled/network_watcher_enabled_test.py

```python
from unittest import mock

from prowler.providers.azure.services.network.network_service import NetworkWatcher
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    AZURE_SUBSCRIPTION_NAME,
    set_mocked_azure_provider,
)


class Test_network_watcher_enabled:
    def test_no_network_watchers(self):
        network_client = mock.MagicMock
        locations = []
        network_client.locations = {AZURE_SUBSCRIPTION_ID: locations}
        network_client.security_groups = {}
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
            from prowler.providers.azure.services.network.network_watcher_enabled.network_watcher_enabled import (
                network_watcher_enabled,
            )

            check = network_watcher_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_network_invalid_network_watchers(self):
        network_client = mock.MagicMock
        locations = ["location"]
        network_client.locations = {AZURE_SUBSCRIPTION_NAME: locations}
        network_client.subscriptions = {AZURE_SUBSCRIPTION_NAME: AZURE_SUBSCRIPTION_ID}
        network_watcher_name = "Network Watcher"
        network_watcher_id = f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/NetworkWatcher_*"

        network_client.network_watchers = {
            AZURE_SUBSCRIPTION_NAME: [
                NetworkWatcher(
                    id=network_watcher_id,
                    name=network_watcher_name,
                    location=None,
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
            from prowler.providers.azure.services.network.network_watcher_enabled.network_watcher_enabled import (
                network_watcher_enabled,
            )

            check = network_watcher_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Network Watcher is not enabled for the following locations in subscription '{AZURE_SUBSCRIPTION_NAME}': location."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_NAME
            assert result[0].resource_name == network_watcher_name
            assert result[0].resource_id == network_watcher_id
            assert result[0].location == "global"

    def test_network_valid_network_watchers(self):
        network_client = mock.MagicMock
        locations = ["location"]
        network_client.locations = {AZURE_SUBSCRIPTION_NAME: locations}
        network_client.subscriptions = {AZURE_SUBSCRIPTION_NAME: AZURE_SUBSCRIPTION_ID}
        network_watcher_name = "Network Watcher"
        network_watcher_id = f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/NetworkWatcher_*"

        network_client.network_watchers = {
            AZURE_SUBSCRIPTION_NAME: [
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
            from prowler.providers.azure.services.network.network_watcher_enabled.network_watcher_enabled import (
                network_watcher_enabled,
            )

            check = network_watcher_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Network Watcher is enabled for all locations in subscription '{AZURE_SUBSCRIPTION_NAME}'."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_NAME
            assert result[0].resource_name == network_watcher_name
            assert result[0].resource_id == network_watcher_id
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

````
