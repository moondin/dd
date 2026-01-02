---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 500
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 500 of 867)

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

---[FILE: documentdb_cluster_cloudwatch_log_export_test.py]---
Location: prowler-master/tests/providers/aws/services/documentdb/documentdb_cluster_cloudwatch_log_export/documentdb_cluster_cloudwatch_log_export_test.py

```python
from unittest import mock

from prowler.providers.aws.services.documentdb.documentdb_service import DBCluster

AWS_ACCOUNT_NUMBER = "123456789012"
AWS_REGION = "us-east-1"

DOC_DB_CLUSTER_NAME = "test-cluster"
DOC_DB_CLUSTER_ARN = (
    f"arn:aws:rds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:cluster:{DOC_DB_CLUSTER_NAME}"
)
DOC_DB_ENGINE_VERSION = "5.0.0"


class Test_documentdb_cluster_cloudwatch_log_export:
    def test_documentdb_no_clusters(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_cloudwatch_log_export.documentdb_cluster_cloudwatch_log_export import (
                documentdb_cluster_cloudwatch_log_export,
            )

            check = documentdb_cluster_cloudwatch_log_export()
            result = check.execute()
            assert len(result) == 0

    def test_documentdb_cluster_cloudwatch_log_export_disabled(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=0,
                encrypted=False,
                cloudwatch_logs=[],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=False,
                region=AWS_REGION,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_cloudwatch_log_export.documentdb_cluster_cloudwatch_log_export import (
                documentdb_cluster_cloudwatch_log_export,
            )

            check = documentdb_cluster_cloudwatch_log_export()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} does not have cloudwatch log export enabled."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN

    def test_documentdb_cluster_cloudwatch_log_export_audit_only_enabled(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=9,
                encrypted=True,
                cloudwatch_logs=["audit"],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=True,
                region=AWS_REGION,
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_cloudwatch_log_export.documentdb_cluster_cloudwatch_log_export import (
                documentdb_cluster_cloudwatch_log_export,
            )

            check = documentdb_cluster_cloudwatch_log_export()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "DocumentDB Cluster test-cluster is only shipping audit to CloudWatch Logs. Recommended to ship both Audit and Profiler logs."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN

    def test_documentdb_cluster_cloudwatch_log_export_profiler_only_enabled(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=9,
                encrypted=True,
                cloudwatch_logs=["profiler"],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=True,
                region=AWS_REGION,
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_cloudwatch_log_export.documentdb_cluster_cloudwatch_log_export import (
                documentdb_cluster_cloudwatch_log_export,
            )

            check = documentdb_cluster_cloudwatch_log_export()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "DocumentDB Cluster test-cluster is only shipping profiler to CloudWatch Logs. Recommended to ship both Audit and Profiler logs."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN

    def test_documentdb_cluster_cloudwatch_log_export_enabled(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=9,
                encrypted=True,
                cloudwatch_logs=["audit", "profiler"],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=True,
                region=AWS_REGION,
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_cloudwatch_log_export.documentdb_cluster_cloudwatch_log_export import (
                documentdb_cluster_cloudwatch_log_export,
            )

            check = documentdb_cluster_cloudwatch_log_export()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "DocumentDB Cluster test-cluster is shipping audit profiler to CloudWatch Logs."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_deletion_protection_test.py]---
Location: prowler-master/tests/providers/aws/services/documentdb/documentdb_cluster_deletion_protection/documentdb_cluster_deletion_protection_test.py

```python
from unittest import mock

from prowler.providers.aws.services.documentdb.documentdb_service import DBCluster

AWS_ACCOUNT_NUMBER = "123456789012"
AWS_REGION = "us-east-1"

DOC_DB_CLUSTER_NAME = "test-cluster"
DOC_DB_CLUSTER_ARN = (
    f"arn:aws:rds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:cluster:{DOC_DB_CLUSTER_NAME}"
)
DOC_DB_ENGINE_VERSION = "5.0.0"


