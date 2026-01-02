---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 613
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 613 of 867)

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

---[FILE: redshift_cluster_encrypted_at_rest_test.py]---
Location: prowler-master/tests/providers/aws/services/redshift/redshift_cluster_encrypted_at_rest/redshift_cluster_encrypted_at_rest_test.py

```python
from unittest import mock
from uuid import uuid4

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

CLUSTER_ID = str(uuid4())
CLUSTER_ARN = (
    f"arn:aws:redshift:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{CLUSTER_ID}"
)


class Test_redshift_cluster_encrypted:
    def test_no_clusters(self):
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_encrypted_at_rest.redshift_cluster_encrypted_at_rest.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_encrypted_at_rest.redshift_cluster_encrypted_at_rest import (
                    redshift_cluster_encrypted_at_rest,
                )

                check = redshift_cluster_encrypted_at_rest()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_cluster_not_encrypted(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=CLUSTER_ID,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="user",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            Port=9439,
            Encrypted=False,
        )
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_encrypted_at_rest.redshift_cluster_encrypted_at_rest.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_encrypted_at_rest.redshift_cluster_encrypted_at_rest import (
                    redshift_cluster_encrypted_at_rest,
                )

                check = redshift_cluster_encrypted_at_rest()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].status_extended == (
                    f"Redshift Cluster {CLUSTER_ID} is not encrypted at rest."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN
                assert result[0].region == AWS_REGION_EU_WEST_1
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]

    @mock_aws
    def test_cluster_encrypted(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=CLUSTER_ID,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="user",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            Port=9439,
            Encrypted=True,
        )
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_encrypted_at_rest.redshift_cluster_encrypted_at_rest.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_encrypted_at_rest.redshift_cluster_encrypted_at_rest import (
                    redshift_cluster_encrypted_at_rest,
                )

                check = redshift_cluster_encrypted_at_rest()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].status_extended == (
                    f"Redshift Cluster {CLUSTER_ID} is encrypted at rest."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN
                assert result[0].region == AWS_REGION_EU_WEST_1
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_enhanced_vpc_routing_test.py]---
Location: prowler-master/tests/providers/aws/services/redshift/redshift_cluster_enhanced_vpc_routing/redshift_cluster_enhanced_vpc_routing_test.py

```python
from unittest import mock
from uuid import uuid4

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

CLUSTER_ID = str(uuid4())
CLUSTER_ARN = (
    f"arn:aws:redshift:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{CLUSTER_ID}"
)


