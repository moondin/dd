---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 619
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 619 of 867)

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

---[FILE: s3_bucket_event_notifications_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/s3/s3_bucket_event_notifications_enabled/s3_bucket_event_notifications_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_s3_bucket_event_notifications_enabled:
    # No Buckets
    @mock_aws
    def test_no_buckets(self):
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_event_notifications_enabled.s3_bucket_event_notifications_enabled.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_event_notifications_enabled.s3_bucket_event_notifications_enabled import (
                    s3_bucket_event_notifications_enabled,
                )

                check = s3_bucket_event_notifications_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_bucket_event_notifications_disabled(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name = "test-bucket"
        s3_client.create_bucket(
            Bucket=bucket_name, ObjectOwnership="BucketOwnerEnforced"
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_event_notifications_enabled.s3_bucket_event_notifications_enabled.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_event_notifications_enabled.s3_bucket_event_notifications_enabled import (
                    s3_bucket_event_notifications_enabled,
                )

                check = s3_bucket_event_notifications_enabled()
                result = check.execute()

                assert len(result) == 1

                # US-EAST-1 Source Bucket
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name} does not have event notifications enabled."
                )
                assert result[0].resource_id == bucket_name
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_event_notifications_enabled(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name = "test-bucket"
        s3_client.create_bucket(
            Bucket=bucket_name, ObjectOwnership="BucketOwnerEnforced"
        )

        s3_client.put_bucket_notification_configuration(
            Bucket=bucket_name,
            NotificationConfiguration={
                "LambdaFunctionConfigurations": [
                    {
                        "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:my-function",
                        "Events": ["s3:ObjectCreated:*"],
                    }
                ],
                "QueueConfigurations": [
                    {
                        "QueueArn": "arn:aws:sqs:us-east-1:123456789012:my-queue",
                        "Events": ["s3:ObjectCreated:*"],
                    }
                ],
                "TopicConfigurations": [
                    {
                        "TopicArn": "arn:aws:sns:us-east-1:123456789012:my-topic",
                        "Events": ["s3:ObjectCreated:*"],
                    }
                ],
            },
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_event_notifications_enabled.s3_bucket_event_notifications_enabled.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_event_notifications_enabled.s3_bucket_event_notifications_enabled import (
                    s3_bucket_event_notifications_enabled,
                )

                check = s3_bucket_event_notifications_enabled()
                result = check.execute()

                assert len(result) == 1

                # US-EAST-1 Source Bucket
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name} does have event notifications enabled."
                )
                assert result[0].resource_id == bucket_name
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_kms_encryption_test.py]---
Location: prowler-master/tests/providers/aws/services/s3/s3_bucket_kms_encryption/s3_bucket_kms_encryption_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_s3_bucket_kms_encryption:
    @mock_aws
    def test_no_buckets(self):
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_kms_encryption.s3_bucket_kms_encryption.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.s3.s3_bucket_kms_encryption.s3_bucket_kms_encryption import (
                s3_bucket_kms_encryption,
            )

            check = s3_bucket_kms_encryption()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_bucket_no_encryption(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_kms_encryption.s3_bucket_kms_encryption.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.s3.s3_bucket_kms_encryption.s3_bucket_kms_encryption import (
                s3_bucket_kms_encryption,
            )

            check = s3_bucket_kms_encryption()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Server Side Encryption is not configured with kms for S3 Bucket {bucket_name_us}."
            )
            assert result[0].resource_id == bucket_name_us
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_no_kms_encryption(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_us, ObjectOwnership="BucketOwnerEnforced"
        )
        sse_config = {
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256",
                    }
                }
            ]
        }

        s3_client_us_east_1.put_bucket_encryption(
            Bucket=bucket_name_us, ServerSideEncryptionConfiguration=sse_config
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_kms_encryption.s3_bucket_kms_encryption.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.s3.s3_bucket_kms_encryption.s3_bucket_kms_encryption import (
                s3_bucket_kms_encryption,
            )

            check = s3_bucket_kms_encryption()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Server Side Encryption is not configured with kms for S3 Bucket {bucket_name_us}."
            )
            assert result[0].resource_id == bucket_name_us
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_kms_encryption(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_us, ObjectOwnership="BucketOwnerEnforced"
        )
        kms_encryption = "aws:kms"
        sse_config = {
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": f"{kms_encryption}",
                        "KMSMasterKeyID": "12345678",
                    }
                }
            ]
        }

        s3_client_us_east_1.put_bucket_encryption(
            Bucket=bucket_name_us, ServerSideEncryptionConfiguration=sse_config
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_kms_encryption.s3_bucket_kms_encryption.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_kms_encryption.s3_bucket_kms_encryption import (
                    s3_bucket_kms_encryption,
                )

                check = s3_bucket_kms_encryption()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} has Server Side Encryption with {kms_encryption}."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_kms_dsse_encryption(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_us, ObjectOwnership="BucketOwnerEnforced"
        )
        kms_encryption = "aws:kms:dsse"
        sse_config = {
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": f"{kms_encryption}",
                        "KMSMasterKeyID": "12345678",
                    }
                }
            ]
        }

        s3_client_us_east_1.put_bucket_encryption(
            Bucket=bucket_name_us, ServerSideEncryptionConfiguration=sse_config
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_kms_encryption.s3_bucket_kms_encryption.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_kms_encryption.s3_bucket_kms_encryption import (
                    s3_bucket_kms_encryption,
                )

                check = s3_bucket_kms_encryption()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} has Server Side Encryption with {kms_encryption}."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_level_public_access_block_test.py]---
