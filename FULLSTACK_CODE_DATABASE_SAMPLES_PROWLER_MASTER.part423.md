---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 423
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 423 of 867)

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

---[FILE: ens_aws_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/ens/ens_aws_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.ens.ens_aws import AWSENS
from prowler.lib.outputs.compliance.ens.models import AWSENSModel
from tests.lib.outputs.compliance.fixtures import ENS_RD2022_AWS
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class TestAWSENS:
    def test_output_transform(self):
        findings = [
            generate_finding_output(compliance={"ENS-RD2022": "op.exp.8.aws.ct.3"})
        ]

        output = AWSENS(findings, ENS_RD2022_AWS)
        output_data = output.data[0]
        assert isinstance(output_data, AWSENSModel)
        assert output_data.Provider == "aws"
        assert output_data.AccountId == AWS_ACCOUNT_NUMBER
        assert output_data.Region == AWS_REGION_EU_WEST_1
        assert output_data.Description == ENS_RD2022_AWS.Description
        assert output_data.Requirements_Id == ENS_RD2022_AWS.Requirements[0].Id
        assert (
            output_data.Requirements_Description
            == ENS_RD2022_AWS.Requirements[0].Description
        )
        assert (
            output_data.Requirements_Attributes_IdGrupoControl
            == ENS_RD2022_AWS.Requirements[0].Attributes[0].IdGrupoControl
        )
        assert (
            output_data.Requirements_Attributes_Marco
            == ENS_RD2022_AWS.Requirements[0].Attributes[0].Marco
        )
        assert (
            output_data.Requirements_Attributes_Categoria
            == ENS_RD2022_AWS.Requirements[0].Attributes[0].Categoria
        )
        assert (
            output_data.Requirements_Attributes_DescripcionControl
            == ENS_RD2022_AWS.Requirements[0].Attributes[0].DescripcionControl
        )
        assert (
            output_data.Requirements_Attributes_Nivel
            == ENS_RD2022_AWS.Requirements[0].Attributes[0].Nivel
        )
        assert (
            output_data.Requirements_Attributes_Tipo
            == ENS_RD2022_AWS.Requirements[0].Attributes[0].Tipo
        )
        assert [
            output_data.Requirements_Attributes_Dimensiones
        ] == ENS_RD2022_AWS.Requirements[0].Attributes[0].Dimensiones
        assert (
            output_data.Requirements_Attributes_ModoEjecucion
            == ENS_RD2022_AWS.Requirements[0].Attributes[0].ModoEjecucion
        )
        assert output_data.Requirements_Attributes_Dependencias == ""
        assert output_data.Status == "PASS"
        assert output_data.StatusExtended == ""
        assert output_data.ResourceId == ""
        assert output_data.ResourceName == ""
        assert output_data.CheckId == "service_test_check_id"
        assert output_data.Muted is False
        # Test manual check
        output_data_manual = output.data[1]
        assert output_data_manual.Provider == "aws"
        assert output_data_manual.Framework == ENS_RD2022_AWS.Framework
        assert output_data_manual.Name == ENS_RD2022_AWS.Name
        assert output_data_manual.AccountId == ""
        assert output_data_manual.Region == ""
        assert output_data_manual.Requirements_Id == ENS_RD2022_AWS.Requirements[1].Id
        assert (
            output_data_manual.Requirements_Description
            == ENS_RD2022_AWS.Requirements[1].Description
        )
        assert (
            output_data_manual.Requirements_Attributes_IdGrupoControl
            == ENS_RD2022_AWS.Requirements[1].Attributes[0].IdGrupoControl
        )
        assert (
            output_data_manual.Requirements_Attributes_Marco
            == ENS_RD2022_AWS.Requirements[1].Attributes[0].Marco
        )
        assert (
            output_data_manual.Requirements_Attributes_Categoria
            == ENS_RD2022_AWS.Requirements[1].Attributes[0].Categoria
        )
        assert (
            output_data_manual.Requirements_Attributes_DescripcionControl
            == ENS_RD2022_AWS.Requirements[1].Attributes[0].DescripcionControl
        )
        assert (
            output_data_manual.Requirements_Attributes_Nivel
            == ENS_RD2022_AWS.Requirements[1].Attributes[0].Nivel
        )
        assert (
            output_data_manual.Requirements_Attributes_Tipo
            == ENS_RD2022_AWS.Requirements[1].Attributes[0].Tipo
        )
        assert [
            output_data_manual.Requirements_Attributes_Dimensiones
        ] == ENS_RD2022_AWS.Requirements[1].Attributes[0].Dimensiones
        assert (
            output_data_manual.Requirements_Attributes_ModoEjecucion
            == ENS_RD2022_AWS.Requirements[1].Attributes[0].ModoEjecucion
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.ens.ens_aws.timestamp", "2025-01-01 00:00:00"
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [
            generate_finding_output(compliance={"ENS-RD2022": "op.exp.8.aws.ct.3"})
        ]
        output = AWSENS(findings, ENS_RD2022_AWS)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        expected_csv = f"PROVIDER;DESCRIPTION;ACCOUNTID;REGION;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL;REQUIREMENTS_ATTRIBUTES_MARCO;REQUIREMENTS_ATTRIBUTES_CATEGORIA;REQUIREMENTS_ATTRIBUTES_DESCRIPCIONCONTROL;REQUIREMENTS_ATTRIBUTES_NIVEL;REQUIREMENTS_ATTRIBUTES_TIPO;REQUIREMENTS_ATTRIBUTES_DIMENSIONES;REQUIREMENTS_ATTRIBUTES_MODOEJECUCION;REQUIREMENTS_ATTRIBUTES_DEPENDENCIAS;STATUS;STATUSEXTENDED;RESOURCEID;CHECKID;MUTED;RESOURCENAME;FRAMEWORK;NAME\r\naws;The accreditation scheme of the ENS (National Security Scheme) has been developed by the Ministry of Finance and Public Administrations and the CCN (National Cryptological Center). This includes the basic principles and minimum requirements necessary for the adequate protection of information.;123456789012;eu-west-1;{datetime.now()};op.exp.8.aws.ct.3;Registro de actividad;op.exp.8;operacional;explotación;Habilitar la validación de archivos en todos los trails, evitando así que estos se vean modificados o eliminados.;alto;requisito;trazabilidad;automático;;PASS;;;service_test_check_id;False;;ENS;ENS RD 311/2022 - Categoría Alta\r\naws;The accreditation scheme of the ENS (National Security Scheme) has been developed by the Ministry of Finance and Public Administrations and the CCN (National Cryptological Center). This includes the basic principles and minimum requirements necessary for the adequate protection of information.;;;{datetime.now()};op.exp.8.aws.ct.4;Registro de actividad;op.exp.8;operacional;explotación;Habilitar la validación de archivos en todos los trails, evitando así que estos se vean modificados o eliminados.;alto;requisito;trazabilidad;automático;;MANUAL;Manual check;manual_check;manual;False;Manual check;ENS;ENS RD 311/2022 - Categoría Alta\r\n"
        assert content == expected_csv
```

--------------------------------------------------------------------------------

---[FILE: ens_azure_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/ens/ens_azure_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.ens.ens_azure import AzureENS
from prowler.lib.outputs.compliance.ens.models import AzureENSModel
from tests.lib.outputs.compliance.fixtures import ENS_RD2022_AZURE
from tests.lib.outputs.fixtures.fixtures import generate_finding_output


class TestAzureENS:
    def test_output_transform(self):
        findings = [
            generate_finding_output(
                compliance={"ENS-RD2022": "op.exp.8.azure.ct.3"},
                provider="azure",
                region="global",
            ),
        ]

        output = AzureENS(findings, ENS_RD2022_AZURE)
        output_data = output.data[0]
        assert isinstance(output_data, AzureENSModel)
        assert output_data.Provider == "azure"
        assert output_data.Framework == ENS_RD2022_AZURE.Framework
        assert output_data.Name == ENS_RD2022_AZURE.Name
        assert output_data.SubscriptionId == "123456789012"
        assert output_data.Location == "global"
        assert output_data.Description == ENS_RD2022_AZURE.Description
        assert output_data.Requirements_Id == ENS_RD2022_AZURE.Requirements[0].Id
        assert (
            output_data.Requirements_Description
            == ENS_RD2022_AZURE.Requirements[0].Description
        )
        assert (
            output_data.Requirements_Attributes_IdGrupoControl
            == ENS_RD2022_AZURE.Requirements[0].Attributes[0].IdGrupoControl
        )
        assert (
            output_data.Requirements_Attributes_Marco
            == ENS_RD2022_AZURE.Requirements[0].Attributes[0].Marco
        )
        assert (
            output_data.Requirements_Attributes_Categoria
            == ENS_RD2022_AZURE.Requirements[0].Attributes[0].Categoria
        )
        assert (
            output_data.Requirements_Attributes_DescripcionControl
            == ENS_RD2022_AZURE.Requirements[0].Attributes[0].DescripcionControl
        )
        assert (
            output_data.Requirements_Attributes_Nivel
            == ENS_RD2022_AZURE.Requirements[0].Attributes[0].Nivel
        )
        assert (
            output_data.Requirements_Attributes_Tipo
            == ENS_RD2022_AZURE.Requirements[0].Attributes[0].Tipo
        )
        assert [
            output_data.Requirements_Attributes_Dimensiones
        ] == ENS_RD2022_AZURE.Requirements[0].Attributes[0].Dimensiones
        assert (
            output_data.Requirements_Attributes_ModoEjecucion
            == ENS_RD2022_AZURE.Requirements[0].Attributes[0].ModoEjecucion
        )
        assert output_data.Requirements_Attributes_Dependencias == ""
        assert output_data.Status == "PASS"
        assert output_data.StatusExtended == ""
        assert output_data.ResourceId == ""
        assert output_data.ResourceName == ""
        assert output_data.CheckId == "service_test_check_id"
        assert output_data.Muted is False
        # Test manual check
        output_data_manual = output.data[1]
        assert output_data_manual.Provider == "azure"
        assert output_data_manual.Framework == ENS_RD2022_AZURE.Framework
        assert output_data_manual.Name == ENS_RD2022_AZURE.Name
        assert output_data_manual.SubscriptionId == ""
        assert output_data_manual.Location == ""
        assert output_data_manual.Requirements_Id == ENS_RD2022_AZURE.Requirements[1].Id
        assert (
            output_data_manual.Requirements_Description
            == ENS_RD2022_AZURE.Requirements[1].Description
        )
        assert (
            output_data_manual.Requirements_Attributes_IdGrupoControl
            == ENS_RD2022_AZURE.Requirements[1].Attributes[0].IdGrupoControl
        )
        assert (
            output_data_manual.Requirements_Attributes_Marco
            == ENS_RD2022_AZURE.Requirements[1].Attributes[0].Marco
        )
        assert (
            output_data_manual.Requirements_Attributes_Categoria
            == ENS_RD2022_AZURE.Requirements[1].Attributes[0].Categoria
        )
        assert (
            output_data_manual.Requirements_Attributes_DescripcionControl
            == ENS_RD2022_AZURE.Requirements[1].Attributes[0].DescripcionControl
        )
        assert (
            output_data_manual.Requirements_Attributes_Nivel
            == ENS_RD2022_AZURE.Requirements[1].Attributes[0].Nivel
        )
        assert (
            output_data_manual.Requirements_Attributes_Tipo
            == ENS_RD2022_AZURE.Requirements[1].Attributes[0].Tipo
        )
        assert [
            output_data_manual.Requirements_Attributes_Dimensiones
        ] == ENS_RD2022_AZURE.Requirements[1].Attributes[0].Dimensiones
        assert (
            output_data_manual.Requirements_Attributes_ModoEjecucion
            == ENS_RD2022_AZURE.Requirements[1].Attributes[0].ModoEjecucion
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.ens.ens_azure.timestamp", "2025-01-01 00:00:00"
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [
            generate_finding_output(
                compliance={"ENS-RD2022": "op.exp.8.azure.ct.3"},
                provider="azure",
                region="global",
            ),
        ]
        output = AzureENS(findings, ENS_RD2022_AZURE)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        expected_csv = f"PROVIDER;DESCRIPTION;SUBSCRIPTIONID;LOCATION;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL;REQUIREMENTS_ATTRIBUTES_MARCO;REQUIREMENTS_ATTRIBUTES_CATEGORIA;REQUIREMENTS_ATTRIBUTES_DESCRIPCIONCONTROL;REQUIREMENTS_ATTRIBUTES_NIVEL;REQUIREMENTS_ATTRIBUTES_TIPO;REQUIREMENTS_ATTRIBUTES_DIMENSIONES;REQUIREMENTS_ATTRIBUTES_MODOEJECUCION;REQUIREMENTS_ATTRIBUTES_DEPENDENCIAS;STATUS;STATUSEXTENDED;RESOURCEID;CHECKID;MUTED;RESOURCENAME;FRAMEWORK;NAME\r\nazure;The accreditation scheme of the ENS (National Security Scheme) has been developed by the Ministry of Finance and Public Administrations and the CCN (National Cryptological Center). This includes the basic principles and minimum requirements necessary for the adequate protection of information.;123456789012;global;{datetime.now()};op.exp.8.azure.ct.3;Registro de actividad;op.exp.8;operacional;explotación;Habilitar la validación de archivos en todos los trails, evitando así que estos se vean modificados o eliminados.;alto;requisito;trazabilidad;automático;;PASS;;;service_test_check_id;False;;ENS;ENS RD 311/2022 - Categoría Alta\r\nazure;The accreditation scheme of the ENS (National Security Scheme) has been developed by the Ministry of Finance and Public Administrations and the CCN (National Cryptological Center). This includes the basic principles and minimum requirements necessary for the adequate protection of information.;;;{datetime.now()};op.exp.8.azure.ct.4;Registro de actividad;op.exp.8;operacional;explotación;Habilitar la validación de archivos en todos los trails, evitando así que estos se vean modificados o eliminados.;alto;requisito;trazabilidad;automático;;MANUAL;Manual check;manual_check;manual;False;Manual check;ENS;ENS RD 311/2022 - Categoría Alta\r\n"

        assert content == expected_csv
```

--------------------------------------------------------------------------------

---[FILE: ens_gcp_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/ens/ens_gcp_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.ens.ens_gcp import GCPENS
from prowler.lib.outputs.compliance.ens.models import GCPENSModel
from tests.lib.outputs.compliance.fixtures import ENS_RD2022_GCP
from tests.lib.outputs.fixtures.fixtures import generate_finding_output


class TestGCPENS:
    def test_output_transform(self):
        findings = [
            generate_finding_output(
                compliance={"ENS-RD2022": "op.exp.8.gcp.ct.3"},
                provider="gcp",
                region="global",
            ),
        ]

        output = GCPENS(findings, ENS_RD2022_GCP)
        output_data = output.data[0]
        assert isinstance(output_data, GCPENSModel)
        assert output_data.Provider == "gcp"
        assert output_data.Framework == ENS_RD2022_GCP.Framework
        assert output_data.Name == ENS_RD2022_GCP.Name
        assert output_data.ProjectId == "123456789012"
        assert output_data.Location == "global"
        assert output_data.Description == ENS_RD2022_GCP.Description
        assert output_data.Requirements_Id == ENS_RD2022_GCP.Requirements[0].Id
        assert (
            output_data.Requirements_Description
            == ENS_RD2022_GCP.Requirements[0].Description
        )
        assert (
            output_data.Requirements_Attributes_IdGrupoControl
            == ENS_RD2022_GCP.Requirements[0].Attributes[0].IdGrupoControl
        )
        assert (
            output_data.Requirements_Attributes_Marco
            == ENS_RD2022_GCP.Requirements[0].Attributes[0].Marco
        )
        assert (
            output_data.Requirements_Attributes_Categoria
            == ENS_RD2022_GCP.Requirements[0].Attributes[0].Categoria
        )
        assert (
            output_data.Requirements_Attributes_DescripcionControl
            == ENS_RD2022_GCP.Requirements[0].Attributes[0].DescripcionControl
        )
        assert (
            output_data.Requirements_Attributes_Nivel
            == ENS_RD2022_GCP.Requirements[0].Attributes[0].Nivel
        )
        assert (
            output_data.Requirements_Attributes_Tipo
            == ENS_RD2022_GCP.Requirements[0].Attributes[0].Tipo
        )
        assert [
            output_data.Requirements_Attributes_Dimensiones
        ] == ENS_RD2022_GCP.Requirements[0].Attributes[0].Dimensiones
        assert (
            output_data.Requirements_Attributes_ModoEjecucion
            == ENS_RD2022_GCP.Requirements[0].Attributes[0].ModoEjecucion
        )
        assert output_data.Requirements_Attributes_Dependencias == ""
        assert output_data.Status == "PASS"
        assert output_data.StatusExtended == ""
        assert output_data.ResourceId == ""
        assert output_data.ResourceName == ""
        assert output_data.CheckId == "service_test_check_id"
        assert output_data.Muted is False
        # Test manual check
        output_data_manual = output.data[1]
        assert output_data_manual.Provider == "gcp"
        assert output_data_manual.Framework == ENS_RD2022_GCP.Framework
        assert output_data_manual.Name == ENS_RD2022_GCP.Name
        assert output_data_manual.ProjectId == ""
        assert output_data_manual.Location == ""
        assert output_data_manual.Requirements_Id == ENS_RD2022_GCP.Requirements[1].Id
        assert (
            output_data_manual.Requirements_Description
            == ENS_RD2022_GCP.Requirements[1].Description
        )
        assert (
            output_data_manual.Requirements_Attributes_IdGrupoControl
            == ENS_RD2022_GCP.Requirements[1].Attributes[0].IdGrupoControl
        )
        assert (
            output_data_manual.Requirements_Attributes_Marco
            == ENS_RD2022_GCP.Requirements[1].Attributes[0].Marco
        )
        assert (
            output_data_manual.Requirements_Attributes_Categoria
            == ENS_RD2022_GCP.Requirements[1].Attributes[0].Categoria
        )
        assert (
            output_data_manual.Requirements_Attributes_DescripcionControl
            == ENS_RD2022_GCP.Requirements[1].Attributes[0].DescripcionControl
        )
        assert (
            output_data_manual.Requirements_Attributes_Nivel
            == ENS_RD2022_GCP.Requirements[1].Attributes[0].Nivel
        )
        assert (
            output_data_manual.Requirements_Attributes_Tipo
            == ENS_RD2022_GCP.Requirements[1].Attributes[0].Tipo
        )
        assert [
            output_data_manual.Requirements_Attributes_Dimensiones
        ] == ENS_RD2022_GCP.Requirements[1].Attributes[0].Dimensiones
        assert (
            output_data_manual.Requirements_Attributes_ModoEjecucion
            == ENS_RD2022_GCP.Requirements[1].Attributes[0].ModoEjecucion
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.ens.ens_gcp.timestamp", "2025-01-01 00:00:00"
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [
            generate_finding_output(
                compliance={"ENS-RD2022": "op.exp.8.gcp.ct.3"},
                provider="gcp",
                region="global",
            ),
        ]
        output = GCPENS(findings, ENS_RD2022_GCP)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        expected_csv = f"PROVIDER;DESCRIPTION;PROJECTID;LOCATION;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL;REQUIREMENTS_ATTRIBUTES_MARCO;REQUIREMENTS_ATTRIBUTES_CATEGORIA;REQUIREMENTS_ATTRIBUTES_DESCRIPCIONCONTROL;REQUIREMENTS_ATTRIBUTES_NIVEL;REQUIREMENTS_ATTRIBUTES_TIPO;REQUIREMENTS_ATTRIBUTES_DIMENSIONES;REQUIREMENTS_ATTRIBUTES_MODOEJECUCION;REQUIREMENTS_ATTRIBUTES_DEPENDENCIAS;STATUS;STATUSEXTENDED;RESOURCEID;CHECKID;MUTED;RESOURCENAME;FRAMEWORK;NAME\r\ngcp;The accreditation scheme of the ENS (National Security Scheme) has been developed by the Ministry of Finance and Public Administrations and the CCN (National Cryptological Center). This includes the basic principles and minimum requirements necessary for the adequate protection of information.;123456789012;global;{datetime.now()};op.exp.8.gcp.ct.3;Registro de actividad;op.exp.8;operacional;explotación;Habilitar la validación de archivos en todos los trails, evitando así que estos se vean modificados o eliminados.;alto;requisito;trazabilidad;automático;;PASS;;;service_test_check_id;False;;ENS;ENS RD 311/2022 - Categoría Alta\r\ngcp;The accreditation scheme of the ENS (National Security Scheme) has been developed by the Ministry of Finance and Public Administrations and the CCN (National Cryptological Center). This includes the basic principles and minimum requirements necessary for the adequate protection of information.;;;{datetime.now()};op.exp.8.gcp.ct.4;Registro de actividad;op.exp.8;operacional;explotación;Habilitar la validación de archivos en todos los trails, evitando así que estos se vean modificados o eliminados.;alto;requisito;trazabilidad;automático;;MANUAL;Manual check;manual_check;manual;False;Manual check;ENS;ENS RD 311/2022 - Categoría Alta\r\n"

        assert content == expected_csv
```

--------------------------------------------------------------------------------

---[FILE: generic_aws_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/generic/generic_aws_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.generic.generic import GenericCompliance
from prowler.lib.outputs.compliance.generic.models import GenericComplianceModel
from tests.lib.outputs.compliance.fixtures import NIST_800_53_REVISION_4_AWS
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class TestAWSGenericCompliance:
    def test_output_transform(self):
        findings = [
            generate_finding_output(compliance={"NIST-800-53-Revision-4": "ac_2_4"})
        ]

        output = GenericCompliance(findings, NIST_800_53_REVISION_4_AWS)
        output_data = output.data[0]
        assert isinstance(output_data, GenericComplianceModel)
        assert output_data.Provider == "aws"
        assert output_data.Framework == "NIST-800-53-Revision-4"
        assert (
            output_data.Name
            == "National Institute of Standards and Technology (NIST) 800-53 Revision 4"
        )
        assert output_data.AccountId == AWS_ACCOUNT_NUMBER
        assert output_data.Region == AWS_REGION_EU_WEST_1
        assert output_data.Description == NIST_800_53_REVISION_4_AWS.Description
        assert (
            output_data.Requirements_Id == NIST_800_53_REVISION_4_AWS.Requirements[0].Id
        )
        assert (
            output_data.Requirements_Description
            == NIST_800_53_REVISION_4_AWS.Requirements[0].Description
        )
        assert (
            output_data.Requirements_Attributes_Section
            == NIST_800_53_REVISION_4_AWS.Requirements[0].Attributes[0].Section
        )
        assert (
            output_data.Requirements_Attributes_SubSection
            == NIST_800_53_REVISION_4_AWS.Requirements[0].Attributes[0].SubSection
        )
        assert (
            output_data.Requirements_Attributes_SubGroup
            == NIST_800_53_REVISION_4_AWS.Requirements[0].Attributes[0].SubGroup
        )
        assert (
            output_data.Requirements_Attributes_Service
            == NIST_800_53_REVISION_4_AWS.Requirements[0].Attributes[0].Service
        )
        assert (
            output_data.Requirements_Attributes_Type
            == NIST_800_53_REVISION_4_AWS.Requirements[0].Attributes[0].Type
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
        assert output_data_manual.Framework == NIST_800_53_REVISION_4_AWS.Framework
        assert output_data_manual.Name == NIST_800_53_REVISION_4_AWS.Name
        assert output_data_manual.AccountId == ""
        assert output_data_manual.Region == ""
        assert output_data_manual.Description == NIST_800_53_REVISION_4_AWS.Description
        assert (
            output_data_manual.Requirements_Id
            == NIST_800_53_REVISION_4_AWS.Requirements[1].Id
        )
        assert (
            output_data_manual.Requirements_Description
            == NIST_800_53_REVISION_4_AWS.Requirements[1].Description
        )
        assert (
            output_data_manual.Requirements_Attributes_Section
            == NIST_800_53_REVISION_4_AWS.Requirements[1].Attributes[0].Section
        )
        assert (
            output_data_manual.Requirements_Attributes_SubSection
            == NIST_800_53_REVISION_4_AWS.Requirements[1].Attributes[0].SubSection
        )
        assert (
            output_data_manual.Requirements_Attributes_SubGroup
            == NIST_800_53_REVISION_4_AWS.Requirements[1].Attributes[0].SubGroup
        )
        assert (
            output_data_manual.Requirements_Attributes_Service
            == NIST_800_53_REVISION_4_AWS.Requirements[1].Attributes[0].Service
        )
        assert (
            output_data_manual.Requirements_Attributes_Type
            == NIST_800_53_REVISION_4_AWS.Requirements[1].Attributes[0].Type
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.generic.generic.timestamp",
        "2025-01-01 00:00:00",
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [
            generate_finding_output(compliance={"NIST-800-53-Revision-4": "ac_2_4"})
        ]
        output = GenericCompliance(findings, NIST_800_53_REVISION_4_AWS)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        expected_csv = f"PROVIDER;DESCRIPTION;ACCOUNTID;REGION;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_SECTION;REQUIREMENTS_ATTRIBUTES_SUBSECTION;REQUIREMENTS_ATTRIBUTES_SUBGROUP;REQUIREMENTS_ATTRIBUTES_SERVICE;REQUIREMENTS_ATTRIBUTES_TYPE;STATUS;STATUSEXTENDED;RESOURCEID;CHECKID;MUTED;RESOURCENAME;FRAMEWORK;NAME\r\naws;NIST 800-53 is a regulatory standard that defines the minimum baseline of security controls for all U.S. federal information systems except those related to national security. The controls defined in this standard are customizable and address a diverse set of security and privacy requirements.;123456789012;eu-west-1;{datetime.now()};ac_2_4;Account Management;Access Control (AC);Account Management (AC-2);;aws;;PASS;;;service_test_check_id;False;;NIST-800-53-Revision-4;National Institute of Standards and Technology (NIST) 800-53 Revision 4\r\naws;NIST 800-53 is a regulatory standard that defines the minimum baseline of security controls for all U.S. federal information systems except those related to national security. The controls defined in this standard are customizable and address a diverse set of security and privacy requirements.;;;{datetime.now()};ac_2_5;Account Management;Access Control (AC);Account Management (AC-2);;aws;;MANUAL;Manual check;manual_check;manual;False;Manual check;NIST-800-53-Revision-4;National Institute of Standards and Technology (NIST) 800-53 Revision 4\r\n"

        assert content == expected_csv
```

--------------------------------------------------------------------------------

---[FILE: iso27001_aws_test.py]---
Location: prowler-master/tests/lib/outputs/compliance/iso27001/iso27001_aws_test.py

```python
from datetime import datetime
from io import StringIO
from unittest import mock

from freezegun import freeze_time
from mock import patch

from prowler.lib.outputs.compliance.iso27001.iso27001_aws import AWSISO27001
from prowler.lib.outputs.compliance.iso27001.models import AWSISO27001Model
from tests.lib.outputs.compliance.fixtures import ISO27001_2013_AWS
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class TestAWSISO27001:
    def test_output_transform(self):
        findings = [generate_finding_output(compliance={"ISO27001-2013": "A.10.1"})]

        output = AWSISO27001(findings, ISO27001_2013_AWS)
        output_data = output.data[0]
        assert isinstance(output_data, AWSISO27001Model)
        assert output_data.Provider == "aws"
        assert output_data.Framework == ISO27001_2013_AWS.Framework
        assert output_data.Name == ISO27001_2013_AWS.Name
        assert output_data.AccountId == AWS_ACCOUNT_NUMBER
        assert output_data.Region == AWS_REGION_EU_WEST_1
        assert output_data.Description == ISO27001_2013_AWS.Description
        assert (
            output_data.Requirements_Attributes_Category
            == ISO27001_2013_AWS.Requirements[0].Attributes[0].Category
        )
        assert (
            output_data.Requirements_Attributes_Objetive_ID
            == ISO27001_2013_AWS.Requirements[0].Attributes[0].Objetive_ID
        )
        assert (
            output_data.Requirements_Attributes_Objetive_Name
            == ISO27001_2013_AWS.Requirements[0].Attributes[0].Objetive_Name
        )
        assert (
            output_data.Requirements_Attributes_Check_Summary
            == ISO27001_2013_AWS.Requirements[0].Attributes[0].Check_Summary
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
        assert output_data_manual.Framework == ISO27001_2013_AWS.Framework
        assert output_data_manual.Name == ISO27001_2013_AWS.Name
        assert output_data_manual.AccountId == ""
        assert output_data_manual.Region == ""
        assert output_data_manual.Description == ISO27001_2013_AWS.Description
        assert (
            output_data_manual.Requirements_Attributes_Category
            == ISO27001_2013_AWS.Requirements[1].Attributes[0].Category
        )
        assert (
            output_data_manual.Requirements_Attributes_Objetive_ID
            == ISO27001_2013_AWS.Requirements[1].Attributes[0].Objetive_ID
        )
        assert (
            output_data_manual.Requirements_Attributes_Objetive_Name
            == ISO27001_2013_AWS.Requirements[1].Attributes[0].Objetive_Name
        )
        assert (
            output_data_manual.Requirements_Attributes_Check_Summary
            == ISO27001_2013_AWS.Requirements[1].Attributes[0].Check_Summary
        )
        assert output_data_manual.Status == "MANUAL"
        assert output_data_manual.StatusExtended == "Manual check"
        assert output_data_manual.ResourceId == "manual_check"
        assert output_data_manual.ResourceName == "Manual check"
        assert output_data_manual.CheckId == "manual"
        assert output_data_manual.Muted is False

    @freeze_time("2025-01-01 00:00:00")
    @mock.patch(
        "prowler.lib.outputs.compliance.iso27001.iso27001_aws.timestamp",
        "2025-01-01 00:00:00",
    )
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [generate_finding_output(compliance={"ISO27001-2013": "A.10.1"})]
        output = AWSISO27001(findings, ISO27001_2013_AWS)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        expected_csv = f"PROVIDER;DESCRIPTION;ACCOUNTID;REGION;ASSESSMENTDATE;REQUIREMENTS_ID;REQUIREMENTS_NAME;REQUIREMENTS_DESCRIPTION;REQUIREMENTS_ATTRIBUTES_CATEGORY;REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID;REQUIREMENTS_ATTRIBUTES_OBJETIVE_NAME;REQUIREMENTS_ATTRIBUTES_CHECK_SUMMARY;STATUS;STATUSEXTENDED;RESOURCEID;CHECKID;MUTED;RESOURCENAME;FRAMEWORK;NAME\r\naws;ISO (the International Organization for Standardization) and IEC (the International Electrotechnical Commission) form the specialized system for worldwide standardization. National bodies that are members of ISO or IEC participate in the development of International Standards through technical committees established by the respective organization to deal with particular fields of technical activity. ISO and IEC technical committees collaborate in fields of mutual interest. Other international organizations, governmental and non-governmental, in liaison with ISO and IEC, also take part in the work.;123456789012;eu-west-1;{datetime.now()};A.10.1;Cryptographic Controls;Setup Encryption at rest for RDS instances;A.10 Cryptography;A.10.1;Cryptographic Controls;Setup Encryption at rest for RDS instances;PASS;;;service_test_check_id;False;;ISO27001;ISO/IEC 27001 Information Security Management Standard 2013\r\naws;ISO (the International Organization for Standardization) and IEC (the International Electrotechnical Commission) form the specialized system for worldwide standardization. National bodies that are members of ISO or IEC participate in the development of International Standards through technical committees established by the respective organization to deal with particular fields of technical activity. ISO and IEC technical committees collaborate in fields of mutual interest. Other international organizations, governmental and non-governmental, in liaison with ISO and IEC, also take part in the work.;;;{datetime.now()};A.10.2;Cryptographic Controls;Setup Encryption at rest for RDS instances;A.10 Cryptography;A.10.1;Cryptographic Controls;Setup Encryption at rest for RDS instances;MANUAL;Manual check;manual_check;manual;False;Manual check;ISO27001;ISO/IEC 27001 Information Security Management Standard 2013\r\n"

        assert content == expected_csv
```

--------------------------------------------------------------------------------

````
