---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 602
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 602 of 867)

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

---[FILE: rds_cluster_critical_event_subscription_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_cluster_critical_event_subscription/rds_cluster_critical_event_subscription_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

RDS_ACCOUNT_ARN = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"


class Test_rds_cluster_critical_event_subscription:
    @mock_aws
    def test_rds_no_events(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_critical_event_subscription.rds_cluster_critical_event_subscription.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_critical_event_subscription.rds_cluster_critical_event_subscription import (
                    rds_cluster_critical_event_subscription,
                )

                check = rds_cluster_critical_event_subscription()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS cluster event categories of maintenance and failure are not subscribed."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert result[0].resource_arn == RDS_ACCOUNT_ARN
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_cluster_event_subscription_enabled(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="admin",
            MasterUserPassword="password",
        )
        conn.create_event_subscription(
            SubscriptionName="TestSub",
            SnsTopicArn=f"arn:aws:sns:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:test",
            SourceType="db-cluster",
            Enabled=True,
            EventCategories=["maintenance", "failure"],
            Tags=[
                {"Key": "test", "Value": "testing"},
            ],
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_critical_event_subscription.rds_cluster_critical_event_subscription.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_critical_event_subscription.rds_cluster_critical_event_subscription import (
                    rds_cluster_critical_event_subscription,
                )

                check = rds_cluster_critical_event_subscription()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].status_extended == "RDS cluster events are subscribed."
                assert result[0].resource_id == "TestSub"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:es:TestSub"
                )
                assert result[0].resource_tags == [{"Key": "test", "Value": "testing"}]

    @mock_aws
    def test_rds_cluster_event_failure_only_subscription(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="admin",
            MasterUserPassword="password",
        )
        conn.create_event_subscription(
            SubscriptionName="TestSub",
            SnsTopicArn=f"arn:aws:sns:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:test",
            SourceType="db-cluster",
            EventCategories=["failure"],
            Enabled=True,
            Tags=[
                {"Key": "test", "Value": "testing"},
            ],
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_critical_event_subscription.rds_cluster_critical_event_subscription.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_critical_event_subscription.rds_cluster_critical_event_subscription import (
                    rds_cluster_critical_event_subscription,
                )

                check = rds_cluster_critical_event_subscription()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS cluster event category of maintenance is not subscribed."
                )
                assert result[0].resource_id == "TestSub"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:es:TestSub"
                )
                assert result[0].resource_tags == [{"Key": "test", "Value": "testing"}]

    @mock_aws
    def test_rds_cluster_event_maintenance_only_subscription(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="admin",
            MasterUserPassword="password",
        )
        conn.create_event_subscription(
            SubscriptionName="TestSub",
            SnsTopicArn=f"arn:aws:sns:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:test",
            SourceType="db-cluster",
            EventCategories=["maintenance"],
            Enabled=True,
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_critical_event_subscription.rds_cluster_critical_event_subscription.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_critical_event_subscription.rds_cluster_critical_event_subscription import (
                    rds_cluster_critical_event_subscription,
                )

                check = rds_cluster_critical_event_subscription()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS cluster event category of failure is not subscribed."
                )
                assert result[0].resource_id == "TestSub"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:es:TestSub"
                )
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_default_admin_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_cluster_default_admin/rds_cluster_default_admin_test.py

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


@mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_rds_cluster_default_admin:
    @mock_aws
    def test_rds_no_clusters(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_default_admin.rds_cluster_default_admin.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_default_admin.rds_cluster_default_admin import (
                    rds_cluster_default_admin,
                )

                check = rds_cluster_default_admin()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_clustered_with_default_username(self):
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
            MasterUsername="admin",
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
                "prowler.providers.aws.services.rds.rds_cluster_default_admin.rds_cluster_default_admin.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_default_admin.rds_cluster_default_admin import (
                    rds_cluster_default_admin,
                )

                check = rds_cluster_default_admin()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 is using the default master username."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_clustered_without_default_username(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres8.0",
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
                "prowler.providers.aws.services.rds.rds_cluster_default_admin.rds_cluster_default_admin.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_default_admin.rds_cluster_default_admin import (
                    rds_cluster_default_admin,
                )

                check = rds_cluster_default_admin()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 is not using the default master username."
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

---[FILE: rds_cluster_deletion_protection_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_cluster_deletion_protection/rds_cluster_deletion_protection_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_rds_cluster_deletion_protection:
    @mock_aws
    def test_rds_no_clusters(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_deletion_protection.rds_cluster_deletion_protection.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_deletion_protection.rds_cluster_deletion_protection import (
                    rds_cluster_deletion_protection,
                )

                check = rds_cluster_deletion_protection()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_clustered_with_deletion_protection(self):
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
                "prowler.providers.aws.services.rds.rds_cluster_deletion_protection.rds_cluster_deletion_protection.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_deletion_protection.rds_cluster_deletion_protection import (
                    rds_cluster_deletion_protection,
                )

                check = rds_cluster_deletion_protection()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 has deletion protection enabled."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_clustered_without_deletion_protection(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres8.0",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            AllocatedStorage=10,
            Engine="postgres",
            DatabaseName="staging-postgres",
            DeletionProtection=False,
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
                "prowler.providers.aws.services.rds.rds_cluster_deletion_protection.rds_cluster_deletion_protection.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_deletion_protection.rds_cluster_deletion_protection import (
                    rds_cluster_deletion_protection,
                )

                check = rds_cluster_deletion_protection()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 does not have deletion protection enabled."
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

