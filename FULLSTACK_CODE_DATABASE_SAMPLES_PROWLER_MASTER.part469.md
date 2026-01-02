---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 469
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 469 of 867)

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

---[FILE: cloudtrail_s3_dataevents_write_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_s3_dataevents_write_enabled/cloudtrail_s3_dataevents_write_enabled_test.py

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


class Test_cloudtrail_s3_dataevents_write_enabled:
    @mock_aws
    def test_trail_without_data_events(self):
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled import (
                cloudtrail_s3_dataevents_write_enabled,
            )

            check = cloudtrail_s3_dataevents_write_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No CloudTrail trails have a data event to record all S3 object-level API operations."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_trail_without_s3_data_events(self):
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )
        _ = cloudtrail_client_us_east_1.put_event_selectors(
            TrailName=trail_name_us,
            EventSelectors=[
                {
                    "ReadWriteType": "All",
                    "IncludeManagementEvents": True,
                    "DataResources": [
                        {"Type": "AWS::Lambda::Function", "Values": ["arn:aws:lambda"]}
                    ],
                }
            ],
        )["EventSelectors"]

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled import (
                cloudtrail_s3_dataevents_write_enabled,
            )

            check = cloudtrail_s3_dataevents_write_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No CloudTrail trails have a data event to record all S3 object-level API operations."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_trail_without_s3_data_events_ignoring(self):
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider()
        aws_provider._scan_unused_services = False

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled import (
                cloudtrail_s3_dataevents_write_enabled,
            )

            check = cloudtrail_s3_dataevents_write_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_trail_without_s3_data_events_ignoring_with_buckets(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider()
        aws_provider._scan_unused_services = False

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled import (
                cloudtrail_s3_dataevents_write_enabled,
            )

            check = cloudtrail_s3_dataevents_write_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No CloudTrail trails have a data event to record all S3 object-level API operations."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_trail_with_s3_data_events(self):
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
        _ = cloudtrail_client_us_east_1.put_event_selectors(
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

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled import (
                cloudtrail_s3_dataevents_write_enabled,
            )

            check = cloudtrail_s3_dataevents_write_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} from home region {AWS_REGION_US_EAST_1} has a classic data event selector to record all S3 object-level API operations."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_trail_with_s3_advanced_data_events(self):
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
        _ = cloudtrail_client_us_east_1.put_event_selectors(
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
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled import (
                cloudtrail_s3_dataevents_write_enabled,
            )

            check = cloudtrail_s3_dataevents_write_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} from home region {AWS_REGION_US_EAST_1} has an advanced data event selector to record all S3 object-level API operations."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_trail_with_s3_three_colons(self):
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
        _ = cloudtrail_client_us_east_1.put_event_selectors(
            TrailName=trail_name_us,
            EventSelectors=[
                {
                    "ReadWriteType": "All",
                    "IncludeManagementEvents": True,
                    "DataResources": [
                        {
                            "Type": "AWS::DynamoDB::Table",
                            "Values": ["arn:aws:dynamodb"],
                        },
                        {"Type": "AWS::S3::Object", "Values": ["arn:aws:s3:::"]},
                        {"Type": "AWS::Lambda::Function", "Values": ["arn:aws:lambda"]},
                    ],
                    "ExcludeManagementEventSources": [],
                }
            ],
        )["EventSelectors"]

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled import (
                cloudtrail_s3_dataevents_write_enabled,
            )

            check = cloudtrail_s3_dataevents_write_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Trail {trail_name_us} from home region {AWS_REGION_US_EAST_1} has a classic data event selector to record all S3 object-level API operations."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_access_denied(self):
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ) as cloudtrail_service,
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled import (
                cloudtrail_s3_dataevents_write_enabled,
            )

            cloudtrail_service.trails = None
            check = cloudtrail_s3_dataevents_write_enabled()
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

        _ = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=True
        )
        _ = cloudtrail_client_us_east_1.put_event_selectors(
            TrailName=trail_name_us,
            EventSelectors=[
                {
                    "ReadWriteType": "All",
                    "IncludeManagementEvents": True,
                    "DataResources": [
                        {
                            "Type": "AWS::DynamoDB::Table",
                            "Values": ["arn:aws:dynamodb"],
                        },
                        {"Type": "AWS::S3::Object", "Values": ["arn:aws:s3:::"]},
                        {"Type": "AWS::Lambda::Function", "Values": ["arn:aws:lambda"]},
                    ],
                    "ExcludeManagementEventSources": [],
                }
            ],
        )["EventSelectors"]

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
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_s3_dataevents_write_enabled.cloudtrail_s3_dataevents_write_enabled import (
                cloudtrail_s3_dataevents_write_enabled,
            )

            check = cloudtrail_s3_dataevents_write_enabled()
            result = check.execute()
            assert len(result) == 1
            # FAIL since it is a multi-region trail in a region that Prowler is not auditing, so it is not possible to check the trail's data events
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No CloudTrail trails have a data event to record all S3 object-level API operations."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_threat_detection_enumeration_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_threat_detection_enumeration/cloudtrail_threat_detection_enumeration_test.py

