---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 95
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 95 of 867)

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

---[FILE: use-of-powershell.mdx]---
Location: prowler-master/docs/user-guide/providers/microsoft365/use-of-powershell.mdx

```text
---
title: 'Installing PowerShell'
---

PowerShell is required by this provider because it is the only way to retrieve data from certain Microsoft 365 services.

## Installing PowerShell

If you are using Prowler Cloud, you don't need to worry about PowerShell — it is already installed in our infrastructure.
However, if you want to run Prowler on your own, you must have PowerShell installed to execute the full M365 provider and retrieve all findings.
To learn more about how to install PowerShell and which versions are supported, click [here](/user-guide/providers/microsoft365/authentication#supported-powershell-versions).

## Required Modules

The necessary modules will not be installed automatically by Prowler. Nevertheless, if you want Prowler to install them for you, you can execute the provider with the flag `--init-modules`, which will run the script to install and import them.
If you want to learn more about this process or you are running some issues with this, click [here](/user-guide/providers/microsoft365/authentication#required-powershell-modules).
```

--------------------------------------------------------------------------------

---[FILE: authentication.mdx]---
Location: prowler-master/docs/user-guide/providers/mongodbatlas/authentication.mdx

```text
---
title: 'MongoDB Atlas Authentication'
---

MongoDB Atlas provider uses [HTTP Digest Authentication with API key pairs consisting of a public key and private key](https://www.mongodb.com/docs/atlas/configure-api-access/#grant-programmatic-access-to-service).


## Required Permissions

MongoDB Atlas API keys require appropriate permissions to perform security checks:

- **Organization Read Only**: Provides read-only access to everything in the organization, including all projects in the organization.
    - To [audit the Auditing configuration for the project](https://www.mongodb.com/docs/api/doc/atlas-admin-api-v2/group/endpoint-auditing), **Organization Owner** permission is required.

The IP address where Prowler runs must be added to the IP Access List of the MongoDB Atlas organization API key. To skip this step and use the API key across all IP address types, uncheck the "Require IP Access List for the Atlas Administration API" button in Organization Settings. This setting is [enabled by default](https://www.mongodb.com/docs/atlas/configure-api-access/#optional--require-an-ip-access-list-for-the-atlas-administration-api).

<Warning>
To ensure the check `organizations_api_access_list_required` passes, enable the API access list for the organization and add the execution IP to the organization's IP Access List. When running checks from Prowler Cloud, add our IP to the IP Access List.

</Warning>
![Organization Settings](/images/providers/ip-access-list.png)


## API Key

1. **Log into MongoDB Atlas**: Access the MongoDB Atlas console
2. **Navigate to Access Manager**: Go to the organization access management section:

    - Click "Access Manager" and "Organization Access":

        ![Organization Access](/images/providers/organization-access.png)

    - Then click the "Applications" tab inside the Access Manager:

        ![Project Access](/images/providers/access-manager.png)

3. **Select API Keys Tab**: Click the "API Keys" tab that appears in the image above

4. **Create API Key**: Click "Create API Key" and provide a description

    ![Create API Key](/images/providers/create-api-key.png)

5. **Set Permissions**: Recommend project permissions for enhanced security; modify them after creating the key

    ![Set Permissions](/images/providers/modify-permission.png)

6. **Save Credentials**: Record both the public and private keys, then store them securely

    ![Save Credentials](/images/providers/copy-key.png)

7. **Add IP Access List**: Add the IP address where Prowler runs to the API Key's IP Access List. To skip this step and use the API key for all IP addresses, uncheck the "Require IP Access List for the Atlas Administration API" button in [Organization Settings](#required-permissions), though this is not recommended.

    ![Organization Settings](/images/providers/add-ip.png)
```

--------------------------------------------------------------------------------

---[FILE: getting-started-mongodbatlas.mdx]---
Location: prowler-master/docs/user-guide/providers/mongodbatlas/getting-started-mongodbatlas.mdx

