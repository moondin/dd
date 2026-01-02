---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 413
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 413 of 867)

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

---[FILE: models_test.py]---
Location: prowler-master/tests/lib/check/models_test.py
Signals: Pydantic

```python
import sys
from unittest import mock

import pytest
from pydantic.v1 import ValidationError

from prowler.lib.check.models import Check, CheckMetadata
from tests.lib.check.compliance_check_test import custom_compliance_metadata

mock_metadata = CheckMetadata(
    Provider="aws",
    CheckID="accessanalyzer_enabled",
    CheckTitle="Check 1",
    CheckType=["type1"],
    ServiceName="accessanalyzer",
    SubServiceName="subservice1",
    ResourceIdTemplate="template1",
    Severity="high",
    ResourceType="resource1",
    Description="Description 1",
    Risk="risk1",
    RelatedUrl="url1",
    Remediation={
        "Code": {
            "CLI": "cli1",
            "NativeIaC": "native1",
            "Other": "other1",
            "Terraform": "terraform1",
        },
        "Recommendation": {"Text": "text1", "Url": "url1"},
    },
    Categories=["categoryone"],
    DependsOn=["dependency1"],
    RelatedTo=["related1"],
    Notes="notes1",
    Compliance=[],
)

mock_metadata_lambda = CheckMetadata(
    Provider="aws",
    CheckID="awslambda_function_url_public",
    CheckTitle="Check 1",
    CheckType=["type1"],
    ServiceName="awslambda",
    SubServiceName="subservice1",
    ResourceIdTemplate="template1",
    Severity="high",
    ResourceType="resource1",
    Description="Description 1",
    Risk="risk1",
    RelatedUrl="url1",
    Remediation={
        "Code": {
            "CLI": "cli1",
            "NativeIaC": "native1",
            "Other": "other1",
            "Terraform": "terraform1",
        },
        "Recommendation": {"Text": "text1", "Url": "url1"},
    },
    Categories=["categoryone"],
    DependsOn=["dependency1"],
    RelatedTo=["related1"],
    Notes="notes1",
    Compliance=[],
)


class TestCheckMetada:

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_get_bulk(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("accessanalyzer_enabled", "/path/to/accessanalyzer_enabled")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata

        result = CheckMetadata.get_bulk(provider="aws")

        # Assertions
        assert "accessanalyzer_enabled" in result.keys()
        assert result["accessanalyzer_enabled"] == mock_metadata
        mock_recover_checks.assert_called_once_with("aws")
        mock_load_metadata.assert_called_once_with(
            "/path/to/accessanalyzer_enabled/accessanalyzer_enabled.metadata.json"
        )

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_list(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("accessanalyzer_enabled", "/path/to/accessanalyzer_enabled")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(bulk_checks_metadata=bulk_metadata)

        # Assertions
        assert result == {"accessanalyzer_enabled"}

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_get(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("accessanalyzer_enabled", "/path/to/accessanalyzer_enabled")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(bulk_checks_metadata=bulk_metadata)

        # Assertions
        assert result == {"accessanalyzer_enabled"}

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_list_by_severity(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("accessanalyzer_enabled", "/path/to/accessanalyzer_enabled")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(bulk_checks_metadata=bulk_metadata, severity="high")

        # Assertions
        assert result == {"accessanalyzer_enabled"}

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_list_by_severity_not_values(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("accessanalyzer_enabled", "/path/to/accessanalyzer_enabled")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(bulk_checks_metadata=bulk_metadata, severity="low")

        # Assertions
        assert result == set()

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_list_by_category(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("accessanalyzer_enabled", "/path/to/accessanalyzer_enabled")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(
            bulk_checks_metadata=bulk_metadata, category="categoryone"
        )

        # Assertions
        assert result == {"accessanalyzer_enabled"}

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_list_by_category_not_valid(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("accessanalyzer_enabled", "/path/to/accessanalyzer_enabled")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(
            bulk_checks_metadata=bulk_metadata, category="categorytwo"
        )

        # Assertions
        assert result == set()

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_list_by_service(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("accessanalyzer_enabled", "/path/to/accessanalyzer_enabled")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(
            bulk_checks_metadata=bulk_metadata, service="accessanalyzer"
        )

        # Assertions
        assert result == {"accessanalyzer_enabled"}

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_list_by_service_lambda(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("awslambda_function_url_public", "/path/to/awslambda_function_url_public")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata_lambda

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(
            bulk_checks_metadata=bulk_metadata, service="lambda"
        )

        # Assertions
        assert result == {"awslambda_function_url_public"}

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_list_by_service_awslambda(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("awslambda_function_url_public", "/path/to/awslambda_function_url_public")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata_lambda

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(
            bulk_checks_metadata=bulk_metadata, service="awslambda"
        )

        # Assertions
        assert result == {"awslambda_function_url_public"}

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_list_by_service_invalid(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("accessanalyzer_enabled", "/path/to/accessanalyzer_enabled")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(
            bulk_checks_metadata=bulk_metadata, service="service2"
        )

        # Assertions
        assert result == set()

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_list_by_compliance(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of recover_checks_from_provider
        mock_recover_checks.return_value = [
            ("accessanalyzer_enabled", "/path/to/accessanalyzer_enabled")
        ]

        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")
        bulk_compliance_frameworks = custom_compliance_metadata

        mock_load_metadata.return_value = mock_metadata

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(
            bulk_checks_metadata=bulk_metadata,
            bulk_compliance_frameworks=bulk_compliance_frameworks,
            compliance_framework="framework1_aws",
        )

        # Assertions
        assert result == {"accessanalyzer_enabled"}

    @mock.patch("prowler.lib.check.models.CheckMetadata.get_bulk")
    def test_list_by_compliance_empty(self, mock_get_bulk):
        mock_get_bulk.return_value = {}
        bulk_compliance_frameworks = custom_compliance_metadata
        result = CheckMetadata.list(
            bulk_compliance_frameworks=bulk_compliance_frameworks,
            compliance_framework="framework1_azure",
        )
        # Assertions
        assert result == set()

    @mock.patch("prowler.lib.check.models.load_check_metadata")
    @mock.patch("prowler.lib.check.models.recover_checks_from_provider")
    def test_list_only_check_metadata(self, mock_recover_checks, mock_load_metadata):
        # Mock the return value of load_check_metadata
        mock_load_metadata.return_value = mock_metadata

        bulk_metadata = CheckMetadata.get_bulk(provider="aws")

        result = CheckMetadata.list(bulk_checks_metadata=bulk_metadata)
        assert result == set()

    def test_additional_urls_valid_empty_list(self):
        """Test AdditionalURLs with valid empty list (default)"""
        metadata = CheckMetadata(
            Provider="aws",
            CheckID="test_check",
            CheckTitle="Test Check",
            CheckType=["type1"],
            ServiceName="test",
            SubServiceName="subservice1",
            ResourceIdTemplate="template1",
            Severity="high",
            ResourceType="resource1",
            Description="Description 1",
            Risk="risk1",
            RelatedUrl="url1",
            Remediation={
                "Code": {
                    "CLI": "cli1",
                    "NativeIaC": "native1",
                    "Other": "other1",
                    "Terraform": "terraform1",
                },
                "Recommendation": {"Text": "text1", "Url": "url1"},
            },
            Categories=["categoryone"],
            DependsOn=["dependency1"],
            RelatedTo=["related1"],
            Notes="notes1",
            AdditionalURLs=[],
            Compliance=[],
        )
        assert metadata.AdditionalURLs == []

    def test_additional_urls_valid_with_urls(self):
        """Test AdditionalURLs with valid URLs"""
        valid_urls = [
            "https://example.com/doc1",
            "https://example.com/doc2",
            "https://aws.amazon.com/docs",
        ]
        metadata = CheckMetadata(
            Provider="aws",
            CheckID="test_check",
            CheckTitle="Test Check",
            CheckType=["type1"],
            ServiceName="test",
            SubServiceName="subservice1",
            ResourceIdTemplate="template1",
            Severity="high",
            ResourceType="resource1",
            Description="Description 1",
            Risk="risk1",
            RelatedUrl="url1",
            Remediation={
                "Code": {
                    "CLI": "cli1",
                    "NativeIaC": "native1",
                    "Other": "other1",
                    "Terraform": "terraform1",
                },
                "Recommendation": {"Text": "text1", "Url": "url1"},
            },
            Categories=["categoryone"],
            DependsOn=["dependency1"],
            RelatedTo=["related1"],
            Notes="notes1",
            AdditionalURLs=valid_urls,
            Compliance=[],
        )
        assert metadata.AdditionalURLs == valid_urls

    def test_additional_urls_invalid_not_list(self):
        """Test AdditionalURLs with non-list value"""
        with pytest.raises(ValidationError) as exc_info:
            CheckMetadata(
                Provider="aws",
                CheckID="test_check",
                CheckTitle="Test Check",
                CheckType=["type1"],
                ServiceName="test",
                SubServiceName="subservice1",
                ResourceIdTemplate="template1",
                Severity="high",
                ResourceType="resource1",
                Description="Description 1",
                Risk="risk1",
                RelatedUrl="url1",
                Remediation={
                    "Code": {
                        "CLI": "cli1",
                        "NativeIaC": "native1",
                        "Other": "other1",
                        "Terraform": "terraform1",
                    },
                    "Recommendation": {"Text": "text1", "Url": "url1"},
                },
                Categories=["categoryone"],
                DependsOn=["dependency1"],
                RelatedTo=["related1"],
                Notes="notes1",
                AdditionalURLs="not_a_list",
                Compliance=[],
            )
        assert "AdditionalURLs must be a list" in str(exc_info.value)

    def test_additional_urls_invalid_empty_items(self):
        """Test AdditionalURLs with empty string items"""
        with pytest.raises(ValidationError) as exc_info:
            CheckMetadata(
                Provider="aws",
                CheckID="test_check",
                CheckTitle="Test Check",
                CheckType=["type1"],
                ServiceName="test",
                SubServiceName="subservice1",
                ResourceIdTemplate="template1",
                Severity="high",
                ResourceType="resource1",
                Description="Description 1",
                Risk="risk1",
                RelatedUrl="url1",
                Remediation={
                    "Code": {
                        "CLI": "cli1",
                        "NativeIaC": "native1",
                        "Other": "other1",
                        "Terraform": "terraform1",
                    },
                    "Recommendation": {"Text": "text1", "Url": "url1"},
                },
                Categories=["categoryone"],
                DependsOn=["dependency1"],
                RelatedTo=["related1"],
                Notes="notes1",
                AdditionalURLs=["https://example.com", "", "https://example2.com"],
                Compliance=[],
            )
        assert "AdditionalURLs cannot contain empty items" in str(exc_info.value)

    def test_additional_urls_invalid_whitespace_items(self):
        """Test AdditionalURLs with whitespace-only items"""
        with pytest.raises(ValidationError) as exc_info:
            CheckMetadata(
                Provider="aws",
                CheckID="test_check",
                CheckTitle="Test Check",
                CheckType=["type1"],
                ServiceName="test",
                SubServiceName="subservice1",
                ResourceIdTemplate="template1",
                Severity="high",
                ResourceType="resource1",
                Description="Description 1",
                Risk="risk1",
                RelatedUrl="url1",
                Remediation={
                    "Code": {
                        "CLI": "cli1",
                        "NativeIaC": "native1",
                        "Other": "other1",
                        "Terraform": "terraform1",
                    },
                    "Recommendation": {"Text": "text1", "Url": "url1"},
                },
                Categories=["categoryone"],
                DependsOn=["dependency1"],
                RelatedTo=["related1"],
                Notes="notes1",
                AdditionalURLs=["https://example.com", "   ", "https://example2.com"],
                Compliance=[],
            )
        assert "AdditionalURLs cannot contain empty items" in str(exc_info.value)

    def test_additional_urls_invalid_duplicates(self):
        """Test AdditionalURLs with duplicate items"""
        with pytest.raises(ValidationError) as exc_info:
            CheckMetadata(
                Provider="aws",
                CheckID="test_check",
                CheckTitle="Test Check",
                CheckType=["type1"],
                ServiceName="test",
                SubServiceName="subservice1",
                ResourceIdTemplate="template1",
                Severity="high",
                ResourceType="resource1",
                Description="Description 1",
                Risk="risk1",
                RelatedUrl="url1",
                Remediation={
                    "Code": {
                        "CLI": "cli1",
                        "NativeIaC": "native1",
                        "Other": "other1",
                        "Terraform": "terraform1",
                    },
                    "Recommendation": {"Text": "text1", "Url": "url1"},
                },
                Categories=["categoryone"],
                DependsOn=["dependency1"],
                RelatedTo=["related1"],
                Notes="notes1",
                AdditionalURLs=[
                    "https://example.com",
                    "https://example2.com",
                    "https://example.com",
                ],
                Compliance=[],
            )
        assert "AdditionalURLs cannot contain duplicate items" in str(exc_info.value)

    def test_fields_with_explicit_empty_values(self):
        """Test that RelatedUrl and AdditionalURLs can be set to explicit empty values"""
        metadata = CheckMetadata(
            Provider="aws",
            CheckID="test_check_empty_fields",
            CheckTitle="Test Check with Empty Fields",
            CheckType=["type1"],
            ServiceName="test",
            SubServiceName="subservice1",
            ResourceIdTemplate="template1",
            Severity="high",
            ResourceType="resource1",
            Description="Description 1",
            Risk="risk1",
            RelatedUrl="",  # Explicit empty string
            Remediation={
                "Code": {
                    "CLI": "cli1",
                    "NativeIaC": "native1",
                    "Other": "other1",
                    "Terraform": "terraform1",
                },
                "Recommendation": {"Text": "text1", "Url": "url1"},
            },
            Categories=["categoryone"],
            DependsOn=["dependency1"],
            RelatedTo=["related1"],
            Notes="notes1",
            AdditionalURLs=[],  # Explicit empty list
            Compliance=[],
        )

        # Assert that the fields are set to empty values
        assert metadata.RelatedUrl == ""
        assert metadata.AdditionalURLs == []

    def test_fields_default_values(self):
        """Test that RelatedUrl and AdditionalURLs use proper defaults when not provided"""
        metadata = CheckMetadata(
            Provider="aws",
            CheckID="test_check_defaults",
            CheckTitle="Test Check with Default Fields",
            CheckType=["type1"],
            ServiceName="test",
            SubServiceName="subservice1",
            ResourceIdTemplate="template1",
            Severity="high",
            ResourceType="resource1",
            Description="Description 1",
            Risk="risk1",
            RelatedUrl="",
            Remediation={
                "Code": {
                    "CLI": "cli1",
                    "NativeIaC": "native1",
                    "Other": "other1",
                    "Terraform": "terraform1",
                },
                "Recommendation": {"Text": "text1", "Url": "url1"},
            },
            Categories=["categoryone"],
            DependsOn=["dependency1"],
            RelatedTo=["related1"],
            Notes="notes1",
            # AdditionalURLs not provided - should default to empty list via default_factory
            Compliance=[],
        )

        # Assert that the fields use their default values
        assert metadata.RelatedUrl == ""  # Should default to empty string
        assert metadata.AdditionalURLs == []  # Should default to empty list

    def test_related_url_none_fails(self):
        """Test that setting RelatedUrl to None raises a ValidationError"""
        with pytest.raises(ValidationError) as exc_info:
            CheckMetadata(
                Provider="aws",
                CheckID="test_check_none_related_url",
                CheckTitle="Test Check with None RelatedUrl",
                CheckType=["type1"],
                ServiceName="test",
                SubServiceName="subservice1",
                ResourceIdTemplate="template1",
                Severity="high",
                ResourceType="resource1",
                Description="Description 1",
                Risk="risk1",
                RelatedUrl=None,  # This should fail
                Remediation={
                    "Code": {
                        "CLI": "cli1",
                        "NativeIaC": "native1",
                        "Other": "other1",
                        "Terraform": "terraform1",
                    },
                    "Recommendation": {"Text": "text1", "Url": "url1"},
                },
                Categories=["categoryone"],
                DependsOn=["dependency1"],
                RelatedTo=["related1"],
                Notes="notes1",
                AdditionalURLs=[],
                Compliance=[],
            )
        # Should contain a validation error for RelatedUrl
        assert "RelatedUrl" in str(exc_info.value)

    def test_additional_urls_none_fails(self):
        """Test that setting AdditionalURLs to None raises a ValidationError"""
        with pytest.raises(ValidationError) as exc_info:
            CheckMetadata(
                Provider="aws",
                CheckID="test_check_none_additional_urls",
                CheckTitle="Test Check with None AdditionalURLs",
                CheckType=["type1"],
                ServiceName="test",
                SubServiceName="subservice1",
                ResourceIdTemplate="template1",
                Severity="high",
                ResourceType="resource1",
                Description="Description 1",
                Risk="risk1",
                RelatedUrl="https://example.com",
                Remediation={
                    "Code": {
                        "CLI": "cli1",
                        "NativeIaC": "native1",
                        "Other": "other1",
                        "Terraform": "terraform1",
                    },
                    "Recommendation": {"Text": "text1", "Url": "url1"},
                },
                Categories=["categoryone"],
                DependsOn=["dependency1"],
                RelatedTo=["related1"],
                Notes="notes1",
                AdditionalURLs=None,  # This should fail
                Compliance=[],
            )
        # Should contain the validation error we set in the validator
        assert "AdditionalURLs must be a list" in str(exc_info.value)

    def test_additional_urls_invalid_type_fails(self):
        """Test that setting AdditionalURLs to non-list value raises a ValidationError"""
        with pytest.raises(ValidationError) as exc_info:
            CheckMetadata(
                Provider="aws",
                CheckID="test_check_invalid_additional_urls",
                CheckTitle="Test Check with Invalid AdditionalURLs",
                CheckType=["type1"],
                ServiceName="test",
                SubServiceName="subservice1",
                ResourceIdTemplate="template1",
                Severity="high",
                ResourceType="resource1",
                Description="Description 1",
                Risk="risk1",
                RelatedUrl="https://example.com",
                Remediation={
                    "Code": {
                        "CLI": "cli1",
                        "NativeIaC": "native1",
                        "Other": "other1",
                        "Terraform": "terraform1",
                    },
                    "Recommendation": {"Text": "text1", "Url": "url1"},
                },
                Categories=["categoryone"],
                DependsOn=["dependency1"],
                RelatedTo=["related1"],
                Notes="notes1",
                AdditionalURLs="not_a_list",  # This should fail
                Compliance=[],
            )
        # Should contain the validation error we set in the validator
        assert "AdditionalURLs must be a list" in str(exc_info.value)


class TestCheck:
    @mock.patch("prowler.lib.check.models.CheckMetadata.parse_file")
    def test_verify_names_consistency_all_match(self, mock_parse_file):
        """Case where everything matches: CheckID == class_name == file_name"""
        mock_parse_file.return_value = mock_metadata.copy(
            update={
                "CheckID": "accessanalyzer_enabled",
                "ServiceName": "accessanalyzer",
            }
        )

        class accessanalyzer_enabled(Check):
            def execute(self):
                pass

        fake_module = mock.Mock()
        fake_module.__file__ = "/path/to/accessanalyzer_enabled.py"
        sys.modules[accessanalyzer_enabled.__module__] = fake_module

        accessanalyzer_enabled()

    @mock.patch("prowler.lib.check.models.CheckMetadata.parse_file")
    def test_verify_names_consistency_class_mismatch(self, mock_parse_file):
        """CheckID != class name, but matches file_name"""
        mock_parse_file.return_value = mock_metadata.copy(
            update={
                "CheckID": "accessanalyzer_enabled",
                "ServiceName": "accessanalyzer",
            }
        )

        class WrongClass(Check):
            def execute(self):
                pass

        fake_module = mock.Mock()
        fake_module.__file__ = "/path/to/accessanalyzer_enabled.py"
        sys.modules[WrongClass.__module__] = fake_module

        with pytest.raises(ValidationError) as excinfo:
            WrongClass()

        assert "!= class name" in str(excinfo.value)

    @mock.patch("prowler.lib.check.models.CheckMetadata.parse_file")
    def test_verify_names_consistency_file_mismatch(self, mock_parse_file):
        """CheckID == class name, but != file_name"""
        mock_parse_file.return_value = mock_metadata.copy(
            update={
                "CheckID": "accessanalyzer_enabled",
                "ServiceName": "accessanalyzer",
            }
        )

        class accessanalyzer_enabled(Check):
            def execute(self):
                pass

        fake_module = mock.Mock()
        fake_module.__file__ = "/path/to/OtherFile.py"
        sys.modules[accessanalyzer_enabled.__module__] = fake_module

        with pytest.raises(ValidationError) as excinfo:
            accessanalyzer_enabled()

        assert "!= file name" in str(excinfo.value)

    @mock.patch("prowler.lib.check.models.CheckMetadata.parse_file")
    def test_verify_names_consistency_both_mismatch(self, mock_parse_file):
        """Neither class name nor file name match the CheckID"""
        mock_parse_file.return_value = mock_metadata.copy(
            update={
                "CheckID": "accessanalyzer_enabled",
                "ServiceName": "accessanalyzer",
            }
        )

        class WrongClass(Check):
            def execute(self):
                pass

        fake_module = mock.Mock()
        fake_module.__file__ = "/path/to/OtherFile.py"
        sys.modules[WrongClass.__module__] = fake_module

        with pytest.raises(ValidationError) as excinfo:
            WrongClass()

        msg = str(excinfo.value)
        assert "!= class name" in msg
        assert "!= file name" in msg
```