```python
from unittest import mock

from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


def mock_get_trail_arn_template(region=None, *_) -> str:
    if region:
        return f"arn:aws:cloudtrail:{region}:{AWS_ACCOUNT_NUMBER}:trail"
    else:
        return f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"


def mock__get_lookup_events__(trail=None, event_name=None, minutes=None, *_) -> list:
    return [
        {
            "CloudTrailEvent": '{"eventName": "DescribeAccessEntry", "userIdentity": {"type": "IAMUser", "principalId": "EXAMPLE6E4XEGITWATV6R", "arn": "arn:aws:iam::123456789012:user/Attacker", "accountId": "123456789012", "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "userName": "Attacker", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
        {
            "CloudTrailEvent": '{"eventName": "DescribeAccountAttributes", "userIdentity": {"type": "IAMUser", "principalId": "EXAMPLE6E4XEGITWATV6R", "arn": "arn:aws:iam::123456789012:user/Attacker", "accountId": "123456789012", "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "userName": "Attacker", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
    ]


def mock__get_lookup_events_aws_service__(
    trail=None, event_name=None, minutes=None, *_
) -> list:
    return [
        {
            "CloudTrailEvent": '{"eventName": "DescribeAccessEntry", "userIdentity": {"type": "AWSService", "principalId": "EXAMPLE6E4XEGITWATV6R", "accountId": "123456789012", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
        {
            "CloudTrailEvent": '{"eventName": "DescribeAccountAttributes", "userIdentity": {"type": "AWSService", "principalId": "EXAMPLE6E4XEGITWATV6R", "accountId": "123456789012", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
    ]


class Test_cloudtrail_threat_detection_enumeration:
    @mock_aws
    def test_no_trails(self):
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {}
        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_enumeration.cloudtrail_threat_detection_enumeration.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_enumeration.cloudtrail_threat_detection_enumeration import (
                cloudtrail_threat_detection_enumeration,
            )

            check = cloudtrail_threat_detection_enumeration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "No potential enumeration attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )

    @mock_aws
    def test_no_potential_enumeration(self):
        ENUMERATION_ACTIONS = []
        THRESHOLD = 0.1
        THREAT_DETECTION_MINUTES = 1440
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_enumeration_actions": ENUMERATION_ACTIONS,
            "threat_detection_enumeration_threshold": THRESHOLD,
            "threat_detection_enumeration_minutes": THREAT_DETECTION_MINUTES,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_enumeration.cloudtrail_threat_detection_enumeration.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_enumeration.cloudtrail_threat_detection_enumeration import (
                cloudtrail_threat_detection_enumeration,
            )

            check = cloudtrail_threat_detection_enumeration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "No potential enumeration attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )

    @mock_aws
    def test_potential_enumeration(self):
        ENUMERATION_ACTIONS = ["DescribeAccessEntry", "DescribeAccountAttributes"]
        THRESHOLD = 0.1
        THREAT_DETECTION_MINUTES = 1440
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_enumeration_actions": ENUMERATION_ACTIONS,
            "threat_detection_enumeration_threshold": THRESHOLD,
            "threat_detection_enumeration_minutes": THREAT_DETECTION_MINUTES,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_enumeration.cloudtrail_threat_detection_enumeration.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_enumeration.cloudtrail_threat_detection_enumeration import (
                cloudtrail_threat_detection_enumeration,
            )

            check = cloudtrail_threat_detection_enumeration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Potential enumeration attack detected from AWS IAMUser Attacker with a threshold of 1.0."
            )
            assert result[0].resource_id == "Attacker"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:user/Attacker"
            )

    @mock_aws
    def test_big_threshold(self):
        ENUMERATION_ACTIONS = ["DescribeAccessEntry", "DescribeAccountAttributes"]
        THRESHOLD = 2.0
        THREAT_DETECTION_MINUTES = 1440
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_enumeration_actions": ENUMERATION_ACTIONS,
            "threat_detection_enumeration_threshold": THRESHOLD,
            "threat_detection_enumeration_minutes": THREAT_DETECTION_MINUTES,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_enumeration.cloudtrail_threat_detection_enumeration.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_enumeration.cloudtrail_threat_detection_enumeration import (
                cloudtrail_threat_detection_enumeration,
            )

            check = cloudtrail_threat_detection_enumeration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "No potential enumeration attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )

    @mock_aws
    def test_potential_enumeration_from_aws_service(self):
        ENUMERATION_ACTIONS = ["DescribeAccessEntry", "DescribeAccountAttributes"]
        THRESHOLD = 2.0
        THREAT_DETECTION_MINUTES = 1440
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_enumeration_actions": ENUMERATION_ACTIONS,
            "threat_detection_enumeration_threshold": THRESHOLD,
            "threat_detection_enumeration_minutes": THREAT_DETECTION_MINUTES,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events_aws_service__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_enumeration.cloudtrail_threat_detection_enumeration.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_enumeration.cloudtrail_threat_detection_enumeration import (
                cloudtrail_threat_detection_enumeration,
            )

            check = cloudtrail_threat_detection_enumeration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "No potential enumeration attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )
```

--------------------------------------------------------------------------------

````
