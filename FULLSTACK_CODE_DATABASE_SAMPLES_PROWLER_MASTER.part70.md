---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 70
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 70 of 867)

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

---[FILE: cis_1_8_kubernetes.py]---
Location: prowler-master/dashboard/compliance/cis_1_8_kubernetes.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_2_0_alibabacloud.py]---
Location: prowler-master/dashboard/compliance/cis_2_0_alibabacloud.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_2_0_aws.py]---
Location: prowler-master/dashboard/compliance/cis_2_0_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_2_0_azure.py]---
Location: prowler-master/dashboard/compliance/cis_2_0_azure.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_2_0_gcp.py]---
Location: prowler-master/dashboard/compliance/cis_2_0_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_2_1_azure.py]---
Location: prowler-master/dashboard/compliance/cis_2_1_azure.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_3_0_aws.py]---
Location: prowler-master/dashboard/compliance/cis_3_0_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_3_0_azure.py]---
Location: prowler-master/dashboard/compliance/cis_3_0_azure.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):

    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_3_0_gcp.py]---
Location: prowler-master/dashboard/compliance/cis_3_0_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_3_0_oci.py]---
Location: prowler-master/dashboard/compliance/cis_3_0_oci.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    """
    Generate CIS OCI Foundations Benchmark v3.0 compliance table.

    Args:
        data: DataFrame containing compliance check results with columns:
            - REQUIREMENTS_ID: CIS requirement ID (e.g., "1.1", "2.1")
            - REQUIREMENTS_DESCRIPTION: Description of the requirement
            - REQUIREMENTS_ATTRIBUTES_SECTION: CIS section name
            - CHECKID: Prowler check identifier
            - STATUS: Check status (PASS/FAIL)
            - REGION: OCI region
            - TENANCYID: OCI tenancy OCID
            - RESOURCEID: Resource OCID or identifier

    Returns:
        Section containers organized by CIS sections for dashboard display
    """
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "TENANCYID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_4_0_aws.py]---
Location: prowler-master/dashboard/compliance/cis_4_0_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_4_0_azure.py]---
Location: prowler-master/dashboard/compliance/cis_4_0_azure.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):

    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_4_0_gcp.py]---
Location: prowler-master/dashboard/compliance/cis_4_0_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_4_0_m365.py]---
Location: prowler-master/dashboard/compliance/cis_4_0_m365.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: cis_5_0_aws.py]---
Location: prowler-master/dashboard/compliance/cis_5_0_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: ens_rd2022_aws.py]---
Location: prowler-master/dashboard/compliance/ens_rd2022_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_ens

warnings.filterwarnings("ignore")


