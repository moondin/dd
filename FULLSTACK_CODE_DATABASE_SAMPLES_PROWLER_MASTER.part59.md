---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 59
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 59 of 867)

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

---[FILE: codebuild-prowlerv3-audit-account-cfn.yaml]---
Location: prowler-master/contrib/aws/codebuild/codebuild-prowlerv3-audit-account-cfn.yaml

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
    Description: 'Options to pass to Prowler command, use -f to filter specific regions, -c for specific checks, -s for specific services, for SecurityHub integration use "-f shub_region -S", for more options see -h. For a complete assessment leave this empty.'
    Type: String
    # Prowler command below runs a set of checks, configure it base on your needs, no options will run all regions all checks.
    Default: -f eu-west-1 -s s3 iam ec2

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
                - account:Get*
                - appstream:Describe*
                - codeartifact:List*
                - codebuild:BatchGet*
                - cognito-idp:GetUserPoolMfaConfig
                - ds:Get*
                - ds:Describe*
                - ds:List*
                - ec2:GetEbsEncryptionByDefault
                - ecr:Describe*
                - elasticfilesystem:DescribeBackupPolicy
                - glue:GetConnections
                - glue:GetSecurityConfiguration*
                - glue:SearchTables
                - lambda:GetFunction*
                - macie2:GetMacieSession
                - s3:GetAccountPublicAccessBlock
                - s3:GetPublicAccessBlock
                - shield:DescribeProtection
                - shield:GetSubscriptionState
                - securityhub:BatchImportFindings
                - securityhub:GetFindings
                - ssm:GetDocument
                - support:Describe*
                - tag:GetTagKeys
                Effect: Allow
                Resource: '*'
        - PolicyName: ProwlerAdditionsApiGW
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Action:
                - apigateway:GET
                Effect: Allow
                Resource: 'arn:aws:apigateway:*::/restapis/*'
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
      Source:
        Type: NO_SOURCE
        BuildSpec: |
          version: 0.2
          phases:
            install:
              runtime-versions:
                python: 3.9
              commands:
                - echo "Installing Prowler..."
                - pip3 install prowler
            build:
              commands:
                - echo "Running Prowler as prowler $PROWLER_OPTIONS"
                - prowler $PROWLER_OPTIONS
            post_build:
              commands:
                - echo "Uploading reports to S3..."
                - aws s3 cp --sse AES256 output/ s3://$BUCKET_REPORT/ --recursive
                - echo "Done!"
          # Currently not supported in Version 3
          # reports:
          #   prowler:
          #     files:
          #       - '**/*'
          #     base-directory: 'junit-reports'
          #     file-format: JunitXml
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

---[FILE: .awsvariables]---
Location: prowler-master/contrib/aws/multi-account-securityhub/.awsvariables

```text
export ROLE=ProwlerXA-Role
export PARALLEL_ACCOUNTS=1
export REGION=us-east-1
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: prowler-master/contrib/aws/multi-account-securityhub/Dockerfile

```text
# Build command
# docker build --platform=linux/amd64  --no-cache -t prowler:latest .

ARG PROWLER_VERSION=latest

FROM toniblyx/prowler:${PROWLER_VERSION}

USER 0
# hadolint ignore=DL3018
RUN apk --no-cache add bash aws-cli jq

ARG MULTI_ACCOUNT_SECURITY_HUB_PATH=/home/prowler/multi-account-securityhub

USER prowler

# Move script and environment variables
RUN mkdir "${MULTI_ACCOUNT_SECURITY_HUB_PATH}"
COPY --chown=prowler:prowler .awsvariables run-prowler-securityhub.sh  "${MULTI_ACCOUNT_SECURITY_HUB_PATH}"/
RUN chmod 500 "${MULTI_ACCOUNT_SECURITY_HUB_PATH}"/run-prowler-securityhub.sh & \
    chmod 400 "${MULTI_ACCOUNT_SECURITY_HUB_PATH}"/.awsvariables

WORKDIR ${MULTI_ACCOUNT_SECURITY_HUB_PATH}

ENTRYPOINT ["./run-prowler-securityhub.sh"]
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/contrib/aws/multi-account-securityhub/README.md

