---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 84
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 84 of 867)

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

---[FILE: prowler-app.mdx]---
Location: prowler-master/docs/getting-started/basic-usage/prowler-app.mdx

```text
---
title: 'Basic Usage'
---

## Access Prowler App

After [installation](/getting-started/installation/prowler-app), navigate to [http://localhost:3000](http://localhost:3000) and sign up with email and password.

<img src="/images/sign-up-button.png" alt="Sign Up Button" width="320" />
<img src="/images/sign-up.png" alt="Sign Up" width="285" />

<Note>
**User creation and default tenant behavior**


When creating a new user, the behavior depends on whether an invitation is provided:

- **Without an invitation**:

    - A new tenant is automatically created.
    - The new user is assigned to this tenant.
    - A set of **RBAC admin permissions** is generated and assigned to the user for the newly-created tenant.

- **With an invitation**: The user is added to the specified tenant with the permissions defined in the invitation.

This mechanism ensures that the first user in a newly created tenant has administrative permissions within that tenant.

</Note>
## Log In

Access Prowler App by logging in with **email and password**.

<img src="/images/log-in.png" alt="Log In" width="285" />

## Add Cloud Provider

Configure a cloud provider for scanning:

1. Navigate to `Settings > Cloud Providers` and click `Add Account`.
2. Select the cloud provider.
3. Enter the provider's identifier (Optional: Add an alias):
    - **AWS**: Account ID
    - **GCP**: Project ID
    - **Azure**: Subscription ID
    - **Kubernetes**: Cluster ID
    - **M365**: Domain ID
4. Follow the guided instructions to add and authenticate your credentials.

## Start a Scan

Once credentials are successfully added and validated, Prowler initiates a scan of your cloud environment.

Click `Go to Scans` to monitor progress.

## View Results

Review findings during scan execution in the following sections:

- **Overview** – Provides a high-level summary of your scans.
  <img src="/images/products/overview.png" alt="Overview" width="700" />

- **Compliance** – Displays compliance insights based on security frameworks.
  <img src="/images/compliance.png" alt="Compliance" width="700" />

> For detailed usage instructions, refer to the [Prowler App Guide](/user-guide/tutorials/prowler-app).

<Note>
Prowler will automatically scan all configured providers every **24 hours**, ensuring your cloud environment stays continuously monitored.

</Note>
```

--------------------------------------------------------------------------------

---[FILE: prowler-cli.mdx]---
Location: prowler-master/docs/getting-started/basic-usage/prowler-cli.mdx

```text
---
title: 'Basic Usage'
---

## Running Prowler

Running Prowler requires specifying the provider (e.g `aws`, `gcp`, `azure`, `kubernetes`, `m365`, `github`, `iac` or `mongodbatlas`):

<Note>
If no provider is specified, AWS is used by default for backward compatibility with Prowler v2.

</Note>
```console
prowler <provider>
```
![Prowler Execution](/images/short-display.png)

<Note>
Running the `prowler` command without options will uses environment variable credentials. Refer to the Authentication section of each provider for credential configuration details.

</Note>
## Verbose Output

If you prefer the former verbose output, use: `--verbose`. This allows seeing more info while Prowler is running, minimal output is displayed unless verbosity is enabled.

## Report Generation

By default, Prowler generates CSV, JSON-OCSF, and HTML reports. To generate a JSON-ASFF report (used by AWS Security Hub), specify `-M` or `--output-modes`:

```console
prowler <provider> -M csv json-asff json-ocsf html
```
The HTML report is saved in the output directory, alongside other reports. It will look like this:

![Prowler Execution](/images/html-output.png)

## Listing Available Checks and Services

List all available checks or services within a provider using `-l`/`--list-checks` or `--list-services`.

```console
prowler <provider> --list-checks
prowler <provider> --list-services
```
## Running Specific Checks or Services

Execute specific checks or services using `-c`/`checks` or `-s`/`services`:

```console
prowler azure --checks storage_blob_public_access_level_is_disabled
prowler aws --services s3 ec2
prowler gcp --services iam compute
prowler kubernetes --services etcd apiserver
```
## Excluding Checks and Services

Checks and services can be excluded with `-e`/`--excluded-checks` or `--excluded-services`:

```console
prowler aws --excluded-checks s3_bucket_public_access
prowler azure --excluded-services defender iam
prowler gcp --excluded-services kms
prowler kubernetes --excluded-services controllermanager
```
## Additional Options

Explore more advanced time-saving execution methods in the [Miscellaneous](/user-guide/cli/tutorials/misc) section.

Access the help menu and view all available options with `-h`/`--help`:

```console
prowler --help
```

## AWS

Use a custom AWS profile with `-p`/`--profile` and/or specific AWS regions with `-f`/`--filter-region`:

```console
prowler aws --profile custom-profile -f us-east-1 eu-south-2
```

<Note>
By default, `prowler` will scan all AWS regions.

</Note>
See more details about AWS Authentication in the [Authentication Section](/user-guide/providers/aws/authentication) section.

## Azure

Azure requires specifying the auth method:

```console
# To use service principal authentication
prowler azure --sp-env-auth

