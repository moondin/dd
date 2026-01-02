---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 207
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 207 of 867)

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

---[FILE: ens.py]---
Location: prowler-master/prowler/lib/outputs/compliance/ens/ens.py

```python
from colorama import Fore, Style
from tabulate import tabulate

from prowler.config.config import orange_color


def get_ens_table(
    findings: list,
    bulk_checks_metadata: dict,
    compliance_framework: str,
    output_filename: str,
    output_directory: str,
    compliance_overview: bool,
):
    marcos = {}
    ens_compliance_table = {
        "Proveedor": [],
        "Marco/Categoria": [],
        "Estado": [],
        "Alto": [],
        "Medio": [],
        "Bajo": [],
        "Opcional": [],
        "Muted": [],
    }
    pass_count = []
    fail_count = []
    muted_count = []
    for index, finding in enumerate(findings):
        check = bulk_checks_metadata[finding.check_metadata.CheckID]
        check_compliances = check.Compliance
        for compliance in check_compliances:
            if compliance.Framework == "ENS":
                for requirement in compliance.Requirements:
                    for attribute in requirement.Attributes:
                        marco_categoria = f"{attribute.Marco}/{attribute.Categoria}"
                        # Check if Marco/Categoria exists
                        if marco_categoria not in marcos:
                            marcos[marco_categoria] = {
                                "Estado": f"{Fore.GREEN}CUMPLE{Style.RESET_ALL}",
                                "Opcional": 0,
                                "Alto": 0,
                                "Medio": 0,
                                "Bajo": 0,
                                "Muted": 0,
                            }
                        if finding.muted:
                            if index not in muted_count:
                                muted_count.append(index)
                                marcos[marco_categoria]["Muted"] += 1
                        else:
                            if finding.status == "FAIL":
                                if (
                                    attribute.Tipo != "recomendacion"
                                    and index not in fail_count
                                ):
                                    fail_count.append(index)
                                    marcos[marco_categoria][
                                        "Estado"
                                    ] = f"{Fore.RED}NO CUMPLE{Style.RESET_ALL}"
                            elif finding.status == "PASS" and index not in pass_count:
                                pass_count.append(index)
                        if attribute.Nivel == "opcional":
                            marcos[marco_categoria]["Opcional"] += 1
                        elif attribute.Nivel == "alto":
                            marcos[marco_categoria]["Alto"] += 1
                        elif attribute.Nivel == "medio":
                            marcos[marco_categoria]["Medio"] += 1
                        elif attribute.Nivel == "bajo":
                            marcos[marco_categoria]["Bajo"] += 1

    # Add results to table
    for marco in sorted(marcos):
        ens_compliance_table["Proveedor"].append(compliance.Provider)
        ens_compliance_table["Marco/Categoria"].append(marco)
        ens_compliance_table["Estado"].append(marcos[marco]["Estado"])
        ens_compliance_table["Opcional"].append(
            f"{Fore.BLUE}{marcos[marco]['Opcional']}{Style.RESET_ALL}"
        )
        ens_compliance_table["Alto"].append(
            f"{Fore.LIGHTRED_EX}{marcos[marco]['Alto']}{Style.RESET_ALL}"
        )
        ens_compliance_table["Medio"].append(
            f"{orange_color}{marcos[marco]['Medio']}{Style.RESET_ALL}"
        )
        ens_compliance_table["Bajo"].append(
            f"{Fore.YELLOW}{marcos[marco]['Bajo']}{Style.RESET_ALL}"
        )
        ens_compliance_table["Muted"].append(
            f"{orange_color}{marcos[marco]['Muted']}{Style.RESET_ALL}"
        )
    if (
        len(fail_count) + len(pass_count) + len(muted_count) > 1
    ):  # If there are no resources, don't print the compliance table
        print(
            f"\nEstado de Cumplimiento de {Fore.YELLOW}{compliance_framework.upper()}{Style.RESET_ALL}:"
        )
        total_findings_count = len(fail_count) + len(pass_count) + len(muted_count)
        overview_table = [
            [
                f"{Fore.RED}{round(len(fail_count) / total_findings_count * 100, 2)}% ({len(fail_count)}) NO CUMPLE{Style.RESET_ALL}",
                f"{Fore.GREEN}{round(len(pass_count) / total_findings_count * 100, 2)}% ({len(pass_count)}) CUMPLE{Style.RESET_ALL}",
                f"{orange_color}{round(len(muted_count) / total_findings_count * 100, 2)}% ({len(muted_count)}) MUTED{Style.RESET_ALL}",
            ]
        ]
        print(tabulate(overview_table, tablefmt="rounded_grid"))
        if not compliance_overview:
            print(
                f"\nResultados de {Fore.YELLOW}{compliance_framework.upper()}{Style.RESET_ALL}:"
            )
            print(
                tabulate(
                    ens_compliance_table,
                    headers="keys",
                    tablefmt="rounded_grid",
                )
            )
            print(
                f"{Style.BRIGHT}* Solo aparece el Marco/Categoria que contiene resultados.{Style.RESET_ALL}"
            )
            print(f"\nResultados detallados de {compliance_framework.upper()} en:")
            print(
                f" - CSV: {output_directory}/compliance/{output_filename}_{compliance_framework}.csv\n"
            )
```

