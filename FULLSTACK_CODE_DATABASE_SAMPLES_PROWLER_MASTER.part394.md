---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 394
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 394 of 867)

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

---[FILE: mongodbatlas_provider.py]---
Location: prowler-master/prowler/providers/mongodbatlas/mongodbatlas_provider.py

```python
import os
from os import environ

from colorama import Fore, Style

from prowler.config.config import (
    default_config_file_path,
    get_default_mute_file_path,
    load_and_validate_config_file,
)
from prowler.lib.logger import logger
from prowler.lib.mutelist.mutelist import Mutelist
from prowler.lib.utils.utils import print_boxes
from prowler.providers.common.models import Audit_Metadata, Connection
from prowler.providers.common.provider import Provider
from prowler.providers.mongodbatlas.exceptions.exceptions import (
    MongoDBAtlasAuthenticationError,
    MongoDBAtlasCredentialsError,
    MongoDBAtlasIdentityError,
    MongoDBAtlasInvalidOrganizationIdError,
    MongoDBAtlasSessionError,
)
from prowler.providers.mongodbatlas.lib.mutelist.mutelist import MongoDBAtlasMutelist
from prowler.providers.mongodbatlas.models import (
    MongoDBAtlasIdentityInfo,
    MongoDBAtlasSession,
)


class MongodbatlasProvider(Provider):
    """
    MongoDB Atlas Provider class

    This class is responsible for setting up the MongoDB Atlas provider,
    including the session, identity, audit configuration, and mutelist.
    """

    _type: str = "mongodbatlas"
    _session: MongoDBAtlasSession
    _identity: MongoDBAtlasIdentityInfo
    _audit_config: dict
    _mutelist: Mutelist
    audit_metadata: Audit_Metadata

    def __init__(
        self,
        # Authentication credentials
        atlas_public_key: str = "",
        atlas_private_key: str = "",
        # Provider configuration
        config_path: str = None,
        config_content: dict = None,
        fixer_config: dict = {},
        mutelist_path: str = None,
        mutelist_content: dict = None,
        # Optional filters
        atlas_project_id: str = None,
        atlas_organization_id: str = None,
    ):
        """
        MongoDB Atlas Provider constructor

        Args:
            atlas_public_key: MongoDB Atlas API public key
            atlas_private_key: MongoDB Atlas API private key
            config_path: Path to the audit configuration file
            config_content: Audit configuration content
            fixer_config: Fixer configuration content
            mutelist_path: Path to the mutelist file
            mutelist_content: Mutelist content
            atlas_project_id: Project ID to filter
            atlas_organization_id: Organization ID
        """
        logger.info("Instantiating MongoDB Atlas Provider...")

        self._session = MongodbatlasProvider.setup_session(
            atlas_public_key,
            atlas_private_key,
        )

        self._identity = MongodbatlasProvider.setup_identity(self._session)

        # Store filter options
        self._project_id = atlas_project_id
        self._organization_id = atlas_organization_id

        # Audit Config
        if config_content:
            self._audit_config = config_content
        else:
            if not config_path:
                config_path = default_config_file_path
            self._audit_config = load_and_validate_config_file(self._type, config_path)

        # Fixer Config
        self._fixer_config = fixer_config

        # Mutelist
        if mutelist_content:
            self._mutelist = MongoDBAtlasMutelist(
                mutelist_content=mutelist_content,
            )
        else:
            if not mutelist_path:
                mutelist_path = get_default_mute_file_path(self.type)
            self._mutelist = MongoDBAtlasMutelist(
                mutelist_path=mutelist_path,
            )

        Provider.set_global_provider(self)

    @property
    def type(self):
        """Returns the type of the MongoDB Atlas provider"""
        return self._type

    @property
    def session(self):
        """Returns the session object for the MongoDB Atlas provider"""
        return self._session

    @property
    def identity(self):
        """Returns the identity information for the MongoDB Atlas provider"""
        return self._identity

    @property
    def audit_config(self):
        """Returns the audit configuration for the MongoDB Atlas provider"""
        return self._audit_config

    @property
    def fixer_config(self):
        """Returns the fixer configuration for the MongoDB Atlas provider"""
        return self._fixer_config

    @property
    def mutelist(self) -> MongoDBAtlasMutelist:
        """Returns the mutelist for the MongoDB Atlas provider"""
        return self._mutelist

    @property
    def project_id(self):
        """Returns the project ID filter"""
        return self._project_id

    @staticmethod
    def setup_session(
        atlas_public_key: str = None,
        atlas_private_key: str = None,
    ) -> MongoDBAtlasSession:
        """
        Setup MongoDB Atlas session with authentication credentials

        Args:
            atlas_public_key: MongoDB Atlas API public key
            atlas_private_key: MongoDB Atlas API private key

        Returns:
            MongoDBAtlasSession: Authenticated session for API requests

        Raises:
            MongoDBAtlasCredentialsError: If credentials are missing
            MongoDBAtlasSessionError: If session setup fails
        """
        try:
            public_key = atlas_public_key
            private_key = atlas_private_key

            # Check environment variables if not provided
            if not public_key:
                public_key = environ.get("ATLAS_PUBLIC_KEY", "")
            if not private_key:
                private_key = environ.get("ATLAS_PRIVATE_KEY", "")

            if not public_key or not private_key:
                raise MongoDBAtlasCredentialsError(
                    file=os.path.basename(__file__),
                    message="MongoDB Atlas API credentials not found. Please provide --atlas-public-key and --atlas-private-key or set ATLAS_PUBLIC_KEY and ATLAS_PRIVATE_KEY environment variables.",
                )

            session = MongoDBAtlasSession(
                public_key=public_key,
                private_key=private_key,
            )

            return session

        except MongoDBAtlasCredentialsError:
            raise
        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}] -- {error}"
            )
            raise MongoDBAtlasSessionError(
                original_exception=error,
            )

    @staticmethod
    def setup_identity(session: MongoDBAtlasSession) -> MongoDBAtlasIdentityInfo:
        """
        Setup MongoDB Atlas identity information

        Args:
            session: MongoDB Atlas session

        Returns:
            MongoDBAtlasIdentityInfo: Identity information

        Raises:
            MongoDBAtlasAuthenticationError: If authentication fails
            MongoDBAtlasIdentityError: If identity setup fails
        """
        try:
            import requests
            from requests.auth import HTTPDigestAuth

            # Test authentication by getting organizations
            auth = HTTPDigestAuth(session.public_key, session.private_key)
            headers = {
                "Accept": "application/vnd.atlas.2023-01-01+json",
                "Content-Type": "application/json",
            }

            response = requests.get(
                f"{session.base_url}/orgs",
                auth=auth,
                headers=headers,
                timeout=30,
            )

            if response.status_code == 401:
                raise MongoDBAtlasAuthenticationError(
                    file=os.path.basename(__file__),
                    message="MongoDB Atlas authentication failed. Please check your API credentials.",
                )

            response.raise_for_status()
            organizations_data = response.json()

            # Extract organization information from the response
            if (
                organizations_data
                and "results" in organizations_data
                and len(organizations_data["results"]) > 0
            ):
                org = organizations_data["results"][0]
                org_id = org.get("id", "")
                org_name = org.get("name", "Unknown Organization")

                identity = MongoDBAtlasIdentityInfo(
                    organization_id=org_id,  # Use organization ID as user_id
                    organization_name=org_name,  # Use organization name as username
                    roles=[
                        "ORGANIZATION_ADMIN"
                    ],  # Indicate this is an organization-level access
                )
            else:
                # Use public key as identifier and create a username from public key if no organizations found
                identity = MongoDBAtlasIdentityInfo(
                    organization_id=session.public_key,  # Use public key as identifier
                    organization_name=f"api-key-{session.public_key[:8]}",  # Create a username from public key
                    roles=["API_KEY"],  # Indicate this is an API key authentication
                )

            return identity

        except MongoDBAtlasAuthenticationError:
            raise
        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}] -- {error}"
            )
            raise MongoDBAtlasIdentityError(
                original_exception=error,
            )

    def print_credentials(self):
        """Print the MongoDB Atlas credentials"""
        report_lines = [
            f"MongoDB Atlas Organization ID: {Fore.YELLOW}{self.identity.organization_id}{Style.RESET_ALL}",
        ]

        if self.project_id:
            report_lines.append(
                f"Project ID Filter: {Fore.YELLOW}{self.project_id}{Style.RESET_ALL}"
            )

        report_title = (
            f"{Style.BRIGHT}Using the MongoDB Atlas credentials below:{Style.RESET_ALL}"
        )
        print_boxes(report_lines, report_title)

    @staticmethod
    def test_connection(
        atlas_public_key: str = "",
        atlas_private_key: str = "",
        raise_on_exception: bool = True,
        provider_id: str = None,
    ) -> Connection:
        """
        Test connection to MongoDB Atlas

        Args:
            atlas_public_key: MongoDB Atlas API public key
            atlas_private_key: MongoDB Atlas API private key
            raise_on_exception: Whether to raise exceptions
            provider_id: MongoDB Atlas project ID to validate access (added for API compatibility)
        Returns:
            Connection: Connection status
        """
        try:
            session = MongodbatlasProvider.setup_session(
                atlas_public_key=atlas_public_key,
                atlas_private_key=atlas_private_key,
            )

            identity = MongodbatlasProvider.setup_identity(session)

            if provider_id and identity.organization_id != provider_id:
                raise MongoDBAtlasInvalidOrganizationIdError(
                    file=os.path.basename(__file__),
                    message=f"The provided credentials do not have access to the organization with the provided ID: {provider_id}",
                )

            return Connection(is_connected=True)
        except MongoDBAtlasInvalidOrganizationIdError:
            raise
        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            if raise_on_exception:
                raise error
            return Connection(error=error)
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: prowler-master/prowler/providers/mongodbatlas/exceptions/exceptions.py

```python
from prowler.exceptions.exceptions import ProwlerException


