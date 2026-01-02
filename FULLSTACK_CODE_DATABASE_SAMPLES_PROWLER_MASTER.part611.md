---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 611
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 611 of 867)

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

---[FILE: rds_instance_transport_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_instance_transport_encrypted/rds_instance_transport_encrypted_test.py

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
cluster_arn = (
    f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
)


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeDBEngineVersions":
        return {
            "DBEngineVersions": [
                {
                    "Engine": "postgresres",
                    "EngineVersion": "8.0.32",
                    "DBEngineDescription": "description",
                    "DBEngineVersionDescription": "description",
                },
            ]
        }
    return make_api_call(self, operation_name, kwarg)


@mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_rds_instance_transport_encrypted:
    @mock_aws
    def test_rds_no_instances(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted import (
                    rds_instance_transport_encrypted,
                )

                check = rds_instance_transport_encrypted()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_postgres_instance(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres13",
            Description="test parameter group",
        )
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="postgres",
            DBInstanceClass="db.m1.small",
            DBParameterGroupName="test",
            PubliclyAccessible=False,
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted import (
                    rds_instance_transport_encrypted,
                )

                check = rds_instance_transport_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 connections are not encrypted."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_clustered_instance(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            AllocatedStorage=10,
            Engine="postgres",
            DatabaseName="staging-postgres",
            DeletionProtection=True,
            DBClusterParameterGroupName="test",
            MasterUsername="test",
            MasterUserPassword="password",
            Tags=[],
        )
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="postgres",
            DBInstanceClass="db.m1.small",
            DBParameterGroupName="test",
            DBClusterIdentifier="db-cluster-1",
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted import (
                    rds_instance_transport_encrypted,
                )

                check = rds_instance_transport_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 connections are not encrypted."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_arn == cluster_arn
                assert result[0].resource_tags == []

    @mock_aws
    def test_postgres_rds_instance_no_ssl(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres9.3",
            Description="test parameter group",
        )
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            DBParameterGroupName="test",
        )

        conn.modify_db_parameter_group(
            DBParameterGroupName="test",
            Parameters=[
                {
                    "ParameterName": "rds.force_ssl",
                    "ParameterValue": "0",
                    "ApplyMethod": "immediate",
                },
            ],
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted import (
                    rds_instance_transport_encrypted,
                )

                check = rds_instance_transport_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 connections are not encrypted."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_postgresres_rds_instance_no_ssl(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgresres8.0",
            Description="test parameter group",
        )
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgresres",
            DBInstanceClass="db.m1.small",
            DBParameterGroupName="test",
        )

        conn.modify_db_parameter_group(
            DBParameterGroupName="test",
            Parameters=[
                {
                    "ParameterName": "require_secure_transport",
                    "ParameterValue": "0",
                    "ApplyMethod": "immediate",
                },
            ],
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted import (
                    rds_instance_transport_encrypted,
                )

                check = rds_instance_transport_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 connections are not encrypted."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_postgres_rds_instance_with_ssl(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            DBParameterGroupName="test",
        )

        conn.modify_db_parameter_group(
            DBParameterGroupName="test",
            Parameters=[
                {
                    "ParameterName": "rds.force_ssl",
                    "ParameterValue": "1",
                    "ApplyMethod": "immediate",
                },
            ],
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted import (
                    rds_instance_transport_encrypted,
                )

                check = rds_instance_transport_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 connections use SSL encryption."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_postgres_clustered_instance_ssl(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            AllocatedStorage=10,
            Engine="postgres",
            DatabaseName="staging-postgres",
            DeletionProtection=True,
            DBClusterParameterGroupName="test",
            MasterUsername="test",
            MasterUserPassword="password",
            Tags=[],
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted.rds_client",
                new=RDS(aws_provider),
            ) as rds_client:
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_transport_encrypted.rds_instance_transport_encrypted import (
                    rds_instance_transport_encrypted,
                )

                # Change DB Cluster parameter group to support SSL since Moto does not support it
                rds_client.db_clusters[cluster_arn].require_secure_transport = "ON"
                check = rds_instance_transport_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 connections use SSL encryption."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_arn == cluster_arn
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: rds_snapshots_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_snapshots_encrypted/rds_snapshots_encrypted_test.py

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
                    "Engine": "postgres",
                    "EngineVersion": "8.0.32",
                    "DBEngineDescription": "description",
                    "DBEngineVersionDescription": "description",
                },
            ]
        }
    return make_api_call(self, operation_name, kwarg)


