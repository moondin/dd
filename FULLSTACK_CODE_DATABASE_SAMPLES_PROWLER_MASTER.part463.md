---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 463
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 463 of 867)

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

---[FILE: cloudtrail_service_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_service_test.py

```python
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.cloudtrail.cloudtrail_service import Cloudtrail
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_SOUTH_2,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_Cloudtrail_Service:
    # Test Cloudtrail Service
    @mock_aws
    def test_service(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail = Cloudtrail(aws_provider)
        assert cloudtrail.service == "cloudtrail"

    # Test Cloudtrail client
    @mock_aws
    def test_client(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail = Cloudtrail(aws_provider)
        for regional_client in cloudtrail.regional_clients.values():
            assert regional_client.__class__.__name__ == "CloudTrail"

    # Test Cloudtrail session
    @mock_aws
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail = Cloudtrail(aws_provider)
        assert cloudtrail.session.__class__.__name__ == "Session"

    # Test Cloudtrail Session
    @mock_aws
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail = Cloudtrail(aws_provider)
        assert cloudtrail.audited_account == AWS_ACCOUNT_NUMBER

    @mock_aws
    def test_describe_trails(self):
        # USA
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us,
            S3BucketName=bucket_name_us,
            IsMultiRegionTrail=False,
            TagsList=[
                {"Key": "test", "Value": "test"},
            ],
        )

        # IRELAND
        cloudtrail_client_eu_west_1 = client(
            "cloudtrail", region_name=AWS_REGION_EU_WEST_1
        )
        s3_client_eu_west_1 = client("s3", region_name=AWS_REGION_EU_WEST_1)
        trail_name_eu = "trail_test_eu"
        bucket_name_eu = "bucket_test_eu"
        s3_client_eu_west_1.create_bucket(
            Bucket=bucket_name_eu,
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION_EU_WEST_1},
        )
        cloudtrail_client_eu_west_1.create_trail(
            Name=trail_name_eu,
            S3BucketName=bucket_name_eu,
            IsMultiRegionTrail=False,
            TagsList=[
                {"Key": "test", "Value": "test"},
            ],
        )
        # SPAIN
        cloudtrail_client_eu_south_2 = client(
            "cloudtrail", region_name=AWS_REGION_EU_SOUTH_2
        )
        s3_client_eu_south_2 = client("s3", region_name=AWS_REGION_EU_SOUTH_2)
        trail_name_sp = "trail_test_sp"
        bucket_name_sp = "bucket_test_sp"
        s3_client_eu_south_2.create_bucket(
            Bucket=bucket_name_sp,
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION_EU_SOUTH_2},
        )
        cloudtrail_client_eu_south_2.create_trail(
            Name=trail_name_sp,
            S3BucketName=bucket_name_sp,
            IsMultiRegionTrail=True,
            TagsList=[
                {"Key": "test", "Value": "test"},
            ],
        )

        # We are not going to include AWS_REGION_EU_SOUTH_2 in the audited
        # regions, but that trail is regional so it'll appear
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail = Cloudtrail(aws_provider)
        assert len(cloudtrail.trails) == 3
        for trail in cloudtrail.trails.values():
            if trail.name == trail_name_us:
                assert not trail.is_multiregion
                assert trail.home_region == AWS_REGION_US_EAST_1
                assert trail.region == AWS_REGION_US_EAST_1
                assert not trail.is_logging
                assert not trail.log_file_validation_enabled
                assert not trail.latest_cloudwatch_delivery_time
                assert trail.s3_bucket == bucket_name_us
                assert trail.tags == [
                    {"Key": "test", "Value": "test"},
                ]
            if trail.name == trail_name_eu:
                assert not trail.is_multiregion
                assert trail.home_region == AWS_REGION_EU_WEST_1
                assert trail.region == AWS_REGION_EU_WEST_1
                assert not trail.is_logging
                assert not trail.log_file_validation_enabled
                assert not trail.latest_cloudwatch_delivery_time
                assert trail.s3_bucket == bucket_name_eu
                assert trail.tags == [
                    {"Key": "test", "Value": "test"},
                ]
            if trail.name == trail_name_sp:
                assert trail.is_multiregion
                assert trail.home_region == AWS_REGION_EU_SOUTH_2
                # The region is the first audited region since the trail home region is not audited
                assert (
                    trail.region == AWS_REGION_US_EAST_1
                    or trail.region == AWS_REGION_EU_WEST_1
                )
                assert not trail.is_logging
                assert not trail.log_file_validation_enabled
                assert not trail.latest_cloudwatch_delivery_time
                assert trail.s3_bucket == bucket_name_sp
                # No tags since the trail region is not audited and the tags are retrieved from the regional endpoint
                assert trail.tags == []

    @mock_aws
    def test_status_trails(self):
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        cloudtrail_client_eu_west_1 = client(
            "cloudtrail", region_name=AWS_REGION_EU_WEST_1
        )
        s3_client_eu_west_1 = client("s3", region_name=AWS_REGION_EU_WEST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        trail_name_eu = "trail_test_eu"
        bucket_name_eu = "bucket_test_eu"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        s3_client_eu_west_1.create_bucket(
            Bucket=bucket_name_eu,
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION_EU_WEST_1},
        )
        cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us,
            S3BucketName=bucket_name_us,
            IsMultiRegionTrail=False,
            EnableLogFileValidation=True,
        )
        cloudtrail_client_us_east_1.start_logging(Name=trail_name_us)
        cloudtrail_client_eu_west_1.create_trail(
            Name=trail_name_eu, S3BucketName=bucket_name_eu, IsMultiRegionTrail=False
        )
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail = Cloudtrail(aws_provider)
        assert len(cloudtrail.trails) == len(aws_provider.identity.audited_regions)
        for trail in cloudtrail.trails.values():
            if trail.name:
                if trail.name == trail_name_us:
                    assert not trail.is_multiregion
                    assert trail.home_region == AWS_REGION_US_EAST_1
                    assert trail.region == AWS_REGION_US_EAST_1
                    assert trail.is_logging
                    assert trail.log_file_validation_enabled
                    assert not trail.latest_cloudwatch_delivery_time
                    assert trail.s3_bucket == bucket_name_us

    @mock_aws
    def test_get_classic_event_selectors(self):
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us,
            S3BucketName=bucket_name_us,
            IsMultiRegionTrail=False,
            EnableLogFileValidation=True,
        )
        cloudtrail_client_us_east_1.start_logging(Name=trail_name_us)
        data_events_response = cloudtrail_client_us_east_1.put_event_selectors(
            TrailName=trail_name_us,
            EventSelectors=[
                {
                    "ReadWriteType": "All",
                    "IncludeManagementEvents": True,
                    "DataResources": [
                        {"Type": "AWS::S3::Object", "Values": ["arn:aws:s3:::*/*"]}
                    ],
                }
            ],
        )["EventSelectors"]
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail = Cloudtrail(aws_provider)
        assert len(cloudtrail.trails) == len(aws_provider.identity.audited_regions)
        for trail in cloudtrail.trails.values():
            if trail.name:
                if trail.name == trail_name_us:
                    assert not trail.is_multiregion
                    assert trail.home_region == AWS_REGION_US_EAST_1
                    assert trail.region == AWS_REGION_US_EAST_1
                    assert trail.is_logging
                    assert trail.log_file_validation_enabled
                    assert not trail.latest_cloudwatch_delivery_time
                    assert trail.s3_bucket == bucket_name_us
                    assert (
                        trail.data_events[0].event_selector == data_events_response[0]
                    )
                    assert not trail.data_events[0].is_advanced

    @mock_aws
    def test_get_advanced_event_selectors(self):
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us,
            S3BucketName=bucket_name_us,
            IsMultiRegionTrail=False,
            EnableLogFileValidation=True,
        )
        cloudtrail_client_us_east_1.start_logging(Name=trail_name_us)
        data_events_response = cloudtrail_client_us_east_1.put_event_selectors(
            TrailName=trail_name_us,
            AdvancedEventSelectors=[
                {
                    "Name": "test",
                    "FieldSelectors": [
                        {"Field": "eventCategory", "Equals": ["Data"]},
                        {"Field": "resources.type", "Equals": ["AWS::S3::Object"]},
                    ],
                },
            ],
        )["AdvancedEventSelectors"]
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail = Cloudtrail(aws_provider)
        assert len(cloudtrail.trails) == len(aws_provider.identity.audited_regions)
        for trail in cloudtrail.trails.values():
            if trail.name:
                if trail.name == trail_name_us:
                    assert not trail.is_multiregion
                    assert trail.home_region == AWS_REGION_US_EAST_1
                    assert trail.region == AWS_REGION_US_EAST_1
                    assert trail.is_logging
                    assert trail.log_file_validation_enabled
                    assert not trail.latest_cloudwatch_delivery_time
                    assert trail.s3_bucket == bucket_name_us
                    assert (
                        trail.data_events[0].event_selector == data_events_response[0]
                    )
                    assert trail.data_events[0].is_advanced

    @mock_aws
    def test_lookup_events(self):
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us,
            S3BucketName=bucket_name_us,
            IsMultiRegionTrail=False,
            EnableLogFileValidation=True,
        )
        cloudtrail_client_us_east_1.start_logging(Name=trail_name_us)
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail = Cloudtrail(aws_provider)
        assert len(cloudtrail.trails) == len(aws_provider.identity.audited_regions)

    @mock_aws
    def test_list_tags_for_resource(self):
        tag = "test-tag"
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us,
            S3BucketName=bucket_name_us,
            IsMultiRegionTrail=False,
            EnableLogFileValidation=True,
            TagsList=[
                {"Key": "test", "Value": tag},
            ],
        )
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        cloudtrail = Cloudtrail(aws_provider)
        assert len(cloudtrail.trails) == len(aws_provider.identity.audited_regions)
        for trail in cloudtrail.trails.values():
            if trail.name:
                if trail.name == trail_name_us:
                    assert trail.tags == [{"Key": "test", "Value": tag}]
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_bucket_requires_mfa_delete_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_bucket_requires_mfa_delete/cloudtrail_bucket_requires_mfa_delete_test.py

```python
from unittest import mock
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.cloudtrail.cloudtrail_service import Cloudtrail
from prowler.providers.aws.services.s3.s3_service import S3
from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking Backup Calls
make_api_call = botocore.client.BaseClient._make_api_call


class Test_cloudtrail_bucket_requires_mfa_delete:
    @mock_aws
    def test_no_trails(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete import (
                cloudtrail_bucket_requires_mfa_delete,
            )

            check = cloudtrail_bucket_requires_mfa_delete()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_trails_with_no_mfa_bucket(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us_with_no_mfa_bucket"
        bucket_name_us = "bucket_test_us_with_no_mfa"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )
        cloudtrail_client_us_east_1.start_logging(Name=trail_name_us)
        cloudtrail_client_us_east_1.get_trail_status(Name=trail_name_us)

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete import (
                cloudtrail_bucket_requires_mfa_delete,
            )

            check = cloudtrail_bucket_requires_mfa_delete()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} bucket ({bucket_name_us}) does not have MFA delete enabled."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []

    # Create an MFA device is not supported for moto, so we mock the call:
    def mock_make_api_call_getbucketversioning_mfadelete_enabled(
        self, operation_name, kwarg
    ):
        """
        Mock unsoportted AWS API call
        """
        if operation_name == "GetBucketVersioning":
            return {"MFADelete": "Enabled", "Status": "Enabled"}
        return make_api_call(self, operation_name, kwarg)

    @mock_aws
    # Patch with mock_make_api_call_getbucketversioning_mfadelete_enabled:
    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_getbucketversioning_mfadelete_enabled,
    )
    def test_trails_with_mfa_bucket(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us_with_mfa_bucket"
        bucket_name_us = "bucket_test_us_with_mfa"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )
        cloudtrail_client_us_east_1.start_logging(Name=trail_name_us)
        cloudtrail_client_us_east_1.get_trail_status(Name=trail_name_us)

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete import (
                cloudtrail_bucket_requires_mfa_delete,
            )

            check = cloudtrail_bucket_requires_mfa_delete()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} bucket ({bucket_name_us}) has MFA delete enabled."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []

    @mock_aws
    def test_trails_with_no_mfa_bucket_cross(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us_with_no_mfa_bucket"
        bucket_name_us = "bucket_test_us_with_no_mfa"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )
        cloudtrail_client_us_east_1.start_logging(Name=trail_name_us)
        cloudtrail_client_us_east_1.get_trail_status(Name=trail_name_us)

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.s3_client",
                new=S3(aws_provider),
            ) as s3_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete import (
                cloudtrail_bucket_requires_mfa_delete,
            )

            # Empty s3 buckets to simulate the bucket is in another account
            s3_client.buckets = {}

            check = cloudtrail_bucket_requires_mfa_delete()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "MANUAL"
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} bucket ({bucket_name_us}) is a cross-account bucket or out of Prowler's audit scope, please check it manually."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []

    @mock_aws
    # Patch with mock_make_api_call_getbucketversioning_mfadelete_enabled:
    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_getbucketversioning_mfadelete_enabled,
    )
    def test_trails_with_mfa_bucket_cross(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us_with_mfa_bucket"
        bucket_name_us = "bucket_test_us_with_mfa"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )
        cloudtrail_client_us_east_1.start_logging(Name=trail_name_us)
        cloudtrail_client_us_east_1.get_trail_status(Name=trail_name_us)

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.s3_client",
                new=S3(aws_provider),
            ) as s3_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete import (
                cloudtrail_bucket_requires_mfa_delete,
            )

            # Empty s3 buckets to simulate the bucket is in another account
            s3_client.buckets = {}

            check = cloudtrail_bucket_requires_mfa_delete()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "MANUAL"
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} bucket ({bucket_name_us}) is a cross-account bucket or out of Prowler's audit scope, please check it manually."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []

    @mock_aws
    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_getbucketversioning_mfadelete_enabled,
    )
    def test_access_denied(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ) as cloudtrail_client,
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.s3_client",
                new=S3(aws_provider),
            ) as s3_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete import (
                cloudtrail_bucket_requires_mfa_delete,
            )

            cloudtrail_client.trails = None
            s3_client.buckets = {}

            check = cloudtrail_bucket_requires_mfa_delete()
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
        cloudtrail_client_us_east_1.start_logging(Name=trail_name_us)
        cloudtrail_client_us_east_1.get_trail_status(Name=trail_name_us)

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_bucket_requires_mfa_delete.cloudtrail_bucket_requires_mfa_delete import (
                cloudtrail_bucket_requires_mfa_delete,
            )

            check = cloudtrail_bucket_requires_mfa_delete()
            result = check.execute()
            assert len(result) == 1
            # This is MANUAL since S3 bucket is in another region not audited
            assert result[0].status == "MANUAL"
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} bucket ({bucket_name_us}) is a cross-account bucket or out of Prowler's audit scope, please check it manually."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
