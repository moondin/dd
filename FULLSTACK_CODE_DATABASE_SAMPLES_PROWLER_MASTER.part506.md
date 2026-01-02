---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 506
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 506 of 867)

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

---[FILE: ec2_ebs_volume_encryption_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_ebs_volume_encryption/ec2_ebs_volume_encryption_test.py

```python
from unittest import mock

from boto3 import resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_ebs_volume_encryption:
    @mock_aws
    def test_ec2_no_volumes(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_volume_encryption.ec2_ebs_volume_encryption.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_volume_encryption.ec2_ebs_volume_encryption import (
                ec2_ebs_volume_encryption,
            )

            check = ec2_ebs_volume_encryption()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_ec2_unencrypted_volume(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        volume = ec2.create_volume(Size=80, AvailabilityZone=f"{AWS_REGION_US_EAST_1}a")

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_volume_encryption.ec2_ebs_volume_encryption.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_volume_encryption.ec2_ebs_volume_encryption import (
                ec2_ebs_volume_encryption,
            )

            check = ec2_ebs_volume_encryption()
            result = check.execute()

            assert len(result) == 1

            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            # Moto creates the volume with None in the tags attribute
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended == f"EBS Snapshot {volume.id} is unencrypted."
            )
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:volume/{volume.id}"
            )

    @mock_aws
    def test_ec2_encrypted_volume(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        volume = ec2.create_volume(
            Size=80, AvailabilityZone=f"{AWS_REGION_US_EAST_1}a", Encrypted=True
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_volume_encryption.ec2_ebs_volume_encryption.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_volume_encryption.ec2_ebs_volume_encryption import (
                ec2_ebs_volume_encryption,
            )

            check = ec2_ebs_volume_encryption()
            result = check.execute()

            assert len(result) == 1

            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            # Moto creates the volume with None in the tags attribute
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended == f"EBS Snapshot {volume.id} is encrypted."
            )
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:volume/{volume.id}"
            )
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_volume_protected_by_backup_plan_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_ebs_volume_protected_by_backup_plan/ec2_ebs_volume_protected_by_backup_plan_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_ebs_volume_protected_by_backup_plan:
    @mock_aws
    def test_ec2_no_volumes(self):
        from prowler.providers.aws.services.backup.backup_service import Backup
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.ec2_client",
                    new=EC2(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.backup_client",
                    new=Backup(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan import (
                    ec2_ebs_volume_protected_by_backup_plan,
                )

                check = ec2_ebs_volume_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_ec2_ebs_volume_no_backup_plans(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        volume = ec2_client.create_volume(
            AvailabilityZone="us-east-1a", Size=10, VolumeType="gp2"
        )

        from prowler.providers.aws.services.backup.backup_service import Backup
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.ec2_client",
                    new=EC2(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.backup_client",
                    new=Backup(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan import (
                    ec2_ebs_volume_protected_by_backup_plan,
                )

                check = ec2_ebs_volume_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"EBS Volume {volume['VolumeId']} is not protected by a backup plan."
                )
                assert result[0].resource_id == volume["VolumeId"]
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/{volume['VolumeId']}"
                )
                assert result[0].resource_tags is None

    @mock_aws
    def test_ec2_ebs_volume_without_backup_plan(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        backup_client = client("backup", region_name=AWS_REGION_US_EAST_1)
        volume = ec2_client.create_volume(
            AvailabilityZone="us-east-1a", Size=10, VolumeType="gp2"
        )
        backup_client.create_backup_plan(
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
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.ec2_client",
                    new=EC2(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.backup_client",
                    new=Backup(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan import (
                    ec2_ebs_volume_protected_by_backup_plan,
                )

                check = ec2_ebs_volume_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"EBS Volume {volume['VolumeId']} is not protected by a backup plan."
                )
                assert result[0].resource_id == volume["VolumeId"]
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/{volume['VolumeId']}"
                )
                assert result[0].resource_tags is None

    def test_ec2_instance_with_backup_plan(self):
        ec2_client = mock.MagicMock()
        from prowler.providers.aws.services.ec2.ec2_service import Volume

        ec2_client.volumes = [
            Volume(
                id="volume-tester",
                arn=f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/volume-tester",
                tags=None,
                region=AWS_REGION_US_EAST_1,
                encrypted=False,
            )
        ]

        backup_client = mock.MagicMock()
        backup_client.protected_resources = [
            f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/volume-tester"
        ]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.ec2_client",
                    new=ec2_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_client.ec2_client",
                    new=ec2_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.backup_client",
                    new=backup_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup_client,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan import (
                    ec2_ebs_volume_protected_by_backup_plan,
                )

                check = ec2_ebs_volume_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "EBS Volume volume-tester is protected by a backup plan."
                )
                assert result[0].resource_id == "volume-tester"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/volume-tester"
                )
                assert result[0].resource_tags is None

    def test_ec2_instance_with_backup_plan_via_volume_wildcard(self):
        ec2_client = mock.MagicMock()
        from prowler.providers.aws.services.ec2.ec2_service import Volume

        ec2_client.audited_partition = "aws"
        ec2_client.volumes = [
            Volume(
                id="volume-tester",
                arn=f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/volume-tester",
                tags=None,
                region=AWS_REGION_US_EAST_1,
                encrypted=False,
            )
        ]

        backup_client = mock.MagicMock()
        backup_client.protected_resources = ["arn:aws:ec2:*:*:volume/*"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.ec2_client",
                    new=ec2_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_client.ec2_client",
                    new=ec2_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.backup_client",
                    new=backup_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup_client,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan import (
                    ec2_ebs_volume_protected_by_backup_plan,
                )

                check = ec2_ebs_volume_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "EBS Volume volume-tester is protected by a backup plan."
                )
                assert result[0].resource_id == "volume-tester"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/volume-tester"
                )
                assert result[0].resource_tags is None

    def test_ec2_instance_with_backup_plan_via_all_wildcard(self):
        ec2_client = mock.MagicMock()
        from prowler.providers.aws.services.ec2.ec2_service import Volume

        ec2_client.volumes = [
            Volume(
                id="volume-tester",
                arn=f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/volume-tester",
                tags=None,
                region=AWS_REGION_US_EAST_1,
                encrypted=False,
            )
        ]

        backup_client = mock.MagicMock()
        backup_client.protected_resources = ["*"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.ec2_client",
                    new=ec2_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_client.ec2_client",
                    new=ec2_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan.backup_client",
                    new=backup_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup_client,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.ec2.ec2_ebs_volume_protected_by_backup_plan.ec2_ebs_volume_protected_by_backup_plan import (
                    ec2_ebs_volume_protected_by_backup_plan,
                )

                check = ec2_ebs_volume_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "EBS Volume volume-tester is protected by a backup plan."
                )
                assert result[0].resource_id == "volume-tester"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/volume-tester"
                )
                assert result[0].resource_tags is None
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_volume_snapshots_exists_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_ebs_volume_snapshots_exists/ec2_ebs_volume_snapshots_exists_test.py

```python
from unittest import mock

from boto3 import resource
from mock import patch
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    AWS_REGION_US_EAST_1_AZA,
    set_mocked_aws_provider,
)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_ec2_ebs_volume_snapshots_exists:
    @mock_aws
    def test_no_volumes(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_volume_snapshots_exists.ec2_ebs_volume_snapshots_exists.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_volume_snapshots_exists.ec2_ebs_volume_snapshots_exists import (
                ec2_ebs_volume_snapshots_exists,
            )

            check = ec2_ebs_volume_snapshots_exists()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_ec2_volume_without_snapshots(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        volume = ec2.create_volume(Size=80, AvailabilityZone=AWS_REGION_US_EAST_1_AZA)
        volume_arn = f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/{volume.id}"
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_volume_snapshots_exists.ec2_ebs_volume_snapshots_exists.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_volume_snapshots_exists.ec2_ebs_volume_snapshots_exists import (
                ec2_ebs_volume_snapshots_exists,
            )

            check = ec2_ebs_volume_snapshots_exists()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Snapshots not found for the EBS volume {volume.id}."
            )
            assert result[0].resource_id == volume.id
            assert result[0].resource_arn == volume_arn
            assert result[0].resource_tags is None
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_ec2_volume_with_snapshot(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        volume = ec2.create_volume(Size=80, AvailabilityZone=AWS_REGION_US_EAST_1_AZA)
        volume_arn = f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/{volume.id}"
        _ = volume.create_snapshot(Description="testsnap")

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_volume_snapshots_exists.ec2_ebs_volume_snapshots_exists.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_volume_snapshots_exists.ec2_ebs_volume_snapshots_exists import (
                ec2_ebs_volume_snapshots_exists,
            )

            check = ec2_ebs_volume_snapshots_exists()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Snapshots found for the EBS volume {result[0].resource_id}."
            )
            assert result[0].resource_id == volume.id
            assert result[0].resource_arn == volume_arn
            assert result[0].resource_tags is None
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_ec2_volume_with_and_without_snapshot(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)

        volume1 = ec2.create_volume(Size=80, AvailabilityZone=AWS_REGION_US_EAST_1_AZA)
        volume1_arn = f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/{volume1.id}"
        _ = volume1.create_snapshot(Description="test-snap")

        volume2 = ec2.create_volume(Size=80, AvailabilityZone=AWS_REGION_US_EAST_1_AZA)
        volume2_arn = f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume/{volume2.id}"

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_volume_snapshots_exists.ec2_ebs_volume_snapshots_exists.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_volume_snapshots_exists.ec2_ebs_volume_snapshots_exists import (
                ec2_ebs_volume_snapshots_exists,
            )

            check = ec2_ebs_volume_snapshots_exists()
            result = check.execute()

            assert len(result) == 2
            for res in result:
                if res.resource_id == volume1.id:
                    assert res.status == "PASS"
                    assert (
                        res.status_extended
                        == f"Snapshots found for the EBS volume {res.resource_id}."
                    )
                    assert res.resource_id == volume1.id
                    assert res.resource_arn == volume1_arn
                    assert res.resource_tags is None
                    assert res.region == AWS_REGION_US_EAST_1
                if res.resource_id == volume2.id:
                    assert res.status == "FAIL"
                    assert (
                        res.status_extended
                        == f"Snapshots not found for the EBS volume {res.resource_id}."
                    )
                    assert res.resource_id == volume2.id
                    assert res.resource_arn == volume2_arn
                    assert res.resource_tags is None
                    assert res.region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: ec2_elastic_ip_shodan_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_elastic_ip_shodan/ec2_elastic_ip_shodan_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"


class Test_ec2_elastic_ip_shodan:
    @mock_aws
    def test_ec2_one_instances_no_public_ip(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", AWS_REGION_US_EAST_1)
        # Create EC2 Instance
        ec2_client.run_instances(ImageId=EXAMPLE_AMI_ID, MinCount=1, MaxCount=1)

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            audit_config={"shodan_api_key": ""},
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_elastic_ip_shodan.ec2_elastic_ip_shodan.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_elastic_ip_shodan.ec2_elastic_ip_shodan import (
                ec2_elastic_ip_shodan,
            )

            check = ec2_elastic_ip_shodan()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_ec2_one_unattached_eip(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", AWS_REGION_US_EAST_1)
        # Create EC2 Instance
        ec2_client.allocate_address(Domain="vpc")

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            audit_config={"shodan_api_key": ""},
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_elastic_ip_shodan.ec2_elastic_ip_shodan.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_elastic_ip_shodan.ec2_elastic_ip_shodan import (
                ec2_elastic_ip_shodan,
            )

            check = ec2_elastic_ip_shodan()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_ec2_one_attached_eip_no_shodan_api_key(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", AWS_REGION_US_EAST_1)
        # Create EC2 Instance
        instance = ec2_client.run_instances(
            ImageId=EXAMPLE_AMI_ID, MinCount=1, MaxCount=1
        )
        allocation = ec2_client.allocate_address(Domain="vpc")
        ec2_client.associate_address(
            AllocationId=allocation["AllocationId"],
            InstanceId=instance["Instances"][0]["InstanceId"],
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            audit_config={"shodan_api_key": ""},
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_elastic_ip_shodan.ec2_elastic_ip_shodan.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_elastic_ip_shodan.ec2_elastic_ip_shodan import (
                ec2_elastic_ip_shodan,
            )

            check = ec2_elastic_ip_shodan()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_ec2_one_attached_eip_shodan_api_key(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", AWS_REGION_US_EAST_1)
        # Create EC2 Instance
        instance = ec2_client.run_instances(
            ImageId=EXAMPLE_AMI_ID, MinCount=1, MaxCount=1
        )
        allocation = ec2_client.allocate_address(Domain="vpc")
        public_ip = allocation["PublicIp"]
        allocation_id = allocation["AllocationId"]

        ec2_client.associate_address(
            AllocationId=allocation["AllocationId"],
            InstanceId=instance["Instances"][0]["InstanceId"],
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            audit_config={"shodan_api_key": "XXXXXXX"},
        )

        ports = ["22", "443"]
        isp = "test-isp"
        country = "france"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_elastic_ip_shodan.ec2_elastic_ip_shodan.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_elastic_ip_shodan.ec2_elastic_ip_shodan.shodan.Shodan.host",
                return_value={"ports": ports, "isp": isp, "country_name": country},
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_elastic_ip_shodan.ec2_elastic_ip_shodan import (
                ec2_elastic_ip_shodan,
            )

            check = ec2_elastic_ip_shodan()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == public_ip
            assert (
                result[0].resource_arn
                == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:eip-allocation/{allocation_id}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Elastic IP {public_ip} listed in Shodan with open ports {str(ports)} and ISP {isp} in {country}. More info at https://www.shodan.io/host/{public_ip}."
            )
```

--------------------------------------------------------------------------------

---[FILE: ec2_elastic_ip_unassigned_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_elastic_ip_unassigned/ec2_elastic_ip_unassigned_test.py

```python
from re import search
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"


class Test_ec2_elastic_ip_unassigned:
    @mock_aws
    def test_no_eips(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_elastic_ip_unassigned.ec2_elastic_ip_unassigned.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_elastic_ip_unassigned.ec2_elastic_ip_unassigned import (
                ec2_elastic_ip_unassigned,
            )

            check = ec2_elastic_ip_unassigned()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_eip_unassociated(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        allocation_id = ec2_client.allocate_address(
            Domain="vpc", Address="127.38.43.222"
        )["AllocationId"]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_elastic_ip_unassigned.ec2_elastic_ip_unassigned.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_elastic_ip_unassigned.ec2_elastic_ip_unassigned import (
                ec2_elastic_ip_unassigned,
            )

            check = ec2_elastic_ip_unassigned()
            results = check.execute()

            assert len(results) == 1
            assert results[0].status == "FAIL"
            assert results[0].region == AWS_REGION_US_EAST_1
            assert results[0].resource_tags == []
            assert search(
                "is not associated",
                results[0].status_extended,
            )
            assert (
                results[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:eip-allocation/{allocation_id}"
            )

    @mock_aws
    def test_eip_associated(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_US_EAST_1)

        reservation = ec2_client.run_instances(
            ImageId=EXAMPLE_AMI_ID, MinCount=1, MaxCount=1
        )
        instance = ec2_resource.Instance(reservation["Instances"][0]["InstanceId"])

        eip = ec2_client.allocate_address(Domain="vpc")

        eip = ec2_resource.VpcAddress(eip["AllocationId"])

        ec2_client.associate_address(
            InstanceId=instance.id, AllocationId=eip.allocation_id
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_elastic_ip_unassigned.ec2_elastic_ip_unassigned.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_elastic_ip_unassigned.ec2_elastic_ip_unassigned import (
                ec2_elastic_ip_unassigned,
            )

            check = ec2_elastic_ip_unassigned()
            results = check.execute()

            assert len(results) == 1
            assert results[0].status == "PASS"
            assert results[0].region == AWS_REGION_US_EAST_1
            assert results[0].resource_tags == []
            assert search(
                "is associated",
                results[0].status_extended,
            )
            assert (
                results[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:eip-allocation/{eip.allocation_id}"
            )
```

--------------------------------------------------------------------------------

````