# To use az cli authentication
prowler azure --az-cli-auth

# To use browser authentication
prowler azure --browser-auth --tenant-id "XXXXXXXX"

# To use managed identity auth
prowler azure --managed-identity-auth
```

See more details about Azure Authentication in the [Authentication Section](/user-guide/providers/azure/authentication)

By default, Prowler scans all accessible subscriptions. Scan specific subscriptions using the following flag (using az cli auth as example):

```console
prowler azure --az-cli-auth --subscription-ids <subscription ID 1> <subscription ID 2> ... <subscription ID N>
```
## Google Cloud

- **User Account Credentials**

    By default, Prowler uses **User Account credentials**. Configure accounts using:

    - `gcloud init` – Set up a new account.
    - `gcloud config set account <account>` – Switch to an existing account.

    Once configured, obtain access credentials using: `gcloud auth application-default login`.

- **Service Account Authentication**

    Alternatively, you can use Service Account credentials:

    Generate and download Service Account keys in JSON format. Refer to [Google IAM documentation](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) for details.

    Provide the key file location using this argument:

    ```console
    prowler gcp --credentials-file path
    ```

- **Scanning Specific GCP Projects**

    By default, Prowler scans all accessible GCP projects. Scan specific projects with the `--project-ids` flag:

    ```console
    prowler gcp --project-ids <Project ID 1> <Project ID 2> ... <Project ID N>
    ```

- **GCP Retry Configuration**

    Configure the maximum number of retry attempts for Google Cloud SDK API calls with the `--gcp-retries-max-attempts` flag:

    ```console
    prowler gcp --gcp-retries-max-attempts 5
    ```

    This is useful when experiencing quota exceeded errors (HTTP 429) to increase the number of automatic retry attempts.

## Kubernetes

Prowler enables security scanning of Kubernetes clusters, supporting both **in-cluster** and **external** execution.

- **Non In-Cluster Execution**

    ```console
    prowler kubernetes --kubeconfig-file path
    ```
    <Note>
        If no `--kubeconfig-file` is provided, Prowler will use the default KubeConfig file location (`~/.kube/config`).

    </Note>
- **In-Cluster Execution**

    To run Prowler inside the cluster, apply the provided YAML configuration to deploy a job in a new namespace:

    ```console
    kubectl apply -f kubernetes/prowler-sa.yaml
    kubectl apply -f kubernetes/job.yaml
    kubectl apply -f kubernetes/prowler-role.yaml
    kubectl apply -f kubernetes/prowler-rolebinding.yaml
    kubectl get pods --namespace prowler-ns --> prowler-XXXXX
    kubectl logs prowler-XXXXX --namespace prowler-ns
    ```

    <Note>
        By default, Prowler scans all namespaces in the active Kubernetes context. Use the `--context`flag to specify the context to be scanned and `--namespaces` to restrict scanning to specific namespaces.

    </Note>
## Microsoft 365

Microsoft 365 requires specifying the auth method:

```console

# To use service principal authentication for MSGraph and PowerShell modules
prowler m365 --sp-env-auth

