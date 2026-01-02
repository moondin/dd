---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 487
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 487 of 867)

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

---[FILE: codebuild_project_source_repo_url_no_sensitive_credentials_test.py]---
Location: prowler-master/tests/providers/aws/services/codebuild/codebuild_project_source_repo_url_no_sensitive_credentials/codebuild_project_source_repo_url_no_sensitive_credentials_test.py

```python
from unittest import mock

from prowler.providers.aws.services.codebuild.codebuild_service import Project, Source

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_codebuild_project_source_repo_url_no_sensitive_credentials:
    def test_project_no_bitbucket_urls(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                last_invoked_time=None,
                buildspec="",
                source=None,
                secondary_sources=[],
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_project_source_repo_url_no_sensitive_credentials import (
                codebuild_project_source_repo_url_no_sensitive_credentials,
            )

            check = codebuild_project_source_repo_url_no_sensitive_credentials()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} does not contain sensitive credentials in any source repository URLs."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    def test_project_safe_bitbucket_urls(self):
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
                source=Source(
                    type="BITBUCKET",
                    location="https://bitbucket.org/exampleuser/my-repo.git",
                ),
                secondary_sources=[],
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_project_source_repo_url_no_sensitive_credentials import (
                codebuild_project_source_repo_url_no_sensitive_credentials,
            )

            check = codebuild_project_source_repo_url_no_sensitive_credentials()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} does not contain sensitive credentials in any source repository URLs."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    def test_project_username_password_bitbucket_urls(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                last_invoked_time=None,
                buildspec="arn:aws:s3:::my-codebuild-sample2/buildspec.yaml",
                source=Source(
                    type="BITBUCKET",
                    location="https://user:pass123@bitbucket.org/exampleuser/my-repo2.git",
                ),
                secondary_sources=[],
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_project_source_repo_url_no_sensitive_credentials import (
                codebuild_project_source_repo_url_no_sensitive_credentials,
            )

            check = codebuild_project_source_repo_url_no_sensitive_credentials()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} has sensitive credentials in source repository URLs: Basic Auth Credentials in BITBUCKET URL https://user:pass123@bitbucket.org/exampleuser/my-repo2.git."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    def test_project_token_bitbucket_urls(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                last_invoked_time=None,
                buildspec="arn:aws:s3:::my-codebuild-sample2/buildspec.yaml",
                source=Source(
                    type="BITBUCKET",
                    location="https://x-token-auth:7saBEbfXpRg-zlO-YQC9Lvh8vtKmdETITD_-GCqYw0ZHbV7ZbMDbUCybDGM4=053EA782@bitbucket.org/testissue4244/test4244.git",
                ),
                secondary_sources=[],
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_source_repo_url_no_sensitive_credentials.codebuild_project_source_repo_url_no_sensitive_credentials import (
                codebuild_project_source_repo_url_no_sensitive_credentials,
            )

            check = codebuild_project_source_repo_url_no_sensitive_credentials()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} has sensitive credentials in source repository URLs: Token in BITBUCKET URL https://x-token-auth:7saBEbfXpRg-zlO-YQC9Lvh8vtKmdETITD_-GCqYw0ZHbV7ZbMDbUCybDGM4=053EA782@bitbucket.org/testissue4244/test4244.git."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_user_controlled_buildspec_test.py]---
Location: prowler-master/tests/providers/aws/services/codebuild/codebuild_project_user_controlled_buildspec/codebuild_project_user_controlled_buildspec_test.py

```python
from unittest import mock

