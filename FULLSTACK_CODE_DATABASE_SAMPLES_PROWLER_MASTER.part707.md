---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 707
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 707 of 867)

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

---[FILE: compute_shielded_vm_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_shielded_vm_enabled/compute_shielded_vm_enabled_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_instance_shielded_vm_enabled:
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
                "prowler.providers.gcp.services.compute.compute_instance_shielded_vm_enabled.compute_instance_shielded_vm_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_shielded_vm_enabled.compute_instance_shielded_vm_enabled import (
                compute_instance_shielded_vm_enabled,
            )

            check = compute_instance_shielded_vm_enabled()
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
                "prowler.providers.gcp.services.compute.compute_instance_shielded_vm_enabled.compute_instance_shielded_vm_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_shielded_vm_enabled.compute_instance_shielded_vm_enabled import (
                compute_instance_shielded_vm_enabled,
            )

            check = compute_instance_shielded_vm_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"VM Instance {instance.name} has vTPM or Integrity Monitoring set to on",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

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
                "prowler.providers.gcp.services.compute.compute_instance_shielded_vm_enabled.compute_instance_shielded_vm_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_shielded_vm_enabled.compute_instance_shielded_vm_enabled import (
                compute_instance_shielded_vm_enabled,
            )

            check = compute_instance_shielded_vm_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"VM Instance {instance.name} doesn't have vTPM and Integrity Monitoring set to on",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"

    def test_one_instance_with_shielded_integrity_monitoring_disabled(self):
        from prowler.providers.gcp.services.compute.compute_service import Instance

        instance = Instance(
            name="test",
            id="1234567890",
            zone="us-central1-a",
            region="us-central1",
            public_ip=True,
            metadata={},
            shielded_enabled_vtpm=True,
            shielded_enabled_integrity_monitoring=False,
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
                "prowler.providers.gcp.services.compute.compute_instance_shielded_vm_enabled.compute_instance_shielded_vm_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_instance_shielded_vm_enabled.compute_instance_shielded_vm_enabled import (
                compute_instance_shielded_vm_enabled,
            )

            check = compute_instance_shielded_vm_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"VM Instance {instance.name} doesn't have vTPM and Integrity Monitoring set to on",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert result[0].location == "us-central1"
```

--------------------------------------------------------------------------------

---[FILE: compute_subnet_flow_logs_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/compute/compute_subnet_flow_logs_enabled/compute_subnet_flow_logs_enabled_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_compute_subnet_flow_logs_enabled:
    def test_compute_no_subnets(self):
        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.subnets = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_subnet_flow_logs_enabled.compute_subnet_flow_logs_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_subnet_flow_logs_enabled.compute_subnet_flow_logs_enabled import (
                compute_subnet_flow_logs_enabled,
            )

            check = compute_subnet_flow_logs_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_subnet(self):
        from prowler.providers.gcp.services.compute.compute_service import Subnet

        subnet = Subnet(
            name="test",
            id="test_id",
            project_id=GCP_PROJECT_ID,
            flow_logs=True,
            network="network",
            region="global",
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.subnets = [subnet]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_subnet_flow_logs_enabled.compute_subnet_flow_logs_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_subnet_flow_logs_enabled.compute_subnet_flow_logs_enabled import (
                compute_subnet_flow_logs_enabled,
            )

            check = compute_subnet_flow_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "has flow logs enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == subnet.id
            assert result[0].resource_name == subnet.name
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == subnet.region

    def test_one_uncompliant_subnet(self):
        from prowler.providers.gcp.services.compute.compute_service import Subnet

        subnet = Subnet(
            name="test",
            id="test_id",
            project_id=GCP_PROJECT_ID,
            flow_logs=False,
            network="network",
            region="global",
        )

        compute_client = mock.MagicMock()
        compute_client.project_ids = [GCP_PROJECT_ID]
        compute_client.subnets = [subnet]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.compute.compute_subnet_flow_logs_enabled.compute_subnet_flow_logs_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.gcp.services.compute.compute_subnet_flow_logs_enabled.compute_subnet_flow_logs_enabled import (
                compute_subnet_flow_logs_enabled,
            )

            check = compute_subnet_flow_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "does not have flow logs enabled",
                result[0].status_extended,
            )
            assert result[0].resource_id == subnet.id
            assert result[0].resource_name == subnet.name
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == subnet.region
```

