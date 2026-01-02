---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 239
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 239 of 867)

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

---[FILE: appstream_fleet_maximum_session_duration.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/appstream/appstream_fleet_maximum_session_duration/appstream_fleet_maximum_session_duration.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "appstream_fleet_maximum_session_duration",
  "CheckTitle": "AppStream fleet maximum user session duration is less than 10 hours",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "appstream",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AppStream fleets** enforce a **maximum user session duration**. This finding evaluates each fleet's configured limit against a threshold-default `10 hours` (`36000` seconds)-and identifies fleets whose session duration exceeds that limit.",
  "Risk": "Overlong sessions widen the window for **session hijacking**, **lateral movement**, and **data exfiltration** if endpoints or tokens are compromised. Reduced reauthentication weakens **confidentiality** and **integrity**, and extended access can increase **costs** and resource contention.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/appstream2/latest/developerguide/set-up-stacks-fleets.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws appstream update-fleet --name <example_resource_name> --max-user-duration-in-seconds 3600",
      "NativeIaC": "```yaml\n# CloudFormation: Set AppStream Fleet session duration below 10 hours\nResources:\n  AppStreamFleet:\n    Type: AWS::AppStream::Fleet\n    Properties:\n      Name: \"<example_resource_name>\"\n      MaxUserDurationInSeconds: 3600  # CRITICAL: ensures max session duration is < 10h to pass the check\n```",
      "Other": "1. Open the AWS Console and go to Amazon AppStream 2.0\n2. Click Fleets and select <example_resource_name>\n3. Click Edit\n4. Set Maximum session duration to a value under 10 hours (e.g., 3600 seconds)\n5. Save changes",
      "Terraform": "```hcl\n# Terraform: Set AppStream Fleet session duration below 10 hours\nresource \"aws_appstream_fleet\" \"<example_resource_name>\" {\n  name                         = \"<example_resource_name>\"\n  max_user_duration_in_seconds = 3600 # CRITICAL: ensures max session duration is < 10h to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Configure the **maximum session duration** to `<= 10 hours` (e.g., `600` minutes) or less based on data sensitivity. Prefer shorter limits, enforce **reauthentication** on renewal, apply **least privilege**, and enable **idle timeouts**. Monitor session activity as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/appstream_fleet_maximum_session_duration"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Infrastructure Security"
}
```

--------------------------------------------------------------------------------

---[FILE: appstream_fleet_maximum_session_duration.py]---
Location: prowler-master/prowler/providers/aws/services/appstream/appstream_fleet_maximum_session_duration/appstream_fleet_maximum_session_duration.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.appstream.appstream_client import appstream_client


class appstream_fleet_maximum_session_duration(Check):
    """Check if there are AppStream Fleets with the user maximum session duration no longer than 10 hours"""

    def execute(self):
        """Execute the appstream_fleet_maximum_session_duration check"""

        # max_session_duration_seconds, default: 36000 seconds (10 hours)
        max_session_duration_seconds = appstream_client.audit_config.get(
            "max_session_duration_seconds", 36000
        )

        findings = []
        for fleet in appstream_client.fleets:
            report = Check_Report_AWS(metadata=self.metadata(), resource=fleet)

            if fleet.max_user_duration_in_seconds < max_session_duration_seconds:
                report.status = "PASS"
                report.status_extended = f"Fleet {fleet.name} has the maximum session duration configured for less that 10 hours."
            else:
                report.status = "FAIL"
                report.status_extended = f"Fleet {fleet.name} has the maximum session duration configured for more that 10 hours."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: appstream_fleet_session_disconnect_timeout.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/appstream/appstream_fleet_session_disconnect_timeout/appstream_fleet_session_disconnect_timeout.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "appstream_fleet_session_disconnect_timeout",
  "CheckTitle": "AppStream fleet session disconnect timeout is 5 minutes or less",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "appstream",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AppStream fleets** are evaluated for `DisconnectTimeoutInSeconds` being at or below `300` seconds (5 minutes), which defines how long a streaming session remains active after a user disconnects.",
  "Risk": "Long disconnect times keep sessions active, enabling **session hijacking** or unintended reconnection on lost/stolen devices. This raises data exposure (confidentiality), permits unauthorized actions (integrity), and ties up capacity and costs (availability/operations).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/appstream2/latest/developerguide/set-up-stacks-fleets.html",
    "https://awscli.amazonaws.com/v2/documentation/api/2.9.6/reference/appstream/update-fleet.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws appstream update-fleet --name <example_resource_name> --disconnect-timeout-in-seconds 300",
      "NativeIaC": "```yaml\n# CloudFormation: Set AppStream Fleet disconnect timeout to 5 minutes or less\nResources:\n  ExampleFleet:\n    Type: AWS::AppStream::Fleet\n    Properties:\n      Name: <example_resource_name>\n      InstanceType: stream.standard.medium\n      ImageName: <example_image_name>\n      ComputeCapacity:\n        DesiredInstances: 1\n      DisconnectTimeoutInSeconds: 300  # CRITICAL: ensures session disconnect timeout is <= 300s\n```",
      "Other": "1. In the AWS console, go to Amazon AppStream 2.0 > Fleets\n2. Select the fleet <example_resource_name> and choose Edit\n3. Set Disconnect timeout to 5 minutes (300 seconds) or less\n4. Save changes",
      "Terraform": "```hcl\n# Terraform: Set AppStream Fleet disconnect timeout to 5 minutes or less\nresource \"aws_appstream_fleet\" \"<example_resource_name>\" {\n  name          = \"<example_resource_name>\"\n  instance_type = \"stream.standard.medium\"\n  image_name    = \"<example_image_name>\"\n\n  compute_capacity {\n    desired_instances = 1\n  }\n\n  disconnect_timeout_in_seconds = 300  # CRITICAL: ensures timeout is <= 300s\n}\n```"
    },
    "Recommendation": {
      "Text": "Set `DisconnectTimeoutInSeconds` to `300` or less across fleets. Pair with a short `IdleDisconnectTimeoutInSeconds`, require re-authentication on reconnect, and enforce **least privilege**. Monitor session events and use **defense in depth** (network restrictions, device posture) to reduce takeover risk.",
      "Url": "https://hub.prowler.com/check/appstream_fleet_session_disconnect_timeout"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Infrastructure Security"
}
```

--------------------------------------------------------------------------------

---[FILE: appstream_fleet_session_disconnect_timeout.py]---
Location: prowler-master/prowler/providers/aws/services/appstream/appstream_fleet_session_disconnect_timeout/appstream_fleet_session_disconnect_timeout.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.appstream.appstream_client import appstream_client


class appstream_fleet_session_disconnect_timeout(Check):
    """Check if there are AppStream Fleets with the session disconnect timeout set to 5 minutes or less"""

    def execute(self):
        """Execute the appstream_fleet_maximum_session_duration check"""

        # max_disconnect_timeout_in_seconds, default: 300 seconds (5 minutes)
        max_disconnect_timeout_in_seconds = appstream_client.audit_config.get(
            "max_disconnect_timeout_in_seconds", 300
        )

        findings = []
        for fleet in appstream_client.fleets:
            report = Check_Report_AWS(metadata=self.metadata(), resource=fleet)

            if fleet.disconnect_timeout_in_seconds <= max_disconnect_timeout_in_seconds:
                report.status = "PASS"
                report.status_extended = f"Fleet {fleet.name} has the session disconnect timeout set to less than 5 minutes."

            else:
                report.status = "FAIL"
                report.status_extended = f"Fleet {fleet.name} has the session disconnect timeout set to more than 5 minutes."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: appstream_fleet_session_idle_disconnect_timeout.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/appstream/appstream_fleet_session_idle_disconnect_timeout/appstream_fleet_session_idle_disconnect_timeout.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "appstream_fleet_session_idle_disconnect_timeout",
  "CheckTitle": "AppStream fleet session idle disconnect timeout is 10 minutes or less",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "appstream",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Amazon AppStream fleets** are evaluated for the **idle disconnect timeout** setting, confirming it is configured to `10 minutes` (`<=600s`) or less before inactive users are dropped and the session's `disconnect_timeout` window begins.",
  "Risk": "**Long idle sessions** keep desktops/apps accessible without user presence, enabling **session hijacking**, **shoulder surfing**, and **data exposure**. They also **consume capacity** and extend **billing**, reducing **availability** for other users.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/appstream2/latest/developerguide/set-up-stacks-fleets.html",
    "https://awscli.amazonaws.com/v2/documentation/api/2.9.6/reference/appstream/update-fleet.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws appstream update-fleet --name <FLEET_NAME> --idle-disconnect-timeout-in-seconds 600",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::AppStream::Fleet\n    Properties:\n      Name: <example_resource_name>\n      InstanceType: stream.standard.small\n      ComputeCapacity:\n        DesiredInstances: 1\n      IdleDisconnectTimeoutInSeconds: 600  # Critical: set to 10 minutes or less to pass the check\n```",
      "Other": "1. Open the AWS Console and go to AppStream 2.0 > Fleets\n2. Select your fleet and click Edit\n3. Find \"Idle disconnect timeout\"\n4. Set it to 10 minutes (600 seconds) or less\n5. Click Save",
      "Terraform": "```hcl\nresource \"aws_appstream_fleet\" \"<example_resource_name>\" {\n  name          = \"<example_resource_name>\"\n  instance_type = \"stream.standard.small\"\n  image_name    = \"<IMAGE_NAME>\"\n\n  compute_capacity {\n    desired_instances = 1\n  }\n\n  idle_disconnect_timeout_in_seconds = 600  # Critical: enforce <= 10 minutes to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Configure an **idle disconnect timeout 10 minutes**. Pair with a short `disconnect_timeout`, require **re-authentication** on reconnect, and enforce **least privilege**. Monitor session metrics and adjust per role to balance **security**, **cost**, and **user experience**.",
      "Url": "https://hub.prowler.com/check/appstream_fleet_session_idle_disconnect_timeout"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Infrastructure Security"
}
```

--------------------------------------------------------------------------------

---[FILE: appstream_fleet_session_idle_disconnect_timeout.py]---
Location: prowler-master/prowler/providers/aws/services/appstream/appstream_fleet_session_idle_disconnect_timeout/appstream_fleet_session_idle_disconnect_timeout.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.appstream.appstream_client import appstream_client


class appstream_fleet_session_idle_disconnect_timeout(Check):
    """Check if there are AppStream Fleets with the idle disconnect timeout set to 10 minutes or less"""

    def execute(self):
        """Execute the appstream_fleet_session_idle_disconnect_timeout check"""

        # max_idle_disconnect_timeout_in_seconds, default: 600 seconds (10 minutes)
        max_idle_disconnect_timeout_in_seconds = appstream_client.audit_config.get(
            "max_idle_disconnect_timeout_in_seconds", 600
        )

        findings = []
        for fleet in appstream_client.fleets:
            report = Check_Report_AWS(metadata=self.metadata(), resource=fleet)

            if (
                fleet.idle_disconnect_timeout_in_seconds
                and fleet.idle_disconnect_timeout_in_seconds
                <= max_idle_disconnect_timeout_in_seconds
            ):
                report.status = "PASS"
                report.status_extended = f"Fleet {fleet.name} has the session idle disconnect timeout set to less than 10 minutes."

            else:
                report.status = "FAIL"
                report.status_extended = f"Fleet {fleet.name} has the session idle disconnect timeout set to more than 10 minutes."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: appsync_client.py]---
Location: prowler-master/prowler/providers/aws/services/appsync/appsync_client.py

```python
from prowler.providers.aws.services.appsync.appsync_service import AppSync
from prowler.providers.common.provider import Provider