class Test_redshift_cluster_enhanced_vpc_routing:
    def test_no_clusters(self):
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_enhanced_vpc_routing.redshift_cluster_enhanced_vpc_routing.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_enhanced_vpc_routing.redshift_cluster_enhanced_vpc_routing import (
                    redshift_cluster_enhanced_vpc_routing,
                )

                check = redshift_cluster_enhanced_vpc_routing()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_cluster_not_enhanced_vpc_routing_enabled(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=CLUSTER_ID,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="user",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            Port=9439,
            Encrypted=False,
            EnhancedVpcRouting=False,
        )
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_enhanced_vpc_routing.redshift_cluster_enhanced_vpc_routing.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_enhanced_vpc_routing.redshift_cluster_enhanced_vpc_routing import (
                    redshift_cluster_enhanced_vpc_routing,
                )

                check = redshift_cluster_enhanced_vpc_routing()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].status_extended == (
                    f"Redshift Cluster {CLUSTER_ID} does not have Enhanced VPC Routing security feature enabled."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN
                assert result[0].region == AWS_REGION_EU_WEST_1
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]

    @mock_aws
    def test_cluster_enhanced_vpc_routing_enabled(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=CLUSTER_ID,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="user",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            Port=9439,
            Encrypted=True,
            EnhancedVpcRouting=True,
        )
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_enhanced_vpc_routing.redshift_cluster_enhanced_vpc_routing.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_enhanced_vpc_routing.redshift_cluster_enhanced_vpc_routing import (
                    redshift_cluster_enhanced_vpc_routing,
                )

                check = redshift_cluster_enhanced_vpc_routing()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].status_extended == (
                    f"Redshift Cluster {CLUSTER_ID} has Enhanced VPC Routing security feature enabled."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN
                assert result[0].region == AWS_REGION_EU_WEST_1
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_in_transit_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/redshift/redshift_cluster_in_transit_encryption_enabled/redshift_cluster_in_transit_encryption_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

CLUSTER_ID = str(uuid4())
CLUSTER_ARN = (
    f"arn:aws:redshift:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{CLUSTER_ID}"
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeClusterParameters":
        return {
            "Parameters": [
                {
                    "ParameterName": "require_ssl",
                    "ParameterValue": "true",
                    "Description": "Require SSL for connections",
                    "Source": "user",
                    "DataType": "boolean",
                    "AllowedValues": "true, false",
                    "IsModifiable": True,
                    "MinimumEngineVersion": "1.0",
                },
            ]
        }

    return make_api_call(self, operation_name, kwarg)


class Test_redshift_cluster_in_transit_encryption_enabled:
    def test_no_clusters(self):
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_in_transit_encryption_enabled.redshift_cluster_in_transit_encryption_enabled.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_in_transit_encryption_enabled.redshift_cluster_in_transit_encryption_enabled import (
                    redshift_cluster_in_transit_encryption_enabled,
                )

                check = redshift_cluster_in_transit_encryption_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_cluster_not_encrypted_in_transit(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=CLUSTER_ID,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="awsuser",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            Port=9439,
            Encrypted=False,
        )
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_in_transit_encryption_enabled.redshift_cluster_in_transit_encryption_enabled.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_in_transit_encryption_enabled.redshift_cluster_in_transit_encryption_enabled import (
                    redshift_cluster_in_transit_encryption_enabled,
                )

                check = redshift_cluster_in_transit_encryption_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].status_extended == (
                    f"Redshift Cluster {CLUSTER_ID} is not encrypted in transit."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN
                assert result[0].region == AWS_REGION_EU_WEST_1
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]

    @mock_aws
    def test_cluster_encrypted_in_transit(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call", new=mock_make_api_call
        ):
            redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
            redshift_client.create_cluster(
                DBName="test",
                ClusterIdentifier=CLUSTER_ID,
                ClusterType="single-node",
                NodeType="ds2.xlarge",
                MasterUsername="user",
                MasterUserPassword="password",
                PubliclyAccessible=True,
                Tags=[
                    {"Key": "test", "Value": "test"},
                ],
                Port=9439,
                Encrypted=True,
            )
            from prowler.providers.aws.services.redshift.redshift_service import (
                Redshift,
            )

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ):
                with mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_in_transit_encryption_enabled.redshift_cluster_in_transit_encryption_enabled.redshift_client",
                    new=Redshift(aws_provider),
                ):
                    from prowler.providers.aws.services.redshift.redshift_cluster_in_transit_encryption_enabled.redshift_cluster_in_transit_encryption_enabled import (
                        redshift_cluster_in_transit_encryption_enabled,
                    )

                    check = redshift_cluster_in_transit_encryption_enabled()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "PASS"
                    assert result[0].status_extended == (
                        f"Redshift Cluster {CLUSTER_ID} is encrypted in transit."
                    )
                    assert result[0].resource_id == CLUSTER_ID
                    assert result[0].resource_arn == CLUSTER_ARN
                    assert result[0].region == AWS_REGION_EU_WEST_1
                    assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_multi_az_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/redshift/redshift_cluster_multi_az_enabled/redshift_cluster_multi_az_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

CLUSTER_ID = str(uuid4())
CLUSTER_ARN = (
    f"arn:aws:redshift:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{CLUSTER_ID}"
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeClusterParameters":
        return {
            "Parameters": [
                {
                    "ParameterName": "require_ssl",
                    "ParameterValue": "true",
                    "Description": "Require SSL for connections",
                    "Source": "user",
                    "DataType": "boolean",
                    "AllowedValues": "true, false",
                    "IsModifiable": True,
                    "MinimumEngineVersion": "1.0",
                },
            ]
        }

    return make_api_call(self, operation_name, kwarg)


class Test_redshift_cluster_multi_az_enabled:
    def test_no_clusters(self):
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_multi_az_enabled.redshift_cluster_multi_az_enabled.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_multi_az_enabled.redshift_cluster_multi_az_enabled import (
                    redshift_cluster_multi_az_enabled,
                )

                check = redshift_cluster_multi_az_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_cluster_multi_az_disabled(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=CLUSTER_ID,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="awsuser",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            Port=9439,
            Encrypted=False,
            MultiAZ=False,
        )
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_multi_az_enabled.redshift_cluster_multi_az_enabled.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_multi_az_enabled.redshift_cluster_multi_az_enabled import (
                    redshift_cluster_multi_az_enabled,
                )

                check = redshift_cluster_multi_az_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].status_extended == (
                    f"Redshift Cluster {CLUSTER_ID} does not have Multi-AZ enabled."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN
                assert result[0].region == AWS_REGION_EU_WEST_1
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]

    @mock_aws
    def test_cluster_multi_az_enabled(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call", new=mock_make_api_call
        ):
            redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
            redshift_client.create_cluster(
                DBName="test",
                ClusterIdentifier=CLUSTER_ID,
                ClusterType="single-node",
                NodeType="ds2.xlarge",
                MasterUsername="user",
                MasterUserPassword="password",
                PubliclyAccessible=True,
                Tags=[
                    {"Key": "test", "Value": "test"},
                ],
                Port=9439,
                Encrypted=True,
                MultiAZ=True,
            )
            from prowler.providers.aws.services.redshift.redshift_service import (
                Redshift,
            )

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ):
                with mock.patch(
                    "prowler.providers.aws.services.redshift.redshift_cluster_multi_az_enabled.redshift_cluster_multi_az_enabled.redshift_client",
                    new=Redshift(aws_provider),
                ) as service_client:
                    from prowler.providers.aws.services.redshift.redshift_cluster_multi_az_enabled.redshift_cluster_multi_az_enabled import (
                        redshift_cluster_multi_az_enabled,
                    )

                    # Moto does not pass the multi_az parameter back.
                    service_client.clusters[0].multi_az = "Enabled"
                    check = redshift_cluster_multi_az_enabled()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "PASS"
                    assert result[0].status_extended == (
                        f"Redshift Cluster {CLUSTER_ID} has Multi-AZ enabled."
                    )
                    assert result[0].resource_id == CLUSTER_ID
                    assert result[0].resource_arn == CLUSTER_ARN
                    assert result[0].region == AWS_REGION_EU_WEST_1
                    assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_non_default_database_name_test.py]---
