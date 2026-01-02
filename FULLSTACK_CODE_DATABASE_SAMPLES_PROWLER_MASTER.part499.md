---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 499
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 499 of 867)

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

---[FILE: dms_replication_task_target_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dms/dms_replication_task_target_logging_enabled/dms_replication_task_target_logging_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.dms.dms_service import ReplicationTasks
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

DMS_ENDPOINT_NAME = "dms-endpoint"
DMS_ENDPOINT_ARN = f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint:{DMS_ENDPOINT_NAME}"
DMS_INSTANCE_NAME = "rep-instance"
DMS_INSTANCE_ARN = (
    f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rep:{DMS_INSTANCE_NAME}"
)
DMS_REPLICATION_TASK_ARN = (
    f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:task:rep-task"
)


class Test_dms_replication_task_target_logging_enabled:
    def test_no_dms_replication_tasks(self):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled import (
                dms_replication_task_target_logging_enabled,
            )

            check = dms_replication_task_target_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_dms_replication_task_logging_not_enabled(self):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=False,
                log_components=[
                    {"Id": "TARGET_LOAD", "Severity": "LOGGER_SEVERITY_DEFAULT"}
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled import (
                dms_replication_task_target_logging_enabled,
            )

            check = dms_replication_task_target_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not have logging enabled for target events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_source_load_only(self):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "TARGET_LOAD", "Severity": "LOGGER_SEVERITY_DEFAULT"}
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled import (
                dms_replication_task_target_logging_enabled,
            )

            check = dms_replication_task_target_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not meet the minimum severity level of logging in Target Apply events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_source_apply_only(self):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "TARGET_APPLY", "Severity": "LOGGER_SEVERITY_DEFAULT"}
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled import (
                dms_replication_task_target_logging_enabled,
            )

            check = dms_replication_task_target_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not meet the minimum severity level of logging in Target Load events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_target_load_apply_with_not_enough_severity_on_load(
        self,
    ):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "TARGET_LOAD", "Severity": "LOGGER_SEVERITY_INFO"},
                    {"Id": "TARGET_APPLY", "Severity": "LOGGER_SEVERITY_DEFAULT"},
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled import (
                dms_replication_task_target_logging_enabled,
            )

            check = dms_replication_task_target_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not meet the minimum severity level of logging in Target Load events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_target_load_apply_with_not_enough_severity_on_apply(
        self,
    ):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "TARGET_LOAD", "Severity": "LOGGER_SEVERITY_DEFAULT"},
                    {"Id": "TARGET_APPLY", "Severity": "LOGGER_SEVERITY_INFO"},
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled import (
                dms_replication_task_target_logging_enabled,
            )

            check = dms_replication_task_target_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not meet the minimum severity level of logging in Target Apply events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_target_load_apply_with_not_enough_severity_on_both(
        self,
    ):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "TARGET_LOAD", "Severity": "LOGGER_SEVERITY_INFO"},
                    {"Id": "TARGET_APPLY", "Severity": "LOGGER_SEVERITY_INFO"},
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled import (
                dms_replication_task_target_logging_enabled,
            )

            check = dms_replication_task_target_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not meet the minimum severity level of logging in Target Apply and Target Load events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_target_load_apply_with_enough_severity_on_both(
        self,
    ):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "TARGET_LOAD", "Severity": "LOGGER_SEVERITY_DEFAULT"},
                    {"Id": "TARGET_APPLY", "Severity": "LOGGER_SEVERITY_DEFAULT"},
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_target_logging_enabled.dms_replication_task_target_logging_enabled import (
                dms_replication_task_target_logging_enabled,
            )

            check = dms_replication_task_target_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task has logging enabled with the minimum severity level in target events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"
```

--------------------------------------------------------------------------------

---[FILE: documentdb_service_test.py]---
Location: prowler-master/tests/providers/aws/services/documentdb/documentdb_service_test.py

```python
import botocore
from mock import patch

