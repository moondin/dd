---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 96
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 96 of 867)

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

---[FILE: aws-organizations-bulk-provisioning.mdx]---
Location: prowler-master/docs/user-guide/tutorials/aws-organizations-bulk-provisioning.mdx

```text
---
title: 'AWS Organizations Bulk Provisioning in Prowler'
---

Prowler offers an automated tool to discover and provision all AWS accounts within an AWS Organization. This streamlines onboarding for organizations managing multiple AWS accounts by automatically generating the configuration needed for bulk provisioning.

The tool, `aws_org_generator.py`‎, complements the [Bulk Provider Provisioning](./bulk-provider-provisioning) tool and is available in the Prowler repository at: [util/prowler-bulk-provisioning](https://github.com/prowler-cloud/prowler/tree/master/util/prowler-bulk-provisioning)

<Note>
Native support for bulk provisioning AWS Organizations and similar multi-account structures directly in the Prowler UI/API is on the official roadmap.

Track progress and vote for this feature at: [Bulk Provisioning in the UI/API for AWS Organizations](https://roadmap.prowler.com/p/builk-provisioning-in-the-uiapi-for-aws-organizations-and-alike)
</Note>

{/* TODO: Add screenshot of the tool in action */}

## Overview

The AWS Organizations Bulk Provisioning tool simplifies multi-account onboarding by:

* Automatically discovering all active accounts in an AWS Organization
* Generating YAML configuration files for bulk provisioning
* Supporting account filtering and custom role configurations
* Eliminating manual entry of account IDs and role ARNs

## Prerequisites

### Requirements

* Python 3.7 or higher
* AWS credentials with Organizations read access
* ProwlerRole (or custom role) deployed across all target accounts
* Prowler API key (from Prowler Cloud or self-hosted Prowler App)
    * For self-hosted Prowler App, remember to [point to your API base URL](./bulk-provider-provisioning#custom-api-endpoints)
    * Learn how to create API keys: [Prowler App API Keys](../tutorials/prowler-app-api-keys)

### Deploying ProwlerRole Across AWS Organizations

Before using the AWS Organizations generator, deploy the ProwlerRole across all accounts in the organization using CloudFormation StackSets.

<Note>
**Follow the official documentation:**
[Deploying Prowler IAM Roles Across AWS Organizations](../providers/aws/organizations#deploying-prowler-iam-roles-across-aws-organizations)

**Key points:**

* Use CloudFormation StackSets from the management account
* Deploy to all organizational units (OUs) or specific OUs
* Use an external ID for enhanced security
* Ensure the role has necessary permissions for Prowler scans
</Note>

### Installation

Clone the repository and install required dependencies:

```bash
git clone https://github.com/prowler-cloud/prowler.git
cd prowler/util/prowler-bulk-provisioning
pip install -r requirements-aws-org.txt
```

### AWS Credentials Setup

Configure AWS credentials with Organizations read access:

* **Management account credentials**, or
* **Delegated administrator account** with `organizations:ListAccounts` permission

Required IAM permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "organizations:ListAccounts",
        "organizations:DescribeOrganization"
      ],
      "Resource": "*"
    }
  ]
}
```

### Prowler API Key Setup

Configure your Prowler API key:

```bash
export PROWLER_API_KEY="pk_example-api-key"
```

To create an API key:

1. Log in to Prowler Cloud or Prowler App
2. Click **Profile** → **Account**
3. Click **Create API Key**
4. Provide a descriptive name and optionally set an expiration date
5. Copy the generated API key (it will only be shown once)

For detailed instructions, see: [Prowler App API Keys](../tutorials/prowler-app-api-keys)

## Basic Usage

### Generate Configuration for All Accounts

To generate a YAML configuration file for all active accounts in the organization:

```bash
python aws_org_generator.py -o aws-accounts.yaml --external-id prowler-ext-id-2024
```

This command:

1. Lists all ACTIVE accounts in the organization
2. Generates YAML entries for each account
3. Saves the configuration to `aws-accounts.yaml`

**Output:**

