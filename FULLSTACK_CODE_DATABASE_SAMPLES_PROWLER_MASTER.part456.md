---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 456
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 456 of 867)

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

---[FILE: backup_recovery_point_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/backup/backup_recovery_point_encrypted/backup_recovery_point_encrypted_test.py

```python
from datetime import datetime
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_encrypted(self, operation_name, kwarg):
    if operation_name == "ListRecoveryPointsByBackupVault":
        return {
            "RecoveryPoints": [
                {
                    "RecoveryPointArn": "arn:aws:backup:eu-west-1:123456789012:recovery-point:1",
                    "BackupVaultName": "Test Vault",
                    "BackupVaultArn": "arn:aws:backup:eu-west-1:123456789012:backup-vault:Test Vault",
                    "BackupVaultRegion": "eu-west-1",
                    "CreationDate": datetime(2015, 1, 1),
                    "Status": "COMPLETED",
                    "EncryptionKeyArn": "",
                    "ResourceArn": "arn:aws:dynamodb:eu-west-1:123456789012:table/MyDynamoDBTable",
                    "ResourceType": "DynamoDB",
                    "BackupPlanId": "ID-TestBackupPlan",
                    "VersionId": "test_version_id",
                    "IsEncrypted": True,
                }
            ]
        }
    if operation_name == "ListBackupVaults":
        return {
            "BackupVaultList": [
                {
                    "BackupVaultArn": "ARN",
                    "BackupVaultName": "Test Vault",
                    "EncryptionKeyArn": "",
                    "NumberOfRecoveryPoints": 0,
                    "Locked": True,
                    "MinRetentionDays": 1,
                    "MaxRetentionDays": 2,
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_not_encrypted(self, operation_name, kwarg):
    if operation_name == "ListRecoveryPointsByBackupVault":
        return {
            "RecoveryPoints": [
                {
                    "RecoveryPointArn": "arn:aws:backup:eu-west-1:123456789012:recovery-point:1",
                    "BackupVaultName": "Test Vault",
                    "BackupVaultArn": "arn:aws:backup:eu-west-1:123456789012:backup-vault:Test Vault",
                    "BackupVaultRegion": "eu-west-1",
                    "CreationDate": datetime(2015, 1, 1),
                    "Status": "COMPLETED",
                    "EncryptionKeyArn": "",
                    "ResourceArn": "arn:aws:dynamodb:eu-west-1:123456789012:table/MyDynamoDBTable",
                    "ResourceType": "DynamoDB",
                    "BackupPlanId": "ID-TestBackupPlan",
                    "VersionId": "test_version_id",
                    "IsEncrypted": False,
                }
            ]
        }
    if operation_name == "ListBackupVaults":
        return {
            "BackupVaultList": [
                {
                    "BackupVaultArn": "ARN",
                    "BackupVaultName": "Test Vault",
                    "EncryptionKeyArn": "",
                    "NumberOfRecoveryPoints": 0,
                    "Locked": True,
                    "MinRetentionDays": 1,
                    "MaxRetentionDays": 2,
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


class Test_backup_recovery_point_encrypted:
    @mock_aws
    def test_no_backup_recovery_points(self):
        backup_client = client("backup", region_name=AWS_REGION_EU_WEST_1)
        backup_client.recovery_points = []

        from prowler.providers.aws.services.backup.backup_service import Backup

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_recovery_point_encrypted.backup_recovery_point_encrypted.backup_client",
                new=Backup(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_recovery_point_encrypted.backup_recovery_point_encrypted import (
                backup_recovery_point_encrypted,
            )

            check = backup_recovery_point_encrypted()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_backup_recovery_points_not_encrypted(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_not_encrypted,
        ):
            # backup_client = client("backup", region_name=AWS_REGION_EU_WEST_1)
            # backup_client.recovery_points = []

            from prowler.providers.aws.services.backup.backup_service import Backup

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_recovery_point_encrypted.backup_recovery_point_encrypted.backup_client",
                    new=Backup(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.backup.backup_recovery_point_encrypted.backup_recovery_point_encrypted import (
                    backup_recovery_point_encrypted,
                )

                check = backup_recovery_point_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].status_extended == (
                    "Backup Recovery Point 1 for Backup Vault Test Vault is not encrypted at rest."
                )
                assert result[0].resource_id == "1"
                assert (
                    result[0].resource_arn
                    == "arn:aws:backup:eu-west-1:123456789012:recovery-point:1"
                )
                assert result[0].resource_tags == []
                assert result[0].region == "eu-west-1"

    @mock_aws
    def test_backup_recovery_points_encrypted(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_encrypted,
        ):
            # backup_client = client("backup", region_name=AWS_REGION_EU_WEST_1)
            # backup_client.recovery_points = []

            from prowler.providers.aws.services.backup.backup_service import Backup

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_recovery_point_encrypted.backup_recovery_point_encrypted.backup_client",
                    new=Backup(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.backup.backup_recovery_point_encrypted.backup_recovery_point_encrypted import (
                    backup_recovery_point_encrypted,
                )

                check = backup_recovery_point_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].status_extended == (
                    "Backup Recovery Point 1 for Backup Vault Test Vault is encrypted at rest."
                )
                assert result[0].resource_id == "1"
                assert (
                    result[0].resource_arn
                    == "arn:aws:backup:eu-west-1:123456789012:recovery-point:1"
                )
                assert result[0].resource_tags == []
                assert result[0].region == "eu-west-1"
```

--------------------------------------------------------------------------------

---[FILE: backup_reportplans_exist_test.py]---
Location: prowler-master/tests/providers/aws/services/backup/backup_reportplans_exist/backup_reportplans_exist_test.py

```python
from datetime import datetime
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.backup.backup_service import (
    BackupPlan,
    BackupReportPlan,
)

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_backup_reportplans_exist:
    def test_no_backup_plans(self):
        backup_client = mock.MagicMock
        backup_client.region = AWS_REGION
        backup_client.backup_plans = []
        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_reportplans_exist.backup_reportplans_exist.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_reportplans_exist.backup_reportplans_exist import (
                backup_reportplans_exist,
            )

            check = backup_reportplans_exist()
            result = check.execute()

            assert len(result) == 0

    def test_no_backup_report_plans(self):
        backup_client = mock.MagicMock()
        backup_client.audited_account = AWS_ACCOUNT_NUMBER
        backup_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        backup_client.region = AWS_REGION
        backup_client.audited_partition = "aws"
        backup_client.report_plan_arn_template = f"arn:{backup_client.audited_partition}:backup:{backup_client.region}:{backup_client.audited_account}:report-plan"
        backup_client.__get_report_plan_arn_template__ = mock.MagicMock(
            return_value=backup_client.report_plan_arn_template
        )
        backup_plan_id = str(uuid4()).upper()
        backup_plan_arn = (
            f"arn:aws:backup:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:plan:{backup_plan_id}"
        )
        backup_client.backup_plans = [
            BackupPlan(
                arn=backup_plan_arn,
                id=backup_plan_arn,
                region=AWS_REGION,
                name="MyBackupPlan",
                version_id="version_id",
                last_execution_date=datetime(2015, 1, 1),
                advanced_settings=[],
            )
        ]
        backup_client.backup_report_plans = []
        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_reportplans_exist.backup_reportplans_exist.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_reportplans_exist.backup_reportplans_exist import (
                backup_reportplans_exist,
            )

            check = backup_reportplans_exist()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "No Backup Report Plan exist."
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:backup:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:report-plan"
            )
            assert result[0].region == AWS_REGION

    def test_one_backup_report_plan(self):
        backup_client = mock.MagicMock()
        backup_client.audited_account = AWS_ACCOUNT_NUMBER
        backup_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        backup_client.region = AWS_REGION
        backup_client.audited_partition = "aws"
        backup_client.report_plan_arn_template = f"arn:{backup_client.audited_partition}:backup:{backup_client.region}:{backup_client.audited_account}:report-plan"
        backup_client.__get_report_plan_arn_template__ = mock.MagicMock(
            return_value=backup_client.report_plan_arn_template
        )
        backup_plan_id = str(uuid4()).upper()
        backup_plan_arn = (
            f"arn:aws:backup:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:plan:{backup_plan_id}"
        )
        backup_client.backup_plans = [
            BackupPlan(
                arn=backup_plan_arn,
                id=backup_plan_id,
                region=AWS_REGION,
                name="MyBackupPlan",
                version_id="version_id",
                last_execution_date=datetime(2015, 1, 1),
                advanced_settings=[],
            )
        ]
        backup_report_plan_id = str(uuid4()).upper()
        backup_report_plan_arn = f"arn:aws:backup:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:report-plan:MyBackupReportPlan-{backup_report_plan_id}"
        backup_client.backup_report_plans = [
            BackupReportPlan(
                arn=backup_report_plan_arn,
                region=AWS_REGION,
                name="MyBackupReportPlan",
                last_attempted_execution_date=datetime(2015, 1, 1),
                last_successful_execution_date=datetime(2015, 1, 1),
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_reportplans_exist.backup_reportplans_exist.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_reportplans_exist.backup_reportplans_exist import (
                backup_reportplans_exist,
            )

            check = backup_reportplans_exist()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"At least one backup report plan exists: {result[0].resource_id}."
            )
            assert result[0].resource_id == "MyBackupReportPlan"
            assert result[0].resource_arn == backup_report_plan_arn
            assert result[0].region == AWS_REGION
```

--------------------------------------------------------------------------------

---[FILE: backup_vaults_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/backup/backup_vaults_encrypted/backup_vaults_encrypted_test.py

```python
from unittest import mock

from prowler.providers.aws.services.backup.backup_service import BackupVault

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "0123456789012"


class Test_backup_vaults_encrypted:
    def test_no_backup_vaults(self):
        backup_client = mock.MagicMock
        backup_client.backup_vaults = []
        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_vaults_encrypted.backup_vaults_encrypted.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_vaults_encrypted.backup_vaults_encrypted import (
                backup_vaults_encrypted,
            )

            check = backup_vaults_encrypted()
            result = check.execute()

            assert len(result) == 0

    def test_one_backup_vault_unencrypted(self):
        backup_client = mock.MagicMock
        backup_vault_arn = f"arn:aws:backup:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:backup-vault:MyBackupVault"
        backup_client.backup_vaults = [
            BackupVault(
                arn=backup_vault_arn,
                name="MyBackupVault",
                region=AWS_REGION,
                encryption="",
                recovery_points=1,
                locked=True,
                min_retention_days=1,
                max_retention_days=2,
                tags=[],
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_vaults_encrypted.backup_vaults_encrypted.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_vaults_encrypted.backup_vaults_encrypted import (
                backup_vaults_encrypted,
            )

            check = backup_vaults_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Backup Vault {result[0].resource_id} is not encrypted at rest."
            )
            assert result[0].resource_id == "MyBackupVault"
            assert result[0].resource_arn == backup_vault_arn
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    def test_one_backup_vault_encrypted(self):
        backup_client = mock.MagicMock
        backup_vault_arn = f"arn:aws:backup:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:backup-vault:MyBackupVault"
        backup_client.backup_vaults = [
            BackupVault(
                arn=backup_vault_arn,
                name="MyBackupVault",
                region=AWS_REGION,
                encryption="test",
                recovery_points=1,
                locked=True,
                min_retention_days=1,
                max_retention_days=2,
                tags=[],
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_vaults_encrypted.backup_vaults_encrypted.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_vaults_encrypted.backup_vaults_encrypted import (
                backup_vaults_encrypted,
            )

            check = backup_vaults_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Backup Vault {result[0].resource_id} is encrypted at rest."
            )
            assert result[0].resource_id == "MyBackupVault"
            assert result[0].resource_arn == backup_vault_arn
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: backup_vaults_exist_test.py]---
Location: prowler-master/tests/providers/aws/services/backup/backup_vaults_exist/backup_vaults_exist_test.py

```python
from unittest import mock

from prowler.providers.aws.services.backup.backup_service import BackupVault

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_backup_vaults_exist:
    def test_no_backup_vaults(self):
        backup_client = mock.MagicMock()
        backup_client.audited_account = AWS_ACCOUNT_NUMBER
        backup_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        backup_client.region = AWS_REGION
        backup_client.audited_partition = "aws"
        backup_client.backup_vault_arn_template = f"arn:{backup_client.audited_partition}:backup:{backup_client.region}:{backup_client.audited_account}:backup-vault"
        backup_client.__get_backup_vault_arn_template__ = mock.MagicMock(
            return_value=backup_client.backup_vault_arn_template
        )
        backup_client.backup_vaults = []
        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_vaults_exist.backup_vaults_exist.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_vaults_exist.backup_vaults_exist import (
                backup_vaults_exist,
            )

            check = backup_vaults_exist()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "No Backup Vault exist."
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:backup:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:backup-vault"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    def test_one_backup_vault(self):
        backup_client = mock.MagicMock()
        backup_client.audited_account = AWS_ACCOUNT_NUMBER
        backup_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        backup_client.region = AWS_REGION
        backup_client.audited_partition = "aws"
        backup_client.backup_vault_arn_template = f"arn:{backup_client.audited_partition}:backup:{backup_client.region}:{backup_client.audited_account}:backup-vault"
        backup_client.__get_backup_vault_arn_template__ = mock.MagicMock(
            return_value=backup_client.backup_vault_arn_template
        )
        backup_vault_arn = f"arn:aws:backup:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:backup-vault:MyBackupVault"
        backup_client.backup_vaults = [
            BackupVault(
                arn=backup_vault_arn,
                name="MyBackupVault",
                region=AWS_REGION,
                encryption="",
                recovery_points=1,
                locked=True,
                min_retention_days=1,
                max_retention_days=2,
                tags=[],
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_vaults_exist.backup_vaults_exist.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_vaults_exist.backup_vaults_exist import (
                backup_vaults_exist,
            )

            check = backup_vaults_exist()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"At least one backup vault exists: {result[0].resource_id}."
            )
            assert result[0].resource_id == "MyBackupVault"
            assert result[0].resource_arn == backup_vault_arn
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    def test_access_denied(self):
        backup_client = mock.MagicMock()
        backup_client.audited_account = AWS_ACCOUNT_NUMBER
        backup_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        backup_client.region = AWS_REGION
        backup_client.audited_partition = "aws"
        backup_client.backup_vault_arn_template = f"arn:{backup_client.audited_partition}:backup:{backup_client.region}:{backup_client.audited_account}:backup-vault"
        backup_client.__get_backup_vault_arn_template__ = mock.MagicMock(
            return_value=backup_client.backup_vault_arn_template
        )
        backup_client.backup_vaults = None
        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_vaults_exist.backup_vaults_exist.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_vaults_exist.backup_vaults_exist import (
                backup_vaults_exist,
            )

            check = backup_vaults_exist()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: bedrock_service_test.py]---
Location: prowler-master/tests/providers/aws/services/bedrock/bedrock_service_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock, BedrockAgent
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call

GUARDRAIL_ARN = (
    f"arn:aws:bedrock:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:guardrail/test-id"
)


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListGuardrails":
        return {
            "guardrails": [
                {
                    "id": "test-id",
                    "arn": GUARDRAIL_ARN,
                    "status": "READY",
                    "name": "test",
                }
            ]
        }
    elif operation_name == "GetGuardrail":
        return {
            "name": "test",
            "guardrailId": "test-id",
            "guardrailArn": GUARDRAIL_ARN,
            "status": "READY",
            "contentPolicy": {
                "filters": [
                    {
                        "type": "PROMPT_ATTACK",
                        "inputStrength": "HIGH",
                        "outputStrength": "NONE",
                    },
                ]
            },
            "sensitiveInformationPolicy": True,
            "blockedInputMessaging": "Sorry, the model cannot answer this question.",
            "blockedOutputsMessaging": "Sorry, the model cannot answer this question.",
        }
    elif operation_name == "ListTagsForResource":
        return {
            "tags": [
                {"Key": "Name", "Value": "test"},
            ]
        }
    return make_api_call(self, operation_name, kwarg)


class Test_Bedrock_Service:
    @mock_aws
    def test_service(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        bedrock = Bedrock(aws_provider)
        assert bedrock.service == "bedrock"

    @mock_aws
    def test_client(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        bedrock = Bedrock(aws_provider)
        for regional_client in bedrock.regional_clients.values():
            assert regional_client.__class__.__name__ == "Bedrock"

    @mock_aws
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        bedrock = Bedrock(aws_provider)
        assert bedrock.session.__class__.__name__ == "Session"

    @mock_aws
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        bedrock = Bedrock(aws_provider)
        assert bedrock.audited_account == AWS_ACCOUNT_NUMBER

    @mock_aws
    def test_get_model_invocation_logging_configuration(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        bedrock_client_eu_west_1 = client("bedrock", region_name="eu-west-1")
        logging_config = {
            "cloudWatchConfig": {
                "logGroupName": "Test",
                "roleArn": "testrole",
                "largeDataDeliveryS3Config": {
                    "bucketName": "testbucket",
                },
            },
            "s3Config": {
                "bucketName": "testconfigbucket",
            },
        }
        bedrock_client_eu_west_1.put_model_invocation_logging_configuration(
            loggingConfig=logging_config
        )
        bedrock = Bedrock(aws_provider)
        assert len(bedrock.logging_configurations) == 2
        assert bedrock.logging_configurations[AWS_REGION_EU_WEST_1].enabled
        assert (
            bedrock.logging_configurations[AWS_REGION_EU_WEST_1].cloudwatch_log_group
            == "Test"
        )
        assert (
            bedrock.logging_configurations[AWS_REGION_EU_WEST_1].s3_bucket
            == "testconfigbucket"
        )
        assert not bedrock.logging_configurations[AWS_REGION_US_EAST_1].enabled

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_list_guardrails(self):
        aws_provider = set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])
        bedrock = Bedrock(aws_provider)
        assert len(bedrock.guardrails) == 1
        assert GUARDRAIL_ARN in bedrock.guardrails
        assert bedrock.guardrails[GUARDRAIL_ARN].id == "test-id"
        assert bedrock.guardrails[GUARDRAIL_ARN].name == "test"
        assert bedrock.guardrails[GUARDRAIL_ARN].region == AWS_REGION_US_EAST_1

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_get_guardrail(self):
        aws_provider = set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])
        bedrock = Bedrock(aws_provider)
        assert bedrock.guardrails[GUARDRAIL_ARN].sensitive_information_filter
        assert bedrock.guardrails[GUARDRAIL_ARN].prompt_attack_filter_strength == "HIGH"

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_list_tags_for_resource(self):
        aws_provider = set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])
        bedrock = Bedrock(aws_provider)
        assert bedrock.guardrails[GUARDRAIL_ARN].tags == [
            {"Key": "Name", "Value": "test"}
        ]


