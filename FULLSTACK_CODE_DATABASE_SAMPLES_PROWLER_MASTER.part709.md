---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 709
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 709 of 867)

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

---[FILE: iam_cloud_asset_inventory_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/iam/iam_cloud_asset_inventory_enabled/iam_cloud_asset_inventory_enabled_test.py

```python
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from prowler.providers.gcp.services.serviceusage.serviceusage_service import Service
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_iam_cloud_asset_inventory_enabled:
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
                "prowler.providers.gcp.services.iam.iam_cloud_asset_inventory_enabled.iam_cloud_asset_inventory_enabled.serviceusage_client",
                new=serviceusage_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_cloud_asset_inventory_enabled.iam_cloud_asset_inventory_enabled import (
                iam_cloud_asset_inventory_enabled,
            )

            check = iam_cloud_asset_inventory_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cloud Asset Inventory is not enabled in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == "cloudasset.googleapis.com"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].resource_name == "Cloud Asset Inventory"
            assert result[0].location == serviceusage_client.region

    def test_serviceusage_active_cloudasset(self):
        serviceusage_client = mock.MagicMock()
        serviceusage_client.active_services = {
            GCP_PROJECT_ID: [
                Service(
                    name="cloudasset.googleapis.com",
                    title="Cloud Asset Inventory",
                    project_id=GCP_PROJECT_ID,
                )
            ]
        }
        serviceusage_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }
        serviceusage_client.project_ids = [GCP_PROJECT_ID]
        serviceusage_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_cloud_asset_inventory_enabled.iam_cloud_asset_inventory_enabled.serviceusage_client",
                new=serviceusage_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_cloud_asset_inventory_enabled.iam_cloud_asset_inventory_enabled import (
                iam_cloud_asset_inventory_enabled,
            )

            check = iam_cloud_asset_inventory_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Cloud Asset Inventory is enabled in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == "cloudasset.googleapis.com"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].resource_name == "Cloud Asset Inventory"
            assert result[0].location == serviceusage_client.region
```

--------------------------------------------------------------------------------

---[FILE: iam_no_service_roles_at_project_level_test.py]---
Location: prowler-master/tests/providers/gcp/services/iam/iam_no_service_roles_at_project_level/iam_no_service_roles_at_project_level_test.py

```python
from re import search
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_iam_no_service_roles_at_project_level:
    def test_iam_no_bindings(self):
        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.bindings = []
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.region = "global"
        cloudresourcemanager_client.projects = {
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
                "prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service.CloudResourceManager",
                new=cloudresourcemanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_no_service_roles_at_project_level.iam_no_service_roles_at_project_level.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_no_service_roles_at_project_level.iam_no_service_roles_at_project_level import (
                iam_no_service_roles_at_project_level,
            )

            check = iam_no_service_roles_at_project_level()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "No IAM Users assigned to service roles at project level",
                result[0].status_extended,
            )
            assert result[0].resource_id == GCP_PROJECT_ID

    def test_three_compliant_binding(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Binding,
        )

        binding1 = Binding(
            role="roles/cloudfunctions.serviceAgent",
            members=[["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"]],
            project_id=GCP_PROJECT_ID,
        )
        binding2 = Binding(
            role="roles/compute.serviceAgent",
            members=[["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"]],
            project_id=GCP_PROJECT_ID,
        )
        binding3 = Binding(
            role="roles/connectors.managedZoneViewer",
            members=[["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"]],
            project_id=GCP_PROJECT_ID,
        )

        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.bindings = [binding1, binding2, binding3]
        cloudresourcemanager_client.region = "global"
        cloudresourcemanager_client.projects = {
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
                "prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service.CloudResourceManager",
                new=cloudresourcemanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_no_service_roles_at_project_level.iam_no_service_roles_at_project_level.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_no_service_roles_at_project_level.iam_no_service_roles_at_project_level import (
                iam_no_service_roles_at_project_level,
            )

            check = iam_no_service_roles_at_project_level()
            result = check.execute()

            assert len(result) == 1

            assert result[0].status == "PASS"
            assert search(
                "No IAM Users assigned to service roles at project level",
                result[0].status_extended,
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == cloudresourcemanager_client.region

    def test_binding_with_service_account_user(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Binding,
        )

        binding = Binding(
            role="roles/iam.serviceAccountUser",
            members=[["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"]],
            project_id=GCP_PROJECT_ID,
        )

        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.bindings = [binding]
        cloudresourcemanager_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service.CloudResourceManager",
                new=cloudresourcemanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_no_service_roles_at_project_level.iam_no_service_roles_at_project_level.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_no_service_roles_at_project_level.iam_no_service_roles_at_project_level import (
                iam_no_service_roles_at_project_level,
            )

            check = iam_no_service_roles_at_project_level()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"IAM Users assigned to service role '{binding.role}' at project level",
                result[0].status_extended,
            )
            assert result[0].resource_id == binding.role
            assert result[0].resource_name == binding.role
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == cloudresourcemanager_client.region

    def test_binding_with_service_account_token_creator(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Binding,
        )

        binding = Binding(
            role="roles/iam.serviceAccountTokenCreator",
            members=[["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"]],
            project_id=GCP_PROJECT_ID,
        )

        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.bindings = [binding]
        cloudresourcemanager_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service.CloudResourceManager",
                new=cloudresourcemanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_no_service_roles_at_project_level.iam_no_service_roles_at_project_level.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_no_service_roles_at_project_level.iam_no_service_roles_at_project_level import (
                iam_no_service_roles_at_project_level,
            )

            check = iam_no_service_roles_at_project_level()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"IAM Users assigned to service role '{binding.role}' at project level {GCP_PROJECT_ID}",
                result[0].status_extended,
            )
            assert result[0].resource_id == binding.role
            assert result[0].resource_name == binding.role
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == cloudresourcemanager_client.region

    def test_iam_no_bindings_empty_project_name(self):
        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.bindings = []
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.region = "global"
        cloudresourcemanager_client.projects = {
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
                "prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service.CloudResourceManager",
                new=cloudresourcemanager_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_no_service_roles_at_project_level.iam_no_service_roles_at_project_level.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_no_service_roles_at_project_level.iam_no_service_roles_at_project_level import (
                iam_no_service_roles_at_project_level,
            )

            check = iam_no_service_roles_at_project_level()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "No IAM Users assigned to service roles at project level",
                result[0].status_extended,
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "GCP Project"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == cloudresourcemanager_client.region
```

--------------------------------------------------------------------------------

---[FILE: iam_organization_essential_contacts_configured_test.py]---
Location: prowler-master/tests/providers/gcp/services/iam/iam_organization_essential_contacts_configured/iam_organization_essential_contacts_configured_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import set_mocked_gcp_provider


class Test_iam_organization_essential_contacts_configured:
    def test_iam_no_organizations(self):
        essentialcontacts_client = mock.MagicMock()
        essentialcontacts_client.organizations = []
        essentialcontacts_client.region = "global"
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_organization_essential_contacts_configured.iam_organization_essential_contacts_configured.essentialcontacts_client",
                new=essentialcontacts_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_organization_essential_contacts_configured.iam_organization_essential_contacts_configured import (
                iam_organization_essential_contacts_configured,
            )

            check = iam_organization_essential_contacts_configured()
            result = check.execute()
            assert len(result) == 0

    def test_iam_org_with_contacts(self):
        essentialcontacts_client = mock.MagicMock()
        essentialcontacts_client.region = "global"
        essentialcontacts_client.organizations = []
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_organization_essential_contacts_configured.iam_organization_essential_contacts_configured.essentialcontacts_client",
                new=essentialcontacts_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_service import Organization

            essentialcontacts_client.organizations = [
                Organization(id="test_id", name="test", contacts=True)
            ]
            essentialcontacts_client.default_project_id = "test_id"
            from prowler.providers.gcp.services.iam.iam_organization_essential_contacts_configured.iam_organization_essential_contacts_configured import (
                iam_organization_essential_contacts_configured,
            )

            check = iam_organization_essential_contacts_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "has essential contacts configured",
                result[0].status_extended,
            )
            assert result[0].resource_id == "test_id"
            assert result[0].resource_name == "test"
            assert result[0].project_id == "test_id"
            assert result[0].location == "global"

    def test_iam_org_without_contacts(self):
        essentialcontacts_client = mock.MagicMock()
        essentialcontacts_client.region = "global"
        essentialcontacts_client.organizations = []
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_organization_essential_contacts_configured.iam_organization_essential_contacts_configured.essentialcontacts_client",
                new=essentialcontacts_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_service import Organization

            essentialcontacts_client.organizations = [
                Organization(id="test_id", name="test", contacts=False)
            ]
            essentialcontacts_client.default_project_id = "test_id"

            from prowler.providers.gcp.services.iam.iam_organization_essential_contacts_configured.iam_organization_essential_contacts_configured import (
                iam_organization_essential_contacts_configured,
            )

            check = iam_organization_essential_contacts_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "does not have essential contacts configured",
                result[0].status_extended,
            )
            assert result[0].resource_id == "test_id"
            assert result[0].resource_name == "test"
            assert result[0].project_id == "test_id"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: iam_role_kms_enforce_separation_of_duties_test.py]---
