---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 58
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 58 of 867)

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

---[FILE: readme.md]---
Location: prowler-master/contrib/aws/aws-sso-docker/readme.md

```text
# AWS SSO to Prowler Automation Script

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Script Overview](#script-overview)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Customization](#customization)
- [Security Considerations](#security-considerations)
- [License](#license)

## Introduction

This repository provides a Bash script that automates the process of logging into AWS Single Sign-On (SSO), extracting temporary AWS credentials, and running **Prowler**—a security tool that performs AWS security best practices assessments—inside a Docker container using those credentials.

By following this guide, you can streamline your AWS security assessments, ensuring that you consistently apply best practices across your AWS accounts.

## Prerequisites

Before you begin, ensure that you have the following tools installed and properly configured on your system:

1. **AWS CLI v2**
   - AWS SSO support is available from AWS CLI version 2 onwards.
   - [Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

2. **jq**
   - A lightweight and flexible command-line JSON processor.
   - **macOS (Homebrew):**
     ```bash
     brew install jq
     ```
   - **Ubuntu/Debian:**
     ```bash
     sudo apt-get update
     sudo apt-get install -y jq
     ```
   - **Windows:**
     - [Download jq](https://stedolan.github.io/jq/download/)

3. **Docker**
   - Ensure Docker is installed and running on your system.
   - [Docker Installation Guide](https://docs.docker.com/get-docker/)

4. **AWS SSO Profile Configuration**
   - Ensure that you have configured an AWS CLI profile with SSO.
   - [Configuring AWS CLI with SSO](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html)

## Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/aws-sso-prowler-automation.git
   cd aws-sso-prowler-automation
   ```

2. **Create the Automation Script**
   Create a new Bash script named `run_prowler_sso.sh` and make it executable.

   ```bash
   nano run_prowler_sso.sh
   chmod +x run_prowler_sso.sh
   ```

3. **Add the Script Content**
   Paste the following content into `run_prowler_sso.sh`:

4. **Configure AWS SSO Profile**
   Ensure that your AWS CLI profile (`twodragon` in this case) is correctly configured for SSO.

   ```bash
   aws configure sso --profile twodragon
   ```

   **Example Configuration Prompts:**
   ```
   SSO session name (Recommended): [twodragon]
   SSO start URL [None]: https://twodragon.awsapps.com/start
   SSO region [None]: ap-northeast-2
   SSO account ID [None]: 123456789012
   SSO role name [None]: ReadOnlyAccess
   CLI default client region [None]: ap-northeast-2
   CLI default output format [None]: json
   CLI profile name [twodragon]: twodragon
   ```

## Script Overview

The `run_prowler_sso.sh` script performs the following actions:

1. **AWS SSO Login:**
   - Initiates AWS SSO login for the specified profile.
   - Opens the SSO authorization page in the default browser for user authentication.

2. **Extract Temporary Credentials:**
   - Locates the most recent SSO cache file containing the `accessToken`.
   - Uses `jq` to parse and extract the `accessToken` from the cache file.
   - Retrieves the `sso_role_name` and `sso_account_id` from the AWS CLI configuration.
   - Obtains temporary AWS credentials (`AccessKeyId`, `SecretAccessKey`, `SessionToken`) using the extracted `accessToken`.

3. **Set Environment Variables:**
   - Exports the extracted AWS credentials as environment variables to be used by the Docker container.

4. **Run Prowler:**
   - Executes the **Prowler** Docker container, passing the AWS credentials as environment variables for security assessments.

## Usage

1. **Make the Script Executable**
   Ensure the script has execute permissions.

   ```bash
   chmod +x run_prowler_sso.sh
   ```

2. **Run the Script**
   Execute the script to start the AWS SSO login process and run Prowler.

   ```bash
   ./run_prowler_sso.sh
   ```

3. **Follow the Prompts**
   - A browser window will open prompting you to authenticate via AWS SSO.
   - Complete the authentication process in the browser.
   - Upon successful login, the script will extract temporary credentials and run Prowler.

4. **Review Prowler Output**
   - Prowler will analyze your AWS environment based on the specified checks and output the results directly in the terminal.

## Troubleshooting

If you encounter issues during the script execution, follow these steps to diagnose and resolve them.

### 1. Verify AWS CLI Version

Ensure you are using AWS CLI version 2 or later.

```bash
aws --version
```

**Expected Output:**
```
aws-cli/2.11.10 Python/3.9.12 Darwin/20.3.0 exe/x86_64 prompt/off
```

