---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 60
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 60 of 867)

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

---[FILE: ProwlerEC2.yaml]---
Location: prowler-master/contrib/aws/org-multi-account/ProwlerEC2.yaml

```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: Create Prowler EC2 with UserData (Shell Scripts, & AWS CLI Profiles)

Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      - Label:
          default: Prowler EC2 Instance Settings
        Parameters:
          - BuildNumber
          - ProwlerEc2Name
          - InstanceType
          - KeyPair
          - SubnetId
          - VpcId
          - Ec2Role
          - LatestAmazonLinux2AmiId
          - ProwlerCron
      - Label:
          default: S3 Settings
        Parameters:
          - ProwlerS3
          - ProwlerS3Account
      - Label:
          default: CrossAccount Role
        Parameters:
          - AwsOrgId
          - CrossAccountRole

Parameters:
  BuildNumber:
    Type: String
    Description: Enter Build Number (increment with Updates for cfn-init)
    AllowedPattern: ^\d*$
    ConstraintDescription: Build Number must be a numeric string.
    Default: 1
  ProwlerEc2Name:
    Type: String
    Description: Enter Name for Prowler EC2 Instance to create
    AllowedPattern: ^[\w\s_.\/=+-]{1,128}$
    ConstraintDescription: Max 128 alphanumeric characters. Also special characters supported [whitespace, _, ., /, =, +, -]
    Default: Prowler-EC2
  InstanceType:
    Description: Enter Instance Type
    Type: String
    Default: t2.micro
  KeyPair:
    Description: Choose a KeyPair
    Type: AWS::EC2::KeyPair::KeyName
  SubnetId:
    Description: Choose Subnet
    Type: AWS::EC2::Subnet::Id
  VpcId:
    Description: Choose VPC
    Type: AWS::EC2::VPC::Id
  Ec2Role:
    Description: Enter Name for EC2 Instance Role to create and attach to Prowler EC2 Instance
    Type: String
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters supported [+, =, ., @, -]
    Default: ProwlerEC2-Role
  ProwlerCron:
    Description: Enter cron schedule.  Default, runs everyday at 1am. See https://crontab.guru/, for syntax help.
    Type: String
    Default: "0 1 * * *"
  LatestAmazonLinux2AmiId:
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Description: Latest AMI ID for Amazon Linux 2 (via AWS Publis SSM Parameters. See https://tinyurl.com/aws-public-ssm-parameters.
    Default: /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-ebs

  ProwlerS3:
    Type: String
    Description: Enter S3 Bucket for Prowler Reports.  prefix-awsaccount-awsregion
    AllowedPattern: ^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$
    ConstraintDescription: Max 63 characters. Can't start or end with dash.  Can use numbers and lowercase letters.
    Default: prowler-123456789012-us-east-1
  ProwlerS3Account:
    Type: String
    Description: Enter AWS Account Number where Prowler S3 Bucket resides.
    AllowedPattern: ^\d{12}$
    ConstraintDescription: An AWS Account Number must be a 12 digit numeric string.
    Default: 123456789012

  AwsOrgId:
    Type: String
    Description: Enter AWS Organizations ID
    AllowedPattern: ^o-[a-z0-9]{10,32}$
    ConstraintDescription: The Org Id must be a 12 character string starting with o- and followed by 10 lower case alphanumeric characters.
    Default: o-abcde12345
  CrossAccountRole:
    Type: String
    Description: Enter CrossAccount Role Prowler will be using to assess AWS Accounts in the AWS Organization. (ProwlerCrossAccountRole)
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters [+, =, ., @, -]
    Default: ProwlerXA-Role

Resources:
  ProwlerEc2:
    Type: AWS::EC2::Instance
    CreationPolicy:
      ResourceSignal:
        Timeout: PT5M
    Properties:
      KeyName: !Ref KeyPair
      ImageId: !Ref LatestAmazonLinux2AmiId
      IamInstanceProfile: !Ref ProwlerInstanceProfile
      InstanceType: !Ref InstanceType
      SubnetId: !Ref SubnetId
      SecurityGroupIds:
        - !Ref ProwlerSecurityGroup
      BlockDeviceMappings:
        - DeviceName: /dev/xvda
          Ebs:
            Encrypted: true
            KmsKeyId: alias/aws/ebs
            VolumeType: standard
            DeleteOnTermination: true
            VolumeSize: 8
      Tags:
        - Key: Name
          Value: !Ref ProwlerEc2Name
        - Key: App
          Value: Prowler
      UserData:
        Fn::Base64:
          !Sub |
            #!/bin/bash
            yum update -y aws-cfn-bootstrap
            /opt/aws/bin/cfn-init -v --stack ${AWS::StackName} --resource ProwlerEc2 --configsets onfirstboot --region ${AWS::Region}
            yum -y update
            /opt/aws/bin/cfn-signal -e $? --stack ${AWS::StackName} --resource ProwlerEc2 --region ${AWS::Region}
    Metadata:
      AWS::CloudFormation::Authentication:
        S3AccessCreds:
          type: S3
          buckets:
            - !Ref ProwlerS3
          roleName:
            Ref: ProwlerEc2Role
      AWS::CloudFormation::Init:
        configSets:
          onfirstboot:
            - build-number
            - configure-cfn
            - prowler-prereqs
            - prowler-reports
            - prowler-schedule
          onupdate:
            - build-number
            - prowler-prereqs
            - prowler-reports
            - prowler-schedule
        build-number:
          commands:
            show-build-number:
              command: !Sub |
                echo "BUILDNUMBER:   ${BuildNumber}"
        configure-cfn:
          files:
            /etc/cfn/hooks.d/cfn-auto-reloader.conf:
              content: !Sub |
                [cfn-auto-reloader-hook]
                triggers=post.update
                path=Resources.ProwlerEc2.Metadata.AWS::CloudFormation::Init
                action=/opt/aws/bin/cfn-init -v --stack ${AWS::StackName} --resource ProwlerEc2 --configsets onupdate --region ${AWS::Region}
                runas=root
              mode: "000400"
              owner: root
              group: root
            /etc/cfn/cfn-hup.conf:
              content: !Sub |
                [main]
                stack=${AWS::StackId}
                region=${AWS::Region}
                verbose=true
                interval=5
              mode: "000400"
              owner: root
              group: root
          services:
            sysvinit:
              cfn-hup:
                enabled: true
                ensureRunning: true
                files:
                  - /etc/cfn/cfn-hup.conf
                  - /etc/cfn/hooks.d/cfn-auto-reloader.conf
        prowler-prereqs:
          files:
            /home/ec2-user/.awsvariables:
              content: !Sub |
                export S3=s3://${ProwlerS3}
                export S3ACCOUNT=${ProwlerS3Account}
                export ROLE=${CrossAccountRole}
              mode: "000600"
              owner: ec2-user
              group: ec2-user
          commands:
            01-install-prowler-prereqs-yum:
              command: |
                sudo yum -y install openssl-devel bzip2-devel libffi-devel gcc
            02-upgrade-python3.9:
              command: |
                cd /tmp && wget https://www.python.org/ftp/python/3.9.13/Python-3.9.13.tgz
                tar zxf Python-3.9.13.tgz
                cd Python-3.9.13/
                ./configure --enable-optimizations
                sudo make altinstall
            03-install-prowler:
              command: |
                cd ~
                python3.9 -m pip install prowler-cloud
        prowler-reports:
          files:
            /home/ec2-user/run-prowler-reports.sh:
              source: !Sub https://${ProwlerS3}.s3.${AWS::Region}.amazonaws.com/run-prowler-reports.sh
              mode: "000700"
              owner: ec2-user
              group: ec2-user
        prowler-schedule:
          files:
            /home/ec2-user/mycron-prowler:
              content: !Sub |
                ${ProwlerCron} bash -lc ./run-prowler-reports.sh > mycron-prowler.log
              mode: "000600"
              owner: ec2-user
              group: ec2-user
          commands:
            01-create-prowler-cron-job:
              command: |
                sudo -u ec2-user crontab /home/ec2-user/mycron-prowler

  ProwlerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: Prowler-EC2-RemoteAdministration
      GroupDescription: Allow Remote Administration
      Tags:
        - Key: App
          Value: Prowler
      VpcId: !Ref VpcId
      SecurityGroupEgress:
        - Description: Allow HTTP Outbound
          IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - Description: Allow HTTPS Outbound
          IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W5
            reason: "Using http/https to Internet for updates."
          - id: W28
            reason: "Using a defined Security Group Name."

  ProwlerInstanceProfile:
    Type: AWS::IAM::InstanceProfile
    Properties:
      Roles:
        - !Ref ProwlerEc2Role

  ProwlerEc2Role:
    Type: AWS::IAM::Role
    Properties:
      Description: Prowler EC2 Instance Role
      RoleName: !Ref Ec2Role
      Tags:
        - Key: App
          Value: Prowler
      AssumeRolePolicyDocument:
        Version: 2012-10-17
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - ec2.amazonaws.com
            Action:
              - sts:AssumeRole
      Policies:
        - PolicyName: SSM-Agent
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Sid: AllowSsmAgent
                Effect: Allow
                Resource: "*"
                Action:
                  - ssm:UpdateInstanceInformation
                  - ssm:ListInstanceAssociations
                  - ssm:UpdateInstanceAssociationStatus
                  - ssm:PutConfigurePackageResult
                  - ssm:GetManifest
                  - ssm:PutComplianceItems
                  - ec2messages:AcknowledgeMessage
                  - ec2messages:DeleteMessage
                  - ec2messages:FailMessage
                  - ec2messages:GetEndpoint
                  - ec2messages:GetMessages
                  - ec2messages:SendReply
        - PolicyName: SSM-Inventory
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Sid: AllowPutInventory
                Effect: Allow
                Resource: "*"
                Action:
                  - ssm:PutInventory
              - Sid: AllowGatherInventory
                Effect: Allow
                Resource: !Sub arn:${AWS::Partition}:ssm:${AWS::Region}::document/AWS-GatherSoftwareInventory
                Action:
                  - ssm:GetDocument
                  - ssm:DescribeDocument
        - PolicyName: SSM-SessionManager
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Sid: AllowSessionManager
                Effect: Allow
                Resource: "*"
                Action:
                  - ssmmessages:CreateControlChannel
                  - ssmmessages:CreateDataChannel
                  - ssmmessages:OpenControlChannel
                  - ssmmessages:OpenDataChannel
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
                  - s3:PutObjectAcl
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
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W28
            reason: "Using a defined Role Name."
          - id: W11
            reason: "Needed for SSM features."

Outputs:
  ProwlerEc2Account:
    Description: AWS Account Number where Prowler EC2 Instance resides.
    Value: !Ref AWS::AccountId
  ProwlerEc2Role:
    Description: Instance Role given to the Prowler EC2 Instance (needed to grant sts:AssumeRole rights).
    Value: !Ref ProwlerEc2Role
  ProwlerS3:
    Description: S3 Bucket for Prowler Reports
    Value: !Ref ProwlerS3
```