```text
---
title: 'Getting Started with MongoDB Atlas'
---

import { VersionBadge } from "/snippets/version-badge.mdx"

Prowler supports MongoDB Atlas both from the CLI and from Prowler Cloud. This guide walks you through the requirements, how to connect the provider in the UI, and how to run scans from the command line.

## Prerequisites

Before you begin, make sure you have:

1. A MongoDB Atlas organization with **API Access** enabled.
2. An **Organization ID** (24-character hex string).
3. An **API Key pair** (public and private keys) with appropriate permissions:
   - **Organization Read Only**: Provides read-only access to everything in the organization, including all projects in the organization. This permission is sufficient for most security checks.
   - **Organization Owner**: Required to audit the [Auditing configuration](https://www.mongodb.com/docs/api/doc/atlas-admin-api-v2/group/endpoint-auditing) for projects. Database auditing tracks database operations and security events, including authentication attempts, data definition language (DDL) changes, user and role modifications, and privilege grants. This configuration is essential for security monitoring, forensics, and compliance. Without **Organization Owner** permission, the `projects_auditing_enabled` check cannot retrieve the audit configuration status.
4. Prowler App access (cloud or self-hosted) or the Prowler CLI (`pip install prowler`).

For detailed instructions on creating API keys, see the [MongoDB Atlas authentication guide](./authentication.mdx).

<Warning>
If **Require IP Access List for the Atlas Administration API** is enabled in your organization settings, you **must** add the IP address of the host running Prowler (or the public IP of Prowler Cloud) to the organization IP Access List or Atlas will reject every API call. You can manage this under **Settings → Organization Settings → Security**. See step 7 of the [authentication guide](./authentication.mdx) for detailed instructions, and refer to the [Prowler Cloud public IP list](../../tutorials/prowler-cloud-public-ips) when using Prowler Cloud.
</Warning>

<CardGroup cols={2}>
  <Card title="Prowler Cloud" icon="cloud" href="#prowler-cloud">
    Onboard MongoDB Atlas using Prowler Cloud
  </Card>
  <Card title="Prowler CLI" icon="terminal" href="#prowler-cli">
    Onboard MongoDB Atlas using Prowler CLI
  </Card>
</CardGroup>

## Prowler Cloud

<VersionBadge version="5.15.0" />

### Step 1: Add the provider

1. Navigate to **Cloud Providers** and click **Add Cloud Provider**.
   ![Add provider list](./img/add-provider-list.png)
2. Select **MongoDB Atlas** from the provider list.
3. Enter your **Organization ID** (24 hex characters). This value is visible in the Atlas UI under **Organization Settings**.
   ![Add organization ID](./img/add-org-id.png)
4. (Optional) Add a friendly alias to identify this organization in dashboards.

### Step 2: Provide API credentials

1. Click **Next** to open the credentials form.
2. Paste the **Atlas Public Key** and **Atlas Private Key** generated in the Atlas console.
   ![Add credentials](./img/add-credentials.png)

### Step 3: Test the connection and start scanning

1. Click **Test connection** to ensure Prowler App can reach the Atlas API.
2. Save the credentials. The provider will appear in the list with its current connection status.
3. Launch a scan from the provider row or from the **Scans** page.
   ![Launch scan](./img/launch-scan.png)

---

## Prowler CLI

<VersionBadge version="5.12.0" />

You can also run MongoDB Atlas assessments directly from the CLI. Both command-line flags and environment variables are supported.

### Step 1: Select an authentication method

Choose one of the following authentication methods:

#### Command-line arguments

```bash
prowler mongodbatlas \
  --atlas-public-key <public_key> \
  --atlas-private-key <private_key>
```

#### Environment variables

```bash
export ATLAS_PUBLIC_KEY=<public_key>
export ATLAS_PRIVATE_KEY=<private_key>
prowler mongodbatlas
```

### Step 2: Run the first scan

#### Scan all projects and clusters

```bash
prowler mongodbatlas
```

This command enumerates all projects accessible to the API key and scans every cluster.

#### Scan a specific project

Add the `--atlas-project-id` flag when you only want to assess one project:

```bash
prowler mongodbatlas --atlas-project-id <project-id>
```

### Additional tips

- Combine flags (for example, `--checks` or `--services`) just like with other providers.
- Use `--output-modes` to export findings in JSON, CSV, ASFF, etc.
- Rotate API keys regularly and update the stored credentials in Prowler App to maintain connectivity.

For more examples (filters, outputs, scheduling), refer back to the [MongoDB Atlas documentation hub](./authentication.mdx) and the main Prowler CLI usage guide.
```

--------------------------------------------------------------------------------

---[FILE: authentication.mdx]---
Location: prowler-master/docs/user-guide/providers/oci/authentication.mdx