--------------------------------------------------------------------------------

---[FILE: ens_aws.py]---
Location: prowler-master/prowler/lib/outputs/compliance/ens/ens_aws.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.ens.models import AWSENSModel
from prowler.lib.outputs.finding import Finding


class AWSENS(ComplianceOutput):
    """
    This class represents the AWS ENS compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into AWS ENS compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into AWS ENS compliance format.

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
                        compliance_row = AWSENSModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            AccountId=finding.account_uid,
                            Region=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_IdGrupoControl=attribute.IdGrupoControl,
                            Requirements_Attributes_Marco=attribute.Marco,
                            Requirements_Attributes_Categoria=attribute.Categoria,
                            Requirements_Attributes_DescripcionControl=attribute.DescripcionControl,
                            Requirements_Attributes_Nivel=attribute.Nivel,
                            Requirements_Attributes_Tipo=attribute.Tipo,
                            Requirements_Attributes_Dimensiones=",".join(
                                attribute.Dimensiones
                            ),
                            Requirements_Attributes_ModoEjecucion=attribute.ModoEjecucion,
                            Requirements_Attributes_Dependencias=",".join(
                                attribute.Dependencias
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
                    compliance_row = AWSENSModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_IdGrupoControl=attribute.IdGrupoControl,
                        Requirements_Attributes_Marco=attribute.Marco,
                        Requirements_Attributes_Categoria=attribute.Categoria,
                        Requirements_Attributes_DescripcionControl=attribute.DescripcionControl,
                        Requirements_Attributes_Nivel=attribute.Nivel,
                        Requirements_Attributes_Tipo=attribute.Tipo,
                        Requirements_Attributes_Dimensiones=",".join(
                            attribute.Dimensiones
                        ),
                        Requirements_Attributes_ModoEjecucion=attribute.ModoEjecucion,
                        Requirements_Attributes_Dependencias=",".join(
                            attribute.Dependencias
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

---[FILE: ens_azure.py]---
Location: prowler-master/prowler/lib/outputs/compliance/ens/ens_azure.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.ens.models import AzureENSModel
from prowler.lib.outputs.finding import Finding


class AzureENS(ComplianceOutput):
    """
    This class represents the Azure ENS compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Azure ENS compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into AWS ENS compliance format.

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
                        compliance_row = AzureENSModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            SubscriptionId=finding.account_name,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_IdGrupoControl=attribute.IdGrupoControl,
                            Requirements_Attributes_Marco=attribute.Marco,
                            Requirements_Attributes_Categoria=attribute.Categoria,
                            Requirements_Attributes_DescripcionControl=attribute.DescripcionControl,
                            Requirements_Attributes_Nivel=attribute.Nivel,
                            Requirements_Attributes_Tipo=attribute.Tipo,
                            Requirements_Attributes_Dimensiones=",".join(
                                attribute.Dimensiones
                            ),
                            Requirements_Attributes_ModoEjecucion=attribute.ModoEjecucion,
                            Requirements_Attributes_Dependencias=",".join(
                                attribute.Dependencias
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
                    compliance_row = AzureENSModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        SubscriptionId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_IdGrupoControl=attribute.IdGrupoControl,
                        Requirements_Attributes_Marco=attribute.Marco,
                        Requirements_Attributes_Categoria=attribute.Categoria,
                        Requirements_Attributes_DescripcionControl=attribute.DescripcionControl,
                        Requirements_Attributes_Nivel=attribute.Nivel,
                        Requirements_Attributes_Tipo=attribute.Tipo,
                        Requirements_Attributes_Dimensiones=",".join(
                            attribute.Dimensiones
                        ),
                        Requirements_Attributes_ModoEjecucion=attribute.ModoEjecucion,
                        Requirements_Attributes_Dependencias=",".join(
                            attribute.Dependencias
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

---[FILE: ens_gcp.py]---
Location: prowler-master/prowler/lib/outputs/compliance/ens/ens_gcp.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.ens.models import GCPENSModel
from prowler.lib.outputs.finding import Finding


class GCPENS(ComplianceOutput):
    """
    This class represents the GCP ENS compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into GCP ENS compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into AWS ENS compliance format.

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
                        compliance_row = GCPENSModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            ProjectId=finding.account_uid,
                            Location=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_IdGrupoControl=attribute.IdGrupoControl,
                            Requirements_Attributes_Marco=attribute.Marco,
                            Requirements_Attributes_Categoria=attribute.Categoria,
                            Requirements_Attributes_DescripcionControl=attribute.DescripcionControl,
                            Requirements_Attributes_Nivel=attribute.Nivel,
                            Requirements_Attributes_Tipo=attribute.Tipo,
                            Requirements_Attributes_Dimensiones=",".join(
                                attribute.Dimensiones
                            ),
                            Requirements_Attributes_ModoEjecucion=attribute.ModoEjecucion,
                            Requirements_Attributes_Dependencias=",".join(
                                attribute.Dependencias
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
                    compliance_row = GCPENSModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        ProjectId="",
                        Location="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_IdGrupoControl=attribute.IdGrupoControl,
                        Requirements_Attributes_Marco=attribute.Marco,
                        Requirements_Attributes_Categoria=attribute.Categoria,
                        Requirements_Attributes_DescripcionControl=attribute.DescripcionControl,
                        Requirements_Attributes_Nivel=attribute.Nivel,
                        Requirements_Attributes_Tipo=attribute.Tipo,
                        Requirements_Attributes_Dimensiones=",".join(
                            attribute.Dimensiones
                        ),
                        Requirements_Attributes_ModoEjecucion=attribute.ModoEjecucion,
                        Requirements_Attributes_Dependencias=",".join(
                            attribute.Dependencias
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
Location: prowler-master/prowler/lib/outputs/compliance/ens/models.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel


class AWSENSModel(BaseModel):
    """
    AWSENSModel generates a finding's output in CSV ENS format for AWS.
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_IdGrupoControl: str
    Requirements_Attributes_Marco: str
    Requirements_Attributes_Categoria: str
    Requirements_Attributes_DescripcionControl: str
    Requirements_Attributes_Nivel: str
    Requirements_Attributes_Tipo: str
    Requirements_Attributes_Dimensiones: str
    Requirements_Attributes_ModoEjecucion: str
    Requirements_Attributes_Dependencias: str
    Status: str
    StatusExtended: str
    ResourceId: str
    CheckId: str
    Muted: bool
    ResourceName: str
    Framework: str
    Name: str


class AzureENSModel(BaseModel):
    """
    AzureENSModel generates a finding's output in CSV ENS format for Azure.
    """

    Provider: str
    Description: str
    SubscriptionId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_IdGrupoControl: str
    Requirements_Attributes_Marco: str
    Requirements_Attributes_Categoria: str
    Requirements_Attributes_DescripcionControl: str
    Requirements_Attributes_Nivel: str
    Requirements_Attributes_Tipo: str
    Requirements_Attributes_Dimensiones: str
    Requirements_Attributes_ModoEjecucion: str
    Requirements_Attributes_Dependencias: str
    Status: str
    StatusExtended: str
    ResourceId: str
    CheckId: str
    Muted: bool
    ResourceName: str
    Framework: str
    Name: str


class GCPENSModel(BaseModel):
    """
    GCPENSModel generates a finding's output in CSV ENS format for GCP.
    """

    Provider: str
    Description: str
    ProjectId: str
    Location: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_IdGrupoControl: str
    Requirements_Attributes_Marco: str
    Requirements_Attributes_Categoria: str
    Requirements_Attributes_DescripcionControl: str
    Requirements_Attributes_Nivel: str
    Requirements_Attributes_Tipo: str
    Requirements_Attributes_Dimensiones: str
    Requirements_Attributes_ModoEjecucion: str
    Requirements_Attributes_Dependencias: str
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

---[FILE: generic.py]---
Location: prowler-master/prowler/lib/outputs/compliance/generic/generic.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.generic.models import GenericComplianceModel
from prowler.lib.outputs.finding import Finding


class GenericCompliance(ComplianceOutput):
    """
    This class represents the Generic compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into Generic compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into Generic compliance format.

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
                        compliance_row = GenericComplianceModel(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            AccountId=finding.account_uid,
                            Region=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Description=requirement.Description,
                            Requirements_Attributes_Section=attribute.Section,
                            Requirements_Attributes_SubSection=attribute.SubSection,
                            Requirements_Attributes_SubGroup=attribute.SubGroup,
                            Requirements_Attributes_Service=attribute.Service,
                            Requirements_Attributes_Type=attribute.Type,
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
                    compliance_row = GenericComplianceModel(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Description=requirement.Description,
                        Requirements_Attributes_Section=attribute.Section,
                        Requirements_Attributes_SubSection=attribute.SubSection,
                        Requirements_Attributes_SubGroup=attribute.SubGroup,
                        Requirements_Attributes_Service=attribute.Service,
                        Requirements_Attributes_Type=attribute.Type,
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

---[FILE: generic_table.py]---
Location: prowler-master/prowler/lib/outputs/compliance/generic/generic_table.py

```python
from colorama import Fore, Style
from tabulate import tabulate

from prowler.config.config import orange_color


def get_generic_compliance_table(
    findings: list,
    bulk_checks_metadata: dict,
    compliance_framework: str,
    output_filename: str,
    output_directory: str,
    compliance_overview: bool,
):
    pass_count = []
    fail_count = []
    muted_count = []
    for index, finding in enumerate(findings):
        check = bulk_checks_metadata[finding.check_metadata.CheckID]
        check_compliances = check.Compliance
        for compliance in check_compliances:
            if (
                compliance.Framework.upper()
                in compliance_framework.upper().replace("_", "-")
                and compliance.Version in compliance_framework.upper()
                and compliance.Provider.upper() in compliance_framework.upper()
            ):
                if finding.muted:
                    if index not in muted_count:
                        muted_count.append(index)
                else:
                    if finding.status == "FAIL" and index not in fail_count:
                        fail_count.append(index)
                    elif finding.status == "PASS" and index not in pass_count:
                        pass_count.append(index)
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
            print(f"\nDetailed results of {compliance_framework.upper()} are in:")
            print(
                f" - CSV: {output_directory}/compliance/{output_filename}_{compliance_framework}.csv\n"
            )
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/lib/outputs/compliance/generic/models.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel


class GenericComplianceModel(BaseModel):
    """
    GenericComplianceModel generates a finding's output in Generic Compliance format.
    """

    Provider: str
    Description: str
    AccountId: str
    Region: str
    AssessmentDate: str
    Requirements_Id: str
    Requirements_Description: str
    Requirements_Attributes_Section: Optional[str] = None
    Requirements_Attributes_SubSection: Optional[str] = None
    Requirements_Attributes_SubGroup: Optional[str] = None
    Requirements_Attributes_Service: Optional[str] = None
    Requirements_Attributes_Type: Optional[str] = None
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

---[FILE: iso27001_aws.py]---
Location: prowler-master/prowler/lib/outputs/compliance/iso27001/iso27001_aws.py

```python
from prowler.config.config import timestamp
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.outputs.compliance.compliance_output import ComplianceOutput
from prowler.lib.outputs.compliance.iso27001.models import AWSISO27001Model
from prowler.lib.outputs.finding import Finding


class AWSISO27001(ComplianceOutput):
    """
    This class represents the AWS ISO 27001 compliance output.

    Attributes:
        - _data (list): A list to store transformed data from findings.
        - _file_descriptor (TextIOWrapper): A file descriptor to write data to a file.

    Methods:
        - transform: Transforms findings into AWS ISO 27001 compliance format.
    """

    def transform(
        self,
        findings: list[Finding],
        compliance: Compliance,
        compliance_name: str,
    ) -> None:
        """
        Transforms a list of findings into AWS ISO 27001 compliance format.

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
                        compliance_row = AWSISO27001Model(
                            Provider=finding.provider,
                            Description=compliance.Description,
                            AccountId=finding.account_uid,
                            Region=finding.region,
                            AssessmentDate=str(timestamp),
                            Requirements_Id=requirement.Id,
                            Requirements_Name=requirement.Name,
                            Requirements_Description=requirement.Description,
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
                    compliance_row = AWSISO27001Model(
                        Provider=compliance.Provider.lower(),
                        Description=compliance.Description,
                        AccountId="",
                        Region="",
                        AssessmentDate=str(timestamp),
                        Requirements_Id=requirement.Id,
                        Requirements_Name=requirement.Name,
                        Requirements_Description=requirement.Description,
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

````
