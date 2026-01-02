---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 455
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 455 of 867)

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

---[FILE: awslambda_function_vpc_multi_az_test.py]---
Location: prowler-master/tests/providers/aws/services/awslambda/awslambda_function_vpc_multi_az/awslambda_function_vpc_multi_az_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_EU_WEST_1_AZB,
    set_mocked_aws_provider,
)


class Test_awslambda_function_vpc_is_in_multi_azs:
    @mock_aws
    def test_no_functions(self):
        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az import (
                awslambda_function_vpc_multi_az,
            )

            check = awslambda_function_vpc_multi_az()
            result = check.execute()

            assert len(result) == 0

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
        function_name = "test_function_outside_vpc"
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
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az import (
                awslambda_function_vpc_multi_az,
            )

            check = awslambda_function_vpc_multi_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} is not inside a VPC."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_function_in_vpc_single_az(self):
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

        # Create VPC
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]

        # Create Subnet
        subnet_id = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.1.0/24",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )["Subnet"]["SubnetId"]

        # Create Security Group
        security_group_id = ec2_client.create_security_group(
            GroupName="test-sg", Description="Test SG", VpcId=vpc_id
        )["GroupId"]

        # Create Lambda Function inside VPC
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)

        function_name = "test_function_in_vpc_single_az"

        function = lambda_client.create_function(
            FunctionName=function_name,
            Runtime="python3.8",
            Role=role_arn,
            Handler="lambda_function.lambda_handler",
            Code={"ZipFile": b"file not used"},
            VpcConfig={
                "SubnetIds": [subnet_id],
                "SecurityGroupIds": [security_group_id],
            },
        )
        function_vpc_id = function["VpcConfig"]["VpcId"]

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.awslambda_client",
                new=Lambda(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az import (
                awslambda_function_vpc_multi_az,
            )

            check = awslambda_function_vpc_multi_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} is inside of VPC {function_vpc_id} that spans only in 1 AZs: {AWS_REGION_EU_WEST_1_AZA}. Must span in at least 2 AZs."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function["FunctionArn"]
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_function_in_vpc_multiple_az(self):
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

        # Create VPC
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]

        # Create Subnets
        subnet_id_a = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.1.0/24",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )["Subnet"]["SubnetId"]

        subnet_id_b = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.2.0/24",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )["Subnet"]["SubnetId"]

        # Create Security Group
        security_group_id = ec2_client.create_security_group(
            GroupName="test-sg", Description="Test SG", VpcId=vpc_id
        )["GroupId"]

        # Create Lambda Function inside VPC
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)

        function_name = "test_function_in_vpc_multiple_az"

        function = lambda_client.create_function(
            FunctionName=function_name,
            Runtime="python3.8",
            Role=role_arn,
            Handler="lambda_function.lambda_handler",
            Code={"ZipFile": b"file not used"},
            VpcConfig={
                "SubnetIds": [subnet_id_a, subnet_id_b],
                "SecurityGroupIds": [security_group_id],
            },
        )

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.awslambda_client",
                new=Lambda(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az import (
                awslambda_function_vpc_multi_az,
            )

            check = awslambda_function_vpc_multi_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} is inside of VPC {function['VpcConfig']['VpcId']} that spans in at least 2 AZs: {AWS_REGION_EU_WEST_1_AZB}, {AWS_REGION_EU_WEST_1_AZA}."
            ) or (
                result[0].status_extended
                == f"Lambda function {function_name} is inside of VPC {function['VpcConfig']['VpcId']} that spans in at least 2 AZs: {AWS_REGION_EU_WEST_1_AZA}, {AWS_REGION_EU_WEST_1_AZB}."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function["FunctionArn"]
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_function_with_multiple_subnets_in_same_az(self):
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

        # Create VPC
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]

        # Create Subnets
        subnet_id_a = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.1.0/24",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )["Subnet"]["SubnetId"]

        subnet_id_b = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.2.0/24",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )["Subnet"]["SubnetId"]

        # Create Security Group
        security_group_id = ec2_client.create_security_group(
            GroupName="test-sg", Description="Test SG", VpcId=vpc_id
        )["GroupId"]

        # Create Lambda Function inside VPC
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)

        function_name = "test_function_in_vpc_multiple_subnets_same_az"

        function = lambda_client.create_function(
            FunctionName=function_name,
            Runtime="python3.8",
            Role=role_arn,
            Handler="lambda_function.lambda_handler",
            Code={"ZipFile": b"file not used"},
            VpcConfig={
                "SubnetIds": [subnet_id_a, subnet_id_b],
                "SecurityGroupIds": [security_group_id],
            },
        )

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.awslambda_client",
                new=Lambda(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az import (
                awslambda_function_vpc_multi_az,
            )

            check = awslambda_function_vpc_multi_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} is inside of VPC {function['VpcConfig']['VpcId']} that spans only in 1 AZs: {AWS_REGION_EU_WEST_1_AZA}. Must span in at least 2 AZs."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function["FunctionArn"]
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_function_no_vpc_pass_to_avoid_fail_twice(self):
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
        function_name = "test_function_no_vpc_pass_to_avoid_fail_twice"
        lambda_client.create_function(
            FunctionName=function_name,
            Runtime="python3.8",
            Role=role_arn,
            Handler="lambda_function.lambda_handler",
            Code={"ZipFile": b"file not used"},
        )["FunctionArn"]

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.awslambda_client",
                new=Lambda(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.vpc_client",
                new=VPC(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_inside_vpc.awslambda_function_inside_vpc.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test check inside_vpc first

            from prowler.providers.aws.services.awslambda.awslambda_function_inside_vpc.awslambda_function_inside_vpc import (
                awslambda_function_inside_vpc,
            )

            check = awslambda_function_inside_vpc()

            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

            # Now test if function is in multiple AZs to ensure it does not fail twice

            from prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az import (
                awslambda_function_vpc_multi_az,
            )

            check = awslambda_function_vpc_multi_az()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_resource_filtered(self):
        # Create a compliant Lambda Function

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

        # Create VPC
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]

        # Create Subnets
        subnet_id_a = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.1.0/24",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )["Subnet"]["SubnetId"]

        subnet_id_b = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.2.0/24",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )["Subnet"]["SubnetId"]

        # Create Security Group
        security_group_id = ec2_client.create_security_group(
            GroupName="test-sg", Description="Test SG", VpcId=vpc_id
        )["GroupId"]

        # Create Lambda Function inside VPC
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)

        function_name = "test_function_resource_filtered"

        function = lambda_client.create_function(
            FunctionName=function_name,
            Runtime="python3.8",
            Role=role_arn,
            Handler="lambda_function.lambda_handler",
            Code={"ZipFile": b"file not used"},
            VpcConfig={
                "SubnetIds": [subnet_id_a, subnet_id_b],
                "SecurityGroupIds": [security_group_id],
            },
        )

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        # Filter the resource in the provider, this is like the --resource-arn option
        aws_provider._audit_resources = [function["FunctionArn"]]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.awslambda_client",
                new=Lambda(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_vpc_multi_az.awslambda_function_vpc_multi_az import (
                awslambda_function_vpc_multi_az,
            )

            check = awslambda_function_vpc_multi_az()
            result = check.execute()

            assert len(result) == 1
            assert (
                result[0].status == "FAIL"
            )  # This should be a PASS, but the resource is filtered so subnets are filtered and this is a bug
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} is inside of VPC {function['VpcConfig']['VpcId']} that spans only in 0 AZs: . Must span in at least 2 AZs."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function["FunctionArn"]
            assert result[0].resource_tags == [{}]
