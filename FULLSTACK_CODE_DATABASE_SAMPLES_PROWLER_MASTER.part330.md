---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 330
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 330 of 867)

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

---[FILE: aks_cluster_rbac_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/aks/aks_cluster_rbac_enabled/aks_cluster_rbac_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "aks_cluster_rbac_enabled",
  "CheckTitle": "Ensure AKS RBAC is enabled",
  "CheckType": [],
  "ServiceName": "aks",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.ContainerService/ManagedClusters",
  "Description": "Azure Kubernetes Service (AKS) can be configured to use Azure Active Directory (AD) for user authentication. In this configuration, you sign in to an AKS cluster using an Azure AD authentication token. You can also configure Kubernetes role-based access control (Kubernetes RBAC) to limit access to cluster resources based a user's identity or group membership.",
  "Risk": "Kubernetes RBAC and AKS help you secure your cluster access and provide only the minimum required permissions to developers and operators.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/aks/azure-ad-rbac?tabs=portal",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/AKS/enable-role-based-access-control-for-kubernetes-service.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-kubernetes-policies/bc_azr_kubernetes_2#terraform"
    },
    "Recommendation": {
      "Text": "",
      "Url": "https://learn.microsoft.com/en-us/security/benchmark/azure/security-controls-v2-privileged-access#pa-7-follow-just-enough-administration-least-privilege-principle"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: aks_cluster_rbac_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/aks/aks_cluster_rbac_enabled/aks_cluster_rbac_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.aks.aks_client import aks_client


class aks_cluster_rbac_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, clusters in aks_client.clusters.items():
            for cluster in clusters.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=cluster)
                report.subscription = subscription_name
                report.status = "PASS"
                report.status_extended = f"RBAC is enabled for cluster '{cluster.name}' in subscription '{subscription_name}'."

                if not cluster.rbac_enabled:
                    report.status = "FAIL"
                    report.status_extended = f"RBAC is not enabled for cluster '{cluster.name}' in subscription '{subscription_name}'."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: aks_network_policy_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/aks/aks_network_policy_enabled/aks_network_policy_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "aks_network_policy_enabled",
  "CheckTitle": "Ensure Network Policy is Enabled and set as appropriate",
  "CheckType": [],
  "ServiceName": "aks",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.ContainerService/managedClusters",
  "Description": "When you run modern, microservices-based applications in Kubernetes, you often want to control which components can communicate with each other. The principle of least privilege should be applied to how traffic can flow between pods in an Azure Kubernetes Service (AKS) cluster. Let's say you likely want to block traffic directly to back-end applications. The Network Policy feature in Kubernetes lets you define rules for ingress and egress traffic between pods in a cluster.",
  "Risk": "All pods in an AKS cluster can send and receive traffic without limitations, by default. To improve security, you can define rules that control the flow of traffic. Back-end applications are often only exposed to required front-end services, for example. Or, database components are only accessible to the application tiers that connect to them. Network Policy is a Kubernetes specification that defines access policies for communication between Pods. Using Network Policies, you define an ordered set of rules to send and receive traffic and apply them to a collection of pods that match one or more label selectors. These network policy rules are defined as YAML manifests. Network policies can be included as part of a wider manifest that also creates a deployment or service.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/security/benchmark/azure/security-controls-v2-network-security#ns-2-connect-private-networks-together",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-kubernetes-policies/bc_azr_kubernetes_4#terraform"
    },
    "Recommendation": {
      "Text": "",
      "Url": "https://learn.microsoft.com/en-us/azure/aks/use-network-policies"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Network Policy requires the Network Policy add-on. This add-on is included automatically when a cluster with Network Policy is created, but for an existing cluster, needs to be added prior to enabling Network Policy. Enabling/Disabling Network Policy causes a rolling update of all cluster nodes, similar to performing a cluster upgrade. This operation is long-running and will block other operations on the cluster (including delete) until it has run to completion. If Network Policy is used, a cluster must have at least 2 nodes of type n1-standard-1 or higher. The recommended minimum size cluster to run Network Policy enforcement is 3 n1-standard-1 instances. Enabling Network Policy enforcement consumes additional resources in nodes. Specifically, it increases the memory footprint of the kube-system process by approximately 128MB, and requires approximately 300 millicores of CPU."
}
```

--------------------------------------------------------------------------------

---[FILE: aks_network_policy_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/aks/aks_network_policy_enabled/aks_network_policy_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.aks.aks_client import aks_client


class aks_network_policy_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, clusters in aks_client.clusters.items():
            for cluster_id, cluster in clusters.items():
                report = Check_Report_Azure(metadata=self.metadata(), resource=cluster)
                report.subscription = subscription_name
                report.status = "PASS"
                report.status_extended = f"Network policy is enabled for cluster '{cluster.name}' in subscription '{subscription_name}'."

                if not getattr(cluster, "network_policy", False):
                    report.status = "FAIL"
                    report.status_extended = f"Network policy is not enabled for cluster '{cluster.name}' in subscription '{subscription_name}'."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apim_client.py]---
Location: prowler-master/prowler/providers/azure/services/apim/apim_client.py

```python
from prowler.providers.azure.services.apim.apim_service import APIM
from prowler.providers.common.provider import Provider

