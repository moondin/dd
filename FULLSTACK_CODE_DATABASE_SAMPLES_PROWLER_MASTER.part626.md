---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 626
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 626 of 867)

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

---[FILE: s3_bucket_server_access_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/s3/s3_bucket_server_access_logging_enabled/s3_bucket_server_access_logging_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_s3_bucket_server_access_logging_enabled:
    @mock_aws
    def test_bucket_no_logging(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_server_access_logging_enabled.s3_bucket_server_access_logging_enabled.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_server_access_logging_enabled.s3_bucket_server_access_logging_enabled import (
                    s3_bucket_server_access_logging_enabled,
                )

                check = s3_bucket_server_access_logging_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} has server access logging disabled."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )

    @mock_aws
    def test_bucket_with_logging(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)
        bucket_owner = s3_client_us_east_1.get_bucket_acl(Bucket=bucket_name_us)[
            "Owner"
        ]
        s3_client_us_east_1.put_bucket_acl(
            Bucket=bucket_name_us,
            AccessControlPolicy={
                "Grants": [
                    {
                        "Grantee": {
                            "URI": "http://acs.amazonaws.com/groups/s3/LogDelivery",
                            "Type": "Group",
                        },
                        "Permission": "WRITE",
                    },
                    {
                        "Grantee": {
                            "URI": "http://acs.amazonaws.com/groups/s3/LogDelivery",
                            "Type": "Group",
                        },
                        "Permission": "READ_ACP",
                    },
                    {
                        "Grantee": {"Type": "CanonicalUser", "ID": bucket_owner["ID"]},
                        "Permission": "FULL_CONTROL",
                    },
                ],
                "Owner": bucket_owner,
            },
        )

        s3_client_us_east_1.put_bucket_logging(
            Bucket=bucket_name_us,
            BucketLoggingStatus={
                "LoggingEnabled": {
                    "TargetBucket": bucket_name_us,
                    "TargetPrefix": "{}/".format(bucket_name_us),
                    "TargetGrants": [
                        {
                            "Grantee": {
                                "ID": "SOMEIDSTRINGHERE9238748923734823917498237489237409123840983274",
                                "Type": "CanonicalUser",
                            },
                            "Permission": "READ",
                        },
                        {
                            "Grantee": {
                                "ID": "SOMEIDSTRINGHERE9238748923734823917498237489237409123840983274",
                                "Type": "CanonicalUser",
                            },
                            "Permission": "WRITE",
                        },
                    ],
                }
            },
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_server_access_logging_enabled.s3_bucket_server_access_logging_enabled.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_server_access_logging_enabled.s3_bucket_server_access_logging_enabled import (
                    s3_bucket_server_access_logging_enabled,
                )

                check = s3_bucket_server_access_logging_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} has server access logging enabled."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_shadow_resource_vulnerability_test.py]---
Location: prowler-master/tests/providers/aws/services/s3/s3_bucket_shadow_resource_vulnerability/s3_bucket_shadow_resource_vulnerability_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.s3.s3_service import Bucket
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_s3_bucket_shadow_resource_vulnerability:
    @mock_aws
    def test_no_buckets(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.identity.identity_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"

        s3_client = mock.MagicMock()
        s3_client.buckets = {}
        s3_client.provider = aws_provider
        s3_client._head_bucket = mock.MagicMock(return_value=False)

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_shadow_resource_vulnerability.s3_bucket_shadow_resource_vulnerability.s3_client",
                new=s3_client,
            ),
        ):
            from prowler.providers.aws.services.s3.s3_bucket_shadow_resource_vulnerability.s3_bucket_shadow_resource_vulnerability import (
                s3_bucket_shadow_resource_vulnerability,
            )

            check = s3_bucket_shadow_resource_vulnerability()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_bucket_owned_by_account(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.identity.identity_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"

        bucket_name = f"sagemaker-{AWS_REGION_US_EAST_1}-{AWS_ACCOUNT_NUMBER}"

        s3_client = mock.MagicMock()
        s3_client.audited_canonical_id = AWS_ACCOUNT_NUMBER
        s3_client.audited_partition = "aws"
        s3_client.buckets = {
            bucket_name: Bucket(
                name=bucket_name,
                arn=f"arn:aws:s3:::{bucket_name}",
                region=AWS_REGION_US_EAST_1,
                owner_id=AWS_ACCOUNT_NUMBER,
                tags=[{"Key": "Environment", "Value": "test"}],
            )
        }
        s3_client.provider = aws_provider
        s3_client._head_bucket = mock.MagicMock(return_value=False)

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_shadow_resource_vulnerability.s3_bucket_shadow_resource_vulnerability.s3_client",
                new=s3_client,
            ),
        ):
            from prowler.providers.aws.services.s3.s3_bucket_shadow_resource_vulnerability.s3_bucket_shadow_resource_vulnerability import (
                s3_bucket_shadow_resource_vulnerability,
            )

            check = s3_bucket_shadow_resource_vulnerability()
            result = check.execute()

            assert len(result) == 1
            report = result[0]

            # Test all report attributes
            assert report.status == "PASS"
            assert report.region == AWS_REGION_US_EAST_1
            assert report.resource_id == bucket_name
            assert report.resource_arn == f"arn:aws:s3:::{bucket_name}"
            assert report.resource_tags == [{"Key": "Environment", "Value": "test"}]
            assert "is correctly owned by the audited account" in report.status_extended
            assert "SageMaker" in report.status_extended

    @mock_aws
    def test_bucket_not_predictable(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.identity.identity_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"

        bucket_name = "my-non-predictable-bucket"

        s3_client = mock.MagicMock()
        s3_client.audited_canonical_id = AWS_ACCOUNT_NUMBER
        s3_client.audited_partition = "aws"
        s3_client.buckets = {
            bucket_name: Bucket(
                name=bucket_name,
                arn=f"arn:aws:s3:::{bucket_name}",
                region=AWS_REGION_US_EAST_1,
                owner_id=AWS_ACCOUNT_NUMBER,
                tags=[{"Key": "Project", "Value": "test-project"}],
            )
        }
        s3_client.provider = aws_provider
        s3_client._head_bucket = mock.MagicMock(return_value=False)

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_shadow_resource_vulnerability.s3_bucket_shadow_resource_vulnerability.s3_client",
                new=s3_client,
            ),
        ):
            from prowler.providers.aws.services.s3.s3_bucket_shadow_resource_vulnerability.s3_bucket_shadow_resource_vulnerability import (
                s3_bucket_shadow_resource_vulnerability,
            )

            check = s3_bucket_shadow_resource_vulnerability()
            result = check.execute()

            assert len(result) == 1
            report = result[0]

            # Test all report attributes
            assert report.status == "PASS"
            assert report.region == AWS_REGION_US_EAST_1
            assert report.resource_id == bucket_name
            assert report.resource_arn == f"arn:aws:s3:::{bucket_name}"
            assert report.resource_tags == [{"Key": "Project", "Value": "test-project"}]
            assert "is not a known shadow resource" in report.status_extended

    @mock_aws
    def test_shadow_resource_in_other_account(self):
        # Mock S3 client with no buckets in current account
        s3_client = mock.MagicMock()
        s3_client.buckets = {}
        s3_client.audited_canonical_id = AWS_ACCOUNT_NUMBER
        s3_client.audited_identity_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        s3_client.audited_partition = "aws"

        # Mock regional clients - this is what the check uses to determine regions to test
        s3_client.regional_clients = {
            "us-east-1": mock.MagicMock(),
            "us-west-2": mock.MagicMock(),
            "eu-west-1": mock.MagicMock(),
        }

        # Define the shadow resources we want to simulate
        shadow_resources = [
            f"aws-glue-assets-{AWS_ACCOUNT_NUMBER}-us-west-2",
            f"sagemaker-us-east-1-{AWS_ACCOUNT_NUMBER}",
            f"aws-emr-studio-{AWS_ACCOUNT_NUMBER}-eu-west-1",
        ]

        # Mock the _head_bucket method to simulate finding shadow resources
        def mock_head_bucket(bucket_name):
            return bucket_name in shadow_resources

        s3_client._head_bucket = mock_head_bucket

        # Mock provider with multiple regions to test
        aws_provider = set_mocked_aws_provider(["us-east-1", "us-west-2", "eu-west-1"])
        aws_provider.identity.identity_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        aws_provider.identity.account = AWS_ACCOUNT_NUMBER
        s3_client.provider = aws_provider

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_shadow_resource_vulnerability.s3_bucket_shadow_resource_vulnerability.s3_client",
                new=s3_client,
            ),
        ):
            from prowler.providers.aws.services.s3.s3_bucket_shadow_resource_vulnerability.s3_bucket_shadow_resource_vulnerability import (
                s3_bucket_shadow_resource_vulnerability,
            )

            check = s3_bucket_shadow_resource_vulnerability()
            result = check.execute()

            # Should find shadow resources
            assert len(result) >= 3

            # Check if we found all expected shadow resources
            found_services = set()
            for finding in result:
                if (
                    finding.status == "FAIL"
                    and "shadow resource" in finding.status_extended
                ):
                    # Test all report attributes for cross-account findings
                    assert finding.status == "FAIL"
                    assert finding.resource_id in shadow_resources
                    assert finding.resource_arn == f"arn:aws:s3:::{finding.resource_id}"
                    assert finding.resource_tags == []

                    # Determine service from resource_id and test exact status_extended
                    if "aws-glue-assets" in finding.resource_id:
                        service = "Glue"
                        expected_status = f"S3 bucket {finding.resource_id} for service {service} is a known shadow resource that exists and is owned by another account."
                        assert finding.status_extended == expected_status
                        found_services.add("Glue")
                        assert finding.region == "us-west-2"
                    elif "sagemaker" in finding.resource_id:
                        service = "SageMaker"
                        expected_status = f"S3 bucket {finding.resource_id} for service {service} is a known shadow resource that exists and is owned by another account."
                        assert finding.status_extended == expected_status
                        found_services.add("SageMaker")
                        assert finding.region == "us-east-1"
                    elif "aws-emr-studio" in finding.resource_id:
                        service = "EMR"
                        expected_status = f"S3 bucket {finding.resource_id} for service {service} is a known shadow resource that exists and is owned by another account."
                        assert finding.status_extended == expected_status
                        found_services.add("EMR")
                        assert finding.region == "eu-west-1"

            # Verify we found all expected services
            expected_services = {"Glue", "SageMaker", "EMR"}
            assert found_services == expected_services
