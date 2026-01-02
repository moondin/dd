---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 675
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 675 of 867)

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

---[FILE: policy_service_test.py]---
Location: prowler-master/tests/providers/azure/services/policy/policy_service_test.py

```python
from unittest.mock import patch

from prowler.providers.azure.services.policy.policy_service import (
    Policy,
    PolicyAssigment,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_policy_assigments(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "policy-1": PolicyAssigment(
                id="id-1", name="policy-1", enforcement_mode="Default"
            )
        }
    }


@patch(
    "prowler.providers.azure.services.policy.policy_service.Policy._get_policy_assigments",
    new=mock_policy_assigments,
)
class Test_Policy_Service:
    def test_get_client(self):
        policy = Policy(set_mocked_azure_provider())
        assert (
            policy.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__ == "PolicyClient"
        )

    def test__get_subscriptions__(self):
        policy = Policy(set_mocked_azure_provider())
        assert policy.subscriptions.__class__.__name__ == "dict"

    def test_get_policy_assigments(self):
        policy = Policy(set_mocked_azure_provider())
        assert policy.policy_assigments.__class__.__name__ == "dict"
        assert (
            policy.policy_assigments[AZURE_SUBSCRIPTION_ID].__class__.__name__ == "dict"
        )
        assert (
            policy.policy_assigments[AZURE_SUBSCRIPTION_ID][
                "policy-1"
            ].__class__.__name__
            == "PolicyAssigment"
        )
        assert policy.policy_assigments[AZURE_SUBSCRIPTION_ID]["policy-1"].id == "id-1"
        assert (
            policy.policy_assigments[AZURE_SUBSCRIPTION_ID]["policy-1"].enforcement_mode
            == "Default"
        )
```

--------------------------------------------------------------------------------

