---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 97
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 97 of 867)

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

---[FILE: prowler-app-api-keys.mdx]---
Location: prowler-master/docs/user-guide/tutorials/prowler-app-api-keys.mdx

```text
---
title: 'API Keys'
---

import { VersionBadge } from "/snippets/version-badge.mdx"

<VersionBadge version="5.13.0" />

API key authentication in Prowler App provides an alternative to JWT tokens and empowers automation, CI/CD pipelines, and third-party integrations. This guide explains how to create, manage, and safeguard API keys when working with the Prowler API.

## API Key Advantages

- **Programmatic access:** Enables automated workflows and scripts to interact with Prowler App.
- **Long-lived authentication:** Allows optional expiration dates, with a default of 1 year.
- **Granular control:** Supports multiple keys with distinct names and purposes.
- **Secure automation:** Simplifies safe integration into CI/CD pipelines and infrastructure-as-code tooling.

## How It Works

API keys provide a secure authentication mechanism for accessing the Prowler API:

1. API keys are created through Prowler App with a user-defined name and optional expiration date.
2. The full API key appears only once upon creation and cannot be retrieved later.
3. Each API key consists of a prefix (visible in the interface) and an encrypted secret portion.
4. Requests include the API key in the header as `Authorization: Api-Key <api-key>`.
5. The system updates the Last Used timestamp after each authenticated request.
6. API keys automatically inherit the RBAC permissions of the creator (see [Permission Inheritance](#permission-inheritance)).
7. Revocation immediately disables an API key and prevents further access.

### Example curl Request

This example demonstrates how to invoke the Prowler API with an API key.

1. Define the API key as an environment variable to avoid exposing the secret in shell history.
2. Call the desired endpoint with `curl` and supply the `Authorization` header.

```bash
export PROWLER_API_KEY="pk_example_redacted"

curl -X GET \
  -H "Authorization: Api-Key ${PROWLER_API_KEY}" \
  -H "Content-Type: application/vnd.api+json" \
  https://api.prowler.com/api/v1/tenants