```text
# Example Solution:  Serverless Organizational Prowler Deployment with SecurityHub

Deploys [Prowler](https://github.com/prowler-cloud/prowler) with AWS Fargate to assess all Accounts in an AWS Organization on a schedule, and sends the results to Security Hub.

## Context
Originally based on [org-multi-account](https://github.com/prowler-cloud/prowler/tree/master/util/org-multi-account), but changed in the following ways:

 - No HTML reports and no S3 buckets
 - Findings sent directly to Security Hub using the native integration
 - AWS Fargate Task with EventBridge Rule instead of EC2 instance with cronjob
 - Based on amazonlinux:2022 to leverage "wait -n" for improved parallelization as new jobs are launched as one finishes

## Architecture Explanation

The solution is designed to be very simple. Prowler is run via an ECS Task definition that launches a single Fargate container. This Task Definition is executed on a schedule using an EventBridge Rule.

## Prerequisites

This solution assumes that you have a VPC architecture with two redundant subnets that can reach the AWS API endpoints (e.g. PrivateLink, NAT Gateway, etc.).

## CloudFormation Templates

 ### CF-Prowler-IAM.yml
Creates the following IAM Roles:

 1. **ECSExecutionRole**: Required for the Task Definition to be able to fetch the container image from ECR and launch the container.
 2. **ProwlerTaskRole**: Role that the container itself runs with. It allows it to assume the ProwlerCrossAccountRole.
 3. **ECSEventRoleName**: Required for the EventBridge Rule to execute the Task Definition.

### CF-Prowler-ECS.yml
Creates the following resources:

 1. **ProwlerECSCluster**: Cluster to be used to execute the Task Definition.
 2. **ProwlerECSCloudWatchLogsGroup**: Log group for the Prowler container logs. This is required because it's the only log driver supported by Fargate. The Prowler executable logs are suppressed to prevent unnecessary logs, but error logs are kept for debugging.
 3. **ProwlerECSTaskDefinition**: Task Definition for the Fargate container. CPU and memory can be increased as needed. In my experience, 1 CPU per parallel Prowler job is ideal, but further performance testing may be required to find the optimal configuration for a specific organization. Enabling container insights helps a lot with this.
 4. **ProwlerSecurityGroup**: Security Group for the container. It only allows TCP 443 outbound, as it is the only port needed for awscli.
 5. **ProwlerTaskScheduler**: EventBridge Rule that schedules the execution of the Task Definition. The cron expression is specified as a CloudFormation template parameter.

### CF-Prowler-CrossAccountRole.yml
Creates the cross account IAM Role required for Prowler to run. Deploy it as StackSet in every account in the AWS Organization.

## Docker Container

### Dockerfile
The Dockerfile does the following:
 1. Uses amazonlinux:2022 as a base.
 2. Downloads required dependencies.
 3. Copies the .awsvariables and run-prowler-securityhub.sh files into the root.
 4. Downloads the specified version of Prowler as recommended in the release notes.
 5. Assigns permissions to a lower privileged user and then drops to it.
 6. Runs the script.

### .awsvariables
The .awsvariables file is used to pass required configuration to the script:

 1. **ROLE**: The cross account Role to be assumed for the Prowler assessments.
 2. **PARALLEL_ACCOUNTS**: The number of accounts to be scanned in parallel.
 3. **REGION**: Region where Prowler will run its assessments.

### run-prowler-securityhub.sh
The script gets the list of accounts in AWS Organizations, and then executes Prowler as a job for each account, up to PARALLEL_ACCOUNT accounts at the same time.
The logs that are generated and sent to Cloudwatch are error logs, and assessment start and finish logs.

## Instructions
 1. Create a Private ECR Repository in the account that will host the Prowler container. The Audit account is recommended, but any account can be used.
 2. Configure the .awsvariables file. Note the ROLE name chosen as it will be the CrossAccountRole.
 3. Follow the steps from "View Push Commands" to build and upload the container image. Substitute step 2 with the build command provided in the Dockerfile. You need to have Docker and AWS CLI installed, and use the cli to login to the account first.  After upload note the Image URI, as it is required for the CF-Prowler-ECS template. Ensure that you pay attention to the architecture while performing the docker build command. A common mistake is not specifying the architecture and then building on Apple silicon. Your task will fail with  *exec /home/prowler/.local/bin/prowler: exec format error*. 
 4. Make sure SecurityHub is enabled in every account in AWS Organizations, and that the SecurityHub integration is enabled as explained in [Prowler - Security Hub Integration](https://github.com/prowler-cloud/prowler#security-hub-integration)
 5. Deploy **CF-Prowler-CrossAccountRole.yml** in the Master Account as a single stack. You will have to choose the CrossAccountRole name (ProwlerXA-Role by default) and the ProwlerTaskRoleName (ProwlerECSTask-Role by default)
 6. Deploy **CF-Prowler-CrossAccountRole.yml** in every Member Account as a StackSet. Choose the same CrossAccountName and ProwlerTaskRoleName as the previous step.
 7. Deploy **CF-Prowler-IAM.yml** in the account that will host the Prowler container (the same from step 1).  The following template parameters must be provided:
    - **ProwlerCrossAccountRoleName**: Name of the from CF-Prowler-CrossAccountRole (default ProwlerXA-Role).
    - **ECSExecutionRoleName**: Name for the ECS Task Execution Role (default ECSTaskExecution-Role).
    - **ProwlerTaskRoleName**: Name for the ECS Prowler Task Role (default ProwlerECSTask-Role).
    - **ECSEventRoleName**: Name for the Eventbridge Task Role (default ProwlerEvents-Role).
 8. Deploy **CF-Prowler-ECS.yml** in the account that will host the Prowler container (the same from step 1).  The following template parameters must be provided:
	- **ProwlerClusterName**: Name for the ECS Cluster (default ProwlerCluster)
	- **ProwlerContainerName**: Name for the Prowler container (default prowler)
	- **ProwlerContainerInfo**: ECR URI from step 1.
	- **ProwlerECSLogGroupName**: CloudWatch Log Group name (default /aws/ecs/SecurityHub-Prowler)
	- **SecurityGroupVPCId**: VPC ID for the VPC where the container will run.
	- **ProwlerScheduledSubnet1 and 2**: Subnets IDs from the VPC specified. Choose private subnets if possible.
	- **ECSExecutionRole**: ECS Execution Task Role ARN from CF-Prowler-IAM outputs.
	- **ProwlerTaskRole**: Prowler ECS Task Role ARN from CF-Prowler-IAM outputs.
	- **ECSEventRole**: Eventbridge Task Role ARN from CF-Prowler-IAM outputs.
	- **CronExpression**: Valid Cron Expression for the scheduling of the Task Definition.
 9. Verify that Prowler runs correctly by checking the CloudWatch logs after the scheduled task is executed.

---
## Troubleshooting

If you permission find errors in the CloudWatch logs, the culprit might be a [Service Control Policy (SCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html). You will need to exclude the Prowler Cross Account Role from those SCPs.

---
## Upgrading Prowler

Prowler version is controlled by the PROWLERVER argument in the Dockerfile, change it to the desired version and follow the ECR Push Commands to update the container image.
Old images can be deleted from the ECR Repository after the new image is confirmed to work. They will show as "untagged" as only one image can hold the "latest" tag.
```

