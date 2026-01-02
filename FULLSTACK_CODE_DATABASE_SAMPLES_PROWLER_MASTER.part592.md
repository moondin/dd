---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 592
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 592 of 867)

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

---[FILE: neptune_cluster_backup_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_cluster_backup_enabled/neptune_cluster_backup_enabled_test.py

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

minimum_backup_retention_period = 2

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
class Test_neptune_cluster_backup_enabled:
    @mock_aws
    def test_neptune_no_instances(self):
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled import (
                    neptune_cluster_backup_enabled,
                )

                check = neptune_cluster_backup_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_neptune_cluster_without_backup(self):
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
                "prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled import (
                    neptune_cluster_backup_enabled,
                )

                check = neptune_cluster_backup_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 does not have backup enabled."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_neptune_cluster_with_backup_less_than_recommended(self):
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
            BackupRetentionPeriod=4,
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
                "prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled.neptune_client",
                new=Neptune(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled import (
                    neptune_cluster_backup_enabled,
                )

                service_client.clusters[db_cluster].iam_auth = True
                check = neptune_cluster_backup_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 has backup enabled with retention period 4 days. Recommended to increase the backup retention period to a minimum of 7 days."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_neptune_cluster_with_backup_equal_to_recommended(self):
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
            BackupRetentionPeriod=7,
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
                "prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled import (
                    neptune_cluster_backup_enabled,
                )

                check = neptune_cluster_backup_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 has backup enabled with retention period 7 days."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_neptune_cluster_with_backup(self):
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
            BackupRetentionPeriod=9,
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
                "prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled import (
                    neptune_cluster_backup_enabled,
                )

                check = neptune_cluster_backup_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 has backup enabled with retention period 9 days."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_neptune_cluster_with_backup_modified_retention(self):
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
            BackupRetentionPeriod=2,
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
                "prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled.neptune_client",
                new=Neptune(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_backup_enabled.neptune_cluster_backup_enabled import (
                    neptune_cluster_backup_enabled,
                )

                service_client.audit_config = {"minimum_backup_retention_period": 1}

                check = neptune_cluster_backup_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 has backup enabled with retention period 2 days."
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

---[FILE: neptune_cluster_copy_tags_to_snapshots_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_cluster_copy_tags_to_snapshots/neptune_cluster_copy_tags_to_snapshots_test.py

```python
from unittest import mock

from prowler.providers.aws.services.neptune.neptune_service import Cluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_neptune_cluster_copy_tags_to_snapshots:
    def test_neptune_no_clusters(self):
        neptune_client = mock.MagicMock
        neptune_client.clusters = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_service.Neptune",
                new=neptune_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_copy_tags_to_snapshots.neptune_cluster_copy_tags_to_snapshots.neptune_client",
                new=neptune_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.neptune.neptune_cluster_copy_tags_to_snapshots.neptune_cluster_copy_tags_to_snapshots import (
                neptune_cluster_copy_tags_to_snapshots,
            )

            check = neptune_cluster_copy_tags_to_snapshots()
            result = check.execute()

            assert len(result) == 0

    def test_neptune_cluster_copy_tags_disabled(self):
        neptune_client = mock.MagicMock
        cluster_arn = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
        neptune_client.clusters = {
            cluster_arn: Cluster(
                arn=cluster_arn,
                name="db-cluster-1",
                id="db-cluster-1",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                copy_tags_to_snapshot=False,
                backup_retention_period=7,
                encrypted=True,
                kms_key="arn:aws:kms:us-east-1:123456789012:key/abcd1234-a123-456a-a12b-a123b4cd56ef",
                multi_az=False,
                iam_auth=False,
                deletion_protection=False,
                db_subnet_group_id="subnet-1234abcd",
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_service.Neptune",
                new=neptune_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_copy_tags_to_snapshots.neptune_cluster_copy_tags_to_snapshots.neptune_client",
                new=neptune_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.neptune.neptune_cluster_copy_tags_to_snapshots.neptune_cluster_copy_tags_to_snapshots import (
                neptune_cluster_copy_tags_to_snapshots,
            )

            check = neptune_cluster_copy_tags_to_snapshots()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Neptune DB Cluster db-cluster-1 is not configured to copy tags to snapshots."
            )
            assert result[0].resource_id == "db-cluster-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []

    def test_neptune_cluster_copy_tags_enabled(self):
        neptune_client = mock.MagicMock
        cluster_arn = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-2"
        neptune_client.clusters = {
            cluster_arn: Cluster(
                arn=cluster_arn,
                name="db-cluster-2",
                id="db-cluster-2",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                copy_tags_to_snapshot=True,
                backup_retention_period=7,
                encrypted=True,
                kms_key="arn:aws:kms:us-east-1:123456789012:key/abcd1234-a123-456a-a12b-a123b4cd56ef",
                multi_az=False,
                iam_auth=False,
                deletion_protection=False,
                db_subnet_group_id="subnet-1234abcd",
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_service.Neptune",
                new=neptune_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_copy_tags_to_snapshots.neptune_cluster_copy_tags_to_snapshots.neptune_client",
                new=neptune_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.neptune.neptune_cluster_copy_tags_to_snapshots.neptune_cluster_copy_tags_to_snapshots import (
                neptune_cluster_copy_tags_to_snapshots,
            )

            check = neptune_cluster_copy_tags_to_snapshots()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Neptune DB Cluster db-cluster-2 is configured to copy tags to snapshots."
            )
            assert result[0].resource_id == "db-cluster-2"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: neptune_cluster_deletion_protection_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_cluster_deletion_protection/neptune_cluster_deletion_protection_test.py

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
class Test_neptune_cluster_deletion_protection:
    @mock_aws
    def test_neptune_no_instances(self):
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_deletion_protection.neptune_cluster_deletion_protection.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_deletion_protection.neptune_cluster_deletion_protection import (
                    neptune_cluster_deletion_protection,
                )

                check = neptune_cluster_deletion_protection()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_neptune_cluster_without_deletion_protection(self):
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
        )
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_deletion_protection.neptune_cluster_deletion_protection.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_deletion_protection.neptune_cluster_deletion_protection import (
                    neptune_cluster_deletion_protection,
                )

                check = neptune_cluster_deletion_protection()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 does not have deletion protection enabled."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_neptune_cluster_with_deletion_protection(self):
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
                "prowler.providers.aws.services.neptune.neptune_cluster_deletion_protection.neptune_cluster_deletion_protection.neptune_client",
                new=Neptune(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_deletion_protection.neptune_cluster_deletion_protection import (
                    neptune_cluster_deletion_protection,
                )

                service_client.clusters[db_cluster].deletion_protection = True
                check = neptune_cluster_deletion_protection()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 has deletion protection enabled."
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

---[FILE: neptune_cluster_iam_authentication_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_cluster_iam_authentication_enabled/neptune_cluster_iam_authentication_enabled_test.py

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
class Test_neptune_cluster_iam_authentication_enabled:
    @mock_aws
    def test_neptune_no_instances(self):
        from prowler.providers.aws.services.neptune.neptune_service import Neptune

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_iam_authentication_enabled.neptune_cluster_iam_authentication_enabled.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_iam_authentication_enabled.neptune_cluster_iam_authentication_enabled import (
                    neptune_cluster_iam_authentication_enabled,
                )

                check = neptune_cluster_iam_authentication_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_neptune_cluster_without_iam_auth(self):
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
                "prowler.providers.aws.services.neptune.neptune_cluster_iam_authentication_enabled.neptune_cluster_iam_authentication_enabled.neptune_client",
                new=Neptune(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_iam_authentication_enabled.neptune_cluster_iam_authentication_enabled import (
                    neptune_cluster_iam_authentication_enabled,
                )

                check = neptune_cluster_iam_authentication_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 does not have IAM authentication enabled."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_neptune_cluster_with_iam_auth(self):
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
                "prowler.providers.aws.services.neptune.neptune_cluster_iam_authentication_enabled.neptune_cluster_iam_authentication_enabled.neptune_client",
                new=Neptune(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.neptune.neptune_cluster_iam_authentication_enabled.neptune_cluster_iam_authentication_enabled import (
                    neptune_cluster_iam_authentication_enabled,
                )

                service_client.clusters[db_cluster].iam_auth = True
                check = neptune_cluster_iam_authentication_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Neptune Cluster db-cluster-1 has IAM authentication enabled."
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
