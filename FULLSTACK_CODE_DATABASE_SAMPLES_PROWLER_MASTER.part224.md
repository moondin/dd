---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 224
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 224 of 867)

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

---[FILE: rds_service.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_service.py
Signals: Pydantic

```python
from alibabacloud_rds20140815 import models as rds_models
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.alibabacloud.lib.service.service import AlibabaCloudService


class RDS(AlibabaCloudService):
    """
    RDS (Relational Database Service) class for Alibaba Cloud.

    This class provides methods to interact with Alibaba Cloud RDS service
    to retrieve DB instances and their configurations.
    """

    def __init__(self, provider):
        # Call AlibabaCloudService's __init__
        super().__init__(__class__.__name__, provider, global_service=False)

        # Fetch RDS resources
        self.instances = []
        self.__threading_call__(self._describe_instances)

    def _describe_instances(self, regional_client):
        """List all RDS instances and fetch their details in a specific region."""
        region = getattr(regional_client, "region", "unknown")
        logger.info(f"RDS - Describing instances in {region}...")

        try:
            # DescribeDBInstances returns instance list
            request = rds_models.DescribeDBInstancesRequest()
            response = regional_client.describe_dbinstances(request)

            if response and response.body and response.body.items:
                for instance_data in response.body.items.dbinstance:
                    instance_id = getattr(instance_data, "dbinstance_id", "")

                    if not self.audit_resources or is_resource_filtered(
                        instance_id, self.audit_resources
                    ):

                        # Get additional information for specific checks
                        attribute_info = self._describe_db_instance_attribute(
                            regional_client, instance_id
                        )

                        # Check if SSL is enabled
                        ssl_status = self._describe_db_instance_ssl(
                            regional_client, instance_id
                        )

                        # Check TDE status
                        tde_status = self._describe_db_instance_tde(
                            regional_client, instance_id
                        )

                        # Check whitelist/security IPs
                        security_ips = self._describe_db_instance_ip_array(
                            regional_client, instance_id
                        )

                        # Check SQL audit status (SQL Explorer)
                        audit_status = self._describe_sql_collector_policy(
                            regional_client, instance_id
                        )

                        # Check parameters (log_connections, log_disconnections, log_duration)
                        parameters = self._describe_parameters(
                            regional_client, instance_id
                        )

                        self.instances.append(
                            DBInstance(
                                id=instance_id,
                                name=getattr(
                                    instance_data, "dbinstance_description", instance_id
                                ),
                                region=region,
                                engine=getattr(instance_data, "engine", ""),
                                engine_version=getattr(
                                    instance_data, "engine_version", ""
                                ),
                                status=getattr(instance_data, "dbinstance_status", ""),
                                type=getattr(instance_data, "dbinstance_type", ""),
                                net_type=getattr(
                                    instance_data, "dbinstance_net_type", ""
                                ),
                                connection_mode=getattr(
                                    instance_data, "connection_mode", ""
                                ),
                                public_connection_string=attribute_info.get(
                                    "ConnectionString", ""
                                ),
                                ssl_enabled=ssl_status.get("SSLEnabled", False),
                                tde_status=tde_status.get("TDEStatus", "Disabled"),
                                tde_key_id=tde_status.get("TDEKeyId", ""),
                                security_ips=security_ips,
                                audit_log_enabled=audit_status.get("StoragePeriod")
                                is not None,
                                audit_log_retention=audit_status.get(
                                    "StoragePeriod", 0
                                ),
                                log_connections=parameters.get(
                                    "log_connections", "off"
                                ),
                                log_disconnections=parameters.get(
                                    "log_disconnections", "off"
                                ),
                                log_duration=parameters.get("log_duration", "off"),
                            )
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_db_instance_attribute(
        self, regional_client, instance_id: str
    ) -> dict:
        """Get DB instance attributes including connection string."""
        try:
            request = rds_models.DescribeDBInstanceAttributeRequest()
            request.dbinstance_id = instance_id
            response = regional_client.describe_dbinstance_attribute(request)

            if (
                response
                and response.body
                and response.body.items
                and response.body.items.dbinstance_attribute
            ):
                # The response is a list, usually with one item
                attrs = response.body.items.dbinstance_attribute[0]
                return {"ConnectionString": getattr(attrs, "connection_string", "")}
            return {}
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return {}

    def _describe_db_instance_ssl(self, regional_client, instance_id: str) -> dict:
        """Check if SSL is enabled."""
        try:
            request = rds_models.DescribeDBInstanceSSLRequest()
            request.dbinstance_id = instance_id
            response = regional_client.describe_dbinstance_ssl(request)

            if response and response.body:
                # response.body is a DescribeDBInstanceSSLResponseBody model object, use getattr
                ssl_enabled = getattr(response.body, "sslenabled", "No")
                force_encryption = getattr(response.body, "force_encryption", "0")

                # SSL is enabled if SSLEnabled is "Yes" or ForceEncryption is "1"
                ssl_status = ssl_enabled == "Yes" or force_encryption == "1"
                return {"SSLEnabled": ssl_status}
            return {"SSLEnabled": False}
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            # Some instance types might not support SSL query
            return {"SSLEnabled": False}

    def _describe_db_instance_tde(self, regional_client, instance_id: str) -> dict:
        """Check TDE status."""
        try:
            request = rds_models.DescribeDBInstanceTDERequest()
            request.dbinstance_id = instance_id
            response = regional_client.describe_dbinstance_tde(request)

            if response and response.body:
                return {
                    "TDEStatus": getattr(response.body, "tdestatus", "Disabled"),
                }
            return {"TDEStatus": "Disabled"}
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return {"TDEStatus": "Disabled"}

    def _describe_db_instance_ip_array(self, regional_client, instance_id: str) -> list:
        """Get whitelist IP arrays."""
        try:
            request = rds_models.DescribeDBInstanceIPArrayListRequest()
            request.dbinstance_id = instance_id
            response = regional_client.describe_dbinstance_iparray_list(request)

            ips = []
            if response and response.body and response.body.items:
                for item in response.body.items.dbinstance_iparray:
                    security_ips = getattr(item, "security_ips", "")
                    if security_ips:
                        ips.extend(security_ips.split(","))
            return ips
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return []

    def _describe_sql_collector_policy(self, regional_client, instance_id: str) -> dict:
        """Check SQL audit status."""
        try:
            request = rds_models.DescribeSQLLogRecordsRequest()
            request.dbinstance_id = instance_id

            policy_request = rds_models.DescribeSQLCollectorPolicyRequest()
            policy_request.dbinstance_id = instance_id
            response = regional_client.describe_sqlcollector_policy(policy_request)

            if response and response.body:
                status = getattr(response.body, "sqlcollector_status", "")
                # storage_period is in days
                storage_period = getattr(response.body, "storage_period", 0)

                if status == "Enable":
                    return {"StoragePeriod": storage_period}

            return {}
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return {}

    def _describe_parameters(self, regional_client, instance_id: str) -> dict:
        """Get instance parameters."""
        try:
            request = rds_models.DescribeParametersRequest()
            request.dbinstance_id = instance_id
            response = regional_client.describe_parameters(request)

            params = {}
            if response and response.body and response.body.running_parameters:
                for param in response.body.running_parameters.dbinstance_parameter:
                    key = getattr(param, "parameter_name", "")
                    value = getattr(param, "parameter_value", "")
                    if key in ["log_connections", "log_disconnections", "log_duration"]:
                        params[key] = value.lower()

            return params
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return {}


class DBInstance(BaseModel):
    """RDS DB Instance model."""

    id: str
    name: str
    region: str
    engine: str
    engine_version: str
    status: str
    type: str
    net_type: str
    connection_mode: str
    public_connection_string: str
    ssl_enabled: bool
    tde_status: str
    tde_key_id: str
    security_ips: list
    audit_log_enabled: bool
    audit_log_retention: int  # in days
    log_connections: str
    log_disconnections: str
    log_duration: str
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_no_public_access_whitelist.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_no_public_access_whitelist/rds_instance_no_public_access_whitelist.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "rds_instance_no_public_access_whitelist",
  "CheckTitle": "RDS Instances are not open to the world",
  "CheckType": [
    "Intrusion into applications",
    "Suspicious network connection"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:rds:region:account-id:dbinstance/{dbinstance-id}",
  "Severity": "critical",
  "ResourceType": "AlibabaCloudRDSDBInstance",
  "Description": "Database Server should accept connections only from trusted **Network(s)/IP(s)** and restrict access from the world.\n\nTo minimize attack surface on a Database server Instance, only trusted/known and required IPs should be whitelisted. Authorized network should not have IPs/networks configured to `0.0.0.0` or `/0` which would allow access from anywhere in the world.",
  "Risk": "Allowing **public access** (`0.0.0.0/0`) to the database significantly increases the risk of **brute-force attacks**, **unauthorized access**, and **data exfiltration**.\n\nDatabases exposed to the internet are prime targets for attackers.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/26198.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RDS/disable-network-public-access.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun rds ModifySecurityIps --DBInstanceId <instance_id> --SecurityIps <ip_list>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **RDS Console**\n2. Go to **Data Security** > **Whitelist Settings** tab\n3. Remove any `0.0.0.0` or `/0` entries\n4. Only add the IP addresses that need to access the instance",
      "Url": "https://hub.prowler.com/check/rds_instance_no_public_access_whitelist"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_no_public_access_whitelist.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_no_public_access_whitelist/rds_instance_no_public_access_whitelist.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.rds.rds_client import rds_client


class rds_instance_no_public_access_whitelist(Check):
    """Check if RDS Instances are not open to the world."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for instance in rds_client.instances:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=instance
            )
            report.region = instance.region
            report.resource_id = instance.id
            report.resource_arn = f"acs:rds:{instance.region}:{rds_client.audited_account}:dbinstance/{instance.id}"

            is_public = False
            for ip in instance.security_ips:
                if ip == "0.0.0.0/0" or ip == "0.0.0.0":
                    is_public = True
                    break

            if not is_public:
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Instance {instance.name} is not open to the world."
                )
            else:
                report.status = "FAIL"
                report.status_extended = f"RDS Instance {instance.name} is open to the world (0.0.0.0/0 allowed)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_postgresql_log_connections_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_postgresql_log_connections_enabled/rds_instance_postgresql_log_connections_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "rds_instance_postgresql_log_connections_enabled",
  "CheckTitle": "Parameter log_connections is set to ON for PostgreSQL Database",
  "CheckType": [
    "Intrusion into applications",
    "Unusual logon"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:rds:region:account-id:dbinstance/{dbinstance-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRDSDBInstance",
  "Description": "Enable `log_connections` on **PostgreSQL Servers**. Enabling `log_connections` helps PostgreSQL Database log attempted connections to the server, as well as successful completion of client authentication.\n\nLog data can be used to identify, troubleshoot, and repair configuration errors and suboptimal performance.",
  "Risk": "Without **connection logging**, unauthorized access attempts might go unnoticed, and troubleshooting connection issues becomes more difficult.\n\nThis data is essential for **security monitoring** and **incident investigation**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/96751.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RDS/enable-log-connections-for-postgresql.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun rds ModifyParameter --DBInstanceId <instance_id> --Parameters \"{\\\"log_connections\\\":\\\"on\\\"}\"",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **RDS Console**\n2. Select the region and target instance\n3. In the left-side navigation pane, select **Parameters**\n4. Find the `log_connections` parameter and set it to `on`\n5. Click **Apply Changes**",
      "Url": "https://hub.prowler.com/check/rds_instance_postgresql_log_connections_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_postgresql_log_connections_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_postgresql_log_connections_enabled/rds_instance_postgresql_log_connections_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.rds.rds_client import rds_client


class rds_instance_postgresql_log_connections_enabled(Check):
    """Check if parameter 'log_connections' is set to 'ON' for PostgreSQL Database."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for instance in rds_client.instances:
            if "PostgreSQL" in instance.engine:
                report = CheckReportAlibabaCloud(
                    metadata=self.metadata(), resource=instance
                )
                report.region = instance.region
                report.resource_id = instance.id
                report.resource_arn = f"acs:rds:{instance.region}:{rds_client.audited_account}:dbinstance/{instance.id}"

                if instance.log_connections == "on":
                    report.status = "PASS"
                    report.status_extended = f"RDS PostgreSQL Instance {instance.name} has log_connections enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS PostgreSQL Instance {instance.name} has log_connections disabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_postgresql_log_disconnections_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_postgresql_log_disconnections_enabled/rds_instance_postgresql_log_disconnections_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "rds_instance_postgresql_log_disconnections_enabled",
  "CheckTitle": "Server parameter log_disconnections is set to ON for PostgreSQL Database Server",
  "CheckType": [
    "Intrusion into applications",
    "Unusual logon"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:rds:region:account-id:dbinstance/{dbinstance-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRDSDBInstance",
  "Description": "Enable `log_disconnections` on **PostgreSQL Servers**. Enabling `log_disconnections` helps PostgreSQL Database log session terminations of the server, as well as duration of the session.\n\nLog data can be used to identify, troubleshoot, and repair configuration errors and suboptimal performance.",
  "Risk": "Without **disconnection logging**, it's harder to track session durations and identify abnormal disconnection patterns that might indicate **attacks** or **stability issues**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/96751.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RDS/enable-log-disconnections-for-postgresql.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun rds ModifyParameter --DBInstanceId <instance_id> --Parameters \"{\\\"log_disconnections\\\":\\\"on\\\"}\"",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **RDS Console**\n2. Select the region and target instance\n3. In the left-side navigation pane, select **Parameters**\n4. Find the `log_disconnections` parameter and set it to `on`\n5. Click **Apply Changes**",
      "Url": "https://hub.prowler.com/check/rds_instance_postgresql_log_disconnections_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_postgresql_log_disconnections_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_postgresql_log_disconnections_enabled/rds_instance_postgresql_log_disconnections_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.rds.rds_client import rds_client


class rds_instance_postgresql_log_disconnections_enabled(Check):
    """Check if parameter 'log_disconnections' is set to 'ON' for PostgreSQL Database."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for instance in rds_client.instances:
            if "PostgreSQL" in instance.engine:
                report = CheckReportAlibabaCloud(
                    metadata=self.metadata(), resource=instance
                )
                report.region = instance.region
                report.resource_id = instance.id
                report.resource_arn = f"acs:rds:{instance.region}:{rds_client.audited_account}:dbinstance/{instance.id}"

                if instance.log_disconnections == "on":
                    report.status = "PASS"
                    report.status_extended = f"RDS PostgreSQL Instance {instance.name} has log_disconnections enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS PostgreSQL Instance {instance.name} has log_disconnections disabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_postgresql_log_duration_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_postgresql_log_duration_enabled/rds_instance_postgresql_log_duration_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "rds_instance_postgresql_log_duration_enabled",
  "CheckTitle": "Server parameter log_duration is set to ON for PostgreSQL Database Server",
  "CheckType": [
    "Intrusion into applications"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:rds:region:account-id:dbinstance/{dbinstance-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRDSDBInstance",
  "Description": "Enable `log_duration` on **PostgreSQL Servers**. Enabling `log_duration` helps PostgreSQL Database log the duration of each completed SQL statement which in turn generates query and error logs.\n\nQuery and error logs can be used to identify, troubleshoot, and repair configuration errors and sub-optimal performance.",
  "Risk": "Without **duration logging**, it's difficult to identify **slow queries**, **performance bottlenecks**, and potential **DoS attempts**.\n\nThis information is critical for database performance tuning and security monitoring.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/96751.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RDS/enable-log-duration-for-postgresql.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun rds ModifyParameter --DBInstanceId <instance_id> --Parameters \"{\\\"log_duration\\\":\\\"on\\\"}\"",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **RDS Console**\n2. Select the region and target instance\n3. In the left-side navigation pane, select **Parameters**\n4. Find the `log_duration` parameter and set it to `on`\n5. Click **Apply Changes**",
      "Url": "https://hub.prowler.com/check/rds_instance_postgresql_log_duration_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_postgresql_log_duration_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_postgresql_log_duration_enabled/rds_instance_postgresql_log_duration_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.rds.rds_client import rds_client


class rds_instance_postgresql_log_duration_enabled(Check):
    """Check if parameter 'log_duration' is set to 'ON' for PostgreSQL Database."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for instance in rds_client.instances:
            if "PostgreSQL" in instance.engine:
                report = CheckReportAlibabaCloud(
                    metadata=self.metadata(), resource=instance
                )
                report.region = instance.region
                report.resource_id = instance.id
                report.resource_arn = f"acs:rds:{instance.region}:{rds_client.audited_account}:dbinstance/{instance.id}"

                if instance.log_duration == "on":
                    report.status = "PASS"
                    report.status_extended = f"RDS PostgreSQL Instance {instance.name} has log_duration enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS PostgreSQL Instance {instance.name} has log_duration disabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_sql_audit_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_sql_audit_enabled/rds_instance_sql_audit_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "rds_instance_sql_audit_enabled",
  "CheckTitle": "Auditing is set to On for applicable database instances",
  "CheckType": [
    "Intrusion into applications"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:rds:region:account-id:dbinstance/{dbinstance-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRDSDBInstance",
  "Description": "Enable **SQL auditing** on all RDS instances (except SQL Server 2012/2016/2017 and MariaDB TX). Auditing tracks database events and writes them to an audit log.\n\nIt helps to maintain **regulatory compliance**, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.",
  "Risk": "Without **SQL auditing**, it's difficult to detect **unauthorized access**, **data breaches**, or **malicious activity** within the database.\n\nIt also hinders **forensic investigations** and compliance reporting.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/96123.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RDS/enable-audit-logs.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun rds ModifySQLCollectorPolicy --DBInstanceId <instance_id> --SQLCollectorStatus Enable --StoragePeriod <days>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **RDS Console**\n2. In the left-side navigation pane, select **SQL Explorer**\n3. Click **Activate Now**\n4. Specify the SQL log storage duration\n5. Click **Activate**",
      "Url": "https://hub.prowler.com/check/rds_instance_sql_audit_enabled"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_sql_audit_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_sql_audit_enabled/rds_instance_sql_audit_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.rds.rds_client import rds_client


class rds_instance_sql_audit_enabled(Check):
    """Check if 'Auditing' is set to 'On' for applicable database instances."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for instance in rds_client.instances:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=instance
            )
            report.region = instance.region
            report.resource_id = instance.id
            report.resource_arn = f"acs:rds:{instance.region}:{rds_client.audited_account}:dbinstance/{instance.id}"

            if instance.audit_log_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Instance {instance.name} has SQL audit enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS Instance {instance.name} does not have SQL audit enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_sql_audit_retention.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_sql_audit_retention/rds_instance_sql_audit_retention.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "rds_instance_sql_audit_retention",
  "CheckTitle": "Auditing Retention is greater than the configured period",
  "CheckType": [
    "Intrusion into applications"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:rds:region:account-id:dbinstance/{dbinstance-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRDSDBInstance",
  "Description": "Database **SQL Audit Retention** should be configured to be greater than or equal to the configured period (default: **6 months / 180 days**).\n\nAudit Logs can be used to check for anomalies and give insight into suspected breaches or misuse of information and access.",
  "Risk": "**Short retention periods** for audit logs can result in the loss of critical forensic data needed for **incident investigation** and **compliance auditing**.\n\nMany regulations require minimum retention periods for audit data.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/96123.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RDS/configure-log-retention-period.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun rds ModifySQLCollectorPolicy --DBInstanceId <instance_id> --SQLCollectorStatus Enable --StoragePeriod 180",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **RDS Console**\n2. Select **SQL Explorer**\n3. Click **Service Setting**\n4. Enable `Activate SQL Explorer`\n5. Set the storage duration to `6 months` or longer",
      "Url": "https://hub.prowler.com/check/rds_instance_sql_audit_retention"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_sql_audit_retention.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_sql_audit_retention/rds_instance_sql_audit_retention.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.rds.rds_client import rds_client


class rds_instance_sql_audit_retention(Check):
    """Check if 'Auditing' Retention is greater than the configured period."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        # Get configurable max days from audit config (default: 180 days - 6 months)
        min_audit_retention_days = rds_client.audit_config.get(
            "min_rds_audit_retention_days", 180
        )

        for instance in rds_client.instances:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=instance
            )
            report.region = instance.region
            report.resource_id = instance.id
            report.resource_arn = f"acs:rds:{instance.region}:{rds_client.audited_account}:dbinstance/{instance.id}"

            if (
                instance.audit_log_enabled
                and instance.audit_log_retention >= min_audit_retention_days
            ):
                report.status = "PASS"
                report.status_extended = f"RDS Instance {instance.name} has SQL audit enabled with retention of {instance.audit_log_retention} days (>= {min_audit_retention_days} days)."
            elif instance.audit_log_enabled:
                report.status = "FAIL"
                report.status_extended = f"RDS Instance {instance.name} has SQL audit enabled but retention is {instance.audit_log_retention} days (< {min_audit_retention_days} days)."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS Instance {instance.name} does not have SQL audit enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_ssl_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_ssl_enabled/rds_instance_ssl_enabled.metadata.json
Signals: Next.js

```json
{
  "Provider": "alibabacloud",
  "CheckID": "rds_instance_ssl_enabled",
  "CheckTitle": "RDS instance requires all incoming connections to use SSL",
  "CheckType": [
    "Sensitive file tampering",
    "Intrusion into applications"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:rds:region:account-id:dbinstance/{dbinstance-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRDSDBInstance",
  "Description": "It is recommended to enforce all incoming connections to SQL database instances to use **SSL**.\n\nSQL database connections if successfully intercepted (MITM) can reveal sensitive data like credentials, database queries, and query outputs. For security, it is recommended to always use SSL encryption when connecting to your instance.",
  "Risk": "If **SSL is not enabled**, data in transit (including credentials and query results) can be intercepted by attackers performing **Man-in-the-Middle (MITM) attacks**.\n\nThis compromises data confidentiality and integrity.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/32474.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RDS/enable-encryption-in-transit.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun rds ModifyDBInstanceSSL --DBInstanceId <instance_id> --SSLEnabled 1",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_db_instance\" \"example\" {\n  engine           = \"MySQL\"\n  engine_version   = \"8.0\"\n  instance_type    = \"rds.mysql.s1.small\"\n  instance_storage = 20\n  ssl_action       = \"Open\"\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **RDS Console**\n2. Select the region and target instance\n3. In the left-side navigation pane, click **Data Security**\n4. Click the **SSL Encryption** tab\n5. Click the switch next to **Disabled** in the SSL Encryption parameter to enable it",
      "Url": "https://hub.prowler.com/check/rds_instance_ssl_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_ssl_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_ssl_enabled/rds_instance_ssl_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.rds.rds_client import rds_client


class rds_instance_ssl_enabled(Check):
    """Check if RDS instance requires all incoming connections to use SSL."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for instance in rds_client.instances:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=instance
            )
            report.region = instance.region
            report.resource_id = instance.id
            report.resource_arn = f"acs:rds:{instance.region}:{rds_client.audited_account}:dbinstance/{instance.id}"

            if instance.ssl_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Instance {instance.name} has SSL encryption enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = f"RDS Instance {instance.name} does not have SSL encryption enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
