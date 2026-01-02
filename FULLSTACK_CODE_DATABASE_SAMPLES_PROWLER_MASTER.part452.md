---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 452
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 452 of 867)

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

---[FILE: autoscaling_group_using_ec2_launch_template_test.py]---
Location: prowler-master/tests/providers/aws/services/autoscaling/autoscaling_group_using_ec2_launch_template/autoscaling_group_using_ec2_launch_template_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_autoscaling_group_using_ec2_launch_template:
    @mock_aws
    def test_no_autoscaling(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.groups = []

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_using_ec2_launch_template.autoscaling_group_using_ec2_launch_template.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_using_ec2_launch_template.autoscaling_group_using_ec2_launch_template import (
                autoscaling_group_using_ec2_launch_template,
            )

            check = autoscaling_group_using_ec2_launch_template()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_groups_with_launch_template(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_launch_template(
            LaunchTemplateName="test",
            LaunchTemplateData={
                "ImageId": "ami-12c6146b",
                "InstanceType": "t1.micro",
                "KeyName": "the_keys",
                "SecurityGroups": ["default", "default2"],
            },
        )
        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchTemplate={"LaunchTemplateName": "test", "Version": "$Latest"},
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a", "us-east-1b"],
            Tags=[],
        )

        autoscaling_group_arn = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name]
        )["AutoScalingGroups"][0]["AutoScalingGroupARN"]

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_using_ec2_launch_template.autoscaling_group_using_ec2_launch_template.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_using_ec2_launch_template.autoscaling_group_using_ec2_launch_template import (
                autoscaling_group_using_ec2_launch_template,
            )

            check = autoscaling_group_using_ec2_launch_template()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} is using an EC2 launch template."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_arn == autoscaling_group_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_groups_with_mixed_policy_launch_template(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_group_name = "my-autoscaling-group"
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_launch_template(
            LaunchTemplateName="test",
            LaunchTemplateData={
                "ImageId": "ami-12c6146b",
                "InstanceType": "t1.micro",
                "KeyName": "the_keys",
                "SecurityGroups": ["default", "default2"],
            },
        )
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            MixedInstancesPolicy={
                "LaunchTemplate": {
                    "LaunchTemplateSpecification": {
                        "LaunchTemplateName": "test",
                        "Version": "$Latest",
                    },
                    "Overrides": [
                        {
                            "InstanceType": "t2.micro",
                            "WeightedCapacity": "1",
                        },
                    ],
                },
            },
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a", "us-east-1b"],
            Tags=[],
        )

        autoscaling_group_arn = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name]
        )["AutoScalingGroups"][0]["AutoScalingGroupARN"]

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_using_ec2_launch_template.autoscaling_group_using_ec2_launch_template.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_using_ec2_launch_template.autoscaling_group_using_ec2_launch_template import (
                autoscaling_group_using_ec2_launch_template,
            )

            check = autoscaling_group_using_ec2_launch_template()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} is using an EC2 launch template."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_tags == []
            assert result[0].resource_arn == autoscaling_group_arn

    @mock_aws
    def test_groups_without_launch_templates(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
        )
        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a", "us-east-1b"],
        )

        autoscaling_group_arn = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name]
        )["AutoScalingGroups"][0]["AutoScalingGroupARN"]

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_using_ec2_launch_template.autoscaling_group_using_ec2_launch_template.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_using_ec2_launch_template.autoscaling_group_using_ec2_launch_template import (
                autoscaling_group_using_ec2_launch_template,
            )

            check = autoscaling_group_using_ec2_launch_template()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} is not using an EC2 launch template."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_tags == []
            assert result[0].resource_arn == autoscaling_group_arn
```

--------------------------------------------------------------------------------

---[FILE: awslambda_service_test.py]---
Location: prowler-master/tests/providers/aws/services/awslambda/awslambda_service_test.py

```python
import io
import os
import tempfile
import zipfile
from re import search
from unittest.mock import patch