from prowler.providers.aws.services.documentdb.documentdb_service import (
    ClusterSnapshot,
    DBCluster,
    DocumentDB,
    Instance,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

DOC_DB_CLUSTER_ID = "test-cluster"
DOC_DB_INSTANCE_NAME = "test-db"
DOC_DB_INSTANCE_ARN = (
    f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:{DOC_DB_INSTANCE_NAME}"
)
DOC_DB_CLUSTER_NAME = "test-cluster"
DOC_DB_CLUSTER_ARN = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{DOC_DB_CLUSTER_NAME}"
DOC_DB_ENGINE_VERSION = "5.0.0"

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """
    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816

    We have to mock every AWS API call using Boto3
    """
    if operation_name == "DescribeDBInstances":
        return {
            "DBInstances": [
                {
                    "DBInstanceIdentifier": DOC_DB_INSTANCE_NAME,
                    "DBInstanceClass": "string",
                    "Engine": "docdb",
                    "DBInstanceStatus": "available",
                    "BackupRetentionPeriod": 1,
                    "EngineVersion": "5.0.0",
                    "AutoMinorVersionUpgrade": False,
                    "PubliclyAccessible": False,
                    "DBClusterIdentifier": DOC_DB_CLUSTER_ID,
                    "StorageEncrypted": False,
                    "DbiResourceId": "string",
                    "CACertificateIdentifier": "rds-ca-2015",
                    "CopyTagsToSnapshot": True | False,
                    "PromotionTier": 123,
                    "DBInstanceArn": DOC_DB_INSTANCE_ARN,
                },
            ]
        }
    if operation_name == "ListTagsForResource":
        return {"TagList": [{"Key": "environment", "Value": "test"}]}
    if operation_name == "DescribeDBClusters":
        return {
            "DBClusters": [
                {
                    "DBClusterIdentifier": DOC_DB_CLUSTER_ID,
                    "DBInstanceIdentifier": DOC_DB_CLUSTER_NAME,
                    "DBInstanceClass": "string",
                    "Engine": "docdb",
                    "Status": "available",
                    "BackupRetentionPeriod": 1,
                    "StorageEncrypted": False,
                    "EnabledCloudwatchLogsExports": [],
                    "DBClusterParameterGroupName": "test",
                    "DeletionProtection": True,
                    "MultiAZ": True,
                    "DBClusterParameterGroup": "default.docdb3.6",
                    "DBClusterArn": DOC_DB_CLUSTER_ARN,
                },
            ]
        }
    if operation_name == "DescribeDBClusterSnapshots":
        return {
            "DBClusterSnapshots": [
                {
                    "DBClusterSnapshotIdentifier": "test-cluster-snapshot",
                    "DBClusterIdentifier": DOC_DB_CLUSTER_ID,
                    "Engine": "docdb",
                    "Status": "available",
                    "StorageEncrypted": True,
                    "DBClusterSnapshotArn": f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:test-cluster-snapshot",
                    "TagList": [{"Key": "snapshot", "Value": "test"}],
                },
            ]
        }
    if operation_name == "DescribeDBClusterSnapshotAttributes":
        return {
            "DBClusterSnapshotAttributesResult": {
                "DBClusterSnapshotIdentifier": "test-cluster-snapshot",
                "DBClusterSnapshotAttributes": [
                    {"AttributeName": "restore", "AttributeValues": ["all"]}
                ],
            }
        }
    return make_api_call(self, operation_name, kwargs)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
# Patch every AWS call using Boto3
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_DocumentDB_Service:
    # Test DocumentDB Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        docdb = DocumentDB(aws_provider)
        assert docdb.service == "docdb"

    # Test DocumentDB Client
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        docdb = DocumentDB(aws_provider)
        assert docdb.client.__class__.__name__ == "DocDB"

    # Test DocumentDB Session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider()
        docdb = DocumentDB(aws_provider)
        assert docdb.session.__class__.__name__ == "Session"

    # Test DocumentDB Session
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider()
        docdb = DocumentDB(aws_provider)
        assert docdb.audited_account == AWS_ACCOUNT_NUMBER

    # Test DocumentDB Get DocumentDB Contacts
    def test_describe_db_instances(self):
        aws_provider = set_mocked_aws_provider()
        docdb = DocumentDB(aws_provider)
        assert docdb.db_instances == {
            DOC_DB_INSTANCE_ARN: Instance(
                id=DOC_DB_INSTANCE_NAME,
                arn=DOC_DB_INSTANCE_ARN,
                engine="docdb",
                engine_version="5.0.0",
                status="available",
                public=False,
                encrypted=False,
                cluster_id=DOC_DB_CLUSTER_ID,
                region=AWS_REGION_US_EAST_1,
                tags=[{"Key": "environment", "Value": "test"}],
            )
        }

    # Test DocumentDB Describe DB Clusters
    def test_describe_db_clusters(self):
        aws_provider = set_mocked_aws_provider()
        docdb = DocumentDB(aws_provider)
        assert docdb.db_clusters == {
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
                region=AWS_REGION_US_EAST_1,
                tags=[{"Key": "environment", "Value": "test"}],
            )
        }

    # Test DocumentDB Describe DB Cluster Snapshots
    def test_describe_db_cluster_snapshots(self):
        aws_provider = set_mocked_aws_provider()
        docdb = DocumentDB(aws_provider)
        assert docdb.db_cluster_snapshots == [
            ClusterSnapshot(
                id="test-cluster-snapshot",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:test-cluster-snapshot",
                cluster_id=DOC_DB_CLUSTER_ID,
                public=True,
                encrypted=True,
                region=AWS_REGION_US_EAST_1,
                tags=[{"Key": "snapshot", "Value": "test"}],
            )
        ]

    # Test DocumentDB Describe DB Snapshot Attributes
    def test_describe_db_cluster_snapshot_attributes(self):
        aws_provider = set_mocked_aws_provider()
        docdb = DocumentDB(aws_provider)
        docdb.db_cluster_snapshots = [
            ClusterSnapshot(
                id="test-cluster-snapshot",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:test-cluster-snapshot",
                cluster_id=DOC_DB_CLUSTER_ID,
                encrypted=True,
                region=AWS_REGION_US_EAST_1,
                tags=[{"Key": "snapshot", "Value": "test"}],
            )
        ]
        docdb._describe_db_cluster_snapshot_attributes(
            docdb.regional_clients[AWS_REGION_US_EAST_1]
        )
        assert docdb.db_cluster_snapshots[0].public is True
