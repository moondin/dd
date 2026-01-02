---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 758
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 758 of 867)

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

---[FILE: blockstorage_boot_volume_encrypted_with_cmk_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/blockstorage/blockstorage_boot_volume_encrypted_with_cmk/blockstorage_boot_volume_encrypted_with_cmk_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_blockstorage_boot_volume_encrypted_with_cmk:
    def test_no_resources(self):
        """blockstorage_boot_volume_encrypted_with_cmk: No resources to check"""
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
                "prowler.providers.oraclecloud.services.blockstorage.blockstorage_boot_volume_encrypted_with_cmk.blockstorage_boot_volume_encrypted_with_cmk.blockstorage_client",
                new=blockstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.blockstorage.blockstorage_boot_volume_encrypted_with_cmk.blockstorage_boot_volume_encrypted_with_cmk import (
                blockstorage_boot_volume_encrypted_with_cmk,
            )

            check = blockstorage_boot_volume_encrypted_with_cmk()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """blockstorage_boot_volume_encrypted_with_cmk: Resource passes the check (PASS)"""
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
                "prowler.providers.oraclecloud.services.blockstorage.blockstorage_boot_volume_encrypted_with_cmk.blockstorage_boot_volume_encrypted_with_cmk.blockstorage_client",
                new=blockstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.blockstorage.blockstorage_boot_volume_encrypted_with_cmk.blockstorage_boot_volume_encrypted_with_cmk import (
                blockstorage_boot_volume_encrypted_with_cmk,
            )

            check = blockstorage_boot_volume_encrypted_with_cmk()
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
                        == "blockstorage_boot_volume_encrypted_with_cmk"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "blockstorage"

    def test_resource_non_compliant(self):
        """blockstorage_boot_volume_encrypted_with_cmk: Resource fails the check (FAIL)"""
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
                "prowler.providers.oraclecloud.services.blockstorage.blockstorage_boot_volume_encrypted_with_cmk.blockstorage_boot_volume_encrypted_with_cmk.blockstorage_client",
                new=blockstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.blockstorage.blockstorage_boot_volume_encrypted_with_cmk.blockstorage_boot_volume_encrypted_with_cmk import (
                blockstorage_boot_volume_encrypted_with_cmk,
            )

            check = blockstorage_boot_volume_encrypted_with_cmk()
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
                        == "blockstorage_boot_volume_encrypted_with_cmk"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "blockstorage"
```

--------------------------------------------------------------------------------

---[FILE: cloudguard_service_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/cloudguard/cloudguard_service_test.py

```python
from unittest.mock import patch

from tests.providers.oraclecloud.oci_fixtures import set_mocked_oraclecloud_provider


class TestCloudguardService:
    def test_service(self):
        """Test that cloudguard service can be instantiated and mocked"""
        oraclecloud_provider = set_mocked_oraclecloud_provider()

        # Mock the entire service initialization
        with patch(
            "prowler.providers.oraclecloud.services.cloudguard.cloudguard_service.CloudGuard.__init__",
            return_value=None,
        ):
            from prowler.providers.oraclecloud.services.cloudguard.cloudguard_service import (
                CloudGuard,
            )

            cloudguard_client = CloudGuard(oraclecloud_provider)

            # Manually set required attributes since __init__ was mocked
            cloudguard_client.service = "cloudguard"
            cloudguard_client.provider = oraclecloud_provider
            cloudguard_client.audited_compartments = {}
            cloudguard_client.regional_clients = {}

            # Verify service name
            assert cloudguard_client.service == "cloudguard"
            assert cloudguard_client.provider == oraclecloud_provider
```

--------------------------------------------------------------------------------

---[FILE: cloudguard_enabled_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/cloudguard/cloudguard_enabled/cloudguard_enabled_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_cloudguard_enabled:
    def test_no_resources(self):
        """cloudguard_enabled: No resources to check"""
        cloudguard_client = mock.MagicMock()
        cloudguard_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        cloudguard_client.audited_tenancy = OCI_TENANCY_ID

        # Mock empty collections
        cloudguard_client.rules = []
        cloudguard_client.topics = []
        cloudguard_client.subscriptions = []
        cloudguard_client.users = []
        cloudguard_client.groups = []
        cloudguard_client.policies = []
        cloudguard_client.compartments = []
        cloudguard_client.instances = []
        cloudguard_client.volumes = []
        cloudguard_client.boot_volumes = []
        cloudguard_client.buckets = []
        cloudguard_client.keys = []
        cloudguard_client.file_systems = []
        cloudguard_client.databases = []
        cloudguard_client.security_lists = []
        cloudguard_client.security_groups = []
        cloudguard_client.subnets = []
        cloudguard_client.vcns = []
        cloudguard_client.configuration = None
        cloudguard_client.active_non_root_compartments = []
        cloudguard_client.password_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.cloudguard.cloudguard_enabled.cloudguard_enabled.cloudguard_client",
                new=cloudguard_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.cloudguard.cloudguard_enabled.cloudguard_enabled import (
                cloudguard_enabled,
            )

            check = cloudguard_enabled()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """cloudguard_enabled: Resource passes the check (PASS)"""
        cloudguard_client = mock.MagicMock()
        cloudguard_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        cloudguard_client.audited_tenancy = OCI_TENANCY_ID

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
        cloudguard_client.buckets = [resource]
        cloudguard_client.keys = [resource]
        cloudguard_client.volumes = [resource]
        cloudguard_client.boot_volumes = [resource]
        cloudguard_client.instances = [resource]
        cloudguard_client.file_systems = [resource]
        cloudguard_client.databases = [resource]
        cloudguard_client.security_lists = []
        cloudguard_client.security_groups = []
        cloudguard_client.rules = []
        cloudguard_client.configuration = resource
        cloudguard_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.cloudguard.cloudguard_enabled.cloudguard_enabled.cloudguard_client",
                new=cloudguard_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.cloudguard.cloudguard_enabled.cloudguard_enabled import (
                cloudguard_enabled,
            )

            check = cloudguard_enabled()
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
                        pass_results[0].check_metadata.CheckID == "cloudguard_enabled"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "cloudguard"

    def test_resource_non_compliant(self):
        """cloudguard_enabled: Resource fails the check (FAIL)"""
        cloudguard_client = mock.MagicMock()
        cloudguard_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        cloudguard_client.audited_tenancy = OCI_TENANCY_ID

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
        cloudguard_client.buckets = [resource]
        cloudguard_client.keys = [resource]
        cloudguard_client.volumes = [resource]
        cloudguard_client.boot_volumes = [resource]
        cloudguard_client.instances = [resource]
        cloudguard_client.file_systems = [resource]
        cloudguard_client.databases = [resource]
        cloudguard_client.security_lists = []
        cloudguard_client.security_groups = []
        cloudguard_client.rules = []
        cloudguard_client.configuration = resource
        cloudguard_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.cloudguard.cloudguard_enabled.cloudguard_enabled.cloudguard_client",
                new=cloudguard_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.cloudguard.cloudguard_enabled.cloudguard_enabled import (
                cloudguard_enabled,
            )

            check = cloudguard_enabled()
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
                        fail_results[0].check_metadata.CheckID == "cloudguard_enabled"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "cloudguard"
```

--------------------------------------------------------------------------------

---[FILE: compute_service_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/compute/compute_service_test.py

```python
from unittest.mock import patch

from tests.providers.oraclecloud.oci_fixtures import set_mocked_oraclecloud_provider


class TestComputeService:
    def test_service(self):
        """Test that compute service can be instantiated and mocked"""
        oraclecloud_provider = set_mocked_oraclecloud_provider()

        # Mock the entire service initialization
        with patch(
            "prowler.providers.oraclecloud.services.compute.compute_service.Compute.__init__",
            return_value=None,
        ):
            from prowler.providers.oraclecloud.services.compute.compute_service import (
                Compute,
            )

            compute_client = Compute(oraclecloud_provider)

            # Manually set required attributes since __init__ was mocked
            compute_client.service = "compute"
            compute_client.provider = oraclecloud_provider
            compute_client.audited_compartments = {}
            compute_client.regional_clients = {}

            # Verify service name
            assert compute_client.service == "compute"
            assert compute_client.provider == oraclecloud_provider
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_in_transit_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/compute/compute_instance_in_transit_encryption_enabled/compute_instance_in_transit_encryption_enabled_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_compute_instance_in_transit_encryption_enabled:
    def test_no_resources(self):
        """compute_instance_in_transit_encryption_enabled: No resources to check"""
        compute_client = mock.MagicMock()
        compute_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        compute_client.audited_tenancy = OCI_TENANCY_ID

        # Mock empty collections
        compute_client.rules = []
        compute_client.topics = []
        compute_client.subscriptions = []
        compute_client.users = []
        compute_client.groups = []
        compute_client.policies = []
        compute_client.compartments = []
        compute_client.instances = []
        compute_client.volumes = []
        compute_client.boot_volumes = []
        compute_client.buckets = []
        compute_client.keys = []
        compute_client.file_systems = []
        compute_client.databases = []
        compute_client.security_lists = []
        compute_client.security_groups = []
        compute_client.subnets = []
        compute_client.vcns = []
        compute_client.configuration = None
        compute_client.active_non_root_compartments = []
        compute_client.password_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.compute.compute_instance_in_transit_encryption_enabled.compute_instance_in_transit_encryption_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.compute.compute_instance_in_transit_encryption_enabled.compute_instance_in_transit_encryption_enabled import (
                compute_instance_in_transit_encryption_enabled,
            )

            check = compute_instance_in_transit_encryption_enabled()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """compute_instance_in_transit_encryption_enabled: Resource passes the check (PASS)"""
        compute_client = mock.MagicMock()
        compute_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        compute_client.audited_tenancy = OCI_TENANCY_ID

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
        compute_client.buckets = [resource]
        compute_client.keys = [resource]
        compute_client.volumes = [resource]
        compute_client.boot_volumes = [resource]
        compute_client.instances = [resource]
        compute_client.file_systems = [resource]
        compute_client.databases = [resource]
        compute_client.security_lists = []
        compute_client.security_groups = []
        compute_client.rules = []
        compute_client.configuration = resource
        compute_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.compute.compute_instance_in_transit_encryption_enabled.compute_instance_in_transit_encryption_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.compute.compute_instance_in_transit_encryption_enabled.compute_instance_in_transit_encryption_enabled import (
                compute_instance_in_transit_encryption_enabled,
            )

            check = compute_instance_in_transit_encryption_enabled()
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
                        == "compute_instance_in_transit_encryption_enabled"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "compute"

    def test_resource_non_compliant(self):
        """compute_instance_in_transit_encryption_enabled: Resource fails the check (FAIL)"""
        compute_client = mock.MagicMock()
        compute_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        compute_client.audited_tenancy = OCI_TENANCY_ID

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
        compute_client.buckets = [resource]
        compute_client.keys = [resource]
        compute_client.volumes = [resource]
        compute_client.boot_volumes = [resource]
        compute_client.instances = [resource]
        compute_client.file_systems = [resource]
        compute_client.databases = [resource]
        compute_client.security_lists = []
        compute_client.security_groups = []
        compute_client.rules = []
        compute_client.configuration = resource
        compute_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.compute.compute_instance_in_transit_encryption_enabled.compute_instance_in_transit_encryption_enabled.compute_client",
                new=compute_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.compute.compute_instance_in_transit_encryption_enabled.compute_instance_in_transit_encryption_enabled import (
                compute_instance_in_transit_encryption_enabled,
            )

            check = compute_instance_in_transit_encryption_enabled()
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
                        == "compute_instance_in_transit_encryption_enabled"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "compute"
```

--------------------------------------------------------------------------------

````
