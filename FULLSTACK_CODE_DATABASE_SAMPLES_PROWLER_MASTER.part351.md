---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 351
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 351 of 867)

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

---[FILE: vm_ensure_using_managed_disks.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_ensure_using_managed_disks/vm_ensure_using_managed_disks.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_ensure_using_managed_disks(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, vms in vm_client.virtual_machines.items():
            for vm in vms.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=vm)
                report.status = "PASS"
                report.subscription = subscription_name
                report.status_extended = f"VM {vm.resource_name} is using managed disks in subscription {subscription_name}"

                using_managed_disks = (
                    True
                    if getattr(
                        getattr(getattr(vm, "storage_profile", None), "os_disk", None),
                        "managed_disk",
                        None,
                    )
                    else False
                )

                if using_managed_disks and getattr(vm, "storage_profile", None):
                    for data_disk in vm.storage_profile.data_disks:
                        if not getattr(data_disk, "managed_disk", None):
                            using_managed_disks = False
                            break

                if not using_managed_disks:
                    report.status = "FAIL"
                    report.status_extended = f"VM {vm.resource_name} is not using managed disks in subscription {subscription_name}"

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_jit_access_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_jit_access_enabled/vm_jit_access_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_jit_access_enabled",
  "CheckTitle": "Enable Just-In-Time Access for Virtual Machines",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "",
  "ResourceIdTemplate": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}",
  "Severity": "high",
  "ResourceType": "Microsoft.Compute/virtualMachines",
  "Description": "Ensure that Microsoft Azure virtual machines are configured to use Just-in-Time (JIT) access.",
  "Risk": "Without JIT access, management ports such as 22 (SSH) and 3389 (RDP) may be exposed, increasing the risk of brute-force and DDoS attacks.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/security-center/security-center-just-in-time?tabs=jit-config-asc%2Cjit-request-asc",
  "Remediation": {
    "Code": {
      "CLI": "az security jit-policy list --query '[*].virtualMachines[*].id | []'",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable Just-in-Time (JIT) network access for your Microsoft Azure virtual machines using the Azure Portal under Security Center > Just-in-time VM access.",
      "Url": "https://docs.microsoft.com/en-us/azure/security-center/security-center-just-in-time?tabs=jit-config-asc%2Cjit-request-asc"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "JIT access can only be enabled via the Azure Portal. Ensure Security Center standard pricing tier for servers is enabled."
}
```

--------------------------------------------------------------------------------

---[FILE: vm_jit_access_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_jit_access_enabled/vm_jit_access_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_jit_access_enabled(Check):
    """
    Ensure that Microsoft Azure virtual machines are configured to use Just-in-Time (JIT) access.

    This check evaluates whether JIT access is enabled for each VM to reduce the attack surface.
    - PASS: VM has JIT access enabled.
    - FAIL: VM does not have JIT access enabled.
    """

    def execute(self):
        findings = []
        jit_enabled_vms = set()
        for subscription_name, vms in vm_client.virtual_machines.items():
            for jit_policy in defender_client.jit_policies[subscription_name].values():
                jit_enabled_vms.update(jit_policy.vm_ids)
            for vm in vms.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=vm)
                report.subscription = subscription_name
                if vm.resource_id.lower() in {
                    vm_id.lower() for vm_id in jit_enabled_vms
                }:
                    report.status = "PASS"
                    report.status_extended = f"VM {vm.resource_name} in subscription {subscription_name} has JIT (Just-in-Time) access enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"VM {vm.resource_name} in subscription {subscription_name} does not have JIT (Just-in-Time) access enabled."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_linux_enforce_ssh_authentication.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_linux_enforce_ssh_authentication/vm_linux_enforce_ssh_authentication.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_linux_enforce_ssh_authentication",
  "CheckTitle": "Ensure SSH key authentication is enforced on Linux-based Virtual Machines",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "",
  "ResourceIdTemplate": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}",
  "Severity": "high",
  "ResourceType": "Microsoft.Compute/virtualMachines",
  "Description": "Ensure that Azure Linux-based virtual machines are configured to use SSH keys by disabling password authentication.",
  "Risk": "Allowing password-based SSH authentication increases the risk of brute-force attacks and unauthorized access. Enforcing SSH key authentication ensures only users with the private key can access the VM.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-ssh-keys-detailed",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/VirtualMachines/ssh-authentication-type.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Recreate Linux VMs with SSH key authentication enabled and password authentication disabled.",
      "Url": "https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-ssh-keys-detailed"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vm_linux_enforce_ssh_authentication.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_linux_enforce_ssh_authentication/vm_linux_enforce_ssh_authentication.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_linux_enforce_ssh_authentication(Check):
    """
    Ensure that Azure Linux-based virtual machines are configured to use SSH keys (password authentication is disabled).

    This check evaluates whether disablePasswordAuthentication is set to True for Linux VMs to ensure only SSH key authentication is allowed.
    - PASS: VM has password authentication disabled (SSH key authentication enforced).
    - FAIL: VM has password authentication enabled (password-based SSH allowed).
    """

    def execute(self) -> list[Check_Report_Azure]:
        findings = []
        for subscription_name, vms in vm_client.virtual_machines.items():
            for vm in vms.values():
                if vm.linux_configuration:
                    report = Check_Report_Azure(metadata=self.metadata(), resource=vm)
                    report.subscription = subscription_name

                    if vm.linux_configuration.disable_password_authentication:
                        report.status = "PASS"
                        report.status_extended = f"VM {vm.resource_name} in subscription {subscription_name} has password authentication disabled (SSH key authentication enforced)."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"VM {vm.resource_name} in subscription {subscription_name} has password authentication enabled (password-based SSH allowed)."
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_scaleset_associated_with_load_balancer.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_scaleset_associated_with_load_balancer/vm_scaleset_associated_with_load_balancer.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_scaleset_associated_with_load_balancer",
  "CheckTitle": "VM Scale Set Is Associated With Load Balancer",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "scaleset",
  "ResourceIdTemplate": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}",
  "Severity": "medium",
  "ResourceType": "Microsoft.Compute/virtualMachineScaleSets",
  "Description": "Ensure that your Azure virtual machine scale sets are using load balancers for traffic distribution.",
  "Risk": "Without load balancer integration, Azure virtual machine scale sets may experience reduced availability and potential service disruptions during traffic spikes or instance failures, leading to degraded user experience and potential business impact.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/virtual-network/network-overview",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/VirtualMachines/associated-load-balancers.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Attach a load balancer to your Azure virtual machine scale set to ensure high availability and optimal traffic distribution.",
      "Url": "https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vm_scaleset_associated_with_load_balancer.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_scaleset_associated_with_load_balancer/vm_scaleset_associated_with_load_balancer.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_scaleset_associated_with_load_balancer(Check):
    """
    Ensure that Azure virtual machine scale sets are associated with a load balancer backend pool.

    This check evaluates whether each VM scale set is associated with at least one load balancer backend pool.
    - PASS: The scale set is associated with a load balancer backend pool.
    - FAIL: The scale set is not associated with any load balancer backend pool.
    """

    def execute(self):
        findings = []
        for subscription, scale_sets in vm_client.vm_scale_sets.items():
            for scale_set in scale_sets.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=scale_set
                )
                report.subscription = subscription
                report.resource_id = scale_set.resource_id
                report.resource_name = scale_set.resource_name
                report.location = scale_set.location
                if scale_set.load_balancer_backend_pools:
                    report.status = "PASS"
                    backend_pool_names = [
                        pool.split("/")[-1]
                        for pool in scale_set.load_balancer_backend_pools
                    ]
                    report.status_extended = f"Scale set '{scale_set.resource_name}' in subscription '{subscription}' is associated with load balancer backend pool(s): {', '.join(backend_pool_names)}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Scale set '{scale_set.resource_name}' in subscription '{subscription}' is not associated with any load balancer backend pool."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_scaleset_not_empty.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_scaleset_not_empty/vm_scaleset_not_empty.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_scaleset_not_empty",
  "CheckTitle": "Check for Empty Virtual Machine Scale Sets",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "scaleset",
  "ResourceIdTemplate": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}",
  "Severity": "low",
  "ResourceType": "Microsoft.Compute/virtualMachineScaleSets",
  "Description": "Identify and remove empty virtual machine scale sets from your Azure cloud account.",
  "Risk": "Empty virtual machine scale sets may incur unnecessary costs and complicate cloud resource management, impacting cost optimization and compliance.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview",
  "Remediation": {
    "Code": {
      "CLI": "az vmss delete --name <scale-set-name> --resource-group <resource-group>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/VirtualMachines/empty-vm-scale-sets.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Remove empty Azure virtual machine scale sets to optimize costs and simplify management.",
      "Url": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/VirtualMachines/empty-vm-scale-sets.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vm_scaleset_not_empty.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_scaleset_not_empty/vm_scaleset_not_empty.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_scaleset_not_empty(Check):
    """
    Ensure that Azure virtual machine scale sets are not empty (i.e., have no VM instances and no load balancer attached).

    This check evaluates whether each VM scale set has zero VM instances and is not associated with any load balancer backend pool.
    - PASS: The scale set has at least one VM instance or is associated with a load balancer backend pool.
    - FAIL: The scale set has no VM instances and is not associated with any load balancer backend pool (i.e., it is empty).
    """

    def execute(self):
        findings = []
        for subscription, scale_sets in vm_client.vm_scale_sets.items():
            for scale_set in scale_sets.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=scale_set
                )
                report.subscription = subscription
                if not scale_set.instance_ids:
                    report.status = "FAIL"
                    report.status_extended = f"Scale set '{scale_set.resource_name}' in subscription '{subscription}' is empty: no VM instances present."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Scale set '{scale_set.resource_name}' in subscription '{subscription}' has {len(scale_set.instance_ids)} VM instances."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_sufficient_daily_backup_retention_period.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_sufficient_daily_backup_retention_period/vm_sufficient_daily_backup_retention_period.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_sufficient_daily_backup_retention_period",
  "CheckTitle": "Ensure there is a sufficient daily backup retention period configured for Azure virtual machines.",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Compute/virtualMachines",
  "Description": "Ensure there is a sufficient daily backup retention period configured for Azure virtual machines.",
  "Risk": "Having an optimal daily backup retention period for your Azure virtual machines will enforce your backup strategy to follow the best practices as specified in the compliance regulations promoted by your organization. Retaining VM backups for a longer period of time will allow you to handle more efficiently your data restoration process in the event of a failure.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/backup/backup-azure-vms-introduction",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/VirtualMachines/sufficient-backup-retention-period.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Set the daily backup retention period for each VM's backup policy to meet or exceed your organization's minimum requirement.",
      "Url": "https://docs.microsoft.com/en-us/azure/backup/backup-azure-vms-introduction"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vm_sufficient_daily_backup_retention_period.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_sufficient_daily_backup_retention_period/vm_sufficient_daily_backup_retention_period.py

```python
from azure.mgmt.recoveryservicesbackup.activestamp.models import DataSourceType

from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.recovery.recovery_client import recovery_client
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_sufficient_daily_backup_retention_period(Check):
    """
    Ensure there is a sufficient daily backup retention period configured for Azure virtual machines.
    - PASS: The VM has a backup policy with sufficient daily retention period.
    - FAIL: The VM does not have a backup policy or the retention period is insufficient.
    """

    def execute(self) -> list[Check_Report_Azure]:
        findings = []
        min_retention_days = getattr(vm_client, "audit_config", {}).get(
            "vm_backup_min_daily_retention_days", 7
        )

        for subscription, vms in vm_client.virtual_machines.items():
            vaults = recovery_client.vaults.get(subscription, {})
            for vm in vms.values():
                backup_found = False
                retention_days = None
                for vault in vaults.values():
                    for backup_item in vault.backup_protected_items.values():
                        if (
                            backup_item.workload_type == DataSourceType.VM
                            and backup_item.name.split(";")[-1] == vm.resource_name
                        ):
                            backup_found = True
                            policy_id = backup_item.backup_policy_id
                            if policy_id and policy_id in vault.backup_policies:
                                retention_days = vault.backup_policies[
                                    policy_id
                                ].retention_days
                            break
                    if backup_found:
                        break
                if backup_found and retention_days:
                    report = Check_Report_Azure(metadata=self.metadata(), resource=vm)
                    report.subscription = subscription
                    if retention_days >= min_retention_days:
                        report.status = "PASS"
                        report.status_extended = f"VM {vm.resource_name} in subscription {subscription} has a daily backup retention period of {retention_days} days (minimum required: {min_retention_days})."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"VM {vm.resource_name} in subscription {subscription} has insufficient daily backup retention period of {retention_days} days (minimum required: {min_retention_days})."
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: vm_trusted_launch_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_trusted_launch_enabled/vm_trusted_launch_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "vm_trusted_launch_enabled",
  "CheckTitle": "Ensure Trusted Launch is enabled on Virtual Machines",
  "CheckType": [],
  "ServiceName": "vm",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Compute/virtualMachines",
  "Description": "When Secure Boot and vTPM are enabled together, they provide a strong foundation for protecting your VM from boot attacks. For example, if an attacker attempts to replace the bootloader with a malicious version, Secure Boot will prevent the VM from booting. If the attacker is able to bypass Secure Boot and install a malicious bootloader, vTPM can be used to detect the intrusion and alert you.",
  "Risk": "Secure Boot and vTPM work together to protect your VM from a variety of boot attacks, including bootkits, rootkits, and firmware rootkits. Not enabling Trusted Launch in Azure VM can lead to increased vulnerability to rootkits and boot-level malware, reduced ability to detect and prevent unauthorized changes to the boot process, and a potential compromise of system integrity and data security.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm?tabs=portal",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Go to Virtual Machines 2. For each VM, under Settings, click on Configuration on the left blade 3. Under Security Type, select 'Trusted Launch Virtual Machines' 4. Make sure Enable Secure Boot & Enable vTPM are checked 5. Click on Apply.",
      "Url": "https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm?tabs=portal#enable-trusted-launch-on-existing-vm"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Secure Boot and vTPM are not currently supported for Azure Generation 1 VMs. IMPORTANT: Before enabling Secure Boot and vTPM on a Generation 2 VM which does not already have both enabled, it is highly recommended to create a restore point of the VM prior to remediation."
}
```

--------------------------------------------------------------------------------

---[FILE: vm_trusted_launch_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/vm/vm_trusted_launch_enabled/vm_trusted_launch_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.vm.vm_client import vm_client


class vm_trusted_launch_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, vms in vm_client.virtual_machines.items():
            for vm in vms.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=vm)
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = f"VM {vm.resource_name} has trusted launch disabled in subscription {subscription_name}"

                if (
                    vm.security_profile
                    and vm.security_profile.security_type == "TrustedLaunch"
                    and vm.security_profile.uefi_settings.secure_boot_enabled
                    and vm.security_profile.uefi_settings.v_tpm_enabled
                ):
                    report.status = "PASS"
                    report.status_extended = f"VM {vm.resource_name} has trusted launch enabled in subscription {subscription_name}"

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: arguments.py]---
Location: prowler-master/prowler/providers/common/arguments.py

```python
import sys
from argparse import Namespace
from importlib import import_module
from typing import Optional, Sequence

