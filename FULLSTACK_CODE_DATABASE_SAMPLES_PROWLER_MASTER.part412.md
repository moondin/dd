---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 412
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 412 of 867)

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

---[FILE: compliance_check_test.py]---
Location: prowler-master/tests/lib/check/compliance_check_test.py

```python
from unittest import mock

from prowler.lib.check.compliance import update_checks_metadata_with_compliance
from prowler.lib.check.compliance_models import (
    CIS_Requirement_Attribute,
    CIS_Requirement_Attribute_AssessmentStatus,
    CIS_Requirement_Attribute_Profile,
    Compliance,
    Compliance_Requirement,
)
from prowler.lib.check.models import CheckMetadata

custom_compliance_metadata = {
    "framework1_aws": Compliance(
        Framework="Framework1",
        Name="Framework 1",
        Provider="aws",
        Version="1.0",
        Description="Framework 1 Description",
        Requirements=[
            Compliance_Requirement(
                Id="1.1.1",
                Description="description",
                Attributes=[
                    CIS_Requirement_Attribute(
                        Section="1. Identity",
                        Profile=CIS_Requirement_Attribute_Profile("Level 1"),
                        AssessmentStatus=CIS_Requirement_Attribute_AssessmentStatus(
                            "Manual"
                        ),
                        Description="Description",
                        RationaleStatement="Rationale",
                        ImpactStatement="Impact",
                        RemediationProcedure="Remediation",
                        AuditProcedure="Audit",
                        AdditionalInformation="Additional",
                        References="References",
                    )
                ],
                Checks=[
                    "accessanalyzer_enabled",
                    "iam_user_mfa_enabled_console_access",
                ],
            ),
            # Manual requirement
            Compliance_Requirement(
                Id="1.1.2",
                Description="description",
                Attributes=[
                    CIS_Requirement_Attribute(
                        Section="1. Identity",
                        Profile=CIS_Requirement_Attribute_Profile("Level 1"),
                        AssessmentStatus=CIS_Requirement_Attribute_AssessmentStatus(
                            "Manual"
                        ),
                        Description="Description",
                        RationaleStatement="Rationale",
                        ImpactStatement="Impact",
                        RemediationProcedure="Remediation",
                        AuditProcedure="Audit",
                        AdditionalInformation="Additional",
                        References="References",
                    )
                ],
                Checks=[],
            ),
        ],
    ),
    "framework1_azure": Compliance(
        Framework="Framework1",
        Name="Framework 1",
        Provider="azure",
        Version="1.0",
        Description="Framework 2 Description",
        Requirements=[
            Compliance_Requirement(
                Id="1.1.1",
                Description="description",
                Attributes=[
                    CIS_Requirement_Attribute(
                        Section="1. Identity",
                        Profile=CIS_Requirement_Attribute_Profile("Level 1"),
                        AssessmentStatus=CIS_Requirement_Attribute_AssessmentStatus(
                            "Manual"
                        ),
                        Description="Description",
                        RationaleStatement="Rationale",
                        ImpactStatement="Impact",
                        RemediationProcedure="Remediation",
                        AuditProcedure="Audit",
                        AdditionalInformation="Additional",
                        References="References",
                    )
                ],
                Checks=[],
            )
        ],
    ),
    "framework1_gcp": Compliance(
        Framework="Framework1",
        Name="Framework 1",
        Provider="gcp",
        Version="1.0",
        Description="Framework 2 Description",
        Requirements=[
            Compliance_Requirement(
                Id="1.1.1",
                Description="description",
                Attributes=[
                    CIS_Requirement_Attribute(
                        Section="1. Identity",
                        Profile=CIS_Requirement_Attribute_Profile("Level 1"),
                        AssessmentStatus=CIS_Requirement_Attribute_AssessmentStatus(
                            "Manual"
                        ),
                        Description="Description",
                        RationaleStatement="Rationale",
                        ImpactStatement="Impact",
                        RemediationProcedure="Remediation",
                        AuditProcedure="Audit",
                        AdditionalInformation="Additional",
                        References="References",
                    )
                ],
                Checks=[],
            )
        ],
    ),
    "framework1_k8s": Compliance(
        Framework="Framework1",
        Name="Framework 1",
        Provider="Kubernetes",
        Version="1.0",
        Description="Framework 2 Description",
        Requirements=[
            Compliance_Requirement(
                Id="1.1.1",
                Description="description",
                Attributes=[
                    CIS_Requirement_Attribute(
                        Section="1. Identity",
                        Profile=CIS_Requirement_Attribute_Profile("Level 1"),
                        AssessmentStatus=CIS_Requirement_Attribute_AssessmentStatus(
                            "Manual"
                        ),
                        Description="Description",
                        RationaleStatement="Rationale",
                        ImpactStatement="Impact",
                        RemediationProcedure="Remediation",
                        AuditProcedure="Audit",
                        AdditionalInformation="Additional",
                        References="References",
                    )
                ],
                Checks=[],
            )
        ],
    ),
    "framework1_m365": Compliance(
        Framework="Framework1",
        Name="Framework 1",
        Provider="m365",
        Version="1.0",
        Description="Framework 2 Description",
        Requirements=[
            Compliance_Requirement(
                Id="1.1.1",
                Description="description",
                Attributes=[
                    CIS_Requirement_Attribute(
                        Section="1. Identity",
                        Profile=CIS_Requirement_Attribute_Profile("E3 Level 1"),
                        AssessmentStatus=CIS_Requirement_Attribute_AssessmentStatus(
                            "Manual"
                        ),
                        Description="Description",
                        RationaleStatement="Rationale",
                        ImpactStatement="Impact",
                        RemediationProcedure="Remediation",
                        AuditProcedure="Audit",
                        AdditionalInformation="Additional",
                        References="References",
                    )
                ],
                Checks=[],
            )
        ],
    ),
}


class TestCompliance:

    def get_custom_check_metadata(self):
        return {
            "accessanalyzer_enabled": CheckMetadata(
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
            ),
            "iam_user_mfa_enabled_console_access": CheckMetadata(
                Provider="aws",
                CheckID="iam_user_mfa_enabled_console_access",
                CheckTitle="Check 2",
                CheckType=["type2"],
                ServiceName="iam",
                SubServiceName="subservice2",
                ResourceIdTemplate="template2",
                Severity="medium",
                ResourceType="resource2",
                Description="Description 2",
                Risk="risk2",
                RelatedUrl="url2",
                Remediation={
                    "Code": {
                        "CLI": "cli2",
                        "NativeIaC": "native2",
                        "Other": "other2",
                        "Terraform": "terraform2",
                    },
                    "Recommendation": {"Text": "text2", "Url": "url2"},
                },
                Categories=["categorytwo"],
                DependsOn=["dependency2"],
                RelatedTo=["related2"],
                Notes="notes2",
                Compliance=[],
            ),
        }

    def test_update_checks_metadata(self):
        bulk_compliance_frameworks = custom_compliance_metadata
        bulk_checks_metadata = self.get_custom_check_metadata()

        updated_metadata = update_checks_metadata_with_compliance(
            bulk_compliance_frameworks, bulk_checks_metadata
        )

        assert "accessanalyzer_enabled" in updated_metadata
        assert "iam_user_mfa_enabled_console_access" in updated_metadata

        accessanalyzer_enabled_compliance = updated_metadata[
            "accessanalyzer_enabled"
        ].Compliance[0]

        assert len(updated_metadata["accessanalyzer_enabled"].Compliance) == 1
        assert accessanalyzer_enabled_compliance.Framework == "Framework1"
        assert accessanalyzer_enabled_compliance.Provider == "aws"
        assert accessanalyzer_enabled_compliance.Version == "1.0"
        assert (
            accessanalyzer_enabled_compliance.Description == "Framework 1 Description"
        )
        assert len(accessanalyzer_enabled_compliance.Requirements) == 1

        accessanalyzer_enabled_requirement = (
            accessanalyzer_enabled_compliance.Requirements[0]
        )
        assert accessanalyzer_enabled_requirement.Id == "1.1.1"
        assert accessanalyzer_enabled_requirement.Description == "description"
        assert len(accessanalyzer_enabled_requirement.Attributes) == 1

        accessanalyzer_enabled_attribute = (
            accessanalyzer_enabled_requirement.Attributes[0]
        )
        assert accessanalyzer_enabled_attribute.Section == "1. Identity"
        assert accessanalyzer_enabled_attribute.Profile == "Level 1"
        assert accessanalyzer_enabled_attribute.AssessmentStatus == "Manual"
        assert accessanalyzer_enabled_attribute.Description == "Description"
        assert accessanalyzer_enabled_attribute.RationaleStatement == "Rationale"
        assert accessanalyzer_enabled_attribute.ImpactStatement == "Impact"
        assert accessanalyzer_enabled_attribute.RemediationProcedure == "Remediation"
        assert accessanalyzer_enabled_attribute.AuditProcedure == "Audit"
        assert accessanalyzer_enabled_attribute.AdditionalInformation == "Additional"
        assert accessanalyzer_enabled_attribute.References == "References"

    def test_list_no_provider(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        list_compliance = Compliance.list(bulk_compliance_frameworks)

        assert len(list_compliance) == 5
        assert list_compliance[0] == "framework1_aws"
        assert list_compliance[1] == "framework1_azure"
        assert list_compliance[2] == "framework1_gcp"
        assert list_compliance[3] == "framework1_k8s"
        assert list_compliance[4] == "framework1_m365"

    def test_list_with_provider_aws(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        list_compliance = Compliance.list(bulk_compliance_frameworks, provider="aws")

        assert len(list_compliance) == 1
        assert list_compliance[0] == "framework1_aws"

    def test_list_with_provider_azure(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        list_compliance = Compliance.list(bulk_compliance_frameworks, provider="azure")

        assert len(list_compliance) == 1
        assert list_compliance[0] == "framework1_azure"

    def test_list_with_provider_gcp(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        list_compliance = Compliance.list(bulk_compliance_frameworks, provider="gcp")

        assert len(list_compliance) == 1
        assert list_compliance[0] == "framework1_gcp"

    def test_list_with_provider_k8s(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        list_compliance = Compliance.list(bulk_compliance_frameworks, provider="k8s")

        assert len(list_compliance) == 1
        assert list_compliance[0] == "framework1_k8s"

    def test_list_with_provider_m365(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        list_compliance = Compliance.list(bulk_compliance_frameworks, provider="m365")

        assert len(list_compliance) == 1
        assert list_compliance[0] == "framework1_m365"

    def test_get_compliance_frameworks(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        compliance_framework = Compliance.get(
            bulk_compliance_frameworks, compliance_framework_name="framework1_aws"
        )

        assert compliance_framework.Framework == "Framework1"
        assert compliance_framework.Provider == "aws"
        assert compliance_framework.Version == "1.0"
        assert compliance_framework.Description == "Framework 1 Description"
        assert len(compliance_framework.Requirements) == 2

        compliance_framework = Compliance.get(
            bulk_compliance_frameworks, compliance_framework_name="framework1_azure"
        )

        assert compliance_framework.Framework == "Framework1"
        assert compliance_framework.Provider == "azure"
        assert compliance_framework.Version == "1.0"
        assert compliance_framework.Description == "Framework 2 Description"
        assert len(compliance_framework.Requirements) == 1

        compliance_framework = Compliance.get(
            bulk_compliance_frameworks, compliance_framework_name="framework1_gcp"
        )

        assert compliance_framework.Framework == "Framework1"
        assert compliance_framework.Provider == "gcp"
        assert compliance_framework.Version == "1.0"
        assert compliance_framework.Description == "Framework 2 Description"
        assert len(compliance_framework.Requirements) == 1

        compliance_framework = Compliance.get(
            bulk_compliance_frameworks, compliance_framework_name="framework1_k8s"
        )

        assert compliance_framework.Framework == "Framework1"
        assert compliance_framework.Provider == "Kubernetes"
        assert compliance_framework.Version == "1.0"
        assert compliance_framework.Description == "Framework 2 Description"
        assert len(compliance_framework.Requirements) == 1

        compliance_framework = Compliance.get(
            bulk_compliance_frameworks, compliance_framework_name="framework1_m365"
        )

        assert compliance_framework.Framework == "Framework1"
        assert compliance_framework.Provider == "m365"
        assert compliance_framework.Version == "1.0"
        assert compliance_framework.Description == "Framework 2 Description"
        assert len(compliance_framework.Requirements) == 1
        assert compliance_framework.Requirements[0].Id == "1.1.1"
        assert compliance_framework.Requirements[0].Description == "description"
        assert len(compliance_framework.Requirements[0].Attributes) == 1
        assert (
            compliance_framework.Requirements[0].Attributes[0].Section == "1. Identity"
        )
        assert (
            compliance_framework.Requirements[0].Attributes[0].Profile == "E3 Level 1"
        )
        assert (
            compliance_framework.Requirements[0].Attributes[0].AssessmentStatus
            == "Manual"
        )
        assert (
            compliance_framework.Requirements[0].Attributes[0].Description
            == "Description"
        )
        assert (
            compliance_framework.Requirements[0].Attributes[0].RationaleStatement
            == "Rationale"
        )
        assert (
            compliance_framework.Requirements[0].Attributes[0].ImpactStatement
            == "Impact"
        )
        assert (
            compliance_framework.Requirements[0].Attributes[0].RemediationProcedure
            == "Remediation"
        )
        assert (
            compliance_framework.Requirements[0].Attributes[0].AuditProcedure == "Audit"
        )
        assert (
            compliance_framework.Requirements[0].Attributes[0].AdditionalInformation
            == "Additional"
        )
        assert (
            compliance_framework.Requirements[0].Attributes[0].References
            == "References"
        )

    def test_get_non_existent_framework(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        compliance_framework = Compliance.get(
            bulk_compliance_frameworks, compliance_framework_name="non_existent"
        )

        assert compliance_framework is None

    def test_list_compliance_requirements_no_compliance(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        list_requirements = Compliance.list_requirements(bulk_compliance_frameworks)

        assert len(list_requirements) == 0

    def test_list_compliance_requirements_with_compliance(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        list_requirements = Compliance.list_requirements(
            bulk_compliance_frameworks, compliance_framework="framework1_aws"
        )

        assert len(list_requirements) == 2
        assert list_requirements[0] == "1.1.1"
        assert list_requirements[1] == "1.1.2"

        list_requirements = Compliance.list_requirements(
            bulk_compliance_frameworks, compliance_framework="framework1_azure"
        )

        assert len(list_requirements) == 1
        assert list_requirements[0] == "1.1.1"

    def test_get_compliance_requirement(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        compliance_requirement = Compliance.get_requirement(
            bulk_compliance_frameworks,
            compliance_framework="framework1_aws",
            requirement_id="1.1.1",
        )

        assert compliance_requirement.Id == "1.1.1"
        assert compliance_requirement.Description == "description"
        assert len(compliance_requirement.Attributes) == 1

        compliance_requirement = Compliance.get_requirement(
            bulk_compliance_frameworks,
            compliance_framework="framework1_aws",
            requirement_id="1.1.2",
        )

        assert compliance_requirement.Id == "1.1.2"
        assert compliance_requirement.Description == "description"
        assert len(compliance_requirement.Attributes) == 1

        compliance_requirement = Compliance.get_requirement(
            bulk_compliance_frameworks,
            compliance_framework="framework1_azure",
            requirement_id="1.1.1",
        )

        assert compliance_requirement.Id == "1.1.1"
        assert compliance_requirement.Description == "description"
        assert len(compliance_requirement.Attributes) == 1

    def test_get_compliance_requirement_not_found(self):
        bulk_compliance_frameworks = custom_compliance_metadata

        compliance_requirement = Compliance.get_requirement(
            bulk_compliance_frameworks,
            compliance_framework="framework1_aws",
            requirement_id="1.1.3",
        )

        assert compliance_requirement is None

    @mock.patch("prowler.lib.check.compliance_models.load_compliance_framework")
    @mock.patch("os.stat")
    @mock.patch("os.path.isfile")
    @mock.patch("os.listdir")
    @mock.patch("prowler.lib.check.compliance_models.list_compliance_modules")
    def test_get_bulk(
        self,
        mock_list_modules,
        mock_listdir,
        mock_isfile,
        mock_stat,
        mock_load_compliance,
    ):
        object = mock.Mock()
        object.path = "/path/to/compliance"
        object.name = "framework1_aws"
        mock_list_modules.return_value = [object]

        mock_listdir.return_value = ["framework1_aws.json"]

        mock_isfile.return_value = True

        mock_stat.return_value.st_size = 100

        mock_load_compliance.return_value = mock.Mock(
            Framework="Framework1", Provider="aws"
        )

        from prowler.lib.check.compliance_models import Compliance

        result = Compliance.get_bulk(provider="aws")

        assert len(result) == 1
        assert "framework1_aws" in result.keys()
        mock_list_modules.assert_called_once()
```