---[FILE: policy_ensure_asc_enforcement_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/policy/policy_ensure_asc_enforcement_enabled/policy_ensure_asc_enforcement_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.policy.policy_service import PolicyAssigment
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_policy_ensure_asc_enforcement_enabled:
    def test_policy_no_subscriptions(self):
        policy_client = mock.MagicMock
        policy_client.policy_assigments = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.policy.policy_ensure_asc_enforcement_enabled.policy_ensure_asc_enforcement_enabled.policy_client",
                new=policy_client,
            ),
        ):
            from prowler.providers.azure.services.policy.policy_ensure_asc_enforcement_enabled.policy_ensure_asc_enforcement_enabled import (
                policy_ensure_asc_enforcement_enabled,
            )

            check = policy_ensure_asc_enforcement_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_policy_subscription_empty(self):
        policy_client = mock.MagicMock
        policy_client.policy_assigments = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.policy.policy_ensure_asc_enforcement_enabled.policy_ensure_asc_enforcement_enabled.policy_client",
                new=policy_client,
            ),
        ):
            from prowler.providers.azure.services.policy.policy_ensure_asc_enforcement_enabled.policy_ensure_asc_enforcement_enabled import (
                policy_ensure_asc_enforcement_enabled,
            )

            check = policy_ensure_asc_enforcement_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_policy_subscription_no_asc(self):
        policy_client = mock.MagicMock
        resource_id = uuid4()
        policy_client.policy_assigments = {
            AZURE_SUBSCRIPTION_ID: {
                "policy-1": PolicyAssigment(
                    id=resource_id, name="policy-1", enforcement_mode="Default"
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.policy.policy_ensure_asc_enforcement_enabled.policy_ensure_asc_enforcement_enabled.policy_client",
                new=policy_client,
            ),
        ):
            from prowler.providers.azure.services.policy.policy_ensure_asc_enforcement_enabled.policy_ensure_asc_enforcement_enabled import (
                policy_ensure_asc_enforcement_enabled,
            )

            check = policy_ensure_asc_enforcement_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_policy_subscription_asc_default(self):
        policy_client = mock.MagicMock
        resource_id = str(uuid4())
        policy_client.policy_assigments = {
            AZURE_SUBSCRIPTION_ID: {
                "SecurityCenterBuiltIn": PolicyAssigment(
                    id=resource_id,
                    name="SecurityCenterBuiltIn",
                    enforcement_mode="Default",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.policy.policy_ensure_asc_enforcement_enabled.policy_ensure_asc_enforcement_enabled.policy_client",
                new=policy_client,
            ),
        ):
            from prowler.providers.azure.services.policy.policy_ensure_asc_enforcement_enabled.policy_ensure_asc_enforcement_enabled import (
                policy_ensure_asc_enforcement_enabled,
            )

            check = policy_ensure_asc_enforcement_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Policy assigment '{resource_id}' is configured with enforcement mode 'Default'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "SecurityCenterBuiltIn"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID

    def test_policy_subscription_asc_not_default(self):
        policy_client = mock.MagicMock
        resource_id = str(uuid4())
        policy_client.policy_assigments = {
            AZURE_SUBSCRIPTION_ID: {
                "SecurityCenterBuiltIn": PolicyAssigment(
                    id=resource_id,
                    name="SecurityCenterBuiltIn",
                    enforcement_mode="DoNotEnforce",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.policy.policy_ensure_asc_enforcement_enabled.policy_ensure_asc_enforcement_enabled.policy_client",
                new=policy_client,
            ),
        ):
            from prowler.providers.azure.services.policy.policy_ensure_asc_enforcement_enabled.policy_ensure_asc_enforcement_enabled import (
                policy_ensure_asc_enforcement_enabled,
            )

            check = policy_ensure_asc_enforcement_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Policy assigment '{resource_id}' is not configured with enforcement mode Default."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "SecurityCenterBuiltIn"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
```

--------------------------------------------------------------------------------

---[FILE: postgresql_service_test.py]---
Location: prowler-master/tests/providers/azure/services/postgresql/postgresql_service_test.py

```python
from unittest.mock import patch

from prowler.providers.azure.services.postgresql.postgresql_service import (
    EntraIdAdmin,
    Firewall,
    PostgreSQL,
    Server,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_sqlserver_get_postgresql_flexible_servers(_):
    firewall = Firewall(
        id="id",
        name="name",
        start_ip="start_ip",
        end_ip="end_ip",
    )
    return {
        AZURE_SUBSCRIPTION_ID: [
            Server(
                id="id",
                name="name",
                resource_group="resource_group",
                location="location",
                require_secure_transport="ON",
                active_directory_auth="ENABLED",
                entra_id_admins=[
                    EntraIdAdmin(
                        object_id="11111111-1111-1111-1111-111111111111",
                        principal_name="Test Admin User",
                        principal_type="User",
                        tenant_id="22222222-2222-2222-2222-222222222222",
                    )
                ],
                log_checkpoints="ON",
                log_connections="ON",
                log_disconnections="ON",
                connection_throttling="ON",
                log_retention_days="3",
                firewall=[firewall],
            )
        ]
    }


@patch(
    "prowler.providers.azure.services.postgresql.postgresql_service.PostgreSQL._get_flexible_servers",
    new=mock_sqlserver_get_postgresql_flexible_servers,
)
class Test_SqlServer_Service:
    def test_get_client(self):
        postgresql = PostgreSQL(set_mocked_azure_provider())
        assert (
            postgresql.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            == "PostgreSQLManagementClient"
        )

    def test_get_sql_servers(self):
        postgesql = PostgreSQL(set_mocked_azure_provider())
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].__class__.__name__
            == "Server"
        )
        assert postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].id == "id"
        assert postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].name == "name"
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].location == "location"
        )
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].resource_group
            == "resource_group"
        )

    def test_get_resource_group(self):
        id = "/subscriptions/subscription/resourceGroups/resource_group/providers/Microsoft.DBforPostgreSQL/flexibleServers/server"
        postgresql = PostgreSQL(set_mocked_azure_provider())
        assert postgresql._get_resource_group(id) == "resource_group"

    def test_get_require_secure_transport(self):
        postgesql = PostgreSQL(set_mocked_azure_provider())
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][
                0
            ].require_secure_transport
            == "ON"
        )

    def test_get_log_checkpoints(self):
        postgesql = PostgreSQL(set_mocked_azure_provider())
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].log_checkpoints == "ON"
        )

    def test_get_log_connections(self):
        postgesql = PostgreSQL(set_mocked_azure_provider())
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].log_connections == "ON"
        )

    def test_get_log_disconnections(self):
        postgesql = PostgreSQL(set_mocked_azure_provider())
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].log_disconnections
            == "ON"
        )

    def test_get_connection_throttling(self):
        postgesql = PostgreSQL(set_mocked_azure_provider())
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].connection_throttling
            == "ON"
        )

    def test_get_log_retention_days(self):
        postgesql = PostgreSQL(set_mocked_azure_provider())
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].log_retention_days
            == "3"
        )

    def test_get_active_directory_auth(self):
        postgresql = PostgreSQL(set_mocked_azure_provider())
        assert (
            postgresql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].active_directory_auth
            == "ENABLED"
        )

    def test_get_entra_id_admins(self):
        postgresql = PostgreSQL(set_mocked_azure_provider())
        admins = postgresql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].entra_id_admins
        assert isinstance(admins, list)
        assert len(admins) == 1
        assert isinstance(admins[0], EntraIdAdmin)
        assert admins[0].principal_name == "Test Admin User"
        assert admins[0].object_id == "11111111-1111-1111-1111-111111111111"

    def test_get_firewall(self):
        postgesql = PostgreSQL(set_mocked_azure_provider())
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0]
            .firewall[0]
            .__class__.__name__
            == "Firewall"
        )
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].firewall[0].id == "id"
        )
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].firewall[0].name
            == "name"
        )
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].firewall[0].start_ip
            == "start_ip"
        )
        assert (
            postgesql.flexible_servers[AZURE_SUBSCRIPTION_ID][0].firewall[0].end_ip
            == "end_ip"
        )
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_allow_access_services_disabled_test.py]---
Location: prowler-master/tests/providers/azure/services/postgresql/postgresql_flexible_server_allow_access_services_disabled/postgresql_flexible_server_allow_access_services_disabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.postgresql.postgresql_service import (
    Firewall,
    Server,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_postgresql_flexible_server_allow_access_services_disabled:
    def test_no_postgresql_flexible_servers(self):
        postgresql_client = mock.MagicMock
        postgresql_client.flexible_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.postgresql.postgresql_flexible_server_allow_access_services_disabled.postgresql_flexible_server_allow_access_services_disabled.postgresql_client",
                new=postgresql_client,
            ),
        ):
            from prowler.providers.azure.services.postgresql.postgresql_flexible_server_allow_access_services_disabled.postgresql_flexible_server_allow_access_services_disabled import (
                postgresql_flexible_server_allow_access_services_disabled,
            )

            check = postgresql_flexible_server_allow_access_services_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_flexible_servers_allow_public_access(self):
        postgresql_client = mock.MagicMock
        postgresql_server_name = "Postgres Flexible Server Name"
        postgresql_server_id = str(uuid4())
        firewall = Firewall(
            id=str(uuid4()),
            name="firewall_name",
            start_ip="0.0.0.0",
            end_ip="0.0.0.0",
        )
        postgresql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=postgresql_server_id,
                    name=postgresql_server_name,
                    resource_group="resource_group",
                    location="location",
                    require_secure_transport="OFF",
                    active_directory_auth=None,
                    entra_id_admins=[],
                    log_checkpoints="OFF",
                    log_connections="OFF",
                    log_disconnections="OFF",
                    connection_throttling="OFF",
                    log_retention_days="3",
                    firewall=[firewall],
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.postgresql.postgresql_flexible_server_allow_access_services_disabled.postgresql_flexible_server_allow_access_services_disabled.postgresql_client",
                new=postgresql_client,
            ),
        ):
            from prowler.providers.azure.services.postgresql.postgresql_flexible_server_allow_access_services_disabled.postgresql_flexible_server_allow_access_services_disabled import (
                postgresql_flexible_server_allow_access_services_disabled,
            )

            check = postgresql_flexible_server_allow_access_services_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Flexible Postgresql server {postgresql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has allow public access from any Azure service enabled"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == postgresql_server_name
            assert result[0].resource_id == postgresql_server_id
            assert result[0].location == "location"

    def test_flexible_servers_dont_allow_public_access(self):
        postgresql_client = mock.MagicMock
        postgresql_server_name = "Postgres Flexible Server Name"
        postgresql_server_id = str(uuid4())
        firewall = Firewall(
            id=str(uuid4()),
            name="firewall_name",
            start_ip="1.1.1.1",
            end_ip="1.1.1.1",
        )
        postgresql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=postgresql_server_id,
                    name=postgresql_server_name,
                    resource_group="resource_group",
                    location="location",
                    require_secure_transport="OFF",
                    active_directory_auth=None,
                    entra_id_admins=[],
                    log_checkpoints="OFF",
                    log_connections="OFF",
                    log_disconnections="OFF",
                    connection_throttling="OFF",
                    log_retention_days="3",
                    firewall=[firewall],
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.postgresql.postgresql_flexible_server_allow_access_services_disabled.postgresql_flexible_server_allow_access_services_disabled.postgresql_client",
                new=postgresql_client,
            ),
        ):
            from prowler.providers.azure.services.postgresql.postgresql_flexible_server_allow_access_services_disabled.postgresql_flexible_server_allow_access_services_disabled import (
                postgresql_flexible_server_allow_access_services_disabled,
            )

            check = postgresql_flexible_server_allow_access_services_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Flexible Postgresql server {postgresql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has allow public access from any Azure service disabled"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == postgresql_server_name
            assert result[0].resource_id == postgresql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_connection_throttling_on_test.py]---
