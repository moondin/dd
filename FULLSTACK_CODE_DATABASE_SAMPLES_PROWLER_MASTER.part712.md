---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 712
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 712 of 867)

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

---[FILE: iam_sa_user_managed_key_rotate_90_days_test.py]---
Location: prowler-master/tests/providers/gcp/services/iam/iam_sa_user_managed_key_rotate_90_days/iam_sa_user_managed_key_rotate_90_days_test.py

```python
from datetime import datetime
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class Test_iam_sa_user_managed_key_rotate_90_days:
    def test_iam_no_sa(self):
        iam_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_rotate_90_days.iam_sa_user_managed_key_rotate_90_days.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_sa_user_managed_key_rotate_90_days.iam_sa_user_managed_key_rotate_90_days import (
                iam_sa_user_managed_key_rotate_90_days,
            )

            iam_client.project_ids = [GCP_PROJECT_ID]
            iam_client.region = GCP_US_CENTER1_LOCATION
            iam_client.service_accounts = []

            check = iam_sa_user_managed_key_rotate_90_days()
            result = check.execute()
            assert len(result) == 0

    def test_iam_sa_no_keys(self):
        iam_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_rotate_90_days.iam_sa_user_managed_key_rotate_90_days.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_sa_user_managed_key_rotate_90_days.iam_sa_user_managed_key_rotate_90_days import (
                iam_sa_user_managed_key_rotate_90_days,
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

            check = iam_sa_user_managed_key_rotate_90_days()
            result = check.execute()
            assert len(result) == 0

    def test_iam_sa_user_managed_key_rotate_90_days(self):
        iam_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_rotate_90_days.iam_sa_user_managed_key_rotate_90_days.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_sa_user_managed_key_rotate_90_days.iam_sa_user_managed_key_rotate_90_days import (
                iam_sa_user_managed_key_rotate_90_days,
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
                            name="projects/my-project/serviceAccounts/my-service-account@my-project.iam.gserviceaccount.com/keys/90c48f61c65cd56224a12ab18e6ee9ca9c3aee7c",
                            origin="GOOGLE_PROVIDED",
                            type="USER_MANAGED",
                            valid_after=datetime.now(),
                            valid_before=datetime.strptime("9999-12-31", "%Y-%m-%d"),
                        )
                    ],
                    project_id=GCP_PROJECT_ID,
                    uniqueId="111222233334444",
                )
            ]

            check = iam_sa_user_managed_key_rotate_90_days()
            last_rotated = (
                datetime.now() - iam_client.service_accounts[0].keys[0].valid_after
            ).days
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"User-managed key {iam_client.service_accounts[0].keys[0].name} for account {iam_client.service_accounts[0].email} was rotated over the last 90 days ({last_rotated} days ago)."
            )
            assert result[0].resource_id == iam_client.service_accounts[0].keys[0].name
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource_name == iam_client.service_accounts[0].email

    def test_iam_sa_user_managed_key_no_rotate_90_days(self):
        iam_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_sa_user_managed_key_rotate_90_days.iam_sa_user_managed_key_rotate_90_days.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_sa_user_managed_key_rotate_90_days.iam_sa_user_managed_key_rotate_90_days import (
                iam_sa_user_managed_key_rotate_90_days,
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
                            name="projects/my-project/serviceAccounts/my-service-account@my-project.iam.gserviceaccount.com/keys/90c48f61c65cd56224a12ab18e6ee9ca9c3aee7c",
                            origin="GOOGLE_PROVIDED",
                            type="USER_MANAGED",
                            valid_after=datetime.strptime("2023-07-10", "%Y-%m-%d"),
                            valid_before=datetime.strptime("9999-12-31", "%Y-%m-%d"),
                        )
                    ],
                    project_id=GCP_PROJECT_ID,
                    uniqueId="111222233334444",
                )
            ]

            check = iam_sa_user_managed_key_rotate_90_days()
            last_rotated = (
                datetime.now() - iam_client.service_accounts[0].keys[0].valid_after
            ).days
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"User-managed key {iam_client.service_accounts[0].keys[0].name} for account {iam_client.service_accounts[0].email} was not rotated over the last 90 days ({last_rotated} days ago)."
            )
            assert result[0].resource_id == iam_client.service_accounts[0].keys[0].name
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource_name == iam_client.service_accounts[0].email
```

--------------------------------------------------------------------------------

---[FILE: iam_service_account_unused_test.py]---
Location: prowler-master/tests/providers/gcp/services/iam/iam_service_account_unused/iam_service_account_unused_test.py