--------------------------------------------------------------------------------

---[FILE: run-prowler-securityhub.sh]---
Location: prowler-master/contrib/aws/multi-account-securityhub/run-prowler-securityhub.sh

```bash
#!/bin/bash
# Run Prowler against All AWS Accounts in an AWS Organization

# Activate Poetry Environment
eval "$(poetry env activate)"

# Show Prowler Version
prowler -v

# Source .awsvariables
# shellcheck disable=SC1091
source .awsvariables

# Get Values from Environment Variables
echo "ROLE:               ${ROLE}"
echo "PARALLEL_ACCOUNTS:  ${PARALLEL_ACCOUNTS}"
echo "REGION:             ${REGION}"

# Function to unset AWS Profile Variables
unset_aws() {
    unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}
unset_aws

# Find THIS Account AWS Number
CALLER_ARN=$(aws sts get-caller-identity --output text --query "Arn")
PARTITION=$(echo "${CALLER_ARN}" | cut -d: -f2)
THISACCOUNT=$(echo "${CALLER_ARN}" | cut -d: -f5)
echo "THISACCOUNT:    ${THISACCOUNT}"
echo "PARTITION:      ${PARTITION}"

# Function to Assume Role to THIS Account & Create Session
this_account_session() {
    unset_aws
    role_credentials=$(aws sts assume-role --role-arn arn:"${PARTITION}":iam::"${THISACCOUNT}":role/"${ROLE}" --role-session-name ProwlerRun --output json)
    AWS_ACCESS_KEY_ID=$(echo "${role_credentials}" | jq -r .Credentials.AccessKeyId)
    AWS_SECRET_ACCESS_KEY=$(echo "${role_credentials}" | jq -r .Credentials.SecretAccessKey)
    AWS_SESSION_TOKEN=$(echo "${role_credentials}" | jq -r .Credentials.SessionToken)
    export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}

# Find AWS Master Account
this_account_session
AWSMASTER=$(aws organizations describe-organization --query Organization.MasterAccountId --output text)
echo "AWSMASTER:      ${AWSMASTER}"

# Function to Assume Role to Master Account & Create Session
master_account_session() {
    unset_aws
    role_credentials=$(aws sts assume-role --role-arn arn:"${PARTITION}":iam::"${AWSMASTER}":role/"${ROLE}" --role-session-name ProwlerRun --output json)
    AWS_ACCESS_KEY_ID=$(echo "${role_credentials}" | jq -r .Credentials.AccessKeyId)
    AWS_SECRET_ACCESS_KEY=$(echo "${role_credentials}" | jq -r .Credentials.SecretAccessKey)
    AWS_SESSION_TOKEN=$(echo "${role_credentials}" | jq -r .Credentials.SessionToken)
    export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}

# Lookup All Accounts in AWS Organization
master_account_session
ACCOUNTS_IN_ORGS=$(aws organizations list-accounts --query Accounts[*].Id --output text)

# Run Prowler against Accounts in AWS Organization
echo "AWS Accounts in Organization"
echo "${ACCOUNTS_IN_ORGS}"
for accountId in ${ACCOUNTS_IN_ORGS}; do
    # shellcheck disable=SC2015
    test "$(jobs | wc -l)" -ge "${PARALLEL_ACCOUNTS}" && wait -n || true
    {
        START_TIME=${SECONDS}
        # Unset AWS Profile Variables
        unset_aws
        # Run Prowler
        echo -e "Assessing AWS Account: ${accountId}, using Role: ${ROLE} on $(date)"
        # Pipe stdout to /dev/null to reduce unnecessary Cloudwatch logs
        prowler aws -R arn:"${PARTITION}":iam::"${accountId}":role/"${ROLE}" --security-hub --send-sh-only-fails -f "${REGION}" > /dev/null
        TOTAL_SEC=$((SECONDS - START_TIME))
        printf "Completed AWS Account: ${accountId} in %02dh:%02dm:%02ds" $((TOTAL_SEC / 3600)) $((TOTAL_SEC % 3600 / 60)) $((TOTAL_SEC % 60))
        echo ""
    } &
done

# Wait for All Prowler Processes to finish
wait
echo "Prowler Assessments Completed against All Accounts in AWS Organization"

# Unset AWS Profile Variables
unset_aws
```