# To use az cli authentication
prowler m365 --az-cli-auth

# To use browser authentication
prowler m365 --browser-auth --tenant-id "XXXXXXXX"

```

See more details about M365 Authentication in the [Authentication Section](/user-guide/providers/microsoft365/authentication) section.

## GitHub

Prowler enables security scanning of your **GitHub account**, including **Repositories**, **Organizations** and **Applications**.

- **Supported Authentication Methods**

    Authenticate using one of the following methods:

    ```console
    # Personal Access Token (PAT):
    prowler github --personal-access-token pat

    # OAuth App Token:
    prowler github --oauth-app-token oauth_token

    # GitHub App Credentials:
    prowler github --github-app-id app_id --github-app-key app_key
    ```

    <Note>
        If no login method is explicitly provided, Prowler will automatically attempt to authenticate using environment variables in the following order of precedence:

        1. `GITHUB_PERSONAL_ACCESS_TOKEN`
        2. `OAUTH_APP_TOKEN`
        3. `GITHUB_APP_ID` and `GITHUB_APP_KEY`

    </Note>
## Infrastructure as Code (IaC)

Prowler's Infrastructure as Code (IaC) provider enables you to scan local or remote infrastructure code for security and compliance issues using [Trivy](https://trivy.dev/). This provider supports a wide range of IaC frameworks, allowing you to assess your code before deployment.

```console
# Scan a directory for IaC files
prowler iac --scan-path ./my-iac-directory

# Scan a remote GitHub repository (public or private)
prowler iac --scan-repository-url https://github.com/user/repo.git

# Authenticate to a private repo with GitHub username and PAT
prowler iac --scan-repository-url https://github.com/user/repo.git \
  --github-username <username> --personal-access-token <token>

# Authenticate to a private repo with OAuth App Token
prowler iac --scan-repository-url https://github.com/user/repo.git \
  --oauth-app-token <oauth_token>

# Specify frameworks to scan (default: all)
prowler iac --scan-path ./my-iac-directory --frameworks terraform kubernetes

# Exclude specific paths
prowler iac --scan-path ./my-iac-directory --exclude-path ./my-iac-directory/test,./my-iac-directory/examples
```

<Note>
- `--scan-path` and `--scan-repository-url` are mutually exclusive; only one can be specified at a time.
- For remote repository scans, authentication can be provided via CLI flags or environment variables (`GITHUB_OAUTH_APP_TOKEN`, `GITHUB_USERNAME`, `GITHUB_PERSONAL_ACCESS_TOKEN`). CLI flags take precedence.
- The IaC provider does not require cloud authentication for local scans.
- It is ideal for CI/CD pipelines and local development environments.
- For more details on supported scanners, see the [Trivy documentation](https://trivy.dev/latest/docs/scanner/vulnerability/)

</Note>
See more details about IaC scanning in the [IaC Tutorial](/user-guide/providers/iac/getting-started-iac) section.

## MongoDB Atlas

Prowler allows you to scan your MongoDB Atlas cloud database deployments for security and compliance issues.

Authentication is done using MongoDB Atlas API key pairs:

```console
# Using command-line arguments
prowler mongodbatlas --atlas-public-key <public_key> --atlas-private-key <private_key>

# Using environment variables
export ATLAS_PUBLIC_KEY=<public_key>
export ATLAS_PRIVATE_KEY=<private_key>
prowler mongodbatlas
```

You can filter scans to specific organizations or projects:

```console
# Scan specific project
prowler mongodbatlas --atlas-project-id <project_id>
```

See more details about MongoDB Atlas Authentication in [MongoDB Atlas Authentication](/user-guide/providers/mongodbatlas/authentication)

## Oracle Cloud

Prowler allows you to scan your Oracle Cloud deployments for security and compliance issues.

You have two options to authenticate:

1. OCI Config File Authentication: this config file can be generated using the OCI CLI with the `oci session authenticate` command or created manually using the OCI Console. For more details, see the [OCI Authentication Guide](/user-guide/providers/oci/authentication#oci-session-authentication).

    ```console
    prowler oci
    ```

    You can add different profiles to the config file to scan different tenancies or regions. In order to scan a specific profile, use the `--profile` flag:

    ```console
    prowler oci --profile <profile_name>
    ```

2. Instance Principal Authentication: when running Prowler on an OCI Compute instance, you can use Instance Principal authentication. For more details, see the [OCI Authentication Guide](/user-guide/providers/oci/authentication#instance-principal-authentication).

    ```console
    prowler oci --use-instance-principal
    ```

See more details about Oracle Cloud Authentication in [Oracle Cloud Authentication](/user-guide/providers/oci/authentication)
```