appsync_client = AppSync(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: appsync_service.py]---
Location: prowler-master/prowler/providers/aws/services/appsync/appsync_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class AppSync(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.graphql_apis = {}
        self.__threading_call__(self._list_graphql_apis)

    def _list_graphql_apis(self, regional_client):
        logger.info("AppSync - Describing APIs...")
        try:
            list_graphql_apis_paginator = regional_client.get_paginator(
                "list_graphql_apis"
            )
            for page in list_graphql_apis_paginator.paginate():
                for api in page["graphqlApis"]:
                    api_arn = api["arn"]
                    if not self.audit_resources or (
                        is_resource_filtered(
                            api_arn,
                            self.audit_resources,
                        )
                    ):
                        self.graphql_apis[api_arn] = GraphqlApi(
                            id=api["apiId"],
                            name=api["name"],
                            arn=api_arn,
                            region=regional_client.region,
                            type=api.get("apiType", "GRAPHQL"),
                            field_log_level=api.get("logConfig", {}).get(
                                "fieldLogLevel", ""
                            ),
                            authentication_type=api.get(
                                "authenticationType", "API_KEY"
                            ),
                            tags=[api.get("tags", {})],
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class GraphqlApi(BaseModel):
    id: str
    name: str
    arn: str
    region: str
    type: str
    field_log_level: str
    authentication_type: str
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: appsync_field_level_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/appsync/appsync_field_level_logging_enabled/appsync_field_level_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "appsync_field_level_logging_enabled",
  "CheckTitle": "AWS AppSync API has field-level logging set to ALL or ERROR",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "appsync",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsAppSyncGraphQLApi",
  "Description": "**AWS AppSync GraphQL APIs** have **field-level logging** configured at the resolver level. The check looks for log levels of `ERROR` or `ALL` to confirm field resolution events are recorded.",
  "Risk": "Without **field-level logs**, resolver access and mutations lack **auditability**, reducing detection of data exfiltration and tampering (**confidentiality and integrity**). Limited traces hinder incident response and root-cause analysis, increasing recovery time.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://theburningmonk.com/2020/09/how-to-sample-appsync-resolver-logs/",
    "https://lumigo.io/blog/how-to-monitor-and-debug-appsync-apis/",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/appsync-controls.html#appsync-2",
    "https://docs.aws.amazon.com/appsync/latest/APIReference/API_LogConfig.html",
    "https://blog.graphbolt.dev/debugging-aws-appsync-apis-with-cloudwatch",
    "https://support.icompaas.com/support/solutions/articles/62000233678-ensure-aws-appsync-should-have-field-level-logging-enabled"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws appsync update-graphql-api --api-id <example_resource_id> --name <api-name> --authentication-type AWS_IAM --log-config fieldLogLevel=ERROR,cloudWatchLogsRoleArn=<cloudwatch_logs_role_arn>",
      "NativeIaC": "```yaml\n# CloudFormation - Enable field-level logging for AppSync API\nResources:\n  <example_resource_name>:\n    Type: AWS::AppSync::GraphQLApi\n    Properties:\n      Name: <example_resource_name>\n      AuthenticationType: AWS_IAM\n      LogConfig:\n        CloudWatchLogsRoleArn: arn:aws:iam::<account-id>:role/<example_resource_name>  # CRITICAL: allows AppSync to write logs\n        FieldLogLevel: ERROR  # CRITICAL: sets field-level logging to a compliant level\n```",
      "Other": "1. In the AWS Console, go to AppSync and open your GraphQL API\n2. Go to Settings > Logging\n3. Turn on Enable logs\n4. Set Field resolver log level to ERROR (or ALL)\n5. Select an IAM role that allows AppSync to write to CloudWatch Logs\n6. Click Save",
      "Terraform": "```hcl\n# Terraform - Enable field-level logging for AppSync API\nresource \"aws_appsync_graphql_api\" \"<example_resource_name>\" {\n  name                = \"<example_resource_name>\"\n  authentication_type = \"AWS_IAM\"\n\n  log_config {\n    cloudwatch_logs_role_arn = \"<cloudwatch_logs_role_arn>\" # CRITICAL: permits logging to CloudWatch\n    field_log_level          = \"ERROR\"                        # CRITICAL: compliant field-level logging\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "- Enable field-level logging at least `ERROR`; raise to `INFO`/`DEBUG`/`ALL` only for troubleshooting.\n- Enforce **least privilege** on the logging role.\n- Avoid sensitive data in logs; limit verbose content.\n- Set retention and consider log **sampling** to balance visibility and cost.",
      "Url": "https://hub.prowler.com/check/appsync_field_level_logging_enabled"
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

---[FILE: appsync_field_level_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/appsync/appsync_field_level_logging_enabled/appsync_field_level_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.appsync.appsync_client import appsync_client


class appsync_field_level_logging_enabled(Check):
    def execute(self):
        findings = []
        # Check only GraphQL APIs because boto3 does not have a method to get other types of AppSync APIs (list_apis is not working)
        for api in appsync_client.graphql_apis.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=api)
            report.status = "PASS"
            report.status_extended = (
                f"AppSync API {api.name} has field log level enabled."
            )
            if api.field_log_level != "ALL" and api.field_log_level != "ERROR":
                report.status = "FAIL"
                report.status_extended = (
                    f"AppSync API {api.name} does not have field log level enabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: appsync_graphql_api_no_api_key_authentication.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/appsync/appsync_graphql_api_no_api_key_authentication/appsync_graphql_api_no_api_key_authentication.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "appsync_graphql_api_no_api_key_authentication",
  "CheckTitle": "AWS AppSync GraphQL API does not use API key authentication",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "TTPs/Initial Access/Unauthorized Access"
  ],
  "ServiceName": "appsync",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsAppSyncGraphQLApi",
  "Description": "**AWS AppSync GraphQL APIs** are examined for the default authorization type. The finding indicates an API configured with `API_KEY` instead of IAM, Cognito, OIDC, or Lambda authorizers.",
  "Risk": "Static **API keys** can be leaked or reused, enabling unauthorized queries and mutations.\n- **Confidentiality**: unrestricted data reads\n- **Integrity**: unauthorized writes and schema misuse\n- **Accountability**: no user identity for auditing, difficult revocation and scoping",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/blogs/mobile/graphql-security-appsync-amplify/",
    "https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html",
    "https://support.icompaas.com/support/solutions/articles/62000233666-ensure-aws-appsync-graphql-apis-should-not-be-authenticated-with-api-keys",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/appsync-controls.html#appsync-5"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws appsync update-graphql-api --api-id <api-id> --name <api-name> --authentication-type AWS_IAM",
      "NativeIaC": "```yaml\n# CloudFormation: set default auth to non-API key\nResources:\n  <example_resource_name>:\n    Type: AWS::AppSync::GraphQLApi\n    Properties:\n      Name: <example_resource_name>\n      AuthenticationType: AWS_IAM  # Critical: switches default auth away from API_KEY\n```",
      "Other": "1. In the AWS Console, go to AppSync > APIs and select your GraphQL API\n2. Open Settings (Authorization)\n3. Change Default authorization mode to AWS IAM (or Cognito/OIDC/Lambda)\n4. Click Save",
      "Terraform": "```hcl\n# AppSync GraphQL API with non-API key auth\nresource \"aws_appsync_graphql_api\" \"<example_resource_name>\" {\n  name                = \"<example_resource_name>\"\n  authentication_type = \"AWS_IAM\"  # Critical: avoids API_KEY default auth\n}\n```"
    },
    "Recommendation": {
      "Text": "Replace `API_KEY` with stronger modes and apply least privilege:\n- **AWS_IAM** for service-to-service\n- **Cognito User Pools** or **OIDC** for end users\n- **Lambda authorizer** for custom logic\n*If guest access is unavoidable*, limit to read-only fields, enforce throttling, use short key lifetimes, and apply schema-level authorization.",
      "Url": "https://hub.prowler.com/check/appsync_graphql_api_no_api_key_authentication"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: appsync_graphql_api_no_api_key_authentication.py]---
Location: prowler-master/prowler/providers/aws/services/appsync/appsync_graphql_api_no_api_key_authentication/appsync_graphql_api_no_api_key_authentication.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.appsync.appsync_client import appsync_client


class appsync_graphql_api_no_api_key_authentication(Check):
    def execute(self):
        findings = []
        for api in appsync_client.graphql_apis.values():
            if api.type == "GRAPHQL":
                report = Check_Report_AWS(metadata=self.metadata(), resource=api)
                report.status = "PASS"
                report.status_extended = f"AppSync GraphQL API {api.name} is not using an API KEY for authentication."
                if api.authentication_type == "API_KEY":
                    report.status = "FAIL"
                    report.status_extended = f"AppSync GraphQL API {api.name} is using an API KEY for authentication."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: athena_client.py]---