# Exceptions codes from 8000 to 8999 are reserved for MongoDB Atlas exceptions
class MongoDBAtlasBaseException(ProwlerException):
    """Base class for MongoDB Atlas Errors."""

    MONGODBATLAS_ERROR_CODES = {
        (8000, "MongoDBAtlasCredentialsError"): {
            "message": "MongoDB Atlas credentials not found or invalid",
            "remediation": "Check the MongoDB Atlas API credentials and ensure they are properly set.",
        },
        (8001, "MongoDBAtlasAuthenticationError"): {
            "message": "MongoDB Atlas authentication failed",
            "remediation": "Check the MongoDB Atlas API credentials and ensure they are valid.",
        },
        (8002, "MongoDBAtlasSessionError"): {
            "message": "MongoDB Atlas session setup failed",
            "remediation": "Check the session setup and ensure it is properly configured.",
        },
        (8003, "MongoDBAtlasIdentityError"): {
            "message": "MongoDB Atlas identity setup failed",
            "remediation": "Check credentials and ensure they are properly set up for MongoDB Atlas.",
        },
        (8004, "MongoDBAtlasAPIError"): {
            "message": "MongoDB Atlas API call failed",
            "remediation": "Check the API request and ensure it is properly formatted.",
        },
        (8005, "MongoDBAtlasRateLimitError"): {
            "message": "MongoDB Atlas API rate limit exceeded",
            "remediation": "Reduce the number of API requests or wait before making more requests.",
        },
        (8006, "MongoDBAtlasInvalidOrganizationIdError"): {
            "message": "The provided credentials do not have access to the organization with the provided ID",
            "remediation": "Check the organization ID and ensure it is a valid organization ID and that the credentials have access to it.",
        },
    }

    def __init__(self, code, file=None, original_exception=None, message=None):
        provider = "MongoDB Atlas"
        error_info = self.MONGODBATLAS_ERROR_CODES.get((code, self.__class__.__name__))
        if message:
            error_info["message"] = message
        super().__init__(
            code=code,
            source=provider,
            file=file,
            original_exception=original_exception,
            error_info=error_info,
        )