import mock
from boto3 import client, resource
from moto import mock_aws

from prowler.providers.aws.services.awslambda.awslambda_service import AuthType, Lambda
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

LAMBDA_FUNCTION_CODE = """def lambda_handler(event, context):
print("custom log event")
return event
            """


def create_zip_file(code: str = "") -> io.BytesIO:
    zip_output = io.BytesIO()
    zip_file = zipfile.ZipFile(zip_output, "w", zipfile.ZIP_DEFLATED)
    if not code:
        zip_file.writestr(
            "lambda_function.py",
            LAMBDA_FUNCTION_CODE,
        )
    else:
        zip_file.writestr("lambda_function.py", code)
    zip_file.close()
    zip_output.seek(0)
    return zip_output


def mock_request_get(_):
    """Mock requests.get() to get the Lambda Code in Zip Format"""
    mock_resp = mock.MagicMock
    mock_resp.status_code = 200
    mock_resp.content = create_zip_file().read()
    return mock_resp


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client_eu_west_1 = provider.session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client_us_east_1 = provider.session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client_eu_west_1.region = AWS_REGION_EU_WEST_1
    regional_client_us_east_1.region = AWS_REGION_US_EAST_1
    return {
        AWS_REGION_EU_WEST_1: regional_client_eu_west_1,
        AWS_REGION_US_EAST_1: regional_client_us_east_1,
    }


