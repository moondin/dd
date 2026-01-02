---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 94
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 94 of 867)

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

---[FILE: getting-started-k8s.mdx]---
Location: prowler-master/docs/user-guide/providers/kubernetes/getting-started-k8s.mdx

```text
---
title: 'Getting Started with Kubernetes'
---

## Prowler App

### Step 1: Access Prowler Cloud/App

1. Navigate to [Prowler Cloud](https://cloud.prowler.com/) or launch [Prowler App](/user-guide/tutorials/prowler-app)
2. Go to "Configuration" > "Cloud Providers"

    ![Cloud Providers Page](/images/prowler-app/cloud-providers-page.png)

3. Click "Add Cloud Provider"

    ![Add a Cloud Provider](/images/prowler-app/add-cloud-provider.png)

4. Select "Kubernetes"

5. Enter your Kubernetes Cluster context from your kubeconfig file and optionally provide a friendly alias

### Step 2: Configure Kubernetes Authentication

For Kubernetes, Prowler App uses a `kubeconfig` file to authenticate. Paste the contents of your `kubeconfig` file into the `Kubeconfig content` field.

By default, the `kubeconfig` file is located at `~/.kube/config`.

![Kubernetes Credentials](/images/kubernetes-credentials.png)

### Step 3: Additional Setup for EKS, GKE, AKS, or External Clusters

If you are adding an **EKS**, **GKE**, **AKS** or external cluster, follow these additional steps to ensure proper authentication:

**Make sure your cluster allows traffic from the Prowler Cloud IP address `52.48.254.174/32`**

1. Apply the necessary Kubernetes resources to your EKS, GKE, AKS or external cluster (you can find the files in the [`kubernetes` directory of the Prowler repository](https://github.com/prowler-cloud/prowler/tree/master/kubernetes)):

    ```console
    kubectl apply -f kubernetes/prowler-sa.yaml
    kubectl apply -f kubernetes/prowler-role.yaml
    kubectl apply -f kubernetes/prowler-rolebinding.yaml
    ```

2. Generate a long-lived token for authentication:

    ```console
    kubectl create token prowler-sa -n prowler-ns --duration=0
    ```

    - **Security Note:** The `--duration=0` option generates a non-expiring token, which may pose a security risk if not managed properly. Choose an appropriate expiration time based on security policies. For a limited-time token, set `--duration=<TIME>` (e.g., `--duration=24h`).
    <Note>
    **Important:** If the token expires, Prowler Cloud can no longer authenticate with the cluster. Generate a new token and **remove and re-add the provider in Prowler Cloud** with the updated `kubeconfig`.
    </Note>
    <Tip>
    **Token Expiration Limits**


    When the Kubernetes cluster has `--service-account-max-token-expiration` configured, any token requested with a duration exceeding the maximum allowed value (including `--duration=0`) is automatically reduced to the cluster's maximum token expiration time. As an alternative solution, create a legacy Secret manually. Although Kubernetes no longer creates these secrets automatically, manual creation and linking to a ServiceAccount is still supported. These tokens do not expire until the secret or ServiceAccount is deleted.

      **Steps:**

      1. Create a `secret-sa.yaml` file (or any preferred name) with the following content:

         ```yaml
         apiVersion: v1
         kind: Secret
         metadata:
           name: prowler-token-long-lived
           namespace: prowler-ns
           annotations:
             kubernetes.io/service-account.name: "prowler-sa"
         type: kubernetes.io/service-account-token
         ```

      2. Apply the secret:

         ```console
         kubectl apply -f secret-sa.yaml
         ```

      3. Retrieve the token (which will be permanent):

         ```console
         kubectl get secret prowler-token-long-lived -n prowler-ns -o jsonpath='{.data.token}' | base64 --decode
         ```
     </Tip>

3. Update your `kubeconfig` to use the ServiceAccount token:

    ```console
    kubectl config set-credentials prowler-sa --token=<SA_TOKEN>
    kubectl config set-context <CONTEXT_NAME> --user=prowler-sa
    ```

    Replace `<SA_TOKEN>` with the generated token and `<CONTEXT_NAME>` with your KubeConfig Context Name of your EKS, GKE or AKS cluster.

4. Add the modified `kubeconfig` in Prowler Cloud and test the connection.

## Prowler CLI

### Non In-Cluster Execution

For execution outside the cluster environment, specify the location of the [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file using the following argument:

```console
prowler kubernetes --kubeconfig-file /path/to/kubeconfig
```

<Note>
If no `--kubeconfig-file` is provided, Prowler will use the default KubeConfig file location (`~/.kube/config`).

</Note>

<Note>
`prowler` will scan the active Kubernetes context by default. Use the [`--context`](https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/kubernetes/context/) flag to specify the context to be scanned.

</Note>

<Note>
By default, `prowler` will scan all namespaces in your active Kubernetes context. Use the [`--namespace`](https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/kubernetes/namespace/) flag to specify the namespace(s) to be scanned.

</Note>

### In-Cluster Execution

For in-cluster execution, use the supplied yaml files inside `/kubernetes`:

* [prowler-sa.yaml](https://github.com/prowler-cloud/prowler/blob/master/kubernetes/prowler-sa.yaml)
* [job.yaml](https://github.com/prowler-cloud/prowler/blob/master/kubernetes/job.yaml)
* [prowler-role.yaml](https://github.com/prowler-cloud/prowler/blob/master/kubernetes/prowler-role.yaml)
* [prowler-rolebinding.yaml](https://github.com/prowler-cloud/prowler/blob/master/kubernetes/prowler-rolebinding.yaml)

They can be used to run Prowler as a job within a new Prowler namespace:

```console
kubectl apply -f kubernetes/prowler-sa.yaml
kubectl apply -f kubernetes/job.yaml
kubectl apply -f kubernetes/prowler-role.yaml
kubectl apply -f kubernetes/prowler-rolebinding.yaml
kubectl get pods --namespace prowler-ns --> prowler-XXXXX
kubectl logs prowler-XXXXX --namespace prowler-ns
```

<Note>
By default, `prowler` will scan all namespaces in your active Kubernetes context. Use the [`--namespace`](https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/kubernetes/namespace/) flag to specify the namespace(s) to be scanned.

</Note>
<Tip>
**Identifying the cluster in reports**

When running in in-cluster mode, the Kubernetes API does not expose the actual cluster name by default.

To uniquely identify the cluster in logs and reports:

- Use the `--cluster-name` flag to manually set the cluster name:
```bash
prowler -p kubernetes --cluster-name production-cluster
```
- Or set the `CLUSTER_NAME` environment variable:
```yaml
env:
    - name: CLUSTER_NAME
      value: production-cluster
