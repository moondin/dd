---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 109
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 109 of 867)

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
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/models/providers.py
Signals: Pydantic

```python
"""Pydantic models for simplified provider responses."""

from typing import Any, Literal

from prowler_mcp_server.prowler_app.models.base import MinimalSerializerMixin
from pydantic import BaseModel


class SimplifiedProvider(MinimalSerializerMixin, BaseModel):
    """Simplified provider for list/search operations."""

    id: str
    uid: str
    alias: str | None = None
    provider: str
    connected: bool | None = None
    secret_type: Literal["role", "service_account", "static"] | None = None

    def _should_exclude(self, key: str, value: Any) -> bool:
        """Override to always include connected and secret_type fields even when None."""
        # Always include these fields regardless of value (None has semantic meaning)
        if key == "connected" or key == "secret_type":
            return False
        # Use parent class logic for other fields
        return super()._should_exclude(key, value)

    @classmethod
    def from_api_response(cls, data: dict[str, Any]) -> "SimplifiedProvider":
        """Transform JSON:API provider response to simplified format."""
        attributes = data["attributes"]
        connection_data = attributes.get("connection", {})

        return cls(
            id=data["id"],
            uid=attributes["uid"],
            alias=attributes.get("alias"),
            provider=attributes["provider"],
            connected=connection_data.get("connected"),
            secret_type=None,  # Will be populated separately via secret endpoint
        )


class DetailedProvider(SimplifiedProvider):
    """Detailed provider with complete information for deep analysis.

    Extends SimplifiedProvider with temporal metadata and relationships.
    Use this when you need complete context about a specific provider.
    """

    inserted_at: str | None = None
    updated_at: str | None = None
    last_checked_at: str | None = None
    provider_group_ids: list[str] | None = None

    @classmethod
    def from_api_response(cls, data: dict[str, Any]) -> "DetailedProvider":
        """Transform JSON:API provider response to detailed format."""
        attributes = data["attributes"]
        connection_data = attributes.get("connection", {})
        relationships = data.get("relationships", {})

        # Extract provider groups relationship
        provider_group_ids = None
        groups_data = relationships.get("provider_groups", {}).get("data", [])
        if groups_data:
            provider_group_ids = [group["id"] for group in groups_data]

        return cls(
            id=data["id"],
            uid=attributes["uid"],
            alias=attributes.get("alias"),
            provider=attributes["provider"],
            connected=connection_data.get("connected"),
            inserted_at=attributes.get("inserted_at"),
            updated_at=attributes.get("updated_at"),
            last_checked_at=connection_data.get("last_checked_at"),
            provider_group_ids=provider_group_ids,
        )


class ProvidersListResponse(BaseModel):
    """Simplified response for providers list queries."""

    providers: list[SimplifiedProvider]
    total_num_providers: int
    total_num_pages: int
    current_page: int

    @classmethod
    def from_api_response(cls, response: dict[str, Any]) -> "ProvidersListResponse":
        """Transform JSON:API response to simplified format."""
        data = response["data"]
        meta = response["meta"]
        pagination = meta["pagination"]

        providers = [SimplifiedProvider.from_api_response(item) for item in data]

        return cls(
            providers=providers,
            total_num_providers=pagination["count"],
            total_num_pages=pagination["pages"],
            current_page=pagination["page"],
        )


class ProviderConnectionStatus(MinimalSerializerMixin, BaseModel):
    """Result of provider connection operation."""

    provider: DetailedProvider
    connected: Literal["connected", "failed", "not_tested"]
    error: str | None = None

    @classmethod
    def create(
        cls,
        provider_data: dict[str, Any],
        connection_status: dict[str, Any],
    ) -> "ProviderConnectionStatus":
        """Create connection status from provider data and connection test result."""

        connected: str | None = connection_status.get("connected", None)

        if connected is None:
            connected = "not_tested"
        elif connected:
            connected = "connected"
        else:
            connected = "failed"

        return cls(
            provider=DetailedProvider.from_api_response(provider_data),
            connected=connected,
            error=connection_status.get("error", None),
        )
```

--------------------------------------------------------------------------------

