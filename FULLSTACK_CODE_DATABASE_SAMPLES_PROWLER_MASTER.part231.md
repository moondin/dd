---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 231
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 231 of 867)

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

---[FILE: config.py]---
Location: prowler-master/prowler/providers/aws/config.py

```python
AWS_STS_GLOBAL_ENDPOINT_REGION = "us-east-1"
AWS_REGION_US_EAST_1 = "us-east-1"
BOTO3_USER_AGENT_EXTRA = "APN_1826889"
ROLE_SESSION_NAME = "ProwlerAssessmentSession"
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/providers/aws/models.py

```python
from dataclasses import dataclass
from datetime import datetime
from enum import Enum

from boto3.session import Session
from botocore.config import Config

from prowler.config.config import output_file_timestamp
from prowler.providers.aws.config import AWS_STS_GLOBAL_ENDPOINT_REGION
from prowler.providers.aws.lib.arn.models import ARN
from prowler.providers.common.models import ProviderOutputOptions


@dataclass
class AWSOrganizationsInfo:
    account_email: str
    account_name: str
    organization_account_arn: str
    organization_arn: str
    organization_id: str
    account_tags: list[str]


@dataclass
class AWSCredentials:
    aws_access_key_id: str
    aws_session_token: str
    aws_secret_access_key: str
    expiration: datetime


@dataclass
class AWSAssumeRoleInfo:
    role_arn: ARN
    session_duration: int
    external_id: str
    mfa_enabled: bool
    role_session_name: str
    sts_region: str = AWS_STS_GLOBAL_ENDPOINT_REGION


@dataclass
class AWSAssumeRoleConfiguration:
    info: AWSAssumeRoleInfo
    credentials: AWSCredentials


@dataclass
class AWSIdentityInfo:
    account: str
    account_arn: str
    user_id: str
    partition: str
    identity_arn: str
    profile: str
    profile_region: str
    audited_regions: set


@dataclass
class AWSSession:
    """
    AWSSession stores the AWS session's configuration. We store the original_session in the case we need to setup a new one with different credentials and the restore to the original one.

    """

    current_session: Session
    original_session: Session
    session_config: Config


@dataclass
class AWSCallerIdentity:
    user_id: str
    account: str
    arn: ARN
    region: str


@dataclass
class AWSMFAInfo:
    arn: str
    totp: str


class Partition(str, Enum):
    """
    Enum class representing different AWS partitions.

    Attributes:
        aws (str): Represents the standard AWS commercial regions.
        aws_cn (str): Represents the AWS China regions.
        aws_us_gov (str): Represents the AWS GovCloud (US) Regions.
        aws_iso (str): Represents the AWS ISO (US) Regions.
        aws_iso_b (str): Represents the AWS ISOB (US) Regions.
        aws_iso_e (str): Represents the AWS ISOE (Europe) Regions.
        aws_iso_f (str): Represents the AWS ISOF Regions.
    """

    aws = "aws"
    aws_cn = "aws-cn"
    aws_us_gov = "aws-us-gov"
    aws_iso = "aws-iso"
    aws_iso_b = "aws-iso-b"
    aws_iso_e = "aws-iso-e"
    aws_iso_f = "aws-iso-f"


class AWSOutputOptions(ProviderOutputOptions):
    security_hub_enabled: bool

    def __init__(self, arguments, bulk_checks_metadata, identity):
        # First call Provider_Output_Options init
        super().__init__(arguments, bulk_checks_metadata)

        # Check if custom output filename was input, if not, set the default
        if (
            not hasattr(arguments, "output_filename")
            or arguments.output_filename is None
        ):
            self.output_filename = (
                f"prowler-output-{identity.account}-{output_file_timestamp}"
            )
        else:
            self.output_filename = arguments.output_filename

        # Security Hub Outputs
        self.security_hub_enabled = arguments.security_hub
        self.send_sh_only_fails = arguments.send_sh_only_fails
        if arguments.security_hub:
            if not self.output_modes:
                self.output_modes = ["json-asff"]
            else:
                self.output_modes.append("json-asff")
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: prowler-master/prowler/providers/aws/exceptions/exceptions.py

