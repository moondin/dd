---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 435
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 435 of 867)

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

---[FILE: rds_instance_ssl_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/rds/rds_instance_ssl_enabled/rds_instance_ssl_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRdsInstanceSslEnabled:
    def test_instance_without_ssl_fails(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_ssl_enabled.rds_instance_ssl_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_ssl_enabled.rds_instance_ssl_enabled import (
                rds_instance_ssl_enabled,
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
                ssl_enabled=False,
                tde_status="Disabled",
                tde_key_id="",
                security_ips=[],
                audit_log_enabled=False,
                audit_log_retention=0,
                log_connections="",
                log_disconnections="",
                log_duration="",
            )
            rds_client.instances = [instance]

            check = rds_instance_ssl_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "does not have SSL encryption enabled" in result[0].status_extended

    def test_instance_with_ssl_passes(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_ssl_enabled.rds_instance_ssl_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_ssl_enabled.rds_instance_ssl_enabled import (
                rds_instance_ssl_enabled,
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
                audit_log_enabled=False,
                audit_log_retention=0,
                log_connections="",
                log_disconnections="",
                log_duration="",
            )
            rds_client.instances = [instance]

            check = rds_instance_ssl_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "has SSL encryption enabled" in result[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_tde_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/rds/rds_instance_tde_enabled/rds_instance_tde_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRdsInstanceTdeEnabled:
    def test_tde_disabled_fails(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_tde_enabled.rds_instance_tde_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_tde_enabled.rds_instance_tde_enabled import (
                rds_instance_tde_enabled,
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
                tde_status="Disabled",
                tde_key_id="",
                security_ips=[],
                audit_log_enabled=False,
                audit_log_retention=0,
                log_connections="",
                log_disconnections="",
                log_duration="",
            )
            rds_client.instances = [instance]

            check = rds_instance_tde_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_tde_enabled_passes(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_tde_enabled.rds_instance_tde_enabled.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_tde_enabled.rds_instance_tde_enabled import (
                rds_instance_tde_enabled,
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
                audit_log_enabled=False,
                audit_log_retention=0,
                log_connections="",
                log_disconnections="",
                log_duration="",
            )
            rds_client.instances = [instance]

            check = rds_instance_tde_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_tde_key_custom_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/rds/rds_instance_tde_key_custom/rds_instance_tde_key_custom_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestRdsInstanceTdeKeyCustom:
    def test_tde_enabled_service_key_fails(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_tde_key_custom.rds_instance_tde_key_custom.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_tde_key_custom.rds_instance_tde_key_custom import (
                rds_instance_tde_key_custom,
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

            check = rds_instance_tde_key_custom()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_tde_enabled_custom_key_passes(self):
        rds_client = mock.MagicMock()
        rds_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.rds.rds_instance_tde_key_custom.rds_instance_tde_key_custom.rds_client",
                new=rds_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.rds.rds_instance_tde_key_custom.rds_instance_tde_key_custom import (
                rds_instance_tde_key_custom,
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
                tde_key_id="kms-key-id",
                security_ips=[],
                audit_log_enabled=False,
                audit_log_retention=0,
                log_connections="",
                log_disconnections="",
                log_duration="",
            )
            rds_client.instances = [instance]

            check = rds_instance_tde_key_custom()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: securitycenter_service_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/securitycenter/securitycenter_service_test.py

```python
from unittest.mock import patch

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestSecurityCenterService:
    def test_service(self):
        alibabacloud_provider = set_mocked_alibabacloud_provider()

        with patch(
            "prowler.providers.alibabacloud.services.securitycenter.securitycenter_service.SecurityCenter.__init__",
            return_value=None,
        ):
            from prowler.providers.alibabacloud.services.securitycenter.securitycenter_service import (
                SecurityCenter,
            )

            securitycenter_client = SecurityCenter(alibabacloud_provider)
            securitycenter_client.service = "securitycenter"
            securitycenter_client.provider = alibabacloud_provider
            securitycenter_client.regional_clients = {}

            assert securitycenter_client.service == "securitycenter"
            assert securitycenter_client.provider == alibabacloud_provider
```

--------------------------------------------------------------------------------

---[FILE: securitycenter_all_assets_agent_installed_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/securitycenter/securitycenter_all_assets_agent_installed/securitycenter_all_assets_agent_installed_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestSecurityCenterAllAssetsAgentInstalled:
    def test_uninstalled_assets_fail(self):
        securitycenter_client = mock.MagicMock()
        securitycenter_client.audited_account = "1234567890"
        securitycenter_client.region = "cn-hangzhou"

        uninstalled = mock.MagicMock()
        uninstalled.instance_id = "i-1"
        uninstalled.instance_name = "asset1"
        uninstalled.region = "cn-hangzhou"
        uninstalled.os = "Linux"
        securitycenter_client.uninstalled_machines = [uninstalled]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.securitycenter.securitycenter_all_assets_agent_installed.securitycenter_all_assets_agent_installed.securitycenter_client",
                new=securitycenter_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.securitycenter.securitycenter_all_assets_agent_installed.securitycenter_all_assets_agent_installed import (
                securitycenter_all_assets_agent_installed,
            )

            check = securitycenter_all_assets_agent_installed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_all_assets_installed_passes(self):
        securitycenter_client = mock.MagicMock()
        securitycenter_client.audited_account = "1234567890"
        securitycenter_client.region = "cn-hangzhou"
        securitycenter_client.uninstalled_machines = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.securitycenter.securitycenter_all_assets_agent_installed.securitycenter_all_assets_agent_installed.securitycenter_client",
                new=securitycenter_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.securitycenter.securitycenter_all_assets_agent_installed.securitycenter_all_assets_agent_installed import (
                securitycenter_all_assets_agent_installed,
            )

            check = securitycenter_all_assets_agent_installed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: securitycenter_vulnerability_scan_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/securitycenter/securitycenter_vulnerability_scan_enabled/securitycenter_vulnerability_scan_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class DummyConfig:
    def __init__(self, enabled: bool):
        self.enabled = enabled


class TestSecurityCenterVulnerabilityScanEnabled:
    def test_missing_types_or_levels_fail(self):
        securitycenter_client = mock.MagicMock()
        securitycenter_client.audited_account = "1234567890"
        securitycenter_client.region = "cn-hangzhou"
        securitycenter_client.vul_configs = {
            "yum": DummyConfig(enabled=True),
            "cve": DummyConfig(enabled=False),
        }
        securitycenter_client.concern_necessity = ["asap"]  # missing "later"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.securitycenter.securitycenter_vulnerability_scan_enabled.securitycenter_vulnerability_scan_enabled.securitycenter_client",
                new=securitycenter_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.securitycenter.securitycenter_vulnerability_scan_enabled.securitycenter_vulnerability_scan_enabled import (
                securitycenter_vulnerability_scan_enabled,
            )

            check = securitycenter_vulnerability_scan_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_all_types_and_levels_pass(self):
        securitycenter_client = mock.MagicMock()
        securitycenter_client.audited_account = "1234567890"
        securitycenter_client.region = "cn-hangzhou"
        securitycenter_client.vul_configs = {
            key: DummyConfig(enabled=True)
            for key in ["yum", "cve", "sys", "cms", "emg"]
        }
        securitycenter_client.concern_necessity = ["asap", "later"]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.securitycenter.securitycenter_vulnerability_scan_enabled.securitycenter_vulnerability_scan_enabled.securitycenter_client",
                new=securitycenter_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.securitycenter.securitycenter_vulnerability_scan_enabled.securitycenter_vulnerability_scan_enabled import (
                securitycenter_vulnerability_scan_enabled,
            )

            check = securitycenter_vulnerability_scan_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: sls_service_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/sls/sls_service_test.py

```python
from unittest.mock import patch

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestSLSService:
    def test_service(self):
        alibabacloud_provider = set_mocked_alibabacloud_provider()

        with patch(
            "prowler.providers.alibabacloud.services.sls.sls_service.Sls.__init__",
            return_value=None,
        ):
            from prowler.providers.alibabacloud.services.sls.sls_service import Sls

            sls_client = Sls(alibabacloud_provider)
            sls_client.service = "sls"
            sls_client.provider = alibabacloud_provider
            sls_client.regional_clients = {}

            assert sls_client.service == "sls"
            assert sls_client.provider == alibabacloud_provider
```

--------------------------------------------------------------------------------

---[FILE: sls_logstore_retention_period_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/sls/sls_logstore_retention_period/sls_logstore_retention_period_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestSlsLogstoreRetentionPeriod:
    def test_short_retention_fails(self):
        sls_client = mock.MagicMock()
        sls_client.audit_config = {"min_log_retention_days": 365}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.sls.sls_logstore_retention_period.sls_logstore_retention_period.sls_client",
                new=sls_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.sls.sls_logstore_retention_period.sls_logstore_retention_period import (
                sls_logstore_retention_period,
            )
            from prowler.providers.alibabacloud.services.sls.sls_service import LogStore

            logstore = LogStore(
                name="short",
                project="proj",
                retention_forever=False,
                retention_days=90,
                region="cn-hangzhou",
                arn="arn:log:short",
            )
            sls_client.log_stores = [logstore]
            sls_client.provider = set_mocked_alibabacloud_provider()

            check = sls_logstore_retention_period()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "less than" in result[0].status_extended

    def test_long_retention_passes(self):
        sls_client = mock.MagicMock()
        sls_client.audit_config = {"min_log_retention_days": 365}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.sls.sls_logstore_retention_period.sls_logstore_retention_period.sls_client",
                new=sls_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.sls.sls_logstore_retention_period.sls_logstore_retention_period import (
                sls_logstore_retention_period,
            )
            from prowler.providers.alibabacloud.services.sls.sls_service import LogStore

            logstore = LogStore(
                name="long",
                project="proj",
                retention_forever=False,
                retention_days=400,
                region="cn-hangzhou",
                arn="arn:log:long",
            )
            sls_client.log_stores = [logstore]
            sls_client.provider = set_mocked_alibabacloud_provider()

            check = sls_logstore_retention_period()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "retention set to 400 days" in result[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: sls_management_console_authentication_failures_alert_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/sls/sls_management_console_authentication_failures_alert_enabled/sls_management_console_authentication_failures_alert_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestSlsManagementConsoleAuthenticationFailuresAlertEnabled:
    def test_alert_present_passes(self):
        sls_client = mock.MagicMock()
        sls_client.provider = set_mocked_alibabacloud_provider()
        sls_client.audited_account = "1234567890"
        alert = mock.MagicMock()
        alert.name = "auth-failures"
        alert.arn = "arn:log:alert/auth-failures"
        alert.region = "cn-hangzhou"
        alert.configuration = {
            "queryList": [{"query": "ConsoleSignin | event.errorCode"}]
        }
        sls_client.alerts = [alert]
        sls_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=sls_client.provider,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.sls.sls_management_console_authentication_failures_alert_enabled.sls_management_console_authentication_failures_alert_enabled.sls_client",
                new=sls_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.sls.sls_management_console_authentication_failures_alert_enabled.sls_management_console_authentication_failures_alert_enabled import (
                sls_management_console_authentication_failures_alert_enabled,
            )

            check = sls_management_console_authentication_failures_alert_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"

    def test_no_alert_fails(self):
        sls_client = mock.MagicMock()
        sls_client.provider = set_mocked_alibabacloud_provider()
        sls_client.audited_account = "1234567890"
        sls_client.alerts = []
        sls_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=sls_client.provider,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.sls.sls_management_console_authentication_failures_alert_enabled.sls_management_console_authentication_failures_alert_enabled.sls_client",
                new=sls_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.sls.sls_management_console_authentication_failures_alert_enabled.sls_management_console_authentication_failures_alert_enabled import (
                sls_management_console_authentication_failures_alert_enabled,
            )

            check = sls_management_console_authentication_failures_alert_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
```

--------------------------------------------------------------------------------

---[FILE: sls_management_console_signin_without_mfa_alert_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/sls/sls_management_console_signin_without_mfa_alert_enabled/sls_management_console_signin_without_mfa_alert_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestSlsManagementConsoleSigninWithoutMfaAlertEnabled:
    def test_alert_present_passes(self):
        sls_client = mock.MagicMock()
        sls_client.provider = set_mocked_alibabacloud_provider()
        sls_client.audited_account = "1234567890"
        alert = mock.MagicMock()
        alert.name = "signin-without-mfa"
        alert.arn = "arn:log:alert/signin-without-mfa"
        alert.region = "cn-hangzhou"
        alert.configuration = {
            "queryList": [{"query": "ConsoleSignin | addionalEventData.loginAccount"}]
        }
        sls_client.alerts = [alert]
        sls_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=sls_client.provider,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.sls.sls_management_console_signin_without_mfa_alert_enabled.sls_management_console_signin_without_mfa_alert_enabled.sls_client",
                new=sls_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.sls.sls_management_console_signin_without_mfa_alert_enabled.sls_management_console_signin_without_mfa_alert_enabled import (
                sls_management_console_signin_without_mfa_alert_enabled,
            )

            check = sls_management_console_signin_without_mfa_alert_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"

    def test_no_alert_fails(self):
        sls_client = mock.MagicMock()
        sls_client.provider = set_mocked_alibabacloud_provider()
        sls_client.audited_account = "1234567890"
        sls_client.alerts = []
        sls_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=sls_client.provider,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.sls.sls_management_console_signin_without_mfa_alert_enabled.sls_management_console_signin_without_mfa_alert_enabled.sls_client",
                new=sls_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.sls.sls_management_console_signin_without_mfa_alert_enabled.sls_management_console_signin_without_mfa_alert_enabled import (
                sls_management_console_signin_without_mfa_alert_enabled,
            )

            check = sls_management_console_signin_without_mfa_alert_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
```

--------------------------------------------------------------------------------

---[FILE: sls_root_account_usage_alert_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/sls/sls_root_account_usage_alert_enabled/sls_root_account_usage_alert_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestSlsRootAccountUsageAlertEnabled:
    def test_alert_present_passes(self):
        sls_client = mock.MagicMock()
        sls_client.provider = set_mocked_alibabacloud_provider()
        sls_client.audited_account = "1234567890"
        alert = mock.MagicMock()
        alert.name = "root-usage"
        alert.arn = "arn:log:alert/root-usage"
        alert.region = "cn-hangzhou"
        alert.configuration = {
            "queryList": [
                {
                    "query": "ConsoleSignin | event.userIdentity.type: root-account",
                }
            ]
        }
        sls_client.alerts = [alert]
        sls_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=sls_client.provider,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.sls.sls_root_account_usage_alert_enabled.sls_root_account_usage_alert_enabled.sls_client",
                new=sls_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.sls.sls_root_account_usage_alert_enabled.sls_root_account_usage_alert_enabled import (
                sls_root_account_usage_alert_enabled,
            )

            check = sls_root_account_usage_alert_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"

    def test_no_alert_fails(self):
        sls_client = mock.MagicMock()
        sls_client.provider = set_mocked_alibabacloud_provider()
        sls_client.audited_account = "1234567890"
        sls_client.alerts = []
        sls_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=sls_client.provider,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.sls.sls_root_account_usage_alert_enabled.sls_root_account_usage_alert_enabled.sls_client",
                new=sls_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.sls.sls_root_account_usage_alert_enabled.sls_root_account_usage_alert_enabled import (
                sls_root_account_usage_alert_enabled,
            )

            check = sls_root_account_usage_alert_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
```

--------------------------------------------------------------------------------

---[FILE: sls_unauthorized_api_calls_alert_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/sls/sls_unauthorized_api_calls_alert_enabled/sls_unauthorized_api_calls_alert_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestSlsUnauthorizedApiCallsAlertEnabled:
    def test_alert_present_passes(self):
        sls_client = mock.MagicMock()
        sls_client.provider = set_mocked_alibabacloud_provider()
        sls_client.audited_account = "1234567890"
        alert = mock.MagicMock()
        alert.name = "unauth-api"
        alert.arn = "arn:log:alert/unauth"
        alert.region = "cn-hangzhou"
        alert.configuration = {
            "queryList": [{"query": "ApiCall | NoPermission"}],
        }
        sls_client.alerts = [alert]
        sls_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.sls.sls_unauthorized_api_calls_alert_enabled.sls_unauthorized_api_calls_alert_enabled.sls_client",
                new=sls_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.sls.sls_unauthorized_api_calls_alert_enabled.sls_unauthorized_api_calls_alert_enabled import (
                sls_unauthorized_api_calls_alert_enabled,
            )

            check = sls_unauthorized_api_calls_alert_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "configured for unauthorized API calls" in result[0].status_extended

    def test_no_alert_fails(self):
        sls_client = mock.MagicMock()
        sls_client.provider = set_mocked_alibabacloud_provider()
        sls_client.audited_account = "1234567890"
        sls_client.alerts = []
        sls_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.sls.sls_unauthorized_api_calls_alert_enabled.sls_unauthorized_api_calls_alert_enabled.sls_client",
                new=sls_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.sls.sls_unauthorized_api_calls_alert_enabled.sls_unauthorized_api_calls_alert_enabled import (
                sls_unauthorized_api_calls_alert_enabled,
            )

            check = sls_unauthorized_api_calls_alert_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "No SLS Alert configured" in result[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: vpc_service_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/vpc/vpc_service_test.py

```python
from unittest.mock import patch

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestVPCService:
    def test_service(self):
        alibabacloud_provider = set_mocked_alibabacloud_provider()

        with patch(
            "prowler.providers.alibabacloud.services.vpc.vpc_service.VPC.__init__",
            return_value=None,
        ):
            from prowler.providers.alibabacloud.services.vpc.vpc_service import VPC

            vpc_client = VPC(alibabacloud_provider)
            vpc_client.service = "vpc"
            vpc_client.provider = alibabacloud_provider
            vpc_client.regional_clients = {}

            assert vpc_client.service == "vpc"
            assert vpc_client.provider == alibabacloud_provider
```

--------------------------------------------------------------------------------

---[FILE: vpc_flow_logs_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/vpc/vpc_flow_logs_enabled/vpc_flow_logs_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestVPCFlowLogsEnabled:
    def test_vpc_without_flow_logs_fails(self):
        vpc_client = mock.MagicMock()
        vpc_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled import (
                vpc_flow_logs_enabled,
            )
            from prowler.providers.alibabacloud.services.vpc.vpc_service import VPCs

            vpc = VPCs(
                id="vpc-1",
                name="vpc-1",
                region="cn-hangzhou",
                cidr_block="10.0.0.0/16",
                flow_log_enabled=False,
            )
            vpc_client.vpcs = {vpc.id: vpc}

            check = vpc_flow_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "does not have flow logs enabled" in result[0].status_extended

    def test_vpc_with_flow_logs_passes(self):
        vpc_client = mock.MagicMock()
        vpc_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled import (
                vpc_flow_logs_enabled,
            )
            from prowler.providers.alibabacloud.services.vpc.vpc_service import VPCs

            vpc = VPCs(
                id="vpc-2",
                name="vpc-2",
                region="cn-hangzhou",
                cidr_block="10.1.0.0/16",
                flow_log_enabled=True,
            )
            vpc_client.vpcs = {vpc.id: vpc}

            check = vpc_flow_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "has flow logs enabled" in result[0].status_extended
```

--------------------------------------------------------------------------------

````
