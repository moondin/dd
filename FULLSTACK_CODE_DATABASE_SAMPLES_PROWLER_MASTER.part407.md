---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 407
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 407 of 867)

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

---[FILE: kms_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/kms/kms_service.py
Signals: Pydantic

```python
"""OCI Kms Service Module."""

from typing import Optional

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class Kms(OCIService):
    """OCI Kms Service class."""

    def __init__(self, provider):
        """Initialize the Kms service."""
        super().__init__("kms", provider)
        self.keys = []
        self.__threading_call__(self.__list_keys__)

    def __get_client__(self, region):
        """Get the Kms client for a region."""
        client_region = self.regional_clients.get(region)
        if client_region:
            return self._create_oci_client(oci.key_management.KmsVaultClient)
        return None

    def __list_keys__(self, regional_client):
        """List all keys."""
        try:
            vault_client = self.__get_client__(regional_client.region)
            if not vault_client:
                return

            logger.info(f"Kms - Listing keys in {regional_client.region}...")

            for compartment in self.audited_compartments:
                try:
                    # First, list all vaults in this compartment
                    vaults = oci.pagination.list_call_get_all_results(
                        vault_client.list_vaults, compartment_id=compartment.id
                    ).data

                    for vault in vaults:
                        # Only process vaults in ACTIVE state
                        if vault.lifecycle_state == "ACTIVE":
                            # Get the management endpoint for this vault
                            management_endpoint = vault.management_endpoint

                            # Create KMS management client for this vault's endpoint
                            # KmsManagementClient requires service_endpoint, so create it directly
                            if self.session_signer:
                                kms_management_client = (
                                    oci.key_management.KmsManagementClient(
                                        config=self.session_config,
                                        signer=self.session_signer,
                                        service_endpoint=management_endpoint,
                                    )
                                )
                            else:
                                kms_management_client = (
                                    oci.key_management.KmsManagementClient(
                                        config=self.session_config,
                                        service_endpoint=management_endpoint,
                                    )
                                )

                            # List keys in this vault
                            keys = oci.pagination.list_call_get_all_results(
                                kms_management_client.list_keys,
                                compartment_id=compartment.id,
                            ).data

                            for key_summary in keys:
                                if key_summary.lifecycle_state == "ENABLED":
                                    # Get full key details to get rotation info
                                    key_details = kms_management_client.get_key(
                                        key_id=key_summary.id
                                    ).data

                                    self.keys.append(
                                        Key(
                                            id=key_details.id,
                                            name=(
                                                key_details.display_name
                                                if hasattr(key_details, "display_name")
                                                else key_details.id
                                            ),
                                            compartment_id=compartment.id,
                                            region=regional_client.region,
                                            lifecycle_state=key_details.lifecycle_state,
                                            is_auto_rotation_enabled=(
                                                key_details.is_auto_rotation_enabled
                                                if hasattr(
                                                    key_details,
                                                    "is_auto_rotation_enabled",
                                                )
                                                else False
                                            ),
                                            rotation_interval_in_days=(
                                                key_details.auto_key_rotation_details.rotation_interval_in_days
                                                if hasattr(
                                                    key_details,
                                                    "auto_key_rotation_details",
                                                )
                                                and key_details.auto_key_rotation_details
                                                and hasattr(
                                                    key_details.auto_key_rotation_details,
                                                    "rotation_interval_in_days",
                                                )
                                                else None
                                            ),
                                        )
                                    )
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                    continue
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


# Service Models
class Key(BaseModel):
    """Key model."""

    id: str
    name: str
    compartment_id: str
    region: str
    lifecycle_state: str
    is_auto_rotation_enabled: bool = False
    rotation_interval_in_days: Optional[int] = None
```

--------------------------------------------------------------------------------

---[FILE: kms_key_rotation_enabled.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/kms/kms_key_rotation_enabled/kms_key_rotation_enabled.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "kms_key_rotation_enabled",
  "CheckTitle": "Ensure customer created Customer Managed Key (CMK) is rotated at least annually",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "kms",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:kms:resource",
  "Severity": "medium",
  "ResourceType": "OciKmsResource",
  "Description": "Customer Managed Keys should be rotated at least annually to reduce the risk of key compromise.",
  "Risk": "Not meeting this requirement increases security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-KMS/rotate-customer-managed-keys.html",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure customer created Customer Managed Key (CMK) is rotated at least annually",
      "Url": "https://hub.prowler.com/check/oci/kms_key_rotation_enabled"
    }
  },
  "Categories": [
    "security-configuration"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: kms_key_rotation_enabled.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/kms/kms_key_rotation_enabled/kms_key_rotation_enabled.py

```python
"""Check Ensure customer created Customer Managed Key (CMK) is rotated at least annually."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.kms.kms_client import kms_client


class kms_key_rotation_enabled(Check):
    """Check Ensure customer created Customer Managed Key (CMK) is rotated at least annually."""

    def execute(self) -> Check_Report_OCI:
        """Execute the kms_key_rotation_enabled check."""
        findings = []

        for key in kms_client.keys:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=key,
                region=key.region,
                resource_name=key.name,
                resource_id=key.id,
                compartment_id=key.compartment_id,
            )

            # Check if auto-rotation is enabled OR if rotation interval is set and <= 365 days
            if key.is_auto_rotation_enabled or (
                key.rotation_interval_in_days is not None
                and key.rotation_interval_in_days <= 365
            ):
                report.status = "PASS"
                report.status_extended = f"KMS key '{key.name}' has rotation enabled (auto-rotation: {key.is_auto_rotation_enabled}, interval: {key.rotation_interval_in_days} days)."
            else:
                report.status = "FAIL"
                report.status_extended = f"KMS key '{key.name}' does not have rotation enabled or rotation interval exceeds 365 days."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: logging_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/logging/logging_client.py

```python
"""OCI Logging Client Module."""

from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.logging.logging_service import Logging

logging_client = Logging(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: logging_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/logging/logging_service.py
Signals: Pydantic

```python
"""OCI Logging Service Module."""

from datetime import datetime
from typing import Optional

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class Logging(OCIService):
    """OCI Logging Service class to retrieve log groups and logs."""

    def __init__(self, provider):
        """
        Initialize the Logging service.

        Args:
            provider: The OCI provider instance
        """
        super().__init__("logging", provider)
        self.log_groups = []
        self.logs = []
        self.__threading_call_by_region_and_compartment__(self.__list_log_groups__)
        self.__threading_call_by_region_and_compartment__(self.__list_logs__)

    def __get_client__(self, region):
        """
        Get the Logging Management client for a region.

        Args:
            region: Region key

        Returns:
            Logging Management client instance
        """
        return self._create_oci_client(
            oci.logging.LoggingManagementClient, config_overrides={"region": region}
        )

    def __list_log_groups__(self, region, compartment):
        """
        List all log groups in a compartment and region.

        Args:
            region: OCIRegion object
            compartment: Compartment object
        """
        try:
            region_key = region.key if hasattr(region, "key") else str(region)
            logging_client = self.__get_client__(region_key)

            logger.info(
                f"Logging - Listing Log Groups in {region_key} - {compartment.name}..."
            )

            log_groups_data = oci.pagination.list_call_get_all_results(
                logging_client.list_log_groups, compartment_id=compartment.id
            ).data

            for log_group in log_groups_data:
                if log_group.lifecycle_state != "DELETED":
                    self.log_groups.append(
                        LogGroup(
                            id=log_group.id,
                            display_name=log_group.display_name,
                            description=(
                                log_group.description
                                if hasattr(log_group, "description")
                                and log_group.description
                                else None
                            ),
                            compartment_id=compartment.id,
                            time_created=log_group.time_created,
                            lifecycle_state=log_group.lifecycle_state,
                            region=region_key,
                        )
                    )

        except Exception as error:
            logger.error(
                f"{region_key if 'region_key' in locals() else region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def __list_logs__(self, region, compartment):
        """
        List all logs in a compartment and region.

        Args:
            region: OCIRegion object
            compartment: Compartment object
        """
        try:
            region_key = region.key if hasattr(region, "key") else str(region)
            logging_client = self.__get_client__(region_key)

            logger.info(
                f"Logging - Listing Logs in {region_key} - {compartment.name}..."
            )

            # Get all log groups in this compartment/region
            compartment_log_groups = [
                lg
                for lg in self.log_groups
                if lg.compartment_id == compartment.id and lg.region == region_key
            ]

            for log_group in compartment_log_groups:
                try:
                    logs_data = oci.pagination.list_call_get_all_results(
                        logging_client.list_logs, log_group_id=log_group.id
                    ).data

                    for log in logs_data:
                        if log.lifecycle_state != "DELETED":
                            # Extract configuration details
                            source_service = None
                            source_category = None
                            source_resource = None

                            if hasattr(log, "configuration") and log.configuration:
                                config = log.configuration
                                if hasattr(config, "source") and config.source:
                                    source = config.source
                                    source_service = getattr(source, "service", None)
                                    source_category = getattr(source, "category", None)
                                    source_resource = getattr(source, "resource", None)

                            self.logs.append(
                                Log(
                                    id=log.id,
                                    display_name=log.display_name,
                                    log_group_id=log_group.id,
                                    log_type=log.log_type,
                                    compartment_id=compartment.id,
                                    time_created=log.time_created,
                                    lifecycle_state=log.lifecycle_state,
                                    is_enabled=(
                                        log.is_enabled
                                        if hasattr(log, "is_enabled")
                                        else True
                                    ),
                                    source_service=source_service,
                                    source_category=source_category,
                                    source_resource=source_resource,
                                    region=region_key,
                                )
                            )
                except Exception as log_error:
                    logger.error(
                        f"Error listing logs for log group {log_group.id}: {log_error.__class__.__name__}[{log_error.__traceback__.tb_lineno}]: {log_error}"
                    )

        except Exception as error:
            logger.error(
                f"{region_key if 'region_key' in locals() else region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


# Service Models
class LogGroup(BaseModel):
    """OCI Log Group model."""

    id: str
    display_name: str
    description: Optional[str]
    compartment_id: str
    time_created: datetime
    lifecycle_state: str
    region: str


class Log(BaseModel):
    """OCI Log model."""

    id: str
    display_name: str
    log_group_id: str
    log_type: str
    compartment_id: str
    time_created: datetime
    lifecycle_state: str
    is_enabled: bool
    source_service: Optional[str]
    source_category: Optional[str]
    source_resource: Optional[str]
    region: str
```

--------------------------------------------------------------------------------

---[FILE: network_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.network.network_service import Network

network_client = Network(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: network_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_service.py
Signals: Pydantic

```python
"""OCI Network Service Module."""

from datetime import datetime
from typing import Optional

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class Network(OCIService):
    """OCI Network Service class to retrieve VCNs, security lists, and network security groups."""

    def __init__(self, provider):
        """
        Initialize the Network service.

        Args:
            provider: The OCI provider instance
        """
        super().__init__("network", provider)
        self.vcns = []
        self.security_lists = []
        self.network_security_groups = []
        self.subnets = []
        self.__threading_call_by_region_and_compartment__(self.__list_vcns__)
        self.__threading_call_by_region_and_compartment__(self.__list_security_lists__)
        self.__threading_call_by_region_and_compartment__(
            self.__list_network_security_groups__
        )
        self.__threading_call_by_region_and_compartment__(self.__list_subnets__)

    def __get_client__(self, region):
        """
        Get the VirtualNetwork client for a region.

        Args:
            region: Region key

        Returns:
            VirtualNetwork client instance
        """
        return self._create_oci_client(
            oci.core.VirtualNetworkClient, config_overrides={"region": region}
        )

    def __list_vcns__(self, region, compartment):
        """
        List all VCNs in a compartment and region.

        Args:
            region: OCIRegion object
            compartment: Compartment object
        """
        try:
            region_key = region.key if hasattr(region, "key") else str(region)
            vcn_client = self.__get_client__(region_key)

            logger.info(
                f"Network - Listing VCNs in {region_key} - {compartment.name}..."
            )

            vcns_data = oci.pagination.list_call_get_all_results(
                vcn_client.list_vcns, compartment_id=compartment.id
            ).data

            for vcn in vcns_data:
                if vcn.lifecycle_state != "TERMINATED":
                    # Get default security list
                    default_security_list_id = vcn.default_security_list_id

                    self.vcns.append(
                        VCN(
                            id=vcn.id,
                            display_name=(
                                vcn.display_name if hasattr(vcn, "display_name") else ""
                            ),
                            compartment_id=compartment.id,
                            cidr_blocks=(
                                vcn.cidr_blocks if hasattr(vcn, "cidr_blocks") else []
                            ),
                            lifecycle_state=vcn.lifecycle_state,
                            default_security_list_id=default_security_list_id,
                            region=region_key,
                            time_created=vcn.time_created,
                        )
                    )
        except Exception as error:
            logger.error(
                f"{region_key} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def __list_security_lists__(self, region, compartment):
        """
        List all security lists in a compartment and region.

        Args:
            region: OCIRegion object
            compartment: Compartment object
        """
        try:
            region_key = region.key if hasattr(region, "key") else str(region)
            vcn_client = self.__get_client__(region_key)

            logger.info(
                f"Network - Listing Security Lists in {region_key} - {compartment.name}..."
            )

            security_lists_data = oci.pagination.list_call_get_all_results(
                vcn_client.list_security_lists, compartment_id=compartment.id
            ).data

            for sec_list in security_lists_data:
                if sec_list.lifecycle_state != "TERMINATED":
                    # Check if this is a default security list
                    is_default = False
                    vcn_id = sec_list.vcn_id
                    for vcn in self.vcns:
                        if (
                            vcn.id == vcn_id
                            and vcn.default_security_list_id == sec_list.id
                        ):
                            is_default = True
                            break

                    # Convert OCI SDK objects to dict for JSON serialization
                    ingress_rules = [
                        oci.util.to_dict(rule)
                        for rule in (sec_list.ingress_security_rules or [])
                    ]
                    egress_rules = [
                        oci.util.to_dict(rule)
                        for rule in (sec_list.egress_security_rules or [])
                    ]

                    self.security_lists.append(
                        SecurityList(
                            id=sec_list.id,
                            display_name=(
                                sec_list.display_name
                                if hasattr(sec_list, "display_name")
                                else ""
                            ),
                            compartment_id=compartment.id,
                            vcn_id=sec_list.vcn_id,
                            ingress_security_rules=ingress_rules,
                            egress_security_rules=egress_rules,
                            lifecycle_state=sec_list.lifecycle_state,
                            is_default=is_default,
                            region=region_key,
                            time_created=sec_list.time_created,
                        )
                    )
        except Exception as error:
            logger.error(
                f"{region_key} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def __list_network_security_groups__(self, region, compartment):
        """
        List all network security groups in a compartment and region.

        Args:
            region: OCIRegion object
            compartment: Compartment object
        """
        try:
            region_key = region.key if hasattr(region, "key") else str(region)
            vcn_client = self.__get_client__(region_key)

            logger.info(
                f"Network - Listing Network Security Groups in {region_key} - {compartment.name}..."
            )

            nsgs_data = oci.pagination.list_call_get_all_results(
                vcn_client.list_network_security_groups, compartment_id=compartment.id
            ).data

            for nsg in nsgs_data:
                if nsg.lifecycle_state != "TERMINATED":
                    # Get NSG rules
                    try:
                        nsg_rules_data = oci.pagination.list_call_get_all_results(
                            vcn_client.list_network_security_group_security_rules,
                            network_security_group_id=nsg.id,
                        ).data
                        # Convert OCI SDK objects to dict for JSON serialization
                        nsg_rules = [oci.util.to_dict(rule) for rule in nsg_rules_data]
                    except Exception:
                        nsg_rules = []

                    self.network_security_groups.append(
                        NetworkSecurityGroup(
                            id=nsg.id,
                            display_name=(
                                nsg.display_name if hasattr(nsg, "display_name") else ""
                            ),
                            compartment_id=compartment.id,
                            vcn_id=nsg.vcn_id,
                            security_rules=nsg_rules,
                            lifecycle_state=nsg.lifecycle_state,
                            region=region_key,
                            time_created=nsg.time_created,
                        )
                    )
        except Exception as error:
            logger.error(
                f"{region_key} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def __list_subnets__(self, region, compartment):
        """
        List all subnets in a compartment and region.

        Args:
            region: OCIRegion object
            compartment: Compartment object
        """
        try:
            region_key = region.key if hasattr(region, "key") else str(region)
            vcn_client = self.__get_client__(region_key)

            logger.info(
                f"Network - Listing Subnets in {region_key} - {compartment.name}..."
            )

            subnets_data = oci.pagination.list_call_get_all_results(
                vcn_client.list_subnets, compartment_id=compartment.id
            ).data

            for subnet in subnets_data:
                if subnet.lifecycle_state != "TERMINATED":
                    self.subnets.append(
                        Subnet(
                            id=subnet.id,
                            display_name=(
                                subnet.display_name
                                if hasattr(subnet, "display_name")
                                else ""
                            ),
                            compartment_id=compartment.id,
                            vcn_id=subnet.vcn_id,
                            cidr_block=(
                                subnet.cidr_block
                                if hasattr(subnet, "cidr_block")
                                else ""
                            ),
                            lifecycle_state=subnet.lifecycle_state,
                            region=region_key,
                            time_created=subnet.time_created,
                        )
                    )
        except Exception as error:
            logger.error(
                f"{region_key} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


# Service Models
class VCN(BaseModel):
    """OCI VCN model."""

    id: str
    display_name: str
    compartment_id: str
    cidr_blocks: list[str]
    lifecycle_state: str
    default_security_list_id: Optional[str]
    region: str
    time_created: datetime


class SecurityList(BaseModel):
    """OCI Security List model."""

    id: str
    display_name: str
    compartment_id: str
    vcn_id: str
    ingress_security_rules: list
    egress_security_rules: list
    lifecycle_state: str
    is_default: bool = False
    region: str
    time_created: datetime

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {object: lambda v: str(v)}


class NetworkSecurityGroup(BaseModel):
    """OCI Network Security Group model."""

    id: str
    display_name: str
    compartment_id: str
    vcn_id: str
    security_rules: list
    lifecycle_state: str
    region: str
    time_created: datetime

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {object: lambda v: str(v)}


class Subnet(BaseModel):
    """OCI Subnet model."""

    id: str
    display_name: str
    compartment_id: str
    vcn_id: str
    cidr_block: str
    lifecycle_state: str
    region: str
    time_created: datetime
```

--------------------------------------------------------------------------------

---[FILE: network_default_security_list_restricts_traffic.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_default_security_list_restricts_traffic/network_default_security_list_restricts_traffic.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "network_default_security_list_restricts_traffic",
  "CheckTitle": "Ensure the default security list of every VCN restricts all traffic except ICMP",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:network:securitylist",
  "Severity": "high",
  "ResourceType": "OciNetworkSecurityList",
  "Description": "Ensure the default security list of every VCN restricts all traffic except ICMP within VCN. A default security list is automatically created when you create a VCN. It is recommended that the default security list restrict all traffic except for ICMP within the VCN.",
  "Risk": "The default security list should not be used for any purpose other than as a fail-safe. It is recommended to create custom security lists for your resources.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/securitylists.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci network security-list update --security-list-id <default-security-list-ocid> --ingress-security-rules <restricted-rules-json> --egress-security-rules <restricted-rules-json>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-Networking/restrict-traffic-for-default-security-lists.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure the default security list to restrict all traffic except ICMP within the VCN. Create custom security lists for your resources.",
      "Url": "https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/securitylists.htm"
    }
  },
  "Categories": [
    "network-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: network_default_security_list_restricts_traffic.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_default_security_list_restricts_traffic/network_default_security_list_restricts_traffic.py

```python
"""Check if default security list restricts all traffic except ICMP within VCN."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.network.network_client import network_client


class network_default_security_list_restricts_traffic(Check):
    """Check if default security list restricts all traffic except ICMP within VCN."""

    def execute(self) -> Check_Report_OCI:
        """Execute the network_default_security_list_restricts_traffic check.

        Returns:
            List of Check_Report_OCI objects with findings
        """
        findings = []

        for security_list in network_client.security_lists:
            # Only check default security lists
            if security_list.is_default:
                report = Check_Report_OCI(
                    metadata=self.metadata(),
                    resource=security_list,
                    region=security_list.region,
                    resource_name=security_list.display_name,
                    resource_id=security_list.id,
                    compartment_id=security_list.compartment_id,
                )

                # Check if default security list has overly permissive rules
                has_permissive_rules = False
                permissive_rule_details = []

                # Check ingress rules
                for rule in security_list.ingress_security_rules:
                    source = rule.get("source")
                    protocol = rule.get("protocol")

                    # Protocol 1 is ICMP, which is allowed within VCN
                    if protocol == "1":
                        continue

                    # Check if source is from internet (0.0.0.0/0)
                    if source == "0.0.0.0/0":
                        has_permissive_rules = True
                        permissive_rule_details.append(
                            f"ingress from 0.0.0.0/0 with protocol {protocol}"
                        )
                    # Check if source is not within VCN CIDR (should only allow VCN traffic)
                    # For simplicity, we flag any non-ICMP rule as potentially permissive
                    # In production, you'd want to compare against the VCN CIDR blocks
                    elif protocol and protocol != "1":
                        # Get VCN CIDR blocks to validate
                        vcn = None
                        for v in network_client.vcns:
                            if v.id == security_list.vcn_id:
                                vcn = v
                                break

                        if vcn:
                            # Check if source is within VCN CIDR
                            is_within_vcn = False
                            for cidr in vcn.cidr_blocks:
                                if source and source.startswith(cidr.split("/")[0]):
                                    is_within_vcn = True
                                    break

                            if not is_within_vcn:
                                has_permissive_rules = True
                                permissive_rule_details.append(
                                    f"ingress from {source} with protocol {protocol}"
                                )

                # Check egress rules - should also be restricted
                for rule in security_list.egress_security_rules:
                    destination = rule.get("destination")
                    protocol = rule.get("protocol")

                    # Protocol 1 is ICMP, which is allowed within VCN
                    if protocol == "1":
                        continue

                    # Check if destination is to internet (0.0.0.0/0) for non-ICMP
                    if destination == "0.0.0.0/0" and protocol and protocol != "1":
                        has_permissive_rules = True
                        permissive_rule_details.append(
                            f"egress to 0.0.0.0/0 with protocol {protocol}"
                        )

                if has_permissive_rules:
                    report.status = "FAIL"
                    report.status_extended = f"Default security list {security_list.display_name} has permissive rules: {', '.join(permissive_rule_details)}."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Default security list {security_list.display_name} restricts all traffic except ICMP within VCN."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_security_group_ingress_from_internet_to_rdp_port.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_security_group_ingress_from_internet_to_rdp_port/network_security_group_ingress_from_internet_to_rdp_port.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "network_security_group_ingress_from_internet_to_rdp_port",
  "CheckTitle": "Ensure no network security groups allow ingress from 0.0.0.0/0 to port 3389",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:network:vcn",
  "Severity": "high",
  "ResourceType": "OciVcn",
  "Description": "Network security groups should not allow unrestricted RDP access from the internet.",
  "Risk": "Not meeting this network security requirement increases risk of unauthorized access.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Network/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-Networking/unrestricted-rdp-access-via-nsgs.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure no network security groups allow ingress from 0.0.0.0/0 to port 3389",
      "Url": "https://hub.prowler.com/check/oci/network_security_group_ingress_from_internet_to_rdp_port"
    }
  },
  "Categories": [
    "network-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
