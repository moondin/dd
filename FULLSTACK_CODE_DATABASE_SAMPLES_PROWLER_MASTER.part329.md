---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 329
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 329 of 867)

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

---[FILE: config.py]---
Location: prowler-master/prowler/providers/azure/config.py

```python
from uuid import UUID

# Service management API
WINDOWS_AZURE_SERVICE_MANAGEMENT_API = "797f4846-ba00-4fd7-ba43-dac1f8f63013"

# Authorization policy roles
GUEST_USER_ACCESS_NO_RESTRICTICTED = UUID("a0b1b346-4d3e-4e8b-98f8-753987be4970")
GUEST_USER_ACCESS_RESTRICTICTED = UUID("2af84b1e-32c8-42b7-82bc-daa82404023b")

# General administrator built-in roles
CONTRIBUTOR_ROLE_ID = "b24988ac-6180-42a0-ab88-20f7382dd24c"
OWNER_ROLE_ID = "8e3af657-a8ff-443c-a75c-2fe8c4bcb635"
ROLE_BASED_ACCESS_CONTROL_ADMINISTRATOR_ROLE_ID = "f58310d9-a9f6-439a-9e8d-f62e7b41a168"
USER_ACCESS_ADMINISTRATOR_ROLE_ID = "18d7d88d-d35e-4fb5-a5c3-7773c20a72d9"

# Compute admin roles IDs
VIRTUAL_MACHINE_CONTRIBUTOR_ROLE_ID = "9980e02c-c2be-4d73-94e8-173b1dc7cf3c"
VIRTUAL_MACHINE_ADMINISTRATOR_LOGIN_ROLE_ID = "1c0163c0-47e6-4577-8991-ea5c82e286e4"
VIRTUAL_MACHINE_USER_LOGIN_ROLE_ID = "fb879df8-f326-4884-b1cf-06f3ad86be52"
VIRTUAL_MACHINE_LOCAL_USER_LOGIN_ROLE_ID = "602da2ba-a5c2-41da-b01d-5360126ab525"
WINDOWS_ADMIN_CENTER_ADMINISTRATOR_LOGIN_ROLE_ID = (
    "a6333a3e-0164-44c3-b281-7a577aff287f"
)
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/providers/azure/models.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.config.config import output_file_timestamp
from prowler.providers.common.models import ProviderOutputOptions


class AzureIdentityInfo(BaseModel):
    identity_id: str = ""
    identity_type: str = ""
    tenant_ids: list[str] = []
    tenant_domain: str = "Unknown tenant domain (missing AAD permissions)"
    subscriptions: dict = {}
    locations: dict = {}


class AzureRegionConfig(BaseModel):
    name: str = ""
    authority: Optional[str] = None
    base_url: str = ""
    credential_scopes: list = []


class AzureSubscription(BaseModel):
    id: str
    subscription_id: str
    display_name: str
    state: str


class AzureOutputOptions(ProviderOutputOptions):
    def __init__(self, arguments, bulk_checks_metadata, identity):
        # First call Provider_Output_Options init
        super().__init__(arguments, bulk_checks_metadata)

        # Check if custom output filename was input, if not, set the default
        if (
            not hasattr(arguments, "output_filename")
            or arguments.output_filename is None
        ):
            if (
                identity.tenant_domain
                != "Unknown tenant domain (missing AAD permissions)"
            ):
                self.output_filename = (
                    f"prowler-output-{identity.tenant_domain}-{output_file_timestamp}"
                )
            else:
                self.output_filename = f"prowler-output-{'-'.join(identity.tenant_ids)}-{output_file_timestamp}"
        else:
            self.output_filename = arguments.output_filename
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: prowler-master/prowler/providers/azure/exceptions/exceptions.py

```python
from prowler.exceptions.exceptions import ProwlerException


