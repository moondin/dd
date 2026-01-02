---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 400
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 400 of 867)

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

---[FILE: audit_log_retention_period_365_days.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/audit/audit_log_retention_period_365_days/audit_log_retention_period_365_days.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "audit_log_retention_period_365_days",
  "CheckTitle": "Tenancy audit log retention period is 365 days or greater",
  "CheckType": [],
  "ServiceName": "audit",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Compartment",
  "Description": "**OCI Audit configuration** defines tenancy-wide log retention for audit events. The finding evaluates whether the retention period (days) is `>= 365` and that an audit configuration exists, *applying across all regions and compartments*.",
  "Risk": "**Insufficient audit retention** or missing configuration shrinks the **detection window** and breaks **accountability**.\n\nEvidence for older actions may be unavailable, enabling attackers to evade detection, mask **data exfiltration**, and impede **forensic reconstruction** and compliance reporting.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.oracle.com/en-us/iaas/Content/Audit/Tasks/settingretentionperiod.htm",
    "https://docs.oracle.com/en-us/iaas/tools/terraform-provider-oci/4.88.1/docs/r/audit_configuration.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "oci audit configuration update --compartment-id <tenancy-ocid> --retention-period-days 365",
      "NativeIaC": "",
      "Other": "1. Open the OCI Console and go to Governance & Administration > Audit\n2. Click Configuration\n3. Set Retention period (days) to 365\n4. Click Save",
      "Terraform": "```hcl\nresource \"oci_audit_configuration\" \"<example_resource_name>\" {\n  compartment_id        = var.tenancy_ocid\n  retention_period_days = 365 # Critical: sets audit log retention to 365 days to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Set audit retention to `>= 365` days at the tenancy level and protect the setting with **least privilege** and **separation of duties**.\n\nAdopt **defense in depth**: export audit logs to centralized, immutable storage or a SIEM for extended retention, integrity, and continuous monitoring.",
      "Url": "https://hub.prowler.com/check/audit_log_retention_period_365_days"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: audit_log_retention_period_365_days.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/audit/audit_log_retention_period_365_days/audit_log_retention_period_365_days.py

```python
"""Check Ensure audit log retention period is set to 365 days or greater."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.audit.audit_client import audit_client


class audit_log_retention_period_365_days(Check):
    """Check Ensure audit log retention period is set to 365 days or greater."""

    def execute(self) -> Check_Report_OCI:
        """Execute the audit_log_retention_period_365_days check."""
        findings = []

        # Check audit log retention period
        if audit_client.configuration:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=audit_client.configuration,
                region="global",
                resource_name="Audit Configuration",
                resource_id=audit_client.audited_tenancy,
                compartment_id=audit_client.audited_tenancy,
            )

            if audit_client.configuration.retention_period_days >= 365:
                report.status = "PASS"
                report.status_extended = f"Audit log retention period is {audit_client.configuration.retention_period_days} days (365 days or greater)."
            else:
                report.status = "FAIL"
                report.status_extended = f"Audit log retention period is {audit_client.configuration.retention_period_days} days (less than 365 days)."

            findings.append(report)
        else:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Audit Configuration",
                resource_id=audit_client.audited_tenancy,
                compartment_id=audit_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = "Audit configuration not found."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: blockstorage_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/blockstorage/blockstorage_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.blockstorage.blockstorage_service import (
    BlockStorage,
)

blockstorage_client = BlockStorage(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: blockstorage_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/blockstorage/blockstorage_service.py
Signals: Pydantic

```python
"""OCI Block Storage Service Module."""

from typing import Optional

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class BlockStorage(OCIService):
    """OCI Block Storage Service class to retrieve block volumes and boot volumes."""

    def __init__(self, provider):
        """
        Initialize the Block Storage service.

        Args:
            provider: The OCI provider instance
        """
        super().__init__("blockstorage", provider)
        self.volumes = []
        self.boot_volumes = []
        self.__threading_call__(self.__list_volumes__)
        self.__threading_call__(self.__list_boot_volumes__)

    def __get_client__(self, region):
        """
        Get the Block Storage client for a region.

        Args:
            region: Region key

        Returns:
            Block Storage client instance
        """
        client_region = self.regional_clients.get(region)
        if client_region:
            return self._create_oci_client(oci.core.BlockstorageClient)
        return None

    def __list_volumes__(self, regional_client):
        """
        List all block volumes in the compartments.

        Args:
            regional_client: Regional OCI client
        """
        try:
            blockstorage_client = self.__get_client__(regional_client.region)
            if not blockstorage_client:
                return

            logger.info(
                f"BlockStorage - Listing Volumes in {regional_client.region}..."
            )

            for compartment in self.audited_compartments:
                try:
                    volumes = oci.pagination.list_call_get_all_results(
                        blockstorage_client.list_volumes, compartment_id=compartment.id
                    ).data

                    for volume in volumes:
                        if volume.lifecycle_state not in ["TERMINATED", "TERMINATING"]:
                            self.volumes.append(
                                Volume(
                                    id=volume.id,
                                    name=(
                                        volume.display_name
                                        if hasattr(volume, "display_name")
                                        else volume.id
                                    ),
                                    compartment_id=compartment.id,
                                    region=regional_client.region,
                                    lifecycle_state=volume.lifecycle_state,
                                    kms_key_id=(
                                        volume.kms_key_id
                                        if hasattr(volume, "kms_key_id")
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

    def __list_boot_volumes__(self, regional_client):
        """
        List all boot volumes in the compartments.

        Args:
            regional_client: Regional OCI client
        """
        try:
            blockstorage_client = self.__get_client__(regional_client.region)
            if not blockstorage_client:
                return

            logger.info(
                f"BlockStorage - Listing Boot Volumes in {regional_client.region}..."
            )

            for compartment in self.audited_compartments:
                try:
                    # Get availability domains for this compartment
                    identity_client = self._create_oci_client(
                        oci.identity.IdentityClient
                    )
                    availability_domains = identity_client.list_availability_domains(
                        compartment_id=compartment.id
                    ).data

                    for ad in availability_domains:
                        boot_volumes = oci.pagination.list_call_get_all_results(
                            blockstorage_client.list_boot_volumes,
                            availability_domain=ad.name,
                            compartment_id=compartment.id,
                        ).data

                        for boot_volume in boot_volumes:
                            if boot_volume.lifecycle_state not in [
                                "TERMINATED",
                                "TERMINATING",
                            ]:
                                self.boot_volumes.append(
                                    BootVolume(
                                        id=boot_volume.id,
                                        name=(
                                            boot_volume.display_name
                                            if hasattr(boot_volume, "display_name")
                                            else boot_volume.id
                                        ),
                                        compartment_id=compartment.id,
                                        region=regional_client.region,
                                        lifecycle_state=boot_volume.lifecycle_state,
                                        kms_key_id=(
                                            boot_volume.kms_key_id
                                            if hasattr(boot_volume, "kms_key_id")
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
class Volume(BaseModel):
    """OCI Block Volume model."""

    id: str
    name: str
    compartment_id: str
    region: str
    lifecycle_state: str
    kms_key_id: Optional[str] = None


class BootVolume(BaseModel):
    """OCI Boot Volume model."""

    id: str
    name: str
    compartment_id: str
    region: str
    lifecycle_state: str
    kms_key_id: Optional[str] = None
```

--------------------------------------------------------------------------------

---[FILE: blockstorage_block_volume_encrypted_with_cmk.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/blockstorage/blockstorage_block_volume_encrypted_with_cmk/blockstorage_block_volume_encrypted_with_cmk.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "blockstorage_block_volume_encrypted_with_cmk",
  "CheckTitle": "Block volume is encrypted with a Customer Managed Key (CMK)",
  "CheckType": [],
  "ServiceName": "blockstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Volume",
  "Description": "**OCI block volumes** use **Customer-Managed Keys** (`CMK`) from Vault for at-rest encryption instead of Oracle-managed keys.\n\nIdentifies whether a block volume has a customer-managed key associated for its encryption.",
  "Risk": "Without **CMK**, encryption key control is limited, impacting confidentiality and auditability:\n- No rapid key disable/rotation to contain breaches\n- Weaker restrictions and visibility on decrypt operations\nThis can prolong unauthorized data access and hinder incident response and compliance.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.oracle.com/en-us/iaas/Content/Block/Concepts/overview.htm"
  ],
  "Remediation": {
    "Code": {
      "CLI": "oci bv volume update --volume-id <VOLUME_OCID> --kms-key-id <KMS_KEY_OCID>",
      "NativeIaC": "",
      "Other": "1. In the OCI Console, go to Block Storage > Block Volumes\n2. Open the failing volume\n3. Click Edit\n4. Under Encryption, select \"Encrypt using customer-managed keys\" and choose the vault key\n5. Click Save changes",
      "Terraform": "```hcl\nresource \"oci_core_volume\" \"<example_resource_name>\" {\n  compartment_id      = \"<example_resource_id>\"\n  availability_domain = \"<example_resource_name>\"\n  size_in_gbs         = 50\n\n  kms_key_id = \"<example_resource_id>\" # Critical: uses a Customer Managed Key to encrypt the volume\n}\n```"
    },
    "Recommendation": {
      "Text": "Use **Customer-Managed Keys** in Vault for all block volumes.\n- Enforce least privilege and separation of duties on key usage\n- Rotate keys regularly and monitor KMS events\n- Validate that key disable/deny revokes data access\nApply the same controls to snapshots and backups.",
      "Url": "https://hub.prowler.com/check/blockstorage_block_volume_encrypted_with_cmk"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: blockstorage_block_volume_encrypted_with_cmk.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/blockstorage/blockstorage_block_volume_encrypted_with_cmk/blockstorage_block_volume_encrypted_with_cmk.py

```python
"""Check if Block Volumes are encrypted with Customer Managed Keys."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.blockstorage.blockstorage_client import (
    blockstorage_client,
)


class blockstorage_block_volume_encrypted_with_cmk(Check):
    """Check if Block Volumes are encrypted with Customer Managed Keys."""

    def execute(self) -> Check_Report_OCI:
        """Execute the blockstorage_block_volume_encrypted_with_cmk check.

        Returns:
            List of Check_Report_OCI objects with findings
        """
        findings = []

        for volume in blockstorage_client.volumes:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=volume,
                region=volume.region,
                resource_name=volume.name,
                resource_id=volume.id,
                compartment_id=volume.compartment_id,
            )

            if volume.kms_key_id is not None:
                report.status = "PASS"
                report.status_extended = f"Block volume {volume.name} is encrypted with a Customer Managed Key (CMK)."
            else:
                report.status = "FAIL"
                report.status_extended = f"Block volume {volume.name} is not encrypted with a Customer Managed Key (uses Oracle-managed encryption)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: blockstorage_boot_volume_encrypted_with_cmk.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/blockstorage/blockstorage_boot_volume_encrypted_with_cmk/blockstorage_boot_volume_encrypted_with_cmk.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "blockstorage_boot_volume_encrypted_with_cmk",
  "CheckTitle": "Boot volume is encrypted with Customer Managed Key",
  "CheckType": [],
  "ServiceName": "blockstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "BootVolume",
  "Description": "Boot volumes use **customer-managed keys (CMEK)** when a Vault key is assigned (`kms_key_id` present), rather than default Oracle-managed encryption.",
  "Risk": "Without **CMEK**, control over encryption is limited: you cannot rapidly disable or rotate keys to contain compromise, weakening **confidentiality** of boot data and backups. Provider-managed keys reduce **separation of duties** and **auditability**, hindering incident response and compliance for sensitive systems.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-BlockVolume/block-volumes-encrypted-with-cmks.html",
    "https://docs.public.content.oci.oraclecloud.com/en-us/iaas/Content/Block/Concepts/managingblockencryptionkeys.htm"
  ],
  "Remediation": {
    "Code": {
      "CLI": "oci bv boot-volume update --boot-volume-id <example_resource_id> --kms-key-id <example_resource_id>",
      "NativeIaC": "",
      "Other": "1. In the OCI Console, go to Storage > Block Storage > Boot Volumes\n2. Click the boot volume name\n3. Click Edit (or Assign master encryption key)\n4. Select a Customer-managed key from Vault\n5. Click Save",
      "Terraform": "```hcl\nresource \"oci_core_boot_volume_kms_key\" \"<example_resource_name>\" {\n  boot_volume_id = \"<example_resource_id>\"  # Critical: target boot volume to update\n  kms_key_id     = \"<example_resource_id>\"  # Critical: assigns a Customer Managed Key (CMK) to the boot volume\n}\n```"
    },
    "Recommendation": {
      "Text": "Encrypt boot volumes with **customer-managed keys** and enforce **least privilege** on key usage. Define a key lifecycle (new keys for rotation), monitor and audit key access, and restrict key scope to required compartments and services to achieve **defense in depth** and rapid revocation when needed.",
      "Url": "https://hub.prowler.com/check/blockstorage_boot_volume_encrypted_with_cmk"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: blockstorage_boot_volume_encrypted_with_cmk.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/blockstorage/blockstorage_boot_volume_encrypted_with_cmk/blockstorage_boot_volume_encrypted_with_cmk.py

```python
"""Check Ensure Boot Volumes are encrypted with Customer Managed Key."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.blockstorage.blockstorage_client import (
    blockstorage_client,
)


class blockstorage_boot_volume_encrypted_with_cmk(Check):
    """Check Ensure Boot Volumes are encrypted with Customer Managed Key."""

    def execute(self) -> Check_Report_OCI:
        """Execute the blockstorage_boot_volume_encrypted_with_cmk check."""
        findings = []

        for resource in blockstorage_client.boot_volumes:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=resource,
                region=resource.region,
                resource_name=resource.name,
                resource_id=resource.id,
                compartment_id=resource.compartment_id,
            )

            if resource.kms_key_id is not None:
                report.status = "PASS"
                report.status_extended = f"Boot Volume {resource.name} is encrypted with Customer Managed Key."
            else:
                report.status = "FAIL"
                report.status_extended = f"Boot Volume {resource.name} is not encrypted with Customer Managed Key."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudguard_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/cloudguard/cloudguard_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.cloudguard.cloudguard_service import (
    CloudGuard,
)

cloudguard_client = CloudGuard(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: cloudguard_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/cloudguard/cloudguard_service.py
Signals: Pydantic

```python
"""OCI Cloud Guard Service Module."""

from typing import Optional

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class CloudGuard(OCIService):
    """OCI Cloud Guard Service class."""

    def __init__(self, provider):
        """Initialize the Cloud Guard service."""
        super().__init__("cloudguard", provider)
        self.configuration = None
        self.__get_configuration__()

    def __get_configuration__(self):
        """Get Cloud Guard configuration."""
        try:
            cloudguard_client = self._create_oci_client(
                oci.cloud_guard.CloudGuardClient
            )

            logger.info("CloudGuard - Getting Configuration...")

            try:
                config = cloudguard_client.get_configuration(
                    compartment_id=self.audited_tenancy
                ).data

                self.configuration = CloudGuardConfiguration(
                    compartment_id=self.audited_tenancy,
                    status=config.status if hasattr(config, "status") else "DISABLED",
                    reporting_region=(
                        config.reporting_region
                        if hasattr(config, "reporting_region")
                        else None
                    ),
                )
            except Exception as error:
                logger.info(f"CloudGuard - Cloud Guard not configured: {error}")
                self.configuration = CloudGuardConfiguration(
                    compartment_id=self.audited_tenancy,
                    status="DISABLED",
                    reporting_region=None,
                )
        except Exception as error:
            logger.error(
                f"CloudGuard - Error getting Cloud Guard configuration: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


# Service Models
class CloudGuardConfiguration(BaseModel):
    """OCI Cloud Guard Configuration model."""

    compartment_id: str
    status: str
    reporting_region: Optional[str] = None
```

--------------------------------------------------------------------------------

---[FILE: cloudguard_enabled.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/cloudguard/cloudguard_enabled/cloudguard_enabled.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "cloudguard_enabled",
  "CheckTitle": "Cloud Guard is enabled in the root compartment of the tenancy",
  "CheckType": [],
  "ServiceName": "cloudguard",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Compartment",
  "Description": "**OCI Cloud Guard** status in the tenancy's root compartment is evaluated, expecting `ENABLED` to indicate the service is active for organization-wide detection and response.",
  "Risk": "Without **Cloud Guard** at the root, signals across compartments can be missed, allowing misconfigurations and malicious activity to persist. This undermines confidentiality (undetected data access), integrity (unauthorized changes), and availability (ongoing abuse without automated response).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.oracle.com/en-us/iaas/cloud-guard/home.htm"
  ],
  "Remediation": {
    "Code": {
      "CLI": "oci cloud-guard cloud-guard-configuration update --compartment-id <tenancy-ocid> --status ENABLED --reporting-region <region>",
      "NativeIaC": "",
      "Other": "1. In the OCI Console, go to Security > Cloud Guard\n2. Ensure the root compartment is selected\n3. Click Enable Cloud Guard\n4. Choose a Reporting region\n5. Click Enable",
      "Terraform": "```hcl\nresource \"oci_cloud_guard_cloud_guard_configuration\" \"<example_resource_name>\" {\n  compartment_id   = var.tenancy_ocid\n  reporting_region = var.region\n  status           = \"ENABLED\" # Critical: Turns on Cloud Guard in the root compartment\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Cloud Guard** at the tenancy root to centralize monitoring and automated response. Apply **defense in depth** by using detectors/responders, integrate alerts with monitoring, and enforce **least privilege** for its roles. Regularly tune policies and review findings to prevent blind spots.",
      "Url": "https://hub.prowler.com/check/cloudguard_enabled"
    }
  },
  "Categories": [
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudguard_enabled.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/cloudguard/cloudguard_enabled/cloudguard_enabled.py

```python
"""Check Ensure Cloud Guard is enabled in the root compartment of the tenancy."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.cloudguard.cloudguard_client import (
    cloudguard_client,
)


class cloudguard_enabled(Check):
    """Check Ensure Cloud Guard is enabled in the root compartment of the tenancy."""

    def execute(self) -> Check_Report_OCI:
        """Execute the cloudguard_enabled check."""
        findings = []

        report = Check_Report_OCI(
            metadata=self.metadata(),
            resource=cloudguard_client.configuration,
            region="global",
            resource_name="Cloud Guard",
            resource_id=cloudguard_client.audited_tenancy,
            compartment_id=cloudguard_client.audited_tenancy,
        )

        if (
            cloudguard_client.configuration
            and cloudguard_client.configuration.status == "ENABLED"
        ):
            report.status = "PASS"
            report.status_extended = "Cloud Guard is enabled in the root compartment."
        else:
            report.status = "FAIL"
            report.status_extended = (
                "Cloud Guard is not enabled in the root compartment."
            )

        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/compute/compute_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.compute.compute_service import Compute

compute_client = Compute(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: compute_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/compute/compute_service.py
Signals: Pydantic

```python
"""OCI Compute Service Module."""

from typing import Optional

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class Compute(OCIService):
    """OCI Compute Service class to retrieve compute instances."""

    def __init__(self, provider):
        """
        Initialize the Compute service.

        Args:
            provider: The OCI provider instance
        """
        super().__init__("compute", provider)
        self.instances = []
        self.__threading_call__(self.__list_instances__)

    def __get_client__(self, region):
        """
        Get the Compute client for a region.

        Args:
            region: Region key

        Returns:
            Compute client instance
        """
        client_region = self.regional_clients.get(region)
        if client_region:
            return self._create_oci_client(oci.core.ComputeClient)
        return None

    def __list_instances__(self, regional_client):
        """
        List all compute instances in the compartments.

        Args:
            regional_client: Regional OCI client
        """
        try:
            compute_client = self.__get_client__(regional_client.region)
            if not compute_client:
                return

            logger.info(f"Compute - Listing Instances in {regional_client.region}...")

            for compartment in self.audited_compartments:
                try:
                    instances = oci.pagination.list_call_get_all_results(
                        compute_client.list_instances, compartment_id=compartment.id
                    ).data

                    for instance in instances:
                        if instance.lifecycle_state not in [
                            "TERMINATED",
                            "TERMINATING",
                        ]:
                            # Get instance metadata options
                            metadata_options = (
                                instance.instance_options.are_legacy_imds_endpoints_disabled
                                if hasattr(instance, "instance_options")
                                and hasattr(
                                    instance.instance_options,
                                    "are_legacy_imds_endpoints_disabled",
                                )
                                else None
                            )

                            # Get secure boot status
                            is_secure_boot_enabled = (
                                instance.platform_config.is_secure_boot_enabled
                                if hasattr(instance, "platform_config")
                                and hasattr(
                                    instance.platform_config, "is_secure_boot_enabled"
                                )
                                else False
                            )

                            # Get in-transit encryption status from launch options
                            is_pv_encryption_in_transit_enabled = (
                                instance.launch_options.is_pv_encryption_in_transit_enabled
                                if hasattr(instance, "launch_options")
                                and hasattr(
                                    instance.launch_options,
                                    "is_pv_encryption_in_transit_enabled",
                                )
                                else None
                            )

                            self.instances.append(
                                Instance(
                                    id=instance.id,
                                    name=(
                                        instance.display_name
                                        if hasattr(instance, "display_name")
                                        else instance.id
                                    ),
                                    compartment_id=compartment.id,
                                    region=regional_client.region,
                                    lifecycle_state=instance.lifecycle_state,
                                    are_legacy_imds_endpoints_disabled=metadata_options,
                                    is_secure_boot_enabled=is_secure_boot_enabled,
                                    is_pv_encryption_in_transit_enabled=is_pv_encryption_in_transit_enabled,
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
class Instance(BaseModel):
    """OCI Compute Instance model."""

    id: str
    name: str
    compartment_id: str
    region: str
    lifecycle_state: str
    are_legacy_imds_endpoints_disabled: Optional[bool] = None
    is_secure_boot_enabled: bool = False
    is_pv_encryption_in_transit_enabled: Optional[bool] = None
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_in_transit_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/compute/compute_instance_in_transit_encryption_enabled/compute_instance_in_transit_encryption_enabled.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "compute_instance_in_transit_encryption_enabled",
  "CheckTitle": "Ensure In-transit Encryption is enabled on Compute Instance",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:compute:instance",
  "Severity": "high",
  "ResourceType": "OciComputeInstance",
  "Description": "In-transit encryption protects data as it moves between the compute instance and block volumes. This is implemented through the Oracle Cloud Agent management plugin which enables encryption for block volume attachments.",
  "Risk": "Without in-transit encryption, data moving between compute instances and block volumes could be intercepted or tampered with during transmission.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Block/Concepts/blockvolumeencryption.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci compute instance update --instance-id <instance-ocid> --agent-config '{\"isManagementDisabled\": false}'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-Compute/enable-encryption-in-transit.html",
      "Terraform": "resource \"oci_core_instance\" \"example\" {\n  # ... other configuration ...\n  agent_config {\n    is_management_disabled = false\n  }\n}"
    },
    "Recommendation": {
      "Text": "Enable the Oracle Cloud Agent management plugin on all compute instances to enable in-transit encryption for block volume attachments.",
      "Url": "https://hub.prowler.com/check/oci/compute_instance_in_transit_encryption_enabled"
    }
  },
  "Categories": [
    "compute",
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_in_transit_encryption_enabled.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/compute/compute_instance_in_transit_encryption_enabled/compute_instance_in_transit_encryption_enabled.py

```python
"""Check if In-transit Encryption is enabled on Compute Instance."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.compute.compute_client import compute_client


class compute_instance_in_transit_encryption_enabled(Check):
    """Check if In-transit Encryption is enabled on Compute Instance."""

    def execute(self) -> Check_Report_OCI:
        """Execute the compute_instance_in_transit_encryption_enabled check.

        Returns:
            List of Check_Report_OCI objects with findings
        """
        findings = []

        for instance in compute_client.instances:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=instance,
                region=instance.region,
                resource_name=instance.name,
                resource_id=instance.id,
                compartment_id=instance.compartment_id,
            )

            # In-transit encryption is enabled when is_pv_encryption_in_transit_enabled is True
            if instance.is_pv_encryption_in_transit_enabled:
                report.status = "PASS"
                report.status_extended = f"Compute instance {instance.name} has in-transit encryption enabled."
            else:
                report.status = "FAIL"
                report.status_extended = f"Compute instance {instance.name} does not have in-transit encryption enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_legacy_metadata_endpoint_disabled.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/compute/compute_instance_legacy_metadata_endpoint_disabled/compute_instance_legacy_metadata_endpoint_disabled.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "compute_instance_legacy_metadata_endpoint_disabled",
  "CheckTitle": "Ensure Compute Instance Legacy Metadata service endpoint is disabled",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:compute:instance",
  "Severity": "medium",
  "ResourceType": "OciComputeInstance",
  "Description": "The legacy Instance Metadata Service (IMDS) v1 endpoints do not use session authentication. Disabling the legacy endpoints helps prevent unauthorized access to instance metadata.",
  "Risk": "If legacy metadata endpoints are enabled, attackers who gain access to the instance may be able to access instance metadata without authentication, potentially exposing sensitive information.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Compute/Tasks/gettingmetadata.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci compute instance update --instance-id <instance-ocid> --instance-options '{\"areLegacyImdsEndpointsDisabled\": true}'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-Compute/enforce-imds-v2.html",
      "Terraform": "resource \"oci_core_instance\" \"example\" {\n  # ... other configuration ...\n  instance_options {\n    are_legacy_imds_endpoints_disabled = true\n  }\n}"
    },
    "Recommendation": {
      "Text": "Disable legacy metadata service endpoints on all compute instances to enforce session-based authentication.",
      "Url": "https://hub.prowler.com/check/oci/compute_instance_legacy_metadata_endpoint_disabled"
    }
  },
  "Categories": [
    "compute",
    "security-configuration"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
