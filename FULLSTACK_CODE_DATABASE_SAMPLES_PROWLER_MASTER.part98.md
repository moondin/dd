---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 98
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 98 of 867)

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

---[FILE: prowler-app-rbac.mdx]---
Location: prowler-master/docs/user-guide/tutorials/prowler-app-rbac.mdx

```text
---
title: 'Managing Users and Role-Based Access Control (RBAC)'
---

import { VersionBadge } from "/snippets/version-badge.mdx"

<VersionBadge version="5.1.0" />

**Prowler App** supports multiple users within a single tenant, enabling seamless collaboration by allowing team members to easily share insights and manage security findings.

[Roles](#roles) help you control user permissions, determining what actions each user can perform and the data they can access within Prowler. By default, each account includes an immutable **admin** role, ensuring that your account always retains administrative access.

<Note>
If the account is created without an invitation, a new tenant will be provisioned for it. However, if the account is created through an invitation, the user will join the inviter’s tenant.

</Note>
## Membership

To get to User-Invitation Management we will focus on the Membership section.

<Note>
**Only users that have the _Invite and Manage Users_ or _admin_ permission can access this section.**

</Note>
<img src="/images/prowler-app/rbac/membership.png" alt="Membership tab" width="700" />

### Users

#### Editing a User

Follow these steps to edit a user of your account:

1. Navigate to **Users** from the side menu.

2. Click the edit button of the user you want to modify.

    <img src="/images/prowler-app/rbac/user_edit.png" alt="Edit User" width="700" />

3. Edit the user fields you need and save your changes.

    <img src="/images/prowler-app/rbac/user_edit_details.png" alt="Edit User Details" width="700" />

#### Removing a User

Follow these steps to remove a user of your account:

1. Navigate to **Users** from the side menu.
2. Click the delete button of your current user.

> **Note: Each user will be able to delete himself and not others, regardless of his permissions.**

<img src="/images/prowler-app/rbac/user_remove.png" alt="Remove User" width="700" />

### Invitations

#### Inviting Users

<Note>
Please be aware that at this time, an email address can only be associated with a single Prowler account_.

</Note>
Follow these steps to invite a user to your account:

1. Navigate to **Users** from the side menu.

2. Click the **Invite User** button on the top right-hand corner of the screen.

    <img src="/images/prowler-app/rbac/invite.png" alt="Invite User" width="700" />

3. In the Invite User screen, enter the email address of the user you want to invite.

4. Pick a Role for the user. You can also change the roles for users and pending invites later. To learn more about the roles and what they can do, see [Roles](#roles).

    <img src="/images/prowler-app/rbac/invitation_info.png" alt="Invitation info" width="700" />

5. Click the **Send Invitation** button to send the invitation to the user.

6. After clicking you will see a summary of the status of the invitation. You could access this view again from the invitation menu.

    <img src="/images/prowler-app/rbac/invitation_details.png" alt="Invitation details" width="700" />
    <img src="/images/prowler-app/rbac/invitation_details_1.png" alt="Invitation button" width="700" />

7. To allow the user to join your Prowler account you will need to share the link with the user. They will only need to access this URL and follow the steps to create a user and complete their registration. **Note: Invitations will expire after 7 days.**

    <img src="/images/prowler-app/rbac/invitation_sign-up.png" alt="Invitation sign-up" width="700" />

<Note>
If you are a [Prowler Cloud](https://cloud.prowler.com/sign-in) user, the invited user will receive an email with the link to accept the invitation.

</Note>
#### Editing Invitation

Follow these steps to edit an invitation:

1. Navigate to **Invitations** from the side menu.

2. Click the edit button of the invitation and modify the email, the role or both. **Note: Editing an invitation will not reset its expiration time.**

    <img src="/images/prowler-app/rbac/invitation_edit.png" alt="Invitation edit" width="700" />
    <img src="/images/prowler-app/rbac/invitation_edit_1.png" alt="Invitation edit details" width="700" />

#### Cancelling Invitation

Follow these steps to cancel an invitation:

1. Navigate to **Invitations** from the side menu.

2. Click the revoke button of the invitation.

    <img src="/images/prowler-app/rbac/invitation_revoke.png" alt="Invitation revoke" width="700" />

#### Sending an Invitation Again

To resend the invitation to the user, it is necessary to explicitly **delete the previous invitation and create a new one**.

## Managing Groups and Roles

The Roles section in Prowler is designed to facilitate the assignment of custom user privileges. This section allows administrators to define roles with specific permissions for Prowler administrative tasks and Account visibility.

<Note>
**Only users that have the _Manage Account_ or _admin_ permission can access this section.**

</Note>
### Provider Groups

Provider Groups control visibility across specific providers. When creating a new role, you can assign specific groups to define their Cloud Provider visibility. This ensures that users with that role have access only to the Cloud Providers that are required.

By default, a new user role does not have visibility into any group.

Alternatively, to grant the role unlimited visibility across all providers, check the Grant Unlimited Visibility checkbox.

#### Creating a Provider Group

Follow these steps to create a provider group in your account:

1. Navigate to **Provider Groups** from the side menu..

2. In this view you can select the provider groups you want to assign to one or more roles.

3. Click the **Create Group** button on the center of the screen.

    <img src="/images/prowler-app/rbac/provider_group.png" alt="Create Provider Group" width="700" />

#### Editing a Provider Group

Follow these steps to edit a provider group on your account:

1. Navigate to **Provider Groups** from the side menu.

2. Click the edit button of the provider group you want to modify.

    <img src="/images/prowler-app/rbac/provider_group_edit.png" alt="Edit Provider Group" width="700" />

3. Change the provider group parameters you need and save the changes.

    <img src="/images/prowler-app/rbac/provider_group_edit_1.png" alt="Edit Provider Group Details" width="700" />

#### Removing a Provider Group

Follow these steps to remove a provider group of your account:

1. Navigate to **Provider Groups** from the side menu.

2. Click on the delete button of the provider group you want to remove.

    <img src="/images/prowler-app/rbac/provider_group_remove.png" alt="Remove Provider Group" width="700" />

### Roles

#### Creating a Role

Follow these steps to create a role for your account:

1. Navigate to **Roles** from the side menu.

2. Click on the **Add Role** button on the top right-hand corner of the screen.

    <img src="/images/prowler-app/rbac/role_create.png" alt="Create Role" width="700" />

3. In the Add Role screen, enter the role name, the administration permissions and the groups of providers to which the Role will have access to.

4. In the Groups and Account Visibility section, you will see a list of available groups with checkboxes next to them. To assign a group to the user role, simply click the checkbox next to the group name. If you need to assign multiple groups, repeat the process for each group you wish to add.

    <img src="/images/prowler-app/rbac/role_create_1.png" alt="Role parameters" width="700" />


<Note>
To assign read-only access, select only the `Unlimited Visibility` permission when creating the role. Then, go to the Users page and assign this role to the appropriate user.

</Note>
#### Editing a Role

Follow these steps to edit a role on your account:

1. Navigate to **Roles** from the side menu.

2. Click on the edit button of the role you want to modify.

    <img src="/images/prowler-app/rbac/role_edit.png" alt="Edit Role" width="700" />

3. Adjust the settings as needed and save the changes.

    <img src="/images/prowler-app/rbac/role_edit_details.png" alt="Edit Role Details" width="700" />


#### Removing a Role

Follow these steps to remove a role of your account:

1. Navigate to **Roles** from the side menu.

2. Click on the delete button of the role you want to remove.

    <img src="/images/prowler-app/rbac/role_remove.png" alt="Remove Role" width="700" />


## RBAC Administrative Permissions

Assign administrative permissions by selecting from the following options:

**Invite and Manage Users:** Invite new users and manage existing ones.<br />
**Manage Account:** Adjust account settings, delete users and read/manage users permissions.<br />
**Manage Scans:** Run and review scans.<br />
**Manage Cloud Providers:** Add or modify connected cloud providers.<br />
**Manage Integrations:** Add or modify the Prowler Integrations.

To grant all administrative permissions, select the **Grant all admin permissions** option.
```

