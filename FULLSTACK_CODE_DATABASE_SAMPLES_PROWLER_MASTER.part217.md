---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 217
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 217 of 867)

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
Location: prowler-master/prowler/providers/alibabacloud/models.py
Signals: Pydantic

```python
from datetime import datetime
from typing import Optional

from alibabacloud_actiontrail20200706.client import Client as ActionTrailClient
from alibabacloud_cs20151215.client import Client as CSClient
from alibabacloud_ecs20140526.client import Client as EcsClient
from alibabacloud_oss20190517.client import Client as OssClient
from alibabacloud_ram20150501.client import Client as RamClient
from alibabacloud_rds20140815.client import Client as RdsClient
from alibabacloud_sas20181203.client import Client as SasClient
from alibabacloud_sls20201230.client import Client as SlsClient
from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_vpc20160428.client import Client as VpcClient
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.alibabacloud.config import (
    ALIBABACLOUD_DEFAULT_REGION,
    ALIBABACLOUD_SDK_CONNECT_TIMEOUT,
    ALIBABACLOUD_SDK_READ_TIMEOUT,
)
from prowler.providers.common.models import ProviderOutputOptions


class AlibabaCloudCallerIdentity(BaseModel):
    """
    AlibabaCloudCallerIdentity stores the caller identity information from STS GetCallerIdentity.

    Attributes:
        account_id: The Alibaba Cloud account ID
        principal_id: The principal ID (user ID or root account ID)
        arn: The ARN-like identifier for the identity
        identity_type: The type of identity (e.g., "RamUser", "Root")
    """

    account_id: str
    principal_id: str
    arn: str
    identity_type: str = ""


class AlibabaCloudIdentityInfo(BaseModel):
    """
    AlibabaCloudIdentityInfo stores the Alibaba Cloud account identity information.

    Attributes:
        account_id: The Alibaba Cloud account ID
        account_name: The Alibaba Cloud account name (if available)
        user_id: The RAM user ID or root account ID
        user_name: The RAM user name or "root" for root account
        identity_arn: The ARN-like identifier for the identity
        profile: The profile name used for authentication
        profile_region: The default region from the profile
        audited_regions: Set of regions to be audited
        is_root: Whether this is the root account (True) or a RAM user (False)
    """

    account_id: str
    account_name: str
    user_id: str
    user_name: str
    identity_arn: str
    profile: str
    profile_region: str
    audited_regions: set[str]
    is_root: bool = False


class AlibabaCloudCredentials(BaseModel):
    """
    AlibabaCloudCredentials stores the Alibaba Cloud credentials.

    Attributes:
        access_key_id: The Access Key ID
        access_key_secret: The Access Key Secret
        security_token: The Security Token (for STS temporary credentials)
        expiration: The expiration time for temporary credentials
    """

    access_key_id: str
    access_key_secret: str
    security_token: Optional[str] = None
    expiration: Optional[datetime] = None


class AlibabaCloudAssumeRoleInfo(BaseModel):
    """
    AlibabaCloudAssumeRoleInfo stores the information for assuming a RAM role.

    Attributes:
        role_arn: The ARN of the role to assume
        role_session_name: The session name for the assumed role
        session_duration: The duration of the assumed role session (in seconds)
        external_id: The external ID for role assumption
        region: The region for STS endpoint
    """

    role_arn: str
    role_session_name: str
    session_duration: int
    external_id: Optional[str] = None
    region: str = "cn-hangzhou"


class AlibabaCloudRegion(BaseModel):
    """
    AlibabaCloudRegion stores information about an Alibaba Cloud region.

    Attributes:
        region_id: The region identifier (e.g., cn-hangzhou, cn-shanghai)
        region_name: The human-readable region name
        region_endpoint: The API endpoint for the region
    """

    region_id: str
    region_name: str
    region_endpoint: Optional[str] = None


class AlibabaCloudSession:
    """
    AlibabaCloudSession stores the Alibaba Cloud session and credentials.

    This class provides methods to get credentials and create service clients.
    """

    def __init__(self, cred_client):
        """
        Initialize the Alibaba Cloud session.

        Args:
            cred_client: The Alibaba Cloud credentials client
        """
        self.cred_client = cred_client
        self._credentials = None

    def get_credentials(self):
        """
        Get the Alibaba Cloud credentials.

        Returns:
            AlibabaCloudCredentials object
        """
        if self._credentials is None:
            cred = self.cred_client.get_credential()
            self._credentials = AlibabaCloudCredentials(
                access_key_id=cred.get_access_key_id(),
                access_key_secret=cred.get_access_key_secret(),
                security_token=cred.get_security_token(),
            )
        return self._credentials

    def client(self, service: str, region: str = None):
        """
        Create a service client for the given service and region.

        Args:
            service: The service name (e.g., 'ram')
            region: The region (optional, some services are global)

        Returns:
            A client instance for the specified service
        """

        # Get credentials
        cred = self.get_credentials()

        # Create client configuration with timeout settings
        config = open_api_models.Config(
            access_key_id=cred.access_key_id,
            access_key_secret=cred.access_key_secret,
            read_timeout=ALIBABACLOUD_SDK_READ_TIMEOUT
            * 1000,  # Convert to milliseconds
            connect_timeout=ALIBABACLOUD_SDK_CONNECT_TIMEOUT
            * 1000,  # Convert to milliseconds
        )
        if cred.security_token:
            config.security_token = cred.security_token

        # Set endpoint based on service
        if service == "ram":
            config.endpoint = "ram.aliyuncs.com"
            return RamClient(config)
        elif service == "vpc":
            # VPC endpoint is regional: vpc.{region}.aliyuncs.com
            if region:
                config.endpoint = f"vpc.{region}.aliyuncs.com"
            else:
                config.endpoint = f"vpc.{ALIBABACLOUD_DEFAULT_REGION}.aliyuncs.com"
            return VpcClient(config)
        elif service == "ecs":
            # ECS endpoint is regional: ecs.{region}.aliyuncs.com
            if region:
                config.endpoint = f"ecs.{region}.aliyuncs.com"
            else:
                config.endpoint = f"ecs.{ALIBABACLOUD_DEFAULT_REGION}.aliyuncs.com"
            return EcsClient(config)
        elif service == "sas" or service == "securitycenter":
            # SAS (Security Center) endpoint is regional: sas.{region}.aliyuncs.com
            if region:
                config.endpoint = f"sas.{region}.aliyuncs.com"
            else:
                config.endpoint = f"sas.{ALIBABACLOUD_DEFAULT_REGION}.aliyuncs.com"
            return SasClient(config)
        elif service == "oss":
            if region:
                config.endpoint = f"oss-{region}.aliyuncs.com"
                config.region_id = region
            else:
                config.endpoint = f"oss-{ALIBABACLOUD_DEFAULT_REGION}.aliyuncs.com"
                config.region_id = ALIBABACLOUD_DEFAULT_REGION
            return OssClient(config)
        elif service == "actiontrail":
            # ActionTrail endpoint is regional: actiontrail.{region}.aliyuncs.com
            if region:
                config.endpoint = f"actiontrail.{region}.aliyuncs.com"
            else:
                config.endpoint = (
                    f"actiontrail.{ALIBABACLOUD_DEFAULT_REGION}.aliyuncs.com"
                )
            return ActionTrailClient(config)
        elif service == "cs":
            if region:
                config.endpoint = f"cs.{region}.aliyuncs.com"
            else:
                config.endpoint = f"cs.{ALIBABACLOUD_DEFAULT_REGION}.aliyuncs.com"
            return CSClient(config)
        elif service == "rds":
            if region:
                config.endpoint = f"rds.{region}.aliyuncs.com"
            else:
                config.endpoint = f"rds.{ALIBABACLOUD_DEFAULT_REGION}.aliyuncs.com"
            return RdsClient(config)
        elif service == "sls":
            if region:
                config.endpoint = f"{region}.log.aliyuncs.com"
            else:
                config.endpoint = f"{ALIBABACLOUD_DEFAULT_REGION}.log.aliyuncs.com"
            return SlsClient(config)
        else:
            # For other services, implement as needed
            logger.warning(f"Service {service} not yet implemented")
            return None


class AlibabaCloudOutputOptions(ProviderOutputOptions):
    """
    AlibabaCloudOutputOptions extends ProviderOutputOptions for Alibaba Cloud specific output options.
    """

    def __init__(self, arguments, bulk_checks_metadata, identity):
        # Call parent class init
        super().__init__(arguments, bulk_checks_metadata)

        # Set default output filename if not provided
        if (
            not hasattr(arguments, "output_filename")
            or arguments.output_filename is None
        ):
            from prowler.config.config import output_file_timestamp

            self.output_filename = (
                f"prowler-output-{identity.account_id}-{output_file_timestamp}"
            )
        else:
            self.output_filename = arguments.output_filename
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: prowler-master/prowler/providers/alibabacloud/exceptions/exceptions.py

```python
from prowler.exceptions.exceptions import ProwlerException