```text
---
title: 'Oracle Cloud Infrastructure (OCI) Authentication'
---

This guide covers all authentication methods supported by Prowler for Oracle Cloud Infrastructure (OCI).

## Authentication Methods

Prowler supports the following authentication methods for OCI:

1. **Config File Authentication** (using `~/.oci/config`)
   - [OCI Session Authentication](#oci-session-authentication) **(Recommended)** - Automatically generates the config file via browser login
   - [Manual API Key Setup](#setting-up-api-keys) - Manually create the config file with static API keys
2. [Instance Principal Authentication](#instance-principal-authentication) - For Prowler running inside OCI compute instances
3. [Environment Variables](#environment-variables) (Limited Support)

**Important Note:** OCI Session Authentication and Manual API Key Setup both use the same config file-based authentication method. The only difference is how the `~/.oci/config` file is generated:
- **Session Authentication**: Automatically created via browser login with temporary session tokens
- **Manual Setup**: You manually generate static API keys and create the config file

## OCI Session Authentication

**This is the recommended method for config file authentication** as it automatically generates the config file and doesn't require managing static API keys.

### Prerequisites

You need to have the **OCI CLI installed** to use session authentication.

For installation instructions, see the [OCI CLI Installation Guide](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm).

Verify your OCI CLI installation:
```bash
oci --version
```

### How It Works

The `oci session authenticate` command uses your browser to authenticate and creates temporary session tokens that are more secure than static API keys.

### Step 1: Authenticate with OCI Session

```bash
oci session authenticate
```

This command will:
1. Open your default browser
2. Redirect you to OCI Console login
3. Automatically create/update `~/.oci/config` with session tokens
4. Store session credentials securely

### Step 2: Add User OCID to Config File

After running `oci session authenticate`, you need to manually add your user OCID to the config file:

**Get your user OCID from the OCI Console:**

Navigate to: **Identity & Security** → **Users** → Click on your username → Copy the OCID

![Get User OCID from OCI Console](./images/oci-user-ocid.png)

Direct link: [OCI Console - Users](https://cloud.oracle.com/identity/domains/my-profile)

Or use the OCI CLI:
```bash
oci iam user list --all
```

Edit `~/.oci/config` and add the `user` parameter:

```ini
[DEFAULT]
region=us-ashburn-1
tenancy=ocid1.tenancy.oc1..aaaaaaaexample
fingerprint=11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:11
key_file=/Users/yourusername/.oci/sessions/DEFAULT/oci_api_key.pem
security_token_file=/Users/yourusername/.oci/sessions/DEFAULT/token
user=ocid1.user.oc1..aaaaaaaexample  # Add this line manually
```

### Step 3: Run Prowler

```bash
prowler oci
```

### Advantages of Session Authentication

- **No Manual Key Generation**: No need to generate RSA key pairs manually
- **Automatic Rotation**: Session tokens expire and can be refreshed
- **Browser-Based Login**: Uses your existing OCI Console credentials
- **More Secure**: Temporary credentials reduce the risk of long-term credential exposure

### Session Expiration

Session tokens typically expire after a period of time. When your session expires, simply run:

```bash
oci session authenticate
```

## Config File Authentication (Manual API Key Setup)

If you prefer to manually generate API keys instead of using browser-based session authentication, you can create the config file yourself with static API keys.

**Note:** This method uses the same `~/.oci/config` file as session authentication, but with static API keys instead of temporary session tokens.

### Default Configuration

By default, Prowler uses the OCI configuration file located at `~/.oci/config`.

**Config file structure:**

```ini
[DEFAULT]
user=ocid1.user.oc1..aaaaaaaexample
fingerprint=11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:11
tenancy=ocid1.tenancy.oc1..aaaaaaaexample
region=us-ashburn-1
key_file=~/.oci/oci_api_key.pem
```

**Run Prowler:**

```bash
prowler oci
```

### Multiple Profiles

You can define multiple profiles in your config file:

```ini
[DEFAULT]
user=ocid1.user.oc1..user1
fingerprint=11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:11
tenancy=ocid1.tenancy.oc1..tenancy1
region=us-ashburn-1
key_file=~/.oci/oci_api_key.pem

[PRODUCTION]
user=ocid1.user.oc1..user2
fingerprint=aa:bb:cc:dd:ee:ff:11:22:33:44:55:66:77:88:99:00
tenancy=ocid1.tenancy.oc1..tenancy2
region=us-phoenix-1
key_file=~/.oci/oci_api_key_prod.pem