--------------------------------------------------------------------------------

---[FILE: prowler-mcp-tools.mdx]---
Location: prowler-master/docs/getting-started/basic-usage/prowler-mcp-tools.mdx

```text
---
title: "Tools Reference"
---

Complete reference guide for all tools available in the Prowler MCP Server. Tools are organized by namespace.

## Tool Categories Summary

| Category | Tool Count | Authentication Required |
|----------|------------|------------------------|
| Prowler Hub | 10 tools | No |
| Prowler Documentation | 2 tools | No |
| Prowler Cloud/App | 24 tools | Yes |

## Tool Naming Convention

All tools follow a consistent naming pattern with prefixes:

- `prowler_hub_*` - Prowler Hub catalog and compliance tools
- `prowler_docs_*` - Prowler documentation search and retrieval
- `prowler_app_*` - Prowler Cloud and App (Self-Managed) management tools

## Prowler Cloud/App Tools

Manage Prowler Cloud or Prowler App (Self-Managed) features. **Requires authentication.**

<Note>
These tools require a valid API key. See the [Configuration Guide](/getting-started/basic-usage/prowler-mcp) for authentication setup.
</Note>

### Findings Management

Tools for searching, viewing, and analyzing security findings across all cloud providers.

- **`prowler_app_search_security_findings`** - Search and filter security findings with advanced filtering options (severity, status, provider, region, service, check ID, date range, muted status)
- **`prowler_app_get_finding_details`** - Get comprehensive details about a specific finding including remediation guidance, check metadata, and resource relationships
- **`prowler_app_get_findings_overview`** - Get aggregate statistics and trends about security findings as a markdown report

### Provider Management

Tools for managing cloud provider connections in Prowler.

- **`prowler_app_search_providers`** - Search and view configured providers with their connection status
- **`prowler_app_connect_provider`** - Register and connect a provider with credentials for security scanning
- **`prowler_app_delete_provider`** - Permanently remove a provider from Prowler

### Scan Management

Tools for managing and monitoring security scans.

- **`prowler_app_list_scans`** - List and filter security scans across all providers
- **`prowler_app_get_scan`** - Get comprehensive details about a specific scan (progress, duration, resource counts)
- **`prowler_app_trigger_scan`** - Trigger a manual security scan for a provider
- **`prowler_app_schedule_daily_scan`** - Schedule automated daily scans for continuous monitoring
- **`prowler_app_update_scan`** - Update scan name for better organization

### Resources Management

Tools for searching, viewing, and analyzing cloud resources discovered by Prowler.

- **`prowler_app_list_resources`** - List and filter cloud resources with advanced filtering options (provider, region, service, resource type, tags)
- **`prowler_app_get_resource`** - Get comprehensive details about a specific resource including configuration, metadata, and finding relationships
- **`prowler_app_get_resources_overview`** - Get aggregate statistics about cloud resources as a markdown report

### Muting Management

Tools for managing finding muting, including pattern-based bulk muting (mutelist) and finding-specific mute rules.

#### Mutelist (Pattern-Based Muting)

- **`prowler_app_get_mutelist`** - Retrieve the current mutelist configuration for the tenant
- **`prowler_app_set_mutelist`** - Create or update the mutelist configuration for pattern-based bulk muting
- **`prowler_app_delete_mutelist`** - Remove the mutelist configuration from the tenant

#### Mute Rules (Finding-Specific Muting)

- **`prowler_app_list_mute_rules`** - Search and filter mute rules with pagination support
- **`prowler_app_get_mute_rule`** - Retrieve comprehensive details about a specific mute rule
- **`prowler_app_create_mute_rule`** - Create a new mute rule to mute specific findings with documentation and audit trail
- **`prowler_app_update_mute_rule`** - Update a mute rule's name, reason, or enabled status
- **`prowler_app_delete_mute_rule`** - Delete a mute rule from the system

### Compliance Management

Tools for viewing compliance status and framework details across all cloud providers.

- **`prowler_app_get_compliance_overview`** - Get high-level compliance status across all frameworks for a specific scan or provider, including pass/fail statistics per framework
- **`prowler_app_get_compliance_framework_state_details`** - Get detailed requirement-level breakdown for a specific compliance framework, including failed requirements and associated finding IDs

## Prowler Hub Tools

Access Prowler's security check catalog and compliance frameworks. **No authentication required.**

Tools follow a **two-tier pattern**: lightweight listing for browsing + detailed retrieval for complete information.

### Check Discovery and Details

- **`prowler_hub_list_checks`** - List security checks with lightweight data (id, title, severity, provider) and advanced filtering options
- **`prowler_hub_semantic_search_checks`** - Full-text search across check metadata with lightweight results
- **`prowler_hub_get_check_details`** - Get comprehensive details for a specific check including risk, remediation guidance, and compliance mappings

### Check Code

- **`prowler_hub_get_check_code`** - Fetch the Python implementation code for a security check
- **`prowler_hub_get_check_fixer`** - Fetch the automated fixer code for a check (if available)

### Compliance Frameworks

- **`prowler_hub_list_compliances`** - List compliance frameworks with lightweight data (id, name, provider) and filtering options
- **`prowler_hub_semantic_search_compliances`** - Full-text search across compliance frameworks with lightweight results
- **`prowler_hub_get_compliance_details`** - Get comprehensive compliance details including requirements and mapped checks

### Providers Information

- **`prowler_hub_list_providers`** - List Prowler official providers
- **`prowler_hub_get_provider_services`** - Get available services for a specific provider

## Prowler Documentation Tools

Search and access official Prowler documentation. **No authentication required.**

- **`prowler_docs_search`** - Search the official Prowler documentation using full-text search with the `term` parameter
- **`prowler_docs_get_document`** - Retrieve the full markdown content of a specific documentation file using the path from search results

## Usage Tips

- Use natural language to interact with the tools through your AI assistant
- Tools can be combined for complex workflows
- Filter options are available on most list tools
- Authentication is only required for Prowler Cloud/App tools

## Additional Resources

- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Prowler API Documentation](https://api.prowler.com/api/v1/docs)
- [Prowler Hub API](https://hub.prowler.com/api/docs)
- [GitHub Repository](https://github.com/prowler-cloud/prowler)
```

