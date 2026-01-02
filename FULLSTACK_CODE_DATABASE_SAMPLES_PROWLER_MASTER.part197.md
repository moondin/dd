---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 197
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 197 of 867)

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

---[FILE: custom_checks_metadata_example.yaml]---
Location: prowler-master/prowler/config/custom_checks_metadata_example.yaml

```yaml
CustomChecksMetadata:
  aws:
    Checks:
      s3_bucket_level_public_access_block:
        Severity: high
        CheckTitle: S3 Bucket Level Public Access Block
        Description: This check ensures that the S3 bucket level public access block is enabled.
        Risk: This check is important because it ensures that the S3 bucket level public access block is enabled.
        RelatedUrl: https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html
        Remediation:
          Code:
            CLI: aws s3api put-public-access-block --bucket <bucket-name> --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
            NativeIaC: https://aws.amazon.com/es/s3/features/block-public-access/
            Other: https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html
            Terraform: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block
          Recommendation:
            Text: Enable the S3 bucket level public access block.
            Url: https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html
      s3_bucket_no_mfa_delete:
        Severity: high
        CheckTitle: S3 Bucket No MFA Delete
        Description: This check ensures that the S3 bucket does not allow delete operations without MFA.
        Risk: This check is important because it ensures that the S3 bucket does not allow delete operations without MFA.
        RelatedUrl: https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html
        Remediation:
          Code:
            CLI: aws s3api put-bucket-versioning --bucket <bucket-name> --versioning-configuration Status=Enabled
            NativeIaC: https://aws.amazon.com/es/s3/features/versioning/
            Other: https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html
            Terraform: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_versioning
          Recommendation:
            Text: Enable versioning on the S3 bucket.
            Url: https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html
  azure:
    Checks:
      storage_infrastructure_encryption_is_enabled:
        Severity: medium
        CheckTitle: Storage Infrastructure Encryption Is Enabled
        Description: This check ensures that storage infrastructure encryption is enabled.
        Risk: This check is important because it ensures that storage infrastructure encryption is enabled.
        RelatedUrl: https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption
        Remediation:
          Code:
            CLI: az storage account update --name <storage-account-name> --resource-group <resource-group-name> --set properties.encryption.services.blob.enabled=true properties.encryption.services.file.enabled=true properties.encryption.services.queue.enabled=true properties.encryption.services.table.enabled=true
            NativeIaC: https://docs.microsoft.com/en-us/azure/templates/microsoft.storage/storageaccounts
            Other: https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption
            Terraform: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account
          Recommendation:
            Text: Enable storage infrastructure encryption.
            Url: https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption
  gcp:
    Checks:
      compute_instance_public_ip:
        Severity: critical
        CheckTitle: Compute Instance Public IP
        Description: This check ensures that the compute instance does not have a public IP.
        Risk: This check is important because it ensures that the compute instance does not have a public IP.
        RelatedUrl: https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address
        Remediation:
          Code:
            CLI: https://docs.prowler.com/checks/gcp/google-cloud-public-policies/bc_gcp_public_2#cli-command
            NativeIaC: https://cloud.google.com/compute/docs/reference/rest/v1/instances
            Other: https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address
            Terraform: https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance
          Recommendation:
            Text: Remove the public IP from the compute instance.
            Url: https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address
  kubernetes:
    Checks:
      apiserver_anonymous_requests:
        Severity: low
        CheckTitle: APIServer Anonymous Requests
        Description: This check ensures that anonymous requests to the APIServer are disabled.
        Risk: This check is important because it ensures that anonymous requests to the APIServer are disabled.
        RelatedUrl: https://kubernetes.io/docs/reference/access-authn-authz/authentication/
        Remediation:
          Code:
            CLI: --anonymous-auth=false
            NativeIaC: https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-anonymous-auth-argument-is-set-to-false-1#kubernetes
            Other: https://kubernetes.io/docs/reference/access-authn-authz/authentication/
            Terraform: https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/cluster_role_binding
          Recommendation:
            Text: Disable anonymous requests to the APIServer.
            Url: https://kubernetes.io/docs/reference/access-authn-authz/authentication/
```

--------------------------------------------------------------------------------

---[FILE: fixer_config.yaml]---
Location: prowler-master/prowler/config/fixer_config.yaml

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

  #ec2_ebs_snapshot_account_block_public_access
  ec2_ebs_snapshot_account_block_public_access:
    State: "block-all-sharing"

  #ec2_instance_account_imdsv2_enabled
  # No configuration needed for this check
