---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 80
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 80 of 867)

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

---[FILE: m365-details.mdx]---
Location: prowler-master/docs/developer-guide/m365-details.mdx

```text
---
title: 'Microsoft 365 (M365) Provider'
---

This page details the [Microsoft 365 (M365)](https://www.microsoft.com/en-us/microsoft-365) provider implementation in Prowler.

By default, Prowler will audit the Microsoft Entra ID tenant and its supported services. To configure it, follow the [M365 getting started guide](/user-guide/providers/microsoft365/getting-started-m365).

---

## PowerShell Requirements for M365 Checks

> **Most Microsoft 365 checks in Prowler require PowerShell, not just the Microsoft Graph API.**

- **PowerShell is essential** for retrieving data from Exchange Online, Teams, Defender, Purview, and other M365 services. Many checks cannot be performed using only the Graph API.
- **PowerShell 7.4 or higher is required** (7.5 recommended). PowerShell 5.1 and earlier versions are not supported for M365 checks.
- **Required modules:**
    - [ExchangeOnlineManagement](https://www.powershellgallery.com/packages/ExchangeOnlineManagement/3.6.0) (≥ 3.6.0)
    - [MicrosoftTeams](https://www.powershellgallery.com/packages/MicrosoftTeams/6.6.0) (≥ 6.6.0)
- If you use Prowler Cloud or the official containers, PowerShell is pre-installed. For local or pip installations, you must install PowerShell and the modules yourself. See [Authentication: Supported PowerShell Versions](/user-guide/providers/microsoft365/authentication#supported-powershell-versions) and [Needed PowerShell Modules](/user-guide/providers/microsoft365/authentication#required-powershell-modules).
- For more details and troubleshooting, see [Use of PowerShell in M365](/user-guide/providers/microsoft365/use-of-powershell).

---

## M365 Provider Classes Architecture

The M365 provider implementation follows the general [Provider structure](/developer-guide/provider). This section focuses on the M365-specific implementation, highlighting how the generic provider concepts are realized for M365 in Prowler. For a full overview of the provider pattern, base classes, and extension guidelines, see [Provider documentation](/developer-guide/provider).

### `M365Provider` (Main Class)

- **Location:** [`prowler/providers/m365/m365_provider.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/m365/m365_provider.py)
- **Base Class:** Inherits from `Provider` (see [base class details](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/common/provider.py)).
- **Purpose:** Central orchestrator for M365-specific logic, session management, credential validation, region/authority configuration, and identity context.
- **Key M365 Responsibilities:**
    - Initializes and manages M365 sessions (supports Service Principal, environment variables, Azure CLI, browser, and user/password authentication).
    - Validates credentials and sets up the M365 identity context.
    - Manages the Microsoft Graph API client and the PowerShell client.
    - Loads and manages configuration, mutelist, and fixer settings.
    - Provides properties and methods for downstream M365 service classes to access session, identity, and configuration data.

### Data Models

- **Location:** [`prowler/providers/m365/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/m365/models.py)
- **Purpose:** Define structured data for M365 identity, session, region configuration, and credentials.
- **Key M365 Models:**
    - `M365IdentityInfo`: Holds M365 identity metadata, including tenant ID, domain(s), user, and location.
    - `M365RegionConfig`: Stores the specific region/authority and API base URL for the tenant.
    - `M365Credentials`: Represents credentials for authentication (user, password, client ID, client secret, tenant ID, etc.).

### `M365Service` (Service Base Class)

- **Location:** [`prowler/providers/m365/lib/service/service.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/m365/lib/service/service.py)
- **Purpose:** Abstract base class for all M365 service-specific classes.
- **Key M365 Responsibilities:**
    - Receives an `M365Provider` instance to access session, identity, and configuration.
    - Manages the Microsoft Graph API client for the service.
    - Initializes a PowerShell client for most services if credentials and identity are available.
    - Exposes common audit context (`audit_config`, `fixer_config`) to subclasses.

### Exception Handling

