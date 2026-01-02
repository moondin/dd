---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 257
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 257 of 867)

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

---[FILE: codebuild_report_group_export_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_report_group_export_encrypted/codebuild_report_group_export_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.codebuild.codebuild_client import codebuild_client


class codebuild_report_group_export_encrypted(Check):
    def execute(self):
        findings = []
        for report_group in codebuild_client.report_groups.values():
            if report_group.export_config and report_group.export_config.type == "S3":
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=report_group
                )
                report.status = "PASS"
                report.status_extended = f"CodeBuild report group {report_group.name} exports are encrypted at {report_group.export_config.bucket_location} with KMS key {report_group.export_config.encryption_key}."

                if not report_group.export_config.encrypted:
                    report.status = "FAIL"
                    report.status_extended = f"CodeBuild report group {report_group.name} exports are not encrypted at {report_group.export_config.bucket_location}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: codepipeline_client.py]---
Location: prowler-master/prowler/providers/aws/services/codepipeline/codepipeline_client.py

```python
from prowler.providers.aws.services.codepipeline.codepipeline_service import (
    CodePipeline,
)
from prowler.providers.common.provider import Provider

codepipeline_client = CodePipeline(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: codepipeline_service.py]---
Location: prowler-master/prowler/providers/aws/services/codepipeline/codepipeline_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.exceptions import ClientError
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.aws.lib.service.service import AWSService


class CodePipeline(AWSService):
    """AWS CodePipeline service class for managing pipeline resources.

    This class handles interactions with AWS CodePipeline service, including
    listing pipelines and retrieving their states. It manages pipeline resources
    and their associated metadata.

    Attributes:
        pipelines: Dictionary mapping pipeline ARNs to Pipeline objects.
    """

    def __init__(self, provider):
        """Initializes the CodePipeline service class.

        Args:
            provider: AWS provider instance for making API calls.
        """
        super().__init__(__class__.__name__, provider)
        self.pipelines = {}
        self.__threading_call__(self._list_pipelines)
        if self.pipelines:
            self.__threading_call__(self._get_pipeline_state, self.pipelines.values())
            self.__threading_call__(
                self._list_tags_for_resource, self.pipelines.values()
            )

    def _list_pipelines(self, regional_client):
        """Lists all CodePipeline pipelines in the specified region.

        Retrieves all pipelines using pagination and creates Pipeline objects
        for each pipeline found.

        Args:
            regional_client: AWS regional client for CodePipeline service.

        Raises:
            ClientError: If there is an AWS API error.
        """
        logger.info("CodePipeline - Listing pipelines...")
        try:
            list_pipelines_paginator = regional_client.get_paginator("list_pipelines")
            for page in list_pipelines_paginator.paginate():
                for pipeline in page["pipelines"]:
                    pipeline_arn = f"arn:{self.audited_partition}:codepipeline:{regional_client.region}:{self.audited_account}:{pipeline['name']}"
                    if self.pipelines is None:
                        self.pipelines = {}
                    self.pipelines[pipeline_arn] = Pipeline(
                        name=pipeline["name"],
                        arn=pipeline_arn,
                        region=regional_client.region,
                    )
        except ClientError as error:
            if error.response["Error"]["Code"] == "AccessDenied":
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                if not self.pipelines:
                    self.pipelines = None
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_pipeline_state(self, pipeline):
        """Retrieves the current state of a pipeline.

        Gets detailed information about a pipeline including its source configuration.

        Args:
            pipeline: Pipeline object to retrieve state for.

        Raises:
            ClientError: If there is an AWS API error.
        """
        logger.info("CodePipeline - Getting pipeline state...")
        try:
            regional_client = self.regional_clients[pipeline.region]
            pipeline_info = regional_client.get_pipeline(name=pipeline.name)
            source_info = pipeline_info["pipeline"]["stages"][0]["actions"][0]
            repository_id = source_info["configuration"].get("FullRepositoryId", "")
            pipeline.source = Source(
                type=source_info["actionTypeId"]["provider"],
                repository_id=repository_id,
                configuration=source_info["configuration"],
            )
        except ClientError as error:
            logger.error(
                f"{pipeline.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        except Exception as error:
            logger.error(
                f"{pipeline.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self, resource):
        """Lists tags for a given resource.

        Args:
            resource: Resource object to retrieve tags for.
        """
        logger.info("CodePipeline - Listing Tags...")
        try:
            tags_response = self.regional_clients[
                resource.region
            ].list_tags_for_resource(resourceArn=resource.arn)
            resource.tags = tags_response.get("tags", [])
        except ClientError as error:
            if error.response["Error"]["Code"] == "ResourceNotFoundException":
                logger.warning(
                    f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Source(BaseModel):
    """Model representing a pipeline source configuration.

    Attributes:
        type: The type of source provider.
        location: The location/path of the source repository.
        configuration: Optional dictionary containing additional source configuration.
    """

    type: str
    repository_id: str
    configuration: Optional[dict]


class Pipeline(BaseModel):
    """Model representing an AWS CodePipeline pipeline.

    Attributes:
        name: The name of the pipeline.
        arn: The ARN (Amazon Resource Name) of the pipeline.
        region: The AWS region where the pipeline exists.
        source: Optional Source object containing source configuration.
        tags: Optional list of pipeline tags.
    """

    name: str
    arn: str
    region: str
    source: Optional[Source] = None
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: codepipeline_project_repo_private.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/codepipeline/codepipeline_project_repo_private/codepipeline_project_repo_private.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "codepipeline_project_repo_private",
  "CheckTitle": "Ensure that CodePipeline projects do not use public GitHub or GitLab repositories as source.",
  "CheckType": [],
  "ServiceName": "codepipeline",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Ensure that CodePipeline projects do not use public GitHub or GitLab repositories as source.",
  "Risk": "Using public Git repositories in CodePipeline projects could expose sensitive deployment configurations and increase the risk of supply chain attacks.",
  "RelatedUrl": "https://docs.aws.amazon.com/codepipeline/latest/userguide/connections-github.html",
  "Remediation": {
    "Code": {
      "CLI": "aws codestar-connections create-connection --provider-type GitHub|GitLab --connection-name <connection-name>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use private Git repositories for CodePipeline sources and ensure proper authentication is configured using AWS CodeStar Connections. Consider using AWS CodeCommit or other private repository solutions for sensitive code.",
      "Url": "https://docs.aws.amazon.com/codepipeline/latest/userguide/connections"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check supports both GitHub and GitLab repositories through CodeStar Connections"
}
```