--------------------------------------------------------------------------------

---[FILE: CF-Prowler-CrossAccountRole.yml]---
Location: prowler-master/contrib/aws/multi-account-securityhub/templates/CF-Prowler-CrossAccountRole.yml

```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: Create the Cross-Account IAM Prowler Role
Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      - Label:
          default: ECS Settings
        Parameters:
          - ProwlerEcsAccount
          - ProwlerTaskRoleName
      - Label:
          default: CrossAccount Role
        Parameters:
          - ProwlerCrossAccountRole
Parameters:
  ProwlerEcsAccount:
    Type: String
    Description: Enter AWS Account Number where Prowler ECS Task will reside.
    AllowedPattern: ^\d{12}$
    ConstraintDescription: An AWS Account Number must be a 12 digit numeric string.
  ProwlerTaskRoleName:
    Type: String
    Description: Enter Instance Role that will be given to the Prowler ECS Instance (needed to grant sts:AssumeRole rights).
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters supported [+, =, ., @, -]
    Default: ProwlerECSTask-Role
  ProwlerCrossAccountRole:
    Type: String
    Description: Enter Name for CrossAccount Role to be created for Prowler to assess all Accounts in the AWS Organization.
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters supported [+, =, ., @, -]
    Default: ProwlerXA-Role
Resources:
  ProwlerRole:
    Type: AWS::IAM::Role
    Properties:
      Description: Provides Prowler ECS tasks permissions to assess security of Accounts in AWS Organization
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
                - !Sub arn:${AWS::Partition}:iam::${ProwlerEcsAccount}:role/${ProwlerTaskRoleName}
            Action:
              - sts:AssumeRole
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
                  - account:Get*
                  - appstream:Describe*
                  - appstream:List*
                  - backup:List*
                  - cloudtrail:GetInsightSelectors
                  - codeartifact:List*
                  - codebuild:BatchGet*
                  - cognito-idp:GetUserPoolMfaConfig
                  - dlm:Get*
                  - drs:Describe*
                  - ds:Describe*
                  - ds:Get*
                  - ds:List*
                  - dynamodb:GetResourcePolicy
                  - ec2:GetEbsEncryptionByDefault
                  - ec2:GetSnapshotBlockPublicAccessState
                  - ec2:GetInstanceMetadataDefaults
                  - ecr:Describe*
                  - ecr:GetRegistryScanningConfiguration
                  - elasticfilesystem:DescribeBackupPolicy
                  - glue:GetConnections
                  - glue:GetSecurityConfiguration*
                  - glue:SearchTables
                  - lambda:GetFunction*
                  - logs:FilterLogEvents
                  - lightsail:GetRelationalDatabases
                  - macie2:GetMacieSession
                  - s3:GetAccountPublicAccessBlock
                  - shield:DescribeProtection
                  - shield:GetSubscriptionState
                  - ssm:GetDocument
                  - ssm-incidents:List*
                  - support:Describe*
                  - tag:GetTagKeys
                  - wellarchitected:List*

              - Sid: AllowProwlerSecurityHub
                Effect: Allow
                Resource: "*"
                Action:
                  - securityhub:BatchImportFindings
                  - securityhub:GetFindings
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

---[FILE: CF-Prowler-ECS.yml]---
Location: prowler-master/contrib/aws/multi-account-securityhub/templates/CF-Prowler-ECS.yml

```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: This Template will create the infrastructure for Prowler with ECS Fargate
Parameters:
  ProwlerClusterName:
    Type: String
    Description: Name of the ECS Cluster that the Prowler Fargate Task will run in
    Default: ProwlerCluster
  ProwlerContainerName:
    Type: String
    Description: Name of the Prowler Container Definition within the ECS Task
    Default: prowler
  ProwlerContainerInfo:
    Type: String
    Description: ECR URI of the Prowler container
  ProwlerECSLogGroupName:
    Type: String
    Description: Name for the log group to be created
    Default: /aws/ecs/SecurityHub-Prowler
  SecurityGroupVPCId:
    Type: String
    Description: VPC Id for the Security Group to be created
  ProwlerScheduledSubnet1:
    Type: String
    Description: Subnet Id in which Prowler can be scheduled to Run
  ProwlerScheduledSubnet2:
    Type: String
    Description: A secondary Subnet Id in which Prowler can be scheduled to Run
  ECSExecutionRole:
    Type: String
    Description: ECS Execution Task Role ARN.
  ProwlerTaskRole:
    Type: String
    Description: Prowler ECS Task Role ARN.
  ECSEventRole:
    Type: String
    Description: Eventbridge Task Role ARN.
  CronExpression:
    Type: String
    Description: Cron schedule for the event rule.
    Default: cron(0 23 * * ? *)