```
Fetching accounts from AWS Organizations...
Found 47 active accounts in organization
Generated configuration for 47 accounts

Configuration written to: aws-accounts.yaml

Next steps:
  1. Review the generated file: cat aws-accounts.yaml | head -n 20
  2. Run bulk provisioning: python prowler_bulk_provisioning.py aws-accounts.yaml
```

### Review Generated Configuration

Review the generated YAML configuration:

```bash
head -n 20 aws-accounts.yaml
```

**Example output:**

```yaml
- provider: aws
  uid: '111111111111'
  alias: Production-Account
  auth_method: role
  credentials:
    role_arn: arn:aws:iam::111111111111:role/ProwlerRole
    external_id: prowler-ext-id-2024

- provider: aws
  uid: '222222222222'
  alias: Development-Account
  auth_method: role
  credentials:
    role_arn: arn:aws:iam::222222222222:role/ProwlerRole
    external_id: prowler-ext-id-2024
```

### Dry Run Mode

Test the configuration without writing a file:

```bash
python aws_org_generator.py \
  --external-id prowler-ext-id-2024 \
  --dry-run
```

## Advanced Configuration

### Using a Specific AWS Profile

Specify an AWS profile when multiple profiles are configured:

```bash
python aws_org_generator.py \
  -o aws-accounts.yaml \
  --profile org-management-admin \
  --external-id prowler-ext-id-2024
```

### Excluding Specific Accounts

Exclude the management account or other accounts from provisioning:

```bash
python aws_org_generator.py \
  -o aws-accounts.yaml \
  --external-id prowler-ext-id-2024 \
  --exclude 123456789012,210987654321
```

Common exclusion scenarios:

* Management account (requires different permissions)
* Break-glass accounts (emergency access)
* Suspended or archived accounts

### Including Only Specific Accounts

Generate configuration for specific accounts only:

```bash
python aws_org_generator.py \
  -o aws-accounts.yaml \
  --external-id prowler-ext-id-2024 \
  --include 111111111111,222222222222,333333333333
```

### Custom Role Name

Specify a custom role name if not using the default `ProwlerRole`:

```bash
python aws_org_generator.py \
  -o aws-accounts.yaml \
  --role-name ProwlerExecutionRole \
  --external-id prowler-ext-id-2024
```

### Custom Alias Format

Customize account aliases using template variables:

```bash
# Use account name and ID
python aws_org_generator.py \
  -o aws-accounts.yaml \
  --alias-format "{name}-{id}" \
  --external-id prowler-ext-id-2024

# Use email prefix
python aws_org_generator.py \
  -o aws-accounts.yaml \
  --alias-format "{email}" \
  --external-id prowler-ext-id-2024
```

Available template variables:

* `{name}` - Account name
* `{id}` - Account ID
* `{email}` - Account email

### Additional Role Assumption Options

Configure optional role assumption parameters:

```bash
python aws_org_generator.py \
  -o aws-accounts.yaml \
  --role-name ProwlerRole \
  --external-id prowler-ext-id-2024 \
  --session-name prowler-scan-session \
  --duration-seconds 3600
```

## Complete Workflow Example