```

<Note>
**Authentication Priority**

When a request includes both a JWT token and an API key, the JWT token takes precedence for authentication.

</Note>

<Warning>
**Security Notice**

API keys are equivalent to passwords and grant the same access level as the creator. Handle every key with password-level safeguards.

</Warning>

## Required Permissions

Creating, viewing, or managing API keys requires the **MANAGE_ACCOUNT** RBAC permission within the tenant. This permission governs all API key management operations.

Without this permission, the API Keys section remains hidden. Access requests should be routed through the tenant administrator.

For more information about RBAC permissions, refer to the [Prowler App RBAC documentation](/user-guide/tutorials/prowler-app-rbac).

## Creating API Keys

Follow these steps to create an API key in Prowler App:

1. Navigate to **Profile** → **Account** in Prowler App.
2. Select the **Create API Key** button.

    ![API Keys list](/images/cli/api-keys/list.png)

3. Configure the API key settings:
    * **Name:** Provide a descriptive label with at least 3 characters (examples: "CI Pipeline Production", "Monitoring Script").
    * **Expiration Date (optional):** Set a custom expiration date. When omitted, the key expires automatically 1 year (365 days) after creation.

    ![Create API key form](/images/cli/api-keys/create.png)

4. Select **Create API Key** to generate the key.
5. **Important:** Copy and securely store the API key immediately. The full value appears only once and cannot be retrieved later.

    ![API key created successfully](/images/cli/api-keys/created.png)

<Warning>
**Save the API Key Immediately**

After the creation dialog closes, only the key prefix remains visible in the interface. Lost keys require generating a replacement and updating dependent applications.

</Warning>

## Managing API Keys

### Viewing API Keys

The API Keys management interface displays every key associated with the signed-in account:

1. Navigate to **Profile** → **Account**.
2. Review the list of API keys, which includes:
    * **Name:** The descriptive label assigned to the key.
    * **Prefix:** The visible portion of the key for identification (for example, `pk_ABC12345`).
    * **Email:** The email address of the creator.
    * **Created:** The timestamp when the key was created.
    * **Last Used:** The timestamp of the most recent successful authentication.
    * **Expires:** The configured expiration date.
    * **Status:** Whether the key is active or revoked.

    ![API Keys management interface](/images/cli/api-keys/management.png)

### Updating API Keys

API keys support limited updates to maintain security:

1. Locate the target API key in the list.
2. Select **Edit name** from the action menu.
3. Update the available field:
    * **Name:** Modify the descriptive label for clearer identification.
4. Review the fields that cannot be changed:
    * Prefix, expiration date, and the secret itself remain immutable.
    * Adjusting those properties requires creating a new API key and revoking the existing one.
5. Select **Save** to apply the change.

    ![Update API key name](/images/cli/api-keys/update.png)

### Actions

Each API key provides management actions through dedicated buttons or the action menu:

| Action | Purpose | Effect | Notes |
|--------|---------|--------|-------|
| **Edit Name** | Update the key's descriptive name | Changes the display name only | Does not affect authentication |
| **Revoke** | Disable the API key | Sets revoked status to true, blocking all authentication | Maintains audit trail and key history |

<Note>
**API Keys Cannot Be Deleted**

For security and audit purposes, API keys cannot be permanently removed from the system. Use the **Revoke** action to disable a key. Revoked keys remain visible for audit purposes but cannot be used for authentication.

</Note>

## Permission Inheritance

API keys automatically inherit the RBAC permissions of the creator, ensuring that programmatic access mirrors user-level security boundaries.

### How Permission Inheritance Works

* **Current permissions apply:** When an API key is used, it operates with the creator's current RBAC permissions.
* **Dynamic updates:** Permission changes on the creator immediately propagate to every associated API key.
* **User downgrade:** Reduced user permissions result in reduced API key capabilities.
* **Tenant removal:** Removing a user from a tenant automatically revokes every key for that tenant.
* **User deletion:** Deleting a user from the application automatically revokes all associated API keys.

<Warning>
**Automatic Revocation**

API keys are automatically revoked when the creator is removed from the tenant or deleted from the application. This mechanism ensures that access ends as soon as the user loses access.

</Warning>

### Best Practices for Permission Management

* **Use service accounts for automation:** Create dedicated user accounts for API-based automation to separate human and programmatic access, ensuring continuity when team members transition.
* **Review API key ownership regularly:** Confirm that API keys remain associated with appropriate user accounts and document ownership.
* **Monitor permission changes:** Track user permission updates because every change affects associated API keys.
* **Plan for user offboarding:** Provision replacement API keys under service accounts before removing users to avoid disruptions.

## Security Best Practices

### Key Storage and Management

* **Never commit API keys to version control:** Add them to `.gitignore` and rely on environment variables or secure secret management systems.
* **Use secret managers:** Store keys in AWS Secrets Manager, HashiCorp Vault, Azure Key Vault, GitHub Secrets, or equivalent solutions.
* **Rotate keys regularly:** Create new keys and revoke old ones on a scheduled basis as part of standard security hygiene.
* **Set expiration dates:** Enforce automatic rotation and reduce risk by applying expiration dates.
* **Monitor last used timestamps:** Review usage data to identify unused or potentially compromised keys.

### Key Usage

* **Create dedicated keys per application:** Isolate access by assigning separate keys to services, environments, or purposes.
* **Use descriptive names:** Label keys clearly, such as "ci-pipeline-prod", "monitoring-staging", or "terraform-automation".
* **Limit key distribution:** Share keys only with team members who require access.
* **Revoke immediately on breach:** Replace exposed or compromised keys without delay.

### Environment Variables

Store API keys in environment variables rather than hardcoding them in scripts or configuration files. Platform-specific secret management systems (GitHub Secrets, GitLab CI/CD Variables, AWS Secrets Manager, HashiCorp Vault, and similar tools) are recommended for production environments.

### CI/CD Integration Best Practices

When using API keys in CI/CD pipelines:

* **Use pipeline secrets:** Store keys in the CI/CD platform's secret management system.
* **Mask in logs:** Ensure the platform masks API keys in build and deployment logs.
* **Create pipeline-specific keys:** Issue separate keys for each pipeline or environment (development, staging, production).
* **Set shorter expirations:** Apply shorter expiration periods (for example, 90 days) to enforce rotation.
* **Use service accounts:** Create dedicated user accounts for CI/CD pipelines (see [Permission Inheritance](#permission-inheritance) for automatic revocation details).

## Troubleshooting

### Authentication Fails with "Invalid API Key"

* Verify that the API key is copied correctly with no extra spaces, line breaks, or hidden characters.
* Ensure the key has not been revoked by checking the Revoked column in the API Keys list.
* Confirm that the key has not expired by reviewing the expiration date.
* Confirm that the correct API key format is in use, including both prefix and secret portions.
* Verify that the key prefix matches what is displayed in Prowler App.

### API Key Not Working After Creation

* Verify that the full API key was copied from the creation dialog, including both the prefix and encrypted portions.
* Check that the key has not expired by reviewing the expiration date in the management interface.
* Ensure the key is not revoked by reviewing its status in the API Keys list.
* Confirm that authentication targets the correct Prowler API environment.

### Last Used Timestamp Not Updating

* The timestamp updates only on successful authentication requests.
* Authentication failures prevent the timestamp from updating.
* Verify that requests complete successfully and do not return authentication errors.
* Check that the request reaches the Prowler API and is not blocked by network policies.

### Need to Retrieve a Lost API Key

* API keys cannot be retrieved after the creation dialog closes for security reasons.
* Create a new API key to replace the lost one.
* Update all applications and scripts that rely on the old key with the new value.
* Revoke the old key after confirming that the new key works to prevent security issues.
* Consider using a secret management system to avoid future loss.

### Key Was Exposed or Compromised

1. Immediately revoke the compromised key through the API Keys management interface.
2. Review recent activity for unauthorized access using the Last Used timestamp.
3. Create a new API key with a different name to replace the compromised one.
4. Update all legitimate applications with the new key.
5. Investigate the exposure to prevent similar incidents.
6. Implement additional security measures or rely on service accounts for better isolation.
```

