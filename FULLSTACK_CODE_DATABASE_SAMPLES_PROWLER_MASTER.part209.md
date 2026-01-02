---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 209
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 209 of 867)

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

---[FILE: mitre_attack.py]---
Location: prowler-master/prowler/lib/outputs/compliance/mitre_attack/mitre_attack.py

```python
from colorama import Fore, Style
from tabulate import tabulate

from prowler.config.config import orange_color


def get_mitre_attack_table(
    findings: list,
    bulk_checks_metadata: dict,
    compliance_framework: str,
    output_filename: str,
    output_directory: str,
    compliance_overview: bool,
):
    tactics = {}
    mitre_compliance_table = {
        "Provider": [],
        "Tactic": [],
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
                "MITRE-ATTACK" in compliance.Framework
                and compliance.Version in compliance_framework
            ):
                for requirement in compliance.Requirements:
                    for tactic in requirement.Tactics:
                        if tactic not in tactics:
                            tactics[tactic] = {"FAIL": 0, "PASS": 0, "Muted": 0}
                        if finding.muted:
                            if index not in muted_count:
                                muted_count.append(index)
                                tactics[tactic]["Muted"] += 1
                        else:
                            if finding.status == "FAIL":
                                if index not in fail_count:
                                    fail_count.append(index)
                                    tactics[tactic]["FAIL"] += 1
                            elif finding.status == "PASS":
                                if index not in pass_count:
                                    pass_count.append(index)
                                    tactics[tactic]["PASS"] += 1
    # Add results to table
    tactics = dict(sorted(tactics.items()))
    for tactic in tactics:
        mitre_compliance_table["Provider"].append(compliance.Provider)
        mitre_compliance_table["Tactic"].append(tactic)
        if tactics[tactic]["FAIL"] > 0:
            mitre_compliance_table["Status"].append(
                f"{Fore.RED}FAIL({tactics[tactic]['FAIL']}){Style.RESET_ALL}"
            )
        else:
            mitre_compliance_table["Status"].append(
                f"{Fore.GREEN}PASS({tactics[tactic]['PASS']}){Style.RESET_ALL}"
            )
        mitre_compliance_table["Muted"].append(
            f"{orange_color}{tactics[tactic]['Muted']}{Style.RESET_ALL}"
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
                    mitre_compliance_table,
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

---[FILE: mitre_attack_aws.py]---
Location: prowler-master/prowler/lib/outputs/compliance/mitre_attack/mitre_attack_aws.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.mitre_attack.models import AWSMitreAttackModel
from prowler.lib.outputs.finding import Finding
from prowler.lib.outputs.utils import unroll_list


class AWSMitreAttack(ComplianceOutput):
    """
    This class represents the AWS MITRE ATT&CK compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into AWS MITRE ATT&CK compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into AWS MITRE ATT&CK compliance format.

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
                    compliance_row = AWSMitreAttackModel(
                        Provider=finding.provider,
                        Description=compliance.Description,
                        AccountId=finding.account_uid,
                        Region=finding.region,
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Name=requirement.Name,
                        Requirements_Description=requirement.Description,
                        Requirements_Tactics=unroll_list(requirement.Tactics),
                        Requirements_SubTechniques=unroll_list(
                            requirement.SubTechniques
                        ),
                        Requirements_Platforms=unroll_list(requirement.Platforms),
                        Requirements_TechniqueURL=requirement.TechniqueURL,
                        Requirements_Attributes_Services=", ".join(
                            attribute.AWSService for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Categories=", ".join(
                            attribute.Category for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Values=", ".join(
                            attribute.Value for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Comments=", ".join(
                            attribute.Comment for attribute in requirement.Attributes
                        ),
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
                    compliance_row = AWSMitreAttackModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Name=requirement.Name,
                        Requirements_Description=requirement.Description,
                        Requirements_Tactics=unroll_list(requirement.Tactics),
                        Requirements_SubTechniques=unroll_list(
                            requirement.SubTechniques
                        ),
                        Requirements_Platforms=unroll_list(requirement.Platforms),
                        Requirements_TechniqueURL=requirement.TechniqueURL,
                        Requirements_Attributes_Services=", ".join(
                            attribute.AWSService for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Categories=", ".join(
                            attribute.Category for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Values=", ".join(
                            attribute.Value for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Comments=", ".join(
                            attribute.Comment for attribute in requirement.Attributes
                        ),
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

---[FILE: mitre_attack_azure.py]---
Location: prowler-master/prowler/lib/outputs/compliance/mitre_attack/mitre_attack_azure.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.mitre_attack.models import AzureMitreAttackModel
from prowler.lib.outputs.finding import Finding
from prowler.lib.outputs.utils import unroll_list


class AzureMitreAttack(ComplianceOutput):
    """
    This class represents the Azure MITRE ATT&CK compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Azure MITRE ATT&CK compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Azure MITRE ATT&CK compliance format.

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
                    compliance_row = AzureMitreAttackModel(
                        Provider=finding.provider,
                        Description=compliance.Description,
                        SubscriptionId=finding.account_uid,
                        Location=finding.region,
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Name=requirement.Name,
                        Requirements_Description=requirement.Description,
                        Requirements_Tactics=unroll_list(requirement.Tactics),
                        Requirements_SubTechniques=unroll_list(
                            requirement.SubTechniques
                        ),
                        Requirements_Platforms=unroll_list(requirement.Platforms),
                        Requirements_TechniqueURL=requirement.TechniqueURL,
                        Requirements_Attributes_Services=", ".join(
                            attribute.AzureService
                            for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Categories=", ".join(
                            attribute.Category for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Values=", ".join(
                            attribute.Value for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Comments=", ".join(
                            attribute.Comment for attribute in requirement.Attributes
                        ),
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
                    compliance_row = AzureMitreAttackModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        SubscriptionId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Name=requirement.Name,
                        Requirements_Description=requirement.Description,
                        Requirements_Tactics=unroll_list(requirement.Tactics),
                        Requirements_SubTechniques=unroll_list(
                            requirement.SubTechniques
                        ),
                        Requirements_Platforms=unroll_list(requirement.Platforms),
                        Requirements_TechniqueURL=requirement.TechniqueURL,
                        Requirements_Attributes_Services=", ".join(
                            attribute.AzureService
                            for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Categories=", ".join(
                            attribute.Category for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Values=", ".join(
                            attribute.Value for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Comments=", ".join(
                            attribute.Comment for attribute in requirement.Attributes
                        ),
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

---[FILE: mitre_attack_gcp.py]---
Location: prowler-master/prowler/lib/outputs/compliance/mitre_attack/mitre_attack_gcp.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.mitre_attack.models import GCPMitreAttackModel
from prowler.lib.outputs.finding import Finding
from prowler.lib.outputs.utils import unroll_list


class GCPMitreAttack(ComplianceOutput):
    """
    This class represents the GCP MITRE ATT&CK compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into GCP MITRE ATT&CK compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into GCP MITRE ATT&CK compliance format.

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
                    compliance_row = GCPMitreAttackModel(
                        Provider=finding.provider,
                        Description=compliance.Description,
                        ProjectId=finding.account_uid,
                        Location=finding.region,
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Name=requirement.Name,
                        Requirements_Description=requirement.Description,
                        Requirements_Tactics=unroll_list(requirement.Tactics),
                        Requirements_SubTechniques=unroll_list(
                            requirement.SubTechniques
                        ),
                        Requirements_Platforms=unroll_list(requirement.Platforms),
                        Requirements_TechniqueURL=requirement.TechniqueURL,
                        Requirements_Attributes_Services=", ".join(
                            attribute.GCPService for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Categories=", ".join(
                            attribute.Category for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Values=", ".join(
                            attribute.Value for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Comments=", ".join(
                            attribute.Comment for attribute in requirement.Attributes
                        ),
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
                    compliance_row = GCPMitreAttackModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        ProjectId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Name=requirement.Name,
                        Requirements_Description=requirement.Description,
                        Requirements_Tactics=unroll_list(requirement.Tactics),
                        Requirements_SubTechniques=unroll_list(
                            requirement.SubTechniques
                        ),
                        Requirements_Platforms=unroll_list(requirement.Platforms),
                        Requirements_TechniqueURL=requirement.TechniqueURL,
                        Requirements_Attributes_Services=", ".join(
                            attribute.GCPService for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Categories=", ".join(
                            attribute.Category for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Values=", ".join(
                            attribute.Value for attribute in requirement.Attributes
                        ),
                        Requirements_Attributes_Comments=", ".join(
                            attribute.Comment for attribute in requirement.Attributes
                        ),
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
Location: prowler-master/prowler/lib/outputs/compliance/mitre_attack/models.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel


class AWSMitreAttackModel(BaseModel):
    """
    AWSMitreAttackModel generates a finding's output in CSV MITRE ATTACK format for AWS.
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Name: str
    Requirements_Description: str
    Requirements_Tactics: str
    Requirements_SubTechniques: str
    Requirements_Platforms: str
    Requirements_TechniqueURL: str
    Requirements_Attributes_Services: str
    Requirements_Attributes_Categories: str
    Requirements_Attributes_Values: str
    Requirements_Attributes_Comments: str
    Status: str
    StatusExtended: str
    ResourceId: str
    CheckId: str
    Muted: bool
    ResourceName: str
    Framework: str
    Name: str


class AzureMitreAttackModel(BaseModel):
    """
    AzureMitreAttackModel generates a finding's output in CSV MITRE ATTACK format for Azure.
    """

    Provider: str
    Description: str
    SubscriptionId: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Name: str
    Requirements_Description: str
    Requirements_Tactics: str
    Requirements_SubTechniques: str
    Requirements_Platforms: str
    Requirements_TechniqueURL: str
    Requirements_Attributes_Services: str
    Requirements_Attributes_Categories: str
    Requirements_Attributes_Values: str
    Requirements_Attributes_Comments: str
    Status: str
    StatusExtended: str
    ResourceId: str
    CheckId: str
    Muted: bool
    ResourceName: str
    Location: str
    Framework: str
    Name: str


class GCPMitreAttackModel(BaseModel):
    """
    GCPMitreAttackModel generates a finding's output in CSV MITRE ATTACK format for AWS.
    """

    Provider: str
    Description: str
    ProjectId: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Name: str
    Requirements_Description: str
    Requirements_Tactics: str
    Requirements_SubTechniques: str
    Requirements_Platforms: str
    Requirements_TechniqueURL: str
    Requirements_Attributes_Services: str
    Requirements_Attributes_Categories: str
    Requirements_Attributes_Values: str
    Requirements_Attributes_Comments: str
    Status: str
    StatusExtended: str
    ResourceId: str
    CheckId: str
    Muted: bool
    ResourceName: str
    Location: str
    Framework: str
    Name: str


# TODO: Create a parent class for the common fields of MITRE ATT&CK and have the specific classes from each provider to inherit from it.
# It is not done yet because it is needed to respect the current order of the fields in the output file.
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/lib/outputs/compliance/prowler_threatscore/models.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel


class ProwlerThreatScoreAWSModel(BaseModel):
    """
    ProwlerThreatScoreAWSModel generates a finding's output in AWS Prowler ThreatScore Compliance format.
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Title: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_AttributeDescription: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_LevelOfRisk: int
    Requirements_Attributes_Weight: int
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class ProwlerThreatScoreAzureModel(BaseModel):
    """
    ProwlerThreatScoreAzureModel generates a finding's output in Azure Prowler ThreatScore Compliance format.
    """

    Provider: str
    Description: str
    SubscriptionId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Title: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_AttributeDescription: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_LevelOfRisk: int
    Requirements_Attributes_Weight: int
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class ProwlerThreatScoreGCPModel(BaseModel):
    """
    ProwlerThreatScoreGCPModel generates a finding's output in GCP Prowler ThreatScore Compliance format.
    """

    Provider: str
    Description: str
    ProjectId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Title: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_AttributeDescription: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_LevelOfRisk: int
    Requirements_Attributes_Weight: int
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class ProwlerThreatScoreM365Model(BaseModel):
    """
    ProwlerThreatScoreM365Model generates a finding's output in M365 Prowler ThreatScore Compliance format.
    """

    Provider: str
    Description: str
    TenantId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Title: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_AttributeDescription: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_LevelOfRisk: int
    Requirements_Attributes_Weight: int
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class ProwlerThreatScoreKubernetesModel(BaseModel):
    """
    ProwlerThreatScoreKubernetesModel generates a finding's output in Kubernetes Prowler ThreatScore Compliance format.
    """

    Provider: str
    Description: str
    Context: str
    Namespace: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Title: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_AttributeDescription: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_LevelOfRisk: int
    Requirements_Attributes_Weight: int
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

---[FILE: prowler_threatscore.py]---
Location: prowler-master/prowler/lib/outputs/compliance/prowler_threatscore/prowler_threatscore.py

```python
from colorama import Fore, Style
from tabulate import tabulate