from prowler.providers.aws.services.codebuild.codebuild_service import Project

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_codebuild_project_user_controlled_buildspec:
    def test_project_not_buildspec(self):
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
                "prowler.providers.aws.services.codebuild.codebuild_project_user_controlled_buildspec.codebuild_project_user_controlled_buildspec.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_user_controlled_buildspec.codebuild_project_user_controlled_buildspec import (
                codebuild_project_user_controlled_buildspec,
            )

            check = codebuild_project_user_controlled_buildspec()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} does not use an user controlled buildspec."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    def test_project_buildspec_not_yaml(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                last_invoked_time=None,
                buildspec="arn:aws:s3:::my-codebuild-sample2/buildspec.out",
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_user_controlled_buildspec.codebuild_project_user_controlled_buildspec.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_user_controlled_buildspec.codebuild_project_user_controlled_buildspec import (
                codebuild_project_user_controlled_buildspec,
            )

            check = codebuild_project_user_controlled_buildspec()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} does not use an user controlled buildspec."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    def test_project_valid_buildspec(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                last_invoked_time=None,
                buildspec="arn:aws:s3:::my-codebuild-sample2/buildspec.yaml",
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_user_controlled_buildspec.codebuild_project_user_controlled_buildspec.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_user_controlled_buildspec.codebuild_project_user_controlled_buildspec import (
                codebuild_project_user_controlled_buildspec,
            )

            check = codebuild_project_user_controlled_buildspec()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} uses an user controlled buildspec."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    def test_project_invalid_buildspec_without_extension(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                last_invoked_time=None,
                buildspec="arn:aws:s3:::my-codebuild-sample2/buildspecyaml",
                tags=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_user_controlled_buildspec.codebuild_project_user_controlled_buildspec.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_user_controlled_buildspec.codebuild_project_user_controlled_buildspec import (
                codebuild_project_user_controlled_buildspec,
            )

            check = codebuild_project_user_controlled_buildspec()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} does not use an user controlled buildspec."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_uses_allowed_github_organizations_test.py]---
Location: prowler-master/tests/providers/aws/services/codebuild/codebuild_project_uses_allowed_github_organizations/codebuild_project_uses_allowed_github_organizations_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

AWS_ACCOUNT_NUMBER = "123456789012"


