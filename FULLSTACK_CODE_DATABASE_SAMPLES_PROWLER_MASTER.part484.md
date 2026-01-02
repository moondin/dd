---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 484
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 484 of 867)

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

---[FILE: cloudwatch_log_metric_filter_unauthorized_api_calls_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudwatch/cloudwatch_log_metric_filter_unauthorized_api_calls/cloudwatch_log_metric_filter_unauthorized_api_calls_test.py

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


class Test_cloudwatch_log_metric_filter_unauthorized_api_calls:
    @mock_aws
    def test_cloudwatch_no_log_groups(self):
        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import (
            CloudWatch,
            Logs,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_client",
                new=CloudWatch(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls import (
                cloudwatch_log_metric_filter_unauthorized_api_calls,
            )

            check = cloudwatch_log_metric_filter_unauthorized_api_calls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No CloudWatch log groups found with metric filters or alarms associated."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:log-group"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_cloudwatch_trail_no_log_group(self):
        cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        s3_client.create_bucket(Bucket="test")
        cloudtrail_client.create_trail(Name="test_trail", S3BucketName="test")

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import (
            CloudWatch,
            Logs,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_client",
                new=CloudWatch(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls import (
                cloudwatch_log_metric_filter_unauthorized_api_calls,
            )

            check = cloudwatch_log_metric_filter_unauthorized_api_calls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No CloudWatch log groups found with metric filters or alarms associated."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:log-group"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_cloudwatch_trail_with_log_group(self):
        cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        s3_client.create_bucket(Bucket="test")
        logs_client.create_log_group(logGroupName="/log-group/test")
        cloudtrail_client.create_trail(
            Name="test_trail",
            S3BucketName="test",
            CloudWatchLogsLogGroupArn=f"arn:aws:logs:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:log-group:/log-group/test:*",
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import (
            CloudWatch,
            Logs,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_client",
                new=CloudWatch(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls import (
                cloudwatch_log_metric_filter_unauthorized_api_calls,
            )

            check = cloudwatch_log_metric_filter_unauthorized_api_calls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No CloudWatch log groups found with metric filters or alarms associated."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:log-group"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_cloudwatch_trail_with_log_group_with_metric(self):
        cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        s3_client.create_bucket(Bucket="test")
        logs_client.create_log_group(logGroupName="/log-group/test")
        cloudtrail_client.create_trail(
            Name="test_trail",
            S3BucketName="test",
            CloudWatchLogsLogGroupArn=f"arn:aws:logs:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:log-group:/log-group/test:*",
        )
        logs_client.put_metric_filter(
            logGroupName="/log-group/test",
            filterName="test-filter",
            filterPattern="{ ($.errorCode = *UnauthorizedOperation) || ($.errorCode = AccessDenied*) || ($.sourceIPAddress!=delivery.logs.amazonaws.com) || ($.eventName!=HeadBucket) }",
            metricTransformations=[
                {
                    "metricName": "my-metric",
                    "metricNamespace": "my-namespace",
                    "metricValue": "$.value",
                }
            ],
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import (
            CloudWatch,
            Logs,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_client",
                new=CloudWatch(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls import (
                cloudwatch_log_metric_filter_unauthorized_api_calls,
            )

            check = cloudwatch_log_metric_filter_unauthorized_api_calls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "CloudWatch log group /log-group/test found with metric filter test-filter but no alarms associated."
            )
            assert result[0].resource_id == "/log-group/test"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:log-group:/log-group/test:*"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_cloudwatch_trail_with_log_group_with_metric_and_alarm(self):
        cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
        cloudwatch_client = client("cloudwatch", region_name=AWS_REGION_US_EAST_1)
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        s3_client.create_bucket(Bucket="test")
        logs_client.create_log_group(logGroupName="/log-group/test")
        cloudtrail_client.create_trail(
            Name="test_trail",
            S3BucketName="test",
            CloudWatchLogsLogGroupArn=f"arn:aws:logs:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:log-group:/log-group/test:*",
        )
        logs_client.put_metric_filter(
            logGroupName="/log-group/test",
            filterName="test-filter",
            filterPattern="{ ($.errorCode = *UnauthorizedOperation) || ($.errorCode = AccessDenied*) || ($.sourceIPAddress!=delivery.logs.amazonaws.com) || ($.eventName!=HeadBucket) }",
            metricTransformations=[
                {
                    "metricName": "my-metric",
                    "metricNamespace": "my-namespace",
                    "metricValue": "$.value",
                }
            ],
        )
        cloudwatch_client.put_metric_alarm(
            AlarmName="test-alarm",
            MetricName="my-metric",
            Namespace="my-namespace",
            Period=10,
            EvaluationPeriods=5,
            Statistic="Average",
            Threshold=2,
            ComparisonOperator="GreaterThanThreshold",
            ActionsEnabled=True,
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import (
            CloudWatch,
            Logs,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_client",
                new=CloudWatch(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls import (
                cloudwatch_log_metric_filter_unauthorized_api_calls,
            )

            check = cloudwatch_log_metric_filter_unauthorized_api_calls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "CloudWatch log group /log-group/test found with metric filter test-filter and alarms set."
            )
            assert result[0].resource_id == "/log-group/test"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:log-group:/log-group/test:*"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_cloudwatch_trail_with_log_group_with_metric_and_alarm_with_quotes(self):
        cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
        cloudwatch_client = client("cloudwatch", region_name=AWS_REGION_US_EAST_1)
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        s3_client.create_bucket(Bucket="test")
        logs_client.create_log_group(logGroupName="/log-group/test")
        cloudtrail_client.create_trail(
            Name="test_trail",
            S3BucketName="test",
            CloudWatchLogsLogGroupArn=f"arn:aws:logs:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:log-group:/log-group/test:*",
        )
        logs_client.put_metric_filter(
            logGroupName="/log-group/test",
            filterName="test-filter",
            filterPattern='{ ($.errorCode = "*UnauthorizedOperation") || ($.errorCode = "AccessDenied*") || ($.sourceIPAddress!="delivery.logs.amazonaws.com") || ($.eventName!="HeadBucket") }',
            metricTransformations=[
                {
                    "metricName": "my-metric",
                    "metricNamespace": "my-namespace",
                    "metricValue": "$.value",
                }
            ],
        )
        cloudwatch_client.put_metric_alarm(
            AlarmName="test-alarm",
            MetricName="my-metric",
            Namespace="my-namespace",
            Period=10,
            EvaluationPeriods=5,
            Statistic="Average",
            Threshold=2,
            ComparisonOperator="GreaterThanThreshold",
            ActionsEnabled=True,
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import (
            CloudWatch,
            Logs,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_client",
                new=CloudWatch(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls import (
                cloudwatch_log_metric_filter_unauthorized_api_calls,
            )

            check = cloudwatch_log_metric_filter_unauthorized_api_calls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "CloudWatch log group /log-group/test found with metric filter test-filter and alarms set."
            )
            assert result[0].resource_id == "/log-group/test"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:log-group:/log-group/test:*"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_cloudwatch_trail_with_log_group_with_metric_and_alarm_with_newlines(self):
        cloudtrail_client = client("cloudtrail", region_name=AWS_REGION_US_EAST_1)
        cloudwatch_client = client("cloudwatch", region_name=AWS_REGION_US_EAST_1)
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        s3_client.create_bucket(Bucket="test")
        logs_client.create_log_group(logGroupName="/log-group/test")
        cloudtrail_client.create_trail(
            Name="test_trail",
            S3BucketName="test",
            CloudWatchLogsLogGroupArn=f"arn:aws:logs:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:log-group:/log-group/test:*",
        )
        logs_client.put_metric_filter(
            logGroupName="/log-group/test",
            filterName="test-filter",
            filterPattern='{ ($.errorCode = "*UnauthorizedOperation") ||\n ($.errorCode = "AccessDenied*") ||\n ($.sourceIPAddress!="delivery.logs.amazonaws.com") ||\n ($.eventName!="HeadBucket") }',
            metricTransformations=[
                {
                    "metricName": "my-metric",
                    "metricNamespace": "my-namespace",
                    "metricValue": "$.value",
                }
            ],
        )
        cloudwatch_client.put_metric_alarm(
            AlarmName="test-alarm",
            MetricName="my-metric",
            Namespace="my-namespace",
            Period=10,
            EvaluationPeriods=5,
            Statistic="Average",
            Threshold=2,
            ComparisonOperator="GreaterThanThreshold",
            ActionsEnabled=True,
        )

        from prowler.providers.aws.services.cloudtrail.cloudtrail_service import (
            Cloudtrail,
        )
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import (
            CloudWatch,
            Logs,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_client",
                new=CloudWatch(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudtrail_client",
                new=Cloudtrail(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_metric_filter_unauthorized_api_calls.cloudwatch_log_metric_filter_unauthorized_api_calls import (
                cloudwatch_log_metric_filter_unauthorized_api_calls,
            )

            check = cloudwatch_log_metric_filter_unauthorized_api_calls()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "CloudWatch log group /log-group/test found with metric filter test-filter and alarms set."
            )
            assert result[0].resource_id == "/log-group/test"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:log-group:/log-group/test:*"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: codeartifact_service_test.py]---
Location: prowler-master/tests/providers/aws/services/codeartifact/codeartifact_service_test.py

```python
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.codeartifact.codeartifact_service import (
    CodeArtifact,
    LatestPackageVersionStatus,
    OriginInformationValues,
    RestrictionValues,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call

TEST_REPOSITORY_ARN = f"arn:aws:codebuild:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:repository/test-repository"


def mock_make_api_call(self, operation_name, kwarg):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "ListRepositories":
        return {
            "repositories": [
                {
                    "name": "test-repository",
                    "administratorAccount": AWS_ACCOUNT_NUMBER,
                    "domainName": "test-domain",
                    "domainOwner": AWS_ACCOUNT_NUMBER,
                    "arn": TEST_REPOSITORY_ARN,
                    "description": "test description",
                },
            ]
        }
    if operation_name == "ListPackages":
        return {
            "packages": [
                {
                    "format": "pypi",
                    "namespace": "test-namespace",
                    "package": "test-package",
                    "originConfiguration": {
                        "restrictions": {
                            "publish": "ALLOW",
                            "upstream": "ALLOW",
                        }
                    },
                },
            ],
        }

    if operation_name == "ListPackageVersions":
        return {
            "defaultDisplayVersion": "latest",
            "format": "pypi",
            "namespace": "test-namespace",
            "package": "test-package",
            "versions": [
                {
                    "version": "latest",
                    "revision": "lates",
                    "status": "Published",
                    "origin": {
                        "domainEntryPoint": {
                            "repositoryName": "test-repository",
                            "externalConnectionName": "",
                        },
                        "originType": "INTERNAL",
                    },
                },
            ],
        }

    if operation_name == "ListTagsForResource":
        return {
            "tags": [
                {"key": "test", "value": "test"},
            ]
        }

    return make_api_call(self, operation_name, kwarg)


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_CodeArtifact_Service:
    # Test CodeArtifact Client
    def test_get_client(self):
        codeartifact = CodeArtifact(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert (
            codeartifact.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "CodeArtifact"
        )

    # Test CodeArtifact Session
    def test__get_session__(self):
        codeartifact = CodeArtifact(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert codeartifact.session.__class__.__name__ == "Session"

    # Test CodeArtifact Service
    def test__get_service__(self):
        codeartifact = CodeArtifact(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert codeartifact.service == "codeartifact"

    def test_list_repositories(self):
        # Set partition for the service
        codeartifact = CodeArtifact(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )

        assert len(codeartifact.repositories) == 1
        assert codeartifact.repositories
        assert codeartifact.repositories[
            f"arn:aws:codebuild:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:repository/test-repository"
        ]
        assert codeartifact.repositories[TEST_REPOSITORY_ARN].name == "test-repository"
        assert codeartifact.repositories[
            f"arn:aws:codebuild:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:repository/test-repository"
        ].tags == [
            {"key": "test", "value": "test"},
        ]
        assert codeartifact.repositories[TEST_REPOSITORY_ARN].arn == TEST_REPOSITORY_ARN
        assert (
            codeartifact.repositories[TEST_REPOSITORY_ARN].domain_name == "test-domain"
        )
        assert (
            codeartifact.repositories[TEST_REPOSITORY_ARN].domain_owner
            == AWS_ACCOUNT_NUMBER
        )
        assert (
            codeartifact.repositories[TEST_REPOSITORY_ARN].region
            == AWS_REGION_EU_WEST_1
        )

        assert codeartifact.repositories[
            f"arn:aws:codebuild:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:repository/test-repository"
        ].packages
        assert len(codeartifact.repositories[TEST_REPOSITORY_ARN].packages) == 1
        assert (
            codeartifact.repositories[TEST_REPOSITORY_ARN].packages[0].name
            == "test-package"
        )
        assert (
            codeartifact.repositories[TEST_REPOSITORY_ARN].packages[0].namespace
            == "test-namespace"
        )

        assert (
            codeartifact.repositories[TEST_REPOSITORY_ARN].packages[0].format == "pypi"
        )
        assert (
            codeartifact.repositories[TEST_REPOSITORY_ARN]
            .packages[0]
            .origin_configuration.restrictions.publish
            == RestrictionValues.ALLOW
        )
        assert (
            codeartifact.repositories[TEST_REPOSITORY_ARN]
            .packages[0]
            .origin_configuration.restrictions.upstream
            == RestrictionValues.ALLOW
        )

        assert (
            codeartifact.repositories[TEST_REPOSITORY_ARN]
            .packages[0]
            .latest_version.version
            == "latest"
        )

        assert (
            codeartifact.repositories[TEST_REPOSITORY_ARN]
            .packages[0]
            .latest_version.status
            == LatestPackageVersionStatus.Published
        )

        assert (
            codeartifact.repositories[TEST_REPOSITORY_ARN]
            .packages[0]
            .latest_version.origin.origin_type
            == OriginInformationValues.INTERNAL
        )
```

--------------------------------------------------------------------------------

---[FILE: codeartifact_packages_external_public_publishing_disabled_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/codeartifact/codeartifact_packages_external_public_publishing_disabled/codeartifact_packages_external_public_publishing_disabled_fixer_test.py

```python
from unittest import mock

import botocore
from moto import mock_aws

from prowler.providers.aws.services.codeartifact.codeartifact_service import (
    CodeArtifact,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

mock_make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_codeartifact(self, operation_name, kwarg):
    if operation_name == "PutPackageOriginConfiguration":
        return {
            "PackageOriginConfiguration": {
                "Restrictions": {
                    "Publish": "BLOCK",
                    "Upstream": "BLOCK",
                }
            }
        }
    return mock_make_api_call(self, operation_name, kwarg)


def mock_make_api_call_codeartifact_error(self, operation_name, kwarg):
    if operation_name == "PutPackageOriginConfiguration":
        raise botocore.exceptions.ClientError(
            {
                "Error": {
                    "Code": "PackageNotFound",
                    "Message": "PackageNotFound",
                }
            },
            operation_name,
        )
    return mock_make_api_call(self, operation_name, kwarg)


class Test_codeartifact_packages_external_public_publishing_disabled_fixer:
    @mock_aws
    def test_repository_package_public_publishing_origin_internal(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_codeartifact,
        ):
            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.codeartifact.codeartifact_client.codeartifact_client",
                    new=CodeArtifact(aws_provider),
                ),
            ):
                # Test Fixer
                from prowler.providers.aws.services.codeartifact.codeartifact_packages_external_public_publishing_disabled.codeartifact_packages_external_public_publishing_disabled_fixer import (
                    fixer,
                )

                assert fixer("test/test-package", AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_repository_package_public_publishing_origin_internal_error(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_codeartifact_error,
        ):

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.codeartifact.codeartifact_client.codeartifact_client",
                    new=CodeArtifact(aws_provider),
                ),
            ):
                # Test Fixer
                from prowler.providers.aws.services.codeartifact.codeartifact_packages_external_public_publishing_disabled.codeartifact_packages_external_public_publishing_disabled_fixer import (
                    fixer,
                )

                assert not fixer("non-existing-package", AWS_REGION_EU_WEST_1)
```

--------------------------------------------------------------------------------

````