[DEVELOPMENT]
user=ocid1.user.oc1..user3
fingerprint=99:88:77:66:55:44:33:22:11:00:ff:ee:dd:cc:bb:aa
tenancy=ocid1.tenancy.oc1..tenancy3
region=us-ashburn-1
key_file=~/.oci/oci_api_key_dev.pem
```

**Use a specific profile:**

```bash
prowler oci --profile PRODUCTION
```

### Custom Config File Path

Use a config file from a custom location:

```bash
prowler oci --config-file /path/to/custom/config
```

### Setting Up API Keys

#### Option A: Generate API Key Using OCI Console (Simpler)

1. Log in to OCI Console
2. Navigate to **Identity** → **Users** → Select your user
3. In the **Resources** section, click **API Keys**
4. Click **Add API Key**
5. Select **Generate API Key Pair**
6. Click **Download Private Key** - save this file as `~/.oci/oci_api_key.pem`
7. Click **Add**
8. The console will display a configuration file preview with:
   - `user` OCID
   - `fingerprint`
   - `tenancy` OCID
   - `region`

9. **Copy the entire configuration snippet** from the console and paste it into `~/.oci/config`
10. Add the `key_file` parameter pointing to your downloaded private key:

```ini
[DEFAULT]
user=ocid1.user.oc1..aaaaaaaexample
fingerprint=11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:11
tenancy=ocid1.tenancy.oc1..aaaaaaaexample
region=us-ashburn-1
key_file=~/.oci/oci_api_key.pem  # Add this line
```

11. Set proper permissions:
```bash
chmod 600 ~/.oci/oci_api_key.pem
chmod 600 ~/.oci/config
```

#### Option B: Generate API Key Manually

1. Generate the key pair locally:

```bash
mkdir -p ~/.oci
openssl genrsa -out ~/.oci/oci_api_key.pem 2048
chmod 600 ~/.oci/oci_api_key.pem
openssl rsa -pubout -in ~/.oci/oci_api_key.pem -out ~/.oci/oci_api_key_public.pem
```

2. Upload the public key to OCI Console:
   - Navigate to **Identity** → **Users** → Select your user
   - In the **Resources** section, click **API Keys**
   - Click **Add API Key**
   - Select **Paste Public Key** or **Choose Public Key File**
   - Paste or upload the contents of `~/.oci/oci_api_key_public.pem`
   - Click **Add**

3. The console will display the configuration file preview with your user OCID, fingerprint, tenancy OCID, and region.

4. Copy the configuration snippet from the console and create `~/.oci/config`:

```ini
[DEFAULT]
user=<user_ocid_from_console>
fingerprint=<fingerprint_from_console>
tenancy=<tenancy_ocid_from_console>
region=<region_from_console>
key_file=~/.oci/oci_api_key.pem
```

5. Set proper permissions:
```bash
chmod 600 ~/.oci/config
chmod 600 ~/.oci/oci_api_key.pem
```

#### Test Authentication

After setting up your API keys with either option, test the authentication:

```bash
prowler oci --list-checks
```

## Instance Principal Authentication

Instance Principal authentication allows OCI compute instances to authenticate without storing credentials.

**IMPORTANT:** This authentication method **only works when Prowler is running inside an OCI compute instance**. If you're running Prowler from your local machine or outside OCI, use [OCI Session Authentication](#oci-session-authentication) or [Config File Authentication](#config-file-authentication) instead.

### Prerequisites

1. **Prowler must be running on an OCI compute instance**
2. **Dynamic Group**: Create a dynamic group that includes your compute instance
3. **Policy**: Create policies granting the dynamic group access to resources

### Step 1: Create Dynamic Group

1. Navigate to **Identity** → **Dynamic Groups**
2. Click **Create Dynamic Group**
3. Enter a name (e.g., `prowler-instances`)
4. Add matching rule:
   ```
   instance.compartment.id = 'ocid1.compartment.oc1..example'
   ```
   Or for a specific instance:
   ```
   instance.id = 'ocid1.instance.oc1..example'
   ```

### Step 2: Create Policies

Create a policy allowing the dynamic group to read resources:

```
Allow dynamic-group prowler-instances to inspect all-resources in tenancy
Allow dynamic-group prowler-instances to read all-resources in tenancy
Allow dynamic-group prowler-instances to read audit-events in tenancy
Allow dynamic-group prowler-instances to read cloud-guard-config in tenancy
```

### Step 3: Run Prowler with Instance Principal

On the compute instance, run:

```bash
prowler oci --use-instance-principal
```

### Use Cases for Instance Principal

- **Automated Security Scanning**: Run Prowler on a schedule using cron
- **CI/CD Pipelines**: Integrate security checks in build pipelines
- **Centralized Security Monitoring**: Deploy Prowler on a dedicated security instance

## Environment Variables

While OCI SDK supports environment variables, Prowler currently focuses on config file and instance principal authentication for better security and manageability.

If you need to use environment variables, they will be picked up by the OCI SDK:

```bash
export OCI_CLI_USER=ocid1.user.oc1..example
export OCI_CLI_FINGERPRINT=11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:11
export OCI_CLI_TENANCY=ocid1.tenancy.oc1..example
export OCI_CLI_REGION=us-ashburn-1
export OCI_CLI_KEY_FILE=~/.oci/oci_api_key.pem

