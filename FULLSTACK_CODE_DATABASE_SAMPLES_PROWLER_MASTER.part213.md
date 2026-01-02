---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 213
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 213 of 867)

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

---[FILE: exceptions.py]---
Location: prowler-master/prowler/lib/outputs/jira/exceptions/exceptions.py

```python
from prowler.exceptions.exceptions import ProwlerException


# Exceptions codes from 9000 to 9999 are reserved for Jira exceptions
class JiraBaseException(ProwlerException):
    """Base class for Jira exceptions."""

    JIRA_ERROR_CODES = {
        (9000, "JiraNoProjectsError"): {
            "message": "No projects were found in Jira.",
            "remediation": "Please create a project in Jira.",
        },
        (9001, "JiraAuthenticationError"): {
            "message": "Failed to authenticate with Jira.",
            "remediation": "Please check the connection settings and permissions and try again. Needed scopes are: read:jira-user read:jira-work write:jira-work",
        },
        (9002, "JiraTestConnectionError"): {
            "message": "Failed to connect to Jira.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9003, "JiraCreateIssueError"): {
            "message": "Failed to create an issue in Jira.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9004, "JiraGetProjectsError"): {
            "message": "Failed to get projects from Jira.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9005, "JiraGetCloudIDError"): {
            "message": "Failed to get the cloud ID from Jira.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9006, "JiraGetCloudIDNoResourcesError"): {
            "message": "No resources were found in Jira.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9007, "JiraGetCloudIDResponseError"): {
            "message": "Failed to get the cloud ID from Jira.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9008, "JiraRefreshTokenResponseError"): {
            "message": "Failed to refresh the access token, response code did not match 200.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9009, "JiraRefreshTokenError"): {
            "message": "Failed to refresh the access token.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9010, "JiraGetAccessTokenError"): {
            "message": "Failed to get the access token.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9011, "JiraGetAuthResponseError"): {
            "message": "Failed to authenticate with Jira.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9012, "JiraGetProjectsResponseError"): {
            "message": "Failed to get projects from Jira, response code did not match 200.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9013, "JiraSendFindingsResponseError"): {
            "message": "Failed to send findings to Jira, response code did not match 201.",
            "remediation": "Please check the finding format and try again.",
        },
        (9014, "JiraGetAvailableIssueTypesError"): {
            "message": "Failed to get available issue types from Jira.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9015, "JiraGetAvailableIssueTypesResponseError"): {
            "message": "Failed to get available issue types from Jira, response code did not match 200.",
            "remediation": "Please check the connection settings and permissions and try again.",
        },
        (9016, "JiraInvalidIssueTypeError"): {
            "message": "The issue type is invalid.",
            "remediation": "Please check the issue type and try again.",
        },
        (9017, "JiraNoTokenError"): {
            "message": "No token was found.",
            "remediation": "Make sure the token is set when using the Jira integration.",
        },
        (9018, "JiraInvalidProjectKeyError"): {
            "message": "The project key is invalid.",
            "remediation": "Please check the project key and try again.",
        },
        (9019, "JiraBasicAuthError"): {
            "message": "Failed to authenticate with Jira using basic authentication.",
            "remediation": "Please check the user mail and API token and try again.",
        },
        (9020, "JiraInvalidParameterError"): {
            "message": "Missing parameters on Jira Init function.",
            "remediation": "Please check the parameters and try again.",
        },
        (9021, "JiraRequiredCustomFieldsError"): {
            "message": "Jira project requires custom fields that are not supported.",
            "remediation": "Please configure the Jira project to not require custom fields, or use a different project.",
        },
    }

    def __init__(self, code, file=None, original_exception=None, message=None):
        module = "Jira"
        error_info = self.JIRA_ERROR_CODES.get((code, self.__class__.__name__))
        if message:
            error_info["message"] = message
        super().__init__(
            code=code,
            source=module,
            file=file,
            original_exception=original_exception,
            error_info=error_info,
        )


class JiraNoProjectsError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9000, file=file, original_exception=original_exception, message=message
        )


class JiraAuthenticationError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9001, file=file, original_exception=original_exception, message=message
        )


class JiraTestConnectionError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9002, file=file, original_exception=original_exception, message=message
        )


class JiraCreateIssueError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9003, file=file, original_exception=original_exception, message=message
        )


class JiraGetProjectsError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9004, file=file, original_exception=original_exception, message=message
        )


class JiraGetCloudIDError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9005, file=file, original_exception=original_exception, message=message
        )


class JiraGetCloudIDNoResourcesError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9006, file=file, original_exception=original_exception, message=message
        )


class JiraGetCloudIDResponseError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9007, file=file, original_exception=original_exception, message=message
        )


class JiraRefreshTokenResponseError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9008, file=file, original_exception=original_exception, message=message
        )


class JiraRefreshTokenError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9009, file=file, original_exception=original_exception, message=message
        )


class JiraGetAccessTokenError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9010, file=file, original_exception=original_exception, message=message
        )


class JiraGetAuthResponseError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9011, file=file, original_exception=original_exception, message=message
        )


class JiraGetProjectsResponseError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9012, file=file, original_exception=original_exception, message=message
        )


class JiraSendFindingsResponseError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9013, file=file, original_exception=original_exception, message=message
        )


class JiraGetAvailableIssueTypesError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9014, file=file, original_exception=original_exception, message=message
        )


class JiraGetAvailableIssueTypesResponseError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9015, file=file, original_exception=original_exception, message=message
        )


class JiraInvalidIssueTypeError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9016, file=file, original_exception=original_exception, message=message
        )


class JiraNoTokenError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9017, file=file, original_exception=original_exception, message=message
        )


class JiraInvalidProjectKeyError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9018, file=file, original_exception=original_exception, message=message
        )


class JiraBasicAuthError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9019, file=file, original_exception=original_exception, message=message
        )


class JiraInvalidParameterError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9020, file=file, original_exception=original_exception, message=message
        )


class JiraRequiredCustomFieldsError(JiraBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            9021, file=file, original_exception=original_exception, message=message
        )
```

