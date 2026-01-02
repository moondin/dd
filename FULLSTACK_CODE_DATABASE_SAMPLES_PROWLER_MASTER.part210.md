---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 210
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 210 of 867)

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

---[FILE: prowler_threatscore_aws.py]---
Location: prowler-master/prowler/lib/outputs/compliance/prowler_threatscore/prowler_threatscore_aws.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.prowler_threatscore.models import (
    ProwlerThreatScoreAWSModel,
)
from prowler.lib.outputs.finding import Finding


class ProwlerThreatScoreAWS(ComplianceOutput):
    """
    This class represents the AWS Prowler ThreatScore compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into AWS Prowler ThreatScore compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into AWS Prowler ThreatScore compliance format.

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
                        compliance_row = ProwlerThreatScoreAWSModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            AccountId=finding.account_uid,
                            Region=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Title=attribute.Title,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_AttributeDescription=attribute.AttributeDescription,
                            Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                            Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                            Requirements_Attributes_Weight=attribute.Weight,
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
                    compliance_row = ProwlerThreatScoreAWSModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Title=attribute.Title,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_AttributeDescription=attribute.AttributeDescription,
                        Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                        Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                        Requirements_Attributes_Weight=attribute.Weight,
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

---[FILE: prowler_threatscore_azure.py]---
Location: prowler-master/prowler/lib/outputs/compliance/prowler_threatscore/prowler_threatscore_azure.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.prowler_threatscore.models import (
    ProwlerThreatScoreAzureModel,
)
from prowler.lib.outputs.finding import Finding


class ProwlerThreatScoreAzure(ComplianceOutput):
    """
    This class represents the Azure Prowler ThreatScore compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Azure Prowler ThreatScore compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Azure Prowler ThreatScore compliance format.

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
                        compliance_row = ProwlerThreatScoreAzureModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            SubscriptionId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Title=attribute.Title,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_AttributeDescription=attribute.AttributeDescription,
                            Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                            Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                            Requirements_Attributes_Weight=attribute.Weight,
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
                    compliance_row = ProwlerThreatScoreAzureModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        SubscriptionId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Title=attribute.Title,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_AttributeDescription=attribute.AttributeDescription,
                        Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                        Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                        Requirements_Attributes_Weight=attribute.Weight,
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

---[FILE: prowler_threatscore_gcp.py]---
Location: prowler-master/prowler/lib/outputs/compliance/prowler_threatscore/prowler_threatscore_gcp.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.prowler_threatscore.models import (
    ProwlerThreatScoreGCPModel,
)
from prowler.lib.outputs.finding import Finding


class ProwlerThreatScoreGCP(ComplianceOutput):
    """
    This class represents the GCP Prowler ThreatScore compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into GCP Prowler ThreatScore compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into GCP Prowler ThreatScore compliance format.

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
                        compliance_row = ProwlerThreatScoreGCPModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            ProjectId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Title=attribute.Title,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_AttributeDescription=attribute.AttributeDescription,
                            Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                            Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                            Requirements_Attributes_Weight=attribute.Weight,
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
                    compliance_row = ProwlerThreatScoreGCPModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        ProjectId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Title=attribute.Title,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_AttributeDescription=attribute.AttributeDescription,
                        Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                        Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                        Requirements_Attributes_Weight=attribute.Weight,
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

---[FILE: prowler_threatscore_kubernetes.py]---
Location: prowler-master/prowler/lib/outputs/compliance/prowler_threatscore/prowler_threatscore_kubernetes.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.prowler_threatscore.models import (
    ProwlerThreatScoreKubernetesModel,
)
from prowler.lib.outputs.finding import Finding


class ProwlerThreatScoreKubernetes(ComplianceOutput):
    """
    This class represents the Kubernetes Prowler ThreatScore compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Kubernetes Prowler ThreatScore compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Kubernetes Prowler ThreatScore compliance format.

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
                        compliance_row = ProwlerThreatScoreKubernetesModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            Context=finding.account_name,
                            Namespace=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Title=attribute.Title,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_AttributeDescription=attribute.AttributeDescription,
                            Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                            Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                            Requirements_Attributes_Weight=attribute.Weight,
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
                    compliance_row = ProwlerThreatScoreKubernetesModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        Context="",
                        Namespace="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Title=attribute.Title,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_AttributeDescription=attribute.AttributeDescription,
                        Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                        Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                        Requirements_Attributes_Weight=attribute.Weight,
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

---[FILE: prowler_threatscore_m365.py]---
Location: prowler-master/prowler/lib/outputs/compliance/prowler_threatscore/prowler_threatscore_m365.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.prowler_threatscore.models import (
    ProwlerThreatScoreM365Model,
)
from prowler.lib.outputs.finding import Finding


