---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 350
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 350 of 867)

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

---[FILE: vm_service.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_service.py
Signals: Pydantic

```python
from enum import Enum
from typing import List, Optional

from azure.mgmt.compute import ComputeManagementClient
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class VirtualMachines(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(ComputeManagementClient, provider)
        self.virtual_machines = self._get_virtual_machines()
        self.disks = self._get_disks()
        self.vm_scale_sets = self._get_vm_scale_sets()

    def _get_virtual_machines(self):
        logger.info("VirtualMachines - Getting virtual machines...")
        virtual_machines = {}

        for subscription_name, client in self.clients.items():
            try:
                virtual_machines_list = client.virtual_machines.list_all()
                virtual_machines.update({subscription_name: {}})

                for vm in virtual_machines_list:
                    storage_profile = getattr(vm, "storage_profile", None)
                    os_disk = (
                        getattr(storage_profile, "os_disk", None)
                        if storage_profile
                        else None
                    )
                    data_disks = []

                    if storage_profile and getattr(storage_profile, "data_disks", []):
                        data_disks = [
                            DataDisk(
                                lun=data_disk.lun,
                                name=data_disk.name,
                                managed_disk=ManagedDiskParameters(
                                    id=(
                                        getattr(
                                            getattr(data_disk, "managed_disk", None),
                                            "id",
                                            None,
                                        )
                                        if data_disk.managed_disk
                                        else None
                                    )
                                ),
                            )
                            for data_disk in getattr(storage_profile, "data_disks", [])
                        ]

                    extensions = []
                    if getattr(vm, "resources", []):
                        extensions = [
                            VirtualMachineExtension(id=extension.id)
                            for extension in vm.resources
                            if extension
                        ]

                    # Collect LinuxConfiguration.disablePasswordAuthentication if available
                    linux_configuration = None
                    os_profile = getattr(vm, "os_profile", None)
                    if os_profile:
                        linux_conf = getattr(os_profile, "linux_configuration", None)
                        if linux_conf:
                            linux_configuration = LinuxConfiguration(
                                disable_password_authentication=getattr(
                                    linux_conf, "disable_password_authentication", False
                                )
                            )

                    # Convert Azure SDK SecurityProfile to custom SecurityProfile dataclass
                    azure_security_profile = getattr(vm, "security_profile", None)
                    security_profile = None
                    if azure_security_profile:
                        uefi_settings = None
                        azure_uefi_settings = getattr(
                            azure_security_profile, "uefi_settings", None
                        )
                        if azure_uefi_settings:
                            uefi_settings = UefiSettings(
                                secure_boot_enabled=getattr(
                                    azure_uefi_settings, "secure_boot_enabled", False
                                ),
                                v_tpm_enabled=getattr(
                                    azure_uefi_settings, "v_tpm_enabled", False
                                ),
                            )
                        security_profile = SecurityProfile(
                            security_type=getattr(
                                azure_security_profile, "security_type", None
                            ),
                            uefi_settings=uefi_settings,
                        )

                    virtual_machines[subscription_name].update(
                        {
                            vm.id: VirtualMachine(
                                resource_id=vm.id,
                                resource_name=vm.name,
                                storage_profile=(
                                    StorageProfile(
                                        os_disk=OSDisk(
                                            name=getattr(os_disk, "name", None),
                                            operating_system_type=getattr(
                                                os_disk, "os_type", None
                                            ),
                                            managed_disk=ManagedDiskParameters(
                                                id=getattr(
                                                    getattr(
                                                        os_disk, "managed_disk", None
                                                    ),
                                                    "id",
                                                    None,
                                                )
                                            ),
                                        ),
                                        data_disks=data_disks,
                                    )
                                    if storage_profile
                                    else None
                                ),
                                location=vm.location,
                                security_profile=security_profile,
                                extensions=extensions,
                                vm_size=getattr(
                                    getattr(vm, "hardware_profile", None),
                                    "vm_size",
                                    None,
                                ),
                                image_reference=getattr(
                                    getattr(storage_profile, "image_reference", None),
                                    "id",
                                    None,
                                ),
                                linux_configuration=linux_configuration,
                            )
                        }
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

        return virtual_machines

    def _get_disks(self):
        logger.info("VirtualMachines - Getting disks...")
        disks = {}

        for subscription_name, client in self.clients.items():
            try:
                disks_list = client.disks.list()
                disks.update({subscription_name: {}})

                for disk in disks_list:
                    vms_attached = []
                    if disk.managed_by:
                        vms_attached.append(disk.managed_by)
                    if disk.managed_by_extended:
                        vms_attached.extend(disk.managed_by_extended)
                    disks[subscription_name].update(
                        {
                            disk.unique_id: Disk(
                                resource_id=disk.id,
                                resource_name=disk.name,
                                location=disk.location,
                                vms_attached=vms_attached,
                                encryption_type=getattr(
                                    getattr(disk, "encryption", None), "type", None
                                ),
                            )
                        }
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

        return disks

    def _get_vm_scale_sets(self) -> dict[str, dict]:
        """
        Get all needed information about VM scale sets.

        Returns:
            A nested dictionary with the following structure:
            {
                "subscription_name": {
                    "vm_scale_set_id": VirtualMachineScaleSet()
                }
            }
        """
        logger.info(
            "VirtualMachines - Getting VM scale sets and their load balancer associations..."
        )
        vm_scale_sets = {}
        for subscription_name, client in self.clients.items():
            try:
                scale_sets = client.virtual_machine_scale_sets.list_all()
                vm_scale_sets[subscription_name] = {}
                for scale_set in scale_sets:
                    backend_pools = []
                    nic_configs = []
                    virtual_machine_profile = getattr(
                        scale_set, "virtual_machine_profile", None
                    )
                    if virtual_machine_profile:
                        network_profile = getattr(
                            virtual_machine_profile, "network_profile", None
                        )
                        if network_profile:
                            nic_configs = (
                                getattr(
                                    network_profile,
                                    "network_interface_configurations",
                                    [],
                                )
                                or []
                            )
                    for nic in nic_configs:
                        ip_confs = getattr(nic, "ip_configurations", [])
                        for ipconf in ip_confs:
                            pools = getattr(
                                ipconf, "load_balancer_backend_address_pools", []
                            )
                            if pools:
                                for pool in pools:
                                    if getattr(pool, "id", None):
                                        backend_pools.append(pool.id)
                    # Get instance IDs using the private method
                    instance_ids = self._get_vmss_instance_ids(
                        subscription_name, scale_set.id
                    )
                    vm_scale_sets[subscription_name][scale_set.id] = (
                        VirtualMachineScaleSet(
                            resource_id=scale_set.id,
                            resource_name=scale_set.name,
                            location=scale_set.location,
                            load_balancer_backend_pools=backend_pools,
                            instance_ids=instance_ids,
                        )
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return vm_scale_sets

    def _get_vmss_instance_ids(
        self, subscription_name: str, scale_set_id: str
    ) -> list[str]:
        """
        Given a subscription and scale set ID, return the list of VM instance IDs in the scale set.

        Args:
            subscription_name: The name of the subscription.
            scale_set_id: The ID of the scale set.

        Returns:
            A list of VM instance IDs that compose the scale set.
        """
        logger.info(
            f"VirtualMachines - Getting VM scale set instance IDs for {scale_set_id} in {subscription_name}..."
        )
        vm_instance_ids = []
        client = self.clients.get(subscription_name, None)
        try:
            resource_id_parts = scale_set_id.split("/")
            resource_group = ""
            scale_set_name = ""
            for i, part in enumerate(resource_id_parts):
                if part.lower() == "resourcegroups" and i + 1 < len(resource_id_parts):
                    resource_group = resource_id_parts[i + 1]
                if part.lower() == "virtualmachinescalesets" and i + 1 < len(
                    resource_id_parts
                ):
                    scale_set_name = resource_id_parts[i + 1]
            if resource_group and scale_set_name:
                instances = client.virtual_machine_scale_set_vms.list(
                    resource_group, scale_set_name
                )
                vm_instance_ids = [instance.instance_id for instance in instances]
        except Exception as e:
            logger.error(
                f"Failed to list instances for scale set {scale_set_name} in {resource_group}: {e}"
            )
        return vm_instance_ids


class UefiSettings(BaseModel):
    secure_boot_enabled: bool
    v_tpm_enabled: bool


class SecurityProfile(BaseModel):
    security_type: Optional[str] = None
    uefi_settings: Optional[UefiSettings] = None


class OperatingSystemType(Enum):
    WINDOWS = "Windows"
    LINUX = "Linux"


class ManagedDiskParameters(BaseModel):
    id: str


class OSDisk(BaseModel):
    name: str
    operating_system_type: OperatingSystemType
    managed_disk: Optional[ManagedDiskParameters]


class DataDisk(BaseModel):
    lun: int
    name: str
    managed_disk: Optional[ManagedDiskParameters]


class StorageProfile(BaseModel):
    os_disk: Optional[OSDisk]
    data_disks: List[DataDisk]


class VirtualMachineExtension(BaseModel):
    id: str


class LinuxConfiguration(BaseModel):
    disable_password_authentication: bool


class VirtualMachine(BaseModel):
    resource_id: str
    resource_name: str
    location: str
    security_profile: Optional[SecurityProfile]
    extensions: list[VirtualMachineExtension]
    storage_profile: Optional[StorageProfile] = None
    vm_size: Optional[str] = None
    image_reference: Optional[str] = None
    linux_configuration: Optional[LinuxConfiguration] = None


class Disk(BaseModel):
    resource_id: str
    resource_name: str
    vms_attached: list[str]
    encryption_type: str
    location: str


class VirtualMachineScaleSet(BaseModel):
    resource_id: str
    resource_name: str
    location: str
    load_balancer_backend_pools: list[str]
    instance_ids: list[str]
```

--------------------------------------------------------------------------------

---[FILE: vm_backup_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_backup_enabled/vm_backup_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_backup_enabled",
  "CheckTitle": "Ensure Backups are enabled for Azure Virtual Machines",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Compute/virtualMachines",
  "Description": "Ensure that Microsoft Azure Backup service is in use for your Azure virtual machines (VMs) to protect against accidental deletion or corruption.",
  "Risk": "Without Azure Backup enabled, VMs are at risk of data loss due to accidental deletion, corruption, or other failures, and recovery options are limited.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/backup/backup-overview",
  "Remediation": {
    "Code": {
      "CLI": "az backup protection enable-for-vm --resource-group <resource-group> --vm <vm-name> --vault-name <vault-name> --policy-name DefaultPolicy",
      "NativeIaC": "",
      "Other": "https://learn.microsoft.com/en-us/azure/backup/quick-backup-vm-portal",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable Azure Backup for each VM by associating it with a Recovery Services vault and a backup policy.",
      "Url": "https://docs.microsoft.com/en-us/azure/backup/quick-backup-vm-portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vm_backup_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_backup_enabled/vm_backup_enabled.py

```python
from azure.mgmt.recoveryservicesbackup.activestamp.models import DataSourceType

from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.recovery.recovery_client import recovery_client
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_backup_enabled(Check):
    """
    Ensure that Microsoft Azure Backup service is in use for your Azure virtual machines (VMs).

    This check evaluates whether each Azure VM in the subscription is protected by Azure Backup.

    - PASS: The VM is protected by Azure Backup (present in a Recovery Services vault).
    - FAIL: The VM is not protected by Azure Backup (not present in any Recovery Services vault).
    """

    def execute(self) -> list[Check_Report_Azure]:
        """Execute Azure VM backup enabled check.

        Returns:
            A list of reports containing the result of the check.
        """
        findings = []
        for subscription_name, vms in vm_client.virtual_machines.items():
            vaults = recovery_client.vaults.get(subscription_name, {})
            for vm in vms.values():
                found = False
                found_vault_name = None
                for vault in vaults.values():
                    for backup_item in vault.backup_protected_items.values():
                        if (
                            backup_item.workload_type == DataSourceType.VM
                            and backup_item.name.split(";")[-1] == vm.resource_name
                        ):
                            found = True
                            found_vault_name = vault.name
                            break
                    if found:
                        break
                report = Check_Report_Azure(metadata=self.metadata(), resource=vm)
                report.subscription = subscription_name
                if found:
                    report.status = "PASS"
                    report.status_extended = f"VM {vm.resource_name} in subscription {subscription_name} is protected by Azure Backup (vault: {found_vault_name})."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"VM {vm.resource_name} in subscription {subscription_name} is not protected by Azure Backup."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_desired_sku_size.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_desired_sku_size/vm_desired_sku_size.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_desired_sku_size",
  "CheckTitle": "Ensure that your virtual machine instances are using SKU sizes that are approved by your organization",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Compute/virtualMachines",
  "Description": "Ensure that your virtual machine instances are using SKU sizes that are approved by your organization. This check requires configuration of the desired VM SKU sizes in the Prowler configuration file.",
  "Risk": "Setting limits for the SKU size(s) of the virtual machine instances provisioned in your Microsoft Azure account can help you to manage better your cloud compute power, address internal compliance requirements and prevent unexpected charges on your Azure monthly bill. Without proper SKU size controls, organizations may face cost overruns and compliance violations.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview",
  "Remediation": {
    "Code": {
      "CLI": "az policy assignment create --display-name 'Allowed VM SKU Sizes' --policy cccc23c7-8427-4f53-ad12-b6a63eb452b3 -p '{\"listOfAllowedSKUs\": {\"value\": [\"<desired-sku-1>\", \"<desired-sku-2>\"]}}' --scope /subscriptions/<subscription-id>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Define and document your organization's approved VM SKU sizes based on workload requirements, cost constraints, and compliance needs. 2. Implement Azure Policy to enforce VM size restrictions across your subscriptions. 3. Use the 'Allowed virtual machine size SKUs' built-in policy to restrict VM creation to approved sizes. 4. Regularly review and update your approved SKU list based on changing business requirements and cost optimization goals. 5. Monitor VM usage and costs to ensure compliance with your SKU size policies.",
      "Url": "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/resize-vm"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check requires configuration of the desired VM SKU sizes in the Prowler configuration file. Configure the azure.desired_vm_sku_sizes list in your Prowler configuration file (see https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/configuration_file/) with the SKU sizes approved by your organization."
}
```

--------------------------------------------------------------------------------

---[FILE: vm_desired_sku_size.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_desired_sku_size/vm_desired_sku_size.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_desired_sku_size(Check):
    """
    Ensure that Azure virtual machines are using SKU sizes that are approved by your organization.

    This check evaluates whether each virtual machine's SKU size is included in the organization's approved list of VM sizes.
    The approved SKU sizes are configured in the Prowler configuration file under azure.desired_vm_sku_sizes.
    - PASS: The VM is using a SKU size that is approved by the organization.
    - FAIL: The VM is using a SKU size that is not approved by the organization.
    """

    def execute(self) -> list[Check_Report_Azure]:
        """
        Execute the check to verify that virtual machines are using desired SKU sizes.

        Returns:
            A list of check reports for each virtual machine
        """

        findings = []

        # Get the desired SKU sizes from configuration
        DESIRED_SKU_SIZES = vm_client.audit_config.get(
            "desired_vm_sku_sizes",
            [
                "Standard_A8_v2",
                "Standard_DS3_v2",
                "Standard_D4s_v3",
            ],
        )

        for subscription_name, vms in vm_client.virtual_machines.items():
            for vm in vms.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=vm)
                report.subscription = subscription_name

                if vm.vm_size in DESIRED_SKU_SIZES:
                    report.status = "PASS"
                    report.status_extended = f"VM {vm.resource_name} is using desired SKU size {vm.vm_size} in subscription {subscription_name}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"VM {vm.resource_name} is using {vm.vm_size} which is not a desired SKU size in subscription {subscription_name}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_ensure_attached_disks_encrypted_with_cmk.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_ensure_attached_disks_encrypted_with_cmk/vm_ensure_attached_disks_encrypted_with_cmk.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_ensure_attached_disks_encrypted_with_cmk",
  "CheckTitle": "Ensure that 'OS and Data' disks are encrypted with Customer Managed Key (CMK)",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Compute/virtualMachines",
  "Description": "Ensure that OS disks (boot volumes) and data disks (non-boot volumes) are encrypted with CMK (Customer Managed Keys). Customer Managed keys can be either ADE or Server Side Encryption (SSE).",
  "Risk": "Encrypting the IaaS VM's OS disk (boot volume) and Data disks (non-boot volume) ensures that the entire content is fully unrecoverable without a key, thus protecting the volume from unwanted reads. PMK (Platform Managed Keys) are enabled by default in Azure-managed disks and allow encryption at rest. CMK is recommended because it gives the customer the option to control which specific keys are used for the encryption and decryption of the disk. The customer can then change keys and increase security by disabling them instead of relying on the PMK key that remains unchanging. There is also the option to increase security further by using automatically rotating keys so that access to disk is ensured to be limited. Organizations should evaluate what their security requirements are, however, for the data stored on the disk. For high-risk data using CMK is a must, as it provides extra steps of security. If the data is low risk, PMK is enabled by default and provides sufficient data security.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption-overview",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/VirtualMachines/sse-boot-disk-cmk.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/bc_azr_general_1#terraform"
    },
    "Recommendation": {
      "Text": "Note: Disks must be detached from VMs to have encryption changed. 1. Go to Virtual machines 2. For each virtual machine, go to Settings 3. Click on Disks 4. Click the ellipsis (...), then click Detach to detach the disk from the VM 5. Now search for Disks and locate the unattached disk 6. Click the disk then select Encryption 7. Change your encryption type, then select your encryption set 8. Click Save 9. Go back to the VM and re-attach the disk",
      "Url": "https://learn.microsoft.com/en-us/azure/security/fundamentals/data-encryption-best-practices#protect-data-at-rest"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Using CMK/BYOK will entail additional management of keys."
}
```

--------------------------------------------------------------------------------

---[FILE: vm_ensure_attached_disks_encrypted_with_cmk.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_ensure_attached_disks_encrypted_with_cmk/vm_ensure_attached_disks_encrypted_with_cmk.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_ensure_attached_disks_encrypted_with_cmk(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, disks in vm_client.disks.items():
            for disk_id, disk in disks.items():
                if disk.vms_attached:
                    report = Check_Report_Azure(metadata=self.metadata(), resource=disk)
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"Disk '{disk_id}' is encrypted with a customer-managed key in subscription {subscription_name}."

                    if (
                        not disk.encryption_type
                        or disk.encryption_type == "EncryptionAtRestWithPlatformKey"
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"Disk '{disk_id}' is not encrypted with a customer-managed key in subscription {subscription_name}."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_ensure_unattached_disks_encrypted_with_cmk.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_ensure_unattached_disks_encrypted_with_cmk/vm_ensure_unattached_disks_encrypted_with_cmk.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_ensure_unattached_disks_encrypted_with_cmk",
  "CheckTitle": "Ensure that 'Unattached disks' are encrypted with 'Customer Managed Key' (CMK)",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Compute/virtualMachines",
  "Description": "Ensure that unattached disks in a subscription are encrypted with a Customer Managed Key (CMK).",
  "Risk": "Managed disks are encrypted by default with Platform-managed keys. Using Customer-managed keys may provide an additional level of security or meet an organization's regulatory requirements. Encrypting managed disks ensures that its entire content is fully unrecoverable without a key and thus protects the volume from unwarranted reads. Even if the disk is not attached to any of the VMs, there is always a risk where a compromised user account with administrative access to VM service can mount/attach these data disks, which may lead to sensitive information disclosure and tampering.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/security/fundamentals/azure-disk-encryption-vms-vmss",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/VirtualMachines/sse-unattached-disk-cmk.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "If data stored in the disk is no longer useful, refer to Azure documentation to delete unattached data disks at: https://learn.microsoft.com/en-us/rest/api/compute/disks/delete?view=rest-compute-2023-10-02&tabs=HTTP",
      "Url": "https://learn.microsoft.com/en-us/azure/security/fundamentals/data-encryption-best-practices#protect-data-at-rest"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "You must have your key vault set up to utilize this. Encryption is available only on Standard tier VMs. This might cost you more. Utilizing and maintaining Customer-managed keys will require additional work to create, protect, and rotate keys."
}
```

--------------------------------------------------------------------------------

---[FILE: vm_ensure_unattached_disks_encrypted_with_cmk.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_ensure_unattached_disks_encrypted_with_cmk/vm_ensure_unattached_disks_encrypted_with_cmk.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_ensure_unattached_disks_encrypted_with_cmk(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, disks in vm_client.disks.items():
            for disk_id, disk in disks.items():
                if not disk.vms_attached:
                    report = Check_Report_Azure(metadata=self.metadata(), resource=disk)
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"Disk '{disk_id}' is encrypted with a customer-managed key in subscription {subscription_name}."

                    if (
                        not disk.encryption_type
                        or disk.encryption_type == "EncryptionAtRestWithPlatformKey"
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"Disk '{disk_id}' is not encrypted with a customer-managed key in subscription {subscription_name}."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_ensure_using_approved_images.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_ensure_using_approved_images/vm_ensure_using_approved_images.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_ensure_using_approved_images",
  "CheckTitle": "Ensure that Azure VMs are using an approved machine image.",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "image",
  "ResourceIdTemplate": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Compute/images/<virtual-machine-image-id>",
  "Severity": "medium",
  "ResourceType": "Microsoft.Compute/images",
  "Description": "Ensure that all your Azure virtual machine instances are launched from approved machine images only.",
  "Risk": "An approved machine image is a custom virtual machine (VM) image that contains a pre-configured OS and a well-defined stack of server software approved by Azure, fully configured to run your application. Using approved (golden) machine images to launch new VM instances within your Azure cloud environment brings major benefits such as fast and stable application deployment and scaling, secure application stack upgrades, and versioning.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/virtual-machines/windows/create-vm-generalized-managed",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/VirtualMachines/approved-machine-image.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Re-create the required VM instances using the approved (golden) machine image.",
      "Url": "https://docs.microsoft.com/en-us/azure/virtual-machines/windows/create-vm-generalized-managed"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check only validates if the VM was launched from a custom image. It does not validate the image content or security baseline."
}
```

--------------------------------------------------------------------------------

---[FILE: vm_ensure_using_approved_images.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_ensure_using_approved_images/vm_ensure_using_approved_images.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_ensure_using_approved_images(Check):
    """
    Ensure that Azure VMs are using an approved (custom) machine image.

    This check evaluates whether Azure Virtual Machines are launched from an approved (custom) machine image by checking the image reference ID format.

    - PASS: The Azure VM is using an approved custom machine image.
    - FAIL: The Azure VM is not using an approved custom machine image.
    """

    def execute(self):
        findings = []
        for subscription_name, vms in vm_client.virtual_machines.items():
            for vm in vms.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=vm)
                report.subscription = subscription_name
                image_id = getattr(vm, "image_reference", None)
                if (
                    image_id
                    and image_id.startswith("/subscriptions/")
                    and "/providers/Microsoft.Compute/images/" in image_id
                ):
                    report.status = "PASS"
                    report.status_extended = f"VM {vm.resource_name} in subscription {subscription_name} is using an approved machine image: {image_id.split('/')[-1]}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"VM {vm.resource_name} in subscription {subscription_name} is not using an approved machine image."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_ensure_using_managed_disks.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_ensure_using_managed_disks/vm_ensure_using_managed_disks.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_ensure_using_managed_disks",
  "CheckTitle": "Ensure Virtual Machines are utilizing Managed Disks",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Compute/virtualMachines",
  "Description": "Migrate blob-based VHDs to Managed Disks on Virtual Machines to exploit the default features of this configuration. The features include: 1. Default Disk Encryption 2. Resilience, as Microsoft will managed the disk storage and move around if underlying hardware goes faulty 3. Reduction of costs over storage accounts",
  "Risk": "Managed disks are by default encrypted on the underlying hardware, so no additional encryption is required for basic protection. It is available if additional encryption is required. Managed disks are by design more resilient that storage accounts. For ARM-deployed Virtual Machines, Azure Adviser will at some point recommend moving VHDs to managed disks both from a security and cost management perspective.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/virtual-machines/unmanaged-disks-deprecation",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/VirtualMachines/managed-disks-in-use.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-virtual-machines-are-utilizing-managed-disks#terraform"
    },
    "Recommendation": {
      "Text": "1. Using the search feature, go to Virtual Machines 2. Select the virtual machine you would like to convert 3. Select Disks in the menu for the VM 4. At the top select Migrate to managed disks 5. You may follow the prompts to convert the disk and finish by selecting Migrate to start the process",
      "Url": "https://docs.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-data-protection#dp-4-enable-data-at-rest-encryption-by-default"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "There are additional costs for managed disks based off of disk space allocated. When converting to managed disks, VMs will be powered off and back on."
}
```

--------------------------------------------------------------------------------

````