Location: prowler-master/tests/providers/aws/services/redshift/redshift_cluster_non_default_database_name/redshift_cluster_non_default_database_name_test.py

```python
from unittest import mock
from uuid import uuid4

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

CLUSTER_ID = str(uuid4())
CLUSTER_ARN = (
    f"arn:aws:redshift:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{CLUSTER_ID}"
)


class Test_redshift_cluster_non_default_database_name:
    def test_no_clusters(self):
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_non_default_database_name.redshift_cluster_non_default_database_name.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_non_default_database_name.redshift_cluster_non_default_database_name import (
                    redshift_cluster_non_default_database_name,
                )

                check = redshift_cluster_non_default_database_name()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_cluster_default_database_name(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        redshift_client.create_cluster(
            DBName="dev",
            ClusterIdentifier=CLUSTER_ID,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="awsuser",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            Port=9439,
            Encrypted=False,
        )
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_non_default_database_name.redshift_cluster_non_default_database_name.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_non_default_database_name.redshift_cluster_non_default_database_name import (
                    redshift_cluster_non_default_database_name,
                )

                check = redshift_cluster_non_default_database_name()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].status_extended == (
                    f"Redshift Cluster {CLUSTER_ID} has the default database name: dev."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN
                assert result[0].region == AWS_REGION_EU_WEST_1
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]

    @mock_aws
    def test_cluster_non_default_database_name(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=CLUSTER_ID,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="user",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            Port=9439,
            Encrypted=True,
        )
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_non_default_database_name.redshift_cluster_non_default_database_name.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_non_default_database_name.redshift_cluster_non_default_database_name import (
                    redshift_cluster_non_default_database_name,
                )

                check = redshift_cluster_non_default_database_name()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].status_extended == (
                    f"Redshift Cluster {CLUSTER_ID} does not have the default database name."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN
                assert result[0].region == AWS_REGION_EU_WEST_1
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_non_default_username_test.py]---
Location: prowler-master/tests/providers/aws/services/redshift/redshift_cluster_non_default_username/redshift_cluster_non_default_username_test.py

```python
from unittest import mock
from uuid import uuid4

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

CLUSTER_ID = str(uuid4())
CLUSTER_ARN = (
    f"arn:aws:redshift:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{CLUSTER_ID}"
)


class Test_redshift_cluster_non_default_username:
    def test_no_clusters(self):
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_non_default_username.redshift_cluster_non_default_username.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_non_default_username.redshift_cluster_non_default_username import (
                    redshift_cluster_non_default_username,
                )

                check = redshift_cluster_non_default_username()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_cluster_default_username(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=CLUSTER_ID,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="awsuser",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            Port=9439,
            Encrypted=False,
        )
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_non_default_username.redshift_cluster_non_default_username.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_non_default_username.redshift_cluster_non_default_username import (
                    redshift_cluster_non_default_username,
                )

                check = redshift_cluster_non_default_username()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].status_extended == (
                    f"Redshift Cluster {CLUSTER_ID} has the default Admin username."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN
                assert result[0].region == AWS_REGION_EU_WEST_1
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]

    @mock_aws
    def test_cluster_non_default_username(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=CLUSTER_ID,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="user",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            Port=9439,
            Encrypted=True,
        )
        from prowler.providers.aws.services.redshift.redshift_service import Redshift

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.redshift.redshift_cluster_non_default_username.redshift_cluster_non_default_username.redshift_client",
                new=Redshift(aws_provider),
            ):
                from prowler.providers.aws.services.redshift.redshift_cluster_non_default_username.redshift_cluster_non_default_username import (
                    redshift_cluster_non_default_username,
                )

                check = redshift_cluster_non_default_username()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].status_extended == (
                    f"Redshift Cluster {CLUSTER_ID} does not have the default Admin username."
                )
                assert result[0].resource_id == CLUSTER_ID
                assert result[0].resource_arn == CLUSTER_ARN
                assert result[0].region == AWS_REGION_EU_WEST_1
                assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]
```

--------------------------------------------------------------------------------

````