@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_Lambda_Service:
    # Test Lambda Client
    def test_get_client(self):
        awslambda = Lambda(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert (
            awslambda.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "Lambda"
        )

    # Test Lambda Session
    def test__get_session__(self):
        awslambda = Lambda(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert awslambda.session.__class__.__name__ == "Session"

    # Test Lambda Service
    def test__get_service__(self):
        awslambda = Lambda(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert awslambda.service == "lambda"

    @mock_aws
    def test_list_functions(self):
        # Create IAM Lambda Role
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        iam_role = iam_client.create_role(
            RoleName="test-lambda-role",
            AssumeRolePolicyDocument="test-policy",
            Path="/",
        )["Role"]["Arn"]
        # Create S3 Bucket
        s3_client = resource("s3", region_name=AWS_REGION_EU_WEST_1)
        s3_client.create_bucket(
            Bucket="test-bucket",
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION_EU_WEST_1},
        )
        # Create Test Lambda 1
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)
        lambda_name_1 = "test-lambda-1"
        resp = lambda_client.create_function(
            FunctionName=lambda_name_1,
            Runtime="python3.7",
            Role=iam_role,
            Handler="lambda_function.lambda_handler",
            Code={"ZipFile": create_zip_file().read()},
            Description="test lambda function",
            Timeout=3,
            MemorySize=128,
            PackageType="ZIP",
            Publish=True,
            VpcConfig={
                "SecurityGroupIds": ["sg-123abc"],
                "SubnetIds": ["subnet-123abc"],
            },
            Environment={"Variables": {"db-password": "test-password"}},
            Tags={"test": "test"},
        )
        lambda_arn_1 = resp["FunctionArn"]
        # Update Lambda Policy
        lambda_policy = {
            "Version": "2012-10-17",
            "Id": "default",
            "Statement": [
                {
                    "Action": "lambda:GetFunction",
                    "Principal": "*",
                    "Effect": "Allow",
                    "Resource": f"arn:aws:lambda:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:function:{lambda_name_1}",
                    "Sid": "test",
                }
            ],
        }
        _ = lambda_client.add_permission(
            FunctionName=lambda_name_1,
            StatementId="test",
            Action="lambda:GetFunction",
            Principal="*",
        )
        # Create Function URL Config
        _ = lambda_client.create_function_url_config(
            FunctionName=lambda_name_1,
            AuthType=AuthType.AWS_IAM.value,
            Cors={
                "AllowCredentials": True,
                "AllowHeaders": [
                    "string",
                ],
                "AllowMethods": [
                    "string",
                ],
                "AllowOrigins": [
                    "*",
                ],
                "ExposeHeaders": [
                    "string",
                ],
                "MaxAge": 123,
            },
        )

        # Create Test Lambda 2 (with the same attributes but different region)
        lambda_client_2 = client("lambda", region_name=AWS_REGION_US_EAST_1)
        lambda_name_2 = "test-lambda-2"
        resp_2 = lambda_client_2.create_function(
            FunctionName=lambda_name_2,
            Runtime="python3.7",
            Role=iam_role,
            Handler="lambda_function.lambda_handler",
            Code={"ZipFile": create_zip_file().read()},
            Description="test lambda function",
            Timeout=3,
            MemorySize=128,
            PackageType="ZIP",
            Publish=True,
            VpcConfig={
                "SecurityGroupIds": ["sg-123abc"],
                "SubnetIds": ["subnet-123abc"],
            },
            Environment={"Variables": {"db-password": "test-password"}},
            Tags={"test": "test"},
        )
        lambda_arn_2 = resp_2["FunctionArn"]

        with mock.patch(
            "prowler.providers.aws.services.awslambda.awslambda_service.requests.get",
            new=mock_request_get,
        ):
            awslambda = Lambda(
                set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])
            )
            assert awslambda.functions
            assert len(awslambda.functions) == 2
            # Lambda 1
            assert awslambda.functions[lambda_arn_1].name == lambda_name_1
            assert awslambda.functions[lambda_arn_1].arn == lambda_arn_1
            assert awslambda.functions[lambda_arn_1].runtime == "python3.7"
            assert awslambda.functions[lambda_arn_1].environment == {
                "db-password": "test-password"
            }
            assert awslambda.functions[lambda_arn_1].region == AWS_REGION_EU_WEST_1
            assert awslambda.functions[lambda_arn_1].policy == lambda_policy

            assert awslambda.functions[lambda_arn_1].url_config
            assert (
                awslambda.functions[lambda_arn_1].url_config.auth_type
                == AuthType.AWS_IAM
            )
            assert search(
                "lambda-url.eu-west-1.on.aws",
                awslambda.functions[lambda_arn_1].url_config.url,
            )

            assert awslambda.functions[lambda_arn_1].url_config.cors_config
            assert awslambda.functions[
                lambda_arn_1
            ].url_config.cors_config.allow_origins == ["*"]
            assert awslambda.functions[lambda_arn_1].vpc_id == "vpc-123abc"
            assert awslambda.functions[lambda_arn_1].subnet_ids == {"subnet-123abc"}

            assert awslambda.functions[lambda_arn_1].tags == [{"test": "test"}]

            # Lambda 2
            assert awslambda.functions[lambda_arn_2].name == lambda_name_2
            assert awslambda.functions[lambda_arn_2].arn == lambda_arn_2
            assert awslambda.functions[lambda_arn_2].runtime == "python3.7"
            assert awslambda.functions[lambda_arn_2].environment == {
                "db-password": "test-password"
            }
            assert awslambda.functions[lambda_arn_2].region == AWS_REGION_US_EAST_1
            # Emtpy policy
            assert awslambda.functions[lambda_arn_2].policy == {}

            # Lambda Code
            with tempfile.TemporaryDirectory() as tmp_dir_name:
                for function, function_code in awslambda._get_function_code():
                    if function.arn == lambda_arn_1 or function.arn == lambda_arn_2:
                        assert search(
                            f"https://awslambda-{function.region}-tasks.s3.{function.region}.amazonaws.com",
                            function_code.location,
                        )
                        assert function_code
                        function_code.code_zip.extractall(tmp_dir_name)
                        files_in_zip = next(os.walk(tmp_dir_name))[2]
                        assert len(files_in_zip) == 1
                        assert files_in_zip[0] == "lambda_function.py"
                        with open(
                            f"{tmp_dir_name}/{files_in_zip[0]}", "r"
                        ) as lambda_code_file:
                            assert lambda_code_file.read() == LAMBDA_FUNCTION_CODE
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_inside_vpc_test.py]---
Location: prowler-master/tests/providers/aws/services/awslambda/awslambda_function_inside_vpc/awslambda_function_inside_vpc_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_awslambda_function_inside_vpc:
    def test_no_functions(self):
        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda

        aws_provider = set_mocked_aws_provider(AWS_REGION_EU_WEST_1)

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_inside_vpc.awslambda_function_inside_vpc.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_inside_vpc.awslambda_function_inside_vpc import (
                awslambda_function_inside_vpc,
            )

            check = awslambda_function_inside_vpc()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_function_inside_vpc(self):
        # Create IAM Role for Lambda Function
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        role_name = "test-role"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"Service": "lambda.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                }
            ],
        }
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )["Role"]["Arn"]

        # Create Lambda Function inside VPC
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)
        function_name = "test_function"
        function_arn = lambda_client.create_function(
            FunctionName=function_name,
            Runtime="python3.8",
            Role=role_arn,
            Handler="lambda_function.lambda_handler",
            Code={"ZipFile": b"file not used"},
            VpcConfig={
                "SubnetIds": ["subnet-12345678"],
                "SecurityGroupIds": ["sg-12345678"],
            },
        )["FunctionArn"]

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_inside_vpc.awslambda_function_inside_vpc.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.awslambda.awslambda_function_inside_vpc.awslambda_function_inside_vpc import (
                awslambda_function_inside_vpc,
            )

            check = awslambda_function_inside_vpc()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Lambda function test_function is inside of VPC vpc-123abc"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_function_outside_vpc(self):
        # Create IAM Role for Lambda Function
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        role_name = "test-role"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"Service": "lambda.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                }
            ],
        }
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )["Role"]["Arn"]

        # Create Lambda Function outside VPC
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)
        function_name = "test_function"
        function_arn = lambda_client.create_function(
            FunctionName=function_name,
            Runtime="python3.8",
            Role=role_arn,
            Handler="lambda_function.lambda_handler",
            Code={"ZipFile": b"file not used"},
        )["FunctionArn"]

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_inside_vpc.awslambda_function_inside_vpc.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.awslambda.awslambda_function_inside_vpc.awslambda_function_inside_vpc import (
                awslambda_function_inside_vpc,
            )

            check = awslambda_function_inside_vpc()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Lambda function test_function is not inside a VPC"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].resource_tags == [{}]
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_not_publicly_accessible_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/awslambda/awslambda_function_not_publicly_accessible/awslambda_function_not_publicly_accessible_fixer_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_awslambda_function_not_publicly_accessible_fixer:
    @mock_aws
    def test_function_public(self):
        # Create the mock IAM role
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        role_name = "test-role"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"Service": "lambda.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                }
            ],
        }
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )["Role"]["Arn"]

        function_name = "test-lambda"

        # Create the lambda function using boto3 client
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)
        lambda_client.create_function(
            FunctionName=function_name,
            Runtime="nodejs4.3",
            Role=role_arn,
            Handler="index.handler",
            Code={"ZipFile": b"fileb://file-path/to/your-deployment-package.zip"},
            Description="Test Lambda function",
            Timeout=3,
            MemorySize=128,
            Publish=True,
            Tags={"tag1": "value1", "tag2": "value2"},
        )["FunctionArn"]

        # Attach the policy to the lambda function with a wildcard principal
        lambda_client.add_permission(
            FunctionName=function_name,
            StatementId="public-access",
            Action="lambda:InvokeFunction",
            Principal="*",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_not_publicly_accessible.awslambda_function_not_publicly_accessible_fixer.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.awslambda.awslambda_function_not_publicly_accessible.awslambda_function_not_publicly_accessible_fixer import (
                fixer,
            )

            assert fixer(function_name, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_function_public_with_source_account(self):
        # Create the mock IAM role
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        role_name = "test-role"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"Service": "lambda.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                }
            ],
        }
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )["Role"]["Arn"]

        function_name = "test-lambda"

        # Create the lambda function using boto3 client
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)
        function_arn = lambda_client.create_function(
            FunctionName=function_name,
            Runtime="nodejs4.3",
            Role=role_arn,
            Handler="index.handler",
            Code={"ZipFile": b"fileb://file-path/to/your-deployment-package.zip"},
            Description="Test Lambda function",
            Timeout=3,
            MemorySize=128,
            Publish=True,
            Tags={"tag1": "value1", "tag2": "value2"},
        )["FunctionArn"]

        # Attach the policy to the lambda function with a wildcard principal
        lambda_client.add_permission(
            FunctionName=function_name,
            StatementId="public-access",
            Action="lambda:InvokeFunction",
            Principal="*",
            SourceArn=function_arn,
            SourceAccount=AWS_ACCOUNT_NUMBER,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_not_publicly_accessible.awslambda_function_not_publicly_accessible_fixer.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.awslambda.awslambda_function_not_publicly_accessible.awslambda_function_not_publicly_accessible_fixer import (
                fixer,
            )

            assert fixer(function_name, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_function_not_public(self):
        # Create the mock IAM role
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        role_name = "test-role"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"Service": "lambda.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                }
            ],
        }
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )["Role"]["Arn"]

        function_name = "test-lambda"

        # Create the lambda function using boto3 client
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)
        function_arn = lambda_client.create_function(
            FunctionName=function_name,
            Runtime="nodejs4.3",
            Role=role_arn,
            Handler="index.handler",
            Code={"ZipFile": b"fileb://file-path/to/your-deployment-package.zip"},
            Description="Test Lambda function",
            Timeout=3,
            MemorySize=128,
            Publish=True,
            Tags={"tag1": "value1", "tag2": "value2"},
        )["FunctionArn"]

        # Attach the policy to the lambda function with a specific AWS account number as principal
        lambda_client.add_permission(
            FunctionName=function_name,
            StatementId="public-access",
            Action="lambda:InvokeFunction",
            Principal=AWS_ACCOUNT_NUMBER,
            SourceArn=function_arn,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_not_publicly_accessible.awslambda_function_not_publicly_accessible_fixer.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.awslambda.awslambda_function_not_publicly_accessible.awslambda_function_not_publicly_accessible_fixer import (
                fixer,
            )

            assert fixer(function_name, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_function_public_error(self):
        # Create the mock IAM role
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        role_name = "test-role"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"Service": "lambda.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                }
            ],
        }
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )["Role"]["Arn"]

        function_name = "test-lambda"

        # Create the lambda function using boto3 client
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)
        lambda_client.create_function(
            FunctionName=function_name,
            Runtime="nodejs4.3",
            Role=role_arn,
            Handler="index.handler",
            Code={"ZipFile": b"fileb://file-path/to/your-deployment-package.zip"},
            Description="Test Lambda function",
            Timeout=3,
            MemorySize=128,
            Publish=True,
            Tags={"tag1": "value1", "tag2": "value2"},
        )["FunctionArn"]

        # Attach the policy to the lambda function with a wildcard principal
        lambda_client.add_permission(
            FunctionName=function_name,
            StatementId="public-access",
            Action="lambda:InvokeFunction",
            Principal="*",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_not_publicly_accessible.awslambda_function_not_publicly_accessible_fixer.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.awslambda.awslambda_function_not_publicly_accessible.awslambda_function_not_publicly_accessible_fixer import (
                fixer,
            )

            assert not fixer("non-exsting", AWS_REGION_EU_WEST_1)
```

--------------------------------------------------------------------------------

````
