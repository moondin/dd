---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 443
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 443 of 867)

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

---[FILE: acm_service_test.py]---
Location: prowler-master/tests/providers/aws/services/acm/acm_service_test.py

```python
import uuid
from datetime import datetime

import botocore
from freezegun import freeze_time
from mock import patch

from prowler.providers.aws.services.acm.acm_service import ACM
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call

CERTIFICATE_ARN = f"arn:aws:acm:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:certificate/{str(uuid.uuid4())}"
CERTIFICATE_NAME = "test-certificate.com"
CERTIFICATE_TYPE = "AMAZON_ISSUED"
CERTIFICATE_KEY_ALGORITHM = "RSA-4096"


def mock_make_api_call(self, operation_name, kwargs):
    """
    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816

    We have to mock every AWS API call using Boto3
    """
    if operation_name == "ListCertificates":
        return {
            "CertificateSummaryList": [
                {
                    "CertificateArn": CERTIFICATE_ARN,
                    "DomainName": CERTIFICATE_NAME,
                    "SubjectAlternativeNameSummaries": [
                        "test-certificate-2.com",
                    ],
                    "HasAdditionalSubjectAlternativeNames": False,
                    "Status": "ISSUED",
                    "Type": CERTIFICATE_TYPE,
                    "KeyAlgorithm": "RSA-4096",
                    "KeyUsages": ["DIGITAL_SIGNATURE"],
                    "ExtendedKeyUsages": ["TLS_WEB_SERVER_AUTHENTICATION"],
                    "InUse": True,
                    "Exported": False,
                    "RenewalEligibility": "ELIGIBLE",
                    "NotBefore": datetime(2024, 1, 1),
                    "NotAfter": datetime(2024, 1, 1),
                    "CreatedAt": datetime(2024, 1, 1),
                    "IssuedAt": datetime(2024, 1, 1),
                    "ImportedAt": datetime(2024, 1, 1),
                    "RevokedAt": datetime(2024, 1, 1),
                }
            ]
        }
    if operation_name == "DescribeCertificate":
        if kwargs["CertificateArn"] == CERTIFICATE_ARN:
            return {
                "Certificate": {
                    "Options": {"CertificateTransparencyLoggingPreference": "DISABLED"},
                }
            }
    if operation_name == "ListTagsForCertificate":
        if kwargs["CertificateArn"] == CERTIFICATE_ARN:
            return {
                "Tags": [
                    {"Key": "test", "Value": "test"},
                ]
            }

    return make_api_call(self, operation_name, kwargs)


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
# Freeze time
@freeze_time("2023-01-01")
# FIXME: Pending Moto PR to update ACM responses
class Test_ACM_Service:
    # Test ACM Service
    # @mock_acm
    def test_service(self):
        # ACM client for this test class
        aws_provider = set_mocked_aws_provider()
        acm = ACM(aws_provider)
        assert acm.service == "acm"

    # Test ACM Client
    # @mock_acm
    def test_client(self):
        # ACM client for this test class
        aws_provider = set_mocked_aws_provider()
        acm = ACM(aws_provider)
        for regional_client in acm.regional_clients.values():
            assert regional_client.__class__.__name__ == "ACM"

    # Test ACM Session
    # @mock_acm
    def test__get_session__(self):
        # ACM client for this test class
        aws_provider = set_mocked_aws_provider()
        acm = ACM(aws_provider)
        assert acm.session.__class__.__name__ == "Session"

    # Test ACM Session
    # @mock_acm
    def test_audited_account(self):
        # ACM client for this test class
        aws_provider = set_mocked_aws_provider()
        acm = ACM(aws_provider)
        assert acm.audited_account == AWS_ACCOUNT_NUMBER

    # Test ACM List Certificates
    # @mock_acm
    def test_list_and_describe_certificates(self):
        # Generate ACM Client
        # acm_client = client("acm", region_name=AWS_REGION)
        # Request ACM certificate
        # certificate = acm_client.request_certificate(
        #     DomainName="test.com",
        # )

        # ACM client for this test class
        aws_provider = set_mocked_aws_provider()
        acm = ACM(aws_provider)
        assert len(acm.certificates) == 1
        assert acm.certificates[CERTIFICATE_ARN].arn == CERTIFICATE_ARN
        assert acm.certificates[CERTIFICATE_ARN].name == CERTIFICATE_NAME
        assert acm.certificates[CERTIFICATE_ARN].type == CERTIFICATE_TYPE
        assert (
            acm.certificates[CERTIFICATE_ARN].key_algorithm == CERTIFICATE_KEY_ALGORITHM
        )
        assert acm.certificates[CERTIFICATE_ARN].expiration_days == 365
        assert acm.certificates[CERTIFICATE_ARN].transparency_logging is False
        assert acm.certificates[CERTIFICATE_ARN].region == AWS_REGION_US_EAST_1

    # Test ACM List Tags
    # @mock_acm
    def test_list_tags_for_certificate(self):
        # Generate ACM Client
        # acm_client = client("acm", region_name=AWS_REGION)
        # Request ACM certificate
        # certificate = acm_client.request_certificate(
        #     DomainName="test.com",
        # )

        # ACM client for this test class
        aws_provider = set_mocked_aws_provider()
        acm = ACM(aws_provider)
        assert len(acm.certificates) == 1
        assert acm.certificates[CERTIFICATE_ARN].tags == [
            {"Key": "test", "Value": "test"},
        ]
```

