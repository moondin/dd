---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 628
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 628 of 867)

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

---[FILE: sagemaker_training_jobs_network_isolation_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/sagemaker/sagemaker_training_jobs_network_isolation_enabled/sagemaker_training_jobs_network_isolation_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.sagemaker.sagemaker_service import TrainingJob
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_training_job = "test-training-job"
training_job_arn = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:training-job/{test_training_job}"
kms_key_id = str(uuid4())


class Test_sagemaker_training_jobs_network_isolation_enabled:
    def test_no_training_jobs(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_network_isolation_enabled.sagemaker_training_jobs_network_isolation_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_network_isolation_enabled.sagemaker_training_jobs_network_isolation_enabled import (
                sagemaker_training_jobs_network_isolation_enabled,
            )

            check = sagemaker_training_jobs_network_isolation_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_instance_traffic_encryption_enabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []
        sagemaker_client.sagemaker_training_jobs.append(
            TrainingJob(
                name=test_training_job,
                arn=training_job_arn,
                region=AWS_REGION_EU_WEST_1,
                network_isolation=True,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_network_isolation_enabled.sagemaker_training_jobs_network_isolation_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_network_isolation_enabled.sagemaker_training_jobs_network_isolation_enabled import (
                sagemaker_training_jobs_network_isolation_enabled,
            )

            check = sagemaker_training_jobs_network_isolation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Sagemaker training job {test_training_job} has network isolation enabled."
            )
            assert result[0].resource_id == test_training_job
            assert result[0].resource_arn == training_job_arn

    def test_instance_traffic_encryption_disabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []
        sagemaker_client.sagemaker_training_jobs.append(
            TrainingJob(
                name=test_training_job,
                arn=training_job_arn,
                region=AWS_REGION_EU_WEST_1,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_network_isolation_enabled.sagemaker_training_jobs_network_isolation_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_network_isolation_enabled.sagemaker_training_jobs_network_isolation_enabled import (
                sagemaker_training_jobs_network_isolation_enabled,
            )

            check = sagemaker_training_jobs_network_isolation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Sagemaker training job {test_training_job} has network isolation disabled."
            )
            assert result[0].resource_id == test_training_job
            assert result[0].resource_arn == training_job_arn
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_training_jobs_volume_and_output_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/sagemaker/sagemaker_training_jobs_volume_and_output_encryption_enabled/sagemaker_training_jobs_volume_and_output_encryption_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.sagemaker.sagemaker_service import TrainingJob
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_training_job = "test-training-job"
training_job_arn = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:training-job/{test_training_job}"
kms_key_id = str(uuid4())


class Test_sagemaker_training_jobs_volume_and_output_encryption_enabled:
    def test_no_training_jobs(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_volume_and_output_encryption_enabled.sagemaker_training_jobs_volume_and_output_encryption_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_volume_and_output_encryption_enabled.sagemaker_training_jobs_volume_and_output_encryption_enabled import (
                sagemaker_training_jobs_volume_and_output_encryption_enabled,
            )

            check = sagemaker_training_jobs_volume_and_output_encryption_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_instance_traffic_encryption_enabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []
        sagemaker_client.sagemaker_training_jobs.append(
            TrainingJob(
                name=test_training_job,
                arn=training_job_arn,
                region=AWS_REGION_EU_WEST_1,
                volume_kms_key_id=kms_key_id,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_volume_and_output_encryption_enabled.sagemaker_training_jobs_volume_and_output_encryption_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_volume_and_output_encryption_enabled.sagemaker_training_jobs_volume_and_output_encryption_enabled import (
                sagemaker_training_jobs_volume_and_output_encryption_enabled,
            )

            check = sagemaker_training_jobs_volume_and_output_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Sagemaker training job {test_training_job} has KMS encryption enabled."
            )
            assert result[0].resource_id == test_training_job
            assert result[0].resource_arn == training_job_arn

    def test_instance_traffic_encryption_disabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []
        sagemaker_client.sagemaker_training_jobs.append(
            TrainingJob(
                name=test_training_job,
                arn=training_job_arn,
                region=AWS_REGION_EU_WEST_1,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_volume_and_output_encryption_enabled.sagemaker_training_jobs_volume_and_output_encryption_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_volume_and_output_encryption_enabled.sagemaker_training_jobs_volume_and_output_encryption_enabled import (
                sagemaker_training_jobs_volume_and_output_encryption_enabled,
            )

            check = sagemaker_training_jobs_volume_and_output_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Sagemaker training job {test_training_job} has KMS encryption disabled."
            )
            assert result[0].resource_id == test_training_job
            assert result[0].resource_arn == training_job_arn
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_training_jobs_vpc_settings_configured_test.py]---
Location: prowler-master/tests/providers/aws/services/sagemaker/sagemaker_training_jobs_vpc_settings_configured/sagemaker_training_jobs_vpc_settings_configured_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.sagemaker.sagemaker_service import TrainingJob
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_training_job = "test-training-job"
training_job_arn = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:training-job/{test_training_job}"
subnet_id = "subnet-" + str(uuid4())


class Test_sagemaker_training_jobs_vpc_settings_configured:
    def test_no_training_jobs(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_vpc_settings_configured.sagemaker_training_jobs_vpc_settings_configured.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_vpc_settings_configured.sagemaker_training_jobs_vpc_settings_configured import (
                sagemaker_training_jobs_vpc_settings_configured,
            )

            check = sagemaker_training_jobs_vpc_settings_configured()
            result = check.execute()
            assert len(result) == 0

    def test_instance_traffic_encryption_enabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []
        sagemaker_client.sagemaker_training_jobs.append(
            TrainingJob(
                name=test_training_job,
                arn=training_job_arn,
                region=AWS_REGION_EU_WEST_1,
                vpc_config_subnets=[subnet_id],
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_vpc_settings_configured.sagemaker_training_jobs_vpc_settings_configured.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_vpc_settings_configured.sagemaker_training_jobs_vpc_settings_configured import (
                sagemaker_training_jobs_vpc_settings_configured,
            )

            check = sagemaker_training_jobs_vpc_settings_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Sagemaker training job {test_training_job} has VPC settings for the training job volume and output enabled."
            )
            assert result[0].resource_id == test_training_job
            assert result[0].resource_arn == training_job_arn

    def test_instance_traffic_encryption_disabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []
        sagemaker_client.sagemaker_training_jobs.append(
            TrainingJob(
                name=test_training_job,
                arn=training_job_arn,
                region=AWS_REGION_EU_WEST_1,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_vpc_settings_configured.sagemaker_training_jobs_vpc_settings_configured.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_vpc_settings_configured.sagemaker_training_jobs_vpc_settings_configured import (
                sagemaker_training_jobs_vpc_settings_configured,
            )

            check = sagemaker_training_jobs_vpc_settings_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Sagemaker training job {test_training_job} has VPC settings for the training job volume and output disabled."
            )
            assert result[0].resource_id == test_training_job
            assert result[0].resource_arn == training_job_arn
```

--------------------------------------------------------------------------------

---[FILE: secretsmanager_service_test.py]---
Location: prowler-master/tests/providers/aws/services/secretsmanager/secretsmanager_service_test.py

```python
import io
import zipfile
from datetime import datetime, timezone
from unittest.mock import patch

from boto3 import client, resource
from freezegun import freeze_time
from moto import mock_aws

from prowler.providers.aws.services.secretsmanager.secretsmanager_service import (
    SecretsManager,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_SecretsManager_Service:
    # Test SecretsManager Client
    @mock_aws
    def test_get_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        secretsmanager = SecretsManager(aws_provider)
        assert (
            secretsmanager.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "SecretsManager"
        )

    # Test SecretsManager Session
    @mock_aws
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        secretsmanager = SecretsManager(aws_provider)
        assert secretsmanager.session.__class__.__name__ == "Session"

    # Test SecretsManager Service
    @mock_aws
    def test__get_service__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        secretsmanager = SecretsManager(aws_provider)
        assert secretsmanager.service == "secretsmanager"

    @freeze_time("2023-04-09")
    @mock_aws
    def test_list_secrets(self):
        secretsmanager_client = client(
            "secretsmanager", region_name=AWS_REGION_EU_WEST_1
        )
        # Create Secret
        resp = secretsmanager_client.create_secret(
            Name="test-secret",
            SecretString="test-secret",
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
        )
        secret_arn = resp["ARN"]
        secret_name = resp["Name"]
        # Create IAM Lambda Role
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        iam_role = iam_client.create_role(
            RoleName="rotation-lambda-role",
            AssumeRolePolicyDocument="test-policy",
            Path="/",
        )["Role"]["Arn"]
        # Create S3 Bucket
        s3_client = resource("s3", region_name=AWS_REGION_EU_WEST_1)
        s3_client.create_bucket(
            Bucket="test-bucket",
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION_EU_WEST_1},
        )
        # Create Lambda Code
        zip_output = io.BytesIO()
        zip_file = zipfile.ZipFile(zip_output, "w", zipfile.ZIP_DEFLATED)
        zip_file.writestr(
            "lambda_function.py",
            """
            def lambda_handler(event, context):
                print("custom log event")
                return event
            """,
        )
        zip_file.close()
        zip_output.seek(0)
        # Create Rotation Lambda
        lambda_client = client("lambda", region_name=AWS_REGION_EU_WEST_1)
        resp = lambda_client.create_function(
            FunctionName="rotation-lambda",
            Runtime="python3.7",
            Role=iam_role,
            Handler="lambda_function.lambda_handler",
            Code={"ZipFile": zip_output.read()},
            Description="test lambda function",
            Timeout=3,
            MemorySize=128,
            PackageType="ZIP",
            Publish=True,
            VpcConfig={
                "SecurityGroupIds": ["sg-123abc"],
                "SubnetIds": ["subnet-123abc"],
            },
        )
        lambda_arn = resp["FunctionArn"]
        # Enable Rotation
        secretsmanager_client.rotate_secret(
            SecretId=secret_arn,
            RotationLambdaARN=lambda_arn,
            RotationRules={
                "AutomaticallyAfterDays": 90,
                "Duration": "3h",
                "ScheduleExpression": "rate(10 days)",
            },
            RotateImmediately=True,
        )

        # Set partition for the service
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        secretsmanager = SecretsManager(aws_provider)
        assert len(secretsmanager.secrets) == 1
        assert secretsmanager.secrets
        assert secretsmanager.secrets[secret_arn]
        assert secretsmanager.secrets[secret_arn].name == secret_name
        assert secretsmanager.secrets[secret_arn].arn == secret_arn
        assert secretsmanager.secrets[secret_arn].region == AWS_REGION_EU_WEST_1
        assert secretsmanager.secrets[secret_arn].rotation_enabled is True
        assert secretsmanager.secrets[
            secret_arn
        ].last_accessed_date == datetime.min.replace(tzinfo=timezone.utc)
        assert (
            secretsmanager.secrets[secret_arn].last_rotated_date.date()
            == datetime(2023, 4, 9).date()
        )
        assert secretsmanager.secrets[secret_arn].tags == [
            {"Key": "test", "Value": "test"},
        ]

    @mock_aws
    def test_get_resource_policy(self):
        secretsmanager_client = client(
            "secretsmanager", region_name=AWS_REGION_EU_WEST_1
        )
        secret = secretsmanager_client.create_secret(
            Name="test-secret-policy",
        )
        secretsmanager_client.put_resource_policy(
            SecretId=secret["ARN"],
            ResourcePolicy='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"secretsmanager:GetSecretValue","Resource":"*"}]}',
        )
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        secretsmanager = SecretsManager(aws_provider)

        assert len(secretsmanager.secrets) == 1
        assert secretsmanager.secrets[secret["ARN"]].name == "test-secret-policy"
        assert secretsmanager.secrets[secret["ARN"]].arn == secret["ARN"]
        assert secretsmanager.secrets[secret["ARN"]].region == AWS_REGION_EU_WEST_1
        assert secretsmanager.secrets[secret["ARN"]].policy == {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "secretsmanager:GetSecretValue",
                    "Resource": "*",
                }
            ],
        }
```

--------------------------------------------------------------------------------

---[FILE: secretsmanager_automatic_rotation_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/secretsmanager/secretsmanager_automatic_rotation_enabled/secretsmanager_automatic_rotation_enabled_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.secretsmanager.secretsmanager_service import Secret
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class Test_secretsmanager_automatic_rotation_enabled:
    def test_no_secrets(self):
        secretsmanager_client = mock.MagicMock
        secretsmanager_client.secrets = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_service.SecretsManager",
                new=secretsmanager_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_client.secretsmanager_client",
                new=secretsmanager_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.secretsmanager.secretsmanager_automatic_rotation_enabled.secretsmanager_automatic_rotation_enabled import (
                secretsmanager_automatic_rotation_enabled,
            )

            check = secretsmanager_automatic_rotation_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_secret_rotation_disabled(self):
        secretsmanager_client = mock.MagicMock
        secret_name = "test-secret"
        secret_arn = f"arn:aws:secretsmanager:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:secret:{secret_name}"
        secretsmanager_client.secrets = {
            secret_name: Secret(
                arn=secret_arn,
                region=AWS_REGION_EU_WEST_1,
                name=secret_name,
                rotation_enabled=False,
                last_accessed_date=datetime.min,
                last_rotated_date=datetime.min,
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_service.SecretsManager",
                new=secretsmanager_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_client.secretsmanager_client",
                new=secretsmanager_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.secretsmanager.secretsmanager_automatic_rotation_enabled.secretsmanager_automatic_rotation_enabled import (
                secretsmanager_automatic_rotation_enabled,
            )

            check = secretsmanager_automatic_rotation_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == secret_name
            assert result[0].resource_arn == secret_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SecretsManager secret {secret_name} has rotation disabled."
            )

    def test_secret_rotation_enabled(self):
        secretsmanager_client = mock.MagicMock
        secret_name = "test-secret"
        secret_arn = f"arn:aws:secretsmanager:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:secret:{secret_name}"
        secretsmanager_client.secrets = {
            secret_name: Secret(
                arn=secret_arn,
                region=AWS_REGION_EU_WEST_1,
                name=secret_name,
                rotation_enabled=True,
                last_accessed_date=datetime.min,
                last_rotated_date=datetime.min,
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_service.SecretsManager",
                new=secretsmanager_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_client.secretsmanager_client",
                new=secretsmanager_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.secretsmanager.secretsmanager_automatic_rotation_enabled.secretsmanager_automatic_rotation_enabled import (
                secretsmanager_automatic_rotation_enabled,
            )

            check = secretsmanager_automatic_rotation_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == secret_name
            assert result[0].resource_arn == secret_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SecretsManager secret {secret_name} has rotation enabled."
            )
```

--------------------------------------------------------------------------------

---[FILE: secretsmanager_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/secretsmanager/secretsmanager_not_publicly_accessible/secretsmanager_not_publicly_accessible_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.secretsmanager.secretsmanager_service import (
    SecretsManager,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_secretsmanager_not_publicly_accessible:
    def test_no_secrets(self):
        client("secretsmanager", region_name=AWS_REGION_EU_WEST_1)

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_not_publicly_accessible.secretsmanager_not_publicly_accessible.secretsmanager_client",
                new=SecretsManager(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.secretsmanager.secretsmanager_not_publicly_accessible.secretsmanager_not_publicly_accessible import (
                secretsmanager_not_publicly_accessible,
            )

            check = secretsmanager_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_secret_not_public_policy(self):
        secretsmanager_client = client(
            "secretsmanager", region_name=AWS_REGION_EU_WEST_1
        )
        secret = secretsmanager_client.create_secret(
            Name="test-secret-no-public-policy",
        )
        secretsmanager_client.put_resource_policy(
            SecretId=secret["ARN"],
            ResourcePolicy='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"arn:aws:iam::123456789012:root","Action":"secretsmanager:GetSecretValue","Resource":"*"}]}',
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_not_publicly_accessible.secretsmanager_not_publicly_accessible.secretsmanager_client",
                new=SecretsManager(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.secretsmanager.secretsmanager_not_publicly_accessible.secretsmanager_not_publicly_accessible import (
                secretsmanager_not_publicly_accessible,
            )

            check = secretsmanager_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == secret["Name"]
            assert result[0].resource_arn == secret["ARN"]
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SecretsManager secret {secret['Name']} is not publicly accessible."
            )

    @mock_aws
    def test_secret_public_policy(self):
        secretsmanager_client = client(
            "secretsmanager", region_name=AWS_REGION_EU_WEST_1
        )
        secret = secretsmanager_client.create_secret(
            Name="test-secret-public-policy",
        )
        secretsmanager_client.put_resource_policy(
            SecretId=secret["ARN"],
            ResourcePolicy='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"secretsmanager:GetSecretValue","Resource":"*"}]}',
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_not_publicly_accessible.secretsmanager_not_publicly_accessible.secretsmanager_client",
                new=SecretsManager(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.secretsmanager.secretsmanager_not_publicly_accessible.secretsmanager_not_publicly_accessible import (
                secretsmanager_not_publicly_accessible,
            )

            check = secretsmanager_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == secret["Name"]
            assert result[0].resource_arn == secret["ARN"]
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SecretsManager secret {secret['Name']} is publicly accessible due to its resource policy."
            )
```

--------------------------------------------------------------------------------

````
