---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 88
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 88 of 867)

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

---[FILE: fixer.mdx]---
Location: prowler-master/docs/user-guide/cli/tutorials/fixer.mdx

```text
---
title: 'Prowler Fixers (Remediations)'
---

Prowler allows you to fix some of the failed findings it identifies. You can use the `--fixer` flag to run the fixes that are available for the checks that failed.

```sh
prowler <provider> -c <check_to_fix_1> <check_to_fix_2> ... --fixer
```

<img src="/images/cli/fixer.png" />

<Note>
You can see all the available fixes for each provider with the `--list-remediations` or `--list-fixers` flag.

```sh
prowler <provider> --list-fixers
```

</Note>
It's important to note that using the fixers for `Access Analyzer`, `GuardDuty`, and `SecurityHub` may incur additional costs. These AWS services might trigger actions or deploy resources that can lead to charges on your AWS account.

## Writing a Fixer

To write a fixer, you need to create a file called `<check_id>_fixer.py` inside the check folder, with a function called `fixer` that receives either the region or the resource to be fixed as a parameter, and returns a boolean value indicating if the fix was successful or not.

For example, the regional fixer for the `ec2_ebs_default_encryption` check, which enables EBS encryption by default in a region, would look like this:

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


def fixer(region):
    """
    Enable EBS encryption by default in a region. Note: Custom KMS keys for EBS Default Encryption may be overwritten. Requires the ec2:EnableEbsEncryptionByDefault permission.
    It can be set as follows:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "ec2:EnableEbsEncryptionByDefault",
                "Resource": "*"
            }
        ]
    }
    Args:
        region (str): AWS region
    Returns:
        bool: True if EBS encryption by default is enabled, False otherwise
    """
    try:
        regional_client = ec2_client.regional_clients[region]
        return regional_client.enable_ebs_encryption_by_default()[
            "EbsEncryptionByDefault"
        ]
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
```

On the other hand, the fixer for the `s3_account_level_public_access_blocks` check, which enables the account-level public access blocks for S3, would look like this:

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.s3.s3control_client import s3control_client


def fixer(resource_id: str) -> bool:
    """
    Enable S3 Block Public Access for the account. Note: Custom KMS keys for EBS Default Encryption may be overwritten. By blocking all S3 public access you may break public S3 buckets.
    Requires the s3:PutAccountPublicAccessBlock permission:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:PutAccountPublicAccessBlock",
                "Resource": "*"
            }
        ]
    }
    Returns:
        bool: True if S3 Block Public Access is enabled, False otherwise
    """
    try:
        s3control_client.client.put_public_access_block(
            AccountId=resource_id,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": True,
                "IgnorePublicAcls": True,
                "BlockPublicPolicy": True,
                "RestrictPublicBuckets": True,
            },
        )
    except Exception as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

## Fixer Config file

For some fixers, you can have configurable parameters depending on your use case. You can either use the default config file in `prowler/config/fixer_config.yaml` or create a custom config file and pass it to the fixer with the `--fixer-config` flag. The config file should be a YAML file with the following structure:

```yaml
# Fixer configuration file
aws:
  # ec2_ebs_default_encryption
  # No configuration needed for this check

  # s3_account_level_public_access_blocks
  # No configuration needed for this check

  # iam_password_policy_* checks:
  iam_password_policy:
      MinimumPasswordLength: 14
      RequireSymbols: True
      RequireNumbers: True
      RequireUppercaseCharacters: True
      RequireLowercaseCharacters: True
      AllowUsersToChangePassword: True
      MaxPasswordAge: 90
      PasswordReusePrevention: 24
      HardExpiry: False

  # accessanalyzer_enabled
  accessanalyzer_enabled:
    AnalyzerName: "DefaultAnalyzer"
    AnalyzerType: "ACCOUNT_UNUSED_ACCESS"

  # guardduty_is_enabled
  # No configuration needed for this check

  # securityhub_enabled
  securityhub_enabled:
    EnableDefaultStandards: True

  # cloudtrail_multi_region_enabled
  cloudtrail_multi_region_enabled:
    TrailName: "DefaultTrail"
    S3BucketName: "my-cloudtrail-bucket"
    IsMultiRegionTrail: True
    EnableLogFileValidation: True
    # CloudWatchLogsLogGroupArn: "arn:aws:logs:us-east-1:123456789012:log-group:my-cloudtrail-log-group"
    # CloudWatchLogsRoleArn: "arn:aws:iam::123456789012:role/my-cloudtrail-role"
    # KmsKeyId: "arn:aws:kms:us-east-1:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab"

  # kms_cmk_rotation_enabled
  # No configuration needed for this check

  # ec2_ebs_snapshot_account_block_public_access
  ec2_ebs_snapshot_account_block_public_access:
    State: "block-all-sharing"

  # ec2_instance_account_imdsv2_enabled
  # No configuration needed for this check
```
```

--------------------------------------------------------------------------------

---[FILE: integrations.mdx]---
Location: prowler-master/docs/user-guide/cli/tutorials/integrations.mdx

```text
---
title: 'Integrations'
---

