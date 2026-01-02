---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 649
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 649 of 867)

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

---[FILE: apim_service_test.py]---
Location: prowler-master/tests/providers/azure/services/apim/apim_service_test.py

```python
from datetime import timedelta
from unittest import TestCase, mock
from unittest.mock import patch

from azure.mgmt.loganalytics.models import Workspace
from azure.mgmt.monitor.models import DiagnosticSettingsResource
from azure.monitor.query import LogsQueryResult

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)

# Define constants for reusable mock data
APIM_INSTANCE_ID = f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/resourceGroups/rg/providers/Microsoft.ApiManagement/service/apim1"
APIM_INSTANCE_NAME = "apim1"
LOCATION = "West US"
RESOURCE_GROUP = "rg"
WORKSPACE_ID = f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/resourcegroups/rg/providers/microsoft.operationalinsights/workspaces/loganalytics"
WORKSPACE_CUSTOMER_ID = "12345678-1234-1234-1234-1234567890ab"


def mock_apim_get_instances(_):
    """Mock function to replace APIM._get_instances."""
    from prowler.providers.azure.services.apim.apim_service import APIMInstance

    return {
        AZURE_SUBSCRIPTION_ID: [
            APIMInstance(
                id=APIM_INSTANCE_ID,
                name=APIM_INSTANCE_NAME,
                location=LOCATION,
                log_analytics_workspace_id=WORKSPACE_ID,
            )
        ]
    }


class Test_APIM_Service(TestCase):
    def test_get_client(self):
        """Test that the APIM service client is created correctly."""
        mock_provider = mock.MagicMock()
        mock_provider.identity = mock.MagicMock()
        with (
            patch(
                "prowler.providers.azure.azure_provider.Provider.get_global_provider",
                return_value=mock_provider,
            ),
            patch(
                "prowler.providers.azure.services.apim.apim_service.APIM._get_instances",
                return_value={},
            ),
        ):
            from prowler.providers.azure.services.apim.apim_service import APIM

            apim = APIM(set_mocked_azure_provider())
            self.assertEqual(
                apim.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__,
                "ApiManagementClient",
            )

    def test_get_subscriptions(self):
        """Test that subscriptions are retrieved correctly."""
        mock_provider = mock.MagicMock()
        mock_provider.identity = mock.MagicMock()
        with (
            patch(
                "prowler.providers.azure.azure_provider.Provider.get_global_provider",
                return_value=mock_provider,
            ),
            patch(
                "prowler.providers.azure.services.apim.apim_service.APIM._get_instances",
                return_value={},
            ),
        ):
            from prowler.providers.azure.services.apim.apim_service import APIM

            apim = APIM(set_mocked_azure_provider())
            self.assertEqual(apim.subscriptions.__class__.__name__, "dict")

    def test_get_instances(self):
        """Test that APIM instances are retrieved and parsed correctly."""
        mock_provider = mock.MagicMock()
        mock_provider.identity = mock.MagicMock()
        with (
            patch(
                "prowler.providers.azure.azure_provider.Provider.get_global_provider",
                return_value=mock_provider,
            ),
            patch(
                "prowler.providers.azure.services.apim.apim_service.APIM._get_instances",
                new=mock_apim_get_instances,
            ),
        ):
            from prowler.providers.azure.services.apim.apim_service import APIM

            apim = APIM(set_mocked_azure_provider())
            self.assertEqual(len(apim.instances), 1)
            self.assertEqual(len(apim.instances[AZURE_SUBSCRIPTION_ID]), 1)
            instance = apim.instances[AZURE_SUBSCRIPTION_ID][0]
            self.assertEqual(instance.id, APIM_INSTANCE_ID)
            self.assertEqual(instance.name, APIM_INSTANCE_NAME)
            self.assertEqual(instance.location, LOCATION)
            self.assertEqual(instance.log_analytics_workspace_id, WORKSPACE_ID)

    def test_get_log_analytics_workspace_id_success(self):
        """Test retrieving a Log Analytics workspace ID successfully."""
        mock_provider = mock.MagicMock()
        mock_provider.identity = mock.MagicMock()
        with patch(
            "prowler.providers.azure.azure_provider.Provider.get_global_provider",
            return_value=mock_provider,
        ):
            from prowler.providers.azure.services.apim.apim_service import APIM

            with (
                patch(
                    "prowler.providers.azure.services.apim.apim_service.APIM._get_instances",
                    return_value={},
                ),
                patch(
                    "prowler.providers.azure.services.apim.apim_service.monitor_client"
                ) as mock_monitor_client,
            ):
                apim = APIM(set_mocked_azure_provider())
                mock_log_setting = mock.MagicMock(enabled=True, category="GatewayLogs")
                mock_setting = DiagnosticSettingsResource(
                    workspace_id=WORKSPACE_ID, logs=[mock_log_setting]
                )
                mock_monitor_client.diagnostic_settings_with_uri.return_value = [
                    mock_setting
                ]
                workspace_id = apim._get_log_analytics_workspace_id(
                    APIM_INSTANCE_ID, AZURE_SUBSCRIPTION_ID
                )
                self.assertEqual(workspace_id, WORKSPACE_ID)

    def test_get_log_analytics_workspace_id_not_enabled(self):
        """Test that no workspace ID is returned if GatewayLogs are not enabled."""
        mock_provider = mock.MagicMock()
        mock_provider.identity = mock.MagicMock()
        with patch(
            "prowler.providers.azure.azure_provider.Provider.get_global_provider",
            return_value=mock_provider,
        ):
            from prowler.providers.azure.services.apim.apim_service import APIM

            with (
                patch(
                    "prowler.providers.azure.services.apim.apim_service.APIM._get_instances",
                    return_value={},
                ),
                patch(
                    "prowler.providers.azure.services.apim.apim_service.monitor_client"
                ) as mock_monitor_client,
            ):
                apim = APIM(set_mocked_azure_provider())
                mock_log_setting = mock.MagicMock(enabled=False, category="GatewayLogs")
                mock_setting = DiagnosticSettingsResource(
                    workspace_id=WORKSPACE_ID, logs=[mock_log_setting]
                )
                mock_monitor_client.diagnostic_settings_with_uri.return_value = [
                    mock_setting
                ]
                workspace_id = apim._get_log_analytics_workspace_id(
                    APIM_INSTANCE_ID, AZURE_SUBSCRIPTION_ID
                )
                self.assertIsNone(workspace_id)

    def test_get_workspace_customer_id_success(self):
        """Test retrieving a workspace customer ID successfully."""
        mock_provider = mock.MagicMock()
        mock_provider.identity = mock.MagicMock()
        with patch(
            "prowler.providers.azure.azure_provider.Provider.get_global_provider",
            return_value=mock_provider,
        ):
            from prowler.providers.azure.services.apim.apim_service import APIM

            with (
                patch(
                    "prowler.providers.azure.services.apim.apim_service.APIM._get_instances",
                    return_value={},
                ),
                patch(
                    "prowler.providers.azure.services.apim.apim_service.loganalytics_client"
                ) as mock_loganalytics_client,
            ):
                apim = APIM(set_mocked_azure_provider())
                mock_workspace = Workspace(location=LOCATION)
                # Set customer_id after creation since it's readonly
                mock_workspace.customer_id = WORKSPACE_CUSTOMER_ID

                # Properly mock the nested client structure
                mock_client = mock.MagicMock()
                mock_workspaces = mock.MagicMock()
                mock_workspaces.get.return_value = mock_workspace
                mock_client.workspaces = mock_workspaces
                mock_loganalytics_client.clients = {AZURE_SUBSCRIPTION_ID: mock_client}

                customer_id = apim._get_workspace_customer_id(
                    AZURE_SUBSCRIPTION_ID, WORKSPACE_ID
                )
                self.assertEqual(customer_id, WORKSPACE_CUSTOMER_ID)

    def test_query_logs_success(self):
        """Test querying logs successfully."""
        mock_provider = mock.MagicMock()
        mock_provider.identity = mock.MagicMock()
        with patch(
            "prowler.providers.azure.azure_provider.Provider.get_global_provider",
            return_value=mock_provider,
        ):
            from prowler.providers.azure.services.apim.apim_service import APIM

            with (
                patch(
                    "prowler.providers.azure.services.apim.apim_service.APIM._get_instances",
                    return_value={},
                ),
                patch(
                    "prowler.providers.azure.services.apim.apim_service.logsquery_client"
                ) as mock_logsquery_client,
            ):
                apim = APIM(set_mocked_azure_provider())
                # Create a mock table with the expected structure for LogsQueryLogEntry
                mock_table = mock.MagicMock()
                mock_table.columns = [
                    "TimeGenerated",
                    "OperationId",
                    "CallerIpAddress",
                    "CorrelationId",
                ]
                from datetime import datetime

                mock_table.rows = [
                    [
                        datetime.fromisoformat("2024-01-01T10:00:00+00:00"),
                        "test-operation",
                        "192.168.1.100",
                        "test-correlation",
                    ]
                ]

                mock_response = LogsQueryResult(tables=[mock_table], status="Success")

                # Properly mock the nested client structure
                mock_client = mock.MagicMock()
                mock_client.query_workspace.return_value = mock_response
                mock_logsquery_client.clients = {AZURE_SUBSCRIPTION_ID: mock_client}

                result = apim.query_logs(
                    AZURE_SUBSCRIPTION_ID,
                    "query",
                    timedelta(minutes=60),
                    WORKSPACE_CUSTOMER_ID,
                )
                self.assertEqual(len(result), 1)
                # The result should be LogsQueryLogEntry objects
                from datetime import datetime

                self.assertEqual(
                    result[0].time_generated,
                    datetime.fromisoformat("2024-01-01T10:00:00+00:00"),
                )
                self.assertEqual(result[0].operation_id, "test-operation")
                self.assertEqual(result[0].caller_ip_address, "192.168.1.100")
                self.assertEqual(result[0].correlation_id, "test-correlation")

    def test_get_llm_operations_logs_no_workspace_id(self):
        """Test getting logs when the APIM instance has no workspace configured."""
        mock_provider = mock.MagicMock()
        mock_provider.identity = mock.MagicMock()
        with patch(
            "prowler.providers.azure.azure_provider.Provider.get_global_provider",
            return_value=mock_provider,
        ):
            from prowler.providers.azure.services.apim.apim_service import APIM

            with patch(
                "prowler.providers.azure.services.apim.apim_service.APIM._get_instances",
                return_value={},
            ):
                apim = APIM(set_mocked_azure_provider())
                instance = mock.MagicMock(
                    log_analytics_workspace_id=None, name="test-apim"
                )
                result = apim.get_llm_operations_logs(AZURE_SUBSCRIPTION_ID, instance)
                self.assertEqual(result, [])

    def test_get_llm_operations_logs_success(self):
        """Test the successful retrieval of LLM operation logs."""
        mock_provider = mock.MagicMock()
        mock_provider.identity = mock.MagicMock()
        with patch(
            "prowler.providers.azure.azure_provider.Provider.get_global_provider",
            return_value=mock_provider,
        ):
            from prowler.providers.azure.services.apim.apim_service import APIM

            with (
                patch(
                    "prowler.providers.azure.services.apim.apim_service.APIM._get_instances",
                    new=mock_apim_get_instances,
                ),
                patch(
                    "prowler.providers.azure.services.apim.apim_service.APIM.query_logs",
                    return_value=[{"log": "data"}],
                ),
                patch(
                    "prowler.providers.azure.services.apim.apim_service.APIM._get_workspace_customer_id",
                    return_value=WORKSPACE_CUSTOMER_ID,
                ),
            ):
                apim = APIM(set_mocked_azure_provider())
                instance = apim.instances[AZURE_SUBSCRIPTION_ID][0]
                result = apim.get_llm_operations_logs(AZURE_SUBSCRIPTION_ID, instance)
                self.assertEqual(result, [{"log": "data"}])
```