```

--------------------------------------------------------------------------------

---[FILE: gcp_mutelist_example.yaml]---
Location: prowler-master/prowler/config/gcp_mutelist_example.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Account == GCP Project ID and Region == GCP Location
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "gcp-project-id-1":
      Checks:
        "compute_instance_public_ip":
          Regions:
            - "europe-southwest1"
          Resources:
            - "instance1"           # Will ignore instance1 in check compute_instance_public_ip located in europe-southwest1
            - "instance2"           # Will ignore instance2 in check compute_instance_public_ip located in europe-southwest1
          Description: "Findings related with the check compute_instance_public_ip will be muted for europe-southwest1 region and instance1, instance2 resources"
        "iam_*":
          Regions:
            - "*"
          Resources:
            - "*"                 # Will ignore every IAM check in every location
        "*":
          Regions:
            - "*"
          Resources:
            - "test"
          Tags:
            - "test=test"         # Will ignore every resource containing the string "test" and the tags 'test=test' and
            - "project=test|project=stage" # either of ('project=test' OR project=stage) in GCP Project gcp-project-id-1 and every location

    "*":
      Checks:
        "kms_*":
          Regions:
            - "*"
          Resources:
            - "*"
          Exceptions:
            Accounts:
              - "gcp-project-id-2"
            Regions:
              - "us-west1"
              - "us-west2"        # Will ignore every resource in KMS checks except the ones in GCP Project gcp-project-id-2 located in us-west1 or us-west2
```

--------------------------------------------------------------------------------

---[FILE: github_mutelist_example.yaml]---
Location: prowler-master/prowler/config/github_mutelist_example.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Account == <GitHub Account Name>
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "account_1":
      Checks:
        "repository_public_has_securitymd_file":
          Regions:
            - "*"
          Resources:
            - "resource_1"
            - "resource_2"
```

--------------------------------------------------------------------------------

---[FILE: kubernetes_mutelist_example.yaml]---
Location: prowler-master/prowler/config/kubernetes_mutelist_example.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Account == <Kubernetes Cluster Name> and Region == <Kubernetes Namespace Name>
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "k8s-cluster-1":
      Checks:
        "core_minimize_allowPrivilegeEscalation_containers":
          Regions:
            - "namespace1"
          Resources:
            - "prowler-pod1"           # Will ignore prowler-pod1 in check core_minimize_allowPrivilegeEscalation_containers located in namespace1
            - "prowler-pod2"           # Will ignore prowler-pod2 in check core_minimize_allowPrivilegeEscalation_containers located in namespace1
          Description: "Findings related with the check core_minimize_allowPrivilegeEscalation_containers will be muted for namespace1 region and prowler-pod1, prowler-pod2 resources"
        "kubelet_*":
          Regions:
            - "*"
          Resources:
            - "*"                 # Will ignore every Kubelet check in every namespace
        "*":
          Regions:
            - "*"
          Resources:
            - "test"
          Tags:
            - "test=test"         # Will ignore every resource containing the string "test" and the tags 'test=test' and
            - "project=test|project=stage" # either of ('project=test' OR project=stage) in Kubernetes Cluster k8s-cluster-1 and every namespace

    "*":
      Checks:
        "etcd_*":
          Regions:
            - "*"
          Resources:
            - "*"
          Exceptions:
            Accounts:
              - "k8s-cluster-2"
            Regions:
              - "namespace1"
              - "namespace2"        # Will ignore every ETCD finding except the ones in Kubernetes Cluster k8s-cluster-2 located in namespace1 or namespace2
```

--------------------------------------------------------------------------------

---[FILE: m365_mutelist_example.yaml]---
Location: prowler-master/prowler/config/m365_mutelist_example.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Account == M365 Tenant and Region == M365 Location
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "*":
      Checks:
        "admincenter_groups_not_public_visibility":
          Regions:
            - "westeurope"
          Resources:
            - "sqlserver1"           # Will ignore sqlserver1 in check sqlserver_tde_encryption_enabled located in westeurope
          Description: "Findings related with the check sqlserver_tde_encryption_enabled is muted for westeurope region and sqlserver1 resource"
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
        "admincenter_*":
          Regions:
            - "*"
          Resources:
            - "*"
          Exceptions:
            Accounts:
              - "Tenant1"
            Regions:
              - "eastus"
              - "eastus2"        # Will ignore every resource in admincenter checks except the ones in Tenant1 located in eastus or eastus2
