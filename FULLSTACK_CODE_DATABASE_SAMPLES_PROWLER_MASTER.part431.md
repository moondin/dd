---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 431
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 431 of 867)

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

---[FILE: scan_test.py]---
Location: prowler-master/tests/lib/scan/scan_test.py

```python
from importlib.machinery import FileFinder
from pkgutil import ModuleInfo
from unittest import mock

import pytest
from mock import MagicMock, patch

from prowler.lib.scan.exceptions.exceptions import (
    ScanInvalidCategoryError,
    ScanInvalidCheckError,
    ScanInvalidComplianceFrameworkError,
    ScanInvalidServiceError,
    ScanInvalidSeverityError,
    ScanInvalidStatusError,
)
from prowler.lib.scan.scan import Scan, get_service_checks_to_execute
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.aws.utils import set_mocked_aws_provider

finding = generate_finding_output(
    status="PASS",
    status_extended="status-extended",
    resource_uid="resource-123",
    resource_name="Example Resource",
    resource_details="Detailed information about the resource",
    resource_tags={"tag1": "value1", "tag2": "value2"},
    partition="aws",
    description="Description of the finding",
    risk="High",
    related_url="http://example.com",
    remediation_recommendation_text="Recommendation text",
    remediation_recommendation_url="http://example.com/remediation",
    remediation_code_nativeiac="native-iac-code",
    remediation_code_terraform="terraform-code",
    remediation_code_other="other-code",
    remediation_code_cli="cli-code",
    compliance={"compliance_key": "compliance_value"},
    categories=["categorya", "categoryb"],
    depends_on=["dependency"],
    related_to=["related"],
    notes="Notes about the finding",
)


@pytest.fixture
def mock_provider():
    return set_mocked_aws_provider()


@pytest.fixture
def mock_execute():
    with mock.patch("prowler.lib.scan.scan.execute", autospec=True) as mock_exec:
        findings = [finding]
        mock_exec.side_effect = lambda *args, **kwargs: findings
        yield mock_exec


@pytest.fixture
def mock_logger():
    with mock.patch("prowler.lib.logger.logger", autospec=True) as mock_log:
        yield mock_log


@pytest.fixture
def mock_global_provider(mock_provider):
    with mock.patch(
        "prowler.providers.common.provider.Provider.get_global_provider",
        return_value=mock_provider,
    ):
        yield mock_provider


@pytest.fixture
def mock_generate_output():
    with mock.patch(
        "prowler.lib.outputs.finding.Finding.generate_output", autospec=True
    ) as mock_gen_output:
        mock_gen_output.side_effect = lambda provider, finding, output_options: finding
        yield mock_gen_output


@pytest.fixture
def mock_list_modules():
    with mock.patch(
        "prowler.lib.check.utils.list_modules", autospec=True
    ) as mock_list_mod:
        mock_list_mod.return_value = [
            ModuleInfo(
                module_finder=FileFinder(
                    "/prowler/providers/aws/services/accessanalyzer/accessanalyzer_enabled"
                ),
                name="prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled.accessanalyzer_enabled",
                ispkg=False,
            )
        ]
        yield mock_list_mod


@pytest.fixture
def mock_recover_checks_from_provider():
    with mock.patch(
        "prowler.lib.check.models.recover_checks_from_provider", autospec=True
    ) as mock_recover:
        mock_recover.return_value = [
            (
                "accessanalyzer_enabled",
                "/prowler/providers/aws/services/accessanalyzer/accessanalyzer_enabled",
            )
        ]
        yield mock_recover


@pytest.fixture
def mock_load_check_metadata():
    with mock.patch(
        "prowler.lib.check.models.load_check_metadata", autospec=True
    ) as mock_load:
        mock_metadata = MagicMock()
        mock_metadata.CheckID = "accessanalyzer_enabled"
        mock_metadata.ResourceType = "AWS::IAM::AccessAnalyzer"
        mock_load.return_value = mock_metadata
        yield mock_load


@pytest.fixture
def mock_load_checks_to_execute():
    with mock.patch(
        "prowler.lib.check.models.CheckMetadata.list", autospec=True
    ) as mock_load:
        mock_load.return_value = {"accessanalyzer_enabled"}
        yield mock_load


@pytest.fixture
def mock_check_metadata_get_bulk():
    with mock.patch(
        "prowler.lib.check.models.CheckMetadata.get_bulk", autospec=True
    ) as mock_get_bulk:
        mock_metadata = MagicMock()
        mock_metadata.CheckID = "accessanalyzer_enabled"
        mock_metadata.ResourceType = "AWS::IAM::AccessAnalyzer"
        mock_get_bulk.return_value = {"accessanalyzer_enabled": mock_metadata}
        yield mock_get_bulk


class TestScan:
    def test_init(
        mock_provider,
    ):
        checks_to_execute = {
            "workspaces_vpc_2private_1public_subnets_nat",
            "workspaces_vpc_2private_1public_subnets_nat",
            "accessanalyzer_enabled",
            "accessanalyzer_enabled_without_findings",
            "account_maintain_current_contact_details",
            "account_maintain_different_contact_details_to_security_billing_and_operations",
            "account_security_contact_information_is_registered",
            "account_security_questions_are_registered_in_the_aws_account",
            "acm_certificates_expiration_check",
            "acm_certificates_transparency_logs_enabled",
            "apigateway_restapi_authorizers_enabled",
            "apigateway_restapi_client_certificate_enabled",
            "apigateway_restapi_logging_enabled",
            "apigateway_restapi_public",
            "awslambda_function_not_publicly_accessible",
            "awslambda_function_url_cors_policy",
            "awslambda_function_url_public",
            "awslambda_function_using_supported_runtimes",
            "backup_plans_exist",
            "backup_reportplans_exist",
            "backup_vaults_encrypted",
            "backup_vaults_exist",
            "cloudformation_stack_outputs_find_secrets",
            "cloudformation_stacks_termination_protection_enabled",
            "cloudwatch_cross_account_sharing_disabled",
            "cloudwatch_log_group_kms_encryption_enabled",
            "cloudwatch_log_group_no_secrets_in_logs",
            "cloudwatch_log_group_retention_policy_specific_days_enabled",
            "cloudwatch_log_metric_filter_and_alarm_for_aws_config_configuration_changes_enabled",
            "cloudwatch_log_metric_filter_and_alarm_for_cloudtrail_configuration_changes_enabled",
            "cloudwatch_log_metric_filter_authentication_failures",
            "cloudwatch_log_metric_filter_aws_organizations_changes",
            "cloudwatch_log_metric_filter_disable_or_scheduled_deletion_of_kms_cmk",
            "cloudwatch_log_metric_filter_for_s3_bucket_policy_changes",
            "cloudwatch_log_metric_filter_policy_changes",
            "cloudwatch_log_metric_filter_root_usage",
            "cloudwatch_log_metric_filter_security_group_changes",
            "cloudwatch_log_metric_filter_sign_in_without_mfa",
            "cloudwatch_log_metric_filter_unauthorized_api_calls",
            "codeartifact_packages_external_public_publishing_disabled",
            "codebuild_project_older_90_days",
            "codebuild_project_user_controlled_buildspec",
            "cognito_identity_pool_guest_access_disabled",
            "cognito_user_pool_advanced_security_enabled",
            "cognito_user_pool_blocks_compromised_credentials_sign_in_attempts",
            "cognito_user_pool_blocks_potential_malicious_sign_in_attempts",
            "cognito_user_pool_client_prevent_user_existence_errors",
            "cognito_user_pool_client_token_revocation_enabled",
            "cognito_user_pool_deletion_protection_enabled",
            "cognito_user_pool_mfa_enabled",
            "cognito_user_pool_password_policy_lowercase",
            "cognito_user_pool_password_policy_minimum_length_14",
            "cognito_user_pool_password_policy_number",
            "cognito_user_pool_password_policy_symbol",
            "cognito_user_pool_password_policy_uppercase",
            "cognito_user_pool_self_registration_disabled",
            "cognito_user_pool_temporary_password_expiration",
            "cognito_user_pool_waf_acl_attached",
            "config_recorder_all_regions_enabled",
        }
        mock_provider.type = "aws"
        # Patch get_bulk to return all these checks
        with mock.patch(
            "prowler.lib.check.models.CheckMetadata.get_bulk"
        ) as mock_get_bulk:
            mock_metadata = MagicMock()
            mock_metadata.ResourceType = "AWS::IAM::AccessAnalyzer"
            mock_metadata.Categories = []
            mock_get_bulk.return_value = {
                check: mock_metadata for check in checks_to_execute
            }
            scan = Scan(mock_provider, checks=checks_to_execute)

            assert scan.provider == mock_provider
            # Check that the checks to execute are sorted and without duplicates
            assert scan.checks_to_execute == sorted(list(checks_to_execute))
            assert scan.service_checks_to_execute == get_service_checks_to_execute(
                checks_to_execute
            )
            assert scan.service_checks_completed == {}
            assert scan.progress == 0
            assert scan.duration == 0
            assert scan.get_completed_services() == set()
            assert scan.get_completed_checks() == set()

    def test_init_with_no_checks(
        mock_provider,
        mock_recover_checks_from_provider,
        mock_load_check_metadata,
    ):
        checks_to_execute = set()
        mock_provider.type = "aws"
        # Patch get_bulk to return only accessanalyzer_enabled
        with mock.patch(
            "prowler.lib.check.models.CheckMetadata.get_bulk"
        ) as mock_get_bulk:
            mock_metadata = MagicMock()
            mock_metadata.ResourceType = "AWS::IAM::AccessAnalyzer"
            mock_metadata.Categories = []
            mock_get_bulk.return_value = {"accessanalyzer_enabled": mock_metadata}
            scan = Scan(mock_provider, checks=checks_to_execute)
            # Remove assertion for mock_load_check_metadata
            assert scan.provider == mock_provider
            assert scan.checks_to_execute == ["accessanalyzer_enabled"]
            assert scan.service_checks_to_execute == get_service_checks_to_execute(
                ["accessanalyzer_enabled"]
            )
            assert scan.service_checks_completed == {}
            assert scan.progress == 0
            assert scan.get_completed_services() == set()
            assert scan.get_completed_checks() == set()

    @patch("prowler.lib.scan.scan.load_checks_to_execute")
    @patch("prowler.lib.scan.scan.update_checks_metadata_with_compliance")
    @patch("prowler.lib.scan.scan.Compliance.get_bulk")
    @patch("prowler.lib.scan.scan.CheckMetadata.get_bulk")
    @patch("prowler.lib.scan.scan.import_check")
    def test_scan(
        self,
        mock_import_check,
        mock_get_bulk,
        mock_compliance_get_bulk,
        mock_update_checks_metadata,
        mock_load_checks,
        mock_global_provider,
        mock_execute,
        mock_logger,
    ):
        from prowler.lib.check.models import Severity

        mock_check_class = MagicMock()
        mock_check_instance = mock_check_class.return_value
        mock_check_instance.Provider = "aws"
        mock_check_instance.CheckID = "accessanalyzer_enabled"
        mock_check_instance.CheckTitle = "Check if IAM Access Analyzer is enabled"
        mock_check_instance.Categories = []

        mock_import_check.return_value = MagicMock(
            accessanalyzer_enabled=mock_check_class
        )

        checks_to_execute = {"accessanalyzer_enabled"}
        custom_checks_metadata = {}

        # Mock CheckMetadata
        mock_metadata = MagicMock()
        mock_metadata.CheckID = "accessanalyzer_enabled"
        mock_metadata.ResourceType = "AWS::IAM::AccessAnalyzer"
        mock_metadata.Categories = []
        mock_metadata.CheckAliases = []
        mock_metadata.Severity = Severity.medium
        mock_metadata.Compliance = []

        bulk_checks_metadata = {"accessanalyzer_enabled": mock_metadata}
        mock_get_bulk.return_value = bulk_checks_metadata

        # Mock update_checks_metadata_with_compliance to return the same metadata
        mock_update_checks_metadata.return_value = bulk_checks_metadata

        # Mock Compliance frameworks
        mock_compliance_get_bulk.return_value = {}

        # Mock load_checks_to_execute to return the checks
        mock_load_checks.return_value = ["accessanalyzer_enabled"]

        scan = Scan(mock_global_provider, checks=checks_to_execute)
        results = list(scan.scan(custom_checks_metadata))

        assert mock_execute.call_count == 1
        assert len(results) == 1
        assert results[0][0] == 100.0
        assert scan.progress == 100.0
        # Since the scan is mocked, the duration will always be 0 for now
        assert scan.duration == 0
        assert scan._number_of_checks_completed == 1
        assert scan.service_checks_completed == {
            "accessanalyzer": {"accessanalyzer_enabled"},
        }
        mock_logger.error.assert_not_called()

    def test_init_invalid_severity(
        mock_provider,
    ):
        checks_to_execute = set()
        mock_provider.type = "aws"

        with pytest.raises(ScanInvalidSeverityError):
            Scan(mock_provider, checks=checks_to_execute, severities=["invalid"])

    def test_init_invalid_check(
        mock_provider,
    ):
        checks_to_execute = ["invalid_check"]
        mock_provider.type = "aws"

        with pytest.raises(ScanInvalidCheckError):
            Scan(mock_provider, checks=checks_to_execute)

    def test_init_invalid_service(
        mock_provider,
    ):
        checks_to_execute = set()
        mock_provider.type = "aws"

        with pytest.raises(ScanInvalidServiceError):
            Scan(mock_provider, checks=checks_to_execute, services=["invalid_service"])

    def test_init_invalid_compliance_framework(
        mock_provider,
    ):
        checks_to_execute = set()
        mock_provider.type = "aws"

        with pytest.raises(ScanInvalidComplianceFrameworkError):
            Scan(
                mock_provider,
                checks=checks_to_execute,
                compliances=["invalid_framework"],
            )

    def test_init_invalid_category(
        mock_provider,
    ):
        checks_to_execute = set()
        mock_provider.type = "aws"

        with pytest.raises(ScanInvalidCategoryError):
            Scan(
                mock_provider, checks=checks_to_execute, categories=["invalid_category"]
            )

    def test_init_invalid_status(
        mock_provider,
    ):
        checks_to_execute = set()
        mock_provider.type = "aws"

        with pytest.raises(ScanInvalidStatusError):
            Scan(mock_provider, checks=checks_to_execute, status=["invalid_status"])

    @patch("importlib.import_module")
    def test_scan_filter_status(
        mock_import_module,
        mock_global_provider,
        mock_recover_checks_from_provider,
        mock_load_check_metadata,
    ):
        mock_check_class = MagicMock()
        mock_check_instance = mock_check_class.return_value
        mock_check_instance.Provider = "aws"
        mock_check_instance.CheckID = "accessanalyzer_enabled"
        mock_check_instance.CheckTitle = "Check if IAM Access Analyzer is enabled"
        mock_check_instance.Categories = []

        mock_import_module.return_value = MagicMock(
            accessanalyzer_enabled=mock_check_class
        )

        checks_to_execute = {"accessanalyzer_enabled"}
        custom_checks_metadata = {}
        mock_global_provider.type = "aws"

        scan = Scan(mock_global_provider, checks=checks_to_execute, status=["FAIL"])
        mock_load_check_metadata.assert_called_once()
        mock_recover_checks_from_provider.assert_called_once_with("aws")
        results = list(scan.scan(custom_checks_metadata))

        assert results[0] == (100.0, [])
```