class MongoDBAtlasCredentialsError(MongoDBAtlasBaseException):
    """Exception for MongoDB Atlas credentials errors"""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            code=8000,
            file=file,
            original_exception=original_exception,
            message=message,
        )


class MongoDBAtlasAuthenticationError(MongoDBAtlasBaseException):
    """Exception for MongoDB Atlas authentication errors"""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            code=8001,
            file=file,
            original_exception=original_exception,
            message=message,
        )


class MongoDBAtlasSessionError(MongoDBAtlasBaseException):
    """Exception for MongoDB Atlas session setup errors"""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            code=8002,
            file=file,
            original_exception=original_exception,
            message=message,
        )


class MongoDBAtlasIdentityError(MongoDBAtlasBaseException):
    """Exception for MongoDB Atlas identity setup errors"""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            code=8003,
            file=file,
            original_exception=original_exception,
            message=message,
        )


class MongoDBAtlasAPIError(MongoDBAtlasBaseException):
    """Exception for MongoDB Atlas API errors"""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            code=8004,
            file=file,
            original_exception=original_exception,
            message=message,
        )


class MongoDBAtlasRateLimitError(MongoDBAtlasBaseException):
    """Exception for MongoDB Atlas rate limit errors"""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            code=8005,
            file=file,
            original_exception=original_exception,
            message=message,
        )