```

--------------------------------------------------------------------------------

---[FILE: mongodbatlas_mutelist_example.yaml]---
Location: prowler-master/prowler/config/mongodbatlas_mutelist_example.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Account == MongoDB Atlas Organization ID and Region == MongoDB Atlas Cluster Region
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MONGODB ATLAS MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "your-organization-id-here":
      Checks:
        "clusters_authentication_enabled":
          Regions:
            - "US_EAST_1"
          Resources:
            - "test-cluster"
          Description: "Mute clusters_authentication_enabled check for test-cluster in US_EAST_1 region"
        "projects_auditing_enabled":
          Regions:
            - "*"
          Resources:
            - "*"
          Description: "Mute projects_auditing_enabled check for all resources in all regions"

    "*":
      Checks:
        "clusters_backup_enabled":
          Regions:
            - "WESTERN_EUROPE"
          Resources:
            - "*"
          Description: "Mute clusters_backup_enabled check for all clusters in all regions"
```

--------------------------------------------------------------------------------

---[FILE: oraclecloud_mutelist_example.yaml]---
Location: prowler-master/prowler/config/oraclecloud_mutelist_example.yaml

```yaml
### Tenancy, Check and/or Region can be * to apply for all the cases.
### Tenancy == OCI Tenancy OCID and Region == OCI Region
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Tenancies, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Tenancies:
    "ocid1.tenancy.oc1..aaaaaaaexample":
      Checks:
        "iam_user_mfa_enabled":
          Regions:
            - "us-phoenix-1"
          Resources:
            - "ocid1.user.oc1..aaaaaaaexample1"           # Will ignore user1 in check iam_user_mfa_enabled
            - "ocid1.user.oc1..aaaaaaaexample2"           # Will ignore user2 in check iam_user_mfa_enabled
          Description: "Check iam_user_mfa_enabled muted for region us-phoenix-1 and specific user resources"
        "objectstorage_*":
          Regions:
            - "*"
          Resources:
            - "*"                 # Will ignore every Object Storage check in every region
        "*":
          Regions:
            - "*"
          Resources:
            - "test"
          Tags:
            - "test=test"         # Will ignore every resource containing the string "test" and the tags 'test=test' and
            - "project=test|project=stage" # either of ('project=test' OR project=stage) in tenancy ocid1.tenancy.oc1..aaaaaaaexample and every region
            - "environment=prod"   # Will ignore every resource containing the string "test" and tag environment=prod

    "*":
      Checks:
        "objectstorage_bucket_public_access":
          Regions:
            - "us-ashburn-1"
            - "us-phoenix-1"
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
            - "environment=dev"    # Will ignore every resource containing the tag 'environment=dev' in every tenancy and region
        "compute_instance_monitoring_enabled":
          Regions:
            - "*"
          Resources:
            - "*"
          Exceptions:
            Tenancies:
              - "ocid1.tenancy.oc1..aaaaaaaexample2"
            Regions:
              - "eu-frankfurt-1"
              - "eu-amsterdam-1"        # Will ignore every resource in check compute_instance_monitoring_enabled except the ones in tenancy ocid1.tenancy.oc1..aaaaaaaexample2 located in eu-frankfurt-1 or eu-amsterdam-1
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: prowler-master/prowler/exceptions/exceptions.py

```python
class ProwlerException(Exception):
    """Base exception for all Prowler SDK errors."""

    ERROR_CODES = {
        (1901, "UnexpectedError"): {
            "message": "Unexpected error occurred.",
            "remediation": "Please review the error message and try again.",
        }
    }

    def __init__(
        self, code, source=None, file=None, original_exception=None, error_info=None
    ):
        """
        Initialize the ProwlerException class.

        Args:
            code (int): The error code.
            source (str): The source name. This can be the provider name, module name, service name, etc.
            file (str): The file name.
            original_exception (Exception): The original exception.
            error_info (dict): The error information.

        Example:
            A ProwlerException is raised with the following parameters and format:
            >>> original_exception = Exception("Error occurred.")
            ProwlerException(1901, "AWS", "file.txt", original_exception)
            >>> [1901] Unexpected error occurred. - Exception: Error occurred.
        """
        self.code = code
        self.source = source
        self.file = file
        if error_info is None:
            error_info = self.ERROR_CODES.get((code, self.__class__.__name__))
        self.message = error_info.get("message")
        self.remediation = error_info.get("remediation")
        self.original_exception = original_exception
        # Format -> [code] message - original_exception
        if original_exception is None:
            super().__init__(f"[{self.code}] {self.message}")
        else:
            super().__init__(
                f"[{self.code}] {self.message} - {self.original_exception}"
            )

    def __str__(self):
        """Overriding the __str__ method"""
        default_str = f"{self.__class__.__name__}[{self.code}]: {self.message}"
        if self.original_exception:
            default_str += f" - {self.original_exception}"
        return default_str


