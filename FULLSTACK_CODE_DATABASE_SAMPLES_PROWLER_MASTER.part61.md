---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 61
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 61 of 867)

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

---[FILE: run-prowler-reports.sh]---
Location: prowler-master/contrib/aws/org-multi-account/serverless_codebuild/src/run-prowler-reports.sh

```bash
#!/bin/bash -e
#
# Run Prowler against All AWS Accounts in an AWS Organization

# Change Directory (rest of the script, assumes your in the ec2-user home directory)
# cd /home/ec2-user || exit

# Show Prowler Version, and Download Prowler, if it doesn't already exist
if ! ./prowler/prowler -V 2>/dev/null; then
    git clone https://github.com/prowler-cloud/prowler.git
    ./prowler/prowler -V
fi

# Source .awsvariables (to read in Environment Variables from CloudFormation Data)
# shellcheck disable=SC1091
# source .awsvariables

# Get Values from Environment Variables Created on EC2 Instance from CloudFormation Data
echo "S3:             $S3"
echo "S3ACCOUNT:      $S3ACCOUNT"
echo "ROLE:           $ROLE"
echo "FORMAT:         $FORMAT"

# CleanUp Last Ran Prowler Reports, as they are already stored in S3.
rm -rf prowler/output/*.html

# Function to unset AWS Profile Variables
unset_aws() {
    unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}
unset_aws

# Find THIS Account AWS Number
CALLER_ARN=$(aws sts get-caller-identity --output text --query "Arn")
PARTITION=$(echo "$CALLER_ARN" | cut -d: -f2)
THISACCOUNT=$(echo "$CALLER_ARN" | cut -d: -f5)
echo "THISACCOUNT:    $THISACCOUNT"
echo "PARTITION:      $PARTITION"

# Function to Assume Role to THIS Account & Create Session
this_account_session() {
    unset_aws
    role_credentials=$(aws sts assume-role --role-arn arn:"$PARTITION":iam::"$THISACCOUNT":role/"$ROLE" --role-session-name ProwlerRun --output json)
    AWS_ACCESS_KEY_ID=$(echo "$role_credentials" | jq -r .Credentials.AccessKeyId)
    AWS_SECRET_ACCESS_KEY=$(echo "$role_credentials" | jq -r .Credentials.SecretAccessKey)
    AWS_SESSION_TOKEN=$(echo "$role_credentials" | jq -r .Credentials.SessionToken)
    echo "this_account_session done..."
    export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}

# Find AWS Master Account
this_account_session
AWSMASTER=$(aws organizations describe-organization --query Organization.MasterAccountId --output text)
echo "AWSMASTER:      $AWSMASTER"

# Function to Assume Role to Master Account & Create Session
master_account_session() {
    unset_aws
    role_credentials=$(aws sts assume-role --role-arn arn:"$PARTITION":iam::"$AWSMASTER":role/"$ROLE" --role-session-name ProwlerRun --output json)
    AWS_ACCESS_KEY_ID=$(echo "$role_credentials" | jq -r .Credentials.AccessKeyId)
    AWS_SECRET_ACCESS_KEY=$(echo "$role_credentials" | jq -r .Credentials.SecretAccessKey)
    AWS_SESSION_TOKEN=$(echo "$role_credentials" | jq -r .Credentials.SessionToken)
    echo "master_account_session done..."
    export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}

# Lookup All Accounts in AWS Organization
master_account_session
ACCOUNTS_IN_ORGS=$(aws organizations list-accounts --query Accounts[*].Id --output text)

# Function to Assume Role to S3 Account & Create Session
s3_account_session() {
    unset_aws
    role_credentials=$(aws sts assume-role --role-arn arn:"$PARTITION":iam::"$S3ACCOUNT":role/"$ROLE" --role-session-name ProwlerRun --output json)
    AWS_ACCESS_KEY_ID=$(echo "$role_credentials" | jq -r .Credentials.AccessKeyId)
    AWS_SECRET_ACCESS_KEY=$(echo "$role_credentials" | jq -r .Credentials.SecretAccessKey)
    AWS_SESSION_TOKEN=$(echo "$role_credentials" | jq -r .Credentials.SessionToken)
    echo "s3_account_session done..."
    export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}

# Run Prowler against Accounts in AWS Organization
echo "AWS Accounts in Organization"
echo "$ACCOUNTS_IN_ORGS"
PARALLEL_ACCOUNTS="1"
for accountId in $ACCOUNTS_IN_ORGS; do
    # shellcheck disable=SC2015
    test "$(jobs | wc -l)" -ge $PARALLEL_ACCOUNTS && wait || true
    {
        START_TIME=$SECONDS
        # Unset AWS Profile Variables
        unset_aws
        # Run Prowler
        echo -e "Assessing AWS Account: $accountId, using Role: $ROLE on $(date)"
        # remove -g cislevel for a full report and add other formats if needed
        ./prowler/prowler -R "$ROLE" -A "$accountId" -g cislevel1 -M $FORMAT -z
        echo "Report stored locally at: prowler/output/ directory"
        TOTAL_SEC=$((SECONDS - START_TIME))
        echo -e "Completed AWS Account: $accountId, using Role: $ROLE on $(date)"
        printf "Completed AWS Account: $accountId in %02dh:%02dm:%02ds" $((TOTAL_SEC / 3600)) $((TOTAL_SEC % 3600 / 60)) $((TOTAL_SEC % 60))
        echo ""
    } &
done

# Wait for All Prowler Processes to finish
wait
echo "Prowler Assessments Completed against All Accounts in the AWS Organization. Starting S3 copy operations..."

# Upload Prowler Report to S3
s3_account_session
aws s3 cp prowler/output/ "$S3/reports/" --recursive --include "*.html" --acl bucket-owner-full-control
echo "Assessment reports successfully copied to S3 bucket"

# Final Wait for All Prowler Processes to finish
wait
echo "Prowler Assessments Completed"

# Unset AWS Profile Variables
unset_aws
```