# Exceptions codes from 10000 to 10999 are reserved for AlibabaCloud exceptions
class AlibabaCloudBaseException(ProwlerException):
    """Base class for Alibaba Cloud Provider exceptions"""

    ALIBABACLOUD_ERROR_CODES = {
        (10000, "AlibabaCloudClientError"): {
            "message": "Alibaba Cloud ClientError occurred",
            "remediation": "Check your Alibaba Cloud client configuration and permissions.",
        },
        (10001, "AlibabaCloudNoCredentialsError"): {
            "message": "No credentials found for Alibaba Cloud provider",
            "remediation": "Verify that Alibaba Cloud credentials are properly set up. Access Key ID and Access Key Secret are required.",
        },
        (10002, "AlibabaCloudInvalidCredentialsError"): {
            "message": "Invalid credentials provided for Alibaba Cloud provider",
            "remediation": "Check your Alibaba Cloud credentials and ensure they are valid and have proper permissions.",
        },
        (10003, "AlibabaCloudSetUpSessionError"): {
            "message": "Failed to set up session for Alibaba Cloud provider",
            "remediation": "Check the Alibaba Cloud session setup and ensure it is properly configured.",
        },
        (10004, "AlibabaCloudAssumeRoleError"): {
            "message": "Failed to assume role for Alibaba Cloud provider",
            "remediation": "Check the Alibaba Cloud assume role configuration and ensure it is properly set up.",
        },
        (10005, "AlibabaCloudInvalidRegionError"): {
            "message": "Invalid region specified for Alibaba Cloud provider",
            "remediation": "Check the region and ensure it is a valid region for Alibaba Cloud.",
        },
        (10006, "AlibabaCloudArgumentTypeValidationError"): {
            "message": "Alibaba Cloud argument type validation error",
            "remediation": "Check the provided argument types specific to Alibaba Cloud and ensure they meet the required format.",
        },
        (10007, "AlibabaCloudHTTPError"): {
            "message": "Alibaba Cloud HTTP/API error",
            "remediation": "Check the Alibaba Cloud API request and response, and ensure the service is accessible.",
        },
    }

    def __init__(self, code, file=None, original_exception=None, message=None):
        error_info = self.ALIBABACLOUD_ERROR_CODES.get((code, self.__class__.__name__))
        if message:
            error_info["message"] = message
        super().__init__(
            code,
            source="AlibabaCloud",
            file=file,
            original_exception=original_exception,
            error_info=error_info,
        )