from prowler.lib.logger import logger
from prowler.providers.common.provider import Provider, providers_path

provider_arguments_lib_path = "lib.arguments.arguments"
validate_provider_arguments_function = "validate_arguments"
init_provider_arguments_function = "init_parser"


def init_providers_parser(self):
    """init_providers_parser calls the provider init_parser function to load all the arguments and flags. Receives a ProwlerArgumentParser object"""
    # We need to call the arguments parser for each provider
    providers = Provider.get_available_providers()
    for provider in providers:
        try:
            getattr(
                import_module(
                    f"{providers_path}.{provider}.{provider_arguments_lib_path}"
                ),
                init_provider_arguments_function,
            )(self)
        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            sys.exit(1)


def validate_provider_arguments(arguments: Namespace) -> tuple[bool, str]:
    """validate_provider_arguments returns {True, "} if the provider arguments passed are valid and can be used together"""
    try:
        # Provider function must be located at prowler.providers.<provider>.lib.arguments.arguments.validate_arguments
        return getattr(
            import_module(
                f"{providers_path}.{arguments.provider}.{provider_arguments_lib_path}"
            ),
            validate_provider_arguments_function,
        )(arguments)

    # If the provider does not have a lib.arguments package we return (True, "")
    except ModuleNotFoundError:
        return (True, "")

    # If the provider does not have a validate_arguments we return (True, "")
    except AttributeError:
        return (True, "")

    except Exception as error:
        logger.critical(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        sys.exit(1)


def validate_asff_usage(
    provider: Optional[str], output_formats: Optional[Sequence[str]]
) -> tuple[bool, str]:
    """Ensure json-asff output is only requested for the AWS provider."""
    if not output_formats or "json-asff" not in output_formats:
        return (True, "")

    if provider == "aws":
        return (True, "")

    return (
        False,
        f"json-asff output format is only available for the aws provider, but {provider} was selected",
    )
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/providers/common/models.py
Signals: Pydantic

```python
from dataclasses import dataclass
from os import makedirs
from os.path import isdir

from pydantic.v1 import BaseModel

from prowler.providers.common.provider import Provider


# TODO: include this for all the providers
class Audit_Metadata(BaseModel):
    services_scanned: int
    # We can't use a set in the expected
    # checks because the set is unordered
    expected_checks: list
    completed_checks: int
    audit_progress: int


class ProviderOutputOptions:
    status: list[str]
    output_modes: list
    output_directory: str
    bulk_checks_metadata: dict
    verbose: str
    output_filename: str
    only_logs: bool
    unix_timestamp: bool

    def __init__(self, arguments, bulk_checks_metadata):
        self.status = getattr(arguments, "status", None)
        self.output_modes = getattr(arguments, "output_formats", None)
        self.output_directory = getattr(arguments, "output_directory", None)
        self.verbose = getattr(arguments, "verbose", None)
        self.bulk_checks_metadata = bulk_checks_metadata
        self.only_logs = getattr(arguments, "only_logs", None)
        self.unix_timestamp = getattr(arguments, "unix_timestamp", None)
        self.shodan_api_key = getattr(arguments, "shodan", None)
        self.fixer = getattr(arguments, "fixer", None)

        # Shodan API Key
        if self.shodan_api_key:
            # TODO: revisit this logic
            provider = Provider.get_global_provider()
            updated_audit_config = Provider.update_provider_config(
                provider.audit_config, "shodan_api_key", self.shodan_api_key
            )
            if updated_audit_config:
                provider._audit_config = updated_audit_config

        # Check output directory, if it is not created -> create it
        if self.output_directory and not self.fixer:
            if not isdir(self.output_directory):
                if self.output_modes:
                    makedirs(self.output_directory, exist_ok=True)
            if not isdir(self.output_directory + "/compliance"):
                if self.output_modes:
                    makedirs(self.output_directory + "/compliance", exist_ok=True)


@dataclass
class Connection:
    """
    Represents a test connection object.
    Attributes:
        is_connected (bool): Indicates whether the connection is established or not.
        error (Exception): The exception object if an error occurred during the connection test.
    """

    is_connected: bool = False
    error: Exception = None
```

--------------------------------------------------------------------------------

````