--------------------------------------------------------------------------------

---[FILE: ProwlerCodeBuildStack.yaml]---
Location: prowler-master/contrib/aws/org-multi-account/serverless_codebuild/templates/ProwlerCodeBuildStack.yaml

```yaml
---
AWSTemplateFormatVersion: 2010-09-09
Description: Creates a CodeBuild project to audit an AWS account with Prowler and stores the html report in a S3 bucket.
Parameters:
  AwsOrgId:
    Type: String
    Description: Enter AWS Organizations ID
    AllowedPattern: ^o-[a-z0-9]{10,32}$
    ConstraintDescription: The Org Id must be a 12 character string starting with o- and followed by 10 lower case alphanumeric characters.
    Default: o-itdezkbz6h
  CodeBuildRole:
    Description: Enter Name for CodeBuild Role to create
    Type: String
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters supported [+, =, ., @, -]
    Default: ProwlerCodeBuild-Role
  CodeBuildSourceS3:
    Type: String
    Description: Enter like <bucket-name>/<path>/<object-name>.zip
    ConstraintDescription: Max 63 characters. Can't start or end with dash.  Can use numbers and lowercase letters.
    Default: prowler-util-411267690458-ap-northeast-2/run-prowler-reports.sh.zip
  ProwlerReportS3:
    Type: String
    Description: Enter S3 Bucket for Prowler Reports.  prefix-awsaccount-awsregion
    AllowedPattern: ^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$
    ConstraintDescription: Max 63 characters. Can't start or end with dash.  Can use numbers and lowercase letters.
    Default: prowler-954896828174-ap-northeast-2
  ProwlerReportS3Account:
    Type: String
    Description: Enter AWS Account Number where Prowler S3 Bucket resides.
    AllowedPattern: ^\d{12}$
    ConstraintDescription: An AWS Account Number must be a 12 digit numeric string.
    Default: 954896828174
  CrossAccountRole:
    Type: String
    Description: Enter CrossAccount Role Prowler will be using to assess AWS Accounts in the AWS Organization. (ProwlerCrossAccountRole)
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters [+, =, ., @, -]
    Default: ProwlerXA-CBRole
  ProwlerReportFormat:
    Type: String
    Description: Enter Prowler Option like html, csv, json
    Default: html

Resources:
  ProwlerCodeBuildRole:
    Type: AWS::IAM::Role
    Properties:
      Description: Prowler CodeBuild Role
      RoleName: !Ref CodeBuildRole
      Tags:
        - Key: App
          Value: Prowler
      AssumeRolePolicyDocument:
        Version: 2012-10-17
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - codebuild.amazonaws.com
            Action:
              - sts:AssumeRole
      Policies:
        - PolicyName: Prowler-S3
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Sid: AllowGetPutListObject
                Effect: Allow
                Resource:
                  - !Sub arn:${AWS::Partition}:s3:::${ProwlerReportS3}
                  - !Sub arn:${AWS::Partition}:s3:::${ProwlerReportS3}/*
                Action:
                  - s3:GetObject
                  - s3:PutObject
                  - s3:ListBucket
                  - s3:PutObjectAcl
              - Sid: AllowReadOnlyS3Access
                Effect: Allow
                Resource: "*"
                Action:
                  - "s3:Get*"
                  - "s3:List*"
        - PolicyName: Prowler-CrossAccount-AssumeRole
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Sid: AllowStsAssumeRole
                Effect: Allow
                Resource: !Sub arn:${AWS::Partition}:iam::*:role/${CrossAccountRole}
                Action: sts:AssumeRole
                Condition:
                  StringEquals:
                    aws:PrincipalOrgId: !Ref AwsOrgId
        - PolicyName: Prowler-CloudWatch
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Sid: AllowCreateLogs
                Effect: Allow
                Resource: !Sub arn:${AWS::Partition}:logs:*:*:log-group:*
                Action:
                  - logs:CreateLogGroup
                  - logs:CreateLogStream
              - Sid: AllowPutevent
                Effect: Allow
                Resource: !Sub arn:${AWS::Partition}:logs:*:*:log-group:*:log-stream:*
                Action:
                  - logs:PutLogEvents

  ProwlerCodeBuild:
    Type: AWS::CodeBuild::Project
    Properties:
      Artifacts:
        Type: NO_ARTIFACTS
      Source:
        Type: S3
        Location: !Ref CodeBuildSourceS3
        BuildSpec: |
          version: 0.2
          phases:
            install:
              runtime-versions:
                python: 3.8
              commands:
                - echo "Updating yum ..."
                - yum -y update --skip-broken
                - echo "Updating pip ..."
                - python -m pip install --upgrade pip
                - echo "Installing requirements ..."
                - pip install "git+https://github.com/ibm/detect-secrets.git@master#egg=detect-secrets"
            build:
              commands:
                - echo "Running Prowler with script"
                - chmod +x run-prowler-reports.sh
                - ./run-prowler-reports.sh
            post_build:
              commands:
                - echo "Done!"
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
          - Name: "S3"
            Value: !Sub s3://${ProwlerReportS3}
            Type: PLAINTEXT
          - Name: "S3ACCOUNT"
            Value: !Ref ProwlerReportS3Account
            Type: PLAINTEXT
          - Name: "ROLE"
            Value: !Ref CrossAccountRole
            Type: PLAINTEXT
          - Name: "FORMAT"
            Value: !Ref ProwlerReportFormat
            Type: PLAINTEXT
      Description: Run Prowler assessment
      ServiceRole: !GetAtt ProwlerCodeBuildRole.Arn
      TimeoutInMinutes: 300

  ProwlerCWRuleRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: 2012-10-17
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - events.amazonaws.com
            Action:
              - sts:AssumeRole
      Description: ProwlerCWRuleRole
      RoleName: ProwlerCWRule-Role
      Policies:
        - PolicyName: Rule-Events
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Sid: AWSEventInvokeCodeBuild
                Effect: Allow
                Resource: "*"
                Action:
                  - codebuild:StartBuild

  ProwlerRule:
    Type: AWS::Events::Rule
    Properties:
      Description: This rule will trigger CodeBuild to audit AWS Accounts in my Organization with Prowler
      ScheduleExpression: cron(0 21 * * ? *)
      RoleArn: !GetAtt ProwlerCWRuleRole.Arn
      Name: ProwlerExecuteRule
      State: ENABLED
      Targets:
        - Arn: !Sub ${ProwlerCodeBuild.Arn}
          Id: Prowler-CodeBuild-Target
          RoleArn: !GetAtt ProwlerCWRuleRole.Arn


Outputs:
  ProwlerEc2Account:
    Description: AWS Account Number where Prowler EC2 Instance resides.
    Value: !Ref AWS::AccountId
  ProwlerCodeBuildRole:
    Description: Instance Role given to the Prowler EC2 Instance (needed to grant sts:AssumeRole rights).
    Value: !Ref ProwlerCodeBuildRole
  ProwlerReportS3:
    Description: S3 Bucket for Prowler Reports
    Value: !Ref ProwlerReportS3
```