```

--------------------------------------------------------------------------------

---[FILE: backup_service_test.py]---
Location: prowler-master/tests/providers/aws/services/backup/backup_service_test.py

```python
from datetime import datetime
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.backup.backup_service import Backup
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

# Mocking Backup Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    Mock every AWS API call
    """
    if operation_name == "ListBackupVaults":
        return {
            "BackupVaultList": [
                {
                    "BackupVaultArn": "ARN",
                    "BackupVaultName": "Test Vault",
                    "EncryptionKeyArn": "",
                    "NumberOfRecoveryPoints": 0,
                    "Locked": True,
                    "MinRetentionDays": 1,
                    "MaxRetentionDays": 2,
                }
            ]
        }
    if operation_name == "ListBackupPlans":
        return {
            "BackupPlansList": [
                {
                    "BackupPlanArn": "ARN",
                    "BackupPlanId": "ID",
                    "BackupPlanName": "Test Plan",
                    "VersionId": "test_version_id",
                    "LastExecutionDate": datetime(2015, 1, 1),
                    "AdvancedBackupSettings": [],
                }
            ]
        }
    if operation_name == "ListReportPlans":
        return {
            "ReportPlans": [
                {
                    "ReportPlanArn": "ARN",
                    "ReportPlanName": "Test Report Plan",
                    "LastAttemptedExecutionTime": datetime(2015, 1, 1),
                    "LastSuccessfulExecutionTime": datetime(2015, 1, 1),
                }
            ]
        }
    if operation_name == "ListBackupSelections":
        return {
            "BackupSelectionsList": [
                {
                    "SelectionId": "selection-id-1",
                    "SelectionName": "TestSelection",
                    "BackupPlanId": "ID-TestBackupPlan",
                    "CreationDate": datetime(2015, 1, 1),
                    "CreatorRequestId": "request-id-1",
                    "IamRoleArn": "arn:aws:iam::123456789012:role/service-role/AWSBackupDefaultServiceRole",
                }
            ]
        }
    if operation_name == "GetBackupSelection":
        return {
            "BackupSelection": {
                "SelectionName": "TestSelection",
                "IamRoleArn": "arn:aws:iam::123456789012:role/service-role/AWSBackupDefaultServiceRole",
                "Resources": [
                    "arn:aws:dynamodb:eu-west-1:123456789012:table/MyDynamoDBTable"
                ],
            },
            "SelectionId": "selection-id-1",
            "BackupPlanId": "ID-TestBackupPlan",
            "CreationDate": datetime(2015, 1, 1),
            "CreatorRequestId": "request-id-1",
        }
    if operation_name == "ListRecoveryPointsByBackupVault":
        return {
            "RecoveryPoints": [
                {
                    "RecoveryPointArn": "arn:aws:backup:eu-west-1:123456789012:recovery-point:1",
                    "BackupVaultName": "Test Vault",
                    "BackupVaultArn": "arn:aws:backup:eu-west-1:123456789012:backup-vault:Test Vault",
                    "BackupVaultRegion": "eu-west-1",
                    "CreationDate": datetime(2015, 1, 1),
                    "Status": "COMPLETED",
                    "EncryptionKeyArn": "",
                    "ResourceArn": "arn:aws:dynamodb:eu-west-1:123456789012:table/MyDynamoDBTable",
                    "ResourceType": "DynamoDB",
                    "BackupPlanId": "ID-TestBackupPlan",
                    "VersionId": "test_version_id",
                    "IsEncrypted": True,
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


class TestBackupService:
    # Test Backup Client
    @mock_aws
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @patch(
        "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
        new=mock_generate_regional_clients,
    )
    def test_get_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        backup = Backup(aws_provider)
        assert (
            backup.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__ == "Backup"
        )

    # Test Backup Session
    @mock_aws
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @patch(
        "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
        new=mock_generate_regional_clients,
    )
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        access_analyzer = Backup(aws_provider)
        assert access_analyzer.session.__class__.__name__ == "Session"

    # Test Backup Serviceç
    @mock_aws
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @patch(
        "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
        new=mock_generate_regional_clients,
    )
    def test__get_service__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        access_analyzer = Backup(aws_provider)
        assert access_analyzer.service == "backup"

    # Test Backup List Backup Vaults
    @mock_aws
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @patch(
        "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
        new=mock_generate_regional_clients,
    )
    def test_list_backup_vaults(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        backup = Backup(aws_provider)
        assert len(backup.backup_vaults) == 1
        assert backup.backup_vaults[0].arn == "ARN"
        assert backup.backup_vaults[0].name == "Test Vault"
        assert backup.backup_vaults[0].region == AWS_REGION_EU_WEST_1
        assert backup.backup_vaults[0].encryption == ""
        assert backup.backup_vaults[0].recovery_points == 0
        assert backup.backup_vaults[0].locked is True
        assert backup.backup_vaults[0].min_retention_days == 1
        assert backup.backup_vaults[0].max_retention_days == 2

    # Test Backup List Backup Plans
    @mock_aws
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @patch(
        "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
        new=mock_generate_regional_clients,
    )
    def test_list_backup_plans(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        backup = Backup(aws_provider)
        assert len(backup.backup_plans) == 1
        assert backup.backup_plans[0].arn == "ARN"
        assert backup.backup_plans[0].id == "ID"
        assert backup.backup_plans[0].region == AWS_REGION_EU_WEST_1
        assert backup.backup_plans[0].name == "Test Plan"
        assert backup.backup_plans[0].version_id == "test_version_id"
        assert backup.backup_plans[0].last_execution_date == datetime(2015, 1, 1)
        assert backup.backup_plans[0].advanced_settings == []

    # Test Backup List Report Plans
    @mock_aws
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @patch(
        "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
        new=mock_generate_regional_clients,
    )
    def test_list_backup_report_plans(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        backup = Backup(aws_provider)
        assert len(backup.backup_report_plans) == 1
        assert backup.backup_report_plans[0].arn == "ARN"
        assert backup.backup_report_plans[0].region == AWS_REGION_EU_WEST_1
        assert backup.backup_report_plans[0].name == "Test Report Plan"
        assert backup.backup_report_plans[0].last_attempted_execution_date == datetime(
            2015, 1, 1
        )
        assert backup.backup_report_plans[0].last_successful_execution_date == datetime(
            2015, 1, 1
        )

    # Test Backup List Backup Selections
    @mock_aws
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @patch(
        "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
        new=mock_generate_regional_clients,
    )
    def test_list_backup_selections(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        backup = Backup(aws_provider)
        assert len(backup.protected_resources) == 1
        assert (
            "arn:aws:dynamodb:eu-west-1:123456789012:table/MyDynamoDBTable"
            in backup.protected_resources
        )

    @mock_aws
    def test_list_tags(self):
        backup_client = client("backup", region_name=AWS_REGION_EU_WEST_1)

        # Create necessary resources and tags
        backup_vault = backup_client.create_backup_vault(
            BackupVaultName="TestVault",
            EncryptionKeyArn=f"arn:aws:kms:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:key/1234abcd-12ab-34cd-56ef-123456789012",
        )

        tags = {"TestKey": "TestValue"}

        backup_client.tag_resource(
            ResourceArn=backup_vault["BackupVaultArn"], Tags=tags
        )

        # Create a backup plan
        backup_plan = backup_client.create_backup_plan(
            BackupPlan={
                "BackupPlanName": "TestPlan",
                "Rules": [
                    {
                        "RuleName": "TestRule",
                        "TargetBackupVaultName": "TestVault",  # Match the vault name
                        "ScheduleExpression": "cron(0 12 * * ? *)",
                    }
                ],
            }
        )

        backup_client.tag_resource(ResourceArn=backup_plan["BackupPlanArn"], Tags=tags)

        # Test list_tags
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        backup = Backup(aws_provider)

        assert len(backup.backup_vaults) == 1
        assert len(backup.backup_vaults[0].tags) == 1
        assert backup.backup_vaults[0].tags[0]["TestKey"] == "TestValue"
        assert len(backup.backup_plans) == 1
        assert len(backup.backup_plans[0].tags) == 1
        assert backup.backup_plans[0].tags[0]["TestKey"] == "TestValue"

    # Test Backup List Recovery Points
    @mock_aws
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @patch(
        "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
        new=mock_generate_regional_clients,
    )
    def test_list_recovery_points(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        backup = Backup(aws_provider)
        assert len(backup.recovery_points) == 1
        assert (
            backup.recovery_points[0].arn
            == "arn:aws:backup:eu-west-1:123456789012:recovery-point:1"
        )
        assert backup.recovery_points[0].backup_vault_name == "Test Vault"
        assert backup.recovery_points[0].backup_vault_region == "eu-west-1"
        assert backup.recovery_points[0].tags == []
        assert backup.recovery_points[0].encrypted is True
```

--------------------------------------------------------------------------------

---[FILE: backup_plans_exist_test.py]---
Location: prowler-master/tests/providers/aws/services/backup/backup_plans_exist/backup_plans_exist_test.py

```python
from datetime import datetime
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.backup.backup_service import BackupPlan

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_backup_plans_exist:
    def test_no_backup_plans(self):
        backup_client = mock.MagicMock()
        backup_client.audited_account = AWS_ACCOUNT_NUMBER
        backup_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        backup_client.audited_partition = "aws"
        backup_client.region = AWS_REGION
        backup_client.backup_plan_arn_template = f"arn:{backup_client.audited_partition}:backup:{backup_client.region}:{backup_client.audited_account}:backup-plan"
        backup_client.__get_backup_plan_arn_template__ = mock.MagicMock(
            return_value=backup_client.backup_plan_arn_template
        )
        backup_client.backup_plans = []
        backup_client.backup_vaults = ["vault"]
        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_plans_exist.backup_plans_exist.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_plans_exist.backup_plans_exist import (
                backup_plans_exist,
            )

            check = backup_plans_exist()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "No Backup Plan exist."
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:backup:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:backup-plan"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    def test_no_backup_plans_not_vaults(self):
        backup_client = mock.MagicMock
        backup_client.audited_account = AWS_ACCOUNT_NUMBER
        backup_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        backup_client.region = AWS_REGION
        backup_client.backup_plans = []
        backup_client.backup_vaults = []
        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_plans_exist.backup_plans_exist.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_plans_exist.backup_plans_exist import (
                backup_plans_exist,
            )

            check = backup_plans_exist()
            result = check.execute()

            assert len(result) == 0

    def test_one_backup_plan(self):
        backup_client = mock.MagicMock
        backup_client.audited_account = AWS_ACCOUNT_NUMBER
        backup_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        backup_client.region = AWS_REGION
        backup_plan_id = str(uuid4()).upper()
        backup_plan_arn = (
            f"arn:aws:backup:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:plan:{backup_plan_id}"
        )
        backup_client.backup_plans = [
            BackupPlan(
                arn=backup_plan_arn,
                id=backup_plan_id,
                region=AWS_REGION,
                name="MyBackupPlan",
                version_id="version_id",
                last_execution_date=datetime(2015, 1, 1),
                advanced_settings=[],
                tags=[],
            )
        ]
        with (
            mock.patch(
                "prowler.providers.aws.services.backup.backup_service.Backup",
                new=backup_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.backup.backup_plans_exist.backup_plans_exist.backup_client",
                new=backup_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.backup.backup_plans_exist.backup_plans_exist import (
                backup_plans_exist,
            )

            check = backup_plans_exist()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"At least one Backup Plan exists: {result[0].resource_id}."
            )
            assert result[0].resource_id == "MyBackupPlan"
            assert (
                result[0].resource_arn
                == f"arn:aws:backup:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:plan:{backup_plan_id}"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
