---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 91
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 91 of 867)

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

---[FILE: getting-started-aws.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/getting-started-aws.mdx

```text
---
title: 'Getting Started With AWS on Prowler'
---

## Prowler App

<iframe width="560" height="380" src="https://www.youtube-nocookie.com/embed/RPgIWOCERzY" title="Prowler Cloud Onboarding AWS" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="1"></iframe>

> Walkthrough video onboarding an AWS Account using Assumed Role.

### Step 1: Get Your AWS Account ID

1. Log in to the [AWS Console](https://console.aws.amazon.com)
2. Locate your AWS account ID in the top-right dropdown menu

![Account ID detail](/images/providers/aws-account-id.png)


### Step 2: Access Prowler Cloud or Prowler App

1. Navigate to [Prowler Cloud](https://cloud.prowler.com/) or launch [Prowler App](/user-guide/tutorials/prowler-app)
2. Go to "Configuration" > "Cloud Providers"

    ![Cloud Providers Page](/images/prowler-app/cloud-providers-page.png)

3. Click "Add Cloud Provider"

    ![Add a Cloud Provider](/images/prowler-app/add-cloud-provider.png)

4. Select "Amazon Web Services"

    ![Select AWS Provider](/images/providers/select-aws.png)

5. Enter your AWS Account ID and optionally provide a friendly alias

    ![Add account ID](/images/providers/add-account-id.png)

6. Choose the preferred authentication method (next step)

    ![Select auth method](./img/select-auth-method.png)


### Step 3: Set Up AWS Authentication

Before proceeding, choose the preferred authentication mode:

**Credentials**

* Quick scan as current user
* No extra setup
* Credentials time out

**Assumed Role**

* Preferred Setup
* Permanent Credentials
* Requires access to create role


---

#### Assume Role (Recommended)

This method grants permanent access and is the recommended setup for production environments.

![Assume Role Overview](/images/providers/assume-role-overview.png)

For detailed instructions on how to create the role, see [Authentication > Assume Role](/user-guide/providers/aws/authentication#assume-role-recommended).

8. Once the role is created, go to the **IAM Console**, click on the "ProwlerScan" role to open its details:

    ![ProwlerScan role info](/images/providers/prowler-scan-pre-info.png)

9. Copy the **Role ARN**

    ![New Role Info](/images/providers/get-role-arn.png)

10. Paste the ARN into the corresponding field in Prowler Cloud or Prowler App

    ![Input the Role ARN](/images/providers/paste-role-arn-prowler.png)

11. Click "Next", then "Launch Scan"

    ![Next button in Prowler Cloud](/images/providers/next-button-prowler-cloud.png)
    ![Launch Scan](/images/providers/launch-scan-button-prowler-cloud.png)

<Note>
Check if your AWS Security Token Service (STS) has the EU (Ireland) endpoint active. If not, we will not be able to connect to your AWS account.

If that is the case your STS configuration may look like this:

<img src="/images/sts-configuration.png" alt="AWS Role" width="800" />

To solve this issue, please activate the EU (Ireland) STS endpoint.

</Note>

---

#### Credentials (Static Access Keys)

AWS accounts can also be configured using static credentials (not recommended for long-term use):

![Connect via credentials](/images/providers/connect-via-credentials.png)

For detailed instructions on how to create the credentials, see [Authentication > Credentials](/user-guide/providers/aws/authentication#credentials).

1. Complete the form in Prowler Cloud or Prowler App and click "Next"

    ![Filled credentials page](/images/providers/prowler-cloud-credentials-next.png)

2. Click "Launch Scan"

    ![Launch Scan](/images/providers/launch-scan-button-prowler-cloud.png)

---

## Prowler CLI

### Configure AWS Credentials

To authenticate with AWS, use one of the following methods:

```console
aws configure
```

or

```console
export AWS_ACCESS_KEY_ID="ASXXXXXXX"
export AWS_SECRET_ACCESS_KEY="XXXXXXXXX"
export AWS_SESSION_TOKEN="XXXXXXXXX"
```

These credentials must be associated with a user or role with the necessary permissions to perform security checks.

More details on Assume Role settings from the CLI in [Assume Role](/user-guide/providers/aws/role-assumption) page.


### AWS Profiles

To use a custom AWS profile, specify it with the following command:

```console
prowler aws -p/--profile <profile_name>
```

### Multi-Factor Authentication (MFA)

For IAM entities requiring Multi-Factor Authentication (MFA), use the `--mfa` flag. Prowler prompts for the following values to initiate a new session:

- **ARN of your MFA device**
- **TOTP (time-based one-time password)**
```

--------------------------------------------------------------------------------

---[FILE: multiaccount.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/multiaccount.mdx

```text
---
title: 'Scanning Multiple AWS Accounts with Prowler'
---

Prowler enables security scanning across multiple AWS accounts by utilizing the  [Assume Role feature](/user-guide/providers/aws/role-assumption) and [integration with AWS Organizations feature](/user-guide/providers/aws/organizations).

This approach allows execution from a single account with permissions to assume roles in the target accounts.

## Scanning Multiple Accounts Sequentially

To scan specific accounts one at a time:

- Define a variable containing the AWS account IDs to be scanned:

```
ACCOUNTS_LIST='11111111111 2222222222 333333333'
```

- Run Prowler with an IAM role that exists in all target accounts: (replace the `<role_name>` with to yours, that is to be consistent throughout all accounts):

```
ROLE_TO_ASSUME=<role_name>
    for accountId in $ACCOUNTS_LIST; do
    prowler aws --role arn:aws:iam::$accountId:role/$ROLE_TO_ASSUME
done
```

## Scanning Multiple Accounts in Parallel

- To scan multiple accounts simultaneously:

Define the AWS accounts to be scanned with a variable:

```
ACCOUNTS_LIST='11111111111 2222222222 333333333'
```

- Run Prowler with an IAM role that exists in all target accounts: (replace the `<role_name>` with to yours, that is to be consistent throughout all accounts). The following example executes scanning across three accounts in parallel:

```
ROLE_TO_ASSUME=<role_name>
PARALLEL_ACCOUNTS="3"
for accountId in $ACCOUNTS_LIST; do
    test "$(jobs | wc -l)" -ge $PARALLEL_ACCOUNTS && wait || true
    {
        prowler aws --role arn:aws:iam::$accountId:role/$ROLE_TO_ASSUME
    } &
done
```

## Scanning Multiple AWS Organization Accounts in Parallel

Prowler enables parallel security scans across multiple AWS accounts within an AWS Organization.

### Retrieve Active AWS Accounts

To efficiently scan multiple accounts within an AWS Organization, follow these steps:

- Step 1: Retrieve a List of Active Accounts

First, declare a variable containing all active accounts in your AWS Organization. Run the following command in your AWS Organizations Management account, ensuring that you have the necessary permissions:

```
ACCOUNTS_IN_ORG=$(aws organizations list-accounts --query Accounts[?Status==`ACTIVE`].Id --output text)
```

- Step 2: Run Prowler with Assumed Roles

Use Prowler to assume roles across accounts in parallel. Modify `<role_name>` to match the role that exists in all accounts and `<management_organizations_account_id>` to your AWS Organizations Management account ID.

```
ROLE_TO_ASSUME=<role_name>
MGMT_ACCOUNT_ID=<management_organizations_account_id>
PARALLEL_ACCOUNTS="3"
for accountId in $ACCOUNTS_IN_ORG; do
test "$(jobs | wc -l)" -ge $PARALLEL_ACCOUNTS && wait || true
{
    prowler aws --role arn:aws:iam::$accountId:role/$ROLE_TO_ASSUME \
    --organizations-role arn:aws:iam::$MGMT_ACCOUNT_ID:role/$ROLE_TO_ASSUME
} &
done
```
```

--------------------------------------------------------------------------------

---[FILE: organizations.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/organizations.mdx

```text
---
title: 'AWS Organizations in Prowler'
---

Prowler can integrate with AWS Organizations to manage the visibility and onboarding of accounts centrally.

When trusted access is enabled with the Organization, Prowler can discover accounts as they are created and even automate deployment of the Prowler Scan IAM Role.

> ℹ️ Trusted access can be enabled in the Management Account from the AWS Console under **AWS Organizations → Settings → Trusted access for AWS CloudFormation StackSets**.

When not using StackSets or Prowler and only needing to scan AWS Organization accounts using the CLI, it is possible to assume a role in each account manually or automate that logic with custom scripts.

## Retrieving AWS Account Details

If AWS Organizations is enabled, Prowler can fetch detailed account information during scans, including:

- Account Name
- Email Address
- ARN
- Organization ID
- Tags

These details will be included alongside each security finding in the output.

### Enabling AWS Organizations Data Retrieval

To retrieve AWS Organizations account details, use the `-O`/`--organizations-role <organizations_role_arn>` argument. If this argument is not provided, Prowler will attempt to fetch the data automatically—provided the AWS account is a delegated administrator for the AWS Organization.

<Note>
For more information on AWS Organizations delegated administrator, refer to the official documentation [here](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_delegate_policies.html).

</Note>
The following command is an example:

```shell
prowler aws \
  -O arn:aws:iam::<management_organizations_account_id>:role/<role_name>
```

<Note>
Ensure the IAM role used in your AWS Organizations management account has the following permissions:`organizations:DescribeAccount` and `organizations:ListTagsForResource`.

</Note>
Prowler will scan the AWS account and get the account details from AWS Organizations.

### Handling JSON Output

In Prowler's JSON output, tags are encoded in Base64 to prevent formatting errors in CSV or JSON outputs. This ensures compatibility when exporting findings.

```json
  "Account Email": "my-prod-account@domain.com",
  "Account Name": "my-prod-account",
  "Account ARN": "arn:aws:organizations::222222222222:account/o-abcde1234/111111111111",
  "Account Organization": "o-abcde1234",
  "Account tags": "\"eyJUYWdzIjpasf0=\""
```

The additional fields in CSV header output are as follows:

- ACCOUNT\_DETAILS\_EMAIL
- ACCOUNT\_DETAILS\_NAME
- ACCOUNT\_DETAILS\_ARN
- ACCOUNT\_DETAILS\_ORG
- ACCOUNT\_DETAILS\_TAGS

## Deploying Prowler IAM Roles Across AWS Organizations

When onboarding multiple AWS accounts into Prowler Cloud, it is important to deploy the Prowler Scan IAM Role in each account. The most efficient way to do this across an AWS Organization is by leveraging AWS CloudFormation StackSets, which rolls out infrastructure—like IAM roles—to all accounts centrally from the Management or Delegated Admin account.

When using Infrastructure as Code (IaC), Terraform is recommended to manage this deployment systematically.

### Recommended Approach

- **Use StackSets** from the **Management Account** (or a Delegated Admin/Security Account).
- **Use Terraform** to orchestrate the deployment.
- **Use the official CloudFormation template** provided by Prowler.
- Target specific Organizational Units (OUs) or the entire Organization.

<Note>
A detailed community article this implementation is based on is available here:
[Deploy IAM Roles Across an AWS Organization as Code (Unicrons)](https://unicrons.cloud/en/2024/10/14/deploy-iam-roles-across-an-aws-organization-as-code/)
This guide has been adapted with permission and aligned with Prowler’s IAM role requirements.

</Note>
---

### Step-by-Step Guide Using Terraform

Below is a ready Terraform snippet that deploys the [Prowler Scan IAM Role CloudFormation template](https://github.com/prowler-cloud/prowler/blob/master/permissions/templates/cloudformation/prowler-scan-role.yml) across the AWS Organization using StackSets:

```hcl title="main.tf"
data "aws_caller_identity" "this" {}

data "aws_organizations_organization" "this" {}

module "prowler-scan-role" {
  source = "unicrons/organization-iam-role/aws"

  stack_set_name        = "prowler-scan-role"
  stack_set_description = "Deploy Prowler Scan IAM Role across all organization accounts"
  template_path         = "${path.root}/prowler-scan-role.yaml"

  template_parameters = {
    ExternalId = "<< external ID >>"  # Replace with the External ID provided by Prowler Cloud
  }

  # Specific OU IDs can be specified instead of root
  organizational_unit_ids = [data.aws_organizations_organization.this.roots[0].id]
}
```

#### `prowler-scan-role.yaml`

Download or reference the official CloudFormation template directly from GitHub:

- [prowler-scan-role.yml](https://github.com/prowler-cloud/prowler/blob/master/permissions/templates/cloudformation/prowler-scan-role.yml)

---

### IAM Role: External ID Support

Include the `ExternalId` parameter in the StackSet if required by the organization's Prowler Cloud setup. This ensures secure cross-account access for scanning.

---

When encountering issues during deployment or needing to target specific OUs or environments (e.g., dev/staging/prod), reach out to the Prowler team via [Slack Community](https://prowler.com/slack) or [Support](mailto:support@prowler.com).

## Extra: Run Prowler across all accounts in AWS Organizations by assuming roles

### Running Prowler Across All AWS Organization Accounts

1. To run Prowler across all accounts in AWS Organizations, first retrieve a list of accounts that are not suspended:

    ```shell
    ACCOUNTS_IN_ORGS=$(aws organizations list-accounts \
      --query "Accounts[?Status=='ACTIVE'].Id" \
      --output text \
    )
    ```

2. Then run Prowler to assume a role (same in all members) per each account:

    ```shell
    for accountId in $ACCOUNTS_IN_ORGS;
    do
      prowler aws \
        -O arn:aws:iam::<management_organizations_account_id>:role/<role_name> \
        -R arn:aws:iam::"${accountId}":role/<role_name>;
    done
    ```

<Note>
This same loop structure can be adapted to scan a predefined list of accounts using a variable like the following: `ACCOUNTS_LIST='11111111111 2222222222 333333333'`

</Note>
```

--------------------------------------------------------------------------------

---[FILE: regions-and-partitions.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/regions-and-partitions.mdx

```text
---
title: 'AWS Regions and Partitions'
---

By default Prowler is able to scan the following AWS partitions:

- Commercial: `aws`
- China: `aws-cn`
- GovCloud (US): `aws-us-gov`

<Note>
To check the available regions for each partition and service, refer to: [aws\_regions\_by\_service.json](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/aws/aws_regions_by_service.json)

</Note>
## Scanning AWS China and GovCloud Partitions in Prowler

When scanning the China (`aws-cn`) or GovCloud (`aws-us-gov`), ensure one of the following:

- Your AWS credentials include a valid region within the desired partition.

- Specify the regions to audit within that partition using the `-f/--region` flag.

<Note>
Refer to: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html#configuring-credentials for more information about the AWS credential configuration.

</Note>
### Scanning Specific Regions

To scan a particular AWS region with Prowler, use:

```console
prowler aws -f/--region eu-west-1 us-east-1
```

### AWS Credentials Configuration

For details on configuring AWS credentials, refer to the following [Botocore](https://github.com/boto/botocore) [file](https://github.com/boto/botocore/blob/22a19ea7c4c2c4dd7df4ab8c32733cba0c7597a4/botocore/data/partitions.json).

## Scanning AWS Partitions in Prowler

### AWS China

To scan an account in the AWS China partition (`aws-cn`):

- By using the `-f/--region` flag:

    ```
    prowler aws --region cn-north-1 cn-northwest-1
    ```

- By using the region configured in your AWS profile at `~/.aws/credentials` or `~/.aws/config`:

    ```
    [default]
    aws_access_key_id = XXXXXXXXXXXXXXXXXXX
    aws_secret_access_key = XXXXXXXXXXXXXXXXXXX
    region = cn-north-1
    ```

<Note>
With this configuration, all partition regions will be scanned without needing the `-f/--region` flag

</Note>
### AWS GovCloud (US)

To scan an account in the AWS GovCloud (US) partition (`aws-us-gov`):

- By using the `-f/--region` flag:

    ```
    prowler aws --region us-gov-east-1 us-gov-west-1
    ```

- By using the region configured in your AWS profile at `~/.aws/credentials` or `~/.aws/config`:

    ```
    [default]
    aws_access_key_id = XXXXXXXXXXXXXXXXXXX
    aws_secret_access_key = XXXXXXXXXXXXXXXXXXX
    region = us-gov-east-1
    ```

<Note>
With this configuration, all partition regions will be scanned without needing the `-f/--region` flag

</Note>
### AWS ISO (US \& Europe)

The AWS ISO partitions—commonly referred to as "secret partitions"—are air-gapped from the Internet, and Prowler does not have a built-in way to scan them. To audit an AWS ISO partition, manually update [aws\_regions\_by\_service.json](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/aws/aws_regions_by_service.json) to include the partition, region, and services. For example:

```json
"iam": {
    "regions": {
    "aws": [
        "eu-west-1",
        "us-east-1",
    ],
    "aws-cn": [
        "cn-north-1",
        "cn-northwest-1"
    ],
    "aws-us-gov": [
        "us-gov-east-1",
        "us-gov-west-1"
    ],
    "aws-iso": [
        "aws-iso-global",
        "us-iso-east-1",
        "us-iso-west-1"
    ],
    "aws-iso-b": [
        "aws-iso-b-global",
        "us-isob-east-1"
    ],
    "aws-iso-e": [],
    }
},
```
```

--------------------------------------------------------------------------------

---[FILE: resource-arn-based-scan.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/resource-arn-based-scan.mdx

```text
---
title: 'Resource ARN-based Scanning'
---

Prowler enables scanning of resources based on specific AWS Resource ARNs.

## Resource ARN-Based Scanning

Prowler enables scanning of resources based on specific AWS Resource [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html). To perform this scan, use the designated flag `--resource-arn` followed by one or more ARNs, separated by spaces.

```
prowler aws --resource-arn arn:aws:iam::012345678910:user/test arn:aws:ec2:us-east-1:123456789012:vpc/vpc-12345678
```

Example: This configuration scans only the specified two resources using their ARNs.
```

--------------------------------------------------------------------------------

---[FILE: role-assumption.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/role-assumption.mdx

```text
---
title: 'AWS Assume Role in Prowler (CLI)'
---

## Authentication Overview

Prowler leverages the AWS SDK (Boto3) for authentication, following standard AWS authentication methods.

### Running Prowler Against Multiple Accounts

To execute Prowler across multiple AWS accounts using IAM Assume Role, choose one of the following approaches:

1. Custom Profile Configuration

    Set up a custom profile inside `~/.aws/config` with the necessary role information.

    Then call the profile using `prowler aws -p/--profile your-custom-profile`.

    - Role-Chaining Example Profile The `credential_source` parameter can be set to `Environment`, `Ec2InstanceMetadata`, or `EcsContainer`.

    - Using an Alternative Named Profile

        Instead of the `credential_source` parameter, `source_profile` can be used to specify a separate named profile.

        This profile must contain IAM user credentials with permissions to assume the target role. For additional details, refer to the AWS Assume Role documentation: [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html).

        ```
        [profile crossaccountrole]
        role_arn = arn:aws:iam::234567890123:role/SomeRole
        credential_source = EcsContainer
        ```

2. Using IAM Role Assumption in Prowler

    To allow Prowler to retrieve temporary credentials by using `Boto3` and run assessments on the specified account, use the `-R`/`--role <role_arn>` flag.

    ```sh
    prowler aws -R arn:aws:iam::<account_id>:role/<role_name>
    ```

    **Defining Session Duration and External ID**

    Optionally, specify the session duration (in seconds, default: 3600) and the external ID for role assumption:

    ```sh
    prowler aws -T/--session-duration <seconds> -I/--external-id <external_id> -R arn:aws:iam::<account_id>:role/<role_name>
    ```

## Custom Role Session Name in Prowler

### Setting a Custom Session Name

Prowler allows you to specify a custom Role Session name using the following flag:

```console
prowler aws --role-session-name <role_session_name>
```

<Note>
If not specified, it defaults to `ProwlerAssessmentSession`.

</Note>
## Role MFA Authentication

If your IAM Role is configured with Multi-Factor Authentication (MFA), use `--mfa` along with `-R`/`--role <role_arn>`. Prowler will prompt you to input the following values to obtain a temporary session for the IAM Role provided:

- ARN of your MFA device
- TOTP (Time-Based One-Time Password)

## Creating a Role for One or Multiple Accounts

To create an IAM role that can be assumed in one or multiple AWS accounts, use either a CloudFormation Stack or StackSet and adapt the provided [template](https://github.com/prowler-cloud/prowler/blob/master/permissions/create_role_to_assume_cfn.yaml).

<Note>
**Session Duration Considerations**: Depending on the number of checks performed and the size of your infrastructure, Prowler may require more than 1 hour to complete. Use the `-T <seconds>` option to allow up to 12 hours (43,200 seconds). If you need more than 1 hour, modify the _“Maximum CLI/API session duration”_ setting for the role. Learn more [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html#id_roles_use_view-role-max-session).

⚠️ Important: If assuming roles via role chaining, there is a hard limit of 1 hour. Whenever possible, avoid role chaining to prevent session expiration issues. More details are available in footnote 1 below the table in the [AWS IAM guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html).

</Note>
```

--------------------------------------------------------------------------------

---[FILE: s3.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/s3.mdx

```text
---
title: 'Sending Reports to an AWS S3 Bucket'
---

To save reports directly in an S3 bucket, use: `-B`/`--output-bucket`.

```sh
prowler aws -B my-bucket
```

### Custom Folder and Filename

For a custom folder and/or filename, specify: `-o`/`--output-directory` and/or `-F`/`--output-filename`.

```sh
prowler aws \
        -B my-bucket \
        --output-directory test-folder \
        --output-filename output-filename
```

### Custom Output Formats

By default, Prowler sends HTML, JSON, and CSV output formats. To specify a single output format, use the `-M`/`--output-modes` flag.

```sh
prowler aws -M csv -B my-bucket
```

<Note>
If you prefer using the initial credentials instead of the assumed role credentials for uploading reports, use `-D`/`--output-bucket-no-assume` instead of `-B`/`--output-bucket`.

</Note>
<Warning>
Ensure the credentials used have write permissions for the `s3:PutObject` where reports will be uploaded.

</Warning>
```

--------------------------------------------------------------------------------

---[FILE: securityhub.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/securityhub.mdx

```text
---
title: 'AWS Security Hub Integration with Prowler'
---

Prowler natively supports **official integration** with [AWS Security Hub](https://aws.amazon.com/security-hub), allowing security findings to be sent directly.  This integration enables **Prowler** to import its findings into AWS Security Hub.

To activate the integration, follow these steps in at least one AWS region within your AWS account:

## Enabling AWS Security Hub for Prowler Integration

To enable the integration, follow these steps in **at least** one AWS region within your AWS account.

Since **AWS Security Hub** is a region-based service, it must be activated in each region where security findings need to be collected.

**Configuration Options**

AWS Security Hub can be enabled using either of the following methods:

<Note>
Enabling this integration incurs costs in AWS Security Hub. Refer to [this information](https://aws.amazon.com/security-hub/pricing/) for details.

</Note>
### Using the AWS Management Console

#### Enabling AWS Security Hub for Prowler Integration

If AWS Security Hub is already enabled, you can proceed to the [next section](#enabling-prowler-integration-in-aws-security-hub).

1. Enable AWS Security Hub via Console: Open the **AWS Security Hub** console: https://console.aws.amazon.com/securityhub/.

2. Ensure you are in the correct AWS region, then select “**Go to Security Hub**”. ![](/images/providers/enable.png)

3. In the “Security Standards” section, review the supported security standards. Select the checkbox for each standard you want to enable, or clear it to disable a standard.

4. Choose “**Enable Security Hub**”. ![](/images/providers/enable-2.png)

#### Enabling Prowler Integration in AWS Security Hub

If the Prowler integration is already enabled in AWS Security Hub, you can proceed to the [next section](#sending-findings-to-aws-security-hub) and begin sending findings.

Once **AWS Security Hub** is activated, **Prowler** must be enabled as partner integration to allow security findings to be sent to it.

1. Enabling AWS Security Hub via Console
Open the **AWS Security Hub** console: https://console.aws.amazon.com/securityhub/.

2. Select the “**Integrations**” tab from the right-side menu bar. ![](/images/providers/enable-partner-integration.png)

3. Search for “_Prowler_” in the text search box and the **Prowler** integration will appear.

4. Click “**Accept Findings**” to authorize **AWS Security Hub** to receive findings from **Prowler**. ![](/images/providers/enable-partner-integration-2.png)

5. A new modal will appear to confirm that the integration with **Prowler** is being enabled. ![](/images/providers/enable-partner-integration-3.png)

6. Click “**Accept Findings**”, to authorize **AWS Security Hub** to receive findings from Prowler. ![](/images/providers/enable-partner-integration-4.png)

### Using AWS CLI

To enable **AWS Security Hub** and integrate **Prowler**, execute the following AWS CLI commands:

**Step 1: Enable AWS Security Hub**

Run the following command to activate AWS Security Hub in the desired region:

```shell
aws securityhub enable-security-hub --region <region>
```

<Note>
This command requires the `securityhub:EnableSecurityHub` permission. Ensure you set the correct AWS region where you want to enable AWS Security Hub.

</Note>
**Step 2: Enable Prowler Integration**

Once **AWS Security Hub** is activated, **Prowler** must be enabled as partner integration to allow security findings to be sent to it. Run the following AWS CLI commands:

```shell
aws securityhub enable-import-findings-for-product --region eu-west-1 --product-arn arn:aws:securityhub:<region>::product/prowler/prowler
```

<Note>
Specify the AWS region where you want to enable the integration. Ensure the region is correctly set within the ARN value. This command requires the`securityhub:securityhub:EnableImportFindingsForProduct` permission.

</Note>
## Sending Findings to AWS Security Hub

Once AWS Security Hub is enabled, findings can be sent using the following commands:

For all regions:

```sh
prowler aws --security-hub
```

For a specific region (e.g., eu-west-1):

```sh
prowler --security-hub --region eu-west-1
```

<Note>
It is recommended to send only fails to Security Hub and that is possible adding `--status FAIL` to the command. You can use, instead of the `--status FAIL` argument, the `--send-sh-only-fails` argument to save all the findings in the Prowler outputs but just to send FAIL findings to AWS Security Hub.

Since Prowler perform checks to all regions by default you may need to filter by region when running Security Hub integration, as shown in the example above. Remember to enable Security Hub in the region or regions you need by calling `aws securityhub enable-security-hub --region <region>` and run Prowler with the option `-f/--region <region>` (if no region is used it will try to push findings in all regions hubs). Prowler will send findings to the Security Hub on the region where the scanned resource is located.

To have updated findings in Security Hub you have to run Prowler periodically. Once a day or every certain amount of hours.

</Note>
### Viewing Prowler Findings in AWS Security Hub

After enabling **AWS Security Hub**, findings from **Prowler** will be available in the configured AWS regions. Reviewing Prowler Findings in **AWS Security Hub**:

1. Enabling AWS Security Hub via Console

    Open the **AWS Security Hub** console: https://console.aws.amazon.com/securityhub/.

2. Select the “**Findings**” tab from the right-side menu bar. ![](/images/providers/findings.png)

3. Use the search box filters and apply the “**Product Name**” filter with the value _Prowler_ to display findings sent by **Prowler**.

4. Click the check “**Title**” to access its detailed view, including its history and status. ![](/images/providers/finding-details.png)

#### Compliance Information

As outlined in the Requirements section, the detailed view includes compliance details for each finding reported by **Prowler**.

## Sending Findings to Security Hub with IAM Role Assumption

### Multi-Account AWS Auditing

When auditing a multi-account AWS environment, Prowler allows you to send findings to a Security Hub in another account by assuming an IAM role from that target account.

#### Using an IAM Role to Send Findings

To send findings to Security Hub, use the `-R` flag in the Prowler command:

```sh
prowler --security-hub --role arn:aws:iam::123456789012:role/ProwlerExecutionRole
```

<Note>
The specified IAM role must have the necessary permissions to send findings to Security Hub. For details on the required permissions, refer to the IAM policy: [prowler-additions-policy.json](https://github.com/prowler-cloud/prowler/blob/master/permissions/prowler-additions-policy.json)

</Note>
## Sending Only Failed Findings to AWS Security Hub

When using **AWS Security Hub** integration, **Prowler** allows sending only failed findings (`FAIL`), helping reduce **AWS Security Hub** usage costs. To enable this, add the `--status FAIL` flag to the Prowler command:

```sh
prowler --security-hub --status FAIL
```

**Configuring Findings Output**

Instead of using `--status FAIL`, the `--send-sh-only-fails` argument to store all findings in Prowler outputs while sending only FAIL findings to AWS Security:

```sh
prowler --security-hub --send-sh-only-fails
```

## Skipping Updates for Findings in Security Hub

By default, Prowler archives any findings in Security Hub that were not detected in the latest scan. To prevent older findings from being archived, use the `--skip-sh-update` option:

```sh
prowler --security-hub --skip-sh-update
```
```

--------------------------------------------------------------------------------

---[FILE: tag-based-scan.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/tag-based-scan.mdx

```text
---
title: 'Tag-based scan'
---

Prowler provides the capability to scan only resources containing specific tags. To execute this, use the designated flag `--resource-tags` followed by the tags `Key=Value`, separated by spaces.

```
prowler aws --resource-tags Environment=dev Project=prowler
```

This configuration scans only resources that contain both specified tags.
```

--------------------------------------------------------------------------------

---[FILE: threat-detection.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/threat-detection.mdx

```text
---
title: 'Threat Detection in AWS with Prowler'
---

Prowler enables threat detection in AWS by analyzing CloudTrail log records. To execute threat detection checks, use the following command:

```
prowler aws --category threat-detection
```

This command runs checks to detect:

* `cloudtrail_threat_detection_privilege_escalation`: Privilege escalation attacks
* `cloudtrail_threat_detection_enumeration`: Enumeration attacks
* `cloudtrail_threat_detection_llm_jacking`: LLM Jacking attacks

<Note>
Threat detection checks are executed only when the `--category threat-detection` flag is used, due to performance considerations.

</Note>
## Config File for Threat Detection

To manage the behavior of threat detection checks, edit the configuration file located in `config.yaml` file from `/prowler/config`. The following attributes can be modified, all related to threat detection:

* `threat_detection_privilege_escalation_threshold`: Defines the percentage of actions required to classify an event as a privilege escalation attack. Default: 0.2 (20%)
* `threat_detection_privilege_escalation_minutes`: Specifies the time window (in minutes) to search for privilege escalation attack patterns. Default: 1440 minutes (24 hours).
* `threat_detection_privilege_escalation_actions`: Lists the default actions associated with privilege escalation attacks.
* `threat_detection_enumeration_threshold`: Defines the percentage of actions required to classify an event as an enumeration attack. Default: 0.3 (30%)
* `threat_detection_enumeration_minutes`: Specifies the time window (in minutes) to search for enumeration attack patterns. Default: 1440 minutes (24 hours).
* `threat_detection_enumeration_actions`: Lists the default actions associated with enumeration attacks.
* `threat_detection_llm_jacking_threshold`: Defines the percentage of actions required to classify an event as LLM jacking attack. Default: 0.4 (40%)
* `threat_detection_llm_jacking_minutes`: Specifies the time window (in minutes) to search for LLM jacking attack patterns. Default: 1440 minutes (24 hours).
* `threat_detection_llm_jacking_actions`: Lists the default actions associated with LLM jacking attacks.

Modify these attributes in the configuration file to fine-tune threat detection checks based on your security requirements.
```

--------------------------------------------------------------------------------

````
