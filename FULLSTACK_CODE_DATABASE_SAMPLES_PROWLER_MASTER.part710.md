---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 710
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 710 of 867)

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

---[FILE: iam_role_sa_enforce_separation_of_duties_test.py]---
Location: prowler-master/tests/providers/gcp/services/iam/iam_role_sa_enforce_separation_of_duties/iam_role_sa_enforce_separation_of_duties_test.py

```python
from re import search
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_iam_role_sa_enforce_separation_of_duties:
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
                "prowler.providers.gcp.services.iam.iam_role_sa_enforce_separation_of_duties.iam_role_sa_enforce_separation_of_duties.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_role_sa_enforce_separation_of_duties.iam_role_sa_enforce_separation_of_duties import (
                iam_role_sa_enforce_separation_of_duties,
            )

            check = iam_role_sa_enforce_separation_of_duties()
            result = check.execute()
            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "PASS"
                assert search(
                    "Principle of separation of duties was enforced for Service-Account Related Roles",
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
                "prowler.providers.gcp.services.iam.iam_role_sa_enforce_separation_of_duties.iam_role_sa_enforce_separation_of_duties.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_role_sa_enforce_separation_of_duties.iam_role_sa_enforce_separation_of_duties import (
                iam_role_sa_enforce_separation_of_duties,
            )

            check = iam_role_sa_enforce_separation_of_duties()
            result = check.execute()

            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "PASS"
                assert search(
                    "Principle of separation of duties was enforced for Service-Account Related Roles",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region

    def test_one_uncompliant_binding(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Binding,
        )

        binding1 = Binding(
            role="roles/iam.serviceAccountUser",
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
                "prowler.providers.gcp.services.iam.iam_role_sa_enforce_separation_of_duties.iam_role_sa_enforce_separation_of_duties.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_role_sa_enforce_separation_of_duties.iam_role_sa_enforce_separation_of_duties import (
                iam_role_sa_enforce_separation_of_duties,
            )

            check = iam_role_sa_enforce_separation_of_duties()
            result = check.execute()

            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "FAIL"
                assert search(
                    "Principle of separation of duties was not enforced for Service-Account Related Roles",
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
                "prowler.providers.gcp.services.iam.iam_role_sa_enforce_separation_of_duties.iam_role_sa_enforce_separation_of_duties.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_role_sa_enforce_separation_of_duties.iam_role_sa_enforce_separation_of_duties import (
                iam_role_sa_enforce_separation_of_duties,
            )

            check = iam_role_sa_enforce_separation_of_duties()
            result = check.execute()
            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "PASS"
                assert search(
                    "Principle of separation of duties was enforced for Service-Account Related Roles",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.resource_name == "GCP Project"
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region

    def test_one_uncompliant_binding_empty_project_name(self):
        from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
            Binding,
        )

        binding1 = Binding(
            role="roles/iam.serviceAccountUser",
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
                "prowler.providers.gcp.services.iam.iam_role_sa_enforce_separation_of_duties.iam_role_sa_enforce_separation_of_duties.cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_role_sa_enforce_separation_of_duties.iam_role_sa_enforce_separation_of_duties import (
                iam_role_sa_enforce_separation_of_duties,
            )

            check = iam_role_sa_enforce_separation_of_duties()
            result = check.execute()

            assert len(result) == 1
            for idx, r in enumerate(result):
                assert r.status == "FAIL"
                assert search(
                    "Principle of separation of duties was not enforced for Service-Account Related Roles",
                    r.status_extended,
                )
                assert r.resource_id == GCP_PROJECT_ID
                assert r.resource_name == "GCP Project"
                assert r.project_id == GCP_PROJECT_ID
                assert r.location == cloudresourcemanager_client.region
```

--------------------------------------------------------------------------------

---[FILE: iam_sa_dormant_user_managed_keys_test.py]---
Location: prowler-master/tests/providers/gcp/services/iam/iam_sa_dormant_user_managed_keys/iam_sa_dormant_user_managed_keys_test.py

