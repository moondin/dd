---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 603
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 603 of 867)

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

---[FILE: rds_cluster_minor_version_upgrade_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_cluster_minor_version_upgrade_enabled/rds_cluster_minor_version_upgrade_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.rds.rds_service import DBCluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_rds_cluster_minor_version_upgrade_enabled:
    def test_rds_no_clusters(self):
        rds_client = mock.MagicMock
        rds_client.db_clusters = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.rds.rds_service.RDS",
                new=rds_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_minor_version_upgrade_enabled.rds_cluster_minor_version_upgrade_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.aws.services.rds.rds_cluster_minor_version_upgrade_enabled.rds_cluster_minor_version_upgrade_enabled import (
                rds_cluster_minor_version_upgrade_enabled,
            )

            check = rds_cluster_minor_version_upgrade_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_rds_cluster_no_multi(self):
        rds_client = mock.MagicMock
        rds_client.db_clusters = {
            "db-cluster-1": DBCluster(
                id="db-cluster-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1",
                endpoint="",
                engine="postgres",
                status="available",
                public=False,
                encrypted=True,
                auto_minor_version_upgrade=False,
                backup_retention_period=7,
                backtrack=0,
                cloudwatch_logs=[],
                deletion_protection=False,
                parameter_group="default.postgres10",
                multi_az=False,
                username="admin",
                iam_auth=False,
                region=AWS_REGION_US_EAST_1,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.rds.rds_service.RDS",
                new=rds_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_minor_version_upgrade_enabled.rds_cluster_minor_version_upgrade_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.aws.services.rds.rds_cluster_minor_version_upgrade_enabled.rds_cluster_minor_version_upgrade_enabled import (
                rds_cluster_minor_version_upgrade_enabled,
            )

            check = rds_cluster_minor_version_upgrade_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_rds_cluster_no_auto_upgrade(self):
        rds_client = mock.MagicMock
        rds_client.db_clusters = {
            "db-cluster-1": DBCluster(
                id="db-cluster-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1",
                endpoint="",
                engine="postgres",
                status="available",
                public=False,
                encrypted=True,
                auto_minor_version_upgrade=False,
                backup_retention_period=7,
                backtrack=0,
                cloudwatch_logs=[],
                deletion_protection=False,
                parameter_group="default.postgres10",
                multi_az=True,
                username="admin",
                iam_auth=False,
                region=AWS_REGION_US_EAST_1,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.rds.rds_service.RDS",
                new=rds_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_minor_version_upgrade_enabled.rds_cluster_minor_version_upgrade_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.aws.services.rds.rds_cluster_minor_version_upgrade_enabled.rds_cluster_minor_version_upgrade_enabled import (
                rds_cluster_minor_version_upgrade_enabled,
            )

            check = rds_cluster_minor_version_upgrade_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "RDS Cluster db-cluster-1 does not have minor version upgrade enabled."
            )
            assert result[0].resource_id == "db-cluster-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
            )
            assert result[0].resource_tags == []

    def test_rds_cluster_with_auto_upgrade(self):
        rds_client = mock.MagicMock
        rds_client.db_clusters = {
            "db-cluster-1": DBCluster(
                id="db-cluster-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1",
                endpoint="",
                engine="postgres",
                status="available",
                public=False,
                encrypted=True,
                auto_minor_version_upgrade=True,
                backup_retention_period=7,
                backtrack=0,
                cloudwatch_logs=[],
                deletion_protection=False,
                parameter_group="default.postgres10",
                multi_az=True,
                username="admin",
                iam_auth=False,
                region=AWS_REGION_US_EAST_1,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.rds.rds_service.RDS",
                new=rds_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_minor_version_upgrade_enabled.rds_cluster_minor_version_upgrade_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.aws.services.rds.rds_cluster_minor_version_upgrade_enabled.rds_cluster_minor_version_upgrade_enabled import (
                rds_cluster_minor_version_upgrade_enabled,
            )

            check = rds_cluster_minor_version_upgrade_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "RDS Cluster db-cluster-1 has minor version upgrade enabled."
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

---[FILE: rds_cluster_multi_az_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_cluster_multi_az/rds_cluster_multi_az_test.py

```python
from unittest import mock

from prowler.providers.aws.services.rds.rds_service import DBCluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_rds_cluster_multi_az:
    def test_rds_no_clusters(self):
        rds_client = mock.MagicMock
        rds_client.db_clusters = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                new=rds_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_multi_az.rds_cluster_multi_az.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.aws.services.rds.rds_cluster_multi_az.rds_cluster_multi_az import (
                rds_cluster_multi_az,
            )

            check = rds_cluster_multi_az()
            result = check.execute()

            assert len(result) == 0

    def test_rds_cluster_no_multi_az(self):
        rds_client = mock.MagicMock
        cluster_arn = (
            f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
        )
        rds_client.db_clusters = {
            cluster_arn: DBCluster(
                id="db-cluster-1",
                arn=cluster_arn,
                endpoint="",
                engine="postgres",
                status="available",
                public=False,
                encrypted=False,
                auto_minor_version_upgrade=False,
                backup_retention_period=0,
                cloudwatch_logs=[],
                deletion_protection=False,
                parameter_group="",
                multi_az=False,
                username="test",
                iam_auth=False,
                backtrack=0,
                region=AWS_REGION_US_EAST_1,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                new=rds_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_multi_az.rds_cluster_multi_az.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.aws.services.rds.rds_cluster_multi_az.rds_cluster_multi_az import (
                rds_cluster_multi_az,
            )

            check = rds_cluster_multi_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "RDS Cluster db-cluster-1 does not have multi-AZ enabled."
            )
            assert result[0].resource_id == "db-cluster-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
            )
            assert result[0].resource_tags == []

    def test_rds_cluster_multi_az(self):
        rds_client = mock.MagicMock
        cluster_arn = (
            f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
        )
        rds_client.db_clusters = {
            cluster_arn: DBCluster(
                id="db-cluster-1",
                arn=cluster_arn,
                endpoint="",
                engine="postgres",
                status="available",
                public=False,
                encrypted=False,
                auto_minor_version_upgrade=False,
                backup_retention_period=0,
                cloudwatch_logs=[],
                deletion_protection=False,
                parameter_group="",
                multi_az=True,
                username="test",
                iam_auth=False,
                backtrack=0,
                region=AWS_REGION_US_EAST_1,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                new=rds_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_multi_az.rds_cluster_multi_az.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.aws.services.rds.rds_cluster_multi_az.rds_cluster_multi_az import (
                rds_cluster_multi_az,
            )

            check = rds_cluster_multi_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "RDS Cluster db-cluster-1 has multi-AZ enabled."
            )
            assert result[0].resource_id == "db-cluster-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_non_default_port_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_cluster_non_default_port/rds_cluster_non_default_port_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_rds_cluster_non_default_port:
    @mock_aws
    def test_rds_no_clusters(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_non_default_port.rds_cluster_non_default_port.rds_client",
                new=RDS(aws_provider),
            ):
                from prowler.providers.aws.services.rds.rds_cluster_non_default_port.rds_cluster_non_default_port import (
                    rds_cluster_non_default_port,
                )

                check = rds_cluster_non_default_port()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_cluster_postgres_using_default_port(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            StorageEncrypted=True,
            DeletionProtection=True,
            MasterUsername="cluster",
            MasterUserPassword="password",
            Port=5432,
            Tags=[{"Key": "test", "Value": "test"}],
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_non_default_port.rds_cluster_non_default_port.rds_client",
                new=RDS(aws_provider),
            ):
                from prowler.providers.aws.services.rds.rds_cluster_non_default_port.rds_cluster_non_default_port import (
                    rds_cluster_non_default_port,
                )

                check = rds_cluster_non_default_port()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 is using the default port 5432 for postgres."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]

    @mock_aws
    def test_rds_cluster_postgres_using_non_default_port(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-2",
            Engine="postgres",
            StorageEncrypted=True,
            DeletionProtection=True,
            MasterUsername="cluster",
            MasterUserPassword="password",
            Port=5433,
            Tags=[{"Key": "env", "Value": "production"}],
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_non_default_port.rds_cluster_non_default_port.rds_client",
                new=RDS(aws_provider),
            ):
                from prowler.providers.aws.services.rds.rds_cluster_non_default_port.rds_cluster_non_default_port import (
                    rds_cluster_non_default_port,
                )

                check = rds_cluster_non_default_port()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-2 is not using the default port 5433 for postgres."
                )
                assert result[0].resource_id == "db-cluster-2"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-2"
                )
                assert result[0].resource_tags == [
                    {"Key": "env", "Value": "production"}
                ]
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_protected_by_backup_plan_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_cluster_protected_by_backup_plan/rds_cluster_protected_by_backup_plan_test.py

```python
from unittest import mock

from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_rds_cluster_protected_by_backup_plan:
    @mock_aws
    def test_rds_no_clusters(self):
        from prowler.providers.aws.services.backup.backup_service import Backup
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.rds_client",
                    new=RDS(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.backup_client",
                    new=Backup(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan import (
                    rds_cluster_protected_by_backup_plan,
                )

                check = rds_cluster_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_cluster_no_existing_backup_plans(self):
        cluster = mock.MagicMock()
        backup = mock.MagicMock()

        from prowler.providers.aws.services.rds.rds_service import DBCluster

        arn = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
        cluster.db_clusters = {
            arn: DBCluster(
                id="db-cluster-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1",
                endpoint="db-cluster-1.c9akciq32.rds.amazonaws.com",
                backtrack=1,
                parameter_group="test",
                engine_version="13.3",
                status="available",
                public=False,
                encrypted=True,
                deletion_protection=False,
                auto_minor_version_upgrade=True,
                multi_az=False,
                username="admin",
                iam_auth=False,
                name="db-cluster-1",
                region="us-east-1",
                cluster_class="db.m1.small",
                engine="postgres",
                allocated_storage=10,
                tags=[],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.rds_client",
                    new=cluster,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_client.rds_client",
                    new=cluster,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan import (
                    rds_cluster_protected_by_backup_plan,
                )

                check = rds_cluster_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 is not protected by a backup plan."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
                )
                assert result[0].resource_tags == []

    def test_rds_cluster_without_backup_plan(self):
        cluster = mock.MagicMock()
        backup = mock.MagicMock()

        from prowler.providers.aws.services.rds.rds_service import DBCluster

        arn = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
        cluster.db_clusters = {
            arn: DBCluster(
                id="db-cluster-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1",
                endpoint="db-cluster-1.c9akciq32.rds.amazonaws.com",
                backtrack=1,
                parameter_group="test",
                engine_version="13.3",
                status="available",
                public=False,
                encrypted=True,
                deletion_protection=False,
                auto_minor_version_upgrade=True,
                multi_az=False,
                username="admin",
                iam_auth=False,
                name="db-cluster-1",
                region="us-east-1",
                cluster_class="db.m1.small",
                engine="postgres",
                allocated_storage=10,
                tags=[],
            )
        }

        backup.protected_resources = [
            f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-2"
        ]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.rds_client",
                    new=cluster,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_client.rds_client",
                    new=cluster,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan import (
                    rds_cluster_protected_by_backup_plan,
                )

                check = rds_cluster_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 is not protected by a backup plan."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
                )
                assert result[0].resource_tags == []

    def test_rds_cluster_with_backup_plan(self):
        cluster = mock.MagicMock()

        from prowler.providers.aws.services.rds.rds_service import DBCluster

        arn = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
        cluster.db_clusters = {
            arn: DBCluster(
                id="db-cluster-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1",
                endpoint="db-cluster-1.c9akciq32.rds.amazonaws.com",
                backtrack=1,
                parameter_group="test",
                engine_version="13.3",
                status="available",
                public=False,
                encrypted=True,
                deletion_protection=False,
                auto_minor_version_upgrade=True,
                multi_az=False,
                username="admin",
                iam_auth=False,
                name="db-cluster-1",
                region="us-east-1",
                cluster_class="db.m1.small",
                engine="postgres",
                allocated_storage=10,
                tags=[],
            )
        }

        backup = mock.MagicMock()
        backup.protected_resources = [arn]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.rds_client",
                    new=cluster,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_client.rds_client",
                    new=cluster,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan import (
                    rds_cluster_protected_by_backup_plan,
                )

                check = rds_cluster_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 is protected by a backup plan."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
                )
                assert result[0].resource_tags == []

    def test_rds_cluster_with_backup_plan_via_cluster_wildcard(self):
        cluster = mock.MagicMock()
        cluster.audited_partition = "aws"

        from prowler.providers.aws.services.rds.rds_service import DBCluster

        arn = "arn:aws:rds:*:*:cluster:*"
        cluster.db_clusters = {
            f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1": DBCluster(
                id="db-cluster-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1",
                endpoint="db-cluster-1.c9akciq32.rds.amazonaws.com",
                backtrack=1,
                parameter_group="test",
                engine_version="13.3",
                status="available",
                public=False,
                encrypted=True,
                deletion_protection=False,
                auto_minor_version_upgrade=True,
                multi_az=False,
                username="admin",
                iam_auth=False,
                name="db-cluster-1",
                region="us-east-1",
                cluster_class="db.m1.small",
                engine="postgres",
                allocated_storage=10,
                tags=[],
            )
        }

        backup = mock.MagicMock()
        backup.protected_resources = [arn]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.rds_client",
                    new=cluster,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_client.rds_client",
                    new=cluster,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan import (
                    rds_cluster_protected_by_backup_plan,
                )

                check = rds_cluster_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 is protected by a backup plan."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
                )
                assert result[0].resource_tags == []

    def test_rds_cluster_with_backup_plan_via_all_wildcard(self):
        cluster = mock.MagicMock()

        from prowler.providers.aws.services.rds.rds_service import DBCluster

        arn = "*"
        cluster.db_clusters = {
            f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1": DBCluster(
                id="db-cluster-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1",
                endpoint="db-cluster-1.c9akciq32.rds.amazonaws.com",
                backtrack=1,
                parameter_group="test",
                engine_version="13.3",
                status="available",
                public=False,
                encrypted=True,
                deletion_protection=False,
                auto_minor_version_upgrade=True,
                multi_az=False,
                username="admin",
                iam_auth=False,
                name="db-cluster-1",
                region="us-east-1",
                cluster_class="db.m1.small",
                engine="postgres",
                allocated_storage=10,
                tags=[],
            )
        }

        backup = mock.MagicMock()
        backup.protected_resources = [arn]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.rds_client",
                    new=cluster,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_client.rds_client",
                    new=cluster,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_protected_by_backup_plan.rds_cluster_protected_by_backup_plan import (
                    rds_cluster_protected_by_backup_plan,
                )

                check = rds_cluster_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 is protected by a backup plan."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-cluster-1"
                )
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
