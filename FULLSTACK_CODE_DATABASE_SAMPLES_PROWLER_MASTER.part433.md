---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 433
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 433 of 867)

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

---[FILE: ecs_attached_disk_encrypted_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ecs/ecs_attached_disk_encrypted/ecs_attached_disk_encrypted_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestEcsAttachedDiskEncrypted:
    def test_attached_disk_not_encrypted_fails(self):
        ecs_client = mock.MagicMock()
        ecs_client.audited_account = "1234567890"
        ecs_client.disks = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_attached_disk_encrypted.ecs_attached_disk_encrypted.ecs_client",
                new=ecs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_attached_disk_encrypted.ecs_attached_disk_encrypted import (
                ecs_attached_disk_encrypted,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import Disk

            disk = Disk(
                id="d1",
                name="d1",
                region="cn-hangzhou",
                status="In-use",
                disk_category="cloud",
                size=20,
                is_attached=True,
                attached_instance_id="i-1",
                is_encrypted=False,
            )
            ecs_client.disks = [disk]

            check = ecs_attached_disk_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_attached_disk_encrypted_passes(self):
        ecs_client = mock.MagicMock()
        ecs_client.audited_account = "1234567890"
        ecs_client.disks = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_attached_disk_encrypted.ecs_attached_disk_encrypted.ecs_client",
                new=ecs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_attached_disk_encrypted.ecs_attached_disk_encrypted import (
                ecs_attached_disk_encrypted,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import Disk

            disk = Disk(
                id="d2",
                name="d2",
                region="cn-hangzhou",
                status="In-use",
                disk_category="cloud",
                size=20,
                is_attached=True,
                attached_instance_id="i-2",
                is_encrypted=True,
            )
            ecs_client.disks = [disk]

            check = ecs_attached_disk_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ecs_instance_endpoint_protection_installed_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ecs/ecs_instance_endpoint_protection_installed/ecs_instance_endpoint_protection_installed_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class DummyAgent:
    def __init__(self, installed: bool, status: str):
        self.agent_installed = installed
        self.agent_status = status


class TestEcsInstanceEndpointProtectionInstalled:
    def test_agent_missing_or_offline_fails(self):
        ecs_client = mock.MagicMock()
        ecs_client.audited_account = "1234567890"
        ecs_client.instances = []

        securitycenter_client = mock.MagicMock()
        securitycenter_client.instance_agents = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_instance_endpoint_protection_installed.ecs_instance_endpoint_protection_installed.ecs_client",
                new=ecs_client,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_instance_endpoint_protection_installed.ecs_instance_endpoint_protection_installed.securitycenter_client",
                new=securitycenter_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_instance_endpoint_protection_installed.ecs_instance_endpoint_protection_installed import (
                ecs_instance_endpoint_protection_installed,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import Instance

            instance = Instance(
                id="i-1",
                name="i-1",
                region="cn-hangzhou",
                status="Running",
                instance_type="ecs.g6.large",
                network_type="vpc",
                public_ip="",
                private_ip="10.0.0.1",
            )
            ecs_client.instances = [instance]
            securitycenter_client.instance_agents = {
                "cn-hangzhou:i-1": DummyAgent(installed=False, status="offline")
            }

            check = ecs_instance_endpoint_protection_installed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_agent_installed_online_passes(self):
        ecs_client = mock.MagicMock()
        ecs_client.audited_account = "1234567890"
        ecs_client.instances = []

        securitycenter_client = mock.MagicMock()
        securitycenter_client.instance_agents = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_instance_endpoint_protection_installed.ecs_instance_endpoint_protection_installed.ecs_client",
                new=ecs_client,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_instance_endpoint_protection_installed.ecs_instance_endpoint_protection_installed.securitycenter_client",
                new=securitycenter_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_instance_endpoint_protection_installed.ecs_instance_endpoint_protection_installed import (
                ecs_instance_endpoint_protection_installed,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import Instance

            instance = Instance(
                id="i-2",
                name="i-2",
                region="cn-hangzhou",
                status="Running",
                instance_type="ecs.g6.large",
                network_type="vpc",
                public_ip="",
                private_ip="10.0.0.2",
            )
            ecs_client.instances = [instance]
            securitycenter_client.instance_agents = {
                "cn-hangzhou:i-2": DummyAgent(installed=True, status="online")
            }

            check = ecs_instance_endpoint_protection_installed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ecs_instance_latest_os_patches_applied_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ecs/ecs_instance_latest_os_patches_applied/ecs_instance_latest_os_patches_applied_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class DummyVulnerability:
    def __init__(self, has_vulnerabilities: bool, count: int):
        self.has_vulnerabilities = has_vulnerabilities
        self.vulnerability_count = count


class TestEcsInstanceLatestOSPatchesApplied:
    def test_instance_with_vulnerabilities_fails(self):
        ecs_client = mock.MagicMock()
        ecs_client.audited_account = "1234567890"
        ecs_client.instances = []

        securitycenter_client = mock.MagicMock()
        securitycenter_client.instance_vulnerabilities = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_instance_latest_os_patches_applied.ecs_instance_latest_os_patches_applied.ecs_client",
                new=ecs_client,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_instance_latest_os_patches_applied.ecs_instance_latest_os_patches_applied.securitycenter_client",
                new=securitycenter_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_instance_latest_os_patches_applied.ecs_instance_latest_os_patches_applied import (
                ecs_instance_latest_os_patches_applied,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import Instance

            instance = Instance(
                id="i-1",
                name="i-1",
                region="cn-hangzhou",
                status="Running",
                instance_type="ecs.g6.large",
                network_type="vpc",
                public_ip="",
                private_ip="10.0.0.1",
            )
            ecs_client.instances = [instance]
            securitycenter_client.instance_vulnerabilities = {
                "cn-hangzhou:i-1": DummyVulnerability(True, 5)
            }

            check = ecs_instance_latest_os_patches_applied()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_instance_no_vulnerabilities_passes(self):
        ecs_client = mock.MagicMock()
        ecs_client.audited_account = "1234567890"
        ecs_client.instances = []

        securitycenter_client = mock.MagicMock()
        securitycenter_client.instance_vulnerabilities = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_instance_latest_os_patches_applied.ecs_instance_latest_os_patches_applied.ecs_client",
                new=ecs_client,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_instance_latest_os_patches_applied.ecs_instance_latest_os_patches_applied.securitycenter_client",
                new=securitycenter_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_instance_latest_os_patches_applied.ecs_instance_latest_os_patches_applied import (
                ecs_instance_latest_os_patches_applied,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import Instance

            instance = Instance(
                id="i-2",
                name="i-2",
                region="cn-hangzhou",
                status="Running",
                instance_type="ecs.g6.large",
                network_type="vpc",
                public_ip="",
                private_ip="10.0.0.2",
            )
            ecs_client.instances = [instance]
            securitycenter_client.instance_vulnerabilities = {
                "cn-hangzhou:i-2": DummyVulnerability(False, 0)
            }

            check = ecs_instance_latest_os_patches_applied()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ecs_instance_no_legacy_network_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ecs/ecs_instance_no_legacy_network/ecs_instance_no_legacy_network_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestEcsInstanceNoLegacyNetwork:
    def test_classic_network_fails(self):
        ecs_client = mock.MagicMock()
        ecs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_instance_no_legacy_network.ecs_instance_no_legacy_network.ecs_client",
                new=ecs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_instance_no_legacy_network.ecs_instance_no_legacy_network import (
                ecs_instance_no_legacy_network,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import Instance

            instance = Instance(
                id="i-1",
                name="i-1",
                region="cn-hangzhou",
                status="Running",
                instance_type="ecs.g6.large",
                network_type="classic",
                public_ip="",
                private_ip="10.0.0.1",
            )
            ecs_client.instances = [instance]

            check = ecs_instance_no_legacy_network()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_vpc_network_passes(self):
        ecs_client = mock.MagicMock()
        ecs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_instance_no_legacy_network.ecs_instance_no_legacy_network.ecs_client",
                new=ecs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_instance_no_legacy_network.ecs_instance_no_legacy_network import (
                ecs_instance_no_legacy_network,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import Instance

            instance = Instance(
                id="i-2",
                name="i-2",
                region="cn-hangzhou",
                status="Running",
                instance_type="ecs.g6.large",
                network_type="vpc",
                public_ip="",
                private_ip="10.0.0.2",
            )
            ecs_client.instances = [instance]

            check = ecs_instance_no_legacy_network()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ecs_securitygroup_restrict_rdp_internet_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ecs/ecs_securitygroup_restrict_rdp_internet/ecs_securitygroup_restrict_rdp_internet_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestEcsSecurityGroupRestrictRdpInternet:
    def test_rdp_open_fails(self):
        ecs_client = mock.MagicMock()
        ecs_client.security_groups = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_securitygroup_restrict_rdp_internet.ecs_securitygroup_restrict_rdp_internet.ecs_client",
                new=ecs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_securitygroup_restrict_rdp_internet.ecs_securitygroup_restrict_rdp_internet import (
                ecs_securitygroup_restrict_rdp_internet,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import (
                SecurityGroup,
            )

            sg = SecurityGroup(
                id="sg-1",
                name="sg-rdp",
                region="cn-hangzhou",
                arn="arn:sg/sg-1",
                ingress_rules=[
                    {
                        "ip_protocol": "tcp",
                        "source_cidr_ip": "0.0.0.0/0",
                        "port_range": "3389/3389",
                        "policy": "accept",
                    }
                ],
            )
            ecs_client.security_groups = {sg.arn: sg}

            check = ecs_securitygroup_restrict_rdp_internet()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_rdp_restricted_passes(self):
        ecs_client = mock.MagicMock()
        ecs_client.security_groups = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_securitygroup_restrict_rdp_internet.ecs_securitygroup_restrict_rdp_internet.ecs_client",
                new=ecs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_securitygroup_restrict_rdp_internet.ecs_securitygroup_restrict_rdp_internet import (
                ecs_securitygroup_restrict_rdp_internet,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import (
                SecurityGroup,
            )

            sg = SecurityGroup(
                id="sg-2",
                name="sg-restricted",
                region="cn-hangzhou",
                arn="arn:sg/sg-2",
                ingress_rules=[
                    {
                        "ip_protocol": "tcp",
                        "source_cidr_ip": "10.0.0.0/24",
                        "port_range": "3389/3389",
                        "policy": "accept",
                    }
                ],
            )
            ecs_client.security_groups = {sg.arn: sg}

            check = ecs_securitygroup_restrict_rdp_internet()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ecs_securitygroup_restrict_ssh_internet_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ecs/ecs_securitygroup_restrict_ssh_internet/ecs_securitygroup_restrict_ssh_internet_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestEcsSecurityGroupRestrictSSHInternet:
    def test_security_group_open_to_internet_fails(self):
        ecs_client = mock.MagicMock()
        ecs_client.security_groups = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_securitygroup_restrict_ssh_internet.ecs_securitygroup_restrict_ssh_internet.ecs_client",
                new=ecs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_securitygroup_restrict_ssh_internet.ecs_securitygroup_restrict_ssh_internet import (
                ecs_securitygroup_restrict_ssh_internet,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import (
                SecurityGroup,
            )

            sg = SecurityGroup(
                id="sg-1",
                name="sg-open",
                region="cn-hangzhou",
                arn="arn:sg/sg-1",
                ingress_rules=[
                    {
                        "ip_protocol": "tcp",
                        "source_cidr_ip": "0.0.0.0/0",
                        "port_range": "22/22",
                        "policy": "accept",
                    }
                ],
            )
            ecs_client.security_groups = {sg.arn: sg}

            check = ecs_securitygroup_restrict_ssh_internet()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "SSH port 22 open to the internet" in result[0].status_extended

    def test_security_group_restricted_passes(self):
        ecs_client = mock.MagicMock()
        ecs_client.security_groups = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_securitygroup_restrict_ssh_internet.ecs_securitygroup_restrict_ssh_internet.ecs_client",
                new=ecs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_securitygroup_restrict_ssh_internet.ecs_securitygroup_restrict_ssh_internet import (
                ecs_securitygroup_restrict_ssh_internet,
            )
            from prowler.providers.alibabacloud.services.ecs.ecs_service import (
                SecurityGroup,
            )

            sg = SecurityGroup(
                id="sg-2",
                name="sg-restricted",
                region="cn-hangzhou",
                arn="arn:sg/sg-2",
                ingress_rules=[
                    {
                        "ip_protocol": "tcp",
                        "source_cidr_ip": "10.0.0.0/24",
                        "port_range": "22/22",
                        "policy": "accept",
                    }
                ],
            )
            ecs_client.security_groups = {sg.arn: sg}

            check = ecs_securitygroup_restrict_ssh_internet()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "does not have SSH port 22 open" in result[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: ecs_unattached_disk_encrypted_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ecs/ecs_unattached_disk_encrypted/ecs_unattached_disk_encrypted_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestEcsUnattachedDiskEncrypted:
    def test_unattached_disk_not_encrypted_fails(self):
        ecs_client = mock.MagicMock()
        ecs_client.audited_account = "1234567890"
        ecs_client.disks = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_unattached_disk_encrypted.ecs_unattached_disk_encrypted.ecs_client",
                new=ecs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_service import Disk
            from prowler.providers.alibabacloud.services.ecs.ecs_unattached_disk_encrypted.ecs_unattached_disk_encrypted import (
                ecs_unattached_disk_encrypted,
            )

            disk = Disk(
                id="d1",
                name="d1",
                region="cn-hangzhou",
                status="Available",
                disk_category="cloud",
                size=20,
                is_attached=False,
                is_encrypted=False,
            )
            ecs_client.disks = [disk]

            check = ecs_unattached_disk_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_unattached_disk_encrypted_passes(self):
        ecs_client = mock.MagicMock()
        ecs_client.audited_account = "1234567890"
        ecs_client.disks = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ecs.ecs_unattached_disk_encrypted.ecs_unattached_disk_encrypted.ecs_client",
                new=ecs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_service import Disk
            from prowler.providers.alibabacloud.services.ecs.ecs_unattached_disk_encrypted.ecs_unattached_disk_encrypted import (
                ecs_unattached_disk_encrypted,
            )

            disk = Disk(
                id="d2",
                name="d2",
                region="cn-hangzhou",
                status="Available",
                disk_category="cloud",
                size=20,
                is_attached=False,
                is_encrypted=True,
            )
            ecs_client.disks = [disk]

            check = ecs_unattached_disk_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: oss_service_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/oss/oss_service_test.py

```python
from datetime import timezone
from threading import Lock
from unittest.mock import MagicMock, patch

from prowler.providers.alibabacloud.services.oss.oss_service import OSS


class _DummyCreds:
    def __init__(self):
        self.access_key_id = "AKID"
        self.access_key_secret = "SECRET"
        self.security_token = None


def _build_oss_service(audit_resources=None):
    """Create an OSS service instance without running __init__."""
    service = OSS.__new__(OSS)
    service.audit_resources = audit_resources or []
    service.region = "cn-hangzhou"
    service.audited_account = "1234567890"
    service.buckets = {}
    service._buckets_lock = Lock()
    client = MagicMock()
    client.region = "ap-southeast-1"
    service.regional_clients = {"ap-southeast-1": client}
    service.client = client
    service.session = MagicMock()
    service.session.get_credentials.return_value = _DummyCreds()
    # Avoid real thread pool in tests
    service.__threading_call__ = lambda call, iterator=None: [
        call(item) for item in ((iterator or service.regional_clients.values()))
    ]
    return service


def _fake_oss_list_response(bucket_name="prowler-test", location="oss-ap-southeast-1"):
    return f"""
    <ListAllMyBucketsResult>
      <Buckets>
        <Bucket>
          <Name>{bucket_name}</Name>
          <CreationDate>2025-11-26T10:26:46.000Z</CreationDate>
          <Location>{location}</Location>
        </Bucket>
      </Buckets>
    </ListAllMyBucketsResult>
    """.strip()


def test_list_buckets_parses_and_normalizes_location():
    oss = _build_oss_service()

    with patch("requests.get") as get_mock:
        get_mock.return_value = MagicMock(
            status_code=200, text=_fake_oss_list_response()
        )
        oss._list_buckets()

    arn = "acs:oss::1234567890:prowler-test"
    assert arn in oss.buckets
    stored_bucket = oss.buckets[arn]
    assert stored_bucket.region == "ap-southeast-1"
    assert stored_bucket.creation_date.tzinfo == timezone.utc


def test_list_buckets_respects_audit_filters():
    oss = _build_oss_service(audit_resources=["acs:oss::1234567890:allowed-bucket"])

    with patch("requests.get") as get_mock:
        get_mock.return_value = MagicMock(
            status_code=200,
            text=_fake_oss_list_response(bucket_name="denied-bucket"),
        )
        oss._list_buckets()

    assert list(oss.buckets.keys()) == []
```

--------------------------------------------------------------------------------

---[FILE: oss_bucket_logging_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/oss/oss_bucket_logging_enabled/oss_bucket_logging_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestOssBucketLoggingEnabled:
    def test_bucket_with_logging_enabled(self):
        oss_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.oss.oss_bucket_logging_enabled.oss_bucket_logging_enabled.oss_client",
                new=oss_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.oss.oss_bucket_logging_enabled.oss_bucket_logging_enabled import (
                oss_bucket_logging_enabled,
            )
            from prowler.providers.alibabacloud.services.oss.oss_service import Bucket

            bucket = Bucket(
                arn="acs:oss::1234567890:with-logging",
                name="with-logging",
                region="cn-hangzhou",
                logging_enabled=True,
                logging_target_bucket="log-bucket",
                logging_target_prefix="logs/",
            )
            oss_client.buckets = {bucket.arn: bucket}

            check = oss_bucket_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "logging enabled" in result[0].status_extended
            assert result[0].resource_id == "with-logging"
            assert result[0].resource_arn == bucket.arn

    def test_bucket_without_logging(self):
        oss_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.oss.oss_bucket_logging_enabled.oss_bucket_logging_enabled.oss_client",
                new=oss_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.oss.oss_bucket_logging_enabled.oss_bucket_logging_enabled import (
                oss_bucket_logging_enabled,
            )
            from prowler.providers.alibabacloud.services.oss.oss_service import Bucket

            bucket = Bucket(
                arn="acs:oss::1234567890:no-logging",
                name="no-logging",
                region="cn-hangzhou",
                logging_enabled=False,
            )
            oss_client.buckets = {bucket.arn: bucket}

            check = oss_bucket_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "does not have logging enabled" in result[0].status_extended
            assert result[0].resource_id == "no-logging"
            assert result[0].resource_arn == bucket.arn
```

--------------------------------------------------------------------------------

---[FILE: oss_bucket_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/oss/oss_bucket_not_publicly_accessible/oss_bucket_not_publicly_accessible_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestOssBucketNotPubliclyAccessible:
    def test_public_acl_fails(self):
        oss_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.oss.oss_bucket_not_publicly_accessible.oss_bucket_not_publicly_accessible.oss_client",
                new=oss_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.oss.oss_bucket_not_publicly_accessible.oss_bucket_not_publicly_accessible import (
                oss_bucket_not_publicly_accessible,
            )
            from prowler.providers.alibabacloud.services.oss.oss_service import Bucket

            bucket = Bucket(
                arn="acs:oss::1234567890:public-acl",
                name="public-acl",
                region="cn-hangzhou",
                acl="public-read",
                policy={},
            )
            oss_client.buckets = {bucket.arn: bucket}

            check = oss_bucket_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "publicly accessible" in result[0].status_extended
            assert "public-read" in result[0].status_extended

    def test_private_bucket_passes(self):
        oss_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.oss.oss_bucket_not_publicly_accessible.oss_bucket_not_publicly_accessible.oss_client",
                new=oss_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.oss.oss_bucket_not_publicly_accessible.oss_bucket_not_publicly_accessible import (
                oss_bucket_not_publicly_accessible,
            )
            from prowler.providers.alibabacloud.services.oss.oss_service import Bucket

            bucket = Bucket(
                arn="acs:oss::1234567890:private",
                name="private",
                region="cn-hangzhou",
                acl="private",
                policy={},
            )
            oss_client.buckets = {bucket.arn: bucket}

            check = oss_bucket_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "not publicly accessible" in result[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: oss_bucket_secure_transport_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/oss/oss_bucket_secure_transport_enabled/oss_bucket_secure_transport_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestOssBucketSecureTransportEnabled:
    def test_bucket_without_secure_transport_policy(self):
        oss_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.oss.oss_bucket_secure_transport_enabled.oss_bucket_secure_transport_enabled.oss_client",
                new=oss_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.oss.oss_bucket_secure_transport_enabled.oss_bucket_secure_transport_enabled import (
                oss_bucket_secure_transport_enabled,
            )
            from prowler.providers.alibabacloud.services.oss.oss_service import Bucket

            bucket = Bucket(
                arn="acs:oss::1234567890:insecure",
                name="insecure",
                region="cn-hangzhou",
                policy={},
            )
            oss_client.buckets = {bucket.arn: bucket}

            check = oss_bucket_secure_transport_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                "does not have secure transfer required enabled"
                in result[0].status_extended
            )
            assert result[0].resource_id == "insecure"

    def test_bucket_with_secure_transport_policy(self):
        oss_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.oss.oss_bucket_secure_transport_enabled.oss_bucket_secure_transport_enabled.oss_client",
                new=oss_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.oss.oss_bucket_secure_transport_enabled.oss_bucket_secure_transport_enabled import (
                oss_bucket_secure_transport_enabled,
            )
            from prowler.providers.alibabacloud.services.oss.oss_service import Bucket

            bucket = Bucket(
                arn="acs:oss::1234567890:secure",
                name="secure",
                region="cn-hangzhou",
                policy={
                    "Statement": [
                        {
                            "Effect": "Deny",
                            "Condition": {"Bool": {"acs:SecureTransport": ["false"]}},
                        }
                    ]
                },
            )
            oss_client.buckets = {bucket.arn: bucket}

            check = oss_bucket_secure_transport_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "secure transfer required enabled" in result[0].status_extended
            assert result[0].resource_id == "secure"
```

--------------------------------------------------------------------------------

---[FILE: ram_service_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ram/ram_service_test.py

```python
from unittest.mock import patch

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRAMService:
    def test_service(self):
        alibabacloud_provider = set_mocked_alibabacloud_provider()

        with patch(
            "prowler.providers.alibabacloud.services.ram.ram_service.RAM.__init__",
            return_value=None,
        ):
            from prowler.providers.alibabacloud.services.ram.ram_service import RAM

            ram_client = RAM(alibabacloud_provider)
            ram_client.service = "ram"
            ram_client.provider = alibabacloud_provider
            ram_client.regional_clients = {}

            assert ram_client.service == "ram"
            assert ram_client.provider == alibabacloud_provider
```

--------------------------------------------------------------------------------

````
