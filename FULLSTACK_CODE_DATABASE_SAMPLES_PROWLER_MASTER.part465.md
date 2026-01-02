---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 465
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 465 of 867)

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

---[FILE: cloudtrail_logs_s3_bucket_access_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_logs_s3_bucket_access_logging_enabled/cloudtrail_logs_s3_bucket_access_logging_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_cloudtrail_logs_s3_bucket_access_logging_enabled:
    @mock_aws
    def test_no_trails(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled import (
                cloudtrail_logs_s3_bucket_access_logging_enabled,
            )

            check = cloudtrail_logs_s3_bucket_access_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_bucket_not_logging(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled import (
                cloudtrail_logs_s3_bucket_access_logging_enabled,
            )

            check = cloudtrail_logs_s3_bucket_access_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Single region Trail {trail_name_us} S3 bucket access logging is not enabled for bucket {bucket_name_us}."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_logging(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        logging_bucket = "logging"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_us,
        )
        s3_client_us_east_1.create_bucket(
            Bucket=logging_bucket,
        )
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )
        s3_client_us_east_1.put_bucket_acl(
            Bucket=logging_bucket,
            GrantWrite="uri=http://acs.amazonaws.com/groups/s3/LogDelivery",
            GrantReadACP="uri=http://acs.amazonaws.com/groups/s3/LogDelivery",
        )
        s3_client_us_east_1.put_bucket_logging(
            Bucket=bucket_name_us,
            BucketLoggingStatus={
                "LoggingEnabled": {
                    "TargetBucket": logging_bucket,
                    "TargetPrefix": logging_bucket,
                }
            },
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled import (
                cloudtrail_logs_s3_bucket_access_logging_enabled,
            )

            check = cloudtrail_logs_s3_bucket_access_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Single region Trail {trail_name_us} S3 bucket access logging is enabled for bucket {bucket_name_us}."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_cross_account(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.s3_client",
                new=S3(aws_provider),
            ) as s3_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled import (
                cloudtrail_logs_s3_bucket_access_logging_enabled,
            )

            # Empty s3 buckets to simulate the bucket is in another account
            s3_client.buckets = {}

            check = cloudtrail_logs_s3_bucket_access_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "MANUAL"
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} is delivering logs to bucket {bucket_name_us} which is a cross-account bucket or out of Prowler's audit scope, please check it manually."
            )

            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_access_denied(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ) as cloudtrail_client,
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.s3_client",
                new=S3(aws_provider),
            ) as s3_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled import (
                cloudtrail_logs_s3_bucket_access_logging_enabled,
            )

            cloudtrail_client.trails = None
            s3_client.buckets = {}

            check = cloudtrail_logs_s3_bucket_access_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_trail_multi_region_auditing_other_region(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)

        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"

        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)

        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=True
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_access_logging_enabled.cloudtrail_logs_s3_bucket_access_logging_enabled import (
                cloudtrail_logs_s3_bucket_access_logging_enabled,
            )

            check = cloudtrail_logs_s3_bucket_access_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            # This is MANUAL since S3 bucket is in another region not audited
            assert result[0].status == "MANUAL"
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} is delivering logs to bucket {bucket_name_us} which is a cross-account bucket or out of Prowler's audit scope, please check it manually."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_logs_s3_bucket_is_not_publicly_accessible_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_logs_s3_bucket_is_not_publicly_accessible/cloudtrail_logs_s3_bucket_is_not_publicly_accessible_fixer_test.py