--------------------------------------------------------------------------------

---[FILE: prowler-mcp.mdx]---
Location: prowler-master/docs/getting-started/basic-usage/prowler-mcp.mdx

```text
---
title: "Configuration"
---

Configure your MCP client to connect to Prowler MCP Server.

## Step 1: Get Your API Key

<Note>
**Authentication is optional**: Prowler Hub and Prowler Documentation features work without authentication. An API key is only required for Prowler Cloud and Prowler App (Self-Managed) features.
</Note>

To use Prowler Cloud or Prowler App (Self-Managed) features. To get the API key, please refer to the [API Keys](/user-guide/tutorials/prowler-app-api-keys) guide.

<Warning>
Keep the API key secure. Never share it publicly or commit it to version control.
</Warning>

## Step 2: Configure Your MCP Host/Client

Choose the configuration based on your deployment:

- **HTTP Mode**: Prowler Cloud MCP Server or self-hosted Prowler MCP Server.
- **STDIO Mode**: Local installation only (runs as subprocess of your MCP client).

### HTTP Mode

<Tabs>
  <Tab title="Generic Native HTTP Support">
    **Configuration:**
    ```json
    {
      "mcpServers": {
        "prowler": {
          "url": "https://mcp.prowler.com/mcp", // or your self-hosted Prowler MCP Server URL
          "headers": {
            "Authorization": "Bearer <your-api-key-here>"
          }
        }
      }
    }
    ```
  </Tab>

  <Tab title="Generic without Native HTTP Support">
    **Configuration:**
    ```json
    {
      "mcpServers": {
        "prowler": {
          "command": "npx",
          "args": [
            "mcp-remote",
            "https://mcp.prowler.com/mcp", // or your self-hosted Prowler MCP Server URL
            "--header",
            "Authorization: Bearer ${PROWLER_APP_API_KEY}"
          ],
          "env": {
            "PROWLER_APP_API_KEY": "<your-api-key-here>"
          }
        }
      }
    }
    ```
    <Info>
    The `mcp-remote` tool acts as a bridge for clients that don't support HTTP natively. Learn more at [mcp-remote on npm](https://www.npmjs.com/package/mcp-remote).
    </Info>
  </Tab>

  <Tab title="Claude Desktop">
    1. Open Claude Desktop settings
    2. Go to "Developer" tab
    3. Click in "Edit Config" button
    4. Edit the `claude_desktop_config.json` file with your favorite editor
    5. Add the following configuration:
    ```json
    {
      "mcpServers": {
        "prowler": {
          "command": "npx",
          "args": [
            "mcp-remote",
            "https://mcp.prowler.com/mcp",
            "--header",
            "Authorization: Bearer ${PROWLER_APP_API_KEY}"
          ],
          "env": {
            "PROWLER_APP_API_KEY": "<your-api-key-here>"
          }
        }
      }
    }
    ```
  </Tab>

  <Tab title="Claude Code">
    Run the following command:
    ```bash
    export PROWLER_APP_API_KEY="<your-api-key-here>"
    claude mcp add --transport http prowler https://mcp.prowler.com/mcp --header "Authorization: Bearer $PROWLER_APP_API_KEY" --scope user
    ```
  </Tab>

  <Tab title="Cursor">
    1. Open Cursor settings
    2. Go to "Tools & MCP"
    3. Click in "New MCP Server" button
    4. Add to the JSON Configuration the following:
    ```json
    {
      "mcpServers": {
        "prowler": {
          "url": "https://mcp.prowler.com/mcp",
          "headers": {
            "Authorization": "Bearer <your-api-key-here>"
          }
        }
      }
    }
    ```
  </Tab>


</Tabs>

### STDIO Mode

STDIO mode is only available when running the MCP server locally.

<Tabs>
  <Tab title="Generic uvx installation">
    **Run from source or local installation**

    ```json
    {
      "mcpServers": {
        "prowler": {
          "command": "uvx",
          "args": ["/absolute/path/to/prowler/mcp_server/"],
          "env": {
            "PROWLER_APP_API_KEY": "<your-api-key-here>",
            "API_BASE_URL": "https://api.prowler.com/api/v1"
          }
        }
      }
    }
    ```

    <Note>
    Replace `/absolute/path/to/prowler/mcp_server/` with the actual path. The `API_BASE_URL` is optional and defaults to Prowler Cloud API.
    </Note>

  </Tab>

  <Tab title="Generic Docker installation">
    **Run with Docker image**

    ```json
    {
      "mcpServers": {
        "prowler": {
          "command": "docker",
          "args": [
            "run",
            "--rm",
            "-i",
            "--env",
            "PROWLER_APP_API_KEY=<your-api-key-here>",
            "--env",
            "API_BASE_URL=https://api.prowler.com/api/v1",
            "prowlercloud/prowler-mcp"
          ]
        }
      }
    }
    ```

    <Note>
    The `API_BASE_URL` is optional and defaults to Prowler Cloud API.
    </Note>

  </Tab>
</Tabs>

## Step 3: Start Using Prowler MCP

Restart your MCP client and start asking questions:
- *"Show me all critical findings from my AWS accounts"*
- *"What does the S3 bucket public access check do?"*
- *"Onboard this new AWS account in my Prowler Organization"*

## Authentication Methods

Prowler MCP Server supports two authentication methods to connect to Prowler Cloud or Prowler App (Self-Managed):

### API Key (Recommended)

Use your Prowler API key directly in the Bearer token:

```
Authorization: Bearer <your-api-key-here>
```

This is the recommended method for most users.

### JWT Token

Alternatively, obtain a JWT token from Prowler:

```bash
curl -X POST https://api.prowler.com/api/v1/tokens \
  -H "Content-Type: application/vnd.api+json" \
  -H "Accept: application/vnd.api+json" \
  -d '{
    "data": {
      "type": "tokens",
      "attributes": {
        "email": "your-email@example.com",
        "password": "your-password"
      }
    }
  }'
