---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 408
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 408 of 867)

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

---[FILE: network_security_group_ingress_from_internet_to_rdp_port.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_security_group_ingress_from_internet_to_rdp_port/network_security_group_ingress_from_internet_to_rdp_port.py

```python
"""Check Ensure no network security groups allow ingress from 0.0.0.0/0 to port 3389."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.network.network_client import network_client


class network_security_group_ingress_from_internet_to_rdp_port(Check):
    """Check Ensure no network security groups allow ingress from 0.0.0.0/0 to port 3389."""

    def execute(self) -> Check_Report_OCI:
        """Execute the network_security_group_ingress_from_internet_to_rdp_port check."""
        findings = []

        for nsg in network_client.network_security_groups:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=nsg,
                region=nsg.region,
                resource_name=nsg.display_name,
                resource_id=nsg.id,
                compartment_id=nsg.compartment_id,
            )

            # Check NSG rules for 0.0.0.0/0 to port 3389
            has_rdp_from_internet = False
            for rule in nsg.security_rules:
                if (
                    rule.get("direction") == "INGRESS"
                    and rule.get("source") == "0.0.0.0/0"
                ):
                    protocol = rule.get("protocol")
                    # Protocol 6 is TCP
                    if protocol == "6":
                        tcp_options = rule.get("tcp_options")
                        # If tcp_options is None, all TCP ports are allowed
                        if not tcp_options:
                            has_rdp_from_internet = True
                            break
                        # If tcp_options exists, check destination port range
                        dst_port = tcp_options.get("destination_port_range")
                        if dst_port:
                            port_min = dst_port.get("min", 0)
                            port_max = dst_port.get("max", 0)
                            if port_min <= 3389 <= port_max:
                                has_rdp_from_internet = True
                                break
                        # If no destination port range specified, all ports are allowed
                        else:
                            has_rdp_from_internet = True
                            break
                    # Protocol "all" or if protocol is not specified
                    elif protocol == "all" or not protocol:
                        has_rdp_from_internet = True
                        break

            if has_rdp_from_internet:
                report.status = "FAIL"
                report.status_extended = f"Network security group {nsg.display_name} allows ingress from 0.0.0.0/0 to port 3389 (RDP)."
            else:
                report.status = "PASS"
                report.status_extended = f"Network security group {nsg.display_name} does not ingress from 0.0.0.0/0 to port 3389 (RDP)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_security_group_ingress_from_internet_to_ssh_port.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_security_group_ingress_from_internet_to_ssh_port/network_security_group_ingress_from_internet_to_ssh_port.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "network_security_group_ingress_from_internet_to_ssh_port",
  "CheckTitle": "Ensure no network security groups allow ingress from 0.0.0.0/0 to port 22",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:network:networksecuritygroup",
  "Severity": "high",
  "ResourceType": "OciNetworkSecurityGroup",
  "Description": "Ensure no network security groups allow ingress from 0.0.0.0/0 to port 22. Network security groups provide stateful or stateless filtering of ingress and egress network traffic to OCI resources.",
  "Risk": "Removing unfettered connectivity to remote console services, such as SSH, reduces a server's exposure to risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/networksecuritygroups.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci network nsg rules update --nsg-id <nsg-ocid> --security-rules <updated-rules-json>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-Networking/unrestricted-ssh-access-via-nsgs.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Update network security groups to remove ingress rules allowing access from 0.0.0.0/0 to port 22. Restrict SSH access to known IP addresses.",
      "Url": "https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/networksecuritygroups.htm"
    }
  },
  "Categories": [
    "internet-exposed",
    "network-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: network_security_group_ingress_from_internet_to_ssh_port.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_security_group_ingress_from_internet_to_ssh_port/network_security_group_ingress_from_internet_to_ssh_port.py

```python
"""Check if network security groups allow ingress from 0.0.0.0/0 to port 22."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.network.network_client import network_client


class network_security_group_ingress_from_internet_to_ssh_port(Check):
    """Check if network security groups allow ingress from 0.0.0.0/0 to port 22."""

    def execute(self) -> Check_Report_OCI:
        """Execute the network_security_group_ingress_from_internet_to_ssh_port check.

        Returns:
            List of Check_Report_OCI objects with findings
        """
        findings = []

        for nsg in network_client.network_security_groups:
            has_public_ssh_access = False

            # Check security rules for public SSH access
            for rule in nsg.security_rules:
                if (
                    rule.get("direction") == "INGRESS"
                    and rule.get("source") == "0.0.0.0/0"
                ):
                    protocol = rule.get("protocol")
                    # Protocol 6 is TCP
                    if protocol == "6":
                        tcp_options = rule.get("tcp_options")
                        # If tcp_options is None, all TCP ports are allowed
                        if not tcp_options:
                            has_public_ssh_access = True
                            break
                        # If tcp_options exists, check destination port range
                        dst_port = tcp_options.get("destination_port_range")
                        if dst_port:
                            port_min = dst_port.get("min", 0)
                            port_max = dst_port.get("max", 0)
                            if port_min <= 22 <= port_max:
                                has_public_ssh_access = True
                                break
                        # If no destination port range specified, all ports are allowed
                        else:
                            has_public_ssh_access = True
                            break
                    # Protocol "all" or if protocol is not specified
                    elif protocol == "all" or not protocol:
                        has_public_ssh_access = True
                        break

            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=nsg,
                region=nsg.region,
                resource_name=nsg.display_name,
                resource_id=nsg.id,
                compartment_id=nsg.compartment_id,
            )

            if has_public_ssh_access:
                report.status = "FAIL"
                report.status_extended = f"Network security group {nsg.display_name} allows ingress from 0.0.0.0/0 to port 22 (SSH)."
            else:
                report.status = "PASS"
                report.status_extended = f"Network security group {nsg.display_name} does not allow ingress from 0.0.0.0/0 to port 22 (SSH)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_security_list_ingress_from_internet_to_rdp_port.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_security_list_ingress_from_internet_to_rdp_port/network_security_list_ingress_from_internet_to_rdp_port.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "network_security_list_ingress_from_internet_to_rdp_port",
  "CheckTitle": "Ensure no security lists allow ingress from 0.0.0.0/0 to port 3389",
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
  "Description": "Security lists should not allow unrestricted RDP access from the internet.",
  "Risk": "Not meeting this network security requirement increases risk of unauthorized access.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Network/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-Networking/unrestricted-rdp-access.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure no security lists allow ingress from 0.0.0.0/0 to port 3389",
      "Url": "https://hub.prowler.com/check/oci/network_security_list_ingress_from_internet_to_rdp_port"
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

---[FILE: network_security_list_ingress_from_internet_to_rdp_port.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_security_list_ingress_from_internet_to_rdp_port/network_security_list_ingress_from_internet_to_rdp_port.py

```python
"""Check Ensure no security lists allow ingress from 0.0.0.0/0 to port 3389."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.network.network_client import network_client


class network_security_list_ingress_from_internet_to_rdp_port(Check):
    """Check Ensure no security lists allow ingress from 0.0.0.0/0 to port 3389."""

    def execute(self) -> Check_Report_OCI:
        """Execute the network_security_list_ingress_from_internet_to_rdp_port check."""
        findings = []

        for security_list in network_client.security_lists:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=security_list,
                region=security_list.region,
                resource_name=security_list.display_name,
                resource_id=security_list.id,
                compartment_id=security_list.compartment_id,
            )

            # Check ingress rules for 0.0.0.0/0 to port 3389
            has_rdp_from_internet = False
            for rule in security_list.ingress_security_rules:
                if rule.get("source") == "0.0.0.0/0":
                    protocol = rule.get("protocol")
                    # Protocol 6 is TCP
                    if protocol == "6":
                        tcp_options = rule.get("tcp_options")
                        # If tcp_options is None, all TCP ports are allowed
                        if not tcp_options:
                            has_rdp_from_internet = True
                            break
                        # If tcp_options exists, check destination port range
                        dst_port = tcp_options.get("destination_port_range")
                        if dst_port:
                            port_min = dst_port.get("min", 0)
                            port_max = dst_port.get("max", 0)
                            if port_min <= 3389 <= port_max:
                                has_rdp_from_internet = True
                                break
                        # If no destination port range specified, all ports are allowed
                        else:
                            has_rdp_from_internet = True
                            break
                    # Protocol "all" or if protocol is not specified
                    elif protocol == "all" or not protocol:
                        has_rdp_from_internet = True
                        break

            if has_rdp_from_internet:
                report.status = "FAIL"
                report.status_extended = f"Security list {security_list.display_name} allows ingress from 0.0.0.0/0 to port 3389 (RDP)."
            else:
                report.status = "PASS"
                report.status_extended = f"Security list {security_list.display_name} does not allow ingress from 0.0.0.0/0 to port 3389 (RDP)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_security_list_ingress_from_internet_to_ssh_port.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_security_list_ingress_from_internet_to_ssh_port/network_security_list_ingress_from_internet_to_ssh_port.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "network_security_list_ingress_from_internet_to_ssh_port",
  "CheckTitle": "Ensure no security lists allow ingress from 0.0.0.0/0 to port 22",
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
  "Description": "Ensure no security lists allow ingress from 0.0.0.0/0 to port 22. Security lists provide stateful or stateless filtering of ingress and egress network traffic to OCI resources.",
  "Risk": "Removing unfettered connectivity to remote console services, such as SSH, reduces a server's exposure to risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/securitylists.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-Networking/unrestricted-ssh-access.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Update security lists to remove ingress rules allowing access from 0.0.0.0/0 to port 22. Restrict SSH access to known IP addresses.",
      "Url": "https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/securitylists.htm"
    }
  },
  "Categories": [
    "internet-exposed",
    "network-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: network_security_list_ingress_from_internet_to_ssh_port.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_security_list_ingress_from_internet_to_ssh_port/network_security_list_ingress_from_internet_to_ssh_port.py

```python
"""Check if security lists allow ingress from 0.0.0.0/0 to port 22."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.network.network_client import network_client


class network_security_list_ingress_from_internet_to_ssh_port(Check):
    """Check if security lists allow ingress from 0.0.0.0/0 to port 22."""

    def execute(self) -> Check_Report_OCI:
        """Execute the network_security_list_ingress_from_internet_to_ssh_port check.

        Returns:
            List of Check_Report_OCI objects with findings
        """
        findings = []

        for security_list in network_client.security_lists:
            has_public_ssh_access = False

            # Check ingress rules for public SSH access
            for rule in security_list.ingress_security_rules:
                if rule.get("source") == "0.0.0.0/0":
                    protocol = rule.get("protocol")
                    # Protocol 6 is TCP
                    if protocol == "6":
                        tcp_options = rule.get("tcp_options")
                        # If tcp_options is None, all TCP ports are allowed
                        if not tcp_options:
                            has_public_ssh_access = True
                            break
                        # If tcp_options exists, check destination port range
                        dst_port = tcp_options.get("destination_port_range")
                        if dst_port:
                            port_min = dst_port.get("min", 0)
                            port_max = dst_port.get("max", 0)
                            if port_min <= 22 <= port_max:
                                has_public_ssh_access = True
                                break
                        # If no destination port range specified, all ports are allowed
                        else:
                            has_public_ssh_access = True
                            break
                    # Protocol "all" or if protocol is not specified
                    elif protocol == "all" or not protocol:
                        has_public_ssh_access = True
                        break

            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=security_list,
                region=security_list.region,
                resource_name=security_list.display_name,
                resource_id=security_list.id,
                compartment_id=security_list.compartment_id,
            )

            if has_public_ssh_access:
                report.status = "FAIL"
                report.status_extended = f"Security list {security_list.display_name} allows ingress from 0.0.0.0/0 to port 22 (SSH)."
            else:
                report.status = "PASS"
                report.status_extended = f"Security list {security_list.display_name} does not allow ingress from 0.0.0.0/0 to port 22 (SSH)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_vcn_subnet_flow_logs_enabled.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_vcn_subnet_flow_logs_enabled/network_vcn_subnet_flow_logs_enabled.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "network_vcn_subnet_flow_logs_enabled",
  "CheckTitle": "Ensure VCN flow logging is enabled for all subnets",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:network:subnet",
  "Severity": "medium",
  "ResourceType": "OciSubnet",
  "Description": "VCN flow logging should be enabled for all subnets.",
  "Risk": "Not meeting this network security requirement increases risk of unauthorized access.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Network/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-Networking/enable-flow-logging.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure VCN flow logging is enabled for all subnets",
      "Url": "https://hub.prowler.com/check/oci/network_vcn_subnet_flow_logs_enabled"
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

---[FILE: network_vcn_subnet_flow_logs_enabled.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/network/network_vcn_subnet_flow_logs_enabled/network_vcn_subnet_flow_logs_enabled.py

```python
"""Check Ensure VCN flow logging is enabled for all subnets."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.logging.logging_client import logging_client
from prowler.providers.oraclecloud.services.network.network_client import network_client


class network_vcn_subnet_flow_logs_enabled(Check):
    """Check Ensure VCN flow logging is enabled for all subnets."""

    def execute(self) -> Check_Report_OCI:
        """Execute the network_vcn_subnet_flow_logs_enabled check."""
        findings = []

        for subnet in network_client.subnets:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=subnet,
                region=subnet.region,
                resource_name=subnet.display_name,
                resource_id=subnet.id,
                compartment_id=subnet.compartment_id,
            )

            # Check if subnet has flow logs enabled (either at VCN or subnet level)
            has_flow_logs = False

            # Check for VCN-level flow logs
            for log in logging_client.logs:
                if (
                    log.source_service == "flowlogs"
                    and log.source_resource
                    and subnet.vcn_id in log.source_resource
                    and log.region == subnet.region
                    and log.is_enabled
                ):
                    has_flow_logs = True
                    break

            # If no VCN-level logs, check for subnet-level flow logs
            if not has_flow_logs:
                for log in logging_client.logs:
                    if (
                        log.source_service == "flowlogs"
                        and log.source_resource
                        and subnet.id in log.source_resource
                        and log.region == subnet.region
                        and log.is_enabled
                    ):
                        has_flow_logs = True
                        break

            if has_flow_logs:
                report.status = "PASS"
                report.status_extended = (
                    f"Subnet {subnet.display_name} has flow logging enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Subnet {subnet.display_name} does not have flow logging enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: objectstorage_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/objectstorage/objectstorage_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.objectstorage.objectstorage_service import (
    ObjectStorage,
)

objectstorage_client = ObjectStorage(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: objectstorage_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/objectstorage/objectstorage_service.py
Signals: Pydantic

```python
"""OCI Object Storage Service Module."""

from datetime import datetime
from typing import Optional

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class ObjectStorage(OCIService):
    """OCI Object Storage Service class to retrieve buckets and their configurations."""

    def __init__(self, provider):
        """
        Initialize the Object Storage service.

        Args:
            provider: The OCI provider instance
        """
        super().__init__("objectstorage", provider)
        self.buckets = []
        self.namespace = self.__get_namespace__()
        if self.namespace:
            self.__threading_call_by_region_and_compartment__(self.__list_buckets__)

    def __get_client__(self, region):
        """
        Get the Object Storage client for a region.

        Args:
            region: Region key

        Returns:
            Object Storage client instance
        """
        return self._create_oci_client(
            oci.object_storage.ObjectStorageClient, config_overrides={"region": region}
        )

    def __get_namespace__(self):
        """Get the Object Storage namespace for the tenancy."""
        try:
            # Use any regional client to get the namespace
            client = self.__get_client__(list(self.regional_clients.keys())[0])
            namespace = client.get_namespace().data
            logger.info(f"Object Storage - Namespace: {namespace}")
            return namespace
        except Exception as error:
            logger.error(
                f"Error getting Object Storage namespace: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return None

    def __list_buckets__(self, region, compartment):
        """
        List all Object Storage buckets in a compartment and region.

        Args:
            region: OCIRegion object
            compartment: Compartment object
        """
        try:
            # Extract region key from OCIRegion object
            region_key = region.key if hasattr(region, "key") else str(region)
            os_client = self.__get_client__(region_key)

            logger.info(
                f"Object Storage - Listing Buckets in {region_key} - {compartment.name}..."
            )

            buckets_data = oci.pagination.list_call_get_all_results(
                os_client.list_buckets,
                namespace_name=self.namespace,
                compartment_id=compartment.id,
            ).data

            for bucket in buckets_data:
                # Get bucket details for encryption and versioning info
                try:
                    bucket_details = os_client.get_bucket(
                        namespace_name=self.namespace, bucket_name=bucket.name
                    ).data

                    # Get public access type
                    public_access_type = getattr(
                        bucket_details, "public_access_type", "NoPublicAccess"
                    )

                    # Get versioning status
                    versioning = getattr(bucket_details, "versioning", "Disabled")

                    # Get encryption details
                    kms_key_id = getattr(bucket_details, "kms_key_id", None)

                    # Create a unique ID for the bucket using namespace/bucket_name
                    bucket_id = f"{self.namespace}/{bucket.name}"

                    self.buckets.append(
                        Bucket(
                            id=bucket_id,
                            name=bucket.name,
                            compartment_id=compartment.id,
                            namespace=self.namespace,
                            time_created=bucket.time_created,
                            public_access_type=public_access_type,
                            versioning=versioning,
                            kms_key_id=kms_key_id,
                            region=region_key,
                        )
                    )
                except Exception as detail_error:
                    logger.error(
                        f"Error getting bucket details for {bucket.name}: {detail_error.__class__.__name__}[{detail_error.__traceback__.tb_lineno}]: {detail_error}"
                    )
                    continue

        except Exception as error:
            logger.error(
                f"{region_key} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


# Service Models
class Bucket(BaseModel):
    """OCI Object Storage Bucket model."""

    id: str  # Using namespace/bucket_name as ID
    name: str
    compartment_id: str
    namespace: str
    time_created: datetime
    public_access_type: str
    versioning: str
    kms_key_id: Optional[str]
    region: str
```

--------------------------------------------------------------------------------

---[FILE: objectstorage_bucket_encrypted_with_cmk.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/objectstorage/objectstorage_bucket_encrypted_with_cmk/objectstorage_bucket_encrypted_with_cmk.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "objectstorage_bucket_encrypted_with_cmk",
  "CheckTitle": "Ensure Object Storage Buckets are encrypted with a Customer Managed Key (CMK)",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "objectstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:objectstorage:bucket",
  "Severity": "medium",
  "ResourceType": "OciBucket",
  "Description": "Object Storage buckets should be encrypted with Customer Managed Keys.",
  "Risk": "Not meeting this storage security requirement increases data security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Object/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-ObjectStorage/buckets-encrypted-with-cmks.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure Object Storage Buckets are encrypted with a Customer Managed Key (CMK)",
      "Url": "https://hub.prowler.com/check/oci/objectstorage_bucket_encrypted_with_cmk"
    }
  },
  "Categories": [
    "storage",
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: objectstorage_bucket_encrypted_with_cmk.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/objectstorage/objectstorage_bucket_encrypted_with_cmk/objectstorage_bucket_encrypted_with_cmk.py

```python
"""Check Ensure Object Storage Buckets are encrypted with a Customer Managed Key (CMK)."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.objectstorage.objectstorage_client import (
    objectstorage_client,
)


