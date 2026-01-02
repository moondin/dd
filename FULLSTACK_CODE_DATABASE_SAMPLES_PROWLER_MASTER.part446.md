---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 446
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 446 of 867)

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

---[FILE: apigateway_restapi_tracing_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/apigateway/apigateway_restapi_tracing_enabled/apigateway_restapi_tracing_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_apigateway_restapi_tracing_enabled:
    @mock_aws
    def test_apigateway_no_rest_apis(self):
        from prowler.providers.aws.services.apigateway.apigateway_service import (
            APIGateway,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.apigateway.apigateway_restapi_tracing_enabled.apigateway_restapi_tracing_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_tracing_enabled.apigateway_restapi_tracing_enabled import (
                apigateway_restapi_tracing_enabled,
            )

            check = apigateway_restapi_tracing_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_apigateway_one_rest_api_with_logging(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )
        # Get the rest api's root id
        root_resource_id = apigateway_client.get_resources(restApiId=rest_api["id"])[
            "items"
        ][0]["id"]
        resource = apigateway_client.create_resource(
            restApiId=rest_api["id"],
            parentId=root_resource_id,
            pathPart="test-path",
        )
        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=resource["id"],
            httpMethod="GET",
            authorizationType="NONE",
        )
        apigateway_client.put_integration(
            restApiId=rest_api["id"],
            resourceId=resource["id"],
            httpMethod="GET",
            type="HTTP",
            integrationHttpMethod="POST",
            uri="http://test.com",
        )
        apigateway_client.create_deployment(
            restApiId=rest_api["id"],
            stageName="test",
        )
        apigateway_client.update_stage(
            restApiId=rest_api["id"],
            stageName="test",
            patchOperations=[
                {
                    "op": "replace",
                    "path": "/tracingEnabled",
                    "value": "true",
                },
            ],
        )
        from prowler.providers.aws.services.apigateway.apigateway_service import (
            APIGateway,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.apigateway.apigateway_restapi_tracing_enabled.apigateway_restapi_tracing_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_tracing_enabled.apigateway_restapi_tracing_enabled import (
                apigateway_restapi_tracing_enabled,
            )

            check = apigateway_restapi_tracing_enabled()
            result = check.execute()

            assert result[0].status == "PASS"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} in stage test has X-Ray tracing enabled."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}/stages/test"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [None]

    @mock_aws
    def test_apigateway_one_rest_api_without_logging(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Rest API
        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )
        # Get the rest api's root id
        root_resource_id = apigateway_client.get_resources(restApiId=rest_api["id"])[
            "items"
        ][0]["id"]
        resource = apigateway_client.create_resource(
            restApiId=rest_api["id"],
            parentId=root_resource_id,
            pathPart="test-path",
        )
        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=resource["id"],
            httpMethod="GET",
            authorizationType="NONE",
        )
        apigateway_client.put_integration(
            restApiId=rest_api["id"],
            resourceId=resource["id"],
            httpMethod="GET",
            type="HTTP",
            integrationHttpMethod="POST",
            uri="http://test.com",
        )
        apigateway_client.create_deployment(
            restApiId=rest_api["id"],
            stageName="test",
        )
        apigateway_client.update_stage(
            restApiId=rest_api["id"],
            stageName="test",
            patchOperations=[
                {
                    "op": "replace",
                    "path": "/tracingEnabled",
                    "value": "false",
                },
            ],
        )

        from prowler.providers.aws.services.apigateway.apigateway_service import (
            APIGateway,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.apigateway.apigateway_restapi_tracing_enabled.apigateway_restapi_tracing_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_tracing_enabled.apigateway_restapi_tracing_enabled import (
                apigateway_restapi_tracing_enabled,
            )

            check = apigateway_restapi_tracing_enabled()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} in stage test does not have X-Ray tracing enabled."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}/stages/test"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [None]