# Exceptions codes from 2000 to 2999 are reserved for Azure exceptions
class AzureBaseException(ProwlerException):
    """Base class for Azure Errors."""

    AZURE_ERROR_CODES = {
        (2000, "AzureEnvironmentVariableError"): {
            "message": "Azure environment variable error",
            "remediation": "Check the Azure environment variables and ensure they are properly set.",
        },
        (2001, "AzureNoSubscriptionsError"): {
            "message": "No Azure subscriptions found",
            "remediation": "Check the Azure subscriptions and ensure they are properly set up.",
        },
        (2002, "AzureSetUpIdentityError"): {
            "message": "Azure identity setup error related with credentials",
            "remediation": "Check credentials and ensure they are properly set up for Azure and the identity provider.",
        },
        (2003, "AzureNoAuthenticationMethodError"): {
            "message": "No Azure authentication method found",
            "remediation": "Check that any authentication method is properly set up for Azure.",
        },
        (2004, "AzureBrowserAuthNoTenantIDError"): {
            "message": "Azure browser authentication error: no tenant ID found",
            "remediation": "To use browser authentication, ensure the tenant ID is properly set.",
        },
        (2005, "AzureTenantIDNoBrowserAuthError"): {
            "message": "Azure tenant ID error: browser authentication not found",
            "remediation": "To use browser authentication, both the tenant ID and browser authentication must be properly set.",
        },
        (2006, "AzureArgumentTypeValidationError"): {
            "message": "Azure argument type validation error",
            "remediation": "Check the provided argument types specific to Azure and ensure they meet the required format.",
        },
        (2007, "AzureSetUpRegionConfigError"): {
            "message": "Azure region configuration setup error",
            "remediation": "Check the Azure region configuration and ensure it is properly set up.",
        },
        (2008, "AzureDefaultAzureCredentialError"): {
            "message": "Error in DefaultAzureCredential",
            "remediation": "Check that all the attributes are properly set up for the DefaultAzureCredential.",
        },
        (2009, "AzureInteractiveBrowserCredentialError"): {
            "message": "Error retrieving InteractiveBrowserCredential",
            "remediation": "Check your browser and ensure that the tenant ID and browser authentication are properly set.",
        },
        (2010, "AzureHTTPResponseError"): {
            "message": "Error in HTTP response from Azure",
            "remediation": "",
        },
        (2011, "AzureCredentialsUnavailableError"): {
            "message": "Error trying to configure Azure credentials because they are unavailable",
            "remediation": "Check the dictionary and ensure it is properly set up for Azure credentials. TENANT_ID, CLIENT_ID and CLIENT_SECRET are required.",
        },
        (2012, "AzureGetTokenIdentityError"): {
            "message": "Error trying to get token from Azure Identity",
            "remediation": "Check the Azure Identity and ensure it is properly set up.",
        },
        (2013, "AzureNotTenantIdButClientIdAndClienSecretError"): {
            "message": "The provided credentials are not a tenant ID but a client ID and client secret",
            "remediation": "Tenant Id, Client Id and Client Secret are required for Azure credentials. Make sure you are using the correct credentials.",
        },
        (2014, "AzureClientAuthenticationError"): {
            "message": "Error in client authentication",
            "remediation": "Check the client authentication and ensure it is properly set up.",
        },
        (2015, "AzureSetUpSessionError"): {
            "message": "Error setting up session",
            "remediation": "Check the session setup and ensure it is properly set up.",
        },
        (2016, "AzureNotValidTenantIdError"): {
            "message": "The provided tenant ID is not valid",
            "remediation": "Check the tenant ID and ensure it is a valid ID.",
        },
        (2017, "AzureNotValidClientIdError"): {
            "message": "The provided client ID is not valid",
            "remediation": "Check the client ID and ensure it is a valid ID.",
        },
        (2018, "AzureNotValidClientSecretError"): {
            "message": "The provided client secret is not valid",
            "remediation": "Check the client secret and ensure it is a valid secret.",
        },
        (2019, "AzureConfigCredentialsError"): {
            "message": "Error in configuration of Azure credentials",
            "remediation": "Check the configuration of Azure credentials and ensure it is properly set up.",
        },
        (2020, "AzureClientIdAndClientSecretNotBelongingToTenantIdError"): {
            "message": "The provided client ID and client secret do not belong to the provided tenant ID",
            "remediation": "Check the client ID and client secret and ensure they belong to the provided tenant ID.",
        },
        (2021, "AzureTenantIdAndClientSecretNotBelongingToClientIdError"): {
            "message": "The provided tenant ID and client secret do not belong to the provided client ID",
            "remediation": "Check the tenant ID and client secret and ensure they belong to the provided client ID.",
        },
        (2022, "AzureTenantIdAndClientIdNotBelongingToClientSecretError"): {
            "message": "The provided tenant ID and client ID do not belong to the provided client secret",
            "remediation": "Check the tenant ID and client ID and ensure they belong to the provided client secret.",
        },
        (2023, "AzureInvalidProviderIdError"): {
            "message": "The provided provider_id does not match with the available subscriptions",
            "remediation": "Check the provider_id and ensure it is a valid subscription for the given credentials.",
        },
    }

    def __init__(self, code, file=None, original_exception=None, message=None):
        provider = "Azure"
        error_info = self.AZURE_ERROR_CODES.get((code, self.__class__.__name__))
        if message:
            error_info["message"] = message
        super().__init__(
            code=code,
            source=provider,
            file=file,
            original_exception=original_exception,
            error_info=error_info,
        )