## Integration with Slack

Prowler can be integrated with [Slack](https://slack.com/) to send a summary of the execution having configured a Slack APP in your channel with the following command:

```sh
prowler <provider> --slack
```

![Prowler Slack Message](/images/cli/slack-prowler-message.png)

<Note>
Slack integration needs `SLACK_API_TOKEN` and `SLACK_CHANNEL_NAME` environment variables.

</Note>
### Configuration of the Integration with Slack

To configure the Slack Integration, follow the next steps:

1. Create a Slack Application:
    - Go to [Slack API page](https://api.slack.com/tutorials/tracks/getting-a-token), scroll down to the *Create app* button and select your workspace:
    ![Create Slack App](/images/cli/create-slack-app.png)

    - Install the application in your selected workspaces:
    ![Install Slack App in Workspace](/images/cli/install-in-slack-workspace.png)

    - Get the *Slack App OAuth Token* that Prowler needs to send the message:
    ![Slack App OAuth Token](/images/cli/slack-app-token.png)

2. Optionally, create a Slack Channel (you can use an existing one)

3. Integrate the created Slack App to your Slack channel:
    - Click on the channel, go to the Integrations tab, and Add an App.
    ![Slack App Channel Integration](/images/cli/integrate-slack-app.png)

4. Set the following environment variables that Prowler will read:
    - `SLACK_API_TOKEN`: the *Slack App OAuth Token* that was previously get.
    - `SLACK_CHANNEL_NAME`: the name of your Slack Channel where Prowler will send the message.
```

--------------------------------------------------------------------------------

---[FILE: logging.mdx]---
Location: prowler-master/docs/user-guide/cli/tutorials/logging.mdx

```text
---
title: 'Logging'
---

Prowler has a logging feature to be as transparent as possible, so that you can see every action that is being performed whilst the tool is being executing.

## Set Log Level

There are different log levels depending on the logging information that is desired to be displayed:

- **DEBUG**: It will show low-level logs from Python.
- **INFO**: It will show all the API calls that are being invoked by the provider.
- **WARNING**: It will show all resources that are being **muted**.
- **ERROR**: It will show any errors, e.g., not authorized actions.
- **CRITICAL**: The default log level. If a critical log appears, it will **exit** Prowler’s execution.

You can establish the log level of Prowler with `--log-level` option:

```console
prowler <provider> --log-level {DEBUG,INFO,WARNING,ERROR,CRITICAL}
```

<Note>
By default, Prowler will run with the `CRITICAL` log level, since critical errors will abort the execution.

</Note>
## Export Logs to File

Prowler allows you to export the logs in json format with the `--log-file` option:

```console
prowler <provider> --log-level {DEBUG,INFO,WARNING,ERROR,CRITICAL} --log-file <file_name>.json
```

An example of a log file will be the following:

```json
{
    "timestamp": "2022-12-01 16:45:56,399",
    "filename": "ec2_service.py:114",
    "level": "ERROR",
    "module": "ec2_service",
    "message": "eu-west-2 -- ClientError[102]: An error occurred (UnauthorizedOperation) when calling the DescribeSecurityGroups operation: You are not authorized to perform this operation."
}
{
    "timestamp": "2022-12-01 16:45:56,438",
    "filename": "ec2_service.py:134",
    "level": "ERROR",
    "module": "ec2_service",
    "message": "eu-west-2 -- ClientError[124]: An error occurred (UnauthorizedOperation) when calling the DescribeNetworkAcls operation: You are not authorized to perform this operation."
}
```

<Note>
Each finding is represented as a `json` object.

</Note>
```

--------------------------------------------------------------------------------

---[FILE: misc.mdx]---
Location: prowler-master/docs/user-guide/cli/tutorials/misc.mdx

```text
---
title: 'Miscellaneous'
---

## Prowler Version

### Showing the Prowler version:

```console
prowler <provider> -V/-v/--version
```

## Prowler Execution Options

Prowler provides various execution settings.

### Verbose Execution

To enable verbose mode in Prowler, similar to Version 2, use:

```console
prowler <provider> --verbose
```

### Filter findings by status

Prowler allows filtering findings based on their status, ensuring reports and CLI display only relevant findings:

```console
prowler <provider> --status [PASS, FAIL, MANUAL]
```

### Disable Exit Code 3

By default, Prowler triggers exit code 3 for failed checks. To disable this behavior:

```console
prowler <provider> -z/--ignore-exit-code-3
```

### Hide Prowler Banner

To run Prowler without displaying the banner:

```console
prowler <provider> -b/--no-banner
```

### Disable Colors in Output

To run Prowler without color formatting:

```console
prowler <provider> --no-color
```

### Checks in Prowler

Prowler provides various security checks per cloud provider. Use the following options to list, execute, or exclude specific checks:

- **List Available Checks**: To display all available checks for the chosen provider:

```console
prowler <provider> --list-checks
```

- **Execute Specific Checks**: Run one or more specific security checks using:

```console
prowler <provider> -c/--checks s3_bucket_public_access
```

- **Exclude Specific Checks**: Exclude checks from execution with:

```console
prowler <provider> -e/--excluded-checks ec2 rds
```

- **Execute Checks from a JSON File**: To run checks defined in a JSON file, structure the file as follows:

```json
<checks_list>.json

{
    "<provider>": [
        "<check_name_1",
        "<check_name_2",
        "<check_name_3",
        ...
    ],
    ...
}
```

```console
prowler <provider> -C/--checks-file <checks_list>.json
```

## Custom Checks in Prowler

Prowler supports custom security checks, allowing users to define their own logic.

```console
prowler <provider> -x/--checks-folder <custom_checks_folder>
```

<Note>
S3 URIs are also supported for custom check folders (e.g., `s3://bucket/prefix/checks_folder/`). Ensure the credentials used have `s3:GetObject` permissions in the specified S3 path.

</Note>
**Folder Structure for Custom Checks**

Each check must reside in a dedicated subfolder, following this structure:

- `__init__.py` (empty file) – Ensures Python treats the check folder as a package.
- `check_name.py` (name file) – Defines the check’s logic for contextual information.
- `check_name.metadata.json` (metadata file) – Defines the check’s metadata for contextual information.

<Note>
The check name must start with the service name followed by an underscore (e.g., ec2\_instance\_public\_ip).

</Note>
To see more information about how to write checks, refer to the [Developer Guide](/developer-guide/checks#creating-a-check).

<Note>
If you want to run ONLY your custom check(s), import it with -x (--checks-folder) and then run it with -c (--checks), e.g.: `console prowler aws -x s3://bucket/prowler/providers/aws/services/s3/s3_bucket_policy/ -c s3_bucket_policy`

</Note>
## Severities

Each of Prowler's checks has a severity, which can be one of the following:

- informational
- low
- medium
- high
- critical

To execute specific severity(s):

```console
prowler <provider> --severity critical high
```

## Service

Prowler has services per provider, there are options related with them:

- List the available services in the provider:

```console
prowler <provider> --list-services
```

- Execute specific service(s):

```console
prowler <provider> -s/--services s3 iam
```

- Exclude specific service(s):

```console
prowler <provider> --excluded-services ec2 rds
```

## Categories

Prowler groups checks in different categories. There are options related with said categories:

- List the available categories in the provider:

```console
prowler <provider> --list-categories
```

- Execute specific category(s):

```console
prowler  <provider> --categories secrets
```
```

--------------------------------------------------------------------------------

---[FILE: mutelist.mdx]---
Location: prowler-master/docs/user-guide/cli/tutorials/mutelist.mdx

```text
---
title: 'Mutelisting'
---

**Muting Findings for Intentional Configurations**

In some cases, certain AWS resources may be intentionally configured in a way that deviates from security best practices but serves a valid use case. Examples include:

An AWS S3 bucket open to the Internet, used for hosting a public website.

An AWS security group with an open port necessary for a specific application.

**Mutelist Option Behavior**

The Mutelist option works in combination with other filtering mechanisms and modifies the output in the following way when a finding is muted:

- JSON-OCSF: `status_id` is `Suppressed`.
- CSV: `muted` is `True`. The field `status` will keep the original status, `MANUAL`, `PASS` or `FAIL`, of the finding.

## How the Mutelist Works

The **Mutelist** uses **AND logic** to evaluate whether a finding should be muted. For a finding to be muted, **ALL** of the following conditions must match:

- **Account** matches (exact match or `*`)
- **Check** matches (exact match, regex pattern, or `*`)
- **Region** matches (exact match, regex pattern, or `*`)
- **Resource** matches (exact match, regex pattern, or `*`)
- **Tags** match (if specified)

If **any** of these criteria do not match, the finding is **not muted**.

### Tag Matching Logic

Tags have special matching behavior:

- **Multiple tags in the list = AND logic**: ALL tags must be present on the resource
  ```yaml
  Tags:
    - "environment=dev"
    - "team=backend"  # BOTH tags required
  ```

- **Regex alternation within a single tag = OR logic**: Use the pipe operator `|` for OR
  ```yaml
  Tags:
    - "environment=dev|environment=stg"  # Matches EITHER dev OR stg
  ```

- **Complex tag patterns**: Combine AND and OR using regex
  ```yaml
  Tags:
    - "team=backend"  # Required
    - "environment=dev|environment=stg"  # AND (dev OR stg)
  ```

<Note>
Remember that mutelist can be used with regular expressions.

</Note>
## Mutelist Specification

<Note>
- For Azure provider, the Account ID is the Subscription Name and the Region is the Location.
- For GCP provider, the Account ID is the Project ID and the Region is the Zone.
- For Kubernetes provider, the Account ID is the Cluster Name and the Region is the Namespace.

</Note>
The Mutelist file uses the [YAML](https://en.wikipedia.org/wiki/YAML) format with the following syntax:

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Resources and tags are lists that can have either Regex or Keywords.
### Multiple tags in the list are "ANDed" together (ALL must match).
### Use regex alternation (|) within a single tag for "OR" logic (e.g., "env=dev|env=stg").
### For each check you can use Exceptions to unmute specific Accounts, Regions, Resources and/or Tags.
### All conditions (Account, Check, Region, Resource, Tags) are ANDed together.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "123456789012":
      Checks:
        "iam_user_hardware_mfa_enabled":
          Regions:
            - "us-east-1"
          Resources:
            - "user-1"           # Will mute user-1 in check iam_user_hardware_mfa_enabled
            - "user-2"           # Will mute user-2 in check iam_user_hardware_mfa_enabled
          Description: "Findings related with the check iam_user_hardware_mfa_enabled will be muted for us-east-1 region and user-1, user-2 resources"
        "ec2_*":
          Regions:
            - "*"
          Resources:
            - "*"                 # Will mute every EC2 check in every account and region
        "*":
          Regions:
            - "*"
          Resources:
            - "test"
          Tags:
            - "test=test"         # Will mute every resource containing the string "test" and the tags 'test=test' and
            - "project=test|project=stage" # either of ('project=test' OR project=stage) in account 123456789012 and every region
        "*":
            Regions:
              - "*"
            Resources:
              - "test"
            Tags:
              - "test=test"
              - "project=test"    # This will mute every resource containing the string "test" and BOTH tags at the same time.
        "*":
            Regions:
              - "*"
            Resources:
              - "test"
            Tags:                 # This will mute every resource containing the string "test" and the ones that contain EITHER the `test=test` OR `project=test` OR `project=dev`
              - "test=test|project=(test|dev)"
        "*":
            Regions:
              - "*"
            Resources:
              - "test"
            Tags:
              - "test=test"       # This will mute every resource containing the string "test" and the tags `test=test` and either `project=test` OR `project=stage` in every account and region.
              - "project=test|project=stage"

    "*":
      Checks:
        "s3_bucket_object_versioning":
          Regions:
            - "eu-west-1"
            - "us-east-1"
          Resources:
            - "ci-logs"           # Will mute bucket "ci-logs" AND ALSO bucket "ci-logs-replica" in specified check and regions
            - "logs"              # Will mute EVERY BUCKET containing the string "logs" in specified check and regions
            - ".+-logs"           # Will mute all buckets containing the terms ci-logs, qa-logs, etc. in specified check and regions
        "ecs_task_definitions_no_environment_secrets":
          Regions:
            - "*"
          Resources:
            - "*"
          Exceptions:
            Accounts:
              - "0123456789012"
            Regions:
              - "eu-west-1"
              - "eu-south-2"        # Will mute every resource in check ecs_task_definitions_no_environment_secrets except the ones in account 0123456789012 located in eu-south-2 or eu-west-1
        "*":
          Regions:
            - "*"
          Resources:
            - "*"
          Tags:
            - "environment=dev"    # Will mute every resource containing the tag 'environment=dev' in every account and region

    "123456789012":
      Checks:
        "*":
          Regions:
            - "*"
          Resources:
            - "*"
          Exceptions:
            Resources:
              - "test"
            Tags:
              - "environment=prod"   # Will mute every resource except in account 123456789012 except the ones containing the string "test" and tag environment=prod

    "*":
      Checks:
        "ec2_*":
          Regions:
            - "*"
          Resources:
            - "test-resource" # Will mute the resource "test-resource" in all accounts and regions for whatever check from the EC2 service
```


### Account, Check, Region, Resource, and Tag

| Field| Description| Logic
|----------|----------|----------
| `account_id`| Use `*` to apply the mutelist to all accounts. Supports exact match or wildcard.| `AND` (with other fields)
| `check_name`| The name of the Prowler check. Use `*` to apply the mutelist to all checks, or `service_*` to apply it to all service's checks. Supports regex patterns.| `AND` (with other fields)
| `region`| The region identifier. Use `*` to apply the mutelist to all regions. Supports regex patterns.| `AND` (with other fields)
| `resource`| The resource identifier. Use `*` to apply the mutelist to all resources. Supports regex patterns.| `AND` (with other fields)
| `tags`| List of tag patterns in `key=value` format. **Multiple tags = AND** (all must match). **Regex alternation within single tag = OR** (use `tag1\|tag2`).| `AND` between tags, `OR` within regex

### Description

This field can be used to add information or some hints for the Mutelist rule.

## How to Use the Mutelist

To use the Mutelist, you need to specify the path to the Mutelist YAML file using the `-w` or `--mutelist-file` option when running Prowler:

```
prowler <provider> -w mutelist.yaml
```

Replace `<provider>` with the appropriate provider name.

## Considerations

- The Mutelist can be used in combination with other Prowler options, such as the `--service` or `--checks` option, to further customize the scanning process.
- Make sure to review and update the Mutelist regularly to ensure it reflects the desired exclusions and remains up to date with your infrastructure.

## Current Limitations and Workarounds

### Limitation: No OR Logic Between Different Rule Sets

The current Mutelist schema **does not support OR logic** between different condition sets. Each check can have only **one rule object**, and all conditions are **ANDed** together.

**Example of unsupported scenario:**
```yaml
# ❌ INVALID: Cannot have multiple rule blocks for the same check
Accounts:
  "*":
    Checks:
      "*":  # Rule 1
        Regions: ["eu-west-1", "us-west-2"]
        Resources: ["*"]
      "*":  # Rule 2 - This will OVERWRITE Rule 1 (YAML duplicate key)
        Regions: ["us-east-1"]
        Tags: ["environment=dev"]
```

**Workaround: Use multiple scans with different mutelists**

For complex scenarios requiring OR logic, run separate scans:

```bash
# Scan 1: Mute findings in non-critical regions
prowler aws --mutelist-file mutelist_noncritical.yaml

# Scan 2: Mute dev/stg in critical regions
prowler aws --mutelist-file mutelist_critical.yaml --regions us-east-1,sa-east-1
```

Then merge the outputs in your reporting pipeline.

### Limitation: Cannot Negate Regions

You cannot express "all regions **except** X and Y". You must explicitly list all regions you want to mute.

**Workaround:**
```yaml
# Must enumerate all unwanted regions
Accounts:
  "*":
    Checks:
      "*":
        Regions:
          - "af-south-1"
          - "ap-east-1"
          # ... list all regions EXCEPT the ones you want to monitor
        Resources: ["*"]
```

### Best Practices

1. **Use regex patterns for flexibility**: Instead of listing multiple resources, use regex patterns like `"dev-.*"` or `"test-instance-[0-9]+"`

2. **Combine tag OR logic with regex**: Use `"environment=dev|environment=stg|environment=test"` instead of multiple tag entries

3. **Be specific with exceptions**: Use the `Exceptions` field to unmute specific resources within a broader muting rule

4. **Test your mutelist**: Run Prowler with `--output-modes json` and verify that the expected findings are muted

## AWS Mutelist

### Muting specific AWS regions

If you want to mute failed findings only in specific regions, create a file with the following syntax and run it with `prowler aws -w mutelist.yaml`:

    Mutelist:
      Accounts:
      "*":
        Checks:
          "*":
            Regions:
              - "ap-southeast-1"
              - "ap-southeast-2"
            Resources:
              - "*"
            Description: "Description related with the muted findings for the check"

### Default Mutelist

For the AWS Provider, Prowler is executed with a default AWS Mutelist with the AWS Resources that should be muted such as all resources created by AWS Control Tower when setting up a landing zone that can be found in [AWS Documentation](https://docs.aws.amazon.com/controltower/latest/userguide/shared-account-resources.html). You can see this Mutelist file in [`prowler/config/aws_mutelist.yaml`](https://github.com/prowler-cloud/prowler/blob/master/prowler/config/aws_mutelist.yaml).

### Supported Mutelist Locations

The mutelisting flag supports the following AWS locations when using the AWS Provider:

#### AWS S3 URI

You will need to pass the S3 URI where your Mutelist YAML file was uploaded to your bucket:

```
prowler aws -w s3://<bucket>/<prefix>/mutelist.yaml
```

<Note>
Make sure that the used AWS credentials have `s3:GetObject` permissions in the S3 path where the mutelist file is located.

</Note>
#### AWS DynamoDB Table ARN

You will need to pass the DynamoDB Mutelist Table ARN:

```
prowler aws -w arn:aws:dynamodb:<region_name>:<account_id>:table/<table_name>
```

The DynamoDB Table must have the following String keys:

  <img src="/images/cli/mutelist-keys.png" />

The Mutelist Table must have the following columns:

  - Accounts (String): This field can contain either an Account ID or an `*` (which applies to all the accounts that use this table as an mutelist).

  - Checks (String): This field can contain either a Prowler Check Name or an `*` (which applies to all the scanned checks).

  - Regions (List): This field contains a list of regions where this mutelist rule is applied (it can also contains an `*` to apply all scanned regions).

  - Resources (List): This field contains a list of regular expressions (regex) that applies to the resources that are wanted to be muted.

  - Tags (List): -Optional- This field contains a list of tuples in the form of 'key=value' that applies to the resources tags that are wanted to be muted.

  - Exceptions (Map): -Optional- This field contains a map of lists of accounts/regions/resources/tags that are wanted to be excepted in the mutelist.

The following example will mute all resources in all accounts for the EC2 checks in the regions `eu-west-1` and `us-east-1` with the tags `environment=dev` and `environment=prod`, except the resources containing the string `test` in the account `012345678912` and region `eu-west-1` with the tag `environment=prod`:

<img src="/images/cli/mutelist-row.png" />

<Note>
Make sure that the used AWS credentials have `dynamodb:PartiQLSelect` permissions in the table.

</Note>
#### AWS Lambda ARN

You will need to pass the AWS Lambda Function ARN:

```
prowler aws -w arn:aws:lambda:REGION:ACCOUNT_ID:function:FUNCTION_NAME
```

Make sure that the credentials that Prowler uses can invoke the Lambda Function:

```
- PolicyName: GetMuteList
  PolicyDocument:
    Version: '2012-10-17'
    Statement:
      - Action: 'lambda:InvokeFunction'
        Effect: Allow
        Resource: arn:aws:lambda:REGION:ACCOUNT_ID:function:FUNCTION_NAME
```

The Lambda Function can then generate an Mutelist dynamically. Here is the code an example Python Lambda Function that generates an Mutelist:

```
def handler(event, context):
  checks = {}
  checks["vpc_flow_logs_enabled"] = { "Regions": [ "*" ], "Resources": [ "" ], Optional("Tags"): [ "key:value" ] }

  al = { "Mutelist": { "Accounts": { "*": { "Checks": checks } } } }
  return al
```
```

--------------------------------------------------------------------------------

---[FILE: parallel-execution.mdx]---
Location: prowler-master/docs/user-guide/cli/tutorials/parallel-execution.mdx

```text
---
title: 'Parallel Execution'
---

The strategy used here will be to execute Prowler once per service. You can modify this approach as per your requirements.

This can help for really large accounts, but please be aware of AWS API rate limits:

1. **Service-Specific Limits**: Each AWS service has its own rate limits. For instance, Amazon EC2 might have different rate limits for launching instances versus making API calls to describe instances.
2. **API Rate Limits**: Most of the rate limits in AWS are applied at the API level. Each API call to an AWS service counts towards the rate limit for that service.
3. **Throttling Responses**: When you exceed the rate limit for a service, AWS responds with a throttling error. In AWS SDKs, these are typically represented as `ThrottlingException` or `RateLimitExceeded` errors.

For information on Prowler's retrier configuration please refer to this [page](https://docs.prowler.com/user-guide/providers/aws/boto3-configuration/).

<Note>
You might need to increase the `--aws-retries-max-attempts` parameter from the default value of 3. The retrier follows an exponential backoff strategy.

</Note>
## Linux

Generate a list of services that Prowler supports, and populate this info into a file:

```bash
prowler aws --list-services | awk -F"- " '{print $2}' | sed '/^$/d' > services
```

Make any modifications for services you would like to skip scanning by modifying this file.

Then create a new PowerShell script file `parallel-prowler.sh` and add the following contents. Update the `$profile` variable to the AWS CLI profile you want to run Prowler with.

```bash
#!/bin/bash

# Change these variables as needed
profile="your_profile"
account_id=$(aws sts get-caller-identity --profile "${profile}" --query 'Account' --output text)

echo "Executing in account: ${account_id}"

# Maximum number of concurrent processes
MAX_PROCESSES=5

# Loop through the services
while read service; do
    echo "$(date '+%Y-%m-%d %H:%M:%S'): Starting job for service: ${service}"

    # Run the command in the background
    (prowler -p "$profile" -s "$service" -F "${account_id}-${service}"  --only-logs; echo "$(date '+%Y-%m-%d %H:%M:%S') - ${service} has completed") &

    # Check if we have reached the maximum number of processes
    while [ $(jobs -r | wc -l) -ge ${MAX_PROCESSES} ]; do
        # Wait for a second before checking again
        sleep 1
    done
done < ./services

# Wait for all background processes to finish
wait
echo "All jobs completed"
```

Output will be stored in the `output/` folder that is in the same directory from which you executed the script.

## Windows

Generate a list of services that Prowler supports, and populate this info into a file:

```powershell
prowler aws --list-services | ForEach-Object {
    # Capture lines that are likely service names
    if ($_ -match '^\- \w+$') {
        $_.Trim().Substring(2)
    }
} | Where-Object {
    # Filter out empty or null lines
    $_ -ne $null -and $_ -ne ''
} | Set-Content -Path "services"
```

Make any modifications for services you would like to skip scanning by modifying this file.

Then create a new PowerShell script file `parallel-prowler.ps1` and add the following contents. Update the `$profile` variable to the AWS CLI profile you want to run Prowler with.

Change any parameters you would like when calling Prowler in the `Start-Job -ScriptBlock` section. Note that you need to keep the `--only-logs` parameter, else some encoding issue occurs when trying to render the progress-bar and Prowler won't successfully execute.

```powershell
$profile = "your_profile"
$account_id = Invoke-Expression -Command "aws sts get-caller-identity --profile $profile --query 'Account' --output text"

Write-Host "Executing Prowler in $account_id"

# Maximum number of concurrent jobs
$MAX_PROCESSES = 5

# Read services from a file
$services = Get-Content -Path "services"

# Array to keep track of started jobs
$jobs = @()

foreach ($service in $services) {
    # Start the command as a job
    $job = Start-Job -ScriptBlock {
        prowler -p ${using:profile} -s ${using:service} -F "${using:account_id}-${using:service}" --only-logs
	      $endTimestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Write-Output "${endTimestamp} - $using:service has completed"
    }
    $jobs += $job
    Write-Host "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Starting job for service: $service"

    # Check if we have reached the maximum number of jobs
    while (($jobs | Where-Object { $_.State -eq 'Running' }).Count -ge $MAX_PROCESSES) {
        Start-Sleep -Seconds 1
        # Check for any completed jobs and receive their output
        $completedJobs = $jobs | Where-Object { $_.State -eq 'Completed' }
        foreach ($completedJob in $completedJobs) {
            Receive-Job -Job $completedJob -Keep | ForEach-Object { Write-Host $_ }
            $jobs = $jobs | Where-Object { $_.Id -ne $completedJob.Id }
            Remove-Job -Job $completedJob
        }
    }
}

# Check for any remaining completed jobs
$remainingCompletedJobs = $jobs | Where-Object { $_.State -eq 'Completed' }
foreach ($remainingJob in $remainingCompletedJobs) {
    Receive-Job -Job $remainingJob -Keep | ForEach-Object { Write-Host $_ }
    Remove-Job -Job $remainingJob
}

Write-Host "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - All jobs completed"
```

Output will be stored in `C:\Users\YOUR-USER\Documents\output\`

## Combining the output files

Guidance is provided for the CSV file format. From the ouput directory, execute either the following Bash or PowerShell script. The script will collect the output from the CSV files, only include the header from the first file, and then output the result as CombinedCSV.csv in the current working directory.

There is no logic implemented in terms of which CSV files it will combine. If you have additional CSV files from other actions, such as running a quick inventory, you will need to move that out of the current (or any nested) directory, or move the output you want to combine into its own folder and run the script from there.

```bash
#!/bin/bash

# Initialize a variable to indicate the first file
firstFile=true

# Find all CSV files and loop through them
find . -name "*.csv" -print0 | while IFS= read -r -d '' file; do
    if [ "$firstFile" = true ]; then
        # For the first file, keep the header
        cat "$file" > CombinedCSV.csv
        firstFile=false
    else
        # For subsequent files, skip the header
        tail -n +2 "$file" >> CombinedCSV.csv
    fi
done
```

```powershell
# Get all CSV files from current directory and its subdirectories
$csvFiles = Get-ChildItem -Recurse -Filter "*.csv"

# Initialize a variable to track if it's the first file
$firstFile = $true

# Loop through each CSV file
foreach ($file in $csvFiles) {
    if ($firstFile) {
        # For the first file, keep the header and change the flag
        $combinedCsv = Import-Csv -Path $file.FullName
        $firstFile = $false
    } else {
        # For subsequent files, skip the header
        $tempCsv = Import-Csv -Path $file.FullName
        $combinedCsv += $tempCsv | Select-Object * -Skip 1
    }
}

# Export the combined data to a new CSV file
$combinedCsv | Export-Csv -Path "CombinedCSV.csv" -NoTypeInformation
```

## TODO: Additional Improvements

Some services need to instantiate another service to perform a check. For instance, `cloudwatch` will instantiate Prowler's `iam` service to perform the `cloudwatch_cross_account_sharing_disabled` check. When the `iam` service is instantiated, it will perform the `__init__` function, and pull all the information required for that service. This provides an opportunity for an improvement in the above script to group related services together so that the `iam` services (or any other cross-service references) isn't repeatedily instantiated by grouping dependant services together. A complete mapping between these services still needs to be further investigated, but these are the cross-references that have been noted:

* inspector2 needs lambda and ec2
* cloudwatch needs iam
* dlm needs ec2
```

--------------------------------------------------------------------------------

---[FILE: pentesting.mdx]---
Location: prowler-master/docs/user-guide/cli/tutorials/pentesting.mdx

```text
---
title: 'Pentesting'
---

Prowler has some checks that analyse pentesting risks (Secrets, Internet Exposed, AuthN, AuthZ, and more).

## Detect Secrets

Prowler uses `detect-secrets` library to search for any secrets that are stores in plaintext within your environment.

The actual checks that have this functionality are the following:

- autoscaling\_find\_secrets\_ec2\_launch\_configuration
- awslambda\_function\_no\_secrets\_in\_code
- awslambda\_function\_no\_secrets\_in\_variables
- cloudformation\_stack\_outputs\_find\_secrets
- ec2\_instance\_secrets\_user\_data
- ec2\_launch\_template\_no\_secrets
- ecs\_task\_definitions\_no\_environment\_secrets
- ssm\_document\_secrets

To execute detect-secrets related checks, you can run the following command:

```console
prowler <provider> --categories secrets
```

## Internet Exposed Resources

Several checks analyse resources that are exposed to the Internet, these are:

1. apigateway\_restapi\_public

- appstream\_fleet\_default\_internet\_access\_disabled
- awslambda\_function\_not\_publicly\_accessible
- ec2\_ami\_public
- ec2\_ebs\_public\_snapshot
- ec2\_instance\_internet\_facing\_with\_instance\_profile
- ec2\_instance\_port\_X\_exposed\_to\_internet (where X is the port number)
- ec2\_instance\_public\_ip
- ec2\_networkacl\_allow\_ingress\_any\_port
- ec2\_securitygroup\_allow\_wide\_open\_public\_ipv4
- ec2\_securitygroup\_allow\_ingress\_from\_internet\_to\_any\_port
- ecr\_repositories\_not\_publicly\_accessible
- eks\_control\_plane\_endpoint\_access\_restricted
- eks\_endpoints\_not\_publicly\_accessible
- eks\_control\_plane\_endpoint\_access\_restricted
- eks\_endpoints\_not\_publicly\_accessible
- elbv2\_internet\_facing
- kms\_key\_not\_publicly\_accessible
- opensearch\_service\_domains\_not\_publicly\_accessible
- rds\_instance\_no\_public\_access
- rds\_snapshots\_public\_access
- s3\_bucket\_policy\_public\_write\_access
- s3\_bucket\_public\_access
- sagemaker\_notebook\_instance\_without\_direct\_internet\_access\_configured
- sns\_topics\_not\_publicly\_accessible
- sqs\_queues\_not\_publicly\_accessible
- network\_public\_ip\_shodan

To execute Internet-exposed related checks, you can run the following command:

```console
prowler <provider> --categories internet-exposed
```

### Shodan

Prowler allows you check if any public IPs in your Cloud environments are exposed in Shodan with the `-N`/`--shodan <shodan_api_key>` option:

For example, you can check if any of your AWS Elastic Compute Cloud (EC2) instances has an elastic IP exposed in Shodan:

```console
prowler aws -N/--shodan <shodan_api_key> -c ec2_elastic_ip_shodan
```

Also, you can check if any of your Azure Subscription has an public IP exposed in Shodan:

```console
prowler azure -N/--shodan <shodan_api_key> -c network_public_ip_shodan
```

And finally, you can check if any of your GCP projects has an public IP address exposed in Shodan:

```console
prowler gcp -N/--shodan <shodan_api_key> -c compute_public_address_shodan
```
```

--------------------------------------------------------------------------------

````