prowler oci
```

## Security Best Practices

### API Key Security

1. **Rotate API Keys Regularly**
   - OCI recommends rotating API keys every 90 days
   - Prowler includes a check for this: `identity_user_api_keys_rotated_90_days`

2. **Use Separate Keys Per Environment**
   - Development, staging, and production should use different API keys
   - Use profiles to manage multiple environments

3. **Restrict Key Permissions**
   - Follow the principle of least privilege
   - Grant only read permissions for security auditing

4. **Secure Key Storage**
   ```bash
   chmod 600 ~/.oci/oci_api_key.pem
   chmod 600 ~/.oci/config
   ```

5. **Never Commit Keys to Version Control**
   - Add `~/.oci/` to `.gitignore`
   - Use secret management systems for automation

### Instance Principal Security

1. **Use Specific Compartment Matching**
   ```
   instance.compartment.id = 'specific-compartment-ocid'
   ```
   Instead of:
   ```
   ANY {instance.compartment.id = 'ocid1'}
   ```

2. **Scope Policies Appropriately**
   - Grant access only to required resources
   - Use compartment-level policies when possible

3. **Monitor Dynamic Group Membership**
   - Regularly review which instances belong to security-related dynamic groups
   - Use Cloud Guard to detect anomalous access patterns

## Troubleshooting

### Common Authentication Errors

#### Error: "ConfigFileNotFound"

**Cause**: OCI config file not found at default location

**Solution**:
```bash
# Check if config file exists
ls -la ~/.oci/config

# Create directory if missing
mkdir -p ~/.oci

# Specify custom location
prowler oci --config-file /path/to/config
```

#### Error: "InvalidKeyOrSignature"

**Cause**: Incorrect API key fingerprint or key file

**Solutions**:
1. Verify fingerprint matches OCI Console:
   ```bash
   openssl rsa -pubout -outform DER -in ~/.oci/oci_api_key.pem | \
     openssl md5 -c | \
     awk '{print $2}'
   ```

2. Check key file path in config:
   ```ini
   key_file=~/.oci/oci_api_key.pem  # Use absolute path if needed
   ```

3. Verify key permissions:
   ```bash
   chmod 600 ~/.oci/oci_api_key.pem
   ```

#### Error: "NotAuthenticated"

**Cause**: User OCID, tenancy OCID, or credentials incorrect

**Solutions**:
1. Verify OCIDs in OCI Console
2. Check that API key is uploaded to correct user
3. Ensure user has not been deleted or disabled
4. Test with OCI CLI:
   ```bash
   oci iam region list
   ```

#### Error: "InstancePrincipalNotEnabled"

**Cause**: Instance Principal not configured correctly

**Solutions**:
1. Verify dynamic group includes your instance
2. Check policies grant required permissions
3. Ensure instance is in the correct compartment
4. Test with:
   ```bash
   oci os ns get --auth instance_principal
   ```

### Permission Errors

**Error**: "Authorization failed or requested resource not found"

**Cause**: Insufficient IAM permissions

**Solution**: Add required policies (see [Required Permissions](./getting-started-oci.md#required-permissions))

### Configuration Validation

Validate your OCI configuration:

```bash
# Test OCI CLI connectivity
oci iam region list --profile DEFAULT

# Test with specific profile
oci iam region list --profile PRODUCTION

