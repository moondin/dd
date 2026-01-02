---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 255
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 255 of 867)

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

---[FILE: metric_filters.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/lib/metric_filters.py

```python
import re

from prowler.lib.check.models import Check_Report_AWS


def check_cloudwatch_log_metric_filter(
    metric_filter_pattern: str,
    trails: list,
    metric_filters: list,
    metric_alarms: list,
    metadata: dict,
):
    report = None
    # 1. Iterate for CloudWatch Log Group in CloudTrail trails
    log_groups = []
    if trails is not None and metric_filters is not None and metric_alarms is not None:
        for trail in trails.values():
            if trail.log_group_arn:
                log_groups.append(trail.log_group_arn.split(":")[6])
        # 2. Describe metric filters for previous log groups
        for metric_filter in metric_filters:
            if metric_filter.log_group.name in log_groups and re.search(
                metric_filter_pattern, metric_filter.pattern, flags=re.DOTALL
            ):
                report = Check_Report_AWS(
                    metadata=metadata, resource=metric_filter.log_group
                )
                report.status = "FAIL"
                report.status_extended = f"CloudWatch log group {metric_filter.log_group.name} found with metric filter {metric_filter.name} but no alarms associated."
                # 3. Check if there is an alarm for the metric
                for alarm in metric_alarms:
                    if alarm.metric == metric_filter.metric:
                        report.status = "PASS"
                        report.status_extended = f"CloudWatch log group {metric_filter.log_group.name} found with metric filter {metric_filter.name} and alarms set."
                        break
                if report.status == "PASS":
                    break

    return report
```

--------------------------------------------------------------------------------

---[FILE: codeartifact_client.py]---
Location: prowler-master/prowler/providers/aws/services/codeartifact/codeartifact_client.py

```python
from prowler.providers.aws.services.codeartifact.codeartifact_service import (
    CodeArtifact,
)
from prowler.providers.common.provider import Provider

codeartifact_client = CodeArtifact(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: codeartifact_service.py]---
Location: prowler-master/prowler/providers/aws/services/codeartifact/codeartifact_service.py
Signals: Pydantic

```python
from enum import Enum
from typing import Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class CodeArtifact(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        # repositories is a dictionary containing all the codeartifact service information
        self.repositories = {}
        self.__threading_call__(self._list_repositories)
        self.__threading_call__(self._list_packages)
        self._list_tags_for_resource()

    def _list_repositories(self, regional_client):
        logger.info("CodeArtifact - Listing Repositories...")
        try:
            list_repositories_paginator = regional_client.get_paginator(
                "list_repositories"
            )
            for page in list_repositories_paginator.paginate():
                for repository in page["repositories"]:
                    if not self.audit_resources or (
                        is_resource_filtered(repository["arn"], self.audit_resources)
                    ):
                        package_name = repository["name"]
                        package_domain_name = repository["domainName"]
                        package_domain_owner = repository["domainOwner"]
                        package_arn = repository["arn"]
                        # Save Repository
                        # We must use the Package ARN as the dict key to have unique keys
                        self.repositories[package_arn] = Repository(
                            name=package_name,
                            arn=package_arn,
                            domain_name=package_domain_name,
                            domain_owner=package_domain_owner,
                            region=regional_client.region,
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _list_packages(self, regional_client):
        logger.info("CodeArtifact - Listing Packages and retrieving information...")
        for repository in self.repositories:
            try:
                if self.repositories[repository].region == regional_client.region:
                    list_packages_paginator = regional_client.get_paginator(
                        "list_packages"
                    )
                    list_packages_parameters = {
                        "domain": self.repositories[repository].domain_name,
                        "domainOwner": self.repositories[repository].domain_owner,
                        "repository": self.repositories[repository].name,
                    }
                    packages = []
                    for page in list_packages_paginator.paginate(
                        **list_packages_parameters
                    ):
                        for package in page["packages"]:
                            # Package information
                            package_format = package["format"]
                            package_namespace = package.get("namespace")
                            package_name = package["package"]
                            package_origin_configuration_restrictions_publish = package[
                                "originConfiguration"
                            ]["restrictions"]["publish"]
                            package_origin_configuration_restrictions_upstream = (
                                package["originConfiguration"]["restrictions"][
                                    "upstream"
                                ]
                            )
                            # Get Latest Package Version
                            if package_namespace:
                                latest_version_information = (
                                    regional_client.list_package_versions(
                                        domain=self.repositories[
                                            repository
                                        ].domain_name,
                                        domainOwner=self.repositories[
                                            repository
                                        ].domain_owner,
                                        repository=self.repositories[repository].name,
                                        format=package_format,
                                        namespace=package_namespace,
                                        package=package_name,
                                        sortBy="PUBLISHED_TIME",
                                    )
                                )
                            else:
                                latest_version_information = (
                                    regional_client.list_package_versions(
                                        domain=self.repositories[
                                            repository
                                        ].domain_name,
                                        domainOwner=self.repositories[
                                            repository
                                        ].domain_owner,
                                        repository=self.repositories[repository].name,
                                        format=package_format,
                                        package=package_name,
                                        sortBy="PUBLISHED_TIME",
                                    )
                                )
                            latest_version = ""
                            latest_origin_type = "UNKNOWN"
                            latest_status = "Published"
                            if latest_version_information.get("versions"):
                                latest_version = latest_version_information["versions"][
                                    0
                                ].get("version")
                                latest_origin_type = (
                                    latest_version_information["versions"][0]
                                    .get("origin", {})
                                    .get("originType", "UNKNOWN")
                                )
                                latest_status = latest_version_information["versions"][
                                    0
                                ].get("status", "Published")

                            packages.append(
                                Package(
                                    name=package_name,
                                    namespace=package_namespace,
                                    format=package_format,
                                    origin_configuration=OriginConfiguration(
                                        restrictions=Restrictions(
                                            publish=package_origin_configuration_restrictions_publish,
                                            upstream=package_origin_configuration_restrictions_upstream,
                                        )
                                    ),
                                    latest_version=LatestPackageVersion(
                                        version=latest_version,
                                        status=latest_status,
                                        origin=OriginInformation(
                                            origin_type=latest_origin_type
                                        ),
                                    ),
                                )
                            )
                    # Save all the packages information
                    self.repositories[repository].packages = packages

            except ClientError as error:
                if error.response["Error"]["Code"] == "ResourceNotFoundException":
                    logger.warning(
                        f"{regional_client.region} --"
                        f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                        f" {error}"
                    )
                    continue

            except Exception as error:
                logger.error(
                    f"{regional_client.region} --"
                    f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                    f" {error}"
                )

    def _list_tags_for_resource(self):
        logger.info("CodeArtifact - List Tags...")
        try:
            for repository in self.repositories.values():
                regional_client = self.regional_clients[repository.region]
                response = regional_client.list_tags_for_resource(
                    resourceArn=repository.arn
                )["tags"]
                repository.tags = response
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class RestrictionValues(Enum):
    """Possible values for the package origin restriction"""

    ALLOW = "ALLOW"
    BLOCK = "BLOCK"


class Restrictions(BaseModel):
    """Information about the upstream and publish package origin restrictions"""

    publish: RestrictionValues
    upstream: RestrictionValues


class OriginConfiguration(BaseModel):
    """Details about the package origin configuration of a package"""

    restrictions: Restrictions


class OriginInformationValues(Enum):
    """Possible values for the OriginInformation"""

    INTERNAL = "INTERNAL"
    EXTERNAL = "EXTERNAL"
    UNKNOWN = "UNKNOWN"


class OriginInformation(BaseModel):
    """
    Describes how the package version was originally added to the domain.

    An INTERNAL origin type means the package version was published directly to a repository in the domain.

    An EXTERNAL origin type means the package version was ingested from an external connection.
    """

    origin_type: OriginInformationValues


class LatestPackageVersionStatus(Enum):
    """Possible values for the package status"""

    Published = "Published"
    Unfinished = "Unfinished"
    Unlisted = "Unlisted"
    Archived = "Archived"
    Disposed = "Disposed"
    Deleted = "Deleted"


class LatestPackageVersion(BaseModel):
    """Details of the latest package version"""

    version: str
    status: LatestPackageVersionStatus
    origin: OriginInformation


class Package(BaseModel):
    """Details of a package"""

    name: str
    namespace: Optional[str] = None
    format: str
    origin_configuration: OriginConfiguration
    latest_version: LatestPackageVersion


class Repository(BaseModel):
    """Information about a Repository"""

    name: str
    arn: str
    domain_name: str
    domain_owner: str
    packages: list[Package] = []
    region: str
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: codeartifact_packages_external_public_publishing_disabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/codeartifact/codeartifact_packages_external_public_publishing_disabled/codeartifact_packages_external_public_publishing_disabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "codeartifact_packages_external_public_publishing_disabled",
  "CheckTitle": "Internal CodeArtifact package does not allow publishing versions already present in external public sources",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "TTPs/Initial Access"
  ],
  "ServiceName": "codeartifact",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Other",
  "Description": "**AWS CodeArtifact packages** with an **internal or unknown origin** are evaluated for their **package origin controls**. The check identifies packages where the `upstream` setting allows ingesting versions from external or upstream repositories.",
  "Risk": "Allowing upstream on internal packages enables **dependency confusion**: public repos can supply higher versions to builds, leading to malicious code execution and package tampering. This threatens **integrity**, exposes secrets and data (**confidentiality**), and may disrupt pipelines and services (**availability**).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://noise.getoto.net/2022/07/15/tighten-your-package-security-with-codeartifact-package-origin-control-toolkit/",
    "https://docs.aws.amazon.com/codeartifact/latest/ug/package-origin-controls.html",
    "https://newstar.cloud/blog/improve-the-security-of-your-software-supply-chain-with-amazon-codeartifact-package-group-configuration/",
    "https://zego.engineering/dependency-confusion-in-aws-codeartifact-86b9ff68963d"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws codeartifact put-package-origin-configuration --domain <DOMAIN> --repository <REPOSITORY> --format <FORMAT> --package <PACKAGE_NAME> --restrictions publish=ALLOW,upstream=BLOCK",
      "NativeIaC": "",
      "Other": "1. In the AWS Console, go to CodeArtifact > Repositories and select <REPOSITORY>\n2. In Packages, open the internal package <PACKAGE_NAME>\n3. Under Origin controls, choose Edit\n4. Set Upstream to Block (leave Publish as Allow if required)\n5. Save",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforce **Package Origin Controls** so internal packages use `upstream=BLOCK` and only trusted publish paths. Apply **least privilege** with package groups and private namespaces, pin versions, and prefer private endpoints. Add artifact signing and CI isolation, and monitor package events for unexpected source changes.",
      "Url": "https://hub.prowler.com/check/codeartifact_packages_external_public_publishing_disabled"
    }
  },
  "Categories": [
    "software-supply-chain"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: codeartifact_packages_external_public_publishing_disabled.py]---