class ProwlerThreatScoreM365(ComplianceOutput):
    """
    This class represents the M365 Prowler ThreatScore compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into M365 Prowler ThreatScore compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into M365 Prowler ThreatScore compliance format.

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
                        compliance_row = ProwlerThreatScoreM365Model(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            TenantId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Title=attribute.Title,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_AttributeDescription=attribute.AttributeDescription,
                            Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                            Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                            Requirements_Attributes_Weight=attribute.Weight,
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
                    compliance_row = ProwlerThreatScoreM365Model(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        TenantId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Title=attribute.Title,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_AttributeDescription=attribute.AttributeDescription,
                        Requirements_Attributes_AdditionalInformation=attribute.AdditionalInformation,
                        Requirements_Attributes_LevelOfRisk=attribute.LevelOfRisk,
                        Requirements_Attributes_Weight=attribute.Weight,
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

---[FILE: csv.py]---
Location: prowler-master/prowler/lib/outputs/csv/csv.py

```python
from csv import DictWriter
from typing import List

from prowler.lib.logger import logger
from prowler.lib.outputs.finding import Finding
from prowler.lib.outputs.output import Output
from prowler.lib.outputs.utils import unroll_dict, unroll_list


class CSV(Output):
    def transform(self, findings: List[Finding]) -> None:
        """Transforms the findings into the CSV format.

        Args:
            findings (list[Finding]): a list of Finding objects

        """
        try:
            for finding in findings:
                finding_dict = {}
                finding_dict["AUTH_METHOD"] = finding.auth_method
                finding_dict["TIMESTAMP"] = finding.timestamp
                finding_dict["ACCOUNT_UID"] = finding.account_uid
                finding_dict["ACCOUNT_NAME"] = finding.account_name
                finding_dict["ACCOUNT_EMAIL"] = finding.account_email
                finding_dict["ACCOUNT_ORGANIZATION_UID"] = (
                    finding.account_organization_uid
                )
                finding_dict["ACCOUNT_ORGANIZATION_NAME"] = (
                    finding.account_organization_name
                )
                finding_dict["ACCOUNT_TAGS"] = unroll_dict(
                    finding.account_tags, separator=":"
                )
                finding_dict["FINDING_UID"] = finding.uid
                finding_dict["PROVIDER"] = finding.metadata.Provider
                finding_dict["CHECK_ID"] = finding.metadata.CheckID
                finding_dict["CHECK_TITLE"] = finding.metadata.CheckTitle
                finding_dict["CHECK_TYPE"] = unroll_list(finding.metadata.CheckType)
                finding_dict["STATUS"] = finding.status.value
                finding_dict["STATUS_EXTENDED"] = finding.status_extended
                finding_dict["MUTED"] = finding.muted
                finding_dict["SERVICE_NAME"] = finding.metadata.ServiceName
                finding_dict["SUBSERVICE_NAME"] = finding.metadata.SubServiceName
                finding_dict["SEVERITY"] = finding.metadata.Severity.value
                finding_dict["RESOURCE_TYPE"] = finding.metadata.ResourceType
                finding_dict["RESOURCE_UID"] = finding.resource_uid
                finding_dict["RESOURCE_NAME"] = finding.resource_name
                finding_dict["RESOURCE_DETAILS"] = finding.resource_details
                finding_dict["RESOURCE_TAGS"] = unroll_dict(finding.resource_tags)
                finding_dict["PARTITION"] = finding.partition
                finding_dict["REGION"] = finding.region
                finding_dict["DESCRIPTION"] = finding.metadata.Description
                finding_dict["RISK"] = finding.metadata.Risk
                finding_dict["RELATED_URL"] = finding.metadata.RelatedUrl
                finding_dict["REMEDIATION_RECOMMENDATION_TEXT"] = (
                    finding.metadata.Remediation.Recommendation.Text
                )
                finding_dict["REMEDIATION_RECOMMENDATION_URL"] = (
                    finding.metadata.Remediation.Recommendation.Url
                )
                finding_dict["REMEDIATION_CODE_NATIVEIAC"] = (
                    finding.metadata.Remediation.Code.NativeIaC
                )
                finding_dict["REMEDIATION_CODE_TERRAFORM"] = (
                    finding.metadata.Remediation.Code.Terraform
                )
                finding_dict["REMEDIATION_CODE_CLI"] = (
                    finding.metadata.Remediation.Code.CLI
                )
                finding_dict["REMEDIATION_CODE_OTHER"] = (
                    finding.metadata.Remediation.Code.Other
                )
                finding_dict["COMPLIANCE"] = unroll_dict(
                    finding.compliance, separator=": "
                )
                finding_dict["CATEGORIES"] = unroll_list(finding.metadata.Categories)
                finding_dict["DEPENDS_ON"] = unroll_list(finding.metadata.DependsOn)
                finding_dict["RELATED_TO"] = unroll_list(finding.metadata.RelatedTo)
                finding_dict["NOTES"] = finding.metadata.Notes
                finding_dict["PROWLER_VERSION"] = finding.prowler_version
                finding_dict["ADDITIONAL_URLS"] = unroll_list(
                    finding.metadata.AdditionalURLs
                )
                self._data.append(finding_dict)
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def batch_write_data_to_file(self) -> None:
        """Writes the findings to a file using the CSV format using the `Output._file_descriptor`."""
        try:
            if (
                getattr(self, "_file_descriptor", None)
                and not self._file_descriptor.closed
                and self._data
            ):
                csv_writer = DictWriter(
                    self._file_descriptor,
                    fieldnames=self._data[0].keys(),
                    delimiter=";",
                )
                if self._file_descriptor.tell() == 0:
                    csv_writer.writeheader()
                for finding in self._data:
                    csv_writer.writerow(finding)
                if self.close_file or self._from_cli:
                    self._file_descriptor.close()
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
```

--------------------------------------------------------------------------------

````
