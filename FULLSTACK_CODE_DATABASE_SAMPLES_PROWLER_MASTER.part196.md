---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 196
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 196 of 867)

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

---[FILE: aws_mutelist.yaml]---
Location: prowler-master/prowler/config/aws_mutelist.yaml

```yaml
Mutelist:
  Accounts:
    "*":
      ########################### AWS CONTROL TOWER ###########################
      ### The following entries includes all resources created by AWS Control Tower when setting up a landing zone ###
      # https://docs.aws.amazon.com/controltower/latest/userguide/shared-account-resources.html #
      Checks:
        "awslambda_function_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-NotificationForwarder"
          Description: "Checks from AWS lambda functions muted by default"
        "cloudformation_stack*":
          Regions:
            - "*"
          Resources:
            - "StackSet-AWSControlTowerGuardrailAWS-*"
            - "StackSet-AWSControlTowerBP-*"
            - "StackSet-AWSControlTowerSecurityResources-*"
            - "StackSet-AWSControlTowerLoggingResources-*"
            - "StackSet-AWSControlTowerExecutionRole-*"
            - "AWSControlTowerBP-BASELINE-CLOUDTRAIL-MASTER*"
            - "AWSControlTowerBP-BASELINE-CONFIG-MASTER*"
            - "StackSet-AWSControlTower*"
            - "CLOUDTRAIL-ENABLED-ON-SHARED-ACCOUNTS-*"
            - "AFT-Backend*"
        "cloudtrail_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-BaselineCloudTrail"
        "cloudwatch_log_group_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower/CloudTrailLogs"
            - "/aws/lambda/aws-controltower-NotificationForwarder"
            - "StackSet-AWSControlTowerBP-*"
        "iam_inline_policy_no_administrative_privileges":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-ForwardSnsNotificationRole/sns"
            - "aws-controltower-AuditAdministratorRole/AssumeRole-aws-controltower-AuditAdministratorRole"
            - "aws-controltower-AuditReadOnlyRole/AssumeRole-aws-controltower-AuditReadOnlyRole"
        "iam.*policy_*":
          Regions:
            - "*"
          Resources:
            - "AWSControlTowerAccountServiceRolePolicy"
            - "AWSControlTowerServiceRolePolicy"
            - "AWSControlTowerStackSetRolePolicy"
            - "AWSControlTowerAdminPolicy"
            - "AWSLoadBalancerControllerIAMPolicy"
            - "AWSControlTowerCloudTrailRolePolicy"
        "iam_role_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-AdministratorExecutionRole"
            - "aws-controltower-AuditAdministratorRole"
            - "aws-controltower-AuditReadOnlyRole"
            - "aws-controltower-CloudWatchLogsRole"
            - "aws-controltower-ConfigRecorderRole"
            - "aws-controltower-ForwardSnsNotificationRole"
            - "aws-controltower-ReadOnlyExecutionRole"
            - "AWSControlTower_VPCFlowLogsRole"
            - "AWSControlTowerExecution"
            - "AWSControlTowerCloudTrailRole"
            - "AWSControlTowerConfigAggregatorRoleForOrganizations"
            - "AWSControlTowerStackSetRole"
            - "AWSControlTowerAdmin"
            - "AWSAFTAdmin"
            - "AWSAFTExecution"
            - "AWSAFTService"
        "s3_bucket_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-logs-*"
            - "aws-controltower-s3-access-logs-*"
        "sns_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-AggregateSecurityNotifications"
            - "aws-controltower-AllConfigNotifications"
            - "aws-controltower-SecurityNotifications"
        "vpc_*":
          Regions:
            - "*"
          Resources:
            - "*"
          Tags:
            - "Name=aws-controltower-VPC"
```

--------------------------------------------------------------------------------

