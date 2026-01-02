---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 204
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 204 of 867)

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

---[FILE: compliance_output.py]---
Location: prowler-master/prowler/lib/outputs/compliance/compliance_output.py

```python
from csv import DictWriter
from pathlib import Path
from typing import List

from prowler.lib.check.compliance_models import Compliance
from prowler.lib.logger import logger
from prowler.lib.outputs.finding import Finding
from prowler.lib.outputs.output import Output


class ComplianceOutput(Output):
    """
    This class represents an abstract base class for defining different types of outputs for findings.

    Attributes:
        _data (list): A list to store transformed data from findings.
        _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        __init__: Initializes the Output class with findings, optionally creates a file descriptor.
        data: Property to access the transformed data.
        file_descriptor: Property to access the file descriptor.
        transform: Abstract method to transform findings into a specific format.
        batch_write_data_to_file: Abstract method to write data to a file in batches.
        create_file_descriptor: Method to create a file descriptor for writing data to a file.
    """

    def __init__(
        self,
        findings: List[Finding],
        compliance: Compliance,
        file_path: str = None,
        file_extension: str = "",
        from_cli: bool = True,
    ) -> None:
        # TODO: This class needs to be refactored to use the Output class init, methods and properties
        self._data = []
        self.close_file = False
        self.file_path = file_path
        self.file_descriptor = None
        # This parameter is to avoid refactoring more code, the CLI does not write in batches, the API does
        self._from_cli = from_cli

        if not file_extension and file_path:
            # Compliance reports are always CSV, so just use the last suffix
            # e.g., "cis_5.0_aws.csv" should have extension ".csv", not ".0_aws.csv"
            path_obj = Path(file_path)
            self._file_extension = path_obj.suffix if path_obj.suffix else ""
        if file_extension:
            self._file_extension = file_extension
            self.file_path = f"{file_path}{self.file_extension}"

        if findings:
            # Get the compliance name of the model
            compliance_name = (
                compliance.Framework + "-" + compliance.Version
                if compliance.Version
                else compliance.Framework
            )
            self.transform(findings, compliance, compliance_name)
            if not self._file_descriptor and file_path:
                self.create_file_descriptor(self.file_path)

    def batch_write_data_to_file(self) -> None:
        """
        Writes the findings data to a CSV file in the specific compliance format.

        Returns:
            - None
        """
        try:
            if (
                getattr(self, "_file_descriptor", None)
                and not self._file_descriptor.closed
                and self._data
            ):
                csv_writer = DictWriter(
                    self._file_descriptor,
                    fieldnames=[field.upper() for field in self._data[0].dict().keys()],
                    delimiter=";",
                )
                if self._file_descriptor.tell() == 0:
                    csv_writer.writeheader()
                for finding in self._data:
                    csv_writer.writerow(
                        {k.upper(): v for k, v in finding.dict().items()}
                    )
                if self.close_file or self._from_cli:
                    self._file_descriptor.close()
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
```

--------------------------------------------------------------------------------

---[FILE: aws_well_architected.py]---
Location: prowler-master/prowler/lib/outputs/compliance/aws_well_architected/aws_well_architected.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.aws_well_architected.models import (
    AWSWellArchitectedModel,
)
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class AWSWellArchitected(ComplianceOutput):
    """
    This class represents the AWS Well-Architected compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into AWS Well-Architected compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into AWS Well-Architected compliance format.

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
                        compliance_row = AWSWellArchitectedModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            AccountId=finding.account_uid,
                            Region=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Name=attribute.Name,
                            Requirements_Attributes_WellArchitectedQuestionId=attribute.WellArchitectedQuestionId,
                            Requirements_Attributes_WellArchitectedPracticeId=attribute.WellArchitectedPracticeId,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                            Requirements_Attributes_AssessmentMethod=attribute.AssessmentMethod,
                            Requirements_Attributes_Description=attribute.Description,
                            Requirements_Attributes_ImplementationGuidanceUrl=attribute.ImplementationGuidanceUrl,
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
                    compliance_row = AWSWellArchitectedModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Name=attribute.Name,
                        Requirements_Attributes_WellArchitectedQuestionId=attribute.WellArchitectedQuestionId,
                        Requirements_Attributes_WellArchitectedPracticeId=attribute.WellArchitectedPracticeId,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                        Requirements_Attributes_AssessmentMethod=attribute.AssessmentMethod,
                        Requirements_Attributes_Description=attribute.Description,
                        Requirements_Attributes_ImplementationGuidanceUrl=attribute.ImplementationGuidanceUrl,
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

---[FILE: models.py]---
Location: prowler-master/prowler/lib/outputs/compliance/aws_well_architected/models.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel


class AWSWellArchitectedModel(BaseModel):
    """
    AWSWellArchitectedModel generates a finding's output in AWS Well-Architected Framework format.
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Name: str
    Requirements_Attributes_WellArchitectedQuestionId: str
    Requirements_Attributes_WellArchitectedPracticeId: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_LevelOfRisk: str
    Requirements_Attributes_AssessmentMethod: str
    Requirements_Attributes_Description: str
    Requirements_Attributes_ImplementationGuidanceUrl: str
    Status: str
    StatusExtended: str
    ResourceId: str
    CheckId: str
    Muted: bool
    ResourceName: str
    Framework: str
    Name: str
