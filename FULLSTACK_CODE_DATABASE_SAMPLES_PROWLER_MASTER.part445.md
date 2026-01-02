---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 445
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 445 of 867)

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

---[FILE: apigateway_client_certificate_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/apigateway/apigateway_client_certificate_enabled/apigateway_client_certificate_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.apigateway.apigateway_service import Stage
from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_apigateway_restapi_client_certificate_enabled:
    @mock_aws
    def test_apigateway_no_stages(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Rest API
        apigateway_client.create_rest_api(
            name="test-rest-api",
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_client_certificate_enabled.apigateway_restapi_client_certificate_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_client_certificate_enabled.apigateway_restapi_client_certificate_enabled import (
                apigateway_restapi_client_certificate_enabled,
            )

            check = apigateway_restapi_client_certificate_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_apigateway_one_stage_without_certificate(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Deployment Stage
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_client_certificate_enabled.apigateway_restapi_client_certificate_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_client_certificate_enabled.apigateway_restapi_client_certificate_enabled import (
                apigateway_restapi_client_certificate_enabled,
            )

            check = apigateway_restapi_client_certificate_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} in stage test does not have client certificate enabled."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}/stages/test"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [None]

    @mock_aws
    def test_apigateway_one_stage_with_certificate(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Deployment Stage
        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_client_certificate_enabled.apigateway_restapi_client_certificate_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ) as service_client,
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_client_certificate_enabled.apigateway_restapi_client_certificate_enabled import (
                apigateway_restapi_client_certificate_enabled,
            )

            service_client.rest_apis[0].stages.append(
                Stage(
                    name="test",
                    arn=f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/test-rest-api/stages/test",
                    logging=True,
                    client_certificate=True,
                    waf=True,
                )
            )

            check = apigateway_restapi_client_certificate_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} in stage test has client certificate enabled."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/test-rest-api/stages/test"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: apigateway_endpoint_public_test.py]---
Location: prowler-master/tests/providers/aws/services/apigateway/apigateway_endpoint_public/apigateway_endpoint_public_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_apigateway_restapi_public:
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_public.apigateway_restapi_public.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_public.apigateway_restapi_public import (
                apigateway_restapi_public,
            )

            check = apigateway_restapi_public()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_apigateway_one_private_rest_api(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Deployment Stage
        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
            endpointConfiguration={
                "types": [
                    "PRIVATE",
                ]
            },
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_public.apigateway_restapi_public.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_public.apigateway_restapi_public import (
                apigateway_restapi_public,
            )

            check = apigateway_restapi_public()
            result = check.execute()

            assert result[0].status == "PASS"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} is private."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_apigateway_one_public_rest_api(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Deployment Stage
        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
            endpointConfiguration={
                "types": [
                    "EDGE",
                ]
            },
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_public.apigateway_restapi_public.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_public.apigateway_restapi_public import (
                apigateway_restapi_public,
            )

            check = apigateway_restapi_public()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} is internet accessible."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]
```

--------------------------------------------------------------------------------

---[FILE: apigateway_endpoint_public_without_authorizer_test.py]---
Location: prowler-master/tests/providers/aws/services/apigateway/apigateway_endpoint_public_without_authorizer/apigateway_endpoint_public_without_authorizer_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

API_GW_NAME = "test-rest-api"


class Test_apigateway_restapi_public_with_authorizer:
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_public_with_authorizer.apigateway_restapi_public_with_authorizer.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_public_with_authorizer.apigateway_restapi_public_with_authorizer import (
                apigateway_restapi_public_with_authorizer,
            )

            check = apigateway_restapi_public_with_authorizer()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_apigateway_one_public_rest_api_without_authorizer(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Deployment Stage
        rest_api = apigateway_client.create_rest_api(
            name=API_GW_NAME,
            endpointConfiguration={
                "types": [
                    "EDGE",
                ]
            },
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_public_with_authorizer.apigateway_restapi_public_with_authorizer.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_public_with_authorizer.apigateway_restapi_public_with_authorizer import (
                apigateway_restapi_public_with_authorizer,
            )

            check = apigateway_restapi_public_with_authorizer()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"API Gateway REST API {API_GW_NAME} with ID {rest_api['id']} has a public endpoint without an authorizer."
            )
            assert result[0].resource_id == API_GW_NAME
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_apigateway_one_public_rest_api_with_authorizer(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Deployment Stage
        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
            endpointConfiguration={
                "types": [
                    "EDGE",
                ]
            },
        )
        apigateway_client.create_authorizer(
            restApiId=rest_api["id"], name="test-rest-api-with-authorizer", type="TOKEN"
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_public_with_authorizer.apigateway_restapi_public_with_authorizer.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_public_with_authorizer.apigateway_restapi_public_with_authorizer import (
                apigateway_restapi_public_with_authorizer,
            )

            check = apigateway_restapi_public_with_authorizer()
            result = check.execute()

            assert result[0].status == "PASS"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway REST API {API_GW_NAME} with ID {rest_api['id']} has a public endpoint with an authorizer."
            )
            assert result[0].resource_id == API_GW_NAME
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]
```