```

</Tip>
```

--------------------------------------------------------------------------------

---[FILE: misc.mdx]---
Location: prowler-master/docs/user-guide/providers/kubernetes/misc.mdx

```text
---
title: 'Miscellaneous'
---

## Context Filtering in Prowler

Prowler will scan the active Kubernetes context by default.

To specify a different Kubernetes context for scanning, use the `--context` flag followed by the desired context name, for example:

```console
prowler --context my-context
```

This ensures that Prowler analyzes the selected context or cluster for vulnerabilities and misconfigurations.

## Namespace Filtering

By default, `prowler` scans all namespaces within the specified context.

To limit the scan to specific namespaces, use the `--namespace` flag followed by the desired namespace names, separated by spaces: for example:

```console
prowler --namespace namespace1 namespace2
```

## Proxy and TLS Verification

If your Kubernetes cluster is only accessible via an internal proxy, Prowler will respect the `HTTPS_PROXY` or `https_proxy` environment variable:

```console
export HTTPS_PROXY=http://my.internal.proxy:8888
prowler kubernetes ...
```

If you need to skip TLS verification for internal proxies, you can set the `K8S_SKIP_TLS_VERIFY` environment variable:

```console
export K8S_SKIP_TLS_VERIFY=true
prowler kubernetes ...
```

This will allow Prowler to connect to the cluster even if the proxy uses a self-signed certificate.

These environment variables are supported both when using an external `kubeconfig` and in in-cluster mode.
```

--------------------------------------------------------------------------------

---[FILE: getting-started-llm.mdx]---
Location: prowler-master/docs/user-guide/providers/llm/getting-started-llm.mdx

```text
---
title: "Getting Started With LLM on Prowler"
---

## Overview

Prowler's LLM provider enables comprehensive security testing of large language models using red team techniques. It integrates with [promptfoo](https://promptfoo.dev/) to provide extensive security evaluation capabilities.

## Prerequisites

Before using the LLM provider, ensure the following requirements are met:

- **promptfoo installed**: The LLM provider requires promptfoo to be installed on the system
- **LLM API access**: Valid API keys for the target LLM models to test
- **Email verification**: promptfoo requires email verification for red team evaluations

## Installation

### Install promptfoo

Install promptfoo using one of the following methods:

**Using npm:**
```bash
npm install -g promptfoo
```

**Using Homebrew (macOS):**
```bash
brew install promptfoo
```

**Using other package managers:**
See the [promptfoo installation guide](https://promptfoo.dev/docs/installation/) for additional installation methods.

### Verify Installation

```bash
promptfoo --version
```

## Configuration

### Step 1: Email Verification

promptfoo requires email verification for red team evaluations. Set the email address:

```bash
promptfoo config set email your-email@company.com
```

### Step 2: Configure LLM API Keys

Set up API keys for the target LLM models. For OpenAI (default configuration):

```bash
export OPENAI_API_KEY="your-openai-api-key"
```

For other providers, see the [promptfoo documentation](https://promptfoo.dev/docs/providers/) for specific configuration requirements.

### Step 3: Generate Test Cases (Optional)

Prowler provides a default suite of red team tests but to customize the test cases, generate them first:

```bash
promptfoo redteam generate
```

This creates test cases based on your configuration.

## Usage

### Basic Usage

Run LLM security testing with the default configuration:

```bash
prowler llm
```

### Custom Configuration

Use a custom promptfoo configuration file:

```bash
prowler llm --config-path /path/to/your/config.yaml
```

### Output Options

Generate reports in various formats:

```bash
# JSON output
prowler llm --output-format json

