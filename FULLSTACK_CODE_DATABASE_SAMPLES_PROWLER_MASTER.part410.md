---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 410
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 410 of 867)

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

---[FILE: config_old.yaml]---
Location: prowler-master/tests/config/fixtures/config_old.yaml

```yaml
# AWS EC2 Configuration
# aws.ec2_elastic_ip_shodan
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

# AWS VPC Configuration (vpc_endpoint_connections_trust_boundaries, vpc_endpoint_services_allowed_principals_trust_boundaries)
# AWS SSM Configuration (aws.ssm_documents_set_as_public)
# Single account environment: No action required. The AWS account number will be automatically added by the checks.
# Multi account environment: Any additional trusted account number should be added as a space separated list, e.g.
# trusted_account_ids : ["123456789012", "098765432109", "678901234567"]
trusted_account_ids: []

# AWS Cloudwatch Configuration
# aws.cloudwatch_log_group_retention_policy_specific_days_enabled --> by default is 365 days
log_group_retention_days: 365

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
    "nodejs4.3",
    "nodejs4.3-edge",
    "nodejs6.10",
    "nodejs",
    "nodejs8.10",
    "nodejs10.x",
    "nodejs12.x",
    "nodejs14.x",
    "dotnet5.0",
    "dotnetcore1.0",
    "dotnetcore2.0",
    "dotnetcore2.1",
    "dotnetcore3.1",
    "ruby2.5",
    "ruby2.7",
  ]

# AWS Organizations
# organizations_scp_check_deny_regions
# organizations_enabled_regions: [
#   'eu-central-1',
#   'eu-west-1',
#   "us-east-1"
# ]
organizations_enabled_regions: []
organizations_trusted_delegated_administrators: []

# aws.rds_instance_backup_enabled
# Whether to check RDS instance replicas or not
check_rds_instance_replicas: False

# AWS ACM Configuration
# aws.acm_certificates_expiration_check
days_to_expire_threshold: 7

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
```

--------------------------------------------------------------------------------

---[FILE: fixer_config.yaml]---
Location: prowler-master/tests/config/fixtures/fixer_config.yaml

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
```

--------------------------------------------------------------------------------

---[FILE: prowler_wrapper_security_test.py]---
Location: prowler-master/tests/contrib/wazuh/prowler_wrapper_security_test.py

```python
#!/usr/bin/env python
"""
Security test for prowler-wrapper.py command injection vulnerability
This test demonstrates the command injection vulnerability and validates the fix
"""

import os
import shutil
import sys
import tempfile
import unittest
from unittest.mock import MagicMock, patch


