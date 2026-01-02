---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 238
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 238 of 867)

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

---[FILE: apigateway_restapi_public_with_authorizer.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_public_with_authorizer/apigateway_restapi_public_with_authorizer.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "apigateway_restapi_public_with_authorizer",
  "CheckTitle": "API Gateway REST API with a public endpoint has an authorizer configured",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "TTPs/Initial Access/Unauthorized Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "apigateway",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsApiGatewayRestApi",
  "Description": "**API Gateway REST APIs** exposed to the Internet are evaluated for an attached **authorizer** that enforces caller identity (Lambda authorizer or Cognito user pool) on method invocations.\n\nFocus is on whether public endpoints require authenticated requests rather than accepting anonymous calls.",
  "Risk": "Without an **authorizer** on a public API, anonymous callers can:\n- Read or alter data (confidentiality/integrity)\n- Trigger backend actions, impacting systems\n- Abuse traffic, degrading availability and inflating costs\n\nEndpoint enumeration also enables broader discovery and lateral movement.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://support.icompaas.com/support/solutions/articles/62000233640-check-if-api-gateway-public-endpoint-has-an-authorizer-configured",
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html",
    "https://api7.ai/blog/secure-rest-api-in-aws-api-gateway",
    "https://supertokens.com/blog/lambda-authorizers",
    "https://clerk.com/blog/how-to-secure-api-gateway-using-jwt-and-lambda-authorizers-with-clerk",
    "https://aws.plainenglish.io/6-rest-api-security-best-practices-you-can-achieve-with-amazon-api-gateway-2-authentication-62b5171989bd",
    "https://stackoverflow.com/questions/68512642/how-to-configure-aws-api-gateway-without-authorizer",
    "https://auth0.com/docs/customize/integrations/aws/aws-api-gateway-custom-authorizers"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws apigateway create-authorizer --rest-api-id <rest_api_id> --name <example_resource_name> --type TOKEN --authorizer-uri arn:aws:apigateway:<region>:lambda:path/2015-03-31/functions/arn:aws:lambda:<region>:<account-id>:function:<example_resource_name>/invocations --identity-source 'method.request.header.Authorization'",
      "NativeIaC": "```yaml\n# CloudFormation: Create a minimal Lambda TOKEN authorizer for a public REST API\nResources:\n  <example_resource_name>:\n    Type: AWS::ApiGateway::Authorizer\n    Properties:\n      Name: <example_resource_name>\n      RestApiId: <example_resource_id>\n      Type: TOKEN  # Critical: adds an authorizer to the REST API\n      IdentitySource: method.request.header.Authorization  # Critical: header to read token from\n      AuthorizerUri: arn:aws:apigateway:<region>:lambda:path/2015-03-31/functions/arn:aws:lambda:<region>:<account-id>:function/<example_resource_name>/invocations  # Critical: Lambda authorizer function URI\n```",
      "Other": "1. In the AWS Console, open API Gateway and select your REST API\n2. In the left pane, click Authorizers > Create authorizer\n3. Choose Lambda (TOKEN) or Cognito User Pool\n4. For Lambda: select the function and set Identity source to method.request.header.Authorization; for Cognito: select the user pool\n5. Click Create authorizer to add it to the API",
      "Terraform": "```hcl\n# Terraform: Minimal Lambda TOKEN authorizer for API Gateway REST API\nresource \"aws_api_gateway_authorizer\" \"<example_resource_name>\" {\n  name            = \"<example_resource_name>\"\n  rest_api_id     = \"<example_resource_id>\"\n  type            = \"TOKEN\"  # Critical: enables a Lambda authorizer on the REST API\n  identity_source = \"method.request.header.Authorization\"  # Critical: header to read token\n  authorizer_uri  = \"arn:aws:apigateway:<region>:lambda:path/2015-03-31/functions/arn:aws:lambda:<region>:<account-id>:function/<example_resource_name>/invocations\"  # Critical: Lambda authorizer function URI\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **authentication** on all Internet-facing APIs by attaching an **authorizer** (Cognito user pool or Lambda) that validates tokens and scopes.\n\nApply defense in depth:\n- Restrictive resource policies and IP controls\n- WAF, throttling, quotas, rate limits\n- Least-privilege backend access and comprehensive logging",
      "Url": "https://hub.prowler.com/check/apigateway_restapi_public_with_authorizer"
    }
  },
  "Categories": [
    "internet-exposed",
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "",
  "CheckAliases": [
    "apigateway_public_with_authorizer"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_public_with_authorizer.py]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_public_with_authorizer/apigateway_restapi_public_with_authorizer.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.apigateway.apigateway_client import (
    apigateway_client,
)


class apigateway_restapi_public_with_authorizer(Check):
    def execute(self):
        findings = []
        for rest_api in apigateway_client.rest_apis:
            if rest_api.public_endpoint:
                report = Check_Report_AWS(metadata=self.metadata(), resource=rest_api)
                report.resource_id = rest_api.name

                report.status = "PASS"
                report.status_extended = f"API Gateway REST API {rest_api.name} with ID {rest_api.id} has a public endpoint with an authorizer."

                if not rest_api.authorizer:
                    report.status = "FAIL"
                    report.status_extended = f"API Gateway REST API {rest_api.name} with ID {rest_api.id} has a public endpoint without an authorizer."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_tracing_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_tracing_enabled/apigateway_restapi_tracing_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "apigateway_restapi_tracing_enabled",
  "CheckTitle": "API Gateway REST API stage has X-Ray tracing enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "apigateway",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsApiGatewayStage",
  "Description": "**API Gateway REST API stages** have **AWS X-Ray active tracing** enabled to sample incoming requests and produce distributed traces across connected services.",
  "Risk": "Without X-Ray tracing, you lose end-to-end visibility, hindering detection of timeouts, errors, and anomalous latency.\n\nThis delays incident response and root-cause analysis, increasing MTTR and risking partial outages (availability) and undetected integration failures (integrity).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/apigateway-controls.html#apigateway-3",
    "https://docs.aws.amazon.com/xray/latest/devguide/xray-services-apigateway.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/APIGateway/tracing.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws apigateway update-stage --rest-api-id <restapi-id> --stage-name <stage-name> --patch-operations op=replace,path=/tracingEnabled,value=true",
      "NativeIaC": "```yaml\n# CloudFormation: Enable X-Ray tracing on an API Gateway REST API stage\nResources:\n  <example_resource_name>:\n    Type: AWS::ApiGateway::Stage\n    Properties:\n      RestApiId: <example_resource_id>\n      DeploymentId: <example_resource_id>\n      StageName: <example_resource_name>\n      TracingEnabled: true  # Critical: enables AWS X-Ray tracing for this stage\n```",
      "Other": "1. Open the AWS Console and go to API Gateway\n2. Select your REST API and choose Stages\n3. Select the target stage\n4. Open the Logs/Tracing tab, check Enable X-Ray Tracing\n5. Click Save",
      "Terraform": "```hcl\n# Enable X-Ray tracing on an API Gateway REST API stage\nresource \"aws_api_gateway_stage\" \"example\" {\n  rest_api_id = \"<example_resource_id>\"\n  deployment_id = \"<example_resource_id>\"\n  stage_name  = \"<example_resource_name>\"\n  xray_tracing_enabled = true  # Critical: enables AWS X-Ray tracing for this stage\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **X-Ray active tracing** on all API Gateway stages and propagate trace context through downstream services.\n\nUse prudent sampling, correlate traces with logs/metrics, and alert on errors/latency. Apply **least privilege** to X-Ray access and use **defense in depth** for observability.",
      "Url": "https://hub.prowler.com/check/apigateway_restapi_tracing_enabled"
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

---[FILE: apigateway_restapi_tracing_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_tracing_enabled/apigateway_restapi_tracing_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.apigateway.apigateway_client import (
    apigateway_client,
)


class apigateway_restapi_tracing_enabled(Check):
    def execute(self):
        findings = []
        for rest_api in apigateway_client.rest_apis:
            for stage in rest_api.stages:
                report = Check_Report_AWS(metadata=self.metadata(), resource=stage)
                report.region = rest_api.region
                report.resource_id = rest_api.name
                report.status = "FAIL"
                report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} in stage {stage.name} does not have X-Ray tracing enabled."
                if stage.tracing_enabled:
                    report.status = "PASS"
                    report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} in stage {stage.name} has X-Ray tracing enabled."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_waf_acl_attached.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_waf_acl_attached/apigateway_restapi_waf_acl_attached.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "apigateway_restapi_waf_acl_attached",
  "CheckTitle": "API Gateway stage has a WAF Web ACL attached",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "apigateway",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsApiGatewayStage",
  "Description": "**Amazon API Gateway (REST API)** stages are assessed for an associated **AWS WAF web ACL**. The finding reflects whether a `web ACL` is linked at the stage level.",
  "Risk": "Absent a **WAF web ACL**, APIs are exposed to application-layer threats that impact CIA:\n- Confidentiality: data exfiltration via injection\n- Integrity: parameter tampering and path traversal\n- Availability: L7 floods, bot abuse, resource exhaustion\n*Public endpoints face heightened risk.*",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/security-monitoring.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws wafv2 associate-web-acl --web-acl-arn <WEB_ACL_ARN> --resource-arn arn:aws:apigateway:<REGION>::/restapis/<REST_API_ID>/stages/<STAGE_NAME>",
      "NativeIaC": "```yaml\n# CloudFormation: Attach a WAFv2 Web ACL to an API Gateway REST API stage\nResources:\n  <example_resource_name>:\n    Type: AWS::WAFv2::WebACLAssociation\n    Properties:\n      ResourceArn: arn:aws:apigateway:<example_region>::/restapis/<example_resource_id>/stages/<example_stage_name>  # CRITICAL: target API Gateway stage\n      WebACLArn: <example_resource_arn>  # CRITICAL: Web ACL to attach\n```",
      "Other": "1. Open the AWS Console and go to WAF & Shield\n2. Select Web ACLs (Scope: Regional), choose your Web ACL\n3. Click Add AWS resource\n4. Select API Gateway, choose the REST API and the specific Stage\n5. Click Add/Associate to attach the Web ACL",
      "Terraform": "```hcl\n# Attach a WAFv2 Web ACL to an API Gateway REST API stage\nresource \"aws_wafv2_web_acl_association\" \"<example_resource_name>\" {\n  resource_arn = \"arn:aws:apigateway:<example_region>::/restapis/<example_resource_id>/stages/<example_stage_name>\" # CRITICAL: target API Gateway stage\n  web_acl_arn  = \"<example_resource_arn>\" # CRITICAL: Web ACL to attach\n}\n```"
    },
    "Recommendation": {
      "Text": "Attach an **AWS WAF web ACL** to each exposed stage and apply **defense in depth**:\n- Use managed rule groups and tailored allow/deny lists\n- Apply rate limiting to throttle abuse\n- Enforce least-privilege network exposure\n- Continuously tune rules using logs and metrics\n*Validate changes to reduce false positives.*",
      "Url": "https://hub.prowler.com/check/apigateway_restapi_waf_acl_attached"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "",
  "CheckAliases": [
    "apigateway_waf_acl_attached"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_waf_acl_attached.py]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_waf_acl_attached/apigateway_restapi_waf_acl_attached.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.apigateway.apigateway_client import (
    apigateway_client,
)


class apigateway_restapi_waf_acl_attached(Check):
    def execute(self):
        findings = []
        for rest_api in apigateway_client.rest_apis:
            for stage in rest_api.stages:
                report = Check_Report_AWS(metadata=self.metadata(), resource=stage)
                report.resource_id = rest_api.name
                report.region = rest_api.region
                if stage.waf:
                    report.status = "PASS"
                    report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} in stage {stage.name} has {stage.waf} WAF ACL attached."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} in stage {stage.name} does not have WAF ACL attached."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apigatewayv2_client.py]---