---[FILE: aws_mutelist_example.yaml]---
Location: prowler-master/prowler/config/aws_mutelist_example.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "123456789012":
      Checks:
        "iam_user_hardware_mfa_enabled":
          Regions:
            - "us-east-1"
          Resources:
            - "user-1"           # Will ignore user-1 in check iam_user_hardware_mfa_enabled
            - "user-2"           # Will ignore user-2 in check iam_user_hardware_mfa_enabled
          Description: "Check iam_user_hardware_mfa_enabled muted for region us-east-1 and resources user-1, user-2"
        "ec2_*":
          Regions:
            - "*"
          Resources:
            - "*"                 # Will ignore every EC2 check in every account and region
        "*":
          Regions:
            - "*"
          Resources:
            - "test"
          Tags:
            - "test=test"         # Will ignore every resource containing the string "test" and the tags 'test=test' and
            - "project=test|project=stage" # either of ('project=test' OR project=stage) in account 123456789012 and every region
            - "environment=prod"   # Will ignore every resource except in account 123456789012 except the ones containing the string "test" and tag environment=prod

    "*":
      Checks:
        "s3_bucket_object_versioning":
          Regions:
            - "eu-west-1"
            - "us-east-1"
          Resources:
            - "ci-logs"           # Will ignore bucket "ci-logs" AND ALSO bucket "ci-logs-replica" in specified check and regions
            - "logs"              # Will ignore EVERY BUCKET containing the string "logs" in specified check and regions
            - ".+-logs"           # Will ignore all buckets containing the terms ci-logs, qa-logs, etc. in specified check and regions
        "*":
          Regions:
            - "*"
          Resources:
            - "*"
          Tags:
            - "environment=dev"    # Will ignore every resource containing the tag 'environment=dev' in every account and region
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
              - "eu-south-2"        # Will ignore every resource in check ecs_task_definitions_no_environment_secrets except the ones in account 0123456789012 located in eu-south-2 or eu-west-1
```

--------------------------------------------------------------------------------

---[FILE: azure_mutelist_example.yaml]---
Location: prowler-master/prowler/config/azure_mutelist_example.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Account == Azure Subscription and Region == Azure Location
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "Azure subscription 1":
      Checks:
        "sqlserver_tde_encryption_enabled":
          Regions:
            - "westeurope"
          Resources:
            - "sqlserver1"           # Will ignore sqlserver1 in check sqlserver_tde_encryption_enabled located in westeurope
            - "sqlserver2"           # Will ignore sqlserver2 in check sqlserver_tde_encryption_enabled located in westeurope
          Description: "Findings related with the check sqlserver_tde_encryption_enabled is muted for westeurope region and sqlserver1, sqlserver2 resources"
        "defender_*":
          Regions:
            - "*"
          Resources:
            - "*"                 # Will ignore every Defender check in every location
        "*":
          Regions:
            - "*"
          Resources:
            - "test"
          Tags:
            - "test=test"         # Will ignore every resource containing the string "test" and the tags 'test=test' and
            - "project=test|project=stage" # either of ('project=test' OR project=stage) in Azure subscription 1 and every location

    "*":
      Checks:
        "vm_*":
          Regions:
            - "*"
          Resources:
            - "*"
          Exceptions:
            Accounts:
              - "Subscription2"
            Regions:
              - "eastus"
              - "eastus2"        # Will ignore every resource in VM checks except the ones in Azure Subscription2 located in eastus or eastus2
```

--------------------------------------------------------------------------------

---[FILE: checklist_example.json]---
Location: prowler-master/prowler/config/checklist_example.json

```json
{
  "aws": [
    "glue_development_endpoints_cloudwatch_logs_encryption_enabled",
    "emr_cluster_account_public_block_enabled",
    "ec2_instance_public_ip"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: config.py]---
Location: prowler-master/prowler/config/config.py

```python
import os
import pathlib
from datetime import datetime, timezone
from enum import Enum
from os import getcwd
from typing import Tuple

import requests
import yaml
from packaging import version

from prowler.lib.logger import logger


class _MutableTimestamp:
    """Lightweight proxy to keep timestamp references in sync across modules."""

    def __init__(self, value: datetime) -> None:
        self.value = value

    def set(self, value: datetime) -> None:
        self.value = value

    def __getattr__(self, name):
        return getattr(self.value, name)

    def __str__(self) -> str:  # pragma: no cover - trivial forwarder
        return str(self.value)

    def __repr__(self) -> str:  # pragma: no cover - trivial forwarder
        return repr(self.value)

    def __eq__(self, other) -> bool:
        if isinstance(other, _MutableTimestamp):
            return self.value == other.value
        return self.value == other


timestamp = _MutableTimestamp(datetime.today())
timestamp_utc = _MutableTimestamp(datetime.now(timezone.utc))
prowler_version = "5.16.0"
html_logo_url = "https://github.com/prowler-cloud/prowler/"
square_logo_img = "https://raw.githubusercontent.com/prowler-cloud/prowler/dc7d2d5aeb92fdf12e8604f42ef6472cd3e8e889/docs/img/prowler-logo-black.png"
aws_logo = "https://user-images.githubusercontent.com/38561120/235953920-3e3fba08-0795-41dc-b480-9bea57db9f2e.png"
azure_logo = "https://user-images.githubusercontent.com/38561120/235927375-b23e2e0f-8932-49ec-b59c-d89f61c8041d.png"
gcp_logo = "https://user-images.githubusercontent.com/38561120/235928332-eb4accdc-c226-4391-8e97-6ca86a91cf50.png"

orange_color = "\033[38;5;208m"
banner_color = "\033[1;92m"