def get_table(data):
    # append the requirements_description to idgrupocontrol
    data["REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL"] = (
        data["REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL"]
        + " - "
        + data["REQUIREMENTS_DESCRIPTION"]
    )

    aux = data[
        [
            "REQUIREMENTS_ATTRIBUTES_MARCO",
            "REQUIREMENTS_ATTRIBUTES_CATEGORIA",
            "REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL",
            "REQUIREMENTS_ATTRIBUTES_TIPO",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]

    return get_section_containers_ens(
        aux,
        "REQUIREMENTS_ATTRIBUTES_MARCO",
        "REQUIREMENTS_ATTRIBUTES_CATEGORIA",
        "REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL",
        "REQUIREMENTS_ATTRIBUTES_TIPO",
    )
```

--------------------------------------------------------------------------------

---[FILE: ens_rd2022_azure.py]---
Location: prowler-master/dashboard/compliance/ens_rd2022_azure.py

```python
import warnings

from dashboard.common_methods import get_section_containers_ens

warnings.filterwarnings("ignore")


def get_table(data):
    # append the requirements_description to idgrupocontrol
    data["REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL"] = (
        data["REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL"]
        + " - "
        + data["REQUIREMENTS_DESCRIPTION"]
    )

    aux = data[
        [
            "REQUIREMENTS_ATTRIBUTES_MARCO",
            "REQUIREMENTS_ATTRIBUTES_CATEGORIA",
            "REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL",
            "REQUIREMENTS_ATTRIBUTES_TIPO",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]

    return get_section_containers_ens(
        aux,
        "REQUIREMENTS_ATTRIBUTES_MARCO",
        "REQUIREMENTS_ATTRIBUTES_CATEGORIA",
        "REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL",
        "REQUIREMENTS_ATTRIBUTES_TIPO",
    )
```

--------------------------------------------------------------------------------

---[FILE: ens_rd2022_gcp.py]---
Location: prowler-master/dashboard/compliance/ens_rd2022_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_containers_ens

warnings.filterwarnings("ignore")


def get_table(data):
    # append the requirements_description to idgrupocontrol
    data["REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL"] = (
        data["REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL"]
        + " - "
        + data["REQUIREMENTS_DESCRIPTION"]
    )

    aux = data[
        [
            "REQUIREMENTS_ATTRIBUTES_MARCO",
            "REQUIREMENTS_ATTRIBUTES_CATEGORIA",
            "REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL",
            "REQUIREMENTS_ATTRIBUTES_TIPO",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]

    return get_section_containers_ens(
        aux,
        "REQUIREMENTS_ATTRIBUTES_MARCO",
        "REQUIREMENTS_ATTRIBUTES_CATEGORIA",
        "REQUIREMENTS_ATTRIBUTES_IDGRUPOCONTROL",
        "REQUIREMENTS_ATTRIBUTES_TIPO",
    )
```

--------------------------------------------------------------------------------

---[FILE: fedramp_20x_ksi_low_aws.py]---
Location: prowler-master/dashboard/compliance/fedramp_20x_ksi_low_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    # Shorten the long FedRAMP KSI descriptions for better display
    ksi_short_names = {
        "A secure cloud service offering will protect user data, control access, and apply zero trust principles": "Identity and Access Management",
        "A secure cloud service offering will use cloud native architecture and design principles to enforce and enhance the Confidentiality, Integrity and Availability of the system": "Cloud Native Architecture",
        "A secure cloud service provider will ensure that all system changes are properly documented and configuration baselines are updated accordingly": "Change Management",
        "A secure cloud service provider will continuously educate their employees on cybersecurity measures, testing them regularly": "Cybersecurity Education",
        "A secure cloud service offering will document, report, and analyze security incidents to ensure regulatory compliance and continuous security improvement": "Incident Reporting",
        "A secure cloud service offering will monitor, log, and audit all important events, activity, and changes": "Monitoring, Logging, and Auditing",
        "A secure cloud service offering will have intentional, organized, universal guidance for how every information resource, including personnel, is secured": "Policy and Inventory",
        "A secure cloud service offering will define, maintain, and test incident response plan(s) and recovery capabilities to ensure minimal service disruption and data loss": "Recovery Planning",
        "A secure cloud service offering will follow FedRAMP encryption policies, continuously verify information resource integrity, and restrict access to third-party information resources": "Service Configuration",
        "A secure cloud service offering will understand, monitor, and manage supply chain risks from third-party information resources": "Third-Party Information Resources",
    }

    # Replace long descriptions with short names - use contains for partial matching
    if not aux.empty:
        for long_desc, short_name in ksi_short_names.items():
            mask = aux["REQUIREMENTS_DESCRIPTION"].str.contains(
                long_desc, na=False, regex=False
            )
            aux.loc[mask, "REQUIREMENTS_DESCRIPTION"] = short_name

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: fedramp_20x_ksi_low_azure.py]---
Location: prowler-master/dashboard/compliance/fedramp_20x_ksi_low_azure.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    # Shorten the long FedRAMP KSI descriptions for better display
    ksi_short_names = {
        "A secure cloud service offering will protect user data, control access, and apply zero trust principles": "Identity and Access Management",
        "A secure cloud service offering will use cloud native architecture and design principles to enforce and enhance the Confidentiality, Integrity and Availability of the system": "Cloud Native Architecture",
        "A secure cloud service provider will ensure that all system changes are properly documented and configuration baselines are updated accordingly": "Change Management",
        "A secure cloud service provider will continuously educate their employees on cybersecurity measures, testing them regularly": "Cybersecurity Education",
        "A secure cloud service offering will document, report, and analyze security incidents to ensure regulatory compliance and continuous security improvement": "Incident Reporting",
        "A secure cloud service offering will monitor, log, and audit all important events, activity, and changes": "Monitoring, Logging, and Auditing",
        "A secure cloud service offering will have intentional, organized, universal guidance for how every information resource, including personnel, is secured": "Policy and Inventory",
        "A secure cloud service offering will define, maintain, and test incident response plan(s) and recovery capabilities to ensure minimal service disruption and data loss": "Recovery Planning",
        "A secure cloud service offering will follow FedRAMP encryption policies, continuously verify information resource integrity, and restrict access to third-party information resources": "Service Configuration",
        "A secure cloud service offering will understand, monitor, and manage supply chain risks from third-party information resources": "Third-Party Information Resources",
    }

    # Replace long descriptions with short names - use contains for partial matching
    if not aux.empty:
        for long_desc, short_name in ksi_short_names.items():
            mask = aux["REQUIREMENTS_DESCRIPTION"].str.contains(
                long_desc, na=False, regex=False
            )
            aux.loc[mask, "REQUIREMENTS_DESCRIPTION"] = short_name

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: fedramp_20x_ksi_low_gcp.py]---
Location: prowler-master/dashboard/compliance/fedramp_20x_ksi_low_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_containers_cis

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    # Shorten the long FedRAMP KSI descriptions for better display
    ksi_short_names = {
        "A secure cloud service offering will protect user data, control access, and apply zero trust principles": "Identity and Access Management",
        "A secure cloud service offering will use cloud native architecture and design principles to enforce and enhance the Confidentiality, Integrity and Availability of the system": "Cloud Native Architecture",
        "A secure cloud service provider will ensure that all system changes are properly documented and configuration baselines are updated accordingly": "Change Management",
        "A secure cloud service provider will continuously educate their employees on cybersecurity measures, testing them regularly": "Cybersecurity Education",
        "A secure cloud service offering will document, report, and analyze security incidents to ensure regulatory compliance and continuous security improvement": "Incident Reporting",
        "A secure cloud service offering will monitor, log, and audit all important events, activity, and changes": "Monitoring, Logging, and Auditing",
        "A secure cloud service offering will have intentional, organized, universal guidance for how every information resource, including personnel, is secured": "Policy and Inventory",
        "A secure cloud service offering will define, maintain, and test incident response plan(s) and recovery capabilities to ensure minimal service disruption and data loss": "Recovery Planning",
        "A secure cloud service offering will follow FedRAMP encryption policies, continuously verify information resource integrity, and restrict access to third-party information resources": "Service Configuration",
        "A secure cloud service offering will understand, monitor, and manage supply chain risks from third-party information resources": "Third-Party Information Resources",
    }

    # Replace long descriptions with short names - use contains for partial matching
    if not aux.empty:
        for long_desc, short_name in ksi_short_names.items():
            mask = aux["REQUIREMENTS_DESCRIPTION"].str.contains(
                long_desc, na=False, regex=False
            )
            aux.loc[mask, "REQUIREMENTS_DESCRIPTION"] = short_name

    return get_section_containers_cis(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_ATTRIBUTES_SECTION"
    )
