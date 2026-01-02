---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 705
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 705 of 867)

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

---[FILE: compute_instance_preemptible_vm_disabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_instance_preemptible_vm_disabled/compute_instance_preemptible_vm_disabled_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class TestComputeInstancePreemptibleVmDisabled:
    def test_no_instances(self):
        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled import (
                compute_instance_preemptible_vm_disabled,
            )

            check = compute_instance_preemptible_vm_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_instance_not_preemptible(self):
        compute_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled import (
                compute_instance_preemptible_vm_disabled,
            )
            from prowler.providers.gcp.services.compute.compute_service import Instance

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.instances = [
                Instance(
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
                    preemptible=False,
                    provisioning_model="",
                )
            ]

            check = compute_instance_preemptible_vm_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"VM Instance {compute_client.instances[0].name} is not preemptible or Spot VM."
            )
            assert result[0].resource_id == "1234567890"
            assert result[0].resource_name == "test"
            assert result[0].location == "us-central1"
            assert result[0].project_id == GCP_PROJECT_ID

    def test_instance_preemptible(self):
        compute_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled import (
                compute_instance_preemptible_vm_disabled,
            )
            from prowler.providers.gcp.services.compute.compute_service import Instance

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.instances = [
                Instance(
                    name="test",
                    id="1234567890",
                    zone="us-central1-a",
                    region="us-central1",
                    public_ip=True,
                    metadata={},
                    shielded_enabled_vtpm=False,
                    shielded_enabled_integrity_monitoring=True,
                    confidential_computing=False,
                    service_accounts=[],
                    ip_forward=False,
                    disks_encryption=[("disk1", False), ("disk2", False)],
                    project_id=GCP_PROJECT_ID,
                    preemptible=True,
                    provisioning_model="",
                )
            ]

            check = compute_instance_preemptible_vm_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"VM Instance {compute_client.instances[0].name} is configured as preemptible."
            )
            assert result[0].resource_id == "1234567890"
            assert result[0].resource_name == "test"
            assert result[0].location == "us-central1"
            assert result[0].project_id == GCP_PROJECT_ID

    def test_multiple_instances_mixed_preemptible_and_standard(self):
        compute_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled import (
                compute_instance_preemptible_vm_disabled,
            )
            from prowler.providers.gcp.services.compute.compute_service import Instance

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.instances = [
                Instance(
                    name="preemptible-instance",
                    id="111111111",
                    zone="us-central1-a",
                    region="us-central1",
                    public_ip=False,
                    metadata={},
                    shielded_enabled_vtpm=True,
                    shielded_enabled_integrity_monitoring=True,
                    confidential_computing=False,
                    service_accounts=[],
                    ip_forward=False,
                    disks_encryption=[],
                    project_id=GCP_PROJECT_ID,
                    preemptible=True,
                    provisioning_model="",
                ),
                Instance(
                    name="standard-instance",
                    id="222222222",
                    zone="europe-west1-b",
                    region="europe-west1",
                    public_ip=True,
                    metadata={},
                    shielded_enabled_vtpm=True,
                    shielded_enabled_integrity_monitoring=True,
                    confidential_computing=True,
                    service_accounts=[],
                    ip_forward=False,
                    disks_encryption=[],
                    project_id=GCP_PROJECT_ID,
                    preemptible=False,
                    provisioning_model="",
                ),
            ]

            check = compute_instance_preemptible_vm_disabled()
            result = check.execute()

            assert len(result) == 2

            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "VM Instance preemptible-instance is configured as preemptible."
            )
            assert result[0].resource_id == "111111111"
            assert result[0].resource_name == "preemptible-instance"

            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == "VM Instance standard-instance is not preemptible or Spot VM."
            )
            assert result[1].resource_id == "222222222"
            assert result[1].resource_name == "standard-instance"

    def test_instance_spot_vm(self):
        compute_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled import (
                compute_instance_preemptible_vm_disabled,
            )
            from prowler.providers.gcp.services.compute.compute_service import Instance

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.instances = [
                Instance(
                    name="spot-vm",
                    id="3333333333",
                    zone="us-west1-a",
                    region="us-west1",
                    public_ip=False,
                    metadata={},
                    shielded_enabled_vtpm=True,
                    shielded_enabled_integrity_monitoring=True,
                    confidential_computing=False,
                    service_accounts=[],
                    ip_forward=False,
                    disks_encryption=[],
                    project_id=GCP_PROJECT_ID,
                    preemptible=False,
                    provisioning_model="SPOT",
                )
            ]

            check = compute_instance_preemptible_vm_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "VM Instance spot-vm is configured as Spot VM."
            )
            assert result[0].resource_id == "3333333333"
            assert result[0].resource_name == "spot-vm"
            assert result[0].location == "us-west1"
            assert result[0].project_id == GCP_PROJECT_ID

    def test_instance_standard_provisioning_model(self):
        compute_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled import (
                compute_instance_preemptible_vm_disabled,
            )
            from prowler.providers.gcp.services.compute.compute_service import Instance

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.instances = [
                Instance(
                    name="standard-vm",
                    id="4444444444",
                    zone="asia-east1-a",
                    region="asia-east1",
                    public_ip=True,
                    metadata={},
                    shielded_enabled_vtpm=True,
                    shielded_enabled_integrity_monitoring=True,
                    confidential_computing=False,
                    service_accounts=[],
                    ip_forward=False,
                    disks_encryption=[],
                    project_id=GCP_PROJECT_ID,
                    preemptible=False,
                    provisioning_model="STANDARD",
                )
            ]

            check = compute_instance_preemptible_vm_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "VM Instance standard-vm is not preemptible or Spot VM."
            )
            assert result[0].resource_id == "4444444444"
            assert result[0].resource_name == "standard-vm"
            assert result[0].location == "asia-east1"
            assert result[0].project_id == GCP_PROJECT_ID

    def test_multiple_instances_spot_and_standard(self):
        compute_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_preemptible_vm_disabled.compute_instance_preemptible_vm_disabled import (
                compute_instance_preemptible_vm_disabled,
            )
            from prowler.providers.gcp.services.compute.compute_service import Instance

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.instances = [
                Instance(
                    name="spot-instance",
                    id="5555555555",
                    zone="us-central1-c",
                    region="us-central1",
                    public_ip=False,
                    metadata={},
                    shielded_enabled_vtpm=True,
                    shielded_enabled_integrity_monitoring=True,
                    confidential_computing=False,
                    service_accounts=[],
                    ip_forward=False,
                    disks_encryption=[],
                    project_id=GCP_PROJECT_ID,
                    preemptible=False,
                    provisioning_model="SPOT",
                ),
                Instance(
                    name="standard-instance-2",
                    id="6666666666",
                    zone="europe-west2-a",
                    region="europe-west2",
                    public_ip=True,
                    metadata={},
                    shielded_enabled_vtpm=True,
                    shielded_enabled_integrity_monitoring=True,
                    confidential_computing=True,
                    service_accounts=[],
                    ip_forward=False,
                    disks_encryption=[],
                    project_id=GCP_PROJECT_ID,
                    preemptible=False,
                    provisioning_model="STANDARD",
                ),
            ]

            check = compute_instance_preemptible_vm_disabled()
            result = check.execute()

            assert len(result) == 2

            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "VM Instance spot-instance is configured as Spot VM."
            )
            assert result[0].resource_id == "5555555555"
            assert result[0].resource_name == "spot-instance"

            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == "VM Instance standard-instance-2 is not preemptible or Spot VM."
            )
            assert result[1].resource_id == "6666666666"
            assert result[1].resource_name == "standard-instance-2"
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_public_ip_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_instance_public_ip/compute_instance_public_ip_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_instance_public_ip:
    def test_compute_no_instances(self):
        compute_client = mock.MagicMock()
        compute_client.instances = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_public_ip.compute_instance_public_ip.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_public_ip.compute_instance_public_ip import (
                compute_instance_public_ip,
            )

            check = compute_instance_public_ip()
            result = check.execute()
            assert len(result) == 0

    def test_no_public_ip_instance(self):
        compute_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_public_ip.compute_instance_public_ip.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_public_ip.compute_instance_public_ip import (
                compute_instance_public_ip,
            )
            from prowler.providers.gcp.services.compute.compute_service import Instance

            instance = Instance(
                name="test",
                id="1234567890",
                zone="us-central1-a",
                region="us-central1",
                public_ip=False,
                metadata={},
                shielded_enabled_vtpm=True,
                shielded_enabled_integrity_monitoring=True,
                confidential_computing=True,
                service_accounts=[
                    {"email": "123-compute@developer.gserviceaccount.com"}
                ],
                ip_forward=False,
                disks_encryption=[],
                project_id=GCP_PROJECT_ID,
            )

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.instances = [instance]

            check = compute_instance_public_ip()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "VM Instance test does not have a public IP."
            )
            assert result[0].resource_id == "1234567890"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test"
            assert result[0].location == "us-central1"

    def test_public_ip_instance(self):
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
            service_accounts=[
                {"email": f"{GCP_PROJECT_ID}-compute@developer.gserviceaccount.com"}
            ],
            ip_forward=True,
            disks_encryption=[],
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
                "prowler.providers.gcp.services.compute.compute_instance_public_ip.compute_instance_public_ip.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_public_ip.compute_instance_public_ip import (
                compute_instance_public_ip,
            )

            check = compute_instance_public_ip()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "VM Instance test has a public IP."
            assert result[0].resource_id == "1234567890"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test"
            assert result[0].location == "us-central1"