class AzureCredentialsError(AzureBaseException):
    """Base class for Azure credentials errors."""

    def __init__(self, code, file=None, original_exception=None, message=None):
        super().__init__(code, file, original_exception, message)


class AzureEnvironmentVariableError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2000, file=file, original_exception=original_exception, message=message
        )


class AzureNoSubscriptionsError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2001, file=file, original_exception=original_exception, message=message
        )


class AzureSetUpIdentityError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2002, file=file, original_exception=original_exception, message=message
        )


class AzureNoAuthenticationMethodError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2003, file=file, original_exception=original_exception, message=message
        )


class AzureBrowserAuthNoTenantIDError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2004, file=file, original_exception=original_exception, message=message
        )


class AzureTenantIDNoBrowserAuthError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2005, file=file, original_exception=original_exception, message=message
        )


class AzureArgumentTypeValidationError(AzureBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2006, file=file, original_exception=original_exception, message=message
        )


class AzureSetUpRegionConfigError(AzureBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2007, file=file, original_exception=original_exception, message=message
        )


class AzureDefaultAzureCredentialError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2008, file=file, original_exception=original_exception, message=message
        )


class AzureInteractiveBrowserCredentialError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2009, file=file, original_exception=original_exception, message=message
        )


class AzureHTTPResponseError(AzureBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2010, file=file, original_exception=original_exception, message=message
        )


class AzureCredentialsUnavailableError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2011, file=file, original_exception=original_exception, message=message
        )


class AzureGetTokenIdentityError(AzureBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2012, file=file, original_exception=original_exception, message=message
        )


class AzureNotTenantIdButClientIdAndClienSecretError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2013, file=file, original_exception=original_exception, message=message
        )


class AzureClientAuthenticationError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2014, file=file, original_exception=original_exception, message=message
        )


class AzureSetUpSessionError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2015, file=file, original_exception=original_exception, message=message
        )


class AzureNotValidTenantIdError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2016, file=file, original_exception=original_exception, message=message
        )


class AzureNotValidClientIdError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2017, file=file, original_exception=original_exception, message=message
        )


class AzureNotValidClientSecretError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2018, file=file, original_exception=original_exception, message=message
        )


class AzureConfigCredentialsError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2019, file=file, original_exception=original_exception, message=message
        )


class AzureClientIdAndClientSecretNotBelongingToTenantIdError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2020, file=file, original_exception=original_exception, message=message
        )


class AzureTenantIdAndClientSecretNotBelongingToClientIdError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2021, file=file, original_exception=original_exception, message=message
        )


class AzureTenantIdAndClientIdNotBelongingToClientSecretError(AzureCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2022, file=file, original_exception=original_exception, message=message
        )