class Provider(str, Enum):
    AWS = "aws"
    GCP = "gcp"
    AZURE = "azure"
    KUBERNETES = "kubernetes"
    M365 = "m365"
    GITHUB = "github"
    IAC = "iac"
    NHN = "nhn"
    MONGODBATLAS = "mongodbatlas"
    ORACLECLOUD = "oraclecloud"
    ALIBABACLOUD = "alibabacloud"


# Compliance
actual_directory = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))


def get_available_compliance_frameworks(provider=None):
    available_compliance_frameworks = []
    providers = [p.value for p in Provider]
    if provider:
        providers = [provider]
    for provider in providers:
        with os.scandir(f"{actual_directory}/../compliance/{provider}") as files:
            for file in files:
                if file.is_file() and file.name.endswith(".json"):
                    available_compliance_frameworks.append(
                        file.name.removesuffix(".json")
                    )
    return available_compliance_frameworks


available_compliance_frameworks = get_available_compliance_frameworks()


# AWS services-regions matrix json
aws_services_json_file = "aws_regions_by_service.json"

# gcp_zones_json_file = "gcp_zones.json"

default_output_directory = getcwd() + "/output"
output_file_timestamp = timestamp.strftime("%Y%m%d%H%M%S")
timestamp_iso = timestamp.isoformat(sep=" ", timespec="seconds")
csv_file_suffix = ".csv"
json_file_suffix = ".json"
json_asff_file_suffix = ".asff.json"
json_ocsf_file_suffix = ".ocsf.json"
html_file_suffix = ".html"
default_config_file_path = (
    f"{pathlib.Path(os.path.dirname(os.path.realpath(__file__)))}/config.yaml"
)
default_fixer_config_file_path = (
    f"{pathlib.Path(os.path.dirname(os.path.realpath(__file__)))}/fixer_config.yaml"
)
default_redteam_config_file_path = (
    f"{pathlib.Path(os.path.dirname(os.path.realpath(__file__)))}/llm_config.yaml"
)
encoding_format_utf_8 = "utf-8"
available_output_formats = ["csv", "json-asff", "json-ocsf", "html"]


def set_output_timestamp(
    new_timestamp: datetime,
) -> Tuple[datetime, datetime, str, str]:
    """
    Override the global output timestamps so generated artifacts reflect a specific scan.
    Returns the previous values so callers can restore them afterwards.
    """
    global timestamp, timestamp_utc, output_file_timestamp, timestamp_iso

    previous_values = (
        timestamp.value,
        timestamp_utc.value,
        output_file_timestamp,
        timestamp_iso,
    )

    timestamp.set(new_timestamp)
    timestamp_utc.set(
        new_timestamp.astimezone(timezone.utc)
        if new_timestamp.tzinfo
        else new_timestamp.replace(tzinfo=timezone.utc)
    )
    output_file_timestamp = timestamp.strftime("%Y%m%d%H%M%S")
    timestamp_iso = timestamp.isoformat(sep=" ", timespec="seconds")

    return previous_values


def get_default_mute_file_path(provider: str):
    """
    get_default_mute_file_path returns the default mute file path for the provider
    """
    # TODO: create default mutelist file for kubernetes, azure and gcp
    mutelist_path = f"{pathlib.Path(os.path.dirname(os.path.realpath(__file__)))}/{provider}_mutelist.yaml"
    if not os.path.isfile(mutelist_path):
        mutelist_path = None
    return mutelist_path


def check_current_version():
    try:
        prowler_version_string = f"Prowler {prowler_version}"
        release_response = requests.get(
            "https://api.github.com/repos/prowler-cloud/prowler/tags", timeout=1
        )
        latest_version = release_response.json()[0]["name"]
        if version.parse(latest_version) > version.parse(prowler_version):
            return f"{prowler_version_string} (latest is {latest_version}, upgrade for the latest features)"
        else:
            return (
                f"{prowler_version_string} (You are running the latest version, yay!)"
            )
    except requests.RequestException:
        return f"{prowler_version_string}"
    except Exception:
        return f"{prowler_version_string}"


