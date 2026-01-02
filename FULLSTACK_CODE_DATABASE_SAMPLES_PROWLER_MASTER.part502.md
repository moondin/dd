---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 502
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 502 of 867)

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

---[FILE: dynamodb_tables_pitr_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dynamodb/dynamodb_tables_pitr_enabled/dynamodb_tables_pitr_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_dynamodb_tables_pitr_enabled:
    @mock_aws
    def test_dynamodb_no_tables(self):
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_tables_pitr_enabled.dynamodb_tables_pitr_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_tables_pitr_enabled.dynamodb_tables_pitr_enabled import (
                dynamodb_tables_pitr_enabled,
            )

            check = dynamodb_tables_pitr_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_dynamodb_table_no_pitr(self):
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        table = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PAY_PER_REQUEST",
        )["TableDescription"]
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_tables_pitr_enabled.dynamodb_tables_pitr_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_tables_pitr_enabled.dynamodb_tables_pitr_enabled import (
                dynamodb_tables_pitr_enabled,
            )

            check = dynamodb_tables_pitr_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "DynamoDB table test1 does not have point-in-time recovery enabled."
            )
            assert result[0].resource_id == table["TableName"]
            assert result[0].resource_arn == table["TableArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_dynamodb_table_with_pitr(self):
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        table = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PAY_PER_REQUEST",
        )["TableDescription"]
        dynamodb_client.update_continuous_backups(
            TableName="test1",
            PointInTimeRecoverySpecification={"PointInTimeRecoveryEnabled": True},
        )
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_tables_pitr_enabled.dynamodb_tables_pitr_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_tables_pitr_enabled.dynamodb_tables_pitr_enabled import (
                dynamodb_tables_pitr_enabled,
            )

            check = dynamodb_tables_pitr_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "DynamoDB table test1 has point-in-time recovery enabled."
            )
            assert result[0].resource_id == table["TableName"]
            assert result[0].resource_arn == table["TableArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_table_autoscaling_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dynamodb/dynamodb_table_autoscaling_enabled/dynamodb_table_autoscaling_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_dynamodb_table_autoscaling_enabled:
    @mock_aws
    def test_dynamodb_no_tables(self):
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled import (
                dynamodb_table_autoscaling_enabled,
            )

            check = dynamodb_table_autoscaling_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_dynamodb_table_on_demand(self):
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        table = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PAY_PER_REQUEST",
        )["TableDescription"]

        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled import (
                dynamodb_table_autoscaling_enabled,
            )

            check = dynamodb_table_autoscaling_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "DynamoDB table test1 automatically scales capacity on demand."
            )
            assert result[0].resource_id == table["TableName"]
            assert result[0].resource_arn == table["TableArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_dynamodb_table_provisioned_with_autoscaling(self):
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        table = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PROVISIONED",
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
        )["TableDescription"]

        autoscaling_client = client(
            "application-autoscaling", region_name=AWS_REGION_US_EAST_1
        )
        autoscaling_client.register_scalable_target(
            ServiceNamespace="dynamodb",
            ResourceId=f"table/{table['TableName']}",
            ScalableDimension="dynamodb:table:ReadCapacityUnits",
            MinCapacity=1,
            MaxCapacity=10,
        )
        autoscaling_client.register_scalable_target(
            ServiceNamespace="dynamodb",
            ResourceId=f"table/{table['TableName']}",
            ScalableDimension="dynamodb:table:WriteCapacityUnits",
            MinCapacity=1,
            MaxCapacity=10,
        )

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            ApplicationAutoScaling,
        )
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled.applicationautoscaling_client",
                new=ApplicationAutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled import (
                dynamodb_table_autoscaling_enabled,
            )

            check = dynamodb_table_autoscaling_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "DynamoDB table test1 is in provisioned mode with auto scaling enabled for both read and write capacity units."
            )
            assert result[0].resource_id == table["TableName"]
            assert result[0].resource_arn == table["TableArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_dynamodb_table_provisioned_only_with_read_autoscaling(self):
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        table = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PROVISIONED",
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
        )["TableDescription"]

        autoscaling_client = client(
            "application-autoscaling", region_name=AWS_REGION_US_EAST_1
        )
        autoscaling_client.register_scalable_target(
            ServiceNamespace="dynamodb",
            ResourceId=f"table/{table['TableName']}",
            ScalableDimension="dynamodb:table:ReadCapacityUnits",
            MinCapacity=1,
            MaxCapacity=10,
        )

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            ApplicationAutoScaling,
        )
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled.applicationautoscaling_client",
                new=ApplicationAutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled import (
                dynamodb_table_autoscaling_enabled,
            )

            check = dynamodb_table_autoscaling_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DynamoDB table test1 is in provisioned mode without auto scaling enabled for write."
            )
            assert result[0].resource_id == table["TableName"]
            assert result[0].resource_arn == table["TableArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_dynamodb_table_provisioned_only_with_write_autoscaling(self):
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        table = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PROVISIONED",
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
        )["TableDescription"]

        autoscaling_client = client(
            "application-autoscaling", region_name=AWS_REGION_US_EAST_1
        )
        autoscaling_client.register_scalable_target(
            ServiceNamespace="dynamodb",
            ResourceId=f"table/{table['TableName']}",
            ScalableDimension="dynamodb:table:WriteCapacityUnits",
            MinCapacity=1,
            MaxCapacity=10,
        )

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            ApplicationAutoScaling,
        )
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled.applicationautoscaling_client",
                new=ApplicationAutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled import (
                dynamodb_table_autoscaling_enabled,
            )

            check = dynamodb_table_autoscaling_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DynamoDB table test1 is in provisioned mode without auto scaling enabled for read."
            )
            assert result[0].resource_id == table["TableName"]
            assert result[0].resource_arn == table["TableArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_dynamodb_table_provisioned_without_autoscaling(self):
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        table = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PROVISIONED",
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
        )["TableDescription"]

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            ApplicationAutoScaling,
        )
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled.applicationautoscaling_client",
                new=ApplicationAutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_table_autoscaling_enabled.dynamodb_table_autoscaling_enabled import (
                dynamodb_table_autoscaling_enabled,
            )

            check = dynamodb_table_autoscaling_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DynamoDB table test1 is in provisioned mode without auto scaling enabled for read, write."
            )
            assert result[0].resource_id == table["TableName"]
            assert result[0].resource_arn == table["TableArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_table_cross_account_access_test.py]---
Location: prowler-master/tests/providers/aws/services/dynamodb/dynamodb_table_cross_account_access/dynamodb_table_cross_account_access_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

test_table_name = str(uuid4())
test_table_arn = f"arn:aws:dynamodb:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:table/{test_table_name}"

test_restricted_policy = {
    "Version": "2012-10-17",
    "Id": "Table1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Table1_AnonymousAccess_GetItem",
            "Effect": "Allow",
            "Principal": {"AWS": {AWS_ACCOUNT_NUMBER}},
            "Action": "dynamodb:BatchGetItem",
            "Resource": test_table_arn,
        }
    ],
}