```python
from datetime import datetime
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class Test_iam_service_account_unused:
    def test_iam_no_sa(self):
        iam_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_service_account_unused.iam_service_account_unused.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_service_account_unused.iam_service_account_unused import (
                iam_service_account_unused,
            )

            iam_client.project_ids = [GCP_PROJECT_ID]
            iam_client.region = GCP_US_CENTER1_LOCATION
            iam_client.service_accounts = []

            check = iam_service_account_unused()
            result = check.execute()
            assert len(result) == 0

    def test_iam_service_account_unused_single(self):
        iam_client = mock.MagicMock()
        monitoring_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_service_account_unused.iam_service_account_unused.iam_client",
                new=iam_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_service_account_unused.iam_service_account_unused.monitoring_client",
                new=monitoring_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_service import (
                Key,
                ServiceAccount,
            )
            from prowler.providers.gcp.services.iam.iam_service_account_unused.iam_service_account_unused import (
                iam_service_account_unused,
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

            monitoring_client.sa_api_metrics = set(["111222233334444"])
            monitoring_client.audit_config = {"max_unused_account_days": 30}

            check = iam_service_account_unused()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Service Account {iam_client.service_accounts[0].email} was used over the last 30 days."
            )
            assert result[0].resource_id == iam_client.service_accounts[0].email
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource == iam_client.service_accounts[0]

    def test_iam_service_account_unused_mix(self):
        iam_client = mock.MagicMock()
        monitoring_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_service_account_unused.iam_service_account_unused.iam_client",
                new=iam_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.iam.iam_service_account_unused.iam_service_account_unused.monitoring_client",
                new=monitoring_client,
            ),
        ):
            from prowler.providers.gcp.services.iam.iam_service import (
                Key,
                ServiceAccount,
            )
            from prowler.providers.gcp.services.iam.iam_service_account_unused.iam_service_account_unused import (
                iam_service_account_unused,
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
                ),
                ServiceAccount(
                    name="projects/my-project/serviceAccounts/my-service-account2@my-project.iam.gserviceaccount.com",
                    email="my-service-account2@my-project.iam.gserviceaccount.com",
                    display_name="My service account 2",
                    keys=[],
                    project_id=GCP_PROJECT_ID,
                    uniqueId="55566666777888999",
                ),
            ]

            monitoring_client.sa_api_metrics = set(["111222233334444"])
            monitoring_client.audit_config = {"max_unused_account_days": 30}

            check = iam_service_account_unused()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Service Account {iam_client.service_accounts[0].email} was used over the last 30 days."
            )
            assert result[0].resource_id == iam_client.service_accounts[0].email
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource == iam_client.service_accounts[0]

            assert result[1].status == "FAIL"
            assert (
                result[1].status_extended
                == f"Service Account {iam_client.service_accounts[1].email} was not used over the last 30 days."
            )
            assert result[1].resource_id == iam_client.service_accounts[1].email
            assert result[1].project_id == GCP_PROJECT_ID
            assert result[1].location == GCP_US_CENTER1_LOCATION
            assert result[1].resource == iam_client.service_accounts[1]
```

--------------------------------------------------------------------------------