--------------------------------------------------------------------------------

---[FILE: ProwlerRole.yaml]---
Location: prowler-master/contrib/aws/org-multi-account/ProwlerRole.yaml

```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: Create the Cross-Account IAM Prowler Role

Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      - Label:
          default: EC2 Settings
        Parameters:
          - ProwlerEc2Account
          - ProwlerEc2Role
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
    Default: prowler-123456789012-us-east-1
  ProwlerEc2Account:
    Type: String
    Description: Enter AWS Account Number where Prowler EC2 Instance will reside.
    AllowedPattern: ^\d{12}$
    ConstraintDescription: An AWS Account Number must be a 12 digit numeric string.
  ProwlerEc2Role:
    Type: String
    Description: Enter Instance Role that will be given to the Prowler EC2 Instance (needed to grant sts:AssumeRole rights).
    AllowedPattern: ^[\w+=,.@-]{1,64}$
    ConstraintDescription: Max 64 alphanumeric characters. Also special characters supported [+, =, ., @, -]
    Default: ProwlerEC2-Role
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
      Description: Provides Prowler EC2 instance permissions to assess security of Accounts in AWS Organization
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
                - !Sub arn:${AWS::Partition}:iam::${ProwlerEc2Account}:root
            Action:
              - sts:AssumeRole
            Condition:
              StringLike:
                aws:PrincipalArn: !Sub arn:${AWS::Partition}:iam::${ProwlerEc2Account}:role/${ProwlerEc2Role}
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
Location: prowler-master/contrib/aws/org-multi-account/ProwlerS3.yaml

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

---[FILE: README.md]---
Location: prowler-master/contrib/aws/org-multi-account/README.md

```text
# Example Solution:  Organizational Prowler Deployment