```

Use the returned JWT token in place of the API key:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

<Warning>
JWT tokens are only valid for 30 minutes. You need to generate a new token if you want to continue using the MCP server.
</Warning>

## Troubleshooting

### Server Not Detected

- Restart your MCP client after configuration changes
- Check the configuration file syntax (valid JSON)
- Review client logs for specific error messages
- Verify the server URL is correct

### Authentication Failures

**Error: Unauthorized (401)**
- Verify your API key is correct
- Ensure the key hasn't expired
- Check you're using the right API endpoint

### Connection Issues

**Cannot Reach Server:**
- Verify the server URL is correct
- Check network connectivity
- For local servers, ensure the server is running
- Check firewall settings

## Security Best Practices

1. **Protect Your API Key**
   - Never commit API keys to version control.
   - Use environment variables or secure vaults.
   - Rotate keys regularly.

2. **Network Security**
   - Use HTTPS for production deployments.
   - Restrict network access to the MCP server.
   - Consider VPN for remote access.

3. **Least Privilege**
   - API key gives the permission of the user who created the key, make sure to use the key with the minimal required permissions.
   - Review the tools that are gonna be used and how they are gonna be used to avoid prompt injections or unintended behavior.

## Next Steps

Now that your MCP server is configured:

<CardGroup cols={1}>
  <Card title="Tools Reference" icon="wrench" href="/getting-started/basic-usage/prowler-mcp-tools">
    Explore all available tools
  </Card>
</CardGroup>

## Getting Help

Need assistance with configuration?

- Search for existing [GitHub issues](https://github.com/prowler-cloud/prowler/issues)
- Ask for help in our [Slack community](https://goto.prowler.com/slack)
- Report a new issue on [GitHub](https://github.com/prowler-cloud/prowler/issues/new)
```