<Steps>
  <Step title="Deploy ProwlerRole Using StackSets">
    1. Log in to the AWS management account
    2. Open CloudFormation → StackSets
    3. Create a new StackSet using the [Prowler role template](https://github.com/prowler-cloud/prowler/blob/master/permissions/templates/cloudformation/prowler-scan-role.yml)
    4. Deploy to all organizational units
    5. Use a unique external ID (e.g., `prowler-org-2024-abc123`)

    {/* TODO: Add screenshot of CloudFormation StackSets deployment */}
  </Step>

  <Step title="Generate YAML Configuration">
    Configure AWS credentials and generate the YAML file:

    ```bash
    # Using management account credentials
    export AWS_PROFILE=org-management

    # Generate configuration
    python aws_org_generator.py \
      -o aws-org-accounts.yaml \
      --external-id prowler-org-2024-abc123 \
      --exclude 123456789012
    ```

    **Output:**

    ```
    Fetching accounts from AWS Organizations...
    Using AWS profile: org-management
    Found 47 active accounts in organization
    Generated configuration for 46 accounts

    Configuration written to: aws-org-accounts.yaml

    Next steps:
      1. Review the generated file: cat aws-org-accounts.yaml | head -n 20
      2. Run bulk provisioning: python prowler_bulk_provisioning.py aws-org-accounts.yaml
    ```
  </Step>

  <Step title="Review Generated Configuration">
    Verify the generated YAML configuration:

    ```bash
    # View first 20 lines
    head -n 20 aws-org-accounts.yaml

    # Check for unexpected accounts
    grep "uid:" aws-org-accounts.yaml

    # Verify role ARNs
    grep "role_arn:" aws-org-accounts.yaml | head -5

    # Count accounts
    grep "provider: aws" aws-org-accounts.yaml | wc -l
    ```
  </Step>

  <Step title="Run Bulk Provisioning">
    Provision all accounts to Prowler Cloud or Prowler App:

    ```bash
    # Set Prowler API key
    export PROWLER_API_KEY="pk_example-api-key"

    # Run bulk provisioning with connection testing
    python prowler_bulk_provisioning.py aws-org-accounts.yaml
    ```

    **With custom options:**

    ```bash
    python prowler_bulk_provisioning.py aws-org-accounts.yaml \
      --concurrency 10 \
      --timeout 120
    ```

    **Successful output:**

    ```
    [1] ✅ Created provider (id=db9a8985-f9ec-4dd8-b5a0-e05ab3880bed)
    [1] ✅ Created secret (id=466f76c6-5878-4602-a4bc-13f9522c1fd2)
    [1] ✅ Connection test: Connected

    [2] ✅ Created provider (id=7a99f789-0cf5-4329-8279-2d443a962676)
    [2] ✅ Created secret (id=c5702180-f7c4-40fd-be0e-f6433479b126)
    [2] ✅ Connection test: Connected

    Done. Success: 47  Failures: 0
    ```

    {/* TODO: Add screenshot of successful bulk provisioning output */}
  </Step>
</Steps>

## Command Reference

### Full Command-Line Options

```bash
python aws_org_generator.py \
  -o OUTPUT_FILE \
  --role-name ROLE_NAME \
  --external-id EXTERNAL_ID \
  --session-name SESSION_NAME \
  --duration-seconds SECONDS \
  --alias-format FORMAT \
  --exclude ACCOUNT_IDS \
  --include ACCOUNT_IDS \
  --profile AWS_PROFILE \
  --region AWS_REGION \
  --dry-run
```

## Troubleshooting

### Error: "No AWS credentials found"

**Solution:** Configure AWS credentials using one of these methods:

```bash
# Method 1: AWS CLI configure
aws configure

# Method 2: Environment variables
export AWS_ACCESS_KEY_ID=your-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-key

# Method 3: Use AWS profile
export AWS_PROFILE=org-management
```

### Error: "Access denied to AWS Organizations API"

**Cause:** Current credentials don't have permission to list organization accounts.

**Solution:**

* Ensure management account credentials are used
* Verify IAM permissions include `organizations:ListAccounts`
* Check IAM policies for Organizations access

### Error: "AWS Organizations is not enabled"

**Cause:** The account is not part of an organization.

**Solution:** This tool requires an AWS Organization. Create one in the AWS Organizations console or use standard bulk provisioning for standalone accounts.

### No Accounts Generated After Filters

**Cause:** All accounts were filtered out by `--exclude` or `--include` options.

**Solution:** Review filter options and verify account IDs are correct:

```bash
# List all accounts in organization
aws organizations list-accounts --query "Accounts[?Status=='ACTIVE'].[Id,Name]" --output table
```

### Connection Test Failures During Bulk Provisioning

**Cause:** ProwlerRole may not be deployed correctly or credentials are invalid.

**Solution:**

* Verify StackSet deployment status in CloudFormation
* Check role trust policy includes correct external ID
* Test role assumption manually:

```bash
aws sts assume-role \
  --role-arn arn:aws:iam::123456789012:role/ProwlerRole \
  --role-session-name test \
  --external-id prowler-ext-id-2024
```

## Security Best Practices

### Use External ID

Always use an external ID when assuming cross-account roles:

```bash
python aws_org_generator.py \
  -o aws-accounts.yaml \
  --external-id $(uuidgen | tr '[:upper:]' '[:lower:]')
```

The external ID must match the one configured in the ProwlerRole trust policy across all accounts.

### Exclude Sensitive Accounts

Exclude accounts that shouldn't be scanned or require special handling:

```bash
python aws_org_generator.py \
  -o aws-accounts.yaml \
  --external-id prowler-ext-id \
  --exclude 123456789012,111111111111  # management, break-glass accounts
```

### Review Generated Configuration

Always review the generated YAML before provisioning:

```bash
# Check for unexpected accounts
grep "uid:" aws-org-accounts.yaml

# Verify role ARNs
grep "role_arn:" aws-org-accounts.yaml | head -5

# Count accounts
grep "provider: aws" aws-org-accounts.yaml | wc -l
```

## Next Steps

<Columns cols={2}>
  <Card title="Bulk Provider Provisioning" icon="terminal" href="/user-guide/tutorials/bulk-provider-provisioning">
    Learn how to bulk provision providers in Prowler.
  </Card>
  <Card title="Prowler App" icon="pen-to-square" href="/user-guide/tutorials/prowler-app">
    Detailed instructions on how to use Prowler.
  </Card>
</Columns>
```

--------------------------------------------------------------------------------

---[FILE: bulk-provider-provisioning.mdx]---
Location: prowler-master/docs/user-guide/tutorials/bulk-provider-provisioning.mdx

```text
---
title: 'Bulk Provider Provisioning in Prowler'
---

Prowler enables automated provisioning of multiple cloud providers through the Bulk Provider Provisioning tool. This approach streamlines the onboarding process for organizations managing numerous cloud accounts, subscriptions, and projects across AWS, Azure, GCP, Kubernetes, Microsoft 365, and GitHub.

The tool is available in the Prowler repository at: [util/prowler-bulk-provisioning](https://github.com/prowler-cloud/prowler/tree/master/util/prowler-bulk-provisioning)

![](/images/prowler-app/bulk-provider-provisioning.png)

## Overview

The Bulk Provider Provisioning tool automates the creation of cloud providers in Prowler App or Prowler Cloud by:

* Reading provider configurations from YAML files
* Creating providers with appropriate authentication credentials
* Testing connections to verify successful authentication
* Processing multiple providers concurrently for efficiency

<Tip>
**Using AWS Organizations?** For organizations with many AWS accounts, use the automated [AWS Organizations Bulk Provisioning](./aws-organizations-bulk-provisioning) tool to automatically discover and generate configuration for all accounts in your organization.
</Tip>

## Prerequisites

### Requirements

* Python 3.7 or higher
* Prowler API key (from Prowler Cloud or self-hosted Prowler App)
    * For self-hosted Prowler App, remember to [point to your API base URL](#custom-api-endpoints)
    * Learn how to create API keys: [Prowler App API Keys](../tutorials/prowler-app-api-keys)
* Authentication credentials for target cloud providers

### Installation

Clone the repository and install the required dependencies:

```bash
git clone https://github.com/prowler-cloud/prowler.git
cd prowler/util/prowler-bulk-provisioning
pip install -r requirements.txt
```

### Authentication Setup

Configure your Prowler API key:

```bash
export PROWLER_API_KEY="pk_example-api-key"
```

To create an API key:

1. Log in to Prowler Cloud or Prowler App
2. Click **Profile** → **Account**
3. Click **Create API Key**
4. Provide a descriptive name and optionally set an expiration date
5. Copy the generated API key (it will only be shown once)

For detailed instructions, see: [Prowler App API Keys](../tutorials/prowler-app-api-keys)

## Configuration File Structure

Create a YAML file listing your cloud providers and credentials:

```yaml
# providers.yaml
- provider: aws
  uid: "123456789012"              # AWS Account ID
  alias: "production-account"
  auth_method: role
  credentials:
    role_arn: "arn:aws:iam::123456789012:role/ProwlerScanRole"
    external_id: "prowler-external-id"

- provider: azure
  uid: "00000000-1111-2222-3333-444444444444"  # Subscription ID
  alias: "azure-production"
  auth_method: service_principal
  credentials:
    tenant_id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
    client_id: "ffffffff-1111-2222-3333-444444444444"
    client_secret: "your-client-secret"

- provider: gcp
  uid: "my-gcp-project"            # Project ID
  alias: "gcp-production"
  auth_method: service_account
  credentials:
    service_account_key_json_path: "./service-account.json"
```

## Running the Bulk Provisioning Tool

### Basic Usage

To provision all providers from your configuration file:

```bash
python prowler_bulk_provisioning.py providers.yaml
```

The tool automatically tests each provider connection after creation (enabled by default).

### Dry Run Mode

Test your configuration without making API calls:

```bash
python prowler_bulk_provisioning.py providers.yaml --dry-run
```

### Skip Connection Testing

To provision providers without testing connections:

```bash
python prowler_bulk_provisioning.py providers.yaml --test-provider false
```

### Test Existing Providers Only

To verify connections for already provisioned providers:

```bash
python prowler_bulk_provisioning.py providers.yaml --test-provider-only
```

## Provider-Specific Configuration

### AWS Provider Configuration

#### Using IAM Role (Recommended)

```yaml
- provider: aws
  uid: "123456789012"
  alias: "aws-production"
  auth_method: role
  credentials:
    role_arn: "arn:aws:iam::123456789012:role/ProwlerScanRole"
    external_id: "optional-external-id"
    session_name: "prowler-scan-session"  # optional
    duration_seconds: 3600                # optional
```

#### Using Access Keys

```yaml
- provider: aws
  uid: "123456789012"
  alias: "aws-development"
  auth_method: credentials
  credentials:
    access_key_id: "AKIA..."
    secret_access_key: "..."
    session_token: "..."  # optional for temporary credentials
```

### Azure Provider Configuration

```yaml
- provider: azure
  uid: "subscription-uuid"
  alias: "azure-production"
  auth_method: service_principal
  credentials:
    tenant_id: "tenant-uuid"
    client_id: "client-uuid"
    client_secret: "client-secret"
```

### GCP Provider Configuration

#### Using Service Account JSON

```yaml
- provider: gcp
  uid: "project-id"
  alias: "gcp-production"
  auth_method: service_account
  credentials:
    service_account_key_json_path: "/path/to/key.json"
```

#### Using OAuth2 Credentials

```yaml
- provider: gcp
  uid: "project-id"
  alias: "gcp-production"
  auth_method: oauth2
  credentials:
    client_id: "123456789.apps.googleusercontent.com"
    client_secret: "GOCSPX-xxxx"
    refresh_token: "1//0exxxxxx"
```

### Kubernetes Provider Configuration

```yaml
- provider: kubernetes
  uid: "context-name"
  alias: "eks-production"
  auth_method: kubeconfig
  credentials:
    kubeconfig_path: "~/.kube/config"
    # OR inline configuration:
    # kubeconfig_inline: |
    #   apiVersion: v1
    #   clusters: ...
```

### Microsoft 365 Provider Configuration

```yaml
- provider: m365
  uid: "domain.onmicrosoft.com"
  alias: "m365-tenant"
  auth_method: service_principal
  credentials:
    tenant_id: "tenant-uuid"
    client_id: "client-uuid"
    client_secret: "client-secret"
```

### GitHub Provider Configuration

#### Using Personal Access Token

```yaml
- provider: github
  uid: "organization-name"
  alias: "github-org"
  auth_method: personal_access_token
  credentials:
    token: "ghp_..."
```

#### Using GitHub App

```yaml
- provider: github
  uid: "organization-name"
  alias: "github-org"
  auth_method: github_app
  credentials:
    app_id: "123456"
    private_key_path: "/path/to/private-key.pem"
```

## Advanced Configuration

### Concurrent Processing

Adjust the number of concurrent provider creations:

```bash
python prowler_bulk_provisioning.py providers.yaml --concurrency 10
```

### Custom API Endpoints

For self-hosted Prowler App installations:

```bash
python prowler_bulk_provisioning.py providers.yaml \
  --base-url http://localhost:8080/api/v1
```

### Timeout Configuration

Set custom timeout for API requests:

```bash
python prowler_bulk_provisioning.py providers.yaml --timeout 120
```

## Bulk Provider Management

### Deleting Multiple Providers

To remove all providers from your Prowler account:

```bash
python nuke_providers.py --confirm
```

Filter deletions by provider type:

```bash
python nuke_providers.py --confirm --filter-provider aws
```

Filter deletions by alias pattern:

```bash
python nuke_providers.py --confirm --filter-alias "test-*"
```

## Configuration File Format

The tool uses YAML format for provider configuration files. Each provider entry requires:

* `provider`: The cloud provider type (aws, azure, gcp, kubernetes, m365, github)
* `uid`: Unique identifier for the provider (account ID, subscription ID, project ID, etc.)
* `alias`: A friendly name for the provider
* `auth_method`: Authentication method to use
* `credentials`: Authentication credentials specific to the provider and method

Example YAML structure:

```yaml
- provider: aws
  uid: "123456789012"
  alias: "production"
  auth_method: role
  credentials:
    role_arn: "arn:aws:iam::123456789012:role/ProwlerScan"
```

## Example Output

Successful provider provisioning:

```
[1] ✅ Created provider (id=db9a8985-f9ec-4dd8-b5a0-e05ab3880bed)
[1] ✅ Created secret (id=466f76c6-5878-4602-a4bc-13f9522c1fd2)
[1] ✅ Connection test: Connected

[2] ✅ Created provider (id=7a99f789-0cf5-4329-8279-2d443a962676)
[2] ✅ Created secret (id=c5702180-f7c4-40fd-be0e-f6433479b126)
[2] ⚠️  Connection test: Not connected

Done. Success: 2  Failures: 0
```

## Troubleshooting

### Invalid API Key

```
Error: 401 Unauthorized
Solution: Verify your PROWLER_API_KEY environment variable or --api-key parameter
```

### Network Timeouts

```
Error: Connection timeout
Solution: Increase timeout with --timeout 120
```

### Provider Already Exists

```
Error: Provider with this UID already exists
Solution: Use different UID or delete existing provider first
```

### Authentication Failures

```
Connection test: Not connected
Solution: Verify credentials and IAM permissions
```
```

--------------------------------------------------------------------------------

---[FILE: PowerBI.mdx]---
Location: prowler-master/docs/user-guide/tutorials/PowerBI.mdx

```text
# Prowler Multicloud CIS Benchmarks PowerBI Template
![Prowler Report](https://github.com/user-attachments/assets/560f7f83-1616-4836-811a-16963223c72f)

## Getting Started

1. Install Microsoft PowerBI Desktop

   This report requires the Microsoft PowerBI Desktop software which can be downloaded for free from Microsoft.
2. Run compliance scans in Prowler

   The report uses compliance csv outputs from Prowler. Compliance scans be run using either [Prowler CLI](https://docs.prowler.com/projects/prowler-open-source/en/latest/#prowler-cli) or [Prowler Cloud/App](https://cloud.prowler.com/sign-in)
   1. Prowler CLI -&gt; Run a Prowler scan using the --compliance option
   2. Prowler Cloud/App -&gt; Navigate to the compliance section to download csv outputs
![Download Compliance Scan](https://github.com/user-attachments/assets/42c11a60-8ce8-4c60-a663-2371199c052b)


   The template supports the following CIS Benchmarks only:

   | Compliance Framework                           | Version |
   | ---------------------------------------------- | ------- |
   | CIS Amazon Web Services Foundations Benchmark  | v4.0.1  |
   | CIS Google Cloud Platform Foundation Benchmark | v3.0.0  |
   | CIS Microsoft Azure Foundations Benchmark      | v3.0.0  |
   | CIS Kubernetes Benchmark                       | v1.10.0 |

   Ensure you run or download the correct benchmark versions.
3. Create a local directory to store Prowler csvoutputs

   Once downloaded, place your csv outputs in a directory on your local machine. If you rename the files, they must maintain the provider in the filename.

   To use time-series capabilities such as "compliance percent over time" you'll need scans from multiple dates.
4. Download and run the PowerBI template file (.pbit)

   Running the .pbit file will open PowerBI Desktop and prompt you for the full filepath to the local directory
5. Enter the full filepath to the directory created in step 3

   Provide the full filepath from the root directory.

   Ensure that the filepath is not wrapped in quotation marks (""). If you use Window's "copy as path" feature, it will automatically include quotation marks.
6. Save the report as a PowerBI file (.pbix)

   Once the filepath is entered, the template will automatically ingest and populate the report. You can then save this file as a new PowerBI report. If you'd like to generate another report, simply re-run the template file (.pbit) from step 4.

## Validation

After setting up your dashboard, you may want to validate the Prowler csv files were ingested correctly. To do this, navigate to the "Configuration" tab.

The "loaded CIS Benchmarks" table shows the supported benchmarks and versions. This is defined by the template file and not editable by the user. All benchmarks will be loaded regardless of which providers you provided csv outputs for.

The "Prowler CSV Folder" shows the path to the local directory you provided.

The "Loaded Prowler Exports" table shows the ingested csv files from the local directory. It will mark files that are treated as the latest assessment with a green checkmark.

![Prowler Validation](https://github.com/user-attachments/assets/a543ca9b-6cbe-4ad1-b32a-d4ac2163d447)

## Report Sections

The PowerBI Report is broken into three main report pages

| Report Page | Description                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| Overview    | Provides general CIS Benchmark overview across both AWS, Azure, GCP, and Kubernetes |
| Benchmark   | Provides overview of a single CIS Benchmark                                         |
| Requirement | Drill-through page to view details of a single requirement                          |


### Overview Page

The overview page is a general CIS Benchmark overview across both AWS, Azure, GCP, and Kubernetes.

![image](https://github.com/user-attachments/assets/94164fa9-36a4-4bb9-890d-e9a9a63a3e7d)

The page has the following components:

| Component                                | Description                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| CIS Benchmark Overview                   | Table with benchmark name, Version, and overall compliance percentage    |
| Provider by Requirement Status           | Bar chart showing benchmark requirements by status by provider           |
| Compliance Percent Heatmap               | Heatmap showing compliance percent by benchmark and profile level        |
| Profile level by Requirement Status      | Bar chart showing requirements by status and profile level               |
| Compliance Percent Over Time by Provider | Line chart showing overall compliance perecentage over time by provider. |

### Benchmark Page

The benchmark page provides an overview of a single CIS Benchmark. You can select the benchmark from the dropdown as well as scope down to specific profile levels or regions.

![image](https://github.com/user-attachments/assets/34498ee8-317b-4b81-b241-c561451d8def)

The page has the following components:

| Component                               | Description                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Compliance Percent Heatmap              | Heatmap showing compliance percent by region and profile level                                                                             |
| Benchmark Section by Requirement Status | Bar chart showing benchmark requirements by bennchmark section and status                                                                  |
| Compliance percent Over Time by Region  | Line chart showing overall compliance percentage over time by region                                                                       |
| Benchmark Requirements                  | Table showing requirement section, requirement number, reuqirement title, number of resources tested, status, and number of failing checks |

### Requirement Page

The requirement page is a drill-through page to view details of a single requirement. To populate the requirement page right click on a requiement from the "Benchmark Requirements" table on the benchmark page and select "Drill through" -&gt; "Requirement".

![image](https://github.com/user-attachments/assets/5c9172d9-56fe-4514-b341-7e708863fad6)

The requirement page has the following components:

| Component                                  | Description                                                                       |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| Title                                      | Title of the requirement                                                          |
| Rationale                                  | Rationale of the requirement                                                      |
| Remediation                                | Remedation guidance for the requirement                                           |
| Region by Check Status                     | Bar chart showing Prowler checks by region and status                             |
| Resource Checks for Benchmark Requirements | Table showing Resource ID, Resource Name, Status, Description, and Prowler Checkl |

## Walkthrough Video
[![image](https://github.com/user-attachments/assets/866642c6-43ac-4aac-83d3-bb625002da0b)](https://www.youtube.com/watch?v=lfKFkTqBxjU)
```

--------------------------------------------------------------------------------

````
