---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 699
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 699 of 867)

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

---[FILE: cloudstorage_bucket_lifecycle_management_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudstorage/cloudstorage_bucket_lifecycle_management_enabled/cloudstorage_bucket_lifecycle_management_enabled_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class TestCloudStorageBucketLifecycleManagementEnabled:
    def test_bucket_without_lifecycle_rules(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_bucket_lifecycle_management_enabled import (
                cloudstorage_bucket_lifecycle_management_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="no-lifecycle",
                    id="no-lifecycle",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                )
            ]

            check = cloudstorage_bucket_lifecycle_management_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} does not have lifecycle management enabled."
            )
            assert result[0].resource_id == "no-lifecycle"
            assert result[0].resource_name == "no-lifecycle"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_with_minimal_delete_rule(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_bucket_lifecycle_management_enabled import (
                cloudstorage_bucket_lifecycle_management_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="delete-rule",
                    id="delete-rule",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[
                        {"action": {"type": "Delete"}, "condition": {"age": 30}}
                    ],
                )
            ]

            check = cloudstorage_bucket_lifecycle_management_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} has lifecycle management enabled with 1 valid rule(s)."
            )
            assert result[0].resource_id == "delete-rule"
            assert result[0].resource_name == "delete-rule"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_with_transition_and_delete_rules(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_bucket_lifecycle_management_enabled import (
                cloudstorage_bucket_lifecycle_management_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="transition-delete",
                    id="transition-delete",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[
                        {
                            "action": {
                                "type": "SetStorageClass",
                                "storageClass": "NEARLINE",
                            },
                            "condition": {"matchesStorageClass": ["STANDARD"]},
                        },
                        {"action": {"type": "Delete"}, "condition": {"age": 365}},
                    ],
                )
            ]

            check = cloudstorage_bucket_lifecycle_management_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} has lifecycle management enabled with 2 valid rule(s)."
            )
            assert result[0].resource_id == "transition-delete"
            assert result[0].resource_name == "transition-delete"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_with_invalid_lifecycle_rules(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_lifecycle_management_enabled.cloudstorage_bucket_lifecycle_management_enabled import (
                cloudstorage_bucket_lifecycle_management_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="invalid-rules",
                    id="invalid-rules",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[
                        {"action": {}, "condition": {"age": 30}},
                        {"action": {"type": "Delete"}, "condition": {}},
                    ],
                )
            ]

            check = cloudstorage_bucket_lifecycle_management_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} has lifecycle rules configured but none are valid."
            )
            assert result[0].resource_id == "invalid-rules"
            assert result[0].resource_name == "invalid-rules"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_logging_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudstorage/cloudstorage_bucket_logging_enabled/cloudstorage_bucket_logging_enabled_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class TestCloudStorageBucketLoggingEnabled:
    def test_no_buckets(self):
        cloudstorage_client = mock.MagicMock()
        cloudstorage_client.buckets = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_logging_enabled.cloudstorage_bucket_logging_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_logging_enabled.cloudstorage_bucket_logging_enabled import (
                cloudstorage_bucket_logging_enabled,
            )

            check = cloudstorage_bucket_logging_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_bucket_with_logging_disabled(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_logging_enabled.cloudstorage_bucket_logging_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_logging_enabled.cloudstorage_bucket_logging_enabled import (
                cloudstorage_bucket_logging_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="logging-disabled",
                    id="logging-disabled",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=True,
                    soft_delete_enabled=True,
                    logging_bucket=None,
                    logging_prefix=None,
                )
            ]

            check = cloudstorage_bucket_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} does not have Usage and Storage Logs enabled."
            )
            assert result[0].resource_id == "logging-disabled"
            assert result[0].resource_name == "logging-disabled"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_with_logging_enabled(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_logging_enabled.cloudstorage_bucket_logging_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_logging_enabled.cloudstorage_bucket_logging_enabled import (
                cloudstorage_bucket_logging_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="logging-enabled",
                    id="logging-enabled",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=True,
                    soft_delete_enabled=True,
                    logging_bucket="log-bucket",
                    logging_prefix="logs/",
                )
            ]

            check = cloudstorage_bucket_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} has Usage and Storage Logs enabled. Logs are stored in bucket 'log-bucket' with prefix 'logs/'."
            )
            assert result[0].resource_id == "logging-enabled"
            assert result[0].resource_name == "logging-enabled"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_with_logging_enabled_no_prefix(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_logging_enabled.cloudstorage_bucket_logging_enabled.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_logging_enabled.cloudstorage_bucket_logging_enabled import (
                cloudstorage_bucket_logging_enabled,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            cloudstorage_client.buckets = [
                Bucket(
                    name="logging-enabled-no-prefix",
                    id="logging-enabled-no-prefix",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=False,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                    lifecycle_rules=[],
                    versioning_enabled=True,
                    soft_delete_enabled=True,
                    logging_bucket="log-bucket",
                    logging_prefix=None,
                )
            ]

            check = cloudstorage_bucket_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} has Usage and Storage Logs enabled. Logs are stored in bucket 'log-bucket' with default prefix."
            )
            assert result[0].resource_id == "logging-enabled-no-prefix"
            assert result[0].resource_name == "logging-enabled-no-prefix"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_log_retention_policy_lock_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudstorage/cloudstorage_bucket_log_retention_policy_lock/cloudstorage_bucket_log_retention_policy_lock_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class TestCloudStorageBucketLogRetentionPolicyLock:
    def test_bucket_with_retention_policy_and_lock(self):
        cloudstorage_client = mock.MagicMock()
        logging_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_client",
                new=cloudstorage_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock import (
                cloudstorage_bucket_log_retention_policy_lock,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
                RetentionPolicy,
            )
            from prowler.providers.gcp.services.logging.logging_service import Sink

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            logging_client.sinks = [
                Sink(
                    name="sink1",
                    destination="storage.googleapis.com/example-bucket",
                    filter="all",
                    project_id=GCP_PROJECT_ID,
                )
            ]

            cloudstorage_client.buckets = [
                Bucket(
                    name="example-bucket",
                    id="example-bucket",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=True,
                    retention_policy=RetentionPolicy(
                        retention_period=31536000,
                        is_locked=True,
                        effective_time=None,
                    ),
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudstorage_bucket_log_retention_policy_lock()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Log Sink Bucket {cloudstorage_client.buckets[0].name} has a Retention Policy with Bucket Lock."
            )
            assert result[0].resource_id == "example-bucket"
            assert result[0].resource_name == "example-bucket"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_with_retention_policy_without_lock(self):
        cloudstorage_client = mock.MagicMock()
        logging_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_client",
                new=cloudstorage_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock import (
                cloudstorage_bucket_log_retention_policy_lock,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
                RetentionPolicy,
            )
            from prowler.providers.gcp.services.logging.logging_service import Sink

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            logging_client.sinks = [
                Sink(
                    name="sink1",
                    destination="storage.googleapis.com/example-bucket",
                    filter="all",
                    project_id=GCP_PROJECT_ID,
                )
            ]

            cloudstorage_client.buckets = [
                Bucket(
                    name="example-bucket",
                    id="example-bucket",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=True,
                    retention_policy=RetentionPolicy(
                        retention_period=31536000,
                        is_locked=False,
                        effective_time=None,
                    ),
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudstorage_bucket_log_retention_policy_lock()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Log Sink Bucket {cloudstorage_client.buckets[0].name} has a Retention Policy but without Bucket Lock."
            )
            assert result[0].resource_id == "example-bucket"
            assert result[0].resource_name == "example-bucket"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_without_retention_policy(self):
        cloudstorage_client = mock.MagicMock()
        logging_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_client",
                new=cloudstorage_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock import (
                cloudstorage_bucket_log_retention_policy_lock,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
                Bucket,
            )
            from prowler.providers.gcp.services.logging.logging_service import Sink

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            logging_client.sinks = [
                Sink(
                    name="sink1",
                    destination="storage.googleapis.com/example-bucket",
                    filter="all",
                    project_id=GCP_PROJECT_ID,
                )
            ]

            cloudstorage_client.buckets = [
                Bucket(
                    name="example-bucket",
                    id="example-bucket",
                    region=GCP_US_CENTER1_LOCATION,
                    uniform_bucket_level_access=True,
                    public=True,
                    retention_policy=None,
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudstorage_bucket_log_retention_policy_lock()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Log Sink Bucket {cloudstorage_client.buckets[0].name} has no Retention Policy."
            )
            assert result[0].resource_id == "example-bucket"
            assert result[0].resource_name == "example-bucket"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_no_buckets(self):
        cloudstorage_client = mock.MagicMock()
        logging_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_client",
                new=cloudstorage_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock import (
                cloudstorage_bucket_log_retention_policy_lock,
            )
            from prowler.providers.gcp.services.logging.logging_service import Sink

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            logging_client.sinks = [
                Sink(
                    name="sink1",
                    destination="storage.googleapis.com/example-bucket",
                    filter="all",
                    project_id=GCP_PROJECT_ID,
                )
            ]

            cloudstorage_client.buckets = []

            check = cloudstorage_bucket_log_retention_policy_lock()
            result = check.execute()

            assert len(result) == 0

    def test_no_buckets_no_sinks(self):
        cloudstorage_client = mock.MagicMock()
        logging_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_client",
                new=cloudstorage_client,
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_log_retention_policy_lock.cloudstorage_bucket_log_retention_policy_lock import (
                cloudstorage_bucket_log_retention_policy_lock,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION

            logging_client.sinks = []

            cloudstorage_client.buckets = []

            check = cloudstorage_bucket_log_retention_policy_lock()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_public_access_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudstorage/cloudstorage_bucket_public_access/cloudstorage_bucket_public_access_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class TestCloudStorageBucketPublicAccess:
    def test_bucket_public_access(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_public_access.cloudstorage_bucket_public_access.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_public_access.cloudstorage_bucket_public_access import (
                cloudstorage_bucket_public_access,
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
                    public=True,
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudstorage_bucket_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} is publicly accessible."
            )
            assert result[0].resource_id == "example-bucket"
            assert result[0].resource_name == "example-bucket"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_bucket_no_public_access(self):
        cloudstorage_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_public_access.cloudstorage_bucket_public_access.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_public_access.cloudstorage_bucket_public_access import (
                cloudstorage_bucket_public_access,
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

            check = cloudstorage_bucket_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Bucket {cloudstorage_client.buckets[0].name} is not publicly accessible."
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
                "prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_public_access.cloudstorage_bucket_public_access.cloudstorage_client",
                new=cloudstorage_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_bucket_public_access.cloudstorage_bucket_public_access import (
                cloudstorage_bucket_public_access,
            )

            cloudstorage_client.project_ids = [GCP_PROJECT_ID]
            cloudstorage_client.region = GCP_US_CENTER1_LOCATION
            cloudstorage_client.buckets = []

            check = cloudstorage_bucket_public_access()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