class TestProwlerWrapperSecurity(unittest.TestCase):
    """Test cases for command injection vulnerability in prowler-wrapper.py"""

    def setUp(self):
        """Set up test environment"""
        # Create a temporary directory for testing
        self.test_dir = tempfile.mkdtemp()
        self.prowler_wrapper_path = os.path.join(
            os.path.dirname(
                os.path.dirname(
                    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                )
            ),
            "contrib",
            "wazuh",
            "prowler-wrapper.py",
        )

    def tearDown(self):
        """Clean up test environment"""
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def _import_prowler_wrapper(self):
        """Helper to import prowler_wrapper with mocked WAZUH_PATH"""
        sys.path.insert(0, os.path.dirname(self.prowler_wrapper_path))

        # Mock the WAZUH_PATH that's read at module level
        with patch("builtins.open", create=True) as mock_open:
            mock_open.return_value.readline.return_value = 'DIRECTORY="/opt/wazuh"'

            import importlib.util

            spec = importlib.util.spec_from_file_location(
                "prowler_wrapper", self.prowler_wrapper_path
            )
            prowler_wrapper = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(prowler_wrapper)
            return prowler_wrapper._run_prowler

    def test_command_injection_semicolon(self):
        """Test command injection using semicolon"""
        # Create a test file that should not be created if injection is prevented
        test_file = os.path.join(self.test_dir, "pwned.txt")

        # Malicious profile that attempts to create a file
        malicious_profile = f"test; touch {test_file}"

        # Mock the subprocess.Popen to capture the command
        with patch("subprocess.Popen") as mock_popen:
            mock_process = MagicMock()
            mock_process.communicate.return_value = (b"test output", None)
            mock_popen.return_value = mock_process

            # Import and run the vulnerable function
            _run_prowler = self._import_prowler_wrapper()

            # Run with malicious input
            _run_prowler(f'-p "{malicious_profile}" -V')

            # Check that Popen was called
            self.assertTrue(mock_popen.called)

            # Get the actual command that was passed to Popen
            actual_command = mock_popen.call_args[0][0]

            # With the fix, the command should be a list (from shlex.split)
            # and should NOT have shell=True
            self.assertIsInstance(
                actual_command, list, "Command should be a list after shlex.split"
            )

            # Check that shell=True is not in the call
            call_kwargs = mock_popen.call_args[1]
            self.assertNotIn(
                "shell",
                call_kwargs,
                "shell parameter should not be present (defaults to False)",
            )

    def test_command_injection_ampersand(self):
        """Test command injection using ampersand"""
        # Create a test file that should not be created if injection is prevented
        test_file = os.path.join(self.test_dir, "pwned2.txt")

        # Malicious profile that attempts to create a file
        malicious_profile = f"test && touch {test_file}"

        with patch("subprocess.Popen") as mock_popen:
            mock_process = MagicMock()
            mock_process.communicate.return_value = (b"test output", None)
            mock_popen.return_value = mock_process

            # Import and run the function
            _run_prowler = self._import_prowler_wrapper()

            # Run with malicious input
            _run_prowler(f'-p "{malicious_profile}" -V')

            # Get the actual command
            actual_command = mock_popen.call_args[0][0]

            # Verify it's a list (safe execution)
            self.assertIsInstance(actual_command, list)

            # The malicious characters should be preserved as part of the argument
            # not interpreted as shell commands
            command_str = " ".join(actual_command)
            self.assertIn(
                "&&",
                command_str,
                "Shell metacharacters should be preserved as literals",
            )

    def test_command_injection_pipe(self):
        """Test command injection using pipe"""
        malicious_profile = 'test | echo "injected"'

        with patch("subprocess.Popen") as mock_popen:
            mock_process = MagicMock()
            mock_process.communicate.return_value = (b"test output", None)
            mock_popen.return_value = mock_process

            # Import and run the function
            _run_prowler = self._import_prowler_wrapper()

            # Run with malicious input
            _run_prowler(f'-p "{malicious_profile}" -V')

            # Get the actual command
            actual_command = mock_popen.call_args[0][0]

            # Verify safe execution
            self.assertIsInstance(actual_command, list)

            # Pipe should be preserved as literal
            command_str = " ".join(actual_command)
            self.assertIn("|", command_str)

    def test_command_injection_backticks(self):
        """Test command injection using backticks"""
        malicious_profile = "test `echo injected`"

        with patch("subprocess.Popen") as mock_popen:
            mock_process = MagicMock()
            mock_process.communicate.return_value = (b"test output", None)
            mock_popen.return_value = mock_process

            # Import and run the function
            _run_prowler = self._import_prowler_wrapper()

            # Run with malicious input
            _run_prowler(f'-p "{malicious_profile}" -V')

            # Get the actual command
            actual_command = mock_popen.call_args[0][0]

            # Verify safe execution
            self.assertIsInstance(actual_command, list)

            # Backticks should be preserved as literals
            command_str = " ".join(actual_command)
            self.assertIn("`", command_str)

    def test_command_injection_dollar_parentheses(self):
        """Test command injection using $() syntax"""
        malicious_profile = "test $(echo injected)"

        with patch("subprocess.Popen") as mock_popen:
            mock_process = MagicMock()
            mock_process.communicate.return_value = (b"test output", None)
            mock_popen.return_value = mock_process

            # Import and run the function
            _run_prowler = self._import_prowler_wrapper()

            # Run with malicious input
            _run_prowler(f'-p "{malicious_profile}" -V')

            # Get the actual command
            actual_command = mock_popen.call_args[0][0]

            # Verify safe execution
            self.assertIsInstance(actual_command, list)

            # $() should be preserved as literals
            command_str = " ".join(actual_command)
            self.assertIn("$(", command_str)

    def test_legitimate_profile_name(self):
        """Test that legitimate profile names still work correctly"""
        legitimate_profile = "production-aws-profile"

        with patch("subprocess.Popen") as mock_popen:
            mock_process = MagicMock()
            mock_process.communicate.return_value = (b"test output", None)
            mock_popen.return_value = mock_process

            # Import and run the function
            _run_prowler = self._import_prowler_wrapper()

            # Run with legitimate input
            result = _run_prowler(f"-p {legitimate_profile} -V")

            # Verify the function returns output
            self.assertEqual(result, b"test output")

            # Verify Popen was called correctly
            actual_command = mock_popen.call_args[0][0]
            self.assertIsInstance(actual_command, list)

            # Check the profile is passed correctly
            command_str = " ".join(actual_command)
            self.assertIn(legitimate_profile, command_str)

    def test_shlex_split_behavior(self):
        """Test that shlex properly handles quoted arguments"""
        profile_with_spaces = "my profile name"

        with patch("subprocess.Popen") as mock_popen:
            mock_process = MagicMock()
            mock_process.communicate.return_value = (b"test output", None)
            mock_popen.return_value = mock_process

            # Import and run the function
            _run_prowler = self._import_prowler_wrapper()

            # Run with profile containing spaces
            _run_prowler(f'-p "{profile_with_spaces}" -V')

            # Get the actual command
            actual_command = mock_popen.call_args[0][0]

            # Verify it's properly split
            self.assertIsInstance(actual_command, list)

            # The profile name should be preserved as a single argument
            # despite containing spaces
            self.assertIn("my profile name", actual_command)


