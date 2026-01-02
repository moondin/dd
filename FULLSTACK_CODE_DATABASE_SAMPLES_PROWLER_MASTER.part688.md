---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 688
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 688 of 867)

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

---[FILE: vm_jit_access_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/vm/vm_jit_access_enabled/vm_jit_access_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import JITPolicy
from prowler.providers.azure.services.vm.vm_service import VirtualMachine
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_vm_jit_access_enabled:
    def test_no_subscriptions(self):
        vm_client = mock.MagicMock()
        vm_client.virtual_machines = {}
        defender_client = mock.MagicMock()
        defender_client.jit_policies = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.vm_client",
                new=vm_client,
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled import (
                vm_jit_access_enabled,
            )

            check = vm_jit_access_enabled()
            result = check.execute()
            assert result == []

    def test_no_vms(self):
        vm_client = mock.MagicMock()
        vm_client.virtual_machines = {AZURE_SUBSCRIPTION_ID: {}}
        defender_client = mock.MagicMock()
        defender_client.jit_policies = {AZURE_SUBSCRIPTION_ID: {}}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.vm_client",
                new=vm_client,
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled import (
                vm_jit_access_enabled,
            )

            check = vm_jit_access_enabled()
            result = check.execute()
            assert result == []

    def test_vm_with_jit_enabled(self):
        vm_id = str(uuid4())
        vm_name = "TestVM"
        vm_location = "eastus"
        vm = VirtualMachine(
            resource_id=vm_id,
            resource_name=vm_name,
            location=vm_location,
            security_profile=None,
            extensions=[],
            storage_profile=None,
        )
        vm_client = mock.MagicMock()
        vm_client.virtual_machines = {AZURE_SUBSCRIPTION_ID: {vm_id: vm}}
        defender_client = mock.MagicMock()
        jit_policy = JITPolicy(
            id="policy1",
            name="JITPolicy1",
            location="eastus",
            vm_ids={vm_id},
        )
        defender_client.jit_policies = {
            AZURE_SUBSCRIPTION_ID: {jit_policy.id: jit_policy}
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.vm_client",
                new=vm_client,
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled import (
                vm_jit_access_enabled,
            )

            check = vm_jit_access_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_id == vm_id
            assert result[0].resource_name == vm_name
            assert "has JIT (Just-in-Time) access enabled" in result[0].status_extended

    def test_vm_with_jit_disabled(self):
        vm_id = str(uuid4())
        vm_name = "TestVM"
        vm_location = "eastus"
        vm = VirtualMachine(
            resource_id=vm_id,
            resource_name=vm_name,
            location=vm_location,
            security_profile=None,
            extensions=[],
            storage_profile=None,
        )
        vm_client = mock.MagicMock()
        vm_client.virtual_machines = {AZURE_SUBSCRIPTION_ID: {vm_id: vm}}
        defender_client = mock.MagicMock()
        # JIT policy does not include this VM
        jit_policy = JITPolicy(
            id="policy1",
            name="JITPolicy1",
            location="eastus",
            vm_ids={"some-other-id"},
        )
        defender_client.jit_policies = {
            AZURE_SUBSCRIPTION_ID: {jit_policy.id: jit_policy}
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.vm_client",
                new=vm_client,
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled import (
                vm_jit_access_enabled,
            )

            check = vm_jit_access_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_id == vm_id
            assert result[0].resource_name == vm_name
            assert (
                "does not have JIT (Just-in-Time) access enabled"
                in result[0].status_extended
            )

    def test_vm_id_case_insensitivity(self):
        vm_id = str(uuid4())
        vm_name = "TestVM"
        vm_location = "eastus"
        upper_vm_id = vm_id.upper()
        vm = VirtualMachine(
            resource_id=upper_vm_id,
            resource_name=vm_name,
            location=vm_location,
            security_profile=None,
            extensions=[],
            storage_profile=None,
        )
        vm_client = mock.MagicMock()
        vm_client.virtual_machines = {AZURE_SUBSCRIPTION_ID: {upper_vm_id: vm}}
        defender_client = mock.MagicMock()
        jit_policy = JITPolicy(
            id="policy1",
            name="JITPolicy1",
            location="eastus",
            vm_ids={vm_id.lower()},
        )
        defender_client.jit_policies = {
            AZURE_SUBSCRIPTION_ID: {jit_policy.id: jit_policy}
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.vm_client",
                new=vm_client,
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled import (
                vm_jit_access_enabled,
            )

            check = vm_jit_access_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == upper_vm_id
            assert "has JIT (Just-in-Time) access enabled" in result[0].status_extended

    def test_multiple_vms_and_policies(self):
        vm_id_1 = str(uuid4())
        vm_id_2 = str(uuid4())
        vm1 = VirtualMachine(
            resource_id=vm_id_1,
            resource_name="VM1",
            location="eastus",
            security_profile=None,
            extensions=[],
            storage_profile=None,
        )
        vm2 = VirtualMachine(
            resource_id=vm_id_2,
            resource_name="VM2",
            location="eastus",
            security_profile=None,
            extensions=[],
            storage_profile=None,
        )
        vm_client = mock.MagicMock()
        vm_client.virtual_machines = {
            AZURE_SUBSCRIPTION_ID: {vm_id_1: vm1, vm_id_2: vm2}
        }
        defender_client = mock.MagicMock()
        jit_policy_1 = JITPolicy(
            id="policy1",
            name="JITPolicy1",
            location="eastus",
            vm_ids={vm_id_1},
        )
        jit_policy_2 = JITPolicy(
            id="policy2",
            name="JITPolicy2",
            location="eastus",
            vm_ids=set(),
        )
        defender_client.jit_policies = {
            AZURE_SUBSCRIPTION_ID: {
                jit_policy_1.id: jit_policy_1,
                jit_policy_2.id: jit_policy_2,
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.vm_client",
                new=vm_client,
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_jit_access_enabled.vm_jit_access_enabled import (
                vm_jit_access_enabled,
            )

            check = vm_jit_access_enabled()
            result = check.execute()
            assert len(result) == 2
            for r in result:
                if r.resource_id == vm_id_1:
                    assert r.status == "PASS"
                elif r.resource_id == vm_id_2:
                    assert r.status == "FAIL"
```

--------------------------------------------------------------------------------

---[FILE: vm_linux_enforce_ssh_authentication_test.py]---
Location: prowler-master/tests/providers/azure/services/vm/vm_linux_enforce_ssh_authentication/vm_linux_enforce_ssh_authentication_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.vm.vm_service import (
    LinuxConfiguration,
    VirtualMachine,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_vm_linux_enforce_ssh_authentication:
    def test_no_subscriptions(self):
        vm_client = mock.MagicMock
        vm_client.virtual_machines = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_linux_enforce_ssh_authentication.vm_linux_enforce_ssh_authentication.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_linux_enforce_ssh_authentication.vm_linux_enforce_ssh_authentication import (
                vm_linux_enforce_ssh_authentication,
            )

            check = vm_linux_enforce_ssh_authentication()
            result = check.execute()
            assert len(result) == 0

    def test_empty_subscription(self):
        vm_client = mock.MagicMock
        vm_client.virtual_machines = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_linux_enforce_ssh_authentication.vm_linux_enforce_ssh_authentication.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_linux_enforce_ssh_authentication.vm_linux_enforce_ssh_authentication import (
                vm_linux_enforce_ssh_authentication,
            )

            check = vm_linux_enforce_ssh_authentication()
            result = check.execute()
            assert len(result) == 0

    def test_linux_vm_password_auth_disabled(self):
        vm_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.virtual_machines = {
            AZURE_SUBSCRIPTION_ID: {
                vm_id: VirtualMachine(
                    resource_id=vm_id,
                    resource_name="LinuxVM",
                    location="westeurope",
                    security_profile=None,
                    extensions=[],
                    storage_profile=None,
                    linux_configuration=LinuxConfiguration(
                        disable_password_authentication=True
                    ),
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_linux_enforce_ssh_authentication.vm_linux_enforce_ssh_authentication.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_linux_enforce_ssh_authentication.vm_linux_enforce_ssh_authentication import (
                vm_linux_enforce_ssh_authentication,
            )

            check = vm_linux_enforce_ssh_authentication()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "LinuxVM"
            assert result[0].resource_id == vm_id
            assert "password authentication disabled" in result[0].status_extended

    def test_linux_vm_password_auth_enabled(self):
        vm_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.virtual_machines = {
            AZURE_SUBSCRIPTION_ID: {
                vm_id: VirtualMachine(
                    resource_id=vm_id,
                    resource_name="LinuxVM",
                    location="westeurope",
                    security_profile=None,
                    extensions=[],
                    storage_profile=None,
                    linux_configuration=LinuxConfiguration(
                        disable_password_authentication=False
                    ),
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_linux_enforce_ssh_authentication.vm_linux_enforce_ssh_authentication.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_linux_enforce_ssh_authentication.vm_linux_enforce_ssh_authentication import (
                vm_linux_enforce_ssh_authentication,
            )

            check = vm_linux_enforce_ssh_authentication()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "LinuxVM"
            assert result[0].resource_id == vm_id
            assert "password authentication enabled" in result[0].status_extended

    def test_non_linux_vm(self):
        vm_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.virtual_machines = {
            AZURE_SUBSCRIPTION_ID: {
                vm_id: VirtualMachine(
                    resource_id=vm_id,
                    resource_name="WindowsVM",
                    location="westeurope",
                    security_profile=None,
                    extensions=[],
                    storage_profile=None,
                    linux_configuration=None,  # Not a Linux VM
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_linux_enforce_ssh_authentication.vm_linux_enforce_ssh_authentication.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_linux_enforce_ssh_authentication.vm_linux_enforce_ssh_authentication import (
                vm_linux_enforce_ssh_authentication,
            )

            check = vm_linux_enforce_ssh_authentication()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: vm_scaleset_associated_with_load_balancer_test.py]---
Location: prowler-master/tests/providers/azure/services/vm/vm_scaleset_associated_with_load_balancer/vm_scaleset_associated_with_load_balancer_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.vm.vm_service import VirtualMachineScaleSet
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_vm_scaleset_associated_with_load_balancer:
    def test_no_subscriptions(self):
        vm_scale_sets = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_client.vm_client.vm_scale_sets",
                new=vm_scale_sets,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_scaleset_associated_with_load_balancer.vm_scaleset_associated_with_load_balancer import (
                vm_scaleset_associated_with_load_balancer,
            )

            check = vm_scaleset_associated_with_load_balancer()
            result = check.execute()
            assert len(result) == 0

    def test_empty_scale_sets(self):
        vm_scale_sets = {AZURE_SUBSCRIPTION_ID: {}}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_client.vm_client.vm_scale_sets",
                new=vm_scale_sets,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_scaleset_associated_with_load_balancer.vm_scaleset_associated_with_load_balancer import (
                vm_scaleset_associated_with_load_balancer,
            )

            check = vm_scaleset_associated_with_load_balancer()
            result = check.execute()
            assert len(result) == 0

    def test_compliant_scale_set(self):
        vmss_id = str(uuid4())
        backend_pool_id = f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/resourceGroups/rg/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/bepool"
        vm_scale_sets = {
            AZURE_SUBSCRIPTION_ID: {
                vmss_id: VirtualMachineScaleSet(
                    resource_id=vmss_id,
                    resource_name="compliant-vmss",
                    location="eastus",
                    load_balancer_backend_pools=[backend_pool_id],
                    instance_ids=[],
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_client.vm_client.vm_scale_sets",
                new=vm_scale_sets,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_scaleset_associated_with_load_balancer.vm_scaleset_associated_with_load_balancer import (
                vm_scaleset_associated_with_load_balancer,
            )

            check = vm_scaleset_associated_with_load_balancer()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == vmss_id
            assert result[0].resource_name == "compliant-vmss"
            assert result[0].location == "eastus"
            expected_status_extended = (
                f"Scale set 'compliant-vmss' in subscription '{AZURE_SUBSCRIPTION_ID}' "
                f"is associated with load balancer backend pool(s): bepool."
            )
            assert result[0].status_extended == expected_status_extended

    def test_noncompliant_scale_set(self):
        vmss_id = str(uuid4())
        vm_scale_sets = {
            AZURE_SUBSCRIPTION_ID: {
                vmss_id: VirtualMachineScaleSet(
                    resource_id=vmss_id,
                    resource_name="noncompliant-vmss",
                    location="westeurope",
                    load_balancer_backend_pools=[],
                    instance_ids=[],
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_client.vm_client.vm_scale_sets",
                new=vm_scale_sets,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_scaleset_associated_with_load_balancer.vm_scaleset_associated_with_load_balancer import (
                vm_scaleset_associated_with_load_balancer,
            )

            check = vm_scaleset_associated_with_load_balancer()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == vmss_id
            assert result[0].resource_name == "noncompliant-vmss"
            assert result[0].location == "westeurope"
            expected_status_extended = (
                f"Scale set 'noncompliant-vmss' in subscription '{AZURE_SUBSCRIPTION_ID}' "
                f"is not associated with any load balancer backend pool."
            )
            assert result[0].status_extended == expected_status_extended

    def test_multiple_scale_sets(self):
        compliant_id = str(uuid4())
        noncompliant_id = str(uuid4())
        backend_pool_id = f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/resourceGroups/rg/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/bepool"
        vm_scale_sets = {
            AZURE_SUBSCRIPTION_ID: {
                compliant_id: VirtualMachineScaleSet(
                    resource_id=compliant_id,
                    resource_name="compliant-vmss",
                    location="eastus",
                    load_balancer_backend_pools=[backend_pool_id],
                    instance_ids=[],
                ),
                noncompliant_id: VirtualMachineScaleSet(
                    resource_id=noncompliant_id,
                    resource_name="noncompliant-vmss",
                    location="westeurope",
                    load_balancer_backend_pools=[],
                    instance_ids=[],
                ),
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_client.vm_client.vm_scale_sets",
                new=vm_scale_sets,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_scaleset_associated_with_load_balancer.vm_scaleset_associated_with_load_balancer import (
                vm_scaleset_associated_with_load_balancer,
            )

            check = vm_scaleset_associated_with_load_balancer()
            result = check.execute()
            assert len(result) == 2
            for r in result:
                if r.resource_name == "compliant-vmss":
                    expected_status_extended = (
                        f"Scale set 'compliant-vmss' in subscription '{AZURE_SUBSCRIPTION_ID}' "
                        f"is associated with load balancer backend pool(s): bepool."
                    )
                    assert r.status == "PASS"
                    assert r.status_extended == expected_status_extended
                elif r.resource_name == "noncompliant-vmss":
                    expected_status_extended = (
                        f"Scale set 'noncompliant-vmss' in subscription '{AZURE_SUBSCRIPTION_ID}' "
                        f"is not associated with any load balancer backend pool."
                    )
                    assert r.status == "FAIL"
                    assert r.status_extended == expected_status_extended

    def test_missing_attributes(self):
        # Simulate a scale set with missing optional attributes
        vmss_id = str(uuid4())
        vm_scale_sets = {
            AZURE_SUBSCRIPTION_ID: {
                vmss_id: VirtualMachineScaleSet(
                    resource_id=vmss_id,
                    resource_name="",
                    location="",
                    load_balancer_backend_pools=[],
                    instance_ids=[],
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_client.vm_client.vm_scale_sets",
                new=vm_scale_sets,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_scaleset_associated_with_load_balancer.vm_scaleset_associated_with_load_balancer import (
                vm_scaleset_associated_with_load_balancer,
            )

            check = vm_scaleset_associated_with_load_balancer()
            result = check.execute()
            assert len(result) == 1
            expected_status_extended = f"Scale set '' in subscription '{AZURE_SUBSCRIPTION_ID}' is not associated with any load balancer backend pool."
            assert result[0].status == "FAIL"
            assert result[0].status_extended == expected_status_extended
```

--------------------------------------------------------------------------------

---[FILE: vm_scaleset_not_empty_test.py]---
Location: prowler-master/tests/providers/azure/services/vm/vm_scaleset_not_empty/vm_scaleset_not_empty_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.vm.vm_service import VirtualMachineScaleSet
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_vm_scaleset_not_empty:
    def test_no_subscriptions(self):
        vm_scale_sets = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_client.vm_client.vm_scale_sets",
                new=vm_scale_sets,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_scaleset_not_empty.vm_scaleset_not_empty import (
                vm_scaleset_not_empty,
            )

            check = vm_scaleset_not_empty()
            result = check.execute()
            assert len(result) == 0

    def test_empty_scale_sets(self):
        vm_scale_sets = {AZURE_SUBSCRIPTION_ID: {}}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_client.vm_client.vm_scale_sets",
                new=vm_scale_sets,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_scaleset_not_empty.vm_scaleset_not_empty import (
                vm_scaleset_not_empty,
            )

            check = vm_scaleset_not_empty()
            result = check.execute()
            assert len(result) == 0

    def test_scale_set_with_no_instances(self):
        vmss_id = str(uuid4())
        vm_scale_sets = {
            AZURE_SUBSCRIPTION_ID: {
                vmss_id: VirtualMachineScaleSet(
                    resource_id=vmss_id,
                    resource_name="empty-vmss",
                    location="eastus",
                    load_balancer_backend_pools=[],
                    instance_ids=[],
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_client.vm_client.vm_scale_sets",
                new=vm_scale_sets,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_scaleset_not_empty.vm_scaleset_not_empty import (
                vm_scaleset_not_empty,
            )

            check = vm_scaleset_not_empty()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == vmss_id
            assert result[0].resource_name == "empty-vmss"
            assert result[0].location == "eastus"
            expected_status_extended = f"Scale set 'empty-vmss' in subscription '{AZURE_SUBSCRIPTION_ID}' is empty: no VM instances present."
            assert result[0].status_extended == expected_status_extended

    def test_scale_set_with_instances(self):
        vmss_id = str(uuid4())
        instance_ids = ["1", "2"]
        vm_scale_sets = {
            AZURE_SUBSCRIPTION_ID: {
                vmss_id: VirtualMachineScaleSet(
                    resource_id=vmss_id,
                    resource_name="nonempty-vmss",
                    location="westeurope",
                    load_balancer_backend_pools=[],
                    instance_ids=instance_ids,
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_client.vm_client.vm_scale_sets",
                new=vm_scale_sets,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_scaleset_not_empty.vm_scaleset_not_empty import (
                vm_scaleset_not_empty,
            )

            check = vm_scaleset_not_empty()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == vmss_id
            assert result[0].resource_name == "nonempty-vmss"
            assert result[0].location == "westeurope"
            expected_status_extended = f"Scale set 'nonempty-vmss' in subscription '{AZURE_SUBSCRIPTION_ID}' has {len(instance_ids)} VM instances."
            assert result[0].status_extended == expected_status_extended

    def test_multiple_scale_sets(self):
        empty_id = str(uuid4())
        nonempty_id = str(uuid4())
        instance_ids = ["1"]
        vm_scale_sets = {
            AZURE_SUBSCRIPTION_ID: {
                empty_id: VirtualMachineScaleSet(
                    resource_id=empty_id,
                    resource_name="empty-vmss",
                    location="eastus",
                    load_balancer_backend_pools=[],
                    instance_ids=[],
                ),
                nonempty_id: VirtualMachineScaleSet(
                    resource_id=nonempty_id,
                    resource_name="nonempty-vmss",
                    location="westeurope",
                    load_balancer_backend_pools=[],
                    instance_ids=instance_ids,
                ),
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_client.vm_client.vm_scale_sets",
                new=vm_scale_sets,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_scaleset_not_empty.vm_scaleset_not_empty import (
                vm_scaleset_not_empty,
            )

            check = vm_scaleset_not_empty()
            result = check.execute()
            assert len(result) == 2
            for r in result:
                if r.resource_name == "empty-vmss":
                    expected_status_extended = f"Scale set 'empty-vmss' in subscription '{AZURE_SUBSCRIPTION_ID}' is empty: no VM instances present."
                    assert r.status == "FAIL"
                    assert r.status_extended == expected_status_extended
                elif r.resource_name == "nonempty-vmss":
                    expected_status_extended = f"Scale set 'nonempty-vmss' in subscription '{AZURE_SUBSCRIPTION_ID}' has {len(instance_ids)} VM instances."
                    assert r.status == "PASS"
                    assert r.status_extended == expected_status_extended
```

--------------------------------------------------------------------------------

````
