---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 113
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 113 of 867)

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

---[FILE: search_engine.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_documentation/search_engine.py
Signals: Pydantic

```python
import httpx
from prowler_mcp_server import __version__
from pydantic import BaseModel, Field


class SearchResult(BaseModel):
    """Search result model."""

    path: str = Field(description="Document path")
    title: str = Field(description="Document title")
    url: str = Field(description="Documentation URL")
    highlights: list[str] = Field(
        description="Highlighted content snippets showing query matches with <mark><b> tags",
        default_factory=list,
    )
    score: float = Field(
        description="Relevance score for the search result", default=0.0
    )


class ProwlerDocsSearchEngine:
    """Prowler documentation search using Mintlify API."""

    def __init__(self):
        """Initialize the search engine."""
        self.api_base_url = (
            "https://api.mintlifytrieve.com/api/chunk_group/group_oriented_autocomplete"
        )
        self.dataset_id = "0096ba11-3f72-463b-9d95-b788495ac392"
        self.api_key = "tr-T6JLeTkFXeNbNPyhijtI9XhIncydQQ3O"
        self.docs_base_url = "https://prowler.mintlify.app"

        # HTTP client for Mintlify API
        self.mintlify_client = httpx.Client(
            timeout=30.0,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": f"prowler-mcp-server/{__version__}",
                "TR-Dataset": self.dataset_id,
                "Authorization": self.api_key,
                "X-API-Version": "V2",
            },
        )

        # HTTP client for Mintlify documentation
        self.docs_client = httpx.Client(
            timeout=30.0,
            headers={
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "User-Agent": f"prowler-mcp-server/{__version__}",
            },
        )

    def search(self, query: str, page_size: int = 5) -> list[SearchResult]:
        """
        Search documentation using Mintlify API.

        Args:
            query: Search query string
            page_size: Maximum number of results to return

        Returns:
            list of search results
        """
        try:
            # Construct request body
            payload = {
                "query": query,
                "search_type": "fulltext",
                "extend_results": True,
                "highlight_options": {
                    "highlight_window": 10,
                    "highlight_max_num": 1,
                    "highlight_max_length": 2,
                    "highlight_strategy": "exactmatch",
                    "highlight_delimiters": ["?", ",", ".", "!", "\n"],
                },
                "score_threshold": 0.2,
                "filters": {"must_not": [{"field": "tag_set", "match": ["code"]}]},
                "page_size": page_size,
                "group_size": 3,
            }

            # Make request to Mintlify API
            response = self.mintlify_client.post(
                self.api_base_url,
                json=payload,
            )
            response.raise_for_status()
            data = response.json()

            # Parse results
            results = []
            for result in data.get("results", []):
                group = result.get("group", {})
                chunks = result.get("chunks", [])

                # Get document path and title from group
                doc_path = group.get("name", "")
                group_title = group.get("name", "").replace("/", " / ").title()

                # If chunks exist, use the first chunk's title from metadata
                title = group_title
                if chunks:
                    first_chunk = chunks[0].get("chunk", {})
                    metadata = first_chunk.get("metadata", {})
                    title = metadata.get("title", group_title)

                # Construct full URL to docs
                full_url = f"{self.docs_base_url}/{doc_path}"

                # Extract highlights and scores from chunks
                highlights = []
                max_score = 0.0
                for chunk_data in chunks:
                    chunk_highlights = chunk_data.get("highlights", [])
                    highlights.extend(chunk_highlights)
                    # Track the highest score among all chunks in this group
                    chunk_score = chunk_data.get("score", 0.0)
                    max_score = max(max_score, chunk_score)

                results.append(
                    SearchResult(
                        path=doc_path,
                        title=title,
                        url=full_url,
                        highlights=highlights,
                        score=max_score,
                    )
                )

            return results

        except Exception as e:
            # Return empty list on error
            print(f"Search error: {e}")
            return []

    def get_document(self, doc_path: str) -> str | None:
        """
        Get full document content from Mintlify documentation.

        Args:
            doc_path: Path to the documentation file (e.g., "getting-started/installation")

        Returns:
            Full markdown content of the documentation, or None if not found
        """
        try:
            # Clean up the path
            doc_path = doc_path.rstrip("/")

            # Add .md extension if not present (Mintlify serves both .md and .mdx)
            if not doc_path.endswith(".md"):
                doc_path = f"{doc_path}.md"

            # Construct Mintlify URL
            url = f"{self.docs_base_url}/{doc_path}"

            # Fetch the documentation page
            response = self.docs_client.get(url)
            response.raise_for_status()

            return response.text

        except Exception as e:
            print(f"Error fetching document: {e}")
            return None
```

--------------------------------------------------------------------------------

---[FILE: server.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_documentation/server.py
Signals: Pydantic

```python
from typing import Any

from fastmcp import FastMCP
from pydantic import Field

from prowler_mcp_server.prowler_documentation.search_engine import (
    ProwlerDocsSearchEngine,
)

# Initialize FastMCP server
docs_mcp_server = FastMCP("prowler-docs")
prowler_docs_search_engine = ProwlerDocsSearchEngine()


@docs_mcp_server.tool()
def search(
    term: str = Field(description="The term to search for in the documentation"),
    page_size: int = Field(
        5,
        description="Number of top results to return to return. It must be between 1 and 20.",
        gt=1,
        lt=20,
    ),
) -> list[dict[str, Any]]:
    """Search in Prowler documentation.

    This tool searches through the official Prowler documentation
    to find relevant information about everything related to Prowler.

    Uses fulltext search to find the most relevant documentation pages
    based on your query.

    Returns:
        List of search results with highlights showing matched terms (in <mark><b> tags)
    """
    return prowler_docs_search_engine.search(term, page_size)  # type: ignore In the hint we cannot put SearchResult type because JSON API MCP Generator cannot handle Pydantic models yet


@docs_mcp_server.tool()
def get_document(
    doc_path: str = Field(
        description="Path to the documentation file to retrieve. It is the same as the 'path' field of the search results. Use `prowler_docs_search` to find the path first."
    ),
) -> dict[str, str]:
    """Retrieve the full content of a Prowler documentation file.

    Use this after searching to get the complete content of a specific
    documentation file.

    Returns:
        Full content of the documentation file in markdown format.
    """
    content: str | None = prowler_docs_search_engine.get_document(doc_path)
    if content is None:
        return {"error": f"Document '{doc_path}' not found."}
    else:
        return {"content": content}
```

--------------------------------------------------------------------------------

---[FILE: server.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_hub/server.py
Signals: Pydantic

```python
"""
Prowler Hub MCP module

Provides access to Prowler Hub API for security checks and compliance frameworks.
"""

import httpx
from fastmcp import FastMCP
from pydantic import Field

from prowler_mcp_server import __version__

# Initialize FastMCP for Prowler Hub
hub_mcp_server = FastMCP("prowler-hub")

# API base URL
BASE_URL = "https://hub.prowler.com/api"

# HTTP client configuration
prowler_hub_client = httpx.Client(
    base_url=BASE_URL,
    timeout=30.0,
    headers={
        "Accept": "application/json",
        "User-Agent": f"prowler-mcp-server/{__version__}",
    },
)

# GitHub raw content base URL for Prowler checks
GITHUB_RAW_BASE = (
    "https://raw.githubusercontent.com/prowler-cloud/prowler/refs/heads/master/"
    "prowler/providers"
)

# Separate HTTP client for GitHub raw content
github_raw_client = httpx.Client(
    timeout=30.0,
    headers={
        "Accept": "*/*",
        "User-Agent": f"prowler-mcp-server/{__version__}",
    },
)


def github_check_path(provider_id: str, check_id: str, suffix: str) -> str:
    """Build the GitHub raw URL for a given check artifact suffix using provider
    and check_id.

    Suffix examples: ".metadata.json", ".py", "_fixer.py"
    """
    try:
        service_id = check_id.split("_", 1)[0]
    except IndexError:
        service_id = check_id
    return f"{GITHUB_RAW_BASE}/{provider_id}/services/{service_id}/{check_id}/{check_id}{suffix}"


# Security Check Tools
@hub_mcp_server.tool()
async def list_checks(
    providers: list[str] = Field(
        default=[],
        description="Filter by Prowler provider IDs. Example: ['aws', 'azure']. Use `prowler_hub_list_providers` to get available provider IDs.",
    ),
    services: list[str] = Field(
        default=[],
        description="Filter by provider services. Example: ['s3', 'ec2', 'keyvault']. Use `prowler_hub_get_provider_services` to get available services for a provider.",
    ),
    severities: list[str] = Field(
        default=[],
        description="Filter by severity levels. Example: ['high', 'critical']. Available: 'low', 'medium', 'high', 'critical'.",
    ),
    categories: list[str] = Field(
        default=[],
        description="Filter by security categories. Example: ['encryption', 'internet-exposed'].",
    ),
    compliances: list[str] = Field(
        default=[],
        description="Filter by compliance framework IDs. Example: ['cis_4.0_aws', 'ens_rd2022_azure']. Use `prowler_hub_list_compliances` to get available compliance IDs.",
    ),
) -> dict:
    """List security Prowler Checks with filtering capabilities.

    IMPORTANT: This tool returns LIGHTWEIGHT check data. Use this for fast browsing and filtering.
    For complete details including risk, remediation guidance, and categories use `prowler_hub_get_check_details`.

    IMPORTANT: An unfiltered request returns 1000+ checks. Use filters to narrow results.

    Returns:
        {
            "count": N,
            "checks": [
                {
                    "id": "check_id",
                    "provider": "provider_id",
                    "title": "Human-readable check title",
                    "severity": "critical|high|medium|low",
                },
                ...
            ]
        }

    Useful Example Workflow:
    1. Use `prowler_hub_list_providers` to see available Prowler providers
    2. Use `prowler_hub_get_provider_services` to see services for a provider
    3. Use this tool with filters to find relevant checks
    4. Use `prowler_hub_get_check_details` to get complete information for a specific check
    """
    # Lightweight fields for listing
    lightweight_fields = "id,title,severity,provider"

    params: dict[str, str] = {"fields": lightweight_fields}

    if providers:
        params["providers"] = ",".join(providers)
    if services:
        params["services"] = ",".join(services)
    if severities:
        params["severities"] = ",".join(severities)
    if categories:
        params["categories"] = ",".join(categories)
    if compliances:
        params["compliances"] = ",".join(compliances)

    try:
        response = prowler_hub_client.get("/check", params=params)
        response.raise_for_status()
        checks = response.json()

        # Return checks as a lightweight list
        checks_list = []
        for check in checks:
            check_data = {
                "id": check["id"],
                "provider": check["provider"],
                "title": check["title"],
                "severity": check["severity"],
            }
            checks_list.append(check_data)

        return {"count": len(checks), "checks": checks_list}
    except httpx.HTTPStatusError as e:
        return {
            "error": f"HTTP error {e.response.status_code}: {e.response.text}",
        }
    except Exception as e:
        return {"error": str(e)}


@hub_mcp_server.tool()
async def semantic_search_checks(
    term: str = Field(
        description="Search term. Examples: 'public access', 'encryption', 'MFA', 'logging'.",
    ),
) -> dict:
    """Search for security checks using free-text search across all metadata.

    IMPORTANT: This tool returns LIGHTWEIGHT check data. Use this for discovering checks by topic.
    For complete details including risk, remediation guidance, and categories use `prowler_hub_get_check_details`.

    Searches across check titles, descriptions, risk statements, remediation guidance,
    and other text fields. Use this when you don't know the exact check ID or want to
    explore checks related to a topic.

    Returns:
        {
            "count": N,
            "checks": [
                {
                    "id": "check_id",
                    "provider": "provider_id",
                    "title": "Human-readable check title",
                    "severity": "critical|high|medium|low",
                },
                ...
            ]
        }

    Useful Example Workflow:
    1. Use this tool to search for checks by keyword or topic
    2. Use `prowler_hub_list_checks` with filters for more targeted browsing
    3. Use `prowler_hub_get_check_details` to get complete information for a specific check
    """
    try:
        response = prowler_hub_client.get("/check/search", params={"term": term})
        response.raise_for_status()
        checks = response.json()

        # Return checks as a lightweight list
        checks_list = []
        for check in checks:
            check_data = {
                "id": check["id"],
                "provider": check["provider"],
                "title": check["title"],
                "severity": check["severity"],
            }
            checks_list.append(check_data)

        return {"count": len(checks), "checks": checks_list}
    except httpx.HTTPStatusError as e:
        return {
            "error": f"HTTP error {e.response.status_code}: {e.response.text}",
        }
    except Exception as e:
        return {"error": str(e)}


@hub_mcp_server.tool()
async def get_check_details(
    check_id: str = Field(
        description="The check ID to retrieve details for. Example: 's3_bucket_level_public_access_block'"
    ),
) -> dict:
    """Retrieve comprehensive details about a specific security check by its ID.

    IMPORTANT: This tool returns COMPLETE check details.
    Use this after finding a specific check ID, you can get it via `prowler_hub_list_checks` or `prowler_hub_semantic_search_checks`.

    Returns:
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "provider": "string",
          "service": "string",
          "severity": "low",
          "risk": "string",
          "reference": [
            "string"
          ],
          "additional_urls": [
            "string"
          ],
          "remediation": {
            "cli": {
              "description": "string"
            },
            "terraform": {
              "description": "string"
            },
            "nativeiac": {
              "description": "string"
            },
            "other": {
              "description": "string"
            },
            "wui": {
              "description": "string",
              "reference": "string"
            }
          },
          "services_required": [
            "string"
          ],
          "notes": "string",
          "compliances": [
            {
              "name": "string",
              "id": "string"
            }
          ],
          "categories": [
            "string"
          ],
          "resource_type": "string",
          "related_url": "string",
          "fixer": bool
        }

    Useful Example Workflow:
    1. Use `prowler_hub_list_checks` or `prowler_hub_search_checks` to find check IDs
    2. Use this tool with the check 'id' to get complete information including remediation guidance
    """
    try:
        response = prowler_hub_client.get(f"/check/{check_id}")
        response.raise_for_status()
        check = response.json()

        if not check:
            return {"error": f"Check '{check_id}' not found"}

        # Build response with only non-empty fields to save tokens
        result = {}

        # Core fields
        result["id"] = check["id"]
        if check.get("title"):
            result["title"] = check["title"]
        if check.get("description"):
            result["description"] = check["description"]
        if check.get("provider"):
            result["provider"] = check["provider"]
        if check.get("service"):
            result["service"] = check["service"]
        if check.get("severity"):
            result["severity"] = check["severity"]
        if check.get("risk"):
            result["risk"] = check["risk"]
        if check.get("resource_type"):
            result["resource_type"] = check["resource_type"]

        # List fields
        if check.get("reference"):
            result["reference"] = check["reference"]
        if check.get("additional_urls"):
            result["additional_urls"] = check["additional_urls"]
        if check.get("services_required"):
            result["services_required"] = check["services_required"]
        if check.get("categories"):
            result["categories"] = check["categories"]
        if check.get("compliances"):
            result["compliances"] = check["compliances"]

        # Other fields
        if check.get("notes"):
            result["notes"] = check["notes"]
        if check.get("related_url"):
            result["related_url"] = check["related_url"]
        if check.get("fixer") is not None:
            result["fixer"] = check["fixer"]

        # Remediation - filter out empty nested values
        remediation = check.get("remediation", {})
        if remediation:
            filtered_remediation = {}
            for key, value in remediation.items():
                if value and isinstance(value, dict):
                    # Filter out empty values within nested dict
                    filtered_value = {k: v for k, v in value.items() if v}
                    if filtered_value:
                        filtered_remediation[key] = filtered_value
                elif value:
                    filtered_remediation[key] = value
            if filtered_remediation:
                result["remediation"] = filtered_remediation

        return result
    except httpx.HTTPStatusError as e:
        return {
            "error": f"HTTP error {e.response.status_code}: {e.response.text}",
        }
    except Exception as e:
        return {"error": str(e)}


@hub_mcp_server.tool()
async def get_check_code(
    provider_id: str = Field(
        description="Prowler Provider ID. Example: 'aws', 'azure', 'gcp', 'kubernetes'. Use `prowler_hub_list_providers` to get available provider IDs.",
    ),
    check_id: str = Field(
        description="The check ID. Example: 's3_bucket_public_access'. Get IDs from `prowler_hub_list_checks` or `prowler_hub_search_checks`.",
    ),
) -> dict:
    """Fetch the Python implementation code of a Prowler security check.

    The check code shows exactly how Prowler evaluates resources for security issues.
    Use this to understand check logic, customize checks, or create new ones.

    Returns:
        {
            "content": "Python source code of the check implementation"
        }
    """
    if provider_id and check_id:
        url = github_check_path(provider_id, check_id, ".py")
        try:
            resp = github_raw_client.get(url)
            resp.raise_for_status()
            return {
                "content": resp.text,
            }
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return {
                    "error": f"Check {check_id} not found in Prowler",
                }
            else:
                return {
                    "error": f"HTTP error {e.response.status_code}: {e.response.text}",
                }
        except Exception as e:
            return {
                "error": str(e),
            }
    else:
        return {
            "error": "Provider ID and check ID are required",
        }


@hub_mcp_server.tool()
async def get_check_fixer(
    provider_id: str = Field(
        description="Prowler Provider ID. Example: 'aws', 'azure', 'gcp', 'kubernetes'. Use `prowler_hub_list_providers` to get available provider IDs.",
    ),
    check_id: str = Field(
        description="The check ID. Example: 's3_bucket_public_access'. Get IDs from `prowler_hub_list_checks` or `prowler_hub_search_checks`.",
    ),
) -> dict:
    """Fetch the auto-remediation (fixer) code for a Prowler security check.

    IMPORTANT: Not all checks have fixers. A "fixer not found" response means the check
    doesn't have auto-remediation code - this is normal for many checks.

    Fixer code provides automated remediation that can fix security issues detected by checks.
    Use this to understand how to programmatically remediate findings.

    Returns:
        {
            "content": "Python source code of the auto-remediation implementation"
        }
        Or if no fixer exists:
        {
            "error": "Fixer not found for check {check_id}"
        }
    """
    if provider_id and check_id:
        url = github_check_path(provider_id, check_id, "_fixer.py")
        try:
            resp = github_raw_client.get(url)
            if resp.status_code == 404:
                return {
                    "error": f"Fixer not found for check {check_id}",
                }
            resp.raise_for_status()
            return {
                "content": resp.text,
            }
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return {
                    "error": f"Check {check_id} not found in Prowler",
                }
            else:
                return {
                    "error": f"HTTP error {e.response.status_code}: {e.response.text}",
                }
        except Exception as e:
            return {
                "error": str(e),
            }
    else:
        return {
            "error": "Provider ID and check ID are required",
        }


# Compliance Framework Tools
@hub_mcp_server.tool()
async def list_compliances(
    provider: list[str] = Field(
        default=[],
        description="Filter by cloud provider. Example: ['aws']. Use `prowler_hub_list_providers` to get available provider IDs.",
    ),
) -> dict:
    """List compliance frameworks supported by Prowler.

    IMPORTANT: This tool returns LIGHTWEIGHT compliance data. Use this for fast browsing and filtering.
    For complete details including requirements use `prowler_hub_get_compliance_details`.

    Compliance frameworks define sets of security requirements that checks map to.
    Use this to discover available frameworks for compliance reporting.

    WARNING: An unfiltered request may return a large number of frameworks. Use the provider with not more than 3 different providers to make easier the response handling.

    Returns:
        {
            "count": N,
            "compliances": [
                {
                    "id": "cis_4.0_aws",
                    "name": "CIS Amazon Web Services Foundations Benchmark v4.0",
                    "provider": "aws",
                },
                ...
            ]
        }

    Useful Example Workflow:
    1. Use `prowler_hub_list_providers` to see available cloud providers
    2. Use this tool to browse compliance frameworks
    3. Use `prowler_hub_get_compliance_details` with the compliance 'id' to get complete information
    """
    # Lightweight fields for listing
    lightweight_fields = "id,name,provider"

    params: dict[str, str] = {"fields": lightweight_fields}

    if provider:
        params["provider"] = ",".join(provider)

    try:
        response = prowler_hub_client.get("/compliance", params=params)
        response.raise_for_status()
        compliances = response.json()

        # Return compliances as a lightweight list
        compliances_list = []
        for compliance in compliances:
            compliance_data = {
                "id": compliance["id"],
                "name": compliance["name"],
                "provider": compliance["provider"],
            }
            compliances_list.append(compliance_data)

        return {"count": len(compliances), "compliances": compliances_list}
    except httpx.HTTPStatusError as e:
        return {
            "error": f"HTTP error {e.response.status_code}: {e.response.text}",
        }
    except Exception as e:
        return {"error": str(e)}


@hub_mcp_server.tool()
async def semantic_search_compliances(
    term: str = Field(
        description="Search term. Examples: 'CIS', 'HIPAA', 'PCI', 'GDPR', 'SOC2', 'NIST'.",
    ),
) -> dict:
    """Search for compliance frameworks using free-text search.

    IMPORTANT: This tool returns LIGHTWEIGHT compliance data. Use this for discovering frameworks by topic.
    For complete details including requirements use `prowler_hub_get_compliance_details`.

    Searches across framework names, descriptions, and metadata. Use this when you
    want to find frameworks related to a specific regulation, standard, or topic.

    Returns:
        {
            "count": N,
            "compliances": [
                {
                    "id": "cis_4.0_aws",
                    "name": "CIS Amazon Web Services Foundations Benchmark v4.0",
                    "provider": "aws",
                },
                ...
            ]
        }
    """
    try:
        response = prowler_hub_client.get("/compliance/search", params={"term": term})
        response.raise_for_status()
        compliances = response.json()

        # Return compliances as a lightweight list
        compliances_list = []
        for compliance in compliances:
            compliance_data = {
                "id": compliance["id"],
                "name": compliance["name"],
                "provider": compliance["provider"],
            }
            compliances_list.append(compliance_data)

        return {"count": len(compliances), "compliances": compliances_list}
    except httpx.HTTPStatusError as e:
        return {
            "error": f"HTTP error {e.response.status_code}: {e.response.text}",
        }
    except Exception as e:
        return {"error": str(e)}


@hub_mcp_server.tool()
async def get_compliance_details(
    compliance_id: str = Field(
        description="The compliance framework ID to retrieve details for. Example: 'cis_4.0_aws'. Use `prowler_hub_list_compliances` or `prowler_hub_semantic_search_compliances` to find available compliance IDs.",
    ),
) -> dict:
    """Retrieve comprehensive details about a specific compliance framework by its ID.

    IMPORTANT: This tool returns COMPLETE compliance details.
    Use this after finding a specific compliance via `prowler_hub_list_compliances` or `prowler_hub_semantic_search_compliances`.

    Returns:
        {
            "id": "string",
            "name": "string",
            "framework": "string",
            "provider": "string",
            "version": "string",
            "description": "string",
            "total_checks": int,
            "total_requirements": int,
            "requirements": [
                {
                    "id": "string",
                    "name": "string",
                    "description": "string",
                    "checks": ["check_id_1", "check_id_2"]
                }
            ]
        }
    """
    try:
        response = prowler_hub_client.get(f"/compliance/{compliance_id}")
        response.raise_for_status()
        compliance = response.json()

        if not compliance:
            return {"error": f"Compliance '{compliance_id}' not found"}

        # Build response with only non-empty fields to save tokens
        result = {}

        # Core fields
        result["id"] = compliance["id"]
        if compliance.get("name"):
            result["name"] = compliance["name"]
        if compliance.get("framework"):
            result["framework"] = compliance["framework"]
        if compliance.get("provider"):
            result["provider"] = compliance["provider"]
        if compliance.get("version"):
            result["version"] = compliance["version"]
        if compliance.get("description"):
            result["description"] = compliance["description"]

        # Numeric fields
        if compliance.get("total_checks"):
            result["total_checks"] = compliance["total_checks"]
        if compliance.get("total_requirements"):
            result["total_requirements"] = compliance["total_requirements"]

        # Requirements - filter out empty nested values
        requirements = compliance.get("requirements", [])
        if requirements:
            filtered_requirements = []
            for req in requirements:
                filtered_req = {}
                if req.get("id"):
                    filtered_req["id"] = req["id"]
                if req.get("name"):
                    filtered_req["name"] = req["name"]
                if req.get("description"):
                    filtered_req["description"] = req["description"]
                if req.get("checks"):
                    filtered_req["checks"] = req["checks"]
                if filtered_req:
                    filtered_requirements.append(filtered_req)
            if filtered_requirements:
                result["requirements"] = filtered_requirements

        return result
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return {"error": f"Compliance '{compliance_id}' not found"}
        return {
            "error": f"HTTP error {e.response.status_code}: {e.response.text}",
        }
    except Exception as e:
        return {"error": str(e)}


# Provider Tools
@hub_mcp_server.tool()
async def list_providers() -> dict:
    """List all providers supported by Prowler.

    This is a reference tool that shows available providers (aws, azure, gcp, kubernetes, etc.)
    that can be scanned for finding security issues.

    Use the provider IDs from this tool as filter values in other tools.

    Returns:
        {
            "count": N,
            "providers": [
                {
                    "id": "aws",
                    "name": "Amazon Web Services"
                },
                {
                    "id": "azure",
                    "name": "Microsoft Azure"
                },
                ...
            ]
        }
    """
    try:
        response = prowler_hub_client.get("/providers")
        response.raise_for_status()
        providers = response.json()

        providers_list = []
        for provider in providers:
            providers_list.append(
                {
                    "id": provider["id"],
                    "name": provider.get("name", ""),
                }
            )

        return {"count": len(providers), "providers": providers_list}
    except httpx.HTTPStatusError as e:
        return {
            "error": f"HTTP error {e.response.status_code}: {e.response.text}",
        }
    except Exception as e:
        return {"error": str(e)}


@hub_mcp_server.tool()
async def get_provider_services(
    provider_id: str = Field(
        description="The provider ID to get services for. Example: 'aws', 'azure', 'gcp', 'kubernetes'. Use `prowler_hub_list_providers` to get available provider IDs.",
    ),
) -> dict:
    """Get the list of services IDs available for a specific cloud provider.

    Services represent the different resources and capabilities that Prowler can scan
    within a provider (e.g., s3, ec2, iam for AWS or keyvault, storage for Azure).

    Use service IDs from this tool as filter values in other tools.

    Returns:
        {
            "provider_id": "aws",
            "provider_name": "Amazon Web Services",
            "count": N,
            "services": ["s3", "ec2", "iam", "rds", "lambda", ...]
        }
    """
    try:
        response = prowler_hub_client.get("/providers")
        response.raise_for_status()
        providers = response.json()

        for provider in providers:
            if provider["id"] == provider_id:
                return {
                    "provider_id": provider["id"],
                    "provider_name": provider.get("name", ""),
                    "count": len(provider.get("services", [])),
                    "services": provider.get("services", []),
                }

        return {"error": f"Provider '{provider_id}' not found"}
    except httpx.HTTPStatusError as e:
        return {
            "error": f"HTTP error {e.response.status_code}: {e.response.text}",
        }
    except Exception as e:
        return {"error": str(e)}
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: prowler-master/mcp_server/prowler_mcp_server/prowler_hub/__init__.py

```python
"""Prowler Hub module for MCP server."""

__all__ = ["prowler_hub_mcp"]
```

--------------------------------------------------------------------------------

---[FILE: create_role_to_assume_cfn.yaml]---
Location: prowler-master/permissions/create_role_to_assume_cfn.yaml

```yaml
AWSTemplateFormatVersion: '2010-09-09'
#
# You can invoke CloudFormation and pass the principal ARN from a command line like this:
# aws cloudformation create-stack \
#  --capabilities CAPABILITY_IAM --capabilities CAPABILITY_NAMED_IAM \
#  --template-body "file://create_role_to_assume_cfn.yaml" \
#  --stack-name "ProwlerScanRole" \
#  --parameters "ParameterKey=AuthorisedARN,ParameterValue=arn:aws:iam::123456789012:root"
#
Description: |
  This template creates an AWS IAM Role with an inline policy and two AWS managed policies
  attached. It sets the trust policy on that IAM Role to permit a named ARN in another AWS
  account to assume that role. The role name and the ARN of the trusted user can all be passed
  to the CloudFormation stack as parameters. Then you can run Prowler to perform a security
  assessment with a command like:
  prowler --role ProwlerScanRole.ARN
Parameters:
  AuthorisedARN:
    Description: |
      ARN of user who is authorised to assume the role that is created by this template.
      E.g., arn:aws:iam::123456789012:root
    Type: String
  ProwlerRoleName:
    Description: |
      Name of the IAM role that will have these policies attached. Default: ProwlerScanRole
    Type: String
    Default: 'ProwlerScanRole'

Resources:
  ProwlerScanRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              AWS: !Sub ${AuthorisedARN}
            Action: 'sts:AssumeRole'
            ## In case MFA is required uncomment lines below and read https://github.com/prowler-cloud/prowler#run-prowler-with-mfa-protected-credentials
            # Condition:
            #   Bool:
            #     'aws:MultiFactorAuthPresent': true
      # This is 12h that is maximum allowed, Minimum is 3600 = 1h
      # to take advantage of this use -T like in './prowler --role ProwlerScanRole.ARN -T 43200'
      MaxSessionDuration: 43200
      ManagedPolicyArns:
        - 'arn:aws:iam::aws:policy/SecurityAudit'
        - 'arn:aws:iam::aws:policy/job-function/ViewOnlyAccess'
      RoleName: !Sub ${ProwlerRoleName}
      Policies:
        - PolicyName: ProwlerScanRoleAdditionalViewPrivileges
          PolicyDocument:
            Version : '2012-10-17'
            Statement:
            - Effect: Allow
              Action:
                - 'account:Get*'
                - 'appstream:Describe*'
                - 'appstream:List*'
                - 'backup:List*'
                - 'bedrock:List*'
                - 'bedrock:Get*'
                - 'cloudtrail:GetInsightSelectors'
                - 'codeartifact:List*'
                - 'codebuild:BatchGet*'
                - 'codebuild:ListReportGroups'
                - 'cognito-idp:GetUserPoolMfaConfig'
                - 'dlm:Get*'
                - 'drs:Describe*'
                - 'ds:Get*'
                - 'ds:Describe*'
                - 'ds:List*'
                - 'dynamodb:GetResourcePolicy'
                - 'ec2:GetEbsEncryptionByDefault'
                - 'ec2:GetSnapshotBlockPublicAccessState'
                - 'ec2:GetInstanceMetadataDefaults'
                - 'ecr:Describe*'
                - 'ecr:GetRegistryScanningConfiguration'
                - 'elasticfilesystem:DescribeBackupPolicy'
                - 'glue:GetConnections'
                - 'glue:GetSecurityConfiguration*'
                - 'glue:SearchTables'
                - 'lambda:GetFunction*'
                - 'logs:FilterLogEvents'
                - 'lightsail:GetRelationalDatabases'
                - 'macie2:GetMacieSession'
                - 'macie2:GetAutomatedDiscoveryConfiguration'
                - 's3:GetAccountPublicAccessBlock'
                - 'shield:DescribeProtection'
                - 'shield:GetSubscriptionState'
                - 'securityhub:BatchImportFindings'
                - 'securityhub:GetFindings'
                - 'servicecatalog:Describe*'
                - 'servicecatalog:List*'
                - 'ssm:GetDocument'
                - 'ssm-incidents:List*'
                - 'states:ListTagsForResource'
                - 'support:Describe*'
                - 'tag:GetTagKeys'
                - 'wellarchitected:List*'
              Resource: '*'
        - PolicyName: ProwlerScanRoleAdditionalViewPrivilegesApiGateway
          PolicyDocument:
            Version : '2012-10-17'
            Statement:
            - Effect: Allow
              Action:
                - 'apigateway:GET'
              Resource: 'arn:aws:apigateway:*::/restapis/*'
```

--------------------------------------------------------------------------------

````
