---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 397
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 397 of 867)

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

---[FILE: network_vpc_subnet_enable_dhcp.metadata.json]---
Location: prowler-master/prowler/providers/nhn/services/network/network_vpc_subnet_enable_dhcp/network_vpc_subnet_enable_dhcp.metadata.json

```json
{
  "Provider": "nhn",
  "CheckID": "network_vpc_subnet_enable_dhcp",
  "CheckTitle": "Check if DHCP is enabled for subnets in VPC",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "VPC",
  "Description": "Check if DHCP is enabled for the subnets in the VPC.",
  "Risk": "",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that DHCP is enabled for all subnets where automatic IP address allocation is needed.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: network_vpc_subnet_enable_dhcp.py]---
Location: prowler-master/prowler/providers/nhn/services/network/network_vpc_subnet_enable_dhcp/network_vpc_subnet_enable_dhcp.py

```python
from prowler.lib.check.models import Check, CheckReportNHN
from prowler.providers.nhn.services.network.network_client import network_client


class network_vpc_subnet_enable_dhcp(Check):
    def execute(self):
        findings = []
        for network in network_client.networks:
            for subnet in network.subnets:
                report = CheckReportNHN(
                    metadata=self.metadata(),
                    resource=network,
                )
                report.status = "PASS"
                report.status_extended = f"VPC {network.name} Subnet {subnet.name} does not have DHCP enabled."
                if subnet.enable_dhcp:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"VPC {network.name} Subnet {subnet.name} has DHCP enabled."
                    )
                findings.append(report)

            return findings
```

--------------------------------------------------------------------------------

---[FILE: network_vpc_subnet_has_external_router.metadata.json]---
Location: prowler-master/prowler/providers/nhn/services/network/network_vpc_subnet_has_external_router/network_vpc_subnet_has_external_router.metadata.json

```json
{
  "Provider": "nhn",
  "CheckID": "network_vpc_subnet_has_external_router",
  "CheckTitle": "Check for External Router in NHN VPC Subnet",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "VPC",
  "Description": "Checks if VPC allows access from the public internet, by verifying if an external router is configured.",
  "Risk": "",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review the external router settings for the VPC Subnet.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: network_vpc_subnet_has_external_router.py]---
Location: prowler-master/prowler/providers/nhn/services/network/network_vpc_subnet_has_external_router/network_vpc_subnet_has_external_router.py

```python
from prowler.lib.check.models import Check, CheckReportNHN
from prowler.providers.nhn.services.network.network_client import network_client


class network_vpc_subnet_has_external_router(Check):
    def execute(self):
        findings = []
        for network in network_client.networks:
            for subnet in network.subnets:
                report = CheckReportNHN(
                    metadata=self.metadata(),
                    resource=network,
                )
                report.status = "PASS"
                report.status_extended = f"VPC {network.name} Subnet {subnet.name} does not have an external router."
                if subnet.external_router:
                    report.status = "FAIL"
                    report.status_extended = f"VPC {network.name} Subnet {subnet.name} has an external router."
                findings.append(report)

            return findings
```

--------------------------------------------------------------------------------

---[FILE: config.py]---
Location: prowler-master/prowler/providers/oraclecloud/config.py