```python
from prowler.exceptions.exceptions import ProwlerException


# Exceptions codes from 1000 to 1999 are reserved for AWS exceptions
class AWSBaseException(ProwlerException):
    """Base class for AWS errors."""

    AWS_ERROR_CODES = {
        (1000, "AWSClientError"): {
            "message": "AWS ClientError occurred",
            "remediation": "Check your AWS client configuration and permissions.",
        },
        (1001, "AWSProfileNotFoundError"): {
            "message": "AWS Profile not found",
            "remediation": "Ensure the AWS profile is correctly configured, please visit https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-files.html",
        },
        (1002, "AWSNoCredentialsError"): {
            "message": "No AWS credentials found",
            "remediation": "Verify that AWS credentials are properly set up, please visit https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/aws/authentication/ and https://docs.aws.amazon.com/cli/v1/userguide/cli-chap-configure.html",
        },
        (1003, "AWSArgumentTypeValidationError"): {
            "message": "AWS argument type validation error",
            "remediation": "Check the provided argument types specific to AWS and ensure they meet the required format. For session duration check: https://docs.aws.amazon.com/singlesignon/latest/userguide/howtosessionduration.html and for role session name check: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#iam-term-role-session-name",
        },
        (1004, "AWSSetUpSessionError"): {
            "message": "AWS session setup error",
            "remediation": "Check the AWS session setup and ensure it is properly configured, please visit https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html and check if the provided profile has the necessary permissions.",
        },
        (1005, "AWSIAMRoleARNRegionNotEmtpyError"): {
            "message": "AWS IAM Role ARN region is not empty",
            "remediation": "Check the AWS IAM Role ARN region and ensure it is empty, visit https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-arns for more information.",
        },
        (1006, "AWSIAMRoleARNPartitionEmptyError"): {
            "message": "AWS IAM Role ARN partition is empty",
            "remediation": "Check the AWS IAM Role ARN partition and ensure it is not empty, visit https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-arns for more information.",
        },
        (1007, "AWSIAMRoleARNMissingFieldsError"): {
            "message": "AWS IAM Role ARN missing fields",
            "remediation": "Check the AWS IAM Role ARN and ensure all required fields are present, visit https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-arns for more information.",
        },
        (1008, "AWSIAMRoleARNServiceNotIAMnorSTSError"): {
            "message": "AWS IAM Role ARN service is not IAM nor STS",
            "remediation": "Check the AWS IAM Role ARN service and ensure it is either IAM or STS, visit https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-arns for more information.",
        },
        (1009, "AWSIAMRoleARNInvalidAccountIDError"): {
            "message": "AWS IAM Role ARN account ID is invalid",
            "remediation": "Check the AWS IAM Role ARN account ID and ensure it is a valid 12-digit number, visit https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-arns for more information.",
        },
        (1010, "AWSIAMRoleARNInvalidResourceTypeError"): {
            "message": "AWS IAM Role ARN resource type is invalid",
            "remediation": "Check the AWS IAM Role ARN resource type and ensure it is valid, resources types are: role, user, assumed-role, root, federated-user, visit https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-arns for more information.",
        },
        (1011, "AWSIAMRoleARNEmptyResourceError"): {
            "message": "AWS IAM Role ARN resource is empty",
            "remediation": "Check the AWS IAM Role ARN resource and ensure it is not empty, visit https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-arns for more information.",
        },
        (1012, "AWSAssumeRoleError"): {
            "message": "AWS assume role error",
            "remediation": "Check the AWS assume role configuration and ensure it is properly set up, please visit https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/aws/role-assumption/ and https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#iam-term-role-session-name",
        },
        (1013, "AWSAccessKeyIDInvalidError"): {
            "message": "AWS Access Key ID or Session Token is invalid",
            "remediation": "Check your AWS Access Key ID or Session Token and ensure it is valid.",
        },
        (1014, "AWSSecretAccessKeyInvalidError"): {
            "message": "AWS Secret Access Key is invalid",
            "remediation": "Check your AWS Secret Access Key and signing method and ensure it is valid.",
        },
        (1015, "AWSInvalidProviderIdError"): {
            "message": "The provided AWS credentials belong to a different account",
            "remediation": "Check the provided AWS credentials and review if belong to the account you want to use.",
        },
        (1016, "AWSSessionTokenExpiredError"): {
            "message": "The provided AWS Session Token is expired",
            "remediation": "Get a new AWS Session Token and configure it for the provider.",
        },
        (1917, "AWSInvalidPartitionError"): {
            "message": "The provided AWS partition is invalid",
            "remediation": "Check the provided AWS partition and ensure it is valid.",
        },
    }

    def __init__(self, code, file=None, original_exception=None, message=None):
        error_info = self.AWS_ERROR_CODES.get((code, self.__class__.__name__))
        if message:
            error_info["message"] = message
        super().__init__(
            code,
            source="AWS",
            file=file,
            original_exception=original_exception,
            error_info=error_info,
        )


class AWSCredentialsError(AWSBaseException):
    """Base class for AWS credentials errors."""

    def __init__(self, code, file=None, original_exception=None, message=None):
        super().__init__(code, file, original_exception, message)


class AWSClientError(AWSCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1000, file=file, original_exception=original_exception, message=message
        )


class AWSProfileNotFoundError(AWSCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1001, file=file, original_exception=original_exception, message=message
        )


class AWSNoCredentialsError(AWSCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1002, file=file, original_exception=original_exception, message=message
        )


class AWSArgumentTypeValidationError(AWSBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1003, file=file, original_exception=original_exception, message=message
        )


class AWSSetUpSessionError(AWSBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1004, file=file, original_exception=original_exception, message=message
        )


class AWSRoleArnError(AWSBaseException):
    """Base class for AWS role ARN errors."""

    def __init__(self, code, file=None, original_exception=None, message=None):
        super().__init__(code, file, original_exception, message)


class AWSIAMRoleARNRegionNotEmtpyError(AWSRoleArnError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1005, file=file, original_exception=original_exception, message=message
        )


class AWSIAMRoleARNPartitionEmptyError(AWSRoleArnError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1006, file=file, original_exception=original_exception, message=message
        )


class AWSIAMRoleARNMissingFieldsError(AWSRoleArnError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1007, file=file, original_exception=original_exception, message=message
        )


class AWSIAMRoleARNServiceNotIAMnorSTSError(AWSRoleArnError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1008, file=file, original_exception=original_exception, message=message
        )


class AWSIAMRoleARNInvalidAccountIDError(AWSRoleArnError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1009, file=file, original_exception=original_exception, message=message
        )


class AWSIAMRoleARNInvalidResourceTypeError(AWSRoleArnError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1010, file=file, original_exception=original_exception, message=message
        )


class AWSIAMRoleARNEmptyResourceError(AWSRoleArnError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1011, file=file, original_exception=original_exception, message=message
        )


class AWSAssumeRoleError(AWSBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1012, file=file, original_exception=original_exception, message=message
        )


class AWSAccessKeyIDInvalidError(AWSCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1013, file=file, original_exception=original_exception, message=message
        )


class AWSSecretAccessKeyInvalidError(AWSCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1014, file=file, original_exception=original_exception, message=message
        )


class AWSInvalidProviderIdError(AWSCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1015, file=file, original_exception=original_exception, message=message
        )


class AWSSessionTokenExpiredError(AWSCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1016, file=file, original_exception=original_exception, message=message
        )


class AWSInvalidPartitionError(AWSBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            1917, file=file, original_exception=original_exception, message=message
        )
```