test_public_policy = {
    "Version": "2012-10-17",
    "Id": "Table1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Table1_AnonymousAccess_GetItem",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "dynamodb:BatchGetItem",
            "Resource": test_table_arn,
        }
    ],
}

test_public_policy_with_condition_same_account_not_valid = {
    "Version": "2012-10-17",
    "Id": "Table1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Table1_AnonymousAccess_GetItem",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "dynamodb:BatchGetItem",
            "Resource": test_table_arn,
            "Condition": {
                "DateGreaterThan": {"aws:CurrentTime": "2009-01-31T12:00Z"},
                "DateLessThan": {"aws:CurrentTime": "2009-01-31T15:00Z"},
            },
        }
    ],
}

test_public_policy_with_condition_same_account = {
    "Version": "2012-10-17",
    "Id": "Table1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Table1_AnonymousAccess_GetItem",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "dynamodb:BatchGetItem",
            "Resource": test_table_arn,
            "Condition": {
                "StringEquals": {"aws:SourceAccount": f"{AWS_ACCOUNT_NUMBER}"}
            },
        }
    ],
}

test_public_policy_with_condition_diff_account = {
    "Version": "2012-10-17",
    "Id": "Table1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Table1_AnonymousAccess_GetItem",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "dynamodb:BatchGetItem",
            "Resource": test_table_arn,
            "Condition": {"StringEquals": {"aws:SourceAccount": "111122223333"}},
        }
    ],
}

