---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 704
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 704 of 867)

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

---[FILE: compute_instance_default_service_account_in_use_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_instance_default_service_account_in_use/compute_instance_default_service_account_in_use_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_instance_default_service_account_in_use:
    def test_compute_no_instances(self):
        compute_client = mock.MagicMock()
        compute_client.instances = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_default_service_account_in_use.compute_instance_default_service_account_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_default_service_account_in_use.compute_instance_default_service_account_in_use import (
                compute_instance_default_service_account_in_use,
            )

            check = compute_instance_default_service_account_in_use()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_instance(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            region="us-central1",
            zone="us-central1-a",
            public_ip=True,
            metadata={},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            ip_forward=False,
            disks_encryption=[("disk1", False), ("disk2", False)],
            service_accounts=[{"email": "custom@developer.gserviceaccount.com"}],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_default_service_account_in_use.compute_instance_default_service_account_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_default_service_account_in_use.compute_instance_default_service_account_in_use import (
                compute_instance_default_service_account_in_use,
            )

            check = compute_instance_default_service_account_in_use()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"The default service account is not configured to be used with VM Instance {instance.name}",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_compliant_instance_gke(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="gke-test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[
                {"email": f"{GCP_PROJECT_ID}-compute@developer.gserviceaccount.com"}
            ],
            ip_forward=False,
            disks_encryption=[("disk1", False), ("disk2", False)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_default_service_account_in_use.compute_instance_default_service_account_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_default_service_account_in_use.compute_instance_default_service_account_in_use import (
                compute_instance_default_service_account_in_use,
            )

            check = compute_instance_default_service_account_in_use()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"The default service account is not configured to be used with VM Instance {instance.name}",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_instance_with_default_service_account(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[
                {"email": f"{GCP_PROJECT_ID}-compute@developer.gserviceaccount.com"}
            ],
            ip_forward=False,
            disks_encryption=[("disk1", False), ("disk2", False)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_default_service_account_in_use.compute_instance_default_service_account_in_use.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_default_service_account_in_use.compute_instance_default_service_account_in_use import (
                compute_instance_default_service_account_in_use,
            )

            check = compute_instance_default_service_account_in_use()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"The default service account is configured to be used with VM Instance {instance.name}",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_deletion_protection_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_instance_deletion_protection_enabled/compute_instance_deletion_protection_enabled_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class TestComputeInstanceDeletionProtectionEnabled:
    def test_compute_no_instances(self):
        compute_client = mock.MagicMock()
        compute_client.instances = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_deletion_protection_enabled.compute_instance_deletion_protection_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_deletion_protection_enabled.compute_instance_deletion_protection_enabled import (
                compute_instance_deletion_protection_enabled,
            )

            check = compute_instance_deletion_protection_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_instance_deletion_protection_enabled(self):
        compute_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_deletion_protection_enabled.compute_instance_deletion_protection_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_deletion_protection_enabled.compute_instance_deletion_protection_enabled import (
                compute_instance_deletion_protection_enabled,
            )
            from prowler.providers.gcp.services.compute.compute_service import Instance

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.region = GCP_US_CENTER1_LOCATION

            compute_client.instances = [
                Instance(
                    name="test-instance",
                    id="1234567890",
                    zone=f"{GCP_US_CENTER1_LOCATION}-a",
                    region=GCP_US_CENTER1_LOCATION,
                    public_ip=False,
                    metadata={},
                    shielded_enabled_vtpm=True,
                    shielded_enabled_integrity_monitoring=True,
                    confidential_computing=False,
                    service_accounts=[
                        {"email": "123-compute@developer.gserviceaccount.com"}
                    ],
                    ip_forward=False,
                    disks_encryption=[],
                    project_id=GCP_PROJECT_ID,
                    deletion_protection=True,
                )
            ]

            check = compute_instance_deletion_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"VM Instance {compute_client.instances[0].name} has deletion protection enabled."
            )
            assert result[0].resource_id == "1234567890"
            assert result[0].resource_name == "test-instance"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_instance_deletion_protection_disabled(self):
        compute_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_deletion_protection_enabled.compute_instance_deletion_protection_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_deletion_protection_enabled.compute_instance_deletion_protection_enabled import (
                compute_instance_deletion_protection_enabled,
            )
            from prowler.providers.gcp.services.compute.compute_service import Instance

            compute_client.project_ids = [GCP_PROJECT_ID]
            compute_client.region = GCP_US_CENTER1_LOCATION

            compute_client.instances = [
                Instance(
                    name="test-instance",
                    id="1234567890",
                    zone=f"{GCP_US_CENTER1_LOCATION}-a",
                    region=GCP_US_CENTER1_LOCATION,
                    public_ip=False,
                    metadata={},
                    shielded_enabled_vtpm=True,
                    shielded_enabled_integrity_monitoring=True,
                    confidential_computing=False,
                    service_accounts=[
                        {
                            "email": f"{GCP_PROJECT_ID}-compute@developer.gserviceaccount.com"
                        }
                    ],
                    ip_forward=False,
                    disks_encryption=[],
                    project_id=GCP_PROJECT_ID,
                    deletion_protection=False,
                )
            ]

            check = compute_instance_deletion_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"VM Instance {compute_client.instances[0].name} does not have deletion protection enabled."
            )
            assert result[0].resource_id == "1234567890"
            assert result[0].resource_name == "test-instance"
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_encryption_with_csek_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_instance_encryption_with_csek_enabled/compute_instance_encryption_with_csek_enabled_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_instance_encryption_with_csek_enabled:
    def test_compute_no_instances(self):
        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_encryption_with_csek_enabled.compute_instance_encryption_with_csek_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_encryption_with_csek_enabled.compute_instance_encryption_with_csek_enabled import (
                compute_instance_encryption_with_csek_enabled,
            )

            check = compute_instance_encryption_with_csek_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_instance_with_all_encrypted_disks(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={"items": [{"key": "block-project-ssh-keys", "value": "true"}]},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[],
            ip_forward=False,
            disks_encryption=[("disk1", True), ("disk2", True)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]
        compute_client.region = "us-central1"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_encryption_with_csek_enabled.compute_instance_encryption_with_csek_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_encryption_with_csek_enabled.compute_instance_encryption_with_csek_enabled import (
                compute_instance_encryption_with_csek_enabled,
            )

            check = compute_instance_encryption_with_csek_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"The VM Instance {instance.name} has every disk encrypted.",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_instance_with_one_unecrypted_disk(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[],
            ip_forward=False,
            disks_encryption=[("disk1", False), ("disk2", True)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_encryption_with_csek_enabled.compute_instance_encryption_with_csek_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_encryption_with_csek_enabled.compute_instance_encryption_with_csek_enabled import (
                compute_instance_encryption_with_csek_enabled,
            )

            check = compute_instance_encryption_with_csek_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"The VM Instance {instance.name} has the following unencrypted disks: '{', '.join([i[0] for i in instance.disks_encryption if not i[1]])}'",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_instance_with_all_unencrypted_disks(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={"items": [{"key": "block-project-ssh-keys", "value": "false"}]},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[],
            ip_forward=False,
            disks_encryption=[("disk1", False), ("disk2", False)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_encryption_with_csek_enabled.compute_instance_encryption_with_csek_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_encryption_with_csek_enabled.compute_instance_encryption_with_csek_enabled import (
                compute_instance_encryption_with_csek_enabled,
            )

            check = compute_instance_encryption_with_csek_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"The VM Instance {instance.name} has the following unencrypted disks: '{', '.join([i[0] for i in instance.disks_encryption if not i[1]])}'",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_ip_forwarding_is_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_instance_ip_forwarding_is_enabled/compute_instance_ip_forwarding_is_enabled_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_instance_ip_forwarding_is_enabled:
    def test_compute_no_instances(self):
        compute_client = mock.MagicMock()
        compute_client.instances = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_ip_forwarding_is_enabled.compute_instance_ip_forwarding_is_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_ip_forwarding_is_enabled.compute_instance_ip_forwarding_is_enabled import (
                compute_instance_ip_forwarding_is_enabled,
            )

            check = compute_instance_ip_forwarding_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_instance(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[{"email": "123-compute@developer.gserviceaccount.com"}],
            ip_forward=False,
            disks_encryption=[("disk1", False), ("disk2", False)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_ip_forwarding_is_enabled.compute_instance_ip_forwarding_is_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_ip_forwarding_is_enabled.compute_instance_ip_forwarding_is_enabled import (
                compute_instance_ip_forwarding_is_enabled,
            )

            check = compute_instance_ip_forwarding_is_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"The IP Forwarding of VM Instance {instance.name} is not enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_compliant_instance_gke(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="gke-test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[
                {"email": f"{GCP_PROJECT_ID}-compute@developer.gserviceaccount.com"}
            ],
            ip_forward=True,
            disks_encryption=[("disk1", False), ("disk2", False)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_ip_forwarding_is_enabled.compute_instance_ip_forwarding_is_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_ip_forwarding_is_enabled.compute_instance_ip_forwarding_is_enabled import (
                compute_instance_ip_forwarding_is_enabled,
            )

            check = compute_instance_ip_forwarding_is_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"The IP Forwarding of VM Instance {instance.name} is not enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_instance_with_ip_forwarding_enabled(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=True,
            service_accounts=[
                {"email": f"{GCP_PROJECT_ID}-compute@developer.gserviceaccount.com"}
            ],
            ip_forward=True,
            disks_encryption=[("disk1", False), ("disk2", False)],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.instances = [instance]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_instance_ip_forwarding_is_enabled.compute_instance_ip_forwarding_is_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_ip_forwarding_is_enabled.compute_instance_ip_forwarding_is_enabled import (
                compute_instance_ip_forwarding_is_enabled,
            )

            check = compute_instance_ip_forwarding_is_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"The IP Forwarding of VM Instance {instance.name} is enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"
```

--------------------------------------------------------------------------------

````