from prowler.config.config import orange_color
from prowler.lib.check.compliance_models import Compliance


def get_prowler_threatscore_table(
    findings: list,
    bulk_checks_metadata: dict,
    compliance_framework: str,
    output_filename: str,
    output_directory: str,
    compliance_overview: bool,
):
    pillar_table = {
        "Provider": [],
        "Pillar": [],
        "Status": [],
        "Score": [],
        "Muted": [],
    }
    pass_count = []
    fail_count = []
    muted_count = []
    pillars = {}
    generic_score = 0
    max_generic_score = 0
    counted_findings_generic = []
    score_per_pillar = {}
    max_score_per_pillar = {}
    counted_findings_per_pillar = {}
    for index, finding in enumerate(findings):
        check = bulk_checks_metadata[finding.check_metadata.CheckID]
        check_compliances = check.Compliance
        for compliance in check_compliances:
            if compliance.Framework == "ProwlerThreatScore":
                for requirement in compliance.Requirements:
                    for attribute in requirement.Attributes:
                        pillar = attribute.Section

                        if not any(
                            [
                                pillar in score_per_pillar.keys(),
                                pillar in max_score_per_pillar.keys(),
                                pillar in counted_findings_per_pillar.keys(),
                            ]
                        ):
                            score_per_pillar[pillar] = 0
                            max_score_per_pillar[pillar] = 0
                            counted_findings_per_pillar[pillar] = []

                        if (
                            index not in counted_findings_per_pillar[pillar]
                            and not finding.muted
                        ):
                            if finding.status == "PASS":
                                score_per_pillar[pillar] += (
                                    attribute.LevelOfRisk * attribute.Weight
                                )
                            max_score_per_pillar[pillar] += (
                                attribute.LevelOfRisk * attribute.Weight
                            )
                            counted_findings_per_pillar[pillar].append(index)

                        if pillar not in pillars:
                            pillars[pillar] = {"FAIL": 0, "PASS": 0, "Muted": 0}

                        if finding.muted:
                            if index not in muted_count:
                                muted_count.append(index)
                                pillars[pillar]["Muted"] += 1
                        else:
                            if finding.status == "FAIL" and index not in fail_count:
                                fail_count.append(index)
                                pillars[pillar]["FAIL"] += 1
                            elif finding.status == "PASS" and index not in pass_count:
                                pass_count.append(index)
                                pillars[pillar]["PASS"] += 1

                        # Generic score
                        if index not in counted_findings_generic and not finding.muted:
                            if finding.status == "PASS":
                                generic_score += (
                                    attribute.LevelOfRisk * attribute.Weight
                                )
                            max_generic_score += (
                                attribute.LevelOfRisk * attribute.Weight
                            )
                            counted_findings_generic.append(index)

    no_findings_pillars = []
    bulk_compliance = Compliance.get_bulk(provider=compliance.Provider.lower()).get(
        compliance_framework
    )
    for requirement in bulk_compliance.Requirements:
        for attribute in requirement.Attributes:
            pillar = attribute.Section
            if pillar not in pillars.keys() and pillar not in no_findings_pillars:
                no_findings_pillars.append(pillar)

    pillars = dict(sorted(pillars.items()))
    for pillar in pillars:
        pillar_table["Provider"].append(compliance.Provider)
        pillar_table["Pillar"].append(pillar)
        pillar_table["Score"].append(
            f"{Style.BRIGHT}{Fore.RED}{(score_per_pillar[pillar] / max_score_per_pillar[pillar]) * 100:.2f}%{Style.RESET_ALL}"
        )
        if pillars[pillar]["FAIL"] > 0:
            pillar_table["Status"].append(
                f"{Fore.RED}FAIL({pillars[pillar]['FAIL']}){Style.RESET_ALL}"
            )
        else:
            pillar_table["Status"].append(
                f"{Fore.GREEN}PASS({pillars[pillar]['PASS']}){Style.RESET_ALL}"
            )
        pillar_table["Muted"].append(
            f"{orange_color}{pillars[pillar]['Muted']}{Style.RESET_ALL}"
        )

    for pillar in no_findings_pillars:
        pillar_table["Provider"].append(compliance.Provider)
        pillar_table["Pillar"].append(pillar)
        pillar_table["Score"].append(f"{Style.BRIGHT}{Fore.GREEN}100%{Style.RESET_ALL}")
        pillar_table["Status"].append(f"{Fore.GREEN}PASS{Style.RESET_ALL}")
        pillar_table["Muted"].append(f"{orange_color}0{Style.RESET_ALL}")

    # Sort table by pillars
    pillar_table["Pillar"] = sorted(pillar_table["Pillar"])

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
            if len(fail_count) > 0 and len(pillar_table["Pillar"]) > 0:
                print(
                    f"\nFramework {Fore.YELLOW}{compliance_framework.upper()}{Style.RESET_ALL} Results:"
                )
                print(
                    f"\nGeneric Threat Score: {generic_score / max_generic_score * 100:.2f}%"
                )
                print(
                    tabulate(
                        pillar_table,
                        tablefmt="rounded_grid",
                        headers="keys",
                    )
                )

                print(
                    f"{Style.BRIGHT}\n=== Threat Score Guide ===\nThe lower the score, the higher the risk.{Style.RESET_ALL}"
                )
                print(
                    f"{Style.BRIGHT}(Only sections containing results appear, the score is calculated as the sum of the level of risk * weight of the passed findings divided by the sum of the risk * weight of all the findings){Style.RESET_ALL}"
                )
                print(f"\nDetailed results of {compliance_framework.upper()} are in:")
                print(
                    f" - CSV: {output_directory}/compliance/{output_filename}_{compliance_framework}.csv\n"
                )
```

--------------------------------------------------------------------------------

````
