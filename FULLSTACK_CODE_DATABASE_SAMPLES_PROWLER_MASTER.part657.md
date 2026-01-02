---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 657
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 657 of 867)

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

---[FILE: defender_additional_email_configured_with_a_security_contact_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_additional_email_configured_with_a_security_contact/defender_additional_email_configured_with_a_security_contact_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import (
    NotificationsByRole,
    SecurityContactConfiguration,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_additional_email_configured_with_a_security_contact:
    def test_defender_no_subscriptions(self):
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_additional_email_configured_with_a_security_contact.defender_additional_email_configured_with_a_security_contact.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_additional_email_configured_with_a_security_contact.defender_additional_email_configured_with_a_security_contact import (
                defender_additional_email_configured_with_a_security_contact,
            )

            check = defender_additional_email_configured_with_a_security_contact()
            result = check.execute()
            assert len(result) == 0

    def test_defender_no_additional_emails(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name="default",
                    enabled=True,
                    emails=[],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Contributor"]
                    ),
                    alert_minimal_severity=None,
                    attack_path_minimal_risk_level=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_additional_email_configured_with_a_security_contact.defender_additional_email_configured_with_a_security_contact.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_additional_email_configured_with_a_security_contact.defender_additional_email_configured_with_a_security_contact import (
                defender_additional_email_configured_with_a_security_contact,
            )

            check = defender_additional_email_configured_with_a_security_contact()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"There is not another correct email configured for subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "default"
            assert result[0].resource_id == resource_id

    def test_defender_additional_email_configured(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name="default",
                    enabled=True,
                    emails=["test@test.com"],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Contributor"]
                    ),
                    alert_minimal_severity=None,
                    attack_path_minimal_risk_level=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_additional_email_configured_with_a_security_contact.defender_additional_email_configured_with_a_security_contact.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_additional_email_configured_with_a_security_contact.defender_additional_email_configured_with_a_security_contact import (
                defender_additional_email_configured_with_a_security_contact,
            )

            check = defender_additional_email_configured_with_a_security_contact()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"There is another correct email configured for subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "default"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_assessments_vm_endpoint_protection_installed_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_assessments_vm_endpoint_protection_installed/defender_assessments_vm_endpoint_protection_installed_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Assesment
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_assessments_vm_endpoint_protection_installed:
    def test_defender_no_subscriptions(self):
        defender_client = mock.MagicMock
        defender_client.assessments = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_assessments_vm_endpoint_protection_installed.defender_assessments_vm_endpoint_protection_installed.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_assessments_vm_endpoint_protection_installed.defender_assessments_vm_endpoint_protection_installed import (
                defender_assessments_vm_endpoint_protection_installed,
            )

            check = defender_assessments_vm_endpoint_protection_installed()
            result = check.execute()
            assert len(result) == 0

    def test_defender_subscriptions_with_no_assessments(self):
        defender_client = mock.MagicMock
        defender_client.assessments = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_assessments_vm_endpoint_protection_installed.defender_assessments_vm_endpoint_protection_installed.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_assessments_vm_endpoint_protection_installed.defender_assessments_vm_endpoint_protection_installed import (
                defender_assessments_vm_endpoint_protection_installed,
            )

            check = defender_assessments_vm_endpoint_protection_installed()
            result = check.execute()
            assert len(result) == 0

    def test_defender_subscriptions_with_healthy_assessments(self):
        defender_client = mock.MagicMock
        resource_id = str(uuid4())
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "Install endpoint protection solution on virtual machines": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Healthy",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_assessments_vm_endpoint_protection_installed.defender_assessments_vm_endpoint_protection_installed.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_assessments_vm_endpoint_protection_installed.defender_assessments_vm_endpoint_protection_installed import (
                defender_assessments_vm_endpoint_protection_installed,
            )

            check = defender_assessments_vm_endpoint_protection_installed()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Endpoint protection is set up in all VMs in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].resource_name == "vm1"
            assert result[0].resource_id == resource_id

    def test_defender_subscriptions_with_unhealthy_assessments(self):
        defender_client = mock.MagicMock
        resource_id = str(uuid4())
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "Install endpoint protection solution on virtual machines": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Unhealthy",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_assessments_vm_endpoint_protection_installed.defender_assessments_vm_endpoint_protection_installed.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_assessments_vm_endpoint_protection_installed.defender_assessments_vm_endpoint_protection_installed import (
                defender_assessments_vm_endpoint_protection_installed,
            )

            check = defender_assessments_vm_endpoint_protection_installed()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Endpoint protection is not set up in all VMs in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].resource_name == "vm1"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_attack_path_notifications_properly_configured_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_attack_path_notifications_properly_configured/defender_attack_path_notifications_properly_configured_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import (
    NotificationsByRole,
    SecurityContactConfiguration,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_attack_path_notifications_properly_configured:
    def test_no_subscriptions(self):
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {}
        defender_client.audit_config = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured import (
                defender_attack_path_notifications_properly_configured,
            )

            check = defender_attack_path_notifications_properly_configured()
            result = check.execute()
            assert len(result) == 0

    def test_attack_path_notifications_none(self):
        resource_id = str(uuid4())
        contact_name = "default"
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name=contact_name,
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Owner"]
                    ),
                    alert_minimal_severity="High",
                    attack_path_minimal_risk_level=None,
                )
            }
        }
        defender_client.audit_config = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured import (
                defender_attack_path_notifications_properly_configured,
            )

            check = defender_attack_path_notifications_properly_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"Attack path notifications are not enabled in subscription {AZURE_SUBSCRIPTION_ID} for security contact {contact_name}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == contact_name
            assert result[0].resource_id == resource_id

    def test_attack_path_notifications_custom_config(self):
        # Configured minimal risk level is Medium
        resource_id = str(uuid4())
        contact_name = "default"
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name=contact_name,
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Owner"]
                    ),
                    alert_minimal_severity="High",
                    attack_path_minimal_risk_level="Medium",
                )
            }
        }
        defender_client.audit_config = {
            "defender_attack_path_minimal_risk_level": "Medium"
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured import (
                defender_attack_path_notifications_properly_configured,
            )

            check = defender_attack_path_notifications_properly_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"Attack path notifications are enabled with minimal risk level Medium in subscription {AZURE_SUBSCRIPTION_ID} for security contact {contact_name}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == contact_name
            assert result[0].resource_id == resource_id

    def test_attack_path_notifications_invalid_config(self):
        # Configured minimal risk level is invalid, should default to High
        resource_id = str(uuid4())
        contact_name = "default"
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name=contact_name,
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Owner"]
                    ),
                    alert_minimal_severity="High",
                    attack_path_minimal_risk_level="Medium",
                )
            }
        }
        defender_client.audit_config = {
            "defender_attack_path_minimal_risk_level": "INVALID"
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured import (
                defender_attack_path_notifications_properly_configured,
            )

            check = defender_attack_path_notifications_properly_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"Attack path notifications are enabled with minimal risk level Medium in subscription {AZURE_SUBSCRIPTION_ID} for security contact {contact_name}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == contact_name
            assert result[0].resource_id == resource_id

    def test_attack_path_notifications_low_default_high(self):
        # Low risk level, default config (High) -> PASS
        resource_id = str(uuid4())
        contact_name = "default"
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name=contact_name,
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Owner"]
                    ),
                    alert_minimal_severity="High",
                    attack_path_minimal_risk_level="Low",
                )
            }
        }
        defender_client.audit_config = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured import (
                defender_attack_path_notifications_properly_configured,
            )

            check = defender_attack_path_notifications_properly_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"Attack path notifications are enabled with minimal risk level Low in subscription {AZURE_SUBSCRIPTION_ID} for security contact {contact_name}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == contact_name
            assert result[0].resource_id == resource_id

    def test_attack_path_notifications_medium_default_high(self):
        # Medium risk level, default config (High) -> PASS
        resource_id = str(uuid4())
        contact_name = "default"
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name=contact_name,
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Owner"]
                    ),
                    alert_minimal_severity="High",
                    attack_path_minimal_risk_level="Medium",
                )
            }
        }
        defender_client.audit_config = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured import (
                defender_attack_path_notifications_properly_configured,
            )

            check = defender_attack_path_notifications_properly_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"Attack path notifications are enabled with minimal risk level Medium in subscription {AZURE_SUBSCRIPTION_ID} for security contact {contact_name}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == contact_name
            assert result[0].resource_id == resource_id

    def test_attack_path_notifications_high_default_high(self):
        # High risk level, default config (High) -> PASS
        resource_id = str(uuid4())
        contact_name = "default"
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name=contact_name,
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Owner"]
                    ),
                    alert_minimal_severity="High",
                    attack_path_minimal_risk_level="High",
                )
            }
        }
        defender_client.audit_config = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured import (
                defender_attack_path_notifications_properly_configured,
            )

            check = defender_attack_path_notifications_properly_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"Attack path notifications are enabled with minimal risk level High in subscription {AZURE_SUBSCRIPTION_ID} for security contact {contact_name}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == contact_name
            assert result[0].resource_id == resource_id

    def test_attack_path_notifications_critical_default_high(self):
        # Critical risk level, default config (High) -> FAIL
        resource_id = str(uuid4())
        contact_name = "default"
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name=contact_name,
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Owner"]
                    ),
                    alert_minimal_severity="High",
                    attack_path_minimal_risk_level="Critical",
                )
            }
        }
        defender_client.audit_config = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_attack_path_notifications_properly_configured.defender_attack_path_notifications_properly_configured import (
                defender_attack_path_notifications_properly_configured,
            )

            check = defender_attack_path_notifications_properly_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"Attack path notifications are enabled with minimal risk level Critical in subscription {AZURE_SUBSCRIPTION_ID} for security contact {contact_name}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == contact_name
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_auto_provisioning_log_analytics_agent_vms_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_auto_provisioning_log_analytics_agent_vms_on/defender_auto_provisioning_log_analytics_agent_vms_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import (
    AutoProvisioningSetting,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_auto_provisioning_log_analytics_agent_vms_on:
    def test_defender_no_app_services(self):
        defender_client = mock.MagicMock
        defender_client.auto_provisioning_settings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_auto_provisioning_log_analytics_agent_vms_on.defender_auto_provisioning_log_analytics_agent_vms_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_auto_provisioning_log_analytics_agent_vms_on.defender_auto_provisioning_log_analytics_agent_vms_on import (
                defender_auto_provisioning_log_analytics_agent_vms_on,
            )

            check = defender_auto_provisioning_log_analytics_agent_vms_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_auto_provisioning_log_analytics_off(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.auto_provisioning_settings = {
            AZURE_SUBSCRIPTION_ID: {
                "default": AutoProvisioningSetting(
                    resource_id=resource_id,
                    resource_name="default",
                    auto_provision="Off",
                    resource_type="Defender",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_auto_provisioning_log_analytics_agent_vms_on.defender_auto_provisioning_log_analytics_agent_vms_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_auto_provisioning_log_analytics_agent_vms_on.defender_auto_provisioning_log_analytics_agent_vms_on import (
                defender_auto_provisioning_log_analytics_agent_vms_on,
            )

            check = defender_auto_provisioning_log_analytics_agent_vms_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender Auto Provisioning Log Analytics Agents from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "default"
            assert result[0].resource_id == resource_id

    def test_defender_auto_provisioning_log_analytics_on(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.auto_provisioning_settings = {
            AZURE_SUBSCRIPTION_ID: {
                "default": AutoProvisioningSetting(
                    resource_id=resource_id,
                    resource_name="default",
                    auto_provision="On",
                    resource_type="Defender",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_auto_provisioning_log_analytics_agent_vms_on.defender_auto_provisioning_log_analytics_agent_vms_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_auto_provisioning_log_analytics_agent_vms_on.defender_auto_provisioning_log_analytics_agent_vms_on import (
                defender_auto_provisioning_log_analytics_agent_vms_on,
            )

            check = defender_auto_provisioning_log_analytics_agent_vms_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender Auto Provisioning Log Analytics Agents from subscription {AZURE_SUBSCRIPTION_ID} is set to ON."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "default"
            assert result[0].resource_id == resource_id

    def test_defender_auto_provisioning_log_analytics_on_and_off(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.auto_provisioning_settings = {
            AZURE_SUBSCRIPTION_ID: {
                "default": AutoProvisioningSetting(
                    resource_id=resource_id,
                    resource_name="default",
                    auto_provision="On",
                    resource_type="Defender",
                ),
                "default2": AutoProvisioningSetting(
                    resource_id=resource_id,
                    resource_name="default2",
                    auto_provision="Off",
                    resource_type="Defender",
                ),
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_auto_provisioning_log_analytics_agent_vms_on.defender_auto_provisioning_log_analytics_agent_vms_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_auto_provisioning_log_analytics_agent_vms_on.defender_auto_provisioning_log_analytics_agent_vms_on import (
                defender_auto_provisioning_log_analytics_agent_vms_on,
            )

            check = defender_auto_provisioning_log_analytics_agent_vms_on()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender Auto Provisioning Log Analytics Agents from subscription {AZURE_SUBSCRIPTION_ID} is set to ON."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "default"
            assert result[0].resource_id == resource_id

            assert result[1].status == "FAIL"
            assert (
                result[1].status_extended
                == f"Defender Auto Provisioning Log Analytics Agents from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF."
            )
            assert result[1].subscription == AZURE_SUBSCRIPTION_ID
            assert result[1].resource_name == "default2"
            assert result[1].resource_id == resource_id
```

--------------------------------------------------------------------------------

````
