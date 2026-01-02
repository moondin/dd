---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 488
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 488 of 867)

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

---[FILE: codebuild_report_group_export_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/codebuild/codebuild_report_group_export_encrypted/codebuild_report_group_export_encrypted_test.py

```python
from unittest.mock import patch

import botocore
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call_encrypted(self, operation_name, kwarg):
    if operation_name == "ListReportGroups":
        return {
            "reportGroups": [
                f"arn:aws:codebuild:eu-west-1:{AWS_ACCOUNT_NUMBER}:report-group/test-report-group-encrypted"
            ]
        }
    elif operation_name == "BatchGetReportGroups":
        return {
            "reportGroups": [
                {
                    "name": "test-report-group-encrypted",
                    "arn": f"arn:aws:codebuild:eu-west-1:{AWS_ACCOUNT_NUMBER}:report-group/test-report-group-encrypted",
                    "exportConfig": {
                        "exportConfigType": "S3",
                        "s3Destination": {
                            "bucket": "test-bucket",
                            "path": "test-path",
                            "encryptionKey": f"arn:aws:kms:eu-west-1:{AWS_ACCOUNT_NUMBER}:key/12345678-1234-1234-1234-{AWS_ACCOUNT_NUMBER}",
                            "encryptionDisabled": False,
                        },
                    },
                    "tags": [{"key": "Name", "value": "test-report-group-encrypted"}],
                    "status": "ACTIVE",
                }
            ]
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


def mock_make_api_call_not_encrypted(self, operation_name, kwarg):
    if operation_name == "ListReportGroups":
        return {
            "reportGroups": [
                f"arn:aws:codebuild:eu-west-1:{AWS_ACCOUNT_NUMBER}:report-group/test-report-group-not-encrypted"
            ]
        }
    elif operation_name == "BatchGetReportGroups":
        return {
            "reportGroups": [
                {
                    "name": "test-report-group-not-encrypted",
                    "arn": f"arn:aws:codebuild:eu-west-1:{AWS_ACCOUNT_NUMBER}:report-group/test-report-group-not-encrypted",
                    "exportConfig": {
                        "exportConfigType": "S3",
                        "s3Destination": {
                            "bucket": "test-bucket",
                            "path": "test-path",
                            "encryptionKey": "",
                            "encryptionDisabled": True,
                        },
                    },
                    "tags": [
                        {"key": "Name", "value": "test-report-group-not-encrypted"}
                    ],
                    "status": "ACTIVE",
                }
            ]
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


class Test_codebuild_report_group_export_encrypted:
    @mock_aws
    def test_no_report_groups(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_report_group_export_encrypted.codebuild_report_group_export_encrypted.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_report_group_export_encrypted.codebuild_report_group_export_encrypted import (
                codebuild_report_group_export_encrypted,
            )

            check = codebuild_report_group_export_encrypted()
            result = check.execute()

            assert len(result) == 0

    @patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_encrypted
    )
    @mock_aws
    def test_report_group_export_encrypted(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_report_group_export_encrypted.codebuild_report_group_export_encrypted.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_report_group_export_encrypted.codebuild_report_group_export_encrypted import (
                codebuild_report_group_export_encrypted,
            )

            check = codebuild_report_group_export_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CodeBuild report group test-report-group-encrypted exports are encrypted at s3://test-bucket/test-path with KMS key arn:aws:kms:eu-west-1:{AWS_ACCOUNT_NUMBER}:key/12345678-1234-1234-1234-{AWS_ACCOUNT_NUMBER}."
            )
            assert result[0].resource_id == "test-report-group-encrypted"
            assert (
                result[0].resource_arn
                == f"arn:aws:codebuild:eu-west-1:{AWS_ACCOUNT_NUMBER}:report-group/test-report-group-encrypted"
            )
            assert result[0].resource_tags == [
                {"key": "Name", "value": "test-report-group-encrypted"}
            ]
            assert result[0].region == AWS_REGION_EU_WEST_1

    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_not_encrypted,
    )
    @mock_aws
    def test_report_group_export_not_encrypted(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.codebuild.codebuild_report_group_export_encrypted.codebuild_report_group_export_encrypted.codebuild_client",
                new=Codebuild(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.codebuild.codebuild_report_group_export_encrypted.codebuild_report_group_export_encrypted import (
                codebuild_report_group_export_encrypted,
            )

            check = codebuild_report_group_export_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "CodeBuild report group test-report-group-not-encrypted exports are not encrypted at s3://test-bucket/test-path."
            )
            assert result[0].resource_id == "test-report-group-not-encrypted"
            assert (
                result[0].resource_arn
                == f"arn:aws:codebuild:eu-west-1:{AWS_ACCOUNT_NUMBER}:report-group/test-report-group-not-encrypted"
            )
            assert result[0].resource_tags == [
                {"key": "Name", "value": "test-report-group-not-encrypted"}
            ]
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: codepipeline_service_test.py]---
Location: prowler-master/tests/providers/aws/services/codepipeline/codepipeline_service_test.py

```python
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.codepipeline.codepipeline_service import (
    CodePipeline,
    Pipeline,
    Source,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_COMMERCIAL_PARTITION,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

pipeline_name = "test-pipeline"
pipeline_arn = f"arn:{AWS_COMMERCIAL_PARTITION}:codepipeline:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{pipeline_name}"
source_type = "CodeStarSourceConnection"
repository_id = "prowler-cloud/prowler-private"
connection_arn = f"arn:{AWS_COMMERCIAL_PARTITION}:codestar-connections:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:connection/test"

# Mocking API calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListPipelines":
        return {"pipelines": [{"name": pipeline_name}]}
    elif operation_name == "GetPipeline":
        return {
            "pipeline": {
                "name": pipeline_name,
                "stages": [
                    {
                        "name": "Source",
                        "actions": [
                            {
                                "name": "Source",
                                "actionTypeId": {
                                    "category": "Source",
                                    "owner": "AWS",
                                    "provider": source_type,
                                    "version": "1",
                                },
                                "configuration": {
                                    "ConnectionArn": connection_arn,
                                    "FullRepositoryId": repository_id,
                                },
                            }
                        ],
                    }
                ],
            },
        }
    elif operation_name == "ListTagsForResource":
        return {"tags": [{"key": "Environment", "value": "Test"}]}
    return make_api_call(self, operation_name, kwarg)


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


class Test_CodePipeline_Service:
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @patch(
        "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
        new=mock_generate_regional_clients,
    )
    @mock_aws
    def test_codepipeline_service(self):
        codepipeline = CodePipeline(set_mocked_aws_provider())

        assert codepipeline.session.__class__.__name__ == "Session"
        assert codepipeline.service == "codepipeline"

        # Test pipeline properties
        assert len(codepipeline.pipelines) == 1
        assert isinstance(codepipeline.pipelines, dict)
        assert isinstance(codepipeline.pipelines[pipeline_arn], Pipeline)

        pipeline = codepipeline.pipelines[pipeline_arn]
        assert pipeline.name == pipeline_name
        assert pipeline.arn == pipeline_arn
        assert pipeline.region == AWS_REGION_EU_WEST_1

        # Test source properties
        assert isinstance(pipeline.source, Source)
        assert pipeline.source.type == source_type
        assert pipeline.source.repository_id == repository_id
        assert pipeline.source.configuration == {
            "ConnectionArn": connection_arn,
            "FullRepositoryId": repository_id,
        }

        # Test tags
        assert pipeline.tags[0]["key"] == "Environment"
        assert pipeline.tags[0]["value"] == "Test"
```

--------------------------------------------------------------------------------

---[FILE: codepipeline_project_repo_private_test.py]---
Location: prowler-master/tests/providers/aws/services/codepipeline/codepipeline_project_repo_private/codepipeline_project_repo_private_test.py

```python
import urllib.error
import urllib.request
from unittest import mock

from prowler.providers.aws.services.codepipeline.codepipeline_service import (
    Pipeline,
    Source,
)
from tests.providers.aws.utils import set_mocked_aws_provider

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_codepipeline_project_repo_private:
    """Tests for AWS CodePipeline repository privacy checks.
    This module contains test cases to verify the functionality of checking
    whether CodePipeline source repositories are private or public.
    """

    def test_pipeline_private_repo(self):
        """Test detection of private repository in CodePipeline.
        Tests that the check correctly identifies a private repository
        when both GitHub and GitLab return 404.
        """
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=set_mocked_aws_provider([AWS_REGION]),
        ):
            codepipeline_client = mock.MagicMock
            pipeline_name = "test-pipeline"
            pipeline_arn = f"arn:aws:codepipeline:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:pipeline/{pipeline_name}"
            connection_arn = f"arn:aws:codestar-connections:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:connection/test-connection"
            repo_id = "prowler-cloud/prowler-private"

            codepipeline_client.pipelines = {
                pipeline_arn: Pipeline(
                    name=pipeline_name,
                    arn=pipeline_arn,
                    region=AWS_REGION,
                    source=Source(
                        type="CodeStarSourceConnection",
                        repository_id=repo_id,
                        configuration={
                            "FullRepositoryId": repo_id,
                            "ConnectionArn": connection_arn,
                        },
                    ),
                    tags=[],
                )
            }

            with (
                mock.patch(
                    "prowler.providers.aws.services.codepipeline.codepipeline_service.CodePipeline",
                    codepipeline_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.codepipeline.codepipeline_project_repo_private.codepipeline_project_repo_private.codepipeline_client",
                    codepipeline_client,
                ),
                mock.patch("boto3.client") as mock_client,
                mock.patch("urllib.request.urlopen") as mock_urlopen,
            ):
                mock_connection = mock_client.return_value
                mock_connection.get_connection.return_value = {
                    "Connection": {"ProviderType": "GitHub"}
                }

                def mock_urlopen_side_effect(req, context=None):
                    raise urllib.error.HTTPError(
                        url="", code=404, msg="", hdrs={}, fp=None
                    )

                mock_urlopen.side_effect = mock_urlopen_side_effect

                from prowler.providers.aws.services.codepipeline.codepipeline_project_repo_private.codepipeline_project_repo_private import (
                    codepipeline_project_repo_private,
                )

                check = codepipeline_project_repo_private()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"CodePipeline {pipeline_name} source repository {repo_id} is private."
                )
                assert result[0].resource_id == pipeline_name
                assert result[0].resource_arn == pipeline_arn
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION

    def test_pipeline_public_github_repo(self):
        """Test detection of public GitHub repository in CodePipeline.
        Tests that the check correctly identifies a public GitHub repository
        when GitHub returns 200.
        """
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=set_mocked_aws_provider([AWS_REGION]),
        ):
            codepipeline_client = mock.MagicMock
            pipeline_name = "test-pipeline"
            pipeline_arn = f"arn:aws:codepipeline:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:pipeline/{pipeline_name}"
            connection_arn = f"arn:aws:codestar-connections:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:connection/test-connection"
            repo_id = "prowler-cloud/prowler"

            codepipeline_client.pipelines = {
                pipeline_arn: Pipeline(
                    name=pipeline_name,
                    arn=pipeline_arn,
                    region=AWS_REGION,
                    source=Source(
                        type="CodeStarSourceConnection",
                        repository_id=repo_id,
                        configuration={
                            "FullRepositoryId": repo_id,
                            "ConnectionArn": connection_arn,
                        },
                    ),
                    tags=[],
                )
            }

            with (
                mock.patch(
                    "prowler.providers.aws.services.codepipeline.codepipeline_service.CodePipeline",
                    codepipeline_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.codepipeline.codepipeline_project_repo_private.codepipeline_project_repo_private.codepipeline_client",
                    codepipeline_client,
                ),
                mock.patch("boto3.client") as mock_client,
                mock.patch("urllib.request.urlopen") as mock_urlopen,
            ):
                mock_connection = mock_client.return_value
                mock_connection.get_connection.return_value = {
                    "Connection": {"ProviderType": "GitHub"}
                }

                mock_response = mock.MagicMock()
                mock_response.getcode.return_value = 200
                mock_response.geturl.return_value = f"https://github.com/{repo_id}"

                def mock_urlopen_side_effect(req, context=None):
                    if "github.com" in req.get_full_url():
                        return mock_response
                    raise urllib.error.HTTPError(
                        url="", code=404, msg="", hdrs={}, fp=None
                    )

                mock_urlopen.side_effect = mock_urlopen_side_effect

                from prowler.providers.aws.services.codepipeline.codepipeline_project_repo_private.codepipeline_project_repo_private import (
                    codepipeline_project_repo_private,
                )

                check = codepipeline_project_repo_private()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"CodePipeline {pipeline_name} source repository is public: https://github.com/{repo_id}"
                )
                assert result[0].resource_id == pipeline_name
                assert result[0].resource_arn == pipeline_arn
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION

    def test_pipeline_public_gitlab_repo(self):
        """Test detection of public GitLab repository in CodePipeline.
        Tests that the check correctly identifies a public GitLab repository
        when GitLab returns 200 without sign_in redirect.
        """
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=set_mocked_aws_provider([AWS_REGION]),
        ):
            codepipeline_client = mock.MagicMock
            pipeline_name = "test-pipeline"
            pipeline_arn = f"arn:aws:codepipeline:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:pipeline/{pipeline_name}"
            connection_arn = f"arn:aws:codestar-connections:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:connection/test-connection"
            repo_id = "prowler-cloud/prowler-private"

            codepipeline_client.pipelines = {
                pipeline_arn: Pipeline(
                    name=pipeline_name,
                    arn=pipeline_arn,
                    region=AWS_REGION,
                    source=Source(
                        type="CodeStarSourceConnection",
                        repository_id=repo_id,
                        configuration={
                            "FullRepositoryId": repo_id,
                            "ConnectionArn": connection_arn,
                        },
                    ),
                    tags=[],
                )
            }

            with (
                mock.patch(
                    "prowler.providers.aws.services.codepipeline.codepipeline_service.CodePipeline",
                    codepipeline_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.codepipeline.codepipeline_project_repo_private.codepipeline_project_repo_private.codepipeline_client",
                    codepipeline_client,
                ),
                mock.patch("boto3.client") as mock_client,
                mock.patch("urllib.request.urlopen") as mock_urlopen,
            ):
                mock_connection = mock_client.return_value
                mock_connection.get_connection.return_value = {
                    "Connection": {"ProviderType": "GitLab"}
                }

                mock_response = mock.MagicMock()
                mock_response.getcode.return_value = 200
                mock_response.geturl.return_value = f"https://gitlab.com/{repo_id}"

                def mock_urlopen_side_effect(req, context=None):
                    if "gitlab.com" in req.get_full_url():
                        return mock_response
                    raise urllib.error.HTTPError(
                        url="", code=404, msg="", hdrs={}, fp=None
                    )

                mock_urlopen.side_effect = mock_urlopen_side_effect

                from prowler.providers.aws.services.codepipeline.codepipeline_project_repo_private.codepipeline_project_repo_private import (
                    codepipeline_project_repo_private,
                )

                check = codepipeline_project_repo_private()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"CodePipeline {pipeline_name} source repository is public: https://gitlab.com/{repo_id}"
                )
                assert result[0].resource_id == pipeline_name
                assert result[0].resource_arn == pipeline_arn
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION
```

--------------------------------------------------------------------------------

````