--------------------------------------------------------------------------------

---[FILE: prowler-app-s3-integration.mdx]---
Location: prowler-master/docs/user-guide/tutorials/prowler-app-s3-integration.mdx

```text
---
title: 'Amazon S3 Integration'
---

import { VersionBadge } from "/snippets/version-badge.mdx"

<VersionBadge version="5.10.0" />

**Prowler App** allows automatic export of scan results to Amazon S3 buckets, providing seamless integration with existing data workflows and storage infrastructure. This comprehensive guide demonstrates configuration and management of Amazon S3 integrations to streamline security finding management and reporting.

When enabled and configured, scan results are automatically stored in the configured bucket. Results are provided in `csv`, `html` and `json-ocsf` formats, offering flexibility for custom integrations:

{/* TODO: remove the comment once the AWS Security Hub integration is completed */}
{/* - json-asff */}
{/*
<Note>
The `json-asff` file will be only present in your configured Amazon S3 Bucket if you have the AWS Security Hub integration enabled. You can get more information about that integration here.
</Note>
*/}

<Note>
Enabling this integration incurs costs in Amazon S3. Refer to [Amazon S3 pricing](https://aws.amazon.com/s3/pricing/) for more information.


</Note>
The Amazon S3 Integration provides the following capabilities:

- **Automate scan result exports** to designated S3 buckets after each scan

- **Configure separate bucket destinations** for different cloud providers or use cases

- **Customize export paths** within buckets for organized storage

- **Support multiple authentication methods** including IAM roles and static credentials

- **Verify connection reliability** through built-in connection testing

- **Manage integrations independently** with separate configuration and credential controls


## Required Permissions

Before configuring the Amazon S3 Integration, ensure that AWS credentials and optionally the IAM Role used for S3 access have the necessary permissions to write scan results to the designated S3 bucket. This requirement applies when using static credentials, session credentials, or an IAM role (either self-created or generated using [Prowler's permissions templates](#available-templates)).

### IAM Policy

The S3 integration requires the following permissions. Add these to the IAM role policy, or ensure AWS credentials have these permissions:

```json title="s3:DeleteObject"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Condition": {
                "StringEquals": {
                    "s3:ResourceAccount": "<BUCKET AWS ACCOUNT NUMBER>"
                }
            },
            "Action": [
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::<BUCKET NAME>/*test-prowler-connection.txt"
            ],
            "Effect": "Allow"
        }
    ]
}
```

`s3:DeleteObject` permission is required for connection testing. When testing the S3 integration, Prowler creates a temporary beacon file, `test-prowler-connection.txt`, to verify write permissions, then deletes it to confirm the connection is working properly.

```json title="s3:PutObject"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Condition": {
                "StringEquals": {
                    "s3:ResourceAccount": "<BUCKET AWS ACCOUNT NUMBER>"
                }
            },
            "Action": [
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::<BUCKET NAME>/*"
            ],
            "Effect": "Allow"
        }
    ]
}
```

```json title="s3:ListBucket"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Condition": {
                "StringEquals": {
                    "s3:ResourceAccount": "<BUCKET AWS ACCOUNT NUMBER>"
                }
            },
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::<BUCKET NAME>"
            ],
            "Effect": "Allow"
        }
    ]
}
```

<Note>
Replace `<BUCKET AWS ACCOUNT NUMBER>` with the AWS account ID that owns the destination S3 bucket, and `<BUCKET NAME>` with the actual bucket name.

</Note>
### Cross-Account S3 Bucket

If the S3 destination bucket is in a different AWS account than the one providing the credentials for S3 access, configure a bucket policy on the destination bucket to allow cross-account access.

The following diagrams illustrate the three common S3 integration scenarios:

##### Same Account Setup (No Bucket Policy Required)

When both the IAM credentials and destination S3 bucket are in the same AWS account, no additional bucket policy is required.

![](/images/prowler-app/s3/s3-same-account.png)

##### Cross-Account Setup (Bucket Policy Required)

When the S3 bucket is in a different AWS account, you must configure a bucket policy to allow cross-account access.

![](/images/prowler-app/s3/s3-cross-account.png)

##### Multi-Account Setup (Multiple Principals in Bucket Policy)

When multiple AWS accounts need to write to the same destination bucket, configure the bucket policy with multiple principals.

![](/images/prowler-app/s3/s3-multiple-accounts.png)

#### S3 Bucket Policy

Apply the following bucket policy to the destination S3 bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Effect": "Allow",
          "Principal": {
              "AWS": "arn:aws:iam::<SOURCE ACCOUNT ID>:role/ProwlerScan"
          },
          "Action": "s3:PutObject",
          "Resource": "arn:aws:s3:::<BUCKET NAME>/*"
      },
      {
          "Effect": "Allow",
          "Principal": {
              "AWS": "arn:aws:iam::<SOURCE ACCOUNT ID>:role/ProwlerScan"
          },
          "Action": "s3:DeleteObject",
          "Resource": "arn:aws:s3:::<BUCKET NAME>/*test-prowler-connection.txt"
      },
       {
          "Effect": "Allow",
          "Principal": {
              "AWS": "arn:aws:iam::<SOURCE ACCOUNT ID>:role/ProwlerScan"
          },
          "Action": "s3:ListBucket",
          "Resource": "arn:aws:s3:::<BUCKET NAME>"
      }
  ]
}
```

<Note>
Replace `<SOURCE ACCOUNT ID>` with the AWS account ID that contains the IAM role and `<BUCKET NAME>` with the destination bucket name. The role name `ProwlerScan` is the default name when using Prowler's permissions templates. If using a custom IAM role or different authentication method, replace `ProwlerScan` with the actual role name.

</Note>
##### Multi-Account Configuration

For multiple AWS accounts, modify the `Principal` field to an array:

```json
"Principal": {
    "AWS": [
        "arn:aws:iam::<SOURCE ACCOUNT ID 1>:role/ProwlerScan",
        "arn:aws:iam::<SOURCE ACCOUNT ID 2>:role/ProwlerScan"
    ]
}
```

<Note>
Replace `<SOURCE ACCOUNT ID>` with the AWS account ID that contains the IAM role and `<BUCKET NAME>` with the destination bucket name. The role name `ProwlerScan` is the default name when using Prowler's permissions templates. If using a custom IAM role or different authentication method, replace `ProwlerScan` with the actual role name.

</Note>
### Available Templates

**Prowler App** provides Infrastructure as Code (IaC) templates to automate IAM role setup with S3 integration permissions.

<Note>
Templates are optional. Custom IAM roles or static credentials can be used instead.

</Note>
Choose from the following deployment options:

- [CloudFormation](https://prowler-cloud-public.s3.eu-west-1.amazonaws.com/permissions/templates/aws/cloudformation/prowler-scan-role.yml)
- [Terraform](https://github.com/prowler-cloud/prowler/tree/master/permissions/templates/terraform)

#### CloudFormation

##### AWS CLI

When using Prowler's CloudFormation template, execute the following command to update the existing Prowler stack:

```bash
aws cloudformation update-stack \
  --capabilities CAPABILITY_IAM --capabilities CAPABILITY_NAMED_IAM \
  --stack-name "Prowler" \
  --template-url "https://prowler-cloud-public.s3.eu-west-1.amazonaws.com/permissions/templates/aws/cloudformation/prowler-scan-role.yml" \
  --parameters \
      ParameterKey=EnableS3Integration,ParameterValue="true" \
      ParameterKey=ExternalId,ParameterValue="your-external-id" \
      ParameterKey=S3IntegrationBucketName,ParameterValue="your-bucket-name" \
      ParameterKey=S3IntegrationBucketAccountId,ParameterValue="your-bucket-aws-account-id-owner"
```

Alternatively, if you don't have the `ProwlerScan` IAM Role, execute the following command to create the CloudFormation stack:

```bash
aws cloudformation create-stack \
 --capabilities CAPABILITY_IAM --capabilities CAPABILITY_NAMED_IAM \
 --stack-name "Prowler" \
 --template-url "https://prowler-cloud-public.s3.eu-west-1.amazonaws.com/permissions/templates/aws/cloudformation/prowler-scan-role.yml" \
 --parameters \
      ParameterKey=EnableS3Integration,ParameterValue="true" \
      ParameterKey=ExternalId,ParameterValue="your-external-id" \
      ParameterKey=S3IntegrationBucketName,ParameterValue="your-bucket-name" \
      ParameterKey=S3IntegrationBucketAccountId,ParameterValue="your-bucket-aws-account-id-owner"
```

A CloudFormation Quick Link is also available [here](https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateURL=https%3A%2F%2Fprowler-cloud-public.s3.eu-west-1.amazonaws.com%2Fpermissions%2Ftemplates%2Faws%2Fcloudformation%2Fprowler-scan-role.yml&stackName=Prowler&param_EnableS3Integration=true)

##### AWS Console

If using Prowler's CloudFormation template, execute the following command to update the existing Prowler stack:


1. Navigate to CloudFormation service in the AWS region you are using
2. Select "ProwlerScan", click "Update" and then "Make a direct update"
3. Replace template, uploading the [CloudFormation template](https://prowler-cloud-public.s3.eu-west-1.amazonaws.com/permissions/templates/aws/cloudformation/prowler-scan-role.yml)
4. Configure parameters:
    - `ExternalId`: Keep existing value
    - `EnableS3Integration`: Select "true"
    - `S3IntegrationBucketName`: Your bucket name
    - `S3IntegrationBucketAccountId`: Bucket owner's AWS account ID
5. In the "Configure stack options" screen, again, leave everything as it is and click on "Next"
6. Finally, under "Review Prowler", at the bottom click on "Submit"

#### Terraform

1. Download the Terraform code:
   ```bash
   # Clone or download from GitHub
   git clone https://github.com/prowler-cloud/prowler.git
   cd prowler/permissions/templates/terraform
   ```

2. Configure your variables:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. Edit `terraform.tfvars` with your specific values:
   ```hcl
   # Required: External ID from Prowler App
   external_id = "your-unique-external-id-here"

   # S3 Integration Configuration
   enable_s3_integration = true
   s3_integration_bucket_name = "your-s3-bucket-name"
   s3_integration_bucket_account_id = "123456789012"  # Bucket owner's AWS Account ID
   ```

4. Deploy the infrastructure:
   ```bash
   terraform init
   terraform plan    # Review the planned changes
   terraform apply   # Type 'yes' when prompted
   ```

5. After successful deployment, Terraform will display important values:
   ```
   Outputs:
   prowler_role_arn        = "arn:aws:iam::123456789012:role/ProwlerScan"
   prowler_role_name       = "ProwlerScan"
   s3_integration_enabled  = "true"
   ```

6. Copy the `prowler_role_arn`, as it's required to complete the S3 integration credentials configuration.

For detailed information, refer to the [Terraform README](https://github.com/prowler-cloud/prowler/blob/master/permissions/templates/terraform/README.md).

---

## Configuration

Once the required permissions are set up, proceed to configure the S3 integration in **Prowler App**.

1. Navigate to "Integrations"
    ![Navigate to integrations](/images/prowler-app/s3/s3-integration-ui-1.png)
2. Locate the Amazon S3 Integration card and click on the "Configure" button
    ![Access S3 integration](/images/prowler-app/s3/s3-integration-ui-2.png)
3. Click the "Add Integration" button
    ![Add integration button](/images/prowler-app/s3/s3-integration-ui-3.png)
4. Complete the configuration form with the following details:

    - **Cloud Providers:** Select the providers whose scan results should be exported to this S3 bucket
    - **Bucket Name:** Enter the name of the target S3 bucket (e.g., `my-security-findings-bucket`)
    - **Output Directory:** Specify the directory path within the bucket (e.g., `/prowler-findings/`, defaults to `output`)

    ![Configuration form](/images/prowler-app/s3/s3-integration-ui-4.png)

6. Click "Next" to configure credentials
7. Configure AWS authentication using one of the supported methods:

    - **AWS SDK Default:** Use default AWS credentials from the environment. For Prowler Cloud users, this is the recommended option as the service has AWS credentials to assume IAM roles with ARNs matching `arn:aws:iam::*:role/Prowler*` or `arn:aws:iam::*:role/prowler*`
    - **Access Keys:** Provide AWS access key ID and secret access key
    - **IAM Role (optional):** Specify the IAM Role ARN, external ID, and optional session parameters

    ![Credentials configuration](/images/prowler-app/s3/s3-integration-ui-5.png)

8. Optional - For IAM role authentication, complete the required fields:

    - **Role ARN:** The Amazon Resource Name of the IAM role
    - **External ID:** Unique identifier for additional security (defaults to Tenant/Organization ID) - mandatory and automatically filled
    - **Role Session Name:** Optional - name for the assumed role session
    - **Session Duration:** Optional - duration in seconds for the session

9. Click "Create Integration" to verify the connection and complete the setup

<Check>
Once credentials are configured and the connection test passes, the S3 integration will be active. Scan results will automatically be exported to the specified bucket after each scan completes. Run a new scan and check the S3 bucket to verify the integration is working.

</Check>
<Note>
Scan outputs are processed after scan completion. Depending on scan size and network conditions, exports may take a few minutes to appear in the S3 bucket.
</Note>
---


### Integration Status

Once the integration is active, monitor its status and make adjustments as needed through the integrations management interface.

1. Review configured integrations in the management interface
2. Each integration displays:

    - **Connection Status:** Connected or Disconnected indicator
    - **Bucket Information:** Bucket name and output directory
    - **Last Checked:** Timestamp of the most recent connection test

    ![Integration status view](/images/prowler-app/s3/s3-integration-ui-6.png)

#### Actions

![Action buttons](/images/prowler-app/s3/s3-integration-ui-7.png)

Each S3 integration provides several management actions accessible through dedicated buttons:

| Button | Purpose | Available Actions | Notes |
|--------|---------|------------------|-------|
| **Test** | Verify integration connectivity | • Test AWS credential validity<br/>• Check S3 bucket accessibility<br/>• Verify write permissions<br/>• Validate connection setup | Results displayed in notification message |
| **Config** | Modify integration settings | • Update selected cloud providers<br/>• Change bucket name<br/>• Modify output directory path | Click "Update Configuration" to save changes |
| **Credentials** | Update authentication settings | • Modify AWS access keys<br/>• Update IAM role configuration<br/>• Change authentication method | Click "Update Credentials" to save changes |
| **Enable/Disable** | Toggle integration status | • Enable integration to start exporting results<br/>• Disable integration to pause exports | Status change takes effect immediately |
| **Delete** | Remove integration permanently | • Permanently delete integration<br/>• Remove all configuration data | ⚠️ **Cannot be undone** - confirm before deleting |

<Tip>
**Management Best Practices**

- Test the integration after any configuration changes
- Use the Enable/Disable toggle for temporary changes instead of deleting


</Tip>
---

## Understanding S3 Export Structure

When the S3 integration is enabled and a scan completes, Prowler creates a folder inside the specified bucket path (using `output` as the default folder name) with subfolders for each output format:

- Regular: `prowler-output-{provider-uid}-{timestamp}.{extension}`
- Compliance: `prowler-output-{provider-uid}-{timestamp}_{compliance_framework}.{extension}`

```
output/
├── compliance/
│   └── prowler-output-111122223333-20250805120000_cis_5.0_aws.csv
├── csv/
│   └── prowler-output-111122223333-20250805120000.csv
├── html/
│   └── prowler-output-111122223333-20250805120000.html
└── json-ocsf/
    └── prowler-output-111122223333-20250805120000.ocsf.json
```

![](/images/prowler-app/s3/s3-output-folder.png)

For detailed information about Prowler's reporting formats, refer to the [Prowler reporting documentation](https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/reporting/).

## Troubleshooting

**Connection test fails:**

- Check AWS credentials are valid
- If using IAM Role, check its permissions
- Verify bucket permissions and region
- Confirm network access to S3

**No scan results in bucket:**

- Ensure integration shows "Connected"
- Check that provider is associated with integration
- Verify bucket policies allow writes
```

--------------------------------------------------------------------------------

---[FILE: prowler-app-security-hub-integration.mdx]---
Location: prowler-master/docs/user-guide/tutorials/prowler-app-security-hub-integration.mdx

```text
---
title: "AWS Security Hub Integration"
---
import { VersionBadge } from "/snippets/version-badge.mdx"

<VersionBadge version="5.11.0" />

Prowler App enables automatic export of security findings to AWS Security Hub, providing seamless integration with AWS's native security and compliance service. This comprehensive guide demonstrates how to configure and manage AWS Security Hub integrations to centralize security findings and enhance compliance tracking across AWS environments.

Integrating Prowler App with AWS Security Hub provides:

* **Centralized security visibility:** Consolidate findings from multiple AWS accounts and regions
* **Native AWS integration:** Leverage existing AWS security workflows and compliance frameworks
* **Automated finding management:** Archive resolved findings and filter results based on severity
* **Cost optimization:** Send only failed findings to reduce AWS Security Hub costs
* **Real-time updates:** Automatically export findings after each scan completion

## How It Works

When enabled and configured:

1. Scan results are automatically sent to AWS Security Hub after each scan completes
2. Findings are formatted in [AWS Security Finding Format](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-format.html) (ASFF)
3. The integration automatically detects new AWS regions to send findings if the Prowler partner integration is enabled
4. Previously resolved findings are archived to maintain clean Security Hub dashboards

<Note>
Refer to [AWS Security Hub pricing](https://aws.amazon.com/security-hub/pricing/) for cost information.

</Note>
## Prerequisites

Before configuring AWS Security Hub Integration in Prowler App, complete these steps:

### AWS Security Hub Setup

Enable the Prowler partner integration in AWS Security Hub by following the [AWS Security Hub setup documentation](/user-guide/providers/aws/securityhub#enabling-aws-security-hub-for-prowler-integration).

### AWS Authentication

Configure AWS credentials by following the [AWS authentication setup guide](/user-guide/providers/aws/getting-started-aws#step-3-set-up-aws-authentication).

## Configuration

To configure AWS Security Hub integration in Prowler App:

1. Navigate to **Integrations** in the Prowler App interface
2. Locate the **AWS Security Hub** card and click **Manage**, then select **Add integration**

    ![Integrations tab](/images/prowler-app/security-hub/integrations-tab.png)

3. Complete the integration settings

* **AWS Provider:** Select the AWS provider whose findings should be exported to Security Hub
* **Send Only Failed Findings:** Filter out `PASS` findings to reduce AWS Security Hub costs (enabled by default)
* **Archive Previous Findings:** Automatically archive findings resolved since the last scan to maintain clean Security Hub dashboards

    ![Integration settings](/images/prowler-app/security-hub/integration-settings.png)

4. Configure authentication:

Choose the appropriate authentication method:

* **Use Provider Credentials** (recommended): Leverages the AWS provider's existing credentials

    <Tip>
    **Simplified Credential Management**

        Using provider credentials reduces administrative complexity by managing a single set of credentials instead of maintaining separate authentication mechanisms. This approach minimizes security risks and provides the most efficient integration path when the AWS account has sufficient permissions to export findings to Security Hub.

    </Tip>
* **Custom Credentials:** Configure separate credentials specifically for Security Hub access


5. Click **Create integration** to enable the integration

    ![Create integration](/images/prowler-app/security-hub/create-integration.png)

Once configured successfully, findings from subsequent scans will automatically appear in AWS Security Hub.

### Integration Status

Once the integration is active, monitor its status and make adjustments as needed through the integrations management interface.

1. Review configured integrations in the management interface
2. Each integration displays:

    - **Connection Status:** Connected or Disconnected indicator.
    - **Provider Information:** Selected AWS provider name.
    - **Finding Filters:** Status of failed-only and archive settings.
    - **Last Checked:** Timestamp of the most recent connection test.
    - **Regions:** List of regions where the integration is active.

#### Actions

Each Security Hub integration provides several management actions accessible through dedicated buttons:

| Button | Purpose | Available Actions | Notes |
|--------|---------|------------------|-------|
| **Test** | Verify integration connectivity | • Test AWS credential validity<br/>• Check Security Hub accessibility<br/>• Detect enabled regions automatically<br/>• Validate finding export capability | Results displayed in notification message |
| **Config** | Modify integration settings | • Update AWS provider selection<br/>• Change finding filter settings<br/>• Modify archive preferences | Click "Update Configuration" to save changes |
| **Credentials** | Update authentication settings | • Switch between provider/custom credentials<br/>• Update AWS access keys<br/>• Change IAM role configuration | Click "Update Credentials" to save changes |
| **Enable/Disable** | Toggle integration status | • Enable integration to start exporting findings<br/>• Disable integration to pause exports | Status change takes effect immediately |
| **Delete** | Remove integration permanently | • Permanently delete integration<br/>• Remove all configuration data | ⚠️ **Cannot be undone** - confirm before deleting |

<Tip>
**Management Best Practices**

- Test the integration after any configuration changes
- Use the Enable/Disable toggle for temporary changes instead of deleting
- Monitor the Last Checked timestamp to ensure recent connectivity


</Tip>
## Viewing Findings in AWS Security Hub

After successful configuration and scan completion, Prowler findings automatically appear in AWS Security Hub. For detailed information about accessing and interpreting findings in the Security Hub console, refer to the [AWS Security Hub findings documentation](/user-guide/providers/aws/securityhub#viewing-prowler-findings-in-aws-security-hub).


## Troubleshooting

**Connection test fails:**

- Verify AWS Security Hub is enabled in target regions
- Confirm Prowler integration is accepted in Security Hub
- Check IAM permissions include required Security Hub actions
- If using IAM Role, verify trust policy and External ID

**No findings in Security Hub:**

- Ensure integration shows "Connected" status
- Verify a scan has completed after enabling integration
- Check Security Hub console in the correct region
- Confirm finding filters match expectations

**Authentication errors:**

- For provider credentials, verify provider configuration
- For custom credentials, check access key validity
- For IAM roles, confirm role ARN and External ID match
```

--------------------------------------------------------------------------------

---[FILE: prowler-app-social-login.mdx]---
Location: prowler-master/docs/user-guide/tutorials/prowler-app-social-login.mdx

```text
---
title: 'Social Login Configuration'
---

import { VersionBadge } from "/snippets/version-badge.mdx"

<VersionBadge version="5.5.0" />

**Prowler App** supports social login using Google and GitHub OAuth providers. This document guides you through configuring the required environment variables to enable social authentication.

<img src="/images/prowler-app/social-login/social_login_buttons.png" alt="Social login buttons" width="700"  />
## Configuring Social Login Credentials

To enable social login with Google and GitHub, you must define the following environment variables:

### Google OAuth Configuration

Set the following environment variables for Google OAuth:

```env
SOCIAL_GOOGLE_OAUTH_CLIENT_ID=""
SOCIAL_GOOGLE_OAUTH_CLIENT_SECRET=""
```

### GitHub OAuth Configuration

Set the following environment variables for GitHub OAuth:

```env
SOCIAL_GITHUB_OAUTH_CLIENT_ID=""
SOCIAL_GITHUB_OAUTH_CLIENT_SECRET=""
```

### Important Notes

- If either `SOCIAL_GOOGLE_OAUTH_CLIENT_ID` or `SOCIAL_GOOGLE_OAUTH_CLIENT_SECRET` is empty or not defined, the Google login button will be disabled.
- If either `SOCIAL_GITHUB_OAUTH_CLIENT_ID` or `SOCIAL_GITHUB_OAUTH_CLIENT_SECRET` is empty or not defined, the GitHub login button will be disabled.

<img src="/images/prowler-app/social-login/social_login_buttons_disabled.png" alt="Social login buttons disabled" width="700"  />
## Obtaining OAuth Credentials

To obtain `CLIENT_ID` and `CLIENT_SECRET` for each provider, follow their official documentation:

- **Google OAuth**: [Google OAuth Credentials Setup](https://developers.google.com/identity/protocols/oauth2)
- **GitHub OAuth**: [GitHub OAuth App Setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

### Overview of the Steps

For both providers, the process generally involves:

1. Registering your application in the provider's developer portal.
2. Defining the authorized redirect URL (`SOCIAL_<PROVIDER>_OAUTH_CALLBACK_URL`).
3. Copying the generated `CLIENT_ID` and `CLIENT_SECRET` into the corresponding environment variables.

Once completed, ensure your environment variables are correctly loaded in your Prowler deployment to activate social login.
```

--------------------------------------------------------------------------------

---[FILE: prowler-app-sso-entra.mdx]---
Location: prowler-master/docs/user-guide/tutorials/prowler-app-sso-entra.mdx

```text
---
title: 'Entra ID Configuration'
---

This page provides instructions for creating and configuring a Microsoft Entra ID (formerly Azure AD) application to use SAML SSO with Prowler App.

You can find a walkthrough video [here](https://www.youtube.com/watch?v=zegqm55oJVk).

## Creating and Configuring the Enterprise Application

1. From the "Enterprise Applications" page in the Azure Portal, click "+ New application".

    ![New application](/images/prowler-app/saml/saml-sso-azure-1.png)

2. At the top of the page, click "+ Create your own application".

    ![Create application](/images/prowler-app/saml/saml-sso-azure-2.png)

3. Enter a name for the application and select the "Integrate any other application you don't find in the gallery (Non-gallery)" option.

    ![Enter name](/images/prowler-app/saml/saml-sso-azure-3.png)

4. Assign users and groups to the application, then proceed to "Set up single sign on" and select "SAML" as the method.

    ![Select SAML](/images/prowler-app/saml/saml-sso-azure-4.png)

5. In the "Basic SAML Configuration" section, click "Edit".

    ![Edit](/images/prowler-app/saml/saml-sso-azure-5.png)

6. Enter the "Identifier (Entity ID)" and "Reply URL (Assertion Consumer Service URL)". These values can be obtained from the SAML SSO integration setup in Prowler App. For detailed instructions, refer to the [SAML SSO Configuration](/user-guide/tutorials/prowler-app-sso) page.

    ![Enter data](/images/prowler-app/saml/saml-sso-azure-6.png)

7. In the "SAML Certificates" section, click "Edit".

    ![Edit](/images/prowler-app/saml/saml-sso-azure-7.png)

8. For the "Signing Option," select "Sign SAML response and assertion", and then click "Save".

    ![Signing options](/images/prowler-app/saml/saml-sso-azure-8.png)

9. Once the changes are saved, the metadata XML can be downloaded from the "App Federation Metadata Url".

    ![Metadata XML](/images/prowler-app/saml/saml-sso-azure-9.png)

10. Save the downloaded Metadata XML to a file. To complete the setup, upload this file during the Prowler App integration. (See the [SAML SSO Configuration](/user-guide/tutorials/prowler-app-sso) page for details).
```

--------------------------------------------------------------------------------

````
