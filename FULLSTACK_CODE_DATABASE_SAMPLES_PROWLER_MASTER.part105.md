---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 105
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 105 of 867)

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

---[FILE: aws_scan.ipynb]---
Location: prowler-master/examples/sdk/aws_scan.ipynb

```text
{
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## Setup and Configure Logger\n",
        "This section configures the Python logging system to filter Prowler's output messages during security scans. We set the logging level to `CRITICAL`."
      ]
    },
    {
      "cell_type": "code",
      "execution_count": 8,
      "metadata": {},
      "outputs": [],
      "source": [
        "import logging\n",
        "\n",
        "logging.basicConfig(level=logging.CRITICAL)"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## Initialize AWS Provider"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
        "# Import the Prowler's provider you want to scan\n",
        "from prowler.providers.aws.aws_provider import AwsProvider\n",
        "import json\n",
        "\n",
        "# Path to credentials file\n",
        "credentials_path = \"./secrets-sdk/credentials.json\"\n",
        "\n",
        "# Load credentials from JSON file\n",
        "try:\n",
        "    with open(credentials_path, \"r\") as f:\n",
        "        aws_credentials = json.load(f)\n",
        "    print(\"AWS credentials loaded successfully from file\")\n",
        "except (FileNotFoundError, json.JSONDecodeError):\n",
        "    print(\"Invalid or missing JSON credentials file\")\n",
        "    aws_credentials = {\n",
        "        \"aws_access_key_id\": \"YOUR_ACCESS_KEY\",\n",
        "        \"aws_secret_access_key\": \"YOUR_SECRET_KEY\",\n",
        "        \"aws_session_token\": \"YOUR_SESSION_TOKEN\"\n",
        "    }\n",
        "\n",
        "# Optional: Test the AWS provider credentials before instantiation to verify that credentials work\n",
        "aws_connection = AwsProvider.test_connection(**aws_credentials)\n",
        "print(f\"AWS Test Connection:\\n\\t- Connected: {aws_connection.is_connected}\\n\\t- Error (if any): {aws_connection.error}\\n\")\n",
        "\n",
        "# Initialize the AWS provider with static credentials\n",
        "aws = AwsProvider(**aws_credentials)\n",
        "\n",
        "# AWS Identity Information\n",
        "print(f\"AWS Identity Information:\\n\\t- Account Number: {aws.identity.account}\\n\\t- User ID: {aws.identity.user_id}\\n\")\n",
        "\n",
        "# Alternative Providers (commented out)\n",
        "# from prowler.providers.gcp.gcp_provider import GcpProvider\n",
        "# from prowler.providers.azure.azure_provider import AzureProvider\n",
        "# from prowler.providers.kubernetes.kubernetes_provider import KubernetesProvider\n",
        "# from prowler.providers.m365.m365_provider import M365Provider"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
        "import pprint\n",
        "pprint.pp(aws.identity)"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## Mutelist"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
        "# Mutelist\n",
        "from prowler.providers.aws.lib.mutelist.mutelist import AWSMutelist\n",
        "\n",
        "\n",
        "mutelist_content = {\n",
        "    \"Accounts\": {\n",
        "        \"*\": {\n",
        "            \"Checks\": {\n",
        "                \"s3_account_level_public_access_blocks\": {\n",
        "                    \"Tags\": [\"*\"],\n",
        "                    \"Regions\": [\"*\"],\n",
        "                    \"Resources\": [\"*\"],\n",
        "                }\n",
        "            }\n",
        "        }\n",
        "    }\n",
        "}\n",
        "mutelist_object = AWSMutelist(\n",
        "    mutelist_content=mutelist_content,\n",
        ")\n",
        "aws._mutelist = mutelist_object"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## List Available Security Checks\n",
        "Explore different ways to list security checks by provider, service, severity, and category."
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
        "# Import the CheckMetadata class to list security checks\n",
        "from prowler.lib.check.models import CheckMetadata\n",
        "\n",
        "# List all available checks\n",
        "checks = CheckMetadata.list()\n",
        "print(f\"# Checks: {len(checks)}\")\n",
        "\n",
        "# List all AWS S3 checks\n",
        "aws_s3_checks = CheckMetadata.list(provider=\"aws\", service=\"s3\")\n",
        "print(f\"AWS S3 Checks:\\n\\t- {'\\n\\t- '.join(aws_s3_checks)}\")\n",
        "\n",
        "# List all critical severity checks\n",
        "critical_checks = CheckMetadata.list(provider=\"aws\", severity=\"critical\")\n",
        "print(f\"\\n# Critical Checks: {len(critical_checks)}\")\n",
        "\n",
        "# List all checks in the internet-exposed category\n",
        "internet_exposed_checks = CheckMetadata.list(provider=\"aws\", category=\"internet-exposed\")\n",
        "print(f\"\\n# Internet-Exposed Category Checks: {len(internet_exposed_checks)}\")"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## Execute Security Scans\n",
        "Set up and execute security scans on AWS resources with different filtering options."
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
        "# Import necessary libraries for scanning\n",
        "from prowler.lib.scan.scan import Scan\n",
        "# Auxiliary libraries\n",
        "import itertools\n",
        "\n",
        "# Set up the Scan class to scan all checks for the provider\n",
        "scan = Scan(provider=aws)\n",
        "\n",
        "# Parametrize the Scan to execute several checks, services, categories, compliances, etc.\n",
        "scan_s3 = Scan(provider=aws, services=[\"s3\"], severities=[\"critical\", \"high\"])\n",
        "# scan_critical = Scan(provider=aws, severities=[\"critical\"])\n",
        "# scan_internet_exposed = Scan(provider=aws, categories=[\"internet-exposed\"])\n",
        "\n",
        "# Start the scan with the `scan` method. This returns a generator with findings and progress.\n",
        "print(\"\\n##### Scanning AWS #####\")\n",
        "all_findings = []\n",
        "total_findings = 0\n",
        "for progress, findings in scan_s3.scan():\n",
        "    all_findings.extend(findings)\n",
        "    total_findings += len(findings)\n",
        "    print(f\"- Scan Progress: {progress}\\n- # Findings: {total_findings}\\n\")"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## Process and Display Findings\n",
        "Process the scan results and display detailed information about each finding."
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
        "print(\"Finding's Details:\")\n",
        "for finding in all_findings:\n",
        "    print(f\"\"\"\n",
        "    - Check ID: {finding.metadata.CheckID}\n",
        "    - Status: {str(finding.status)}\n",
        "    - Status Extended: {finding.status_extended}\n",
        "    - Resource ID: {finding.resource_uid}\n",
        "    - Resource Metadata: {finding.resource_metadata}\n",
        "    \"\"\")\n",
        "\n",
        "# Retrieve all findings in one line\n",
        "print(\"\\n##### Getting all findings in one line #####\")\n",
        "scan_s3 = Scan(provider=aws, services=[\"s3\"], severities=[\"critical\"])\n",
        "all_findings_one_line = list(itertools.chain.from_iterable(findings for _, findings in scan_s3.scan()))\n",
        "print(f\"Total findings collected in one line: {len(all_findings_one_line)}\")"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## Check Metatada\n",
        "```plain\n",
        "CheckMetadata(\n",
        "    Provider='aws'\n",
        "    CheckID='s3_bucket_policy_public_write_access'\n",
        "    CheckTitle='Check if S3 buckets have policies which allow WRITE access.'\n",
        "    CheckType=['IAM']\n",
        "    CheckAliases=[]\n",
        "    ServiceName='s3'\n",
        "    SubServiceName=''\n",
        "    ResourceIdTemplate='arn:partition:s3:::bucket_name'\n",
        "    Severity=<Severity.critical: 'critical'>\n",
        "    ResourceType='AwsS3Bucket'\n",
        "    Description='Check if S3 buckets have policies which allow WRITE access.'\n",
        "    Risk='Non intended users can put objects in a given bucket.'\n",
        "    RelatedUrl=''\n",
        "    Remediation=\n",
        "        Remediation(\n",
        "            Code=Code(\n",
        "                NativeIaC=''\n",
        "                Terraform=''\n",
        "                CLI=''\n",
        "                Other='https://docs.prowler.com/checks/aws/s3-policies/s3_18-write-permissions-public#aws-console')\n",
        "                Recommendation=Recommendation(Text='Ensure proper bucket policy is in place with the least privilege principle applied.'\n",
        "                Url='https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html'\n",
        "            )\n",
        "        )\n",
        "    Categories=['internet-exposed']\n",
        "    DependsOn=[]\n",
        "    RelatedTo=[]\n",
        "    Notes=''\n",
        "    # Compliance framework: A list of requirement IDs where the check is present.\n",
        "    Compliance={\n",
        "        \"CIS-1.10\": [\"5.2.13\"],\n",
        "        \"CIS-1.8\": [\"5.2.13\"]\n",
        "    }\n",
        ")\n",
        "```"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## Output Formats"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
        "# Import necessary libraries for output\n",
        "from prowler.lib.outputs.csv.csv import CSV\n",
        "from prowler.lib.outputs.ocsf.ocsf import OCSF\n",
        "from prowler.lib.outputs.asff.asff import ASFF  # Only for AWS\n",
        "from prowler.lib.outputs.html.html import HTML\n",
        "from prowler.lib.outputs.outputs import extract_findings_statistics\n",
        "import datetime\n",
        "\n",
        "# Get current date and time in YYYY-MM-DD_HH-MM-SS format for filenames\n",
        "current_datetime = datetime.datetime.now().strftime(\"%Y-%m-%d_%H-%M-%S\")\n",
        "\n",
        "# Write findings to CSV file\n",
        "print(\"Writing findings to CSV file...\")\n",
        "csv_filename = f\"./output/findings_{current_datetime}.csv\"\n",
        "csv = CSV(findings=all_findings, create_file_descriptor=True, file_path=csv_filename)\n",
        "csv.batch_write_data_to_file()\n",
        "print(f\"Done! CSV File Path: {csv._file_descriptor.name}\")\n",
        "\n",
        "# Write findings to OCSF file\n",
        "print(\"Writing findings to OCSF file...\")\n",
        "ocsf_filename = f\"./output/findings_{current_datetime}.ocsf\"\n",
        "ocsf = OCSF(findings=all_findings, create_file_descriptor=True, file_path=ocsf_filename)\n",
        "ocsf.batch_write_data_to_file()\n",
        "print(f\"Done! OCSF File Path: {ocsf._file_descriptor.name}\")\n",
        "\n",
        "# Write findings to ASFF file\n",
        "print(\"Writing findings to ASFF file...\")\n",
        "asff_filename = f\"./output/findings_{current_datetime}.asff\"\n",
        "asff = ASFF(findings=all_findings, create_file_descriptor=True, file_path=asff_filename)\n",
        "asff.batch_write_data_to_file()\n",
        "print(f\"Done! ASFF File Path: {asff._file_descriptor.name}\")\n",
        "\n",
        "# Write findings to HTML file\n",
        "print(\"Writing findings to HTML file...\")\n",
        "html_filename = f\"./output/findings_{current_datetime}.html\"\n",
        "stats = extract_findings_statistics(all_findings)\n",
        "html = HTML(findings=all_findings, create_file_descriptor=True, file_path=html_filename)\n",
        "html.batch_write_data_to_file(provider=aws, stats=stats)\n",
        "print(f\"Done! HTML File Path: {html._file_descriptor.name}\")\n",
        "\n",
        "# IMPORTANT: The create_file_descriptor parameter will be removed in 5.4.0\n",
        "# The file descriptor will be created by default when the Output class is instantiated"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## Integrate with AWS S3\n",
        "Send findings to AWS S3."
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
        "# Import the S3 class to send findings to AWS S3\n",
        "from prowler.providers.aws.lib.s3.s3 import S3\n",
        "\n",
        "print(\"\\n##### Sending findings to S3 bucket #####\")\n",
        "generated_outputs = {\"regular\": [csv, ocsf, asff, html], \"compliance\": []}\n",
        "s3_integration = S3(aws.session.current_session, bucket_name=\"sdk-core\", output_directory=\"output\")\n",
        "s3_integration.send_to_bucket(generated_outputs)\n",
        "\n",
        "# This upload the output files to the S3 bucket. In this case:\n",
        "# sdk-core/output/csv/findings_2025-02-26_16-25-30.csv\n",
        "# sdk-core/output/ocsf/findings_2025-02-26_16-25-30.ocsf\n",
        "# sdk-core/output/asff/findings_2025-02-26_16-25-30.asff"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## Integrate with AWS Security Hub\n",
        "Send findings to AWS Security Hub for centralized security monitoring."
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
        "# Import the SecurityHub class to send findings to AWS Security Hub\n",
        "from prowler.providers.aws.lib.security_hub.security_hub import SecurityHub\n",
        "\n",
        "# Print message indicating the start of the process\n",
        "print(\"\\n##### Sending findings to AWS Security Hub #####\")\n",
        "\n",
        "# Get available AWS regions for Security Hub.\n",
        "# Each finding can only be sent to Security Hub within its own region.\n",
        "# Additionally, it verifies that Prowler’s integration is active in\n",
        "# Security Hub before sending\n",
        "available_regions = aws.get_available_aws_service_regions(\n",
        "    \"securityhub\",\n",
        "    aws.identity.partition,\n",
        "    aws.identity.audited_regions,\n",
        ")\n",
        "\n",
        "# Initialize the SecurityHub class with necessary parameters\n",
        "security_hub = SecurityHub(\n",
        "    aws_account_id=aws.identity.account,\n",
        "    aws_partition=aws.identity.partition,\n",
        "    aws_session=aws.session.current_session,\n",
        "    findings=asff.data,\n",
        "    send_only_fails=False,\n",
        "    aws_security_hub_available_regions=available_regions,\n",
        ")\n",
        "\n",
        "# Send findings to AWS Security Hub\n",
        "findings_sent_to_security_hub = security_hub.batch_send_to_security_hub()\n",
        "\n",
        "# Print the number of findings sent to AWS Security Hub\n",
        "print(f\"{findings_sent_to_security_hub} findings sent to AWS Security Hub!\")"
      ]
    }
  ],
  "metadata": {
    "kernelspec": {
      "display_name": "prowler-HDV3a8VZ-py3.12",
      "language": "python",
      "name": "python3"
    },
    "language_info": {
      "codemirror_mode": {
        "name": "ipython",
        "version": 3
      },
      "file_extension": ".py",
      "mimetype": "text/x-python",
      "name": "python",
      "nbconvert_exporter": "python",
      "pygments_lexer": "ipython3",
      "version": "3.12.8"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 2
}
```

--------------------------------------------------------------------------------

---[FILE: job.yaml]---
Location: prowler-master/kubernetes/job.yaml

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: prowler
  namespace: prowler-ns
spec:
  template:
    metadata:
      labels:
        app: prowler
    spec:
      serviceAccountName: prowler-sa
      containers:
      - name: prowler
        image: toniblyx/prowler:stable
        args: ["kubernetes", "-z"]
        imagePullPolicy: Always
        volumeMounts:
            - name: var-lib-cni
              mountPath: /var/lib/cni
              readOnly: true
            - mountPath: /var/lib/etcd
              name: var-lib-etcd
              readOnly: true
            - mountPath: /var/lib/kubelet
              name: var-lib-kubelet
              readOnly: true
            - mountPath: /var/lib/kube-scheduler
              name: var-lib-kube-scheduler
              readOnly: true
            - mountPath: /var/lib/kube-controller-manager
              name: var-lib-kube-controller-manager
              readOnly: true
            - mountPath: /etc/systemd
              name: etc-systemd
              readOnly: true
            - mountPath: /lib/systemd/
              name: lib-systemd
              readOnly: true
            - mountPath: /srv/kubernetes/
              name: srv-kubernetes
              readOnly: true
            - mountPath: /etc/kubernetes
              name: etc-kubernetes
              readOnly: true
            - mountPath: /usr/local/mount-from-host/bin
              name: usr-bin
              readOnly: true
            - mountPath: /etc/cni/net.d/
              name: etc-cni-netd
              readOnly: true
            - mountPath: /opt/cni/bin/
              name: opt-cni-bin
              readOnly: true
      hostPID: true
      restartPolicy: Never
      volumes:
        - name: var-lib-cni
          hostPath:
            path: /var/lib/cni
        - hostPath:
            path: /var/lib/etcd
          name: var-lib-etcd
        - hostPath:
            path: /var/lib/kubelet
          name: var-lib-kubelet
        - hostPath:
            path: /var/lib/kube-scheduler
          name: var-lib-kube-scheduler
        - hostPath:
            path: /var/lib/kube-controller-manager
          name: var-lib-kube-controller-manager
        - hostPath:
            path: /etc/systemd
          name: etc-systemd
        - hostPath:
            path: /lib/systemd
          name: lib-systemd
        - hostPath:
            path: /srv/kubernetes
          name: srv-kubernetes
        - hostPath:
            path: /etc/kubernetes
          name: etc-kubernetes
        - hostPath:
            path: /usr/bin
          name: usr-bin
        - hostPath:
            path: /etc/cni/net.d/
          name: etc-cni-netd
        - hostPath:
            path: /opt/cni/bin/
          name: opt-cni-bin
```

--------------------------------------------------------------------------------

---[FILE: prowler-role.yaml]---
Location: prowler-master/kubernetes/prowler-role.yaml

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prowler-read-cluster
rules:
- apiGroups: [""]
  resources: ["pods", "configmaps", "nodes", "namespaces"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterrolebindings", "rolebindings", "clusterroles", "roles"]
  verbs: ["get", "list", "watch"]
```

--------------------------------------------------------------------------------

---[FILE: prowler-rolebinding.yaml]---
Location: prowler-master/kubernetes/prowler-rolebinding.yaml

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prowler-read-cluster-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prowler-read-cluster
subjects:
- kind: ServiceAccount
  name: prowler-sa
  namespace: prowler-ns
```

--------------------------------------------------------------------------------

---[FILE: prowler-sa.yaml]---
Location: prowler-master/kubernetes/prowler-sa.yaml

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: prowler-ns
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prowler-sa
  namespace: prowler-ns
```

--------------------------------------------------------------------------------

---[FILE: .dockerignore]---
Location: prowler-master/mcp_server/.dockerignore

```text
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

.pytest_cache/
.coverage
htmlcov/
.tox/
.nox/
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/

.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

.git/
.gitignore
.gitattributes
.github/
.vscode/
.idea/
*.swp
*.swo
*~

README.md
CHANGELOG.md
LICENSE
docs/
tests/
examples/
.pre-commit-config.yaml
Makefile
docker-compose.yml
docker-compose.yaml
```

--------------------------------------------------------------------------------

---[FILE: .env.template]---
Location: prowler-master/mcp_server/.env.template

```text
PROWLER_APP_API_KEY="pk_your_api_key_here"
API_BASE_URL="https://api.prowler.com/api/v1"
PROWLER_MCP_TRANSPORT_MODE="stdio"
```

--------------------------------------------------------------------------------

---[FILE: AGENTS.md]---
Location: prowler-master/mcp_server/AGENTS.md

```text
# Prowler MCP Server - AI Agent Ruleset

**Complete guide for AI agents and developers working on the Prowler MCP Server - the Model Context Protocol server that provides AI agents access to the Prowler ecosystem.**

## Project Overview

The Prowler MCP Server brings the entire Prowler ecosystem to AI assistants through
the Model Context Protocol (MCP). It enables seamless integration with AI tools
like Claude Desktop, Cursor, and other MCP hosts, allowing interaction with
Prowler's security capabilities through natural language.

---

## Critical Rules

### Tool Implementation

- **ALWAYS**: Extend `BaseTool` ABC for new Prowler App tools (auto-registration)
- **ALWAYS**: Use `@mcp.tool()` decorator for Hub/Docs tools (manual registration)
- **NEVER**: Manually register BaseTool subclasses (auto-discovered via `load_all_tools()`)
- **NEVER**: Import tools directly in server.py (tool_loader handles discovery)

### Models

- **ALWAYS**: Use `MinimalSerializerMixin` for LLM-optimized responses
- **ALWAYS**: Implement `from_api_response()` factory method for API transformations
- **ALWAYS**: Use two-tier models (Simplified for lists, Detailed for single items)
- **NEVER**: Return raw API responses (transform to simplified models)

### API Client

- **ALWAYS**: Use singleton `ProwlerAPIClient` via `self.api_client` in tools
- **ALWAYS**: Use `build_filter_params()` for query parameter normalization
- **NEVER**: Create new httpx clients in tools (use shared client)

---

## Architecture

### Three Sub-Servers Pattern

The main server (`server.py`) orchestrates three independent sub-servers with prefixed tool namespacing:

```python
# server.py imports sub-servers with prefixes
await prowler_mcp_server.import_server(hub_mcp_server, prefix="prowler_hub")
await prowler_mcp_server.import_server(app_mcp_server, prefix="prowler_app")
await prowler_mcp_server.import_server(docs_mcp_server, prefix="prowler_docs")
```

This pattern ensures:
- Failures in one sub-server do not block others
- Clear tool namespacing for LLM disambiguation
- Independent development and testing

### Tool Naming Convention

All tools follow a consistent naming pattern with prefixes:
- `prowler_hub_*` - Prowler Hub catalog and compliance tools
- `prowler_docs_*` - Prowler documentation search and retrieval
- `prowler_app_*` - Prowler Cloud and App (Self-Managed) management tools

### Tool Registration Patterns

**Pattern 1: Prowler Hub/Docs (Direct Decorators)**

```python
# prowler_hub/server.py or prowler_documentation/server.py
hub_mcp_server = FastMCP("prowler-hub")

@hub_mcp_server.tool()
async def get_checks(providers: str | None = None) -> dict:
    """Tool docstring becomes LLM description."""
    # Direct implementation
    response = prowler_hub_client.get("/check", params=params)
    return response.json()
```

**Pattern 2: Prowler App (BaseTool Auto-Registration)**

```python
# prowler_app/tools/findings.py
class FindingsTools(BaseTool):
    async def search_security_findings(
        self,
        severity: list[str] = Field(default=[], description="Filter by severity")
    ) -> dict:
        """Docstring becomes LLM description."""
        response = await self.api_client.get("/api/v1/findings")
        return SimplifiedFinding.from_api_response(response).model_dump()
```

NOTE: Only public methods of `BaseTool` subclasses are registered as tools.

---

## Tech Stack

- **Language**: Python 3.12+
- **MCP Framework**: FastMCP 2.13.1
- **HTTP Client**: httpx (async)
- **Validation**: Pydantic with MinimalSerializerMixin
- **Package Manager**: uv

---

## Project Structure

```
mcp_server/
├── README.md                              # User documentation
├── AGENTS.md                              # This file - AI agent guidelines
├── CHANGELOG.md                           # Version history
├── pyproject.toml                         # Project metadata and dependencies
├── Dockerfile                             # Container image definition
├── entrypoint.sh                          # Docker entrypoint script
└── prowler_mcp_server/
    ├── __init__.py                        # Version info
    ├── main.py                            # CLI entry point
    ├── server.py                          # Main FastMCP server orchestration
    ├── lib/
    │   └── logger.py                      # Structured logging
    ├── prowler_hub/
    │   └── server.py                      # Hub tools (10 tools, no auth)
    ├── prowler_app/
    │   ├── server.py                      # App server initialization
    │   ├── tools/
    │   │   ├── base.py                    # BaseTool abstract class
    │   │   ├── findings.py                # Findings tools
    │   │   ├── providers.py               # Provider tools
    │   │   ├── scans.py                   # Scan tools
    │   │   ├── resources.py               # Resource tools
    │   │   └── muting.py                  # Muting tools
    │   ├── models/
    │   │   ├── base.py                    # MinimalSerializerMixin
    │   │   ├── findings.py                # Finding models
    │   │   ├── providers.py               # Provider models
    │   │   ├── scans.py                   # Scan models
    │   │   ├── resources.py               # Resource models
    │   │   └── muting.py                  # Muting models
    │   └── utils/
    │       ├── api_client.py              # ProwlerAPIClient singleton
    │       ├── auth.py                    # ProwlerAppAuth (STDIO/HTTP)
    │       └── tool_loader.py             # Auto-discovery and registration
    └── prowler_documentation/
        ├── server.py                      # Documentation tools (2 tools, no auth)
        └── search_engine.py               # Mintlify API integration
```

---

## Commands

NOTE: To run a python command always use `uv run <command>` from within the `mcp_server/` directory.

### Development

```bash
# Navigate to MCP server directory
cd mcp_server

# Run in STDIO mode (default)
uv run prowler-mcp

# Run in HTTP mode
uv run prowler-mcp --transport http --host 0.0.0.0 --port 8000

# Run from anywhere using uvx
uvx /path/to/prowler/mcp_server/
```

---

## Development Patterns

### Adding New Tools to Prowler App

1. **Create or extend a tool class** in `prowler_app/tools/`:

```python
# prowler_app/tools/new_feature.py
from pydantic import Field
from prowler_mcp_server.prowler_app.tools.base import BaseTool
from prowler_mcp_server.prowler_app.models.new_feature import FeatureResponse

class NewFeatureTools(BaseTool):
    async def list_features(
        self,
        status: str | None = Field(default=None, description="Filter by status")
    ) -> dict:
        """List all features with optional filtering.

        Returns a simplified list of features optimized for LLM consumption.
        """
        params = {}
        if status:
            params["filter[status]"] = status

        clean_params = self.api_client.build_filter_params(params)
        response = await self.api_client.get("/api/v1/features", params=clean_params)

        return FeatureResponse.from_api_response(response).model_dump()
```

2. **Create corresponding models** in `prowler_app/models/`:

```python
# prowler_app/models/new_feature.py
from pydantic import Field
from prowler_mcp_server.prowler_app.models.base import MinimalSerializerMixin

class SimplifiedFeature(MinimalSerializerMixin):
    """Lightweight feature for list operations."""
    id: str
    name: str
    status: str

class DetailedFeature(SimplifiedFeature):
    """Extended feature with complete details."""
    description: str | None = None
    created_at: str
    updated_at: str

    @classmethod
    def from_api_response(cls, data: dict) -> "DetailedFeature":
        """Transform API response to model."""
        attributes = data.get("attributes", {})
        return cls(
            id=data["id"],
            name=attributes["name"],
            status=attributes["status"],
            description=attributes.get("description"),
            created_at=attributes["created_at"],
            updated_at=attributes["updated_at"],
        )
```

3. **No registration needed** - the tool loader auto-discovers BaseTool subclasses

### Adding Tools to Prowler Hub/Docs

Use the `@mcp.tool()` decorator directly:

```python
# prowler_hub/server.py
@hub_mcp_server.tool()
async def new_hub_tool(param: str) -> dict:
    """Tool description for LLM."""
    response = prowler_hub_client.get("/endpoint")
    return response.json()
```

---

## Code Quality Standards

### Tool Docstrings

Tool docstrings become AI agent descriptions. Write them in a clear, concise manner focusing on LLM-relevant behavior:

```python
async def search_security_findings(
    self,
    severity: list[str] = Field(default=[], description="Filter by severity levels")
) -> dict:
    """Search security findings with advanced filtering.

    Returns a lightweight list of findings optimized for LLM consumption.
    Use get_finding_details for complete information about a specific finding.
    """
```

### Model Design

- Use `MinimalSerializerMixin` to exclude None/empty values
- Implement `from_api_response()` for consistent API transformation
- Create two-tier models: Simplified (lists) and Detailed (single items)

### Error Handling

Return structured error responses rather than raising exceptions:

```python
try:
    response = await self.api_client.get(f"/api/v1/items/{item_id}")
    return DetailedItem.from_api_response(response["data"]).model_dump()
except Exception as e:
    self.logger.error(f"Failed to get item {item_id}: {e}")
    return {"error": str(e), "status": "failed"}
```

---

## QA Checklist Before Commit

- [ ] Tool docstrings are clear and describe LLM-relevant behavior
- [ ] Models use `MinimalSerializerMixin` for LLM optimization
- [ ] API responses are transformed to simplified models
- [ ] No hardcoded secrets or API keys
- [ ] Error handling returns structured responses
- [ ] New tools are auto-discovered (BaseTool subclass) or properly decorated
- [ ] Parameter descriptions use Pydantic `Field()` with clear descriptions

---

## References

- **Root Project Guide**: `../AGENTS.md`
- **FastMCP Documentation**: https://gofastmcp.com/llms.txt
- **Prowler API Documentation**: https://api.prowler.com/api/v1/docs
```

--------------------------------------------------------------------------------

---[FILE: CHANGELOG.md]---
Location: prowler-master/mcp_server/CHANGELOG.md

```text
# Prowler MCP Server Changelog

All notable changes to the **Prowler MCP Server** are documented in this file.

## [0.3.0] (UNRELEASED)

### Added

- Add new MCP Server tools for Prowler Compliance Framework Management [(#9568)](https://github.com/prowler-cloud/prowler/pull/9568)

### Changed

- Update API base URL environment variable to include complete path [(#9542)](https://github.com/prowler-cloud/prowler/pull/9542)
- Standardize Prowler Hub and Docs tools format for AI optimization [(#9578)](https://github.com/prowler-cloud/prowler/pull/9578)

## [0.2.0] (Prowler v5.15.0)

### Added

- Remove all Prowler App MCP tools; and add new MCP Server tools for Prowler Findings and Compliance [(#9300)](https://github.com/prowler-cloud/prowler/pull/9300)
- Add new MCP Server tools for Prowler Providers Management [(#9350)](https://github.com/prowler-cloud/prowler/pull/9350)
- Add new MCP Server tools for Prowler Resources Management [(#9380)](https://github.com/prowler-cloud/prowler/pull/9380)
- Add new MCP Server tools for Prowler Scans Management [(#9509)](https://github.com/prowler-cloud/prowler/pull/9509)
- Add new MCP Server tools for Prowler Muting Management [(#9510)](https://github.com/prowler-cloud/prowler/pull/9510)

---

## [0.1.1] (Prowler v5.14.0)

### Fixed

- Fix documentation MCP Server to return list of dictionaries [(#9205)](https://github.com/prowler-cloud/prowler/pull/9205)

---

## [0.1.0] (Prowler v5.13.0)

### Added

- Initial release of Prowler MCP Server [(#8695)](https://github.com/prowler-cloud/prowler/pull/8695)
- Set appropiate user-agent in requests [(#8724)](https://github.com/prowler-cloud/prowler/pull/8724)
- Basic logger functionality [(#8740)](https://github.com/prowler-cloud/prowler/pull/8740)
- Add new MCP Server for Prowler Cloud and Prowler App (Self-Managed) APIs [(#8744)](https://github.com/prowler-cloud/prowler/pull/8744)
- HTTP transport support [(#8784)](https://github.com/prowler-cloud/prowler/pull/8784)
- Add new MCP Server for Prowler Documentation [(#8795)](https://github.com/prowler-cloud/prowler/pull/8795)
- API key support for STDIO mode and enhanced HTTP mode authentication [(#8823)](https://github.com/prowler-cloud/prowler/pull/8823)
- Add health check endpoint [(#8905)](https://github.com/prowler-cloud/prowler/pull/8905)
- Update Prowler Documentation MCP Server to use Mintlify API [(#8916)](https://github.com/prowler-cloud/prowler/pull/8916)
- Add custom production deployment using uvicorn [(#8958)](https://github.com/prowler-cloud/prowler/pull/8958)
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: prowler-master/mcp_server/Dockerfile

```text
# =============================================================================
# Build stage - Install dependencies and build the application
# =============================================================================
FROM ghcr.io/astral-sh/uv:python3.13-alpine AS builder

WORKDIR /app

# Performance optimizations for uv:
# UV_COMPILE_BYTECODE=1: Pre-compile Python files to .pyc for faster startup
# UV_LINK_MODE=copy: Use copy instead of symlinks to avoid potential issues
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

# Install dependencies first for better Docker layer caching
# This allows dependency layer to be reused when only source code changes
COPY uv.lock pyproject.toml ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project

# Copy all source code and install the project
# --frozen ensures reproducible builds by using exact versions from uv.lock
COPY . .
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

# =============================================================================
# Final stage - Minimal runtime environment
# =============================================================================
FROM python:3.13-alpine

LABEL maintainer="https://github.com/prowler-cloud"

# Create non-root user for security
# Using specific UID/GID for consistency across environments
RUN addgroup -g 1001 prowler && \
    adduser -D -u 1001 -G prowler prowler

WORKDIR /app
USER prowler

# Copy only the necessary files from builder stage to minimize image size:
# 1. Virtual environment with all dependencies and the installed package
COPY --from=builder --chown=prowler /app/.venv /app/.venv

# 2. Source code needed at runtime (for imports and module resolution)
COPY --from=builder --chown=prowler /app/prowler_mcp_server /app/prowler_mcp_server

# 3. Project metadata file (may be needed by some packages at runtime)
COPY --from=builder --chown=prowler /app/pyproject.toml /app/pyproject.toml

# 4. Entrypoint helper script for selecting runtime mode
COPY --from=builder --chown=prowler /app/entrypoint.sh /app/entrypoint.sh

# Add virtual environment to PATH so prowler-mcp command is available
ENV PATH="/app/.venv/bin:$PATH"

# Entrypoint wrapper defaults to CLI mode; override with `uvicorn` to run ASGI app
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["main"]
```

--------------------------------------------------------------------------------

---[FILE: entrypoint.sh]---
Location: prowler-master/mcp_server/entrypoint.sh

```bash
#!/bin/sh
set -eu

usage() {
  cat <<'EOF'
Usage: ./entrypoint.sh [main|uvicorn] [args...]

Modes:
  main (default)      Run prowler-mcp
  uvicorn             Run uvicorn prowler_mcp_server.server:app

All additional arguments are forwarded to the selected command.
EOF
}

mode="main"

if [ "$#" -gt 0 ]; then
  case "$1" in
    main|cli)
      mode="main"
      shift
      ;;
    uvicorn|asgi)
      mode="uvicorn"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      mode="main"
      ;;
  esac
fi

case "$mode" in
  main)
    exec prowler-mcp "$@"
    ;;
  uvicorn)
    export PROWLER_MCP_TRANSPORT_MODE="http"
    exec uvicorn prowler_mcp_server.server:app "$@"
    ;;
  *)
    usage
    exit 1
    ;;
esac
```

--------------------------------------------------------------------------------

---[FILE: pyproject.toml]---
Location: prowler-master/mcp_server/pyproject.toml

```toml
[build-system]
build-backend = "setuptools.build_meta"
requires = ["setuptools>=61.0", "wheel"]

[project]
dependencies = [
  "fastmcp==2.13.1",
  "httpx>=0.28.0"
]
description = "MCP server for Prowler ecosystem"
name = "prowler-mcp"
readme = "README.md"
requires-python = ">=3.12"
version = "0.3.0"

[project.scripts]
generate-prowler-app-mcp-server = "prowler_mcp_server.prowler_app.utils.server_generator:generate_server_file"
prowler-mcp = "prowler_mcp_server.main:main"

[tool.uv]
package = true
```

--------------------------------------------------------------------------------

````
