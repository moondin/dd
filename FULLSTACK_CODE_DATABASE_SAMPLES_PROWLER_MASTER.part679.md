---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 679
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 679 of 867)

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

---[FILE: sqlserver_unrestricted_inbound_access_test.py]---
Location: prowler-master/tests/providers/azure/services/sqlserver/sqlserver_unrestricted_inbound_access/sqlserver_unrestricted_inbound_access_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.sql.models import FirewallRule

from prowler.providers.azure.services.sqlserver.sqlserver_service import Server
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_sqlserver_unrestricted_inbound_access:
    def test_no_sql_servers(self):
        sqlserver_client = mock.MagicMock
        sqlserver_client.sql_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_unrestricted_inbound_access.sqlserver_unrestricted_inbound_access.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_unrestricted_inbound_access.sqlserver_unrestricted_inbound_access import (
                sqlserver_unrestricted_inbound_access,
            )

            check = sqlserver_unrestricted_inbound_access()
            result = check.execute()
            assert len(result) == 0

    def test_sql_servers_unrestricted_inbound_access(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    location="location",
                    public_network_access="",
                    minimal_tls_version="",
                    administrators=None,
                    auditing_policies=[],
                    firewall_rules=[
                        FirewallRule(
                            start_ip_address="0.0.0.0", end_ip_address="255.255.255.255"
                        )
                    ],
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_unrestricted_inbound_access.sqlserver_unrestricted_inbound_access.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_unrestricted_inbound_access.sqlserver_unrestricted_inbound_access import (
                sqlserver_unrestricted_inbound_access,
            )

            check = sqlserver_unrestricted_inbound_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has firewall rules allowing 0.0.0.0-255.255.255.255."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_restricted_inbound_access(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    location="location",
                    public_network_access="",
                    minimal_tls_version="",
                    administrators=None,
                    auditing_policies=[],
                    firewall_rules=[
                        FirewallRule(
                            start_ip_address="10.10.10.10", end_ip_address="10.10.10.10"
                        )
                    ],
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_unrestricted_inbound_access.sqlserver_unrestricted_inbound_access.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_unrestricted_inbound_access.sqlserver_unrestricted_inbound_access import (
                sqlserver_unrestricted_inbound_access,
            )

            check = sqlserver_unrestricted_inbound_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have firewall rules allowing 0.0.0.0-255.255.255.255."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_va_emails_notifications_admins_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/sqlserver/sqlserver_va_emails_notifications_admins_enabled/sqlserver_va_emails_notifications_admins_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.sql.models import (
    ServerVulnerabilityAssessment,
    VulnerabilityAssessmentRecurringScansProperties,
)