def load_and_validate_config_file(provider: str, config_file_path: str) -> dict:
    """
    Reads the Prowler config file in YAML format from the default location or the file passed with the --config-file flag.

    Args:
        provider (str): The provider name (e.g., 'aws', 'gcp', 'azure', 'kubernetes').
        config_file_path (str): The path to the configuration file.

    Returns:
        dict: The configuration dictionary for the specified provider.
    """
    try:
        with open(config_file_path, "r", encoding=encoding_format_utf_8) as f:
            config_file = yaml.safe_load(f)

            # Not to introduce a breaking change, allow the old format config file without any provider keys
            # and a new format with a key for each provider to include their configuration values within.
            if any(
                key in config_file
                for key in ["aws", "gcp", "azure", "kubernetes", "m365"]
            ):
                config = config_file.get(provider, {})
            else:
                config = config_file if config_file else {}
                # Not to break Azure, K8s and GCP does not support or use the old config format
                if provider in ["azure", "gcp", "kubernetes", "m365"]:
                    config = {}

            return config

    except FileNotFoundError as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}] -- {error}"
        )
    except yaml.YAMLError as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}] -- {error}"
        )
    except UnicodeDecodeError as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}] -- {error}"
        )
    except Exception as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}] -- {error}"
        )

    return {}


def load_and_validate_fixer_config_file(
    provider: str, fixer_config_file_path: str
) -> dict:
    """
    Reads the Prowler fixer config file in YAML format from the default location or the file passed with the --fixer-config flag.

    Args:
        provider (str): The provider name (e.g., 'aws', 'gcp', 'azure', 'kubernetes').
        fixer_config_file_path (str): The path to the fixer configuration file.

    Returns:
        dict: The fixer configuration dictionary for the specified provider.
    """
    try:
        with open(fixer_config_file_path, "r", encoding=encoding_format_utf_8) as f:
            fixer_config_file = yaml.safe_load(f)
            return fixer_config_file.get(provider, {})

    except FileNotFoundError as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}] -- {error}"
        )
    except yaml.YAMLError as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}] -- {error}"
        )
    except UnicodeDecodeError as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}] -- {error}"
        )
    except Exception as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}] -- {error}"
        )

    return {}
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: prowler-master/prowler/config/config.yaml

