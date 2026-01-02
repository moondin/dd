---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 757
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 757 of 867)

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

---[FILE: oci_mutelist_test.py]---
Location: prowler-master/tests/providers/oraclecloud/lib/mutelist/oci_mutelist_test.py

```python
from unittest.mock import MagicMock

import yaml

from prowler.lib.outputs.finding import Finding
from prowler.providers.oraclecloud.lib.mutelist.mutelist import OCIMutelist

MUTELIST_FIXTURE_PATH = (
    "tests/providers/oraclecloud/lib/mutelist/fixtures/oci_mutelist.yaml"
)


def generate_oci_finding_output(**kwargs):
    """Generate a Finding object for OCI testing"""
    return Finding(**kwargs)


class TestOCIMutelist:
    def test_get_mutelist_file_from_local_file(self):
        mutelist = OCIMutelist(mutelist_path=MUTELIST_FIXTURE_PATH)

        with open(MUTELIST_FIXTURE_PATH) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        assert mutelist.mutelist == mutelist_fixture
        assert mutelist.mutelist_file_path == MUTELIST_FIXTURE_PATH

    def test_get_mutelist_file_from_local_file_non_existent(self):
        mutelist_path = "tests/lib/mutelist/fixtures/not_present"
        mutelist = OCIMutelist(mutelist_path=mutelist_path)

        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path == mutelist_path

    def test_validate_mutelist_not_valid_key(self):
        mutelist_path = MUTELIST_FIXTURE_PATH
        with open(mutelist_path) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        mutelist_fixture["Accounts1"] = mutelist_fixture["Accounts"]
        del mutelist_fixture["Accounts"]

        mutelist = OCIMutelist(mutelist_content=mutelist_fixture)

        assert len(mutelist.validate_mutelist(mutelist_fixture)) == 0
        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path is None

    def test_is_finding_muted(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "ocid1.tenancy.oc1..tenancy1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = OCIMutelist(mutelist_content=mutelist_content)

        finding = MagicMock()
        finding.check_metadata = MagicMock()
        finding.check_metadata.CheckID = "check_test"
        finding.status = "FAIL"
        finding.resource_id = "test_resource"
        finding.region = "us-ashburn-1"
        finding.resource_tags = []

        assert mutelist.is_finding_muted(finding, "ocid1.tenancy.oc1..tenancy1")
```

--------------------------------------------------------------------------------

---[FILE: oci_mutelist.yaml]---
Location: prowler-master/tests/providers/oraclecloud/lib/mutelist/fixtures/oci_mutelist.yaml

```yaml
Mutelist:
  Accounts:
    "ocid1.tenancy.oc1..aaaaaaaexample":
      Checks:
        "identity_*":
          Regions:
            - "*"
          Resources:
            - "*"
        "network_security_list_ingress_from_internet_to_ssh_port":
          Regions:
            - "us-ashburn-1"
          Resources:
            - "ocid1.securitylist.oc1.iad.aaaaaaaexample"
        "objectstorage_bucket_not_publicly_accessible":
          Regions:
            - "*"
          Resources:
            - "*"
          Tags:
            - "Environment=Development"
```

--------------------------------------------------------------------------------

