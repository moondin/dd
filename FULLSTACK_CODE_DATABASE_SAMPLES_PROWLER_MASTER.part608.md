---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 608
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 608 of 867)

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

---[FILE: rds_instance_event_subscription_security_groups_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_instance_event_subscription_security_groups/rds_instance_event_subscription_security_groups_test.py

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
RDS_ACCOUNT_ARN = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"


class Test_rds_instance_no_event_subscriptions:
    @mock_aws
    def test_rds_no_events(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups import (
                    rds_instance_event_subscription_security_groups,
                )

                check = rds_instance_event_subscription_security_groups()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS security group event categories of configuration change and failure are not subscribed."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert result[0].resource_arn == RDS_ACCOUNT_ARN
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_no_events_ignoring(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider._scan_unused_services = False

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups import (
                    rds_instance_event_subscription_security_groups,
                )

                check = rds_instance_event_subscription_security_groups()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_security_event_subscription_enabled(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        # Create cluster first before instance
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="admin",
            MasterUserPassword="password",
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
        conn.create_event_subscription(
            SubscriptionName="TestSub",
            SnsTopicArn=f"arn:aws:sns:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:test",
            SourceType="db-security-group",
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
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups import (
                    rds_instance_event_subscription_security_groups,
                )

                check = rds_instance_event_subscription_security_groups()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS security group events are subscribed."
                )
                assert result[0].resource_id == "TestSub"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:es:TestSub"
                )
                assert result[0].resource_tags == [{"Key": "test", "Value": "testing"}]

    @mock_aws
    def test_rds_security_event_failure_only_subscription(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        # Create cluster first before instance
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="admin",
            MasterUserPassword="password",
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
        conn.create_event_subscription(
            SubscriptionName="TestSub",
            SnsTopicArn=f"arn:aws:sns:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:test",
            SourceType="db-security-group",
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
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups import (
                    rds_instance_event_subscription_security_groups,
                )

                check = rds_instance_event_subscription_security_groups()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS security group event category of configuration change is not subscribed."
                )
                assert result[0].resource_id == "TestSub"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:es:TestSub"
                )
                assert result[0].resource_tags == [{"Key": "test", "Value": "testing"}]

    @mock_aws
    def test_rds_security_event_configuration_change_only_subscription(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        # Create cluster first before instance
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="admin",
            MasterUserPassword="password",
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
        conn.create_event_subscription(
            SubscriptionName="TestSub",
            SnsTopicArn=f"arn:aws:sns:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:test",
            SourceType="db-security-group",
            EventCategories=["configuration change"],
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
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups import (
                    rds_instance_event_subscription_security_groups,
                )

                check = rds_instance_event_subscription_security_groups()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS security group event category of failure is not subscribed."
                )
                assert result[0].resource_id == "TestSub"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:es:TestSub"
                )
                assert result[0].resource_tags == [{"Key": "test", "Value": "testing"}]

    @mock_aws
    def test_rds_no_security_group_event_subscription(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        # Create cluster first before instance
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="admin",
            MasterUserPassword="password",
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
        conn.create_event_subscription(
            SubscriptionName="TestSub",
            SnsTopicArn=f"arn:aws:sns:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:test",
            SourceType="db-instance",
            EventCategories=["configuration change"],
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
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups import (
                    rds_instance_event_subscription_security_groups,
                )

                check = rds_instance_event_subscription_security_groups()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS security group event categories of configuration change and failure are not subscribed."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert result[0].resource_arn == RDS_ACCOUNT_ARN
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_no_event_subscription(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        # Create cluster first before instance
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="admin",
            MasterUserPassword="password",
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
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups import (
                    rds_instance_event_subscription_security_groups,
                )

                check = rds_instance_event_subscription_security_groups()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS security group event categories of configuration change and failure are not subscribed."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert result[0].resource_arn == RDS_ACCOUNT_ARN
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_security_event_subscription_both_enabled(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        # Create cluster first before instance
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="admin",
            MasterUserPassword="password",
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
        conn.create_event_subscription(
            SubscriptionName="TestSub",
            SnsTopicArn=f"arn:aws:sns:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:test",
            SourceType="db-security-group",
            EventCategories=["configuration change", "failure"],
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
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_security_groups.rds_instance_event_subscription_security_groups import (
                    rds_instance_event_subscription_security_groups,
                )

                check = rds_instance_event_subscription_security_groups()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS security group events are subscribed."
                )
                assert result[0].resource_id == "TestSub"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:es:TestSub"
                )
                assert result[0].resource_tags == [{"Key": "test", "Value": "testing"}]
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_iam_authentication_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_instance_iam_authentication_enabled/rds_instance_iam_authentication_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_rds_instance_iam_authentication_enabled:
    @mock_aws
    def test_rds_no_instances(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_iam_authentication_enabled.rds_instance_iam_authentication_enabled.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_iam_authentication_enabled.rds_instance_iam_authentication_enabled import (
                    rds_instance_iam_authentication_enabled,
                )

                check = rds_instance_iam_authentication_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_postgres_instance_without_iam_auth(self):
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
            DBName="postgres",
            EnableIAMDatabaseAuthentication=False,
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
                "prowler.providers.aws.services.rds.rds_instance_iam_authentication_enabled.rds_instance_iam_authentication_enabled.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_iam_authentication_enabled.rds_instance_iam_authentication_enabled import (
                    rds_instance_iam_authentication_enabled,
                )

                check = rds_instance_iam_authentication_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 does not have IAM authentication enabled."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_postgres_instance_with_iam_auth(self):
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
            EnableIAMDatabaseAuthentication=True,
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
                "prowler.providers.aws.services.rds.rds_instance_iam_authentication_enabled.rds_instance_iam_authentication_enabled.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_iam_authentication_enabled.rds_instance_iam_authentication_enabled import (
                    rds_instance_iam_authentication_enabled,
                )

                check = rds_instance_iam_authentication_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 has IAM authentication enabled."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_sqlserver_instance(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.sqlserver18",
            Description="test parameter group",
        )
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="sqlserver-ee",
            DBName="staging-sqlserver",
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
                "prowler.providers.aws.services.rds.rds_instance_iam_authentication_enabled.rds_instance_iam_authentication_enabled.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_iam_authentication_enabled.rds_instance_iam_authentication_enabled import (
                    rds_instance_iam_authentication_enabled,
                )

                check = rds_instance_iam_authentication_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_cluster_instance_without_iam_authentication(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            DBSubnetGroupName="default",
            EngineMode="provisioned",
            MasterUsername="admin",
            MasterUserPassword="password",
        )
        conn.create_db_instance(
            DBInstanceIdentifier="db-instance-1",
            DBClusterIdentifier="db-cluster-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            PubliclyAccessible=False,
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_iam_authentication_enabled.rds_instance_iam_authentication_enabled.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_iam_authentication_enabled.rds_instance_iam_authentication_enabled import (
                    rds_instance_iam_authentication_enabled,
                )

                check = rds_instance_iam_authentication_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-instance-1 does not have IAM authentication enabled at cluster db-cluster-1 level."
                )
                assert result[0].resource_id == "db-instance-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-instance-1"
                )
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_inside_vpc_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_instance_inside_vpc/rds_instance_inside_vpc_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.rds.rds_service import DBInstance
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_rds_instance_inside_vpc:
    @mock_aws
    def test_rds_no_instances(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_inside_vpc.rds_instance_inside_vpc.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_inside_vpc.rds_instance_inside_vpc import (
                    rds_instance_inside_vpc,
                )

                check = rds_instance_inside_vpc()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_instance_inside_vpc(self):
        rds_conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        ec2_conn = client("ec2")

        # Step 1: Create the VPC
        vpc_id = ec2_conn.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        subnet_1_id = ec2_conn.create_subnet(CidrBlock="10.0.1.0/24", VpcId=vpc_id)[
            "Subnet"
        ]["SubnetId"]
        subnet_2_id = ec2_conn.create_subnet(CidrBlock="10.0.2.0/24", VpcId=vpc_id)[
            "Subnet"
        ]["SubnetId"]
        subnet_group_name = "my-rds-subnet-group"
        rds_conn.create_db_subnet_group(
            DBSubnetGroupName=subnet_group_name,
            DBSubnetGroupDescription="Subnet group for RDS instance in VPC",
            SubnetIds=[
                subnet_1_id,
                subnet_2_id,
            ],
        )
        rds_conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            StorageEncrypted=True,
            DeletionProtection=True,
            PubliclyAccessible=True,
            AutoMinorVersionUpgrade=True,
            BackupRetentionPeriod=10,
            Port=5432,
            DBSubnetGroupName=subnet_group_name,
            Tags=[{"Key": "test", "Value": "test"}],
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_inside_vpc.rds_instance_inside_vpc.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_inside_vpc.rds_instance_inside_vpc import (
                    rds_instance_inside_vpc,
                )

                check = rds_instance_inside_vpc()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"RDS Instance db-master-1 is deployed in a VPC {vpc_id}."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]

    def test_rds_instance_not_in_vpc(self):
        rds_client = mock.MagicMock
        instance_arn = (
            f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
        )
        rds_client.db_instances = {
            instance_arn: DBInstance(
                id="db-master-1",
                arn=instance_arn,
                engine="postgres",
                cloudwatch_logs=None,
                deletion_protection=True,
                auto_minor_version_upgrade=True,
                enhanced_monitoring_arn=None,
                endpoint={
                    "Address": "db-master-1.us-east-1.rds.amazonaws.com",
                    "Port": 5432,
                },
                engine_version="12.3",
                status="available",
                public=False,
                encrypted=False,
                iam_auth=False,
                region=AWS_REGION_US_EAST_1,
                multi_az=False,
                username="admin",
                tags=[{"Key": "test", "Value": "test"}],
                copy_tags_to_snapshot=None,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.rds.rds_service.RDS",
                new=rds_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_inside_vpc.rds_instance_inside_vpc.rds_client",
                new=rds_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.rds.rds_instance_inside_vpc.rds_instance_inside_vpc import (
                rds_instance_inside_vpc,
            )

            check = rds_instance_inside_vpc()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "RDS Instance db-master-1 is not deployed in a VPC."
            )
            assert result[0].resource_id == "db-master-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
            )
            assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]
```

--------------------------------------------------------------------------------

````