---[FILE: rds_cluster_iam_authentication_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_cluster_iam_authentication_enabled/rds_cluster_iam_authentication_enabled_test.py

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


@mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_rds_cluster_iam_authentication_enabled:
    @mock_aws
    def test_rds_no_clusters(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_iam_authentication_enabled.rds_cluster_iam_authentication_enabled.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_iam_authentication_enabled.rds_cluster_iam_authentication_enabled import (
                    rds_cluster_iam_authentication_enabled,
                )

                check = rds_cluster_iam_authentication_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_aurora_mysql_clustered_without_iam_auth(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster_parameter_group(
            DBClusterParameterGroupName="test",
            DBParameterGroupFamily="aurora-mysql5.7",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="aurora-mysql",
            DatabaseName="staging-mysql",
            DeletionProtection=True,
            DBClusterParameterGroupName="test",
            MasterUsername="test",
            MasterUserPassword="password",
            Tags=[],
            AvailabilityZones=["us-east-1a"],
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_iam_authentication_enabled.rds_cluster_iam_authentication_enabled.rds_client",
                new=RDS(aws_provider),
            ):
                from prowler.providers.aws.services.rds.rds_cluster_iam_authentication_enabled.rds_cluster_iam_authentication_enabled import (
                    rds_cluster_iam_authentication_enabled,
                )

                check = rds_cluster_iam_authentication_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 does not have IAM authentication enabled."
                )
                assert result[0].resource_id == "db-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_aurora_mysql_clustered_with_iam_auth(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster_parameter_group(
            DBClusterParameterGroupName="test",
            DBParameterGroupFamily="aurora-mysql5.7",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="aurora-mysql",
            DatabaseName="staging-mysql",
            DeletionProtection=True,
            DBClusterParameterGroupName="test",
            MasterUsername="test",
            MasterUserPassword="password",
            Tags=[],
            EnableIAMDatabaseAuthentication=True,
            AvailabilityZones=["us-east-1a"],
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_iam_authentication_enabled.rds_cluster_iam_authentication_enabled.rds_client",
                new=RDS(aws_provider),
            ):
                from prowler.providers.aws.services.rds.rds_cluster_iam_authentication_enabled.rds_cluster_iam_authentication_enabled import (
                    rds_cluster_iam_authentication_enabled,
                )

                check = rds_cluster_iam_authentication_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Cluster db-cluster-1 has IAM authentication enabled."
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

---[FILE: rds_cluster_integration_cloudwatch_logs_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_cluster_integration_cloudwatch_logs/rds_cluster_integration_cloudwatch_logs_test.py

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
    if operation_name == "CreateDBCluster":
        return {
            "DBClusterIdentifier": "cluster-1",
            "Engine": "postgres",
            "MasterUsername": "admin",
            "MasterUserPassword": "password",
        }

    return make_api_call(self, operation_name, kwarg)


class Test_rds_cluster_integration_cloudwatch_logs:
    @mock_aws
    def test_rds_no_clusters(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_integration_cloudwatch_logs.rds_cluster_integration_cloudwatch_logs.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_integration_cloudwatch_logs.rds_cluster_integration_cloudwatch_logs import (
                    rds_cluster_integration_cloudwatch_logs,
                )

                check = rds_cluster_integration_cloudwatch_logs()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_no_valid_cluster(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call", new=mock_make_api_call
        ):
            conn = client("rds", region_name=AWS_REGION_US_EAST_1)
            conn.create_db_cluster(
                DBClusterIdentifier="cluster-1",
                Engine="postgres",
                MasterUsername="admin",
                MasterUserPassword="password",
            )

            from prowler.providers.aws.services.rds.rds_service import RDS

            aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

            with mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ):
                with mock.patch(
                    "prowler.providers.aws.services.rds.rds_cluster_integration_cloudwatch_logs.rds_cluster_integration_cloudwatch_logs.rds_client",
                    new=RDS(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.rds.rds_cluster_integration_cloudwatch_logs.rds_cluster_integration_cloudwatch_logs import (
                        rds_cluster_integration_cloudwatch_logs,
                    )

                    check = rds_cluster_integration_cloudwatch_logs()
                    result = check.execute()

                    assert len(result) == 0

    @mock_aws
    def test_rds_cluster_no_logs(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="aurora-cluster-1",
            Engine="postgres",
            MasterUsername="admin",
            MasterUserPassword="password",
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_integration_cloudwatch_logs.rds_cluster_integration_cloudwatch_logs.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_integration_cloudwatch_logs.rds_cluster_integration_cloudwatch_logs import (
                    rds_cluster_integration_cloudwatch_logs,
                )

                check = rds_cluster_integration_cloudwatch_logs()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Cluster aurora-cluster-1 does not have CloudWatch Logs enabled."
                )
                assert result[0].resource_id == "aurora-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:aurora-cluster-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_cluster_with_logs(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="aurora-cluster-1",
            Engine="postgres",
            MasterUsername="admin",
            MasterUserPassword="password",
            EnableCloudwatchLogsExports=["audit", "error"],
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_cluster_integration_cloudwatch_logs.rds_cluster_integration_cloudwatch_logs.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_cluster_integration_cloudwatch_logs.rds_cluster_integration_cloudwatch_logs import (
                    rds_cluster_integration_cloudwatch_logs,
                )

                check = rds_cluster_integration_cloudwatch_logs()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Cluster aurora-cluster-1 is shipping audit, error logs to CloudWatch Logs."
                )
                assert result[0].resource_id == "aurora-cluster-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:aurora-cluster-1"
                )
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