--------------------------------------------------------------------------------

---[FILE: custom_checks_metadata_test.py]---
Location: prowler-master/tests/lib/check/custom_checks_metadata_test.py

```python
import logging
import os

import pytest

from prowler.lib.check.custom_checks_metadata import (
    parse_custom_checks_metadata_file,
    update_check_metadata,
    update_checks_metadata,
)
from prowler.lib.check.models import CheckMetadata, Code, Recommendation, Remediation

CUSTOM_CHECKS_METADATA_FIXTURE_FILE = f"{os.path.dirname(os.path.realpath(__file__))}/fixtures/custom_checks_metadata_example.yaml"
CUSTOM_CHECKS_METADATA_FIXTURE_FILE_NOT_VALID = f"{os.path.dirname(os.path.realpath(__file__))}/fixtures/custom_checks_metadata_example_not_valid.yaml"

AWS_PROVIDER = "aws"
AZURE_PROVIDER = "azure"
GCP_PROVIDER = "gcp"
KUBERNETES_PROVIDER = "kubernetes"

S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME = "s3_bucket_level_public_access_block"
S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_SEVERITY = "medium"
S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_REMEDIATION_TERRAFORM = (
    "https://docs.prowler.com/checks/aws/s3-policies/bc_aws_s3_20#terraform"
)
S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_REMEDIATION_OTHER = "https://github.com/cloudmatos/matos/tree/master/remediations/aws/s3/s3/block-public-access"
S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_REMEDIATION_TEXT = (
    "Enable the S3 bucket level public access block."
)
S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_REMEDIATION_URL = "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"


class TestCustomChecksMetadata:
    def get_custom_check_metadata(self):
        return CheckMetadata(
            Provider="aws",
            CheckID=S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME,
            CheckTitle="Check S3 Bucket Level Public Access Block.",
            CheckType=["Data Protection"],
            CheckAliases=[],
            ServiceName="s3",
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
                    Terraform=S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_REMEDIATION_TERRAFORM,
                    CLI="aws s3api put-public-access-block --region <REGION_NAME> --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true --bucket <BUCKET_NAME>",
                    Other=S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_REMEDIATION_OTHER,
                ),
                Recommendation=Recommendation(
                    Text=S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_REMEDIATION_TEXT,
                    Url=S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_REMEDIATION_URL,
                ),
            ),
            Categories=[],
            DependsOn=[],
            RelatedTo=[],
            Notes="",
            Compliance=[],
        )

    def test_parse_custom_checks_metadata_file_for_aws(self):
        assert parse_custom_checks_metadata_file(
            AWS_PROVIDER, CUSTOM_CHECKS_METADATA_FIXTURE_FILE
        ) == {
            "Checks": {
                "s3_bucket_level_public_access_block": {
                    "Severity": "high",
                    "CheckTitle": "S3 Bucket Level Public Access Block",
                    "Description": "This check ensures that the S3 bucket level public access block is enabled.",
                    "Risk": "This check is important because it ensures that the S3 bucket level public access block is enabled.",
                    "RelatedUrl": "https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html",
                    "Remediation": {
                        "Code": {
                            "CLI": "aws s3api put-public-access-block --bucket <bucket-name> --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true",
                            "NativeIaC": "https://aws.amazon.com/es/s3/features/block-public-access/",
                            "Other": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html",
                            "Terraform": "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block",
                        },
                        "Recommendation": {
                            "Text": "Enable the S3 bucket level public access block.",
                            "Url": "https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html",
                        },
                    },
                },
                "s3_bucket_no_mfa_delete": {
                    "Severity": "high",
                    "CheckTitle": "S3 Bucket No MFA Delete",
                    "Description": "This check ensures that the S3 bucket does not allow delete operations without MFA.",
                    "Risk": "This check is important because it ensures that the S3 bucket does not allow delete operations without MFA.",
                    "RelatedUrl": "https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html",
                    "Remediation": {
                        "Code": {
                            "CLI": "aws s3api put-bucket-versioning --bucket <bucket-name> --versioning-configuration Status=Enabled",
                            "NativeIaC": "https://aws.amazon.com/es/s3/features/versioning/",
                            "Other": "https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html",
                            "Terraform": "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_versioning",
                        },
                        "Recommendation": {
                            "Text": "Enable versioning on the S3 bucket.",
                            "Url": "https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html",
                        },
                    },
                },
            }
        }

    def test_parse_custom_checks_metadata_file_for_azure(self):
        assert parse_custom_checks_metadata_file(
            AZURE_PROVIDER, CUSTOM_CHECKS_METADATA_FIXTURE_FILE
        ) == {
            "Checks": {
                "storage_infrastructure_encryption_is_enabled": {
                    "Severity": "medium",
                    "CheckTitle": "Storage Infrastructure Encryption Is Enabled",
                    "Description": "This check ensures that storage infrastructure encryption is enabled.",
                    "Risk": "This check is important because it ensures that storage infrastructure encryption is enabled.",
                    "RelatedUrl": "https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption",
                    "Remediation": {
                        "Code": {
                            "CLI": "az storage account update --name <storage-account-name> --resource-group <resource-group-name> --set properties.encryption.services.blob.enabled=true properties.encryption.services.file.enabled=true properties.encryption.services.queue.enabled=true properties.encryption.services.table.enabled=true",
                            "NativeIaC": "https://docs.microsoft.com/en-us/azure/templates/microsoft.storage/storageaccounts",
                            "Other": "https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption",
                            "Terraform": "https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account",
                        },
                        "Recommendation": {
                            "Text": "Enable storage infrastructure encryption.",
                            "Url": "https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption",
                        },
                    },
                }
            }
        }

    def test_parse_custom_checks_metadata_file_for_gcp(self):
        assert parse_custom_checks_metadata_file(
            GCP_PROVIDER, CUSTOM_CHECKS_METADATA_FIXTURE_FILE
        ) == {
            "Checks": {
                "compute_instance_public_ip": {
                    "Severity": "critical",
                    "CheckTitle": "Compute Instance Public IP",
                    "Description": "This check ensures that the compute instance does not have a public IP.",
                    "Risk": "This check is important because it ensures that the compute instance does not have a public IP.",
                    "RelatedUrl": "https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address",
                    "Remediation": {
                        "Code": {
                            "CLI": "gcloud compute instances describe INSTANCE_NAME --zone=ZONE",
                            "NativeIaC": "https://cloud.google.com/compute/docs/reference/rest/v1/instances",
                            "Other": "https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address",
                            "Terraform": "https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance",
                        },
                        "Recommendation": {
                            "Text": "Remove the public IP from the compute instance.",
                            "Url": "https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address",
                        },
                    },
                }
            }
        }

    def test_parse_custom_checks_metadata_file_for_kubernetes(self):
        assert parse_custom_checks_metadata_file(
            KUBERNETES_PROVIDER, CUSTOM_CHECKS_METADATA_FIXTURE_FILE
        ) == {
            "Checks": {
                "apiserver_anonymous_requests": {
                    "Severity": "low",
                    "CheckTitle": "APIServer Anonymous Requests",
                    "Description": "This check ensures that anonymous requests to the APIServer are disabled.",
                    "Risk": "This check is important because it ensures that anonymous requests to the APIServer are disabled.",
                    "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/",
                    "Remediation": {
                        "Code": {
                            "CLI": "--anonymous-auth=false",
                            "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-anonymous-auth-argument-is-set-to-false-1#kubernetes",
                            "Other": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/",
                            "Terraform": "https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/cluster_role_binding",
                        },
                        "Recommendation": {
                            "Text": "Disable anonymous requests to the APIServer.",
                            "Url": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/",
                        },
                    },
                }
            }
        }

    def test_parse_custom_checks_metadata_file_for_aws_validation_error(self, caplog):
        caplog.set_level(logging.CRITICAL)

        with pytest.raises(SystemExit) as error:
            parse_custom_checks_metadata_file(
                AWS_PROVIDER, CUSTOM_CHECKS_METADATA_FIXTURE_FILE_NOT_VALID
            )
        assert error.type == SystemExit
        assert error.value.code == 1
        assert "'Checks' is a required property" in caplog.text

    def test_update_checks_metadata(self):
        updated_severity = "high"
        bulk_checks_metadata = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_metadata(),
        }
        custom_checks_metadata = {
            "Checks": {
                S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: {
                    "Severity": updated_severity
                },
            }
        }

        bulk_checks_metadata_updated = update_checks_metadata(
            bulk_checks_metadata, custom_checks_metadata
        ).get(S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME)

        assert bulk_checks_metadata_updated.Severity == updated_severity

    def test_update_checks_metadata_one_field(self):
        updated_terraform = (
            "https://docs.prowler.com/checks/aws/s3-policies/bc_aws_s3_21/#terraform"
        )
        updated_text = "You can enable Public Access Block at the bucket level to prevent the exposure of your data stored in S3."
        bulk_checks_metadata = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_metadata(),
        }

        custom_checks_metadata = {
            "Checks": {
                S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: {
                    "Remediation": {
                        "Code": {"Terraform": updated_terraform},
                        "Recommendation": {
                            "Text": updated_text,
                        },
                    },
                },
            }
        }

        bulk_checks_metadata_updated = update_checks_metadata(
            bulk_checks_metadata, custom_checks_metadata
        ).get(S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME)
        assert (
            bulk_checks_metadata_updated.Remediation.Code.Terraform == updated_terraform
        )
        assert (
            bulk_checks_metadata_updated.Remediation.Code.Other
            == S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_REMEDIATION_OTHER
        )
        assert (
            bulk_checks_metadata_updated.Remediation.Recommendation.Text == updated_text
        )
        assert (
            bulk_checks_metadata_updated.Remediation.Recommendation.Url
            == S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_REMEDIATION_URL
        )

    def test_update_checks_metadata_not_present_field(self):
        bulk_checks_metadata = {
            S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: self.get_custom_check_metadata(),
        }
        custom_checks_metadata = {
            "Checks": {
                S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME: {
                    "RandomField": "random_value"
                },
            }
        }

        bulk_checks_metadata_updated = update_checks_metadata(
            bulk_checks_metadata, custom_checks_metadata
        ).get(S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_NAME)

        assert (
            bulk_checks_metadata_updated.Severity
            == S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_SEVERITY
        )

    def test_update_check_metadata(self):
        updated_severity = "high"
        custom_checks_metadata = {"Severity": updated_severity}

        check_metadata_updated = update_check_metadata(
            self.get_custom_check_metadata(), custom_checks_metadata
        )
        assert check_metadata_updated.Severity == updated_severity

    def test_update_check_metadata_not_present_field(self):
        custom_checks_metadata = {"RandomField": "random_value"}

        check_metadata_updated = update_check_metadata(
            self.get_custom_check_metadata(), custom_checks_metadata
        )
        assert (
            check_metadata_updated.Severity
            == S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_SEVERITY
        )

    def test_update_check_metadata_none_custom_metadata(self):
        custom_checks_metadata = None

        check_metadata_updated = update_check_metadata(
            self.get_custom_check_metadata(), custom_checks_metadata
        )
        assert (
            check_metadata_updated.Severity
            == S3_BUCKET_LEVEL_PUBLIC_ACCESS_BLOCK_SEVERITY
        )
```

--------------------------------------------------------------------------------

````