class Test_Bedrock_Agent_Service:
    @mock_aws
    def test_service(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        bedrock_agent = BedrockAgent(aws_provider)
        assert bedrock_agent.service == "bedrock-agent"

    @mock_aws
    def test_client(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        bedrock_agent = BedrockAgent(aws_provider)
        for regional_client in bedrock_agent.regional_clients.values():
            assert regional_client.__class__.__name__ == "AgentsforBedrock"

    @mock_aws
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        bedrock_agent = BedrockAgent(aws_provider)
        assert bedrock_agent.session.__class__.__name__ == "Session"

    @mock_aws
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        bedrock_agent = BedrockAgent(aws_provider)
        assert bedrock_agent.audited_account == AWS_ACCOUNT_NUMBER

    @mock_aws
    def test_list_agents(self):
        bedrock_agent_client = client("bedrock-agent", region_name=AWS_REGION_US_EAST_1)
        agent = bedrock_agent_client.create_agent(
            agentName="agent_name",
            agentResourceRoleArn="test-agent-arn",
            tags={
                "Key": "test-tag-key",
            },
        )["agent"]
        agent_id = agent["agentId"]
        agent_arn = agent["agentArn"]
        agent_name = agent["agentName"]
        aws_provider = set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])
        bedrock_agent = BedrockAgent(aws_provider)
        assert len(bedrock_agent.agents) == 1
        assert bedrock_agent.agents[agent_arn].id == agent_id
        assert bedrock_agent.agents[agent_arn].name == agent_name
        assert bedrock_agent.agents[agent_arn].region == AWS_REGION_US_EAST_1
        assert bedrock_agent.agents[agent_arn].guardrail_id is None
        assert bedrock_agent.agents[agent_arn].tags == [
            {
                "Key": "test-tag-key",
            }
        ]