class AlibabaCloudCredentialsError(AlibabaCloudBaseException):
    """Base class for Alibaba Cloud credentials errors."""

    def __init__(self, code, file=None, original_exception=None, message=None):
        super().__init__(code, file, original_exception, message)


class AlibabaCloudClientError(AlibabaCloudCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            10000, file=file, original_exception=original_exception, message=message
        )


class AlibabaCloudNoCredentialsError(AlibabaCloudCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            10001, file=file, original_exception=original_exception, message=message
        )


class AlibabaCloudInvalidCredentialsError(AlibabaCloudCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            10002, file=file, original_exception=original_exception, message=message
        )


class AlibabaCloudSetUpSessionError(AlibabaCloudBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            10003, file=file, original_exception=original_exception, message=message
        )


class AlibabaCloudAssumeRoleError(AlibabaCloudBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            10004, file=file, original_exception=original_exception, message=message
        )


class AlibabaCloudInvalidRegionError(AlibabaCloudBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            10005, file=file, original_exception=original_exception, message=message
        )


class AlibabaCloudArgumentTypeValidationError(AlibabaCloudBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            10006, file=file, original_exception=original_exception, message=message
        )


class AlibabaCloudHTTPError(AlibabaCloudBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            10007, file=file, original_exception=original_exception, message=message
        )
