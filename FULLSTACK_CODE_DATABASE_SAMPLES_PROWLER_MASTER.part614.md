---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 614
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 614 of 867)

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

---[FILE: redshift_cluster_public_access_test.py]---
Location: prowler-master/tests/providers/aws/services/redshift/redshift_cluster_public_access/redshift_cluster_public_access_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.redshift.redshift_service import Cluster
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

CLUSTER_ID = str(uuid4())
CLUSTER_ARN = (
    f"arn:aws:redshift:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{CLUSTER_ID}"
)


class Test_redshift_cluster_public_access:
    def test_no_clusters(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        vpc_client = mock.MagicMock
        ec2_client = mock.MagicMock
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.redshift_client",
                    new=redshift_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.vpc_client",
                    new=vpc_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.ec2_client",
                    new=ec2_client,
                ),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access import (
                    redshift_cluster_public_access,
                )

                check = redshift_cluster_public_access()
                result = check.execute()
                assert len(result) == 0

    def test_cluster_with_public_endpoint(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        redshift_client.clusters.append(
            Cluster(
                id=CLUSTER_ID,
                arn=CLUSTER_ARN,
                region=AWS_REGION_EU_WEST_1,
                public_access=True,
                endpoint_address="192.192.192.192",
            )
        )
        vpc_client = mock.MagicMock
        ec2_client = mock.MagicMock
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.redshift_client",
                    new=redshift_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.vpc_client",
                    new=vpc_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.ec2_client",
                    new=ec2_client,
                ),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access import (
                    redshift_cluster_public_access,
                )

                check = redshift_cluster_public_access()
                result = check.execute()
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Redshift Cluster {CLUSTER_ID} has the endpoint 192.192.192.192 set as publicly accessible but is not publicly exposed."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN

    def test_cluster_is_not_public1(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        redshift_client.clusters.append(
            Cluster(
                id=CLUSTER_ID,
                arn=CLUSTER_ARN,
                region=AWS_REGION_EU_WEST_1,
                public_access=False,
                endpoint_address="192.192.192.192",
            )
        )
        vpc_client = mock.MagicMock
        ec2_client = mock.MagicMock
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.redshift_client",
                    new=redshift_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.vpc_client",
                    new=vpc_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.ec2_client",
                    new=ec2_client,
                ),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access import (
                    redshift_cluster_public_access,
                )

                check = redshift_cluster_public_access()
                result = check.execute()
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Redshift Cluster {CLUSTER_ID} is not publicly accessible."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN

    def test_cluster_is_not_public2(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        redshift_client.clusters.append(
            Cluster(
                id=CLUSTER_ID,
                arn=CLUSTER_ARN,
                region=AWS_REGION_EU_WEST_1,
                public_access=True,
            )
        )
        vpc_client = mock.MagicMock
        ec2_client = mock.MagicMock
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.redshift_client",
                    new=redshift_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.vpc_client",
                    new=vpc_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.ec2_client",
                    new=ec2_client,
                ),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access import (
                    redshift_cluster_public_access,
                )

                check = redshift_cluster_public_access()
                result = check.execute()
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Redshift Cluster {CLUSTER_ID} is not publicly accessible."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN

    def test_cluster_is_in_public_subnet(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        redshift_client.clusters.append(
            Cluster(
                id=CLUSTER_ID,
                arn=CLUSTER_ARN,
                region=AWS_REGION_EU_WEST_1,
                public_access=True,
                vpc_id="vpc-123456",
                subnets=["subnet-123456"],
                endpoint_address="192.192.192.192",
            )
        )
        vpc_client = mock.MagicMock
        vpc_client.vpc_subnets = {"subnet-123456": mock.MagicMock(public=True)}
        ec2_client = mock.MagicMock
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.redshift_client",
                    new=redshift_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.vpc_client",
                    new=vpc_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.ec2_client",
                    new=ec2_client,
                ),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access import (
                    redshift_cluster_public_access,
                )

                check = redshift_cluster_public_access()
                result = check.execute()
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Redshift Cluster {CLUSTER_ID} has the endpoint 192.192.192.192 set as publicly accessible in a public subnet but is not publicly exposed."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN

    def test_cluster_with_public_vpc_sgs(self):
        redshift_client = mock.MagicMock
        redshift_client.audited_partition = "aws"
        redshift_client.audited_account = AWS_ACCOUNT_NUMBER
        redshift_client.clusters = []
        redshift_client.clusters.append(
            Cluster(
                id=CLUSTER_ID,
                arn=CLUSTER_ARN,
                region=AWS_REGION_EU_WEST_1,
                vpc_id="vpc-123456",
                public_access=True,
                vpc_security_groups=["sg-123456"],
                endpoint_address="192.192.192.192",
                subnets=["subnet-123456"],
            )
        )
        vpc_client = mock.MagicMock
        vpc_client.vpc_subnets = {"subnet-123456": mock.MagicMock(public=True)}
        ec2_client = mock.MagicMock
        ec2_client.security_groups = {
            f"arn:aws:ec2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:security-group/sg-123456": mock.MagicMock(
                id="sg-123456",
                ingress_rules=[
                    {
                        "IpProtocol": "-1",
                        "IpRanges": [
                            {
                                "CidrIp": "0.0.0.0/0",
                            },
                        ],
                    }
                ],
            )
        }
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.redshift_client",
                    new=redshift_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.vpc_client",
                    new=vpc_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access.ec2_client",
                    new=ec2_client,
                ),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_public_access.redshift_cluster_public_access import (
                    redshift_cluster_public_access,
                )

                check = redshift_cluster_public_access()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Redshift Cluster {CLUSTER_ID} has the endpoint 192.192.192.192 set as publicly accessible and it is exposed to the Internet by security group (sg-123456) in a public subnet."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN
```

--------------------------------------------------------------------------------

---[FILE: resourceexplorer2_service_test.py]---
Location: prowler-master/tests/providers/aws/services/resourceexplorer2/resourceexplorer2_service_test.py

```python
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.resourceexplorer2.resourceexplorer2_service import (
    ResourceExplorer2,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

INDEX_ARN = "arn:aws:resource-explorer-2:ap-south-1:123456789012:index/123456-2896-4fe8-93d2-15ec137e5c47"
INDEX_REGION = "us-east-1"

# Mocking Backup Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    Mock every AWS API call
    """
    if operation_name == "ListIndexes":
        return {
            "Indexes": [
                {"Arn": INDEX_ARN, "Region": INDEX_REGION, "Type": "LOCAL"},
            ]
        }
    return make_api_call(self, operation_name, kwarg)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_ResourceExplorer2_Service:
    def test_get_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        resourceeplorer2 = ResourceExplorer2(aws_provider)
        assert (
            resourceeplorer2.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "ResourceExplorer"
        )

    def test__get_service__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        resourceeplorer2 = ResourceExplorer2(aws_provider)
        assert resourceeplorer2.service == "resource-explorer-2"

    def test_list_indexes(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        resourceeplorer2 = ResourceExplorer2(aws_provider)
        assert len(resourceeplorer2.indexes) == 1
        assert resourceeplorer2.indexes[0].arn == INDEX_ARN
        assert resourceeplorer2.indexes[0].region == INDEX_REGION
        assert resourceeplorer2.indexes[0].type == "LOCAL"
```

--------------------------------------------------------------------------------

---[FILE: resourceexplorer2_indexes_found_test.py]---
Location: prowler-master/tests/providers/aws/services/resourceexplorer2/resourceexplorer2_indexes_found/resourceexplorer2_indexes_found_test.py

```python
from unittest import mock

from prowler.providers.aws.services.resourceexplorer2.resourceexplorer2_service import (
    Indexes,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1

INDEX_ARN = "arn:aws:resource-explorer-2:ap-south-1:123456789012:index/123456-2896-4fe8-93d2-15ec137e5c47"
INDEX_REGION = "us-east-1"


class Test_resourceexplorer2_indexes_found:
    def test_no_indexes_found(self):
        resourceexplorer2_client = mock.MagicMock
        resourceexplorer2_client.indexes = []
        resourceexplorer2_client.audited_account = AWS_ACCOUNT_NUMBER
        resourceexplorer2_client.audited_account_arn = (
            f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        )
        resourceexplorer2_client.audited_partition = "aws"
        resourceexplorer2_client.region = AWS_REGION_US_EAST_1
        resourceexplorer2_client.index_arn_template = f"arn:{resourceexplorer2_client.audited_partition}:resource-explorer:{resourceexplorer2_client.region}:{resourceexplorer2_client.audited_account}:index"
        resourceexplorer2_client.__get_index_arn_template__ = mock.MagicMock(
            return_value=resourceexplorer2_client.index_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.resourceexplorer2.resourceexplorer2_service.ResourceExplorer2",
            new=resourceexplorer2_client,
        ):
            # Test Check
            from prowler.providers.aws.services.resourceexplorer2.resourceexplorer2_indexes_found.resourceexplorer2_indexes_found import (
                resourceexplorer2_indexes_found,
            )

            check = resourceexplorer2_indexes_found()
            result = check.execute()

            # Assertions
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "No Resource Explorer Indexes found."
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:resource-explorer:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:index"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_one_index_found(self):
        resourceexplorer2_client = mock.MagicMock
        resourceexplorer2_client.indexes = [
            Indexes(arn=INDEX_ARN, region=INDEX_REGION, type="LOCAL")
        ]
        resourceexplorer2_client.audited_account = AWS_ACCOUNT_NUMBER
        resourceexplorer2_client.audited_account_arn = (
            f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        )
        resourceexplorer2_client.region = AWS_REGION_US_EAST_1
        resourceexplorer2_client.audited_partition = "aws"
        resourceexplorer2_client.index_arn_template = f"arn:{resourceexplorer2_client.audited_partition}:resource-explorer:{resourceexplorer2_client.region}:{resourceexplorer2_client.audited_account}:index"
        resourceexplorer2_client.__get_index_arn_template__ = mock.MagicMock(
            return_value=resourceexplorer2_client.index_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.resourceexplorer2.resourceexplorer2_service.ResourceExplorer2",
            new=resourceexplorer2_client,
        ):
            # Test Check
            from prowler.providers.aws.services.resourceexplorer2.resourceexplorer2_indexes_found.resourceexplorer2_indexes_found import (
                resourceexplorer2_indexes_found,
            )

            check = resourceexplorer2_indexes_found()
            result = check.execute()

            # Assertions
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "Resource Explorer Indexes found: 1."
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].resource_arn == INDEX_ARN
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_access_denied(self):
        resourceexplorer2_client = mock.MagicMock
        resourceexplorer2_client.indexes = None
        resourceexplorer2_client.audited_account = AWS_ACCOUNT_NUMBER
        resourceexplorer2_client.audited_account_arn = (
            f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        )
        resourceexplorer2_client.audited_partition = "aws"
        resourceexplorer2_client.region = AWS_REGION_US_EAST_1
        resourceexplorer2_client.index_arn_template = f"arn:{resourceexplorer2_client.audited_partition}:resource-explorer:{resourceexplorer2_client.region}:{resourceexplorer2_client.audited_account}:index"
        resourceexplorer2_client.__get_index_arn_template__ = mock.MagicMock(
            return_value=resourceexplorer2_client.index_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.resourceexplorer2.resourceexplorer2_service.ResourceExplorer2",
            new=resourceexplorer2_client,
        ):
            # Test Check
            from prowler.providers.aws.services.resourceexplorer2.resourceexplorer2_indexes_found.resourceexplorer2_indexes_found import (
                resourceexplorer2_indexes_found,
            )

            check = resourceexplorer2_indexes_found()
            result = check.execute()

            # Assertions
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: route53domains_service_test.py]---
Location: prowler-master/tests/providers/aws/services/route53/route53domains_service_test.py

```python
from datetime import datetime
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.route53.route53_service import Route53Domains
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "ListDomains":
        return {
            "Domains": [
                {
                    "DomainName": "test.domain.com",
                    "AutoRenew": True,
                    "TransferLock": True,
                    "Expiry": datetime(2015, 1, 1),
                },
            ],
            "NextPageMarker": "string",
        }
    if operation_name == "ListTagsForDomain":
        return {
            "TagList": [
                {"Key": "test", "Value": "test"},
            ]
        }
    if operation_name == "GetDomainDetail":
        return {
            "DomainName": "test.domain.com",
            "Nameservers": [
                {
                    "Name": "8.8.8.8",
                    "GlueIps": [],
                },
            ],
            "AutoRenew": True,
            "AdminContact": {},
            "RegistrantContact": {},
            "TechContact": {},
            "AdminPrivacy": True,
            "RegistrantPrivacy": True,
            "TechPrivacy": True,
            "RegistrarName": "string",
            "WhoIsServer": "string",
            "RegistrarUrl": "string",
            "AbuseContactEmail": "string",
            "AbuseContactPhone": "string",
            "RegistryDomainId": "string",
            "CreationDate": datetime(2015, 1, 1),
            "UpdatedDate": datetime(2015, 1, 1),
            "ExpirationDate": datetime(2015, 1, 1),
            "Reseller": "string",
            "DnsSec": "string",
            "StatusList": ["clientTransferProhibited"],
        }

    return make_api_call(self, operation_name, kwarg)


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_Route53_Service:

    # Test Route53Domains Client
    def test_get_client(self):
        route53domains = Route53Domains(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert route53domains.client.__class__.__name__ == "Route53Domains"

    # Test Route53Domains Session
    def test__get_session__(self):
        route53domains = Route53Domains(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert route53domains.session.__class__.__name__ == "Session"

    # Test Route53Domains Service
    def test__get_service__(self):
        route53domains = Route53Domains(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert route53domains.service == "route53domains"

    def test_list_domains(self):
        route53domains = Route53Domains(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        domain_name = "test.domain.com"
        assert len(route53domains.domains)
        assert route53domains.domains
        assert route53domains.domains[domain_name]
        assert route53domains.domains[domain_name].name == domain_name
        assert route53domains.domains[domain_name].region == AWS_REGION_US_EAST_1
        assert route53domains.domains[domain_name].admin_privacy
        assert route53domains.domains[domain_name].status_list
        assert len(route53domains.domains[domain_name].status_list) == 1
        assert (
            "clientTransferProhibited"
            in route53domains.domains[domain_name].status_list
        )
        assert route53domains.domains[domain_name].tags == [
            {"Key": "test", "Value": "test"},
        ]
```

--------------------------------------------------------------------------------

---[FILE: route53_service_test.py]---
Location: prowler-master/tests/providers/aws/services/route53/route53_service_test.py

```python
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.route53.route53_service import Route53
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "DescribeDirectories":
        return {}
    if operation_name == "ListTagsForResource":
        return {
            "ResourceTagSet": {
                "ResourceType": "hostedzone",
                "ResourceId": "test",
                "Tags": [
                    {"Key": "test", "Value": "test"},
                ],
            }
        }
    return make_api_call(self, operation_name, kwarg)


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_Route53_Service:

    # Test Route53 Client
    @mock_aws
    def test_get_client(self):
        route53 = Route53(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert route53.client.__class__.__name__ == "Route53"

    # Test Route53 Session
    @mock_aws
    def test__get_session__(self):
        route53 = Route53(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert route53.session.__class__.__name__ == "Session"

    # Test Route53 Service
    @mock_aws
    def test__get_service__(self):
        route53 = Route53(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert route53.service == "route53"

    @mock_aws
    def test_list_hosted_zonesprivate_with_logging(self):
        # Create Hosted Zone
        r53_client = client("route53", region_name=AWS_REGION_US_EAST_1)
        hosted_zone_name = "testdns.aws.com."
        response = r53_client.create_hosted_zone(
            Name=hosted_zone_name,
            CallerReference=str(hash("foo")),
            HostedZoneConfig={"Comment": "", "PrivateZone": True},
        )
        hosted_zone_id = response["HostedZone"]["Id"].replace("/hostedzone/", "")
        hosted_zone_name = response["HostedZone"]["Name"]
        # CloudWatch Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        log_group_name = "test-log-group"
        _ = logs_client.create_log_group(logGroupName=log_group_name)
        log_group_arn = logs_client.describe_log_groups()["logGroups"][0]["arn"]

        # Create Query Logging Config
        response = r53_client.create_query_logging_config(
            HostedZoneId=hosted_zone_id, CloudWatchLogsLogGroupArn=log_group_arn
        )

        # Set partition for the service
        route53 = Route53(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert len(route53.hosted_zones) == 1
        assert route53.hosted_zones[hosted_zone_id]
        assert route53.hosted_zones[hosted_zone_id].id == hosted_zone_id
        assert (
            route53.hosted_zones[hosted_zone_id].arn
            == f"arn:aws:route53:::hostedzone/{hosted_zone_id}"
        )
        assert route53.hosted_zones[hosted_zone_id].name == hosted_zone_name
        assert route53.hosted_zones[hosted_zone_id].private_zone
        assert route53.hosted_zones[hosted_zone_id].logging_config
        assert (
            route53.hosted_zones[hosted_zone_id].logging_config.cloudwatch_log_group_arn
            == log_group_arn
        )
        assert route53.hosted_zones[hosted_zone_id].region == AWS_REGION_US_EAST_1
        assert route53.hosted_zones[hosted_zone_id].tags == [
            {"Key": "test", "Value": "test"},
        ]

    @mock_aws
    def test_list_hosted_zonespublic_with_logging(self):
        # Create Hosted Zone
        r53_client = client("route53", region_name=AWS_REGION_US_EAST_1)
        hosted_zone_name = "testdns.aws.com."
        response = r53_client.create_hosted_zone(
            Name=hosted_zone_name,
            CallerReference=str(hash("foo")),
            HostedZoneConfig={"Comment": "", "PrivateZone": False},
        )
        hosted_zone_id = response["HostedZone"]["Id"].replace("/hostedzone/", "")
        hosted_zone_name = response["HostedZone"]["Name"]
        # CloudWatch Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        log_group_name = "test-log-group"
        _ = logs_client.create_log_group(logGroupName=log_group_name)
        log_group_arn = logs_client.describe_log_groups()["logGroups"][0]["arn"]

        # Create Query Logging Config
        response = r53_client.create_query_logging_config(
            HostedZoneId=hosted_zone_id, CloudWatchLogsLogGroupArn=log_group_arn
        )

        # Set partition for the service
        route53 = Route53(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert len(route53.hosted_zones) == 1
        assert route53.hosted_zones[hosted_zone_id]
        assert route53.hosted_zones[hosted_zone_id].id == hosted_zone_id
        assert (
            route53.hosted_zones[hosted_zone_id].arn
            == f"arn:aws:route53:::hostedzone/{hosted_zone_id}"
        )
        assert route53.hosted_zones[hosted_zone_id].name == hosted_zone_name
        assert not route53.hosted_zones[hosted_zone_id].private_zone
        assert route53.hosted_zones[hosted_zone_id].logging_config
        assert (
            route53.hosted_zones[hosted_zone_id].logging_config.cloudwatch_log_group_arn
            == log_group_arn
        )
        assert route53.hosted_zones[hosted_zone_id].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_list_hosted_zonesprivate_without_logging(self):
        # Create Hosted Zone
        r53_client = client("route53", region_name=AWS_REGION_US_EAST_1)
        hosted_zone_name = "testdns.aws.com."
        response = r53_client.create_hosted_zone(
            Name=hosted_zone_name,
            CallerReference=str(hash("foo")),
            HostedZoneConfig={"Comment": "", "PrivateZone": True},
        )
        hosted_zone_id = response["HostedZone"]["Id"].replace("/hostedzone/", "")
        hosted_zone_name = response["HostedZone"]["Name"]

        # Set partition for the service
        route53 = Route53(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert len(route53.hosted_zones) == 1
        assert route53.hosted_zones[hosted_zone_id]
        assert route53.hosted_zones[hosted_zone_id].id == hosted_zone_id
        assert (
            route53.hosted_zones[hosted_zone_id].arn
            == f"arn:aws:route53:::hostedzone/{hosted_zone_id}"
        )
        assert route53.hosted_zones[hosted_zone_id].name == hosted_zone_name
        assert route53.hosted_zones[hosted_zone_id].private_zone
        assert not route53.hosted_zones[hosted_zone_id].logging_config
        assert route53.hosted_zones[hosted_zone_id].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_list_hosted_zonespublic_without_logging(self):
        # Create Hosted Zone
        r53_client = client("route53", region_name=AWS_REGION_US_EAST_1)
        hosted_zone_name = "testdns.aws.com."
        response = r53_client.create_hosted_zone(
            Name=hosted_zone_name,
            CallerReference=str(hash("foo")),
            HostedZoneConfig={"Comment": "", "PrivateZone": False},
        )
        hosted_zone_id = response["HostedZone"]["Id"].replace("/hostedzone/", "")
        hosted_zone_name = response["HostedZone"]["Name"]

        # Set partition for the service
        route53 = Route53(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert len(route53.hosted_zones) == 1
        assert route53.hosted_zones[hosted_zone_id]
        assert route53.hosted_zones[hosted_zone_id].id == hosted_zone_id
        assert (
            route53.hosted_zones[hosted_zone_id].arn
            == f"arn:aws:route53:::hostedzone/{hosted_zone_id}"
        )
        assert route53.hosted_zones[hosted_zone_id].name == hosted_zone_name
        assert not route53.hosted_zones[hosted_zone_id].private_zone
        assert not route53.hosted_zones[hosted_zone_id].logging_config

        assert route53.hosted_zones[hosted_zone_id].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_list_resource_record_sets(self):
        # Create Hosted Zone
        r53_client = client("route53", region_name=AWS_REGION_US_EAST_1)
        zone = r53_client.create_hosted_zone(
            Name="testdns.aws.com", CallerReference=str(hash("foo"))
        )
        zone_id = zone["HostedZone"]["Id"]

        r53_client.change_resource_record_sets(
            HostedZoneId=zone_id,
            ChangeBatch={
                "Changes": [
                    {
                        "Action": "CREATE",
                        "ResourceRecordSet": {
                            "Name": "foo.bar.testdns.aws.com",
                            "Type": "A",
                            "ResourceRecords": [{"Value": "1.2.3.4"}],
                        },
                    }
                ]
            },
        )

        # Set partition for the service
        route53 = Route53(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert (
            len(route53.record_sets) == 3
        )  # Default NS and SOA records plus the A record just created
        for set in route53.record_sets:
            if set.type == "A":
                assert set.name == "foo.bar.testdns.aws.com."
                assert set.type == "A"
                assert not set.is_alias
                assert set.records == ["1.2.3.4"]
                assert set.hosted_zone_id == zone_id.replace("/hostedzone/", "")
                assert set.region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

````