Location: prowler-master/tests/providers/azure/services/postgresql/postgresql_flexible_server_connection_throttling_on/postgresql_flexible_server_connection_throttling_on_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.postgresql.postgresql_service import Server
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_postgresql_flexible_server_connection_throttling_on:
    def test_no_postgresql_flexible_servers(self):
        postgresql_client = mock.MagicMock
        postgresql_client.flexible_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.postgresql.postgresql_flexible_server_connection_throttling_on.postgresql_flexible_server_connection_throttling_on.postgresql_client",
                new=postgresql_client,
            ),
        ):
            from prowler.providers.azure.services.postgresql.postgresql_flexible_server_connection_throttling_on.postgresql_flexible_server_connection_throttling_on import (
                postgresql_flexible_server_connection_throttling_on,
            )

            check = postgresql_flexible_server_connection_throttling_on()
            result = check.execute()
            assert len(result) == 0

    def test_flexible_servers_connection_throttling_off(self):
        postgresql_client = mock.MagicMock
        postgresql_server_name = "Postgres Flexible Server Name"
        postgresql_server_id = str(uuid4())
        postgresql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=postgresql_server_id,
                    name=postgresql_server_name,
                    resource_group="resource_group",
                    location="location",
                    require_secure_transport="OFF",
                    active_directory_auth=None,
                    entra_id_admins=[],
                    log_checkpoints="OFF",
                    log_connections="OFF",
                    log_disconnections="OFF",
                    connection_throttling="OFF",
                    log_retention_days="3",
                    firewall=None,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.postgresql.postgresql_flexible_server_connection_throttling_on.postgresql_flexible_server_connection_throttling_on.postgresql_client",
                new=postgresql_client,
            ),
        ):
            from prowler.providers.azure.services.postgresql.postgresql_flexible_server_connection_throttling_on.postgresql_flexible_server_connection_throttling_on import (
                postgresql_flexible_server_connection_throttling_on,
            )

            check = postgresql_flexible_server_connection_throttling_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Flexible Postgresql server {postgresql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has connection_throttling disabled"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == postgresql_server_name
            assert result[0].resource_id == postgresql_server_id
            assert result[0].location == "location"

    def test_flexible_servers_connection_throttling_on(self):
        postgresql_client = mock.MagicMock
        postgresql_server_name = "Postgres Flexible Server Name"
        postgresql_server_id = str(uuid4())
        postgresql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=postgresql_server_id,
                    name=postgresql_server_name,
                    resource_group="resource_group",
                    location="location",
                    require_secure_transport="OFF",
                    active_directory_auth=None,
                    entra_id_admins=[],
                    log_checkpoints="ON",
                    log_connections="ON",
                    log_disconnections="ON",
                    connection_throttling="ON",
                    log_retention_days="3",
                    firewall=None,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.postgresql.postgresql_flexible_server_connection_throttling_on.postgresql_flexible_server_connection_throttling_on.postgresql_client",
                new=postgresql_client,
            ),
        ):
            from prowler.providers.azure.services.postgresql.postgresql_flexible_server_connection_throttling_on.postgresql_flexible_server_connection_throttling_on import (
                postgresql_flexible_server_connection_throttling_on,
            )

            check = postgresql_flexible_server_connection_throttling_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Flexible Postgresql server {postgresql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has connection_throttling enabled"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == postgresql_server_name
            assert result[0].resource_id == postgresql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_enforce_ssl_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/postgresql/postgresql_flexible_server_enforce_ssl_enabled/postgresql_flexible_server_enforce_ssl_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.postgresql.postgresql_service import Server
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_postgresql_flexible_server_enforce_ssl_enabled:
    def test_no_postgresql_flexible_servers(self):
        postgresql_client = mock.MagicMock
        postgresql_client.flexible_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.postgresql.postgresql_flexible_server_enforce_ssl_enabled.postgresql_flexible_server_enforce_ssl_enabled.postgresql_client",
                new=postgresql_client,
            ),
        ):
            from prowler.providers.azure.services.postgresql.postgresql_flexible_server_enforce_ssl_enabled.postgresql_flexible_server_enforce_ssl_enabled import (
                postgresql_flexible_server_enforce_ssl_enabled,
            )

            check = postgresql_flexible_server_enforce_ssl_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_flexible_servers_require_secure_transport_off(self):
        postgresql_client = mock.MagicMock
        postgresql_server_name = "Postgres Flexible Server Name"
        postgresql_server_id = str(uuid4())
        postgresql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=postgresql_server_id,
                    name=postgresql_server_name,
                    resource_group="resource_group",
                    location="location",
                    require_secure_transport="OFF",
                    active_directory_auth=None,
                    entra_id_admins=[],
                    log_checkpoints="ON",
                    log_connections="ON",
                    log_disconnections="ON",
                    connection_throttling="ON",
                    log_retention_days="3",
                    firewall=None,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.postgresql.postgresql_flexible_server_enforce_ssl_enabled.postgresql_flexible_server_enforce_ssl_enabled.postgresql_client",
                new=postgresql_client,
            ),
        ):
            from prowler.providers.azure.services.postgresql.postgresql_flexible_server_enforce_ssl_enabled.postgresql_flexible_server_enforce_ssl_enabled import (
                postgresql_flexible_server_enforce_ssl_enabled,
            )

            check = postgresql_flexible_server_enforce_ssl_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Flexible Postgresql server {postgresql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has enforce ssl disabled"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == postgresql_server_name
            assert result[0].resource_id == postgresql_server_id
            assert result[0].location == "location"

    def test_flexible_servers_require_secure_transport_on(self):
        postgresql_client = mock.MagicMock
        postgresql_server_name = "Postgres Flexible Server Name"
        postgresql_server_id = str(uuid4())
        postgresql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=postgresql_server_id,
                    name=postgresql_server_name,
                    resource_group="resource_group",
                    location="location",
                    require_secure_transport="ON",
                    active_directory_auth=None,
                    entra_id_admins=[],
                    log_checkpoints="ON",
                    log_connections="ON",
                    log_disconnections="ON",
                    connection_throttling="ON",
                    log_retention_days="3",
                    firewall=None,
                )
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.postgresql.postgresql_flexible_server_enforce_ssl_enabled.postgresql_flexible_server_enforce_ssl_enabled.postgresql_client",
                new=postgresql_client,
            ),
        ):
            from prowler.providers.azure.services.postgresql.postgresql_flexible_server_enforce_ssl_enabled.postgresql_flexible_server_enforce_ssl_enabled import (
                postgresql_flexible_server_enforce_ssl_enabled,
            )

            check = postgresql_flexible_server_enforce_ssl_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Flexible Postgresql server {postgresql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has enforce ssl enabled"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == postgresql_server_name
            assert result[0].resource_id == postgresql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

````
