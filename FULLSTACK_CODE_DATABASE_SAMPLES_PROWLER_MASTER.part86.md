---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 86
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 86 of 867)

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

---[FILE: prowler-mcp.mdx]---
Location: prowler-master/docs/getting-started/installation/prowler-mcp.mdx

```text
---
title: "Installation"
---

There are **two ways** to use Prowler MCP Server:

<CardGroup cols={2}>
  <Card title="Option 1: Managed by Prowler" icon="cloud" color="#10B981">
    **No installation required** - Just configuration

    Use `https://mcp.prowler.com/mcp`
  </Card>
  <Card title="Option 2: Run Locally" icon="server" color="#6366F1">
    **Local installation** - Full control

    Install via Docker, PyPI, or source code
  </Card>
</CardGroup>


For "Option 1: Managed by Prowler", go directly to the [Configuration Guide](/getting-started/basic-usage/prowler-mcp#hosted-server-configuration-recommended) to set up your Claude Desktop, Cursor, or other MCP client.
**This guide is focused on local installation, "Option 2: Run Locally"**.

## Installation Methods

Choose one of the following installation methods:

<Tabs>
  <Tab title="Docker (Recommended)">
    ### Pull from Docker Hub

    The easiest way to run locally is using the official Docker image:

    ```bash
    docker pull prowlercloud/prowler-mcp
    ```

    ### Run the Container

    ```bash
    # STDIO mode (for local MCP clients)
    docker run --rm -i prowlercloud/prowler-mcp

    # HTTP mode (for remote access)
    docker run --rm -p 8000:8000 \
      prowlercloud/prowler-mcp \
      --transport http --host 0.0.0.0 --port 8000
    ```

    ### With Environment Variables

    ```bash
    docker run --rm -i \
      -e PROWLER_APP_API_KEY="pk_your_api_key" \
      -e API_BASE_URL="https://api.prowler.com/api/v1" \
      prowlercloud/prowler-mcp
    ```

    <Info>
    **Docker Hub:** [prowlercloud/prowler-mcp](https://hub.docker.com/r/prowlercloud/prowler-mcp)
    </Info>

  </Tab>

  <Tab title="PyPI Package">
    ### Install via pip

    <Warning>
    **Coming Soon** - PyPI package will be available shortly
    </Warning>
  </Tab>

  <Tab title="From Source (Development)">
    ### Install uv

    If `uv` is not installed, install it first. Visit [uv documentation](https://docs.astral.sh/uv/) for more installation options.

    ### Clone the Repository

    ```bash
    git clone https://github.com/prowler-cloud/prowler.git
    cd prowler/mcp_server
    ```

    ### Install Dependencies

    The MCP server uses `uv` for dependency management. Install dependencies with:

    ```bash
    uv sync
    ```

    ### Verify Installation

    Test that the server is properly installed:

    ```bash
    uv run prowler-mcp --help
    ```

    The help message with available command-line options should appear.

    <Note>
    **For Development:** This method is recommended if you're developing or contributing to the MCP server.
    </Note>

  </Tab>

  <Tab title="Build Docker Image">
    ### Prerequisites

    Ensure Docker is installed on your system. Visit [Docker documentation](https://docs.docker.com/get-docker/) for more installation options.

    ### Clone the Repository

    ```bash
    git clone https://github.com/prowler-cloud/prowler.git
    cd prowler/mcp_server
    ```

    ### Build the Docker Image

    ```bash
    docker build -t prowler-mcp .
    ```

    This creates a Docker image named `prowler-mcp` with all necessary dependencies.

    ### Verify Installation

    Test that the Docker image was built successfully:

    ```bash
    docker run --rm prowler-mcp --help
    ```

    The help message with available command-line options should appear.

  </Tab>
</Tabs>

---

## Command Line Options

The Prowler MCP Server supports the following command-line arguments:

```bash
prowler-mcp [--transport {stdio,http}] [--host HOST] [--port PORT]
```

| Argument | Values | Default | Description |
|----------|--------|---------|-------------|
| `--transport` | `stdio`, `http` | `stdio` | Transport method for MCP communication |
| `--host` | Any valid hostname/IP | `127.0.0.1` | Host to bind to (HTTP mode only) |
| `--port` | Port number | `8000` | Port to bind to (HTTP mode only) |

### Examples

```bash
# Default STDIO mode for local MCP client integration
prowler-mcp

# Explicit STDIO mode
prowler-mcp --transport stdio

# HTTP mode on default host and port (127.0.0.1:8000)
prowler-mcp --transport http

# HTTP mode accessible from any network interface
prowler-mcp --transport http --host 0.0.0.0

# HTTP mode with custom port
prowler-mcp --transport http --host 0.0.0.0 --port 8080
```

## Environment Variables

Configure the server using environment variables:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PROWLER_APP_API_KEY` | Prowler API key | Only for STDIO mode | - |
| `API_BASE_URL` | Custom Prowler API endpoint | No | `https://api.prowler.com/api/v1` |
| `PROWLER_MCP_TRANSPORT_MODE` | Default transport mode (overwritten by `--transport` argument) | No | `stdio` |

<CodeGroup>
```bash macOS/Linux
export PROWLER_APP_API_KEY="pk_your_api_key_here"
export API_BASE_URL="https://api.prowler.com/api/v1"
export PROWLER_MCP_TRANSPORT_MODE="http"
```

```bash Windows PowerShell
$env:PROWLER_APP_API_KEY="pk_your_api_key_here"
$env:API_BASE_URL="https://api.prowler.com/api/v1"
$env:PROWLER_MCP_TRANSPORT_MODE="http"
```
</CodeGroup>

<Warning>
Never commit your API key to version control. Use environment variables or secure secret management solutions.
</Warning>

### Using Environment Files

For convenience, create a `.env` file in the `mcp_server` directory:

```bash .env
PROWLER_APP_API_KEY=pk_your_api_key_here
API_BASE_URL=https://api.prowler.com/api/v1
PROWLER_MCP_TRANSPORT_MODE=stdio
```

When using Docker, pass the environment file:

```bash
docker run --rm --env-file .env -it prowler-mcp
```

## Running from Any Location

Run the MCP server from anywhere using `uvx`:

```bash
uvx /path/to/prowler/mcp_server/
```

This is particularly useful when configuring MCP clients that need to launch the server from a specific path.

## Production Deployment

For production deployments that require customization, it is recommended to use the ASGI application that can be found in `prowler_mcp_server.server`. This can be run with uvicorn:

```bash
uvicorn prowler_mcp_server.server:app --host 0.0.0.0 --port 8000
```

For more details on production deployment options, see the [FastMCP production deployment guide](https://gofastmcp.com/deployment/http#production-deployment) and [uvicorn settings](https://www.uvicorn.org/settings/).

### Entrypoint Script

The source tree includes `entrypoint.sh` to simplify switching between the
standard CLI runner and the ASGI app. The first argument selects the mode and
any additional flags are passed straight through:

```bash
# Default CLI experience (prowler-mcp console script)
./entrypoint.sh main --transport http --host 0.0.0.0

# ASGI app via uvicorn
./entrypoint.sh uvicorn --host 0.0.0.0 --port 9000
```

Omitting the mode defaults to `main`, matching the `prowler-mcp` console script.
When `uvicorn` mode is selected, the script exports `PROWLER_MCP_TRANSPORT_MODE=http` automatically.

This is the default entrypoint for the Docker container.

## Next Steps

Now that you have the Prowler MCP Server installed, proceed to configure your MCP client:

<CardGroup cols={1}>
  <Card title="Configuration" icon="gear" href="/getting-started/basic-usage/prowler-mcp">
    Configure Claude Desktop, Cursor, or other MCP clients
  </Card>
</CardGroup>

## Getting Help

If you encounter issues during installation:

- Search for existing [GitHub issues](https://github.com/prowler-cloud/prowler/issues)
- Ask for help in our [Slack community](https://goto.prowler.com/slack)
- Report a new issue on [GitHub](https://github.com/prowler-cloud/prowler/issues/new)
```

--------------------------------------------------------------------------------

---[FILE: prowler-app.mdx]---
Location: prowler-master/docs/getting-started/products/prowler-app.mdx

```text
---
title: 'Overview'
---

Prowler App is a web application that simplifies running Prowler. It provides:

- **User-friendly interface** for configuring and executing scans
- Dashboard to **view results** and manage **security findings**

![Prowler App](/images/products/overview.png)

## Components

Prowler App consists of three main components:

- **Prowler UI**: User-friendly web interface for running Prowler and viewing results, powered by Next.js
- **Prowler API**: Backend API that executes Prowler scans and stores results, built with Django REST Framework
- **Prowler SDK**: Python SDK that integrates with Prowler CLI for advanced functionality

Supporting infrastructure includes:

- **PostgreSQL**: Persistent storage of scan results
- **Celery Workers**: Asynchronous execution of Prowler scans
- **Valkey**: In-memory database serving as message broker for Celery workers

![Prowler App Architecture](/images/products/prowler-app-architecture.png)
```

--------------------------------------------------------------------------------

---[FILE: prowler-cli.mdx]---
Location: prowler-master/docs/getting-started/products/prowler-cli.mdx

```text
---
title: 'Overview'
---

Prowler CLI is a command-line interface for running Prowler scans from the terminal.

```console
prowler <provider>
```
![Prowler CLI Execution](/images/short-display.png)

## Prowler Dashboard

```console
prowler dashboard
```
![Prowler Dashboard](/images/products/dashboard.png)

Prowler includes hundreds of security controls aligned with widely recognized industry frameworks and standards, including:

- CIS Benchmarks (AWS, Azure, Microsoft 365, Kubernetes, GitHub)
- NIST SP 800-53 (rev. 4 and 5) and NIST SP 800-171
- NIST Cybersecurity Framework (CSF)
- CISA Guidelines
- FedRAMP Low & Moderate
- PCI DSS v3.2.1 and v4.0
- ISO/IEC 27001:2013 and 2022
- SOC 2
- GDPR (General Data Protection Regulation)
- HIPAA (Health Insurance Portability and Accountability Act)
- FFIEC (Federal Financial Institutions Examination Council)
- ENS RD2022 (Spanish National Security Framework)
- GxP 21 CFR Part 11 and EU Annex 11
- RBI Cybersecurity Framework (Reserve Bank of India)
- KISA ISMS-P (Korean Information Security Management System)
- MITRE ATT&CK
- AWS Well-Architected Framework (Security & Reliability Pillars)
- AWS Foundational Technical Review (FTR)
- Microsoft NIS2 Directive (EU)
- Custom threat scoring frameworks (prowler_threatscore)
- Custom security frameworks for enterprise needs
```

--------------------------------------------------------------------------------

---[FILE: prowler-cloud-aws-marketplace.mdx]---
Location: prowler-master/docs/getting-started/products/prowler-cloud-aws-marketplace.mdx

```text
---
title: "AWS Marketplace"
---

This section contains the instructions to subscribe to **Prowler Cloud** through the **AWS Marketplace**.

## How to subscribe

To get to the **Prowler Cloud** product listing in the AWS Marketplace, and click the `View purchase options` button:

1. Use this link to be taken directly to the [Prowler Cloud Marketplace Listing](https://aws.amazon.com/marketplace/pp/prodview-6ochhig5kxpok):

    ![](/images/aws-marketplace/marketplace-listing.png)

2. Then, scroll down to the "Purchase Details" section and click the `Subscribe` button:

    ![](/images/aws-marketplace/marketplace-subscribe.png)

## Set up your account

After you have subscribed to the **Prowler Cloud** product, you will need to set up your **Prowler Cloud** account:

1. Click the `Set up  your account` button:

    ![](/images/aws-marketplace/marketplace-message.png)

2. You will be redirected to **Prowler Cloud Sign In** page. You can sign in with an exsiting account or sign up with a new account.:

    ![](/images/aws-marketplace/marketplace-sign-up.png)

3. Once you have successfully authenticated, you should be automatically redirected to the **Prowler Cloud** [Billing](https://cloud.prowler.com/billing) page where you should now see that your account has the `AWS Marketplace Subscription` badge.

    ![](/images/aws-marketplace/marketplace-my-account.png)

If you have any issues signing up, please contact us at support@prowler.com.


## Billing

You will be charged monthly based on resources scanned and monitored depending on usage in **Prowler Cloud**. For more information on billing, please see the [Prowler Cloud Pricing FAQ](https://prowler.com/pricing/).

**Note:** Your **Prowler Cloud** bills can be seen at [AWS Billing](https://us-east-1.console.aws.amazon.com/billing/home#/bills).

## Subscription

If you subscribe to Prowler Cloud through the AWS Marketplace it is not necessary to subscribe from different AWS accounts to use Prowler Cloud for those accounts.

In Prowler Cloud you only need to subscribe from one of your AWS accounts through the AWS Marketplace and add multiple provider accounts once you are in the Prowler Cloud console. We will send usage metrics to the AWS Marketplace regardless of the number of accounts you add in our platform, so the AWS Marketplace will bill you based on those usage metrics.

## Troubleshooting

### SEPA Payment Method Issues

If AWS Marketplace notifies that payment failed due to an issue with the payment method, this typically occurs when a SEPA bank account is set as the default payment method. AWS Marketplace does not support SEPA bank accounts for product subscriptions, even when the account includes valid alternative payment methods. This is because AWS Marketplace invoices are issued by AWS Inc., a US entity. SEPA accounts do not recognize these invoices as valid, causing subscription failures.

To successfully subscribe to AWS Marketplace products with a SEPA account configuration:

1. Switch default payment method to credit card
2. Complete subscription
3. Switch the default payment method back to the bank account

<Warning>
**Renewal Considerations**

This issue will recur during subscription renewals. AWS service teams recommend maintaining credit card as the default payment method to prevent future disruptions. Update payment methods at https://console.aws.amazon.com/billing/home#/paymentmethods.

</Warning>

<Note>
**AWS Marketplace Statement**

The AWS Marketplace team acknowledges this limitation: "We apologize for these additional steps, and please know we are fully aware of this situation, and our internal teams are working on simplifying this process."

</Note>

### Credit and Debit Card Storage Restrictions (AISPL Customers in India)

AWS Marketplace no longer supports payments using credit or debit cards stored on file for Amazon Internet Services Private Limited (AISPL) customers. This restriction stems from Reserve Bank of India (RBI) regulations regarding payment aggregators, which prohibit the storage of card data. As explained in [this AWS blog post](https://aws.amazon.com/blogs/awsmarketplace/restriction-on-credit-and-debit-card-purchases-for-aispl-customers-using-aws-marketplace/):

> AWS Marketplace can no longer support payments using credit or debit cards stored on file. [The Reserve Bank of India (RBI) has issued a notice regarding regulation of payment aggregators](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11822&Mode=0), which restricts the storage of card data. If you are currently using credit or debit card as your default payment instrument, your ability to use AWS Marketplace products will be restricted. However, you can switch your default payment instrument to Pay By Invoice to avoid disruption or restore your original experience.

To maintain uninterrupted access to AWS Marketplace products, change the default payment instrument from stored card data to Pay By Invoice billing.
```

--------------------------------------------------------------------------------

---[FILE: prowler-cloud-pricing.mdx]---
Location: prowler-master/docs/getting-started/products/prowler-cloud-pricing.mdx

```text
---
title: "Pricing"
url: "https://prowler.com/pricing"
---
```

--------------------------------------------------------------------------------

---[FILE: prowler-cloud.mdx]---
Location: prowler-master/docs/getting-started/products/prowler-cloud.mdx

```text
---
title: "Overview"
---

[Prowler Cloud](https://prowler.com) makes Cloud Security easy and enables your team to build trust in their deployed services and applications.

Prowler Cloud Automates scanning single or multiple accounts and has all of the benefits of Prowler Open Source, plus hands-off continuous monitoring, auto-scaling workers for faster execution, integrations, personalized support options and out of the box social authentication.

![](/images/products/overview.png)

<Card title="Create your account here to see Prowler Cloud in action" href="https://cloud.prowler.com/sign-up" />

With 100% consistency across our open source policies and APIs. Prowler Cloud provides the following added benefits:

<ul>
    <li> Immediate sign-up and account provisioning, including a trial period with zero billing details needed at registration. </li>
    <li> Simple, transparent pricing, with cloud account sizing and exact pricing being available to view in your account settings. </li>
    <li> SOC2 Security processes around the deployment, management, data protection and security updates of your prowler environment. </li>
    <li> Helpers for smooth onboarding of cloud environments (Eg. Automatic account ID and ExternalID for AWS assumed roles, Known Static IP for Kubernetes access). </li>
    <li> Zero touch third party notifications to Slack, Jira, and more. </li>
</ul>

The team who built [Prowler](https://github.com/prowler-cloud/prowler), has helped thousands of companies get Cloud Security under control, is now making it easier by taking
[Prowler](https://github.com/prowler-cloud/prowler) to the [Cloud](https://prowler.com)!
```

--------------------------------------------------------------------------------

---[FILE: prowler-hub.mdx]---
Location: prowler-master/docs/getting-started/products/prowler-hub.mdx

```text
---
title: "Overview"
---

**Prowler Hub** is our growing public library of versioned checks, cloud service artifacts, and compliance frameworks with its mappings. It’s searchable, explainable, and built to serve the community.

**Why this matters**: Every engineer has asked, “What does this check actually do?” Prowler Hub answers that question in one place, lets you pin to a specific version, and pulls definitions into your own tools or dashboards.

![](/images/products/prowler-hub.png)

<Card title="Go to Prowler Hub" href="https://hub.prowler.com" />

Prowler Hub also provides a fully documented public API that you can integrate into your internal tools, dashboards, or automation workflows.

📚 Explore the API docs at: https://hub.prowler.com/api/docs

Whether you’re customizing policies, managing compliance, or enhancing visibility, Prowler Hub is built to support your security operations.
```

--------------------------------------------------------------------------------

---[FILE: prowler-lighthouse-ai.mdx]---
Location: prowler-master/docs/getting-started/products/prowler-lighthouse-ai.mdx

```text
---
title: 'Overview'
---

import { VersionBadge } from "/snippets/version-badge.mdx"

<VersionBadge version="5.8.0" />

Prowler Lighthouse AI is a Cloud Security Analyst chatbot that helps you understand, prioritize, and remediate security findings in your cloud environments. It's designed to provide security expertise for teams without dedicated resources, acting as your 24/7 virtual cloud security analyst.

<img src="/images/prowler-app/lighthouse-intro.png" alt="Prowler Lighthouse" />

<Card title="Set Up Lighthouse AI" icon="rocket" href="/user-guide/tutorials/prowler-app-lighthouse#set-up">
  Learn how to configure Lighthouse AI with your preferred LLM provider
</Card>

## Capabilities

Prowler Lighthouse AI is designed to be your AI security team member, with capabilities including:

### Natural Language Querying

Ask questions in plain English about your security findings. Examples:

- "What are my highest risk findings?"
- "Show me all S3 buckets with public access."
- "What security issues were found in my production accounts?"

<img src="/images/prowler-app/lighthouse-feature1.png" alt="Natural language querying" />

### Detailed Remediation Guidance

Get tailored step-by-step instructions for fixing security issues:

- Clear explanations of the problem and its impact
- Commands or console steps to implement fixes
- Alternative approaches with different solutions

<img src="/images/prowler-app/lighthouse-feature2.png" alt="Detailed Remediation" />

### Enhanced Context and Analysis

Lighthouse AI can provide additional context to help you understand the findings:

- Explain security concepts related to findings in simple terms
- Provide risk assessments based on your environment and context
- Connect related findings to show broader security patterns

<img src="/images/prowler-app/lighthouse-config.png" alt="Business Context" />

<img src="/images/prowler-app/lighthouse-feature3.png" alt="Contextual Responses" />

## Important Notes

Prowler Lighthouse AI is powerful, but there are limitations:

- **Continuous improvement**: Please report any issues, as the feature may make mistakes or encounter errors, despite extensive testing.
- **Access limitations**: Lighthouse AI can only access data the logged-in user can view. If you can't see certain information, Lighthouse AI can't see it either.
- **NextJS session dependence**: If your Prowler application session expires or logs out, Lighthouse AI will error out. Refresh and log back in to continue.
- **Response quality**: The response quality depends on the selected LLM provider and model. Choose models with strong tool-calling capabilities for best results. We recommend `gpt-5` model from OpenAI.

### Getting Help

If you encounter issues with Prowler Lighthouse AI or have suggestions for improvements, please [reach out through our Slack channel](https://goto.prowler.com/slack).

### What Data Is Shared to LLM Providers?

The following API endpoints are accessible to Prowler Lighthouse AI. Data from the following API endpoints could be shared with LLM provider depending on the scope of user's query:

#### Accessible API Endpoints

**User Management:**

- List all users - `/api/v1/users`
- Retrieve the current user's information - `/api/v1/users/me`

**Provider Management:**

- List all providers - `/api/v1/providers`
- Retrieve data from a provider - `/api/v1/providers/{id}`

**Scan Management:**

- List all scans - `/api/v1/scans`
- Retrieve data from a specific scan - `/api/v1/scans/{id}`

**Resource Management:**

- List all resources - `/api/v1/resources`
- Retrieve data for a resource - `/api/v1/resources/{id}`

**Findings Management:**

- List all findings - `/api/v1/findings`
- Retrieve data from a specific finding - `/api/v1/findings/{id}`
- Retrieve metadata values from findings - `/api/v1/findings/metadata`

**Overview Data:**

- Get aggregated findings data - `/api/v1/overviews/findings`
- Get findings data by severity - `/api/v1/overviews/findings_severity`
- Get aggregated provider data - `/api/v1/overviews/providers`
- Get findings data by service - `/api/v1/overviews/services`

**Compliance Management:**

- List compliance overviews (optionally filter by scan) - `/api/v1/compliance-overviews`
- Retrieve data from a specific compliance overview - `/api/v1/compliance-overviews/{id}`

#### Excluded API Endpoints

Not all Prowler API endpoints are integrated with Lighthouse AI. They are intentionally excluded for the following reasons:

- OpenAI/other LLM providers shouldn't have access to sensitive data (like fetching provider secrets and other sensitive config)
- Users queries don't need responses from those API endpoints (ex: tasks, tenant details, downloading zip file, etc.)

**Excluded Endpoints:**

**User Management:**

- List specific users information - `/api/v1/users/{id}`
- List user memberships - `/api/v1/users/{user_pk}/memberships`
- Retrieve membership data from the user - `/api/v1/users/{user_pk}/memberships/{id}`

**Tenant Management:**

- List all tenants - `/api/v1/tenants`
- Retrieve data from a tenant - `/api/v1/tenants/{id}`
- List tenant memberships - `/api/v1/tenants/{tenant_pk}/memberships`
- List all invitations - `/api/v1/tenants/invitations`
- Retrieve data from tenant invitation - `/api/v1/tenants/invitations/{id}`

**Security and Configuration:**

- List all secrets - `/api/v1/providers/secrets`
- Retrieve data from a secret - `/api/v1/providers/secrets/{id}`
- List all provider groups - `/api/v1/provider-groups`
- Retrieve data from a provider group - `/api/v1/provider-groups/{id}`

**Reports and Tasks:**

- Download zip report - `/api/v1/scans/{v1}/report`
- List all tasks - `/api/v1/tasks`
- Retrieve data from a specific task - `/api/v1/tasks/{id}`

**Lighthouse AI Configuration:**

- List LLM providers - `/api/v1/lighthouse/providers`
- Retrieve LLM provider - `/api/v1/lighthouse/providers/{id}`
- List available models - `/api/v1/lighthouse/models`
- Retrieve tenant configuration - `/api/v1/lighthouse/configuration`

<Note>
Agents only have access to hit GET endpoints. They don't have access to other HTTP methods.

</Note>

## FAQs

**1. Which LLM providers are supported?**

Lighthouse AI supports three providers:

- **OpenAI** - GPT models (GPT-5, GPT-4o, etc.)
- **Amazon Bedrock** - Claude, Llama, Titan, and other models via AWS
- **OpenAI Compatible** - Custom endpoints like OpenRouter, Ollama, or any OpenAI-compatible service

For detailed configuration instructions, see [Using Multiple LLM Providers with Lighthouse](/user-guide/tutorials/prowler-app-lighthouse-multi-llm).

**2. Why a multi-agent supervisor model?**

Context windows are limited. While demo data fits inside the context window, querying real-world data often exceeds it. A multi-agent architecture is used so different agents fetch different sizes of data and respond with the minimum required data to the supervisor. This spreads the context window usage across agents.

**3. Is my security data shared with LLM providers?**

Minimal data is shared to generate useful responses. Agents can access security findings and remediation details when needed. Provider secrets are protected by design and cannot be read. The LLM provider credentials configured with Lighthouse AI are only accessible to our NextJS server and are never sent to the LLM providers. Resource metadata (names, tags, account/project IDs, etc) may be shared with the configured LLM provider based on query requirements.

**4. Can the Lighthouse AI change my cloud environment?**

No. The agent doesn't have the tools to make the changes, even if the configured cloud provider API keys contain permissions to modify resources.
```

--------------------------------------------------------------------------------

---[FILE: prowler-mcp.mdx]---
Location: prowler-master/docs/getting-started/products/prowler-mcp.mdx

```text
---
title: "Overview"
---

**Prowler MCP Server** brings the entire Prowler ecosystem to AI assistants through the Model Context Protocol (MCP). It enables seamless integration with AI tools like Claude Desktop, Cursor, and other MCP clients, allowing interaction with Prowler's security capabilities through natural language.

<Warning>
**Preview Feature**: This MCP server is currently under active development. Features and functionality may change. We welcome your feedback—please report any issues on [GitHub](https://github.com/prowler-cloud/prowler/issues) or join our [Slack community](https://goto.prowler.com/slack) to discuss and share your thoughts.
</Warning>

## What is the Model Context Protocol?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open standard developed by Anthropic that enables AI assistants to securely connect to external data sources and tools. It functions as a universal adapter enabling AI assistants to interact with various services through a standardized interface.

## Key Capabilities

The Prowler MCP Server provides three main integration points:

### 1. Prowler Cloud and Prowler App (Self-Managed)

Full access to Prowler Cloud platform and self-managed Prowler App for:
- **Findings Analysis**: Query, filter, and analyze security findings across all your cloud environments
- **Provider Management**: Create, configure, and manage your configured Prowler providers (AWS, Azure, GCP, etc.)
- **Scan Orchestration**: Trigger on-demand scans and schedule recurring security assessments
- **Resource Inventory**: Search and view detailed information about your audited resources
- **Muting Management**: Create and manage muting lists/rules to suppress non-relevant findings

### 2. Prowler Hub

Access to Prowler's comprehensive security knowledge base:
- **Security Checks Catalog**: Browse and search **over 1000 security checks** across multiple cloud providers.
- **Check Implementation**: View the Python code that powers each security check.
- **Automated Fixers**: Access remediation scripts for common security issues.
- **Compliance Frameworks**: Explore mappings to **over 70 compliance standards and frameworks**.
- **Provider Services**: View available services and checks for each cloud provider.

### 3. Prowler Documentation

Search and retrieve official Prowler documentation:
- **Intelligent Search**: Full-text search across all Prowler documentation.
- **Contextual Results**: Get relevant documentation pages with highlighted snippets.
- **Document Retrieval**: Access complete markdown content of any documentation file.

## MCP Server Architecture

The following diagram illustrates the Prowler MCP Server architecture and its integration points:

<img className="block dark:hidden" src="/images/prowler_mcp_schema_light.png" alt="Prowler MCP Server Schema" />
<img className="hidden dark:block" src="/images/prowler_mcp_schema_dark.png" alt="Prowler MCP Server Schema" />

The architecture shows how AI assistants connect through the MCP protocol to access Prowler's three main components:
- Prowler Cloud/App for security operations
- Prowler Hub for security knowledge
- Prowler Documentation for guidance and reference.

## Use Cases

The Prowler MCP Server enables powerful workflows through AI assistants:

**Security Operations**
- "Show me all critical findings from my AWS production accounts"
- "Register my new AWS account in Prowler and run a scheduled scan every day"
- "List all muted findings and detect what findgings are muted by a not enough good reason in relation to their severity"

**Security Research**
- "Explain what the S3 bucket public access Prowler check does"
- "Find all Prowler checks related to encryption at rest"
- "What is the latest version of the CIS that Prowler is covering per provider?"

**Documentation & Learning**
- "How do I configure Prowler to scan my GCP organization?"
- "What authentication methods does Prowler support for Azure?"
- "How can I contribute with a new security check to Prowler?"

### Example: Creating a custom dashboard with Prowler extracted data

In the next example you can see how to create a dashboard using Prowler MCP Server and Claude Desktop.

**Used Prompt:**
```
Generate me a security dashboard for the Prowler open source project using live data from Prowler MCP tools.

REQUIREMENTS:
1. Fetch real-time data from Prowler Findings using MCP tools
2. Create a single self-contained HTML file and display it
3. Dashboard must be production-ready with modern design

DATA TO FETCH:
Use these MCP tools in this order:
1. Prowler app list providers - To get all available configured provider in the account
2. Prowler app get latest findings - To get findings information, if there are so many you can use the filter_fields to get less information, or pagination to get in different batches
3. For most critical findings you can get more context and remediation with Prowler Hub to get remediations for example

DESIGN REQUIREMENTS:
- Dark theme (gradient background: #0a0e27 to #131830)
- Card-based layout with glassmorphism effects
- Color scheme:
 * Primary green
 * Secondary purple
- Modern, professional look
- Animated "LIVE DATA" indicator (pulsing green badge)
- Hover effects on all cards (lift, glow, border color change)
- Responsive grid layout
- Mobile-responsive breakpoints at 768px
- Single HTML file with all CSS and JavaScript embedded
- No external dependencies

SPECIFIC DETAILS TO INCLUDE:
- Show actual counts from the data (don't hardcode numbers)
- Add timestamp showing when dashboard was generated
- Link to GitHub repository: https://github.com/prowler-cloud/prowler

OUTPUT:
Generate the complete HTML file and display it
```

**Video:**
<iframe
  className="w-full aspect-video rounded-xl"
  src="https://www.youtube.com/embed/li29KNmYd4g?si=P3m6eB2z0Cqqse_H"
  title="Prowler MCP Server - Creating a dashboard"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>


## Deployment Options

Prowler MCP Server can be used in three ways:

### 1. Prowler Cloud MCP Server

**Use Prowler's managed MCP server at `https://mcp.prowler.com/mcp`**

- No installation required.
- Managed and maintained by Prowler team.
- Authentication to Prowler Cloud or Prowler App (self-managed) via API key or JWT token.

### 2. Local STDIO Mode

**Run the server locally on your machine**

- Runs as a subprocess of your MCP client.
- Possibility to connect to a self-hosted Prowler App (e.g. self-hosted Prowler App).
- Authentication to Prowler Cloud or Prowler App (self-managed) via environment variables.
- Requires Python 3.12+ or Docker.

### 3. Self-Hosted HTTP Mode

**Deploy your own remote MCP server**

- Full control over deployment.
- Possibility to connect to a self-hosted Prowler App (e.g. self-hosted Prowler App).
- Authentication to Prowler App (self-managed) via API key or JWT token.
- Requires Python 3.12+ or Docker.

## Requirements

Requirements vary based on deployment option:

**For Prowler Cloud MCP Server:**
- Prowler Cloud account and API key (only for Prowler Cloud/App features)

**For self-hosted STDIO/HTTP Mode:**
- Python 3.12+ or Docker
- Network access to:
  - `https://hub.prowler.com` (for Prowler Hub)
  - `https://docs.prowler.com` (for Prowler Documentation)
  - Prowler Cloud API or self-hosted Prowler App API (for Prowler Cloud/App features)

<Note>
**No Authentication Required**: Prowler Hub and Prowler Documentation features work without authentication in both deployment options. A Prowler API key is only required to access Prowler Cloud or Prowler App (Self-Managed) features.
</Note>

## Next Steps

<CardGroup cols={2}>
  <Card title="Installation" icon="download" href="/getting-started/installation/prowler-mcp">
    Install the Prowler MCP Server using uv or Docker
  </Card>
  <Card title="Configuration" icon="gear" href="/getting-started/basic-usage/prowler-mcp">
    Configure your MCP client to connect to the server
  </Card>
</CardGroup>

<Card title="Tools Reference" icon="wrench" href="/getting-started/basic-usage/prowler-mcp-tools" horizontal>
  Explore all available tools and capabilities
</Card>
```

--------------------------------------------------------------------------------

---[FILE: version-badge.mdx]---
Location: prowler-master/docs/snippets/version-badge.mdx

```text
export const VersionBadge = ({ version }) => {
    return (
        <code className="version-badge-container">
            <p className="version-badge">
                <span className="version-badge-label">Added in:</span>&nbsp;
                <code className="version-badge-version">{version}</code>
            </p>
        </code>


    );
};
```

--------------------------------------------------------------------------------

---[FILE: check-aliases.mdx]---
Location: prowler-master/docs/user-guide/cli/tutorials/check-aliases.mdx

```text
---
title: "Check Aliases"
---

Prowler allows you to use aliases for the checks. You only have to add the `CheckAliases` key to the check's metadata with a list of the aliases:

```json title="check.metadata.json"
"Provider": "<provider>",
"CheckID": "<check_id>",
"CheckTitle": "<check_title>",
"CheckAliases": [
  "<check_alias_1>"
  "<check_alias_2>",
  ...
],
...
```

Then you can execute the check either with its check ID or with one of the previous aliases:

```shell
prowler <provider> -c/--checks <check_alias_1>

Using alias <check_alias_1> for check <check_id>...
```
```

--------------------------------------------------------------------------------

---[FILE: compliance.mdx]---
Location: prowler-master/docs/user-guide/cli/tutorials/compliance.mdx

```text
---
title: 'Compliance'
---

Prowler allows you to execute checks based on requirements defined in compliance frameworks. By default, it will execute and give you an overview of the status of each compliance framework:

<img src="/images/cli/compliance/compliance.png" />

You can find CSVs containing detailed compliance results in the compliance folder within Prowler's output folder.

## Execute Prowler based on Compliance Frameworks

Prowler can analyze your environment based on a specific compliance framework and get more details, to do it, you can use option `--compliance`:

```sh
prowler <provider> --compliance <compliance_framework>
```

Standard results will be shown and additionally the framework information as the sample below for CIS AWS 2.0. For details a CSV file has been generated as well.

<img src="/images/cli/compliance/compliance-cis-sample1.png" />

<Note>
**If Prowler can't find a resource related with a check from a compliance requirement, this requirement won't appear on the output**
</Note>

## List Available Compliance Frameworks

To see which compliance frameworks are covered by Prowler, use the `--list-compliance` option:

```sh
prowler <provider> --list-compliance
```

Or you can visit [Prowler Hub](https://hub.prowler.com/compliance).

## List Requirements of Compliance Frameworks
To list requirements for a compliance framework, use the `--list-compliance-requirements` option:

```sh
prowler <provider> --list-compliance-requirements <compliance_framework(s)>
```

Example for the first requirements of CIS 1.5 for AWS:

```
Listing CIS 1.5 AWS Compliance Requirements:

Requirement Id: 1.1
	- Description: Maintain current contact details
	- Checks:
 		account_maintain_current_contact_details

Requirement Id: 1.2
	- Description: Ensure security contact information is registered
	- Checks:
 		account_security_contact_information_is_registered

Requirement Id: 1.3
	- Description: Ensure security questions are registered in the AWS account
	- Checks:
 		account_security_questions_are_registered_in_the_aws_account

Requirement Id: 1.4
	- Description: Ensure no 'root' user account access key exists
	- Checks:
 		iam_no_root_access_key

Requirement Id: 1.5
	- Description: Ensure MFA is enabled for the 'root' user account
	- Checks:
 		iam_root_mfa_enabled

[redacted]

```

## Create and contribute adding other Security Frameworks

This information is part of the Developer Guide and can be found [here](/developer-guide/security-compliance-framework).
```

--------------------------------------------------------------------------------

````