---[FILE: kmsgcp_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/kms/kmsgcp_service_test.py

```python
from unittest.mock import patch

from prowler.providers.gcp.services.kms.kms_service import KMS
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestKMSService:
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
            kms_client = KMS(set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID]))
            assert kms_client.service == "cloudkms"
            assert kms_client.project_ids == [GCP_PROJECT_ID]

            assert len(kms_client.locations) == 1
            assert kms_client.locations[0].name == "eu-west1"
            assert kms_client.locations[0].project_id == GCP_PROJECT_ID

            assert len(kms_client.key_rings) == 2
            assert (
                kms_client.key_rings[0].name
                == "projects/123/locations/eu-west1/keyRings/keyring1"
            )
            assert kms_client.key_rings[0].project_id == GCP_PROJECT_ID
            assert (
                kms_client.key_rings[1].name
                == "projects/123/locations/eu-west1/keyRings/keyring2"
            )
            assert kms_client.key_rings[1].project_id == GCP_PROJECT_ID

            assert len(kms_client.crypto_keys) == 2
            assert kms_client.crypto_keys[0].name == "key1"
            assert kms_client.crypto_keys[0].location == "eu-west1"
            assert (
                kms_client.crypto_keys[0].key_ring
                == "projects/123/locations/eu-west1/keyRings/keyring1"
            )
            assert kms_client.crypto_keys[0].rotation_period == "7776000s"
            assert kms_client.crypto_keys[0].members == [
                "user:mike@example.com",
                "group:admins@example.com",
                "domain:google.com",
                "serviceAccount:my-project-id@appspot.gserviceaccount.com",
            ]
            assert kms_client.crypto_keys[0].project_id == GCP_PROJECT_ID
            assert kms_client.crypto_keys[1].name == "key2"
            assert kms_client.crypto_keys[1].location == "eu-west1"
            assert (
                kms_client.crypto_keys[1].key_ring
                == "projects/123/locations/eu-west1/keyRings/keyring1"
            )
            assert kms_client.crypto_keys[1].members == []
            assert kms_client.crypto_keys[1].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: kms_key_not_publicly_accessible_gcp_test.py]---
Location: prowler-master/tests/providers/gcp/services/kms/kms_key_not_publicly_accessible/kms_key_not_publicly_accessible_gcp_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class Test_kms_key_not_publicly_accessible_gcp:
    def test_kms_no_key(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_not_publicly_accessible.kms_key_not_publicly_accessible.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_not_publicly_accessible.kms_key_not_publicly_accessible import (
                kms_key_not_publicly_accessible,
            )

            kms_client.project_ids = [GCP_PROJECT_ID]
            kms_client.region = GCP_US_CENTER1_LOCATION
            kms_client.crypto_keys = []

            check = kms_key_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    def test_kms_key_public(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_not_publicly_accessible.kms_key_not_publicly_accessible.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_not_publicly_accessible.kms_key_not_publicly_accessible import (
                kms_key_not_publicly_accessible,
            )
            from prowler.providers.gcp.services.kms.kms_service import (
                CriptoKey,
                KeyLocation,
                KeyRing,
            )

            kms_client.project_ids = [GCP_PROJECT_ID]
            kms_client.region = GCP_US_CENTER1_LOCATION

            keyring = KeyRing(
                name="projects/123/locations/us-central1/keyRings/keyring1",
                project_id=GCP_PROJECT_ID,
            )

            keylocation = KeyLocation(
                name=GCP_US_CENTER1_LOCATION,
                project_id=GCP_PROJECT_ID,
            )

            kms_client.crypto_keys = [
                CriptoKey(
                    name="key1",
                    id="projects/123/locations/us-central1/keyRings/keyring1/cryptoKeys/key1",
                    project_id=GCP_PROJECT_ID,
                    rotation_period="7776000s",
                    next_rotation_time="2021-01-01T00:00:00Z",
                    key_ring=keyring.name,
                    location=keylocation.name,
                    members=["allUsers"],
                )
            ]

            check = kms_key_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} may be publicly accessible."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id

    def test_kms_key_private(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_not_publicly_accessible.kms_key_not_publicly_accessible.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_not_publicly_accessible.kms_key_not_publicly_accessible import (
                kms_key_not_publicly_accessible,
            )
            from prowler.providers.gcp.services.kms.kms_service import (
                CriptoKey,
                KeyLocation,
                KeyRing,
            )

            kms_client.project_ids = [GCP_PROJECT_ID]
            kms_client.region = GCP_US_CENTER1_LOCATION

            keyring = KeyRing(
                name="projects/123/locations/us-central1/keyRings/keyring1",
                project_id=GCP_PROJECT_ID,
            )

            keylocation = KeyLocation(
                name=GCP_US_CENTER1_LOCATION,
                project_id=GCP_PROJECT_ID,
            )

            kms_client.crypto_keys = [
                CriptoKey(
                    name="key1",
                    id="projects/123/locations/us-central1/keyRings/keyring1/cryptoKeys/key1",
                    project_id=GCP_PROJECT_ID,
                    rotation_period="7776000s",
                    next_rotation_time="2021-01-01T00:00:00Z",
                    key_ring=keyring.name,
                    location=keylocation.name,
                    members=["user:jane@example.com"],
                )
            ]

            check = kms_key_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is not exposed to Public."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id

    def test_kms_key_no_member(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_not_publicly_accessible.kms_key_not_publicly_accessible.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_not_publicly_accessible.kms_key_not_publicly_accessible import (
                kms_key_not_publicly_accessible,
            )
            from prowler.providers.gcp.services.kms.kms_service import (
                CriptoKey,
                KeyLocation,
                KeyRing,
            )

            kms_client.project_ids = [GCP_PROJECT_ID]
            kms_client.region = GCP_US_CENTER1_LOCATION

            keyring = KeyRing(
                name="projects/123/locations/us-central1/keyRings/keyring1",
                project_id=GCP_PROJECT_ID,
            )

            keylocation = KeyLocation(
                name=GCP_US_CENTER1_LOCATION,
                project_id=GCP_PROJECT_ID,
            )

            kms_client.crypto_keys = [
                CriptoKey(
                    name="key1",
                    id="projects/123/locations/us-central1/keyRings/keyring1/cryptoKeys/key1",
                    project_id=GCP_PROJECT_ID,
                    rotation_period="7776000s",
                    next_rotation_time="2021-01-01T00:00:00Z",
                    key_ring=keyring.name,
                    location=keylocation.name,
                    members=[],
                )
            ]

            check = kms_key_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is not exposed to Public."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id
```

--------------------------------------------------------------------------------

````
