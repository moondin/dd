---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 199
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 199 of 867)

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

---[FILE: compliance.py]---
Location: prowler-master/prowler/lib/check/compliance.py

```python
import sys

from prowler.lib.check.compliance_models import Compliance
from prowler.lib.logger import logger


def update_checks_metadata_with_compliance(
    bulk_compliance_frameworks: dict, bulk_checks_metadata: dict
) -> dict:
    """
    Update the check metadata model with the compliance framework
    Args:
        bulk_compliance_frameworks (dict): The compliance frameworks
        bulk_checks_metadata (dict): The checks metadata

    Returns:
        dict: The checks metadata with the compliance frameworks
    """
    try:
        for check in bulk_checks_metadata:
            check_compliance = []
            for framework in bulk_compliance_frameworks.values():
                for requirement in framework.Requirements:
                    compliance_requirements = []
                    # Verify if check is in the requirement
                    if check in requirement.Checks:
                        # Include the requirement into the check's framework requirements
                        compliance_requirements.append(requirement)
                        # Create the Compliance
                        compliance = Compliance(
                            Framework=framework.Framework,
                            Name=framework.Name,
                            Provider=framework.Provider,
                            Version=framework.Version,
                            Description=framework.Description,
                            Requirements=compliance_requirements,
                        )
                        # Include the compliance framework for the check
                        check_compliance.append(compliance)
            # Save it into the check's metadata
            bulk_checks_metadata[check].Compliance = check_compliance
        return bulk_checks_metadata
    except Exception as e:
        logger.critical(f"{e.__class__.__name__}[{e.__traceback__.tb_lineno}] -- {e}")
        sys.exit(1)
```

--------------------------------------------------------------------------------

---[FILE: compliance_models.py]---
Location: prowler-master/prowler/lib/check/compliance_models.py
Signals: Pydantic