Location: prowler-master/prowler/providers/aws/services/athena/athena_client.py

```python
from prowler.providers.aws.services.athena.athena_service import Athena
from prowler.providers.common.provider import Provider

athena_client = Athena(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: athena_service.py]---
Location: prowler-master/prowler/providers/aws/services/athena/athena_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel, Field

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Athena(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.workgroups = {}
        self.__threading_call__(self._list_workgroups)
        self.__threading_call__(self._get_workgroups, self.workgroups.values())
        self._list_query_executions()
        self._list_tags_for_resource()

    def _list_workgroups(self, regional_client):
        logger.info("Athena - Listing WorkGroups...")
        try:
            list_workgroups = regional_client.list_work_groups()
            for workgroup in list_workgroups["WorkGroups"]:
                try:
                    workgroup_name = workgroup["Name"]
                    workgroup_arn = f"arn:{self.audited_partition}:athena:{regional_client.region}:{self.audited_account}:workgroup/{workgroup_name}"
                    if not self.audit_resources or (
                        is_resource_filtered(workgroup_arn, self.audit_resources)
                    ):
                        self.workgroups[workgroup_arn] = WorkGroup(
                            arn=workgroup_arn,
                            name=workgroup_name,
                            state=workgroup["State"],
                            region=regional_client.region,
                        )
                except Exception as error:
                    logger.error(
                        f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_workgroups(self, workgroup):
        logger.info("Athena - Getting WorkGroups...")
        try:
            wg = self.regional_clients[workgroup.region].get_work_group(
                WorkGroup=workgroup.name
            )

            wg_configuration = wg.get("WorkGroup").get("Configuration")
            self.workgroups[workgroup.arn].enforce_workgroup_configuration = (
                wg_configuration.get("EnforceWorkGroupConfiguration", False)
            )

            # We include an empty EncryptionConfiguration to handle if the workgroup does not have encryption configured
            encryption = (
                wg_configuration.get(
                    "ResultConfiguration",
                    {"EncryptionConfiguration": {}},
                )
                .get(
                    "EncryptionConfiguration",
                    {"EncryptionOption": ""},
                )
                .get("EncryptionOption")
            )

            if encryption in ["SSE_S3", "SSE_KMS", "CSE_KMS"]:
                encryption_configuration = EncryptionConfiguration(
                    encryption_option=encryption, encrypted=True
                )
                self.workgroups[workgroup.arn].encryption_configuration = (
                    encryption_configuration
                )

            workgroup.cloudwatch_logging = wg_configuration.get(
                "PublishCloudWatchMetricsEnabled", False
            )
        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_query_executions(self):
        logger.info("Athena - Listing Queries...")
        try:
            for workgroup in self.workgroups.values():
                try:
                    queries = (
                        self.regional_clients[workgroup.region]
                        .list_query_executions(WorkGroup=workgroup.name)
                        .get("QueryExecutionIds", [])
                    )
                    if queries:
                        workgroup.queries = True
                except Exception as error:
                    logger.error(
                        f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("Athena - Listing Tags...")
        try:
            for workgroup in self.workgroups.values():
                try:
                    regional_client = self.regional_clients[workgroup.region]
                    workgroup.tags = regional_client.list_tags_for_resource(
                        ResourceARN=workgroup.arn
                    ).get("Tags", [])
                except Exception as error:
                    logger.error(
                        f"{workgroup.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class EncryptionConfiguration(BaseModel):
    encryption_option: str
    encrypted: bool


class WorkGroup(BaseModel):
    arn: str
    name: str
    state: str
    encryption_configuration: EncryptionConfiguration = EncryptionConfiguration(
        encryption_option="", encrypted=False
    )
    enforce_workgroup_configuration: bool = False
    queries: bool = False
    region: str
    cloudwatch_logging: bool = False
    tags: Optional[list] = Field(default_factory=list)
```