Resources:
  ProwlerECSCloudWatchLogsGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Ref ProwlerECSLogGroupName
      RetentionInDays: 90
  ProwlerECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: !Ref ProwlerClusterName
  ProwlerECSTaskDefinition:
    Type: AWS::ECS::TaskDefinition
    Properties:
      ContainerDefinitions:
        - Image: !Ref ProwlerContainerInfo
          Name: !Ref ProwlerContainerName
          LogConfiguration:
            LogDriver: awslogs
            Options:
              awslogs-group: !Ref ProwlerECSCloudWatchLogsGroup
              awslogs-region: !Ref 'AWS::Region'
              awslogs-stream-prefix: ecs
      Cpu: 1024
      ExecutionRoleArn: !Ref ECSExecutionRole
      Memory: 8192
      NetworkMode: awsvpc
      TaskRoleArn: !Ref ProwlerTaskRole
      Family: SecurityHubProwlerTask
      RequiresCompatibilities:
        - FARGATE
  ProwlerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
        GroupDescription: Allow HTTPS Out - Prowler
        VpcId: !Ref SecurityGroupVPCId
        SecurityGroupEgress:
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
  ProwlerTaskScheduler:
    Type: AWS::Events::Rule
    Properties:
      ScheduleExpression: !Ref CronExpression
      State: ENABLED
      Targets:
        - Arn: !GetAtt ProwlerECSCluster.Arn
          RoleArn: !Ref ECSEventRole
          Id: prowlerTaskScheduler
          EcsParameters:
            TaskDefinitionArn: !Ref ProwlerECSTaskDefinition
            TaskCount: 1
            LaunchType: FARGATE
            PlatformVersion: 'LATEST'
            NetworkConfiguration:
              AwsVpcConfiguration:
                AssignPublicIp: DISABLED
                SecurityGroups:
                  - !Ref ProwlerSecurityGroup
                Subnets:
                  - !Ref ProwlerScheduledSubnet1
                  - !Ref ProwlerScheduledSubnet2
