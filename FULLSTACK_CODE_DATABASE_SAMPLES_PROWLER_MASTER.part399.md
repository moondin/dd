---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 399
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 399 of 867)

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
Location: prowler-master/prowler/providers/oraclecloud/exceptions/exceptions.py

```python
from prowler.exceptions.exceptions import ProwlerException


# Exceptions codes from 7000 to 7999 are reserved for OCI exceptions
class OCIBaseException(ProwlerException):
    """Base class for OCI errors."""

    OCI_ERROR_CODES = {
        (7000, "OCIClientError"): {
            "message": "OCI ClientError occurred",
            "remediation": "Check your OCI client configuration and permissions.",
        },
        (7001, "OCIConfigFileNotFoundError"): {
            "message": "OCI Config file not found",
            "remediation": "Ensure the OCI config file exists at the specified path, please visit https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm",
        },
        (7002, "OCIInvalidConfigError"): {
            "message": "Invalid OCI configuration",
            "remediation": "Verify that your OCI configuration is properly set up, please visit https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm",
        },
        (7003, "OCIProfileNotFoundError"): {
            "message": "OCI Profile not found",
            "remediation": "Ensure the OCI profile exists in your config file, please visit https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm",
        },
        (7004, "OCINoCredentialsError"): {
            "message": "No OCI credentials found",
            "remediation": "Verify that OCI credentials are properly set up, please visit https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm",
        },
        (7005, "OCIAuthenticationError"): {
            "message": "OCI authentication failed",
            "remediation": "Check your OCI credentials and ensure they are valid.",
        },
        (7006, "OCISetUpSessionError"): {
            "message": "OCI session setup error",
            "remediation": "Check the OCI session setup and ensure it is properly configured.",
        },
        (7007, "OCIInvalidRegionError"): {
            "message": "Invalid OCI region",
            "remediation": "Check the OCI region name and ensure it is valid, please visit https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm",
        },
        (7008, "OCIInvalidCompartmentError"): {
            "message": "Invalid OCI compartment",
            "remediation": "Check the OCI compartment OCID and ensure it exists and is accessible.",
        },
        (7009, "OCIInvalidTenancyError"): {
            "message": "Invalid OCI tenancy",
            "remediation": "Check the OCI tenancy OCID and ensure it is valid.",
        },
        (7010, "OCIServiceError"): {
            "message": "OCI service error occurred",
            "remediation": "Check the OCI service error details and ensure proper permissions.",
        },
        (7011, "OCIInstancePrincipalError"): {
            "message": "OCI instance principal authentication failed",
            "remediation": "Ensure the instance has proper instance principal configuration and dynamic group policies.",
        },
        (7012, "OCIInvalidOCIDError"): {
            "message": "Invalid OCI OCID format",
            "remediation": "Check the OCID format and ensure it matches the pattern: ocid1.<resource_type>.<realm>.<region>.<unique_id>",
        },
    }

    def __init__(self, code, file=None, original_exception=None, message=None):
        error_info = self.OCI_ERROR_CODES.get((code, self.__class__.__name__))
        if message:
            error_info["message"] = message
        super().__init__(
            code,
            source="OCI",
            file=file,
            original_exception=original_exception,
            error_info=error_info,
        )


class OCICredentialsError(OCIBaseException):
    """Base class for OCI credentials errors."""

    def __init__(self, code, file=None, original_exception=None, message=None):
        super().__init__(code, file, original_exception, message)


class OCIClientError(OCICredentialsError):
    """Exception raised when OCI client error occurs."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7000, file=file, original_exception=original_exception, message=message
        )


class OCIConfigFileNotFoundError(OCICredentialsError):
    """Exception raised when OCI config file is not found."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7001, file=file, original_exception=original_exception, message=message
        )


class OCIInvalidConfigError(OCICredentialsError):
    """Exception raised when OCI configuration is invalid."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7002, file=file, original_exception=original_exception, message=message
        )


class OCIProfileNotFoundError(OCICredentialsError):
    """Exception raised when OCI profile is not found."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7003, file=file, original_exception=original_exception, message=message
        )


class OCINoCredentialsError(OCICredentialsError):
    """Exception raised when no OCI credentials are found."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7004, file=file, original_exception=original_exception, message=message
        )


class OCIAuthenticationError(OCICredentialsError):
    """Exception raised when OCI authentication fails."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7005, file=file, original_exception=original_exception, message=message
        )


class OCISetUpSessionError(OCIBaseException):
    """Exception raised when OCI session setup fails."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7006, file=file, original_exception=original_exception, message=message
        )


class OCIInvalidRegionError(OCIBaseException):
    """Exception raised when OCI region is invalid."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7007, file=file, original_exception=original_exception, message=message
        )


class OCIInvalidCompartmentError(OCIBaseException):
    """Exception raised when OCI compartment is invalid."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7008, file=file, original_exception=original_exception, message=message
        )


class OCIInvalidTenancyError(OCIBaseException):
    """Exception raised when OCI tenancy is invalid."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7009, file=file, original_exception=original_exception, message=message
        )


class OCIServiceError(OCIBaseException):
    """Exception raised when OCI service error occurs."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7010, file=file, original_exception=original_exception, message=message
        )


class OCIInstancePrincipalError(OCIBaseException):
    """Exception raised when OCI instance principal authentication fails."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7011, file=file, original_exception=original_exception, message=message
        )


class OCIInvalidOCIDError(OCIBaseException):
    """Exception raised when OCI OCID format is invalid."""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            7012, file=file, original_exception=original_exception, message=message
        )
```

