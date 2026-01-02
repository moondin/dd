---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 687
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 687 of 867)

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

---[FILE: vm_ensure_attached_disks_encrypted_with_cmk_test.py]---
Location: prowler-master/tests/providers/azure/services/vm/vm_ensure_attached_disks_encrypted_with_cmk/vm_ensure_attached_disks_encrypted_with_cmk_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.vm.vm_service import Disk
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_vm_ensure_attached_disks_encrypted_with_cmk:
    def test_vm_no_subscriptions(self):
        vm_client = mock.MagicMock
        vm_client.disks = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk import (
                vm_ensure_attached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_attached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 0

    def test_vm_subscription_empty(self):
        vm_client = mock.MagicMock
        vm_client.disks = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk import (
                vm_ensure_attached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_attached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 0

    def test_vm_subscription_one_disk_attached_encrypt_pk(self):
        disk_id = str(uuid4())
        resource_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.disks = {
            AZURE_SUBSCRIPTION_ID: {
                disk_id: Disk(
                    resource_id=resource_id,
                    resource_name="test-disk",
                    vms_attached=[str(uuid4())],
                    encryption_type="EncryptionAtRestWithPlatformKey",
                    location="location",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk import (
                vm_ensure_attached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_attached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 1
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].status == "FAIL"
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "test-disk"
            assert result[0].location == "location"
            assert (
                result[0].status_extended
                == f"Disk '{disk_id}' is not encrypted with a customer-managed key in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_vm_subscription_one_disk_attached_encrypt_cmk(self):
        disk_id = str(uuid4())
        resource_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.disks = {
            AZURE_SUBSCRIPTION_ID: {
                disk_id: Disk(
                    resource_id=resource_id,
                    resource_name="test-disk",
                    vms_attached=[str(uuid4())],
                    encryption_type="EncryptionAtRestWithCustomerKey",
                    location="location",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk import (
                vm_ensure_attached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_attached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 1
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].status == "PASS"
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "test-disk"
            assert result[0].location == "location"
            assert (
                result[0].status_extended
                == f"Disk '{disk_id}' is encrypted with a customer-managed key in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_vm_subscription_two_disk_attached_encrypt_cmk_and_pk(self):
        disk_id_1 = str(uuid4())
        resource_id_1 = str(uuid4())
        disk_id_2 = str(uuid4())
        resource_id_2 = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.disks = {
            AZURE_SUBSCRIPTION_ID: {
                disk_id_1: Disk(
                    resource_id=resource_id_1,
                    resource_name="test-disk",
                    vms_attached=[str(uuid4())],
                    encryption_type="EncryptionAtRestWithPlatformKey",
                    location="location",
                ),
                disk_id_2: Disk(
                    resource_id=resource_id_2,
                    resource_name="test-disk-2",
                    vms_attached=[str(uuid4()), str(uuid4())],
                    encryption_type="EncryptionAtRestWithCustomerKey",
                    location="location2",
                ),
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk import (
                vm_ensure_attached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_attached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 2
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].status == "FAIL"
            assert result[0].resource_id == resource_id_1
            assert result[0].resource_name == "test-disk"
            assert result[0].location == "location"
            assert (
                result[0].status_extended
                == f"Disk '{disk_id_1}' is not encrypted with a customer-managed key in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[1].status == "PASS"
            assert result[1].resource_id == resource_id_2
            assert result[1].resource_name == "test-disk-2"
            assert result[1].location == "location2"
            assert (
                result[1].status_extended
                == f"Disk '{disk_id_2}' is encrypted with a customer-managed key in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_vm_unattached_disk_encrypt_cmk(self):
        disk_id = str(uuid4())
        resource_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.disks = {
            AZURE_SUBSCRIPTION_ID: {
                disk_id: Disk(
                    resource_id=resource_id,
                    resource_name="test-disk",
                    vms_attached=[],
                    encryption_type="EncryptionAtRestWithCustomerKey",
                    location="location",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_attached_disks_encrypted_with_cmk.vm_ensure_attached_disks_encrypted_with_cmk import (
                vm_ensure_attached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_attached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: vm_ensure_unattached_disks_encrypted_with_cmk_test.py]---
Location: prowler-master/tests/providers/azure/services/vm/vm_ensure_unattached_disks_encrypted_with_cmk/vm_ensure_unattached_disks_encrypted_with_cmk_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.vm.vm_service import Disk
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_vm_ensure_unattached_disks_encrypted_with_cmk:
    def test_vm_no_subscriptions(self):
        vm_client = mock.MagicMock
        vm_client.disks = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk import (
                vm_ensure_unattached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_unattached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 0

    def test_vm_subscription_empty(self):
        vm_client = mock.MagicMock
        vm_client.disks = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk import (
                vm_ensure_unattached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_unattached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 0

    def test_vm_one_unattached_disk_encrypt_pk(self):
        disk_id = str(uuid4())
        resource_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.disks = {
            AZURE_SUBSCRIPTION_ID: {
                disk_id: Disk(
                    resource_id=resource_id,
                    resource_name="test-disk",
                    vms_attached=[],
                    encryption_type="EncryptionAtRestWithPlatformKey",
                    location="location",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk import (
                vm_ensure_unattached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_unattached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 1
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].status == "FAIL"
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "test-disk"
            assert result[0].location == "location"
            assert (
                result[0].status_extended
                == f"Disk '{disk_id}' is not encrypted with a customer-managed key in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_vm_one_unattached_disk_encrypt_cmk(self):
        disk_id = str(uuid4())
        resource_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.disks = {
            AZURE_SUBSCRIPTION_ID: {
                disk_id: Disk(
                    resource_id=resource_id,
                    resource_name="test-disk",
                    vms_attached=[],
                    encryption_type="EncryptionAtRestWithCustomerKey",
                    location="location",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk import (
                vm_ensure_unattached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_unattached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 1
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].status == "PASS"
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "test-disk"
            assert result[0].location == "location"
            assert (
                result[0].status_extended
                == f"Disk '{disk_id}' is encrypted with a customer-managed key in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_vm_subscription_two_unattached_disk_encrypt_cmk_and_pk(self):
        disk_id_1 = str(uuid4())
        resource_id_1 = str(uuid4())
        disk_id_2 = str(uuid4())
        resource_id_2 = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.disks = {
            AZURE_SUBSCRIPTION_ID: {
                disk_id_1: Disk(
                    resource_id=resource_id_1,
                    resource_name="test-disk",
                    vms_attached=[],
                    location="location",
                    encryption_type="EncryptionAtRestWithPlatformKey",
                ),
                disk_id_2: Disk(
                    resource_id=resource_id_2,
                    resource_name="test-disk-2",
                    vms_attached=[],
                    location="location2",
                    encryption_type="EncryptionAtRestWithCustomerKey",
                ),
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk import (
                vm_ensure_unattached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_unattached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 2
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].status == "FAIL"
            assert result[0].resource_id == resource_id_1
            assert result[0].resource_name == "test-disk"
            assert result[0].location == "location"
            assert (
                result[0].status_extended
                == f"Disk '{disk_id_1}' is not encrypted with a customer-managed key in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[1].status == "PASS"
            assert result[1].resource_id == resource_id_2
            assert result[1].resource_name == "test-disk-2"
            assert result[1].location == "location2"
            assert (
                result[1].status_extended
                == f"Disk '{disk_id_2}' is encrypted with a customer-managed key in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_vm_attached_disk_encrypt_cmk(self):
        disk_id = str(uuid4())
        resource_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.disks = {
            AZURE_SUBSCRIPTION_ID: {
                disk_id: Disk(
                    resource_id=resource_id,
                    resource_name="test-disk",
                    vms_attached=[str(uuid4())],
                    encryption_type="EncryptionAtRestWithCustomerKey",
                    location="location",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_unattached_disks_encrypted_with_cmk.vm_ensure_unattached_disks_encrypted_with_cmk import (
                vm_ensure_unattached_disks_encrypted_with_cmk,
            )

            check = vm_ensure_unattached_disks_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: vm_ensure_using_approved_images_test.py]---
Location: prowler-master/tests/providers/azure/services/vm/vm_ensure_using_approved_images/vm_ensure_using_approved_images_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.vm.vm_service import VirtualMachine
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_vm_ensure_using_approved_images:
    def test_no_subscriptions(self):
        vm_client = mock.MagicMock()
        vm_client.virtual_machines = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_using_approved_images.vm_ensure_using_approved_images.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_using_approved_images.vm_ensure_using_approved_images import (
                vm_ensure_using_approved_images,
            )

            check = vm_ensure_using_approved_images()
            result = check.execute()
            assert len(result) == 0

    def test_empty_vms_in_subscription(self):
        vm_client = mock.MagicMock()
        vm_client.virtual_machines = {AZURE_SUBSCRIPTION_ID: {}}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_using_approved_images.vm_ensure_using_approved_images.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_using_approved_images.vm_ensure_using_approved_images import (
                vm_ensure_using_approved_images,
            )

            check = vm_ensure_using_approved_images()
            result = check.execute()
            assert len(result) == 0

    def test_vm_with_approved_image(self):
        vm_id = str(uuid4())
        approved_image_id = f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/resourceGroups/rg/providers/Microsoft.Compute/images/custom-image"
        vm = VirtualMachine(
            resource_id=vm_id,
            resource_name="VMTestApproved",
            location="westeurope",
            security_profile=None,
            extensions=[],
            storage_profile=None,
            image_reference=approved_image_id,
        )
        vm_client = mock.MagicMock()
        vm_client.virtual_machines = {AZURE_SUBSCRIPTION_ID: {vm_id: vm}}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_using_approved_images.vm_ensure_using_approved_images.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_using_approved_images.vm_ensure_using_approved_images import (
                vm_ensure_using_approved_images,
            )

            check = vm_ensure_using_approved_images()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_name == "VMTestApproved"
            assert result[0].resource_id == vm_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            expected_status_extended = f"VM VMTestApproved in subscription {AZURE_SUBSCRIPTION_ID} is using an approved machine image: custom-image."
            assert result[0].status_extended == expected_status_extended

    def test_vm_with_not_approved_image(self):
        vm_id = str(uuid4())
        not_approved_image_id = "/subscriptions/other/resourceGroups/rg/providers/Microsoft.Compute/otherResource/other-image"
        vm = VirtualMachine(
            resource_id=vm_id,
            resource_name="VMTestNotApproved",
            location="westeurope",
            security_profile=None,
            extensions=[],
            storage_profile=None,
            image_reference=not_approved_image_id,
        )
        vm_client = mock.MagicMock()
        vm_client.virtual_machines = {AZURE_SUBSCRIPTION_ID: {vm_id: vm}}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_using_approved_images.vm_ensure_using_approved_images.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_using_approved_images.vm_ensure_using_approved_images import (
                vm_ensure_using_approved_images,
            )

            check = vm_ensure_using_approved_images()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_name == "VMTestNotApproved"
            assert result[0].resource_id == vm_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            expected_status_extended = f"VM VMTestNotApproved in subscription {AZURE_SUBSCRIPTION_ID} is not using an approved machine image."
            assert result[0].status_extended == expected_status_extended

    def test_vm_with_missing_image_reference(self):
        vm_id = str(uuid4())
        vm = VirtualMachine(
            resource_id=vm_id,
            resource_name="VMTestNoImageRef",
            location="westeurope",
            security_profile=None,
            extensions=[],
            storage_profile=None,
            image_reference=None,
        )
        vm_client = mock.MagicMock()
        vm_client.virtual_machines = {AZURE_SUBSCRIPTION_ID: {vm_id: vm}}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_using_approved_images.vm_ensure_using_approved_images.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_using_approved_images.vm_ensure_using_approved_images import (
                vm_ensure_using_approved_images,
            )

            check = vm_ensure_using_approved_images()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_name == "VMTestNoImageRef"
            assert result[0].resource_id == vm_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            expected_status_extended = f"VM VMTestNoImageRef in subscription {AZURE_SUBSCRIPTION_ID} is not using an approved machine image."
            assert result[0].status_extended == expected_status_extended
```

--------------------------------------------------------------------------------

---[FILE: vm_ensure_using_managed_disks_test.py]---
Location: prowler-master/tests/providers/azure/services/vm/vm_ensure_using_managed_disks/vm_ensure_using_managed_disks_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.vm.vm_service import (
    DataDisk,
    ManagedDiskParameters,
    OSDisk,
    SecurityProfile,
    StorageProfile,
    UefiSettings,
    VirtualMachine,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_vm_ensure_using_managed_disks:
    def test_vm_no_subscriptions(self):
        vm_client = mock.MagicMock
        vm_client.virtual_machines = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_using_managed_disks.vm_ensure_using_managed_disks.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_using_managed_disks.vm_ensure_using_managed_disks import (
                vm_ensure_using_managed_disks,
            )

            check = vm_ensure_using_managed_disks()
            result = check.execute()
            assert len(result) == 0

    def test_vm_subscriptions(self):
        vm_client = mock.MagicMock
        vm_client.virtual_machines = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_using_managed_disks.vm_ensure_using_managed_disks.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_using_managed_disks.vm_ensure_using_managed_disks import (
                vm_ensure_using_managed_disks,
            )

            check = vm_ensure_using_managed_disks()
            result = check.execute()
            assert len(result) == 0

    def test_vm_ensure_using_managed_disks(self):
        vm_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.virtual_machines = {
            AZURE_SUBSCRIPTION_ID: {
                vm_id: VirtualMachine(
                    resource_id=vm_id,
                    resource_name="VMTest",
                    location="location",
                    security_profile=SecurityProfile(
                        security_type="TrustedLaunch",
                        uefi_settings=UefiSettings(
                            secure_boot_enabled=True,
                            v_tpm_enabled=True,
                        ),
                    ),
                    extensions=[],
                    storage_profile=StorageProfile(
                        os_disk=OSDisk(
                            name="os_disk_name",
                            operating_system_type="Linux",
                            managed_disk=ManagedDiskParameters(id="managed_disk_id"),
                        ),
                        data_disks=[],
                    ),
                    linux_configuration=None,
                ),
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_using_managed_disks.vm_ensure_using_managed_disks.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_using_managed_disks.vm_ensure_using_managed_disks import (
                vm_ensure_using_managed_disks,
            )

            check = vm_ensure_using_managed_disks()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "VMTest"
            assert result[0].location == "location"
            assert result[0].resource_id == vm_id
            assert (
                result[0].status_extended
                == f"VM VMTest is using managed disks in subscription {AZURE_SUBSCRIPTION_ID}"
            )

    def test_vm_using_not_managed_os_disk(self):
        vm_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.virtual_machines = {
            AZURE_SUBSCRIPTION_ID: {
                vm_id: VirtualMachine(
                    resource_id=vm_id,
                    resource_name="VMTest",
                    location="location",
                    security_profile=SecurityProfile(
                        security_type="TrustedLaunch",
                        uefi_settings=UefiSettings(
                            secure_boot_enabled=True,
                            v_tpm_enabled=True,
                        ),
                    ),
                    extensions=[],
                    storage_profile=StorageProfile(
                        os_disk=OSDisk(
                            name="os_disk_name",
                            operating_system_type="Linux",
                            managed_disk=None,
                        ),
                        data_disks=[],
                    ),
                    linux_configuration=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_using_managed_disks.vm_ensure_using_managed_disks.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_using_managed_disks.vm_ensure_using_managed_disks import (
                vm_ensure_using_managed_disks,
            )

            check = vm_ensure_using_managed_disks()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "VMTest"
            assert result[0].resource_id == vm_id
            assert result[0].location == "location"
            assert (
                result[0].status_extended
                == f"VM VMTest is not using managed disks in subscription {AZURE_SUBSCRIPTION_ID}"
            )

    def test_vm_using_not_managed_data_disks(self):
        vm_id = str(uuid4())
        vm_client = mock.MagicMock
        vm_client.virtual_machines = {
            AZURE_SUBSCRIPTION_ID: {
                vm_id: VirtualMachine(
                    resource_id=vm_id,
                    resource_name="VMTest",
                    location="location",
                    security_profile=SecurityProfile(
                        security_type="TrustedLaunch",
                        uefi_settings=UefiSettings(
                            secure_boot_enabled=True,
                            v_tpm_enabled=True,
                        ),
                    ),
                    extensions=[],
                    storage_profile=StorageProfile(
                        os_disk=OSDisk(
                            name="os_disk_name",
                            operating_system_type="Linux",
                            managed_disk=ManagedDiskParameters(id="managed_disk_id"),
                        ),
                        data_disks=[
                            DataDisk(lun=0, name="data_disk_1", managed_disk=None)
                        ],
                    ),
                    linux_configuration=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.vm.vm_ensure_using_managed_disks.vm_ensure_using_managed_disks.vm_client",
                new=vm_client,
            ),
        ):
            from prowler.providers.azure.services.vm.vm_ensure_using_managed_disks.vm_ensure_using_managed_disks import (
                vm_ensure_using_managed_disks,
            )

            check = vm_ensure_using_managed_disks()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "VMTest"
            assert result[0].resource_id == vm_id
            assert result[0].location == "location"
            assert (
                result[0].status_extended
                == f"VM VMTest is not using managed disks in subscription {AZURE_SUBSCRIPTION_ID}"
            )
```

--------------------------------------------------------------------------------

````
