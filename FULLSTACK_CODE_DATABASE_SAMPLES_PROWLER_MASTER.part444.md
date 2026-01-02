---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 444
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 444 of 867)

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

---[FILE: acm_certificates_with_secure_key_algorithms_test.py]---
Location: prowler-master/tests/providers/aws/services/acm/acm_certificates_with_secure_key_algorithms/acm_certificates_with_secure_key_algorithms_test.py

```python
import datetime
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.acm.acm_service import ACM
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListCertificates":
        return {
            "CertificateSummaryList": [
                {
                    "CertificateArn": "arn:aws:acm:eu-west-1:123456789012:certificate/insecure-key",
                    "DomainName": "insecure-key.com",
                    "CertificateType": "AMAZON_ISSUED",
                    "KeyAlgorithm": "RSA-1024",
                    "Type": "AMAZON_ISSUED",
                    "InUse": True,
                    "NotAfter": datetime.datetime.now() + datetime.timedelta(days=4),
                }
            ]
        }

    return make_api_call(self, operation_name, kwarg)


CERTIFICATE = """
-----BEGIN CERTIFICATE-----
MIIEUDCCAjgCCQDfXZHMio+6oDANBgkqhkiG9w0BAQsFADBjMQswCQYDVQQGEwJH
QjESMBAGA1UECAwJQmVya3NoaXJlMQ8wDQYDVQQHDAZTbG91Z2gxEzARBgNVBAoM
Ck1vdG9TZXJ2ZXIxCzAJBgNVBAsMAlFBMQ0wCwYDVQQDDARNb3RvMB4XDTE5MTAy
MTEzMjczMVoXDTQ5MTIzMTEzMjczNFowcTELMAkGA1UEBhMCR0IxEjAQBgNVBAgM
CUJlcmtzaGlyZTEPMA0GA1UEBwwGU2xvdWdoMRMwEQYDVQQKDApNb3RvU2VydmVy
MRMwEQYDVQQLDApPcGVyYXRpb25zMRMwEQYDVQQDDAoqLm1vdG8uY29tMIIBIjAN
BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzC/oBkzwiIBEceSC/tSD7hkqs8AW
niDXbMgAQE9oxUxtkFESxiNa+EbAMLBFtBkPRvc3iKXh/cfLo7yP8VdqEIDmJCB/
3T3ljjmrCMwquxYgZWMShnXZV0YfC19Vzq/gFpiyoaI2SI5NOFlfwhs5hFacTGkf
vpjJvf6HnrNJ7keQR+oGJNf7jVaCgOVdJ4lt7+98YDVde7jLx1DN+QbvViJQl60n
K3bmfuLiiw8154Eyi9DOcJE8AB+W7KpPdrmbPisR1EiqY0i0L62ZixN0rPi5hHF+
ozwURL1axcmLjlhIFi8YhBCNcY6ThE7jrqgLIq1n6d8ezRxjDKmqfH1spQIDAQAB
MA0GCSqGSIb3DQEBCwUAA4ICAQAOwvJjY1cLIBVGCDPkkxH4xCP6+QRdm7bqF7X5
DNZ70YcJ27GldrEPmKX8C1RvkC4oCsaytl8Hlw3ZcS1GvwBxTVlnYIE6nLPPi1ix
LvYYgoq+Mjk/2XPCnU/6cqJhb5INskg9s0o15jv27cUIgWVMnj+d5lvSiy1HhdYM
wvuQzXELjhe/rHw1/BFGaBV2vd7einUQwla50UZLcsj6FwWSIsv7EB4GaY/G0XqC
Mai2PltBgBPFqsZo27uBeVfxqMZtwAQlr4iWwWZm1haDy6D4GFCSR8E/gtlyhiN4
MOk1cmr9PSOMB3CWqKjkx7lPMOQT/f+gxlCnupNHsHcZGvQV4mCPiU+lLwp+8z/s
bupQwRvu1SwSUD2rIsVeUuSP3hbMcfhiZA50lenQNApimgrThdPUoFXi07FUdL+F
1QCk6cvA48KzGRo+bPSfZQusj51k/2+hl4sHHZdWg6mGAIY9InMKmPDE4VzM8hro
fr2fJLqKQ4h+xKbEYnvPEPttUdJbvUgr9TKKVw+m3lmW9SktzE5KtvWvN6daTj9Z
oHDJkOyko3uyTzk+HwWDC/pQ2cC+iF1MjIHi72U9ibObSODg/d9cMH3XJTnZ9W3+
He9iuH4dJpKnVjnJ5NKt7IOrPHID77160hpwF1dim22ZRp508eYapRzgawPMpCcd
a6YipQ==
-----END CERTIFICATE-----
        """

PRIVATE_KEY = """
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAzC/oBkzwiIBEceSC/tSD7hkqs8AWniDXbMgAQE9oxUxtkFES
xiNa+EbAMLBFtBkPRvc3iKXh/cfLo7yP8VdqEIDmJCB/3T3ljjmrCMwquxYgZWMS
hnXZV0YfC19Vzq/gFpiyoaI2SI5NOFlfwhs5hFacTGkfvpjJvf6HnrNJ7keQR+oG
JNf7jVaCgOVdJ4lt7+98YDVde7jLx1DN+QbvViJQl60nK3bmfuLiiw8154Eyi9DO
cJE8AB+W7KpPdrmbPisR1EiqY0i0L62ZixN0rPi5hHF+ozwURL1axcmLjlhIFi8Y
hBCNcY6ThE7jrqgLIq1n6d8ezRxjDKmqfH1spQIDAQABAoIBAECa588WiQSnkQB4
TPpUQ2oSjHBTVtSxj3fb0DiI552FkSUYgdgvV5k2yZieLW/Ofgb2MZwK4HZrwQMN
pn22KtkN78N+hPZ7nyZhGLyv3NVVKurpbfMdVqdGiIwQnhXHkB+WMO7zZDmQzN4H
aUUBWDGHNez3VhP4Q9zZrA+Kqtm5OYmkDQYO6LqR+OQmqmLEeJOsbR9EUXDuhd5O
CyWkBwZP5JcmP985hZ7dGTZJ9ehFLYq6i6ZLmuSkt6QS/jf+AdLjd6b2b326CUwJ
xEf3ZwQ9b+BPZ+gCx91FsooRqa3NbFhvGJ34sN25xzppa5+IDDk5XZnXJugwq5Sg
t5f07AECgYEA/G3+GIXlnyLwOksFFHQp1yZIlXxeGhVZyDwSHkXcAwRnTWZHHftr
fZ2TQkyYxsySx/pP6PUHQDwhZKFSLIpc2Di2ZIUPZSNYrzEqCZIBTO9+2DBshjs6
2tUyvpD68lZsQpjipD6wNF+308Px5hAg5mKr5IstHCcXkJcxa3v5kVMCgYEAzxM8
PbGQmSNalcO1cBcj/f7sbEbJOtdb94ig8KRc8ImL3ZM9dJOugqc0EchMzUzFD4H/
CjaC25CjxfBZSxV+0D6spUeLKogdwoyAM08/ZwD6BuMKZlbim84wV0VZBXjSaihq
qdaLnx0qC7/DPLf2zQfWkJCcqvPzMf+W6PgQcycCgYA3VW0jtwY0shXy0UsVxrj9
Ppkem5qNIS0DJZfbJvkpeCek4cypF9niOU50dBHxUhrC12345O1n+UZgprQ6q0Ha
6+OfeUN8qhjgnmhWnLjIQp+NiF/htM4b9iwfdexsfuFQX+8ejddWQ70qIIPAKLzt
g6eme5Ox3ifePCZLJ2v3nQKBgFBeitb2/8Qv8IyH9PeYQ6PlOSWdI6TuyQb9xFkh
seC5wcsxxnxkhSq4coEkWIql7SXjsnToS0mkjavZaQ63PQzeBmvvpJfRVJuZpHhF
nboAqwnZPMQTnMgT8rcsdyykhCYnoZ5hYrdSvmro9oGudN+G10QsnGHNZOpW5N9u
yBOpAoGASb5aNQU9QFT8kyxZB+nKAuh6efa6HNMXMdEoYD9VOm0zPMRtorZdX4s4
nYctHiIUmVAIXtkG0tR+cOelv2qKR5EfOo3HZtaP+fbOd0IykoZcbQJpc3PwDcCq
WgkRhN4dCVYD3ZXFYlUrCoDca7JE1KxmIbrlVSAaYilkt7UB3Qk=
-----END RSA PRIVATE KEY-----
        """


class Test_acm_certificates_with_secure_key_algorithms:
    @mock_aws
    def test_no_acm_certificates(self):
        client("acm", region_name=AWS_REGION_EU_WEST_1)

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.acm.acm_certificates_with_secure_key_algorithms.acm_certificates_with_secure_key_algorithms.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.acm.acm_certificates_with_secure_key_algorithms.acm_certificates_with_secure_key_algorithms import (
                acm_certificates_with_secure_key_algorithms,
            )

            check = acm_certificates_with_secure_key_algorithms()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_acm_certificate_secure_algorithm(self):
        acm = client("acm", region_name=AWS_REGION_EU_WEST_1)
        certificate_arn = acm.import_certificate(
            Certificate=CERTIFICATE.strip(),
            PrivateKey=PRIVATE_KEY.strip(),
        )["CertificateArn"]
        certificate_id = certificate_arn.split("/")[-1]
        certificate = acm.describe_certificate(CertificateArn=certificate_arn)

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.acm.acm_certificates_with_secure_key_algorithms.acm_certificates_with_secure_key_algorithms.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.acm.acm_certificates_with_secure_key_algorithms.acm_certificates_with_secure_key_algorithms import (
                acm_certificates_with_secure_key_algorithms,
            )

            check = acm_certificates_with_secure_key_algorithms()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ACM Certificate {certificate_id} for {certificate['Certificate']['DomainName']} uses a secure key algorithm ({certificate['Certificate']['KeyAlgorithm']})."
            )
            assert result[0].resource_id == certificate_id
            assert result[0].resource_arn == certificate_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_acm_certificate_insecure_algorithm(self):
        client("acm", region_name=AWS_REGION_EU_WEST_1)

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.acm.acm_certificates_with_secure_key_algorithms.acm_certificates_with_secure_key_algorithms.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.acm.acm_certificates_with_secure_key_algorithms.acm_certificates_with_secure_key_algorithms import (
                acm_certificates_with_secure_key_algorithms,
            )

            check = acm_certificates_with_secure_key_algorithms()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ACM Certificate insecure-key for insecure-key.com does not use a secure key algorithm (RSA-1024)."
            )
            assert result[0].resource_id == "insecure-key"
            assert (
                result[0].resource_arn
                == "arn:aws:acm:eu-west-1:123456789012:certificate/insecure-key"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_unused_acm_certificate(self):
        acm = client("acm", region_name=AWS_REGION_EU_WEST_1)
        acm.import_certificate(
            Certificate=CERTIFICATE.strip(),
            PrivateKey=PRIVATE_KEY.strip(),
        )["CertificateArn"]

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_mocked_provider._scan_unused_services = False
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.acm.acm_certificates_with_secure_key_algorithms.acm_certificates_with_secure_key_algorithms.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.acm.acm_certificates_with_secure_key_algorithms.acm_certificates_with_secure_key_algorithms import (
                acm_certificates_with_secure_key_algorithms,
            )

            check = acm_certificates_with_secure_key_algorithms()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: apigateway_service_test.py]---
Location: prowler-master/tests/providers/aws/services/apigateway/apigateway_service_test.py

```python
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.apigateway.apigateway_service import APIGateway
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_APIGateway_Service:
    # Test APIGateway Service
    @mock_aws
    def test_service(self):
        # APIGateway client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigateway = APIGateway(aws_provider)
        assert apigateway.service == "apigateway"

    # Test APIGateway Client
    @mock_aws
    def test_client(self):
        # APIGateway client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigateway = APIGateway(aws_provider)
        for regional_client in apigateway.regional_clients.values():
            assert regional_client.__class__.__name__ == "APIGateway"

    # Test APIGateway Session
    @mock_aws
    def test__get_session__(self):
        # APIGateway client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigateway = APIGateway(aws_provider)
        assert apigateway.session.__class__.__name__ == "Session"

    # Test APIGateway Session
    @mock_aws
    def test_audited_account(self):
        # APIGateway client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigateway = APIGateway(aws_provider)
        assert apigateway.audited_account == AWS_ACCOUNT_NUMBER

    # Test APIGateway Get Rest APIs
    @mock_aws
    def test_get_rest_apis(self):
        # Generate APIGateway Client
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Rest API
        apigateway_client.create_rest_api(
            name="test-rest-api",
        )
        # APIGateway client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigateway = APIGateway(aws_provider)
        assert len(apigateway.rest_apis) == len(
            apigateway_client.get_rest_apis()["items"]
        )

    # Test APIGateway Get Authorizers
    @mock_aws
    def test_get_authorizers(self):
        # Generate APIGateway Client
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Rest API
        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )
        # Create authorizer
        apigateway_client.create_authorizer(
            name="test-authorizer",
            restApiId=rest_api["id"],
            type="TOKEN",
        )
        # APIGateway client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigateway = APIGateway(aws_provider)
        assert apigateway.rest_apis[0].authorizer is True

    # Test APIGateway Get Rest API
    @mock_aws
    def test_get_rest_api(self):
        # Generate APIGateway Client
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create private APIGateway Rest API
        apigateway_client.create_rest_api(
            name="test-rest-api",
            endpointConfiguration={"types": ["PRIVATE"]},
            tags={"test": "test"},
        )
        # APIGateway client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigateway = APIGateway(aws_provider)
        assert apigateway.rest_apis[0].public_endpoint is False
        assert apigateway.rest_apis[0].tags == [{"test": "test"}]

    # Test APIGateway Get Stages
    @mock_aws
    def test_get_stages(self):
        # Generate APIGateway Client
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Rest API and a deployment stage
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
                {
                    "op": "replace",
                    "path": "/tracingEnabled",
                    "value": "true",
                },
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
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigateway = APIGateway(aws_provider)
        assert apigateway.rest_apis[0].stages[0].logging is True
        assert apigateway.rest_apis[0].stages[0].tracing_enabled is True
        assert apigateway.rest_apis[0].stages[0].cache_enabled is True
        assert apigateway.rest_apis[0].stages[0].cache_data_encrypted is False

    # Test APIGateway _get_resources
    @mock_aws
    def test_get_resources(self):
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)

        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )

        default_resource_id = apigateway_client.get_resources(restApiId=rest_api["id"])[
            "items"
        ][0]["id"]

        api_resource = apigateway_client.create_resource(
            restApiId=rest_api["id"], parentId=default_resource_id, pathPart="test"
        )

        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=api_resource["id"],
            httpMethod="GET",
            authorizationType="AWS_IAM",
        )

        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=api_resource["id"],
            httpMethod="OPTIONS",
            authorizationType="AWS_IAM",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        apigateway = APIGateway(aws_provider)

        # we skip OPTIONS methods
        assert list(apigateway.rest_apis[0].resources[1].resource_methods.keys()) == [
            "GET"
        ]
        assert list(apigateway.rest_apis[0].resources[1].resource_methods.values()) == [
            "AWS_IAM"
        ]
