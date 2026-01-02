---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 607
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 607 of 867)

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

---[FILE: rds_instance_deletion_protection_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_instance_deletion_protection/rds_instance_deletion_protection_test.py

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
class Test_rds_instance_deletion_protection:
    @mock_aws
    def test_rds_no_instances(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_deletion_protection.rds_instance_deletion_protection.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_deletion_protection.rds_instance_deletion_protection import (
                    rds_instance_deletion_protection,
                )

                check = rds_instance_deletion_protection()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_instance_no_deletion_protection(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_deletion_protection.rds_instance_deletion_protection.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_deletion_protection.rds_instance_deletion_protection import (
                    rds_instance_deletion_protection,
                )

                check = rds_instance_deletion_protection()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 deletion protection is not enabled."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_instance_with_deletion_protection(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            DeletionProtection=True,
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_deletion_protection.rds_instance_deletion_protection.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_deletion_protection.rds_instance_deletion_protection import (
                    rds_instance_deletion_protection,
                )

                check = rds_instance_deletion_protection()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 deletion protection is enabled."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_instance_without_cluster_deletion_protection(self):
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
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
        )
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            DBClusterIdentifier="db-cluster-1",
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_deletion_protection.rds_instance_deletion_protection.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_deletion_protection.rds_instance_deletion_protection import (
                    rds_instance_deletion_protection,
                )

                check = rds_instance_deletion_protection()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 deletion protection is not enabled at cluster db-cluster-1 level."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_instance_with_cluster_deletion_protection(self):
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
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
        )
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            DBClusterIdentifier="db-cluster-1",
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_deletion_protection.rds_instance_deletion_protection.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_deletion_protection.rds_instance_deletion_protection import (
                    rds_instance_deletion_protection,
                )

                check = rds_instance_deletion_protection()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 deletion protection is enabled at cluster db-cluster-1 level."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_deprecated_engine_version_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_instance_deprecated_engine_version/rds_instance_deprecated_engine_version_test.py

```python
from unittest import mock
from unittest.mock import patch

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


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_rds_instance_deprecated_engine_version:
    @mock_aws
    def test_rds_no_instances(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_deprecated_engine_version.rds_instance_deprecated_engine_version.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_deprecated_engine_version.rds_instance_deprecated_engine_version import (
                    rds_instance_deprecated_engine_version,
                )

                check = rds_instance_deprecated_engine_version()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_instance_no_deprecated_engine_version(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            EngineVersion="8.0.32",
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
                "prowler.providers.aws.services.rds.rds_instance_deprecated_engine_version.rds_instance_deprecated_engine_version.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_deprecated_engine_version.rds_instance_deprecated_engine_version import (
                    rds_instance_deprecated_engine_version,
                )

                check = rds_instance_deprecated_engine_version()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS instance db-master-1 is not using a deprecated engine postgres with version 8.0.32."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_instance_deprecated_engine_version(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-2",
            AllocatedStorage=10,
            Engine="postgres",
            EngineVersion="8.0.23",
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
                "prowler.providers.aws.services.rds.rds_instance_deprecated_engine_version.rds_instance_deprecated_engine_version.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_deprecated_engine_version.rds_instance_deprecated_engine_version import (
                    rds_instance_deprecated_engine_version,
                )

                check = rds_instance_deprecated_engine_version()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS instance db-master-2 is using a deprecated engine postgres with version 8.0.23."
                )
                assert result[0].resource_id == "db-master-2"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-2"
                )
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_enhanced_monitoring_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_instance_enhanced_monitoring_enabled/rds_instance_enhanced_monitoring_enabled_test.py

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
class Test_rds_instance_enhanced_monitoring_enabled:
    @mock_aws
    def test_rds_no_instances(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_enhanced_monitoring_enabled.rds_instance_enhanced_monitoring_enabled.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_enhanced_monitoring_enabled.rds_instance_enhanced_monitoring_enabled import (
                    rds_instance_enhanced_monitoring_enabled,
                )

                check = rds_instance_enhanced_monitoring_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_instance_no_monitoring(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_enhanced_monitoring_enabled.rds_instance_enhanced_monitoring_enabled.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_enhanced_monitoring_enabled.rds_instance_enhanced_monitoring_enabled import (
                    rds_instance_enhanced_monitoring_enabled,
                )

                check = rds_instance_enhanced_monitoring_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 does not have enhanced monitoring enabled."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_instance_with_monitoring(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        instance_id = "db-master-1"
        conn.create_db_instance(
            DBInstanceIdentifier=instance_id,
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_enhanced_monitoring_enabled.rds_instance_enhanced_monitoring_enabled.rds_client",
                new=RDS(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_enhanced_monitoring_enabled.rds_instance_enhanced_monitoring_enabled import (
                    rds_instance_enhanced_monitoring_enabled,
                )

                instance_arn = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:{instance_id}"
                service_client.db_instances[instance_arn].enhanced_monitoring_arn = (
                    "log-stream"
                )

                check = rds_instance_enhanced_monitoring_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"RDS Instance {instance_id} has enhanced monitoring enabled."
                )
                assert result[0].resource_id == instance_id
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_arn == instance_arn
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_event_subscription_parameter_groups_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_instance_event_subscription_parameter_groups/rds_instance_event_subscription_parameter_groups_test.py

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


class Test_rds_instance__no_event_subscriptions:
    @mock_aws
    def test_rds_no_events(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_parameter_groups.rds_instance_event_subscription_parameter_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_parameter_groups.rds_instance_event_subscription_parameter_groups import (
                    rds_instance_event_subscription_parameter_groups,
                )

                check = rds_instance_event_subscription_parameter_groups()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS parameter group event categories of configuration change is not subscribed."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert result[0].resource_arn == RDS_ACCOUNT_ARN
                assert result[0].resource_tags == []
                assert result[0].resource == {}

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
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_parameter_groups.rds_instance_event_subscription_parameter_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_parameter_groups.rds_instance_event_subscription_parameter_groups import (
                    rds_instance_event_subscription_parameter_groups,
                )

                check = rds_instance_event_subscription_parameter_groups()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_parameter_event_subscription_enabled(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="postgres",
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
            SourceType="db-parameter-group",
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
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_parameter_groups.rds_instance_event_subscription_parameter_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_parameter_groups.rds_instance_event_subscription_parameter_groups import (
                    rds_instance_event_subscription_parameter_groups,
                )

                check = rds_instance_event_subscription_parameter_groups()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS parameter group events are subscribed."
                )
                assert result[0].resource_id == "TestSub"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:es:TestSub"
                )
                assert result[0].resource_tags == [{"Key": "test", "Value": "testing"}]

    @mock_aws
    def test_rds_parameter_event_configuration_change_only_subscription(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="postgres",
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
            SourceType="db-parameter-group",
            EventCategories=["configuration change"],
            Enabled=True,
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_parameter_groups.rds_instance_event_subscription_parameter_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_parameter_groups.rds_instance_event_subscription_parameter_groups import (
                    rds_instance_event_subscription_parameter_groups,
                )

                check = rds_instance_event_subscription_parameter_groups()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS parameter group events are subscribed."
                )
                assert result[0].resource_id == "TestSub"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:es:TestSub"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_parameter_event_subscription_not_parameter_group(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_parameter_group(
            DBParameterGroupName="test",
            DBParameterGroupFamily="default.postgres14",
            Description="test parameter group",
        )
        conn.create_db_cluster(
            DBClusterIdentifier="db-cluster-1",
            Engine="postgres",
            MasterUsername="postgres",
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
                "prowler.providers.aws.services.rds.rds_instance_event_subscription_parameter_groups.rds_instance_event_subscription_parameter_groups.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_event_subscription_parameter_groups.rds_instance_event_subscription_parameter_groups import (
                    rds_instance_event_subscription_parameter_groups,
                )

                check = rds_instance_event_subscription_parameter_groups()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS parameter group event categories of configuration change is not subscribed."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert result[0].resource_arn == RDS_ACCOUNT_ARN
                assert result[0].resource_tags == []
                assert result[0].resource == {}
```

--------------------------------------------------------------------------------

````
