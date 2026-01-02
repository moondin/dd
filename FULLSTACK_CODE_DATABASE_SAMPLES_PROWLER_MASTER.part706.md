---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 706
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 706 of 867)

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

---[FILE: compute_network_dns_logging_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_network_dns_logging_enabled/compute_network_dns_logging_enabled_test.py

```python
from re import search
from unittest import mock

from prowler.providers.gcp.services.dns.dns_service import Policy
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_network_dns_logging_enabled:
    def test_compute_no_networks(self):
        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.networks = []
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_dns_logging_enabled.compute_network_dns_logging_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_network_dns_logging_enabled.compute_network_dns_logging_enabled import (
                compute_network_dns_logging_enabled,
            )

            check = compute_network_dns_logging_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_network(self):
        from prowler.providers.gcp.services.compute.compute_service import Network

        network = Network(
            name="test", id="test_id", project_id=GCP_PROJECT_ID, subnet_mode="auto"
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.networks = [network]
        compute_client.region = "global"

        policy = Policy(
            name="test",
            id="test_id",
            logging=True,
            networks=["test"],
            project_id=GCP_PROJECT_ID,
        )

        dns_client = mock.MagicMock()
        dns_client.project_ids = [GCP_PROJECT_ID]
        dns_client.policies = [policy]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_dns_logging_enabled.compute_network_dns_logging_enabled.compute_client",
                new=compute_client,
            ),
        ):
            with mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_dns_logging_enabled.compute_network_dns_logging_enabled.dns_client",
                new=dns_client,
            ):
                from prowler.providers.gcp.services.compute.compute_network_dns_logging_enabled.compute_network_dns_logging_enabled import (
                    compute_network_dns_logging_enabled,
                )

                check = compute_network_dns_logging_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert search(
                    "has DNS logging enabled",
                    result[0].status_extended,
                )
                assert result[0].resource_id == network.id
                assert result[0].resource_name == network.name
                assert result[0].project_id == GCP_PROJECT_ID
                assert result[0].location == compute_client.region

    def test_one_uncompliant_network(self):
        from prowler.providers.gcp.services.compute.compute_service import Network

        network = Network(
            name="test", id="test_id", project_id=GCP_PROJECT_ID, subnet_mode="auto"
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.networks = [network]
        compute_client.region = "global"

        policy = Policy(
            name="test",
            id="test_id",
            logging=False,
            networks=["test"],
            project_id=GCP_PROJECT_ID,
        )

        dns_client = mock.MagicMock()
        dns_client.project_ids = [GCP_PROJECT_ID]
        dns_client.policies = [policy]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_dns_logging_enabled.compute_network_dns_logging_enabled.compute_client",
                new=compute_client,
            ),
        ):
            with mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_dns_logging_enabled.compute_network_dns_logging_enabled.dns_client",
                new=dns_client,
            ):
                from prowler.providers.gcp.services.compute.compute_network_dns_logging_enabled.compute_network_dns_logging_enabled import (
                    compute_network_dns_logging_enabled,
                )

                check = compute_network_dns_logging_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert search(
                    "does not have DNS logging enabled",
                    result[0].status_extended,
                )
                assert result[0].resource_id == network.id
                assert result[0].resource_name == network.name
                assert result[0].project_id == GCP_PROJECT_ID
                assert result[0].location == compute_client.region
```

--------------------------------------------------------------------------------

---[FILE: compute_network_not_legacy_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_network_not_legacy/compute_network_not_legacy_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_network_not_legacy:
    def test_compute_no_networks(self):
        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.networks = []
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_not_legacy.compute_network_not_legacy.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_network_not_legacy.compute_network_not_legacy import (
                compute_network_not_legacy,
            )

            check = compute_network_not_legacy()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_network(self):
        from prowler.providers.gcp.services.compute.compute_service import Network

        network = Network(
            name="test",
            id="test_id",
            project_id=GCP_PROJECT_ID,
            subnet_mode="custom",
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.networks = [network]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_not_legacy.compute_network_not_legacy.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_network_not_legacy.compute_network_not_legacy import (
                compute_network_not_legacy,
            )

            check = compute_network_not_legacy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "Network test is not legacy",
                result[0].status_extended,
            )
            assert result[0].resource_id == network.id
            assert result[0].resource_name == network.name
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == compute_client.region

    def test_one_legacy_network(self):
        from prowler.providers.gcp.services.compute.compute_service import Network

        network = Network(
            name="test",
            id="test_id",
            project_id=GCP_PROJECT_ID,
            subnet_mode="legacy",
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.networks = [network]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_not_legacy.compute_network_not_legacy.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_network_not_legacy.compute_network_not_legacy import (
                compute_network_not_legacy,
            )

            check = compute_network_not_legacy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "Legacy network test exists",
                result[0].status_extended,
            )
            assert result[0].resource_id == network.id
            assert result[0].resource_name == network.name
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == compute_client.region
```

--------------------------------------------------------------------------------

---[FILE: compute_project_os_login_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_project_os_login_enabled/compute_project_os_login_enabled_test.py

```python
from re import search
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_project_os_login_enabled:
    def test_compute_no_project(self):
        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.projects = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_project_os_login_enabled.compute_project_os_login_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_project_os_login_enabled.compute_project_os_login_enabled import (
                compute_project_os_login_enabled,
            )

            check = compute_project_os_login_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_project(self):
        from prowler.providers.gcp.services.compute.compute_service import Project

        project = Project(
            id=GCP_PROJECT_ID,
            enable_oslogin=True,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.compute_projects = [project]
        compute_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_project_os_login_enabled.compute_project_os_login_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_project_os_login_enabled.compute_project_os_login_enabled import (
                compute_project_os_login_enabled,
            )

            check = compute_project_os_login_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Project {project.id} has OS Login enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == project.id
            assert result[0].resource_name == "test"
            assert result[0].location == "global"
            assert result[0].project_id == GCP_PROJECT_ID

    def test_one_non_compliant_project(self):
        from prowler.providers.gcp.services.compute.compute_service import Project

        project = Project(
            id=GCP_PROJECT_ID,
            enable_oslogin=False,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.compute_projects = [project]
        compute_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_project_os_login_enabled.compute_project_os_login_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_project_os_login_enabled.compute_project_os_login_enabled import (
                compute_project_os_login_enabled,
            )

            check = compute_project_os_login_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Project {project.id} does not have OS Login enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == project.id
            assert result[0].resource_name == "test"
            assert result[0].location == "global"
            assert result[0].project_id == GCP_PROJECT_ID

    def test_one_compliant_project_empty_project_name(self):
        from prowler.providers.gcp.services.compute.compute_service import Project

        project = Project(
            id=GCP_PROJECT_ID,
            enable_oslogin=True,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.compute_projects = [project]
        compute_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_project_os_login_enabled.compute_project_os_login_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_project_os_login_enabled.compute_project_os_login_enabled import (
                compute_project_os_login_enabled,
            )

            check = compute_project_os_login_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Project {project.id} has OS Login enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == project.id
            assert result[0].resource_name == "GCP Project"
            assert result[0].location == "global"
            assert result[0].project_id == GCP_PROJECT_ID

    def test_one_non_compliant_project_empty_project_name(self):
        from prowler.providers.gcp.services.compute.compute_service import Project

        project = Project(
            id=GCP_PROJECT_ID,
            enable_oslogin=False,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.compute_projects = [project]
        compute_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_project_os_login_enabled.compute_project_os_login_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_project_os_login_enabled.compute_project_os_login_enabled import (
                compute_project_os_login_enabled,
            )

            check = compute_project_os_login_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Project {project.id} does not have OS Login enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == project.id
            assert result[0].resource_name == "GCP Project"
            assert result[0].location == "global"
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: compute_public_address_shodan_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_public_address_shodan/compute_public_address_shodan_test.py

```python
from unittest import mock

from prowler.providers.gcp.services.compute.compute_service import Address
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_public_address_shodan:
    def test_no_public_ip_addresses(self):
        compute_client = mock.MagicMock()
        compute_client.addresses = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_public_address_shodan.compute_public_address_shodan.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_public_address_shodan.compute_public_address_shodan import (
                compute_public_address_shodan,
            )

            compute_client.audit_config = {"shodan_api_key": "api_key"}

            check = compute_public_address_shodan()
            result = check.execute()
            assert len(result) == 0

    def test_compute_ip_in_shodan(self):
        compute_client = mock.MagicMock()
        public_ip_id = "id"
        public_ip_name = "name"
        ip_address = "ip_address"
        shodan_info = {
            "ports": [80, 443],
            "isp": "Microsoft Corporation",
            "country_name": "country_name",
        }

        compute_client.addresses = [
            Address(
                id=public_ip_id,
                name=public_ip_name,
                type="EXTERNAL",
                ip=ip_address,
                region="region",
                network="network",
                project_id=GCP_PROJECT_ID,
            )
        ]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_public_address_shodan.compute_public_address_shodan.compute_client",
                new=compute_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_public_address_shodan.compute_public_address_shodan.shodan.Shodan.host",
                return_value=shodan_info,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_public_address_shodan.compute_public_address_shodan import (
                compute_public_address_shodan,
            )

            compute_client.audit_config = {"shodan_api_key": "api_key"}
            check = compute_public_address_shodan()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Public Address {ip_address} listed in Shodan with open ports {str(shodan_info['ports'])} and ISP {shodan_info['isp']} in {shodan_info['country_name']}. More info at https://www.shodan.io/host/{ip_address}."
            )
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == "region"
            assert result[0].resource_id == public_ip_id
```

--------------------------------------------------------------------------------

---[FILE: compute_serial_ports_in_use_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_serial_ports_in_use/compute_serial_ports_in_use_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_instance_serial_ports_in_use:
    def test_compute_no_instances(self):
        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use import (
                compute_instance_serial_ports_in_use,
            )

            check = compute_instance_serial_ports_in_use()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_instance_without_metadata(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[],
            ip_forward=False,
            disks_encryption=[("disk1", False), ("disk2", False)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use import (
                compute_instance_serial_ports_in_use,
            )

            check = compute_instance_serial_ports_in_use()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"VM Instance {instance.name} has Enable Connecting to Serial Ports off",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_compliant_instance_with_0(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={"items": [{"key": "serial-port-enabled", "value": "0"}]},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[],
            ip_forward=False,
            disks_encryption=[("disk1", False), ("disk2", False)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use import (
                compute_instance_serial_ports_in_use,
            )

            check = compute_instance_serial_ports_in_use()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"VM Instance {instance.name} has Enable Connecting to Serial Ports off",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_compliant_instance_with_false(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={"items": [{"key": "serial-port-enabled", "value": "false"}]},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[],
            ip_forward=False,
            disks_encryption=[("disk1", False), ("disk2", False)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use import (
                compute_instance_serial_ports_in_use,
            )

            check = compute_instance_serial_ports_in_use()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"VM Instance {instance.name} has Enable Connecting to Serial Ports off",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_instance_with_serial_ports_enable_1(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={"items": [{"key": "serial-port-enable", "value": "1"}]},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[],
            ip_forward=False,
            disks_encryption=[("disk1", False), ("disk2", False)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use import (
                compute_instance_serial_ports_in_use,
            )

            check = compute_instance_serial_ports_in_use()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"VM Instance {instance.name} has Enable Connecting to Serial Ports set to on",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_instance_with_serial_ports_enable_true(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={"items": [{"key": "serial-port-enable", "value": "true"}]},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[],
            ip_forward=False,
            disks_encryption=[("disk1", False), ("disk2", False)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_serial_ports_in_use.compute_instance_serial_ports_in_use import (
                compute_instance_serial_ports_in_use,
            )

            check = compute_instance_serial_ports_in_use()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"VM Instance {instance.name} has Enable Connecting to Serial Ports set to on",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"
```

--------------------------------------------------------------------------------

````
