---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 93
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 93 of 867)

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

---[FILE: authentication.mdx]---
Location: prowler-master/docs/user-guide/providers/gcp/authentication.mdx

```text
---
title: 'GCP Authentication in Prowler'
---

Prowler for Google Cloud supports multiple authentication methods. To use a specific method, configure the appropriate credentials during execution:

- [**User Credentials** (Application Default Credentials)](#application-default-credentials-user-credentials)
- [**Service Account Key File**](#service-account-key-file)
- [**Access Token**](#access-token)
- [**Service Account Impersonation**](#service-account-impersonation)

## Required Permissions

Prowler for Google Cloud requires the following permissions:

### IAM Roles
- **Viewer (`roles/viewer`)** – Must be granted at the **project, folder, or organization** level to allow scanning of target projects.
- **Service Usage Consumer (`roles/serviceusage.serviceUsageConsumer`)** IAM Role – Required for resource scanning.
- **Custom `ProwlerRole`** – Include granular permissions that are not included in the Viewer role:
    - `storage.buckets.getIamPolicy`

### Project-Level Settings

At least one project must have the following configurations:

- **Identity and Access Management (IAM) API (`iam.googleapis.com`)** – Must be enabled via:

    - The [Google Cloud API UI](https://console.cloud.google.com/apis/api/iam.googleapis.com/metrics), or
    - The `gcloud` CLI:
    ```sh
    gcloud services enable iam.googleapis.com --project <your-project-id>
    ```

- **Service Usage Consumer (`roles/serviceusage.serviceUsageConsumer`)** IAM Role – Required for resource scanning.

- **Quota Project Setting** – Define a quota project using either:

    - The `gcloud` CLI:
    ```sh
    gcloud auth application-default set-quota-project <project-id>
    ```
    - Setting an environment variable:
    ```sh
    export GOOGLE_CLOUD_QUOTA_PROJECT=<project-id>
    ```

<Note>
Prowler will scan the GCP project associated with the credentials.


</Note>
## Application Default Credentials (User Credentials)

This method uses the Google Cloud CLI to authenticate and is suitable for development and testing environments.

### Setup Application Default Credentials

1. In the [GCP Console](https://console.cloud.google.com/), click on "Activate Cloud Shell"

    ![Activate Cloud Shell](/images/providers/access-console.png)

2. Click "Authorize Cloud Shell"

    ![Authorize Cloud Shell](/images/providers/authorize-cloud-shell.png)

3. Run the following command:

    ```bash
    gcloud auth application-default login
    ```

    - Type `Y` when prompted

    ![Run Gcloud Auth](/images/providers/run-gcloud-auth.png)

4. Open the authentication URL provided in a browser and select your Google account

    ![Choose the account](/images/providers/take-account-email.png)

5. Follow the steps to obtain the authentication code

    ![Copy auth code](/images/providers/copy-auth-code.png)

6. Paste the authentication code back in Cloud Shell

    ![Enter Auth Code](/images/providers/enter-auth-code.png)

7. Use `cat <file_name>` to view the temporary credentials file

    ![Get the FileName](/images/providers/get-temp-file-credentials.png)

8. Extract the following values for Prowler Cloud/App:

    - `client_id`
    - `client_secret`
    - `refresh_token`

    ![Get the values](/images/providers/get-needed-values-auth.png)

### Using with Prowler CLI

Once application default credentials are set up, run Prowler directly:

```console
prowler gcp --project-ids <project-id>
```

## Service Account Key File

This method uses a service account with a downloaded key file for authentication.

### Step 1: Create ProwlerRole

To keep permissions focused:
1. Create a custom role named **ProwlerRole** that explicitly includes the permissions your compliance team approves. Click **Create role**, set the title to *ProwlerRole*, keep the ID readable (for example, `prowler_role`)
2. Add the required permission `storage.buckets.getIamPolicy` (the permission highlighted in the screenshots). To make it easier, filter the permissions by `Storage Admin` role.

![Create a custom Prowler role](/user-guide/providers/gcp/img/roles-section.png)

![Sample permissions for a custom Prowler role](/user-guide/providers/gcp/img/prowler-role.png)

### Step 2: Create the Service Account

1. Navigate to **IAM & Admin > Service Accounts** and make sure the correct project is selected.

    ![Service accounts landing page](/user-guide/providers/gcp/img/service-account-page.png)

2. Select **Create service account**, provide a name, ID, and a short description that states the purpose (for example, “Service account to execute Prowler”), then click **Create and continue**.

    ![Create service account wizard](/user-guide/providers/gcp/img/create-service-account.png)

3. Assign the roles you prepared earlier:
    - **ProwlerRole** for `cloudstorage` service checks.
    - **Viewer** for broad read-only visibility.
    - **Service Usage Consumer** so Prowler can inspect API states.

    ![Assign roles to the service account](/user-guide/providers/gcp/img/service-account-permissions.png)

4. Continue through the wizard and finish. No principals need to be granted access in step 3 unless you want other identities to impersonate this account.

### Step 3: Generate a JSON Key

1. Open the newly created service account, move to the **Keys** tab, and choose **Add key > Create new key**.

    ![Add a new key to the service account](/user-guide/providers/gcp/img/create-new-key.png)

2. Select **JSON** as the key type and click **Create**. The browser downloads the file exactly once.

    ![Select JSON as the key type](/user-guide/providers/gcp/img/json-key.png)

3. Once created, make sure to store the Key securely.

### Using with Prowler CLI

Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable:

```console
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
prowler gcp --project-ids <project-id>
```

## Access Token

For existing access tokens (e.g., generated with `gcloud auth print-access-token`), run Prowler with:

```bash
export CLOUDSDK_AUTH_ACCESS_TOKEN=$(gcloud auth print-access-token)
prowler gcp --project-ids <project-id>
```

<Note>
When using this method, also set the default project explicitly:
```bash
export GOOGLE_CLOUD_PROJECT=<project-id>
```

</Note>
## Service Account Impersonation

To impersonate a GCP service account, use the `--impersonate-service-account` argument followed by the service account email:

```console
prowler gcp --impersonate-service-account <service-account-email>
```

This command leverages the default credentials to impersonate the specified service account.

### Prerequisites for Impersonation

The identity running Prowler must have the following permission on the target service account:

- `roles/iam.serviceAccountTokenCreator`

Or the more specific permission:

- `iam.serviceAccounts.generateAccessToken`
```