--------------------------------------------------------------------------------

---[FILE: arguments.py]---
Location: prowler-master/prowler/providers/aws/lib/arguments/arguments.py

```python
from argparse import ArgumentTypeError, Namespace
from re import fullmatch, search

from prowler.providers.aws.aws_provider import AwsProvider
from prowler.providers.aws.config import ROLE_SESSION_NAME
from prowler.providers.aws.lib.arn.arn import arn_type


def init_parser(self):
    """Init the AWS Provider CLI parser"""
    aws_parser = self.subparsers.add_parser(
        "aws", parents=[self.common_providers_parser], help="AWS Provider"
    )
    # Authentication Methods
    aws_auth_subparser = aws_parser.add_argument_group("Authentication Modes")
    aws_auth_subparser.add_argument(
        "--profile",
        "-p",
        nargs="?",
        default=None,
        help="AWS profile to launch prowler with",
    )
    aws_auth_subparser.add_argument(
        "--role",
        "-R",
        nargs="?",
        default=None,
        help="ARN of the role to be assumed",
        # TODO: Pending ARN validation
    )
    aws_auth_subparser.add_argument(
        "--role-session-name",
        nargs="?",
        default=ROLE_SESSION_NAME,
        help="An identifier for the assumed role session. Defaults to ProwlerAssessmentSession",
        type=validate_role_session_name,
    )
    aws_auth_subparser.add_argument(
        "--mfa",
        action="store_true",
        help="IAM entity enforces MFA so you need to input the MFA ARN and the TOTP",
    )
    aws_auth_subparser.add_argument(
        "--session-duration",
        "-T",
        nargs="?",
        default=3600,
        type=validate_session_duration,
        help="Assumed role session duration in seconds, must be between 900 and 43200. Default: 3600",
        # TODO: Pending session duration validation
    )
    aws_auth_subparser.add_argument(
        "--external-id",
        "-I",
        nargs="?",
        default=None,
        help="External ID to be passed when assuming role",
    )
    # AWS Regions
    aws_regions_subparser = aws_parser.add_argument_group("AWS Regions")
    aws_regions_subparser.add_argument(
        "--region",
        "--filter-region",
        "-f",
        nargs="+",
        help="AWS region names to run Prowler against",
        choices=AwsProvider.get_regions(partition=None),
    )
    # AWS Organizations
    aws_orgs_subparser = aws_parser.add_argument_group("AWS Organizations")
    aws_orgs_subparser.add_argument(
        "--organizations-role",
        "-O",
        nargs="?",
        help="Specify AWS Organizations management role ARN to be assumed, to get Organization metadata",
    )
    # AWS Security Hub
    aws_security_hub_subparser = aws_parser.add_argument_group("AWS Security Hub")
    aws_security_hub_subparser.add_argument(
        "--security-hub",
        "-S",
        action="store_true",
        help="Send check output to AWS Security Hub and save json-asff outuput.",
    )
    aws_security_hub_subparser.add_argument(
        "--skip-sh-update",
        action="store_true",
        help="Skip updating previous findings of Prowler in Security Hub",
    )
    aws_security_hub_subparser.add_argument(
        "--send-sh-only-fails",
        action="store_true",
        help="Send only Prowler failed findings to SecurityHub",
    )
    # AWS Quick Inventory
    aws_quick_inventory_subparser = aws_parser.add_argument_group("Quick Inventory")
    aws_quick_inventory_subparser.add_argument(
        "--quick-inventory",
        "-i",
        action="store_true",
        help="Run Prowler Quick Inventory. The inventory will be stored in an output csv by default",
    )
    # AWS Outputs
    aws_outputs_subparser = aws_parser.add_argument_group("AWS Outputs to S3")
    aws_outputs_bucket_parser = aws_outputs_subparser.add_mutually_exclusive_group()
    aws_outputs_bucket_parser.add_argument(
        "--output-bucket",
        "-B",
        nargs="?",
        type=validate_bucket,
        default=None,
        help="Custom output bucket, requires -M <mode> and it can work also with -o flag.",
    )
    aws_outputs_bucket_parser.add_argument(
        "--output-bucket-no-assume",
        "-D",
        nargs="?",
        type=validate_bucket,
        default=None,
        help="Same as -B but do not use the assumed role credentials to put objects to the bucket, instead uses the initial credentials.",
    )

    # Based Scans
    aws_based_scans_subparser = aws_parser.add_argument_group("AWS Based Scans")
    aws_based_scans_parser = aws_based_scans_subparser.add_mutually_exclusive_group()
    aws_based_scans_parser.add_argument(
        "--resource-tag",
        "--resource-tags",
        nargs="+",
        default=None,
        help="Scan only resources with specific AWS Tags (Key=Value), e.g., Environment=dev Project=prowler",
    )
    aws_based_scans_parser.add_argument(
        "--resource-arn",
        "--resource-arns",
        nargs="+",
        type=arn_type,
        default=None,
        help="Scan only resources with specific AWS Resource ARNs, e.g., arn:aws:iam::012345678910:user/test arn:aws:ec2:us-east-1:123456789012:vpc/vpc-12345678",
    )

    # Boto3 Config
    boto3_config_subparser = aws_parser.add_argument_group("Boto3 Config")
    boto3_config_subparser.add_argument(
        "--aws-retries-max-attempts",
        nargs="?",
        default=None,
        type=int,
        help="Set the maximum attemps for the Boto3 standard retrier config (Default: 3)",
    )

    # Scan Unused Services
    scan_unused_services_subparser = aws_parser.add_argument_group(
        "Scan Unused Services"
    )
    scan_unused_services_subparser.add_argument(
        "--scan-unused-services",
        action="store_true",
        help="Scan unused services",
    )

    # Prowler Fixer
    prowler_fixer_subparser = aws_parser.add_argument_group("Prowler Fixer")
    prowler_fixer_subparser.add_argument(
        "--fixer",
        action="store_true",
        help="Fix the failed findings that can be fixed by Prowler",
    )


def validate_session_duration(session_duration: int) -> int:
    """validate_session_duration validates that the input session_duration is valid"""
    duration = int(session_duration)
    # Since the range(i,j) goes from i to j-1 we have to j+1
    if duration not in range(900, 43201):
        raise ArgumentTypeError(
            "Session duration must be between 900 and 43200 seconds"
        )
    else:
        return duration


def validate_role_session_name(session_name) -> str:
    """
    Validates that the role session name is valid.

    Args:
        session_name (str): The role session name to be validated.

    Returns:
        str: The validated role session name.

    Raises:
        ArgumentTypeError: If the role session name is invalid.

    Documentation:
        - AWS STS AssumeRole API: https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html
    """
    if fullmatch(r"[\w+=,.@-]{2,64}", session_name):
        return session_name
    else:
        raise ArgumentTypeError(
            "Role session name must be between 2 and 64 characters long and may contain alphanumeric characters, hyphens, underscores, plus signs, equal signs, commas, periods, at signs, and tildes."
        )


def validate_arguments(arguments: Namespace) -> tuple[bool, str]:
    """validate_arguments returns {True, "} if the provider arguments passed are valid and can be used together. It performs an extra validation, specific for the AWS provider, apart from the argparse lib."""

    # Handle if session_duration is not the default value or external_id is set
    if (
        (arguments.session_duration and arguments.session_duration != 3600)
        or arguments.external_id
        or arguments.role_session_name != ROLE_SESSION_NAME
    ):
        if not arguments.role:
            return (
                False,
                "To use -I/--external-id, -T/--session-duration or --role-session-name options -R/--role option is needed",
            )

    return (True, "")


def validate_bucket(bucket_name: str) -> str:
    """validate_bucket validates that the input bucket_name is valid"""
    if search(
        "^(?!^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$)(?!.*\.{2})(?!.*\.-)(?!.*-\.)(?!^xn--)(?!^sthree-)(?!^amzn-s3-demo-)(?!.*--table-s3$)[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$",
        bucket_name,
    ):
        return bucket_name
    else:
        raise ArgumentTypeError(
            "Bucket name must be valid (https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html)"
        )
```