class objectstorage_bucket_encrypted_with_cmk(Check):
    """Check Ensure Object Storage Buckets are encrypted with a Customer Managed Key (CMK)."""

    def execute(self) -> Check_Report_OCI:
        """Execute the objectstorage_bucket_encrypted_with_cmk check."""
        findings = []

        # Check buckets are encrypted with CMK
        for bucket in objectstorage_client.buckets:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=bucket,
                region=bucket.region,
                resource_name=bucket.name,
                resource_id=bucket.id,
                compartment_id=bucket.compartment_id,
            )

            if bucket.kms_key_id:
                report.status = "PASS"
                report.status_extended = (
                    f"Bucket {bucket.name} is encrypted with Customer Managed Key."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Bucket {bucket.name} is not encrypted with Customer Managed Key."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: objectstorage_bucket_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/objectstorage/objectstorage_bucket_logging_enabled/objectstorage_bucket_logging_enabled.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "objectstorage_bucket_logging_enabled",
  "CheckTitle": "Ensure write level Object Storage logging is enabled for all buckets",
  "CheckType": [],
  "ServiceName": "objectstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "OciObjectStorageBucket",
  "Description": "Write-level logging for Object Storage buckets provides an audit trail of all write operations (PUT, POST, DELETE) performed on buckets, enabling security monitoring and compliance requirements.",
  "Risk": "Without write-level logging, unauthorized or malicious modifications to Object Storage data cannot be detected or investigated.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Logging/Concepts/loggingoverview.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci logging log create --log-group-id <log-group-ocid> --display-name 'ObjectStorage-Write-Logs' --log-type SERVICE --configuration '{\"compartmentId\":\"<compartment-ocid>\",\"source\":{\"service\":\"objectstorage\",\"resource\":\"<bucket-name>\",\"category\":\"write\",\"sourceType\":\"OCISERVICE\"}}'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-ObjectStorage/enable-write-level-logging.html",
      "Terraform": "resource \"oci_logging_log\" \"objectstorage_write_log\" {\n  display_name = \"ObjectStorage-Write-Logs\"\n  log_group_id = oci_logging_log_group.log_group.id\n  log_type = \"SERVICE\"\n  configuration {\n    source {\n      category = \"write\"\n      resource = oci_objectstorage_bucket.bucket.name\n      service = \"objectstorage\"\n      source_type = \"OCISERVICE\"\n    }\n    compartment_id = var.compartment_id\n  }\n  is_enabled = true\n}"
    },
    "Recommendation": {
      "Text": "Enable write-level logging for all Object Storage buckets to maintain audit trails of data modifications.",
      "Url": "https://docs.prowler.com/checks/oci/oci-logging/objectstorage_bucket_logging_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: objectstorage_bucket_logging_enabled.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/objectstorage/objectstorage_bucket_logging_enabled/objectstorage_bucket_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.logging.logging_client import logging_client
from prowler.providers.oraclecloud.services.objectstorage.objectstorage_client import (
    objectstorage_client,
)


class objectstorage_bucket_logging_enabled(Check):
    """Ensure write level Object Storage logging is enabled for all buckets"""

    def execute(self):
        """Execute check to verify write-level logging is enabled for Object Storage buckets."""
        findings = []

        for bucket in objectstorage_client.buckets:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=bucket,
                region=bucket.region,
                resource_id=bucket.id,
                resource_name=bucket.name,
                compartment_id=bucket.compartment_id,
            )

            # Check if there is a write-level log configured for this bucket
            # A write log should have:
            # - source.service == 'objectstorage'
            # - source.category == 'write'
            # - source.resource == bucket.name
            has_write_logging = False
            has_read_logging = False
            for log in logging_client.logs:
                if (
                    log.source_service == "objectstorage"
                    and log.source_category == "write"
                    and log.source_resource == bucket.name
                    and log.region == bucket.region
                    and log.is_enabled
                ):
                    has_write_logging = True
                elif (
                    log.source_service == "objectstorage"
                    and log.source_category == "read"
                    and log.source_resource == bucket.name
                    and log.region == bucket.region
                    and log.is_enabled
                ):
                    has_read_logging = True

            if has_write_logging:
                report.status = "PASS"
                report.status_extended = (
                    f"Bucket {bucket.name} has write-level logging enabled."
                )
            elif has_read_logging:
                report.status = "FAIL"
                report.status_extended = (
                    f"Bucket {bucket.name} has read-level logging enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Bucket {bucket.name} does not have write-level logging enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: objectstorage_bucket_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/objectstorage/objectstorage_bucket_not_publicly_accessible/objectstorage_bucket_not_publicly_accessible.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "objectstorage_bucket_not_publicly_accessible",
  "CheckTitle": "Ensure no Object Storage buckets are publicly visible",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "objectstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:objectstorage:bucket",
  "Severity": "critical",
  "ResourceType": "OciObjectStorageBucket",
  "Description": "Ensure no Object Storage buckets are publicly visible. Public access to Object Storage buckets can lead to unauthorized data access or data leakage.",
  "Risk": "Publicly accessible Object Storage buckets can expose sensitive data to unauthorized users on the internet.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Object/Tasks/managingbuckets.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci os bucket update --namespace <namespace> --bucket-name <bucket-name> --public-access-type NoPublicAccess",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-ObjectStorage/publicly-accessible-buckets.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Update the bucket's public access type to 'NoPublicAccess' to prevent unauthorized access.",
      "Url": "https://docs.oracle.com/en-us/iaas/Content/Object/Tasks/managingbuckets.htm"
    }
  },
  "Categories": [
    "internet-exposed",
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