test_public_policy_with_invalid_condition_block = {
    "Version": "2012-10-17",
    "Id": "Table1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Table1_AnonymousAccess_GetItem",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "dynamodb:BatchGetItem",
            "Resource": test_table_arn,
            "Condition": {"DateGreaterThan": {"aws:CurrentTime": "2009-01-31T12:00Z"}},
        }
    ],
}


class Test_dynamodb_table_cross_account_access:
    def test_no_tables(self):
        dynamodb_client = mock.MagicMock
        dynamodb_client.tables = {}
        with (
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_service.DynamoDB",
                new=dynamodb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_client.dynamodb_client",
                new=dynamodb_client,
            ),
        ):
            from prowler.providers.aws.services.dynamodb.dynamodb_table_cross_account_access.dynamodb_table_cross_account_access import (
                dynamodb_table_cross_account_access,
            )

            check = dynamodb_table_cross_account_access()
            result = check.execute()
            assert len(result) == 0

    def test_tables_no_policy(self):
        dynamodb_client = mock.MagicMock
        from prowler.providers.aws.services.dynamodb.dynamodb_service import Table

        dynamodb_client.audited_account = AWS_ACCOUNT_NUMBER
        dynamodb_client.audit_config = {}
        arn = test_table_arn
        dynamodb_client.tables = {
            arn: Table(
                arn=arn,
                name=test_table_name,
                region=AWS_REGION_EU_WEST_1,
                policy={},
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_service.DynamoDB",
                new=dynamodb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_client.dynamodb_client",
                new=dynamodb_client,
            ),
        ):
            from prowler.providers.aws.services.dynamodb.dynamodb_table_cross_account_access.dynamodb_table_cross_account_access import (
                dynamodb_table_cross_account_access,
            )

            check = dynamodb_table_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"DynamoDB table {test_table_name} does not have a resource-based policy."
            )
            assert result[0].resource_id == test_table_name
            assert result[0].resource_arn == test_table_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_tables_not_public(self):
        dynamodb_client = mock.MagicMock
        from prowler.providers.aws.services.dynamodb.dynamodb_service import Table

        dynamodb_client.audited_account = AWS_ACCOUNT_NUMBER
        dynamodb_client.audit_config = {}
        arn = test_table_arn
        dynamodb_client.tables = {
            arn: Table(
                arn=arn,
                name=test_table_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_restricted_policy,
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_service.DynamoDB",
                new=dynamodb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_client.dynamodb_client",
                new=dynamodb_client,
            ),
        ):
            from prowler.providers.aws.services.dynamodb.dynamodb_table_cross_account_access.dynamodb_table_cross_account_access import (
                dynamodb_table_cross_account_access,
            )

            check = dynamodb_table_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"DynamoDB table {test_table_name} has a resource-based policy but is not cross account."
            )
            assert result[0].resource_id == test_table_name
            assert result[0].resource_arn == test_table_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_tables_public(self):
        dynamodb_client = mock.MagicMock
        from prowler.providers.aws.services.dynamodb.dynamodb_service import Table

        dynamodb_client.audited_account = AWS_ACCOUNT_NUMBER
        dynamodb_client.audit_config = {}
        arn = test_table_arn
        dynamodb_client.tables = {
            arn: Table(
                arn=test_table_arn,
                name=test_table_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_public_policy,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_service.DynamoDB",
                new=dynamodb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_client.dynamodb_client",
                new=dynamodb_client,
            ),
        ):
            from prowler.providers.aws.services.dynamodb.dynamodb_table_cross_account_access.dynamodb_table_cross_account_access import (
                dynamodb_table_cross_account_access,
            )

            check = dynamodb_table_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DynamoDB table {test_table_name} has a resource-based policy allowing cross account access."
            )
            assert result[0].resource_id == test_table_name
            assert result[0].resource_arn == test_table_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_tables_public_with_condition_not_valid(self):
        dynamodb_client = mock.MagicMock
        from prowler.providers.aws.services.dynamodb.dynamodb_service import Table

        dynamodb_client.audited_account = AWS_ACCOUNT_NUMBER
        dynamodb_client.audit_config = {}
        arn = test_table_arn
        dynamodb_client.tables = {
            arn: Table(
                arn=test_table_arn,
                name=test_table_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_public_policy_with_condition_same_account_not_valid,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_service.DynamoDB",
                new=dynamodb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_client.dynamodb_client",
                new=dynamodb_client,
            ),
        ):
            from prowler.providers.aws.services.dynamodb.dynamodb_table_cross_account_access.dynamodb_table_cross_account_access import (
                dynamodb_table_cross_account_access,
            )

            check = dynamodb_table_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DynamoDB table {test_table_name} has a resource-based policy allowing cross account access."
            )
            assert result[0].resource_id == test_table_name
            assert result[0].resource_arn == test_table_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_tables_public_with_condition_valid(self):
        dynamodb_client = mock.MagicMock
        from prowler.providers.aws.services.dynamodb.dynamodb_service import Table

        dynamodb_client.audited_account = AWS_ACCOUNT_NUMBER
        dynamodb_client.audit_config = {}
        arn = test_table_arn
        dynamodb_client.tables = {
            arn: Table(
                arn=test_table_arn,
                name=test_table_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_public_policy_with_condition_same_account,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_service.DynamoDB",
                new=dynamodb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_client.dynamodb_client",
                new=dynamodb_client,
            ),
        ):
            from prowler.providers.aws.services.dynamodb.dynamodb_table_cross_account_access.dynamodb_table_cross_account_access import (
                dynamodb_table_cross_account_access,
            )

            check = dynamodb_table_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"DynamoDB table {test_table_name} has a resource-based policy but is not cross account."
            )
            assert result[0].resource_id == test_table_name
            assert result[0].resource_arn == test_table_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_tables_public_with_condition_valid_with_other_account(self):
        dynamodb_client = mock.MagicMock
        from prowler.providers.aws.services.dynamodb.dynamodb_service import Table

        dynamodb_client.audited_account = AWS_ACCOUNT_NUMBER
        dynamodb_client.audit_config = {}
        arn = test_table_arn
        dynamodb_client.tables = {
            arn: Table(
                arn=test_table_arn,
                name=test_table_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_public_policy_with_condition_diff_account,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_service.DynamoDB",
                new=dynamodb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_client.dynamodb_client",
                new=dynamodb_client,
            ),
        ):
            from prowler.providers.aws.services.dynamodb.dynamodb_table_cross_account_access.dynamodb_table_cross_account_access import (
                dynamodb_table_cross_account_access,
            )

            check = dynamodb_table_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"DynamoDB table {test_table_name} has a resource-based policy allowing cross account access."
            )
            assert result[0].resource_id == test_table_name
            assert result[0].resource_arn == test_table_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_tables_public_with_condition_with_invalid_block(self):
        dynamodb_client = mock.MagicMock
        from prowler.providers.aws.services.dynamodb.dynamodb_service import Table

        dynamodb_client.audited_account = AWS_ACCOUNT_NUMBER
        dynamodb_client.audit_config = {}
        arn = test_table_arn
        dynamodb_client.tables = {
            arn: Table(
                arn=test_table_arn,
                name=test_table_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_public_policy_with_invalid_condition_block,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_service.DynamoDB",
                new=dynamodb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_client.dynamodb_client",
                new=dynamodb_client,
            ),
        ):
            from prowler.providers.aws.services.dynamodb.dynamodb_table_cross_account_access.dynamodb_table_cross_account_access import (
                dynamodb_table_cross_account_access,
            )

            check = dynamodb_table_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DynamoDB table {test_table_name} has a resource-based policy allowing cross account access."
            )
            assert result[0].resource_id == test_table_name
            assert result[0].resource_arn == test_table_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

````