class Test_documentdb_cluster_deletion_protection:
    def test_documentdb_no_clusters(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_deletion_protection.documentdb_cluster_deletion_protection import (
                documentdb_cluster_deletion_protection,
            )

            check = documentdb_cluster_deletion_protection()
            result = check.execute()
            assert len(result) == 0

    def test_documentdb_cluster_deletion_protection_disabled(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=0,
                encrypted=False,
                cloudwatch_logs=[],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=False,
                region=AWS_REGION,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_deletion_protection.documentdb_cluster_deletion_protection import (
                documentdb_cluster_deletion_protection,
            )

            check = documentdb_cluster_deletion_protection()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} does not have deletion protection enabled."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN

    def test_documentdb_cluster_deletion_protection_enabled(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=9,
                encrypted=True,
                cloudwatch_logs=[],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=True,
                region=AWS_REGION,
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_deletion_protection.documentdb_cluster_deletion_protection import (
                documentdb_cluster_deletion_protection,
            )

            check = documentdb_cluster_deletion_protection()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} has deletion protection enabled."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_multi_az_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/documentdb/documentdb_cluster_multi_az_enabled/documentdb_cluster_multi_az_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.documentdb.documentdb_service import DBCluster

AWS_ACCOUNT_NUMBER = "123456789012"
AWS_REGION = "us-east-1"

DOC_DB_CLUSTER_NAME = "test-cluster"
DOC_DB_CLUSTER_ARN = (
    f"arn:aws:rds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:cluster:{DOC_DB_CLUSTER_NAME}"
)
DOC_DB_ENGINE_VERSION = "5.0.0"


class Test_documentdb_cluster_multi_az_enabled:
    def test_documentdb_no_clusters(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_multi_az_enabled.documentdb_cluster_multi_az_enabled import (
                documentdb_cluster_multi_az_enabled,
            )

            check = documentdb_cluster_multi_az_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_documentdb_cluster_not_encrypted(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=1,
                encrypted=False,
                cloudwatch_logs=[],
                multi_az=False,
                parameter_group="default.docdb3.6",
                deletion_protection=True,
                region=AWS_REGION,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_multi_az_enabled.documentdb_cluster_multi_az_enabled import (
                documentdb_cluster_multi_az_enabled,
            )

            check = documentdb_cluster_multi_az_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} does not have Multi-AZ enabled."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN

    def test_documentdb_cluster_with_encryption(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=1,
                encrypted=True,
                cloudwatch_logs=[],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=True,
                region=AWS_REGION,
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_multi_az_enabled.documentdb_cluster_multi_az_enabled import (
                documentdb_cluster_multi_az_enabled,
            )

            check = documentdb_cluster_multi_az_enabled()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} has Multi-AZ enabled."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_public_snapshot_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/documentdb/documentdb_cluster_public_snapshot/documentdb_cluster_public_snapshot_fixer_test.py

```python
from unittest import mock

import botocore
import botocore.client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

mock_make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_public_snapshot(self, operation_name, kwarg):
    if operation_name == "ModifyDBClusterSnapshotAttribute":
        return {
            "DBClusterSnapshotAttributesResult": {
                "DBClusterSnapshotAttributes": [
                    {
                        "AttributeName": "restore",
                        "DBClusterSnapshotIdentifier": "test-snapshot",
                        "AttributeValues": [],
                    }
                ]
            }
        }
    return mock_make_api_call(self, operation_name, kwarg)


def mock_make_api_call_public_snapshot_error(self, operation_name, kwarg):
    if operation_name == "ModifyDBClusterSnapshotAttribute":
        raise botocore.exceptions.ClientError(
            {
                "Error": {
                    "Code": "DBClusterSnapshotNotFoundFault",
                    "Message": "DBClusterSnapshotNotFoundFault",
                }
            },
            operation_name,
        )
    return mock_make_api_call(self, operation_name, kwarg)


class Test_documentdb_cluster_public_snapshot_fixer:
    @mock_aws
    def test_documentdb_cluster_public_snapshot_fixer(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_public_snapshot,
        ):
            from prowler.providers.aws.services.documentdb.documentdb_service import (
                DocumentDB,
            )

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.documentdb.documentdb_cluster_public_snapshot.documentdb_cluster_public_snapshot_fixer.documentdb_client",
                    new=DocumentDB(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.documentdb.documentdb_cluster_public_snapshot.documentdb_cluster_public_snapshot_fixer import (
                    fixer,
                )

                assert fixer(resource_id="test-snapshot", region=AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_documentdb_cluster_public_snapshot_fixer_error(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_public_snapshot_error,
        ):
            from prowler.providers.aws.services.documentdb.documentdb_service import (
                DocumentDB,
            )

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.documentdb.documentdb_cluster_public_snapshot.documentdb_cluster_public_snapshot_fixer.documentdb_client",
                    new=DocumentDB(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.documentdb.documentdb_cluster_public_snapshot.documentdb_cluster_public_snapshot_fixer import (
                    fixer,
                )

                assert not fixer(
                    resource_id="test-snapshot", region=AWS_REGION_EU_WEST_1
                )
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_public_snapshot_test.py]---
Location: prowler-master/tests/providers/aws/services/documentdb/documentdb_cluster_public_snapshot/documentdb_cluster_public_snapshot_test.py

```python
from unittest import mock

from prowler.providers.aws.services.documentdb.documentdb_service import (
    ClusterSnapshot,
    DBCluster,
)

AWS_ACCOUNT_NUMBER = "123456789012"
AWS_REGION_US_EAST_1 = "us-east-1"

DOC_DB_CLUSTER_NAME = "test-cluster"
DOC_DB_CLUSTER_ARN = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{DOC_DB_CLUSTER_NAME}"
DOC_DB_ENGINE_VERSION = "5.0.0"


class Test_documentdb_cluster_public_snapshot:
    def test_documentdb_no_snapshot(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {}
        documentdb_client.db_cluster_snapshots = []

        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_public_snapshot.documentdb_cluster_public_snapshot import (
                documentdb_cluster_public_snapshot,
            )

            check = documentdb_cluster_public_snapshot()
            result = check.execute()
            assert len(result) == 0

    def test_documentdb_cluster_private_snapshot(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=0,
                encrypted=False,
                cloudwatch_logs=[],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=False,
                region=AWS_REGION_US_EAST_1,
                tags=[],
            )
        }
        documentdb_client.db_cluster_snapshots = [
            ClusterSnapshot(
                id="snapshot-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1",
                cluster_id=DOC_DB_CLUSTER_NAME,
                encrypted=False,
                region=AWS_REGION_US_EAST_1,
                tags=[],
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_public_snapshot.documentdb_cluster_public_snapshot import (
                documentdb_cluster_public_snapshot,
            )

            check = documentdb_cluster_public_snapshot()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "DocumentDB Cluster Snapshot snapshot-1 is not shared publicly."
            )
            assert result[0].resource_id == "snapshot-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1"
            )
            assert result[0].resource_tags == []

    def test_documentdb_cluster_public_snapshot(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=9,
                encrypted=True,
                cloudwatch_logs=[],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=True,
                region=AWS_REGION_US_EAST_1,
                tags=[],
            )
        }
        documentdb_client.db_cluster_snapshots = [
            ClusterSnapshot(
                id="snapshot-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1",
                cluster_id=DOC_DB_CLUSTER_NAME,
                encrypted=False,
                region=AWS_REGION_US_EAST_1,
                tags=[],
            )
        ]
        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_public_snapshot.documentdb_cluster_public_snapshot import (
                documentdb_cluster_public_snapshot,
            )

            documentdb_client.db_cluster_snapshots[0].public = True
            check = documentdb_cluster_public_snapshot()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "DocumentDB Cluster Snapshot snapshot-1 is public."
            )
            assert result[0].resource_id == "snapshot-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_storage_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/documentdb/documentdb_cluster_storage_encrypted/documentdb_cluster_storage_encrypted_test.py