```

--------------------------------------------------------------------------------

---[FILE: s3_multi_region_access_point_public_access_block_test.py]---
Location: prowler-master/tests/providers/aws/services/s3/s3_multi_region_access_point_public_access_block/s3_multi_region_access_point_public_access_block_test.py

```python
from unittest import mock
from unittest.mock import patch

import botocore
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_WEST_2,
    set_mocked_aws_provider,
)

MRAP_NAME = "test-mrap"
BUCKET_NAME = "test-bucket"

# Original botocore _make_api_call function
orig = botocore.client.BaseClient._make_api_call


# Mocked botocore _make_api_call function
def mock_make_api_call_pab_enabled(self, operation_name, kwarg):
    if operation_name == "ListMultiRegionAccessPoints":
        return {
            "AccessPoints": [
                {
                    "Name": MRAP_NAME,
                    "Regions": [
                        {
                            "Bucket": BUCKET_NAME,
                            "Region": "us-west-2",
                        }
                    ],
                    "PublicAccessBlock": {
                        "BlockPublicAcls": True,
                        "IgnorePublicAcls": True,
                        "BlockPublicPolicy": True,
                        "RestrictPublicBuckets": True,
                    },
                }
            ]
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


def mock_make_api_call_pab_disabled(self, operation_name, kwarg):
    if operation_name == "ListMultiRegionAccessPoints":
        return {
            "AccessPoints": [
                {
                    "Name": MRAP_NAME,
                    "Regions": [
                        {
                            "Bucket": BUCKET_NAME,
                            "Region": "us-west-2",
                        }
                    ],
                    "PublicAccessBlock": {
                        "BlockPublicAcls": False,
                        "IgnorePublicAcls": False,
                        "BlockPublicPolicy": False,
                        "RestrictPublicBuckets": False,
                    },
                }
            ]
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


def mock_make_api_call_pab_one_disabled(self, operation_name, kwarg):
    if operation_name == "ListMultiRegionAccessPoints":
        return {
            "AccessPoints": [
                {
                    "Name": MRAP_NAME,
                    "Regions": [
                        {
                            "Bucket": BUCKET_NAME,
                            "Region": "us-west-2",
                        }
                    ],
                    "PublicAccessBlock": {
                        "BlockPublicAcls": False,
                        "IgnorePublicAcls": True,
                        "BlockPublicPolicy": True,
                        "RestrictPublicBuckets": True,
                    },
                }
            ]
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


class Test_s3_multi_region_access_point_public_access_block:
    @mock_aws
    def test_no_multi_region_access_points(self):
        from prowler.providers.aws.services.s3.s3_service import S3Control

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_multi_region_access_point_public_access_block.s3_multi_region_access_point_public_access_block.s3control_client",
                new=S3Control(aws_provider),
            ):
                from prowler.providers.aws.services.s3.s3_multi_region_access_point_public_access_block.s3_multi_region_access_point_public_access_block import (
                    s3_multi_region_access_point_public_access_block,
                )

                check = s3_multi_region_access_point_public_access_block()
                result = check.execute()

                assert len(result) == 0

    @patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_pab_enabled
    )
    def test_multi_region_access_points_with_public_access_block(self):
        from prowler.providers.aws.services.s3.s3_service import S3Control

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_multi_region_access_point_public_access_block.s3_multi_region_access_point_public_access_block.s3control_client",
                new=S3Control(aws_provider),
            ):
                from prowler.providers.aws.services.s3.s3_multi_region_access_point_public_access_block.s3_multi_region_access_point_public_access_block import (
                    s3_multi_region_access_point_public_access_block,
                )

                check = s3_multi_region_access_point_public_access_block()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"S3 Multi Region Access Point {MRAP_NAME} of buckets {BUCKET_NAME} does have Public Access Block enabled."
                )
                assert result[0].resource_id == MRAP_NAME
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3::{AWS_ACCOUNT_NUMBER}:accesspoint/{MRAP_NAME}"
                )

    @patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_pab_disabled
    )
    def test_multi_region_access_points_without_public_access_block(self):
        from prowler.providers.aws.services.s3.s3_service import S3Control

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_multi_region_access_point_public_access_block.s3_multi_region_access_point_public_access_block.s3control_client",
                new=S3Control(aws_provider),
            ):
                from prowler.providers.aws.services.s3.s3_multi_region_access_point_public_access_block.s3_multi_region_access_point_public_access_block import (
                    s3_multi_region_access_point_public_access_block,
                )

                check = s3_multi_region_access_point_public_access_block()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Multi Region Access Point {MRAP_NAME} of buckets {BUCKET_NAME} does not have Public Access Block enabled."
                )
                assert result[0].resource_id == MRAP_NAME
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3::{AWS_ACCOUNT_NUMBER}:accesspoint/{MRAP_NAME}"
                )

    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_pab_one_disabled,
    )
    def test_multi_region_access_points_without_one_public_access_block(self):
        from prowler.providers.aws.services.s3.s3_service import S3Control

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_multi_region_access_point_public_access_block.s3_multi_region_access_point_public_access_block.s3control_client",
                new=S3Control(aws_provider),
            ):
                from prowler.providers.aws.services.s3.s3_multi_region_access_point_public_access_block.s3_multi_region_access_point_public_access_block import (
                    s3_multi_region_access_point_public_access_block,
                )

                check = s3_multi_region_access_point_public_access_block()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Multi Region Access Point {MRAP_NAME} of buckets {BUCKET_NAME} does not have Public Access Block enabled."
                )
                assert result[0].resource_id == MRAP_NAME
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3::{AWS_ACCOUNT_NUMBER}:accesspoint/{MRAP_NAME}"
                )
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_service_test.py]---
Location: prowler-master/tests/providers/aws/services/sagemaker/sagemaker_service_test.py

