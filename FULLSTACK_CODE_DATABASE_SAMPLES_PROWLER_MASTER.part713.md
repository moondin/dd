---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 713
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 713 of 867)

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

---[FILE: kms_key_rotation_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/kms/kms_key_rotation_enabled/kms_key_rotation_enabled_test.py

```python
import datetime
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class Test_kms_key_rotation_enabled:
    def test_kms_no_key(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled import (
                kms_key_rotation_enabled,
            )

            kms_client.project_ids = [GCP_PROJECT_ID]
            kms_client.region = GCP_US_CENTER1_LOCATION
            kms_client.crypto_keys = []

            check = kms_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_kms_key_no_next_rotation_time_and_no_rotation_period(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled import (
                kms_key_rotation_enabled,
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
                    key_ring=keyring.name,
                    location=keylocation.name,
                    members=["user:jane@example.com"],
                )
            ]

            check = kms_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is not rotated every 90 days or less and the next rotation time is in more than 90 days."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id

    def test_kms_key_no_next_rotation_time_and_big_rotation_period(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled import (
                kms_key_rotation_enabled,
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
                    key_ring=keyring.name,
                    location=keylocation.name,
                    rotation_period="8776000s",
                    members=["user:jane@example.com"],
                )
            ]

            check = kms_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is not rotated every 90 days or less and the next rotation time is in more than 90 days."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id

    def test_kms_key_no_next_rotation_time_and_appropriate_rotation_period(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled import (
                kms_key_rotation_enabled,
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
                    key_ring=keyring.name,
                    location=keylocation.name,
                    rotation_period="7776000s",
                    members=["user:jane@example.com"],
                )
            ]

            check = kms_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is rotated every 90 days or less but the next rotation time is in more than 90 days."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id

    def test_kms_key_no_rotation_period_and_big_next_rotation_time(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled import (
                kms_key_rotation_enabled,
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
                    key_ring=keyring.name,
                    location=keylocation.name,
                    # Next rotation time of now + 100 days
                    next_rotation_time=(
                        datetime.datetime.now() - datetime.timedelta(days=+100)
                    ).strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                    members=["user:jane@example.com"],
                )
            ]

            check = kms_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is not rotated every 90 days or less and the next rotation time is in more than 90 days."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id

    def test_kms_key_no_rotation_period_and_appropriate_next_rotation_time(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled import (
                kms_key_rotation_enabled,
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
                    key_ring=keyring.name,
                    location=keylocation.name,
                    # Next rotation time of now + 30 days
                    next_rotation_time=(
                        datetime.datetime.now() - datetime.timedelta(days=+30)
                    ).strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                    members=["user:jane@example.com"],
                )
            ]

            check = kms_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is not rotated every 90 days or less but the next rotation time is in less than 90 days."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id

    def test_kms_key_rotation_period_greater_90_days_and_big_next_rotation_time(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled import (
                kms_key_rotation_enabled,
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
                    rotation_period="8776000s",
                    # Next rotation time of now + 100 days
                    next_rotation_time=(
                        datetime.datetime.now() - datetime.timedelta(days=+100)
                    ).strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                    key_ring=keyring.name,
                    location=keylocation.name,
                    members=["user:jane@example.com"],
                )
            ]

            check = kms_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is not rotated every 90 days or less and the next rotation time is in more than 90 days."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id

    def test_kms_key_rotation_period_greater_90_days_and_appropriate_next_rotation_time(
        self,
    ):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled import (
                kms_key_rotation_enabled,
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
                    rotation_period="8776000s",
                    # Next rotation time of now + 30 days
                    next_rotation_time=(
                        datetime.datetime.now() - datetime.timedelta(days=+30)
                    ).strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                    key_ring=keyring.name,
                    location=keylocation.name,
                    members=["user:jane@example.com"],
                )
            ]

            check = kms_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is not rotated every 90 days or less but the next rotation time is in less than 90 days."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id

    def test_kms_key_rotation_period_less_90_days_and_big_next_rotation_time(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled import (
                kms_key_rotation_enabled,
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
                    # Next rotation time of now + 100 days
                    next_rotation_time=(
                        datetime.datetime.now() - datetime.timedelta(days=+100)
                    ).strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                    key_ring=keyring.name,
                    location=keylocation.name,
                    members=["user:jane@example.com"],
                )
            ]

            check = kms_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is rotated every 90 days or less but the next rotation time is in more than 90 days."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id

    def test_kms_key_rotation_period_less_90_days_and_appropriate_next_rotation_time(
        self,
    ):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled import (
                kms_key_rotation_enabled,
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
                    # Next rotation time of now + 30 days
                    next_rotation_time=(
                        datetime.datetime.now() - datetime.timedelta(days=+30)
                    ).strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                    key_ring=keyring.name,
                    location=keylocation.name,
                    members=["user:jane@example.com"],
                )
            ]

            check = kms_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is rotated every 90 days or less and the next rotation time is in less than 90 days."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id

    def test_kms_key_rotation_with_fractional_seconds(self):
        kms_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.gcp.services.kms.kms_key_rotation_enabled.kms_key_rotation_enabled import (
                kms_key_rotation_enabled,
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
                    # Next rotation time of now + 100 days
                    next_rotation_time=(
                        datetime.datetime.now() - datetime.timedelta(days=+100)
                    ).strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                    key_ring=keyring.name,
                    location=keylocation.name,
                    members=["user:jane@example.com"],
                )
            ]

            check = kms_key_rotation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Key {kms_client.crypto_keys[0].name} is rotated every 90 days or less but the next rotation time is in more than 90 days."
            )
            assert result[0].resource_id == kms_client.crypto_keys[0].id
            assert result[0].resource_name == kms_client.crypto_keys[0].name
            assert result[0].location == kms_client.crypto_keys[0].location
            assert result[0].project_id == kms_client.crypto_keys[0].project_id
```

--------------------------------------------------------------------------------

---[FILE: logging_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/logging/logging_service_test.py

```python
from unittest.mock import patch

from prowler.providers.gcp.services.logging.logging_service import Logging
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestLoggingService:
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
            logging_client = Logging(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert logging_client.service == "logging"
            assert logging_client.project_ids == [GCP_PROJECT_ID]

            assert len(logging_client.sinks) == 2

            assert logging_client.sinks[0].name == "sink1"
            assert (
                logging_client.sinks[0].destination
                == "storage.googleapis.com/example-bucket"
            )
            assert logging_client.sinks[0].filter == "all"
            assert logging_client.sinks[0].project_id == GCP_PROJECT_ID
            assert logging_client.sinks[1].name == "sink2"
            assert (
                logging_client.sinks[1].destination
                == f"bigquery.googleapis.com/projects/{GCP_PROJECT_ID}/datasets/example_dataset"
            )
            assert logging_client.sinks[1].filter == "all"
            assert logging_client.sinks[1].project_id == GCP_PROJECT_ID

            assert len(logging_client.metrics) == 2

            assert logging_client.metrics[0].name == "metric1"
            assert (
                logging_client.metrics[0].type
                == "custom.googleapis.com/invoice/paid/amount"
            )
            assert (
                logging_client.metrics[0].filter
                == "resource.type=gae_app AND severity>=ERROR"
            )
            assert logging_client.metrics[0].project_id == GCP_PROJECT_ID
            assert logging_client.metrics[1].name == "metric2"
            assert (
                logging_client.metrics[1].type
                == "external.googleapis.com/prometheus/up"
            )
            assert (
                logging_client.metrics[1].filter
                == "resource.type=gae_app AND severity>=ERROR"
            )
            assert logging_client.metrics[1].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

````