```python
from unittest import mock

from prowler.providers.aws.services.documentdb.documentdb_service import DBCluster

AWS_ACCOUNT_NUMBER = "123456789012"
AWS_REGION = "us-east-1"

DOC_DB_CLUSTER_NAME = "test-cluster"
DOC_DB_CLUSTER_ARN = (
    f"arn:aws:rds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:cluster:{DOC_DB_CLUSTER_NAME}"
)
DOC_DB_ENGINE_VERSION = "5.0.0"


class Test_documentdb_cluster_storage_encrypted:
    def test_documentdb_no_clusters(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_storage_encrypted.documentdb_cluster_storage_encrypted import (
                documentdb_cluster_storage_encrypted,
            )

            check = documentdb_cluster_storage_encrypted()
            result = check.execute()
            assert len(result) == 0

    def test_documentdb_cluster_not_encrypted(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=1,
                encrypted=False,
                cloudwatch_logs=[],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=True,
                region=AWS_REGION,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_storage_encrypted.documentdb_cluster_storage_encrypted import (
                documentdb_cluster_storage_encrypted,
            )

            check = documentdb_cluster_storage_encrypted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} is not encrypted at rest."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN

    def test_documentdb_cluster_with_encryption(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=1,
                encrypted=True,
                cloudwatch_logs=[],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=True,
                region=AWS_REGION,
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_service.DocumentDB",
                new=documentdb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.documentdb.documentdb_client.documentdb_client",
                new=documentdb_client,
            ),
        ):
            from prowler.providers.aws.services.documentdb.documentdb_cluster_storage_encrypted.documentdb_cluster_storage_encrypted import (
                documentdb_cluster_storage_encrypted,
            )

            check = documentdb_cluster_storage_encrypted()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} is encrypted at rest."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN
```