--------------------------------------------------------------------------------

---[FILE: ocsf.py]---
Location: prowler-master/prowler/lib/outputs/ocsf/ocsf.py

```python
import os
from datetime import datetime
from typing import List

from py_ocsf_models.events.base_event import SeverityID, StatusID
from py_ocsf_models.events.findings.detection_finding import (
    DetectionFinding,
    DetectionFindingTypeID,
)
from py_ocsf_models.events.findings.finding import ActivityID, FindingInformation
from py_ocsf_models.objects.account import Account, TypeID
from py_ocsf_models.objects.cloud import Cloud
from py_ocsf_models.objects.group import Group
from py_ocsf_models.objects.metadata import Metadata
from py_ocsf_models.objects.organization import Organization
from py_ocsf_models.objects.product import Product
from py_ocsf_models.objects.remediation import Remediation
from py_ocsf_models.objects.resource_details import ResourceDetails

from prowler.lib.logger import logger
from prowler.lib.outputs.finding import Finding
from prowler.lib.outputs.output import Output
from prowler.lib.outputs.utils import unroll_dict_to_list


class OCSF(Output):
    """
    OCSF class that transforms the findings into the OCSF Detection Finding format.

    This class provides methods to transform the findings into the OCSF Detection Finding format and write them to a file.

    Attributes:
        - _data: A list to store the transformed findings.
        - _file_descriptor: A file descriptor to write the findings to a file.

    Methods:
        - transform(findings: List[Finding]) -> None: Transforms the findings into the OCSF Detection Finding format.
        - batch_write_data_to_file() -> None: Writes the findings to a file using the OCSF Detection Finding format using the `Output._file_descriptor`.
        - get_account_type_id_by_provider(provider: str) -> TypeID: Returns the TypeID based on the provider.
        - get_finding_status_id(muted: bool) -> StatusID: Returns the StatusID based on the muted value.

    References:
        - OCSF: https://schema.ocsf.io/classes/detection_finding
        - PY-OCSF-Model: https://github.com/prowler-cloud/py-ocsf-models
    """

    def transform(self, findings: List[Finding]) -> None:
        """Transforms the findings into the OCSF format.

        Args:
            findings (List[Finding]): a list of Finding objects
        """
        try:
            for finding in findings:
                finding_activity = ActivityID.Create
                cloud_account_type = self.get_account_type_id_by_provider(
                    finding.metadata.Provider
                )
                finding_severity = getattr(
                    SeverityID,
                    finding.metadata.Severity.capitalize(),
                    SeverityID.Unknown,
                )
                finding_status = self.get_finding_status_id(finding.muted)

                detection_finding = DetectionFinding(
                    message=finding.status_extended,
                    activity_id=finding_activity.value,
                    activity_name=finding_activity.name,
                    finding_info=FindingInformation(
                        created_time_dt=finding.timestamp,
                        created_time=(
                            int(finding.timestamp.timestamp())
                            if isinstance(finding.timestamp, datetime)
                            else finding.timestamp
                        ),
                        desc=finding.metadata.Description,
                        title=finding.metadata.CheckTitle,
                        uid=finding.uid,
                        name=finding.resource_name,
                        types=finding.metadata.CheckType,
                    ),
                    time_dt=finding.timestamp,
                    time=(
                        int(finding.timestamp.timestamp())
                        if isinstance(finding.timestamp, datetime)
                        else finding.timestamp
                    ),
                    remediation=Remediation(
                        desc=finding.metadata.Remediation.Recommendation.Text,
                        references=list(
                            filter(
                                None,
                                [
                                    finding.metadata.Remediation.Recommendation.Url,
                                ],
                            )
                        ),
                    ),
                    severity_id=finding_severity.value,
                    severity=finding_severity.name,
                    status_id=finding_status.value,
                    status=finding_status.name,
                    status_code=finding.status,
                    status_detail=finding.status_extended,
                    risk_details=finding.metadata.Risk,
                    resources=(
                        [
                            ResourceDetails(
                                labels=unroll_dict_to_list(finding.resource_tags),
                                name=finding.resource_name,
                                uid=finding.resource_uid,
                                group=Group(name=finding.metadata.ServiceName),
                                type=finding.metadata.ResourceType,
                                # TODO: this should be included only if using the Cloud profile
                                cloud_partition=finding.partition,
                                region=finding.region,
                                data={
                                    "details": finding.resource_details,
                                    "metadata": finding.resource_metadata,
                                },
                            )
                        ]
                        if finding.metadata.Provider != "kubernetes"
                        else [
                            ResourceDetails(
                                labels=unroll_dict_to_list(finding.resource_tags),
                                name=finding.resource_name,
                                uid=finding.resource_uid,
                                group=Group(name=finding.metadata.ServiceName),
                                type=finding.metadata.ResourceType,
                                data={
                                    "details": finding.resource_details,
                                    "metadata": finding.resource_metadata,
                                },
                                namespace=finding.region.replace("namespace: ", ""),
                            )
                        ]
                    ),
                    metadata=Metadata(
                        event_code=finding.metadata.CheckID,
                        product=Product(
                            uid="prowler",
                            name="Prowler",
                            vendor_name="Prowler",
                            version=finding.prowler_version,
                        ),
                        profiles=(
                            ["cloud", "datetime"]
                            if finding.metadata.Provider != "kubernetes"
                            else ["container", "datetime"]
                        ),
                        tenant_uid=finding.account_organization_uid,
                    ),
                    type_uid=DetectionFindingTypeID.Create,
                    type_name=f"Detection Finding: {DetectionFindingTypeID.Create.name}",
                    unmapped={
                        "related_url": finding.metadata.RelatedUrl,
                        "categories": finding.metadata.Categories,
                        "depends_on": finding.metadata.DependsOn,
                        "related_to": finding.metadata.RelatedTo,
                        "additional_urls": finding.metadata.AdditionalURLs,
                        "notes": finding.metadata.Notes,
                        "compliance": finding.compliance,
                    },
                )
                if finding.provider != "kubernetes":
                    detection_finding.cloud = Cloud(
                        account=Account(
                            name=finding.account_name,
                            type_id=cloud_account_type.value,
                            type=cloud_account_type.name.replace("_", " "),
                            uid=finding.account_uid,
                            labels=unroll_dict_to_list(finding.account_tags),
                        ),
                        org=Organization(
                            uid=finding.account_organization_uid,
                            name=finding.account_organization_name,
                            # TODO: add the org unit id and name
                        ),
                        provider=finding.provider,
                        region=finding.region,
                    )

                self._data.append(detection_finding)
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def batch_write_data_to_file(self) -> None:
        """Writes the findings to a file using the OCSF format using the `Output._file_descriptor`."""
        try:
            if (
                getattr(self, "_file_descriptor", None)
                and not self._file_descriptor.closed
                and self._data
            ):
                if self._file_descriptor.tell() == 0:
                    self._file_descriptor.write("[")
                for finding in self._data:
                    try:
                        self._file_descriptor.write(
                            finding.json(exclude_none=True, indent=4)
                        )
                        self._file_descriptor.write(",")
                    except Exception as error:
                        logger.error(
                            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                if self.close_file or self._from_cli:
                    if self._file_descriptor.tell() != 1:
                        self._file_descriptor.seek(
                            self._file_descriptor.tell() - 1, os.SEEK_SET
                        )
                    self._file_descriptor.truncate()
                    self._file_descriptor.write("]")
                    self._file_descriptor.close()
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    @staticmethod
    def get_account_type_id_by_provider(provider: str) -> TypeID:
        """
        Returns the TypeID based on the provider.

        Args:
            provider (str): The provider name

        Returns:
            TypeID: The TypeID based on the provider
        """
        type_id = TypeID.Other
        if provider == "aws":
            type_id = TypeID.AWS_Account
        elif provider == "azure":
            type_id = TypeID.Azure_AD_Account
        elif provider == "gcp":
            type_id = TypeID.GCP_Account
        return type_id

    @staticmethod
    def get_finding_status_id(muted: bool) -> StatusID:
        """
        Returns the StatusID based on the muted value.

        Args:
            muted (bool): The muted value

        Returns:
            StatusID: The StatusID based on the muted value
        """
        status_id = StatusID.New
        if muted:
            status_id = StatusID.Suppressed
        return status_id
```