# CSV output
prowler llm --output-format csv

# HTML report
prowler llm --output-format html
```

### Concurrency Control

Adjust the number of concurrent tests:

```bash
prowler llm --max-concurrency 5
```

## Default Configuration

Prowler includes a comprehensive default LLM configuration that provides:

- **Target Models**: OpenAI GPT models by default
- **Security Frameworks**:
  - OWASP LLM Top 10
  - OWASP API Top 10
  - MITRE ATLAS
  - NIST AI Risk Management Framework
  - EU AI Act compliance
- **Test Coverage**: Over 5,000 security test cases
- **Plugin Support**: Multiple security testing plugins

## Advanced Configuration

### Custom Test Suites

Create custom test configurations by modifying the promptfoo config file in `prowler/config/llm_config.yaml` or pass a custom configuration with `--config-file` flag:

```yaml
description: Custom LLM Security Tests
targets:
  - id: openai:gpt-4
redteam:
  plugins:
    - id: owasp:llm
      numTests: 10
    - id: mitre:atlas
      numTests: 5
```
```

--------------------------------------------------------------------------------

---[FILE: authentication.mdx]---
Location: prowler-master/docs/user-guide/providers/microsoft365/authentication.mdx

```text
---
title: "Microsoft 365 Authentication in Prowler"
---

Prowler for Microsoft 365 supports multiple authentication types across Prowler Cloud and Prowler CLI.

## Navigation
- [Common Setup](#common-setup)
- [Prowler Cloud Authentication](#prowler-cloud-authentication)
- [Prowler CLI Authentication](#prowler-cli-authentication)
- [Supported PowerShell Versions](#supported-powershell-versions)
- [Required PowerShell Modules](#required-powershell-modules)

## Common Setup

### Authentication Methods Overview

Prowler Cloud uses app-only authentication. Prowler CLI supports the same app-only options and two delegated flows.

**Prowler Cloud:**

- [**Application Certificate Authentication**](#application-certificate-authentication-recommended) (**Recommended**)
- [**Application Client Secret Authentication**](#application-client-secret-authentication)

**Prowler CLI:**

- [**Application Certificate Authentication**](#application-certificate-authentication-recommended) (**Recommended**)
- [**Application Client Secret Authentication**](#application-client-secret-authentication)
- [**Azure CLI Authentication**](#azure-cli-authentication)
- [**Interactive Browser Authentication**](#interactive-browser-authentication)

### Required Permissions

To run the full Prowler provider, including PowerShell checks, two types of permission scopes must be set in **Microsoft Entra ID**.

#### Application Permissions for App-Only Authentication

When using service principal authentication, add these **Application Permissions**:

**Microsoft Graph API Permissions:**

- `AuditLog.Read.All`: Required for Entra service.
- `Directory.Read.All`: Required for all services.
- `Policy.Read.All`: Required for all services.
- `SharePointTenantSettings.Read.All`: Required for SharePoint service.

**External API Permissions:**

- `Exchange.ManageAsApp` from external API `Office 365 Exchange Online`: Required for Exchange PowerShell module app authentication. The `Global Reader` role must also be assigned to the app.
- `application_access` from external API `Skype and Teams Tenant Admin API`: Required for Teams PowerShell module app authentication.

<Note>
`Directory.Read.All` can be replaced with `Domain.Read.All` for more restrictive permissions, but Entra checks related to DirectoryRoles and GetUsers will not run. If using this option, you must also add the `Organization.Read.All` permission to the application registration for authentication.

</Note>
<Note>
These permissions enable application-based authentication methods (client secret and certificate). Using certificate-based authentication is the recommended way to run the full M365 provider, including PowerShell checks.

</Note>

### Browser Authentication Permissions

When using browser authentication, permissions are delegated to the user, so the user must have the appropriate permissions rather than the application.

<Warning>
Browser and Azure CLI authentication methods limit scanning capabilities to checks that operate through Microsoft Graph API. Checks requiring PowerShell modules will not execute, as they need application-level permissions that cannot be delegated through browser authentication.

</Warning>

### Step-by-Step Permission Assignment

#### Create Application Registration

1. Access **Microsoft Entra ID**.

   ![Overview of Microsoft Entra ID](/images/providers/microsoft-entra-id.png)

2. Navigate to "Applications" > "App registrations".

   ![App Registration nav](/images/providers/app-registration-menu.png)

3. Click "+ New registration", complete the form, and click "Register".

   ![New Registration](/images/providers/new-registration.png)

4. Go to "Certificates & secrets" > "Client secrets" > "+ New client secret".

   ![Certificate & Secrets nav](/images/providers/certificates-and-secrets.png)

5. Fill in the required fields and click "Add", then copy the generated value (this will be `AZURE_CLIENT_SECRET`).

   ![New Client Secret](/images/providers/new-client-secret.png)

#### Grant Microsoft Graph API Permissions

1. Open **API permissions** for the Prowler application registration.

   ![API Permission Page](/images/providers/api-permissions-page.png)

2. Click "+ Add a permission" > "Microsoft Graph" > "Application permissions".

   ![Add API Permission](/images/providers/add-app-api-permission.png)

3. Search and select the required permissions:

   - `AuditLog.Read.All`: Required for Entra service
   - `Directory.Read.All`: Required for all services
   - `Policy.Read.All`: Required for all services
   - `SharePointTenantSettings.Read.All`: Required for SharePoint service

   ![Permission Screenshots](/images/providers/directory-permission.png)

   ![Application Permissions](/images/providers/app-permissions.png)

4. Click "Add permissions", then click "Grant admin consent for `<your-tenant-name>`".

<a id="grant-powershell-module-permissions-for-app-only-authentication"></a>
#### Grant PowerShell Module Permissions
1. **Add Exchange API:**

   - Search and select "Office 365 Exchange Online" API in **APIs my organization uses**.

   ![Office 365 Exchange Online API](/images/providers/search-exchange-api.png)

   - Select "Exchange.ManageAsApp" permission and click "Add permissions".

   ![Exchange.ManageAsApp Permission](/images/providers/exchange-permission.png)

   - Assign `Global Reader` role to the app: Go to `Roles and administrators` > click `here` for directory level assignment.

   ![Roles and administrators](/images/providers/here.png)

   - Search for `Global Reader` and assign it to the application.

   ![Global Reader Role](/images/providers/global-reader-role.png)

2. **Add Teams API:**

   - Search and select "Skype and Teams Tenant Admin API" in **APIs my organization uses**.

   ![Skype and Teams Tenant Admin API](/images/providers/search-skype-teams-tenant-admin-api.png)

   - Select "application_access" permission and click "Add permissions".

   ![application_access Permission](/images/providers/teams-permission.png)

3. Click "Grant admin consent for `<your-tenant-name>`" to grant admin consent.

   ![Grant Admin Consent](/images/providers/grant-external-api-permissions.png)

Final permissions should look like this:

![Final Permissions](/images/providers/final-permissions.png)

Use the same application registration for both Prowler Cloud and Prowler CLI while switching authentication methods as needed.

<a id="client-secret-authentication"></a>
<a id="certificate-based-authentication"></a>
## Application Certificate Authentication (Recommended)

_Available for both Prowler Cloud and Prowler CLI_

**Authentication flag for CLI:** `--certificate-auth`

Certificate-based authentication replaces the client secret with an X.509 certificate that signs Microsoft Entra ID tokens for the Prowler application registration.

This is the recommended approach for production environments because it avoids long-lived secrets, supports the full provider (including PowerShell checks), and simplifies unattended automation. Microsoft also recommends certificate credentials for app-only access, see [Manage certificates for applications](https://learn.microsoft.com/en-us/entra/identity-platform/certificate-credentials).


### Generate the Certificate

The service principal needs a certificate that contains the private key locally (for Prowler) and the public key uploaded to Microsoft Entra ID. The following commands show a secure baseline workflow on macOS or Linux using OpenSSL:

```console
# 1. Create a private key (keep this file private; do not upload it to the portal)
openssl genrsa -out prowlerm365.key 2048