```

--------------------------------------------------------------------------------

---[FILE: fedramp_low_revision_4_aws.py]---
Location: prowler-master/dashboard/compliance/fedramp_low_revision_4_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: fedramp_moderate_revision_4_aws.py]---
Location: prowler-master/dashboard/compliance/fedramp_moderate_revision_4_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: ffiec_aws.py]---
Location: prowler-master/dashboard/compliance/ffiec_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: gdpr_aws.py]---
Location: prowler-master/dashboard/compliance/gdpr_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format1

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format1(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: gxp_21_cfr_part_11_aws.py]---
Location: prowler-master/dashboard/compliance/gxp_21_cfr_part_11_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: gxp_eu_annex_11_aws.py]---
Location: prowler-master/dashboard/compliance/gxp_eu_annex_11_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format1

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format1(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: hipaa_aws.py]---
Location: prowler-master/dashboard/compliance/hipaa_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: hipaa_gcp.py]---
Location: prowler-master/dashboard/compliance/hipaa_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):

    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: iso27001_2013_aws.py]---
Location: prowler-master/dashboard/compliance/iso27001_2013_aws.py

```python
import warnings

from dashboard.common_methods import get_section_container_iso

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ATTRIBUTES_CATEGORY",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_NAME",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]
    return get_section_container_iso(
        aux, "REQUIREMENTS_ATTRIBUTES_CATEGORY", "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: iso27001_2022_aws.py]---
Location: prowler-master/dashboard/compliance/iso27001_2022_aws.py

```python
import warnings

from dashboard.common_methods import get_section_container_iso

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ATTRIBUTES_CATEGORY",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_NAME",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]
    return get_section_container_iso(
        aux, "REQUIREMENTS_ATTRIBUTES_CATEGORY", "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: iso27001_2022_azure.py]---
Location: prowler-master/dashboard/compliance/iso27001_2022_azure.py

```python
import warnings

from dashboard.common_methods import get_section_container_iso

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ATTRIBUTES_CATEGORY",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_NAME",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]
    return get_section_container_iso(
        aux, "REQUIREMENTS_ATTRIBUTES_CATEGORY", "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: iso27001_2022_gcp.py]---
Location: prowler-master/dashboard/compliance/iso27001_2022_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_container_iso

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ATTRIBUTES_CATEGORY",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_NAME",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]
    return get_section_container_iso(
        aux, "REQUIREMENTS_ATTRIBUTES_CATEGORY", "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: iso27001_2022_kubernetes.py]---
Location: prowler-master/dashboard/compliance/iso27001_2022_kubernetes.py

```python
import warnings

from dashboard.common_methods import get_section_container_iso

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ATTRIBUTES_CATEGORY",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_NAME",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]
    return get_section_container_iso(
        aux, "REQUIREMENTS_ATTRIBUTES_CATEGORY", "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: iso27001_2022_m365.py]---
Location: prowler-master/dashboard/compliance/iso27001_2022_m365.py

```python
import warnings

from dashboard.common_methods import get_section_container_iso

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ATTRIBUTES_CATEGORY",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID",
            "REQUIREMENTS_ATTRIBUTES_OBJETIVE_NAME",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]
    return get_section_container_iso(
        aux, "REQUIREMENTS_ATTRIBUTES_CATEGORY", "REQUIREMENTS_ATTRIBUTES_OBJETIVE_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: kisa_isms_p_2023_aws.py]---
Location: prowler-master/dashboard/compliance/kisa_isms_p_2023_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_3_levels

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ATTRIBUTES_DOMAIN",
            "REQUIREMENTS_ATTRIBUTES_SUBDOMAIN",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            # "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_3_levels(
        aux,
        "REQUIREMENTS_ATTRIBUTES_DOMAIN",
        "REQUIREMENTS_ATTRIBUTES_SUBDOMAIN",
        "REQUIREMENTS_ATTRIBUTES_SECTION",
    )