--------------------------------------------------------------------------------

---[FILE: getting-started-gcp.mdx]---
Location: prowler-master/docs/user-guide/providers/gcp/getting-started-gcp.mdx

```text
---
title: 'Getting Started With GCP on Prowler'
---

## Prowler App

### Step 1: Get the GCP Project ID

1. Go to the [GCP Console](https://console.cloud.google.com/)
2. Locate the Project ID on the welcome screen

![Get the Project ID](/images/providers/project-id-console.png)

### Step 2: Access Prowler Cloud or Prowler App

1. Navigate to [Prowler Cloud](https://cloud.prowler.com/) or launch [Prowler App](/user-guide/tutorials/prowler-app)
2. Go to "Configuration" > "Cloud Providers"

    ![Cloud Providers Page](/images/prowler-app/cloud-providers-page.png)

3. Click "Add Cloud Provider"

    ![Add a Cloud Provider](/images/prowler-app/add-cloud-provider.png)

4. Select "Google Cloud Platform"

    ![Select GCP](/images/providers/select-gcp.png)

5. Add the Project ID and optionally provide a provider alias, then click "Next"

    ![Add Project ID](/images/providers/add-project-id.png)

### Step 3: Set Up GCP Authentication

For Google Cloud, first enter your `GCP Project ID` and then select the authentication method you want to use:

- **Service Account Authentication** (**Recommended**)
    * Authenticates as a service identity
    * Stable and auditable
    * Recommended for production
- **Application Default Credentials**
    * Quick scan as current user
    * Uses Google Cloud CLI authentication
    * Credentials may time out

**Service Account Authentication** is the recommended authentication method for automated systems and machine-to-machine interactions, like Prowler. For detailed information about this, refer to the [Google Cloud documentation](https://cloud.google.com/iam/docs/service-account-overview).

<img src="/images/prowler-app/gcp-auth-methods.png" alt="GCP Authentication Methods" width="700" />

<Tabs>
  <Tab title="Service Account Authentication">
    First of all, in the same project that you selected in the previous step, you need to create a service account and then generate a key in JSON format for it. For more information about this, you can follow the next Google Cloud documentation tutorials:

    - [Create a service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts)
    - [Generate a key for a service account](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)

    <img src="/images/prowler-app/gcp-service-account-creds.png" alt="GCP Service Account Credentials" width="700" />
     For detailed instructions on how to setup Service Account authentication, see the [Authentication](/user-guide/providers/gcp/authentication#service-account-authentication) page.
  </Tab>
  <Tab title="Application Default Credentials">
    1. Run the following command in your terminal to authenticate with GCP:

    ```bash
    gcloud auth application-default login
    ```

    2. Once authenticated, get the `Client ID`, `Client Secret` and `Refresh Token` from `~/.config/gcloud/application_default_credentials`.

    3. Paste the `Client ID`, `Client Secret` and `Refresh Token` into Prowler App.

    <img src="/images/gcp-credentials.png" alt="GCP Credentials" width="700" />

  </Tab>
</Tabs>


7. Click "Next", then "Launch Scan"

    ![Launch Scan GCP](./img/launch-scan.png)

---

## Prowler CLI

### Credentials Lookup Order

Prowler follows the same credential search process as [Google authentication libraries](https://cloud.google.com/docs/authentication/application-default-credentials#search_order), checking credentials in this order:

1. [`GOOGLE_APPLICATION_CREDENTIALS` environment variable](https://cloud.google.com/docs/authentication/application-default-credentials#GAC)
2. [`CLOUDSDK_AUTH_ACCESS_TOKEN` + optional `GOOGLE_CLOUD_PROJECT`](https://cloud.google.com/sdk/gcloud/reference/auth/print-access-token)
3. [User credentials set up by using the Google Cloud CLI](https://cloud.google.com/docs/authentication/application-default-credentials#personal)
4. [Attached service account (e.g., Cloud Run, GCE, Cloud Functions)](https://cloud.google.com/docs/authentication/application-default-credentials#attached-sa)

<Note>
The credentials must belong to a user or service account with the necessary permissions.
For detailed instructions on how to set the permissions, see [Authentication > Required Permissions](/user-guide/providers/gcp/authentication#required-permissions).

</Note>
<Note>
Prowler will use the enabled Google Cloud APIs to get the information needed to perform the checks.

</Note>
### Configure GCP Credentials

To authenticate with GCP, use one of the following methods:

```console
gcloud auth application-default login
```

or set the credentials file path:

```console
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
```

These credentials must belong to a user or service account with the necessary permissions to perform security checks.

For more authentication details, see the [Authentication](/user-guide/providers/gcp/authentication) page.

### Project Specification

To scan specific projects, specify them with the following command:

```console
prowler gcp --project-ids <project-id-1> <project-id-2>
```

### Service Account Impersonation

For service account impersonation, use the `--impersonate-service-account` flag:

```console
prowler gcp --impersonate-service-account <service-account-email>
```

More details on authentication methods in the [Authentication](/user-guide/providers/gcp/authentication) page.
```

