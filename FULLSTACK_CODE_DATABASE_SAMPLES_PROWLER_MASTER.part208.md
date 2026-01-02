---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 208
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 208 of 867)

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

---[FILE: iso27001_azure.py]---
Location: prowler-master/prowler/lib/outputs/compliance/iso27001/iso27001_azure.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.iso27001.models import AzureISO27001Model
from prowler.lib.outputs.finding import Finding


class AzureISO27001(ComplianceOutput):
    """
    This class represents the Azure ISO 27001 compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Azure ISO 27001 compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Azure ISO 27001 compliance format.

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
                        compliance_row = AzureISO27001Model(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            SubscriptionId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Name=requirement.Name,
                            Requirements_Attributes_Category=attribute.Category,
                            Requirements_Attributes_Objetive_ID=attribute.Objetive_ID,
                            Requirements_Attributes_Objetive_Name=attribute.Objetive_Name,
                            Requirements_Attributes_Check_Summary=attribute.Check_Summary,
                            Status=finding.status,
                            StatusExtended=finding.status_extended,
                            ResourceId=finding.resource_uid,
                            CheckId=finding.check_id,
                            Muted=finding.muted,
                            ResourceName=finding.resource_name,
                            Framework=compliance.Framework,
                            Name=compliance.Name,
                        )
                        self._data.append(compliance_row)
        # Add manual requirements to the compliance output
        for requirement in compliance.Requirements:
            if not requirement.Checks:
                for attribute in requirement.Attributes:
                    compliance_row = AzureISO27001Model(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        SubscriptionId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Name=requirement.Name,
                        Requirements_Attributes_Category=attribute.Category,
                        Requirements_Attributes_Objetive_ID=attribute.Objetive_ID,
                        Requirements_Attributes_Objetive_Name=attribute.Objetive_Name,
                        Requirements_Attributes_Check_Summary=attribute.Check_Summary,
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

---[FILE: iso27001_gcp.py]---
Location: prowler-master/prowler/lib/outputs/compliance/iso27001/iso27001_gcp.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.iso27001.models import GCPISO27001Model
from prowler.lib.outputs.finding import Finding


class GCPISO27001(ComplianceOutput):
    """
    This class represents the GCP ISO 27001 compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into GCP ISO 27001 compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into GCP ISO 27001 compliance format.

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
                        compliance_row = GCPISO27001Model(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            ProjectId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Name=requirement.Name,
                            Requirements_Attributes_Category=attribute.Category,
                            Requirements_Attributes_Objetive_ID=attribute.Objetive_ID,
                            Requirements_Attributes_Objetive_Name=attribute.Objetive_Name,
                            Requirements_Attributes_Check_Summary=attribute.Check_Summary,
                            Status=finding.status,
                            StatusExtended=finding.status_extended,
                            ResourceId=finding.resource_uid,
                            CheckId=finding.check_id,
                            Muted=finding.muted,
                            ResourceName=finding.resource_name,
                            Framework=compliance.Framework,
                            Name=compliance.Name,
                        )
                        self._data.append(compliance_row)
        # Add manual requirements to the compliance output
        for requirement in compliance.Requirements:
            if not requirement.Checks:
                for attribute in requirement.Attributes:
                    compliance_row = GCPISO27001Model(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        ProjectId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Name=requirement.Name,
                        Requirements_Attributes_Category=attribute.Category,
                        Requirements_Attributes_Objetive_ID=attribute.Objetive_ID,
                        Requirements_Attributes_Objetive_Name=attribute.Objetive_Name,
                        Requirements_Attributes_Check_Summary=attribute.Check_Summary,
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

---[FILE: iso27001_kubernetes.py]---
Location: prowler-master/prowler/lib/outputs/compliance/iso27001/iso27001_kubernetes.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.iso27001.models import KubernetesISO27001Model
from prowler.lib.outputs.finding import Finding


class KubernetesISO27001(ComplianceOutput):
    """
    This class represents the Kubernetes ISO 27001 compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Kubernetes ISO 27001 compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Kubernetes ISO 27001 compliance format.

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
                        compliance_row = KubernetesISO27001Model(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            Context=finding.account_name,
                            Namespace=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Name=requirement.Name,
                            Requirements_Attributes_Category=attribute.Category,
                            Requirements_Attributes_Objetive_ID=attribute.Objetive_ID,
                            Requirements_Attributes_Objetive_Name=attribute.Objetive_Name,
                            Requirements_Attributes_Check_Summary=attribute.Check_Summary,
                            Status=finding.status,
                            StatusExtended=finding.status_extended,
                            ResourceId=finding.resource_uid,
                            CheckId=finding.check_id,
                            Muted=finding.muted,
                            ResourceName=finding.resource_name,
                            Framework=compliance.Framework,
                            Name=compliance.Name,
                        )
                        self._data.append(compliance_row)
        # Add manual requirements to the compliance output
        for requirement in compliance.Requirements:
            if not requirement.Checks:
                for attribute in requirement.Attributes:
                    compliance_row = KubernetesISO27001Model(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        Context="",
                        Namespace="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Name=requirement.Name,
                        Requirements_Attributes_Category=attribute.Category,
                        Requirements_Attributes_Objetive_ID=attribute.Objetive_ID,
                        Requirements_Attributes_Objetive_Name=attribute.Objetive_Name,
                        Requirements_Attributes_Check_Summary=attribute.Check_Summary,
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

---[FILE: iso27001_m365.py]---
Location: prowler-master/prowler/lib/outputs/compliance/iso27001/iso27001_m365.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.iso27001.models import M365ISO27001Model
from prowler.lib.outputs.finding import Finding


class M365ISO27001(ComplianceOutput):
    """
    This class represents the M365 ISO 27001 compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into M365 ISO 27001 compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into M365 ISO 27001 compliance format.

        Parameters:
            - findings (list): A list of findings.
            - compliance (Compliance): A compliance model.
            - compliance_name (str): The name of the compliance model.

        Returns:
            - None
        """
        for finding in findings:
            finding_requirements = finding.compliance.get(compliance_name, [])
            for requirement in compliance.Requirements:
                if requirement.Id in finding_requirements:
                    for attribute in requirement.Attributes:
                        compliance_row = M365ISO27001Model(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            TenantId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Name=requirement.Name,
                            Requirements_Attributes_Category=attribute.Category,
                            Requirements_Attributes_Objetive_ID=attribute.Objetive_ID,
                            Requirements_Attributes_Objetive_Name=attribute.Objetive_Name,
                            Requirements_Attributes_Check_Summary=attribute.Check_Summary,
                            Status=finding.status,
                            StatusExtended=finding.status_extended,
                            ResourceId=finding.resource_uid,
                            CheckId=finding.check_id,
                            Muted=finding.muted,
                            ResourceName=finding.resource_name,
                            Framework=compliance.Framework,
                            Name=compliance.Name,
                        )
                        self._data.append(compliance_row)

        # Add manual requirements to the compliance output
        for requirement in compliance.Requirements:
            if not requirement.Checks:
                for attribute in requirement.Attributes:
                    compliance_row = M365ISO27001Model(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        TenantId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Name=requirement.Name,
                        Requirements_Attributes_Category=attribute.Category,
                        Requirements_Attributes_Objetive_ID=attribute.Objetive_ID,
                        Requirements_Attributes_Objetive_Name=attribute.Objetive_Name,
                        Requirements_Attributes_Check_Summary=attribute.Check_Summary,
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

---[FILE: iso27001_nhn.py]---
Location: prowler-master/prowler/lib/outputs/compliance/iso27001/iso27001_nhn.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.iso27001.models import NHNISO27001Model
from prowler.lib.outputs.finding import Finding


class NHNISO27001(ComplianceOutput):
    """
    This class represents the NHN ISO 27001 compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into NHN ISO 27001 compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into NHN ISO 27001 compliance format.

        Parameters:
            - findings (list): A list of findings.
            - compliance (Compliance): A compliance model.
            - compliance_name (str): The name of the compliance model.

        Returns:
            - None
        """
        for finding in findings:
            finding_requirements = finding.compliance.get(compliance_name, [])
            for requirement in compliance.Requirements:
                if requirement.Id in finding_requirements:
                    for attribute in requirement.Attributes:
                        compliance_row = NHNISO27001Model(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            AccountId=finding.account_uid,
                            Region=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Name=requirement.Name,
                            Requirements_Attributes_Category=attribute.Category,
                            Requirements_Attributes_Objetive_ID=attribute.Objetive_ID,
                            Requirements_Attributes_Objetive_Name=attribute.Objetive_Name,
                            Requirements_Attributes_Check_Summary=attribute.Check_Summary,
                            Status=finding.status,
                            StatusExtended=finding.status_extended,
                            ResourceId=finding.resource_uid,
                            CheckId=finding.check_id,
                            Muted=finding.muted,
                            ResourceName=finding.resource_name,
                            Framework=compliance.Framework,
                            Name=compliance.Name,
                        )
                        self._data.append(compliance_row)

        # Add manual requirements to the compliance output
        for requirement in compliance.Requirements:
            if not requirement.Checks:
                for attribute in requirement.Attributes:
                    compliance_row = NHNISO27001Model(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Name=requirement.Name,
                        Requirements_Attributes_Category=attribute.Category,
                        Requirements_Attributes_Objetive_ID=attribute.Objetive_ID,
                        Requirements_Attributes_Objetive_Name=attribute.Objetive_Name,
                        Requirements_Attributes_Check_Summary=attribute.Check_Summary,
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
Location: prowler-master/prowler/lib/outputs/compliance/iso27001/models.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel


class AWSISO27001Model(BaseModel):
    """
    AWSISO27001Model generates a finding's output in CSV AWS ISO27001 format.
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Name: str
    Requirements_Description: str
    Requirements_Attributes_Category: str
    Requirements_Attributes_Objetive_ID: str
    Requirements_Attributes_Objetive_Name: str
    Requirements_Attributes_Check_Summary: str
    Status: str
    StatusExtended: str
    ResourceId: str
    CheckId: str
    Muted: bool
    ResourceName: str
    Framework: str
    Name: str


class AzureISO27001Model(BaseModel):
    """
    AzureISO27001Model generates a finding's output in CSV Azure ISO27001 format.
    """

    Provider: str
    Description: str
    SubscriptionId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Name: str
    Requirements_Description: str
    Requirements_Attributes_Category: str
    Requirements_Attributes_Objetive_ID: str
    Requirements_Attributes_Objetive_Name: str
    Requirements_Attributes_Check_Summary: str
    Status: str
    StatusExtended: str
    ResourceId: str
    CheckId: str
    Muted: bool
    ResourceName: str
    Framework: str
    Name: str


class GCPISO27001Model(BaseModel):
    """
    GCPISO27001Model generates a finding's output in CSV GCP ISO27001 format.
    """

    Provider: str
    Description: str
    ProjectId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Name: str
    Requirements_Description: str
    Requirements_Attributes_Category: str
    Requirements_Attributes_Objetive_ID: str
    Requirements_Attributes_Objetive_Name: str
    Requirements_Attributes_Check_Summary: str
    Status: str
    StatusExtended: str
    ResourceId: str
    CheckId: str
    Muted: bool
    ResourceName: str
    Framework: str
    Name: str


class KubernetesISO27001Model(BaseModel):
    """
    KubernetesISO27001Model generates a finding's output in CSV Kubernetes ISO27001 format.
    """

    Provider: str
    Description: str
    Context: str
    Namespace: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Name: str
    Requirements_Description: str
    Requirements_Attributes_Category: str
    Requirements_Attributes_Objetive_ID: str
    Requirements_Attributes_Objetive_Name: str
    Requirements_Attributes_Check_Summary: str
    Status: str
    StatusExtended: str
    ResourceId: str
    CheckId: str
    Muted: bool
    ResourceName: str
    Framework: str
    Name: str


class NHNISO27001Model(BaseModel):
    """
    NHNISO27001Model generates a finding's output in CSV NHN ISO27001 format.
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Name: str
    Requirements_Description: str
    Requirements_Attributes_Category: str
    Requirements_Attributes_Objetive_ID: str
    Requirements_Attributes_Objetive_Name: str
    Requirements_Attributes_Check_Summary: str
    Status: str
    StatusExtended: str
    ResourceId: str
    CheckId: str
    Muted: bool
    ResourceName: str
    Framework: str
    Name: str


class M365ISO27001Model(BaseModel):
    """
    M365ISO27001Model generates a finding's output in CSV M365 ISO27001 format.
    """

    Provider: str
    Description: str
    TenantId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Name: str
    Requirements_Description: str
    Requirements_Attributes_Category: str
    Requirements_Attributes_Objetive_ID: str
    Requirements_Attributes_Objetive_Name: str
    Requirements_Attributes_Check_Summary: str
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

---[FILE: kisa_ismsp.py]---
Location: prowler-master/prowler/lib/outputs/compliance/kisa_ismsp/kisa_ismsp.py

```python
from colorama import Fore, Style
from tabulate import tabulate

from prowler.config.config import orange_color


def get_kisa_ismsp_table(
    findings: list,
    bulk_checks_metadata: dict,
    compliance_framework: str,
    output_filename: str,
    output_directory: str,
    compliance_overview: bool,
):
    sections = {}
    sections_status = {}
    kisa_ismsp_compliance_table = {
        "Provider": [],
        "Section": [],
        "Status": [],
        "Muted": [],
    }
    pass_count = []
    fail_count = []
    muted_count = []
    for index, finding in enumerate(findings):
        check = bulk_checks_metadata[finding.check_metadata.CheckID]
        check_compliances = check.Compliance
        for compliance in check_compliances:
            if (
                compliance.Framework.startswith("KISA")
                and compliance.Version in compliance_framework
            ):
                for requirement in compliance.Requirements:
                    for attribute in requirement.Attributes:
                        section = attribute.Section
                        # Check if Section exists
                        if section not in sections:
                            sections[section] = {
                                "Status": {
                                    "PASS": 0,
                                    "FAIL": 0,
                                },
                                "Muted": 0,
                            }
                        if finding.muted:
                            if index not in muted_count:
                                muted_count.append(index)
                                sections[section]["Muted"] += 1
                        else:
                            if finding.status == "FAIL" and index not in fail_count:
                                fail_count.append(index)
                                sections[section]["Status"]["FAIL"] += 1
                            elif finding.status == "PASS" and index not in pass_count:
                                pass_count.append(index)
                                sections[section]["Status"]["PASS"] += 1

    # Add results to table
    sections = dict(sorted(sections.items()))
    for section in sections:
        if sections[section]["Status"]["FAIL"] > 0:
            sections_status[section] = (
                f"{Fore.RED}FAIL({sections[section]['Status']['FAIL']}){Style.RESET_ALL}"
            )
        else:
            if sections[section]["Status"]["PASS"] > 0:
                sections_status[section] = (
                    f"{Fore.GREEN}PASS({sections[section]['Status']['PASS']}){Style.RESET_ALL}"
                )
            else:
                sections_status[section] = f"{Fore.GREEN}PASS{Style.RESET_ALL}"
    for section in sections:
        kisa_ismsp_compliance_table["Provider"].append(compliance.Provider)
        kisa_ismsp_compliance_table["Section"].append(section)
        kisa_ismsp_compliance_table["Status"].append(sections_status[section])
        kisa_ismsp_compliance_table["Muted"].append(
            f"{orange_color}{sections[section]['Muted']}{Style.RESET_ALL}"
        )
    if len(fail_count) + len(pass_count) + len(muted_count) > 1:
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
                    kisa_ismsp_compliance_table,
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

---[FILE: kisa_ismsp_aws.py]---
Location: prowler-master/prowler/lib/outputs/compliance/kisa_ismsp/kisa_ismsp_aws.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.kisa_ismsp.models import AWSKISAISMSPModel
from prowler.lib.outputs.finding import Finding


class AWSKISAISMSP(ComplianceOutput):
    """
    This class represents the AWS KISA-ISMS-P compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into AWS KISA-ISMS-P compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into AWS KISA-ISMS-P compliance format.

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
                        compliance_row = AWSKISAISMSPModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            AccountId=finding.account_uid,
                            Region=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Name=requirement.Name,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Domain=attribute.Domain,
                            Requirements_Attributes_Subdomain=attribute.Subdomain,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_AuditChecklist=attribute.AuditChecklist,
                            Requirements_Attributes_RelatedRegulations=attribute.RelatedRegulations,
                            Requirements_Attributes_AuditEvidence=attribute.AuditEvidence,
                            Requirements_Attributes_NonComplianceCases=attribute.NonComplianceCases,
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
                    compliance_row = AWSKISAISMSPModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Name=requirement.Name,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Domain=attribute.Domain,
                        Requirements_Attributes_Subdomain=attribute.Subdomain,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_AuditChecklist=attribute.AuditChecklist,
                        Requirements_Attributes_RelatedRegulations=attribute.RelatedRegulations,
                        Requirements_Attributes_AuditEvidence=attribute.AuditEvidence,
                        Requirements_Attributes_NonComplianceCases=attribute.NonComplianceCases,
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
Location: prowler-master/prowler/lib/outputs/compliance/kisa_ismsp/models.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel


class AWSKISAISMSPModel(BaseModel):
    """
    The AWS KISA-ISMS-P Model outputs findings in a format compliant with the AWS KISA-ISMS-P standard
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Name: str
    Requirements_Description: str
    Requirements_Attributes_Domain: str
    Requirements_Attributes_Subdomain: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_AuditChecklist: Optional[list[str]] = None
    Requirements_Attributes_RelatedRegulations: Optional[list[str]] = None
    Requirements_Attributes_AuditEvidence: Optional[list[str]] = None
    Requirements_Attributes_NonComplianceCases: Optional[list[str]] = None
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

````