# 2. Create a self-signed certificate valid for two years
openssl req -x509 -new -nodes -key prowlerm365.key -sha256 -days 730 -out prowlerm365.cer -subj "/CN=ProwlerM365Cert"

# 3. Package the key and certificate into a passwordless PFX bundle for Prowler
openssl pkcs12 -export \
  -out prowlerm365.pfx \
  -inkey prowlerm365.key \
  -in prowlerm365.cer \
  -passout pass:
```

<Warning>
Guard `prowlerm365.key` and `prowlerm365.pfx`. Only upload the `.cer` file to the Entra ID portal. Rotate or revoke the certificate before it expires or if there is any suspicion of exposure.

</Warning>

If an internal certificate authority is preferred, replace step 2 with a CSR workflow and import the signed certificate instead.

### Upload the Certificate to Microsoft Entra ID

1. Open **Microsoft Entra ID** > **App registrations** > the Prowler application.
2. Go to **Certificates & secrets** > **Certificates**.
3. Select **Upload certificate** and choose `prowlerm365.cer`.
4. Confirm the certificate appears with the expected expiration date.

After the certificate is in place, encode the PFX file so it can be stored in an environment variable (macOS/Linux example):

```console
base64 -i prowlerm365.pfx -o prowlerm365.pfx.b64
cat prowlerm365.pfx.b64 | tr -d '\n'
```

Copy the resulting single-line Base64 string (or the contents of `prowlerm365.pfx.b64`) for the next step.

### Provide the Certificate to Prowler

- **Prowler Cloud:** Paste the Base64-encoded PFX in the `certificate_content` field when configuring the Microsoft 365 provider in Prowler Cloud.
- **Prowler CLI:** Export credential variables or pass the local file path when running Prowler.

```console
export AZURE_CLIENT_ID="00000000-0000-0000-0000-000000000000"
export AZURE_TENANT_ID="11111111-1111-1111-1111-111111111111"
export M365_CERTIFICATE_CONTENT="$(base64 < prowlerm365.pfx | tr -d '\n')"
```

Store the PFX securely and reference it when running the CLI:

```console
python3 prowler-cli.py m365 --certificate-auth --certificate-path /secure/path/prowlerm365.pfx
```

The CLI still needs `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` in the environment when `--certificate-path` is used.

<Note>
Do not mix certificate authentication with a client secret. Provide either a certificate **or** a secret to the application registration and Prowler configuration.

</Note>

<a id="service-principal-authentication"></a>
<a id="service-principal-authentication-recommended"></a>
## Application Client Secret Authentication

_Available for both Prowler Cloud and Prowler CLI_

**Authentication flag for CLI:** `--sp-env-auth`

Authenticate using a **Microsoft Entra application registration with a client secret** by configuring the following environment variables:

```console
export AZURE_CLIENT_ID="XXXXXXXXX"
export AZURE_CLIENT_SECRET="XXXXXXXXX"
export AZURE_TENANT_ID="XXXXXXXXX"
```

If these variables are not set or exported, execution using `--sp-env-auth` will fail. This workflow is helpful for initial validation or temporary access. Plan to transition to certificate-based authentication to remove long-lived secrets and keep full provider coverage in unattended environments.

<Note>
To scan every M365 check, ensure the required permissions are added to the application registration. Refer to the [PowerShell Module Permissions](#grant-powershell-module-permissions-for-app-only-authentication) section for more information.

</Note>

If the external API permissions described above are not added, only checks that work through Microsoft Graph will be executed. This means that the full provider will not be executed.

## Prowler Cloud Authentication

Use the shared permissions and credentials above, then complete the Microsoft 365 provider form in Prowler Cloud. The platform persists the encrypted credentials and supplies them during scans.

### Application Certificate Authentication (Recommended)

1. Select **Application Certificate Authentication**.
2. Enter the **tenant ID** and **application (client) ID**.
3. Paste the Base64-encoded certificate content.

This method keeps all Microsoft 365 checks available, including PowerShell-based checks.

### Application Client Secret Authentication

1. Select **Application Client Secret Authentication**.
2. Enter the **tenant ID** and **application (client) ID**.
3. Enter the **client secret**.

## Prowler CLI Authentication

### Certificate Authentication

**Authentication flag for CLI:** `--certificate-auth`

After credentials are exported, launch the Microsoft 365 provider with certificate authentication:

```console
python3 prowler-cli.py m365 --certificate-auth --init-modules --log-level ERROR
```

Prowler prints the certificate thumbprint during execution so the correct credential can be verified.

### Client Secret Authentication

**Authentication flag for CLI:** `--sp-env-auth`

After exporting the secret-based variables, run:

```console
python3 prowler-cli.py m365 --sp-env-auth --init-modules --log-level ERROR
```

<a id="azure-cli-authentication"></a>
### Azure CLI Authentication

**Authentication flag for CLI:** `--az-cli-auth`

Azure CLI authentication relies on the identity that is already signed in with the Azure CLI. Before running Prowler, make sure you have an active CLI session in the target tenant:

```console
az login --tenant <TENANT_ID>
# Optional: enforce the tenant when several are available
az account set --tenant <TENANT_ID>
```

If reusing the same service principal that powers certificate-based authentication, authenticate it through Azure CLI instead of exporting environment variables. Azure CLI expects the certificate in PEM format; convert the PFX produced earlier and sign in:

```console
openssl pkcs12 -in prowlerm365.pfx -out prowlerm365.pem -nodes
az login --service-principal \
  --username <AZURE_CLIENT_ID> \
  --password /secure/path/prowlerm365.pem \
  --tenant <AZURE_TENANT_ID>