class MongoDBAtlasInvalidOrganizationIdError(MongoDBAtlasBaseException):
    """Exception for MongoDB Atlas invalid organization ID errors"""

    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            code=8006,
            file=file,
            original_exception=original_exception,
            message=message,
        )
```

--------------------------------------------------------------------------------

---[FILE: arguments.py]---
Location: prowler-master/prowler/providers/mongodbatlas/lib/arguments/arguments.py

```python
def init_parser(self):
    """Initialize the MongoDB Atlas Provider CLI parser"""
    mongodbatlas_parser = self.subparsers.add_parser(
        "mongodbatlas",
        parents=[self.common_providers_parser],
        help="MongoDB Atlas Provider",
    )

    mongodbatlas_auth_subparser = mongodbatlas_parser.add_argument_group(
        "Authentication Modes"
    )

    mongodbatlas_auth_subparser.add_argument(
        "--atlas-public-key",
        nargs="?",
        help="MongoDB Atlas API public key",
        default=None,
        metavar="ATLAS_PUBLIC_KEY",
    )

    mongodbatlas_auth_subparser.add_argument(
        "--atlas-private-key",
        nargs="?",
        help="MongoDB Atlas API private key",
        default=None,
        metavar="ATLAS_PRIVATE_KEY",
    )

    mongodbatlas_filters_subparser = mongodbatlas_parser.add_argument_group(
        "Optional Filters"
    )

    mongodbatlas_filters_subparser.add_argument(
        "--atlas-project-id",
        nargs="?",
        help="MongoDB Atlas Project ID to filter scans to a specific project",
        default=None,
        metavar="ATLAS_PROJECT_ID",
    )


def validate_arguments(arguments):
    """Validate MongoDB Atlas provider arguments"""
    # No specific validation needed for MongoDB Atlas arguments currently
    return (True, "")
```

--------------------------------------------------------------------------------

---[FILE: mutelist.py]---
Location: prowler-master/prowler/providers/mongodbatlas/lib/mutelist/mutelist.py

```python
from prowler.lib.check.models import CheckReportMongoDBAtlas
from prowler.lib.mutelist.mutelist import Mutelist
from prowler.lib.outputs.utils import unroll_dict, unroll_tags


class MongoDBAtlasMutelist(Mutelist):
    """MongoDB Atlas Mutelist class"""

    def is_finding_muted(
        self,
        finding: CheckReportMongoDBAtlas,
        organization_id: str,
    ) -> bool:
        """
        Check if a finding is muted in the MongoDB Atlas mutelist.

        Args:
            finding: The CheckReportMongoDBAtlas finding
            organization_id: The organization/project id

        Returns:
            bool: True if the finding is muted, False otherwise
        """
        return self.is_muted(
            organization_id,
            finding.check_metadata.CheckID,
            finding.location,  # TODO: Study regions in MongoDB Atlas
            finding.resource_name,
            unroll_dict(unroll_tags(finding.resource_tags)),
        )
```

--------------------------------------------------------------------------------

---[FILE: service.py]---
Location: prowler-master/prowler/providers/mongodbatlas/lib/service/service.py

```python
import time
from threading import current_thread
from typing import Any, Dict, List, Optional

import requests
from requests.auth import HTTPDigestAuth

from prowler.lib.logger import logger
from prowler.providers.mongodbatlas.exceptions.exceptions import (
    MongoDBAtlasAPIError,
    MongoDBAtlasRateLimitError,
)