```

--------------------------------------------------------------------------------

---[FILE: apigateway_authorizers_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/apigateway/apigateway_authorizers_enabled/apigateway_authorizers_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_apigateway_restapi_authorizers_enabled:
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled import (
                apigateway_restapi_authorizers_enabled,
            )

            check = apigateway_restapi_authorizers_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_apigateway_one_rest_api_with_lambda_authorizer(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        lambda_client = client("lambda", region_name=AWS_REGION_US_EAST_1)
        iam_client = client("iam")
        # Create APIGateway Rest API
        role_arn = iam_client.create_role(
            RoleName="my-role",
            AssumeRolePolicyDocument="some policy",
        )["Role"]["Arn"]
        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )
        authorizer = lambda_client.create_function(
            FunctionName="lambda-authorizer",
            Runtime="python3.7",
            Role=role_arn,
            Handler="lambda_function.lambda_handler",
            Code={
                "ImageUri": "123456789012.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest"
            },
        )
        apigateway_client.create_authorizer(
            name="test",
            restApiId=rest_api["id"],
            type="TOKEN",
            authorizerUri=f"arn:aws:apigateway:{apigateway_client.meta.region_name}:lambda:path/2015-03-31/functions/arn:aws:lambda:{apigateway_client.meta.region_name}:{AWS_ACCOUNT_NUMBER}:function:{authorizer['FunctionName']}/invocations",
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled import (
                apigateway_restapi_authorizers_enabled,
            )

            check = apigateway_restapi_authorizers_enabled()
            result = check.execute()

            assert result[0].status == "PASS"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} has an authorizer configured at api level"
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_apigateway_one_rest_api_without_lambda_authorizer(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)
        # Create APIGateway Rest API
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled import (
                apigateway_restapi_authorizers_enabled,
            )

            check = apigateway_restapi_authorizers_enabled()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} does not have an authorizer configured at api level."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_apigateway_one_rest_api_without_api_or_methods_authorizer(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)

        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )

        default_resource_id = apigateway_client.get_resources(restApiId=rest_api["id"])[
            "items"
        ][0]["id"]

        api_resource = apigateway_client.create_resource(
            restApiId=rest_api["id"], parentId=default_resource_id, pathPart="test"
        )

        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=api_resource["id"],
            httpMethod="GET",
            authorizationType="NONE",
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled import (
                apigateway_restapi_authorizers_enabled,
            )

            check = apigateway_restapi_authorizers_enabled()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} does not have authorizers at api level and the following paths and methods are unauthorized: /test -> GET."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_apigateway_one_rest_api_without_api_auth_but_one_method_auth(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)

        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )

        default_resource_id = apigateway_client.get_resources(restApiId=rest_api["id"])[
            "items"
        ][0]["id"]

        api_resource = apigateway_client.create_resource(
            restApiId=rest_api["id"], parentId=default_resource_id, pathPart="test"
        )

        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=api_resource["id"],
            httpMethod="GET",
            authorizationType="AWS_IAM",
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled import (
                apigateway_restapi_authorizers_enabled,
            )

            check = apigateway_restapi_authorizers_enabled()
            result = check.execute()

            assert result[0].status == "PASS"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} has all methods authorized"
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_apigateway_one_rest_api_without_api_auth_but_methods_auth_and_not(self):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)

        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )

        default_resource_id = apigateway_client.get_resources(restApiId=rest_api["id"])[
            "items"
        ][0]["id"]

        api_resource = apigateway_client.create_resource(
            restApiId=rest_api["id"], parentId=default_resource_id, pathPart="test"
        )

        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=api_resource["id"],
            httpMethod="POST",
            authorizationType="AWS_IAM",
        )

        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=api_resource["id"],
            httpMethod="GET",
            authorizationType="NONE",
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled import (
                apigateway_restapi_authorizers_enabled,
            )

            check = apigateway_restapi_authorizers_enabled()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} does not have authorizers at api level and the following paths and methods are unauthorized: /test -> GET."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_apigateway_one_rest_api_without_api_auth_but_methods_not_auth_and_auth(
        self,
    ):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)

        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )

        default_resource_id = apigateway_client.get_resources(restApiId=rest_api["id"])[
            "items"
        ][0]["id"]

        api_resource = apigateway_client.create_resource(
            restApiId=rest_api["id"], parentId=default_resource_id, pathPart="test"
        )

        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=api_resource["id"],
            httpMethod="GET",
            authorizationType="NONE",
        )

        apigateway_client.put_method(
            restApiId=rest_api["id"],
            resourceId=api_resource["id"],
            httpMethod="POST",
            authorizationType="AWS_IAM",
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled import (
                apigateway_restapi_authorizers_enabled,
            )

            check = apigateway_restapi_authorizers_enabled()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} does not have authorizers at api level and the following paths and methods are unauthorized: /test -> GET."
            )
            assert result[0].resource_id == "test-rest-api"
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:apigateway:{AWS_REGION_US_EAST_1}::/restapis/{rest_api['id']}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_apigateway_one_rest_api_without_authorizers_with_various_resources_without_endpoints(
        self,
    ):
        # Create APIGateway Mocked Resources
        apigateway_client = client("apigateway", region_name=AWS_REGION_US_EAST_1)

        rest_api = apigateway_client.create_rest_api(
            name="test-rest-api",
        )

        default_resource_id = apigateway_client.get_resources(restApiId=rest_api["id"])[
            "items"
        ][0]["id"]

        apigateway_client.create_resource(
            restApiId=rest_api["id"], parentId=default_resource_id, pathPart="test"
        )

        apigateway_client.create_resource(
            restApiId=rest_api["id"], parentId=default_resource_id, pathPart="test2"
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
                "prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled.apigateway_client",
                new=APIGateway(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.apigateway.apigateway_restapi_authorizers_enabled.apigateway_restapi_authorizers_enabled import (
                apigateway_restapi_authorizers_enabled,
            )

            check = apigateway_restapi_authorizers_enabled()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert len(result) == 1
            assert (
                result[0].status_extended
                == f"API Gateway test-rest-api ID {rest_api['id']} does not have an authorizer configured at api level."
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

````
