---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 714
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 714 of 867)

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

---[FILE: logging_sink_created_test.py]---
Location: prowler-master/tests/providers/gcp/services/logging/logging_sink_created/logging_sink_created_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.gcp.models import GCPProject
from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_logging_sink_created:
    def test_no_projects(self):
        logging_client = MagicMock()

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created import (
                logging_sink_created,
            )

            logging_client.project_ids = []
            logging_client.sinks = []

            check = logging_sink_created()
            result = check.execute()
            assert len(result) == 0

    def test_no_sinks(self):
        logging_client = MagicMock()

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created import (
                logging_sink_created,
            )

            logging_client.project_ids = [GCP_PROJECT_ID]
            logging_client.region = GCP_EU1_LOCATION
            logging_client.sinks = []
            logging_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }

            check = logging_sink_created()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"There are no logging sinks to export copies of all the log entries in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_EU1_LOCATION

    def test_sink_all(self):
        logging_client = MagicMock()

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.logging.logging_service import Sink
            from prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created import (
                logging_sink_created,
            )

            logging_client.project_ids = [GCP_PROJECT_ID]
            logging_client.region = GCP_EU1_LOCATION
            logging_client.sinks = [
                Sink(
                    name="sink1",
                    destination="destination1",
                    filter="all",
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = logging_sink_created()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Sink sink1 is enabled exporting copies of all the log entries in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == "sink1"
            assert result[0].resource_name == "sink1"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_EU1_LOCATION

    def test_sink_not_all(self):
        logging_client = MagicMock()

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.logging.logging_service import Sink
            from prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created import (
                logging_sink_created,
            )

            logging_client.project_ids = [GCP_PROJECT_ID]
            logging_client.region = GCP_EU1_LOCATION
            logging_client.sinks = [
                Sink(
                    name="sink1",
                    destination="destination1",
                    filter="not all",
                    project_id=GCP_PROJECT_ID,
                )
            ]
            logging_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }

            check = logging_sink_created()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"There are no logging sinks to export copies of all the log entries in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "test"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_EU1_LOCATION

    def test_no_sinks_empty_project_name(self):
        logging_client = MagicMock()

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created import (
                logging_sink_created,
            )

            logging_client.project_ids = [GCP_PROJECT_ID]
            logging_client.region = GCP_EU1_LOCATION
            logging_client.sinks = []
            logging_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }

            check = logging_sink_created()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].resource_name == "GCP Project"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_EU1_LOCATION
            assert (
                result[0].status_extended
                == f"There are no logging sinks to export copies of all the log entries in project {GCP_PROJECT_ID}."
            )

    def test_project_not_in_projects_dict(self):
        """Test that project not in projects dict uses None and fallback name"""
        logging_client = MagicMock()

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created import (
                logging_sink_created,
            )

            logging_client.project_ids = [GCP_PROJECT_ID]
            logging_client.region = GCP_EU1_LOCATION
            logging_client.sinks = []
            # Project is in project_ids but NOT in projects dict
            logging_client.projects = {}

            check = logging_sink_created()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_name == "GCP Project"
            assert result[0].resource_id == GCP_PROJECT_ID
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_EU1_LOCATION

    def test_sink_with_none_name(self):
        """Test that sink with None name uses fallback 'Logging Sink'"""
        logging_client = MagicMock()

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created import (
                logging_sink_created,
            )

            # Create a MagicMock sink object with name=None
            sink = MagicMock()
            sink.name = None
            sink.filter = "all"
            sink.project_id = GCP_PROJECT_ID

            logging_client.project_ids = [GCP_PROJECT_ID]
            logging_client.region = GCP_EU1_LOCATION
            logging_client.sinks = [sink]
            logging_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }

            check = logging_sink_created()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_name == "Logging Sink"
            assert result[0].resource_id == "unknown"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_EU1_LOCATION
            assert "unknown" in result[0].status_extended

    def test_sink_with_missing_name_attribute(self):
        """Test that sink without name attribute uses fallback 'Logging Sink'"""
        logging_client = MagicMock()

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created.logging_client",
                new=logging_client,
            ),
        ):
            from prowler.providers.gcp.services.logging.logging_sink_created.logging_sink_created import (
                logging_sink_created,
            )

            # Create a MagicMock sink object without name attribute
            sink = MagicMock(spec=["filter", "project_id"])
            sink.filter = "all"
            sink.project_id = GCP_PROJECT_ID

            logging_client.project_ids = [GCP_PROJECT_ID]
            logging_client.region = GCP_EU1_LOCATION
            logging_client.sinks = [sink]
            logging_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }

            check = logging_sink_created()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_name == "Logging Sink"
            assert result[0].resource_id == "unknown"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_EU1_LOCATION
```

--------------------------------------------------------------------------------

---[FILE: monitoring_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/monitoring/monitoring_service_test.py

```python
from unittest.mock import patch