--------------------------------------------------------------------------------

---[FILE: prowler-app-jira-integration.mdx]---
Location: prowler-master/docs/user-guide/tutorials/prowler-app-jira-integration.mdx

```text
---
title: "Jira Integration"
---
import { VersionBadge } from "/snippets/version-badge.mdx"

<VersionBadge version="5.12.0" />

Prowler App enables automatic export of security findings to Jira, providing seamless integration with Atlassian's work item tracking and project management platform. This comprehensive guide demonstrates how to configure and manage Jira integrations to streamline security incident management and enhance team collaboration across security workflows.

Integrating Prowler App with Jira provides:

* **Streamlined management:** Convert security findings directly into actionable Jira work items
* **Enhanced team collaboration:** Leverage existing project management workflows for security remediation
* **Automated ticket creation:** Reduce manual effort in tracking and assigning security work items

## How It Works

When enabled and configured:

1. Security findings can be manually sent to Jira from the Findings table.
2. Each finding creates a Jira work item with all the check's metadata, including guidance on how to remediate it.

## Configuration

To configure Jira integration in Prowler App:

1. Navigate to **Integrations** in the Prowler App interface
2. Locate the **Jira** card and click **Manage**, then select **Add integration**

    ![Integrations tab](/images/prowler-app/jira/integrations-tab.png)

3. Complete the integration settings:
    * **Jira domain:** Enter the Jira domain (e.g., from `https://your-domain.atlassian.net` -> `your-domain`)
    * **Email:** Your Jira account email
    * **API Token:** API token with the following scopes: `read:jira-user`, `read:jira-work`, `write:jira-work`
        ![Connection settings](/images/prowler-app/jira/connection-settings.png)

<Note>
**Generate Jira API Token**

To generate a Jira API token, visit: https://id.atlassian.com/manage-profile/security/api-tokens

</Note>

Once configured successfully, the integration is ready to send findings to Jira.

## Sending Findings to Jira

### Manual Export

To manually send individual findings to Jira:

1. Navigate to the **Findings** section in Prowler App
2. Select one finding you want to export
3. Click the action button on the table row and select **Send to Jira**
4. Select the Jira integration and project
5. Click **Send to Jira**

    ![Send to Jira modal](/images/prowler-app/jira/send-to-jira-modal.png)

## Integration Status

Monitor and manage your Jira integrations through the management interface:

1. Review configured integrations in the integrations dashboard
2. Each integration displays:

    - **Connection Status:** Connected or Disconnected indicator
    - **Instance Information:** Jira domain and last checked timestamp

### Actions

Each Jira integration provides management actions through dedicated buttons:

| Button | Purpose | Available Actions | Notes |
|--------|---------|------------------|-------|
| **Test** | Verify integration connectivity | • Test Jira API access<br/>• Validate credentials<br/>• Check project permissions<br/>• Verify work item creation capability | Results displayed in notification message |
| **Credentials** | Update authentication settings | • Change API token<br/>• Update email<br/>• Update Jira domain | Click "Update Credentials" to save changes |
| **Enable/Disable** | Toggle integration status | • Enable or disable integration<br/>| Status change takes effect immediately |
| **Delete** | Remove integration permanently | • Permanently delete integration<br/>• Remove all configuration data | ⚠️ **Cannot be undone** - confirm before deleting |

## Troubleshooting

### Connection test fails

- Verify Jira instance domain is correct and accessible
- Confirm API token or credentials are valid
- Ensure API access is enabled in Jira settings and the needed scopes are granted

### Check task status (API)

If the Jira issue does not appear in your Jira project, follow these steps to verify the export task status via the API.