```python
from datetime import datetime
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class Test_iam_sa_user_managed_key_unused:
    def test_iam_no_sa(self):
        iam_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused import (
                iam_sa_user_managed_key_unused,
            )

            iam_client.project_ids = [GCP_PROJECT_ID]
            iam_client.region = GCP_US_CENTER1_LOCATION
            iam_client.service_accounts = []

            check = iam_sa_user_managed_key_unused()
            result = check.execute()
            assert len(result) == 0

    def test_iam_sa_unused_no_keys(self):
        iam_client = mock.MagicMock()
        monitoring_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused.iam_client",
                new=iam_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused.monitoring_client",
                new=monitoring_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused import (
                iam_sa_user_managed_key_unused,
            )
            from prowler.providers.gcp.services.iam.iam_service import ServiceAccount

            iam_client.project_ids = [GCP_PROJECT_ID]
            iam_client.region = GCP_US_CENTER1_LOCATION

            iam_client.service_accounts = [
                ServiceAccount(
                    name="projects/my-project/serviceAccounts/my-service-account@my-project.iam.gserviceaccount.com",
                    email="my-service-account@my-project.iam.gserviceaccount.com",
                    display_name="My service account",
                    keys=[],
                    project_id=GCP_PROJECT_ID,
                    uniqueId="111222233334444",
                )
            ]

            monitoring_client.sa_keys_metrics = set(
                ["90c48f61c65cd56224a12ab18e6ee9ca9c3aee7c"]
            )

            check = iam_sa_user_managed_key_unused()
            result = check.execute()
            assert len(result) == 0

    def test_iam_sa_unused_system_managed_keys(self):
        iam_client = mock.MagicMock()
        monitoring_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused.iam_client",
                new=iam_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused.monitoring_client",
                new=monitoring_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused import (
                iam_sa_user_managed_key_unused,
            )
            from prowler.providers.gcp.services.iam.iam_service import (
                Key,
                ServiceAccount,
            )

            iam_client.project_ids = [GCP_PROJECT_ID]
            iam_client.region = GCP_US_CENTER1_LOCATION

            iam_client.service_accounts = [
                ServiceAccount(
                    name="projects/my-project/serviceAccounts/my-service-account@my-project.iam.gserviceaccount.com",
                    email="my-service-account@my-project.iam.gserviceaccount.com",
                    display_name="My service account",
                    keys=[
                        Key(
                            name="90c48f61c65cd56224a12ab18e6ee9ca9c3aee7c",
                            origin="GOOGLE_PROVIDED",
                            type="SYSTEM_MANAGED",
                            valid_after=datetime.strptime("2024-07-10", "%Y-%m-%d"),
                            valid_before=datetime.strptime("9999-12-31", "%Y-%m-%d"),
                        )
                    ],
                    project_id=GCP_PROJECT_ID,
                    uniqueId="111222233334444",
                )
            ]

            monitoring_client.sa_keys_metrics = set(
                ["90c48f61c65cd56224a12ab18e6ee9ca9c3aee7c"]
            )

            check = iam_sa_user_managed_key_unused()
            result = check.execute()
            assert len(result) == 0

    def test_iam_sa_user_managed_key_unused(self):
        iam_client = mock.MagicMock()
        monitoring_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused.iam_client",
                new=iam_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused.monitoring_client",
                new=monitoring_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused import (
                iam_sa_user_managed_key_unused,
            )
            from prowler.providers.gcp.services.iam.iam_service import (
                Key,
                ServiceAccount,
            )

            iam_client.project_ids = [GCP_PROJECT_ID]
            iam_client.region = GCP_US_CENTER1_LOCATION

            iam_client.service_accounts = [
                ServiceAccount(
                    name="projects/my-project/serviceAccounts/my-service-account@my-project.iam.gserviceaccount.com",
                    email="my-service-account@my-project.iam.gserviceaccount.com",
                    display_name="My service account",
                    keys=[
                        Key(
                            name="90c48f61c65cd56224a12ab18e6ee9ca9c3aee7c",
                            origin="GOOGLE_PROVIDED",
                            type="USER_MANAGED",
                            valid_after=datetime.strptime("2024-07-10", "%Y-%m-%d"),
                            valid_before=datetime.strptime("9999-12-31", "%Y-%m-%d"),
                        )
                    ],
                    project_id=GCP_PROJECT_ID,
                    uniqueId="111222233334444",
                )
            ]

            monitoring_client.sa_keys_metrics = set(
                ["90c48f61c65cd56224a12ab18e6ee9ca9c3aee7c"]
            )
            monitoring_client.audit_config = {"max_unused_account_days": 30}

            check = iam_sa_user_managed_key_unused()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"User-managed key {iam_client.service_accounts[0].keys[0].name} for Service Account {iam_client.service_accounts[0].email} was used over the last 30 days."
            )
            assert result[0].resource_id == iam_client.service_accounts[0].keys[0].name
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource_name == iam_client.service_accounts[0].email

    def test_iam_sa_unused_mixed_keys(self):
        iam_client = mock.MagicMock()
        monitoring_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused.iam_client",
                new=iam_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused.monitoring_client",
                new=monitoring_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_sa_user_managed_key_unused.iam_sa_user_managed_key_unused import (
                iam_sa_user_managed_key_unused,
            )
            from prowler.providers.gcp.services.iam.iam_service import (
                Key,
                ServiceAccount,
            )

            iam_client.project_ids = [GCP_PROJECT_ID]
            iam_client.region = GCP_US_CENTER1_LOCATION

            iam_client.service_accounts = [
                ServiceAccount(
                    name="projects/my-project/serviceAccounts/my-service-account@my-project.iam.gserviceaccount.com",
                    email="my-service-account@my-project.iam.gserviceaccount.com",
                    display_name="My service account",
                    keys=[
                        Key(
                            name="90c48f61c65cd56224a12ab18e6ee9ca9c3aee7c",
                            origin="GOOGLE_PROVIDED",
                            type="SYSTEM_MANAGED",
                            valid_after=datetime.strptime("2024-07-10", "%Y-%m-%d"),
                            valid_before=datetime.strptime("9999-12-31", "%Y-%m-%d"),
                        ),
                        Key(
                            name="e5e3800831ac1adc8a5849da7d827b4724b1fce8",
                            origin="GOOGLE_PROVIDED",
                            type="USER_MANAGED",
                            valid_after=datetime.strptime("2024-07-10", "%Y-%m-%d"),
                            valid_before=datetime.strptime("9999-12-31", "%Y-%m-%d"),
                        ),
                        Key(
                            name="f8e4771561be5cda9b1267add7006c5143e3a220",
                            origin="GOOGLE_PROVIDED",
                            type="USER_MANAGED",
                            valid_after=datetime.strptime("2024-07-10", "%Y-%m-%d"),
                            valid_before=datetime.strptime("9999-12-31", "%Y-%m-%d"),
                        ),
                    ],
                    project_id=GCP_PROJECT_ID,
                    uniqueId="111222233334444",
                )
            ]

            monitoring_client.sa_keys_metrics = set(
                ["f8e4771561be5cda9b1267add7006c5143e3a220"]
            )
            monitoring_client.audit_config = {"max_unused_account_days": 30}

            check = iam_sa_user_managed_key_unused()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"User-managed key {iam_client.service_accounts[0].keys[1].name} for Service Account {iam_client.service_accounts[0].email} was not used over the last 30 days."
            )
            assert result[0].resource_id == iam_client.service_accounts[0].keys[1].name
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource_name == iam_client.service_accounts[0].email

            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == f"User-managed key {iam_client.service_accounts[0].keys[2].name} for Service Account {iam_client.service_accounts[0].email} was used over the last 30 days."
            )
            assert result[1].resource_id == iam_client.service_accounts[0].keys[2].name
            assert result[1].project_id == GCP_PROJECT_ID
            assert result[1].location == GCP_US_CENTER1_LOCATION
            assert result[1].resource_name == iam_client.service_accounts[0].email
```

--------------------------------------------------------------------------------

````