--------------------------------------------------------------------------------

---[FILE: organization.mdx]---
Location: prowler-master/docs/user-guide/providers/gcp/organization.mdx

```text
---
title: 'Scanning a Specific GCP Organization'
---

By default, Prowler scans all Google Cloud projects accessible to the authenticated user.

To limit the scan to projects within a specific Google Cloud organization, use the `--organization-id` option with the GCP organization’s ID:

```console
prowler gcp --organization-id organization-id
```

<Warning>
Ensure the credentials used have one of the following roles at the organization level:
Cloud Asset Viewer (`roles/cloudasset.viewer`), or Cloud Asset Owner (`roles/cloudasset.owner`).

</Warning>
<Note>
With this option, Prowler retrieves all projects under the specified Google Cloud organization, including those organized within folders and nested subfolders. This ensures full visibility across the entire organization’s hierarchy.

</Note>
<Note>
To obtain the Google Cloud organization ID, use:

```console
gcloud organizations list
```

</Note>
```

--------------------------------------------------------------------------------

---[FILE: projects.mdx]---
Location: prowler-master/docs/user-guide/providers/gcp/projects.mdx

```text
---
title: 'GCP Project Scanning in Prowler'
---

By default, Prowler operates in a multi-project mode, scanning all Google Cloud projects accessible to the authenticated user.

## Specifying Projects

To limit the scan to specific projects, use the `--project-ids` argument followed by the desired project ID(s).

```console
prowler gcp --project-ids project-id1 project-id2
```

### Pattern-Based Project Selection

Use an asterisk `*` to scan projects that match a pattern. For example, `prowler gcp --project-ids "prowler*"` will scan all the projects that start with `prowler`.

### Listing Accessible Projects

To view a list of projects the user has access to, run:

```console
prowler gcp --list-project-ids
```

### Excluding Projects in Prowler

#### Project Exclusion

To exclude specific Google Cloud projects from the scan, use the `--excluded-project-ids` argument followed by the project ID(s):

```console
prowler gcp --excluded-project-ids project-id1 project-id2
```

#### Pattern-Based Project Exclusion

Use an asterisk `*` to exclude projects that match a pattern. For example, `prowler gcp --excluded-project-ids "sys*"` will exclude all the projects that start with `sys`.
```