```

--------------------------------------------------------------------------------

---[FILE: apigateway_waf_acl_attached_test.py]---
Location: prowler-master/tests/providers/aws/services/apigateway/apigateway_waf_acl_attached/apigateway_waf_acl_attached_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_apigateway_restapi_waf_acl_attached:
    @mock_aws
    def test_apigateway_no_rest_apis(self):
        from prowler.providers.aws.services.apigateway.apigateway_service import (
            APIGateway,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.apigateway.apigateway_restapi_waf_acl_attached.apigateway_restapi_waf_acl_attached.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_waf_acl_attached.apigateway_restapi_waf_acl_attached import (
                apigateway_restapi_waf_acl_attached,
            )

            check = apigateway_restapi_waf_acl_attached()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_apigateway_one_rest_api_with_waf(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        waf_client = client("wafv2", region_name=AWS_REGION_US_EAST_1)
        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )
        # Get the rest api's root id
        root_resource_id = apigateway_client.get_resources(restApiId=rest_api["id"])[
            "items"
        ][0]["id"]
        resource = apigateway_client.create_resource(
            restApiId=rest_api["id"],
            parentId=root_resource_id,
            pathPart="test-path",
        )
        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=resource["id"],
            httpMethod="GET",
            authorizationType="NONE",
        )
        apigateway_client.put_integration(
            restApiId=rest_api["id"],
            resourceId=resource["id"],
            httpMethod="GET",
            type="HTTP",
            integrationHttpMethod="POST",
            uri="http://test.com",
        )
        apigateway_client.create_deployment(
            restApiId=rest_api["id"],
            stageName="test",
        )
        waf_arn = waf_client.create_web_acl(
            Name="test",
            Scope="REGIONAL",
            DefaultAction={"Allow": {}},
            VisibilityConfig={
                "SampledRequestsEnabled": False,
                "CloudWatchMetricsEnabled": False,
                "MetricName": "idk",
            },
        )["Summary"]["ARN"]
        waf_client.associate_web_acl(
            WebACLArn=waf_arn,
            ResourceArn=f"arn:aws:apigateway:{apigateway_client.meta.region_name}::/restapis/{rest_api['id']}/stages/test",
        )

        from prowler.providers.aws.services.apigateway.apigateway_service import (
            APIGateway,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.apigateway.apigateway_restapi_waf_acl_attached.apigateway_restapi_waf_acl_attached.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_waf_acl_attached.apigateway_restapi_waf_acl_attached import (
                apigateway_restapi_waf_acl_attached,
            )

            check = apigateway_restapi_waf_acl_attached()
            result = check.execute()

            assert result[0].status == "PASS"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} in stage test has {waf_arn} WAF ACL attached."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}/stages/test"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [None]

    @mock_aws
    def test_apigateway_one_rest_api_without_waf(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Rest API
        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )
        # Get the rest api's root id
        root_resource_id = apigateway_client.get_resources(restApiId=rest_api["id"])[
            "items"
        ][0]["id"]
        resource = apigateway_client.create_resource(
            restApiId=rest_api["id"],
            parentId=root_resource_id,
            pathPart="test-path",
        )
        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=resource["id"],
            httpMethod="GET",
            authorizationType="NONE",
        )
        apigateway_client.put_integration(
            restApiId=rest_api["id"],
            resourceId=resource["id"],
            httpMethod="GET",
            type="HTTP",
            integrationHttpMethod="POST",
            uri="http://test.com",
        )
        apigateway_client.create_deployment(
            restApiId=rest_api["id"],
            stageName="test",
        )

        from prowler.providers.aws.services.apigateway.apigateway_service import (
            APIGateway,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.apigateway.apigateway_restapi_waf_acl_attached.apigateway_restapi_waf_acl_attached.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_waf_acl_attached.apigateway_restapi_waf_acl_attached import (
                apigateway_restapi_waf_acl_attached,
            )

            check = apigateway_restapi_waf_acl_attached()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} in stage test does not have WAF ACL attached."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}/stages/test"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [None]
```

--------------------------------------------------------------------------------

---[FILE: apigatewayv2_service_test.py]---
Location: prowler-master/tests/providers/aws/services/apigatewayv2/apigatewayv2_service_test.py

