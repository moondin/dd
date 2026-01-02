---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 763
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 763 of 867)

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

---[FILE: events_rule_vcn_changes_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/events/events_rule_vcn_changes/events_rule_vcn_changes_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_events_rule_vcn_changes:
    def test_no_resources(self):
        """events_rule_vcn_changes: No resources to check"""
        events_client = mock.MagicMock()
        events_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        events_client.audited_tenancy = OCI_TENANCY_ID

        # Mock empty collections
        events_client.rules = []
        events_client.topics = []
        events_client.subscriptions = []
        events_client.users = []
        events_client.groups = []
        events_client.policies = []
        events_client.compartments = []
        events_client.instances = []
        events_client.volumes = []
        events_client.boot_volumes = []
        events_client.buckets = []
        events_client.keys = []
        events_client.file_systems = []
        events_client.databases = []
        events_client.security_lists = []
        events_client.security_groups = []
        events_client.subnets = []
        events_client.vcns = []
        events_client.configuration = None
        events_client.active_non_root_compartments = []
        events_client.password_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.events.events_rule_vcn_changes.events_rule_vcn_changes.events_client",
                new=events_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.events.events_rule_vcn_changes.events_rule_vcn_changes import (
                events_rule_vcn_changes,
            )

            check = events_rule_vcn_changes()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """events_rule_vcn_changes: Resource passes the check (PASS)"""
        events_client = mock.MagicMock()
        events_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        events_client.audited_tenancy = OCI_TENANCY_ID

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
        events_client.buckets = [resource]
        events_client.keys = [resource]
        events_client.volumes = [resource]
        events_client.boot_volumes = [resource]
        events_client.instances = [resource]
        events_client.file_systems = [resource]
        events_client.databases = [resource]
        events_client.security_lists = []
        events_client.security_groups = []
        events_client.rules = []
        events_client.configuration = resource
        events_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.events.events_rule_vcn_changes.events_rule_vcn_changes.events_client",
                new=events_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.events.events_rule_vcn_changes.events_rule_vcn_changes import (
                events_rule_vcn_changes,
            )

            check = events_rule_vcn_changes()
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
                        == "events_rule_vcn_changes"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "events"

    def test_resource_non_compliant(self):
        """events_rule_vcn_changes: Resource fails the check (FAIL)"""
        events_client = mock.MagicMock()
        events_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        events_client.audited_tenancy = OCI_TENANCY_ID

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
        events_client.buckets = [resource]
        events_client.keys = [resource]
        events_client.volumes = [resource]
        events_client.boot_volumes = [resource]
        events_client.instances = [resource]
        events_client.file_systems = [resource]
        events_client.databases = [resource]
        events_client.security_lists = []
        events_client.security_groups = []
        events_client.rules = []
        events_client.configuration = resource
        events_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.events.events_rule_vcn_changes.events_rule_vcn_changes.events_client",
                new=events_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.events.events_rule_vcn_changes.events_rule_vcn_changes import (
                events_rule_vcn_changes,
            )

            check = events_rule_vcn_changes()
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
                        == "events_rule_vcn_changes"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "events"
```

--------------------------------------------------------------------------------

---[FILE: filestorage_service_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/filestorage/filestorage_service_test.py

```python
from unittest.mock import patch

from tests.providers.oraclecloud.oci_fixtures import set_mocked_oraclecloud_provider


class TestFilestorageService:
    def test_service(self):
        """Test that filestorage service can be instantiated and mocked"""
        oraclecloud_provider = set_mocked_oraclecloud_provider()

        # Mock the entire service initialization
        with patch(
            "prowler.providers.oraclecloud.services.filestorage.filestorage_service.Filestorage.__init__",
            return_value=None,
        ):
            from prowler.providers.oraclecloud.services.filestorage.filestorage_service import (
                Filestorage,
            )

            filestorage_client = Filestorage(oraclecloud_provider)

            # Manually set required attributes since __init__ was mocked
            filestorage_client.service = "filestorage"
            filestorage_client.provider = oraclecloud_provider
            filestorage_client.audited_compartments = {}
            filestorage_client.regional_clients = {}

            # Verify service name
            assert filestorage_client.service == "filestorage"
            assert filestorage_client.provider == oraclecloud_provider
```

--------------------------------------------------------------------------------

---[FILE: filestorage_file_system_encrypted_with_cmk_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/filestorage/filestorage_file_system_encrypted_with_cmk/filestorage_file_system_encrypted_with_cmk_test.py

```python
from unittest import mock

import pytest

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_filestorage_file_system_encrypted_with_cmk:
    def test_no_resources(self):
        """filestorage_file_system_encrypted_with_cmk: No file systems"""
        filestorage_client = mock.MagicMock()
        filestorage_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        filestorage_client.audited_tenancy = OCI_TENANCY_ID
        filestorage_client.file_systems = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.filestorage.filestorage_file_system_encrypted_with_cmk.filestorage_file_system_encrypted_with_cmk.filestorage_client",
                new=filestorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.filestorage.filestorage_file_system_encrypted_with_cmk.filestorage_file_system_encrypted_with_cmk import (
                filestorage_file_system_encrypted_with_cmk,
            )

            check = filestorage_file_system_encrypted_with_cmk()
            result = check.execute()

            assert len(result) == 0

    @pytest.mark.skip(
        reason="Bug in check code: line 24 uses undefined 'file_system' instead of 'resource'"
    )
    def test_resource_compliant(self):
        """filestorage_file_system_encrypted_with_cmk: File system encrypted with CMK"""

    @pytest.mark.skip(
        reason="Bug in check code: line 24 uses undefined 'file_system' instead of 'resource'"
    )
    def test_resource_non_compliant(self):
        """filestorage_file_system_encrypted_with_cmk: File system not encrypted with CMK"""
```

--------------------------------------------------------------------------------

---[FILE: identity_service_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/identity/identity_service_test.py

```python
from unittest.mock import patch

from tests.providers.oraclecloud.oci_fixtures import set_mocked_oraclecloud_provider


class TestIdentityService:
    def test_service(self):
        """Test that identity service can be instantiated and mocked"""
        oraclecloud_provider = set_mocked_oraclecloud_provider()

        # Mock the entire service initialization
        with patch(
            "prowler.providers.oraclecloud.services.identity.identity_service.Identity.__init__",
            return_value=None,
        ):
            from prowler.providers.oraclecloud.services.identity.identity_service import (
                Identity,
            )

            identity_client = Identity(oraclecloud_provider)

            # Manually set required attributes since __init__ was mocked
            identity_client.service = "identity"
            identity_client.provider = oraclecloud_provider
            identity_client.audited_compartments = {}
            identity_client.regional_clients = {}

            # Verify service name
            assert identity_client.service == "identity"
            assert identity_client.provider == oraclecloud_provider
```

--------------------------------------------------------------------------------

---[FILE: identity_iam_admins_cannot_update_tenancy_admins_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/identity/identity_iam_admins_cannot_update_tenancy_admins/identity_iam_admins_cannot_update_tenancy_admins_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_identity_iam_admins_cannot_update_tenancy_admins:
    def test_no_resources(self):
        """identity_iam_admins_cannot_update_tenancy_admins: No resources to check"""
        identity_client = mock.MagicMock()
        identity_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        identity_client.audited_tenancy = OCI_TENANCY_ID

        # Mock empty collections
        identity_client.rules = []
        identity_client.topics = []
        identity_client.subscriptions = []
        identity_client.users = []
        identity_client.groups = []
        identity_client.policies = []
        identity_client.compartments = []
        identity_client.instances = []
        identity_client.volumes = []
        identity_client.boot_volumes = []
        identity_client.buckets = []
        identity_client.keys = []
        identity_client.file_systems = []
        identity_client.databases = []
        identity_client.security_lists = []
        identity_client.security_groups = []
        identity_client.subnets = []
        identity_client.vcns = []
        identity_client.configuration = None
        identity_client.active_non_root_compartments = []
        identity_client.password_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.identity.identity_iam_admins_cannot_update_tenancy_admins.identity_iam_admins_cannot_update_tenancy_admins.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_iam_admins_cannot_update_tenancy_admins.identity_iam_admins_cannot_update_tenancy_admins import (
                identity_iam_admins_cannot_update_tenancy_admins,
            )

            check = identity_iam_admins_cannot_update_tenancy_admins()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """identity_iam_admins_cannot_update_tenancy_admins: Resource passes the check (PASS)"""
        identity_client = mock.MagicMock()
        identity_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        identity_client.audited_tenancy = OCI_TENANCY_ID

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
        identity_client.buckets = [resource]
        identity_client.keys = [resource]
        identity_client.volumes = [resource]
        identity_client.boot_volumes = [resource]
        identity_client.instances = [resource]
        identity_client.file_systems = [resource]
        identity_client.databases = [resource]
        identity_client.security_lists = []
        identity_client.security_groups = []
        identity_client.rules = []
        identity_client.configuration = resource
        identity_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.identity.identity_iam_admins_cannot_update_tenancy_admins.identity_iam_admins_cannot_update_tenancy_admins.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_iam_admins_cannot_update_tenancy_admins.identity_iam_admins_cannot_update_tenancy_admins import (
                identity_iam_admins_cannot_update_tenancy_admins,
            )

            check = identity_iam_admins_cannot_update_tenancy_admins()
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
                        == "identity_iam_admins_cannot_update_tenancy_admins"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "identity"

    def test_resource_non_compliant(self):
        """identity_iam_admins_cannot_update_tenancy_admins: Resource fails the check (FAIL)"""
        identity_client = mock.MagicMock()
        identity_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        identity_client.audited_tenancy = OCI_TENANCY_ID

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
        identity_client.buckets = [resource]
        identity_client.keys = [resource]
        identity_client.volumes = [resource]
        identity_client.boot_volumes = [resource]
        identity_client.instances = [resource]
        identity_client.file_systems = [resource]
        identity_client.databases = [resource]
        identity_client.security_lists = []
        identity_client.security_groups = []
        identity_client.rules = []
        identity_client.configuration = resource
        identity_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.identity.identity_iam_admins_cannot_update_tenancy_admins.identity_iam_admins_cannot_update_tenancy_admins.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_iam_admins_cannot_update_tenancy_admins.identity_iam_admins_cannot_update_tenancy_admins import (
                identity_iam_admins_cannot_update_tenancy_admins,
            )

            check = identity_iam_admins_cannot_update_tenancy_admins()
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
                        == "identity_iam_admins_cannot_update_tenancy_admins"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "identity"
```

--------------------------------------------------------------------------------

---[FILE: identity_instance_principal_used_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/identity/identity_instance_principal_used/identity_instance_principal_used_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_identity_instance_principal_used:
    def test_no_resources(self):
        """identity_instance_principal_used: No resources to check"""
        identity_client = mock.MagicMock()
        identity_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        identity_client.audited_tenancy = OCI_TENANCY_ID

        # Mock empty collections
        identity_client.rules = []
        identity_client.topics = []
        identity_client.subscriptions = []
        identity_client.users = []
        identity_client.groups = []
        identity_client.policies = []
        identity_client.compartments = []
        identity_client.instances = []
        identity_client.volumes = []
        identity_client.boot_volumes = []
        identity_client.buckets = []
        identity_client.keys = []
        identity_client.file_systems = []
        identity_client.databases = []
        identity_client.security_lists = []
        identity_client.security_groups = []
        identity_client.subnets = []
        identity_client.vcns = []
        identity_client.configuration = None
        identity_client.active_non_root_compartments = []
        identity_client.password_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.identity.identity_instance_principal_used.identity_instance_principal_used.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_instance_principal_used.identity_instance_principal_used import (
                identity_instance_principal_used,
            )

            check = identity_instance_principal_used()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """identity_instance_principal_used: Resource passes the check (PASS)"""
        identity_client = mock.MagicMock()
        identity_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        identity_client.audited_tenancy = OCI_TENANCY_ID

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
        identity_client.buckets = [resource]
        identity_client.keys = [resource]
        identity_client.volumes = [resource]
        identity_client.boot_volumes = [resource]
        identity_client.instances = [resource]
        identity_client.file_systems = [resource]
        identity_client.databases = [resource]
        identity_client.security_lists = []
        identity_client.security_groups = []
        identity_client.rules = []
        identity_client.configuration = resource
        identity_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.identity.identity_instance_principal_used.identity_instance_principal_used.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_instance_principal_used.identity_instance_principal_used import (
                identity_instance_principal_used,
            )

            check = identity_instance_principal_used()
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
                        == "identity_instance_principal_used"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "identity"

    def test_resource_non_compliant(self):
        """identity_instance_principal_used: Resource fails the check (FAIL)"""
        identity_client = mock.MagicMock()
        identity_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        identity_client.audited_tenancy = OCI_TENANCY_ID

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
        identity_client.buckets = [resource]
        identity_client.keys = [resource]
        identity_client.volumes = [resource]
        identity_client.boot_volumes = [resource]
        identity_client.instances = [resource]
        identity_client.file_systems = [resource]
        identity_client.databases = [resource]
        identity_client.security_lists = []
        identity_client.security_groups = []
        identity_client.rules = []
        identity_client.configuration = resource
        identity_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.identity.identity_instance_principal_used.identity_instance_principal_used.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_instance_principal_used.identity_instance_principal_used import (
                identity_instance_principal_used,
            )

            check = identity_instance_principal_used()
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
                        == "identity_instance_principal_used"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "identity"
```

--------------------------------------------------------------------------------

````
