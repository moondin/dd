---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 464
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 464 of 867)

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

---[FILE: cloudtrail_cloudwatch_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_cloudwatch_logging_enabled/cloudtrail_cloudwatch_logging_enabled_test.py

```python
from datetime import datetime, timedelta, timezone
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_cloudtrail_cloudwatch_logging_enabled:
    @mock_aws
    def test_no_trails(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled import (
                    cloudtrail_cloudwatch_logging_enabled,
                )

                check = cloudtrail_cloudwatch_logging_enabled()
                result = check.execute()
                assert len(result) == 0

    @mock_aws
    def test_trails_sending_logs_during_and_not_last_day(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
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
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )
        trail_eu = cloudtrail_client_eu_west_1.create_trail(
            Name=trail_name_eu, S3BucketName=bucket_name_eu, IsMultiRegionTrail=False
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled import (
                    cloudtrail_cloudwatch_logging_enabled,
                )

                for trail in service_client.trails.values():
                    if trail.name == trail_name_us:
                        trail.latest_cloudwatch_delivery_time = datetime.now().replace(
                            tzinfo=timezone.utc
                        )
                    elif trail.name == trail_name_eu:
                        trail.latest_cloudwatch_delivery_time = (
                            datetime.now() - timedelta(days=2)
                        ).replace(tzinfo=timezone.utc)

                regions = []
                for region in service_client.regional_clients.keys():
                    regions.append(region)

                check = cloudtrail_cloudwatch_logging_enabled()
                result = check.execute()
                # len of result if has to be 2 since we only have 2 single region trails
                assert len(result) == 2
                for report in result:
                    if report.resource_id == trail_name_us:
                        assert report.resource_id == trail_name_us
                        assert report.resource_arn == trail_us["TrailARN"]
                        assert report.status == "PASS"
                        assert (
                            report.status_extended
                            == f"Single region trail {trail_name_us} has been logging in the last 24h."
                        )

                        assert report.resource_tags == []
                        assert report.region == AWS_REGION_US_EAST_1
                    if report.resource_id == trail_name_eu:
                        assert report.resource_id == trail_name_eu
                        assert report.resource_arn == trail_eu["TrailARN"]
                        assert report.status == "FAIL"
                        assert (
                            report.status_extended
                            == f"Single region trail {trail_name_eu} has not been logging in the last 24h."
                        )
                        assert report.resource_tags == []
                        assert report.region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_multi_region_and_single_region_logging_and_not(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
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
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=True
        )
        trail_eu = cloudtrail_client_eu_west_1.create_trail(
            Name=trail_name_eu, S3BucketName=bucket_name_eu, IsMultiRegionTrail=False
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled import (
                    cloudtrail_cloudwatch_logging_enabled,
                )

                for trail in service_client.trails.values():
                    if trail.name == trail_name_us:
                        trail.latest_cloudwatch_delivery_time = datetime.now().replace(
                            tzinfo=timezone.utc
                        )
                    elif trail.name == trail_name_eu:
                        trail.latest_cloudwatch_delivery_time = (
                            datetime.now() - timedelta(days=2)
                        ).replace(tzinfo=timezone.utc)

                regions = []
                for region in service_client.regional_clients.keys():
                    regions.append(region)

                check = cloudtrail_cloudwatch_logging_enabled()
                result = check.execute()
                # len of result should be 2 -> (1 per trail)
                assert len(result) == 2
                for report in result:
                    if report.resource_id == trail_name_us:
                        assert report.resource_id == trail_name_us
                        assert report.resource_arn == trail_us["TrailARN"]
                        assert report.status == "PASS"
                        assert (
                            report.status_extended
                            == f"Multiregion trail {trail_name_us} has been logging in the last 24h."
                        )

                        assert report.region == AWS_REGION_US_EAST_1
                        assert report.resource_tags == []
                    if report.resource_id == trail_name_eu:
                        assert report.resource_id == trail_name_eu
                        assert report.resource_arn == trail_eu["TrailARN"]
                        assert report.status == "FAIL"
                        assert (
                            report.status_extended
                            == f"Single region trail {trail_name_eu} has not been logging in the last 24h."
                        )
                        assert report.region == AWS_REGION_EU_WEST_1
                        assert report.resource_tags == []

    @mock_aws
    def test_trails_sending_and_not_sending_logs(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
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
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )
        trail_eu = cloudtrail_client_eu_west_1.create_trail(
            Name=trail_name_eu, S3BucketName=bucket_name_eu, IsMultiRegionTrail=False
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled import (
                    cloudtrail_cloudwatch_logging_enabled,
                )

                for trail in service_client.trails.values():
                    if trail.name == trail_name_us:
                        trail.latest_cloudwatch_delivery_time = datetime.now().replace(
                            tzinfo=timezone.utc
                        )
                    elif trail.name == trail_name_us:
                        trail.latest_cloudwatch_delivery_time = None

                regions = []
                for region in service_client.regional_clients.keys():
                    regions.append(region)

                check = cloudtrail_cloudwatch_logging_enabled()
                result = check.execute()
                # len of result if has to be 2 since we only have 2 single region trails
                assert len(result) == 2
                for report in result:
                    if report.resource_id == trail_name_us:
                        assert report.resource_id == trail_name_us
                        assert report.resource_arn == trail_us["TrailARN"]
                        assert report.status == "PASS"
                        assert (
                            report.status_extended
                            == f"Single region trail {trail_name_us} has been logging in the last 24h."
                        )
                        assert report.region == AWS_REGION_US_EAST_1
                        assert report.resource_tags == []
                    if report.resource_id == trail_name_eu:
                        assert report.resource_id == trail_name_eu
                        assert report.resource_arn == trail_eu["TrailARN"]
                        assert report.status == "FAIL"
                        assert (
                            report.status_extended
                            == f"Single region trail {trail_name_eu} has not been logging in the last 24h or is not configured to deliver logs."
                        )
                        assert report.region == AWS_REGION_EU_WEST_1
                        assert report.resource_tags == []

    @mock_aws
    def test_access_denied(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled import (
                    cloudtrail_cloudwatch_logging_enabled,
                )

                service_client.trails = None

                check = cloudtrail_cloudwatch_logging_enabled()
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

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_cloudwatch_logging_enabled.cloudtrail_cloudwatch_logging_enabled import (
                    cloudtrail_cloudwatch_logging_enabled,
                )

                check = cloudtrail_cloudwatch_logging_enabled()
                result = check.execute()
                assert len(result) == 1
                assert result[0].resource_id == trail_name_us
                assert result[0].resource_arn == trail_us["TrailARN"]
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Multiregion trail {trail_name_us} has not been logging in the last 24h or is not configured to deliver logs."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_insights_exist_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_insights_exist/cloudtrail_insights_exist_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.cloudtrail.cloudtrail_service import Cloudtrail
from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_cloudtrail_insights_exist:
    @mock_aws
    def test_no_trails(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_insights_exist.cloudtrail_insights_exist.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_insights_exist.cloudtrail_insights_exist import (
                    cloudtrail_insights_exist,
                )

                check = cloudtrail_insights_exist()
                result = check.execute()
                assert len(result) == 0

    @mock_aws
    def test_trails_with_no_insight_selector(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us_with_no_insight_selector"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )
        cloudtrail_client_us_east_1.start_logging(Name=trail_name_us)
        cloudtrail_client_us_east_1.get_trail_status(Name=trail_name_us)

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_insights_exist.cloudtrail_insights_exist.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_insights_exist.cloudtrail_insights_exist import (
                    cloudtrail_insights_exist,
                )

                check = cloudtrail_insights_exist()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Trail {trail_name_us} does not have insight selectors and it is logging."
                )
                assert result[0].resource_id == trail_name_us
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_arn == trail_us["TrailARN"]
                assert result[0].resource_tags == []

    @mock_aws
    def test_trails_with_insight_selector(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us_with_insight_selector"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us, S3BucketName=bucket_name_us, IsMultiRegionTrail=False
        )
        cloudtrail_client_us_east_1.start_logging(Name=trail_name_us)
        cloudtrail_client_us_east_1.get_trail_status(Name=trail_name_us)
        cloudtrail_client_us_east_1.put_insight_selectors(
            TrailName=trail_name_us,
            InsightSelectors=[{"InsightType": "ApiErrorRateInsight"}],
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_insights_exist.cloudtrail_insights_exist.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_insights_exist.cloudtrail_insights_exist import (
                    cloudtrail_insights_exist,
                )

                check = cloudtrail_insights_exist()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Trail {trail_name_us} has insight selectors and it is logging."
                )
                assert result[0].resource_id == trail_name_us
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_arn == trail_us["TrailARN"]
                assert result[0].resource_tags == []

    @mock_aws
    def test_access_denied(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_insights_exist.cloudtrail_insights_exist.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_insights_exist.cloudtrail_insights_exist import (
                    cloudtrail_insights_exist,
                )

                service_client.trails = None
                check = cloudtrail_insights_exist()
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

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_insights_exist.cloudtrail_insights_exist.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.cloudtrail.cloudtrail_insights_exist.cloudtrail_insights_exist import (
                    cloudtrail_insights_exist,
                )

                check = cloudtrail_insights_exist()
                result = check.execute()
                assert len(result) == 1
                assert result[0].resource_id == trail_name_us
                assert result[0].resource_arn == trail_us["TrailARN"]
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Trail {trail_name_us} does not have insight selectors and it is logging."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_kms_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_kms_encryption_enabled/cloudtrail_kms_encryption_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_cloudtrail_kms_encryption_enabled:
    @mock_aws
    def test_no_trails(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_kms_encryption_enabled.cloudtrail_kms_encryption_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_kms_encryption_enabled.cloudtrail_kms_encryption_enabled import (
                cloudtrail_kms_encryption_enabled,
            )

            check = cloudtrail_kms_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_trail_no_kms(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
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

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_kms_encryption_enabled.cloudtrail_kms_encryption_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_kms_encryption_enabled.cloudtrail_kms_encryption_enabled import (
                cloudtrail_kms_encryption_enabled,
            )

            check = cloudtrail_kms_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Single region trail {trail_name_us} has encryption disabled."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_trail_kms(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        cloudtrail_client_us_east_1 = client(
            "cloudtrail", region_name=AWS_REGION_US_EAST_1
        )
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        trail_name_us = "trail_test_us"
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        key_arn = kms_client.create_key()["KeyMetadata"]["Arn"]
        trail_us = cloudtrail_client_us_east_1.create_trail(
            Name=trail_name_us,
            S3BucketName=bucket_name_us,
            IsMultiRegionTrail=False,
            KmsKeyId=key_arn,
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_kms_encryption_enabled.cloudtrail_kms_encryption_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_kms_encryption_enabled.cloudtrail_kms_encryption_enabled import (
                cloudtrail_kms_encryption_enabled,
            )

            check = cloudtrail_kms_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Single region trail {trail_name_us} has encryption enabled."
            )
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_access_denied(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_kms_encryption_enabled.cloudtrail_kms_encryption_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ) as service_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_kms_encryption_enabled.cloudtrail_kms_encryption_enabled import (
                cloudtrail_kms_encryption_enabled,
            )

            service_client.trails = None
            check = cloudtrail_kms_encryption_enabled()
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

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_kms_encryption_enabled.cloudtrail_kms_encryption_enabled.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_kms_encryption_enabled.cloudtrail_kms_encryption_enabled import (
                cloudtrail_kms_encryption_enabled,
            )

            check = cloudtrail_kms_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == trail_name_us
            assert result[0].resource_arn == trail_us["TrailARN"]
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Multiregion trail {trail_name_us} has encryption disabled."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