```python
from unittest import mock

import botocore
import botocore.client
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

mock_make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_error(self, operation_name, kwarg):
    if operation_name == "PutPublicAccessBlock":
        raise botocore.exceptions.ClientError(
            {
                "Error": {
                    "Code": "InvalidPermission.NotFound",
                    "Message": "The specified rule does not exist in this security group.",
                }
            },
            operation_name,
        )
    return mock_make_api_call(self, operation_name, kwarg)


class Test_cloudtrail_logs_s3_bucket_is_not_publicly_accessible_fixer:
    @mock_aws
    def test_trail_bucket_public_acl(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client.create_bucket(Bucket=bucket_name_us)
        s3_client.put_bucket_acl(
            AccessControlPolicy={
                "Grants": [
                    {
                        "Grantee": {
                            "DisplayName": "test",
                            "EmailAddress": "",
                            "ID": "test_ID",
                            "Type": "Group",
                            "URI": "http://acs.amazonaws.com/groups/global/AllUsers",
                        },
                        "Permission": "READ",
                    },
                ],
                "Owner": {"DisplayName": "test", "ID": "test_id"},
            },
            Bucket=bucket_name_us,
        )

        trail_name_us = "trail_test_us"
        cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
        cloudtrail_client.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible_fixer.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible_fixer.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible_fixer import (
                fixer,
            )

            assert fixer(trail_name_us, AWS_REGION_US_EAST_1)

    @mock_aws
    def test_trail_bucket_public_acl_error(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_error
        ):
            aws_provider = set_mocked_aws_provider(
                [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
            )
            s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
            bucket_name_us = "bucket_test_us"
            s3_client.create_bucket(Bucket=bucket_name_us)
            s3_client.put_bucket_acl(
                AccessControlPolicy={
                    "Grants": [
                        {
                            "Grantee": {
                                "DisplayName": "test",
                                "EmailAddress": "",
                                "ID": "test_ID",
                                "Type": "Group",
                                "URI": "http://acs.amazonaws.com/groups/global/AllUsers",
                            },
                            "Permission": "READ",
                        },
                    ],
                    "Owner": {"DisplayName": "test", "ID": "test_id"},
                },
                Bucket=bucket_name_us,
            )

            trail_name_us = "trail_test_us"
            cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
            cloudtrail_client.create_trail(
                Name=trail_name_us,
                S3BucketName=bucket_name_us,
                IsMultiRegionTrail=False,
            )

            from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
                Cloudtrail,
            )
            from prowler.providers.aws.services.s3.s3_service import S3

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible_fixer.cloudtrail_client",
                    new=Cloudtrail(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible_fixer.s3_client",
                    new=S3(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible_fixer import (
                    fixer,
                )

                assert not fixer(trail_name_us, AWS_REGION_US_EAST_1)
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_logs_s3_bucket_is_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_logs_s3_bucket_is_not_publicly_accessible/cloudtrail_logs_s3_bucket_is_not_publicly_accessible_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_cloudtrail_logs_s3_bucket_is_not_publicly_accessible:
    @mock_aws
    def test_not_trails(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible import (
                cloudtrail_logs_s3_bucket_is_not_publicly_accessible,
            )

            check = cloudtrail_logs_s3_bucket_is_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_trail_bucket_no_acl(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client.create_bucket(Bucket=bucket_name_us)
        trail_us = cloudtrail_client.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible import (
                cloudtrail_logs_s3_bucket_is_not_publicly_accessible,
            )

            check = cloudtrail_logs_s3_bucket_is_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == trail_name_us

            assert result[0].resource_arn == trail_us["TrailARN"]
            assert (
                result[0].status_extended
                == f"S3 Bucket {bucket_name_us} from single region trail {trail_name_us} is not publicly accessible."
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_trail_bucket_public_acl(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client.create_bucket(Bucket=bucket_name_us)
        s3_client.put_bucket_acl(
            AccessControlPolicy={
                "Grants": [
                    {
                        "Grantee": {
                            "DisplayName": "test",
                            "EmailAddress": "",
                            "ID": "test_ID",
                            "Type": "Group",
                            "URI": "http://acs.amazonaws.com/groups/global/AllUsers",
                        },
                        "Permission": "READ",
                    },
                ],
                "Owner": {"DisplayName": "test", "ID": "test_id"},
            },
            Bucket=bucket_name_us,
        )

        trail_name_us = "trail_test_us"
        cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
        trail_us = cloudtrail_client.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible import (
                cloudtrail_logs_s3_bucket_is_not_publicly_accessible,
            )

            check = cloudtrail_logs_s3_bucket_is_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert (
                result[0].status_extended
                == f"S3 Bucket {bucket_name_us} from single region trail {trail_name_us} is publicly accessible."
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_trail_bucket_not_public_acl(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client.create_bucket(Bucket=bucket_name_us)
        trail_us = cloudtrail_client.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )

        s3_client.put_bucket_acl(
            AccessControlPolicy={
                "Grants": [
                    {
                        "Grantee": {
                            "DisplayName": "test",
                            "EmailAddress": "",
                            "ID": "test_ID",
                            "Type": "CanonicalUser",
                            "URI": "http://acs.amazonaws.com/groups/global/AuthenticatedUsers",
                        },
                        "Permission": "READ",
                    },
                ],
                "Owner": {"DisplayName": "test", "ID": "test_id"},
            },
            Bucket=bucket_name_us,
        )
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible import (
                cloudtrail_logs_s3_bucket_is_not_publicly_accessible,
            )

            check = cloudtrail_logs_s3_bucket_is_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert (
                result[0].status_extended
                == f"S3 Bucket {bucket_name_us} from single region trail {trail_name_us} is not publicly accessible."
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_trail_bucket_cross_account(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client.create_bucket(Bucket=bucket_name_us)
        trail_us = cloudtrail_client.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.s3_client",
                new=S3(aws_provider),
            ) as s3_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible import (
                cloudtrail_logs_s3_bucket_is_not_publicly_accessible,
            )

            # Empty s3 buckets to simulate the bucket is in another account
            s3_client.buckets = {}

            check = cloudtrail_logs_s3_bucket_is_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "MANUAL"
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} bucket ({bucket_name_us}) is a cross-account bucket or out of Prowler's audit scope, please check it manually."
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_access_denied(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ) as cloudtrail_client,
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.s3_client",
                new=S3(aws_provider),
            ) as s3_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible import (
                cloudtrail_logs_s3_bucket_is_not_publicly_accessible,
            )

            cloudtrail_client.trails = None
            s3_client.buckets = {}

            check = cloudtrail_logs_s3_bucket_is_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_trail_multi_region_auditing_other_region(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)

        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"

        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)

        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=True
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_logs_s3_bucket_is_not_publicly_accessible.cloudtrail_logs_s3_bucket_is_not_publicly_accessible import (
                cloudtrail_logs_s3_bucket_is_not_publicly_accessible,
            )

            check = cloudtrail_logs_s3_bucket_is_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].status == "MANUAL"
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} bucket ({bucket_name_us}) is a cross-account bucket or out of Prowler's audit scope, please check it manually."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