--------------------------------------------------------------------------------

---[FILE: acm_certificates_expiration_check_test.py]---
Location: prowler-master/tests/providers/aws/services/acm/acm_certificates_expiration_check/acm_certificates_expiration_check_test.py

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
                    "CertificateArn": "arn:aws:acm:eu-west-1:123456789012:certificate/test-expirated",
                    "DomainName": "test-expirated.com",
                    "CertificateType": "AMAZON_ISSUED",
                    "KeyAlgorithm": "RSA_2048",
                    "Type": "AMAZON_ISSUED",
                    "InUse": True,
                    "NotAfter": datetime.datetime.now() + datetime.timedelta(days=4),
                }
            ]
        }

    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "ListCertificates":
        return {
            "CertificateSummaryList": [
                {
                    "CertificateArn": "arn:aws:acm:eu-west-1:123456789012:certificate/test-expirated-long-time",
                    "DomainName": "test-expirated.com",
                    "CertificateType": "AMAZON_ISSUED",
                    "KeyAlgorithm": "RSA_2048",
                    "Type": "AMAZON_ISSUED",
                    "InUse": True,
                    "NotAfter": datetime.datetime.now() - datetime.timedelta(days=4),
                }
            ]
        }

    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v3(self, operation_name, kwarg):
    if operation_name == "ListCertificates":
        return {
            "CertificateSummaryList": [
                {
                    "CertificateArn": "arn:aws:acm:eu-west-1:123456789012:certificate/test-expirated-long-time-not-in-use",
                    "DomainName": "test-expirated.com",
                    "CertificateType": "AMAZON_ISSUED",
                    "KeyAlgorithm": "RSA_2048",
                    "Type": "AMAZON_ISSUED",
                    "InUse": True,
                    "NotAfter": datetime.datetime.now() - datetime.timedelta(days=4),
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


class Test_acm_certificates_expiration_check:
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
                "prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check import (
                acm_certificates_expiration_check,
            )

            check = acm_certificates_expiration_check()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_acm_certificate_expirated(self):
        client("acm", region_name=AWS_REGION_EU_WEST_1)

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            from prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check import (
                acm_certificates_expiration_check,
            )

            check = acm_certificates_expiration_check()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ACM Certificate test-expirated for test-expirated.com is about to expire in 3 days."
            )
            assert result[0].resource_id == "test-expirated"
            assert (
                result[0].resource_arn
                == "arn:aws:acm:eu-west-1:123456789012:certificate/test-expirated"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
            assert result[0].check_metadata.Severity == "medium"

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_acm_certificate_expirated_long_time(self):
        client("acm", region_name=AWS_REGION_EU_WEST_1)

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            from prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check import (
                acm_certificates_expiration_check,
            )

            check = acm_certificates_expiration_check()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ACM Certificate test-expirated-long-time for test-expirated.com has expired (5 days ago)."
            )
            assert result[0].resource_id == "test-expirated-long-time"
            assert (
                result[0].resource_arn
                == "arn:aws:acm:eu-west-1:123456789012:certificate/test-expirated-long-time"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
            assert result[0].check_metadata.Severity == "high"

    @mock_aws
    def test_acm_certificate_not_expirated(self):
        acm = client("acm", region_name=AWS_REGION_EU_WEST_1)
        certificate_arn = acm.import_certificate(
            Certificate=CERTIFICATE.strip(),
            PrivateKey=PRIVATE_KEY.strip(),
        )["CertificateArn"]
        certificate_id = certificate_arn.split("/")[-1]
        certificate = acm.describe_certificate(CertificateArn=certificate_arn)
        expiration_days = (
            certificate["Certificate"]["NotAfter"]
            - datetime.datetime.now(certificate["Certificate"]["NotAfter"].tzinfo)
        ).days

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check import (
                acm_certificates_expiration_check,
            )

            check = acm_certificates_expiration_check()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ACM Certificate {certificate_id} for {certificate['Certificate']['DomainName']} expires in {expiration_days} days."
            )
            assert result[0].resource_id == certificate_id
            assert result[0].resource_arn == certificate_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_acm_certificate_not_in_use(self):
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
                "prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            from prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check import (
                acm_certificates_expiration_check,
            )

            check = acm_certificates_expiration_check()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v3)
    def test_acm_certificate_not_in_use_expired_scan_unused_services(self):
        client("acm", region_name=AWS_REGION_EU_WEST_1)

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            from prowler.providers.aws.services.acm.acm_certificates_expiration_check.acm_certificates_expiration_check import (
                acm_certificates_expiration_check,
            )

            check = acm_certificates_expiration_check()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ACM Certificate test-expirated-long-time-not-in-use for test-expirated.com has expired (5 days ago)."
            )
            assert result[0].resource_id == "test-expirated-long-time-not-in-use"
            assert (
                result[0].resource_arn
                == "arn:aws:acm:eu-west-1:123456789012:certificate/test-expirated-long-time-not-in-use"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
            assert result[0].check_metadata.Severity == "high"
```

--------------------------------------------------------------------------------

---[FILE: acm_certificates_transparency_logs_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/acm/acm_certificates_transparency_logs_enabled/acm_certificates_transparency_logs_enabled_test.py

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
                    "CertificateArn": "arn:aws:acm:eu-west-1:123456789012:certificate/test-logging",
                    "DomainName": "test-logging.com",
                    "CertificateType": "AMAZON_ISSUED",
                    "KeyAlgorithm": "RSA_2048",
                    "Type": "AMAZON_ISSUED",
                    "InUse": True,
                    "NotAfter": datetime.datetime.now() + datetime.timedelta(days=4),
                }
            ]
        }
    if operation_name == "DescribeCertificate":
        return {
            "Certificate": {
                "Options": {"CertificateTransparencyLoggingPreference": "ENABLED"},
            }
        }

    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "ListCertificates":
        return {
            "CertificateSummaryList": [
                {
                    "CertificateArn": "arn:aws:acm:eu-west-1:123456789012:certificate/test-no-logging",
                    "DomainName": "test-no-logging.com",
                    "CertificateType": "AMAZON_ISSUED",
                    "KeyAlgorithm": "RSA_2048",
                    "Type": "AMAZON_ISSUED",
                    "InUse": True,
                    "NotAfter": datetime.datetime.now() - datetime.timedelta(days=4),
                }
            ]
        }
    if operation_name == "DescribeCertificate":
        return {
            "Certificate": {
                "Options": {"CertificateTransparencyLoggingPreference": "DISABLED"},
            }
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


class Test_acm_certificates_transparency_logs_enabled:
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
                "prowler.providers.aws.services.acm.acm_certificates_transparency_logs_enabled.acm_certificates_transparency_logs_enabled.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.acm.acm_certificates_transparency_logs_enabled.acm_certificates_transparency_logs_enabled import (
                acm_certificates_transparency_logs_enabled,
            )

            check = acm_certificates_transparency_logs_enabled()
            result = check.execute()

            assert len(result) == 0

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
                "prowler.providers.aws.services.acm.acm_certificates_transparency_logs_enabled.acm_certificates_transparency_logs_enabled.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.acm.acm_certificates_transparency_logs_enabled.acm_certificates_transparency_logs_enabled import (
                acm_certificates_transparency_logs_enabled,
            )

            check = acm_certificates_transparency_logs_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_acm_certificate_with_logging(self):
        client("acm", region_name=AWS_REGION_EU_WEST_1)

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.acm.acm_certificates_transparency_logs_enabled.acm_certificates_transparency_logs_enabled.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.acm.acm_certificates_transparency_logs_enabled.acm_certificates_transparency_logs_enabled import (
                acm_certificates_transparency_logs_enabled,
            )

            check = acm_certificates_transparency_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ACM Certificate test-logging for test-logging.com has Certificate Transparency logging enabled."
            )
            assert result[0].resource_id == "test-logging"
            assert (
                result[0].resource_arn
                == "arn:aws:acm:eu-west-1:123456789012:certificate/test-logging"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_acm_certificate_without_logging(self):
        client("acm", region_name=AWS_REGION_EU_WEST_1)

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.acm.acm_certificates_transparency_logs_enabled.acm_certificates_transparency_logs_enabled.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.acm.acm_certificates_transparency_logs_enabled.acm_certificates_transparency_logs_enabled import (
                acm_certificates_transparency_logs_enabled,
            )

            check = acm_certificates_transparency_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ACM Certificate test-no-logging for test-no-logging.com has Certificate Transparency logging disabled."
            )
            assert result[0].resource_id == "test-no-logging"
            assert (
                result[0].resource_arn
                == "arn:aws:acm:eu-west-1:123456789012:certificate/test-no-logging"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_acm_certificate_imported(self):
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
                "prowler.providers.aws.services.acm.acm_certificates_transparency_logs_enabled.acm_certificates_transparency_logs_enabled.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.acm.acm_certificates_transparency_logs_enabled.acm_certificates_transparency_logs_enabled import (
                acm_certificates_transparency_logs_enabled,
            )

            check = acm_certificates_transparency_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ACM Certificate {certificate_id} for {certificate['Certificate']['DomainName']} is imported."
            )
            assert result[0].resource_id == certificate_id
            assert result[0].resource_arn == certificate_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