```

--------------------------------------------------------------------------------

---[FILE: CF-Prowler-IAM.yml]---
Location: prowler-master/contrib/aws/multi-account-securityhub/templates/CF-Prowler-IAM.yml

```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: This Template will create the IAM Roles needed for the Prowler infrastructure
Parameters:
  ProwlerCrossAccountRoleName:
    Type: String
    Description: Name of the cross account Prowler IAM Role
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters supported [+, =, ., @, -]
    Default: ProwlerXA-Role
  ECSExecutionRoleName:
    Type: String
    Description: Name for the ECS Task Execution Role
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters supported [+, =, ., @, -]
    Default: ECSTaskExecution-Role
  ProwlerTaskRoleName:
    Type: String
    Description: Name for the ECS Prowler Task Role
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters supported [+, =, ., @, -]
    Default: ProwlerECSTask-Role
  ECSEventRoleName:
    Type: String
    Description: Name for the Eventbridge Task Role
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters supported [+, =, ., @, -]
    Default: ProwlerEvents-Role
Resources:
  ECSExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: !Ref ECSExecutionRoleName
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
        - Sid: ECSExecutionTrust
          Effect: Allow
          Principal:
            Service: ecs-tasks.amazonaws.com
          Action: sts:AssumeRole
  ProwlerTaskRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: !Ref ProwlerTaskRoleName
      Policies:
      - PolicyName: ProwlerAssumeRole
        PolicyDocument:
          Version: '2012-10-17'
          Statement:
          - Sid: AllowProwlerAssumeRole
            Effect: Allow
            Action: sts:AssumeRole
            Resource:
            - !Sub arn:aws:iam::*:role/${ProwlerCrossAccountRoleName}
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
        - Sid: ECSExecutionTrust
          Effect: Allow
          Principal:
            Service: ecs-tasks.amazonaws.com
          Action: sts:AssumeRole
  ECSEventRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: !Ref ECSEventRoleName
      Policies:
      - PolicyName: AllowProwlerEventsECS
        PolicyDocument:
          Version: '2012-10-17'
          Statement:
          - Effect: Allow
            Action:
            - ecs:RunTask
            Resource:
            - "*"
            Sid: EventRunECS
          - Effect: Allow
            Action: iam:PassRole
            Resource:
            - "*"
            Sid: EventPassRole
            Condition:
              StringLike:
                iam:PassedToService: ecs-tasks.amazonaws.com
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
        - Sid: EventsECSExecutionTrust
          Effect: Allow
          Principal:
            Service: events.amazonaws.com
          Action: sts:AssumeRole
Outputs:
  ECSExecutionRoleARN:
    Description: ARN of the ECS Task Execution Role
    Value: !GetAtt ECSExecutionRole.Arn
    Export:
      Name: ECSExecutionRoleArn
  ProwlerTaskRoleARN:
    Description: ARN of the ECS Prowler Task Role
    Value: !GetAtt ProwlerTaskRole.Arn
    Export:
      Name: ProwlerTaskRoleArn
  ECSEventRoleARN:
    Description: ARN of the Eventbridge Task Role
    Value: !GetAtt ECSEventRole.Arn
    Export:
      Name: ECSEventRoleARN
```

--------------------------------------------------------------------------------

````