class MongoDBAtlasService:
    """Base class for MongoDB Atlas services"""

    def __init__(self, service_name: str, provider):
        self.service_name = service_name
        self.provider = provider
        self.session = provider.session
        self.base_url = provider.session.base_url
        self.audit_config = provider.audit_config
        self.auth = HTTPDigestAuth(
            provider.session.public_key, provider.session.private_key
        )
        self.headers = {
            "Accept": "application/vnd.atlas.2025-01-01+json",
            "Content-Type": "application/json",
        }

    def _make_request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        data: Optional[Dict] = None,
        max_retries: int = 3,
        retry_delay: int = 1,
    ) -> Dict[str, Any]:
        """
        Make HTTP request to MongoDB Atlas API with retry logic

        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint (without base URL)
            params: Query parameters
            data: Request body data
            max_retries: Maximum number of retries
            retry_delay: Delay between retries in seconds

        Returns:
            dict: Response JSON data

        Raises:
            MongoDBAtlasAPIError: If the API request fails
            MongoDBAtlasRateLimitError: If rate limit is exceeded
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        for attempt in range(max_retries + 1):
            try:
                response = requests.request(
                    method=method,
                    url=url,
                    auth=self.auth,
                    headers=self.headers,
                    params=params,
                    json=data,
                    timeout=30,
                )

                if response.status_code == 429:
                    if attempt < max_retries:
                        logger.warning(
                            f"Rate limit exceeded for {url}, retrying in {retry_delay} seconds..."
                        )
                        time.sleep(retry_delay)
                        retry_delay *= 2
                        continue
                    else:
                        raise MongoDBAtlasRateLimitError(
                            message=f"Rate limit exceeded for {url} after {max_retries} retries"
                        )

                response.raise_for_status()
                return response.json()

            except requests.exceptions.RequestException as e:
                if attempt < max_retries:
                    logger.warning(
                        f"Request failed for {url}, retrying in {retry_delay} seconds: {str(e)}"
                    )
                    time.sleep(retry_delay)
                    retry_delay *= 2
                    continue
                else:
                    logger.error(
                        f"Request failed for {url} after {max_retries} retries: {str(e)}"
                    )
                    raise MongoDBAtlasAPIError(
                        original_exception=e,
                        message=f"Failed to make request to {url}: {str(e)}",
                    )

    def _paginate_request(
        self,
        endpoint: str,
        params: Optional[Dict] = None,
        page_size: int = 100,
        max_pages: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Make paginated requests to MongoDB Atlas API

        Args:
            endpoint: API endpoint
            params: Query parameters
            page_size: Number of items per page
            max_pages: Maximum number of pages to fetch

        Returns:
            list: List of all items from all pages
        """
        if params is None:
            params = {}

        params.update({"pageNum": 1, "itemsPerPage": page_size})

        all_items = []
        page_num = 1

        while True:
            params["pageNum"] = page_num

            try:
                response = self._make_request("GET", endpoint, params=params)

                if "results" in response:
                    items = response["results"]
                    all_items.extend(items)

                    total_count = response.get("totalCount", 0)

                    if len(items) < page_size or len(all_items) >= total_count:
                        break

                    if max_pages and page_num >= max_pages:
                        logger.warning(
                            f"Reached maximum pages limit ({max_pages}) for {endpoint}"
                        )
                        break

                    page_num += 1
                else:
                    break

            except Exception as e:
                logger.error(
                    f"Error during pagination for {endpoint} at page {page_num}: {str(e)}"
                )
                break

        logger.info(
            f"Retrieved {len(all_items)} items from {endpoint} across {page_num} pages"
        )

        return all_items

    def _get_thread_info(self) -> str:
        """Get thread information for logging"""
        return f"[{current_thread().name}]"
```

--------------------------------------------------------------------------------

---[FILE: clusters_client.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/clusters/clusters_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.mongodbatlas.services.clusters.clusters_service import Clusters

clusters_client = Clusters(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: clusters_service.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/clusters/clusters_service.py
Signals: Pydantic

```python
from typing import List, Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.mongodbatlas.lib.service.service import MongoDBAtlasService
from prowler.providers.mongodbatlas.mongodbatlas_provider import MongodbatlasProvider
from prowler.providers.mongodbatlas.services.projects.projects_client import (
    projects_client,
)