```

--------------------------------------------------------------------------------

---[FILE: arguments.py]---
Location: prowler-master/prowler/providers/alibabacloud/lib/arguments/arguments.py

```python
def init_parser(self):
    """Init the Alibaba Cloud Provider CLI parser"""
    alibabacloud_parser = self.subparsers.add_parser(
        "alibabacloud",
        parents=[self.common_providers_parser],
        help="Alibaba Cloud Provider",
    )

    # Authentication Methods
    alibabacloud_auth_subparser = alibabacloud_parser.add_argument_group(
        "Authentication Modes"
    )
    alibabacloud_auth_subparser.add_argument(
        "--role-arn",
        nargs="?",
        default=None,
        help="ARN of the RAM role to assume (e.g., acs:ram::123456789012:role/ProwlerAuditRole). Requires access keys to be set via environment variables (ALIBABA_CLOUD_ACCESS_KEY_ID and ALIBABA_CLOUD_ACCESS_KEY_SECRET). The provider will automatically obtain and refresh STS tokens. Can also use ALIBABA_CLOUD_ROLE_ARN environment variable",
    )
    alibabacloud_auth_subparser.add_argument(
        "--role-session-name",
        nargs="?",
        default=None,
        help="Session name when assuming the RAM role. Defaults to ProwlerAssessmentSession. Can also use ALIBABA_CLOUD_ROLE_SESSION_NAME environment variable",
    )
    alibabacloud_auth_subparser.add_argument(
        "--ecs-ram-role",
        nargs="?",
        default=None,
        help="Name of the RAM role attached to an ECS instance. When specified, credentials are obtained from the ECS instance metadata service. Can also use ALIBABA_CLOUD_ECS_METADATA environment variable",
    )
    alibabacloud_auth_subparser.add_argument(
        "--oidc-role-arn",
        nargs="?",
        default=None,
        help="ARN of the RAM role for OIDC authentication. Requires OIDC provider ARN and token file to be set via environment variables (ALIBABA_CLOUD_OIDC_PROVIDER_ARN and ALIBABA_CLOUD_OIDC_TOKEN_FILE). Can also use ALIBABA_CLOUD_ROLE_ARN environment variable",
    )
    alibabacloud_auth_subparser.add_argument(
        "--credentials-uri",
        nargs="?",
        default=None,
        help="URI to retrieve credentials from an external service. The URI must return credentials in the required JSON format. Can also use ALIBABA_CLOUD_CREDENTIALS_URI environment variable",
    )

    # Alibaba Cloud Regions
    alibabacloud_regions_subparser = alibabacloud_parser.add_argument_group(
        "Alibaba Cloud Regions"
    )
    alibabacloud_regions_subparser.add_argument(
        "--region",
        "--filter-region",
        "-f",
        nargs="+",
        dest="regions",
        help="Alibaba Cloud region IDs to run Prowler against (e.g., cn-hangzhou, cn-shanghai)",
    )

    # Set the provider
    alibabacloud_parser.set_defaults(provider="alibabacloud")
```

--------------------------------------------------------------------------------

---[FILE: mutelist.py]---
Location: prowler-master/prowler/providers/alibabacloud/lib/mutelist/mutelist.py

```python
from prowler.lib.check.models import CheckReportAlibabaCloud
from prowler.lib.logger import logger
from prowler.lib.mutelist.mutelist import Mutelist
from prowler.lib.outputs.utils import unroll_tags


