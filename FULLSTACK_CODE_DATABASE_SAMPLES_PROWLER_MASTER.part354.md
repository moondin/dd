---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 354
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 354 of 867)

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

---[FILE: models.py]---
Location: prowler-master/prowler/providers/gcp/models.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.config.config import output_file_timestamp
from prowler.providers.common.models import ProviderOutputOptions


class GCPIdentityInfo(BaseModel):
    profile: str


class GCPOrganization(BaseModel):
    id: str
    name: str
    # TODO: the name needs to be retrieved from another API
    display_name: Optional[str] = None


class GCPProject(BaseModel):
    number: int
    id: str
    name: str
    organization: Optional[GCPOrganization] = None
    labels: dict
    lifecycle_state: str


class GCPOutputOptions(ProviderOutputOptions):
    def __init__(self, arguments, bulk_checks_metadata, identity):
        # First call ProviderOutputOptions init
        super().__init__(arguments, bulk_checks_metadata)

        # Check if custom output filename was input, if not, set the default
        if (
            not hasattr(arguments, "output_filename")
            or arguments.output_filename is None
        ):
            self.output_filename = (
                f"prowler-output-{identity.profile}-{output_file_timestamp}"
            )
        else:
            self.output_filename = arguments.output_filename
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: prowler-master/prowler/providers/gcp/exceptions/exceptions.py

```python
from prowler.exceptions.exceptions import ProwlerException


# Exceptions codes from 3000 to 3999 are reserved for GCP exceptions
class GCPBaseException(ProwlerException):
    """Base class for GCP Errors."""

    GCP_ERROR_CODES = {
        (3002, "GCPNoAccesibleProjectsError"): {
            "message": "No Project IDs are active or can be accessed via Google Credentials",
            "remediation": "Ensure the project is active and accessible.",
        },
        (3003, "GCPSetUpSessionError"): {
            "message": "Error setting up session",
            "remediation": "Check the session setup and ensure it is properly set up.",
        },
        (3005, "GCPTestConnectionError"): {
            "message": "Error testing connection to GCP",
            "remediation": "Check the connection and ensure it is properly set up.",
        },
        (3006, "GCPLoadADCFromDictError"): {
            "message": "Error loading Application Default Credentials from dictionary",
            "remediation": "Check the dictionary and ensure a valid Application Default Credentials are present with client_id, client_secret and refresh_token keys.",
        },
        (3007, "GCPStaticCredentialsError"): {
            "message": "Error loading static credentials",
            "remediation": "Check the credentials and ensure they are properly set up. client_id, client_secret and refresh_token are required.",
        },
        (3008, "GCPInvalidProviderIdError"): {
            "message": "Provider does not match with the expected project_id",
            "remediation": "Check the provider and ensure it matches the expected project_id.",
        },
        (3010, "GCPLoadServiceAccountKeyFromDictError"): {
            "message": "Error loading Service Account Private Key credentials from dictionary",
            "remediation": "Check the dictionary and ensure it contains a Service Account Private Key.",
        },
    }

    def __init__(self, code, file=None, original_exception=None, message=None):
        provider = "GCP"
        error_info = self.GCP_ERROR_CODES.get((code, self.__class__.__name__))
        if message:
            error_info["message"] = message
        super().__init__(
            code=code,
            source=provider,
            file=file,
            original_exception=original_exception,
            error_info=error_info,
        )


class GCPCredentialsError(GCPBaseException):
    """Base class for GCP credentials errors."""

    def __init__(self, code, file=None, original_exception=None, message=None):
        super().__init__(code, file, original_exception, message)


class GCPNoAccesibleProjectsError(GCPCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            3002, file=file, original_exception=original_exception, message=message
        )


class GCPSetUpSessionError(GCPCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            3003, file=file, original_exception=original_exception, message=message
        )


class GCPTestConnectionError(GCPBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            3005, file=file, original_exception=original_exception, message=message
        )


class GCPLoadADCFromDictError(GCPCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            3006, file=file, original_exception=original_exception, message=message
        )


class GCPStaticCredentialsError(GCPCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            3007, file=file, original_exception=original_exception, message=message
        )


class GCPInvalidProviderIdError(GCPBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            3008, file=file, original_exception=original_exception, message=message
        )


class GCPLoadServiceAccountKeyFromDictError(GCPCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            3010, file=file, original_exception=original_exception, message=message
        )
```