--------------------------------------------------------------------------------

---[FILE: ProwlerRole.yaml]---
Location: prowler-master/contrib/aws/org-multi-account/serverless_codebuild/templates/ProwlerRole.yaml

```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: Create the Cross-Account IAM Prowler Role

Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      - Label:
          default: CodeBuild Settings
        Parameters:
          - ProwlerCodeBuildAccount
          - ProwlerCodeBuildRole
      - Label:
          default: S3 Settings
        Parameters:
          - ProwlerS3
      - Label:
          default: CrossAccount Role
        Parameters:
          - ProwlerCrossAccountRole

Parameters:
  ProwlerS3:
    Type: String
    Description: Enter S3 Bucket for Prowler Reports.  prefix-awsaccount-awsregion
    AllowedPattern: ^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$
    Default: prowler-954896828174-ap-northeast-2
  ProwlerCodeBuildAccount:
    Type: String
    Description: Enter AWS Account Number where Prowler CodeBuild Instance will reside.
    AllowedPattern: ^\d{12}$
    ConstraintDescription: An AWS Account Number must be a 12 digit numeric string.
    Default: 411267690458
  ProwlerCodeBuildRole:
    Type: String
    Description: Enter Instance Role that will be given to the Prowler CodeBuild (needed to grant sts:AssumeRole rights).
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters supported [+, =, ., @, -]
    Default: ProwlerCodeBuild-Role
  ProwlerCrossAccountRole:
    Type: String
    Description: Enter Name for CrossAccount Role to be created for Prowler to assess all Accounts in the AWS Organization.
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters supported [+, =, ., @, -]
    Default: ProwlerXA-CBRole

Resources:
  ProwlerRole:
    Type: AWS::IAM::Role
    Properties:
      Description: Provides Prowler CodeBuild permissions to assess security of Accounts in AWS Organization
      RoleName: !Ref ProwlerCrossAccountRole
      Tags:
        - Key: App
          Value: Prowler
      AssumeRolePolicyDocument:
        Version: 2012-10-17
        Statement:
          - Effect: Allow
            Principal:
              AWS:
                - !Sub arn:${AWS::Partition}:iam::${ProwlerCodeBuildAccount}:root
            Action:
              - sts:AssumeRole
            Condition:
              StringLike:
                aws:PrincipalArn: !Sub arn:${AWS::Partition}:iam::${ProwlerCodeBuildAccount}:role/${ProwlerCodeBuildRole}
      ManagedPolicyArns:
        - !Sub arn:${AWS::Partition}:iam::aws:policy/SecurityAudit
        - !Sub arn:${AWS::Partition}:iam::aws:policy/job-function/ViewOnlyAccess
      Policies:
        - PolicyName: Prowler-Additions-Policy
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Sid: AllowMoreReadForProwler
                Effect: Allow
                Resource: "*"
                Action:
                  - access-analyzer:List*
                  - apigateway:Get*
                  - apigatewayv2:Get*
                  - aws-marketplace:ViewSubscriptions
                  - dax:ListTables
                  - ds:ListAuthorizedApplications
                  - ds:DescribeRoles
                  - ec2:GetEbsEncryptionByDefault
                  - ecr:Describe*
                  - lambda:GetAccountSettings
                  - lambda:GetFunctionConfiguration
                  - lambda:GetLayerVersionPolicy
                  - lambda:GetPolicy
                  - opsworks-cm:Describe*
                  - opsworks:Describe*
                  - secretsmanager:ListSecretVersionIds
                  - sns:List*
                  - sqs:ListQueueTags
                  - states:ListActivities
                  - support:Describe*
                  - tag:GetTagKeys
                  - shield:GetSubscriptionState
                  - shield:DescribeProtection
                  - elasticfilesystem:DescribeBackupPolicy
        - PolicyName: Prowler-S3-Reports
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Sid: AllowGetPutListObject
                Effect: Allow
                Resource:
                  - !Sub arn:${AWS::Partition}:s3:::${ProwlerS3}
                  - !Sub arn:${AWS::Partition}:s3:::${ProwlerS3}/*
                Action:
                  - s3:GetObject
                  - s3:PutObject
                  - s3:ListBucket
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W11
            reason: "Prowler requires these rights to perform its Security Assessment."
          - id: W28
            reason: "Using a defined Role Name."

Outputs:
  ProwlerCrossAccountRole:
    Description: CrossAccount Role to be used by Prowler to assess AWS Accounts in the AWS Organization.
    Value: !Ref ProwlerCrossAccountRole
```