class AlibabaCloudMutelist(Mutelist):
    """
    AlibabaCloudMutelist class extends the base Mutelist for Alibaba Cloud-specific functionality.

    This class handles muting/filtering of findings for Alibaba Cloud resources.

    Attributes:
        account_id: The Alibaba Cloud account ID
        mutelist: The parsed mutelist data
    """

    def __init__(
        self,
        mutelist_path: str = None,
        mutelist_content: dict = None,
        account_id: str = "",
    ):
        """
        Initialize the AlibabaCloudMutelist.

        Args:
            mutelist_path: Path to the mutelist file
            mutelist_content: Dictionary containing mutelist content
            account_id: The Alibaba Cloud account ID
        """
        self.account_id = account_id
        super().__init__(
            mutelist_path=mutelist_path or "",
            mutelist_content=mutelist_content or {},
        )

    def is_finding_muted(
        self,
        finding: CheckReportAlibabaCloud,
        account_id: str,
    ) -> bool:
        """
        Check if a finding is muted based on the mutelist.

        Args:
            finding: The finding object to check (should have check_metadata, region, resource_id, resource_tags).
            account_id: The Alibaba Cloud account ID to use for mutelist evaluation.

        Returns:
            bool: True if the finding is muted, False otherwise.
        """
        try:
            check_id = finding.check_metadata.CheckID
            region = finding.region if hasattr(finding, "region") else ""
            resource_id = finding.resource_id if hasattr(finding, "resource_id") else ""
            resource_tags = {}

            # Handle resource tags
            if hasattr(finding, "resource_tags") and finding.resource_tags:
                # Keep as dict for tag matching logic; do not unroll to string
                resource_tags = unroll_tags(finding.resource_tags)

            return self.is_muted(
                account_id,
                check_id,
                region,
                resource_id,
                resource_tags,
            )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return False

    def is_muted(
        self,
        account_id: str,
        check_id: str,
        region: str,
        resource_id: str,
        resource_tags: dict = None,
    ) -> bool:
        """
        Check if a finding should be muted.

        Args:
            account_id: The Alibaba Cloud account ID
            check_id: The check ID
            region: The region ID
            resource_id: The resource ID
            resource_tags: Dictionary of resource tags

        Returns:
            True if the finding should be muted, False otherwise
        """
        if not self.mutelist:
            return False

        try:
            # Check account-level mutes
            accounts = self.mutelist.get("Accounts", {})
            if not accounts:
                return False

            # Check for wildcard or specific account
            account_mutelist = accounts.get("*", {})
            if account_id in accounts:
                # Merge with specific account rules
                specific_account = accounts.get(account_id, {})
                account_mutelist = {**account_mutelist, **specific_account}

            if not account_mutelist:
                return False

            # Get checks for this account
            checks = account_mutelist.get("Checks", {})

            # Check for wildcard or specific check
            check_mutelist = checks.get("*", {})
            if check_id in checks:
                specific_check = checks.get(check_id, {})
                check_mutelist = {**check_mutelist, **specific_check}

            if not check_mutelist:
                return False

            # Check regions
            regions = check_mutelist.get("Regions", [])
            if regions and "*" not in regions and region not in regions:
                return False

            # Check resources
            resources = check_mutelist.get("Resources", [])
            if resources:
                if "*" not in resources and resource_id not in resources:
                    return False

            # Check tags
            tags = check_mutelist.get("Tags", [])
            if tags and resource_tags:
                # Check if any tag matches
                tag_match = False
                for tag_filter in tags:
                    # Tag filter format: "key=value" or "key=*"
                    if "=" in tag_filter:
                        key, value = tag_filter.split("=", 1)
                        if key in resource_tags:
                            if value == "*" or resource_tags[key] == value:
                                tag_match = True
                                break

                if not tag_match:
                    return False

            # Check exceptions (resources that should NOT be muted)
            exceptions = check_mutelist.get("Exceptions", {})
            if exceptions:
                exception_resources = exceptions.get("Resources", [])
                if resource_id in exception_resources:
                    return False

                exception_regions = exceptions.get("Regions", [])
                if region in exception_regions:
                    return False

            # If we passed all checks, the finding is muted
            return True

        except Exception as error:
            logger.error(
                f"Error checking mutelist: {error.__class__.__name__}: {error}"
            )
            return False