class AzureInvalidProviderIdError(AzureBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            2023, file=file, original_exception=original_exception, message=message
        )
```

--------------------------------------------------------------------------------

---[FILE: arguments.py]---
Location: prowler-master/prowler/providers/azure/lib/arguments/arguments.py

```python
from argparse import ArgumentTypeError


def init_parser(self):
    """Init the Azure Provider CLI parser"""
    azure_parser = self.subparsers.add_parser(
        "azure", parents=[self.common_providers_parser], help="Azure Provider"
    )
    # Authentication Modes
    azure_auth_subparser = azure_parser.add_argument_group("Authentication Modes")
    azure_auth_modes_group = azure_auth_subparser.add_mutually_exclusive_group()
    azure_auth_modes_group.add_argument(
        "--az-cli-auth",
        action="store_true",
        help="Use Azure CLI credentials to log in against Azure",
    )
    azure_auth_modes_group.add_argument(
        "--sp-env-auth",
        action="store_true",
        help="Use Service Principal environment variables authentication to log in against Azure",
    )
    azure_auth_modes_group.add_argument(
        "--browser-auth",
        action="store_true",
        help="Use browser authentication to log in against Azure, --tenant-id is required for this option",
    )
    azure_auth_modes_group.add_argument(
        "--managed-identity-auth",
        action="store_true",
        help="Use managed identity authentication to log in against Azure ",
    )
    # Subscriptions
    azure_subscriptions_subparser = azure_parser.add_argument_group("Subscriptions")
    azure_subscriptions_subparser.add_argument(
        "--subscription-id",
        "--subscription-ids",
        nargs="+",
        default=[],
        help="Azure Subscription IDs to be scanned by Prowler",
    )
    azure_parser.add_argument(
        "--tenant-id",
        nargs="?",
        default=None,
        help="Azure Tenant ID to be used with --browser-auth option",
    )
    # Regions
    azure_regions_subparser = azure_parser.add_argument_group("Regions")
    azure_regions_subparser.add_argument(
        "--azure-region",
        nargs="?",
        default="AzureCloud",
        type=validate_azure_region,
        help="Azure region from `az cloud list --output table`, by default AzureCloud",
    )


def validate_azure_region(region):
    """validate_azure_region validates if the region passed as argument is valid"""
    regions_allowed = [
        "AzureChinaCloud",
        "AzureUSGovernment",
        "AzureCloud",
    ]
    if region not in regions_allowed:
        raise ArgumentTypeError(
            f"Region {region} not allowed, allowed regions are {' '.join(regions_allowed)}"
        )
    return region
```

--------------------------------------------------------------------------------

---[FILE: mutelist.py]---
Location: prowler-master/prowler/providers/azure/lib/mutelist/mutelist.py

```python
from prowler.lib.check.models import Check_Report_Azure
from prowler.lib.mutelist.mutelist import Mutelist
from prowler.lib.outputs.utils import unroll_dict, unroll_tags


class AzureMutelist(Mutelist):
    def is_finding_muted(
        self,
        finding: Check_Report_Azure,
        subscription_id: str,
    ) -> bool:
        return self.is_muted(
            subscription_id,  # support Azure Subscription ID in mutelist
            finding.check_metadata.CheckID,
            finding.location,
            finding.resource_name,
            unroll_dict(unroll_tags(finding.resource_tags)),
        ) or self.is_muted(
            finding.subscription,  # support Azure Subscription Name in mutelist
            finding.check_metadata.CheckID,
            finding.location,
            finding.resource_name,
            unroll_dict(unroll_tags(finding.resource_tags)),
        )
```

--------------------------------------------------------------------------------

---[FILE: regions.py]---
Location: prowler-master/prowler/providers/azure/lib/regions/regions.py

```python
from azure.identity import AzureAuthorityHosts

AZURE_CHINA_CLOUD = "https://management.chinacloudapi.cn"
AZURE_US_GOV_CLOUD = "https://management.usgovcloudapi.net"
AZURE_GENERIC_CLOUD = "https://management.azure.com"