--------------------------------------------------------------------------------

---[FILE: ProwlerS3.yaml]---
Location: prowler-master/contrib/aws/org-multi-account/serverless_codebuild/templates/ProwlerS3.yaml

```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: Create Prowler S3 Bucket for Prowler Reports

Parameters:
  AwsOrgId:
    Type: String
    Description: >
      Enter AWS Organizations ID.
      This is used to restrict permissions to least privilege.
    AllowedPattern: ^o-[a-z0-9]{10,32}$
    ConstraintDescription: The Org Id must be a 12 character string starting with o- and followed by 10 lower case alphanumeric characters.
    Default: o-abcde12345
  S3Prefix:
    Type: String
    Description: >
      Enter S3 Bucket Name Prefix (in lowercase).
      Bucket will be named: prefix-awsaccount-awsregion (i.e., prowler-123456789012-us-east-1)
    AllowedPattern: ^[a-z0-9][a-z0-9-]{1,33}[a-z0-9]$
    ConstraintDescription: >
      Max 35 characters, as "-awsaccount-awsregion" will be added, and max name is 63 characters.
      Can't start or end with dash.  Can use numbers and lowercase letters.
    Default: prowler

Resources:
  ProwlerS3:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub ${S3Prefix}-${AWS::AccountId}-${AWS::Region}
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: "AES256"
      AccessControl: Private
      PublicAccessBlockConfiguration:
        BlockPublicAcls: True
        BlockPublicPolicy: True
        IgnorePublicAcls: True
        RestrictPublicBuckets: True
      VersioningConfiguration:
        Status: Enabled
      Tags:
        - Key: App
          Value: Prowler
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W35
            reason: "This S3 Bucket is only being used by the AWS Organization to download/upload prowler reports."

  ProwlerS3BucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref ProwlerS3
      PolicyDocument:
        Statement:
          - Sid: AllowGetPutListObject
            Effect: Allow
            Principal: "*"
            Action:
              - s3:GetObject
              - s3:PutObject
              - s3:ListBucket
              - s3:PutObjectAcl
            Resource:
              - !Sub arn:${AWS::Partition}:s3:::${ProwlerS3}
              - !Sub arn:${AWS::Partition}:s3:::${ProwlerS3}/*
            Condition:
              StringEquals:
                aws:PrincipalOrgId: !Ref AwsOrgId
          - Sid: DenyNonSSLRequests
            Effect: Deny
            Action: s3:*
            Resource:
              - !Sub arn:${AWS::Partition}:s3:::${ProwlerS3}
              - !Sub arn:${AWS::Partition}:s3:::${ProwlerS3}/*
            Principal: "*"
            Condition:
              Bool:
                aws:SecureTransport: false
          - Sid: DenyIncorrectEncryptionHeader
            Effect: Deny
            Principal: "*"
            Action: s3:PutObject
            Resource:
              - !Sub arn:${AWS::Partition}:s3:::${ProwlerS3}/*
            # Allow uploads with No Encryption, as S3 Default Encryption still applies.
            # If Encryption is set, only allow uploads with AES256.
            Condition:
              "Null":
                s3:x-amz-server-side-encryption: false
              StringNotEquals:
                s3:x-amz-server-side-encryption: AES256
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: F16
            reason: "This S3 Bucket Policy has a condition that only allows access to the AWS Organization."


Outputs:
  ProwlerS3:
    Description: S3 Bucket for Prowler Reports
    Value: !Ref ProwlerS3
  ProwlerS3Account:
    Description: AWS Account Number where Prowler S3 Bucket resides.
    Value: !Ref AWS::AccountId
```

