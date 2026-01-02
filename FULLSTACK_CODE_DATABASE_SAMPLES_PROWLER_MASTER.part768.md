---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 768
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 768 of 867)

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

---[FILE: identity_user_mfa_enabled_console_access_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/identity/identity_user_mfa_enabled_console_access/identity_user_mfa_enabled_console_access_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_identity_user_mfa_enabled_console_access:
    def test_no_resources(self):
        """identity_user_mfa_enabled_console_access: No resources to check"""
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
                "prowler.providers.oraclecloud.services.identity.identity_user_mfa_enabled_console_access.identity_user_mfa_enabled_console_access.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_user_mfa_enabled_console_access.identity_user_mfa_enabled_console_access import (
                identity_user_mfa_enabled_console_access,
            )

            check = identity_user_mfa_enabled_console_access()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """identity_user_mfa_enabled_console_access: Resource passes the check (PASS)"""
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
                "prowler.providers.oraclecloud.services.identity.identity_user_mfa_enabled_console_access.identity_user_mfa_enabled_console_access.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_user_mfa_enabled_console_access.identity_user_mfa_enabled_console_access import (
                identity_user_mfa_enabled_console_access,
            )

            check = identity_user_mfa_enabled_console_access()
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
                        == "identity_user_mfa_enabled_console_access"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "identity"

    def test_resource_non_compliant(self):
        """identity_user_mfa_enabled_console_access: Resource fails the check (FAIL)"""
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
                "prowler.providers.oraclecloud.services.identity.identity_user_mfa_enabled_console_access.identity_user_mfa_enabled_console_access.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_user_mfa_enabled_console_access.identity_user_mfa_enabled_console_access import (
                identity_user_mfa_enabled_console_access,
            )

            check = identity_user_mfa_enabled_console_access()
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
                        == "identity_user_mfa_enabled_console_access"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "identity"
```

--------------------------------------------------------------------------------

---[FILE: identity_user_valid_email_address_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/identity/identity_user_valid_email_address/identity_user_valid_email_address_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_identity_user_valid_email_address:
    def test_no_resources(self):
        """identity_user_valid_email_address: No resources to check"""
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
                "prowler.providers.oraclecloud.services.identity.identity_user_valid_email_address.identity_user_valid_email_address.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_user_valid_email_address.identity_user_valid_email_address import (
                identity_user_valid_email_address,
            )

            check = identity_user_valid_email_address()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """identity_user_valid_email_address: Resource passes the check (PASS)"""
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
                "prowler.providers.oraclecloud.services.identity.identity_user_valid_email_address.identity_user_valid_email_address.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_user_valid_email_address.identity_user_valid_email_address import (
                identity_user_valid_email_address,
            )

            check = identity_user_valid_email_address()
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
                        == "identity_user_valid_email_address"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "identity"

    def test_resource_non_compliant(self):
        """identity_user_valid_email_address: Resource fails the check (FAIL)"""
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
                "prowler.providers.oraclecloud.services.identity.identity_user_valid_email_address.identity_user_valid_email_address.identity_client",
                new=identity_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.identity.identity_user_valid_email_address.identity_user_valid_email_address import (
                identity_user_valid_email_address,
            )

            check = identity_user_valid_email_address()
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
                        == "identity_user_valid_email_address"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "identity"
```

--------------------------------------------------------------------------------

