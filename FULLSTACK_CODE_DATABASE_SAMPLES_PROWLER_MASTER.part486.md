---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 486
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 486 of 867)

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

---[FILE: codebuild_project_no_secrets_in_variables_test.py]---
Location: prowler-master/tests/providers/aws/services/codebuild/codebuild_project_no_secrets_in_variables/codebuild_project_no_secrets_in_variables_test.py

```python
from unittest import mock

from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_codebuild_project_no_secrets_in_variables:
    def test_no_project(self):
        codebuild_client = mock.MagicMock

        codebuild_client.projects = {}

        codebuild_client.audit_config = {"excluded_sensitive_environment_variables": []}

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables import (
                codebuild_project_no_secrets_in_variables,
            )

            check = codebuild_project_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 0

    def test_project_with_no_envvar(self):
        codebuild_client = mock.MagicMock

        from prowler.providers.aws.services.codebuild.codebuild_service import Project

        project_arn = f"arn:aws:codebuild:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:project/SensitiveProject"
        codebuild_client.projects = {
            project_arn: Project(
                name="SensitiveProject",
                arn=project_arn,
                region=AWS_REGION_US_EAST_1,
                last_invoked_time=None,
                buildspec=None,
                environment_variables=[],
                tags=[],
            )
        }

        codebuild_client.audit_config = {"excluded_sensitive_environment_variables": []}

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables import (
                codebuild_project_no_secrets_in_variables,
            )

            check = codebuild_project_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "CodeBuild project SensitiveProject does not have sensitive environment plaintext credentials."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "SensitiveProject"
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []

    def test_project_with_no_plaintext_credentials(self):
        codebuild_client = mock.MagicMock

        from prowler.providers.aws.services.codebuild.codebuild_service import Project

        project_arn = f"arn:aws:codebuild:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:project/SensitiveProject"
        codebuild_client.projects = {
            project_arn: Project(
                name="SensitiveProject",
                arn=project_arn,
                region=AWS_REGION_US_EAST_1,
                last_invoked_time=None,
                buildspec=None,
                environment_variables=[
                    {
                        "name": "AWS_ACCESS_KEY_ID",
                        "value": "AKIAIOSFODNN7EXAMPLE",
                        "type": "PARAMETER_STORE",
                    }
                ],
                tags=[],
            )
        }

        codebuild_client.audit_config = {"excluded_sensitive_environment_variables": []}

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables import (
                codebuild_project_no_secrets_in_variables,
            )

            check = codebuild_project_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "CodeBuild project SensitiveProject does not have sensitive environment plaintext credentials."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "SensitiveProject"
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []

    def test_project_with_plaintext_credentials_but_not_sensitive(self):
        codebuild_client = mock.MagicMock

        from prowler.providers.aws.services.codebuild.codebuild_service import Project

        project_arn = f"arn:aws:codebuild:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:project/SensitiveProject"
        codebuild_client.projects = {
            project_arn: Project(
                name="SensitiveProject",
                arn=project_arn,
                region=AWS_REGION_US_EAST_1,
                last_invoked_time=None,
                buildspec=None,
                environment_variables=[
                    {
                        "name": "EXAMPLE_VAR",
                        "value": "ExampleValue",
                        "type": "PLAINTEXT",
                    }
                ],
                tags=[],
            )
        }

        codebuild_client.audit_config = {"excluded_sensitive_environment_variables": []}

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables import (
                codebuild_project_no_secrets_in_variables,
            )

            check = codebuild_project_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "CodeBuild project SensitiveProject does not have sensitive environment plaintext credentials."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "SensitiveProject"
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []

    def test_project_with_sensitive_plaintext_credentials(self):
        codebuild_client = mock.MagicMock

        from prowler.providers.aws.services.codebuild.codebuild_service import Project

        project_arn = f"arn:aws:codebuild:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:project/SensitiveProject"
        codebuild_client.projects = {
            project_arn: Project(
                name="SensitiveProject",
                arn=project_arn,
                region=AWS_REGION_US_EAST_1,
                last_invoked_time=None,
                buildspec=None,
                environment_variables=[
                    {
                        "name": "AWS_ACCESS_KEY_ID",
                        "value": "AKIAIOSFODNN7EXAMPLE",
                        "type": "PLAINTEXT",
                    }
                ],
                tags=[],
            )
        }

        codebuild_client.audit_config = {"excluded_sensitive_environment_variables": []}

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables import (
                codebuild_project_no_secrets_in_variables,
            )

            check = codebuild_project_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "CodeBuild project SensitiveProject has sensitive environment plaintext credentials in variables: AWS Access Key in variable AWS_ACCESS_KEY_ID."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "SensitiveProject"
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []

    def test_project_with_sensitive_plaintext_credentials_exluded(self):
        codebuild_client = mock.MagicMock

        from prowler.providers.aws.services.codebuild.codebuild_service import Project

        project_arn = f"arn:aws:codebuild:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:project/SensitiveProject"
        codebuild_client.projects = {
            project_arn: Project(
                name="SensitiveProject",
                arn=project_arn,
                region=AWS_REGION_US_EAST_1,
                last_invoked_time=None,
                buildspec=None,
                environment_variables=[
                    {
                        "name": "AWS_DUMB_ACCESS_KEY",
                        "value": "AKIAIOSFODNN7EXAMPLE",
                        "type": "PLAINTEXT",
                    }
                ],
                tags=[],
            )
        }

        codebuild_client.audit_config = {
            "excluded_sensitive_environment_variables": ["AWS_DUMB_ACCESS_KEY"]
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables import (
                codebuild_project_no_secrets_in_variables,
            )

            check = codebuild_project_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "CodeBuild project SensitiveProject does not have sensitive environment plaintext credentials."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "SensitiveProject"
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []

    def test_project_with_sensitive_plaintext_credentials_excluded_and_not(self):
        codebuild_client = mock.MagicMock()

        from prowler.providers.aws.services.codebuild.codebuild_service import Project

        project_arn = f"arn:aws:codebuild:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:project/SensitiveProject"
        codebuild_client.projects = {
            project_arn: Project(
                name="SensitiveProject",
                arn=project_arn,
                region=AWS_REGION_US_EAST_1,
                last_invoked_time=None,
                buildspec=None,
                environment_variables=[
                    {
                        "name": "AWS_DUMB_ACCESS_KEY",
                        "value": "AKIAIOSFODNN7EXAMPLE",
                        "type": "PLAINTEXT",
                    },
                    {
                        "name": "AWS_ACCESS_KEY_ID",
                        "value": "AKIAIOSFODNN7EXAMPLE",
                        "type": "PARAMETER_STORE",
                    },
                ],
                tags=[],
            )
        }

        codebuild_client.audit_config = {
            "excluded_sensitive_environment_variables": ["AWS_DUMB_ACCESS_KEY"]
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables import (
                codebuild_project_no_secrets_in_variables,
            )

            check = codebuild_project_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "CodeBuild project SensitiveProject does not have sensitive environment plaintext credentials."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "SensitiveProject"
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []

    def test_project_with_sensitive_plaintext_credentials_excluded_and_failed(self):
        codebuild_client = mock.MagicMock()

        from prowler.providers.aws.services.codebuild.codebuild_service import Project

        project_arn = f"arn:aws:codebuild:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:project/SensitiveProject"
        codebuild_client.projects = {
            project_arn: Project(
                name="SensitiveProject",
                arn=project_arn,
                region=AWS_REGION_US_EAST_1,
                last_invoked_time=None,
                buildspec=None,
                environment_variables=[
                    {
                        "name": "AWS_DUMB_ACCESS_KEY",
                        "value": "AKIAIOSFODNN7EXAMPLE",
                        "type": "PLAINTEXT",
                    },
                    {
                        "name": "AWS_ACCESS_KEY_ID",
                        "value": "AKIAIOSFODNN7EXAMPLE",
                        "type": "PLAINTEXT",
                    },
                ],
                tags=[],
            )
        }

        codebuild_client.audit_config = {
            "excluded_sensitive_environment_variables": ["AWS_DUMB_ACCESS_KEY"]
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables import (
                codebuild_project_no_secrets_in_variables,
            )

            check = codebuild_project_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "CodeBuild project SensitiveProject has sensitive environment plaintext credentials in variables: AWS Access Key in variable AWS_ACCESS_KEY_ID."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "SensitiveProject"
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []

    def test_project_with_multiple_sensitive_credentials(self):
        codebuild_client = mock.MagicMock()

        from prowler.providers.aws.services.codebuild.codebuild_service import Project

        project_arn = f"arn:aws:codebuild:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:project/SensitiveProject"
        codebuild_client.projects = {
            project_arn: Project(
                name="SensitiveProject",
                arn=project_arn,
                region=AWS_REGION_US_EAST_1,
                last_invoked_time=None,
                buildspec=None,
                environment_variables=[
                    {
                        "name": "AWS_DUMB_ACCESS_KEY",
                        "value": "AKIAIOSFODNN7EXAMPLE",
                        "type": "PLAINTEXT",
                    },
                    {
                        "name": "AWS_ACCESS_KEY_ID",
                        "value": "AKIAIOSFODNN7EXAMPLE",
                        "type": "PLAINTEXT",
                    },
                ],
                tags=[],
            )
        }

        codebuild_client.audit_config = {"excluded_sensitive_environment_variables": []}

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_no_secrets_in_variables.codebuild_project_no_secrets_in_variables import (
                codebuild_project_no_secrets_in_variables,
            )

            check = codebuild_project_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "CodeBuild project SensitiveProject has sensitive environment plaintext credentials in variables: AWS Access Key in variable AWS_DUMB_ACCESS_KEY, AWS Access Key in variable AWS_ACCESS_KEY_ID."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "SensitiveProject"
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_older_90_days_test.py]---
Location: prowler-master/tests/providers/aws/services/codebuild/codebuild_project_older_90_days/codebuild_project_older_90_days_test.py

```python
from datetime import datetime, timedelta, timezone
from unittest import mock