--------------------------------------------------------------------------------

---[FILE: run-prowler-reports.sh]---
Location: prowler-master/contrib/aws/org-multi-account/src/run-prowler-reports.sh

```bash
#!/bin/bash -e
#
# Run Prowler against All AWS Accounts in an AWS Organization

# Change Directory (rest of the script, assumes your in the ec2-user home directory)
cd /home/ec2-user || exit

# Show Prowler Version, and Download Prowler, if it doesn't already exist
if ! ./prowler/prowler -V 2>/dev/null; then
    git clone https://github.com/prowler-cloud/prowler.git
    ./prowler/prowler -V
fi

# Source .awsvariables (to read in Environment Variables from CloudFormation Data)
# shellcheck disable=SC1091
source .awsvariables

# Get Values from Environment Variables Created on EC2 Instance from CloudFormation Data
echo "S3:             $S3"
echo "S3ACCOUNT:      $S3ACCOUNT"
echo "ROLE:           $ROLE"

# CleanUp Last Ran Prowler Reports, as they are already stored in S3.
rm -rf prowler/output/*.html

# Function to unset AWS Profile Variables
unset_aws() {
    unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}
unset_aws

# Find THIS Account AWS Number
CALLER_ARN=$(aws sts get-caller-identity --output text --query "Arn")
PARTITION=$(echo "$CALLER_ARN" | cut -d: -f2)
THISACCOUNT=$(echo "$CALLER_ARN" | cut -d: -f5)
echo "THISACCOUNT:    $THISACCOUNT"
echo "PARTITION:      $PARTITION"

# Function to Assume Role to THIS Account & Create Session
this_account_session() {
    unset_aws
    role_credentials=$(aws sts assume-role --role-arn arn:"$PARTITION":iam::"$THISACCOUNT":role/"$ROLE" --role-session-name ProwlerRun --output json)
    AWS_ACCESS_KEY_ID=$(echo "$role_credentials" | jq -r .Credentials.AccessKeyId)
    AWS_SECRET_ACCESS_KEY=$(echo "$role_credentials" | jq -r .Credentials.SecretAccessKey)
    AWS_SESSION_TOKEN=$(echo "$role_credentials" | jq -r .Credentials.SessionToken)
    export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}

# Find AWS Master Account
this_account_session
AWSMASTER=$(aws organizations describe-organization --query Organization.MasterAccountId --output text)
echo "AWSMASTER:      $AWSMASTER"

# Function to Assume Role to Master Account & Create Session
master_account_session() {
    unset_aws
    role_credentials=$(aws sts assume-role --role-arn arn:"$PARTITION":iam::"$AWSMASTER":role/"$ROLE" --role-session-name ProwlerRun --output json)
    AWS_ACCESS_KEY_ID=$(echo "$role_credentials" | jq -r .Credentials.AccessKeyId)
    AWS_SECRET_ACCESS_KEY=$(echo "$role_credentials" | jq -r .Credentials.SecretAccessKey)
    AWS_SESSION_TOKEN=$(echo "$role_credentials" | jq -r .Credentials.SessionToken)
    export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}

# Lookup All Accounts in AWS Organization
master_account_session
ACCOUNTS_IN_ORGS=$(aws organizations list-accounts --query Accounts[*].Id --output text)

# Function to Assume Role to S3 Account & Create Session
s3_account_session() {
    unset_aws
    role_credentials=$(aws sts assume-role --role-arn arn:"$PARTITION":iam::"$S3ACCOUNT":role/"$ROLE" --role-session-name ProwlerRun --output json)
    AWS_ACCESS_KEY_ID=$(echo "$role_credentials" | jq -r .Credentials.AccessKeyId)
    AWS_SECRET_ACCESS_KEY=$(echo "$role_credentials" | jq -r .Credentials.SecretAccessKey)
    AWS_SESSION_TOKEN=$(echo "$role_credentials" | jq -r .Credentials.SessionToken)
    export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}

# Run Prowler against Accounts in AWS Organization
echo "AWS Accounts in Organization"
echo "$ACCOUNTS_IN_ORGS"
PARALLEL_ACCOUNTS="1"
for accountId in $ACCOUNTS_IN_ORGS; do
    # shellcheck disable=SC2015
    test "$(jobs | wc -l)" -ge $PARALLEL_ACCOUNTS && wait || true
    {
        START_TIME=$SECONDS
        # Unset AWS Profile Variables
        unset_aws
        # Run Prowler
        echo -e "Assessing AWS Account: $accountId, using Role: $ROLE on $(date)"
        # remove -g cislevel for a full report and add other formats if needed
        ./prowler/prowler-cli.py --role arn:"$PARTITION":iam::"$accountId":role/"$ROLE" --compliance cis_1.5_aws -M html
        echo "Report stored locally at: prowler/output/ directory"
        TOTAL_SEC=$((SECONDS - START_TIME))
        echo -e "Completed AWS Account: $accountId, using Role: $ROLE on $(date)"
        printf "Completed AWS Account: $accountId in %02dh:%02dm:%02ds" $((TOTAL_SEC / 3600)) $((TOTAL_SEC % 3600 / 60)) $((TOTAL_SEC % 60))
        echo ""
    } &
done

# Wait for All Prowler Processes to finish
wait
echo "Prowler Assessments Completed against All Accounts in the AWS Organization. Starting S3 copy operations..."

# Upload Prowler Report to S3
s3_account_session
aws s3 cp prowler/output/ "$S3/reports/" --recursive --include "*.html" --acl bucket-owner-full-control
echo "Assessment reports successfully copied to S3 bucket"

# Final Wait for All Prowler Processes to finish
wait
echo "Prowler Assessments Completed"

# Unset AWS Profile Variables
unset_aws
```