--------------------------------------------------------------------------------

---[FILE: slack.py]---
Location: prowler-master/prowler/lib/outputs/slack/slack.py

```python
import os
from typing import Any

from slack_sdk import WebClient
from slack_sdk.web.base_client import SlackResponse

from prowler.config.config import aws_logo, azure_logo, gcp_logo, square_logo_img
from prowler.lib.logger import logger
from prowler.lib.outputs.slack.exceptions.exceptions import (
    SlackChannelNotFound,
    SlackClientError,
    SlackNoCredentialsError,
)
from prowler.providers.common.models import Connection


class Slack:
    _provider: Any
    _token: str
    _channel: str

    def __init__(self, token: str, channel: str, provider: Any) -> "Slack":
        self._token = token
        self._channel = channel
        self._provider = provider

    @property
    def token(self):
        return self._token

    @property
    def channel(self):
        return self._channel

    def send(self, stats: dict, args: str) -> SlackResponse:
        """
        Sends the findings to Slack.

        Args:
            stats (dict): A dictionary containing audit statistics.
            args (str): Command line arguments used for the audit.

        Returns:
            SlackResponse: Slack response if successful, error object if an exception occurs.
        """
        try:
            client = WebClient(token=self.token)
            identity, logo = self.__create_message_identity__(self._provider)
            response = client.chat_postMessage(
                username="Prowler",
                icon_url=square_logo_img,
                channel=f"#{self.channel}",
                text="Prowler Scan Summary",
                blocks=self.__create_message_blocks__(identity, logo, stats, args),
            )
            return response
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def __create_message_identity__(self, provider: Any):
        """
        Create a Slack message identity based on the provider type.

        Parameters:
        - provider (Provider): The Provider (e.g. "AwsProvider", "GcpProvider", "AzureProvide").

        Returns:
        - identity (str): The message identity based on the provider type.
        - logo (str): The logo URL associated with the provider type.
        """

        # TODO: support kubernetes, m365, github
        try:
            identity = ""
            logo = aws_logo
            if provider.type == "aws":
                identity = f"AWS Account *{provider.identity.account}*"
            elif provider.type == "gcp":
                identity = f"GCP Projects *{', '.join(provider.project_ids)}*"
                logo = gcp_logo
            elif provider.type == "azure":
                printed_subscriptions = []
                for key, value in provider.identity.subscriptions.items():
                    intermediate = f"- *{key}: {value}*\n"
                    printed_subscriptions.append(intermediate)
                identity = f"Azure Subscriptions:\n{''.join(printed_subscriptions)}"
                logo = azure_logo
            return identity, logo
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def __create_message_blocks__(self, identity, logo, stats, args) -> list:
        """
        Create the Slack message blocks.

        Args:
            identity: message identity.
            logo: logo URL.
            stats: audit statistics.
            args: command line arguments used.

        Returns:
            list: list of Slack message blocks.
        """
        try:
            blocks = [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": self.__create_title__(identity, stats),
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": logo,
                        "alt_text": "Provider Logo",
                    },
                },
                {"type": "divider"},
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"\n:white_check_mark: *{stats['total_pass']} Passed findings* ({round(stats['total_pass'] / stats['findings_count'] * 100, 2)}%)\n",
                    },
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": (
                            "*Severities:*\n"
                            f"• *Critical:* {stats['total_critical_severity_pass']} "
                            f"• *High:* {stats['total_high_severity_pass']} "
                            f"• *Medium:* {stats['total_medium_severity_pass']} "
                            f"• *Low:* {stats['total_low_severity_pass']}"
                        ),
                    },
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"\n:x: *{stats['total_fail']} Failed findings* ({round(stats['total_fail'] / stats['findings_count'] * 100, 2)}%)\n ",
                    },
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": (
                            "*Severities:*\n"
                            f"• *Critical:* {stats['total_critical_severity_fail']} "
                            f"• *High:* {stats['total_high_severity_fail']} "
                            f"• *Medium:* {stats['total_medium_severity_fail']} "
                            f"• *Low:* {stats['total_low_severity_fail']}"
                        ),
                    },
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"\n:bar_chart: *{stats['resources_count']} Scanned Resources*\n",
                    },
                },
                {"type": "divider"},
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": f"Used parameters: `prowler {args}`",
                        }
                    ],
                },
                {"type": "divider"},
                {
                    "type": "section",
                    "text": {"type": "mrkdwn", "text": "Join our Slack Community!"},
                    "accessory": {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "Prowler :slack:"},
                        "url": "https://goto.prowler.com/slack",
                    },
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Feel free to contact us in our repo",
                    },
                    "accessory": {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "Prowler :github:"},
                        "url": "https://github.com/prowler-cloud/prowler",
                    },
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "See all the things you can do with ProwlerPro",
                    },
                    "accessory": {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "Prowler Pro"},
                        "url": "https://prowler.pro",
                    },
                },
            ]
            return blocks
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def __create_title__(self, identity, stats) -> str:
        """
        Create the Slack message title.

        Args:
            identity: message identity.
            stats: audit statistics.

        Returns:
            str: Slack message title.
        """
        try:
            title = f"Hey there 👋 \n I'm *Prowler*, _the handy multi-cloud security tool_ :cloud::key:\n\n I have just finished the security assessment on your {identity} with a total of *{stats['findings_count']}* findings."
            return title
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    @staticmethod
    def test_connection(
        token: str,
        channel: str,
        raise_on_exception: bool = True,
    ) -> Connection:
        """
        Test the Slack connection by validating the provided token and channel.

        Args:
            token (str): The Slack token to be tested.
            channel (str): The Slack channel to be validated.

        Returns:
            Connection: A Connection object.
        """
        try:
            client = WebClient(token=token)
            # Test if the token is valid
            auth_response = client.auth_test()
            if auth_response["ok"]:
                # Test if the channel is accessible
                channels_response = client.conversations_info(
                    token=token, channel=channel
                )
                if channels_response["ok"]:
                    return Connection(is_connected=True)
                else:
                    exception = SlackChannelNotFound(
                        file=os.path.basename(__file__),
                        message=(
                            channels_response["error"]
                            if "error" in channels_response
                            else "Unknown error"
                        ),
                    )
                    if raise_on_exception:
                        raise exception
                    return Connection(error=exception)
            else:
                exception = SlackNoCredentialsError(
                    file=os.path.basename(__file__),
                    message=(
                        auth_response["error"]
                        if "error" in auth_response
                        else "Unknown error"
                    ),
                )
                if raise_on_exception:
                    raise exception
                return Connection(error=exception)

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            if raise_on_exception:
                raise SlackClientError(
                    file=os.path.basename(__file__),
                    original_exception=error,
                ) from error
            return Connection(error=error)
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: prowler-master/prowler/lib/outputs/slack/exceptions/exceptions.py

```python
from prowler.exceptions.exceptions import ProwlerException