```

After the CLI session is authenticated, launch Prowler with the Azure CLI flag:

```console
python3 prowler-cli.py m365 --az-cli-auth
```

The Azure CLI identity must hold the same Microsoft Graph and external API permissions required for the full provider. Signing in with a user account limits the scan to delegated Microsoft Graph endpoints and skips PowerShell-based checks. Use a service principal with the necessary application permissions to keep complete coverage.

### Interactive Browser Authentication

**Authentication flag for CLI:** `--browser-auth`

Authenticate against Azure using the default browser to start the scan. The `--tenant-id` flag is also required.

These credentials only enable checks that rely on Microsoft Graph. The entire provider cannot be run with this method. To perform a full M365 security scan, use the **recommended authentication method**.

Since this is a **delegated permission** authentication method, necessary permissions should be assigned to the user rather than the application.

## Supported PowerShell Versions

PowerShell is required to run certain M365 checks.

**Supported versions:**

- **PowerShell 7.4 or higher** (7.5 is recommended)

#### Why Is PowerShell 7.4+ Required?

- **PowerShell 5.1** (default on some Windows systems) does not support required cmdlets.
- Older [cross-platform PowerShell versions](https://learn.microsoft.com/en-us/powershell/scripting/install/powershell-support-lifecycle?view=powershell-7.5) are **unsupported**, leading to potential errors.

<Note>
Installing PowerShell is only necessary if you install Prowler via **pip or other sources**. **SDK and API containers include PowerShell by default.**

</Note>
### Installing PowerShell

Installing PowerShell is different depending on your OS:

<Tabs>
  <Tab title="Windows">
    [Windows](https://learn.microsoft.com/es-es/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.5#install-powershell-using-winget-recommended): PowerShell must be updated to version 7.4+ for Prowler to function properly. Otherwise, some checks will not show findings and the provider may not function properly. This version of PowerShell is [supported](https://learn.microsoft.com/es-es/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4#supported-versions-of-windows) on Windows 10, Windows 11, Windows Server 2016 and higher versions.

    ```console
    winget install --id Microsoft.PowerShell --source winget
    ```

  </Tab>
  <Tab title="MacOS">
    [MacOS](https://learn.microsoft.com/es-es/powershell/scripting/install/installing-powershell-on-macos?view=powershell-7.5#install-the-latest-stable-release-of-powershell): installing PowerShell on MacOS needs to have installed [brew](https://brew.sh/), once installed, simply run the command shown above, Pwsh is only supported in macOS 15 (Sequoia) x64 and Arm64, macOS 14 (Sonoma) x64 and Arm64, macOS 13 (Ventura) x64 and Arm64

    ```console
    brew install powershell/tap/powershell
    ```

    Once it's installed run `pwsh` on your terminal to verify it's working.

  </Tab>
  <Tab title="Linux (Ubuntu)">
    [Ubuntu](https://learn.microsoft.com/es-es/powershell/scripting/install/install-ubuntu?view=powershell-7.5#installation-via-package-repository-the-package-repository): The required version for installing PowerShell +7.4 on Ubuntu are Ubuntu 22.04 and Ubuntu 24.04.
    The recommended way to install it is downloading the package available on PMC.

    Follow these steps:

    ```console
    ###################################
    # Prerequisites

    # Update the list of packages
    sudo apt-get update

    # Install pre-requisite packages.
    sudo apt-get install -y wget apt-transport-https software-properties-common

    # Get the version of Ubuntu
    source /etc/os-release

    # Download the Microsoft repository keys
    wget -q https://packages.microsoft.com/config/ubuntu/$VERSION_ID/packages-microsoft-prod.deb

    # Register the Microsoft repository keys
    sudo dpkg -i packages-microsoft-prod.deb

    # Delete the Microsoft repository keys file
    rm packages-microsoft-prod.deb

    # Update the list of packages after we added packages.microsoft.com
    sudo apt-get update

    ###################################
    # Install PowerShell
    sudo apt-get install -y powershell

    # Start PowerShell
    pwsh
    ```

  </Tab>
  <Tab title="Linux (Alpine)">
    [Alpine](https://learn.microsoft.com/es-es/powershell/scripting/install/install-alpine?view=powershell-7.5#installation-steps): The only supported version for installing PowerShell +7.4 on Alpine is Alpine 3.20. The unique way to install it is downloading the tar.gz package available on [PowerShell github](https://github.com/PowerShell/PowerShell/releases/download/v7.5.0/powershell-7.5.0-linux-musl-x64.tar.gz).

    Follow these steps:

    ```console
    # Install the requirements
    sudo apk add --no-cache \
        ca-certificates \
        less \
        ncurses-terminfo-base \
        krb5-libs \
        libgcc \
        libintl \
        libssl3 \
        libstdc++ \
        tzdata \
        userspace-rcu \
        zlib \
        icu-libs \
        curl

    apk -X https://dl-cdn.alpinelinux.org/alpine/edge/main add --no-cache \
        lttng-ust \
        openssh-client \

    # Download the powershell '.tar.gz' archive
    curl -L https://github.com/PowerShell/PowerShell/releases/download/v7.5.0/powershell-7.5.0-linux-musl-x64.tar.gz -o /tmp/powershell.tar.gz

    # Create the target folder where powershell will be placed
    sudo mkdir -p /opt/microsoft/powershell/7

    # Expand powershell to the target folder
    sudo tar zxf /tmp/powershell.tar.gz -C /opt/microsoft/powershell/7

    # Set execute permissions
    sudo chmod +x /opt/microsoft/powershell/7/pwsh

    # Create the symbolic link that points to pwsh
    sudo ln -s /opt/microsoft/powershell/7/pwsh /usr/bin/pwsh

    # Start PowerShell
    pwsh
    ```

  </Tab>
  <Tab title="Linux (Debian)">
    [Debian](https://learn.microsoft.com/es-es/powershell/scripting/install/install-debian?view=powershell-7.5#installation-on-debian-11-or-12-via-the-package-repository): The required version for installing PowerShell +7.4 on Debian are Debian 11 and Debian 12. The recommended way to install it is downloading the package available on PMC.

    Follow these steps:

    ```console
    ###################################
    # Prerequisites

    # Update the list of packages
    sudo apt-get update

    # Install pre-requisite packages.
    sudo apt-get install -y wget

    # Get the version of Debian
    source /etc/os-release

    # Download the Microsoft repository GPG keys
    wget -q https://packages.microsoft.com/config/debian/$VERSION_ID/packages-microsoft-prod.deb

    # Register the Microsoft repository GPG keys
    sudo dpkg -i packages-microsoft-prod.deb

    # Delete the Microsoft repository GPG keys file
    rm packages-microsoft-prod.deb

    # Update the list of packages after we added packages.microsoft.com
    sudo apt-get update

    ###################################
    # Install PowerShell
    sudo apt-get install -y powershell

    # Start PowerShell
    pwsh
    ```

  </Tab>
  <Tab title="Linux (RHEL)">
    [Rhel](https://learn.microsoft.com/es-es/powershell/scripting/install/install-rhel?view=powershell-7.5#installation-via-the-package-repository): The required version for installing PowerShell +7.4 on Red Hat are RHEL 8 and RHEL 9. The recommended way to install it is downloading the package available on PMC.

    Follow these steps:

    ```console
    ###################################
    # Prerequisites

    # Get version of RHEL
    source /etc/os-release
    if [ ${VERSION_ID%.*} -lt 8 ]
    then majorver=7
    elif [ ${VERSION_ID%.*} -lt 9 ]
    then majorver=8
    else majorver=9
    fi

    # Download the Microsoft RedHat repository package
    curl -sSL -O https://packages.microsoft.com/config/rhel/$majorver/packages-microsoft-prod.rpm

    # Register the Microsoft RedHat repository
    sudo rpm -i packages-microsoft-prod.rpm

    # Delete the downloaded package after installing
    rm packages-microsoft-prod.rpm

    # Update package index files
    sudo dnf update
    # Install PowerShell
    sudo dnf install powershell -y
    ```

  </Tab>
  <Tab title="Docker">
    [Docker](https://learn.microsoft.com/es-es/powershell/scripting/install/powershell-in-docker?view=powershell-7.5#use-powershell-in-a-container): The following command download the latest stable versions of PowerShell:

    ```console
    docker pull mcr.microsoft.com/dotnet/sdk:9.0
    ```

    To start an interactive shell of Pwsh you just need to run:

    ```console
    docker run -it mcr.microsoft.com/dotnet/sdk:9.0 pwsh
    ```

  </Tab>
</Tabs>
### Required PowerShell Modules

Prowler relies on several PowerShell cmdlets to retrieve necessary data.
These cmdlets come from different modules that must be installed.

#### Automatic Installation

The required modules are automatically installed when running Prowler with the `--init-modules` flag.

Example command:

```console
python3 prowler-cli.py m365 --verbose --log-level ERROR --sp-env-auth --init-modules
```

If the modules are already installed, running this command will not cause issues—it will simply verify that the necessary modules are available.

<Note>
Prowler installs the modules using `-Scope CurrentUser`.
If you encounter any issues with services not working after the automatic installation, try installing the modules manually using `-Scope AllUsers` (administrator permissions are required for this).
The command needed to install a module manually is:
```powershell
Install-Module -Name "ModuleName" -Scope AllUsers -Force
```

</Note>
#### Modules Version

- [MSAL.PS](https://www.powershellgallery.com/packages/MSAL.PS/4.32.0): Required for Exchange module via application authentication.
- [ExchangeOnlineManagement](https://www.powershellgallery.com/packages/ExchangeOnlineManagement/3.6.0) (Minimum version: 3.6.0) Required for checks across Exchange, Defender, and Purview.
- [MicrosoftTeams](https://www.powershellgallery.com/packages/MicrosoftTeams/6.6.0) (Minimum version: 6.6.0) Required for all Teams checks.
```