from prowler.providers.gcp.services.monitoring.monitoring_service import Monitoring
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestMonitoringService:
    def test_service(self):
        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client,
            ),
        ):
            monitoring_client = Monitoring(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert monitoring_client.service == "monitoring"
            assert monitoring_client.project_ids == [GCP_PROJECT_ID]

            assert len(monitoring_client.alert_policies) == 2
            assert monitoring_client.alert_policies[0].name == "alert_policy1"
            assert monitoring_client.alert_policies[0].display_name == "Alert Policy 1"
            assert monitoring_client.alert_policies[0].enabled
            assert monitoring_client.alert_policies[0].filters == [
                'metric.type="compute.googleapis.com/instance/disk/write_bytes_count"'
            ]
            assert monitoring_client.alert_policies[0].project_id == GCP_PROJECT_ID
            assert monitoring_client.alert_policies[1].name == "alert_policy2"
            assert monitoring_client.alert_policies[1].display_name == "Alert Policy 2"
            assert not monitoring_client.alert_policies[1].enabled
            assert monitoring_client.alert_policies[1].filters == [
                'metric.type="compute.googleapis.com/instance/disk/write_bytes_count"'
            ]

    def test_sa_keys_metrics(self):
        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client,
            ),
        ):
            monitoring_client = Monitoring(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            monitoring_client.audit_config = {"max_unused_account_days": 30}
            assert monitoring_client.service == "monitoring"
            assert monitoring_client.project_ids == [GCP_PROJECT_ID]

            assert len(monitoring_client.sa_keys_metrics) == 2
            assert "key1" in monitoring_client.sa_keys_metrics
            assert "key2" in monitoring_client.sa_keys_metrics
            assert "key3" not in monitoring_client.sa_keys_metrics

    def test_sa_api_metrics(self):
        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client,
            ),
        ):
            monitoring_client = Monitoring(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert monitoring_client.service == "monitoring"
            assert monitoring_client.project_ids == [GCP_PROJECT_ID]

            assert len(monitoring_client.sa_api_metrics) == 2
            assert "111222233334444" in monitoring_client.sa_api_metrics
            assert "55566666777888999" in monitoring_client.sa_api_metrics
            assert "0000000000000" not in monitoring_client.sa_api_metrics

    def test_alert_policies_with_different_condition_types(self):
        """Test that monitoring service handles different alert policy condition types"""

        def mock_api_client_with_mixed_conditions(*args, **kwargs):
            from unittest.mock import MagicMock

            client = MagicMock()

            # Mock alert policies with different condition types
            client.projects().alertPolicies().list().execute.return_value = {
                "alertPolicies": [
                    {
                        "name": "policy_with_threshold",
                        "displayName": "Threshold Policy",
                        "conditions": [
                            {
                                "conditionThreshold": {
                                    "filter": 'metric.type="compute.googleapis.com/instance/cpu/utilization"',
                                    "comparison": "COMPARISON_GT",
                                    "thresholdValue": 0.8,
                                }
                            }
                        ],
                        "enabled": True,
                    },
                    {
                        "name": "policy_with_absent",
                        "displayName": "Absent Policy",
                        "conditions": [
                            {
                                "conditionAbsent": {
                                    "filter": 'metric.type="compute.googleapis.com/instance/uptime"',
                                    "duration": "300s",
                                }
                            }
                        ],
                        "enabled": True,
                    },
                    {
                        "name": "policy_with_log",
                        "displayName": "Log Match Policy",
                        "conditions": [
                            {
                                "conditionMatchedLog": {
                                    "filter": 'severity="ERROR"',
                                }
                            }
                        ],
                        "enabled": True,
                    },
                    {
                        "name": "policy_with_mql",
                        "displayName": "MQL Policy",
                        "conditions": [
                            {
                                "conditionMonitoringQueryLanguage": {
                                    "query": 'fetch gce_instance | metric "compute.googleapis.com/instance/cpu/utilization"',
                                    "duration": "60s",
                                }
                            }
                        ],
                        "enabled": True,
                    },
                ]
            }
            client.projects().alertPolicies().list_next.return_value = None
            client.projects().timeSeries().list().execute.return_value = {
                "timeSeries": []
            }

            return client

        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client_with_mixed_conditions,
            ),
        ):
            monitoring_client = Monitoring(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )

            assert len(monitoring_client.alert_policies) == 4

            # Verify threshold condition
            threshold_policy = monitoring_client.alert_policies[0]
            assert threshold_policy.name == "policy_with_threshold"
            assert len(threshold_policy.filters) == 1
            assert (
                'metric.type="compute.googleapis.com/instance/cpu/utilization"'
                in threshold_policy.filters[0]
            )

            # Verify absent condition
            absent_policy = monitoring_client.alert_policies[1]
            assert absent_policy.name == "policy_with_absent"
            assert len(absent_policy.filters) == 1
            assert (
                'metric.type="compute.googleapis.com/instance/uptime"'
                in absent_policy.filters[0]
            )

            # Verify log condition
            log_policy = monitoring_client.alert_policies[2]
            assert log_policy.name == "policy_with_log"
            assert len(log_policy.filters) == 1
            assert 'severity="ERROR"' in log_policy.filters[0]

            # Verify MQL condition
            mql_policy = monitoring_client.alert_policies[3]
            assert mql_policy.name == "policy_with_mql"
            assert len(mql_policy.filters) == 1
            assert "fetch gce_instance" in mql_policy.filters[0]

    def test_alert_policies_with_missing_conditions(self):
        """Test that monitoring service handles alert policies with missing conditions field"""

        def mock_api_client_with_missing_conditions(*args, **kwargs):
            from unittest.mock import MagicMock

            client = MagicMock()

            client.projects().alertPolicies().list().execute.return_value = {
                "alertPolicies": [
                    {
                        "name": "policy_without_conditions",
                        "displayName": "Policy Without Conditions",
                        "enabled": True,
                    }
                ]
            }
            client.projects().alertPolicies().list_next.return_value = None
            client.projects().timeSeries().list().execute.return_value = {
                "timeSeries": []
            }

            return client

        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client_with_missing_conditions,
            ),
        ):
            monitoring_client = Monitoring(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )

            # Should handle gracefully and create policy with empty filters
            assert len(monitoring_client.alert_policies) == 1
            assert (
                monitoring_client.alert_policies[0].name == "policy_without_conditions"
            )
            assert monitoring_client.alert_policies[0].filters == []

    def test_alert_policies_with_empty_filter_values(self):
        """Test that monitoring service skips conditions with empty filter values"""

        def mock_api_client_with_empty_filters(*args, **kwargs):
            from unittest.mock import MagicMock

            client = MagicMock()

            client.projects().alertPolicies().list().execute.return_value = {
                "alertPolicies": [
                    {
                        "name": "policy_with_empty_filter",
                        "displayName": "Policy With Empty Filter",
                        "conditions": [
                            {
                                "conditionThreshold": {
                                    "filter": "",  # Empty filter
                                    "comparison": "COMPARISON_GT",
                                    "thresholdValue": 1000,
                                }
                            }
                        ],
                        "enabled": True,
                    }
                ]
            }
            client.projects().alertPolicies().list_next.return_value = None
            client.projects().timeSeries().list().execute.return_value = {
                "timeSeries": []
            }

            return client

        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client_with_empty_filters,
            ),
        ):
            monitoring_client = Monitoring(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )

            # Should skip empty filters
            assert len(monitoring_client.alert_policies) == 1
            assert monitoring_client.alert_policies[0].filters == []