```python
from unittest.mock import patch
from uuid import uuid4

import botocore

from prowler.providers.aws.services.sagemaker.sagemaker_service import SageMaker
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_notebook_instance = "test-notebook-instance"
notebook_instance_arn = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:notebook-instance/{test_notebook_instance}"
test_model = "test-model"
test_arn_model = (
    f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:model/{test_model}"
)
test_training_job = "test-training-job"
test_arn_training_job = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:training-job/{test_model}"
subnet_id = "subnet-" + str(uuid4())
kms_key_id = str(uuid4())
endpoint_config_name = "endpoint-config-test"
endpoint_config_arn = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:endpoint-config/{endpoint_config_name}"
prod_variant_name = "Variant1"

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListNotebookInstances":
        return {
            "NotebookInstances": [
                {
                    "NotebookInstanceName": test_notebook_instance,
                    "NotebookInstanceArn": notebook_instance_arn,
                },
            ]
        }
    if operation_name == "ListModels":
        return {
            "Models": [
                {
                    "ModelName": test_model,
                    "ModelArn": test_arn_model,
                },
            ]
        }
    if operation_name == "ListTrainingJobs":
        return {
            "TrainingJobSummaries": [
                {
                    "TrainingJobName": test_training_job,
                    "TrainingJobArn": test_arn_training_job,
                },
            ]
        }
    if operation_name == "DescribeNotebookInstance":
        return {
            "SubnetId": subnet_id,
            "KmsKeyId": kms_key_id,
            "DirectInternetAccess": "Enabled",
            "RootAccess": "Enabled",
        }
    if operation_name == "DescribeModel":
        return {
            "VpcConfig": {
                "Subnets": [
                    subnet_id,
                ]
            },
            "EnableNetworkIsolation": True,
        }
    if operation_name == "DescribeTrainingJob":
        return {
            "ResourceConfig": {
                "VolumeKmsKeyId": kms_key_id,
            },
            "VpcConfig": {
                "Subnets": [
                    subnet_id,
                ]
            },
            "EnableNetworkIsolation": True,
            "EnableInterContainerTrafficEncryption": True,
        }
    if operation_name == "ListTags":
        return {
            "Tags": [
                {"Key": "test", "Value": "test"},
            ],
        }
    if operation_name == "ListEndpointConfigs":
        return {
            "EndpointConfigs": [
                {
                    "EndpointConfigName": endpoint_config_name,
                    "EndpointConfigArn": endpoint_config_arn,
                },
            ],
        }
    if operation_name == "DescribeEndpointConfig":
        return {
            "ProductionVariants": [
                {
                    "VariantName": prod_variant_name,
                    "InitialInstanceCount": 5,
                },
                {
                    "VariantName": "Variant2",
                    "InitialInstanceCount": 2,
                },
            ]
        }

    return make_api_call(self, operation_name, kwarg)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_SageMaker_Service:
    # Test SageMaker Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sagemaker = SageMaker(aws_provider)
        assert sagemaker.service == "sagemaker"

    # Test SageMaker client
    def test_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sagemaker = SageMaker(aws_provider)
        for reg_client in sagemaker.regional_clients.values():
            assert reg_client.__class__.__name__ == "SageMaker"

    # Test SageMaker session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sagemaker = SageMaker(aws_provider)
        assert sagemaker.session.__class__.__name__ == "Session"

    # Test SageMaker list notebook instances
    def test_list_notebook_instances(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sagemaker = SageMaker(aws_provider)
        assert len(sagemaker.sagemaker_notebook_instances) == 1
        assert sagemaker.sagemaker_notebook_instances[0].name == test_notebook_instance
        assert sagemaker.sagemaker_notebook_instances[0].arn == notebook_instance_arn
        assert sagemaker.sagemaker_notebook_instances[0].region == AWS_REGION_EU_WEST_1
        assert sagemaker.sagemaker_notebook_instances[0].tags == [
            {"Key": "test", "Value": "test"},
        ]

    # Test SageMaker list models
    def test_list_models(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sagemaker = SageMaker(aws_provider)
        assert len(sagemaker.sagemaker_models) == 1
        assert sagemaker.sagemaker_models[0].name == test_model
        assert sagemaker.sagemaker_models[0].arn == test_arn_model
        assert sagemaker.sagemaker_models[0].region == AWS_REGION_EU_WEST_1
        assert sagemaker.sagemaker_models[0].tags == [
            {"Key": "test", "Value": "test"},
        ]

    # Test SageMaker list training jobs
    def test_list_training_jobs(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sagemaker = SageMaker(aws_provider)
        assert len(sagemaker.sagemaker_training_jobs) == 1
        assert sagemaker.sagemaker_training_jobs[0].name == test_training_job
        assert sagemaker.sagemaker_training_jobs[0].arn == test_arn_training_job
        assert sagemaker.sagemaker_training_jobs[0].region == AWS_REGION_EU_WEST_1
        assert sagemaker.sagemaker_training_jobs[0].tags == [
            {"Key": "test", "Value": "test"},
        ]

    # Test SageMaker describe notebook instance
    def test_describe_notebook_instance(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sagemaker = SageMaker(aws_provider)
        assert len(sagemaker.sagemaker_notebook_instances) == 1
        assert sagemaker.sagemaker_notebook_instances[0].root_access
        assert sagemaker.sagemaker_notebook_instances[0].subnet_id == subnet_id
        assert sagemaker.sagemaker_notebook_instances[0].direct_internet_access
        assert sagemaker.sagemaker_notebook_instances[0].kms_key_id == kms_key_id

    # Test SageMaker describe model
    def test_describe_model(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sagemaker = SageMaker(aws_provider)
        assert len(sagemaker.sagemaker_models) == 1
        assert sagemaker.sagemaker_models[0].network_isolation
        assert sagemaker.sagemaker_models[0].vpc_config_subnets == [subnet_id]

    # Test SageMaker describe training jobs
    def test_describe_training_jobs(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sagemaker = SageMaker(aws_provider)
        assert len(sagemaker.sagemaker_training_jobs) == 1
        assert sagemaker.sagemaker_training_jobs[0].container_traffic_encryption
        assert sagemaker.sagemaker_training_jobs[0].network_isolation
        assert sagemaker.sagemaker_training_jobs[0].volume_kms_key_id == kms_key_id
        assert sagemaker.sagemaker_training_jobs[0].vpc_config_subnets == [subnet_id]

    # Test SageMaker list endpoint configs
    def test_list_endpoint_configs(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sagemaker = SageMaker(aws_provider)
        assert len(sagemaker.endpoint_configs) == 1
        assert (
            sagemaker.endpoint_configs[endpoint_config_arn].name == endpoint_config_name
        )
        assert (
            sagemaker.endpoint_configs[endpoint_config_arn].arn == endpoint_config_arn
        )
        assert (
            sagemaker.endpoint_configs[endpoint_config_arn].region
            == AWS_REGION_EU_WEST_1
        )
        assert sagemaker.sagemaker_notebook_instances[0].tags == [
            {"Key": "test", "Value": "test"},
        ]

    # Test SageMaker describe training jobs
    def test_describe_endpoint_configs(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sagemaker = SageMaker(aws_provider)
        assert len(sagemaker.endpoint_configs) == 1
        assert sagemaker.endpoint_configs[endpoint_config_arn].production_variants
        for prod_variant in sagemaker.endpoint_configs[
            endpoint_config_arn
        ].production_variants:
            if prod_variant.name == prod_variant_name:
                assert prod_variant.initial_instance_count == 5
            else:
                assert prod_variant.initial_instance_count == 2
```

--------------------------------------------------------------------------------

````
