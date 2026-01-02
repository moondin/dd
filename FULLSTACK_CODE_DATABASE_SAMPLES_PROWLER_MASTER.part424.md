---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 424
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 424 of 867)

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

---[FILE: kisa_ismsp_aws_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/kisa_ismsp/kisa_ismsp_aws_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.kisa_ismsp.kisa_ismsp_aws import AWSKISAISMSP
from prowler.lib.outputs.compliance.kisa_ismsp.models import AWSKISAISMSPModel
from tests.lib.outputs.compliance.fixtures import KISA_ISMSP_AWS
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class TestAWSKISAISMSP:
    def test_output_transform(self):
        findings = [generate_finding_output(compliance={"KISA-ISMS-P-2023": ["2.5.3"]})]

        output = AWSKISAISMSP(findings, KISA_ISMSP_AWS)
        output_data = output.data[0]
        assert isinstance(output_data, AWSKISAISMSPModel)
        assert output_data.Provider == "aws"
        assert output_data.Framework == KISA_ISMSP_AWS.Framework
        assert output_data.Name == KISA_ISMSP_AWS.Name
        assert output_data.AccountId == AWS_ACCOUNT_NUMBER
        assert output_data.Region == AWS_REGION_EU_WEST_1
        assert output_data.Description == KISA_ISMSP_AWS.Description
        assert output_data.Requirements_Id == KISA_ISMSP_AWS.Requirements[0].Id
        assert (
            output_data.Requirements_Description
            == KISA_ISMSP_AWS.Requirements[0].Description
        )
        assert (
            output_data.Requirements_Attributes_Domain
            == KISA_ISMSP_AWS.Requirements[0].Attributes[0].Domain
        )
        assert (
            output_data.Requirements_Attributes_Subdomain
            == KISA_ISMSP_AWS.Requirements[0].Attributes[0].Subdomain
        )
        assert (
            output_data.Requirements_Attributes_Section
            == KISA_ISMSP_AWS.Requirements[0].Attributes[0].Section
        )
        assert (
            output_data.Requirements_Attributes_AuditChecklist
            == KISA_ISMSP_AWS.Requirements[0].Attributes[0].AuditChecklist
        )
        assert (
            output_data.Requirements_Attributes_RelatedRegulations
            == KISA_ISMSP_AWS.Requirements[0].Attributes[0].RelatedRegulations
        )
        assert (
            output_data.Requirements_Attributes_AuditEvidence
            == KISA_ISMSP_AWS.Requirements[0].Attributes[0].AuditEvidence
        )
        assert (
            output_data.Requirements_Attributes_NonComplianceCases
            == KISA_ISMSP_AWS.Requirements[0].Attributes[0].NonComplianceCases
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
        assert output_data_manual.Framework == KISA_ISMSP_AWS.Framework
        assert output_data_manual.Name == KISA_ISMSP_AWS.Name
        assert output_data_manual.AccountId == ""
        assert output_data_manual.Region == ""
        assert output_data_manual.Requirements_Id == KISA_ISMSP_AWS.Requirements[1].Id
        assert (
            output_data_manual.Requirements_Description
            == KISA_ISMSP_AWS.Requirements[1].Description
        )
        assert (
            output_data_manual.Requirements_Attributes_Domain
            == KISA_ISMSP_AWS.Requirements[1].Attributes[0].Domain
        )
        assert (
            output_data_manual.Requirements_Attributes_Subdomain
            == KISA_ISMSP_AWS.Requirements[1].Attributes[0].Subdomain
        )
        assert (
            output_data_manual.Requirements_Attributes_Section
            == KISA_ISMSP_AWS.Requirements[1].Attributes[0].Section
        )
        assert (
            output_data_manual.Requirements_Attributes_AuditChecklist
            == KISA_ISMSP_AWS.Requirements[1].Attributes[0].AuditChecklist
        )
        assert (
            output_data_manual.Requirements_Attributes_RelatedRegulations
            == KISA_ISMSP_AWS.Requirements[1].Attributes[0].RelatedRegulations
        )
        assert (
            output_data_manual.Requirements_Attributes_AuditEvidence
            == KISA_ISMSP_AWS.Requirements[1].Attributes[0].AuditEvidence
        )
        assert (
            output_data_manual.Requirements_Attributes_NonComplianceCases
            == KISA_ISMSP_AWS.Requirements[1].Attributes[0].NonComplianceCases
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.kisa_ismsp.kisa_ismsp_aws.timestamp",
        "2025-01-01 00:00:00",
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [generate_finding_output(compliance={"KISA-ISMS-P-2023": ["2.5.3"]})]
        output = AWSKISAISMSP(findings, KISA_ISMSP_AWS)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        expected_csv = f"PROVIDER;DESCRIPTION;ACCOUNTID;REGION;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_NAME;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_DOMAIN;REQUIREMENTS_ATTRIBUTES_SUBDOMAIN;REQUIREMENTS_ATTRIBUTES_SECTION;REQUIREMENTS_ATTRIBUTES_AUDITCHECKLIST;REQUIREMENTS_ATTRIBUTES_RELATEDREGULATIONS;REQUIREMENTS_ATTRIBUTES_AUDITEVIDENCE;REQUIREMENTS_ATTRIBUTES_NONCOMPLIANCECASES;STATUS;STATUSEXTENDED;RESOURCEID;RESOURCENAME;CHECKID;MUTED;FRAMEWORK;NAME\r\naws;The ISMS-P certification, established by KISA Korea Internet & Security Agency;123456789012;eu-west-1;{datetime.now()};2.5.3;User Authentication;User access to information systems;2. Protection Measure Requirements;2.5. Authentication and Authorization Management;2.5.3 User Authentication;['Is access to information systems and personal information controlled through secure authentication?', 'Are login attempt limitations enforced?'];['Personal Information Protection Act, Article 29', 'Standards for Ensuring the Safety of Personal Information, Article 5'];['Login screen for information systems', 'Login failure message screen'];['Case 1: Insufficient authentication when accessing information systems externally.', 'Case 2: No limitation on login failure attempts.'];PASS;;;;service_test_check_id;False;KISA-ISMS-P;KISA ISMS compliance framework 2023\r\naws;The ISMS-P certification, established by KISA Korea Internet & Security Agency;;;{datetime.now()};2.5.4;User Authentication;User access to information systems;2. Protection Measure Requirements;2.5. Authentication and Authorization Management;2.5.3 User Authentication;['Is access to information systems and personal information controlled through secure authentication?', 'Are login attempt limitations enforced?'];['Personal Information Protection Act, Article 29', 'Standards for Ensuring the Safety of Personal Information, Article 5'];['Login screen for information systems', 'Login failure message screen'];['Case 1: Insufficient authentication when accessing information systems externally.', 'Case 2: No limitation on login failure attempts.'];MANUAL;Manual check;manual_check;Manual check;manual;False;KISA-ISMS-P;KISA ISMS compliance framework 2023\r\n"

        assert content == expected_csv
```

--------------------------------------------------------------------------------

---[FILE: mitre_attack_aws_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/mitre_attack/mitre_attack_aws_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.mitre_attack.mitre_attack_aws import AWSMitreAttack
from prowler.lib.outputs.compliance.mitre_attack.models import AWSMitreAttackModel
from prowler.lib.outputs.utils import unroll_list
from tests.lib.outputs.compliance.fixtures import MITRE_ATTACK_AWS
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class TestAWSMITREAttack:
    def test_output_transform(self):
        findings = [generate_finding_output(compliance={"MITRE-ATTACK": "T1190"})]

        output = AWSMitreAttack(findings, MITRE_ATTACK_AWS)
        output_data = output.data[0]
        assert isinstance(output_data, AWSMitreAttackModel)
        assert output_data.Provider == "aws"
        assert output_data.Framework == MITRE_ATTACK_AWS.Framework
        assert output_data.Name == MITRE_ATTACK_AWS.Name
        assert output_data.Description == MITRE_ATTACK_AWS.Description
        assert output_data.AccountId == AWS_ACCOUNT_NUMBER
        assert output_data.Region == AWS_REGION_EU_WEST_1
        assert output_data.Requirements_Id == MITRE_ATTACK_AWS.Requirements[0].Id
        assert output_data.Requirements_Name == MITRE_ATTACK_AWS.Requirements[0].Name
        assert (
            output_data.Requirements_Description
            == MITRE_ATTACK_AWS.Requirements[0].Description
        )
        assert output_data.Requirements_Tactics == unroll_list(
            MITRE_ATTACK_AWS.Requirements[0].Tactics
        )
        assert output_data.Requirements_SubTechniques == unroll_list(
            MITRE_ATTACK_AWS.Requirements[0].SubTechniques
        )
        assert output_data.Requirements_Platforms == unroll_list(
            MITRE_ATTACK_AWS.Requirements[0].Platforms
        )
        assert (
            output_data.Requirements_TechniqueURL
            == MITRE_ATTACK_AWS.Requirements[0].TechniqueURL
        )
        assert output_data.Requirements_Attributes_Services == ", ".join(
            attribute.AWSService
            for attribute in MITRE_ATTACK_AWS.Requirements[0].Attributes
        )
        assert output_data.Requirements_Attributes_Categories == ", ".join(
            attribute.Category
            for attribute in MITRE_ATTACK_AWS.Requirements[0].Attributes
        )
        assert output_data.Requirements_Attributes_Values == ", ".join(
            attribute.Value for attribute in MITRE_ATTACK_AWS.Requirements[0].Attributes
        )
        assert output_data.Requirements_Attributes_Comments == ", ".join(
            attribute.Comment
            for attribute in MITRE_ATTACK_AWS.Requirements[0].Attributes
        )
        assert output_data.Status == "PASS"
        assert output_data.StatusExtended == ""
        assert output_data.ResourceId == ""
        assert output_data.ResourceName == ""
        assert output_data.CheckId == "service_test_check_id"
        assert not output_data.Muted
        # Test manual check
        output_data_manual = output.data[1]
        assert output_data_manual.Provider == "aws"
        assert output_data_manual.Framework == MITRE_ATTACK_AWS.Framework
        assert output_data_manual.Name == MITRE_ATTACK_AWS.Name
        assert output_data_manual.AccountId == ""
        assert output_data_manual.Region == ""
        assert output_data_manual.Requirements_Id == MITRE_ATTACK_AWS.Requirements[1].Id
        assert (
            output_data_manual.Requirements_Name
            == MITRE_ATTACK_AWS.Requirements[1].Name
        )
        assert (
            output_data_manual.Requirements_Description
            == MITRE_ATTACK_AWS.Requirements[1].Description
        )
        assert output_data_manual.Requirements_Tactics == unroll_list(
            MITRE_ATTACK_AWS.Requirements[1].Tactics
        )
        assert output_data_manual.Requirements_SubTechniques == unroll_list(
            MITRE_ATTACK_AWS.Requirements[1].SubTechniques
        )
        assert output_data_manual.Requirements_Platforms == unroll_list(
            MITRE_ATTACK_AWS.Requirements[1].Platforms
        )
        assert (
            output_data_manual.Requirements_TechniqueURL
            == MITRE_ATTACK_AWS.Requirements[1].TechniqueURL
        )
        assert output_data_manual.Requirements_Attributes_Services == ", ".join(
            attribute.AWSService
            for attribute in MITRE_ATTACK_AWS.Requirements[1].Attributes
        )
        assert output_data_manual.Requirements_Attributes_Categories == ", ".join(
            attribute.Category
            for attribute in MITRE_ATTACK_AWS.Requirements[1].Attributes
        )
        assert output_data_manual.Requirements_Attributes_Values == ", ".join(
            attribute.Value for attribute in MITRE_ATTACK_AWS.Requirements[1].Attributes
        )
        assert output_data_manual.Requirements_Attributes_Comments == ", ".join(
            attribute.Comment
            for attribute in MITRE_ATTACK_AWS.Requirements[1].Attributes
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.mitre_attack.mitre_attack_aws.timestamp",
        "2025-01-01 00:00:00",
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [generate_finding_output(compliance={"MITRE-ATTACK": "T1190"})]
        output = AWSMitreAttack(findings, MITRE_ATTACK_AWS)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        expected_csv = f"PROVIDER;DESCRIPTION;ACCOUNTID;REGION;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_NAME;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_TACTICS;REQUIREMENTS_SUBTECHNIQUES;REQUIREMENTS_PLATFORMS;REQUIREMENTS_TECHNIQUEURL;REQUIREMENTS_ATTRIBUTES_SERVICES;REQUIREMENTS_ATTRIBUTES_CATEGORIES;REQUIREMENTS_ATTRIBUTES_VALUES;REQUIREMENTS_ATTRIBUTES_COMMENTS;STATUS;STATUSEXTENDED;RESOURCEID;CHECKID;MUTED;RESOURCENAME;FRAMEWORK;NAME\r\naws;MITRE ATT&CK® is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. The ATT&CK knowledge base is used as a foundation for the development of specific threat models and methodologies in the private sector, in government, and in the cybersecurity product and service community.;123456789012;eu-west-1;{datetime.now()};T1190;Exploit Public-Facing Application;Adversaries may attempt to exploit a weakness in an Internet-facing host or system to initially access a network. The weakness in the system can be a software bug, a temporary glitch, or a misconfiguration.;Initial Access;;Containers | IaaS | Linux | Network | Windows | macOS;https://attack.mitre.org/techniques/T1190/;AWS CloudEndure Disaster Recovery;Respond;Significant;AWS CloudEndure Disaster Recovery enables the replication and recovery of servers into AWS Cloud. In the event that a public-facing application or server is compromised, AWS CloudEndure can be used to provision an instance of the server from a previous point in time within minutes. As a result, this mapping is given a score of Significant.;PASS;;;service_test_check_id;False;;MITRE-ATTACK;MITRE ATT&CK compliance framework\r\naws;MITRE ATT&CK® is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. The ATT&CK knowledge base is used as a foundation for the development of specific threat models and methodologies in the private sector, in government, and in the cybersecurity product and service community.;;;{datetime.now()};T1193;Exploit Public-Facing Application;Adversaries may attempt to exploit a weakness in an Internet-facing host or system to initially access a network. The weakness in the system can be a software bug, a temporary glitch, or a misconfiguration.;Initial Access;;Containers | IaaS | Linux | Network | Windows | macOS;https://attack.mitre.org/techniques/T1190/;AWS CloudEndure Disaster Recovery;Respond;Significant;AWS CloudEndure Disaster Recovery enables the replication and recovery of servers into AWS Cloud. In the event that a public-facing application or server is compromised, AWS CloudEndure can be used to provision an instance of the server from a previous point in time within minutes. As a result, this mapping is given a score of Significant.;MANUAL;Manual check;manual_check;manual;False;Manual check;MITRE-ATTACK;MITRE ATT&CK compliance framework\r\n"

        assert content == expected_csv
```

--------------------------------------------------------------------------------

---[FILE: mitre_attack_azure_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/mitre_attack/mitre_attack_azure_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.mitre_attack.mitre_attack_azure import (
    AzureMitreAttack,
)
from prowler.lib.outputs.compliance.mitre_attack.models import AzureMitreAttackModel
from prowler.lib.outputs.utils import unroll_list
from tests.lib.outputs.compliance.fixtures import MITRE_ATTACK_AZURE
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    AZURE_SUBSCRIPTION_NAME,
)


class TestAzureMITREAttack:
    def test_output_transform(self):
        findings = [
            generate_finding_output(
                provider="azure",
                compliance={"MITRE-ATTACK": "T1190"},
                account_name=AZURE_SUBSCRIPTION_NAME,
                account_uid=AZURE_SUBSCRIPTION_ID,
                region="",
            )
        ]

        output = AzureMitreAttack(findings, MITRE_ATTACK_AZURE)
        output_data = output.data[0]
        assert isinstance(output_data, AzureMitreAttackModel)
        assert output_data.Provider == "azure"
        assert output_data.Framework == MITRE_ATTACK_AZURE.Framework
        assert output_data.Name == MITRE_ATTACK_AZURE.Name
        assert output_data.Description == MITRE_ATTACK_AZURE.Description
        assert output_data.SubscriptionId == AZURE_SUBSCRIPTION_ID
        assert output_data.Location == ""
        assert output_data.Requirements_Id == MITRE_ATTACK_AZURE.Requirements[0].Id
        assert output_data.Requirements_Name == MITRE_ATTACK_AZURE.Requirements[0].Name
        assert (
            output_data.Requirements_Description
            == MITRE_ATTACK_AZURE.Requirements[0].Description
        )
        assert output_data.Requirements_Tactics == unroll_list(
            MITRE_ATTACK_AZURE.Requirements[0].Tactics
        )
        assert output_data.Requirements_SubTechniques == unroll_list(
            MITRE_ATTACK_AZURE.Requirements[0].SubTechniques
        )
        assert output_data.Requirements_Platforms == unroll_list(
            MITRE_ATTACK_AZURE.Requirements[0].Platforms
        )
        assert (
            output_data.Requirements_TechniqueURL
            == MITRE_ATTACK_AZURE.Requirements[0].TechniqueURL
        )
        assert output_data.Requirements_Attributes_Services == ", ".join(
            attribute.AzureService
            for attribute in MITRE_ATTACK_AZURE.Requirements[0].Attributes
        )
        assert output_data.Requirements_Attributes_Categories == ", ".join(
            attribute.Category
            for attribute in MITRE_ATTACK_AZURE.Requirements[0].Attributes
        )
        assert output_data.Requirements_Attributes_Values == ", ".join(
            attribute.Value
            for attribute in MITRE_ATTACK_AZURE.Requirements[0].Attributes
        )
        assert output_data.Requirements_Attributes_Comments == ", ".join(
            attribute.Comment
            for attribute in MITRE_ATTACK_AZURE.Requirements[0].Attributes
        )
        assert output_data.Status == "PASS"
        assert output_data.StatusExtended == ""
        assert output_data.ResourceId == ""
        assert output_data.ResourceName == ""
        assert output_data.CheckId == "service_test_check_id"
        assert not output_data.Muted
        # Test manual check
        output_data_manual = output.data[1]
        assert output_data_manual.Provider == "azure"
        assert output_data_manual.Framework == MITRE_ATTACK_AZURE.Framework
        assert output_data_manual.Name == MITRE_ATTACK_AZURE.Name
        assert output_data_manual.SubscriptionId == ""
        assert output_data_manual.Location == ""
        assert (
            output_data_manual.Requirements_Id == MITRE_ATTACK_AZURE.Requirements[1].Id
        )
        assert (
            output_data_manual.Requirements_Name
            == MITRE_ATTACK_AZURE.Requirements[1].Name
        )
        assert (
            output_data_manual.Requirements_Description
            == MITRE_ATTACK_AZURE.Requirements[1].Description
        )
        assert output_data_manual.Requirements_Tactics == unroll_list(
            MITRE_ATTACK_AZURE.Requirements[1].Tactics
        )
        assert output_data_manual.Requirements_SubTechniques == unroll_list(
            MITRE_ATTACK_AZURE.Requirements[1].SubTechniques
        )
        assert output_data_manual.Requirements_Platforms == unroll_list(
            MITRE_ATTACK_AZURE.Requirements[1].Platforms
        )
        assert (
            output_data_manual.Requirements_TechniqueURL
            == MITRE_ATTACK_AZURE.Requirements[1].TechniqueURL
        )
        assert output_data_manual.Requirements_Attributes_Services == ", ".join(
            attribute.AzureService
            for attribute in MITRE_ATTACK_AZURE.Requirements[1].Attributes
        )
        assert output_data_manual.Requirements_Attributes_Categories == ", ".join(
            attribute.Category
            for attribute in MITRE_ATTACK_AZURE.Requirements[1].Attributes
        )
        assert output_data_manual.Requirements_Attributes_Values == ", ".join(
            attribute.Value
            for attribute in MITRE_ATTACK_AZURE.Requirements[1].Attributes
        )
        assert output_data_manual.Requirements_Attributes_Comments == ", ".join(
            attribute.Comment
            for attribute in MITRE_ATTACK_AZURE.Requirements[1].Attributes
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.mitre_attack.mitre_attack_azure.timestamp",
        "2025-01-01 00:00:00",
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [
            generate_finding_output(
                provider="azure",
                compliance={"MITRE-ATTACK": "T1190"},
                account_name=AZURE_SUBSCRIPTION_NAME,
                account_uid=AZURE_SUBSCRIPTION_ID,
                region="",
            )
        ]
        output = AzureMitreAttack(findings, MITRE_ATTACK_AZURE)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        expected_csv = f"PROVIDER;DESCRIPTION;SUBSCRIPTIONID;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_NAME;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_TACTICS;REQUIREMENTS_SUBTECHNIQUES;REQUIREMENTS_PLATFORMS;REQUIREMENTS_TECHNIQUEURL;REQUIREMENTS_ATTRIBUTES_SERVICES;REQUIREMENTS_ATTRIBUTES_CATEGORIES;REQUIREMENTS_ATTRIBUTES_VALUES;REQUIREMENTS_ATTRIBUTES_COMMENTS;STATUS;STATUSEXTENDED;RESOURCEID;CHECKID;MUTED;RESOURCENAME;LOCATION;FRAMEWORK;NAME\r\nazure;MITRE ATT&CK® is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. The ATT&CK knowledge base is used as a foundation for the development of specific threat models and methodologies in the private sector, in government, and in the cybersecurity product and service community.;{AZURE_SUBSCRIPTION_ID};{datetime.now()};T1190;Exploit Public-Facing Application;Adversaries may attempt to exploit a weakness in an Internet-facing host or system to initially access a network. The weakness in the system can be a software bug, a temporary glitch, or a misconfiguration.;Initial Access;;Containers | IaaS | Linux | Network | Windows | macOS;https://attack.mitre.org/techniques/T1190/;Azure SQL Database;Detect;Minimal;This control may alert on usage of faulty SQL statements. This generates an alert for a possible SQL injection by an application. Alerts may not be generated on usage of valid SQL statements by attackers for malicious purposes.;PASS;;;service_test_check_id;False;;;MITRE-ATTACK;MITRE ATT&CK compliance framework\r\nazure;MITRE ATT&CK® is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. The ATT&CK knowledge base is used as a foundation for the development of specific threat models and methodologies in the private sector, in government, and in the cybersecurity product and service community.;;{datetime.now()};T1191;Exploit Public-Facing Application;Adversaries may attempt to exploit a weakness in an Internet-facing host or system to initially access a network. The weakness in the system can be a software bug, a temporary glitch, or a misconfiguration.;Initial Access;;Containers | IaaS | Linux | Network | Windows | macOS;https://attack.mitre.org/techniques/T1190/;Azure SQL Database;Detect;Minimal;This control may alert on usage of faulty SQL statements. This generates an alert for a possible SQL injection by an application. Alerts may not be generated on usage of valid SQL statements by attackers for malicious purposes.;MANUAL;Manual check;manual_check;manual;False;Manual check;;MITRE-ATTACK;MITRE ATT&CK compliance framework\r\n"

        assert content == expected_csv
```

--------------------------------------------------------------------------------

---[FILE: mitre_attack_gcp_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/mitre_attack/mitre_attack_gcp_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.mitre_attack.mitre_attack_gcp import GCPMitreAttack
from prowler.lib.outputs.compliance.mitre_attack.models import GCPMitreAttackModel
from prowler.lib.outputs.utils import unroll_list
from tests.lib.outputs.compliance.fixtures import MITRE_ATTACK_GCP
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID


class TestGCPMITREAttack:
    def test_output_transform(self):
        findings = [
            generate_finding_output(
                provider="gcp",
                compliance={"MITRE-ATTACK": "T1190"},
                account_name=GCP_PROJECT_ID,
                account_uid=GCP_PROJECT_ID,
                region="",
            )
        ]

        output = GCPMitreAttack(findings, MITRE_ATTACK_GCP)
        output_data = output.data[0]
        assert isinstance(output_data, GCPMitreAttackModel)
        assert output_data.Provider == "gcp"
        assert output_data.Framework == MITRE_ATTACK_GCP.Framework
        assert output_data.Name == MITRE_ATTACK_GCP.Name
        assert output_data.Description == MITRE_ATTACK_GCP.Description
        assert output_data.ProjectId == GCP_PROJECT_ID
        assert output_data.Location == ""
        assert output_data.Requirements_Id == MITRE_ATTACK_GCP.Requirements[0].Id
        assert output_data.Requirements_Name == MITRE_ATTACK_GCP.Requirements[0].Name
        assert (
            output_data.Requirements_Description
            == MITRE_ATTACK_GCP.Requirements[0].Description
        )
        assert output_data.Requirements_Tactics == unroll_list(
            MITRE_ATTACK_GCP.Requirements[0].Tactics
        )
        assert output_data.Requirements_SubTechniques == unroll_list(
            MITRE_ATTACK_GCP.Requirements[0].SubTechniques
        )
        assert output_data.Requirements_Platforms == unroll_list(
            MITRE_ATTACK_GCP.Requirements[0].Platforms
        )
        assert (
            output_data.Requirements_TechniqueURL
            == MITRE_ATTACK_GCP.Requirements[0].TechniqueURL
        )
        assert output_data.Requirements_Attributes_Services == ", ".join(
            attribute.GCPService
            for attribute in MITRE_ATTACK_GCP.Requirements[0].Attributes
        )
        assert output_data.Requirements_Attributes_Categories == ", ".join(
            attribute.Category
            for attribute in MITRE_ATTACK_GCP.Requirements[0].Attributes
        )
        assert output_data.Requirements_Attributes_Values == ", ".join(
            attribute.Value for attribute in MITRE_ATTACK_GCP.Requirements[0].Attributes
        )
        assert output_data.Requirements_Attributes_Comments == ", ".join(
            attribute.Comment
            for attribute in MITRE_ATTACK_GCP.Requirements[0].Attributes
        )
        assert output_data.Status == "PASS"
        assert output_data.StatusExtended == ""
        assert output_data.ResourceId == ""
        assert output_data.ResourceName == ""
        assert output_data.CheckId == "service_test_check_id"
        assert not output_data.Muted
        # Test manual check
        output_data_manual = output.data[1]
        assert output_data_manual.Provider == "gcp"
        assert output_data_manual.Framework == MITRE_ATTACK_GCP.Framework
        assert output_data_manual.Name == MITRE_ATTACK_GCP.Name
        assert output_data_manual.ProjectId == ""
        assert output_data_manual.Location == ""
        assert output_data_manual.Requirements_Id == MITRE_ATTACK_GCP.Requirements[1].Id
        assert (
            output_data_manual.Requirements_Name
            == MITRE_ATTACK_GCP.Requirements[1].Name
        )
        assert (
            output_data_manual.Requirements_Description
            == MITRE_ATTACK_GCP.Requirements[1].Description
        )
        assert output_data_manual.Requirements_Tactics == unroll_list(
            MITRE_ATTACK_GCP.Requirements[1].Tactics
        )
        assert output_data_manual.Requirements_SubTechniques == unroll_list(
            MITRE_ATTACK_GCP.Requirements[1].SubTechniques
        )
        assert output_data_manual.Requirements_Platforms == unroll_list(
            MITRE_ATTACK_GCP.Requirements[1].Platforms
        )
        assert (
            output_data_manual.Requirements_TechniqueURL
            == MITRE_ATTACK_GCP.Requirements[1].TechniqueURL
        )
        assert output_data_manual.Requirements_Attributes_Services == ", ".join(
            attribute.GCPService
            for attribute in MITRE_ATTACK_GCP.Requirements[1].Attributes
        )
        assert output_data_manual.Requirements_Attributes_Categories == ", ".join(
            attribute.Category
            for attribute in MITRE_ATTACK_GCP.Requirements[1].Attributes
        )
        assert output_data_manual.Requirements_Attributes_Values == ", ".join(
            attribute.Value for attribute in MITRE_ATTACK_GCP.Requirements[1].Attributes
        )
        assert output_data_manual.Requirements_Attributes_Comments == ", ".join(
            attribute.Comment
            for attribute in MITRE_ATTACK_GCP.Requirements[1].Attributes
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.mitre_attack.mitre_attack_gcp.timestamp",
        "2025-01-01 00:00:00",
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [
            generate_finding_output(
                provider="gcp",
                compliance={"MITRE-ATTACK": "T1190"},
                account_name=GCP_PROJECT_ID,
                account_uid=GCP_PROJECT_ID,
                region="",
            )
        ]
        output = GCPMitreAttack(findings, MITRE_ATTACK_GCP)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        expected_csv = f"PROVIDER;DESCRIPTION;PROJECTID;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_NAME;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_TACTICS;REQUIREMENTS_SUBTECHNIQUES;REQUIREMENTS_PLATFORMS;REQUIREMENTS_TECHNIQUEURL;REQUIREMENTS_ATTRIBUTES_SERVICES;REQUIREMENTS_ATTRIBUTES_CATEGORIES;REQUIREMENTS_ATTRIBUTES_VALUES;REQUIREMENTS_ATTRIBUTES_COMMENTS;STATUS;STATUSEXTENDED;RESOURCEID;CHECKID;MUTED;RESOURCENAME;LOCATION;FRAMEWORK;NAME\r\ngcp;MITRE ATT&CK® is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. The ATT&CK knowledge base is used as a foundation for the development of specific threat models and methodologies in the private sector, in government, and in the cybersecurity product and service community.;123456789012;{datetime.now()};T1190;Exploit Public-Facing Application;Adversaries may attempt to exploit a weakness in an Internet-facing host or system to initially access a network. The weakness in the system can be a software bug, a temporary glitch, or a misconfiguration.;Initial Access;;Containers | IaaS | Linux | Network | Windows | macOS;https://attack.mitre.org/techniques/T1190/;Artifact Registry;Protect;Partial;Once this control is deployed, it can detect known vulnerabilities in various Linux OS packages. This information can be used to patch, isolate, or remove vulnerable software and machines. This control does not directly protect against exploitation and is not effective against zero day attacks, vulnerabilities with no available patch, and other end-of-life packages.;PASS;;;service_test_check_id;False;;;MITRE-ATTACK;MITRE ATT&CK compliance framework\r\ngcp;MITRE ATT&CK® is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. The ATT&CK knowledge base is used as a foundation for the development of specific threat models and methodologies in the private sector, in government, and in the cybersecurity product and service community.;;{datetime.now()};T1191;Exploit Public-Facing Application;Adversaries may attempt to exploit a weakness in an Internet-facing host or system to initially access a network. The weakness in the system can be a software bug, a temporary glitch, or a misconfiguration.;Initial Access;;Containers | IaaS | Linux | Network | Windows | macOS;https://attack.mitre.org/techniques/T1190/;Artifact Registry;Protect;Partial;Once this control is deployed, it can detect known vulnerabilities in various Linux OS packages. This information can be used to patch, isolate, or remove vulnerable software and machines. This control does not directly protect against exploitation and is not effective against zero day attacks, vulnerabilities with no available patch, and other end-of-life packages.;MANUAL;Manual check;manual_check;manual;False;Manual check;;MITRE-ATTACK;MITRE ATT&CK compliance framework\r\n"

        assert content == expected_csv
```

--------------------------------------------------------------------------------

````