--------------------------------------------------------------------------------

---[FILE: codepipeline_project_repo_private.py]---
Location: prowler-master/prowler/providers/aws/services/codepipeline/codepipeline_project_repo_private/codepipeline_project_repo_private.py

```python
import ssl
import urllib.error
import urllib.request

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.codepipeline.codepipeline_client import (
    codepipeline_client,
)


class codepipeline_project_repo_private(Check):
    """Checks if AWS CodePipeline source repositories are configured as private.

    This check verifies whether source repositories (GitHub or GitLab) connected to
    CodePipeline are publicly accessible. It attempts to access the repositories
    anonymously to determine their visibility status.

    Attributes:
        None
    """

    def execute(self) -> list:
        """Executes the repository privacy check for all CodePipeline sources.

        Iterates through all CodePipeline pipelines and checks if their source
        repositories (GitHub/GitLab) are publicly accessible by attempting anonymous
        access.

        Returns:
            list: List of Check_Report_AWS objects containing the findings for each
                pipeline's source repository.
        """
        findings = []

        for pipeline in codepipeline_client.pipelines.values():
            if (
                pipeline.source
                and pipeline.source.type == "CodeStarSourceConnection"
                and pipeline.source.repository_id
            ):
                report = Check_Report_AWS(self.metadata(), resource=pipeline)
                report.region = pipeline.region
                report.resource_id = pipeline.name
                report.resource_arn = pipeline.arn
                report.resource_tags = pipeline.tags

                # Try both GitHub and GitLab URLs
                github_url = f"https://github.com/{pipeline.source.repository_id}"
                gitlab_url = f"https://gitlab.com/{pipeline.source.repository_id}"

                is_public_github = self._is_public_repo(github_url)
                is_public_gitlab = self._is_public_repo(gitlab_url)

                if is_public_github:
                    report.status = "FAIL"
                    report.status_extended = f"CodePipeline {pipeline.name} source repository is public: {github_url}"
                elif is_public_gitlab:
                    report.status = "FAIL"
                    report.status_extended = f"CodePipeline {pipeline.name} source repository is public: {gitlab_url}"
                else:
                    report.status = "PASS"
                    report.status_extended = f"CodePipeline {pipeline.name} source repository {pipeline.source.repository_id} is private."

                findings.append(report)

        return findings

    def _is_public_repo(self, repo_url: str) -> bool:
        """Checks if a repository is publicly accessible.

        Attempts to access the repository URL anonymously to determine if it's
        public or private.

        Args:
            repo_url: String containing the repository URL to check.

        Returns:
            bool: True if the repository is public, False if private or inaccessible.

        Note:
            The method considers a repository private if:
            - The URL redirects to a sign-in page
            - The request fails with HTTP errors
            - The URL is not accessible
        """
        if repo_url.endswith(".git"):
            repo_url = repo_url[:-4]

        try:
            context = ssl._create_unverified_context()
            req = urllib.request.Request(repo_url, method="HEAD")
            response = urllib.request.urlopen(req, context=context)
            return not response.geturl().endswith("sign_in")
        except (urllib.error.HTTPError, urllib.error.URLError):
            return False
```