class Test_rds_snapshots_encrypted:
    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_rds_no_snapshots(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_encrypted.rds_snapshots_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_snapshots_encrypted.rds_snapshots_encrypted import (
                    rds_snapshots_encrypted,
                )

                check = rds_snapshots_encrypted()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_rds_snapshot_not_encrypted(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            PubliclyAccessible=False,
        )

        conn.create_db_snapshot(
            DBInstanceIdentifier="db-primary-1", DBSnapshotIdentifier="snapshot-1"
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_encrypted.rds_snapshots_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_snapshots_encrypted.rds_snapshots_encrypted import (
                    rds_snapshots_encrypted,
                )

                check = rds_snapshots_encrypted()
                result = check.execute()

                # Moto creates additional automatic snapshots
                assert len(result) == 2
                # Find the manual snapshot result
                manual_snapshot_result = next(
                    (r for r in result if r.resource_id == "snapshot-1"), None
                )
                assert manual_snapshot_result is not None
                assert manual_snapshot_result.status == "FAIL"
                assert (
                    manual_snapshot_result.status_extended
                    == "RDS Instance Snapshot snapshot-1 is not encrypted."
                )

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_rds_snapshot_encrypted(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            PubliclyAccessible=False,
        )

        conn.create_db_snapshot(
            DBInstanceIdentifier="db-primary-1", DBSnapshotIdentifier="snapshot-1"
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_encrypted.rds_snapshots_encrypted.rds_client",
                new=RDS(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.rds.rds_snapshots_encrypted.rds_snapshots_encrypted import (
                    rds_snapshots_encrypted,
                )

                # Find the manual snapshot and set it to encrypted
                manual_snapshot = next(
                    (s for s in service_client.db_snapshots if s.id == "snapshot-1"),
                    None,
                )
                if manual_snapshot:
                    manual_snapshot.encrypted = True
                check = rds_snapshots_encrypted()
                result = check.execute()

                assert len(result) == 2
                # Find the manual snapshot result
                manual_snapshot_result = next(
                    (r for r in result if r.resource_id == "snapshot-1"), None
                )
                assert manual_snapshot_result is not None
                assert manual_snapshot_result.status == "PASS"
                assert (
                    manual_snapshot_result.status_extended
                    == "RDS Instance Snapshot snapshot-1 is encrypted."
                )
                assert manual_snapshot_result.resource_id == "snapshot-1"
                assert manual_snapshot_result.region == AWS_REGION_US_EAST_1
                assert (
                    manual_snapshot_result.resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:snapshot:snapshot-1"
                )
                assert manual_snapshot_result.resource_tags == []

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_rds_cluster_snapshot_encrypted(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBClusterInstanceClass="db.m1.small",
            MasterUsername="root",
            MasterUserPassword="hunter2000",
            PubliclyAccessible=False,
        )

        conn.create_db_cluster_snapshot(
            DBClusterIdentifier="db-primary-1", DBClusterSnapshotIdentifier="snapshot-1"
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_encrypted.rds_snapshots_encrypted.rds_client",
                new=RDS(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.rds.rds_snapshots_encrypted.rds_snapshots_encrypted import (
                    rds_snapshots_encrypted,
                )

                # Find the manual cluster snapshot and set it to encrypted
                manual_snapshot = next(
                    (
                        s
                        for s in service_client.db_cluster_snapshots
                        if s.id == "snapshot-1"
                    ),
                    None,
                )
                if manual_snapshot:
                    manual_snapshot.encrypted = True
                check = rds_snapshots_encrypted()
                result = check.execute()

                assert len(result) == 2
                # Find the manual snapshot result
                manual_snapshot_result = next(
                    (r for r in result if r.resource_id == "snapshot-1"), None
                )
                assert manual_snapshot_result is not None
                assert manual_snapshot_result.status == "PASS"
                assert (
                    manual_snapshot_result.status_extended
                    == "RDS Cluster Snapshot snapshot-1 is encrypted."
                )
                assert manual_snapshot_result.resource_id == "snapshot-1"
                assert manual_snapshot_result.region == AWS_REGION_US_EAST_1
                assert (
                    manual_snapshot_result.resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1"
                )
                assert manual_snapshot_result.resource_tags == []

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_rds_cluster_snapshot_not_encrypted(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBClusterInstanceClass="db.m1.small",
            MasterUsername="root",
            MasterUserPassword="hunter2000",
            PubliclyAccessible=False,
        )

        conn.create_db_cluster_snapshot(
            DBClusterIdentifier="db-primary-1", DBClusterSnapshotIdentifier="snapshot-1"
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_encrypted.rds_snapshots_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_snapshots_encrypted.rds_snapshots_encrypted import (
                    rds_snapshots_encrypted,
                )

                check = rds_snapshots_encrypted()
                result = check.execute()

                assert len(result) == 2
                # Find the manual snapshot result
                manual_snapshot_result = next(
                    (r for r in result if r.resource_id == "snapshot-1"), None
                )
                assert manual_snapshot_result is not None
                assert manual_snapshot_result.status == "FAIL"
                assert (
                    manual_snapshot_result.status_extended
                    == "RDS Cluster Snapshot snapshot-1 is not encrypted."
                )
                assert manual_snapshot_result.resource_id == "snapshot-1"
                assert manual_snapshot_result.region == AWS_REGION_US_EAST_1
                assert (
                    manual_snapshot_result.resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1"
                )
                assert manual_snapshot_result.resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: rds_snapshots_public_access_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_snapshots_public_access/rds_snapshots_public_access_fixer_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_rds_snapshots_public_access_fixer:
    @mock_aws
    def test_rds_private_snapshot(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
        )

        conn.create_db_snapshot(
            DBInstanceIdentifier="db-primary-1", DBSnapshotIdentifier="snapshot-1"
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access_fixer.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Fixer
                from prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access_fixer import (
                    fixer,
                )

                assert fixer("snapshot-1", AWS_REGION_US_EAST_1)

    @mock_aws
    def test_rds_public_snapshot(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
        )

        conn.create_db_snapshot(
            DBInstanceIdentifier="db-primary-1", DBSnapshotIdentifier="snapshot-1"
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access_fixer.rds_client",
                new=RDS(aws_provider),
            ) as service_client:

                service_client.db_snapshots[0].public = True

                # Test Fixer
                from prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access_fixer import (
                    fixer,
                )

                assert fixer("snapshot-1", AWS_REGION_US_EAST_1)

    @mock_aws
    def test_rds_cluster_private_snapshot(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBClusterInstanceClass="db.m1.small",
            MasterUsername="root",
            MasterUserPassword="hunter2000",
        )

        conn.create_db_cluster_snapshot(
            DBClusterIdentifier="db-primary-1", DBClusterSnapshotIdentifier="snapshot-1"
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access_fixer.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Fixer
                from prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access_fixer import (
                    fixer,
                )

                assert fixer("snapshot-1", AWS_REGION_US_EAST_1)

    @mock_aws
    def test_rds_cluster_public_snapshot(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBClusterInstanceClass="db.m1.small",
            MasterUsername="root",
            MasterUserPassword="hunter2000",
        )

        conn.create_db_cluster_snapshot(
            DBClusterIdentifier="db-primary-1", DBClusterSnapshotIdentifier="snapshot-1"
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access_fixer.rds_client",
                new=RDS(aws_provider),
            ) as service_client:

                service_client.db_cluster_snapshots[0].public = True

                # Test Fixer
                from prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access_fixer import (
                    fixer,
                )

                assert fixer("snapshot-1", AWS_REGION_US_EAST_1)

    @mock_aws
    def test_rds_cluster_public_snapshot_error(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBClusterInstanceClass="db.m1.small",
            MasterUsername="root",
            MasterUserPassword="hunter2000",
        )

        conn.create_db_cluster_snapshot(
            DBClusterIdentifier="db-primary-1", DBClusterSnapshotIdentifier="snapshot-1"
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access_fixer.rds_client",
                new=RDS(aws_provider),
            ) as service_client:

                service_client.db_cluster_snapshots[0].public = True

                # Test Fixer
                from prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access_fixer import (
                    fixer,
                )

                assert not fixer("snapshot-2", AWS_REGION_US_EAST_1)
```

--------------------------------------------------------------------------------

````