```

--------------------------------------------------------------------------------

---[FILE: documentdb_cluster_backup_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/documentdb/documentdb_cluster_backup_enabled/documentdb_cluster_backup_enabled_test.py

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


class Test_documentdb_cluster_backup_enabled:
    def test_documentdb_no_clusters(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {}

        documentdb_client.audit_config = {"minimum_backup_retention_period": 7}
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
            from prowler.providers.aws.services.documentdb.documentdb_cluster_backup_enabled.documentdb_cluster_backup_enabled import (
                documentdb_cluster_backup_enabled,
            )

            check = documentdb_cluster_backup_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_documentdb_cluster_not_backed_up(self):
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
                deletion_protection=True,
                region=AWS_REGION,
                tags=[],
            )
        }
        documentdb_client.audit_config = {"minimum_backup_retention_period": 7}
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
            from prowler.providers.aws.services.documentdb.documentdb_cluster_backup_enabled.documentdb_cluster_backup_enabled import (
                documentdb_cluster_backup_enabled,
            )

            check = documentdb_cluster_backup_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} does not have backup enabled."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN

    def test_documentdb_cluster_with_backup_less_than_recommended(self):
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
        documentdb_client.audit_config = {"minimum_backup_retention_period": 7}
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
            from prowler.providers.aws.services.documentdb.documentdb_cluster_backup_enabled.documentdb_cluster_backup_enabled import (
                documentdb_cluster_backup_enabled,
            )

            check = documentdb_cluster_backup_enabled()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} has backup enabled with retention period 1 days. Recommended to increase the backup retention period to a minimum of 7 days."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN

    def test_documentdb_cluster_with_backup_equal_to_recommended(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=7,
                encrypted=True,
                cloudwatch_logs=[],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=True,
                region=AWS_REGION,
                tags=[],
            )
        }
        documentdb_client.audit_config = {"minimum_backup_retention_period": 7}
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
            from prowler.providers.aws.services.documentdb.documentdb_cluster_backup_enabled.documentdb_cluster_backup_enabled import (
                documentdb_cluster_backup_enabled,
            )

            check = documentdb_cluster_backup_enabled()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} has backup enabled with retention period 7 days."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN

    def test_documentdb_cluster_with_backup(self):
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
        documentdb_client.audit_config = {"minimum_backup_retention_period": 7}
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
            from prowler.providers.aws.services.documentdb.documentdb_cluster_backup_enabled.documentdb_cluster_backup_enabled import (
                documentdb_cluster_backup_enabled,
            )

            check = documentdb_cluster_backup_enabled()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} has backup enabled with retention period 9 days."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN

    def test_documentdb_cluster_with_backup_modified_retention(self):
        documentdb_client = mock.MagicMock
        documentdb_client.db_clusters = {
            DOC_DB_CLUSTER_ARN: DBCluster(
                id=DOC_DB_CLUSTER_NAME,
                arn=DOC_DB_CLUSTER_ARN,
                engine="docdb",
                status="available",
                backup_retention_period=2,
                encrypted=True,
                cloudwatch_logs=[],
                multi_az=True,
                parameter_group="default.docdb3.6",
                deletion_protection=True,
                region=AWS_REGION,
                tags=[],
            )
        }

        documentdb_client.audit_config = {"minimum_backup_retention_period": 1}
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
            from prowler.providers.aws.services.documentdb.documentdb_cluster_backup_enabled.documentdb_cluster_backup_enabled import (
                documentdb_cluster_backup_enabled,
            )

            check = documentdb_cluster_backup_enabled()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"DocumentDB Cluster {DOC_DB_CLUSTER_NAME} has backup enabled with retention period 2 days."
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == DOC_DB_CLUSTER_NAME
            assert result[0].resource_arn == DOC_DB_CLUSTER_ARN
```

--------------------------------------------------------------------------------

````