Location: prowler-master/prowler/providers/aws/services/codeartifact/codeartifact_packages_external_public_publishing_disabled/codeartifact_packages_external_public_publishing_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.codeartifact.codeartifact_client import (
    codeartifact_client,
)
from prowler.providers.aws.services.codeartifact.codeartifact_service import (
    OriginInformationValues,
    RestrictionValues,
)


class codeartifact_packages_external_public_publishing_disabled(Check):
    def execute(self):
        findings = []
        for repository in codeartifact_client.repositories.values():
            for package in repository.packages:
                report = Check_Report_AWS(metadata=self.metadata(), resource=repository)
                report.resource_id = f"{repository.domain_name}/{package.name}"
                report.resource_arn = f"{repository.arn}/{package.namespace + ':' if package.namespace else ''}{package.name}"

                if package.latest_version.origin.origin_type in (
                    OriginInformationValues.INTERNAL,
                    OriginInformationValues.UNKNOWN,
                ):
                    if (
                        package.origin_configuration.restrictions.upstream
                        == RestrictionValues.ALLOW
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"Internal package {package.name} is vulnerable to dependency confusion in repository {repository.domain_name}."
                    else:
                        report.status = "PASS"
                        report.status_extended = f"Internal package {package.name} is not vulnerable to dependency confusion in repository {repository.domain_name}."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: codeartifact_packages_external_public_publishing_disabled_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/codeartifact/codeartifact_packages_external_public_publishing_disabled/codeartifact_packages_external_public_publishing_disabled_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.codeartifact.codeartifact_client import (
    codeartifact_client,
)


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the CodeArtifact package's configuration to restrict public access.
    Specifically, this fixer changes the package's configuration to block public access by
    setting restrictions on the "publish" and "upstream" actions.
    Requires the codeartifact:PutPackageOriginConfiguration permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "codeartifact:PutPackageOriginConfiguration",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The CodeArtifact package name in the format "domain_name/package_name".
        region (str): AWS region where the CodeArtifact package exists.
    Returns:
        bool: True if the operation is successful (configuration updated), False otherwise.
    """
    try:
        domain_name, package_name = resource_id.split("/")

        regional_client = codeartifact_client.regional_clients[region]

        for repository in codeartifact_client.repositories.values():
            if repository.domain_name == domain_name:
                for package in repository.packages:
                    if package.name == package_name:
                        publish_value = (
                            package.origin_configuration.restrictions.publish.value
                        )
                        regional_client.put_package_origin_configuration(
                            domain=domain_name,
                            repository=repository.name,
                            format=package.format,
                            package=package_name,
                            restrictions={
                                "publish": publish_value,
                                "upstream": "BLOCK",
                            },
                        )

    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: codebuild_client.py]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_client.py

```python
from prowler.providers.aws.services.codebuild.codebuild_service import Codebuild
from prowler.providers.common.provider import Provider

codebuild_client = Codebuild(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: codebuild_service.py]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_service.py
Signals: Pydantic

```python
import datetime
from typing import List, Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Codebuild(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.projects = {}
        self.__threading_call__(self._list_projects)
        self.__threading_call__(self._list_builds_for_project, self.projects.values())
        self.__threading_call__(self._batch_get_builds, self.projects.values())
        self.__threading_call__(self._batch_get_projects, self.projects.values())
        self.report_groups = {}
        self.__threading_call__(self._list_report_groups)
        self.__threading_call__(
            self._batch_get_report_groups, self.report_groups.values()
        )

    def _list_projects(self, regional_client):
        logger.info("Codebuild - Listing projects...")
        try:
            list_projects_paginator = regional_client.get_paginator("list_projects")
            for page in list_projects_paginator.paginate():
                for project in page["projects"]:
                    project_arn = f"arn:{self.audited_partition}:codebuild:{regional_client.region}:{self.audited_account}:project/{project}"
                    if not self.audit_resources or (
                        is_resource_filtered(project_arn, self.audit_resources)
                    ):
                        self.projects[project_arn] = Project(
                            name=project,
                            arn=project_arn,
                            region=regional_client.region,
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_builds_for_project(self, project):
        logger.info("Codebuild - Listing builds...")
        try:
            regional_client = self.regional_clients[project.region]
            build_ids = regional_client.list_builds_for_project(
                projectName=project.name
            ).get("ids", [])
            if len(build_ids) > 0:
                project.last_build = Build(id=build_ids[0])
        except Exception as error:
            logger.error(
                f"{project.region}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _batch_get_builds(self, project):
        logger.info("Codebuild - Getting builds...")
        try:
            if project.last_build and project.last_build.id:
                regional_client = self.regional_clients[project.region]
                builds_by_id = regional_client.batch_get_builds(
                    ids=[project.last_build.id]
                ).get("builds", [])
                if len(builds_by_id) > 0:
                    project.last_invoked_time = builds_by_id[0].get("endTime")
        except Exception as error:
            logger.error(
                f"{regional_client.region}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _batch_get_projects(self, project):
        logger.info("Codebuild - Getting projects...")
        try:
            regional_client = self.regional_clients[project.region]
            project_info = regional_client.batch_get_projects(names=[project.name])[
                "projects"
            ][0]
            project.buildspec = project_info["source"].get("buildspec")
            if project_info["source"]["type"] != "NO_SOURCE":
                project.source = Source(
                    type=project_info["source"]["type"],
                    location=project_info["source"].get("location", ""),
                )
            project.secondary_sources = []
            for secondary_source in project_info.get("secondarySources", []):
                source_obj = Source(
                    type=secondary_source["type"],
                    location=secondary_source.get("location", ""),
                )
                project.secondary_sources.append(source_obj)
            environment = project_info.get("environment", {})
            env_vars = environment.get("environmentVariables", [])
            project.environment_variables = [
                EnvironmentVariable(**var) for var in env_vars
            ]
            project.buildspec = project_info.get("source", {}).get("buildspec", "")
            s3_logs = project_info.get("logsConfig", {}).get("s3Logs", {})
            project.s3_logs = s3Logs(
                enabled=(
                    True if s3_logs.get("status", "DISABLED") == "ENABLED" else False
                ),
                bucket_location=s3_logs.get("location", ""),
                encrypted=(not s3_logs.get("encryptionDisabled", False)),
            )
            cloudwatch_logs = project_info.get("logsConfig", {}).get(
                "cloudWatchLogs", {}
            )
            project.cloudwatch_logs = CloudWatchLogs(
                enabled=(
                    True
                    if cloudwatch_logs.get("status", "DISABLED") == "ENABLED"
                    else False
                ),
                group_name=cloudwatch_logs.get("groupName", ""),
                stream_name=cloudwatch_logs.get("streamName", ""),
            )
            project.tags = project_info.get("tags", [])
            project.service_role_arn = project_info.get("serviceRole", "")
            project.project_visibility = project_info.get("projectVisibility", "")
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_report_groups(self, regional_client):
        logger.info("Codebuild - Listing report groups...")
        try:
            list_report_groups_paginator = regional_client.get_paginator(
                "list_report_groups"
            )
            for page in list_report_groups_paginator.paginate():
                for report_group_arn in page["reportGroups"]:
                    if not self.audit_resources or (
                        is_resource_filtered(report_group_arn, self.audit_resources)
                    ):
                        self.report_groups[report_group_arn] = ReportGroup(
                            arn=report_group_arn,
                            name=report_group_arn.split(":")[-1].split("/")[-1],
                            region=regional_client.region,
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _batch_get_report_groups(self, report_group):
        logger.info("Codebuild - Getting report groups...")
        try:
            report_group_info = self.regional_clients[
                report_group.region
            ].batch_get_report_groups(reportGroupArns=[report_group.arn])[
                "reportGroups"
            ][
                0
            ]

            report_group.status = report_group_info.get("status", "DELETING")

            export_config = report_group_info.get("exportConfig", {})
            if export_config:
                s3_destination = export_config.get("s3Destination", {})
                report_group.export_config = ExportConfig(
                    type=export_config.get("exportConfigType", "NO_EXPORT"),
                    bucket_location=(
                        f"s3://{s3_destination.get('bucket', '')}/{s3_destination.get('path', '')}"
                        if s3_destination.get("bucket", "")
                        else ""
                    ),
                    encryption_key=s3_destination.get("encryptionKey", ""),
                    encrypted=(not s3_destination.get("encryptionDisabled", True)),
                )

            report_group.tags = report_group_info.get("tags", [])
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Build(BaseModel):
    id: str


class Source(BaseModel):
    type: str
    location: str


class EnvironmentVariable(BaseModel):
    name: str
    value: str
    type: str


class s3Logs(BaseModel):
    enabled: bool
    bucket_location: str
    encrypted: bool


class CloudWatchLogs(BaseModel):
    enabled: bool
    group_name: str
    stream_name: str


class Project(BaseModel):
    name: str
    arn: str
    region: str
    last_build: Optional[Build] = None
    last_invoked_time: Optional[datetime.datetime] = None
    buildspec: Optional[str] = None
    source: Optional[Source] = None
    secondary_sources: Optional[list[Source]] = []
    service_role_arn: Optional[str] = None
    environment_variables: Optional[List[EnvironmentVariable]]
    s3_logs: Optional[s3Logs]
    cloudwatch_logs: Optional[CloudWatchLogs]
    tags: Optional[list]
    project_visibility: Optional[str] = None


class ExportConfig(BaseModel):
    type: str
    bucket_location: str
    encryption_key: str
    encrypted: bool


class ReportGroup(BaseModel):
    arn: str
    name: str
    region: str
    status: Optional[str] = None
    export_config: Optional[ExportConfig] = None
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_logging_enabled/codebuild_project_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "codebuild_project_logging_enabled",
  "CheckTitle": "CodeBuild project has CloudWatch Logs or S3 logging enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "codebuild",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCodeBuildProject",
  "Description": "**CodeBuild projects** are assessed for **logging configuration** to Amazon **CloudWatch Logs** or **S3**, identifying when at least one destination is `enabled` for build logs and events.",
  "Risk": "Absence of **build logging** creates blind spots for **integrity** and **accountability**. Attackers or misconfigurations can alter artifacts, exfiltrate data, or misuse credentials with little trace, hindering **forensics** and **incident response**. Missing telemetry impedes correlation with other alerts, risking source code and secret **confidentiality**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/codebuild/latest/userguide/change-project.html#change-project-console-logs",
    "https://codefresh.io/learn/devops-tools/aws-codebuild-the-basics-and-a-quick-tutorial/",
    "https://asecure.cloud/a/cfgrule_codebuild-project-logging-enabled/",
    "https://support.icompaas.com/support/solutions/articles/62000233680-ensure-that-codebuild-projects-have-s3-or-cloudwatch-logging-enabled",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/codebuild-controls.html#codebuild-4"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws codebuild update-project --name <project-name> --logs-config \"cloudWatchLogs={status=ENABLED}\"",
      "NativeIaC": "```yaml\n# CloudFormation: Enable logging on a CodeBuild project\nResources:\n  <example_resource_name>:\n    Type: AWS::CodeBuild::Project\n    Properties:\n      Name: <example_resource_name>\n      ServiceRole: <example_resource_id>\n      Artifacts:\n        Type: NO_ARTIFACTS\n      Environment:\n        Type: LINUX_CONTAINER\n        ComputeType: BUILD_GENERAL1_SMALL\n        Image: aws/codebuild/standard:5.0\n      Source:\n        Type: NO_SOURCE\n      LogsConfig:\n        CloudWatchLogs:\n          Status: ENABLED  # Critical: Enables CloudWatch logging to pass the check\n```",
      "Other": "1. In the AWS Console, go to CodeBuild > Build projects and open your project\n2. Under Logs, click Edit\n3. Check CloudWatch logs and save (or enable S3 logs instead)\n4. Confirm the project now shows logging enabled",
      "Terraform": "```hcl\n# Terraform: Enable logging on a CodeBuild project\nresource \"aws_codebuild_project\" \"<example_resource_name>\" {\n  name         = \"<example_resource_name>\"\n  service_role = \"<example_resource_id>\"\n\n  artifacts { type = \"NO_ARTIFACTS\" }\n\n  environment {\n    compute_type = \"BUILD_GENERAL1_SMALL\"\n    image        = \"aws/codebuild/standard:5.0\"\n    type         = \"LINUX_CONTAINER\"\n  }\n\n  source { type = \"NO_SOURCE\" }\n\n  logs_config {\n    cloudwatch_logs {\n      status = \"ENABLED\"  # Critical: Enables CloudWatch logging to pass the check\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable a log destination for every project-**CloudWatch Logs** or **S3** (preferably both). Enforce **defense in depth**: encrypt logs, set retention, and restrict access on a least-privilege basis. Centralize and monitor logs, alert on anomalies, and avoid sensitive data in output. Use immutable retention to preserve **auditability**.",
      "Url": "https://hub.prowler.com/check/codebuild_project_logging_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_logging_enabled/codebuild_project_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.codebuild.codebuild_client import codebuild_client


class codebuild_project_logging_enabled(Check):
    def execute(self):
        findings = []
        for project in codebuild_client.projects.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=project)
            report.status = "PASS"

            cw_logs_enabled = (
                project.cloudwatch_logs and project.cloudwatch_logs.enabled
            )
            s3_logs_enabled = project.s3_logs and project.s3_logs.enabled

            if cw_logs_enabled and s3_logs_enabled:
                report.status_extended = f"CodeBuild project {project.name} has enabled CloudWatch logs in log group {project.cloudwatch_logs.group_name} and S3 logs in bucket {project.s3_logs.bucket_location}."
            elif cw_logs_enabled:
                report.status_extended = f"CodeBuild project {project.name} has CloudWatch logging enabled in log group {project.cloudwatch_logs.group_name}."
            elif s3_logs_enabled:
                report.status_extended = f"CodeBuild project {project.name} has S3 logging enabled in bucket {project.s3_logs.bucket_location}."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"CodeBuild project {project.name} does not have logging enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_not_publicly_accessible/codebuild_project_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "codebuild_project_not_publicly_accessible",
  "CheckTitle": "CodeBuild project visibility is private",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "codebuild",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsCodeBuildProject",
  "Description": "**AWS CodeBuild project visibility** is assessed to identify projects exposed to the public. Projects with `project_visibility` set to `PUBLIC_READ` (or not `PRIVATE`) allow anyone to access build results, logs, and artifacts.",
  "Risk": "Public visibility degrades CIA:\n- Logs may leak secrets, tokens, and source details\n- Artifacts are downloadable, enabling tampering and supply-chain malware\n- Adversaries gain CI/CD insights for reconnaissance and lateral movement",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/codebuild/latest/userguide/public-builds.html",
    "https://docs.aws.amazon.com/cli/latest/reference/codebuild/update-project-visibility.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws codebuild update-project-visibility --project-arn <PROJECT_ARN> --project-visibility PRIVATE",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::CodeBuild::Project\n    Properties:\n      Name: <example_resource_name>\n      ServiceRole: <example_role_arn>\n      Artifacts:\n        Type: NO_ARTIFACTS\n      Environment:\n        Type: LINUX_CONTAINER\n        Image: aws/codebuild/standard:5.0\n        ComputeType: BUILD_GENERAL1_SMALL\n      Source:\n        Type: NO_SOURCE\n      Visibility: PRIVATE  # Critical: makes the project private so builds aren't publicly accessible\n```",
      "Other": "1. Open the AWS Console and go to CodeBuild\n2. Select your build project\n3. Click Edit\n4. Set Project visibility to Private\n5. Save changes",
      "Terraform": "```hcl\nresource \"aws_codebuild_project\" \"<example_resource_name>\" {\n  name         = \"<example_resource_name>\"\n  service_role = \"<example_role_arn>\"\n\n  artifacts { type = \"NO_ARTIFACTS\" }\n\n  environment {\n    compute_type = \"BUILD_GENERAL1_SMALL\"\n    image        = \"aws/codebuild/standard:5.0\"\n    type         = \"LINUX_CONTAINER\"\n  }\n\n  source { type = \"NO_SOURCE\" }\n\n  project_visibility = \"PRIVATE\" # Critical: ensures the project is not publicly accessible\n}\n```"
    },
    "Recommendation": {
      "Text": "Set visibility to `PRIVATE` and share only with trusted principals using narrowly scoped policies. Apply **least privilege** to logs and artifacts, keeping them private. Manage secrets via **Secrets Manager** or **Parameter Store**, avoid printing them, and validate artifacts (e.g., checksums).",
      "Url": "https://hub.prowler.com/check/codebuild_project_not_publicly_accessible"
    }
  },
  "Categories": [
    "internet-exposed",
    "ci-cd"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