--------------------------------------------------------------------------------

---[FILE: retry-configuration.mdx]---
Location: prowler-master/docs/user-guide/providers/gcp/retry-configuration.mdx

```text
---
title: "GCP Retry Configuration in Prowler"
---

Prowler's GCP Provider uses Google Cloud Python SDK's integrated retry mechanism to automatically retry API calls when encountering rate limiting errors (HTTP 429).

## Quick Configuration

### Using Command Line Flag (Recommended)
```bash
prowler gcp --gcp-retries-max-attempts 5
```

### Using Configuration File
Modify `prowler/providers/gcp/config.py`:
```python
DEFAULT_RETRY_ATTEMPTS = 5  # Default: 3
```

## How It Works

- **Automatic Detection**: Handles HTTP 429 and quota exceeded errors
- **Exponential Backoff**: Each retry uses randomized exponential backoff
- **Centralized Config**: All GCP services use the same retry configuration
- **Transparent**: No additional code needed in services

## Error Examples Handled

```
HttpError 429 when requesting https://cloudresourcemanager.googleapis.com/v1/projects/vms-uat-eiger:getIamPolicy?alt=json returned "Quota exceeded for quota metric 'Read requests' and limit 'Read requests per minute'"
```

## Implementation

### Client-Level Configuration
```python
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS

client = discovery.build(
    service, version, credentials=credentials,
    num_retries=DEFAULT_RETRY_ATTEMPTS
)
```

### Request-Level Configuration
```python
response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
```

## Services with Retry Support

All major GCP services are covered:
- Cloud Resource Manager, Compute Engine, IAM
- BigQuery, KMS, Cloud Storage, Monitoring
- DNS, Logging, Cloud SQL, GKE, API Keys, DataProc

## Validation

### Debug Logging
```bash
prowler gcp --log-level DEBUG --log-file debuglogs.txt --project-id your-project-id
```

### Check for Retry Messages
```bash
grep -i "sleeping\|retry\|quota exceeded" debuglogs.txt
```

### Expected Output
```
"Sleeping 1.52 seconds before retry 1 of 3"
"Sleeping 3.23 seconds before retry 2 of 3"
```

## Testing in Real Environment

1. **Reduce API Quotas** in GCP Console:
   - APIs & Services > Quotas
   - Reduce "Read requests per minute" for Compute Engine API
   - Reduce "Policy Read Requests per minute" for IAM API

2. **Run Prowler** with debug logging
3. **Monitor logs** for retry messages

## Troubleshooting

If experiencing rate limiting:
1. Use `--gcp-retries-max-attempts` flag to increase attempts
2. Request quota increases from Google Cloud support
3. Optimize scanning to reduce simultaneous API calls
4. Verify retry functionality with debug logging

## Official References

- [Google Cloud Python Client Libraries](https://cloud.google.com/python/docs)
- [Google Cloud Quotas](https://cloud.google.com/docs/quotas)
- [Google API Core Retry](https://googleapis.dev/python/google-api-core/latest/retry.html)
```

--------------------------------------------------------------------------------

---[FILE: authentication.mdx]---
Location: prowler-master/docs/user-guide/providers/github/authentication.mdx

