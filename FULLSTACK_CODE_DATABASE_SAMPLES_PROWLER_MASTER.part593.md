---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 593
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 593 of 867)

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

---[FILE: neptune_cluster_integration_cloudwatch_logs_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_cluster_integration_cloudwatch_logs/neptune_cluster_integration_cloudwatch_logs_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.neptune.neptune_service import Cluster
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_neptune_cluster_integration_cloudwatch_logs:
    @mock_aws
    def test_neptune_no_instances(self):
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_integration_cloudwatch_logs.neptune_cluster_integration_cloudwatch_logs.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_integration_cloudwatch_logs.neptune_cluster_integration_cloudwatch_logs import (
                    neptune_cluster_integration_cloudwatch_logs,
                )

                check = neptune_cluster_integration_cloudwatch_logs()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_neptune_cluster_without_integration_cloudwatch_logs(self):
        conn = client("neptune", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.neptune",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="neptune",
            DatabaseName="test-1",
            DeletionProtection=False,
            DBClusterParameterGroupName="test",
            MasterUsername="test",
            MasterUserPassword="password",
            EnableIAMDatabaseAuthentication=False,
            BackupRetentionPeriod=0,
            StorageEncrypted=False,
            Tags=[],
            EnableCloudwatchLogsExports=[],
        )
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_integration_cloudwatch_logs.neptune_cluster_integration_cloudwatch_logs.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_integration_cloudwatch_logs.neptune_cluster_integration_cloudwatch_logs import (
                    neptune_cluster_integration_cloudwatch_logs,
                )

                check = neptune_cluster_integration_cloudwatch_logs()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 does not have cloudwatch audit logs enabled."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_neptune_cluster_with_integration_cloudwatch_logs_not_audit(self):
        conn = client("neptune", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.neptune",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="neptune",
            DatabaseName="test-1",
            DeletionProtection=True,
            DBClusterParameterGroupName="test",
            MasterUsername="test",
            MasterUserPassword="password",
            BackupRetentionPeriod=0,
            StorageEncrypted=True,
            Tags=[],
            EnableCloudwatchLogsExports=["slowquery"],
        )
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_integration_cloudwatch_logs.neptune_cluster_integration_cloudwatch_logs.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_integration_cloudwatch_logs.neptune_cluster_integration_cloudwatch_logs import (
                    neptune_cluster_integration_cloudwatch_logs,
                )

                check = neptune_cluster_integration_cloudwatch_logs()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 does not have cloudwatch audit logs enabled."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    def test_neptune_cluster_with_integration_cloudwatch_logs_audit(self):
        neptune_client = mock.MagicMock
        cluster_arn = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
        neptune_client.clusters = {
            cluster_arn: Cluster(
                arn=cluster_arn,
                name="db-cluster-1",
                id="db-cluster-1",
                backup_retention_period=7,
                encrypted=True,
                kms_key="clave-kms",
                multi_az=False,
                iam_auth=True,
                deletion_protection=False,
                region="us-east-1",
                db_subnet_group_id="subnet-grupo-id",
                subnets=[
                    {
                        "SubnetIdentifier": "subnet-123",
                        "SubnetAvailabilityZone": {"Name": "us-east-1a"},
                        "SubnetStatus": "Active",
                    }
                ],
                tags=[],
                cloudwatch_logs=["audit"],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_service.Neptune",
                new=neptune_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_integration_cloudwatch_logs.neptune_cluster_integration_cloudwatch_logs.neptune_client",
                new=neptune_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.neptune.neptune_cluster_integration_cloudwatch_logs.neptune_cluster_integration_cloudwatch_logs import (
                neptune_cluster_integration_cloudwatch_logs,
            )

            check = neptune_cluster_integration_cloudwatch_logs()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Neptune Cluster db-cluster-1 has cloudwatch audit logs enabled."
            )
            assert result[0].resource_id == "db-cluster-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_multi_az_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_cluster_multi_az/neptune_cluster_multi_az_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeDBEngineVersions":
        return {
            "DBEngineVersions": [
                {
                    "Engine": "mysql",
                    "EngineVersion": "8.0.32",
                    "DBEngineDescription": "description",
                    "DBEngineVersionDescription": "description",
                },
            ]
        }

    return make_api_call(self, operation_name, kwarg)


@mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_neptune_cluster_multi_az:
    @mock_aws
    def test_neptune_no_instances(self):
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_multi_az.neptune_cluster_multi_az.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_multi_az.neptune_cluster_multi_az import (
                    neptune_cluster_multi_az,
                )

                check = neptune_cluster_multi_az()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_neptune_cluster_without_multi_az(self):
        conn = client("neptune", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.neptune",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="neptune",
            DatabaseName="test-1",
            DeletionProtection=True,
            DBClusterParameterGroupName="test",
            MasterUsername="test",
            MasterUserPassword="password",
            EnableIAMDatabaseAuthentication=False,
            BackupRetentionPeriod=0,
            StorageEncrypted=True,
            Tags=[],
        )
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_multi_az.neptune_cluster_multi_az.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_multi_az.neptune_cluster_multi_az import (
                    neptune_cluster_multi_az,
                )

                check = neptune_cluster_multi_az()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 does not have Multi-AZ enabled."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_neptune_cluster_with_multi_az(self):
        conn = client("neptune", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.neptune",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="neptune",
            DatabaseName="test-1",
            DeletionProtection=True,
            DBClusterParameterGroupName="test",
            MasterUsername="test",
            MasterUserPassword="password",
            BackupRetentionPeriod=0,
            StorageEncrypted=True,
            Tags=[],
        )
        db_cluster = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_multi_az.neptune_cluster_multi_az.neptune_client",
                new=Neptune(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_multi_az.neptune_cluster_multi_az import (
                    neptune_cluster_multi_az,
                )

                service_client.clusters[db_cluster].multi_az = True
                check = neptune_cluster_multi_az()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 has Multi-AZ enabled."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_public_snapshot_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_cluster_public_snapshot/neptune_cluster_public_snapshot_fixer_test.py

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


class Test_neptune_cluster_public_snapshot_fixer:
    @mock_aws
    def test_neptune_cluster_public_snapshot_fixer(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_public_snapshot,
        ):
            from prowler.providers.aws.services.neptune.neptune_service import Neptune

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.neptune.neptune_cluster_public_snapshot.neptune_cluster_public_snapshot_fixer.neptune_client",
                    new=Neptune(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.neptune.neptune_cluster_public_snapshot.neptune_cluster_public_snapshot_fixer import (
                    fixer,
                )

                assert fixer(resource_id="test-snapshot", region=AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_neptune_cluster_public_snapshot_fixer_error(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_public_snapshot_error,
        ):
            from prowler.providers.aws.services.neptune.neptune_service import Neptune

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.neptune.neptune_cluster_public_snapshot.neptune_cluster_public_snapshot_fixer.neptune_client",
                    new=Neptune(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.neptune.neptune_cluster_public_snapshot.neptune_cluster_public_snapshot_fixer import (
                    fixer,
                )

                assert not fixer(
                    resource_id="test-snapshot", region=AWS_REGION_EU_WEST_1
                )
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_public_snapshot_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_cluster_public_snapshot/neptune_cluster_public_snapshot_test.py

```python
from unittest import mock

from prowler.providers.aws.services.neptune.neptune_service import (
    Cluster,
    ClusterSnapshot,
)

AWS_ACCOUNT_NUMBER = "123456789012"
AWS_REGION_US_EAST_1 = "us-east-1"

NEPTUNE_CLUSTER_NAME = "test-cluster"
NEPTUNE_CLUSTER_ARN = f"arn:aws:neptune:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{NEPTUNE_CLUSTER_NAME}"


class Test_neptune_cluster_public_snapshot:
    def test_neptune_no_snapshot(self):
        neptune_client = mock.MagicMock
        neptune_client.clusters = {}
        neptune_client.db_cluster_snapshots = []

        with (
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_service.Neptune",
                new=neptune_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_public_snapshot.neptune_cluster_public_snapshot.neptune_client",
                new=neptune_client,
            ),
        ):
            from prowler.providers.aws.services.neptune.neptune_cluster_public_snapshot.neptune_cluster_public_snapshot import (
                neptune_cluster_public_snapshot,
            )

            check = neptune_cluster_public_snapshot()
            result = check.execute()
            assert len(result) == 0

    def test_neptune_cluster_private_snapshot(self):
        neptune_client = mock.MagicMock
        neptune_client.clusters = {
            NEPTUNE_CLUSTER_ARN: Cluster(
                name=NEPTUNE_CLUSTER_NAME,
                arn=NEPTUNE_CLUSTER_ARN,
                id="test-cluster-id",
                backup_retention_period=7,
                encrypted=True,
                kms_key="kms-key-id",
                multi_az=False,
                iam_auth=False,
                deletion_protection=False,
                db_subnet_group_id="subnet-group",
                region=AWS_REGION_US_EAST_1,
            )
        }
        neptune_client.db_cluster_snapshots = [
            ClusterSnapshot(
                id="snapshot-1",
                arn=f"arn:aws:neptune:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1",
                cluster_id=NEPTUNE_CLUSTER_NAME,
                encrypted=False,
                region=AWS_REGION_US_EAST_1,
                tags=[],
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_service.Neptune",
                new=neptune_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_public_snapshot.neptune_cluster_public_snapshot.neptune_client",
                new=neptune_client,
            ),
        ):
            from prowler.providers.aws.services.neptune.neptune_cluster_public_snapshot.neptune_cluster_public_snapshot import (
                neptune_cluster_public_snapshot,
            )

            check = neptune_cluster_public_snapshot()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "NeptuneDB Cluster Snapshot snapshot-1 is not shared publicly."
            )
            assert result[0].resource_id == "snapshot-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:neptune:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1"
            )
            assert result[0].resource_tags == []

    def test_neptune_cluster_public_snapshot(self):
        neptune_client = mock.MagicMock
        neptune_client.clusters = {
            NEPTUNE_CLUSTER_ARN: Cluster(
                name=NEPTUNE_CLUSTER_NAME,
                arn=NEPTUNE_CLUSTER_ARN,
                id="test-cluster-id",
                backup_retention_period=7,
                encrypted=True,
                kms_key="kms-key-id",
                multi_az=False,
                iam_auth=False,
                deletion_protection=False,
                db_subnet_group_id="subnet-group",
                region=AWS_REGION_US_EAST_1,
            )
        }
        neptune_client.db_cluster_snapshots = [
            ClusterSnapshot(
                id="snapshot-1",
                arn=f"arn:aws:neptune:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1",
                cluster_id=NEPTUNE_CLUSTER_NAME,
                encrypted=False,
                region=AWS_REGION_US_EAST_1,
                tags=[],
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_service.Neptune",
                new=neptune_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_public_snapshot.neptune_cluster_public_snapshot.neptune_client",
                new=neptune_client,
            ),
        ):
            from prowler.providers.aws.services.neptune.neptune_cluster_public_snapshot.neptune_cluster_public_snapshot import (
                neptune_cluster_public_snapshot,
            )

            neptune_client.db_cluster_snapshots[0].public = True
            check = neptune_cluster_public_snapshot()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "NeptuneDB Cluster Snapshot snapshot-1 is public."
            )
            assert result[0].resource_id == "snapshot-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:neptune:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_snapshot_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_cluster_snapshot_encrypted/neptune_cluster_snapshot_encrypted_test.py

```python
from unittest import mock

from prowler.providers.aws.services.neptune.neptune_service import ClusterSnapshot
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_neptune_cluster_snapshot_encrypted:
    def test_neptune_no_snapshots(self):
        neptune_client = mock.MagicMock()
        neptune_client.db_cluster_snapshots = []

        with (
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_service.Neptune",
                new=neptune_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_snapshot_encrypted.neptune_cluster_snapshot_encrypted.neptune_client",
                new=neptune_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.neptune.neptune_cluster_snapshot_encrypted.neptune_cluster_snapshot_encrypted import (
                neptune_cluster_snapshot_encrypted,
            )

            check = neptune_cluster_snapshot_encrypted()
            result = check.execute()

            assert len(result) == 0

    def test_neptune_snapshot_not_encrypted(self):
        neptune_client = mock.MagicMock
        snapshot_arn = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1"
        neptune_client.db_cluster_snapshots = [
            ClusterSnapshot(
                arn=snapshot_arn,
                id="snapshot-1",
                cluster_id="cluster-1",
                region=AWS_REGION_US_EAST_1,
                encrypted=False,
                tags=[],
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_service.Neptune",
                new=neptune_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_snapshot_encrypted.neptune_cluster_snapshot_encrypted.neptune_client",
                new=neptune_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.neptune.neptune_cluster_snapshot_encrypted.neptune_cluster_snapshot_encrypted import (
                neptune_cluster_snapshot_encrypted,
            )

            check = neptune_cluster_snapshot_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Neptune Cluster Snapshot snapshot-1 is not encrypted at rest."
            )
            assert result[0].resource_id == "snapshot-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == snapshot_arn
            assert result[0].resource_tags == []

    def test_neptune_snapshot_encrypted(self):
        neptune_client = mock.MagicMock
        snapshot_arn = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1"
        neptune_client.db_cluster_snapshots = [
            ClusterSnapshot(
                arn=snapshot_arn,
                id="snapshot-1",
                cluster_id="cluster-1",
                region=AWS_REGION_US_EAST_1,
                encrypted=True,
                tags=[],
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_service.Neptune",
                new=neptune_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_snapshot_encrypted.neptune_cluster_snapshot_encrypted.neptune_client",
                new=neptune_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.neptune.neptune_cluster_snapshot_encrypted.neptune_cluster_snapshot_encrypted import (
                neptune_cluster_snapshot_encrypted,
            )

            check = neptune_cluster_snapshot_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Neptune Cluster Snapshot snapshot-1 is encrypted at rest."
            )
            assert result[0].resource_id == "snapshot-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == snapshot_arn
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_storage_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_cluster_storage_encrypted/neptune_cluster_storage_encrypted_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeDBEngineVersions":
        return {
            "DBEngineVersions": [
                {
                    "Engine": "mysql",
                    "EngineVersion": "8.0.32",
                    "DBEngineDescription": "description",
                    "DBEngineVersionDescription": "description",
                },
            ]
        }

    return make_api_call(self, operation_name, kwarg)


@mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_neptune_cluster_storage_encrypted:
    @mock_aws
    def test_neptune_no_instances(self):
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_storage_encrypted.neptune_cluster_storage_encrypted.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_storage_encrypted.neptune_cluster_storage_encrypted import (
                    neptune_cluster_storage_encrypted,
                )

                check = neptune_cluster_storage_encrypted()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_neptune_cluster_without_storage_encrypted(self):
        conn = client("neptune", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.neptune",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="neptune",
            DatabaseName="test-1",
            DeletionProtection=True,
            DBClusterParameterGroupName="test",
            MasterUsername="test",
            MasterUserPassword="password",
            EnableIAMDatabaseAuthentication=False,
            BackupRetentionPeriod=0,
            StorageEncrypted=False,
            Tags=[],
        )
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_storage_encrypted.neptune_cluster_storage_encrypted.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_storage_encrypted.neptune_cluster_storage_encrypted import (
                    neptune_cluster_storage_encrypted,
                )

                check = neptune_cluster_storage_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 is not encrypted at rest."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_neptune_cluster_with_storage_encrypted(self):
        conn = client("neptune", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.neptune",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="neptune",
            DatabaseName="test-1",
            DeletionProtection=True,
            DBClusterParameterGroupName="test",
            MasterUsername="test",
            MasterUserPassword="password",
            BackupRetentionPeriod=0,
            StorageEncrypted=True,
            Tags=[],
        )
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_storage_encrypted.neptune_cluster_storage_encrypted.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_storage_encrypted.neptune_cluster_storage_encrypted import (
                    neptune_cluster_storage_encrypted,
                )

                check = neptune_cluster_storage_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 is encrypted at rest."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
