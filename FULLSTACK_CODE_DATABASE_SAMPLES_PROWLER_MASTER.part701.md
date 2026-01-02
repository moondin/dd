---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 701
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 701 of 867)

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

---[FILE: cloudstorage_uses_vpc_service_controls_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudstorage/cloudstorage_uses_vpc_service_controls/cloudstorage_uses_vpc_service_controls_test.py

```python
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class TestCloudStorageUsesVPCServiceControls:
    def test_project_protected_by_vpc_sc(self):
        cloudresourcemanager_client = mock.MagicMock()
        accesscontextmanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.accesscontextmanager_client",
                new=accesscontextmanager_client,
            ),
        ):
            from prowler.providers.gcp.services.accesscontextmanager.accesscontextmanager_service import (
                ServicePerimeter,
            )
            from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
                Project,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls import (
                cloudstorage_uses_vpc_service_controls,
            )

            project1 = Project(
                id=GCP_PROJECT_ID, number="123456789012", audit_logging=True
            )

            cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
            cloudresourcemanager_client.cloud_resource_manager_projects = [project1]
            cloudresourcemanager_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test-project",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION

            accesscontextmanager_client.service_perimeters = [
                ServicePerimeter(
                    name="accessPolicies/123456/servicePerimeters/test_perimeter",
                    title="Test Perimeter",
                    perimeter_type="PERIMETER_TYPE_REGULAR",
                    resources=["projects/123456789012"],
                    restricted_services=[
                        "storage.googleapis.com",
                        "bigquery.googleapis.com",
                    ],
                    policy_name="accessPolicies/123456",
                )
            ]

            check = cloudstorage_uses_vpc_service_controls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Project {GCP_PROJECT_ID} has VPC Service Controls enabled for Cloud Storage in perimeter Test Perimeter."
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test-project"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_project_not_protected_no_perimeters(self):
        cloudresourcemanager_client = mock.MagicMock()
        accesscontextmanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.accesscontextmanager_client",
                new=accesscontextmanager_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
                Project,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls import (
                cloudstorage_uses_vpc_service_controls,
            )

            project1 = Project(
                id=GCP_PROJECT_ID, number="123456789012", audit_logging=True
            )

            cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
            cloudresourcemanager_client.cloud_resource_manager_projects = [project1]
            cloudresourcemanager_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test-project",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION

            # No service perimeters configured
            accesscontextmanager_client.service_perimeters = []

            check = cloudstorage_uses_vpc_service_controls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Project {GCP_PROJECT_ID} does not have VPC Service Controls enabled for Cloud Storage."
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test-project"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_project_in_perimeter_but_storage_not_restricted(self):
        cloudresourcemanager_client = mock.MagicMock()
        accesscontextmanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.accesscontextmanager_client",
                new=accesscontextmanager_client,
            ),
        ):
            from prowler.providers.gcp.services.accesscontextmanager.accesscontextmanager_service import (
                ServicePerimeter,
            )
            from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
                Project,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls import (
                cloudstorage_uses_vpc_service_controls,
            )

            project1 = Project(
                id=GCP_PROJECT_ID, number="123456789012", audit_logging=True
            )

            cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
            cloudresourcemanager_client.cloud_resource_manager_projects = [project1]
            cloudresourcemanager_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test-project",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION

            # Perimeter exists but storage.googleapis.com is NOT in restricted services
            accesscontextmanager_client.service_perimeters = [
                ServicePerimeter(
                    name="accessPolicies/123456/servicePerimeters/test_perimeter",
                    title="Test Perimeter",
                    perimeter_type="PERIMETER_TYPE_REGULAR",
                    resources=["projects/123456789012"],
                    restricted_services=[
                        "bigquery.googleapis.com",
                        "compute.googleapis.com",
                    ],
                    policy_name="accessPolicies/123456",
                )
            ]

            check = cloudstorage_uses_vpc_service_controls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Project {GCP_PROJECT_ID} does not have VPC Service Controls enabled for Cloud Storage."
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test-project"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_project_not_in_perimeter(self):
        cloudresourcemanager_client = mock.MagicMock()
        accesscontextmanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.accesscontextmanager_client",
                new=accesscontextmanager_client,
            ),
        ):
            from prowler.providers.gcp.services.accesscontextmanager.accesscontextmanager_service import (
                ServicePerimeter,
            )
            from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
                Project,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls import (
                cloudstorage_uses_vpc_service_controls,
            )

            project1 = Project(
                id=GCP_PROJECT_ID, number="123456789012", audit_logging=True
            )

            cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
            cloudresourcemanager_client.cloud_resource_manager_projects = [project1]
            cloudresourcemanager_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test-project",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION

            # Perimeter exists with storage restricted, but different project
            accesscontextmanager_client.service_perimeters = [
                ServicePerimeter(
                    name="accessPolicies/123456/servicePerimeters/test_perimeter",
                    title="Test Perimeter",
                    perimeter_type="PERIMETER_TYPE_REGULAR",
                    resources=["projects/999999999999"],
                    restricted_services=["storage.googleapis.com"],
                    policy_name="accessPolicies/123456",
                )
            ]

            check = cloudstorage_uses_vpc_service_controls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Project {GCP_PROJECT_ID} does not have VPC Service Controls enabled for Cloud Storage."
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test-project"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_no_projects(self):
        cloudresourcemanager_client = mock.MagicMock()
        accesscontextmanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.accesscontextmanager_client",
                new=accesscontextmanager_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls import (
                cloudstorage_uses_vpc_service_controls,
            )

            cloudresourcemanager_client.cloud_resource_manager_projects = []
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION

            check = cloudstorage_uses_vpc_service_controls()
            result = check.execute()

            assert len(result) == 0

    def test_project_protected_by_vpc_sc_api_blocked(self):
        cloudresourcemanager_client = mock.MagicMock()
        accesscontextmanager_client = mock.MagicMock()
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.accesscontextmanager_client",
                new=accesscontextmanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
                Project,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_uses_vpc_service_controls.cloudstorage_uses_vpc_service_controls import (
                cloudstorage_uses_vpc_service_controls,
            )

            project1 = Project(
                id=GCP_PROJECT_ID, number="123456789012", audit_logging=True
            )

            cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
            cloudresourcemanager_client.cloud_resource_manager_projects = [project1]
            cloudresourcemanager_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test-project",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION

            # No service perimeters configured, but API access is blocked by VPC SC
            accesscontextmanager_client.service_perimeters = []
            cloudstorage_client.vpc_service_controls_protected_projects = {
                GCP_PROJECT_ID
            }

            check = cloudstorage_uses_vpc_service_controls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Project {GCP_PROJECT_ID} has VPC Service Controls enabled for Cloud Storage in undetermined perimeter (verified by API access restriction)."
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test-project"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: compute_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_service_test.py

```python
from unittest.mock import patch

from prowler.providers.gcp.services.compute.compute_service import Compute
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestComputeService:
    def test_service(self):
        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client,
            ),
        ):
            compute_client = Compute(set_mocked_gcp_provider([GCP_PROJECT_ID]))
            assert compute_client.service == "compute"
            assert compute_client.project_ids == [GCP_PROJECT_ID]

            assert len(compute_client.regions) == 1
            assert "europe-west1-b" in compute_client.regions

            assert len(compute_client.zones) == 1
            assert "zone1" in compute_client.zones

            assert len(compute_client.compute_projects) == 1
            assert compute_client.compute_projects[0].id == GCP_PROJECT_ID
            assert compute_client.compute_projects[0].enable_oslogin

            assert len(compute_client.instances) == 2
            assert compute_client.instances[0].name == "instance1"
            assert compute_client.instances[0].id.__class__.__name__ == "str"
            assert compute_client.instances[0].zone == "zone1"
            assert compute_client.instances[0].region == "zone1"
            assert compute_client.instances[0].public_ip
            assert compute_client.instances[0].project_id == GCP_PROJECT_ID
            assert compute_client.instances[0].metadata == {}
            assert compute_client.instances[0].shielded_enabled_vtpm
            assert compute_client.instances[0].shielded_enabled_integrity_monitoring
            assert compute_client.instances[0].confidential_computing
            assert len(compute_client.instances[0].service_accounts) == 1
            assert (
                compute_client.instances[0].service_accounts[0]["email"]
                == "test@test.es"
            )
            assert compute_client.instances[0].service_accounts[0]["scopes"] == [
                "scope1",
                "scope2",
            ]
            assert compute_client.instances[0].ip_forward
            assert compute_client.instances[0].disks_encryption == [("disk1", True)]
            assert not compute_client.instances[0].automatic_restart
            assert not compute_client.instances[0].preemptible
            assert compute_client.instances[0].provisioning_model == "STANDARD"

            assert compute_client.instances[1].name == "instance2"
            assert compute_client.instances[1].id.__class__.__name__ == "str"
            assert compute_client.instances[1].zone == "zone1"
            assert compute_client.instances[1].region == "zone1"
            assert not compute_client.instances[1].public_ip
            assert compute_client.instances[1].project_id == GCP_PROJECT_ID
            assert compute_client.instances[1].metadata == {}
            assert not compute_client.instances[1].shielded_enabled_vtpm
            assert not compute_client.instances[1].shielded_enabled_integrity_monitoring
            assert not compute_client.instances[1].confidential_computing
            assert len(compute_client.instances[1].service_accounts) == 1
            assert (
                compute_client.instances[1].service_accounts[0]["email"]
                == "test2@test.es"
            )
            assert compute_client.instances[1].service_accounts[0]["scopes"] == [
                "scope3"
            ]
            assert not compute_client.instances[1].ip_forward
            assert compute_client.instances[1].disks_encryption == [("disk2", False)]
            assert not compute_client.instances[1].automatic_restart
            assert not compute_client.instances[1].preemptible
            assert compute_client.instances[1].provisioning_model == "STANDARD"

            assert len(compute_client.networks) == 3
            assert compute_client.networks[0].name == "network1"
            assert compute_client.networks[0].id.__class__.__name__ == "str"
            assert compute_client.networks[0].subnet_mode == "auto"
            assert compute_client.networks[0].project_id == GCP_PROJECT_ID

            assert compute_client.networks[1].name == "network2"
            assert compute_client.networks[1].id.__class__.__name__ == "str"
            assert compute_client.networks[1].subnet_mode == "custom"
            assert compute_client.networks[1].project_id == GCP_PROJECT_ID

            assert compute_client.networks[2].name == "network3"
            assert compute_client.networks[2].id.__class__.__name__ == "str"
            assert compute_client.networks[2].subnet_mode == "legacy"
            assert compute_client.networks[2].project_id == GCP_PROJECT_ID

            assert len(compute_client.subnets) == 3
            assert compute_client.subnets[0].name == "subnetwork1"
            assert compute_client.subnets[0].id.__class__.__name__ == "str"
            assert compute_client.subnets[0].flow_logs
            assert compute_client.subnets[0].network == "network1"
            assert compute_client.subnets[0].project_id == GCP_PROJECT_ID

            assert compute_client.subnets[1].name == "subnetwork2"
            assert compute_client.subnets[1].id.__class__.__name__ == "str"
            assert not compute_client.subnets[1].flow_logs
            assert compute_client.subnets[1].network == "network1"
            assert compute_client.subnets[1].project_id == GCP_PROJECT_ID

            assert compute_client.subnets[2].name == "subnetwork3"
            assert compute_client.subnets[2].id.__class__.__name__ == "str"
            assert not compute_client.subnets[2].flow_logs
            assert compute_client.subnets[2].network == "network3"
            assert compute_client.subnets[2].project_id == GCP_PROJECT_ID

            assert len(compute_client.addresses) == 3

            assert compute_client.addresses[0].name == "address1"
            assert compute_client.addresses[0].id.__class__.__name__ == "str"
            assert compute_client.addresses[0].ip == "10.0.0.1"
            assert compute_client.addresses[0].type == "INTERNAL"
            assert compute_client.addresses[0].region == "europe-west1-b"
            assert compute_client.addresses[0].project_id == GCP_PROJECT_ID

            assert compute_client.addresses[1].name == "address2"
            assert compute_client.addresses[1].id.__class__.__name__ == "str"
            assert compute_client.addresses[1].ip == "10.0.0.2"
            assert compute_client.addresses[1].type == "INTERNAL"
            assert compute_client.addresses[1].region == "europe-west1-b"
            assert compute_client.addresses[1].project_id == GCP_PROJECT_ID

            assert compute_client.addresses[2].name == "address3"
            assert compute_client.addresses[2].id.__class__.__name__ == "str"
            assert compute_client.addresses[2].ip == "20.34.105.200"
            assert compute_client.addresses[2].type == "EXTERNAL"
            assert compute_client.addresses[2].region == "europe-west1-b"
            assert compute_client.addresses[2].project_id == GCP_PROJECT_ID

            assert len(compute_client.firewalls) == 3
            assert compute_client.firewalls[0].name == "firewall1"
            assert compute_client.firewalls[0].id.__class__.__name__ == "str"
            assert compute_client.firewalls[0].allowed_rules == [{"IPProtocol": "UDP"}]
            assert compute_client.firewalls[0].source_ranges == ["30.0.0.0/16"]
            assert compute_client.firewalls[0].direction == "INGRESS"
            assert compute_client.firewalls[0].project_id == GCP_PROJECT_ID

            assert compute_client.firewalls[1].name == "firewall2"
            assert compute_client.firewalls[1].id.__class__.__name__ == "str"
            assert compute_client.firewalls[1].allowed_rules == [{"IPProtocol": "TCP"}]
            assert compute_client.firewalls[1].source_ranges == ["0.0.0.0/0"]
            assert compute_client.firewalls[1].direction == "EGRESS"
            assert compute_client.firewalls[1].project_id == GCP_PROJECT_ID

            assert compute_client.firewalls[2].name == "firewall3"
            assert compute_client.firewalls[2].id.__class__.__name__ == "str"
            assert compute_client.firewalls[2].allowed_rules == [{"IPProtocol": "TCP"}]
            assert compute_client.firewalls[2].source_ranges == ["10.0.15.0/24"]
            assert compute_client.firewalls[2].direction == "INGRESS"
            assert compute_client.firewalls[2].project_id == GCP_PROJECT_ID

            assert len(compute_client.load_balancers) == 4
            assert compute_client.load_balancers[0].name == "url_map1"
            assert compute_client.load_balancers[0].id.__class__.__name__ == "str"
            assert compute_client.load_balancers[0].service == "service1"
            assert compute_client.load_balancers[0].project_id == GCP_PROJECT_ID
            assert compute_client.load_balancers[0].logging
            assert compute_client.load_balancers[1].name == "url_map2"
            assert compute_client.load_balancers[1].id.__class__.__name__ == "str"
            assert compute_client.load_balancers[1].service == "service2"
            assert compute_client.load_balancers[1].project_id == GCP_PROJECT_ID
            assert not compute_client.load_balancers[1].logging
            assert compute_client.load_balancers[2].name == "regional_url_map1"
            assert compute_client.load_balancers[2].id.__class__.__name__ == "str"
            assert compute_client.load_balancers[2].service == "regional_service1"
            assert compute_client.load_balancers[2].project_id == GCP_PROJECT_ID
            assert not compute_client.load_balancers[2].logging
            assert compute_client.load_balancers[3].name == "regional_url_map2"
            assert compute_client.load_balancers[3].id.__class__.__name__ == "str"
            assert compute_client.load_balancers[3].service == "regional_service2"
            assert compute_client.load_balancers[3].project_id == GCP_PROJECT_ID
            assert not compute_client.load_balancers[3].logging
```

--------------------------------------------------------------------------------

````
