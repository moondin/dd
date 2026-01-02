---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 678
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 678 of 867)

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

---[FILE: sqlserver_microsoft_defender_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/sqlserver/sqlserver_microsoft_defender_enabled/sqlserver_microsoft_defender_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.sql.models import ServerSecurityAlertPolicy

from prowler.providers.azure.services.sqlserver.sqlserver_service import Server
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_sqlserver_microsoft_defender_enabled:
    def test_no_sql_servers(self):
        sqlserver_client = mock.MagicMock
        sqlserver_client.sql_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_microsoft_defender_enabled.sqlserver_microsoft_defender_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_microsoft_defender_enabled.sqlserver_microsoft_defender_enabled import (
                sqlserver_microsoft_defender_enabled,
            )

            check = sqlserver_microsoft_defender_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_sql_servers_no_security_alert_policies(self):
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
                    security_alert_policies=None,
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
                "prowler.providers.azure.services.sqlserver.sqlserver_microsoft_defender_enabled.sqlserver_microsoft_defender_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_microsoft_defender_enabled.sqlserver_microsoft_defender_enabled import (
                sqlserver_microsoft_defender_enabled,
            )

            check = sqlserver_microsoft_defender_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_sql_servers_microsoft_defender_disabled(self):
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
                    security_alert_policies=ServerSecurityAlertPolicy(state="Disabled"),
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
                "prowler.providers.azure.services.sqlserver.sqlserver_microsoft_defender_enabled.sqlserver_microsoft_defender_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_microsoft_defender_enabled.sqlserver_microsoft_defender_enabled import (
                sqlserver_microsoft_defender_enabled,
            )

            check = sqlserver_microsoft_defender_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has microsoft defender disabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_microsoft_defender_enabled(self):
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
                    security_alert_policies=ServerSecurityAlertPolicy(state="Enabled"),
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
                "prowler.providers.azure.services.sqlserver.sqlserver_microsoft_defender_enabled.sqlserver_microsoft_defender_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_microsoft_defender_enabled.sqlserver_microsoft_defender_enabled import (
                sqlserver_microsoft_defender_enabled,
            )

            check = sqlserver_microsoft_defender_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has microsoft defender enabled."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_recommended_minimal_tls_version_test.py]---
Location: prowler-master/tests/providers/azure/services/sqlserver/sqlserver_recommended_minimal_tls_version/sqlserver_recommended_minimal_tls_version_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.sql.models import TransparentDataEncryption

