---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 658
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 658 of 867)

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

---[FILE: defender_auto_provisioning_vulnerabilty_assessments_machines_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_auto_provisioning_vulnerabilty_assessments_machines_on/defender_auto_provisioning_vulnerabilty_assessments_machines_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Assesment
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_auto_provisioning_vulnerabilty_assessments_machines_on:
    def test_defender_no_app_services(self):
        defender_client = mock.MagicMock
        defender_client.assessments = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_auto_provisioning_vulnerabilty_assessments_machines_on.defender_auto_provisioning_vulnerabilty_assessments_machines_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_auto_provisioning_vulnerabilty_assessments_machines_on.defender_auto_provisioning_vulnerabilty_assessments_machines_on import (
                defender_auto_provisioning_vulnerabilty_assessments_machines_on,
            )

            check = defender_auto_provisioning_vulnerabilty_assessments_machines_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_machines_no_vulnerability_assessment_solution(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "Machines should have a vulnerability assessment solution": Assesment(
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
                "prowler.providers.azure.services.defender.defender_auto_provisioning_vulnerabilty_assessments_machines_on.defender_auto_provisioning_vulnerabilty_assessments_machines_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_auto_provisioning_vulnerabilty_assessments_machines_on.defender_auto_provisioning_vulnerabilty_assessments_machines_on import (
                defender_auto_provisioning_vulnerabilty_assessments_machines_on,
            )

            check = defender_auto_provisioning_vulnerabilty_assessments_machines_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Vulnerability assessment is not set up in all VMs in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "vm1"
            assert result[0].resource_id == resource_id

    def test_defender_machines_vulnerability_assessment_solution(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "Machines should have a vulnerability assessment solution": Assesment(
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
                "prowler.providers.azure.services.defender.defender_auto_provisioning_vulnerabilty_assessments_machines_on.defender_auto_provisioning_vulnerabilty_assessments_machines_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_auto_provisioning_vulnerabilty_assessments_machines_on.defender_auto_provisioning_vulnerabilty_assessments_machines_on import (
                defender_auto_provisioning_vulnerabilty_assessments_machines_on,
            )

            check = defender_auto_provisioning_vulnerabilty_assessments_machines_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Vulnerability assessment is set up in all VMs in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "vm1"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_container_images_resolved_vulnerabilities_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_container_images_resolved_vulnerabilities/defender_container_images_resolved_vulnerabilities_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Assesment
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_container_images_resolved_vulnerabilities:
    def test_defender_no_subscriptions(self):
        defender_client = mock.MagicMock
        defender_client.assessments = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities import (
                defender_container_images_resolved_vulnerabilities,
            )

            check = defender_container_images_resolved_vulnerabilities()
            result = check.execute()
            assert len(result) == 0

    def test_defender_subscription_empty(self):
        defender_client = mock.MagicMock
        defender_client.assessments = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities import (
                defender_container_images_resolved_vulnerabilities,
            )

            check = defender_container_images_resolved_vulnerabilities()
            result = check.execute()
            assert len(result) == 0

    def test_defender_subscription_no_assesment(self):
        defender_client = mock.MagicMock
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "": Assesment(
                    resource_id=str(uuid4()),
                    resource_name=str(uuid4()),
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
                "prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities import (
                defender_container_images_resolved_vulnerabilities,
            )

            check = defender_container_images_resolved_vulnerabilities()
            result = check.execute()
            assert len(result) == 0

    def test_defender_subscription_assesment_unhealthy(self):
        defender_client = mock.MagicMock
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)": Assesment(
                    resource_id=str(uuid4()),
                    resource_name=str(uuid4()),
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
                "prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities import (
                defender_container_images_resolved_vulnerabilities,
            )

            check = defender_container_images_resolved_vulnerabilities()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].resource_id
                == defender_client.assessments[AZURE_SUBSCRIPTION_ID][
                    "Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)"
                ].resource_id
            )
            assert (
                result[0].resource_name
                == defender_client.assessments[AZURE_SUBSCRIPTION_ID][
                    "Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)"
                ].resource_name
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert (
                result[0].status_extended
                == f"Azure running container images have unresolved vulnerabilities in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )

    def test_defender_subscription_assesment_healthy(self):
        defender_client = mock.MagicMock
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)": Assesment(
                    resource_id=str(uuid4()),
                    resource_name=str(uuid4()),
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
                "prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities import (
                defender_container_images_resolved_vulnerabilities,
            )

            check = defender_container_images_resolved_vulnerabilities()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].resource_id
                == defender_client.assessments[AZURE_SUBSCRIPTION_ID][
                    "Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)"
                ].resource_id
            )
            assert (
                result[0].resource_name
                == defender_client.assessments[AZURE_SUBSCRIPTION_ID][
                    "Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)"
                ].resource_name
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert (
                result[0].status_extended
                == f"Azure running container images do not have unresolved vulnerabilities in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )

    def test_defender_subscription_assesment_not_applicable(self):
        defender_client = mock.MagicMock
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)": Assesment(
                    resource_id=str(uuid4()),
                    resource_name=str(uuid4()),
                    status="NotApplicable",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_resolved_vulnerabilities.defender_container_images_resolved_vulnerabilities import (
                defender_container_images_resolved_vulnerabilities,
            )

            check = defender_container_images_resolved_vulnerabilities()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: defender_container_images_scan_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_container_images_scan_enabled/defender_container_images_scan_enabled_test.py

```python
from datetime import timedelta
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_container_images_scan_enabled:
    def test_defender_no_subscriptions(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled import (
                defender_container_images_scan_enabled,
            )

            check = defender_container_images_scan_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_defender_subscription_empty(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled import (
                defender_container_images_scan_enabled,
            )

            check = defender_container_images_scan_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_defender_subscription_no_containers(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "NotContainers": Pricing(
                    resource_id=str(uuid4()),
                    resource_name="Defender plan Servers",
                    pricing_tier="Free",
                    free_trial_remaining_time=timedelta(days=1),
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled import (
                defender_container_images_scan_enabled,
            )

            check = defender_container_images_scan_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_defender_subscription_containers_no_extensions(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "Containers": Pricing(
                    resource_id=str(uuid4()),
                    resource_name="Defender plan for Containers",
                    pricing_tier="Free",
                    free_trial_remaining_time=timedelta(days=1),
                    extensions={},
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled import (
                defender_container_images_scan_enabled,
            )

            check = defender_container_images_scan_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"Container image scan is disabled in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert (
                result[0].resource_id
                == defender_client.pricings[AZURE_SUBSCRIPTION_ID][
                    "Containers"
                ].resource_id
            )
            assert result[0].resource_name == "Defender plan for Containers"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID

    def test_defender_subscription_containers_container_images_scan_off(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "Containers": Pricing(
                    resource_id=str(uuid4()),
                    resource_name="Defender plan for Containers",
                    pricing_tier="Free",
                    free_trial_remaining_time=timedelta(days=1),
                    extensions={"ContainerRegistriesVulnerabilityAssessments": False},
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled import (
                defender_container_images_scan_enabled,
            )

            check = defender_container_images_scan_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"Container image scan is disabled in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert (
                result[0].resource_id
                == defender_client.pricings[AZURE_SUBSCRIPTION_ID][
                    "Containers"
                ].resource_id
            )
            assert result[0].resource_name == "Defender plan for Containers"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID

    def test_defender_subscription_containers_container_images_scan_on(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "Containers": Pricing(
                    resource_id=str(uuid4()),
                    resource_name="Defender plan for Containers",
                    pricing_tier="Free",
                    free_trial_remaining_time=timedelta(days=1),
                    extensions={"ContainerRegistriesVulnerabilityAssessments": True},
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_container_images_scan_enabled.defender_container_images_scan_enabled import (
                defender_container_images_scan_enabled,
            )

            check = defender_container_images_scan_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"Container image scan is enabled in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert (
                result[0].resource_id
                == defender_client.pricings[AZURE_SUBSCRIPTION_ID][
                    "Containers"
                ].resource_id
            )
            assert result[0].resource_name == "Defender plan for Containers"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_app_services_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_app_services_is_on/defender_ensure_defender_for_app_services_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_app_services_is_on:
    def test_defender_no_app_services(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_app_services_is_on.defender_ensure_defender_for_app_services_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_app_services_is_on.defender_ensure_defender_for_app_services_is_on import (
                defender_ensure_defender_for_app_services_is_on,
            )

            check = defender_ensure_defender_for_app_services_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_app_services_pricing_tier_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "AppServices": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Not Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_app_services_is_on.defender_ensure_defender_for_app_services_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_app_services_is_on.defender_ensure_defender_for_app_services_is_on import (
                defender_ensure_defender_for_app_services_is_on,
            )

            check = defender_ensure_defender_for_app_services_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for App Services from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan App Services"
            assert result[0].resource_id == resource_id

    def test_defender_app_services_pricing_tier_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "AppServices": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_app_services_is_on.defender_ensure_defender_for_app_services_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_app_services_is_on.defender_ensure_defender_for_app_services_is_on import (
                defender_ensure_defender_for_app_services_is_on,
            )

            check = defender_ensure_defender_for_app_services_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for App Services from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan App Services"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_arm_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_arm_is_on/defender_ensure_defender_for_arm_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_arm_is_on:
    def test_defender_no_arm(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_arm_is_on.defender_ensure_defender_for_arm_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_arm_is_on.defender_ensure_defender_for_arm_is_on import (
                defender_ensure_defender_for_arm_is_on,
            )

            check = defender_ensure_defender_for_arm_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_arm_pricing_tier_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "Arm": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Not Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_arm_is_on.defender_ensure_defender_for_arm_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_arm_is_on.defender_ensure_defender_for_arm_is_on import (
                defender_ensure_defender_for_arm_is_on,
            )

            check = defender_ensure_defender_for_arm_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for ARM from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan ARM"
            assert result[0].resource_id == resource_id

    def test_defender_arm_pricing_tier_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "Arm": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_arm_is_on.defender_ensure_defender_for_arm_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_arm_is_on.defender_ensure_defender_for_arm_is_on import (
                defender_ensure_defender_for_arm_is_on,
            )

            check = defender_ensure_defender_for_arm_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for ARM from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan ARM"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_azure_sql_databases_is_on_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_defender_for_azure_sql_databases_is_on/defender_ensure_defender_for_azure_sql_databases_is_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Pricing
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_defender_for_azure_sql_databases_is_on:
    def test_defender_no_sql_databases(self):
        defender_client = mock.MagicMock
        defender_client.pricings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_azure_sql_databases_is_on.defender_ensure_defender_for_azure_sql_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_azure_sql_databases_is_on.defender_ensure_defender_for_azure_sql_databases_is_on import (
                defender_ensure_defender_for_azure_sql_databases_is_on,
            )

            check = defender_ensure_defender_for_azure_sql_databases_is_on()
            result = check.execute()
            assert len(result) == 0

    def test_defender_sql_databases_pricing_tier_not_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "SqlServers": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Not Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_azure_sql_databases_is_on.defender_ensure_defender_for_azure_sql_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_azure_sql_databases_is_on.defender_ensure_defender_for_azure_sql_databases_is_on import (
                defender_ensure_defender_for_azure_sql_databases_is_on,
            )

            check = defender_ensure_defender_for_azure_sql_databases_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Azure SQL DB Servers from subscription {AZURE_SUBSCRIPTION_ID} is set to OFF (pricing tier not standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Servers"
            assert result[0].resource_id == resource_id

    def test_defender_sql_databases_pricing_tier_standard(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.pricings = {
            AZURE_SUBSCRIPTION_ID: {
                "SqlServers": Pricing(
                    resource_id=resource_id,
                    resource_name="Defender plan Servers",
                    pricing_tier="Standard",
                    free_trial_remaining_time=0,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_defender_for_azure_sql_databases_is_on.defender_ensure_defender_for_azure_sql_databases_is_on.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_defender_for_azure_sql_databases_is_on.defender_ensure_defender_for_azure_sql_databases_is_on import (
                defender_ensure_defender_for_azure_sql_databases_is_on,
            )

            check = defender_ensure_defender_for_azure_sql_databases_is_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Defender plan Defender for Azure SQL DB Servers from subscription {AZURE_SUBSCRIPTION_ID} is set to ON (pricing tier standard)."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Defender plan Servers"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

````
