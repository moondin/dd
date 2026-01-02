---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 432
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 432 of 867)

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

---[FILE: actiontrail_oss_bucket_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/actiontrail/actiontrail_oss_bucket_not_publicly_accessible/actiontrail_oss_bucket_not_publicly_accessible_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestActionTrailOssBucketNotPubliclyAccessible:
    def test_bucket_missing_marks_manual(self):
        actiontrail_client = mock.MagicMock()
        actiontrail_client.audited_account = "1234567890"
        actiontrail_client.trails = {}
        missing_trail = mock.MagicMock()
        missing_trail.name = "trail-arn"
        missing_trail.oss_bucket_name = "missing-bucket"
        missing_trail.home_region = "cn-hangzhou"
        actiontrail_client.trails["trail-arn"] = missing_trail

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.actiontrail.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_client",
                new=actiontrail_client,
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.actiontrail.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_oss_bucket_not_publicly_accessible.oss_client",
                new=mock.MagicMock(buckets={}),
            ),
        ):
            from prowler.providers.alibabacloud.services.actiontrail.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_oss_bucket_not_publicly_accessible import (
                actiontrail_oss_bucket_not_publicly_accessible,
            )

            check = actiontrail_oss_bucket_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "MANUAL"
            assert "could not be found" in result[0].status_extended

    def test_public_bucket_fails(self):
        actiontrail_client = mock.MagicMock()
        actiontrail_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.actiontrail.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_client",
                new=actiontrail_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.actiontrail.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_oss_bucket_not_publicly_accessible import (
                actiontrail_oss_bucket_not_publicly_accessible,
            )
            from prowler.providers.alibabacloud.services.actiontrail.actiontrail_service import (
                Trail,
            )
            from prowler.providers.alibabacloud.services.oss.oss_service import Bucket

            trail = Trail(
                arn="acs:actiontrail::1234567890:trail/trail1",
                name="trail1",
                home_region="cn-hangzhou",
                trail_region="All",
                status="Enable",
                oss_bucket_name="public-bucket",
                oss_bucket_location="cn-hangzhou",
                sls_project_arn="",
                event_rw="All",
            )
            actiontrail_client.trails = {trail.arn: trail}

            bucket = Bucket(
                arn="acs:oss::1234567890:public-bucket",
                name="public-bucket",
                region="cn-hangzhou",
                acl="public-read",
                policy={},
            )

            oss_client = mock.MagicMock()
            oss_client.buckets = {bucket.arn: bucket}

            with mock.patch(
                "prowler.providers.alibabacloud.services.actiontrail.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_oss_bucket_not_publicly_accessible.oss_client",
                new=oss_client,
            ):
                check = actiontrail_oss_bucket_not_publicly_accessible()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert "publicly accessible" in result[0].status_extended

    def test_private_bucket_passes(self):
        actiontrail_client = mock.MagicMock()
        actiontrail_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.actiontrail.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_client",
                new=actiontrail_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.actiontrail.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_oss_bucket_not_publicly_accessible import (
                actiontrail_oss_bucket_not_publicly_accessible,
            )
            from prowler.providers.alibabacloud.services.actiontrail.actiontrail_service import (
                Trail,
            )
            from prowler.providers.alibabacloud.services.oss.oss_service import Bucket

            trail = Trail(
                arn="acs:actiontrail::1234567890:trail/trail1",
                name="trail1",
                home_region="cn-hangzhou",
                trail_region="All",
                status="Enable",
                oss_bucket_name="private-bucket",
                oss_bucket_location="cn-hangzhou",
                sls_project_arn="",
                event_rw="All",
            )
            actiontrail_client.trails = {trail.arn: trail}

            bucket = Bucket(
                arn="acs:oss::1234567890:private-bucket",
                name="private-bucket",
                region="cn-hangzhou",
                acl="private",
                policy={},
            )

            oss_client = mock.MagicMock()
            oss_client.buckets = {bucket.arn: bucket}

            with mock.patch(
                "prowler.providers.alibabacloud.services.actiontrail.actiontrail_oss_bucket_not_publicly_accessible.actiontrail_oss_bucket_not_publicly_accessible.oss_client",
                new=oss_client,
            ):
                check = actiontrail_oss_bucket_not_publicly_accessible()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert "not publicly accessible" in result[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: cs_service_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/cs/cs_service_test.py

```python
from unittest.mock import patch

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestCSService:
    def test_service(self):
        alibabacloud_provider = set_mocked_alibabacloud_provider()

        with patch(
            "prowler.providers.alibabacloud.services.cs.cs_service.CS.__init__",
            return_value=None,
        ):
            from prowler.providers.alibabacloud.services.cs.cs_service import CS

            cs_client = CS(alibabacloud_provider)
            cs_client.service = "cs"
            cs_client.provider = alibabacloud_provider
            cs_client.regional_clients = {}

            assert cs_client.service == "cs"
            assert cs_client.provider == alibabacloud_provider
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_cloudmonitor_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/cs/cs_kubernetes_cloudmonitor_enabled/cs_kubernetes_cloudmonitor_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestCSKubernetesCloudmonitorEnabled:
    def test_cloudmonitor_disabled_fails(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_cloudmonitor_enabled.cs_kubernetes_cloudmonitor_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_cloudmonitor_enabled.cs_kubernetes_cloudmonitor_enabled import (
                cs_kubernetes_cloudmonitor_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c1",
                name="c1",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                cloudmonitor_enabled=False,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_cloudmonitor_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                "does not have CloudMonitor Agent enabled" in result[0].status_extended
            )

    def test_cloudmonitor_enabled_passes(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_cloudmonitor_enabled.cs_kubernetes_cloudmonitor_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_cloudmonitor_enabled.cs_kubernetes_cloudmonitor_enabled import (
                cs_kubernetes_cloudmonitor_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c2",
                name="c2",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                cloudmonitor_enabled=True,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_cloudmonitor_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "CloudMonitor Agent enabled" in result[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_cluster_check_recent_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/cs/cs_kubernetes_cluster_check_recent/cs_kubernetes_cluster_check_recent_test.py

```python
from datetime import datetime, timedelta, timezone
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestCSKubernetesClusterCheckRecent:
    def test_cluster_check_stale_fails(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"
        cs_client.audit_config = {"max_cluster_check_days": 7}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_cluster_check_recent.cs_kubernetes_cluster_check_recent.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_cluster_check_recent.cs_kubernetes_cluster_check_recent import (
                cs_kubernetes_cluster_check_recent,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c1",
                name="c1",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                last_check_time=datetime.now(timezone.utc) - timedelta(days=10),
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_cluster_check_recent()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_cluster_check_recent_passes(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"
        cs_client.audit_config = {"max_cluster_check_days": 7}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_cluster_check_recent.cs_kubernetes_cluster_check_recent.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_cluster_check_recent.cs_kubernetes_cluster_check_recent import (
                cs_kubernetes_cluster_check_recent,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c2",
                name="c2",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                last_check_time=datetime.now(timezone.utc) - timedelta(days=3),
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_cluster_check_recent()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_cluster_check_weekly_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/cs/cs_kubernetes_cluster_check_weekly/cs_kubernetes_cluster_check_weekly_test.py

```python
from datetime import datetime, timedelta, timezone
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestCSKubernetesClusterCheckWeekly:
    def test_cluster_check_stale_fails(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"
        cs_client.audit_config = {"max_cluster_check_days": 7}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_cluster_check_weekly.cs_kubernetes_cluster_check_weekly.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_cluster_check_weekly.cs_kubernetes_cluster_check_weekly import (
                cs_kubernetes_cluster_check_weekly,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c1",
                name="c1",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                last_check_time=datetime.now(timezone.utc) - timedelta(days=15),
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_cluster_check_weekly()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_cluster_check_recent_passes(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"
        cs_client.audit_config = {"max_cluster_check_days": 7}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_cluster_check_weekly.cs_kubernetes_cluster_check_weekly.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_cluster_check_weekly.cs_kubernetes_cluster_check_weekly import (
                cs_kubernetes_cluster_check_weekly,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c2",
                name="c2",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                last_check_time=datetime.now(timezone.utc) - timedelta(days=2),
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_cluster_check_weekly()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_dashboard_disabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/cs/cs_kubernetes_dashboard_disabled/cs_kubernetes_dashboard_disabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestCSKubernetesDashboardDisabled:
    def test_dashboard_enabled_fails(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_dashboard_disabled.cs_kubernetes_dashboard_disabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_dashboard_disabled.cs_kubernetes_dashboard_disabled import (
                cs_kubernetes_dashboard_disabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c1",
                name="c1",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                dashboard_enabled=True,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_dashboard_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "Kubernetes Dashboard enabled" in result[0].status_extended

    def test_dashboard_disabled_passes(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_dashboard_disabled.cs_kubernetes_dashboard_disabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_dashboard_disabled.cs_kubernetes_dashboard_disabled import (
                cs_kubernetes_dashboard_disabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c2",
                name="c2",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                dashboard_enabled=False,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_dashboard_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                "does not have the Kubernetes Dashboard enabled"
                in result[0].status_extended
            )
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_eni_multiple_ip_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/cs/cs_kubernetes_eni_multiple_ip_enabled/cs_kubernetes_eni_multiple_ip_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestCSKubernetesEniMultipleIpEnabled:
    def test_eni_multiple_ip_disabled_fails(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_eni_multiple_ip_enabled.cs_kubernetes_eni_multiple_ip_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_eni_multiple_ip_enabled.cs_kubernetes_eni_multiple_ip_enabled import (
                cs_kubernetes_eni_multiple_ip_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c1",
                name="c1",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                eni_multiple_ip_enabled=False,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_eni_multiple_ip_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_eni_multiple_ip_enabled_passes(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_eni_multiple_ip_enabled.cs_kubernetes_eni_multiple_ip_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_eni_multiple_ip_enabled.cs_kubernetes_eni_multiple_ip_enabled import (
                cs_kubernetes_eni_multiple_ip_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c2",
                name="c2",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                eni_multiple_ip_enabled=True,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_eni_multiple_ip_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_log_service_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/cs/cs_kubernetes_log_service_enabled/cs_kubernetes_log_service_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestCSKubernetesLogServiceEnabled:
    def test_log_service_disabled_fails(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_log_service_enabled.cs_kubernetes_log_service_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_log_service_enabled.cs_kubernetes_log_service_enabled import (
                cs_kubernetes_log_service_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c1",
                name="c1",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                log_service_enabled=False,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_log_service_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_log_service_enabled_passes(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_log_service_enabled.cs_kubernetes_log_service_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_log_service_enabled.cs_kubernetes_log_service_enabled import (
                cs_kubernetes_log_service_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c2",
                name="c2",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                log_service_enabled=True,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_log_service_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_network_policy_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/cs/cs_kubernetes_network_policy_enabled/cs_kubernetes_network_policy_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestCSKubernetesNetworkPolicyEnabled:
    def test_network_policy_disabled_fails(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_network_policy_enabled.cs_kubernetes_network_policy_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_network_policy_enabled.cs_kubernetes_network_policy_enabled import (
                cs_kubernetes_network_policy_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c1",
                name="c1",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                network_policy_enabled=False,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_network_policy_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_network_policy_enabled_passes(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_network_policy_enabled.cs_kubernetes_network_policy_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_network_policy_enabled.cs_kubernetes_network_policy_enabled import (
                cs_kubernetes_network_policy_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c2",
                name="c2",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                network_policy_enabled=True,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_network_policy_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_private_cluster_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/cs/cs_kubernetes_private_cluster_enabled/cs_kubernetes_private_cluster_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestCSKubernetesPrivateClusterEnabled:
    def test_public_cluster_fails(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"
        cs_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_private_cluster_enabled.cs_kubernetes_private_cluster_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_private_cluster_enabled.cs_kubernetes_private_cluster_enabled import (
                cs_kubernetes_private_cluster_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c1",
                name="public",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                private_cluster_enabled=False,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_private_cluster_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "public API endpoint" in result[0].status_extended

    def test_private_cluster_passes(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"
        cs_client.region = "cn-hangzhou"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_private_cluster_enabled.cs_kubernetes_private_cluster_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_private_cluster_enabled.cs_kubernetes_private_cluster_enabled import (
                cs_kubernetes_private_cluster_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c2",
                name="private",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                private_cluster_enabled=True,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_private_cluster_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "private cluster" in result[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: cs_kubernetes_rbac_enabled_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/cs/cs_kubernetes_rbac_enabled/cs_kubernetes_rbac_enabled_test.py

```python
from unittest import mock

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestCSKubernetesRBACEnabled:
    def test_rbac_disabled_fails(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_rbac_enabled.cs_kubernetes_rbac_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_rbac_enabled.cs_kubernetes_rbac_enabled import (
                cs_kubernetes_rbac_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c1",
                name="c1",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                rbac_enabled=False,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_rbac_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"

    def test_rbac_enabled_passes(self):
        cs_client = mock.MagicMock()
        cs_client.audited_account = "1234567890"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_alibabacloud_provider(),
            ),
            mock.patch(
                "prowler.providers.alibabacloud.services.cs.cs_kubernetes_rbac_enabled.cs_kubernetes_rbac_enabled.cs_client",
                new=cs_client,
            ),
        ):
            from prowler.providers.alibabacloud.services.cs.cs_kubernetes_rbac_enabled.cs_kubernetes_rbac_enabled import (
                cs_kubernetes_rbac_enabled,
            )
            from prowler.providers.alibabacloud.services.cs.cs_service import Cluster

            cluster = Cluster(
                id="c2",
                name="c2",
                region="cn-hangzhou",
                cluster_type="k8s",
                state="running",
                rbac_enabled=True,
            )
            cs_client.clusters = [cluster]

            check = cs_kubernetes_rbac_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
```

--------------------------------------------------------------------------------

---[FILE: ecs_service_test.py]---
Location: prowler-master/tests/providers/alibabacloud/services/ecs/ecs_service_test.py

```python
from unittest.mock import patch

from tests.providers.alibabacloud.alibabacloud_fixtures import (
    set_mocked_alibabacloud_provider,
)


class TestECSService:
    def test_service(self):
        alibabacloud_provider = set_mocked_alibabacloud_provider()

        with patch(
            "prowler.providers.alibabacloud.services.ecs.ecs_service.ECS.__init__",
            return_value=None,
        ):
            from prowler.providers.alibabacloud.services.ecs.ecs_service import ECS

            ecs_client = ECS(alibabacloud_provider)
            ecs_client.service = "ecs"
            ecs_client.provider = alibabacloud_provider
            ecs_client.regional_clients = {}

            assert ecs_client.service == "ecs"
            assert ecs_client.provider == alibabacloud_provider
```

--------------------------------------------------------------------------------

````