Location: prowler-master/tests/providers/aws/services/s3/s3_bucket_level_public_access_block/s3_bucket_level_public_access_block_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_s3_bucket_level_public_access_block:
    @mock_aws
    def test_no_buckets(self):
        from prowler.providers.aws.services.s3.s3_service import S3, S3Control

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block.s3_client",
                new=S3(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block.s3control_client",
                    new=S3Control(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block import (
                        s3_bucket_level_public_access_block,
                    )

                    check = s3_bucket_level_public_access_block()
                    result = check.execute()

                    assert len(result) == 0

    @mock_aws
    def test_bucket_without_public_block(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client.create_bucket(Bucket=bucket_name_us)
        s3_client.put_public_access_block(
            Bucket=bucket_name_us,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": False,
                "IgnorePublicAcls": False,
                "BlockPublicPolicy": False,
                "RestrictPublicBuckets": False,
            },
        )
        s3control_client = client("s3control", region_name=AWS_REGION_US_EAST_1)
        s3control_client.put_public_access_block(
            AccountId=AWS_ACCOUNT_NUMBER,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": False,
                "IgnorePublicAcls": False,
                "BlockPublicPolicy": False,
                "RestrictPublicBuckets": False,
            },
        )
        from prowler.providers.aws.services.s3.s3_service import S3, S3Control

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block.s3_client",
                new=S3(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block.s3control_client",
                    new=S3Control(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block import (
                        s3_bucket_level_public_access_block,
                    )

                    check = s3_bucket_level_public_access_block()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "FAIL"
                    assert (
                        result[0].status_extended
                        == f"Block Public Access is not configured for the S3 Bucket {bucket_name_us}."
                    )
                    assert result[0].resource_id == bucket_name_us
                    assert (
                        result[0].resource_arn
                        == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                    )
                    assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_public_block(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client.create_bucket(Bucket=bucket_name_us)
        s3_client.put_public_access_block(
            Bucket=bucket_name_us,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": True,
                "IgnorePublicAcls": True,
                "BlockPublicPolicy": True,
                "RestrictPublicBuckets": True,
            },
        )
        s3control_client = client("s3control", region_name=AWS_REGION_US_EAST_1)
        s3control_client.put_public_access_block(
            AccountId=AWS_ACCOUNT_NUMBER,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": False,
                "IgnorePublicAcls": False,
                "BlockPublicPolicy": False,
                "RestrictPublicBuckets": False,
            },
        )
        from prowler.providers.aws.services.s3.s3_service import S3, S3Control

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block.s3_client",
                new=S3(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block.s3control_client",
                    new=S3Control(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block import (
                        s3_bucket_level_public_access_block,
                    )

                    check = s3_bucket_level_public_access_block()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "PASS"
                    assert (
                        result[0].status_extended
                        == f"Block Public Access is configured for the S3 Bucket {bucket_name_us}."
                    )

                    assert result[0].resource_id == bucket_name_us
                    assert (
                        result[0].resource_arn
                        == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                    )
                    assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_public_block_at_account(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client.create_bucket(Bucket=bucket_name_us)
        s3_client.put_public_access_block(
            Bucket=bucket_name_us,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": False,
                "IgnorePublicAcls": False,
                "BlockPublicPolicy": False,
                "RestrictPublicBuckets": False,
            },
        )
        s3control_client = client("s3control", region_name=AWS_REGION_US_EAST_1)
        s3control_client.put_public_access_block(
            AccountId=AWS_ACCOUNT_NUMBER,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": True,
                "IgnorePublicAcls": True,
                "BlockPublicPolicy": True,
                "RestrictPublicBuckets": True,
            },
        )
        from prowler.providers.aws.services.s3.s3_service import S3, S3Control

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block.s3_client",
                new=S3(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block.s3control_client",
                    new=S3Control(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block import (
                        s3_bucket_level_public_access_block,
                    )

                    check = s3_bucket_level_public_access_block()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "PASS"
                    assert (
                        result[0].status_extended
                        == f"Block Public Access is configured for the S3 Bucket {bucket_name_us} at account {AWS_ACCOUNT_NUMBER} level."
                    )

                    assert result[0].resource_id == bucket_name_us
                    assert (
                        result[0].resource_arn
                        == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                    )
                    assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_can_not_retrieve_public_access_block(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        bucket_arn = f"arn:aws:s3:::{bucket_name_us}"
        s3_client.create_bucket(Bucket=bucket_name_us)
        s3_client.put_public_access_block(
            Bucket=bucket_name_us,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": True,
                "IgnorePublicAcls": True,
                "BlockPublicPolicy": True,
                "RestrictPublicBuckets": True,
            },
        )
        s3control_client = client("s3control", region_name=AWS_REGION_US_EAST_1)
        s3control_client.put_public_access_block(
            AccountId=AWS_ACCOUNT_NUMBER,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": False,
                "IgnorePublicAcls": False,
                "BlockPublicPolicy": False,
                "RestrictPublicBuckets": False,
            },
        )
        from prowler.providers.aws.services.s3.s3_service import S3, S3Control

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            # To test this behaviour we need to set public_access_block to None
            s3 = S3(aws_provider)
            s3.buckets[bucket_arn].public_access_block = None

            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block.s3_client",
                new=s3,
            ):
                with mock.patch(
                    "prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block.s3control_client",
                    new=S3Control(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.s3.s3_bucket_level_public_access_block.s3_bucket_level_public_access_block import (
                        s3_bucket_level_public_access_block,
                    )

                    check = s3_bucket_level_public_access_block()
                    result = check.execute()

                    assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_lifecycle_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/s3/s3_bucket_lifecycle_enabled/s3_bucket_lifecycle_enabled_test.py

```python
from unittest import mock
from unittest.mock import patch

from moto import mock_aws

from prowler.providers.aws.services.s3.s3_service import S3, Bucket, LifeCycleRule
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_s3_bucket_lifecycle_enabled:
    @mock_aws
    def test_no_buckets(self):
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_no_mfa_delete.s3_bucket_no_mfa_delete.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_no_mfa_delete.s3_bucket_no_mfa_delete import (
                    s3_bucket_no_mfa_delete,
                )

                check = s3_bucket_no_mfa_delete()
                result = check.execute()

                assert len(result) == 0

    def test_no_lifecycle_configuration(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_lifecycle_enabled.s3_bucket_lifecycle_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.s3.s3_bucket_lifecycle_enabled.s3_bucket_lifecycle_enabled import (
                s3_bucket_lifecycle_enabled,
            )

            bucket_name = "bucket-test"
            bucket_arn = f"arn:aws:s3::{AWS_ACCOUNT_NUMBER}:{bucket_name}"
            s3_client = mock.MagicMock()
            s3_client.buckets = {
                bucket_arn: Bucket(
                    arn=bucket_arn,
                    name=bucket_name,
                    region=AWS_REGION_US_EAST_1,
                )
            }

            with patch(
                "prowler.providers.aws.services.s3.s3_bucket_lifecycle_enabled.s3_bucket_lifecycle_enabled.s3_client",
                s3_client,
            ):
                check = s3_bucket_lifecycle_enabled()
                result = check.execute()

                # ALL REGIONS
                assert len(result) == 1

                # AWS_REGION_US_EAST_1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name} does not have a lifecycle configuration enabled."
                )
                assert result[0].resource_id == bucket_name
                assert result[0].resource_arn == bucket_arn
                assert result[0].region == AWS_REGION_US_EAST_1

    def test_one_valid_lifecycle_configuration(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_lifecycle_enabled.s3_bucket_lifecycle_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.s3.s3_bucket_lifecycle_enabled.s3_bucket_lifecycle_enabled import (
                s3_bucket_lifecycle_enabled,
            )

            s3_client = mock.MagicMock()
            bucket_name = "bucket-test"
            bucket_arn = f"arn:aws:s3::{AWS_ACCOUNT_NUMBER}:{bucket_name}"
            s3_client.buckets = {
                bucket_arn: Bucket(
                    arn=bucket_arn,
                    name=bucket_name,
                    region=AWS_REGION_US_EAST_1,
                    lifecycle=[
                        LifeCycleRule(
                            id="test-rule-1",
                            status="Enabled",
                        ),
                    ],
                )
            }

            with patch(
                "prowler.providers.aws.services.s3.s3_bucket_lifecycle_enabled.s3_bucket_lifecycle_enabled.s3_client",
                s3_client,
            ):
                check = s3_bucket_lifecycle_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name} has a lifecycle configuration enabled."
                )
                assert result[0].resource_id == bucket_name
                assert result[0].resource_arn == bucket_arn
                assert result[0].region == AWS_REGION_US_EAST_1

    def test_several_lifecycle_configurations(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_lifecycle_enabled.s3_bucket_lifecycle_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.s3.s3_bucket_lifecycle_enabled.s3_bucket_lifecycle_enabled import (
                s3_bucket_lifecycle_enabled,
            )

            s3_client = mock.MagicMock()
            bucket_name = "bucket-test"
            bucket_arn = f"arn:aws:s3::{AWS_ACCOUNT_NUMBER}:{bucket_name}"
            s3_client.buckets = {
                bucket_arn: Bucket(
                    arn=bucket_arn,
                    name=bucket_name,
                    region=AWS_REGION_US_EAST_1,
                    lifecycle=[
                        LifeCycleRule(
                            id="test-rule-1",
                            status="Disabled",
                        ),
                        LifeCycleRule(
                            id="test-rule-2",
                            status="Enabled",
                        ),
                    ],
                )
            }

            with patch(
                "prowler.providers.aws.services.s3.s3_bucket_lifecycle_enabled.s3_bucket_lifecycle_enabled.s3_client",
                s3_client,
            ):
                check = s3_bucket_lifecycle_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name} has a lifecycle configuration enabled."
                )
                assert result[0].resource_id == bucket_name
                assert result[0].resource_arn == bucket_arn
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_no_mfa_delete_test.py]---
Location: prowler-master/tests/providers/aws/services/s3/s3_bucket_no_mfa_delete/s3_bucket_no_mfa_delete_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_s3_bucket_no_mfa_delete:
    @mock_aws
    def test_no_buckets(self):
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_no_mfa_delete.s3_bucket_no_mfa_delete.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_no_mfa_delete.s3_bucket_no_mfa_delete import (
                    s3_bucket_no_mfa_delete,
                )

                check = s3_bucket_no_mfa_delete()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_bucket_without_mfa(self):
        s3_client_us_east_1 = client("s3", region_name="us-east-1")
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_no_mfa_delete.s3_bucket_no_mfa_delete.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_no_mfa_delete.s3_bucket_no_mfa_delete import (
                    s3_bucket_no_mfa_delete,
                )

                check = s3_bucket_no_mfa_delete()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} has MFA Delete disabled."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )

    @mock_aws
    def test_bucket_with_mfa(self):
        s3_client_us_east_1 = client("s3", region_name="us-east-1")
        bucket_name_us = "bucket_test_us"
        bucket_arn = f"arn:aws:s3:::{bucket_name_us}"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        s3_client_us_east_1.put_bucket_versioning(
            Bucket=bucket_name_us,
            VersioningConfiguration={"MFADelete": "Enabled", "Status": "Enabled"},
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_no_mfa_delete.s3_bucket_no_mfa_delete.s3_client",
                new=S3(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_no_mfa_delete.s3_bucket_no_mfa_delete import (
                    s3_bucket_no_mfa_delete,
                )

                service_client.buckets[bucket_arn].mfa_delete = True
                check = s3_bucket_no_mfa_delete()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} has MFA Delete enabled."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
```

--------------------------------------------------------------------------------

````