--------------------------------------------------------------------------------

---[FILE: arguments.py]---
Location: prowler-master/prowler/providers/gcp/lib/arguments/arguments.py

```python
def init_parser(self):
    """Init the GCP Provider CLI parser"""
    gcp_parser = self.subparsers.add_parser(
        "gcp", parents=[self.common_providers_parser], help="GCP Provider"
    )
    # Authentication Modes
    gcp_auth_subparser = gcp_parser.add_argument_group("Authentication Modes")
    gcp_auth_modes_group = gcp_auth_subparser.add_mutually_exclusive_group()
    gcp_auth_modes_group.add_argument(
        "--credentials-file",
        nargs="?",
        metavar="FILE_PATH",
        help="Authenticate using a Google Service Account Application Credentials JSON file",
    )
    gcp_auth_modes_group.add_argument(
        "--impersonate-service-account",
        nargs="?",
        metavar="SERVICE_ACCOUNT",
        help="Impersonate a Google Service Account",
    )
    # Organizations
    gcp_organization_subparser = gcp_parser.add_argument_group("Organization")
    gcp_organization_subparser.add_argument(
        "--organization-id",
        nargs="?",
        metavar="ORGANIZATION_ID",
        help="GCP Organization ID to be scanned by Prowler",
    )
    # Projects
    gcp_projects_subparser = gcp_parser.add_argument_group("Projects")
    gcp_projects_subparser.add_argument(
        "--project-id",
        "--project-ids",
        nargs="+",
        default=[],
        help="GCP Project IDs to be scanned by Prowler",
    )
    gcp_projects_subparser.add_argument(
        "--excluded-project-id",
        "--excluded-project-ids",
        nargs="+",
        default=[],
        help="Excluded GCP Project IDs to be scanned by Prowler",
    )
    gcp_projects_subparser.add_argument(
        "--list-project-id",
        "--list-project-ids",
        action="store_true",
        help="List available project IDs in Google Cloud which can be scanned by Prowler",
    )
    # GCP Config
    gcp_config_subparser = gcp_parser.add_argument_group("GCP Config")
    gcp_config_subparser.add_argument(
        "--gcp-retries-max-attempts",
        nargs="?",
        default=None,
        type=int,
        help="Set the maximum attempts for the Google Cloud SDK retry config (Default: 3)",
    )

    gcp_config_subparser.add_argument(
        "--skip-api-check",
        action="store_true",
        default=False,
        help="Assume all APIs are active and skip the active API check for each service",
    )
```

--------------------------------------------------------------------------------

---[FILE: mutelist.py]---
Location: prowler-master/prowler/providers/gcp/lib/mutelist/mutelist.py

```python
from prowler.lib.check.models import Check_Report_GCP
from prowler.lib.mutelist.mutelist import Mutelist
from prowler.lib.outputs.utils import unroll_dict, unroll_tags


class GCPMutelist(Mutelist):
    def is_finding_muted(
        self,
        finding: Check_Report_GCP,
    ) -> bool:
        return self.is_muted(
            finding.project_id,
            finding.check_metadata.CheckID,
            finding.location,
            finding.resource_name,
            unroll_dict(unroll_tags(finding.resource_tags)),
        )
```

--------------------------------------------------------------------------------

---[FILE: service.py]---
Location: prowler-master/prowler/providers/gcp/lib/service/service.py

