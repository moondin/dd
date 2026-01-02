---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 108
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 108 of 867)

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

---[FILE: main.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/main.py

```python
import argparse
import os
import sys

from prowler_mcp_server.lib.logger import logger


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Prowler MCP Server")
    parser.add_argument(
        "--transport",
        choices=["stdio", "http"],
        default=None,
        help="Transport method (default: stdio)",
    )
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="Host to bind to for HTTP transport (default: 127.0.0.1)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Port to bind to for HTTP transport (default: 8000)",
    )
    return parser.parse_args()


def main():
    """Main entry point for the MCP server."""
    try:
        args = parse_arguments()

        if args.transport is None:
            args.transport = os.getenv("PROWLER_MCP_TRANSPORT_MODE", "stdio")
        else:
            os.environ["PROWLER_MCP_TRANSPORT_MODE"] = args.transport

        from prowler_mcp_server.server import prowler_mcp_server

        if args.transport == "stdio":
            prowler_mcp_server.run(transport=args.transport, show_banner=False)
        elif args.transport == "http":
            prowler_mcp_server.run(
                transport=args.transport,
                host=args.host,
                port=args.port,
                show_banner=False,
            )
        else:
            logger.error(f"Invalid transport: {args.transport}")

    except KeyboardInterrupt:
        logger.info("Shutting down Prowler MCP server...")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Error starting server: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: server.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/server.py

```python
import asyncio

from fastmcp import FastMCP
from prowler_mcp_server import __version__
from prowler_mcp_server.lib.logger import logger
from starlette.responses import JSONResponse

prowler_mcp_server = FastMCP("prowler-mcp-server")


async def setup_main_server():
    """Set up the main Prowler MCP server with all available integrations."""
    # Import Prowler Hub tools with prowler_hub_ prefix
    try:
        logger.info("Importing Prowler Hub server...")
        from prowler_mcp_server.prowler_hub.server import hub_mcp_server

        await prowler_mcp_server.import_server(hub_mcp_server, prefix="prowler_hub")
        logger.info("Successfully imported Prowler Hub server")
    except Exception as e:
        logger.error(f"Failed to import Prowler Hub server: {e}")

    # Import Prowler App tools with prowler_app_ prefix
    try:
        logger.info("Importing Prowler App server...")
        from prowler_mcp_server.prowler_app.server import app_mcp_server

        await prowler_mcp_server.import_server(app_mcp_server, prefix="prowler_app")
        logger.info("Successfully imported Prowler App server")
    except Exception as e:
        logger.error(f"Failed to import Prowler App server: {e}")

    # Import Prowler Documentation tools with prowler_docs_ prefix
    try:
        logger.info("Importing Prowler Documentation server...")
        from prowler_mcp_server.prowler_documentation.server import docs_mcp_server

        await prowler_mcp_server.import_server(docs_mcp_server, prefix="prowler_docs")
        logger.info("Successfully imported Prowler Documentation server")
    except Exception as e:
        logger.error(f"Failed to import Prowler Documentation server: {e}")


# Add health check endpoint
@prowler_mcp_server.custom_route("/health", methods=["GET"])
async def health_check(request) -> JSONResponse:
    """Health check endpoint."""
    return JSONResponse(
        {"status": "healthy", "service": "prowler-mcp-server", "version": __version__}
    )


# Get or create the event loop
try:
    loop = asyncio.get_running_loop()
    # If we have a running loop, schedule the setup as a task
    loop.create_task(setup_main_server())
except RuntimeError:
    # No running loop, use asyncio.run (for standalone execution)
    asyncio.run(setup_main_server())

app = prowler_mcp_server.http_app()
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/__init__.py

```python
"""
Prowler MCP - Model Context Protocol server for Prowler ecosystem

This package provides MCP tools for accessing:
- Prowler Hub: All security artifacts (detections, remediations and frameworks) supported by Prowler
"""

__version__ = "0.1.0"
__author__ = "Prowler Team"
__email__ = "engineering@prowler.com"

__all__ = ["__version__", "prowler_mcp_server"]
```

--------------------------------------------------------------------------------

---[FILE: logger.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/lib/logger.py

```python
from fastmcp.utilities.logging import get_logger

# Create and export logger
logger = get_logger("prowler-mcp-server")
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/lib/__init__.py

```python
from prowler_mcp_server.lib.logger import logger

__all__ = ["logger"]
```

--------------------------------------------------------------------------------

---[FILE: server.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/server.py

```python
from fastmcp import FastMCP
from prowler_mcp_server.prowler_app.utils.tool_loader import load_all_tools

# Initialize MCP server
app_mcp_server = FastMCP("prowler-app")

# Auto-discover and load all tools from the tools package
load_all_tools(app_mcp_server)
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/models/base.py
Signals: Pydantic

```python
"""Base models and mixins for Prowler MCP Server models."""

from typing import Any

from pydantic import BaseModel, SerializerFunctionWrapHandler, model_serializer


class MinimalSerializerMixin(BaseModel):
    """Mixin that excludes empty values from serialization.

    This mixin optimizes model serialization for LLM consumption by removing noise
    and reducing token usage. It excludes:
    - None values
    - Empty strings
    - Empty lists
    - Empty dicts
    """

    @model_serializer(mode="wrap")
    def _serialize(self, handler: SerializerFunctionWrapHandler) -> dict[str, Any]:
        """Serialize model excluding empty values.

        Args:
            handler: Pydantic serializer function wrapper

        Returns:
            Dictionary with non-empty values only
        """
        data = handler(self)
        return {k: v for k, v in data.items() if not self._should_exclude(k, v)}

    def _should_exclude(self, key: str, value: Any) -> bool:
        """Determine if a key-value pair should be excluded from serialization.

        Override this method in subclasses for custom exclusion logic.

        Args:
            key: Field name
            value: Field value

        Returns:
            True if the field should be excluded, False otherwise
        """
        # None values
        if value is None:
            return True

        # Empty strings
        if value == "":
            return True

        # Empty lists
        if isinstance(value, list) and not value:
            return True

        # Empty dicts
        if isinstance(value, dict) and not value:
            return True

        return False
```

--------------------------------------------------------------------------------

---[FILE: compliance.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/models/compliance.py
Signals: Pydantic

```python
"""Pydantic models for simplified compliance responses."""

from typing import Any, Literal

from prowler_mcp_server.prowler_app.models.base import MinimalSerializerMixin
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    SerializerFunctionWrapHandler,
    model_serializer,
)


class ComplianceRequirementAttribute(MinimalSerializerMixin, BaseModel):
    """Requirement attributes including associated check IDs.

    Used to map requirements to the checks that validate them.
    """

    model_config = ConfigDict(frozen=True)

    id: str = Field(
        description="Requirement identifier within the framework (e.g., '1.1', '2.1.1')"
    )
    name: str = Field(default="", description="Human-readable name of the requirement")
    description: str = Field(
        default="", description="Detailed description of the requirement"
    )
    check_ids: list[str] = Field(
        default_factory=list,
        description="List of Prowler check IDs that validate this requirement",
    )

    @classmethod
    def from_api_response(cls, data: dict) -> "ComplianceRequirementAttribute":
        """Transform JSON:API compliance requirement attributes response to simplified format."""
        attributes = data.get("attributes", {})

        # Extract check_ids from the nested attributes structure
        nested_attributes = attributes.get("attributes", {})
        check_ids = nested_attributes.get("check_ids", [])

        return cls(
            id=attributes.get("id", data.get("id", "")),
            name=attributes.get("name", ""),
            description=attributes.get("description", ""),
            check_ids=check_ids if check_ids else [],
        )


class ComplianceRequirementAttributesListResponse(BaseModel):
    """Response for compliance requirement attributes list with check_ids mappings."""

    model_config = ConfigDict(frozen=True)

    requirements: list[ComplianceRequirementAttribute] = Field(
        description="List of requirements with their associated check IDs"
    )
    total_count: int = Field(description="Total number of requirements")

    @classmethod
    def from_api_response(
        cls, response: dict
    ) -> "ComplianceRequirementAttributesListResponse":
        """Transform JSON:API response to simplified format."""
        data = response.get("data", [])

        requirements = [
            ComplianceRequirementAttribute.from_api_response(item) for item in data
        ]

        return cls(
            requirements=requirements,
            total_count=len(requirements),
        )


class ComplianceFrameworkSummary(MinimalSerializerMixin, BaseModel):
    """Simplified compliance framework overview for list operations.

    Used by get_compliance_overview() to show high-level compliance status
    per framework.
    """

    model_config = ConfigDict(frozen=True)

    id: str = Field(description="Unique identifier for this compliance overview entry")
    compliance_id: str = Field(
        description="Compliance framework identifier (e.g., 'cis_1.5_aws', 'pci_dss_v4.0_aws')"
    )
    framework: str = Field(
        description="Human-readable framework name (e.g., 'CIS', 'PCI-DSS', 'HIPAA')"
    )
    version: str = Field(description="Framework version (e.g., '1.5', '4.0')")
    total_requirements: int = Field(
        default=0, description="Total number of requirements in this framework"
    )
    requirements_passed: int = Field(
        default=0, description="Number of requirements that passed"
    )
    requirements_failed: int = Field(
        default=0, description="Number of requirements that failed"
    )
    requirements_manual: int = Field(
        default=0, description="Number of requirements requiring manual verification"
    )

    @property
    def pass_percentage(self) -> float:
        """Calculate pass percentage based on passed requirements."""
        if self.total_requirements == 0:
            return 0.0
        return round((self.requirements_passed / self.total_requirements) * 100, 1)

    @property
    def fail_percentage(self) -> float:
        """Calculate fail percentage based on failed requirements."""
        if self.total_requirements == 0:
            return 0.0
        return round((self.requirements_failed / self.total_requirements) * 100, 1)

    @model_serializer(mode="wrap")
    def _serialize(self, handler: SerializerFunctionWrapHandler) -> dict[str, Any]:
        """Serialize with calculated percentages included."""
        data = handler(self)
        # Filter out None/empty values
        data = {k: v for k, v in data.items() if v is not None and v != "" and v != []}
        # Add calculated percentages
        data["pass_percentage"] = self.pass_percentage
        data["fail_percentage"] = self.fail_percentage
        return data

    @classmethod
    def from_api_response(cls, data: dict) -> "ComplianceFrameworkSummary":
        """Transform JSON:API compliance overview response to simplified format."""
        attributes = data.get("attributes", {})

        # The compliance_id field may be in attributes or use the "id" field from attributes
        compliance_id = attributes.get("id", data.get("id", ""))

        return cls(
            id=data["id"],
            compliance_id=compliance_id,
            framework=attributes.get("framework", ""),
            version=attributes.get("version", ""),
            total_requirements=attributes.get("total_requirements", 0),
            requirements_passed=attributes.get("requirements_passed", 0),
            requirements_failed=attributes.get("requirements_failed", 0),
            requirements_manual=attributes.get("requirements_manual", 0),
        )


class ComplianceRequirement(MinimalSerializerMixin, BaseModel):
    """Individual compliance requirement with its status.

    Used by get_compliance_framework_state_details() to show requirement-level breakdown.
    """

    model_config = ConfigDict(frozen=True)

    id: str = Field(
        description="Requirement identifier within the framework (e.g., '1.1', '2.1.1')"
    )
    description: str = Field(
        description="Human-readable description of the requirement"
    )
    status: Literal["FAIL", "PASS", "MANUAL"] = Field(
        description="Requirement status: FAIL (not compliant), PASS (compliant), MANUAL (requires manual verification)"
    )

    @classmethod
    def from_api_response(cls, data: dict) -> "ComplianceRequirement":
        """Transform JSON:API compliance requirement response to simplified format."""
        attributes = data.get("attributes", {})

        return cls(
            id=attributes.get("id", data.get("id", "")),
            description=attributes.get("description", ""),
            status=attributes.get("status", "MANUAL"),
        )


class ComplianceFrameworksListResponse(BaseModel):
    """Response for compliance frameworks list with aggregated statistics."""

    model_config = ConfigDict(frozen=True)

    frameworks: list[ComplianceFrameworkSummary] = Field(
        description="List of compliance frameworks with their status"
    )
    total_count: int = Field(description="Total number of frameworks returned")

    @classmethod
    def from_api_response(cls, response: dict) -> "ComplianceFrameworksListResponse":
        """Transform JSON:API response to simplified format."""
        data = response.get("data", [])

        frameworks = [
            ComplianceFrameworkSummary.from_api_response(item) for item in data
        ]

        return cls(
            frameworks=frameworks,
            total_count=len(frameworks),
        )


class ComplianceRequirementsListResponse(BaseModel):
    """Response for compliance requirements list queries."""

    model_config = ConfigDict(frozen=True)

    requirements: list[ComplianceRequirement] = Field(
        description="List of requirements with their status"
    )
    total_count: int = Field(description="Total number of requirements")
    passed_count: int = Field(description="Number of requirements with PASS status")
    failed_count: int = Field(description="Number of requirements with FAIL status")
    manual_count: int = Field(description="Number of requirements with MANUAL status")

    @classmethod
    def from_api_response(cls, response: dict) -> "ComplianceRequirementsListResponse":
        """Transform JSON:API response to simplified format."""
        data = response.get("data", [])

        requirements = [ComplianceRequirement.from_api_response(item) for item in data]

        # Calculate counts
        passed = sum(1 for r in requirements if r.status == "PASS")
        failed = sum(1 for r in requirements if r.status == "FAIL")
        manual = sum(1 for r in requirements if r.status == "MANUAL")

        return cls(
            requirements=requirements,
            total_count=len(requirements),
            passed_count=passed,
            failed_count=failed,
            manual_count=manual,
        )
```

--------------------------------------------------------------------------------

---[FILE: findings.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/models/findings.py
Signals: Pydantic

```python
"""Pydantic models for simplified security findings responses."""

from typing import Literal

from prowler_mcp_server.prowler_app.models.base import MinimalSerializerMixin
from pydantic import BaseModel, ConfigDict, Field


class CheckRemediation(MinimalSerializerMixin, BaseModel):
    """Remediation information for a security check."""

    model_config = ConfigDict(frozen=True)

    cli: str | None = Field(
        default=None,
        description="Command-line interface commands for remediation",
    )
    terraform: str | None = Field(
        default=None,
        description="Terraform code snippet with best practices for remediation",
    )
    nativeiac: str | None = Field(
        default=None,
        description="Native Infrastructure as Code code snippet with best practices for remediation",
    )
    other: str | None = Field(
        default=None,
        description="Other remediation code snippet with best practices for remediation, usually used for web interfaces or other tools",
    )
    recommendation: str | None = Field(
        default=None,
        description="Text description with general best recommended practices to avoid the issue",
    )


class CheckMetadata(MinimalSerializerMixin, BaseModel):
    """Essential metadata for a security check."""

    model_config = ConfigDict(frozen=True)

    title: str = Field(
        description="Human-readable title of the security check",
    )
    description: str = Field(
        description="Detailed description of what the check validates",
    )
    provider: str = Field(
        description="Prowler provider this check belongs to (e.g., 'aws', 'azure', 'gcp')",
    )
    service: str = Field(
        description="Prowler service being checked (e.g., 's3', 'ec2', 'keyvault')",
    )
    resource_type: str = Field(
        description="Type of resource being evaluated (e.g., 'AwsS3Bucket')",
    )
    risk: str | None = Field(
        default=None,
        description="Risk description if the check fails",
    )
    remediation: CheckRemediation | None = Field(
        default=None,
        description="Remediation guidance including CLI commands and recommendations",
    )
    additional_urls: list[str] = Field(
        default_factory=list,
        description="List of additional URLs related to the check",
    )
    categories: list[str] = Field(
        default_factory=list,
        description="Categories this check belongs to (e.g., ['encryption', 'logging'])",
    )

    @classmethod
    def from_api_response(cls, data: dict) -> "CheckMetadata":
        """Transform API check_metadata to simplified format."""
        remediation_data = data.get("remediation")

        remediation = None
        if remediation_data:
            code = remediation_data.get("code", {})
            recommendation = remediation_data.get("recommendation", {})

            remediation = CheckRemediation(
                cli=code["cli"],
                terraform=code["terraform"],
                nativeiac=code["nativeiac"],
                other=code["other"],
                recommendation=recommendation["text"],
            )

        return cls(
            title=data["checktitle"],
            description=data["description"],
            provider=data["provider"],
            risk=data["risk"],
            service=data["servicename"],
            resource_type=data["resourcetype"],
            remediation=remediation,
            additional_urls=data["additionalurls"],
            categories=data["categories"],
        )


class SimplifiedFinding(MinimalSerializerMixin, BaseModel):
    """Simplified security finding with only LLM-relevant information."""

    model_config = ConfigDict(frozen=True)

    id: str = Field(
        description="Unique UUIDv4 identifier for this finding in Prowler database"
    )
    uid: str = Field(
        description="Human-readable unique identifier assigned by Prowler. Format: prowler-{provider}-{check_id}-{account_uid}-{region}-{resource_name}",
    )
    status: Literal["FAIL", "PASS", "MANUAL"] = Field(
        description="Result status: FAIL (security issue found), PASS (no issue), MANUAL (requires manual verification)",
    )
    severity: Literal["critical", "high", "medium", "low", "informational"] = Field(
        description="Severity level of the finding",
    )
    check_id: str = Field(
        description="ID of the security check that generated this finding",
    )
    status_extended: str = Field(
        description="Extended status information providing additional context",
    )
    delta: Literal["new", "changed"] | None = Field(
        default=None,
        description="Change status: 'new' (not seen before), 'changed' (modified since last scan), or None (unchanged)",
    )
    muted: bool | None = Field(
        default=None,
        description="Whether this finding has been muted/suppressed by the user",
    )
    muted_reason: str | None = Field(
        default=None,
        description="Reason provided when muting this finding",
    )

    @classmethod
    def from_api_response(cls, data: dict) -> "SimplifiedFinding":
        """Transform JSON:API finding response to simplified format."""
        attributes = data["attributes"]

        return cls(
            id=data["id"],
            uid=attributes["uid"],
            status=attributes["status"],
            severity=attributes["severity"],
            check_id=attributes["check_metadata"]["checkid"],
            status_extended=attributes["status_extended"],
            delta=attributes["delta"],
            muted=attributes["muted"],
            muted_reason=attributes["muted_reason"],
        )


class DetailedFinding(SimplifiedFinding):
    """Detailed security finding with comprehensive information for deep analysis.

    Extends SimplifiedFinding with temporal metadata and relationships to scans and resources.
    Use this when you need complete context about a specific finding.
    """

    model_config = ConfigDict(frozen=True)

    inserted_at: str = Field(
        description="ISO 8601 timestamp when this finding was first inserted into the database",
    )
    updated_at: str = Field(
        description="ISO 8601 timestamp when this finding was last updated",
    )
    first_seen_at: str | None = Field(
        default=None,
        description="ISO 8601 timestamp when this finding was first detected across all scans",
    )
    scan_id: str | None = Field(
        default=None,
        description="UUID of the scan that generated this finding",
    )
    resource_ids: list[str] = Field(
        default_factory=list,
        description="List of UUIDs for cloud resources associated with this finding",
    )
    check_metadata: CheckMetadata = Field(
        description="Metadata about the security check that generated this finding",
    )

    @classmethod
    def from_api_response(cls, data: dict) -> "DetailedFinding":
        """Transform JSON:API finding response to detailed format."""
        attributes = data["attributes"]
        check_metadata = attributes["check_metadata"]
        relationships = data.get("relationships", {})

        # Parse scan relationship
        scan_id = None
        scan_data = relationships.get("scan", {}).get("data")
        if scan_data:
            scan_id = scan_data["id"]

        # Parse resources relationship
        resource_ids = []
        resources_data = relationships.get("resources", {}).get("data", [])
        if resources_data:
            resource_ids = [r["id"] for r in resources_data]

        return cls(
            id=data["id"],
            uid=attributes["uid"],
            status=attributes["status"],
            severity=attributes["severity"],
            check_id=check_metadata["checkid"],
            check_metadata=CheckMetadata.from_api_response(check_metadata),
            status_extended=attributes.get("status_extended"),
            delta=attributes.get("delta"),
            muted=attributes["muted"],
            muted_reason=attributes.get("muted_reason"),
            inserted_at=attributes["inserted_at"],
            updated_at=attributes["updated_at"],
            first_seen_at=attributes.get("first_seen_at"),
            scan_id=scan_id,
            resource_ids=resource_ids,
        )


class FindingsListResponse(BaseModel):
    """Simplified response for findings list queries."""

    model_config = ConfigDict(frozen=True)

    findings: list[SimplifiedFinding] = Field(
        description="List of security findings matching the query",
    )
    total_num_finding: int = Field(
        description="Total number of findings matching the query across all pages",
        ge=0,
    )
    total_num_pages: int = Field(
        description="Total number of pages available",
        ge=0,
    )
    current_page: int = Field(
        description="Current page number (1-indexed)",
        ge=1,
    )

    @classmethod
    def from_api_response(cls, response: dict) -> "FindingsListResponse":
        """Transform JSON:API response to simplified format."""
        data = response["data"]
        meta = response["meta"]
        pagination = meta["pagination"]

        findings = [SimplifiedFinding.from_api_response(item) for item in data]

        return cls(
            findings=findings,
            total_num_finding=pagination["count"],
            total_num_pages=pagination["pages"],
            current_page=pagination["page"],
        )


class FindingsOverview(BaseModel):
    """Simplified findings overview with aggregate statistics."""

    model_config = ConfigDict(frozen=True)

    total: int = Field(
        description="Total number of findings",
        ge=0,
    )
    fail: int = Field(
        description="Total number of failed security checks",
        ge=0,
    )
    passed: int = (  # Using 'passed' instead of 'pass' since 'pass' is a Python keyword
        Field(
            description="Total number of passed security checks",
            ge=0,
        )
    )
    muted: int = Field(
        description="Total number of muted findings",
        ge=0,
    )
    new: int = Field(
        description="Total number of new findings (not seen in previous scans)",
        ge=0,
    )
    changed: int = Field(
        description="Total number of changed findings (modified since last scan)",
        ge=0,
    )
    fail_new: int = Field(
        description="Number of new findings with FAIL status",
        ge=0,
    )
    fail_changed: int = Field(
        description="Number of changed findings with FAIL status",
        ge=0,
    )
    pass_new: int = Field(
        description="Number of new findings with PASS status",
        ge=0,
    )
    pass_changed: int = Field(
        description="Number of changed findings with PASS status",
        ge=0,
    )
    muted_new: int = Field(
        description="Number of new muted findings",
        ge=0,
    )
    muted_changed: int = Field(
        description="Number of changed muted findings",
        ge=0,
    )

    @classmethod
    def from_api_response(cls, response: dict) -> "FindingsOverview":
        """Transform JSON:API overview response to simplified format."""
        data = response["data"]
        attributes = data["attributes"]

        return cls(
            total=attributes["total"],
            fail=attributes["fail"],
            passed=attributes["pass"],
            muted=attributes["muted"],
            new=attributes["new"],
            changed=attributes["changed"],
            fail_new=attributes["fail_new"],
            fail_changed=attributes["fail_changed"],
            pass_new=attributes["pass_new"],
            pass_changed=attributes["pass_changed"],
            muted_new=attributes["muted_new"],
            muted_changed=attributes["muted_changed"],
        )
```

--------------------------------------------------------------------------------

---[FILE: muting.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_app/models/muting.py
Signals: Pydantic

```python
"""Pydantic models for simplified muting responses."""

from typing import Any

from prowler_mcp_server.prowler_app.models.base import MinimalSerializerMixin
from pydantic import BaseModel, ConfigDict, Field


class MutelistResponse(MinimalSerializerMixin, BaseModel):
    """Simplified mutelist response with Prowler configuration.

    Represents a mutelist configuration that defines which findings
    should be automatically muted based on account patterns, check IDs, regions,
    resources, tags, and exceptions.
    """

    model_config = ConfigDict(frozen=True)

    id: str = Field(
        description="Unique UUIDv4 identifier for this mutelist in Prowler database"
    )
    configuration: dict[str, Any] = Field(
        description="Mutelist configuration following Prowler format with nested structure: Mutelist → Accounts → Checks → Regions/Resources/Tags/Exceptions"
    )
    inserted_at: str | None = Field(
        default=None,
        description="ISO 8601 timestamp when this mutelist was created",
    )
    updated_at: str | None = Field(
        default=None,
        description="ISO 8601 timestamp when this mutelist was last modified",
    )

    @classmethod
    def from_api_response(cls, data: dict[str, Any]) -> "MutelistResponse":
        """Transform JSON:API processor response to simplified format.

        The configuration structure follows the Prowler mutelist format:
        {
            "Mutelist": {
                "Accounts": {
                    "<account-pattern>": {
                        "Checks": {
                            "<check-id>": {
                                "Regions": [...],
                                "Resources": [...],
                                "Tags": [...],
                                "Exceptions": {...}
                            }
                        }
                    }
                }
            }
        }
        """
        attributes = data.get("attributes", {})

        return cls(
            id=data["id"],
            configuration=attributes.get("configuration", {}),
            inserted_at=attributes.get("inserted_at"),
            updated_at=attributes.get("updated_at"),
        )


class SimplifiedMuteRule(MinimalSerializerMixin, BaseModel):
    """Simplified mute rule for list/search operations.

    Provides lightweight mute rule information without the full list of finding UIDs.
    Use this for listing and searching operations where you need basic rule information
    but don't need the complete list of affected findings.
    """

    model_config = ConfigDict(frozen=True)

    id: str = Field(
        description="Unique UUIDv4 identifier for this mute rule in Prowler database"
    )
    name: str = Field(description="Human-readable name for this mute rule")
    reason: str = Field(description="Documented reason for muting these findings")
    enabled: bool = Field(
        description="Whether this mute rule is currently active and applying muting to findings"
    )
    finding_count: int = Field(
        description="Number of findings currently muted by this rule", ge=0
    )
    inserted_at: str | None = Field(
        default=None,
        description="ISO 8601 timestamp when this mute rule was created",
    )
    updated_at: str | None = Field(
        default=None,
        description="ISO 8601 timestamp when this mute rule was last modified",
    )

    @classmethod
    def from_api_response(cls, data: dict[str, Any]) -> "SimplifiedMuteRule":
        """Transform JSON:API mute rule response to simplified format."""
        attributes = data.get("attributes", {})

        # Calculate finding count from finding_uids list length
        finding_uids = attributes.get("finding_uids", [])

        return cls(
            id=data["id"],
            name=attributes["name"],
            reason=attributes["reason"],
            enabled=attributes["enabled"],
            finding_count=len(finding_uids),
            inserted_at=attributes.get("inserted_at"),
            updated_at=attributes.get("updated_at"),
        )


class DetailedMuteRule(SimplifiedMuteRule):
    """Detailed mute rule with complete information including finding UIDs.

    Extends SimplifiedMuteRule with the full list of finding UIDs being muted and
    creator information (user/service account that created the rule).
    Use this when you need complete context about a specific mute rule, including
    all affected findings and audit trail information.
    """

    finding_uids: list[str] = Field(
        description="List of finding UIDs that are muted by this rule"
    )
    user_creator_id: str | None = Field(
        default=None,
        description="UUIDv4 identifier of the Prowler user from the tenant that created this rule",
    )

    @classmethod
    def from_api_response(cls, data: dict[str, Any]) -> "DetailedMuteRule":
        """Transform JSON:API mute rule response to detailed format."""
        attributes = data.get("attributes", {})
        relationships = data.get("relationships", {})

        # Extract creator information
        user_creator_id = None
        creator_data = relationships.get("created_by", {}).get("data")
        if creator_data:
            user_creator_id = creator_data.get("id")

        finding_uids = attributes.get("finding_uids", [])

        return cls(
            id=data["id"],
            name=attributes["name"],
            reason=attributes["reason"],
            enabled=attributes["enabled"],
            finding_count=len(finding_uids),
            finding_uids=finding_uids,
            inserted_at=attributes.get("inserted_at"),
            updated_at=attributes.get("updated_at"),
            user_creator_id=user_creator_id,
        )


class MuteRulesListResponse(BaseModel):
    """Simplified response for mute rules list queries with pagination.

    Contains a list of simplified mute rules and pagination metadata.
    Use this for paginated list/search operations to get multiple rules efficiently.
    """

    model_config = ConfigDict(frozen=True)

    mute_rules: list[SimplifiedMuteRule] = Field(
        description="List of simplified mute rules matching the query filters"
    )
    total_num_mute_rules: int = Field(
        description="Total number of mute rules matching the query across all pages",
        ge=0,
    )
    total_num_pages: int = Field(
        description="Total number of pages available for the query results", ge=0
    )
    current_page: int = Field(
        description="Current page number in the paginated results (1-indexed)", ge=1
    )

    @classmethod
    def from_api_response(cls, response: dict[str, Any]) -> "MuteRulesListResponse":
        """Transform JSON:API response to simplified format."""
        data = response.get("data", [])
        meta = response.get("meta", {})
        pagination = meta.get("pagination", {})

        mute_rules = [SimplifiedMuteRule.from_api_response(item) for item in data]

        return cls(
            mute_rules=mute_rules,
            total_num_mute_rules=pagination.get("count", 0),
            total_num_pages=pagination.get("pages", 1),
            current_page=pagination.get("page", 1),
        )
```

--------------------------------------------------------------------------------

````