--------------------------------------------------------------------------------

---[FILE: getting-started-m365.mdx]---
Location: prowler-master/docs/user-guide/providers/microsoft365/getting-started-m365.mdx

```text
---
title: 'Getting Started With Microsoft 365 on Prowler'
---

<Note>
**Government Cloud Support**

Government cloud accounts or tenants (Microsoft 365 Government) are currently unsupported, but we expect to add support for them in the near future.

</Note>

## Prerequisites

Set up authentication for Microsoft 365 with the [Microsoft 365 Authentication](/user-guide/providers/microsoft365/authentication) guide before starting either path:

- Register an application in Microsoft Entra ID
- Grant the Microsoft Graph and external API permissions listed for the provider
- Generate an application certificate (recommended) or client secret
- Prepare PowerShell module permissions to enable every check

<CardGroup cols={2}>
  <Card title="Prowler Cloud" icon="cloud" href="#prowler-cloud">
    Onboard Microsoft 365 using Prowler Cloud
  </Card>
  <Card title="Prowler CLI" icon="terminal" href="#prowler-cli">
    Onboard Microsoft 365 using Prowler CLI
  </Card>
</CardGroup>

## Prowler Cloud

### Step 1: Locate the Domain ID

1. Open the Entra ID portal, then search for "Domain" or go to Identity > Settings > Domain Names.

    ![Search Domain Names](/images/providers/search-domain-names.png)

    ![Custom Domain Names](/images/providers/custom-domain-names.png)

2. Select the domain that acts as the unique identifier for the Microsoft 365 account in Prowler Cloud.

### Step 2: Open Prowler Cloud

1. Go to [Prowler Cloud](https://cloud.prowler.com/) or launch [Prowler App](/user-guide/tutorials/prowler-app).
2. Navigate to "Configuration" > "Cloud Providers".

    ![Cloud Providers Page](/images/prowler-app/cloud-providers-page.png)

3. Click "Add Cloud Provider".

    ![Add a Cloud Provider](/images/prowler-app/add-cloud-provider.png)

4. Select "Microsoft 365".

    ![Select Microsoft 365](/images/providers/select-m365-prowler-cloud.png)

5. Add the Domain ID and an optional alias, then click "Next".

    ![Add Domain ID](/images/providers/add-domain-id.png)

### Step 3: Choose and Provide Authentication

After the Domain ID is in place, select the app-only authentication option that matches the Microsoft Entra ID setup:

<img src="/images/providers/m365-auth-selection-form.png" alt="M365 authentication method selection" width="700" />

#### Application Certificate Authentication (Recommended)

1. Enter the **tenant ID**, the unique identifier for the Microsoft Entra ID directory.
2. Enter the **application (client) ID**, the identifier for the Entra application registration.
3. Upload the **certificate file content** (Base64-encoded PFX).

<img src="/images/providers/certificate-form.png" alt="M365 certificate authentication form" width="700" />

Use this method to avoid managing secrets and to unlock all Microsoft 365 checks, including the PowerShell-based ones. Full setup steps are in the [Authentication guide](/user-guide/providers/microsoft365/authentication#application-certificate-authentication-recommended).

#### Application Client Secret Authentication

1. Enter the **tenant ID**.
2. Enter the **application (client) ID**.
3. Enter the **client secret**.

<img src="/images/providers/secret-form.png" alt="M365 client secret authentication form" width="700" />

For the complete setup workflow, follow the [Authentication guide](/user-guide/providers/microsoft365/authentication#application-client-secret-authentication).

### Step 4: Launch the Scan

1. Review the summary, then click **Next**.

    ![Next Detail](/images/providers/click-next-m365.png)

2. Click **Launch Scan** to start auditing Microsoft 365.

    ![Launch Scan M365](/images/providers/launch-scan.png)

---

## Prowler CLI

### Step 1: Confirm PowerShell Coverage

PowerShell 7.4+ keeps the full Microsoft 365 coverage. Installation options are listed in the [Authentication guide](/user-guide/providers/microsoft365/authentication#supported-powershell-versions).

### Step 2: Select an Authentication Method

Choose the matching flag from the [Microsoft 365 Authentication](/user-guide/providers/microsoft365/authentication) guide:

- **Application Certificate Authentication** (recommended): `--certificate-auth`
- **Application Client Secret Authentication**: `--sp-env-auth`
- **Azure CLI Authentication**: `--az-cli-auth`
- **Interactive Browser Authentication**: `--browser-auth`

### Step 3: Run the First Scan

Run a baseline scan after credentials are configured:

```console
prowler m365 --sp-env-auth
```

### Step 4: Enable Full Coverage

Include PowerShell module initialization to run every check:

```console
prowler m365 --sp-env-auth --init-modules
```

---
```

--------------------------------------------------------------------------------

````
