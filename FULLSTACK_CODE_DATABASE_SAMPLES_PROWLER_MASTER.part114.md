---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 114
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 114 of 867)

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

---[FILE: prowler-additions-policy.json]---
Location: prowler-master/permissions/prowler-additions-policy.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "account:Get*",
        "appstream:Describe*",
        "appstream:List*",
        "backup:List*",
        "backup:Get*",
        "bedrock:List*",
        "bedrock:Get*",
        "cloudtrail:GetInsightSelectors",
        "codeartifact:List*",
        "codebuild:BatchGet*",
        "codebuild:ListReportGroups",
        "cognito-idp:GetUserPoolMfaConfig",
        "dlm:Get*",
        "drs:Describe*",
        "ds:Get*",
        "ds:Describe*",
        "ds:List*",
        "dynamodb:GetResourcePolicy",
        "ec2:GetEbsEncryptionByDefault",
        "ec2:GetSnapshotBlockPublicAccessState",
        "ec2:GetInstanceMetadataDefaults",
        "ecr:Describe*",
        "ecr:GetRegistryScanningConfiguration",
        "elasticfilesystem:DescribeBackupPolicy",
        "glue:GetConnections",
        "glue:GetSecurityConfiguration*",
        "glue:SearchTables",
        "glue:GetMLTransforms",
        "lambda:GetFunction*",
        "logs:FilterLogEvents",
        "lightsail:GetRelationalDatabases",
        "macie2:GetMacieSession",
        "macie2:GetAutomatedDiscoveryConfiguration",
        "s3:GetAccountPublicAccessBlock",
        "shield:DescribeProtection",
        "shield:GetSubscriptionState",
        "securityhub:BatchImportFindings",
        "securityhub:GetFindings",
        "servicecatalog:Describe*",
        "servicecatalog:List*",
        "ssm:GetDocument",
        "ssm-incidents:List*",
        "states:ListTagsForResource",
        "support:Describe*",
        "tag:GetTagKeys",
        "wellarchitected:List*"
      ],
      "Resource": "*",
      "Effect": "Allow",
      "Sid": "AllowMoreReadOnly"
    },
    {
      "Effect": "Allow",
      "Action": [
        "apigateway:GET"
      ],
      "Resource": [
        "arn:*:apigateway:*::/restapis/*",
        "arn:*:apigateway:*::/apis/*"
      ],
      "Sid": "AllowAPIGatewayReadOnly"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: prowler-azure-custom-role.json]---
Location: prowler-master/permissions/prowler-azure-custom-role.json

```json
{
  "properties": {
    "roleName": "ProwlerRole",
    "description": "Role used for checks that require read-only access to Azure resources and are not covered by the Reader role.",
    "assignableScopes": [
      "/{'subscriptions', 'providers/Microsoft.Management/managementGroups'}/{Your Subscription or Management Group ID}"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.Web/sites/host/listkeys/action",
          "Microsoft.Web/sites/config/list/Action"
        ],
        "notActions": [],
        "dataActions": [],
        "notDataActions": []
      }
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: prowler-scan-role.yml]---
Location: prowler-master/permissions/templates/cloudformation/prowler-scan-role.yml

```yaml
AWSTemplateFormatVersion: "2010-09-09"

# You can invoke CloudFormation and pass the principal ARN from a command line like this:
# aws cloudformation create-stack \
#  --capabilities CAPABILITY_IAM --capabilities CAPABILITY_NAMED_IAM \
#  --template-body "file://prowler-scan-role.yaml" \
#  --stack-name "ProwlerScanRole" \
#  --parameters "ParameterKey=ExternalId,ParameterValue=ProvidedExternalID"

Description: |
  This template creates the ProwlerScan IAM Role in this account with
  all read-only permissions to scan your account for security issues.
  Contains two AWS managed policies (SecurityAudit and ViewOnlyAccess) and an inline policy.
  It sets the trust policy on that IAM Role to permit Prowler to assume that role.
  This template is designed to be used in Prowler Cloud, but can also be used in other Prowler deployments.
  If you are deploying this template to be used in Prowler Cloud please do not edit the AccountId, IAMPrincipal and ExternalId parameters.