```python
"""OCI Provider Configuration Constants"""

# Default OCI Configuration
OCI_DEFAULT_CONFIG_FILE = "~/.oci/config"
OCI_DEFAULT_PROFILE = "DEFAULT"

# OCI Session Configuration
OCI_MAX_RETRIES = 3
OCI_TIMEOUT = 60

# OCI User Agent
OCI_USER_AGENT = "Prowler"

# OCI Regions - Commercial Regions
OCI_COMMERCIAL_REGIONS = {
    "ap-chuncheon-1": "South Korea Central (Chuncheon)",
    "ap-hyderabad-1": "India West (Hyderabad)",
    "ap-melbourne-1": "Australia Southeast (Melbourne)",
    "ap-mumbai-1": "India West (Mumbai)",
    "ap-osaka-1": "Japan Central (Osaka)",
    "ap-seoul-1": "South Korea North (Seoul)",
    "ap-singapore-1": "Singapore (Singapore)",
    "ap-sydney-1": "Australia East (Sydney)",
    "ap-tokyo-1": "Japan East (Tokyo)",
    "ca-montreal-1": "Canada Southeast (Montreal)",
    "ca-toronto-1": "Canada Southeast (Toronto)",
    "eu-amsterdam-1": "Netherlands Northwest (Amsterdam)",
    "eu-frankfurt-1": "Germany Central (Frankfurt)",
    "eu-madrid-1": "Spain Central (Madrid)",
    "eu-marseille-1": "France South (Marseille)",
    "eu-milan-1": "Italy Northwest (Milan)",
    "eu-paris-1": "France Central (Paris)",
    "eu-stockholm-1": "Sweden Central (Stockholm)",
    "eu-zurich-1": "Switzerland North (Zurich)",
    "il-jerusalem-1": "Israel Central (Jerusalem)",
    "me-abudhabi-1": "UAE East (Abu Dhabi)",
    "me-dubai-1": "UAE East (Dubai)",
    "me-jeddah-1": "Saudi Arabia West (Jeddah)",
    "mx-monterrey-1": "Mexico Northeast (Monterrey)",
    "mx-queretaro-1": "Mexico Central (Queretaro)",
    "sa-bogota-1": "Colombia (Bogota)",
    "sa-santiago-1": "Chile (Santiago)",
    "sa-saopaulo-1": "Brazil East (Sao Paulo)",
    "sa-valparaiso-1": "Chile West (Valparaiso)",
    "sa-vinhedo-1": "Brazil Southeast (Vinhedo)",
    "uk-cardiff-1": "UK West (Cardiff)",
    "uk-london-1": "UK South (London)",
    "us-ashburn-1": "US East (Ashburn)",
    "us-chicago-1": "US East (Chicago)",
    "us-phoenix-1": "US West (Phoenix)",
    "us-sanjose-1": "US West (San Jose)",
}

# OCI Government Regions
OCI_GOVERNMENT_REGIONS = {
    "us-langley-1": "US Gov West",
    "us-luke-1": "US Gov East",
}

# All OCI Regions
OCI_REGIONS = {**OCI_COMMERCIAL_REGIONS, **OCI_GOVERNMENT_REGIONS}
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/providers/oraclecloud/models.py

```python
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from prowler.config.config import output_file_timestamp
from prowler.providers.common.models import ProviderOutputOptions


@dataclass
class OCICredentials:
    """OCI Credentials model"""

    user: str
    fingerprint: str
    key_file: Optional[str]
    key_content: Optional[str]
    tenancy: str
    region: str
    pass_phrase: Optional[str] = None


@dataclass
class OCIIdentityInfo:
    """OCI Identity Information model"""

    tenancy_id: str
    tenancy_name: str
    user_id: str
    region: str
    profile: Optional[str]
    audited_regions: set
    audited_compartments: list


@dataclass
class OCICompartment:
    """OCI Compartment model"""

    id: str
    name: str
    lifecycle_state: str
    time_created: datetime
    description: Optional[str] = None
    freeform_tags: Optional[dict] = None
    defined_tags: Optional[dict] = None


@dataclass
class OCISession:
    """OCI Session model to store configuration and signer"""

    config: dict
    signer: object
    profile: Optional[str] = None


@dataclass
class OCIRegion:
    """OCI Region model"""

    key: str
    name: str
    is_home_region: bool = False


@dataclass
class OCIRegionalClient:
    """OCI Regional Client wrapper model"""

    client: object
    region: str


class OCIOutputOptions(ProviderOutputOptions):
    """OCI Output Options model"""

    def __init__(self, arguments, bulk_checks_metadata, identity):
        # First call Provider_Output_Options init
        super().__init__(arguments, bulk_checks_metadata)

        # Check if custom output filename was input, if not, set the default
        if (
            not hasattr(arguments, "output_filename")
            or arguments.output_filename is None
        ):
            # Use tenancy name if available, otherwise fall back to tenancy ID
            tenancy_identifier = (
                identity.tenancy_name
                if identity.tenancy_name and identity.tenancy_name != "unknown"
                else identity.tenancy_id
            )
            self.output_filename = (
                f"prowler-output-{tenancy_identifier}-{output_file_timestamp}"
            )
        else:
            self.output_filename = arguments.output_filename
```

--------------------------------------------------------------------------------

````