```python
import os
import sys
from enum import Enum
from typing import Optional, Union

from pydantic.v1 import BaseModel, ValidationError, root_validator

from prowler.lib.check.utils import list_compliance_modules
from prowler.lib.logger import logger


# ENS - Esquema Nacional de Seguridad - España
class ENS_Requirement_Attribute_Nivel(str, Enum):
    """ENS V3 Requirement Attribute Level"""

    opcional = "opcional"
    bajo = "bajo"
    medio = "medio"
    alto = "alto"


class ENS_Requirement_Attribute_Dimensiones(str, Enum):
    """ENS V3 Requirement Attribute Dimensions"""

    confidencialidad = "confidencialidad"
    integridad = "integridad"
    trazabilidad = "trazabilidad"
    autenticidad = "autenticidad"
    disponibilidad = "disponibilidad"


class ENS_Requirement_Attribute_Tipos(str, Enum):
    """ENS Requirement Attribute  Tipos"""

    refuerzo = "refuerzo"
    requisito = "requisito"
    recomendacion = "recomendacion"
    medida = "medida"


class ENS_Requirement_Attribute(BaseModel):
    """ENS V3 Framework Requirement Attribute"""

    IdGrupoControl: str
    Marco: str
    Categoria: str
    DescripcionControl: str
    Tipo: ENS_Requirement_Attribute_Tipos
    Nivel: ENS_Requirement_Attribute_Nivel
    Dimensiones: list[ENS_Requirement_Attribute_Dimensiones]
    ModoEjecucion: str
    Dependencias: list[str]


# Generic Compliance Requirement Attribute
class Generic_Compliance_Requirement_Attribute(BaseModel):
    """Generic Compliance Requirement Attribute"""

    ItemId: Optional[str] = None
    Section: Optional[str] = None
    SubSection: Optional[str] = None
    SubGroup: Optional[str] = None
    Service: Optional[str] = None
    Type: Optional[str] = None


class CIS_Requirement_Attribute_Profile(str, Enum):
    """CIS Requirement Attribute Profile"""

    Level_1 = "Level 1"
    Level_2 = "Level 2"
    E3_Level_1 = "E3 Level 1"
    E3_Level_2 = "E3 Level 2"
    E5_Level_1 = "E5 Level 1"
    E5_Level_2 = "E5 Level 2"


class CIS_Requirement_Attribute_AssessmentStatus(str, Enum):
    """CIS Requirement Attribute Assessment Status"""

    Manual = "Manual"
    Automated = "Automated"


# CIS Requirement Attribute
class CIS_Requirement_Attribute(BaseModel):
    """CIS Requirement Attribute"""

    Section: str
    SubSection: Optional[str] = None
    Profile: CIS_Requirement_Attribute_Profile
    AssessmentStatus: CIS_Requirement_Attribute_AssessmentStatus
    Description: str
    RationaleStatement: str
    ImpactStatement: str
    RemediationProcedure: str
    AuditProcedure: str
    AdditionalInformation: str
    DefaultValue: Optional[str] = None
    References: str


# Well Architected Requirement Attribute
class AWS_Well_Architected_Requirement_Attribute(BaseModel):
    """AWS Well Architected Requirement Attribute"""

    Name: str
    WellArchitectedQuestionId: str
    WellArchitectedPracticeId: str
    Section: str
    SubSection: Optional[str] = None
    LevelOfRisk: str
    AssessmentMethod: str
    Description: str
    ImplementationGuidanceUrl: str


# ISO27001 Requirement Attribute
class ISO27001_2013_Requirement_Attribute(BaseModel):
    """ISO27001 Requirement Attribute"""

    Category: str
    Objetive_ID: str
    Objetive_Name: str
    Check_Summary: str


# MITRE Requirement Attribute for AWS
class Mitre_Requirement_Attribute_AWS(BaseModel):
    """MITRE Requirement Attribute"""

    AWSService: str
    Category: str
    Value: str
    Comment: str


# MITRE Requirement Attribute for Azure
class Mitre_Requirement_Attribute_Azure(BaseModel):
    """MITRE Requirement Attribute"""

    AzureService: str
    Category: str
    Value: str
    Comment: str


# MITRE Requirement Attribute for GCP
class Mitre_Requirement_Attribute_GCP(BaseModel):
    """MITRE Requirement Attribute"""

    GCPService: str
    Category: str
    Value: str
    Comment: str


# MITRE Requirement
class Mitre_Requirement(BaseModel):
    """Mitre_Requirement holds the model for every MITRE requirement"""

    Name: str
    Id: str
    Tactics: list[str]
    SubTechniques: list[str]
    Description: str
    Platforms: list[str]
    TechniqueURL: str
    Attributes: Union[
        list[Mitre_Requirement_Attribute_AWS],
        list[Mitre_Requirement_Attribute_Azure],
        list[Mitre_Requirement_Attribute_GCP],
    ]
    Checks: list[str]


# KISA-ISMS-P Requirement Attribute
class KISA_ISMSP_Requirement_Attribute(BaseModel):
    """KISA ISMS-P Requirement Attribute"""

    Domain: str
    Subdomain: str
    Section: str
    AuditChecklist: Optional[list[str]] = None
    RelatedRegulations: Optional[list[str]] = None
    AuditEvidence: Optional[list[str]] = None
    NonComplianceCases: Optional[list[str]] = None


# Prowler ThreatScore Requirement Attribute
class Prowler_ThreatScore_Requirement_Attribute(BaseModel):
    """Prowler ThreatScore Requirement Attribute"""

    Title: str
    Section: str
    SubSection: str
    AttributeDescription: str
    AdditionalInformation: str
    LevelOfRisk: int
    Weight: int


# CCC Requirement Attribute
class CCC_Requirement_Attribute(BaseModel):
    """CCC Requirement Attribute"""

    FamilyName: str
    FamilyDescription: str
    Section: str
    SubSection: str
    SubSectionObjective: str
    Applicability: list[str]
    Recommendation: str
    SectionThreatMappings: list[dict]
    SectionGuidelineMappings: list[dict]


# C5 Germany Requirement Attribute
class C5Germany_Requirement_Attribute(BaseModel):
    """C5 Germany Requirement Attribute"""

    Section: str
    SubSection: str
    Type: str
    AboutCriteria: str
    ComplementaryCriteria: str


# Base Compliance Model
# TODO: move this to compliance folder
class Compliance_Requirement(BaseModel):
    """Compliance_Requirement holds the base model for every requirement within a compliance framework"""

    Id: str
    Description: str
    Name: Optional[str] = None
    Attributes: list[
        Union[
            CIS_Requirement_Attribute,
            ENS_Requirement_Attribute,
            ISO27001_2013_Requirement_Attribute,
            AWS_Well_Architected_Requirement_Attribute,
            KISA_ISMSP_Requirement_Attribute,
            Prowler_ThreatScore_Requirement_Attribute,
            CCC_Requirement_Attribute,
            C5Germany_Requirement_Attribute,
            # Generic_Compliance_Requirement_Attribute must be the last one since it is the fallback for generic compliance framework
            Generic_Compliance_Requirement_Attribute,
        ]
    ]
    Checks: list[str]


class Compliance(BaseModel):
    """Compliance holds the base model for every compliance framework"""

    Framework: str
    Name: str
    Provider: str
    Version: Optional[str] = None
    Description: str
    Requirements: list[
        Union[
            Mitre_Requirement,
            Compliance_Requirement,
        ]
    ]

    @root_validator(pre=True)
    # noqa: F841 - since vulture raises unused variable 'cls'
    def framework_and_provider_must_not_be_empty(cls, values):  # noqa: F841
        framework, provider, name = (
            values.get("Framework"),
            values.get("Provider"),
            values.get("Name"),
        )
        if framework == "" or provider == "" or name == "":
            raise ValueError("Framework, Provider or Name must not be empty")
        return values

    @staticmethod
    def list(bulk_compliance_frameworks: dict, provider: str = None) -> list[str]:
        """
        Returns a list of compliance frameworks from bulk compliance frameworks

        Args:
            bulk_compliance_frameworks (dict): The bulk compliance frameworks
            provider (str): The provider name

        Returns:
            list: The list of compliance frameworks
        """
        if provider:
            compliance_frameworks = [
                compliance_framework
                for compliance_framework in bulk_compliance_frameworks.keys()
                if provider in compliance_framework
            ]
        else:
            compliance_frameworks = [
                compliance_framework
                for compliance_framework in bulk_compliance_frameworks.keys()
            ]

        return compliance_frameworks

    @staticmethod
    def get(
        bulk_compliance_frameworks: dict, compliance_framework_name: str
    ) -> "Compliance":
        """
        Returns a compliance framework from bulk compliance frameworks

        Args:
            bulk_compliance_frameworks (dict): The bulk compliance frameworks
            compliance_framework_name (str): The compliance framework name

        Returns:
            Compliance: The compliance framework
        """
        return bulk_compliance_frameworks.get(compliance_framework_name, None)

    @staticmethod
    def list_requirements(
        bulk_compliance_frameworks: dict, compliance_framework: str = None
    ) -> list:
        """
        Returns a list of compliance requirements from a compliance framework

        Args:
            bulk_compliance_frameworks (dict): The bulk compliance frameworks
            compliance_framework (str): The compliance framework name

        Returns:
            list: The list of compliance requirements for the provided compliance framework
        """
        compliance_requirements = []

        if bulk_compliance_frameworks and compliance_framework:
            compliance_requirements = [
                compliance_requirement.Id
                for compliance_requirement in bulk_compliance_frameworks.get(
                    compliance_framework
                ).Requirements
            ]

        return compliance_requirements

    @staticmethod
    def get_requirement(
        bulk_compliance_frameworks: dict, compliance_framework: str, requirement_id: str
    ) -> Union[Mitre_Requirement, Compliance_Requirement]:
        """
        Returns a compliance requirement from a compliance framework

        Args:
            bulk_compliance_frameworks (dict): The bulk compliance frameworks
            compliance_framework (str): The compliance framework name
            requirement_id (str): The compliance requirement ID

        Returns:
            Mitre_Requirement | Compliance_Requirement: The compliance requirement
        """
        requirement = None
        for compliance_requirement in bulk_compliance_frameworks.get(
            compliance_framework
        ).Requirements:
            if compliance_requirement.Id == requirement_id:
                requirement = compliance_requirement
                break

        return requirement

    @staticmethod
    def get_bulk(provider: str) -> dict:
        """Bulk load all compliance frameworks specification into a dict"""
        try:
            bulk_compliance_frameworks = {}
            available_compliance_framework_modules = list_compliance_modules()
            for compliance_framework in available_compliance_framework_modules:
                if provider in compliance_framework.name:
                    compliance_specification_dir_path = (
                        f"{compliance_framework.module_finder.path}/{provider}"
                    )
                    # for compliance_framework in available_compliance_framework_modules:
                    for filename in os.listdir(compliance_specification_dir_path):
                        file_path = os.path.join(
                            compliance_specification_dir_path, filename
                        )
                        # Check if it is a file and ti size is greater than 0
                        if os.path.isfile(file_path) and os.stat(file_path).st_size > 0:
                            # Open Compliance file in JSON
                            # cis_v1.4_aws.json --> cis_v1.4_aws
                            compliance_framework_name = filename.split(".json")[0]
                            # Store the compliance info
                            bulk_compliance_frameworks[compliance_framework_name] = (
                                load_compliance_framework(file_path)
                            )
        except Exception as e:
            logger.error(f"{e.__class__.__name__}[{e.__traceback__.tb_lineno}] -- {e}")

        return bulk_compliance_frameworks


# Testing Pending
def load_compliance_framework(
    compliance_specification_file: str,
) -> Compliance:
    """load_compliance_framework loads and parse a Compliance Framework Specification"""
    try:
        compliance_framework = Compliance.parse_file(compliance_specification_file)
    except ValidationError as error:
        logger.critical(
            f"Compliance Framework Specification from {compliance_specification_file} is not valid: {error}"
        )
        sys.exit(1)
    else:
        return compliance_framework
```

