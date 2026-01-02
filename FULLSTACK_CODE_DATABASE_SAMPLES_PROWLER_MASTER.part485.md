---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 485
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 485 of 867)

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

---[FILE: codeartifact_packages_external_public_publishing_disabled_test.py]---
Location: prowler-master/tests/providers/aws/services/codeartifact/codeartifact_packages_external_public_publishing_disabled/codeartifact_packages_external_public_publishing_disabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.codeartifact.codeartifact_service import (
    LatestPackageVersion,
    LatestPackageVersionStatus,
    OriginConfiguration,
    OriginInformation,
    OriginInformationValues,
    Package,
    Repository,
    Restrictions,
    RestrictionValues,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

AWS_REGION = "eu-west-1"


class Test_codeartifact_packages_external_public_publishing_disabled:
    def test_no_repositories(self):
        codeartifact_client = mock.MagicMock
        codeartifact_client.repositories = {}
        with (
            mock.patch(
                "prowler.providers.aws.services.codeartifact.codeartifact_service.CodeArtifact",
                new=codeartifact_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codeartifact.codeartifact_client.codeartifact_client",
                new=codeartifact_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.codeartifact.codeartifact_packages_external_public_publishing_disabled.codeartifact_packages_external_public_publishing_disabled import (
                codeartifact_packages_external_public_publishing_disabled,
            )

            check = codeartifact_packages_external_public_publishing_disabled()
            result = check.execute()

            assert len(result) == 0

    def test_repository_without_packages(self):
        codeartifact_client = mock.MagicMock
        codeartifact_client.repositories = {
            "test-repository": Repository(
                name="test-repository",
                arn="",
                domain_name="",
                domain_owner="",
                region=AWS_REGION,
                packages=[],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.codeartifact.codeartifact_service.CodeArtifact",
                new=codeartifact_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codeartifact.codeartifact_client.codeartifact_client",
                new=codeartifact_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.codeartifact.codeartifact_packages_external_public_publishing_disabled.codeartifact_packages_external_public_publishing_disabled import (
                codeartifact_packages_external_public_publishing_disabled,
            )

            check = codeartifact_packages_external_public_publishing_disabled()
            result = check.execute()

            assert len(result) == 0

    def test_repository_package_public_publishing_origin_internal(self):
        codeartifact_client = mock.MagicMock
        package_name = "test-package"
        package_namespace = "test-namespace"
        repository_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:repository/test-repository"
        codeartifact_client.repositories = {
            "test-repository": Repository(
                name="test-repository",
                arn=repository_arn,
                domain_name="test",
                domain_owner="",
                region=AWS_REGION,
                packages=[
                    Package(
                        name=package_name,
                        namespace=package_namespace,
                        format="pypi",
                        origin_configuration=OriginConfiguration(
                            restrictions=Restrictions(
                                publish=RestrictionValues.ALLOW,
                                upstream=RestrictionValues.ALLOW,
                            )
                        ),
                        latest_version=LatestPackageVersion(
                            version="latest",
                            status=LatestPackageVersionStatus.Published,
                            origin=OriginInformation(
                                origin_type=OriginInformationValues.INTERNAL
                            ),
                        ),
                    )
                ],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.codeartifact.codeartifact_service.CodeArtifact",
                new=codeartifact_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codeartifact.codeartifact_client.codeartifact_client",
                new=codeartifact_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.codeartifact.codeartifact_packages_external_public_publishing_disabled.codeartifact_packages_external_public_publishing_disabled import (
                codeartifact_packages_external_public_publishing_disabled,
            )

            check = codeartifact_packages_external_public_publishing_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == "test/test-package"
            assert (
                result[0].resource_arn
                == repository_arn + "/" + package_namespace + ":" + package_name
            )
            assert result[0].resource_tags == []
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Internal package {package_name} is vulnerable to dependency confusion in repository test."
            )

    def test_repository_package_private_publishing_origin_internal(self):
        codeartifact_client = mock.MagicMock
        package_name = "test-package"
        package_namespace = "test-namespace"
        repository_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:repository/test-repository"
        codeartifact_client.repositories = {
            "test-repository": Repository(
                name="test-repository",
                arn=repository_arn,
                domain_name="test",
                domain_owner="",
                region=AWS_REGION,
                packages=[
                    Package(
                        name=package_name,
                        namespace=package_namespace,
                        format="pypi",
                        origin_configuration=OriginConfiguration(
                            restrictions=Restrictions(
                                publish=RestrictionValues.BLOCK,
                                upstream=RestrictionValues.BLOCK,
                            )
                        ),
                        latest_version=LatestPackageVersion(
                            version="latest",
                            status=LatestPackageVersionStatus.Published,
                            origin=OriginInformation(
                                origin_type=OriginInformationValues.INTERNAL
                            ),
                        ),
                    )
                ],
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.codeartifact.codeartifact_service.CodeArtifact",
                new=codeartifact_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codeartifact.codeartifact_client.codeartifact_client",
                new=codeartifact_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.codeartifact.codeartifact_packages_external_public_publishing_disabled.codeartifact_packages_external_public_publishing_disabled import (
                codeartifact_packages_external_public_publishing_disabled,
            )

            check = codeartifact_packages_external_public_publishing_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION
            assert result[0].resource_id == "test/test-package"
            assert (
                result[0].resource_arn
                == repository_arn + "/" + package_namespace + ":" + package_name
            )
            assert result[0].resource_tags == []
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Internal package {package_name} is not vulnerable to dependency confusion in repository test."
            )
```

--------------------------------------------------------------------------------

---[FILE: codebuild_service_test.py]---
Location: prowler-master/tests/providers/aws/services/codebuild/codebuild_service_test.py

```python
from datetime import datetime, timedelta
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.codebuild.codebuild_service import (
    Build,
    CloudWatchLogs,
    Codebuild,
    ExportConfig,
    Project,
    ReportGroup,
    s3Logs,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_COMMERCIAL_PARTITION,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

project_name = "test"
project_arn = f"arn:{AWS_COMMERCIAL_PARTITION}:codebuild:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
build_spec_project_arn = "arn:aws:s3:::my-codebuild-sample2/buildspec.yml"
source_type = "BITBUCKET"
build_id = "test:93f838a7-cd20-48ae-90e5-c10fbbc78ca6"
last_invoked_time = datetime.now() - timedelta(days=2)
bitbucket_url = "https://bitbucket.org/example/repo.git"
secondary_bitbucket_url = "https://bitbucket.org/example/secondary-repo.git"
project_visibility = "PRIVATE"

report_group_arn = f"arn:{AWS_COMMERCIAL_PARTITION}:codebuild:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:report-group/{project_name}"

# Mocking batch_get_projects
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListProjects":
        return {"projects": [project_name]}
    elif operation_name == "ListBuildsForProject":
        return {"ids": [build_id]}
    elif operation_name == "BatchGetBuilds":
        return {"builds": [{"endTime": last_invoked_time}]}
    elif operation_name == "BatchGetProjects":
        return {
            "projects": [
                {
                    "source": {
                        "type": source_type,
                        "location": bitbucket_url,
                        "buildspec": build_spec_project_arn,
                    },
                    "secondarySources": [
                        {
                            "type": source_type,
                            "location": secondary_bitbucket_url,
                            "buildspec": "",
                        }
                    ],
                    "logsConfig": {
                        "cloudWatchLogs": {
                            "status": "ENABLED",
                            "groupName": project_name,
                            "streamName": project_name,
                        },
                        "s3Logs": {
                            "status": "ENABLED",
                            "location": "test-bucket",
                            "encryptionDisabled": False,
                        },
                    },
                    "tags": [{"key": "Name", "value": project_name}],
                    "projectVisibility": project_visibility,
                }
            ]
        }
    elif operation_name == "ListReportGroups":
        return {"reportGroups": [report_group_arn]}
    elif operation_name == "BatchGetReportGroups":
        return {
            "reportGroups": [
                {
                    "name": project_name,
                    "arn": report_group_arn,
                    "exportConfig": {
                        "exportConfigType": "S3",
                        "s3Destination": {
                            "bucket": "test-bucket",
                            "path": "test-path",
                            "encryptionKey": "arn:aws:kms:eu-west-1:123456789012:key/12345678-1234-1234-1234-123456789012",
                            "encryptionDisabled": False,
                        },
                    },
                    "tags": [{"key": "Name", "value": project_name}],
                    "status": "ACTIVE",
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


class Test_Codebuild_Service:
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @patch(
        "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
        new=mock_generate_regional_clients,
    )
    @mock_aws
    def test_codebuild_service(self):
        codebuild = Codebuild(set_mocked_aws_provider())

        assert codebuild.session.__class__.__name__ == "Session"
        assert codebuild.service == "codebuild"
        # Asserttions related with projects
        assert len(codebuild.projects) == 1
        assert isinstance(codebuild.projects, dict)
        assert isinstance(codebuild.projects[project_arn], Project)
        assert codebuild.projects[project_arn].name == project_name
        assert codebuild.projects[project_arn].arn == project_arn
        assert codebuild.projects[project_arn].region == AWS_REGION_EU_WEST_1
        assert codebuild.projects[project_arn].last_invoked_time == last_invoked_time
        assert codebuild.projects[project_arn].last_build == Build(id=build_id)
        assert codebuild.projects[project_arn].buildspec == build_spec_project_arn
        assert bitbucket_url == codebuild.projects[project_arn].source.location
        assert (
            secondary_bitbucket_url
            in codebuild.projects[project_arn].secondary_sources[0].location
        )
        assert isinstance(codebuild.projects[project_arn].s3_logs, s3Logs)
        assert codebuild.projects[project_arn].s3_logs.enabled
        assert codebuild.projects[project_arn].s3_logs.bucket_location == "test-bucket"
        assert codebuild.projects[project_arn].s3_logs.encrypted
        assert isinstance(
            codebuild.projects[project_arn].cloudwatch_logs, CloudWatchLogs
        )
        assert codebuild.projects[project_arn].cloudwatch_logs.enabled
        assert (
            codebuild.projects[project_arn].cloudwatch_logs.group_name == project_name
        )
        assert (
            codebuild.projects[project_arn].cloudwatch_logs.stream_name == project_name
        )
        assert codebuild.projects[project_arn].tags[0]["key"] == "Name"
        assert codebuild.projects[project_arn].tags[0]["value"] == project_name
        assert codebuild.projects[project_arn].project_visibility == project_visibility
        # Asserttions related with report groups
        assert len(codebuild.report_groups) == 1
        assert isinstance(codebuild.report_groups, dict)
        assert isinstance(codebuild.report_groups[report_group_arn], ReportGroup)
        assert codebuild.report_groups[report_group_arn].name == project_name
        assert codebuild.report_groups[report_group_arn].arn == report_group_arn
        assert codebuild.report_groups[report_group_arn].region == AWS_REGION_EU_WEST_1
        assert codebuild.report_groups[report_group_arn].status == "ACTIVE"
        assert isinstance(
            codebuild.report_groups[report_group_arn].export_config, ExportConfig
        )
        assert codebuild.report_groups[report_group_arn].export_config.type == "S3"
        assert (
            codebuild.report_groups[report_group_arn].export_config.bucket_location
            == "s3://test-bucket/test-path"
        )
        assert (
            codebuild.report_groups[report_group_arn].export_config.encryption_key
            == "arn:aws:kms:eu-west-1:123456789012:key/12345678-1234-1234-1234-123456789012"
        )
        assert codebuild.report_groups[report_group_arn].export_config.encrypted
        assert codebuild.report_groups[report_group_arn].tags[0]["key"] == "Name"
        assert (
            codebuild.report_groups[report_group_arn].tags[0]["value"] == project_name
        )
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/codebuild/codebuild_project_logging_enabled/codebuild_project_logging_enabled_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_codebuild_project_logging_enabled:
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
                "prowler.providers.aws.services.codebuild.codebuild_project_logging_enabled.codebuild_project_logging_enabled.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_logging_enabled.codebuild_project_logging_enabled import (
                codebuild_project_logging_enabled,
            )

            check = codebuild_project_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_project_cloudwatch_logging_enabled(self):
        codebuild_client = client("codebuild", region_name=AWS_REGION_EU_WEST_1)

        project_name = "test-project-logging-enabled"

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
                "cloudWatchLogs": {
                    "status": "ENABLED",
                    "groupName": "cw-test-group",
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
                "prowler.providers.aws.services.codebuild.codebuild_project_logging_enabled.codebuild_project_logging_enabled.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_logging_enabled.codebuild_project_logging_enabled import (
                codebuild_project_logging_enabled,
            )

            check = codebuild_project_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} has CloudWatch logging enabled in log group cw-test-group."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == [{"key": "Name", "value": "test"}]
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_project_s3_logging_enabled(self):
        codebuild_client = client("codebuild", region_name=AWS_REGION_EU_WEST_1)

        project_name = "test-project-logging-enabled"

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
                    "location": "s3://test-bucket/logs",
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
                "prowler.providers.aws.services.codebuild.codebuild_project_logging_enabled.codebuild_project_logging_enabled.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_logging_enabled.codebuild_project_logging_enabled import (
                codebuild_project_logging_enabled,
            )

            check = codebuild_project_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} has S3 logging enabled in bucket s3://test-bucket/logs."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == [{"key": "Name", "value": "test"}]
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_project_both_logging_enabled(self):
        codebuild_client = client("codebuild", region_name=AWS_REGION_EU_WEST_1)

        project_name = "test-project-logging-enabled"

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
                "cloudWatchLogs": {
                    "status": "ENABLED",
                    "groupName": "cw-test-group",
                },
                "s3Logs": {
                    "status": "ENABLED",
                    "location": "s3://test-bucket/logs",
                },
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
                "prowler.providers.aws.services.codebuild.codebuild_project_logging_enabled.codebuild_project_logging_enabled.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_logging_enabled.codebuild_project_logging_enabled import (
                codebuild_project_logging_enabled,
            )

            check = codebuild_project_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} has enabled CloudWatch logs in log group cw-test-group and S3 logs in bucket s3://test-bucket/logs."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == [{"key": "Name", "value": "test"}]
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_project_logging_disabled(self):
        codebuild_client = client("codebuild", region_name=AWS_REGION_EU_WEST_1)

        project_name = "test-project-logging-disabled"

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
                "cloudWatchLogs": {
                    "status": "DISABLED",
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
                "prowler.providers.aws.services.codebuild.codebuild_project_logging_enabled.codebuild_project_logging_enabled.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_logging_enabled.codebuild_project_logging_enabled import (
                codebuild_project_logging_enabled,
            )

            check = codebuild_project_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} does not have logging enabled."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == [{"key": "Name", "value": "test"}]
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/codebuild/codebuild_project_not_publicly_accessible/codebuild_project_not_publicly_accessible_test.py

```python
from unittest import mock

from prowler.providers.aws.services.codebuild.codebuild_service import Project

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_codebuild_project_not_publicly_accessible:
    def test_project_public(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                project_visibility="PUBLIC",
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_not_publicly_accessible.codebuild_project_not_publicly_accessible.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_not_publicly_accessible.codebuild_project_not_publicly_accessible import (
                codebuild_project_not_publicly_accessible,
            )

            check = codebuild_project_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} is public."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    def test_project_private(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                project_visibility="PRIVATE",
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_not_publicly_accessible.codebuild_project_not_publicly_accessible.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_not_publicly_accessible.codebuild_project_not_publicly_accessible import (
                codebuild_project_not_publicly_accessible,
            )

            check = codebuild_project_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} is private."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    def test_project_no_visibility_set(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                project_visibility=None,
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_not_publicly_accessible.codebuild_project_not_publicly_accessible.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_not_publicly_accessible.codebuild_project_not_publicly_accessible import (
                codebuild_project_not_publicly_accessible,
            )

            check = codebuild_project_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} is public."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    def test_project_empty_visibility(self):
        codebuild_client = mock.MagicMock
        project_name = "test-project"
        project_arn = f"arn:aws:codebuild:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:project/{project_name}"
        codebuild_client.projects = {
            project_arn: Project(
                name=project_name,
                arn=project_arn,
                region="eu-west-1",
                project_visibility="",
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_service.Codebuild",
                codebuild_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.codebuild.codebuild_project_not_publicly_accessible.codebuild_project_not_publicly_accessible.codebuild_client",
                codebuild_client,
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_project_not_publicly_accessible.codebuild_project_not_publicly_accessible import (
                codebuild_project_not_publicly_accessible,
            )

            check = codebuild_project_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CodeBuild project {project_name} is public."
            )
            assert result[0].resource_id == project_name
            assert result[0].resource_arn == project_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
```

--------------------------------------------------------------------------------

````
