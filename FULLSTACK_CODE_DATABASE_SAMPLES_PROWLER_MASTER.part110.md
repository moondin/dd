---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 110
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 110 of 867)

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

---[FILE: findings.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/tools/findings.py
Signals: Pydantic

```python
"""Security Findings tools for Prowler App MCP Server.

This module provides tools for searching, viewing, and analyzing security findings
across all cloud providers.
"""

from typing import Any, Literal

from pydantic import Field

from prowler_mcp_server.prowler_app.models.findings import (
    DetailedFinding,
    FindingsListResponse,
    FindingsOverview,
)
from prowler_mcp_server.prowler_app.tools.base import BaseTool


class FindingsTools(BaseTool):
    """Tools for security findings operations.

    Provides tools for:
    - search_security_findings: Fast and lightweight searching across findings
    - get_finding_details: Get complete details for a specific finding
    - get_findings_overview: Get aggregate statistics and trends across all findings
    """

    async def search_security_findings(
        self,
        severity: list[
            Literal["critical", "high", "medium", "low", "informational"]
        ] = Field(
            default=[],
            description="Filter by severity levels. Multiple values allowed: critical, high, medium, low, informational. If empty, all severities are returned.",
        ),
        status: list[Literal["FAIL", "PASS", "MANUAL"]] = Field(
            default=["FAIL"],
            description="Filter by finding status. Multiple values allowed: FAIL (security issue found), PASS (no issue found), MANUAL (requires manual verification). Default: ['FAIL'] - only returns findings with security issues. To get all findings, pass an empty list [].",
        ),
        provider_type: list[str] = Field(
            default=[],
            description="Filter by cloud provider type. Multiple values allowed. If the parameter is not provided, all providers are returned. For valid values, please refer to Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server.",
        ),
        provider_alias: str | None = Field(
            default=None,
            description="Filter by specific provider alias/name (partial match supported)",
        ),
        region: list[str] = Field(
            default=[],
            description="Filter by cloud regions. Multiple values allowed (e.g., us-east-1, eu-west-1). If empty, all regions are returned.",
        ),
        service: list[str] = Field(
            default=[],
            description="Filter by cloud service. Multiple values allowed (e.g., s3, ec2, iam, keyvault). If empty, all services are returned.",
        ),
        resource_type: list[str] = Field(
            default=[],
            description="Filter by resource type. Multiple values allowed. If empty, all resource types are returned.",
        ),
        check_id: list[str] = Field(
            default=[],
            description="Filter by specific security check IDs. Multiple values allowed. If empty, all check IDs are returned.",
        ),
        muted: (
            bool | str | None
        ) = Field(  # Wrong `str` hint type due to bad MCP Clients implementation
            default=None,
            description="Filter by muted status. True for muted findings only, False for active findings only. If not specified, returns both",
        ),
        delta: list[Literal["new", "changed"]] = Field(
            default=[],
            description="Show only new or changed findings. Multiple values allowed: new (not seen in previous scans), changed (modified since last scan). If empty, all findings are returned.",
        ),
        date_from: str | None = Field(
            default=None,
            description="Start date for range query in ISO 8601 format (YYYY-MM-DD, e.g., '2025-01-15'). Full date required - partial dates like '2025' or '2025-01' are not accepted. IMPORTANT: Maximum date range is 2 days. If only date_from is provided, date_to is automatically set to 2 days later. If only one boundary is provided, the other will be auto-calculated to maintain the 2-day window.",
        ),
        date_to: str | None = Field(
            default=None,
            description="End date for range query in ISO 8601 format (YYYY-MM-DD, e.g., '2025-01-15'). Full date required - partial dates are not accepted. If only date_to is provided, date_from is automatically set to 2 days earlier. Can be used alone or with date_from.",
        ),
        search: str | None = Field(
            default=None, description="Free-text search term across finding details"
        ),
        page_size: int = Field(
            default=50, description="Number of results to return per page"
        ),
        page_number: int = Field(
            default=1, description="Page number to retrieve (1-indexed)"
        ),
    ) -> dict[str, Any]:
        """Search and filter security findings across all cloud providers with rich filtering capabilities.

        IMPORTANT: This tool returns LIGHTWEIGHT findings. Use this for fast searching and filtering across many findings.
        For complete details use prowler_app_get_finding_details on specific findings.

        Default behavior:
        - Returns latest findings from most recent scans (no date parameters needed)
        - Filters to FAIL status only (security issues found)
        - Returns 50 results per page

        Date filtering:
        - Without dates: queries findings from the most recent completed scan across all providers (most efficient)
        - With dates: queries historical findings (2-day maximum range between date_from and date_to)

        Each finding includes:
        - Core identification: id (UUID for get_finding_details), uid, check_id
        - Security context: status (FAIL/PASS/MANUAL), severity (critical/high/medium/low/informational)
        - State tracking: delta (new/changed/unchanged), muted (boolean), muted_reason
        - Extended details: status_extended with additional context

        Workflow:
        1. Use this tool to search and filter findings by severity, status, provider, service, region, etc.
        2. Use prowler_app_get_finding_details with the finding 'id' to get complete information about the finding
        """
        # Validate page_size parameter
        self.api_client.validate_page_size(page_size)

        # Determine endpoint based on date parameters
        date_range = self.api_client.normalize_date_range(
            date_from, date_to, max_days=2
        )

        if date_range is None:
            # No dates provided - use latest findings endpoint
            endpoint = "/findings/latest"
            params = {}
        else:
            # Dates provided - use historical findings endpoint
            endpoint = "/findings"
            params = {
                "filter[inserted_at__gte]": date_range[0],
                "filter[inserted_at__lte]": date_range[1],
            }

        # Build filter parameters
        if severity:
            params["filter[severity__in]"] = severity
        if status:
            params["filter[status__in]"] = status
        if provider_type:
            params["filter[provider_type__in]"] = provider_type
        if provider_alias:
            params["filter[provider_alias__icontains]"] = provider_alias
        if region:
            params["filter[region__in]"] = region
        if service:
            params["filter[service__in]"] = service
        if resource_type:
            params["filter[resource_type__in]"] = resource_type
        if check_id:
            params["filter[check_id__in]"] = check_id
        if muted is not None:
            params["filter[muted]"] = (
                muted if isinstance(muted, bool) else muted == "true"
            )
        if delta:
            params["filter[delta__in]"] = delta
        if search:
            params["filter[search]"] = search

        # Pagination
        params["page[size]"] = page_size
        params["page[number]"] = page_number

        # Return only LLM-relevant fields
        params["fields[findings]"] = (
            "uid,status,severity,check_id,check_metadata,status_extended,delta,muted,muted_reason"
        )
        params["sort"] = "severity,-inserted_at"

        # Convert lists to comma-separated strings
        clean_params = self.api_client.build_filter_params(params)

        # Get API response and transform to simplified format
        api_response = await self.api_client.get(endpoint, params=clean_params)
        simplified_response = FindingsListResponse.from_api_response(api_response)

        return simplified_response.model_dump()

    async def get_finding_details(
        self,
        finding_id: str = Field(
            description="UUID of the finding to retrieve (must be a valid UUID format, e.g., '019ac0d6-90d5-73e9-9acf-c22e256f1bac'). Returns an error if the finding ID is invalid or not found."
        ),
    ) -> dict[str, Any]:
        """Retrieve comprehensive details about a specific security finding by its ID.

        IMPORTANT: This tool returns COMPLETE finding details.
        Use this after finding a specific finding via prowler_app_search_security_findings

        This tool provides ALL information that prowler_app_search_security_findings returns PLUS:

        1. Check Metadata (information about the check script that generated the finding):
           - title: Human-readable phrase used to summarize the check
           - description: Detailed explanation of what the check validates and why it is important
           - risk: What could happen if this check fails
           - remediation: Complete remediation guidance including step-by-step instructions and code snippets with best practices to fix the issue:
             * cli: Command-line commands to fix the issue
             * terraform: Terraform code snippets with best practices
             * nativeiac: Provider native Infrastructure as Code code snippets with best practices to fix the issue
             * other: Other remediation code snippets with best practices, usually used for web interfaces or other tools
             * recommendation: Text description with general best recommended practices to avoid the issue
           - provider: Cloud provider (aws/azure/gcp/etc)
           - service: Service name (s3/ec2/keyvault/etc)
           - resource_type: Resource type being evaluated
           - categories: Security categories this check belongs to
           - additional_urls: List of additional URLs related to the check

        2. Temporal Metadata:
           - inserted_at: When this finding was first inserted into database
           - updated_at: When this finding was last updated
           - first_seen_at: When this finding was first detected across all scans

        3. Relationships:
           - scan_id: UUID of the scan that generated this finding
           - resource_ids: List of UUIDs for cloud resources associated with this finding

        Workflow:
        1. Use prowler_app_search_security_findings to browse and filter findings
        2. Use this tool with the finding 'id' to get remediation guidance and complete context
        """
        params = {
            # Return comprehensive fields including temporal metadata
            "fields[findings]": "uid,status,severity,check_id,check_metadata,status_extended,delta,muted,muted_reason,inserted_at,updated_at,first_seen_at",
            # Include relationships to scan and resources
            "include": "scan,resources",
        }

        # Get API response and transform to detailed format
        api_response = await self.api_client.get(
            f"/findings/{finding_id}", params=params
        )
        detailed_finding = DetailedFinding.from_api_response(
            api_response.get("data", {})
        )

        return detailed_finding.model_dump()

    async def get_findings_overview(
        self,
        provider_type: list[str] = Field(
            default=[],
            description="Filter statistics by cloud provider. Multiple values allowed. If empty, all providers are returned. For valid values, please refer to Prowler Hub/Prowler Documentation that you can also find in form of tools in this MCP Server.",
        ),
    ) -> dict[str, Any]:
        """Get aggregate statistics and trends about security findings as a markdown report.

        This tool provides a HIGH-LEVEL OVERVIEW without retrieving individual findings. Use this when you
        need to understand the overall security posture, trends, or remediation progress across all findings.

        The markdown report includes:

        1. Summary Statistics:
           - Total number of findings
           - Failed checks (security issues) with percentage
           - Passed checks (no issues) with percentage
           - Muted findings (user-suppressed) with percentage

        2. Delta Analysis (Change Tracking):
           - New findings: never seen before in previous scans
             * Broken down by: new failures, new passes, new muted
           - Changed findings: status changed since last scan
             * Broken down by: changed to fail, changed to pass, changed to muted
           - Unchanged findings: same status as previous scan

        This helps answer questions like:
        - "What's my overall security posture?"
        - "How many critical security issues do I have?"
        - "Are we improving or getting worse over time?"
        - "How many new security issues appeared since last scan?"
        """
        params = {
            # Return only LLM-relevant aggregate statistics
            "fields[findings-overview]": "new,changed,fail_new,fail_changed,pass_new,pass_changed,muted_new,muted_changed,total,fail,muted,pass"
        }

        if provider_type:
            params["filter[provider_type__in]"] = provider_type

        clean_params = self.api_client.build_filter_params(params)

        # Get API response and transform to simplified format
        api_response = await self.api_client.get(
            "/overviews/findings", params=clean_params
        )
        overview = FindingsOverview.from_api_response(api_response)

        # Format as markdown report
        total = overview.total
        fail = overview.fail
        passed = overview.passed
        muted = overview.muted
        new = overview.new
        changed = overview.changed

        # Calculate percentages
        fail_pct = (fail / total * 100) if total > 0 else 0
        passed_pct = (passed / total * 100) if total > 0 else 0
        muted_pct = (muted / total * 100) if total > 0 else 0
        unchanged = total - new - changed

        # Build markdown report
        report = f"""# Security Findings Overview

## Summary Statistics
- **Total Findings**: {total:,}
- **Failed Checks**: {fail:,} ({fail_pct:.1f}%)
- **Passed Checks**: {passed:,} ({passed_pct:.1f}%)
- **Muted Findings**: {muted:,} ({muted_pct:.1f}%)

## Delta Analysis
- **New Findings**: {new:,}
  - New failures: {overview.fail_new:,}
  - New passes: {overview.pass_new:,}
  - New muted: {overview.muted_new:,}
- **Changed Findings**: {changed:,}
  - Changed to fail: {overview.fail_changed:,}
  - Changed to pass: {overview.pass_changed:,}
  - Changed to muted: {overview.muted_changed:,}
- **Unchanged**: {unchanged:,}
"""

        return {"report": report}
```

--------------------------------------------------------------------------------

---[FILE: muting.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/tools/muting.py
Signals: Pydantic

```python
"""Muting tools for Prowler App MCP Server.

This module provides tools for managing finding muting in Prowler, including:
- Mutelist management (pattern-based bulk muting)
- Mute rules management (finding-specific muting)
"""

import json
from typing import Any

from pydantic import Field

from prowler_mcp_server.prowler_app.models.muting import (
    DetailedMuteRule,
    MutelistResponse,
    MuteRulesListResponse,
)
from prowler_mcp_server.prowler_app.tools.base import BaseTool


class MutingTools(BaseTool):
    """Tools for muting operations.

    Provides tools for:
    - Managing mutelist (pattern-based bulk muting)
    - Managing mute rules (finding-specific muting)
    """

    # ===== MUTELIST TOOLS =====

    async def get_mutelist(self) -> dict[str, Any]:
        """Retrieve the current mutelist configuration for the tenant.

        IMPORTANT: Only one mutelist can exist per tenant. Returns an error message if no mutelist exists.
        For detailed information about mutelist structure and configuration, search Prowler documentation
        using prowler_docs_search tool available in this MCP Server.

        The mutelist includes:
        - Core identification: id (UUID for processor operations)
        - Configuration: Nested structure with Accounts → Checks → Regions/Resources/Tags/Exceptions patterns
        - Temporal data: inserted_at, updated_at timestamps

        Workflow:
        1. Use this tool to check if a mutelist is configured
        2. Examine current muting patterns before making updates
        3. Use prowler_app_set_mutelist to create or update the configuration
        """
        self.logger.info("Retrieving mutelist configuration...")

        # Query processors filtered by type=mutelist
        params = {
            "filter[processor_type]": "mutelist",
            "fields[processors]": "processor_type,configuration,inserted_at,updated_at",
        }

        clean_params = self.api_client.build_filter_params(params)
        api_response = await self.api_client.get("/processors", params=clean_params)

        data = api_response.get("data", [])

        if len(data) == 0:
            return {
                "error": "No mutelist found",
                "message": "No mutelist configuration exists for this tenant. Use prowler_app_set_mutelist to create one.",
            }

        # Return the first (and only) mutelist
        mutelist = MutelistResponse.from_api_response(data[0])
        return mutelist.model_dump()

    async def set_mutelist(
        self,
        configuration: dict[str, Any] | str = Field(
            description="""Mutelist configuration object following the Accounts/Checks/Regions/Resources/Tags/Exceptions structure.
Accepts either a dictionary or JSON string. The configuration replaces the entire mutelist (not merged with existing).

Structure:
{
    "Mutelist": {
        "Accounts": {
            "<account-pattern>": {  // "*" for all accounts, or specific account ID
                "Checks": {
                    "<check-id>": {  // Prowler check ID
                        "Regions": ["us-east-1", "eu-west-1"],  // Optional
                        "Resources": ["arn:aws:s3:::my-bucket"],  // Optional
                        "Tags": ["Environment:dev"],  // Optional
                        "Exceptions": {  // Optional
                            "Accounts": ["123456789012"],
                            "Regions": ["us-west-2"],
                            "Resources": ["arn:aws:s3:::critical-bucket"]
                        }
                    }
                }
            }
        }
    }
}"""
        ),
    ) -> dict[str, Any]:
        """Create or update the mutelist configuration for pattern-based bulk muting.

        IMPORTANT: Automatically creates a new mutelist or updates the existing one (only one mutelist per tenant).
        The configuration completely replaces any existing mutelist (not merged).
        For detailed information about mutelist structure and configuration, search Prowler documentation
        using prowler_docs_search tool available in this MCP Server.

        Default behavior:
        - Creates new mutelist if none exists
        - Updates existing mutelist with complete replacement
        - Applies to findings from future scans

        The mutelist supports:
        - Account patterns: Specific account IDs or "*" for all
        - Check-based muting: Per-check ID configuration
        - Scope filtering: Regions, Resources, Tags
        - Exceptions: Accounts, Regions, Resources to exclude from muting

        Workflow:
        1. Use prowler_app_get_mutelist to check existing configuration
        2. Build configuration object following Prowler mutelist format
        3. Use this tool to create or update the mutelist
        4. Verify with prowler_app_get_mutelist
        """
        self.logger.info("Setting mutelist configuration...")

        # Parse configuration if it's a string
        if isinstance(configuration, str):
            configuration = json.loads(configuration)

        # Check if mutelist already exists
        existing_mutelist = await self.get_mutelist()

        if "error" in existing_mutelist:
            # Create new mutelist
            self.logger.info("Creating new mutelist...")
            create_body = {
                "data": {
                    "type": "processors",
                    "attributes": {
                        "processor_type": "mutelist",
                        "configuration": configuration,
                    },
                }
            }

            api_response = await self.api_client.post(
                "/processors", json_data=create_body
            )
            mutelist = MutelistResponse.from_api_response(api_response.get("data", {}))
            return mutelist.model_dump()
        else:
            # Update existing mutelist
            self.logger.info(f"Updating existing mutelist {existing_mutelist['id']}...")
            update_body = {
                "data": {
                    "type": "processors",
                    "id": existing_mutelist["id"],
                    "attributes": {
                        "configuration": configuration,
                    },
                }
            }

            api_response = await self.api_client.patch(
                f"/processors/{existing_mutelist['id']}", json_data=update_body
            )
            mutelist = MutelistResponse.from_api_response(api_response.get("data", {}))
            return mutelist.model_dump()

    async def delete_mutelist(self) -> dict[str, Any]:
        """Remove the mutelist configuration from the tenant.

        WARNING: This is a destructive operation that cannot be undone.
        - The mutelist will need to be re-created with prowler_app_set_mutelist
        - New findings from future scans will NOT be muted by the deleted mutelist
        - Previously muted findings remain muted (deletion doesn't un-mute them)

        Workflow:
        1. Use prowler_app_get_mutelist to confirm what will be deleted
        2. Use this tool to permanently remove the mutelist
        3. New scans will no longer apply mutelist-based muting
        """
        self.logger.info("Deleting mutelist configuration...")

        # Get existing mutelist
        existing_mutelist = await self.get_mutelist()

        if "error" in existing_mutelist:
            return {
                "success": False,
                "message": "No mutelist found to delete",
            }

        # Delete the mutelist
        mutelist_id = existing_mutelist["id"]
        await self.api_client.delete(f"/processors/{mutelist_id}")

        return {
            "success": True,
            "message": "Mutelist deleted successfully",
        }

    # ===== MUTE RULES TOOLS =====

    async def list_mute_rules(
        self,
        name: str | None = Field(
            default=None,
            description="Filter by exact rule name",
        ),
        enabled: (
            bool | str | None
        ) = Field(  # Wrong `str` hint type due to bad MCP Clients implementation
            default=None,
            description="Filter by enabled status. True for enabled rules only, False for disabled rules only. If not specified, returns both enabled and disabled rules. Strings 'true' and 'false' are also accepted.",
        ),
        search: str | None = Field(
            default=None,
            description="Free-text search term across multiple fields (name, reason). Use this for general keyword search.",
        ),
        page_size: int = Field(
            default=50, description="Number of results to return per page."
        ),
        page_number: int = Field(
            default=1,
            description="Page number to retrieve (1-indexed)",
        ),
    ) -> dict[str, Any]:
        """Search and filter mute rules with pagination support.

        IMPORTANT: This tool returns LIGHTWEIGHT mute rules without the full list of finding UIDs.
        Use prowler_app_get_mute_rule to get complete details including all finding UIDs and creator information.

        Default behavior:
        - Returns all mute rules (both enabled and disabled)
        - Returns 50 rules per page
        - Includes basic rule information without full finding UID lists

        Each mute rule includes:
        - Core identification: id (UUID for prowler_app_get_mute_rule), name
        - Contextual information: reason, enabled status
        - State tracking: finding_count (number of findings currently muted)
        - Temporal data: inserted_at, updated_at timestamps

        Workflow:
        1. Use this tool to search and filter mute rules by name, enabled status, or keywords
        2. Use prowler_app_get_mute_rule with the mute rule 'id' to get complete details including all finding UIDs
        3. Use prowler_app_update_mute_rule or prowler_app_delete_mute_rule to modify rules
        """
        self.logger.info("Listing mute rules...")
        self.api_client.validate_page_size(page_size)

        params = {
            "fields[mute-rules]": "name,reason,enabled,finding_uids,inserted_at,updated_at",
            "page[size]": page_size,
            "page[number]": page_number,
        }

        # Build filter parameters
        if name:
            params["filter[name]"] = name
        if enabled is not None:
            if isinstance(enabled, bool):
                params["filter[enabled]"] = enabled
            else:
                if enabled.lower() == "true":
                    params["filter[enabled]"] = True
                elif enabled.lower() == "false":
                    params["filter[enabled]"] = False
                else:
                    raise ValueError(
                        f"Invalid enabled value: {enabled}. Valid values are True, False, 'true', 'false' or None."
                    )
        if search:
            params["filter[search]"] = search

        clean_params = self.api_client.build_filter_params(params)
        api_response = await self.api_client.get("/mute-rules", params=clean_params)

        simplified_response = MuteRulesListResponse.from_api_response(api_response)
        return simplified_response.model_dump()

    async def get_mute_rule(
        self,
        rule_id: str = Field(
            description="UUID of the mute rule to retrieve. Must be a valid UUID format (e.g., '019ac0d6-90d5-73e9-9acf-c22e256f1bac')."
        ),
    ) -> dict[str, Any]:
        """Retrieve comprehensive details about a specific mute rule by its ID.

        IMPORTANT: This tool returns COMPLETE mute rule details including the full list of finding UIDs.
        Use this after finding a rule via prowler_app_list_mute_rules.

        This tool provides ALL information that prowler_app_list_mute_rules returns PLUS:
        - finding_uids: Complete list of finding UIDs that are muted by this rule
        - user_creator_id: UUID of the user who created the rule (audit trail)

        Workflow:
        1. Use prowler_app_list_mute_rules to find rules by name or filter criteria
        2. Use this tool with the rule 'id' to get complete details
        3. Examine finding_uids list to understand which findings are muted
        4. Use prowler_app_update_mute_rule or prowler_app_delete_mute_rule to modify if needed
        """
        self.logger.info(f"Retrieving mute rule {rule_id}...")

        params = {
            "include": "created_by",
        }

        api_response = await self.api_client.get(
            f"/mute-rules/{rule_id}", params=params
        )

        detailed_rule = DetailedMuteRule.from_api_response(api_response.get("data", {}))
        return detailed_rule.model_dump()

    async def create_mute_rule(
        self,
        name: str = Field(
            description="Name for the mute rule. Should be descriptive and meaningful (e.g., 'Dev S3 Public Access', 'Test Environment IMDSv1')."
        ),
        reason: str = Field(
            description="Reason for muting these findings. Document why this security issue is acceptable or intentional (e.g., 'Development environment with controlled access', 'Legacy application requires IMDSv1')."
        ),
        finding_ids: list[str] = Field(
            description="List of finding IDs (UUIDs) to mute. Get these from the prowler_app_search_security_findings tool. Must provide at least 1 finding ID."
        ),
    ) -> dict[str, Any]:
        """Create a new mute rule to mute specific findings with documentation and audit trail.

        IMPORTANT: This immediately mutes the specified findings AND all previous findings with matching UIDs (this could take some time to complete).
        The rule is enabled by default. Muting is permanent.

        Default behavior:
        - Rule is created in enabled state
        - Applies to current and previous findings with matching UIDs
        - Records creator for audit trail

        The mute rule includes:
        - Core identification: id (UUID for prowler_app_get_mute_rule), name, reason
        - Configuration: enabled status, finding_uids list
        - Audit trail: user_creator_id (UUID of the Prowler user from the tenant that created the rule), timestamps when the rule was created and last modified

        Workflow:
        1. Use prowler_app_search_security_findings to identify findings to mute
        2. Use this tool with finding IDs, descriptive name, and documented reason
        3. Verify with prowler_app_get_mute_rule to confirm rule creation
        4. Check findings are muted with prowler_app_search_security_findings (filter by muted=true)
        """
        self.logger.info(f"Creating mute rule '{name}'...")

        create_body = {
            "data": {
                "type": "mute-rules",
                "attributes": {
                    "name": name,
                    "reason": reason,
                    "finding_ids": finding_ids,
                },
            }
        }

        api_response = await self.api_client.post("/mute-rules", json_data=create_body)

        detailed_rule = DetailedMuteRule.from_api_response(api_response.get("data", {}))
        return detailed_rule.model_dump()

    async def update_mute_rule(
        self,
        rule_id: str = Field(
            description="UUID of the mute rule to update. Must be a valid UUID format."
        ),
        name: str | None = Field(
            default=None,
            description="New name for the rule. If not specified, name remains unchanged.",
        ),
        reason: str | None = Field(
            default=None,
            description="New reason for the rule. If not specified, reason remains unchanged.",
        ),
        enabled: bool | None = Field(
            default=None,
            description="Enable (True) or disable (False) the rule. If not specified, enabled status remains unchanged. IMPORTANT: Disabling a rule does not un-mute findings - they remain muted.",
        ),
    ) -> dict[str, Any]:
        """Update a mute rule's name, reason, or enabled status.

        IMPORTANT: Cannot change which findings are muted (finding_uids are immutable).
        Disabling a rule does NOT un-mute findings - they remain muted permanently.

        Default behavior:
        - Only specified fields are updated
        - Unspecified fields remain unchanged
        - If no parameters provided, returns current rule state

        Updatable fields:
        - name: Change rule name for better organization
        - reason: Update documentation/justification
        - enabled: Toggle rule active status (doesn't affect already-muted findings)

        Workflow:
        1. Use prowler_app_get_mute_rule to see current rule state
        2. Use this tool to update name, reason, or enabled status
        3. Verify changes with prowler_app_get_mute_rule
        """
        self.logger.info(f"Updating mute rule {rule_id}...")

        # Build update body with only provided fields
        attributes = {}
        if name is not None:
            attributes["name"] = name
        if reason is not None:
            attributes["reason"] = reason
        if enabled is not None:
            attributes["enabled"] = enabled

        if not attributes:
            # No updates provided, just return current state
            return await self.get_mute_rule(rule_id)

        update_body = {
            "data": {
                "type": "mute-rules",
                "id": rule_id,
                "attributes": attributes,
            }
        }

        api_response = await self.api_client.patch(
            f"/mute-rules/{rule_id}", json_data=update_body
        )

        detailed_rule = DetailedMuteRule.from_api_response(api_response.get("data", {}))
        return detailed_rule.model_dump()

    async def delete_mute_rule(
        self,
        rule_id: str = Field(
            description="UUID of the mute rule to delete. Must be a valid UUID format."
        ),
    ) -> dict[str, Any]:
        """Delete a mute rule from the system.

        WARNING: Findings that were muted by this rule REMAIN MUTED after deletion.
        This only removes the rule itself from management, not the muting effect on findings.
        The muted findings will stay muted permanently.

        Deletion behavior:
        - Rule is permanently removed from the system
        - Muted findings remain muted (deletion doesn't un-mute them)
        - Cannot be undone - rule must be recreated to restore

        Workflow:
        1. Use prowler_app_get_mute_rule to review what will be deleted
        2. Use this tool to permanently remove the rule
        3. Verify deletion with prowler_app_list_mute_rules (rule should no longer appear)
        """
        self.logger.info(f"Deleting mute rule {rule_id}...")

        result = await self.api_client.delete(f"/mute-rules/{rule_id}")

        if result.get("success"):
            return {
                "success": True,
                "message": "Mute rule deleted successfully",
            }
        else:
            return {
                "success": False,
                "message": "Failed to delete mute rule",
            }
```

--------------------------------------------------------------------------------

````
