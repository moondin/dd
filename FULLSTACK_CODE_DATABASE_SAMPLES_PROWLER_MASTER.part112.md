---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 112
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 112 of 867)

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

---[FILE: scans.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/tools/scans.py
Signals: Pydantic

```python
"""Security Scans tools for Prowler App MCP Server.

This module provides tools for managing and monitoring Prowler security scans.
"""

from typing import Any, Literal

from pydantic import Field

from prowler_mcp_server.prowler_app.models.scans import (
    DetailedScan,
    ScanCreationResult,
    ScansListResponse,
    ScheduleCreationResult,
)
from prowler_mcp_server.prowler_app.tools.base import BaseTool


class ScansTools(BaseTool):
    """Tools for security scan operations.

    Provides tools for:
    - prowler_app_list_scans: Search and filter scans with rich filtering capabilities
    - prowler_app_get_scan: Get comprehensive details about a specific scan
    - prowler_app_trigger_scan: Trigger manual security scans for providers
    - prowler_app_schedule_daily_scan: Schedule automated daily scans for continuous monitoring
    - prowler_app_update_scan: Update scan names for better organization
    """

    async def list_scans(
        self,
        provider_id: list[str] = Field(
            default=[],
            description="Filter by Prowler's internal UUID(s) (v4) for specific provider(s), generated when the provider was registered. Use `prowler_app_search_providers` tool to find provider IDs",
        ),
        provider_type: list[str] = Field(
            default=[],
            description="Filter by cloud provider type. For all valid values, please refer to Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server",
        ),
        provider_alias: str | None = Field(
            default=None,
            description="Filter by provider alias/friendly name. Partial match supported (case-insensitive)",
        ),
        state: list[
            Literal[
                "available",
                "scheduled",
                "executing",
                "completed",
                "failed",
                "cancelled",
            ]
        ] = Field(
            default=[],
            description="Filter by scan execution state.",
        ),
        trigger: Literal["manual", "scheduled"] | None = Field(
            default=None,
            description="Filter by how the scan was initiated. Options: 'manual' (user-initiated via prowler_app_trigger_scan), 'scheduled' (automated via prowler_app_schedule_daily_scan)",
        ),
        name: str | None = Field(
            default=None,
            description="Filter by scan name. Partial match supported (case-insensitive)",
        ),
        page_size: int = Field(
            default=50,
            description="Number of results to return per page",
        ),
        page_number: int = Field(
            default=1,
            description="Page number to retrieve (1-indexed)",
        ),
    ) -> dict[str, Any]:
        """List and filter security scans across all providers with rich filtering capabilities.

        IMPORTANT: This tool returns LIGHTWEIGHT scan information. Use this for fast searching and filtering
        across many scans. For complete scan details including progress, duration, and resource counts,
        use prowler_app_get_scan on specific scans of interest.

        Default behavior:
        - Returns all scans
        - Returns 50 scans per page
        - Includes all scan states (available, scheduled, executing, completed, failed, cancelled)

        Each scan includes:
        - Core identification: id (UUID for prowler_app_get_scan), name
        - Execution context: state, trigger (manual/scheduled)
        - Temporal data: started_at, completed_at
        - Provider relationship: provider_id

        Workflow:
        1. Use this tool to search and filter scans by provider, state, or date range
        2. Use prowler_app_get_scan with the scan 'id' to get progress, duration, and resource counts
        3. Use prowler_app_search_security_findings filtered by scan dates to analyze scan results
        """
        # Validate pagination
        self.api_client.validate_page_size(page_size)

        # Build query parameters
        params: dict[str, Any] = {
            "page[size]": page_size,
            "page[number]": page_number,
        }

        # Apply provider filters
        if provider_id:
            params["filter[provider__in]"] = provider_id
        if provider_type:
            params["filter[provider_type__in]"] = provider_type
        if provider_alias:
            params["filter[provider_alias__icontains]"] = provider_alias

        # Apply scan filters
        if state:
            params["filter[state__in]"] = state
        if trigger:
            params["filter[trigger]"] = trigger
        if name:
            params["filter[name__icontains]"] = name

        clean_params = self.api_client.build_filter_params(params)

        api_response = await self.api_client.get("/scans", params=clean_params)
        simplified_response = ScansListResponse.from_api_response(api_response)

        return simplified_response.model_dump()

    async def get_scan(
        self,
        scan_id: str = Field(
            description="Prowler's internal UUID (v4) for the scan to retrieve, generated when the scan was created (e.g., '123e4567-e89b-12d3-a456-426614174000'). Use `prowler_app_list_scans` tool to find scan IDs"
        ),
    ) -> dict[str, Any]:
        """Retrieve comprehensive details about a specific scan by its ID.

        IMPORTANT: This tool returns COMPLETE scan details.
        Use this after finding a specific scan via prowler_app_list_scans.

        This tool provides ALL information that prowler_app_list_scans returns PLUS:

        1. Execution Details:
           - progress: Scan completion progress as percentage (0-100%)
           - duration: Total scan duration in seconds from start to completion
           - unique_resource_count: Number of unique cloud resources discovered during the scan

        2. Temporal Metadata:
           - inserted_at: When the scan was created in the database
           - scheduled_at: When the scan was scheduled to run (for scheduled scans)
           - next_scan_at: When the next scan will run (for recurring daily scans)

        Useful for:
        - Monitoring scan progress during execution (via progress field)
        - Viewing scan results and metrics after completion
        - Debugging failed scans with detailed state information
        - Understanding scan scheduling patterns

        Workflow:
        1. Use prowler_app_list_scans to browse and filter scans
        2. Use this tool with the scan 'id' to monitor progress or view detailed results
        3. For completed scans, use prowler_app_search_security_findings filtered by date to analyze findings
        """
        # Fetch scan with all fields
        params = {
            "fields[scans]": "name,trigger,state,progress,duration,unique_resource_count,started_at,completed_at,scheduled_at,next_scan_at,inserted_at"
        }

        api_response = await self.api_client.get(f"/scans/{scan_id}", params=params)
        detailed_scan = DetailedScan.from_api_response(api_response["data"])

        return detailed_scan.model_dump()

    async def trigger_scan(
        self,
        provider_id: str = Field(
            description="Prowler's internal UUID (v4) for the provider to scan, generated when the provider was registered in the system (e.g., '4d0e2614-6385-4fa7-bf0b-c2e2f75c6877'). Use `prowler_app_search_providers` tool to find the provider ID"
        ),
        name: str | None = Field(
            default=None,
            description="Optional human-friendly name for the scan. Use descriptive names to identify scan purpose or context, e.g., 'Weekly Production Security Audit', 'Pre-Deployment Validation', 'Compliance Check Q4 2025'",
        ),
    ) -> dict[str, Any]:
        """Trigger a manual security scan for a provider.

        IMPORTANT: This tool returns immediately once the scan is created.
        The scan will continue running in the background. Use `prowler_app_get_scan`
        with the returned scan ID to monitor progress and check when it completes.

        Example Useful Workflow:
        1. Use `prowler_app_search_providers` to find the provider_id you want to scan
        2. Use this tool to trigger the scan
        3. Use `prowler_app_get_scan` with the returned scan 'id' to monitor progress
        4. Once completed, use `prowler_app_search_security_findings` to analyze results
        """
        try:
            # Build request data
            request_data: dict[str, Any] = {
                "data": {
                    "type": "scans",
                    "attributes": {},
                    "relationships": {
                        "provider": {
                            "data": {
                                "type": "providers",
                                "id": provider_id,
                            },
                        },
                    },
                },
            }
            if name:
                request_data["data"]["attributes"]["name"] = name

            # Create scan (returns Task)
            self.logger.info(f"Creating scan for provider {provider_id}")
            task_response = await self.api_client.post("/scans", json_data=request_data)

            scan_id = (
                task_response.get("data", {})
                .get("attributes", {})
                .get("task_args", {})
                .get("scan_id", None)
            )

            if not scan_id:
                raise Exception("No scan_id returned from scan creation")

            self.logger.info(f"Scan created successfully: {scan_id}")
            scan_response = await self.api_client.get(f"/scans/{scan_id}")
            scan_info = DetailedScan.from_api_response(scan_response["data"])

            return ScanCreationResult(
                scan=scan_info,
                status="success",
                message=f"Scan {scan_id} created successfully. The scan may take some time to complete. Use prowler_app_get_scan tool with this ID to monitor progress.",
            ).model_dump()

        except Exception as e:
            self.logger.error(f"Scan creation failed: {e}")
            return ScanCreationResult(
                scan=None,
                status="failed",
                message=f"Scan creation failed: {str(e)}",
            ).model_dump()

    async def schedule_daily_scan(
        self,
        provider_id: str = Field(
            description="Prowler's internal UUID (v4) for the provider to scan, generated when the provider was registered in the system (e.g., '4d0e2614-6385-4fa7-bf0b-c2e2f75c6877'). Use `prowler_app_search_providers` tool to find the provider ID"
        ),
    ) -> dict[str, Any]:
        """Schedule automated daily scans for a provider for continuous security monitoring.

        Creates a recurring daily scan schedule that will automatically trigger
        scans every 24 hours (starting from the moment the schedule is created).
        The schedule persists until manually removed and will execute even when
        you're not actively using the system.

        IMPORTANT: This tool returns immediately once the daily schedule is created.
        The schedule will be set up in the background. Use `prowler_app_list_scans`
        filtered by provider_id and trigger='scheduled' to view scheduled scans.

        IMPORTANT: This creates a PERSISTENT schedule. The provider will be scanned
        automatically every 24 hours until the provider is deleted.

        Example Useful Workflow:
        1. Use `prowler_app_search_providers` to find the provider_id you want to monitor
        2. Use this tool to create the daily schedule
        3. Use `prowler_app_list_scans` filtered by provider_id to view scheduled and completed scans
        4. Monitor findings over time with `prowler_app_search_security_findings`
        """
        self.logger.info(f"Creating daily schedule for provider {provider_id}")
        task_response = await self.api_client.post(
            "/schedules/daily",
            json_data={
                "data": {
                    "type": "daily-schedules",
                    "attributes": {
                        "provider_id": provider_id,
                    },
                },
            },
        )
        task_state = (
            task_response.get("data", {}).get("attributes", {}).get("state", None)
        )

        if task_state == "available":
            return_message = "Daily schedule created successfully. The schedule is being set up in the background. Use prowler_app_list_scans with provider_id filter to view scheduled scans."
        else:
            return_message = "Daily schedule creation failed. Please try again later."

        return ScheduleCreationResult(
            scheduled=(task_state == "available"),
            message=return_message,
        ).model_dump()

    async def update_scan(
        self,
        scan_id: str = Field(
            description="Prowler's internal UUID (v4) for the scan to update, generated when the scan was created (e.g., '123e4567-e89b-12d3-a456-426614174000'). Use `prowler_app_list_scans` tool to find the scan ID if you only know the provider or scan name. Returns an error if the scan ID is invalid or not found."
        ),
        name: str = Field(
            description="New human-friendly name for the scan (3-100 characters). Use descriptive names to improve organization and tracking, e.g., 'Production Security Audit - Q4 2025', 'Post-Deployment Compliance Check'. IMPORTANT: Only the scan name can be updated - other attributes (state, progress, duration) are read-only and managed by the system."
        ),
    ) -> dict[str, Any]:
        """Update a scan's name for better organization and tracking.

        IMPORTANT: Only the scan name can be updated. Other scan attributes
        (state, progress, duration, etc.) are read-only and managed by the system.

        Example Useful Workflow:
        1. Use `prowler_app_list_scans` to find the scan you want to rename
        2. Use this tool with the scan 'id' and new name
        """
        api_response = await self.api_client.patch(
            f"/scans/{scan_id}",
            json_data={
                "data": {
                    "type": "scans",
                    "id": scan_id,
                    "attributes": {"name": name},
                },
            },
        )
        detailed_scan = DetailedScan.from_api_response(api_response["data"])

        return detailed_scan.model_dump()
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/tools/__init__.py

```python
"""Domain-specific tools for Prowler App MCP Server.

Each module in this package contains a BaseTool subclass that registers
and implements tools for a specific domain (findings, providers, scans, etc.).

Tools are automatically discovered and loaded by the load_all_tools() function.
"""
```

--------------------------------------------------------------------------------

---[FILE: api_client.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/utils/api_client.py

```python
"""Shared API client utilities for Prowler App tools."""

import asyncio
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Dict

import httpx
from prowler_mcp_server.lib.logger import logger
from prowler_mcp_server.prowler_app.utils.auth import ProwlerAppAuth


class HTTPMethod(str, Enum):
    """HTTP methods enum."""

    GET = "GET"
    POST = "POST"
    PATCH = "PATCH"
    DELETE = "DELETE"


class SingletonMeta(type):
    """Metaclass that implements the Singleton pattern.

    This metaclass ensures that only one instance of a class exists.
    All calls to the constructor return the same instance.
    """

    _instances: Dict[type, Any] = {}

    def __call__(cls, *args, **kwargs):
        """Control instance creation to ensure singleton behavior."""
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class ProwlerAPIClient(metaclass=SingletonMeta):
    """Shared API client with smart defaults and helper methods.

    This class uses the Singleton pattern via metaclass to ensure only one
    instance exists across the application, reducing initialization overhead
    and enabling HTTP connection pooling.
    """

    def __init__(self) -> None:
        """Initialize the API client (only called once due to singleton pattern)."""
        self.auth_manager: ProwlerAppAuth = ProwlerAppAuth()
        self.client: httpx.AsyncClient = httpx.AsyncClient(timeout=30.0)

    async def _make_request(
        self,
        method: HTTPMethod,
        path: str,
        params: dict[str, any] | None = None,
        json_data: dict[str, any] | None = None,
    ) -> dict[str, any]:
        """Make authenticated API request.

        Args:
            method: HTTP method (GET, POST, PATCH, DELETE)
            path: API endpoint path
            params: Optional query parameters
            json_data: Optional JSON body data

        Returns:
            API response as dictionary

        Raises:
            Exception: If API request fails
        """
        try:
            token: str = await self.auth_manager.get_valid_token()
            url: str = f"{self.auth_manager.base_url}{path}"
            headers: dict[str, str] = self.auth_manager.get_headers(token)

            response: httpx.Response = await self.client.request(
                method=method.value,
                url=url,
                headers=headers,
                params=params,
                json=json_data,
            )
            response.raise_for_status()

            if not response.content:
                return {
                    "success": True,
                    "status_code": response.status_code,
                }
            else:
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error during {method.value} {path}: {e}")
            error_detail: str = ""
            try:
                error_data: dict[str, any] = e.response.json()
                error_detail = error_data.get("errors", [{}])[0].get("detail", "")
            except Exception:
                error_detail = e.response.text

            raise Exception(
                f"API request failed: {e.response.status_code} - {error_detail}"
            )
        except Exception as e:
            logger.error(f"Error during {method.value} {path}: {e}")
            raise

    async def get(
        self, path: str, params: dict[str, any] | None = None
    ) -> dict[str, any]:
        """Make GET request.

        Args:
            path: API endpoint path
            params: Optional query parameters

        Returns:
            API response as dictionary

        Raises:
            Exception: If API request fails
        """
        return await self._make_request(HTTPMethod.GET, path, params=params)

    async def post(
        self,
        path: str,
        params: dict[str, any] | None = None,
        json_data: dict[str, any] | None = None,
    ) -> dict[str, any]:
        """Make POST request.

        Args:
            path: API endpoint path
            params: Optional query parameters
            json_data: Optional JSON body data

        Returns:
            API response as dictionary

        Raises:
            Exception: If API request fails
        """
        return await self._make_request(
            HTTPMethod.POST, path, params=params, json_data=json_data
        )

    async def patch(
        self,
        path: str,
        params: dict[str, any] | None = None,
        json_data: dict[str, any] | None = None,
    ) -> dict[str, any]:
        """Make PATCH request.

        Args:
            path: API endpoint path
            params: Optional query parameters
            json_data: Optional JSON body data

        Returns:
            API response as dictionary

        Raises:
            Exception: If API request fails
        """
        return await self._make_request(
            HTTPMethod.PATCH, path, params=params, json_data=json_data
        )

    async def delete(
        self, path: str, params: dict[str, any] | None = None
    ) -> dict[str, any]:
        """Make DELETE request.

        Args:
            path: API endpoint path
            params: Optional query parameters

        Returns:
            API response as dictionary

        Raises:
            Exception: If API request fails
        """
        return await self._make_request(HTTPMethod.DELETE, path, params=params)

    async def poll_task_until_complete(
        self,
        task_id: str,
        timeout: int = 60,
        poll_interval: float = 1.0,
    ) -> dict[str, any]:
        """Poll a task until it reaches a terminal state.

        This method polls the task endpoint at regular intervals until the task
        completes, fails, or times out. It's designed for async operations like
        provider connection tests and deletions that return task IDs.

        Args:
            task_id: The UUID of the task to poll (UUID object or string)
            timeout: Maximum time to wait in seconds (default: 60)
            poll_interval: Time between polls in seconds (default: 1.0)

        Returns:
            The complete task response when terminal state is reached

        Raises:
            Exception: If task fails, is cancelled, or timeout is exceeded
        """
        terminal_states = {"completed", "failed", "cancelled"}
        start_time = asyncio.get_event_loop().time()
        max_time = start_time + timeout

        logger.info(
            f"Polling task {task_id} (timeout: {timeout}s, interval: {poll_interval}s)"
        )

        while True:
            # Check if we've exceeded the timeout
            current_time = asyncio.get_event_loop().time()
            if current_time >= max_time:
                raise Exception(
                    f"Task {task_id} polling timed out after {timeout} seconds. "
                    f"The task may still be running. Try increasing the timeout or check task status manually."
                )

            # Fetch current task state
            response = await self.get(f"/tasks/{task_id}")
            task_data = response.get("data", {})
            task_attrs = task_data.get("attributes", {})
            state = task_attrs.get("state")

            logger.debug(f"Task {task_id} state: {state}")

            # Check if we've reached a terminal state
            if state in terminal_states:
                if state == "completed":
                    logger.info(f"Task {task_id} completed successfully")
                    return response
                elif state == "failed":
                    error_msg = task_attrs.get("error", "Unknown error")
                    raise Exception(f"Task {task_id} failed: {error_msg}")
                elif state == "cancelled":
                    raise Exception(f"Task {task_id} was cancelled")

            # Wait before next poll
            await asyncio.sleep(poll_interval)

    def _validate_date_format(self, date_str: str, param_name: str) -> datetime:
        """Validate date string format.

        Args:
            date_str: Date string to validate
            param_name: Parameter name for error messages

        Returns:
            Parsed datetime object

        Raises:
            ValueError: If date format is invalid
        """
        try:
            return datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            raise ValueError(
                f"Invalid date format for {param_name}. Expected YYYY-MM-DD (e.g., '2025-01-15'), got '{date_str}'. "
                f"Full date required - partial dates like '2025' or '2025-01' are not accepted."
            )

    def validate_page_size(self, page_size: int) -> None:
        """Validate page size parameter.

        Args:
            page_size: Page size to validate

        Raises:
            ValueError: If page size is out of valid range (1-1000)
        """
        if page_size < 1 or page_size > 1000:
            raise ValueError(
                f"Invalid page_size: {page_size}. Must be between 1 and 1000 (inclusive)."
            )

    def normalize_date_range(
        self, date_from: str | None, date_to: str | None, max_days: int = 2
    ) -> tuple[str, str] | None:
        """Normalize and validate date range, auto-completing missing boundary.

        The Prowler API has a 2-day limit for historical queries. This helper:
        1. Returns None if no dates provided (signals: use latest/default endpoint)
        2. Auto-completes missing boundary to maintain 2-day window
        3. Validates the range doesn't exceed max_days

        Args:
            date_from: Start date (YYYY-MM-DD format) or None
            date_to: End date (YYYY-MM-DD format) or None
            max_days: Maximum allowed days between dates (default: 2)

        Returns:
            None if no dates provided, otherwise tuple of (date_from, date_to) as strings

        Raises:
            ValueError: If date range exceeds max_days or date format is invalid
        """
        if not date_from and not date_to:
            return None

        # Parse and validate provided dates
        from_date: datetime | None = (
            self._validate_date_format(date_from, "date_from") if date_from else None
        )
        to_date: datetime | None = (
            self._validate_date_format(date_to, "date_to") if date_to else None
        )

        # Auto-complete missing boundary to maintain max_days window
        if from_date and not to_date:
            to_date = from_date + timedelta(days=max_days - 1)
        elif to_date and not from_date:
            from_date = to_date - timedelta(days=max_days - 1)

        # Validate that date_from is before or equal to date_to
        if from_date > to_date:
            raise ValueError(
                f"Invalid date range: date_from must be before or equal to date_to. "
                f"Got date_from='{from_date.date()}' and date_to='{to_date.date()}'. "
                f"Please swap the dates or use the correct order."
            )

        # Validate range doesn't exceed max_days
        delta: int = (to_date - from_date).days + 1
        if delta > max_days:
            raise ValueError(
                f"Date range cannot exceed {max_days} days. "
                f"Requested range: {from_date.date()} to {to_date.date()} ({delta} days)"
            )

        return from_date.strftime("%Y-%m-%d"), to_date.strftime("%Y-%m-%d")

    def build_filter_params(
        self, params: dict[str, any], exclude_none: bool = True
    ) -> dict[str, any]:
        """Build filter parameters for API, converting types to API-compatible formats.

        Args:
            params: Dictionary of parameters
            exclude_none: If True, exclude None values from result

        Returns:
            Cleaned parameter dictionary ready for API
        """
        result: dict[str, any] = {}
        for key, value in params.items():
            if value is None and exclude_none:
                continue

            # Convert boolean values to lowercase strings for API compatibility
            if isinstance(value, bool):
                result[key] = str(value).lower()
            # Convert lists/arrays to comma-separated strings
            elif isinstance(value, (list, tuple)):
                result[key] = ",".join(str(v) for v in value)
            else:
                result[key] = value

        return result
```

--------------------------------------------------------------------------------

---[FILE: auth.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/utils/auth.py

```python
import base64
import json
import os
from datetime import datetime
from typing import Dict, Optional

from fastmcp.server.dependencies import get_http_headers
from prowler_mcp_server import __version__
from prowler_mcp_server.lib.logger import logger


class ProwlerAppAuth:
    """Handles authentication for Prowler App API using API keys or JWT tokens."""

    def __init__(
        self,
        mode: str = os.getenv("PROWLER_MCP_TRANSPORT_MODE", "stdio"),
        base_url: str = os.getenv("API_BASE_URL", "https://api.prowler.com/api/v1"),
    ):
        self.base_url = base_url.rstrip("/")
        logger.info(f"Using Prowler App API base URL: {self.base_url}")
        self.mode = mode
        self.access_token: Optional[str] = None
        self.api_key: Optional[str] = None

        if mode == "stdio":  # STDIO mode
            self.api_key = os.getenv("PROWLER_APP_API_KEY")

            if not self.api_key:
                raise ValueError("PROWLER_APP_API_KEY environment variable is required")

            if not self.api_key.startswith("pk_"):
                raise ValueError("Prowler App API key format is incorrect")

    def _parse_jwt(self, token: str) -> Optional[Dict]:
        """Parse JWT token and return payload

        Args:
            token: JWT token to parse

        Returns:
            Parsed JWT payload, or None if parsing fails
        """
        if not token:
            return None

        try:
            parts = token.split(".")
            if len(parts) != 3:
                return None

            # Decode base64url
            base64_payload = parts[1]
            # Replace base64url characters
            base64_payload = base64_payload.replace("-", "+").replace("_", "/")

            # Add padding if necessary
            while len(base64_payload) % 4:
                base64_payload += "="

            # Decode and parse JSON
            decoded = base64.b64decode(base64_payload).decode("utf-8")
            return json.loads(decoded)
        except Exception as e:
            logger.warning(f"Failed to parse JWT token: {e}")
            return None

    async def authenticate(self) -> str:
        """Authenticate and return token (API key for STDIO, API key or JWT for HTTP)."""
        if self.mode == "http":
            headers = get_http_headers()
            authorization_header = headers.get("authorization", None)

            if not authorization_header:
                raise ValueError("No authorization header provided")

            # Extract token from Bearer header
            if authorization_header.startswith("Bearer "):
                token = authorization_header.replace("Bearer ", "")
            else:
                raise ValueError(
                    "Invalid authorization header format. Expected 'Bearer <token>'"
                )

            # Check if it's an API key or JWT token
            if token.startswith("pk_"):
                # API key - no expiration check needed
                return token
            else:
                # JWT token - validate and check expiration
                payload = self._parse_jwt(token)
                if not payload:
                    raise ValueError("Invalid JWT token format")

                # Check if token is expired
                now = int(datetime.now().timestamp())
                exp = payload.get("exp", 0)
                if exp <= now:
                    raise ValueError("Token has expired")

                return token
        else:
            raise ValueError(f"Invalid mode: {self.mode}")

    async def get_valid_token(self) -> str:
        """Get a valid token (API key or JWT token)."""
        if self.mode == "stdio" and self.api_key:
            return self.api_key
        else:
            return await self.authenticate()

    def get_headers(self, token: str) -> Dict[str, str]:
        """Get headers for API requests with authentication."""
        if token.startswith("pk_"):
            authorization_header = f"Api-Key {token}"
        else:
            authorization_header = f"Bearer {token}"

        headers = {
            "Authorization": authorization_header,
            "Content-Type": "application/vnd.api+json",
            "Accept": "application/vnd.api+json",
            "User-Agent": f"prowler-mcp-server/{__version__}",
        }

        return headers
```

--------------------------------------------------------------------------------

---[FILE: tool_loader.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/utils/tool_loader.py

```python
"""Utility for auto-discovering and loading MCP tools.

This module provides functionality to automatically discover and register
all BaseTool subclasses from the tools package.
"""

import importlib
import pkgutil

from fastmcp import FastMCP
from prowler_mcp_server.lib.logger import logger
from prowler_mcp_server.prowler_app.tools.base import BaseTool


def load_all_tools(mcp: FastMCP) -> None:
    """Auto-discover and load all BaseTool subclasses from the tools package.

    This function:
    1. Dynamically imports all Python modules in the tools package
    2. Discovers all concrete BaseTool subclasses
    3. Instantiates each tool class
    4. Registers all tools with the provided FastMCP instance

    Args:
        mcp: The FastMCP instance to register tools with
        TOOLS_PACKAGE: The package path containing tool modules (default: prowler_mcp_server.prowler_app.tools)

    Example:
        from fastmcp import FastMCP
        from prowler_mcp_server.prowler_app.utils.tool_loader import load_all_tools

        app = FastMCP("prowler-app")
        load_all_tools(app)
    """
    TOOLS_PACKAGE = "prowler_mcp_server.prowler_app.tools"
    logger.info(f"Auto-discovering tools from package: {TOOLS_PACKAGE}")

    # Import the tools package
    try:
        tools_module = importlib.import_module(TOOLS_PACKAGE)
    except ImportError as e:
        logger.error(f"Failed to import tools package {TOOLS_PACKAGE}: {e}")
        return

    # Get the package path
    if hasattr(tools_module, "__path__"):
        package_path = tools_module.__path__
    else:
        logger.error(f"Package {TOOLS_PACKAGE} has no __path__ attribute")
        return

    # Import all modules in the package
    for _, module_name, _ in pkgutil.iter_modules(package_path):
        try:
            full_module_name = f"{TOOLS_PACKAGE}.{module_name}"
            importlib.import_module(full_module_name)
            logger.debug(f"Imported module: {full_module_name}")
        except Exception as e:
            logger.error(f"Failed to import module {module_name}: {e}")

    # Discover all concrete BaseTool subclasses
    concrete_tools = [
        tool_class
        for tool_class in BaseTool.__subclasses__()
        if not getattr(tool_class, "__abstractmethods__", None)
    ]

    logger.info(f"Discovered {len(concrete_tools)} tool classes")

    # Instantiate and register each tool
    for tool_class in concrete_tools:
        try:
            tool_instance = tool_class()
            tool_instance.register_tools(mcp)
            logger.info(f"Loaded and registered: {tool_class.__name__}")
        except Exception as e:
            logger.error(f"Failed to load tool {tool_class.__name__}: {e}")

    logger.info("Tool loading complete")
```

--------------------------------------------------------------------------------

````
