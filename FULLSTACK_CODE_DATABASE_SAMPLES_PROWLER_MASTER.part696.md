---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 696
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 696 of 867)

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

---[FILE: cloudsql_instance_postgres_log_statement_flag_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_statement_flag/cloudsql_instance_postgres_log_statement_flag_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_cloudsql_instance_postgres_log_statement_flag:
    def test_no_cloudsql_instances(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_postgres_log_statement_flag.cloudsql_instance_postgres_log_statement_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_postgres_log_statement_flag.cloudsql_instance_postgres_log_statement_flag import (
                cloudsql_instance_postgres_log_statement_flag,
            )

            cloudsql_client.instances = []

            check = cloudsql_instance_postgres_log_statement_flag()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_mysql_instance(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_postgres_log_statement_flag.cloudsql_instance_postgres_log_statement_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_postgres_log_statement_flag.cloudsql_instance_postgres_log_statement_flag import (
                cloudsql_instance_postgres_log_statement_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="MYSQL_5_7",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_postgres_log_statement_flag()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_instance_no_flags(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_postgres_log_statement_flag.cloudsql_instance_postgres_log_statement_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_postgres_log_statement_flag.cloudsql_instance_postgres_log_statement_flag import (
                cloudsql_instance_postgres_log_statement_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_postgres_log_statement_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "PostgreSQL Instance instance1 does not have 'log_statement' flag set to 'ddl'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_log_statement_flag_off(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_postgres_log_statement_flag.cloudsql_instance_postgres_log_statement_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_postgres_log_statement_flag.cloudsql_instance_postgres_log_statement_flag import (
                cloudsql_instance_postgres_log_statement_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[{"name": "log_statement", "value": "all"}],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_postgres_log_statement_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "PostgreSQL Instance instance1 does not have 'log_statement' flag set to 'ddl'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_log_statement_flag_on(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_postgres_log_statement_flag.cloudsql_instance_postgres_log_statement_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_postgres_log_statement_flag.cloudsql_instance_postgres_log_statement_flag import (
                cloudsql_instance_postgres_log_statement_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[{"name": "log_statement", "value": "ddl"}],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_postgres_log_statement_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "PostgreSQL Instance instance1 has 'log_statement' flag set to 'ddl'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_public_access_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudsql/cloudsql_instance_public_access/cloudsql_instance_public_access_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_cloudsql_instance_public_access:
    def test_no_cloudsql_instances(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_access.cloudsql_instance_public_access.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_access.cloudsql_instance_public_access import (
                cloudsql_instance_public_access,
            )

            cloudsql_client.instances = []

            check = cloudsql_instance_public_access()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_instance_no_public_access(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_access.cloudsql_instance_public_access.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_access.cloudsql_instance_public_access import (
                cloudsql_instance_public_access,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[{"value": "192.168.1.1/32"}],
                    project_id=GCP_PROJECT_ID,
                    flags=[],
                )
            ]

            check = cloudsql_instance_public_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Database Instance instance1 does not whitelist all Public IP Addresses."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_public_access(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_access.cloudsql_instance_public_access.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_access.cloudsql_instance_public_access import (
                cloudsql_instance_public_access,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[{"value": "0.0.0.0/0"}],
                    project_id=GCP_PROJECT_ID,
                    flags=[],
                )
            ]

            check = cloudsql_instance_public_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Database Instance instance1 whitelist all Public IP Addresses."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_public_ip_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudsql/cloudsql_instance_public_ip/cloudsql_instance_public_ip_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_cloudsql_instance_public_ip:
    def test_no_cloudsql_instances(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_ip.cloudsql_instance_public_ip.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_ip.cloudsql_instance_public_ip import (
                cloudsql_instance_public_ip,
            )

            cloudsql_client.instances = []

            check = cloudsql_instance_public_ip()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_instance_no_public_ip(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_ip.cloudsql_instance_public_ip.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_ip.cloudsql_instance_public_ip import (
                cloudsql_instance_public_ip,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_public_ip()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Database Instance instance1 does not have a public IP."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_public_ip(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_ip.cloudsql_instance_public_ip.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_public_ip.cloudsql_instance_public_ip import (
                cloudsql_instance_public_ip,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=True,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_public_ip()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Database Instance instance1 has a public IP."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_contained_database_authentication_flag_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_contained_database_authentication_flag/cloudsql_instance_sqlserver_contained_database_authentication_flag_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_cloudsql_instance_sqlserver_contained_database_authentication_flag:
    def test_no_cloudsql_instances(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_instance_sqlserver_contained_database_authentication_flag import (
                cloudsql_instance_sqlserver_contained_database_authentication_flag,
            )

            cloudsql_client.instances = []

            check = cloudsql_instance_sqlserver_contained_database_authentication_flag()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_postgres_instance(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_instance_sqlserver_contained_database_authentication_flag import (
                cloudsql_instance_sqlserver_contained_database_authentication_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_contained_database_authentication_flag()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_instance_no_flags(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_instance_sqlserver_contained_database_authentication_flag import (
                cloudsql_instance_sqlserver_contained_database_authentication_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="SQLSERVER_2019_STANDARD",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_contained_database_authentication_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "SQL Server Instance instance1 has 'contained database authentication' flag set to 'off'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_contained_database_authentication_flag_on(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_instance_sqlserver_contained_database_authentication_flag import (
                cloudsql_instance_sqlserver_contained_database_authentication_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="SQLSERVER_2019_STANDARD",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[
                        {"name": "contained database authentication", "value": "on"}
                    ],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_contained_database_authentication_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "SQL Server Instance instance1 has 'contained database authentication' flag set to 'on'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_contained_database_authentication_flag_off(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_contained_database_authentication_flag.cloudsql_instance_sqlserver_contained_database_authentication_flag import (
                cloudsql_instance_sqlserver_contained_database_authentication_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="SQLSERVER_2019_STANDARD",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[
                        {"name": "contained database authentication", "value": "off"}
                    ],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_contained_database_authentication_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "SQL Server Instance instance1 has 'contained database authentication' flag set to 'off'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag/cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag:
    def test_no_cloudsql_instances(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag import (
                cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag,
            )

            cloudsql_client.instances = []

            check = cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_postgres_instance(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag import (
                cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_instance_no_flags(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag import (
                cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="SQLSERVER_2019_STANDARD",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "SQL Server Instance instance1 has 'cross db ownership chaining' flag set to 'off'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_cross_db_ownership_flag_on(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag import (
                cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="SQLSERVER_2019",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[{"name": "cross db ownership chaining", "value": "on"}],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "SQL Server Instance instance1 does not have 'cross db ownership chaining' flag set to 'off'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_cross_db_ownership_flag_off(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag import (
                cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="SQLSERVER_2019",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[{"name": "cross db ownership chaining", "value": "off"}],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "SQL Server Instance instance1 has 'cross db ownership chaining' flag set to 'off'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

````