```text
---
title: 'GitHub Authentication in Prowler'
---

Prowler supports multiple methods to [authenticate with GitHub](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api). These include:

- [Personal Access Token (PAT)](/user-guide/providers/github/authentication#personal-access-token-pat)
- [OAuth App Token](/user-guide/providers/github/authentication#oauth-app-token)
- [GitHub App Credentials](/user-guide/providers/github/authentication#github-app-credentials)

This flexibility enables scanning and analysis of GitHub accounts, including repositories, organizations, and applications, using the method that best suits the use case.

## Personal Access Token (PAT)

Personal Access Tokens provide the simplest GitHub authentication method, but it can only access resources owned by a single user or organization.

<Warning>
**Classic Tokens Deprecated**

GitHub has deprecated Personal Access Tokens (classic) in favor of fine-grained Personal Access Tokens. We recommend using fine-grained tokens as they provide better security through more granular permissions and resource-specific access control.

</Warning>
#### **Option 1: Create a Fine-Grained Personal Access Token (Recommended)**

1. **Navigate to GitHub Settings**
    - Open [GitHub](https://github.com) and sign in
    - Click the profile picture in the top right corner
    - Select "Settings" from the dropdown menu

2. **Access Developer Settings**
    - Scroll down the left sidebar
    - Click "Developer settings"

3. **Generate Fine-Grained Token**
    - Click "Personal access tokens"
    - Select "Fine-grained tokens"
    - Click "Generate new token"

4. **Configure Token Settings**
    - **Token name**: Give your token a descriptive name (e.g., "Prowler Security Scanner")
    - **Expiration**: Set an appropriate expiration date (recommended: 90 days or less)
    - **Repository access**: Choose "All repositories" or "Only select repositories" based on your needs

    <Note>
    **Public repositories**

        Even if you select 'Only select repositories', the token will have access to the public repositories that you own or are a member of.

    </Note>
5. **Configure Token Permissions**
    To enable Prowler functionality, configure the following permissions:

    - **Repository permissions:**
        - **Administration**: Read-only access
        - **Contents**: Read-only access
        - **Metadata**: Read-only access
        - **Pull requests**: Read-only access

    - **Organization permissions:**
        - **Administration**: Read-only access
        - **Members**: Read-only access

    - **Account permissions:**
        - **Email addresses**: Read-only access

6. **Copy and Store the Token**
    - Copy the generated token immediately (GitHub displays tokens only once)
    - Store tokens securely using environment variables

![GitHub Personal Access Token Permissions](/images/providers/github-pat-permissions.png)

#### **Option 2: Create a Classic Personal Access Token (Not Recommended)**

<Warning>
**Security Risk**

Classic tokens provide broad permissions that may exceed what Prowler actually needs. Use fine-grained tokens instead for better security.

</Warning>
1. **Navigate to GitHub Settings**
    - Open [GitHub](https://github.com) and sign in
    - Click the profile picture in the top right corner
    - Select "Settings" from the dropdown menu

2. **Access Developer Settings**
    - Scroll down the left sidebar
    - Click "Developer settings"

3. **Generate Classic Token**
    - Click "Personal access tokens"
    - Select "Tokens (classic)"
    - Click "Generate new token"

4. **Configure Token Permissions**
    To enable Prowler functionality, configure the following scopes:
    - `repo`: Full control of private repositories (includes `repo:status` and `repo:contents`)
    - `read:org`: Read organization and team membership
    - `read:user`: Read user profile data
    - `security_events`: Access security events (secret scanning and Dependabot alerts)
    - `read:enterprise`: Read enterprise data (if using GitHub Enterprise)

5. **Copy and Store the Token**
    - Copy the generated token immediately (GitHub displays tokens only once)
    - Store tokens securely using environment variables

## OAuth App Token

OAuth Apps enable applications to act on behalf of users with explicit consent.

### Create an OAuth App Token

1. **Navigate to Developer Settings**
    - Open GitHub Settings → Developer settings
    - Click "OAuth Apps"

2. **Register New Application**
    - Click "New OAuth App"
    - Complete the required fields:
        - **Application name**: Descriptive application name
        - **Homepage URL**: Application homepage
        - **Authorization callback URL**: User redirection URL after authorization

3. **Obtain Authorization Code**
    - Request authorization code (replace `{app_id}` with the application ID):
   ```
   https://github.com/login/oauth/authorize?client_id={app_id}
   ```

4. **Exchange Code for Token**
    - Exchange authorization code for access token (replace `{app_id}`, `{secret}`, and `{code}`):
   ```
   https://github.com/login/oauth/access_token?code={code}&client_id={app_id}&client_secret={secret}
   ```

## GitHub App Credentials
GitHub Apps provide the recommended integration method for accessing multiple repositories or organizations.

### Create a GitHub App

1. **Navigate to Developer Settings**
    - Open GitHub Settings → Developer settings
    - Click "GitHub Apps"

2. **Create New GitHub App**
    - Click "New GitHub App"
    - Complete the required fields:
        - **GitHub App name**: Choose a unique, descriptive name (e.g., "Prowler Security Scanner")
        - **Homepage URL**: Enter your organization's website or the Prowler documentation URL (e.g., `https://prowler.com` or `https://docs.prowler.com`). This is just for reference and doesn't affect functionality.
        - **Webhook URL**: Leave blank or uncheck "Active" under Webhook. Prowler doesn't require webhooks since it performs on-demand scans rather than responding to GitHub events.
        - **Webhook secret**: Leave blank (not needed for Prowler)
        - **Permissions**: Configure in the next step (see below)

    <Note>
    **About Homepage URL and Webhooks**

    The Homepage URL is purely informational and can be any valid URL - it's just displayed to users who view the app. Use your company website, your GitHub organization URL, or even `https://docs.prowler.com`.

    Webhooks are **not required** for Prowler. Since Prowler performs on-demand security scans when you run it (rather than automatically responding to GitHub events), you can safely disable webhooks or leave the URL blank.
    </Note>