```

--------------------------------------------------------------------------------

---[FILE: c5.py]---
Location: prowler-master/prowler/lib/outputs/compliance/c5/c5.py

```python
from colorama import Fore, Style
from tabulate import tabulate

from prowler.config.config import orange_color


def get_c5_table(
    findings: list,
    bulk_checks_metadata: dict,
    compliance_framework: str,
    output_filename: str,
    output_directory: str,
    compliance_overview: bool,
):
    section_table = {
        "Provider": [],
        "Section": [],
        "Status": [],
        "Muted": [],
    }
    pass_count = []
    fail_count = []
    muted_count = []
    sections = {}
    for index, finding in enumerate(findings):
        check = bulk_checks_metadata[finding.check_metadata.CheckID]
        check_compliances = check.Compliance
        for compliance in check_compliances:
            if compliance.Framework == "C5":
                for requirement in compliance.Requirements:
                    for attribute in requirement.Attributes:
                        section = attribute.Section

                        if section not in sections:
                            sections[section] = {"FAIL": 0, "PASS": 0, "Muted": 0}

                        if finding.muted:
                            if index not in muted_count:
                                muted_count.append(index)
                                sections[section]["Muted"] += 1
                        else:
                            if finding.status == "FAIL" and index not in fail_count:
                                fail_count.append(index)
                                sections[section]["FAIL"] += 1
                            elif finding.status == "PASS" and index not in pass_count:
                                pass_count.append(index)
                                sections[section]["PASS"] += 1

    sections = dict(sorted(sections.items()))
    for section in sections:
        section_table["Provider"].append(compliance.Provider)
        section_table["Section"].append(section)
        if sections[section]["FAIL"] > 0:
            section_table["Status"].append(
                f"{Fore.RED}FAIL({sections[section]['FAIL']}){Style.RESET_ALL}"
            )
        else:
            if sections[section]["PASS"] > 0:
                section_table["Status"].append(
                    f"{Fore.GREEN}PASS({sections[section]['PASS']}){Style.RESET_ALL}"
                )
            else:
                section_table["Status"].append(f"{Fore.GREEN}PASS{Style.RESET_ALL}")
        section_table["Muted"].append(
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
            if len(fail_count) > 0 and len(section_table["Section"]) > 0:
                print(
                    f"\nFramework {Fore.YELLOW}{compliance_framework.upper()}{Style.RESET_ALL} Results:"
                )
                print(
                    tabulate(
                        section_table,
                        tablefmt="rounded_grid",
                        headers="keys",
                    )
                )
                print(f"\nDetailed results of {compliance_framework.upper()} are in:")
                print(
                    f" - CSV: {output_directory}/compliance/{output_filename}_{compliance_framework}.csv\n"
                )
```

--------------------------------------------------------------------------------

---[FILE: c5_aws.py]---
Location: prowler-master/prowler/lib/outputs/compliance/c5/c5_aws.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.c5.models import AWSC5Model
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class AWSC5(ComplianceOutput):
    """
    This class represents the AWS C5 compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into AWS C5 compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into AWS C5 compliance format.

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
                        compliance_row = AWSC5Model(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            AccountId=finding.account_uid,
                            Region=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_Type=attribute.Type,
                            Requirements_Attributes_AboutCriteria=attribute.AboutCriteria,
                            Requirements_Attributes_ComplementaryCriteria=attribute.ComplementaryCriteria,
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
                    compliance_row = AWSC5Model(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_Type=attribute.Type,
                        Requirements_Attributes_AboutCriteria=attribute.AboutCriteria,
                        Requirements_Attributes_ComplementaryCriteria=attribute.ComplementaryCriteria,
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

---[FILE: c5_azure.py]---
Location: prowler-master/prowler/lib/outputs/compliance/c5/c5_azure.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.c5.models import AzureC5Model
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class AzureC5(ComplianceOutput):
    """
    This class represents the Azure C5 compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Azure C5 compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Azure C5 compliance format.

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
                        compliance_row = AzureC5Model(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            SubscriptionId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_Type=attribute.Type,
                            Requirements_Attributes_AboutCriteria=attribute.AboutCriteria,
                            Requirements_Attributes_ComplementaryCriteria=attribute.ComplementaryCriteria,
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
                    compliance_row = AzureC5Model(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        SubscriptionId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_Type=attribute.Type,
                        Requirements_Attributes_AboutCriteria=attribute.AboutCriteria,
                        Requirements_Attributes_ComplementaryCriteria=attribute.ComplementaryCriteria,
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

---[FILE: c5_gcp.py]---
Location: prowler-master/prowler/lib/outputs/compliance/c5/c5_gcp.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.c5.models import GCPC5Model
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class GCPC5(ComplianceOutput):
    """
    This class represents the GCP C5 compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into GCP C5 compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into GCP C5 compliance format.

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
                        compliance_row = GCPC5Model(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            ProjectId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_Type=attribute.Type,
                            Requirements_Attributes_AboutCriteria=attribute.AboutCriteria,
                            Requirements_Attributes_ComplementaryCriteria=attribute.ComplementaryCriteria,
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
                    compliance_row = GCPC5Model(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        ProjectId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_Type=attribute.Type,
                        Requirements_Attributes_AboutCriteria=attribute.AboutCriteria,
                        Requirements_Attributes_ComplementaryCriteria=attribute.ComplementaryCriteria,
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

---[FILE: models.py]---
Location: prowler-master/prowler/lib/outputs/compliance/c5/models.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel


class AWSC5Model(BaseModel):
    """
    AWSC5Model generates a finding's output in AWS C5 Compliance format.
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: str = None
    Requirements_Attributes_Type: str = None
    Requirements_Attributes_AboutCriteria: Optional[str] = None
    Requirements_Attributes_ComplementaryCriteria: Optional[str] = None
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class AzureC5Model(BaseModel):
    """
    AzureC5Model generates a finding's output in Azure C5 Compliance format.
    """

    Provider: str
    Description: str
    SubscriptionId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: str = None
    Requirements_Attributes_Type: str = None
    Requirements_Attributes_AboutCriteria: Optional[str] = None
    Requirements_Attributes_ComplementaryCriteria: Optional[str] = None
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class GCPC5Model(BaseModel):
    """
    GCPC5Model generates a finding's output in GCP C5 Compliance format.
    """

    Provider: str
    Description: str
    ProjectId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: str = None
    Requirements_Attributes_Type: str = None
    Requirements_Attributes_AboutCriteria: Optional[str] = None
    Requirements_Attributes_ComplementaryCriteria: Optional[str] = None
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str
```

--------------------------------------------------------------------------------

---[FILE: ccc_aws.py]---
Location: prowler-master/prowler/lib/outputs/compliance/ccc/ccc_aws.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.ccc.models import CCC_AWSModel
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class CCC_AWS(ComplianceOutput):
    """
    This class represents the AWS CCC compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into AWS CCC compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into AWS CCC compliance format.

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
                        compliance_row = CCC_AWSModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            AccountId=finding.account_uid,
                            Region=finding.region,
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
                    compliance_row = CCC_AWSModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
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

````