class Clusters(MongoDBAtlasService):
    """MongoDB Atlas Clusters service"""

    def __init__(self, provider: MongodbatlasProvider):
        super().__init__(__class__.__name__, provider)
        self.clusters = self._list_clusters()

    def _extract_location(self, cluster_data: dict) -> str:
        """
        Extract location from cluster data and convert to lowercase

        Args:
            cluster_data: Cluster data from API

        Returns:
            str: Location in lowercase, empty string if not found
        """
        try:
            replication_specs = cluster_data.get("replicationSpecs", [])
            if replication_specs and len(replication_specs) > 0:
                region_configs = replication_specs[0].get("regionConfigs", [])
                if region_configs and len(region_configs) > 0:
                    region_name = region_configs[0].get("regionName", "")
                    if region_name:
                        return region_name.lower()
        except (KeyError, IndexError, AttributeError):
            pass
        return ""

    def _list_clusters(self):
        """
        List all MongoDB Atlas clusters across all projects

        Returns:
            Dict[str, Cluster]: Dictionary of clusters indexed by cluster name
        """
        logger.info("Clusters - Listing MongoDB Atlas clusters...")
        clusters = {}

        try:
            for project in projects_client.projects.values():
                logger.info(f"Getting clusters for project {project.name}...")
                try:
                    project_clusters = {}
                    clusters_data = self._paginate_request(
                        f"/groups/{project.id}/clusters"
                    )
                    for cluster_data in clusters_data:
                        # Process cluster data
                        cluster_name = cluster_data.get("name", "")

                        # Get encryption provider
                        encryption_provider = None
                        encryption_at_rest = cluster_data.get(
                            "encryptionAtRestProvider"
                        )
                        if encryption_at_rest:
                            encryption_provider = encryption_at_rest
                        else:
                            provider_settings = cluster_data.get("providerSettings", {})
                            encrypt_ebs_volume = provider_settings.get(
                                "encryptEBSVolume", False
                            )
                            if encrypt_ebs_volume:
                                encryption_provider = provider_settings.get(
                                    "providerName", "AWS"
                                )

                        # Get backup status
                        backup_enabled = cluster_data.get("backupEnabled", False)
                        pit_enabled = cluster_data.get("pitEnabled", False)
                        backup_enabled = backup_enabled or pit_enabled

                        # Create cluster object
                        cluster = Cluster(
                            id=cluster_data.get("id", ""),
                            name=cluster_name,
                            project_id=project.id,
                            project_name=project.name,
                            mongo_db_version=cluster_data.get("mongoDBVersion", ""),
                            cluster_type=cluster_data.get("clusterType", ""),
                            state_name=cluster_data.get("stateName", ""),
                            encryption_at_rest_provider=encryption_provider,
                            backup_enabled=backup_enabled,
                            auth_enabled=cluster_data.get("authEnabled", False),
                            ssl_enabled=cluster_data.get("sslEnabled", False),
                            provider_settings=cluster_data.get("providerSettings", {}),
                            replication_specs=cluster_data.get("replicationSpecs", []),
                            disk_size_gb=cluster_data.get("diskSizeGB"),
                            num_shards=cluster_data.get("numShards"),
                            replication_factor=cluster_data.get("replicationFactor"),
                            auto_scaling=cluster_data.get("autoScaling", {}),
                            mongo_db_major_version=cluster_data.get(
                                "mongoDBMajorVersion"
                            ),
                            paused=cluster_data.get("paused", False),
                            pit_enabled=pit_enabled,
                            connection_strings=cluster_data.get(
                                "connectionStrings", {}
                            ),
                            tags=cluster_data.get("tags", []),
                            location=self._extract_location(cluster_data),
                        )

                        # Use a unique key combining project_id and cluster_name
                        cluster_key = f"{project.id}:{cluster.name}"
                        project_clusters[cluster_key] = cluster
                    clusters.update(project_clusters)
                except Exception as error:
                    logger.error(
                        f"Error getting clusters for project {project.name}: {error}"
                    )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        logger.info(f"Found {len(clusters)} MongoDB Atlas clusters")
        return clusters


class Cluster(BaseModel):
    """MongoDB Atlas Cluster model"""

    id: str
    name: str
    project_id: str
    project_name: str
    mongo_db_version: str
    cluster_type: str
    state_name: str
    encryption_at_rest_provider: Optional[str] = None
    backup_enabled: bool = False
    auth_enabled: bool = False
    ssl_enabled: bool = False
    provider_settings: Optional[dict] = {}
    replication_specs: Optional[List[dict]] = []
    disk_size_gb: Optional[float] = None
    num_shards: Optional[int] = None
    replication_factor: Optional[int] = None
    auto_scaling: Optional[dict] = {}
    mongo_db_major_version: Optional[str] = None
    paused: bool = False
    pit_enabled: bool = False
    connection_strings: Optional[dict] = {}
    tags: Optional[List[dict]] = []
    location: Optional[str] = None