<Note>
Replace `http://localhost:8080` with the base URL where your Prowler API is accessible (for example, `https://api.yourdomain.com`).

</Note>

1) Get an access token (replace email and password):

```
curl --location 'http://localhost:8080/api/v1/tokens' \
  --header 'Content-Type: application/vnd.api+json' \
  --header 'Accept: application/vnd.api+json' \
  --data-raw '{
    "data": {
      "type": "tokens",
      "attributes": {
        "email": "YOUR_USER_EMAIL",
        "password": "YOUR_USER_PASSWORD"
      }
    }
  }'
```

2) List tasks filtered by the Jira task (`integration-jira`) using the access token:

```
curl --location --globoff 'http://localhost:8080/api/v1/tasks?filter[name]=integration-jira' \
  --header 'Accept: application/vnd.api+json' \
  --header 'Authorization: Bearer ACCESS_TOKEN' | jq
```

<Note>
If you don't have `jq` installed, run the command without `| jq`.

</Note>

3) Share the output so we can help. A typical result will look like:

```
{
  "links": {
    "first": "https://api.dev.prowler.com/api/v1/tasks?page%5Bnumber%5D=1",
    "last": "https://api.dev.prowler.com/api/v1/tasks?page%5Bnumber%5D=122",
    "next": "https://api.dev.prowler.com/api/v1/tasks?page%5Bnumber%5D=2",
    "prev": null
  },
  "data": [
    {
      "type": "tasks",
      "id": "9a79ab21-39ae-4161-9f6e-2844eb0da0fb",
      "attributes": {
        "inserted_at": "2025-09-09T08:11:38.643620Z",
        "completed_at": "2025-09-09T08:11:41.264285Z",
        "name": "integration-jira",
        "state": "completed",
        "result": {
          "created_count": 0,
          "failed_count": 1
        },
        "task_args": {
          "integration_id": "a476c2c0-0a00-4720-bfb9-286e9eb5c7bd",
          "project_key": "PRWLR",
          "issue_type": "Task",
          "finding_ids": [
            "01992d53-3af7-7759-be48-68fc405391e6"
          ]
        },
        "metadata": {}
      }
    },
    {
      "type": "tasks",
      "id": "5f525135-9d37-4b01-9ac8-afeaf8793eac",
      "attributes": {
        "inserted_at": "2025-09-09T08:07:22.184164Z",
        "completed_at": "2025-09-09T08:07:24.909185Z",
        "name": "integration-jira",
        "state": "completed",
        "result": {
          "created_count": 1,
          "failed_count": 0
        },
        "task_args": {
          "integration_id": "a476c2c0-0a00-4720-bfb9-286e9eb5c7bd",
          "project_key": "JIRA",
          "issue_type": "Task",
          "finding_ids": [
            "0198f018-8b7b-7154-a509-1a2b1ffba02d"
          ]
        },
        "metadata": {}
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pages": 122,
      "count": 1214
    },
    "version": "v1"
  }
}
```

How to read it:

- "created_count": number of Jira issues successfully created.
- "failed_count": number of Jira issues that could not be created. If `failed_count > 0` or the issue does not appear in Jira, please contact us so we can assist while detailed logs are not available through the UI.
```

--------------------------------------------------------------------------------

---[FILE: prowler-app-lighthouse-multi-llm.mdx]---
Location: prowler-master/docs/user-guide/tutorials/prowler-app-lighthouse-multi-llm.mdx

```text
---
title: 'Using Multiple LLM Providers with Lighthouse'
---

import { VersionBadge } from "/snippets/version-badge.mdx"

<VersionBadge version="5.14.0" />

Prowler Lighthouse AI supports multiple Large Language Model (LLM) providers, offering flexibility to choose the provider that best fits infrastructure, compliance requirements, and cost considerations. This guide explains how to configure and use different LLM providers with Lighthouse AI.

## Supported Providers

Lighthouse AI supports the following LLM providers:

- **OpenAI**: Provides access to GPT models (GPT-4o, GPT-4, etc.)
- **Amazon Bedrock**: Offers AWS-hosted access to Claude, Llama, Titan, and other models
- **OpenAI Compatible**: Supports custom endpoints like OpenRouter, Ollama, or any OpenAI-compatible service

## Model Requirements

For Lighthouse AI to work properly, models **must** support all of the following capabilities:

- **Text input**: Ability to receive text prompts.
- **Text output**: Ability to generate text responses.
- **Tool calling**: Ability to invoke tools and functions.

If any of these capabilities are missing, the model will not be compatible with Lighthouse AI.

## How Default Providers Work

