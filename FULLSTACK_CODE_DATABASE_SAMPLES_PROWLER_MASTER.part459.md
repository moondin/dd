---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 459
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 459 of 867)

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

---[FILE: bedrock_model_invocation_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/bedrock/bedrock_model_invocation_logging_enabled/bedrock_model_invocation_logging_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_bedrock_model_invocation_logging_enabled:
    @mock_aws
    def test_no_loggings(self):
        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logging_enabled.bedrock_model_invocation_logging_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_model_invocation_logging_enabled.bedrock_model_invocation_logging_enabled import (
                bedrock_model_invocation_logging_enabled,
            )

            check = bedrock_model_invocation_logging_enabled()
            result = check.execute()

            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Bedrock Model Invocation Logging is disabled."
            )
            assert result[0].resource_id == "model-invocation-logging"
            assert (
                result[0].resource_arn
                == f"arn:aws:bedrock:{result[0].region}:123456789012:model-invocation-logging"
            )
            assert result[0].resource_tags == []
            assert result[1].status == "FAIL"
            assert (
                result[1].status_extended
                == "Bedrock Model Invocation Logging is disabled."
            )
            assert result[1].resource_id == "model-invocation-logging"
            assert (
                result[1].resource_arn
                == f"arn:aws:bedrock:{result[1].region}:123456789012:model-invocation-logging"
            )
            assert result[1].resource_tags == []

    @mock_aws
    def test_s3_and_cloudwatch_logging(self):
        bedrock = client("bedrock", region_name=AWS_REGION_US_EAST_1)

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
        bedrock.put_model_invocation_logging_configuration(loggingConfig=logging_config)

        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logging_enabled.bedrock_model_invocation_logging_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_model_invocation_logging_enabled.bedrock_model_invocation_logging_enabled import (
                bedrock_model_invocation_logging_enabled,
            )

            check = bedrock_model_invocation_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Bedrock Model Invocation Logging is enabled in CloudWatch Log Group: Test and S3 Bucket: testconfigbucket."
            )
            assert result[0].resource_id == "model-invocation-logging"
            assert (
                result[0].resource_arn
                == "arn:aws:bedrock:us-east-1:123456789012:model-invocation-logging"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_s3_logging(self):
        bedrock = client("bedrock", region_name=AWS_REGION_US_EAST_1)

        logging_config = {
            "s3Config": {
                "bucketName": "testconfigbucket",
            },
        }
        bedrock.put_model_invocation_logging_configuration(loggingConfig=logging_config)

        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logging_enabled.bedrock_model_invocation_logging_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_model_invocation_logging_enabled.bedrock_model_invocation_logging_enabled import (
                bedrock_model_invocation_logging_enabled,
            )

            check = bedrock_model_invocation_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Bedrock Model Invocation Logging is enabled in S3 Bucket: testconfigbucket."
            )
            assert result[0].resource_id == "model-invocation-logging"
            assert (
                result[0].resource_arn
                == "arn:aws:bedrock:us-east-1:123456789012:model-invocation-logging"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_cloudwatch_logging(self):
        bedrock = client("bedrock", region_name=AWS_REGION_US_EAST_1)

        logging_config = {
            "cloudWatchConfig": {
                "logGroupName": "Test",
                "roleArn": "testrole",
            },
        }
        bedrock.put_model_invocation_logging_configuration(loggingConfig=logging_config)

        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logging_enabled.bedrock_model_invocation_logging_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_model_invocation_logging_enabled.bedrock_model_invocation_logging_enabled import (
                bedrock_model_invocation_logging_enabled,
            )

            check = bedrock_model_invocation_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Bedrock Model Invocation Logging is enabled in CloudWatch Log Group: Test."
            )
            assert result[0].resource_id == "model-invocation-logging"
            assert (
                result[0].resource_arn
                == "arn:aws:bedrock:us-east-1:123456789012:model-invocation-logging"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: bedrock_model_invocation_logs_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/bedrock/bedrock_model_invocation_logs_encryption_enabled/bedrock_model_invocation_logs_encryption_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_bedrock_model_invocation_logs_encryption_enabled:
    @mock_aws
    def test_no_logging(self):
        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled import (
                bedrock_model_invocation_logs_encryption_enabled,
            )

            check = bedrock_model_invocation_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_s3_and_cloudwatch_logging_not_encrypted(self):
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        logs_client.create_log_group(logGroupName="Test")
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        s3_client.create_bucket(Bucket="testconfigbucket")
        bedrock = client("bedrock", region_name=AWS_REGION_US_EAST_1)

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
        bedrock.put_model_invocation_logging_configuration(loggingConfig=logging_config)

        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled import (
                bedrock_model_invocation_logs_encryption_enabled,
            )

            check = bedrock_model_invocation_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Bedrock Model Invocation logs are not encrypted in S3 bucket: testconfigbucket and CloudWatch Log Group: Test."
            )
            assert result[0].resource_id == "model-invocation-logging"
            assert (
                result[0].resource_arn
                == "arn:aws:bedrock:us-east-1:123456789012:model-invocation-logging"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_s3_logging_not_encrypted(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        s3_client.create_bucket(Bucket="testconfigbucket")
        bedrock = client("bedrock", region_name=AWS_REGION_US_EAST_1)

        logging_config = {
            "s3Config": {
                "bucketName": "testconfigbucket",
            },
        }
        bedrock.put_model_invocation_logging_configuration(loggingConfig=logging_config)

        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled import (
                bedrock_model_invocation_logs_encryption_enabled,
            )

            check = bedrock_model_invocation_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Bedrock Model Invocation logs are not encrypted in S3 bucket: testconfigbucket."
            )
            assert result[0].resource_id == "model-invocation-logging"
            assert (
                result[0].resource_arn
                == "arn:aws:bedrock:us-east-1:123456789012:model-invocation-logging"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_cloudwatch_logging_not_encrypted(self):
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        logs_client.create_log_group(logGroupName="Test")
        bedrock = client("bedrock", region_name=AWS_REGION_US_EAST_1)

        logging_config = {
            "cloudWatchConfig": {
                "logGroupName": "Test",
                "roleArn": "testrole",
            },
        }
        bedrock.put_model_invocation_logging_configuration(loggingConfig=logging_config)

        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):

            from prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled import (
                bedrock_model_invocation_logs_encryption_enabled,
            )

            check = bedrock_model_invocation_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Bedrock Model Invocation logs are not encrypted in CloudWatch Log Group: Test."
            )
            assert result[0].resource_id == "model-invocation-logging"
            assert (
                result[0].resource_arn
                == "arn:aws:bedrock:us-east-1:123456789012:model-invocation-logging"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_s3_and_cloudwatch_logging_encrypted(self):
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        logs_client.create_log_group(logGroupName="Test", kmsKeyId="testkey")
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        s3_client.create_bucket(Bucket="testconfigbucket")
        sse_config = {
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256",
                    }
                }
            ]
        }

        s3_client.put_bucket_encryption(
            Bucket="testconfigbucket", ServerSideEncryptionConfiguration=sse_config
        )
        bedrock = client("bedrock", region_name=AWS_REGION_US_EAST_1)

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
        bedrock.put_model_invocation_logging_configuration(loggingConfig=logging_config)

        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled import (
                bedrock_model_invocation_logs_encryption_enabled,
            )

            check = bedrock_model_invocation_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Bedrock Model Invocation logs are encrypted."
            )
            assert result[0].resource_id == "model-invocation-logging"
            assert (
                result[0].resource_arn
                == "arn:aws:bedrock:us-east-1:123456789012:model-invocation-logging"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_s3_logging_encrypted(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        s3_client.create_bucket(Bucket="testconfigbucket")
        sse_config = {
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256",
                    }
                }
            ]
        }

        s3_client.put_bucket_encryption(
            Bucket="testconfigbucket", ServerSideEncryptionConfiguration=sse_config
        )
        bedrock = client("bedrock", region_name=AWS_REGION_US_EAST_1)

        logging_config = {
            "s3Config": {
                "bucketName": "testconfigbucket",
            },
        }
        bedrock.put_model_invocation_logging_configuration(loggingConfig=logging_config)

        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled import (
                bedrock_model_invocation_logs_encryption_enabled,
            )

            check = bedrock_model_invocation_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Bedrock Model Invocation logs are encrypted."
            )
            assert result[0].resource_id == "model-invocation-logging"
            assert (
                result[0].resource_arn
                == "arn:aws:bedrock:us-east-1:123456789012:model-invocation-logging"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_cloudwatch_logging_encrypted(self):
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        logs_client.create_log_group(logGroupName="Test", kmsKeyId="testkey")
        bedrock = client("bedrock", region_name=AWS_REGION_US_EAST_1)

        logging_config = {
            "cloudWatchConfig": {
                "logGroupName": "Test",
                "roleArn": "testrole",
            },
        }
        bedrock.put_model_invocation_logging_configuration(loggingConfig=logging_config)

        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.logs_client",
                new=Logs(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled.s3_client",
                new=S3(aws_provider),
            ),
        ):

            from prowler.providers.aws.services.bedrock.bedrock_model_invocation_logs_encryption_enabled.bedrock_model_invocation_logs_encryption_enabled import (
                bedrock_model_invocation_logs_encryption_enabled,
            )

            check = bedrock_model_invocation_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Bedrock Model Invocation logs are encrypted."
            )
            assert result[0].resource_id == "model-invocation-logging"
            assert (
                result[0].resource_arn
                == "arn:aws:bedrock:us-east-1:123456789012:model-invocation-logging"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudformation_service_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudformation/cloudformation_service_test.py

```python
import datetime
import json
from unittest.mock import patch

import boto3
import botocore
from dateutil.tz import tzutc
from moto import mock_aws

from prowler.providers.aws.services.cloudformation.cloudformation_service import (
    CloudFormation,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

# Dummy CloudFormation Template
dummy_template = {
    "AWSTemplateFormatVersion": "2010-09-09",
    "Description": "Stack 1",
    "Resources": {
        "EC2Instance1": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "ImageId": "EXAMPLE_AMI_ID",
                "KeyName": "dummy",
                "InstanceType": "t2.micro",
                "Tags": [
                    {"Key": "Description", "Value": "Test tag"},
                    {"Key": "Name", "Value": "Name tag for tests"},
                ],
            },
        }
    },
}


# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816

    We have to mock every AWS API call using Boto3
    """
    if operation_name == "CreateStack":
        return {
            "StackId": "arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60"
        }
    if operation_name == "DescribeStacks":
        if "StackName" in kwarg:
            return {
                "Stacks": [
                    {
                        "StackId": "arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60",
                        "StackName": "Test-Stack",
                        "Description": "Stack 1",
                        "Parameters": [],
                        "CreationTime": datetime.datetime(
                            2022, 11, 7, 9, 33, 51, tzinfo=tzutc()
                        ),
                        "StackStatus": "CREATE_COMPLETE",
                        "DisableRollback": False,
                        "NotificationARNs": [],
                        "Outputs": [
                            {
                                "OutputKey": "TestOutput1",
                                "OutputValue": "TestValue1",
                                "Description": "Test Output Description.",
                            }
                        ],
                        "RoleARN": "arn:aws:iam::123456789012:role/moto",
                        "EnableTerminationProtection": True,
                        "Tags": [
                            {"Key": "Tag1", "Value": "Value1"},
                            {"Key": "Tag2", "Value": "Value2"},
                        ],
                    }
                ]
            }
        # Return all Stacks
        else:
            return {
                "Stacks": [
                    {
                        "StackId": "arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60",
                        "StackName": "Test-Stack",
                        "Description": "Stack 1",
                        "Parameters": [],
                        "CreationTime": datetime.datetime(
                            2022, 11, 7, 9, 33, 51, tzinfo=tzutc()
                        ),
                        "StackStatus": "CREATE_COMPLETE",
                        "DisableRollback": False,
                        "NotificationARNs": [],
                        "Outputs": [
                            {
                                "OutputKey": "TestOutput1",
                                "OutputValue": "TestValue1",
                                "Description": "Test Output Description.",
                            }
                        ],
                        "RoleARN": "arn:aws:iam::123456789012:role/moto",
                        "Tags": [
                            {"Key": "Tag1", "Value": "Value1"},
                            {"Key": "Tag2", "Value": "Value2"},
                        ],
                    }
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
class Test_CloudFormation_Service:
    # Test CloudFormation Client
    @mock_aws
    def test_get_client(self):
        cloudformation = CloudFormation(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        assert (
            cloudformation.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "CloudFormation"
        )

    # Test CloudFormation Service
    @mock_aws
    def test__get_service__(self):
        cloudformation = CloudFormation(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        assert (
            cloudformation.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "CloudFormation"
        )

    # Test CloudFormation Session
    @mock_aws
    def test__get_session__(self):
        cloudformation = CloudFormation(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        assert cloudformation.session.__class__.__name__ == "Session"

    @mock_aws
    def test_describe_stacks(self):
        cloudformation_client = boto3.client(
            "cloudformation", region_name=AWS_REGION_EU_WEST_1
        )
        stack_arn = cloudformation_client.create_stack(
            StackName="Test-Stack",
            TemplateBody=json.dumps(dummy_template),
            RoleARN=f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:role/moto",
            Tags=[
                {"Key": "Tag1", "Value": "Value1"},
                {"Key": "Tag2", "Value": "Value2"},
            ],
            EnableTerminationProtection=True,
            Outputs=[
                {
                    "OutputKey": "TestOutput1",
                    "OutputValue": "TestValue1",
                    "Description": "Test Output Description.",
                }
            ],
        )

        cloudformation = CloudFormation(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        assert len(cloudformation.stacks) == 1
        assert cloudformation.stacks[0].arn == stack_arn["StackId"]
        assert cloudformation.stacks[0].name == "Test-Stack"
        assert cloudformation.stacks[0].outputs == ["TestOutput1:TestValue1"]
        assert cloudformation.stacks[0].enable_termination_protection is True
        assert cloudformation.stacks[0].is_nested_stack is False
        assert cloudformation.stacks[0].root_nested_stack == ""
        assert cloudformation.stacks[0].region == AWS_REGION_EU_WEST_1
        assert cloudformation.stacks[0].tags == [
            {"Key": "Tag1", "Value": "Value1"},
            {"Key": "Tag2", "Value": "Value2"},
        ]
```

--------------------------------------------------------------------------------

````