# Test instance principal
oci iam region list --auth instance_principal
```

## Testing Authentication

Before running a full Prowler scan, test authentication:

```bash
# List available checks (requires authentication)
prowler oci --list-checks

# List available services
prowler oci --list-services

# Test connection only
prowler oci --check identity_password_policy_minimum_length_14 --region us-ashburn-1
```

## Additional Resources

- [OCI SDK Configuration](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm)
- [OCI API Key Management](https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcredentials.htm)
- [OCI Instance Principals](https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/callingservicesfrominstances.htm)
- [OCI IAM Policies](https://docs.oracle.com/en-us/iaas/Content/Identity/Concepts/policygetstarted.htm)
```

--------------------------------------------------------------------------------

---[FILE: getting-started-oci.mdx]---
Location: prowler-master/docs/user-guide/providers/oci/getting-started-oci.mdx

```text
---
title: 'Getting Started with Oracle Cloud Infrastructure (OCI)'
---

Prowler supports security scanning of Oracle Cloud Infrastructure (OCI) environments. This guide will help you get started with using Prowler to audit your OCI tenancy.

## Prowler Cloud

The following steps apply to Prowler Cloud and the self-hosted Prowler App.

### Step 1: Collect OCI Identifiers
1. Sign in to the [OCI Console](https://cloud.oracle.com/) and open **Tenancy Details** to copy the Tenancy OCID.
2. Go to **Identity & Security** → **Users**, select the principal that owns the API key, and copy the **User OCID**.
3. Generate or locate the API key fingerprint and private key for that user. Follow the [Config File Authentication steps](/user-guide/providers/oci/authentication#config-file-authentication-manual-api-key-setup) to create or rotate the key pair and copy the fingerprint.
4. Note the **Region** identifier to scan (for example, `us-ashburn-1`).

### Step 2: Access Prowler Cloud or Prowler App
1. Navigate to [Prowler Cloud](https://cloud.prowler.com/) or launch [Prowler App](/user-guide/tutorials/prowler-app).
2. Go to **Configuration** → **Cloud Providers** and click **Add Cloud Provider**.
![Add OCI Cloud Provider](./images/oci-add-cloud-provider.png)
3. Select **Oracle Cloud** and enter the **Tenancy OCID** and an optional alias, then choose **Next**.
![Add OCI Cloud Tenancy](./images/oci-add-tenancy.png)

### Step 3: Add OCI API Key Credentials
Prowler App connects to OCI with API key credentials. Provide:

- **User OCID** for the API key owner
- **Fingerprint** of the API key
- **Region** (for example, `us-ashburn-1`)
- **Private Key Content** (paste the full PEM value)
- **Passphrase (Optional)** if the private key is encrypted

Select **Next**, then **Launch Scan** to validate the connection and start the first OCI scan. The private key content is encoded for secure transmission.

![Add OCI API Key Credentials](./images/oci-add-api-key-credentials.png)

---

## Prowler CLI

### Prerequisites

Before you begin, ensure you have:

1. **Prowler installed** with OCI dependencies:
   ```bash
   pip install prowler
   # or for development:
   poetry install
   ```

2. **OCI Python SDK** (automatically installed with Prowler):
   ```bash
   pip install oci==2.152.1
   ```

3. **OCI Account Access** with appropriate permissions to read resources in your tenancy.

### Authentication

Prowler supports multiple authentication methods for OCI. For detailed authentication setup, see the [OCI Authentication Guide](./authentication).

**Note:** OCI Session Authentication and Config File Authentication both use the same `~/.oci/config` file. The difference is how the config file is generated - automatically via browser (session auth) or manually with API keys.

#### Quick Start: OCI Session Authentication (Recommended)

The easiest and most secure method is using OCI session authentication, which automatically generates your config file via browser login.

**Prerequisites:** You need to have the **OCI CLI installed**. See the [OCI CLI Installation Guide](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm) for installation instructions.

1. Authenticate using the OCI CLI:
   ```bash
   oci session authenticate
   ```
   This will open your browser for OCI Console login and automatically generate the config file.

2. Add your user OCID to `~/.oci/config`:

   **Get your user OCID from the OCI Console:**

   Navigate to: **Identity & Security** → **Users** → Click on your username → Copy the OCID

   ![Get User OCID from OCI Console](./images/oci-user-ocid.png)

   Direct link: [OCI Console - Users](https://cloud.oracle.com/identity/domains/my-profile)

   Or use the OCI CLI:
   ```bash
   oci iam user list --all
   ```

   Edit `~/.oci/config` and add the `user` parameter:
   ```ini
   [DEFAULT]
   region=us-ashburn-1
   tenancy=ocid1.tenancy.oc1..example
   fingerprint=xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx
   key_file=/Users/yourusername/.oci/sessions/DEFAULT/oci_api_key.pem
   security_token_file=/Users/yourusername/.oci/sessions/DEFAULT/token
   user=ocid1.user.oc1..example  # Add this line
   ```

3. Run Prowler:
   ```bash
   prowler oci
   ```

#### Alternative: Manual API Key Setup

If you prefer to manually generate API keys instead of using browser-based session authentication, see the detailed instructions in the [Authentication Guide](./authentication#config-file-authentication-manual-api-key-setup).

**Note:** Both methods use the same `~/.oci/config` file - the difference is that manual setup uses static API keys while session authentication uses temporary session tokens.

##### Using a Specific Profile

If you have multiple profiles in your OCI config:

```bash
prowler oci --profile production
```

##### Using a Custom Config File

```bash
prowler oci --config-file /path/to/custom/config
```

#### Instance Principal Authentication

**IMPORTANT:** This authentication method **only works when Prowler is running inside an OCI compute instance**. If you're running Prowler from your local machine, use [OCI Session Authentication](#quick-start-oci-session-authentication-recommended) instead.

When running Prowler on an OCI Compute instance, you can use Instance Principal authentication:

```bash
prowler oci --use-instance-principal
```

**Requirements:**
- **Prowler must be running on an OCI compute instance**
- The compute instance must have a dynamic group and policy allowing access to OCI resources
- Example policy:
  ```
  Allow dynamic-group prowler-instances to inspect all-resources in tenancy
  Allow dynamic-group prowler-instances to read all-resources in tenancy
  ```

### Basic Usage

#### Scan Entire Tenancy

```bash
prowler oci
```

#### Scan Specific Region

```bash
prowler oci --region us-phoenix-1
```

#### Scan Specific Compartments

```bash
prowler oci --compartment-id ocid1.compartment.oc1..example1 ocid1.compartment.oc1..example2
```

#### Run Specific Checks

```bash
prowler oci --check identity_password_policy_minimum_length_14
```

#### Run Specific Services

```bash
prowler oci --service identity network
```

#### Compliance Frameworks

Run CIS OCI Foundations Benchmark v3.0:

```bash
prowler oci --compliance cis_3.0_oci
```

### Required Permissions

Prowler requires **read-only** permissions to audit your OCI tenancy. Below are the minimum required permissions:

#### Tenancy-Level Policy

Create a group `prowler-users` and add your user to it, then create this policy:

```
Allow group prowler-users to inspect all-resources in tenancy
Allow group prowler-users to read all-resources in tenancy
Allow group prowler-users to read audit-events in tenancy
Allow group prowler-users to read cloud-guard-config in tenancy
Allow group prowler-users to read cloud-guard-problems in tenancy
Allow group prowler-users to read cloud-guard-targets in tenancy
```

#### Service-Specific Permissions

For more granular control, you can grant specific permissions:

```
# Identity
Allow group prowler-users to inspect users in tenancy
Allow group prowler-users to inspect groups in tenancy
Allow group prowler-users to inspect policies in tenancy
Allow group prowler-users to inspect authentication-policies in tenancy
Allow group prowler-users to inspect dynamic-groups in tenancy