class UnexpectedError(ProwlerException):
    def __init__(self, source, file, original_exception=None):
        super().__init__(1901, source, file, original_exception)
```

--------------------------------------------------------------------------------

---[FILE: banner.py]---
Location: prowler-master/prowler/lib/banner.py

```python
from colorama import Fore, Style

from prowler.config.config import banner_color, orange_color, prowler_version, timestamp


def print_banner(legend: bool = False):
    """
    Prints the banner with optional legend for color codes.

    Parameters:
    - legend (bool): Flag to indicate whether to print the color legend or not. Default is False.

    Returns:
    - None
    """
    banner = rf"""{banner_color}                         _
 _ __  _ __ _____      _| | ___ _ __
| '_ \| '__/ _ \ \ /\ / / |/ _ \ '__|
| |_) | | | (_) \ V  V /| |  __/ |
| .__/|_|  \___/ \_/\_/ |_|\___|_|v{prowler_version}
|_|{Fore.BLUE} the handy multi-cloud security tool

{Fore.YELLOW}Date: {timestamp.strftime("%Y-%m-%d %H:%M:%S")}{Style.RESET_ALL}
"""
    print(banner)

    if legend:
        print(
            f"""
{Style.BRIGHT}Color code for results:{Style.RESET_ALL}
- {Fore.YELLOW}MANUAL (Manual check){Style.RESET_ALL}
- {Fore.GREEN}PASS (Recommended value){Style.RESET_ALL}
- {orange_color}MUTED (Muted by muted list){Style.RESET_ALL}
- {Fore.RED}FAIL (Fix required){Style.RESET_ALL}
            """
        )
```

--------------------------------------------------------------------------------

---[FILE: logger.py]---
Location: prowler-master/prowler/lib/logger.py

```python
import logging
from os import environ

# Logging levels
logging_levels = {
    "CRITICAL": logging.CRITICAL,
    "ERROR": logging.ERROR,
    "WARNING": logging.WARNING,
    "INFO": logging.INFO,
    "DEBUG": logging.DEBUG,
}


def set_logging_config(log_level: str, log_file: str = None, only_logs: bool = False):
    # Logs formatter
    stream_formatter = logging.Formatter(
        "\n%(asctime)s [File: %(filename)s:%(lineno)d] \t[Module: %(module)s]\t %(levelname)s: %(message)s"
    )
    log_file_formatter = logging.Formatter(
        '{"timestamp": "%(asctime)s", "filename": "%(filename)s:%(lineno)d", "level": "%(levelname)s", "module": "%(module)s", "message": "%(message)s"}'
    )

    # Where to put logs
    logging_handlers = []

    # Include stdout by default, if only_logs is set the log format is JSON
    stream_handler = logging.StreamHandler()
    if only_logs:
        stream_handler.setFormatter(log_file_formatter)
    else:
        stream_handler.setFormatter(stream_formatter)
    logging_handlers.append(stream_handler)

    # Log to file configuration
    if log_file:
        # Set log to file handler
        log_file_handler = logging.FileHandler(log_file)
        log_file_handler.setFormatter(log_file_formatter)
        # Append the log formatter
        logging_handlers.append(log_file_handler)

    # Set Log Level, environment takes precedence over the --log-level argument
    try:
        log_level = environ["LOG_LEVEL"]
    except KeyError:
        log_level = log_level

    # Configure Logger
    # Initialize you log configuration using the base class
    # https://docs.python.org/3/library/logging.html#logrecord-attributes
    logging.basicConfig(
        level=logging_levels.get(log_level),
        handlers=logging_handlers,
        datefmt="%m/%d/%Y %I:%M:%S %p",
    )


# Retrieve the logger instance
logger = logging.getLogger()
```

--------------------------------------------------------------------------------

````