--------------------------------------------------------------------------------

---[FILE: arn.py]---
Location: prowler-master/prowler/providers/aws/lib/arn/arn.py

```python
import os
import re
from argparse import ArgumentTypeError

from prowler.providers.aws.exceptions.exceptions import (
    AWSIAMRoleARNEmptyResourceError,
    AWSIAMRoleARNInvalidAccountIDError,
    AWSIAMRoleARNInvalidResourceTypeError,
    AWSIAMRoleARNPartitionEmptyError,
    AWSIAMRoleARNRegionNotEmtpyError,
    AWSIAMRoleARNServiceNotIAMnorSTSError,
)
from prowler.providers.aws.lib.arn.models import ARN


def arn_type(arn: str) -> bool:
    """arn_type returns a string ARN if it is valid and raises an argparse.ArgumentError if not."""
    if not is_valid_arn(arn):
        raise ArgumentTypeError(f"Invalid ARN {arn}")
    return arn


# TODO: review this function just to parse the ARN not to re-instantiate it
def parse_iam_credentials_arn(arn: str) -> ARN:
    arn_parsed = ARN(arn)
    # First check if region is empty (in IAM ARN's region is always empty)
    if arn_parsed.region:
        raise AWSIAMRoleARNRegionNotEmtpyError(file=os.path.basename(__file__))
    else:
        # check if needed fields are filled:
        # - partition
        # - service
        # - account_id
        # - resource_type
        # - resource
        if arn_parsed.partition is None or arn_parsed.partition == "":
            raise AWSIAMRoleARNPartitionEmptyError(file=os.path.basename(__file__))
        elif arn_parsed.service != "iam" and arn_parsed.service != "sts":
            raise AWSIAMRoleARNServiceNotIAMnorSTSError(file=os.path.basename(__file__))
        elif (
            arn_parsed.account_id is None
            or len(arn_parsed.account_id) != 12
            or not arn_parsed.account_id.isnumeric()
        ):
            raise AWSIAMRoleARNInvalidAccountIDError(file=os.path.basename(__file__))
        elif (
            arn_parsed.resource_type != "role"
            and arn_parsed.resource_type != "user"
            and arn_parsed.resource_type != "assumed-role"
            and arn_parsed.resource_type != "root"
            and arn_parsed.resource_type != "federated-user"
        ):
            raise AWSIAMRoleARNInvalidResourceTypeError(file=os.path.basename(__file__))
        elif arn_parsed.resource == "":
            raise AWSIAMRoleARNEmptyResourceError(file=os.path.basename(__file__))
        else:
            return arn_parsed


def is_valid_arn(arn: str) -> bool:
    """is_valid_arn returns True or False whether the given AWS ARN (Amazon Resource Name) is valid or not."""
    regex = r"^arn:aws(-cn|-us-gov|-iso|-iso-b)?:[a-zA-Z0-9\-]+:([a-z]{2}-[a-z]+-\d{1})?:(\d{12})?:[a-zA-Z0-9\-_\/:\.\*]+(:\d+)?$"
    return re.match(regex, arn) is not None
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/providers/aws/lib/arn/models.py
Signals: Pydantic

```python
import os
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.providers.aws.exceptions.exceptions import AWSIAMRoleARNMissingFieldsError