# Networking
Allow group prowler-users to inspect vcns in tenancy
Allow group prowler-users to inspect subnets in tenancy
Allow group prowler-users to inspect security-lists in tenancy
Allow group prowler-users to inspect network-security-groups in tenancy
Allow group prowler-users to inspect route-tables in tenancy
Allow group prowler-users to inspect dhcp-options in tenancy
Allow group prowler-users to inspect internet-gateways in tenancy
Allow group prowler-users to inspect nat-gateways in tenancy
Allow group prowler-users to inspect service-gateways in tenancy

# Compute
Allow group prowler-users to inspect instances in tenancy
Allow group prowler-users to inspect instance-configurations in tenancy
Allow group prowler-users to inspect boot-volumes in tenancy
Allow group prowler-users to inspect volume-attachments in tenancy

# Storage
Allow group prowler-users to inspect buckets in tenancy
Allow group prowler-users to inspect volumes in tenancy
Allow group prowler-users to inspect file-systems in tenancy

# Database
Allow group prowler-users to inspect autonomous-databases in tenancy
Allow group prowler-users to inspect db-systems in tenancy

# Keys Management
Allow group prowler-users to inspect vaults in tenancy
Allow group prowler-users to inspect keys in tenancy

# Monitoring & Events
Allow group prowler-users to read metrics in tenancy
Allow group prowler-users to inspect alarms in tenancy
Allow group prowler-users to inspect ons-topics in tenancy
Allow group prowler-users to inspect ons-subscriptions in tenancy
Allow group prowler-users to inspect rules in tenancy
```

### Output Formats

Prowler supports multiple output formats for OCI:

#### JSON
```bash
prowler oci --output-formats json
```

#### CSV
```bash
prowler oci --output-formats csv
```

#### HTML
```bash
prowler oci --output-formats html
```

#### Multiple Formats
```bash
prowler oci --output-formats json csv html
```

### Common Scenarios

#### Security Assessment

Full security assessment with CIS compliance:

```bash
prowler oci \
  --compliance cis_3.0_oci \
  --output-formats json html \
  --output-directory ./oci-assessment-$(date +%Y%m%d)