```

--------------------------------------------------------------------------------

---[FILE: service.py]---
Location: prowler-master/prowler/providers/alibabacloud/lib/service/service.py

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any, Dict

from prowler.lib.logger import logger

MAX_WORKERS = 10


class AlibabaCloudService:
    """
    The AlibabaCloudService class offers a parent class for each Alibaba Cloud Service to generate:
    - Alibaba Cloud Regional Clients
    - Shared information like the account ID, the checks audited
    - Thread pool for the __threading_call__
    - Handles if the service is Regional or Global
    """

    def __init__(self, service: str, provider, global_service: bool = False):
        """
        Initialize the AlibabaCloudService.

        Args:
            service: The service name (e.g., 'RAM', 'ECS', 'OSS')
            provider: The AlibabaCloudProvider instance
            global_service: Whether this is a global service (default: False)
        """
        # Audit Information
        self.provider = provider
        self.audited_account = provider.identity.account_id
        self.audited_account_name = provider.identity.account_name
        self.audit_resources = provider.audit_resources
        self.audited_checks = provider.audit_metadata.expected_checks
        self.audit_config = provider.audit_config

        # Session
        self.session = provider.session

        # Service name
        self.service = service.lower() if not service.islower() else service

        # Generate Regional Clients
        self.regional_clients: Dict[str, Any] = {}
        if not global_service:
            self.regional_clients = provider.generate_regional_clients(self.service)

        # Get default region and client
        self.region = provider.get_default_region(self.service)
        self.client = self.session.client(self.service, self.region)

        # Thread pool for __threading_call__
        self.thread_pool = ThreadPoolExecutor(max_workers=MAX_WORKERS)

    def __get_session__(self):
        """Get the session."""
        return self.session

    def __get_client__(self, region: str = None):
        """
        Get a client for the specified region or the default region.

        Args:
            region: The region to get the client for (optional)

        Returns:
            A client instance for the service
        """
        if region and region in self.regional_clients:
            return self.regional_clients[region]
        return self.client

    def __threading_call__(self, call, iterator=None):
        """
        Execute a function across multiple regions or items using threads.

        Args:
            call: The function to call
            iterator: The items to iterate over (default: regional clients)
        """
        # Use the provided iterator, or default to self.regional_clients
        items = iterator if iterator is not None else self.regional_clients.values()
        # Determine the total count for logging
        item_count = (
            len(list(items)) if iterator is not None else len(self.regional_clients)
        )

        # Trim leading and trailing underscores from the call's name
        call_name = call.__name__.strip("_")
        # Add Capitalization
        call_name = " ".join([x.capitalize() for x in call_name.split("_")])

        # Print a message based on the call's name
        if iterator is None:
            logger.info(
                f"{self.service.upper()} - Starting threads for '{call_name}' function across {item_count} regions..."
            )
        else:
            logger.info(
                f"{self.service.upper()} - Starting threads for '{call_name}' function to process {item_count} items..."
            )

        # Re-create the iterator for submission if it was a generator
        items = iterator if iterator is not None else self.regional_clients.values()

        # Submit tasks to the thread pool
        futures = [self.thread_pool.submit(call, item) for item in items]

        # Wait for all tasks to complete
        for future in as_completed(futures):
            try:
                future.result()  # Raises exceptions from the thread, if any
            except Exception:
                # Handle exceptions if necessary
                pass  # Currently handled within the called function
```

--------------------------------------------------------------------------------