class ARN(BaseModel):
    arn: str
    partition: str
    service: str
    region: Optional[str] = None  # In IAM ARN's do not have region
    account_id: str
    resource: str
    resource_type: str

    def __init__(self, arn):
        # Validate the ARN
        ## Check that arn starts with arn
        if not arn.startswith("arn:"):
            raise AWSIAMRoleARNMissingFieldsError(file=os.path.basename(__file__))
        ## Retrieve fields
        arn_elements = arn.split(":", 5)
        data = {
            "arn": arn,
            "partition": arn_elements[1],
            "service": arn_elements[2],
            "region": arn_elements[3] if arn_elements[3] != "" else None,
            "account_id": arn_elements[4],
            "resource": arn_elements[5],
            "resource_type": get_arn_resource_type(arn, arn_elements[2]),
        }
        if "/" in data["resource"]:
            data["resource"] = data["resource"].split("/", 1)[1]
        elif ":" in data["resource"]:
            data["resource"] = data["resource"].split(":", 1)[1]

        # Calls Pydantic's BaseModel __init__
        super().__init__(**data)


def get_arn_resource_type(arn, service):
    if service == "s3":
        resource_type = "bucket"
    elif service == "sns":
        resource_type = "topic"
    elif service == "sqs":
        resource_type = "queue"
    elif service == "apigateway":
        split_parts = arn.split(":")[5].split("/")
        if "integration" in split_parts and "responses" in split_parts:
            resource_type = "restapis-resources-methods-integration-response"
        elif "documentation" in split_parts and "parts" in split_parts:
            resource_type = "restapis-documentation-parts"
        else:
            resource_type = arn.split(":")[5].split("/")[1]
    else:
        resource_type = arn.split(":")[5].split("/")[0]
    return resource_type