from prowler.providers.azure.services.sqlserver.sqlserver_service import (
    Database,
    Server,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_sqlserver_recommended_minimal_tls_version:
    def test_no_sql_servers(self):
        sqlserver_client = mock.MagicMock
        sqlserver_client.sql_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_recommended_minimal_tls_version.sqlserver_recommended_minimal_tls_version.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_recommended_minimal_tls_version.sqlserver_recommended_minimal_tls_version import (
                sqlserver_recommended_minimal_tls_version,
            )

            sqlserver_client.audit_config = {
                "recommended_minimal_tls_versions": ["1.2", "1.3"]
            }

            check = sqlserver_recommended_minimal_tls_version()
            result = check.execute()
            assert len(result) == 0

    def test_sql_servers_deprecated_minimal_tls_version(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        database_name = "Database Name"
        database_id = str(uuid4())
        database = Database(
            id=database_id,
            name=database_name,
            type="type",
            location="location",
            managed_by="managed_by",
            tde_encryption=TransparentDataEncryption(status="Disabled"),
        )
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    public_network_access="",
                    minimal_tls_version="1.0",
                    administrators=None,
                    auditing_policies=None,
                    firewall_rules=None,
                    databases=[database],
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
                "prowler.providers.azure.services.sqlserver.sqlserver_recommended_minimal_tls_version.sqlserver_recommended_minimal_tls_version.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_recommended_minimal_tls_version.sqlserver_recommended_minimal_tls_version import (
                sqlserver_recommended_minimal_tls_version,
            )

            sqlserver_client.audit_config = {
                "recommended_minimal_tls_versions": ["1.2", "1.3"]
            }

            check = sqlserver_recommended_minimal_tls_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} is using TLS version 1.0 as minimal accepted which is not recommended. Please use one of the recommended versions: {', '.join(sqlserver_client.audit_config['recommended_minimal_tls_versions'])}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_no_minimal_tls_version(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        database_name = "Database Name"
        database_id = str(uuid4())
        database = Database(
            id=database_id,
            name=database_name,
            type="type",
            location="location",
            managed_by="managed_by",
            tde_encryption=TransparentDataEncryption(status="Disabled"),
        )
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
                    databases=[database],
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
                "prowler.providers.azure.services.sqlserver.sqlserver_recommended_minimal_tls_version.sqlserver_recommended_minimal_tls_version.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_recommended_minimal_tls_version.sqlserver_recommended_minimal_tls_version import (
                sqlserver_recommended_minimal_tls_version,
            )

            sqlserver_client.audit_config = {
                "recommended_minimal_tls_versions": ["1.2", "1.3"]
            }

            check = sqlserver_recommended_minimal_tls_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} is using TLS version  as minimal accepted which is not recommended. Please use one of the recommended versions: {', '.join(sqlserver_client.audit_config['recommended_minimal_tls_versions'])}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_minimal_tls_version(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        database_name = "Database Name"
        database_id = str(uuid4())
        database = Database(
            id=database_id,
            name=database_name,
            type="type",
            location="location",
            managed_by="managed_by",
            tde_encryption=TransparentDataEncryption(status="Enabled"),
        )
        sqlserver_client.sql_servers = {
            AZURE_SUBSCRIPTION_ID: [
                Server(
                    id=sql_server_id,
                    name=sql_server_name,
                    public_network_access="",
                    minimal_tls_version="1.2",
                    administrators=None,
                    auditing_policies=None,
                    firewall_rules=None,
                    databases=[database],
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
                "prowler.providers.azure.services.sqlserver.sqlserver_recommended_minimal_tls_version.sqlserver_recommended_minimal_tls_version.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_recommended_minimal_tls_version.sqlserver_recommended_minimal_tls_version import (
                sqlserver_recommended_minimal_tls_version,
            )

            sqlserver_client.audit_config = {
                "recommended_minimal_tls_versions": ["1.2", "1.3"]
            }

            check = sqlserver_recommended_minimal_tls_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} is using version 1.2 as minimal accepted which is recommended."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_tde_encrypted_with_cmk_test.py]---
Location: prowler-master/tests/providers/azure/services/sqlserver/sqlserver_tde_encrypted_with_cmk/sqlserver_tde_encrypted_with_cmk_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.sql.models import EncryptionProtector, TransparentDataEncryption

from prowler.providers.azure.services.sqlserver.sqlserver_service import (
    Database,
    Server,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_sqlserver_tde_encrypted_with_cmk:
    def test_no_sql_servers(self):
        sqlserver_client = mock.MagicMock
        sqlserver_client.sql_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_tde_encrypted_with_cmk.sqlserver_tde_encrypted_with_cmk.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_tde_encrypted_with_cmk.sqlserver_tde_encrypted_with_cmk import (
                sqlserver_tde_encrypted_with_cmk,
            )

            check = sqlserver_tde_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 0

    def test_no_sql_servers_databases(self):
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
                "prowler.providers.azure.services.sqlserver.sqlserver_tde_encrypted_with_cmk.sqlserver_tde_encrypted_with_cmk.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_tde_encrypted_with_cmk.sqlserver_tde_encrypted_with_cmk import (
                sqlserver_tde_encrypted_with_cmk,
            )

            check = sqlserver_tde_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 0

    def test_sql_servers_encryption_protector_service_managed(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        database = Database(
            id="id",
            name="name",
            type="type",
            location="location",
            managed_by="managed_by",
            tde_encryption=None,
        )
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
                    databases=[database],
                    encryption_protector=EncryptionProtector(
                        server_key_type="ServiceManaged"
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
                "prowler.providers.azure.services.sqlserver.sqlserver_tde_encrypted_with_cmk.sqlserver_tde_encrypted_with_cmk.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_tde_encrypted_with_cmk.sqlserver_tde_encrypted_with_cmk import (
                sqlserver_tde_encrypted_with_cmk,
            )

            check = sqlserver_tde_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has TDE disabled without CMK."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_database_encryption_disabled(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        database = Database(
            id="id",
            name="name",
            type="type",
            location="location",
            managed_by="managed_by",
            tde_encryption=TransparentDataEncryption(status="Disabled"),
        )
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
                    databases=[database],
                    encryption_protector=EncryptionProtector(
                        server_key_type="AzureKeyVault"
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
                "prowler.providers.azure.services.sqlserver.sqlserver_tde_encrypted_with_cmk.sqlserver_tde_encrypted_with_cmk.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_tde_encrypted_with_cmk.sqlserver_tde_encrypted_with_cmk import (
                sqlserver_tde_encrypted_with_cmk,
            )

            check = sqlserver_tde_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has TDE disabled with CMK."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"

    def test_sql_servers_database_encryption_enabled(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        database = Database(
            id="id",
            name="name",
            type="type",
            location="location",
            managed_by="managed_by",
            tde_encryption=TransparentDataEncryption(status="Enabled"),
        )
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
                    databases=[database],
                    encryption_protector=EncryptionProtector(
                        server_key_type="AzureKeyVault"
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
                "prowler.providers.azure.services.sqlserver.sqlserver_tde_encrypted_with_cmk.sqlserver_tde_encrypted_with_cmk.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_tde_encrypted_with_cmk.sqlserver_tde_encrypted_with_cmk import (
                sqlserver_tde_encrypted_with_cmk,
            )

            check = sqlserver_tde_encrypted_with_cmk()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has TDE enabled with CMK."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == sql_server_name
            assert result[0].resource_id == sql_server_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_tde_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/sqlserver/sqlserver_tde_encryption_enabled/sqlserver_tde_encryption_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.sql.models import TransparentDataEncryption

from prowler.providers.azure.services.sqlserver.sqlserver_service import (
    Database,
    Server,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_sqlserver_tde_encryption_enabled:
    def test_no_sql_servers(self):
        sqlserver_client = mock.MagicMock
        sqlserver_client.sql_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.sqlserver.sqlserver_tde_encryption_enabled.sqlserver_tde_encryption_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_tde_encryption_enabled.sqlserver_tde_encryption_enabled import (
                sqlserver_tde_encryption_enabled,
            )

            check = sqlserver_tde_encryption_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_no_sql_servers_databases(self):
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
                "prowler.providers.azure.services.sqlserver.sqlserver_tde_encryption_enabled.sqlserver_tde_encryption_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_tde_encryption_enabled.sqlserver_tde_encryption_enabled import (
                sqlserver_tde_encryption_enabled,
            )

            check = sqlserver_tde_encryption_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_sql_servers_database_encryption_disabled(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        database_name = "Database Name"
        database_id = str(uuid4())
        database = Database(
            id=database_id,
            name=database_name,
            type="type",
            location="location",
            managed_by="managed_by",
            tde_encryption=TransparentDataEncryption(status="Disabled"),
        )
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
                    databases=[database],
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
                "prowler.providers.azure.services.sqlserver.sqlserver_tde_encryption_enabled.sqlserver_tde_encryption_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_tde_encryption_enabled.sqlserver_tde_encryption_enabled import (
                sqlserver_tde_encryption_enabled,
            )

            check = sqlserver_tde_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Database {database_name} from SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has TDE disabled"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == database_name
            assert result[0].resource_id == database_id
            assert result[0].location == "location"

    def test_sql_servers_database_encryption_enabled(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        database_name = "Database Name"
        database_id = str(uuid4())
        database = Database(
            id=database_id,
            name=database_name,
            type="type",
            location="location",
            managed_by="managed_by",
            tde_encryption=TransparentDataEncryption(status="Enabled"),
        )
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
                    databases=[database],
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
                "prowler.providers.azure.services.sqlserver.sqlserver_tde_encryption_enabled.sqlserver_tde_encryption_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_tde_encryption_enabled.sqlserver_tde_encryption_enabled import (
                sqlserver_tde_encryption_enabled,
            )

            check = sqlserver_tde_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Database {database_name} from SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has TDE enabled"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == database_name
            assert result[0].resource_id == database_id
            assert result[0].location == "location"

    def test_sql_servers_database_encryption_disabled_on_master_db(self):
        sqlserver_client = mock.MagicMock
        sql_server_name = "SQL Server Name"
        sql_server_id = str(uuid4())
        database_master_name = "MASTER"
        database_master_id = str(uuid4())
        database_master = Database(
            id=database_master_id,
            name=database_master_name,
            type="type",
            location="location",
            managed_by="managed_by",
            tde_encryption=TransparentDataEncryption(status="Disabled"),
        )
        database_name = "Database Name"
        database_id = str(uuid4())
        database = Database(
            id=database_id,
            name=database_name,
            type="type",
            location="location",
            managed_by="managed_by",
            tde_encryption=TransparentDataEncryption(status="Enabled"),
        )
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
                    databases=[database_master, database],
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
                "prowler.providers.azure.services.sqlserver.sqlserver_tde_encryption_enabled.sqlserver_tde_encryption_enabled.sqlserver_client",
                new=sqlserver_client,
            ),
        ):
            from prowler.providers.azure.services.sqlserver.sqlserver_tde_encryption_enabled.sqlserver_tde_encryption_enabled import (
                sqlserver_tde_encryption_enabled,
            )

            check = sqlserver_tde_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Database {database_name} from SQL Server {sql_server_name} from subscription {AZURE_SUBSCRIPTION_ID} has TDE enabled"
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == database_name
            assert result[0].resource_id == database_id
            assert result[0].location == "location"
```

--------------------------------------------------------------------------------

````