--------------------------------------------------------------------------------

---[FILE: scan_filters_test.py]---
Location: prowler-master/tests/lib/scan_filters/scan_filters_test.py

```python
from prowler.lib.scan_filters.scan_filters import is_resource_filtered


class Test_Scan_Filters:
    def test_is_resource_filtered(self):
        audit_resources = [
            "arn:aws:iam::123456789012:user/test_user",
            "arn:aws:s3:::test_bucket",
        ]
        assert is_resource_filtered(
            "arn:aws:iam::123456789012:user/test_user", audit_resources
        )
        assert not is_resource_filtered(
            "arn:aws:iam::123456789012:user/test1", audit_resources
        )
        assert is_resource_filtered("arn:aws:s3:::test_bucket", audit_resources)
```

--------------------------------------------------------------------------------

---[FILE: utils_test.py]---
Location: prowler-master/tests/lib/utils/utils_test.py

```python
import os
import tempfile
from datetime import datetime
from time import mktime

import pytest
from mock import patch

from prowler.lib.utils.utils import (
    detect_secrets_scan,
    file_exists,
    get_file_permissions,
    hash_sha512,
    is_owned_by_root,
    open_file,
    outputs_unix_timestamp,
    parse_json_file,
    strip_ansi_codes,
    validate_ip_address,
)


class Test_utils_open_file:
    def test_open_read_file(self):
        temp_data_file = tempfile.NamedTemporaryFile(delete=False)
        mode = "r"
        f = open_file(temp_data_file.name, mode)
        assert f.__class__.__name__ == "TextIOWrapper"
        os.remove(temp_data_file.name)

    def test_open_raise_too_many_open_files(self):
        temp_data_file = tempfile.NamedTemporaryFile(delete=False)
        mode = "r"
        with patch("prowler.lib.utils.utils.open") as mock_open:
            mock_open.side_effect = OSError(1, "Too many open files")
            with pytest.raises(SystemExit) as exception:
                open_file(temp_data_file.name, mode)
            assert exception.type == SystemExit
            assert exception.value.code == 1
            os.remove(temp_data_file.name)

    def test_open_raise_os_error(self):
        temp_data_file = tempfile.NamedTemporaryFile(delete=False)
        mode = "r"
        with patch("prowler.lib.utils.utils.open") as mock_open:
            mock_open.side_effect = OSError(1, "Another OS error")
            with pytest.raises(SystemExit) as exception:
                open_file(temp_data_file.name, mode)
            assert exception.type == SystemExit
            assert exception.value.code == 1
            os.remove(temp_data_file.name)

    def test_open_raise_exception(self):
        temp_data_file = tempfile.NamedTemporaryFile(delete=False)
        mode = "r"
        with patch("prowler.lib.utils.utils.open") as mock_open:
            mock_open.side_effect = Exception()
            with pytest.raises(SystemExit) as exception:
                open_file(temp_data_file.name, mode)
            assert exception.type == SystemExit
            assert exception.value.code == 1
            os.remove(temp_data_file.name)


class Test_parse_json_file:
    def test_parse_json_file_invalid(self):
        temp_data_file = tempfile.NamedTemporaryFile(delete=False)
        with pytest.raises(SystemExit) as exception:
            parse_json_file(temp_data_file)

        assert exception.type == SystemExit
        assert exception.value.code == 1
        os.remove(temp_data_file.name)

    def test_parse_json_file_valid(self):
        temp_data_file = tempfile.NamedTemporaryFile(delete=False)
        temp_data_file.write(b"{}")
        temp_data_file.seek(0)
        f = parse_json_file(temp_data_file)
        assert f == {}


class Test_file_exists:
    def test_file_exists_false(self):
        assert not file_exists("not_existing.txt")

    def test_file_exists(self):
        temp_data_file = tempfile.NamedTemporaryFile(delete=False)
        assert file_exists(temp_data_file.name)
        os.remove(temp_data_file.name)

    def test_file_exists_raised_exception(self):
        temp_data_file = tempfile.NamedTemporaryFile(delete=False)
        with patch("prowler.lib.utils.utils.exists") as mock_exists:
            mock_exists.side_effect = Exception()
            with pytest.raises(SystemExit) as exception:
                file_exists(temp_data_file.name)

        assert exception.type == SystemExit
        assert exception.value.code == 1

        os.remove(temp_data_file.name)


class Test_utils_validate_ip_address:
    def test_validate_ip_address(self):
        assert validate_ip_address("88.26.151.198")
        assert not validate_ip_address("Not an IP")


class Test_detect_secrets_scan:
    def test_detect_secrets_scan_data(self):
        data = "password=password"
        secrets_detected = detect_secrets_scan(data=data, excluded_secrets=[])
        assert type(secrets_detected) is list
        assert len(secrets_detected) == 1
        assert "filename" in secrets_detected[0]
        assert "hashed_secret" in secrets_detected[0]
        assert "is_verified" in secrets_detected[0]
        assert secrets_detected[0]["line_number"] == 1
        assert secrets_detected[0]["type"] == "Secret Keyword"

    def test_detect_secrets_scan_no_secrets_data(self):
        data = ""
        assert detect_secrets_scan(data=data) is None

    def test_detect_secrets_scan_file_with_secrets(self):
        temp_data_file = tempfile.NamedTemporaryFile(delete=False)
        temp_data_file.write(b"password=password")
        temp_data_file.seek(0)
        secrets_detected = detect_secrets_scan(
            file=temp_data_file.name, excluded_secrets=[]
        )
        assert type(secrets_detected) is list
        assert len(secrets_detected) == 1
        assert "filename" in secrets_detected[0]
        assert "hashed_secret" in secrets_detected[0]
        assert "is_verified" in secrets_detected[0]
        assert secrets_detected[0]["line_number"] == 1
        assert secrets_detected[0]["type"] == "Secret Keyword"
        os.remove(temp_data_file.name)

    def test_detect_secrets_scan_file_no_secrets(self):
        temp_data_file = tempfile.NamedTemporaryFile(delete=False)
        temp_data_file.write(b"no secrets")
        temp_data_file.seek(0)
        assert detect_secrets_scan(file=temp_data_file.name) is None
        os.remove(temp_data_file.name)

    def test_detect_secrets_using_regex(self):
        data = "MYSQL_ALLOW_EMPTY_PASSWORD=password"
        secrets_detected = detect_secrets_scan(
            data=data, excluded_secrets=[".*password"]
        )
        assert secrets_detected is None

    def test_detect_secrets_using_regex_file(self):
        temp_data_file = tempfile.NamedTemporaryFile(delete=False)
        temp_data_file.write(b"MYSQL_ALLOW_EMPTY_PASSWORD=password")
        temp_data_file.seek(0)
        secrets_detected = detect_secrets_scan(
            file=temp_data_file.name, excluded_secrets=[".*password"]
        )
        assert secrets_detected is None
        os.remove(temp_data_file.name)

    def test_detect_secrets_secrets_using_regex(self):
        data = "MYSQL_ALLOW_EMPTY_PASSWORD=password, MYSQL_PASSWORD=password"
        # Update the regex to exclude only the exact key "MYSQL_ALLOW_EMPTY_PASSWORD"
        secrets_detected = detect_secrets_scan(
            data=data, excluded_secrets=["^MYSQL_ALLOW_EMPTY_PASSWORD$"]
        )
        assert type(secrets_detected) is list
        assert len(secrets_detected) == 1
        assert "filename" in secrets_detected[0]
        assert "hashed_secret" in secrets_detected[0]
        assert "is_verified" in secrets_detected[0]
        assert secrets_detected[0]["line_number"] == 1
        assert secrets_detected[0]["type"] == "Secret Keyword"


class Test_hash_sha512:
    def test_hash_sha512(self):
        assert hash_sha512("test") == "ee26b0dd4"


class Test_outputs_unix_timestamp:
    def test_outputs_unix_timestamp_false(self):
        time = datetime.now()
        assert outputs_unix_timestamp(False, time) == time.isoformat()

    def test_outputs_unix_timestamp_true(self):
        time = datetime.now()
        assert outputs_unix_timestamp(True, time) == mktime(time.timetuple())


class TestFilePermissions:
    def test_get_file_permissions(self):
        # Create a temporary file with known permissions
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        temp_file.close()
        os.chmod(temp_file.name, 0o644)  # Set permissions to 644 (-rw-r--r--)
        permissions = get_file_permissions(temp_file.name)
        assert permissions == "0o644"
        os.unlink(temp_file.name)
        assert not get_file_permissions("not_existing_file")

    def test_is_owned_by_root(self):
        # Create a temporary file with known permissions
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        temp_file.close()
        os.chmod(temp_file.name, 0o644)  # Set permissions to 644 (-rw-r--r--)
        # Check ownership for the temporary file
        assert not is_owned_by_root(temp_file.name)
        os.unlink(temp_file.name)

        assert not is_owned_by_root("not_existing_file")
        # Not valid for darwin systems
        # assert is_owned_by_root("/etc/passwd")


class TestStripAnsiCodes:
    def test_strip_ansi_codes_no_alteration(self):
        input_string = "\x1b[31mHello\x1b[0m World"
        expected_output = "Hello World"

        actual_output = strip_ansi_codes(input_string)

        assert actual_output == expected_output

    def test_strip_ansi_codes_empty_string(self):
        input_string = ""
        expected_output = ""

        actual_output = strip_ansi_codes(input_string)

        assert actual_output == expected_output
```