```

--------------------------------------------------------------------------------

---[FILE: compute_loadbalancer_logging_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_loadbalancer_logging_enabled/compute_loadbalancer_logging_enabled_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_loadbalancer_logging_enabled:
    def test_compute_no_load_balancers(self):
        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.load_balancers = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_loadbalancer_logging_enabled.compute_loadbalancer_logging_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_loadbalancer_logging_enabled.compute_loadbalancer_logging_enabled import (
                compute_loadbalancer_logging_enabled,
            )

            check = compute_loadbalancer_logging_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_load_balancer(self):
        from prowler.providers.gcp.services.compute.compute_service import LoadBalancer

        load_balancer = LoadBalancer(
            name="test",
            id="test_id",
            project_id=GCP_PROJECT_ID,
            logging=True,
            service="test",
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.load_balancers = [load_balancer]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_loadbalancer_logging_enabled.compute_loadbalancer_logging_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_loadbalancer_logging_enabled.compute_loadbalancer_logging_enabled import (
                compute_loadbalancer_logging_enabled,
            )

            check = compute_loadbalancer_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "has logging enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == load_balancer.id
            assert result[0].resource_name == load_balancer.name
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == compute_client.region

    def test_one_uncompliant_load_balancer(self):
        from prowler.providers.gcp.services.compute.compute_service import LoadBalancer

        load_balancer = LoadBalancer(
            name="test",
            id="test_id",
            project_id=GCP_PROJECT_ID,
            logging=False,
            service="test",
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.load_balancers = [load_balancer]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_loadbalancer_logging_enabled.compute_loadbalancer_logging_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_loadbalancer_logging_enabled.compute_loadbalancer_logging_enabled import (
                compute_loadbalancer_logging_enabled,
            )

            check = compute_loadbalancer_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "does not have logging enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == load_balancer.id
            assert result[0].resource_name == load_balancer.name
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == compute_client.region

    def test_one_load_balancer_without_backend_service(self):
        from prowler.providers.gcp.services.compute.compute_service import LoadBalancer

        load_balancer = LoadBalancer(
            name="test", id="test_id", project_id=GCP_PROJECT_ID, service=""
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.load_balancers = [load_balancer]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_loadbalancer_logging_enabled.compute_loadbalancer_logging_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_loadbalancer_logging_enabled.compute_loadbalancer_logging_enabled import (
                compute_loadbalancer_logging_enabled,
            )

            check = compute_loadbalancer_logging_enabled()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: compute_network_default_in_use_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_network_default_in_use/compute_network_default_in_use_test.py

```python
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_network_default_in_use:
    def test_compute_no_projects(self):
        compute_client = mock.MagicMock()
        compute_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_default_in_use.compute_network_default_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_network_default_in_use.compute_network_default_in_use import (
                compute_network_default_in_use,
            )

            compute_client.project_ids = []
            compute_client.networks = []

            check = compute_network_default_in_use()
            result = check.execute()
            assert len(result) == 0

    def test_compute_no_networks(self):
        compute_client = mock.MagicMock()
        compute_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_default_in_use.compute_network_default_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_network_default_in_use.compute_network_default_in_use import (
                compute_network_default_in_use,
            )

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.networks = []
            compute_client.region = "global"

            check = compute_network_default_in_use()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Default network does not exist in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == "default"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].resource_name == "default"
            assert result[0].location == "global"

    def test_compute_one_project_default_network(self):
        compute_client = mock.MagicMock()
        compute_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_default_in_use.compute_network_default_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_network_default_in_use.compute_network_default_in_use import (
                compute_network_default_in_use,
            )
            from prowler.providers.gcp.services.compute.compute_service import Network

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.networks = [
                Network(
                    name="default",
                    id="default",
                    subnet_mode="custom",
                    project_id=GCP_PROJECT_ID,
                )
            ]
            compute_client.region = "global"

            check = compute_network_default_in_use()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Default network is in use in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == "default"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].resource_name == "default"
            assert result[0].location == "global"

    def test_compute_one_project_no_default_network(self):
        compute_client = mock.MagicMock()
        compute_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_network_default_in_use.compute_network_default_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_network_default_in_use.compute_network_default_in_use import (
                compute_network_default_in_use,
            )
            from prowler.providers.gcp.services.compute.compute_service import Network

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.networks = [
                Network(
                    name="not-default",
                    id="not-default",
                    subnet_mode="custom",
                    project_id=GCP_PROJECT_ID,
                )
            ]
            compute_client.region = "global"

            check = compute_network_default_in_use()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Default network does not exist in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == "default"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].resource_name == "default"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

````