```

--------------------------------------------------------------------------------

---[FILE: kisa_isms_p_2023_korean_aws.py]---
Location: prowler-master/dashboard/compliance/kisa_isms_p_2023_korean_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_3_levels

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ATTRIBUTES_DOMAIN",
            "REQUIREMENTS_ATTRIBUTES_SUBDOMAIN",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            # "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_3_levels(
        aux,
        "REQUIREMENTS_ATTRIBUTES_DOMAIN",
        "REQUIREMENTS_ATTRIBUTES_SUBDOMAIN",
        "REQUIREMENTS_ATTRIBUTES_SECTION",
    )
```

--------------------------------------------------------------------------------

---[FILE: mitre_attack_aws.py]---
Location: prowler-master/dashboard/compliance/mitre_attack_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format4

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_NAME",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]

    return get_section_containers_format4(aux, "REQUIREMENTS_ID")
```

--------------------------------------------------------------------------------

---[FILE: mitre_attack_azure.py]---
Location: prowler-master/dashboard/compliance/mitre_attack_azure.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format4

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_NAME",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]

    return get_section_containers_format4(aux, "REQUIREMENTS_ID")
```

--------------------------------------------------------------------------------

---[FILE: mitre_attack_gcp.py]---
Location: prowler-master/dashboard/compliance/mitre_attack_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format2

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_SUBTECHNIQUES",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format2(
        aux, "REQUIREMENTS_ID", "REQUIREMENTS_SUBTECHNIQUES"
    )
```

--------------------------------------------------------------------------------

---[FILE: nis2_aws.py]---
Location: prowler-master/dashboard/compliance/nis2_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_3_levels

warnings.filterwarnings("ignore")


def get_table(data):
    data["REQUIREMENTS_DESCRIPTION"] = (
        data["REQUIREMENTS_ID"] + " - " + data["REQUIREMENTS_DESCRIPTION"]
    )

    data["REQUIREMENTS_DESCRIPTION"] = data["REQUIREMENTS_DESCRIPTION"].apply(
        lambda x: x[:150] + "..." if len(str(x)) > 150 else x
    )

    data["REQUIREMENTS_ATTRIBUTES_SECTION"] = data[
        "REQUIREMENTS_ATTRIBUTES_SECTION"
    ].apply(lambda x: x[:80] + "..." if len(str(x)) > 80 else x)

    data["REQUIREMENTS_ATTRIBUTES_SUBSECTION"] = data[
        "REQUIREMENTS_ATTRIBUTES_SUBSECTION"
    ].apply(lambda x: x[:150] + "..." if len(str(x)) > 150 else x)

    aux = data[
        [
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]

    return get_section_containers_3_levels(
        aux,
        "REQUIREMENTS_ATTRIBUTES_SECTION",
        "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
        "REQUIREMENTS_DESCRIPTION",
    )
```

--------------------------------------------------------------------------------

````