Parameters:
  ExternalId:
    Description: |
      This is the External ID that Prowler will use to assume the role ProwlerScan IAM Role.
    Type: String
    MinLength: 1
    AllowedPattern: ".+"
    ConstraintDescription: "ExternalId must not be empty."
  AccountId:
    Description: |
      AWS Account ID that will assume the role created, if you are deploying this template to be used in Prowler Cloud please do not edit this.
    Type: String
    Default: "232136659152"
    MinLength: 12
    MaxLength: 12
    AllowedPattern: "[0-9]{12}"
    ConstraintDescription: "AccountId must be a valid AWS Account ID."
  IAMPrincipal:
    Description: |
      The IAM principal type and name that will be allowed to assume the role created, leave an * for all the IAM principals in your AWS account. If you are deploying this template to be used in Prowler Cloud please do not edit this.
    Type: String
    Default: role/prowler*
  EnableS3Integration:
    Description: |
      Enable S3 integration for storing Prowler scan reports.
    Type: String
    Default: false
    AllowedValues:
      - true
      - false
  S3IntegrationBucketName:
    Description: |
      The S3 bucket name where Prowler will store scan reports for your cloud providers.
    Type: String
    Default: ""
  S3IntegrationBucketAccountId:
    Description: |
      The AWS Account ID owner of the S3 Bucket.
    Type: String
    Default: ""

Conditions:
  S3IntegrationEnabled: !Equals [!Ref EnableS3Integration, true]


Resources:
  ProwlerScan:
    Type: AWS::IAM::Role
    Properties:
      RoleName: ProwlerScan
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal:
              AWS: !Sub "arn:${AWS::Partition}:iam::${AccountId}:root"
            Action: "sts:AssumeRole"
            Condition:
              StringEquals:
                "sts:ExternalId": !Sub ${ExternalId}
              StringLike:
                "aws:PrincipalArn": !Sub "arn:${AWS::Partition}:iam::${AccountId}:${IAMPrincipal}"
      MaxSessionDuration: 3600
      ManagedPolicyArns:
        - "arn:aws:iam::aws:policy/SecurityAudit"
        - "arn:aws:iam::aws:policy/job-function/ViewOnlyAccess"
      Policies:
        - PolicyName: ProwlerScan
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Sid: AllowMoreReadOnly
                Effect: Allow
                Action:
                  - "account:Get*"
                  - "appstream:Describe*"
                  - "appstream:List*"
                  - "backup:List*"
                  - "bedrock:List*"
                  - "bedrock:Get*"
                  - "cloudtrail:GetInsightSelectors"
                  - "codeartifact:List*"
                  - "codebuild:BatchGet*"
                  - "codebuild:ListReportGroups"
                  - "cognito-idp:GetUserPoolMfaConfig"
                  - "dlm:Get*"
                  - "drs:Describe*"
                  - "ds:Get*"
                  - "ds:Describe*"
                  - "ds:List*"
                  - "dynamodb:GetResourcePolicy"
                  - "ec2:GetEbsEncryptionByDefault"
                  - "ec2:GetSnapshotBlockPublicAccessState"
                  - "ec2:GetInstanceMetadataDefaults"
                  - "ecr:Describe*"
                  - "ecr:GetRegistryScanningConfiguration"
                  - "elasticfilesystem:DescribeBackupPolicy"
                  - "glue:GetConnections"
                  - "glue:GetSecurityConfiguration*"
                  - "glue:SearchTables"
                  - "lambda:GetFunction*"
                  - "logs:FilterLogEvents"
                  - "lightsail:GetRelationalDatabases"
                  - "macie2:GetMacieSession"
                  - "macie2:GetAutomatedDiscoveryConfiguration"
                  - "s3:GetAccountPublicAccessBlock"
                  - "shield:DescribeProtection"
                  - "shield:GetSubscriptionState"
                  - "securityhub:BatchImportFindings"
                  - "securityhub:GetFindings"
                  - "servicecatalog:Describe*"
                  - "servicecatalog:List*"
                  - "ssm:GetDocument"
                  - "ssm-incidents:List*"
                  - "states:ListTagsForResource"
                  - "support:Describe*"
                  - "tag:GetTagKeys"
                  - "wellarchitected:List*"
                Resource: "*"
              - Sid: AllowAPIGatewayReadOnly
                Effect: Allow
                Action:
                  - "apigateway:GET"
                Resource:
                  - "arn:*:apigateway:*::/restapis/*"
                  - "arn:*:apigateway:*::/apis/*"
        - !If
          - S3IntegrationEnabled
          - PolicyName: S3Integration
            PolicyDocument:
              Version: "2012-10-17"
              Statement:
                - Effect: Allow
                  Action:
                    - "s3:PutObject"
                  Resource:
                    - !Sub "arn:${AWS::Partition}:s3:::${S3IntegrationBucketName}/*"
                  Condition:
                    StringEquals:
                      "s3:ResourceAccount": !Sub ${S3IntegrationBucketAccountId}
                - Effect: Allow
                  Action:
                    - "s3:ListBucket"
                  Resource:
                    - !Sub "arn:${AWS::Partition}:s3:::${S3IntegrationBucketName}"
                  Condition:
                    StringEquals:
                      "s3:ResourceAccount": !Sub ${S3IntegrationBucketAccountId}
                - Effect: Allow
                  Action:
                    - "s3:DeleteObject"
                  Resource:
                    - !Sub "arn:${AWS::Partition}:s3:::${S3IntegrationBucketName}/*test-prowler-connection.txt"
                  Condition:
                    StringEquals:
                      "s3:ResourceAccount": !Sub ${S3IntegrationBucketAccountId}
          - !Ref AWS::NoValue
      Tags:
        - Key: "Service"
          Value: "https://prowler.com"
        - Key: "Support"
          Value: "support@prowler.com"
        - Key: "CloudFormation"
          Value: "true"
        - Key: "Name"
          Value: "ProwlerScan"

