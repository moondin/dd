---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 618
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 618 of 867)

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

---[FILE: s3_bucket_cross_account_access_test.py]---
Location: prowler-master/tests/providers/aws/services/s3/s3_bucket_cross_account_access/s3_bucket_cross_account_access_test.py

```python
import json
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_s3_bucket_cross_account_access:
    @mock_aws
    def test_no_buckets(self):
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_account_access.s3_bucket_cross_account_access.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_account_access.s3_bucket_cross_account_access import (
                    s3_bucket_cross_account_access,
                )

                check = s3_bucket_cross_account_access()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_bucket_no_policy(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client.create_bucket(Bucket=bucket_name_us)

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_account_access.s3_bucket_cross_account_access.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_account_access.s3_bucket_cross_account_access import (
                    s3_bucket_cross_account_access,
                )

                check = s3_bucket_cross_account_access()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} does not have a bucket policy."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_policy_allow_delete(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        delete_bucket_policy = "s3:DeleteBucketPolicy"
        bucket_name_us = "bucket_test_us"
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": "*"},
                    "Action": delete_bucket_policy,
                    "Resource": "arn:aws:s3:::*",
                }
            ],
        }
        s3_client.create_bucket(Bucket=bucket_name_us)
        s3_client.put_bucket_policy(
            Bucket=bucket_name_us,
            Policy=json.dumps(policy),
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_account_access.s3_bucket_cross_account_access.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_account_access.s3_bucket_cross_account_access import (
                    s3_bucket_cross_account_access,
                )

                check = s3_bucket_cross_account_access()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} has a bucket policy allowing cross account access."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_policy_allow_multiple_other_accounts(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        put_encryption_configuration = "s3:PutEncryptionConfiguration"
        put_bucket_policy = "s3:PutBucketPolicy"
        bucket_name_us = "bucket_test_us"
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": "arn:aws:iam::*:root"},
                    "Action": [
                        put_encryption_configuration,
                        put_bucket_policy,
                    ],
                    "Resource": "arn:aws:s3:::*",
                }
            ],
        }
        s3_client.create_bucket(Bucket=bucket_name_us)
        s3_client.put_bucket_policy(
            Bucket=bucket_name_us,
            Policy=json.dumps(policy),
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_account_access.s3_bucket_cross_account_access.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_account_access.s3_bucket_cross_account_access import (
                    s3_bucket_cross_account_access,
                )

                check = s3_bucket_cross_account_access()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} has a bucket policy allowing cross account access."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_policy_allow_same_account(self):
        s3_client = client("s3", region_name=AWS_REGION_US_EAST_1)
        delete_bucket_policy = "s3:DeleteBucketPolicy"
        bucket_name_us = "bucket_test_us"
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"},
                    "Action": delete_bucket_policy,
                    "Resource": "arn:aws:s3:::*",
                }
            ],
        }
        s3_client.create_bucket(Bucket=bucket_name_us)
        s3_client.put_bucket_policy(
            Bucket=bucket_name_us,
            Policy=json.dumps(policy),
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_account_access.s3_bucket_cross_account_access.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_account_access.s3_bucket_cross_account_access import (
                    s3_bucket_cross_account_access,
                )

                check = s3_bucket_cross_account_access()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} has a bucket policy but it does not allow cross account access."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_cross_region_replication_test.py]---
Location: prowler-master/tests/providers/aws/services/s3/s3_bucket_cross_region_replication/s3_bucket_cross_region_replication_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_s3_bucket_cross_region_replication:
    # No Buckets
    @mock_aws
    def test_no_buckets(self):
        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication import (
                    s3_bucket_cross_region_replication,
                )

                check = s3_bucket_cross_region_replication()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_bucket_no_versioning(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication import (
                    s3_bucket_cross_region_replication,
                )

                check = s3_bucket_cross_region_replication()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} does not have correct cross region replication configuration."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_no_replication(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_us, ObjectOwnership="BucketOwnerEnforced"
        )
        s3_client_us_east_1.put_bucket_versioning(
            Bucket=bucket_name_us,
            VersioningConfiguration={"Status": "Enabled"},
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication import (
                    s3_bucket_cross_region_replication,
                )

                check = s3_bucket_cross_region_replication()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} does not have correct cross region replication configuration."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_versioning_enabled_replication_disabled(self):
        # EU-WEST-1 Destination Bucket
        s3_client_eu_west_1 = client("s3", region_name=AWS_REGION_EU_WEST_1)
        bucket_name_eu = "bucket_test_eu"
        s3_client_eu_west_1.create_bucket(
            Bucket=bucket_name_eu,
            ObjectOwnership="BucketOwnerEnforced",
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION_EU_WEST_1},
        )
        s3_client_eu_west_1.put_bucket_versioning(
            Bucket=bucket_name_eu,
            VersioningConfiguration={"Status": "Enabled"},
        )
        # US-EAST-1 Source Bucket
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_us, ObjectOwnership="BucketOwnerEnforced"
        )
        s3_client_us_east_1.put_bucket_versioning(
            Bucket=bucket_name_us,
            VersioningConfiguration={"Status": "Enabled"},
        )
        s3_client_us_east_1.put_bucket_replication(
            Bucket=bucket_name_us,
            ReplicationConfiguration={
                "Role": "arn:aws:iam",
                "Rules": [
                    {
                        "ID": "rule1",
                        "Status": "Disabled",
                        "Prefix": "",
                        "Destination": {
                            "Bucket": "arn:aws:s3:::bucket_test_eu",
                            "Account": "",
                        },
                    }
                ],
            },
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication import (
                    s3_bucket_cross_region_replication,
                )

                check = s3_bucket_cross_region_replication()
                result = check.execute()

                assert len(result) == 2

                # EU-WEST-1 Destination Bucket
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_eu} does not have correct cross region replication configuration."
                )
                assert result[0].resource_id == bucket_name_eu
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_eu}"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

                # US-EAST-1 Source Bucket
                assert result[1].status == "FAIL"
                assert (
                    result[1].status_extended
                    == f"S3 Bucket {bucket_name_us} does not have correct cross region replication configuration."
                )
                assert result[1].resource_id == bucket_name_us
                assert (
                    result[1].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[1].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_versioning_enabled_replication_enabled(self):
        # EU-WEST-1 Destination Bucket
        s3_client_eu_west_1 = client("s3", region_name=AWS_REGION_EU_WEST_1)
        bucket_name_eu = "bucket_test_eu"
        arn_bucket_eu = f"arn:aws:s3:::{bucket_name_eu}"
        s3_client_eu_west_1.create_bucket(
            Bucket=bucket_name_eu,
            ObjectOwnership="BucketOwnerEnforced",
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION_EU_WEST_1},
        )
        s3_client_eu_west_1.put_bucket_versioning(
            Bucket=bucket_name_eu,
            VersioningConfiguration={"Status": "Enabled"},
        )
        # US-EAST-1 Source Bucket
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_us, ObjectOwnership="BucketOwnerEnforced"
        )
        s3_client_us_east_1.put_bucket_versioning(
            Bucket=bucket_name_us,
            VersioningConfiguration={"Status": "Enabled"},
        )
        repl_rule_id = "rule1"
        s3_client_us_east_1.put_bucket_replication(
            Bucket=bucket_name_us,
            ReplicationConfiguration={
                "Role": "arn:aws:iam",
                "Rules": [
                    {
                        "ID": repl_rule_id,
                        "Status": "Enabled",
                        "Prefix": "",
                        "Destination": {
                            "Bucket": arn_bucket_eu,
                            "Account": "",
                        },
                    }
                ],
            },
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication import (
                    s3_bucket_cross_region_replication,
                )

                check = s3_bucket_cross_region_replication()
                result = check.execute()

                assert len(result) == 2

                # EU-WEST-1 Destination Bucket
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_eu} does not have correct cross region replication configuration."
                )
                assert result[0].resource_id == bucket_name_eu
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_eu}"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

                # US-EAST-1 Source Bucket
                assert result[1].status == "PASS"
                assert (
                    result[1].status_extended
                    == f"S3 Bucket {bucket_name_us} has cross region replication rule {repl_rule_id} in bucket {bucket_name_eu} located in region {AWS_REGION_EU_WEST_1}."
                )
                assert result[1].resource_id == bucket_name_us
                assert (
                    result[1].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[1].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_buckets_in_same_region(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        # US-EAST-1 Destination Bucket
        bucket_name_destination = "bucket_test_destination"
        bucket_arn_destination = f"arn:aws:s3:::{bucket_name_destination}"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_destination, ObjectOwnership="BucketOwnerEnforced"
        )
        s3_client_us_east_1.put_bucket_versioning(
            Bucket=bucket_name_destination,
            VersioningConfiguration={"Status": "Enabled"},
        )
        # US-EAST-1 Source Bucket
        bucket_name_source = "bucket_test_source"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_source, ObjectOwnership="BucketOwnerEnforced"
        )
        s3_client_us_east_1.put_bucket_versioning(
            Bucket=bucket_name_source,
            VersioningConfiguration={"Status": "Enabled"},
        )
        repl_rule_id = "rule1"
        s3_client_us_east_1.put_bucket_replication(
            Bucket=bucket_name_source,
            ReplicationConfiguration={
                "Role": "arn:aws:iam",
                "Rules": [
                    {
                        "ID": repl_rule_id,
                        "Status": "Enabled",
                        "Prefix": "",
                        "Destination": {
                            "Bucket": bucket_arn_destination,
                            "Account": "",
                        },
                    }
                ],
            },
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication import (
                    s3_bucket_cross_region_replication,
                )

                check = s3_bucket_cross_region_replication()
                result = check.execute()

                assert len(result) == 2

                # EU-WEST-1 Destination Bucket
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_destination} does not have correct cross region replication configuration."
                )
                assert result[0].resource_id == bucket_name_destination
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_destination}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

                # US-EAST-1 Source Bucket
                assert result[1].status == "FAIL"
                assert (
                    result[1].status_extended
                    == f"S3 Bucket {bucket_name_source} has cross region replication rule {repl_rule_id} in bucket {bucket_name_destination} located in the same region."
                )
                assert result[1].resource_id == bucket_name_source
                assert (
                    result[1].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_source}"
                )
                assert result[1].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_source_bucket_several_replcation_rules(self):
        # EU-WEST-1 Destination Bucket
        s3_client_eu_west_1 = client("s3", region_name=AWS_REGION_EU_WEST_1)
        bucket_name_eu = "bucket_test_eu"
        arn_bucket_eu = f"arn:aws:s3:::{bucket_name_eu}"
        s3_client_eu_west_1.create_bucket(
            Bucket=bucket_name_eu,
            ObjectOwnership="BucketOwnerEnforced",
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION_EU_WEST_1},
        )
        s3_client_eu_west_1.put_bucket_versioning(
            Bucket=bucket_name_eu,
            VersioningConfiguration={"Status": "Enabled"},
        )

        # US-EAST-1 Destination Bucket
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us_destination = "bucket_test_us_destination"
        arn_bucket_us_destination = f"arn:aws:s3:::{bucket_name_us_destination}"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_us_destination, ObjectOwnership="BucketOwnerEnforced"
        )
        s3_client_us_east_1.put_bucket_versioning(
            Bucket=bucket_name_us_destination,
            VersioningConfiguration={"Status": "Enabled"},
        )

        # US-EAST-1 Source Bucket
        bucket_name_us_source = "bucket_test_us_source"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_us_source, ObjectOwnership="BucketOwnerEnforced"
        )
        s3_client_us_east_1.put_bucket_versioning(
            Bucket=bucket_name_us_source,
            VersioningConfiguration={"Status": "Enabled"},
        )
        repl_rule_id_1 = "rule1"
        repl_rule_id_2 = "rule2"
        s3_client_us_east_1.put_bucket_replication(
            Bucket=bucket_name_us_source,
            ReplicationConfiguration={
                "Role": "arn:aws:iam",
                "Rules": [
                    {
                        "ID": repl_rule_id_1,
                        "Status": "Enabled",
                        "Prefix": "",
                        "Destination": {
                            "Bucket": arn_bucket_eu,
                            "Account": "",
                        },
                    },
                    {
                        "ID": repl_rule_id_2,
                        "Status": "Enabled",
                        "Prefix": "",
                        "Destination": {
                            "Bucket": arn_bucket_us_destination,
                            "Account": "",
                        },
                    },
                ],
            },
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication import (
                    s3_bucket_cross_region_replication,
                )

                check = s3_bucket_cross_region_replication()
                result = check.execute()

                assert len(result) == 3

                # EU-WEST-1 Destination Bucket
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_eu} does not have correct cross region replication configuration."
                )
                assert result[0].resource_id == bucket_name_eu
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_eu}"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

                # US-EAST-1 Destination Bucket
                assert result[1].status == "FAIL"
                assert (
                    result[1].status_extended
                    == f"S3 Bucket {bucket_name_us_destination} does not have correct cross region replication configuration."
                )
                assert result[1].resource_id == bucket_name_us_destination
                assert (
                    result[1].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us_destination}"
                )
                assert result[1].region == AWS_REGION_US_EAST_1

                # US-EAST-1 Source Bucket
                assert result[2].status == "PASS"
                assert (
                    result[2].status_extended
                    == f"S3 Bucket {bucket_name_us_source} has cross region replication rule {repl_rule_id_1} in bucket {bucket_name_eu} located in region {AWS_REGION_EU_WEST_1}."
                )
                assert result[2].resource_id == bucket_name_us_source
                assert (
                    result[2].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us_source}"
                )
                assert result[2].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_destination_bucket_out_of_scope(self):
        # EU-WEST-1 Destination Bucket
        s3_client_eu_west_1 = client("s3", region_name=AWS_REGION_EU_WEST_1)
        bucket_name_eu = "bucket_test_eu"
        arn_bucket_eu = f"arn:aws:s3:::{bucket_name_eu}"
        s3_client_eu_west_1.create_bucket(
            Bucket=bucket_name_eu,
            ObjectOwnership="BucketOwnerEnforced",
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION_EU_WEST_1},
        )
        s3_client_eu_west_1.put_bucket_versioning(
            Bucket=bucket_name_eu,
            VersioningConfiguration={"Status": "Enabled"},
        )

        # US-EAST-1 Source Bucket
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us_source"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_us, ObjectOwnership="BucketOwnerEnforced"
        )
        s3_client_us_east_1.put_bucket_versioning(
            Bucket=bucket_name_us,
            VersioningConfiguration={"Status": "Enabled"},
        )
        repl_rule_id = "rule1"
        s3_client_us_east_1.put_bucket_replication(
            Bucket=bucket_name_us,
            ReplicationConfiguration={
                "Role": "arn:aws:iam",
                "Rules": [
                    {
                        "ID": repl_rule_id,
                        "Status": "Enabled",
                        "Prefix": "",
                        "Destination": {
                            "Bucket": arn_bucket_eu,
                            "Account": "",
                        },
                    },
                ],
            },
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_cross_region_replication.s3_bucket_cross_region_replication import (
                    s3_bucket_cross_region_replication,
                )

                check = s3_bucket_cross_region_replication()
                result = check.execute()

                assert len(result) == 1

                # US-EAST-1 Source Bucket
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} has cross region replication rule {repl_rule_id} in bucket {arn_bucket_eu.split(':')[-1]} which is out of Prowler's scope."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_default_encryption_test.py]---
Location: prowler-master/tests/providers/aws/services/s3/s3_bucket_default_encryption/s3_bucket_default_encryption_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_s3_bucket_default_encryption:
    @mock_aws
    def test_bucket_no_encryption(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(Bucket=bucket_name_us)

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_default_encryption.s3_bucket_default_encryption.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_default_encryption.s3_bucket_default_encryption import (
                    s3_bucket_default_encryption,
                )

                check = s3_bucket_default_encryption()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} does not have Server Side Encryption enabled."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bucket_kms_encryption(self):
        s3_client_us_east_1 = client("s3", region_name=AWS_REGION_US_EAST_1)
        bucket_name_us = "bucket_test_us"
        s3_client_us_east_1.create_bucket(
            Bucket=bucket_name_us, ObjectOwnership="BucketOwnerEnforced"
        )
        sse_config = {
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "aws:kms",
                        "KMSMasterKeyID": "12345678",
                    }
                }
            ]
        }

        s3_client_us_east_1.put_bucket_encryption(
            Bucket=bucket_name_us, ServerSideEncryptionConfiguration=sse_config
        )

        from prowler.providers.aws.services.s3.s3_service import S3

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.s3.s3_bucket_default_encryption.s3_bucket_default_encryption.s3_client",
                new=S3(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.s3.s3_bucket_default_encryption.s3_bucket_default_encryption import (
                    s3_bucket_default_encryption,
                )

                check = s3_bucket_default_encryption()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"S3 Bucket {bucket_name_us} has Server Side Encryption with aws:kms."
                )
                assert result[0].resource_id == bucket_name_us
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:s3:::{bucket_name_us}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

````