--------------------------------------------------------------------------------

---[FILE: alibabacloud_fixtures.py]---
Location: prowler-master/tests/providers/alibabacloud/alibabacloud_fixtures.py

```python
from unittest.mock import MagicMock

from prowler.providers.alibabacloud.models import AlibabaCloudIdentityInfo
from prowler.providers.common.models import Audit_Metadata


def set_mocked_alibabacloud_provider(
    account_id: str = "1234567890",
    account_name: str = "test-account",
    user_id: str = "123456",
    user_name: str = "test-user",
    region: str = "cn-hangzhou",
) -> MagicMock:
    """Create a mocked Alibaba Cloud provider for service unit tests."""
    provider = MagicMock()
    provider.type = "alibabacloud"

    provider.identity = AlibabaCloudIdentityInfo(
        account_id=account_id,
        account_name=account_name,
        user_id=user_id,
        user_name=user_name,
        identity_arn=f"acs:ram::{account_id}:user/{user_name}",
        profile="default",
        profile_region=region,
        audited_regions={region},
        is_root=False,
    )

    provider.audit_metadata = Audit_Metadata(
        services_scanned=0,
        expected_checks=[],
        completed_checks=0,
        audit_progress=0,
    )
    provider.audit_resources = []
    provider.audit_config = {}
    provider.fixer_config = {}
    provider.mutelist = MagicMock()
    provider.mutelist.is_muted = MagicMock(return_value=False)

    # Session/client mocks
    provider.session = MagicMock()
    provider.session.client = MagicMock(return_value=MagicMock(region=region))

    # Region helpers
    provider.get_default_region = MagicMock(return_value=region)

    def mock_generate_regional_clients(service_name):
        return {region: MagicMock(region=region)}

    provider.generate_regional_clients = MagicMock(
        side_effect=mock_generate_regional_clients
    )

    return provider
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: prowler-master/tests/providers/alibabacloud/conftest.py

```python
"""
Pytest configuration for Alibaba Cloud provider tests.

Mocks Alibaba Cloud SDK modules to avoid import issues when the real
dependencies are not installed in the test environment.
"""