```

--------------------------------------------------------------------------------

---[FILE: mutelist.py]---
Location: prowler-master/prowler/providers/aws/lib/mutelist/mutelist.py

```python
import re

import yaml
from boto3 import Session
from boto3.dynamodb.conditions import Attr

from prowler.lib.check.models import Check_Report_AWS
from prowler.lib.logger import logger
from prowler.lib.mutelist.mutelist import Mutelist
from prowler.lib.outputs.utils import unroll_dict, unroll_tags


class AWSMutelist(Mutelist):
    def __init__(
        self,
        mutelist_content: dict = {},
        mutelist_path: str = None,
        session: Session = None,
        aws_account_id: str = "",
    ) -> "AWSMutelist":
        self._mutelist = mutelist_content
        self._mutelist_file_path = mutelist_path
        if mutelist_path:
            # Mutelist from S3 URI
            if re.search("^s3://([^/]+)/(.*?([^/]+))$", self._mutelist_file_path):
                self._mutelist = self.get_mutelist_file_from_s3(session)
            # Mutelist from Lambda Function ARN
            elif re.search(r"^arn:(\w+):lambda:", self._mutelist_file_path):
                self._mutelist = self.get_mutelist_file_from_lambda(
                    session,
                )
            # Mutelist from DynamoDB ARN
            elif re.search(
                r"^arn:aws(-cn|-us-gov)?:dynamodb:[a-z]{2}-[a-z-]+-[1-9]{1}:[0-9]{12}:table\/[a-zA-Z0-9._-]+$",
                self._mutelist_file_path,
            ):
                self._mutelist = self.get_mutelist_file_from_dynamodb(
                    session,
                    aws_account_id,
                )
            else:
                self.get_mutelist_file_from_local_file(mutelist_path)
        if self._mutelist:
            self._mutelist = self.validate_mutelist(self._mutelist)

    def is_finding_muted(
        self,
        finding: Check_Report_AWS,
        aws_account_id: str,
    ) -> bool:
        return self.is_muted(
            aws_account_id,
            finding.check_metadata.CheckID,
            finding.region,
            finding.resource_id,
            unroll_dict(unroll_tags(finding.resource_tags)),
        )

    def get_mutelist_file_from_s3(self, aws_session: Session = None):
        try:
            bucket = self._mutelist_file_path.split("/")[2]
            key = ("/").join(self._mutelist_file_path.split("/")[3:])
            s3_client = aws_session.client("s3")
            mutelist = yaml.safe_load(
                s3_client.get_object(Bucket=bucket, Key=key)["Body"]
            )["Mutelist"]
            return mutelist
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__} -- {error}[{error.__traceback__.tb_lineno}]"
            )
            return {}

    def get_mutelist_file_from_lambda(self, aws_session: Session = None):
        try:
            lambda_region = self._mutelist_file_path.split(":")[3]
            lambda_client = aws_session.client("lambda", region_name=lambda_region)
            lambda_response = lambda_client.invoke(
                FunctionName=self._mutelist_file_path, InvocationType="RequestResponse"
            )
            lambda_payload = lambda_response["Payload"].read()
            mutelist = yaml.safe_load(lambda_payload)["Mutelist"]

            return mutelist
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__} -- {error}[{error.__traceback__.tb_lineno}]"
            )
            return {}

    def get_mutelist_file_from_dynamodb(
        self, aws_session: Session = None, aws_account: str = None
    ):
        try:
            mutelist = {"Accounts": {}}
            table_region = self._mutelist_file_path.split(":")[3]
            dynamodb_resource = aws_session.resource(
                "dynamodb", region_name=table_region
            )
            dynamo_table = dynamodb_resource.Table(
                self._mutelist_file_path.split("/")[1]
            )
            response = dynamo_table.scan(
                FilterExpression=Attr("Accounts").is_in([aws_account, "*"])
            )
            dynamodb_items = response["Items"]
            # Paginate through all results
            while "LastEvaluatedKey" in dynamodb_items:
                response = dynamo_table.scan(
                    ExclusiveStartKey=response["LastEvaluatedKey"],
                    FilterExpression=Attr("Accounts").is_in([aws_account, "*"]),
                )
                dynamodb_items.update(response["Items"])
            for item in dynamodb_items:
                # Create mutelist for every item
                mutelist["Accounts"][item["Accounts"]] = {
                    "Checks": {
                        item["Checks"]: {
                            "Regions": item["Regions"],
                            "Resources": item["Resources"],
                        }
                    }
                }
                if "Tags" in item:
                    mutelist["Accounts"][item["Accounts"]]["Checks"][item["Checks"]][
                        "Tags"
                    ] = item["Tags"]
                if "Exceptions" in item:
                    mutelist["Accounts"][item["Accounts"]]["Checks"][item["Checks"]][
                        "Exceptions"
                    ] = item["Exceptions"]
                return mutelist
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__} -- {error}[{error.__traceback__.tb_lineno}]"
            )
            return {}
