---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 756
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 756 of 867)

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

---[FILE: compute_service_test_for_nhn.py]---
Location: prowler-master/tests/providers/nhn/services/compute/compute_service_test_for_nhn.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.nhn.services.compute.compute_service import NHNComputeService
from tests.providers.nhn.nhn_fixtures import set_mocked_nhn_provider


class TestNHNComputeService:
    @patch("prowler.providers.nhn.services.compute.compute_service.logger")
    def test_compute_service_basic(self, mock_logger):
        """
        Test that NHNComputeService properly calls _list_servers(),
        _get_server_detail() for each server, and populates self.instances.
        """
        # create a mocked NHN Provider
        provider = set_mocked_nhn_provider(
            username="testUser",
            password="testPass",
            tenant_id="tenant123",
        )

        # define mocked responses
        mocked_response_servers = MagicMock()
        mocked_response_servers.status_code = 200
        mocked_response_servers.json.return_value = {
            "servers": [
                {"id": "server1", "name": "myserver1"},
                {"id": "server2", "name": "myserver2"},
            ]
        }

        mocked_response_server1 = MagicMock()
        mocked_response_server1.status_code = 200
        mocked_response_server1.json.return_value = {
            "server": {
                "addresses": {
                    "vpc1": [
                        {"OS-EXT-IPS:type": "floating"},
                    ]
                },
                "security_groups": [{"name": "default"}],
                "metadata": {"login_username": "root"},
            }
        }

        mocked_response_server2 = MagicMock()
        mocked_response_server2.status_code = 200
        mocked_response_server2.json.return_value = {
            "server": {
                "addresses": {
                    "vpc1": [
                        {"OS-EXT-IPS:type": "fixed"},
                    ]
                },
                "security_groups": [{"name": "default"}, {"name": "other-sg"}],
                "metadata": {"login_username": "regularuser"},
            }
        }

        def get_side_effect(url, timeout=10):
            print(f"Called with timeout={timeout}")
            if (
                "/v2/tenant123/servers" in url
                and not url.endswith("server1")
                and not url.endswith("server2")
            ):
                return mocked_response_servers
            elif url.endswith("server1"):
                return mocked_response_server1
            elif url.endswith("server2"):
                return mocked_response_server2
            else:
                mock_404 = MagicMock()
                mock_404.status_code = 404
                mock_404.text = "Not Found"
                return mock_404

        provider.session.get.side_effect = get_side_effect

        # create NHNComputeService, which internally calls _get_instances()
        compute_service = NHNComputeService(provider)

        assert len(compute_service.instances) == 2

        # first instance
        inst1 = compute_service.instances[0]
        assert inst1.id == "server1"
        assert inst1.name == "myserver1"
        assert inst1.public_ip is True
        assert inst1.security_groups is True
        assert inst1.login_user is True

        # second instance
        inst2 = compute_service.instances[1]
        assert inst2.id == "server2"
        assert inst2.name == "myserver2"
        assert inst2.public_ip is False
        assert inst2.security_groups is False
        assert inst2.login_user is False

        mock_logger.error.assert_not_called()
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_login_user_test_for_nhn.py]---
Location: prowler-master/tests/providers/nhn/services/compute/compute_instance_login_user/compute_instance_login_user_test_for_nhn.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.nhn.services.compute.compute_service import Instance
from tests.providers.nhn.nhn_fixtures import set_mocked_nhn_provider


