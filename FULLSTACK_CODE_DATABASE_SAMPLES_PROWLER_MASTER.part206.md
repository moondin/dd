---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 206
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 206 of 867)

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

---[FILE: cis_gcp.py]---
Location: prowler-master/prowler/lib/outputs/compliance/cis/cis_gcp.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.cis.models import GCPCISModel
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class GCPCIS(ComplianceOutput):
    """
    This class represents the GCP CIS compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into GCP CIS compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into GCP CIS compliance format.

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
                        compliance_row = GCPCISModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            ProjectId=finding.account_uid,
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
                    compliance_row = GCPCISModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        ProjectId="",
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

---[FILE: cis_github.py]---
Location: prowler-master/prowler/lib/outputs/compliance/cis/cis_github.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.cis.models import GithubCISModel
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class GithubCIS(ComplianceOutput):
    """
    This class represents the GitHub CIS compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into GitHub CIS compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into GitHub CIS compliance format.

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
                        compliance_row = GithubCISModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            Account_Id=finding.account_uid,
                            Account_Name=finding.account_name,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_Profile=attribute.Profile,
                            Requirements_Attributes_AssessmentStatus=attribute.AssessmentStatus,
                            Requirements_Attributes_Description=attribute.Description,
                            Requirements_Attributes_RationaleStatement=attribute.RationaleStatement,
                            Requirements_Attributes_ImpactStatement=attribute.ImpactStatement,
                            Requirements_Attributes_RemediationProcedure=attribute.RemediationProcedure,
                            Requirements_Attributes_AuditProcedure=attribute.AuditProcedure,
                            Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                            Requirements_Attributes_References=attribute.References,
                            Requirements_Attributes_DefaultValue=attribute.DefaultValue,
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
                    compliance_row = GithubCISModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        Account_Id="",
                        Account_Name="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_Profile=attribute.Profile,
                        Requirements_Attributes_AssessmentStatus=attribute.AssessmentStatus,
                        Requirements_Attributes_Description=attribute.Description,
                        Requirements_Attributes_RationaleStatement=attribute.RationaleStatement,
                        Requirements_Attributes_ImpactStatement=attribute.ImpactStatement,
                        Requirements_Attributes_RemediationProcedure=attribute.RemediationProcedure,
                        Requirements_Attributes_AuditProcedure=attribute.AuditProcedure,
                        Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                        Requirements_Attributes_References=attribute.References,
                        Requirements_Attributes_DefaultValue=attribute.DefaultValue,
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

---[FILE: cis_kubernetes.py]---
Location: prowler-master/prowler/lib/outputs/compliance/cis/cis_kubernetes.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.cis.models import KubernetesCISModel
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class KubernetesCIS(ComplianceOutput):
    """
    This class represents the Kubernetes CIS compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Kubernetes CIS compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Kubernetes CIS compliance format.

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
                        compliance_row = KubernetesCISModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            Context=finding.account_name,
                            Namespace=finding.region,
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
                            Requirements_Attributes_References=attribute.References,
                            Requirements_Attributes_DefaultValue=attribute.DefaultValue,
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
                    compliance_row = KubernetesCISModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        Context="",
                        Namespace="",
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
                        Requirements_Attributes_References=attribute.References,
                        Requirements_Attributes_DefaultValue=attribute.DefaultValue,
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

---[FILE: cis_m365.py]---
Location: prowler-master/prowler/lib/outputs/compliance/cis/cis_m365.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.cis.models import M365CISModel
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class M365CIS(ComplianceOutput):
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
                        compliance_row = M365CISModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            TenantId=finding.account_uid,
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
                    compliance_row = M365CISModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        TenantId=finding.account_uid,
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

---[FILE: cis_oraclecloud.py]---
Location: prowler-master/prowler/lib/outputs/compliance/cis/cis_oraclecloud.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.cis.models import OracleCloudCISModel
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.finding import Finding


class OracleCloudCIS(ComplianceOutput):
    """
    This class represents the Oracle Cloud CIS compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Oracle Cloud CIS compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Oracle Cloud CIS compliance format.

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
                        compliance_row = OracleCloudCISModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            TenancyId=finding.account_uid,
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
                    compliance_row = OracleCloudCISModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        TenancyId="",
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

---[FILE: models.py]---
Location: prowler-master/prowler/lib/outputs/compliance/cis/models.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel


class AWSCISModel(BaseModel):
    """
    AWSCISModel generates a finding's output in AWS CIS Compliance format.
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_Profile: str
    Requirements_Attributes_AssessmentStatus: str
    Requirements_Attributes_Description: str
    Requirements_Attributes_RationaleStatement: str
    Requirements_Attributes_ImpactStatement: str
    Requirements_Attributes_RemediationProcedure: str
    Requirements_Attributes_AuditProcedure: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_DefaultValue: Optional[str] = (
        None  # TODO Optional for now since it's not present in the CIS 1.5, 2.0 and 3.0 AWS benchmark
    )
    Requirements_Attributes_References: str
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class AzureCISModel(BaseModel):
    """
    AzureCISModel generates a finding's output in Azure CIS Compliance format.
    """

    Provider: str
    Description: str
    SubscriptionId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_Profile: str
    Requirements_Attributes_AssessmentStatus: str
    Requirements_Attributes_Description: str
    Requirements_Attributes_RationaleStatement: str
    Requirements_Attributes_ImpactStatement: str
    Requirements_Attributes_RemediationProcedure: str
    Requirements_Attributes_AuditProcedure: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_DefaultValue: str
    Requirements_Attributes_References: str
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class M365CISModel(BaseModel):
    """
    M365CISModel generates a finding's output in Microsoft 365 CIS Compliance format.
    """

    Provider: str
    Description: str
    TenantId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_Profile: str
    Requirements_Attributes_AssessmentStatus: str
    Requirements_Attributes_Description: str
    Requirements_Attributes_RationaleStatement: str
    Requirements_Attributes_ImpactStatement: str
    Requirements_Attributes_RemediationProcedure: str
    Requirements_Attributes_AuditProcedure: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_DefaultValue: str
    Requirements_Attributes_References: str
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class GCPCISModel(BaseModel):
    """
    GCPCISModel generates a finding's output in GCP CIS Compliance format.
    """

    Provider: str
    Description: str
    ProjectId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_Profile: str
    Requirements_Attributes_AssessmentStatus: str
    Requirements_Attributes_Description: str
    Requirements_Attributes_RationaleStatement: str
    Requirements_Attributes_ImpactStatement: str
    Requirements_Attributes_RemediationProcedure: str
    Requirements_Attributes_AuditProcedure: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_References: str
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class KubernetesCISModel(BaseModel):
    """
    KubernetesCISModel generates a finding's output in Kubernetes CIS Compliance format.
    """

    Provider: str
    Description: str
    Context: str
    Namespace: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_Profile: Optional[str] = None
    Requirements_Attributes_AssessmentStatus: str
    Requirements_Attributes_Description: str
    Requirements_Attributes_RationaleStatement: str
    Requirements_Attributes_ImpactStatement: str
    Requirements_Attributes_RemediationProcedure: str
    Requirements_Attributes_AuditProcedure: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_References: str
    Requirements_Attributes_DefaultValue: str
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class GithubCISModel(BaseModel):
    """
    GithubCISModel generates a finding's output in Github CIS Compliance format.
    """

    Provider: str
    Description: str
    Account_Name: str
    Account_Id: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_Profile: str
    Requirements_Attributes_AssessmentStatus: str
    Requirements_Attributes_Description: str
    Requirements_Attributes_RationaleStatement: str
    Requirements_Attributes_ImpactStatement: str
    Requirements_Attributes_RemediationProcedure: str
    Requirements_Attributes_AuditProcedure: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_References: str
    Requirements_Attributes_DefaultValue: str
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class OracleCloudCISModel(BaseModel):
    """
    OracleCloudCISModel generates a finding's output in Oracle Cloud CIS Compliance format.
    """

    Provider: str
    Description: str
    TenancyId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_Profile: str
    Requirements_Attributes_AssessmentStatus: str
    Requirements_Attributes_Description: str
    Requirements_Attributes_RationaleStatement: str
    Requirements_Attributes_ImpactStatement: str
    Requirements_Attributes_RemediationProcedure: str
    Requirements_Attributes_AuditProcedure: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_DefaultValue: Optional[str] = None
    Requirements_Attributes_References: str
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


class AlibabaCloudCISModel(BaseModel):
    """
    AlibabaCloudCISModel generates a finding's output in Alibaba Cloud CIS Compliance format.
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: str
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_Profile: str
    Requirements_Attributes_AssessmentStatus: str
    Requirements_Attributes_Description: str
    Requirements_Attributes_RationaleStatement: str
    Requirements_Attributes_ImpactStatement: str
    Requirements_Attributes_RemediationProcedure: str
    Requirements_Attributes_AuditProcedure: str
    Requirements_Attributes_AdditionalInformation: str
    Requirements_Attributes_DefaultValue: Optional[str] = None
    Requirements_Attributes_References: str
    Status: str
    StatusExtended: str
    ResourceId: str
    ResourceName: str
    CheckId: str
    Muted: bool
    Framework: str
    Name: str


# Compliance models alias for backwards compatibility
CIS_AWS = AWSCISModel
CIS_Azure = AzureCISModel
CIS_GCP = GCPCISModel
CIS_Kubernetes = KubernetesCISModel
CIS_M365 = M365CISModel
CIS_Github = GithubCISModel
CIS_OracleCloud = OracleCloudCISModel
CIS_AlibabaCloud = AlibabaCloudCISModel


# TODO: Create a parent class for the common fields of CIS and have the specific classes from each provider to inherit from it.
# It is not done yet because it is needed to respect the current order of the fields in the output file.

# class AWS(CIS):
#     """
#     AWS CIS Compliance format.
#     """

#     AccountId: str
#     Region: str


# class Azure(CIS):
#     """
#     Azure CIS Compliance format.
#     """

#     Subscription: str
#     Location: str


# class GCP(CIS):
#     """
#     GCP CIS Compliance format.
#     """

#     ProjectId: str
#     Location: str


# class Kubernetes(CIS):
#     """
#     Kubernetes CIS Compliance format.
#     """

#     Context: str
#     Namespace: str
```

--------------------------------------------------------------------------------

````