```python
import botocore
from boto3 import client
from mock import patch
from moto import mock_aws

from prowler.providers.aws.services.apigatewayv2.apigatewayv2_service import (
    ApiGatewayV2,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking ApiGatewayV2 Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    We have to mock every AWS API call using Boto3

    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816
    """
    if operation_name == "GetAuthorizers":
        return {"Items": [{"AuthorizerId": "authorizer-id", "Name": "test-authorizer"}]}
    elif operation_name == "GetStages":
        if kwarg["ApiId"] == "not-found-api":
            raise botocore.exceptions.ClientError(
                {
                    "Error": {
                        "Code": "NotFoundException",
                        "Message": "API not found",
                    }
                },
                "GetStages",
            )
        return {
            "Items": [
                {
                    "AccessLogSettings": {
                        "DestinationArn": "string",
                        "Format": "string",
                    },
                    "StageName": "test-stage",
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_ApiGatewayV2_Service:
    # Test ApiGatewayV2 Service
    @mock_aws
    def test_service(self):
        # ApiGatewayV2 client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigatewayv2 = ApiGatewayV2(aws_provider)
        assert apigatewayv2.service == "apigatewayv2"

    # Test ApiGatewayV2 Client
    @mock_aws
    def test_client(self):
        # ApiGatewayV2 client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigatewayv2 = ApiGatewayV2(aws_provider)
        for regional_client in apigatewayv2.regional_clients.values():
            assert regional_client.__class__.__name__ == "ApiGatewayV2"

    # Test ApiGatewayV2 Session
    @mock_aws
    def test__get_session__(self):
        # ApiGatewayV2 client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigatewayv2 = ApiGatewayV2(aws_provider)
        assert apigatewayv2.session.__class__.__name__ == "Session"

    # Test ApiGatewayV2 Session
    @mock_aws
    def test_audited_account(self):
        # ApiGatewayV2 client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigatewayv2 = ApiGatewayV2(aws_provider)
        assert apigatewayv2.audited_account == AWS_ACCOUNT_NUMBER

    # Test ApiGatewayV2 Get APIs
    @mock_aws
    def test_get_apis(self):
        # Generate ApiGatewayV2 Client
        apigatewayv2_client = client("apigatewayv2", region_name=AWS_REGION_US_EAST_1)
        # Create ApiGatewayV2 API
        apigatewayv2_client.create_api(
            Name="test-api", ProtocolType="HTTP", Tags={"test": "test"}
        )
        # ApiGatewayV2 client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigatewayv2 = ApiGatewayV2(aws_provider)
        assert len(apigatewayv2.apis) == len(apigatewayv2_client.get_apis()["Items"])
        assert apigatewayv2.apis[0].tags == [{"test": "test"}]

    # Test ApiGatewayV2 Get Authorizers
    @mock_aws
    def test_get_authorizers(self):
        # Generate ApiGatewayV2 Client
        apigatewayv2_client = client("apigatewayv2", region_name=AWS_REGION_US_EAST_1)
        # Create ApiGatewayV2 Rest API
        api = apigatewayv2_client.create_api(Name="test-api", ProtocolType="HTTP")
        # Create authorizer
        apigatewayv2_client.create_authorizer(
            ApiId=api["ApiId"],
            AuthorizerType="REQUEST",
            IdentitySource=[],
            Name="auth1",
            AuthorizerPayloadFormatVersion="2.0",
        )
        # ApiGatewayV2 client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigatewayv2 = ApiGatewayV2(aws_provider)
        assert apigatewayv2.apis[0].authorizer is True

    # Test ApiGatewayV2 Get Stages
    @mock_aws
    def test_get_stages(self):
        # Generate ApiGatewayV2 Client
        apigatewayv2_client = client("apigatewayv2", region_name=AWS_REGION_US_EAST_1)
        # Create ApiGatewayV2 Rest API and a deployment stage
        apigatewayv2_client.create_api(Name="test-api", ProtocolType="HTTP")

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigatewayv2 = ApiGatewayV2(aws_provider)
        assert apigatewayv2.apis[0].stages[0].logging is True

    # Test ApiGatewayV2 Get Stages with NotFoundException
    @mock_aws
    @patch("prowler.providers.aws.services.apigatewayv2.apigatewayv2_service.logger")
    def test_get_stages_not_found_exception(self, mock_logger):
        # Generate ApiGatewayV2 Client
        apigatewayv2_client = client("apigatewayv2", region_name=AWS_REGION_US_EAST_1)
        # Create ApiGatewayV2 Rest API
        apigatewayv2_client.create_api(Name="test-api", ProtocolType="HTTP")

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigatewayv2 = ApiGatewayV2(aws_provider)

        # Force API ID to trigger NotFoundException
        apigatewayv2.apis[0].id = "not-found-api"

        # Call _get_stages to trigger the exception
        apigatewayv2._get_stages()

        mock_logger.warning.assert_called_once()
        assert "NotFoundException" in mock_logger.warning.call_args[0][0]
```

--------------------------------------------------------------------------------