--------------------------------------------------------------------------------

---[FILE: apigateway_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/apigateway/apigateway_logging_enabled/apigateway_logging_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_apigateway_restapi_logging_enabled:
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_logging_enabled.apigateway_restapi_logging_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_logging_enabled.apigateway_restapi_logging_enabled import (
                apigateway_restapi_logging_enabled,
            )

            check = apigateway_restapi_logging_enabled()
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
                    "path": "/*/*/logging/loglevel",
                    "value": "INFO",
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_logging_enabled.apigateway_restapi_logging_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_logging_enabled.apigateway_restapi_logging_enabled import (
                apigateway_restapi_logging_enabled,
            )

            check = apigateway_restapi_logging_enabled()
            result = check.execute()

            assert result[0].status == "PASS"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} in stage test has logging enabled."
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_logging_enabled.apigateway_restapi_logging_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_logging_enabled.apigateway_restapi_logging_enabled import (
                apigateway_restapi_logging_enabled,
            )

            check = apigateway_restapi_logging_enabled()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} in stage test has logging disabled."
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

---[FILE: apigateway_restapi_cache_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/apigateway/apigateway_restapi_cache_encrypted/apigateway_restapi_cache_encrypted_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_apigateway_restapi_cache_encrypted:
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_cache_encrypted.apigateway_restapi_cache_encrypted.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_cache_encrypted.apigateway_restapi_cache_encrypted import (
                apigateway_restapi_cache_encrypted,
            )

            check = apigateway_restapi_cache_encrypted()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_apigateway_one_rest_api_with_cache_encrypted(self):
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
                    "path": "/*/*/caching/enabled",
                    "value": "true",
                },
                {
                    "op": "replace",
                    "path": "/*/*/caching/dataEncrypted",
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_cache_encrypted.apigateway_restapi_cache_encrypted.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_cache_encrypted.apigateway_restapi_cache_encrypted import (
                apigateway_restapi_cache_encrypted,
            )

            check = apigateway_restapi_cache_encrypted()
            result = check.execute()

            assert result[0].status == "PASS"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} in stage test has cache encryption enabled."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}/stages/test"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [None]

    @mock_aws
    def test_apigateway_one_rest_api_without_cache_encrypted(self):
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
                    "path": "/*/*/caching/enabled",
                    "value": "true",
                },
                {
                    "op": "replace",
                    "path": "/*/*/caching/dataEncrypted",
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_cache_encrypted.apigateway_restapi_cache_encrypted.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_cache_encrypted.apigateway_restapi_cache_encrypted import (
                apigateway_restapi_cache_encrypted,
            )

            check = apigateway_restapi_cache_encrypted()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} in stage test has cache enabled but cache data is not encrypted at rest."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}/stages/test"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [None]

    @mock_aws
    def test_apigateway_one_rest_api_without_cache_enabled(self):
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
                    "path": "/*/*/caching/enabled",
                    "value": "false",
                },
                {
                    "op": "replace",
                    "path": "/*/*/caching/cacheDataEncrypted",
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_cache_encrypted.apigateway_restapi_cache_encrypted.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_cache_encrypted.apigateway_restapi_cache_encrypted import (
                apigateway_restapi_cache_encrypted,
            )

            check = apigateway_restapi_cache_encrypted()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