class Test_compute_instance_login_user:
    def test_no_instances(self):
        # 1) Make a MagicMock for compute_client
        compute_client = mock.MagicMock()
        compute_client.instances = []

        # 2) Patch get_global_provider() to return a mocked NHN provider
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                # patch the 'compute_instance_login_user.compute_client' used in the check code
                "prowler.providers.nhn.services.compute.compute_instance_login_user.compute_instance_login_user.compute_client",
                new=compute_client,
            ),
        ):
            # 3) Import the check code AFTER patching
            from prowler.providers.nhn.services.compute.compute_instance_login_user.compute_instance_login_user import (
                compute_instance_login_user,
            )

            # 4) Run the check
            check = compute_instance_login_user()
            result = check.execute()

            # 5) Assertions
            assert len(result) == 0  # no instances => no findings

    def test_has_instance_non_admin_login(self):
        # Make a MagicMock for compute_client
        compute_client = mock.MagicMock()

        # Suppose we have 1 instance with login_user=False => PASS expected
        instance_id = str(uuid4())
        instance_name = "testVM"
        mock_instance = mock.MagicMock(spec=Instance)
        mock_instance.id = instance_id
        mock_instance.name = instance_name
        mock_instance.login_user = False  # => means not admin login
        compute_client.instances = [mock_instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.compute.compute_instance_login_user.compute_instance_login_user.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.nhn.services.compute.compute_instance_login_user.compute_instance_login_user import (
                compute_instance_login_user,
            )

            check = compute_instance_login_user()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "has an appropriate login user" in result[0].status_extended
            assert result[0].resource_name == instance_name
            assert result[0].resource_id == instance_id

    def test_has_instance_admin_login(self):
        # Another scenario: instance with login_user=True => FAIL expected
        compute_client = mock.MagicMock()

        instance_id = str(uuid4())
        instance_name = "rootVM"
        mock_instance = mock.MagicMock(spec=Instance)
        mock_instance.id = instance_id
        mock_instance.name = instance_name
        mock_instance.login_user = True  # => admin or root user
        compute_client.instances = [mock_instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.compute.compute_instance_login_user.compute_instance_login_user.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.nhn.services.compute.compute_instance_login_user.compute_instance_login_user import (
                compute_instance_login_user,
            )

            check = compute_instance_login_user()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                "has an Administrative(admin/root) login user"
                in result[0].status_extended
            )
            assert result[0].resource_name == instance_name
            assert result[0].resource_id == instance_id
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_public_ip_test_for_nhn.py]---
Location: prowler-master/tests/providers/nhn/services/compute/compute_instance_public_ip/compute_instance_public_ip_test_for_nhn.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.nhn.services.compute.compute_service import Instance
from tests.providers.nhn.nhn_fixtures import set_mocked_nhn_provider