--------------------------------------------------------------------------------

---[FILE: bulk_checks_metadata.py]---
Location: prowler-master/tests/lib/check/fixtures/bulk_checks_metadata.py

```python
from prowler.lib.check.models import CheckMetadata, Code, Recommendation, Remediation

test_bulk_checks_metadata = {
    "vpc_peering_routing_tables_with_least_privilege": CheckMetadata(
        Provider="aws",
        CheckID="vpc_peering_routing_tables_with_least_privilege",
        CheckTitle="Ensure routing tables for VPC peering are least access.",
        CheckType=["Infrastructure Security"],
        ServiceName="vpc",
        SubServiceName="route_table",
        ResourceIdTemplate="arn:partition:service:region:account-id:resource-id",
        Severity="medium",
        ResourceType="AwsEc2VpcPeeringConnection",
        Description="Ensure routing tables for VPC peering are least access.",
        Risk="Being highly selective in peering routing tables is a very effective way of minimizing the impact of breach as resources outside of these routes are inaccessible to the peered VPC.",
        RelatedUrl="",
        Remediation=Remediation(
            Code=Code(
                NativeIaC="",
                Terraform="",
                CLI="aws ec2 create-route",
                Other="",
            ),
            Recommendation=Recommendation(
                Text="Review routing tables of peered VPCs for whether they route all subnets of each VPC and whether that is necessary to accomplish the intended purposes for peering the VPCs.",
                Url="https://docs.aws.amazon.com/vpc/latest/peering/peering-configurations-partial-access.html",
            ),
        ),
        Categories=["forensics-ready"],
        DependsOn=[],
        RelatedTo=[],
        Notes="",
        Compliance=None,
    ),
    "vpc_subnet_different_az": CheckMetadata(
        Provider="aws",
        CheckID="vpc_subnet_different_az",
        CheckTitle="Ensure all vpc has subnets in more than one availability zone",
        CheckType=["Infrastructure Security"],
        ServiceName="vpc",
        SubServiceName="subnet",
        ResourceIdTemplate="arn:partition:service:region:account-id:resource-id",
        Severity="medium",
        ResourceType="AwsEc2Vpc",
        Description="Ensure all vpc has subnets in more than one availability zone",
        Risk="",
        RelatedUrl="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html",
        Remediation=Remediation(
            Code=Code(
                NativeIaC="", Terraform="", CLI="aws ec2 create-subnet", Other=""
            ),
            Recommendation=Recommendation(
                Text="Ensure all vpc has subnets in more than one availability zone",
                Url="",
            ),
        ),
        Categories=["secrets"],
        DependsOn=[],
        RelatedTo=[],
        Notes="",
        Compliance=None,
    ),
    "vpc_subnet_separate_private_public": CheckMetadata(
        Provider="aws",
        CheckID="vpc_subnet_separate_private_public",
        CheckTitle="Ensure all vpc has public and private subnets defined",
        CheckType=["Infrastructure Security"],
        ServiceName="vpc",
        SubServiceName="subnet",
        ResourceIdTemplate="arn:partition:service:region:account-id:resource-id",
        Severity="medium",
        ResourceType="AwsEc2Vpc",
        Description="Ensure all vpc has public and private subnets defined",
        Risk="",
        RelatedUrl="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html",
        Remediation=Remediation(
            Code=Code(
                NativeIaC="", Terraform="", CLI="aws ec2 create-subnet", Other=""
            ),
            Recommendation=Recommendation(
                Text="Ensure all vpc has public and private subnets defined", Url=""
            ),
        ),
        Categories=["internet-exposed", "trustboundaries"],
        DependsOn=[],
        RelatedTo=[],
        Notes="",
        Compliance=None,
    ),
    "workspaces_volume_encryption_enabled": CheckMetadata(
        Provider="aws",
        CheckID="workspaces_volume_encryption_enabled",
        CheckTitle="Ensure that your Amazon WorkSpaces storage volumes are encrypted in order to meet security and compliance requirements",
        CheckType=[],
        ServiceName="workspaces",
        SubServiceName="",
        ResourceIdTemplate="arn:aws:workspaces:region:account-id:workspace",
        Severity="high",
        ResourceType="AwsWorkspaces",
        Description="Ensure that your Amazon WorkSpaces storage volumes are encrypted in order to meet security and compliance requirements",
        Risk="If the value listed in the Volume Encryption column is Disabled the selected AWS WorkSpaces instance volumes (root and user volumes) are not encrypted. Therefore your data-at-rest is not protected from unauthorized access and does not meet the compliance requirements regarding data encryption.",
        RelatedUrl="https://docs.aws.amazon.com/workspaces/latest/adminguide/encrypt-workspaces.html",
        Remediation=Remediation(
            Code=Code(
                NativeIaC="https://docs.prowler.com/checks/ensure-that-workspace-root-volumes-are-encrypted#cloudformation",
                Terraform="https://docs.prowler.com/checks/ensure-that-workspace-root-volumes-are-encrypted#terraform",
                CLI="",
                Other="https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/WorkSpaces/storage-encryption.html",
            ),
            Recommendation=Recommendation(
                Text="WorkSpaces is integrated with the AWS Key Management Service (AWS KMS). This enables you to encrypt storage volumes of WorkSpaces using AWS KMS Key. When you launch a WorkSpace you can encrypt the root volume (for Microsoft Windows - the C drive; for Linux - /) and the user volume (for Windows - the D drive; for Linux - /home). Doing so ensures that the data stored at rest - disk I/O to the volume - and snapshots created from the volumes are all encrypted",
                Url="https://docs.aws.amazon.com/workspaces/latest/adminguide/encrypt-workspaces.html",
            ),
        ),
        Categories=["encryption"],
        DependsOn=[],
        RelatedTo=[],
        Notes="",
        Compliance=None,
    ),
    "workspaces_vpc_2private_1public_subnets_nat": CheckMetadata(
        Provider="aws",
        CheckID="workspaces_vpc_2private_1public_subnets_nat",
        CheckTitle="Ensure that the Workspaces VPC are deployed following the best practices using 1 public subnet and 2 private subnets with a NAT Gateway attached",
        CheckType=[],
        ServiceName="workspaces",
        SubServiceName="",
        ResourceIdTemplate="arn:aws:workspaces:region:account-id:workspace",
        Severity="medium",
        ResourceType="AwsWorkspaces",
        Description="Ensure that the Workspaces VPC are deployed following the best practices using 1 public subnet and 2 private subnets with a NAT Gateway attached",
        Risk="Proper network segmentation is a key security best practice. Workspaces VPC should be deployed using 1 public subnet and 2 private subnets with a NAT Gateway attached",
        RelatedUrl="https://docs.aws.amazon.com/workspaces/latest/adminguide/amazon-workspaces-vpc.html",
        Remediation=Remediation(
            Code=Code(NativeIaC="", Terraform="", CLI="", Other=""),
            Recommendation=Recommendation(
                Text="Follow the documentation and deploy Workspaces VPC using 1 public subnet and 2 private subnets with a NAT Gateway attached",
                Url="https://docs.aws.amazon.com/workspaces/latest/adminguide/amazon-workspaces-vpc.html",
            ),
        ),
        Categories=[],
        DependsOn=[],
        RelatedTo=[],
        Notes="",
        Compliance=None,
    ),
}
```

--------------------------------------------------------------------------------

---[FILE: checklistA.json]---
Location: prowler-master/tests/lib/check/fixtures/checklistA.json

```json
{
  "aws": [
    "check11",
    "check12",
    "check7777"
  ]
}
```

--------------------------------------------------------------------------------

````