```python
import threading

import google_auth_httplib2
import httplib2
from google.oauth2.credentials import Credentials
from googleapiclient import discovery
from googleapiclient.discovery import Resource

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider


class GCPService:
    def __init__(
        self,
        service: str,
        provider: GcpProvider,
        region="global",
        api_version="v1",
    ):
        # We receive the service using __class__.__name__ or the service name in lowercase
        # e.g.: APIKeys --> we need a lowercase string, so service.lower()
        self.service = service.lower() if not service.islower() else service
        self.credentials = provider.session
        self.api_version = api_version
        self.region = region
        self.client = self.__generate_client__(
            self.service, api_version, self.credentials
        )
        # Only project ids that have their API enabled will be scanned
        if provider.skip_api_check:
            self.project_ids = provider.project_ids
        else:
            self.project_ids = self.__is_api_active__(provider.project_ids)
        self.projects = provider.projects
        self.default_project_id = provider.default_project_id
        self.audit_config = provider.audit_config
        self.fixer_config = provider.fixer_config

    def _get_client(self):
        return self.client

    def __threading_call__(self, call, iterator):
        threads = []
        for value in iterator:
            threads.append(threading.Thread(target=call, args=(value,)))
        for t in threads:
            t.start()
        for t in threads:
            t.join()

    def __get_AuthorizedHttp_client__(self):
        return google_auth_httplib2.AuthorizedHttp(
            self.credentials, http=httplib2.Http()
        )

    def __is_api_active__(self, audited_project_ids):
        project_ids = []
        for project_id in audited_project_ids:
            try:
                client = discovery.build(
                    "serviceusage", "v1", credentials=self.credentials
                )
                request = client.services().get(
                    name=f"projects/{project_id}/services/{self.service}.googleapis.com"
                )
                response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                if response.get("state") != "DISABLED":
                    project_ids.append(project_id)
                else:
                    logger.error(
                        f"{self.service} API has not been used in project {project_id} before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/{self.service}.googleapis.com/overview?project={project_id} then retry."
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return project_ids

    def __generate_client__(
        self,
        service: str,
        api_version: str,
        credentials: Credentials,
    ) -> Resource:
        try:
            return discovery.build(
                service,
                api_version,
                credentials=credentials,
                num_retries=DEFAULT_RETRY_ATTEMPTS,
            )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
```

--------------------------------------------------------------------------------

---[FILE: accesscontextmanager_client.py]---
Location: prowler-master/prowler/providers/gcp/services/accesscontextmanager/accesscontextmanager_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.accesscontextmanager.accesscontextmanager_service import (
    AccessContextManager,
)

accesscontextmanager_client = AccessContextManager(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: accesscontextmanager_service.py]---
Location: prowler-master/prowler/providers/gcp/services/accesscontextmanager/accesscontextmanager_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

import prowler.providers.gcp.config as config
from prowler.lib.logger import logger
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService
from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_client import (
    cloudresourcemanager_client,
)