class Test_compute_instance_public_ip:
    def test_no_instances(self):
        # 1) Make a MagicMock for compute_client
        compute_client = mock.MagicMock()
        compute_client.instances = []

        # 2) Patch get_global_provider() to return a mocked NHN provider
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                # patch the 'compute_instance_public_ip.compute_client' used in the check code
                "prowler.providers.nhn.services.compute.compute_instance_public_ip.compute_instance_public_ip.compute_client",
                new=compute_client,
            ),
        ):
            # 3) Import the check code AFTER patching
            from prowler.providers.nhn.services.compute.compute_instance_public_ip.compute_instance_public_ip import (
                compute_instance_public_ip,
            )

            # 4) Run the check
            check = compute_instance_public_ip()
            result = check.execute()

            # 5) Assertions
            assert len(result) == 0  # no instances => no findings

    def test_has_instance_non_public_ip(self):
        # Make a MagicMock for compute_client
        compute_client = mock.MagicMock()

        # Suppose we have 1 instance with public_ip=False => PASS expected
        instance_id = str(uuid4())
        instance_name = "testVM"
        mock_instance = mock.MagicMock(spec=Instance)
        mock_instance.id = instance_id
        mock_instance.name = instance_name
        mock_instance.public_ip = False  # => means does not have public IP
        compute_client.instances = [mock_instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.compute.compute_instance_public_ip.compute_instance_public_ip.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.nhn.services.compute.compute_instance_public_ip.compute_instance_public_ip import (
                compute_instance_public_ip,
            )

            check = compute_instance_public_ip()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "does not have a public IP" in result[0].status_extended
            assert result[0].resource_name == instance_name
            assert result[0].resource_id == instance_id

    def test_has_instance_public_ip(self):
        # Another scenario: instance with public_ip=True => FAIL expected
        compute_client = mock.MagicMock()

        instance_id = str(uuid4())
        instance_name = "rootVM"
        mock_instance = mock.MagicMock(spec=Instance)
        mock_instance.id = instance_id
        mock_instance.name = instance_name
        mock_instance.public_ip = True  # => means has public IP
        compute_client.instances = [mock_instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.compute.compute_instance_public_ip.compute_instance_public_ip.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.nhn.services.compute.compute_instance_public_ip.compute_instance_public_ip import (
                compute_instance_public_ip,
            )

            check = compute_instance_public_ip()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "has a public IP" in result[0].status_extended
            assert result[0].resource_name == instance_name
            assert result[0].resource_id == instance_id
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_security_groups_test_for_nhn.py]---
Location: prowler-master/tests/providers/nhn/services/compute/compute_instance_security__groups/compute_instance_security_groups_test_for_nhn.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.nhn.services.compute.compute_service import Instance
from tests.providers.nhn.nhn_fixtures import set_mocked_nhn_provider


class Test_compute_instance_security_groups:
    def test_no_instances(self):
        # 1) Make a MagicMock for compute_client
        compute_client = mock.MagicMock()
        compute_client.instances = []

        # 2) Patch get_global_provider() to return a mocked NHN provider
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                # patch the 'compute_instance_security_groups.compute_client' used in the check code
                "prowler.providers.nhn.services.compute.compute_instance_security_groups.compute_instance_security_groups.compute_client",
                new=compute_client,
            ),
        ):
            # 3) Import the check code AFTER patching
            from prowler.providers.nhn.services.compute.compute_instance_security_groups.compute_instance_security_groups import (
                compute_instance_security_groups,
            )

            # 4) Run the check
            check = compute_instance_security_groups()
            result = check.execute()

            # 5) Assertions
            assert len(result) == 0  # no instances => no findings

    def test_has_instance_variety_security_groups(self):
        # Make a MagicMock for compute_client
        compute_client = mock.MagicMock()

        # Suppose we have 1 instance with security_groups=False => PASS expected
        instance_id = str(uuid4())
        instance_name = "testVM"
        mock_instance = mock.MagicMock(spec=Instance)
        mock_instance.id = instance_id
        mock_instance.name = instance_name
        mock_instance.security_groups = False  # => means has variety of security groups
        compute_client.instances = [mock_instance]
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.compute.compute_instance_security_groups.compute_instance_security_groups.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.nhn.services.compute.compute_instance_security_groups.compute_instance_security_groups import (
                compute_instance_security_groups,
            )

            check = compute_instance_security_groups()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "has a variety of security groups" in result[0].status_extended
            assert result[0].resource_name == instance_name
            assert result[0].resource_id == instance_id

    def test_has_instance_security_groups(self):
        # Another scenario: instance with security_groups=True => FAIL expected
        compute_client = mock.MagicMock()

        instance_id = str(uuid4())
        instance_name = "rootVM"
        mock_instance = mock.MagicMock(spec=Instance)
        mock_instance.id = instance_id
        mock_instance.name = instance_name
        mock_instance.security_groups = (
            True  # => means has only the default security group
        )
        compute_client.instances = [mock_instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.compute.compute_instance_security_groups.compute_instance_security_groups.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.nhn.services.compute.compute_instance_security_groups.compute_instance_security_groups import (
                compute_instance_security_groups,
            )

            check = compute_instance_security_groups()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "has only the default security group" in result[0].status_extended
            assert result[0].resource_name == instance_name
            assert result[0].resource_id == instance_id
```

--------------------------------------------------------------------------------

---[FILE: network_service_test_for_nhn.py]---
Location: prowler-master/tests/providers/nhn/services/network/network_service_test_for_nhn.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.nhn.services.network.network_service import NHNNetworkService
from tests.providers.nhn.nhn_fixtures import set_mocked_nhn_provider


class TestNHNNetworkService:
    @patch("prowler.providers.nhn.services.network.network_service.logger")
    def test_network_service_basic(self, mock_logger):
        """
        Test that NHNNetworkService correctly calls _list_vpcs(),
        _get_vpc_detail() for each VPC, and populates self.networks and self.subnets.
        """
        # create a mocked NHN Provider
        provider = set_mocked_nhn_provider(
            username="testUser",
            password="testPass",
            tenant_id="tenant123",
        )

        # define mocked responses for VPCs and Subnets
        mocked_response_vpcs = MagicMock()
        mocked_response_vpcs.status_code = 200
        mocked_response_vpcs.json.return_value = {
            "vpcs": [
                {"id": "vpc1", "name": "myvpc1"},
                {"id": "vpc2", "name": "myvpc2"},
            ]
        }

        mocked_response_vpc1 = MagicMock()
        mocked_response_vpc1.status_code = 200
        mocked_response_vpc1.json.return_value = {
            "vpc": {
                "routingtables": [],
                "subnets": [
                    {"name": "subnet1", "router:external": True, "enable_dhcp": False},
                ],
            }
        }

        mocked_response_vpc2 = MagicMock()
        mocked_response_vpc2.status_code = 200
        mocked_response_vpc2.json.return_value = {
            "vpc": {
                "routingtables": [{"id": "rt1"}],
                "subnets": [
                    {"name": "subnet2", "router:external": False, "enable_dhcp": True},
                ],
            }
        }

        def get_side_effect(url, timeout=10):
            print(f"Called with timeout={timeout}")
            if (
                "/v2.0/vpcs" in url
                and not url.endswith("vpc1")
                and not url.endswith("vpc2")
            ):
                return mocked_response_vpcs
            elif url.endswith("vpc1"):
                return mocked_response_vpc1
            elif url.endswith("vpc2"):
                return mocked_response_vpc2
            else:
                mock_404 = MagicMock()
                mock_404.status_code = 404
                mock_404.text = "Not Found"
                return mock_404

        provider.session.get.side_effect = get_side_effect

        # create NHNNetworkService, which internally calls _get_networks() and _get_subnets()
        network_service = NHNNetworkService(provider)

        assert len(network_service.networks) == 2

        # first network
        net1 = network_service.networks[0]
        assert net1.id == "vpc1"
        assert net1.name == "myvpc1"
        assert net1.empty_routingtables is True
        assert len(net1.subnets) == 1
        assert net1.subnets[0].name == "subnet1"
        assert net1.subnets[0].external_router is True
        assert net1.subnets[0].enable_dhcp is False

        # second network
        net2 = network_service.networks[1]
        assert net2.id == "vpc2"
        assert net2.name == "myvpc2"
        assert net2.empty_routingtables is False  # Assuming there's a routing table
        assert len(net2.subnets) == 1
        assert net2.subnets[0].name == "subnet2"
        assert net2.subnets[0].external_router is False
        assert net2.subnets[0].enable_dhcp is True

        mock_logger.error.assert_not_called()
```

--------------------------------------------------------------------------------

---[FILE: network_vpc_has_empty_routingtables_test_for_nhn.py]---
Location: prowler-master/tests/providers/nhn/services/network/network_vpc_has_empty_routingtables/network_vpc_has_empty_routingtables_test_for_nhn.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.nhn.services.network.network_service import Network
from tests.providers.nhn.nhn_fixtures import set_mocked_nhn_provider


class Test_vpc_has_empty_routingtables:
    def test_no_networks(self):
        # 1) Make a MagicMock for network_client
        network_client = mock.MagicMock()
        network_client.networks = []

        # 2) Patch get_global_provider() to return a mocked NHN provider
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                # patch the 'network_empty_routingtables.network_client' used in the check code
                "prowler.providers.nhn.services.network.network_vpc_has_empty_routingtables.network_vpc_has_empty_routingtables.network_client",
                new=network_client,
            ),
        ):
            # 3) Import the check code AFTER patching
            from prowler.providers.nhn.services.network.network_vpc_has_empty_routingtables.network_vpc_has_empty_routingtables import (
                network_vpc_has_empty_routingtables,
            )

            # 4) Run the check
            check = network_vpc_has_empty_routingtables()
            result = check.execute()

            # 5) Assertions
            assert len(result) == 0  # no networks => no findings

    def test_vpc_has_empty_routingtables(self):
        # Make a MagicMock for network_client
        network_client = mock.MagicMock()

        # Suppose we have 1 network with empty_routingtables=True => FAIL expected
        network_id = str(uuid4())
        network_name = "testNetwork"
        mock_network = mock.MagicMock(spec=Network)
        mock_network.id = network_id
        mock_network.name = network_name
        mock_network.empty_routingtables = True
        network_client.networks = [mock_network]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.network.network_vpc_has_empty_routingtables.network_vpc_has_empty_routingtables.network_client",
                new=network_client,
            ),
        ):
            from prowler.providers.nhn.services.network.network_vpc_has_empty_routingtables.network_vpc_has_empty_routingtables import (
                network_vpc_has_empty_routingtables,
            )

            check = network_vpc_has_empty_routingtables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "has empty routingtables" in result[0].status_extended
            assert result[0].resource_name == network_name
            assert result[0].resource_id == network_id

    def test_vpc_does_not_have_empty_routingtables(self):
        # Another scenario: network with empty_routingtables=False => PASS expected
        network_client = mock.MagicMock()

        network_id = str(uuid4())
        network_name = "testNetwork"
        mock_network = mock.MagicMock(spec=Network)
        mock_network.id = network_id
        mock_network.name = network_name
        mock_network.empty_routingtables = False
        network_client.networks = [mock_network]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.network.network_vpc_has_empty_routingtables.network_vpc_has_empty_routingtables.network_client",
                new=network_client,
            ),
        ):
            from prowler.providers.nhn.services.network.network_vpc_has_empty_routingtables.network_vpc_has_empty_routingtables import (
                network_vpc_has_empty_routingtables,
            )

            check = network_vpc_has_empty_routingtables()
            result = check.execute()

            assert len(result) == 0
            assert result[0].status == "PASS"
            assert "dose not have empty routingtables" in result[0].status_extended
            assert result[0].resource_name == network_name
            assert result[0].resource_id == network_id