Metadata:
  AWS::CloudFormation::StackName: "Prowler"
  AWS::CloudFormation::Interface:
    ParameterGroups:
      - Label:
          default: Required
        Parameters:
          - ExternalId
          - AccountId
          - IAMPrincipal
          - EnableS3Integration
      - Label:
          default: Optional
        Parameters:
          - S3IntegrationBucketName
          - S3IntegrationBucketAccountId

Outputs:
  ProwlerScanRoleArn:
    Description: "ARN of the ProwlerScan IAM Role"
    Value: !GetAtt ProwlerScan.Arn
    Export:
      Name: !Sub "${AWS::StackName}-ProwlerScanRoleArn"
```

--------------------------------------------------------------------------------

---[FILE: data.tf]---
Location: prowler-master/permissions/templates/terraform/data.tf

```text
# Data Sources
###################################
data "aws_partition" "current" {}
data "aws_caller_identity" "current" {}
```

--------------------------------------------------------------------------------

---[FILE: main.tf]---
Location: prowler-master/permissions/templates/terraform/main.tf

```text
# Local validation for conditional requirements
###################################
locals {
  s3_integration_validation = (
    !var.enable_s3_integration ||
    (var.enable_s3_integration && var.s3_integration_bucket_name != "" && var.s3_integration_bucket_account_id != "")
  )
}

# Validation check using check block (Terraform 1.5+)
check "s3_integration_requirements" {
  assert {
    condition     = !var.enable_s3_integration || (var.s3_integration_bucket_name != "" && var.s3_integration_bucket_account_id != "")
    error_message = "When enable_s3_integration is true, both s3_integration_bucket_name and s3_integration_bucket_account_id must be provided and non-empty."
  }
}

# IAM Role
###################################
data "aws_iam_policy_document" "prowler_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "AWS"
      identifiers = ["arn:${data.aws_partition.current.partition}:iam::${var.account_id}:root"]
    }
    condition {
      test     = "StringEquals"
      variable = "sts:ExternalId"
      values = [
        var.external_id,
      ]
    }
    condition {
      test     = "StringLike"
      variable = "aws:PrincipalArn"
      values = [
        "arn:${data.aws_partition.current.partition}:iam::${var.account_id}:${var.iam_principal}",
      ]
    }
  }
}

resource "aws_iam_role" "prowler_scan" {
  name               = "ProwlerScan"
  assume_role_policy = data.aws_iam_policy_document.prowler_assume_role_policy.json
}

resource "aws_iam_policy" "prowler_scan_policy" {
  name        = "ProwlerScan"
  description = "Prowler Scan Policy"
  policy      = file("../../prowler-additions-policy.json")
}

resource "aws_iam_role_policy_attachment" "prowler_scan_policy_attachment" {
  role       = aws_iam_role.prowler_scan.name
  policy_arn = aws_iam_policy.prowler_scan_policy.arn
}

resource "aws_iam_role_policy_attachment" "prowler_scan_securityaudit_policy_attachment" {
  role       = aws_iam_role.prowler_scan.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/SecurityAudit"
}

resource "aws_iam_role_policy_attachment" "prowler_scan_viewonly_policy_attachment" {
  role       = aws_iam_role.prowler_scan.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/job-function/ViewOnlyAccess"
}