class AccessContextManager(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__("accesscontextmanager", provider, api_version="v1")
        self.service_perimeters = []
        self._get_service_perimeters()

    def _get_service_perimeters(self):
        for org in cloudresourcemanager_client.organizations:
            try:
                access_policies = []
                try:
                    request = self.client.accessPolicies().list(
                        parent=f"organizations/{org.id}"
                    )
                    while request is not None:
                        response = request.execute(
                            num_retries=config.DEFAULT_RETRY_ATTEMPTS
                        )
                        access_policies.extend(response.get("accessPolicies", []))

                        request = self.client.accessPolicies().list_next(
                            previous_request=request, previous_response=response
                        )
                except Exception as error:
                    logger.error(
                        f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                    continue

                for policy in access_policies:
                    try:
                        request = (
                            self.client.accessPolicies()
                            .servicePerimeters()
                            .list(parent=policy["name"])
                        )
                        while request is not None:
                            response = request.execute(
                                num_retries=config.DEFAULT_RETRY_ATTEMPTS
                            )

                            for perimeter in response.get("servicePerimeters", []):
                                status = perimeter.get("status", {})
                                spec = perimeter.get("spec", {})

                                perimeter_config = status if status else spec

                                resources = perimeter_config.get("resources", [])
                                restricted_services = perimeter_config.get(
                                    "restrictedServices", []
                                )

                                self.service_perimeters.append(
                                    ServicePerimeter(
                                        name=perimeter["name"],
                                        title=perimeter.get("title", ""),
                                        perimeter_type=perimeter.get(
                                            "perimeterType", ""
                                        ),
                                        resources=resources,
                                        restricted_services=restricted_services,
                                        policy_name=policy["name"],
                                    )
                                )

                            request = (
                                self.client.accessPolicies()
                                .servicePerimeters()
                                .list_next(
                                    previous_request=request, previous_response=response
                                )
                            )
                    except Exception as error:
                        logger.error(
                            f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )

            except Exception as error:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class ServicePerimeter(BaseModel):
    name: str
    title: str
    perimeter_type: str
    resources: list[str]
    restricted_services: list[str]
    policy_name: str
```

--------------------------------------------------------------------------------

---[FILE: apikeys_client.py]---
Location: prowler-master/prowler/providers/gcp/services/apikeys/apikeys_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.apikeys.apikeys_service import APIKeys

apikeys_client = APIKeys(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: apikeys_service.py]---
Location: prowler-master/prowler/providers/gcp/services/apikeys/apikeys_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class APIKeys(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider, api_version="v2")

        self.keys = []
        self._get_keys()

    def _get_keys(self):
        for project_id in self.project_ids:
            try:
                request = (
                    self.client.projects()
                    .locations()
                    .keys()
                    .list(
                        parent=f"projects/{project_id}/locations/global",
                    )
                )
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for key in response.get("keys", []):
                        self.keys.append(
                            Key(
                                name=key["displayName"],
                                id=key["uid"],
                                creation_time=key["createTime"],
                                restrictions=key.get("restrictions", {}),
                                project_id=project_id,
                            )
                        )

                    request = (
                        self.client.projects()
                        .locations()
                        .keys()
                        .list_next(previous_request=request, previous_response=response)
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class Key(BaseModel):
    name: str
    id: str
    creation_time: str
    restrictions: dict
    project_id: str
```

--------------------------------------------------------------------------------

---[FILE: apikeys_api_restrictions_configured.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/apikeys/apikeys_api_restrictions_configured/apikeys_api_restrictions_configured.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "apikeys_api_restrictions_configured",
  "CheckTitle": "Ensure API Keys Are Restricted to Only APIs That Application Needs Access",
  "CheckType": [],
  "ServiceName": "apikeys",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "API Key",
  "Description": "API Keys should only be used for services in cases where other authentication methods are unavailable. If they are in use it is recommended to rotate API keys every 90 days.",
  "Risk": "Google Cloud Platform (GCP) API keys are simple encrypted strings that don't identify the user or the application that performs the API request. GCP API keys are typically accessible to clients, as they can be viewed publicly from within a browser, making it easy to discover and capture API keys.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudAPI/check-for-api-key-api-restrictions.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that the usage of your Google Cloud API keys is restricted to specific APIs such as Cloud Key Management Service (KMS) API, Cloud Storage API, Cloud Monitoring API and/or Cloud Logging API. All Google Cloud API keys that are being used for production applications should use API restrictions. In order to follow cloud security best practices and reduce the attack surface, Google Cloud API keys should be restricted to call only those APIs required by your application.",
      "Url": "https://cloud.google.com/docs/authentication/api-keys"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: apikeys_api_restrictions_configured.py]---
Location: prowler-master/prowler/providers/gcp/services/apikeys/apikeys_api_restrictions_configured/apikeys_api_restrictions_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.apikeys.apikeys_client import apikeys_client


class apikeys_api_restrictions_configured(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for key in apikeys_client.keys:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=key,
                location=apikeys_client.region,
            )
            report.status = "PASS"
            report.status_extended = f"API key {key.name} has restrictions configured."
            if key.restrictions == {} or any(
                [
                    target.get("service") == "cloudapis.googleapis.com"
                    for target in key.restrictions.get("apiTargets", [])
                ]
            ):
                report.status = "FAIL"
                report.status_extended = (
                    f"API key {key.name} does not have restrictions configured."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apikeys_key_exists.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/apikeys/apikeys_key_exists/apikeys_key_exists.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "apikeys_key_exists",
  "CheckTitle": "Ensure API Keys Only Exist for Active Services",
  "CheckType": [],
  "ServiceName": "apikeys",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "API Key",
  "Description": "API Keys should only be used for services in cases where other authentication methods are unavailable. Unused keys with their permissions in tact may still exist within a project. Keys are insecure because they can be viewed publicly, such as from within a browser, or they can be accessed on a device where the key resides. It is recommended to use standard authentication flow instead.",
  "Risk": "Security risks involved in using API-Keys appear below: API keys are simple encrypted strings, API keys do not identify the user or the application making the API request, API keys are typically accessible to clients, making it easy to discover and steal an API key.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud alpha services api-keys delete",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To avoid the security risk in using API keys, it is recommended to use standard authentication flow instead.",
      "Url": "https://cloud.google.com/docs/authentication/api-keys"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: apikeys_key_exists.py]---
Location: prowler-master/prowler/providers/gcp/services/apikeys/apikeys_key_exists/apikeys_key_exists.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.apikeys.apikeys_client import apikeys_client


class apikeys_key_exists(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for project in apikeys_client.project_ids:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=apikeys_client.projects[project],
                project_id=project,
                location=apikeys_client.region,
            )
            report.status = "PASS"
            report.status_extended = f"Project {project} does not have active API Keys."
            for key in apikeys_client.keys:
                if key.project_id == project:
                    report.status = "FAIL"
                    report.status_extended = f"Project {project} has active API Keys."
                    break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apikeys_key_rotated_in_90_days.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/apikeys/apikeys_key_rotated_in_90_days/apikeys_key_rotated_in_90_days.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "apikeys_key_rotated_in_90_days",
  "CheckTitle": "Ensure API Keys Are Rotated Every 90 Days",
  "CheckType": [],
  "ServiceName": "apikeys",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "API Key",
  "Description": "API Keys should only be used for services in cases where other authentication methods are unavailable. If they are in use it is recommended to rotate API keys every 90 days.",
  "Risk": "Once a Google Cloud API key is compromised, it can be used indefinitely unless the project owner revokes or regenerates that key.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudAPI/rotate-api-keys.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that all your Google Cloud API keys are regularly regenerated (rotated) in order to meet security and compliance requirements. By default, it is recommended to rotate keys every 90 days. Google Cloud Platform (GCP) API keys are simple, encrypted strings that can be used when calling specific APIs that don't need to access private user data. API keys are typically used to track API requests associated with your GCP project for quota and billing. Rotating GCP API keys will substantially reduce the window of opportunity for exploits and ensure that data can't be accessed with an outdated key that might have been lost, cracked, or stolen.",
      "Url": "https://cloud.google.com/docs/authentication/api-keys"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: apikeys_key_rotated_in_90_days.py]---
Location: prowler-master/prowler/providers/gcp/services/apikeys/apikeys_key_rotated_in_90_days/apikeys_key_rotated_in_90_days.py

```python
from datetime import datetime, timezone

from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.apikeys.apikeys_client import apikeys_client


class apikeys_key_rotated_in_90_days(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for key in apikeys_client.keys:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=key,
                location=apikeys_client.region,
            )
            report.status = "PASS"
            report.status_extended = f"API key {key.name} created in less than 90 days."
            if (
                datetime.now(timezone.utc)
                - datetime.strptime(key.creation_time, "%Y-%m-%dT%H:%M:%S.%f%z")
            ).days > 90:
                report.status = "FAIL"
                report.status_extended = (
                    f"API key {key.name} creation date has more than 90 days."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: artifacts_container_analysis_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/artifacts/artifacts_container_analysis_enabled/artifacts_container_analysis_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "artifacts_container_analysis_enabled",
  "CheckTitle": "GCP project has Artifact Registry Container Analysis API enabled",
  "CheckType": [],
  "ServiceName": "artifacts",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "serviceusage.googleapis.com/Service",
  "Description": "Evaluates whether **Artifact Analysis** (`containeranalysis.googleapis.com`) is enabled at the project level to support **vulnerability scanning** and metadata for container images in Artifact Registry or Container Registry.",
  "Risk": "Absent this service, images aren't continuously scanned, leaving known CVEs unnoticed. Attackers can run vulnerable containers, gain code execution, move laterally, and exfiltrate data, eroding the **integrity** and **confidentiality** of workloads and the software supply chain.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://cloud.google.com/artifact-analysis/docs",
    "https://cloud.google.com/artifact-analysis/docs/container-scanning-overview"
  ],
  "Remediation": {
    "Code": {
      "CLI": "gcloud services enable containeranalysis.googleapis.com --project <PROJECT_ID>",
      "NativeIaC": "",
      "Other": "1. In Google Cloud Console, ensure the correct project is selected\n2. Go to APIs & Services > Library\n3. Search for \"Container Analysis API\"\n4. Click the API, then click \"Enable\"",
      "Terraform": "```hcl\nresource \"google_project_service\" \"<example_resource_name>\" {\n  project = \"<example_project_id>\"\n  service = \"containeranalysis.googleapis.com\" # Enables Artifact Analysis (Container Analysis) API to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Artifact Analysis** (`containeranalysis.googleapis.com`) for projects hosting container images. Integrate scan results into CI/CD policy gates, apply **least privilege** to findings access, and rebuild images promptly to maintain **defense in depth**.",
      "Url": "https://hub.prowler.com/check/artifacts_container_analysis_enabled"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, AR Container Analysis is disabled."
}
```

--------------------------------------------------------------------------------

---[FILE: artifacts_container_analysis_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/artifacts/artifacts_container_analysis_enabled/artifacts_container_analysis_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.serviceusage.serviceusage_client import (
    serviceusage_client,
)


class artifacts_container_analysis_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for project_id in serviceusage_client.project_ids:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=serviceusage_client.projects[project_id],
                resource_id="containeranalysis.googleapis.com",
                resource_name="AR Container Analysis",
                project_id=project_id,
                location=serviceusage_client.region,
            )
            report.status = "FAIL"
            report.status_extended = (
                f"AR Container Analysis is not enabled in project {project_id}."
            )
            for active_service in serviceusage_client.active_services.get(
                project_id, []
            ):
                if active_service.name == "containeranalysis.googleapis.com":
                    report.status = "PASS"
                    report.status_extended = (
                        f"AR Container Analysis is enabled in project {project_id}."
                    )
                    break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: bigquery_client.py]---
Location: prowler-master/prowler/providers/gcp/services/bigquery/bigquery_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.bigquery.bigquery_service import BigQuery

bigquery_client = BigQuery(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: bigquery_service.py]---
Location: prowler-master/prowler/providers/gcp/services/bigquery/bigquery_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class BigQuery(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider, api_version="v2")

        self.datasets = []
        self.tables = []
        self._get_datasets()
        self._get_tables()

    def _get_datasets(self):
        for project_id in self.project_ids:
            try:
                request = self.client.datasets().list(projectId=project_id)
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for dataset in response.get("datasets", []):
                        dataset_info = (
                            self.client.datasets()
                            .get(
                                projectId=project_id,
                                datasetId=dataset["datasetReference"]["datasetId"],
                            )
                            .execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                        )
                        cmk_encryption = False
                        public = False
                        roles = dataset_info.get("access", "")
                        if "allAuthenticatedUsers" in str(roles) or "allUsers" in str(
                            roles
                        ):
                            public = True
                        if dataset_info.get("defaultEncryptionConfiguration"):
                            cmk_encryption = True
                        self.datasets.append(
                            Dataset(
                                name=dataset["datasetReference"]["datasetId"],
                                id=dataset["id"],
                                region=dataset["location"],
                                cmk_encryption=cmk_encryption,
                                public=public,
                                project_id=project_id,
                            )
                        )

                    request = self.client.datasets().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_tables(self):
        for dataset in self.datasets:
            try:
                request = self.client.tables().list(
                    projectId=dataset.project_id, datasetId=dataset.name
                )
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for table in response.get("tables", []):
                        cmk_encryption = False
                        if (
                            self.client.tables()
                            .get(
                                projectId=dataset.project_id,
                                datasetId=dataset.name,
                                tableId=table["tableReference"]["tableId"],
                            )
                            .execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                            .get("encryptionConfiguration")
                        ):
                            cmk_encryption = True
                        self.tables.append(
                            Table(
                                name=table["tableReference"]["tableId"],
                                id=table["id"],
                                region=dataset.region,
                                cmk_encryption=cmk_encryption,
                                project_id=dataset.project_id,
                            )
                        )

                    request = self.client.tables().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class Dataset(BaseModel):
    name: str
    id: str
    region: str
    cmk_encryption: bool
    public: bool
    project_id: str


class Table(BaseModel):
    name: str
    id: str
    region: str
    cmk_encryption: bool
    project_id: str
```

--------------------------------------------------------------------------------

````