```

--------------------------------------------------------------------------------

---[FILE: network_vpc_subnet_enable_dhcp_for_nhn.py]---
Location: prowler-master/tests/providers/nhn/services/network/network_vpc_subnet_enable_dhcp/network_vpc_subnet_enable_dhcp_for_nhn.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.nhn.services.network.network_service import Network, Subnet
from tests.providers.nhn.nhn_fixtures import set_mocked_nhn_provider


class Test_network_vpc_subnet_enable_dhcp:
    def test_no_networks(self):
        # 1) Make a MagicMock for network_client
        network_client = mock.MagicMock()
        network_client.networks = []

        # 2) Patch get_global_provider() to return a mocked NHN provider
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                # patch the 'network_vpc_subnet_enable_dhcp.network_client' used in the check code
                "prowler.providers.nhn.services.network.network_vpc_subnet_enable_dhcp.network_vpc_subnet_enable_dhcp.network_client",
                new=network_client,
            ),
        ):
            # 3) Import the check code AFTER patching
            from prowler.providers.nhn.services.network.network_vpc_subnet_enable_dhcp.network_vpc_subnet_enable_dhcp import (
                network_vpc_subnet_enable_dhcp,
            )

            # 4) Run the check
            check = network_vpc_subnet_enable_dhcp()
            result = check.execute()

            # 5) Assertions
            assert len(result) == 0  # no networks => no findings

    def test_vpc_subnet_enable_dhcp(self):
        # Make a MagicMock for network_client
        network_client = mock.MagicMock()

        # Suppose we have 1 network with enable_dhcp=True => FAIL expected
        network_id = str(uuid4())
        network_name = "testNetwork"
        mock_network = mock.MagicMock(spec=Network)
        mock_network.id = network_id
        mock_network.name = network_name
        mock_subnet = mock.MagicMock(spec=Subnet)
        mock_subnet.name = "subnet1"
        mock_subnet.enable_dhcp = True
        mock_network.subnets = [mock_subnet]
        network_client.networks = [mock_network]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.network.network_vpc_subnet_enable_dhcp.network_vpc_subnet_enable_dhcp.network_client",
                new=network_client,
            ),
        ):
            from prowler.providers.nhn.services.network.network_vpc_subnet_enable_dhcp.network_vpc_subnet_enable_dhcp import (
                network_vpc_subnet_enable_dhcp,
            )

            check = network_vpc_subnet_enable_dhcp()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "has DHCP enabled" in result[0].status_extended
            assert result[0].resource_name == network_name
            assert result[0].resource_id == network_id

    def test_vpc_subnet_unable_dhcp(self):
        # Another scenario: network with enable_dhcp=False => PASS expected
        network_client = mock.MagicMock()

        network_id = str(uuid4())
        network_name = "testNetwork"
        mock_network = mock.MagicMock(spec=Network)
        mock_network.id = network_id
        mock_network.name = network_name
        mock_subnet = mock.MagicMock(spec=Subnet)
        mock_subnet.name = "subnet1"
        mock_subnet.enable_dhcp = False
        mock_network.subnets = [mock_subnet]
        network_client.networks = [mock_network]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.network.network_vpc_subnet_enable_dhcp.network_vpc_subnet_enable_dhcp.network_client",
                new=network_client,
            ),
        ):
            from prowler.providers.nhn.services.network.network_vpc_subnet_enable_dhcp.network_vpc_subnet_enable_dhcp import (
                network_vpc_subnet_enable_dhcp,
            )

            check = network_vpc_subnet_enable_dhcp()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "does not have DHCP enabled" in result[0].status_extended
            assert result[0].resource_name == network_name
            assert result[0].resource_id == network_id
```

