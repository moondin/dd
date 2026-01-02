---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 677
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 677 of 867)

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

---[FILE: sqlserver_service_test.py]---
Location: prowler-master/tests/providers/azure/services/sqlserver/sqlserver_service_test.py

```python
from unittest.mock import patch

from azure.mgmt.sql.models import (
    EncryptionProtector,
    FirewallRule,
    ServerBlobAuditingPolicy,
    ServerSecurityAlertPolicy,
    ServerVulnerabilityAssessment,
    TransparentDataEncryption,
)

from prowler.providers.azure.services.sqlserver.sqlserver_service import (
    Database,
    Server,
    SQLServer,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_sqlserver_get_sql_servers(_):
    database = Database(
        id="id",
        name="name",
        type="type",
        location="location",
        managed_by="managed_by",
        tde_encryption=TransparentDataEncryption(status="Disabled"),
    )
    return {
        AZURE_SUBSCRIPTION_ID: [
            Server(
                id="id",
                name="name",
                location="location",
                public_network_access="public_network_access",
                minimal_tls_version="minimal_tls_version",
                administrators=None,
                auditing_policies=ServerBlobAuditingPolicy(state="Disabled"),
                firewall_rules=FirewallRule(name="name"),
                encryption_protector=EncryptionProtector(
                    server_key_type="AzureKeyVault"
                ),
                databases=[database],
                vulnerability_assessment=ServerVulnerabilityAssessment(
                    storage_container_path="/subcription_id/resource_group/sql_server"
                ),
                security_alert_policies=ServerSecurityAlertPolicy(state="Disabled"),
            )
        ]
    }


@patch(
    "prowler.providers.azure.services.sqlserver.sqlserver_service.SQLServer._get_sql_servers",
    new=mock_sqlserver_get_sql_servers,
)
class Test_SqlServer_Service:
    def test_get_client(self):
        sql_server = SQLServer(set_mocked_azure_provider())
        assert (
            sql_server.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            == "SqlManagementClient"
        )

    def test_get_sql_servers(self):
        database = Database(
            id="id",
            name="name",
            type="type",
            location="location",
            managed_by="managed_by",
            tde_encryption=TransparentDataEncryption(status="Disabled"),
        )
        sql_server = SQLServer(set_mocked_azure_provider())
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].__class__.__name__
            == "Server"
        )
        assert sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].id == "id"
        assert sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].name == "name"
        assert sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].location == "location"
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].public_network_access
            == "public_network_access"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].minimal_tls_version
            == "minimal_tls_version"
        )
        assert sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].administrators is None
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].auditing_policies.__class__.__name__
            == "ServerBlobAuditingPolicy"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].firewall_rules.__class__.__name__
            == "FirewallRule"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].encryption_protector.__class__.__name__
            == "EncryptionProtector"
        )
        assert sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].databases == [database]
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].vulnerability_assessment.__class__.__name__
            == "ServerVulnerabilityAssessment"
        )

    def test_get_databases(self):
        sql_server = SQLServer(set_mocked_azure_provider())
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0]
            .databases[0]
            .__class__.__name__
            == "Database"
        )
        assert sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].databases[0].id == "id"
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].databases[0].name == "name"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].databases[0].type == "type"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].databases[0].location
            == "location"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].databases[0].managed_by
            == "managed_by"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0]
            .databases[0]
            .tde_encryption.__class__.__name__
            == "TransparentDataEncryption"
        )

    def test_get_transparent_data_encryption(self):
        sql_server = SQLServer(set_mocked_azure_provider())
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0]
            .databases[0]
            .tde_encryption.__class__.__name__
            == "TransparentDataEncryption"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0]
            .databases[0]
            .tde_encryption.status
            == "Disabled"
        )

    def test__get_encryption_protectors__(self):
        sql_server = SQLServer(set_mocked_azure_provider())
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].encryption_protector.__class__.__name__
            == "EncryptionProtector"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].encryption_protector.server_key_type
            == "AzureKeyVault"
        )

    def test_get_resource_group(self):
        id = "/subscriptions/subscription_id/resourceGroups/resource_group/providers/Microsoft.Sql/servers/sql_server"
        sql_server = SQLServer(set_mocked_azure_provider())
        assert sql_server._get_resource_group(id) == "resource_group"

    def test__get_vulnerability_assessment__(self):
        sql_server = SQLServer(set_mocked_azure_provider())
        storage_container_path = "/subcription_id/resource_group/sql_server"
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].vulnerability_assessment.__class__.__name__
            == "ServerVulnerabilityAssessment"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].vulnerability_assessment.storage_container_path
            == storage_container_path
        )

    def test_get_server_blob_auditing_policies(self):
        sql_server = SQLServer(set_mocked_azure_provider())
        auditing_policies = ServerBlobAuditingPolicy(state="Disabled")
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].auditing_policies.__class__.__name__
            == "ServerBlobAuditingPolicy"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].auditing_policies
            == auditing_policies
        )

    def test_get_firewall_rules(self):
        sql_server = SQLServer(set_mocked_azure_provider())
        firewall_rules = FirewallRule(name="name")
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].firewall_rules.__class__.__name__
            == "FirewallRule"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].firewall_rules
            == firewall_rules
        )

    def test_get_server_security_alert_policies(self):
        sql_server = SQLServer(set_mocked_azure_provider())
        security_alert_policies = ServerSecurityAlertPolicy(state="Disabled")
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].security_alert_policies.__class__.__name__
            == "ServerSecurityAlertPolicy"
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][0].security_alert_policies
            == security_alert_policies
        )
        assert (
            sql_server.sql_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].security_alert_policies.state
            == "Disabled"
        )
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_auditing_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/sqlserver/sqlserver_auditing_enabled/sqlserver_auditing_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.sql.models import (
    FirewallRule,
    ServerBlobAuditingPolicy,
    ServerExternalAdministrator,
)

from prowler.providers.azure.services.sqlserver.sqlserver_service import Server
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_sqlserver_auditing_enabled:
    def test_no_sql_servers(self):
        sqlserver_client = mock.MagicMock
        sqlserver_client.sql_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_auditing_enabled.sqlserver_auditing_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_auditing_enabled.sqlserver_auditing_enabled import (
                sqlserver_auditing_enabled,
            )

            check = sqlserver_auditing_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_sql_servers_auditing_disabled(self):
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
                    administrators=ServerExternalAdministrator(),
                    auditing_policies=[ServerBlobAuditingPolicy(state="Disabled")],
                    firewall_rules=FirewallRule(),
                    location="location",
                ),
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_auditing_enabled.sqlserver_auditing_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_auditing_enabled.sqlserver_auditing_enabled import (
                sqlserver_auditing_enabled,
            )

            check = sqlserver_auditing_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have any auditing policy configured."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_auditing_enabled(self):
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
                    administrators=ServerExternalAdministrator(),
                    auditing_policies=[ServerBlobAuditingPolicy(state="Enabled")],
                    firewall_rules=FirewallRule(),
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
                "prowler.providers.azure.services.sqlserver.sqlserver_auditing_enabled.sqlserver_auditing_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_auditing_enabled.sqlserver_auditing_enabled import (
                sqlserver_auditing_enabled,
            )

            check = sqlserver_auditing_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has an auditing policy configured."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_auditing_retention_90_days_test.py]---
Location: prowler-master/tests/providers/azure/services/sqlserver/sqlserver_auditing_retention_90_days/sqlserver_auditing_retention_90_days_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.sql.models import ServerBlobAuditingPolicy

from prowler.providers.azure.services.sqlserver.sqlserver_service import Server
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_sqlserver_auditing_retention_90_days:
    def test_no_sql_servers(self):
        sqlserver_client = mock.MagicMock
        sqlserver_client.sql_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days import (
                sqlserver_auditing_retention_90_days,
            )

            check = sqlserver_auditing_retention_90_days()
            result = check.execute()
            assert len(result) == 0

    def test_sql_servers_auditing_policy_disabled(self):
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
                    auditing_policies=[ServerBlobAuditingPolicy(state="Disabled")],
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
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
                "prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days import (
                sqlserver_auditing_retention_90_days,
            )

            check = sqlserver_auditing_retention_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has auditing disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_auditing_retention_less_than_90_days(self):
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
                    auditing_policies=[
                        ServerBlobAuditingPolicy(state="Enabled", retention_days=89)
                    ],
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
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
                "prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days import (
                sqlserver_auditing_retention_90_days,
            )

            check = sqlserver_auditing_retention_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has auditing retention less than 91 days."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_auditing_retention_greater_than_90_days(self):
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
                    auditing_policies=[
                        ServerBlobAuditingPolicy(state="Enabled", retention_days=91)
                    ],
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
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
                "prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days import (
                sqlserver_auditing_retention_90_days,
            )

            check = sqlserver_auditing_retention_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has auditing retention greater than 90 days."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_two_auditing_policies_with_auditing_retention_greater_than_90_days(
        self,
    ):
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
                    auditing_policies=[
                        ServerBlobAuditingPolicy(state="Enabled", retention_days=91),
                        ServerBlobAuditingPolicy(state="Enabled", retention_days=100),
                    ],
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
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
                "prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days import (
                sqlserver_auditing_retention_90_days,
            )

            check = sqlserver_auditing_retention_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has auditing retention greater than 90 days."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_two_auditing_policies_with_one_auditing_retention_less_than_90_days(
        self,
    ):
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
                    auditing_policies=[
                        ServerBlobAuditingPolicy(state="Enabled", retention_days=91),
                        ServerBlobAuditingPolicy(state="Enabled", retention_days=80),
                    ],
                    firewall_rules=None,
                    databases=None,
                    encryption_protector=None,
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
                "prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_auditing_retention_90_days.sqlserver_auditing_retention_90_days import (
                sqlserver_auditing_retention_90_days,
            )

            check = sqlserver_auditing_retention_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has auditing retention less than 91 days."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_azuread_administrator_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/sqlserver/sqlserver_azuread_administrator_enabled/sqlserver_azuread_administrator_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.sql.models import ServerExternalAdministrator

from prowler.providers.azure.services.sqlserver.sqlserver_service import Server
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_sqlserver_azuread_administrator_enabled:
    def test_no_sql_servers(self):
        sqlserver_client = mock.MagicMock
        sqlserver_client.sql_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_azuread_administrator_enabled.sqlserver_azuread_administrator_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_azuread_administrator_enabled.sqlserver_azuread_administrator_enabled import (
                sqlserver_azuread_administrator_enabled,
            )

            check = sqlserver_azuread_administrator_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_sql_servers_azuread_no_administrator(self):
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
                    auditing_policies=[],
                    firewall_rules=None,
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
                "prowler.providers.azure.services.sqlserver.sqlserver_azuread_administrator_enabled.sqlserver_azuread_administrator_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_azuread_administrator_enabled.sqlserver_azuread_administrator_enabled import (
                sqlserver_azuread_administrator_enabled,
            )

            check = sqlserver_azuread_administrator_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have an Active Directory administrator."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_azuread_administrator_no_active_directory(self):
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
                    administrators=ServerExternalAdministrator(
                        administrator_type="No ActiveDirectory"
                    ),
                    auditing_policies=[],
                    firewall_rules=None,
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
                "prowler.providers.azure.services.sqlserver.sqlserver_azuread_administrator_enabled.sqlserver_azuread_administrator_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_azuread_administrator_enabled.sqlserver_azuread_administrator_enabled import (
                sqlserver_azuread_administrator_enabled,
            )

            check = sqlserver_azuread_administrator_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} does not have an Active Directory administrator."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_azuread_administrator_active_directory(self):
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
                    administrators=ServerExternalAdministrator(
                        administrator_type="ActiveDirectory"
                    ),
                    auditing_policies=[],
                    firewall_rules=None,
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
                "prowler.providers.azure.services.sqlserver.sqlserver_azuread_administrator_enabled.sqlserver_azuread_administrator_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_azuread_administrator_enabled.sqlserver_azuread_administrator_enabled import (
                sqlserver_azuread_administrator_enabled,
            )

            check = sqlserver_azuread_administrator_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has an Active Directory administrator."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

````
