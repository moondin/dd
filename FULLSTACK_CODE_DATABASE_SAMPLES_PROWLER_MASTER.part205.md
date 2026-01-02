---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 205
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 205 of 867)

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

---[FILE: ccc_azure.py]---
Location: prowler-master/prowler/lib/outputs/compliance/ccc/ccc_azure.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.ccc.models import CCC_AzureModel
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class CCC_Azure(ComplianceOutput):
    """
    This class represents the Azure CCC compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Azure CCC compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Azure CCC compliance format.

        Parameters:
            - findings (list): A list of findings.
            - compliance (Compliance): A compliance model.
            - compliance_name (str): The name of the compliance model.

        Returns:
            - None
        """
        for finding in findings:
            # Get the compliance requirements for the finding
            finding_requirements = finding.compliance.get(compliance_name, [])
            for requirement in compliance.Requirements:
                if requirement.Id in finding_requirements:
                    for attribute in requirement.Attributes:
                        compliance_row = CCC_AzureModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            SubscriptionId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_FamilyName=attribute.FamilyName,
                            Requirements_Attributes_FamilyDescription=attribute.FamilyDescription,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_SubSectionObjective=attribute.SubSectionObjective,
                            Requirements_Attributes_Applicability=attribute.Applicability,
                            Requirements_Attributes_Recommendation=attribute.Recommendation,
                            Requirements_Attributes_SectionThreatMappings=attribute.SectionThreatMappings,
                            Requirements_Attributes_SectionGuidelineMappings=attribute.SectionGuidelineMappings,
                            Status=finding.status,
                            StatusExtended=finding.status_extended,
                            ResourceId=finding.resource_uid,
                            ResourceName=finding.resource_name,
                            CheckId=finding.check_id,
                            Muted=finding.muted,
                        )
                        self._data.append(compliance_row)
        # Add manual requirements to the compliance output
        for requirement in compliance.Requirements:
            if not requirement.Checks:
                for attribute in requirement.Attributes:
                    compliance_row = CCC_AzureModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        SubscriptionId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_FamilyName=attribute.FamilyName,
                        Requirements_Attributes_FamilyDescription=attribute.FamilyDescription,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_SubSectionObjective=attribute.SubSectionObjective,
                        Requirements_Attributes_Applicability=attribute.Applicability,
                        Requirements_Attributes_Recommendation=attribute.Recommendation,
                        Requirements_Attributes_SectionThreatMappings=attribute.SectionThreatMappings,
                        Requirements_Attributes_SectionGuidelineMappings=attribute.SectionGuidelineMappings,
                        Status="MANUAL",
                        StatusExtended="Manual check",
                        ResourceId="manual_check",
                        ResourceName="Manual check",
                        CheckId="manual",
                        Muted=False,
                    )
                    self._data.append(compliance_row)
```

--------------------------------------------------------------------------------

---[FILE: ccc_gcp.py]---
Location: prowler-master/prowler/lib/outputs/compliance/ccc/ccc_gcp.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.ccc.models import CCC_GCPModel
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class CCC_GCP(ComplianceOutput):
    """
    This class represents the GCP CCC compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into GCP CCC compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into GCP CCC compliance format.

        Parameters:
            - findings (list): A list of findings.
            - compliance (Compliance): A compliance model.
            - compliance_name (str): The name of the compliance model.

        Returns:
            - None
        """
        for finding in findings:
            # Get the compliance requirements for the finding
            finding_requirements = finding.compliance.get(compliance_name, [])
            for requirement in compliance.Requirements:
                if requirement.Id in finding_requirements:
                    for attribute in requirement.Attributes:
                        compliance_row = CCC_GCPModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            ProjectId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_FamilyName=attribute.FamilyName,
                            Requirements_Attributes_FamilyDescription=attribute.FamilyDescription,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_SubSectionObjective=attribute.SubSectionObjective,
                            Requirements_Attributes_Applicability=attribute.Applicability,
                            Requirements_Attributes_Recommendation=attribute.Recommendation,
                            Requirements_Attributes_SectionThreatMappings=attribute.SectionThreatMappings,
                            Requirements_Attributes_SectionGuidelineMappings=attribute.SectionGuidelineMappings,
                            Status=finding.status,
                            StatusExtended=finding.status_extended,
                            ResourceId=finding.resource_uid,
                            ResourceName=finding.resource_name,
                            CheckId=finding.check_id,
                            Muted=finding.muted,
                        )
                        self._data.append(compliance_row)
        # Add manual requirements to the compliance output
        for requirement in compliance.Requirements:
            if not requirement.Checks:
                for attribute in requirement.Attributes:
                    compliance_row = CCC_GCPModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        ProjectId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_FamilyName=attribute.FamilyName,
                        Requirements_Attributes_FamilyDescription=attribute.FamilyDescription,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_SubSectionObjective=attribute.SubSectionObjective,
                        Requirements_Attributes_Applicability=attribute.Applicability,
                        Requirements_Attributes_Recommendation=attribute.Recommendation,
                        Requirements_Attributes_SectionThreatMappings=attribute.SectionThreatMappings,
                        Requirements_Attributes_SectionGuidelineMappings=attribute.SectionGuidelineMappings,
                        Status="MANUAL",
                        StatusExtended="Manual check",
                        ResourceId="manual_check",
                        ResourceName="Manual check",
                        CheckId="manual",
                        Muted=False,
                    )
                    self._data.append(compliance_row)
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/lib/outputs/compliance/ccc/models.py
Signals: Pydantic

```python
from typing import Optional