--------------------------------------------------------------------------------

---[FILE: network_vpc_subnet_has_external_router_for_nhn.py]---
Location: prowler-master/tests/providers/nhn/services/network/network_vpc_subnet_has_external_router/network_vpc_subnet_has_external_router_for_nhn.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.nhn.services.network.network_service import Network, Subnet
from tests.providers.nhn.nhn_fixtures import set_mocked_nhn_provider


class Test_network_vpc_subnet_has_external_router:
    def test_no_networks(self):
        network_client = mock.MagicMock()
        network_client.networks = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.network.network_vpc_subnet_has_external_router.network_vpc_subnet_has_external_router.network_client",
                new=network_client,
            ),
        ):
            from prowler.providers.nhn.services.network.network_vpc_subnet_has_external_router.network_vpc_subnet_has_external_router import (
                network_vpc_subnet_has_external_router,
            )

            check = network_vpc_subnet_has_external_router()
            result = check.execute()

            assert len(result) == 0

    def test_vpc_subnet_has_external_router(self):
        network_client = mock.MagicMock()

        network_id = str(uuid4())
        network_name = "testNetwork"
        mock_network = mock.MagicMock(spec=Network)
        mock_network.id = network_id
        mock_network.name = network_name
        mock_subnet = mock.MagicMock(spec=Subnet)
        mock_subnet.name = "subnet1"
        mock_subnet.external_router = True
        mock_network.subnets = [mock_subnet]
        network_client.networks = [mock_network]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.network.network_vpc_subnet_has_external_router.network_vpc_subnet_has_external_router.network_client",
                new=network_client,
            ),
        ):
            from prowler.providers.nhn.services.network.network_vpc_subnet_has_external_router.network_vpc_subnet_has_external_router import (
                network_vpc_subnet_has_external_router,
            )

            check = network_vpc_subnet_has_external_router()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "has external router" in result[0].status_extended
            assert result[0].resource_id == network_id
            assert result[0].resource_name == network_name

    def test_vpc_subnet_no_external_router(self):
        network_client = mock.MagicMock()

        network_id = str(uuid4())
        network_name = "testNetwork"
        mock_network = mock.MagicMock(spec=Network)
        mock_network.id = network_id
        mock_network.name = network_name
        mock_subnet = mock.MagicMock(spec=Subnet)
        mock_subnet.name = "subnet1"
        mock_subnet.external_router = False
        mock_network.subnets = [mock_subnet]
        network_client.networks = [mock_network]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_nhn_provider(),
            ),
            mock.patch(
                "prowler.providers.nhn.services.network.network_vpc_subnet_has_external_router.network_vpc_subnet_has_external_router.network_client",
                new=network_client,
            ),
        ):
            from prowler.providers.nhn.services.network.network_vpc_subnet_has_external_router.network_vpc_subnet_has_external_router import (
                network_vpc_subnet_has_external_router,
            )

            check = network_vpc_subnet_has_external_router()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "no external router" in result[0].status_extended
            assert result[0].resource_id == network_id
            assert result[0].resource_name == network_name
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: prowler-master/tests/providers/oraclecloud/conftest.py