--------------------------------------------------------------------------------

---[FILE: dataproc_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/dataproc/dataproc_service_test.py

```python
from unittest.mock import patch

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestDataprocService:
    def test_service(self):
        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client,
            ),
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.dataproc.dataproc_service.compute_client.regions",
                new=["europe-west1-b"],
            ),
        ):
            from prowler.providers.gcp.services.dataproc.dataproc_service import (
                Dataproc,
            )

            dataproc_client = Dataproc(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert dataproc_client.service == "dataproc"

            assert dataproc_client.project_ids == [GCP_PROJECT_ID]

            assert len(dataproc_client.clusters) == 2

            assert dataproc_client.clusters[0].name == "cluster1"
            assert dataproc_client.clusters[0].id.__class__.__name__ == "str"
            assert dataproc_client.clusters[0].encryption_config
            assert dataproc_client.clusters[0].project_id == GCP_PROJECT_ID

            assert dataproc_client.clusters[1].name == "cluster2"
            assert dataproc_client.clusters[1].id.__class__.__name__ == "str"
            assert not dataproc_client.clusters[1].encryption_config
            assert dataproc_client.clusters[1].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: dataproc_encrypted_with_cmks_disabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/dataproc/dataproc_encrypted_with_cmks_disabled/dataproc_encrypted_with_cmks_disabled_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_dataproc_encrypted_with_cmks_disabled:
    def test_dataproc_no_clsuters(self):
        dataproc_client = mock.MagicMock()
        dataproc_client.clusters = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dataproc.dataproc_encrypted_with_cmks_disabled.dataproc_encrypted_with_cmks_disabled.dataproc_client",
                new=dataproc_client,
            ),
        ):
            from prowler.providers.gcp.services.dataproc.dataproc_encrypted_with_cmks_disabled.dataproc_encrypted_with_cmks_disabled import (
                dataproc_encrypted_with_cmks_disabled,
            )

            check = dataproc_encrypted_with_cmks_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_cluster(self):
        dataproc_client = mock.MagicMock()
        dataproc_client.project_ids = [GCP_PROJECT_ID]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dataproc.dataproc_encrypted_with_cmks_disabled.dataproc_encrypted_with_cmks_disabled.dataproc_client",
                new=dataproc_client,
            ),
        ):
            from prowler.providers.gcp.services.dataproc.dataproc_service import Cluster

            cluster = Cluster(
                name="test",
                id="1234567890",
                encryption_config={"gcePdKmsKeyName": "test"},
                project_id=GCP_PROJECT_ID,
            )
            dataproc_client.clusters = [cluster]
            dataproc_client.region = "global"

            from prowler.providers.gcp.services.dataproc.dataproc_encrypted_with_cmks_disabled.dataproc_encrypted_with_cmks_disabled import (
                dataproc_encrypted_with_cmks_disabled,
            )

            check = dataproc_encrypted_with_cmks_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Dataproc cluster {cluster.name} is encrypted with customer managed encryption keys.",
                result[0].status_extended,
            )
            assert result[0].resource_id == cluster.id
            assert result[0].location == "global"

    def test_cluster_without_encryption(self):
        dataproc_client = mock.MagicMock()
        dataproc_client.project_ids = [GCP_PROJECT_ID]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dataproc.dataproc_encrypted_with_cmks_disabled.dataproc_encrypted_with_cmks_disabled.dataproc_client",
                new=dataproc_client,
            ),
        ):

            from prowler.providers.gcp.services.dataproc.dataproc_service import Cluster

            cluster = Cluster(
                name="test",
                id="1234567890",
                encryption_config={},
                project_id=GCP_PROJECT_ID,
            )
            dataproc_client.clusters = [cluster]
            dataproc_client.region = "global"

            from prowler.providers.gcp.services.dataproc.dataproc_encrypted_with_cmks_disabled.dataproc_encrypted_with_cmks_disabled import (
                dataproc_encrypted_with_cmks_disabled,
            )

            check = dataproc_encrypted_with_cmks_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Dataproc cluster {cluster.name} is not encrypted with customer managed encryption keys.",
                result[0].status_extended,
            )
            assert result[0].resource_id == cluster.id
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: dns_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/dns/dns_service_test.py

```python
from unittest.mock import patch

from prowler.providers.gcp.services.dns.dns_service import DNS
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestDNSService:
    def test_service(self):
        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client,
            ),
        ):
            api_keys_client = DNS(set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID]))
            assert api_keys_client.service == "dns"
            assert api_keys_client.project_ids == [GCP_PROJECT_ID]

            assert len(api_keys_client.managed_zones) == 2
            assert api_keys_client.managed_zones[0].name == "managed_zone1"
            assert api_keys_client.managed_zones[0].id.__class__.__name__ == "str"
            assert api_keys_client.managed_zones[0].dnssec
            assert len(api_keys_client.managed_zones[0].key_specs) == 0
            assert api_keys_client.managed_zones[0].project_id == GCP_PROJECT_ID
            assert api_keys_client.managed_zones[1].name == "managed_zone2"
            assert api_keys_client.managed_zones[1].id.__class__.__name__ == "str"
            assert not api_keys_client.managed_zones[1].dnssec
            assert len(api_keys_client.managed_zones[1].key_specs) == 0
            assert api_keys_client.managed_zones[1].project_id == GCP_PROJECT_ID

            assert len(api_keys_client.policies) == 2
            assert api_keys_client.policies[0].name == "policy1"
            assert api_keys_client.policies[0].id.__class__.__name__ == "str"
            assert api_keys_client.policies[0].logging
            assert api_keys_client.policies[0].networks == ["network1"]
            assert api_keys_client.policies[0].project_id == GCP_PROJECT_ID
            assert api_keys_client.policies[1].name == "policy2"
            assert api_keys_client.policies[1].id.__class__.__name__ == "str"
            assert not api_keys_client.policies[1].logging
            assert api_keys_client.policies[1].networks == []
            assert api_keys_client.policies[1].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: dns_dnssec_disabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/dns/dns_dnssec_disabled/dns_dnssec_disabled_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_dns_dnssec_disabled:
    def test_dns_no_managed_zones(self):
        dns_client = mock.MagicMock()
        dns_client.managed_zones = []
        dns_client.region = GCP_EU1_LOCATION

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dns.dns_dnssec_disabled.dns_dnssec_disabled.dns_client",
                new=dns_client,
            ),
        ):
            from prowler.providers.gcp.services.dns.dns_dnssec_disabled.dns_dnssec_disabled import (
                dns_dnssec_disabled,
            )

            check = dns_dnssec_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_managed_zone(self):
        from prowler.providers.gcp.services.dns.dns_service import ManagedZone

        managed_zone = ManagedZone(
            name="test",
            id="1234567890",
            dnssec=True,
            key_specs=[
                {
                    "keyType": "keySigning",
                    "algorithm": "rsasha1",
                    "keyLength": 2048,
                    "kind": "dns#dnsKeySpec",
                },
                {
                    "keyType": "zoneSigning",
                    "algorithm": "rsasha1",
                    "keyLength": 1024,
                    "kind": "dns#dnsKeySpec",
                },
            ],
            project_id=GCP_PROJECT_ID,
        )

        dns_client = mock.MagicMock()
        dns_client.project_ids = [GCP_PROJECT_ID]
        dns_client.managed_zones = [managed_zone]
        dns_client.region = GCP_EU1_LOCATION

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dns.dns_dnssec_disabled.dns_dnssec_disabled.dns_client",
                new=dns_client,
            ),
        ):
            from prowler.providers.gcp.services.dns.dns_dnssec_disabled.dns_dnssec_disabled import (
                dns_dnssec_disabled,
            )

            check = dns_dnssec_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Cloud DNS {managed_zone.name} has DNSSEC enabled.",
                result[0].status_extended,
            )
            assert result[0].resource_id == managed_zone.id

    def test_managed_zone_with_dnssec_disabled(self):
        from prowler.providers.gcp.services.dns.dns_service import ManagedZone

        managed_zone = ManagedZone(
            name="test",
            id="1234567890",
            dnssec=False,
            key_specs=[
                {
                    "keyType": "keySigning",
                    "algorithm": "rsasha1",
                    "keyLength": 2048,
                    "kind": "dns#dnsKeySpec",
                },
                {
                    "keyType": "zoneSigning",
                    "algorithm": "rsasha1",
                    "keyLength": 1024,
                    "kind": "dns#dnsKeySpec",
                },
            ],
            project_id=GCP_PROJECT_ID,
        )

        dns_client = mock.MagicMock()
        dns_client.project_ids = [GCP_PROJECT_ID]
        dns_client.managed_zones = [managed_zone]
        dns_client.region = GCP_EU1_LOCATION

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dns.dns_dnssec_disabled.dns_dnssec_disabled.dns_client",
                new=dns_client,
            ),
        ):
            from prowler.providers.gcp.services.dns.dns_dnssec_disabled.dns_dnssec_disabled import (
                dns_dnssec_disabled,
            )

            check = dns_dnssec_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Cloud DNS {managed_zone.name} doesn't have DNSSEC enabled.",
                result[0].status_extended,
            )
            assert result[0].resource_id == managed_zone.id