3. **Configure Permissions**
    To enable Prowler functionality, configure these permissions:
    - **Repository permissions**:
        - Contents (Read)
        - Metadata (Read)
        - Pull requests (Read)
    - **Organization permissions**:
        - Members (Read)
        - Administration (Read)
    - **Account permissions**:
        - Email addresses (Read)

4. **Where can this GitHub App be installed?**
    - Select "Any account" to be able to install the GitHub App in any organization.

5. **Generate Private Key**
    - Scroll to the "Private keys" section after app creation
    - Click "Generate a private key"
    - Download the `.pem` file and store securely

5. **Record App ID**
    - Locate the App ID at the top of the GitHub App settings page

### Install the GitHub App

1. **Install Application**
    - Navigate to GitHub App settings
    - Click "Install App" in the left sidebar
    - Select the target account/organization
    - Choose specific repositories or select "All repositories"

## Best Practices

### Security Considerations

Implement the following security measures:

- **Secure Credential Storage**: Store credentials using environment variables instead of hardcoding tokens
- **Secrets Management**: Use dedicated secrets management systems in production environments
- **Regular Token Rotation**: Rotate tokens and keys regularly
- **Least Privilege Principle**: Grant only minimum required permissions
- **Permission Auditing**: Review and audit permissions regularly
- **Token Expiration**: Set appropriate expiration times for tokens
- **Usage Monitoring**: Monitor token usage and revoke unused tokens

### Authentication Method Selection

Choose the appropriate method based on use case:

- **Personal Access Token**: Individual use, testing, or simple automation
- **OAuth App Token**: Applications requiring user consent and delegation
- **GitHub App**: Production integrations, especially for organizations

## Troubleshooting Common Issues

### Insufficient Permissions
- Verify token/app has necessary scopes/permissions
- Check organization restrictions on third-party applications

### Token Expiration
- Confirm token has not expired
- Verify fine-grained tokens have correct resource access

### Rate Limiting
- GitHub implements API call rate limits
- Consider GitHub Apps for higher rate limits

### Organization Settings
- Some organizations restrict third-party applications
- Contact organization administrator if access is denied
```

--------------------------------------------------------------------------------

---[FILE: getting-started-github.mdx]---
Location: prowler-master/docs/user-guide/providers/github/getting-started-github.mdx

```text
---
title: 'Getting Started with GitHub'
---

## Prowler App

<iframe width="560" height="380" src="https://www.youtube-nocookie.com/embed/9ETI84Xpu2g" title="Prowler Cloud Onboarding Github" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="1"></iframe>

> Walkthrough video onboarding a GitHub Account using GitHub App.

### Step 1: Access Prowler Cloud/App