import sys
from unittest.mock import MagicMock

# Mock Alibaba Cloud SDK modules so imports in provider/service code succeed
MOCKED_MODULES = [
    "alibabacloud_credentials",
    "alibabacloud_credentials.client",
    "alibabacloud_credentials.models",
    "alibabacloud_sts20150401",
    "alibabacloud_sts20150401.client",
    "alibabacloud_tea_openapi",
    "alibabacloud_tea_openapi.models",
    "alibabacloud_ram20150501",
    "alibabacloud_ram20150501.client",
    "alibabacloud_vpc20160428",
    "alibabacloud_vpc20160428.client",
    "alibabacloud_sas20181203",
    "alibabacloud_sas20181203.client",
    "alibabacloud_ecs20140526",
    "alibabacloud_ecs20140526.client",
    "alibabacloud_oss20190517",
    "alibabacloud_oss20190517.client",
    "alibabacloud_actiontrail20200706",
    "alibabacloud_actiontrail20200706.client",
    "alibabacloud_cs20151215",
    "alibabacloud_cs20151215.client",
    "alibabacloud_rds20140815",
    "alibabacloud_rds20140815.client",
    "alibabacloud_sls20201230",
    "alibabacloud_sls20201230.client",
]

for module_name in MOCKED_MODULES:
    sys.modules.setdefault(module_name, MagicMock())