---[FILE: resources.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/models/resources.py
Signals: Pydantic

```python
"""Pydantic models for simplified resources responses."""

from prowler_mcp_server.prowler_app.models.base import MinimalSerializerMixin
from pydantic import BaseModel


class SimplifiedResource(MinimalSerializerMixin, BaseModel):
    """Simplified resource with only LLM-relevant information for list operations."""

    id: str
    uid: str
    name: str
    region: str
    service: str
    type: str
    failed_findings_count: int
    tags: dict[str, str] | None = None
    provider_id: str | None = None

    @classmethod
    def from_api_response(cls, data: dict) -> "SimplifiedResource":
        """Transform JSON:API resource response to simplified format."""
        attributes = data["attributes"]
        relationships = data.get("relationships", {})

        # Extract provider information from relationships if available
        provider_id = None
        provider_data = relationships.get("provider", {}).get("data", {})
        if provider_data:
            provider_id = provider_data["id"]

        return cls(
            id=data["id"],
            uid=attributes["uid"],
            name=attributes["name"],
            region=attributes["region"],
            service=attributes["service"],
            type=attributes["type"],
            failed_findings_count=attributes["failed_findings_count"],
            tags=attributes["tags"],
            provider_id=provider_id,
        )


class DetailedResource(SimplifiedResource):
    """Detailed resource with comprehensive information for deep analysis.

    Extends SimplifiedResource with tags, metadata, configuration details,
    temporal information, and relationships.
    Use this when you need complete context about a specific resource.
    """

    metadata: str | None = None
    partition: str | None = None
    inserted_at: str
    updated_at: str
    finding_ids: list[str] | None = None

    @classmethod
    def from_api_response(cls, data: dict) -> "DetailedResource":
        """Transform JSON:API resource response to detailed format."""
        attributes = data["attributes"]
        relationships = data.get("relationships", {})

        # Parse findings relationship
        finding_ids = None
        findings_data = relationships.get("findings", {}).get("data", [])
        if findings_data:
            finding_ids = [f["id"] for f in findings_data]

        # Extract provider information from relationships if available
        provider_id = None
        provider_data = relationships.get("provider", {}).get("data", {})
        if provider_data:
            provider_id = provider_data["id"]

        return cls(
            id=data["id"],
            uid=attributes["uid"],
            name=attributes["name"],
            region=attributes["region"],
            service=attributes["service"],
            type=attributes["type"],
            failed_findings_count=attributes["failed_findings_count"],
            tags=attributes["tags"],
            metadata=attributes["metadata"],
            partition=attributes["partition"],
            inserted_at=attributes["inserted_at"],
            updated_at=attributes["updated_at"],
            finding_ids=finding_ids,
            provider_id=provider_id,
        )


class ResourcesListResponse(BaseModel):
    """Simplified response for resources list queries."""

    resources: list[SimplifiedResource]
    total_num_resources: int
    total_num_pages: int
    current_page: int

    @classmethod
    def from_api_response(cls, response: dict) -> "ResourcesListResponse":
        """Transform JSON:API response to simplified format."""
        data = response["data"]
        meta = response["meta"]
        pagination = meta["pagination"]

        resources = [SimplifiedResource.from_api_response(item) for item in data]

        return cls(
            resources=resources,
            total_num_resources=pagination["count"],
            total_num_pages=pagination["pages"],
            current_page=pagination["page"],
        )


class ResourcesMetadataResponse(BaseModel):
    """Metadata response with unique filter values for resource discovery."""

    services: list[str] | None = None
    regions: list[str] | None = None
    types: list[str] | None = None

    @classmethod
    def from_api_response(cls, response: dict) -> "ResourcesMetadataResponse":
        """Transform JSON:API metadata response to simplified format."""
        data = response["data"]
        attributes = data["attributes"]

        return cls(
            services=attributes.get("services"),
            regions=attributes.get("regions"),
            types=attributes.get("types"),
        )
```

--------------------------------------------------------------------------------

---[FILE: scans.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/models/scans.py
Signals: Pydantic

```python
"""Data models for Prowler scans.

This module provides Pydantic models for representing Prowler security scans
with two-tier complexity:
- SimplifiedScan: For list operations with essential fields
- DetailedScan: Extends simplified with additional operational fields

All models inherit from MinimalSerializerMixin to exclude None/empty values
for optimal LLM token usage.
"""

from typing import Any, Literal

from prowler_mcp_server.prowler_app.models.base import MinimalSerializerMixin
from pydantic import BaseModel, ConfigDict, Field


class SimplifiedScan(MinimalSerializerMixin, BaseModel):
    """Simplified scan representation for list operations.

    Includes core scan fields for efficient overview.
    Used by list_scans() tool.
    """

    model_config = ConfigDict(frozen=True)

    id: str = Field(
        description="Unique UUIDv4 identifier for this scan in Prowler database"
    )
    name: str | None = Field(
        default=None,
        description="Optional custom name for the scan to help identify it",
    )
    trigger: Literal["manual", "scheduled"] = Field(
        description="How the scan was initiated: 'manual' (user-triggered) or 'scheduled' (automated)"
    )
    state: Literal[
        "available", "scheduled", "executing", "completed", "failed", "cancelled"
    ] = Field(
        description="Current state of the scan: available, scheduled, executing, completed, failed, or cancelled"
    )
    started_at: str | None = Field(
        default=None, description="ISO 8601 timestamp when the scan started execution"
    )
    completed_at: str | None = Field(
        default=None,
        description="ISO 8601 timestamp when the scan finished (completed or failed)",
    )
    provider_id: str = Field(
        description="UUIDv4 identifier of the provider this scan is associated with"
    )

    @classmethod
    def from_api_response(cls, data: dict[str, Any]) -> "SimplifiedScan":
        """Transform JSON:API scan response to simplified model.

        Args:
            data: Scan data from API response['data'] (single item or list item)

        Returns:
            SimplifiedScan instance
        """
        attributes = data["attributes"]
        relationships = data.get("relationships", {})

        provider_id = relationships.get("provider", {}).get("data", {}).get("id", None)

        return cls(
            id=data["id"],
            name=attributes.get("name"),
            trigger=attributes["trigger"],
            state=attributes["state"],
            started_at=attributes.get("started_at"),
            completed_at=attributes.get("completed_at"),
            provider_id=provider_id,
        )


class DetailedScan(SimplifiedScan):
    """Detailed scan representation with full operational data.

    Extends SimplifiedScan with progress, duration, resources, and relationships.
    Used by get_scan() and create_scan() tools.
    """

    model_config = ConfigDict(frozen=True)

    progress: int | None = Field(
        default=None, description="Scan completion progress as percentage (0-100)"
    )
    duration: int | None = Field(
        default=None,
        description="Total scan duration in seconds from start to completion",
    )
    unique_resource_count: int | None = Field(
        default=None,
        description="Number of unique cloud resources discovered during the scan",
    )
    inserted_at: str | None = Field(
        default=None,
        description="ISO 8601 timestamp when the scan was created in the database",
    )
    scheduled_at: str | None = Field(
        default=None,
        description="ISO 8601 timestamp when the scan was scheduled to run",
    )
    next_scan_at: str | None = Field(
        default=None,
        description="ISO 8601 timestamp for the next scheduled scan (for recurring scans)",
    )

    @classmethod
    def from_api_response(cls, data: dict[str, Any]) -> "DetailedScan":
        """Transform JSON:API scan response to detailed model.

        Args:
            data: Scan data from API response['data']

        Returns:
            DetailedScan instance with all fields populated
        """
        attributes = data["attributes"]
        relationships = data.get("relationships", {})

        # Extract provider ID from relationship
        provider_rel = relationships.get("provider", {}).get("data", {})
        provider_id = provider_rel.get("id", "")

        # Extract task relationship
        task_rel = relationships.get("task", {}).get("data")
        task_id = task_rel.get("id") if task_rel else None

        # Extract processor relationship
        processor_rel = relationships.get("processor", {}).get("data")
        processor_id = processor_rel.get("id") if processor_rel else None

        return cls(
            id=data["id"],
            name=attributes.get("name"),
            trigger=attributes["trigger"],
            state=attributes["state"],
            started_at=attributes.get("started_at"),
            completed_at=attributes.get("completed_at"),
            provider_id=provider_id,
            progress=attributes.get("progress"),
            duration=attributes.get("duration"),
            unique_resource_count=attributes.get("unique_resource_count"),
            inserted_at=attributes.get("inserted_at"),
            scheduled_at=attributes.get("scheduled_at"),
            next_scan_at=attributes.get("next_scan_at"),
            task_id=task_id,
            processor_id=processor_id,
        )


class ScansListResponse(BaseModel):
    """Response model for list_scans() with pagination metadata.

    Follows established pattern from FindingsListResponse and ProvidersListResponse.
    """

    scans: list[SimplifiedScan]
    total_num_scans: int
    total_num_pages: int
    current_page: int

    @classmethod
    def from_api_response(cls, response: dict[str, Any]) -> "ScansListResponse":
        """Transform JSON:API list response to scans list with pagination.

        Args:
            response: Full API response with data and meta

        Returns:
            ScansListResponse with simplified scans and pagination metadata
        """
        data = response.get("data", [])
        meta = response.get("meta", {})
        pagination = meta.get("pagination", {})

        # Transform each scan
        scans = [SimplifiedScan.from_api_response(item) for item in data]

        return cls(
            scans=scans,
            total_num_scans=pagination.get("count", 0),
            total_num_pages=pagination.get("pages", 0),
            current_page=pagination.get("page", 1),
        )


class ScanCreationResult(MinimalSerializerMixin, BaseModel):
    """Result of scan creation operation.

    Used by trigger_scan() to communicate the outcome of scan creation.
    Status indicates whether scan was created successfully or failed.
    """

    scan: DetailedScan | None = Field(
        default=None,
        description="Detailed scan information if creation succeeded, None otherwise",
    )
    status: Literal["success", "failed"] = Field(
        description="Outcome of scan creation: success (scan created successfully) or failed (error)"
    )
    message: str = Field(
        description="Human-readable message describing the scan creation result"
    )


class ScheduleCreationResult(MinimalSerializerMixin, BaseModel):
    """Result of async schedule creation operation.

    Used by schedule_daily_scan() to communicate scheduling outcome.
    """

    scheduled: bool = Field(
        description="Whether the daily scan schedule was created successfully"
    )
    message: str = Field(
        description="Human-readable message describing the scheduling result"
    )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/models/__init__.py
Signals: Pydantic

```python
"""Pydantic models for Prowler App MCP Server."""

from prowler_mcp_server.prowler_app.models.base import MinimalSerializerMixin
from prowler_mcp_server.prowler_app.models.findings import (
    CheckMetadata,
    CheckRemediation,
    DetailedFinding,
    FindingsListResponse,
    FindingsOverview,
    SimplifiedFinding,
)
from prowler_mcp_server.prowler_app.models.muting import (
    DetailedMuteRule,
    MutelistResponse,
    MuteRulesListResponse,
    SimplifiedMuteRule,
)

__all__ = [
    # Base models
    "MinimalSerializerMixin",
    # Findings models
    "CheckMetadata",
    "CheckRemediation",
    "DetailedFinding",
    "FindingsListResponse",
    "FindingsOverview",
    "SimplifiedFinding",
    # Muting models
    "DetailedMuteRule",
    "MutelistResponse",
    "MuteRulesListResponse",
    "SimplifiedMuteRule",
]
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/tools/base.py

```python
import inspect
from abc import ABC
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from fastmcp import FastMCP

from prowler_mcp_server.lib.logger import logger
from prowler_mcp_server.prowler_app.utils.api_client import ProwlerAPIClient


class BaseTool(ABC):
    """Abstract base class for all MCP tools.

    This class defines the contract that all domain-specific tools must follow.
    It ensures consistency across tool registration and provides common utilities.

    Key responsibilities:
    - Enforce implementation of register_tools() via ABC
    - Provide shared access to API client and logger
    - Define common patterns for tool registration
    - Support dependency injection for the FastMCP instance

    Attributes:
        _api_client: Singleton instance of ProwlerAPIClient for API requests
        _logger: Logger instance for structured logging

    Example:
        class FindingsTools(BaseTool):
            def register_tools(self, mcp: FastMCP) -> None:
                mcp.tool(self.search_security_findings)
                mcp.tool(self.get_finding_details)

            async def search_security_findings(self, severity: list[str] = Field(...)):
                # Implementation with access to self.api_client
                response = await self.api_client.get("/findings")
                return response
    """

    def __init__(self):
        """Initialize the tool.

        Sets up shared dependencies that all tools can access:
        - API client (singleton) for making authenticated requests
        - Logger instance for structured logging
        """
        self._api_client = ProwlerAPIClient()
        self._logger = logger

    @property
    def api_client(self) -> ProwlerAPIClient:
        """Get the shared API client instance.

        Returns:
            Singleton instance of ProwlerAPIClient for making API requests
        """
        return self._api_client

    @property
    def logger(self):
        """Get the logger instance.

        Returns:
            Logger instance for structured logging
        """
        return self._logger

    def register_tools(self, mcp: "FastMCP") -> None:
        """Automatically register all public async methods as tools with FastMCP.

        This method inspects the subclass and automatically registers all public
        async methods (not starting with '_') as tools. Subclasses do not need
        to override this method.

        Args:
            mcp: The FastMCP instance to register tools with
        """
        # Get all methods from the subclass
        registered_count = 0

        for name, method in inspect.getmembers(self, predicate=inspect.ismethod):
            # Skip private/protected methods
            if name.startswith("_"):
                continue

            # Skip methods inherited from BaseTool
            if name in ["register_tools"]:
                continue

            # Skip property getters
            if name in ["api_client", "logger"]:
                continue

            # Check if the method is a coroutine function (async)
            if inspect.iscoroutinefunction(method):
                mcp.tool(method)
                registered_count += 1
                self.logger.debug(f"Auto-registered tool: {name}")

        self.logger.info(
            f"Auto-registered {registered_count} tools from {self.__class__.__name__}"
        )
```

--------------------------------------------------------------------------------

---[FILE: compliance.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/tools/compliance.py
Signals: Pydantic

```python
"""Compliance framework tools for Prowler App MCP Server.

This module provides tools for viewing compliance status and requirement details
across all cloud providers.
"""

from typing import Any

from prowler_mcp_server.prowler_app.models.compliance import (
    ComplianceFrameworksListResponse,
    ComplianceRequirementAttributesListResponse,
    ComplianceRequirementsListResponse,
)
from prowler_mcp_server.prowler_app.tools.base import BaseTool
from pydantic import Field


class ComplianceTools(BaseTool):
    """Tools for compliance framework operations.

    Provides tools for:
    - get_compliance_overview: Get high-level compliance status across all frameworks
    - get_compliance_framework_state_details: Get detailed requirement-level breakdown for a specific framework
    """

    async def _get_latest_scan_id_for_provider(self, provider_id: str) -> str:
        """Get the latest completed scan_id for a given provider.

        Args:
            provider_id: Prowler's internal UUID for the provider

        Returns:
            The scan_id of the latest completed scan for the provider.

        Raises:
            ValueError: If no completed scans are found for the provider.
        """
        scan_params = {
            "filter[provider]": provider_id,
            "filter[state]": "completed",
            "sort": "-inserted_at",
            "page[size]": 1,
            "page[number]": 1,
        }
        clean_scan_params = self.api_client.build_filter_params(scan_params)
        scans_response = await self.api_client.get("/scans", params=clean_scan_params)

        scans_data = scans_response.get("data", [])
        if not scans_data:
            raise ValueError(
                f"No completed scans found for provider {provider_id}. "
                "Run a scan first using prowler_app_trigger_scan."
            )

        scan_id = scans_data[0]["id"]
        return scan_id

    async def get_compliance_overview(
        self,
        scan_id: str | None = Field(
            default=None,
            description="UUID of a specific scan to get compliance data for. Required if provider_id is not specified. Use `prowler_app_list_scans` to find scan IDs.",
        ),
        provider_id: str | None = Field(
            default=None,
            description="Prowler's internal UUID (v4) for a specific provider. If provided without scan_id, the tool will automatically find the latest completed scan for this provider. Use `prowler_app_search_providers` tool to find provider IDs.",
        ),
    ) -> dict[str, Any]:
        """Get high-level compliance overview across all frameworks for a specific scan.

        This tool provides a HIGH-LEVEL OVERVIEW of compliance status across all frameworks.
        Use this when you need to understand overall compliance posture before drilling into
        specific framework details.

        You have two options to specify the scan context:
        1. Provide a specific scan_id to get compliance data for that scan.
        2. Provide a provider_id to get compliance data from the latest completed scan for that provider.

        The markdown report includes:

        1. Summary Statistics:
           - Total number of compliance frameworks evaluated
           - Overall compliance metrics across all frameworks

        2. Per-Framework Breakdown:
           - Framework name, version, and compliance ID
           - Requirements passed/failed/manual counts
           - Pass percentage for quick assessment

        Workflow:
        1. Use this tool to get an overview of all compliance frameworks
        2. Use prowler_app_get_compliance_framework_state_details with a specific compliance_id to see which requirements failed
        """
        if not scan_id and not provider_id:
            return {
                "error": "Either scan_id or provider_id must be provided. Use prowler_app_search_providers to find provider IDs or prowler_app_list_scans to find scan IDs."
            }
        elif scan_id and provider_id:
            return {
                "error": "Provide either scan_id or provider_id, not both. To get compliance data for a specific scan, use scan_id. To get data for the latest scan of a provider, use provider_id."
            }
        elif not scan_id and provider_id:
            try:
                scan_id = await self._get_latest_scan_id_for_provider(provider_id)
            except ValueError as e:
                return {"error": str(e)}

        params: dict[str, Any] = {"filter[scan_id]": scan_id}

        clean_params = self.api_client.build_filter_params(params)

        # Get API response
        api_response = await self.api_client.get(
            "/compliance-overviews", params=clean_params
        )
        frameworks_response = ComplianceFrameworksListResponse.from_api_response(
            api_response
        )

        # Build markdown report
        frameworks = frameworks_response.frameworks
        total_frameworks = frameworks_response.total_count

        if total_frameworks == 0:
            return {"report": "# Compliance Overview\n\nNo compliance frameworks found"}

        # Calculate aggregate statistics
        total_requirements = sum(f.total_requirements for f in frameworks)
        total_passed = sum(f.requirements_passed for f in frameworks)
        total_failed = sum(f.requirements_failed for f in frameworks)
        total_manual = sum(f.requirements_manual for f in frameworks)
        overall_pass_pct = (
            round((total_passed / total_requirements) * 100, 1)
            if total_requirements > 0
            else 0
        )

        # Build report
        report_lines = [
            "# Compliance Overview",
            "",
            "## Summary Statistics",
            f"- **Frameworks Evaluated**: {total_frameworks}",
            f"- **Total Requirements**: {total_requirements:,}",
            f"- **Passed**: {total_passed:,} ({overall_pass_pct}%)",
            f"- **Failed**: {total_failed:,}",
            f"- **Manual Review**: {total_manual:,}",
            "",
            "## Framework Breakdown",
            "",
        ]

        # Sort frameworks by fail count (most failures first)
        sorted_frameworks = sorted(
            frameworks, key=lambda f: f.requirements_failed, reverse=True
        )

        for fw in sorted_frameworks:
            status_indicator = "PASS" if fw.requirements_failed == 0 else "FAIL"

            report_lines.append(f"### {fw.framework} {fw.version}")
            report_lines.append(f"- **Compliance ID**: `{fw.compliance_id}`")
            report_lines.append(f"- **Status**: {status_indicator}")
            report_lines.append(
                f"- **Requirements**: {fw.requirements_passed}/{fw.total_requirements} passed ({fw.pass_percentage}%)"
            )
            if fw.requirements_failed > 0:
                report_lines.append(f"- **Failed**: {fw.requirements_failed}")
            if fw.requirements_manual > 0:
                report_lines.append(f"- **Manual Review**: {fw.requirements_manual}")
            report_lines.append("")

        return {"report": "\n".join(report_lines)}

    async def _get_requirement_check_ids_mapping(
        self, compliance_id: str
    ) -> dict[str, list[str]]:
        """Get mapping of requirement IDs to their associated check IDs.

        Args:
            compliance_id: The compliance framework ID.

        Returns:
            Dictionary mapping requirement ID to list of check IDs.
        """
        params: dict[str, Any] = {
            "filter[compliance_id]": compliance_id,
            "fields[compliance-requirements-attributes]": "id,attributes",
        }

        clean_params = self.api_client.build_filter_params(params)

        api_response = await self.api_client.get(
            "/compliance-overviews/attributes", params=clean_params
        )
        attributes_response = (
            ComplianceRequirementAttributesListResponse.from_api_response(api_response)
        )

        # Build mapping: requirement_id -> [check_ids]
        return {req.id: req.check_ids for req in attributes_response.requirements}

    async def _get_failed_finding_ids_for_checks(
        self,
        check_ids: list[str],
        scan_id: str,
    ) -> list[str]:
        """Get all failed finding IDs for a list of check IDs.

        Args:
            check_ids: List of Prowler check IDs.
            scan_id: The scan ID to filter findings.

        Returns:
            List of all finding IDs with FAIL status.
        """
        if not check_ids:
            return []

        all_finding_ids: list[str] = []
        page_number = 1
        page_size = 100

        while True:
            # Query findings endpoint with check_id filter and FAIL status
            params: dict[str, Any] = {
                "filter[scan]": scan_id,
                "filter[check_id__in]": ",".join(check_ids),
                "filter[status]": "FAIL",
                "fields[findings]": "uid",
                "page[size]": page_size,
                "page[number]": page_number,
            }

            clean_params = self.api_client.build_filter_params(params)

            api_response = await self.api_client.get("/findings", params=clean_params)

            findings = api_response.get("data", [])
            if not findings:
                break

            all_finding_ids.extend([f["id"] for f in findings])

            # Check if we've reached the last page
            if len(findings) < page_size:
                break

            page_number += 1

        return all_finding_ids

    async def get_compliance_framework_state_details(
        self,
        compliance_id: str = Field(
            description="Compliance framework ID to get details for (e.g., 'cis_1.5_aws', 'pci_dss_v4.0_aws'). You can get compliance IDs from prowler_app_get_compliance_overview or consulting Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server",
        ),
        scan_id: str | None = Field(
            default=None,
            description="UUID of a specific scan to get compliance data for. Required if provider_id is not specified.",
        ),
        provider_id: str | None = Field(
            default=None,
            description="Prowler's internal UUID (v4) for a specific provider. If provided without scan_id, the tool will automatically find the latest completed scan for this provider. Use `prowler_app_search_providers` tool to find provider IDs.",
        ),
    ) -> dict[str, Any]:
        """Get detailed requirement-level breakdown for a specific compliance framework.

        IMPORTANT: This tool returns DETAILED requirement information for a single compliance framework,
        focusing on FAILED requirements and their associated FAILED finding IDs.
        Use this after prowler_app_get_compliance_overview to drill down into specific frameworks.

        The markdown report includes:

        1. Framework Summary:
           - Compliance ID and scan ID used
           - Overall pass/fail/manual counts

        2. Failed Requirements Breakdown:
           - Each failed requirement's ID and description
           - Associated failed finding IDs for each failed requirement
           - Use prowler_app_get_finding_details with these finding IDs for more details and remediation guidance

        Default behavior:
        - Requires either scan_id OR provider_id
        - With provider_id (no scan_id): Automatically finds the latest completed scan for that provider
        - With scan_id: Uses that specific scan's compliance data
        - Only shows failed requirements with their associated failed finding IDs

        Workflow:
        1. Use prowler_app_get_compliance_overview to identify frameworks with failures
        2. Use this tool with the compliance_id to see failed requirements and their finding IDs
        3. Use prowler_app_get_finding_details with the finding IDs to get remediation guidance
        """
        # Validate that either scan_id or provider_id is provided
        if not scan_id and not provider_id:
            return {
                "error": "Either scan_id or provider_id must be provided. Use prowler_app_search_providers to find provider IDs or prowler_app_list_scans to find scan IDs."
            }

        # Resolve provider_id to latest scan_id if needed
        resolved_scan_id = scan_id
        if not scan_id and provider_id:
            try:
                resolved_scan_id = await self._get_latest_scan_id_for_provider(
                    provider_id
                )
            except ValueError as e:
                return {"error": str(e)}

        # Build params for requirements endpoint
        params: dict[str, Any] = {
            "filter[scan_id]": resolved_scan_id,
            "filter[compliance_id]": compliance_id,
        }

        params["fields[compliance-requirements-details]"] = "id,description,status"

        clean_params = self.api_client.build_filter_params(params)

        # Get API response
        api_response = await self.api_client.get(
            "/compliance-overviews/requirements", params=clean_params
        )
        requirements_response = ComplianceRequirementsListResponse.from_api_response(
            api_response
        )

        requirements = requirements_response.requirements

        if not requirements:
            return {
                "report": f"# Compliance Framework Details\n\n**Compliance ID**: `{compliance_id}`\n\nNo requirements found for this compliance framework and scan combination."
            }

        # Get failed requirements
        failed_reqs = [r for r in requirements if r.status == "FAIL"]

        # Get requirement -> check_ids mapping from attributes endpoint
        requirement_check_mapping: dict[str, list[str]] = {}
        if failed_reqs:
            requirement_check_mapping = await self._get_requirement_check_ids_mapping(
                compliance_id
            )

        # For each failed requirement, get the failed finding IDs
        failed_req_findings: dict[str, list[str]] = {}
        for req in failed_reqs:
            check_ids = requirement_check_mapping.get(req.id, [])
            if check_ids:
                finding_ids = await self._get_failed_finding_ids_for_checks(
                    check_ids, resolved_scan_id
                )
                failed_req_findings[req.id] = finding_ids

        # Calculate counts
        total_count = len(requirements)
        passed_count = sum(1 for r in requirements if r.status == "PASS")
        failed_count = len(failed_reqs)
        manual_count = sum(1 for r in requirements if r.status == "MANUAL")

        # Build markdown report
        pass_pct = (
            round((passed_count / total_count) * 100, 1) if total_count > 0 else 0
        )

        report_lines = [
            "# Compliance Framework Details",
            "",
            f"**Compliance ID**: `{compliance_id}`",
            f"**Scan ID**: `{resolved_scan_id}`",
            "",
            "## Summary",
            f"- **Total Requirements**: {total_count}",
            f"- **Passed**: {passed_count} ({pass_pct}%)",
            f"- **Failed**: {failed_count}",
            f"- **Manual Review**: {manual_count}",
            "",
        ]

        # Show failed requirements with their finding IDs (most actionable)
        if failed_reqs:
            report_lines.append("## Failed Requirements")
            report_lines.append("")
            for req in failed_reqs:
                report_lines.append(f"### {req.id}")
                report_lines.append(f"**Description**: {req.description}")
                finding_ids = failed_req_findings.get(req.id, [])
                if finding_ids:
                    report_lines.append(f"**Failed Finding IDs** ({len(finding_ids)}):")
                    for fid in finding_ids:
                        report_lines.append(f"  - `{fid}`")
                else:
                    report_lines.append("**Failed Finding IDs**: None found")
                report_lines.append("")
            report_lines.append(
                "*Use `prowler_app_get_finding_details` with these finding IDs to get remediation guidance.*"
            )
            report_lines.append("")

        if manual_count > 0:
            manual_reqs = [r for r in requirements if r.status == "MANUAL"]
            report_lines.append("## Requirements Requiring Manual Review")
            report_lines.append("")
            for req in manual_reqs:
                report_lines.append(f"- **{req.id}**: {req.description}")
            report_lines.append("")

        return {"report": "\n".join(report_lines)}
```

--------------------------------------------------------------------------------

````