from prowler.providers.azure.services.sqlserver.sqlserver_service import Server
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_sqlserver_va_emails_notifications_admins_enabled:
    def test_no_sql_servers(self):
        sqlserver_client = mock.MagicMock
        sqlserver_client.sql_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_va_emails_notifications_admins_enabled.sqlserver_va_emails_notifications_admins_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_va_emails_notifications_admins_enabled.sqlserver_va_emails_notifications_admins_enabled import (
                sqlserver_va_emails_notifications_admins_enabled,
            )

            check = sqlserver_va_emails_notifications_admins_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_sql_servers_no_vulnerability_assessment(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    public_network_access="",
                    minimal_tls_version="",
                    administrators=None,
                    auditing_policies=None,
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
                    vulnerability_assessment=None,
                    location="location",
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_va_emails_notifications_admins_enabled.sqlserver_va_emails_notifications_admins_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_va_emails_notifications_admins_enabled.sqlserver_va_emails_notifications_admins_enabled import (
                sqlserver_va_emails_notifications_admins_enabled,
            )

            check = sqlserver_va_emails_notifications_admins_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has vulnerability assessment disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_no_vulnerability_assessment_no_admin_emails(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    location="location",
                    public_network_access="",
                    minimal_tls_version="",
                    administrators=None,
                    auditing_policies=None,
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
                    vulnerability_assessment=ServerVulnerabilityAssessment(
                        storage_container_path="/subcription_id/resource_group/sql_server",
                        recurring_scans=VulnerabilityAssessmentRecurringScansProperties(
                            email_subscription_admins=None
                        ),
                    ),
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_va_emails_notifications_admins_enabled.sqlserver_va_emails_notifications_admins_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_va_emails_notifications_admins_enabled.sqlserver_va_emails_notifications_admins_enabled import (
                sqlserver_va_emails_notifications_admins_enabled,
            )

            check = sqlserver_va_emails_notifications_admins_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has vulnerability assessment enabled but no scan reports configured for subscription admins."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_vulnerability_assessment_admin_emails_false(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    location="location",
                    public_network_access="",
                    minimal_tls_version="",
                    administrators=None,
                    auditing_policies=None,
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
                    vulnerability_assessment=ServerVulnerabilityAssessment(
                        storage_container_path="/subcription_id/resource_group/sql_server",
                        recurring_scans=VulnerabilityAssessmentRecurringScansProperties(
                            email_subscription_admins=False
                        ),
                    ),
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_va_emails_notifications_admins_enabled.sqlserver_va_emails_notifications_admins_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_va_emails_notifications_admins_enabled.sqlserver_va_emails_notifications_admins_enabled import (
                sqlserver_va_emails_notifications_admins_enabled,
            )

            check = sqlserver_va_emails_notifications_admins_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has vulnerability assessment enabled but no scan reports configured for subscription admins."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_vulnerability_assessment_no_email_subscription_admins(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    location="location",
                    public_network_access="",
                    minimal_tls_version="",
                    administrators=None,
                    auditing_policies=None,
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
                    vulnerability_assessment=ServerVulnerabilityAssessment(
                        storage_container_path="/subcription_id/resource_group/sql_server",
                        recurring_scans=VulnerabilityAssessmentRecurringScansProperties(
                            email_subscription_admins=True
                        ),
                    ),
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_va_emails_notifications_admins_enabled.sqlserver_va_emails_notifications_admins_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_va_emails_notifications_admins_enabled.sqlserver_va_emails_notifications_admins_enabled import (
                sqlserver_va_emails_notifications_admins_enabled,
            )

            check = sqlserver_va_emails_notifications_admins_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has vulnerability assessment enabled and scan reports configured for subscription admins."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_va_periodic_recurring_scans_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/sqlserver/sqlserver_va_periodic_recurring_scans_enabled/sqlserver_va_periodic_recurring_scans_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.sql.models import (
    ServerVulnerabilityAssessment,
    VulnerabilityAssessmentRecurringScansProperties,
)

from prowler.providers.azure.services.sqlserver.sqlserver_service import Server
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_sqlserver_va_periodic_recurring_scans_enabled:
    def test_no_sql_servers(self):
        sqlserver_client = mock.MagicMock
        sqlserver_client.sql_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_va_periodic_recurring_scans_enabled import (
                sqlserver_va_periodic_recurring_scans_enabled,
            )

            check = sqlserver_va_periodic_recurring_scans_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_sql_servers_no_vulnerability_assessment(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    public_network_access="",
                    minimal_tls_version="",
                    administrators=None,
                    auditing_policies=None,
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
                    vulnerability_assessment=None,
                    location="location",
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_va_periodic_recurring_scans_enabled import (
                sqlserver_va_periodic_recurring_scans_enabled,
            )

            check = sqlserver_va_periodic_recurring_scans_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has vulnerability assessment disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_no_vulnerability_assessment_storage_container_path(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    location="location",
                    public_network_access="",
                    minimal_tls_version="",
                    administrators=None,
                    auditing_policies=None,
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
                    vulnerability_assessment=ServerVulnerabilityAssessment(
                        storage_container_path=None
                    ),
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_va_periodic_recurring_scans_enabled import (
                sqlserver_va_periodic_recurring_scans_enabled,
            )

            check = sqlserver_va_periodic_recurring_scans_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has vulnerability assessment disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_vulnerability_assessment_recuring_scans_disabled(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    location="location",
                    public_network_access="",
                    minimal_tls_version="",
                    administrators=None,
                    auditing_policies=None,
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
                    vulnerability_assessment=ServerVulnerabilityAssessment(
                        storage_container_path="/subcription_id/resource_group/sql_server",
                        recurring_scans=VulnerabilityAssessmentRecurringScansProperties(
                            is_enabled=False
                        ),
                    ),
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_va_periodic_recurring_scans_enabled import (
                sqlserver_va_periodic_recurring_scans_enabled,
            )

            check = sqlserver_va_periodic_recurring_scans_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has vulnerability assessment enabled but no recurring scans."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_vulnerability_assessment_recuring_scans_enabled(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    location="location",
                    public_network_access="",
                    minimal_tls_version="",
                    administrators=None,
                    auditing_policies=None,
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
                    vulnerability_assessment=ServerVulnerabilityAssessment(
                        storage_container_path="/subcription_id/resource_group/sql_server",
                        recurring_scans=VulnerabilityAssessmentRecurringScansProperties(
                            is_enabled=True
                        ),
                    ),
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_va_periodic_recurring_scans_enabled.sqlserver_va_periodic_recurring_scans_enabled import (
                sqlserver_va_periodic_recurring_scans_enabled,
            )

            check = sqlserver_va_periodic_recurring_scans_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has periodic recurring scans enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

````