--------------------------------------------------------------------------------

---[FILE: enable_apis_in_projects.sh]---
Location: prowler-master/contrib/gcp/enable_apis_in_projects.sh

```bash
#!/bin/bash

# List of project IDs
PROJECT_IDS=(
    "project-id-1"
    "project-id-2"
    "project-id-3"
    # Add more project IDs as needed
)

# List of Prowler APIs to enable
APIS=(
    "apikeys.googleapis.com"
    "artifactregistry.googleapis.com"
    "bigquery.googleapis.com"
    "sqladmin.googleapis.com"  # Cloud SQL
    "storage.googleapis.com"  # Cloud Storage
    "compute.googleapis.com"
    "dataproc.googleapis.com"
    "dns.googleapis.com"
    "containerregistry.googleapis.com"  # GCR (Google Container Registry)
    "container.googleapis.com"  # GKE (Google Kubernetes Engine)
    "iam.googleapis.com"
    "cloudkms.googleapis.com"  # KMS (Key Management Service)
    "logging.googleapis.com"
)

# Function to enable APIs for a given project
enable_apis_for_project() {
    local PROJECT_ID=$1

    echo "Enabling APIs for project: ${PROJECT_ID}"

    for API in "${APIS[@]}"; do
        echo "Enabling API: $API for project: ${PROJECT_ID}"
        if gcloud services enable "${API}" --project="${PROJECT_ID}"; then
            echo "Successfully enabled API $API for project ${PROJECT_ID}."
        else
            echo "Failed to enable API $API for project ${PROJECT_ID}."
        fi
    done
}

# Loop over each project and enable the APIs
for PROJECT_ID in "${PROJECT_IDS[@]}"; do
    enable_apis_for_project "${PROJECT_ID}"
done
```