```

#### Continuous Monitoring

Run specific security-critical checks:

```bash
prowler oci \
  --check identity_user_mfa_enabled_console_access \
         network_security_list_ingress_from_internet_to_ssh_port \
         objectstorage_bucket_not_publicly_accessible \
  --output-formats json
```

#### Compartment-Specific Audit

Audit a specific project compartment:

```bash
prowler oci \
  --compartment-id ocid1.compartment.oc1..projecta \
  --profile production \
  --region us-ashburn-1
```

### Troubleshooting

#### Authentication Issues

**Error: "Could not find a valid config file"**
- Ensure `~/.oci/config` exists and is properly formatted
- Verify the path to your API key is correct
- Check file permissions: `chmod 600 ~/.oci/config ~/.oci/oci_api_key.pem`

**Error: "Invalid key or signature"**
- Verify the API key fingerprint matches the one in OCI Console
- Ensure the public key is uploaded to your OCI user account
- Check that the private key file is accessible

#### Permission Issues

**Error: "Authorization failed or requested resource not found"**
- Verify your user has the required policies (see [Required Permissions](#required-permissions))
- Check that policies apply to the correct compartments
- Ensure policies are not restricted by conditions that exclude your user

#### Region Issues

**Error: "Invalid region"**
- Check available regions: `prowler oci --list-regions`
- Verify your tenancy is subscribed to the region
- Use the region identifier (e.g., `us-ashburn-1`), not the display name

### Advanced Usage

#### Using Mutelist

Create a mutelist file to suppress specific findings:

```yaml
# oci-mutelist.yaml
Tenancies:
  - "ocid1.tenancy.oc1..example":
      Checks:
        "identity_password_policy_*":
          Regions:
            - "us-ashburn-1"
          Resources:
            - "ocid1.user.oc1..example"
```

Run with mutelist:

```bash
prowler oci --mutelist-file oci-mutelist.yaml
```

#### Custom Checks Metadata

Override check metadata:

```yaml
# custom-metadata.yaml
identity_user_mfa_enabled_console_access:
  Severity: critical
  CheckTitle: "Custom: Ensure MFA is enabled for all console users"
```

Run with custom metadata:

```bash
prowler oci --custom-checks-metadata-file custom-metadata.yaml
```

#### Filtering by Status

Only show failed checks:

```bash
prowler oci --status FAIL
```

#### Filtering by Severity

Only show critical and high severity findings:

```bash
prowler oci --severity critical high
```

### Next Steps

- Learn about [Compliance Frameworks](/user-guide/cli/tutorials/compliance) in Prowler
- Review [Prowler Output Formats](/user-guide/cli/tutorials/reporting)
- Explore [Integrations](/user-guide/cli/tutorials/integrations) with SIEM and ticketing systems

### Additional Resources

- [OCI Documentation](https://docs.oracle.com/en-us/iaas/Content/home.htm)
- [CIS OCI Foundations Benchmark](https://www.cisecurity.org/benchmark/oracle_cloud)
- [Prowler Documentation](https://docs.prowler.com)
- [Prowler GitHub](https://github.com/prowler-cloud/prowler)
```

--------------------------------------------------------------------------------

````