```python
"""
Pytest configuration for OCI provider tests.

This file sets up mocking for OCI SDK imports to avoid dependency issues
when running tests without full OCI SDK installation.
"""

import sys
from unittest.mock import MagicMock


# Mock the OCI module and its submodules to avoid import errors
# when cffi_backend is not available
class MockOCIModule(MagicMock):
    """Mock OCI module to avoid import errors"""

    def __getattr__(self, name):
        return MagicMock()


# Only mock if oraclecloud import fails (missing dependencies)
try:
    pass
except (ImportError, ModuleNotFoundError):
    # Create mock OCI module
    mock_oci = MockOCIModule()
    sys.modules["oraclecloud"] = mock_oci
    sys.modules["oraclecloud.auth"] = mock_oci.auth
    sys.modules["oraclecloud.config"] = mock_oci.config
    sys.modules["oraclecloud.identity"] = mock_oci.identity
    sys.modules["oraclecloud.core"] = mock_oci.core
    sys.modules["oraclecloud.object_storage"] = mock_oci.object_storage
    sys.modules["oraclecloud.key_management"] = mock_oci.key_management
    sys.modules["oraclecloud.file_storage"] = mock_oci.file_storage
    sys.modules["oraclecloud.block_storage"] = mock_oci.block_storage
    sys.modules["oraclecloud.database"] = mock_oci.database
    sys.modules["oraclecloud.events"] = mock_oci.events
    sys.modules["oraclecloud.cloud_guard"] = mock_oci.cloud_guard
    sys.modules["oraclecloud.audit"] = mock_oci.audit
    sys.modules["oraclecloud.analytics"] = mock_oci.analytics
    sys.modules["oraclecloud.integration"] = mock_oci.integration
    sys.modules["oraclecloud.logging"] = mock_oci.logging
    sys.modules["oraclecloud.pagination"] = mock_oci.pagination
    sys.modules["oraclecloud.exceptions"] = mock_oci.exceptions
```