```

--------------------------------------------------------------------------------

---[FILE: clusters_authentication_enabled.metadata.json]---
Location: prowler-master/prowler/providers/mongodbatlas/services/clusters/clusters_authentication_enabled/clusters_authentication_enabled.metadata.json

```json
{
  "Provider": "mongodbatlas",
  "CheckID": "clusters_authentication_enabled",
  "CheckTitle": "Ensure MongoDB Atlas clusters have authentication enabled",
  "CheckType": [],
  "ServiceName": "clusters",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "MongoDBAtlasCluster",
  "Description": "Ensure MongoDB Atlas clusters have authentication enabled to prevent unauthorized access",
  "Risk": "Without authentication enabled, MongoDB Atlas clusters may be vulnerable to unauthorized access, potentially exposing sensitive data or allowing malicious actions",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.mongodb.com/docs/atlas/security/config-db-auth/",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable authentication for MongoDB Atlas clusters by setting authEnabled to true in the cluster configuration.",
      "Url": "https://www.mongodb.com/docs/atlas/security/config-db-auth/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: clusters_authentication_enabled.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/clusters/clusters_authentication_enabled/clusters_authentication_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportMongoDBAtlas
from prowler.providers.mongodbatlas.services.clusters.clusters_client import (
    clusters_client,
)


class clusters_authentication_enabled(Check):
    """Check if MongoDB Atlas clusters have authentication enabled

    This class verifies that MongoDB Atlas clusters have authentication
    enabled to prevent unauthorized access to the database.
    """

    def execute(self) -> List[CheckReportMongoDBAtlas]:
        """Execute the MongoDB Atlas cluster authentication enabled check

        Iterates over all clusters and checks if they have authentication
        enabled (authEnabled=true).

        Returns:
            List[CheckReportMongoDBAtlas]: A list of reports for each cluster
        """
        findings = []

        for cluster in clusters_client.clusters.values():
            report = CheckReportMongoDBAtlas(metadata=self.metadata(), resource=cluster)

            if cluster.auth_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"Cluster {cluster.name} in project {cluster.project_name} "
                    f"has authentication enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Cluster {cluster.name} in project {cluster.project_name} "
                    f"does not have authentication enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: clusters_backup_enabled.metadata.json]---
Location: prowler-master/prowler/providers/mongodbatlas/services/clusters/clusters_backup_enabled/clusters_backup_enabled.metadata.json

```json
{
  "Provider": "mongodbatlas",
  "CheckID": "clusters_backup_enabled",
  "CheckTitle": "Ensure MongoDB Atlas clusters have backup enabled",
  "CheckType": [],
  "ServiceName": "clusters",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "MongoDBAtlasCluster",
  "Description": "Ensure MongoDB Atlas clusters have backup enabled to protect against data loss",
  "Risk": "Without backup enabled, MongoDB Atlas clusters are vulnerable to data loss in case of failures, corruption, or accidental deletion",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable backup for MongoDB Atlas clusters by setting backupEnabled to true in the cluster configuration.",
      "Url": "https://www.mongodb.com/docs/atlas/backup-restore-cluster/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: clusters_backup_enabled.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/clusters/clusters_backup_enabled/clusters_backup_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportMongoDBAtlas
from prowler.providers.mongodbatlas.services.clusters.clusters_client import (
    clusters_client,
)


class clusters_backup_enabled(Check):
    """Check if MongoDB Atlas clusters have backup enabled

    This class verifies that MongoDB Atlas clusters have backup enabled
    to protect against data loss.
    """

    def execute(self) -> List[CheckReportMongoDBAtlas]:
        """Execute the MongoDB Atlas cluster backup enabled check

        Iterates over all clusters and checks if they have backup
        enabled (backupEnabled=true).

        Returns:
            List[CheckReportMongoDBAtlas]: A list of reports for each cluster
        """
        findings = []

        for cluster in clusters_client.clusters.values():
            report = CheckReportMongoDBAtlas(metadata=self.metadata(), resource=cluster)

            if cluster.backup_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"Cluster {cluster.name} in project {cluster.project_name} "
                    f"has backup enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Cluster {cluster.name} in project {cluster.project_name} "
                    f"does not have backup enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