```

--------------------------------------------------------------------------------

---[FILE: dns_rsasha1_in_use_to_key_sign_in_dnssec_test.py]---
Location: prowler-master/tests/providers/gcp/services/dns/dns_rsasha1_in_use_to_key_sign_in_dnssec/dns_rsasha1_in_use_to_key_sign_in_dnssec_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_dns_rsasha1_in_use_to_key_sign_in_dnssec:
    def test_dns_no_managed_zones(self):
        dns_client = mock.MagicMock()
        dns_client.managed_zones = []
        dns_client.region = GCP_EU1_LOCATION

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_key_sign_in_dnssec.dns_rsasha1_in_use_to_key_sign_in_dnssec.dns_client",
                new=dns_client,
            ),
        ):
            from prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_key_sign_in_dnssec.dns_rsasha1_in_use_to_key_sign_in_dnssec import (
                dns_rsasha1_in_use_to_key_sign_in_dnssec,
            )

            check = dns_rsasha1_in_use_to_key_sign_in_dnssec()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_managed_zone(self):
        from prowler.providers.gcp.services.dns.dns_service import ManagedZone

        managed_zone = ManagedZone(
            name="test",
            id="1234567890",
            dnssec=True,
            key_specs=[
                {
                    "keyType": "keySigning",
                    "algorithm": "rsasha256",
                    "keyLength": 2048,
                    "kind": "dns#dnsKeySpec",
                },
                {
                    "keyType": "zoneSigning",
                    "algorithm": "rsasha1",
                    "keyLength": 1024,
                    "kind": "dns#dnsKeySpec",
                },
            ],
            project_id=GCP_PROJECT_ID,
        )

        dns_client = mock.MagicMock()
        dns_client.project_ids = [GCP_PROJECT_ID]
        dns_client.managed_zones = [managed_zone]
        dns_client.region = GCP_EU1_LOCATION

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_key_sign_in_dnssec.dns_rsasha1_in_use_to_key_sign_in_dnssec.dns_client",
                new=dns_client,
            ),
        ):
            from prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_key_sign_in_dnssec.dns_rsasha1_in_use_to_key_sign_in_dnssec import (
                dns_rsasha1_in_use_to_key_sign_in_dnssec,
            )

            check = dns_rsasha1_in_use_to_key_sign_in_dnssec()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Cloud DNS {managed_zone.name} is not using RSASHA1 algorithm as key signing.",
                result[0].status_extended,
            )
            assert result[0].resource_id == managed_zone.id

    def test_managed_zone_with_rsasha1_key_sign(self):
        from prowler.providers.gcp.services.dns.dns_service import ManagedZone

        managed_zone = ManagedZone(
            name="test",
            id="1234567890",
            dnssec=False,
            key_specs=[
                {
                    "keyType": "keySigning",
                    "algorithm": "rsasha1",
                    "keyLength": 2048,
                    "kind": "dns#dnsKeySpec",
                },
                {
                    "keyType": "zoneSigning",
                    "algorithm": "rsasha256",
                    "keyLength": 1024,
                    "kind": "dns#dnsKeySpec",
                },
            ],
            project_id=GCP_PROJECT_ID,
        )

        dns_client = mock.MagicMock()
        dns_client.project_ids = [GCP_PROJECT_ID]
        dns_client.managed_zones = [managed_zone]
        dns_client.region = GCP_EU1_LOCATION

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_key_sign_in_dnssec.dns_rsasha1_in_use_to_key_sign_in_dnssec.dns_client",
                new=dns_client,
            ),
        ):
            from prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_key_sign_in_dnssec.dns_rsasha1_in_use_to_key_sign_in_dnssec import (
                dns_rsasha1_in_use_to_key_sign_in_dnssec,
            )

            check = dns_rsasha1_in_use_to_key_sign_in_dnssec()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Cloud DNS {managed_zone.name} is using RSASHA1 algorithm as key signing.",
                result[0].status_extended,
            )
            assert result[0].resource_id == managed_zone.id
```