```

--------------------------------------------------------------------------------

---[FILE: serviceusage_test.py]---
Location: prowler-master/tests/providers/gcp/services/serviceusage/serviceusage_test.py

```python
from unittest.mock import patch

from prowler.providers.gcp.services.serviceusage.serviceusage_service import (
    ServiceUsage,
)
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestServiceUsageService:
    def test_service(self):
        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client,
            ),
        ):
            serviceusage_client = ServiceUsage(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert serviceusage_client.service == "serviceusage"
            assert serviceusage_client.project_ids == [GCP_PROJECT_ID]

            assert len(serviceusage_client.active_services[GCP_PROJECT_ID]) == 2

            assert (
                serviceusage_client.active_services[GCP_PROJECT_ID][0].name
                == "artifacts.googleapis.com"
            )
            assert (
                serviceusage_client.active_services[GCP_PROJECT_ID][0].title
                == "artifacts.googleapis.com"
            )
            assert (
                serviceusage_client.active_services[GCP_PROJECT_ID][0].project_id
                == GCP_PROJECT_ID
            )
            assert (
                serviceusage_client.active_services[GCP_PROJECT_ID][1].name
                == "bigquery.googleapis.com"
            )
            assert (
                serviceusage_client.active_services[GCP_PROJECT_ID][1].title
                == "bigquery.googleapis.com"
            )
            assert (
                serviceusage_client.active_services[GCP_PROJECT_ID][1].project_id
                == GCP_PROJECT_ID
            )
```

--------------------------------------------------------------------------------

---[FILE: github_fixtures.py]---
Location: prowler-master/tests/providers/github/github_fixtures.py

```python
from mock import MagicMock

from prowler.providers.github.github_provider import GithubProvider
from prowler.providers.github.models import GithubIdentityInfo, GithubSession

# GitHub Identity
ACCOUNT_NAME = "account-name"
ACCOUNT_ID = "account-id"
ACCOUNT_URL = "/user"

# GitHub Credentials
PAT_TOKEN = "github-token"
OAUTH_TOKEN = "oauth-token"
APP_ID = "app-id"
APP_NAME = "app-name"
APP_KEY = "app-key"


# Mocked GitHub Provider
def set_mocked_github_provider(
    auth_method: str = "personal_access",
    credentials: GithubSession = GithubSession(token=PAT_TOKEN, id=APP_ID, key=APP_KEY),
    identity: GithubIdentityInfo = GithubIdentityInfo(
        account_name=ACCOUNT_NAME,
        account_id=ACCOUNT_ID,
        account_url=ACCOUNT_URL,
    ),
    audit_config: dict = None,
) -> GithubProvider:

    provider = MagicMock()
    provider.type = "github"
    provider.auth_method = auth_method
    provider.session = credentials
    provider.identity = identity
    provider.audit_config = audit_config

    return provider
```

--------------------------------------------------------------------------------

````