--------------------------------------------------------------------------------

---[FILE: awssecurityhub.mdx]---
Location: prowler-master/docs/getting-started/comparison/awssecurityhub.mdx

```text
---
title: 'AWS Security Hub'
---

AWS Security Hub remains a managed service designed for centralizing security alerts and compliance status within AWS environments. It integrates with various AWS security services and provides a consolidated view of security findings.

## Key Features and Strengths

- **Centralized Dashboard for AWS:** Provides a single pane of glass to monitor and manage security findings from multiple AWS services like GuardDuty, Inspector, and Config.

- **Compliance Checks:** Automatically checks for compliance against standards like CIS and PCI DSS within AWS environments.

- **AWS Native Automation:** Offers seamless automation for incident response using AWS Lambda and CloudWatch Events, reducing the time to react to security issues.

- **User-Friendly Interface:** Accessible via the AWS Management Console, offering a streamlined experience for managing security across AWS accounts.

## Limitations

- **AWS-Centric:** Limited to AWS environments, with no direct support for multi-cloud or hybrid environments.

- **Dependency on AWS Config:** Some of its checks depend on AWS Config, which may not be enabled in all regions or accounts.

- **Vendor Lock-In:** Tightly coupled with AWS, making it less suitable for organizations with a cloud-agnostic strategy.

## Prowler

Prowler is an open-source, multi-cloud security tool that offers extensive customization and flexibility, making it ideal for organizations with complex or multi-cloud environments. Here are the updated features and advantages:

## Main Advantages of Prowler

- **Multi-Region and Multi-Account Scanning by Default:**
  - Prowler is inherently multi-region and can scan multiple AWS accounts without requiring additional configuration or enabling specific services like AWS Config.

- **Minimal Setup Requirements:**
  - All Prowler needs is a role with appropriate permissions to start scanning. There’s no need to enable specific services or configure complex setups.

- **Versatile Execution Environment:**
  - Prowler can be run from various environments, including a local workstation, container, AWS CloudShell, or even from another AWS account or cloud provider by assuming a role. This flexibility makes it easy to integrate into different operational workflows.

- **Flexible Results Storage and Sharing:**
  - Prowler results can be stored directly into an S3 bucket, allowing for quick analysis, or locally for easy sharing and discussion. This flexibility is particularly useful for collaborative security assessments.

- **Customizable Reporting and Analysis:**
  - Prowler supports exporting results in multiple formats, including JSON, CSV, OCSF format, and static HTML reports. It also supports integration with Amazon QuickSight for in-depth analysis and offers a SaaS model with resource-based pricing, making it adaptable to different organizational needs.

- **Security Hub Integration for Cost-Effective Operations:**
  - Prowler can send results directly into Security Hub in any AWS account, including only failed findings. This selective reporting can make Security Hub more cost-effective by reducing the volume of data processed.

- **Custom Checks and Compliance Frameworks:**
  - Users can write custom checks, remediations, and compliance frameworks in minutes, tailoring the tool to their specific security policies and operational needs.

- **Extensive Compliance Support:**
  - Prowler supports over 27 compliance frameworks out of the box for AWS, providing comprehensive coverage across various regulatory requirements and best practices.

- **Kubernetes and Multi-Cloud Support:**
  - Prowler extends its scanning capabilities beyond AWS, offering support for Kubernetes clusters (including EKS), as well as environments in Google Cloud Platform (GCP) and Azure. This multi-cloud capability is essential for organizations with diverse cloud footprints.

- **All-Region Checks:**
  - Prowler runs all checks in all regions, regardless of AWS Config resource type support, ensuring comprehensive coverage across your entire AWS environment.

## Comparison Summary

### Scope and Environment

- **Security Hub** is ideal for AWS-centric environments needing a managed service for monitoring and automating security across AWS resources.
- **Prowler** is better suited for organizations operating in multi-cloud or hybrid environments, offering flexibility, customization, and support for multiple cloud providers including AWS, Azure, GCP, and Kubernetes.

### Setup and Maintenance

- **Security Hub** requires enabling and configuring AWS services by region, per account, and can become more than one person's full-time role – including Config. Security Hub operates only within the AWS ecosystem.
- **Prowler** requires minimal setup, only needing appropriate permissions, and can be executed from various environments, making it more versatile in different operational contexts.

### Customization and Flexibility

- **Security Hub** offers predefined compliance checks and automation within AWS but is less flexible in terms of customization.
- **Prowler** allows for highly customizable checks, remediation actions, and compliance frameworks, with the ability to adapt quickly to organizational needs and regulatory changes.

### Cost Efficiency

- **Security Hub** may involve additional costs for processing and storing findings.
- **Prowler** can optimize costs by selectively sending failed findings to Security Hub and storing results locally or in S3, which can be more cost-effective.

### Multi-Cloud and Multi-Region Support

- **Security Hub** is confined to AWS, with region-specific checks depending on AWS Config.
- **Prowler** is inherently multi-region and multi-cloud, offering consistent and comprehensive checks across different cloud environments and regions.

## Conclusion

For a CISO or security professional evaluating these tools, the decision between AWS Security Hub and Prowler will depend on the organization’s cloud strategy, compliance needs, and the level of flexibility required:

- If the organization is heavily invested in AWS and prefers a managed, integrated security service that offers ease of use and automation within the AWS ecosystem, **AWS Security Hub** is the more appropriate choice.

- If the organization operates in a multi-cloud environment or requires a highly customizable tool that can run comprehensive, multi-region scans across AWS, Azure, GCP, and Kubernetes, **Prowler** provides a more powerful and flexible solution, especially for those needing to adapt quickly to evolving security and compliance requirements.
```

--------------------------------------------------------------------------------

````