```yaml
# AWS Configuration
aws:
  # AWS Global Configuration
  # aws.mute_non_default_regions --> Set to True to muted failed findings in non-default regions for AccessAnalyzer, GuardDuty, SecurityHub, DRS and Config
  mute_non_default_regions: False
  # If you want to mute failed findings only in specific regions, create a file with the following syntax and run it with `prowler aws -w mutelist.yaml`:
  # Mutelist:
  #  Accounts:
  #   "*":
  #     Checks:
  #       "*":
  #         Regions:
  #           - "ap-southeast-1"
  #           - "ap-southeast-2"
  #         Resources:
  #           - "*"

  # AWS IAM Configuration
  # aws.iam_user_accesskey_unused --> CIS recommends 45 days
  max_unused_access_keys_days: 45
  # aws.iam_user_console_access_unused --> CIS recommends 45 days
  max_console_access_days: 45

  # AWS EC2 Configuration
  # aws.ec2_elastic_ip_shodan
  # TODO: create common config
  shodan_api_key: null
  # aws.ec2_securitygroup_with_many_ingress_egress_rules --> by default is 50 rules
  max_security_group_rules: 50
  # aws.ec2_instance_older_than_specific_days --> by default is 6 months (180 days)
  max_ec2_instance_age_in_days: 180
  # aws.ec2_securitygroup_allow_ingress_from_internet_to_any_port
  # allowed network interface types for security groups open to the Internet
  ec2_allowed_interface_types:
    [
        "api_gateway_managed",
        "vpc_endpoint",
    ]
  # allowed network interface owners for security groups open to the Internet
  ec2_allowed_instance_owners:
    [
        "amazon-elb"
    ]
  # aws.ec2_securitygroup_allow_ingress_from_internet_to_high_risk_tcp_ports
  ec2_high_risk_ports:
    [
        25,
        110,
        135,
        143,
        445,
        3000,
        4333,
        5000,
        5500,
        8080,
        8088,
    ]

  # AWS ECS Configuration
  # aws.ecs_service_fargate_latest_platform_version
  fargate_linux_latest_version: "1.4.0"
  fargate_windows_latest_version: "1.0.0"

  # AWS VPC Configuration (vpc_endpoint_connections_trust_boundaries, vpc_endpoint_services_allowed_principals_trust_boundaries)
  # AWS SSM Configuration (aws.ssm_documents_set_as_public)
  # Single account environment: No action required. The AWS account number will be automatically added by the checks.
  # Multi account environment: Any additional trusted account number should be added as a space separated list, e.g.
  # trusted_account_ids : ["123456789012", "098765432109", "678901234567"]
  trusted_account_ids: []

  # AWS Cloudwatch Configuration
  # aws.cloudwatch_log_group_retention_policy_specific_days_enabled --> by default is 365 days
  log_group_retention_days: 365

  # AWS CloudFormation Configuration
  # cloudformation_stack_cdktoolkit_bootstrap_version --> by default is 21
  recommended_cdk_bootstrap_version: 21

  # AWS AppStream Session Configuration
  # aws.appstream_fleet_session_idle_disconnect_timeout
  max_idle_disconnect_timeout_in_seconds: 600 # 10 Minutes
  # aws.appstream_fleet_session_disconnect_timeout
  max_disconnect_timeout_in_seconds: 300 # 5 Minutes
  # aws.appstream_fleet_maximum_session_duration
  max_session_duration_seconds: 36000 # 10 Hours

  # AWS Lambda Configuration
  # aws.awslambda_function_using_supported_runtimes
  obsolete_lambda_runtimes:
    [
      "java8",
      "go1.x",
      "provided",
      "python3.6",
      "python2.7",
      "python3.7",
      "python3.8",
      "nodejs4.3",
      "nodejs4.3-edge",
      "nodejs6.10",
      "nodejs",
      "nodejs8.10",
      "nodejs10.x",
      "nodejs12.x",
      "nodejs14.x",
      "nodejs16.x",
      "dotnet5.0",
      "dotnet6",
      "dotnet7",
      "dotnetcore1.0",
      "dotnetcore2.0",
      "dotnetcore2.1",
      "dotnetcore3.1",
      "ruby2.5",
      "ruby2.7",
    ]
  # aws.awslambda_function_vpc_is_in_multi_azs
  lambda_min_azs: 2

  # AWS Organizations
  # aws.organizations_scp_check_deny_regions
  # aws.organizations_enabled_regions: [
  #   "eu-central-1",
  #   "eu-west-1",
  #   "us-east-1"
  # ]
  organizations_enabled_regions: []
  organizations_trusted_delegated_administrators: []

  # AWS ECR
  # aws.ecr_repositories_scan_vulnerabilities_in_latest_image
  # CRITICAL
  # HIGH
  # MEDIUM
  ecr_repository_vulnerability_minimum_severity: "MEDIUM"

  # AWS Trusted Advisor
  # aws.trustedadvisor_premium_support_plan_subscribed
  verify_premium_support_plans: True

  # AWS CloudTrail Configuration
  # aws.cloudtrail_threat_detection_privilege_escalation
  threat_detection_privilege_escalation_threshold: 0.2 # Percentage of actions found to decide if it is an privilege_escalation attack event, by default is 0.2 (20%)
  threat_detection_privilege_escalation_minutes: 1440 # Past minutes to search from now for privilege_escalation attacks, by default is 1440 minutes (24 hours)
  threat_detection_privilege_escalation_actions:
    [
      "AddPermission",
      "AddRoleToInstanceProfile",
      "AddUserToGroup",
      "AssociateAccessPolicy",
      "AssumeRole",
      "AttachGroupPolicy",
      "AttachRolePolicy",
      "AttachUserPolicy",
      "ChangePassword",
      "CreateAccessEntry",
      "CreateAccessKey",
      "CreateDevEndpoint",
      "CreateEventSourceMapping",
      "CreateFunction",
      "CreateGroup",
      "CreateJob",
      "CreateKeyPair",
      "CreateLoginProfile",
      "CreatePipeline",
      "CreatePolicyVersion",
      "CreateRole",
      "CreateStack",
      "DeleteRolePermissionsBoundary",
      "DeleteRolePolicy",
      "DeleteUserPermissionsBoundary",
      "DeleteUserPolicy",
      "DetachRolePolicy",
      "DetachUserPolicy",
      "GetCredentialsForIdentity",
      "GetId",
      "GetPolicyVersion",
      "GetUserPolicy",
      "Invoke",
      "ModifyInstanceAttribute",
      "PassRole",
      "PutGroupPolicy",
      "PutPipelineDefinition",
      "PutRolePermissionsBoundary",
      "PutRolePolicy",
      "PutUserPermissionsBoundary",
      "PutUserPolicy",
      "ReplaceIamInstanceProfileAssociation",
      "RunInstances",
      "SetDefaultPolicyVersion",
      "UpdateAccessKey",
      "UpdateAssumeRolePolicy",
      "UpdateDevEndpoint",
      "UpdateEventSourceMapping",
      "UpdateFunctionCode",
      "UpdateJob",
      "UpdateLoginProfile",
    ]
  # aws.cloudtrail_threat_detection_enumeration
  threat_detection_enumeration_threshold: 0.3 # Percentage of actions found to decide if it is an enumeration attack event, by default is 0.3 (30%)
  threat_detection_enumeration_minutes: 1440 # Past minutes to search from now for enumeration attacks, by default is 1440 minutes (24 hours)
  threat_detection_enumeration_actions:
    [
      "DescribeAccessEntry",
      "DescribeAccountAttributes",
      "DescribeAvailabilityZones",
      "DescribeBundleTasks",
      "DescribeCarrierGateways",
      "DescribeClientVpnRoutes",
      "DescribeCluster",
      "DescribeDhcpOptions",
      "DescribeFlowLogs",
      "DescribeImages",
      "DescribeInstanceAttribute",
      "DescribeInstanceInformation",
      "DescribeInstanceTypes",
      "DescribeInstances",
      "DescribeInstances",
      "DescribeKeyPairs",
      "DescribeLogGroups",
      "DescribeLogStreams",
      "DescribeOrganization",
      "DescribeRegions",
      "DescribeSecurityGroups",
      "DescribeSnapshotAttribute",
      "DescribeSnapshotTierStatus",
      "DescribeSubscriptionFilters",
      "DescribeTransitGatewayMulticastDomains",
      "DescribeVolumes",
      "DescribeVolumesModifications",
      "DescribeVpcEndpointConnectionNotifications",
      "DescribeVpcs",
      "GetAccount",
      "GetAccountAuthorizationDetails",
      "GetAccountSendingEnabled",
      "GetBucketAcl",
      "GetBucketLogging",
      "GetBucketPolicy",
      "GetBucketReplication",
      "GetBucketVersioning",
      "GetCallerIdentity",
      "GetCertificate",
      "GetConsoleScreenshot",
      "GetCostAndUsage",
      "GetDetector",
      "GetEbsDefaultKmsKeyId",
      "GetEbsEncryptionByDefault",
      "GetFindings",
      "GetFlowLogsIntegrationTemplate",
      "GetIdentityVerificationAttributes",
      "GetInstances",
      "GetIntrospectionSchema",
      "GetLaunchTemplateData",
      "GetLaunchTemplateData",
      "GetLogRecord",
      "GetParameters",
      "GetPolicyVersion",
      "GetPublicAccessBlock",
      "GetQueryResults",
      "GetRegions",
      "GetSMSAttributes",
      "GetSMSSandboxAccountStatus",
      "GetSendQuota",
      "GetTransitGatewayRouteTableAssociations",
      "GetUserPolicy",
      "HeadObject",
      "ListAccessKeys",
      "ListAccounts",
      "ListAllMyBuckets",
      "ListAssociatedAccessPolicies",
      "ListAttachedUserPolicies",
      "ListClusters",
      "ListDetectors",
      "ListDomains",
      "ListFindings",
      "ListHostedZones",
      "ListIPSets",
      "ListIdentities",
      "ListInstanceProfiles",
      "ListObjects",
      "ListOrganizationalUnitsForParent",
      "ListOriginationNumbers",
      "ListPolicyVersions",
      "ListRoles",
      "ListRoles",
      "ListRules",
      "ListServiceQuotas",
      "ListSubscriptions",
      "ListTargetsByRule",
      "ListTopics",
      "ListUsers",
      "LookupEvents",
      "Search",
    ]
  # aws.cloudtrail_threat_detection_llm_jacking
  threat_detection_llm_jacking_threshold: 0.4 # Percentage of actions found to decide if it is an LLM Jacking attack event, by default is 0.4 (40%)
  threat_detection_llm_jacking_minutes: 1440 # Past minutes to search from now for LLM Jacking attacks, by default is 1440 minutes (24 hours)
  threat_detection_llm_jacking_actions:
    [
    "PutUseCaseForModelAccess",  # Submits a use case for model access, providing justification (Write).
    "PutFoundationModelEntitlement",  # Grants entitlement for accessing a foundation model (Write).
    "PutModelInvocationLoggingConfiguration", # Configures logging for model invocations (Write).
    "CreateFoundationModelAgreement",  # Creates a new agreement to use a foundation model (Write).
    "InvokeModel",  # Invokes a specified Bedrock model for inference using provided prompt and parameters (Read).
    "InvokeModelWithResponseStream",  # Invokes a Bedrock model for inference with real-time token streaming (Read).
    "GetUseCaseForModelAccess",  # Retrieves an existing use case for model access (Read).
    "GetModelInvocationLoggingConfiguration",  # Fetches the logging configuration for model invocations (Read).
    "GetFoundationModelAvailability",  # Checks the availability of a foundation model for use (Read).
    "ListFoundationModelAgreementOffers",  # Lists available agreement offers for accessing foundation models (List).
    "ListFoundationModels",  # Lists the available foundation models in Bedrock (List).
    "ListProvisionedModelThroughputs",  # Lists the provisioned throughput for previously created models (List).
    "SearchAgreements",  # Searches for agreements based on specified criteria (List).
    "AcceptAgreementRequest",  # Accepts a request for an agreement to use a foundation model (Write).
    ]

  # AWS RDS Configuration
  # aws.rds_instance_backup_enabled
  # Whether to check RDS instance replicas or not
  check_rds_instance_replicas: False

  # AWS ACM Configuration
  # aws.acm_certificates_expiration_check
  days_to_expire_threshold: 7
  # aws.acm_certificates_with_secure_key_algorithms
  insecure_key_algorithms:
    [
      "RSA-1024",
      "P-192",
    ]

  # AWS EKS Configuration
  # aws.eks_control_plane_logging_all_types_enabled
  # EKS control plane logging types that must be enabled
  eks_required_log_types:
    [
      "api",
      "audit",
      "authenticator",
      "controllerManager",
      "scheduler",
    ]

  # aws.eks_cluster_uses_a_supported_version
  # EKS clusters must be version 1.28 or higher
  eks_cluster_oldest_version_supported: "1.28"

  # AWS CodeBuild Configuration
  # aws.codebuild_project_no_secrets_in_variables
  # CodeBuild sensitive variables that are excluded from the check
  excluded_sensitive_environment_variables:
    [

    ]

  # AWS ELB Configuration
  # aws.elb_is_in_multiple_az
  # Minimum number of Availability Zones that an CLB must be in
  elb_min_azs: 2

  # AWS ELBv2 Configuration
  # aws.elbv2_is_in_multiple_az
  # Minimum number of Availability Zones that an ELBv2 must be in
  elbv2_min_azs: 2

  # AWS Elasticache Configuration
  # aws.elasticache_redis_cluster_backup_enabled
  # Minimum number of days that a Redis cluster must have backups retention period
  minimum_snapshot_retention_period: 7


  # AWS Secrets Configuration
  # Patterns to ignore in the secrets checks
  secrets_ignore_patterns: []

  # AWS Secrets Manager Configuration
  # aws.secretsmanager_secret_unused
  # Maximum number of days a secret can be unused
  max_days_secret_unused: 90

  # aws.secretsmanager_secret_rotated_periodically
  # Maximum number of days a secret should be rotated
  max_days_secret_unrotated: 90

  # AWS Kinesis Configuration
  # Minimum retention period in hours for Kinesis streams
  min_kinesis_stream_retention_hours: 168 # 7 days

  # Detect Secrets plugin configuration
  detect_secrets_plugins: [
    {"name": "ArtifactoryDetector"},
    {"name": "AWSKeyDetector"},
    {"name": "AzureStorageKeyDetector"},
    {"name": "BasicAuthDetector"},
    {"name": "CloudantDetector"},
    {"name": "DiscordBotTokenDetector"},
    {"name": "GitHubTokenDetector"},
    {"name": "GitLabTokenDetector"},
    {"name": "Base64HighEntropyString", "limit": 6.0},
    {"name": "HexHighEntropyString", "limit": 3.0},
    {"name": "IbmCloudIamDetector"},
    {"name": "IbmCosHmacDetector"},
    # {"name": "IPPublicDetector"}, https://github.com/Yelp/detect-secrets/pull/885
    {"name": "JwtTokenDetector"},
    {"name": "KeywordDetector"},
    {"name": "MailchimpDetector"},
    {"name": "NpmDetector"},
    {"name": "OpenAIDetector"},
    {"name": "PrivateKeyDetector"},
    {"name": "PypiTokenDetector"},
    {"name": "SendGridDetector"},
    {"name": "SlackDetector"},
    {"name": "SoftlayerDetector"},
    {"name": "SquareOAuthDetector"},
    {"name": "StripeDetector"},
    # {"name": "TelegramBotTokenDetector"}, https://github.com/Yelp/detect-secrets/pull/878
    {"name": "TwilioKeyDetector"},
  ]

  # AWS CodeBuild Configuration
  # aws.codebuild_project_uses_allowed_github_organizations
  codebuild_github_allowed_organizations:
    [
    ]

# Azure Configuration
azure:
  # Azure Network Configuration
  # azure.network_public_ip_shodan
  # TODO: create common config
  shodan_api_key: null

  # Configurable minimal risk level for attack path notifications
  # azure.defender_attack_path_notifications_properly_configured
  defender_attack_path_minimal_risk_level: "High"

  # Azure App Service
  # azure.app_ensure_php_version_is_latest
  php_latest_version: "8.2"
  # azure.app_ensure_python_version_is_latest
  python_latest_version: "3.12"
  # azure.app_ensure_java_version_is_latest
  java_latest_version: "17"

  # Azure SQL Server
  # azure.sqlserver_minimal_tls_version
  recommended_minimal_tls_versions:
    [
      "1.2",
      "1.3",
    ]

  # Azure Virtual Machines
  # azure.vm_desired_sku_size
  # List of desired VM SKU sizes that are allowed in the organization
  desired_vm_sku_sizes:
    [
      "Standard_A8_v2",
      "Standard_DS3_v2",
      "Standard_D4s_v3",
    ]
  # Azure VM Backup Configuration
  # azure.vm_sufficient_daily_backup_retention_period
  vm_backup_min_daily_retention_days: 7

  # Azure API Management Configuration
  # azure.apim_threat_detection_llm_jacking
  apim_threat_detection_llm_jacking_threshold: 0.1
  apim_threat_detection_llm_jacking_minutes: 1440
  apim_threat_detection_llm_jacking_actions:
    [
      # OpenAI API endpoints
      "ImageGenerations_Create",
      "ChatCompletions_Create",
      "Completions_Create",
      "Embeddings_Create",
      "FineTuning_Jobs_Create",
      "Models_List",

      # Azure OpenAI endpoints
      "Deployments_List",
      "Deployments_Get",
      "Deployments_Create",
      "Deployments_Delete",

      # Anthropic endpoints
      "Messages_Create",
      "Claude_Create",

      # Google AI endpoints
      "GenerateContent",
      "GenerateText",
      "GenerateImage",

      # Meta AI endpoints
      "Llama_Create",
      "CodeLlama_Create",

      # Other LLM endpoints
      "Gemini_Generate",
      "Claude_Generate",
      "Llama_Generate"
    ]

# GCP Configuration
gcp:
  # GCP Compute Configuration
  # gcp.compute_public_address_shodan
  shodan_api_key: null
  # GCP Service Account and user-managed keys unused configuration
  # gcp.iam_service_account_unused
  # gcp.iam_sa_user_managed_key_unused
  max_unused_account_days: 180
  # GCP Storage Sufficient Retention Period
  # gcp.cloudstorage_bucket_sufficient_retention_period
  storage_min_retention_days: 90

# Kubernetes Configuration
kubernetes:
  # Kubernetes API Server
  # kubernetes.apiserver_audit_log_maxbackup_set
  audit_log_maxbackup: 10
  # kubernetes.apiserver_audit_log_maxsize_set
  audit_log_maxsize: 100
  # kubernetes.apiserver_audit_log_maxage_set
  audit_log_maxage: 30
  # kubernetes.apiserver_strong_ciphers_only
  apiserver_strong_ciphers:
    [
      "TLS_AES_128_GCM_SHA256",
      "TLS_AES_256_GCM_SHA384",
      "TLS_CHACHA20_POLY1305_SHA256",
    ]
  # Kubelet
  # kubernetes.kubelet_strong_ciphers_only
  kubelet_strong_ciphers:
    [
      "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
      "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
      "TLS_RSA_WITH_AES_256_GCM_SHA384",
      "TLS_RSA_WITH_AES_128_GCM_SHA256",
    ]


# M365 Configuration
m365:
  # Entra
  # m365.entra_admin_users_sign_in_frequency_enabled
  sign_in_frequency: 4 # 4 hours
  # Teams
  # m365.teams_external_file_sharing_restricted
  allowed_cloud_storage_services:
    [
      #"allow_box",
      #"allow_drop_box",
      #"allow_egnyte",
      #"allow_google_drive",
      #"allow_share_file",
    ]
  # Exchange
  # m365.exchange_organization_mailtips_enabled
  recommended_mailtips_large_audience_threshold: 25 # maximum number of recipients
  # Defender Malware Policy Settings
  # m365.defender_malware_policy_comprehensive_attachments_filter_applied
  # The recommended list of file extensions to be blocked, this can be changed depending on the organization needs
  default_recommended_extensions:
    [
      "ace", "ani", "apk", "app", "appx", "arj", "bat", "cab", "cmd", "com",
      "deb", "dex", "dll", "docm", "elf", "exe", "hta", "img", "iso", "jar",
      "jnlp", "kext", "lha", "lib", "library", "lnk", "lzh", "macho", "msc",
      "msi", "msix", "msp", "mst", "pif", "ppa", "ppam", "reg", "rev", "scf",
      "scr", "sct", "sys", "uif", "vb", "vbe", "vbs", "vxd", "wsc", "wsf",
      "wsh", "xll", "xz", "z"
    ]
  # m365.exchange_mailbox_properties_auditing_enabled
  # Maximum number of days to keep audit logs
  audit_log_age: 90

# GitHub Configuration
github:
  # github.repository_inactive_not_archived --> CIS recommends 180 days (6 months)
  inactive_not_archived_days_threshold: 180

# MongoDB Atlas Configuration
mongodbatlas:
  # mongodbatlas.organizations_service_account_secrets_expiration --> Maximum hours for service account secrets validity
  max_service_account_secret_validity_hours: 8
```

--------------------------------------------------------------------------------

````