--------------------------------------------------------------------------------

---[FILE: drs_service_test.py]---
Location: prowler-master/tests/providers/aws/services/drs/drs_service_test.py

```python
from datetime import datetime
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.drs.drs_service import DRS
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

# Mocking Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "DescribeJobs":
        return {
            "items": [
                {
                    "arn": "arn:aws:disaster-recovery:us-east-1:123456789012:job/jobID1",
                    "creationDateTime": datetime(2024, 1, 1),
                    "endDateTime": datetime(2024, 1, 1),
                    "initiatedBy": "START_RECOVERY",
                    "jobID": "jobID1",
                    "participatingServers": [
                        {
                            "launchStatus": "PENDING",
                            "recoveryInstanceID": "i-1234567890abcdef0",
                            "sourceServerID": "i-1234567890abcdef0",
                        },
                    ],
                    "status": "PENDING",
                    "tags": {"test_tag": "test_value"},
                    "type": "LAUNCH",
                },
            ]
        }

    return make_api_call(self, operation_name, kwargs)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_DRS_Service:
    def test_get_client(self):
        aws_provider = set_mocked_aws_provider()
        drs = DRS(aws_provider)
        assert drs.regional_clients[AWS_REGION_US_EAST_1].__class__.__name__ == "drs"

    def test__get_service__(self):
        aws_provider = set_mocked_aws_provider()
        drs = DRS(aws_provider)
        assert drs.service == "drs"

    def test_describe_jobs(self):
        aws_provider = set_mocked_aws_provider()
        drs = DRS(aws_provider)
        assert len(drs.drs_services) == 1
        assert drs.drs_services[0].id == "DRS"
        assert drs.drs_services[0].region == AWS_REGION_US_EAST_1
        assert drs.drs_services[0].status == "ENABLED"
```

--------------------------------------------------------------------------------

````