apim_client = APIM(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: apim_service.py]---
Location: prowler-master/prowler/providers/azure/services/apim/apim_service.py
Signals: Pydantic

```python
from datetime import datetime, timedelta
from typing import List, Optional

from azure.mgmt.apimanagement import ApiManagementClient
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService
from prowler.providers.azure.services.logs.loganalytics_client import (
    loganalytics_client,
)
from prowler.providers.azure.services.logs.logsquery_client import logsquery_client
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class APIMInstance(BaseModel):
    """APIM Instance model"""

    id: str
    name: str
    location: str
    log_analytics_workspace_id: Optional[str] = None


class LogsQueryLogEntry(BaseModel):
    """Represents a log entry from Azure Log Analytics query results."""

    time_generated: datetime
    operation_id: str
    caller_ip_address: str
    correlation_id: str


class APIM(AzureService):
    def __init__(self, provider: AzureProvider):
        """Initialize the APIM service client.

        Args:
            provider: The Azure provider instance containing authentication and client configuration
        """
        super().__init__(ApiManagementClient, provider)
        self.instances = self._get_instances()

    def _get_workspace_customer_id(
        self, subscription: str, workspace_arm_id: str
    ) -> Optional[str]:
        """Get the Customer ID (GUID) for a workspace from its full ARM ID.

        This method extracts the resource group and workspace name from the ARM ID
        and queries the Log Analytics client to retrieve the customer ID (GUID)
        needed for workspace-specific queries.

        Args:
            subscription: The Azure subscription ID
            workspace_arm_id: The full ARM ID of the Log Analytics workspace

        Returns:
            The customer ID (GUID) of the workspace if successful, None otherwise
        """
        try:
            resource_group = workspace_arm_id.split("/")[4]
            workspace_name = workspace_arm_id.split("/")[-1]

            workspace = loganalytics_client.clients[subscription].workspaces.get(
                resource_group_name=resource_group, workspace_name=workspace_name
            )
            return workspace.customer_id
        except Exception as error:
            logger.error(
                f"Failed to get customer ID for workspace {workspace_arm_id}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return None

    def _get_log_analytics_workspace_id(
        self, instance_id: str, subscription: str
    ) -> Optional[str]:
        """Retrieve the Log Analytics workspace ARM ID from an APIM instance's diagnostic settings.

        This method queries the Azure Monitor diagnostic settings for a specific APIM
        instance to find the configured Log Analytics workspace. It specifically looks
        for diagnostic settings that have GatewayLogs enabled, which are essential for
        monitoring APIM API calls and operations.

        Args:
            instance_id: The ARM ID of the APIM instance
            subscription: The Azure subscription ID

        Returns:
            The ARM ID of the Log Analytics workspace if diagnostic settings are found
            and GatewayLogs are enabled, None otherwise
        """
        try:
            diagnostic_settings = monitor_client.diagnostic_settings_with_uri(
                subscription, instance_id, monitor_client.clients[subscription]
            )
            for setting in diagnostic_settings:
                if setting.workspace_id and setting.logs:
                    for log_setting in setting.logs:
                        if (
                            log_setting.enabled
                            and log_setting.category == "GatewayLogs"
                        ):
                            logger.info(
                                f"Found enabled Log Analytics workspace for APIM instance {instance_id} with category {log_setting.category}"
                            )
                            return setting.workspace_id
        except Exception as error:
            logger.error(
                f"Failed to get diagnostic settings for {instance_id}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return None

    def _get_instances(self):
        """Get all APIM instances and their configured Log Analytics workspace.

        This method iterates through all accessible Azure subscriptions and retrieves
        all APIM instances within each subscription. For each instance, it also
        determines the associated Log Analytics workspace by checking diagnostic
        settings. The method populates the instances dictionary with APIMInstance
        objects containing all relevant metadata and configuration.

        Returns:
            A dictionary mapping subscription IDs to lists of APIMInstance objects.
            Each APIMInstance contains the instance details and its associated
            Log Analytics workspace ID if configured.
        """
        logger.info("APIM - Getting instances...")
        instances = {}

        for subscription, client in self.clients.items():
            try:
                instances.update({subscription: []})
                apim_instances = client.api_management_service.list()

                for instance in apim_instances:
                    workspace_id = self._get_log_analytics_workspace_id(
                        instance.id, subscription
                    )
                    instances[subscription].append(
                        APIMInstance(
                            id=instance.id,
                            name=instance.name,
                            location=instance.location,
                            log_analytics_workspace_id=workspace_id,
                        )
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

        return instances

    def query_logs(
        self,
        subscription: str,
        query: str,
        timespan: timedelta,
        workspace_customer_id: str,
    ) -> List[LogsQueryLogEntry]:
        """Query a specific Log Analytics workspace using its Customer ID (GUID).

        This method executes Kusto Query Language (KQL) queries against a specific
        Log Analytics workspace. It's used to retrieve log data for analysis and
        monitoring purposes. The method handles the response parsing and converts
        the tabular results into a list of dictionaries for easy consumption.

        Args:
            subscription: The Azure subscription ID
            query: The KQL query string to execute
            timespan: The time range for the query as a timedelta
            workspace_customer_id: The customer ID (GUID) of the Log Analytics workspace

        Returns:
            A list of dictionaries where each dictionary represents a row from the
            query results. The keys are the column names from the query response.
            Returns an empty list if the query fails or returns no results.
        """
        try:
            response = logsquery_client.clients[subscription].query_workspace(
                workspace_id=workspace_customer_id,
                query=query,
                timespan=timespan,
            )

            if response.tables:
                columns = response.tables[0].columns
                rows = response.tables[0].rows
                result = []

                for row in rows:
                    # Create a mapping from Azure column names to our snake_case field names
                    row_dict = dict(zip(columns, row))
                    mapped_dict = {
                        "time_generated": row_dict.get("TimeGenerated"),
                        "operation_id": row_dict.get("OperationId"),
                        "caller_ip_address": row_dict.get("CallerIpAddress"),
                        "correlation_id": row_dict.get("CorrelationId"),
                    }
                    result.append(LogsQueryLogEntry(**mapped_dict))

                return result

        except Exception as error:
            logger.error(
                f"Failed to query Log Analytics workspace with customer ID {workspace_customer_id}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return []

    def get_llm_operations_logs(
        self, subscription: str, instance: APIMInstance, minutes: int = 1440
    ) -> List[LogsQueryLogEntry]:
        """Get LLM-related operations from the APIM instance's specific Log Analytics workspace.

        This method retrieves logs related to Large Language Model (LLM) operations
        from a specific APIM instance. It queries the GatewayLogs table in the
        associated Log Analytics workspace to find API calls and operations that
        may be related to LLM services. The method automatically handles the
        translation from workspace ARM ID to customer ID for querying.

        Args:
            subscription: The Azure subscription ID
            instance: The APIMInstance object containing the instance details
            minutes: The time range in minutes to look back (default: 1440 = 24 hours)

        Returns:
            A list of dictionaries containing log entries with fields like
            time_generated, operation_id, caller_ip_address, and correlation_id.
            Returns an empty list if no workspace is configured or if the query fails.
        """
        if not instance.log_analytics_workspace_id:
            logger.warning(
                f"APIM instance {instance.name} has no configured Log Analytics workspace."
            )
            return []

        # Translate the workspace ARM ID to the Customer ID (GUID) before querying
        workspace_customer_id = self._get_workspace_customer_id(
            subscription, instance.log_analytics_workspace_id
        )
        if not workspace_customer_id:
            return []

        query = f"""
        ApiManagementGatewayLogs
        | where _ResourceId has '{instance.id}'
        | where isnotempty(OperationId)
        | project TimeGenerated, OperationId, CallerIpAddress, CorrelationId
        """
        timespan = timedelta(minutes=minutes)
        return self.query_logs(subscription, query, timespan, workspace_customer_id)
```