from prowler.providers.aws.services.codebuild.codebuild_service import Project

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_codebuild_project_older_90_days:
    def test_project_not_built_in_last_90_days(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                last_invoked_time=datetime.now(timezone.utc) - timedelta(days=100),
                buildspec=None,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_older_90_days.codebuild_project_older_90_days.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_older_90_days.codebuild_project_older_90_days import (
                codebuild_project_older_90_days,
            )

            check = codebuild_project_older_90_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} has not been invoked in the last 90 days."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    def test_project_not_built(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                last_invoked_time=None,
                buildspec=None,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_older_90_days.codebuild_project_older_90_days.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_older_90_days.codebuild_project_older_90_days import (
                codebuild_project_older_90_days,
            )

            check = codebuild_project_older_90_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} has never been built."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    def test_project_built_in_last_90_days(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                last_invoked_time=datetime.now(timezone.utc) - timedelta(days=10),
                buildspec=None,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_older_90_days.codebuild_project_older_90_days.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_older_90_days.codebuild_project_older_90_days import (
                codebuild_project_older_90_days,
            )

            check = codebuild_project_older_90_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} has been invoked in the last 90 days."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_s3_logs_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/codebuild/codebuild_project_s3_logs_encrypted/codebuild_project_s3_logs_encrypted_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_codebuild_project_s3_logs_encrypted:
    @mock_aws
    def test_no_projects(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_s3_logs_encrypted.codebuild_project_s3_logs_encrypted.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_s3_logs_encrypted.codebuild_project_s3_logs_encrypted import (
                codebuild_project_s3_logs_encrypted,
            )

            check = codebuild_project_s3_logs_encrypted()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_project_no_s3_logs_enabled(self):
        codebuild_client = client("codebuild", region_name=AWS_REGION_EU_WEST_1)

        project_name = "test-project-no-logs"

        codebuild_client.create_project(
            name=project_name,
            source={
                "type": "S3",
                "location": "test-bucket",
            },
            artifacts={
                "type": "NO_ARTIFACTS",
            },
            environment={
                "type": "LINUX_CONTAINER",
                "image": "aws/codebuild/standard:4.0",
                "computeType": "BUILD_GENERAL1_SMALL",
                "environmentVariables": [],
            },
            serviceRole="arn:aws:iam::123456789012:role/service-role/codebuild-role",
            tags=[
                {"key": "Name", "value": "test"},
            ],
        )["project"]["arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_s3_logs_encrypted.codebuild_project_s3_logs_encrypted.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_s3_logs_encrypted.codebuild_project_s3_logs_encrypted import (
                codebuild_project_s3_logs_encrypted,
            )

            check = codebuild_project_s3_logs_encrypted()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_project_logs_encrypted(self):
        codebuild_client = client("codebuild", region_name=AWS_REGION_EU_WEST_1)

        project_name = "test-project-encryption"

        project_arn = codebuild_client.create_project(
            name=project_name,
            source={
                "type": "S3",
                "location": "test-bucket",
            },
            artifacts={
                "type": "NO_ARTIFACTS",
            },
            environment={
                "type": "LINUX_CONTAINER",
                "image": "aws/codebuild/standard:4.0",
                "computeType": "BUILD_GENERAL1_SMALL",
                "environmentVariables": [],
            },
            serviceRole="arn:aws:iam::123456789012:role/service-role/codebuild-role",
            logsConfig={
                "s3Logs": {
                    "status": "ENABLED",
                    "location": "test-bucket",
                    "encryptionDisabled": False,
                }
            },
            tags=[
                {"key": "Name", "value": "test"},
            ],
        )["project"]["arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_s3_logs_encrypted.codebuild_project_s3_logs_encrypted.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_s3_logs_encrypted.codebuild_project_s3_logs_encrypted import (
                codebuild_project_s3_logs_encrypted,
            )

            check = codebuild_project_s3_logs_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} has encrypted S3 logs stored in test-bucket."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == [{"key": "Name", "value": "test"}]
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_project_logs_not_encrypted(self):
        codebuild_client = client("codebuild", region_name=AWS_REGION_EU_WEST_1)

        project_name = "test-project-no-encryption"

        project_arn = codebuild_client.create_project(
            name=project_name,
            source={
                "type": "S3",
                "location": "test-bucket",
            },
            artifacts={
                "type": "NO_ARTIFACTS",
            },
            environment={
                "type": "LINUX_CONTAINER",
                "image": "aws/codebuild/standard:4.0",
                "computeType": "BUILD_GENERAL1_SMALL",
                "environmentVariables": [],
            },
            serviceRole="arn:aws:iam::123456789012:role/service-role/codebuild-role",
            logsConfig={
                "s3Logs": {
                    "status": "ENABLED",
                    "location": "test-bucket",
                    "encryptionDisabled": True,
                }
            },
            tags=[
                {"key": "Name", "value": "test"},
            ],
        )["project"]["arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_s3_logs_encrypted.codebuild_project_s3_logs_encrypted.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_s3_logs_encrypted.codebuild_project_s3_logs_encrypted import (
                codebuild_project_s3_logs_encrypted,
            )

            check = codebuild_project_s3_logs_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} does not have encrypted S3 logs stored in test-bucket."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == [{"key": "Name", "value": "test"}]
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

````