--------------------------------------------------------------------------------

---[FILE: arguments.py]---
Location: prowler-master/prowler/providers/oraclecloud/lib/arguments/arguments.py

```python
from argparse import ArgumentTypeError, Namespace
from re import match

from prowler.providers.oraclecloud.config import OCI_DEFAULT_CONFIG_FILE, OCI_REGIONS


def init_parser(self):
    """Init the Oracle Cloud Infrastructure Provider CLI parser"""
    oci_parser = self.subparsers.add_parser(
        "oraclecloud",
        parents=[self.common_providers_parser],
        help="Oracle Cloud Infrastructure Provider",
    )

    # Config File Authentication Options
    oci_config_subparser = oci_parser.add_argument_group("Config File Authentication")
    oci_config_subparser.add_argument(
        "--oci-config-file",
        "-cf",
        nargs="?",
        default=None,
        help=f"OCI config file path. Defaults to {OCI_DEFAULT_CONFIG_FILE}",
    )
    oci_config_subparser.add_argument(
        "--profile",
        "-p",
        nargs="?",
        default=None,
        help="OCI profile to use from the config file. Defaults to DEFAULT",
    )

    # Instance Principal Authentication
    oci_instance_principal_subparser = oci_parser.add_argument_group(
        "Instance Principal Authentication"
    )
    oci_instance_principal_subparser.add_argument(
        "--use-instance-principal",
        "--instance-principal",
        action="store_true",
        help="Use OCI Instance Principal authentication (only works when running inside an OCI compute instance)",
    )

    # OCI Regions
    oci_regions_subparser = oci_parser.add_argument_group("OCI Regions")
    oci_regions_subparser.add_argument(
        "--region",
        "-r",
        nargs="?",
        help="OCI region to run Prowler against. If not specified, all subscribed regions will be audited",
        choices=list(OCI_REGIONS.keys()),
    )

    # OCI Compartments
    oci_compartments_subparser = oci_parser.add_argument_group("OCI Compartments")
    oci_compartments_subparser.add_argument(
        "--compartment-id",
        "--compartment",
        nargs="+",
        default=None,
        type=validate_compartment_ocid,
        help="OCI compartment OCIDs to audit. If not specified, all compartments in the tenancy will be audited",
    )


def validate_compartment_ocid(ocid: str) -> str:
    """
    Validates that the input compartment OCID is valid.

    Args:
        ocid (str): The compartment OCID to validate.

    Returns:
        str: The validated compartment OCID.

    Raises:
        ArgumentTypeError: If the compartment OCID is invalid.
    """
    # OCID pattern for compartment: ocid1.compartment.<realm>.<region>.<unique_id>
    # or ocid1.tenancy.<realm>.<region>.<unique_id> for root compartment
    ocid_pattern = (
        r"^ocid1\.(compartment|tenancy)\.[a-z0-9_-]+\.[a-z0-9_-]*\.[a-z0-9]+$"
    )

    if match(ocid_pattern, ocid):
        return ocid
    else:
        raise ArgumentTypeError(
            f"Invalid compartment OCID format: {ocid}. "
            "Expected format: ocid1.compartment.<realm>.<region>.<unique_id>"
        )


def validate_arguments(arguments: Namespace) -> tuple[bool, str]:
    """
    validate_arguments returns {True, ""} if the provider arguments passed are valid
    and can be used together. It performs an extra validation, specific for the OCI provider,
    apart from the argparse lib.

    Args:
        arguments (Namespace): The parsed arguments.

    Returns:
        tuple[bool, str]: A tuple containing a boolean indicating validity and an error message.
    """
    # Check if instance principal and config file/profile are used together
    if arguments.use_instance_principal and (
        arguments.oci_config_file or arguments.profile
    ):
        return (
            False,
            "Cannot use --use-instance-principal with --oci-config-file or --profile options",
        )

    return (True, "")
```