Location: prowler-master/tests/providers/gcp/services/iam/iam_role_kms_enforce_separation_of_duties/iam_role_kms_enforce_separation_of_duties_test.py

```python
from re import search
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_iam_role_kms_enforce_separation_of_duties:
    def test_iam_no_bindings(self):
        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.bindings = []
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.region = "global"
        cloudresourcemanager_client.projects = {
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
                "prowler.providers.gcp.services.iam.iam_role_kms_enforce_separation_of_duties.iam_role_kms_enforce_separation_of_duties.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_role_kms_enforce_separation_of_duties.iam_role_kms_enforce_separation_of_duties import (
                iam_role_kms_enforce_separation_of_duties,
            )

            check = iam_role_kms_enforce_separation_of_duties()
            result = check.execute()
            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "PASS"
                assert search(
                    "Principle of separation of duties was enforced for KMS-Related Roles",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region

    def test_three_compliant_binding(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Binding,
        )

        binding1 = Binding(
            role="roles/cloudfunctions.serviceAgent",
            members=["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"],
            project_id=GCP_PROJECT_ID,
        )
        binding2 = Binding(
            role="roles/compute.serviceAgent",
            members=["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"],
            project_id=GCP_PROJECT_ID,
        )
        binding3 = Binding(
            role="roles/connectors.managedZoneViewer",
            members=["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"],
            project_id=GCP_PROJECT_ID,
        )

        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.bindings = [binding1, binding2, binding3]
        cloudresourcemanager_client.region = "global"
        cloudresourcemanager_client.projects = {
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
                "prowler.providers.gcp.services.iam.iam_role_kms_enforce_separation_of_duties.iam_role_kms_enforce_separation_of_duties.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_role_kms_enforce_separation_of_duties.iam_role_kms_enforce_separation_of_duties import (
                iam_role_kms_enforce_separation_of_duties,
            )

            check = iam_role_kms_enforce_separation_of_duties()
            result = check.execute()

            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "PASS"
                assert search(
                    "Principle of separation of duties was enforced for KMS-Related Roles",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region

    def test_uncompliant_binding(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Binding,
        )

        binding1 = Binding(
            role="roles/cloudkms.admin",
            members=["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"],
            project_id=GCP_PROJECT_ID,
        )
        binding2 = Binding(
            role="roles/cloudkms.cryptoKeyEncrypterDecrypter",
            members=["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"],
            project_id=GCP_PROJECT_ID,
        )
        binding3 = Binding(
            role="roles/connectors.managedZoneViewer",
            members=["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"],
            project_id=GCP_PROJECT_ID,
        )

        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.bindings = [binding1, binding2, binding3]
        cloudresourcemanager_client.region = "global"
        cloudresourcemanager_client.projects = {
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
                "prowler.providers.gcp.services.iam.iam_role_kms_enforce_separation_of_duties.iam_role_kms_enforce_separation_of_duties.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_role_kms_enforce_separation_of_duties.iam_role_kms_enforce_separation_of_duties import (
                iam_role_kms_enforce_separation_of_duties,
            )

            check = iam_role_kms_enforce_separation_of_duties()
            result = check.execute()

            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "FAIL"
                assert search(
                    "Principle of separation of duties was not enforced for KMS-Related Roles",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region

    def test_iam_no_bindings_empty_project_name(self):
        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.bindings = []
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.region = "global"
        cloudresourcemanager_client.projects = {
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
                "prowler.providers.gcp.services.iam.iam_role_kms_enforce_separation_of_duties.iam_role_kms_enforce_separation_of_duties.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_role_kms_enforce_separation_of_duties.iam_role_kms_enforce_separation_of_duties import (
                iam_role_kms_enforce_separation_of_duties,
            )

            check = iam_role_kms_enforce_separation_of_duties()
            result = check.execute()
            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "PASS"
                assert search(
                    "Principle of separation of duties was enforced for KMS-Related Roles",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.resource_name == "GCP Project"
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region

    def test_uncompliant_binding_empty_project_name(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Binding,
        )

        binding1 = Binding(
            role="roles/cloudkms.admin",
            members=["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"],
            project_id=GCP_PROJECT_ID,
        )
        binding2 = Binding(
            role="roles/cloudkms.cryptoKeyEncrypterDecrypter",
            members=["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"],
            project_id=GCP_PROJECT_ID,
        )
        binding3 = Binding(
            role="roles/connectors.managedZoneViewer",
            members=["serviceAccount:685829395199@cloudbuild.gserviceaccount.com"],
            project_id=GCP_PROJECT_ID,
        )

        cloudresourcemanager_client = mock.MagicMock()
        cloudresourcemanager_client.project_ids = [GCP_PROJECT_ID]
        cloudresourcemanager_client.bindings = [binding1, binding2, binding3]
        cloudresourcemanager_client.region = "global"
        cloudresourcemanager_client.projects = {
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
                "prowler.providers.gcp.services.iam.iam_role_kms_enforce_separation_of_duties.iam_role_kms_enforce_separation_of_duties.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_role_kms_enforce_separation_of_duties.iam_role_kms_enforce_separation_of_duties import (
                iam_role_kms_enforce_separation_of_duties,
            )

            check = iam_role_kms_enforce_separation_of_duties()
            result = check.execute()

            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "FAIL"
                assert search(
                    "Principle of separation of duties was not enforced for KMS-Related Roles",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.resource_name == "GCP Project"
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region
```

--------------------------------------------------------------------------------

````
