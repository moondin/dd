---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 553
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 553 of 867)

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

---[FILE: elb_ssl_listeners_use_acm_certificate_test.py]---
Location: prowler-master/tests/providers/aws/services/elb/elb_ssl_listeners_use_acm_certificate/elb_ssl_listeners_use_acm_certificate_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    set_mocked_aws_provider,
)

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"
elb_arn = (
    f"arn:aws:elasticloadbalancing:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
)

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


class Test_elb_ssl_listeners_use_acm_certificate:
    @mock_aws
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.acm.acm_service import ACM
        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.elb_client",
                new=ELB(aws_mocked_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate import (
                elb_ssl_listeners_use_acm_certificate,
            )

            check = elb_ssl_listeners_use_acm_certificate()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elb_with_HTTPs_listener_imported_certificate(self):
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)
        acm = client("acm", region_name=AWS_REGION)
        certificate = acm.import_certificate(
            Certificate=CERTIFICATE.strip(),
            PrivateKey=PRIVATE_KEY.strip(),
        )

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {
                    "Protocol": "https",
                    "LoadBalancerPort": 80,
                    "InstancePort": 8080,
                    "SSLCertificateId": certificate["CertificateArn"],
                },
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        from prowler.providers.aws.services.acm.acm_service import ACM
        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.elb_client",
                new=ELB(aws_mocked_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate import (
                elb_ssl_listeners_use_acm_certificate,
            )

            check = elb_ssl_listeners_use_acm_certificate()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELB my-lb has HTTPS/SSL listeners that are using certificates not managed by ACM."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    @mock_aws
    def test_elb_with_SSL_listener_imported_certificate(self):
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)
        acm = client("acm", region_name=AWS_REGION)
        certificate = acm.import_certificate(
            Certificate=CERTIFICATE.strip(),
            PrivateKey=PRIVATE_KEY.strip(),
        )

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {
                    "Protocol": "ssl",
                    "LoadBalancerPort": 80,
                    "InstancePort": 8080,
                    "SSLCertificateId": certificate["CertificateArn"],
                },
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        from prowler.providers.aws.services.acm.acm_service import ACM
        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.elb_client",
                new=ELB(aws_mocked_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate import (
                elb_ssl_listeners_use_acm_certificate,
            )

            check = elb_ssl_listeners_use_acm_certificate()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELB my-lb has HTTPS/SSL listeners that are using certificates not managed by ACM."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    @mock_aws
    def test_elb_with_HTTPs_listener_ACM_certificate(self):
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)
        acm = client("acm", region_name=AWS_REGION)
        certificate = acm.request_certificate(DomainName="www.example.com")

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {
                    "Protocol": "https",
                    "LoadBalancerPort": 80,
                    "InstancePort": 8080,
                    "SSLCertificateId": certificate["CertificateArn"],
                },
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        from prowler.providers.aws.services.acm.acm_service import ACM
        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.elb_client",
                new=ELB(aws_mocked_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate import (
                elb_ssl_listeners_use_acm_certificate,
            )

            check = elb_ssl_listeners_use_acm_certificate()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ELB my-lb HTTPS/SSL listeners are using certificates managed by ACM."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    @mock_aws
    def test_elb_with_SSL_listener_ACM_certificate(self):
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)
        acm = client("acm", region_name=AWS_REGION)
        certificate = acm.request_certificate(DomainName="www.example.com")

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {
                    "Protocol": "ssl",
                    "LoadBalancerPort": 80,
                    "InstancePort": 8080,
                    "SSLCertificateId": certificate["CertificateArn"],
                },
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        from prowler.providers.aws.services.acm.acm_service import ACM
        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.elb_client",
                new=ELB(aws_mocked_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate import (
                elb_ssl_listeners_use_acm_certificate,
            )

            check = elb_ssl_listeners_use_acm_certificate()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ELB my-lb HTTPS/SSL listeners are using certificates managed by ACM."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    @mock_aws
    def test_elb_with_HTTPS_listener_IAM_certificate(self):
        """Test ELB with HTTPS listener using IAM certificate (not ACM) - should return FAIL"""
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)

        # Create IAM certificate (not ACM)
        iam_certificate_arn = (
            f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:server-certificate/test-certificate"
        )

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {
                    "Protocol": "https",
                    "LoadBalancerPort": 80,
                    "InstancePort": 8080,
                    "SSLCertificateId": iam_certificate_arn,
                },
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        from prowler.providers.aws.services.acm.acm_service import ACM
        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.elb_client",
                new=ELB(aws_mocked_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate import (
                elb_ssl_listeners_use_acm_certificate,
            )

            check = elb_ssl_listeners_use_acm_certificate()

            # This should now work correctly and return FAIL for IAM certificate
            # (unless there's still a KeyError in the current implementation)
            result = check.execute()

            # Expected behavior: FAIL because IAM certificate is not managed by ACM
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELB my-lb has HTTPS/SSL listeners that are using certificates not managed by ACM."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    @mock_aws
    def test_elb_with_HTTPS_listener_certificate_not_in_acm(self):
        """Test ELB with HTTPS listener using certificate that triggers not in acm_client.certificates condition"""
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)

        # Create a certificate ARN that will NOT be in ACM (simulating IAM certificate or any non-ACM certificate)
        # This will trigger the first condition: listener.certificate_arn not in acm_client.certificates
        non_acm_certificate_arn = (
            f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:server-certificate/non-acm-cert"
        )

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {
                    "Protocol": "https",
                    "LoadBalancerPort": 80,
                    "InstancePort": 8080,
                    "SSLCertificateId": non_acm_certificate_arn,
                },
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        from prowler.providers.aws.services.acm.acm_service import ACM
        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_mocked_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_mocked_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.elb_client",
                new=ELB(aws_mocked_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate.acm_client",
                new=ACM(aws_mocked_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_ssl_listeners_use_acm_certificate.elb_ssl_listeners_use_acm_certificate import (
                elb_ssl_listeners_use_acm_certificate,
            )

            check = elb_ssl_listeners_use_acm_certificate()
            result = check.execute()

            # This should trigger the first condition: listener.certificate_arn not in acm_client.certificates
            # and return FAIL without ever reaching the second part of the OR condition
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELB my-lb has HTTPS/SSL listeners that are using certificates not managed by ACM."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
```

--------------------------------------------------------------------------------

---[FILE: elbv2_service_test.py]---
Location: prowler-master/tests/providers/aws/services/elbv2/elbv2_service_test.py

```python
from boto3 import client, resource
from moto import mock_aws

from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2
from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_EU_WEST_1_AZB,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ELBv2_Service:
    # Test ELBv2 Service
    @mock_aws
    def test_service(self):
        # ELBv2 client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        elbv2 = ELBv2(aws_provider)
        assert elbv2.service == "elbv2"

    # Test ELBv2 Client
    @mock_aws
    def test_client(self):
        # ELBv2 client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        elbv2 = ELBv2(aws_provider)
        for regional_client in elbv2.regional_clients.values():
            assert regional_client.__class__.__name__ == "ElasticLoadBalancingv2"

    # Test ELBv2 Session
    @mock_aws
    def test__get_session__(self):
        # ELBv2 client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        elbv2 = ELBv2(aws_provider)
        assert elbv2.session.__class__.__name__ == "Session"

    # Test ELBv2 Describe Load Balancers
    @mock_aws
    def test_describe_load_balancers(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
        )["LoadBalancers"][0]
        # ELBv2 client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        elbv2 = ELBv2(aws_provider)
        assert len(elbv2.loadbalancersv2) == 1
        assert lb["LoadBalancerArn"] in elbv2.loadbalancersv2.keys()
        assert elbv2.loadbalancersv2[lb["LoadBalancerArn"]].name == "my-lb"
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].region == AWS_REGION_EU_WEST_1
        )
        assert elbv2.loadbalancersv2[lb["LoadBalancerArn"]].scheme == "internal"
        assert elbv2.loadbalancersv2[lb["LoadBalancerArn"]].type == "application"
        assert elbv2.loadbalancersv2[lb["LoadBalancerArn"]].listeners == {}
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].dns
            == "my-lb-1.eu-west-1.elb.amazonaws.com"
        )
        assert len(elbv2.loadbalancersv2[lb["LoadBalancerArn"]].availability_zones) == 2
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].availability_zones[
                AWS_REGION_EU_WEST_1_AZA
            ]
            == subnet1.id
        )
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].availability_zones[
                AWS_REGION_EU_WEST_1_AZB
            ]
            == subnet2.id
        )
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].security_groups[0]
            == security_group.id
        )

    # Test ELBv2 Describe Listeners
    @mock_aws
    def test_describe_listeners(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
        )["LoadBalancers"][0]

        listener_arn = conn.create_listener(
            LoadBalancerArn=lb["LoadBalancerArn"],
            Protocol="HTTP",
            Port=443,
            DefaultActions=[
                {
                    "Type": "redirect",
                    "RedirectConfig": {
                        "Protocol": "HTTPS",
                        "Port": "443",
                        "StatusCode": "HTTP_301",
                    },
                }
            ],
        )["Listeners"][0]["ListenerArn"]
        # ELBv2 client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        elbv2 = ELBv2(aws_provider)
        assert len(elbv2.loadbalancersv2[lb["LoadBalancerArn"]].listeners) == 1
        assert listener_arn in elbv2.loadbalancersv2[lb["LoadBalancerArn"]].listeners
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].listeners[listener_arn].region
            == AWS_REGION_EU_WEST_1
        )
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]]
            .listeners[listener_arn]
            .protocol
            == "HTTP"
        )
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].listeners[listener_arn].port
            == 443
        )
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]]
            .listeners[listener_arn]
            .ssl_policy
            == "ELBSecurityPolicy-2016-08"
        )

    # Test ELBv2 Describe Load Balancers Attributes
    @mock_aws
    def test_describe_load_balancer_attributes(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
        )["LoadBalancers"][0]

        conn.modify_load_balancer_attributes(
            LoadBalancerArn=lb["LoadBalancerArn"],
            Attributes=[
                {"Key": "routing.http.desync_mitigation_mode", "Value": "defensive"},
                {"Key": "access_logs.s3.enabled", "Value": "true"},
                {"Key": "load_balancing.cross_zone.enabled", "Value": "true"},
                {"Key": "deletion_protection.enabled", "Value": "true"},
                {
                    "Key": "routing.http.drop_invalid_header_fields.enabled",
                    "Value": "false",
                },
            ],
        )
        # ELBv2 client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        elbv2 = ELBv2(aws_provider)
        assert len(elbv2.loadbalancersv2) == 1
        assert elbv2.loadbalancersv2[lb["LoadBalancerArn"]].arn == lb["LoadBalancerArn"]
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].desync_mitigation_mode
            == "defensive"
        )
        assert elbv2.loadbalancersv2[lb["LoadBalancerArn"]].access_logs == "true"
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].deletion_protection == "true"
        )
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].cross_zone_load_balancing
            == "true"
        )
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].drop_invalid_header_fields
            == "false"
        )

    # Test ELBv2 Describe Load Balancers Attributes
    @mock_aws
    def test_describe_rules(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
        )["LoadBalancers"][0]

        actions = [
            {
                "Type": "redirect",
                "RedirectConfig": {
                    "Protocol": "HTTPS",
                    "Port": "443",
                    "StatusCode": "HTTP_301",
                },
            }
        ]
        listener_arn = conn.create_listener(
            LoadBalancerArn=lb["LoadBalancerArn"],
            Protocol="HTTP",
            Port=80,
            DefaultActions=actions,
        )["Listeners"][0]["ListenerArn"]
        # ELBv2 client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        elbv2 = ELBv2(aws_provider)
        assert len(elbv2.loadbalancersv2) == 1
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]]
            .listeners[listener_arn]
            .rules[0]
            .actions
            == actions
        )

    # Test ELBv2 Describe Tags
    @mock_aws
    def test_describe_tags(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
        )["LoadBalancers"][0]

        conn.add_tags(
            ResourceArns=[lb["LoadBalancerArn"]],
            Tags=[
                {"Key": "Name", "Value": "my-lb"},
                {"Key": "Environment", "Value": "dev"},
            ],
        )

        # ELBv2 client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        elbv2 = ELBv2(aws_provider)

        assert len(elbv2.loadbalancersv2) == 1
        assert len(elbv2.loadbalancersv2[lb["LoadBalancerArn"]].tags) == 2
        assert elbv2.loadbalancersv2[lb["LoadBalancerArn"]].tags[0]["Key"] == "Name"
        assert elbv2.loadbalancersv2[lb["LoadBalancerArn"]].tags[0]["Value"] == "my-lb"
        assert (
            elbv2.loadbalancersv2[lb["LoadBalancerArn"]].tags[1]["Key"] == "Environment"
        )
        assert elbv2.loadbalancersv2[lb["LoadBalancerArn"]].tags[1]["Value"] == "dev"
```

--------------------------------------------------------------------------------

````