--------------------------------------------------------------------------------

---[FILE: custom_checks_metadata.py]---
Location: prowler-master/prowler/lib/check/custom_checks_metadata.py

```python
import sys

import yaml
from jsonschema import validate

from prowler.lib.check.models import Severity
from prowler.lib.logger import logger

custom_checks_metadata_schema = {
    "type": "object",
    "properties": {
        "Checks": {
            "type": "object",
            "patternProperties": {
                ".*": {
                    "type": "object",
                    "properties": {
                        "Severity": {
                            "type": "string",
                            "enum": [severity.value for severity in Severity],
                        },
                        "CheckTitle": {
                            "type": "string",
                        },
                        "Description": {
                            "type": "string",
                        },
                        "Risk": {
                            "type": "string",
                        },
                        "RelatedUrl": {
                            "type": "string",
                        },
                        "Remediation": {
                            "type": "object",
                            "properties": {
                                "Code": {
                                    "type": "object",
                                    "properties": {
                                        "CLI": {
                                            "type": "string",
                                        },
                                        "NativeIaC": {
                                            "type": "string",
                                        },
                                        "Other": {
                                            "type": "string",
                                        },
                                        "Terraform": {
                                            "type": "string",
                                        },
                                    },
                                },
                                "Recommendation": {
                                    "type": "object",
                                    "properties": {
                                        "Text": {
                                            "type": "string",
                                        },
                                        "Url": {
                                            "type": "string",
                                        },
                                    },
                                    "additionalProperties": False,
                                },
                            },
                            "additionalProperties": False,
                        },
                    },
                    "additionalProperties": False,
                }
            },
            "additionalProperties": False,
        }
    },
    "required": ["Checks"],
    "additionalProperties": False,
}


def parse_custom_checks_metadata_file(provider: str, parse_custom_checks_metadata_file):
    """parse_custom_checks_metadata_file returns the custom_checks_metadata object if it is valid, otherwise aborts the execution returning the ValidationError."""
    try:
        with open(parse_custom_checks_metadata_file) as f:
            custom_checks_metadata = yaml.safe_load(f)["CustomChecksMetadata"][provider]
            validate(custom_checks_metadata, schema=custom_checks_metadata_schema)
        return custom_checks_metadata
    except Exception as error:
        logger.critical(
            f"{error.__class__.__name__} -- {error}[{error.__traceback__.tb_lineno}]"
        )
        sys.exit(1)


def update_checks_metadata(bulk_checks_metadata, custom_checks_metadata):
    """update_checks_metadata returns the bulk_checks_metadata with the check's metadata updated based on the custom_checks_metadata provided."""
    try:
        # Update checks metadata from CustomChecksMetadata file
        for check, custom_metadata in custom_checks_metadata["Checks"].items():
            check_metadata = bulk_checks_metadata.get(check)
            if check_metadata:
                bulk_checks_metadata[check] = update_check_metadata(
                    check_metadata, custom_metadata
                )
        return bulk_checks_metadata
    except Exception as error:
        logger.critical(
            f"{error.__class__.__name__} -- {error}[{error.__traceback__.tb_lineno}]"
        )
        sys.exit(1)


def update_check_metadata(check_metadata, custom_metadata):
    """update_check_metadata updates the check_metadata fields present in the custom_metadata and returns the updated version of the check_metadata. If some field is not present or valid the check_metadata is returned with the original fields."""
    try:
        if custom_metadata:
            for attribute in custom_metadata:
                if attribute == "Remediation":
                    for remediation_attribute in custom_metadata[attribute]:
                        update_check_metadata_remediation(
                            check_metadata,
                            custom_metadata,
                            attribute,
                            remediation_attribute,
                        )
                else:
                    try:
                        setattr(check_metadata, attribute, custom_metadata[attribute])
                    except ValueError:
                        pass
    finally:
        return check_metadata


def update_check_metadata_remediation(
    check_metadata, custom_metadata, attribute, remediation_attribute
):
    if remediation_attribute == "Code":
        for code_attribute in custom_metadata[attribute][remediation_attribute]:
            try:
                setattr(
                    check_metadata.Remediation.Code,
                    code_attribute,
                    custom_metadata[attribute][remediation_attribute][code_attribute],
                )
            except ValueError:
                pass
    elif remediation_attribute == "Recommendation":
        for recommendation_attribute in custom_metadata[attribute][
            remediation_attribute
        ]:
            try:
                setattr(
                    check_metadata.Remediation.Recommendation,
                    recommendation_attribute,
                    custom_metadata[attribute][remediation_attribute][
                        recommendation_attribute
                    ],
                )
            except ValueError:
                pass
```

--------------------------------------------------------------------------------

````