1. Navigate to [Prowler Cloud](https://cloud.prowler.com/) or launch [Prowler App](/user-guide/tutorials/prowler-app)
2. Go to "Configuration" > "Cloud Providers"

    ![Cloud Providers Page](/images/prowler-app/cloud-providers-page.png)

3. Click "Add Cloud Provider"

    ![Add a Cloud Provider](/images/prowler-app/add-cloud-provider.png)

4. Select "GitHub"

    ![Select GitHub](/images/providers/select-github.png)

5. Add the GitHub Account ID (username or organization name) and an optional alias, then click "Next"

    ![Add GitHub Account ID](/images/providers/add-github-account-id.png)

### Step 2: Choose the preferred authentication method

6. Choose the preferred authentication method:

    ![Select auth method](/images/providers/select-auth-method.png)

7. Configure the authentication method:

<Tabs>
  <Tab title="Personal Access Token">
    ![Configure Personal Access Token](/images/providers/auth-pat.png)

    For more details on how to create a Personal Access Token, see [Authentication > Personal Access Token](/user-guide/providers/github/authentication#personal-access-token-pat).
  </Tab>
  <Tab title="OAuth App Token">
    ![Configure OAuth App Token](/images/providers/auth-oauth.png)

    For more details on how to create an OAuth App Token, see [Authentication > OAuth App Token](/user-guide/providers/github/authentication#oauth-app-token).
  </Tab>
  <Tab title="GitHub App">
    ![Configure GitHub App](/images/providers/auth-github-app.png)

    For more details on how to create a GitHub App, see [Authentication > GitHub App](/user-guide/providers/github/authentication#github-app-credentials).
  </Tab>
</Tabs>
## Prowler CLI

### Automatic Login Method Detection

If no login method is explicitly provided, Prowler will automatically attempt to authenticate using environment variables in the following order of precedence:

1. `GITHUB_PERSONAL_ACCESS_TOKEN`
2. `GITHUB_OAUTH_APP_TOKEN`
3. `GITHUB_APP_ID` and `GITHUB_APP_KEY` (where the key is the content of the private key file)

<Note>
Ensure the corresponding environment variables are set up before running Prowler for automatic detection when not specifying the login method.

</Note>
For more details on how to set up authentication with GitHub, see [Authentication > GitHub](/user-guide/providers/github/authentication).

### Personal Access Token (PAT)

Use this method by providing your personal access token directly.

```console
prowler github --personal-access-token pat
```

### OAuth App Token

Authenticate using an OAuth app token.

```console
prowler github --oauth-app-token oauth_token
```

### GitHub App Credentials
Use GitHub App credentials by specifying the App ID and the private key path.

```console
prowler github --github-app-id app_id --github-app-key-path app_key_path
```
```

--------------------------------------------------------------------------------

---[FILE: authentication.mdx]---
Location: prowler-master/docs/user-guide/providers/iac/authentication.mdx

```text
---
title: "IaC Authentication in Prowler"
---

Prowler's Infrastructure as Code (IaC) provider enables you to scan local or remote infrastructure code for security and compliance issues using [Trivy](https://trivy.dev/). This provider supports a wide range of IaC frameworks and requires no cloud authentication for local scans.

### Authentication

- For local scans, no authentication is required.
- For remote repository scans, authentication can be provided via:
    - [**GitHub Username and Personal Access Token (PAT)**](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)
    - [**GitHub OAuth App Token**](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)
    - [**Git URL**](https://git-scm.com/docs/git-clone#_git_urls)
```

--------------------------------------------------------------------------------

---[FILE: getting-started-iac.mdx]---
Location: prowler-master/docs/user-guide/providers/iac/getting-started-iac.mdx

```text
---
title: "Getting Started with the IaC Provider"
---
import { VersionBadge } from "/snippets/version-badge.mdx"

Prowler's Infrastructure as Code (IaC) provider enables scanning of local or remote infrastructure code for security and compliance issues using [Trivy](https://trivy.dev/). This provider supports a wide range of IaC frameworks, allowing assessment of code before deployment.

## Supported IaC Formats

Prowler IaC provider scans the following Infrastructure as Code configurations for misconfigurations and secrets:

| Configuration Type | File Patterns                                |
|--------------------|----------------------------------------------|
| Kubernetes         | `*.yml`, `*.yaml`, `*.json`                  |
| Docker             | `Dockerfile`, `Containerfile`                |
| Terraform          | `*.tf`, `*.tf.json`, `*.tfvars`              |
| Terraform Plan     | `tfplan`, `*.tfplan`, `*.json`               |
| CloudFormation     | `*.yml`, `*.yaml`, `*.json`                  |
| Azure ARM Template | `*.json`                                     |
| Helm               | `*.yml`, `*.yaml`, `*.tpl`, `*.tar.gz`, etc. |
| YAML               | `*.yaml`, `*.yml`                            |
| JSON               | `*.json`                                     |
| Ansible            | `*.yml`, `*.yaml`, `*.json`, `*.ini`, without extension |

## How It Works

- Prowler App leverages [Trivy](https://trivy.dev/docs/latest/guide/coverage/iac/#scanner) to scan local directories (or specified paths) for supported IaC files, or scans remote repositories.
- No cloud credentials or authentication are required for local scans.
- For remote repository scans, authentication can be provided via [git URL](https://git-scm.com/docs/git-clone#_git_urls), CLI flags or environment variables.
  - Check the [IaC Authentication](/user-guide/providers/iac/authentication) page for more details.
- Mutelist logic ([filtering](https://trivy.dev/latest/docs/configuration/filtering/)) is handled by Trivy, not Prowler.
- Results are output in the same formats as other Prowler providers (CSV, JSON, HTML, etc.).

## Prowler App

<VersionBadge version="5.14.0" />

### Supported Scanners

Scanner selection is not configurable in Prowler App. Default scanners, misconfig and secret, run automatically during each scan.

### Step 1: Access Prowler Cloud/App

1. Navigate to [Prowler Cloud](https://cloud.prowler.com/) or launch [Prowler App](/user-guide/tutorials/prowler-app)
2. Go to "Configuration" > "Cloud Providers"

    ![Cloud Providers Page](/images/prowler-app/cloud-providers-page.png)

3. Click "Add Cloud Provider"

    ![Add a Cloud Provider](/images/prowler-app/add-cloud-provider.png)

4. Select "Infrastructure as Code"

    ![Select Infrastructure as Code](/images/providers/select-iac.png)

5. Add the Repository URL and an optional alias, then click "Next"

    ![Add IaC Repository URL](/images/providers/add-iac-repo.png)

### Step 2: Enter Authentication Details

6. Optionally provide the [authentication](/user-guide/providers/iac/authentication) details for private repositories, then click "Next"

    ![IaC Authentication](/images/providers/iac-authentication.png)

### Step 3: Verify Connection & Start Scan

7. Review the provider configuration and click "Launch scan" to initiate the scan

    ![Verify Connection & Start Scan](/images/providers/iac-verify-connection.png)


## Prowler CLI

<VersionBadge version="5.8.0" />

### Supported Scanners

Prowler CLI supports the following scanners:

- [Vulnerability](https://trivy.dev/docs/latest/guide/scanner/vulnerability/)
- [Misconfiguration](https://trivy.dev/docs/latest/guide/scanner/misconfiguration/)
- [Secret](https://trivy.dev/docs/latest/guide/scanner/secret/)
- [License](https://trivy.dev/docs/latest/guide/scanner/license/)

By default, only misconfiguration and secret scanners run during a scan. To specify which scanners to use, refer to the [Specify Scanners](#specify-scanners) section below.

### Usage

Use the `iac` argument to run Prowler with the IaC provider. Specify the directory or repository to scan, frameworks to include, and paths to exclude.

#### Scan a Local Directory (default)

```sh
prowler iac --scan-path ./my-iac-directory
```

#### Scan a Remote GitHub Repository

```sh
prowler iac --scan-repository-url https://github.com/user/repo.git
```

##### Authentication for Remote Private Repositories

Authentication for private repositories can be provided using one of the following methods:

- **GitHub Username and Personal Access Token (PAT):**
  ```sh
  prowler iac --scan-repository-url https://github.com/user/repo.git \
    --github-username <username> --personal-access-token <token>
  ```
- **GitHub OAuth App Token:**
  ```sh
  prowler iac --scan-repository-url https://github.com/user/repo.git \
    --oauth-app-token <oauth_token>
  ```
- If not provided via CLI, the following environment variables will be used (in order of precedence):
    - `GITHUB_OAUTH_APP_TOKEN`
    - `GITHUB_USERNAME` and `GITHUB_PERSONAL_ACCESS_TOKEN`
- If neither CLI flags nor environment variables are set, the scan will attempt to clone without authentication or using the credentials provided in the [git URL](https://git-scm.com/docs/git-clone#_git_urls).

##### Mutually Exclusive Flags
- `--scan-path` and `--scan-repository-url` are mutually exclusive. Only one can be specified at a time.

#### Specify Scanners

To run only specific scanners, use the `--scanners` flag. For example, to scan only for vulnerabilities and misconfigurations:

```sh
prowler iac --scan-path ./my-iac-directory --scanners vuln misconfig
```

#### Exclude Paths

```sh
prowler iac --scan-path ./my-iac-directory --exclude-path ./my-iac-directory/test,./my-iac-directory/examples
```

### Output

Use the standard Prowler output options, for example:

```sh
prowler iac --scan-path ./iac --output-formats csv json html
```
```

--------------------------------------------------------------------------------

````
