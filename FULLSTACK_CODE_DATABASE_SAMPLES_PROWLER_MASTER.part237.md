---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 237
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 237 of 867)

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

---[FILE: apigateway_service.py]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class APIGateway(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.rest_apis = []
        self.__threading_call__(self._get_rest_apis)
        self._get_authorizers()
        self._get_rest_api()
        self._get_stages()
        self._get_resources()

    def _get_rest_apis(self, regional_client):
        logger.info("APIGateway - Getting Rest APIs...")
        try:
            get_rest_apis_paginator = regional_client.get_paginator("get_rest_apis")
            for page in get_rest_apis_paginator.paginate():
                for apigw in page["items"]:
                    arn = f"arn:{self.audited_partition}:apigateway:{regional_client.region}::/restapis/{apigw['id']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.rest_apis.append(
                            RestAPI(
                                id=apigw["id"],
                                arn=arn,
                                region=regional_client.region,
                                name=apigw.get("name", ""),
                                tags=[apigw.get("tags")],
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_authorizers(self):
        logger.info("APIGateway - Getting Rest APIs authorizer...")
        try:
            for rest_api in self.rest_apis:
                try:
                    regional_client = self.regional_clients[rest_api.region]
                    authorizers = regional_client.get_authorizers(
                        restApiId=rest_api.id
                    )["items"]
                    if authorizers:
                        rest_api.authorizer = True

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
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_rest_api(self):
        logger.info("APIGateway - Describing Rest API...")
        try:
            for rest_api in self.rest_apis:
                try:
                    regional_client = self.regional_clients[rest_api.region]
                    rest_api_info = regional_client.get_rest_api(restApiId=rest_api.id)
                    if rest_api_info["endpointConfiguration"]["types"] == ["PRIVATE"]:
                        rest_api.public_endpoint = False
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
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_stages(self):
        logger.info("APIGateway - Getting stages for Rest APIs...")
        try:
            for rest_api in self.rest_apis:
                try:
                    regional_client = self.regional_clients[rest_api.region]
                    stages = regional_client.get_stages(restApiId=rest_api.id)
                    for stage in stages["item"]:
                        waf = None
                        logging = False
                        client_certificate = False
                        tracing_enabled = False
                        if "tracingEnabled" in stage:
                            if stage["tracingEnabled"]:
                                tracing_enabled = True
                        cache_enabled = False
                        cache_data_encrypted = False
                        if "webAclArn" in stage:
                            waf = stage["webAclArn"]
                        if "methodSettings" in stage:
                            for settings in stage["methodSettings"].values():
                                if (
                                    settings.get("loggingLevel")
                                    and settings.get("loggingLevel", "") != "OFF"
                                ):
                                    logging = True
                                if settings.get("cachingEnabled"):
                                    cache_enabled = True
                                    if settings.get("cacheDataEncrypted"):
                                        cache_data_encrypted = True
                        if "clientCertificateId" in stage:
                            client_certificate = True
                        arn = f"arn:{self.audited_partition}:apigateway:{regional_client.region}::/restapis/{rest_api.id}/stages/{stage['stageName']}"
                        rest_api.stages.append(
                            Stage(
                                name=stage["stageName"],
                                arn=arn,
                                logging=logging,
                                client_certificate=client_certificate,
                                waf=waf,
                                tags=[stage.get("tags")],
                                tracing_enabled=tracing_enabled,
                                cache_enabled=cache_enabled,
                                cache_data_encrypted=cache_data_encrypted,
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
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_resources(self):
        logger.info("APIGateway - Getting API resources...")
        try:
            for rest_api in self.rest_apis:
                try:
                    regional_client = self.regional_clients[rest_api.region]
                    get_resources_paginator = regional_client.get_paginator(
                        "get_resources"
                    )
                    for page in get_resources_paginator.paginate(restApiId=rest_api.id):
                        for resource in page["items"]:
                            id = resource["id"]
                            resource_methods = []
                            methods_auth = {}
                            for resource_method in resource.get(
                                "resourceMethods", {}
                            ).keys():
                                resource_methods.append(resource_method)

                            for resource_method in resource_methods:
                                if resource_method != "OPTIONS":
                                    method_config = regional_client.get_method(
                                        restApiId=rest_api.id,
                                        resourceId=id,
                                        httpMethod=resource_method,
                                    )
                                    auth_type = method_config["authorizationType"]
                                    methods_auth.update({resource_method: auth_type})

                            rest_api.resources.append(
                                PathResourceMethods(
                                    path=resource["path"], resource_methods=methods_auth
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
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Stage(BaseModel):
    name: str
    arn: str
    logging: bool
    client_certificate: bool
    waf: Optional[str] = None
    tags: Optional[list] = []
    tracing_enabled: Optional[bool] = None
    cache_enabled: Optional[bool] = None
    cache_data_encrypted: Optional[bool] = None


class PathResourceMethods(BaseModel):
    path: str
    resource_methods: dict


class RestAPI(BaseModel):
    id: str
    arn: str
    region: str
    name: str
    authorizer: bool = False
    public_endpoint: bool = True
    stages: list[Stage] = []
    tags: Optional[list] = []
    resources: list[PathResourceMethods] = []
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_authorizers_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_authorizers_enabled/apigateway_restapi_authorizers_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "apigateway_restapi_authorizers_enabled",
  "CheckTitle": "API Gateway REST API has an authorizer at API level or all methods are authorized",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access"
  ],
  "ServiceName": "apigateway",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsApiGatewayRestApi",
  "Description": "**API Gateway REST APIs** are evaluated for **access control**: an **API-level authorizer** is present, or all resource methods use an authorization mechanism. Methods marked `NONE` indicate unauthenticated access.",
  "Risk": "**Unauthenticated API methods** enable:\n- Arbitrary reads exposing data (**confidentiality**)\n- Unauthorized actions against backends (**integrity**)\n- Abuse and high traffic causing cost spikes or outages (**availability**)\n\nAttackers can enumerate endpoints and invoke integrations without tokens.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: set method authorization so it's not public\nResources:\n  <example_resource_name>:\n    Type: AWS::ApiGateway::Method\n    Properties:\n      RestApiId: <example_resource_id>\n      ResourceId: <example_resource_id>\n      HttpMethod: GET\n      AuthorizationType: AWS_IAM  # Critical: authorizes the method (not NONE)\n```",
      "Other": "1. In the AWS Console, go to API Gateway > APIs (REST) and select your API\n2. Open Resources, select a resource, then select a method (e.g., GET)\n3. Click Method Request\n4. Set Authorization to AWS_IAM (or an existing Cognito/Lambda authorizer)\n5. Repeat for every method so none show Authorization = NONE\n6. Deploy the API to apply changes",
      "Terraform": "```hcl\n# Terraform: set method authorization so it's not public\nresource \"aws_api_gateway_method\" \"<example_resource_name>\" {\n  rest_api_id  = \"<example_resource_id>\"\n  resource_id  = \"<example_resource_id>\"\n  http_method  = \"GET\"\n  authorization = \"AWS_IAM\" # Critical: authorizes the method (not NONE)\n}\n```"
    },
    "Recommendation": {
      "Text": "Require **authentication** on every method: use **Cognito user pools**, **Lambda authorizers**, or **IAM**; avoid `NONE`.\n- Enforce **least privilege** with scoped policies\n- Use **private endpoints** or resource policies for internal APIs\n- Add **rate limiting** and **WAF** for defense in depth",
      "Url": "https://hub.prowler.com/check/apigateway_restapi_authorizers_enabled"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "",
  "CheckAliases": [
    "apigateway_authorizers_enabled"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_authorizers_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_authorizers_enabled/apigateway_restapi_authorizers_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.apigateway.apigateway_client import (
    apigateway_client,
)


class apigateway_restapi_authorizers_enabled(Check):
    def execute(self):
        findings = []
        for rest_api in apigateway_client.rest_apis:
            report = Check_Report_AWS(metadata=self.metadata(), resource=rest_api)
            report.resource_id = rest_api.name

            # it there are not authorizers at api level and resources without methods (default case) ->
            report.status = "FAIL"
            report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} does not have an authorizer configured at api level."
            if rest_api.authorizer:
                report.status = "PASS"
                report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} has an authorizer configured at api level"
            else:
                # we want to know if api has not authorizers and all the resources don't have methods configured
                resources_have_methods = False
                all_methods_authorized = True
                resource_paths_with_unathorized_methods = []
                for resource in rest_api.resources:
                    # if the resource has methods test if they have all configured authorizer
                    if resource.resource_methods:
                        resources_have_methods = True
                        for (
                            http_method,
                            authorization_method,
                        ) in resource.resource_methods.items():
                            if authorization_method == "NONE":
                                all_methods_authorized = False
                                unauthorized_method = (
                                    f"{resource.path} -> {http_method}"
                                )
                                resource_paths_with_unathorized_methods.append(
                                    unauthorized_method
                                )
                # if there are methods in at least one resource and are all authorized
                if all_methods_authorized and resources_have_methods:
                    report.status = "PASS"
                    report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} has all methods authorized"
                # if there are methods in at least one result but some of then are not authorized-> list it
                elif not all_methods_authorized:
                    report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} does not have authorizers at api level and the following paths and methods are unauthorized: {'; '.join(resource_paths_with_unathorized_methods)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_cache_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_cache_encrypted/apigateway_restapi_cache_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "apigateway_restapi_cache_encrypted",
  "CheckTitle": "API Gateway REST API stage cache data is encrypted at rest",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "apigateway",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsApiGatewayStage",
  "Description": "API Gateway REST API stages with caching have **cache data encrypted at rest**. The evaluation targets stages where caching is enabled and verifies that stored responses are protected via the `Encrypt cache data` setting.",
  "Risk": "Unencrypted cache contents can expose response payloads, tokens, or PII if cache storage, backups, or admin tooling are accessed outside normal controls, harming **confidentiality** and enabling replay or session hijacking.\n\nDisclosure also reveals API patterns, aiding **lateral movement** and targeted abuse.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.clouddefense.ai/compliance-rules/nist-800-53-5/au/apigateway-stage-cache-encryption-at-rest-enabled",
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html#enable-api-gateway-caching",
    "https://support.icompaas.com/support/solutions/articles/62000233641-ensure-api-gateway-rest-api-cache-data-is-encrypted-at-rest",
    "https://docs.fortifyfox.com/docs/aws-foundational-security-best-practices/apigateway/api-gw-cache-encrypted/index.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/apigateway-controls.html#apigateway-5",
    "https://www.clouddefense.ai/compliance-rules/aws-fs-practices/apigateway/foundational-security-apigateway-5",
    "https://www.cloudanix.com/docs/aws/audit/apigatewaymonitoring/rules/apigateway_enable_encryption_api_cache"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws apigateway update-stage --rest-api-id <restapi-id> --stage-name <stage-name> --patch-operations op=replace,path=/*/*/caching/dataEncrypted,value=true",
      "NativeIaC": "```yaml\n# CloudFormation: enable encryption for all cached methods in a stage\nResources:\n  <example_resource_name>:\n    Type: AWS::ApiGateway::Stage\n    Properties:\n      StageName: <example_resource_name>\n      RestApiId: <example_resource_id>\n      DeploymentId: <example_resource_id>\n      MethodSettings:\n        - ResourcePath: /*\n          HttpMethod: \"*\"\n          CacheDataEncrypted: true  # Critical: encrypt cached responses at rest for all methods\n```",
      "Other": "1. Open the AWS Console and go to API Gateway\n2. Select your REST API, then click Stages and choose the affected stage\n3. In Method overrides (or Cache settings), enable Encrypt cache data\n4. Save changes",
      "Terraform": "```hcl\n# Enable encryption for all cached methods in the stage\nresource \"aws_api_gateway_stage\" \"<example_resource_name>\" {\n  rest_api_id   = \"<example_resource_id>\"\n  stage_name    = \"<example_resource_name>\"\n  deployment_id = \"<example_resource_id>\"\n\n  method_settings {\n    resource_path        = \"/*\"\n    http_method          = \"*\"\n    cache_data_encrypted = true  # Critical: encrypt cached responses at rest\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "- Enable **encryption at rest** for any cached stage (`Encrypt cache data`).\n- Apply **least privilege** to stage administration and cache invalidation.\n- Avoid caching sensitive endpoints; use short TTLs and scheduled cache flushes for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/apigateway_restapi_cache_encrypted"
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

---[FILE: apigateway_restapi_cache_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_cache_encrypted/apigateway_restapi_cache_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.apigateway.apigateway_client import (
    apigateway_client,
)


class apigateway_restapi_cache_encrypted(Check):
    def execute(self):
        findings = []
        for rest_api in apigateway_client.rest_apis:
            for stage in rest_api.stages:
                if stage.cache_enabled:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=stage)
                    report.region = rest_api.region
                    report.resource_id = rest_api.name
                    report.status = "PASS"
                    report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} in stage {stage.name} has cache encryption enabled."
                    if not stage.cache_data_encrypted:
                        report.status = "FAIL"
                        report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} in stage {stage.name} has cache enabled but cache data is not encrypted at rest."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_client_certificate_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_client_certificate_enabled/apigateway_restapi_client_certificate_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "apigateway_restapi_client_certificate_enabled",
  "CheckTitle": "API Gateway REST API stage has client certificate enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Encryption in Transit",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)"
  ],
  "ServiceName": "apigateway",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsApiGatewayStage",
  "Description": "**API Gateway stage** has a **client certificate** configured so HTTP/S integrations can perform **mutual TLS** and authenticate API Gateway to the backend",
  "Risk": "Without client authentication to the backend, requests cannot be proven to originate from API Gateway. Direct calls to the backend may bypass gateway policies, enabling unauthorized access and data tampering. This degrades **integrity** and **confidentiality** and reduces auditability.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/blogs/compute/introducing-mutual-tls-authentication-for-amazon-api-gateway/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws apigateway update-stage --rest-api-id <REST_API_ID> --stage-name <STAGE_NAME> --patch-operations op=replace,path=/clientCertificateId,value=<CLIENT_CERT_ID>",
      "NativeIaC": "```yaml\n# CloudFormation: attach a client certificate to a REST API stage\nResources:\n  ClientCert:\n    Type: AWS::ApiGateway::ClientCertificate\n\n  ApiStage:\n    Type: AWS::ApiGateway::Stage\n    Properties:\n      StageName: <example_resource_name>\n      RestApiId: <example_resource_id>\n      DeploymentId: <example_resource_id>\n      ClientCertificateId: !Ref ClientCert  # Critical: enables client certificate on the stage\n```",
      "Other": "1. In the AWS Console, go to API Gateway > REST APIs and select your API\n2. In the left menu, click Client Certificates and create one (Generate)\n3. In the left menu, click Stages and select the target stage\n4. In Settings, find Client certificate and select the created certificate\n5. Click Save Changes",
      "Terraform": "```hcl\n# Terraform: attach a client certificate to a REST API stage\nresource \"aws_api_gateway_client_certificate\" \"example\" {}\n\nresource \"aws_api_gateway_stage\" \"<example_resource_name>\" {\n  stage_name          = \"<example_resource_name>\"\n  rest_api_id         = \"<example_resource_id>\"\n  deployment_id       = \"<example_resource_id>\"\n  client_certificate_id = aws_api_gateway_client_certificate.example.id  # Critical: enables client certificate on the stage\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **mutual TLS** from API Gateway to the backend with a **client certificate**, and configure the backend to trust only that identity. Apply **zero trust** and **least privilege**: block public access to the backend, restrict networks, rotate certificates, and monitor authentication failures.",
      "Url": "https://hub.prowler.com/check/apigateway_restapi_client_certificate_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "",
  "CheckAliases": [
    "apigateway_client_certificate_enabled"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_client_certificate_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_client_certificate_enabled/apigateway_restapi_client_certificate_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.apigateway.apigateway_client import (
    apigateway_client,
)


class apigateway_restapi_client_certificate_enabled(Check):
    def execute(self):
        findings = []
        for rest_api in apigateway_client.rest_apis:
            for stage in rest_api.stages:
                report = Check_Report_AWS(metadata=self.metadata(), resource=stage)
                report.resource_id = rest_api.name
                report.region = rest_api.region
                if stage.client_certificate:
                    report.status = "PASS"
                    report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} in stage {stage.name} has client certificate enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} in stage {stage.name} does not have client certificate enabled."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_logging_enabled/apigateway_restapi_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "apigateway_restapi_logging_enabled",
  "CheckTitle": "API Gateway REST API stage has logging enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Defense Evasion"
  ],
  "ServiceName": "apigateway",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsApiGatewayStage",
  "Description": "**API Gateway REST API stages** with **stage logging** enabled to emit execution or access logs to CloudWatch",
  "Risk": "Without stage logging, API activity lacks visibility, hindering detection of abuse and incident response.\nAttackers can probe endpoints, exfiltrate data, or tamper integrations without traces, impacting confidentiality, integrity, and availability and blocking forensic investigation.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/security-monitoring.html",
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-logging.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/APIGateway/cloudwatch-logs.html",
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html",
    "https://repost.aws/knowledge-center/api-gateway-cloudwatch-logs",
    "https://repost.aws/knowledge-center/api-gateway-missing-cloudwatch-logs",
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/view-cloudwatch-log-events-in-cloudwatch-console.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws apigateway update-stage --rest-api-id <REST_API_ID> --stage-name <STAGE_NAME> --patch-operations op=replace,path='/*/*/logging/loglevel',value=ERROR",
      "NativeIaC": "```yaml\n# CloudFormation: enable execution logging on a REST API stage\nResources:\n  <example_resource_name>:\n    Type: AWS::ApiGateway::Stage\n    Properties:\n      StageName: <example_resource_name>\n      RestApiId: <example_resource_id>\n      DeploymentId: <example_resource_id>\n      MethodSettings:\n        - ResourcePath: \"/*\"\n          HttpMethod: \"*\"\n          LoggingLevel: ERROR  # CRITICAL: turns on execution logging for all methods\n```",
      "Other": "1. In the API Gateway console, open Settings and set CloudWatch log role ARN if prompted\n2. Go to APIs > select your REST API > Stages > select the stage\n3. Click Logs and tracing > CloudWatch Logs > choose Errors only (or Errors and info)\n4. Save changes",
      "Terraform": "```hcl\n# Enable execution logging for all methods in a REST API stage\nresource \"aws_api_gateway_method_settings\" \"<example_resource_name>\" {\n  rest_api_id = \"<example_resource_id>\"\n  stage_name  = \"<example_resource_name>\"\n  method_path = \"*/*\"\n  settings {\n    logging_level = \"ERROR\"  # CRITICAL: enables stage execution logging\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **CloudWatch Logs** for all API Gateway stages, using `ERROR` or `INFO` as appropriate. Include request IDs (e.g., `$context.requestId`). Enforce **least privilege** on logs, set **retention** and **alerts** for anomalies. Avoid sensitive data in logs and use **defense in depth** with tracing.",
      "Url": "https://hub.prowler.com/check/apigateway_restapi_logging_enabled"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "",
  "CheckAliases": [
    "apigateway_logging_enabled"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_logging_enabled/apigateway_restapi_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.apigateway.apigateway_client import (
    apigateway_client,
)


class apigateway_restapi_logging_enabled(Check):
    def execute(self):
        findings = []
        for rest_api in apigateway_client.rest_apis:
            for stage in rest_api.stages:
                report = Check_Report_AWS(metadata=self.metadata(), resource=stage)
                report.resource_id = rest_api.name
                report.region = rest_api.region
                if stage.logging:
                    report.status = "PASS"
                    report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} in stage {stage.name} has logging enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} in stage {stage.name} has logging disabled."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_public.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_public/apigateway_restapi_public.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "apigateway_restapi_public",
  "CheckTitle": "API Gateway REST API endpoint is private",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access"
  ],
  "ServiceName": "apigateway",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsApiGatewayRestApi",
  "Description": "**Amazon API Gateway REST APIs** are evaluated for endpoint exposure: **internet-accessible** endpoints versus **private VPC-only** access via interface VPC endpoints (`AWS PrivateLink`).",
  "Risk": "Internet exposure increases attack surface:\n- **Confidentiality**: misconfigured or anonymous methods can leak data\n- **Integrity**: unauthorized calls can change backend state\n- **Availability/cost**: bots or DDoS can exhaust capacity and spike spend",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html",
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html#apigateway-resource-policies-source-vpc-example",
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html",
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws apigateway update-rest-api --rest-api-id <REST_API_ID> --patch-operations op=replace,path=/endpointConfiguration/types/0,value=PRIVATE",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::ApiGateway::RestApi\n    Properties:\n      Name: <example_resource_name>\n      EndpointConfiguration:\n        Types:\n          - PRIVATE  # Critical: sets the REST API endpoint to Private, removing public access\n```",
      "Other": "1. Open the AWS console and go to API Gateway\n2. Under REST APIs, select your API\n3. In the left menu, click Settings\n4. Set Endpoint Type to Private\n5. Click Save changes",
      "Terraform": "```hcl\nresource \"aws_api_gateway_rest_api\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  endpoint_configuration {\n    types = [\"PRIVATE\"]  # Critical: makes the REST API private\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Prefer **private** REST APIs reachable via interface VPC endpoints (`PRIVATE`).\n\n*If public access is required*, apply **least privilege** and **defense in depth**:\n- Restrict with resource policies (`aws:SourceVpc`/`aws:SourceVpce`)\n- Enforce strong auth (IAM, Cognito, or authorizers)\n- Add AWS WAF, throttling, usage plans, and comprehensive logging",
      "Url": "https://hub.prowler.com/check/apigateway_restapi_public"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "",
  "CheckAliases": [
    "apigateway_public"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: apigateway_restapi_public.py]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_restapi_public/apigateway_restapi_public.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.apigateway.apigateway_client import (
    apigateway_client,
)


class apigateway_restapi_public(Check):
    def execute(self):
        findings = []
        for rest_api in apigateway_client.rest_apis:
            report = Check_Report_AWS(metadata=self.metadata(), resource=rest_api)
            report.resource_id = rest_api.name

            if rest_api.public_endpoint:
                report.status = "FAIL"
                report.status_extended = f"API Gateway {rest_api.name} ID {rest_api.id} is internet accessible."
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"API Gateway {rest_api.name} ID {rest_api.id} is private."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
