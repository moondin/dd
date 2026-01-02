---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 539
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 539 of 867)

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

---[FILE: security_groups_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/lib/security_groups_test.py

```python
import pytest

from prowler.providers.aws.services.ec2.lib.security_groups import (
    _is_cidr_public,
    check_security_group,
)

TRANSPORT_PROTOCOL_TCP = "tcp"
TRANSPORT_PROTOCOL_UDP = "udp"
TRANSPORT_PROTOCOL_ALL = "-1"

IP_V4_ALL_CIDRS = "0.0.0.0/0"
IP_V4_PUBLIC_CIDR = "84.28.12.2/32"
IP_V4_PRIVATE_CIDR = "10.1.0.0/16"

IP_V6_ALL_CIDRS = "::/0"
IP_V6_PUBLIC_CIDR = "cafe:cafe:cafe:cafe::/64"
IP_V6_PRIVATE_CIDR = "fc00::/7"


class Test_is_cidr_public:
    def test__is_cidr_public_Public_IPv4_all_IPs_any_address_false(self):
        cidr = IP_V4_ALL_CIDRS
        assert _is_cidr_public(cidr)

    def test__is_cidr_public_Public_IPv4__all_IPs_any_address_true(self):
        cidr = IP_V4_ALL_CIDRS
        assert _is_cidr_public(cidr, any_address=True)

    def test__is_cidr_public_Public_IPv4_any_address_false(self):
        cidr = IP_V4_PUBLIC_CIDR
        assert _is_cidr_public(cidr)

    def test__is_cidr_public_Public_IPv4_any_address_true(self):
        cidr = IP_V4_PUBLIC_CIDR
        assert not _is_cidr_public(cidr, any_address=True)

    def test__is_cidr_public_Private_IPv4(self):
        cidr = "10.0.0.0/8"
        assert not _is_cidr_public(cidr, any_address=True)

    def test__is_cidr_public_Private_IPv4_any_address_true(self):
        cidr = "10.0.0.0/8"
        assert not _is_cidr_public(cidr)

    def test__is_cidr_public_Bad_Private_IPv4(self):
        cidr = "10.0.0.0/0"
        with pytest.raises(ValueError) as ex:
            _is_cidr_public(cidr)

        assert ex.type == ValueError
        assert ex.match(f"{cidr} has host bits set")

    def test__is_cidr_public_Public_IPv6_all_IPs_any_address_false(self):
        cidr = IP_V6_ALL_CIDRS
        assert _is_cidr_public(cidr)

    def test__is_cidr_public_Public_IPv6_all_IPs_any_adress_true(self):
        cidr = IP_V6_ALL_CIDRS
        assert _is_cidr_public(cidr, any_address=True)

    def test__is_cidr_public_Public_IPv6(self):
        cidr = IP_V6_PUBLIC_CIDR
        assert _is_cidr_public(cidr)

    def test__is_cidr_public_Public_IPv6_any_adress_true(self):
        cidr = IP_V6_PUBLIC_CIDR
        assert not _is_cidr_public(cidr, any_address=True)

    def test__is_cidr_public_Private_IPv6(self):
        cidr = IP_V6_PRIVATE_CIDR
        assert not _is_cidr_public(cidr)

    def test__is_cidr_public_Private_IPv6_any_adress_true(self):
        cidr = IP_V6_PRIVATE_CIDR
        assert not _is_cidr_public(cidr, any_address=True)


class Test_check_security_group:
    def generate_ip_ranges_list(self, input_ip_ranges: [str], v4=True):
        cidr_ranges = "CidrIp" if v4 else "CidrIpv6"
        return [{cidr_ranges: ip, "Description": ""} for ip in input_ip_ranges]

    def ingress_rule_generator(
        self,
        from_port: int,
        to_port: int,
        ip_protocol: str,
        input_ipv4_ranges: [str],
        input_ipv6_ranges: [str],
    ):
        """
        ingress_rule_generator returns the following AWS Security Group IpPermissions Ingress Rule based on the input arguments
        {
            'FromPort': 123,
            'IpProtocol': 'string',
            'IpRanges': [
                {
                    'CidrIp': 'string',
                    'Description': 'string'
                },
            ],
            'Ipv6Ranges': [
                {
                    'CidrIpv6': 'string',
                    'Description': 'string'
                },
            ],
            'ToPort': 123,
        }
        """
        ipv4_ranges = self.generate_ip_ranges_list(input_ipv4_ranges)
        ipv6_ranges = self.generate_ip_ranges_list(input_ipv6_ranges, v4=False)

        ingress_rule = {
            "FromPort": from_port,
            "ToPort": to_port,
            "IpProtocol": ip_protocol,
            "IpRanges": ipv4_ranges,
            "Ipv6Ranges": ipv6_ranges,
        }
        return ingress_rule

    # TCP Protocol - IP_V4_ALL_CIDRS - Ingress 22 to 22 - check 22 - Any Address - Open
    def test_all_public_ipv4_address_open_22_tcp_any_address(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [IP_V4_ALL_CIDRS], []
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True)

    # TCP Protocol - IP_v4_PUBLIC_CIDR - Ingress 22 to 22 - check 22 - Open
    def test_public_ipv4_address_open_22_tcp(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [IP_V4_PUBLIC_CIDR], []
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], False)

    # TCP Protocol - IP_v4_PUBLIC_CIDR - Ingress 22 to 22 - check 22 - Any Address - Closed
    def test_public_ipv4_address_open_22_tcp_any_address(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [IP_V4_PUBLIC_CIDR], []
        )
        assert not check_security_group(
            ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True
        )

    # TCP Protocol - IP_V4_PRIVATE_CIDR - Ingress 22 to 22 - check 22 - Any Address - Closed
    def test_private_ipv4_address_open_22_tcp_any_address(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [IP_V4_PRIVATE_CIDR], []
        )
        assert not check_security_group(
            ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], False
        )

    # TCP Protocol - IP_V4_PRIVATE_CIDR - Ingress 22 to 22 - check 22 - Closed
    def test_private_ipv4_address_open_22_tcp(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [IP_V4_PRIVATE_CIDR], []
        )
        assert not check_security_group(
            ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], False
        )

    # TCP Protocol - IP_V6_ALL_CIDRS - Ingress 22 to 22 - check 22 - Any Address - Open
    def test_all_public_ipv6_address_open_22_tcp_any_address(self):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [], [IP_V6_ALL_CIDRS]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True)

    # TCP Protocol - IP_V6_ALL_CIDRS - Ingress 22 to 22 - check 22 - Open
    def test_all_public_ipv6_address_open_22_tcp(self):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [], [IP_V6_ALL_CIDRS]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], False)

    # TCP Protocol - IP_V6_ALL_CIDRS - Ingress 22 to 22 - check 22 - Open
    def test_public_ipv6_address_open_22_tcp(self):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [], [IP_V6_PUBLIC_CIDR]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], False)

    # TCP Protocol - IP_V6_ALL_CIDRS - Ingress 22 to 22 - check 22 - Any Address - Closed
    def test_public_ipv6_address_open_22_tcp_any_address(self):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [], [IP_V6_PUBLIC_CIDR]
        )
        assert not check_security_group(
            ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True
        )

    # TCP Protocol - IP_V6_PRIVATE_CIDR - Ingress 22 to 22 - check 22 - Any Address - Closed
    def test_all_private_ipv6_address_open_22_tcp_any_address(self):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [], [IP_V6_PRIVATE_CIDR]
        )
        assert not check_security_group(
            ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True
        )

    # TCP Protocol - IP_V6_PRIVATE_CIDR - Ingress 22 to 22 - check 22 - Closed
    def test_all_private_ipv6_address_open_22_tcp(self):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [], [IP_V6_PRIVATE_CIDR]
        )
        assert not check_security_group(
            ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True
        )

    # TCP Protocol - IP_V4_PRIVATE_CIDR + IP_V6_ALL_CIDRS - Ingress 22 to 22 - check 22 - Any Address - Open
    def test_private_ipv4_all_public_ipv6_address_open_22_tcp_any_address(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [IP_V4_PRIVATE_CIDR], [IP_V6_ALL_CIDRS]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True)

    # TCP Protocol - IP_V4_PRIVATE_CIDR + IP_V6_ALL_CIDRS - Ingress 22 to 22 - check 22 - Open
    def test_private_ipv4_all_public_ipv6_address_open_22_tcp(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [IP_V4_PRIVATE_CIDR], [IP_V6_ALL_CIDRS]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True)

    # TCP Protocol - IP_V4_ALL_CIDRS + IP_V6_PRIVATE_CIDR - Ingress 22 to 22 - check 22 - Any Address - Open
    def test_all_public_ipv4_private_ipv6_address_open_22_tcp_any_address(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [IP_V4_ALL_CIDRS], [IP_V6_PRIVATE_CIDR]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True)

    # TCP Protocol - IP_V4_ALL_CIDRS + IP_V6_PRIVATE_CIDR - Ingress 22 to 22 - check 22 - Open
    def test_all_public_ipv4_private_ipv6_address_open_22_tcp(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_TCP, [IP_V4_ALL_CIDRS], [IP_V6_PRIVATE_CIDR]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], False)

    # ALL (-1) Protocol - IP_V4_ALL_CIDRS - Ingress 22 to 22 - check 22 - Any Address - Open
    def test_all_public_ipv4_address_open_22_any_protocol_any_address(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_ALL, [IP_V4_ALL_CIDRS], []
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True)

    # ALL (-1) Protocol - IP_V4_PUBLIC_CIDR - Ingress 22 to 22 - check 22 - Closed
    def test_all_public_ipv4_address_open_22_any_protocol(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_ALL, [IP_V4_PUBLIC_CIDR], []
        )
        assert not check_security_group(
            ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True
        )

    # ALL (-1) Protocol - IP_V6_ALL_CIDRS - Ingress 22 to 22 - check 22 - Open
    def test_all_public_ipv6_address_open_22_any_protocol_any_address(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_ALL, [], [IP_V6_ALL_CIDRS]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True)

    # ALL (-1) Protocol - IP_V4_PRIVATE_CIDR + IP_V6_ALL_CIDRS - Ingress 22 to 22 - check 22 - Open
    def test_private_ipv4_all_public_ipv6_address_open_22_any_protocol_any_address(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_ALL, [IP_V4_PRIVATE_CIDR], [IP_V6_ALL_CIDRS]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True)

    # ALL (-1) Protocol - IP_V4_ALL_CIDRS + IP_V6_PRIVATE_CIDR - Ingress 22 to 22 - check 22 - Any Address - Open
    def test_all_public_ipv4_private_ipv6_address_open_22_any_protocol_any_address(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_ALL, [IP_V4_ALL_CIDRS], [IP_V6_PRIVATE_CIDR]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [port], True)

    # TCP Protocol - IP_V4_ALL_CIDRS - Ingress 21 to 23 - check 22 - Any Address - Any Address - Open
    def test_all_public_ipv4_address_open_21_to_23_check_22_tcp_any_address(
        self,
    ):
        ingress_rule = self.ingress_rule_generator(
            21, 23, TRANSPORT_PROTOCOL_TCP, [IP_V4_ALL_CIDRS], []
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_TCP, [22], True)

    # TCP Protocol - IP_V4_ALL_CIDRS - All Ports - check None - Any Address - Open
    def test_all_public_ipv4_address_open_all_ports_check_all_tcp_any_address(
        self,
    ):
        ingress_rule = self.ingress_rule_generator(
            0, 65535, TRANSPORT_PROTOCOL_TCP, [IP_V4_ALL_CIDRS], []
        )
        assert check_security_group(
            ingress_rule, TRANSPORT_PROTOCOL_TCP, any_address=True
        )

    # TCP Protocol - IP_V6_ALL_CIDRS - All Ports - check None - Any Address - Open
    def test_all_public_ipv6_address_open_all_ports_check_all_tcp_any_address(
        self,
    ):
        ingress_rule = self.ingress_rule_generator(
            0, 65535, TRANSPORT_PROTOCOL_TCP, [], [IP_V6_ALL_CIDRS]
        )
        assert check_security_group(
            ingress_rule, TRANSPORT_PROTOCOL_TCP, any_address=True
        )

    # ALL (-1) Protocol - IP_V4_ALL_CIDRS - Any Port - check None - Any Address - Open
    def test_all_public_ipv4_address_open_any_port_check_none_any_address(
        self,
    ):
        ingress_rule = self.ingress_rule_generator(
            0, 65535, TRANSPORT_PROTOCOL_ALL, [IP_V4_ALL_CIDRS], []
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_ALL, None, True)

    # UDP Protocol - IP_V4_ALL_CIDRS - Any Port - check None - Any Address - Open
    def test_all_public_ipv4_address_open_any_port_check_none_any_address_udp(
        self,
    ):
        ingress_rule = self.ingress_rule_generator(
            0, 65535, TRANSPORT_PROTOCOL_UDP, [IP_V4_ALL_CIDRS], []
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_UDP, None, True)

    # UDP Protocol - IP_V4_ALL_CIDRS - Any Port - check TCP - Any Address - Open
    def test_all_public_ipv4_address_open_any_port_udp_protocol_check_tcp_any_address(
        self,
    ):
        ingress_rule = self.ingress_rule_generator(
            0, 65535, TRANSPORT_PROTOCOL_UDP, [IP_V4_ALL_CIDRS], []
        )
        assert not check_security_group(
            ingress_rule, TRANSPORT_PROTOCOL_TCP, None, True
        )

    # ALL (-1) Protocol - IP_V6_ALL_CIDRS - Any Port - check None - Any Address - Open
    def test_all_public_ipv6_address_open_any_port_check_none_any_address(
        self,
    ):
        ingress_rule = self.ingress_rule_generator(
            0, 65535, TRANSPORT_PROTOCOL_ALL, [], [IP_V6_ALL_CIDRS]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_ALL, None, True)

    # ALL (-1) Protocol - IP_V4_ALL_CIDRS - Any Port - check None - Any Address - Open
    def test_all_public_ipv4_address_open_22_port_check_none_any_address(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_ALL, [IP_V4_ALL_CIDRS], []
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_ALL, None, True)

    # ALL (-1) Protocol - IP_V6_ALL_CIDRS - Any Port - check None - Any Address - Open
    def test_all_public_ipv6_address_open_22_port_check_none_any_address(
        self,
    ):
        port = 22
        ingress_rule = self.ingress_rule_generator(
            port, port, TRANSPORT_PROTOCOL_ALL, [], [IP_V6_ALL_CIDRS]
        )
        assert check_security_group(ingress_rule, TRANSPORT_PROTOCOL_ALL, None, True)
```

--------------------------------------------------------------------------------

---[FILE: ecr_service_test.py]---
Location: prowler-master/tests/providers/aws/services/ecr/ecr_service_test.py

```python
from datetime import datetime
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.ecr.ecr_service import ECR, ScanningRule
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

repo_arn = f"arn:aws:ecr:eu-west-1:{AWS_ACCOUNT_NUMBER}:repository/test-repo"
repo_name = "test-repo"

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeImages":
        return {
            "imageDetails": [
                # Scannable image #1
                {
                    "imageDigest": "sha256:d8868e50ac4c7104d2200d42f432b661b2da8c1e417ccfae217e6a1e04bb9295",
                    "imageTags": [
                        "test-tag1",
                    ],
                    "imagePushedAt": datetime(2023, 1, 1),
                    "imageScanStatus": {
                        "status": "COMPLETE",
                    },
                    "imageScanFindingsSummary": {
                        "findingSeverityCounts": {"CRITICAL": 1, "HIGH": 2, "MEDIUM": 3}
                    },
                    "artifactMediaType": "application/vnd.docker.container.image.v1+json",
                },
                # Scannable image #2
                {
                    "imageDigest": "sha256:83251ac64627fc331584f6c498b3aba5badc01574e2c70b2499af3af16630eed",
                    "imageTags": [
                        "test-tag2",
                    ],
                    "imagePushedAt": datetime(2023, 1, 2),
                    "imageScanStatus": {
                        "status": "COMPLETE",
                    },
                    "imageScanFindingsSummary": {
                        "findingSeverityCounts": {"CRITICAL": 1, "HIGH": 2, "MEDIUM": 3}
                    },
                    "artifactMediaType": "application/vnd.docker.container.image.v1+json",
                },
                # Not scannable image
                {
                    "imageDigest": "sha256:83251ac64627fc331584f6c498b3aba5badc01574e2c70b2499af3af16630eed",
                    "imageTags": [
                        "sha256-abcdefg123456.sig",
                    ],
                    "imagePushedAt": datetime(2023, 1, 2),
                    "artifactMediaType": "application/vnd.docker.container.image.v1+json",
                },
                # Scannable image #3
                {
                    "imageDigest": "sha256:33251ac64627fc331584f6c498b3aba5badc01574e2c70b2499af3af16630eed",
                    "imageTags": [
                        "test-tag3",
                    ],
                    "imagePushedAt": datetime(2023, 1, 2),
                    "imageScanFindings": {
                        "findingSeverityCounts": {"CRITICAL": 1, "HIGH": 2, "MEDIUM": 3}
                    },
                    "artifactMediaType": "application/vnd.docker.container.image.v1+json",
                },
                # Not scannable image
                {
                    "imageDigest": "sha256:83251ac64627fc331584f6c498b3aba5badc01574e2c70b2499af3af16630eed",
                    "imageTags": [
                        "sha256-83251ac64627fc331584f6c498b3aba5badc01574e2c70b2499af3af16630eed.sig",
                    ],
                    "imagePushedAt": datetime(2023, 1, 2),
                    "imageScanStatus": {
                        "status": "FAILED",
                    },
                    "artifactMediaType": "application/vnd.oci.image.config.v1+json",
                },
                # Not scannable image
                {
                    "imageDigest": "sha256:83251ac64627fc331584f6c498b3aba5badc01574e2c70b2499af3af16630eed",
                    "imageTags": [
                        "test-tag2",
                    ],
                    "imagePushedAt": datetime(2023, 1, 2),
                    "imageScanStatus": {
                        "status": "FAILED",
                    },
                    "artifactMediaType": "application/vnd.cncf.notary.v2.signature",
                },
                # Scannable image #4
                {
                    "imageDigest": "sha256:43251ac64627fc331584f6c498b3aba5badc01574e2c70b2499af3af16630eed",
                    "imageTags": [
                        "test-tag4",
                    ],
                    "imagePushedAt": datetime(2023, 1, 2),
                    "imageScanStatus": {
                        "status": "FAILED",
                    },
                    "artifactMediaType": "application/vnd.docker.container.image.v1+json",
                },
            ],
        }
    if operation_name == "GetRepositoryPolicy":
        return {
            "registryId": "string",
            "repositoryName": "string",
            "policyText": '{\n  "Version" : "2012-10-17",\n  "Statement" : [ {\n    "Sid" : "Allow Describe Images",\n    "Effect" : "Allow",\n    "Principal" : {\n      "AWS" : [ "arn:aws:iam::123456789012:root" ]\n    },\n    "Action" : [ "ecr:DescribeImages", "ecr:DescribeRepositories" ]\n  } ]\n}',
        }
    if operation_name == "GetLifecyclePolicy":
        return {
            "registryId": "string",
            "repositoryName": "string",
            "lifecyclePolicyText": "test-policy",
        }
    if operation_name == "GetRegistryScanningConfiguration":
        return {
            "registryId": AWS_ACCOUNT_NUMBER,
            "scanningConfiguration": {
                "scanType": "BASIC",
                "rules": [
                    {
                        "scanFrequency": "SCAN_ON_PUSH",
                        "repositoryFilters": [
                            {"filter": "*", "filterType": "WILDCARD"},
                        ],
                    },
                ],
            },
        }

    if operation_name == "DescribeImageScanFindings":
        return {
            "imageScanStatus": {
                "status": "COMPLETE",
            },
            "imageScanFindings": {
                "findingSeverityCounts": {"CRITICAL": 3, "HIGH": 4, "MEDIUM": 5}
            },
        }

    return make_api_call(self, operation_name, kwarg)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_ECR_Service:
    # Test ECR Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        ecr = ECR(aws_provider)
        assert ecr.service == "ecr"

    # Test ECR client
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        ecr = ECR(aws_provider)
        for regional_client in ecr.regional_clients.values():
            assert regional_client.__class__.__name__ == "ECR"

    # Test ECR session
    def test_get_session(self):
        aws_provider = set_mocked_aws_provider()
        ecr = ECR(aws_provider)
        assert ecr.session.__class__.__name__ == "Session"

    # Test describe ECR repositories
    @mock_aws
    def test_describe_registries_and_repositories(self):
        ecr_client = client("ecr", region_name=AWS_REGION_EU_WEST_1)
        ecr_client.create_repository(
            repositoryName=repo_name,
            imageScanningConfiguration={"scanOnPush": True},
            tags=[
                {"Key": "test", "Value": "test"},
            ],
        )
        aws_provider = set_mocked_aws_provider()
        ecr = ECR(aws_provider)

        assert len(ecr.registries) == 1
        assert ecr.registries[AWS_REGION_EU_WEST_1].id == AWS_ACCOUNT_NUMBER
        assert (
            ecr.registries[AWS_REGION_EU_WEST_1].arn
            == f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}"
        )
        assert ecr.registries[AWS_REGION_EU_WEST_1].region == AWS_REGION_EU_WEST_1
        assert len(ecr.registries[AWS_REGION_EU_WEST_1].repositories) == 1

        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].name == repo_name
        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].arn == repo_arn
        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].scan_on_push
        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].tags == [
            {"Key": "test", "Value": "test"},
        ]

    # Test describe ECR repository policies
    @mock_aws
    def test_describe_repository_policies(self):
        ecr_client = client("ecr", region_name=AWS_REGION_EU_WEST_1)
        ecr_client.create_repository(
            repositoryName=repo_name,
            imageScanningConfiguration={"scanOnPush": True},
            imageTagMutability="IMMUTABLE",
        )
        aws_provider = set_mocked_aws_provider()
        ecr = ECR(aws_provider)
        assert len(ecr.registries) == 1
        assert len(ecr.registries[AWS_REGION_EU_WEST_1].repositories) == 1

        repository = ecr.registries[AWS_REGION_EU_WEST_1].repositories[0]
        assert repository.name == repo_name
        assert repository.arn == repo_arn
        assert repository.scan_on_push
        assert repository.policy["Statement"][0]["Sid"] == "Allow Describe Images"
        assert repository.policy["Statement"][0]["Effect"] == "Allow"
        assert (
            repository.policy["Statement"][0]["Principal"]["AWS"][0]
            == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        )
        assert repository.policy["Statement"][0]["Action"][0] == "ecr:DescribeImages"
        assert (
            repository.policy["Statement"][0]["Action"][1] == "ecr:DescribeRepositories"
        )

    # Test describe ECR repository lifecycle policies
    @mock_aws
    def test_get_lifecycle_policies(self):
        ecr_client = client("ecr", region_name=AWS_REGION_EU_WEST_1)
        ecr_client.create_repository(
            repositoryName=repo_name,
            imageScanningConfiguration={"scanOnPush": True},
            imageTagMutability="IMMUTABLE",
        )
        aws_provider = set_mocked_aws_provider()
        ecr = ECR(aws_provider)
        assert len(ecr.registries) == 1
        assert len(ecr.registries[AWS_REGION_EU_WEST_1].repositories) == 1
        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].name == repo_name
        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].arn == repo_arn
        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].scan_on_push
        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].lifecycle_policy
        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].immutability

    # Test get image details
    @mock_aws
    def test_get_image_details(self):
        ecr_client = client("ecr", region_name=AWS_REGION_EU_WEST_1)
        ecr_client.create_repository(
            repositoryName=repo_name,
            imageScanningConfiguration={"scanOnPush": True},
        )
        aws_provider = set_mocked_aws_provider()
        ecr = ECR(aws_provider)

        assert len(ecr.registries) == 1
        assert len(ecr.registries[AWS_REGION_EU_WEST_1].repositories) == 1
        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].name == repo_name
        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].arn == repo_arn
        assert ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].scan_on_push
        assert (
            len(ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].images_details)
            == 4
        )
        # First image pushed
        first_image = (
            ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].images_details[0]
        )
        assert first_image.image_pushed_at == datetime(2023, 1, 1)
        assert first_image.latest_tag == "test-tag1"
        assert (
            ecr.registries[AWS_REGION_EU_WEST_1]
            .repositories[0]
            .images_details[0]
            .latest_digest
            == "sha256:d8868e50ac4c7104d2200d42f432b661b2da8c1e417ccfae217e6a1e04bb9295"
        )
        assert first_image.scan_findings_status == "COMPLETE"
        assert first_image.scan_findings_severity_count.critical == 1
        assert first_image.scan_findings_severity_count.high == 2
        assert first_image.scan_findings_severity_count.medium == 3
        assert (
            first_image.artifact_media_type
            == "application/vnd.docker.container.image.v1+json"
        )

        # Second image pushed
        second_image = (
            ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].images_details[1]
        )
        assert second_image.image_pushed_at == datetime(2023, 1, 2)
        assert second_image.latest_tag == "test-tag2"
        assert (
            second_image.latest_digest
            == "sha256:83251ac64627fc331584f6c498b3aba5badc01574e2c70b2499af3af16630eed"
        )
        assert second_image.scan_findings_status == "COMPLETE"
        assert second_image.scan_findings_severity_count.critical == 1
        assert second_image.scan_findings_severity_count.high == 2
        assert second_image.scan_findings_severity_count.medium == 3
        assert (
            second_image.artifact_media_type
            == "application/vnd.docker.container.image.v1+json"
        )

        # Third image pushed
        third_image = (
            ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].images_details[2]
        )
        assert third_image.image_pushed_at == datetime(2023, 1, 2)
        assert third_image.latest_tag == "test-tag3"
        assert (
            third_image.latest_digest
            == "sha256:33251ac64627fc331584f6c498b3aba5badc01574e2c70b2499af3af16630eed"
        )
        assert third_image.scan_findings_status == "COMPLETE"
        assert third_image.scan_findings_severity_count.critical == 3
        assert third_image.scan_findings_severity_count.high == 4
        assert third_image.scan_findings_severity_count.medium == 5
        assert (
            third_image.artifact_media_type
            == "application/vnd.docker.container.image.v1+json"
        )

        # Fourth image pushed
        fourth_image = (
            ecr.registries[AWS_REGION_EU_WEST_1].repositories[0].images_details[3]
        )
        assert fourth_image.image_pushed_at == datetime(2023, 1, 2)
        assert fourth_image.latest_tag == "test-tag4"
        assert (
            fourth_image.latest_digest
            == "sha256:43251ac64627fc331584f6c498b3aba5badc01574e2c70b2499af3af16630eed"
        )

        assert fourth_image.scan_findings_status == "FAILED"
        assert fourth_image.scan_findings_severity_count is None
        assert (
            fourth_image.artifact_media_type
            == "application/vnd.docker.container.image.v1+json"
        )

    # Test get ECR Registries Scanning Configuration
    @mock_aws
    def test_get_registry_scanning_configuration(self):
        aws_provider = set_mocked_aws_provider()
        ecr = ECR(aws_provider)
        assert len(ecr.registries) == 1
        assert ecr.registries[AWS_REGION_EU_WEST_1].id == AWS_ACCOUNT_NUMBER
        assert ecr.registries[AWS_REGION_EU_WEST_1].scan_type == "BASIC"
        assert ecr.registries[AWS_REGION_EU_WEST_1].rules == [
            ScanningRule(
                scan_frequency="SCAN_ON_PUSH",
                scan_filters=[{"filter": "*", "filterType": "WILDCARD"}],
            )
        ]

    def test_is_artifact_scannable_docker(self):
        assert ECR._is_artifact_scannable(
            "application/vnd.docker.container.image.v1+json"
        )

    def test_is_artifact_scannable_layer_tar(self):
        assert ECR._is_artifact_scannable(
            "application/vnd.docker.image.rootfs.diff.tar"
        )

    def test_is_artifact_scannable_layer_gzip(self):
        assert ECR._is_artifact_scannable(
            "application/vnd.docker.image.rootfs.diff.tar.gzip"
        )

    def test_is_artifact_scannable_oci(self):
        assert ECR._is_artifact_scannable("application/vnd.oci.image.config.v1+json")

    def test_is_artifact_scannable_oci_tar(self):
        assert ECR._is_artifact_scannable("application/vnd.oci.image.layer.v1.tar")

    def test_is_artifact_scannable_oci_compressed(self):
        assert ECR._is_artifact_scannable("application/vnd.oci.image.layer.v1.tar+gzip")

    def test_is_artifact_scannable_none(self):
        assert not ECR._is_artifact_scannable(None)

    def test_is_artifact_scannable_empty(self):
        assert not ECR._is_artifact_scannable("")

    def test_is_artifact_scannable_non_scannable_tags(self):
        assert not ECR._is_artifact_scannable("", ["sha256-abcdefg123456.sig"])

    def test_is_artifact_scannable_scannable_tags(self):
        assert ECR._is_artifact_scannable(
            "application/vnd.docker.container.image.v1+json", ["abcdefg123456"]
        )
```

--------------------------------------------------------------------------------

````