--------------------------------------------------------------------------------

---[FILE: dns_rsasha1_in_use_to_zone_sign_in_dnssec_test.py]---
Location: prowler-master/tests/providers/gcp/services/dns/dns_rsasha1_in_use_to_zone_sign_in_dnssec/dns_rsasha1_in_use_to_zone_sign_in_dnssec_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_dns_rsasha1_in_use_to_zone_sign_in_dnssec:
    def test_dns_no_managed_zones(self):
        dns_client = mock.MagicMock()
        dns_client.managed_zones = []
        dns_client.region = GCP_EU1_LOCATION

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_zone_sign_in_dnssec.dns_rsasha1_in_use_to_zone_sign_in_dnssec.dns_client",
                new=dns_client,
            ),
        ):
            from prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_zone_sign_in_dnssec.dns_rsasha1_in_use_to_zone_sign_in_dnssec import (
                dns_rsasha1_in_use_to_zone_sign_in_dnssec,
            )

            check = dns_rsasha1_in_use_to_zone_sign_in_dnssec()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_managed_zone(self):
        from prowler.providers.gcp.services.dns.dns_service import ManagedZone

        managed_zone = ManagedZone(
            name="test",
            id="1234567890",
            dnssec=True,
            key_specs=[
                {
                    "keyType": "keySigning",
                    "algorithm": "rsasha1",
                    "keyLength": 2048,
                    "kind": "dns#dnsKeySpec",
                },
                {
                    "keyType": "zoneSigning",
                    "algorithm": "rsasha256",
                    "keyLength": 1024,
                    "kind": "dns#dnsKeySpec",
                },
            ],
            project_id=GCP_PROJECT_ID,
        )

        dns_client = mock.MagicMock()
        dns_client.project_ids = [GCP_PROJECT_ID]
        dns_client.managed_zones = [managed_zone]
        dns_client.region = GCP_EU1_LOCATION

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_zone_sign_in_dnssec.dns_rsasha1_in_use_to_zone_sign_in_dnssec.dns_client",
                new=dns_client,
            ),
        ):
            from prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_zone_sign_in_dnssec.dns_rsasha1_in_use_to_zone_sign_in_dnssec import (
                dns_rsasha1_in_use_to_zone_sign_in_dnssec,
            )

            check = dns_rsasha1_in_use_to_zone_sign_in_dnssec()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Cloud DNS {managed_zone.name} is not using RSASHA1 algorithm as zone signing.",
                result[0].status_extended,
            )
            assert result[0].resource_id == managed_zone.id

    def test_managed_zone_with_dnssec_disabled(self):
        from prowler.providers.gcp.services.dns.dns_service import ManagedZone

        managed_zone = ManagedZone(
            name="test",
            id="1234567890",
            dnssec=False,
            key_specs=[
                {
                    "keyType": "keySigning",
                    "algorithm": "rsasha256",
                    "keyLength": 2048,
                    "kind": "dns#dnsKeySpec",
                },
                {
                    "keyType": "zoneSigning",
                    "algorithm": "rsasha1",
                    "keyLength": 1024,
                    "kind": "dns#dnsKeySpec",
                },
            ],
            project_id=GCP_PROJECT_ID,
        )

        dns_client = mock.MagicMock()
        dns_client.project_ids = [GCP_PROJECT_ID]
        dns_client.managed_zones = [managed_zone]
        dns_client.region = GCP_EU1_LOCATION

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_zone_sign_in_dnssec.dns_rsasha1_in_use_to_zone_sign_in_dnssec.dns_client",
                new=dns_client,
            ),
        ):
            from prowler.providers.gcp.services.dns.dns_rsasha1_in_use_to_zone_sign_in_dnssec.dns_rsasha1_in_use_to_zone_sign_in_dnssec import (
                dns_rsasha1_in_use_to_zone_sign_in_dnssec,
            )

            check = dns_rsasha1_in_use_to_zone_sign_in_dnssec()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Cloud DNS {managed_zone.name} is using RSASHA1 algorithm as zone signing.",
                result[0].status_extended,
            )
            assert result[0].resource_id == managed_zone.id
```

--------------------------------------------------------------------------------

````