```

--------------------------------------------------------------------------------

---[FILE: alibabacloud_mutelist_test.py]---
Location: prowler-master/tests/providers/alibabacloud/lib/mutelist/alibabacloud_mutelist_test.py

```python
from unittest.mock import MagicMock

import yaml

from prowler.providers.alibabacloud.lib.mutelist.mutelist import AlibabaCloudMutelist

MUTELIST_FIXTURE_PATH = (
    "tests/providers/alibabacloud/lib/mutelist/fixtures/alibabacloud_mutelist.yaml"
)


class TestAlibabaCloudMutelist:
    def test_get_mutelist_file_from_local_file(self):
        mutelist = AlibabaCloudMutelist(
            mutelist_path=MUTELIST_FIXTURE_PATH, account_id="1234567890"
        )

        with open(MUTELIST_FIXTURE_PATH) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        assert mutelist.mutelist == mutelist_fixture
        assert mutelist.mutelist_file_path == MUTELIST_FIXTURE_PATH

    def test_get_mutelist_file_from_local_file_non_existent(self):
        mutelist_path = "tests/providers/alibabacloud/lib/mutelist/fixtures/not_present"
        mutelist = AlibabaCloudMutelist(
            mutelist_path=mutelist_path, account_id="1234567890"
        )

        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path == mutelist_path

    def test_is_finding_muted(self):
        mutelist = AlibabaCloudMutelist(
            mutelist_path=MUTELIST_FIXTURE_PATH, account_id="1234567890"
        )

        finding = MagicMock()
        finding.check_metadata = MagicMock()
        finding.check_metadata.CheckID = "test_check"
        finding.status = "FAIL"
        finding.resource_id = "test_resource"
        finding.region = "cn-hangzhou"
        finding.resource_tags = [{"Key": "Environment", "Value": "Prod"}]

        assert mutelist.is_finding_muted(finding, account_id="1234567890")

    def test_is_finding_not_muted_with_different_resource(self):
        mutelist = AlibabaCloudMutelist(
            mutelist_path=MUTELIST_FIXTURE_PATH, account_id="1234567890"
        )

        finding = MagicMock()
        finding.check_metadata = MagicMock()
        finding.check_metadata.CheckID = "test_check"
        finding.status = "FAIL"
        finding.resource_id = "another_resource"
        finding.region = "cn-hangzhou"
        finding.resource_tags = [{"Key": "Environment", "Value": "Prod"}]

        assert mutelist.is_finding_muted(finding, account_id="1234567890") is False