```

--------------------------------------------------------------------------------

---[FILE: organizations.py]---
Location: prowler-master/prowler/providers/aws/lib/organizations/organizations.py

```python
from boto3 import session

from prowler.lib.logger import logger
from prowler.providers.aws.lib.arn.models import ARN
from prowler.providers.aws.models import AWSOrganizationsInfo


def get_organizations_metadata(
    aws_account_id: str,
    session: session.Session,
) -> tuple[dict, dict]:
    try:
        organizations_client = session.client("organizations")

        organizations_metadata = organizations_client.describe_account(
            AccountId=aws_account_id
        )
        list_tags_for_resource = organizations_client.list_tags_for_resource(
            ResourceId=aws_account_id
        )

        return organizations_metadata, list_tags_for_resource
    except Exception as error:
        logger.warning(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return {}, {}


def parse_organizations_metadata(metadata: dict, tags: dict) -> AWSOrganizationsInfo:
    try:
        # Convert Tags dictionary to String
        account_details_tags = {}
        for tag in tags.get("Tags", {}):
            account_details_tags[tag["Key"]] = tag["Value"]

        account_details = metadata.get("Account", {})

        aws_account_arn = ARN(account_details.get("Arn", ""))
        aws_organization_id = aws_account_arn.resource.split("/")[0]
        aws_organization_arn = f"arn:{aws_account_arn.partition}:organizations::{aws_account_arn.account_id}:organization/{aws_organization_id}"

        return AWSOrganizationsInfo(
            account_email=account_details.get("Email", ""),
            account_name=account_details.get("Name", ""),
            organization_account_arn=aws_account_arn.arn,
            organization_arn=aws_organization_arn,
            organization_id=aws_organization_id,
            account_tags=account_details_tags,
        )
    except Exception as error:
        logger.warning(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
```

--------------------------------------------------------------------------------

````