# S3 Integration Module
###################################
module "s3_integration" {
  count = var.enable_s3_integration ? 1 : 0

  source = "./s3-integration"

  s3_integration_bucket_name    = var.s3_integration_bucket_name
  s3_integration_bucket_account_id = var.s3_integration_bucket_account_id

  prowler_role_name = aws_iam_role.prowler_scan.name
}
```

--------------------------------------------------------------------------------

---[FILE: outputs.tf]---
Location: prowler-master/permissions/templates/terraform/outputs.tf

```text
# Outputs
###################################
output "prowler_role_arn" {
  description = "ARN of the Prowler scan role"
  value       = aws_iam_role.prowler_scan.arn
}

output "prowler_role_name" {
  description = "Name of the Prowler scan role"
  value       = aws_iam_role.prowler_scan.name
}

output "external_id" {
  description = "External ID used for role assumption"
  value       = var.external_id
  sensitive   = true
}

output "s3_integration_enabled" {
  description = "Whether S3 integration is enabled"
  value       = var.enable_s3_integration
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/permissions/templates/terraform/README.md

```text
## Deployment using Terraform

This Terraform configuration creates the necessary IAM role and policies to allow Prowler to scan your AWS account, with optional S3 integration for storing scan reports.

### Quick Start

1. **Configure variables:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

2. **Deploy:**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

### Variables

- `external_id` (required): External ID for role assumption security
- `account_id` (optional): AWS Account ID that will assume the role (defaults to Prowler Cloud: "232136659152")
- `iam_principal` (optional): IAM principal pattern allowed to assume the role (defaults to Prowler Cloud: "role/prowler*")
- `enable_s3_integration` (optional): Enable S3 integration for storing scan reports (default: false)
- `s3_integration_bucket_name` (conditional): S3 bucket name for reports (required if `enable_s3_integration` is true)
- `s3_integration_bucket_account_id` (conditional): S3 bucket owner account ID (required if `enable_s3_integration` is true)

### Usage Examples

#### Basic deployment (without S3 integration):
```bash
terraform apply -var="external_id=your-external-id-here"
```

#### With S3 integration enabled:
```bash
terraform apply \
  -var="external_id=your-external-id-here" \
  -var="enable_s3_integration=true" \
  -var="s3_integration_bucket_name=your-s3-bucket-name" \
  -var="s3_integration_bucket_account_id=123456789012"
```

#### Using terraform.tfvars file (Recommended):
```bash
cp terraform.tfvars.example terraform.tfvars
# Edit the file with your values
terraform apply
```

#### Command line variables (Alternative):
```bash
terraform apply -var="external_id=your-external-id-here"
```

### Outputs

After successful deployment, you'll get:
- `prowler_role_arn`: The ARN of the created IAM role (use this in Prowler App)
- `prowler_role_name`: The name of the IAM role
- `s3_integration_enabled`: Whether S3 integration is enabled

> **Note:** Terraform will use the AWS credentials of your default profile or AWS_PROFILE environment variable.
```

--------------------------------------------------------------------------------

---[FILE: terraform.tfvars]---
Location: prowler-master/permissions/templates/terraform/terraform.tfvars

```text
# =============================================================================
# Prowler Terraform Configuration
# =============================================================================

# REQUIRED: External ID from your Prowler App
external_id = "your-unique-external-id-here"

# =============================================================================
# Optional Variables (uncomment and modify as needed)
# =============================================================================

# Prowler Cloud Service Account (leave default unless using self-hosted)
# account_id = "232136659152"

# IAM Principal Pattern (leave default unless using self-hosted)
# iam_principal = "role/prowler*"

# =============================================================================
# S3 Integration Configuration
# =============================================================================
# Uncomment the following lines to enable S3 integration for storing scan reports

# Enable S3 integration
# enable_s3_integration = true

# S3 bucket name where reports will be stored
# s3_integration_bucket_name = "my-prowler-reports-bucket"

# AWS Account ID that owns the S3 bucket (usually your account)
# s3_integration_bucket_account_id = "123456789012"
```

--------------------------------------------------------------------------------

---[FILE: terraform.tfvars.example]---
Location: prowler-master/permissions/templates/terraform/terraform.tfvars.example

```text
# =============================================================================
# Prowler Terraform Configuration
# =============================================================================

# REQUIRED: External ID from your Prowler App setup
# This must match exactly what you configured in Prowler App
external_id = "your-unique-external-id-here"

# =============================================================================
# Optional Variables (uncomment and modify as needed)
# =============================================================================

# Prowler Cloud Service Account (leave default unless using self-hosted)
# account_id = "232136659152"

# IAM Principal Pattern (leave default unless using self-hosted)
# iam_principal = "role/prowler*"

# =============================================================================
# S3 Integration Configuration
# =============================================================================
# Uncomment the following lines to enable S3 integration for storing scan reports

# Enable S3 integration
# enable_s3_integration = true

# S3 bucket name where reports will be stored
# s3_integration_bucket_name = "my-prowler-reports-bucket"

# AWS Account ID that owns the S3 bucket (usually your account)
# s3_integration_bucket_account_id = "123456789012"
```

--------------------------------------------------------------------------------

---[FILE: variables.tf]---
Location: prowler-master/permissions/templates/terraform/variables.tf

```text
# Variables
###################################
variable "external_id" {
  type        = string
  description = "This is the External ID that Prowler will use to assume the role ProwlerScan IAM Role."

  validation {
    condition     = length(var.external_id) > 0
    error_message = "ExternalId must not be empty."
  }
}

variable "account_id" {
  type        = string
  description = "AWS Account ID that will assume the role created, if you are deploying this template to be used in Prowler Cloud please do not edit this."
  default     = "232136659152"

  validation {
    condition     = length(var.account_id) == 12
    error_message = "AccountId must be a valid AWS Account ID."
  }
}

variable "iam_principal" {
  type        = string
  description = "The IAM principal type and name that will be allowed to assume the role created, leave an * for all the IAM principals in your AWS account. If you are deploying this template to be used in Prowler Cloud please do not edit this."
  default     = "role/prowler*"
}

variable "enable_s3_integration" {
  type        = bool
  description = "Enable S3 integration for storing Prowler scan reports."
  default     = false
}

variable "s3_integration_bucket_name" {
  type        = string
  description = "The S3 bucket name where Prowler will store scan reports for your cloud providers. Required if enable_s3_integration is true."
  default     = ""

  validation {
    condition     = length(var.s3_integration_bucket_name) > 0 || var.s3_integration_bucket_name == ""
    error_message = "s3_integration_bucket_name must be a valid S3 bucket name."
  }
}

variable "s3_integration_bucket_account_id" {
  type        = string
  description = "The AWS Account ID owner of the S3 Bucket. Required if enable_s3_integration is true."
  default     = ""

  validation {
    condition     = var.s3_integration_bucket_account_id == "" || (length(var.s3_integration_bucket_account_id) == 12 && can(tonumber(var.s3_integration_bucket_account_id)))
    error_message = "s3_integration_bucket_account_id must be a valid 12-digit AWS Account ID or empty."
  }
}
```

--------------------------------------------------------------------------------

---[FILE: versions.tf]---
Location: prowler-master/permissions/templates/terraform/versions.tf

```text
# Terraform Provider Configuration
###################################
terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.83"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      "Name"      = "ProwlerScan",
      "Terraform" = "true",
      "Service"   = "https://prowler.com",
      "Support"   = "support@prowler.com"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: data.tf]---
Location: prowler-master/permissions/templates/terraform/s3-integration/data.tf

```text
data "aws_partition" "current" {}
```

--------------------------------------------------------------------------------

---[FILE: main.tf]---
Location: prowler-master/permissions/templates/terraform/s3-integration/main.tf

```text
# S3 Integration Policy
###################################
resource "aws_iam_role_policy" "prowler_s3_integration" {
  name = "ProwlerS3Integration"
  role = var.prowler_role_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:DeleteObject"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:s3:::${var.s3_integration_bucket_name}/*test-prowler-connection.txt"
        ]
        Condition = {
          StringEquals = {
            "s3:ResourceAccount" = var.s3_integration_bucket_account_id
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:s3:::${var.s3_integration_bucket_name}/*"
        ]
        Condition = {
          StringEquals = {
            "s3:ResourceAccount" = var.s3_integration_bucket_account_id
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:s3:::${var.s3_integration_bucket_name}"
        ]
        Condition = {
          StringEquals = {
            "s3:ResourceAccount" = var.s3_integration_bucket_account_id
          }
        }
      }
    ]
  })
}
```

--------------------------------------------------------------------------------

---[FILE: variables.tf]---
Location: prowler-master/permissions/templates/terraform/s3-integration/variables.tf

```text
variable "s3_integration_bucket_name" {
  type        = string
  description = "The S3 bucket name where Prowler will store scan reports for your cloud providers."

  validation {
    condition     = length(var.s3_integration_bucket_name) > 0
    error_message = "s3_integration_bucket_name must not be empty."
  }
}

variable "s3_integration_bucket_account_id" {
  type        = string
  description = "The AWS Account ID owner of the S3 Bucket."

  validation {
    condition     = length(var.s3_integration_bucket_account_id) == 12 && can(tonumber(var.s3_integration_bucket_account_id))
    error_message = "s3_integration_bucket_account_id must be a valid 12-digit AWS Account ID."
  }
}

variable "prowler_role_name" {
  type        = string
  description = "Name of the Prowler scan IAM role to attach the S3 policy to."

  validation {
    condition     = length(var.prowler_role_name) > 0
    error_message = "prowler_role_name must not be empty."
  }
}
```

--------------------------------------------------------------------------------

---[FILE: versions.tf]---
Location: prowler-master/permissions/templates/terraform/s3-integration/versions.tf

```text
terraform {
  required_version = ">= 1.5"
}
```

--------------------------------------------------------------------------------

---[FILE: AGENTS.md]---
Location: prowler-master/prowler/AGENTS.md

```text
# Prowler SDK Agent Guide

**Complete guide for AI agents and developers working on the Prowler SDK - the core Python security scanning engine.**

## Project Overview

The Prowler SDK is the core Python engine that powers Prowler's cloud security assessment capabilities. It provides:

- **Multi-cloud Security Scanning**: AWS, Azure, GCP, Kubernetes, GitHub, M365, Oracle Cloud, MongoDB Atlas, and more
- **Compliance Frameworks**: 30+ frameworks including CIS, NIST, PCI-DSS, SOC2, GDPR
- **1000+ Security Checks**: Comprehensive coverage across all supported providers
- **Multiple Output Formats**: JSON, CSV, HTML, ASFF, OCSF, and compliance-specific formats

## Mission & Scope

- Maintain and enhance the core Prowler SDK functionality with security and stability as top priorities
- Follow best practices for Python patterns, code style, security, and comprehensive testing
- To get more information about development guidelines, please refer to the Prowler Developer Guide in `docs/developer-guide/`

---

## Architecture Rules

### 1. Provider Architecture Pattern

All Prowler providers MUST follow the established pattern:

```
prowler/providers/{provider}/
├── {provider}_provider.py          # Main provider class
├── models.py                       # Provider-specific models
├── config.py                       # Provider configuration
├── exceptions/                     # Provider-specific exceptions
├── lib/                           # Provider libraries (as minimun it should have implemented the next folders: service, arguments, mutelist)
│   ├── service/                   # Provider-specific service class to be inherited by all services of the provider
│   ├── arguments/                 # Provider-specific CLI arguments parser
│   └── mutelist/                  # Provider-specific mutelist functionality
└── services/                      # All provider services to be audited
    └── {service}/                 # Individual service
        ├── {service}_service.py   # Class to fetch the needed resources from the API and store them to be used by the checks
        ├── {service}_client.py    # Python instance of the service class to be used by the checks
        └── {check_name}/          # Individual check folder
            ├── {check_name}.py    # Python class to implement the check logic
            └── {check_name}.metadata.json # JSON file to store the check metadata
        └── {check_name_2}/          # Other checks can be added to the same service folder
            ├── {check_name_2}.py
            └── {check_name_2}.metadata.json
        ...
    └── {service_2}/                 # Other services can be added to the same provider folder
        ...
```

### 2. Check Implementation Standards

Every security check MUST implement:

```python
from prowler.lib.check.models import Check, CheckReport<Provider>
from prowler.providers.<provider>.services.<service>.<service>_client import <service>_client

class check_name(Check):
    """Ensure that <resource> meets <security_requirement>."""
    def execute(self) -> list[CheckReport<Provider>]:
        """Execute the check logic.

        Returns:
            A list of reports containing the result of the check.
        """
        findings = []
        # Check implementation here
        for resource in <service>_client.<resources>:
            # Security validation logic
            report = CheckReport<Provider>(metadata=self.metadata(), resource=resource)
            report.status = "PASS" | "FAIL"
            report.status_extended = "Detailed explanation"
            findings.append(report) # Add the report to the list of findings
        return findings
```

### 3. Compliance Framework Integration

All compliance frameworks must be defined in:
- `prowler/compliance/{provider}/{framework}.json`
- Follow the established Compliance model structure
- Include proper requirement mappings and metadata

---

## Tech Stack

- **Language**: Python 3.9+
- **Dependency Management**: Poetry 2+
- **CLI Framework**: Custom argument parser with provider-specific subcommands
- **Testing**: Pytest with extensive unit and integration tests
- **Code Quality**: Pre-commit hooks for Black, Flake8, Pylint, Bandit for security scanning

## Commands

### Development Environment

```bash
# Core development setup
poetry install --with dev          # Install all dependencies
poetry run pre-commit install      # Install pre-commit hooks

# Code quality
poetry run pre-commit run --all-files

# Run tests
poetry run pytest -n auto -vvv -s -x tests/
```

### Running Prowler CLI

```bash
# Run Prowler
poetry run python prowler-cli.py --help

# Run Prowler with a specific provider
poetry run python prowler-cli.py <provider>

# Run Prowler with error logging
poetry run python prowler-cli.py <provider> --log-level ERROR --verbose

# Run specific checks
poetry run python prowler-cli.py <provider> --checks <check_name_1> <check_name_2>
```

## Project Structure

```
prowler/
├── __main__.py                    # Main CLI entry point
├── config/                        # Global configuration
│   ├── config.py                  # Core configuration settings
│   └── __init__.py
├── lib/                          # Core library functions
│   ├── check/                    # Check execution engine
│   │   ├── check.py              # Check execution logic
│   │   ├── checks_loader.py      # Dynamic check loading
│   │   ├── compliance.py         # Compliance framework handling
│   │   └── models.py             # Check and report models
│   ├── cli/                      # Command-line interface
│   │   └── parser.py             # Argument parsing
│   ├── outputs/                  # Output format handlers
│   │   ├── csv/                  # CSV output
│   │   ├── html/                 # HTML reports
│   │   ├── json/                 # JSON formats
│   │   └── compliance/           # Compliance reports
│   ├── scan/                     # Scan orchestration
│   ├── utils/                    # Utility functions
│   └── mutelist/                 # Mute list functionality
├── providers/                    # Cloud provider implementations
│   ├── aws/                      # AWS provider
│   ├── azure/                    # Azure provider
│   ├── gcp/                      # Google Cloud provider
│   ├── kubernetes/               # Kubernetes provider
│   ├── github/                   # GitHub provider
│   ├── m365/                     # Microsoft 365 provider
│   ├── mongodbatlas/             # MongoDB Atlas provider
│   ├── oci/                      # Oracle Cloud provider
│   ├── ...
│   └── common/                   # Shared provider utilities
├── compliance/                   # Compliance framework definitions
│   ├── aws/                      # AWS compliance frameworks
│   ├── azure/                    # Azure compliance frameworks
│   ├── gcp/                      # GCP compliance frameworks
│   ├── ...
└── exceptions/                   # Global exception definitions
```

## Key Components

### 1. Provider System

Each cloud provider implements:

```python
class Provider:
    """Base provider class"""

    def __init__(self, arguments):
        self.session = self._setup_session(arguments)
        self.regions = self._get_regions()
        # Initialize all services

    def _setup_session(self, arguments):
        """Provider-specific authentication"""
        pass

    def _get_regions(self):
        """Get available regions for provider"""
        pass
```

### 2. Check Engine

The check execution system:

- **Dynamic Loading**: Automatically discovers and loads checks
- **Parallel Execution**: Runs checks in parallel for performance
- **Error Isolation**: Individual check failures don't affect others
- **Comprehensive Reporting**: Detailed findings with remediation guidance

### 3. Compliance Framework Engine

Compliance frameworks are defined as JSON files mapping checks to requirements:

```json
{
  "Framework": "CIS",
  "Name": "CIS Amazon Web Services Foundations Benchmark v2.0.0",
  "Version": "2.0",
  "Provider": "AWS",
  "Description": "The CIS Amazon Web Services Foundations Benchmark provides prescriptive guidance for configuring security options for a subset of Amazon Web Services with an emphasis on foundational, testable, and architecture agnostic settings.",
  "Requirements": [
    {
      "Id": "1.1",
      "Description": "Maintain current contact details",
      "Checks": ["account_contact_details_configured"]
    }
  ]
}
```

### 4. Output System

Multiple output formats supported:

- **JSON**: Machine-readable findings
- **CSV**: Spreadsheet-compatible format
- **HTML**: Interactive web reports
- **ASFF**: AWS Security Finding Format
- **OCSF**: Open Cybersecurity Schema Framework

## Development Patterns

### Adding New Cloud Providers

1. **Create Provider Structure**:
```bash
mkdir -p prowler/providers/{provider}
mkdir -p prowler/providers/{provider}/services
mkdir -p prowler/providers/{provider}/lib/{service,arguments,mutelist}
mkdir -p prowler/providers/{provider}/exceptions
```

2. **Implement Provider Class**:
```python
from prowler.providers.common.provider import Provider

class NewProvider(Provider):
    def __init__(self, arguments):
        super().__init__(arguments)
        # Provider-specific initialization
```

3. **Add Provider to CLI**:
Update `prowler/lib/cli/parser.py` to include new provider arguments.

### Adding New Security Checks

The most common high level steps to create a new check are:

1. Prerequisites:
    - Verify the check does not already exist by searching in the same service folder as `prowler/providers/<provider>/services/<service>/<check_name_want_to_implement>/`.
    - Ensure required provider and service exist. If not, you will need to create them first.
    - Confirm the service has implemented all required methods and attributes for the check (in most cases, you will need to add or modify some methods in the service to get the data you need for the check).
2. Navigate to the service directory. The path should be as follows: `prowler/providers/<provider>/services/<service>`.
3. Create a check-specific folder. The path should follow this pattern: `prowler/providers/<provider>/services/<service>/<check_name_want_to_implement>`. Adhere to the [Naming Format for Checks](/developer-guide/checks#naming-format-for-checks).
4. Create the check files, you can use next commands:
```bash
mkdir -p prowler/providers/<provider>/services/<service>/<check_name_want_to_implement>
touch prowler/providers/<provider>/services/<service>/<check_name_want_to_implement>/__init__.py
touch prowler/providers/<provider>/services/<service>/<check_name_want_to_implement>/<check_name_want_to_implement>.py
touch prowler/providers/<provider>/services/<service>/<check_name_want_to_implement>/<check_name_want_to_implement>.metadata.json
```
5. Run the check locally to ensure it works as expected. For checking you can use the CLI in the next way:
    - To ensure the check has been detected by Prowler: `poetry run python prowler-cli.py <provider> --list-checks | grep <check_name>`.
    - To run the check, to find possible issues: `poetry run python prowler-cli.py <provider> --log-level ERROR --verbose --check <check_name>`.
6. Create comprehensive tests for the check that cover multiple scenarios including both PASS (compliant) and FAIL (non-compliant) cases. For detailed information about test structure and implementation guidelines, refer to the [Testing](/developer-guide/unit-testing) documentation.
7. If the check and its corresponding tests are working as expected, you can submit a PR to Prowler.

### Adding Compliance Frameworks

1. **Create Framework File**:
```bash
# Create prowler/compliance/{provider}/{framework}.json
```

2. **Define Requirements**:
Map framework requirements to existing checks.

3. **Test Compliance**:
```bash
poetry run python -m prowler {provider} --compliance {framework}
```

## Code Quality Standards

### 1. Python Style

- **PEP 8 Compliance**: Enforced by black and flake8
- **Type Hints**: Required for all public functions
- **Docstrings**: Required for all classes and methods
- **Import Organization**: Use isort for consistent import ordering

```python
import standard_library

from third_party import library

from prowler.lib import internal_module

class ExampleClass:
    """Class docstring."""

    def method(self, param: str) -> dict | list | None:
        """Method docstring.

        Args:
            param: Description of parameter

        Returns:
            Description of return value
        """
        return None
```

### 2. Error Handling

```python
from prowler.lib.logger import logger

try:
    # Risky operation
    result = api_call()
except ProviderSpecificException as e:
    logger.error(f"Provider error: {e}")
    # Graceful handling
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    # Never let checks crash the entire scan
```

### 3. Security Practices

- **No Hardcoded Secrets**: Use environment variables or secure credential management
- **Input Validation**: Validate all external inputs
- **Principle of Least Privilege**: Request minimal necessary permissions
- **Secure Defaults**: Default to secure configurations

## Testing Guidelines

### Unit Tests

- **100% Coverage Goal**: Aim for complete test coverage
- **Mock External Services**: Use mock objects to simulate the external services
- **Test Edge Cases**: Include error conditions and boundary cases

## References

- **Root Project Guide**: `../AGENTS.md` (takes priority for cross-component guidance)
- **Provider Examples**: Reference existing providers for implementation patterns
- **Check Examples**: Study existing checks for proper implementation patterns
- **Compliance Framework Examples**: Review existing frameworks for structure
```

--------------------------------------------------------------------------------

````