```

--------------------------------------------------------------------------------

---[FILE: bedrock_agent_guardrail_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/bedrock/bedrock_agent_guardrail_enabled/bedrock_agent_guardrail_enabled_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_no_guardrail(self, operation_name, kwarg):
    if operation_name == "ListAgents":
        return {
            "agentSummaries": [
                {
                    "agentId": "test-agent-id",
                    "agentName": "test-agent-name",
                    "guardrailConfiguration": {
                        "guardrailIdentifier": "test-guardrail-id",
                        "guardrailVersion": "test-guardrail-version",
                    },
                },
            ],
        }
    return make_api_call(self, operation_name, kwarg)


class Test_bedrock_agent_guardrail_enabled:
    @mock_aws
    def test_no_agents(self):
        from prowler.providers.aws.services.bedrock.bedrock_service import BedrockAgent

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_agent_guardrail_enabled.bedrock_agent_guardrail_enabled.bedrock_agent_client",
                new=BedrockAgent(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_agent_guardrail_enabled.bedrock_agent_guardrail_enabled import (
                bedrock_agent_guardrail_enabled,
            )

            check = bedrock_agent_guardrail_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_agent_without_guardrail(self):
        bedrock_agent_client = client("bedrock-agent", region_name=AWS_REGION_US_EAST_1)
        agent = bedrock_agent_client.create_agent(
            agentName="agent_name",
            agentResourceRoleArn="test-agent-arn",
            tags={
                "Key": "test-tag-key",
            },
        )["agent"]
        agent_id = agent["agentId"]
        agent_arn = agent["agentArn"]
        agent_name = agent["agentName"]
        from prowler.providers.aws.services.bedrock.bedrock_service import BedrockAgent

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_agent_guardrail_enabled.bedrock_agent_guardrail_enabled.bedrock_agent_client",
                new=BedrockAgent(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_agent_guardrail_enabled.bedrock_agent_guardrail_enabled import (
                bedrock_agent_guardrail_enabled,
            )

            check = bedrock_agent_guardrail_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Bedrock Agent {agent_name} is not using any guardrail to protect agent sessions."
            )
            assert result[0].resource_id == agent_id
            assert result[0].resource_arn == agent_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "test-tag-key"}]

    @mock.patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_no_guardrail
    )
    @mock_aws
    def test_agent_with_guardrail(self):
        from prowler.providers.aws.services.bedrock.bedrock_service import BedrockAgent

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_agent_guardrail_enabled.bedrock_agent_guardrail_enabled.bedrock_agent_client",
                new=BedrockAgent(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_agent_guardrail_enabled.bedrock_agent_guardrail_enabled import (
                bedrock_agent_guardrail_enabled,
            )

            check = bedrock_agent_guardrail_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Bedrock Agent test-agent-name is using guardrail test-guardrail-id to protect agent sessions."
            )
            assert result[0].resource_id == "test-agent-id"
            assert (
                result[0].resource_arn
                == f"arn:aws:bedrock:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:agent/test-agent-id"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