def get_regions_config(region):
    allowed_regions = {
        "AzureCloud": {
            "authority": None,
            "base_url": AZURE_GENERIC_CLOUD,
            "credential_scopes": [AZURE_GENERIC_CLOUD + "/.default"],
        },
        "AzureChinaCloud": {
            "authority": AzureAuthorityHosts.AZURE_CHINA,
            "base_url": AZURE_CHINA_CLOUD,
            "credential_scopes": [AZURE_CHINA_CLOUD + "/.default"],
        },
        "AzureUSGovernment": {
            "authority": AzureAuthorityHosts.AZURE_GOVERNMENT,
            "base_url": AZURE_US_GOV_CLOUD,
            "credential_scopes": [AZURE_US_GOV_CLOUD + "/.default"],
        },
    }
    return allowed_regions[region]
```

--------------------------------------------------------------------------------

---[FILE: service.py]---
Location: prowler-master/prowler/providers/azure/lib/service/service.py

```python
from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider


class AzureService:
    def __init__(
        self,
        service: str,
        provider: AzureProvider,
    ):
        self.clients = self.__set_clients__(
            provider.identity,
            provider.session,
            service,
            provider.region_config,
        )

        self.subscriptions = provider.identity.subscriptions
        self.locations = provider.locations
        self.audit_config = provider.audit_config
        self.fixer_config = provider.fixer_config

    def __set_clients__(self, identity, session, service, region_config):
        clients = {}
        try:
            if "GraphServiceClient" in str(service):
                clients.update({identity.tenant_domain: service(credentials=session)})
            elif "LogsQueryClient" in str(service):
                for display_name, id in identity.subscriptions.items():
                    clients.update({display_name: service(credential=session)})
            else:
                for display_name, id in identity.subscriptions.items():
                    clients.update(
                        {
                            display_name: service(
                                credential=session,
                                subscription_id=id,
                                base_url=region_config.base_url,
                                credential_scopes=region_config.credential_scopes,
                            )
                        }
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        else:
            return clients
```

--------------------------------------------------------------------------------

---[FILE: aisearch_client.py]---
Location: prowler-master/prowler/providers/azure/services/aisearch/aisearch_client.py

```python
from prowler.providers.azure.services.aisearch.aisearch_service import AISearch
from prowler.providers.common.provider import Provider

aisearch_client = AISearch(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: aisearch_service.py]---
Location: prowler-master/prowler/providers/azure/services/aisearch/aisearch_service.py
Signals: Pydantic

```python
from azure.mgmt.search import SearchManagementClient
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class AISearch(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(SearchManagementClient, provider)
        self.aisearch_services = self._get_aisearch_services()

    def _get_aisearch_services(self):
        logger.info("AISearch - Getting services ...")
        aisearch_services = {}
        for subscription, client in self.clients.items():
            try:
                aisearch_services.update({subscription: {}})
                aisearch_services_list = client.services.list_by_subscription()
                for aisearch_service in aisearch_services_list:
                    aisearch_services[subscription].update(
                        {
                            aisearch_service.id: AISearchService(
                                id=aisearch_service.id,
                                name=aisearch_service.name,
                                location=aisearch_service.location,
                                public_network_access=(
                                    False
                                    if aisearch_service.public_network_access
                                    == "Disabled"
                                    else True
                                ),
                            )
                        }
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return aisearch_services


class AISearchService(BaseModel):
    id: str
    name: str
    location: str
    public_network_access: bool
```

--------------------------------------------------------------------------------

---[FILE: aisearch_service_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/aisearch/aisearch_service_not_publicly_accessible/aisearch_service_not_publicly_accessible.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "aisearch_service_not_publicly_accessible",
  "CheckTitle": "Restrict public network access to the AI Search Service",
  "CheckType": [],
  "ServiceName": "aisearch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureSearchService",
  "Description": "Ensure that public network access to the Search Service is restricted.",
  "Risk": "Public accessibility exposes the Search Service to potential attacks, unauthorized usage, and data breaches. Restricting access minimizes the surface area for attacks and ensures that only authorized networks can access the search service.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/search/service-configure-firewall#configure-network-access-in-azure-portal",
  "Remediation": {
    "Code": {
      "CLI": "az search service update --resource-group <resource_group_name> --name <service_name> --public-access disabled",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that the necessary virtual network configurations or IP rules are in place to allow access from required services once public access is restricted. Review the network access settings regularly to maintain a secure environment. To restrict public network access to your Search Service: 1. Navigate to your Search Service y in the Azure Portal. 2. Under 'Settings'->'Networking', configure the 'Public network access' settings to 'Disabled'. 3. Set up virtual network service endpoints or private endpoints as needed for secure access. 4. Review and adjust IP access rules as necessary.",
      "Url": "https://learn.microsoft.com/en-us/azure/search/service-configure-firewall#configure-network-access-in-azure-portal"
    }
  },
  "Categories": [
    "gen-ai"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: aisearch_service_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/azure/services/aisearch/aisearch_service_not_publicly_accessible/aisearch_service_not_publicly_accessible.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.aisearch.aisearch_client import aisearch_client


class aisearch_service_not_publicly_accessible(Check):
    def execute(self) -> List[Check_Report_Azure]:
        findings = []

        for (
            subscription_name,
            aisearch_services,
        ) in aisearch_client.aisearch_services.items():
            for aisearch_service in aisearch_services.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=aisearch_service
                )
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = f"AISearch Service {aisearch_service.name} from subscription {subscription_name} allows public access."

                if not aisearch_service.public_network_access:
                    report.status = "PASS"
                    report.status_extended = f"AISearch Service {aisearch_service.name} from subscription {subscription_name} does not allows public access."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: aks_client.py]---
Location: prowler-master/prowler/providers/azure/services/aks/aks_client.py

```python
from prowler.providers.azure.services.aks.aks_service import AKS
from prowler.providers.common.provider import Provider

aks_client = AKS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: aks_service.py]---
Location: prowler-master/prowler/providers/azure/services/aks/aks_service.py

```python
from dataclasses import dataclass
from typing import List

from azure.mgmt.containerservice import ContainerServiceClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class AKS(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(ContainerServiceClient, provider)
        self.clusters = self._get_clusters()

    def _get_clusters(self):
        logger.info("AKS - Getting clusters...")
        clusters = {}

        for subscription_name, client in self.clients.items():
            try:
                clusters_list = client.managed_clusters.list()
                clusters.update({subscription_name: {}})

                for cluster in clusters_list:
                    if getattr(cluster, "kubernetes_version", None):
                        clusters[subscription_name].update(
                            {
                                cluster.id: Cluster(
                                    id=cluster.id,
                                    name=cluster.name,
                                    public_fqdn=cluster.fqdn,
                                    private_fqdn=cluster.private_fqdn,
                                    location=cluster.location,
                                    network_policy=(
                                        getattr(
                                            cluster.network_profile,
                                            "network_policy",
                                            None,
                                        )
                                        if getattr(cluster, "network_profile", None)
                                        else None
                                    ),
                                    agent_pool_profiles=[
                                        ManagedClusterAgentPoolProfile(
                                            name=agent_pool_profile.name,
                                            enable_node_public_ip=getattr(
                                                agent_pool_profile,
                                                "enable_node_public_ip",
                                                False,
                                            ),
                                        )
                                        for agent_pool_profile in getattr(
                                            cluster, "agent_pool_profiles", []
                                        )
                                    ],
                                    rbac_enabled=getattr(cluster, "enable_rbac", False),
                                )
                            }
                        )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

        return clusters


@dataclass
class ManagedClusterAgentPoolProfile:
    name: str
    enable_node_public_ip: bool


@dataclass
class Cluster:
    id: str
    name: str
    public_fqdn: str
    private_fqdn: str
    network_policy: str
    agent_pool_profiles: List[ManagedClusterAgentPoolProfile]
    rbac_enabled: bool
    location: str
```

--------------------------------------------------------------------------------

---[FILE: aks_clusters_created_with_private_nodes.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/aks/aks_clusters_created_with_private_nodes/aks_clusters_created_with_private_nodes.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "aks_clusters_created_with_private_nodes",
  "CheckTitle": "Ensure clusters are created with Private Nodes",
  "CheckType": [],
  "ServiceName": "aks",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.ContainerService/ManagedClusters",
  "Description": "Disable public IP addresses for cluster nodes, so that they only have private IP addresses. Private Nodes are nodes with no public IP addresses.",
  "Risk": "Disabling public IP addresses on cluster nodes restricts access to only internal networks, forcing attackers to obtain local network access before attempting to compromise the underlying Kubernetes hosts.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/aks/private-clusters",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "",
      "Url": "https://learn.microsoft.com/en-us/azure/aks/access-private-cluster"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: aks_clusters_created_with_private_nodes.py]---
Location: prowler-master/prowler/providers/azure/services/aks/aks_clusters_created_with_private_nodes/aks_clusters_created_with_private_nodes.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.aks.aks_client import aks_client


class aks_clusters_created_with_private_nodes(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, clusters in aks_client.clusters.items():
            for cluster in clusters.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=cluster)
                report.subscription = subscription_name
                report.status = "PASS"
                report.status_extended = f"Cluster '{cluster.name}' was created with private nodes in subscription '{subscription_name}'"

                for agent_pool in cluster.agent_pool_profiles:
                    if getattr(agent_pool, "enable_node_public_ip", True):
                        report.status = "FAIL"
                        report.status_extended = f"Cluster '{cluster.name}' was not created with private nodes in subscription '{subscription_name}'"
                        break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: aks_clusters_public_access_disabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/aks/aks_clusters_public_access_disabled/aks_clusters_public_access_disabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "aks_clusters_public_access_disabled",
  "CheckTitle": "Ensure clusters are created with Private Endpoint Enabled and Public Access Disabled",
  "CheckType": [],
  "ServiceName": "aks",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.ContainerService/ManagedClusters",
  "Description": "Disable access to the Kubernetes API from outside the node network if it is not required.",
  "Risk": "In a private cluster, the master node has two endpoints, a private and public endpoint. The private endpoint is the internal IP address of the master, behind an internal load balancer in the master's wirtual network. Nodes communicate with the master using the private endpoint. The public endpoint enables the Kubernetes API to be accessed from outside the master's virtual network. Although Kubernetes API requires an authorized token to perform sensitive actions, a vulnerability could potentially expose the Kubernetes publically with unrestricted access. Additionally, an attacker may be able to identify the current cluster and Kubernetes API version and determine whether it is vulnerable to an attack. Unless required, disabling public endpoint will help prevent such threats, and require the attacker to be on the master's virtual network to perform any attack on the Kubernetes API.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/aks/private-clusters?tabs=azure-portal",
  "Remediation": {
    "Code": {
      "CLI": "az aks update -n <cluster_name> -g <resource_group> --disable-public-fqdn",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To use a private endpoint, create a new private endpoint in your virtual network then create a link between your virtual network and a new private DNS zone",
      "Url": "https://learn.microsoft.com/en-us/azure/aks/access-private-cluster?tabs=azure-cli"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: aks_clusters_public_access_disabled.py]---
Location: prowler-master/prowler/providers/azure/services/aks/aks_clusters_public_access_disabled/aks_clusters_public_access_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.aks.aks_client import aks_client


class aks_clusters_public_access_disabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, clusters in aks_client.clusters.items():
            for cluster in clusters.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=cluster)
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = f"Public access to nodes is enabled for cluster '{cluster.name}' in subscription '{subscription_name}'"

                if cluster.private_fqdn:
                    for agent_pool in cluster.agent_pool_profiles:
                        if not getattr(agent_pool, "enable_node_public_ip", False):
                            report.status = "PASS"
                            report.status_extended = f"Public access to nodes is disabled for cluster '{cluster.name}' in subscription '{subscription_name}'"

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