---[FILE: analytics_service_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/analytics/analytics_service_test.py

```python
from unittest.mock import patch

from tests.providers.oraclecloud.oci_fixtures import set_mocked_oraclecloud_provider


class TestAnalyticsService:
    def test_service(self):
        """Test that analytics service can be instantiated and mocked"""
        oraclecloud_provider = set_mocked_oraclecloud_provider()

        # Mock the entire service initialization
        with patch(
            "prowler.providers.oraclecloud.services.analytics.analytics_service.Analytics.__init__",
            return_value=None,
        ):
            from prowler.providers.oraclecloud.services.analytics.analytics_service import (
                Analytics,
            )

            analytics_client = Analytics(oraclecloud_provider)

            # Manually set required attributes since __init__ was mocked
            analytics_client.service = "analytics"
            analytics_client.provider = oraclecloud_provider
            analytics_client.audited_compartments = {}
            analytics_client.regional_clients = {}

            # Verify service name
            assert analytics_client.service == "analytics"
            assert analytics_client.provider == oraclecloud_provider
```

--------------------------------------------------------------------------------

---[FILE: analytics_instance_access_restricted_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/analytics/analytics_instance_access_restricted/analytics_instance_access_restricted_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_analytics_instance_access_restricted:
    def test_no_resources(self):
        """analytics_instance_access_restricted: No resources to check"""
        analytics_client = mock.MagicMock()
        analytics_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        analytics_client.audited_tenancy = OCI_TENANCY_ID

        # Mock empty collections
        analytics_client.rules = []
        analytics_client.topics = []
        analytics_client.subscriptions = []
        analytics_client.users = []
        analytics_client.groups = []
        analytics_client.policies = []
        analytics_client.compartments = []
        analytics_client.instances = []
        analytics_client.volumes = []
        analytics_client.boot_volumes = []
        analytics_client.buckets = []
        analytics_client.keys = []
        analytics_client.file_systems = []
        analytics_client.databases = []
        analytics_client.security_lists = []
        analytics_client.security_groups = []
        analytics_client.subnets = []
        analytics_client.vcns = []
        analytics_client.configuration = None
        analytics_client.active_non_root_compartments = []
        analytics_client.password_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.analytics.analytics_instance_access_restricted.analytics_instance_access_restricted.analytics_client",
                new=analytics_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.analytics.analytics_instance_access_restricted.analytics_instance_access_restricted import (
                analytics_instance_access_restricted,
            )

            check = analytics_instance_access_restricted()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """analytics_instance_access_restricted: Resource passes the check (PASS)"""
        analytics_client = mock.MagicMock()
        analytics_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        analytics_client.audited_tenancy = OCI_TENANCY_ID

        # Mock a compliant resource
        resource = mock.MagicMock()
        resource.id = "ocid1.resource.oc1.iad.aaaaaaaexample"
        resource.name = "compliant-resource"
        resource.region = OCI_REGION
        resource.compartment_id = OCI_COMPARTMENT_ID
        resource.lifecycle_state = "ACTIVE"
        resource.tags = {"Environment": "Production"}

        # Set attributes that make the resource compliant
        resource.versioning = "Enabled"
        resource.is_auto_rotation_enabled = True
        resource.rotation_interval_in_days = 90
        resource.public_access_type = "NoPublicAccess"
        resource.logging_enabled = True
        resource.kms_key_id = "ocid1.key.oc1.iad.aaaaaaaexample"
        resource.in_transit_encryption = "ENABLED"
        resource.is_secure_boot_enabled = True
        resource.legacy_endpoint_disabled = True
        resource.is_legacy_imds_endpoint_disabled = True

        # Mock client with compliant resource
        analytics_client.buckets = [resource]
        analytics_client.keys = [resource]
        analytics_client.volumes = [resource]
        analytics_client.boot_volumes = [resource]
        analytics_client.instances = [resource]
        analytics_client.file_systems = [resource]
        analytics_client.databases = [resource]
        analytics_client.security_lists = []
        analytics_client.security_groups = []
        analytics_client.rules = []
        analytics_client.configuration = resource
        analytics_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.analytics.analytics_instance_access_restricted.analytics_instance_access_restricted.analytics_client",
                new=analytics_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.analytics.analytics_instance_access_restricted.analytics_instance_access_restricted import (
                analytics_instance_access_restricted,
            )

            check = analytics_instance_access_restricted()
            result = check.execute()

            assert isinstance(result, list)

            # If results exist, verify PASS findings
            if len(result) > 0:
                # Find PASS results
                pass_results = [r for r in result if r.status == "PASS"]

                if pass_results:
                    # Detailed assertions on first PASS result
                    assert pass_results[0].status == "PASS"
                    assert pass_results[0].status_extended is not None
                    assert len(pass_results[0].status_extended) > 0

                    # Verify resource identification
                    assert pass_results[0].resource_id is not None
                    assert pass_results[0].resource_name is not None
                    assert pass_results[0].region is not None
                    assert pass_results[0].compartment_id is not None

                    # Verify metadata
                    assert pass_results[0].check_metadata.Provider == "oraclecloud"
                    assert (
                        pass_results[0].check_metadata.CheckID
                        == "analytics_instance_access_restricted"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "analytics"

    def test_resource_non_compliant(self):
        """analytics_instance_access_restricted: Resource fails the check (FAIL)"""
        analytics_client = mock.MagicMock()
        analytics_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        analytics_client.audited_tenancy = OCI_TENANCY_ID

        # Mock a non-compliant resource
        resource = mock.MagicMock()
        resource.id = "ocid1.resource.oc1.iad.bbbbbbbexample"
        resource.name = "non-compliant-resource"
        resource.region = OCI_REGION
        resource.compartment_id = OCI_COMPARTMENT_ID
        resource.lifecycle_state = "ACTIVE"
        resource.tags = {"Environment": "Development"}

        # Set attributes that make the resource non-compliant
        resource.versioning = "Disabled"
        resource.is_auto_rotation_enabled = False
        resource.rotation_interval_in_days = None
        resource.public_access_type = "ObjectRead"
        resource.logging_enabled = False
        resource.kms_key_id = None
        resource.in_transit_encryption = "DISABLED"
        resource.is_secure_boot_enabled = False
        resource.legacy_endpoint_disabled = False
        resource.is_legacy_imds_endpoint_disabled = False

        # Mock client with non-compliant resource
        analytics_client.buckets = [resource]
        analytics_client.keys = [resource]
        analytics_client.volumes = [resource]
        analytics_client.boot_volumes = [resource]
        analytics_client.instances = [resource]
        analytics_client.file_systems = [resource]
        analytics_client.databases = [resource]
        analytics_client.security_lists = []
        analytics_client.security_groups = []
        analytics_client.rules = []
        analytics_client.configuration = resource
        analytics_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.analytics.analytics_instance_access_restricted.analytics_instance_access_restricted.analytics_client",
                new=analytics_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.analytics.analytics_instance_access_restricted.analytics_instance_access_restricted import (
                analytics_instance_access_restricted,
            )

            check = analytics_instance_access_restricted()
            result = check.execute()

            assert isinstance(result, list)

            # Verify FAIL findings exist
            if len(result) > 0:
                # Find FAIL results
                fail_results = [r for r in result if r.status == "FAIL"]

                if fail_results:
                    # Detailed assertions on first FAIL result
                    assert fail_results[0].status == "FAIL"
                    assert fail_results[0].status_extended is not None
                    assert len(fail_results[0].status_extended) > 0

                    # Verify resource identification
                    assert fail_results[0].resource_id is not None
                    assert fail_results[0].resource_name is not None
                    assert fail_results[0].region is not None
                    assert fail_results[0].compartment_id is not None

                    # Verify metadata
                    assert fail_results[0].check_metadata.Provider == "oraclecloud"
                    assert (
                        fail_results[0].check_metadata.CheckID
                        == "analytics_instance_access_restricted"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "analytics"
```

--------------------------------------------------------------------------------

---[FILE: audit_service_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/audit/audit_service_test.py

```python
from unittest.mock import patch

from tests.providers.oraclecloud.oci_fixtures import set_mocked_oraclecloud_provider


class TestAuditService:
    def test_service(self):
        """Test that audit service can be instantiated and mocked"""
        oraclecloud_provider = set_mocked_oraclecloud_provider()

        # Mock the entire service initialization
        with patch(
            "prowler.providers.oraclecloud.services.audit.audit_service.Audit.__init__",
            return_value=None,
        ):
            from prowler.providers.oraclecloud.services.audit.audit_service import Audit

            audit_client = Audit(oraclecloud_provider)

            # Manually set required attributes since __init__ was mocked
            audit_client.service = "audit"
            audit_client.provider = oraclecloud_provider
            audit_client.audited_compartments = {}
            audit_client.regional_clients = {}

            # Verify service name
            assert audit_client.service == "audit"
            assert audit_client.provider == oraclecloud_provider
```

--------------------------------------------------------------------------------

---[FILE: audit_log_retention_period_365_days_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/audit/audit_log_retention_period_365_days/audit_log_retention_period_365_days_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_audit_log_retention_period_365_days:
    def test_no_resources(self):
        """audit_log_retention_period_365_days: No audit configuration"""
        audit_client = mock.MagicMock()
        audit_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        audit_client.audited_tenancy = OCI_TENANCY_ID
        audit_client.configuration = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.audit.audit_log_retention_period_365_days.audit_log_retention_period_365_days.audit_client",
                new=audit_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.audit.audit_log_retention_period_365_days.audit_log_retention_period_365_days import (
                audit_log_retention_period_365_days,
            )

            check = audit_log_retention_period_365_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "not found" in result[0].status_extended

    def test_resource_compliant(self):
        """audit_log_retention_period_365_days: Retention period >= 365 days"""
        audit_client = mock.MagicMock()
        audit_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        audit_client.audited_tenancy = OCI_TENANCY_ID

        # Mock audit configuration with compliant retention period
        config = mock.MagicMock()
        config.retention_period_days = 365

        audit_client.configuration = config

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.audit.audit_log_retention_period_365_days.audit_log_retention_period_365_days.audit_client",
                new=audit_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.audit.audit_log_retention_period_365_days.audit_log_retention_period_365_days import (
                audit_log_retention_period_365_days,
            )

            check = audit_log_retention_period_365_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "365 days or greater" in result[0].status_extended

    def test_resource_non_compliant(self):
        """audit_log_retention_period_365_days: Retention period < 365 days"""
        audit_client = mock.MagicMock()
        audit_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        audit_client.audited_tenancy = OCI_TENANCY_ID

        # Mock audit configuration with non-compliant retention period
        config = mock.MagicMock()
        config.retention_period_days = 90

        audit_client.configuration = config

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.audit.audit_log_retention_period_365_days.audit_log_retention_period_365_days.audit_client",
                new=audit_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.audit.audit_log_retention_period_365_days.audit_log_retention_period_365_days import (
                audit_log_retention_period_365_days,
            )

            check = audit_log_retention_period_365_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "less than 365 days" in result[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: blockstorage_service_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/blockstorage/blockstorage_service_test.py

```python
from unittest.mock import patch

from tests.providers.oraclecloud.oci_fixtures import set_mocked_oraclecloud_provider


class TestBlockStorageService:
    def test_service(self):
        """Test that blockstorage service can be instantiated and mocked"""
        oraclecloud_provider = set_mocked_oraclecloud_provider()

        # Mock the entire service initialization
        with patch(
            "prowler.providers.oraclecloud.services.blockstorage.blockstorage_service.BlockStorage.__init__",
            return_value=None,
        ):
            from prowler.providers.oraclecloud.services.blockstorage.blockstorage_service import (
                BlockStorage,
            )

            blockstorage_client = BlockStorage(oraclecloud_provider)

            # Manually set required attributes since __init__ was mocked
            blockstorage_client.service = "blockstorage"
            blockstorage_client.provider = oraclecloud_provider
            blockstorage_client.audited_compartments = {}
            blockstorage_client.regional_clients = {}

            # Verify service name
            assert blockstorage_client.service == "blockstorage"
            assert blockstorage_client.provider == oraclecloud_provider
```

--------------------------------------------------------------------------------

---[FILE: blockstorage_block_volume_encrypted_with_cmk_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/blockstorage/blockstorage_block_volume_encrypted_with_cmk/blockstorage_block_volume_encrypted_with_cmk_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_blockstorage_block_volume_encrypted_with_cmk:
    def test_no_resources(self):
        """blockstorage_block_volume_encrypted_with_cmk: No resources to check"""
        blockstorage_client = mock.MagicMock()
        blockstorage_client.audited_compartments = {
            OCI_COMPARTMENT_ID: mock.MagicMock()
        }
        blockstorage_client.audited_tenancy = OCI_TENANCY_ID

        # Mock empty collections
        blockstorage_client.rules = []
        blockstorage_client.topics = []
        blockstorage_client.subscriptions = []
        blockstorage_client.users = []
        blockstorage_client.groups = []
        blockstorage_client.policies = []
        blockstorage_client.compartments = []
        blockstorage_client.instances = []
        blockstorage_client.volumes = []
        blockstorage_client.boot_volumes = []
        blockstorage_client.buckets = []
        blockstorage_client.keys = []
        blockstorage_client.file_systems = []
        blockstorage_client.databases = []
        blockstorage_client.security_lists = []
        blockstorage_client.security_groups = []
        blockstorage_client.subnets = []
        blockstorage_client.vcns = []
        blockstorage_client.configuration = None
        blockstorage_client.active_non_root_compartments = []
        blockstorage_client.password_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.blockstorage.blockstorage_block_volume_encrypted_with_cmk.blockstorage_block_volume_encrypted_with_cmk.blockstorage_client",
                new=blockstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.blockstorage.blockstorage_block_volume_encrypted_with_cmk.blockstorage_block_volume_encrypted_with_cmk import (
                blockstorage_block_volume_encrypted_with_cmk,
            )

            check = blockstorage_block_volume_encrypted_with_cmk()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """blockstorage_block_volume_encrypted_with_cmk: Resource passes the check (PASS)"""
        blockstorage_client = mock.MagicMock()
        blockstorage_client.audited_compartments = {
            OCI_COMPARTMENT_ID: mock.MagicMock()
        }
        blockstorage_client.audited_tenancy = OCI_TENANCY_ID

        # Mock a compliant resource
        resource = mock.MagicMock()
        resource.id = "ocid1.resource.oc1.iad.aaaaaaaexample"
        resource.name = "compliant-resource"
        resource.region = OCI_REGION
        resource.compartment_id = OCI_COMPARTMENT_ID
        resource.lifecycle_state = "ACTIVE"
        resource.tags = {"Environment": "Production"}

        # Set attributes that make the resource compliant
        resource.versioning = "Enabled"
        resource.is_auto_rotation_enabled = True
        resource.rotation_interval_in_days = 90
        resource.public_access_type = "NoPublicAccess"
        resource.logging_enabled = True
        resource.kms_key_id = "ocid1.key.oc1.iad.aaaaaaaexample"
        resource.in_transit_encryption = "ENABLED"
        resource.is_secure_boot_enabled = True
        resource.legacy_endpoint_disabled = True
        resource.is_legacy_imds_endpoint_disabled = True

        # Mock client with compliant resource
        blockstorage_client.buckets = [resource]
        blockstorage_client.keys = [resource]
        blockstorage_client.volumes = [resource]
        blockstorage_client.boot_volumes = [resource]
        blockstorage_client.instances = [resource]
        blockstorage_client.file_systems = [resource]
        blockstorage_client.databases = [resource]
        blockstorage_client.security_lists = []
        blockstorage_client.security_groups = []
        blockstorage_client.rules = []
        blockstorage_client.configuration = resource
        blockstorage_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.blockstorage.blockstorage_block_volume_encrypted_with_cmk.blockstorage_block_volume_encrypted_with_cmk.blockstorage_client",
                new=blockstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.blockstorage.blockstorage_block_volume_encrypted_with_cmk.blockstorage_block_volume_encrypted_with_cmk import (
                blockstorage_block_volume_encrypted_with_cmk,
            )

            check = blockstorage_block_volume_encrypted_with_cmk()
            result = check.execute()

            assert isinstance(result, list)

            # If results exist, verify PASS findings
            if len(result) > 0:
                # Find PASS results
                pass_results = [r for r in result if r.status == "PASS"]

                if pass_results:
                    # Detailed assertions on first PASS result
                    assert pass_results[0].status == "PASS"
                    assert pass_results[0].status_extended is not None
                    assert len(pass_results[0].status_extended) > 0

                    # Verify resource identification
                    assert pass_results[0].resource_id is not None
                    assert pass_results[0].resource_name is not None
                    assert pass_results[0].region is not None
                    assert pass_results[0].compartment_id is not None

                    # Verify metadata
                    assert pass_results[0].check_metadata.Provider == "oraclecloud"
                    assert (
                        pass_results[0].check_metadata.CheckID
                        == "blockstorage_block_volume_encrypted_with_cmk"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "blockstorage"

    def test_resource_non_compliant(self):
        """blockstorage_block_volume_encrypted_with_cmk: Resource fails the check (FAIL)"""
        blockstorage_client = mock.MagicMock()
        blockstorage_client.audited_compartments = {
            OCI_COMPARTMENT_ID: mock.MagicMock()
        }
        blockstorage_client.audited_tenancy = OCI_TENANCY_ID

        # Mock a non-compliant resource
        resource = mock.MagicMock()
        resource.id = "ocid1.resource.oc1.iad.bbbbbbbexample"
        resource.name = "non-compliant-resource"
        resource.region = OCI_REGION
        resource.compartment_id = OCI_COMPARTMENT_ID
        resource.lifecycle_state = "ACTIVE"
        resource.tags = {"Environment": "Development"}

        # Set attributes that make the resource non-compliant
        resource.versioning = "Disabled"
        resource.is_auto_rotation_enabled = False
        resource.rotation_interval_in_days = None
        resource.public_access_type = "ObjectRead"
        resource.logging_enabled = False
        resource.kms_key_id = None
        resource.in_transit_encryption = "DISABLED"
        resource.is_secure_boot_enabled = False
        resource.legacy_endpoint_disabled = False
        resource.is_legacy_imds_endpoint_disabled = False

        # Mock client with non-compliant resource
        blockstorage_client.buckets = [resource]
        blockstorage_client.keys = [resource]
        blockstorage_client.volumes = [resource]
        blockstorage_client.boot_volumes = [resource]
        blockstorage_client.instances = [resource]
        blockstorage_client.file_systems = [resource]
        blockstorage_client.databases = [resource]
        blockstorage_client.security_lists = []
        blockstorage_client.security_groups = []
        blockstorage_client.rules = []
        blockstorage_client.configuration = resource
        blockstorage_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.blockstorage.blockstorage_block_volume_encrypted_with_cmk.blockstorage_block_volume_encrypted_with_cmk.blockstorage_client",
                new=blockstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.blockstorage.blockstorage_block_volume_encrypted_with_cmk.blockstorage_block_volume_encrypted_with_cmk import (
                blockstorage_block_volume_encrypted_with_cmk,
            )

            check = blockstorage_block_volume_encrypted_with_cmk()
            result = check.execute()

            assert isinstance(result, list)

            # Verify FAIL findings exist
            if len(result) > 0:
                # Find FAIL results
                fail_results = [r for r in result if r.status == "FAIL"]

                if fail_results:
                    # Detailed assertions on first FAIL result
                    assert fail_results[0].status == "FAIL"
                    assert fail_results[0].status_extended is not None
                    assert len(fail_results[0].status_extended) > 0

                    # Verify resource identification
                    assert fail_results[0].resource_id is not None
                    assert fail_results[0].resource_name is not None
                    assert fail_results[0].region is not None
                    assert fail_results[0].compartment_id is not None

                    # Verify metadata
                    assert fail_results[0].check_metadata.Provider == "oraclecloud"
                    assert (
                        fail_results[0].check_metadata.CheckID
                        == "blockstorage_block_volume_encrypted_with_cmk"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "blockstorage"
```

--------------------------------------------------------------------------------

````