--------------------------------------------------------------------------------

---[FILE: cronjob.yml]---
Location: prowler-master/contrib/k8s/cronjob.yml

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: devsecops-prowler-cronjob-secret
  namespace: defectdojo
spec:
#Cron Time is set according to server time, ensure server time zone and set accordingly.
  successfulJobsHistoryLimit: 2
  failedJobsHistoryLimit: 1
  schedule: "5 3 * * 0,2,4"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: prowler
            image: toniblyx/prowler:latest
            imagePullPolicy: Always
            command:
            - "./prowler-cli.py"
            args: [ "-B", "$(awsS3Bucket)" ]
            env:
            - name: AWS_ACCESS_KEY_ID
              valueFrom:
                secretKeyRef:
                  name:  devsecops-prowler-cronjob-secret
                  key: awsId
            - name: AWS_SECRET_ACCESS_KEY
              valueFrom:
                secretKeyRef:
                  name:  devsecops-prowler-cronjob-secret
                  key: awsSecretKey
            - name: awsS3Bucket
              valueFrom:
                secretKeyRef:
                  name:  devsecops-prowler-cronjob-secret
                  key: awsS3Bucket
            imagePullPolicy: IfNotPresent
          restartPolicy: OnFailure
      backoffLimit: 3
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/contrib/k8s/README.md

