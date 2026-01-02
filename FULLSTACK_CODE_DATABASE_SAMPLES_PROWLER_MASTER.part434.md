---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 434
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 434 of 867)

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

---[FILE: ram_no_root_access_key_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ram/ram_no_root_access_key/ram_no_root_access_key_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRamNoRootAccessKey:
    def test_root_has_keys_fails(self):
        provider = set_mocked_alibabacloud_provider()
        provider.identity.is_root = True
        ram_client = mock.MagicMock()
        ram_client.provider = provider
        ram_client.region = "cn-hangzhou"
        ram_client.audited_account = "1234567890"
        ram_client.root_access_keys = ["AKIA"]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=provider,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_no_root_access_key.ram_no_root_access_key.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_no_root_access_key.ram_no_root_access_key import (
                ram_no_root_access_key,
            )

            check = ram_no_root_access_key()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_root_without_keys_passes(self):
        provider = set_mocked_alibabacloud_provider()
        provider.identity.is_root = True
        ram_client = mock.MagicMock()
        ram_client.provider = provider
        ram_client.region = "cn-hangzhou"
        ram_client.audited_account = "1234567890"
        ram_client.root_access_keys = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=provider,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_no_root_access_key.ram_no_root_access_key.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_no_root_access_key.ram_no_root_access_key import (
                ram_no_root_access_key,
            )

            check = ram_no_root_access_key()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_lowercase_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ram/ram_password_policy_lowercase/ram_password_policy_lowercase_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRamPasswordPolicyLowercase:
    def test_lowercase_not_required_fails(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_lowercase.ram_password_policy_lowercase.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_lowercase.ram_password_policy_lowercase import (
                ram_password_policy_lowercase,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(
                require_lowercase_characters=False
            )

            check = ram_password_policy_lowercase()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_lowercase_required_passes(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_lowercase.ram_password_policy_lowercase.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_lowercase.ram_password_policy_lowercase import (
                ram_password_policy_lowercase,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(
                require_lowercase_characters=True
            )

            check = ram_password_policy_lowercase()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_max_login_attempts_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ram/ram_password_policy_max_login_attempts/ram_password_policy_max_login_attempts_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRamPasswordPolicyMaxLoginAttempts:
    def test_max_login_attempts_zero_fails(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_max_login_attempts.ram_password_policy_max_login_attempts.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_max_login_attempts.ram_password_policy_max_login_attempts import (
                ram_password_policy_max_login_attempts,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(max_login_attempts=0)

            check = ram_password_policy_max_login_attempts()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_max_login_attempts_within_or_above_limit_passes(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_max_login_attempts.ram_password_policy_max_login_attempts.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_max_login_attempts.ram_password_policy_max_login_attempts import (
                ram_password_policy_max_login_attempts,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(max_login_attempts=5)

            check = ram_password_policy_max_login_attempts()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_max_password_age_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ram/ram_password_policy_max_password_age/ram_password_policy_max_password_age_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRamPasswordPolicyMaxPasswordAge:
    def test_password_age_too_low_fails(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_max_password_age.ram_password_policy_max_password_age.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_max_password_age.ram_password_policy_max_password_age import (
                ram_password_policy_max_password_age,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(max_password_age=90)

            check = ram_password_policy_max_password_age()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_password_age_disabled_or_high_passes(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_max_password_age.ram_password_policy_max_password_age.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_max_password_age.ram_password_policy_max_password_age import (
                ram_password_policy_max_password_age,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(max_password_age=0)

            check = ram_password_policy_max_password_age()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_minimum_length_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ram/ram_password_policy_minimum_length/ram_password_policy_minimum_length_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRamPasswordPolicyMinimumLength:
    def test_policy_too_short_fails(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_minimum_length.ram_password_policy_minimum_length.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_minimum_length.ram_password_policy_minimum_length import (
                ram_password_policy_minimum_length,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(minimum_password_length=8)

            check = ram_password_policy_minimum_length()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                "less than the recommended 14 characters" in result[0].status_extended
            )

    def test_policy_long_enough_passes(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_minimum_length.ram_password_policy_minimum_length.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_minimum_length.ram_password_policy_minimum_length import (
                ram_password_policy_minimum_length,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(minimum_password_length=14)

            check = ram_password_policy_minimum_length()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "minimum length of 14 characters" in result[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_password_reuse_prevention_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ram/ram_password_policy_password_reuse_prevention/ram_password_policy_password_reuse_prevention_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRamPasswordPolicyPasswordReusePrevention:
    def test_reuse_prevention_too_low_fails(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_password_reuse_prevention.ram_password_policy_password_reuse_prevention.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_password_reuse_prevention.ram_password_policy_password_reuse_prevention import (
                ram_password_policy_password_reuse_prevention,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(password_reuse_prevention=0)

            check = ram_password_policy_password_reuse_prevention()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_reuse_prevention_set_passes(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_password_reuse_prevention.ram_password_policy_password_reuse_prevention.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_password_reuse_prevention.ram_password_policy_password_reuse_prevention import (
                ram_password_policy_password_reuse_prevention,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(password_reuse_prevention=5)

            check = ram_password_policy_password_reuse_prevention()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_symbol_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ram/ram_password_policy_symbol/ram_password_policy_symbol_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRamPasswordPolicySymbol:
    def test_symbols_not_required_fails(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_symbol.ram_password_policy_symbol.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_symbol.ram_password_policy_symbol import (
                ram_password_policy_symbol,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(require_symbols=False)

            check = ram_password_policy_symbol()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_symbols_required_passes(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_symbol.ram_password_policy_symbol.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_symbol.ram_password_policy_symbol import (
                ram_password_policy_symbol,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(require_symbols=True)

            check = ram_password_policy_symbol()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_uppercase_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ram/ram_password_policy_uppercase/ram_password_policy_uppercase_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRamPasswordPolicyUppercase:
    def test_uppercase_not_required_fails(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_uppercase.ram_password_policy_uppercase.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_uppercase.ram_password_policy_uppercase import (
                ram_password_policy_uppercase,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(
                require_uppercase_characters=False
            )

            check = ram_password_policy_uppercase()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_uppercase_required_passes(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_password_policy_uppercase.ram_password_policy_uppercase.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_password_policy_uppercase.ram_password_policy_uppercase import (
                ram_password_policy_uppercase,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                PasswordPolicy,
            )

            ram_client.password_policy = PasswordPolicy(
                require_uppercase_characters=True
            )

            check = ram_password_policy_uppercase()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ram_rotate_access_key_90_days_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ram/ram_rotate_access_key_90_days/ram_rotate_access_key_90_days_test.py

```python
from datetime import datetime, timedelta, timezone
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRamRotateAccessKey90Days:
    def test_old_access_key_fails(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_rotate_access_key_90_days.ram_rotate_access_key_90_days.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_rotate_access_key_90_days.ram_rotate_access_key_90_days import (
                ram_rotate_access_key_90_days,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                AccessKey,
                User,
            )

            access_key = AccessKey(
                access_key_id="AK1",
                status="Active",
                create_date=datetime.now(timezone.utc) - timedelta(days=120),
            )
            user = User(
                name="user1",
                user_id="u1",
                access_keys=[access_key],
            )
            ram_client.users = [user]

            check = ram_rotate_access_key_90_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_recent_access_key_passes(self):
        ram_client = mock.MagicMock()
        ram_client.audited_account = "1234567890"
        ram_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.ram.ram_rotate_access_key_90_days.ram_rotate_access_key_90_days.ram_client",
                new=ram_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.ram.ram_rotate_access_key_90_days.ram_rotate_access_key_90_days import (
                ram_rotate_access_key_90_days,
            )
            from prowler.providers.alibabacloud.services.ram.ram_service import (
                AccessKey,
                User,
            )

            access_key = AccessKey(
                access_key_id="AK2",
                status="Active",
                create_date=datetime.now(timezone.utc) - timedelta(days=10),
            )
            user = User(
                name="user2",
                user_id="u2",
                access_keys=[access_key],
            )
            ram_client.users = [user]

            check = ram_rotate_access_key_90_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: rds_service_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/rds/rds_service_test.py

```python
from unittest.mock import patch

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRDSService:
    def test_service(self):
        alibabacloud_provider = set_mocked_alibabacloud_provider()

        with patch(
            "prowler.providers.alibabacloud.services.rds.rds_service.RDS.__init__",
            return_value=None,
        ):
            from prowler.providers.alibabacloud.services.rds.rds_service import RDS

            rds_client = RDS(alibabacloud_provider)
            rds_client.service = "rds"
            rds_client.provider = alibabacloud_provider
            rds_client.regional_clients = {}

            assert rds_client.service == "rds"
            assert rds_client.provider == alibabacloud_provider
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_postgresql_log_connections_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/rds/rds_instance_postgresql_log_connections_enabled/rds_instance_postgresql_log_connections_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRdsInstancePostgresqlLogConnectionsEnabled:
    def test_log_connections_off_fails(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_postgresql_log_connections_enabled.rds_instance_postgresql_log_connections_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_postgresql_log_connections_enabled.rds_instance_postgresql_log_connections_enabled import (
                rds_instance_postgresql_log_connections_enabled,
            )
            from prowler.providers.alibabacloud.services.rds.rds_service import (
                DBInstance,
            )

            instance = DBInstance(
                id="db-1",
                name="db-1",
                region="cn-hangzhou",
                engine="PostgreSQL",
                engine_version="14",
                status="Running",
                type="Primary",
                net_type="VPC",
                connection_mode="Standard",
                public_connection_string="",
                ssl_enabled=True,
                tde_status="Enabled",
                tde_key_id="",
                security_ips=[],
                audit_log_enabled=True,
                audit_log_retention=365,
                log_connections="off",
                log_disconnections="",
                log_duration="",
            )
            rds_client.instances = [instance]

            check = rds_instance_postgresql_log_connections_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_log_connections_on_passes(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_postgresql_log_connections_enabled.rds_instance_postgresql_log_connections_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_postgresql_log_connections_enabled.rds_instance_postgresql_log_connections_enabled import (
                rds_instance_postgresql_log_connections_enabled,
            )
            from prowler.providers.alibabacloud.services.rds.rds_service import (
                DBInstance,
            )

            instance = DBInstance(
                id="db-2",
                name="db-2",
                region="cn-hangzhou",
                engine="PostgreSQL",
                engine_version="14",
                status="Running",
                type="Primary",
                net_type="VPC",
                connection_mode="Standard",
                public_connection_string="",
                ssl_enabled=True,
                tde_status="Enabled",
                tde_key_id="",
                security_ips=[],
                audit_log_enabled=True,
                audit_log_retention=365,
                log_connections="on",
                log_disconnections="",
                log_duration="",
            )
            rds_client.instances = [instance]

            check = rds_instance_postgresql_log_connections_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_sql_audit_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/rds/rds_instance_sql_audit_enabled/rds_instance_sql_audit_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRdsInstanceSqlAuditEnabled:
    def test_sql_audit_disabled_fails(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_sql_audit_enabled.rds_instance_sql_audit_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_sql_audit_enabled.rds_instance_sql_audit_enabled import (
                rds_instance_sql_audit_enabled,
            )
            from prowler.providers.alibabacloud.services.rds.rds_service import (
                DBInstance,
            )

            instance = DBInstance(
                id="db-1",
                name="db-1",
                region="cn-hangzhou",
                engine="MySQL",
                engine_version="8.0",
                status="Running",
                type="Primary",
                net_type="VPC",
                connection_mode="Standard",
                public_connection_string="",
                ssl_enabled=True,
                tde_status="Enabled",
                tde_key_id="",
                security_ips=[],
                audit_log_enabled=False,
                audit_log_retention=0,
                log_connections="",
                log_disconnections="",
                log_duration="",
            )
            rds_client.instances = [instance]

            check = rds_instance_sql_audit_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_sql_audit_enabled_passes(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_sql_audit_enabled.rds_instance_sql_audit_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_sql_audit_enabled.rds_instance_sql_audit_enabled import (
                rds_instance_sql_audit_enabled,
            )
            from prowler.providers.alibabacloud.services.rds.rds_service import (
                DBInstance,
            )

            instance = DBInstance(
                id="db-2",
                name="db-2",
                region="cn-hangzhou",
                engine="MySQL",
                engine_version="8.0",
                status="Running",
                type="Primary",
                net_type="VPC",
                connection_mode="Standard",
                public_connection_string="",
                ssl_enabled=True,
                tde_status="Enabled",
                tde_key_id="",
                security_ips=[],
                audit_log_enabled=True,
                audit_log_retention=7,
                log_connections="",
                log_disconnections="",
                log_duration="",
            )
            rds_client.instances = [instance]

            check = rds_instance_sql_audit_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_sql_audit_retention_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/rds/rds_instance_sql_audit_retention/rds_instance_sql_audit_retention_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRdsInstanceSqlAuditRetention:
    def test_enabled_short_retention_fails(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"
        rds_client.audit_config = {"min_rds_audit_retention_days": 180}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_sql_audit_retention.rds_instance_sql_audit_retention.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_sql_audit_retention.rds_instance_sql_audit_retention import (
                rds_instance_sql_audit_retention,
            )
            from prowler.providers.alibabacloud.services.rds.rds_service import (
                DBInstance,
            )

            instance = DBInstance(
                id="db-1",
                name="db-1",
                region="cn-hangzhou",
                engine="MySQL",
                engine_version="8.0",
                status="Running",
                type="Primary",
                net_type="VPC",
                connection_mode="Standard",
                public_connection_string="",
                ssl_enabled=True,
                tde_status="Enabled",
                tde_key_id="",
                security_ips=[],
                audit_log_enabled=True,
                audit_log_retention=30,
                log_connections="",
                log_disconnections="",
                log_duration="",
            )
            rds_client.instances = [instance]

            check = rds_instance_sql_audit_retention()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_enabled_long_retention_passes(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"
        rds_client.audit_config = {"min_rds_audit_retention_days": 180}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_sql_audit_retention.rds_instance_sql_audit_retention.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_sql_audit_retention.rds_instance_sql_audit_retention import (
                rds_instance_sql_audit_retention,
            )
            from prowler.providers.alibabacloud.services.rds.rds_service import (
                DBInstance,
            )

            instance = DBInstance(
                id="db-2",
                name="db-2",
                region="cn-hangzhou",
                engine="MySQL",
                engine_version="8.0",
                status="Running",
                type="Primary",
                net_type="VPC",
                connection_mode="Standard",
                public_connection_string="",
                ssl_enabled=True,
                tde_status="Enabled",
                tde_key_id="",
                security_ips=[],
                audit_log_enabled=True,
                audit_log_retention=365,
                log_connections="",
                log_disconnections="",
                log_duration="",
            )
            rds_client.instances = [instance]

            check = rds_instance_sql_audit_retention()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

````
