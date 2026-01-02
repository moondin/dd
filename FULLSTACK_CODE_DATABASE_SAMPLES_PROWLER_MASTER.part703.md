---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 703
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 703 of 867)

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

---[FILE: compute_firewall_ssh_access_from_the_internet_allowed_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_firewall_ssh_access_from_the_internet_allowed/compute_firewall_ssh_access_from_the_internet_allowed_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_firewall_ssh_access_from_the_internet_allowed:
    def test_compute_no_instances(self):
        compute_client = mock.MagicMock()
        compute_client.firewalls = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_rule_with_valid_port(self):
        from prowler.providers.gcp.services.compute.compute_service import Firewall

        firewall = Firewall(
            name="test",
            id="1234567890",
            source_ranges=["0.0.0.0/0"],
            direction="INGRESS",
            allowed_rules=[{"IPProtocol": "tcp", "ports": ["443"]}],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.firewalls = [firewall]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Firewall {firewall.name} does not expose port 22",
                result[0].status_extended,
            )
            assert result[0].resource_id == firewall.id

    def test_one_compliant_rule_with_valid_port_range(self):
        from prowler.providers.gcp.services.compute.compute_service import Firewall

        firewall = Firewall(
            name="test",
            id="1234567890",
            source_ranges=["0.0.0.0/0"],
            direction="INGRESS",
            allowed_rules=[{"IPProtocol": "tcp", "ports": ["1-20"]}],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.firewalls = [firewall]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Firewall {firewall.name} does not expose port 22",
                result[0].status_extended,
            )
            assert result[0].resource_id == firewall.id

    def test_one_compliant_rule_with_valid_source_range(self):
        from prowler.providers.gcp.services.compute.compute_service import Firewall

        firewall = Firewall(
            name="test",
            id="1234567890",
            source_ranges=["127.0.0.1/32"],
            direction="INGRESS",
            allowed_rules=[{"IPProtocol": "tcp", "ports": ["22"]}],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.firewalls = [firewall]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Firewall {firewall.name} does not expose port 22",
                result[0].status_extended,
            )
            assert result[0].resource_id == firewall.id

    def test_one_compliant_rule_with_valid_protocol(self):
        from prowler.providers.gcp.services.compute.compute_service import Firewall

        firewall = Firewall(
            name="test",
            id="1234567890",
            source_ranges=["0.0.0.0/0"],
            direction="INGRESS",
            allowed_rules=[{"IPProtocol": "udp", "ports": ["22"]}],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.firewalls = [firewall]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Firewall {firewall.name} does not expose port 22",
                result[0].status_extended,
            )
            assert result[0].resource_id == firewall.id

    def test_one_compliant_rule_with_valid_direction(self):
        from prowler.providers.gcp.services.compute.compute_service import Firewall

        firewall = Firewall(
            name="test",
            id="1234567890",
            source_ranges=["0.0.0.0/0"],
            direction="EGRESS",
            allowed_rules=[{"IPProtocol": "tcp", "ports": ["22"]}],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.firewalls = [firewall]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Firewall {firewall.name} does not expose port 22",
                result[0].status_extended,
            )
            assert result[0].resource_id == firewall.id

    def test_one_non_compliant_rule_with_single_port(self):
        from prowler.providers.gcp.services.compute.compute_service import Firewall

        firewall = Firewall(
            name="test",
            id="1234567890",
            source_ranges=["0.0.0.0/0"],
            direction="INGRESS",
            allowed_rules=[{"IPProtocol": "tcp", "ports": ["22"]}],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.firewalls = [firewall]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Firewall {firewall.name} does exposes port 22",
                result[0].status_extended,
            )
            assert result[0].resource_id == firewall.id

    def test_one_non_compliant_rule_with_port_range(self):
        from prowler.providers.gcp.services.compute.compute_service import Firewall

        firewall = Firewall(
            name="test",
            id="1234567890",
            source_ranges=["0.0.0.0/0"],
            direction="INGRESS",
            allowed_rules=[{"IPProtocol": "tcp", "ports": ["20-443"]}],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.firewalls = [firewall]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Firewall {firewall.name} does exposes port 22",
                result[0].status_extended,
            )
            assert result[0].resource_id == firewall.id

    def test_one_non_compliant_with_all_ports_allowed(self):
        from prowler.providers.gcp.services.compute.compute_service import Firewall

        firewall = Firewall(
            name="test",
            id="1234567890",
            source_ranges=["0.0.0.0/0"],
            direction="INGRESS",
            allowed_rules=[{"IPProtocol": "tcp"}],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.firewalls = [firewall]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Firewall {firewall.name} does exposes port 22",
                result[0].status_extended,
            )
            assert result[0].resource_id == firewall.id

    def test_one_non_compliant_with_all_protocols_allowed(self):
        from prowler.providers.gcp.services.compute.compute_service import Firewall

        firewall = Firewall(
            name="test",
            id="1234567890",
            source_ranges=["0.0.0.0/0"],
            direction="INGRESS",
            allowed_rules=[{"IPProtocol": "all"}],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.firewalls = [firewall]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Firewall {firewall.name} does exposes port 22",
                result[0].status_extended,
            )
            assert result[0].resource_id == firewall.id

    def test_one_non_compliant_with_2_rules(self):
        from prowler.providers.gcp.services.compute.compute_service import Firewall

        firewall = Firewall(
            name="test",
            id="1234567890",
            source_ranges=["0.0.0.0/0"],
            direction="INGRESS",
            allowed_rules=[
                {"IPProtocol": "udp", "ports": ["22"]},
                {"IPProtocol": "all"},
            ],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.firewalls = [firewall]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Firewall {firewall.name} does exposes port 22",
                result[0].status_extended,
            )
            assert result[0].resource_id == firewall.id

    def test_one_compliant_with_3_rules(self):
        from prowler.providers.gcp.services.compute.compute_service import Firewall

        firewall = Firewall(
            name="test",
            id="1234567890",
            source_ranges=["0.0.0.0/0"],
            direction="INGRESS",
            allowed_rules=[
                {"IPProtocol": "udp", "ports": ["22"]},
                {"IPProtocol": "tcp", "ports": ["23"]},
                {"IPProtocol": "udp"},
            ],
            project_id=GCP_PROJECT_ID,
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.firewalls = [firewall]
        compute_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_firewall_ssh_access_from_the_internet_allowed.compute_firewall_ssh_access_from_the_internet_allowed import (
                compute_firewall_ssh_access_from_the_internet_allowed,
            )

            check = compute_firewall_ssh_access_from_the_internet_allowed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Firewall {firewall.name} does not expose port 22",
                result[0].status_extended,
            )
            assert result[0].resource_id == firewall.id
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_block_project_wide_ssh_keys_disabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_instance_block_project_wide_ssh_keys_disabled/compute_instance_block_project_wide_ssh_keys_disabled_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_instance_block_project_wide_ssh_keys_disabled:
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
                "prowler.providers.gcp.services.compute.compute_instance_block_project_wide_ssh_keys_disabled.compute_instance_block_project_wide_ssh_keys_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_block_project_wide_ssh_keys_disabled.compute_instance_block_project_wide_ssh_keys_disabled import (
                compute_instance_block_project_wide_ssh_keys_disabled,
            )

            check = compute_instance_block_project_wide_ssh_keys_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_instance_with_block_project_ssh_keys_true(self):
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
                "prowler.providers.gcp.services.compute.compute_instance_block_project_wide_ssh_keys_disabled.compute_instance_block_project_wide_ssh_keys_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_block_project_wide_ssh_keys_disabled.compute_instance_block_project_wide_ssh_keys_disabled import (
                compute_instance_block_project_wide_ssh_keys_disabled,
            )

            check = compute_instance_block_project_wide_ssh_keys_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"The VM Instance {instance.name} is not making use of common/shared project-wide SSH key",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_compliant_instance_with_block_project_ssh_keys_true_uppercase(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={"items": [{"key": "block-project-ssh-keys", "value": "TRUE"}]},
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
                "prowler.providers.gcp.services.compute.compute_instance_block_project_wide_ssh_keys_disabled.compute_instance_block_project_wide_ssh_keys_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_block_project_wide_ssh_keys_disabled.compute_instance_block_project_wide_ssh_keys_disabled import (
                compute_instance_block_project_wide_ssh_keys_disabled,
            )

            check = compute_instance_block_project_wide_ssh_keys_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"The VM Instance {instance.name} is not making use of common/shared project-wide SSH key",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_instance_without_metadata(self):
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
                "prowler.providers.gcp.services.compute.compute_instance_block_project_wide_ssh_keys_disabled.compute_instance_block_project_wide_ssh_keys_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_block_project_wide_ssh_keys_disabled.compute_instance_block_project_wide_ssh_keys_disabled import (
                compute_instance_block_project_wide_ssh_keys_disabled,
            )

            check = compute_instance_block_project_wide_ssh_keys_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"The VM Instance {instance.name} is making use of common/shared project-wide SSH key",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_instance_with_block_project_ssh_keys_false(self):
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
                "prowler.providers.gcp.services.compute.compute_instance_block_project_wide_ssh_keys_disabled.compute_instance_block_project_wide_ssh_keys_disabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_block_project_wide_ssh_keys_disabled.compute_instance_block_project_wide_ssh_keys_disabled import (
                compute_instance_block_project_wide_ssh_keys_disabled,
            )

            check = compute_instance_block_project_wide_ssh_keys_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"The VM Instance {instance.name} is making use of common/shared project-wide SSH key",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_confidential_computing_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_instance_confidential_computing_enabled/compute_instance_confidential_computing_enabled_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_instance_confidential_computing_enabled:
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
                "prowler.providers.gcp.services.compute.compute_instance_confidential_computing_enabled.compute_instance_confidential_computing_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_confidential_computing_enabled.compute_instance_confidential_computing_enabled import (
                compute_instance_confidential_computing_enabled,
            )

            check = compute_instance_confidential_computing_enabled()
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
                "prowler.providers.gcp.services.compute.compute_instance_confidential_computing_enabled.compute_instance_confidential_computing_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_confidential_computing_enabled.compute_instance_confidential_computing_enabled import (
                compute_instance_confidential_computing_enabled,
            )

            check = compute_instance_confidential_computing_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"VM Instance {instance.name} has Confidential Computing enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].resource_name == instance.name
            assert result[0].location == "us-central1"
            assert result[0].project_id == GCP_PROJECT_ID

    def test_one_instance_with_shielded_vtpm_disabled(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={},
            shielded_enabled_vtpm=False,
            shielded_enabled_integrity_monitoring=True,
            confidential_computing=False,
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
                "prowler.providers.gcp.services.compute.compute_instance_confidential_computing_enabled.compute_instance_confidential_computing_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_confidential_computing_enabled.compute_instance_confidential_computing_enabled import (
                compute_instance_confidential_computing_enabled,
            )

            check = compute_instance_confidential_computing_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"VM Instance {instance.name} does not have Confidential Computing enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].resource_name == instance.name
            assert result[0].location == "us-central1"
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

````
