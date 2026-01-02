---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 421
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 421 of 867)

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

---[FILE: aws_well_architected_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/aws_well_architected/aws_well_architected_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.aws_well_architected.aws_well_architected import (
    AWSWellArchitected,
)
from prowler.lib.outputs.compliance.aws_well_architected.models import (
    AWSWellArchitectedModel,
)
from tests.lib.outputs.compliance.fixtures import AWS_WELL_ARCHITECTED
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class TestAWSWellArchitected:
    def test_output_transform(self):
        findings = [
            generate_finding_output(
                compliance={
                    "AWS-Well-Architected-Framework-Security-Pillar": "SEC01-BP01"
                }
            )
        ]

        output = AWSWellArchitected(
            findings, AWS_WELL_ARCHITECTED, file_extension=".csv"
        )
        output_data = output.data[0]
        assert isinstance(output_data, AWSWellArchitectedModel)
        assert output_data.Provider == "aws"
        assert output_data.Framework == AWS_WELL_ARCHITECTED.Framework
        assert output_data.Name == AWS_WELL_ARCHITECTED.Name
        assert output_data.AccountId == AWS_ACCOUNT_NUMBER
        assert output_data.Region == AWS_REGION_EU_WEST_1
        assert output_data.Requirements_Id == AWS_WELL_ARCHITECTED.Requirements[0].Id
        assert (
            output_data.Requirements_Description
            == AWS_WELL_ARCHITECTED.Requirements[0].Description
        )
        assert (
            output_data.Requirements_Attributes_Name
            == AWS_WELL_ARCHITECTED.Requirements[0].Attributes[0].Name
        )
        assert (
            output_data.Requirements_Attributes_WellArchitectedQuestionId
            == AWS_WELL_ARCHITECTED.Requirements[0]
            .Attributes[0]
            .WellArchitectedQuestionId
        )
        assert (
            output_data.Requirements_Attributes_WellArchitectedPracticeId
            == AWS_WELL_ARCHITECTED.Requirements[0]
            .Attributes[0]
            .WellArchitectedPracticeId
        )
        assert (
            output_data.Requirements_Attributes_Section
            == AWS_WELL_ARCHITECTED.Requirements[0].Attributes[0].Section
        )
        assert (
            output_data.Requirements_Attributes_SubSection
            == AWS_WELL_ARCHITECTED.Requirements[0].Attributes[0].SubSection
        )
        assert (
            output_data.Requirements_Attributes_LevelOfRisk
            == AWS_WELL_ARCHITECTED.Requirements[0].Attributes[0].LevelOfRisk
        )
        assert (
            output_data.Requirements_Attributes_AssessmentMethod
            == AWS_WELL_ARCHITECTED.Requirements[0].Attributes[0].AssessmentMethod
        )
        assert (
            output_data.Requirements_Attributes_Description
            == AWS_WELL_ARCHITECTED.Requirements[0].Attributes[0].Description
        )
        assert (
            output_data.Requirements_Attributes_ImplementationGuidanceUrl
            == AWS_WELL_ARCHITECTED.Requirements[0]
            .Attributes[0]
            .ImplementationGuidanceUrl
        )
        assert output_data.Status == "PASS"
        assert output_data.StatusExtended == ""
        assert output_data.ResourceId == ""
        assert output_data.ResourceName == ""
        assert output_data.CheckId == "service_test_check_id"
        assert output_data.Muted is False
        # Test manual check
        output_data_manual = output.data[1]
        assert output_data_manual.Provider == "aws"
        assert output_data_manual.Framework == AWS_WELL_ARCHITECTED.Framework
        assert output_data_manual.Name == AWS_WELL_ARCHITECTED.Name
        assert output_data_manual.AccountId == ""
        assert output_data_manual.Region == ""
        assert (
            output_data_manual.Requirements_Id
            == AWS_WELL_ARCHITECTED.Requirements[1].Id
        )
        assert (
            output_data_manual.Requirements_Description
            == AWS_WELL_ARCHITECTED.Requirements[1].Description
        )
        assert (
            output_data_manual.Requirements_Attributes_Name
            == AWS_WELL_ARCHITECTED.Requirements[1].Attributes[0].Name
        )
        assert (
            output_data_manual.Requirements_Attributes_WellArchitectedQuestionId
            == AWS_WELL_ARCHITECTED.Requirements[1]
            .Attributes[0]
            .WellArchitectedQuestionId
        )
        assert (
            output_data_manual.Requirements_Attributes_WellArchitectedPracticeId
            == AWS_WELL_ARCHITECTED.Requirements[1]
            .Attributes[0]
            .WellArchitectedPracticeId
        )
        assert (
            output_data_manual.Requirements_Attributes_Section
            == AWS_WELL_ARCHITECTED.Requirements[1].Attributes[0].Section
        )
        assert (
            output_data_manual.Requirements_Attributes_SubSection
            == AWS_WELL_ARCHITECTED.Requirements[1].Attributes[0].SubSection
        )
        assert (
            output_data_manual.Requirements_Attributes_LevelOfRisk
            == AWS_WELL_ARCHITECTED.Requirements[1].Attributes[0].LevelOfRisk
        )
        assert (
            output_data_manual.Requirements_Attributes_AssessmentMethod
            == AWS_WELL_ARCHITECTED.Requirements[1].Attributes[0].AssessmentMethod
        )
        assert (
            output_data_manual.Requirements_Attributes_Description
            == AWS_WELL_ARCHITECTED.Requirements[1].Attributes[0].Description
        )
        assert (
            output_data_manual.Requirements_Attributes_ImplementationGuidanceUrl
            == AWS_WELL_ARCHITECTED.Requirements[1]
            .Attributes[0]
            .ImplementationGuidanceUrl
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.aws_well_architected.aws_well_architected.timestamp",
        "2025-01-01 00:00:00",
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [
            generate_finding_output(
                compliance={
                    "AWS-Well-Architected-Framework-Security-Pillar": "SEC01-BP01"
                }
            )
        ]
        output = AWSWellArchitected(findings, AWS_WELL_ARCHITECTED)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()

        expected_csv = f"PROVIDER;DESCRIPTION;ACCOUNTID;REGION;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_NAME;REQUIREMENTS_ATTRIBUTES_WELLARCHITECTEDQUESTIONID;REQUIREMENTS_ATTRIBUTES_WELLARCHITECTEDPRACTICEID;REQUIREMENTS_ATTRIBUTES_SECTION;REQUIREMENTS_ATTRIBUTES_SUBSECTION;REQUIREMENTS_ATTRIBUTES_LEVELOFRISK;REQUIREMENTS_ATTRIBUTES_ASSESSMENTMETHOD;REQUIREMENTS_ATTRIBUTES_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_IMPLEMENTATIONGUIDANCEURL;STATUS;STATUSEXTENDED;RESOURCEID;CHECKID;MUTED;RESOURCENAME;FRAMEWORK;NAME\r\naws;Best Practices for AWS Well-Architected Framework Security Pillar. The focus of this framework is the security pillar of the AWS Well-Architected Framework. It provides guidance to help you apply best practices, current recommendations in the design, delivery, and maintenance of secure AWS workloads.;123456789012;eu-west-1;{datetime.now()};SEC01-BP01;Establish common guardrails and isolation between environments (such as production, development, and test) and workloads through a multi-account strategy. Account-level separation is strongly recommended, as it provides a strong isolation boundary for security, billing, and access.;SEC01-BP01 Separate workloads using accounts;securely-operate;sec_securely_operate_multi_accounts;Security foundations;AWS account management and separation;High;Automated;Establish common guardrails and isolation between environments (such as production, development, and test) and workloads through a multi-account strategy. Account-level separation is strongly recommended, as it provides a strong isolation boundary for security, billing, and access.;https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/sec_securely_operate_multi_accounts.html#implementation-guidance.;PASS;;;service_test_check_id;False;;AWS-Well-Architected-Framework-Security-Pillar;AWS Well-Architected Framework Security Pillar\r\naws;Best Practices for AWS Well-Architected Framework Security Pillar. The focus of this framework is the security pillar of the AWS Well-Architected Framework. It provides guidance to help you apply best practices, current recommendations in the design, delivery, and maintenance of secure AWS workloads.;;;{datetime.now()};SEC01-BP02;Establish common guardrails and isolation between environments (such as production, development, and test) and workloads through a multi-account strategy. Account-level separation is strongly recommended, as it provides a strong isolation boundary for security, billing, and access.;SEC01-BP01 Separate workloads using accounts;securely-operate;sec_securely_operate_multi_accounts;Security foundations;AWS account management and separation;High;Automated;Establish common guardrails and isolation between environments (such as production, development, and test) and workloads through a multi-account strategy. Account-level separation is strongly recommended, as it provides a strong isolation boundary for security, billing, and access.;https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/sec_securely_operate_multi_accounts.html#implementation-guidance.;MANUAL;Manual check;manual_check;manual;False;Manual check;AWS-Well-Architected-Framework-Security-Pillar;AWS Well-Architected Framework Security Pillar\r\n"
        assert content == expected_csv
```

--------------------------------------------------------------------------------

---[FILE: cis_aws_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/cis/cis_aws_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.cis.cis_aws import AWSCIS
from prowler.lib.outputs.compliance.cis.models import AWSCISModel
from tests.lib.outputs.compliance.fixtures import CIS_1_4_AWS
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class TestAWSCIS:
    def test_output_transform(self):
        findings = [generate_finding_output(compliance={"CIS-1.4": "2.1.3"})]

        output = AWSCIS(findings, CIS_1_4_AWS)
        output_data = output.data[0]
        assert isinstance(output_data, AWSCISModel)
        assert output_data.Provider == "aws"
        assert output_data.Framework == CIS_1_4_AWS.Framework
        assert output_data.Name == CIS_1_4_AWS.Name
        assert output_data.AccountId == AWS_ACCOUNT_NUMBER
        assert output_data.Region == AWS_REGION_EU_WEST_1
        assert output_data.Description == CIS_1_4_AWS.Description
        assert output_data.Requirements_Id == CIS_1_4_AWS.Requirements[0].Id
        assert (
            output_data.Requirements_Description
            == CIS_1_4_AWS.Requirements[0].Description
        )
        assert (
            output_data.Requirements_Attributes_Section
            == CIS_1_4_AWS.Requirements[0].Attributes[0].Section
        )
        assert (
            output_data.Requirements_Attributes_SubSection
            == CIS_1_4_AWS.Requirements[0].Attributes[0].SubSection
        )
        assert (
            output_data.Requirements_Attributes_Profile
            == CIS_1_4_AWS.Requirements[0].Attributes[0].Profile
        )
        assert (
            output_data.Requirements_Attributes_AssessmentStatus
            == CIS_1_4_AWS.Requirements[0].Attributes[0].AssessmentStatus
        )
        assert (
            output_data.Requirements_Attributes_Description
            == CIS_1_4_AWS.Requirements[0].Attributes[0].Description
        )
        assert (
            output_data.Requirements_Attributes_RationaleStatement
            == CIS_1_4_AWS.Requirements[0].Attributes[0].RationaleStatement
        )
        assert (
            output_data.Requirements_Attributes_ImpactStatement
            == CIS_1_4_AWS.Requirements[0].Attributes[0].ImpactStatement
        )
        assert (
            output_data.Requirements_Attributes_RemediationProcedure
            == CIS_1_4_AWS.Requirements[0].Attributes[0].RemediationProcedure
        )
        assert (
            output_data.Requirements_Attributes_AuditProcedure
            == CIS_1_4_AWS.Requirements[0].Attributes[0].AuditProcedure
        )
        assert (
            output_data.Requirements_Attributes_AdditionalInformation
            == CIS_1_4_AWS.Requirements[0].Attributes[0].AdditionalInformation
        )
        assert (
            output_data.Requirements_Attributes_References
            == CIS_1_4_AWS.Requirements[0].Attributes[0].References
        )
        assert output_data.Status == "PASS"
        assert output_data.StatusExtended == ""
        assert output_data.ResourceId == ""
        assert output_data.ResourceName == ""
        assert output_data.CheckId == "service_test_check_id"
        assert output_data.Muted is False
        # Test manual check
        output_data_manual = output.data[1]
        assert output_data_manual.Provider == "aws"
        assert output_data_manual.Framework == CIS_1_4_AWS.Framework
        assert output_data_manual.Name == CIS_1_4_AWS.Name
        assert output_data_manual.AccountId == ""
        assert output_data_manual.Region == ""
        assert output_data_manual.Description == CIS_1_4_AWS.Description
        assert output_data_manual.Requirements_Id == CIS_1_4_AWS.Requirements[1].Id
        assert (
            output_data_manual.Requirements_Description
            == CIS_1_4_AWS.Requirements[1].Description
        )
        assert (
            output_data_manual.Requirements_Attributes_Section
            == CIS_1_4_AWS.Requirements[1].Attributes[0].Section
        )
        assert (
            output_data_manual.Requirements_Attributes_SubSection
            == CIS_1_4_AWS.Requirements[1].Attributes[0].SubSection
        )
        assert (
            output_data_manual.Requirements_Attributes_Profile
            == CIS_1_4_AWS.Requirements[1].Attributes[0].Profile
        )
        assert (
            output_data_manual.Requirements_Attributes_AssessmentStatus
            == CIS_1_4_AWS.Requirements[1].Attributes[0].AssessmentStatus
        )
        assert (
            output_data_manual.Requirements_Attributes_Description
            == CIS_1_4_AWS.Requirements[1].Attributes[0].Description
        )
        assert (
            output_data_manual.Requirements_Attributes_RationaleStatement
            == CIS_1_4_AWS.Requirements[1].Attributes[0].RationaleStatement
        )
        assert (
            output_data_manual.Requirements_Attributes_ImpactStatement
            == CIS_1_4_AWS.Requirements[1].Attributes[0].ImpactStatement
        )
        assert (
            output_data_manual.Requirements_Attributes_RemediationProcedure
            == CIS_1_4_AWS.Requirements[1].Attributes[0].RemediationProcedure
        )
        assert (
            output_data_manual.Requirements_Attributes_AuditProcedure
            == CIS_1_4_AWS.Requirements[1].Attributes[0].AuditProcedure
        )
        assert (
            output_data_manual.Requirements_Attributes_AdditionalInformation
            == CIS_1_4_AWS.Requirements[1].Attributes[0].AdditionalInformation
        )
        assert (
            output_data_manual.Requirements_Attributes_References
            == CIS_1_4_AWS.Requirements[1].Attributes[0].References
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.cis.cis_aws.timestamp", "2025-01-01 00:00:00"
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [generate_finding_output(compliance={"CIS-1.4": "2.1.3"})]
        output = AWSCIS(findings, CIS_1_4_AWS)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        expected_csv = f'PROVIDER;DESCRIPTION;ACCOUNTID;REGION;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_SECTION;REQUIREMENTS_ATTRIBUTES_SUBSECTION;REQUIREMENTS_ATTRIBUTES_PROFILE;REQUIREMENTS_ATTRIBUTES_ASSESSMENTSTATUS;REQUIREMENTS_ATTRIBUTES_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_RATIONALESTATEMENT;REQUIREMENTS_ATTRIBUTES_IMPACTSTATEMENT;REQUIREMENTS_ATTRIBUTES_REMEDIATIONPROCEDURE;REQUIREMENTS_ATTRIBUTES_AUDITPROCEDURE;REQUIREMENTS_ATTRIBUTES_ADDITIONALINFORMATION;REQUIREMENTS_ATTRIBUTES_DEFAULTVALUE;REQUIREMENTS_ATTRIBUTES_REFERENCES;STATUS;STATUSEXTENDED;RESOURCEID;RESOURCENAME;CHECKID;MUTED;FRAMEWORK;NAME\r\naws;The CIS Benchmark for CIS Amazon Web Services Foundations Benchmark, v1.4.0, Level 1 and 2 provides prescriptive guidance for configuring security options for a subset of Amazon Web Services. It has an emphasis on foundational, testable, and architecture agnostic settings;123456789012;eu-west-1;{datetime.now()};2.1.3;Ensure MFA Delete is enabled on S3 buckets;2. Storage;2.1. Simple Storage Service (S3);Level 1;Automated;Once MFA Delete is enabled on your sensitive and classified S3 bucket it requires the user to have two forms of authentication.;Adding MFA delete to an S3 bucket, requires additional authentication when you change the version state of your bucket or you delete and object version adding another layer of security in the event your security credentials are compromised or unauthorized access is granted.;;"Perform the steps below to enable MFA delete on an S3 bucket.\n\nNote:\n-You cannot enable MFA Delete using the AWS Management Console. You must use the AWS CLI or API.\n-You must use your \'root\' account to enable MFA Delete on S3 buckets.\n\n**From Command line:**\n\n1. Run the s3api put-bucket-versioning command\n\n```\naws s3api put-bucket-versioning --profile my-root-profile --bucket Bucket_Name --versioning-configuration Status=Enabled,MFADelete=Enabled --mfa “arn:aws:iam::aws_account_id:mfa/root-account-mfa-device passcode”\n```";"Perform the steps below to confirm MFA delete is configured on an S3 Bucket\n\n**From Console:**\n\n1. Login to the S3 console at `https://console.aws.amazon.com/s3/`\n\n2. Click the `Check` box next to the Bucket name you want to confirm\n\n3. In the window under `Properties`\n\n4. Confirm that Versioning is `Enabled`\n\n5. Confirm that MFA Delete is `Enabled`\n\n**From Command Line:**\n\n1. Run the `get-bucket-versioning`\n```\naws s3api get-bucket-versioning --bucket my-bucket\n```\n\nOutput example:\n```\n<VersioningConfiguration xmlns=""http://s3.amazonaws.com/doc/2006-03-01/""> \n <Status>Enabled</Status>\n <MfaDelete>Enabled</MfaDelete> \n</VersioningConfiguration>\n```\n\nIf the Console or the CLI output does not show Versioning and MFA Delete `enabled` refer to the remediation below.";;;https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html#MultiFactorAuthenticationDelete:https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMFADelete.html:https://aws.amazon.com/blogs/security/securing-access-to-aws-using-mfa-part-3/:https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_lost-or-broken.html;PASS;;;;service_test_check_id;False;CIS;CIS Amazon Web Services Foundations Benchmark v1.4.0\r\naws;The CIS Benchmark for CIS Amazon Web Services Foundations Benchmark, v1.4.0, Level 1 and 2 provides prescriptive guidance for configuring security options for a subset of Amazon Web Services. It has an emphasis on foundational, testable, and architecture agnostic settings;;;{datetime.now()};2.1.4;Ensure MFA Delete is enabled on S3 buckets;2. Storage;2.1. Simple Storage Service (S3);Level 1;Automated;Once MFA Delete is enabled on your sensitive and classified S3 bucket it requires the user to have two forms of authentication.;Adding MFA delete to an S3 bucket, requires additional authentication when you change the version state of your bucket or you delete and object version adding another layer of security in the event your security credentials are compromised or unauthorized access is granted.;;"Perform the steps below to enable MFA delete on an S3 bucket.\n\nNote:\n-You cannot enable MFA Delete using the AWS Management Console. You must use the AWS CLI or API.\n-You must use your \'root\' account to enable MFA Delete on S3 buckets.\n\n**From Command line:**\n\n1. Run the s3api put-bucket-versioning command\n\n```\naws s3api put-bucket-versioning --profile my-root-profile --bucket Bucket_Name --versioning-configuration Status=Enabled,MFADelete=Enabled --mfa “arn:aws:iam::aws_account_id:mfa/root-account-mfa-device passcode”\n```";"Perform the steps below to confirm MFA delete is configured on an S3 Bucket\n\n**From Console:**\n\n1. Login to the S3 console at `https://console.aws.amazon.com/s3/`\n\n2. Click the `Check` box next to the Bucket name you want to confirm\n\n3. In the window under `Properties`\n\n4. Confirm that Versioning is `Enabled`\n\n5. Confirm that MFA Delete is `Enabled`\n\n**From Command Line:**\n\n1. Run the `get-bucket-versioning`\n```\naws s3api get-bucket-versioning --bucket my-bucket\n```\n\nOutput example:\n```\n<VersioningConfiguration xmlns=""http://s3.amazonaws.com/doc/2006-03-01/""> \n <Status>Enabled</Status>\n <MfaDelete>Enabled</MfaDelete> \n</VersioningConfiguration>\n```\n\nIf the Console or the CLI output does not show Versioning and MFA Delete `enabled` refer to the remediation below.";;;https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html#MultiFactorAuthenticationDelete:https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMFADelete.html:https://aws.amazon.com/blogs/security/securing-access-to-aws-using-mfa-part-3/:https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_lost-or-broken.html;MANUAL;Manual check;manual_check;Manual check;manual;False;CIS;CIS Amazon Web Services Foundations Benchmark v1.4.0\r\n'
        assert content == expected_csv
```

--------------------------------------------------------------------------------

---[FILE: cis_azure_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/cis/cis_azure_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.cis.cis_azure import AzureCIS
from prowler.lib.outputs.compliance.cis.models import AzureCISModel
from tests.lib.outputs.compliance.fixtures import CIS_2_0_AZURE
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    AZURE_SUBSCRIPTION_NAME,
)


class TestAzureCIS:
    def test_output_transform(self):
        findings = [
            generate_finding_output(
                provider="azure",
                compliance={"CIS-2.0": "2.1.3"},
                account_name=AZURE_SUBSCRIPTION_NAME,
                account_uid=AZURE_SUBSCRIPTION_ID,
                region="",
            )
        ]

        output = AzureCIS(findings, CIS_2_0_AZURE)
        output_data = output.data[0]
        assert isinstance(output_data, AzureCISModel)
        assert output_data.Provider == "azure"
        assert output_data.Framework == CIS_2_0_AZURE.Framework
        assert output_data.Name == CIS_2_0_AZURE.Name
        assert output_data.SubscriptionId == AZURE_SUBSCRIPTION_ID
        assert output_data.Location == ""
        assert output_data.Description == CIS_2_0_AZURE.Description
        assert output_data.Requirements_Id == CIS_2_0_AZURE.Requirements[0].Id
        assert (
            output_data.Requirements_Description
            == CIS_2_0_AZURE.Requirements[0].Description
        )
        assert (
            output_data.Requirements_Attributes_Section
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].Section
        )
        assert (
            output_data.Requirements_Attributes_SubSection
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].SubSection
        )
        assert (
            output_data.Requirements_Attributes_Profile
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].Profile
        )
        assert (
            output_data.Requirements_Attributes_AssessmentStatus
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].AssessmentStatus
        )
        assert (
            output_data.Requirements_Attributes_Description
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].Description
        )
        assert (
            output_data.Requirements_Attributes_RationaleStatement
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].RationaleStatement
        )
        assert (
            output_data.Requirements_Attributes_ImpactStatement
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].ImpactStatement
        )
        assert (
            output_data.Requirements_Attributes_RemediationProcedure
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].RemediationProcedure
        )
        assert (
            output_data.Requirements_Attributes_AuditProcedure
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].AuditProcedure
        )
        assert (
            output_data.Requirements_Attributes_AdditionalInformation
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].AdditionalInformation
        )
        assert (
            output_data.Requirements_Attributes_References
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].References
        )
        assert (
            output_data.Requirements_Attributes_DefaultValue
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].DefaultValue
        )
        assert output_data.Status == "PASS"
        assert output_data.StatusExtended == ""
        assert output_data.ResourceId == ""
        assert output_data.ResourceName == ""
        assert output_data.CheckId == "service_test_check_id"
        assert output_data.Muted is False
        # Test manual check
        output_data_manual = output.data[1]
        assert output_data_manual.Provider == "azure"
        assert output_data_manual.Framework == CIS_2_0_AZURE.Framework
        assert output_data_manual.Name == CIS_2_0_AZURE.Name
        assert output_data_manual.SubscriptionId == ""
        assert output_data_manual.Location == ""
        assert output_data_manual.Description == CIS_2_0_AZURE.Description
        assert output_data_manual.Requirements_Id == CIS_2_0_AZURE.Requirements[1].Id
        assert (
            output_data_manual.Requirements_Description
            == CIS_2_0_AZURE.Requirements[1].Description
        )
        assert (
            output_data_manual.Requirements_Attributes_Section
            == CIS_2_0_AZURE.Requirements[1].Attributes[0].Section
        )
        assert (
            output_data.Requirements_Attributes_SubSection
            == CIS_2_0_AZURE.Requirements[0].Attributes[0].SubSection
        )
        assert (
            output_data_manual.Requirements_Attributes_Profile
            == CIS_2_0_AZURE.Requirements[1].Attributes[0].Profile
        )
        assert (
            output_data_manual.Requirements_Attributes_AssessmentStatus
            == CIS_2_0_AZURE.Requirements[1].Attributes[0].AssessmentStatus
        )
        assert (
            output_data_manual.Requirements_Attributes_Description
            == CIS_2_0_AZURE.Requirements[1].Attributes[0].Description
        )
        assert (
            output_data_manual.Requirements_Attributes_RationaleStatement
            == CIS_2_0_AZURE.Requirements[1].Attributes[0].RationaleStatement
        )
        assert (
            output_data_manual.Requirements_Attributes_ImpactStatement
            == CIS_2_0_AZURE.Requirements[1].Attributes[0].ImpactStatement
        )
        assert (
            output_data_manual.Requirements_Attributes_RemediationProcedure
            == CIS_2_0_AZURE.Requirements[1].Attributes[0].RemediationProcedure
        )
        assert (
            output_data_manual.Requirements_Attributes_AuditProcedure
            == CIS_2_0_AZURE.Requirements[1].Attributes[0].AuditProcedure
        )
        assert (
            output_data_manual.Requirements_Attributes_AdditionalInformation
            == CIS_2_0_AZURE.Requirements[1].Attributes[0].AdditionalInformation
        )
        assert (
            output_data_manual.Requirements_Attributes_References
            == CIS_2_0_AZURE.Requirements[1].Attributes[0].References
        )
        assert (
            output_data_manual.Requirements_Attributes_DefaultValue
            == CIS_2_0_AZURE.Requirements[1].Attributes[0].DefaultValue
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.cis.cis_azure.timestamp", "2025-01-01 00:00:00"
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [
            generate_finding_output(
                provider="azure",
                compliance={"CIS-2.0": "2.1.3"},
                account_name=AZURE_SUBSCRIPTION_NAME,
                account_uid=AZURE_SUBSCRIPTION_ID,
                region="",
            )
        ]
        # Clear the data from CSV class
        output = AzureCIS(findings, CIS_2_0_AZURE)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        expected_csv = f"PROVIDER;DESCRIPTION;SUBSCRIPTIONID;LOCATION;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_SECTION;REQUIREMENTS_ATTRIBUTES_SUBSECTION;REQUIREMENTS_ATTRIBUTES_PROFILE;REQUIREMENTS_ATTRIBUTES_ASSESSMENTSTATUS;REQUIREMENTS_ATTRIBUTES_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_RATIONALESTATEMENT;REQUIREMENTS_ATTRIBUTES_IMPACTSTATEMENT;REQUIREMENTS_ATTRIBUTES_REMEDIATIONPROCEDURE;REQUIREMENTS_ATTRIBUTES_AUDITPROCEDURE;REQUIREMENTS_ATTRIBUTES_ADDITIONALINFORMATION;REQUIREMENTS_ATTRIBUTES_DEFAULTVALUE;REQUIREMENTS_ATTRIBUTES_REFERENCES;STATUS;STATUSEXTENDED;RESOURCEID;RESOURCENAME;CHECKID;MUTED;FRAMEWORK;NAME\r\nazure;The CIS Azure Foundations Benchmark provides prescriptive guidance for configuring security options for a subset of Azure with an emphasis on foundational, testable, and architecture agnostic settings.;{AZURE_SUBSCRIPTION_ID};;{datetime.now()};2.1.3;Ensure That Microsoft Defender for Databases Is Set To 'On';2. Defender;2.1 Microsoft Defender for Cloud;Level 2;Manual;Turning on Microsoft Defender for Databases enables threat detection for the instances running your database software. This provides threat intelligence, anomaly detection, and behavior analytics in the Azure Microsoft Defender for Cloud. Instead of being enabled on services like Platform as a Service (PaaS), this implementation will run within your instances as Infrastructure as a Service (IaaS) on the Operating Systems hosting your databases.;Enabling Microsoft Defender for Azure SQL Databases allows your organization more granular control of the infrastructure running your database software. Instead of waiting on Microsoft release updates or other similar processes, you can manage them yourself. Threat detection is provided by the Microsoft Security Response Center (MSRC).;Running Defender on Infrastructure as a service (IaaS) may incur increased costs associated with running the service and the instance it is on. Similarly, you will need qualified personnel to maintain the operating system and software updates. If it is not maintained, security patches will not be applied and it may be open to vulnerabilities.;From Azure Portal 1. Go to Microsoft Defender for Cloud 2. Select Environment Settings 3. Click on the subscription name 4. Select Defender plans 5. Set Databases Status to On 6. Select Save Review the chosen pricing tier. For the Azure Databases resource review the different plan information and choose one that fits the needs of your organization. From Azure CLI Run the following commands: az security pricing create -n 'SqlServers' --tier 'Standard' az security pricing create -n 'SqlServerVirtualMachines' --tier 'Standard' az security pricing create -n 'OpenSourceRelationalDatabases' --tier 'Standard' az security pricing create -n 'CosmosDbs' --tier 'Standard' From Azure PowerShell Run the following commands: Set-AzSecurityPricing -Name 'SqlServers' -PricingTier 'Standard' Set-AzSecurityPricing -Name 'SqlServerVirtualMachines' -PricingTier 'Standard' Set-AzSecurityPricing -Name 'OpenSourceRelationalDatabases' -PricingTier 'Standard' Set-AzSecurityPricing -Name 'CosmosDbs' -PricingTier 'Standard';From Azure Portal 1. Go to Microsoft Defender for Cloud 2. Select Environment Settings 3. Click on the subscription name 4. Select Defender plans 5. Ensure Databases Status is set to On 6. Review the chosen pricing tier From Azure CLI Ensure the output of the below commands is Standard az security pricing show -n 'SqlServers' az security pricing show -n 'SqlServerVirtualMachines' az security pricing show -n 'OpenSourceRelationalDatabases' az security pricing show -n 'CosmosDbs' If the output of any of the above commands shows pricingTier with a value of Free, the setting is out of compliance. From PowerShell Connect-AzAccount Get-AzSecurityPricing |select-object Name,PricingTier |where-object {{$_.Name -match 'Sql' -or $_.Name -match 'Cosmos' -or $_.Name -match 'OpenSource'}} Ensure the output shows Standard for each database type under the PricingTier column. Any that show Free are considered out of compliance.;;By default, Microsoft Defender plan is off.;https://docs.microsoft.com/en-us/azure/azure-sql/database/azure-defender-for-sql?view=azuresql:https://docs.microsoft.com/en-us/azure/defender-for-cloud/quickstart-enable-database-protections:https://docs.microsoft.com/en-us/azure/defender-for-cloud/defender-for-databases-usage:https://docs.microsoft.com/en-us/azure/security-center/security-center-detection-capabilities:https://docs.microsoft.com/en-us/rest/api/securitycenter/pricings/list:https://docs.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-logging-threat-detection#lt-1-enable-threat-detection-capabilities;PASS;;;;service_test_check_id;False;CIS;CIS Microsoft Azure Foundations Benchmark v2.0.0\r\nazure;The CIS Azure Foundations Benchmark provides prescriptive guidance for configuring security options for a subset of Azure with an emphasis on foundational, testable, and architecture agnostic settings.;;;{datetime.now()};2.1.4;Ensure That Microsoft Defender for Databases Is Set To 'On';2. Defender;2.1 Microsoft Defender for Cloud;Level 2;Manual;Turning on Microsoft Defender for Databases enables threat detection for the instances running your database software. This provides threat intelligence, anomaly detection, and behavior analytics in the Azure Microsoft Defender for Cloud. Instead of being enabled on services like Platform as a Service (PaaS), this implementation will run within your instances as Infrastructure as a Service (IaaS) on the Operating Systems hosting your databases.;Enabling Microsoft Defender for Azure SQL Databases allows your organization more granular control of the infrastructure running your database software. Instead of waiting on Microsoft release updates or other similar processes, you can manage them yourself. Threat detection is provided by the Microsoft Security Response Center (MSRC).;Running Defender on Infrastructure as a service (IaaS) may incur increased costs associated with running the service and the instance it is on. Similarly, you will need qualified personnel to maintain the operating system and software updates. If it is not maintained, security patches will not be applied and it may be open to vulnerabilities.;From Azure Portal 1. Go to Microsoft Defender for Cloud 2. Select Environment Settings 3. Click on the subscription name 4. Select Defender plans 5. Set Databases Status to On 6. Select Save Review the chosen pricing tier. For the Azure Databases resource review the different plan information and choose one that fits the needs of your organization. From Azure CLI Run the following commands: az security pricing create -n 'SqlServers' --tier 'Standard' az security pricing create -n 'SqlServerVirtualMachines' --tier 'Standard' az security pricing create -n 'OpenSourceRelationalDatabases' --tier 'Standard' az security pricing create -n 'CosmosDbs' --tier 'Standard' From Azure PowerShell Run the following commands: Set-AzSecurityPricing -Name 'SqlServers' -PricingTier 'Standard' Set-AzSecurityPricing -Name 'SqlServerVirtualMachines' -PricingTier 'Standard' Set-AzSecurityPricing -Name 'OpenSourceRelationalDatabases' -PricingTier 'Standard' Set-AzSecurityPricing -Name 'CosmosDbs' -PricingTier 'Standard';From Azure Portal 1. Go to Microsoft Defender for Cloud 2. Select Environment Settings 3. Click on the subscription name 4. Select Defender plans 5. Ensure Databases Status is set to On 6. Review the chosen pricing tier From Azure CLI Ensure the output of the below commands is Standard az security pricing show -n 'SqlServers' az security pricing show -n 'SqlServerVirtualMachines' az security pricing show -n 'OpenSourceRelationalDatabases' az security pricing show -n 'CosmosDbs' If the output of any of the above commands shows pricingTier with a value of Free, the setting is out of compliance. From PowerShell Connect-AzAccount Get-AzSecurityPricing |select-object Name,PricingTier |where-object {{$_.Name -match 'Sql' -or $_.Name -match 'Cosmos' -or $_.Name -match 'OpenSource'}} Ensure the output shows Standard for each database type under the PricingTier column. Any that show Free are considered out of compliance.;;By default, Microsoft Defender plan is off.;https://docs.microsoft.com/en-us/azure/azure-sql/database/azure-defender-for-sql?view=azuresql:https://docs.microsoft.com/en-us/azure/defender-for-cloud/quickstart-enable-database-protections:https://docs.microsoft.com/en-us/azure/defender-for-cloud/defender-for-databases-usage:https://docs.microsoft.com/en-us/azure/security-center/security-center-detection-capabilities:https://docs.microsoft.com/en-us/rest/api/securitycenter/pricings/list:https://docs.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-logging-threat-detection#lt-1-enable-threat-detection-capabilities;MANUAL;Manual check;manual_check;Manual check;manual;False;CIS;CIS Microsoft Azure Foundations Benchmark v2.0.0\r\n"
        assert content == expected_csv
```

--------------------------------------------------------------------------------

````