Deploys [Prowler](https://github.com/prowler-cloud/prowler) to assess all Accounts in an AWS Organization on a schedule, creates assessment reports in HTML, and stores them in an S3 bucket.

---

## Example Solution Goals

- Using minimal technologies, so solution can be more easily adopted, and further enhanced as needed.
  - [Amazon EC2](https://aws.amazon.com/ec2/), to run Prowler
  - [Amazon S3](https://aws.amazon.com/s3/), to store Prowler script & reports.
  - [AWS CloudFormation](https://aws.amazon.com/cloudformation/), to provision the AWS resources.
  - [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html), Optional, but recommended, to manage the Prowler EC2 instance, without having to allow inbound ssh.
- Staying cohesive with Prowler, for scripting, only leveraging:
  - Bash Shell
  - AWS CLI
- Adhering to the principle of least privilege.
- Supporting an AWS Multi-Account approach
  - Runs Prowler against All accounts in the AWS Organization
- ***NOTE: If using this solution, you are responsible for making your own independent assessment of the solution and ensuring it complies with your company security and operational standards.***

---

## Components

1. [ProwlerS3.yaml](ProwlerS3.yaml)
    - Creates Private S3 Bucket for Prowler script and reports.
    - Enables [Amazon S3 Block Public Access](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html)
    - Enables SSE-S3 with [Amazon S3 Default Encryption](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html)
    - Versioning Enabled
    - Bucket Policy limits API actions to Principals from the same AWS Organization.
1. [ProwlerRole.yaml](ProwlerRole.yaml)
    - Creates Cross-Account Role for Prowler to assess accounts in AWS Organization
    - Allows Role to be assumed by the Prowler EC2 instance role in the AWS account where Prowler EC2 resides (preferably the Audit/Security account).
    - Role has [permissions](https://github.com/prowler-cloud/prowler#custom-iam-policy) needed for Prowler to assess accounts.
    - Role has rights to Prowler S3 from Component #1.
1. [ProwlerEC2.yaml](ProwlerEC2.yaml)
    - Creates Prowler EC2 instance
      - Uses the Latest Amazon Linux 2 AMI
      - Uses ```t2.micro``` Instance Type
      - Encrypts Root Volume with AWS Managed Key "aws/ebs"
    - Uses [cfn-init](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-init.html) for prepping the Prowler EC2
      - Installs necessary [packages](https://github.com/prowler-cloud/prowler#requirements-and-installation) for Prowler
      - Downloads [run-prowler-reports.sh](src/run-prowler-reports.sh) script from Prowler S3 from Component #1.
      - Creates ```/home/ec2-user/.awsvariables```, to store CloudFormation data as variables to be used in script.
      - Creates cron job for Prowler to run on a schedule.
    - Creates Prowler Security Group
      - Denies inbound access.  If using ssh to manage Prowler, then update Security Group with pertinent rule.
      - Allows outbound 80/443 for updates, and Amazon S3 communications      -
    - Creates Instance Role that is used for Prowler EC2
      - Role has permissions for [Systems Manager Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) communications, and [Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)
      - Role has rights to Prowler S3 from Component #1.
      - Role has rights to Assume Cross-Account Role from Component #2.
1. [run-prowler-reports.sh](src/run-prowler-reports.sh)
    - Script is documented accordingly.
    - Script loops through all AWS Accounts in AWS Organization, and by default, Runs Prowler as follows:
      - -R: used to specify Cross-Account role for Prowler to assume to run its assessment.
      - -A: used to specify AWS Account number for Prowler to run assessment against.
      - -g cislevel1: used to specify cislevel1 checks for Prowler to assess

        ```bash
        ./prowler/prowler -R "$ROLE" -A "$accountId" -g cislevel1 -M html
        ```

      - NOTE: Script can be modified to run Prowler as desired.
    - Script runs Prowler against 1 AWS Account at a time.
      - Update PARALLEL_ACCOUNTS variable in script, to specify how many Accounts to assess with Prowler in parallel.
      - If running against multiple AWS Accounts in parallel, monitor performance, and upgrade Instance Type as necessary.

        ```bash
        PARALLEL_ACCOUNTS="1"
        ```

    - In summary:
      - Download latest version of [Prowler](https://github.com/prowler-cloud/prowler)
      - Find AWS Master Account
      - Lookup All Accounts in AWS Organization
      - Run Prowler against All Accounts in AWS Organization
      - Save Reports to reports prefix in S3 from Component #1
      - Report Names: date+time-accountid-report.html

---

## Instructions

1. Deploy [ProwlerS3.yaml](ProwlerS3.yaml) in the Logging Account.
    - Could be deployed to any account in the AWS Organizations, if desired.
    - See [How to get AWS Organization ID](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_org_details.html#orgs_view_org)
    - Take Note of CloudFormation Outputs, that will be needed in deploying the below CloudFormation templates.
1. Upload [run-prowler-reports.sh](src/run-prowler-reports.sh) to the root of the S3 Bucket created in Step #1.
1. Deploy [ProwlerRole.yaml](ProwlerRole.yaml) in the Master Account
    - Use CloudFormation Stacks, to deploy to Master Account, as organizational StackSets don't apply to the Master Account.
    - Use CloudFormation StackSet, to deploy to all Member Accounts. See [Create Stack Set with Service-Managed Permissions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-getting-started-create.html#stacksets-orgs-associate-stackset-with-org)
    - Take Note of CloudFormation Outputs, that will be needed in deploying the below CloudFormation templates.
1. Deploy [ProwlerEC2.yaml](ProwlerEC2.yaml) in the Audit/Security Account
    - Could be deployed to any account in the AWS Organizations, if desired.
1. Prowler will run against all Accounts in AWS Organization, per the schedule you provided, and set in a cron job for ```ec2-user```

---

## Post-Setup

### Run Prowler on a Schedule against all Accounts in AWS Organization

1. Prowler will run on the Schedule you provided.
1. Cron job for ```ec2-user``` is managing the schedule.
1. This solution implemented this automatically. Nothing for you to do.

### Ad hoc Run Prowler against all Accounts in AWS Organization

1. Connect to Prowler EC2 Instance
    - If using Session Manager, then after login, switch to ```ec2-user```, via: ```sudo bash``` and ```su - ec2-user```
    - If using SSH, then login as ```ec2-user```
1. Run Prowler Script

    ```bash
    cd /home/ec2-user
    ./run-prowler-reports.sh
    ```

### Ad hoc Run Prowler Interactively

1. Connect to Prowler EC2 Instance
    - If using Session Manager, then after login, switch to ```ec2-user```, via: ```sudo bash``` and ```su - ec2-user```
    - If using SSH, then login as ```ec2-user```
1. See Cross-Account Role and S3 Bucket being used for Prowler

      ```bash
      cd /home/ec2-user
      cat .awsvariables
      ```

1. Run Prowler interactively. See [Usage Examples](https://github.com/prowler-cloud/prowler#usage)

      ```bash
      cd /home/ec2-user
      ./prowler/prowler
      ```

### Upgrading Prowler to Latest Version

1. Connect to Prowler EC2 Instance
    - If using Session Manager, then after login, switch to ```ec2-user```, via: ```sudo bash``` and ```su - ec2-user```
    - If using SSH, then login as ```ec2-user```
1. Delete the existing version of Prowler, and download the latest version of Prowler

    ```bash
    cd /home/ec2-user
    rm -rf prowler
    git clone https://github.com/prowler-cloud/prowler.git
    ```
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/contrib/aws/org-multi-account/serverless_codebuild/README.md

```text
# Organizational Prowler with Serverless

Language: [Korean](README_kr.md)

This project is created to apply prowler in a multi-account environment within AWS Organizations.
CloudWatch triggers CodeBuild every fixed time.
CodeBuild executes the script which clones the latest prowler from [here](https://github.com/prowler-cloud/prowler) and performs security assessment on all the accounts in AWS Organizations. The assessment reports are sent to S3 bucket in Log Archive Account.

For more information on how to use prowler, see [here](https://github.com/prowler-cloud/prowler#usage).

![Untitled](docs/images/prowler_org_architecture.png)

1. **Log Archive Account**
   1. Deploy [ProwlerS3.yaml](templates/ProwlerS3.yaml) in CloudFormation console.
      The template creates S3 bucket for reports and bucket policy that limits API actions to principals from its AWS Organizations.
      - AwsOrgId : AWS Organizations' Organization ID
      - S3Prefix : The prefix included in the bucket name
2. **Master Account**
   1. Deploy [ProwlerRole.yaml](templates/ProwlerRole.yaml) stack to CloudFormation in a bid to create resources to master account itself.
      (The template will be also deployed for other member accounts as a StackSet)
      - ProwlerCodeBuildAccount :  Audit Account ID where CodeBuild resides. (preferably Audit/Security account)
      - ProwlerCodeBuildRole : Role name to use in CodeBuild service
      - ProwlerCrossAccountRole : Role name to assume for Cross account
      - ProwlerS3 : The S3 bucket name where reports will be put
   1. Create **StackSet** with [ProwlerRole.yaml](templates/ProwlerRole.yaml) to deploy Role into member accounts in AWS Organizations.
      - ProwlerCodeBuildAccount :  Audit Account ID where CodeBuild resides. (preferably Audit/Security account)
      - ProwlerCodeBuildRole : Role name to use in CodeBuild service
      - ProwlerCrossAccountRole : Role name to assume for Cross account
      - ProwlerS3 : The S3 bucket name where reports will be put
      - Permission : Service-managed permissions
      - Deploy target : Deploy to organization 선택, Enable, Delete stacks 선택
      - Specify regions : Region to deploy
3. **Audit Account**
   1. Go to S3 console, create a bucket, upload [run-prowler-reports.sh.zip](src/run-prowler-reports.sh.zip)
      - bucket name : prowler-util-*[Account ID]*-*[region]*
     ![Untitled](docs/images/s3_screenshot.png)

   1. Deploy  [ProwlerCodeBuildStack.yaml](templates/ProwlerCodeBuildStack.yaml) which creates CloudWatch Rule to trigger CodeBuild every fixed time, allowing prowler to audit multi-accounts.
      - AwsOrgId : AWS Organizations' Organization ID
      - CodeBuildRole : Role name to use in CodeBuild service
      - CodeBuildSourceS3 : Object location uploaded from i
         - prowler-util-*[Account ID]*-*[region]/**run-prowler-reports.sh.zip**
      - CrossAccountRole : Role name for cross account created in the process **2** above.
      - ProwlerReportS3 : The S3 bucket name where reports will be put
      - ProwlerReportS3Account : The account where the report S3 bucket resides.
   1. If you'd like to change the scheduled time,
      1. You can change the cron expression of ScheduleExpression within [ProwlerCodeBuildStack.yaml](templates/ProwlerCodeBuildStack.yaml).
      2. Alternatively, you can make changes directly from Events > Rules > ProwlerExecuteRule > Actions > Edit in CloudWatch console.
```

--------------------------------------------------------------------------------

---[FILE: README_kr.md]---
Location: prowler-master/contrib/aws/org-multi-account/serverless_codebuild/README_kr.md

```text
# Organizational Prowler with Serverless

Language: [English](README.md)

이 문서는 AWS Organization 내의 multi account 환경에서 prowler 를 적용하기 위해 작성된 문서입니다.
일정 시간마다 CloudWatch는 CodeBuild 를 트리거합니다.
CodeBuild 는 최신의 [prowler](https://github.com/prowler-cloud/prowler) 소스를 클론받고,
Organization 내의 모든 Account 에 대해 security assessment 를 수행합니다.
prowler 의 자세한 사용방법은 [이 곳](https://github.com/prowler-cloud/prowler#usagee) 을 참고합니다.

![Untitled](docs/images/prowler_org_architecture.png)

1. **Log Archive Account**에 접속합니다.
   1. 아래 템플릿을 CloudFormation console 에서 배포합니다. 이를 통해 prowler 의 security assessment report 가 저장되는 bucket 과 bucket policy 를 생성합니다.

      [ProwlerS3.yaml](templates/ProwlerS3.yaml)

      - AwsOrgId : AWS Organizations의 Organization ID
      - S3Prefix : 생성될 버킷의 이름에 포함되는 prefix
2. **Master Account** 에 접속합니다.
   1. 아래 템플릿을 이용하여 CloudFormation **Stack**을 생성합니다. StackSet은 Master account 에 적용되지 않으므로 Stack 으로도 배포가 필요합니다.

      [ProwlerRole.yaml](templates/ProwlerRole.yaml)

      - ProwlerCodeBuildAccount : CodeBuild 가 있는 Audit Account ID
      - ProwlerCodeBuildRole : CodeBuild의 생성될 Role 이름
      - ProwlerCrossAccountRole : Cross account 용 Assume할 Role 이름
      - ProwlerS3 : report 가 저장될 S3 bucket 명
   2. 아래 템플릿을 이용하여 CloudFormation **StackSet**을 생성하여, Organazation에 포함된 account 대상으로도 아래 템플릿을 배포합니다.

      [ProwlerRole.yaml](templates/ProwlerRole.yaml)

      - ProwlerCodeBuildAccount : CodeBuild 가 있는 Audit Account
      - ProwlerCodeBuildRole : CodeBuild에서 사용할 Role 이름
      - ProwlerCrossAccountRole : Cross account 용 Assume할 Role 이름
      - ProwlerS3 : report 가 저장될 S3 bucket 명
      - Permission : Service-managed permissions
      - Deploy target : Deploy to organization 선택, Enable, Delete stacks 선택
      - Specify regions : 배포할 대상 리전을 선택
3. **Audit Account**에 접속합니다.
   1. **S3 console** 로 이동하여 버킷을 생성하고 아래 항목을 **업로드**한 후, 버킷명을 복사해둡니다.

      [run-prowler-reports.sh.zip](src/run-prowler-reports.sh.zip)

      - bucket name : prowler-util-*<Account ID>*-*<region>*

        ![Untitled](docs/images/s3_screenshot.png)

   2. 아래 템플릿으로 **CloudFormation stack** 을 생성합니다. 이 템플릿은 CloudWatch Rule 을 생성하여 일정 시간마다 CodeBuild 를 실행하여 prowler 가 multi accounts 를 audit 할 수 있도록 합니다.

      [ProwlerCodeBuildStack.yaml](templates/ProwlerCodeBuildStack.yaml)

      - AwsOrgId : AWS Organizations의 Organization ID
      - CodeBuildRole : CodeBuild의 서비스 Role 이름
      - CodeBuildSourceS3 : a 에서 업로드한 object 위치
         - prowler-util-*<Account ID>*-*<region>/***run-prowler-reports.sh.zip**
      - CrossAccountRole : 2번에서 생성한 Cross Account 용 Role 이름
      - ProwlerReportS3 : report 가 저장될 S3 bucket 명
      - ProwlerReportS3Account : report 가 저장될 S3 bucket이 위치한 Account
   3. 스케줄 된 시간을 변경하고 싶은 경우
      1. [ProwlerCodeBuildStack.yaml](templates/ProwlerCodeBuildStack.yaml) 내에서 ScheduleExpression의 크론 표현식을 변경할 수 있습니다.
      2. 또는 CloudWatch console 에서 Events > Rules > ProwlerExecuteRule > Actions > Edit 에서 직접 변경할 수 있습니다.
```

--------------------------------------------------------------------------------

````