if __name__ == "__main__":
    unittest.main()
```

--------------------------------------------------------------------------------

---[FILE: check_loader_test.py]---
Location: prowler-master/tests/lib/check/check_loader_test.py

```python
import pytest
from mock import patch

from prowler.lib.check.checks_loader import (
    load_checks_to_execute,
    update_checks_to_execute_with_aliases,
)
from prowler.lib.check.compliance_models import Compliance, Compliance_Requirement
from prowler.lib.check.models import CheckMetadata, Code, Recommendation, Remediation

S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME = "s3_bucket_level_public_access_block"
S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME_CUSTOM_ALIAS = (
    "s3_bucket_level_public_access_block"
)
S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_SEVERITY = "medium"
S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME_SERVICE = "s3"

IAM_USER_NO_MFA_NAME = "iam_user_no_mfa"
IAM_USER_NO_MFA_NAME_CUSTOM_ALIAS = "iam_user_no_mfa"
IAM_USER_NO_MFA_NAME_SERVICE = "iam"
IAM_USER_NO_MFA_SEVERITY = "high"

CLOUDTRAIL_THREAT_DETECTION_ENUMERATION_NAME = "cloudtrail_threat_detection_enumeration"


class TestCheckLoader:
    provider = "aws"

    def get_custom_check_s3_metadata(self):
        return CheckMetadata(
            Provider="aws",
            CheckID=S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME,
            CheckTitle="Check S3 Bucket Level Public Access Block.",
            CheckType=["Data Protection"],
            CheckAliases=[S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME_CUSTOM_ALIAS],
            ServiceName=S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME_SERVICE,
            SubServiceName="",
            ResourceIdTemplate="arn:partition:s3:::bucket_name",
            Severity=S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_SEVERITY,
            ResourceType="AwsS3Bucket",
            Description="Check S3 Bucket Level Public Access Block.",
            Risk="Public access policies may be applied to sensitive data buckets.",
            RelatedUrl="https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html",
            Remediation=Remediation(
                Code=Code(
                    NativeIaC="",
                    Terraform="https://docs.prowler.com/checks/aws/s3-policies/bc_aws_s3_20#terraform",
                    CLI="aws s3api put-public-access-block --region <REGION_NAME> --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true --bucket <BUCKET_NAME>",
                    Other="https://github.com/cloudmatos/matos/tree/master/remediations/aws/s3/s3/block-public-access",
                ),
                Recommendation=Recommendation(
                    Text="You can enable Public Access Block at the bucket level to prevent the exposure of your data stored in S3.",
                    Url="https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html",
                ),
            ),
            Categories=["internet-exposed"],
            DependsOn=[],
            RelatedTo=[],
            Notes="",
            Compliance=[],
        )

    def get_custom_check_iam_metadata(self):
        return CheckMetadata(
            Provider="aws",
            CheckID=IAM_USER_NO_MFA_NAME,
            CheckTitle="Check IAM User No MFA.",
            CheckType=["Data Protection"],
            CheckAliases=[IAM_USER_NO_MFA_NAME_CUSTOM_ALIAS],
            ServiceName=IAM_USER_NO_MFA_NAME_SERVICE,
            SubServiceName="",
            ResourceIdTemplate="arn:partition:iam::account-id:user/user_name",
            Severity=IAM_USER_NO_MFA_SEVERITY,
            ResourceType="AwsIamUser",
            Description="Check IAM User No MFA.",
            Risk="IAM users should have Multi-Factor Authentication (MFA) enabled.",
            RelatedUrl="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html",
            Remediation=Remediation(
                Code=Code(
                    NativeIaC="",
                    Terraform="https://docs.prowler.com/checks/aws/iam-policies/bc_aws_iam_20#terraform",
                    CLI="aws iam create-virtual-mfa-device --user-name <USER_NAME> --serial-number <SERIAL_NUMBER>",
                    Other="https://github.com/cloudmatos/matos/tree/master/remediations/aws/iam/iam/enable-mfa",
                ),
                Recommendation=Recommendation(
                    Text="You can enable MFA for your IAM user to prevent unauthorized access to your AWS account.",
                    Url="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html",
                ),
            ),
            Categories=[],
            DependsOn=[],
            RelatedTo=[],
            Notes="",
            Compliance=[],
        )

    def get_threat_detection_check_metadata(self):
        return CheckMetadata(
            Provider="aws",
            CheckID=CLOUDTRAIL_THREAT_DETECTION_ENUMERATION_NAME,
            CheckTitle="Ensure there are no potential enumeration threats in CloudTrail",
            CheckType=[],
            ServiceName="cloudtrail",
            SubServiceName="",
            ResourceIdTemplate="arn:partition:service:region:account-id:resource-id",
            Severity="critical",
            ResourceType="AwsCloudTrailTrail",
            Description="This check ensures that there are no potential enumeration threats in CloudTrail.",
            Risk="Potential enumeration threats in CloudTrail can lead to unauthorized access to resources.",
            RelatedUrl="",
            Remediation=Remediation(
                Code=Code(CLI="", NativeIaC="", Other="", Terraform=""),
                Recommendation=Recommendation(
                    Text="To remediate this issue, ensure that there are no potential enumeration threats in CloudTrail.",
                    Url="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html#cloudtrail-concepts-logging-data-events",
                ),
            ),
            Categories=["threat-detection"],
            DependsOn=[],
            RelatedTo=[],
            Notes="",
            Compliance=[],
        )

    def test_load_checks_to_execute(self):
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }

        assert {S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME} == load_checks_to_execute(
            bulk_checks_metadata=bulk_checks_metatada,
            provider=self.provider,
        )

    def test_load_checks_to_execute_with_check_list(self):
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        check_list = [S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME]

        assert {S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME} == load_checks_to_execute(
            bulk_checks_metadata=bulk_checks_metatada,
            check_list=check_list,
            provider=self.provider,
        )

    def test_load_checks_to_execute_with_severities(self):
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        severities = [S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_SEVERITY]

        assert {S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME} == load_checks_to_execute(
            bulk_checks_metadata=bulk_checks_metatada,
            severities=severities,
            provider=self.provider,
        )

    def test_load_checks_to_execute_with_severities_and_services(self):
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        service_list = [S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME_SERVICE]
        severities = [S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_SEVERITY]

        assert {S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME} == load_checks_to_execute(
            bulk_checks_metadata=bulk_checks_metatada,
            service_list=service_list,
            severities=severities,
            provider=self.provider,
        )

    def test_load_checks_to_execute_with_severities_and_services_multiple(self):
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata(),
            IAM_USER_NO_MFA_NAME: self.get_custom_check_iam_metadata(),
        }
        service_list = ["s3", "iam"]
        severities = ["medium", "high"]

        assert {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME,
            IAM_USER_NO_MFA_NAME,
        } == load_checks_to_execute(
            bulk_checks_metadata=bulk_checks_metatada,
            service_list=service_list,
            severities=severities,
            provider=self.provider,
        )

    def test_load_checks_to_execute_with_severities_and_services_not_within_severity(
        self,
    ):
        """Test that service not in metadata causes sys.exit(1) when used with severities"""
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        service_list = ["ec2"]
        severities = [S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_SEVERITY]

        # ec2 service doesn't exist in the metadata, so it should exit with error
        with pytest.raises(SystemExit) as exc_info:
            load_checks_to_execute(
                bulk_checks_metadata=bulk_checks_metatada,
                service_list=service_list,
                severities=severities,
                provider=self.provider,
            )
        assert exc_info.value.code == 1

    def test_load_checks_to_execute_with_checks_file(
        self,
    ):
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        checks_file = "path/to/test_file"
        with patch(
            "prowler.lib.check.checks_loader.parse_checks_from_file",
            return_value={S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME},
        ):
            assert {S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME} == load_checks_to_execute(
                bulk_checks_metadata=bulk_checks_metatada,
                checks_file=checks_file,
                provider=self.provider,
            )

    def test_load_checks_to_execute_with_service_list(
        self,
    ):
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        service_list = [S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME_SERVICE]

        assert {S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME} == load_checks_to_execute(
            bulk_checks_metadata=bulk_checks_metatada,
            service_list=service_list,
            provider=self.provider,
        )

    def test_load_checks_to_execute_with_compliance_frameworks(
        self,
    ):
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        bulk_compliance_frameworks = {
            "soc2_aws": Compliance(
                Framework="SOC2",
                Name="SOC2",
                Provider="aws",
                Version="2.0",
                Description="This CIS Benchmark is the product of a community consensus process and consists of secure configuration guidelines developed for Azuee Platform",
                Requirements=[
                    Compliance_Requirement(
                        Checks=[S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME],
                        Id="",
                        Description="",
                        Attributes=[],
                    )
                ],
            ),
        }
        compliance_frameworks = ["soc2_aws"]

        assert {S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME} == load_checks_to_execute(
            bulk_checks_metadata=bulk_checks_metatada,
            bulk_compliance_frameworks=bulk_compliance_frameworks,
            compliance_frameworks=compliance_frameworks,
            provider=self.provider,
        )

    def test_load_checks_to_execute_with_categories(
        self,
    ):
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        categories = {"internet-exposed"}

        assert {S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME} == load_checks_to_execute(
            bulk_checks_metadata=bulk_checks_metatada,
            categories=categories,
            provider=self.provider,
        )

    def test_load_checks_to_execute_no_bulk_checks_metadata(self):
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        with patch(
            "prowler.lib.check.checks_loader.CheckMetadata.get_bulk",
            return_value=bulk_checks_metatada,
        ):
            assert {S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME} == load_checks_to_execute(
                provider=self.provider,
            )

    def test_load_checks_to_execute_no_bulk_compliance_frameworks(self):
        bulk_compliance_frameworks = {
            "soc2_aws": Compliance(
                Framework="SOC2",
                Name="SOC2",
                Provider="aws",
                Version="2.0",
                Description="This CIS Benchmark is the product of a community consensus process and consists of secure configuration guidelines developed for Azuee Platform",
                Requirements=[
                    Compliance_Requirement(
                        Checks=[S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME],
                        Id="",
                        Description="",
                        Attributes=[],
                    )
                ],
            ),
        }

        compliance_frameworks = ["soc2_aws"]

        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        with (
            patch(
                "prowler.lib.check.checks_loader.CheckMetadata.get_bulk",
                return_value=bulk_checks_metatada,
            ),
            patch(
                "prowler.lib.check.checks_loader.Compliance.get_bulk",
                return_value=bulk_compliance_frameworks,
            ),
        ):
            assert {S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME} == load_checks_to_execute(
                compliance_frameworks=compliance_frameworks,
                provider=self.provider,
            )

    def test_update_checks_to_execute_with_aliases(self):
        checks_to_execute = {"renamed_check"}
        check_aliases = {"renamed_check": ["check_name"]}
        assert {"check_name"} == update_checks_to_execute_with_aliases(
            checks_to_execute, check_aliases
        )

    def test_update_checks_to_execute_with_multiple_aliases(self):
        checks_to_execute = {"renamed_check"}
        check_aliases = {"renamed_check": ["check1_name", "check2_name"]}
        assert {"check1_name", "check2_name"} == update_checks_to_execute_with_aliases(
            checks_to_execute, check_aliases
        )

    def test_threat_detection_category(self):
        bulk_checks_metatada = {
            CLOUDTRAIL_THREAT_DETECTION_ENUMERATION_NAME: self.get_threat_detection_check_metadata()
        }
        categories = {"threat-detection"}

        assert {CLOUDTRAIL_THREAT_DETECTION_ENUMERATION_NAME} == load_checks_to_execute(
            bulk_checks_metadata=bulk_checks_metatada,
            categories=categories,
            provider=self.provider,
        )

    def test_discard_threat_detection_checks(self):
        bulk_checks_metatada = {
            CLOUDTRAIL_THREAT_DETECTION_ENUMERATION_NAME: self.get_threat_detection_check_metadata()
        }
        categories = {}

        assert set() == load_checks_to_execute(
            bulk_checks_metadata=bulk_checks_metatada,
            categories=categories,
            provider=self.provider,
        )

    def test_threat_detection_single_check(self):
        bulk_checks_metatada = {
            CLOUDTRAIL_THREAT_DETECTION_ENUMERATION_NAME: self.get_threat_detection_check_metadata()
        }
        categories = {}
        check_list = [CLOUDTRAIL_THREAT_DETECTION_ENUMERATION_NAME]

        assert {CLOUDTRAIL_THREAT_DETECTION_ENUMERATION_NAME} == load_checks_to_execute(
            bulk_checks_metadata=bulk_checks_metatada,
            check_list=check_list,
            categories=categories,
            provider=self.provider,
        )

    def test_load_checks_to_execute_with_invalid_check(self):
        """Test that invalid check names cause sys.exit(1)"""
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        check_list = ["invalid_check_name"]

        with pytest.raises(SystemExit) as exc_info:
            load_checks_to_execute(
                bulk_checks_metadata=bulk_checks_metatada,
                check_list=check_list,
                provider=self.provider,
            )
        assert exc_info.value.code == 1

    def test_load_checks_to_execute_with_multiple_invalid_checks(self):
        """Test that multiple invalid check names cause sys.exit(1)"""
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        check_list = ["invalid_check_1", "invalid_check_2", "invalid_check_3"]

        with pytest.raises(SystemExit) as exc_info:
            load_checks_to_execute(
                bulk_checks_metadata=bulk_checks_metatada,
                check_list=check_list,
                provider=self.provider,
            )
        assert exc_info.value.code == 1

    def test_load_checks_to_execute_with_mixed_valid_invalid_checks(self):
        """Test that mix of valid and invalid checks cause sys.exit(1)"""
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        check_list = [S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME, "invalid_check"]

        with pytest.raises(SystemExit) as exc_info:
            load_checks_to_execute(
                bulk_checks_metadata=bulk_checks_metatada,
                check_list=check_list,
                provider=self.provider,
            )
        assert exc_info.value.code == 1

    def test_load_checks_to_execute_with_invalid_service(self):
        """Test that invalid service names cause sys.exit(1)"""
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        service_list = ["invalid_service"]

        with pytest.raises(SystemExit) as exc_info:
            load_checks_to_execute(
                bulk_checks_metadata=bulk_checks_metatada,
                service_list=service_list,
                provider=self.provider,
            )
        assert exc_info.value.code == 1

    def test_load_checks_to_execute_with_invalid_service_and_severity(self):
        """Test that invalid service names with severity cause sys.exit(1)"""
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        service_list = ["invalid_service"]
        severities = [S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_SEVERITY]

        with pytest.raises(SystemExit) as exc_info:
            load_checks_to_execute(
                bulk_checks_metadata=bulk_checks_metatada,
                service_list=service_list,
                severities=severities,
                provider=self.provider,
            )
        assert exc_info.value.code == 1

    def test_load_checks_to_execute_with_multiple_invalid_services(self):
        """Test that multiple invalid service names cause sys.exit(1)"""
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        service_list = ["invalid_service_1", "invalid_service_2"]

        with pytest.raises(SystemExit) as exc_info:
            load_checks_to_execute(
                bulk_checks_metadata=bulk_checks_metatada,
                service_list=service_list,
                provider=self.provider,
            )
        assert exc_info.value.code == 1

    def test_load_checks_to_execute_with_invalid_category(self):
        """Test that invalid category names cause sys.exit(1)"""
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        categories = {"invalid_category"}

        with pytest.raises(SystemExit) as exc_info:
            load_checks_to_execute(
                bulk_checks_metadata=bulk_checks_metatada,
                categories=categories,
                provider=self.provider,
            )
        assert exc_info.value.code == 1

    def test_load_checks_to_execute_with_multiple_invalid_categories(self):
        """Test that multiple invalid category names cause sys.exit(1)"""
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        categories = {"invalid_category_1", "invalid_category_2"}

        with pytest.raises(SystemExit) as exc_info:
            load_checks_to_execute(
                bulk_checks_metadata=bulk_checks_metatada,
                categories=categories,
                provider=self.provider,
            )
        assert exc_info.value.code == 1

    def test_load_checks_to_execute_with_mixed_valid_invalid_categories(self):
        """Test that mix of valid and invalid categories cause sys.exit(1)"""
        bulk_checks_metatada = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_s3_metadata()
        }
        categories = {"internet-exposed", "invalid_category"}

        with pytest.raises(SystemExit) as exc_info:
            load_checks_to_execute(
                bulk_checks_metadata=bulk_checks_metatada,
                categories=categories,
                provider=self.provider,
            )
        assert exc_info.value.code == 1
```

--------------------------------------------------------------------------------

````