--------------------------------------------------------------------------------

---[FILE: oci_fixtures.py]---
Location: prowler-master/tests/providers/oraclecloud/oci_fixtures.py

```python
from datetime import datetime
from unittest.mock import MagicMock

from prowler.providers.common.models import Audit_Metadata
from prowler.providers.oraclecloud.models import (
    OCICompartment,
    OCIIdentityInfo,
    OCIRegionalClient,
    OCISession,
)

OCI_TENANCY_ID = "ocid1.tenancy.oc1..aaaaaaaexample"
OCI_TENANCY_NAME = "test-tenancy"
OCI_COMPARTMENT_ID = "ocid1.compartment.oc1..aaaaaaaexample"
OCI_USER_ID = "ocid1.user.oc1..aaaaaaaexample"
OCI_REGION = "us-ashburn-1"


def set_mocked_oraclecloud_provider(
    tenancy_id: str = OCI_TENANCY_ID,
    tenancy_name: str = OCI_TENANCY_NAME,
    user_id: str = OCI_USER_ID,
    region: str = OCI_REGION,
) -> MagicMock:
    """Create a mocked OCI provider for testing"""
    provider = MagicMock()
    provider.type = "oraclecloud"

    # Mock session
    provider.session = OCISession(
        config={
            "tenancy": tenancy_id,
            "user": user_id,
            "region": region,
            "fingerprint": "aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99",
        },
        signer=MagicMock(),
        profile="DEFAULT",
    )

    # Mock identity
    provider.identity = OCIIdentityInfo(
        tenancy_id=tenancy_id,
        tenancy_name=tenancy_name,
        user_id=user_id,
        region=region,
        profile="DEFAULT",
        audited_regions={region},
        audited_compartments=[OCI_COMPARTMENT_ID],
    )

    # Mock compartments
    provider.compartments = {
        tenancy_id: OCICompartment(
            id=tenancy_id,
            name="root",
            lifecycle_state="ACTIVE",
            time_created=datetime.now(),
        ),
        OCI_COMPARTMENT_ID: OCICompartment(
            id=OCI_COMPARTMENT_ID,
            name="test-compartment",
            lifecycle_state="ACTIVE",
            time_created=datetime.now(),
        ),
    }

    # Mock regions
    provider.regions = [region]

    # Mock audit metadata
    provider.audit_metadata = Audit_Metadata(
        services_scanned=0,
        expected_checks=[],
        completed_checks=0,
        audit_progress=0,
    )

    # Mock config
    provider.audit_config = {}
    provider.fixer_config = {}

    # Mock mutelist
    provider.mutelist = MagicMock()
    provider.mutelist.is_muted = MagicMock(return_value=False)

    # Mock generate_regional_clients method
    def mock_generate_regional_clients(service_name):
        return {
            region: OCIRegionalClient(
                client=MagicMock(),
                region=region,
            )
        }

    provider.generate_regional_clients = mock_generate_regional_clients

    return provider
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: prowler-master/tests/providers/oraclecloud/__init__.py

```python
# OCI Provider Tests
```

--------------------------------------------------------------------------------

````
