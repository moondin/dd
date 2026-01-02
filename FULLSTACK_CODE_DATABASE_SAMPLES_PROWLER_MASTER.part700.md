---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 700
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 700 of 867)

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

---[FILE: cloudstorage_bucket_soft_delete_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudstorage/cloudstorage_bucket_soft_delete_enabled/cloudstorage_bucket_soft_delete_enabled_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class TestCloudStorageBucketSoftDeleteEnabled:
    def test_no_buckets(self):
        cloudstorage_client = mock.MagicMock()
        cloudstorage_client.buckets = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_soft_delete_enabled.cloudstorage_bucket_soft_delete_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_soft_delete_enabled.cloudstorage_bucket_soft_delete_enabled import (
                cloudstorage_bucket_soft_delete_enabled,
            )

            check = cloudstorage_bucket_soft_delete_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_bucket_with_soft_delete_disabled(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_soft_delete_enabled.cloudstorage_bucket_soft_delete_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_soft_delete_enabled.cloudstorage_bucket_soft_delete_enabled import (
                cloudstorage_bucket_soft_delete_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="soft-delete-disabled",
                    id="soft-delete-disabled",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=False,
                    soft_delete_enabled=False,
                )
            ]

            check = cloudstorage_bucket_soft_delete_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} does not have Soft Delete enabled."
            )
            assert result[0].resource_id == "soft-delete-disabled"
            assert result[0].resource_name == "soft-delete-disabled"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_with_soft_delete_enabled(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_soft_delete_enabled.cloudstorage_bucket_soft_delete_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_soft_delete_enabled.cloudstorage_bucket_soft_delete_enabled import (
                cloudstorage_bucket_soft_delete_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="with-soft-delete",
                    id="with-soft-delete",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=True,
                    soft_delete_enabled=True,
                )
            ]

            check = cloudstorage_bucket_soft_delete_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} has Soft Delete enabled."
            )
            assert result[0].resource_id == "with-soft-delete"
            assert result[0].resource_name == "with-soft-delete"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_without_soft_delete_configured_treated_as_disabled(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_soft_delete_enabled.cloudstorage_bucket_soft_delete_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_soft_delete_enabled.cloudstorage_bucket_soft_delete_enabled import (
                cloudstorage_bucket_soft_delete_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="no-soft-delete-policy",
                    id="no-soft-delete-policy",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=False,
                )
            ]

            check = cloudstorage_bucket_soft_delete_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} does not have Soft Delete enabled."
            )
            assert result[0].resource_id == "no-soft-delete-policy"
            assert result[0].resource_name == "no-soft-delete-policy"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_sufficient_retention_period_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudstorage/cloudstorage_bucket_sufficient_retention_period/cloudstorage_bucket_sufficient_retention_period_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class TestCloudStorageBucketSufficientRetentionPeriod:
    def test_no_buckets(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_sufficient_retention_period.cloudstorage_bucket_sufficient_retention_period.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_sufficient_retention_period.cloudstorage_bucket_sufficient_retention_period import (
                cloudstorage_bucket_sufficient_retention_period,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION
            cloudstorage_client.buckets = []
            cloudstorage_client.audit_config = {"storage_min_retention_days": 90}

            check = cloudstorage_bucket_sufficient_retention_period()
            result = check.execute()

            assert len(result) == 0

    def test_bucket_without_retention_policy(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_sufficient_retention_period.cloudstorage_bucket_sufficient_retention_period.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_sufficient_retention_period.cloudstorage_bucket_sufficient_retention_period import (
                cloudstorage_bucket_sufficient_retention_period,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION
            cloudstorage_client.audit_config = {"storage_min_retention_days": 90}

            cloudstorage_client.buckets = [
                Bucket(
                    name="no-retention-policy",
                    id="no-retention-policy",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=True,
                )
            ]

            check = cloudstorage_bucket_sufficient_retention_period()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Bucket no-retention-policy does not have a retention policy (minimum required: 90 days)."
            )
            assert result[0].resource_id == "no-retention-policy"
            assert result[0].resource_name == "no-retention-policy"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_with_sufficient_retention_policy(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_sufficient_retention_period.cloudstorage_bucket_sufficient_retention_period.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_sufficient_retention_period.cloudstorage_bucket_sufficient_retention_period import (
                cloudstorage_bucket_sufficient_retention_period,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
                RetentionPolicy,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION
            cloudstorage_client.audit_config = {"storage_min_retention_days": 90}

            cloudstorage_client.buckets = [
                Bucket(
                    name="sufficient-retention-policy",
                    id="sufficient-retention-policy",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=RetentionPolicy(
                        retention_period=12096000,  # 140 days
                        is_locked=False,
                        effective_time=None,
                    ),
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=True,
                )
            ]

            check = cloudstorage_bucket_sufficient_retention_period()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Bucket sufficient-retention-policy has a sufficient retention policy of 140 days (minimum required: 90)."
            )
            assert result[0].resource_id == "sufficient-retention-policy"
            assert result[0].resource_name == "sufficient-retention-policy"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_with_insufficient_retention_policy(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_sufficient_retention_period.cloudstorage_bucket_sufficient_retention_period.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_sufficient_retention_period.cloudstorage_bucket_sufficient_retention_period import (
                cloudstorage_bucket_sufficient_retention_period,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
                RetentionPolicy,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION
            cloudstorage_client.audit_config = {"storage_min_retention_days": 90}

            cloudstorage_client.buckets = [
                Bucket(
                    name="insufficient-retention-policy",
                    id="insufficient-retention-policy",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=RetentionPolicy(
                        retention_period=604800,  # 7 days
                        is_locked=False,
                        effective_time=None,
                    ),
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=True,
                )
            ]

            check = cloudstorage_bucket_sufficient_retention_period()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Bucket insufficient-retention-policy has an insufficient retention policy of 7 days (minimum required: 90)."
            )
            assert result[0].resource_id == "insufficient-retention-policy"
            assert result[0].resource_name == "insufficient-retention-policy"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_uniform_bucket_level_access_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudstorage/cloudstorage_bucket_uniform_bucket_level_access/cloudstorage_bucket_uniform_bucket_level_access_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class TestCloudStorageBucketUniformBucketLevelAccess:
    def test_bucket_with_uniform_bucket_level_access_enabled(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_uniform_bucket_level_access.cloudstorage_bucket_uniform_bucket_level_access.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_uniform_bucket_level_access.cloudstorage_bucket_uniform_bucket_level_access import (
                cloudstorage_bucket_uniform_bucket_level_access,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="example-bucket",
                    id="example-bucket",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudstorage_bucket_uniform_bucket_level_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} has uniform Bucket Level Access enabled."
            )
            assert result[0].resource_id == "example-bucket"
            assert result[0].resource_name == "example-bucket"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_with_uniform_bucket_level_access_disabled(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_uniform_bucket_level_access.cloudstorage_bucket_uniform_bucket_level_access.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_uniform_bucket_level_access.cloudstorage_bucket_uniform_bucket_level_access import (
                cloudstorage_bucket_uniform_bucket_level_access,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="example-bucket",
                    id="example-bucket",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=False,
                    public=False,
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudstorage_bucket_uniform_bucket_level_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} has uniform Bucket Level Access disabled."
            )
            assert result[0].resource_id == "example-bucket"
            assert result[0].resource_name == "example-bucket"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_no_buckets(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_uniform_bucket_level_access.cloudstorage_bucket_uniform_bucket_level_access.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_uniform_bucket_level_access.cloudstorage_bucket_uniform_bucket_level_access import (
                cloudstorage_bucket_uniform_bucket_level_access,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION
            cloudstorage_client.buckets = []

            check = cloudstorage_bucket_uniform_bucket_level_access()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_versioning_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudstorage/cloudstorage_bucket_versioning_enabled/cloudstorage_bucket_versioning_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class TestCloudStorageBucketVersioningEnabled:
    def test_bucket_without_versioning(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_versioning_enabled.cloudstorage_bucket_versioning_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_versioning_enabled.cloudstorage_bucket_versioning_enabled import (
                cloudstorage_bucket_versioning_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="no-versioning",
                    id="no-versioning",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=False,
                )
            ]

            check = cloudstorage_bucket_versioning_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} does not have Object Versioning enabled."
            )
            assert result[0].resource_id == "no-versioning"
            assert result[0].resource_name == "no-versioning"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_with_versioning_enabled(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_versioning_enabled.cloudstorage_bucket_versioning_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_versioning_enabled.cloudstorage_bucket_versioning_enabled import (
                cloudstorage_bucket_versioning_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="with-versioning",
                    id="with-versioning",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=True,
                )
            ]

            check = cloudstorage_bucket_versioning_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} has Object Versioning enabled."
            )
            assert result[0].resource_id == "with-versioning"
            assert result[0].resource_name == "with-versioning"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_without_versioning_configured_treated_as_disabled(self):

        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_versioning_enabled.cloudstorage_bucket_versioning_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_versioning_enabled.cloudstorage_bucket_versioning_enabled import (
                cloudstorage_bucket_versioning_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="no-versioning-config",
                    id="no-versioning-config",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=False,
                )
            ]

            check = cloudstorage_bucket_versioning_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} does not have Object Versioning enabled."
            )
            assert result[0].resource_id == "no-versioning-config"
            assert result[0].resource_name == "no-versioning-config"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

````