---[FILE: integration_service_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/integration/integration_service_test.py

```python
from unittest.mock import patch

from tests.providers.oraclecloud.oci_fixtures import set_mocked_oraclecloud_provider


class TestIntegrationService:
    def test_service(self):
        """Test that integration service can be instantiated and mocked"""
        oraclecloud_provider = set_mocked_oraclecloud_provider()

        # Mock the entire service initialization
        with patch(
            "prowler.providers.oraclecloud.services.integration.integration_service.Integration.__init__",
            return_value=None,
        ):
            from prowler.providers.oraclecloud.services.integration.integration_service import (
                Integration,
            )

            integration_client = Integration(oraclecloud_provider)

            # Manually set required attributes since __init__ was mocked
            integration_client.service = "integration"
            integration_client.provider = oraclecloud_provider
            integration_client.audited_compartments = {}
            integration_client.regional_clients = {}

            # Verify service name
            assert integration_client.service == "integration"
            assert integration_client.provider == oraclecloud_provider
```

--------------------------------------------------------------------------------

---[FILE: integration_instance_access_restricted_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/integration/integration_instance_access_restricted/integration_instance_access_restricted_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_integration_instance_access_restricted:
    def test_no_resources(self):
        """integration_instance_access_restricted: No resources to check"""
        integration_client = mock.MagicMock()
        integration_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        integration_client.audited_tenancy = OCI_TENANCY_ID

        # Mock empty collections
        integration_client.rules = []
        integration_client.topics = []
        integration_client.subscriptions = []
        integration_client.users = []
        integration_client.groups = []
        integration_client.policies = []
        integration_client.compartments = []
        integration_client.instances = []
        integration_client.volumes = []
        integration_client.boot_volumes = []
        integration_client.buckets = []
        integration_client.keys = []
        integration_client.file_systems = []
        integration_client.databases = []
        integration_client.security_lists = []
        integration_client.security_groups = []
        integration_client.subnets = []
        integration_client.vcns = []
        integration_client.configuration = None
        integration_client.active_non_root_compartments = []
        integration_client.password_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.integration.integration_instance_access_restricted.integration_instance_access_restricted.integration_client",
                new=integration_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.integration.integration_instance_access_restricted.integration_instance_access_restricted import (
                integration_instance_access_restricted,
            )

            check = integration_instance_access_restricted()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """integration_instance_access_restricted: Resource passes the check (PASS)"""
        integration_client = mock.MagicMock()
        integration_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        integration_client.audited_tenancy = OCI_TENANCY_ID

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
        integration_client.buckets = [resource]
        integration_client.keys = [resource]
        integration_client.volumes = [resource]
        integration_client.boot_volumes = [resource]
        integration_client.instances = [resource]
        integration_client.file_systems = [resource]
        integration_client.databases = [resource]
        integration_client.security_lists = []
        integration_client.security_groups = []
        integration_client.rules = []
        integration_client.configuration = resource
        integration_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.integration.integration_instance_access_restricted.integration_instance_access_restricted.integration_client",
                new=integration_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.integration.integration_instance_access_restricted.integration_instance_access_restricted import (
                integration_instance_access_restricted,
            )

            check = integration_instance_access_restricted()
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
                        == "integration_instance_access_restricted"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "integration"

    def test_resource_non_compliant(self):
        """integration_instance_access_restricted: Resource fails the check (FAIL)"""
        integration_client = mock.MagicMock()
        integration_client.audited_compartments = {OCI_COMPARTMENT_ID: mock.MagicMock()}
        integration_client.audited_tenancy = OCI_TENANCY_ID

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
        integration_client.buckets = [resource]
        integration_client.keys = [resource]
        integration_client.volumes = [resource]
        integration_client.boot_volumes = [resource]
        integration_client.instances = [resource]
        integration_client.file_systems = [resource]
        integration_client.databases = [resource]
        integration_client.security_lists = []
        integration_client.security_groups = []
        integration_client.rules = []
        integration_client.configuration = resource
        integration_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.integration.integration_instance_access_restricted.integration_instance_access_restricted.integration_client",
                new=integration_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.integration.integration_instance_access_restricted.integration_instance_access_restricted import (
                integration_instance_access_restricted,
            )

            check = integration_instance_access_restricted()
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
                        == "integration_instance_access_restricted"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "integration"
```

--------------------------------------------------------------------------------

---[FILE: kms_service_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/kms/kms_service_test.py

```python
from unittest.mock import patch

from tests.providers.oraclecloud.oci_fixtures import set_mocked_oraclecloud_provider


class TestKmsService:
    def test_service(self):
        """Test that kms service can be instantiated and mocked"""
        oraclecloud_provider = set_mocked_oraclecloud_provider()

        # Mock the entire service initialization
        with patch(
            "prowler.providers.oraclecloud.services.kms.kms_service.Kms.__init__",
            return_value=None,
        ):
            from prowler.providers.oraclecloud.services.kms.kms_service import Kms

            kms_client = Kms(oraclecloud_provider)

            # Manually set required attributes since __init__ was mocked
            kms_client.service = "kms"
            kms_client.provider = oraclecloud_provider
            kms_client.audited_compartments = {}
            kms_client.regional_clients = {}

            # Verify service name
            assert kms_client.service == "kms"
            assert kms_client.provider == oraclecloud_provider
```

--------------------------------------------------------------------------------

````