--------------------------------------------------------------------------------

---[FILE: mutelist.py]---
Location: prowler-master/prowler/providers/oraclecloud/lib/mutelist/mutelist.py

```python
from prowler.lib.logger import logger
from prowler.lib.mutelist.mutelist import Mutelist
from prowler.lib.outputs.utils import unroll_dict, unroll_tags


class OCIMutelist(Mutelist):
    """
    OCIMutelist class manages the mutelist functionality for OCI provider.

    This class extends the base Mutelist class to provide OCI-specific functionality
    for muting findings based on tenancy, check, region, resource, and tags.
    """

    def __init__(
        self,
        mutelist_content: dict = {},
        mutelist_path: str = None,
        tenancy_id: str = "",
    ) -> "OCIMutelist":
        """
        Initialize the OCIMutelist.

        Args:
            mutelist_content (dict): The mutelist content as a dictionary.
            mutelist_path (str): The path to the mutelist file.
            tenancy_id (str): The OCI tenancy ID.
        """
        self._mutelist = mutelist_content
        self._mutelist_file_path = mutelist_path
        self._tenancy_id = tenancy_id

        if mutelist_path:
            # Load mutelist from local file
            self.get_mutelist_file_from_local_file(mutelist_path)

        if self._mutelist:
            self._mutelist = self.validate_mutelist(self._mutelist)

    def is_finding_muted(
        self,
        finding,
        tenancy_id: str,
    ) -> bool:
        """
        Check if a finding is muted based on the mutelist.

        Args:
            finding: The finding object to check (should have check_metadata, region, resource_id, resource_tags).
            tenancy_id (str): The OCI tenancy ID.

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
                resource_tags = unroll_dict(unroll_tags(finding.resource_tags))

            return self.is_muted(
                tenancy_id,
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
        tenancy_id: str,
        check_id: str,
        region: str,
        resource_id: str,
        resource_tags: dict,
    ) -> bool:
        """
        Check if a specific combination is muted.

        Args:
            tenancy_id (str): The OCI tenancy ID.
            check_id (str): The check ID.
            region (str): The OCI region.
            resource_id (str): The resource ID (OCID).
            resource_tags (dict): The resource tags.

        Returns:
            bool: True if muted, False otherwise.
        """
        try:
            if not self._mutelist:
                return False

            # Check if mutelist has Accounts/Tenancies section
            tenancies = self._mutelist.get("Accounts", {})
            if not tenancies:
                # Try with "Tenancies" key for OCI-specific mutelist
                tenancies = self._mutelist.get("Tenancies", {})

            # Check for wildcard or specific tenancy
            tenancy_mutelist = tenancies.get("*", {})
            if tenancy_id in tenancies:
                # Merge with specific tenancy rules
                specific_tenancy = tenancies.get(tenancy_id, {})
                tenancy_mutelist = {**tenancy_mutelist, **specific_tenancy}

            if not tenancy_mutelist:
                return False

            # Get checks for this tenancy
            checks = tenancy_mutelist.get("Checks", {})

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
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return False
```