---[FILE: actiontrail_client.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/actiontrail/actiontrail_client.py

```python
from prowler.providers.alibabacloud.services.actiontrail.actiontrail_service import (
    ActionTrail,
)
from prowler.providers.common.provider import Provider

actiontrail_client = ActionTrail(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: actiontrail_service.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/actiontrail/actiontrail_service.py
Signals: Pydantic

```python
from datetime import datetime
from typing import Optional

from alibabacloud_actiontrail20200706 import models as actiontrail_models
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.alibabacloud.lib.service.service import AlibabaCloudService


class ActionTrail(AlibabaCloudService):
    """
    ActionTrail service class for Alibaba Cloud.

    This class provides methods to interact with Alibaba Cloud ActionTrail service
    to retrieve trails and their configuration.
    """

    def __init__(self, provider):
        # Call AlibabaCloudService's __init__
        # ActionTrail is a regional service
        super().__init__(__class__.__name__, provider, global_service=False)

        # Fetch ActionTrail resources
        self.trails = {}
        self.__threading_call__(self._describe_trails)

    def _describe_trails(self, regional_client):
        """List all ActionTrail trails."""
        region = getattr(regional_client, "region", "unknown")
        logger.info(f"ActionTrail - Describing trails in {region}...")
        try:
            # Use Tea SDK client (ActionTrail is regional service)
            request = actiontrail_models.DescribeTrailsRequest()
            response = regional_client.describe_trails(request)

            if response and response.body and response.body.trail_list:
                # trail_list is already a list, not an object with a trail attribute
                trails_list = response.body.trail_list
                if not isinstance(trails_list, list):
                    trails_list = [trails_list]

                for trail_data in trails_list:
                    trail_name = getattr(trail_data, "name", "")
                    if not trail_name:
                        continue

                    # Get trail region (can be specific region or "All")
                    trail_region = getattr(trail_data, "trail_region", "")
                    home_region = getattr(trail_data, "home_region", "")
                    status = getattr(trail_data, "status", "")

                    # Create ARN
                    arn = f"acs:actiontrail::{self.audited_account}:trail/{trail_name}"

                    if not self.audit_resources or is_resource_filtered(
                        arn, self.audit_resources
                    ):
                        # Parse creation date if available
                        creation_date = None
                        creation_date_str = getattr(trail_data, "create_time", None)
                        if creation_date_str:
                            try:
                                # ActionTrail date format: "2024-02-02T10:02:11Z" or similar
                                creation_date = datetime.strptime(
                                    creation_date_str.replace("Z", "+00:00"),
                                    "%Y-%m-%dT%H:%M:%S%z",
                                )
                            except (ValueError, AttributeError):
                                creation_date = datetime.strptime(
                                    creation_date_str.replace("Z", "+00:00"),
                                    "%Y-%m-%dT%H:%M:%S.%f%z",
                                )

                        self.trails[arn] = Trail(
                            arn=arn,
                            name=trail_name,
                            home_region=home_region,
                            trail_region=trail_region,
                            status=status,
                            oss_bucket_name=getattr(trail_data, "oss_bucket_name", ""),
                            oss_bucket_location=getattr(
                                trail_data, "oss_bucket_location", ""
                            ),
                            sls_project_arn=getattr(trail_data, "sls_project_arn", ""),
                            event_rw=getattr(trail_data, "event_rw", ""),
                            creation_date=creation_date,
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


# Service Models
class Trail(BaseModel):
    """ActionTrail Trail model."""

    arn: str
    name: str
    home_region: str
    trail_region: str  # "All" for multi-region, or specific region name
    status: str  # "Enable" or "Disable"
    oss_bucket_name: str = ""
    oss_bucket_location: str = ""
    sls_project_arn: str = ""
    event_rw: str = ""  # "All", "Read", "Write"
    creation_date: Optional[datetime] = None
```

--------------------------------------------------------------------------------

---[FILE: actiontrail_multi_region_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/actiontrail/actiontrail_multi_region_enabled/actiontrail_multi_region_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "actiontrail_multi_region_enabled",
  "CheckTitle": "ActionTrail are configured to export copies of all Log entries",
  "CheckType": [
    "Unusual logon",
    "Cloud threat detection"
  ],
  "ServiceName": "actiontrail",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:actiontrail::account-id:trail",
  "Severity": "critical",
  "ResourceType": "AlibabaCloudActionTrail",
  "Description": "**ActionTrail** is a web service that records API calls for your account and delivers log files to you.\n\nThe recorded information includes the identity of the API caller, the time of the API call, the source IP address of the API caller, the request parameters, and the response elements returned by the Alibaba Cloud service. ActionTrail provides a history of API calls for an account, including API calls made via the Management Console, SDKs, and command line tools.",
  "Risk": "The API call history produced by ActionTrail enables **security analysis**, **resource change tracking**, and **compliance auditing**.\n\nEnsuring that a **multi-region trail** exists will detect unexpected activities occurring in otherwise unused regions. Global Service Logging should be enabled by default to capture events generated on Alibaba Cloud global services, ensuring the recording of management operations performed on all resources in an Alibaba Cloud account.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/28829.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ActionTrail/enable-multi-region-trails.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun actiontrail CreateTrail --Name <trail_name> --OssBucketName <oss_bucket_for_actiontrail> --RoleName aliyunactiontraildefaultrole --SlsProjectArn <sls_project_arn_for_actiontrail> --SlsWriteRoleArn <sls_role_arn_for_actiontrail> --EventRW <api_type_for_actiontrail>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_actiontrail_trail\" \"example\" {\n  trail_name         = \"multi-region-trail\"\n  trail_region       = \"All\"\n  sls_project_arn    = \"acs:log:cn-hangzhou:123456789:project/actiontrail-project\"\n  sls_write_role_arn = data.alicloud_ram_roles.actiontrail.roles.0.arn\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **ActionTrail Console**\n2. Click on **Trails** in the left navigation pane\n3. Click **Add new trail**\n4. Enter a trail name in the `Trail name` box\n5. Set **Yes** for `Apply Trail to All Regions`\n6. Specify an OSS bucket name in the `OSS bucket` box\n7. Specify an SLS project name in the `SLS project` box\n8. Click **Create**",
      "Url": "https://hub.prowler.com/check/actiontrail_multi_region_enabled"
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

````