--------------------------------------------------------------------------------

---[FILE: apim_threat_detection_llm_jacking_test.py]---
Location: prowler-master/tests/providers/azure/services/apim/apim_threat_detection_llm_jacking/apim_threat_detection_llm_jacking_test.py

```python
from datetime import datetime
from unittest import mock

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


# Create a mock LogsQueryLogEntry class for testing
class MockLogsQueryLogEntry:
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)


def mock_get_llm_operations_logs(subscription, instance, minutes):
    """Mock LLM operations logs for testing - returns 2 operations"""
    return [
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:00:00+00:00"),
            operation_id="ChatCompletions_Create",
            caller_ip_address="192.168.1.100",
            correlation_id="test-correlation-id-1",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:01:00+00:00"),
            operation_id="ImageGenerations_Create",
            caller_ip_address="192.168.1.100",
            correlation_id="test-correlation-id-2",
        ),
    ]


def mock_get_llm_operations_logs_6_operations(subscription, instance, minutes):
    """Mock LLM operations logs for testing - returns 6 operations"""
    return [
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:00:00+00:00"),
            operation_id="ChatCompletions_Create",
            caller_ip_address="192.168.1.100",
            correlation_id="test-correlation-id-1",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:01:00+00:00"),
            operation_id="ImageGenerations_Create",
            caller_ip_address="192.168.1.100",
            correlation_id="test-correlation-id-2",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:02:00+00:00"),
            operation_id="Completions_Create",
            caller_ip_address="192.168.1.100",
            correlation_id="test-correlation-id-3",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:03:00+00:00"),
            operation_id="Embeddings_Create",
            caller_ip_address="192.168.1.100",
            correlation_id="test-correlation-id-4",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:04:00+00:00"),
            operation_id="FineTuning_Jobs_Create",
            caller_ip_address="192.168.1.100",
            correlation_id="test-correlation-id-5",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:05:00+00:00"),
            operation_id="Models_List",
            caller_ip_address="192.168.1.100",
            correlation_id="test-correlation-id-6",
        ),
    ]


def mock_get_llm_operations_logs_2_operations(subscription, instance, minutes):
    """Mock LLM operations logs for testing - returns 2 operations"""
    return [
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:00:00+00:00"),
            operation_id="ChatCompletions_Create",
            caller_ip_address="192.168.1.100",
            correlation_id="test-correlation-id-1",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:01:00+00:00"),
            operation_id="ImageGenerations_Create",
            caller_ip_address="192.168.1.100",
            correlation_id="test-correlation-id-2",
        ),
    ]


def mock_get_llm_operations_logs_attacker(subscription, instance, minutes):
    """Mock LLM operations logs showing potential attack"""
    return [
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:00:00+00:00"),
            operation_id="ChatCompletions_Create",
            caller_ip_address="10.0.0.50",
            correlation_id="test-correlation-id-1",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:01:00+00:00"),
            operation_id="ImageGenerations_Create",
            caller_ip_address="10.0.0.50",
            correlation_id="test-correlation-id-2",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:02:00+00:00"),
            operation_id="Completions_Create",
            caller_ip_address="10.0.0.50",
            correlation_id="test-correlation-id-3",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:03:00+00:00"),
            operation_id="Embeddings_Create",
            caller_ip_address="10.0.0.50",
            correlation_id="test-correlation-id-4",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:04:00+00:00"),
            operation_id="FineTuning_Jobs_Create",
            caller_ip_address="10.0.0.50",
            correlation_id="test-correlation-id-5",
        ),
        MockLogsQueryLogEntry(
            time_generated=datetime.fromisoformat("2024-01-01T10:05:00+00:00"),
            operation_id="Models_List",
            caller_ip_address="10.0.0.50",
            correlation_id="test-correlation-id-6",
        ),
    ]


def mock_get_llm_operations_logs_no_workspace(subscription, instance, minutes):
    """Mock LLM operations logs for instance without workspace"""
    return []


class Test_apim_threat_detection_llm_jacking:
    def test_no_apim_instances(self):
        """Test when there are no APIM instances"""
        apim_client = mock.MagicMock()
        apim_client.instances = {}
        apim_client.audit_config = {
            "apim_threat_detection_llm_jacking_threshold": 0.1,
            "apim_threat_detection_llm_jacking_minutes": 1440,
            "apim_threat_detection_llm_jacking_actions": [
                "ChatCompletions_Create",
                "ImageGenerations_Create",
            ],
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking.apim_client",
                new=apim_client,
            ),
        ):
            from prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking import (
                apim_threat_detection_llm_jacking,
            )

            check = apim_threat_detection_llm_jacking()
            result = check.execute()

            assert len(result) == 0

    def test_no_potential_llm_jacking(self):
        """Test when no potential LLM jacking is detected"""
        apim_client = mock.MagicMock()
        apim_client.instances = {
            AZURE_SUBSCRIPTION_ID: [
                mock.MagicMock(
                    id="/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.ApiManagement/service/test-apim",
                    name="test-apim",
                    log_analytics_workspace_id="/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
                )
            ]
        }
        apim_client.audit_config = {
            "apim_threat_detection_llm_jacking_threshold": 0.9,
            "apim_threat_detection_llm_jacking_minutes": 1440,
            "apim_threat_detection_llm_jacking_actions": [
                "ChatCompletions_Create",
                "ImageGenerations_Create",
                "Completions_Create",
                "Embeddings_Create",
                "FineTuning_Jobs_Create",
                "Models_List",
                "Deployments_List",
                "Deployments_Get",
                "Deployments_Create",
                "Deployments_Delete",
                "Messages_Create",
                "Claude_Create",
                "GenerateContent",
                "GenerateText",
                "GenerateImage",
                "Llama_Create",
                "CodeLlama_Create",
                "Gemini_Generate",
                "Claude_Generate",
                "Llama_Generate",
            ],
        }
        apim_client.get_llm_operations_logs = mock_get_llm_operations_logs_6_operations

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking.apim_client",
                new=apim_client,
            ),
        ):
            from prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking import (
                apim_threat_detection_llm_jacking,
            )

            check = apim_threat_detection_llm_jacking()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                "No potential LLM Jacking attacks detected" in result[0].status_extended
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID

    def test_potential_llm_jacking_detected(self):
        """Test when potential LLM jacking is detected"""
        apim_client = mock.MagicMock()
        apim_client.instances = {
            AZURE_SUBSCRIPTION_ID: [
                mock.MagicMock(
                    id="/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.ApiManagement/service/test-apim",
                    name="test-apim",
                    log_analytics_workspace_id="/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
                )
            ]
        }
        apim_client.audit_config = {
            "apim_threat_detection_llm_jacking_threshold": 0.1,
            "apim_threat_detection_llm_jacking_minutes": 1440,
            "apim_threat_detection_llm_jacking_actions": [
                "ChatCompletions_Create",
                "ImageGenerations_Create",
                "Completions_Create",
                "Embeddings_Create",
                "FineTuning_Jobs_Create",
                "Models_List",
            ],
        }
        apim_client.get_llm_operations_logs = mock_get_llm_operations_logs_attacker

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking.apim_client",
                new=apim_client,
            ),
        ):
            from prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking import (
                apim_threat_detection_llm_jacking,
            )

            check = apim_threat_detection_llm_jacking()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                "Potential LLM Jacking attack detected from IP address 10.0.0.50"
                in result[0].status_extended
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource["name"] == "10.0.0.50"
            assert result[0].resource["id"] == "10.0.0.50"

    def test_higher_threshold_no_detection(self):
        """Test when threshold is higher and no attack is detected"""
        apim_client = mock.MagicMock()
        apim_client.instances = {
            AZURE_SUBSCRIPTION_ID: [
                mock.MagicMock(
                    id="/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.ApiManagement/service/test-apim",
                    name="test-apim",
                    log_analytics_workspace_id="/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
                )
            ]
        }
        apim_client.audit_config = {
            "apim_threat_detection_llm_jacking_threshold": 0.9,
            "apim_threat_detection_llm_jacking_minutes": 1440,
            "apim_threat_detection_llm_jacking_actions": [
                "ChatCompletions_Create",
                "ImageGenerations_Create",
                "Completions_Create",
                "Embeddings_Create",
                "FineTuning_Jobs_Create",
                "Models_List",
                "Deployments_List",
                "Deployments_Get",
                "Deployments_Create",
                "Deployments_Delete",
                "Messages_Create",
                "Claude_Create",
                "GenerateContent",
                "GenerateText",
                "GenerateImage",
                "Llama_Create",
                "CodeLlama_Create",
                "Gemini_Generate",
                "Claude_Generate",
                "Llama_Generate",
            ],
        }
        apim_client.get_llm_operations_logs = mock_get_llm_operations_logs_6_operations

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking.apim_client",
                new=apim_client,
            ),
        ):
            from prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking import (
                apim_threat_detection_llm_jacking,
            )

            check = apim_threat_detection_llm_jacking()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                "No potential LLM Jacking attacks detected" in result[0].status_extended
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID

    def test_instance_without_workspace(self):
        """Test when APIM instance has no Log Analytics workspace configured"""
        apim_client = mock.MagicMock()
        apim_client.instances = {
            AZURE_SUBSCRIPTION_ID: [
                mock.MagicMock(
                    id="/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.ApiManagement/service/test-apim",
                    name="test-apim",
                    log_analytics_workspace_id=None,
                )
            ]
        }
        apim_client.audit_config = {
            "apim_threat_detection_llm_jacking_threshold": 0.9,
            "apim_threat_detection_llm_jacking_minutes": 1440,
            "apim_threat_detection_llm_jacking_actions": [
                "ChatCompletions_Create",
                "ImageGenerations_Create",
                "Completions_Create",
                "Embeddings_Create",
                "FineTuning_Jobs_Create",
                "Models_List",
                "Deployments_List",
                "Deployments_Get",
                "Deployments_Create",
                "Deployments_Delete",
                "Messages_Create",
                "Claude_Create",
                "GenerateContent",
                "GenerateText",
                "GenerateImage",
                "Llama_Create",
                "CodeLlama_Create",
                "Gemini_Generate",
                "Claude_Generate",
                "Llama_Generate",
            ],
        }
        apim_client.get_llm_operations_logs = mock_get_llm_operations_logs_2_operations

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking.apim_client",
                new=apim_client,
            ),
        ):
            from prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking import (
                apim_threat_detection_llm_jacking,
            )

            check = apim_threat_detection_llm_jacking()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                "No potential LLM Jacking attacks detected" in result[0].status_extended
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID

    def test_multiple_subscriptions(self):
        """Test with multiple subscriptions"""
        apim_client = mock.MagicMock()
        apim_client.instances = {
            AZURE_SUBSCRIPTION_ID: [
                mock.MagicMock(
                    id="/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.ApiManagement/service/test-apim",
                    name="test-apim",
                    log_analytics_workspace_id="/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
                )
            ],
            "another-subscription": [
                mock.MagicMock(
                    id="/subscriptions/another-sub/resourceGroups/test-rg/providers/Microsoft.ApiManagement/service/another-apim",
                    name="another-apim",
                    log_analytics_workspace_id="/subscriptions/another-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/another-workspace",
                )
            ],
        }
        apim_client.audit_config = {
            "apim_threat_detection_llm_jacking_threshold": 0.9,
            "apim_threat_detection_llm_jacking_minutes": 1440,
            "apim_threat_detection_llm_jacking_actions": [
                "ChatCompletions_Create",
                "ImageGenerations_Create",
                "Completions_Create",
                "Embeddings_Create",
                "FineTuning_Jobs_Create",
                "Models_List",
                "Deployments_List",
                "Deployments_Get",
                "Deployments_Create",
                "Deployments_Delete",
                "Messages_Create",
                "Claude_Create",
                "GenerateContent",
                "GenerateText",
                "GenerateImage",
                "Llama_Create",
                "CodeLlama_Create",
                "Gemini_Generate",
                "Claude_Generate",
                "Llama_Generate",
            ],
        }
        apim_client.get_llm_operations_logs = mock_get_llm_operations_logs_2_operations

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking.apim_client",
                new=apim_client,
            ),
        ):
            from prowler.providers.azure.services.apim.apim_threat_detection_llm_jacking.apim_threat_detection_llm_jacking import (
                apim_threat_detection_llm_jacking,
            )

            check = apim_threat_detection_llm_jacking()
            result = check.execute()

            assert len(result) == 2
            # Both subscriptions should have PASS results
            for report in result:
                assert report.status == "PASS"
                assert (
                    "No potential LLM Jacking attacks detected"
                    in report.status_extended
                )
```

--------------------------------------------------------------------------------

````