```text
## K8S - Cronjob
Simple instructions to add a cronjob on K8S to execute a prowler and save the results on AWS S3.

### Files:
cronjob.yml ---> is a **cronjob** for K8S, you must set the frequency and probes from yours scans \
secret.yml -----> is a **secret** file with AWS ID/Secret and the name of bucket

### To apply:

`$ kubectl -f cronjob.yml` \
`$ kubectl -f secret.yml`
```

--------------------------------------------------------------------------------

---[FILE: secret.yml]---
Location: prowler-master/contrib/k8s/secret.yml

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: devsecops-prowler-cronjob-secret
  namespace: defectdojo
type: Opaque
stringData:
  awsId: myAWSSecretID
  awsSecretKey: myAWSSecretKey
  awsS3Bucket: myAWSS3Bucket
```

--------------------------------------------------------------------------------

---[FILE: .helmignore]---
Location: prowler-master/contrib/k8s/helm/prowler-api/.helmignore

```text
# Patterns to ignore when building packages.
# This supports shell glob matching, relative path matching, and
# negation (prefixed with !). Only one pattern per line.
.DS_Store
# Common VCS dirs
.git/
.gitignore
.bzr/
.bzrignore
.hg/
.hgignore
.svn/
# Common backup files
*.swp
*.bak
*.tmp
*.orig
*~
# Various IDEs
.project
.idea/
*.tmproj
.vscode/
```

--------------------------------------------------------------------------------

---[FILE: Chart.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-api/Chart.yaml

```yaml
apiVersion: v2
name: prowler-api
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
type: application

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
# Versions are expected to follow Semantic Versioning (https://semver.org/)
version: 0.1.0

# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application. Versions are not expected to
# follow Semantic Versioning. They should reflect the version the application is using.
# It is recommended to use it with quotes.
appVersion: "5.1.1"
```

--------------------------------------------------------------------------------

````