```

--------------------------------------------------------------------------------

---[FILE: alibabacloud_mutelist.yaml]---
Location: prowler-master/tests/providers/alibabacloud/lib/mutelist/fixtures/alibabacloud_mutelist.yaml

```yaml
Mutelist:
  Accounts:
    "*":
      Checks:
        test_check:
          Regions:
            - "*"
          Resources:
            - "test_resource"
          Tags:
            - "Environment=Prod"
```

--------------------------------------------------------------------------------

---[FILE: actiontrail_service_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/actiontrail/actiontrail_service_test.py

```python
from unittest.mock import patch

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestActionTrailService:
    def test_service(self):
        alibabacloud_provider = set_mocked_alibabacloud_provider()

        with patch(
            "prowler.providers.alibabacloud.services.actiontrail.actiontrail_service.ActionTrail.__init__",
            return_value=None,
        ):
            from prowler.providers.alibabacloud.services.actiontrail.actiontrail_service import (
                ActionTrail,
            )

            actiontrail_client = ActionTrail(alibabacloud_provider)
            actiontrail_client.service = "actiontrail"
            actiontrail_client.provider = alibabacloud_provider
            actiontrail_client.regional_clients = {}

            assert actiontrail_client.service == "actiontrail"
            assert actiontrail_client.provider == alibabacloud_provider