Location: prowler-master/prowler/providers/aws/services/apigatewayv2/apigatewayv2_client.py

```python
from prowler.providers.aws.services.apigatewayv2.apigatewayv2_service import (
    ApiGatewayV2,
)
from prowler.providers.common.provider import Provider

apigatewayv2_client = ApiGatewayV2(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: apigatewayv2_service.py]---
Location: prowler-master/prowler/providers/aws/services/apigatewayv2/apigatewayv2_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class ApiGatewayV2(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.apis = []
        self.__threading_call__(self._get_apis)
        self._get_authorizers()
        self._get_stages()

    def _get_apis(self, regional_client):
        logger.info("APIGatewayv2 - Getting APIs...")
        try:
            get_apis_paginator = regional_client.get_paginator("get_apis")
            for page in get_apis_paginator.paginate():
                for apigw in page["Items"]:
                    arn = f"arn:{self.audited_partition}:apigateway:{regional_client.region}::apis/{apigw['ApiId']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.apis.append(
                            API(
                                arn=arn,
                                id=apigw["ApiId"],
                                region=regional_client.region,
                                name=apigw.get("Name", ""),
                                tags=[apigw.get("Tags")],
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_authorizers(self):
        logger.info("APIGatewayv2 - Getting APIs authorizer...")
        try:
            for api in self.apis:
                regional_client = self.regional_clients[api.region]
                authorizers = regional_client.get_authorizers(ApiId=api.id)["Items"]
                if authorizers:
                    api.authorizer = True
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _get_stages(self):
        logger.info("APIGatewayv2 - Getting stages for APIs...")
        try:
            for api in self.apis:
                regional_client = self.regional_clients[api.region]
                stages = regional_client.get_stages(ApiId=api.id)
                for stage in stages["Items"]:
                    logging = False
                    if "AccessLogSettings" in stage:
                        logging = True
                    api.stages.append(
                        Stage(
                            name=stage["StageName"],
                            logging=logging,
                            tags=[stage.get("Tags")],
                        )
                    )
        except ClientError as error:
            if error.response["Error"]["Code"] == "NotFoundException":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )


class Stage(BaseModel):
    name: str
    logging: bool
    tags: Optional[list] = []


class API(BaseModel):
    arn: str
    id: str
    region: str
    name: str
    authorizer: bool = False
    stages: list[Stage] = []
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: apigatewayv2_api_access_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/apigatewayv2/apigatewayv2_api_access_logging_enabled/apigatewayv2_api_access_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "apigatewayv2_api_access_logging_enabled",
  "CheckTitle": "API Gateway V2 API stage has access logging enabled",
  "CheckAliases": [
    "apigatewayv2_access_logging_enabled"
  ],
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "apigatewayv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsApiGatewayV2Stage",
  "Description": "**API Gateway v2** stages have **access logging** configured to capture request details and deliver them to a logging destination (e.g., CloudWatch Logs or Firehose). The evaluation looks for logging being enabled at each API stage.",
  "Risk": "Without access logs, API calls lack traceability, making it hard to spot credential misuse, route abuse, or anomalous traffic.\n\nThis reduces confidentiality and integrity through undetected data access or manipulation, and impacts availability by slowing incident response.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/security-monitoring.html",
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html",
    "https://support.icompaas.com/support/solutions/articles/62000229562-ensure-api-gateway-v2-has-access-logging-enabled",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/APIGateway/api-gateway-stage-access-logging.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws apigatewayv2 update-stage --api-id <API_ID> --stage-name <STAGE_NAME> --access-log-settings DestinationArn=<LOG_GROUP_ARN>,Format='{\"requestId\":\"$context.requestId\"}'",
      "NativeIaC": "```yaml\n# CloudFormation: Enable access logging on API Gateway V2 stage\nResources:\n  <example_resource_name>:\n    Type: AWS::ApiGatewayV2::Stage\n    Properties:\n      ApiId: <example_resource_id>\n      StageName: <example_resource_name>\n      AccessLogSettings: # Critical: enables access logging for the stage\n        DestinationArn: <example_log_group_arn> # CloudWatch Logs log group ARN\n        Format: '{\"requestId\":\"$context.requestId\"}' # Minimal required format\n```",
      "Other": "1. In the AWS Console, go to API Gateway > your HTTP/WebSocket API\n2. Open Stages and select the target stage\n3. In Access logging, enable Access logging\n4. Set Log destination ARN to your CloudWatch log group (or Firehose stream)\n5. Set Log format to: {\"requestId\":\"$context.requestId\"}\n6. Click Save",
      "Terraform": "```hcl\n# Terraform: Enable access logging on API Gateway V2 stage\nresource \"aws_apigatewayv2_stage\" \"<example_resource_name>\" {\n  api_id = \"<example_resource_id>\"\n  name   = \"<example_resource_name>\"\n\n  access_log_settings { # Critical: enables access logging for the stage\n    destination_arn = \"<example_log_group_arn>\"\n    format          = \"{\\\"requestId\\\":\\\"$context.requestId\\\"}\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **stage-level access logging** to a centralized destination and use structured formats. Apply appropriate retention and restrict log access per **least privilege**. Integrate logs with monitoring and alerts to detect anomalies, and complement with **defense in depth** controls.",
      "Url": "https://hub.prowler.com/check/apigatewayv2_api_access_logging_enabled"
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