--------------------------------------------------------------------------------

---[FILE: service.py]---
Location: prowler-master/prowler/providers/oraclecloud/lib/service/service.py

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.oraclecloud_provider import OraclecloudProvider

MAX_WORKERS = 10


class OCIService:
    """
    The OCIService class offers a parent class for each OCI Service to generate:
    - OCI Regional Clients
    - Shared information like the tenancy ID, user ID, and the checks audited
    - OCI Session configuration
    - Thread pool for the __threading_call__
    - Handles compartment traversal
    """

    def __init__(self, service: str, provider: OraclecloudProvider):
        """
        Initialize the OCIService base class.

        Args:
            service (str): The OCI service name (e.g., 'compute', 'object_storage').
            provider (OraclecloudProvider): The Oracle Cloud Infrastructure provider instance.
        """
        # Audit Information
        self.provider = provider
        self.audited_tenancy = provider.identity.tenancy_id
        self.audited_user = provider.identity.user_id
        self.audited_regions = provider.regions
        self.audited_compartments = provider.compartments
        self.audited_checks = provider.audit_metadata.expected_checks
        self.audit_config = provider.audit_config
        self.fixer_config = provider.fixer_config

        # OCI Session
        self.session_config = provider.session.config
        self.session_signer = provider.session.signer

        # Service name
        self.service = service.lower() if not service.islower() else service

        # Generate Regional Clients
        self.regional_clients = provider.generate_regional_clients(self.service)

        # Thread pool for __threading_call__
        self.thread_pool = ThreadPoolExecutor(max_workers=MAX_WORKERS)

    def __get_session_config__(self):
        """Get the OCI session configuration."""
        return self.session_config

    def __get_session_signer__(self):
        """Get the OCI session signer."""
        return self.session_signer

    def __threading_call__(self, call, iterator=None):
        """
        Execute a function across multiple items using threading.

        Args:
            call (callable): The function to call for each item.
            iterator (list, optional): A list of items to process. Defaults to regional clients.
        """
        # Use the provided iterator, or default to self.regional_clients
        items = (
            iterator if iterator is not None else list(self.regional_clients.values())
        )
        # Determine the total count for logging
        item_count = len(items)

        # Trim leading and trailing underscores from the call's name
        call_name = call.__name__.strip("_")
        # Add Capitalization
        call_name = " ".join([x.capitalize() for x in call_name.split("_")])

        # Print a message based on the call's name, and if its regional or processing a list of items
        if iterator is None:
            logger.info(
                f"{self.service.upper()} - Starting threads for '{call_name}' function across {item_count} regions..."
            )
        else:
            logger.info(
                f"{self.service.upper()} - Starting threads for '{call_name}' function to process {item_count} items..."
            )

        # Submit tasks to the thread pool
        futures = [self.thread_pool.submit(call, item) for item in items]

        # Wait for all tasks to complete
        for future in as_completed(futures):
            try:
                future.result()  # Raises exceptions from the thread, if any
            except Exception as error:
                logger.error(
                    f"{self.service.upper()} - Error in threaded execution: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def __threading_call_by_compartment__(self, call):
        """
        Execute a function for each compartment using threading.

        Args:
            call (callable): The function to call for each compartment.
                            The function should accept a compartment object.
        """
        # Use compartments as the iterator
        compartments = self.audited_compartments
        compartment_count = len(compartments)

        # Trim leading and trailing underscores from the call's name
        call_name = call.__name__.strip("_")
        # Add Capitalization
        call_name = " ".join([x.capitalize() for x in call_name.split("_")])

        logger.info(
            f"{self.service.upper()} - Starting threads for '{call_name}' function across {compartment_count} compartments..."
        )

        # Submit tasks to the thread pool
        futures = [
            self.thread_pool.submit(call, compartment) for compartment in compartments
        ]

        # Wait for all tasks to complete
        for future in as_completed(futures):
            try:
                future.result()  # Raises exceptions from the thread, if any
            except Exception as error:
                logger.error(
                    f"{self.service.upper()} - Error in compartment threaded execution: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def __threading_call_by_region_and_compartment__(self, call):
        """
        Execute a function for each region and compartment combination using threading.

        Args:
            call (callable): The function to call for each (region, compartment) pair.
                            The function should accept region and compartment as parameters.
        """
        # Create combinations of regions and compartments
        region_compartment_pairs = [
            (region, compartment)
            for region in self.audited_regions
            for compartment in self.audited_compartments
        ]

        pair_count = len(region_compartment_pairs)

        # Trim leading and trailing underscores from the call's name
        call_name = call.__name__.strip("_")
        # Add Capitalization
        call_name = " ".join([x.capitalize() for x in call_name.split("_")])

        logger.info(
            f"{self.service.upper()} - Starting threads for '{call_name}' function across {pair_count} region-compartment pairs..."
        )

        # Submit tasks to the thread pool
        futures = [
            self.thread_pool.submit(call, region, compartment)
            for region, compartment in region_compartment_pairs
        ]

        # Wait for all tasks to complete
        for future in as_completed(futures):
            try:
                future.result()  # Raises exceptions from the thread, if any
            except Exception as error:
                logger.error(
                    f"{self.service.upper()} - Error in region-compartment threaded execution: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def get_client_for_region(self, region_key: str):
        """
        Get the OCI service client for a specific region.

        Args:
            region_key (str): The region key (e.g., 'us-ashburn-1').

        Returns:
            The OCI service client for the region, or None if not found.
        """
        return self.regional_clients.get(region_key)

    def _create_oci_client(self, client_class, config_overrides=None, **kwargs):
        """
        Create an OCI SDK client with proper authentication handling.

        Args:
            client_class: The OCI SDK client class to instantiate
            config_overrides: Optional dict to merge with session_config (e.g., {"region": "us-ashburn-1"})
            **kwargs: Additional arguments to pass to the client constructor

        Returns:
            An instance of the OCI SDK client

        This helper method handles the different authentication methods:
        - API Key: signer is None, SDK uses key_file from config
        - Session Token: signer is SecurityTokenSigner
        - Instance Principal: signer is InstancePrincipalsSecurityTokenSigner
        """
        # Merge config overrides if provided
        config = {**self.session_config, **(config_overrides or {})}

        # Only pass signer if it's not None
        # For API key auth, signer is None and the SDK uses the key from config
        if self.session_signer:
            return client_class(config=config, signer=self.session_signer, **kwargs)
        else:
            return client_class(config=config, **kwargs)
```

--------------------------------------------------------------------------------

---[FILE: analytics_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/analytics/analytics_client.py

```python
"""OCI Analytics client."""

from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.analytics.analytics_service import Analytics

analytics_client = Analytics(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: analytics_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/analytics/analytics_service.py
Signals: Pydantic

```python
"""OCI Analytics service."""

from typing import Optional

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class Analytics(OCIService):
    """OCI Analytics service class."""

    def __init__(self, provider):
        """Initialize Analytics service."""
        super().__init__("analytics", provider)
        self.analytics_instances = []
        self.__threading_call_by_region_and_compartment__(
            self.__list_analytics_instances__
        )

    def __get_client__(self, region: str) -> oci.analytics.AnalyticsClient:
        """Get OCI Analytics client for a region."""
        return self._create_oci_client(
            oci.analytics.AnalyticsClient, config_overrides={"region": region}
        )

    def __list_analytics_instances__(self, region, compartment):
        """List all analytics instances in a compartment."""
        try:
            region_key = region.key if hasattr(region, "key") else str(region)
            analytics_client = self.__get_client__(region_key)

            instances = oci.pagination.list_call_get_all_results(
                analytics_client.list_analytics_instances, compartment_id=compartment.id
            ).data

            for instance in instances:
                # Only include ACTIVE or INACTIVE or UPDATING instances
                if instance.lifecycle_state in ["ACTIVE", "INACTIVE", "UPDATING"]:
                    # Extract network endpoint details
                    network_endpoint_type = None
                    whitelisted_ips = []

                    if (
                        hasattr(instance, "network_endpoint_details")
                        and instance.network_endpoint_details
                    ):
                        network_endpoint_type = getattr(
                            instance.network_endpoint_details,
                            "network_endpoint_type",
                            None,
                        )
                        whitelisted_ips = (
                            getattr(
                                instance.network_endpoint_details, "whitelisted_ips", []
                            )
                            or []
                        )

                    self.analytics_instances.append(
                        AnalyticsInstance(
                            id=instance.id,
                            name=instance.name,
                            compartment_id=instance.compartment_id,
                            region=region_key,
                            lifecycle_state=instance.lifecycle_state,
                            network_endpoint_type=network_endpoint_type,
                            whitelisted_ips=whitelisted_ips,
                            description=getattr(instance, "description", None),
                            email_notification=getattr(
                                instance, "email_notification", None
                            ),
                            feature_set=getattr(instance, "feature_set", None),
                            service_url=getattr(instance, "service_url", None),
                        )
                    )

        except Exception as error:
            logger.error(
                f"{region_key if 'region_key' in locals() else region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class AnalyticsInstance(BaseModel):
    """OCI Analytics Instance model."""

    id: str
    name: str
    compartment_id: str
    region: str
    lifecycle_state: str
    network_endpoint_type: Optional[str]
    whitelisted_ips: list[str]
    description: Optional[str] = None
    email_notification: Optional[str] = None
    feature_set: Optional[str] = None
    service_url: Optional[str] = None
```

--------------------------------------------------------------------------------

---[FILE: analytics_instance_access_restricted.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/analytics/analytics_instance_access_restricted/analytics_instance_access_restricted.metadata.json
Signals: Next.js

```json
{
  "Provider": "oraclecloud",
  "CheckID": "analytics_instance_access_restricted",
  "CheckTitle": "Oracle Analytics Cloud instance is deployed within a Virtual Cloud Network or restricts public access to allowed sources",
  "CheckType": [],
  "ServiceName": "analytics",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AnalyticsInstance",
  "Description": "Oracle Analytics Cloud endpoints are evaluated for **network exposure**. Public endpoints must use **restricted allowlists** of specific IPs/CIDRs; presence of `0.0.0.0/0` or no allowed sources indicates unrestricted access. Instances using a **VCN/private endpoint** or public endpoints limited to specific sources align with the intended exposure model.",
  "Risk": "Unrestricted OAC endpoints allow Internet-wide access to the login surface, enabling **credential stuffing** and **brute force**. Account takeover can expose **reports and data sources** (**confidentiality**), permit **dashboard/model changes** (**integrity**), and support **lateral movement** into connected systems.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.public.content.oci.oraclecloud.com/en-us/iaas/analytics-cloud/doc/public-endpoints-and-access-control-rules.html",
    "https://docs.oracle.com/en/cloud/paas/analytics-cloud/acsds/connect-databases-deployed-public-ip-address.html",
    "https://docs.oracle.com/en/cloud/paas/analytics-cloud/acoci/top-faqs-public-or-private-endpoint-security.html",
    "https://docs.oracle.com/en/cloud/paas/analytics-cloud/acoci/manage-ingress-access-rules-public-endpoint-using-console.html",
    "https://docs.oracle.com/en-us/iaas/analytics-cloud/doc/public-endpoints-and-access-control-rules.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. In OCI Console, go to Analytics & AI > Analytics Cloud and select your instance\n2. On Instance Details, under Network Access, click Edit next to Access Control\n3. Remove any 0.0.0.0/0 entry (if present)\n4. Add an access rule with the specific allowed public IP or CIDR\n5. Click Save",
      "Terraform": "```hcl\nresource \"oci_analytics_analytics_instance\" \"example\" {\n  compartment_id    = \"<example_resource_id>\"\n  name              = \"<example_resource_name>\"\n  feature_set       = \"ENTERPRISE_ANALYTICS\"\n  license_type      = \"LICENSE_INCLUDED\"\n  idcs_access_token = \"<example_resource_id>\"\n\n  capacity {\n    capacity_type  = \"OLPU_COUNT\"\n    capacity_value = 1\n  }\n\n  network_endpoint_details {\n    network_endpoint_type = \"PUBLIC\"\n    whitelisted_ips       = [\"<example_resource_id>\"] # Critical: restrict to specific allowed CIDR; not 0.0.0.0/0\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Prefer **private deployment in a VCN** and apply **least privilege** network access. *If public is required*, enforce **allowlists** to specific IPs/CIDRs and never include `0.0.0.0/0`. Use **private access channels/service gateways**, require **MFA/SSO**, and apply **defense in depth** (WAF, audit monitoring) to reduce exposure.",
      "Url": "https://hub.prowler.com/check/analytics_instance_access_restricted"
    }
  },
  "Categories": [
    "internet-exposed",
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: analytics_instance_access_restricted.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/analytics/analytics_instance_access_restricted/analytics_instance_access_restricted.py

```python
"""Check Ensure Oracle Analytics Cloud (OAC) access is restricted to allowed sources or deployed within a Virtual Cloud Network."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.analytics.analytics_client import (
    analytics_client,
)


class analytics_instance_access_restricted(Check):
    """Check Ensure Oracle Analytics Cloud (OAC) access is restricted to allowed sources or deployed within a Virtual Cloud Network."""

    def execute(self) -> Check_Report_OCI:
        """Execute the analytics_instance_access_restricted check."""
        findings = []

        for instance in analytics_client.analytics_instances:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=instance,
                region=instance.region,
                resource_name=instance.name,
                resource_id=instance.id,
                compartment_id=instance.compartment_id,
            )

            # Check if instance has PUBLIC network endpoint type
            if (
                instance.network_endpoint_type
                and instance.network_endpoint_type.upper() == "PUBLIC"
            ):
                # Check if whitelisted IPs are configured
                if not instance.whitelisted_ips:
                    report.status = "FAIL"
                    report.status_extended = f"Analytics instance {instance.name} has public access with no whitelisted IPs configured."
                # Check if 0.0.0.0/0 is in whitelisted IPs
                elif "0.0.0.0/0" in instance.whitelisted_ips:
                    report.status = "FAIL"
                    report.status_extended = f"Analytics instance {instance.name} has public access with unrestricted IP range (0.0.0.0/0)."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Analytics instance {instance.name} has public access with restricted whitelisted IPs."
            else:
                report.status = "PASS"
                report.status_extended = f"Analytics instance {instance.name} is deployed within a VCN or has restricted access."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: audit_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/audit/audit_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.audit.audit_service import Audit

audit_client = Audit(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: audit_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/audit/audit_service.py
Signals: Pydantic

```python
"""OCI Audit Service Module."""

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class Audit(OCIService):
    """OCI Audit Service class."""

    def __init__(self, provider):
        """Initialize the Audit service."""
        super().__init__("audit", provider)
        self.configuration = None
        self.__get_configuration__()

    def __get_configuration__(self):
        """Get Audit configuration."""
        try:
            audit_client = self._create_oci_client(oci.audit.AuditClient)

            logger.info("Audit - Getting Configuration...")

            try:
                config = audit_client.get_configuration(
                    compartment_id=self.audited_tenancy
                ).data

                self.configuration = AuditConfiguration(
                    compartment_id=self.audited_tenancy,
                    retention_period_days=(
                        config.retention_period_days
                        if hasattr(config, "retention_period_days")
                        else 90
                    ),
                )
            except Exception as error:
                logger.error(
                    f"Audit - Error getting audit configuration: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                self.configuration = AuditConfiguration(
                    compartment_id=self.audited_tenancy, retention_period_days=90
                )
        except Exception as error:
            logger.error(
                f"Audit - Error in audit service initialization: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


# Service Models
class AuditConfiguration(BaseModel):
    """OCI Audit Configuration model."""

    compartment_id: str
    retention_period_days: int = 90
```

--------------------------------------------------------------------------------

````