```

--------------------------------------------------------------------------------

---[FILE: actiontrail_multi_region_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/actiontrail/actiontrail_multi_region_enabled/actiontrail_multi_region_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestActionTrailMultiRegionEnabled:
    def test_no_multi_region_trail_fails(self):
        actiontrail_client = mock.MagicMock()
        actiontrail_client.trails = {}
        actiontrail_client.region = "cn-hangzhou"
        actiontrail_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.actiontrail.actiontrail_multi_region_enabled.actiontrail_multi_region_enabled.actiontrail_client",
                new=actiontrail_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.actiontrail.actiontrail_multi_region_enabled.actiontrail_multi_region_enabled import (
                actiontrail_multi_region_enabled,
            )

            check = actiontrail_multi_region_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "not configured" in result[0].status_extended

    def test_enabled_multi_region_trail_passes(self):
        actiontrail_client = mock.MagicMock()
        actiontrail_client.region = "cn-hangzhou"
        actiontrail_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.actiontrail.actiontrail_multi_region_enabled.actiontrail_multi_region_enabled.actiontrail_client",
                new=actiontrail_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.actiontrail.actiontrail_multi_region_enabled.actiontrail_multi_region_enabled import (
                actiontrail_multi_region_enabled,
            )
            from prowler.providers.alibabacloud.services.actiontrail.actiontrail_service import (
                Trail,
            )

            trail = Trail(
                arn="acs:actiontrail::1234567890:trail/multi",
                name="multi",
                home_region="cn-hangzhou",
                trail_region="All",
                status="Enable",
                oss_bucket_name="logs",
                oss_bucket_location="cn-hangzhou",
                sls_project_arn="",
                event_rw="All",
            )

            actiontrail_client.trails = {trail.arn: trail}

            check = actiontrail_multi_region_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "multi-region trail(s)" in result[0].status_extended
            assert "multi" in result[0].status_extended
```

--------------------------------------------------------------------------------

````