---[FILE: apigatewayv2_access_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/apigatewayv2/apigatewayv2_access_logging_enabled/apigatewayv2_access_logging_enabled_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from mock import patch
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

# Mocking ApiGatewayV2 Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    We have to mock every AWS API call using Boto3

    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816
    """
    if operation_name == "GetAuthorizers":
        return {"Items": [{"AuthorizerId": "authorizer-id", "Name": "test-authorizer"}]}
    elif operation_name == "GetStages":
        return {
            "Items": [
                {
                    "AccessLogSettings": {
                        "DestinationArn": "string",
                        "Format": "string",
                    },
                    "StageName": "test-stage",
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_apigatewayv2_api_access_logging_enabled:
    @mock_aws
    def test_apigateway_no_apis(self):
        from prowler.providers.aws.services.apigatewayv2.apigatewayv2_service import (
            ApiGatewayV2,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.apigatewayv2.apigatewayv2_api_access_logging_enabled.apigatewayv2_api_access_logging_enabled.apigatewayv2_client",
                new=ApiGatewayV2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigatewayv2.apigatewayv2_api_access_logging_enabled.apigatewayv2_api_access_logging_enabled import (
                apigatewayv2_api_access_logging_enabled,
            )

            check = apigatewayv2_api_access_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_apigateway_one_api_with_logging_in_stage(self):
        # Create ApiGatewayV2 Mocked Resources
        apigatewayv2_client = client("apigatewayv2", region_name=AWS_REGION_US_EAST_1)
        # Create ApiGatewayV2 API
        api = apigatewayv2_client.create_api(Name="test-api", ProtocolType="HTTP")
        api_id = api["ApiId"]
        # Get stages mock with stage with logging
        from prowler.providers.aws.services.apigatewayv2.apigatewayv2_service import (
            ApiGatewayV2,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.apigatewayv2.apigatewayv2_api_access_logging_enabled.apigatewayv2_api_access_logging_enabled.apigatewayv2_client",
                new=ApiGatewayV2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigatewayv2.apigatewayv2_api_access_logging_enabled.apigatewayv2_api_access_logging_enabled import (
                apigatewayv2_api_access_logging_enabled,
            )

            check = apigatewayv2_api_access_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"API Gateway V2 test-api ID {api_id} in stage test-stage has access logging enabled."
            )

            assert result[0].resource_id == "test-api-test-stage"
            assert (
                result[0].resource_arn
                == f"arn:aws:apigateway:{AWS_REGION_US_EAST_1}::apis/{api_id}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]
```

--------------------------------------------------------------------------------

---[FILE: apigatewayv2_authorizers_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/apigatewayv2/apigatewayv2_authorizers_enabled/apigatewayv2_authorizers_enabled_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from mock import patch
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

# Mocking ApiGatewayV2 Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    We have to mock every AWS API call using Boto3

    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816
    """
    if operation_name == "GetAuthorizers":
        return {"Items": [{"AuthorizerId": "authorizer-id", "Name": "test-authorizer"}]}
    elif operation_name == "GetStages":
        return {
            "Items": [
                {
                    "AccessLogSettings": {
                        "DestinationArn": "string",
                        "Format": "string",
                    },
                    "StageName": "test-stage",
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_apigatewayv2_api_authorizers_enabled:
    @mock_aws
    def test_apigateway_no_apis(self):
        from prowler.providers.aws.services.apigatewayv2.apigatewayv2_service import (
            ApiGatewayV2,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.apigatewayv2.apigatewayv2_api_authorizers_enabled.apigatewayv2_api_authorizers_enabled.apigatewayv2_client",
                new=ApiGatewayV2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigatewayv2.apigatewayv2_api_authorizers_enabled.apigatewayv2_api_authorizers_enabled import (
                apigatewayv2_api_authorizers_enabled,
            )

            check = apigatewayv2_api_authorizers_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_apigateway_one_api_with_authorizer(self):
        # Create ApiGatewayV2 Mocked Resources
        apigatewayv2_client = client("apigatewayv2", region_name=AWS_REGION_US_EAST_1)
        # Create ApiGatewayV2 API
        api = apigatewayv2_client.create_api(Name="test-api", ProtocolType="HTTP")
        apigatewayv2_client.create_authorizer(
            ApiId=api["ApiId"],
            AuthorizerType="REQUEST",
            IdentitySource=[],
            Name="auth1",
            AuthorizerPayloadFormatVersion="2.0",
        )
        from prowler.providers.aws.services.apigatewayv2.apigatewayv2_service import (
            ApiGatewayV2,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.apigatewayv2.apigatewayv2_api_authorizers_enabled.apigatewayv2_api_authorizers_enabled.apigatewayv2_client",
                new=ApiGatewayV2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigatewayv2.apigatewayv2_api_authorizers_enabled.apigatewayv2_api_authorizers_enabled import (
                apigatewayv2_api_authorizers_enabled,
            )

            check = apigatewayv2_api_authorizers_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"API Gateway V2 test-api ID {api['ApiId']} has an authorizer configured."
            )
            assert result[0].resource_id == "test-api"
            assert (
                result[0].resource_arn
                == f"arn:aws:apigateway:{AWS_REGION_US_EAST_1}::apis/{api['ApiId']}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]
```

--------------------------------------------------------------------------------

---[FILE: appstream_service_test.py]---
Location: prowler-master/tests/providers/aws/services/appstream/appstream_service_test.py

```python
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.appstream.appstream_service import AppStream
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mock Test Region
AWS_REGION = "eu-west-1"

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    We have to mock every AWS API call using Boto3

    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816
    """
    if operation_name == "DescribeFleets":
        return {
            "Fleets": [
                {
                    "Arn": f"arn:aws:appstream:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:fleet/test-prowler3-0",
                    "Name": "test-prowler3-0",
                    "MaxUserDurationInSeconds": 100,
                    "DisconnectTimeoutInSeconds": 900,
                    "IdleDisconnectTimeoutInSeconds": 900,
                    "EnableDefaultInternetAccess": False,
                },
                {
                    "Arn": f"arn:aws:appstream:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:fleet/test-prowler3-1",
                    "Name": "test-prowler3-1",
                    "MaxUserDurationInSeconds": 57600,
                    "DisconnectTimeoutInSeconds": 900,
                    "IdleDisconnectTimeoutInSeconds": 900,
                    "EnableDefaultInternetAccess": True,
                },
            ]
        }
    if operation_name == "ListTagsForResource":
        return {"Tags": {"test": "test"}}
    return make_api_call(self, operation_name, kwarg)


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION
    )
    regional_client.region = AWS_REGION
    return {AWS_REGION: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_AppStream_Service:
    # Test AppStream Client
    def test_get_client(self):
        appstream = AppStream(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert appstream.regional_clients[AWS_REGION].__class__.__name__ == "AppStream"

    # Test AppStream Session
    def test__get_session__(self):
        appstream = AppStream(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert appstream.session.__class__.__name__ == "Session"

    # Test AppStream Session
    def test__get_service__(self):
        appstream = AppStream(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert appstream.service == "appstream"

    def test_describe_fleets(self):
        # Set partition for the service
        appstream = AppStream(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert len(appstream.fleets) == 2

        assert (
            appstream.fleets[0].arn
            == f"arn:aws:appstream:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:fleet/test-prowler3-0"
        )
        assert appstream.fleets[0].name == "test-prowler3-0"
        assert appstream.fleets[0].max_user_duration_in_seconds == 100
        assert appstream.fleets[0].disconnect_timeout_in_seconds == 900
        assert appstream.fleets[0].idle_disconnect_timeout_in_seconds == 900
        assert appstream.fleets[0].enable_default_internet_access is False
        assert appstream.fleets[0].region == AWS_REGION

        assert (
            appstream.fleets[1].arn
            == f"arn:aws:appstream:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:fleet/test-prowler3-1"
        )
        assert appstream.fleets[1].name == "test-prowler3-1"
        assert appstream.fleets[1].max_user_duration_in_seconds == 57600
        assert appstream.fleets[1].disconnect_timeout_in_seconds == 900
        assert appstream.fleets[1].idle_disconnect_timeout_in_seconds == 900
        assert appstream.fleets[1].enable_default_internet_access is True
        assert appstream.fleets[1].region == AWS_REGION

    def test_list_tags_for_resource(self):
        # Set partition for the service
        appstream = AppStream(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert len(appstream.fleets) == 2

        assert appstream.fleets[0].tags == [{"test": "test"}]

        assert appstream.fleets[1].tags == [{"test": "test"}]
```

--------------------------------------------------------------------------------

````