class Test_codebuild_project_uses_allowed_github_organizations:
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
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client",
                new=Codebuild(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client.audit_config",
                {"codebuild_github_allowed_organizations": ["allowed-org"]},
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations import (
                codebuild_project_uses_allowed_github_organizations,
            )

            check = codebuild_project_uses_allowed_github_organizations()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_project_github_allowed_organization(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        codebuild_client = client("codebuild", region_name=AWS_REGION_EU_WEST_1)
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        project_name = "test-project-github-allowed"
        role_name = "codebuild-test-role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument="""{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"Service": "codebuild.amazonaws.com"},
                        "Action": "sts:AssumeRole"
                    }
                ]
            }""",
        )["Role"]["Arn"]
        project_arn = codebuild_client.create_project(
            name=project_name,
            source={
                "type": "GITHUB",
                "location": "https://github.com/allowed-org/repo",
            },
            artifacts={"type": "NO_ARTIFACTS"},
            environment={
                "type": "LINUX_CONTAINER",
                "image": "aws/codebuild/standard:4.0",
                "computeType": "BUILD_GENERAL1_SMALL",
                "environmentVariables": [],
            },
            serviceRole=role_arn,
            tags=[{"key": "Name", "value": "test"}],
        )["project"]["arn"]

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client",
                new=Codebuild(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.iam_client",
                new=IAM(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client.audit_config",
                {"codebuild_github_allowed_organizations": ["allowed-org"]},
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations import (
                codebuild_project_uses_allowed_github_organizations,
            )

            check = codebuild_project_uses_allowed_github_organizations()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert "which is in the allowed organizations" in result[0].status_extended
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_project_github_not_allowed_organization(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        codebuild_client = client("codebuild", region_name=AWS_REGION_EU_WEST_1)
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        project_name = "test-project-github-not-allowed"
        role_name = "codebuild-test-role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument="""{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"Service": "codebuild.amazonaws.com"},
                        "Action": "sts:AssumeRole"
                    }
                ]
            }""",
        )["Role"]["Arn"]
        project_arn = codebuild_client.create_project(
            name=project_name,
            source={
                "type": "GITHUB",
                "location": "https://github.com/not-allowed-org/repo",
            },
            artifacts={"type": "NO_ARTIFACTS"},
            environment={
                "type": "LINUX_CONTAINER",
                "image": "aws/codebuild/standard:4.0",
                "computeType": "BUILD_GENERAL1_SMALL",
                "environmentVariables": [],
            },
            serviceRole=role_arn,
            tags=[{"key": "Name", "value": "test"}],
        )["project"]["arn"]

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client",
                new=Codebuild(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.iam_client",
                new=IAM(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client.audit_config",
                {"codebuild_github_allowed_organizations": ["allowed-org"]},
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations import (
                codebuild_project_uses_allowed_github_organizations,
            )

            check = codebuild_project_uses_allowed_github_organizations()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert (
                "which is not in the allowed organizations" in result[0].status_extended
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_project_github_no_codebuild_trusted_principal(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client",
                new=Codebuild(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.iam_client",
                new=IAM(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client.audit_config",
                {"codebuild_github_allowed_organizations": ["allowed-org"]},
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations import (
                codebuild_project_uses_allowed_github_organizations,
            )

            check = codebuild_project_uses_allowed_github_organizations()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_project_github_enterprise_allowed_organization(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        codebuild_client = client("codebuild", region_name=AWS_REGION_EU_WEST_1)
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        project_name = "test-project-github-enterprise-allowed"
        role_name = "codebuild-test-role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument="""{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"Service": "codebuild.amazonaws.com"},
                        "Action": "sts:AssumeRole"
                    }
                ]
            }""",
        )["Role"]["Arn"]
        project_arn = codebuild_client.create_project(
            name=project_name,
            source={
                "type": "GITHUB_ENTERPRISE",
                "location": "https://github.enterprise.com/allowed-org/repo",
            },
            artifacts={"type": "NO_ARTIFACTS"},
            environment={
                "type": "LINUX_CONTAINER",
                "image": "aws/codebuild/standard:4.0",
                "computeType": "BUILD_GENERAL1_SMALL",
                "environmentVariables": [],
            },
            serviceRole=role_arn,
            tags=[{"key": "Name", "value": "test"}],
        )["project"]["arn"]

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client",
                new=Codebuild(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.iam_client",
                new=IAM(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client.audit_config",
                {"codebuild_github_allowed_organizations": ["allowed-org"]},
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations import (
                codebuild_project_uses_allowed_github_organizations,
            )

            check = codebuild_project_uses_allowed_github_organizations()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert "which is in the allowed organizations" in result[0].status_extended
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_project_github_enterprise_not_allowed_organization(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        codebuild_client = client("codebuild", region_name=AWS_REGION_EU_WEST_1)
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        project_name = "test-project-github-enterprise-not-allowed"
        role_name = "codebuild-test-role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument="""{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"Service": "codebuild.amazonaws.com"},
                        "Action": "sts:AssumeRole"
                    }
                ]
            }""",
        )["Role"]["Arn"]
        project_arn = codebuild_client.create_project(
            name=project_name,
            source={
                "type": "GITHUB_ENTERPRISE",
                "location": "https://github.enterprise.com/not-allowed-org/repo",
            },
            artifacts={"type": "NO_ARTIFACTS"},
            environment={
                "type": "LINUX_CONTAINER",
                "image": "aws/codebuild/standard:4.0",
                "computeType": "BUILD_GENERAL1_SMALL",
                "environmentVariables": [],
            },
            serviceRole=role_arn,
            tags=[{"key": "Name", "value": "test"}],
        )["project"]["arn"]

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client",
                new=Codebuild(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.iam_client",
                new=IAM(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client.audit_config",
                {"codebuild_github_allowed_organizations": ["allowed-org"]},
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations import (
                codebuild_project_uses_allowed_github_organizations,
            )

            check = codebuild_project_uses_allowed_github_organizations()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert (
                "which is not in the allowed organizations" in result[0].status_extended
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_project_github_enterprise_no_codebuild_trusted_principal(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client",
                new=Codebuild(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.iam_client",
                new=IAM(aws_provider),
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations.codebuild_client.audit_config",
                {"codebuild_github_allowed_organizations": ["allowed-org"]},
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_uses_allowed_github_organizations.codebuild_project_uses_allowed_github_organizations import (
                codebuild_project_uses_allowed_github_organizations,
            )

            check = codebuild_project_uses_allowed_github_organizations()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