- **Location:** [`prowler/providers/m365/exceptions/exceptions.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/m365/exceptions/exceptions.py)
- **Purpose:** Custom exception classes for M365-specific error handling, such as credential, session, region, and argument errors.

### Session and Utility Helpers

- **Location:** [`prowler/providers/m365/lib/`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/m365/lib/)
- **Purpose:** Helpers for argument parsing, region/authority setup, mutelist management, PowerShell integration, and other cross-cutting concerns.

  > **Key File: [`m365_powershell.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/m365/lib/powershell/m365_powershell.py)**
  >
  > This is the core module for Microsoft 365 PowerShell integration. It manages authentication, session handling, and provides a comprehensive set of methods for interacting with Microsoft Teams, Exchange Online, and Defender policies via PowerShell.
  >
  > This module provides secure credential management and authentication using MSAL and PowerShell. It handles automated installation and initialization of required PowerShell modules. The module offers a rich set of methods for retrieving and managing Teams, Exchange, and Defender configurations. It serves as the central component for all M365 provider operations that require PowerShell automation.

## Specific Patterns in M365 Services

The generic service pattern is described in [service page](/developer-guide/services#service-structure-and-initialisation). You can find all the currently implemented services in the following locations:

- Directly in the code, in location [`prowler/providers/m365/services/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/m365/services)
- In the [Prowler Hub](https://hub.prowler.com/) for a more human-readable view.

The best reference to understand how to implement a new service is by following the [service implementation documentation](/developer-guide/services#adding-a-new-service) and by taking other already implemented services as reference.

### M365 Service Common Patterns

- Services communicate with Microsoft 365 using the Microsoft Graph API **and/or PowerShell**. See the [official documentation](https://learn.microsoft.com/en-us/graph/api/overview) and [PowerShell reference](https://learn.microsoft.com/en-us/powershell/).
- Every M365 service class inherits from `M365Service`, ensuring access to session, identity, configuration, and client utilities.
- The constructor (`__init__`) always calls `super().__init__` with the provider object, and initializes the Graph client and the PowerShell client.
- Resource containers **must** be initialized in the constructor, typically as objects that represent the different settings of the service.
- All M365 resources are represented as Pydantic `BaseModel` classes, providing type safety and structured access to resource attributes.
- Microsoft Graph API and PowerShell calls are wrapped in try/except blocks, always logging errors.
- To retrieve some data in the services, it is so common that you have to create a new method also in the `m365_powershell.py` file to later be called in the service.

## Specific Patterns in M365 Checks

The M365 checks pattern is described in [checks page](/developer-guide/checks). You can find all the currently implemented checks in:

- Directly in the code, within each service folder, each check has its own folder named after the name of the check. (e.g. [`prowler/providers/m365/services/entra/entra_users_mfa_enabled/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/m365/services/entra/entra_users_mfa_enabled))
- In the [Prowler Hub](https://hub.prowler.com/) for a more human-readable view.

The best reference to understand how to implement a new check is following the [M365 check implementation documentation](/developer-guide/checks#creating-a-check) and by taking other checks as reference.

### Check Report Class

The `CheckReportM365` class models a single finding for a Microsoft 365 resource in a check report. It is defined in [`prowler/lib/check/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/lib/check/models.py) and inherits from the generic `Check_Report` base class.

#### Purpose

`CheckReportM365` extends the base report structure with M365-specific fields, enabling detailed tracking of the resource, name, and location associated with each finding.

#### Constructor and Attribute Population

When you instantiate `CheckReportM365`, you must provide the check metadata and a resource object. The class will attempt to automatically populate its M365-specific attributes from the resource, using the following logic (in order of precedence):

- **`resource_id`**: A required field that **must** be explicitly set in the constructor to identify the resource being checked.
- **`resource_name`**: A required field that **must** be explicitly set in the constructor to provide a human-readable name for the resource.
- **`location`**: A required field that can be explicitly set in the constructor to indicate where the resource is located. If not specified, defaults to "global".

If the resource object does not contain the required attributes, you must set them manually in the check logic.

Other attributes are inherited from the `Check_Report` class, from which you **always** have to set the `status` and `status_extended` attributes in the check logic.

#### Example Usage

```python
report = CheckReportM365(
    metadata=check_metadata,
    resource=resource_object
)
report.status = "PASS"
report.status_extended = "Resource is compliant."
```
```

--------------------------------------------------------------------------------

---[FILE: mcp-server.mdx]---
Location: prowler-master/docs/developer-guide/mcp-server.mdx

```text
---
title: 'Extending the MCP Server'
---

This guide explains how to extend the Prowler MCP Server with new tools and features.

<Info>
**New to Prowler MCP Server?** Start with the user documentation:
- [Overview](/getting-started/products/prowler-mcp) - Key capabilities, use cases, and deployment options
- [Installation](/getting-started/installation/prowler-mcp) - Install locally or use the managed server
- [Configuration](/getting-started/basic-usage/prowler-mcp) - Configure Claude Desktop, Cursor, and other MCP hosts
- [Tools Reference](/getting-started/basic-usage/prowler-mcp-tools) - Complete list of all available tools
</Info>

## Introduction

The Prowler MCP Server brings the entire Prowler ecosystem to AI assistants through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io). It enables seamless integration with AI tools like Claude Desktop, Cursor, and other MCP clients.

The server follows a modular architecture with three independent sub-servers:

| Sub-Server | Auth Required | Description |
|------------|---------------|-------------|
| Prowler App | Yes | Full access to Prowler Cloud and Self-Managed features |
| Prowler Hub | No | Security checks catalog with **over 1000 checks**, fixers, and **70+ compliance frameworks** |
| Prowler Documentation | No | Full-text search and retrieval of official documentation |

<Note>
For a complete list of tools and their descriptions, see the [Tools Reference](/getting-started/basic-usage/prowler-mcp-tools).
</Note>

## Architecture Overview

The MCP Server architecture is illustrated in the [Overview documentation](/getting-started/products/prowler-mcp#mcp-server-architecture). AI assistants connect through the MCP protocol to access Prowler's three main components.

### Server Structure

The main server orchestrates three sub-servers with prefixed namespacing:

```
mcp_server/prowler_mcp_server/
├── server.py                 # Main orchestrator
├── main.py                   # CLI entry point
├── prowler_hub/
├── prowler_app/
│   ├── tools/                # Tool implementations
│   ├── models/               # Pydantic models
│   └── utils/                # API client, auth, loader
└── prowler_documentation/
```

### Tool Registration Patterns

The MCP Server uses two patterns for tool registration:

1. **Direct Decorators** (Prowler Hub/Docs): Tools are registered using `@mcp.tool()` decorators
2. **Auto-Discovery** (Prowler App): All public methods of `BaseTool` subclasses are auto-registered

## Adding Tools to Prowler App

### Step 1: Create the Tool Class

Create a new file or add to an existing file in `prowler_app/tools/`:

```python
# prowler_app/tools/new_feature.py
from typing import Any

from pydantic import Field

from prowler_mcp_server.prowler_app.models.new_feature import (
    FeatureListResponse,
    DetailedFeature,
)
from prowler_mcp_server.prowler_app.tools.base import BaseTool


class NewFeatureTools(BaseTool):
    """Tools for managing new features."""

    async def list_features(
        self,
        status: str | None = Field(
            default=None,
            description="Filter by status (active, inactive, pending)"
        ),
        page_size: int = Field(
            default=50,
            description="Number of results per page (1-100)"
        ),
    ) -> dict[str, Any]:
        """List all features with optional filtering.

        Returns a lightweight list of features optimized for LLM consumption.
        Use get_feature for complete information about a specific feature.
        """
        # Validate parameters
        self.api_client.validate_page_size(page_size)

        # Build query parameters
        params: dict[str, Any] = {"page[size]": page_size}
        if status:
            params["filter[status]"] = status

        # Make API request
        clean_params = self.api_client.build_filter_params(params)
        response = await self.api_client.get("/api/v1/features", params=clean_params)

        # Transform to LLM-friendly format
        return FeatureListResponse.from_api_response(response).model_dump()

    async def get_feature(
        self,
        feature_id: str = Field(description="The UUID of the feature"),
    ) -> dict[str, Any]:
        """Get detailed information about a specific feature.

        Returns complete feature details including configuration and metadata.
        """
        try:
            response = await self.api_client.get(f"/api/v1/features/{feature_id}")
            return DetailedFeature.from_api_response(response["data"]).model_dump()
        except Exception as e:
            self.logger.error(f"Failed to get feature {feature_id}: {e}")
            return {"error": str(e), "status": "failed"}
```

### Step 2: Create the Models

Create corresponding models in `prowler_app/models/`:

```python
# prowler_app/models/new_feature.py
from typing import Any

from pydantic import Field

from prowler_mcp_server.prowler_app.models.base import MinimalSerializerMixin


class SimplifiedFeature(MinimalSerializerMixin):
    """Lightweight feature for list operations."""

    id: str = Field(description="Unique feature identifier")
    name: str = Field(description="Feature name")
    status: str = Field(description="Current status")

    @classmethod
    def from_api_response(cls, data: dict[str, Any]) -> "SimplifiedFeature":
        """Transform API response to simplified format."""
        attributes = data.get("attributes", {})
        return cls(
            id=data["id"],
            name=attributes["name"],
            status=attributes["status"],
        )


class DetailedFeature(SimplifiedFeature):
    """Extended feature with complete details."""

    description: str | None = Field(default=None, description="Feature description")
    configuration: dict[str, Any] | None = Field(default=None, description="Configuration")
    created_at: str = Field(description="Creation timestamp")
    updated_at: str = Field(description="Last update timestamp")

    @classmethod
    def from_api_response(cls, data: dict[str, Any]) -> "DetailedFeature":
        """Transform API response to detailed format."""
        attributes = data.get("attributes", {})
        return cls(
            id=data["id"],
            name=attributes["name"],
            status=attributes["status"],
            description=attributes.get("description"),
            configuration=attributes.get("configuration"),
            created_at=attributes["created_at"],
            updated_at=attributes["updated_at"],
        )


class FeatureListResponse(MinimalSerializerMixin):
    """Response wrapper for feature list operations."""

    count: int = Field(description="Total number of features")
    features: list[SimplifiedFeature] = Field(description="List of features")

    @classmethod
    def from_api_response(cls, response: dict[str, Any]) -> "FeatureListResponse":
        """Transform API response to list format."""
        data = response.get("data", [])
        features = [SimplifiedFeature.from_api_response(item) for item in data]
        return cls(count=len(features), features=features)
```

### Step 3: Verify Auto-Discovery

No manual registration is needed. The `tool_loader.py` automatically discovers and registers all `BaseTool` subclasses. Verify your tool is loaded by checking the server logs:

```
INFO - Auto-registered 2 tools from NewFeatureTools
INFO - Loaded and registered: NewFeatureTools
```

## Adding Tools to Prowler Hub/Docs

For Prowler Hub or Documentation tools, use the `@mcp.tool()` decorator directly:

```python
# prowler_hub/server.py
from fastmcp import FastMCP

hub_mcp_server = FastMCP("prowler-hub")

@hub_mcp_server.tool()
async def get_new_artifact(
    artifact_id: str,
) -> dict:
    """Fetch a specific artifact from Prowler Hub.

    Args:
        artifact_id: The unique identifier of the artifact

    Returns:
        Dictionary containing artifact details
    """
    response = prowler_hub_client.get(f"/artifact/{artifact_id}")
    response.raise_for_status()
    return response.json()
```

## Model Design Patterns

### MinimalSerializerMixin

All models should use `MinimalSerializerMixin` to optimize responses for LLM consumption:

```python
from prowler_mcp_server.prowler_app.models.base import MinimalSerializerMixin

class MyModel(MinimalSerializerMixin):
    """Model that excludes empty values from serialization."""
    required_field: str
    optional_field: str | None = None  # Excluded if None
    empty_list: list = []              # Excluded if empty
```

This mixin automatically excludes:
- `None` values
- Empty strings
- Empty lists
- Empty dictionaries

### Two-Tier Model Pattern

Use two-tier models for efficient responses:

- **Simplified**: Lightweight models for list operations
- **Detailed**: Extended models for single-item retrieval

```python
class SimplifiedItem(MinimalSerializerMixin):
    """Use for list operations - minimal fields."""
    id: str
    name: str
    status: str

class DetailedItem(SimplifiedItem):
    """Use for get operations - extends simplified with details."""
    description: str | None = None
    configuration: dict | None = None
    created_at: str
    updated_at: str
```

### Factory Method Pattern

Always implement `from_api_response()` for API transformation:

```python
@classmethod
def from_api_response(cls, data: dict[str, Any]) -> "MyModel":
    """Transform API response to model.

    This method handles the JSON:API format used by Prowler API,
    extracting attributes and relationships as needed.
    """
    attributes = data.get("attributes", {})
    return cls(
        id=data["id"],
        name=attributes["name"],
        # ... map other fields
    )
```

## API Client Usage

The `ProwlerAPIClient` is a singleton that handles authentication and HTTP requests:

```python
class MyTools(BaseTool):
    async def my_tool(self) -> dict:
        # GET request
        response = await self.api_client.get("/api/v1/endpoint", params={"key": "value"})

        # POST request
        response = await self.api_client.post(
            "/api/v1/endpoint",
            json_data={"data": {"type": "items", "attributes": {...}}}
        )

        # PATCH request
        response = await self.api_client.patch(
            f"/api/v1/endpoint/{id}",
            json_data={"data": {"attributes": {...}}}
        )

        # DELETE request
        response = await self.api_client.delete(f"/api/v1/endpoint/{id}")
```

### Helper Methods

The API client provides useful helper methods:

```python
# Validate page size (1-1000)
self.api_client.validate_page_size(page_size)

# Normalize date range with max days limit
date_range = self.api_client.normalize_date_range(date_from, date_to, max_days=2)

# Build filter parameters (handles type conversion)
clean_params = self.api_client.build_filter_params({
    "filter[status]": "active",
    "filter[severity__in]": ["high", "critical"],  # Converts to comma-separated
    "filter[muted]": True,  # Converts to "true"
})

# Poll async task until completion
result = await self.api_client.poll_task_until_complete(
    task_id=task_id,
    timeout=60,
    poll_interval=1.0
)
```

## Best Practices

### Tool Docstrings

Tool docstrings become description that is going to be read by the LLM. Provide clear usage instructions and common workflows:

```python
async def search_items(self, status: str = Field(...)) -> dict:
    """Search items with advanced filtering.

    Returns a lightweight list optimized for LLM consumption.
    Use get_item for complete details about a specific item.

    Common workflows:
    - Find critical items: status="critical"
    - Find recent items: Use date_from parameter
    """
```

### Error Handling

Return structured error responses instead of raising exceptions:

```python
async def get_item(self, item_id: str) -> dict:
    try:
        response = await self.api_client.get(f"/api/v1/items/{item_id}")
        return DetailedItem.from_api_response(response["data"]).model_dump()
    except Exception as e:
        self.logger.error(f"Failed to get item {item_id}: {e}")
        return {"error": str(e), "status": "failed"}
```

### Parameter Descriptions

Use Pydantic `Field()` with clear descriptions. This also helps LLMs understand
the purpose of each parameter, so be as descriptive as possible:

```python
async def list_items(
    self,
    severity: list[str] = Field(
        default=[],
        description="Filter by severity levels (critical, high, medium, low)"
    ),
    status: str | None = Field(
        default=None,
        description="Filter by status (PASS, FAIL, MANUAL)"
    ),
    page_size: int = Field(
        default=50,
        description="Results per page"
    ),
) -> dict:
```

## Development Commands

```bash
# Navigate to MCP server directory
cd mcp_server

# Run in STDIO mode (default)
uv run prowler-mcp

# Run in HTTP mode
uv run prowler-mcp --transport http --host 0.0.0.0 --port 8000

# Run with environment variables
PROWLER_APP_API_KEY="pk_xxx" uv run prowler-mcp
```

For complete installation and deployment options, see:
- [Installation Guide](/getting-started/installation/prowler-mcp#from-source-development) - Development setup instructions
- [Configuration Guide](/getting-started/basic-usage/prowler-mcp) - MCP client configuration

For development I recommend to use the [Model Context Protocol Inspector](https://github.com/modelcontextprotocol/inspector) as MCP client to test and debug your tools.

## Related Documentation

<CardGroup cols={2}>
  <Card title="MCP Server Overview" icon="circle-info" href="/getting-started/products/prowler-mcp">
    Key capabilities, use cases, and deployment options
  </Card>
  <Card title="Tools Reference" icon="wrench" href="/getting-started/basic-usage/prowler-mcp-tools">
    Complete reference of all available tools
  </Card>
  <Card title="Prowler Hub" icon="database" href="/getting-started/products/prowler-hub">
    Security checks and compliance frameworks catalog
  </Card>
  <Card title="Lighthouse AI" icon="robot" href="/getting-started/products/prowler-lighthouse-ai">
    AI-powered security analyst
  </Card>
</CardGroup>

## Additional Resources

- [MCP Protocol Specification](https://modelcontextprotocol.io) - Model Context Protocol details
- [Prowler API Documentation](https://api.prowler.com/api/v1/docs) - API reference
- [Prowler Hub API](https://hub.prowler.com/api/docs) - Hub API reference
- [GitHub Repository](https://github.com/prowler-cloud/prowler) - Source code
```

--------------------------------------------------------------------------------

---[FILE: outputs.mdx]---
Location: prowler-master/docs/developer-guide/outputs.mdx

```text
---
title: 'Create a Custom Output Format'
---

## Introduction

Prowler supports multiple output formats, allowing users to tailor findings presentation to their needs. Custom output formats are valuable when integrating Prowler with third-party tools, generating specialized reports, or adapting data for specific workflows. By defining a custom output format, users can refine how findings are structured, extracting and displaying only the most relevant information.

- Output Organization in Prowler

    Prowler outputs are managed within the `/lib/outputs` directory. Each format—such as JSON, CSV, HTML—is implemented as a Python class.

- Outputs are generated based on scan findings, which are stored as structured dictionaries containing details such as:

    - Resource IDs

    - Severities

    - Descriptions

    - Other relevant metadata

- Creation Guidelines

    Refer to the [Prowler Developer Guide](https://docs.prowler.com/projects/prowler-open-source/en/latest/) for insights into Prowler’s architecture and best practices for creating custom outputs.

- Identify the most suitable integration method for the output being targeted.

## Steps to Create a Custom Output Format

### Schema

- Output Class:

    - The class must inherit from `Output`. Review the [Output Class](https://github.com/prowler-cloud/prowler/blob/master/prowler/lib/outputs/output.py).

    - Create a class that encapsulates the required attributes and methods for interacting with the target platform. Below the code for the `CSV` class is presented:

    ```python title="CSV Class"
    class CSV(Output):
        def transform(self, findings: List[Finding]) -> None:
            """Transforms the findings into the CSV format.

            Args:
                findings (list[Finding]): a list of Finding objects

            """
        ...
    ```


    - Transform Method:

        - This method will transform the findings provided by Prowler to a specific format.

        #### Method Implementation

        The following example demonstrates the `transform` method for the `CSV` class:

        ```python title="Transform"
        def transform(self, findings: List[Finding]) -> None:
            """Transforms the findings into the CSV format.

            Args:
                findings (list[Finding]): a list of Finding objects

            """
            try:
                for finding in findings:
                    finding_dict = {}
                    finding_dict["AUTH_METHOD"] = finding.auth_method
                    finding_dict["TIMESTAMP"] = finding.timestamp
                    finding_dict["ACCOUNT_UID"] = finding.account_uid
                    finding_dict["ACCOUNT_NAME"] = finding.account_name
                    finding_dict["ACCOUNT_EMAIL"] = finding.account_email
                    finding_dict["ACCOUNT_ORGANIZATION_UID"] = (
                        finding.account_organization_uid
                    )
                    finding_dict["ACCOUNT_ORGANIZATION_NAME"] = (
                        finding.account_organization_name
                    )
                    finding_dict["ACCOUNT_TAGS"] = unroll_dict(
                        finding.account_tags, separator=":"
                    )
                    finding_dict["FINDING_UID"] = finding.uid
                    finding_dict["PROVIDER"] = finding.metadata.Provider
                    finding_dict["CHECK_ID"] = finding.metadata.CheckID
                    finding_dict["CHECK_TITLE"] = finding.metadata.CheckTitle
                    finding_dict["CHECK_TYPE"] = unroll_list(finding.metadata.CheckType)
                    finding_dict["STATUS"] = finding.status.value
                    finding_dict["STATUS_EXTENDED"] = finding.status_extended
                    finding_dict["MUTED"] = finding.muted
                    finding_dict["SERVICE_NAME"] = finding.metadata.ServiceName
                    finding_dict["SUBSERVICE_NAME"] = finding.metadata.SubServiceName
                    finding_dict["SEVERITY"] = finding.metadata.Severity.value
                    finding_dict["RESOURCE_TYPE"] = finding.metadata.ResourceType
                    finding_dict["RESOURCE_UID"] = finding.resource_uid
                    finding_dict["RESOURCE_NAME"] = finding.resource_name
                    finding_dict["RESOURCE_DETAILS"] = finding.resource_details
                    finding_dict["RESOURCE_TAGS"] = unroll_dict(finding.resource_tags)
                    finding_dict["PARTITION"] = finding.partition
                    finding_dict["REGION"] = finding.region
                    finding_dict["DESCRIPTION"] = finding.metadata.Description
                    finding_dict["RISK"] = finding.metadata.Risk
                    finding_dict["RELATED_URL"] = finding.metadata.RelatedUrl
                    finding_dict["ADDITIONAL_URLS"] = unroll_list(finding.metadata.AdditionalURLs)
                    finding_dict["REMEDIATION_RECOMMENDATION_TEXT"] = (
                        finding.metadata.Remediation.Recommendation.Text
                    )
                    finding_dict["REMEDIATION_RECOMMENDATION_URL"] = (
                        finding.metadata.Remediation.Recommendation.Url
                    )
                    finding_dict["REMEDIATION_CODE_NATIVEIAC"] = (
                        finding.metadata.Remediation.Code.NativeIaC
                    )
                    finding_dict["REMEDIATION_CODE_TERRAFORM"] = (
                        finding.metadata.Remediation.Code.Terraform
                    )
                    finding_dict["REMEDIATION_CODE_CLI"] = (
                        finding.metadata.Remediation.Code.CLI
                    )
                    finding_dict["REMEDIATION_CODE_OTHER"] = (
                        finding.metadata.Remediation.Code.Other
                    )
                    finding_dict["COMPLIANCE"] = unroll_dict(
                        finding.compliance, separator=": "
                    )
                    finding_dict["CATEGORIES"] = unroll_list(finding.metadata.Categories)
                    finding_dict["DEPENDS_ON"] = unroll_list(finding.metadata.DependsOn)
                    finding_dict["RELATED_TO"] = unroll_list(finding.metadata.RelatedTo)
                    finding_dict["NOTES"] = finding.metadata.Notes
                    finding_dict["PROWLER_VERSION"] = finding.prowler_version
                    self._data.append(finding_dict)
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        ```

    - Batch Write Data To File Method:

        - This method will write the modeled object to a file.

        #### Method Implementation

        The following example demonstrates the `batch_write_data_to_file` method for the `CSV` class:

        ```python title="Batch Write Data To File"
        def batch_write_data_to_file(self) -> None:
            """Writes the findings to a file using the CSV format using the `Output._file_descriptor`."""
            try:
                if (
                    getattr(self, "_file_descriptor", None)
                    and not self._file_descriptor.closed
                    and self._data
                ):
                    csv_writer = DictWriter(
                        self._file_descriptor,
                        fieldnames=self._data[0].keys(),
                        delimiter=";",
                    )
                    csv_writer.writeheader()
                    for finding in self._data:
                        csv_writer.writerow(finding)
                    self._file_descriptor.close()
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        ```

### Integrating the Custom Output Format into Prowler

Once the custom output format is created, it must be integrated into Prowler to ensure compatibility with the existing architecture.

#### Reviewing Current Supported Outputs

Before implementing the new output format, examine the usage of currently supported formats to understand their structure and integration approach. Example: CSV Output Creation in Prowler

Below is an example of how Prowler generates and processes CSV output within its [codebase](https://github.com/prowler-cloud/prowler/blob/master/prowler/__main__.py):

```python title="CSV creation"
if mode == "csv":
    csv_output = CSV(
        findings=finding_outputs,
        create_file_descriptor=True,
        file_path=f"{filename}{csv_file_suffix}",
    )
    generated_outputs["regular"].append(csv_output)
    # Write CSV Finding Object to file.
    csv_output.batch_write_data_to_file()
```

### Testing

* Verify that Prowler’s findings are accurately typed in the desired output format.

* Error Handling – Simulate edge cases to assess robustness and failure recovery mechanisms.

### Documentation

* Ensure the following elements are included:

    * Setup Instructions – List all necessary dependencies and installation steps.
    * Configuration details.
    * Example Use Cases – Provide practical scenarios demonstrating functionality.
    * Troubleshooting Guide – Document common issues and resolution steps.

* Comprehensive and clear documentation improves maintainability and simplifies onboarding of new users.
```

--------------------------------------------------------------------------------

````