--------------------------------------------------------------------------------

---[FILE: athena_workgroup_encryption.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/athena/athena_workgroup_encryption/athena_workgroup_encryption.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "athena_workgroup_encryption",
  "CheckTitle": "Athena workgroup encrypts query results in S3 with server-side encryption",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Effects/Data Exposure"
  ],
  "ServiceName": "athena",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsAthenaWorkGroup",
  "Description": "**Athena workgroups** are evaluated for **encryption of query results** to confirm result data is stored encrypted at rest, whether saved in Amazon S3 or via managed query results",
  "Risk": "Unencrypted query outputs can be read at rest by unintended principals through S3 misconfigurations or cross-account access.\n\nImpact: **Confidentiality loss**, enabling **data exfiltration** and supporting **lateral movement** by exposing sensitive fields outside intended boundaries.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/blogs/big-data/introducing-managed-query-results-for-amazon-athena/",
    "https://docs.aws.amazon.com/athena/latest/ug/managed-results.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Athena/encryption-enabled.html",
    "https://docs.aws.amazon.com/athena/latest/ug/encrypting-managed-results.html",
    "https://docs.aws.amazon.com/athena/latest/ug/encrypting-query-results-stored-in-s3.html",
    "https://docs.aws.amazon.com/athena/latest/ug/workgroups-minimum-encryption.html",
    "https://aws.amazon.com/blogs/aws/launch-amazon-athena-adds-support-for-querying-encrypted-data/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws athena update-work-group --work-group <workgroup_name> --configuration-updates ResultConfigurationUpdates={EncryptionConfiguration={EncryptionOption=SSE_S3}}",
      "NativeIaC": "```yaml\n# CloudFormation: Enable encryption of Athena workgroup query results\nResources:\n  <example_resource_name>:\n    Type: AWS::Athena::WorkGroup\n    Properties:\n      Name: <example_resource_name>\n      WorkGroupConfiguration:\n        ResultConfiguration:\n          EncryptionConfiguration:\n            EncryptionOption: SSE_S3  # Critical: enables server-side encryption for query results\n```",
      "Other": "1. In the AWS Console, go to Amazon Athena > Workgroups\n2. Select the workgroup and click Edit\n3. Under Query result configuration, set a Results location if empty\n4. Check Encrypt query results and select SSE-S3\n5. Click Save changes",
      "Terraform": "```hcl\n# Terraform: Enable encryption of Athena workgroup query results\nresource \"aws_athena_workgroup\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  configuration {\n    result_configuration {\n      output_location = \"s3://<example_bucket>/\"  # Required S3 path for query results\n      encryption_configuration {\n        encryption_option = \"SSE_S3\"  # Critical: enables encryption for query results\n      }\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable and enforce **workgroup result encryption** with **AWS KMS customer managed keys** (`SSE_KMS` or managed results with a KMS key). Set a minimum encryption level and prevent client overrides. Apply **least privilege** to key and result access, rotate keys, and audit usage to maintain defense in depth.",
      "Url": "https://hub.prowler.com/check/athena_workgroup_encryption"
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

---[FILE: athena_workgroup_encryption.py]---
Location: prowler-master/prowler/providers/aws/services/athena/athena_workgroup_encryption/athena_workgroup_encryption.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.athena.athena_client import athena_client


class athena_workgroup_encryption(Check):
    """Check if there are Athena workgroups not encrypting query results"""

    def execute(self):
        """Execute the athena_workgroup_encryption check"""
        findings = []
        for workgroup in athena_client.workgroups.values():
            # Only check for enabled and used workgroups (has recent queries)
            if (
                workgroup.state == "ENABLED" and workgroup.queries
            ) or athena_client.provider.scan_unused_services:
                report = Check_Report_AWS(metadata=self.metadata(), resource=workgroup)

                if workgroup.encryption_configuration.encrypted:
                    report.status = "PASS"
                    report.status_extended = f"Athena WorkGroup {workgroup.name} encrypts the query results using {workgroup.encryption_configuration.encryption_option}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Athena WorkGroup {workgroup.name} does not encrypt the query results."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