---[FILE: apigatewayv2_api_access_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/apigatewayv2/apigatewayv2_api_access_logging_enabled/apigatewayv2_api_access_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.apigatewayv2.apigatewayv2_client import (
    apigatewayv2_client,
)


class apigatewayv2_api_access_logging_enabled(Check):
    def execute(self):
        findings = []
        for api in apigatewayv2_client.apis:
            report = Check_Report_AWS(metadata=self.metadata(), resource=api)
            for stage in api.stages:
                if stage.logging:
                    report.status = "PASS"
                    report.status_extended = f"API Gateway V2 {api.name} ID {api.id} in stage {stage.name} has access logging enabled."
                    report.resource_id = f"{api.name}-{stage.name}"
                else:
                    report.status = "FAIL"
                    report.status_extended = f"API Gateway V2 {api.name} ID {api.id} in stage {stage.name} has access logging disabled."
                    report.resource_id = f"{api.name}-{stage.name}"

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apigatewayv2_api_authorizers_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/apigatewayv2/apigatewayv2_api_authorizers_enabled/apigatewayv2_api_authorizers_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "apigatewayv2_api_authorizers_enabled",
  "CheckTitle": "API Gateway V2 API has an authorizer configured",
  "CheckAliases": [
    "apigatewayv2_authorizers_enabled"
  ],
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "TTPs/Initial Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "apigatewayv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsApiGatewayV2Api",
  "Description": "**API Gateway v2 APIs** use **authorizers** (JWT/Cognito or Lambda) to authenticate requests. This evaluates whether an API has an authorizer configured to control access to its routes.",
  "Risk": "Without an authorizer, anyone can invoke routes.\n- Confidentiality: exposure of data and metadata\n- Integrity: unauthorized state changes or actions\n- Availability/Cost: automated abuse of backends, traffic spikes, and unexpected spend",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html",
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html",
    "https://support.icompaas.com/support/solutions/articles/62000127114-ensure-api-gateway-has-configured-authorizers"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws apigatewayv2 create-authorizer --api-id <API_ID> --authorizer-type REQUEST --name <example_resource_name> --authorizer-uri arn:aws:apigateway:<REGION>:lambda:path/2015-03-31/functions/<LAMBDA_FUNCTION_ARN>/invocations --identity-source '$request.header.Authorization'",
      "NativeIaC": "```yaml\n# CloudFormation: create a minimal Lambda authorizer for API Gateway v2\nResources:\n  <example_resource_name>:\n    Type: AWS::ApiGatewayV2::Authorizer\n    Properties:\n      ApiId: <example_resource_id>\n      AuthorizerType: REQUEST  # Critical: enables a Lambda REQUEST authorizer on the API\n      AuthorizerUri: arn:aws:apigateway:<REGION>:lambda:path/2015-03-31/functions/<LAMBDA_FUNCTION_ARN>/invocations  # Critical: Lambda authorizer function to invoke\n      IdentitySource:  # Critical: where to read the auth token from\n        - \"$request.header.Authorization\"\n      Name: <example_resource_name>\n```",
      "Other": "1. In the AWS Console, go to API Gateway > APIs and select your HTTP/WebSocket API\n2. In the left nav, click Authorizers > Create authorizer\n3. Choose Lambda as the authorizer type and select your Lambda function\n4. Set Identity source to: $request.header.Authorization\n5. Click Create to add the authorizer",
      "Terraform": "```hcl\n# Minimal AWS API Gateway v2 Lambda authorizer\nresource \"aws_apigatewayv2_authorizer\" \"<example_resource_name>\" {\n  api_id           = \"<example_resource_id>\"\n  name             = \"<example_resource_name>\"\n  authorizer_type  = \"REQUEST\"  # Critical: creates a Lambda REQUEST authorizer\n  authorizer_uri   = \"arn:aws:apigateway:<REGION>:lambda:path/2015-03-31/functions/<LAMBDA_FUNCTION_ARN>/invocations\"  # Critical: Lambda to invoke\n  identity_sources = [\"$request.header.Authorization\"]  # Critical: identity source for authorization\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable an **authorizer** (JWT/Cognito or Lambda) so only authenticated principals can invoke routes.\n- Enforce **least privilege** with scopes/claims or policy decisions\n- Apply **defense in depth** with resource policies, throttling, and WAF\n- Avoid public routes unless explicitly required",
      "Url": "https://hub.prowler.com/check/apigatewayv2_api_authorizers_enabled"
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

---[FILE: apigatewayv2_api_authorizers_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/apigatewayv2/apigatewayv2_api_authorizers_enabled/apigatewayv2_api_authorizers_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.apigatewayv2.apigatewayv2_client import (
    apigatewayv2_client,
)


class apigatewayv2_api_authorizers_enabled(Check):
    def execute(self):
        findings = []
        for api in apigatewayv2_client.apis:
            report = Check_Report_AWS(metadata=self.metadata(), resource=api)
            report.resource_id = api.name
            report.status = "FAIL"
            report.status_extended = f"API Gateway V2 {api.name} ID {api.id} does not have an authorizer configured."
            if api.authorizer:
                report.status = "PASS"
                report.status_extended = f"API Gateway V2 {api.name} ID {api.id} has an authorizer configured."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: appstream_client.py]---
Location: prowler-master/prowler/providers/aws/services/appstream/appstream_client.py

```python
from prowler.providers.aws.services.appstream.appstream_service import AppStream
from prowler.providers.common.provider import Provider

appstream_client = AppStream(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: appstream_service.py]---
Location: prowler-master/prowler/providers/aws/services/appstream/appstream_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class AppStream(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.fleets = []
        self.__threading_call__(self._describe_fleets)
        self._list_tags_for_resource()

    def _describe_fleets(self, regional_client):
        logger.info("AppStream - Describing Fleets...")
        try:
            describe_fleets_paginator = regional_client.get_paginator("describe_fleets")
            for page in describe_fleets_paginator.paginate():
                for fleet in page["Fleets"]:
                    if not self.audit_resources or (
                        is_resource_filtered(fleet["Arn"], self.audit_resources)
                    ):
                        self.fleets.append(
                            Fleet(
                                arn=fleet["Arn"],
                                name=fleet["Name"],
                                max_user_duration_in_seconds=fleet[
                                    "MaxUserDurationInSeconds"
                                ],
                                disconnect_timeout_in_seconds=fleet[
                                    "DisconnectTimeoutInSeconds"
                                ],
                                idle_disconnect_timeout_in_seconds=fleet.get(
                                    "IdleDisconnectTimeoutInSeconds"
                                ),
                                enable_default_internet_access=fleet[
                                    "EnableDefaultInternetAccess"
                                ],
                                region=regional_client.region,
                            )
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("AppStream - List Tags...")
        try:
            for fleet in self.fleets:
                regional_client = self.regional_clients[fleet.region]
                response = regional_client.list_tags_for_resource(
                    ResourceArn=fleet.arn
                )["Tags"]
                fleet.tags = [response]
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Fleet(BaseModel):
    arn: str
    name: str
    max_user_duration_in_seconds: int
    disconnect_timeout_in_seconds: int
    idle_disconnect_timeout_in_seconds: Optional[int]
    enable_default_internet_access: bool
    region: str
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: appstream_fleet_default_internet_access_disabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/appstream/appstream_fleet_default_internet_access_disabled/appstream_fleet_default_internet_access_disabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "appstream_fleet_default_internet_access_disabled",
  "CheckTitle": "AppStream fleet has default internet access disabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "appstream",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Amazon AppStream fleets** are assessed for the `EnableDefaultInternetAccess` setting, identifying fleets where streaming instances have default Internet connectivity.",
  "Risk": "**Direct Internet access** gives streaming instances public exposure. Threats include:\n- Remote exploitation and malware, undermining **confidentiality** and **integrity**\n- Uncontrolled egress enabling **data exfiltration**\n\nIt also enforces ~100-instance limits, reducing **availability** for high-concurrency deployments.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/appstream2/latest/developerguide/set-up-stacks-fleets.html",
    "https://support.icompaas.com/support/solutions/articles/62000233540-ensure-default-internet-access-from-your-amazon-appstream-fleet-streaming-instances-remains-unchecked",
    "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html",
    "https://docs.aws.amazon.com/appstream2/latest/developerguide/internet-access.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws appstream update-fleet --name <example_resource_name> --no-enable-default-internet-access",
      "NativeIaC": "```yaml\n# CloudFormation: disable default internet access on an AppStream fleet\nResources:\n  <example_resource_name>:\n    Type: AWS::AppStream::Fleet\n    Properties:\n      Name: <example_resource_name>\n      InstanceType: <INSTANCE_TYPE>\n      EnableDefaultInternetAccess: false  # Critical: disables default internet access to pass the check\n```",
      "Other": "1. In the AWS console, go to Amazon AppStream 2.0 > Fleets\n2. Select the target fleet\n3. If the fleet is RUNNING, click Actions > Stop and wait until the state is Stopped\n4. Click Edit (or Modify)\n5. Uncheck \"Default internet access\" (Disable \"Enable default internet access\")\n6. Save/Update the fleet and start it if needed",
      "Terraform": "```hcl\n# Terraform: disable default internet access on an AppStream fleet\nresource \"aws_appstream_fleet\" \"<example_resource_name>\" {\n  name          = \"<example_resource_name>\"\n  instance_type = \"stream.standard.small\"\n  image_name    = \"<IMAGE_NAME>\"\n  compute_capacity { desired_instances = 1 }\n\n  enable_default_internet_access = false  # Critical: disables default internet access to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Disable default Internet access (`EnableDefaultInternetAccess=false`) and place fleets in **private subnets**. Provide egress via **NAT gateways** or proxies, enforce **egress filtering**, and apply **least privilege** and **zero trust** to restrict outbound traffic. Use private connectivity to AWS services where possible.",
      "Url": "https://hub.prowler.com/check/appstream_fleet_default_internet_access_disabled"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Infrastructure Security"
}
```

--------------------------------------------------------------------------------

---[FILE: appstream_fleet_default_internet_access_disabled.py]---
Location: prowler-master/prowler/providers/aws/services/appstream/appstream_fleet_default_internet_access_disabled/appstream_fleet_default_internet_access_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.appstream.appstream_client import appstream_client


# Check if there are AppStream Fleets with the default internet access enabled
class appstream_fleet_default_internet_access_disabled(Check):
    """Check if there are AppStream Fleets with the default internet access enabled"""

    def execute(self):
        """Execute the appstream_fleet_default_internet_access_disabled check"""
        findings = []
        for fleet in appstream_client.fleets:
            report = Check_Report_AWS(metadata=self.metadata(), resource=fleet)

            if fleet.enable_default_internet_access:
                report.status = "FAIL"
                report.status_extended = (
                    f"Fleet {fleet.name} has default internet access enabled."
                )
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"Fleet {fleet.name} has default internet access disabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
