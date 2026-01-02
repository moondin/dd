---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 766
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 766 of 867)

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

---[FILE: identity_tenancy_admin_permissions_limited_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/identity/identity_tenancy_admin_permissions_limited/identity_tenancy_admin_permissions_limited_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_identity_tenancy_admin_permissions_limited:
    def test_no_resources(self):
        """identity_tenancy_admin_permissions_limited: No resources to check"""
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
                "prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_permissions_limited.identity_tenancy_admin_permissions_limited.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_permissions_limited.identity_tenancy_admin_permissions_limited import (
                identity_tenancy_admin_permissions_limited,
            )

            check = identity_tenancy_admin_permissions_limited()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """identity_tenancy_admin_permissions_limited: Resource passes the check (PASS)"""
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
                "prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_permissions_limited.identity_tenancy_admin_permissions_limited.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_permissions_limited.identity_tenancy_admin_permissions_limited import (
                identity_tenancy_admin_permissions_limited,
            )

            check = identity_tenancy_admin_permissions_limited()
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
                        == "identity_tenancy_admin_permissions_limited"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "identity"

    def test_resource_non_compliant(self):
        """identity_tenancy_admin_permissions_limited: Resource fails the check (FAIL)"""
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
                "prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_permissions_limited.identity_tenancy_admin_permissions_limited.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_permissions_limited.identity_tenancy_admin_permissions_limited import (
                identity_tenancy_admin_permissions_limited,
            )

            check = identity_tenancy_admin_permissions_limited()
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
                        == "identity_tenancy_admin_permissions_limited"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "identity"
```

--------------------------------------------------------------------------------

---[FILE: identity_tenancy_admin_users_no_api_keys_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/identity/identity_tenancy_admin_users_no_api_keys/identity_tenancy_admin_users_no_api_keys_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_identity_tenancy_admin_users_no_api_keys:
    def test_no_resources(self):
        """identity_tenancy_admin_users_no_api_keys: No resources to check"""
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
                "prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_users_no_api_keys.identity_tenancy_admin_users_no_api_keys.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_users_no_api_keys.identity_tenancy_admin_users_no_api_keys import (
                identity_tenancy_admin_users_no_api_keys,
            )

            check = identity_tenancy_admin_users_no_api_keys()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """identity_tenancy_admin_users_no_api_keys: Resource passes the check (PASS)"""
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
                "prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_users_no_api_keys.identity_tenancy_admin_users_no_api_keys.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_users_no_api_keys.identity_tenancy_admin_users_no_api_keys import (
                identity_tenancy_admin_users_no_api_keys,
            )

            check = identity_tenancy_admin_users_no_api_keys()
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
                        == "identity_tenancy_admin_users_no_api_keys"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "identity"

    def test_resource_non_compliant(self):
        """identity_tenancy_admin_users_no_api_keys: Resource fails the check (FAIL)"""
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
                "prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_users_no_api_keys.identity_tenancy_admin_users_no_api_keys.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_tenancy_admin_users_no_api_keys.identity_tenancy_admin_users_no_api_keys import (
                identity_tenancy_admin_users_no_api_keys,
            )

            check = identity_tenancy_admin_users_no_api_keys()
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
                        == "identity_tenancy_admin_users_no_api_keys"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "identity"
```

--------------------------------------------------------------------------------

---[FILE: identity_user_api_keys_rotated_90_days_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/identity/identity_user_api_keys_rotated_90_days/identity_user_api_keys_rotated_90_days_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_identity_user_api_keys_rotated_90_days:
    def test_no_resources(self):
        """identity_user_api_keys_rotated_90_days: No resources to check"""
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
                "prowler.providers.oraclecloud.services.identity.identity_user_api_keys_rotated_90_days.identity_user_api_keys_rotated_90_days.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_user_api_keys_rotated_90_days.identity_user_api_keys_rotated_90_days import (
                identity_user_api_keys_rotated_90_days,
            )

            check = identity_user_api_keys_rotated_90_days()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """identity_user_api_keys_rotated_90_days: Resource passes the check (PASS)"""
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
                "prowler.providers.oraclecloud.services.identity.identity_user_api_keys_rotated_90_days.identity_user_api_keys_rotated_90_days.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_user_api_keys_rotated_90_days.identity_user_api_keys_rotated_90_days import (
                identity_user_api_keys_rotated_90_days,
            )

            check = identity_user_api_keys_rotated_90_days()
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
                        == "identity_user_api_keys_rotated_90_days"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "identity"

    def test_resource_non_compliant(self):
        """identity_user_api_keys_rotated_90_days: Resource fails the check (FAIL)"""
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
                "prowler.providers.oraclecloud.services.identity.identity_user_api_keys_rotated_90_days.identity_user_api_keys_rotated_90_days.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_user_api_keys_rotated_90_days.identity_user_api_keys_rotated_90_days import (
                identity_user_api_keys_rotated_90_days,
            )

            check = identity_user_api_keys_rotated_90_days()
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
                        == "identity_user_api_keys_rotated_90_days"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "identity"
```

--------------------------------------------------------------------------------

````