--------------------------------------------------------------------------------

---[FILE: apim_threat_detection_llm_jacking.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/apim/apim_threat_detection_llm_jacking/apim_threat_detection_llm_jacking.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "apim_threat_detection_llm_jacking",
  "CheckTitle": "Ensure Azure API Management is protected against LLM Jacking attacks",
  "CheckType": [],
  "ServiceName": "apim",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Azure API Management Instance",
  "Description": "This check analyzes Azure API Management diagnostic logs in Log Analytics to detect potential LLM Jacking attacks by monitoring the frequency of LLM-related operations (ImageGenerations_Create, ChatCompletions_Create, Completions_Create) from individual IP addresses within a configurable time window.",
  "Risk": "LLM Jacking attacks can lead to unauthorized access to AI models, potential data exfiltration, increased costs, and abuse of AI services. Attackers may use these endpoints to generate content, bypass rate limits, or access premium AI capabilities without proper authorization.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/api-management/monitor-api-management",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To protect against LLM Jacking attacks: 1. Enable diagnostic logging for APIM instances and send logs to Log Analytics workspace 2. Configure appropriate thresholds for LLM operation frequency monitoring 3. Set up alerts for suspicious activity patterns 4. Implement rate limiting and IP allowlisting for sensitive AI endpoints 5. Regularly review and analyze APIM access logs for anomalies",
      "Url": "https://learn.microsoft.com/en-us/azure/api-management/monitor-api-management"
    }
  },
  "Categories": [
    "threat-detection",
    "monitoring",
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check requires: 1. APIM diagnostic logging to be enabled and configured to send logs to Log Analytics workspace 2. Log Analytics workspace ID and key to be configured in the audit configuration 3. Appropriate permissions to query Log Analytics workspace"
}
```

--------------------------------------------------------------------------------

---[FILE: apim_threat_detection_llm_jacking.py]---
Location: prowler-master/prowler/providers/azure/services/apim/apim_threat_detection_llm_jacking/apim_threat_detection_llm_jacking.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.apim.apim_client import apim_client
from prowler.providers.azure.services.apim.apim_service import LogsQueryLogEntry


class apim_threat_detection_llm_jacking(Check):
    def execute(self):
        findings = []

        # Get configuration from audit config with defaults
        threshold = float(
            getattr(apim_client, "audit_config", {}).get(
                "apim_threat_detection_llm_jacking_threshold", 0.1
            )
        )
        threat_detection_minutes = getattr(apim_client, "audit_config", {}).get(
            "apim_threat_detection_llm_jacking_minutes", 1440
        )
        monitored_actions = getattr(apim_client, "audit_config", {}).get(
            "apim_threat_detection_llm_jacking_actions",
            [
                # OpenAI API endpoints
                "ImageGenerations_Create",
                "ChatCompletions_Create",
                "Completions_Create",
                "Embeddings_Create",
                "FineTuning_Jobs_Create",
                "Models_List",
                # Azure OpenAI endpoints
                "Deployments_List",
                "Deployments_Get",
                "Deployments_Create",
                "Deployments_Delete",
                # Anthropic endpoints
                "Messages_Create",
                "Claude_Create",
                # Google AI endpoints
                "GenerateContent",
                "GenerateText",
                "GenerateImage",
                # Meta AI endpoints
                "Llama_Create",
                "CodeLlama_Create",
                # Other LLM endpoints
                "Gemini_Generate",
                "Claude_Generate",
                "Llama_Generate",
            ],
        )

        # 1. Aggregate logs from all APIM instances first
        all_llm_logs: List[LogsQueryLogEntry] = []
        for subscription, instances in apim_client.instances.items():
            for instance in instances:
                if instance.log_analytics_workspace_id:
                    logs = apim_client.get_llm_operations_logs(
                        subscription, instance, threat_detection_minutes
                    )
                    all_llm_logs.extend(logs)

            # 2. Perform a single, global analysis on all collected logs
            potential_llm_jacking_attackers = {}
            for log in all_llm_logs:
                operation_name = log.operation_id
                caller_ip = log.caller_ip_address

                if operation_name in monitored_actions and caller_ip:
                    # Use IP address as the principal identifier
                    if caller_ip not in potential_llm_jacking_attackers:
                        potential_llm_jacking_attackers[caller_ip] = set()
                    potential_llm_jacking_attackers[caller_ip].add(operation_name)

            # 3. Check each principal against the threshold and report failures
            found_potential_llm_jacking_attackers = False
            for (
                principal_ip,
                distinct_actions,
            ) in potential_llm_jacking_attackers.items():
                action_ratio = round(len(distinct_actions) / len(monitored_actions), 2)

                if action_ratio > threshold:
                    found_potential_llm_jacking_attackers = True
                    # Build Identity resource for the report
                    resource = {
                        "name": principal_ip,
                        "id": principal_ip,
                    }
                    # Report against the subscription, identifying the offending principal (IP)
                    report = Check_Report_Azure(self.metadata(), resource=resource)
                    report.subscription = subscription
                    report.status = "FAIL"
                    report.status_extended = f"Potential LLM Jacking attack detected from IP address {principal_ip} with a threshold of {action_ratio}."
                    findings.append(report)

            # 4. If no threats were found after checking all principals, create a single PASS report
            if not found_potential_llm_jacking_attackers:
                report = Check_Report_Azure(self.metadata(), resource={})
                report.resource_name = "Azure API Management"
                report.resource_id = "Azure API Management"
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"No potential LLM Jacking attacks detected across all monitored APIM instances in the last {threat_detection_minutes} minutes."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_client.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_client.py

```python
from prowler.providers.azure.services.app.app_service import App
from prowler.providers.common.provider import Provider