If you are not using version 2, [install or update AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

### 2. Confirm AWS SSO Profile Configuration

Check that the `twodragon` profile is correctly configured.

```bash
aws configure list-profiles
```

**Expected Output:**
```
default
twodragon
```

Review the profile details:

```bash
aws configure get sso_start_url --profile twodragon
aws configure get sso_region --profile twodragon
aws configure get sso_account_id --profile twodragon
aws configure get sso_role_name --profile twodragon
```

Ensure all fields return the correct values.

### 3. Check SSO Cache File

Ensure that the SSO cache file contains a valid `accessToken`.

```bash
cat ~/.aws/sso/cache/*.json
```

**Example Content:**
```json
{
  "accessToken": "eyJz93a...k4laUWw",
  "expiresAt": "2024-12-22T14:07:55Z",
  "clientId": "example-client-id",
  "clientSecret": "example-client-secret",
  "startUrl": "https://twodragon.awsapps.com/start#"
}
```

If `accessToken` is `null` or missing, retry the AWS SSO login:

```bash
aws sso login --profile twodragon
```

### 4. Validate `jq` Installation

Ensure that `jq` is installed and functioning correctly.

```bash
jq --version
```

**Expected Output:**
```
jq-1.6
```

If `jq` is not installed, install it using the instructions in the [Prerequisites](#prerequisites) section.

### 5. Test Docker Environment Variables

Verify that the Docker container receives the AWS credentials correctly.

```bash
docker run --platform linux/amd64 \
    -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
    -e AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN \
    toniblyx/prowler /bin/bash -c 'echo $AWS_ACCESS_KEY_ID; echo $AWS_SECRET_ACCESS_KEY; echo $AWS_SESSION_TOKEN'
```

**Expected Output:**
```
ASIA...
wJalrFEMI/K7MDENG/bPxRfiCY...
IQoJb3JpZ2luX2VjEHwaCXVz...
```

Ensure that none of the environment variables are empty.

### 6. Review Script Output

Run the script with debugging enabled to get detailed output.

1. **Enable Debugging in Script**
   Add `set -x` for verbose output.

   ```bash
   #!/bin/bash
   set -e
   set -x
   # ... rest of the script ...
   ```

2. **Run the Script**

   ```bash
   ./run_prowler_sso.sh
   ```

3. **Analyze Output**
   Look for any errors or unexpected values in the output to identify where the script is failing.

## Customization

You can modify the script to suit your specific needs, such as:

- **Changing the AWS Profile Name:**
  Update the `PROFILE` variable at the top of the script.

  ```bash
  PROFILE="your-profile-name"
  ```

- **Adding Prowler Options:**
  Pass additional options to Prowler for customized checks or output formats.

  ```bash
  docker run --platform linux/amd64 \
      -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
      -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
      -e AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN \
      toniblyx/prowler -c check123 -M json
  ```

## Security Considerations

- **Handle Credentials Securely:**
  - Avoid sharing or exposing your AWS credentials.
  - Do not include sensitive information in logs or version control.

- **Script Permissions:**
  - Ensure the script file has appropriate permissions to prevent unauthorized access.

    ```bash
    chmod 700 run_prowler_sso.sh
    ```

- **Environment Variables:**
  - Be cautious when exporting credentials as environment variables.
  - Consider using more secure methods for credential management if necessary.

## License

This project is licensed under the [MIT License](LICENSE).
```

--------------------------------------------------------------------------------

---[FILE: run_prowler_sso.sh]---
Location: prowler-master/contrib/aws/aws-sso-docker/run_prowler_sso.sh

```bash
#!/bin/bash
set -e

# Set the profile name
PROFILE="twodragon"

# Set the Prowler output directory
OUTPUT_DIR=~/prowler-output
mkdir -p "$OUTPUT_DIR"

# Set the port for the local web server
WEB_SERVER_PORT=8000

# ----------------------------------------------
# Functions
# ----------------------------------------------

# Function to open the HTML report in the default browser
open_report() {
    local report_path="$1"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$report_path"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$report_path"
    elif [[ "$OSTYPE" == "msys" ]]; then
        start "" "$report_path"
    else
        echo "Automatic method to open Prowler HTML report is not supported on this OS."
        echo "Please open the report manually at: $report_path"
    fi
}

# Function to start a simple HTTP server to host the Prowler reports
start_web_server() {
    local directory="$1"
    local port="$2"

    echo "Starting local web server to host Prowler reports at http://localhost:$port"
    echo "Press Ctrl+C to stop the web server."

    # Change to the output directory
    cd "$directory"

    # Start the HTTP server in the foreground
    # Python 3 is required
    python3 -m http.server "$port"
}

# ----------------------------------------------
# Main Script
# ----------------------------------------------

# AWS SSO Login
echo "Logging into AWS SSO..."
aws sso login --profile "$PROFILE"

# Extract temporary credentials
echo "Extracting temporary credentials..."

# Find the most recently modified SSO cache file
CACHE_FILE=$(ls -t ~/.aws/sso/cache/*.json 2>/dev/null | head -n 1)
echo "Cache File: $CACHE_FILE"

if [ -z "$CACHE_FILE" ]; then
    echo "SSO cache file not found. Please ensure AWS SSO login was successful."
    exit 1
fi

# Extract accessToken using jq
ACCESS_TOKEN=$(jq -r '.accessToken' "$CACHE_FILE")
echo "Access Token: $ACCESS_TOKEN"

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" == "null" ]; then
    echo "Unable to extract accessToken. Please check your SSO login and cache file."
    exit 1
fi

# Extract role name and account ID from AWS CLI configuration
ROLE_NAME=$(aws configure get sso_role_name --profile "$PROFILE")
ACCOUNT_ID=$(aws configure get sso_account_id --profile "$PROFILE")
echo "Role Name: $ROLE_NAME"
echo "Account ID: $ACCOUNT_ID"

if [ -z "$ROLE_NAME" ] || [ -z "$ACCOUNT_ID" ]; then
    echo "Unable to extract sso_role_name or sso_account_id. Please check your profile configuration."
    exit 1
fi

# Obtain temporary credentials using AWS SSO
TEMP_CREDS=$(aws sso get-role-credentials \
    --role-name "$ROLE_NAME" \
    --account-id "$ACCOUNT_ID" \
    --access-token "$ACCESS_TOKEN" \
    --profile "$PROFILE")

echo "TEMP_CREDS: $TEMP_CREDS"

# Extract credentials from the JSON response
AWS_ACCESS_KEY_ID=$(echo "$TEMP_CREDS" | jq -r '.roleCredentials.accessKeyId')
AWS_SECRET_ACCESS_KEY=$(echo "$TEMP_CREDS" | jq -r '.roleCredentials.secretAccessKey')
AWS_SESSION_TOKEN=$(echo "$TEMP_CREDS" | jq -r '.roleCredentials.sessionToken')

# Verify that all credentials were extracted successfully
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_SESSION_TOKEN" ]; then
    echo "Unable to extract temporary credentials."
    exit 1
fi

# Export AWS credentials as environment variables
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export AWS_SESSION_TOKEN

echo "AWS credentials have been set."

# Run Prowler in Docker container
echo "Running Prowler Docker container..."

docker run --platform linux/amd64 \
    -e AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
    -e AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
    -e AWS_SESSION_TOKEN="$AWS_SESSION_TOKEN" \
    -v "$OUTPUT_DIR":/home/prowler/output \
    toniblyx/prowler -M html -M csv -M json-ocsf --output-directory /home/prowler/output --output-filename prowler-output

echo "Prowler has finished running. Reports are saved in $OUTPUT_DIR."

# Open the HTML report in the default browser
REPORT_PATH="$OUTPUT_DIR/prowler-output.html"
echo "Opening Prowler HTML report..."
open_report "$REPORT_PATH" &

# Start the local web server to host the Prowler dashboard
# This will run in the foreground. To run it in the background, append an ampersand (&) at the end of the command.
start_web_server "$OUTPUT_DIR" "$WEB_SERVER_PORT"
```

--------------------------------------------------------------------------------

---[FILE: cloud9-installation.sh]---
Location: prowler-master/contrib/aws/cloud9/cloud9-installation.sh

```bash
#!/bin/bash

# Install system dependencies
sudo yum -y install openssl-devel bzip2-devel libffi-devel gcc
# Upgrade to Python 3.9
cd /tmp && wget https://www.python.org/ftp/python/3.9.13/Python-3.9.13.tgz
tar zxf Python-3.9.13.tgz
cd Python-3.9.13/ || exit
./configure --enable-optimizations
sudo make altinstall
python3.9 --version
# Install Prowler
cd ~ || exit
python3.9 -m pip install prowler-cloud
prowler -v
# Run Prowler
prowler aws
```

--------------------------------------------------------------------------------

---[FILE: cloudshell-installation.sh]---
Location: prowler-master/contrib/aws/cloudshell/cloudshell-installation.sh

```bash
#!/bin/bash

sudo bash
adduser prowler
su prowler
pip install prowler
cd /tmp
prowler aws
```

--------------------------------------------------------------------------------

---[FILE: codebuild-prowlerv2-audit-account-cfn.yaml]---
Location: prowler-master/contrib/aws/codebuild/codebuild-prowlerv2-audit-account-cfn.yaml

```yaml
---
AWSTemplateFormatVersion: 2010-09-09
Description: Creates a CodeBuild project to audit an AWS account with Prowler Version 2 and stores the html report in a S3 bucket. This will run onece at the beginning and on a schedule afterwards. Partial contribution from https://github.com/stevecjones
Parameters:
  ServiceName:
    Description: 'Specifies the service name used within component naming'
    Type: String
    Default: 'prowler'

  LogsRetentionInDays:
    Description: 'Specifies the number of days you want to retain CodeBuild run log events in the specified log group. Junit reports are kept for 30 days, HTML reports in S3 are not deleted'
    Type: Number
    Default: 3
    AllowedValues: [1, 3, 5, 7, 14, 30, 60, 90, 180, 365]

  ProwlerOptions:
    Description: 'Options to pass to Prowler command, make sure at least -M junit-xml is used for CodeBuild reports. Use -r for the region to send API queries, -f to filter only one region, -M output formats, -c for comma separated checks, for all checks do not use -c or -g, for more options see -h. For a complete assessment use  "-M text,junit-xml,html,csv,json", for SecurityHub integration use "-r region -f region -M text,junit-xml,html,csv,json,json-asff -S -q"'
    Type: String
    # Prowler command below runs a set of checks, configure it base on your needs, no options will run all regions all checks.
    # option -M junit-xml is required in order to get the report in CodeBuild.
    Default: -r eu-west-1 -f eu-west-1 -M text,junit-xml,html,csv,json -c check11,check12,check13,check14

  ProwlerScheduler:
    Description: The time when Prowler will run in cron format. Default is daily at 22:00h or 10PM 'cron(0 22 * * ? *)', for every 5 hours also works 'rate(5 hours)'. More info here https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html.
    Type: String
    Default: 'cron(0 22 * * ? *)'

Resources:
  CodeBuildStartBuild:
    Type: 'Custom::CodeBuildStartBuild'
    DependsOn:
      - CodeBuildLogPolicy
      - CodeBuildStartLogPolicy
    Properties:
      Build: !Ref ProwlerCodeBuild
      ServiceToken: !GetAtt CodeBuildStartBuildLambda.Arn

  CodeBuildStartBuildLambdaRole:
    Type: 'AWS::IAM::Role'
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: !Sub lambda.${AWS::URLSuffix}
            Action: 'sts:AssumeRole'
      Description: !Sub 'DO NOT DELETE - Used by Lambda. Created by CloudFormation Stack ${AWS::StackId}'
      Policies:
        - PolicyName: StartBuildInline
          PolicyDocument:
            Statement:
              - Effect: Allow
                Action: 'codebuild:StartBuild'
                Resource: !GetAtt ProwlerCodeBuild.Arn

  CodeBuildStartBuildLambda:
    Type: 'AWS::Lambda::Function'
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W58
            reason: 'This Lambda has permissions to write Logs'
          - id: W89
            reason: 'VPC is not needed'
          - id: W92
            reason: 'ReservedConcurrentExecutions not needed'
    Properties:
      Handler: index.lambda_handler
      MemorySize: 128
      Role: !Sub ${CodeBuildStartBuildLambdaRole.Arn}
      Timeout: 120
      Runtime: python3.9
      Code:
        ZipFile: |
          import boto3
          import cfnresponse
          from botocore.exceptions import ClientError

          def lambda_handler(event,context):
            props = event['ResourceProperties']
            codebuild_client = boto3.client('codebuild')

            if (event['RequestType'] == 'Create' or event['RequestType'] == 'Update'):
              try:
                  response = codebuild_client.start_build(projectName=props['Build'])
                  print(response)
                  print("Respond: SUCCESS")
                  cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
              except Exception as ex:
                  print(ex.response['Error']['Message'])
                  cfnresponse.send(event, context, cfnresponse.FAILED, ex.response)
            else:
              cfnresponse.send(event, context, cfnresponse.SUCCESS, {})

  CodeBuildStartLogGroup:
    Type: 'AWS::Logs::LogGroup'
    DeletionPolicy: Delete
    UpdateReplacePolicy: Delete
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W84
            reason: 'KMS encryption is not needed.'
    Properties:
      LogGroupName: !Sub '/aws/lambda/${CodeBuildStartBuildLambda}'
      RetentionInDays: !Ref LogsRetentionInDays

  CodeBuildStartLogPolicy:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Action:
              - logs:CreateLogStream
              - logs:PutLogEvents
            Effect: Allow
            Resource: !GetAtt CodeBuildStartLogGroup.Arn
      PolicyName: LogGroup
      Roles:
        - !Ref CodeBuildStartBuildLambdaRole

  ArtifactBucket:
    Type: AWS::S3::Bucket
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W35
            reason: 'S3 Access Logging is not needed'
    Properties:
      Tags:
        - Key: Name
          Value: !Sub '${ServiceName}-${AWS::AccountId}-S3-Prowler-${AWS::StackName}'
      BucketName: !Sub '${ServiceName}-reports-${AWS::Region}-prowler-${AWS::AccountId}'
      AccessControl: LogDeliveryWrite
      VersioningConfiguration:
        Status: Enabled
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

  ArtifactBucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref ArtifactBucket
      PolicyDocument:
        Id: Content
        Version: '2012-10-17'
        Statement:
          - Action: '*'
            Condition:
              Bool:
                aws:SecureTransport: false
            Effect: Deny
            Principal: '*'
            Resource: !Sub '${ArtifactBucket.Arn}/*'
            Sid: S3ForceSSL
          - Action: 's3:PutObject'
            Condition:
              'Null':
                s3:x-amz-server-side-encryption: true
            Effect: Deny
            Principal: '*'
            Resource: !Sub '${ArtifactBucket.Arn}/*'
            Sid: DenyUnEncryptedObjectUploads

  CodeBuildServiceRole:
    Type: AWS::IAM::Role
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W11
            reason: 'Role complies with the least privilege principle.'
    Properties:
      Description: !Sub 'DO NOT DELETE - Used by CodeBuild. Created by CloudFormation Stack ${AWS::StackId}'
      ManagedPolicyArns:
        - !Sub 'arn:${AWS::Partition}:iam::aws:policy/job-function/SupportUser'
        - !Sub 'arn:${AWS::Partition}:iam::aws:policy/job-function/ViewOnlyAccess'
        - !Sub 'arn:${AWS::Partition}:iam::aws:policy/SecurityAudit'
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Action: 'sts:AssumeRole'
            Effect: Allow
            Principal:
              Service: !Sub codebuild.${AWS::URLSuffix}
      Policies:
        - PolicyName: S3
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Action:
                  - s3:PutObject
                  - s3:GetObject
                  - s3:GetObjectVersion
                  - s3:GetBucketAcl
                  - s3:GetBucketLocation
                Effect: Allow
                Resource: !Sub '${ArtifactBucket.Arn}/*'
        - PolicyName: ProwlerAdditions
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Action:
                  - ds:ListAuthorizedApplications
                  - ec2:GetEbsEncryptionByDefault
                  - ecr:Describe*
                  - elasticfilesystem:DescribeBackupPolicy
                  - glue:GetConnections
                  - glue:GetSecurityConfiguration
                  - glue:SearchTables
                  - lambda:GetFunction
                  - s3:GetAccountPublicAccessBlock
                  - shield:DescribeProtection
                  - shield:GetSubscriptionState
                  - ssm:GetDocument
                  - support:Describe*
                  - tag:GetTagKeys
                Effect: Allow
                Resource: '*'
        - PolicyName: CodeBuild
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Action:
                  - codebuild:CreateReportGroup
                  - codebuild:CreateReport
                  - codebuild:UpdateReport
                  - codebuild:BatchPutTestCases
                  - codebuild:BatchPutCodeCoverages
                Effect: Allow
                Resource: !Sub 'arn:${AWS::Partition}:codebuild:${AWS::Region}:${AWS::AccountId}:report-group/*'
        - PolicyName: SecurityHubBatchImportFindings
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Action: securityhub:BatchImportFindings
                Effect: Allow
                Resource: !Sub 'arn:${AWS::Partition}:securityhub:${AWS::Region}::product/prowler/prowler'

  CodeBuildLogPolicy:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Action:
              - logs:CreateLogStream
              - logs:PutLogEvents
            Effect: Allow
            Resource: !GetAtt ProwlerLogGroup.Arn
      PolicyName: LogGroup
      Roles:
        - !Ref CodeBuildServiceRole

  CodeBuildAssumePolicy:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Action: 'sts:AssumeRole'
            Effect: Allow
            Resource: !GetAtt CodeBuildServiceRole.Arn
      PolicyName: AssumeRole
      Roles:
        - !Ref CodeBuildServiceRole

  ProwlerCodeBuild:
    Type: AWS::CodeBuild::Project
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W32
            reason: 'KMS encryption is not needed.'
    Properties:
      Artifacts:
        Type: NO_ARTIFACTS
      ConcurrentBuildLimit: 1
      SourceVersion: prowler-2
      Source:
        GitCloneDepth: 1
        Location: https://github.com/prowler-cloud/prowler
        Type: GITHUB
        ReportBuildStatus: false
        BuildSpec: |
          version: 0.2
          phases:
            install:
              runtime-versions:
                python: 3.9
              commands:
                - echo "Installing Prowler and dependencies..."
                - pip3 install detect-secrets
            build:
              commands:
                - echo "Running Prowler as ./prowler $PROWLER_OPTIONS"
                - ./prowler $PROWLER_OPTIONS
            post_build:
              commands:
                - echo "Uploading reports to S3..."
                - aws s3 cp --sse AES256 output/ s3://$BUCKET_REPORT/ --recursive
                - echo "Done!"
          reports:
            prowler:
              files:
                - '**/*'
              base-directory: 'junit-reports'
              file-format: JunitXml
      Environment:
        # AWS CodeBuild free tier includes 100 build minutes of BUILD_GENERAL1_SMALL per month.
        # BUILD_GENERAL1_SMALL: Use up to 3 GB memory and 2 vCPUs for builds. $0.005/minute.
        # BUILD_GENERAL1_MEDIUM: Use up to 7 GB memory and 4 vCPUs for builds. $0.01/minute.
        # BUILD_GENERAL1_LARGE: Use up to 15 GB memory and 8 vCPUs for builds. $0.02/minute.
        # BUILD_GENERAL1_2XLARGE: Use up to 144 GB memory and 72 vCPUs for builds. $0.20/minute.
        ComputeType: "BUILD_GENERAL1_SMALL"
        Image: "aws/codebuild/amazonlinux2-x86_64-standard:3.0"
        Type: "LINUX_CONTAINER"
        EnvironmentVariables:
          - Name: BUCKET_REPORT
            Value: !Ref ArtifactBucket
            Type: PLAINTEXT
          - Name: PROWLER_OPTIONS
            Value: !Ref ProwlerOptions
            Type: PLAINTEXT
      Description: Run Prowler assessment
      ServiceRole: !GetAtt CodeBuildServiceRole.Arn
      TimeoutInMinutes: 300

  ProwlerLogGroup:
    Type: 'AWS::Logs::LogGroup'
    DeletionPolicy: Delete
    UpdateReplacePolicy: Delete
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W84
            reason: 'KMS encryption is not needed.'
    Properties:
      LogGroupName: !Sub '/aws/codebuild/${ProwlerCodeBuild}'
      RetentionInDays: !Ref LogsRetentionInDays

  EventBridgeServiceRole:
    Type: AWS::IAM::Role
    Properties:
      Description: !Sub 'DO NOT DELETE - Used by EventBridge. Created by CloudFormation Stack ${AWS::StackId}'
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Action: 'sts:AssumeRole'
            Effect: Allow
            Principal:
              Service: !Sub events.${AWS::URLSuffix}
      Policies:
        - PolicyName: CodeBuild
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action: 'codebuild:StartBuild'
                Resource: !GetAtt ProwlerCodeBuild.Arn

  ProwlerSchedule:
    Type: 'AWS::Events::Rule'
    Properties:
      Description: A schedule to trigger Prowler in CodeBuild
      ScheduleExpression: !Ref ProwlerScheduler
      State: ENABLED
      Targets:
        - Arn: !GetAtt ProwlerCodeBuild.Arn
          Id: ProwlerSchedule
          RoleArn: !GetAtt EventBridgeServiceRole.Arn

Outputs:
  ArtifactBucketName:
    Description: Artifact Bucket Name
    Value: !Ref ArtifactBucket
```

--------------------------------------------------------------------------------

````