from pydantic import BaseModel


class CCC_AWSModel(BaseModel):
    """
    CCC_AWSModel generates a finding's output in AWS CCC Compliance format.
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_FamilyName: str
    Requirements_Attributes_FamilyDescription: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str]
    Requirements_Attributes_SubSectionObjective: str
    Requirements_Attributes_Applicability: list[str]
    Requirements_Attributes_Recommendation: str
    Requirements_Attributes_SectionThreatMappings: list[dict]
    Requirements_Attributes_SectionGuidelineMappings: list[dict]
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool


class CCC_AzureModel(BaseModel):
    """
    CCC_AzureModel generates a finding's output in Azure CCC Compliance format.
    """

    Provider: str
    Description: str
    SubscriptionId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_FamilyName: str
    Requirements_Attributes_FamilyDescription: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str]
    Requirements_Attributes_SubSectionObjective: str
    Requirements_Attributes_Applicability: list[str]
    Requirements_Attributes_Recommendation: str
    Requirements_Attributes_SectionThreatMappings: list[dict]
    Requirements_Attributes_SectionGuidelineMappings: list[dict]
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool


class CCC_GCPModel(BaseModel):
    """
    CCC_GCPModel generates a finding's output in GCP CCC Compliance format.
    """

    Provider: str
    Description: str
    ProjectId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_FamilyName: str
    Requirements_Attributes_FamilyDescription: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str]
    Requirements_Attributes_SubSectionObjective: str
    Requirements_Attributes_Applicability: list[str]
    Requirements_Attributes_Recommendation: str
    Requirements_Attributes_SectionThreatMappings: list[dict]
    Requirements_Attributes_SectionGuidelineMappings: list[dict]
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
```

--------------------------------------------------------------------------------

---[FILE: cis.py]---
Location: prowler-master/prowler/lib/outputs/compliance/cis/cis.py

```python
from colorama import Fore, Style
from tabulate import tabulate

from prowler.config.config import orange_color


def get_cis_table(
    findings: list,
    bulk_checks_metadata: dict,
    compliance_framework: str,
    output_filename: str,
    output_directory: str,
    compliance_overview: bool,
):
    sections = {}
    cis_compliance_table = {
        "Provider": [],
        "Section": [],
        "Level 1": [],
        "Level 2": [],
        "Muted": [],
    }
    pass_count = []
    fail_count = []
    muted_count = []
    for index, finding in enumerate(findings):
        check = bulk_checks_metadata[finding.check_metadata.CheckID]
        check_compliances = check.Compliance
        for compliance in check_compliances:
            version_in_name = compliance_framework.split("_")[1]
            if compliance.Framework == "CIS" and version_in_name in compliance.Version:
                for requirement in compliance.Requirements:
                    for attribute in requirement.Attributes:
                        section = attribute.Section
                        # Check if Section exists
                        if section not in sections:
                            sections[section] = {
                                "Status": f"{Fore.GREEN}PASS{Style.RESET_ALL}",
                                "Level 1": {"FAIL": 0, "PASS": 0},
                                "Level 2": {"FAIL": 0, "PASS": 0},
                                "Muted": 0,
                            }
                        if finding.muted:
                            if index not in muted_count:
                                muted_count.append(index)
                                sections[section]["Muted"] += 1
                        else:
                            if finding.status == "FAIL" and index not in fail_count:
                                fail_count.append(index)
                            elif finding.status == "PASS" and index not in pass_count:
                                pass_count.append(index)
                        if "Level 1" in attribute.Profile:
                            if not finding.muted:
                                if finding.status == "FAIL":
                                    sections[section]["Level 1"]["FAIL"] += 1
                                else:
                                    sections[section]["Level 1"]["PASS"] += 1
                        elif "Level 2" in attribute.Profile:
                            if not finding.muted:
                                if finding.status == "FAIL":
                                    sections[section]["Level 2"]["FAIL"] += 1
                                else:
                                    sections[section]["Level 2"]["PASS"] += 1

    # Add results to table
    sections = dict(sorted(sections.items()))
    for section in sections:
        cis_compliance_table["Provider"].append(compliance.Provider)
        cis_compliance_table["Section"].append(section)
        if sections[section]["Level 1"]["FAIL"] > 0:
            cis_compliance_table["Level 1"].append(
                f"{Fore.RED}FAIL({sections[section]['Level 1']['FAIL']}){Style.RESET_ALL}"
            )
        else:
            cis_compliance_table["Level 1"].append(
                f"{Fore.GREEN}PASS({sections[section]['Level 1']['PASS']}){Style.RESET_ALL}"
            )
        if sections[section]["Level 2"]["FAIL"] > 0:
            cis_compliance_table["Level 2"].append(
                f"{Fore.RED}FAIL({sections[section]['Level 2']['FAIL']}){Style.RESET_ALL}"
            )
        else:
            cis_compliance_table["Level 2"].append(
                f"{Fore.GREEN}PASS({sections[section]['Level 2']['PASS']}){Style.RESET_ALL}"
            )
        cis_compliance_table["Muted"].append(
            f"{orange_color}{sections[section]['Muted']}{Style.RESET_ALL}"
        )
    if (
        len(fail_count) + len(pass_count) + len(muted_count) > 1
    ):  # If there are no resources, don't print the compliance table
        print(
            f"\nCompliance Status of {Fore.YELLOW}{compliance_framework.upper()}{Style.RESET_ALL} Framework:"
        )
        total_findings_count = len(fail_count) + len(pass_count) + len(muted_count)
        overview_table = [
            [
                f"{Fore.RED}{round(len(fail_count) / total_findings_count * 100, 2)}% ({len(fail_count)}) FAIL{Style.RESET_ALL}",
                f"{Fore.GREEN}{round(len(pass_count) / total_findings_count * 100, 2)}% ({len(pass_count)}) PASS{Style.RESET_ALL}",
                f"{orange_color}{round(len(muted_count) / total_findings_count * 100, 2)}% ({len(muted_count)}) MUTED{Style.RESET_ALL}",
            ]
        ]
        print(tabulate(overview_table, tablefmt="rounded_grid"))
        if not compliance_overview:
            print(
                f"\nFramework {Fore.YELLOW}{compliance_framework.upper()}{Style.RESET_ALL} Results:"
            )
            print(
                tabulate(
                    cis_compliance_table,
                    headers="keys",
                    tablefmt="rounded_grid",
                )
            )
            print(
                f"{Style.BRIGHT}* Only sections containing results appear.{Style.RESET_ALL}"
            )
            print(f"\nDetailed results of {compliance_framework.upper()} are in:")
            print(
                f" - CSV: {output_directory}/compliance/{output_filename}_{compliance_framework}.csv\n"
            )
```

--------------------------------------------------------------------------------

---[FILE: cis_alibabacloud.py]---
Location: prowler-master/prowler/lib/outputs/compliance/cis/cis_alibabacloud.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.cis.models import AlibabaCloudCISModel
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class AlibabaCloudCIS(ComplianceOutput):
    """
    This class represents the Alibaba Cloud CIS compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Alibaba Cloud CIS compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Alibaba Cloud CIS compliance format.

        Parameters:
            - findings (list): A list of findings.
            - compliance (Compliance): A compliance model.
            - compliance_name (str): The name of the compliance model.

        Returns:
            - None
        """
        for finding in findings:
            # Get the compliance requirements for the finding
            finding_requirements = finding.compliance.get(compliance_name, [])
            for requirement in compliance.Requirements:
                if requirement.Id in finding_requirements:
                    for attribute in requirement.Attributes:
                        compliance_row = AlibabaCloudCISModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            AccountId=finding.account_uid,
                            Region=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_Profile=attribute.Profile,
                            Requirements_Attributes_AssessmentStatus=attribute.AssessmentStatus,
                            Requirements_Attributes_Description=attribute.Description,
                            Requirements_Attributes_RationaleStatement=attribute.RationaleStatement,
                            Requirements_Attributes_ImpactStatement=attribute.ImpactStatement,
                            Requirements_Attributes_RemediationProcedure=attribute.RemediationProcedure,
                            Requirements_Attributes_AuditProcedure=attribute.AuditProcedure,
                            Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                            Requirements_Attributes_DefaultValue=attribute.DefaultValue,
                            Requirements_Attributes_References=attribute.References,
                            Status=finding.status,
                            StatusExtended=finding.status_extended,
                            ResourceId=finding.resource_uid,
                            ResourceName=finding.resource_name,
                            CheckId=finding.check_id,
                            Muted=finding.muted,
                            Framework=compliance.Framework,
                            Name=compliance.Name,
                        )
                        self._data.append(compliance_row)
        # Add manual requirements to the compliance output
        for requirement in compliance.Requirements:
            if not requirement.Checks:
                for attribute in requirement.Attributes:
                    compliance_row = AlibabaCloudCISModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_Profile=attribute.Profile,
                        Requirements_Attributes_AssessmentStatus=attribute.AssessmentStatus,
                        Requirements_Attributes_Description=attribute.Description,
                        Requirements_Attributes_RationaleStatement=attribute.RationaleStatement,
                        Requirements_Attributes_ImpactStatement=attribute.ImpactStatement,
                        Requirements_Attributes_RemediationProcedure=attribute.RemediationProcedure,
                        Requirements_Attributes_AuditProcedure=attribute.AuditProcedure,
                        Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                        Requirements_Attributes_DefaultValue=attribute.DefaultValue,
                        Requirements_Attributes_References=attribute.References,
                        Status="MANUAL",
                        StatusExtended="Manual check",
                        ResourceId="manual_check",
                        ResourceName="Manual check",
                        CheckId="manual",
                        Muted=False,
                        Framework=compliance.Framework,
                        Name=compliance.Name,
                    )
                    self._data.append(compliance_row)
```

--------------------------------------------------------------------------------

---[FILE: cis_aws.py]---
Location: prowler-master/prowler/lib/outputs/compliance/cis/cis_aws.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.cis.models import AWSCISModel
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class AWSCIS(ComplianceOutput):
    """
    This class represents the AWS CIS compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into AWS CIS compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into AWS CIS compliance format.

        Parameters:
            - findings (list): A list of findings.
            - compliance (Compliance): A compliance model.
            - compliance_name (str): The name of the compliance model.

        Returns:
            - None
        """
        for finding in findings:
            # Get the compliance requirements for the finding
            finding_requirements = finding.compliance.get(compliance_name, [])
            for requirement in compliance.Requirements:
                if requirement.Id in finding_requirements:
                    for attribute in requirement.Attributes:
                        compliance_row = AWSCISModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            AccountId=finding.account_uid,
                            Region=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_Profile=attribute.Profile,
                            Requirements_Attributes_AssessmentStatus=attribute.AssessmentStatus,
                            Requirements_Attributes_Description=attribute.Description,
                            Requirements_Attributes_RationaleStatement=attribute.RationaleStatement,
                            Requirements_Attributes_ImpactStatement=attribute.ImpactStatement,
                            Requirements_Attributes_RemediationProcedure=attribute.RemediationProcedure,
                            Requirements_Attributes_AuditProcedure=attribute.AuditProcedure,
                            Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                            Requirements_Attributes_DefaultValue=attribute.DefaultValue,
                            Requirements_Attributes_References=attribute.References,
                            Status=finding.status,
                            StatusExtended=finding.status_extended,
                            ResourceId=finding.resource_uid,
                            ResourceName=finding.resource_name,
                            CheckId=finding.check_id,
                            Muted=finding.muted,
                            Framework=compliance.Framework,
                            Name=compliance.Name,
                        )
                        self._data.append(compliance_row)
        # Add manual requirements to the compliance output
        for requirement in compliance.Requirements:
            if not requirement.Checks:
                for attribute in requirement.Attributes:
                    compliance_row = AWSCISModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_Profile=attribute.Profile,
                        Requirements_Attributes_AssessmentStatus=attribute.AssessmentStatus,
                        Requirements_Attributes_Description=attribute.Description,
                        Requirements_Attributes_RationaleStatement=attribute.RationaleStatement,
                        Requirements_Attributes_ImpactStatement=attribute.ImpactStatement,
                        Requirements_Attributes_RemediationProcedure=attribute.RemediationProcedure,
                        Requirements_Attributes_AuditProcedure=attribute.AuditProcedure,
                        Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                        Requirements_Attributes_DefaultValue=attribute.DefaultValue,
                        Requirements_Attributes_References=attribute.References,
                        Status="MANUAL",
                        StatusExtended="Manual check",
                        ResourceId="manual_check",
                        ResourceName="Manual check",
                        CheckId="manual",
                        Muted=False,
                        Framework=compliance.Framework,
                        Name=compliance.Name,
                    )
                    self._data.append(compliance_row)
```

--------------------------------------------------------------------------------

---[FILE: cis_azure.py]---
Location: prowler-master/prowler/lib/outputs/compliance/cis/cis_azure.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.cis.models import AzureCISModel
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class AzureCIS(ComplianceOutput):
    """
    This class represents the Azure CIS compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Azure CIS compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Azure CIS compliance format.

        Parameters:
            - findings (list): A list of findings.
            - compliance (Compliance): A compliance model.
            - compliance_name (str): The name of the compliance model.

        Returns:
            - None
        """
        for finding in findings:
            # Get the compliance requirements for the finding
            finding_requirements = finding.compliance.get(compliance_name, [])
            for requirement in compliance.Requirements:
                if requirement.Id in finding_requirements:
                    for attribute in requirement.Attributes:
                        compliance_row = AzureCISModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            SubscriptionId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_Profile=attribute.Profile,
                            Requirements_Attributes_AssessmentStatus=attribute.AssessmentStatus,
                            Requirements_Attributes_Description=attribute.Description,
                            Requirements_Attributes_RationaleStatement=attribute.RationaleStatement,
                            Requirements_Attributes_ImpactStatement=attribute.ImpactStatement,
                            Requirements_Attributes_RemediationProcedure=attribute.RemediationProcedure,
                            Requirements_Attributes_AuditProcedure=attribute.AuditProcedure,
                            Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                            Requirements_Attributes_DefaultValue=attribute.DefaultValue,
                            Requirements_Attributes_References=attribute.References,
                            Status=finding.status,
                            StatusExtended=finding.status_extended,
                            ResourceId=finding.resource_uid,
                            ResourceName=finding.resource_name,
                            CheckId=finding.check_id,
                            Muted=finding.muted,
                            Framework=compliance.Framework,
                            Name=compliance.Name,
                        )
                        self._data.append(compliance_row)
        # Add manual requirements to the compliance output
        for requirement in compliance.Requirements:
            if not requirement.Checks:
                for attribute in requirement.Attributes:
                    compliance_row = AzureCISModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        SubscriptionId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_Profile=attribute.Profile,
                        Requirements_Attributes_AssessmentStatus=attribute.AssessmentStatus,
                        Requirements_Attributes_Description=attribute.Description,
                        Requirements_Attributes_RationaleStatement=attribute.RationaleStatement,
                        Requirements_Attributes_ImpactStatement=attribute.ImpactStatement,
                        Requirements_Attributes_RemediationProcedure=attribute.RemediationProcedure,
                        Requirements_Attributes_AuditProcedure=attribute.AuditProcedure,
                        Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                        Requirements_Attributes_DefaultValue=attribute.DefaultValue,
                        Requirements_Attributes_References=attribute.References,
                        Status="MANUAL",
                        StatusExtended="Manual check",
                        ResourceId="manual_check",
                        ResourceName="Manual check",
                        CheckId="manual",
                        Muted=False,
                        Framework=compliance.Framework,
                        Name=compliance.Name,
                    )
                    self._data.append(compliance_row)
```

--------------------------------------------------------------------------------

````
