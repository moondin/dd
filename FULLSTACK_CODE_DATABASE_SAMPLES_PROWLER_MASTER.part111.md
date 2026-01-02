---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 111
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 111 of 867)

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

---[FILE: providers.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/tools/providers.py
Signals: Pydantic

```python
"""Provider Management tools for Prowler App MCP Server.

This module provides tools for managing provider connections,
including searching, connecting, and deleting providers.
"""

from typing import Any

from pydantic import Field

from prowler_mcp_server.prowler_app.models.providers import (
    ProviderConnectionStatus,
    ProvidersListResponse,
)
from prowler_mcp_server.prowler_app.tools.base import BaseTool


class ProvidersTools(BaseTool):
    """Tools for provider management operations

    Provides tools for:
    - prowler_app_search_providers: Search and view configured providers with their connection status
    - prowler_app_connect_provider: Connect or register a provider for security scanning in Prowler
    - prowler_app_delete_provider: Permanently remove a provider from Prowler
    """

    async def search_providers(
        self,
        provider_id: list[str] = Field(
            default=[],
            description="Filter by Prowler's internal UUID(s) (v4) for the provider(s), generated when the provider is registered in the system.",
        ),
        provider_uid: list[str] = Field(
            default=[],
            description="Filter by provider's unique identifier(s), this ID is the one provided by the provider itself. Format varies by provider type: AWS Account ID (12 digits), Azure Subscription ID (UUID), GCP Project ID (string), Kubernetes namespace, GitHub username/organization, M365 domain ID, etc. All supported provider types are listed in the Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server",
        ),
        provider_type: list[str] = Field(
            default=[],
            description="Filter by provider type. Valid values include: 'aws', 'azure', 'gcp', 'kubernetes'... For more valid values, please refer to Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server.",
        ),
        alias: str | None = Field(
            default=None,
            description="Search by provider alias/friendly name. Partial match supported (case-insensitive). Use this to find providers by their human-readable name (e.g., 'Production', 'Dev', 'AWS Main')",
        ),
        connected: (
            bool | str | None
        ) = Field(  # Wrong `str` hint type due to bad MCP Clients implementation
            default=None,
            description="Filter by connection status. True returns only successfully connected providers (credentials work), False returns only providers with failed connections (credentials invalid). If not specified, returns all connected, failed and not tested providers. Strings 'true' and 'false' are also accepted.",
        ),
        page_size: int = Field(
            default=50, description="Number of results to return per page"
        ),
        page_number: int = Field(
            default=1,
            description="Page number to retrieve (1-indexed)",
        ),
    ) -> dict[str, Any]:
        """Search and view configured providers to be scanned with Prowler.

        This tool returns a unified view of all providers configured in Prowler.

        For getting more details about what types of providers are available to be scanned with Prowler or
        what are the UIDs are accepted for each provider type, please refer to Prowler Hub/Prowler Documentation
        that you can also find in form of tools in this MCP Server.

        Each provider includes:
        - Provider identification: Prowler Internal ID, External Provider UID, Provider Alias
        - Provider context: Provider Type
        - Connection status: Connected (true), Failed (false), Not Tested (null)
        """
        self.api_client.validate_page_size(page_size)

        params = {
            "fields[providers]": "uid,alias,provider,connection,secret",
            "page[number]": page_number,
            "page[size]": page_size,
        }

        # Build filter parameters
        if provider_id:
            params["filter[id__in]"] = provider_id
        if provider_uid:
            params["filter[uid__in]"] = provider_uid
        if provider_type:
            params["filter[provider__in]"] = provider_type
        if alias:
            params["filter[alias__icontains]"] = alias
        if connected is not None:
            if isinstance(connected, bool):
                params["filter[connected]"] = connected
            else:
                if connected.lower() == "true":
                    params["filter[connected]"] = True
                elif connected.lower() == "false":
                    params["filter[connected]"] = False
                else:
                    raise ValueError(
                        f"Invalid connected value: {connected}. Valid values are True, False, 'true', 'false' or None."
                    )

        clean_params = self.api_client.build_filter_params(params)

        api_response = await self.api_client.get("/providers", params=clean_params)
        simplified_response = ProvidersListResponse.from_api_response(api_response)

        # Fetch secret_type for each provider that has a secret
        for provider in simplified_response.providers:
            # Get the provider data from the API response to access relationships
            provider_data = next(
                (
                    provider_api_response
                    for provider_api_response in api_response["data"]
                    if provider_api_response["id"] == provider.id
                ),
                None,
            )
            if provider_data:
                secret_relationship = provider_data.get("relationships", {}).get(
                    "secret", {}
                )
                secret_data = secret_relationship.get("data")
                if secret_data:
                    secret_id = secret_data["id"]
                    provider.secret_type = await self._get_secret_type(secret_id)

        return simplified_response.model_dump()

    async def connect_provider(
        self,
        provider_uid: str = Field(
            description="Provider's unique identifier. For supported UID provider formats, please refer to Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server"
        ),
        provider_type: str = Field(
            description="Type of provider to be scanned with Prowler. Valid values include: 'aws', 'azure', 'gcp', 'kubernetes'... For more valid values, please refer to Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server."
        ),
        alias: str | None = Field(
            default=None,
            description="Human-friendly name for this provider. Optional but recommended for easy identification. Use descriptive names to distinguish multiple accounts of the same type.",
        ),
        credentials: dict[str, Any] | None = Field(
            default=None,
            description="Provider-specific credentials for authentication. Optional - if not provided, provider is created but not connected. Structure varies by provider type. For supported provider types, please refer to Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server",
        ),
    ) -> dict[str, Any]:
        """Register a provider to be scanned with Prowler.

        This tool will register a provider in Prowler App, even if the UID is wrong.
        If the provider is already registered, it will be updated with the new provided alias or credentials if provided.
        If credentials are provided, they will be added to the indicated provider, if the provider does not exist, it will be created and the credentials will be added to it.
        If the connection test is successful, the provider will be connected.
        If the connection test fails, the provider will be created but not connected.
        The tool always returns the provider details after its registration or update.

        Example Input:
        - AWS Static Credentials:
        ```json
        {
            "provider_uid": "123456789012",
            "provider_type": "aws",
            "alias": "production-aws-account",
            "credentials": {
                "aws_access_key_id": "AKIA...",
                "aws_secret_access_key": "...",
                "aws_session_token": "..."
            }
        }
        ```
        - AWS Assume Role:
        ```json
        {
            "provider_uid": "987654321098",
            "provider_type": "aws",
            "alias": "staging-aws-account",
            "credentials": {
                "role_arn": "arn:aws:iam::987654321098:role/ProwlerScanRole",
                "external_id": "...",
                "aws_access_key_id": "AKIA...",   # Optional
                "aws_secret_access_key": "...",   # Optional
                "aws_session_token": "...",   # Optional
                "session_duration": 3600,   # Optional
                "role_session_name": "..."   # Optional
            }
        }
        ```
        - Azure/M365 Static Credentials:
        ```json
        {
            "provider_uid": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
            "provider_type": "azure",
            "alias": "production-azure-subscription",
            "credentials": {
                "client_id": "...",
                "client_secret": "...",
                "tenant_id": "..."
            }
        }
        ```
        - GCP Service Account Account Key:
        ```json
        {
            "provider_uid": "my-gcp-project-prod",
            "provider_type": "gcp",
            "alias": "production-gcp-project",
            "credentials": {
                "service_account_key": {
                    "type": "service_account",
                    "project_id": "...",
                    "private_key_id": "...",
                    "private_key": "...",
                    "client_email": "...",
                }
            }
        }
        ```
        - Kubernetes Static Credentials:
        ```json
        {
            "provider_uid": "prod-k8s-cluster",
            "provider_type": "kubernetes",
            "alias": "production-kubernetes-cluster",
            "credentials": {
                "kubeconfig_content": "..."
            }
        }
        ```
        - GitHub OAuth App Token:
        ```json
        {
            "provider_uid": "my-organization",
            "provider_type": "github",
            "alias": "my-github-organization",
            "credentials": {
                "oauth_app_token": "..."
            }
        }

        NOTE: THERE ARE MORE PROVIDER TYPES AND CREDENTIAL TYPES AVAILABLE, PLEASE REFER TO THE Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server.
        """
        # Step 1: Check if provider already exists
        prowler_provider_id = await self._check_provider_exists(provider_uid)

        # Step 2: Create or update provider
        if prowler_provider_id is None:
            prowler_provider_id = await self._create_provider(
                provider_uid, provider_type, alias
            )
        elif alias:
            await self._update_provider_alias(prowler_provider_id, alias)

        # Step 3: Handle credentials if provided and capture secret response
        secret_response = None
        if credentials:
            secret_response = await self._store_credentials(
                prowler_provider_id, credentials
            )

        # Step 4: Test connection
        connection_status = await self._test_connection(prowler_provider_id)

        # Step 5: Get final provider state with relationships
        final_provider = await self._get_final_provider_state(prowler_provider_id)

        # Transform to structured response using model
        connection_result = ProviderConnectionStatus.create(
            provider_data=final_provider["data"],
            connection_status=connection_status,
        )

        if secret_response:
            # We just stored credentials, use the secret_type from the response
            connection_result.provider.secret_type = (
                secret_response.get("data", {}).get("attributes", {}).get("secret_type")
            )
        else:
            # No new credentials provided, check if provider has an existing secret
            secret_data = (
                final_provider.get("data", {})
                .get("relationships", {})
                .get("secret", {})
                .get("data")
            )
            if secret_data:
                # Provider has existing secret, fetch its type
                secret_id = secret_data["id"]
                connection_result.provider.secret_type = await self._get_secret_type(
                    secret_id
                )

        return connection_result.model_dump()

    async def delete_provider(
        self,
        provider_id: str = Field(
            description="Prowler's internal UUID (v4) for the provider to permanently remove, generated when the provider was registered in the system. Use `prowler_app_search_providers` tool to find the provider_id if you only know the alias or the provider's own identifier (provider_uid)"
        ),
    ) -> dict[str, Any]:
        """Permanently remove a registered provider from Prowler.

        WARNING: This is a destructive operation that cannot be undone. The provider will need to be
        re-added with prowler_app_connect_provider if you want to scan it again.

        The tool always returns the deletion status and message.
        """
        self.logger.info(f"Deleting provider {provider_id}...")
        try:
            # Initiate the deletion task
            task_response = await self.api_client.delete(f"/providers/{provider_id}")
            task_id = task_response.get("data", {}).get("id")

            # Poll until task completes (with 60 second timeout)
            await self.api_client.poll_task_until_complete(
                task_id=task_id, timeout=60, poll_interval=1.0
            )

            # If we reach here, the task completed successfully
            return {
                "deleted": True,
                "message": f"Provider {provider_id} deleted successfully",
            }
        except Exception as e:
            self.logger.error(f"Provider deletion failed: {e}")
            return {
                "deleted": False,
                "message": f"Provider {provider_id} deletion failed: {str(e)}",
            }

    # Private helper methods

    async def _check_provider_exists(self, provider_uid: str) -> str | None:
        """Check if a provider already exists by its UID.

        Args:
            provider_uid: The provider's unique identifier (e.g., AWS account ID)

        Returns:
            The Prowler-generated provider ID if exists, None otherwise

        Raises:
            Exception: If multiple providers with the same UID are found (data integrity issue)
            Exception: If API request fails
        """
        self.logger.info(f"Checking if provider {provider_uid} exists...")
        response = await self.api_client.get(
            "/providers", params={"filter[uid]": provider_uid}
        )
        providers = response.get("data", [])

        if len(providers) == 0:
            self.logger.info(f"Provider {provider_uid} does not exist")
            return None
        elif len(providers) == 1:
            prowler_provider_id = providers[0].get("id")
            self.logger.info(
                f"Provider {provider_uid} exists with ID {prowler_provider_id}"
            )
            return prowler_provider_id
        else:
            # Multiple providers with the same UID is a data integrity issue
            raise Exception(
                f"Data integrity error: Found {len(providers)} providers with UID '{provider_uid}'. "
                f"Each provider UID should be unique. Please contact support or manually clean up duplicate providers."
            )

    async def _create_provider(
        self, provider_uid: str, provider_type: str, alias: str | None
    ) -> str:
        """Create a new provider.

        Args:
            provider_uid: The provider's unique identifier
            provider_type: Type of provider to be scanned with Prowler (aws, azure, gcp, etc.)
            alias: Optional human-friendly name for the provider

        Returns:
            The provider UID (which is used as the ID)
        """
        self.logger.info(f"Creating provider {provider_uid} (type: {provider_type})...")
        provider_body = {
            "data": {
                "type": "providers",
                "attributes": {
                    "uid": provider_uid,
                    "provider": provider_type,
                },
            }
        }
        if alias:
            provider_body["data"]["attributes"]["alias"] = alias

        await self.api_client.post("/providers", json_data=provider_body)

        provider_id = await self._check_provider_exists(provider_uid)
        if provider_id is None:
            raise Exception(f"Provider {provider_uid} creation failed")
        return provider_id

    async def _update_provider_alias(
        self, prowler_provider_id: str, alias: str
    ) -> None:
        """Update the alias of an existing provider.

        Args:
            prowler_provider_id: The Prowler-generated provider ID
            alias: New human-friendly name for the provider
        """
        self.logger.info(f"Updating provider {prowler_provider_id} alias...")
        update_body = {
            "data": {
                "type": "providers",
                "id": prowler_provider_id,
                "attributes": {
                    "alias": alias,
                },
            }
        }
        result = await self.api_client.patch(
            f"/providers/{prowler_provider_id}", json_data=update_body
        )
        if result.get("data", {}).get("attributes", {}).get("alias") != alias:
            raise Exception(f"Provider {prowler_provider_id} alias update failed")

    def _determine_secret_type(self, credentials: dict[str, Any]) -> str:
        """Determine the secret type from credentials structure.

        Args:
            credentials: The credentials dictionary

        Returns:
            Secret type: "role", "service_account", or "static"
        """
        if "role_arn" in credentials:
            return "role"
        elif "service_account_key" in credentials:
            return "service_account"
        else:
            return "static"

    async def _get_provider_secret_id(self, prowler_provider_id: str) -> str | None:
        """Get the secret ID for a provider if it exists.

        Args:
            prowler_provider_id: The Prowler-generated provider ID

        Returns:
            The secret ID if exists, None otherwise
        """
        try:
            response = await self.api_client.get(
                "/providers/secrets",
                params={"filter[provider]": prowler_provider_id},
            )
            secrets = response.get("data", [])

            if len(secrets) > 0:
                secret_id = secrets[0].get("id")
                self.logger.info(
                    f"Found existing secret {secret_id} for provider {prowler_provider_id}"
                )
                return secret_id
            else:
                self.logger.info(
                    f"No existing secret found for provider {prowler_provider_id}"
                )
                return None
        except Exception as e:
            self.logger.error(f"Error checking for existing secret: {e}")
            return None

    async def _get_secret_type(self, secret_id: str) -> str | None:
        """Get the secret type for a given secret ID.

        Args:
            secret_id: The secret ID from provider relationships

        Returns:
            The secret type ("role", "service_account", or "static") if found, None otherwise
        """
        try:
            response = await self.api_client.get(
                f"/providers/secrets/{secret_id}",
                params={"fields[provider-secrets]": "secret_type"},
            )
            secret_type = (
                response.get("data", {}).get("attributes", {}).get("secret_type")
            )
            return secret_type
        except Exception as e:
            self.logger.error(f"Error fetching secret type for {secret_id}: {e}")
            return None

    async def _store_credentials(
        self, prowler_provider_id: str, credentials: dict[str, Any]
    ) -> dict[str, Any]:
        """Store or update credentials for a provider.

        Args:
            prowler_provider_id: The Prowler-generated provider ID
            credentials: The credentials to store

        Returns:
            The API response with the secret data
        """
        self.logger.info(
            f"Adding/updating credentials for provider {prowler_provider_id}..."
        )

        secret_type = self._determine_secret_type(credentials)

        # Check if a secret already exists for this provider
        existing_secret_id = await self._get_provider_secret_id(prowler_provider_id)

        if existing_secret_id:
            # Update existing secret
            self.logger.info(f"Updating existing secret {existing_secret_id}...")
            update_body = {
                "data": {
                    "type": "provider-secrets",
                    "id": existing_secret_id,
                    "attributes": {
                        "secret_type": secret_type,
                        "secret": credentials,
                    },
                    "relationships": {
                        "provider": {
                            "data": {
                                "type": "providers",
                                "id": prowler_provider_id,
                            }
                        }
                    },
                }
            }
            try:
                response = await self.api_client.patch(
                    f"/providers/secrets/{existing_secret_id}",
                    json_data=update_body,
                )
                self.logger.info("Credentials updated successfully")
                return response
            except Exception as e:
                self.logger.error(f"Error updating credentials: {e}")
                raise
        else:
            # Create new secret
            self.logger.info("Creating new secret...")
            secret_body = {
                "data": {
                    "type": "provider-secrets",
                    "attributes": {
                        "secret_type": secret_type,
                        "secret": credentials,
                    },
                    "relationships": {
                        "provider": {
                            "data": {
                                "type": "providers",
                                "id": prowler_provider_id,
                            }
                        }
                    },
                }
            }

            try:
                response = await self.api_client.post(
                    "/providers/secrets", json_data=secret_body
                )
                self.logger.info("Credentials added successfully")
                return response
            except Exception as e:
                self.logger.error(f"Error adding credentials: {e}")
                raise

    async def _test_connection(self, prowler_provider_id: str) -> dict[str, Any]:
        """Test connection to a provider.

        Args:
            prowler_provider_id: The Prowler-generated provider ID

        Returns:
            Connection status dictionary with 'connected' boolean and optional 'error' message
        """
        self.logger.info(f"Testing connection for provider {prowler_provider_id}...")
        try:
            # Initiate the connection test task
            task_response = await self.api_client.post(
                f"/providers/{prowler_provider_id}/connection", json_data={}
            )
            task_id = task_response.get("data", {}).get("id")

            # Poll until task completes (with 60 second timeout)
            completed_task = await self.api_client.poll_task_until_complete(
                task_id=task_id, timeout=60, poll_interval=1.0
            )

            # Extract the result from the completed task
            task_result = (
                completed_task.get("data", {}).get("attributes", {}).get("result", {})
            )

            return task_result
        except Exception as e:
            self.logger.error(f"Connection test failed: {e}")
            return {"connected": False, "error": str(e)}

    async def _get_final_provider_state(
        self, prowler_provider_id: str
    ) -> dict[str, Any]:
        """Get final provider state with relationships.

        Args:
            prowler_provider_id: The Prowler-generated provider ID

        Returns:
            Provider data dictionary
        """
        return await self.api_client.get(
            f"/providers/{prowler_provider_id}",
        )
```

--------------------------------------------------------------------------------

---[FILE: resources.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/tools/resources.py
Signals: Pydantic

```python
"""Cloud Resources tools for Prowler App MCP Server.

This module provides tools for searching, viewing, and analyzing cloud resources
across all providers.
"""

from typing import Any

from pydantic import Field

from prowler_mcp_server.prowler_app.models.resources import (
    DetailedResource,
    ResourcesListResponse,
    ResourcesMetadataResponse,
)
from prowler_mcp_server.prowler_app.tools.base import BaseTool


class ResourcesTools(BaseTool):
    """Tools for cloud resources operations.

    Provides tools for:
    - Searching and filtering cloud resources
    - Getting detailed resource information
    - Viewing resources overview with statistics
    """

    async def list_resources(
        self,
        provider_type: list[str] = Field(
            default=[],
            description="Filter by  provider type. Multiple values allowed. If empty, all providers are returned. For valid values, please refer to Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server.",
        ),
        provider_alias: str | None = Field(
            default=None,
            description="Filter by specific provider alias/name (partial match supported). Useful for finding resources in specific accounts like 'production' or 'dev'.",
        ),
        provider_uid: str | None = Field(
            default=None,
            description="Filter by provider's native ID (e.g., AWS account ID, Azure subscription ID, GCP project ID). All supported provider types are listed in the Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server",
        ),
        region: list[str] = Field(
            default=[],
            description="Filter by regions. Multiple values allowed (e.g., us-east-1, westus2, europe-west1), format may vary depending on the provider. If empty, all regions are returned.",
        ),
        service: list[str] = Field(
            default=[],
            description="Filter by service. Multiple values allowed (e.g., s3, ec2, iam, keyvault). If empty, all services are returned.",
        ),
        resource_type: list[str] = Field(
            default=[],
            description="Filter by resource type. Format may vary depending on the provider. If empty, all resource types are returned.",
        ),
        resource_name: str | None = Field(
            default=None,
            description="Filter by resource name (partial match supported). Useful for finding specific resources like 'prod-db' or 'test-bucket'.",
        ),
        tag_key: str | None = Field(
            default=None,
            description="Filter resources by tag key (e.g., 'Environment', 'CostCenter', 'Owner').",
        ),
        tag_value: str | None = Field(
            default=None,
            description="Filter resources by tag value (e.g., 'production', 'staging', 'development').",
        ),
        date_from: str | None = Field(
            default=None,
            description="Start date for range query in ISO 8601 format (YYYY-MM-DD, e.g., '2025-01-15'). Full date required. IMPORTANT: Maximum date range is 2 days. If only date_from is provided, date_to is automatically set to 2 days later.",
        ),
        date_to: str | None = Field(
            default=None,
            description="End date for range query in ISO 8601 format (YYYY-MM-DD, e.g., '2025-01-15'). Full date required. If only date_to is provided, date_from is automatically set to 2 days earlier.",
        ),
        search: str | None = Field(
            default=None, description="Free-text search term across resource details"
        ),
        page_size: int = Field(
            default=50, description="Number of results to return per page (max 1000)"
        ),
        page_number: int = Field(
            default=1, description="Page number to retrieve (1-indexed)"
        ),
    ) -> dict[str, Any]:
        """List and filter all resources scanned by Prowler.

        IMPORTANT: This tool returns LIGHTWEIGHT resource information. Use this for fast searching
        and filtering across many resources. For complete configuration details, metadata, and finding
        relationships, use prowler_app_get_resource on specific resources of interest.

        This is the primary tool for browsing resources with rich filtering capabilities.
        Returns current state by default (latest scan per provider). Specify dates to query
        historical data (2-day maximum window).

        Default behavior:
        - Returns latest resources from most recent scans (no date parameters needed)
        - Returns 50 results per page
        - Sorted by service, region, and name for logical grouping

        Date filtering:
        - Without dates: queries resources from the most recent completed scan per provider (most efficient)
        - With dates: queries historical resource state (2-day maximum range between date_from and date_to)

        Each resource includes:
        - Core identification: id (UUID for prowler_app_get_resource), uid, name
        - Location context: region, service, type
        - Security context: failed_findings_count (number of active security issues)
        - Tags: tags associated with the resource

        Useful Workflow:
        1. Use this tool to search and filter resources by provider, region, service, tags, etc.
        2. Use prowler_app_get_resource with the resource 'id' to get complete configuration and metadata
        3. Use prowler_app_search_security_findings to find security issues for specific resources
        4. Use prowler_app_get_finding_details to get details about the security issues for specific resources
        """
        # Validate page_size parameter
        self.api_client.validate_page_size(page_size)

        # Determine endpoint based on date parameters
        date_range = self.api_client.normalize_date_range(
            date_from, date_to, max_days=2
        )

        if date_range is None:
            # No dates provided - use latest resources endpoint
            endpoint = "/resources/latest"
            params = {}
        else:
            # Dates provided - use historical resources endpoint
            endpoint = "/resources"
            params = {
                "filter[updated_at__gte]": date_range[0],
                "filter[updated_at__lte]": date_range[1],
            }

        # Build filter parameters
        if provider_type:
            params["filter[provider_type__in]"] = provider_type
        if provider_alias:
            params["filter[provider_alias__icontains]"] = provider_alias
        if provider_uid:
            params["filter[provider_uid__icontains]"] = provider_uid
        if region:
            params["filter[region__in]"] = region
        if service:
            params["filter[service__in]"] = service
        if resource_type:
            params["filter[type__in]"] = resource_type
        if resource_name:
            params["filter[name__icontains]"] = resource_name
        if tag_key:
            params["filter[tag_key]"] = tag_key
        if tag_value:
            params["filter[tag_value]"] = tag_value
        if search:
            params["filter[search]"] = search

        # Pagination
        params["page[size]"] = page_size
        params["page[number]"] = page_number

        # Return only LLM-relevant fields
        params["fields[resources]"] = (
            "uid,name,region,service,type,failed_findings_count,tags"
        )
        params["sort"] = "service,region,name"

        # Convert lists to comma-separated strings
        clean_params = self.api_client.build_filter_params(params)

        # Get API response and transform to simplified format
        api_response = await self.api_client.get(endpoint, params=clean_params)
        simplified_response = ResourcesListResponse.from_api_response(api_response)

        return simplified_response.model_dump()

    async def get_resource(
        self,
        resource_id: str = Field(
            description="Prowler's internal UUID (v4) for the resource to retrieve, generated when the resource was discovered in the system. Use `prowler_app_list_resources` tool to find the right ID"
        ),
    ) -> dict[str, Any]:
        """Retrieve comprehensive details about a specific resource by its ID.

        IMPORTANT: This tool provides COMPLETE resource details with all available information.
        Use this after finding a specific resource via prowler_app_list_resources.

        This tool provides ALL information that prowler_app_list_resources returns PLUS:

        1. Configuration Details:
           - metadata: Provider-specific configuration (tags, policies, encryption settings, network rules)
           - partition: Provider-specific partition/region grouping (e.g., aws, aws-cn, aws-us-gov for AWS)

        2. Temporal Tracking:
           - inserted_at: When Prowler first discovered this resource
           - updated_at: When resource configuration last changed

        3. Security Relationships:
           - finding_ids: Prowler's internal UUIDs (v4) of all security findings associated with this resource
           - Use prowler_app_get_finding_details on these IDs to get remediation guidance

        Useful Workflow:
        1. Use prowler_app_list_resources to browse and filter across many resources
        2. Use this tool to drill down into specific resources of interest
        3. Use prowler_app_get_finding_details to get details about the security issues for specific resources
        """
        params = {}

        # Get API response and transform to detailed format
        api_response = await self.api_client.get(
            f"/resources/{resource_id}", params=params
        )
        detailed_resource = DetailedResource.from_api_response(
            api_response.get("data", {})
        )

        return detailed_resource.model_dump()

    async def get_resources_overview(
        self,
        provider_type: list[str] = Field(
            default=[],
            description="Filter by  provider type. Multiple values allowed. If empty, all providers are returned. For valid values, please refer to Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server.",
        ),
        provider_alias: str | None = Field(
            default=None,
            description="Filter by specific provider alias/name (partial match supported).",
        ),
        provider_uid: str | None = Field(
            default=None,
            description="Filter by provider's native ID (e.g., AWS account ID, Azure subscription ID).",
        ),
        date_from: str | None = Field(
            default=None,
            description="Start date for range query in ISO 8601 format (YYYY-MM-DD). Maximum 2-day range.",
        ),
        date_to: str | None = Field(
            default=None,
            description="End date for range query in ISO 8601 format (YYYY-MM-DD).",
        ),
    ) -> dict[str, Any]:
        """Generate a markdown overview of your resources with statistics and insights.

        IMPORTANT: This tool provides HIGH-LEVEL STATISTICS without returning individual resources.
        Use this when you need a summary view before drilling into details.

        The report includes:
        - Total number of resources
        - Available services across your providers
        - Regions where resources are deployed
        - Resource types present in your providers

        Output format: Markdown-formatted report ready to present to users or include in documentation.

        Use cases:
        - Understanding infrastructure footprint
        - Identifying resource concentration (which regions, services)
        - Multi-provider deployment auditing
        - Resource inventory reporting
        - Tags planning (by provider, service, region)
        """
        # Determine endpoint based on date parameters
        date_range = self.api_client.normalize_date_range(
            date_from, date_to, max_days=2
        )

        if date_range is None:
            # No dates provided - use latest metadata endpoint
            metadata_endpoint = "/resources/metadata/latest"
            list_endpoint = "/resources/latest"
            params = {}
        else:
            # Dates provided - use historical endpoints
            metadata_endpoint = "/resources/metadata"
            list_endpoint = "/resources"
            params = {
                "filter[updated_at__gte]": date_range[0],
                "filter[updated_at__lte]": date_range[1],
            }

        # Build common filter parameters
        if provider_type:
            params["filter[provider_type__in]"] = provider_type
        if provider_alias:
            params["filter[provider_alias__icontains]"] = provider_alias
        if provider_uid:
            params["filter[provider_uid__icontains]"] = provider_uid

        # Convert lists to comma-separated strings
        clean_params = self.api_client.build_filter_params(params)

        # Get metadata (services, regions, types)
        metadata_params = clean_params.copy()
        metadata_params["fields[resources-metadata]"] = "services,regions,types"
        metadata_response = await self.api_client.get(
            metadata_endpoint, params=metadata_params
        )
        metadata = ResourcesMetadataResponse.from_api_response(metadata_response)

        # Get total count (using page_size=1 for efficiency)
        count_params = clean_params.copy()
        count_params["page[size]"] = 1
        count_params["page[number]"] = 1
        count_response = await self.api_client.get(list_endpoint, params=count_params)
        total_resources = (
            count_response.get("meta", {}).get("pagination", {}).get("count", 0)
        )

        # Build markdown report
        report_lines = ["# Cloud Resources Overview", ""]

        # Total resources
        report_lines.append(f"**Total Resources**: {total_resources:,} resources")
        report_lines.append("")

        # Services
        if metadata.services:
            report_lines.append("## Services")
            report_lines.append(f"**{len(metadata.services)}** unique services found")
            report_lines.append("")
            for i, service in enumerate(metadata.services, 1):
                report_lines.append(f"{i}. {service}")
            report_lines.append("")

        # Regions
        if metadata.regions:
            report_lines.append("## Regions")
            report_lines.append(f"**{len(metadata.regions)}** unique regions found")
            report_lines.append("")
            for i, region in enumerate(metadata.regions, 1):
                report_lines.append(f"{i}. {region}")
            report_lines.append("")

        # Resource types
        if metadata.types:
            report_lines.append("## Resource Types")
            report_lines.append(
                f"**{len(metadata.types)}** unique resource types found"
            )
            report_lines.append("")
            for i, rtype in enumerate(metadata.types, 1):
                report_lines.append(f"{i}. {rtype}")
            report_lines.append("")

        report = "\n".join(report_lines)
        return {"report": report}
```

--------------------------------------------------------------------------------

````