# Exceptions codes from 8000 to 8999 are reserved for Slack exceptions
class SlackBaseException(ProwlerException):
    """Base class for Slack errors."""

    SLACK_ERROR_CODES = {
        (8000, "SlackClientError"): {
            "message": "Slack ClientError occurred",
            "remediation": "Check your Slack client configuration and permissions.",
        },
        (8001, "SlackNoCredentialsError"): {
            "message": "Invalid Slack credentials found",
            "remediation": "Some aspect of authentication cannot be validated. Either the provided token is invalid or the request originates from an IP address disallowed from making the request.",
        },
        (8002, "SlackChannelNotFound"): {
            "message": "Slack channel not found",
            "remediation": "Check the channel name and ensure it exists.",
        },
    }

    def __init__(self, code, file=None, original_exception=None, message=None):
        error_info = self.SLACK_ERROR_CODES.get((code, self.__class__.__name__))
        if message:
            error_info["message"] = message
        super().__init__(
            code,
            source="Slack",
            file=file,
            original_exception=original_exception,
            error_info=error_info,
        )


class SlackCredentialsError(SlackBaseException):
    """Base class for Slack credentials errors."""

    def __init__(self, code, file=None, original_exception=None, message=None):
        super().__init__(code, file, original_exception, message)


class SlackClientError(SlackCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            8000, file=file, original_exception=original_exception, message=message
        )


class SlackNoCredentialsError(SlackCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            8001, file=file, original_exception=original_exception, message=message
        )


class SlackChannelNotFound(SlackCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            8002, file=file, original_exception=original_exception, message=message
        )
```

--------------------------------------------------------------------------------

````