All three providers can be configured for a tenant, but only one can be set as the default provider. The first configured provider automatically becomes the default.

When visiting Lighthouse AI chat, the default provider's default model loads automatically. Users can switch to any available LLM model (including those from non-default providers) using the dropdown in chat.

<img src="/images/prowler-app/lighthouse-switch-models.png" alt="Switch models in Lighthouse AI chat interface" />

## Configuring Providers

Navigate to **Configuration** → **Lighthouse AI** to see all three provider options with a **Connect** button under each.

<img src="/images/prowler-app/lighthouse-configuration.png" alt="Prowler Lighthouse Configuration" />

### Connecting a Provider

To connect a provider:

1. Click **Connect** under the desired provider
2. Enter the required credentials
3. Select a default model for that provider
4. Click **Connect** to save

<Tabs>
  <Tab title="OpenAI">
    ### Required Information

    - **API Key**: OpenAI API key (starts with `sk-` or `sk-proj-`). API keys can be created from the [OpenAI platform](https://platform.openai.com/api-keys).

    ### Before Connecting

    - Ensure the OpenAI account has sufficient credits.
    - Verify that the `gpt-5` model (recommended for Lighthouse AI) is not blocked in the OpenAI organization settings.
  </Tab>

  <Tab title="Amazon Bedrock">
    Prowler connects to Amazon Bedrock using either [Amazon Bedrock API keys](https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started-api-keys.html) or IAM credentials.

    <Note>
    Amazon Bedrock models depend on AWS region and account entitlements. Lighthouse AI displays only accessible models that support tool calling and text input/output.
    </Note>

    ### Amazon Bedrock Long-Term API Key

    <VersionBadge version="5.15.0" />

    <Warning>
    Amazon Bedrock Long-Term API keys are recommended only for exploration purposes. For production environments, use AWS IAM Access Keys with properly scoped permissions.
    </Warning>

    Amazon Bedrock API keys provide simpler authentication with automatically assigned permissions.

    #### Required Information

    - **Bedrock Long-Term API Key**: The API key generated from Amazon Bedrock.
    - **AWS Region**: Region where Bedrock is available.

    <Note>
    Amazon Bedrock Long-Term API keys are automatically assigned the necessary permissions (`AmazonBedrockLimitedAccess` policy).

    Learn more: [Getting Started with Amazon Bedrock API Keys](https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started-api-keys.html)
    </Note>

    ### AWS IAM Access Keys

    Standard AWS IAM credentials can be used as an alternative authentication method.

    #### Required Information

    - **AWS Access Key ID**: The access key ID for the IAM user.
    - **AWS Secret Access Key**: The secret access key for the IAM user.
    - **AWS Region**: Region where Bedrock is available.

    #### Required Permissions

    The AWS IAM user must have the `AmazonBedrockLimitedAccess` managed policy attached:

    ```text
    arn:aws:iam::aws:policy/AmazonBedrockLimitedAccess
    ```

    <Note>
    Access to all Amazon Bedrock foundation models is enabled by default. When you select a model or invoke it for the first time (using Prowler or otherwise), you agree to Amazon's EULA. More info: [Amazon Bedrock Model Access](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html)
    </Note>

  </Tab>

  <Tab title="OpenAI Compatible">
    Use this option to connect to any LLM provider exposing an OpenAI compatible API endpoint (OpenRouter, Ollama, etc.).

    ### Required Information

    - **API Key**: API key from the compatible service.
    - **Base URL**: API endpoint URL including the API version (e.g., `https://openrouter.ai/api/v1`).

    ### Example: OpenRouter

    1. Create an account at [OpenRouter](https://openrouter.ai/)
    2. [Generate an API key](https://openrouter.ai/docs/guides/overview/auth/provisioning-api-keys) from the OpenRouter dashboard
    3. Configure in Lighthouse AI:
       - **API Key**: OpenRouter API key
       - **Base URL**: `https://openrouter.ai/api/v1`
  </Tab>
</Tabs>

## Changing the Default Provider

To set a different provider as default:

1. Navigate to **Configuration** → **Lighthouse AI**
2. Click **Configure** under the desired provider to set as default
3. Click **Set as Default**

<img src="/images/prowler-app/lighthouse-set-default-provider.png" alt="Set default LLM provider" />

## Updating Provider Credentials

To update credentials for a connected provider:

1. Navigate to **Configuration** → **Lighthouse AI**
2. Click **Configure** under the provider
3. Enter the new credentials
4. Click **Update**

## Deleting a Provider

To remove a configured provider:

1. Navigate to **Configuration** → **Lighthouse AI**
2. Click **Configure** under the provider
3. Click **Delete**

## Model Recommendations

For best results with Lighthouse AI, the recommended model is `gpt-5` from OpenAI.

Models from other providers such as Amazon Bedrock and OpenAI Compatible endpoints can be connected and used, but performance is not guaranteed. Ensure that any selected model supports text input, text output, and tool calling capabilities.

## Getting Help

For issues or suggestions, [reach out through our Slack channel](https://goto.prowler.com/slack).
```

--------------------------------------------------------------------------------

---[FILE: prowler-app-lighthouse.mdx]---
Location: prowler-master/docs/user-guide/tutorials/prowler-app-lighthouse.mdx

```text
---
title: 'How It Works'
---

import { VersionBadge } from "/snippets/version-badge.mdx"

<VersionBadge version="5.8.0" />

Prowler Lighthouse AI integrates Large Language Models (LLMs) with Prowler security findings data.

Here's what's happening behind the scenes:

- The system uses a multi-agent architecture built with [LanggraphJS](https://github.com/langchain-ai/langgraphjs) for LLM logic and [Vercel AI SDK UI](https://sdk.vercel.ai/docs/ai-sdk-ui/overview) for frontend chatbot.
- It uses a ["supervisor" architecture](https://langchain-ai.lang.chat/langgraphjs/tutorials/multi_agent/agent_supervisor/) that interacts with different agents for specialized tasks. For example, `findings_agent` can analyze detected security findings, while `overview_agent` provides a summary of connected cloud accounts.
- The system connects to the configured LLM provider to understand user's query, fetches the right data, and responds to the query.
<Note>
Lighthouse AI supports multiple LLM providers including OpenAI, Amazon Bedrock, and OpenAI-compatible services. For configuration details, see [Using Multiple LLM Providers with Lighthouse](/user-guide/tutorials/prowler-app-lighthouse-multi-llm).
</Note>
- The supervisor agent is the main contact point. It is what users interact with directly from the chat interface. It coordinates with other agents to answer users' questions comprehensively.

<img src="/images/prowler-app/lighthouse-architecture.png" alt="Lighthouse AI Architecture" />

<Note>
All agents can only read relevant security data. They cannot modify your data or access sensitive information like configured secrets or tenant details.

</Note>

## Set up

Getting started with Prowler Lighthouse AI is easy:

1. Navigate to **Configuration** → **Lighthouse AI**
2. Click **Connect** under the desired provider (OpenAI, Amazon Bedrock, or OpenAI Compatible)
3. Enter the required credentials
4. Select a default model
5. Click **Connect** to save

<Note>
For detailed configuration instructions for each provider, see [Using Multiple LLM Providers with Lighthouse](/user-guide/tutorials/prowler-app-lighthouse-multi-llm).
</Note>

<img src="/images/prowler-app/lighthouse-configuration.png" alt="Lighthouse AI Configuration" />

### Adding Business Context

The optional business context field lets you provide additional information to help Lighthouse AI understand your environment and priorities, including:

- Your organization's cloud security goals
- Information about account owners or responsible teams
- Compliance requirements for your organization
- Current security initiatives or focus areas

Better context leads to more relevant responses and prioritization that aligns with your needs.
```

--------------------------------------------------------------------------------

---[FILE: prowler-app-mute-findings.mdx]---
Location: prowler-master/docs/user-guide/tutorials/prowler-app-mute-findings.mdx

```text
---
title: 'Mute Findings (Mutelist)'
---
import { VersionBadge } from "/snippets/version-badge.mdx"

<VersionBadge version="5.9.0" />

Prowler App allows users to mute specific findings to focus on the most critical security issues. This comprehensive guide demonstrates how to effectively use the Mutelist feature to manage and prioritize security findings.

## What Is the Mutelist Feature?

The Mutelist feature enables users to:

- **Suppress specific findings** from appearing in future scans
- **Focus on critical issues** by hiding resolved or accepted risks
- **Maintain audit trails** of muted findings for compliance purposes
- **Streamline security workflows** by reducing noise from non-critical findings

## Prerequisites

Before muting findings, ensure:

- Valid access to Prowler App with appropriate permissions
- A provider added to the Prowler App
- Understanding of the security implications of muting specific findings

<Warning>
Muting findings does not resolve underlying security issues. Review each finding carefully before muting to ensure it represents an acceptable risk or has been properly addressed.

</Warning>
## Step 1: Add a provider

To configure Mutelist:

1. Log into Prowler App
2. Navigate to the providers page
![Add provider](/images/mutelist-ui-1.png)
3. Add a provider, then "Configure Muted Findings" button will be enabled in providers page and scans page
![Button enabled in providers page](/images/mutelist-ui-2.png)
![Button enabled in scans pages](/images/mutelist-ui-3.png)


## Step 2: Configure Mutelist

1. Open the modal by clicking "Configure Muted Findings" button
![Open modal](/images/mutelist-ui-4.png)
1. Provide a valid Mutelist in `YAML` format. More details about Mutelist [here](/user-guide/cli/tutorials/mutelist)
![Valid YAML configuration](/images/mutelist-ui-5.png)
If the YAML configuration is invalid, an error message will be displayed
![Wrong YAML configuration](/images/mutelist-ui-7.png)
![Wrong YAML configuration 2](/images/mutelist-ui-8.png)

## Step 3: Review the Mutelist

1. Once added, the configuration can be removed or updated
![Remove or update configuration](/images/mutelist-ui-6.png)

## Step 4: Check muted findings in the scan results

1. Run a new scan
2. Check the muted findings in the scan results
![Check muted fidings](/images/mutelist-ui-9.png)

<Note>
The Mutelist configuration takes effect on the next scans.

</Note>
## Mutelist Ready To Use Examples

Below are examples for different cloud providers supported by Prowler App. Check how the mutelist works [here](/user-guide/cli/tutorials/mutelist#how-the-mutelist-works).

### AWS Provider

#### Basic AWS Mutelist
```yaml
Mutelist:
  Accounts:
    "123456789012":
      Checks:
        "iam_user_hardware_mfa_enabled":
          Regions:
            - "us-east-1"
          Resources:
            - "user-1"
            - "user-2"
          Description: "Mute MFA findings for specific users in us-east-1"
        "s3_bucket_public_access":
          Regions:
            - "*"
          Resources:
            - "public-website-bucket"
          Description: "Mute public access findings for website bucket"
```

#### AWS Service-Wide Muting
```yaml
Mutelist:
  Accounts:
    "*":
      Checks:
        "ec2_*":
          Regions:
            - "*"
          Resources:
            - "*"
          Description: "Mute all EC2-related findings across all accounts and regions"
```

#### AWS Tag-Based Muting
```yaml
Mutelist:
  Accounts:
    "*":
      Checks:
        "*":
          Regions:
            - "*"
          Resources:
            - "*"
          Tags:
            - "environment=dev"
            - "project=test"
          Description: "Mute all findings for resources tagged with environment=dev or project=test"
```

### Azure Provider

<Note>
For Azure provider, the Account ID is the Subscription Name and the Region is the Location.

</Note>
#### Basic Azure Mutelist
```yaml
Mutelist:
  Accounts:
    "MySubscription":
      Checks:
        "storage_blob_public_access_level_is_disabled":
          Regions:
            - "East US"
            - "West US"
          Resources:
            - "publicstorageblob"
          Description: "Mute public access findings for specific blob storage resource"
        "app_function_vnet_integration_enabled":
          Regions:
            - "*"
          Resources:
            - "app-vnet-peering-*"
          Description: "Mute App Function Vnet findings related with the reources pattern"
```

#### Azure Resource Group Muting
```yaml
Mutelist:
  Accounts:
    "*":
      Checks:
        "*":
          Regions:
            - "*"
          Resources:
            - "rg-dev-*"
            - "rg-test-*"
          Tags:
            - "environment=development"
          Description: "Mute all findings for development resource groups"
```

### GCP Provider

<Note>
For GCP provider, the Account ID is the Project ID and the Region is the Zone.

</Note>
#### Basic GCP Mutelist
```yaml
Mutelist:
  Accounts:
    "my-gcp-project":
      Checks:
        "cloudstorage_bucket_public_access":
          Regions:
            - "us-central1"
            - "us-east1"
          Resources:
            - "public-bucket-*"
          Description: "Mute public access findings for specific bucket pattern"
        "compute_instance_public_ip":
          Regions:
            - "*"
          Resources:
            - "public-instance"
          Description: "Mute public access findings for specific compute instance"
```

#### GCP Project-Wide Muting
```yaml
Mutelist:
  Accounts:
    "*":
      Checks:
        "*":
          Regions:
            - "*"
          Resources:
            - "*"
          Tags:
            - "environment=staging"
          Description: "Mute all GCP findings for staging environment"
```
### Kubernetes Provider

<Note>
For Kubernetes provider, the Account ID is the Cluster Name and the Region is the Namespace.

</Note>
#### Basic Kubernetes Mutelist
```yaml
Mutelist:
  Accounts:
    "my-cluster":
      Checks:
        "etcd_client_cert_auth":
          Regions:
            - "default"
            - "kube-system"
          Resources:
            - "system-pod-*"
          Description: "Mute etcd cert authorization findings for the matching resources"
        "kubelet_tls_cert_and_key":
          Regions:
            - "*"
          Resources:
            - "*"
          Description: "Mute kubelet tls findings across all namespaces"
```

#### Kubernetes Namespace Muting
```yaml
Mutelist:
  Accounts:
    "*":
      Checks:
        "*":
          Regions:
            - "monitoring"
            - "logging"
          Resources:
            - "*"
          Description: "Mute all findings for monitoring and logging namespaces"
```

### Microsoft 365 Provider

#### Basic Microsoft 365 Mutelist
```yaml
Mutelist:
  Accounts:
    "my-tenant.onmicrosoft.com":
      Checks:
        "entra_admin_portals_access_restriction":
          Regions:
            - "*"
          Resources:
            - "test-user"
          Description: "Mute findings related with administrative roles access for test-user"
        "sharepoint_external_sharing_managed":
          Regions:
            - "*"
          Resources:
            - "public-site-*"
          Description: "Mute external sharing findings for public sites"
```

#### Microsoft 365 Tenant-Wide Muting
```yaml
Mutelist:
  Accounts:
    "*":
      Checks:
        "*":
          Regions:
            - "*"
          Resources:
            - "*"
          Tags:
            - "department=IT"
          Description: "Mute all M365 findings for IT department resources"
```

### Multi-Cloud Mutelist

You can combine multiple providers in a single mutelist configuration:

```yaml
Mutelist:
  Accounts:
    # AWS Account
    "123456789012":
      Checks:
        "s3_bucket_public_access":
          Regions:
            - "us-east-1"
          Resources:
            - "public-website"
          Description: "Mute public access findings for AWS website bucket"

    # Azure Subscription
    "MyAzureSubscription":
      Checks:
        "storage_blob_public_access_level_is_disabled":
          Regions:
            - "East US"
          Resources:
            - "public-storage"
          Description: "Mute public access findings for Azure storage account"

    # GCP Project
    "my-gcp-project":
      Checks:
        "cloudstorage_bucket_public_access":
          Regions:
            - "us-central1"
          Resources:
            - "public-bucket"
          Description: "Mute public access findings for GCP storage bucket"

    # Kubernetes Cluster
    "my-k8s-cluster":
      Checks:
        "kubelet_tls_cert_and_key":
          Regions:
            - "default"
          Resources:
            - "kubelet-test"
          Description: "Mute kubelet tls findings related with kubelet-test"

    # Microsoft 365 Tenant
    "my-tenant.onmicrosoft.com":
      Checks:
        "sharepoint_external_sharing_managed":
          Regions:
            - "*"
          Resources:
            - "public-site"
          Description: "Mute external sharing findings for public SharePoint site"
```

### Advanced Mutelist Features

#### Using Regular Expressions
```yaml
Mutelist:
  Accounts:
    "*":
      Checks:
        "*":
          Regions:
            - "*"
          Resources:
            - ".*-test-.*"        # Matches any resource containing "-test-"
            - "dev-.*"            # Matches resources starting with "dev-"
            - ".*-prod$"          # Matches resources ending with "-prod"
          Description: "Mute findings for test and development resources using regex"
```

#### Using Exceptions
```yaml
Mutelist:
  Accounts:
    "*":
      Checks:
        "*":
          Regions:
            - "*"
          Resources:
            - "*"
          Exceptions:
            Accounts:
              - "987654321098"
            Regions:
              - "us-west-2"
            Resources:
              - "critical-resource"
            Tags:
              - "environment=production"
          Description: "Mute all findings except for critical production resources"
```

#### Tag-Based Logic
```yaml
Mutelist:
  Accounts:
    "*":
      Checks:
        "*":
          Regions:
            - "*"
          Resources:
            - "*"
          Tags:
            - "environment=dev | environment=test"    # OR logic
            - "project=alpha"                      # AND logic
          Description: "Mute findings for dev/test environments in alpha project"
```

### Best Practices

1. **Start Small**: Begin with specific resources and gradually expand
2. **Document Reasons**: Always include descriptions for audit trails
3. **Regular Reviews**: Periodically review muted findings
4. **Use Tags**: Leverage resource tags for better organization
5. **Test Changes**: Validate mutelist changes in non-production environments
6. **Monitor Impact**: Track how muting affects your security posture

### Validation

Prowler App validates your mutelist configuration and will display errors for:

- Invalid YAML syntax
- Missing required fields
- Invalid regular expressions
- Unsupported provider-specific configurations
```

--------------------------------------------------------------------------------

````
