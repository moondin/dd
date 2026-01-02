---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 503
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 503 of 867)

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

---[FILE: dynamodb_table_deletion_protection_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dynamodb/dynamodb_table_deletion_protection_enabled/dynamodb_table_deletion_protection_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_dynamodb_table_deletion_protection_enabled:
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
                "prowler.providers.aws.services.dynamodb.dynamodb_table_deletion_protection_enabled.dynamodb_table_deletion_protection_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_table_deletion_protection_enabled.dynamodb_table_deletion_protection_enabled import (
                dynamodb_table_deletion_protection_enabled,
            )

            check = dynamodb_table_deletion_protection_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_dynamodb_table_with_deletion_protection_enabled(self):
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
            DeletionProtectionEnabled=True,
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
                "prowler.providers.aws.services.dynamodb.dynamodb_table_deletion_protection_enabled.dynamodb_table_deletion_protection_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_table_deletion_protection_enabled.dynamodb_table_deletion_protection_enabled import (
                dynamodb_table_deletion_protection_enabled,
            )

            check = dynamodb_table_deletion_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "DynamoDB table test1 has deletion protection enabled."
            )
            assert result[0].resource_id == table["TableName"]
            assert result[0].resource_arn == table["TableArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_dynamodb_table_without_deletion_protection_enabled(self):
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
            DeletionProtectionEnabled=False,
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
                "prowler.providers.aws.services.dynamodb.dynamodb_table_deletion_protection_enabled.dynamodb_table_deletion_protection_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_table_deletion_protection_enabled.dynamodb_table_deletion_protection_enabled import (
                dynamodb_table_deletion_protection_enabled,
            )

            check = dynamodb_table_deletion_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DynamoDB table test1 does not have deletion protection enabled."
            )
            assert result[0].resource_id == table["TableName"]
            assert result[0].resource_arn == table["TableArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_table_protected_by_backup_plan_test.py]---
Location: prowler-master/tests/providers/aws/services/dynamodb/dynamodb_table_protected_by_backup_plan/dynamodb_table_protected_by_backup_plan_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_dynamodb_table_protected_by_backup_plan:
    @mock_aws
    def test_dynamodb_no_tables(self):
        from prowler.providers.aws.services.backup.backup_service import Backup
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.dynamodb_client",
                    new=DynamoDB(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.backup_client",
                    new=Backup(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan import (
                    dynamodb_table_protected_by_backup_plan,
                )

                check = dynamodb_table_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_dynamodb_table_no_existing_backup_plans(self):
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
            DeletionProtectionEnabled=True,
            BillingMode="PAY_PER_REQUEST",
        )["TableDescription"]

        from prowler.providers.aws.services.backup.backup_service import Backup
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.dynamodb_client",
                    new=DynamoDB(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.backup_client",
                    new=Backup(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan import (
                    dynamodb_table_protected_by_backup_plan,
                )

                check = dynamodb_table_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "DynamoDB table test1 is not protected by a backup plan."
                )
                assert result[0].resource_id == table["TableName"]
                assert result[0].resource_arn == table["TableArn"]
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == []

    @mock_aws
    def test_dynamodb_table_without_backup_plan(self):
        backup = client("backup", region_name=AWS_REGION_US_EAST_1)
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
            DeletionProtectionEnabled=True,
            BillingMode="PAY_PER_REQUEST",
        )["TableDescription"]

        backup.create_backup_plan(
            BackupPlan={
                "BackupPlanName": "test-backup-plan",
                "Rules": [
                    {
                        "RuleName": "DailyBackup",
                        "TargetBackupVaultName": "test-vault",
                        "ScheduleExpression": "cron(0 12 * * ? *)",
                        "Lifecycle": {"DeleteAfterDays": 30},
                        "RecoveryPointTags": {
                            "Type": "Daily",
                        },
                    },
                ],
            }
        )

        from prowler.providers.aws.services.backup.backup_service import Backup
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.dynamodb_client",
                    new=DynamoDB(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.backup_client",
                    new=Backup(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan import (
                    dynamodb_table_protected_by_backup_plan,
                )

                check = dynamodb_table_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "DynamoDB table test1 is not protected by a backup plan."
                )
                assert result[0].resource_id == table["TableName"]
                assert result[0].resource_arn == table["TableArn"]
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == []

    def test_dynamodb_table_with_backup_plan(self):
        dynamodb_client = mock.MagicMock()
        from prowler.providers.aws.services.dynamodb.dynamodb_service import Table

        dynamodb_client.tables = {
            f"arn:aws:dynamodb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:table/test1": Table(
                arn=f"arn:aws:dynamodb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:table/test1",
                name="test1",
                region=AWS_REGION_US_EAST_1,
            )
        }

        backup = mock.MagicMock()
        backup.protected_resources = [
            f"arn:aws:dynamodb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:table/test1"
        ]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.dynamodb_client",
                    new=dynamodb_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_client.dynamodb_client",
                    new=dynamodb_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan import (
                    dynamodb_table_protected_by_backup_plan,
                )

                check = dynamodb_table_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "DynamoDB table test1 is protected by a backup plan."
                )
                assert result[0].resource_id == "test1"
                assert (
                    result[0].resource_arn
                    == f"arn:aws:dynamodb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:table/test1"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == []

    def test_dynamodb_table_with_backup_plan_via_wildcard_all_tables(self):
        dynamodb_client = mock.MagicMock()
        from prowler.providers.aws.services.dynamodb.dynamodb_service import Table

        dynamodb_client.audited_partition = "aws"
        dynamodb_client.tables = {
            f"arn:aws:dynamodb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:table/test1": Table(
                arn=f"arn:aws:dynamodb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:table/test1",
                name="test1",
                region=AWS_REGION_US_EAST_1,
            )
        }

        backup = mock.MagicMock()
        backup.protected_resources = ["arn:aws:dynamodb:*:*:table/*"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.dynamodb_client",
                    new=dynamodb_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_client.dynamodb_client",
                    new=dynamodb_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan import (
                    dynamodb_table_protected_by_backup_plan,
                )

                check = dynamodb_table_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "DynamoDB table test1 is protected by a backup plan."
                )
                assert result[0].resource_id == "test1"
                assert (
                    result[0].resource_arn
                    == f"arn:aws:dynamodb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:table/test1"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == []

    def test_dynamodb_table_with_backup_plan_via_wildcard_all_resources(self):
        dynamodb_client = mock.MagicMock()
        from prowler.providers.aws.services.dynamodb.dynamodb_service import Table

        dynamodb_client.tables = {
            f"arn:aws:dynamodb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:table/test1": Table(
                arn=f"arn:aws:dynamodb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:table/test1",
                name="test1",
                region=AWS_REGION_US_EAST_1,
            )
        }

        backup = mock.MagicMock()
        backup.protected_resources = ["*"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.dynamodb_client",
                    new=dynamodb_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_client.dynamodb_client",
                    new=dynamodb_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dynamodb.dynamodb_table_protected_by_backup_plan.dynamodb_table_protected_by_backup_plan import (
                    dynamodb_table_protected_by_backup_plan,
                )

                check = dynamodb_table_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "DynamoDB table test1 is protected by a backup plan."
                )
                assert result[0].resource_id == "test1"
                assert (
                    result[0].resource_arn
                    == f"arn:aws:dynamodb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:table/test1"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
