---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 708
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 708 of 867)

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

---[FILE: gcr_container_scanning_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/gcr/gcr_container_scanning_enabled/gcr_container_scanning_enabled_test.py

```python
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from prowler.providers.gcp.services.serviceusage.serviceusage_service import Service
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_gcr_container_scanning_enabled:
    def test_serviceusage_no_active_services(self):
        serviceusage_client = mock.MagicMock()
        serviceusage_client.active_services = {}
        serviceusage_client.project_ids = [GCP_PROJECT_ID]
        serviceusage_client.region = "global"
        serviceusage_client.projects = {
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
                "prowler.providers.gcp.services.gcr.gcr_container_scanning_enabled.gcr_container_scanning_enabled.serviceusage_client",
                new=serviceusage_client,
            ),
        ):
            from prowler.providers.gcp.services.gcr.gcr_container_scanning_enabled.gcr_container_scanning_enabled import (
                gcr_container_scanning_enabled,
            )

            check = gcr_container_scanning_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"GCR Container Scanning is not enabled in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == "containerscanning.googleapis.com"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].resource_name == "GCR Container Scanning"
            assert result[0].location == serviceusage_client.region

    def test_serviceusage_active_cloudasset(self):
        serviceusage_client = mock.MagicMock()
        serviceusage_client.active_services = {
            GCP_PROJECT_ID: [
                Service(
                    name="containerscanning.googleapis.com",
                    title="GCR Container Scanning",
                    project_id=GCP_PROJECT_ID,
                )
            ]
        }
        serviceusage_client.project_ids = [GCP_PROJECT_ID]
        serviceusage_client.region = "global"
        serviceusage_client.projects = {
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
                "prowler.providers.gcp.services.gcr.gcr_container_scanning_enabled.gcr_container_scanning_enabled.serviceusage_client",
                new=serviceusage_client,
            ),
        ):
            from prowler.providers.gcp.services.gcr.gcr_container_scanning_enabled.gcr_container_scanning_enabled import (
                gcr_container_scanning_enabled,
            )

            check = gcr_container_scanning_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"GCR Container Scanning is enabled in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == "containerscanning.googleapis.com"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].resource_name == "GCR Container Scanning"
            assert result[0].location == serviceusage_client.region
```

--------------------------------------------------------------------------------

---[FILE: gke_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/gke/gke_service_test.py

```python
from unittest.mock import patch

from prowler.providers.gcp.services.gke.gke_service import GKE
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestGKEService:
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
            gke_client = GKE(set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID]))
            assert gke_client.service == "container"
            assert gke_client.project_ids == [GCP_PROJECT_ID]

            assert len(gke_client.locations) == 1
            assert gke_client.locations[0].name == "eu-west1"
            assert gke_client.locations[0].project_id == GCP_PROJECT_ID

            assert len(gke_client.clusters) == 2
            assert gke_client.clusters["cluster1_id"].name == "cluster1"
            assert gke_client.clusters["cluster1_id"].id.__class__.__name__ == "str"
            assert gke_client.clusters["cluster1_id"].project_id == GCP_PROJECT_ID
            assert gke_client.clusters["cluster1_id"].location == "eu-west1"
            assert (
                gke_client.clusters["cluster1_id"].service_account == "service_account1"
            )
            assert len(gke_client.clusters["cluster1_id"].node_pools) == 1
            assert gke_client.clusters["cluster1_id"].node_pools[0].name == "node_pool1"
            assert gke_client.clusters["cluster1_id"].node_pools[0].locations == [
                "cluster1_location1"
            ]
            assert (
                gke_client.clusters["cluster1_id"].node_pools[0].service_account
                == "service_account1"
            )
            assert gke_client.clusters["cluster2_id"].name == "cluster2"
            assert gke_client.clusters["cluster2_id"].id.__class__.__name__ == "str"
            assert gke_client.clusters["cluster2_id"].project_id == GCP_PROJECT_ID
            assert gke_client.clusters["cluster2_id"].location == "eu-west1"
            assert (
                gke_client.clusters["cluster2_id"].service_account == "service_account2"
            )
            assert len(gke_client.clusters["cluster2_id"].node_pools) == 2
            assert gke_client.clusters["cluster2_id"].node_pools[0].name == "node_pool2"
            assert gke_client.clusters["cluster2_id"].node_pools[0].locations == [
                "cluster2_location1"
            ]
            assert (
                gke_client.clusters["cluster2_id"].node_pools[0].service_account
                == "service_account2"
            )
            assert gke_client.clusters["cluster2_id"].node_pools[1].name == "node_pool3"
            assert gke_client.clusters["cluster2_id"].node_pools[1].locations == [
                "cluster2_location2"
            ]
            assert (
                gke_client.clusters["cluster2_id"].node_pools[1].service_account
                == "service_account3"
            )
```

--------------------------------------------------------------------------------

---[FILE: gke_cluster_no_default_service_account_test.py]---
Location: prowler-master/tests/providers/gcp/services/gke/gke_cluster_no_default_service_account/gke_cluster_no_default_service_account_test.py

```python
from unittest import mock

from prowler.providers.gcp.services.gke.gke_service import Cluster, NodePool
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_gke_cluster_no_default_service_account:
    def test_gke_no_clusters(self):
        gke_client = mock.MagicMock()
        gke_client.clusters = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.gke.gke_cluster_no_default_service_account.gke_cluster_no_default_service_account.gke_client",
                new=gke_client,
            ),
        ):
            from prowler.providers.gcp.services.gke.gke_cluster_no_default_service_account.gke_cluster_no_default_service_account import (
                gke_cluster_no_default_service_account,
            )

            check = gke_cluster_no_default_service_account()
            result = check.execute()
            assert len(result) == 0

    def test_one_cluster_without_node_pool(self):

        clusters = {
            "123": Cluster(
                name="test",
                id="123",
                location="eu-west-1",
                region="eu-west-1",
                service_account="default",
                node_pools=[],
                project_id=GCP_PROJECT_ID,
            )
        }

        gke_client = mock.MagicMock()
        gke_client.project_ids = [GCP_PROJECT_ID]
        gke_client.clusters = clusters

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.gke.gke_cluster_no_default_service_account.gke_cluster_no_default_service_account.gke_client",
                new=gke_client,
            ),
        ):
            from prowler.providers.gcp.services.gke.gke_cluster_no_default_service_account.gke_cluster_no_default_service_account import (
                gke_cluster_no_default_service_account,
            )

            check = gke_cluster_no_default_service_account()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"GKE cluster {clusters['123'].name} is using the Compute Engine default service account."
            )
            assert result[0].project_id == clusters["123"].project_id
            assert result[0].resource_id == clusters["123"].id
            assert result[0].resource_name == clusters["123"].name
            assert result[0].location == "eu-west-1"

    def test_one_cluster_without_node_pool_without_default_sa(self):

        clusters = {
            "123": Cluster(
                name="test",
                id="123",
                location="eu-west-1",
                region="eu-west-1",
                service_account="1231231231",
                node_pools=[],
                project_id=GCP_PROJECT_ID,
            )
        }

        gke_client = mock.MagicMock()
        gke_client.project_ids = [GCP_PROJECT_ID]
        gke_client.clusters = clusters

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.gke.gke_cluster_no_default_service_account.gke_cluster_no_default_service_account.gke_client",
                new=gke_client,
            ),
        ):
            from prowler.providers.gcp.services.gke.gke_cluster_no_default_service_account.gke_cluster_no_default_service_account import (
                gke_cluster_no_default_service_account,
            )

            check = gke_cluster_no_default_service_account()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"GKE cluster {clusters['123'].name} is not using the Compute Engine default service account."
            )
            assert result[0].project_id == clusters["123"].project_id
            assert result[0].resource_id == clusters["123"].id
            assert result[0].resource_name == clusters["123"].name
            assert result[0].location == "eu-west-1"

    def test_one_cluster_with_node_pool_with_default_sa(self):

        clusters = {
            "123": Cluster(
                name="test",
                id="123",
                location="eu-west-1",
                region="eu-west-1",
                service_account="default",
                node_pools=[
                    NodePool(
                        name="test",
                        locations=["eu-west-1"],
                        service_account="default",
                        project_id=GCP_PROJECT_ID,
                    )
                ],
                project_id=GCP_PROJECT_ID,
            )
        }

        gke_client = mock.MagicMock()
        gke_client.project_ids = [GCP_PROJECT_ID]
        gke_client.clusters = clusters

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.gke.gke_cluster_no_default_service_account.gke_cluster_no_default_service_account.gke_client",
                new=gke_client,
            ),
        ):
            from prowler.providers.gcp.services.gke.gke_cluster_no_default_service_account.gke_cluster_no_default_service_account import (
                gke_cluster_no_default_service_account,
            )

            check = gke_cluster_no_default_service_account()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"GKE cluster {clusters['123'].name} is using the Compute Engine default service account."
            )
            assert result[0].project_id == clusters["123"].project_id
            assert result[0].resource_id == clusters["123"].id
            assert result[0].resource_name == clusters["123"].name
            assert result[0].location == "eu-west-1"

    def test_one_cluster_with_node_pool_with_non_default_sa(self):

        clusters = {
            "123": Cluster(
                name="test",
                id="123",
                location="eu-west-1",
                region="eu-west-1",
                service_account="default",
                node_pools=[
                    NodePool(
                        name="test",
                        locations=["eu-west-1"],
                        service_account="123123123",
                        project_id=GCP_PROJECT_ID,
                    )
                ],
                project_id=GCP_PROJECT_ID,
            )
        }

        gke_client = mock.MagicMock()
        gke_client.project_ids = [GCP_PROJECT_ID]
        gke_client.clusters = clusters

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.gke.gke_cluster_no_default_service_account.gke_cluster_no_default_service_account.gke_client",
                new=gke_client,
            ),
        ):
            from prowler.providers.gcp.services.gke.gke_cluster_no_default_service_account.gke_cluster_no_default_service_account import (
                gke_cluster_no_default_service_account,
            )

            check = gke_cluster_no_default_service_account()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"GKE cluster {clusters['123'].name} is not using the Compute Engine default service account."
            )
            assert result[0].project_id == clusters["123"].project_id
            assert result[0].resource_id == clusters["123"].id
            assert result[0].resource_name == clusters["123"].name
            assert result[0].location == "eu-west-1"
```

--------------------------------------------------------------------------------

---[FILE: iamgcp_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/iam/iamgcp_service_test.py

```python
from datetime import datetime
from unittest.mock import patch

from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
    CloudResourceManager,
)
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestIAMService:
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
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_service import IAM

            iam_client = IAM(set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID]))
            assert iam_client.service == "iam"
            assert iam_client.project_ids == [GCP_PROJECT_ID]

            assert len(iam_client.service_accounts) == 2
            assert (
                iam_client.service_accounts[0].name
                == f"projects/{GCP_PROJECT_ID}/serviceAccounts/service-account1@{GCP_PROJECT_ID}.iam.gserviceaccount.com"
            )
            assert iam_client.service_accounts[0].email == "service-account1@gmail.com"
            assert iam_client.service_accounts[0].display_name == "Service Account 1"
            assert iam_client.service_accounts[0].uniqueId == "111222233334444"
            assert len(iam_client.service_accounts[0].keys) == 2
            assert iam_client.service_accounts[0].keys[0].name == "key1"
            assert iam_client.service_accounts[0].keys[0].valid_after == datetime(
                2021, 1, 1, 0, 0, 0
            )
            assert iam_client.service_accounts[0].keys[0].valid_before == datetime(
                2022, 1, 1, 0, 0, 0
            )
            assert iam_client.service_accounts[0].keys[0].origin == "GOOGLE_PROVIDED"
            assert iam_client.service_accounts[0].keys[0].type == "SYSTEM_MANAGED"
            assert iam_client.service_accounts[0].keys[1].name == "key2"
            assert iam_client.service_accounts[0].keys[1].valid_after == datetime(
                2021, 1, 1, 0, 0, 0
            )
            assert iam_client.service_accounts[0].keys[1].valid_before == datetime(
                2022, 1, 1, 0, 0, 0
            )
            assert iam_client.service_accounts[0].keys[1].origin == "ORIGIN_UNSPECIFIED"
            assert iam_client.service_accounts[0].keys[1].type == "USER_MANAGED"
            assert (
                iam_client.service_accounts[1].name
                == f"projects/{GCP_PROJECT_ID}/serviceAccounts/service-account2@{GCP_PROJECT_ID}.iam.gserviceaccount.com"
            )
            assert iam_client.service_accounts[1].email == "service-account2@gmail.com"
            assert iam_client.service_accounts[1].display_name == "Service Account 2"
            assert iam_client.service_accounts[1].uniqueId == "55566666777888999"
            assert len(iam_client.service_accounts[1].keys) == 1
            assert iam_client.service_accounts[1].keys[0].name == "key3"
            assert iam_client.service_accounts[1].keys[0].valid_after == datetime(
                2021, 1, 1, 0, 0, 0
            )
            assert iam_client.service_accounts[1].keys[0].valid_before == datetime(
                2022, 1, 1, 0, 0, 0
            )
            assert iam_client.service_accounts[1].keys[0].origin == "USER_PROVIDED"
            assert iam_client.service_accounts[1].keys[0].type == "KEY_TYPE_UNSPECIFIED"


class TestAccessApproval:
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
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_service import AccessApproval

            access_approval_client = AccessApproval(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )

            assert access_approval_client.service == "accessapproval"
            assert access_approval_client.project_ids == [GCP_PROJECT_ID]

            assert (
                access_approval_client.settings[GCP_PROJECT_ID].name
                == "projects/123/accessApprovalSettings"
            )
            assert (
                access_approval_client.settings[GCP_PROJECT_ID].project_id
                == GCP_PROJECT_ID
            )


class TestEssentialContacts:
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
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(  # Reinstancing the CloudResourceManager client to secure that is not instancied first by a test
                "prowler.providers.gcp.services.iam.iam_service.cloudresourcemanager_client",
                new=CloudResourceManager(
                    set_mocked_gcp_provider(),
                ),
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_service import EssentialContacts

            essential_contacts_client = EssentialContacts(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )

            assert essential_contacts_client.service == "essentialcontacts"
            assert essential_contacts_client.project_ids == [GCP_PROJECT_ID]

            assert len(essential_contacts_client.organizations) == 2

            assert essential_contacts_client.organizations[0].name == "Organization 1"
            assert essential_contacts_client.organizations[0].id == "123456789"
            assert essential_contacts_client.organizations[0].contacts

            assert essential_contacts_client.organizations[1].name == "Organization 2"
            assert essential_contacts_client.organizations[1].id == "987654321"
            assert not essential_contacts_client.organizations[1].contacts
```

--------------------------------------------------------------------------------

---[FILE: iam_account_access_approval_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/iam/iam_account_access_approval_enabled/iam_account_access_approval_enabled_test.py

```python
from re import search
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_iam_account_access_approval_enabled:
    def test_iam_no_settings(self):
        accessapproval_client = mock.MagicMock()
        accessapproval_client.settings = {}
        accessapproval_client.project_ids = [GCP_PROJECT_ID]
        accessapproval_client.region = "global"
        accessapproval_client.projects = {
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
                "prowler.providers.gcp.services.iam.iam_account_access_approval_enabled.iam_account_access_approval_enabled.accessapproval_client",
                new=accessapproval_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_account_access_approval_enabled.iam_account_access_approval_enabled import (
                iam_account_access_approval_enabled,
            )

            check = iam_account_access_approval_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "does not have Access Approval enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == "global"

    def test_iam_project_with_settings(self):
        cloudresourcemanager_client = mock.MagicMock()
        accessapproval_client = mock.MagicMock()
        accessapproval_client.project_ids = [GCP_PROJECT_ID]
        accessapproval_client.region = "global"
        accessapproval_client.projects = {
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
                "prowler.providers.gcp.services.iam.iam_account_access_approval_enabled.iam_account_access_approval_enabled.accessapproval_client",
                new=accessapproval_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_service.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_service import Setting

            accessapproval_client.settings = {
                GCP_PROJECT_ID: Setting(name="test", project_id=GCP_PROJECT_ID)
            }

            from prowler.providers.gcp.services.iam.iam_account_access_approval_enabled.iam_account_access_approval_enabled import (
                iam_account_access_approval_enabled,
            )

            check = iam_account_access_approval_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "has Access Approval enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == "global"

    def test_iam_project_with_settings_empty_project_name(self):
        cloudresourcemanager_client = mock.MagicMock()
        accessapproval_client = mock.MagicMock()
        accessapproval_client.project_ids = [GCP_PROJECT_ID]
        accessapproval_client.region = "global"
        accessapproval_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="",
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
                "prowler.providers.gcp.services.iam.iam_account_access_approval_enabled.iam_account_access_approval_enabled.accessapproval_client",
                new=accessapproval_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_service.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_service import Setting

            accessapproval_client.settings = {
                GCP_PROJECT_ID: Setting(name="test", project_id=GCP_PROJECT_ID)
            }

            from prowler.providers.gcp.services.iam.iam_account_access_approval_enabled.iam_account_access_approval_enabled import (
                iam_account_access_approval_enabled,
            )

            check = iam_account_access_approval_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "has Access Approval enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "GCP Project"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: iam_audit_logs_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/iam/iam_audit_logs_enabled/iam_audit_logs_enabled_test.py

```python
from re import search
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_iam_audit_logs_enabled:
    def test_iam_no_projects(self):
        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.projects = []
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_audit_logs_enabled.iam_audit_logs_enabled.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_audit_logs_enabled.iam_audit_logs_enabled import (
                iam_audit_logs_enabled,
            )

            check = iam_audit_logs_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_compliant_project(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Project,
        )

        project1 = Project(id=GCP_PROJECT_ID, audit_logging=True)

        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.cloud_resource_manager_projects = [project1]
        cloudresourcemanager_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }
        cloudresourcemanager_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_audit_logs_enabled.iam_audit_logs_enabled.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_audit_logs_enabled.iam_audit_logs_enabled import (
                iam_audit_logs_enabled,
            )

            check = iam_audit_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "PASS"
                assert search(
                    "Audit Logs are enabled for project",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.resource_name == "test"
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region

    def test_uncompliant_project(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Project,
        )

        project1 = Project(id=GCP_PROJECT_ID, audit_logging=False)

        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.cloud_resource_manager_projects = [project1]
        cloudresourcemanager_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }
        cloudresourcemanager_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_audit_logs_enabled.iam_audit_logs_enabled.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_audit_logs_enabled.iam_audit_logs_enabled import (
                iam_audit_logs_enabled,
            )

            check = iam_audit_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "FAIL"
                assert search(
                    "Audit Logs are not enabled for project",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.resource_name == "test"
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region

    def test_compliant_project_empty_project_name(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Project,
        )

        project1 = Project(id=GCP_PROJECT_ID, audit_logging=True)

        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.cloud_resource_manager_projects = [project1]
        cloudresourcemanager_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }
        cloudresourcemanager_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_audit_logs_enabled.iam_audit_logs_enabled.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_audit_logs_enabled.iam_audit_logs_enabled import (
                iam_audit_logs_enabled,
            )

            check = iam_audit_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "PASS"
                assert search(
                    "Audit Logs are enabled for project",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.resource_name == "GCP Project"
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region

    def test_uncompliant_project_empty_project_name(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Project,
        )

        project1 = Project(id=GCP_PROJECT_ID, audit_logging=False)

        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.cloud_resource_manager_projects = [project1]
        cloudresourcemanager_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }
        cloudresourcemanager_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_audit_logs_enabled.iam_audit_logs_enabled.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_audit_logs_enabled.iam_audit_logs_enabled import (
                iam_audit_logs_enabled,
            )

            check = iam_audit_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "FAIL"
                assert search(
                    "Audit Logs are not enabled for project",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.resource_name == "GCP Project"
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region
```

--------------------------------------------------------------------------------

````