app_client = App(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: app_service.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_service.py

```python
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from azure.mgmt.web import WebSiteManagementClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService
from prowler.providers.azure.services.monitor.monitor_client import monitor_client
from prowler.providers.azure.services.monitor.monitor_service import DiagnosticSetting


class App(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(WebSiteManagementClient, provider)
        self.apps = self._get_apps()
        self.functions = self._get_functions()

    def _get_apps(self):
        logger.info("App - Getting apps...")
        apps = {}

        for subscription_name, client in self.clients.items():
            try:
                apps_list = client.web_apps.list()
                apps.update({subscription_name: {}})

                for app in apps_list:
                    # Filter function apps
                    if getattr(app, "kind", "app").startswith("app"):
                        platform_auth = getattr(
                            client.web_apps.get_auth_settings_v2(
                                resource_group_name=app.resource_group, name=app.name
                            ),
                            "platform",
                            None,
                        )

                        # Get app configurations
                        app_configurations = client.web_apps.get_configuration(
                            resource_group_name=app.resource_group, name=app.name
                        )

                        apps[subscription_name].update(
                            {
                                app.id: WebApp(
                                    resource_id=app.id,
                                    name=app.name,
                                    auth_enabled=(
                                        getattr(platform_auth, "enabled", False)
                                        if platform_auth
                                        else False
                                    ),
                                    configurations=SiteConfigResource(
                                        id=app_configurations.id,
                                        name=app_configurations.name,
                                        linux_fx_version=getattr(
                                            app_configurations, "linux_fx_version", ""
                                        ),
                                        java_version=getattr(
                                            app_configurations, "java_version", ""
                                        ),
                                        php_version=getattr(
                                            app_configurations, "php_version", ""
                                        ),
                                        python_version=getattr(
                                            app_configurations, "python_version", ""
                                        ),
                                        http20_enabled=getattr(
                                            app_configurations, "http20_enabled", False
                                        ),
                                        ftps_state=getattr(
                                            app_configurations, "ftps_state", ""
                                        ),
                                        min_tls_version=getattr(
                                            app_configurations, "min_tls_version", ""
                                        ),
                                    ),
                                    client_cert_mode=self._get_client_cert_mode(
                                        getattr(app, "client_cert_enabled", False),
                                        getattr(app, "client_cert_mode", "Ignore"),
                                    ),
                                    monitor_diagnostic_settings=self._get_app_monitor_settings(
                                        app.name, app.resource_group, subscription_name
                                    ),
                                    https_only=getattr(app, "https_only", False),
                                    identity=ManagedServiceIdentity(
                                        principal_id=getattr(
                                            getattr(app, "identity", {}),
                                            "principal_id",
                                            "",
                                        ),
                                        tenant_id=getattr(
                                            getattr(app, "identity", {}),
                                            "tenant_id",
                                            "",
                                        ),
                                        type=getattr(
                                            getattr(app, "identity", {}), "type", ""
                                        ),
                                    ),
                                    location=app.location,
                                    kind=app.kind,
                                )
                            }
                        )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

        return apps

    def _get_functions(self):
        logger.info("Function - Getting functions...")
        functions = {}

        for subscription_name, client in self.clients.items():
            try:
                functions_list = client.web_apps.list()
                functions.update({subscription_name: {}})

                for function in functions_list:
                    # Filter function apps
                    if getattr(function, "kind", "").startswith("functionapp"):
                        # List host keys
                        host_keys = self._get_function_host_keys(
                            subscription_name, function.resource_group, function.name
                        )
                        if host_keys is not None:
                            function_keys = getattr(host_keys, "function_keys", {})
                        else:
                            function_keys = None

                        application_settings = self._list_application_settings(
                            subscription_name, function.resource_group, function.name
                        )

                        function_config = self._get_function_config(
                            subscription_name,
                            function.resource_group,
                            function.name,
                        )

                        functions[subscription_name].update(
                            {
                                function.id: FunctionApp(
                                    id=function.id,
                                    name=function.name,
                                    location=function.location,
                                    kind=function.kind,
                                    function_keys=function_keys,
                                    enviroment_variables=getattr(
                                        application_settings, "properties", None
                                    ),
                                    identity=getattr(function, "identity", None),
                                    public_access=(
                                        False
                                        if getattr(
                                            function, "public_network_access", ""
                                        )
                                        == "Disabled"
                                        else True
                                    ),
                                    vnet_subnet_id=getattr(
                                        function,
                                        "virtual_network_subnet_id",
                                        "",
                                    ),
                                    ftps_state=getattr(
                                        function_config, "ftps_state", None
                                    ),
                                )
                            }
                        )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

        return functions

    def _get_client_cert_mode(self, client_cert_enabled: bool, client_cert_mode: str):
        cert_mode = "Ignore"
        if not client_cert_enabled and client_cert_mode == "OptionalInteractiveUser":
            cert_mode = "Ignore"
        elif client_cert_enabled and client_cert_mode == "OptionalInteractiveUser":
            cert_mode = "Optional"
        elif client_cert_enabled and client_cert_mode == "Optional":
            cert_mode = "Allow"
        elif client_cert_enabled and client_cert_mode == "Required":
            cert_mode = "Required"
        else:
            cert_mode = "Ignore"

        return cert_mode

    def _get_app_monitor_settings(self, app_name, resource_group, subscription):
        logger.info(f"App - Getting monitor diagnostics settings for {app_name}...")
        monitor_diagnostics_settings = []
        try:
            monitor_diagnostics_settings = monitor_client.diagnostic_settings_with_uri(
                self.subscriptions[subscription],
                f"subscriptions/{self.subscriptions[subscription]}/resourceGroups/{resource_group}/providers/Microsoft.Web/sites/{app_name}",
                monitor_client.clients[subscription],
            )
        except Exception as error:
            logger.error(
                f"Subscription name: {self.subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return monitor_diagnostics_settings

    def _get_function_host_keys(self, subscription, resource_group, name):
        try:
            return self.clients[subscription].web_apps.list_host_keys(
                resource_group_name=resource_group,
                name=name,
            )
        except Exception as error:
            logger.error(
                f"Error getting host keys for {name} in {resource_group}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return None

    def _get_function_config(self, subscription, resource_group, name):
        try:
            return self.clients[subscription].web_apps.get_configuration(
                resource_group_name=resource_group,
                name=name,
            )
        except Exception as error:
            logger.error(
                f"Error getting configuration for {name} in {resource_group}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return None

    def _list_application_settings(self, subscription, resource_group, name):
        try:
            return self.clients[subscription].web_apps.list_application_settings(
                resource_group_name=resource_group,
                name=name,
            )
        except Exception as error:
            logger.error(
                f"Error getting application settings for {name} in {resource_group}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return None


@dataclass
class ManagedServiceIdentity:
    principal_id: str
    tenant_id: str
    type: str


@dataclass
class SiteConfigResource:
    id: str
    name: str
    linux_fx_version: str
    java_version: str
    php_version: str
    python_version: str
    http20_enabled: bool
    ftps_state: str
    min_tls_version: str


@dataclass
class WebApp:
    resource_id: str
    name: str
    configurations: SiteConfigResource
    identity: ManagedServiceIdentity
    location: str
    client_cert_mode: str = "Ignore"
    auth_enabled: bool = False
    https_only: bool = False
    monitor_diagnostic_settings: List[DiagnosticSetting] = field(default_factory=list)
    kind: str = "app"


@dataclass
class FunctionApp:
    id: str
    name: str
    location: str
    kind: str
    function_keys: Optional[Dict[str, str]]
    enviroment_variables: Optional[Dict[str, str]]
    identity: ManagedServiceIdentity
    public_access: bool
    vnet_subnet_id: str
    ftps_state: Optional[str]
```

--------------------------------------------------------------------------------

````