--------------------------------------------------------------------------------

---[FILE: cognito_identity_client.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_identity_client.py

```python
from prowler.providers.aws.services.cognito.cognito_service import CognitoIdentity
from prowler.providers.common.provider import Provider

cognito_identity_client = CognitoIdentity(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: cognito_idp_client.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_idp_client.py

```python
from prowler.providers.aws.services.cognito.cognito_service import CognitoIDP
from prowler.providers.common.provider import Provider

cognito_idp_client = CognitoIDP(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: cognito_service.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_service.py
Signals: Pydantic

```python
from datetime import datetime
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class CognitoIDP(AWSService):
    def __init__(self, provider):
        super().__init__("cognito-idp", provider)

        self.user_pools = {}
        self.__threading_call__(self._list_user_pools)
        self._describe_user_pools()
        self._list_user_pool_clients()
        self._describe_user_pool_clients()
        self._get_user_pool_mfa_config()
        self._get_user_pool_risk_configuration()

    def _list_user_pools(self, regional_client):
        logger.info("Cognito - Listing User Pools...")
        try:
            user_pools_paginator = regional_client.get_paginator("list_user_pools")
            for page in user_pools_paginator.paginate(MaxResults=60):
                for user_pool in page["UserPools"]:
                    arn = f"arn:{self.audited_partition}:cognito-idp:{regional_client.region}:{self.audited_account}:userpool/{user_pool['Id']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        try:
                            self.user_pools[arn] = UserPool(
                                id=user_pool["Id"],
                                arn=arn,
                                name=user_pool["Name"],
                                region=regional_client.region,
                                last_modified=user_pool["LastModifiedDate"],
                                creation_date=user_pool["CreationDate"],
                                status=user_pool.get("Status", "Disabled"),
                                user_pool_clients={},
                            )
                        except Exception as error:
                            logger.error(
                                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_user_pools(self):
        logger.info("Cognito - Describing User Pools...")
        try:
            for user_pool in self.user_pools.values():
                try:
                    user_pool_details = self.regional_clients[
                        user_pool.region
                    ].describe_user_pool(UserPoolId=user_pool.id)["UserPool"]
                    self.user_pools[user_pool.arn].password_policy = PasswordPolicy(
                        minimum_length=user_pool_details.get("Policies", {})
                        .get("PasswordPolicy", {})
                        .get("MinimumLength", 0),
                        require_lowercase=user_pool_details.get("Policies", {})
                        .get("PasswordPolicy", {})
                        .get("RequireLowercase", False),
                        require_numbers=user_pool_details.get("Policies", {})
                        .get("PasswordPolicy", {})
                        .get("RequireNumbers", False),
                        require_symbols=user_pool_details.get("Policies", {})
                        .get("PasswordPolicy", {})
                        .get("RequireSymbols", False),
                        require_uppercase=user_pool_details.get("Policies", {})
                        .get("PasswordPolicy", {})
                        .get("RequireUppercase", False),
                        temporary_password_validity_days=user_pool_details.get(
                            "Policies", {}
                        )
                        .get("PasswordPolicy", {})
                        .get("TemporaryPasswordValidityDays", 0),
                    )
                    self.user_pools[user_pool.arn].deletion_protection = (
                        user_pool_details.get("DeletionProtection", "INACTIVE")
                    )
                    self.user_pools[user_pool.arn].advanced_security_mode = (
                        user_pool_details.get("UserPoolAddOns", {}).get(
                            "AdvancedSecurityMode", "OFF"
                        )
                    )
                    self.user_pools[user_pool.arn].tags = [
                        user_pool_details.get("UserPoolTags", "")
                    ]
                    self.user_pools[user_pool.arn].account_recovery_settings = (
                        user_pool_details.get("AccountRecoverySetting", {})
                    )
                    self.user_pools[user_pool.arn].admin_create_user_config = (
                        AdminCreateUserConfig(
                            allow_admin_create_user_only=user_pool_details.get(
                                "AdminCreateUserConfig", {}
                            ).get("AllowAdminCreateUserOnly", False)
                        )
                    )
                    self.user_pools[user_pool.arn].tags = user_pool_details.get(
                        "UserPoolTags", []
                    )
                except Exception as error:
                    logger.error(
                        f"{user_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{user_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_user_pool_clients(self):
        logger.info("Cognito - Listing User Pool Clients...")
        try:
            for user_pool in self.user_pools.values():
                try:
                    user_pool_clients = self.regional_clients[
                        user_pool.region
                    ].list_user_pool_clients(UserPoolId=user_pool.id)
                    for user_pool_client in user_pool_clients["UserPoolClients"]:
                        user_pool_client_arn = (
                            f"{user_pool.arn}/client/{user_pool_client['ClientId']}"
                        )
                        self.user_pools[user_pool.arn].user_pool_clients[
                            user_pool_client["ClientId"]
                        ] = UserPoolClient(
                            id=user_pool_client["ClientId"],
                            name=user_pool_client["ClientName"],
                            arn=user_pool_client_arn,
                            region=user_pool.region,
                        )
                except Exception as error:
                    logger.error(
                        f"{user_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{user_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_user_pool_clients(self):
        logger.info("Cognito - Describing User Pool Clients...")
        try:
            for user_pool in self.user_pools.values():
                try:
                    for user_pool_client in user_pool.user_pool_clients.values():
                        user_pool_client_details = self.regional_clients[
                            user_pool.region
                        ].describe_user_pool_client(
                            UserPoolId=user_pool.id, ClientId=user_pool_client.id
                        )[
                            "UserPoolClient"
                        ]
                        self.user_pools[user_pool.arn].user_pool_clients[
                            user_pool_client.id
                        ].prevent_user_existence_errors = user_pool_client_details.get(
                            "PreventUserExistenceErrors", ""
                        )
                        self.user_pools[user_pool.arn].user_pool_clients[
                            user_pool_client.id
                        ].enable_token_revocation = user_pool_client_details.get(
                            "EnableTokenRevocation", False
                        )
                except Exception as error:
                    logger.error(
                        f"{user_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{user_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_user_pool_mfa_config(self):
        logger.info("Cognito - Getting User Pool MFA Configuration...")
        try:
            for user_pool in self.user_pools.values():
                try:
                    mfa_config = self.regional_clients[
                        user_pool.region
                    ].get_user_pool_mfa_config(UserPoolId=user_pool.id)
                    if mfa_config["MfaConfiguration"] != "OFF":
                        self.user_pools[user_pool.arn].mfa_config = MFAConfig(
                            sms_authentication=mfa_config.get(
                                "SmsMfaConfiguration", {}
                            ),
                            software_token_mfa_authentication=mfa_config.get(
                                "SoftwareTokenMfaConfiguration", {}
                            ),
                            status=mfa_config["MfaConfiguration"],
                        )
                except Exception as error:
                    logger.error(
                        f"{user_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{user_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_user_pool_risk_configuration(self):
        logger.info("Cognito - Getting User Pool Risk Configuration...")
        try:
            for user_pool in self.user_pools.values():
                try:
                    risk_configuration = self.regional_clients[
                        user_pool.region
                    ].describe_risk_configuration(UserPoolId=user_pool.id)
                    if risk_configuration.get("RiskConfiguration"):
                        self.user_pools[user_pool.arn].risk_configuration = (
                            RiskConfiguration(
                                compromised_credentials_risk_configuration=CompromisedCredentialsRiskConfiguration(
                                    event_filter=risk_configuration.get(
                                        "RiskConfiguration", {}
                                    )
                                    .get("CompromisedCredentialsRiskConfiguration", {})
                                    .get("EventFilter", []),
                                    actions=risk_configuration.get(
                                        "RiskConfiguration", {}
                                    )
                                    .get("CompromisedCredentialsRiskConfiguration", {})
                                    .get("Actions", {})
                                    .get("EventAction", ""),
                                ),
                                account_takeover_risk_configuration=AccountTakeoverRiskConfiguration(
                                    low_action=risk_configuration.get(
                                        "RiskConfiguration", {}
                                    )
                                    .get("AccountTakeoverRiskConfiguration", {})
                                    .get("Actions", {})
                                    .get("LowAction", {})
                                    .get("EventAction", ""),
                                    medium_action=risk_configuration.get(
                                        "RiskConfiguration", {}
                                    )
                                    .get("AccountTakeoverRiskConfiguration", {})
                                    .get("Actions", {})
                                    .get("MediumAction", {})
                                    .get("EventAction", ""),
                                    high_action=risk_configuration.get(
                                        "RiskConfiguration", {}
                                    )
                                    .get("AccountTakeoverRiskConfiguration", {})
                                    .get("Actions", {})
                                    .get("HighAction", {})
                                    .get("EventAction", ""),
                                ),
                            )
                        )
                except Exception as error:
                    logger.error(
                        f"{user_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{user_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class CognitoIdentity(AWSService):
    def __init__(self, provider):
        super().__init__("cognito-identity", provider)
        self.identity_pools = {}
        self.__threading_call__(self._list_identity_pools)
        self._describe_identity_pools()
        self._get_identity_pool_roles()

    def _list_identity_pools(self, regional_client):
        logger.info("Cognito - Listing Identity Pools...")
        try:
            identity_pools_paginator = regional_client.get_paginator(
                "list_identity_pools"
            )
            for page in identity_pools_paginator.paginate(MaxResults=60):
                for identity_pool in page["IdentityPools"]:
                    arn = f"arn:{self.audited_partition}:cognito-identity:{regional_client.region}:{self.audited_account}:identitypool/{identity_pool['IdentityPoolId']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        try:
                            self.identity_pools[arn] = IdentityPool(
                                id=identity_pool["IdentityPoolId"],
                                arn=arn,
                                name=identity_pool["IdentityPoolName"],
                                region=regional_client.region,
                            )
                        except Exception as error:
                            logger.error(
                                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_identity_pools(self):
        logger.info("Cognito - Describing Identity Pools...")
        try:
            for identity_pool in self.identity_pools.values():
                try:
                    identity_pool_details = self.regional_clients[
                        identity_pool.region
                    ].describe_identity_pool(IdentityPoolId=identity_pool.id)
                    self.identity_pools[identity_pool.arn].associated_pools = (
                        identity_pool_details.get("CognitoIdentityProviders", [])
                    )
                    self.identity_pools[identity_pool.arn].tags = (
                        identity_pool_details.get("IdentityPoolTags", {})
                    )
                    self.identity_pools[
                        identity_pool.arn
                    ].allow_unauthenticated_identities = identity_pool_details.get(
                        "AllowUnauthenticatedIdentities", False
                    )
                except Exception as error:
                    logger.error(
                        f"{identity_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{identity_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_identity_pool_roles(self):
        logger.info("Cognito - Getting Identity Pool Roles...")
        try:
            for identity_pool in self.identity_pools.values():
                try:
                    identity_pool_roles = self.regional_clients[
                        identity_pool.region
                    ].get_identity_pool_roles(IdentityPoolId=identity_pool.id)
                    self.identity_pools[identity_pool.arn].roles = IdentityPoolRoles(
                        authenticated=identity_pool_roles.get("Roles", {}).get(
                            "authenticated", ""
                        ),
                        unauthenticated=identity_pool_roles.get("Roles", {}).get(
                            "unauthenticated", ""
                        ),
                    )
                except Exception as error:
                    logger.error(
                        f"{identity_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{identity_pool.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class MFAConfig(BaseModel):
    sms_authentication: Optional[dict]
    software_token_mfa_authentication: Optional[dict]
    status: str


class AccountTakeoverRiskConfiguration(BaseModel):
    low_action: Optional[str]
    medium_action: Optional[str]
    high_action: Optional[str]


class CompromisedCredentialsRiskConfiguration(BaseModel):
    event_filter: Optional[list]
    actions: Optional[str]


class RiskConfiguration(BaseModel):
    compromised_credentials_risk_configuration: Optional[
        CompromisedCredentialsRiskConfiguration
    ]
    account_takeover_risk_configuration: Optional[AccountTakeoverRiskConfiguration]


class UserPoolClient(BaseModel):
    id: str
    name: str
    arn: str
    region: str
    prevent_user_existence_errors: Optional[str]
    enable_token_revocation: Optional[bool]


class PasswordPolicy(BaseModel):
    minimum_length: Optional[int]
    require_lowercase: Optional[bool]
    require_numbers: Optional[bool]
    require_symbols: Optional[bool]
    require_uppercase: Optional[bool]
    temporary_password_validity_days: Optional[int]


class AdminCreateUserConfig(BaseModel):
    allow_admin_create_user_only: bool


class UserPool(BaseModel):
    id: str
    arn: str
    name: str
    region: str
    advanced_security_mode: str = "OFF"
    deletion_protection: str = "INACTIVE"
    last_modified: datetime
    creation_date: datetime
    status: str
    password_policy: Optional[PasswordPolicy]
    mfa_config: Optional[MFAConfig]
    tags: Optional[dict]
    account_recovery_settings: Optional[dict]
    user_pool_clients: Optional[dict]
    risk_configuration: Optional[RiskConfiguration]
    admin_create_user_config: Optional[AdminCreateUserConfig]
    tags: Optional[list]


class IdentityPoolRoles(BaseModel):
    authenticated: Optional[str]
    unauthenticated: Optional[str]


class IdentityPool(BaseModel):
    id: str
    arn: str
    name: str
    region: str
    tags: Optional[dict]
    associated_pools: Optional[list]
    allow_unauthenticated_identities: Optional[bool]
    roles: Optional[IdentityPoolRoles]
```

--------------------------------------------------------------------------------

---[FILE: cognito_identity_pool_guest_access_disabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_identity_pool_guest_access_disabled/cognito_identity_pool_guest_access_disabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_identity_pool_guest_access_disabled",
  "CheckTitle": "Ensure Cognito Identity Pool has guest access disabled",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:identitypool/identitypool-id",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Guest access allows unauthenticated users to access your identity pool. This is useful for public websites that allow users to sign in with a social identity provider, but it can also be a security risk. If you don't need guest access, you should disable it.",
  "Risk": "If guest access is enabled, unauthenticated users can access your identity pool. This can be a security risk if you don't need guest access.",
  "RelatedUrl": "https://docs.aws.amazon.com/location/latest/developerguide/authenticating-using-cognito.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Gues access should be disabled for Cognito Identity Pool. To disable guest access, follow the steps in the Amazon Cognito documentation.",
      "Url": "https://docs.aws.amazon.com/location/latest/developerguide/authenticating-using-cognito.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_identity_pool_guest_access_disabled.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_identity_pool_guest_access_disabled/cognito_identity_pool_guest_access_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_identity_client import (
    cognito_identity_client,
)


class cognito_identity_pool_guest_access_disabled(Check):
    def execute(self):
        findings = []
        for identity_pool in cognito_identity_client.identity_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=identity_pool)
            report.status = "PASS"
            report.status_extended = (
                f"Identity pool {identity_pool.id} has guest access disabled."
            )
            if identity_pool.allow_unauthenticated_identities:
                report.status = "FAIL"
                report.status_extended = (
                    f"Identity pool {identity_pool.name} has guest access enabled."
                )
                if identity_pool.roles.unauthenticated:
                    report.status_extended = f"Identity pool {identity_pool.name} has guest access enabled assuming the role {identity_pool.roles.unauthenticated}."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_advanced_security_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_advanced_security_enabled/cognito_user_pool_advanced_security_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_advanced_security_enabled",
  "CheckTitle": "Ensure cognito user pools has advanced security enabled with full-function",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "Advanced security features for Amazon Cognito User Pools provide additional security for your user pool. These features include compromised credentials protection, phone number verification, and account takeover protection.",
  "Risk": "If advanced security features are not enabled, your user pool is more vulnerable to unauthorized access.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-advanced-security.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To enable advanced security features for an Amazon Cognito User Pool, follow the instructions in the Amazon Cognito documentation.",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-advanced-security.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
